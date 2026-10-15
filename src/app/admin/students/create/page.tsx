import { CreateStudentForm } from "@/features/students/components/admin/create/create.student.form";



interface PageProps {
  searchParams: Promise<{
    classBookID?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolveparams = await searchParams;
  const classBookID = Number(resolveparams.classBookID);

  return <CreateStudentForm classBookID={classBookID} />;
};

export default page;
