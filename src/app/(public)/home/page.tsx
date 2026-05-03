import HomePage from "./home";
import { newsService } from "@/infra/container";

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
    // initNewsHighlight,
  ] = await Promise.all([
    newsService.getNews(1, 6, 16).catch(() => ({ rows: [] })),
    newsService.getNews(1, 6, 17).catch(() => ({ rows: [] })),
    newsService.getNews(1, 6, 18).catch(() => ({ rows: [] })),
    newsService.getNewsInformations(1, 6, 19).catch(() => ({ rows: [] })),
    // newsService.getNewsInformations("newshighlight", 1, 5).catch(() => []),
  ]);

  return (
    <HomePage
      initNewsActivity={initNewsActivity.rows || []}
      initNewsComplete={initNewsComplete.rows || []}
      initNewsActivityStudent={initNewsActivityStudent.rows || []}
      initAnnoucement={initAnnoucement.rows || []}
      // initNewsHighlight={initNewsHighlight || []}
    />
  );
};

export default MainPage;
