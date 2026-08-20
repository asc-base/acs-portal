"use client";

import { useState, useMemo } from "react";
import {
  Button,
  TextField,
  Modal,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CropImageCard } from "./cropimagecard";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { useRouter } from "next/navigation";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { styled } from "@mui/material/styles";
import { INewsInformation } from "@/core/domain/news";
import {
  UpsertNewsInformationSchema,
  UpsertNewsInformationInputs,
} from "@/core/schema/newsinformation";

interface NewsInformationInfoProps {
  type: string;
  apiBase: string;
  tagID: number;
  newsInformation: INewsInformation;
}

type NewsItem = {
  id: number;
  title: string;
};

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

export const NewsInformationInfo = ({
  type,
  apiBase,
  tagID,
  newsInformation,
}: NewsInformationInfoProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [cropTarget, setCropTarget] = useState<
    "thumbnail" | "highlight" | null
  >(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    newsInformation.thumbnailURL || "",
  );
  const [highlightPreview, setHighlightPreview] = useState<string>(
    newsInformation.highlightURL || "",
  );

  const [options, setOptions] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const newsService = useMemo(() => {
    const repo = new NewsRepository(apiBase);
    return new NewsService(repo);
  }, [apiBase]);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
    reset,
  } = useForm<UpsertNewsInformationInputs>({
    resolver: zodResolver(UpsertNewsInformationSchema),
    mode: "onChange",
    defaultValues: {
      thumbnail: newsInformation.thumbnailURL,
      highlight: newsInformation.highlightURL || undefined,
      newsID: newsInformation.news.id,
      thumbnailFocalPointX: newsInformation.thumbnailFocalPointX,
      thumbnailFocalPointY: newsInformation.thumbnailFocalPointY,
      highlightFocalPointX: newsInformation.highlightFocalPointX,
      highlightFocalPointY: newsInformation.highlightFocalPointY,
      tagID: tagID,
    },
  });

  const onSubmit = async (data: UpsertNewsInformationInputs) => {
    try {
      const response = await newsService.upsertNewsInformation(data);

      if (response) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            resetFormState();
            setConfirmModal(null);
            router.push(`/admin/newsinformation/${tagID}`);
          },
        });
        return;
      }

      setIsError(true);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "thumbnail" | "highlight",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setCropTarget(target);
    setOpenCrop(true);
    e.target.value = "";
  };

  const handleUploadComplete = (
    file: File,
    focalPoint?: { x: number; y: number },
  ) => {
    const previewUrl = URL.createObjectURL(file);
    if (cropTarget === "thumbnail") {
      setValue("thumbnail", file, { shouldValidate: true, shouldDirty: true });
      if (focalPoint) {
        setValue("thumbnailFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("thumbnailFocalPointY", focalPoint.y, { shouldDirty: true });
      }
      setThumbnailPreview(previewUrl);
    } else if (cropTarget === "highlight") {
      setValue("highlight", file, { shouldValidate: true, shouldDirty: true });
      if (focalPoint) {
        setValue("highlightFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("highlightFocalPointY", focalPoint.y, { shouldDirty: true });
      }
      setHighlightPreview(previewUrl);
    }
    setOpenCrop(false);
    setSelectedFile(null);
    setCropTarget(null);
  };

  const handleSearch = async (search: string) => {
    setLoading(true);
    try {
      const { rows } = await newsService.getNews(
        1,
        10,
        undefined,
        undefined,
        undefined,
        search,
      );
      setOptions(rows);
    } finally {
      setLoading(false);
    }
  };

    const handleUploadComplete = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        if (cropTarget === "thumbnail") {
            setValue("thumbnail", file, { shouldValidate: true, shouldDirty: true });
            setThumbnailPreview(previewUrl);
        } else if (cropTarget === "highlight") {
            setValue("highlight", file, { shouldValidate: true, shouldDirty: true });
            setHighlightPreview(previewUrl);
        }
        setOpenCrop(false);
        setSelectedFile(null);
        setCropTarget(null);
    };
  const resetFormState = () => {
    reset();
    setIsEdit(false);
    setSelectedFile(null);
    setThumbnailPreview(newsInformation.thumbnailURL || "");
    setHighlightPreview(newsInformation.highlightURL || "");
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          resetFormState();
          setConfirmModal(null);
        },
      });
    } else {
      resetFormState();
    }
  };

    const resetFormState = () => {
        reset();
        setIsEdit(false);
        setSelectedFile(null);
        setCropTarget(null);
        setOpenCrop(false);
        setThumbnailPreview(newsInformation.thumbnailURL || "");
        setHighlightPreview(newsInformation.highlightURL || "");
    };
  const isHighlightType = type !== "announcement";
  const labelMain = isHighlightType ? "ภาพไฮไลต์หลัก" : "ภาพประชาสัมพันธ์หลัก";
  const labelSub = isHighlightType ? "ภาพไฮไลต์รอง" : "ภาพประชาสัมพันธ์รอง";

  return (
    <div className="px-[32px] py-[28px]">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={() => setIsError(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>

      <h3 className="mb-6 font-bold">
        {isEdit
          ? isHighlightType
            ? "แก้ไขข้อมูลข่าวไฮไลต์"
            : "แก้ไขข้อมูลข่าวประชาสัมพันธ์"
          : isHighlightType
            ? "ข้อมูลข่าวไฮไลต์"
            : "ข้อมูลข่าวประชาสัมพันธ์"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              className={`text-h5 font-medium ${isEdit ? "text-neutral05" : "text-neutral04"}`}
            >
              {labelMain}
            </label>
            <div className="bg-neutral02 border-neutral03 relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-md border">
              {thumbnailPreview ? (
                <div className="group relative h-full w-full">
                  <Image
                    src={thumbnailPreview}
                    alt="thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  {isEdit && (
                    <div className="bg-primary01/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label">
                        อัปโหลดรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "thumbnail")}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                isEdit && (
                  <Button variant="contained" component="label">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "thumbnail")}
                    />
                  </Button>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className={`text-h5 font-medium ${isEdit ? "text-neutral05" : "text-neutral04"}`}
            >
              {labelSub}
            </label>
            <div className="bg-neutral02 border-neutral03 relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-md border">
              {highlightPreview ? (
                <div className="group relative h-full w-full">
                  <Image
                    src={highlightPreview}
                    alt="highlight preview"
                    fill
                    className="object-cover"
                  />
                  {isEdit && (
                    <div className="bg-primary01/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label">
                        อัปโหลดรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "highlight")}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                isEdit && (
                  <Button variant="contained" component="label">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "highlight")}
                    />
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

                <Modal
                    open={openCrop}
                    onClose={() => {
                        setOpenCrop(false);
                        setSelectedFile(null);
                        setCropTarget(null);
                    }}
                >
                    <div>
                        {selectedFile && cropTarget && (
                            <CropImageCard
                                file={selectedFile}
                                width={cropTarget === "highlight" ? 207 : isHighlightType ? 706 : 590}
                                height={cropTarget === "highlight" ? 180 : isHighlightType ? 376 : 440}
                                onUploadComplete={handleUploadComplete}
                                onCancel={() => {
                                    setOpenCrop(false);
                                    setSelectedFile(null);
                                    setCropTarget(null);
                                }}
                            />
                        )}
                    </div>
                </Modal>
        <div className="w-full">
          <label
            className={`text-h5 mb-1 block font-medium ${isEdit ? "text-neutral05" : "text-neutral04"}`}
          >
            ข่าวสาร <span className="text-accent04">*</span>
          </label>
          <Controller
            name="newsID"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disabled={!isEdit}
                popupIcon={null}
                options={options}
                loading={loading}
                value={
                  field.value
                    ? (options.find((o) => o.id === field.value) ?? {
                        id: newsInformation.news.id,
                        title: newsInformation.news.title,
                      })
                    : null
                }
                getOptionLabel={(opt) => opt.title}
                onInputChange={(_, value) => handleSearch(value)}
                onChange={(_, value) => field.onChange(value?.id || 0)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="ค้นหาข่าว"
                    disabled={!isEdit}
                    required
                  />
                )}
              />
            )}
          />
        </div>

        <Modal
          open={openCrop}
          onClose={() => {
            setOpenCrop(false);
            setSelectedFile(null);
            setCropTarget(null);
          }}
        >
          <div>
            {selectedFile && cropTarget && (
              <CropImageCard
                file={selectedFile}
                width={cropTarget === "highlight" ? 287 : isHighlightType ? 706 : 590}
                height={cropTarget === "highlight" ? 180 : isHighlightType ? 376 : 440}
                onUploadComplete={handleUploadComplete}
                onCancel={() => {
                  setOpenCrop(false);
                  setSelectedFile(null);
                  setCropTarget(null);
                }}
              />
            )}
          </div>
        </Modal>

        <div className="mt-6 flex justify-end gap-x-4">
          {isEdit ? (
            <>
              <Button variant="outlined" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button type="submit" variant="contained" disabled={!isValid}>
                บันทึกข้อมูล
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => setIsEdit(true)}>
              แก้ไขข้อมูล
            </Button>
          )}
        </div>
      </form>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};
