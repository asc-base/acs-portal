import StudentsLandingpage from "@/features/students/components/admin/students.landingpage";

import { QueryStudent } from "@/features/students/domain/student";
import { createStudentServerService } from "@/features/students/server";
import { createClassBookServerService } from "@/features/classbook/server";



export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryStudent>;
}

const page = async ({ searchParams }: PageProps) => {
  const studentService = await createStudentServerService();
  const classBookService = await createClassBookServerService();

  const search = await searchParams;

  const query: QueryStudent = {
    page: search.page || 1,
    pageSize: 5,
    classBookID: search.classBookID || 1,
    search: search.search ?? "",
    orderBy: search.orderBy ?? "studentCode",
    sortBy: search.sortBy || "asc",
  };
  const { rows, pageSize, page, totalRecords } =
    await studentService.getStudents(query);

  const classBook = await classBookService.getClassBookById(
    search.classBookID || 1,
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
      classBookID={query.classBookID!}
      sortBy={query.sortBy}
      orderBy={query.orderBy}
      classBook={classBook}
    />
  );
};

export default page;
