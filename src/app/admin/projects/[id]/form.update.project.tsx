"use client";
import React, { FC, useState, useMemo } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Button, IconButton, Modal, Box, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
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
import { ProjectRepository } from "@/infra/repositories/project.repository";
import { ProjectService } from "@/core/service/project.service";
import { IUpdateProject } from "@/core/domain/project";
import { MasterData } from "@/core/domain/master-data";
import { IStudent } from "@/core/domain/student";
import { IProfessor } from "@/core/domain/professor";
import { IProject } from "@/core/domain/project";
import { updateProjectSchema, ProjectFormValues } from "@/core/schema/project";
interface FormUpdateProjectProps {
  apiBase: string;
  projectId: string;
  initialProject: Partial<IProject>;
  initialCourses: ICourse[];
  initialMasterData: MasterData;
  initialStudents: IStudent[];
  initialProfessors: IProfessor[];
}

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

export const FormUpdateProject: FC<FormUpdateProjectProps> = ({ apiBase, projectId, initialProject, initialCourses, initialMasterData, initialStudents, initialProfessors }) => {

  const projectsService = useMemo(() => {
    const projectsRepository = new ProjectRepository(apiBase);
    return new ProjectService(projectsRepository);
  }, [apiBase]);

  const courses = initialCourses;
  const students = initialStudents;
  const professors = initialProfessors;
  const types: Tag[] = initialMasterData?.tags?.filter((t: Tag) => t.tagsGroupsId === 1) || [];
  const categories: Tag[] = initialMasterData?.tags?.filter((t: Tag) => t.tagsGroupsId === 3) || [];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);
  const [assetsError, setAssetsError] = useState(false);
  const [isCroping, setIsCroping] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<File[]>([]);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  const [tempThumbFile, setTempThumbFile] = useState<File | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const initCourses = initialProject.course?.map((c: ICourse) => ({ value: c.id })) || [];
  const initTypes = (initialProject.tag as unknown as Tag[])?.filter((t) => t.tagsGroupsId === 1).map((t) => ({ value: t.id })) || [];
  const initCategories = (initialProject.tag as unknown as Tag[])?.filter((t) => t.tagsGroupsId === 3).map((t) => ({ value: t.id })) || [];
  const initTechStacks = initialProject.techStacks?.map((ts: string) => ({ value: ts })) || [];
  const initStudents = (initialProject.member as unknown as { id: number; roleID: number; roleId: number }[])?.filter((m) => m.roleID === 2 || m.roleId === 2).map((m) => ({ userID: m.id })) || [];
  const initAdvisors = (initialProject.member as unknown as { id: number; roleID: number; roleId: number }[])?.filter((m) => m.roleID === 3 || m.roleId === 3).map((m) => ({ userID: m.id })) || [];


  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<ProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      title: initialProject.title || "", 
      details: initialProject.details || "", 
      youtubeURL: initialProject.youtubeURL || "", 
      githubURL: initialProject.githubURL || "", 
      documentURL: initialProject.documentURL || "", 
      presentationURL: initialProject.presentationURL || "",
      projectCourses: initCourses.length > 0 ? initCourses : [{ value: 0 }], 
      projectTypes: initTypes.length > 0 ? initTypes : [{ value: 0 }], 
      projectCategories: initCategories.length > 0 ? initCategories : [{ value: 0 }],
      techStacks: initTechStacks.length > 0 ? initTechStacks : [{ value: "" }], 
      students: initStudents.length > 0 ? initStudents : [{ userID: 0 }], 
      advisors: initAdvisors.length > 0 ? initAdvisors : [{ userID: 0 }],
    },
    mode: "onChange",
});

  const { fields: projectCoursesFields, append: appendProjectCourses, remove: removeProjectCourses } = useFieldArray({ control, name: "projectCourses" });
  const { fields: projectTypesFields, append: appendProjectTypes, remove: removeProjectTypes } = useFieldArray({ control, name: "projectTypes" });
  const { fields: projectCategoriesFields, append: appendProjectCategories, remove: removeProjectCategories } = useFieldArray({ control, name: "projectCategories" });
  const { fields: techStacksFields, append: appendTechStacks, remove: removeTechStacks } = useFieldArray({ control, name: "techStacks" });
  const { fields: studentsFields, append: appendStudents, remove: removeStudents } = useFieldArray({ control, name: "students" });
  const { fields: advisorsFields, append: appendAdvisors, remove: removeAdvisors } = useFieldArray({ control, name: "advisors" });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTempThumbFile(file);
      setIsCroping(true);
    }
    event.target.value = ""; 
  };

  const handleCropComplete = (croppedFile: File) => {
  setSelectedFile(croppedFile);
  setImageError(false);
  setIsCroping(false);
  setTempThumbFile(null);
  };

  const handleCropCancel = () => {
  setIsCroping(false);
  setTempThumbFile(null);
  };

  const handleAssetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedAssets((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 10);
      });
      setAssetsError(false);
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
    const hasAnyValue = isDirty || !!selectedFile || selectedAssets.length > 0;
    if (hasAnyValue) {
      setConfirmModal({ 
        isOpen: true, 
        type: "warning", 
        onClose: () => setConfirmModal(null), 
        onConfirm: () => {
          setConfirmModal(null);
          reset();
          setSelectedFile(null); 
          setSelectedAssets([]);
          setIsEditMode(false);
        }
      });
    } else {
      setIsEditMode(false);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    try {
      console.log("Form data:", data);
      const oldCourses = initialProject.course?.map((c) => c.id) || [];
      const oldTypes = (initialProject.tag as unknown as Tag[])?.filter((t) => t.tagsGroupsId === 1).map((t) => t.id) || [];
      const oldCategories = (initialProject.tag as unknown as Tag[])?.filter((t) => t.tagsGroupsId === 3).map((t) => t.id) || [];
      const oldTags = [...oldTypes, ...oldCategories];
      const oldStudents = (initialProject.member as unknown as { id: number; roleID: number; roleId: number }[])?.filter((m) => m.roleID === 2 || m.roleId === 2).map((m) => m.id) || [];
      const oldAdvisors = (initialProject.member as unknown as { id: number; roleID: number; roleId: number }[])?.filter((m) => m.roleID === 3 || m.roleId === 3).map((m) => m.id) || [];

      const newCoursesFromForm = data.projectCourses.map((c) => Number(c.value)).filter((v) => v > 0);
      const newTagsFromForm = [...data.projectTypes, ...data.projectCategories].map((t) => Number(t.value)).filter((v) => v > 0);
      const newStudentsFromForm = data.students.map((s) => Number(s.userID)).filter((v) => v > 0);
      const newAdvisorsFromForm = data.advisors.map((a) => Number(a.userID)).filter((v) => v > 0);

      const newCoursesID = newCoursesFromForm.filter((id) => !oldCourses.includes(id));
      const deletedCoursesID = oldCourses.filter((id) => !newCoursesFromForm.includes(id));

      const newtagsID = newTagsFromForm.filter((id) => !oldTags.includes(id));
      const deletedtagsID = oldTags.filter((id) => !newTagsFromForm.includes(id));

      const newStudentsID = newStudentsFromForm.filter((id) => !oldStudents.includes(id));
      const newAdvisorsID = newAdvisorsFromForm.filter((id) => !oldAdvisors.includes(id));
      const deletedStudentsID = oldStudents.filter((id) => !newStudentsFromForm.includes(id));
      const deletedAdvisorsID = oldAdvisors.filter((id) => !newAdvisorsFromForm.includes(id));

      const newMembers = [
        ...newStudentsID.map((id) => ({ userID: id, roleID: 2 })),
        ...newAdvisorsID.map((id) => ({ userID: id, roleID: 3 })),
      ];
      const deletedmembersID = [...deletedStudentsID, ...deletedAdvisorsID];

      const payload: IUpdateProject = {
        title: data.title,
        details: data.details,
        youtubeURL: data.youtubeURL,
        githubURL: data.githubURL,
        documentURL: data.documentURL,
        presentationURL: data.presentationURL,
        figmaURL: null,
        techStacks: data.techStacks.map((t) => t.value).filter((v) => v !== ""),
        newtagsID,
        deletedtagsID,
        newMembers,
        deletedmembersID,
        newCoursesID,
        deletedCoursesID,
      };
      
      const files = {
        thumbnailFile: selectedFile || null,
        assets: selectedAssets.length > 0 ? selectedAssets : undefined
      };

      await projectsService.updateProject(projectId, payload, files);
      router.push("/admin/projects");
      
    } catch (error) {
      console.error(error);
      setErrorMsg("ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      setIsError(true);
    }
  };

  return (
    <form className="space-y-4 p-8 relative" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ "& .MuiInputBase-root.Mui-disabled": { backgroundColor: "#f3f4f6" } }}>
        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={isError} autoHideDuration={4000} onClose={() => setIsError(false)}>
          <Alert severity="error" onClose={() => setIsError(false)} sx={{ width: "100%" }}>{errorMsg}</Alert>
        </Snackbar>

        <div>
          <h3 className="font-bold">ข้อมูลผลงาน</h3>
        <div className="mt-6 mb-8 flex flex-row items-stretch gap-x-8 h-auto">
          <div className="w-[400px] shrink-0 flex flex-col gap-2">
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-300 relative flex flex-col justify-center items-center group h-full">
              {selectedFile ? (
                <>
                  <Image src={URL.createObjectURL(selectedFile)} alt="Preview" fill className="absolute inset-0 z-0 object-cover" />
                  {isEditMode && <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button variant="contained" component="label">
                      <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                      อัปโหลดรูปภาพ
                    </Button>
                  </div>}
                </>
              ) : initialProject.thumbnailURL ? (
                <>
                  <Image src={initialProject.thumbnailURL} alt="Preview" fill unoptimized className="absolute inset-0 z-0 object-cover" />
                  {isEditMode && <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button variant="contained" component="label">
                      <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                      อัปโหลดรูปภาพ
                    </Button>
                  </div>}
                </>
              ) : (
                <>
                  {isEditMode && <Button variant="contained" component="label" sx={{ zIndex: 10 }}>
                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                    อัปโหลดรูปภาพ
                  </Button>}
                </>
              )}
            </div>

            {imageError && (
              <p className="text-h5 text-accent04">กรุณาอัปโหลดรูปภาพหลัก</p>
            )}
            
          </div>
          
          <div className="flex flex-1 flex-col gap-4">
            <RHFTextField disabled={!isEditMode}
              control={control}
              name="title"
              label="หัวข้อ"
              variant="outlined"
              fullWidth
              requiredMark
            />
            <div className="flex-1 flex flex-col">
               <RHFTextField disabled={!isEditMode}
                  control={control} 
                  name="details" 
                  label="รายละเอียด" 
                  variant="outlined" 
                  fullWidth 
                  multiline 
                  rows={8} 
                  requiredMark 
                  sx={{ 
                    flex: 1, 
                    '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } 
                  }} 
               />
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-1 flex-col gap-y-5">
          <div className="flex gap-2">
            <h3 className="font-bold">ข้อมูลการจัดหมวดหมู่</h3>
            <p className="text-h3 font-normal">(สามารถเลือกได้มากกว่า 1 ในแต่ละคอลัมม์)</p>
          </div>
          
          <div className="flex items-stretch justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">วิชา</h3>
                {isEditMode && <IconButton 
                  onClick={() => appendProjectCourses({ value: 0 })} 
                  sx={{ color: "var(--color-primary03)" }}
                  >
                    <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
                </IconButton>}
              </div>
              <div className="space-y-2">
                {projectCoursesFields.map((field, index) => (
                  <div className="flex items-start justify-between gap-3" key={field.id}>
                    <div className="flex-1">
                      <RHFSelect disabled={!isEditMode}
                        control={control}
                        name={`projectCourses.${index}.value`}
                        label="วิชา"
                        fullWidth
                        displayEmpty
                        requiredMark
                      >
                        {courses?.map((course) => (
                          <MenuItem key={course.id} value={course.id}>
                            {course.courseNameTh}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>
                    {isEditMode && <IconButton 
                      onClick={() => removeProjectCourses(index)} disabled={projectCoursesFields.length === 1} color="error" sx={{ mt: 2.8 }}>
                      <DeleteIcon sx={{ fontSize: 34 }}/>
                    </IconButton>}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-[1px] bg-neutral03 mt-10"></div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">ประเภท</h3>
                {isEditMode && <IconButton 
                  onClick={() => appendProjectTypes({ value: 0 })} 
                  sx={{ color: "var(--color-primary03)" }}
                  >
                    <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
                </IconButton>}
              </div>
              <div className="space-y-2">
                {projectTypesFields.map((field, index) => (
                  <div className="flex items-start justify-between gap-3" key={field.id}>
                    <div className="flex-1">
                      <RHFSelect disabled={!isEditMode}
                        control={control}
                        name={`projectTypes.${index}.value`}
                        label="ประเภท"
                        fullWidth
                        displayEmpty
                        requiredMark
                      >
                        {types?.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>
                    {isEditMode && <IconButton onClick={() => removeProjectTypes(index)} disabled={projectTypesFields.length === 1} color="error" sx={{ mt: 2.8 }}>
                      <DeleteIcon sx={{ fontSize: 34 }}/>
                    </IconButton>}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[1px] bg-neutral03 mt-10"></div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">หมวดหมู่</h3>
                {isEditMode && <IconButton 
                  onClick={() => appendProjectCategories({ value: 0 })} 
                  sx={{ color: "var(--color-primary03)" }}
                  >
                    <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
                </IconButton>}
              </div>
              <div className="space-y-2">
                {projectCategoriesFields.map((field, index) => (
                  <div className="flex items-start justify-between gap-3" key={field.id}>
                    <div className="flex-1">
                      <RHFSelect disabled={!isEditMode}
                        control={control}
                        name={`projectCategories.${index}.value`}
                        label="หมวดหมู่"
                        fullWidth
                        displayEmpty
                        requiredMark
                      >
                        {categories?.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>
                    {isEditMode && <IconButton onClick={() => removeProjectCategories(index)} disabled={projectCategoriesFields.length === 1} color="error" sx={{ mt: 2.8 }}>
                      <DeleteIcon sx={{ fontSize: 34 }}/>
                    </IconButton>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 pt-4 flex flex-col gap-4">
          <h3 className="font-bold">ลิงก์คลิปวิดีโอ</h3>
          <RHFTextField disabled={!isEditMode}
            control={control}
            name="youtubeURL"
            label="URL Youtube"
            variant="outlined"
            fullWidth
            requiredMark
          />
        </div>

        <div className="my-10 pt-4 flex flex-col gap-4">
          <h3 className="font-bold">ลิงก์ต่างๆ</h3>
          <RHFTextField disabled={!isEditMode}
            control={control}
            name="githubURL"
            label="Github"
            variant="outlined"
            fullWidth
            requiredMark
            startIcon={<LinkIcon fontSize="small" />}
          />
          <RHFTextField disabled={!isEditMode}
            control={control}
            name="documentURL"
            label="Document"
            variant="outlined"
            fullWidth
            requiredMark
            startIcon={<DescriptionIcon fontSize="small" />}
          />
          <RHFTextField disabled={!isEditMode}
            control={control}
            name="presentationURL"
            label="Presentation"
            variant="outlined"
            fullWidth
            requiredMark
            startIcon={<SlideshowIcon fontSize="small" />}
          />
        </div>

        <div className="my-10 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">
              รูปภาพเพิ่มเติม (ลากเพื่อเปลี่ยนลำดับรูป) <span className=" text-h4 text-neutral04 font-normal ml-2">{selectedAssets.length} รูป - สูงสุด 10</span>
            </h3>
            {selectedAssets.length > 0 && (
              <button type="button" onClick={removeAllAssets} className="font-bold text-h5 underline cursor-pointer text-accent04">
                ลบทั้งหมด
              </button>
            )}
          </div>
          
          {selectedAssets.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center gap-2 p-10 bg-white border-2 border-dashed border-gray-300 rounded-lg min-h-[200px]">
              {isEditMode && <Button variant="contained" component="label">
                  <VisuallyHiddenInput type="file" accept="image/*" multiple onChange={handleAssetsChange} />
                  อัปโหลดรูปภาพ
              </Button>}
              {assetsError && (
                <p className="text-h5 text-accent04">กรุณาอัปโหลดรูปภาพเพิ่มเติมอย่างน้อย 1 รูป</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 items-start rounded-lg min-h-[160px]">
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
                  <Image src={URL.createObjectURL(file)} alt="asset" fill className="object-cover pointer-events-none"  draggable={false} />
                  
                  {isEditMode && <IconButton
                    size="small" 
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 24, height: 24, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: 0, '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' } }} 
                    onClick={() => removeAsset(index)}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>}
                </div>
              ))}

              {(selectedAssets.length < 10 && isEditMode) && (
                <div className="aspect-video w-full rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                  <Button variant="contained" component="label" sx={{ height: "40px" }}>
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
             <h3 className="font-bold">Tech Stack</h3>
            {isEditMode && <IconButton 
              onClick={() => appendTechStacks({ value: "" })} 
              sx={{ color: "var(--color-primary03)"}}
              >
                <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
            </IconButton>}
          </div>
          <div className="space-y-4">
            {techStacksFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <span className="text-neutral04 w-6 shrink-0">{index + 1}.</span>
                <div className="flex-1">
                  <RHFTextField disabled={!isEditMode}
                    control={control}
                    name={`techStacks.${index}.value`}
                    variant="outlined"
                    fullWidth
                    requiredMark
                  />
                </div>
                {isEditMode && <IconButton onClick={() => removeTechStacks(index)} disabled={techStacksFields.length === 1} color="error">
                  <DeleteIcon sx={{ fontSize: 34 }} />
                </IconButton>}
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 pt-4">
          <h3 className="font-bold">คณะผู้จัดทำและอาจารย์ที่ปรึกษา</h3>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">คณะผู้จัดทำ</h3>
              {isEditMode && <IconButton 
                onClick={() => appendStudents({ userID: 0 })} 
                sx={{ color: "var(--color-primary03)" }}
                >
                  <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
              </IconButton>}
            </div>
            <div className="space-y-4">
              {studentsFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <RHFSelect disabled={!isEditMode}
                      control={control}
                      name={`students.${index}.userID`}
                      label="รหัสนักศึกษา"
                      fullWidth
                      displayEmpty
                      requiredMark
                    >
                      {students.map((s) => (
                        <MenuItem key={s.id} value={s.user.id}>
                          {s.studentCode}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </div>
                  <div className="flex-1">
                    <RHFSelect disabled={!isEditMode}
                      control={control}
                      name={`students.${index}.userID`}
                      label="ชื่อ-นามสกุล"
                      fullWidth
                      displayEmpty
                      requiredMark
                    >
                      {students.map((s) => (
                        <MenuItem key={s.id} value={s.user.id}>
                          {`${s.user.firstNameTh} ${s.user.lastNameTh}`}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </div>
                  {isEditMode && <IconButton onClick={() => removeStudents(index)} disabled={studentsFields.length === 1} color="error" sx={{ mt: 2.8 }}>
                    <DeleteIcon sx={{ fontSize: 34 }} />
                  </IconButton>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">อาจารย์ที่ปรึกษา</h3>
              {isEditMode && <IconButton 
                onClick={() => appendAdvisors({ userID: 0 })} 
                sx={{ color: "var(--color-primary03)"}}
                >
                  <AddCircleOutlineOutlined sx={{ fontSize: 36 }}/>
              </IconButton>}
            </div>
            <div className="space-y-4">
              {advisorsFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-[2]">
                    <RHFSelect disabled={!isEditMode}
                      control={control}
                      name={`advisors.${index}.userID`}
                      label="อาจารย์ที่ปรึกษา"
                      fullWidth
                      displayEmpty
                      requiredMark
                    >
                      {professors.map((p) => (
                        <MenuItem key={p.id} value={p.user.id}>
                          {`${p.user.firstNameTh} ${p.user.lastNameTh}`}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </div>
                  {isEditMode && <IconButton onClick={() => removeAdvisors(index)} disabled={advisorsFields.length === 1} color="error" sx={{ mt: 2.8 }}>
                    <DeleteIcon sx={{ fontSize: 34 }} />
                  </IconButton>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-row justify-end gap-x-4">
        {!isEditMode ? (
          <Button type="button" variant="contained" color="primary" size="medium" onClick={() => setIsEditMode(true)}>
            แก้ไขข้อมูล
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              size="medium"
              onClick={cancelForm}
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="contained" color="primary" size="medium">
              บันทึกข้อมูล
            </Button>
          </>
        )}
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
      {isCroping && tempThumbFile && (
        <Modal open={isCroping} onClose={handleCropCancel} closeAfterTransition>
          <CropImageCard
            file={tempThumbFile}
            width={512}
            height={512}
            onUploadComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </Modal>
      )}
      </Box>
    </form>
  );
};