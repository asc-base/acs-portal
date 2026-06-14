import { IStudent } from "./student";
import { ListType } from "@/interface/type";
import { ICourse } from "./course";

export interface IProject {
  id: number;
  title: string;
  thumbnailURL: string;
  details: string;
  githubURL: string;
  presentationURL: string;
  documentURL: string;
  figmaURL: string;
  youtubeURL: string;
  //assetsURL: IProjectAssets[]; ดึงมาตามinterface แต่ว่าข้อมูลที่ได้จากbackendเป็น arrayของstringธรรมดา(พอดูในfigmaเหมือนจะเป็นภาพ)
  assetsURL: string[];
  techStacks: string[];
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

export interface ICreateProject {
  title: string;
  thumbnail: string;
  detail: string;
  youtube: string;
  projectCourses: string[];
  projectTypes: string[];
  projectCategories: string[];
  github: string;
  document: string;
  presentation: string;
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
