import React from "react";
import CoursesLandingpage from "./courses.landingpage";
import { courseService, masterDataService, curriculumService, baseUrl } from "@/infra/container";
import { QueryCourse } from "@/core/domain/course";

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

  const curriculum = await curriculumService.getCurriculumById(query.curriculumId)

  if (!curriculum) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="font-bold">No curriculum information</h2>
    </div>
  );
  }

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
      curriculum={curriculum}
      apiBase={baseUrl}
    />
  );
};

export default page;
