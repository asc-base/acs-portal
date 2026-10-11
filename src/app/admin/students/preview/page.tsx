import Preview_table_component from "@/features/students/components/admin/preview/preview.table.component";


export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    classBookID?: number;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolveparams = await searchParams;
  const classBookID = Number(resolveparams.classBookID);

  return (
    <Preview_table_component classBookID={classBookID} />
  );
};

export default page;
