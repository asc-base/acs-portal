import HomePage from "@/features/home/components/public/home";
import { createNewsServerService } from "@/features/news/server";



// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "ACS website",
  description: "Applied Computer Science KMUTT official website",
};

const MainPage = async () => {
  const newsService = await createNewsServerService();

  const [
    initNewsActivity,
    initNewsComplete,
    initNewsActivityStudent,
    initAnnoucement,
    initNewsHighlight,
  ] = await Promise.all([
    newsService.getNews(1, 6, 16).catch(() => ({ rows: [] })),
    newsService.getNews(1, 6, 17).catch(() => ({ rows: [] })),
    newsService.getNews(1, 6, 18).catch(() => ({ rows: [] })),
    newsService.getNewsBulletins("ANNOUNCEMENT").catch(() => []),
    newsService.getNewsBulletins("HIGHLIGHT").catch(() => []),
  ]);

  return (
    <HomePage
      initNewsActivity={initNewsActivity.rows || []}
      initNewsComplete={initNewsComplete.rows || []}
      initNewsActivityStudent={initNewsActivityStudent.rows || []}
      initAnnoucement={initAnnoucement}
      initNewsHighlight={initNewsHighlight}
    />
  );
};

export default MainPage;
