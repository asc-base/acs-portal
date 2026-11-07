import { useState } from "react";
import type { ChangeEvent } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { ProjectFormInput, ProjectGalleryRequest } from "@/features/projects/schema/project";

export type ProjectGalleryItem =
  | { kind: "existing"; imageID: number; imageUrl: string; contentType: string | null }
  | { kind: "new"; file: File };

type ExistingProjectImage = { imageID: number; imageUrl: string; contentType: string | null; sortOrder: number };

export function useProjectImages(
  setValue: UseFormSetValue<ProjectFormInput>,
  initialGallery: ExistingProjectImage[] = [],
  maxGallery = 10,
) {
  const originalGallery = [...initialGallery].sort((a, b) => a.sortOrder - b.sortOrder);
  const [galleryItems, setGalleryItems] = useState<ProjectGalleryItem[]>(() =>
    originalGallery.map(({ imageID, imageUrl, contentType }) => ({ kind: "existing", imageID, imageUrl, contentType })),
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);
  const [assetsError, setAssetsError] = useState(false);
  const [isCroping, setIsCroping] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [tempThumbFile, setTempThumbFile] = useState<File | null>(null);
  const selectedAssets = galleryItems.flatMap((item) => item.kind === "new" ? [item.file] : []);
  const hasGalleryChanges = galleryItems.some((item) => item.kind === "new")
    || JSON.stringify(galleryItems.map((item) => item.kind === "existing" ? item.imageID : null))
      !== JSON.stringify(originalGallery.map(({ imageID }) => imageID));

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTempThumbFile(file);
      setIsCroping(true);
    }
    event.target.value = "";
  };

  const handleCropComplete = (croppedFile: File, focalPoint?: { x: number; y: number }) => {
    setSelectedFile(croppedFile);
    if (focalPoint) {
      setValue("thumbnailFocalPointX", focalPoint.x, { shouldDirty: true });
      setValue("thumbnailFocalPointY", focalPoint.y, { shouldDirty: true });
    }
    setImageError(false);
    setIsCroping(false);
    setTempThumbFile(null);
  };

  const handleCropCancel = () => {
    setIsCroping(false);
    setTempThumbFile(null);
  };

  const handleAssetsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setGalleryItems((previous) => [
      ...previous,
      ...Array.from(files).slice(0, Math.max(0, maxGallery - previous.length)).map((file) => ({ kind: "new" as const, file })),
    ]);
    setAssetsError(false);
    event.target.value = "";
  };

  const removeAsset = (index: number) => setGalleryItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  const removeAllAssets = () => setGalleryItems([]);
  const resetGallery = () => setGalleryItems(originalGallery.map(({ imageID, imageUrl, contentType }) => ({ kind: "existing", imageID, imageUrl, contentType })));
  const handleDragStart = (index: number) => setDraggedItemIndex(index);
  const handleDragEnter = (index: number) => setDragOverItemIndex(index);
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };
  const handleDrop = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      setGalleryItems((previous) => {
        const next = [...previous];
        const [dragged] = next.splice(draggedItemIndex, 1);
        if (dragged) next.splice(index, 0, dragged);
        return next;
      });
    }
    handleDragEnd();
  };
  const moveAsset = (index: number, offset: -1 | 1) => {
    const destination = index + offset;
    if (destination < 0 || destination >= galleryItems.length) return;
    setGalleryItems((previous) => {
      const next = [...previous];
      const [item] = next.splice(index, 1);
      if (item) next.splice(destination, 0, item);
      return next;
    });
  };
  const galleryRequest = (): ProjectGalleryRequest => {
    const assets: File[] = [];
    const gallery = galleryItems.map((item) => {
      if (item.kind === "existing") return { imageID: item.imageID };
      const fileIndex = assets.push(item.file) - 1;
      return { fileIndex };
    });
    return { gallery, assets };
  };

  return {
    selectedFile,
    setSelectedFile,
    imageError,
    setImageError,
    assetsError,
    setAssetsError,
    isCroping,
    selectedAssets,
    galleryItems,
    hasGalleryChanges,
    draggedItemIndex,
    dragOverItemIndex,
    tempThumbFile,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleAssetsChange,
    removeAsset,
    removeAllAssets,
    resetGallery,
    moveAsset,
    galleryRequest,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  };
}
