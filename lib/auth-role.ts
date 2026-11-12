export type UserRole = "seeker" | "recruiter" | "admin"

export function resolveUserRole(role: unknown, requestedRole: unknown): UserRole {
  if (role === "seeker" || role === "recruiter" || role === "admin") {
    return role
  }

  return requestedRole === "recruiter" ? "recruiter" : "seeker"
}
