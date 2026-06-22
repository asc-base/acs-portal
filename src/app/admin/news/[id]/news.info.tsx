"use client";
import { useState, useMemo } from "react";
import { INews, IUpdateNews } from "@/core/domain/news";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useForm, SubmitHandler } from "react-hook-form";
import { RHFTextField } from "@/components/form/RHFTextField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { RHFSelect } from "@/components/form/RHFSelect";
import { Button, MenuItem, Alert, Snackbar } from "@mui/material";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";
import { styled } from "@mui/material/styles";
import { NewsService } from "@/core/service/news.service";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { useRouter } from "next/navigation";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { Tag } from "@/core/domain/list-type";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface NewsInfoProps {
  news: INews;
  apiBase: string;
  categories: Tag[];
}

const formSchema = z.object({
  title: z.string(),
  startDate: z.custom<Dayjs>(),
  dueDate: z.custom<Dayjs>().nullable(),
  tag: z.number(),
  detail: z.string().optional(),
});

type Inputs = z.infer<typeof formSchema>;

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

const NewsInfo = ({ news, apiBase, categories }: NewsInfoProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const previewSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : news.highlightURL;

  const newsService = useMemo(() => {
    const newsRepository = new NewsRepository(apiBase);
    return new NewsService(newsRepository);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: news.title,
      startDate: dayjs(news.startDate),
      dueDate: news.dueDate ? dayjs(news.dueDate) : undefined,
      tag: news.tag.id,
      detail: news.detail,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleCancel = () => {
    if (isDirty || selectedFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setIsEdit(false);
          router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
        },
      });
    } else {
      setIsEdit(false);
      router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isDirty || selectedFile) {
      try {
        const payload: IUpdateNews = {
          title: data.title,
          tagID: data.tag,
          detail: data.detail,
          startDate: dayjs(data.startDate).toISOString(),

          dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
        };

        console.log(payload);

        const response = await newsService.updateNews(
          news.id,
          payload,
          selectedFile,
        );

        if (!response) setIsError(true);
        else {
          setConfirmModal({
            isOpen: true,
            type: "success",
            onClose: () => setConfirmModal(null),
            onConfirm: () => {
              setConfirmModal(null);
              setIsEdit(false);
              router.push(`/admin/news?page=1`);
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
          <div className="bg-neutral02 flex items-center justify-center rounded-lg">
            {news || selectedFile ? (
              <div className="group relative aspect-video h-[560px] w-full overflow-hidden rounded-xl">
                <Image
                  src={previewSrc}
                  alt="Preview"
                  fill
                  sizes="100vw"
                  className="rounded-md object-cover"
                />
                {isEdit && (
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
                )}
              </div>
            ) : (
              isEdit && (
                <Button variant="contained" component="label" size="large">
                  อัปโหลดรูปภาพ
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              )
            )}
          </div>
          <RHFTextField
            name="title"
            control={control}
            label="หัวข้อข่าว"
            disabled={!isEdit}
            required
            requiredMark
            fullWidth
          />
          <RHFTextField
            control={control}
            name="detail"
            disabled={!isEdit}
            label="รายละเอียด"
            minRows={2}
            multiline
            fullWidth
            required
            requiredMark
          />
          <RHFSelect
            name="tag"
            control={control}
            label="หมวดหมู่"
            disabled={!isEdit}
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
          <div className="grid grid-cols-2 gap-x-4">
            <RHFDatePickerDayjs
              name="startDate"
              control={control}
              label="วันที่เริ่มต้น"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่เริ่มต้น"
              disabled={!isEdit}
              requiredMark
            />
            <RHFDatePickerDayjs
              name="dueDate"
              control={control}
              label="วันที่สิ้นสุด"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่สิ้นสุด"
              disabled={!isEdit}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          {isEdit ? (
            <div className="flex gap-x-4">
              <Button variant="outlined" onClick={handleCancel} size="large">
                ยกเลิก
              </Button>
              <Button variant="contained" type="submit" size="large">
                บันทึก
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="contained"
                onClick={() => setIsEdit(true)}
                size="large"
              >
                แก้ไขข้อมูล
              </Button>
            </div>
          )}
        </div>
      </form>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default NewsInfo;
