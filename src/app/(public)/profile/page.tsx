import ProfileForm from "./profileform";
import { baseUrl } from "@/infra/container";

const page = async () => {
  return <ProfileForm apiBase={baseUrl} />;
};

export default page;
