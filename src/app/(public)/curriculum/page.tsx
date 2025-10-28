import React, { FC } from "react";
import { curriculumService } from "@/infra/container";
import CurriculumListComponents from "./curriculum.landingpage";
import { masterDataService } from "@/infra/container";
import { QueryCurriculum } from "@/core/domain/curriculum";

// Force this route to be dynamic to avoid build-time prerender fetches
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CurriculumPageProps {
  searchParams: Promise<QueryCurriculum>;
}

const Page: FC<CurriculumPageProps> = async ({ searchParams }) => {
  const search = await searchParams;

  const query: QueryCurriculum = {
    page: search.page || 1,
    pageSize: search.pageSize || 2,
    sortBy: search.sortBy || "year",
    sortOrder: search.sortOrder || "desc",
  };

  const { rows } = await curriculumService.getCurriculum(query);

  const typeCourseResponse = await masterDataService.getMasterDataTypeCourse();

  return (
    <div className="container mx-auto px-16 py-5">
      <CurriculumListComponents
        curriculum={rows}
        typeCourse={typeCourseResponse}
      />
    </div>
  );
};

export default Page;
