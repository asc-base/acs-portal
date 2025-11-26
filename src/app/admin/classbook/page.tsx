import React from "react";
import { classBookService } from "@/infra/container";
import ClassBookListComponentsProps from "./classbook.list.component";
import { QueryClassBook } from "@/core/domain/classbook";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<QueryClassBook>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const query: QueryClassBook = {
    page: resolvedSearchParams.page || 1,
    pageSize: resolvedSearchParams.pageSize || 10,
    sortBy: "createdAt",
    sortOrder: resolvedSearchParams.sortOrder ?? "desc",
    search: resolvedSearchParams.search ?? "",
  };
  const { rows, totalRecords, pageSize, page } =
    await classBookService.getClassBooks(query);
  return (
    <ClassBookListComponentsProps
      classbooks={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      sortOrder={query.sortOrder}
    />
  );
};

export default page;
