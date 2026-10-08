import type { UserResponse } from "@/shared/schema/profile-response";

export type { UserPrefix } from "@/shared/schema/profile-response";
export type IUser = UserResponse;

export interface UserRole {
    id: number;
    name: string;
}

export interface UserProfile extends IUser {
    roles: UserRole[];
}
