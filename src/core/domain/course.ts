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
  // preCourses: ICourse[];
  typeCourse: TypeCourse;
}

export interface QueryCourse {
  page?: number;
  pageSize?: number;
  prerequisite?: boolean;
  curriculumId: number;
  typeCourseId?: number;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
}

export interface ICreateCourse {
  courseId: string;
  typeCourseId: number;
  courseNameTh: string;
  courseNameEn: string;
  credits: string;
  courseDetail: string;
  prerequisites?: number[];
  curriculumId: number;
}

export interface IUpdateCourse {
  courseId?: string;
  typeCourseId?: number;
  courseNameTh?: string;
  courseNameEn?: string;
  credits?: string;
  courseDetail?: string;
  prerequisites?: number[];
  curriculumId: number;
}
