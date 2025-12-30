"use client";
import { Button, MenuItem } from "@mui/material";
import React from "react";
import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { SuccessModal } from "@/components/modal/success";
import { ICreateNews } from "@/core/domain/news";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";

const Schema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  detail: z.string().min(1, "กรุณากรอกรายละเอียด"),
  categoryId: z.number().min(1, "กรุณาเลือกหมวดหมู่"),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  dueDate: z.string().nullable(),
});

type FormData = z.infer<typeof Schema>;

const CreateNewsForm = ({ apiBase }: { apiBase: string }) => {
  const { handleSubmit, control } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      categoryId: 0,
      startDate: "",
      dueDate: null,
      detail: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const router = useRouter();

  const categories = [
    { id: 16, name: "ข่าวประชาสัมพันธ์" },
    { id: 17, name: "ความสำเร็จนักศึกษา" },
    { id: 18, name: "งานกิจกรรมนักศึกษา" },
  ];

  const newsService = useMemo(() => {
    const repo = new NewsRepository(apiBase);
    return new NewsService(repo);
  }, [apiBase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const onSubmit: SubmitHandler<ICreateNews> = async (data) => {
    if (!selectedFile) {
      setImageError(true);
      return;
    }

    const response = await newsService.createNews(data, selectedFile);
    if (response) setOpenSuccess(true);
  };

  return (
    <form className="space-y-6 p-8" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="font-bold">ข้อมูลข่าวสาร</h3>
      <div className="flex items-start gap-8">
        <div className="flex w-[500px] flex-col items-start">
          <div className="bg-neutral02 flex h-[310px] w-full items-center justify-center">
            {selectedFile ? (
              <div className="group relative h-full w-full">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={384}
                  height={192}
                  className="h-full w-full object-cover"
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
                      px: 4,
                    }}
                  >
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
                variant="outlined"
                component="label"
                size="large"
                sx={{
                  border: "1px solid var(--color-neutral04)",
                  backgroundColor: "var(--color-neutral01)",
                  color: "var(--color-neutral04)",
                  boxShadow: "none",
                  fontWeight: "bold",
                  px: 4,
                }}
              >
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

          {imageError && (
            <p className="mt-2 w-full text-center text-sm text-red-600">
              กรุณาอัปโหลดรูปภาพ
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <RHFTextField
            control={control}
            name="title"
            label="หัวข้อข่าวสาร"
            fullWidth
          />

          <RHFSelect
            name="categoryId"
            control={control}
            label="หลักสูตร"
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </RHFSelect>

          <div className="flex w-full gap-4">
            <div className="flex-1">
              <RHFTextField
                control={control}
                name="startDate"
                label="วันที่เริ่มต้น"
                type="date"
                fullWidth
              />
            </div>
            <div className="flex-1">
              <RHFTextField
                control={control}
                name="dueDate"
                label="วันที่ครบกำหนด"
                type="date"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>

      <RHFTextField
        control={control}
        name="detail"
        label="เนื้อหาข่าวสาร"
        fullWidth
        multiline
        rows={12}
      />

      <div className="flex justify-end gap-4">
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          onClick={() => router.push("/admin/news")}
        >
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" color="primary" size="medium">
          บันทึกข้อมูลข่าวสาร
        </Button>
      </div>

      <SuccessModal
        open={openSuccess}
        path="news"
        onClose={() => setOpenSuccess(false)}
      />
    </form>
  );
};

export default CreateNewsForm;
