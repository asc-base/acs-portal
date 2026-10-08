import type { UserResponse } from "@/shared/schema/profile-response";
import type { Role } from "@/shared/schema/references";

export type { UserPrefix } from "@/shared/schema/profile-response";
export type IUser = UserResponse;

export type UserRole = Role;

export interface UserProfile extends IUser {
    roles: UserRole[];
}
