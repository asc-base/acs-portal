"use client";
import { AdminCard } from "@/components/adminCard";
import { IClassBook } from "@/core/domain/classbook";
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
import { useCallback, useEffect } from "react";
import Link from "next/link";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    <div className="min-h-screen px-8 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">ข้อมูลนักศึกษา</h3>

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

          <Link href="/admin/classbook/create">
            <Button variant="contained">
              <AddIcon />
              เพิ่มรุ่นนักศึกษา
            </Button>
          </Link>
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
