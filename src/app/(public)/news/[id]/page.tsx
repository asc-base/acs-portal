import React from "react";
import { notFound } from "next/navigation";
import NewsInfoComponent from "@/features/news/components/public/[id]/newsinfo.component";
import { createNewsServerService } from "@/features/news/server";



export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const recommendNews = await newsService.getNews(1, 6, newsInfo.tag?.id);

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
