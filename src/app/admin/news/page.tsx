import NewsListComponent from "./news.list.component";
import { newsService } from "@/infra/container";

export default async function NewsPage() {
  const { rows, totalRecords, page, pageSize } = await newsService.getNews(
    1,
    9,
  );

  return (
    <NewsListComponent
      news={rows}
      totalRecords={totalRecords}
      page={page}
      pageSize={pageSize}
    />
  );
}
