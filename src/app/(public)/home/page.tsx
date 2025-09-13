import React from "react";
import HomePage from "./home";
import { newsService } from "@/infra/container";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

const MainPage = async () => {
  try {
    const [
      initNewsActivity,
      initNewsComplete,
      initNewsActivityStudent,
      initNewsMedia,
    ] = await Promise.all([
      newsService.getNews(1, 6).catch(() => ({ rows: [] })),
      newsService.getNews(1, 6).catch(() => ({ rows: [] })),
      newsService.getNews(1, 6).catch(() => ({ rows: [] })),
      newsService.getNewsMedias("newshigtlight").catch(() => []),
    ]);

    return (
      <HomePage
        initNewsActivity={initNewsActivity.rows}
        initNewsComplete={initNewsComplete.rows}
        initNewsActivityStudent={initNewsActivityStudent.rows}
        initNewsMedia={initNewsMedia}
      />
    );
  } catch (error) {
    console.error("Failed to fetch news data:", error);
    // Return with empty arrays as fallback
    return (
      <HomePage
        initNewsActivity={[]}
        initNewsComplete={[]}
        initNewsActivityStudent={[]}
        initNewsMedia={[]}
      />
    );
  }
};

export default MainPage;
