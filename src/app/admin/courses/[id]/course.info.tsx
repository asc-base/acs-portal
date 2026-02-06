"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Button, MenuItem, Alert, Snackbar, IconButton } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { CourseRepository } from "@/infra/repositories/course.repository";
import { CourseService } from "@/core/service/course.service";
import { MasterDataRepository } from "@/infra/repositories/master-data.repository";
import { MasterDataService } from "@/core/service/master-data.service";
import { useRouter } from "next/navigation";
import { ICourse, IUpdateCourse } from "@/core/domain/course";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import { TypeCourse } from "@/core/domain/master-data";

interface CoursesFormProps {
  apiBase: string;
  curriculumId: number;
  course: ICourse;
}

const Schema = z.object({
  typeCourseId: z.number().min(1, "กรุณาเลือกกลุ่มวิชา"),
  courseId: z.string().min(1, "กรุณากรอกรหัสวิชา"),
  credits: z.string().min(1, "กรุณากรอกหน่วยกิต"),
  courseNameEn: z.string().min(1, "กรุณากรอกชื่อวิชาภาษาอังกฤษ"),
  courseNameTh: z.string().min(1, "กรุณากรอกชื่อวิชาภาษาไทย"),
  courseDetail: z.string().min(1, "กรุณากรอกลักษณะการเรียน"),
  prerequisites: z
    .array(
      z.object({
        id: z.number().optional(),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof Schema>;

export const CourseInfo: FC<CoursesFormProps> = ({ apiBase, curriculumId, course }) => {
  const router = useRouter();
  const [typeCourses, setTypeCourses] = useState<TypeCourse[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);

  const courseService = useMemo(() => {
    const courseRepository = new CourseRepository(apiBase);
    return new CourseService(courseRepository);
  }, [apiBase]);

  const typeCourseService = useMemo(() => {
    const typeCourseRepository = new MasterDataRepository(apiBase);
    return new MasterDataService(typeCourseRepository);
  }, [apiBase]);

  const { control, handleSubmit, formState: { isDirty } } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      typeCourseId: course.typeCourse.id,
      courseId: course.courseId,
      credits: course.credits,
      courseNameEn: course.courseNameEn,
      courseNameTh: course.courseNameTh,
      courseDetail: course.courseDetail,
      prerequisites: course.preCourses?.map(p => ({
        id: p.id,
      })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prerequisites",
  });

  const handleCancel = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.back(),
      });
    } else {
      router.back();
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsError(false);

    try {
      const updateData: IUpdateCourse = {
        courseId: data.courseId,
        typeCourseId: Number(data.typeCourseId),
        courseNameTh: data.courseNameTh,
        courseNameEn: data.courseNameEn,
        credits: data.credits,
        courseDetail: data.courseDetail,
        prerequisites: data.prerequisites
          ? data.prerequisites
            .map((p) => p.id)
            .filter((id): id is number => id !== undefined) ?? []
          : [],
        curriculumId: curriculumId
      };
      console.log("SEND UPDATE DATA", updateData);
      const response = await courseService.updateCourse(course.id, updateData);

      if (!response) {
        setIsError(true);
        return;
      }

      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(
          `/admin/courses?page=1&pageSize=10&curriculumId=${curriculumId}`
        ),
      });

    } catch (error) {
      console.error("Update Course Error:", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeRes, courseRes] = await Promise.all([
          typeCourseService.getMasterDataTypeCourse(),
          courseService.getCourse({
            curriculumId,
            sortBy: "courseId",
            sortOrder: "asc",
          })
        ]);

        setTypeCourses(typeRes);
        setCourses(courseRes.rows);
      } catch (err) {
        console.error(err);
        setIsError(true);
      }
    };
    fetchData();
  }, [curriculumId, courseService, typeCourseService]);

  const handleCloseAlert = () => setIsError(false);

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert severity="error" onClose={handleCloseAlert} sx={{ width: "100%" }}>
          ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>

      <h3 className="font-bold text-lg mb-4">แก้ไขข้อมูลรายวิชา</h3>

      <div className="grid grid-cols-3 gap-4">
        <RHFSelect
          name="typeCourseId"
          control={control}
          label="กลุ่มวิชา"
          variant="outlined"
          size="small"
          required
          requiredMark
        >
          {typeCourses.map((typeCourse) => (
            <MenuItem key={typeCourse.id} value={typeCourse.id}>
              {typeCourse.name}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFTextField
          control={control}
          name="courseId"
          label="รหัสวิชา"
          variant="outlined"
          size="small"
          required
          requiredMark
        />

        <RHFTextField
          control={control}
          name="credits"
          label="หน่วยกิต"
          variant="outlined"
          size="small"
          required
          requiredMark
        />
      </div>

      <RHFTextField
        control={control}
        name="courseNameEn"
        label="ชื่อวิชาภาษาอังกฤษ"
        variant="outlined"
        size="small"
        fullWidth
        required
        requiredMark
      />

      <RHFTextField
        control={control}
        name="courseNameTh"
        label="ชื่อวิชาภาษาไทย"
        variant="outlined"
        size="small"
        fullWidth
        required
        requiredMark
      />

      <RHFTextField
        control={control}
        name="courseDetail"
        label="ลักษณะการเรียน"
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        required
        requiredMark
      />

      <div className="mt-6">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-primary01 font-bold">รายวิชาบังคับ</h3>
          <IconButton
            onClick={() => append({ id: undefined })}
            sx={{ color: "var(--color-primary03)" }}
          >
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </div>

        {fields.map((item, index) => (
          <div key={item.id} className="mb-3 flex items-end gap-2">
            <div className="flex-1">
              <RHFSelect
                name={`prerequisites.${index}.id`}
                control={control}
                label={`${index + 1}. รหัสวิชาและชื่อวิชา`}
                variant="outlined"
                size="small"
                fullWidth
              >
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.courseId}   {c.courseNameTh}
                  </MenuItem>
                ))}
              </RHFSelect>
            </div>

            <IconButton
              color="error"
              onClick={() => remove(index)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-x-4 pt-6">
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleCancel}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              size="large"
              type="submit"
            >
              บันทึกข้อมูล
            </Button>
      </div>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </form>
  );
};