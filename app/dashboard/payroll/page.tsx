"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, Download, Plus, Search } from "lucide-react"
import { useState, useMemo } from "react"
import { useEmployeeContext } from "@/context/EmployeeContext"
import { format } from "date-fns"

export default function PayrollPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { employees, payrollRecords, processPayroll } = useEmployeeContext()

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("October 2023") // Default or dynamic
  const [salary, setSalary] = useState("")
  const [bonus, setBonus] = useState("")
  const [deductions, setDeductions] = useState("")

  // Join payroll records with employee details
  const enrichedRecords = useMemo(() => {
    return payrollRecords.map(record => {
        const emp = employees.find(e => e.id === record.employeeId)
        return {
            ...record,
            employeeName: emp ? emp.name : 'Unknown Employee',
            role: emp ? emp.role : 'N/A'
        }
    })
  }, [payrollRecords, employees])

  const stats = {
      totalPaid: payrollRecords.filter(r => r.status === 'Paid').reduce((acc, curr) => acc + curr.netPay, 0),
      pending: payrollRecords.filter(r => r.status === 'Pending').length,
      processing: payrollRecords.filter(r => r.status === 'Processing').length,
  }

  const handleProcessPayroll = () => {
      if (!selectedEmployeeId || !salary) return;

      processPayroll({
          employeeId: selectedEmployeeId,
          month: selectedMonth,
          salary: Number(salary),
          bonus: Number(bonus) || 0,
          deductions: Number(deductions) || 0
      })

      setIsDialogOpen(false)
      // Reset form
      setSelectedEmployeeId("")
      setSalary("")
      setBonus("")
      setDeductions("")
  }

  const months = [
      "October 2023", "November 2023", "December 2023", "January 2024"
  ]

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
            <p className="text-muted-foreground">Manage ongoing and past payroll records.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Process Payroll
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Process Payroll</DialogTitle>
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
                        <Label htmlFor="month" className="text-right">
                            Month
                        </Label>
                        <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(m => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary" className="text-right">
                            Base Salary
                        </Label>
                        <Input 
                            id="salary" 
                            type="number" 
                            className="col-span-3" 
                            placeholder="0.00" 
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bonus" className="text-right">
                            Bonus
                        </Label>
                        <Input 
                            id="bonus" 
                            type="number" 
                            className="col-span-3" 
                            placeholder="0.00" 
                            value={bonus}
                            onChange={(e) => setBonus(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deductions" className="text-right">
                            Deductions
                        </Label>
                        <Input 
                            id="deductions" 
                            type="number" 
                            className="col-span-3" 
                            placeholder="0.00" 
                            value={deductions}
                            onChange={(e) => setDeductions(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleProcessPayroll} disabled={!selectedEmployeeId || !salary}>Generate Payslip</Button>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${stats.totalPaid.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> 
                    +12% from last month
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Processing</CardTitle>
                <Wallet className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.pending} Records</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Requires approval
                </p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.processing} Records</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Bank transfer initiated
                </p>
            </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Payroll History</CardTitle>
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
                        <TableHead>Reference ID</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Base Salary</TableHead>
                        <TableHead className="text-right">Net Pay</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {enrichedRecords.length === 0 ? (
                        <TableRow>
                             <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                No payroll records found.
                             </TableCell>
                        </TableRow>
                    ) : (
                        enrichedRecords.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell className="font-mono text-xs">{record.id}</TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{record.employeeName}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{record.role}</p>
                                </div>
                            </TableCell>
                            <TableCell>{record.month}</TableCell>
                            <TableCell className="text-right">${record.salary.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold text-green-600">${record.netPay.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    record.status === 'Paid' ? 'default' : 
                                    record.status === 'Processing' ? 'secondary' : 'outline'
                                } className={
                                    record.status === 'Paid' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 
                                    record.status === 'Processing' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' : 
                                    'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200'
                                }>
                                    {record.status}
                                </Badge>
                            </TableCell>
                             <TableCell>{record.paymentDate || '-'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" title="Download Slip">
                                    <Download className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
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
