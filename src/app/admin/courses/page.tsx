import React from "react";
import CoursesLandingpage from "@/features/courses/components/admin/courses.landingpage";

import type { QueryCourse } from "@/features/courses/domain/course";
import { QueryCourseSchema } from "@/features/courses/schema/course";
import { createCourseServerService } from "@/features/courses/server";
import { createMasterDataServerService } from "@/features/master-data/server";
import { createCurriculumServerService } from "@/features/curriculum/server";


export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<QueryCourse>;
}

const page = async ({ searchParams }: PageProps) => {
  const courseService = await createCourseServerService();
  const masterDataService = await createMasterDataServerService();
  const curriculumService = await createCurriculumServerService();

  const search = await searchParams;
  const query = QueryCourseSchema.parse({
    page: search.page ?? 1,
    pageSize: 7,
    curriculumID: search.curriculumID ?? 1,
    typeCourseID: search.typeCourseID,
    search: search.search ?? "",
    orderBy: search.orderBy ?? "courseCode",
    sortBy: search.sortBy ?? "asc",
  });

  const { rows, pageSize, page, totalRecords } = await courseService.getCourse(query);
  
  const { typeCourses } = await masterDataService.getMasterData();

  const curriculum = await curriculumService.getCurriculumById(query.curriculumID!)

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
      curriculumID={query.curriculumID!}
      search={query.search}
      typeCourses={typeCourses}
      typeCourseID={query.typeCourseID}
      sortBy={query.sortBy}
      orderBy={query.orderBy}
      curriculum={curriculum}
    />
  );
};

export default page;
