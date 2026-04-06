import { newsService } from "@/infra/container";
import NewsMediaListComponent from "@/components/newsinformation.list.component";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    tagId: number;
  }>;
}

const page = async ({params}: PageProps) => {
  const pageSize = 6;
  const { tagId } = await params;

  const { rows } = await newsService.getNewsInformations(
    tagId,
    1,
    pageSize,
  );
  return (
    <NewsMediaListComponent
      newsInformation={rows}
      tagId={tagId}
      pageSize={pageSize}
    />
  );
};

export default page;
