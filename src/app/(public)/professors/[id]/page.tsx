import React from "react";
import ProfessorsInfoComponent from "@/features/professors/components/public/[id]/professorsinfo.component";
import { createProfessorServerService } from "@/features/professors/server";




interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const professorService = await createProfessorServerService();

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
