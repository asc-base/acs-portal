import React from "react";
import StudentsListComponent from "./students.list.component";
import { studentService, classBookService } from "@/infra/container";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    classBookID?: number;
    orderBy?: string;
    sortBy?: "asc" | "desc";
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { rows, pageSize, page, totalRecords } =
    await studentService.getStudents({
      page: resolvedSearchParams.page || 1,
      pageSize: resolvedSearchParams.pageSize || 10,
      classBookID: resolvedSearchParams.classBookID || 1,
      orderBy: resolvedSearchParams.orderBy || "studentCode",
      sortBy: resolvedSearchParams.sortBy || "asc",
    });

  const classBook = await classBookService.getClassBookById(
    resolvedSearchParams.classBookID || 1,
  );

  return (
    <StudentsListComponent
      students={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      classBookId={resolvedSearchParams.classBookID || 1}
      classBook={classBook}
    />
  );
};

export default page;
