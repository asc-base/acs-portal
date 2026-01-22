import Preview_table_component from "./preview.table.component";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: {
    classbookId?: number;
  };
}

const page = async ({ searchParams }: PageProps) => {
  const resolveparams = await searchParams;
  const classbookId = Number(resolveparams.classbookId);

  return (
    <Preview_table_component apiBase={baseUrl} classbookId={classbookId} />
  );
};

export default page;
