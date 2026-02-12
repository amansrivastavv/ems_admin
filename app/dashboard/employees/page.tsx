"use client"

import { EmployeeTable } from "@/components/tables/EmployeeTable"
import { Employee, EmployeeStatus } from "@/types/employee"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const data: Employee[] = [
  {
    id: "728ed52f",
    name: "John Doe",
    email: "m@example.com",
    role: "admin",
    status: EmployeeStatus.ACTIVE,
    department: "Management",
    position: "CEO",
    joinDate: "2023-01-01",
  },
  {
    id: "489e1d42",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "hr",
    status: EmployeeStatus.ACTIVE,
    department: "HR",
    position: "HR Manager",
    joinDate: "2023-02-15",
  },
   {
    id: "489e1d43",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "employee",
    status: EmployeeStatus.INACTIVE,
    department: "Engineering",
    position: "Frontend Dev",
    joinDate: "2023-03-10",
  },
   {
    id: "489e1d44",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "employee",
    status: EmployeeStatus.PROBATION,
    department: "Sales",
    position: "Sales Rep",
    joinDate: "2023-04-05",
  },
  // ... more mock data
]

export default function EmployeesPage() {
    const router = useRouter();

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
                <p className="text-muted-foreground">
                    Manage your employees and their roles here.
                </p>
            </div>
             <Button onClick={() => router.push('/dashboard/employees/new')}>
                <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
        </div>
        
        <Card>
            <CardContent className="pt-6">
                 <EmployeeTable data={data} />
            </CardContent>
        </Card>
      
    </div>
  )
}
