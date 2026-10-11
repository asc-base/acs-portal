"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeleteNews } from "@/features/news/client";
import { NewsSearch, NewsSearchSchema } from "@/features/news/schema/news";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

export function useNewsListController() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deleteMutation = useDeleteNews();
  const [category, setCategory] = useState("all");
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const { control, reset, watch } = useForm<NewsSearch>({
    resolver: zodResolver(NewsSearchSchema),
    defaultValues: { search: "" },
  });
  const watchedSearch = watch("search");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("search", watchedSearch);
        params.set("searchBy", "title");
        params.set("page", "1");
      } else {
        params.delete("search");
        params.delete("searchBy");
      }
      const next = params.toString();
      if (searchParams.toString() !== next) {
        router.push(`${pathname}?${next}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [pathname, router, searchParams, watchedSearch]);

  const handleNextPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleFilterCategory = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tagID");
    else params.set("tagID", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const onDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
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

  return {
    control,
    category,
    watchedSearch,
    confirmModal,
    resetSearch: () => reset({ search: "" }),
    handleFilterCategory,
    handleNextPage,
    confirmDeleteNews: (id: number) =>
      setConfirmModal({
        isOpen: true,
        type: "delete",
        onClose: () => setConfirmModal(null),
        onConfirm: () => onDelete(id),
      }),
    isDeleteError: deleteMutation.isError,
    clearDeleteError: deleteMutation.reset,
  };
}
