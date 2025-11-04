"use client";
import React from "react";
import { IProfessor } from "@/core/domain/professor";
import { useRouter } from "next/navigation";
import { Pagination, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfessorTableComponent from "./professors.table.component";

interface ProfessorTableComponentsProps {
  professor: IProfessor[];
  totalRecords: number;
  pageSize: number;
  page: number;
}

const searchSchema = z.object({
  classOf: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const ProfessorLandingpage = ({
  professor,
  totalRecords,
  pageSize,
  page,
}: ProfessorTableComponentsProps) => {
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchForm) => {
    console.log("Search classOf:", data.classOf);
    reset();
  };

  const handleNextPage = (currentPage: number) => {
    router.push(
      `/admin/professors?page=${currentPage}&pageSize=${pageSize}&academicPosition=true`,
    );
  };

  const handleClickAddProfessor = () => {
    router.push(`/admin/professors/create`);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">ข้อมูลอาจารย์</h3>
        <div className="flex gap-2">
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา"
              {...register("classOf")}
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
      <ProfessorTableComponent professor={professor} />
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

export default ProfessorLandingpage;
