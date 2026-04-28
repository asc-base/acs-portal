import NewsListComponent from "./news.list.component";
import { baseUrl, newsService, masterDataService } from "@/infra/container";
import { QueryNews } from "@/core/domain/news";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<QueryNews>;
}

const page = async ({ searchParams }: PageProps) => {
  const search = await searchParams;
  const { rows, totalRecords, page, pageSize } = await newsService.getNews(
    search.page || 1,
    search.pageSize || 9,
    search.tagID,
    search.orderBy || "createdAt",
    search.sortBy || "desc",
    search.search,
    search.searchBy,
  );

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
    <NewsListComponent
      news={rows}
      totalRecords={totalRecords}
      page={page}
      pageSize={pageSize}
      apiBase={baseUrl}
      categories={categories}
    />
  );
};

export default page;
