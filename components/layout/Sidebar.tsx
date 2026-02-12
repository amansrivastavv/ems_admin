"use client";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, hasRole, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["admin", "hr", "employee"],
    },
    {
      label: "Employees",
      icon: Users,
      href: "/dashboard/employees",
      roles: ["admin", "hr"],
    },
    {
      label: "Attendance",
      icon: CalendarCheck,
      href: "/dashboard/attendance",
      roles: ["admin", "hr", "employee"],
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/dashboard/reports",
      roles: ["admin", "hr"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["admin", "hr"],
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {/* Logo */}
        {!collapsed && (
          <span className="text-xl font-bold tracking-tight text-primary">
            EMS Admin
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto py-4">
        {menuItems.map((item) => {
          if (!item.roles.some((role) => hasRole(role as any))) return null;

          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                collapsed ? "justify-center" : "mx-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
         <Button
            variant="outline"
            className={cn("w-full justify-start gap-2", collapsed && "justify-center px-0")}
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </Button>
      </div>
    </aside>
  );
}
