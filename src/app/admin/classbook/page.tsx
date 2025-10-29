import React from "react";
import { classBookService } from "@/infra/container";
import ClassBookListComponentsProps from "./classbook.list.component";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { rows, totalRecords, pageSize, page } = await classBookService.getClassBooks({
      page: resolvedSearchParams.page || 1,
      pageSize:resolvedSearchParams.pageSize || 12,
    });

  return (
      <ClassBookListComponentsProps
        classbooks={rows}
        totalRecords={totalRecords}
        pageSize={pageSize}
        page={page}
      />
  );
};

export default page;
