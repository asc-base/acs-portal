import React from "react";
import HomePage from "./home";
import { newsService } from "@/infra/container";
import { API_URL } from "@/infra/container";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "ACS website",
  description: "Applied Computer Science KMUTT official website",
};

const MainPage = async () => {
  const [
    initNewsActivity,
    initNewsComplete,
    initNewsActivityStudent,
    initAnnoucement,
    initNewsHighlight,
  ] = await Promise.all([
    newsService
      .getNews(1, 6, "", "ข่าวประชาสัมพันธ์")
      .catch(() => ({ rows: [] })),
    newsService
      .getNews(1, 6, "", "ความสำเร็จนักศึกษา")
      .catch(() => ({ rows: [] })),
    newsService
      .getNews(1, 6, "", "งานกิจกรรมนักศึกษา")
      .catch(() => ({ rows: [] })),
    newsService.getNewsInformations("announcement", 1, 6).catch(() => []),
    newsService.getNewsInformations("newshighlight", 1, 5).catch(() => []),
  ]);

  console.log("base url is", API_URL);

  return (
    <HomePage
      initNewsActivity={initNewsActivity.rows || []}
      initNewsComplete={initNewsComplete.rows || []}
      initNewsActivityStudent={initNewsActivityStudent.rows || []}
      initAnnoucement={initAnnoucement || []}
      initNewsHighlight={initNewsHighlight || []}
      apibase={API_URL}
    />
  );
};

export default MainPage;
