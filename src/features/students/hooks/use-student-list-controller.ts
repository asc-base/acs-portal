import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useDeleteStudent } from "@/features/students/client";
import { StudentSearchSchema } from "@/features/students/schema/student";
import type { StudentSearch } from "@/features/students/schema/student";

export function useStudentListController(initialSearch: string | undefined, classBookID: number) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deleteStudent = useDeleteStudent();
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const form = useForm<StudentSearch>({
    resolver: zodResolver(StudentSearchSchema),
    defaultValues: { search: initialSearch ?? "" },
  });
  const watchedSearch = form.watch("search");

  const handleNextPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const handleSort = (orderBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOrderBy = params.get("orderBy");
    const currentSortBy = params.get("sortBy");
    const sortBy = currentOrderBy === orderBy && currentSortBy === "desc" ? "asc" : "desc";
    params.set("orderBy", orderBy);
    params.set("sortBy", sortBy);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent.mutateAsync(id);
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          router.push(`/admin/students?page=1&pageSize=10&classBookID=${classBookID}`);
        },
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลถูกลบออกจากฐานข้อมูลแล้ว",
        confirmText: "เสร็จสิ้น",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("ไม่สามารถลบข้อมูลนักศึกษาได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const confirmDeleteStudent = (id: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        void handleDelete(id);
        setConfirmModal(null);
      },
    });
  };

  const handleResetSearch = () => {
    form.reset({ search: "" });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("search", watchedSearch);
        params.set("page", "1");
      } else {
        params.delete("search");
      }
      const nextSearch = params.toString();
      if (searchParams.toString() !== nextSearch) {
        router.push(`${pathname}?${nextSearch}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [watchedSearch, pathname, router, searchParams]);

  return {
    form,
    control: form.control,
    watchedSearch,
    handleResetSearch,
    handleNextPage,
    handleSort,
    confirmDeleteStudent,
    confirmModal,
    errorMessage,
    isDeletePending: deleteStudent.isPending,
    handleCloseError: () => setErrorMessage(""),
  };
}
