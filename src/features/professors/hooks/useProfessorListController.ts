"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useDeleteProfessor } from "@/features/professors/client";
import {
  ProfessorSearch,
  ProfessorSearchSchema,
} from "@/features/professors/schema/professor";

export function useProfessorListController() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deleteMutation = useDeleteProfessor();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const { register, reset, watch } = useForm<ProfessorSearch>({
    resolver: zodResolver(ProfessorSearchSchema),
    defaultValues: { search: searchParams.get("search") || "" },
  });
  const watchedSearch = watch("search");

  const handleNextPage = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const onDeleteProfessor = async (professorId: number) => {
    try {
      await deleteMutation.mutateAsync(professorId);
    } catch {
      // The mutation state drives the existing error alert.
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: "success",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        setConfirmModal(null);
        router.refresh();
      },
      title: "ลบข้อมูลสำเร็จ",
      description: "ข้อมูลถูกลบออกจากฐานข้อมูลแล้ว",
      confirmText: "เสร็จสิ้น",
    });
  };

  const confirmDeleteProfessor = (professorId: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => onDeleteProfessor(professorId),
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("search", watchedSearch);
        params.set("searchBy", "firstNameTh");
        params.set("page", "1");
      } else {
        params.delete("search");
        params.delete("searchBy");
        params.set("page", "1");
      }
      const newSearch = params.toString();
      if (searchParams.toString() !== newSearch) {
        router.push(`${pathname}?${newSearch}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [watchedSearch, pathname, router, searchParams]);

  return {
    register,
    watchedSearch,
    resetSearch: () => reset({ search: "" }),
    handleNextPage,
    confirmDeleteProfessor,
    confirmModal,
    isDeleteError: deleteMutation.isError,
    clearDeleteError: deleteMutation.reset,
  };
}
