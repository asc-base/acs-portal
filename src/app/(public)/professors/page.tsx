import React from "react";
import ProfessorsListComponent from "@/features/professors/components/public/professors.list.compnent";
import { createProfessorServerService } from "@/features/professors/server";




interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    staffPage?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const professorService = await createProfessorServerService();

  const resolvedSearchParams = await searchParams;

  const [academics, staff] = await Promise.all([
    professorService.getProfessors({
      page: resolvedSearchParams.page || 1,
      pageSize: resolvedSearchParams.pageSize || 12,
      personnelGroup: "academic",
      orderBy: "displayNameTh",
      sortBy: "asc",
    }),
    professorService.getProfessors({
      page: resolvedSearchParams.staffPage || 1,
      pageSize: resolvedSearchParams.pageSize || 12,
      personnelGroup: "staff",
      orderBy: "displayNameTh",
      sortBy: "asc",
    }),
  ]);

  return (
    <ProfessorsListComponent
      academics={academics}
      staff={staff}
    />
  );
};

export default page;
