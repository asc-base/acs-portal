import { ICurriculum } from "./curriculum";

export interface ICourse {
  id: number;
  courseId: string;
  courseNameTh: string;
  courseNameEn: string;
  credits: string;
  courseDetail: string;
  createdBy: number;
  updatedBy: number;
  createdDate: Date;
  updatedDate: Date;
  curriculum: ICurriculum;
  preCourses: ICourse[];
}

export interface QueryCourse {
  page?: number;
  pageSize?: number;
  prerequisite?: boolean;
  curriculumId?: number;
  typecourseId?: number;
}
