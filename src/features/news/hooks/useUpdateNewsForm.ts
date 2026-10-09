"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import type { INews } from "@/features/news/domain/news";
import {
  UpdateNewsInputs,
  UpdateNewsPayload,
  UpdateNewsSchema,
} from "@/features/news/schema/news";
import { useNewsById, useUpdateNews } from "@/features/news/client";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { changedFields } from "@/shared/lib/changed-fields";

type NewsAsset = { key: string; source: string | File; id?: number };

const savedAssets = (news: INews): NewsAsset[] => {
  const details = news.images?.filter((image) => image.imageType === "DETAIL") ?? [];
  return details.length
    ? details.map((image) => ({ key: `saved-${image.id}`, source: image.imageUrl, id: image.id }))
    : (news.newsAdditionalImages ?? []).map((image) => ({ key: `saved-${image.id}`, source: image.imageUrl, id: image.id }));
};

const formValues = (news: INews): UpdateNewsInputs => ({
  title: news.title,
  startDate: dayjs(news.startDate).toISOString(),
  dueDate: news.dueDate ? dayjs(news.dueDate).toISOString() : "",
  tag: news.category?.id ?? news.tag?.id ?? 0,
  detail: news.detail,
  thumbnail: news.thumbnailURL ?? "",
  thumbnailImage:
    news.images?.find((image) => image.imageType === "THUMBNAIL")?.imageUrl ??
    news.thumbnailURL ??
    undefined,
  thumbnailFocalPointX:
    news.images?.find((image) => image.imageType === "THUMBNAIL")?.focalPointX ??
    news.thumbnailFocalPointX ??
    50,
  thumbnailFocalPointY:
    news.images?.find((image) => image.imageType === "THUMBNAIL")?.focalPointY ??
    news.thumbnailFocalPointY ??
    50,
  cardFocalPointX:
    news.images?.find((image) => image.imageType === "CARD")?.focalPointX ??
    news.cardFocalPointX ??
    50,
  cardFocalPointY:
    news.images?.find((image) => image.imageType === "CARD")?.focalPointY ??
    news.cardFocalPointY ??
    50,
});

export function useUpdateNewsForm(news: INews) {
  const router = useRouter();
  const mutation = useUpdateNews();
  const savedNewsQuery = useNewsById(news.id, false);
  const [savedNews, setSavedNews] = useState(news);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<"card" | "thumbnail">("card");
  const [selectedAssets, setSelectedAssets] = useState<NewsAsset[]>(() => savedAssets(news));
  const [assetsError, setAssetsError] = useState("");
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm<UpdateNewsInputs>({
    resolver: zodResolver(UpdateNewsSchema),
    defaultValues: formValues(news),
  });

  const thumbnail = watch("thumbnail");
  const thumbnailImage = watch("thumbnailImage");
  const isPending = mutation.isPending;
  const originalAssets = savedAssets(savedNews);
  const assetsChanged =
    selectedAssets.length !== originalAssets.length ||
    selectedAssets.some((asset, index) => asset.key !== originalAssets[index]?.key);

  const resetEditing = () => {
    reset(formValues(savedNews));
    setSelectedAssets(savedAssets(savedNews));
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    setCroppingFile(null);
    setAssetsError("");
    mutation.reset();
    setIsEdit(false);
    setConfirmModal(null);
  };

  const moveAsset = (from: number, to: number) => {
    if (isPending || !isEdit || from === to || !selectedAssets[from] || !selectedAssets[to]) return;
    const assets = [...selectedAssets];
    assets.splice(to, 0, assets.splice(from, 1)[0]);
    setSelectedAssets(assets);
    setAssetsError("");
  };

  const submit = handleSubmit(async (data) => {
    if (!isEdit) return;
    const changed = changedFields(data, formValues(savedNews));
    const newAdditionalImages = selectedAssets.flatMap((asset) =>
      asset.source instanceof File ? [asset.source] : [],
    );
    const deletedIDs = originalAssets
      .filter((asset) => !selectedAssets.some((selected) => selected.id === asset.id))
      .map((asset) => asset.id!);
    const hasMediaRows = Boolean(savedNews.images?.some((image) => image.imageType === "DETAIL"));
    const deletedImageIds = hasMediaRows ? deletedIDs : [];
    const deletedAdditionalImagesId = hasMediaRows ? [] : deletedIDs;
    let newIndex = 0;
    const detailImageOrder = hasMediaRows
      ? JSON.stringify(
          selectedAssets.map((asset) =>
            asset.id !== undefined ? String(asset.id) : `new:${newIndex++}`,
          ),
        )
      : undefined;

    if (Object.keys(changed).length === 0 && !assetsChanged) {
      resetEditing();
      return;
    }

    const payload: UpdateNewsPayload = {
      ...(changed.title !== undefined && { title: data.title }),
      ...(changed.tag !== undefined && { newsCategoryId: data.tag }),
      ...(changed.detail !== undefined && { detail: data.detail }),
      ...(changed.thumbnail instanceof File && { thumbnail: data.thumbnail }),
      ...(changed.thumbnailImage instanceof File && {
        thumbnailImage: data.thumbnailImage,
      }),
      ...(changed.startDate !== undefined && {
        eventStartAt: dayjs(data.startDate).toISOString(),
      }),
      ...(changed.dueDate !== undefined && {
        eventEndAt: data.dueDate ? dayjs(data.dueDate).toISOString() : null,
      }),
      ...(changed.thumbnailFocalPointX !== undefined && {
        thumbnailFocalPointX: data.thumbnailFocalPointX,
      }),
      ...(changed.thumbnailFocalPointY !== undefined && {
        thumbnailFocalPointY: data.thumbnailFocalPointY,
      }),
      ...(changed.cardFocalPointX !== undefined && {
        cardFocalPointX: data.cardFocalPointX,
      }),
      ...(changed.cardFocalPointY !== undefined && {
        cardFocalPointY: data.cardFocalPointY,
      }),
      ...(newAdditionalImages.length > 0 && { detailImages: newAdditionalImages }),
      ...(deletedImageIds.length > 0 && { deletedImageIds }),
      ...(detailImageOrder && { detailImageOrder }),
      ...(deletedAdditionalImagesId.length > 0 && {
        deletedAdditionalImagesId,
      }),
    };

    let response;
    try {
      response = await mutation.mutateAsync({ id: savedNews.id, data: payload });
    } catch {
      return;
    }
    const latestNews = (await savedNewsQuery.refetch()).data ?? {
      ...savedNews,
      ...response,
      newsAdditionalImages: [
        ...(savedNews.newsAdditionalImages ?? []).filter(
          (image) => !deletedAdditionalImagesId.includes(image.id),
        ),
        ...(response.newsAdditionalImages ?? []),
      ],
    };
    setSavedNews(latestNews);
    reset(formValues(latestNews));
    setSelectedAssets(savedAssets(latestNews));
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    setConfirmModal({
      isOpen: true,
      type: "success",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        setConfirmModal(null);
        setIsEdit(false);
        router.push("/admin/news?page=1");
        router.refresh();
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
        setValue("thumbnailFocalPointX", focalPoint.x, { shouldDirty: true, shouldValidate: true });
        setValue("thumbnailFocalPointY", focalPoint.y, { shouldDirty: true, shouldValidate: true });
      }
    }
    setCroppingFile(null);
  };

  const handleCancel = () => {
    if (isDirty || assetsChanged) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: resetEditing,
      });
    } else {
      resetEditing();
    }
  };

  return {
    control,
    setValue,
    errors,
    isEdit,
    confirmModal,
    croppingFile,
    selectedAssets,
    assetsError,
    draggedItemIndex,
    dragOverItemIndex,
    thumbnail,
    thumbnailImage,
    disabled: !isEdit || isPending,
    isPending,
    isError: mutation.isError,
    clearError: mutation.reset,
    submit,
    handleFileSelection: (file: File, target: "card" | "thumbnail") => {
      if (isPending) return;
      setCroppingFile(file);
      setCropTarget(target);
    },
    handleCropComplete,
    addAssets: (files: File[]) => {
      if (isPending || !isEdit || !files.length) return;
      if (selectedAssets.length + files.length > 10) {
        setAssetsError("อัปโหลดรูปภาพเพิ่มเติมได้สูงสุด 10 รูป");
        return;
      }
      if (files.some((file) => !file.type.startsWith("image/"))) {
        setAssetsError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }
      setSelectedAssets([...selectedAssets, ...files.map((file, index) => ({
        key: `new-${selectedAssets.length + index}-${file.name}`,
        source: file,
      }))]);
      setAssetsError("");
    },
    removeAsset: (index: number) => {
      if (isPending || !isEdit) return;
      setSelectedAssets(selectedAssets.filter((_, current) => current !== index));
      setAssetsError("");
    },
    removeAllAssets: () => {
      if (isPending || !isEdit) return;
      setSelectedAssets([]);
      setAssetsError("");
    },
    moveAsset,
    handleDragStart: (index: number) => setDraggedItemIndex(index),
    handleDragEnter: (index: number) => setDragOverItemIndex(index),
    handleDragEnd: () => {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
    },
    handleDrop: (index: number) => {
      if (draggedItemIndex !== null) moveAsset(draggedItemIndex, index);
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
    },
    handleCancel,
    startEditing: () => setIsEdit(true),
    cancelCrop: () => setCroppingFile(null),
  };
}
