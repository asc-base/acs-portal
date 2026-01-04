"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";
import { CurriculumService } from "@/core/service/curriculum.service";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";

interface CurriculumFormProps {
  apiBase: string;
}

const Schema = z.object({
  image: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" }),
  title: z.string().min(1, "กรุณาระบุชื่อหลักสูตร"),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  fileUrl: z.string().url("กรุณาระบุลิงก์ที่ถูกต้อง"),
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

  const curriculumService = useMemo(() => {
    const repo = new CurriculumRepository(apiBase);
    return new CurriculumService(repo);
  }, [apiBase]);

  const { handleSubmit, control, setValue } = useForm<FormValues>({
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

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("title", data.title);
      formData.append("year", data.year);
      formData.append("fileUrl", data.fileUrl);
      formData.append("description", data.description);

      const response = await curriculumService.createCurriculum(formData);
      if (response) {
        router.push(`/admin/curriculum`);
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
          <div className="bg-neutral02 border-neutral04 relative flex h-[284px] w-[590px] flex-col items-center justify-center overflow-hidden rounded-md">
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
            />
            <RHFDatePickerDayjs
              control={control}
              name="year"
              label="ปี"
              views={["year"]}
              openTo="year"
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
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outlined"
            className="w-[150px]"
            size="large"
            onClick={() => router.back()}
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
      </form>
    </div>
  );
};
