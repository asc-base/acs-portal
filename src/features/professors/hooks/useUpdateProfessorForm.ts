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
import { changedFields } from "@/shared/lib/changed-fields";

const formValues = (professor: IProfessor): UpdateProfessorInputs => ({
  firstNameTh: professor.firstNameTh || "",
  lastNameTh: professor.lastNameTh || "",
  firstNameEn: professor.firstNameEn || "",
  lastNameEn: professor.lastNameEn || "",
  phone: professor.professor.phone || "",
  email: professor.email || "",
  prefixID: professor.prefix?.id || 1,
  profRoom: professor.professor.profRoom || "",
  research_profile: professor.professor.research_profile || "",
  imageFocalPointX: professor.imageFocalPointX ?? undefined,
  imageFocalPointY: professor.imageFocalPointY ?? undefined,
  educations: professor.professor.educations.map((value) => ({ value })),
  expertFields: professor.professor.expertFields.map((value) => ({ value })),
});

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
    defaultValues: formValues(professor),
  });

  useEffect(() => {
    reset(formValues(professor));
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
    const changed = changedFields(data, formValues(professor));
    const payload = UpdateProfessorPayloadSchema.parse({
      ...(changed.prefixID !== undefined && { prefixID: changed.prefixID }),
      ...(changed.profRoom !== undefined && { profRoom: changed.profRoom }),
      ...(changed.research_profile !== undefined && {
        research_profile: changed.research_profile || null,
      }),
      ...(changed.phone !== undefined && { phone: changed.phone }),
      ...(changed.firstNameTh !== undefined && { firstNameTh: changed.firstNameTh }),
      ...(changed.lastNameTh !== undefined && { lastNameTh: changed.lastNameTh }),
      ...(changed.firstNameEn !== undefined && {
        firstNameEn: changed.firstNameEn || null,
      }),
      ...(changed.lastNameEn !== undefined && {
        lastNameEn: changed.lastNameEn || null,
      }),
      ...(changed.email !== undefined && { email: changed.email }),
      ...(changed.expertFields !== undefined && {
        expertFields: changed.expertFields.map(({ value }) => value).join("/"),
      }),
      ...(changed.educations !== undefined && {
        educations: changed.educations.map(({ value }) => value).join("/"),
      }),
      ...(changed.imageFocalPointX !== undefined && {
        imageFocalPointX: changed.imageFocalPointX,
      }),
      ...(changed.imageFocalPointY !== undefined && {
        imageFocalPointY: changed.imageFocalPointY,
      }),
    });

    if (Object.keys(payload).length === 0 && !selectedFile) return;
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
