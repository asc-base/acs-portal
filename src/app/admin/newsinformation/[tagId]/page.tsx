import { notFound } from "next/navigation";
import { baseUrl, masterDataService } from "@/infra/container";
import { NewsBulletinManager } from "@/components/newsbulletinmanager";

export const dynamic = "force-dynamic";

export default async function NewsInformationPage({ params }: { params: Promise<{ tagId: string }> }) {
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
  return <NewsBulletinManager apiBase={baseUrl} type={type} />;
}
