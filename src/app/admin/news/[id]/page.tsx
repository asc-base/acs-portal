import { notFound } from "next/navigation";
import NewsInfo from "@/features/news/components/admin/[id]/news.info";
import { createMasterDataServerService } from "@/features/master-data/server";
import { createNewsServerService } from "@/features/news/server";



export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const masterDataService = await createMasterDataServerService();
  const newsService = await createNewsServerService();

  const { id } = await params;

  const news = await newsService.getNewsById(id);
  if (!news) notFound();

  const masterData = await masterDataService.getMasterData();
  const categories = masterData?.newsCategories ?? [];

  return (
    <div>
      <NewsInfo news={news} categories={categories} />
    </div>
  );
};

export default page;
