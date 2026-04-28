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
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";

interface FormProjectsProps {
  apiBase: string;
}

const Schema = z.object({
  academicPositionId: z
    .number()
    .nullable()
    .refine((v) => v !== null, {
      message: "กรุณากรอกตำแหน่ง",
    }),
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

export const FormProjects: FC<FormProjectsProps> = ({ apiBase }) => {
  const [majorPositions, setMajorPositions] = useState<Position[]>([]);
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
      academicPositionId: null,
      education: [],
      email: "",
      expertFields: [],
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
        academicPositionId: data.academicPositionId!,
        majorPositionId: data.majorPositionId!,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        email: data.email,
        phone: data.phone,
        profRoom: data.profRoom,
        education: data.education.map((e) => e.value).join("/"),
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
      setMajorPositions(res.majorPositions);
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
          ข้อมูลผลงาน
        </Typography>
        <div className="mt-6 mb-8 flex flex-row items-center gap-x-8">
          <div className="bg-neutral02 group relative flex h-[284px] w-[400px] items-center justify-center rounded-xl">
            {selectedFile ? (
              <>
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={400}
                  height={284}
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
          <div className="flex h-[284px] flex-1 flex-col justify-between">
            <RHFTextField
              control={control}
              name="firstNameEn"
              label="หัวข้อ"
              variant="outlined"
              fullWidth
              placeholder="ระบุหัวข้อ"
              requiredMark
            />
            <RHFTextField
              control={control}
              name="lastNameEn"
              label="รายละเอียด"
              variant="outlined"
              fullWidth
              placeholder="ระบุรายละเอียด"
              requiredMark
            />

            <RHFTextField
              control={control}
              name="lastNameEn"
              label="ลิงค์คลิปวิดิโอ"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์คลิปวิดิโอ"
              requiredMark
            />
          </div>
        </div>
        <div className="mb-5 flex flex-1 flex-col justify-between gap-y-5">
          <div className="flex gap-5">
            <Typography variant="h6" fontWeight="bold">
              ข้อมูลการจัดหมวดหมู่
            </Typography>
            <Typography variant="h6" fontWeight="regular">
              (สามารถเลือกได้มากกว่า 1 ในแต่ละคอลัมม์)
            </Typography>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">วิชา</h2>

                <button className="flex h-8 w-8 items-center justify-center">
                  <AddCircleOutlineOutlined />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <RHFSelect
                      control={control}
                      name="majorPositionId"
                      label="วิชา"
                      variant="outlined"
                      fullWidth
                      required
                      displayEmpty
                      requiredMark
                      renderValue={(value) => {
                        if (!value) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>ระบุวิชา</span>
                          );
                        }
                        const selected = majorPositions.find(
                          (item) => item.id === value,
                        );
                        return selected?.positionEn;
                      }}
                    >
                      {majorPositions?.map((position) => (
                        <MenuItem key={position.id} value={position.id}>
                          {position.positionEn}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </div>

                  <button className="mt-5 text-red-500 hover:text-red-600">
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-30 w-0.5 bg-gray-300"></div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">ประเภท</h2>

                <button className="flex h-8 w-8 items-center justify-center">
                  <AddCircleOutlineOutlined />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <RHFSelect
                      control={control}
                      name="majorPositionId"
                      label="ประเภท"
                      variant="outlined"
                      fullWidth
                      required
                      displayEmpty
                      requiredMark
                      renderValue={(value) => {
                        if (!value) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>ระบุประเภท</span>
                          );
                        }
                        const selected = majorPositions.find(
                          (item) => item.id === value,
                        );
                        return selected?.positionEn;
                      }}
                    >
                      {majorPositions?.map((position) => (
                        <MenuItem key={position.id} value={position.id}>
                          {position.positionEn}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </div>

                  <button className="mt-5 text-red-500 hover:text-red-600">
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-30 w-0.5 bg-gray-300"></div>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">หมวดหมู่</h2>

                <button className="flex h-8 w-8 items-center justify-center">
                  <AddCircleOutlineOutlined />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <RHFSelect
                      control={control}
                      name="majorPositionId"
                      label="หมวดหมู่"
                      variant="outlined"
                      fullWidth
                      required
                      displayEmpty
                      requiredMark
                      renderValue={(value) => {
                        if (!value) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>
                              ระบุหมวดหมู่
                            </span>
                          );
                        }
                        const selected = majorPositions.find(
                          (item) => item.id === value,
                        );
                        return selected?.positionEn;
                      }}
                    >
                      {majorPositions?.map((position) => (
                        <MenuItem key={position.id} value={position.id}>
                          {position.positionEn}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </div>

                  <button className="mt-5 text-red-500 hover:text-red-600">
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-y-5">
          <Typography variant="h6" fontWeight="bold">
            ลิงค์ต่างๆ
          </Typography>
          <div className="flex flex-1 flex-col justify-between gap-5">
            <RHFTextField
              control={control}
              name="firstNameEn"
              label="Github"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์ Github"
              requiredMark
              startIcon={<LinkIcon fontSize="small" />}
            />
            <RHFTextField
              control={control}
              name="lastNameEn"
              label="Document"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์ Document"
              requiredMark
              startIcon={<DescriptionIcon fontSize="small" />}
            />

            <RHFTextField
              control={control}
              name="lastNameEn"
              label="Presentation"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงค์ Presentation"
              requiredMark
              startIcon={<SlideshowIcon fontSize="small" />}
            />
          </div>
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
