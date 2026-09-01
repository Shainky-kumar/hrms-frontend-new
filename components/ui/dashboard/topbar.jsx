
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";

const employeeTabs = [
  { label: "Department", href: "/dashboard/departments" },
  { label: "Designation", href: "/dashboard/designations" },
  { label: "Employee", href: "/dashboard/employees" },
  { label: "Employment Type", href: "/dashboard/employment-types" },
];

const leaveTabs = [
  { label: "Leave Type", href: "/dashboard/leave/leave_type" },
  { label: "Policies", href: "/dashboard/leave/leave-policies" },
  // { label: "Experience Tiers", href: "/dashboard/leave/leave-tiers" },
  { label: "Applicability Rules", href: "/dashboard/leave/leave-applicability" },
  { label: "Clubbing Restrictions", href: "/dashboard/leave/leave-clubbing" },
  { label: "Workflows", href: "/dashboard/leave/leave-workflows" },
  { label: "Leave Balances", href: "/dashboard/leave/leave-balances" },
  { label: "Apply Leave", href: "/dashboard/leave/leave-requests" },
];

const settingsTabs = [
  { label: "Working Days", href: "/dashboard/settings/working-hours" },
  { label: "Timing", href: "/dashboard/settings/timing" },
  { label: "Holiday", href: "/dashboard/settings/holiday" },
];

const shiftTabs = [
  { label: "Add Shift", href: "/dashboard/shift-management/add-shift" },
];

const attendanceTabs = [
  { label: "Today / Punch", href: "/dashboard/attendance/today" },
  { label: "History", href: "/dashboard/attendance/history" },
  { label: "Breaks", href: "/dashboard/attendance/breaks" },
  { label: "Regularization", href: "/dashboard/attendance/regularization" },
  { label: "Overtime", href: "/dashboard/attendance/overtime" },
  { label: "Comp-off", href: "/dashboard/attendance/comp-off" },
  { label: "Special Requests", href: "/dashboard/attendance/special-requests" },
  { label: "Policy", href: "/dashboard/attendance/policy" },
  { label: "Locations", href: "/dashboard/attendance/locations" },
  { label: "Biometrics", href: "/dashboard/attendance/biometrics" },
  { label: "Employee Config", href: "/dashboard/attendance/employee-config" },
  { label: "Devices", href: "/dashboard/attendance/devices" },
  { label: "Alerts", href: "/dashboard/attendance/alerts" },
];

const payrollTabs = [
  { label: "Run Payroll", href: "/dashboard/payroll/run" },
  { label: "Payroll List", href: "/dashboard/payroll/list" },
  { label: "Components", href: "/dashboard/payroll/components" },
  { label: "Salary Structure", href: "/dashboard/payroll/structure" },
  { label: "Deduction Rules", href: "/dashboard/payroll/deduction-rules" },
  { label: "Loans", href: "/dashboard/payroll/loans" },
  { label: "Profiles", href: "/dashboard/payroll/profiles" },
];

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayName = user?.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
    : "Admin";

  const initials = (user?.first_name?.[0] || "A").toUpperCase();

  const showEmployeeTabs =
    pathname?.startsWith("/dashboard/departments") ||
    pathname?.startsWith("/dashboard/designations") ||
    pathname?.startsWith("/dashboard/employees") ||
    pathname?.startsWith("/dashboard/employment-types");

  const showLeaveTabs = pathname?.startsWith("/dashboard/leave");
  const showSettingsTabs = pathname?.startsWith("/dashboard/settings");
  const showShiftTabs = pathname?.startsWith("/dashboard/shift-management");
  const showAttendanceTabs = pathname?.startsWith("/dashboard/attendance");
  const showPayrollTabs = pathname?.startsWith("/dashboard/payroll");

  const renderTabs = (tabs) => (
    <nav className="flex items-center gap-1">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href || pathname?.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-[#E42527] text-white shadow-sm"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="fixed top-0 right-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-[#0f172a] px-5 left-0 lg:left-[220px]">
      <div className="flex flex-1 items-center overflow-x-auto">
        {showEmployeeTabs
          ? renderTabs(employeeTabs)
          : showLeaveTabs
          ? renderTabs(leaveTabs)
          : showSettingsTabs
          ? renderTabs(settingsTabs)
          : showShiftTabs
          ? renderTabs(shiftTabs)
          : showAttendanceTabs
          ? renderTabs(attendanceTabs)
          : showPayrollTabs
          ? renderTabs(payrollTabs)
          : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E42527] ring-2 ring-[#0f172a]" />
        </button>

        <div className="mx-2 h-6 w-px bg-white/10" />

        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E42527] text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-white">{displayName}</p>
            <p className="text-[11px] leading-tight text-slate-400">Admin</p>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="ml-1 flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-slate-400 transition hover:bg-[#E42527]/15 hover:text-[#f87171]"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}