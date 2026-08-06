import type { IUser as DomainUser } from "@/core/domain/user";

export interface InputLogin {
  email: string;
  password: string;
}

export type IUser = DomainUser;
