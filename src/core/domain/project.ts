import { IStudent } from "./student";
import { ListType } from "@/interface/type";
import { ICourse } from "./course";
import { IUser } from "./user";

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
  assetsURL: string[];
  techStacks: string[];
  member: IUser[];
  tag: ListType[];
  course: ICourse[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  createdBy: number;
  updatedBy: number;
}

export interface ICreateProject {
  title: string;
  details: string;
  youtubeURL: string;
  githubURL: string;
  documentURL: string;
  presentationURL: string;
  figmaURL: string | null;
  coursesID: number[];
  tagsID: number[];
  techStacks: string[];
  members: { userID: number; roleID: number }[];
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
