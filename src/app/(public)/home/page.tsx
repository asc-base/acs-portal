import React from "react";
import HomePage from "./home";
import { newsService } from "@/infra/container";

const MainPage = async () => {
  const initNewsActivity = await newsService.getNews(1, 6);
  const initNewsComplete = await newsService.getNews(1, 6);
  const initNewsActivityStudent = await newsService.getNews(1, 6);

  const initNewsMedia = await newsService.getNewsMedias("newshigtlight");

  return (
    <HomePage
      initNewsActivity={initNewsActivity.rows}
      initNewsComplete={initNewsComplete.rows}
      initNewsActivityStudent={initNewsActivityStudent.rows}
      initNewsMedia={initNewsMedia}
    />
  );
};

export default MainPage;
