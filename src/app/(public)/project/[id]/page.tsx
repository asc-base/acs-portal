import ProjectInfoComponent from "./projectinfo.component";
import { projectService } from "@/infra/container";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const info = await projectService.getProjectById(id);
  return <ProjectInfoComponent project={info} />;
};

export default Page;
