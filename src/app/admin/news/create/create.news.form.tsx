"use client";
import { Button, MenuItem, Alert, Snackbar, IconButton } from "@mui/material";
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

const CreateNewsForm = ({ apiBase, categories }: CraeteNewsProps) => {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  
  const [coverError, setCoverError] = useState(false);
  const [headerError, setHeaderError] = useState(false);

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
      setCoverFile(file);
      setCoverError(false);
    }
  };

  const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeaderFile(file);
      setHeaderError(false);
    }
  };

  const handleCancel = () => {
    if (isDirty || coverFile || headerFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          reset();
          setCoverFile(null);
          setHeaderFile(null);
          setConfirmModal(null);
          router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
        },
      });
    } else {
      reset();
      setCoverFile(null);
      setHeaderFile(null);
      router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!coverFile || !headerFile) {
      if (!coverFile) setCoverError(true);
      if (!headerFile) setHeaderError(true);
      return;
    }

    if (isDirty || coverFile || headerFile) {
      try {
        const payload: ICreateNews = {
          title: data.title,
          tagID: data.tagID,
          detail: data.detail,
          startDate: dayjs(data.startDate).toISOString(),
          dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
        };

        const response = await newsService.createNews(payload, coverFile, headerFile); 

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
      
      <h3 className="mb-6 font-bold text-xl">ข้อมูลข่าวสาร</h3>
      
      <form className="gap-4 p-4 bg-white rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-5 gap-6">
            
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-sm text-gray-500">ภาพหน้าปก</label>
              <div className={`bg-gray-100 flex items-center justify-center rounded-lg relative aspect-[4/3] w-full overflow-hidden ${coverError ? 'border border-red-500' : ''}`}>
                {coverFile ? (
                  <div className="group relative w-full h-full">
                    <Image
                      src={URL.createObjectURL(coverFile)}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label" sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                        เปลี่ยนรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={handleCoverChange}
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="text" component="label" sx={{ color: 'gray' }}>
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                    />
                  </Button>
                )}
              </div>
              {coverError && <p className="text-sm text-red-600">กรุณาอัปโหลดภาพหน้าปก</p>}
            </div>

            <div className="col-span-3 flex flex-col gap-2">
              <label className="text-sm text-gray-500">ภาพหัวเรื่อง</label>
              <div className={`bg-gray-100 flex items-center justify-center rounded-lg relative aspect-[2/1] w-full overflow-hidden ${headerError ? 'border border-red-500' : ''}`}>
                {headerFile ? (
                  <div className="group relative w-full h-full">
                    <Image
                      src={URL.createObjectURL(headerFile)}
                      alt="Header Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label" sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                        เปลี่ยนรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={handleHeaderChange}
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="text" component="label" sx={{ color: 'gray' }}>
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleHeaderChange}
                    />
                  </Button>
                )}
              </div>
              {headerError && <p className="text-sm text-red-600">กรุณาอัปโหลดภาพหัวเรื่อง</p>}
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

        <div className="mt-8 flex justify-end">
          <Button 
            variant="contained" 
            type="submit" 
            size="large"
            sx={{ 
              bgcolor: '#1a0b59',
              '&:hover': { bgcolor: '#130842' },
              px: 6 
            }}
          >
            แก้ไขข้อมูล
          </Button>
        </div>
      </form>
      
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default CreateNewsForm;