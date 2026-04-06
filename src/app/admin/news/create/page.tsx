import CreateNewsForm from "./create.news.form";
import { baseUrl, masterDataService } from "@/infra/container";

import React from "react";

const Page = async () => {
  const data = await masterDataService.getMasterData();

  // ✅ 1. เติม ?. ตรงนี้ เพื่อบอกว่า "ถ้า tagsGroups มีค่า ค่อย .find() นะ"
  const newsGroup = data?.tagsGroups?.find(
    (group: { name: string }) => group.name === "news",
  );

  // ✅ 2. ตรงนี้ที่คุณทำไว้ ถูกต้องแล้วครับ! ดักไว้เผื่อ tags ไม่มีค่า
  const tags = newsGroup
    ? data?.tags?.filter(
        (tag: { tagsGroupsId: string | number }) =>
          String(tag?.tagsGroupsId) === String(newsGroup?.id),
      )
    : [];

  return <CreateNewsForm apiBase={baseUrl} tags={tags} />;
};

export default Page;
