import { useEffect, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useCreateCourse, useCourses } from "@/features/courses/client";
import {
  CreateCourseFormSchema,
  CreateCourseRequestSchema,
} from "@/features/courses/schema/course";
import type { CreateCourseFormInput } from "@/features/courses/schema/course";

export function useCreateCourseController(curriculumID: number) {
  const router = useRouter();
  const createCourse = useCreateCourse();
  const coursesQuery = useCourses({
    curriculumID,
    orderBy: "courseCode",
    sortBy: "asc",
  });
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const form = useForm<CreateCourseFormInput>({
    resolver: zodResolver(CreateCourseFormSchema),
    mode: "onChange",
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

  const onSubmit: SubmitHandler<CreateCourseFormInput> = async (data) => {
    setIsError(false);
    try {
      const request = CreateCourseRequestSchema.parse({
        ...data,
        typeCourseID: Number(data.typeCourseID),
        preCoursesID: data.preCoursesID
          .map(({ id }) => id)
          .filter((id): id is number => id !== undefined && id !== 0),
        curriculumID,
      });
      await createCourse.mutateAsync(request);
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

  return {
    form,
    courses: coursesQuery.data?.rows ?? [],
    watchedPreCourses,
    fields,
    append,
    remove,
    isError,
    isPending: createCourse.isPending,
    confirmModal,
    onSubmit,
    handleCancel,
    handleCloseAlert: () => setIsError(false),
  };
}
