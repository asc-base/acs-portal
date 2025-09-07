"use client";
import React from "react";
import { INews } from "@/core/domain/news";
import { NewsCard } from "@/components/newscard";
import { Pagination, Breadcrumbs } from "@mui/material";
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
      <div className="flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
          <Link href="/">หน้าหลัก</Link>
          <p>ประชาสัมพันธ์</p>
          {category && <span>{category}</span>}
        </Breadcrumbs>
        <h1 className="text-accent04 font-bold">{category}</h1>
      </div>
      {news.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center">
          <p className="text-gray-500">ไม่มีข่าวในหมวดหมู่นี้</p>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-5">
          <div className="grid w-full grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
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
      )}
    </div>
  );
};

export default NewsListComponents;
