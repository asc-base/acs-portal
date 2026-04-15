"use client";
import { useState, useEffect, useMemo } from "react";
import { Button, Card, MenuItem, Alert, Snackbar } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IClassBook, IUpdateClassBook } from "@/core/domain/classbook";
import { ICurriculum } from "@/core/domain/curriculum";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import { ClassBookService } from "@/core/service/class-book.service";
import { ClassBookRepository } from "@/infra/repositories/class-book.repository";
import { CurriculumService } from "@/core/service/curriculum.service";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";

interface CurriculumFormProps {
  classBook: IClassBook;
  apiBase: string;
}

const classBookSchema = z.object({
  classof: z.string().min(1, "กรุณาระบุรุุ่นการศึกษา"),
  firstYearAcademic: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  curriculumID: z.number().min(1, "กรุณาระบุหลักสูตร"),
});

type ClassBookFormValues = z.infer<typeof classBookSchema>;

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

export const ClassBookInfoComponent = ({
  classBook,
  apiBase,
}: CurriculumFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const [curriculums, setCurriculums] = useState<ICurriculum[]>([]);

  const previewSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : classBook.thumbnailURL;

  const cuurriculumService = useMemo(() => {
    const curriculumRepository = new CurriculumRepository(apiBase);
    return new CurriculumService(curriculumRepository);
  }, [apiBase]);

  const classBookService = useMemo(() => {
    const classBookRepository = new ClassBookRepository(apiBase);
    return new ClassBookService(classBookRepository);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<ClassBookFormValues>({
    resolver: zodResolver(classBookSchema),
    defaultValues: {
      classof: classBook.classof.toString() ?? "",
      firstYearAcademic: classBook.firstYearAcademic ?? "",
      curriculumID: classBook.curriculumID ?? 0,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleCancle = () => {
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

  const onSubmit = async (data: IUpdateClassBook) => {
    if (isDirty || selectedFile) {
      try {
        const response = await classBookService.updateClassBook(
          data,
          selectedFile,
          classBook.id,
        );

        if (!response) setIsError(true);
        else {
          setConfirmModal({
            isOpen: true,
            type: "success",
            onClose: () => setConfirmModal(null),
            onConfirm: () => {
              setConfirmModal(null);
              setIsEdit(false);
            },
          });
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
    }
  };

  useEffect(() => {
    const fetchCurriculums = async () => {
      const response = await cuurriculumService.getCurriculum({
        orderBy: "year",
        sortBy: "desc",
      });
      setCurriculums(response.rows);
    };
    fetchCurriculums();
  }, [apiBase, cuurriculumService]);

  return (
    <div>
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
          ไม่สามารถเพิ่มข้อมูลนักศึกษาได้
        </Alert>
      </Snackbar>
      <Card>
        <div className="p-6">
          <h3 className="mb-6 font-bold">ข้อมูลรุ่นการศึกษา</h3>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                ไม่สามารถเพิ่มข้อมูลนักศึกษาได้
              </Alert>
            </Snackbar>
            <div className="flex gap-x-10 gap-y-2">
              <div className="bg-neutral02 border-neutral04 relative flex h-[284px] w-[400px] flex-col items-center justify-center overflow-hidden rounded-md">
                {previewSrc ? (
                  <div className="group relative h-full w-full">
                    <Image src={previewSrc} alt="Preview" fill priority />
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

              <div className="flex w-full flex-col space-y-4">
                <RHFTextField
                  control={control}
                  name="classof"
                  label="รุุ่นการศึกษา"
                  variant="outlined"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFTextField
                  control={control}
                  name="firstYearAcademic"
                  label="ปีการศึกษา"
                  variant="outlined"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFSelect
                  name="curriculumID"
                  control={control}
                  label="หลักสูตร"
                  variant="outlined"
                  fullWidth
                  disabled={!isEdit}
                  requiredMark
                >
                  {curriculums.map((curriculum) => (
                    <MenuItem key={curriculum.id} value={curriculum.id}>
                      {curriculum.title} พ.ศ.{curriculum.year}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              {isEdit ? (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleCancle}
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
                  size="large"
                  onClick={() => setIsEdit(true)}
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
