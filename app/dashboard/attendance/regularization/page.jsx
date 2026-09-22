// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// const toArray = (p) => {
//   if (!p) return [];
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p?.data)) return p.data;
//   if (Array.isArray(p?.regularizations)) return p.regularizations;
//   if (Array.isArray(p?.employees)) return p.employees;
//   if (Array.isArray(p?.items)) return p.items;
//   if (Array.isArray(p?.results)) return p.results;
//   return [];
// };

// const getEmployeeId = (employee) =>
//   employee.employee_id || employee.id || employee._id;

// const getEmployeeName = (employee) => {
//   const fullName = [employee.first_name, employee.last_name]
//     .filter(Boolean)
//     .join(" ");

//   return fullName || employee.name || employee.full_name || getEmployeeId(employee);
// };

// const formatDate = (d) => (!d ? "—" : new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));

// export default function RegularizationPage() {
//   const [list, setList] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     employee_id: "",
//     attendance_date: "",
//     requested_status: "present",
//     requested_punch_in: "",
//     requested_punch_out: "",
//     reason: "",
//   });
//   const [filterStatus, setFilterStatus] = useState("");
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await api.get("/api/v1/get/employees");
//         setEmployees(toArray(res?.data));
//       } catch (err) {
//         setError(formatApiError(err));
//         setEmployees([]);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const fetchList = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/get/regularizations", {
//         params: { status: filterStatus || undefined, page, page_size: 10 },
//       });
//       setList(toArray(res?.data));
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filterStatus, page]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchList();
//     }, 0);

//     return () => clearTimeout(timeoutId);
//   }, [fetchList]);

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/attendence/regularization", {
//         employee_id: form.employee_id,
//         attendance_date: form.attendance_date,
//         requested_status: form.requested_status || null,
//         requested_punch_in: form.requested_punch_in || null,
//         requested_punch_out: form.requested_punch_out || null,
//         reason: form.reason,
//       });
//       setSuccess("Request submitted");
//       setShowForm(false);
//       setForm({ employee_id: "", attendance_date: "", requested_status: "present", requested_punch_in: "", requested_punch_out: "", reason: "" });
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const decide = async (id, status) => {
//     const decision_reason = window.prompt(`Reason for ${status}?`) || "";
//     try {
//       await api.put(`/api/v1/update/regularization/${id}`, { status, decision_reason });
//       setSuccess(`Marked ${status}`);
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Regularization</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">Request attendance correction</p>
//         </div>
//         <button onClick={() => setShowForm(true)} className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]">+ New Request</button>
//       </div>

//       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
//       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

//       <div className="mb-4 flex gap-2">
//         <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
//           <option value="">All status</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>
//         <button onClick={() => { setPage(1); fetchList(); }} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm">Filter</button>
//       </div>

//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">No requests</div>
//           ) : (
//             <table className="w-full min-w-[800px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Reason</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((r, i) => (
//                   <tr key={r.regularization_id || i} className="hover:bg-[#fafafa]">
//                     <td className="px-5 py-3.5">{r.employee_id}</td>
//                     <td className="px-5 py-3.5">{formatDate(r.attendance_date)}</td>
//                     <td className="px-5 py-3.5 capitalize">{r.status}</td>
//                     <td className="px-5 py-3.5 max-w-[200px] truncate">{r.reason || "—"}</td>
//                     <td className="px-5 py-3.5 text-right">
//                       {r.status === "pending" && (
//                         <div className="flex justify-end gap-2">
//                           <button onClick={() => decide(r.regularization_id, "approved")} className="text-xs font-medium text-green-600">Approve</button>
//                           <button onClick={() => decide(r.regularization_id, "rejected")} className="text-xs font-medium text-red-600">Reject</button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
//               <h2 className="font-semibold text-[#1a1a1a]">New Regularization</h2>
//               <button onClick={() => setShowForm(false)} className="text-[#9ca3af]">✕</button>
//             </div>
//             <form onSubmit={submit} className="space-y-4 p-5">
//               <select required value={form.employee_id} onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm">
//                 <option value="">Select employee</option>
//                 {employees.map((employee) => {
//                   const id = getEmployeeId(employee);

//                   return id ? (
//                     <option key={id} value={id}>
//                       {getEmployeeName(employee)} ({id})
//                     </option>
//                   ) : null;
//                 })}
//               </select>
//               <input required type="date" value={form.attendance_date} onChange={(e) => setForm((p) => ({ ...p, attendance_date: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
//               <select value={form.requested_status} onChange={(e) => setForm((p) => ({ ...p, requested_status: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm">
//                 <option value="present">Present</option>
//                 <option value="half_day">Half Day</option>
//                 <option value="absent">Absent</option>
//                 <option value="work_from_home">WFH</option>
//               </select>
//               <textarea required rows={3} placeholder="Reason" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
//               <div className="flex justify-end gap-2">
//                 <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm">Cancel</button>
//                 <button type="submit" disabled={saving} className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Submit"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

/**
 * RegularizationPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ No window.prompt/confirm — custom modals
 *  ✓ Searchable employee dropdown
 *  ✓ Status filter chips (All/Pending/Approved/Rejected)
 *  ✓ Date range + employee filters
 *  ✓ Approve/Reject with reason modal
 *  ✓ Bulk approve/reject (multi-select)
 *  ✓ Role-aware (admin sees all, employee sees own)
 *  ✓ Status badges, pagination, mobile responsive
 *  ✓ Timezone-aware formatting
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

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 450;
const AUTO_DISMISS_MS = 5000;

const STATUS_OPTIONS = [
  { value: "all", label: "All", tone: "slate" },
  { value: "pending", label: "Pending", tone: "amber" },
  { value: "approved", label: "Approved", tone: "green" },
  { value: "rejected", label: "Rejected", tone: "red" },
];

const REQUESTED_STATUS = [
  { value: "present", label: "Present" },
  { value: "half_day", label: "Half Day" },
  { value: "absent", label: "Absent" },
  { value: "work_from_home", label: "Work From Home" },
  { value: "on_duty", label: "On Duty" },
  { value: "on_leave", label: "On Leave" },
];

const EMPTY_FORM = {
  employee_id: "",
  attendance_date: "",
  requested_status: "present",
  requested_punch_in: "",
  requested_punch_out: "",
  reason: "",
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
  return err?.message || "Something went wrong";
};

const formatDate = (v, tz) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
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

const formatTime = (v, tz) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
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
  if (Array.isArray(data.regularizations))
    return { items: data.regularizations, total: Number(data.total) || data.regularizations.length };
  if (Array.isArray(data.data))
    return { items: data.data, total: Number(data.total) || data.data.length };
  if (Array.isArray(data.items))
    return { items: data.items, total: Number(data.total) || data.items.length };
  return { items: [], total: 0 };
};

const extractEmployees = (res) => {
  const data = res?.data ?? {};
  const arr =
    (Array.isArray(data) && data) ||
    data.employees ||
    data.data ||
    data.items ||
    data.result ||
    [];
  return arr.map((e) => {
    const id = e.employee_id || e.id || e.user_id || "";
    const name =
      e.full_name ||
      e.name ||
      e.employee_name ||
      `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
      id;
    return { id, name, email: e.email || e.company_email || "" };
  });
};

const statusBadgeClass = (s) => {
  switch (String(s || "").toLowerCase()) {
    case "approved":
      return "bg-green-50 text-green-700 border-green-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "cancelled":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const statusLabel = (s) =>
  String(s || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

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
    <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <span className="whitespace-pre-line">{message}</span>
      <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function EmployeeDropdown({ value, onChange, options, placeholder = "Select employee..." }) {
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
    ? options.filter((o) => {
        const q = query.toLowerCase();
        return o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
      })
    : options;

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm focus:border-red-500 focus:outline-none"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {selected ? `${selected.name} (${selected.id})` : placeholder}
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
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </span>
          )}
          <span className="text-slate-400">▾</span>
        </div>
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
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

function ReasonModal({
  open,
  title,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
  loading,
  requireReason = false,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const canSubmit = !requireReason || reason.trim().length >= 2;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {requireReason ? "A reason is required." : "Reason is optional."}
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          autoFocus
          placeholder="Add a note for the employee..."
          className="mt-3 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason.trim())}
            disabled={loading || !canSubmit}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
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
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="px-3 text-xs text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CREATE MODAL
   ══════════════════════════════════════════════════════════ */

function CreateModal({ open, onClose, onCreated, employees, lockedEmployeeId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({
      ...EMPTY_FORM,
      employee_id: lockedEmployeeId || "",
      attendance_date: getTodayIso(),
    });
    setError("");
  }, [open, lockedEmployeeId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, saving, onClose]);

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.employee_id) {
      setError("Please select an employee");
      return;
    }
    if (!form.attendance_date) {
      setError("Please select a date");
      return;
    }
    if (!form.reason.trim()) {
      setError("Please provide a reason");
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/v1/attendence/regularization", {
        employee_id: form.employee_id,
        attendance_date: form.attendance_date,
        requested_status: form.requested_status || null,
        requested_punch_in: form.requested_punch_in || null,
        requested_punch_out: form.requested_punch_out || null,
        reason: form.reason.trim(),
      });
      onCreated?.();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">New Regularization</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Correct attendance for a specific date
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
              {error}
            </div>
          )}

          {/* Employee */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Employee <span className="text-red-600">*</span>
            </label>
            {lockedEmployeeId ? (
              <input
                value={lockedEmployeeId}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
              />
            ) : (
              <EmployeeDropdown
                value={form.employee_id}
                onChange={set("employee_id")}
                options={employees}
              />
            )}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Attendance Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              value={form.attendance_date}
              max={getTodayIso()}
              onChange={(e) => set("attendance_date")(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Requested status */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Requested Status
            </label>
            <select
              value={form.requested_status}
              onChange={(e) => set("requested_status")(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            >
              {REQUESTED_STATUS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Punch times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Punch In (optional)
              </label>
              <input
                type="time"
                value={form.requested_punch_in}
                onChange={(e) => set("requested_punch_in")(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Punch Out (optional)
              </label>
              <input
                type="time"
                value={form.requested_punch_out}
                onChange={(e) => set("requested_punch_out")(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Reason <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.reason}
              onChange={(e) => set("reason")(e.target.value)}
              placeholder="e.g. Forgot to punch out, biometric not working"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function RegularizationPage() {
  const user = useAuthStore((s) => s.user);
  const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";
  const role = String(user?.role?.value || user?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";

  /* list */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  /* filters */
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeId, setEmployeeId] = useState("");
  const [fromDate, setFromDate] = useState(getMonthStartIso());
  const [toDate, setToDate] = useState(getTodayIso());

  /* employees (admin) */
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  /* ui */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creating, setCreating] = useState(false);
  const [actionId, setActionId] = useState(null);

  /* bulk select */
  const [selectedIds, setSelectedIds] = useState(new Set());

  /* modal state */
  const [confirmAction, setConfirmAction] = useState(null);
  // { id, action } or { ids: [...], action }

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOAD EMPLOYEES (admin only) ══════════════ */
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
        setEmployees(extractEmployees(res));
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

  /* ══════════════ FETCH LIST ══════════════ */
  const fetchList = useCallback(async () => {
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
      if (statusFilter !== "all") params.status = statusFilter;
      if (isAdmin && employeeId) params.employee_id = employeeId;
      if (!isAdmin && user?.employee_id) params.employee_id = user.employee_id;

      const res = await api.get("/api/v1/get/regularizations", { params });
      if (myReqId !== reqIdRef.current) return;

      const { items, total: t } = extractList(res);
      setList(items);
      setTotal(t);
      setSelectedIds(new Set());
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [page, statusFilter, employeeId, fromDate, toDate, isAdmin, user?.employee_id]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchList();
      return;
    }
    const t = setTimeout(fetchList, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchList]);

  /* ══════════════ HELPERS ══════════════ */
  const getEmpName = useCallback(
    (id) => {
      if (!id) return "—";
      const e = employees.find((x) => x.id === id);
      return e ? e.name : id;
    },
    [employees]
  );

  const handleCreated = () => {
    setCreating(false);
    setSuccess("Request submitted");
    setPage(1);
    fetchList();
  };

  /* ══════════════ ACTION ══════════════ */
  const performAction = async (id, action, reason) => {
    setActionId(id);
    setError("");
    try {
      await api.put(`/api/v1/update/regularization/${id}`, {
        status: action,
        decision_reason: reason || null,
      });
      setSuccess(`Request ${action}`);
      setConfirmAction(null);
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  const bulkPerformAction = async (ids, action, reason) => {
    setActionId("bulk");
    setError("");
    const results = await Promise.allSettled(
      ids.map((id) =>
        api.put(`/api/v1/update/regularization/${id}`, {
          status: action,
          decision_reason: reason || null,
        })
      )
    );
    const okCount = results.filter((r) => r.status === "fulfilled").length;
    const failCount = results.length - okCount;
    setSuccess(
      `${okCount} request(s) ${action}${failCount ? ` · ${failCount} failed` : ""}`
    );
    setConfirmAction(null);
    setSelectedIds(new Set());
    setActionId(null);
    fetchList();
  };

  const handleConfirm = async (reason) => {
    if (!confirmAction) return;
    if (confirmAction.id) {
      await performAction(confirmAction.id, confirmAction.action, reason);
    } else if (confirmAction.ids) {
      await bulkPerformAction(confirmAction.ids, confirmAction.action, reason);
    }
  };

  /* ══════════════ SELECTION ══════════════ */
  const pendingIds = useMemo(
    () =>
      list
        .filter((r) => String(r.status || "").toLowerCase() === "pending")
        .map((r) => r.regularization_id)
        .filter(Boolean),
    [list]
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (checked) => {
    setSelectedIds(checked ? new Set(pendingIds) : new Set());
  };

  const selectedList = Array.from(selectedIds);
  const allSelected = pendingIds.length > 0 && selectedIds.size === pendingIds.length;

  /* ══════════════ DERIVED ══════════════ */
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Regularization</h1>
            <p className="mt-1 text-sm text-slate-500">
              {isAdmin
                ? "Review and approve attendance corrections"
                : "Request corrections for your attendance"}
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchList}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                + New Request
              </button>
            )}
          </div>
        </div>

        {/* Toast */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {isAdmin && (
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Employee
                </label>
                <EmployeeDropdown
                  value={employeeId}
                  onChange={(v) => {
                    setEmployeeId(v);
                    setPage(1);
                  }}
                  options={employees}
                  placeholder="All employees"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">From</label>
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

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">To</label>
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
          </div>

          {/* Status chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const active = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setPage(1);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk action bar */}
        {isAdmin && selectedList.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">
              {selectedList.length} request{selectedList.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfirmAction({ ids: selectedList, action: "rejected" })
                }
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Reject Selected
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfirmAction({ ids: selectedList, action: "approved" })
                }
                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              >
                Approve Selected
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading && list.length === 0 ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📋
                </div>
                <p className="text-sm font-medium text-slate-700">No requests found</p>
                <p className="text-xs text-slate-500">
                  Try changing date range or filters
                </p>
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => setCreating(true)}
                    className="mt-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    + New Request
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    {isAdmin && (
                      <th className="w-10 px-5 py-3">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(e) => toggleAll(e.target.checked)}
                          disabled={pendingIds.length === 0}
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600 disabled:opacity-40"
                        />
                      </th>
                    )}
                    <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Date</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Requested</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Reason</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row, i) => {
                    const id = row.regularization_id || i;
                    const isPending = String(row.status || "").toLowerCase() === "pending";
                    const isSel = selectedIds.has(id);

                    return (
                      <tr
                        key={id}
                        className={`transition-colors ${
                          isSel ? "bg-red-50/40" : "hover:bg-slate-50"
                        }`}
                      >
                        {isAdmin && (
                          <td className="px-5 py-3.5">
                            <input
                              type="checkbox"
                              checked={isSel}
                              onChange={() => toggleSelect(id)}
                              disabled={!isPending}
                              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600 disabled:opacity-40"
                            />
                          </td>
                        )}
                        <td className="px-5 py-3.5 text-slate-700">
                          {getEmpName(row.employee_id)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                          {formatDate(row.attendance_date, tz)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-xs text-slate-600">
                            <div>
                              Status:{" "}
                              <span className="font-medium text-slate-800">
                                {statusLabel(row.requested_status)}
                              </span>
                            </div>
                            {(row.requested_punch_in || row.requested_punch_out) && (
                              <div className="mt-0.5 text-[11px] text-slate-500">
                                In: {formatTime(row.requested_punch_in, tz)} · Out:{" "}
                                {formatTime(row.requested_punch_out, tz)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="max-w-[220px] px-5 py-3.5 text-slate-600">
                          <span className="line-clamp-2" title={row.reason || ""}>
                            {row.reason || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(
                              row.status
                            )}`}
                          >
                            {statusLabel(row.status)}
                          </span>
                          {row.decision_reason && (
                            <div
                              className="mt-1 max-w-[200px] truncate text-[11px] text-slate-400"
                              title={row.decision_reason}
                            >
                              {row.decision_reason}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {isPending && isAdmin ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({ id, action: "rejected" })
                                }
                                disabled={actionId === id}
                                className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({ id, action: "approved" })
                                }
                                disabled={actionId === id}
                                className="rounded-md px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                              >
                                {actionId === id ? "..." : "Approve"}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              {isPending ? "Awaiting review" : "—"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && list.length > 0 && totalPages > 1 && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* Create modal */}
      <CreateModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={handleCreated}
        employees={employees}
        lockedEmployeeId={isAdmin ? "" : user?.employee_id}
      />

      {/* Confirm/reason modal */}
      <ReasonModal
        open={!!confirmAction}
        title={
          confirmAction?.action === "approved"
            ? confirmAction?.ids
              ? `Approve ${confirmAction.ids.length} request(s)?`
              : "Approve Request?"
            : confirmAction?.ids
            ? `Reject ${confirmAction.ids.length} request(s)?`
            : "Reject Request?"
        }
        confirmLabel={confirmAction?.action === "approved" ? "Approve" : "Reject"}
        danger={confirmAction?.action === "rejected"}
        requireReason={confirmAction?.action === "rejected"}
        loading={actionId === (confirmAction?.id || "bulk")}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}