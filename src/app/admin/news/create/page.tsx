import CreateNewsForm from "./create.news.form";
import { baseUrl, masterDataService } from "@/infra/container";

import React from "react";

const Page = async () => {
  const data = await masterDataService.getMasterData();

  const newsGroup = data.tagsGroups.find(
    (group: { name: string }) => group.name === "news",
  );

  const tags = newsGroup
    ? data.tags.filter(
        (tag: { tagsGroupsId: string | number }) =>
          String(tag.tagsGroupsId) === String(newsGroup.id),
      )
    : [];

  return <CreateNewsForm apiBase={baseUrl} tags={tags} />;
};

export default Page;
