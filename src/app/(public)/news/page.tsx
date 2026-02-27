import React from "react";
import { newsService } from "@/infra/container";
import NewsListComponents from "./news.list.components";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    tagId?: number;
    category?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { rows, totalRecords, pageSize, page } = await newsService.getNews(
    resolvedSearchParams.page || 1,
    resolvedSearchParams.pageSize || 12,
    resolvedSearchParams.tagId,
  );

  return (
    <NewsListComponents
      news={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      category={resolvedSearchParams.category || ""}
      tagId={resolvedSearchParams.tagId}
    />
  );
};

export default page;
