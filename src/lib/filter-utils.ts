import type { QueryProject } from "@/core/domain/project";

/**
 * Utility functions for handling search parameters and filters
 */

/**
 * Parse comma-separated string parameter to array of numbers
 * @param param - String parameter from search params (e.g., "1,2,3")
 * @returns Array of numbers or empty array if invalid
 */
export function parseFilterIds(param: string | undefined | null): number[] {
  if (!param || typeof param !== "string") return [];

  return param
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id) && id > 0);
}

/**
 * Parse search parameters for project filtering
 * @param searchParams - Search parameters object
 * @returns Parsed filter parameters
 */
export function parseProjectFilters(searchParams: {
  sortBy?: string;
  sortOrder?: string;
  page?: string | number;
  pageSize?: string | number;
  fields?: string;
  categories?: string;
  types?: string;
  courses?: string;
  classBooks?: string;
}): QueryProject {
  const sortOrder =
    searchParams?.sortOrder === "asc" || searchParams?.sortOrder === "desc"
      ? searchParams.sortOrder
      : ("desc" as const);

  return {
    sortBy: searchParams?.sortBy || "createdAt",
    sortOrder,
    page:
      typeof searchParams?.page === "string"
        ? parseInt(searchParams.page, 10)
        : searchParams?.page,
    pageSize:
      typeof searchParams?.pageSize === "string"
        ? parseInt(searchParams.pageSize, 10)
        : searchParams?.pageSize,
    fields: parseFilterIds(searchParams?.fields),
    categories: parseFilterIds(searchParams?.categories),
    types: parseFilterIds(searchParams?.types),
    courses: parseFilterIds(searchParams?.courses),
    classBooks: parseFilterIds(searchParams?.classBooks),
  };
}

/**
 * Convert filter object back to URL search parameters
 * @param filters - Filter object
 * @returns URLSearchParams object
 */
export function filtersToSearchParams(filters: {
  fields?: number[];
  categories?: number[];
  types?: number[];
  courses?: number[];
  classBooks?: number[];
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.page) params.set("page", filters.page.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());

  if (filters.fields && filters.fields.length > 0) {
    params.set("fields", filters.fields.join(","));
  }
  if (filters.categories && filters.categories.length > 0) {
    params.set("categories", filters.categories.join(","));
  }
  if (filters.types && filters.types.length > 0) {
    params.set("types", filters.types.join(","));
  }
  if (filters.courses && filters.courses.length > 0) {
    params.set("courses", filters.courses.join(","));
  }
  if (filters.classBooks && filters.classBooks.length > 0) {
    params.set("classBooks", filters.classBooks.join(","));
  }

  return params;
}
