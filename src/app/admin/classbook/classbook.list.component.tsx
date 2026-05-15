"use client";
import { AdminCard } from "@/components/adminCard";
import { IClassBook } from "@/core/domain/classbook";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ClassBookRepository } from "@/infra/repositories/class-book.repository";
import { ClassBookService } from "@/core/service/class-book.service";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";

interface ClassBookListComponentsProps {
  classbooks: IClassBook[];
  totalRecords: number;
  pageSize: number;
  page: number;
  sortBy?: string;
  search?: string;
  apiBase: string;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const ClassBookListComponents = ({
  classbooks,
  totalRecords,
  pageSize,
  page,
  sortBy,
  search,
  apiBase,
}: ClassBookListComponentsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const { control, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });

  const handleResetSearch = () => {
    reset({ search: "" });
  };

  const handleNextPage = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const watchedSearch = watch("search");

  const handleSortOrder = (event: SelectChangeEvent) => {
    const newSortOrder = event.target.value as "asc" | "desc";
    const params = new URLSearchParams(searchParams.toString());
    params.set("orderBy", "createdAt");
    params.set("sortBy", newSortOrder);
    router.push(`${pathname}?${params.toString()}`);
  };

  const classBookService = useMemo(() => {
    const classBookRepository = new ClassBookRepository(apiBase);
    return new ClassBookService(classBookRepository);
  }, [apiBase]);

  const confirmDeleteClassbook = (id: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        deleteClassbook(id);
        setConfirmModal(null);
      },
    });
  };

  const deleteClassbook = async (id: number) => {
    try {
      const reps = await classBookService.deleteClassBook(id);
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
          ไม่สามารถลบรุ่นการศึกษาได้
        </Alert>
      </Snackbar>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold">ข้อมูลนักศึกษา</h3>

        <div className="flex items-center gap-3">
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
            placeholder="ค้นหารุ่นนักศึกษา"
            size="small"
          />

          <Select
            onChange={handleSortOrder}
            size="small"
            value={sortBy ?? "desc"}
            displayEmpty
            sx={{ width: 200 }}
            IconComponent={ExpandMoreIcon}
          >
            <MenuItem
              value="desc"
            >
              ใหม่สุดไปเก่าสุด
              {sortBy === "desc"}
            </MenuItem>

            <MenuItem
              value="asc"
            >
              เก่าสุดไปใหม่สุด
              {sortBy === "asc"}
            </MenuItem>
          </Select>

          <Link href="/admin/classbook/create">
            <Button variant="contained" size="large">
              <AddIcon />
              เพิ่มรุ่นนักศึกษา
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center">
        <div className="grid w-full grid-cols-3 justify-items-center gap-6">
          {classbooks.map((classbook) => (
            <AdminCard
              key={classbook.id}
              type="classBook"
              data={classbook}
              onView={() =>
                router.push(
                  `/admin/students?page=1&pageSize=10&classBookID=${classbook.id}`,
                )
              }
              onDelete={() => confirmDeleteClassbook(classbook.id)}
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

export default ClassBookListComponents;
