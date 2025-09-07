import React from "react";
import { newsService } from "@/infra/container";
import NewsListComponents from "./news.list.components";

const page = async ({
  searchParams,
}: {
  searchParams: { category?: string; page?: number; pageSize?: number };
}) => {
  const { rows, totalRecords, pageSize, page } = await newsService.getNews(
    searchParams.page || 1,
    searchParams.pageSize || 12,
    "",
    searchParams.category || "",
  );

  console.log(searchParams.category);

  return (
    <NewsListComponents
      news={rows}
      totalRecords={totalRecords}
      pageSize={pageSize}
      page={page}
      category={searchParams.category || ""}
    />
  );
};

export default page;
