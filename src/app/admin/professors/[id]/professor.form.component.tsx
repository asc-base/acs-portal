"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button, Typography, Snackbar, Alert, Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { IProfessor, IUpdateProfessor } from "@/core/domain/professor";
import { EducationLevel, Position } from "@/core/domain/master-data";
import { Delete } from "@mui/icons-material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MenuItem from "@mui/material/MenuItem";
import { RHFTextField } from "@/components/form/RHFTextField";
import { CropImageCard } from "@/components/cropimagecard";
import { ProfessorService } from "@/core/service/professor.service";
import { ProfessorRepository } from "@/infra/repositories/professor.repository";
import { RHFSelect } from "@/components/form/RHFSelect";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import IconButton from "@mui/material/IconButton";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { useRouter } from "next/navigation";


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

interface ProfessorFormComponentProps {
  professor: IProfessor;
  academicPositions: Position[];
  educationLevel: EducationLevel[];
  apiBase: string;
}

const Schema = z.object({
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อ (ภาษาไทย)"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาไทย)"),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อ (ภาษาอังกฤษ)"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาอังกฤษ)"),
  phone: z.string().regex(/^[0-9]{9,10}$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  academicPositionID: z.number().min(1, "กรุณากรอกตำแหน่ง"),
  profRoom: z.string().min(1, "กรุณากรอกห้องพักอาจารย์"),
  education: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  expertFields: z.array(
    z.object({
      value: z.string(),
    }),
  ),
});

type FormValues = z.infer<typeof Schema>;

const ProfessorFormComponent = ({
  professor,
  academicPositions,
  apiBase,
}: ProfessorFormComponentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isCroping, setIsCroping] = useState(false);
  const [isError, setIsError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    professor.user?.imageUrl ?? null,
  );
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const router = useRouter();

  const professorService = useMemo(() => {
    const professorRepository = new ProfessorRepository(apiBase);
    return new ProfessorService(professorRepository);
  }, [apiBase]);

  const { control, handleSubmit, reset, formState: { isValid, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      firstNameTh: professor.user.firstNameTh || "",
      lastNameTh: professor.user.lastNameTh || "",
      firstNameEn: professor.user.firstNameEn || "",
      lastNameEn: professor.user.lastNameEn || "",
      phone: professor.phone || "",
      email: professor.user.email || "",
      academicPositionID: professor.academicPosition?.id || 1,
      profRoom: professor.profRoom || "",
      education: [],
      expertFields: [],
    },
  });

  useEffect(() => {
    reset({
      firstNameTh: professor.user.firstNameTh || "",
      lastNameTh: professor.user.lastNameTh || "",
      firstNameEn: professor.user.firstNameEn || "",
      lastNameEn: professor.user.lastNameEn || "",
      phone: professor.phone || "",
      email: professor.user.email || "",
      academicPositionID: professor.academicPosition?.id || 1,
      profRoom: professor.profRoom || "",
      education: professor.educations?.map((e) => ({ value: e })) || [],
      expertFields: professor.expertFields?.map((e) => ({ value: e })) || [],
    });
  }, [professor, reset]);

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: expertFieldsList,
    append: appendExpert,
    remove: removeExpert,
  } = useFieldArray({
    control,
    name: "expertFields",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setIsCroping(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setSelectedFile(croppedFile);
    setPreviewUrl(URL.createObjectURL(croppedFile));
    setIsCroping(false);
  };

  const handleCropCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(professor.user?.imageUrl ?? null);
    setIsEdit(false);
  };

  const handleCancel = () => {
    const hasChanged = isDirty || !!selectedFile;

    if (hasChanged) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          reset();
          setSelectedFile(null);
          setIsEdit(false);
        },
      });
      return;
    }

    setIsEdit(false);
  };

  const onSubmit = async (data: FormValues) => {
    setIsError(false);
    try {
      const updateData: IUpdateProfessor = {
        id: professor.id,
        academicPositionID: data.academicPositionID,
        profRoom: data.profRoom,
        phone: data.phone,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        email: data.email,
        expertFields: data.expertFields.map((e) => e.value).join("/"),
        educations: data.education.map((e) => e.value).join("/"),
      };

      const res = await professorService.updateProfessor(
        professor.id.toString(),
        updateData,
        selectedFile,
      );

      if (!res) {
        setIsError(true);
        return;
      }
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/professors`),
      });
      setIsEdit(false);
    } catch (error) {
      console.error(error);
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
          ไม่สามารถแก้ไขข้อมูลอาจารย์ได้
        </Alert>
      </Snackbar>

      <div>
        <Typography variant="h6" fontWeight="bold">
          ข้อมูลส่วนตัว
        </Typography>
        <div className="mt-6 mb-16 flex flex-row items-center gap-x-8">
          <div className="bg-neutral02 group relative flex h-[182px] w-[268px] items-center justify-center rounded-xl">
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={384}
                  height={192}
                  style={{ objectFit: "cover" }}
                  className="h-full w-full rounded-xl object-cover"
                />
                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="contained"
                    component="label"
                    disabled={!isEdit}
                  >
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="contained" component="label" disabled={!isEdit}>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                อัปโหลดรูปภาพ
              </Button>
            )}
          </div>
          <div className="flex h-[176px] flex-1 flex-col justify-between">
            <div className="flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name="academicPositionID"
                  label="ตำแหน่ง (ภาษาไทย)"
                  variant="outlined"
                  fullWidth
                  required
                  displayEmpty
                  requiredMark
                  disabled={!isEdit}
                  renderValue={(value) => {
                    if (!value) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          ระบุตำแหน่ง (ภาษาไทย)
                        </span>
                      );
                    }
                    const selected = academicPositions.find(
                      (item) => item.id === value,
                    );
                    return selected?.nameTh;
                  }}
                >
                  {academicPositions.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.nameTh}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>

              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="firstNameTh"
                  label="ชื่อ (ภาษาไทย)"
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="ระบุชื่อ (ภาษาไทย)"
                  requiredMark
                  disabled={!isEdit}
                />
              </div>
              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="lastNameTh"
                  label="นามสกุล (ภาษาไทย)"
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="ระบุนามสกุล (ภาษาไทย)"
                  requiredMark
                  disabled={!isEdit}
                />
              </div>
            </div>
            <div className="flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name="academicPositionID"
                  label="ตำแหน่ง (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  required
                  displayEmpty
                  requiredMark
                  disabled={!isEdit}
                  renderValue={(value) => {
                    if (!value) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          ระบุตำแหน่ง (ภาษาอังกฤษ)
                        </span>
                      );
                    }
                    const selected = academicPositions.find(
                      (item) => item.id === value,
                    );
                    return selected?.nameEn;
                  }}
                >
                  {academicPositions.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.nameEn}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>
              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="firstNameEn"
                  label="ชื่อ (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  placeholder="ระบุชื่อ (ภาษาอังกฤษ)"
                  requiredMark
                  disabled={!isEdit}
                />
              </div>
              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="lastNameEn"
                  label="นามสกุล (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  placeholder="ระบุนามสกุล (ภาษาอังกฤษ)"
                  requiredMark
                  disabled={!isEdit}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-y-8">
          <div className="flex flex-row gap-x-4">
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="phone"
                label="เบอร์โทร"
                variant="outlined"
                fullWidth
                required
                placeholder="ระบุเบอร์โทรศัพท์"
                requiredMark
                disabled={!isEdit}
              />
            </div>
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="email"
                label="อีเมล"
                variant="outlined"
                fullWidth
                required
                placeholder="ระบุอีเมล"
                requiredMark
                disabled={!isEdit}
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="profRoom"
                label="ห้องพักอาจารย์"
                variant="outlined"
                fullWidth
                required
                placeholder="ระบุห้องพักอาจารย์"
                requiredMark
                disabled={!isEdit}
              />
            </div>
            <div className="flex-4" />
          </div>
        </div>

        {/* ประวัติการศึกษา */}
        <div className="mt-[12px] mb-[8px] flex items-center justify-between">
          <Typography variant="h6" fontWeight="bold">
            ประวัติการศึกษา
          </Typography>
          {isEdit && (
            <AddCircleOutlineRoundedIcon
              onClick={() => appendEducation({ value: "" })}
              sx={{ color: "#120554", fontSize: 32, cursor: "pointer" }}
            >
              <AddIcon />
            </AddCircleOutlineRoundedIcon>
          )}
        </div>
        <div>
          {educationFields.map((field, index) => (
            <div
              key={field.id}
              className="mt-2 flex flex-row items-center gap-x-4"
            >
              <div className="flex-1">
                <RHFTextField
                  control={control}
                  name={`education.${index}.value`}
                  label="ระดับการศึกษา"
                  fullWidth
                  placeholder="ระบุลำดับการศึกษา เช่น B.Sc. Mathematics King Mongkut's University of Technology Thonburi"
                  disabled={!isEdit}
                />
              </div>
              {isEdit && (
                <IconButton
                  onClick={() => removeEducation(index)}
                  sx={{ color: "#d32f2f" }}
                >
                  <Delete />
                </IconButton>
              )}
            </div>
          ))}
        </div>

        {/* สาขาที่เชี่ยวชาญ */}
        <div className="mt-5">
          <div className="mb-[8px] flex items-center justify-between">
            <Typography variant="h6" fontWeight="bold">
              สาขาที่เชี่ยวชาญ
            </Typography>
            {isEdit && (
              <AddCircleOutlineRoundedIcon
                sx={{ color: "#120554", fontSize: 32, cursor: "pointer" }}
                onClick={() => appendExpert({ value: "" })}
              >
                <AddIcon />
              </AddCircleOutlineRoundedIcon>
            )}
          </div>
          {expertFieldsList.map((field, index) => (
            <div
              key={field.id}
              className="mt-2 flex flex-row items-center gap-x-4"
            >
              <div className="flex-1">
                <RHFTextField
                  control={control}
                  name={`expertFields.${index}.value`}
                  label="สาขาที่เชี่ยวชาญ"
                  fullWidth
                  placeholder="ระบุสาขาที่เชี่ยวชาญ"
                  disabled={!isEdit}
                />
              </div>
              {isEdit && (
                <IconButton
                  onClick={() => removeExpert(index)}
                  sx={{ color: "#d32f2f" }}
                >
                  <Delete />
                </IconButton>
              )}
            </div>
          ))}
        </div>
      </div>

      {!isEdit ? (
        <div className="mt-8 flex justify-end gap-x-4">
          <Button
            onClick={() => setIsEdit(true)}
            variant="contained"
            size="large"
          >
            แก้ไขข้อมูล
          </Button>
        </div>
      ) : (
        <div className="mt-8 flex justify-end gap-x-4">
          <Button onClick={handleCancel} variant="outlined" size="large">
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" size="large">
            บันทึกข้อมูล
          </Button>
        </div>
      )}

      {isCroping && selectedFile && (
        <Modal open={isCroping} onClose={handleCropCancel} closeAfterTransition>
          <CropImageCard
            file={selectedFile}
            width={512}
            height={512}
            onUploadComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </Modal>
      )}

      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          type={confirmModal.type}
          onClose={confirmModal.onClose}
          onConfirm={confirmModal.onConfirm}
        />
      )}
    </form>
  );
};

export default ProfessorFormComponent;
