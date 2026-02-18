"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { CheckCheck, Clock, XCircle, Search, Filter, ChevronLeft, ChevronRight, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useEmployeeContext, AttendanceStatus } from "@/context/EmployeeContext"
import { useAuth } from "@/hooks/useAuth"

interface DisplayAttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  role: string
  checkIn: string
  checkOut?: string
  status: AttendanceStatus 
  avatar?: string
}

export function AttendanceView() {
  const { user } = useAuth()
  const { employees, attendance, markAttendance } = useEmployeeContext()

  const [date, setDate] = React.useState<Date>(new Date())
  const [filter, setFilter] = React.useState<AttendanceStatus | "all">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Form State for "Mark Attendance"
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string>("")
  const [formStatus, setFormStatus] = React.useState<AttendanceStatus>("present")
  const [checkInTime, setCheckInTime] = React.useState("09:00")

  // Generate display data by merging Employees with Attendance records for the selected date
  const displayData: DisplayAttendanceRecord[] = React.useMemo(() => {
    const dateString = format(date, "yyyy-MM-dd")
    
    // Filter employees if user is an employee
    const targetEmployees = user?.role === 'employee' 
      ? employees.filter(e => e.id === user.id)
      : employees;

    return targetEmployees.map(emp => {
        const record = attendance.find(a => a.employeeId === emp.id && a.date === dateString)
        
        return {
            id: record ? record.id : `temp-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
            role: emp.role,
            checkIn: record?.checkIn || "-",
            checkOut: record?.checkOut,
            status: record?.status || "absent", // Default to absent if no record
            avatar: emp.avatarUrl
        }
    })
  }, [employees, attendance, date, user])

  const filteredData = displayData.filter(record => {
      const matchesFilter = filter === "all" || record.status === filter
      const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           record.role.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
  })

  // Recalculate stats based on the generated display data for this day
  const stats = {
      present: displayData.filter(r => r.status === 'present').length,
      late: displayData.filter(r => r.status === 'late').length,
      absent: displayData.filter(r => r.status === 'absent').length,
  }

  const handlePrevDay = () => setDate(prev => subDays(prev, 1))
  const handleNextDay = () => setDate(prev => addDays(prev, 1))

  const handleSaveAttendance = () => {
      if (!selectedEmployeeId) return;

      markAttendance({
          employeeId: selectedEmployeeId,
          date: format(date, "yyyy-MM-dd"),
          status: formStatus,
          checkIn: checkInTime,
          checkOut: formStatus === 'present' ? '17:00' : undefined 
      })
      setIsDialogOpen(false)
      // Reset form
      setSelectedEmployeeId("")
      setFormStatus("present")
  }

  return (
    <div className="flex flex-col space-y-6">
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
             <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${filter === 'present' ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => setFilter(filter === 'present' ? 'all' : 'present')}
             >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">Present</CardTitle>
                    <CheckCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                    <p className="text-xs text-muted-foreground">Employees on time</p>
                </CardContent>
            </Card>
            <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${filter === 'late' ? 'ring-2 ring-yellow-500' : ''}`}
                onClick={() => setFilter(filter === 'late' ? 'all' : 'late')}
            >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">Late</CardTitle>
                     <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                    <p className="text-xs text-muted-foreground">Arrived after 9:30 AM</p>
                </CardContent>
            </Card>
            <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${filter === 'absent' ? 'ring-2 ring-red-500' : ''}`}
                onClick={() => setFilter(filter === 'absent' ? 'all' : 'absent')}
            >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                    <p className="text-xs text-muted-foreground">Not checked in</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            
            {/* Left Column: Calendar & Actions */}
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-3">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => d && setDate(d)}
                            initialFocus
                            className="rounded-md border shadow-sm w-full"
                        />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {user?.role !== 'employee' && (
                            <>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full justify-start" variant="outline">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Mark Attendance
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Mark Attendance Manually</DialogTitle>
                                            <DialogDescription>
                                                Record check-in/out for an employee on {format(date, "PPP")}.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="employee" className="text-right">
                                                    Employee
                                                </Label>
                                                <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
                                                    <SelectTrigger className="col-span-3">
                                                         <SelectValue placeholder="Select employee" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {employees.map(emp => (
                                                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="status" className="text-right">
                                                    Status
                                                </Label>
                                                <Select value={formStatus} onValueChange={(v: any) => setFormStatus(v)}>
                                                    <SelectTrigger className="col-span-3">
                                                         <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="present">Present</SelectItem>
                                                        <SelectItem value="late">Late</SelectItem>
                                                        <SelectItem value="absent">Absent</SelectItem>
                                                        <SelectItem value="half-day">Half Day</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                             <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="time" className="text-right">
                                                    Check In
                                                </Label>
                                                <Input 
                                                    id="time" 
                                                    type="time" 
                                                    className="col-span-3" 
                                                    value={checkInTime}
                                                    onChange={(e) => setCheckInTime(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleSaveAttendance} disabled={!selectedEmployeeId}>Save Record</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                
                                <Button className="w-full justify-start" variant="outline">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Export Report
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: List View */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handlePrevDay}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            {format(date, "MMMM do, yyyy")}
                            {isSameDay(date, new Date()) && <Badge variant="secondary" className="text-xs">Today</Badge>}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={handleNextDay}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            {user?.role !== 'employee' && (
                                <>
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search employee..."
                                    className="pl-8 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                </>
                            )}
                        </div>
                        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="late">Late</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card className="min-h-[500px]">
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {filteredData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                                        <Search className="h-8 w-8 opacity-50" />
                                    </div>
                                    <p className="text-lg font-medium">No records found</p>
                                    <p className="text-sm">Try adjusting your search or filter.</p>
                                    <Button variant="link" onClick={() => {setFilter('all'); setSearchQuery('')}}>Clear filters</Button>
                                </div>
                            ) : (
                                filteredData.map((record) => (
                                <div key={record.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                        <Avatar className="h-10 w-10 border-2 border-background">
                                            <AvatarImage src={record.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary">{record.employeeName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium leading-none text-base">{record.employeeName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-transparent border-muted">{record.role}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="grid grid-cols-2 gap-x-8 text-sm">
                                            <div>
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider block">Check In</span>
                                                <span className="font-medium font-mono">{record.checkIn}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider block">Check Out</span>
                                                <span className="font-medium font-mono">{record.checkOut || "--:--"}</span>
                                            </div>
                                        </div>
                                        
                                        <Badge variant={
                                                record.status === 'present' ? 'default' : 
                                                record.status === 'late' ? 'secondary' : 
                                                record.status === 'half-day' ? 'secondary' : 'destructive'
                                            }
                                            className={
                                                cn("w-24 justify-center py-1", 
                                                record.status === 'present' ? 'bg-green-500 hover:bg-green-600' :
                                                record.status === 'late' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 
                                                record.status === 'half-day' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 
                                                ''
                                                )
                                            }
                                        >
                                            {record.status === 'present' && <CheckCheck className="h-3.5 w-3.5 mr-1.5" />}
                                            {record.status === 'late' && <Clock className="h-3.5 w-3.5 mr-1.5" />}
                                            {record.status === 'absent' && <XCircle className="h-3.5 w-3.5 mr-1.5" />}
                                            <span className="capitalize">{record.status}</span>
                                        </Badge>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
