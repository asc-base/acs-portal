"use client";

import { useState, useMemo } from "react";
import {
    Button,
    TextField,
    Modal,
    Autocomplete,
    Snackbar,
    Alert,
} from "@mui/material";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CropImageCard } from "./cropimagecard";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { useRouter } from "next/navigation";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import { styled } from "@mui/material/styles";
import { INewsInformation } from "@/core/domain/news";

interface NewsInformationInfoProps {
    type: string;
    apiBase: string;
    tagID: number;
    newsInformation: INewsInformation;
}

type NewsItem = {
    id: number;
    title: string;
};

const Schema = z.object({
    thumbnail: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" }),
    newsID: z.number().min(1, "กรุณาเลือกข่าว"),
});

type FormValues = z.infer<typeof Schema>;

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

export const NewsInformationInfo = ({
    type,
    apiBase,
    tagID,
    newsInformation,
}: NewsInformationInfoProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedFile, setCroppedFile] = useState<File | null>(null);
    const [openCrop, setOpenCrop] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isError, setIsError] = useState(false);
    const [confirmModal, setConfirmModal] =
        useState<ConfirmModalProps | null>(null);

    const [options, setOptions] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const previewSrc = useMemo(() => {
        if (selectedFile) {
            return URL.createObjectURL(croppedFile as File);
        }
        return newsInformation.thumbnailURL;
    }, [croppedFile, newsInformation.thumbnailURL]);



    const newsService = useMemo(() => {
        const repo = new NewsRepository(apiBase);
        return new NewsService(repo);
    }, [apiBase]);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { isDirty, isValid },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        mode: "onChange",
        defaultValues: {
            thumbnail: undefined,
            newsID: newsInformation.news.id,
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();

            formData.append("thumbnail", data.thumbnail);
            formData.append("newsID", data.newsID.toString());
            formData.append("tagID", tagID.toString());
            formData.append("id", newsInformation.id.toString());

            const response = await newsService.upsertNewsInformation(formData);

            if (response) {
                setConfirmModal({
                    isOpen: true,
                    type: "success",
                    onClose: () => setConfirmModal(null),
                    onConfirm: () => {
                        reset();
                        setIsEdit(false);
                        setConfirmModal(null);
                        router.push(`/admin/newsinformation/${tagID}`
                        );
                    },
                });
                return;
            }

            setIsError(true);
        } catch (error) {
            console.error(error);
            setIsError(true);
        }

    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setOpenCrop(true);
    };

    const handleUploadComplete = (file: File) => {
        setCroppedFile(file);

        setValue("thumbnail", file, {
            shouldValidate: true,
            shouldDirty: true,
        });
        setOpenCrop(false);
    };

    const handleSearch = async (search: string) => {
        setLoading(true);
        try {
            const { rows } = await newsService.getNews(1, 10, undefined, undefined, undefined, search);
            setOptions(rows);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            setConfirmModal({
                isOpen: true,
                type: "warning",
                onClose: () => setConfirmModal(null),
                onConfirm: () => {
                    reset();
                    setIsEdit(false);
                    setSelectedFile(null);
                    setCroppedFile(null);
                    setConfirmModal(null);
                },
            });
        } else {
            reset();
            setIsEdit(false);
            setSelectedFile(null);
            setCroppedFile(null);
        }
    };

    return (
        <div className="px-[32px] py-[28px]">
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={isError}
                autoHideDuration={4000}
                onClose={() => setIsError(false)}
            >
                <Alert severity="error" sx={{ width: "100%" }}>
                    ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
                </Alert>
            </Snackbar>

            <h3 className="mb-4 font-bold">
                {type === "announcement" ? "ข่าวประชาสัมพันธ์" : "ข่าว Highlight"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-x-5">
                    <div className="flex h-[440px] w-[590px] items-center justify-center overflow-hidden rounded-md">
                        {previewSrc ? (
                            <div className="group relative h-full w-full">
                                <Image
                                    src={previewSrc}
                                    alt="preview"
                                    fill
                                    className="object-cover"
                                />
                                {isEdit && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100">
                                        <Button variant="contained" component="label">
                                            อัปโหลดรูปภาพ
                                            <VisuallyHiddenInput
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            isEdit && (
                                <Button variant="contained" component="label">
                                    อัปโหลดรูปภาพ
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                            )
                        )}
                    </div>

                    <div className="w-full">
                        <h4 className="mb-2 font-bold">ข่าวสาร</h4>
                        <Controller
                            name="newsID"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    disabled={!isEdit}
                                    popupIcon={null}
                                    options={options}
                                    loading={loading}
                                    value={
                                        field.value
                                            ? options.find(o => o.id === field.value) ??
                                            {
                                                id: newsInformation.news.id,
                                                title: newsInformation.news.title,
                                            }
                                            : null
                                    }

                                    getOptionLabel={(opt) => opt.title}
                                    onInputChange={(_, value) => handleSearch(value)}
                                    onChange={(_, value) => field.onChange(value?.id || 0)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="ค้นหาข่าว"
                                            disabled={!isEdit}
                                            required
                                        />
                                    )}
                                />
                            )}
                        />
                    </div>
                </div>

                <Modal open={openCrop} onClose={() => setOpenCrop(false)}>
                    <div>
                        {selectedFile && (
                            <CropImageCard
                                file={selectedFile}
                                width={400}
                                height={300}
                                onUploadComplete={handleUploadComplete}
                                onCancel={() => setOpenCrop(false)}
                            />
                        )}
                    </div>
                </Modal>

                <div className="mt-6 flex justify-end gap-x-4">
                    {isEdit ? (
                        <>
                            <Button variant="outlined" onClick={handleCancel}>
                                ยกเลิก
                            </Button>
                            <Button type="submit" variant="contained" disabled={!isValid}>
                                บันทึกข้อมูล
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" onClick={() => setIsEdit(true)}>
                            แก้ไขข้อมูล
                        </Button>
                    )}
                </div>
            </form>

            {confirmModal && <ConfirmModal {...confirmModal} />}
        </div>
    );
};
