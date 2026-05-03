"use client";
import React from "react";
import { INews } from "@/core/domain/news";
import Image from "next/image";
import { NewsCard } from "@/components/newscard";
import Link from "next/link";
import { Breadcrumbs, Skeleton } from "@mui/material";

interface NewsInfoProps {
  newsInfo: INews;
  recommendNews: INews[];
}

const NewsInfoComponent = ({ newsInfo, recommendNews }: NewsInfoProps) => {
  const date = `${new Date(newsInfo.startDate).getDate()} ${new Date(
    newsInfo.startDate,
  ).toLocaleString("th-TH", {
    month: "long",
  })} ${new Date(newsInfo.startDate).getFullYear() + 543}`;

  return (
    <div className="container mx-auto px-8 py-5">
      <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
        <Link href="/">หน้าหลัก</Link>
        <Link
          href={`/news?category=${newsInfo.tag.name}&page=1&pageSize=12&tagId=${newsInfo.tag.id}`}
        >
          {newsInfo.tag.name}
        </Link>
        {newsInfo.title && <span>{newsInfo.title}</span>}
      </Breadcrumbs>
      <div>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Skeleton
            data-skeleton
            variant="rectangular"
            className="absolute inset-0 rounded-xl"
            sx={{ width: "100%", height: "100%" }}
            animation="wave"
          />
          {newsInfo?.image && (
            <Image
              src={newsInfo.image}
              alt={newsInfo?.title || "news image"}
              fill
              loading="lazy"
              sizes="100vw"
              className="relative mt-3 rounded-xl object-cover"
              onLoadingComplete={(img) => {
                const skeleton = img.parentElement?.querySelector(
                  "[data-skeleton]",
                ) as HTMLElement | null;
                if (skeleton) skeleton.style.display = "none";
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <div className="flex w-full flex-col gap-4 py-5 lg:py-8">
          <div>
            <h4>{date}</h4>
            <h2 className="font-bold lg:mt-2 lg:text-4xl">{newsInfo?.title}</h2>
          </div>
          <h3 className="break-words whitespace-pre-wrap">{newsInfo.detail}</h3>
        </div>
      </div>
      <div className="flex flex-col gap-4 pb-8">
        <h3 className="text-accent04 font-bold lg:text-2xl">
          ข่าวที่น่าสนใจอื่นๆ
        </h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recommendNews?.map((news) => (
            <Link key={news.id} href={`/news/${news.id}`} className="block w-full">
              <NewsCard news={news} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsInfoComponent;
