import { useState } from "react";
import type { ChangeEvent } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { ProjectFormInput } from "@/features/projects/schema/project";

export function useProjectImages(
  setValue: UseFormSetValue<ProjectFormInput>,
  maxAssets = 10,
) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);
  const [assetsError, setAssetsError] = useState(false);
  const [isCroping, setIsCroping] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<File[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [tempThumbFile, setTempThumbFile] = useState<File | null>(null);

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
    setSelectedAssets((previous) => [...previous, ...Array.from(files)].slice(0, maxAssets));
    setAssetsError(false);
  };

  const removeAsset = (indexToRemove: number) =>
    setSelectedAssets((previous) => previous.filter((_, index) => index !== indexToRemove));
  const removeAllAssets = () => setSelectedAssets([]);
  const handleDragStart = (index: number) => setDraggedItemIndex(index);
  const handleDragEnter = (index: number) => setDragOverItemIndex(index);
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };
  const handleDrop = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      setSelectedAssets((previous) => {
        const next = [...previous];
        const [dragged] = next.splice(draggedItemIndex, 1);
        if (dragged) next.splice(index, 0, dragged);
        return next;
      });
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
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
    setSelectedAssets,
    draggedItemIndex,
    dragOverItemIndex,
    tempThumbFile,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleAssetsChange,
    removeAsset,
    removeAllAssets,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  };
}
