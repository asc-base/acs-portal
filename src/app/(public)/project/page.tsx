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
    fields?: string[];
    categories?: string[];
    types?: string[];
    courses?: string[];
    classBooks?: string[];
  }>;
}

const Page = async ({ searchParams }: LocalPageProps) => {
  const resolvedSearchParams = (await searchParams) || {};

  const queryFilters: QueryProject = {
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
    page: resolvedSearchParams.page,
    pageSize: resolvedSearchParams.pageSize,
    fields: resolvedSearchParams.fields,
    categories: resolvedSearchParams.categories,
    types: resolvedSearchParams.types,
    courses: resolvedSearchParams.courses,
    classBooks: resolvedSearchParams.classBooks,
  };

  console.log("queryFilters", queryFilters);

  const projectData = await projectService.getProjects(queryFilters);

  if (!projectData) {
    console.log("No project data available");
  }

  const categories = await masterDataService.getMasterDataListType("category");
  const fields = await masterDataService.getMasterDataListType("field");
  const types = await masterDataService.getMasterDataListType("type");
  const courses = await courseService.getCourse({ curriculumId: 1 });
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
