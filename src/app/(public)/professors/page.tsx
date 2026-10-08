import React from "react";
import ProfessorsListComponent from "@/features/professors/components/public/professors.list.compnent";
import { createProfessorServerService } from "@/features/professors/server";



export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    academicPosition?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const professorService = await createProfessorServerService();

  const resolvedSearchParams = await searchParams;

  const { rows, pageSize, page, totalRecords } = await professorService.getProfessors({
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 12,
    academicPosition: "true"
  });

  return (
    <ProfessorsListComponent
      professors={rows}
      pageSize={pageSize}
      page={page}
      totalRecords={totalRecords}
    />
  );
};

export default page;
