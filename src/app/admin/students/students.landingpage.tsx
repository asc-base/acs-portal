"use client";
import { useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentTableComponents from "./students.table.component";
import { IStudent } from "@/core/domain/student";
import { ClassBookInfoComponent } from "@/app/admin/students/classbook.info.component";
import { IClassBook } from "@/core/domain/classbook";
interface StudentsLandingPageProps {
  students: IStudent[];
  totalRecords: number;
  pageSize: number;
  page: number;
  classBookId: number;
  classBook: IClassBook;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
  apiBase: string;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

export type SearchForm = z.infer<typeof searchSchema>;

const StudentsLandingpage = ({
  students,
  totalRecords,
  pageSize,
  page,
  classBookId,
  classBook,
  search,
  sortBy,
  orderBy,
  apiBase,
}: StudentsLandingPageProps) => {
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

  const handleSort = (orderBy: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentOrderBy = params.get("orderBy");
    const currentSortBy = params.get("sortBy") as "asc" | "desc" | null;
    const newOrder =
      currentOrderBy === orderBy && currentSortBy === "desc" ? "asc" : "desc";

    params.set("orderBy", orderBy);
    params.set("sortBy", newOrder);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-6">
        <h3 className="font-bold">
          ข้อมูลนักศึกษา <span>{`>> รุ่นที่ ${classBook?.classof}`}</span>
        </h3>

        <ClassBookInfoComponent classBook={classBook} apiBase={apiBase} />

        <StudentTableComponents
          students={students}
          onSort={handleSort}
          orderBy={orderBy}
          sortBy={sortBy}
          control={searchControl}
          watchedSearch={watchedSearch}
          onResetSearch={handleResetSearch}
          totalRecords={totalRecords}
          classBookId={classBookId}
          page={page}
          pageSize={pageSize}
          handleNextPage={handleNextPage}
          apiBase={apiBase}
        />
      </div>
    </div>
  );
};

export default StudentsLandingpage;
