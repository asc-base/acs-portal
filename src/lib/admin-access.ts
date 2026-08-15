import { UserProfile } from "@/core/domain/user";

const isAdminName = (value: unknown): boolean =>
  typeof value === "string" && value.trim().toLowerCase() === "admin";

/**
 * Treat a user as an admin only when the authenticated profile explicitly
 * contains an Admin role. Unknown/missing roles are denied.
 */
export const isAdminUser = (
  user: UserProfile | null | undefined,
): boolean => user?.roles.some((role) => isAdminName(role.name)) ?? false;
