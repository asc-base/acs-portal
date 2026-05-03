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

  const tags = await masterDataService.getMasterData();
  const newsGroup = tags?.tagsGroups?.find(
    (group: { name: string }) => group.name === "news",
  );
  
  const categories = newsGroup
    ? tags?.tags?.filter(
        (tag: { tagsGroupsId: string | number }) =>
          String(tag?.tagsGroupsId) === String(newsGroup?.id),
      )
    : [];

  return (
    <div>
      <NewsInfo news={news} apiBase={baseUrl} categories={categories} />
    </div>
  );
};

export default page;
