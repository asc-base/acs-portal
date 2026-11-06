import { useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useCreateProject } from "@/features/projects/client";
import { CreateProjectFormSchema, projectFormToCreateRequest } from "@/features/projects/schema/project";
import type { ProjectFormInput } from "@/features/projects/schema/project";
import { useProjectImages } from "@/features/projects/hooks/use-project-images";

export function useCreateProjectController() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const form = useForm<ProjectFormInput>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      title: "",
      details: "",
      youtubeURL: "",
      githubURL: "",
      documentURL: "",
      presentationURL: "",
      projectCourses: [{ value: 0 }],
      projectTypes: [{ value: 0 }],
      projectCategories: [{ value: 0 }],
      techStacks: [{ value: "" }],
      students: [{ userID: 0 }],
      advisors: [{ userID: 0 }],
    },
    mode: "onChange",
  });
  const projectImages = useProjectImages(form.setValue);
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
        onConfirm: () => router.push("/admin/projects"),
      });
    } else {
      router.push("/admin/projects");
    }
  };

  const onSubmit: SubmitHandler<ProjectFormInput> = async (data) => {
    if (!projectImages.selectedFile) {
      projectImages.setImageError(true);
      return;
    }
    if (projectImages.selectedAssets.length === 0) {
      projectImages.setAssetsError(true);
      return;
    }

    try {
      await createProject.mutateAsync({
        payload: projectFormToCreateRequest(data),
        files: {
          thumbnailFile: projectImages.selectedFile,
          assets: projectImages.selectedAssets,
        },
      });
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push("/admin/projects"),
      });
    } catch (error) {
      console.error(error);
      setErrorMsg("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      setIsError(true);
    }
  };

  return {
    ...projectImages,
    form,
    control: form.control,
    handleSubmit: form.handleSubmit,
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
    cancelForm,
    onSubmit,
    isPending: createProject.isPending,
  };
}
