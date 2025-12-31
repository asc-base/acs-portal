"use client";
import React, { useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentTableComponents from "./students.table.component";
import { IStudent } from "@/core/domain/student";
import { IClassBook } from "@/core/domain/classbook";
import { RHFTextField } from "@/components/form/RHFTextField";

interface StudentsLandingPageProps {
  students: IStudent[];
  totalRecords: number;
  pageSize: number;
  page: number;
  classBook: IClassBook;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const StudentsLandingpage = ({
  students,
  totalRecords,
  pageSize,
  page,
  classBook,
  search,
  sortBy,
  sortOrder,
}: StudentsLandingPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { control, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });

  const watchedSearch = watch("search");

  const handleResetSearch = () => {
    reset({ search: "" });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNextPage = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleSortOrder = (event: string) => {
    const newSortOrder = event as "asc" | "desc";
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortOrder", newSortOrder);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("search", watchedSearch);
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
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">
          ข้อมูลนักศึกษา <span>{`>> รุ่นที่ ${classBook?.classof}`}</span>
        </h3>
        <div className="flex gap-2">
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
        </div>
      </div>

      <StudentTableComponents
        students={students}
        onSort={handleSortOrder}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      <div className="mt-4 flex justify-center">
        <Pagination
          shape="rounded"
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={(_, currentPage) => handleNextPage(currentPage)}
          color="primary"
          size="large"
        />
      </div>
    </div>
  );
};

export default StudentsLandingpage;
