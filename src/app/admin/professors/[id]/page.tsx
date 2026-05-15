import React from "react";
import { professorService } from "@/infra/container";
import { masterDataService } from "@/infra/container";
import ProfessorFormComponent from "./professor.form.component";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolveParams = await params;
  const professor = await professorService.getProfessorById(resolveParams.id);
  const masterData = await masterDataService.getMasterData();
  const educationLevel = masterData.educationLevels;
  const academicPosition = masterData.academicPositions;

  return (
    <ProfessorFormComponent
      professor={professor}
      academicPositions={academicPosition}
      educationLevel={educationLevel}
      apiBase={baseUrl}
    />
  );
}
