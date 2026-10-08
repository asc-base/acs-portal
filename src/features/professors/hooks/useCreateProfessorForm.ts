"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  CreateProfessorInputs,
  CreateProfessorPayloadSchema,
  CreateProfessorSchema,
} from "@/features/professors/schema/professor";
import { useCreateProfessor } from "@/features/professors/client";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

export function useCreateProfessorForm() {
  const router = useRouter();
  const mutation = useCreateProfessor();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
  } = useForm<CreateProfessorInputs>({
    resolver: zodResolver(CreateProfessorSchema),
    defaultValues: {
      prefixID: null,
      educations: [],
      email: "",
      expertFields: [],
      firstNameEn: "",
      firstNameTh: "",
      lastNameEn: "",
      lastNameTh: "",
      phone: "",
      profRoom: "",
      research_profile: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { fields: educationFields, append: appendEducation } = useFieldArray({
    control,
    name: "educations",
  });
  const { fields: expertFields, append: appendExpert } = useFieldArray({
    control,
    name: "expertFields",
  });

  const onSubmit = async (data: CreateProfessorInputs) => {
    const payload = CreateProfessorPayloadSchema.parse({
      prefixID: data.prefixID,
      firstNameTh: data.firstNameTh,
      lastNameTh: data.lastNameTh,
      firstNameEn: data.firstNameEn || null,
      lastNameEn: data.lastNameEn || null,
      email: data.email,
      phone: data.phone,
      profRoom: data.profRoom,
      research_profile: data.research_profile || null,
      educations: data.educations.map((education) => education.value).join("/"),
      expertFields: data.expertFields.map((expert) => expert.value).join("/"),
      imageFocalPointX: data.imageFocalPointX,
      imageFocalPointY: data.imageFocalPointY,
    });
    try {
      await mutation.mutateAsync({ data: payload, imageFile: selectedFile });
    } catch {
      // The mutation state drives the form error alert.
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: "success",
      onClose: () => setConfirmModal(null),
      onConfirm: () => router.push("/admin/professors"),
    });
  };

  const cancelForm = () => {
    const leave = () => router.push("/admin/professors");
    if (isDirty || selectedFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: leave,
      });
    } else {
      leave();
    }
  };

  return {
    control,
    setValue,
    submit: handleSubmit(onSubmit),
    isValid,
    educationFields,
    appendEducation,
    expertFields,
    appendExpert,
    selectedFile,
    isCropping,
    confirmModal,
    isPending: mutation.isPending,
    isError: mutation.isError,
    clearError: mutation.reset,
    handleFileChange: (file: File | null) => {
      if (file) {
        setSelectedFile(file);
        setIsCropping(true);
      }
    },
    handleCropComplete: (
      file: File,
      focalPoint?: { x: number; y: number },
    ) => {
      setSelectedFile(file);
      if (focalPoint) {
        setValue("imageFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("imageFocalPointY", focalPoint.y, { shouldDirty: true });
      }
      setIsCropping(false);
    },
    handleCropCancel: () => {
      setIsCropping(false);
      setSelectedFile(null);
    },
    cancelForm,
  };
}
