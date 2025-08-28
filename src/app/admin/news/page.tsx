import { newsService } from "@/infra/container";
import NewsListComponent from "./news.list.component";

export default async function NewsPage() {
  const { rows } = await newsService.getNews(1, 10);

  return <NewsListComponent news={rows} />;
}
