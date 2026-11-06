import StudentsLandingpage from "@/features/students/components/admin/students.landingpage";

import { QueryStudentSchema } from "@/features/students/schema/student";
import type { QueryStudentInput } from "@/features/students/schema/student";
import { createStudentServerService } from "@/features/students/server";
import { createClassBookServerService } from "@/features/classbook/server";



export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryStudentInput>;
}

const page = async ({ searchParams }: PageProps) => {
  const studentService = await createStudentServerService();
  const classBookService = await createClassBookServerService();

  const search = await searchParams;

  const query = QueryStudentSchema.parse({
    page: search.page || 1,
    pageSize: 5,
    classBookID: search.classBookID || 1,
    search: search.search ?? "",
    orderBy: search.orderBy ?? "studentCode",
    sortBy: search.sortBy || "asc",
  });
  const { rows, pageSize, page, totalRecords } =
    await studentService.getStudents(query);

  const classBook = await classBookService.getClassBookById(
    query.classBookID ?? 1,
  );

  if (!classBook) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="font-bold">No class book information</h2>
      </div>
    );
  }

  return (
    <StudentsLandingpage
      students={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      classBookID={query.classBookID ?? 1}
      sortBy={query.sortBy}
      orderBy={query.orderBy}
      classBook={classBook}
    />
  );
};

export default page;
