import { EducationLevel } from "@/features/master-data/domain/master-data";

export interface IEducation {
  id: number;
  education: string;
  university: string;
  level: EducationLevel;
  createdDate: Date;
  updatedDate: Date;
}

export interface IUpdateEducation {
  id: number;
  education: string;
  university: string;
  level: number;
}

export interface INewEducation {
  education: string;
  university: string;
  level: number;
}
