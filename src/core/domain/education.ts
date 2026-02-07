import { EducationLevel } from "./master-data";

export interface IEducation {
  id: number;
  education: string;
  university: string;
  level: EducationLevel;
  createdDate: Date;
  updatedDate: Date;
  createdBy: number;
  updatedBy: number;
}

export interface IUpdateEducation {
  id: number;
  education: string;
  university: string;
  levelId: number;
}

export interface INewEducation {
  education: string;
  university: string;
  level: number;
}
