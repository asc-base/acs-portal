import { notFound } from "next/navigation";

import { NewsBulletinManager } from "@/features/news/components/admin/newsbulletinmanager";

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type: value } = await params;
  const type = value === "highlight" ? "HIGHLIGHT" : value === "announcement" ? "ANNOUNCEMENT" : null;
  if (!type) notFound();
  return <NewsBulletinManager type={type} />;
}
