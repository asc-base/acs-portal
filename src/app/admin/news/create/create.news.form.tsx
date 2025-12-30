"use client";
import {
  Button,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import React from "react";
import { useState, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Image from "next/image";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { SuccessModal } from "@/components/modal/success";
import { ICreateNews } from "@/core/domain/news";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const Schema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  detail: z.string().min(1, "กรุณากรอกรายละเอียด"),
  categoryId: z.number().min(1, "กรุณาเลือกหมวดหมู่"),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  dueDate: z.string().nullable(),
});

type FormData = z.infer<typeof Schema>;

const CreateNewsForm = ({ apiBase }: { apiBase: string }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
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
  const [imageError, setImageError] = useState<string | null>(null);

  const router = useRouter();

  const categories = [
    {
      id: 16,
      name: "ข่าวประชาสัมพันธ์",
    },
    {
      id: 17,
      name: "ความสำเร็จนักศึกษา",
    },
    {
      id: 18,
      name: "งานกิจกรรมนักศึกษา",
    },
  ];

  const newsService = useMemo(() => {
    const repo = new NewsRepository(apiBase);
    return new NewsService(repo);
  }, [apiBase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit: SubmitHandler<ICreateNews> = async (data) => {
    if (!selectedFile) {
      setImageError("กรุณาอัปโหลดรูปภาพ");
      return;
    }

    try {
      const response = await newsService.createNews(data, selectedFile);

      if (response) setOpenSuccess(true);
    } catch (error) {
      console.error("Create news failed:", error);
    }
  };

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="font-bold">ข้อมูลข่าวสาร</h3>
      <div className="flex flex-row">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="bg-neutral02 flex h-71 w-100 items-center justify-center">
            {selectedFile ? (
              <div className="group relative h-full w-full">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={384}
                  height={192}
                  style={{ objectFit: "cover" }}
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
            <p className="mt-2 text-sm text-red-500">{imageError}</p>
          )}
        </div>
        <div className="gap- flex w-full flex-col justify-between">
          <TextField
            {...register("title", { required: "กรุณากรอกหัวข้อข่าวสาร" })}
            label="หัวข้อข่าวสาร"
            variant="outlined"
            size="medium"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <FormControl fullWidth size="medium" error={!!errors.categoryId}>
            <InputLabel id="category-label">หมวดหมู่</InputLabel>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "กรุณาเลือกหมวดหมู่" }}
              render={({ field }) => (
                <Select {...field} labelId="category-label" label="หมวดหมู่">
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.categoryId?.message}</FormHelperText>
          </FormControl>
          <div className="flex flex-row gap-4">
            <TextField
              {...register("startDate")}
              label="วันที่เริ่มต้น"
              type="date"
              variant="outlined"
              size="medium"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
            <TextField
              {...register("dueDate")}
              label="วันที่ครบกำหนด"
              type="date"
              variant="outlined"
              size="medium"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.dueDate}
            />
          </div>
        </div>
      </div>
      <div>
        <TextField
          {...register("detail")}
          label="เนื้อหาข่าวสาร"
          variant="outlined"
          size="medium"
          fullWidth
          multiline
          rows={12}
          error={!!errors.detail}
          helperText={errors.detail?.message}
        />
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          onClick={() => {
            router.push("/admin/news");
          }}
        >
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" color="primary" size="medium">
          บันทึกข้อมูลข่าวสาร
        </Button>
      </div>
      <SuccessModal
        open={openSuccess}
        type="news"
        onClose={() => setOpenSuccess(false)}
      />
    </form>
  );
};

export default CreateNewsForm;
