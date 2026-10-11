import React from "react";

import ProjectListComponents from "@/features/projects/components/admin/project.list.component";
import type { QueryProjectInput } from "@/features/projects/schema/project";
import { createProjectServerService } from "@/features/projects/server";



export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryProjectInput>;
}

const page = async ({ searchParams }: PageProps) => {
  const projectService = await createProjectServerService();

  const resolvedSearchParams = await searchParams;

  const query = {
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 10,
    sortBy: "createdAt",
    sortOrder: resolvedSearchParams.sortOrder ?? "desc",
    search: resolvedSearchParams.search ?? "",
  };
  const { rows, totalRecords, pageSize, page } =
    await projectService.getProjects(query);
  return (
    <ProjectListComponents
      projects={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      sortOrder={query.sortOrder}
      search={query.search}
    />
  );
};

export default page;
