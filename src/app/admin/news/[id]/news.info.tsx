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
import { Button, MenuItem, Alert, Snackbar, Modal } from "@mui/material";
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
import { CropImageCard } from "@/components/cropimagecard";

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
  thumbnail: z.instanceof(File).optional(),
  highlight: z.instanceof(File).optional(),
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
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null,);
  const [isError, setIsError] = useState(false);

  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<"thumbnail" | "highlight" | null>(null);

  const router = useRouter();

  const newsService = useMemo(() => {
    const newsRepository = new NewsRepository(apiBase);
    return new NewsService(newsRepository);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: news.title,
      startDate: dayjs(news.startDate),
      dueDate: news.dueDate ? dayjs(news.dueDate) : undefined,
      tag: news.tag.id,
      detail: news.detail,
      thumbnail: undefined,
      highlight: undefined,
    },
  });

  const thumbnailFile = watch("thumbnail");
  const highlightFile = watch("highlight");

  const previewThumbnailSrc = useMemo(() => {
    if (thumbnailFile instanceof File) return URL.createObjectURL(thumbnailFile);

    const baseUrl = (news)?.thumbnailURL;
    return baseUrl ? `${baseUrl}?t=${Date.now()}` : "https://picsum.photos/400/300";
  }, [thumbnailFile, news]);

const previewHighlightSrc = useMemo(() => {
    if (highlightFile instanceof File) return URL.createObjectURL(highlightFile);
    
    const baseUrl = (news)?.highlightURL;
    return baseUrl ? `${baseUrl}?t=${Date.now()}` : "https://picsum.photos/800/400";
}, [highlightFile, news]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>,target: "thumbnail"|"highlight") => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCroppingFile(file);
    setCropTarget(target);
    event.target.value = "";
      
  };

  const handleUploadComplete = (file: File) => {
    if (cropTarget === "thumbnail") {
      setValue("thumbnail", file, { shouldValidate: true, shouldDirty: true });
    } else if (cropTarget === "highlight") {
      setValue("highlight", file, { shouldValidate: true, shouldDirty: true });
    }
    setCroppingFile(null);
    setCropTarget(null);
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          reset();
          setIsEdit(false);
          setConfirmModal(null);
        },
      });
    } else {
      reset();
      setIsEdit(false);
    }
  };

  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isDirty || thumbnailFile instanceof File || highlightFile instanceof File) {
      try {
        const payload: IUpdateNews = {
          title: data.title,
          tagID: data.tag,
          detail: data.detail,
          startDate: dayjs(data.startDate).toISOString(),
          dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
        };

        const response = await newsService.updateNews(
          news.id,
          payload,
          thumbnailFile instanceof File ? thumbnailFile : null,
          highlightFile instanceof File ? highlightFile : null
        );

        if (!response) {
            setIsError(true);
            return;
        }

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
    } else {
      setIsEdit(false);
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
      <h3 className="mb-6 font-bold">{isEdit ? "แก้ไขข้อมูลข่าวสาร" : "ข้อมูลข่าวสาร"}</h3>
      <form className="gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            <div className="col-span-2 flex flex-col gap-2">
              <label className={`text-sm font-medium ${isEdit ? "text-gray-700" : "text-gray-500"}`}>
                ภาพหน้าปก
              </label>
              <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                <Image
                  src={previewThumbnailSrc}
                  alt="Thumbnail Preview"
                  fill
                  className="object-cover"
                />
                {isEdit && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button variant="contained" component="label" sx={{ bgcolor: "#1E1B4B", "&:hover": { bgcolor: "#312E81" } }}>
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
            </div>

            <div className="col-span-3 flex flex-col gap-2">
              <label className={`text-sm font-medium ${isEdit ? "text-gray-700" : "text-gray-500"}`}>
                ภาพหัวเรื่อง
              </label>
              <div className="group relative aspect-[2/1] md:aspect-auto md:flex-1 w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                <Image
                  src={previewHighlightSrc}
                  alt="Highlight Preview"
                  fill
                  className="object-cover"
                />
                {isEdit && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button variant="contained" component="label" sx={{ bgcolor: "#1E1B4B", "&:hover": { bgcolor: "#312E81" } }}>
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
            </div>
  
          </div>

          <RHFTextField
            name="title"
            control={control}
            label="หัวข้อ"
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
              label="วันที่ครบกำหนด" 
              format="D MMMM YYYY"
              placeholder="เลือกวันที่ครบกำหนด"
              disabled={!isEdit}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          {isEdit ? (
            <div className="flex gap-x-4">
              <Button 
                variant="outlined" 
                onClick={handleCancel} 
                size="large"
                sx={{ borderColor: "#1E1B4B", color: "#1E1B4B", px: 4 }}
              >
                ยกเลิก
              </Button>
              <Button 
                variant="contained" 
                type="submit" 
                size="large"
                sx={{ bgcolor: "#1E1B4B", "&:hover": { bgcolor: "#312E81" }, px: 4 }}
              >
                บันทึกข้อมูล
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="contained"
                onClick={() => setIsEdit(true)}
                size="large"
                sx={{ bgcolor: "#1E1B4B", "&:hover": { bgcolor: "#312E81" }, px: 4 }}
              >
                แก้ไขข้อมูล
              </Button>
            </div>
          )}
        </div>
      </form>

      <Modal open={!!croppingFile} onClose={() => setCroppingFile(null)}>
        <div>
          {croppingFile && cropTarget && (
            <CropImageCard
              file={croppingFile}
              width={cropTarget === "thumbnail" ? 400 : 800}
              height={cropTarget === "thumbnail" ? 300 : 400}
              onUploadComplete={handleUploadComplete}
              onCancel={() => {
                setCroppingFile(null);
                setCropTarget(null);
              }}
            />
          )}
        </div>
      </Modal>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default NewsInfo;