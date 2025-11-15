"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Pagination, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICurriculum } from "@/core/domain/curriculum";
import { CurriculumAdminCard } from "@/components/curriculumcardadmin";
import { QueryCurriculum } from "@/core/domain/curriculum";

interface CurriculumListComponentsProps {
  curriculums: ICurriculum[];
  totalRecords: number;
  pageSize: number;
  page: number;
  search?: string;
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
  search,
}: CurriculumListComponentsProps) => {
  const router = useRouter();

  const searchField = "search";
  const { register, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { [searchField]: search },
  });

  const watchedSearch = watch(searchField);

  const SearchCurriculumUrl = (query: Partial<QueryCurriculum>) => {
    const searchYear = (query.search ?? watchedSearch ?? "").replace(/\D/g, "");
    
    const params = new URLSearchParams({
      page: query.page?.toString() || page.toString(),
      pageSize: query.pageSize?.toString() || pageSize.toString(),
      search: searchYear,
    });

    return `/admin/curriculum?${params.toString()}`;
  };


  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(SearchCurriculumUrl({ page: 1, search: watchedSearch }));
    }, 300);

    return () => clearTimeout(handler);
  }, [watchedSearch]);


  const handleClickAddClassBook = () => {
    router.push(`/admin/curriculum/create`);
  };

  const handleNextPage = (currentPage: number) => {
    router.push(SearchCurriculumUrl({ page: currentPage }));
  };


  return (
    <div className="min-h-screen px-8 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-lg">จัดการหลักสูตร</h3>

        <div className="flex items-center gap-4">
          <form className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral04">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา"
              {...register(searchField)}
              className="border w-[280px] h-[44px] rounded-sm pl-10 border-neutral04 text-h4"
            />
              <button
                type="button"
                onClick={() => reset({ [searchField]: "" })}
                disabled={!watchedSearch}
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-neutral05 ${!watchedSearch ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-primary01"
                  }`}
              >
                <CloseIcon fontSize="small" />
              </button>
          </form>

          <Button
            onClick={handleClickAddClassBook}
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
            เพิ่มข้อมูลใหม่
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-10">
        <div className="grid w-full justify-items-center grid-cols-3 gap-6">
          {curriculums.map((curriculum) => (
            <CurriculumAdminCard
              key={curriculum.id}
              curriculum={curriculum}
              onEdit={() => router.push(`/admin/curriculum/edit/${curriculum.id}`)}
              onView={() => router.push(`/admin/course?page=1&pageSize=10&curriculumId=${curriculum.id}`)}
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
