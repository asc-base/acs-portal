import React from "react";
import ProjectList from "./project.list.components";
import {
  projectService,
  masterDataService,
  courseService,
  classBookService,
} from "@/infra/container";
import { FilterList } from "@/components/filterlist";
import { QueryProject } from "@/core/domain/project";

interface LocalPageProps {
  searchParams?: Promise<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
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
  const resolvedSearchParams = (await searchParams) || {};

  const queryFilters: QueryProject = {
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
    page: resolvedSearchParams.page,
    pageSize: resolvedSearchParams.pageSize,
    fields: ensureArray(resolvedSearchParams.fields),
    categories: ensureArray(resolvedSearchParams.categories),
    types: ensureArray(resolvedSearchParams.types),
    courses: ensureArray(resolvedSearchParams.courses),
    classBooks: ensureArray(resolvedSearchParams.classBooks),
  };

  const projectData = await projectService.getProjects(queryFilters);

  if (!projectData) {
    console.log("No project data available");
  }

  const masterData = await masterDataService.getMasterData();
  const categories = masterData.tags.filter((e) => e.tagsGroupsId === 3);
  const fields = masterData.tags.filter((e) => e.tagsGroupsId === 2);
  const types = masterData.tags.filter((e) => e.tagsGroupsId === 1);
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
