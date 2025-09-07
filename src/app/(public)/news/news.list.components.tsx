"use client";
import React from "react";
import { INews } from "@/core/domain/news";
import { NewsCard } from "@/components/newscard";
import { Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NewsListComponentsProps {
  news: INews[];
  totalRecords: number;
  pageSize: number;
  page: number;
  category: string;
}

const NewsListComponents = ({
  news,
  totalRecords,
  pageSize,
  page,
  category,
}: NewsListComponentsProps) => {
  const router = useRouter();

  const handleNextPage = (currentPage: number) => {
    router.push(
      `/news?category=${category}&page=${currentPage}&pageSize=${pageSize}`,
    );
  };

  return (
    <div className="container mx-auto px-16 py-5">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <NewsCard news={item} />
            </Link>
          ))}
        </div>
        <Pagination
          shape="rounded"
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={(_, currentPage) => handleNextPage(currentPage)}
          color="primary"
          size="large"
        />
      </div>
    </div>
  );
};

export default NewsListComponents;
