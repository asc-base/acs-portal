"use client";
import React, { FC } from "react";
import { Autocomplete, Button, IconButton, Modal, Box, Snackbar, Dialog, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ICourse } from "@/features/courses/domain/course";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { MasterData } from "@/features/master-data/domain/master-data";
import { IStudent } from "@/features/students/domain/student";
import { IProfessor } from "@/features/professors/domain/professor";
import type { IProject } from "@/features/projects/domain/project";
import { useUpdateProjectController } from "@/features/projects/hooks/use-update-project-controller";

interface FormUpdateProjectProps {
  projectId: string;
  initialProject: IProject;
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

export const FormUpdateProject: FC<FormUpdateProjectProps> = ({ projectId, initialProject, initialCourses, initialMasterData, initialStudents, initialProfessors }) => {
  const courses = initialCourses;
  const students = initialStudents;
  const professors = initialProfessors;
  const types = initialMasterData.projectTypes;
  const categories = initialMasterData.categories;
  const fields = initialMasterData.fields;
  const techStackNames = initialMasterData.techStacks.map(({ name }) => name);
  const {
    selectedFile, imageError, assetsError, isCroping, galleryItems,
    draggedItemIndex, dragOverItemIndex, tempThumbFile, errorMsg, isError,
    setIsError, confirmModal, isEditMode, setIsEditMode, previewImageUrl,
    setPreviewImageUrl, control, handleSubmit, projectCoursesFields,
    appendProjectCourses, removeProjectCourses, projectTypesFields,
    appendProjectTypes, removeProjectTypes, projectCategoriesFields,
    appendProjectCategories, removeProjectCategories, techStacksFields,
    appendTechStacks, removeTechStacks, studentsFields, appendStudents,
    removeStudents, advisorsFields, appendAdvisors, removeAdvisors,
    coAdvisorsFields, appendCoAdvisors, removeCoAdvisors,
    handleFileChange, handleCropComplete, handleCropCancel, handleAssetsChange,
    removeAsset, removeAllAssets, moveAsset, handleDragStart, handleDragEnter,
    handleDragEnd, handleDrop, cancelForm, onSubmit,
  } = useUpdateProjectController(projectId, initialProject);

  return (
    <form className="space-y-4 p-8 relative" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ "& .MuiInputBase-root.Mui-disabled": { backgroundColor: "#f3f4f6" } }}>
        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={isError} autoHideDuration={4000} onClose={() => setIsError(false)}>
          <Alert severity="error" onClose={() => setIsError(false)} sx={{ width: "100%" }}>{errorMsg}</Alert>
        </Snackbar>

        <Dialog open={!!previewImageUrl} onClose={() => setPreviewImageUrl(null)} maxWidth="lg" fullWidth PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none' } }}>
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <IconButton
              onClick={() => setPreviewImageUrl(null)}
              sx={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' }, zIndex: 10 }}
            >
              <CloseIcon />
            </IconButton>
            {previewImageUrl && (
              <Image src={previewImageUrl} alt="Preview" fill className="object-contain" />
            )}
          </div>
        </Dialog>

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
                    <Image src={initialProject.thumbnailURL} alt="Preview" fill className="absolute inset-0 z-0 object-cover" />
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
                  name="detail"
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
                        <DeleteIcon sx={{ fontSize: 34 }} />
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
                        <DeleteIcon sx={{ fontSize: 34 }} />
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
                        <DeleteIcon sx={{ fontSize: 34 }} />
                      </IconButton>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="my-8">
            <Controller
              control={control}
              name="projectFields"
              render={({ field }) => (
                <Autocomplete
                  multiple
                  disabled={!isEditMode}
                  options={fields}
                  value={field.value.flatMap(({ value }) => fields.filter((option) => option.id === value))}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_, values) => field.onChange(values.map(({ id }) => ({ value: id })))}
                  renderInput={(params) => <TextField {...params} label="สาขาที่เกี่ยวข้อง" />}
                />
              )}
            />
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
            <RHFTextField disabled={!isEditMode}
              control={control}
              name="figmaURL"
              label="Figma (ไม่บังคับ)"
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="my-10 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">
                รูปภาพเพิ่มเติม (ลากหรือใช้ปุ่มเลื่อนลำดับ) <span className="text-h4 text-neutral04 font-normal ml-2">{galleryItems.length} รูป - สูงสุด 10</span>
              </h3>
              {isEditMode && galleryItems.length > 0 && (
                <button type="button" onClick={removeAllAssets} className="font-bold text-h5 underline cursor-pointer text-accent04">
                  ลบทั้งหมด
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-start rounded-lg min-h-[160px]">
              {galleryItems.map((item, index) => {
                const url = item.kind === "existing" ? item.imageUrl : URL.createObjectURL(item.file);
                return (
                  <div
                    key={item.kind === "existing" ? `image-${item.imageID}` : `${item.file.name}-${index}`}
                    draggable={isEditMode}
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDragEnd={handleDragEnd}
                    onDrop={() => handleDrop(index)}
                    onClick={() => setPreviewImageUrl(url)}
                    className={`relative aspect-video w-full rounded-md overflow-hidden cursor-pointer active:cursor-grabbing transition-all border-2 ${dragOverItemIndex === index ? "border-[var(--color-primary02)] border-dashed scale-105" : "border-gray-200 border-solid"} ${draggedItemIndex === index ? "opacity-40" : "opacity-100"}`}
                  >
                    <Image src={url} alt={`gallery-${index + 1}`} fill className="object-cover pointer-events-none" draggable={false} />
                    {isEditMode && (
                      <div className="absolute top-1 right-1 flex gap-1">
                        <IconButton type="button" aria-label={`เลื่อนรูปที่ ${index + 1} ขึ้น`} size="small" disabled={index === 0} onClick={(event) => { event.stopPropagation(); moveAsset(index, -1); }} sx={{ backgroundColor: "rgba(0,0,0,.6)", color: "white" }}>
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton type="button" aria-label={`เลื่อนรูปที่ ${index + 1} ลง`} size="small" disabled={index === galleryItems.length - 1} onClick={(event) => { event.stopPropagation(); moveAsset(index, 1); }} sx={{ backgroundColor: "rgba(0,0,0,.6)", color: "white" }}>
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton type="button" aria-label={`ลบรูปที่ ${index + 1}`} size="small" onClick={(event) => { event.stopPropagation(); removeAsset(index); }} sx={{ backgroundColor: "rgba(0,0,0,.6)", color: "white" }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </div>
                    )}
                  </div>
                );
              })}
              {isEditMode && galleryItems.length < 10 && (
                <div className="aspect-video w-full rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                  <Button variant="contained" component="label" sx={{ height: "40px" }}>
                    <VisuallyHiddenInput type="file" accept="image/*" multiple onChange={handleAssetsChange} />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              )}
            </div>
            {assetsError && <p className="text-h5 text-accent04">กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป</p>}
          </div>

          <div className="my-10 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Tech Stack</h3>
              {isEditMode && <IconButton
                onClick={() => appendTechStacks({ value: "" })}
                sx={{ color: "var(--color-primary03)" }}
              >
                <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
              </IconButton>}
            </div>
            <div className="space-y-4">
              {techStacksFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <span className="text-neutral04 w-6 shrink-0">{index + 1}.</span>
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name={`techStacks.${index}.value`}
                      render={({ field }) => (
                        <Autocomplete
                          freeSolo
                          disabled={!isEditMode}
                          options={techStackNames}
                          value={field.value}
                          inputValue={field.value}
                          onChange={(_, value) => field.onChange(typeof value === "string" ? value : "")}
                          onInputChange={(_, value) => field.onChange(value)}
                          renderInput={(params) => <TextField {...params} label="Tech Stack" required />}
                        />
                      )}
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
                {isEditMode && <IconButton type="button"
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
                          <MenuItem key={s.id} value={s.id}>
                            {s.student.studentCode}
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
                          <MenuItem key={s.id} value={s.id}>
                            {`${s.firstNameTh} ${s.lastNameTh}`}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>
                    <div className="flex-1">
                      <RHFTextField disabled={!isEditMode} control={control} name={`students.${index}.position`} label="หน้าที่ (ไม่บังคับ)" fullWidth />
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
                {isEditMode && <IconButton type="button"
                  onClick={() => appendAdvisors({ userID: 0 })}
                  sx={{ color: "var(--color-primary03)" }}
                >
                  <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
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
                          <MenuItem key={p.id} value={p.id}>
                            {`${p.firstNameTh} ${p.lastNameTh}`}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </div>
                    <div className="flex-1">
                      <RHFTextField disabled={!isEditMode} control={control} name={`advisors.${index}.position`} label="หน้าที่ (ไม่บังคับ)" fullWidth />
                    </div>
                    {isEditMode && <IconButton onClick={() => removeAdvisors(index)} disabled={advisorsFields.length === 1} color="error" sx={{ mt: 2.8 }}>
                      <DeleteIcon sx={{ fontSize: 34 }} />
                    </IconButton>}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">อาจารย์ที่ปรึกษาร่วม</h3>
                {isEditMode && <IconButton type="button" onClick={() => appendCoAdvisors({ userID: 0, position: "" })} sx={{ color: "var(--color-primary03)" }}>
                  <AddCircleOutlineOutlined sx={{ fontSize: 36 }} />
                </IconButton>}
              </div>
              <div className="space-y-4">
                {coAdvisorsFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <RHFSelect disabled={!isEditMode} control={control} name={`coAdvisors.${index}.userID`} label="อาจารย์ที่ปรึกษาร่วม" fullWidth displayEmpty>
                      {professors.map((professor) => <MenuItem key={professor.id} value={professor.id}>{`${professor.firstNameTh} ${professor.lastNameTh}`}</MenuItem>)}
                    </RHFSelect>
                    <RHFTextField disabled={!isEditMode} control={control} name={`coAdvisors.${index}.position`} label="หน้าที่ (ไม่บังคับ)" fullWidth />
                    {isEditMode && <IconButton type="button" onClick={() => removeCoAdvisors(index)} color="error"><DeleteIcon sx={{ fontSize: 34 }} /></IconButton>}
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
