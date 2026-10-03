import React from "react";
import { FormUpdateProject } from "./form.update.project";
import { 
  baseUrl, 
  courseService, 
  masterDataService, 
  studentService, 
  professorService,
  projectService
} from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: PageProps) {
  const resolveParams = await params;
  const projectId = resolveParams.id;

  const [projectData, coursesRes, masterData, studentsRes, professorsRes] = await Promise.all([
    projectService.getProjectById(projectId),
    courseService.getCourse({}),
    masterDataService.getMasterData(),
    studentService.getStudents({
      search: "",
      orderBy: "studentCode",
      sortBy: "asc",
    }),
    professorService.getProfessors({}), 
  ]);

  return (
    <FormUpdateProject 
      apiBase={baseUrl} 
      projectId={projectId}
      initialProject={projectData}
      initialCourses={coursesRes.rows || []}
      initialMasterData={masterData}
      initialStudents={studentsRes.rows || []}
      initialProfessors={professorsRes.rows || []}
    />
  );
}
