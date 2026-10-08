import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import type { ICurriculum } from "@/features/curriculum/domain/curriculum";
import { useUpdateCurriculum } from "@/features/curriculum/client";
import {
  UpdateCurriculumSchema,
  type UpdateCurriculumInputs,
} from "@/features/curriculum/schema/curriculum";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

export function useUpdateCurriculumController(curriculum: ICurriculum) {
  const router = useRouter();
  const updateCurriculum = useUpdateCurriculum();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const form = useForm<UpdateCurriculumInputs>({
    resolver: zodResolver(UpdateCurriculumSchema),
    defaultValues: {
      title: curriculum.title ?? "",
      year: curriculum.year ?? "",
      documentURL: curriculum.documentURL ?? "",
      description: curriculum.description ?? "",
      thumbnailFocalPointX: curriculum.thumbnailFocalPointX ?? undefined,
      thumbnailFocalPointY: curriculum.thumbnailFocalPointY ?? undefined,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { isDirty } = form.formState;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCroppingFile(file);
    event.target.value = "";
  };

  const handleUploadComplete = (
    file: File,
    focalPoint?: { x: number; y: number },
  ) => {
    setSelectedFile(file);
    if (focalPoint) {
      form.setValue("thumbnailFocalPointX", focalPoint.x);
      form.setValue("thumbnailFocalPointY", focalPoint.y);
    }
    setCroppingFile(null);
  };

  const handleCropCancel = () => setCroppingFile(null);

  const handleCancel = () => {
    if (isDirty || selectedFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setIsEdit(false);
          form.reset();
          setSelectedFile(null);
          setConfirmModal(null);
        },
      });
    } else {
      setIsEdit(false);
      form.reset();
      setSelectedFile(null);
    }
  };

  const onSubmit: SubmitHandler<UpdateCurriculumInputs> = async (data) => {
    try {
      await updateCurriculum.mutateAsync({
        id: curriculum.id,
        data: { ...data, year: dayjs(data.year).year().toString() },
        thumbnailFile: selectedFile,
      });
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          setIsEdit(false);
          router.push(
            `/admin/courses?page=1&pageSize=10&curriculumID=${curriculum.id}`,
          );
        },
      });
    } catch (error) {
      console.error("Update Error:", error);
      setIsError(true);
    }
  };

  return {
    form,
    selectedFile,
    isEdit,
    setIsEdit,
    croppingFile,
    confirmModal,
    isError,
    setIsError,
    isPending: updateCurriculum.isPending,
    handleFileChange,
    handleUploadComplete,
    handleCropCancel,
    handleCancel,
    onSubmit,
  };
}
