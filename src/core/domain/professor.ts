import { IUser } from "./user";
import { Position } from "./master-data";
import { IExpertField } from "./expert-field";
import { IEducation } from "./education";

export interface IProfessor {
    id: number;
    user: IUser;
    majorPositions: Position;
    academicPosition: Position;
    profRoom: string;
    expertFields: IExpertField[];
    educations: IEducation[];
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