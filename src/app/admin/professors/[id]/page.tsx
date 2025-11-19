import React from "react";
import { professorService } from "@/infra/container";
import { masterDataService } from "@/infra/container";
import ProfessorFormComponent from "./professor.form.component";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const resolveParams = await params;
  const professor = await professorService.getProfessorById(resolveParams.id);
  const masterData = await masterDataService.getMasterData();
  const majorPositions = masterData.majorPositions;
  const educationLevel = masterData.educationLevels;
  const academicPosition = masterData.academicPositions;

  return (
    <ProfessorFormComponent
      professor={professor}
      academicPosition={academicPosition}
      majorPosition={majorPositions}
      educationLevel={educationLevel}
    />
  );
}
