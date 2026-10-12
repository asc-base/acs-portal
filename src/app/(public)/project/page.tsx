import React from "react";
import { redirect } from "next/navigation";
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
  const masterData = await masterDataService.getMasterData();
  const categories = masterData.categories;
  const fields = masterData.fields;
  const types = masterData.projectTypes;
  const canonicalFilters = [
    { oldKey: "fields", newKey: "fieldIds", groupName: "field", lookups: masterData.fields },
    { oldKey: "categories", newKey: "categoryIds", groupName: "category", lookups: masterData.categories },
    { oldKey: "types", newKey: "projectTypeIds", groupName: "type", lookups: masterData.projectTypes },
  ] as const;
  const legacyKeys = canonicalFilters.map(({ oldKey }) => oldKey);
  const legacyTagIDs = (ensureArray(resolvedSearchParams.tagID) ?? []).map(Number);
  let hasLegacyFilters = false;
  for (const filter of canonicalFilters) {
    const values = ensureArray(resolvedSearchParams[filter.oldKey]);
    if (!values?.length) continue;
    hasLegacyFilters = true;
    for (const value of values) {
      const legacyID = Number(value);
      const tag = masterData.tags.find((item) => item.id === legacyID);
      const groupName = masterData.tagsGroups.find((group) => group.id === tag?.tagsGroupsId)?.name;
      const lookup = groupName === filter.groupName && tag
        ? filter.lookups.find((item) => item.name === tag.name)
        : undefined;
      if (lookup) {
        const direct = ensureArray(resolvedSearchParams[filter.newKey]) ?? [];
        direct.push(String(lookup.id));
        (resolvedSearchParams as Record<string, string | string[] | undefined>)[filter.newKey] = direct;
      } else {
        legacyTagIDs.push(legacyID);
      }
    }
  }
  if (hasLegacyFilters) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (legacyKeys.includes(key as typeof legacyKeys[number]) || key === "tagID") continue;
      for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) params.append(key, String(item));
    }
    for (const id of new Set(legacyTagIDs)) params.append("tagID", String(id));
    redirect(`/project?${params.toString()}`);
  }

  const queryFilters: QueryProject = {
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 9,
    fieldIds: ensureArray(resolvedSearchParams.fieldIds),
    categoryIds: ensureArray(resolvedSearchParams.categoryIds),
    projectTypeIds: ensureArray(resolvedSearchParams.projectTypeIds),
    tagID: ensureArray(resolvedSearchParams.tagID),
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
