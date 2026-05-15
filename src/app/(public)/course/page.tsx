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
  const { rows, totalRecords } = await courseService.getCourse({
    curriculumID: resolvedSearchParams.curriculumId,
    typeCourseID: resolvedSearchParams.typeCourseId,
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
