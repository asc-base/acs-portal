import React from "react";
import CurriculumListComponents from "./curriculum.list.component";
import { QueryCurriculum } from "@/core/domain/curriculum";
import { curriculumService } from "@/infra/container";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryCurriculum>;
}

const page = async ({ searchParams }: PageProps) => {
  const search = await searchParams;

  const query: QueryCurriculum = {
    page: search.page || 1,
    pageSize: search.pageSize || 12,
    search: search.search ?? "",
  };
  const { rows, pageSize, page, totalRecords } =
    await curriculumService.getCurriculum(query);

  return (
    <CurriculumListComponents
      curriculums={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      apiBase={baseUrl}
    />
  );
};

export default page;
