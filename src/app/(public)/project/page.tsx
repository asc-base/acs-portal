import React from "react";
import ProjectList from "./project.list.components";
import { masterDataService, courseService } from "@/infra/container";

const Page = async () => {
  const type = await masterDataService.getMasterDataListType("type");
  const field = await masterDataService.getMasterDataListType("field");
  const category = await masterDataService.getMasterDataListType("category");
  const courseResponse = await courseService.getCourse({ curriculumId: 2 });
  const course = courseResponse.rows;
  return (
    <ProjectList
      type={type}
      field={field}
      category={category}
      course={course}
    />
  );
};

export default Page;
