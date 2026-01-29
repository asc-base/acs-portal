import React from "react";
import StudentsListComponent from "./students.list.component";
import { studentService, classBookService } from "@/infra/container";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    classBookId?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { rows, pageSize, page, totalRecords } =
    await studentService.getStudents({
      page: resolvedSearchParams.page || 1,
      pageSize: resolvedSearchParams.pageSize || 10,
      classBookId: resolvedSearchParams.classBookId || 1,
      sortBy: resolvedSearchParams.sortBy || "studentId",
      sortOrder: resolvedSearchParams.sortOrder || "asc",
    });

  const classBook = await classBookService.getClassBookById(
    resolvedSearchParams.classBookId || 1,
  );

  return (
    <StudentsListComponent
      students={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      classBookId={resolvedSearchParams.classBookId || 1}
      classBook={classBook}
    />
  );
};

export default page;
