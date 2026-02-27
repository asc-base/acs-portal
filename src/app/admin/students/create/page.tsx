import { CreateStudentForm } from "./create.student.form";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    classBookId?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolveparams = await searchParams;
  const classBookId = Number(resolveparams.classBookId);

  return <CreateStudentForm apiBase={baseUrl} classBookId={classBookId} />;
};

export default page;
