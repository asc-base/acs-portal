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
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { fetchCategories } from "@/core/viewmodels/type";
import { Category } from "@/interface/type";
import Image from "next/image";

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

interface FormData {
  title: string;
  categoryId: number;
  startDate: string;
  dueDate: string | null;
  detail: string;
  image: FileList;
}

const CreateNewsPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    } else {
      setSelectedFile(null);
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form data submitted:", data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCategories("news");
      if (result instanceof Error) {
        console.error("Error fetching categories:", result);
      } else {
        setCategories(result);
      }
    };
    fetchData();
  }, []);

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="font-bold">ข้อมูลข่าวสาร</h3>
      <div className="flex flex-row">
        <div className="flex w-full items-center justify-center">
          <div className="bg-neutral02 flex h-80 w-96 items-center justify-center">
            {selectedFile ? (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                width={384}
                height={192}
                style={{ objectFit: "cover" }}
                className="h-full w-full object-cover"
              />
            ) : (
              <Button variant="outlined" component="label">
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "กรุณาเลือกไฟล์ภาพ" })}
                  onChange={handleFileChange}
                />
                อัปโหลดรูปภาพ
              </Button>
            )}
          </div>
        </div>
        <div className="gap- flex w-full flex-col justify-between">
          <TextField
            {...register("title", { required: "กรุณากรอกหัวข้อข่าวสาร" })}
            label="หัวข้อข่าวสาร"
            variant="outlined"
            size="medium"
            fullWidth
            error={!!errors.title}
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
          {...register("detail", { required: "กรุณากรอกเนื้อหาข่าวสาร" })}
          label="เนื้อหาข่าวสาร"
          variant="outlined"
          size="medium"
          fullWidth
          multiline
          rows={12}
          error={!!errors.detail}
        />
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button type="submit" variant="outlined" color="primary" size="medium">
          บันทึกข้อมูลข่าวสาร
        </Button>
        <Button type="submit" variant="contained" color="primary" size="medium">
          บันทึกข้อมูลข่าวสาร
        </Button>
      </div>
    </form>
  );
};

export default CreateNewsPage;
