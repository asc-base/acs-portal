import { notFound } from "next/navigation";

import { NewsBulletinManager } from "@/features/news/components/admin/newsbulletinmanager";
import { createMasterDataServerService } from "@/features/master-data/server";


export const dynamic = "force-dynamic";

export default async function NewsInformationPage({ params }: { params: Promise<{ tagId: string }> }) {
  const masterDataService = await createMasterDataServerService();

  const { tagId } = await params;
  const master = await masterDataService.getMasterData();
  const group = master?.tagsGroups?.find((item) => item.name === "news-feature");
  const selected = master?.tags?.find((item) => item.id === Number(tagId) && item.tagsGroupsId === group?.id);
  const type = selected?.name.toLowerCase() === "newshighlight"
    ? "HIGHLIGHT"
    : selected?.name.toLowerCase() === "announcement"
      ? "ANNOUNCEMENT"
      : null;
  if (!type) notFound();
  return <NewsBulletinManager type={type} />;
}
