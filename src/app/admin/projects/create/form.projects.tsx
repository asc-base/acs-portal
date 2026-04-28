"use client";
import React, { FC, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tag } from "@/core/domain/list-type";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { ICourse } from "@/core/domain/course";

interface FormProjectsProps {
  apiBase: string;
}

const Schema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อโปรเจกต์"),

  thumbnail: z
    .string()
    .trim()
    .min(1, "กรุณากรอกลิงก์รูป")
    .url("ลิงก์รูปไม่ถูกต้อง"),

  detail: z.string().trim().min(1, "กรุณากรอกรายละเอียด"),

  youtube: z.string().trim().url("ลิงก์ YouTube ไม่ถูกต้อง"),
  github: z.string().trim().url("ลิงก์ Github ไม่ถูกต้อง"),
  document: z.string().trim().url("ลิงก์ Document ไม่ถูกต้อง"),
  presentation: z.string().trim().url("ลิงก์ Presentation ไม่ถูกต้อง"),

  projectCourses: z
    .array(
      z.object({
        value: z.string().trim(),
      }),
    )
    .min(1, "กรุณาเลือกอย่างน้อย 1 วิชา"),

  projectTypes: z
    .array(
      z.object({
        value: z.string().trim(),
      }),
    )
    .min(1, "กรุณาเลือกประเภทโปรเจกต์"),

  projectCategories: z
    .array(
      z.object({
        value: z.string().trim(),
      }),
    )
    .min(1, "กรุณาเลือกหมวดหมู่"),
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

export const FormProjects: FC<FormProjectsProps> = ({ apiBase }) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [types, setTypes] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Tag[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      detail: "",
      thumbnail: "",
      youtube: "",
      projectCourses: [{ value: "" }],
      projectTypes: [{ value: "" }],
      projectCategories: [{ value: "" }],
      github: "",
      document: "",
      presentation: "",
    },
    mode: "onBlur",
  });

  const { fields: projectCoursesFields, append: appendProjectCourses } =
    useFieldArray({
      control,
      name: "projectCourses",
    });

  const { fields: projectTypesFields, append: appendProjectTypes } =
    useFieldArray({
      control,
      name: "projectTypes",
    });

  const { fields: projectCategoriesFields, append: appendProjectCategories } =
    useFieldArray({
      control,
      name: "projectCategories",
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const cancelForm = () => {
    const hasAnyValue = isDirty || !!selectedFile;
    if (hasAnyValue) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/projects`),
      });
    } else router.push(`/admin/projects`);
  };

  const handleConfirmSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
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
          ไม่สามารถเพิ่มข้อมูลอาจารย์ได้
        </Alert>
      </Snackbar>
      <div>
        <Typography variant="h6" fontWeight="bold">
          ข้อมูลผลงาน
        </Typography>
        <div className="mt-6 mb-8 flex flex-row items-center gap-x-8">
          <div className="bg-neutral02 group relative flex h-[284px] w-[400px] items-center justify-center rounded-xl">
            {selectedFile ? (
              <>
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={400}
                  height={284}
                  style={{ objectFit: "cover" }}
                  className="h-full w-full rounded-xl object-cover"
                />
                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="contained" component="label">
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="outlined" component="label">
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                อัปโหลดรูปภาพ
              </Button>
            )}
          </div>
          <div className="flex h-[284px] flex-1 flex-col justify-between">
            <RHFTextField
              control={control}
              name="title"
              label="หัวข้อ"
              variant="outlined"
              fullWidth
              placeholder="ระบุหัวข้อ"
              requiredMark
            />
            <RHFTextField
              control={control}
              name="detail"
              label="รายละเอียด"
              variant="outlined"
              fullWidth
              placeholder="ระบุรายละเอียด"
              requiredMark
            />

            <RHFTextField
              control={control}
              name="youtube"
              label="ลิงค์คลิปวิดิโอ"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์คลิปวิดิโอ"
              requiredMark
            />
          </div>
        </div>
        <div className="mb-5 flex flex-1 flex-col justify-between gap-y-5">
          <div className="flex gap-5">
            <Typography variant="h6" fontWeight="bold">
              ข้อมูลการจัดหมวดหมู่
            </Typography>
            <Typography variant="h6" fontWeight="regular">
              (สามารถเลือกได้มากกว่า 1 ในแต่ละคอลัมม์)
            </Typography>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">วิชา</h2>

                <button className="flex h-8 w-8 items-center justify-center">
                  <AddCircleOutlineOutlined
                    className="cursor-pointer"
                    onClick={() => appendProjectCourses({ value: "" })}
                  />
                </button>
              </div>

              <div className="space-y-2">
                {projectCoursesFields.map((field) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={field.id}
                  >
                    <div className="flex-1">
                      <RHFSelect
                        control={control}
                        name="projectCourses"
                        label="วิชา"
                        variant="outlined"
                        fullWidth
                        required
                        displayEmpty
                        requiredMark
                        renderValue={(value) => {
                          if (!value) {
                            return (
                              <span style={{ color: "#9e9e9e" }}>ระบุวิชา</span>
                            );
                          }
                          const selected = courses.find(
                            (item) => item.id === value,
                          );
                          return selected?.courseNameTh;
                        }}
                      >
                        {courses?.map((course) => (
                          <MenuItem key={course.id} value={course.id}>
                            {course.courseNameTh}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>

                    <button className="mt-5 text-red-500 hover:text-red-600">
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-30 w-0.5 bg-gray-300"></div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">ประเภท</h2>

                <button className="flex h-8 w-8 items-center justify-center">
                  <AddCircleOutlineOutlined
                    className="cursor-pointer"
                    onClick={() => appendProjectTypes({ value: "" })}
                  />
                </button>
              </div>

              <div className="space-y-2">
                {projectTypesFields.map((field) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={field.id}
                  >
                    <div className="flex-1">
                      <RHFSelect
                        control={control}
                        name="projectTypes"
                        label="ประเภท"
                        variant="outlined"
                        fullWidth
                        required
                        displayEmpty
                        requiredMark
                        renderValue={(value) => {
                          if (!value) {
                            return (
                              <span style={{ color: "#9e9e9e" }}>
                                ระบุประเภท
                              </span>
                            );
                          }
                          const selected = types.find(
                            (item) => item.id === value,
                          );
                          return selected?.name;
                        }}
                      >
                        {types?.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>

                    <button className="mt-5 text-red-500 hover:text-red-600">
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-30 w-0.5 bg-gray-300"></div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">หมวดหมู่</h2>

                <button className="flex h-8 w-8 items-center justify-center">
                  <AddCircleOutlineOutlined
                    className="cursor-pointer"
                    onClick={() => appendProjectCategories({ value: "" })}
                  />
                </button>
              </div>

              <div className="space-y-2">
                {projectCategoriesFields.map((field) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={field.id}
                  >
                    <div className="flex-1">
                      <RHFSelect
                        control={control}
                        name="projectCategories"
                        label="หมวดหมู่"
                        variant="outlined"
                        fullWidth
                        required
                        displayEmpty
                        requiredMark
                        renderValue={(value) => {
                          if (!value) {
                            return (
                              <span style={{ color: "#9e9e9e" }}>
                                ระบุหมวดหมู่
                              </span>
                            );
                          }
                          const selected = categories.find(
                            (item) => item.id === value,
                          );
                          return selected?.name;
                        }}
                      >
                        {categories?.map((categorie) => (
                          <MenuItem key={categorie.id} value={categorie.id}>
                            {categorie.name}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>

                    <button className="mt-5 text-red-500 hover:text-red-600">
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-y-5">
          <Typography variant="h6" fontWeight="bold">
            ลิงค์ต่างๆ
          </Typography>
          <div className="flex flex-1 flex-col justify-between gap-5">
            <RHFTextField
              control={control}
              name="github"
              label="Github"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์ Github"
              requiredMark
              startIcon={<LinkIcon fontSize="small" />}
            />
            <RHFTextField
              control={control}
              name="document"
              label="Document"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์ Document"
              requiredMark
              startIcon={<DescriptionIcon fontSize="small" />}
            />

            <RHFTextField
              control={control}
              name="presentation"
              label="Presentation"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์ Presentation"
              requiredMark
              startIcon={<SlideshowIcon fontSize="small" />}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button variant="outlined" size="large" onClick={cancelForm}>
          ยกเลิก
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          onClick={handleConfirmSubmit}
          disabled={!isValid}
        >
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </form>
  );
};
