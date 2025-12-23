import { newsService } from "@/infra/container";
import NewsMediaListComponent from "@/components/newsinformation.list.component";

export const dynamic = "force-dynamic";

const page = async () => {
  const pageSize = 6;
  const type = "announcement";

  const newsInformation = await newsService.getNewsMedias(type, 1, pageSize);
  return (
    <NewsMediaListComponent
      newsInformation={newsInformation}
      type={type}
      pageSize={pageSize}
    />
  );
};

export default page;
