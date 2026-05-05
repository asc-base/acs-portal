import { NewsInformationInfo } from "@/components/newsinformationInfo";
import { baseUrl, newsService, masterDataService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    tagId: string;
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { tagId, id } = await params;
  const newsInformationId = Number(id);

  const newsInformation = await newsService.getNewsInformationById(newsInformationId);

  const masterData = await masterDataService.getMasterData();

  const tagIdNumber = Number(tagId);

  const newsFeatureGroup = masterData?.tagsGroups?.find(
    (group) => group.name === "news-feature"
  );


  const selectedType = masterData?.tags?.find(
    (tag) =>
      tag.id === tagIdNumber &&
      tag.tagsGroupsId === newsFeatureGroup?.id
  );

  if (!selectedType) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="font-bold">Not found {tagId}</h2>
      </div>
    );
  }

  return (
    <div className="w-full">
      <NewsInformationInfo
        type={selectedType.name}
        apiBase={baseUrl}
        tagID={selectedType.id}
        newsInformation={newsInformation}
      />
    </div>
  );
};

export default Page;
