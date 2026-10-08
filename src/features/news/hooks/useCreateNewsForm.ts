"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { CreateNewsInputs, CreateNewsSchema } from "@/features/news/schema/news";
import { useCreateNews } from "@/features/news/client";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

export function useCreateNewsForm() {
  const router = useRouter();
  const mutation = useCreateNews();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<"card" | "thumbnail">("card");
  const [selectedAssets, setSelectedAssets] = useState<File[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm<CreateNewsInputs>({
    resolver: zodResolver(CreateNewsSchema),
    defaultValues: {
      title: "",
      startDate: "",
      dueDate: "",
      tagID: 0,
      detail: "",
      thumbnail: undefined,
      thumbnailImage: undefined,
      cardFocalPointX: 50,
      cardFocalPointY: 50,
      thumbnailFocalPointX: 50,
      thumbnailFocalPointY: 50,
      additionalImages: [],
    },
  });

  const submit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({
        ...data,
        startDate: dayjs(data.startDate).toISOString(),
        dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
        additionalImages: selectedAssets,
      });
    } catch {
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: "success",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        setConfirmModal(null);
        router.push("/admin/news?page=1&pageSize=9&category=&title=");
      },
    });
  });

  const handleCropComplete = (
    file: File,
    focalPoint?: { x: number; y: number },
  ) => {
    if (cropTarget === "card") {
      setValue("thumbnail", file, { shouldDirty: true, shouldValidate: true });
      if (focalPoint) {
        setValue("cardFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("cardFocalPointY", focalPoint.y, { shouldDirty: true });
      }
    } else {
      setValue("thumbnailImage", file, { shouldDirty: true, shouldValidate: true });
      if (focalPoint) {
        setValue("thumbnailFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("thumbnailFocalPointY", focalPoint.y, { shouldDirty: true });
      }
    }
    setCroppingFile(null);
  };

  const removeAssets = () => {
    setSelectedAssets([]);
    setValue("additionalImages", [], { shouldDirty: true, shouldValidate: true });
  };

  const handleDrop = (index: number) => {
    if (
      draggedItemIndex !== null &&
      draggedItemIndex !== index &&
      selectedAssets[draggedItemIndex] &&
      selectedAssets[index]
    ) {
      const assets = [...selectedAssets];
      assets.splice(index, 0, assets.splice(draggedItemIndex, 1)[0]);
      setSelectedAssets(assets);
      setValue("additionalImages", assets, { shouldDirty: true });
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleCancel = () => {
    const leave = () => {
      reset();
      router.push("/admin/news?page=1&pageSize=9&category=&title=");
    };
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          leave();
        },
      });
    } else {
      leave();
    }
  };

  return {
    control,
    setValue,
    watch,
    errors,
    submit,
    confirmModal,
    croppingFile,
    selectedAssets,
    draggedItemIndex,
    dragOverItemIndex,
    isError: mutation.isError,
    clearError: mutation.reset,
    handleFileSelection: (file: File, target: "card" | "thumbnail") => {
      setCroppingFile(file);
      setCropTarget(target);
    },
    cancelCrop: () => setCroppingFile(null),
    handleCropComplete,
    addAssets: (files: File[]) => {
      const assets = [...selectedAssets, ...files].slice(0, 10);
      setSelectedAssets(assets);
      setValue("additionalImages", assets, { shouldDirty: true, shouldValidate: true });
    },
    removeAsset: (index: number) => {
      const assets = selectedAssets.filter((_, current) => current !== index);
      setSelectedAssets(assets);
      setValue("additionalImages", assets, { shouldDirty: true, shouldValidate: true });
    },
    removeAssets,
    moveAsset: (from: number, to: number) => {
      if (from === to || !selectedAssets[from] || !selectedAssets[to]) return;
      setDraggedItemIndex(from);
      setDragOverItemIndex(to);
      const assets = [...selectedAssets];
      assets.splice(to, 0, assets.splice(from, 1)[0]);
      setSelectedAssets(assets);
      setValue("additionalImages", assets, { shouldDirty: true });
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
    },
    handleDragStart: (index: number) => setDraggedItemIndex(index),
    handleDragEnter: (index: number) => setDragOverItemIndex(index),
    handleDragEnd: () => {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
    },
    handleDrop,
    handleCancel,
  };
}
