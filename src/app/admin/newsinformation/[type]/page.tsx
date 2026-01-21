import { newsService } from "@/infra/container";
import NewsMediaListComponent from "@/components/newsinformation.list.component";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

const page = async ({params}: PageProps) => {
  const pageSize = 6;
  const { type } = await params;

  const newsInformation = await newsService.getNewsInformations(
    type,
    1,
    pageSize,
  );
  return (
    <NewsMediaListComponent
      newsInformation={newsInformation}
      type={type}
      pageSize={pageSize}
    />
  );
};

export default page;
