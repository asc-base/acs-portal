"use client";
import { Button, MenuItem, Alert, Snackbar, Modal } from "@mui/material";
import React from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import { RHFDatePickerDayjs } from "@/shared/components/form/RHFDatePicker";
import {
  ConfirmModal,
} from "@/shared/components/modal/confirmModal";
import { styled } from "@mui/material/styles";
import { NewsCategory } from "@/features/news/domain/news";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useCreateNewsForm } from "@/features/news/hooks/useCreateNewsForm";

interface CreateNewsProps {
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

const CreateNewsForm = ({ categories }: CreateNewsProps) => {
  const {
    control,
    watch,
    errors,
    submit,
    confirmModal,
    isError,
    clearError,
    croppingFile,
    selectedAssets,
    draggedItemIndex,
    dragOverItemIndex,
    handleFileSelection,
    handleCropComplete,
    cancelCrop,
    addAssets,
    removeAsset,
    removeAssets,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
    handleCancel,
  } = useCreateNewsForm();

  const thumbnailFile = watch("thumbnail");
  const detailThumbnailFile = watch("thumbnailImage");
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
    if (event.target.files) addAssets(Array.from(event.target.files));
    event.target.value = "";
  };

  return (
    <div className="p-8">
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
          ไม่สามารถเพิ่มข่าวสารได้
        </Alert>
      </Snackbar>
      <h3 className="mb-6 font-bold">ข้อมูลข่าวสาร</h3>
      <form className="gap-4 p-4" onSubmit={submit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
            <div className="flex w-full md:w-[400px] flex-col gap-2 shrink-0">
              <div className="text-neutral04 text-h4 font-medium">
                ภาพการ์ด
              </div>
             <div className="group border-neutral03 bg-neutral02 relative flex aspect-[382/254] w-full items-center justify-center overflow-hidden rounded-xl border">
                {thumbnailFile ? (
                  <>
                    <Image
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="bg-neutral05/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label">
                        อัปโหลดรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="contained" component="label">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
              </div>
              <div className="mt-3 text-neutral04 text-h4 font-medium">ภาพหน้าปก/Highlight (ไม่บังคับ)</div>
              <div className="relative flex aspect-[382/254] w-full items-center justify-center overflow-hidden rounded-xl border border-neutral03 bg-neutral02">
                {detailThumbnailFile ? (
                  <Image src={URL.createObjectURL(detailThumbnailFile)} alt="ภาพหน้าปก" fill className="object-cover" />
                ) : <span className="text-neutral04">ใช้ภาพการ์ดเป็นค่าเริ่มต้น</span>}
                <Button variant="contained" component="label" className="absolute">
                  {detailThumbnailFile ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={(event) => handleFileChange(event, "thumbnail")} />
                </Button>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <RHFTextField
                name="title"
                control={control}
                label="หัวข้อข่าว"
                requiredMark
                fullWidth
              />
              <div className="flex flex-1 flex-col [&>div]:flex-1 [&>div]:flex [&>div]:flex-col [&_.MuiFormControl-root]:flex-1 [&_.MuiInputBase-root]:flex-1 [&_.MuiInputBase-root]:items-start [&_textarea]:!h-full [&_textarea]:!overflow-y-auto">
                <RHFTextField
                  control={control}
                  name="detail"
                  label="รายละเอียด"
                  multiline
                  fullWidth
                  requiredMark
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">
                รูปภาพเพิ่มเติม{" "}
                <span className="text-h4 text-neutral04 ml-2 font-normal">
                  {selectedAssets.length} รูป - สูงสุด 10
                </span>
              </h3>
              {selectedAssets.length > 0 && (
                <button
                  type="button"
                  onClick={removeAssets}
                  className="text-h5 text-accent04 cursor-pointer font-bold underline"
                >
                  ลบทั้งหมด
                </button>
              )}
            </div>

            {selectedAssets.length === 0 ? (
              <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-10">
                <Button variant="contained" component="label">
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAssetsChange}
                  />
                  อัปโหลดรูปภาพ
                </Button>
                {errors.additionalImages && (
                  <p className="text-h5 text-accent04">
                    {errors.additionalImages.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid min-h-[160px] grid-cols-5 items-start gap-4 rounded-lg">
                {selectedAssets.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    onDrop={() => handleDrop(index)}
                    className={`group relative aspect-video w-full cursor-grab overflow-hidden rounded-md border-2 transition-all active:cursor-grabbing
                      ${dragOverItemIndex === index ? "scale-105 border-dashed border-[var(--color-primary02)]" : "border-solid border-gray-200"}
                      ${draggedItemIndex === index ? "opacity-40" : "opacity-100"}`}
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="asset"
                      fill
                      className="pointer-events-none object-cover"
                      draggable={false}
                    />
                    <IconButton
                      size="small"
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
                  </div>
                ))}

                {selectedAssets.length < 10 && (
                  <div className="flex aspect-video w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                    <Button variant="contained" component="label" sx={{ height: "40px" }}>
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAssetsChange}
                      />
                      อัปโหลดรูปภาพ
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <RHFSelect
            name="tagID"
            control={control}
            label="หมวดหมู่"
            requiredMark
            fullWidth
          >
            <MenuItem value={0} disabled>
              {categories.length ? "เลือกหมวดหมู่" : "ไม่พบหมวดหมู่ข่าวในระบบ"}
            </MenuItem>
            {categories.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </RHFSelect>
          <div className="grid grid-cols-2 gap-x-4">
            <RHFDatePickerDayjs
              name="startDate"
              control={control}
              label="วันที่เริ่มต้น"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่เริ่มต้น"
              requiredMark
            />
            <RHFDatePickerDayjs
              name="dueDate"
              control={control}
              label="วันที่สิ้นสุด"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่สิ้นสุด"
            />
          </div>
          {!thumbnailFile && errors.thumbnail && (
            <p className="text-accent04 text-sm">{errors.thumbnail.message}</p>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <div className="flex gap-x-4">
            <Button variant="outlined" onClick={handleCancel} size="large">
              ยกเลิก
            </Button>
            <Button variant="contained" type="submit" size="large" disabled={categories.length === 0}>
              บันทึก
            </Button>
          </div>
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

export default CreateNewsForm;
