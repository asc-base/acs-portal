"use client";
import { INews } from "@/core/domain/news";

const NewsListComponent = (initValue: { news: INews[] }) => {
  const news = initValue.news;

  return (
    <>
      {news.map((item: INews) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </>
  );
};

export default NewsListComponent;
