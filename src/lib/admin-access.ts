import { IUser } from "@/core/domain/user";

type NamedAccess = {
  name?: unknown;
};

type UserAccessClaims = Partial<IUser> & {
  group?: unknown;
  groups?: unknown;
};

const isAdminName = (value: unknown): boolean =>
  typeof value === "string" && value.trim().toLowerCase() === "admin";

const hasAdminClaim = (value: unknown): boolean => {
  if (isAdminName(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(hasAdminClaim);
  }

  if (typeof value === "object" && value !== null) {
    return isAdminName((value as NamedAccess).name);
  }

  return false;
};

/**
 * Treat a user as an admin only when the authenticated profile explicitly
 * contains the Admin group. Unknown/missing claims are denied.
 */
export const isAdminUser = (user: IUser | null | undefined): boolean => {
  if (!user) {
    return false;
  }

  const claims = user as UserAccessClaims;
  return hasAdminClaim(claims.group) || hasAdminClaim(claims.groups);
};
