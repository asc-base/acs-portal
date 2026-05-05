"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, Card } from "@mui/material";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";
import { CurriculumService } from "@/core/service/curriculum.service";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";
import { ICurriculum } from "@/core/domain/curriculum";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface CurriculumInfoProps {
  apiBase: string;
  curriculum: ICurriculum;
}

const curriculumSchema = z.object({
  title: z.string().min(1, "กรุณาระบุชื่อหลักสูตร"),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  documentURL: z.url({ message: "กรุณาระบุลิงก์ที่ถูกต้อง" }),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
});

type FormValues = z.infer<typeof curriculumSchema>;

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

export const CurriculumInfoComponent = ({ apiBase, curriculum }: CurriculumInfoProps) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [isError, setIsError] = useState(false);

  const previewSrc = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return curriculum.thumbnailURL;
  }, [selectedFile, curriculum.thumbnailURL]);


  const curriculumService = useMemo(() => {
    const repo = new CurriculumRepository(apiBase);
    return new CurriculumService(repo);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      title: curriculum.title ?? "",
      year: curriculum.year ?? "",
      documentURL: curriculum.documentURL ?? "",
      description: curriculum.description ?? "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const year = dayjs(data.year).year().toString();

      const response = await curriculumService.updateCurriculum(
        curriculum.id,
        {
          ...data,
          year,
        },
        selectedFile
      );

      if (response) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            setConfirmModal(null)
            setIsEdit(false);
            router.push(
              `/admin/courses?page=1&pageSize=10&curriculumID=${curriculum.id}`
            );
          },
        });
        return;
      }

      setIsError(true);
    } catch (error) {
      console.error("Update Error:", error);
      setIsError(true);
    }
  };

  const handleCancel = () => {
    if (isDirty || selectedFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setIsEdit(false);
          reset();
          setSelectedFile(null);
          setConfirmModal(null);
        },
      });
    } else {
      setIsEdit(false);
      reset();
      setSelectedFile(null);
    }
  };

  return (
    <div>
      <Card>
        <div className="p-6">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isError}
            autoHideDuration={4000}
            onClose={() => setIsError(false)}
          >
            <Alert
              severity="error"
              icon={false}
              onClose={() => setIsError(false)}
              sx={{ width: "100%" }}
            >
              <strong>ไม่สามารถบันทึกข้อมูลได้</strong>
              <p>ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>
            </Alert>
          </Snackbar>

          <h3 className="mb-6 font-bold">ข้อมูลหลักสูตร</h3>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-x-10">
              <div className="bg-neutral02 relative flex h-[248px] w-[248px] items-center justify-center overflow-hidden rounded-md">
                {previewSrc ? (
                  <div className="group relative h-full w-full">
                    <Image
                      src={previewSrc}
                      alt="preview"
                      fill
                      priority
                    />
                    {isEdit && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
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
                    <Button variant="contained" component="label">
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      อัปโหลดรูปภาพ
                    </Button>
                  )
                )}
              </div>

              <div className="flex w-full flex-col space-y-4">
                <RHFTextField
                  control={control}
                  name="title"
                  label="ชื่อหลักสูตร"
                  variant="outlined"
                  size="small"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFDatePickerDayjs
                  control={control}
                  name="year"
                  label="ปี"
                  views={["year"]}
                  openTo="year"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFTextField
                  control={control}
                  name="documentURL"
                  label="ลิงก์ไฟล์หลักสูตร (Google Drive หรือ OneDrive)"
                  variant="outlined"
                  size="small"
                  disabled={!isEdit}
                  requiredMark
                />
              </div>
            </div>

            <RHFTextField
              control={control}
              name="description"
              label="รายละเอียด"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={4}
              disabled={!isEdit}
              requiredMark
            />

            <div className="mt-6 flex justify-end gap-2">
              {isEdit ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    size="large"
                  >
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
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setIsEdit(true)}
                  size="large"
                >
                  แก้ไขข้อมูล
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};
