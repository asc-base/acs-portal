"use client";
import React, { useState, useEffect } from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { IStudent } from "@/core/domain/student";
import { useAuthStore } from "@/store/auth";
import { studentService } from "@/infra/container";

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
  linkin: string;
  facebook: string;
  instragram: string;
  projects: { title: string }[];
  file: string | File | null;
}

// interface ProfileFormProps {
//   studentData: IStudent;
// }

const ProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentData, setStudentData] = useState<IStudent | null>(null);
  const [projects, setProject] = useState<string[]>([]);
  const { handleSubmit, control, setValue } = useForm<FormData>({
    defaultValues: {
      github: studentData?.github || "",
      linkin: studentData?.linkin || "",
      facebook: studentData?.facebook || "",
      instragram: studentData?.instragram || "",
      projects:
        studentData?.projects?.map((project) => ({ title: project.title })) ||
        [],
      file: studentData?.user?.imageUrl || null,
    },
  });

  const { nickName, firstNameTh, firstNameEn, lastNameTh, lastNameEn } =
    studentData?.user ?? {};

  const handleAddProject = () => {
    setProject((prev) => [...prev, ""]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setValue("file", file);
  };

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
  };

  useEffect(() => {
    const getStudentData = async () => {
      if (!user) {
        return;
      }
      const student = await studentService.getSrudentByUserId(user.id);
      setStudentData(student);
    };
    getStudentData();
  }, [user, studentData]);

  return (
    <div className="w-full flex-col px-20 py-6">
      <h2 className="text-primary01 mb-4 font-bold">แก้ไขโปรไฟล์</h2>
      <h3 className="text-primary01 font-bold">ข้อมูลส่วนตัว</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1 */}
        <div className="flex flex-col items-center gap-x-10 md:flex-row">
          {/* Profile Image */}
          <div className="mt-6 mb-16 flex flex-row items-center gap-x-8">
            <div className="relative inline-block">
              <Button
                component="label"
                className="flex h-41 w-41 min-w-0 items-center justify-center overflow-hidden rounded-full p-0"
                sx={{
                  borderRadius: "50%",
                  width: "176px",
                  height: "176px",
                  padding: 0,
                  minWidth: 0,
                  backgroundColor: "#F2F2F2",
                  "&:hover": { backgroundColor: "#E2E2E2" },
                }}
              >
                {selectedFile ? (
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    width={300}
                    height={300}
                  />
                ) : studentData?.user?.imageUrl !== "" ? (
                  <Image
                    src={studentData?.user?.imageUrl || ""}
                    alt="Profile"
                    width={300}
                    height={300}
                  />
                ) : (
                  <Image
                    alt="Upload"
                    src="/uploadimage.png"
                    width={70}
                    height={70}
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />
                )}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </div>
          </div>

          {/* Personal Info */}
          <div className="text-neutral04 flex w-full flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <h4>รหัสนักศึกษา</h4>
                <TextField
                  value={studentData?.studentId}
                  disabled
                  fullWidth
                  className="bg-neutral02"
                />
                <h6 className="text-xs text-gray-500">
                  *ต้องการแก้ไขติดต่อแอดมิน
                </h6>
              </div>
              <div className="md:w-1/2">
                <h4>ชื่อเล่น</h4>
                <TextField
                  value={nickName}
                  disabled
                  fullWidth
                  className="bg-neutral02"
                />
                <h6 className="text-xs text-gray-500">
                  *ต้องการแก้ไขติดต่อแอดมิน
                </h6>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <h4>ชื่อ - นามสกุล (ภาษาไทย)</h4>
                <TextField
                  value={`${firstNameTh} ${lastNameTh}`}
                  disabled
                  fullWidth
                  className="bg-neutral02"
                />
                <h6 className="text-xs text-gray-500">
                  *ต้องการแก้ไขติดต่อแอดมิน
                </h6>
              </div>
              <div className="md:w-1/2">
                <h4>ชื่อ - นามสกุล (ภาษาอังกฤษ)</h4>
                <TextField
                  value={`${firstNameEn} ${lastNameEn}`}
                  disabled
                  fullWidth
                  className="bg-neutral02"
                />
                <h6 className="text-xs text-gray-500">
                  *ต้องการแก้ไขติดต่อแอดมิน
                </h6>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Social Links */}
        <div className="text-neutral04 mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">Github</h4>
              <Controller
                name="github"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="http://github.com/"
                    fullWidth
                    variant="outlined"
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
                )}
              />
            </div>
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">LinkIn</h4>
              <Controller
                name="linkin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="https://www.linkin.com/in/"
                    fullWidth
                    variant="outlined"
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
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">Facebook</h4>

              <Controller
                name="facebook"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="https://facebook.com/"
                    fullWidth
                    variant="outlined"
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
                )}
              />
            </div>
            <div className="group md:w-1/2">
              <h4 className="group-focus-within:text-primary03">Instragram</h4>
              <Controller
                name="instragram"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="https://instragram.com/"
                    fullWidth
                    variant="outlined"
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
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Projects */}
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
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            className="px-16 py-8"
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
            {" "}
            บันทึกข้อมูล
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
