"use client";
import React, { FC, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Typography, IconButton } from "@mui/material";
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
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { ICourse } from "@/core/domain/course";
import { CropImageCard } from "@/components/cropimagecard"; 
import { projectService, courseService, masterDataService, studentService, professorService } from "@/infra/container";

interface FormProjectsProps {
  apiBase: string;
}

const Schema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกหัวข้อ"),
  details: z.string().trim().min(1, "กรุณากรอกรายละเอียด"),
  youtubeURL: z.string().trim().url("กรุณากรอกลิงก์ YouTube ให้ถูกต้อง (ต้องเป็น URL)"),
  githubURL: z.string().trim().url("ลิงก์ Github ไม่ถูกต้อง").or(z.literal("")).optional(),
  documentURL: z.string().trim().url("ลิงก์ Document ไม่ถูกต้อง").or(z.literal("")).optional(),
  presentationURL: z.string().trim().url("ลิงก์ Presentation ไม่ถูกต้อง").or(z.literal("")).optional(),
  projectCourses: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกวิชา") })).min(1, "กรุณาเลือกวิชาอย่างน้อย 1 วิชา"),
  projectTypes: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกประเภท") })).min(1, "กรุณาเลือกประเภทอย่างน้อย 1 ประเภท"),
  projectCategories: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกหมวดหมู่") })).min(1, "กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวดหมู่"),
  techStacks: z.array(z.object({ value: z.string().trim().min(1, "ระบุ Tech Stack") })).min(1, "ระบุอย่างน้อย 1 Tech Stack"),
  students: z.array(
    z.object({
      userID: z.number().min(1, "เลือกนักศึกษา"),
    })
  ).min(1, "กรุณาเพิ่มผู้จัดทำอย่างน้อย 1 คน"),
  advisors: z.array(
    z.object({
      userID: z.number().min(1, "เลือกอาจารย์"),
    })
  ).min(1, "กรุณาเพิ่มอาจารย์ที่ปรึกษาอย่างน้อย 1 คน"),
});

type ProjectFormValues = z.infer<typeof Schema>;

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
  const [students, setStudentsList] = useState<any[]>([]);
  const [professors, setProfessorsList] = useState<any[]>([]);


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<File[]>([]);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  const [tempThumbFile, setTempThumbFile] = useState<File | null>(null);
  const [tempVideoFile, setTempVideoFile] = useState<File | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const CURRICULUM_ID = 1; // ใส่ ID จริง
      const CLASS_BOOK_ID = 1; // ใส่ ID รุ่น/ปีการศึกษาจริง — ต้องเช็คว่าค่าไหนถูก

      const [coursesRes, masterData, studentsRes, professorsRes] = await Promise.all([
        courseService.getCourse({ page: 1, pageSize: 100, curriculumID: CURRICULUM_ID }),
        masterDataService.getMasterData(),
        studentService.getStudents({ page: 1, pageSize: 100, classBookID: CLASS_BOOK_ID }),
        professorService.getProfessors({ page: 1, pageSize: 100 }),
      ]);

      console.log("coursesRes:", coursesRes);
      console.log("masterData:", masterData);
      console.log("studentsRes:", studentsRes);
      console.log("professorsRes:", professorsRes);

      setCourses(coursesRes.rows);

      const typeGroup = masterData.tagsGroups.find((g) => g.name === "type");
      const categoryGroup = masterData.tagsGroups.find((g) => g.name === "category");

      setTypes(masterData.tags.filter((t) => t.tagsGroupsId === typeGroup?.id));
      setCategories(masterData.tags.filter((t) => t.tagsGroupsId === categoryGroup?.id));

      setStudentsList(studentsRes.rows);
      setProfessorsList(professorsRes.rows);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, []);
  const { control, handleSubmit, formState: { isValid, isDirty } } = useForm<ProjectFormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "", details: "", youtubeURL: "", githubURL: "", documentURL: "", presentationURL: "",
      projectCourses: [{ value: 0 }], projectTypes: [{ value: 0 }], projectCategories: [{ value: 0 }],
      techStacks: [{ value: "" }], students: [{ userID: 0 }], advisors: [{ userID: 0 }],
    },
    mode: "onSubmit",
  });

  const { fields: projectCoursesFields, append: appendProjectCourses, remove: removeProjectCourses } = useFieldArray({ control, name: "projectCourses" });
  const { fields: projectTypesFields, append: appendProjectTypes, remove: removeProjectTypes } = useFieldArray({ control, name: "projectTypes" });
  const { fields: projectCategoriesFields, append: appendProjectCategories, remove: removeProjectCategories } = useFieldArray({ control, name: "projectCategories" });
  const { fields: techStacksFields, append: appendTechStacks, remove: removeTechStacks } = useFieldArray({ control, name: "techStacks" });
  const { fields: studentsFields, append: appendStudents, remove: removeStudents } = useFieldArray({ control, name: "students" });
  const { fields: advisorsFields, append: appendAdvisors, remove: removeAdvisors } = useFieldArray({ control, name: "advisors" });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setTempThumbFile(file);
    event.target.value = ""; 
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setTempVideoFile(file);
    event.target.value = ""; 
  };

  const handleAssetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedAssets((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 10);
      });
    }
  };

  const removeAsset = (indexToRemove: number) => setSelectedAssets((prev) => prev.filter((_, index) => index !== indexToRemove));
  const removeAllAssets = () => setSelectedAssets([]);

  const handleDragStart = (index: number) => setDraggedItemIndex(index);
  const handleDragEnter = (index: number) => setDragOverItemIndex(index);
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };
  const handleDrop = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      setSelectedAssets((prev) => {
        const newAssets = [...prev];
        const draggedItem = newAssets[draggedItemIndex];
        newAssets.splice(draggedItemIndex, 1);
        newAssets.splice(index, 0, draggedItem);
        return newAssets;
      });
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const cancelForm = () => {
    const hasAnyValue = isDirty || !!selectedFile || !!selectedVideoFile || selectedAssets.length > 0;
    if (hasAnyValue) {
      setConfirmModal({ isOpen: true, type: "warning", onClose: () => setConfirmModal(null), onConfirm: () => router.push(`/admin/projects`) });
    } else router.push(`/admin/projects`);
  };

  const handleConfirmSubmit = handleSubmit(async (data: ProjectFormValues) => {
    try {
      if (!selectedFile) { setErrorMsg("กรุณาอัปโหลดรูปภาพหลัก"); setIsError(true); return; }
      if (!selectedVideoFile) { setErrorMsg("กรุณาอัปโหลดรูปภาพ Thumbnail วิดีโอ"); setIsError(true); return; }

      const formData = new FormData();
      formData.append("thumbnailFile", selectedFile);
      formData.append("videoThumbnailFile", selectedVideoFile); 
      selectedAssets.forEach((file) => formData.append("assets", file));

      formData.append("title", data.title);
      formData.append("details", data.details);
      formData.append("youtubeURL", data.youtubeURL);
      if (data.githubURL) formData.append("githubURL", data.githubURL);
      if (data.documentURL) formData.append("documentURL", data.documentURL);
      if (data.presentationURL) formData.append("presentationURL", data.presentationURL);

      data.projectCourses.forEach((c) => formData.append("coursesID", c.value.toString()));
      data.techStacks.forEach((t) => formData.append("techStacks", t.value));
      
      const allTags = [...data.projectTypes, ...data.projectCategories];
      allTags.forEach((tag) => formData.append("tagsID", tag.value.toString()));

      const formattedStudents = data.students.map(s => ({ userID: s.userID, roleID: 1 }));
      const formattedAdvisors = data.advisors.map(a => ({ userID: a.userID, roleID: 2 }));
      const allMembers = [...formattedStudents, ...formattedAdvisors];
      
      allMembers.forEach((member, index) => {
        formData.append(`members[${index}][userID]`, member.userID.toString());
        formData.append(`members[${index}][roleID]`, member.roleID.toString());
      });

      await projectService.createProject(formData);
      router.push(`/admin/projects`);
      
    } catch (error) {
      console.error(error);
      setErrorMsg("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      setIsError(true);
    }
  });

  return (
    <div className="space-y-4 p-8 relative">
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={isError} autoHideDuration={4000} onClose={() => setIsError(false)}>
        <Alert severity="error" onClose={() => setIsError(false)} sx={{ width: "100%" }}>{errorMsg}</Alert>
      </Snackbar>

      {tempThumbFile && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <CropImageCard 
            file={tempThumbFile} 
            width={400} 
            height={284} 
            onUploadComplete={(croppedFile) => {
              setSelectedFile(croppedFile);
              setTempThumbFile(null);
            }} 
            onCancel={() => setTempThumbFile(null)} 
          />
        </div>
      )}

      {tempVideoFile && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <CropImageCard 
            file={tempVideoFile} 
            width={400} 
            height={284} 
            onUploadComplete={(croppedFile) => {
              setSelectedVideoFile(croppedFile);
              setTempVideoFile(null);
            }} 
            onCancel={() => setTempVideoFile(null)} 
          />
        </div>
      )}

      <div>
        <Typography variant="h6" fontWeight="bold">ข้อมูลผลงาน</Typography>

        <div className="mt-6 mb-8 flex flex-row items-stretch gap-x-8 h-auto">
          <div className="w-[400px] shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-300 relative flex flex-col justify-center items-center group">
            {selectedFile ? (
              <>
                <Image src={URL.createObjectURL(selectedFile)} alt="Preview" fill style={{ objectFit: "cover" }} className="absolute inset-0 z-0" />
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="contained" component="label" sx={{ backgroundColor: "var(--color-primary02)" }}>
                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="contained" component="label" sx={{ backgroundColor: "var(--color-primary02)", zIndex: 10 }}>
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                อัปโหลดรูปภาพ
              </Button>
            )}
          </div>
          
          <div className="flex flex-1 flex-col gap-4">
            <RHFTextField control={control} name="title" label="หัวข้อ" variant="outlined" fullWidth requiredMark />
            <div className="flex-1 flex flex-col">
               <RHFTextField 
                  control={control} 
                  name="details" 
                  label="รายละเอียด" 
                  variant="outlined" 
                  fullWidth 
                  multiline 
                  rows={8} 
                  requiredMark 
                  sx={{ flex: 1, '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } }} 
               />
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-1 flex-col gap-y-5">
          <div className="flex gap-2">
            <Typography variant="h6" fontWeight="bold">ข้อมูลการจัดหมวดหมู่</Typography>
            <Typography variant="h6" fontWeight="regular">(สามารถเลือกได้มากกว่า 1 ในแต่ละคอลัมม์)</Typography>
          </div>
          
          <div className="flex items-stretch justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">วิชา</h2>
                <IconButton onClick={() => appendProjectCourses({ value: 0 })} color="primary"><AddCircleOutlineOutlined /></IconButton>
              </div>
              <div className="space-y-2">
                {projectCoursesFields.map((field, index) => (
                  <div className="flex items-start justify-between gap-3" key={field.id}>
                    <div className="flex-1">
                      <RHFSelect control={control} name={`projectCourses.${index}.value`} label="วิชา" variant="outlined" fullWidth displayEmpty requiredMark>
                        {courses?.map((course) => <MenuItem key={course.id} value={course.id}>{course.courseNameTh}</MenuItem>)}
                      </RHFSelect>
                    </div>
                    <IconButton onClick={() => removeProjectCourses(index)} disabled={projectCoursesFields.length === 1} sx={{ color: projectCoursesFields.length === 1 ? '#e0e0e0' : 'error.main', mt: 3.5 }}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-[1px] bg-gray-200 mt-10"></div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">ประเภท</h2>
                <IconButton onClick={() => appendProjectTypes({ value: 0 })} color="primary"><AddCircleOutlineOutlined /></IconButton>
              </div>
              <div className="space-y-2">
                {projectTypesFields.map((field, index) => (
                  <div className="flex items-start justify-between gap-3" key={field.id}>
                    <div className="flex-1">
                      <RHFSelect control={control} name={`projectTypes.${index}.value`} label="ประเภท" variant="outlined" fullWidth displayEmpty requiredMark>
                        {types?.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                      </RHFSelect>
                    </div>
                    <IconButton onClick={() => removeProjectTypes(index)} disabled={projectTypesFields.length === 1} sx={{ color: projectTypesFields.length === 1 ? '#e0e0e0' : 'error.main', mt: 3.5 }}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[1px] bg-gray-200 mt-10"></div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">หมวดหมู่</h2>
                <IconButton onClick={() => appendProjectCategories({ value: 0 })} color="primary"><AddCircleOutlineOutlined /></IconButton>
              </div>
              <div className="space-y-2">
                {projectCategoriesFields.map((field, index) => (
                  <div className="flex items-start justify-between gap-3" key={field.id}>
                    <div className="flex-1">
                      <RHFSelect control={control} name={`projectCategories.${index}.value`} label="หมวดหมู่" variant="outlined" fullWidth displayEmpty requiredMark>
                        {categories?.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                      </RHFSelect>
                    </div>
                    <IconButton onClick={() => removeProjectCategories(index)} disabled={projectCategoriesFields.length === 1} sx={{ color: projectCategoriesFields.length === 1 ? '#e0e0e0' : 'error.main', mt: 3.5 }}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 flex flex-row items-stretch gap-x-8 pt-4 h-auto">
          <div className="w-[400px] shrink-0 flex flex-col">
            <Typography variant="h6" fontWeight="bold" className="mb-4">Thumbnail วิดีโอ</Typography>
            <div className="bg-gray-50 flex-1 relative rounded-xl overflow-hidden border border-gray-300 flex flex-col justify-center items-center group">
              {selectedVideoFile ? (
                <>
                  <Image src={URL.createObjectURL(selectedVideoFile)} alt="Video Preview" fill style={{ objectFit: "cover" }} className="absolute inset-0 z-0" />
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="contained" component="label" sx={{ backgroundColor: "var(--color-primary02)" }}>
                      <VisuallyHiddenInput type="file" accept="image/*" onChange={handleVideoFileChange} />
                      อัปโหลดรูปภาพ
                    </Button>
                  </div>
                </>
              ) : (
                <Button variant="contained" component="label" sx={{ backgroundColor: "var(--color-primary02)", zIndex: 10 }}>
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleVideoFileChange} />
                  อัปโหลดรูปภาพ
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <Typography variant="h6" fontWeight="bold">ลิงก์คลิปวิดีโอ</Typography>
            <RHFTextField control={control} name="youtubeURL" label="URL Youtube" variant="outlined" fullWidth requiredMark />
            
            <Typography variant="h6" fontWeight="bold" className="mt-2">ลิงก์ต่างๆ</Typography>
            <RHFTextField control={control} name="githubURL" label="Github" variant="outlined" fullWidth startIcon={<LinkIcon fontSize="small" />} />
            <RHFTextField control={control} name="documentURL" label="Document" variant="outlined" fullWidth startIcon={<DescriptionIcon fontSize="small" />} />
            <RHFTextField control={control} name="presentationURL" label="Presentation" variant="outlined" fullWidth startIcon={<SlideshowIcon fontSize="small" />} />
          </div>
        </div>

        <div className="my-10 pt-4">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6" fontWeight="bold">
              รูปภาพเพิ่มเติม (ลากเพื่อเปลี่ยนลำดับรูป) <span className="text-gray-500 font-normal text-sm ml-2">{selectedAssets.length} รูป - สูงสุด 10</span>
            </Typography>
            {selectedAssets.length > 0 && (
              <button type="button" onClick={removeAllAssets} className="text-red-500 hover:text-red-700 font-bold text-sm underline cursor-pointer">
                ลบทั้งหมด
              </button>
            )}
          </div>
          
          {selectedAssets.length === 0 ? (
            <div className="w-full flex items-center justify-center p-10 bg-gray-50 border border-solid border-gray-200 rounded-lg min-h-[200px]">
              <Button variant="contained" component="label" sx={{ backgroundColor: "var(--color-primary02)" }}>
                  <VisuallyHiddenInput type="file" accept="image/*" multiple onChange={handleAssetsChange} />
                  อัปโหลดรูปภาพ
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-4 items-start rounded-lg min-h-[160px]">
              {selectedAssets.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`} 
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={handleDragEnd}
                  onDrop={() => handleDrop(index)}
                  className={`relative aspect-video w-full rounded-md overflow-hidden cursor-grab active:cursor-grabbing transition-all border-2 
                    ${dragOverItemIndex === index ? 'border-[var(--color-primary02)] border-dashed scale-105' : 'border-gray-200 border-solid'} 
                    ${draggedItemIndex === index ? 'opacity-40' : 'opacity-100'} group`}
                >
                  <Image src={URL.createObjectURL(file)} alt="asset" fill style={{ objectFit: "cover", pointerEvents: "none" }} draggable={false} />
                  
                  <IconButton 
                    size="small" 
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 24, height: 24, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' } }} 
                    onClick={() => removeAsset(index)}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </div>
              ))}

              {selectedAssets.length < 10 && (
                <div className="aspect-video w-full rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                  <Button variant="contained" component="label" sx={{ height: "40px", backgroundColor: "var(--color-primary02)" }}>
                    <VisuallyHiddenInput type="file" accept="image/*" multiple onChange={handleAssetsChange} />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="my-10 pt-4">
          <div className="flex items-center justify-between mb-4">
             <Typography variant="h6" fontWeight="bold">Tech Stack</Typography>
             <IconButton onClick={() => appendTechStacks({ value: "" })} color="primary"><AddCircleOutlineOutlined /></IconButton>
          </div>
          <div className="space-y-4">
            {techStacksFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <span className="font-semibold text-gray-400 w-6">{index + 1}.</span>
                <div className="flex-1">
                  <RHFTextField control={control} name={`techStacks.${index}.value`} variant="outlined" fullWidth />
                </div>
                <IconButton onClick={() => removeTechStacks(index)} disabled={techStacksFields.length === 1} sx={{ color: techStacksFields.length === 1 ? '#e0e0e0' : 'error.main' }}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 pt-4">
          <Typography variant="h6" fontWeight="bold" className="mb-6">คณะผู้จัดทำและอาจารย์ที่ปรึกษา</Typography>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="subtitle1" fontWeight="bold">คณะผู้จัดทำ</Typography>
              <IconButton onClick={() => appendStudents({ userID: 0 })} color="primary"><AddCircleOutlineOutlined /></IconButton>
            </div>
            <div className="space-y-4">
              {studentsFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <RHFSelect control={control} name={`students.${index}.userID`} label="รหัสนักศึกษา" variant="outlined" fullWidth displayEmpty requiredMark>
                      {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.studentID}</MenuItem>)}
                    </RHFSelect>
                    <RHFSelect control={control} name={`students.${index}.userID`} label="ชื่อ-นามสกุล" variant="outlined" fullWidth displayEmpty requiredMark>
                      {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </RHFSelect>
                  </div>
                  <IconButton onClick={() => removeStudents(index)} disabled={studentsFields.length === 1} sx={{ color: studentsFields.length === 1 ? '#e0e0e0' : 'error.main', mt: 3.5 }}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="subtitle1" fontWeight="bold">อาจารย์ที่ปรึกษา</Typography>
              <IconButton onClick={() => appendAdvisors({ userID: 0 })} color="primary"><AddCircleOutlineOutlined /></IconButton>
            </div>
            <div className="space-y-4">
              {advisorsFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-[2]">
                    <RHFSelect control={control} name={`advisors.${index}.userID`} label="อาจารย์ที่ปรึกษา" variant="outlined" fullWidth displayEmpty requiredMark>
                      {professors.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </RHFSelect>
                  </div>
                  <IconButton onClick={() => removeAdvisors(index)} disabled={advisorsFields.length === 1} sx={{ color: advisorsFields.length === 1 ? '#e0e0e0' : 'error.main', mt: 3.5 }}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-row justify-end gap-x-4 mt-10">
        <Button variant="outlined" size="large" onClick={cancelForm} sx={{ borderColor: 'var(--color-primary02)', color: 'var(--color-primary02)' }}>
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" size="large" onClick={handleConfirmSubmit} disabled={!isValid} sx={{ backgroundColor: 'var(--color-primary02)' }}>
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};