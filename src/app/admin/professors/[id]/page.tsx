import React from "react";


import ProfessorFormComponent from "@/features/professors/components/admin/[id]/professor.form.component";
import { createProfessorServerService } from "@/features/professors/server";
import { createMasterDataServerService } from "@/features/master-data/server";



export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const professorService = await createProfessorServerService();
  const masterDataService = await createMasterDataServerService();

  const resolveParams = await params;
  const professor = await professorService.getProfessorById(resolveParams.id);
  const masterData = await masterDataService.getMasterData();
  const educationLevel = masterData.educationLevels;
  const prefixes = masterData.prefixes;

  return (
    <ProfessorFormComponent
      professor={professor}
      prefixes={prefixes}
      educationLevel={educationLevel}
    />
  );
}
