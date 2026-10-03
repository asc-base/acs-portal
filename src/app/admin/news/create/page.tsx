import CreateNewsForm from "./create.news.form";
import { baseUrl, masterDataService } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";

const Page = async () => {
  const masterData = await masterDataService.getMasterData();
  const categories = masterData?.newsCategories ?? [];

  return <CreateNewsForm apiBase={baseUrl} categories={categories} />;
};

export default Page;
