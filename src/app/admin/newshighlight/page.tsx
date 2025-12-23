import { newsService } from "@/infra/container";
import NewsInformationListComponent from "@/components/newsinformation.list.component";

export const dynamic = "force-dynamic";

const page = async () => {
  const pageSize = 5;
  const type = "newshighlight";

  const newsInformation = await newsService.getNewsInformations(
    type,
    1,
    pageSize,
  );
  return (
    <NewsInformationListComponent
      newsInformation={newsInformation}
      type={type}
      pageSize={pageSize}
    />
  );
};

export default page;
