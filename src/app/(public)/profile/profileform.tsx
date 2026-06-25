"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button, InputAdornment, Modal } from "@mui/material";
import { RHFTextField } from "@/components/form/RHFTextField";
import { styled } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { CropImageCard } from "@/components/cropimagecard";
import { useRouter } from "next/navigation";
import { IStudent } from "@/core/domain/student";
import { AuthRepository } from "@/infra/repositories/auth.repository";
import { AuthService } from "@/core/service/auth.service";
import { StudentRepository } from "@/infra/repositories/student.repository";
import { StudentService } from "@/core/service/student.service";

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
  github: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  projects: { title: string }[];
  file: string | File | null;
}

// interface ProfileFormProps {
//   studentData: IStudent;
// }

const ProfileForm = ({ apiBase }: { apiBase: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [student, setStudent] = useState<IStudent | null>(null);
  const router = useRouter();

  const authService = useMemo(() => {
    const authRepo = new AuthRepository(apiBase);
    const authSerivce = new AuthService(authRepo);
    return authSerivce;
  }, [apiBase]);

  const studentService = useMemo(() => {
    const studentRepo = new StudentRepository(apiBase);
    const studentSerivce = new StudentService(studentRepo);
    return studentSerivce;
  }, [apiBase]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const user = await authService.getUser();
        if (!user) {
          router.push("/auth/student");
          return;
        }
        const studentResponse = await studentService.getStudentByUserId(
          user.id,
        );
        setStudent(studentResponse);
      } catch (error) {
        console.error("Error fetching student profile:", error);
        router.push("/auth/student");
      }
    };
    fetchStudent();
  }, [router]);

  const { handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      github: student?.github || "",
      linkedin: student?.linkedin || "",
      facebook: student?.facebook || "",
      instagram: student?.instagram || "",
      // projects:
      //   studentData?.projects?.map((project) => ({ title: project.title })) ||
      //   [],
      file: student?.user?.imageUrl || null,
    },
  });
  const [isCroping, setIsCroping] = useState(false);

  useEffect(() => {
    reset({
      github: student?.github || "",
      linkedin: student?.linkedin || "",
      facebook: student?.facebook || "",
      instagram: student?.instagram || "",
      file: student?.user?.imageUrl || null,
    });
    setSelectedFile(null);
  }, [student, reset]);

  const { nickName, firstNameTh, firstNameEn, lastNameTh, lastNameEn } =
    student?.user ?? {};

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset({
      github: student?.github || "",
      linkedin: student?.linkedin || "",
      facebook: student?.facebook || "",
      instagram: student?.instagram || "",
      file: student?.user?.imageUrl || null,
    });
    setSelectedFile(null);
    setIsEditing(false);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsEditing(false);
      const id = student?.id;
      const classBookID = student?.classBookID;

      if (!id || !classBookID) {
        return;
      }

      const response = await studentService.updateStudent(
        data,
        selectedFile,
        classBookID,
        id,
      );
      if (response) {
        setStudent(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex-col px-20 py-6">
      <h2 className="text-primary01 mb-4 font-bold">แก้ไขโปรไฟล์</h2>
      <h3 className="text-primary01 text-xl font-bold">
        ข้อมูลส่วนตัว
        <span className="ml-2 text-sm font-bold text-red-500">
          (หากต้องการแก้ไขติดต่อแอดมิน)
        </span>
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1 */}
        <div className="flex flex-col items-center gap-x-10 md:flex-row">
          {/* Profile Image */}
          <div className="mt-6 mb-16 flex flex-row items-center gap-x-8">
            <div className="relative inline-block">
              <Button
                component={isEditing ? "label" : "div"}
                disabled={!isEditing}
                className="group relative flex items-center justify-center overflow-hidden rounded-2xl p-0"
                sx={{
                  borderRadius: "16px",
                  width: "176px",
                  height: "176px",
                  padding: 0,
                  minWidth: 0,
                  backgroundColor: "#F2F2F2",
                  "&:hover": {
                    backgroundColor: isEditing ? "#E2E2E2" : "#F2F2F2",
                  },
                  cursor: isEditing ? "pointer" : "default",
                }}
              >
                {(selectedFile || student?.user?.imageUrl) && (
                  <Image
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : (student?.user?.imageUrl ?? "")
                    }
                    alt="Profile"
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-opacity"
                  />
                )}
                {isEditing && (
                  <div
                    className={`flex items-center justify-center ${
                      selectedFile || student?.user?.imageUrl
                        ? "absolute inset-0 z-10 h-full w-full bg-black/40 opacity-0 transition-opacity duration-300 hover:opacity-100"
                        : "relative h-full w-full opacity-100"
                    } `}
                  >
                    <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-sm">
                      <span className="text-base font-medium text-gray-700">
                        อัปโหลดรูปภาพ
                      </span>
                    </div>
                  </div>
                )}
                {!(selectedFile || student?.user?.imageUrl) && !isEditing && (
                  <span className="text-sm font-medium text-gray-400">
                    ไม่มีรูปโปรไฟล์
                  </span>
                )}
                {isEditing && (
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                )}
              </Button>
            </div>
          </div>
          {/* Personal Info */}
          <div className="text-neutral04 w-full">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-y-6 text-base md:grid-cols-[max-content_24px_1fr]">
              {/* Row 1: Student ID */}
              <div className="text-gray-500">รหัสนักศึกษา</div>
              <div className="text-center">:</div>
              <div className="font-bold text-neutral-800">
                {student?.studentCode || "6009050401"}
              </div>

              {/* Row 2: Nickname */}
              <div className="text-gray-500">ชื่อเล่น</div>
              <div className="text-center">:</div>
              <div className="font-bold text-neutral-800">
                {nickName || "ก้องภพ"}
              </div>

              {/* Row 3: Full Name TH */}
              <div className="text-gray-500">ชื่อ - นามสกุล (ภาษาไทย)</div>
              <div className="text-center">:</div>
              <div className="font-bold text-neutral-800">
                {student?.user
                  ? `${firstNameTh} ${lastNameTh}`.trim()
                  : "สมชาย ใจดี"}
              </div>

              {/* Row 4: Full Name EN */}
              <div className="text-gray-500">ชื่อ - นามสกุล (ภาษาอังกฤษ)</div>
              <div className="text-center">:</div>
              <div className="font-bold text-neutral-800">
                {student?.user
                  ? `${firstNameEn} ${lastNameEn}`.trim()
                  : "Somchai Jaidee"}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Social Links */}
        <div className="text-neutral04 mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">Github</h4>
              <RHFTextField
                name="github"
                control={control}
                placeholder="http://github.com/"
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "neutral03",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary03",
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                    {
                      color: "primary.main",
                    },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <GitHubIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">LinkIn</h4>
              <RHFTextField
                name="linkedin"
                control={control}
                placeholder="https://www.linkin.com/in/"
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "neutral03",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary03",
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                    {
                      color: "primary.main",
                    },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedInIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">Facebook</h4>
              <RHFTextField
                name="facebook"
                control={control}
                placeholder="https://facebook.com/"
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "neutral03",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary03",
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                    {
                      color: "primary.main",
                    },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FacebookRoundedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">Instagram</h4>
              <RHFTextField
                name="instagram"
                control={control}
                placeholder="https://instagram.com/"
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "neutral03",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary03",
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                    {
                      color: "primary.main",
                    },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <InstagramIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Projects */}
        {/* Commented out due to incomplete implementation */}

        {/* <div className="mt-6 flex flex-row items-center justify-between">
          <h3 className="text-primary01 mb-4 font-bold">โปรเจกต์อื่นๆ</h3>
          <AddCircleOutlineRoundedIcon
            sx={{ fontSize: 36, color: "primary.main", cursor: "pointer" }}
            onClick={handleAddProject}
          />
        </div>
        {projects.map((_, index) => (
          <div key={index + 1}>
            <h4 className="min-w-[60px] text-sm font-medium text-gray-600">
              {index + 1}.
            </h4>
            <div className="item-center flex flex-row">
              <Controller
                name={`projects.${index}.title`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    placeholder="กรอกชื่อโปรเจกต์..."
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            </div>
          </div>
        ))} */}

        <div className="mt-6 flex w-full flex-row justify-center gap-x-4 align-bottom md:justify-end">
          {!isEditing ? (
            <Button
              variant="contained"
              color="primary"
              size="medium"
              className="px-16 py-8"
              onClick={handleEdit}
            >
              แก้ไขข้อมูล
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                className="px-16 py-8"
                onClick={handleCancel}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                className="px-16 py-8"
              >
                บันทึกข้อมูล
              </Button>
            </>
          )}
        </div>
        {isCroping && selectedFile && (
          <Modal
            open={isCroping}
            onClose={handleCropCancel}
            closeAfterTransition
          >
            <CropImageCard
              width={200}
              height={200}
              file={selectedFile}
              onUploadComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          </Modal>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
