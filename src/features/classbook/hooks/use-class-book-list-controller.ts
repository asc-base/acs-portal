import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeleteClassBook } from "@/features/classbook/client";
import { ClassBookQuerySchema } from "@/features/classbook/schema/classbook";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

const searchSchema = ClassBookQuerySchema.pick({ search: true });
type SearchForm = { search?: string };

export function useClassBookListController(search?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deleteClassBook = useDeleteClassBook();
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });
  const watchedSearch = form.watch("search");

  const handleResetSearch = () => form.reset({ search: "" });

  const handleNextPage = (currentPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleViewClassbook = (id: number) =>
    router.push(`/admin/students?page=1&pageSize=10&classBookID=${id}`);

  const handleSortOrder = (sortBy: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orderBy", "createdAt");
    params.set("sortBy", sortBy);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClassBook.mutateAsync(id);
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
      setIsError(true);
    }
  };

  const confirmDeleteClassbook = (id: number) => {
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
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
    return () => clearTimeout(delayDebounce);
  }, [pathname, router, searchParams, watchedSearch]);

  return {
    form,
    watchedSearch,
    isError,
    confirmModal,
    isPending: deleteClassBook.isPending,
    handleResetSearch,
    handleNextPage,
    handleViewClassbook,
    handleSortOrder,
    handleDelete,
    confirmDeleteClassbook,
    handleCloseAlert: () => setIsError(false),
  };
}
