import { NewsInformationInfo } from "@/components/newsinformationInfo";
import { baseUrl, newsService, masterDataService } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    const { type, id } = await params;
    const newsInformationId = Number(id);

    const newsInformation = await newsService.getNewsInformationById(newsInformationId);

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
            <NewsInformationInfo
                type={type}
                apiBase={baseUrl}
                typeId={selectedType.id}
                newsInformation={newsInformation}
            />
        </div>
    );
};

export default Page;
