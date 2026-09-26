"use client";
import { useState, useMemo, useEffect } from "react";
import { INews } from "@/core/domain/news";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useForm, SubmitHandler } from "react-hook-form";
import { RHFTextField } from "@/components/form/RHFTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RHFSelect } from "@/components/form/RHFSelect";
import { Button, MenuItem, Alert, Snackbar, Modal, IconButton, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";
import { styled } from "@mui/material/styles";
import { NewsService } from "@/core/service/news.service";
import { NewsRepository } from "@/infra/repositories/news.repository";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { Tag } from "@/core/domain/list-type";
import { CropImageCard } from "@/components/cropimagecard";
import {
  UpdateNewsSchema,
  UpdateNewsInputs,
  UpdateNewsPayload,
} from "@/core/schema/news";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface NewsInfoProps {
  news: INews;
  apiBase: string;
  categories: Tag[];
}

type NewsAsset = { key: string; source: string | File; id?: number };

const savedAssets = (news: INews): NewsAsset[] =>
  (news.newsAdditionalImages ?? []).map((image) => ({
    key: `saved-${image.id}`,
    source: image.imageUrl,
    id: image.id,
  }));

const formValues = (news: INews): UpdateNewsInputs => ({
  title: news.title,
  startDate: dayjs(news.startDate).toISOString(),
  dueDate: news.dueDate ? dayjs(news.dueDate).toISOString() : "",
  tag: news.tag.id,
  detail: news.detail,
  thumbnail: news.thumbnailURL,
  thumbnailFocalPointX: news.thumbnailFocalPointX ?? undefined,
  thumbnailFocalPointY: news.thumbnailFocalPointY ?? undefined,
});

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

const NewsInfo = ({ news, apiBase, categories }: NewsInfoProps) => {
  const router = useRouter();
  const [savedNews, setSavedNews] = useState(news);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<NewsAsset[]>(() =>
    savedAssets(news),
  );
  const [assetsError, setAssetsError] = useState("");
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(
    null,
  );

  const newsService = useMemo(() => {
    const newsRepository = new NewsRepository(apiBase);
    return new NewsService(newsRepository);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<UpdateNewsInputs>({
    resolver: zodResolver(UpdateNewsSchema),
    defaultValues: formValues(news),
  });

  const thumbnail = watch("thumbnail");
  const disabled = !isEdit || isSubmitting;
  const originalAssets = savedAssets(savedNews);
  const assetsChanged =
    selectedAssets.length !== originalAssets.length ||
    selectedAssets.some(
      (asset, index) => asset.key !== originalAssets[index]?.key,
    );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setCroppingFile(file);
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

  const updateAssets = (assets: NewsAsset[]) => {
    setSelectedAssets(assets);
    setAssetsError("");
  };

  const handleAssetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (selectedAssets.length + files.length > 10) {
      setAssetsError("อัปโหลดรูปภาพเพิ่มเติมได้สูงสุด 10 รูป");
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/"))) {
      setAssetsError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    updateAssets([
      ...selectedAssets,
      ...files.map((file) => ({ key: crypto.randomUUID(), source: file })),
    ]);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const moveAsset = (from: number, to: number) => {
    if (disabled || from === to || !selectedAssets[from] || !selectedAssets[to])
      return;
    const assets = [...selectedAssets];
    assets.splice(to, 0, assets.splice(from, 1)[0]);
    updateAssets(assets);
  };

  const handleDrop = (index: number) => {
    if (draggedItemIndex !== null) moveAsset(draggedItemIndex, index);
    handleDragEnd();
  };

  const assetAtPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const key = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-news-asset]")?.dataset.newsAsset;
    return selectedAssets.findIndex((asset) => asset.key === key);
  };

  const resetEditing = () => {
    reset(formValues(savedNews));
    updateAssets(savedAssets(savedNews));
    handleDragEnd();
    setCroppingFile(null);
    setIsError(false);
    setIsEdit(false);
    setConfirmModal(null);
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

  const onSubmit: SubmitHandler<UpdateNewsInputs> = async (data) => {
    if (!isEdit) return;
    if (selectedAssets.length < 1 || selectedAssets.length > 10) {
      setAssetsError("กรุณาอัปโหลดรูปภาพเพิ่มเติม 1–10 รูป");
      return;
    }
    const newAdditionalImages = selectedAssets.flatMap((asset) =>
      asset.source instanceof File ? [asset.source] : [],
    );
    const deletedAdditionalImagesId = originalAssets
      .filter(
        (asset) => !selectedAssets.some((selected) => selected.id === asset.id),
      )
      .map((asset) => asset.id!);
    if (
      !isDirty &&
      !newAdditionalImages.length &&
      !deletedAdditionalImagesId.length
    ) {
      resetEditing();
      return;
    }
    setIsError(false);
    try {
      const payload: UpdateNewsPayload = {
        title: data.title,
        tagID: data.tag,
        detail: data.detail,
        thumbnail: data.thumbnail instanceof File ? data.thumbnail : undefined,
        startDate: dayjs(data.startDate).toISOString(),
        dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
        thumbnailFocalPointX: data.thumbnailFocalPointX,
        thumbnailFocalPointY: data.thumbnailFocalPointY,
        newAdditionalImages,
        deletedAdditionalImagesId,
      };
      const response = await newsService.updateNews(savedNews.id, payload);
      if (!response) {
        setIsError(true);
        return;
      }
      const latestNews = await newsService
        .getNewsById(String(savedNews.id))
        .catch(() => ({
          ...savedNews,
          ...response,
          newsAdditionalImages: [
            ...(savedNews.newsAdditionalImages ?? []).filter(
              (image) => !deletedAdditionalImagesId.includes(image.id),
            ),
            ...(response.newsAdditionalImages ?? []),
          ],
        }));
      setSavedNews(latestNews);
      reset(formValues(latestNews));
      updateAssets(savedAssets(latestNews));
      handleDragEnd();
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          setIsEdit(false);
          router.push(`/admin/news?page=1`);
          router.refresh();
        },
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const uploadAssetsButton = (
    <Button
      variant="contained"
      component="label"
      disabled={isSubmitting}
      sx={{ height: "40px" }}
    >
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        multiple
        disabled={isSubmitting}
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
        onClose={() => setIsError(false)}
      >
        <Alert
          severity="error"
          onClose={() => setIsError(false)}
          sx={{ width: "100%" }}
        >
          ไม่สามารถบันทึกข้อมูลข่าวสารได้
        </Alert>
      </Snackbar>
      <h3 className="mb-6 font-bold">
        {isEdit ? "แก้ไขข้อมูลข่าวสาร" : "ข้อมูลข่าวสาร"}
      </h3>
      <form className="gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
            <div className="flex w-full shrink-0 flex-col gap-2 md:w-[400px]">
              <div className="text-neutral04 text-h4 font-medium">
                ภาพหน้าปก
              </div>
              <div className="group border-neutral03 bg-neutral02 relative flex aspect-[382/254] w-full items-center justify-center overflow-hidden rounded-xl border">
                <NewsImage source={thumbnail} alt="ภาพหน้าปก" />
                {isEdit && (
                  <div className="bg-neutral05/40 absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0">
                    <Button
                      variant="contained"
                      component="label"
                      disabled={isSubmitting}
                    >
                      อัปโหลดรูปภาพ
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting}
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
                รูปภาพเพิ่มเติม <span className="text-accent04">*</span>
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
                  disabled={isSubmitting}
                  onClick={() => updateAssets([])}
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
                      setDraggedItemIndex(index);
                      setDragOverItemIndex(index);
                    }}
                    onPointerMove={(event) => {
                      if (
                        disabled ||
                        event.pointerType === "mouse" ||
                        draggedItemIndex === null
                      )
                        return;
                      setDragOverItemIndex(assetAtPointer(event));
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
                      setDraggedItemIndex(index);
                    }}
                    onDragEnter={() => {
                      if (!disabled && draggedItemIndex !== null)
                        setDragOverItemIndex(index);
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
                        disabled={isSubmitting}
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
                        onClick={() =>
                          updateAssets(
                            selectedAssets.filter((_, i) => i !== index),
                          )
                        }
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
                disabled={isSubmitting}
                size="large"
              >
                ยกเลิก
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                size="large"
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="contained"
              onClick={() => setIsEdit(true)}
              size="large"
            >
              แก้ไขข้อมูล
            </Button>
          )}
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

export default NewsInfo;
