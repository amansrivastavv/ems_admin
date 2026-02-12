export enum EmployeeStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PROBATION = "Probation",
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "admin" | "hr" | "employee";
  department: string;
  position: string;
  status: EmployeeStatus;
  joinDate: string; // ISO date string
  avatarUrl?: string;
  phoneNumber?: string;
}
