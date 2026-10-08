import React from "react";
import { FormProjects } from "@/features/projects/components/admin/create/form.projects";
import { createCourseServerService } from "@/features/courses/server";
import { createMasterDataServerService } from "@/features/master-data/server";
import { createStudentServerService } from "@/features/students/server";
import { createProfessorServerService } from "@/features/professors/server";



export const dynamic = "force-dynamic";

export default async function page() {
  const courseService = await createCourseServerService();
  const masterDataService = await createMasterDataServerService();
  const studentService = await createStudentServerService();
  const professorService = await createProfessorServerService();


  const [coursesRes, masterData, studentsRes, professorsRes] = await Promise.all([
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
    <FormProjects 
      initialCourses={coursesRes.rows || []}
      initialMasterData={masterData}
      initialStudents={studentsRes.rows || []}
      initialProfessors={professorsRes.rows || []}
    />
  );
}
