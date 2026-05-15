import { ICurriculum } from "./curriculum";
import { TypeCourse } from "./master-data";

export interface ITypeCourse {
  id: number;
  name: string;
  description: string;
}

export interface ICourse {
  id: number;
  courseCode: string;
  courseNameTh: string;
  courseNameEn: string;
  credits: string;
  detail: string;
  createdBy: number;
  updatedBy: number;
  createdDate: Date;
  updatedDate: Date;
  curriculum: ICurriculum;
  prerequisites: ICourse[];
  typeCourse: TypeCourse;
}

export interface QueryCourse {
  page?: number;
  pageSize?: number;
  prerequisite?: boolean;
  curriculumID: number;
  typeCourseID?: number;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
}

export interface ICreateCourse {
  courseCode: string;
  typeCourseID: number;
  courseNameTh: string;
  courseNameEn: string;
  credits: string;
  detail: string;
  preCoursesID?: number[];
  curriculumID: number;
}

export interface IUpdateCourse {
  courseCode?: string;
  typeCourseID?: number;
  courseNameTh?: string;
  courseNameEn?: string;
  credits?: string;
  detail?: string;
  curriculumID: number;
  newPrecourseId?: number[];
  deletePrecourseId?: number[];
}
