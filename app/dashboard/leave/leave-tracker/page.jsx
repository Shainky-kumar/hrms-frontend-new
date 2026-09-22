// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { api } from "@/lib/api";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail.map((e) => (Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg)).join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// export default function LeaveTrackerPage() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [filterBy, setFilterBy] = useState("");
//   const [actionLoading, setActionLoading] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await api.post("/api/v1/get/all/leave/applied", null, {
//           params: { page, page_size: pageSize, search, filter_by: filterBy || undefined },
//         });
//         const data = res.data?.data ?? res.data ?? [];
//         const items = Array.isArray(data) ? data : data?.items ?? data?.results ?? [];
//         setList(items);
//         setTotal(res.data?.total ?? res.data?.count ?? items.length);
//       } catch (err) {
//         setError(formatApiError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [page, pageSize, search, filterBy]);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.post("/api/v1/get/all/leave/applied", null, {
//         params: { page, page_size: pageSize, search, filter_by: filterBy || undefined },
//       });
//       const data = res.data?.data ?? res.data ?? [];
//       const items = Array.isArray(data) ? data : data?.items ?? data?.results ?? [];
//       setList(items);
//       setTotal(res.data?.total ?? res.data?.count ?? items.length);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [page, pageSize, search, filterBy]);

//   const handleApproveReject = async (id, status) => {
//     setActionLoading(id);
//     try {
//       await api.put(`/api/v1/employee/approve/leave/${id}`, { status });
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const statusBadge = (status) => {
//     const s = (status || "").toLowerCase();
//     const map = {
//       pending: "bg-amber-50 text-amber-700",
//       approved: "bg-emerald-50 text-emerald-700",
//       rejected: "bg-red-50 text-red-700",
//       cancelled: "bg-slate-100 text-slate-600",
//     };
//     return map[s] || "bg-slate-100 text-slate-600";
//   };

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   return (
//     <div>
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">Leave Requests</h1>
//           <p className="mt-0.5 text-sm text-slate-500">View and manage all applied leaves</p>
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative w-full max-w-xs">
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//               placeholder="Search employee, leave type..."
//               className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-3 text-sm outline-none focus:border-[#E42527] focus:bg-white focus:ring-1 focus:ring-[#E42527]/30"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <select
//               value={filterBy}
//               onChange={(e) => { setFilterBy(e.target.value); setPage(1); }}
//               className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#E42527]"
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//             <span className="text-sm text-slate-500">{total} requests</span>
//           </div>
//         </div>

//         {error && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
//         )}

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex justify-center py-20 text-sm text-slate-500">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">No leave requests found</div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/80">
//                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Leave Type</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Dates</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Days</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Status</th>
//                   <th className="px-5 py-3 font-medium text-slate-500 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {list.map((item, i) => (
//                   <tr key={item.id || item.apply_leave_id || i} className="hover:bg-slate-50/70">
//                     <td className="px-5 py-3.5 text-slate-500">{(page - 1) * pageSize + i + 1}</td>
//                     <td className="px-5 py-3.5 font-medium text-slate-800">
//                       {item.employee_name || item.employee_id || "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">{item.leave_type_name || item.leave_type_id || "—"}</td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.start_date} → {item.end_date}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">{item.days_requested ?? "—"}</td>
//                     <td className="px-5 py-3.5">
//                       <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(item.leave_status || item.status)}`}>
//                         {item.leave_status || item.status || "—"}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       {(item.leave_status || item.status || "").toLowerCase() === "pending" && (
//                         <div className="flex justify-end gap-2">
//                           <button
//                             disabled={actionLoading === (item.id || item.apply_leave_id)}
//                             onClick={() => handleApproveReject(item.id || item.apply_leave_id, "approved")}
//                             className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             disabled={actionLoading === (item.id || item.apply_leave_id)}
//                             onClick={() => handleApproveReject(item.id || item.apply_leave_id, "rejected")}
//                             className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
//             <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
//             <div className="flex gap-2">
//               <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Previous</button>
//               <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


//  new code 


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// ⚠️ VERIFY: keep consistent with rest of app (see note below)
import { api } from "@/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const LEAVE_STATUSES = ["pending", "approved", "rejected", "cancelled"];

const HR_ROLES = new Set([
  "hr",
  "hr_manager",
  "hr-manager",
  "admin",
  "super_admin",
  "super-admin",
  "superadmin",
  "owner",
  "manager",
  "team_lead",
  "team-lead",
  "payroll_officer",
  "payroll-officer",
]);

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

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
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission for this action.";
  return err?.message || "Something went wrong";
};

const isCancel = (err) =>
  err?.name === "CanceledError" ||
  err?.code === "ERR_CANCELED" ||
  err?.name === "AbortError";

const pickList = (response) => {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return (
    data?.items ??
    data?.results ??
    data?.leaves ??
    data?.applications ??
    data?.leave_applications ??
    []
  );
};

const pickTotal = (response, fallbackCount) => {
  const raw =
    response?.data?.total ??
    response?.data?.data?.total ??
    response?.data?.count;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallbackCount;
};

const hasHrAccess = (user) => {
  if (!user) return false;
  const roles = [
    user.role,
    ...(Array.isArray(user.roles) ? user.roles : []),
    ...(Array.isArray(user.user_roles) ? user.user_roles : []),
  ]
    .filter(Boolean)
    .map((r) =>
      String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
        .toLowerCase()
        .trim()
    );
  return roles.some((r) => HR_ROLES.has(r));
};

const getLeaveId = (l) =>
  l?.apply_leave_id ??
  l?.leave_application_id ??
  l?.leave_apply_id ??
  l?.leave_id ??
  l?.id ??
  null;

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusOf = (item) =>
  String(item?.leave_status ?? item?.status ?? "PENDING").toUpperCase();

const statusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  const map = {
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
    cancelled: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
  return map[s] || "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
};

const getLeaveTypeLabel = (item) => {
  const name =
    item.leave_type_name ||
    item.leave_type?.leave_type_name ||
    item.leave_type?.name;
  if (name) return name;
  const id = item.leave_type_id;
  if (!id) return "—";
  const s = String(id);
  return s.length > 12 ? `${s.slice(0, 8)}…` : s;
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function LeaveTrackerPage() {
  const user = useAuthStore((s) => s.user);
  const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [actionId, setActionId] = useState(null);
  const [details, setDetails] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  // confirmAction = { type: "approve" | "reject", leave }

  const abortRef = useRef(null);

  /* ---------- debounce search ---------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ---------- auto-dismiss success ---------- */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  /* ---------- SINGLE fetchData (no duplicate!) ---------- */
  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    try {
      const res = await api.post(
        "/api/v1/get/all/leave/applied",
        null,
        {
          params: {
            page,
            page_size: pageSize,
            ...(search ? { search } : {}),
            ...(filterBy ? { filter_by: filterBy } : {}),
          },
          signal: controller.signal,
        }
      );
      const items = pickList(res);
      const safe = Array.isArray(items) ? items : [];
      setList(safe);
      setTotal(pickTotal(res, safe.length));
    } catch (err) {
      if (isCancel(err)) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [page, pageSize, search, filterBy]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData]);

  /* ---------- approve / reject ---------- */
  const handleUpdateStatus = async (leave, status, decisionReason = "") => {
    const id = getLeaveId(leave);
    if (!id) {
      setError("Leave ID not found");
      return;
    }

    setActionId(`${id}-${status}`);
    setError("");
    try {
      await api.put(`/api/v1/employee/approve/leave/${id}`, {
        status: status.toUpperCase(), // ← UPPERCASE for backend enum
        decision_reason: decisionReason || null,
      });
      setSuccess(`Leave ${status.toLowerCase()} successfully`);
      setConfirmAction(null);
      setDetails(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
      setConfirmAction(null);
    } finally {
      setActionId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Leave Requests
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            View and manage all applied leaves
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* ---------- toolbar ---------- */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search employee, leave type…"
            autoComplete="off"
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white focus:ring-1 focus:ring-[#E42527]/30"
          />

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#E42527]"
            >
              <option value="">All Status</option>
              {LEAVE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={fetchData}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Refresh
            </button>
            <span className="text-sm text-slate-500">
              {total} request{total === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* ---------- banners ---------- */}
        {error && (
          <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}
        {success && (
          <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-emerald-400 hover:text-emerald-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* ---------- table ---------- */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
              <p className="text-sm">Loading…</p>
            </div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700">
                No leave requests found
              </p>
              {(search || filterBy) && (
                <p className="mt-2">
                  Try clearing filters or search.
                </p>
              )}
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 font-medium text-slate-500">#</th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Employee
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Leave Type
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Dates
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500">Days</th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((item, i) => {
                  const id = getLeaveId(item);
                  const status = statusOf(item);
                  const canAct =
                    isHrOrAdmin && status === "PENDING";

                  return (
                    <tr key={id || i} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 text-slate-500">
                        {(page - 1) * pageSize + i + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-800">
                          {item.employee_name ||
                            item.employee?.name ||
                            item.employee_id ||
                            "—"}
                        </div>
                        {item.employee_id && item.employee_name && (
                          <div className="text-xs text-slate-400">
                            {item.employee_id}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-700">
                          {getLeaveTypeLabel(item)}
                        </div>
                        {item.is_half_day && (
                          <span className="mt-0.5 inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                            Half Day ({item.half_day_session || "—"})
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <div>{formatDate(item.start_date)}</div>
                        <div className="text-xs text-slate-400">
                          → {formatDate(item.end_date)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {item.days_requested ?? "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(status)}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setDetails(item)}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            View
                          </button>
                          {canAct && (
                            <>
                              <button
                                type="button"
                                disabled={!!actionId}
                                onClick={() =>
                                  setConfirmAction({ type: "approve", leave: item })
                                }
                                className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                              >
                                {actionId === `${id}-APPROVED` ? "…" : "Approve"}
                              </button>
                              <button
                                type="button"
                                disabled={!!actionId}
                                onClick={() =>
                                  setConfirmAction({ type: "reject", leave: item })
                                }
                                className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                              >
                                {actionId === `${id}-REJECTED` ? "…" : "Reject"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ---------- pagination ---------- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {details && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Leave Application
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  {getLeaveTypeLabel(details)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Employee", details.employee_name || details.employee_id],
                  ["Employee ID", details.employee_id],
                  ["Leave Type", getLeaveTypeLabel(details)],
                  ["Policy ID", details.leave_policy_id],
                  ["Start Date", formatDate(details.start_date)],
                  ["End Date", formatDate(details.end_date)],
                  ["Days", details.days_requested],
                  [
                    "Half Day",
                    details.is_half_day
                      ? `Yes (${details.half_day_session || "—"})`
                      : "No",
                  ],
                  ["Status", statusOf(details)],
                  ["Current Level", details.current_level],
                  ["Approver", details.approver_name || details.approver_id],
                  ["Decision Reason", details.decision_reason],
                  ["Document", details.document_url],
                  ["Applied On", formatDate(details.created_at)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-slate-50 px-3 py-2.5"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>

              {details.reason && (
                <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">
                  <p className="text-xs text-slate-400">Reason</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {details.reason}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {isHrOrAdmin && statusOf(details) === "PENDING" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const item = details;
                      setDetails(null);
                      setConfirmAction({ type: "reject", leave: item });
                    }}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const item = details;
                      setDetails(null);
                      setConfirmAction({ type: "approve", leave: item });
                    }}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM ACTION MODAL ================= */}
      {confirmAction && (
        <ConfirmLeaveActionModal
          action={confirmAction}
          onClose={() => setConfirmAction(null)}
          onUpdateStatus={handleUpdateStatus}
          busy={!!actionId}
        />
      )}
    </div>
  );
}

/* ================================================================== */
/*  CONFIRM ACTION MODAL                                              */
/* ================================================================== */

function ConfirmLeaveActionModal({
  action,
  onClose,
  onUpdateStatus,
  busy,
}) {
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState("");

  const { type, leave } = action;
  const isReject = type === "reject";

  const handleConfirm = async () => {
    if (isReject) {
      if (!reason.trim()) {
        setLocalError("Rejection reason is required.");
        return;
      }
      await onUpdateStatus(leave, "REJECTED", reason.trim());
    } else {
      await onUpdateStatus(leave, "APPROVED");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">
            {isReject ? "Reject this leave?" : "Approve this leave?"}
          </h2>
        </div>
        <div className="space-y-3 px-5 py-5 text-sm text-slate-600">
          <p>
            {isReject ? "Reject" : "Approve"} the leave for{" "}
            <span className="font-medium text-slate-800">
              {leave.employee_name || leave.employee_id}
            </span>{" "}
            from {formatDate(leave.start_date)} to {formatDate(leave.end_date)}?
          </p>

          {isReject && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Rejection Reason *
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setLocalError("");
                }}
                maxLength={300}
                placeholder="Explain why this leave is being rejected…"
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {reason.length}/300
              </p>
            </div>
          )}

          {localError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-red-600">
              {localError}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
              isReject
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {busy ? "Processing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}