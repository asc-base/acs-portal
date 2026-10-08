import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeleteCurriculum } from "@/features/curriculum/client";
import { QueryCurriculumSchema } from "@/features/curriculum/schema/curriculum";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

const searchSchema = QueryCurriculumSchema.pick({ year: true });
type SearchForm = { year?: string };

export function useCurriculumListController() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deleteCurriculum = useDeleteCurriculum();
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { year: "" },
  });
  const watchedSearch = form.watch("year");

  const handleResetSearch = () => form.reset({ year: "" });

  const handleNextPage = (currentPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (curriculumId: number) => {
    try {
      await deleteCurriculum.mutateAsync(curriculumId);
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

  const confirmDeleteCurriculum = (curriculumId: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        void handleDelete(curriculumId);
        setConfirmModal(null);
      },
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("year", watchedSearch);
        params.set("page", "1");
      } else {
        params.delete("year");
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
    isPending: deleteCurriculum.isPending,
    handleResetSearch,
    handleNextPage,
    handleDelete,
    confirmDeleteCurriculum,
    handleCloseAlert: () => setIsError(false),
  };
}
