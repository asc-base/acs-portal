import NewsInfo from "./news.info";
import { baseUrl, masterDataService, newsService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  const news = await newsService.getNewsById(id);

  const masterData = await masterDataService.getMasterData();
  const categories = masterData?.newsCategories ?? [];

  return (
    <div>
      <NewsInfo news={news} apiBase={baseUrl} categories={categories} />
    </div>
  );
};

export default page;
