import React from "react";
import { courseService } from "@/infra/container";
import CourseListComponents from "./course.list.components";

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
  const resolvedSearchParams = await searchParams;
  const { rows, totalRecords } = await courseService.getCourse(
    resolvedSearchParams.page || 1,
    resolvedSearchParams.pageSize || 12,
    resolvedSearchParams.prerequisite,
    resolvedSearchParams.curriculumId,
    resolvedSearchParams.typeCourseId,
  );

  return (
    <CourseListComponents
      course={rows}
      totalRecords={totalRecords}
      typeCourseName={resolvedSearchParams.typeCourseName}
      curriculumId={resolvedSearchParams.curriculumId}
      typeCourseId={resolvedSearchParams.typeCourseId}
    />
  );
};

export default page;
