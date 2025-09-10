import React from "react";
import { newsService } from "@/infra/container";
import NewsListComponents from "./news.list.components";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    page?: number;
    pageSize?: number;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { rows, totalRecords, pageSize, page } = await newsService.getNews(
    resolvedSearchParams.page || 1,
    resolvedSearchParams.pageSize || 12,
    "",
    resolvedSearchParams.category || "",
  );

  console.log(resolvedSearchParams.category);

  return (
    <NewsListComponents
      news={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      category={resolvedSearchParams.category || ""}
    />
  );
};

export default page;
