import { IUser } from "./user";
export interface StudentCardProps {
    id: number;
    studentId: string;
    user: IUser;
    linkin?: string | null;
    facebook?: string | null;
    instragram?: string | null;
    github?: string | null;
}