import StudentsLandingpage from "./students.landingpage";
import { studentService } from "@/infra/container";
import { classBookService } from "@/infra/container";
import { QueryStudent } from "@/core/domain/student";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryStudent>;
}

const page = async ({ searchParams }: PageProps) => {
  const search = await searchParams;

  const query: QueryStudent = {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    classBookId: search.classBookId || 1,
    search: search.search ?? "",
    sortBy: search.sortBy ?? "studentId",
    sortOrder: search.sortOrder || "desc",
  };
  const { rows, pageSize, page, totalRecords } =
    await studentService.getStudents(query);

  const classBook = await classBookService.getClassBookById(
    search.classBookId || 1,
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
      classBookId={search.classBookId}
      sortBy={query.sortBy}
      sortOrder={query.sortOrder}
      apiBase={baseUrl}
      classBook={classBook}
    />
  );
};

export default page;
