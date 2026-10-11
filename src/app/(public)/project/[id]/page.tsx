import ProjectInfoComponent from "@/features/projects/components/public/[id]/projectinfo.component";
import { createProjectServerService } from "@/features/projects/server";



export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const projectService = await createProjectServerService();

  const { id } = await params;
  const info = await projectService.getProjectById(id);

  console.log(info);

  return <ProjectInfoComponent project={info} />;
};

export default Page;
