"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Pagination} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentTableComponents from "./students.table.component";
import { IStudent } from "@/core/domain/student";
import { IClassBook } from "@/core/domain/classbook";

interface StudentsLandindPageProps {
  students: IStudent[];
  totalRecords: number;
  pageSize: number;
  page: number;
  classBookId: number;
  classBook: IClassBook | null;
}

const searchSchema = z.object({
  query: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const StudentsLandingpage = ({
  students,
  totalRecords,
  pageSize,
  page,
  classBook,
  classBookId
}: StudentsLandindPageProps) => {
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchForm) => {
    console.log("Search:", data.query);
    reset();
  };

  const handleNextPage = (currentPage: number) => {
    router.push(
      `/admin/students?page=${currentPage}&pageSize=${pageSize}classBookId=${classBookId}`,
    );
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">
          ข้อมูลนักศึกษา <span>{`>> รุ่นที่ ${classBook?.classof}`}</span>
        </h3>
        <div className="flex gap-2">
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา"
              {...register("query")}
              className="border-neutral04 text-h4 h-[44px] w-[280px] rounded-sm border pl-10"
            />
            <button
              type="button"
              onClick={() => reset()}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <CloseIcon fontSize="small" />
            </button>
          </form>
        </div>
      </div>
      <StudentTableComponents students={students} />
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
