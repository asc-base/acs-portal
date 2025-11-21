"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MenuItem, Select, SelectChangeEvent, Button, Pagination, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CourseTableComponents from "./courses.table.component";
import { ICourse } from "@/core/domain/course";
import { QueryCourse } from "@/core/domain/course";
import { TypeCourse } from "@/core/domain/master-data";

interface CoursesLandingPageProps {
  courses: ICourse[];
  totalRecords: number;
  pageSize: number;
  page: number;
  curriculumId: number;
  typeCourses: TypeCourse[],
  typecourseId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const CoursesLandingpage = ({
  courses,
  totalRecords,
  pageSize,
  curriculumId,
  typeCourses,
  typecourseId,
  page,
  search,
  sortBy,
  sortOrder,
}: CoursesLandingPageProps) => {
  const router = useRouter();

  const { register, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });

  const watchedSearch = watch("search");

  const SearchCourseUrl = (query: Partial<QueryCourse>) => {
    const params = new URLSearchParams({
      page: query.page?.toString() || page.toString(),
      pageSize: query.pageSize?.toString() || pageSize.toString(),
      curriculumId: (query.curriculumId ?? curriculumId).toString(),
      search: query.search ?? watchedSearch ?? "",
      sortBy: query.sortBy ?? sortBy ?? "courseId",
      sortOrder: query.sortOrder ?? sortOrder ?? "desc",
    });

    if (query.typecourseId !== undefined) {
      params.set("typecourseId", query.typecourseId.toString());
    }

    return `/admin/courses?${params.toString()}`;
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(SearchCourseUrl({ page: 1, search: watchedSearch }));
    }, 300);

    return () => clearTimeout(handler);
  }, [watchedSearch]);

  const handleNextPage = (currentPage: number) => {
    router.push(SearchCourseUrl({ page: currentPage }));
  };

  const handleSort = (newSortBy: string) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    router.push(
      SearchCourseUrl({ sortBy: newSortBy, sortOrder: newSortOrder }),
    );
  };

  const handleClickAddCourse = () => {
    router.push("/admin/courses/create");
  };

  const handleFilterTypeCourse = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const typecourseId = value === "all" ? undefined : Number(value);
    router.push(SearchCourseUrl({ page: 1, typecourseId }));
  };


  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">ข้อมูลรายวิชา</h3>
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
              className={`absolute right-2 top-1/2 -translate-y-1/2 text-neutral05 ${!watchedSearch
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:text-primary01"
                }`}
            >
              <CloseIcon fontSize="small" />
            </button>
          </form>

          <Select
            onChange={handleFilterTypeCourse}
            value={(typecourseId ?? "all").toString()}
            size="small"
            displayEmpty
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--color-neutral04)",
              },
              py: 1,
              width: "260px",
              height: "44px",
              color: "var(--color-neutral04)",
            }}
            IconComponent={ExpandMoreIcon}
            MenuProps={{
              PaperProps: {
                sx: {
                  border: "1px solid var(--color-neutral04)",
                  borderRadius: 1,
                },
              },
              MenuListProps: {
                sx: { py: 0 },
              },
            }}
          >
            <MenuItem
              value="all"
              sx={{
                py: 1,
                color: "var(--color-neutral04)",
                borderBottom: "1px solid var(--color-neutral04)",
              }}
            >
              ทั้งหมด

            </MenuItem>

            {typeCourses.map((typeCourse) => (
              <MenuItem
                key={typeCourse.id}
                value={typeCourse.id.toString()}
                sx={{
                  py: 1,
                  color: "var(--color-neutral04)",
                  borderBottom: "1px solid var(--color-neutral04)",
                }}
              >
                {typeCourse.name}
              </MenuItem>
            ))}

          </Select>

          <Button
            onClick={handleClickAddCourse}
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
            เพิ่มรายวิชาใหม่
          </Button>

        </div>
      </div>

      <CourseTableComponents
        courses={courses}
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

export default CoursesLandingpage;