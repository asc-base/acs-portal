"use client";
import React, { FC, useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Typography } from "@mui/material";
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
import { Position } from "@/core/domain/master-data";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { ICreateProfessor } from "@/core/domain/professor";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

interface FormProfessorsProps {
  apiBase: string;
}

const Schema = z.object({
  academicPositionID: z
    .number()
    .nullable()
    .refine((v) => v !== null, {
      message: "กรุณากรอกตำแหน่ง",
    }),
  educations: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  expertFields: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง"),
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
  const [acadamicPositions, setAcadamicPositions] = useState<Position[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

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
      academicPositionID: null,
      educations: [],
      email: "",
      expertFields: [],
      firstNameEn: "",
      firstNameTh: "",
      lastNameEn: "",
      lastNameTh: "",
      phone: "",
      profRoom: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { fields: educationFields, append: appendEducation } = useFieldArray({
    control,
    name: "educations",
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
    if (hasAnyValue) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/professors`),
      });
    } else router.push(`/admin/professors`);
  };

  const handleConfirmSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const onSubmit = async (data: FormData) => {
    setIsError(false);
    try {
      const payload: ICreateProfessor = {
        academicPositionID: data.academicPositionID!,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        email: data.email,
        phone: data.phone,
        profRoom: data.profRoom,
        educations: data.educations.map((e) => e.value).join("/"),
        expertFields: data.expertFields.map((e) => e.value).join("/"),
      };
      const reps = await professorService.createProfessor(
        payload,
        selectedFile!,
      );
      if (!reps) {
        setIsError(true);
        return;
      }
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/professors`),
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await masterDataService.getMasterData();
      setAcadamicPositions(res.academicPositions);
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
                />
              </div>
            </div>
            <div className="flex flex-row gap-x-4">
              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="firstNameEn"
                  label="ชื่อ (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  placeholder="ระบุชื่อ (ภาษาอังกฤษ)"
                  requiredMark
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
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-4">
              <RHFSelect
                control={control}
                name="academicPositionID"
                label="ตำแหน่งในหลักสูตร"
                fullWidth
                required
                displayEmpty
                requiredMark
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
                  return selected?.nameTh;
                }}
              >
                <MenuItem value="" disabled />
                {acadamicPositions?.map((positon) => (
                  <MenuItem key={positon.id} value={positon.id}>
                    {positon.nameTh}
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
                requiredMark
              />
            </div>
          </div>
        </div>
        <div className="mt-[12px] mb-[8px] flex items-center justify-between">
          <Typography variant="h6" fontWeight="bold">
            ประวัติการศึกษา
          </Typography>
          <AddCircleOutlineRoundedIcon
            color="primary"
            onClick={() => appendEducation({ value: "" })}
            sx={{
              color: "#120554",
              fontSize: 32,
              cursor: "pointer",
            }}
          >
            <AddIcon />
          </AddCircleOutlineRoundedIcon>
        </div>
        <div>
          {educationFields.map((field, index) => (
            <div key={field.id} className="mt-2 flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFTextField
                  control={control}
                  name={`educations.${index}.value`}
                  label="ระดับการศึกษา"
                  fullWidth
                  placeholder="ระบุลำดับการศึกษา เช่น B.Sc. Mathematics King Mongkut's University of Technology Thonburi"
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
            <AddCircleOutlineRoundedIcon
              color="primary"
              sx={{
                color: "#120554",
                fontSize: 32,
                cursor: "pointer",
              }}
              onClick={() => appendExpert({ value: "" })}
            >
              <AddIcon />
            </AddCircleOutlineRoundedIcon>
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
          onClick={handleConfirmSubmit}
          disabled={!isValid}
        >
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </form>
  );
};
