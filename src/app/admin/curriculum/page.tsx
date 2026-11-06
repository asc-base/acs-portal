import React from "react";
import CurriculumListComponents from "@/features/curriculum/components/admin/curriculum.list.component";
import { QueryCurriculum } from "@/features/curriculum/domain/curriculum";
import { createCurriculumServerService } from "@/features/curriculum/server";




export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryCurriculum>;
}

const page = async ({ searchParams }: PageProps) => {
  const curriculumService = await createCurriculumServerService();

  const search = await searchParams;

  const query: QueryCurriculum = {
    page: search.page || 1,
    pageSize: search.pageSize || 12,
    year: search.year ?? "",
  };
  const { rows, pageSize, page, totalRecords } =
    await curriculumService.getCurriculum(query);

  return (
    <CurriculumListComponents
      curriculums={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
    />
  );
};

export default page;
