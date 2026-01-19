import { NewsInformationInfo } from "@/components/newsinformationInfo";
import { baseUrl, newsService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const newsInformationId = Number(id);

  const newsInformation = await newsService.getNewsInformationById(newsInformationId);

  return (
    <div className="w-full">
      <NewsInformationInfo
        type="announcement"
        apiBase={baseUrl}
        typeId={19}
        newsInformation={newsInformation}
      />
    </div>
  );
};

export default Page;
