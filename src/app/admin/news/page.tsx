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
    search.pageSize || 12,
    search.tagID,
    search.orderBy,
    search.sortBy,
    search.search,
    search.searchBy,
  );

  const masterData = await masterDataService.getMasterData();
  const categories = masterData?.newsCategories ?? [];
    
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
