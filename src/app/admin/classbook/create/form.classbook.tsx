"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button, MenuItem, Alert, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFSelect } from "@/components/form/RHFSelect";
import { CurriculumService } from "@/core/service/curriculum.service";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";
import { ICurriculum } from "@/core/domain/curriculum";
import { ClassBookRepository } from "@/infra/repositories/class-book.repository";
import { ClassBookService } from "@/core/service/class-book.service";
import { useRouter } from "next/navigation";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";

interface FormClassbookProps {
  apiBase: string;
}

const Schema = z.object({
  classof: z.string().min(1, "กรุณากรอกรุ่นการศึกษา"),
  firstYearAcademic: z.string().min(1, "กรุณากรอกปีการศึกษา"),
  curriculumID: z.number().min(1, "กรุณาเลือกหลักสูตร"),
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

export const FormClassbook: FC<FormClassbookProps> = ({ apiBase }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [curriculums, setCurriculums] = useState<ICurriculum[]>([]);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

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
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      classof: "",
      firstYearAcademic: "",
      curriculumID: 0,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const cancelForm = () => {
    const hasAnyValue = isDirty || !!selectedFile;
    if (hasAnyValue) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/classbook`),
      });
    } else router.push(`/admin/classbook`);
  };

  const onSubmit = async (data: FormData) => {
    setIsError(false);
    try {
      const reps = await classBookService.createClassBook(data, selectedFile!);
      if (!reps) {
        setIsError(true);
        return;
      }
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/classbook`),
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const handleCloseAlert = () => {
    setIsError(false);
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
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      {" "}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="error"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          ไม่สามารถเพิ่มรุ่นการศึกษาได้
        </Alert>
      </Snackbar>
      <h3 className="font-bold">เพิ่มรุ่นการศึกษา</h3>
      <div className="mt-[28px] flex w-full justify-between gap-x-10">
        <div className="flex h-[284px] w-[400px] items-center justify-center">
          <div className="bg-neutral02 group relative flex h-full w-full items-center justify-center rounded-xl">
            {selectedFile ? (
              <>
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={400}
                  height={284}
                  style={{ objectFit: "cover" }}
                  className="h-full w-full object-cover"
                />
                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="contained" component="label">
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleSelectFile}
                    />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="contained" component="label">
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleSelectFile}
                />
                อัปโหลดรูปภาพ
              </Button>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col justify-between">
          <RHFTextField
            control={control}
            name="classof"
            label="รุ่นการศึกษา"
            variant="outlined"
            size="small"
            fullWidth
            requiredMark
          />
          <RHFTextField
            control={control}
            name="firstYearAcademic"
            label="ปีการศึกษา"
            variant="outlined"
            size="small"
            fullWidth
            requiredMark
          />
          <RHFSelect
            name="curriculumID"
            control={control}
            label="หลักสูตร"
            variant="outlined"
            size="small"
            fullWidth
            requiredMark
          >
            {curriculums.map((curriculum) => (
              <MenuItem key={curriculum.id} value={curriculum.id}>
                {curriculum.title} {curriculum.year}
              </MenuItem>
            ))}
          </RHFSelect>
          <div className="flex flex-row gap-4"></div>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          size="medium"
          onClick={cancelForm}
        >
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" color="primary" size="medium">
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </form>
  );
};
