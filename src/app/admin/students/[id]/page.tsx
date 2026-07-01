import { StudentUpdateForm } from "./student.update.form";
import { baseUrl, studentService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    classBookID: string;
  }>;
}

const page = async ({ params, searchParams }: PageProps) => {
  const resolvesearchParams = await searchParams;
  const resolveParams = await params;
  const classBookID = Number(resolvesearchParams.classBookID);
  const idNumber = Number(resolveParams.id);

  const student = await studentService.getStudentById(idNumber);

  return (
    <StudentUpdateForm
      apiBase={baseUrl}
      classBookID={classBookID}
      student={student}
    />
  );
};

export default page;
