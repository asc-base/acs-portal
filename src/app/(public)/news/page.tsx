import React from "react";
import { notFound } from "next/navigation";

import NewsListComponents from "@/features/news/components/public/news.list.components";
import { createNewsServerService } from "@/features/news/server";



interface PageProps {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    tagId?: number;
    tagID?: number;
    newsCategoryId?: number;
    category?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const newsService = await createNewsServerService();

  const resolvedSearchParams = await searchParams;
  if (resolvedSearchParams.tagId !== undefined || resolvedSearchParams.tagID !== undefined) notFound();
  const { rows, totalRecords, pageSize, page } = await newsService.getNews(
    resolvedSearchParams.page || 1,
    resolvedSearchParams.pageSize || 12,
    resolvedSearchParams.newsCategoryId,
    undefined,
    undefined,
    undefined,
  );

  return (
    <NewsListComponents
      news={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      category={resolvedSearchParams.category || ""}
      newsCategoryId={resolvedSearchParams.newsCategoryId}
    />
  );
};

export default page;
