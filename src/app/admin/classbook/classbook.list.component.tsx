"use client";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/adminCard";
import { IClassBook, QueryClassBook } from "@/core/domain/classbook";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useCallback } from "react";

interface ClassBookListComponentsProps {
  classbooks: IClassBook[];
  totalRecords: number;
  pageSize: number;
  page: number;
  sortOrder?: string;
  search?: string;
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
  sortOrder,
  search,
}: ClassBookListComponentsProps) => {
  const router = useRouter();

  const { register, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });

  const watchedSearch = watch("search");

  const SearchClassBookUrl = useCallback(
    (query: Partial<QueryClassBook>) => {
      const searchClassOf = (query.search ?? watchedSearch ?? "").replace(
        /\D/g,
        "",
      );

      const params = new URLSearchParams({
        page: query.page?.toString() || page.toString(),
        pageSize: query.pageSize?.toString() || pageSize.toString(),
        sortBy: "createdAt",
        sortOrder: query.sortOrder ?? sortOrder ?? "desc",
        search: searchClassOf,
      });
      return `/admin/classbook?${params.toString()}`;
    },
    [page, pageSize, sortOrder, watchedSearch],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(SearchClassBookUrl({ page: 1, search: watchedSearch }));
    }, 300);

    return () => clearTimeout(handler);
  }, [watchedSearch, SearchClassBookUrl, router]);

  const handleSortOrder = (event: SelectChangeEvent) => {
    const newSortOrder = event.target.value as "asc" | "desc";
    router.push(SearchClassBookUrl({ sortOrder: newSortOrder }));
  };

  const handleClickAddClassBook = () => {
    router.push("/admin/classbook/create");
  };

  const handleNextPage = (currentPage: number) => {
    router.push(SearchClassBookUrl({ page: currentPage }));
  };

  return (
    <div className="min-h-screen px-8 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">ข้อมูลนักศึกษา</h3>

        <div className="flex items-center gap-3">
          <form className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหารุ่น"
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

          <Select
            onChange={handleSortOrder}
            size="small"
            value={sortOrder ?? "desc"}
            displayEmpty
            renderValue={() => "จัดเรียงตาม"}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--color-neutral04)",
              },
              py: 0.5,
              width: "180px",
              height: "44px",
              color: "var(--color-neutral04)",
            }}
            IconComponent={ExpandMoreIcon}
            MenuProps={{
              MenuListProps: {
                sx: { py: 0 },
              },
            }}
          >
            <MenuItem
              value="desc"
              sx={{
                color: "var(--color-neutral04)",
                borderRadius: 1,
                border: "1px solid var(--color-neutral04)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              ใหม่สุดไปเก่าสุด
              {sortOrder === "desc" && <DoneIcon fontSize="small" />}
            </MenuItem>

            <MenuItem
              value="asc"
              sx={{
                color: "var(--color-neutral04)",
                borderRadius: 1,
                border: "1px solid var(--color-neutral04)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              เก่าสุดไปใหม่สุด
              {sortOrder === "asc" && <DoneIcon fontSize="small" />}
            </MenuItem>
          </Select>

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
            เพิ่มรุ่นนักศึกษา
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-10">
        <div className="grid w-full grid-cols-3 justify-items-center gap-6">
          {classbooks.map((classbook) => (
            <AdminCard
              key={classbook.id}
              type="classBook"
              data={classbook}
              onEdit={() => router.push(`/admin/students/edit/${classbook.id}`)}
              onView={() =>
                router.push(
                  `/admin/students?page=1&pageSize=10&classBookId=${classbook.id}`,
                )
              }
              onDelete={() => console.log("Delete succeed:", classbook.id)}
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

export default ClassBookListComponents;
