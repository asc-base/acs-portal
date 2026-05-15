"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Button,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { CourseRepository } from "@/infra/repositories/course.repository";
import { CourseService } from "@/core/service/course.service";
import { MasterDataRepository } from "@/infra/repositories/master-data.repository";
import { MasterDataService } from "@/core/service/master-data.service";
import { useRouter } from "next/navigation";
import { ICreateCourse, ICourse } from "@/core/domain/course";
import { TypeCourse } from "@/core/domain/master-data";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";

interface CoursesFormProps {
  apiBase: string;
  curriculumID: number;
}

const Schema = z.object({
  typeCourseID: z.number().min(1, "กรุณาเลือกกลุ่มวิชา"),
  courseCode: z.string().min(1, "กรุณากรอกรหัสวิชา"),
  credits: z.string().min(1, "กรุณากรอกหน่วยกิต"),
  courseNameEn: z.string().min(1, "กรุณากรอกชื่อวิชาภาษาอังกฤษ"),
  courseNameTh: z.string().min(1, "กรุณากรอกชื่อวิชาภาษาไทย"),
  detail: z.string().min(1, "กรุณากรอกลักษณะการเรียน"),
  preCoursesID: z.array(
    z.object({
      id: z.number().optional(),
    }),
  ),
});

type FormData = z.infer<typeof Schema>;

export const CourseForm: FC<CoursesFormProps> = ({ apiBase, curriculumID }) => {
  const router = useRouter();
  const [typeCourses, setTypeCourses] = useState<TypeCourse[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const courseService = useMemo(() => {
    const courseRepository = new CourseRepository(apiBase);
    return new CourseService(courseRepository);
  }, [apiBase]);

  const typeCourseService = useMemo(() => {
    const typeCourseRepository = new MasterDataRepository(apiBase);
    return new MasterDataService(typeCourseRepository);
  }, [apiBase]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      typeCourseID: 0,
      courseCode: "",
      credits: "",
      courseNameEn: "",
      courseNameTh: "",
      detail: "",
      preCoursesID: [],
    },
  });

  const watchedPreCourses = watch("preCoursesID");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "preCoursesID",
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
      const CreateData: ICreateCourse = {
        courseCode: data.courseCode,
        typeCourseID: Number(data.typeCourseID),
        courseNameTh: data.courseNameTh,
        courseNameEn: data.courseNameEn,
        credits: data.credits,
        detail: data.detail,
        preCoursesID: data.preCoursesID
          ? data.preCoursesID
              .map((p) => p.id)
              .filter((id): id is number => id !== undefined && id !== 0)
          : [],
        curriculumID: curriculumID,
      };

      const response = await courseService.createCourse(CreateData);

      if (!response) {
        setIsError(true);
        return;
      }

      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () =>
          router.push(
            `/admin/courses?page=1&pageSize=10&curriculumID=${curriculumID}`,
          ),
      });
    } catch (error) {
      console.error("Submit Error:", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeRes, courseRes] = await Promise.all([
          typeCourseService.getMasterData(),
          courseService.getCourse({
            curriculumID,
            orderBy: "courseCode",
            sortBy: "asc",
          }),
        ]);

        setTypeCourses(typeRes.typeCourses);
        setCourses(courseRes.rows);
      } catch (err) {
        console.error(err);
        setIsError(true);
      }
    };
    fetchData();
  }, [curriculumID, courseService, typeCourseService]);

  const handleCloseAlert = () => setIsError(false);

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
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
          เกิดข้อผิดพลาด ไม่สามารถเพิ่มรายวิชาได้
        </Alert>
      </Snackbar>

      <h3 className="mb-4 text-lg font-bold">ข้อมูลรายวิชา</h3>

      <div className="grid grid-cols-3 gap-4">
        <RHFSelect
          name="typeCourseID"
          control={control}
          label="กลุ่มวิชา"
          variant="outlined"
          size="small"
          requiredMark
        >
          {typeCourses.map((typeCourse) => (
            <MenuItem key={typeCourse.id} value={typeCourse.id}>
              {typeCourse.type}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFTextField
          control={control}
          name="courseCode"
          label="รหัสวิชา"
          variant="outlined"
          size="small"
          requiredMark
        />

        <RHFTextField
          control={control}
          name="credits"
          label="หน่วยกิต"
          variant="outlined"
          size="small"
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
        requiredMark
      />

      <RHFTextField
        control={control}
        name="courseNameTh"
        label="ชื่อวิชาภาษาไทย"
        variant="outlined"
        size="small"
        fullWidth
        requiredMark
      />

      <RHFTextField
        control={control}
        name="detail"
        label="คำอธิบายรายวิชา"
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        requiredMark
      />

      <div className="mt-6">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-primary01 font-bold">รายวิชาบังคับ</h3>
          <IconButton
            onClick={() => append({ id: 0 })}
            sx={{ color: "var(--color-primary03)" }}
          >
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </div>

        {fields.map((item, index) => {
          const selectedIds = watchedPreCourses
            ?.map((preCourse, i) => (i === index ? null : preCourse?.id))
            .filter((id): id is number => Boolean(id));

          return (
            <div key={item.id} className="mb-3 flex items-center gap-2">
              <div className="flex-1">
                <p className="text-neutral05 mb-1">
                  {index + 1}. รหัสวิชาและชื่อวิชา
                </p>

                <Controller
                  name={`preCoursesID.${index}.id`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={courses.filter(
                        (c) => !selectedIds.includes(c.id),
                      )}
                      value={courses.find((c) => c.id === field.value) ?? null}
                      getOptionLabel={(option) =>
                        `${option.courseCode} ${option.courseNameTh}`
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      onChange={(_, value) => {
                        field.onChange(value?.id ?? 0);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" fullWidth />
                      )}
                    />
                  )}
                />
              </div>

              <IconButton
                sx={{ mt: 1 }}
                color="error"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-x-4 pt-6">
        <Button
          type="button"
          variant="outlined"
          size="medium"
          className="w-37.5"
          onClick={handleCancel}
        >
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          size="medium"
          type="submit"
          className="w-37.5"
        >
          บันทึกข้อมูล
        </Button>
      </div>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </form>
  );
};
