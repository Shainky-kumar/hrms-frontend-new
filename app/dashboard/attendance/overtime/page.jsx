// "use client";

// import { useState } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// export default function OvertimePage() {
//   const user = useAuthStore((state) => state.user);
//   const employeeId =
//     user?.employee_id ||
//     user?.employeeId ||
//     user?.emp_id ||
//     user?.employee?.employee_id ||
//     "";
//   const [form, setForm] = useState({
//     attendance_date: "",
//     requested_minutes: "",
//     reason: "",
//   });
//   const [decideId, setDecideId] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const create = async (e) => {
//     e.preventDefault();
//     if (!employeeId) {
//       setError("Logged-in employee profile is not linked to an employee.");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/create/overtime", {
//         employee_id: employeeId,
//         attendance_date: form.attendance_date,
//         requested_minutes: Number(form.requested_minutes),
//         reason: form.reason || null,
//       });
//       setSuccess("Overtime request created");
//       setForm({ attendance_date: "", requested_minutes: "", reason: "" });
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const decide = async (status) => {
//     if (!decideId.trim()) return setError("Overtime ID required");
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.put(`/api/v1/get/overtime/${decideId.trim()}`, { status });
//       setSuccess(`Overtime ${status}`);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Overtime</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">Create and approve overtime requests</p>
//       </div>

//       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
//       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

//       <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="border-b border-[#e5e7eb] px-5 py-4">
//           <h2 className="text-sm font-semibold text-[#374151]">Create Request</h2>
//         </div>
//         <form onSubmit={create} className="grid gap-4 p-5 sm:grid-cols-2">
//           <input required type="date" value={form.attendance_date} onChange={(e) => setForm((p) => ({ ...p, attendance_date: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
//           <input required type="number" placeholder="Requested minutes" value={form.requested_minutes} onChange={(e) => setForm((p) => ({ ...p, requested_minutes: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
//           <input placeholder="Reason" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
//           <button type="submit" disabled={saving} className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 sm:col-span-2 sm:w-fit">
//             {saving ? "Saving..." : "Submit Overtime"}
//           </button>
//         </form>
//       </div>

//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="border-b border-[#e5e7eb] px-5 py-4">
//           <h2 className="text-sm font-semibold text-[#374151]">Approve / Reject</h2>
//         </div>
//         <div className="flex flex-wrap items-end gap-3 p-5">
//           <input placeholder="Overtime ID" value={decideId} onChange={(e) => setDecideId(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
//           <button type="button" disabled={saving} onClick={() => decide("approved")} className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">Approve</button>
//           <button type="button" disabled={saving} onClick={() => decide("rejected")} className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">Reject</button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 10;

const apiErr = (err) => {
  const d = err?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((e) => e?.msg || "Error").join(" • ");
  if (typeof d === "string") return d;
  return err?.message || "Something went wrong";
};

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  try {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return "—"; }
};

const fmtMinutes = (m) => {
  const n = Number(m);
  if (!n || n <= 0) return "0m";
  const h = Math.floor(n / 60);
  const mm = n % 60;
  if (h > 0 && mm > 0) return `${h}h ${mm}m`;
  if (h > 0) return `${h}h`;
  return `${mm}m`;
};

const getRole = (user) => {
  const r = String(user?.role?.value || user?.role || "").toLowerCase();
  return {
    isAdmin: r === "admin" || r.endsWith("admin"),
    isManager: r.includes("manager") || r.includes("lead") || r.includes("head"),
    isHR: r === "hr",
  };
};

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

/* ══════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════ */

export default function OvertimePage() {
  const user = useAuthStore((s) => s.user);
  const { isAdmin, isManager, isHR } = useMemo(() => getRole(user), [user]);
  const canApprove = isAdmin || isManager || isHR;

  const [employeeId, setEmployeeId] = useState("");
  const [loadingMe, setLoadingMe] = useState(true);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState(null);

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const reqIdRef = useRef(0);

  /* ── resolve employee ── */
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const res = await api.get("/api/v1/get/my-employee");
        if (!dead) setEmployeeId(res?.data?.employee_id || "");
      } catch (e) {
        if (!dead) setErr(apiErr(e));
      } finally {
        if (!dead) setLoadingMe(false);
      }
    })();
    return () => { dead = true; };
  }, []);

  /* ── fetch ── */
  const fetchList = useCallback(async () => {
    if (!employeeId) return;
    const myId = ++reqIdRef.current;
    setLoading(true);
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (!canApprove) params.employee_id = employeeId;
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await api.get("/api/v1/get/overtime", { params });
      if (myId !== reqIdRef.current) return;

      const d = res?.data ?? {};
      const items = Array.isArray(d.overtimes) ? d.overtimes : [];
      setList(items);
      setTotal(Number(d.total) || items.length);
    } catch (e) {
      if (myId === reqIdRef.current) setErr(apiErr(e));
    } finally {
      if (myId === reqIdRef.current) setLoading(false);
    }
  }, [employeeId, page, statusFilter, canApprove]);

  useEffect(() => {
    if (!employeeId) return;
    const t = setTimeout(fetchList, 200);
    return () => clearTimeout(t);
  }, [employeeId, fetchList]);

  /* ── create ── */
  const handleCreate = async (payload) => {
    setSaving(true); setErr(""); setOk("");
    try {
      await api.post("/api/v1/create/overtime", {
        employee_id: employeeId,
        ...payload,
      });
      setOk("Overtime request submitted successfully");
      setShowForm(false);
      setPage(1);
      await fetchList();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setSaving(false);
    }
  };

  /* ── decide ── */
  const handleDecide = async (row, status) => {
    const id = row.overtime_id || row.id;
    if (!id) return;
    setActingId(id); setErr(""); setOk("");
    try {
      await api.put(`/api/v1/get/overtime/${id}`, { status });
      setOk(`Request ${status} successfully`);
      await fetchList();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setActingId(null);
    }
  };

  /* ── auto clear ── */
  useEffect(() => { if (ok) { const t = setTimeout(() => setOk(""), 3500); return () => clearTimeout(t); } }, [ok]);
  useEffect(() => { if (err) { const t = setTimeout(() => setErr(""), 5000); return () => clearTimeout(t); } }, [err]);

  /* ── filter ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) =>
      String(r.employee_name || "").toLowerCase().includes(q) ||
      String(r.reason || "").toLowerCase().includes(q) ||
      String(r.attendance_date || "").includes(q)
    );
  }, [list, search]);

  /* ── stats ── */
  const stats = useMemo(() => {
    const p = list.filter((r) => String(r.status).toUpperCase() === "PENDING").length;
    const a = list.filter((r) => String(r.status).toUpperCase() === "APPROVED").length;
    const rj = list.filter((r) => String(r.status).toUpperCase() === "REJECTED").length;
    const mins = list
      .filter((r) => String(r.status).toUpperCase() === "APPROVED")
      .reduce((s, r) => s + (Number(r.requested_minutes) || 0), 0);
    return { total: list.length, pending: p, approved: a, rejected: rj, mins };
  }, [list]);

  /* ── loading ── */
  if (loadingMe) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="h-64 animate-pulse rounded border border-slate-200 bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-5 py-5 sm:px-6 lg:px-8">

        {/* ═══════════ PAGE HEADER ═══════════ */}
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <nav className="mb-1.5 flex items-center gap-1 text-xs text-slate-500">
              <span className="hover:text-slate-700">Home</span>
              <span className="text-slate-300">/</span>
              <span className="hover:text-slate-700">Attendance</span>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-700">Overtime</span>
            </nav>
            <h1 className="text-xl font-semibold text-slate-900">Overtime</h1>
            <p className="mt-0.5 text-[13px] text-slate-500">
              {canApprove
                ? "Review, approve or reject overtime requests"
                : "Submit and track your overtime requests"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchList}
              disabled={loading}
              className="h-9 rounded border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="h-9 rounded bg-[#E42527] px-4 text-sm font-medium text-white transition hover:bg-[#c91f21]"
            >
              + New Request
            </button>
          </div>
        </div>

        {/* ═══════════ TOASTS ═══════════ */}
        {err && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            <span className="font-semibold">Error:</span> {err}
          </div>
        )}
        {ok && (
          <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            <span className="font-semibold">Success:</span> {ok}
          </div>
        )}

        {/* ═══════════ STATS STRIP ═══════════ */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded border border-slate-200 bg-white px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Total</p>
            <p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{stats.total}</p>
          </div>
          <div className="rounded border border-slate-200 bg-white px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Pending</p>
            <p className="mt-1 text-xl font-semibold text-amber-600 tabular-nums">{stats.pending}</p>
          </div>
          <div className="rounded border border-slate-200 bg-white px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Approved</p>
            <p className="mt-1 text-xl font-semibold text-emerald-600 tabular-nums">{stats.approved}</p>
          </div>
          <div className="rounded border border-slate-200 bg-white px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Rejected</p>
            <p className="mt-1 text-xl font-semibold text-red-600 tabular-nums">{stats.rejected}</p>
          </div>
        </div>

        {/* ═══════════ TABLE ═══════════ */}
        <div className="rounded border border-slate-200 bg-white">

          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex overflow-x-auto">
              {STATUS_TABS.map((t) => {
                const active = statusFilter === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setStatusFilter(t.id); setPage(1); }}
                    className={`relative whitespace-nowrap px-4 py-3.5 text-sm font-medium transition ${
                      active ? "text-[#E42527]" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t.label}
                    {active && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[#E42527]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mb-3 lg:mb-0 lg:w-72">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, reason or date..."
                className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]"
              />
            </div>
          </div>

          {/* Content */}
          {loading && list.length === 0 ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <p className="text-sm font-medium text-slate-700">
                {search || statusFilter !== "all"
                  ? "No requests match your filters"
                  : "No overtime requests yet"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {search || statusFilter !== "all"
                  ? "Try clearing filters or adjusting the search."
                  : "Click + New Request to submit your first request."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Date</th>
                    {canApprove && (
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Employee</th>
                    )}
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Requested</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Reason</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
                    {canApprove && (
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((row, i) => {
                    const id = row.overtime_id || row.id || i;
                    const status = String(row.status || "PENDING").toUpperCase();
                    const isPending = status === "PENDING";
                    const busy = actingId === (row.overtime_id || row.id);

                    let statusCls = "border-amber-300 bg-amber-50 text-amber-700";
                    if (status === "APPROVED") statusCls = "border-emerald-300 bg-emerald-50 text-emerald-700";
                    if (status === "REJECTED") statusCls = "border-red-300 bg-red-50 text-red-700";

                    return (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {fmtDate(row.attendance_date)}
                        </td>

                        {canApprove && (
                          <td className="px-4 py-3 text-slate-800">
                            {row.employee_name || row.employee_id || "—"}
                          </td>
                        )}

                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                          {fmtMinutes(row.requested_minutes)}
                        </td>

                        <td className="max-w-xs px-4 py-3 text-slate-600">
                          <span className="line-clamp-1">{row.reason || "—"}</span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold ${statusCls}`}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </span>
                        </td>

                        {canApprove && (
                          <td className="px-4 py-3 text-right">
                            {isPending ? (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleDecide(row, "approved")}
                                  disabled={busy}
                                  className="h-8 rounded border border-emerald-300 bg-white px-3 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
                                >
                                  {busy ? "..." : "Approve"}
                                </button>
                                <button
                                  onClick={() => handleDecide(row, "rejected")}
                                  disabled={busy}
                                  className="h-8 rounded border border-red-300 bg-white px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <span className="text-xs text-slate-500">
                Showing <span className="font-medium text-slate-700">{(page - 1) * PAGE_SIZE + 1}</span>–
                <span className="font-medium text-slate-700">{Math.min(page * PAGE_SIZE, total)}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-8 rounded border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= Math.ceil(total / PAGE_SIZE)}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 rounded border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ═══════════ CREATE MODAL ═══════════ */}
      {showForm && (
        <NewOvertimeModal
          onClose={() => !saving && setShowForm(false)}
          onSubmit={handleCreate}
          saving={saving}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CREATE MODAL
   ══════════════════════════════════════════════════════════ */

function NewOvertimeModal({ onClose, onSubmit, saving }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [minutes, setMinutes] = useState("60");
  const [reason, setReason] = useState("");

  const m = Number(minutes);
  const valid = date && m > 0 && m <= 1440;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSubmit({
      attendance_date: date,
      requested_minutes: m,
      reason: reason.trim() || null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md overflow-hidden rounded border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">New Overtime Request</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="space-y-4 px-4 py-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Select today or a past date
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Extra Time Worked <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="15"
              max="1440"
              step="15"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="e.g. 120"
              className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]"
            />
            {m > 0 && (
              <p className="mt-1 text-[11px] text-slate-500">
                ≈ <span className="font-medium text-slate-700">{fmtMinutes(m)}</span> (in minutes)
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Reason <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              placeholder="e.g. Client release deadline"
              className="w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-9 rounded border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving || !valid}
            className="h-9 rounded bg-[#E42527] px-4 text-sm font-medium text-white transition hover:bg-[#c91f21] disabled:opacity-60"
          >
            {saving ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}