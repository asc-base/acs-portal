"use client";
import { Button, MenuItem, Alert, Snackbar, Modal } from "@mui/material";
import React, { useState, useMemo } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { Tag } from "@/core/domain/list-type";
import { CropImageCard } from "@/components/cropimagecard";
import { CreateNewsInputs, CreateNewsSchema } from "@/core/schema/news";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface CreateNewsProps {
  apiBase: string;
  categories: Tag[];
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

const CreateNewsForm = ({ apiBase, categories }: CreateNewsProps) => {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<File[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  const router = useRouter();

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
      additionalImages: [],
    },
  });

  const thumbnailFile = watch("thumbnail");

  const newsService = useMemo(() => {
    const newsRepository = new NewsRepository(apiBase);
    return new NewsService(newsRepository);
  }, [apiBase]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCroppingFile(file);
    event.target.value = "";
  };

  const handleUploadComplete = (
    file: File,
    focalPoint?: { x: number; y: number },
  ) => {
    setValue("thumbnail", file, { shouldDirty: true, shouldValidate: true });
    if (focalPoint) {
      setValue("thumbnailFocalPointX", focalPoint.x, { shouldDirty: true });
      setValue("thumbnailFocalPointY", focalPoint.y, { shouldDirty: true });
    }
    setCroppingFile(null);
  };

  const handleAssetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const combined = [...selectedAssets, ...newFiles].slice(0, 10);
      setSelectedAssets(combined);
      setValue("additionalImages", combined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    event.target.value = "";
  };

  const removeAsset = (indexToRemove: number) => {
    const updated = selectedAssets.filter((_, index) => index !== indexToRemove);
    setSelectedAssets(updated);
    setValue("additionalImages", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeAllAssets = () => {
    setSelectedAssets([]);
    setValue("additionalImages", [], { shouldDirty: true, shouldValidate: true });
  };

  const handleDragStart = (index: number) => setDraggedItemIndex(index);
  const handleDragEnter = (index: number) => setDragOverItemIndex(index);
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };
  const handleDrop = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      const newAssets = [...selectedAssets];
      const draggedItem = newAssets[draggedItemIndex];
      newAssets.splice(draggedItemIndex, 1);
      newAssets.splice(index, 0, draggedItem);
      setSelectedAssets(newAssets);
      setValue("additionalImages", newAssets, { shouldDirty: true });
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleCancel = () => {
    if (isDirty){ 
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          reset();
          setConfirmModal(null);
          router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
        },
      });
    } else {
      reset();
      router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
    }
  };

  const onSubmit: SubmitHandler<CreateNewsInputs> = async (data) => {
    try {
        const payload: CreateNewsInputs = {
          title: data.title,
          tagID: data.tagID,
          detail: data.detail,
          thumbnail: data.thumbnail,
          startDate: dayjs(data.startDate).toISOString(),
          dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
          thumbnailFocalPointX: data.thumbnailFocalPointX,
          thumbnailFocalPointY: data.thumbnailFocalPointY,
          additionalImages: data.additionalImages,
        };

        const response = await newsService.createNews(payload);

        if (response) {
          setConfirmModal({
            isOpen: true,
            type: "success",
            onClose: () => setConfirmModal(null),
            onConfirm: () => {
              setConfirmModal(null);
              router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
            },
          });
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
  };

  return (
    <div className="p-8">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={() => setIsError(false)}
      >
        <Alert
          severity="error"
          onClose={() => setIsError(false)}
          sx={{ width: "100%" }}
        >
          ไม่สามารถเพิ่มข่าวสารได้
        </Alert>
      </Snackbar>
      <h3 className="mb-6 font-bold">ข้อมูลข่าวสาร</h3>
      <form className="gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
            <div className="flex w-full md:w-[400px] flex-col gap-2 shrink-0">
              <div className="text-neutral04 text-h4 font-medium">
                ภาพหน้าปก
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
                  onClick={removeAllAssets}
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
            <Button variant="contained" type="submit" size="large">
              บันทึก
            </Button>
          </div>
        </div>
      </form>

      <Modal open={!!croppingFile} onClose={() => setCroppingFile(null)}>
        <div>
          {croppingFile && (
            <CropImageCard
              file={croppingFile}
              width={382}
              height={254}
              onUploadComplete={handleUploadComplete}
              onCancel={() => setCroppingFile(null)}
            />
          )}
        </div>
      </Modal>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default CreateNewsForm;
