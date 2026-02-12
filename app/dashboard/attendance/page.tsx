"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
                <p className="text-muted-foreground">
                    View and manage employee attendance.
                </p>
            </div>
      </div>
      <Card>
        <CardHeader>
             <CardTitle className="text-xl">Today&apos;s Attendance</CardTitle>
             <CardDescription>2026-02-13</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground border-dashed border-2 rounded-lg bg-muted/10">
            <Calendar className="mr-2 h-6 w-6" />
            <span>Attendance Module Placeholder (Calendar/List View)</span>
          </div>
        </CardContent>
      </Card>
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Present</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">110</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Late</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">5</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">12</div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
