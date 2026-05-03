import { IUser } from "./user";
import { Position } from "./master-data";

export interface IProfessor {
  id: number;
  user: IUser;
  majorPosition: Position;
  academicPosition: Position;
  profRoom: string;
  expertFields: string[];
  educations: string[];
  phone: string;
}

export interface IUpdateProfessor {
  id: number;
  academicPositionId: number;
  majorPositionId: number;
  profRoom: string;
  phone: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  mail: string;
  expertFields?: string;
  educations?: string;
}

export interface QueryProfessor {
  page?: number;
  pageSize?: number;
  educations?: string;
  expertFields?: string;
  majorPosition?: string;
  academicPosition?: string;
}

export interface ICreateProfessor {
  academicPositionID: number;
  educations?: string;
  email: string;
  expertFields?: string;
  firstNameEn?: string;
  firstNameTh: string;
  image?: string;
  lastNameEn?: string;
  lastNameTh: string;
  phone: string;
  profRoom: string;
}
