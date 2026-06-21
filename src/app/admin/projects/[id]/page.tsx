import React from "react";
import {
  projectService,
  courseService,
  masterDataService,
  studentService,
  professorService,
  classBookService,
} from "@/infra/container";
import ProjectForm from "./project.form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const project = await projectService.getProjectById(projectId);

  const coursesData = await courseService.getCourse({ curriculumID: 1, page: 1, pageSize: 1000 });
  const masterData = await masterDataService.getMasterData();

  const classBooksData = await classBookService.getClassBooks({ page: 1, pageSize: 100 });
  const allStudentsPromises = classBooksData.rows.map(cb =>
    studentService.getStudents({ page: 1, pageSize: 1000, classBookID: cb.id })
      .then(res => res.rows)
      .catch(err => {
        console.error(`Failed to fetch students for classBook ${cb.id}:`, err);
        return [];
      })
  );
  const studentsDataArrays = await Promise.all(allStudentsPromises);
  const studentsFromAllCohorts = studentsDataArrays.flat();

  const uniqueStudentsMap = new Map();
  studentsFromAllCohorts.forEach(s => {
    if (s && s.user && s.user.id) {
      uniqueStudentsMap.set(s.user.id.toString(), s);
    }
  });

  const professorsData = await professorService.getProfessors({ page: 1, pageSize: 1000 });

  const studentUserIDs = project?.member
    ?.filter((m: any) => m.role?.id === 2)
    .map((m: any) => m.id) || [];
  const missingStudentUserIDs = studentUserIDs.filter((id) => !uniqueStudentsMap.has(id.toString()));

  const missingStudents = await Promise.all(
    missingStudentUserIDs.map(async (id) => {
      try {
        return await studentService.getStudentByUserId(id);
      } catch (err) {
        console.error(`Failed to fetch student for user ID ${id}:`, err);
        return null;
      }
    })
  );

  missingStudents.forEach(s => {
    if (s && s.user && s.user.id) {
      uniqueStudentsMap.set(s.user.id.toString(), s);
    }
  });

  const allStudents = Array.from(uniqueStudentsMap.values());

  return (
    <ProjectForm
      project={project}
      courses={coursesData.rows}
      masterData={masterData}
      students={allStudents}
      professors={professorsData.rows}
    />
  );
}
