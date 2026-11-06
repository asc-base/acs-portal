import React from "react";
import StudentsListComponent from "@/features/students/components/public/students.list.component";
import { createStudentServerService } from "@/features/students/server";
import { createClassBookServerService } from "@/features/classbook/server";
import { QueryStudentSchema } from "@/features/students/schema/student";
import type { QueryStudentInput } from "@/features/students/schema/student";



export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryStudentInput>;
}

const page = async ({ searchParams }: PageProps) => {
  const studentService = await createStudentServerService();
  const classBookService = await createClassBookServerService();

  const resolvedSearchParams = await searchParams;
  const query = QueryStudentSchema.parse({
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 10,
    classBookID: resolvedSearchParams.classBookID || 1,
    orderBy: resolvedSearchParams.orderBy || "studentCode",
    sortBy: resolvedSearchParams.sortBy || "asc",
  });
  const { rows, pageSize, page, totalRecords } =
    await studentService.getStudents(query);

  const classBook = await classBookService.getClassBookById(
    query.classBookID ?? 1,
  );

  return (
    <StudentsListComponent
      students={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      classBookId={query.classBookID ?? 1}
      classBook={classBook}
    />
  );
};

export default page;
