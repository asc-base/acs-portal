import React from "react";
import { classBookService, baseUrl } from "@/infra/container";
import ClassBookListComponents from "./classbook.list.component";
import { QueryClassBook } from "@/core/domain/classbook";


export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<QueryClassBook>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const query: QueryClassBook = {
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 12,
    orderBy: "createdAt",
    sortBy: resolvedSearchParams.sortBy ?? "desc",
    searchBy: "classof",
    search: resolvedSearchParams.search ?? "",
  };
  const { rows, totalRecords, pageSize, page } =
    await classBookService.getClassBooks(query);
  return (
    <ClassBookListComponents
      classbooks={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      sortBy={query.sortBy}
      apiBase={baseUrl}
    />
  );
};

export default page;
