"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEmployeeContext } from "@/context/EmployeeContext";
import { format } from "date-fns";
import { 
  CalendarCheck, 
  CalendarDays, 
  Clock, 
  UserCheck, 
  LogOut,
  AlertCircle
} from "lucide-react";
import { useMemo } from "react";

export function EmployeeDashboard() {
  const { user } = useAuth();
  const { attendance, leaveRequests, markAttendance } = useEmployeeContext();
  
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Get today's attendance record
  const todayRecord = useMemo(() => {
    return attendance.find(a => a.employeeId === user?.id && a.date === today);
  }, [attendance, user?.id, today]);

  // Calculate customized stats
  const myAttendance = useMemo(() => {
    if (!user) return [];
    return attendance.filter(a => a.employeeId === user.id);
  }, [attendance, user]);

  const stats = {
    present: myAttendance.filter(a => a.status === 'present').length,
    late: myAttendance.filter(a => a.status === 'late').length,
    absent: myAttendance.filter(a => a.status === 'absent').length,
  };

  const handleCheckIn = () => {
    if (!user) return;
    
    markAttendance({
      employeeId: user.id,
      date: today,
      checkIn: format(new Date(), "HH:mm"),
      status: "present" // Logic for 'late' could be added here
    });
  };

  const handleCheckOut = () => {
     // In a real app, we would update the existing record. 
     // For this mock context, we might need a specific 'updateAttendance' or similar.
     if (todayRecord) {
         // Logic to update checkout time would go here
         alert("Check-out recorded!"); 
     }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Present</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <CalendarDays className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveRequests.filter(l => l.employeeId === user?.id && l.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.late}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Days remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        
        {/* Today's Status / Check In */}
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Today&apos;s Status</CardTitle>
            <CardDescription>{format(new Date(), "EEEE, MMMM do, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
               {todayRecord ? (
                   <div className="text-center space-y-2">
                       <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                           <UserCheck className="h-10 w-10 text-green-600" />
                       </div>
                       <div className="space-y-1">
                           <h3 className="text-xl font-bold text-green-700">You are checked in</h3>
                           <p className="text-sm text-muted-foreground">Checked in at {todayRecord.checkIn}</p>
                       </div>
                       {!todayRecord.checkOut && (
                            <Button className="mt-4 w-full" variant="outline" onClick={handleCheckOut}>
                                <LogOut className="mr-2 h-4 w-4" /> Check Out
                            </Button>
                       )}
                       {todayRecord.checkOut && (
                           <p className="text-sm font-medium text-muted-foreground mt-2">Checked out at {todayRecord.checkOut}</p>
                       )}
                   </div>
               ) : (
                   <div className="text-center space-y-2">
                       <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                           <Clock className="h-10 w-10 text-muted-foreground" />
                       </div>
                       <Button size="lg" className="w-full min-w-[200px]" onClick={handleCheckIn}>
                           <UserCheck className="mr-2 h-5 w-5" /> Check In Now
                       </Button>
                       <p className="text-xs text-muted-foreground mt-2">
                           Official start time is 09:00 AM
                       </p>
                   </div>
               )}
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                 <h4 className="font-semibold mb-2 flex items-center text-sm">
                    <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                    Notice Board
                 </h4>
                 <p className="text-sm text-muted-foreground">
                    Office will be closed on Friday for maintenance. Please work from home.
                 </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
            <CardDescription>Your last 5 activity records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {myAttendance.slice(0, 3).map((record, i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${
                                record.status === 'present' ? 'bg-green-50 border-green-200 text-green-600' : 
                                record.status === 'late' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
                                'bg-red-50 border-red-200 text-red-600'
                            }`}>
                                {record.status === 'present' ? <UserCheck className="h-4 w-4" /> : 
                                 record.status === 'late' ? <Clock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none capitalize">Marked {record.status}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(record.date), "PPP")}</p>
                            </div>
                        </div>
                        <div className="text-sm font-medium">
                            {record.checkIn} - {record.checkOut || "..."}
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
