"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFSelect } from "@/components/form/RHFSelect";
import { CurriculumService } from "@/core/service/curriculum.service";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";
import { ICurriculum } from "@/core/domain/curriculum";

interface FormClassbookProps {
  apiBase: string;
}

const Schema = z.object({
  classof: z.string().min(1, "กรุณากรอกรุ่นการศึกษา"),
  firstYearAcademic: z.string().min(1, "กรุณากรอกปีการศึกษา"),
  curriculumId: z.number().min(1, "กรุณาเลือกหลักสูตร"),
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

  const cuurriculumService = useMemo(() => {
    const curriculumRepository = new CurriculumRepository(apiBase);
    return new CurriculumService(curriculumRepository);
  }, [apiBase]);

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    const fetchCurriculums = async () => {
      const response = await cuurriculumService.getCurriculum({
        sortBy: "year",
        sortOrder: "desc",
      });
      setCurriculums(response.rows);
    };
    fetchCurriculums();
  }, [apiBase, cuurriculumService]);

  const { control } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      classof: "",
      firstYearAcademic: "",
      curriculumId: 0,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  return (
    <form className="space-y-4 p-8">
      <h3 className="font-bold">เพิ่มรุ่นการศึกษา</h3>
      <div className="flex flex-row">
        <div className="flex w-full items-center justify-center">
          <div className="bg-neutral02 flex h-80 w-96 items-center justify-center">
            {selectedFile ? (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                width={384}
                height={192}
                style={{ objectFit: "cover" }}
                className="h-full w-full object-cover"
              />
            ) : (
              <Button variant="outlined" component="label">
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
          />
          <RHFTextField
            control={control}
            name="firstYearAcademic"
            label="ปีการศึกษาแรก"
            variant="outlined"
            size="small"
            fullWidth
          />
          <RHFSelect
            name="curriculumId"
            control={control}
            label="หลักสูตร"
            variant="outlined"
            size="small"
            fullWidth
          >
            {curriculums.map((curriculum) => (
              <MenuItem key={curriculum.id} value={curriculum.id}>
                หลักสูตร ({curriculum.year})
              </MenuItem>
            ))}
          </RHFSelect>
          <div className="flex flex-row gap-4"></div>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button type="submit" variant="outlined" color="primary" size="medium">
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" color="primary" size="medium">
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  );
};
