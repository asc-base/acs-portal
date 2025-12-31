import CreateNewsForm from "./create.news.form";
import { baseUrl } from "@/infra/container";

const page = async () => {
  return <CreateNewsForm apiBase={baseUrl} />;
};

export default page;
