"use client";
import { Button, MenuItem, Alert, Snackbar, IconButton, Modal } from "@mui/material";
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
import { CropImageCard } from "@/components/cropimagecard";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface CreateNewsProps {
  apiBase: string;
  categories: Tag[];
}

const Schema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  detail: z.string().min(1, "กรุณากรอกรายละเอียด"),
  tagID: z.number().min(1, "กรุณาเลือกหมวดหมู่"),
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

const CreateNewsForm = ({ apiBase, categories }: CreateNewsProps) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [highlightFile, setHighlightFile] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  
  const [thumbnailError, setThumbnailError] = useState(false);
  const [highlightError, setHighlightError] = useState(false);

  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<"thumbnail" | "highlight" | null>(null);

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
      tagID: 0,
      detail: "",
    },
  });

  const newsService = useMemo(() => {
    const newsRepository = new NewsRepository(apiBase);
    return new NewsService(newsRepository);
  }, [apiBase]);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCroppingFile(file);
      setCropTarget("thumbnail");
      event.target.value = "";
    }
  };

  const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCroppingFile(file);
      setCropTarget("highlight");
      event.target.value = "";
    }
  };

  const handleUploadComplete = (file: File) => {
    if (cropTarget === "thumbnail") {
      setThumbnailFile(file);
      setThumbnailError(false);
    } else if (cropTarget === "highlight") {
      setHighlightFile(file);
      setHighlightError(false);
    }
    setCroppingFile(null);
    setCropTarget(null);
  };

  const handleCancel = () => {
    if (isDirty || thumbnailFile || highlightFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          reset();
          setThumbnailFile(null);
          setHighlightFile(null);
          setConfirmModal(null);
          router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
        },
      });
    } else {
      reset();
      setThumbnailFile(null);
      setHighlightFile(null);
      router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!thumbnailFile || !highlightFile) {
      if (!thumbnailFile) setThumbnailError(true);
      if (!highlightFile) setHighlightError(true);
      return;
    }

    if (isDirty || thumbnailFile || highlightFile) {
      try {
        const payload: ICreateNews = {
          title: data.title,
          tagID: data.tagID,
          detail: data.detail,
          startDate: dayjs(data.startDate).toISOString(),
          dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
        };

        const response = await newsService.createNews(payload, thumbnailFile, highlightFile); 

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
        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-5 gap-6">
            
             <div className="col-span-2 flex flex-col gap-2">
               <label className="text-sm text-neutral04">ภาพหน้าปก</label>
               <div className={`bg-neutral02 flex items-center justify-center rounded-lg relative aspect-[4/3] w-full overflow-hidden ${thumbnailError ? 'border border-accent04' : ''}`}>
                 {thumbnailFile ? (
                   <div className="group relative w-full h-full">
                     <Image
                       src={URL.createObjectURL(thumbnailFile)}
                       alt="Cover Preview"
                       fill
                       className="object-cover"
                     />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                       <Button variant="contained" component="label">
                         อัปโหลดรูปภาพ
                         <VisuallyHiddenInput
                           type="file"
                           accept="image/*"
                           onChange={handleCoverChange}
                         />
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <Button variant="text" component="label" className="text-neutral04">
                     อัปโหลดรูปภาพ
                     <VisuallyHiddenInput
                       type="file"
                       accept="image/*"
                       onChange={handleCoverChange}
                     />
                   </Button>
                 )}
               </div>
               {thumbnailError && <p className="text-sm text-accent04">กรุณาอัปโหลดภาพหน้าปก</p>}
             </div>
 
             <div className="col-span-3 flex flex-col gap-2">
               <label className="text-sm text-neutral04">ภาพหัวเรื่อง</label>
               <div className={`bg-neutral02 flex items-center justify-center rounded-lg relative aspect-[2/1] w-full overflow-hidden ${highlightError ? 'border border-accent04' : ''}`}>
                 {highlightFile ? (
                   <div className="group relative w-full h-full">
                     <Image
                       src={URL.createObjectURL(highlightFile)}
                       alt="Header Preview"
                       fill
                       className="object-cover"
                     />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                       <Button variant="contained" component="label">
                         อัปโหลดรูปภาพ
                         <VisuallyHiddenInput
                           type="file"
                           accept="image/*"
                           onChange={handleHeaderChange}
                         />
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <Button variant="text" component="label" className="text-neutral04">
                     อัปโหลดรูปภาพ
                     <VisuallyHiddenInput
                       type="file"
                       accept="image/*"
                       onChange={handleHeaderChange}
                     />
                   </Button>
                 )}
               </div>
               {highlightError && <p className="text-sm text-accent04">กรุณาอัปโหลดภาพหัวเรื่อง</p>}
             </div>

          </div>

          <RHFTextField
            name="title"
            control={control}
            label="หัวข้อ"
            requiredMark
            fullWidth
          />
          <RHFTextField
            control={control}
            name="detail"
            label="รายละเอียด"
            minRows={4}
            multiline
            fullWidth
            requiredMark
          />
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
              label="วันที่ครบกำหนด"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่ครบกำหนด"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-x-4">
          <Button 
            variant="outlined" 
            onClick={handleCancel} 
            size="large"
            className="w-37.5"
          >
            ยกเลิก
          </Button>
          <Button 
            variant="contained" 
            type="submit" 
            size="large"
            className="w-37.5"
          >
            บันทึกข้อมูล
          </Button>
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

export default CreateNewsForm;