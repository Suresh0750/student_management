import type { AuthUser } from "./auth-context";

export type AppRole = "ADMIN" | "TEACHER" | "STUDENT";

export function getUserRole(user: AuthUser | null): AppRole | null {
  if (!user || typeof user !== "object") return null;

  const maybeRole = (user as { role?: unknown }).role;
  if (typeof maybeRole !== "string") return null;

  const normalizedRole = maybeRole.trim().toUpperCase();
  if (
    normalizedRole === "ADMIN" ||
    normalizedRole === "TEACHER" ||
    normalizedRole === "STUDENT"
  ) {
    return normalizedRole as AppRole;
  }

  return null;
}
