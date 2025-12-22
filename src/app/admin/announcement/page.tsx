import { newsService } from "@/infra/container";
import NewsMediaListComponent from "@/components/newsinformation.list.component";

export const dynamic = "force-dynamic";

const page = async () => {
  const pageSize = 6;
  const type = "announcement";

  const newsInformation = await newsService.getNewsInformations(
    type,
    1,
    pageSize,
  );
  console.log(newsInformation);
  return (
    <NewsMediaListComponent
      newsInformation={newsInformation}
      type={type}
      pageSize={pageSize}
    />
  );
};

export default page;
