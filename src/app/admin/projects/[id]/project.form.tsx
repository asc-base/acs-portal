"use client";
import React, { FC, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Typography, Modal, MenuItem, Select, Alert, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import { CropImageCard } from "@/components/cropimagecard";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { Theme } from "@/app/theme";
import { projectService } from "@/infra/container";
import { IProject } from "@/core/domain/project";
import { Tag } from "@/core/domain/list-type";
import { ICourse } from "@/core/domain/course";
import { IStudent } from "@/core/domain/student";
import { IProfessor } from "@/core/domain/professor";

interface ProjectFormProps {
  project: IProject | null;
  courses: ICourse[];
  masterData: any;
  students: IStudent[];
  professors: IProfessor[];
}

const Schema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อโปรเจกต์"),
  details: z.string().trim().min(1, "กรุณากรอกรายละเอียด"),
  youtubeURL: z.string().trim().url("ลิงก์ YouTube ไม่ถูกต้อง").or(z.literal("")),
  githubURL: z.string().trim().url("ลิงก์ Github ไม่ถูกต้อง").or(z.literal("")),
  documentURL: z.string().trim().url("ลิงก์ Document ไม่ถูกต้อง").or(z.literal("")),
  presentationURL: z.string().trim().url("ลิงก์ Presentation ไม่ถูกต้อง").or(z.literal("")),
  figmaURL: z.string().trim().url("ลิงก์ Figma ไม่ถูกต้อง").or(z.literal("")),

  projectCourses: z
    .array(z.object({ value: z.string().trim().min(1, "กรุณาเลือกวิชา") }))
    .min(1, "กรุณาเลือกอย่างน้อย 1 วิชา"),
  projectTypes: z
    .array(z.object({ value: z.string().trim().min(1, "กรุณาเลือกประเภท") }))
    .min(1, "กรุณาเลือกอย่างน้อย 1 ประเภท"),
  projectCategories: z
    .array(z.object({ value: z.string().trim().min(1, "กรุณาเลือกหมวดหมู่") }))
    .min(1, "กรุณาเลือกอย่างน้อย 1 หมวดหมู่"),

  techStacks: z.array(z.object({ value: z.string().trim().min(1, "กรุณากรอก Tech Stack") })),

  members: z.array(
    z.object({
      userID: z.string().min(1, "กรุณาเลือกสมาชิก"),
    })
  ),
  advisors: z.array(
    z.object({
      userID: z.string().min(1, "กรุณาเลือกอาจารย์ที่ปรึกษา"),
    })
  ),
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

const figmaInputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "transparent",
      borderWidth: 0,
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#666666",
    },
  },
  "& .MuiFormLabel-root": {
    color: "#333333",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "4px",
  },
  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: "#F5F5F5",
    color: "#666666",
  },
  "& .MuiSelect-select.Mui-disabled": {
    WebkitTextFillColor: "#666666",
  }
};

export const ProjectForm: FC<ProjectFormProps> = ({
  project,
  courses,
  masterData,
  students,
  professors,
}) => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(project?.thumbnailURL || "");
  const [isCropping, setIsCropping] = useState(false);

  // Additional images assets
  const [assets, setAssets] = useState<{ id: string; file?: File; url: string; original: File | string }[]>(() => {
    const initial = project?.assetsURL ? project.assetsURL.filter(Boolean) : [];
    return initial.map((url, idx) => ({
      id: `existing-${idx}-${url}`,
      url,
      original: url,
    }));
  });

  // Drag and Drop States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);

  // Categories/Types mapping from Master Data
  const categoriesList = masterData?.tags?.filter((e: any) => e.tagsGroupsId === 3) || [];
  const typesList = masterData?.tags?.filter((e: any) => e.tagsGroupsId === 1) || [];

  // Parse Initial Form Values
  const initialCourses = (project?.course && project.course.length > 0)
    ? project.course.map((c) => ({ value: c.id.toString() }))
    : [{ value: "" }];
  const initialTypes = (project?.tag && project.tag.filter((t: any) => t.tagsGroupsId === 1).length > 0)
    ? project.tag.filter((t: any) => t.tagsGroupsId === 1).map((t) => ({ value: t.id.toString() }))
    : [{ value: "" }];
  const initialCategories = (project?.tag && project.tag.filter((t: any) => t.tagsGroupsId === 3).length > 0)
    ? project.tag.filter((t: any) => t.tagsGroupsId === 3).map((t) => ({ value: t.id.toString() }))
    : [{ value: "" }];
  const getMemberUserId = (m: any) => {
    if (m.user && m.user.id) {
      return m.user.id.toString();
    }
    return m.id?.toString() || "";
  };

  const initialTech = project?.techStacks?.map((tech) => ({ value: tech })) || [];
  const initialMembers = project?.member?.filter((m: any) => m.role.id === 2).map((m) => ({ userID: getMemberUserId(m) })) || [];
  const initialAdvisors = project?.member?.filter((m: any) => m.role.id === 3).map((m) => ({ userID: getMemberUserId(m) })) || [];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: project?.title || "",
      details: project?.details || "",
      youtubeURL: project?.youtubeURL || "",
      githubURL: project?.githubURL || "",
      documentURL: project?.documentURL || "",
      presentationURL: project?.presentationURL || "",
      figmaURL: project?.figmaURL || "",
      projectCourses: initialCourses,
      projectTypes: initialTypes,
      projectCategories: initialCategories,
      techStacks: initialTech,
      members: initialMembers,
      advisors: initialAdvisors,
    },
    mode: "onChange",
  });

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({ control, name: "projectCourses" });
  const { fields: typeFields, append: appendType, remove: removeType } = useFieldArray({ control, name: "projectTypes" });
  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({ control, name: "projectCategories" });
  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control, name: "techStacks" });
  const { fields: memberFields, append: appendMember, remove: removeMember } = useFieldArray({ control, name: "members" });
  const { fields: advisorFields, append: appendAdvisor, remove: removeAdvisor } = useFieldArray({ control, name: "advisors" });

  // YouTube Thumbnail Auto Extractor
  const watchYoutube = watch("youtubeURL");
  const [youtubeThumbnail, setYoutubeThumbnail] = useState<string>("");

  useEffect(() => {
    if (watchYoutube) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = watchYoutube.match(regExp);
      if (match && match[2].length === 11) {
        setYoutubeThumbnail(`https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`);
      } else {
        setYoutubeThumbnail("");
      }
    } else {
      setYoutubeThumbnail("");
    }
  }, [watchYoutube]);

  // Main Image Upload with Cropping
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setThumbnailFile(file);
      setIsCropping(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setThumbnailFile(croppedFile);
    setThumbnailPreview(URL.createObjectURL(croppedFile));
    setIsCropping(false);
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setThumbnailFile(null);
  };

  // Additional Images
  const handleAssetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAssets = Array.from(files).map((file, idx) => {
        const uniqueId = `new-${Date.now()}-${idx}-${Math.random()}`;
        return {
          id: uniqueId,
          file,
          url: URL.createObjectURL(file),
          original: file,
        };
      });
      setAssets((prev) => [...prev, ...newAssets].slice(0, 10));
    }
  };

  const handleRemoveAsset = (id: string) => {
    setAssets((prev) => {
      const target = prev.find(a => a.id === id);
      if (target?.file && target.url.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClearAllAssets = () => {
    assets.forEach((a) => {
      if (a.file && a.url.startsWith("blob:")) {
        URL.revokeObjectURL(a.url);
      }
    });
    setAssets([]);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: any, index: number) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index.toString());
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const reorderedAssets = [...assets];
      const draggedItem = reorderedAssets[draggedIndex];
      reorderedAssets.splice(draggedIndex, 1);
      reorderedAssets.splice(index, 0, draggedItem);
      setAssets(reorderedAssets);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Cancel Form Handler
  const handleCancel = () => {
    if (isDirty || thumbnailFile || assets.some(a => a.file)) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          // reset form and return to view mode
          reset();
          setThumbnailPreview(project?.thumbnailURL || "");
          setThumbnailFile(null);

          assets.forEach((a) => {
            if (a.file && a.url.startsWith("blob:")) {
              URL.revokeObjectURL(a.url);
            }
          });

          const initial = project?.assetsURL ? project.assetsURL.filter(Boolean) : [];
          setAssets(
            initial.map((url, idx) => ({
              id: `existing-${idx}-${url}`,
              url,
              original: url,
            }))
          );
          setIsEdit(false);
        },
      });
    } else {
      setIsEdit(false);
    }
  };

  // Submit Handler
  const onSubmit = async (data: FormData) => {
    if (!project) return;
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("details", data.details);
      formData.append("youtubeURL", data.youtubeURL);
      formData.append("githubURL", data.githubURL);
      formData.append("documentURL", data.documentURL);
      formData.append("presentationURL", data.presentationURL);
      formData.append("figmaURL", data.figmaURL);

      // Thumbnail
      if (thumbnailFile) {
        formData.append("thumbnailFile", thumbnailFile);
      }

      // Tech Stack
      const techList = data.techStacks.map(t => t.value).filter(Boolean);
      formData.append("techStacks", JSON.stringify(techList));

      // Courses
      const currentCourseIDs = data.projectCourses.map(c => parseInt(c.value)).filter(Boolean);
      const originalCourseIDs = project.course.map(c => c.id);
      const newCoursesID = currentCourseIDs.filter(id => !originalCourseIDs.includes(id));
      const deletedCoursesID = originalCourseIDs.filter(id => !currentCourseIDs.includes(id));
      formData.append("newCoursesID", JSON.stringify(newCoursesID));
      formData.append("deletedCoursesID", JSON.stringify(deletedCoursesID));

      // Tags/Categories/Types
      const currentTagIDs = [
        ...data.projectTypes.map(t => parseInt(t.value)).filter(Boolean),
        ...data.projectCategories.map(c => parseInt(c.value)).filter(Boolean)
      ];
      const originalTagIDs = project.tag.map(t => t.id);
      const newtagsID = currentTagIDs.filter(id => !originalTagIDs.includes(id));
      const deletedtagsID = originalTagIDs.filter(id => !currentTagIDs.includes(id));
      formData.append("newtagsID", JSON.stringify(newtagsID));
      formData.append("deletedtagsID", JSON.stringify(deletedtagsID));

      // Members (Students)
      const currentMemberIDs = data.members.map(m => parseInt(m.userID)).filter(Boolean);
      const originalMemberIDs = project.member.filter(m => (m as any).role.id === 2).map(m => {
        const uid = (m as any).user?.id || m.id;
        return typeof uid === "string" ? parseInt(uid) : uid;
      });
      const newMembers = currentMemberIDs
        .filter(id => !originalMemberIDs.includes(id))
        .map(userID => ({ userID, roleID: 2 }));
      const deletedmembersID = originalMemberIDs.filter(id => !currentMemberIDs.includes(id));

      // Advisors (Professors)
      const currentAdvisorIDs = data.advisors.map(a => parseInt(a.userID)).filter(Boolean);
      const originalAdvisorIDs = project.member.filter(m => (m as any).role.id === 3).map(m => {
        const uid = (m as any).user?.id || m.id;
        return typeof uid === "string" ? parseInt(uid) : uid;
      });
      const newAdvisors = currentAdvisorIDs
        .filter(id => !originalAdvisorIDs.includes(id))
        .map(userID => ({ userID, roleID: 3 }));
      const deletedAdvisorsID = originalAdvisorIDs.filter(id => !currentAdvisorIDs.includes(id));

      // Combine members changes
      const allNewMembers = [...newMembers, ...newAdvisors];
      const allDeletedMembers = [...deletedmembersID, ...deletedAdvisorsID];

      formData.append("newMembers", JSON.stringify(allNewMembers));
      formData.append("deletedmembersID", JSON.stringify(allDeletedMembers));

      // Assets handling: Separate existing URLs vs new Files
      const newAssetFiles: File[] = [];
      const remainingAssetURLs: string[] = [];

      assets.forEach((asset) => {
        if (asset.file) {
          newAssetFiles.push(asset.file);
        } else if (typeof asset.original === "string") {
          remainingAssetURLs.push(asset.original);
        }
      });

      // Pass new files
      newAssetFiles.forEach((file) => {
        formData.append("assets", file);
      });

      const updated = await projectService.updateProject(project.id.toString(), formData);
      if (updated) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            setConfirmModal(null);
            setIsEdit(false);
            router.refresh();
          },
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "ไม่สามารถบันทึกข้อมูลผลงานได้");
      setIsError(true);
    }
  };

  return (
    <ThemeProvider theme={Theme}>
      <div className="min-h-screen bg-[#EEF3F8] p-8">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isError}
          autoHideDuration={4000}
          onClose={() => setIsError(false)}
        >
          <Alert severity="error" onClose={() => setIsError(false)} sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>

        <div className="mx-auto max-w-5xl mb-6">
          <h1 className="text-3xl font-bold text-[#1E518E]">
            {isEdit ? "แก้ไขข้อมูลผลงาน" : "ดูข้อมูลผลงาน"}
          </h1>
        </div>

        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: ข้อมูลผลงาน */}
            <div className="space-y-4">
              <Typography variant="h6" fontWeight="bold" className="text-gray-700">
                ข้อมูลผลงาน
              </Typography>
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="relative flex h-[284px] w-full items-center justify-center rounded-xl bg-gray-100 md:w-[400px]">
                  {thumbnailPreview ? (
                    <div className="group relative h-full w-full">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        fill
                        className="rounded-xl object-cover"
                      />
                      {isEdit && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
                    <Button variant="outlined" component="label" disabled={!isEdit}>
                      อัปโหลดรูปภาพ
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <RHFTextField
                    control={control}
                    name="title"
                    label="หัวข้อ"
                    variant="outlined"
                    fullWidth
                    disabled={!isEdit}
                    placeholder="ระบุหัวข้อ"
                    requiredMark
                    sx={figmaInputStyle}
                  />
                  <RHFTextField
                    control={control}
                    name="details"
                    label="รายละเอียด"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!isEdit}
                    placeholder="ระบุรายละเอียด"
                    requiredMark
                    sx={figmaInputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: ข้อมูลการจัดหมวดหมู่ */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex gap-2">
                <Typography variant="h6" fontWeight="bold" className="text-gray-700">
                  ข้อมูลการจัดหมวดหมู่
                </Typography>
                <Typography variant="h6" className="text-gray-400 font-normal">
                  (สามารถเลือกได้มากกว่า 1 ในแต่ละคอลัมน์)
                </Typography>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* วิชา */}
                <div className="space-y-4 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">วิชา *</span>
                    {isEdit && (
                      <AddCircleOutlineOutlined
                        className="cursor-pointer text-primary02"
                        onClick={() => appendCourse({ value: "" })}
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    {courseFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <RHFSelect
                            control={control}
                            name={`projectCourses.${index}.value`}
                            label=""
                            variant="outlined"
                            fullWidth
                            disabled={!isEdit}
                            displayEmpty
                            sx={figmaInputStyle}
                            renderValue={(val: any) => {
                              if (!val) return <span className="text-gray-400">ระบุวิชา</span>;
                              const c = courses.find((x) => x.id.toString() === val);
                              return (c?.courseNameTh || val) as React.ReactNode;
                            }}
                          >
                            {courses.map((c) => (
                              <MenuItem key={c.id} value={c.id.toString()}>
                                {c.courseNameTh}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </div>
                        {isEdit && courseFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCourse(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ประเภท */}
                <div className="space-y-4 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">ประเภท *</span>
                    {isEdit && (
                      <AddCircleOutlineOutlined
                        className="cursor-pointer text-primary02"
                        onClick={() => appendType({ value: "" })}
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    {typeFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <RHFSelect
                            control={control}
                            name={`projectTypes.${index}.value`}
                            label=""
                            variant="outlined"
                            fullWidth
                            disabled={!isEdit}
                            displayEmpty
                            sx={figmaInputStyle}
                            renderValue={(val: any) => {
                              if (!val) return <span className="text-gray-400">ระบุประเภท</span>;
                              const t = typesList.find((x: any) => x.id.toString() === val);
                              return (t?.name || val) as React.ReactNode;
                            }}
                          >
                            {typesList.map((t: any) => (
                              <MenuItem key={t.id} value={t.id.toString()}>
                                {t.name}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </div>
                        {isEdit && typeFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeType(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* หมวดหมู่ */}
                <div className="space-y-4 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">หมวดหมู่ *</span>
                    {isEdit && (
                      <AddCircleOutlineOutlined
                        className="cursor-pointer text-primary02"
                        onClick={() => appendCategory({ value: "" })}
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    {categoryFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <RHFSelect
                            control={control}
                            name={`projectCategories.${index}.value`}
                            label=""
                            variant="outlined"
                            fullWidth
                            disabled={!isEdit}
                            displayEmpty
                            sx={figmaInputStyle}
                            renderValue={(val: any) => {
                              if (!val) return <span className="text-gray-400">ระบุหมวดหมู่</span>;
                              const c = categoriesList.find((x: any) => x.id.toString() === val);
                              return (c?.name || val) as React.ReactNode;
                            }}
                          >
                            {categoriesList.map((c: any) => (
                              <MenuItem key={c.id} value={c.id.toString()}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </div>
                        {isEdit && categoryFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Thumbnail วิดีโอ & ลิงก์ต่างๆ */}
            <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
              {/* Left Column: Thumbnail วิดีโอ */}
              <div className="space-y-4">
                <Typography variant="h6" fontWeight="bold" className="text-gray-700">
                  Thumbnail วิดีโอ
                </Typography>
                <div className="relative flex h-[440px] w-full items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                  {youtubeThumbnail ? (
                    <img
                      src={youtubeThumbnail}
                      alt="Youtube Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">ดึงรูปภาพโดยอัตโนมัติจากลิงก์ YouTube</span>
                  )}
                </div>
              </div>

              {/* Right Column: ลิงก์คลิปวิดีโอ & ลิงก์ต่างๆ */}
              <div className="space-y-6">
                {/* ลิงก์คลิปวิดีโอ */}
                <div className="space-y-4">
                  <Typography variant="h6" fontWeight="bold" className="text-gray-700">
                    ลิงก์คลิปวิดีโอ
                  </Typography>
                  <RHFTextField
                    control={control}
                    name="youtubeURL"
                    label="URL Youtube"
                    variant="outlined"
                    fullWidth
                    disabled={!isEdit}
                    placeholder="ระบุ URL Youtube"
                    requiredMark
                    sx={figmaInputStyle}
                  />
                </div>

                {/* ลิงก์ต่างๆ */}
                <div className="space-y-4">
                  <Typography variant="h6" fontWeight="bold" className="text-gray-700">
                    ลิงก์ต่างๆ
                  </Typography>
                  <div className="space-y-4">
                    <RHFTextField
                      control={control}
                      name="githubURL"
                      label="Github"
                      variant="outlined"
                      fullWidth
                      disabled={!isEdit}
                      placeholder="ระบุลิงก์ Github"
                      requiredMark
                      startIcon={<LinkIcon fontSize="small" />}
                      sx={figmaInputStyle}
                    />
                    <RHFTextField
                      control={control}
                      name="documentURL"
                      label="Document"
                      variant="outlined"
                      fullWidth
                      disabled={!isEdit}
                      placeholder="ระบุลิงก์ Document"
                      requiredMark
                      startIcon={<DescriptionIcon fontSize="small" />}
                      sx={figmaInputStyle}
                    />
                    <RHFTextField
                      control={control}
                      name="presentationURL"
                      label="Presentation"
                      variant="outlined"
                      fullWidth
                      disabled={!isEdit}
                      placeholder="ระบุลิงก์ Presentation"
                      requiredMark
                      startIcon={<SlideshowIcon fontSize="small" />}
                      sx={figmaInputStyle}
                    />
                    <RHFTextField
                      control={control}
                      name="figmaURL"
                      label="Figma"
                      variant="outlined"
                      fullWidth
                      disabled={!isEdit}
                      placeholder="ระบุลิงก์ Figma"
                      startIcon={<LinkIcon fontSize="small" />}
                      sx={figmaInputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: รูปภาพเพิ่มเติม */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-700">รูปภาพเพิ่มเติม *</span>
                  <span className="text-sm text-gray-400">{assets.length} รูป - สูงสุด 10</span>
                </div>
                {isEdit && assets.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllAssets}
                    className="text-sm font-semibold text-red-500 hover:text-red-700"
                  >
                    ล้างทั้งหมด
                  </button>
                )}
              </div>

              {/* Assets Gallery Grid */}
              {assets.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    <AnimatePresence mode="popLayout">
                      {assets.map((asset, index) => {
                        if (!asset || !asset.url) return null;
                        return (
                          <motion.div
                            key={asset.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            draggable={isEdit}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group relative h-[120px] rounded-lg bg-gray-100 transition-all duration-300 select-none overflow-hidden
                              ${isEdit ? "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg ring-1 ring-black/5 hover:ring-primary02/50" : ""}
                              ${draggedIndex === index ? "opacity-30 scale-95 border-2 border-dashed border-primary02" : ""}
                              ${dragOverIndex === index && draggedIndex !== index ? "scale-105 ring-2 ring-primary02 shadow-lg" : ""}
                            `}
                          >
                            <img
                              src={asset.url}
                              alt={`Asset ${index + 1}`}
                              className="h-full w-full rounded-lg object-cover pointer-events-none"
                            />
                            {isEdit && (
                              <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-lg">
                                {/* Close / Delete Button */}
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAsset(asset.id);
                                    }}
                                    className="rounded-full bg-red-600 p-1 text-white hover:bg-red-700 pointer-events-auto transition-transform hover:scale-110 active:scale-95"
                                  >
                                    <CloseIcon fontSize="small" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                  {isEdit && assets.length < 10 && (
                    <div className="mt-4 flex justify-start">
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          backgroundColor: "var(--color-primary02)",
                          "&:hover": { backgroundColor: "var(--color-primary03)" },
                          borderRadius: "8px",
                          px: 3,
                          py: 1,
                        }}
                      >
                        อัปโหลดรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleAssetsChange}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                isEdit && (
                  <label className="flex h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                    <AddCircleOutlineOutlined className="text-gray-400 text-3xl" />
                    <span className="mt-1 text-sm text-gray-500 font-semibold">อัปโหลดรูปภาพ</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleAssetsChange}
                    />
                  </label>
                )
              )}
            </div>

            {/* Section 6: Tech Stack */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-700">Tech Stack *</span>
                {isEdit && (
                  <AddCircleOutlineOutlined
                    className="cursor-pointer text-primary02"
                    onClick={() => appendTech({ value: "" })}
                  />
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {techFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <span className="text-gray-400">{index + 1}.</span>
                    <RHFTextField
                      control={control}
                      name={`techStacks.${index}.value`}
                      placeholder="เช่น React, Node.js"
                      variant="outlined"
                      fullWidth
                      disabled={!isEdit}
                      sx={figmaInputStyle}
                    />
                    {isEdit && (
                      <button
                        type="button"
                        onClick={() => removeTech(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: ผู้จัดทำ & อาจารย์ที่ปรึกษา */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-bold text-gray-700 mb-4">คณะผู้จัดทำและอาจารย์ที่ปรึกษา</h2>

              {/* คณะผู้จัดทำ */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">คณะผู้จัดทำ *</span>
                  {isEdit && (
                    <AddCircleOutlineOutlined
                      className="cursor-pointer text-primary02"
                      onClick={() => appendMember({ userID: "" })}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  {memberFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
                      <RHFSelect
                        control={control}
                        name={`members.${index}.userID`}
                        label="รหัสนักศึกษา"
                        variant="outlined"
                        fullWidth
                        disabled={!isEdit}
                        displayEmpty
                        sx={figmaInputStyle}
                        renderValue={(val: any) => {
                          if (!val) return <span className="text-gray-400">เลือกรหัสนักศึกษา</span>;
                          const s = students.find(x => x.user.id.toString() === val);
                          return (s?.studentCode || val) as React.ReactNode;
                        }}
                      >
                        {students.map((s) => (
                          <MenuItem key={s.id} value={s.user.id.toString()}>
                            {s.studentCode} ({s.user.firstNameTh} {s.user.lastNameTh})
                          </MenuItem>
                        ))}
                      </RHFSelect>

                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1">
                          <RHFSelect
                            control={control}
                            name={`members.${index}.userID`}
                            label="ชื่อ-นามสกุล"
                            variant="outlined"
                            fullWidth
                            disabled={!isEdit}
                            displayEmpty
                            sx={figmaInputStyle}
                            renderValue={(val: any) => {
                              if (!val) return <span className="text-gray-400">เลือกชื่อ-นามสกุล</span>;
                              const s = students.find(x => x.user.id.toString() === val);
                              if (s) return `${s.user.firstNameTh} ${s.user.lastNameTh}` as React.ReactNode;
                              const m = project?.member?.find(x => ((x as any).user?.id || x.id).toString() === val);
                              if (m) {
                                const u = (m as any).user || m;
                                return `${u.firstNameTh} ${u.lastNameTh}` as React.ReactNode;
                              }
                              return val as React.ReactNode;
                            }}
                          >
                            {students.map((s) => (
                              <MenuItem key={s.id} value={s.user.id.toString()}>
                                {s.user.firstNameTh} {s.user.lastNameTh} ({s.studentCode})
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </div>
                        {isEdit && (
                          <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* อาจารย์ที่ปรึกษา */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">อาจารย์ที่ปรึกษา *</span>
                  {isEdit && (
                    <AddCircleOutlineOutlined
                      className="cursor-pointer text-primary02"
                      onClick={() => appendAdvisor({ userID: "" })}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  {advisorFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <RHFSelect
                          control={control}
                          name={`advisors.${index}.userID`}
                          label="อาจารย์ที่ปรึกษา"
                          variant="outlined"
                          fullWidth
                          disabled={!isEdit}
                          sx={figmaInputStyle}
                          renderValue={(val: any) => {
                            if (!val) return <span className="text-gray-400">เลือกอาจารย์ที่ปรึกษา</span>;
                            const p = professors.find(x => x.user.id.toString() === val);
                            if (p) return `${p.user.firstNameTh} ${p.user.lastNameTh}` as React.ReactNode;
                            const m = project?.member?.find(x => ((x as any).user?.id || x.id).toString() === val);
                            if (m) {
                              const u = (m as any).user || m;
                              return `${u.firstNameTh} ${u.lastNameTh}` as React.ReactNode;
                            }
                            return val as React.ReactNode;
                          }}
                        >
                          {professors.map((p) => (
                            <MenuItem key={p.id} value={p.user.id.toString()}>
                              {p.user.firstNameTh} {p.user.lastNameTh}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </div>
                      {isEdit && (
                        <button
                          type="button"
                          onClick={() => removeAdvisor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
              {isEdit ? (
                <>
                  <Button variant="outlined" size="large" onClick={handleCancel}>
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!isValid}
                    sx={{
                      backgroundColor: "var(--color-primary02)",
                      "&:hover": { backgroundColor: "var(--color-primary03)" },
                    }}
                  >
                    บันทึกข้อมูล
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setIsEdit(true)}
                  sx={{
                    backgroundColor: "var(--color-primary02)",
                    "&:hover": { backgroundColor: "var(--color-primary03)" },
                  }}
                >
                  แก้ไขข้อมูล
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Modal Confirmations */}
        {confirmModal && <ConfirmModal {...confirmModal} />}

        {/* Image Cropping Modal */}
        {isCropping && thumbnailFile && (
          <Modal open={isCropping} onClose={handleCropCancel} closeAfterTransition>
            <CropImageCard
              file={thumbnailFile}
              width={400}
              height={284}
              onUploadComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          </Modal>
        )}
      </div>
    </ThemeProvider>
  );
};

export default ProjectForm;
