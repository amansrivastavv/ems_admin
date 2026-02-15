"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LeaveFormValues, LeaveRequestForm } from "@/components/forms/LeaveRequestForm" // Import types
import { Calendar, CheckCircle2, Clock, XCircle, Search, Filter } from "lucide-react"
import { useState, useMemo } from "react"
import { useEmployeeContext } from "@/context/EmployeeContext"
import { format, differenceInDays } from "date-fns"

export default function LeavePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { employees, leaveRequests, addLeaveRequest, updateLeaveStatus } = useEmployeeContext()

  // Join leave requests with employee details
  const enrichedRequests = useMemo(() => {
    return leaveRequests.map(req => {
        const emp = employees.find(e => e.id === req.employeeId)
        return {
            ...req,
            employeeName: emp ? emp.name : 'Unknown Employee',
            searchStr: `${emp?.name} ${req.type} ${req.status}`.toLowerCase()
        }
    })
  }, [leaveRequests, employees])
  
  const stats = {
      pending: leaveRequests.filter(r => r.status === 'Pending').length,
      approved: leaveRequests.filter(r => r.status === 'Approved').length,
      rejected: leaveRequests.filter(r => r.status === 'Rejected').length,
      total: leaveRequests.length
  }

  const handleAddLeave = async (data: LeaveFormValues) => {
      const days = differenceInDays(data.endDate, data.startDate) + 1; // Inclusive
      
      addLeaveRequest({
          employeeId: data.employeeId,
          type: data.leaveType,
          startDate: format(data.startDate, "yyyy-MM-dd"),
          endDate: format(data.endDate, "yyyy-MM-dd"),
          days: days > 0 ? days : 1,
          reason: data.reason
      })
      setIsDialogOpen(false)
  }

  const handleStatusUpdate = (id: string, newStatus: "Approved" | "Rejected") => {
      updateLeaveStatus(id, newStatus)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
            <p className="text-muted-foreground">Manage employee leave requests and approvals.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Calendar className="mr-2 h-4 w-4" /> Apply for Leave
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Submit Leave Request</DialogTitle>
                </DialogHeader>
                <LeaveRequestForm 
                    employees={employees}
                    onSubmit={handleAddLeave}
                    onSuccess={() => setIsDialogOpen(false)} 
                />
            </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
        </Card>
      </div>

      {/* Leave Table Section */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Recent Requests</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search..." className="pl-8 w-[200px]" />
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrichedRequests.length === 0 ? (
                        <TableRow>
                             <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No leave requests found.
                             </TableCell>
                        </TableRow>
                    ) : (
                        enrichedRequests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell className="font-medium">{req.employeeName}</TableCell>
                            <TableCell className="capitalize">{req.type}</TableCell>
                            <TableCell>{req.days} Day{req.days > 1 ? 's' : ''}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {req.startDate} to {req.endDate}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={req.reason}>
                                {req.reason}
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    req.status === 'Approved' ? 'default' : 
                                    req.status === 'Pending' ? 'secondary' : 'destructive'
                                } className={
                                    req.status === 'Approved' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 
                                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200' : 
                                    'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                                }>
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {req.status === 'Pending' && (
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                            onClick={() => handleStatusUpdate(req.id, "Approved")}
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            onClick={() => handleStatusUpdate(req.id, "Rejected")}
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
