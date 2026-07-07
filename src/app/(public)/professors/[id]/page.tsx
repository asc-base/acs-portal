import React from "react";
import ProfessorsInfoComponent from "./professorsinfo.component";
import { professorService } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const professorsInfo = await professorService.getProfessorById(id);

  return (
    <div>
      <ProfessorsInfoComponent
        professorsInfo={professorsInfo}
      />
    </div>
  );
};

export default page;