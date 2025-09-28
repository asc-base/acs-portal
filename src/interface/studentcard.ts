import { IUser } from "./user";
export interface StudentCardProps {
    id: number;
    studentId:string;
    user: IUser;
    description: string;
    yearOfFirstAdmission:string;
    linkedin:string;
    facebook: string;
    instagram: string;
    github: string;
}