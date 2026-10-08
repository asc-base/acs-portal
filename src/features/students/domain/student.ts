import type { StudentResponse } from "@/shared/schema/profile-response";
// import { IProject } from "@/features/projects/domain/project";
export type IStudent = StudentResponse;

export interface QueryStudent {
  page?: number;
  pageSize?: number;
  classBookID?: number;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
}

export interface ICreateStudent {
  studentCode: string;
  email: string;
  prefixID?: number | null;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string | null;
  lastNameEn: string | null;
  nickName?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  classBookID: number;
  imageFile?: File;
  imageFocalPointX?: number;
  imageFocalPointY?: number;
}

export interface IUpdateStudent {
  studentCode?: string;
  email?: string;
  prefixID?: number | null;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string | null;
  lastNameEn?: string | null;
  nickName?: string;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  github?: string | null;
  skills?: string[];
  imageFile?: File;
  imageFocalPointX?: number;
  imageFocalPointY?: number;
}
