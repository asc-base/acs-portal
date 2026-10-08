import { IUser } from "@/features/auth/types/user";

export interface ProfessorCardProps {
  id: number;
  user: IUser;
  profRoom: string;
}