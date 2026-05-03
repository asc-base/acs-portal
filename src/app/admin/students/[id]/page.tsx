import { StudentUpdateForm } from "./student.update.form";
import { baseUrl, studentService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    classBookId: string;
  }>;
}

const page = async ({ params, searchParams }: PageProps) => {
  const resolvesearchParams = await searchParams;
  const resolveParams = await params;
  const classBookId = Number(resolvesearchParams.classBookId);
  const idNumber = Number(resolveParams.id);

  const student = await studentService.getSrudentByUserId(idNumber);

  return (
    <StudentUpdateForm
      apiBase={baseUrl}
      classBookId={classBookId}
      student={student}
    />
  );
};

export default page;
