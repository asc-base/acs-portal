import React from "react";
import { FormProjects } from "./form.projects";
import { 
  baseUrl, 
  courseService, 
  masterDataService, 
  studentService, 
  professorService 
} from "@/infra/container";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ 
    page:number;
    pageSize:number;
    classBookID:number;
    search?:string;
    orderBy?:string;
    sortBy?:"asc" | "desc";}>;
}

export default async function page({ searchParams }: PageProps) {

  const resolvedParams = await searchParams;

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
      apiBase={baseUrl} 
      initialCourses={coursesRes.rows || []}
      initialMasterData={masterData}
      initialStudents={studentsRes.rows || []}
      initialProfessors={professorsRes.rows || []}
    />
  );
}
