"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminCard } from "@/components/adminCard";
import { RHFTextField } from "@/components/form/RHFTextField";
import { ICurriculum } from "@/core/domain/curriculum";

interface CurriculumListComponentsProps {
  curriculums: ICurriculum[];
  totalRecords: number;
  pageSize: number;
  page: number;
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
}: CurriculumListComponentsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("search", watchedSearch);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      const newSearch = params.toString();
      router.replace(`${pathname}?${newSearch}`, { scroll: false });
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [pathname, router, searchParams, watchedSearch]);

  return (
    <div className="min-h-screen px-8 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">จัดการหลักสูตร</h3>

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
            <Button variant="contained">
              <AddIcon />
              เพิ่มข้อมูลใหม่
            </Button>{" "}
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-10">
        <div className="grid w-full grid-cols-3 justify-items-center gap-6">
          {curriculums.map((curriculum) => (
            <AdminCard
              key={curriculum.id}
              type="curriculum"
              data={curriculum}
              onEdit={() =>
                router.push(`/admin/curriculum/edit/${curriculum.id}`)
              }
              onView={() =>
                router.push(
                  `/admin/courses?prerequisite=false&page=1&pageSize=10&curriculumId=${curriculum.id}`,
                )
              }
              onDelete={() => console.log("Delete succeed:", curriculum.id)}
            />
          ))}
        </div>

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

export default CurriculumListComponents;
