import CreateNewsForm from "@/features/news/components/admin/create/create.news.form";


export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import { createMasterDataServerService } from "@/features/master-data/server";


const Page = async () => {
  const masterDataService = await createMasterDataServerService();

  const masterData = await masterDataService.getMasterData();
  const categories = masterData?.newsCategories ?? [];

  return <CreateNewsForm categories={categories} />;
};

export default Page;
