import { AttendanceView } from "./attendance-view"

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
      <AttendanceView />
    </div>
  )
}
