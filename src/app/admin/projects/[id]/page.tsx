import React from "react";
import { FormUpdateProject } from "@/features/projects/components/admin/[id]/form.update.project";
import { createCourseServerService } from "@/features/courses/server";
import { createMasterDataServerService } from "@/features/master-data/server";
import { createStudentServerService } from "@/features/students/server";
import { createProfessorServerService } from "@/features/professors/server";
import { createProjectServerService } from "@/features/projects/server";



export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: PageProps) {
  const courseService = await createCourseServerService();
  const masterDataService = await createMasterDataServerService();
  const studentService = await createStudentServerService();
  const professorService = await createProfessorServerService();
  const projectService = await createProjectServerService();

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
      projectId={projectId}
      initialProject={projectData}
      initialCourses={coursesRes.rows || []}
      initialMasterData={masterData}
      initialStudents={studentsRes.rows || []}
      initialProfessors={professorsRes.rows || []}
    />
  );
}
