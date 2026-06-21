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

  const coursesData = await courseService.getCourse({ curriculumID: 1 });
  const masterData = await masterDataService.getMasterData();

  const classBooksData = await classBookService.getClassBooks({});
  const allStudentsPromises = classBooksData.rows.map(classBook =>
    studentService.getStudents({ classBookID: classBook.id })
      .then(res => res.rows)
      .catch(err => {
        console.error(`Failed to fetch students for classBook ${classBook.id}:`, err);
        return [];
      })
  );
  const studentsDataArrays = await Promise.all(allStudentsPromises);
  const studentsFromAllCohorts = studentsDataArrays.flat();

  const professorsData = await professorService.getProfessors({});

  return (
    <ProjectForm
      project={project}
      courses={coursesData.rows}
      masterData={masterData}
      students={studentsFromAllCohorts}
      professors={professorsData.rows}
    />
  );
}
