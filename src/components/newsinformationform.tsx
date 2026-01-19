"use client";

import { useState, useMemo } from "react";
import { Button, TextField, Modal, Autocomplete } from "@mui/material";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CropImageCard } from "./cropimagecard";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modal/confirmModal";
import { ConfirmModalProps } from "@/components/modal/confirmModal";

interface NewsInformationFormProps {
  type: string;
  apiBase: string;
}

type NewsItem = {
  id: number;
  title: string;
};

const Schema = z.object({
  image: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" }),
  newsId: z.number().min(1, "กรุณาเลือกข่าว"),
});

type FormValues = z.infer<typeof Schema>;

export const NewsInformationForm = ({
  type,
  apiBase,
}: NewsInformationFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
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
    formState: { errors, isDirty },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    defaultValues: {
      image: undefined,
      newsId: 0,
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
    } else router.push(`/admin/${type}`);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("newsId", data.newsId.toString());

      const response = await newsService.upsertNewsInformation(formData);
      if (response) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => router.push(`/admin/${type}`),
        });
      } else {
        setError("newsId", {
          type: "manual",
          message: "ข้อมูลข่าวไม่ถูกต้อง",
        });
      }
    } catch {
      setError("newsId", {
        type: "manual",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setOpen(true);
  };

  const handleUploadComplete = (file: File) => {
    setCroppedFile(file);

    setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setOpen(false);
  };

  const handleSearch = async (title: string) => {
    setLoading(true);
    try {
      const { rows } = await newsService.getNews(1, 10, title, "");
      setOptions(rows);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-[32px] py-[28px]">
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
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="contained" component="label">
                อัปโหลดรูปภาพ
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            )}
          </div>

          <div className="w-full">
            <Controller
              name="newsId"
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
                      error={!!errors.newsId}
                      required
                      label="ข่าวสาร"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
