import { useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useUpdateProject } from "@/features/projects/client";
import {
  UpdateProjectFormSchema,
  UpdateProjectRequestSchema,
  projectFormToUpdateRequest,
} from "@/features/projects/schema/project";
import type { IProject, ProjectFormInput } from "@/features/projects/schema/project";
import type { ProjectGalleryRequest } from "@/features/projects/schema/project";
import { useProjectImages } from "@/features/projects/hooks/use-project-images";
import { changedFields } from "@/shared/lib/changed-fields";

export function useUpdateProjectController(projectId: string, initialProject: IProject) {
  const router = useRouter();
  const updateProject = useUpdateProject();
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const initCourses = initialProject.courses.map(({ id }) => ({ value: id }));
  const initTypes = initialProject.projectTypes.map(({ id }) => ({ value: id }));
  const initCategories = initialProject.categories.map(({ id }) => ({ value: id }));
  const initTechStacks = initialProject.techStacks.map(({ name }) => ({ value: name }));
  const initStudents = initialProject.members.filter(({ memberType }) => memberType === "STUDENT").map(({ user, position }) => ({ userID: user.id, position: position ?? "" }));
  const initAdvisors = initialProject.members.filter(({ memberType }) => memberType === "ADVISOR").map(({ user, position }) => ({ userID: user.id, position: position ?? "" }));
  const initCoAdvisors = initialProject.members.filter(({ memberType }) => memberType === "CO_ADVISOR").map(({ user, position }) => ({ userID: user.id, position: position ?? "" }));
  const defaultValues: ProjectFormInput = {
    title: initialProject.title,
    detail: initialProject.detail ?? "",
    youtubeURL: initialProject.youtubeURL,
    githubURL: initialProject.githubURL,
    documentURL: initialProject.documentURL,
    presentationURL: initialProject.presentationURL,
    figmaURL: initialProject.figmaURL ?? "",
    projectCourses: initCourses.length > 0 ? initCourses : [{ value: 0 }],
    projectTypes: initTypes.length > 0 ? initTypes : [{ value: 0 }],
    projectCategories: initCategories.length > 0 ? initCategories : [{ value: 0 }],
    projectFields: initialProject.fields.map(({ id }) => ({ value: id })),
    techStacks: initTechStacks.length > 0 ? initTechStacks : [{ value: "" }],
    students: initStudents.length > 0 ? initStudents : [{ userID: 0, position: "" }],
    advisors: initAdvisors.length > 0 ? initAdvisors : [{ userID: 0, position: "" }],
    coAdvisors: initCoAdvisors,
  };
  const form = useForm<ProjectFormInput>({
    resolver: zodResolver(UpdateProjectFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const projectImages = useProjectImages(form.setValue, initialProject.images);
  const projectCourses = useFieldArray({ control: form.control, name: "projectCourses" });
  const projectTypes = useFieldArray({ control: form.control, name: "projectTypes" });
  const projectCategories = useFieldArray({ control: form.control, name: "projectCategories" });
  const projectFields = useFieldArray({ control: form.control, name: "projectFields" });
  const techStacks = useFieldArray({ control: form.control, name: "techStacks" });
  const students = useFieldArray({ control: form.control, name: "students" });
  const advisors = useFieldArray({ control: form.control, name: "advisors" });
  const coAdvisors = useFieldArray({ control: form.control, name: "coAdvisors" });

  const cancelForm = () => {
    if (form.formState.isDirty || projectImages.selectedFile || projectImages.hasGalleryChanges) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          form.reset();
          projectImages.setSelectedFile(null);
          projectImages.resetGallery();
          setIsEditMode(false);
        },
      });
    } else {
      setIsEditMode(false);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormInput> = async (data) => {
    try {
      const gallery = projectImages.galleryRequest();
      if (gallery.gallery.length === 0) {
        projectImages.setAssetsError(true);
        return;
      }
      const originalGallery: ProjectGalleryRequest = {
        gallery: initialProject.images.map(({ imageID }) => ({ imageID })),
        assets: [],
      };
      const request = UpdateProjectRequestSchema.parse(
        changedFields(
          projectFormToUpdateRequest(data, gallery),
          projectFormToUpdateRequest(defaultValues, originalGallery),
        ),
      );
      const files = {
        thumbnailFile: projectImages.selectedFile,
        assets: gallery.assets.length > 0 ? gallery.assets : undefined,
      };
      if (
        Object.keys(request).length === 0 &&
        !files.thumbnailFile &&
        !files.assets?.length
      ) return;
      await updateProject.mutateAsync({
        id: projectId,
        payload: request,
        files,
      });
      setConfirmModal({
        isOpen: true,
        title: "สำเร็จ",
        description: "อัปเดตข้อมูลโครงงานสำเร็จแล้ว",
        type: "success",
        confirmText: "ตกลง",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          router.push("/admin/projects");
        },
      });
    } catch (error) {
      console.error(error);
      setErrorMsg("ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      setIsError(true);
    }
  };

  return {
    ...projectImages,
    form,
    control: form.control,
    handleSubmit: form.handleSubmit,
    reset: form.reset,
    isDirty: form.formState.isDirty,
    projectCoursesFields: projectCourses.fields,
    appendProjectCourses: projectCourses.append,
    removeProjectCourses: projectCourses.remove,
    projectTypesFields: projectTypes.fields,
    appendProjectTypes: projectTypes.append,
    removeProjectTypes: projectTypes.remove,
    projectCategoriesFields: projectCategories.fields,
    appendProjectCategories: projectCategories.append,
    removeProjectCategories: projectCategories.remove,
    projectFieldsFields: projectFields.fields,
    appendProjectFields: projectFields.append,
    removeProjectFields: projectFields.remove,
    techStacksFields: techStacks.fields,
    appendTechStacks: techStacks.append,
    removeTechStacks: techStacks.remove,
    studentsFields: students.fields,
    appendStudents: students.append,
    removeStudents: students.remove,
    advisorsFields: advisors.fields,
    appendAdvisors: advisors.append,
    removeAdvisors: advisors.remove,
    coAdvisorsFields: coAdvisors.fields,
    appendCoAdvisors: coAdvisors.append,
    removeCoAdvisors: coAdvisors.remove,
    errorMsg,
    isError,
    setIsError,
    confirmModal,
    isEditMode,
    setIsEditMode,
    previewImageUrl,
    setPreviewImageUrl,
    cancelForm,
    onSubmit,
    isPending: updateProject.isPending,
  };
}
