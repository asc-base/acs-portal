import { IUser } from "./user";
import { IProject } from "./project";

export interface IStudent {
    id: number;
    studentId: string;
    user: IUser;
    description: string;
    yearOfFirstAdmission: string;
    linkin: string;
    facebook: string;
    instragram: string;
    github: string;
    classOf: string;
    projects: IProject[];
}
