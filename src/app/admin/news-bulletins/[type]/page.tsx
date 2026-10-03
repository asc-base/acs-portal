import { notFound } from "next/navigation";
import { baseUrl } from "@/infra/container";
import { NewsBulletinManager } from "@/components/newsbulletinmanager";

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type: value } = await params;
  const type = value === "highlight" ? "HIGHLIGHT" : value === "announcement" ? "ANNOUNCEMENT" : null;
  if (!type) notFound();
  return <NewsBulletinManager apiBase={baseUrl} type={type} />;
}
