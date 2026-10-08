import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useDeleteProject } from "@/features/projects/client";
import { ProjectSearchSchema } from "@/features/projects/schema/project";
import type { ProjectSearch, QueryProjectInput } from "@/features/projects/schema/project";

export function useProjectListController({
  page,
  pageSize,
  sortOrder,
  search,
}: {
  page: number;
  pageSize: number;
  sortOrder?: string;
  search?: string;
}) {
  const router = useRouter();
  const deleteProject = useDeleteProject();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [isError, setIsError] = useState(false);
  const form = useForm<ProjectSearch>({
    resolver: zodResolver(ProjectSearchSchema),
    defaultValues: { search },
  });
  const watchedSearch = form.watch("search");

  const searchProjectUrl = useCallback(
    (query: Partial<QueryProjectInput>) => {
      const params = new URLSearchParams({
        page: (query.page ?? page ?? 1).toString(),
        pageSize: (query.pageSize ?? pageSize ?? 10).toString(),
        sortBy: "createdAt",
        sortOrder: query.sortOrder ?? sortOrder ?? "desc",
        search: query.search ?? watchedSearch ?? "",
      });
      return `/admin/projects?${params.toString()}`;
    },
    [page, pageSize, sortOrder, watchedSearch],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(searchProjectUrl({ page: 1, search: watchedSearch }));
    }, 300);
    return () => clearTimeout(handler);
  }, [watchedSearch, searchProjectUrl, router]);

  const onDelete = async (id: number) => {
    try {
      await deleteProject.mutateAsync(id);
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
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const confirmDeleteProject = (id: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => { void onDelete(id); },
    });
  };

  return {
    form,
    watchedSearch,
    confirmModal,
    isError,
    setIsError,
    handleSortOrder: (order: "asc" | "desc") => router.push(searchProjectUrl({ sortOrder: order })),
    handleNextPage: (currentPage: number) => router.push(searchProjectUrl({ page: currentPage })),
    confirmDeleteProject,
  };
}
