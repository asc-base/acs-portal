"use client";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, Typography, Modal } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { StudentService } from "@/core/service/student.service";
import { StudentRepository } from "@/infra/repositories/student.repository";
import { IUpdateStudent, IStudent } from "@/core/domain/student";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { styled } from "@mui/material/styles";
import { CropImageCard } from "@/components/cropimagecard";

interface StudentUpdateFormProps {
  apiBase: string;
  classBookID: number;
  student: IStudent;
}

const Schema = z.object({
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุลภาษาไทย"),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อภาษาอังกฤษ"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุลภาษาอังกฤษ"),
  studentCode: z
    .string()
    .min(11, "กรุณากรอกรหัสนักศึกษา")
    .regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  github: z.string().optional(),
  // otherProjects: z
  //   .array(
  //     z.object({
  //       value: z.string().trim(),
  //     }),
  //   )
  //   .optional(),
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

export const StudentUpdateForm = ({
  apiBase,
  classBookID,
  student,
}: StudentUpdateFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isCroping, setIsCroping] = useState(false);

  const previewSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : student.user.imageUrl;

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
      firstNameTh: student.user.firstNameTh,
      lastNameTh: student.user.lastNameTh,
      firstNameEn: student.user.firstNameEn,
      lastNameEn: student.user.lastNameEn,
      studentCode: student.studentCode,
      nickname: student.user.nickName,
      email: student.user.email,
      facebook: student.facebook || undefined,
      linkedin: student.linkedin || undefined,
      instagram: student.instragram || undefined,
      github: student.github || undefined,
      // otherProjects: [{ value: "" }],
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // const { fields: otherProjects, append: appendOtherProjects } = useFieldArray({
  //   control,
  //   name: "otherProjects",
  // });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      setSelectedFile(file);
      setIsCroping(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setSelectedFile(croppedFile);
    setIsCroping(false);
  };

  const handleCropCancel = () => {
    setIsCroping(false);
    setSelectedFile(null);
  };

  const onSubmit = async (data: IUpdateStudent) => {
    try {
      const response = await studentService.updateStudent(
        data,
        selectedFile,
        classBookID,
        student.id,
      );

      if (!response) setIsError(true);
      else {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            router.push(`/admin/students?classBookID=${classBookID}`);
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
          ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>
      <Typography variant="h6" fontWeight="bold">
        ข้อมูลส่วนตัว
      </Typography>
      <div className="flex gap-x-6">
        <div className="flex w-[268px] items-center">
          <div className="bg-neutral02 flex h-[240px] w-[268px] items-center justify-center rounded-lg">
            {previewSrc ? (
              <div className="group relative h-full w-full">
                <Image
                  src={previewSrc}
                  alt="Preview"
                  width={268}
                  height={240}
                  className="h-full w-full rounded-md object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button variant="contained" component="label" size="large">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
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
              requiredMark
            />
            <RHFTextField
              control={control}
              name="lastNameTh"
              label="นามสกุล (ภาษาไทย)"
              fullWidth
              required
              placeholder="ระบุนามสกุล (ภาษาไทย)"
              requiredMark
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <RHFTextField
              control={control}
              name="firstNameEn"
              label="ชื่อ (ภาษาอังกฤษ)"
              fullWidth
              placeholder="ระบุชื่อ (ภาษาอังกฤษ)"
              requiredMark
            />
            <RHFTextField
              control={control}
              name="lastNameEn"
              label="นามสกุล (ภาษาอังกฤษ)"
              fullWidth
              placeholder="ระบุนามสกุล (ภาษาอังกฤษ)"
              requiredMark
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <RHFTextField
              control={control}
              name="studentCode"
              label="รหัสนักศึกษา"
              fullWidth
              placeholder="ระบุรหัสนักศึกษา"
              requiredMark
            />
            <RHFTextField
              control={control}
              name="nickname"
              label="ชื่อเล่น"
              fullWidth
              placeholder="ระบุชื่อเล่น"
              requiredMark
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-y-8">
        <div className="grid grid-cols-2 gap-x-4">
          <RHFTextField
            control={control}
            name="email"
            label="อีเมล"
            variant="outlined"
            required
            fullWidth
            placeholder="ระบุอีเมล"
            requiredMark
          />
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

      {/* <div className="mt-4 mb-3 w-full">
        <div className="mb-3 flex w-full items-center justify-between">
          <Typography variant="h6" fontWeight="bold">
            โปรเจกต์อื่นๆ
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
      </div> */}

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
                router.push(`/admin/students?classBookID=${classBookID}`);
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
      {isCroping && selectedFile && (
        <Modal open={isCroping} onClose={handleCropCancel} closeAfterTransition>
          <CropImageCard
            file={selectedFile}
            onUploadComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </Modal>
      )}
    </form>
  );
};
