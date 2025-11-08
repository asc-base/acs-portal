"use client";
import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { IProfessor } from "@/core/domain/professor";
import { IUpdateExpertField } from "@/core/domain/expert-field";
import { IUpdateEducation } from "@/core/domain/education";
import { EducationLevel, Position } from "@/core/domain/master-data";
import { Delete } from "@mui/icons-material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 🔹 ซ่อน input file
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
  majorPosition: Position[];
  educationLevel: EducationLevel[];
}

const Schema = z.object({
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อ (ภาษาไทย)"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาไทย)"),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อ (ภาษาอังกฤษ)"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาอังกฤษ)"),
  majorPositionTh: z.string().min(1, "กรุณาเลือกตำแหน่ง (ไทย)"),
  majorPositionEn: z.string().min(1, "กรุณาเลือกตำแหน่ง (อังกฤษ)"),
  phone: z.string().regex(/^[0-9]{9,10}$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  academicPosition: z.string().optional(),
  profRoom: z.string().optional(),
  imageURL: z.string().optional(),
  expertFields: z.array(z.string().min(1, "สาขาที่เชี่ยวชาญต้องไม่ว่าง")),
  educations: z.array(
    z.object({
      level: z.string().min(1, "กรุณาเลือกระดับการศึกษา"),
      education: z.string().min(1, "กรุณากรอกชื่อสาขา"),
      university: z.string().min(1, "กรุณากรอกชื่อมหาวิทยาลัย"),
    }),
  ),
});

type FormValues = z.infer<typeof Schema>;

const ProfessorFormComponent = ({
  professor,
  majorPosition,
  educationLevel,
}: ProfessorFormComponentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [education, setEducation] = useState<IUpdateEducation[]>([]);
  const [expertField, setExpertField] = useState<IUpdateExpertField[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(Schema),
  });

  useEffect(() => {
    reset({
      firstNameTh: professor.user.firstNameTh || "",
      lastNameTh: professor.user.lastNameTh || "",
      firstNameEn: professor.user.firstNameEn || "",
      lastNameEn: professor.user.lastNameEn || "",
      majorPositionTh: professor.majorPosition?.positionTh || "",
      majorPositionEn: professor.majorPosition?.positionEn || "",
      phone: professor.phone || "",
      email: professor.user.email || "",
      academicPosition: professor.academicPosition?.positionTh || "",
      profRoom: professor.profRoom || "",
      imageURL: professor.user.imageUrl || "",
      expertFields: professor.expertFields?.map((f) => f.field) || [],
      educations:
        professor.educations?.map((e) => ({
          level: e.level?.level || "",
          education: e.education || "",
          university: e.university || "",
        })) || [],
    });

    setEducation(professor.educations || []);
    setExpertField(professor.expertFields || []);
  }, [professor, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        education: "",
        university: "",
        level: educationLevel[0],
      },
    ]);
  };

  const handleAddExpertField = () => {
    setExpertField([...expertField, { field: "" }]);
  };

  const handleCancel = () => {
    reset();
    setEducation(professor.educations);
    setExpertField(professor.expertFields);
    setSelectedFile(null);
    setIsEdit(false);
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (selectedFile) formData.append("image", selectedFile);

    console.log(JSON.stringify(data, null, 2));
    setIsEdit(false);
  };

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" fontWeight="bold">
        ข้อมูลส่วนตัว
      </Typography>

      {/*รูปภาพ*/}
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
            disabled={!isEdit}
          >
            {selectedFile ? (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                width={300}
                height={300}
                style={{ objectFit: "cover" }}
                className="h-full w-full rounded-full"
              />
            ) : professor.user.imageUrl ? (
              <Image
                src={professor.user.imageUrl}
                alt="Profile"
                width={300}
                height={300}
                style={{ objectFit: "cover" }}
                className="h-full w-full rounded-full"
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
          {isEdit && (
            <div className="absolute right-2 bottom-0 rounded-full bg-white p-1 shadow">
              <Image
                src="/uploadimage.png"
                alt="Edit"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>

        {/*ชื่อ นามสกุล*/}
        <div
          className="flex flex-1 flex-col justify-between"
          style={{ height: "176px" }}
        >
          <div className="flex flex-row gap-x-4">
            <Controller
              name="majorPositionTh"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="ตำแหน่ง (ภาษาไทย)"
                  fullWidth
                  SelectProps={{ native: true }}
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  disabled={!isEdit}
                >
                  <option value="" disabled></option>
                  {majorPosition.map((pos) => (
                    <option key={pos.id} value={pos.positionTh}>
                      {pos.positionTh}
                    </option>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="firstNameTh"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อ (ภาษาไทย)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                />
              )}
            />
            <Controller
              name="lastNameTh"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="นามสกุล (ภาษาไทย)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                />
              )}
            />
          </div>

          <div className="mt-4 flex flex-row gap-x-4">
            <Controller
              name="majorPositionEn"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="ตำแหน่ง (ภาษาอังกฤษ)"
                  fullWidth
                  SelectProps={{ native: true }}
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  disabled={!isEdit}
                >
                  <option value="" disabled></option>
                  {majorPosition.map((pos) => (
                    <option key={pos.id} value={pos.positionEn}>
                      {pos.positionEn}
                    </option>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="firstNameEn"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อ (ภาษาอังกฤษ)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                />
              )}
            />
            <Controller
              name="lastNameEn"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="นามสกุล (ภาษาอังกฤษ)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/*เบอร์โทร / อีเมล / ตำแหน่งในหลักสูตร / ห้องพัก*/}
      <div className="flex flex-row gap-x-4">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="เบอร์โทร"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!isEdit}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="อีเมล"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!isEdit}
            />
          )}
        />
      </div>

      <div className="flex flex-row gap-x-4">
        <Controller
          name="academicPosition"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="ตำแหน่งในหลักสูตร"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={true}
            />
          )}
        />
        <Controller
          name="profRoom"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="ห้องพักอาจารย์"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!isEdit}
            />
          )}
        />
      </div>

      {/*ประวัติการศึกษา*/}
      <div className="mb-2 flex items-center justify-between">
        <Typography variant="h6" fontWeight="bold">
          ประวัติการศึกษา
        </Typography>
        <IconButton
          onClick={handleAddEducation}
          disabled={!isEdit}
          sx={{
            border: `1px solid ${isEdit ? "#120554" : "#BDBDBD"}`,
            color: isEdit ? "#120554" : "#BDBDBD",
          }}
        >
          <AddIcon />
        </IconButton>
      </div>

      {education.map((edu, i) => (
        <div key={i} className="mb-3 flex flex-row gap-x-4">
          <TextField
            select
            label="ระดับการศึกษา"
            fullWidth
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            value={edu.level?.level || ""}
            onChange={(e) => {
              const updated = [...education];
              updated[i].level = {
                id: 0,
                level: e.target.value,
              } as EducationLevel;
              setEducation(updated);
            }}
            disabled={!isEdit}
          >
            <option value="" disabled></option>
            {educationLevel.map((lvl) => (
              <option key={lvl.id} value={lvl.level}>
                {lvl.level}
              </option>
            ))}
          </TextField>
          <TextField
            label="วิชาเอก"
            InputLabelProps={{ shrink: true }}
            value={edu.education}
            onChange={(e) => {
              const updated = [...education];
              updated[i].education = e.target.value;
              setEducation(updated);
            }}
            fullWidth
            disabled={!isEdit}
          />
          <TextField
            label="มหาวิทยาลัย"
            InputLabelProps={{ shrink: true }}
            value={edu.university}
            onChange={(e) => {
              const updated = [...education];
              updated[i].university = e.target.value;
              setEducation(updated);
            }}
            fullWidth
            disabled={!isEdit}
          />
          {isEdit && (
            <IconButton
              color="error"
              onClick={() => {
                const updated = [...education];
                updated.splice(i, 1);
                setEducation(updated);
              }}
              sx={{
                alignSelf: "center",
              }}
            >
              <Delete />
            </IconButton>
          )}
        </div>
      ))}

      {/*สาขาที่เชี่ยวชาญ*/}
      <div className="mt-6 mb-4 flex items-center justify-between">
        <Typography variant="h6" fontWeight="bold">
          สาขาที่เชี่ยวชาญ
        </Typography>
        <IconButton
          onClick={handleAddExpertField}
          disabled={!isEdit}
          sx={{
            border: `1px solid ${isEdit ? "#120554" : "#BDBDBD"}`,
            color: isEdit ? "#120554" : "#BDBDBD",
          }}
        >
          <AddIcon />
        </IconButton>
      </div>

      {expertField.map((field, i) => (
        <div key={i} className="mb-3 flex flex-row">
          <TextField
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={field.field}
            onChange={(e) => {
              const updated = [...expertField];
              updated[i].field = e.target.value;
              setExpertField(updated);
            }}
            disabled={!isEdit}
          />
          {isEdit && (
            <IconButton
              color="error"
              onClick={() => {
                const updated = [...expertField];
                updated.splice(i, 1);
                setExpertField(updated);
              }}
              sx={{
                alignSelf: "center",
              }}
            >
              <Delete />
            </IconButton>
          )}
        </div>
      ))}

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
    </form>
  );
};

export default ProfessorFormComponent;
