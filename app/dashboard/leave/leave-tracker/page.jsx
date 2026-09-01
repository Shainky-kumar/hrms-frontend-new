"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => (Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg)).join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

export default function LeaveTrackerPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterBy, setFilterBy] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.post("/api/v1/get/all/leave/applied", null, {
          params: { page, page_size: pageSize, search, filter_by: filterBy || undefined },
        });
        const data = res.data?.data ?? res.data ?? [];
        const items = Array.isArray(data) ? data : data?.items ?? data?.results ?? [];
        setList(items);
        setTotal(res.data?.total ?? res.data?.count ?? items.length);
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, search, filterBy]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/v1/get/all/leave/applied", null, {
        params: { page, page_size: pageSize, search, filter_by: filterBy || undefined },
      });
      const data = res.data?.data ?? res.data ?? [];
      const items = Array.isArray(data) ? data : data?.items ?? data?.results ?? [];
      setList(items);
      setTotal(res.data?.total ?? res.data?.count ?? items.length);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, filterBy]);

  const handleApproveReject = async (id, status) => {
    setActionLoading(id);
    try {
      await api.put(`/api/v1/employee/approve/leave/${id}`, { status });
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status) => {
    const s = (status || "").toLowerCase();
    const map = {
      pending: "bg-amber-50 text-amber-700",
      approved: "bg-emerald-50 text-emerald-700",
      rejected: "bg-red-50 text-red-700",
      cancelled: "bg-slate-100 text-slate-600",
    };
    return map[s] || "bg-slate-100 text-slate-600";
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Leave Requests</h1>
          <p className="mt-0.5 text-sm text-slate-500">View and manage all applied leaves</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search employee, leave type..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-3 text-sm outline-none focus:border-[#E42527] focus:bg-white focus:ring-1 focus:ring-[#E42527]/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterBy}
              onChange={(e) => { setFilterBy(e.target.value); setPage(1); }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#E42527]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-sm text-slate-500">{total} requests</span>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20 text-sm text-slate-500">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-500">No leave requests found</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 font-medium text-slate-500">#</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Leave Type</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Dates</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Days</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                  <th className="px-5 py-3 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((item, i) => (
                  <tr key={item.id || item.apply_leave_id || i} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 text-slate-500">{(page - 1) * pageSize + i + 1}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {item.employee_name || item.employee_id || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{item.leave_type_name || item.leave_type_id || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.start_date} → {item.end_date}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{item.days_requested ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(item.leave_status || item.status)}`}>
                        {item.leave_status || item.status || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {(item.leave_status || item.status || "").toLowerCase() === "pending" && (
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={actionLoading === (item.id || item.apply_leave_id)}
                            onClick={() => handleApproveReject(item.id || item.apply_leave_id, "approved")}
                            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                          >
                            Approve
                          </button>
                          <button
                            disabled={actionLoading === (item.id || item.apply_leave_id)}
                            onClick={() => handleApproveReject(item.id || item.apply_leave_id, "rejected")}
                            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}