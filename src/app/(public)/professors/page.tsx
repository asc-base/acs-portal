import React from "react";
import ProfessorsListComponent from "./professors.list.compnent";
import { professorService } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const { rows, pageSize, page } = await professorService.getProfessors({
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 12,
  });

  return (
    <ProfessorsListComponent
      professors={rows}
      pageSize={pageSize}
      page={page}
    />
  );
};

export default page;
