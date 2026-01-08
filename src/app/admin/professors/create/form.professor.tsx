"use client";
import React, { FC, useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MasterDataService } from "@/core/service/master-data.service";
import { MasterDataRepository } from "@/infra/repositories/master-data.repository";
import { ProfessorService } from "@/core/service/professor.service";
import { ProfessorRepository } from "@/infra/repositories/professor.repository";
import { Position, EducationLevel } from "@/core/domain/master-data";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { ICreateProfessor } from "@/core/domain/professor";
import { ConfirmModal } from "@/components/modal/confirmModal";

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
        level: z.number().nullable(),
        education: z.string().trim(),
        university: z.string().trim(),
      }),
    )
    .optional()
    .superRefine((items, ctx) => {
      items?.forEach((i, idx) => {
        if (i.level === null && !i.education && !i.university) return;
        if (!i.education)
          ctx.addIssue({
            path: [idx, "education"],
            message: "กรอกวิชาเอก",
            code: "custom",
          });
        if (!i.university)
          ctx.addIssue({
            path: [idx, "university"],
            message: "กรอกมหาลัย",
            code: "custom",
          });
        if (i.level === null)
          ctx.addIssue({
            path: [idx, "level"],
            message: "กรอกระดับการศึกษา",
            code: "custom",
          });
      });
    }),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง"),
  expertFields: z
    .array(
      z.object({
        value: z.string().trim(),
      }),
    )
    .optional(),
  firstNameEn: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อภาษาอังกฤษ")
    .optional()
    .or(z.literal("")),
  firstNameTh: z.string().trim().min(1, "กรุณากรอกชื่อภาษาไทย"),
  lastNameEn: z
    .string()
    .trim()
    .min(1, "กรุณากรอกนามสกุลภาษาอังกฤษ")
    .optional()
    .or(z.literal("")),
  lastNameTh: z.string().trim().min(1, "กรุณากรอกนามสกุลภาษาไทย"),
  majorPositionId: z
    .number()
    .nullable()
    .refine((v) => v !== null, {
      message: "กรุณากรอกตำแหน่ง",
    }),
  phone: z
    .string()
    .trim()
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
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [openSucsessModal, setOpenSucsessModal] = useState(false);

  const masterDataService = useMemo(() => {
    const masterdataRepository = new MasterDataRepository(apiBase);
    return new MasterDataService(masterdataRepository);
  }, [apiBase]);

  const professorService = useMemo(() => {
    const professorRepository = new ProfessorRepository(apiBase);
    return new ProfessorService(professorRepository);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      academicPositionId: null,
      education: [
        {
          level: null,
          education: "",
          university: "",
        },
      ],
      email: "",
      expertFields: [{ value: "" }],
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

  const { fields: expertFields, append: appendExpert } = useFieldArray({
    control,
    name: "expertFields",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const cancelForm = () => {
    const hasAnyValue = isDirty || !!selectedFile;
    hasAnyValue ? setOpenWarningModal(true) : router.push("/admin/professors");
  };

  const handleConfirmSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const onSubmit = async (data: FormData) => {
    setIsError(false);
    try {
      const payload: ICreateProfessor = {
        academicPositionId: data.academicPositionId!,
        majorPositionId: data.majorPositionId!,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        email: data.email,
        phone: data.phone,
        profRoom: data.profRoom,
        expertFields: data.expertFields?.map((e) => e.value),
        education: data.education?.map((e) => ({
          level: e.level!,
          education: e.education,
          university: e.university,
        })),
      };
      const reps = await professorService.createProfessor(
        payload,
        selectedFile!,
      );
      if (!reps) {
        setIsError(true);
        return;
      }
      setOpenSucsessModal(true);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await masterDataService.getMasterData();
      setMajorPositions(res.majorPositions);
      setAcadamicPositions(res.academicPositions);
      setLevelId(res.educationLevels);
    };
    fetchData();
  }, [apiBase, masterDataService]);

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
          ไม่สามารถเพิ่มข้อมูลอาจารย์ได้
        </Alert>
      </Snackbar>
      <div>
        <Typography variant="h6" fontWeight="bold">
          ข้อมูลส่วนตัว
        </Typography>
        <div className="mt-6 mb-16 flex flex-row items-center gap-x-8">
          <div className="bg-neutral02 group relative flex h-[182px] w-[268px] items-center justify-center rounded-xl">
            {selectedFile ? (
              <>
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={384}
                  height={192}
                  style={{ objectFit: "cover" }}
                  className="h-full w-full rounded-xl object-cover"
                />
                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="contained" component="label">
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
              <Button variant="outlined" component="label">
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
                  name="majorPositionId"
                  label="ตำแหน่ง (ภาษาไทย)"
                  variant="outlined"
                  fullWidth
                  required
                  displayEmpty
                  renderValue={(value) => {
                    if (!value) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          ระบุตำแหน่ง (ภาษาไทย)
                        </span>
                      );
                    }
                    const selected = majorPositions.find(
                      (item) => item.id === value,
                    );
                    return selected?.positionTh;
                  }}
                >
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
                  placeholder="ระบุชื่อ (ภาษาไทย)"
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
                  displayEmpty
                  renderValue={(value) => {
                    if (!value) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          ระบุตำแหน่ง (ภาษาอังกฤษ)
                        </span>
                      );
                    }
                    const selected = majorPositions.find(
                      (item) => item.id === value,
                    );
                    return selected?.positionEn;
                  }}
                >
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
                  placeholder="ระบุชื่อ (ภาษาอังกฤษ)"
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
                placeholder="ระบุเบอร์โทร"
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
                displayEmpty
                renderValue={(value) => {
                  if (!value) {
                    return (
                      <span style={{ color: "#9e9e9e" }}>
                        ระบุตำแหน่งในหลักสูตร
                      </span>
                    );
                  }
                  const selected = acadamicPositions.find(
                    (item) => item.id === value,
                  );
                  return selected?.positionTh;
                }}
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
                placeholder="ระบุห้องพักอาจารย์"
              />
            </div>
          </div>
        </div>
        <div className="mt-[12px] mb-[8px] flex items-center justify-between">
          <Typography variant="h6" fontWeight="bold">
            ประวัติการศึกษา
          </Typography>
          <IconButton
            color="primary"
            onClick={() =>
              appendEducation({ level: null, education: "", university: "" })
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
            <div key={field.id} className="mt-2 flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name={`education.${index}.level`}
                  label="ระดับการศึกษา"
                  fullWidth
                  displayEmpty
                  renderValue={(value) => {
                    if (!value) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          ระบุระดับการศึกษา
                        </span>
                      );
                    }
                    const selected = levelId.find((item) => item.id === value);
                    return selected?.level;
                  }}
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
                  name={`education.${index}.education`}
                  label="วิชาเอก"
                  fullWidth
                  placeholder="ระบุวิชาเอก"
                />
              </div>

              <div className="flex-2">
                <RHFTextField
                  control={control}
                  name={`education.${index}.university`}
                  label="มหาวิทยาลัย"
                  fullWidth
                  placeholder="ระบุมหาวิทยาลัย"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <div className="mb-[8px] flex items-center justify-between">
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
              onClick={() => appendExpert({ value: "" })}
            >
              <AddIcon />
            </IconButton>
          </div>
          {expertFields.map((field, index) => {
            return (
              <div className="mt-2" key={index}>
                <RHFTextField
                  key={field.id}
                  control={control}
                  name={`expertFields.${index}.value`}
                  label="สาขาที่เชี่ยวชาญ"
                  fullWidth
                  placeholder="ระบุสาขาที่เชี่ยวชาญ"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button variant="outlined" size="large" onClick={cancelForm}>
          ยกเลิก
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isValid}
        >
          บันทึกข้อมูล
        </Button>
      </div>
      <ConfirmModal
        open={openWarningModal}
        onClose={() => {
          setOpenWarningModal(false);
        }}
        onConfirm={() => {
          setOpenWarningModal(false);
          handleConfirmSubmit();
        }}
        onCancel={() => router.push("/admin/professors")}
        type="warning"
      />
      <ConfirmModal
        open={openSucsessModal}
        onClose={() => setOpenSucsessModal(false)}
        onConfirm={() => router.push("/admin/professors")}
        type="success"
      />
    </form>
  );
};
