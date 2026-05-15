import Preview_table_component from "./preview.table.component";
import { baseUrl } from "@/infra/container";

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
    <Preview_table_component apiBase={baseUrl} classBookID={classBookID} />
  );
};

export default page;
