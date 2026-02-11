import { IUser } from "./user";
import { Position } from "./master-data";
import { IExpertField, IUpdateExpertField } from "./expert-field";
import { IEducation, IUpdateEducation, INewEducation } from "./education";

export interface IProfessor {
  id: number;
  user: IUser;
  majorPosition: Position;
  academicPosition: Position;
  profRoom: string;
  expertFields: IExpertField[];
  educations: IEducation[];
  phone: string;
}

export interface IUpdateProfessor {
  academicPositionId: number;
  majorPositionId: number;
  profRoom: string;
  phone: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  email: string;
  newExpertFields: string[];
  updatedExpertFields: IUpdateExpertField[];
  deletedExpertFieldIds: number[];
  newEducation: INewEducation[];
  updatedEducation: IUpdateEducation[];
  deletedEducationIds: number[];
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
  academicPositionId: number;
  education?: INewEducation[];
  email: string;
  expertFields?: string[];
  firstNameEn?: string;
  firstNameTh: string;
  image?: string;
  lastNameEn?: string;
  lastNameTh: string;
  majorPositionId: number;
  phone: string;
  profRoom: string;
}
