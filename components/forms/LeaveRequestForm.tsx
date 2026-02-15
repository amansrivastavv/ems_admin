"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

const leaveSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  leaveType: z.enum(["sick", "casual", "annual", "unpaid"]),
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
})

export type LeaveFormValues = z.infer<typeof leaveSchema>

interface LeaveRequestFormProps {
  employees: { id: string; name: string }[]
  onSuccess?: () => void
  onSubmit?: (data: LeaveFormValues) => void | Promise<void>
}

export function LeaveRequestForm({ employees, onSuccess, onSubmit: onSubmitProp }: LeaveRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
  })

  const startDate = watch("startDate")
  const endDate = watch("endDate")

  const onSubmit = async (data: LeaveFormValues) => {
    setIsLoading(true)
    try {
        if (onSubmitProp) {
            await onSubmitProp(data)
        } else {
             await new Promise(resolve => setTimeout(resolve, 1000));
             console.log("Mock Submit:", data);
        }
        if (onSuccess) onSuccess()
    } catch (e) {
        console.error(e)
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select onValueChange={(val) => setValue("employeeId", val)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                    {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId.message}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select onValueChange={(val) => setValue("leaveType", val as any)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
            </Select>
            {errors.leaveType && <p className="text-sm text-red-500">{errors.leaveType.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => setValue("startDate", date as Date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                 {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>End Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => setValue("endDate", date as Date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea 
                id="reason" 
                placeholder="Please describe the reason for your leave..."
                className="resize-none"
                {...register("reason")} 
            />
            {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
        </div>

      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  )
}
