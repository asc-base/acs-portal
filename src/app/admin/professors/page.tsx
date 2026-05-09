import { professorService,  baseUrl } from "@/infra/container";
import ProfessorLandingpage from "./professors.landingpage";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    search?: string;
    searchBy?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const query = {
    page: Number(resolvedSearchParams.page) || 1,
    pageSize: Number(resolvedSearchParams.pageSize) || 10,
    academicPosition: "true",
    search: resolvedSearchParams.search || "",
    searchBy: resolvedSearchParams.searchBy || "firstNameTh",
  };
  const { rows, totalRecords, pageSize, page } =
    await professorService.getProfessors(query);
  return (
    <ProfessorLandingpage
      professor={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      apiBase={baseUrl}
    />
  );
};

export default page;
