import ProfileForm from "./profileform";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = async () => {
  return <ProfileForm apiBase={baseUrl} />;
};

export default page;
