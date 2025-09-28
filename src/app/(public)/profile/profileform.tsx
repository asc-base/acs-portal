"use client";
import React, { useState } from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";

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
    projects: { projectName: string }[];
    file: File | null;
}

interface userData {
    studentId:string;
    nickname:string;
    fullNameTh:string;
    fullNameEn:string;
}

interface userProps {
    user:userData;
}

const ProfileForm = ({user}: userProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [projects, setProject] = useState<string[]>([]);
    const { handleSubmit, control, setValue } = useForm<FormData>({
        defaultValues: {
            github: "",
            linkedin: "",
            facebook: "",
            instagram: "",
            projects: [],
            file: null,
        },
    });

    const { studentId, nickname, fullNameTh, fullNameEn} = user;

    const handleAddProject = () => {
        setProject(prev => [...prev, ""]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setValue("file", file);
    };

    const onSubmit = (data: FormData) => {
        console.log("Form data:", data);
    };

    return (
        <div className="w-full flex-col px-20 py-6">
            <h2 className="font-bold text-primary01 mb-4">แก้ไขโปรไฟล์</h2>
            <h3 className="font-bold text-primary01">ข้อมูลส่วนตัว</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Section 1 */}
                < div className="flex flex-col md:flex-row items-center gap-x-10">
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
                                    <div className="h-full w-full">
                                        <Image
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Preview"
                                            width={300}
                                            height={300}
                                            style={{ objectFit: "cover" }}
                                            className="bg-neutral02 h-full w-full object-cover"
                                        />
                                    </div>
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
                    <div className="flex flex-col gap-4 w-full text-neutral04">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/2">
                                <h4>รหัสนักศึกษา</h4>
                                <TextField value={studentId} disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                            <div className="md:w-1/2">
                                <h4>ชื่อเล่น</h4>
                                <TextField value={nickname} disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/2">
                                <h4>ชื่อ - นามสกุล (ภาษาไทย)</h4>
                                <TextField value={fullNameTh} disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                            <div className="md:w-1/2">
                                <h4>ชื่อ - นามสกุล (ภาษาอังกฤษ)</h4>
                                <TextField value={fullNameEn} disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Social Links */}
                <div className="flex flex-col gap-4 mt-6 text-neutral04">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/2 group">
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
                                            "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
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
                        <div className="md:w-1/2 group">
                            <h4 className="group-focus-within:text-primary03">LinkedIn</h4>
                            <Controller
                                name="linkedin"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="https://www.linkedin.com/in/"
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
                                            "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
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

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/2 group">
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
                                            "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
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
                        <div className="md:w-1/2 group">
                            <h4 className="group-focus-within:text-primary03">Instagram</h4>
                            <Controller
                                name="instagram"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="https://instagram.com/"
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
                                            "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
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
                <div className="flex flex-row items-center justify-between mt-6">
                    <h3 className="font-bold text-primary01 mb-4">โปรเจกต์อื่นๆ</h3>
                    <AddCircleOutlineRoundedIcon
                        sx={{ fontSize: 36, color: "primary.main", cursor: "pointer" }}
                        onClick={handleAddProject}
                    />
                </div>
                {
                    projects.map((_, index) => (
                        <div key={index+1}>
                            <h4 className="text-sm font-medium text-gray-600 min-w-[60px]">{index+1}.</h4>
                            <div className="flex flex-row item-center">
                                <Controller
                                    name={`projects.${index}.projectName`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            placeholder="กรอกชื่อโปรเจกต์..."
                                            fullWidth
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    ))
                }

                <div className="flex flex-row w-full justify-center md:justify-end align-bottom gap-x-4 mt-6">
                    <Button variant="outlined" color="primary" size="medium" className="px-16 py-8">ยกเลิก</Button>
                    <Button type="submit" variant="contained" color="primary" size="medium" className="px-16 py-8"> บันทึกข้อมูล</Button>
                </div>
            </form >
        </div >
    );
};

export default ProfileForm;
