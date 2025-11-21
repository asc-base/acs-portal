import React from "react";
import CoursesLandingpage from "./courses.landingpage";
import { courseService } from "@/infra/container";
import { QueryCourse } from "@/core/domain/course";
import { masterDataService } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryCourse>;
}

const page = async ({ searchParams }: PageProps) => {
  const search = await searchParams;

  const query: QueryCourse = {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    curriculumId: search.curriculumId ?? 1,
    typecourseId: search.typecourseId,
    search: search.search ?? "",
    sortBy: search.sortBy ?? "courseId",
    sortOrder: search.sortOrder ?? "desc",
  };
  

  const { rows, pageSize, page, totalRecords } = await courseService.getCourse(query);
  
  const typeCourses = await masterDataService.getMasterDataTypeCourse();

  return (
    <CoursesLandingpage
      courses={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      curriculumId={query.curriculumId}
      typeCourses={typeCourses}
      typecourseId={query.typecourseId}
      sortBy={query.sortBy}
      sortOrder={query.sortOrder}
    />
  );
};

export default page;
