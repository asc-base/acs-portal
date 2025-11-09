"use client";
import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, IconButton, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { IProfessor } from "@/core/domain/professor";
import { EducationLevel, Position } from "@/core/domain/master-data";
import { Delete } from "@mui/icons-material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MenuItem from "@mui/material/MenuItem";

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
}

const Schema = z.object({
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อ (ภาษาไทย)"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาไทย)"),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อ (ภาษาอังกฤษ)"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาอังกฤษ)"),
  majorPositionTh: z.number().min(1, "กรุณาเลือกตำแหน่ง (ไทย)"),
  majorPositionEn: z.number().min(1, "กรุณาเลือกตำแหน่ง (อังกฤษ)"),
  phone: z.string().regex(/^[0-9]{9,10}$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  academicPosition: z.number().min(1, "กรุณากรอกตำแหน่งในหลักสูตร"),
  profRoom: z.string().min(1, "กรุณากรอกห้องพักอาจารย์"),
  imageURL: z.string().optional(),
  educations: z.array(
    z.object({
      level: z.number().min(1, "กรุณาเลือกระดับการศึกษา"),
      education: z.string().min(1, "กรุณากรอกชื่อสาขา"),
      university: z.string().min(1, "กรุณากรอกชื่อมหาวิทยาลัย"),
    }),
  ),
  expertFields: z.array(
    z.object({
      field: z.string().min(1, "กรุณากรอกสาขาที่เชี่ยวชาญ"),
    }),
  ),
});
type FormValues = z.infer<typeof Schema>;

const ProfessorFormComponent = ({
  professor,
  academicPosition,
  majorPosition,
  educationLevel,
}: ProfessorFormComponentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      firstNameTh: "",
      lastNameTh: "",
      firstNameEn: "",
      lastNameEn: "",
      majorPositionTh: 1,
      majorPositionEn: 1,
      phone: "",
      email: "",
      academicPosition: 1,
      profRoom: "",
      imageURL: "",
      educations: [],
      expertFields: [],
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray<FormValues>({
    control,
    name: "educations",
  });

  const {
    fields: expertFields,
    append: appendExpert,
    remove: removeExpert,
  } = useFieldArray<FormValues>({
    control,
    name: "expertFields",
  });

  useEffect(() => {
    reset({
      firstNameTh: professor.user.firstNameTh || "",
      lastNameTh: professor.user.lastNameTh || "",
      firstNameEn: professor.user.firstNameEn || "",
      lastNameEn: professor.user.lastNameEn || "",
      majorPositionTh: professor.majorPosition?.id || 1,
      majorPositionEn: professor.majorPosition?.id || 1,
      phone: professor.phone || "",
      email: professor.user.email || "",
      academicPosition: professor.academicPosition?.id || 1,
      profRoom: professor.profRoom || "",
      imageURL: professor.user.imageUrl || "",
      educations:
        professor.educations?.map((e) => ({
          level: e.level?.id ?? "",
          education: e.education || "",
          university: e.university || "",
        })) || [],
      expertFields:
        professor.expertFields?.map((f) => ({ field: f.field })) || [],
    });
  }, [professor, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleCancel = () => {
    reset();
    setSelectedFile(null);
    setIsEdit(false);
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (selectedFile) formData.append("image", selectedFile);

    console.log("Data : ", JSON.stringify(data, null, 2));
    setIsEdit(false);
  };

  const onError = (errors: unknown) => {
    console.error("Validation Errors:", errors);
  };

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit, onError)}>
      <Typography variant="h6" fontWeight="bold">
        ข้อมูลส่วนตัว
      </Typography>

      {/* รูปภาพ */}
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
          {isEdit && (selectedFile || professor.user.imageUrl) && (
            <Image
              alt="Uploaded file"
              src="/uploadimage.png"
              width={40}
              height={40}
              style={{ width: "auto", height: "auto" }}
              className="bg-neutral02 absolute right-2 bottom-0 rounded-full p-2"
              priority
            />
          )}
        </div>

        {/* ชื่อ นามสกุล */}
        <div
          className="flex flex-1 flex-col justify-between"
          style={{ height: "176px" }}
        >
          <div className="flex flex-row gap-x-4">
            <Box sx={{ minWidth: 220 }}>
              <Controller
                name={`majorPositionTh`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="ตำแหน่ง (ภาษาไทย)"
                    value={field.value || 1}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!isEdit}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    <MenuItem value="" disabled>
                      เลือกตำแหน่ง
                    </MenuItem>
                    {majorPosition.map((pos) => (
                      <MenuItem key={pos.id} value={pos.id}>
                        {pos.positionTh}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>
            <Controller
              name="firstNameTh"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="ชื่อ (ภาษาไทย)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="lastNameTh"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="นามสกุล (ภาษาไทย)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="mt-4 flex flex-row gap-x-4">
            <Box sx={{ minWidth: 220 }}>
              <Controller
                name={`majorPositionEn`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="ตำแหน่ง (ภาษาอังกฤษ)"
                    value={field.value || 1}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!isEdit}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    <MenuItem value="" disabled>
                      เลือกตำแหน่ง
                    </MenuItem>
                    {majorPosition.map((pos) => (
                      <MenuItem key={pos.id} value={pos.id}>
                        {pos.positionEn}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>
            <Controller
              name="firstNameEn"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="ชื่อ (ภาษาอังกฤษ)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="lastNameEn"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="นามสกุล (ภาษาอังกฤษ)"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEdit}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* เบอร์โทร / อีเมล */}
      <div className="flex flex-row gap-x-4">
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="เบอร์โทร"
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!isEdit}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="อีเมล"
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!isEdit}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* ตำแหน่งในหลักสูตร / ห้องพัก */}
      <div className="flex flex-row gap-x-4">
        <Controller
          name={`academicPosition`}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="ตำแหน่งในหลักสูตร"
              value={field.value || 1}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={true}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              {academicPosition.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>
                  {pos.positionTh}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="profRoom"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="ห้องพักอาจารย์"
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!isEdit}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* ประวัติการศึกษา */}
      <div className="mb-2 flex items-center justify-between">
        <Typography variant="h6" fontWeight="bold">
          ประวัติการศึกษา
        </Typography>
        <IconButton
          onClick={() =>
            appendEducation({ level: 1, education: "", university: "" })
          }
          disabled={!isEdit}
          sx={{
            border: `1px solid ${isEdit ? "#120554" : "#BDBDBD"}`,
            color: isEdit ? "#120554" : "#BDBDBD",
          }}
        >
          <AddIcon />
        </IconButton>
      </div>

      {educationFields.map((edu, index) => (
        <div key={edu.id} className="mb-3 flex flex-row gap-x-4">
          {/* ระดับการศึกษา */}
          <Box sx={{ minWidth: 220 }}>
            <Controller
              name={`educations.${index}.level`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="ระดับการศึกษา"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={!isEdit}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="" disabled>
                    เลือกระดับการศึกษา
                  </MenuItem>
                  {educationLevel.map((lvl) => (
                    <MenuItem key={lvl.id} value={lvl.id}>
                      {lvl.level}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Controller
            name={`educations.${index}.education`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="วิชาเอก"
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={!isEdit}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name={`educations.${index}.university`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="มหาวิทยาลัย"
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={!isEdit}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          {isEdit && (
            <IconButton
              color="error"
              onClick={() => removeEducation(index)}
              sx={{ alignSelf: "center" }}
            >
              <Delete />
            </IconButton>
          )}
        </div>
      ))}

      {/* สาขาที่เชี่ยวชาญ */}
      <div className="mt-6 mb-4 flex items-center justify-between">
        <Typography variant="h6" fontWeight="bold">
          สาขาที่เชี่ยวชาญ
        </Typography>
        <IconButton
          onClick={() => appendExpert({ field: "" })}
          disabled={!isEdit}
          sx={{
            border: `1px solid ${isEdit ? "#120554" : "#BDBDBD"}`,
            color: isEdit ? "#120554" : "#BDBDBD",
          }}
        >
          <AddIcon />
        </IconButton>
      </div>

      {expertFields.map((f, index) => (
        <div key={f.id} className="mb-3 flex flex-row gap-x-2">
          <Controller
            name={`expertFields.${index}.field`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="สาขาเชี่ยวชาญ"
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={!isEdit}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          {isEdit && (
            <IconButton
              color="error"
              onClick={() => removeExpert(index)}
              sx={{ alignSelf: "center" }}
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
