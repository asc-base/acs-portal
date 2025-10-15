import React from "react";
import { curriculumService } from "@/infra/container";
import CurriculumListComponents from "./curriculum.landingpage";
import { masterDataService } from "@/infra/container";

// Force this route to be dynamic to avoid build-time prerender fetches
export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page = async () => {
  const { rows } = await curriculumService.getCurriculum(1, 2, "year", "desc");

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
