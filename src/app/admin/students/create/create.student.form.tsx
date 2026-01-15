"use client";
import React, { FC, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { StudentService } from "@/core/service/student.service";
import { StudentRepository } from "@/infra/repositories/student.repository";
import { ICreateStudent } from "@/core/domain/student";
import { ConfirmModal } from "@/components/modal/confirmModal";
import { ConfirmModalProps } from "@/components/modal/confirmModal";

interface FormProfessorsProps {
  apiBase: string;
  classBookId: number;
}

const Schema = z.object({
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุลภาษาไทย"),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อภาษาอังกฤษ"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุลภาษาอังกฤษ"),
  studentId: z
    .string()
    .min(11, "กรุณากรอกรหัสนักศึกษา")
    .regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
  phone: z.string().optional(),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  yearOfFirstAdmission: z.string().optional(),
  yearOfCompletion: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  github: z.string().optional(),
  otherProjects: z
    .array(
      z.object({
        value: z.string().trim(),
      }),
    )
    .optional(),
});

type FormData = z.infer<typeof Schema>;

export const CreateStudentForm: FC<FormProfessorsProps> = ({
  apiBase,
  classBookId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const router = useRouter();

  const studentService = useMemo(() => {
    const repo = new StudentRepository(apiBase);
    return new StudentService(repo);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      firstNameTh: "",
      lastNameTh: "",
      firstNameEn: "",
      lastNameEn: "",
      studentId: "",
      nickname: "",
      phone: "",
      email: "",
      yearOfFirstAdmission: "",
      yearOfCompletion: "",
      facebook: undefined,
      linkedin: undefined,
      instagram: undefined,
      github: undefined,
      otherProjects: [{ value: "" }],
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { fields: otherProjects, append: appendOtherProjects } = useFieldArray({
    control,
    name: "otherProjects",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data: ICreateStudent) => {
    try {
      const payload = [data];

      const response = await studentService.createStudent(payload, classBookId);

      if (!response) setIsError(true);
      else {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            router.push(
              `/admin/students?page=1&pageSize=10&classBookId=${classBookId}`,
            );
          },
        });
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
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
          ไม่สามารถเพิ่มข้อมูลนักศึกษาได้
        </Alert>
      </Snackbar>
      <Typography variant="h6" fontWeight="bold">
        ข้อมูลส่วนตัว
      </Typography>
      <div className="flex gap-x-6">
        <div className="flex w-[268px] items-center">
          <div className="bg-neutral02 flex h-[240px] w-[268px] items-center justify-center rounded-lg">
            {selectedFile ? (
              <div className="group relative h-full w-full">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={268}
                  height={240}
                  className="h-full w-full rounded-md object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button variant="contained" component="label" size="large">
                    อัปโหลดรูปภาพ
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
              <Button variant="outlined" component="label" size="large">
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
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-x-4">
            <RHFTextField
              control={control}
              name="firstNameTh"
              label="ชื่อ (ภาษาไทย)"
              fullWidth
              required
              placeholder="ระบุชื่อ (ภาษาไทย)"
            />
            <RHFTextField
              control={control}
              name="lastNameTh"
              label="นามสกุล (ภาษาไทย)"
              fullWidth
              required
              placeholder="ระบุนามสกุล (ภาษาไทย)"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <RHFTextField
              control={control}
              name="firstNameEn"
              label="ชื่อ (ภาษาอังกฤษ)"
              fullWidth
              placeholder="ระบุชื่อ (ภาษาอังกฤษ)"
            />
            <RHFTextField
              control={control}
              name="lastNameEn"
              label="นามสกุล (ภาษาอังกฤษ)"
              fullWidth
              placeholder="ระบุนามสกุล (ภาษาอังกฤษ)"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <RHFTextField
              control={control}
              name="studentId"
              label="รหัสนักศึกษา"
              fullWidth
              placeholder="ระบุรหัสนักศึกษา"
            />
            <RHFTextField
              control={control}
              name="nickname"
              label="ชื่อเล่น"
              fullWidth
              placeholder="ระบุชื่อเล่น"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-y-8">
        <div className="flex flex-row gap-x-4">
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="phone"
              label="เบอร์โทร"
              variant="outlined"
              fullWidth
              placeholder="ระบุเบอร์โทร"
            />
          </div>
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="email"
              label="อีเมล"
              variant="outlined"
              fullWidth
              required
              placeholder="ระบุอีเมล"
            />
          </div>
        </div>
        <div className="flex flex-row gap-x-4">
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="yearOfFirstAdmission"
              label="ปีที่เข้าศึกษา"
              variant="outlined"
              fullWidth
              placeholder="ระบุปีที่เข้าศึกษา"
            />
          </div>
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="yearOfCompletion"
              label="ปีที่จบการศึกษา"
              variant="outlined"
              fullWidth
              placeholder="ระบุปีที่จบการศึกษา"
            />
          </div>
        </div>
      </div>
      <Typography variant="h6" fontWeight="bold" marginY={3}>
        ลิงก์ต่างๆ
      </Typography>
      <div className="flex flex-1 flex-col justify-between gap-y-8">
        <div className="flex flex-row gap-x-4">
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="facebook"
              label="Facebook"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Facebook"
            />
          </div>
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="linkedin"
              label="Linkedin"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Linkedin"
            />
          </div>
        </div>
        <div className="flex flex-row gap-x-4">
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="instagram"
              label="Instagram"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Instagram"
            />
          </div>
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="github"
              label="Github"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Github"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 mb-3 w-full">
        <div className="mb-3 flex w-full items-center justify-between">
          <Typography variant="h6" fontWeight="bold">
            สาขาที่เชี่ยวชาญ
          </Typography>
          <IconButton
            color="primary"
            sx={{
              border: "1px solid",
              color: "Primaty01",
            }}
            onClick={() => appendOtherProjects({ value: "" })}
          >
            <AddIcon />
          </IconButton>
        </div>

        <div className="space-y-3">
          {otherProjects.map((field, index) => (
            <div key={field.id} className="flex items-start gap-x-3">
              <div className="flex-1">
                <div className="pt-4 text-neutral-500">{index + 1}.</div>
                <RHFTextField
                  control={control}
                  name={`otherProjects.${index}.value`}
                  fullWidth
                  placeholder="ระบุชื่อโปรเจกต์"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-row justify-end gap-x-4">
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            setConfirmModal({
              isOpen: true,
              type: "warning",
              onClose: () => setConfirmModal(null),
              onConfirm: () => {
                router.push(
                  `/admin/students?page=1&pageSize=10&classBookId=${classBookId}`,
                );
              },
            });
          }}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isValid}
        >
          บันทึกข้อมูล
        </Button>
      </div>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </form>
  );
};
