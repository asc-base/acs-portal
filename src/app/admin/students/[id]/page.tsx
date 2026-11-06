import { StudentUpdateForm } from "@/features/students/components/admin/[id]/student.update.form";
import { createStudentServerService } from "@/features/students/server";



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
  const studentService = await createStudentServerService();

  const resolvesearchParams = await searchParams;
  const resolveParams = await params;
  const classBookID = Number(resolvesearchParams.classBookID);
  const idNumber = Number(resolveParams.id);

  const student = await studentService.getStudentById(idNumber);

  return (
    <StudentUpdateForm
      classBookID={classBookID}
      student={student}
    />
  );
};

export default page;
