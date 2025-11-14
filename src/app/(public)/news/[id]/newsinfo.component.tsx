"use client";
import React from "react";
import { INews } from "@/core/domain/news";
import Image from "next/image";
import { NewsCard } from "@/components/newscard";
import Link from "next/link";
import { Breadcrumbs } from "@mui/material";

interface NewsInfoProps {
  newsInfo: INews;
  recommendNews: INews[];
}

const NewsInfoComponent = ({ newsInfo, recommendNews }: NewsInfoProps) => {
  console.log("client", newsInfo);

  const date = `${new Date(newsInfo.startDate).getDate()} ${new Date(
    newsInfo.startDate,
  ).toLocaleString("th-TH", {
    month: "long",
  })} ${new Date(newsInfo.startDate).getFullYear() + 543}`;

  return (
    <>
      <div className="px container mx-auto px-16 py-8">
        <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
          <Link href="/">หน้าหลัก</Link>
          <Link
            href={`/news?category=${newsInfo.category.name}&page=1&pageSize=12`}
          >
            {newsInfo.category.name}
          </Link>
          {newsInfo.title && <span>{newsInfo.title}</span>}
        </Breadcrumbs>
        <div>
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={newsInfo?.image}
              alt={newsInfo?.title}
              width={0}
              height={0}
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col gap-4 py-8">
            <h4>{date}</h4>
            <h2 className="font-bold">{newsInfo?.title}</h2>
            <h3 className="break-words whitespace-pre-wrap">
              {newsInfo.detail}
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-8">
          <h2 className="text-accent04 font-bold">ข่าวที่น่าสนใจอื่นๆ</h2>
          <div className="grid grid-cols-1 justify-center justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendNews.map((news) => (
              <Link key={news.id} href={`/news/${news.id}`}>
                <NewsCard news={news} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsInfoComponent;
