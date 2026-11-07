import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import {
  CreateCurriculumSchema,
  type CreateCurriculumInputs,
} from "@/features/curriculum/schema/curriculum";
import { useCreateCurriculum } from "@/features/curriculum/client";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { HttpError } from "@/shared/lib/http";

export function useCreateCurriculumController() {
  const router = useRouter();
  const createCurriculum = useCreateCurriculum();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<CreateCurriculumInputs>({
    resolver: zodResolver(CreateCurriculumSchema),
    mode: "onChange",
    defaultValues: { title: "", year: "", documentURL: "", description: "" },
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
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.back(),
      });
    } else {
      router.back();
    }
  };

  const onSubmit: SubmitHandler<CreateCurriculumInputs> = async (data) => {
    if (!selectedFile) {
      setFileError("กรุณาอัปโหลดรูปภาพ");
      return;
    }
    setFileError(null);

    try {
      await createCurriculum.mutateAsync({
        data: { ...data, year: dayjs(data.year).year().toString() },
        thumbnailFile: selectedFile,
      });
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push("/admin/curriculum"),
      });
    } catch (error) {
      console.error("Submit Error:", error);
      if (error instanceof HttpError && error.status === 409) {
        form.setError("year", {
          type: "manual",
          message: "ปีการศึกษานี้มีอยู่ในระบบแล้ว",
        });
      } else {
        setErrorMessage("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        setIsError(true);
      }
    }
  };

  return {
    form,
    selectedFile,
    fileError,
    croppingFile,
    confirmModal,
    isPending: createCurriculum.isPending,
    handleFileChange,
    handleUploadComplete,
    handleCancel,
    handleCropCancel,
    onSubmit,
    isError,
    setIsError,
    errorMessage,
  };
}
