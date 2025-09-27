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

interface ProjectField {
    id: number;
    value: string;
}

const ProfileForm = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [textFields, setTextFields] = useState<ProjectField[]>([]);
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");

    const handleAddTextField = () => {
        setTextFields(prev => {
            const maxId = prev.length > 0 ? Math.max(...prev.map(item => item.id)) : 0;
            return [...prev, { id: maxId + 1, value: "" }];
        });

    };

    const handleTextFieldChange = (id: number, value: string) => {
        setTextFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setSelectedFile(file);
            console.log("Selected file:", file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            file: selectedFile,
            github,
            linkedin,
            facebook,
            instagram,
            projects: textFields,
        };

        console.log("Form data:", formData);
    };

    return (
        <div className="w-full flex-col px-20 py-6">
            <h2 className="font-bold text-primary01 mb-4">แก้ไขโปรไฟล์</h2>
            <h3 className="font-bold text-primary01">ข้อมูลส่วนตัว</h3>
            <form onSubmit={handleSubmit}>
                {/* Section 1 */}
                <div className="flex flex-col md:flex-row items-center gap-x-10">
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
                        <div className="flex md:flex-row gap-4">
                            <div className="w-1/2">
                                <h4>รหัสนักศึกษา</h4>
                                <TextField value="66090500403" disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                            <div className="w-1/2">
                                <h4>ชื่อเล่น</h4>
                                <TextField value="เลิฟ" disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                        </div>
                        <div className="flex md:flex-row gap-4">
                            <div className="w-1/2">
                                <h4>ชื่อ - นามสกุล (ภาษาไทย)</h4>
                                <TextField value="ณัฐนิชา อนันต์พอร์ดพล" disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                            <div className="w-1/2">
                                <h4>ชื่อ - นามสกุล (ภาษาอังกฤษ)</h4>
                                <TextField value="Nattanischa Anmporsdpsl" disabled fullWidth className="bg-neutral02" />
                                <h6 className="text-xs text-gray-500">*ต้องการแก้ไขติดต่อแอดมิน</h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Social Links */}
                <div className="flex flex-col gap-4 mt-6 text-neutral04">
                    <div className="flex md:flex-row gap-4">
                        <div className="w-1/2 group">
                            <h4 className="group-focus-within:text-primary03">Github</h4>
                            <TextField
                                placeholder="http://github.com/"
                                fullWidth
                                variant="outlined"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
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
                        </div>
                        <div className="w-1/2 group">
                            <h4 className="group-focus-within:text-primary03">LinkedIn</h4>
                            <TextField
                                placeholder="https://www.linkedin.com/in/"
                                fullWidth
                                variant="outlined"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
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
                        </div>
                    </div>

                    <div className="flex md:flex-row gap-4">
                        <div className="w-1/2 group">
                            <h4 className="group-focus-within:text-primary03">Facebook</h4>
                            <TextField
                                placeholder="https://facebook.com/"
                                fullWidth
                                variant="outlined"
                                value={facebook}
                                onChange={(e) => setFacebook(e.target.value)}
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
                        </div>
                        <div className="w-1/2 group">
                            <h4 className="group-focus-within:text-primary03">Instagram</h4>
                            <TextField
                                placeholder="https://instagram.com/"
                                fullWidth
                                variant="outlined"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
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
                        </div>
                    </div>
                </div>

                {/* Section 3: Projects */}
                <div className="flex flex-row items-center justify-between mt-6">
                    <h3 className="font-bold text-primary01 mb-4">โปรเจกต์อื่นๆ</h3>
                    <AddCircleOutlineRoundedIcon
                        sx={{ fontSize: 36, color: "primary.main", cursor: "pointer" }}
                        onClick={handleAddTextField}
                    />
                </div>
                {textFields.map((textField) => (
                    <div key={textField.id}>
                        <h4 className="text-sm font-medium text-gray-600 min-w-[60px]">{textField.id}.</h4>
                        <div className="flex flex-row item-center">
                            <TextField
                                value={textField.value}
                                onChange={(e) => handleTextFieldChange(textField.id, e.target.value)}
                                placeholder="กรอกชื่อโปรเจกต์..."
                                fullWidth
                                variant="outlined"
                            />
                        </div>
                    </div>
                ))}

                <div className="flex flex-row w-full justify-end align-bottom gap-x-4 mt-6">
                    <Button variant="outlined" color="primary" size="medium" className="px-16 py-8">ยกเลิก</Button>
                    <Button variant="contained" color="primary" size="medium" onClick={handleSubmit} className="px-16 py-8"> บันทึกข้อมูล</Button>
                </div>
            </form >
        </div>
    );
};

export default ProfileForm;
