"use client";
import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentTableComponents from "./students.table.component";
import { IStudent } from "@/core/domain/student";
import { IClassBook } from "@/core/domain/classbook";
import { QueryStudent } from "@/core/domain/student";

interface StudentsLandingPageProps {
  students: IStudent[];
  totalRecords: number;
  pageSize: number;
  page: number;
  classBookId: number;
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
  classBookId,
  search,
  sortBy,
  sortOrder,
}: StudentsLandingPageProps) => {
  const router = useRouter();

  const { register, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });

  const watchedSearch = watch("search");

  const SearchStudentUrl = useCallback(
    (query: Partial<QueryStudent>) => {
      const params = new URLSearchParams({
        page: query.page?.toString() || page.toString(),
        pageSize: query.pageSize?.toString() || pageSize.toString(),
        classBookId: query.classBookId?.toString() || classBookId.toString(),
        search: query.search ?? watchedSearch ?? "",
        sortBy: query.sortBy ?? sortBy ?? "studentId",
        sortOrder: query.sortOrder ?? sortOrder ?? "desc",
      });

      return `/admin/students?${params.toString()}`;
    },
    [page, pageSize, classBookId, watchedSearch, sortBy, sortOrder],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(SearchStudentUrl({ page: 1, search: watchedSearch }));
    }, 300);

    return () => clearTimeout(handler);
  }, [SearchStudentUrl, router, watchedSearch]);

  const handleNextPage = (currentPage: number) => {
    router.push(SearchStudentUrl({ page: currentPage }));
  };

  const handleSort = (newSortBy: string) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    router.push(
      SearchStudentUrl({ sortBy: newSortBy, sortOrder: newSortOrder }),
    );
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">
          ข้อมูลนักศึกษา <span>{`>> รุ่นที่ ${classBook?.classof}`}</span>
        </h3>
        <div className="flex gap-2">
          <form className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา"
              {...register("search")}
              className="border-neutral04 text-h4 h-[44px] w-[280px] rounded-sm border pl-10"
            />
            <button
              type="button"
              onClick={() => reset({ search: "" })}
              disabled={!watchedSearch}
              className={`text-neutral05 absolute top-1/2 right-2 -translate-y-1/2 ${
                !watchedSearch
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-primary01 cursor-pointer"
              }`}
            >
              <CloseIcon fontSize="small" />
            </button>
          </form>
        </div>
      </div>

      <StudentTableComponents
        students={students}
        onSort={handleSort}
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
