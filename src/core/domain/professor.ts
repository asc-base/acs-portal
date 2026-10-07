import type { ProfessorResponse } from "../schema/profile-response";

export type IProfessor = ProfessorResponse;

export interface IUpdateProfessor {
  id: number;
  prefixID: number;
  profRoom: string;
  phone: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string | null;
  lastNameEn: string | null;
  email: string;
  expertFields?: string;
  educations?: string;
  research_profile?: string | null;
}

export interface QueryProfessor {
  page?: number;
  pageSize?: number;
  educations?: string;
  expertFields?: string;
  majorPosition?: string;
  academicPosition?: string;
  search?: string;
  searchBy?: string;
}

export interface ICreateProfessor {
  prefixID: number;
  educations?: string;
  email: string;
  expertFields?: string;
  firstNameEn?: string | null;
  firstNameTh: string;
  image?: string;
  lastNameEn?: string | null;
  lastNameTh: string;
  phone: string;
  profRoom: string;
  research_profile?: string | null;
}
