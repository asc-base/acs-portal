"use client";

import React, { useEffect, useCallback, useMemo, useState } from "react";
import { IProfessor } from "@/core/domain/professor";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Pagination, Button, Alert, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfessorTableComponent from "./professors.table.component";
import { ProfessorService } from "@/core/service/professor.service";
import { ProfessorRepository } from "@/infra/repositories/professor.repository";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";

interface ProfessorLandingProps {
  professor: IProfessor[];
  totalRecords: number;
  pageSize: number;
  page: number;
  apiBase: string;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const ProfessorLandingpage = ({
  professor,
  totalRecords,
  pageSize,
  page,
  apiBase,
}: ProfessorLandingProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);

  const professorService = useMemo(() => {
    const professorRepository = new ProfessorRepository(apiBase);
    return new ProfessorService(professorRepository);
  }, [apiBase]);

  const { register, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: searchParams.get("search") || "",
    },
  });

  const watchedSearch = watch("search");

  const handleResetSearch = () => {
    reset({ search: "" });
  };

  const handleNextPage = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const onDeleteProfessor = async (professorID: number) => {
    try {
      const response = await professorService.deleteProfessor(professorID);

      if (response) {
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
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const confirmDeleteProfessor = (professorID: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),

      onConfirm: () => {
        onDeleteProfessor(professorID);
      },
    });
  };

  const handleCloseAlert = () => {
    setIsError(false);
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

  const handleClickAddProfessor = () => {
    router.push(`/admin/professors/create`);
  };

  return (
    <div className="flex h-screen flex-col p-4">
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
          ไม่สามารถลบข้อมูลอาจารย์ได้
        </Alert>
      </Snackbar>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">ข้อมูลอาจารย์</h3>

        <div className="flex gap-2">
          <div className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>

            <input
              type="text"
              placeholder="ค้นหา"
              {...register("search")}
              className="border-neutral04 text-h4 h-[44px] w-[280px] rounded-sm border pl-10"
            />

            {watchedSearch && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>

          <Button
            onClick={handleClickAddProfessor}
            variant="contained"
            sx={{
              backgroundColor: "var(--color-primary02)",
              color: "var(--color-neutral01)",
              px: 2,
              height: "44px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": { backgroundColor: "var(--color-primary03)" },
            }}
          >
            <AddIcon />
            เพิ่มอาจารย์ใหม่
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <ProfessorTableComponent
          professor={professor}
          onDeleteProfessor={confirmDeleteProfessor}
        />
      </div>

      {totalRecords > 0 && (
        <div className="mt-auto flex justify-center py-4">
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

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default ProfessorLandingpage;
