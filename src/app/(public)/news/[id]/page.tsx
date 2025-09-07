import React from "react";
import NewsInfoComponent from "./newsinfo.component";
import { newsService } from "@/infra/container";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const newsInfo = await newsService.getNewsById(id);
  const recommendNews = await newsService.getNews(1, 6);

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
