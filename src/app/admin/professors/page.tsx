import { professorService } from "@/infra/container";
import ProfessorTableComponent from "./professors.table";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    academicPosition?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const query = {
    page: Number(resolvedSearchParams.page) || 1,
    pageSize: Number(resolvedSearchParams.pageSize) || 10,
    academicPosition: "true",
  };
  const { rows, totalRecords, pageSize, page } =
    await professorService.getProfessors(query);
  return (
    <ProfessorTableComponent
      professor={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
    />
  );
};

export default page;
