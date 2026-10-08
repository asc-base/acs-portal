import { useEffect, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ICourse } from "@/features/courses/schema/course";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useCourses, useUpdateCourse } from "@/features/courses/client";
import {
  UpdateCourseFormSchema,
  UpdateCourseRequestSchema,
} from "@/features/courses/schema/course";
import type { UpdateCourseFormInput } from "@/features/courses/schema/course";

export function useUpdateCourseController(
  curriculumID: number,
  course: ICourse,
) {
  const router = useRouter();
  const updateCourse = useUpdateCourse();
  const coursesQuery = useCourses({
    curriculumID,
    orderBy: "courseCode",
    sortBy: "asc",
  });
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const form = useForm<UpdateCourseFormInput>({
    resolver: zodResolver(UpdateCourseFormSchema),
    mode: "onChange",
    defaultValues: {
      typeCourseID: course.typeCourse.id,
      courseCode: course.courseCode,
      credits: course.credits,
      courseNameEn: course.courseNameEn,
      courseNameTh: course.courseNameTh,
      detail: course.detail,
      preCoursesID: course.prerequisites.map(({ id }) => ({ id })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "preCoursesID",
  });
  const watchedPreCourses = form.watch("preCoursesID");

  useEffect(() => {
    if (coursesQuery.isError) setIsError(true);
  }, [coursesQuery.isError]);

  const handleCancel = () => {
    if (form.formState.isDirty) {
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

  const onSubmit: SubmitHandler<UpdateCourseFormInput> = async (data) => {
    setIsError(false);
    try {
      const oldPrecourseIds = course.prerequisites.map(({ id }) => id);
      const currentPrecourseIds = (data.preCoursesID ?? [])
        .map(({ id }) => id)
        .filter((id): id is number => id !== undefined && id !== 0);
      const request = UpdateCourseRequestSchema.parse({
        courseCode: data.courseCode,
        typeCourseID: Number(data.typeCourseID),
        courseNameTh: data.courseNameTh,
        courseNameEn: data.courseNameEn,
        credits: data.credits,
        detail: data.detail,
        newPrecourseId: currentPrecourseIds.filter(
          (id) => !oldPrecourseIds.includes(id),
        ),
        deletePrecourseId: oldPrecourseIds.filter(
          (id) => !currentPrecourseIds.includes(id),
        ),
        curriculumID,
      });
      await updateCourse.mutateAsync({ id: course.id, data: request });
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
      console.error("Update Course Error:", error);
      setIsError(true);
    }
  };

  return {
    form,
    courses: coursesQuery.data?.rows ?? [],
    currentCourseId: course.id,
    watchedPreCourses,
    fields,
    append,
    remove,
    isError,
    isPending: updateCourse.isPending,
    confirmModal,
    onSubmit,
    handleCancel,
    handleCloseAlert: () => setIsError(false),
  };
}
