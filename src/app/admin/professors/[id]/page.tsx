import {
  baseUrl,
  professorService,
  masterDataService,
} from "@/infra/container";
import ProfessorFormComponent from "./professor.form.component";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Readonly<PageProps>) {
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
      apiBase={baseUrl}
    />
  );
}
