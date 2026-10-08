"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { IProfessor } from "@/features/professors/domain/professor";
import {
  UpdateProfessorInputs,
  UpdateProfessorPayloadSchema,
  UpdateProfessorSchema,
} from "@/features/professors/schema/professor";
import { useUpdateProfessor } from "@/features/professors/client";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

export function useUpdateProfessorForm(professor: IProfessor) {
  const router = useRouter();
  const mutation = useUpdateProfessor();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    professor.imageUrl ?? null,
  );
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<UpdateProfessorInputs>({
    resolver: zodResolver(UpdateProfessorSchema),
    defaultValues: {
      firstNameTh: professor.firstNameTh || "",
      lastNameTh: professor.lastNameTh || "",
      firstNameEn: professor.firstNameEn || "",
      lastNameEn: professor.lastNameEn || "",
      phone: professor.professor.phone || "",
      email: professor.email || "",
      prefixID: professor.prefix?.id || 1,
      profRoom: professor.professor.profRoom || "",
      research_profile: professor.professor.research_profile || "",
      educations: [],
      expertFields: [],
    },
  });

  useEffect(() => {
    reset({
      firstNameTh: professor.firstNameTh || "",
      lastNameTh: professor.lastNameTh || "",
      firstNameEn: professor.firstNameEn || "",
      lastNameEn: professor.lastNameEn || "",
      phone: professor.professor.phone || "",
      email: professor.email || "",
      prefixID: professor.prefix?.id || 1,
      profRoom: professor.professor.profRoom || "",
      research_profile: professor.professor.research_profile || "",
      educations: professor.professor.educations.map((value) => ({ value })),
      expertFields: professor.professor.expertFields.map((value) => ({ value })),
    });
  }, [professor, reset]);

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: "educations" });
  const {
    fields: expertFields,
    append: appendExpert,
    remove: removeExpert,
  } = useFieldArray({ control, name: "expertFields" });

  const onSubmit = async (data: UpdateProfessorInputs) => {
    const payload = UpdateProfessorPayloadSchema.parse({
      id: professor.id,
      prefixID: data.prefixID,
      profRoom: data.profRoom,
      research_profile: data.research_profile ?? "",
      phone: data.phone,
      firstNameTh: data.firstNameTh,
      lastNameTh: data.lastNameTh,
      firstNameEn: data.firstNameEn || null,
      lastNameEn: data.lastNameEn || null,
      email: data.email,
      expertFields: data.expertFields.map((expert) => expert.value).join("/"),
      educations: data.educations.map((education) => education.value).join("/"),
      imageFocalPointX: data.imageFocalPointX,
      imageFocalPointY: data.imageFocalPointY,
    });
    try {
      await mutation.mutateAsync({
        id: professor.id.toString(),
        data: payload,
        imageFile: selectedFile,
      });
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
    setIsEdit(false);
  };

  const handleCancel = () => {
    if (isDirty || selectedFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          reset();
          setSelectedFile(null);
          setPreviewUrl(professor.imageUrl ?? null);
          setIsEdit(false);
        },
      });
    } else {
      setIsEdit(false);
    }
  };

  return {
    control,
    submit: handleSubmit(onSubmit),
    isEdit,
    startEditing: () => setIsEdit(true),
    educationFields,
    appendEducation,
    removeEducation,
    expertFields,
    appendExpert,
    removeExpert,
    selectedFile,
    previewUrl,
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
      setPreviewUrl(URL.createObjectURL(file));
      if (focalPoint) {
        setValue("imageFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("imageFocalPointY", focalPoint.y, { shouldDirty: true });
      }
      setIsCropping(false);
    },
    handleCropCancel: () => {
      setIsCropping(false);
      setSelectedFile(null);
      setPreviewUrl(professor.imageUrl ?? null);
      setIsEdit(false);
    },
    handleCancel,
  };
}
