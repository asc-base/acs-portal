import HomePage from "@/features/home/components/public/home";
import { createNewsServerService } from "@/features/news/server";
import { createMasterDataServerService } from "@/features/master-data/server";




export const metadata = {
  title: "ACS website",
  description: "Applied Computer Science KMUTT official website",
};

const MainPage = async () => {
  const [newsService, masterDataService] = await Promise.all([
    createNewsServerService(),
    createMasterDataServerService(),
  ]);
  const masterData = await masterDataService.getMasterData().catch(() => undefined);
  const categoryId = (code: string) => masterData?.newsCategories.find((category) => category.code === code)?.id;

  const [
    initNewsActivity,
    initNewsComplete,
    initNewsActivityStudent,
    initAnnoucement,
    initNewsHighlight,
  ] = await Promise.all([
    categoryId("ANNOUNCEMENT") === undefined ? Promise.resolve({ rows: [] }) : newsService.getNews(1, 6, categoryId("ANNOUNCEMENT")).catch(() => ({ rows: [] })),
    categoryId("STUDENT_ACHIEVEMENT") === undefined ? Promise.resolve({ rows: [] }) : newsService.getNews(1, 6, categoryId("STUDENT_ACHIEVEMENT")).catch(() => ({ rows: [] })),
    categoryId("STUDENT_ACTIVITY") === undefined ? Promise.resolve({ rows: [] }) : newsService.getNews(1, 6, categoryId("STUDENT_ACTIVITY")).catch(() => ({ rows: [] })),
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
      newsCategoryIds={{
        ANNOUNCEMENT: categoryId("ANNOUNCEMENT"),
        STUDENT_ACHIEVEMENT: categoryId("STUDENT_ACHIEVEMENT"),
        STUDENT_ACTIVITY: categoryId("STUDENT_ACTIVITY"),
      }}
    />
  );
};

export default MainPage;
