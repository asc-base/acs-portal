import ProjectInfoComponent from "./projectinfo.component";
import { projectService } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const info = await projectService.getProjectById(id);

  console.log(info);

  return <ProjectInfoComponent project={info} />;
};

export default Page;
