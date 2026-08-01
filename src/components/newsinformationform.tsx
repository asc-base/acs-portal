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
  UpsertNewsInformationInputs,
  UpsertNewsInformationSchema,
} from "@/core/schema/news";
import { IUpsertNewsFeature } from "@/core/domain/news";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
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
    formState: { errors, isDirty },
  } = useForm<UpsertNewsInformationInputs>({
    resolver: zodResolver(UpsertNewsInformationSchema),
    mode: "onChange",
    defaultValues: {
      thumbnail: undefined,
      newsID: 0,
      tagID,
    },
  });

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
      const payload: IUpsertNewsFeature = {
        thumbnail: data.thumbnail,
        newsID: data.newsID,
        tagID,
      };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    e.target.value = "";
    setOpen(true);
  };

  const handleUploadComplete = (file: File) => {
    setCroppedFile(file);
    setSelectedFile(null);

    setValue("thumbnail", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setOpen(false);
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
        <div className="flex gap-x-5">
          <div className="bg-neutral02 flex h-[440px] w-[590px] items-center justify-center overflow-hidden rounded-md border border-gray-200">
            {croppedFile ? (
              <div className="group relative h-full w-full">
                <Image
                  src={URL.createObjectURL(croppedFile)}
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
                      onChange={handleFileChange}
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
                  onChange={handleFileChange}
                />
              </Button>
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

        <Modal open={open} onClose={() => setOpen(false)}>
          <div>
            {selectedFile && (
              <CropImageCard
                file={selectedFile}
                width={590}
                height={440}
                onUploadComplete={handleUploadComplete}
                onCancel={() => setOpen(false)}
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
