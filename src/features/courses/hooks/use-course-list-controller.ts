import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import {
  useCreateCourseBatch,
  useDeleteCourse,
} from "@/features/courses/client";
import { CourseSearchSchema } from "@/features/courses/schema/course";
import type { CourseSearch } from "@/features/courses/schema/course";

export function useCourseListController(initialSearch?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deleteCourse = useDeleteCourse();
  const createCourseBatch = useCreateCourseBatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const form = useForm<CourseSearch>({
    resolver: zodResolver(CourseSearchSchema),
    defaultValues: { search: initialSearch ?? "" },
  });
  const watchedSearch = form.watch("search");

  const handleNextPage = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleSort = (orderBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOrderBy = params.get("orderBy");
    const currentSortBy = params.get("sortBy");
    const newOrder =
      currentOrderBy === orderBy && currentSortBy === "desc" ? "asc" : "desc";
    params.set("orderBy", orderBy);
    params.set("sortBy", newOrder);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterTypeCourse = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("typeCourseID");
    } else {
      params.set("typeCourseID", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDelete = async (courseId: number) => {
    try {
      await deleteCourse.mutateAsync(courseId);
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          router.refresh();
        },
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลถูกลบออกจากระบบแล้ว",
        confirmText: "เสร็จสิ้น",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("ไม่สามารถลบรายวิชาได้");
    }
  };

  const confirmDeleteCourse = (courseId: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        void handleDelete(courseId);
        setConfirmModal(null);
      },
    });
  };

  const handleUploadCourseFile = async (file: File) => {
    try {
      await createCourseBatch.mutateAsync(file);
      router.refresh();
      return true;
    } catch (error) {
      console.error(error);
      setErrorMessage("ไม่สามารถอัปโหลดข้อมูลรายวิชาได้");
      return false;
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("search", watchedSearch);
        params.set("page", "1");
      } else {
        params.delete("search");
      }
      const newSearch = params.toString();
      if (searchParams.toString() !== newSearch) {
        router.push(`${pathname}?${newSearch}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [watchedSearch, pathname, router, searchParams]);

  return {
    form,
    watchedSearch,
    errorMessage,
    confirmModal,
    handleNextPage,
    handleSort,
    handleFilterTypeCourse,
    confirmDeleteCourse,
    handleUploadCourseFile,
    handleCloseAlert: () => setErrorMessage(""),
  };
}
