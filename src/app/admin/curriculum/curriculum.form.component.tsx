"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";
import { CurriculumService } from "@/core/service/curriculum.service";

interface CurriculumFormProps {
  apiBase: string;
}

const Schema = z.object({
  image: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" }),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  fileUrl: z.string().url("รูปแบบลิงก์ไม่ถูกต้อง").min(1, "กรุณาระบุลิงก์"),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
});

type FormValues = z.infer<typeof Schema>;

export const CurriculumForm = ({
   apiBase 
}: CurriculumFormProps) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const curriculumService = useMemo(() => {
    const repo = new CurriculumRepository(apiBase);
    return new CurriculumService(repo);
  }, [apiBase]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
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
        <div className="bg-neutral02 relative  flex h-[284px] w-[590px] flex-col items-center justify-center overflow-hidden rounded-md  border-neutral04">
          {selectedFile ? (
            <div className="group relative h-full w-full">
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              fill
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button 
              variant="contained" 
              component="label"
              size="large"
              sx={{
                border: "1px solid var(--color-neutral04)",
                backgroundColor: "var(--color-neutral01)",
                color: "var(--color-neutral04)",
                boxShadow: "none",
                fontWeight: "bold",
                px: 4
              }}>
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
              <Button 
                variant="contained" 
                component="label"
                size="large"
                sx={{
                border: "1px solid var(--color-neutral04)",
                backgroundColor: "var(--color-neutral01)",
                color: "var(--color-neutral04)",
                boxShadow: "none",
                fontWeight: "bold",
                px: 4
              }}>
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

        <div className=" flex flex-col space-y-4 w-full">
          <div className="group">
            <h4 className={`mb-1 font-medium ${errors.year ? "text-red-500" : "text-gray-700"}`}>
              ปีการศึกษา
            </h4>
            <TextField
              {...register("year")}
              variant="outlined"
              size="medium"
              fullWidth
              error={!!errors.year}
              helperText={errors.year?.message}
            />
          </div>

          <div className="group">
            <h4 className={`mb-1 font-medium ${errors.fileUrl ? "text-red-500" : "text-gray-700"}`}>
              ลิงก์ (กรุณาแนบลิงก์ Google Drive)
            </h4>
            <TextField
              {...register("fileUrl")}
              variant="outlined"
              size="medium"
              fullWidth
              error={!!errors.fileUrl}
              helperText={errors.fileUrl?.message}
            />
          </div>
        </div>
      </div>

      <div className="group">
        <h4 className={`mb-1 font-medium ${errors.description ? "text-red-500" : "text-gray-700"}`}>
          รายละเอียด
        </h4>
        <TextField
          {...register("description")}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
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
