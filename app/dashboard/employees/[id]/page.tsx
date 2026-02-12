"use client"

import { EmployeeForm } from "@/components/forms/EmployeeForm"
import { useParams } from "next/navigation"

export default function EmployeePage() {
  const params = useParams()
  const isNew = params.id === 'new'

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {isNew ? "Add Employee" : "Edit Employee"}
        </h2>
        <p className="text-muted-foreground">
          {isNew ? "Create a new employee profile." : "Update employee details."}
        </p>
      </div>
      <div className="border-t pt-6">
        <EmployeeForm /> 
        {/* In real app, fetch data based on ID and pass as initialData if not new */}
      </div>
    </div>
  )
}
