import React from "react";
import { curriculumService } from "@/infra/container";
import CurriculumListComponents from "./curriculum.landingpage";
import { masterDataService } from "@/infra/container";

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
