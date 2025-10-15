import React, { Suspense } from "react";
import ProjectList from "./project.list.components";
import {
  projectService,
  classBookService,
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

  console.log("Search Params:", resolvedSearchParams);
  console.log("Filter Params:", filterParams);

  const { rows: classBooks } = await classBookService.getClassBooks({
    page: 1,
    pageSize: 4,
    sortBy: "classof",
    sortOrder: "desc",
  });

  const fields = await masterDataService.getMasterDataListType("field");
  const categories = await masterDataService.getMasterDataListType("category");
  const type = await masterDataService.getMasterDataListType("type");
  const { rows: courses } = await courseService.getCourse({
    curriculumId: 1,
  });

  return (
    <div className="jun-layout">
      <div className="jun-edgeSidebar relative z-0">
        <div className="jun-edgeContent">
          <Suspense
            fallback={
              <div className="p-4 text-sm text-gray-500">Loading filters…</div>
            }
          >
            <FilterList
              type={type}
              field={fields}
              category={categories}
              course={courses}
              classBooks={classBooks}
            />
          </Suspense>
        </div>
      </div>
      <div className="jun-content">
        <ProjectList projects={ProjectRows} totalRecords={recordProjects} />
      </div>
    </div>
  );
};

export default Page;
