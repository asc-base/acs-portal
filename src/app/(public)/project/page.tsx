import React from "react";
import ProjectList from "./project.list.components";
import {
  projectService,
  // classBookService,
  masterDataService,
  courseService,
} from "@/infra/container";
import { FilterList } from "@/components/filterlist";
import { parseProjectFilters } from "@/lib/filter-utils";

// Update Page props to match Next.js (searchParams is a Promise in Next.js 15)
interface LocalPageProps {
  searchParams?: Promise<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
    fields?: string;
    categories?: string;
    types?: string;
    courses?: string;
    classBooks?: string;
  }>;
}

const Page = async ({ searchParams }: LocalPageProps) => {
  const resolvedSearchParams = (await searchParams) || {};

  // Parse filter parameters using utility function
  const filterParams = parseProjectFilters(resolvedSearchParams);

  const { rows: ProjectRows, totalRecords: recordProjects } =
    await projectService.getProjects(filterParams);

  // const categories = await masterDataService.getMasterDataListType();
  const categories = await masterDataService.getMasterDataListType("category");
  const fields = await masterDataService.getMasterDataListType("field");
  const types = await masterDataService.getMasterDataListType("type");
  const courses = await courseService.getCourse({ curriculumId: 1 });

  console.log("Search Params:", resolvedSearchParams);
  console.log("Filter Params:", filterParams);

  return (
    <div className="jun-layout">
      <div className="jun-content">
        <ProjectList projects={ProjectRows} totalRecords={recordProjects} />
      </div>
      <FilterList
        categories={categories}
        fields={fields}
        types={types}
        courses={courses.rows}
      />
    </div>
  );
};

export default Page;
