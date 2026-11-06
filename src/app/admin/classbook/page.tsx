import React from "react";

import ClassBookListComponents from "@/features/classbook/components/admin/classbook.list.component";
import type { QueryClassBookInput } from "@/features/classbook/domain/classbook";
import { createClassBookServerService } from "@/features/classbook/server";



export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<QueryClassBookInput>;
}

const page = async ({ searchParams }: PageProps) => {
  const classBookService = await createClassBookServerService();

  const resolvedSearchParams = await searchParams;

  const query: QueryClassBookInput = {
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
      search={query.search}
    />
  );
};

export default page;
