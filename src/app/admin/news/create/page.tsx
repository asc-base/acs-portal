import CreateNewsForm from "./create.news.form";
import { baseUrl, masterDataService } from "@/infra/container";

const page = async () => {
  const data  = await masterDataService.getMasterData();

  const newsGroup = data.tagsGroups.find(
    (group: any) => group.name === "news"
  );

  const tags = newsGroup
    ? data.tags.filter(
        (tag: any) => tag.tagsGroupsId === newsGroup.id
      )
    : [];

  return (
    <CreateNewsForm
      apiBase={baseUrl}
      tags={tags}
    />
  );
};

export default page;