import { IUser } from "./user";
import { IProject } from "./project";
import { IClassBook } from "./classbook";
export interface IStudent {
    id: number;
    studentId: string;
    user: IUser;
    classBook: IClassBook;
    linkin?: string | null;
    facebook?: string | null;
    instragram?: string | null;
    github?: string | null;
    projects: IProject[];
}

export interface QueryStudent
{
    page: number,
    pageSize: number,
    classBookId: number,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc";
}

export interface ICreateStudent {
    studentId: string;
    email: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    nickName?: string;
}