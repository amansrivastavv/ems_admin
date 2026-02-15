"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, EmployeeStatus } from '@/types/employee';

// --- Type Definitions ---

export type AttendanceStatus = "present" | "late" | "absent" | "half-day";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
}

export type LeaveType = "sick" | "casual" | "annual" | "unpaid";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  requestDate: string;
}

export type PayrollStatus = "Paid" | "Pending" | "Processing";

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string; // e.g. "October 2023"
  salary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  paymentDate?: string;
}

interface EmployeeContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  
  addEmployee: (employee: Omit<Employee, 'id' | 'joinDate' | 'status'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateLeaveStatus: (id: string, status: LeaveStatus) => void;

  processPayroll: (record: Omit<PayrollRecord, 'id' | 'netPay' | 'status'>) => void;
}

// --- Mock Data ---

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "728ed52f",
    name: "John Doe",
    email: "john@example.com",
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
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
    { id: "1", employeeId: "728ed52f", date: "2023-10-26", checkIn: "09:00", checkOut: "17:00", status: "present" },
    { id: "2", employeeId: "489e1d42", date: "2023-10-26", checkIn: "09:15", checkOut: "17:30", status: "late" },
];

const INITIAL_LEAVE: LeaveRequest[] = [
    { id: "REQ-001", employeeId: "728ed52f", type: "sick", startDate: "2023-10-15", endDate: "2023-10-16", days: 2, reason: "Flu", status: "Approved", requestDate: "2023-10-14" }
];

const INITIAL_PAYROLL: PayrollRecord[] = [
    { id: "PAY-001", employeeId: "728ed52f", month: "October 2023", salary: 12000, bonus: 2000, deductions: 500, netPay: 13500, status: "Paid", paymentDate: "2023-10-28" }
];


// --- Context Implementation ---

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(INITIAL_PAYROLL);

  // Employee Actions
  const addEmployee = (newEmployeeData: Omit<Employee, 'id' | 'joinDate' | 'status'>) => {
    const newEmployee: Employee = {
      ...newEmployeeData,
      id: Math.random().toString(36).substr(2, 9),
      joinDate: new Date().toISOString().split('T')[0],
      status: EmployeeStatus.ACTIVE,
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  // Attendance Actions
  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
      // Check if already exists for this date/employee? For simplicity, just add.
      const newRecord: AttendanceRecord = {
          ...record,
          id: Math.random().toString(36).substr(2, 9),
      }
      setAttendance(prev => [...prev, newRecord]);
  };

  // Leave Actions
  const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status' | 'requestDate'>) => {
      const newRequest: LeaveRequest = {
          ...request,
          id: `REQ-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          status: "Pending",
          requestDate: new Date().toISOString().split('T')[0],
      }
      setLeaveRequests(prev => [newRequest, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus) => {
      setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  // Payroll Actions
  const processPayroll = (record: Omit<PayrollRecord, 'id' | 'netPay' | 'status'>) => {
      const netPay = Number(record.salary) + Number(record.bonus) - Number(record.deductions);
      const newRecord: PayrollRecord = {
          ...record,
          netPay, // Calculate Net Pay
          id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: "Processing", // Default to processing
      }
      setPayrollRecords(prev => [newRecord, ...prev]);
  };


  return (
    <EmployeeContext.Provider value={{
      employees,
      attendance,
      leaveRequests,
      payrollRecords,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      markAttendance,
      addLeaveRequest,
      updateLeaveStatus,
      processPayroll
    }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
}
