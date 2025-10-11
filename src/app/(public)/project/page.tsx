import React from "react";
import ProjectList from "./project.list.components";
import { projectService } from "@/infra/container";

interface PageProps {
  searchParams?: Promise<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { rows, totalRecords } = await projectService.getProjects({
    sortBy: resolvedSearchParams?.sortBy || "createdAt",
    sortOrder: resolvedSearchParams?.sortOrder || "desc",
  });

  return (
    <div className="container mx-auto px-0 py-5 md:px-16 lg:px-0">
      <ProjectList projects={rows} totalRecords={totalRecords} />
    </div>
  );
};

export default Page;
