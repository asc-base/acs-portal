import React from "react";
import { notFound } from "next/navigation";
import ProjectList from "@/features/projects/components/public/project.list.components";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { FilterList } from "@/features/projects/components/filterlist";
import { QueryProject } from "@/features/projects/domain/project";
import { createProjectServerService } from "@/features/projects/server";
import { createMasterDataServerService } from "@/features/master-data/server";
import { createCourseServerService } from "@/features/courses/server";
import { createClassBookServerService } from "@/features/classbook/server";


interface LocalPageProps {
  searchParams?: Promise<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
    fieldIds?: string | string[];
    categoryIds?: string | string[];
    projectTypeIds?: string | string[];
    tagID?: string | string[];
    tagId?: string | string[];
    fields?: string | string[];
    categories?: string | string[];
    types?: string | string[];
    courses?: string | string[];
    classBooks?: string | string[];
  }>;
}

const ensureArray = (
  value: string | string[] | undefined,
): string[] | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
};

const Page = async ({ searchParams }: LocalPageProps) => {
  const [projectService, masterDataService, courseService, classBookService] = await Promise.all([
    createProjectServerService(),
    createMasterDataServerService(),
    createCourseServerService(),
    createClassBookServerService(),
  ]);
  const resolvedSearchParams = (await searchParams) || {};
  if (["tagID", "tagId", "fields", "categories", "types"].some((key) => key in resolvedSearchParams)) notFound();
  const masterData = await masterDataService.getMasterData();
  const categories = masterData.categories;
  const fields = masterData.fields;
  const types = masterData.projectTypes;
  const sortByParam = resolvedSearchParams.sortBy;
  const sortBy = Array.isArray(sortByParam) ? sortByParam[0] : sortByParam;
  const queryFilters: QueryProject = {
    sortBy: sortBy === "title" || sortBy === "createdAt" || sortBy === "updatedAt" ? sortBy : undefined,
    sortOrder: resolvedSearchParams.sortOrder,
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 9,
    fieldIds: ensureArray(resolvedSearchParams.fieldIds),
    categoryIds: ensureArray(resolvedSearchParams.categoryIds),
    projectTypeIds: ensureArray(resolvedSearchParams.projectTypeIds),
    courses: ensureArray(resolvedSearchParams.courses),
    classBooks: ensureArray(resolvedSearchParams.classBooks),
  };

  const projectData = await projectService.getProjects(queryFilters);

  if (!projectData) console.log("No project data available");

  const courses = await courseService.getCourse({ curriculumID: 1 });
  const classBooks = await classBookService.getClassBooks({
    page: 1,
    pageSize: 4,
    orderBy: "firstYearAcademic",
    sortBy: "desc",
  });

  const revertedClassBooks = classBooks.rows.slice();

  return (
    <div className="jun-layout">
      <div className="jun-content">
        <ProjectList
          projects={projectData?.rows}
          totalRecords={projectData?.totalRecords}
          page={projectData?.page}
          pageSize={projectData?.pageSize}
          sortBy={resolvedSearchParams.sortBy}
          sortOrder={resolvedSearchParams.sortOrder}
        />
      </div>
      <FilterList
        classBooks={revertedClassBooks}
        categories={categories}
        fields={fields}
        types={types}
        courses={courses.rows}
      />
    </div>
  );
};

export default Page;
