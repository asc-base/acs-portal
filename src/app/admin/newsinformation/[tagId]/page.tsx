import { newsService } from "@/infra/container";
import NewsMediaListComponent from "@/components/newsinformation.list.component";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { tagId: number }
}

const page = async ({params}: PageProps) => {
  const pageSize = 6;
  const { tagId } = await params;

  const { rows } = await newsService.getNewsInformations(
    1,
    pageSize,
    tagId,
  );
  return (
    <NewsMediaListComponent
      newsInformation={rows}
      tagID={tagId}
      pageSize={pageSize}
    />
  );
};

export default page;
