
// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { api } from "@/app/lib/api";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) =>
//         Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
//       )
//       .join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// const toArray = (p) => {
//   if (!p) return [];
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p?.data)) return p.data;
//   if (Array.isArray(p?.attendance)) return p.attendance;
//   if (Array.isArray(p?.history)) return p.history;
//   if (Array.isArray(p?.items)) return p.items;
//   return [];
// };

// const formatDate = (d) => {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return String(d);
//   }
// };

// const formatTime = (d) => {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   } catch {
//     return "—";
//   }
// };

// const formatHours = (minutes) => {
//   if (minutes == null) return "—";
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   return `${h}h ${m}m`;
// };

// // Status badge styling
// const getStatusStyle = (status, isHalfDay) => {
//   const s = (status || "").toLowerCase();

//   if (isHalfDay || s === "half_day") {
//     return "bg-purple-50 text-purple-700 border-purple-100";
//   }
//   if (s === "present") return "bg-green-50 text-green-700 border-green-100";
//   if (s === "absent") return "bg-red-50 text-red-700 border-red-100";
//   if (s === "on_leave") return "bg-blue-50 text-blue-700 border-blue-100";
//   if (s === "work_from_home" || s === "wfh")
//     return "bg-teal-50 text-teal-700 border-teal-100";
//   if (s === "on_duty") return "bg-orange-50 text-orange-700 border-orange-100";
//   if (s === "holiday") return "bg-indigo-50 text-indigo-700 border-indigo-100";
//   if (s === "week_off") return "bg-gray-100 text-gray-600 border-gray-200";
//   if (s === "missing_punch")
//     return "bg-amber-50 text-amber-700 border-amber-100";

//   return "bg-gray-100 text-gray-600 border-gray-200";
// };

// const getStatusLabel = (status, isHalfDay) => {
//   if (isHalfDay || (status || "").toLowerCase() === "half_day") return "Half Day";
//   if (!status) return "—";
//   return String(status)
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());
// };

// export default function AttendanceHistoryPage() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(15);
//   const [total, setTotal] = useState(0);
//   const [statusFilter, setStatusFilter] = useState("all");

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await api.get("/api/v1/get/attendence/history", {
//           params: {
//             employee_id: employeeId || undefined,
//             from_date: fromDate || undefined,
//             to_date: toDate || undefined,
//             page,
//             page_size: pageSize,
//           },
//         });
//         const data = res?.data;
//         setList(toArray(data));
//         setTotal(data?.total || data?.total_count || toArray(data).length);
//       } catch (err) {
//         setError(formatApiError(err));
//         setList([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, employeeId, fromDate, toDate, pageSize]);

//   // Summary counts
//   const summary = useMemo(() => {
//     const counts = {
//       present: 0,
//       half_day: 0,
//       absent: 0,
//       on_leave: 0,
//       work_from_home: 0,
//       on_duty: 0,
//       other: 0,
//     };

//     list.forEach((row) => {
//       const s = (row.status || "").toLowerCase();
//       const isHalf = row.is_half_day || s === "half_day";

//       if (isHalf) counts.half_day += 1;
//       else if (s === "present") counts.present += 1;
//       else if (s === "absent") counts.absent += 1;
//       else if (s === "on_leave") counts.on_leave += 1;
//       else if (s === "work_from_home" || s === "wfh") counts.work_from_home += 1;
//       else if (s === "on_duty") counts.on_duty += 1;
//       else counts.other += 1;
//     });

//     return counts;
//   }, [list]);

//   // Filtered list
//   const filteredList = useMemo(() => {
//     if (statusFilter === "all") return list;

//     return list.filter((row) => {
//       const s = (row.status || "").toLowerCase();
//       const isHalf = row.is_half_day || s === "half_day";

//       if (statusFilter === "half_day") return isHalf;
//       if (statusFilter === "present") return s === "present" && !isHalf;
//       if (statusFilter === "absent") return s === "absent";
//       if (statusFilter === "on_leave") return s === "on_leave";
//       if (statusFilter === "wfh")
//         return s === "work_from_home" || s === "wfh";
//       if (statusFilter === "on_duty") return s === "on_duty";
//       return true;
//     });
//   }, [list, statusFilter]);

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   const summaryCards = [
//     {
//       key: "present",
//       label: "Present",
//       count: summary.present,
//       color: "bg-green-50 border-green-100 text-green-700",
//       active: "ring-2 ring-green-500",
//     },
//     {
//       key: "half_day",
//       label: "Half Day",
//       count: summary.half_day,
//       color: "bg-purple-50 border-purple-100 text-purple-700",
//       active: "ring-2 ring-purple-500",
//     },
//     {
//       key: "absent",
//       label: "Absent",
//       count: summary.absent,
//       color: "bg-red-50 border-red-100 text-red-700",
//       active: "ring-2 ring-red-500",
//     },
//     {
//       key: "on_leave",
//       label: "On Leave",
//       count: summary.on_leave,
//       color: "bg-blue-50 border-blue-100 text-blue-700",
//       active: "ring-2 ring-blue-500",
//     },
//     {
//       key: "wfh",
//       label: "WFH",
//       count: summary.work_from_home,
//       color: "bg-teal-50 border-teal-100 text-teal-700",
//       active: "ring-2 ring-teal-500",
//     },
//     {
//       key: "on_duty",
//       label: "On Duty",
//       count: summary.on_duty,
//       color: "bg-orange-50 border-orange-100 text-orange-700",
//       active: "ring-2 ring-orange-500",
//     },
//   ];

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
//           Attendance Overview
//         </h1>
//         <p className="mt-1 text-sm text-[#6b7280]">
//           Track Present, Half Day, Leave & more
//         </p>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {/* ===== SUMMARY CARDS ===== */}
//       <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
//         {summaryCards.map((card) => (
//           <button
//             key={card.key}
//             type="button"
//             onClick={() =>
//               setStatusFilter((prev) =>
//                 prev === card.key ? "all" : card.key
//               )
//             }
//             className={`rounded-xl border p-4 text-left transition ${
//               card.color
//             } ${statusFilter === card.key ? card.active : "hover:shadow-sm"}`}
//           >
//             <p className="text-xs font-medium opacity-80">{card.label}</p>
//             <p className="mt-1 text-2xl font-bold">{card.count}</p>
//           </button>
//         ))}
//       </div>

//       {/* ===== FILTERS + TABLE ===== */}
//       <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
//         {/* Filters */}
//         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-4 sm:flex-row sm:flex-wrap sm:items-end">
//           <input
//             value={employeeId}
//             onChange={(e) => setEmployeeId(e.target.value)}
//             placeholder="Employee ID"
//             className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//           />
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm"
//           />
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm"
//           />
//           <button
//             type="button"
//             onClick={() => {
//               setPage(1);
//               fetchData();
//             }}
//             className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//           >
//             Search
//           </button>

//           {statusFilter !== "all" && (
//             <button
//               type="button"
//               onClick={() => setStatusFilter("all")}
//               className="text-sm text-[#6b7280] hover:text-[#E42527]"
//             >
//               Clear filter
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">
//               Loading...
//             </div>
//           ) : filteredList.length === 0 ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">
//               No records found
//             </div>
//           ) : (
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">
//                     Employee
//                   </th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">
//                     Status
//                   </th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">
//                     Punch In
//                   </th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">
//                     Punch Out
//                   </th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">
//                     Work Hours
//                   </th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Late</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {filteredList.map((row, i) => (
//                   <tr
//                     key={row.attendance_id || i}
//                     className="hover:bg-[#fafafa]"
//                   >
//                     <td className="px-5 py-3.5 whitespace-nowrap">
//                       {formatDate(row.attendance_date)}
//                     </td>
//                     <td className="px-5 py-3.5">
//                       {row.employee_name || row.employee_id || "—"}
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <span
//                         className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(
//                           row.status,
//                           row.is_half_day
//                         )}`}
//                       >
//                         {getStatusLabel(row.status, row.is_half_day)}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5 whitespace-nowrap">
//                       {formatTime(row.first_punch_in)}
//                     </td>
//                     <td className="px-5 py-3.5 whitespace-nowrap">
//                       {formatTime(row.last_punch_out)}
//                     </td>
//                     <td className="px-5 py-3.5">
//                       {formatHours(row.total_work_minutes)}
//                     </td>
//                     <td className="px-5 py-3.5">
//                       {row.is_late ? (
//                         <span className="text-orange-600">
//                           {row.late_minutes || 0}m
//                         </span>
//                       ) : (
//                         "—"
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3">
//             <p className="text-sm text-[#6b7280]">
//               Page {page} of {totalPages}
//             </p>
//             <div className="flex gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Previous
//               </button>
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

/**
 * AttendanceHistoryPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ Admin sees all employees · Employee sees only own
 *  ✓ Date range filter (from / to)
 *  ✓ Status filter with clickable summary cards
 *  ✓ Employee filter (admin only, searchable)
 *  ✓ Pagination with proper bounds
 *  ✓ CSV export of filtered data
 *  ✓ Mobile card view + desktop table
 *  ✓ Live reload with debounce
 *  ✓ Timezone-aware formatting
 *  ✓ Skeleton loading
 *  ✓ Empty state + error states
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 15;
const DEBOUNCE_MS = 450;
const AUTO_DISMISS_MS = 5000;

const STATUS_OPTIONS = [
  { value: "all", label: "All", color: "slate" },
  { value: "present", label: "Present", color: "green" },
  { value: "half_day", label: "Half Day", color: "purple" },
  { value: "absent", label: "Absent", color: "red" },
  { value: "on_leave", label: "On Leave", color: "blue" },
  { value: "work_from_home", label: "WFH", color: "teal" },
  { value: "on_duty", label: "On Duty", color: "orange" },
  { value: "holiday", label: "Holiday", color: "indigo" },
  { value: "week_off", label: "Week Off", color: "slate" },
];

const STATUS_CARD_STYLES = {
  slate: "bg-slate-50 border-slate-200 text-slate-700",
  green: "bg-green-50 border-green-200 text-green-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  red: "bg-red-50 border-red-200 text-red-700",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  teal: "bg-teal-50 border-teal-200 text-teal-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg || "Error";
      })
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object" && detail.msg) return detail.msg;
  return err?.message || "Something went wrong";
};

const safeDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDate = (v, tz) => {
  const d = safeDate(v);
  if (!d) return "—";
  try {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: tz,
    });
  } catch {
    return "—";
  }
};

const formatWeekday = (v, tz) => {
  const d = safeDate(v);
  if (!d) return "";
  try {
    return d.toLocaleDateString("en-IN", { weekday: "short", timeZone: tz });
  } catch {
    return "";
  }
};

const formatTime = (v, tz) => {
  const d = safeDate(v);
  if (!d) return "—";
  try {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: tz,
    });
  } catch {
    return "—";
  }
};

const minutesToHhMm = (m) => {
  if (m == null) return "—";
  const n = Number(m);
  if (Number.isNaN(n) || n <= 0) return "0h 0m";
  return `${Math.floor(n / 60)}h ${n % 60}m`;
};

const getFirstIn = (r) => r?.first_punch_in || null;
const getLastOut = (r) => r?.last_punch_out || null;

const statusLabel = (s) =>
  String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const normalizeStatus = (r) => {
  if (r?.is_half_day) return "half_day";
  const s = String(r?.status || "").toLowerCase();
  if (s === "wfh") return "work_from_home";
  if (s === "od") return "on_duty";
  if (s === "leave") return "on_leave";
  return s || "unknown";
};

const statusBadgeClass = (status) => {
  switch (status) {
    case "present":
      return "bg-green-50 text-green-700 border-green-200";
    case "half_day":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "absent":
      return "bg-red-50 text-red-700 border-red-200";
    case "on_leave":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "work_from_home":
      return "bg-teal-50 text-teal-700 border-teal-200";
    case "on_duty":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "holiday":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "week_off":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "missing_punch":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const toIsoDate = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getTodayIso = () => toIsoDate(new Date());

const getMonthStartIso = () => {
  const d = new Date();
  return toIsoDate(new Date(d.getFullYear(), d.getMonth(), 1));
};

const extractList = (res) => {
  const data = res?.data ?? {};
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.attendance))
    return { items: data.attendance, total: Number(data.total) || data.attendance.length };
  if (Array.isArray(data.items))
    return { items: data.items, total: Number(data.total) || data.items.length };
  if (Array.isArray(data.data))
    return { items: data.data, total: Number(data.total) || data.data.length };
  return { items: [], total: 0 };
};

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════════════════════════ */

function Toast({ type, message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700";

  return (
    <div
      role="alert"
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}
    >
      <span className="whitespace-pre-line">{message}</span>
      <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}

function SummaryCards({ summary, activeStatus, onSelect }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {STATUS_OPTIONS.filter((s) => s.value !== "all").map((opt) => {
        const count = summary[opt.value] || 0;
        const isActive = activeStatus === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(isActive ? "all" : opt.value)}
            className={`rounded-xl border p-4 text-left transition ${
              STATUS_CARD_STYLES[opt.color]
            } ${isActive ? "ring-2 ring-offset-1 ring-slate-400 shadow-sm" : "hover:shadow-sm"}`}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
              {opt.label}
            </p>
            <p className="mt-1 text-2xl font-bold">{count}</p>
          </button>
        );
      })}
    </div>
  );
}

function EmployeeSelect({ value, onChange, employees, loading }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = query.trim()
    ? employees.filter((e) => {
        const q = query.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
        );
      })
    : employees;

  const selected = employees.find((e) => e.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="flex w-full min-w-[200px] items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {loading
            ? "Loading..."
            : selected
            ? selected.name
            : "All Employees"}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => e.key === "Enter" && onChange("")}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </span>
          )}
          <span className="text-slate-400">▾</span>
        </div>
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full min-w-[240px] rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employee..."
              className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          {!query && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`w-full border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                !value ? "bg-red-50/40" : ""
              }`}
            >
              <div className="font-medium text-slate-700">All Employees</div>
              <div className="text-[11px] text-slate-400">
                Show records for everyone
              </div>
            </button>
          )}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No employees found
              </div>
            ) : (
              filtered.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onChange(e.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    e.id === value ? "bg-red-50/40" : ""
                  }`}
                >
                  <span className="font-medium text-slate-700">{e.name}</span>
                  <span className="text-[11px] text-slate-400">{e.id}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-3.5"><div className="h-4 w-24 rounded bg-slate-200" /></td>
      <td className="px-5 py-3.5"><div className="h-5 w-20 rounded-full bg-slate-200" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-16 rounded bg-slate-200" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-16 rounded bg-slate-200" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-14 rounded bg-slate-200" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-12 rounded bg-slate-200" /></td>
    </tr>
  );
}

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page numbers with ellipsis
  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-xs text-slate-400">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
              p === page
                ? "border-red-600 bg-red-600 text-white"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-xs text-slate-400">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function MobileCard({ row, tz }) {
  const status = normalizeStatus(row);
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-800">
            {formatDate(row.attendance_date, tz)}
          </div>
          <div className="text-[11px] text-slate-400">
            {formatWeekday(row.attendance_date, tz)}
          </div>
        </div>
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(
            status
          )}`}
        >
          {statusLabel(status)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        <div className="text-slate-500">In</div>
        <div className="text-right text-slate-700">{formatTime(getFirstIn(row), tz)}</div>
        <div className="text-slate-500">Out</div>
        <div className="text-right text-slate-700">{formatTime(getLastOut(row), tz)}</div>
        <div className="text-slate-500">Hours</div>
        <div className="text-right text-slate-700">{minutesToHhMm(row.total_work_minutes)}</div>
        {row.is_late && (
          <>
            <div className="text-orange-600">Late</div>
            <div className="text-right text-orange-600">+{row.late_minutes || 0}m</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function AttendanceHistoryPage() {
  const user = useAuthStore((s) => s.user);
  const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

  const role = String(user?.role?.value || user?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";

  /* ── filters ── */
  const [employeeId, setEmployeeId] = useState(""); // admin only
  const [fromDate, setFromDate] = useState(getMonthStartIso());
  const [toDate, setToDate] = useState(getTodayIso());
  const [statusFilter, setStatusFilter] = useState("all"); // client-side
  const [page, setPage] = useState(1);

  /* ── data ── */
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  /* ── meta ── */
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  /* ── ui state ── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ── guards ── */
  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════════════════════════════════════════════
     LOAD EMPLOYEES (admin only)
     ══════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    (async () => {
      setEmpLoading(true);
      try {
        const res = await api.get("/api/v1/get/employees", {
          params: { page: 1, page_size: 500 },
        });
        if (cancelled) return;

        const data = res?.data ?? {};
        const arr =
          data.employees ||
          data.data ||
          data.items ||
          (Array.isArray(data) ? data : []) ||
          [];

        setEmployees(
          arr.map((e) => ({
            id: e.employee_id || e.id || e.user_id,
            name:
              `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
              e.name ||
              e.full_name ||
              e.employee_id,
          }))
        );
      } catch {
        if (!cancelled) setEmployees([]);
      } finally {
        if (!cancelled) setEmpLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  /* ══════════════════════════════════════════════════════
     FETCH DATA
     ══════════════════════════════════════════════════════ */
  const fetchData = useCallback(async () => {
    // Employee must resolve own employee_id if not admin
    if (!isAdmin && !user?.employee_id) return;

    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        page_size: PAGE_SIZE,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      };

      // Admin → filter by selected employee; Employee → own only
      if (isAdmin && employeeId) {
        params.employee_id = employeeId;
      } else if (!isAdmin) {
        params.employee_id = user.employee_id;
      }

      const res = await api.get("/api/v1/get/attendence/history", { params });
      if (myReqId !== reqIdRef.current) return;

      const { items, total: t } = extractList(res);
      setRecords(items);
      setTotal(t);
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setRecords([]);
      setTotal(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [isAdmin, user?.employee_id, employeeId, fromDate, toDate, page]);

  /* Trigger fetch when filters change (debounced for text inputs) */
  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchData();
      return;
    }
    const t = setTimeout(fetchData, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchData]);

  /* ══════════════════════════════════════════════════════
     SUMMARY COMPUTATION
     ══════════════════════════════════════════════════════ */
  const summary = useMemo(() => {
    const s = {
      present: 0,
      half_day: 0,
      absent: 0,
      on_leave: 0,
      work_from_home: 0,
      on_duty: 0,
      holiday: 0,
      week_off: 0,
    };
    records.forEach((r) => {
      const key = normalizeStatus(r);
      if (Object.prototype.hasOwnProperty.call(s, key)) s[key] += 1;
    });
    return s;
  }, [records]);

  /* ══════════════════════════════════════════════════════
     FILTERED LIST (client-side status filter)
     ══════════════════════════════════════════════════════ */
  const filtered = useMemo(() => {
    if (statusFilter === "all") return records;
    return records.filter((r) => normalizeStatus(r) === statusFilter);
  }, [records, statusFilter]);

  /* ══════════════════════════════════════════════════════
     ACTIONS
     ══════════════════════════════════════════════════════ */
  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleClear = () => {
    setEmployeeId("");
    setFromDate(getMonthStartIso());
    setToDate(getTodayIso());
    setStatusFilter("all");
    setPage(1);
  };

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      setError("Nothing to export");
      return;
    }
    const headers = [
      "Date",
      "Weekday",
      "Employee",
      "Status",
      "First In",
      "Last Out",
      "Work Hours",
      "Break",
      "Overtime",
      "Late Minutes",
      "Remarks",
    ];
    const rows = filtered.map((r) => [
      formatDate(r.attendance_date, tz),
      formatWeekday(r.attendance_date, tz),
      r.employee_id || "",
      statusLabel(normalizeStatus(r)),
      formatTime(getFirstIn(r), tz),
      formatTime(getLastOut(r), tz),
      minutesToHhMm(r.total_work_minutes),
      r.break_minutes ? `${r.break_minutes} min` : "",
      r.overtime_minutes ? `${r.overtime_minutes} min` : "",
      r.is_late ? `${r.late_minutes || 0} min` : "",
      r.remarks || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-history-${fromDate || "start"}-to-${toDate || "end"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccess(`Exported ${filtered.length} record(s)`);
  };

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Attendance History</h1>
            <p className="mt-1 text-sm text-slate-500">
              {isAdmin
                ? "View and filter attendance across your company"
                : "Your attendance records"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filtered.length === 0}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              ⬇ Export CSV
            </button>
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {isAdmin && (
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Employee
                </label>
                <EmployeeSelect
                  value={employeeId}
                  onChange={(v) => {
                    setEmployeeId(v);
                    setPage(1);
                  }}
                  employees={employees}
                  loading={empLoading}
                />
              </div>
            )}

            <div className={isAdmin ? "" : "lg:col-span-2"}>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className={isAdmin ? "" : "lg:col-span-2"}>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                max={getTodayIso()}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                title="Reset filters"
              >
                ⟲
              </button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <SummaryCards
          summary={summary}
          activeStatus={statusFilter}
          onSelect={(s) => setStatusFilter(s)}
        />

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Records</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {statusFilter === "all"
                  ? `${total} record${total !== 1 ? "s" : ""}`
                  : `${filtered.length} of ${records.length} on this page`}
              </p>
            </div>
            {statusFilter !== "all" && (
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Clear status filter
              </button>
            )}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block">
            {loading && records.length === 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">Date</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Punch In</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Punch Out</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Work Hours</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Late</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📋
                </div>
                <p className="text-sm font-medium text-slate-700">No records found</p>
                <p className="text-xs text-slate-500">
                  Try changing date range or filters
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">Date</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Punch In</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Punch Out</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Work Hours</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Late</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((row, idx) => {
                    const status = normalizeStatus(row);
                    return (
                      <tr key={row.attendance_id || idx} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <div className="text-slate-700">
                            {formatDate(row.attendance_date, tz)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {formatWeekday(row.attendance_date, tz)}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(
                              status
                            )}`}
                          >
                            {statusLabel(status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                          {formatTime(getFirstIn(row), tz)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                          {formatTime(getLastOut(row), tz)}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {minutesToHhMm(row.total_work_minutes)}
                        </td>
                        <td className="px-5 py-3.5">
                          {row.is_late ? (
                            <span className="text-orange-600 text-xs">
                              +{row.late_minutes || 0}m
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile: card view */}
          <div className="md:hidden">
            {loading && records.length === 0 ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-500">
                No records found
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {filtered.map((row, idx) => (
                  <MobileCard key={row.attendance_id || idx} row={row} tz={tz} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && total > 0 && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      </div>
    </div>
  );
}