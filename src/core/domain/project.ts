import { IStudent } from "./student";
import { ListType } from "@/interface/type";
import { ICourse } from "./course";

export interface IProject {
  id: number;
  title: string;
  thumbnail: string;
  detail: string;
  github: string;
  presentation: string;
  document: string;
  figma: string;
  youtube: string;
  projectAssets: IProjectAssets[];
  projectMembers: IStudent[];
  projectCategories: ListType[];
  projectFields: ListType[];
  projectTypes: ListType[];
  projectCourses: ICourse[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  createdBy: number;
  updatedBy: number;
}

export interface QueryProject {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string[];
  categories?: string[];
  types?: string[];
  courses?: string[];
  classBooks?: string[];
  search?: string;
}

export interface IProjectAssets {
  id: number;
  projectId: number;
  asset: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  createdBy: number;
  updatedBy: number;
}
