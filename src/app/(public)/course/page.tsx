import React from "react";

import CourseListComponents from "@/features/courses/components/public/course.list.components";
import { createCourseServerService } from "@/features/courses/server";


export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    page: number;
    pageSize: number;
    prerequisite: boolean;
    curriculumId: number;
    typeCourseId: number;
    typeCourseName: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const courseService = await createCourseServerService();

  const resolvedSearchParams = await searchParams;
  const { rows, totalRecords } = await courseService.getCourse({
    curriculumID: resolvedSearchParams.curriculumId,
    typeCourseID: resolvedSearchParams.typeCourseId,
    orderBy: "courseCode",
    sortBy: "asc",
  });

  return (
    <CourseListComponents
      course={rows}
      totalRecords={totalRecords}
      typeCourseName={resolvedSearchParams.typeCourseName}
    />
  );
};

export default page;
