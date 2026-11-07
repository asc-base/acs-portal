import React from "react";
import { notFound } from "next/navigation";
import NewsInfoComponent from "@/features/news/components/public/[id]/newsinfo.component";
import { createNewsServerService } from "@/features/news/server";




interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const newsService = await createNewsServerService();

  const { id } = await params;

  const newsInfo = await newsService.getNewsById(id);
  if (!newsInfo) notFound();
  const recommendNews = await newsService.getNews(
    1,
    6,
    newsInfo.category?.id,
  );

  return (
    <div>
      <NewsInfoComponent
        newsInfo={newsInfo}
        recommendNews={recommendNews.rows}
      />
    </div>
  );
};

export default page;
