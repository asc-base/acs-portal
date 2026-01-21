import { NewsInformationForm } from "@/components/newsinformationform";
import { baseUrl, masterDataService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

const page = async ({params}: PageProps) => {
  const { type } = await params; 

  const types = await masterDataService.getMasterDataListType("news");
  const selectedType = types.find(
    (item) => item.name === type
  );

  if (!selectedType) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="font-bold">Not found {type} </h2>
    </div>
  );
  }

  return (
    <div className="w-full">
      <NewsInformationForm
        type={type}
        apiBase={baseUrl}
        typeId={selectedType.id}
      />
    </div>
  );
};

export default page;