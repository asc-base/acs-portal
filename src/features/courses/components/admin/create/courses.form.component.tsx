"use client";
import { FC } from "react";
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
import { Controller } from "react-hook-form";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { useMasterData } from "@/features/master-data/client";
import { useCreateCourseController } from "@/features/courses/hooks/use-create-course-controller";


interface CoursesFormProps {
  curriculumID: number;
}

export const CourseForm: FC<CoursesFormProps> = ({ curriculumID }) => {
  const { data: masterData, isPending: isMasterDataPending, isError: isMasterDataError } = useMasterData();
  const typeCourses = masterData?.typeCourses ?? [];
  const {
    form,
    courses,
    isError,
    confirmModal,
    watchedPreCourses,
    fields,
    append,
    remove,
    onSubmit,
    handleCancel,
    handleCloseAlert,
  } = useCreateCourseController(curriculumID);
  const { control, handleSubmit } = form;

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

      {isMasterDataPending && <Alert severity="info">กำลังโหลดตัวเลือกกลุ่มวิชา...</Alert>}
      {isMasterDataError && <Alert severity="error">ไม่สามารถโหลดตัวเลือกกลุ่มวิชาได้</Alert>}

      <h3 className="mb-4 text-lg font-bold">ข้อมูลรายวิชา</h3>

      <div className="grid grid-cols-3 gap-4">
        <RHFSelect
          name="typeCourseID"
          control={control}
          label="กลุ่มวิชา"
          variant="outlined"
          size="small"
          disabled={isMasterDataPending}
          requiredMark
          displayEmpty
          renderValue={(value) =>
            value ? (
              typeCourses.find((typeCourse) => typeCourse.id === value)?.type
            ) : (
              <span className="text-neutral04">เลือกกลุ่มวิชา</span>
            )
          }
        >
          <MenuItem value={0} disabled sx={{ display: "none" }}>
            เลือกกลุ่มวิชา
          </MenuItem>
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
          placeholder="ระบุรหัสวิชา"
        />

        <RHFTextField
          control={control}
          name="credits"
          label="หน่วยกิต"
          variant="outlined"
          size="small"
          requiredMark
          placeholder="ระบุหน่วยกิต"
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
        placeholder="ระบุชื่อวิชาภาษาอังกฤษ"
      />

      <RHFTextField
        control={control}
        name="courseNameTh"
        label="ชื่อวิชาภาษาไทย"
        variant="outlined"
        size="small"
        fullWidth
        requiredMark
        placeholder="ระบุชื่อวิชาภาษาไทย"
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
        placeholder="ระบุคำอธิบายรายวิชา"
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
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          placeholder="เลือกรหัสวิชาและชื่อวิชา"
                        />
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
