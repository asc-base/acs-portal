import { IUser } from "./user";
// import { IProject } from "./project";
import { IClassBook } from "./classbook";
export interface IStudent {
  id: number;
  studentCode: string;
  user: IUser;
  // classBook: IClassBook;
  // yearOfFirstAdmission:string | null;
  // yearOfCompletion:string | null;
  linkedin?: string | null;
  facebook?: string | null;
  instragram?: string | null;
  github?: string | null;
  // projects: IProject[];
}

export interface QueryStudent {
  page: number;
  pageSize: number;
  classBookID: number;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
}

export interface ICreateStudent {
  studentCode: string;
  email: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  nickName?: string;
}

export interface IUpdateStudent {
  studentCode?: string;
  email?: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  nickName?: string;
  classBook?: IClassBook;
  linkedin?: string | null;
  facebook?: string | null;
  instragram?: string | null;
  github?: string | null;
}

export interface ICreateStudentCsv {
  Timestamp: string;
  studentCode: string;
  email: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  nickName?: string;
}
