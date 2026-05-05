"use client";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button, Pagination, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminCard } from "@/components/adminCard";
import { RHFTextField } from "@/components/form/RHFTextField";
import { ICurriculum } from "@/core/domain/curriculum";
import { CurriculumRepository } from "@/infra/repositories/curriculum.repository";
import { CurriculumService } from "@/core/service/curriculum.service";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";

interface CurriculumListComponentsProps {
  curriculums: ICurriculum[];
  totalRecords: number;
  pageSize: number;
  page: number;
  apiBase: string;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const CurriculumListComponents = ({
  curriculums,
  totalRecords,
  pageSize,
  page,
  apiBase,
}: CurriculumListComponentsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const curriculumService = useMemo(() => {
    const repo = new CurriculumRepository(apiBase);
    return new CurriculumService(repo);
  }, [apiBase]);

  const { control, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });

  const watchedSearch = watch("search");

  const handleResetSearch = () => {
    reset({ search: "" });
  };

  const handleNextPage = (currentPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    const newSearch = params.toString();
    router.push(`${pathname}?${newSearch}`);
  };

  const confirmDeleteCurriculum = (curriculumId: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        handleDelete(curriculumId);
        setConfirmModal(null);
      },
    });
  };

  const handleDelete = async (curriculumId: number) => {
    try {
      const reps = await curriculumService.deleteCurriculum(curriculumId);
      if (!reps) {
        setIsError(true);
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
        description: "ข้อมูลถูกลบออกจากระบบแล้ว",
        confirmText: "เสร็จสิ้น",
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const handleCloseAlert = () => {
    setIsError(false);
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
  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
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
          ไม่สามารถลบหลักสูตรได้
        </Alert>
      </Snackbar>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold">จัดการหลักสูตร</h3>

        <div className="flex items-center gap-4">
          <RHFTextField
            name="search"
            control={control}
            startIcon={<SearchIcon />}
            endIcon={
              watchedSearch ? (
                <CloseIcon onClick={handleResetSearch} />
              ) : (
                <span style={{ width: "24px" }} />
              )
            }
            placeholder="ค้นหาหลักสูตร (ปี)"
            size="small"
          />

          <Link href="/admin/curriculum/create">
            <Button variant="contained" size="large">
              <AddIcon />
              เพิ่มข้อมูลใหม่
            </Button>{" "}
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center">
        <div className="grid w-full grid-cols-3 justify-items-center gap-6">
          {curriculums.map((curriculum) => (
            <AdminCard
              key={curriculum.id}
              type="curriculum"
              data={curriculum}
              onView={() =>
                router.push(
                  `/admin/courses?prerequisite=false&page=1&pageSize=10&curriculumID=${curriculum.id}`,
                )
              }
              onDelete={() => confirmDeleteCurriculum(curriculum.id)}
            />
          ))}
        </div>

        {totalRecords > 0 && (
          <div className="mt-auto pt-10">
            <Pagination
              shape="rounded"
              count={Math.ceil(totalRecords / pageSize)}
              page={page}
              onChange={(_, currentPage) => handleNextPage(currentPage)}
              color="primary"
              size="large"
            />
          </div>
        )}
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default CurriculumListComponents;
