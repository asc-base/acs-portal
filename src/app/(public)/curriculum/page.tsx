import React, { FC } from "react";

import CurriculumListComponents from "@/features/curriculum/components/public/curriculum.landingpage";
import { QueryCurriculum } from "@/features/curriculum/domain/curriculum";
import { createCurriculumServerService } from "@/features/curriculum/server";
import { createMasterDataServerService } from "@/features/master-data/server";


// Force this route to be dynamic to avoid build-time prerender fetches
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CurriculumPageProps {
  searchParams: Promise<QueryCurriculum>;
}

const Page: FC<CurriculumPageProps> = async ({ searchParams }) => {
  const curriculumService = await createCurriculumServerService();
  const masterDataService = await createMasterDataServerService();

  const search = await searchParams;

  const query: QueryCurriculum = {
    page: search.page || 1,
    pageSize: search.pageSize || 2,
    orderBy: search.orderBy || "year",
    sortBy: search.sortBy || "desc",
  };

  const { rows } = await curriculumService.getCurriculum(query);

  const { typeCourses } = await masterDataService.getMasterData();

  return (
    <CurriculumListComponents
      curriculum={rows}
      typeCourse={typeCourses}
    />
  );
};

export default Page;
