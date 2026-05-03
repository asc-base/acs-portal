import { NewsInformationForm } from "@/components/newsinformationform";
import { baseUrl, masterDataService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    tagId: number;
  }>;
}

const page = async ({params}: PageProps) => {
  const { tagId } = await params; 

  const types = await masterDataService.getMasterDataListType("news");
  const selectedType = types.find(
    (item) => item.id === tagId
  );

  if (!selectedType) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="font-bold">Not found {tagId} </h2>
    </div>
  );
  }

  return (
    <div className="w-full">
      <NewsInformationForm
        type={selectedType.name}
        apiBase={baseUrl}
        tagId={selectedType.id}
      />
    </div>
  );
};

export default page;