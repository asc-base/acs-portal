"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";
import { CurriculumService } from "@/core/service/curriculum.service";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";

interface CurriculumFormProps {
  apiBase: string;
}

const Schema = z.object({
  image: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" }),
  title: z.string().min(1, "กรุณาระบุชื่อหลักสูตร"),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  fileUrl: z.url({ message: "กรุณาระบุลิงก์ที่ถูกต้อง" }),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
});

type FormValues = z.infer<typeof Schema>;

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

export const CurriculumForm = ({ apiBase }: CurriculumFormProps) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);

  const curriculumService = useMemo(() => {
    const repo = new CurriculumRepository(apiBase);
    return new CurriculumService(repo);
  }, [apiBase]);

  const { handleSubmit, control, setValue, formState: { isDirty } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    mode: "onChange",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("image", file, { shouldValidate: true });
    } else {
      setSelectedFile(null);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.back(),
      });
    } else {
      router.back();
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const year = dayjs(data.year).year().toString();
      const response = await curriculumService.createCurriculum({
        ...data,
        year,
      });
      
      if (response) {
        setConfirmModal({
            isOpen: true,
            type: "success",
            onClose: () => setConfirmModal(null),
            onConfirm: () => router.push(`/admin/curriculum`),
        });
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <div className="p-8">
      <h3 className="mb-6 font-bold">เพิ่มหลักสูตร</h3>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-x-10 gap-y-2">
          <div className="bg-neutral02 border-neutral04 relative flex h-[248px] w-[200px] flex-col items-center justify-center overflow-hidden rounded-md">
            {selectedFile ? (
              <div className="group relative h-full w-full">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  fill
                  priority
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

          <div className="flex w-full flex-col space-y-4">
            <RHFTextField
              control={control}
              name="title"
              label="ชื่อหลักสูตร"
              variant="outlined"
              size="small"
              required
            />
            <RHFDatePickerDayjs
              control={control}
              name="year"
              label="ปี"
              views={["year"]}
              openTo="year"
              required
            />
            <RHFTextField
              control={control}
              name="fileUrl"
              label="ลิงก์ไฟล์หลักสูตร (Google Drive หรือ OneDrive)"
              variant="outlined"
              size="small"
              required
            />
          </div>
        </div>

        <div className="group">
          <RHFTextField
            control={control}
            name="description"
            label="รายละเอียด"
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={4}
            required
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outlined"
            className="w-[150px]"
            size="large"
            onClick={handleCancel}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            className="w-[150px]"
          >
            บันทึกข้อมูล
          </Button>
        </div>

        {confirmModal && <ConfirmModal {...confirmModal} />}
      </form>
    </div>
  );
};
