"use client";
import { Button, MenuItem, Alert, Snackbar } from "@mui/material";
import React, { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { ICreateNews } from "@/core/domain/news";
import { z } from "zod";
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

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface CraeteNewsProps {
  apiBase: string;
  tags: Tag[];
}

const Schema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  detail: z.string().min(1, "กรุณากรอกรายละเอียด"),
  tagId: z.number().min(1, "กรุณาเลือกหมวดหมู่"),
  startDate: z
    .string()
    .min(1, "กรุณาเลือกวันที่เริ่มต้น")
    .refine((val) => dayjs(val).isValid(), {
      message: "รูปแบบวันที่ไม่ถูกต้อง",
    }),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof Schema>;

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

const CreateNewsForm = ({ apiBase, tags }: CraeteNewsProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      startDate: undefined,
      dueDate: undefined,
      tagId: 0,
      detail: "",
    },
  });

  const newsService = useMemo(() => {
    const newsRepository = new NewsRepository(apiBase);
    return new NewsService(newsRepository);
  }, [apiBase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageError(false);
    }
  };

  const handleCancel = () => {
    if (isDirty || selectedFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          reset();
          setSelectedFile(null);
          setConfirmModal(null);
          router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
        },
      });
    } else {
      reset();
      setSelectedFile(null);
      router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isDirty || selectedFile) {
      try {
        if (!selectedFile) {
          setImageError(true);
          return;
        }
        const payload: ICreateNews = {
          title: data.title,
          tagId: data.tagId,
          detail: data.detail,
          startDate: dayjs(data.startDate).toISOString(),
          dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
        };

        const response = await newsService.createNews(payload, selectedFile);

        if (!response) setIsError(true);
        else {
          setConfirmModal({
            isOpen: true,
            type: "success",
            onClose: () => setConfirmModal(null),
            onConfirm: () => {
              setConfirmModal(null);
              router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
            },
          });
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
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
          <div className="bg-neutral02 flex min-h-[500px] items-center justify-center rounded-lg">
            {selectedFile ? (
              <div className="group relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  fill
                  sizes="100vw"
                  className="rounded-md object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button variant="contained" component="label">
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="contained" component="label" size="large">
                อัปโหลดรูปภาพ
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            )}
          </div>
          {imageError && (
            <p className="mt-1 text-sm text-red-600">กรุณาอัปโหลดรูปภาพ</p>
          )}
          <RHFTextField
            name="title"
            control={control}
            label="หัวข้อข่าว"
            requiredMark
            fullWidth
          />
          <RHFTextField
            control={control}
            name="detail"
            label="รายละเอียด"
            minRows={2}
            multiline
            fullWidth
            requiredMark
          />
          <RHFSelect
            name="tagId"
            control={control}
            label="หมวดหมู่"
            requiredMark
            fullWidth
          >
            {tags.map((tag) => (
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
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default CreateNewsForm;
