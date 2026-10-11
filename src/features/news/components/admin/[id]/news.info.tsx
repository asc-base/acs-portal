"use client";
import { useState, useEffect } from "react";
import { INews, NewsCategory } from "@/features/news/domain/news";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import Image from "next/image";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import { Button, MenuItem, Alert, Snackbar, Modal, IconButton, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RHFDatePickerDayjs } from "@/shared/components/form/RHFDatePicker";
import { styled } from "@mui/material/styles";
import {
  ConfirmModal,
} from "@/shared/components/modal/confirmModal";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useUpdateNewsForm } from "@/features/news/hooks/useUpdateNewsForm";


dayjs.extend(buddhistEra);
dayjs.locale("th");

interface NewsInfoProps {
  news: INews;
  categories: NewsCategory[];
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const NewsImage = ({ source, alt }: { source: string | File; alt: string }) => {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!(source instanceof File)) return;
    const url = URL.createObjectURL(source);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [source]);
  const src = typeof source === "string" ? source : preview;
  return src ? (
    <Image
      src={src}
      alt={alt}
      fill
      className="pointer-events-none object-cover"
      draggable={false}
      sizes="(max-width: 768px) 50vw, 400px"
    />
  ) : null;
};

const NewsInfo = ({ news, categories }: NewsInfoProps) => {
  const {
    control,
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
    disabled,
    isPending,
    isError,
    clearError,
    submit,
    handleFileSelection,
    handleCropComplete,
    addAssets,
    removeAsset,
    moveAsset,
    removeAllAssets,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
    handleCancel,
    startEditing,
    cancelCrop,
  } = useUpdateNewsForm(news);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "card" | "thumbnail" = "card",
  ) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelection(file, target);
    event.target.value = "";
  };
  const handleUploadComplete = handleCropComplete;
  const handleAssetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addAssets(Array.from(event.target.files ?? []));
    event.target.value = "";
  };
  const assetAtPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const key = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-news-asset]")?.dataset.newsAsset;
    return selectedAssets.findIndex((asset) => asset.key === key);
  };

  const uploadAssetsButton = (
    <Button
      variant="contained"
      component="label"
      disabled={isPending}
      sx={{ height: "40px" }}
    >
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        multiple
        disabled={isPending}
        onChange={handleAssetsChange}
      />
      อัปโหลดรูปภาพ
    </Button>
  );

  return (
    <div className="p-4 md:p-8">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={clearError}
      >
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ width: "100%" }}
        >
          ไม่สามารถบันทึกข้อมูลข่าวสารได้
        </Alert>
      </Snackbar>
      <h3 className="mb-6 font-bold">
        {isEdit ? "แก้ไขข้อมูลข่าวสาร" : "ข้อมูลข่าวสาร"}
      </h3>
      <form className="gap-4 p-4" onSubmit={submit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
            <div className="flex w-full shrink-0 flex-col gap-2 md:w-[400px]">
              <div className="text-neutral04 text-h4 font-medium">
                ภาพการ์ด
              </div>
              <div className="group border-neutral03 bg-neutral02 relative flex aspect-[382/254] w-full items-center justify-center overflow-hidden rounded-xl border">
                <NewsImage source={thumbnail} alt="ภาพการ์ด" />
                {isEdit && (
                  <div className="bg-neutral05/40 absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0">
                    <Button
                      variant="contained"
                      component="label"
                      disabled={isPending}
                    >
                      อัปโหลดรูปภาพ
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        disabled={isPending}
                        onChange={handleFileChange}
                      />
                    </Button>
                  </div>
                )}
              </div>
              {errors.thumbnail && (
                <p role="alert" className="text-accent04 text-sm">
                  {errors.thumbnail.message}
                </p>
              )}
              <div className="mt-2 text-neutral04 text-h4 font-medium">ภาพหน้าปก/Highlight</div>
              <div className="group border-neutral03 bg-neutral02 relative flex aspect-[382/254] w-full items-center justify-center overflow-hidden rounded-xl border">
                <NewsImage source={thumbnailImage ?? thumbnail} alt="ภาพหน้าปก" />
                {isEdit && <div className="absolute inset-0 flex items-center justify-center bg-neutral05/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="contained" component="label" disabled={isPending}>
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput type="file" accept="image/*" disabled={isPending} onChange={(event) => handleFileChange(event, "thumbnail")} />
                  </Button>
                </div>}
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <RHFTextField
                name="title"
                control={control}
                label="หัวข้อข่าว"
                disabled={disabled}
                required
                requiredMark
                fullWidth
              />
              <div className="flex flex-1 flex-col [&_.MuiFormControl-root]:flex-1 [&_.MuiInputBase-root]:flex-1 [&_.MuiInputBase-root]:items-start [&_textarea]:!h-full [&_textarea]:!overflow-y-auto [&>div]:flex [&>div]:flex-1 [&>div]:flex-col">
                <RHFTextField
                  control={control}
                  name="detail"
                  label="รายละเอียด"
                  disabled={disabled}
                  multiline
                  required
                  requiredMark
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">
                รูปภาพรายละเอียด
                <span
                  className="text-h4 text-neutral04 ml-2 font-normal"
                  aria-live="polite"
                >
                  {selectedAssets.length} รูป - สูงสุด 10
                </span>
              </h3>
              {isEdit && selectedAssets.length > 0 && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={removeAllAssets}
                  className="text-h5 text-accent04 cursor-pointer font-bold underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ลบทั้งหมด
                </button>
              )}
            </div>
            {selectedAssets.length === 0 ? (
              <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-10">
                {isEdit ? (
                  uploadAssetsButton
                ) : (
                  <p className="text-neutral04">ยังไม่มีรูปภาพเพิ่มเติม</p>
                )}
              </div>
            ) : (
              <div className="grid min-h-[160px] grid-cols-2 items-start gap-4 rounded-lg sm:grid-cols-3 lg:grid-cols-5">
                {selectedAssets.map((asset, index) => (
                  <div
                    key={asset.key}
                    data-news-asset={asset.key}
                    tabIndex={disabled ? -1 : 0}
                    role={isEdit ? "group" : undefined}
                    aria-label={`รูปภาพเพิ่มเติม ${index + 1}${isEdit ? " ลากหรือใช้ลูกศรซ้ายขวาเพื่อเปลี่ยนลำดับ" : ""}`}
                    draggable={!disabled}
                    onPointerDown={(event) => {
                      if (
                        disabled ||
                        event.pointerType === "mouse" ||
                        !event.isPrimary ||
                        (event.target as Element).closest("button")
                      )
                        return;
                      event.currentTarget.setPointerCapture(event.pointerId);
                      handleDragStart(index);
                      handleDragEnter(index);
                    }}
                    onPointerMove={(event) => {
                      if (
                        disabled ||
                        event.pointerType === "mouse" ||
                        draggedItemIndex === null
                      )
                        return;
                      handleDragEnter(assetAtPointer(event));
                    }}
                    onPointerUp={(event) => {
                      if (event.pointerType !== "mouse")
                        handleDrop(assetAtPointer(event));
                    }}
                    onPointerCancel={(event) => {
                      if (event.pointerType !== "mouse") handleDragEnd();
                    }}
                    onLostPointerCapture={(event) => {
                      if (event.pointerType !== "mouse") handleDragEnd();
                    }}
                    onKeyDown={(event) => {
                      if (
                        disabled ||
                        event.target !== event.currentTarget ||
                        !["ArrowLeft", "ArrowRight"].includes(event.key)
                      )
                        return;
                      event.preventDefault();
                      moveAsset(
                        index,
                        index + (event.key === "ArrowLeft" ? -1 : 1),
                      );
                    }}
                    onDragStart={(event) => {
                      if (disabled) return;
                      event.dataTransfer.setData("text/plain", asset.key);
                      event.dataTransfer.effectAllowed = "move";
                      handleDragStart(index);
                    }}
                    onDragEnter={() => {
                      if (!disabled && draggedItemIndex !== null)
                        handleDragEnter(index);
                    }}
                    onDragOver={(event) => {
                      if (!disabled && draggedItemIndex !== null)
                        event.preventDefault();
                    }}
                    onDragEnd={handleDragEnd}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleDrop(index);
                    }}
                    className={`group relative aspect-video w-full overflow-hidden rounded-md border-2 transition-all ${!disabled ? "cursor-grab touch-none select-none active:cursor-grabbing" : ""} ${dragOverItemIndex === index ? "scale-105 border-dashed border-[var(--color-primary02)]" : "border-solid border-gray-200"} ${draggedItemIndex === index ? "opacity-40" : "opacity-100"}`}
                  >
                    <NewsImage
                      source={asset.source}
                      alt={`รูปภาพเพิ่มเติม ${index + 1}`}
                    />
                    {isEdit && (
                      <IconButton
                        type="button"
                        size="small"
                        disabled={isPending}
                        aria-label={`ลบรูปภาพเพิ่มเติม ${index + 1}`}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 10,
                          width: 24,
                          height: 24,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          padding: 0,
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                        }}
                        onClick={() => removeAsset(index)}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </div>
                ))}
                {isEdit && selectedAssets.length < 10 && (
                  <div className="flex aspect-video w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                    {uploadAssetsButton}
                  </div>
                )}
              </div>
            )}
            {assetsError && (
              <p role="alert" className="text-h5 text-accent04 mt-2">
                {assetsError}
              </p>
            )}
          </div>

          <RHFSelect
            name="tag"
            control={control}
            label="หมวดหมู่"
            disabled={disabled}
            required
            requiredMark
            fullWidth
          >
            {categories.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </RHFSelect>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RHFDatePickerDayjs
              name="startDate"
              control={control}
              label="วันที่เริ่มต้น"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่เริ่มต้น"
              disabled={disabled}
              requiredMark
            />
            <RHFDatePickerDayjs
              name="dueDate"
              control={control}
              label="วันที่สิ้นสุด"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่สิ้นสุด"
              disabled={disabled}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-x-4">
          {isEdit ? (
            <>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                disabled={isPending}
                size="large"
              >
                ยกเลิก
              </Button>
              <Button
                variant="contained"
                type="submit"
              disabled={isPending}
                size="large"
              >
                {isPending ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="contained"
              onClick={startEditing}
              size="large"
            >
              แก้ไขข้อมูล
            </Button>
          )}
        </div>
      </form>

      <Modal open={!!croppingFile} onClose={cancelCrop}>
        <div>
          {croppingFile && (
            <CropImageCard
              file={croppingFile}
              width={382}
              height={254}
              onUploadComplete={handleUploadComplete}
              onCancel={cancelCrop}
              preserveOriginal
            />
          )}
        </div>
      </Modal>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default NewsInfo;
