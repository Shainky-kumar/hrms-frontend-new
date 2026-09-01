
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MapPin,
  Users,
  CalendarDays,
  Settings,
  Clock,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Locations", href: "/dashboard/locations", icon: MapPin },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Onboarding", href: "/dashboard/Onboarding", icon: Users },
  { label: "Leave Tracker", href: "/dashboard/leave/leave-policies", icon: CalendarDays },
  { label: "Attendance", href: "/dashboard/attendance/today", icon: Clock },
  { label: "Payroll", href: "/dashboard/payroll/run", icon: Wallet },
  { label: "Settings", href: "/dashboard/settings/working-hours", icon: Settings },
  { label: "Shift Management", href: "/dashboard/shift-management/add-shift", icon: Clock },
  {label: "HR Letter", href: "/dashboard/hr_letter", icon: Clock },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isEmployeeModule =
    pathname?.startsWith("/dashboard/departments") ||
    pathname?.startsWith("/dashboard/designations") ||
    pathname?.startsWith("/dashboard/employees") ||
    pathname?.startsWith("/dashboard/employment-types");

  const isLeaveModule = pathname?.startsWith("/dashboard/leave");
  const isSettingsModule = pathname?.startsWith("/dashboard/settings");
  const isShiftModule = pathname?.startsWith("/dashboard/shift-management");
  const isAttendanceModule = pathname?.startsWith("/dashboard/attendence");
  const isPayrollModule = pathname?.startsWith("/dashboard/payroll");

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[220px] flex-col bg-[#0f172a] lg:flex">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E42527] text-sm font-bold text-white shadow-sm">
          E
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">EZlife</p>
          <p className="truncate text-[10px] text-slate-400">HRMS</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard/employees"
              ? isEmployeeModule
              : item.href === "/dashboard/leave/leave-policies"
              ? isLeaveModule
              : item.href === "/dashboard/attendance/today"
              ? isAttendanceModule
              : item.href === "/dashboard/payroll/run"
              ? isPayrollModule
              : item.href.startsWith("/dashboard/settings")
              ? isSettingsModule
              : item.href.startsWith("/dashboard/shift-management")
              ? isShiftModule
              : pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              title={item.label}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#E42527] text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <p className="text-[10px] text-slate-500">© EZlife HRMS</p>
      </div>
    </aside>
  );
}