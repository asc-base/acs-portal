import { IUser } from "./user";
// import { IProject } from "./project";
export interface IStudent {
  id: number;
  studentCode: string;
  user: IUser;
  // classBook: IClassBook;
  // yearOfFirstAdmission:string | null;
  // yearOfCompletion:string | null;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  github?: string | null;
  // projects: IProject[];
}

export interface QueryStudent {
  page?: number;
  pageSize?: number;
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
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  classBookID: number;
}

export interface IUpdateStudent {
  studentCode?: string;
  email?: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  nickName?: string;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  github?: string | null;
}

export interface ICreateStudentCsv {
  studentCode: string;
  email: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  nickName?: string;
}
