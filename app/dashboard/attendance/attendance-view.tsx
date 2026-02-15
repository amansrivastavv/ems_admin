"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CheckCheck, Clock, XCircle } from "lucide-react"

type AttendanceStatus = "present" | "late" | "absent"

interface AttendanceRecord {
  id: string
  employeeName: string
  role: string
  checkIn: string
  checkOut?: string
  status: AttendanceStatus
  avatar?: string
}

// Mock data generator - would be an API call in real app
const getMockAttendance = (date: Date): AttendanceRecord[] => {
  // Simulate date-specific data
  const day = date.getDate();
  
  if (day % 3 === 0) {
      return [
        { id: "1", employeeName: "Alice Williams", role: "Sales Rep", checkIn: "08:55 AM", checkOut: "05:00 PM", status: "present", avatar: "/avatars/04.png" },
        { id: "2", employeeName: "Bob Johnson", role: "Frontend Dev", checkIn: "10:15 AM", status: "late", avatar: "/avatars/03.png" },
      ]
  }

  return [
    {
      id: "1",
      employeeName: "John Doe",
      role: "CEO",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "present",
      avatar: "/avatars/01.png"
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      role: "HR Manager",
      checkIn: "09:45 AM",
      checkOut: "05:30 PM",
      status: "late",
      avatar: "/avatars/02.png"
    },
    {
      id: "3",
      employeeName: "Mike Brown",
      role: "Developer",
      checkIn: "-",
      status: "absent",
      avatar: "/avatars/05.png"
    },
     {
      id: "4",
      employeeName: "Sarah Connor",
      role: "Designer",
      checkIn: "08:30 AM",
      checkOut: "04:30 PM",
      status: "present",
      avatar: "/avatars/06.png"
    },
  ]
}

export function AttendanceView() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  // In a real app, use SWR or React Query here
  const attendanceData = date ? getMockAttendance(date) : []

  const stats = {
      present: attendanceData.filter(r => r.status === 'present').length,
      late: attendanceData.filter(r => r.status === 'late').length,
      absent: attendanceData.filter(r => r.status === 'absent').length,
  }

  return (
    <div className="flex flex-col space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Present</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Late</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
            <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>View attendance records by date</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow-sm"
                />
            </CardContent>
        </Card>

        <Card className="col-span-4">
            <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>
                    Attendance for {date ? format(date, "PPP") : "Selected Date"}
                </CardTitle>

            </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {attendanceData.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No records found for this date.</div>
                    ) : (
                        attendanceData.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage src={record.avatar} />
                                    <AvatarFallback>{record.employeeName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium leading-none">{record.employeeName}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{record.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium">In: {record.checkIn}</p>
                                    {record.checkOut && <p className="text-xs text-muted-foreground">Out: {record.checkOut}</p>}
                                </div>
                                <Badge variant={
                                        record.status === 'present' ? 'default' : 
                                        record.status === 'late' ? 'secondary' : 'destructive'
                                    }
                                    className={
                                        record.status === 'present' ? 'bg-green-500 hover:bg-green-600' :
                                        record.status === 'late' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''
                                    }
                                >
                                    {record.status === 'present' && <CheckCheck className="h-3 w-3 mr-1" />}
                                    {record.status === 'late' && <Clock className="h-3 w-3 mr-1" />}
                                    {record.status === 'absent' && <XCircle className="h-3 w-3 mr-1" />}
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </Badge>
                            </div>
                        </div>
                    )))}
                </div>
            </CardContent>
        </Card>
        </div>
    </div>
  )
}
