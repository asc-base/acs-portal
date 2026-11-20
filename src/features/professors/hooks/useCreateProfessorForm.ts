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
import { DUPLICATE_EMAIL_MESSAGE, isDuplicateEmailError } from "@/shared/lib/http";

export function useCreateProfessorForm() {
  const router = useRouter();
  const mutation = useCreateProfessor();
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { isValid, isDirty, errors },
  } = useForm<CreateProfessorInputs>({
    resolver: zodResolver(CreateProfessorSchema),
    defaultValues: {
      personnelType: "LECTURER",
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
  const selectedFile = watch("imageFile");
  const imageError = errors.imageFile?.message;
  const isCropping = Boolean(croppingFile);
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "educations",
  });
  const { fields: expertFields, append: appendExpert, remove: removeExpert } = useFieldArray({
    control,
    name: "expertFields",
  });

  const onSubmit = async (data: CreateProfessorInputs) => {
    const payload = CreateProfessorPayloadSchema.parse({
      personnelType: data.personnelType,
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
      await mutation.mutateAsync({ data: payload, imageFile: data.imageFile });
    } catch (error) {
      if (isDuplicateEmailError(error)) {
        mutation.reset();
        setError("email", { type: "server", message: DUPLICATE_EMAIL_MESSAGE }, { shouldFocus: true });
      }
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
    errors,
    educationFields,
    appendEducation,
    removeEducation,
    expertFields,
    appendExpert,
    removeExpert,
    selectedFile,
    croppingFile,
    isCropping,
    confirmModal,
    isPending: mutation.isPending,
    fileError,
    imageError,
    isError: mutation.isError || Boolean(fileError),
    clearError: () => {
      setFileError("");
      mutation.reset();
    },
    handleFileChange: (file: File | null) => {
      if (file) {
        if (!file.type.startsWith("image/")) {
          setFileError("รองรับเฉพาะไฟล์รูปภาพเท่านั้น");
          return;
        }
        setFileError("");
        setCroppingFile(file);
      }
    },
    handleCropComplete: (
      file: File,
      focalPoint?: { x: number; y: number },
    ) => {
      setValue("imageFile", file, { shouldDirty: true, shouldValidate: true });
      if (focalPoint) {
        setValue("imageFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("imageFocalPointY", focalPoint.y, { shouldDirty: true });
      }
      setFileError("");
      setCroppingFile(null);
    },
    handleCropCancel: () => {
      setCroppingFile(null);
    },
    cancelForm,
  };
}
