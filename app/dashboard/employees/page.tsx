"use client"

import { EmployeeTable } from "@/components/tables/EmployeeTable"
import { Employee } from "@/types/employee"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { EmployeeForm } from "@/components/forms/EmployeeForm"
import { useState } from "react"

import { useEmployeeContext } from "@/context/EmployeeContext"
export default function EmployeesPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { employees, addEmployee } = useEmployeeContext();

    const handleAddEmployee = async (data: Omit<Employee, 'id' | 'joinDate' | 'status'>) => {
        addEmployee(data);
        // Ensure the sheet closes after the state update
        setIsSheetOpen(false);
        // Optional: Show success toast
    };

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
                <p className="text-muted-foreground">
                    Manage your employees and their roles here.
                </p>
            </div>
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-xl overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Add New Employee</SheetTitle>
                    </SheetHeader>
                    <EmployeeForm onSubmit={handleAddEmployee} />
                </SheetContent>
             </Sheet>
        </div>
        
        <Card>
            <CardContent className="pt-6">
                 <EmployeeTable data={employees} />
            </CardContent>
        </Card>
      
    </div>
  )
}
