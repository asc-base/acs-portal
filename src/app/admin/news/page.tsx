import { newsService } from "@/infra/container";
import NewsListComponent from "./news.list.component";

export default async function NewsPage() {
  const { rows, page, pageSize, totalRecords } = await newsService.getNews(
    1,
    10,
  );

  console.log({ rows, page, pageSize, totalRecords });

  return <NewsListComponent news={rows} />;
}
