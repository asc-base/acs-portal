"use client";
import { useEffect, useState } from "react";
import NewsListComponent from "./news.list.component";
import { newsService } from "@/infra/container";
import { INews } from "@/core/domain/news";

export default function NewsPage() {
  const [newsData, setNewsData] = useState<{
    news: INews[];
    totalRecords: number;
    page: number;
    pageSize: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { rows, totalRecords, page, pageSize } =
          await newsService.getNews(1, 9);
        setNewsData({ news: rows, totalRecords, page, pageSize });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!newsData) {
    return <div>No data available</div>;
  }

  return (
    <NewsListComponent
      news={newsData.news}
      totalRecords={newsData.totalRecords}
      page={newsData.page}
      pageSize={newsData.pageSize}
    />
  );
}
