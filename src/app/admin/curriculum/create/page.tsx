"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, FormLabel } from "@mui/material";
import Image from "next/image";
import { createCurriculumAction } from "./action";

type FormData = {
  title: string;
  year: string;
  fileUrl: string;
  description: string;
  image: string;
}

const CreateCurriculumPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const result = await createCurriculumAction(data);
      console.log("Form data submitted:", result);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };


  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="font-bold">เพิ่มหลักสูตร</h3>
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <div className="col-span-1 flex flex-col items-center justify-center relative bg-neutral02 rounded-md">
          {selectedFile && (
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              fill
              className="object-cover rounded-md"
              unoptimized
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="absolute z-10 rounded-xs pointer-events-none font-bold">
            <Button
              variant="contained"
              size="large"
              sx={{
                border: '1px solid var(--color-neutral05)',
                backgroundColor: 'var(--color-neutral02)',
                color: 'var(--color-neutral05)',
                boxShadow: 'none',
                fontWeight: 'bold'
              }}
            >
              อัปโหลดรูปภาพ
            </Button>
          </div>
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="group">
            <h4 className={`mb-1 transition-colors duration-200 ${errors.title
              ? "text-accent04"
              : "text-neutral04 group-hover:text-primary03 group-focus-within:text-primary03"
              }`}>
              หัวข้อ
            </h4>
            <TextField
              {...register("title", { required: "กรุณากรอกหัวข้อหลักสูตร" })}
              variant="outlined"
              size="medium"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </div>

          <div className="group">
            <h4 className={`mb-1 transition-colors duration-200 ${errors.year
              ? "text-accent04"
              : "text-neutral04 group-hover:text-primary03 group-focus-within:text-primary03"
              }`}>
              ปีการศึกษา
            </h4>
            <TextField
              {...register("year", { required: "กรุณากรอกปีการศึกษา" })}
              variant="outlined"
              size="medium"
              error={!!errors.year}
              fullWidth
              helperText={errors.year?.message}
            />
          </div>

          <div className="group">
            <h4 className={`mb-1 transition-colors duration-200 ${errors.fileUrl
              ? "text-accent04"
              : "text-neutral04 group-hover:text-primary03 group-focus-within:text-primary03"
              }`}>
              ลิงก์ (กรุณาแนบลิงก์ Google Drive)
            </h4>
            <TextField
              {...register("fileUrl", { required: "กรุณาแนบลิงก์" })}
              variant="outlined"
              size="medium"
              error={!!errors.fileUrl}
              fullWidth
              helperText={errors.fileUrl?.message}
            />
          </div>
        </div>
      </div>

      <div className="group">
        <h4 className={`mb-1 transition-colors duration-200 ${errors.description
          ? "text-accent04"
          : "text-neutral04 group-hover:text-primary03 group-focus-within:text-primary03"
          }`}>
          รายละเอียด
        </h4>
        <TextField
          {...register("description", { required: "กรุณากรอกรายละเอียดหลักสูตร" })}
          variant="outlined"
          size="medium"
          fullWidth
          multiline
          rows={6}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </div>


      <div className="flex justify-end gap-2">
        <Button variant="outlined" color="primary" size="large" className="w-[212px]">
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" color="primary" size="large" className="w-[212px]">
          บันทึกข้อมูล
        </Button>
      </div>
    </form>

  );
};

export default CreateCurriculumPage;
