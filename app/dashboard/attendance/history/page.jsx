
"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/app/lib/api";

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) =>
        Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
      )
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const toArray = (p) => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.attendance)) return p.attendance;
  if (Array.isArray(p?.history)) return p.history;
  if (Array.isArray(p?.items)) return p.items;
  return [];
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(d);
  }
};

const formatTime = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
};

const formatHours = (minutes) => {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// Status badge styling
const getStatusStyle = (status, isHalfDay) => {
  const s = (status || "").toLowerCase();

  if (isHalfDay || s === "half_day") {
    return "bg-purple-50 text-purple-700 border-purple-100";
  }
  if (s === "present") return "bg-green-50 text-green-700 border-green-100";
  if (s === "absent") return "bg-red-50 text-red-700 border-red-100";
  if (s === "on_leave") return "bg-blue-50 text-blue-700 border-blue-100";
  if (s === "work_from_home" || s === "wfh")
    return "bg-teal-50 text-teal-700 border-teal-100";
  if (s === "on_duty") return "bg-orange-50 text-orange-700 border-orange-100";
  if (s === "holiday") return "bg-indigo-50 text-indigo-700 border-indigo-100";
  if (s === "week_off") return "bg-gray-100 text-gray-600 border-gray-200";
  if (s === "missing_punch")
    return "bg-amber-50 text-amber-700 border-amber-100";

  return "bg-gray-100 text-gray-600 border-gray-200";
};

const getStatusLabel = (status, isHalfDay) => {
  if (isHalfDay || (status || "").toLowerCase() === "half_day") return "Half Day";
  if (!status) return "—";
  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function AttendanceHistoryPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/v1/get/attendence/history", {
          params: {
            employee_id: employeeId || undefined,
            from_date: fromDate || undefined,
            to_date: toDate || undefined,
            page,
            page_size: pageSize,
          },
        });
        const data = res?.data;
        setList(toArray(data));
        setTotal(data?.total || data?.total_count || toArray(data).length);
      } catch (err) {
        setError(formatApiError(err));
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, employeeId, fromDate, toDate, pageSize]);

  // Summary counts
  const summary = useMemo(() => {
    const counts = {
      present: 0,
      half_day: 0,
      absent: 0,
      on_leave: 0,
      work_from_home: 0,
      on_duty: 0,
      other: 0,
    };

    list.forEach((row) => {
      const s = (row.status || "").toLowerCase();
      const isHalf = row.is_half_day || s === "half_day";

      if (isHalf) counts.half_day += 1;
      else if (s === "present") counts.present += 1;
      else if (s === "absent") counts.absent += 1;
      else if (s === "on_leave") counts.on_leave += 1;
      else if (s === "work_from_home" || s === "wfh") counts.work_from_home += 1;
      else if (s === "on_duty") counts.on_duty += 1;
      else counts.other += 1;
    });

    return counts;
  }, [list]);

  // Filtered list
  const filteredList = useMemo(() => {
    if (statusFilter === "all") return list;

    return list.filter((row) => {
      const s = (row.status || "").toLowerCase();
      const isHalf = row.is_half_day || s === "half_day";

      if (statusFilter === "half_day") return isHalf;
      if (statusFilter === "present") return s === "present" && !isHalf;
      if (statusFilter === "absent") return s === "absent";
      if (statusFilter === "on_leave") return s === "on_leave";
      if (statusFilter === "wfh")
        return s === "work_from_home" || s === "wfh";
      if (statusFilter === "on_duty") return s === "on_duty";
      return true;
    });
  }, [list, statusFilter]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const summaryCards = [
    {
      key: "present",
      label: "Present",
      count: summary.present,
      color: "bg-green-50 border-green-100 text-green-700",
      active: "ring-2 ring-green-500",
    },
    {
      key: "half_day",
      label: "Half Day",
      count: summary.half_day,
      color: "bg-purple-50 border-purple-100 text-purple-700",
      active: "ring-2 ring-purple-500",
    },
    {
      key: "absent",
      label: "Absent",
      count: summary.absent,
      color: "bg-red-50 border-red-100 text-red-700",
      active: "ring-2 ring-red-500",
    },
    {
      key: "on_leave",
      label: "On Leave",
      count: summary.on_leave,
      color: "bg-blue-50 border-blue-100 text-blue-700",
      active: "ring-2 ring-blue-500",
    },
    {
      key: "wfh",
      label: "WFH",
      count: summary.work_from_home,
      color: "bg-teal-50 border-teal-100 text-teal-700",
      active: "ring-2 ring-teal-500",
    },
    {
      key: "on_duty",
      label: "On Duty",
      count: summary.on_duty,
      color: "bg-orange-50 border-orange-100 text-orange-700",
      active: "ring-2 ring-orange-500",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
          Attendance Overview
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Track Present, Half Day, Leave & more
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ===== SUMMARY CARDS ===== */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() =>
              setStatusFilter((prev) =>
                prev === card.key ? "all" : card.key
              )
            }
            className={`rounded-xl border p-4 text-left transition ${
              card.color
            } ${statusFilter === card.key ? card.active : "hover:shadow-sm"}`}
          >
            <p className="text-xs font-medium opacity-80">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.count}</p>
          </button>
        ))}
      </div>

      {/* ===== FILTERS + TABLE ===== */}
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-4 sm:flex-row sm:flex-wrap sm:items-end">
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              setPage(1);
              fetchData();
            }}
            className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
          >
            Search
          </button>

          {statusFilter !== "all" && (
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className="text-sm text-[#6b7280] hover:text-[#E42527]"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">
              Loading...
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">
              No records found
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">
                    Employee
                  </th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">
                    Status
                  </th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">
                    Punch In
                  </th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">
                    Punch Out
                  </th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">
                    Work Hours
                  </th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredList.map((row, i) => (
                  <tr
                    key={row.attendance_id || i}
                    className="hover:bg-[#fafafa]"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {formatDate(row.attendance_date)}
                    </td>
                    <td className="px-5 py-3.5">
                      {row.employee_name || row.employee_id || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(
                          row.status,
                          row.is_half_day
                        )}`}
                      >
                        {getStatusLabel(row.status, row.is_half_day)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {formatTime(row.first_punch_in)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {formatTime(row.last_punch_out)}
                    </td>
                    <td className="px-5 py-3.5">
                      {formatHours(row.total_work_minutes)}
                    </td>
                    <td className="px-5 py-3.5">
                      {row.is_late ? (
                        <span className="text-orange-600">
                          {row.late_minutes || 0}m
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3">
            <p className="text-sm text-[#6b7280]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}