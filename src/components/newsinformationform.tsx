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
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import { styled } from "@mui/material/styles";
import {
  CreateNewsInformationSchema,
  CreateNewsInformationInputs,
} from "@/core/schema/news";

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
  } = useForm<CreateNewsInformationInputs>({
    resolver: zodResolver(CreateNewsInformationSchema(type)),
    mode: "onChange",
    defaultValues: {
      thumbnail: undefined,
      highlight: undefined,
      newsID: 0,
    },
  });

  const thumbnailFile = watch("thumbnail");
  const highlightFile = watch("highlight");

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

  const onSubmit = async (data: CreateNewsInformationInputs) => {
    try {
      const formData = new FormData();
      formData.append("thumbnail", data.thumbnail);
      if (data.highlight) {
        formData.append("highlight", data.highlight);
      }
      formData.append("newsID", data.newsID.toString());
      formData.append("tagID", tagID.toString());

      const response = await newsService.upsertNewsInformation(formData);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: "thumbnail" | "highlight") => {
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
      const { rows } = await newsService.getNews(1, 10, undefined, undefined, undefined, search);
      setOptions(rows);
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
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-3 flex flex-col gap-2">
                <div className="text-neutral05 text-sm font-medium">
                  ภาพไฮไลต์หลัก
                </div>
                <div className="group border-neutral03 bg-neutral02 relative flex h-[376px] w-full items-center justify-center overflow-hidden rounded-xl border">
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
                          เปลี่ยนรูปภาพ
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "thumbnail")}
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

              <div className="col-span-2 flex flex-col gap-2">
                <div className="text-neutral05 text-sm font-medium">
                  ภาพไฮไลต์รอง
                </div>
                <div className="group border-neutral03 bg-neutral02 relative flex h-[376px] w-full items-center justify-center overflow-hidden rounded-xl border">
                  {highlightFile ? (
                    <>
                      <Image
                        src={URL.createObjectURL(highlightFile)}
                        alt="Highlight Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="bg-neutral05/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <Button variant="contained" component="label">
                          เปลี่ยนรูปภาพ
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "highlight")}
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
                        onChange={(e) => handleFileChange(e, "highlight")}
                      />
                    </Button>
                  )}
                </div>
                {errors.highlight && (
                  <p className="text-accent04 text-sm">
                    {errors.highlight.message}
                  </p>
                )}
              </div>
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
                      src={URL.createObjectURL(thumbnailFile)}
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

        <Modal open={!!croppingFile} onClose={() => { setCroppingFile(null); setCropTarget(null); }}>
          <div>
            {croppingFile && cropTarget && (
              <CropImageCard
                file={croppingFile}
                width={cropTarget === "highlight" ? 207 : isHighlight ? 706 : 590}
                height={cropTarget === "highlight" ? 180 : isHighlight ? 376 : 440}
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
          <Button variant="outlined" onClick={cancelForm}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained">
            บันทึกข้อมูล
          </Button>
        </div>

        {confirmModal && <ConfirmModal {...confirmModal} />}
      </form>
    </div>
  );
};
