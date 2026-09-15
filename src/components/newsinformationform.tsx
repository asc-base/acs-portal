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
import {
  UpsertNewsInformationSchema,
  UpsertNewsInformationInputs,
} from "@/core/schema/newsinformation";

interface NewsInformationFormProps {
  type: string;
  apiBase: string;
  tagID: number;
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

export const NewsInformationForm = ({
  type,
  apiBase,
  tagID,
}: NewsInformationFormProps) => {
  const isHighlight = type === "newshighlight";
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<
    "thumbnail" | "highlight" | null
  >(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);

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
    watch,
    formState: { errors, isDirty },
  } = useForm<UpsertNewsInformationInputs>({
    resolver: zodResolver(UpsertNewsInformationSchema),
    mode: "onChange",
    defaultValues: {
      thumbnail: undefined,
      highlight: undefined,
      newsID: 0,
      tagID: tagID,
    },
  });

  const thumbnailFile = watch("thumbnail");

  const cancelForm = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/${type}`),
      });
    } else router.push(`/admin/newsinformation/${tagID}`);
  };

  const onSubmit = async (data: UpsertNewsInformationInputs) => {
    try {
      const payload = isHighlight
        ? { ...data, thumbnailFocalPointX: 0, thumbnailFocalPointY: 0 }
        : data;
      const response = await newsService.upsertNewsInformation(payload);

      if (response) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => router.push(`/admin/newsinformation/${tagID}`),
        });
        return;
      }

      setIsError(true);
    } catch {
      setIsError(true);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "thumbnail" | "highlight",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCroppingFile(file);
    setCropTarget(target);
    e.target.value = "";
  };

  const handleUploadComplete = (file: File) => {
    if (cropTarget === "thumbnail") {
      setValue("thumbnail", file, { shouldDirty: true, shouldValidate: true });
    } else if (cropTarget === "highlight") {
      setValue("highlight", file, { shouldDirty: true, shouldValidate: true });
    }
    setCroppingFile(null);
    setCropTarget(null);
  };

  const handleSearch = async (search: string) => {
    setLoading(true);
    try {
      const response = await newsService.getNews(
        1,
        10,
        undefined,
        undefined,
        undefined,
        search || undefined,
        "title",
      );
      setOptions(response.rows);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="mb-4 flex flex-row items-end">
        <h3 className="font-bold">
          {type === "announcement" ? "ข่าวประชาสัมพันธ์" : "ข่าว Highlight"}
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isHighlight ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {thumbnailFile ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral05 text-sm font-medium">
                      ตัวอย่างภาพแต่ละขนาด
                    </span>
                    <Button variant="outlined" size="small" component="label">
                      ↑ เปลี่ยนรูปภาพ
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                      />
                    </Button>
                  </div>
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: "276fr 362fr 450fr" }}
                  >
                    {([276, 362, 450] as const).map((w, i) => (
                      <div
                        key={i + 1}
                        className="relative overflow-hidden rounded-lg"
                        style={{ height: 240 }}
                      >
                        <Image
                          src={
                            thumbnailFile instanceof File
                              ? URL.createObjectURL(thumbnailFile)
                              : thumbnailFile
                          }
                          alt={`Preview ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: "487fr 624fr" }}
                  >
                    {([487, 624] as const).map((w, i) => (
                      <div
                        key={i + 4}
                        className="relative overflow-hidden rounded-lg"
                        style={{ height: 204 }}
                      >
                        <Image
                          src={
                            thumbnailFile instanceof File
                              ? URL.createObjectURL(thumbnailFile)
                              : thumbnailFile
                          }
                          alt={`Preview ${i + 4}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="border-neutral03 bg-neutral02 relative flex h-[290px] w-full items-center justify-center overflow-hidden rounded-xl border">
                    <Button variant="contained" component="label" sx={{ width: 200, height: 40, borderRadius: 1 }}>
                      อัปโหลดรูปภาพ
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                      />
                    </Button>
                  </div>
                  {errors.thumbnail && (
                    <p className="text-accent04 text-sm">
                      {errors.thumbnail.message}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="w-full">
              <Controller
                name="newsID"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    popupIcon={null}
                    options={options}
                    loading={loading}
                    getOptionLabel={(opt) => opt.title}
                    isOptionEqualToValue={(a, b) => a.id === b.id}
                    onInputChange={(_, value) => handleSearch(value)}
                    onChange={(_, value) => field.onChange(value?.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ค้นหาข่าว"
                        error={!!errors.newsID}
                        required
                        label="ข่าวสาร"
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-x-5">
            <div className="flex w-[590px] flex-col gap-2">
              <div className="bg-neutral02 flex h-[440px] w-full items-center justify-center overflow-hidden rounded-md border border-gray-200">
                {thumbnailFile ? (
                  <div className="group relative h-full w-full">
                    <Image
                      src={
                        thumbnailFile instanceof File
                          ? URL.createObjectURL(thumbnailFile)
                          : thumbnailFile
                      }
                      alt="Preview"
                      fill
                      priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label">
                        เปลี่ยนรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "thumbnail")}
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="contained" component="label">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "thumbnail")}
                    />
                  </Button>
                )}
              </div>
              {errors.thumbnail && (
                <p className="text-accent04 text-sm">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Controller
                name="newsID"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    popupIcon={null}
                    options={options}
                    loading={loading}
                    getOptionLabel={(opt) => opt.title}
                    isOptionEqualToValue={(a, b) => a.id === b.id}
                    onInputChange={(_, value) => handleSearch(value)}
                    onChange={(_, value) => field.onChange(value?.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ค้นหาข่าว"
                        error={!!errors.newsID}
                        required
                        label="ข่าวสาร"
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>
        )}

        <Modal
          open={!!croppingFile}
          onClose={() => {
            setCroppingFile(null);
            setCropTarget(null);
          }}
        >
          <div>
            {croppingFile && cropTarget && (
              <CropImageCard
                file={croppingFile}
                width={isHighlight ? 450 : 590}
                height={isHighlight ? 240 : 440}
                onUploadComplete={handleUploadComplete}
                onCancel={() => {
                  setCroppingFile(null);
                  setCropTarget(null);
                }}
              />
            )}
          </div>
        </Modal>

        <div className="mt-6 flex justify-end gap-x-4">
          <Button variant="outlined" onClick={cancelForm} sx={{ width: 200, height: 40, borderRadius: 1 }}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" sx={{ width: 200, height: 40, borderRadius: 1 }}>
            บันทึกข้อมูล
          </Button>
        </div>

        {confirmModal && <ConfirmModal {...confirmModal} />}
      </form>
    </div>
  );
};
