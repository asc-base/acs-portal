"use client";
import React, { FC } from "react";
import { Button, TextField, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MasterDataService } from "@/core/service/master-data.service";
import { MasterDataRepository } from "@/infra/repositories/master-data.repository";
import { Position, EducationLevel } from "@/core/domain/master-data";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import MenuItem from "@mui/material/MenuItem";
import { useFieldArray } from "react-hook-form";
import { Controller } from "react-hook-form";

interface FormProfessorsProps {
  apiBase: string;
}

const Schema = z.object({
  academicPositionId: z
    .number()
    .nullable()
    .refine((v) => v !== null, {
      message: "กรุณากรอกตำแหน่ง",
    }),
  education: z
    .array(
      z.object({
        level: z
          .number()
          .nullable()
          .refine((v) => v !== null, {
            message: "กรุณากรอกระดับการศึกษา",
          }),
        major: z.string().min(1, "กรุณากรอกชื่อวิชาเอก"),
        university: z.string().min(1, "กรุณากรอกชื่อมหาวิทยาลัย"),
      }),
    )
    .min(1, "กรุณาเพิ่มประวัติการศึกษา"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  expertFields: z.array(z.string()).min(1, "กรุณาเลือกสาขาความเชี่ยวชาญ"),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อภาษาอังกฤษ"),
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุลภาษาอังกฤษ"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุลภาษาไทย"),
  majorPositionId: z
    .number()
    .nullable()
    .refine((v) => v !== null, {
      message: "กรุณากรอกตำแหน่ง",
    }),
  phone: z
    .string()
    .min(9, "กรุณากรอกเบอร์โทร")
    .regex(/^[0-9]+$/, "เบอร์โทรต้องเป็นตัวเลขเท่านั้น"),
  profRoom: z.string().min(1, "กรุณากรอกชื่อห้อง"),
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

export const FormProfesssors: FC<FormProfessorsProps> = ({ apiBase }) => {
  const [majorPositions, setMajorPositions] = useState<Position[]>([]);
  const [acadamicPositions, setAcadamicPositions] = useState<Position[]>([]);
  const [levelId, setLevelId] = useState<EducationLevel[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const masterDataService = useMemo(() => {
    const masterdataRepository = new MasterDataRepository(apiBase);
    return new MasterDataService(masterdataRepository);
  }, [apiBase]);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      academicPositionId: null,
      education: [
        {
          level: null,
          major: "",
          university: "",
        },
      ],
      email: "",
      expertFields: [""],
      firstNameEn: "",
      firstNameTh: "",
      lastNameEn: "",
      lastNameTh: "",
      majorPositionId: null,
      phone: "",
      profRoom: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { fields: educationFields, append: appendEducation } = useFieldArray({
    control,
    name: "education",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    } else {
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsError(false);
    try {
      //   const reps = await classBookService.createClassBook(data, selectedFile!);
      //   if (!reps) {
      //     setIsError(true);
      //     return;
      //   }
      //   router.push(
      //     `/admin/students?page=1&pageSize=10&classBookId=${reps.data.id}&search=&sortBy=studentId&sortOrder=desc`,
      //   );
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [majorPositionsRes, acadamicPositionsRes, levelRes] =
        await Promise.all([
          masterDataService.getMajorpositions(),
          masterDataService.getAcademicPosition(),
          masterDataService.getEducationLevel(),
        ]);

      setMajorPositions(majorPositionsRes);
      setAcadamicPositions(acadamicPositionsRes);
      setLevelId(levelRes);
    };
    fetchData();
  }, [apiBase, masterDataService]);

  return (
    <form className="space-y-4 p-8">
      <div>
        <Typography variant="h6" fontWeight="bold">
          ข้อมูลส่วนตัว
        </Typography>
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
                "&:hover": {
                  backgroundColor: "#E2E2E2",
                },
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
            {selectedFile && (
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
          <div
            className="flex flex-1 flex-col justify-between"
            style={{ height: "176px" }}
          >
            <div className="flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name="majorPositionId"
                  label="ตำแหน่ง (ภาษาไทย)"
                  variant="outlined"
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled></MenuItem>
                  {majorPositions.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.positionTh}
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
                />
              </div>
            </div>
            <div className="flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name="majorPositionId"
                  label="ตำแหน่ง (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled></MenuItem>
                  {majorPositions.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.positionEn}
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
                  required
                />
              </div>

              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="lastNameEn"
                  label="นามสกุล (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  required
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
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-4">
              <RHFSelect
                control={control}
                name="academicPositionId"
                label="ตำแหน่งในหลักสูตร"
                fullWidth
                required
              >
                <MenuItem value="" disabled />
                {acadamicPositions.map((positon) => (
                  <MenuItem key={positon.id} value={positon.id}>
                    {positon.positionTh}
                  </MenuItem>
                ))}
              </RHFSelect>
            </div>
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="profRoom"
                label="ห้องพักอาจารย์"
                variant="outlined"
                fullWidth
                required
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
            marginBottom: "8px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            ประวัติการศึกษา
          </Typography>
          <IconButton
            color="primary"
            onClick={() =>
              appendEducation({ level: null, major: "", university: "" })
            }
            sx={{
              border: "1px solid #120554",
              color: "#120554",
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#e3e8fd" },
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
        <div>
          {educationFields.map((field, index) => (
            <div key={field.id} className="flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name={`education.${index}.level`}
                  label="ระดับการศึกษา"
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled />
                  {levelId.map((level) => (
                    <MenuItem key={level.id} value={level.id}>
                      {level.level}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>

              <div className="flex-2">
                <RHFTextField
                  control={control}
                  name={`education.${index}.major`}
                  label="วิชาเอก"
                  fullWidth
                  required
                />
              </div>

              <div className="flex-2">
                <RHFTextField
                  control={control}
                  name={`education.${index}.university`}
                  label="มหาวิทยาลัย"
                  fullWidth
                  required
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Controller
            control={control}
            name="expertFields"
            render={({ field, fieldState }) => (
              <>
                <Typography variant="h6" fontWeight="bold">
                  ข้อมูลเกี่ยวกับสาขา
                </Typography>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    สาขาที่เชี่ยวชาญ
                  </Typography>

                  <IconButton
                    color="primary"
                    sx={{
                      border: "1px solid #120554",
                      color: "#120554",
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#e3e8fd" },
                    }}
                    onClick={() => field.onChange([...field.value, ""])}
                  >
                    <AddIcon />
                  </IconButton>
                </div>

                {field.value.map((value, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    label="สาขาที่เชี่ยวชาญ"
                    value={value}
                    error={!!fieldState.error}
                    onChange={(e) => {
                      const next = [...field.value];
                      next[index] = e.target.value;
                      field.onChange(next);
                    }}
                    sx={{ mb: 2 }}
                  />
                ))}

                {fieldState.error && (
                  <Typography color="error" variant="caption">
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button variant="outlined" size="large">
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" size="large">
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  );
};
