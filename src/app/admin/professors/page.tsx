
import ProfessorLandingpage from "@/features/professors/components/admin/professors.landingpage";
import { createProfessorServerService } from "@/features/professors/server";


export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    searchBy?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const professorService = await createProfessorServerService();

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
    />
  );
};

export default page;
