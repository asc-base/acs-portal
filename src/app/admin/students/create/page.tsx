import { CreateStudentForm } from "./create.student.form";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    classBookID?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolveparams = await searchParams;
  const classBookID = Number(resolveparams.classBookID);

  return <CreateStudentForm apiBase={baseUrl} classBookID={classBookID} />;
};

export default page;
