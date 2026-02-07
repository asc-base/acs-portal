"use client";
import React, { useState, useMemo } from "react";
import { Button, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { IProfessor } from "@/core/domain/professor";
import { EducationLevel, Position } from "@/core/domain/master-data";
import { Delete } from "@mui/icons-material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MenuItem from "@mui/material/MenuItem";
import { ProfessorService } from "@/core/service/professor.service";
import { ProfessorRepository } from "@/infra/repositories/professor.repository";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
// import {
//   ConfirmModal,
//   ConfirmModalProps,
// } from "@/components/modal/confirmModal";
import { IUpdateExpertField } from "@/core/domain/expert-field";

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
  academicPosition: Position[];
  majorPosition: Position[];
  educationLevel: EducationLevel[];
  apiBase: string;
}

const Schema = z.object({
  academicPositionId: z.number().min(1, "กรุณากรอกตำแหน่ง"),
  education: z
    .array(
      z.object({
        id: z.number().optional(),
        levelId: z.number().min(1, "กรุณากรอกระดับการศึกษา"),
        education: z.string().min(1, "กรุณากรอกวิชาเอก"),
        university: z.string().min(1, "กรุณากรอกมหาวิทยาลัย"),
      }),
    )
    .optional(),
  email: z.email("อีเมลไม่ถูกต้อง"),
  expertFields: z
    .array(
      z.object({
        id: z.number().optional(),
        field: z.string().min(1, "กรุณากรอกสาขาที่เชี่ยวชาญ"),
      }),
    )
    .optional(),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อภาษาอังกฤษ"),
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุลภาษาอังกฤษ"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุลภาษาไทย"),
  majorPositionId: z.number().min(1, "กรุณากรอกตำแหน่ง"),
  phone: z
    .string()
    .min(1, "กรุณากรอกเบอร์โทร")
    .max(10, "เบอร์โทรต้องไม่เกิน 10 ตัวอักษร")
    .regex(/^\d+$/, "เบอร์โทรต้องเป็นตัวเลขเท่านั้น"),
  profRoom: z.string().min(1, "กรุณากรอกชื่อห้อง"),
});
type FormValues = z.infer<typeof Schema>;

const ProfessorFormComponent = ({
  professor,
  academicPosition,
  majorPosition,
  educationLevel,
  apiBase,
}: ProfessorFormComponentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isError, setIsError] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      academicPositionId: professor.academicPosition?.id ?? 0,
      majorPositionId: professor.majorPosition?.id ?? 0,

      firstNameTh: professor.user.firstNameTh ?? "",
      lastNameTh: professor.user.lastNameTh ?? "",
      firstNameEn: professor.user.firstNameEn ?? "",
      lastNameEn: professor.user.lastNameEn ?? "",

      phone: professor.phone ?? "",
      email: professor.user.email ?? "",
      profRoom: professor.profRoom ?? "",

      education: professor.educations?.map((e) => ({
        id: e.id,
        levelId: e.level?.id ?? 0,
        education: e.education ?? "",
        university: e.university ?? "",
      })) ?? [
        {
          id: undefined,
          levelId: 0,
          education: "",
          university: "",
        },
      ],

      expertFields: professor.expertFields?.map((f) => ({
        id: f.id,
        field: f.field ?? "",
      })) ?? [{ id: undefined, field: "" }],
    },
  });

  const previewSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : professor.user.imageUrl;

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray<FormValues>({
    control,
    name: "education",
  });

  const {
    fields: expertFields,
    append: appendExpert,
    remove: removeExpert,
  } = useFieldArray<FormValues>({
    control,
    name: "expertFields",
  });

  const professorService = useMemo(() => {
    const professorRepository = new ProfessorRepository(apiBase);
    return new ProfessorService(professorRepository);
  }, [apiBase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleCancel = () => {
    reset();
    setSelectedFile(null);
    setIsEdit(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsError(false);

    try {
      const originalEducations = professor.educations ?? [];
      const originalExperts = professor.expertFields ?? [];

      // -----------------------
      // EDUCATION
      // -----------------------
      const formEducations = data.education ?? [];

      const existingEducationIds = new Set(originalEducations.map((e) => e.id));

      const newEducation = formEducations
        .filter((e) => !e.id)
        .map((e) => ({
          levelId: e.levelId,
          education: e.education,
          university: e.university,
        }));

      const updatedEducation = formEducations.filter(
        (e): e is typeof e & { id: number } =>
          !!e.id && existingEducationIds.has(e.id),
      );

      const deleteEducationIds = originalEducations
        .filter((e) => !formEducations.some((f) => f.id === e.id))
        .map((e) => e.id);

      // -----------------------
      // EXPERT FIELDS
      // -----------------------
      const formExperts = data.expertFields ?? [];

      const newExpertFields = formExperts
        .filter((f) => !f.id && f.field.trim() !== "")
        .map((f) => f.field);

      const updatedExpertFields: IUpdateExpertField[] = formExperts
        .filter((f) => f.id !== undefined)
        .map((f) => ({
          id: f.id!,
          field: f.field,
        }));

      const deleteExpertFieldIds = originalExperts
        .filter((f) => !formExperts.some((ff) => ff.id === f.id))
        .map((f) => f.id);

      // -----------------------
      // FINAL PAYLOAD
      // -----------------------
      const payload = {
        academicPositionId: data.academicPositionId,
        majorPositionId: data.majorPositionId,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        email: data.email,
        phone: data.phone,
        profRoom: data.profRoom,

        newEducation,
        updatedEducation,
        deleteEducationIds,

        newExpertFields,
        updatedExpertFields,
        deleteExpertFieldIds,
      };

      const res = await professorService.updateProfessor(
        payload,
        professor.id.toString(),
        selectedFile,
      );

      if (res) {
        setIsEdit(false);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  return (
    <form
      className="w-full space-y-4 px-8 py-8"
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <Typography variant="h6" fontWeight="bold">
        ข้อมูลส่วนตัว
      </Typography>

      <div className="mt-6 mb-16 flex flex-row items-center gap-x-8">
        <div className="bg-neutral02 border-neutral04 relative flex h-[182px] w-[268px] flex-col items-center justify-center overflow-hidden rounded-lg">
          {previewSrc ? (
            <div className="group relative h-full w-full">
              <Image src={previewSrc} alt="Preview" width={268} height={182} />
              {isEdit && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button variant="contained" component="label">
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              )}
            </div>
          ) : (
            isEdit && (
              <Button variant="contained" component="label" size="large">
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

        <div className="flex w-full flex-col">
          <div className="grid w-full grid-cols-[220px_1fr_1fr] gap-x-4">
            <RHFSelect
              name="majorPositionId"
              control={control}
              label="ระบุตำแหน่ง"
              disabled={!isEdit}
              requiredMark
            >
              {majorPosition.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>
                  {pos.positionTh}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="firstNameTh"
              control={control}
              label="ชื่อ (ภาษาไทย)"
              fullWidth
              disabled={!isEdit}
              requiredMark
            />

            <RHFTextField
              name="lastNameTh"
              control={control}
              label="นามสกุล (ภาษาไทย)"
              fullWidth
              disabled={!isEdit}
              requiredMark
            />
          </div>

          <div className="mt-4 grid w-full grid-cols-[220px_1fr_1fr] gap-x-4">
            <RHFSelect
              name="majorPositionId"
              control={control}
              label="ระบุตำแหน่ง"
              disabled={!isEdit}
            >
              {majorPosition.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>
                  {pos.positionEn}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="firstNameEn"
              control={control}
              label="ชื่อ (ภาษาอังกฤษ)"
              fullWidth
              disabled={!isEdit}
              requiredMark
            />

            <RHFTextField
              name="lastNameEn"
              control={control}
              label="นามสกุล (ภาษาอังกฤษ)"
              fullWidth
              disabled={!isEdit}
              requiredMark
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <RHFTextField
          name="phone"
          control={control}
          label="เบอร์โทร"
          fullWidth
          disabled={!isEdit}
          requiredMark
        />
        <RHFTextField
          name="email"
          control={control}
          label="อีเมล"
          fullWidth
          disabled={!isEdit}
          requiredMark
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <RHFSelect
          name="academicPositionId"
          control={control}
          label="ตำแหน่งในหลักสูตร"
          disabled
        >
          {academicPosition.map((pos) => (
            <MenuItem key={pos.id} value={pos.id}>
              {pos.positionTh}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFTextField
          name="profRoom"
          control={control}
          label="ห้องพักอาจารย์"
          fullWidth
          disabled={!isEdit}
          requiredMark
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Typography variant="h6" fontWeight="bold">
          ประวัติการศึกษา
        </Typography>
        <IconButton
          onClick={() =>
            appendEducation({ levelId: 0, education: "", university: "" })
          }
          disabled={!isEdit}
        >
          <AddIcon />
        </IconButton>
      </div>

      {educationFields.map((edu, index) => (
        <div
          key={edu.id}
          className="grid w-full grid-cols-[220px_1fr_1fr_40px] items-center gap-x-4"
        >
          <RHFSelect
            name={`education.${index}.levelId`}
            control={control}
            label="ระดับการศึกษา"
            disabled={!isEdit}
          >
            {educationLevel.map((lvl) => (
              <MenuItem key={lvl.id} value={lvl.id}>
                {lvl.level}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField
            name={`education.${index}.education`}
            control={control}
            label="วิชาเอก"
            fullWidth
            disabled={!isEdit}
            requiredMark
          />

          <RHFTextField
            name={`education.${index}.university`}
            control={control}
            label="มหาวิทยาลัย"
            fullWidth
            disabled={!isEdit}
            requiredMark
          />
          {isEdit && (
            <IconButton color="error" onClick={() => removeEducation(index)}>
              <Delete />
            </IconButton>
          )}
        </div>
      ))}

      <div className="mt-6 flex items-center justify-between">
        <Typography variant="h6" fontWeight="bold">
          สาขาที่เชี่ยวชาญ
        </Typography>
        <IconButton
          onClick={() => appendExpert({ field: "" })}
          disabled={!isEdit}
        >
          <AddIcon />
        </IconButton>
      </div>

      {expertFields.map((f, index) => (
        <div
          key={f.id}
          className="grid w-full grid-cols-[1fr_40px] items-center gap-x-2"
        >
          <RHFTextField
            name={`expertFields.${index}.field`}
            control={control}
            label="สาขาเชี่ยวชาญ"
            fullWidth
            disabled={!isEdit}
            requiredMark
          />

          {isEdit && (
            <IconButton color="error" onClick={() => removeExpert(index)}>
              <Delete />
            </IconButton>
          )}
        </div>
      ))}

      <div className="mt-8 flex justify-end gap-x-4">
        {isEdit ? (
          <>
            <Button variant="outlined" onClick={handleCancel}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="contained">
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
  );
};

export default ProfessorFormComponent;
