"use client";
import React, { useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SelectChangeEvent } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CourseTableComponents from "./courses.table.component";
import { ICourse } from "@/core/domain/course";
import { TypeCourse } from "@/core/domain/master-data";
import { ICurriculum } from "@/core/domain/curriculum";
import { CurriculumInfoComponent } from "./curriculum.info.component";

interface CoursesLandingPageProps {
  courses: ICourse[];
  totalRecords: number;
  pageSize: number;
  page: number;
  curriculumId: number;
  typeCourses: TypeCourse[];
  typecourseId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  curriculum: ICurriculum;
  apiBase: string;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

export type SearchForm = z.infer<typeof searchSchema>;

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
  apiBase,
  curriculum,
}: CoursesLandingPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    control: searchControl,
    reset: searchReset,
    watch,
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });

  const watchedSearch = watch("search");

  const handleResetSearch = () => {
    searchReset({ search: "" });
  };

  const handleNextPage = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

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

  const handleSort = (sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentSortBy = params.get("sortBy");
    const currentOrder = params.get("sortOrder") as "asc" | "desc" | null;
    const newOrder =
      currentSortBy === sortBy && currentOrder === "desc" ? "asc" : "desc";

    params.set("sortBy", sortBy);
    params.set("sortOrder", newOrder);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterTypeCourse = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("typecourseId");
    } else {
      params.set("typecourseId", value);
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-6">
        <h3 className="font-bold">
          {" "}
          จัดการหลักสูตร <span>{`>> ปีการศึกษา ${curriculum.year}`}</span>{" "}
        </h3>

        <CurriculumInfoComponent curriculum={curriculum} apiBase={apiBase} />

        <CourseTableComponents
          courses={courses}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          control={searchControl}
          watchedSearch={watchedSearch}
          onResetSearch={handleResetSearch}
          curriculumId={curriculumId}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          handleNextPage={handleNextPage}
          typeCourses={typeCourses}
          typecourseId={typecourseId}
          handleFilterTypeCourse={handleFilterTypeCourse}
          apiBase={apiBase}
        />
      </div>
    </div>
  );
};

export default CoursesLandingpage;
