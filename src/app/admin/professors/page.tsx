import { professorService } from "@/infra/container";
import ProfessorLandingpage from "./professors.landingpage";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
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
    <ProfessorLandingpage
      professor={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
    />
  );
};

export default page;
