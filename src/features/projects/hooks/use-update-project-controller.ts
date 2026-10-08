import { useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useUpdateProject } from "@/features/projects/client";
import {
  UpdateProjectFormSchema,
  projectFormToUpdateRequest,
} from "@/features/projects/schema/project";
import type { IProject, ProjectFormInput } from "@/features/projects/schema/project";
import { useProjectImages } from "@/features/projects/hooks/use-project-images";

export function useUpdateProjectController(projectId: string, initialProject: IProject) {
  const router = useRouter();
  const updateProject = useUpdateProject();
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const initCourses = initialProject.course.map(({ id }) => ({ value: id }));
  const initTypes = initialProject.tag.filter(({ tagsGroupsId }) => tagsGroupsId === 1).map(({ id }) => ({ value: id }));
  const initCategories = initialProject.tag.filter(({ tagsGroupsId }) => tagsGroupsId === 3).map(({ id }) => ({ value: id }));
  const initTechStacks = initialProject.techStacks.map((value) => ({ value }));
  const initStudents = initialProject.member.filter(({ role }) => role.id === 2).map(({ id }) => ({ userID: id }));
  const initAdvisors = initialProject.member.filter(({ role }) => role.id === 3).map(({ id }) => ({ userID: id }));
  const form = useForm<ProjectFormInput>({
    resolver: zodResolver(UpdateProjectFormSchema),
    defaultValues: {
      title: initialProject.title,
      details: initialProject.details,
      youtubeURL: initialProject.youtubeURL,
      githubURL: initialProject.githubURL,
      documentURL: initialProject.documentURL,
      presentationURL: initialProject.presentationURL,
      projectCourses: initCourses.length > 0 ? initCourses : [{ value: 0 }],
      projectTypes: initTypes.length > 0 ? initTypes : [{ value: 0 }],
      projectCategories: initCategories.length > 0 ? initCategories : [{ value: 0 }],
      techStacks: initTechStacks.length > 0 ? initTechStacks : [{ value: "" }],
      students: initStudents.length > 0 ? initStudents : [{ userID: 0 }],
      advisors: initAdvisors.length > 0 ? initAdvisors : [{ userID: 0 }],
    },
    mode: "onChange",
  });
  const projectImages = useProjectImages(
    form.setValue,
    Math.max(0, 10 - initialProject.assetsURL.length),
  );
  const projectCourses = useFieldArray({ control: form.control, name: "projectCourses" });
  const projectTypes = useFieldArray({ control: form.control, name: "projectTypes" });
  const projectCategories = useFieldArray({ control: form.control, name: "projectCategories" });
  const techStacks = useFieldArray({ control: form.control, name: "techStacks" });
  const students = useFieldArray({ control: form.control, name: "students" });
  const advisors = useFieldArray({ control: form.control, name: "advisors" });

  const cancelForm = () => {
    if (form.formState.isDirty || projectImages.selectedFile || projectImages.selectedAssets.length > 0) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          form.reset();
          projectImages.setSelectedFile(null);
          projectImages.setSelectedAssets([]);
          setIsEditMode(false);
        },
      });
    } else {
      setIsEditMode(false);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormInput> = async (data) => {
    try {
      await updateProject.mutateAsync({
        id: projectId,
        payload: projectFormToUpdateRequest(data, initialProject),
        files: {
          thumbnailFile: projectImages.selectedFile,
          assets: projectImages.selectedAssets.length > 0 ? projectImages.selectedAssets : undefined,
        },
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
    techStacksFields: techStacks.fields,
    appendTechStacks: techStacks.append,
    removeTechStacks: techStacks.remove,
    studentsFields: students.fields,
    appendStudents: students.append,
    removeStudents: students.remove,
    advisorsFields: advisors.fields,
    appendAdvisors: advisors.append,
    removeAdvisors: advisors.remove,
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
