import { NewsInformationForm } from "@/components/newsinformationform";
import { baseUrl, masterDataService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    tagId: number;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { tagId } = await params;

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
      <div className="flex items-center justify-center">
        <h2 className="font-bold">Not found {tagId}</h2>
      </div>
    );
  }

  return (
    <div className="w-full">
      <NewsInformationForm
        type={selectedType.name}
        apiBase={baseUrl}
        tagID={selectedType.id}
      />
    </div>
  );
};

export default page;