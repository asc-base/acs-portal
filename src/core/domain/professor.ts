import { IUser } from "./user";
import { Position } from "./master-data";
import { IExpertField ,IUpdateExpertField } from "./expert-field";
import { IEducation , IUpdateEducation} from "./education";

export interface IProfessor {
    id: number;
    user: IUser;
    majorPosition: Position;
    academicPosition: Position;
    profRoom: string;
    expertFields: IExpertField[];
    educations: IEducation[];
    phone:string;
}

export interface IUpdateProfessor {
    id: number;
    user: IUser;
    majorPosition: Position;
    academicPosition: Position;
    profRoom: string;
    expertFields: IUpdateExpertField[];
    educations: IUpdateEducation[];
    phone:string;
}

export interface QueryProfessor {
  page?: number;
  pageSize?: number;
  educations?: string;
  expertFields?: string;
  majorPosition?: string;
  academicPosition?: string;
}