"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "hr", "employee"]),
  department: z.string().min(2, "Department is required"),
  position: z.string().min(2, "Position is required"),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
  initialData?: EmployeeFormValues
}

export function EmployeeForm({ initialData }: EmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
        role: "employee"
    },
  })

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
        console.log("Submitted:", data)
        setIsLoading(false)
        router.push("/dashboard/employees")
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" {...register("department")} />
            {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" {...register("position")} />
            {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
        </div>

         <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("role")}
            >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Employee"}
        </Button>
      </div>
    </form>
  )
}
