import NewsListComponent from "@/features/news/components/admin/news.list.component";

import { QueryNews } from "@/features/news/domain/news";
import { createNewsServerService } from "@/features/news/server";
import { createMasterDataServerService } from "@/features/master-data/server";


export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<QueryNews>;
}

const page = async ({ searchParams }: PageProps) => {
  const newsService = await createNewsServerService();
  const masterDataService = await createMasterDataServerService();

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
      categories={categories}
    />
  );
};

export default page;
