import { redirect } from "next/navigation";

export default async function LegacyNewsBulletinEdit({ params }: { params: Promise<{ tagId: string }> }) {
  const { tagId } = await params;
  redirect(`/admin/newsinformation/${tagId}`);
}
