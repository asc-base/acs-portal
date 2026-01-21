import CreateNewsForm from "./create.news.form";
import { baseUrl, masterDataService } from "@/infra/container";

const page = async () => {
  const categories = await masterDataService.getMasterDataListType("news");

  return <CreateNewsForm apiBase={baseUrl} categories={categories} />;
};

export default page;
