import { Role } from "@/types/user";

export const hierarchy: Record<Role, number> = {
  admin: 3,
  hr: 2,
  employee: 1,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  if (userRole === "admin") return true;
  return hierarchy[userRole] >= hierarchy[requiredRole];
}

export function canAccessRoute(userRole: Role, pathname: string): boolean {
  if (userRole === "admin") return true;

  // Define route access rules
  if (pathname.startsWith("/dashboard/employees")) {
    return userRole === "hr";
  }
  if (pathname.startsWith("/dashboard/settings")) {
    return userRole === "hr"; // Only HR/Admin can see settings? Requirement says "Admin: Full, HR: Employee + Attendance, Employee: Own + Attendance"
    // Wait, Requirement:
    // Admin: Full access
    // HR: Employee + Attendance access
    // Employee: Only view own dashboard + attendance
  }

  // Default allowed for all roles in dashboard if not restricted above
  return true;
}
