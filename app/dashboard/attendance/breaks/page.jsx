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

// const toArray = (p) => {
//   if (!p) return [];
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p?.data)) return p.data;
//   if (Array.isArray(p?.breaks)) return p.breaks;
//   return [];
// };

// const formatDateTime = (d) => {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
//   } catch {
//     return String(d);
//   }
// };

// export default function AttendanceBreaksPage() {
//   const user = useAuthStore((state) => state.user);
//   const employeeId =
//     user?.employee_id ||
//     user?.employeeId ||
//     user?.emp_id ||
//     user?.employee?.employee_id ||
//     "";
//   const [breakType, setBreakType] = useState("lunch");
//   const [breakId, setBreakId] = useState("");
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [page, setPage] = useState(1);

//   const loadBreaks = async () => {
//     if (!employeeId) {
//       setError("Logged-in employee profile is not linked to an employee.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/get/breaks", {
//         params: { employee_id: employeeId, page, page_size: 10 },
//       });
//       setList(toArray(res?.data));
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startBreak = async () => {
//     if (!employeeId) {
//       return setError("Logged-in employee profile is not linked to an employee.");
//     }
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       const res = await api.post("/api/v1/break/start", {
//         employee_id: employeeId,
//         break_type: breakType || null,
//         remarks: null,
//       });
//       const id = res?.data?.break_id || res?.data?.data?.break_id;
//       if (id) setBreakId(id);
//       setSuccess("Break started");
//       await loadBreaks();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const endBreak = async () => {
//     if (!breakId) return setError("Start a break before ending it.");
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/break/end", { break_id: breakId });
//       setSuccess("Break ended");
//       setBreakId("");
//       await loadBreaks();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Breaks</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">Start / end break and view break logs</p>
//       </div>

//       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
//       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

//       <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="border-b border-[#e5e7eb] px-5 py-4">
//           <h2 className="text-sm font-semibold text-[#374151]">Actions</h2>
//         </div>
//         <div className="flex flex-wrap items-end gap-3 p-5">
//           <div>
//             <label className="mb-1 block text-sm font-medium text-[#374151]">Break type</label>
//             <select value={breakType} onChange={(e) => setBreakType(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
//               <option value="lunch">Lunch</option>
//               <option value="tea">Tea</option>
//               <option value="personal">Personal</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//           <button type="button" disabled={saving} onClick={startBreak} className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">Start Break</button>
//           <button type="button" disabled={saving || !breakId} onClick={endBreak} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">End Break</button>
//           <button type="button" onClick={loadBreaks} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">Load List</button>
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">No breaks found</div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Break ID</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Start</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">End</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Minutes</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((b, i) => (
//                   <tr key={b.break_id || i} className="hover:bg-[#fafafa]">
//                     <td className="px-5 py-3.5">{b.break_id || "—"}</td>
//                     <td className="px-5 py-3.5">{b.break_type || "—"}</td>
//                     <td className="px-5 py-3.5">{formatDateTime(b.break_start)}</td>
//                     <td className="px-5 py-3.5">{formatDateTime(b.break_end)}</td>
//                     <td className="px-5 py-3.5">{b.break_minutes ?? "—"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

/**
 * AttendanceBreaksPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ Auto-detect active break on page load
 *  ✓ Live timer (ticking every second while break running)
 *  ✓ Daily summary (total break, count, longest)
 *  ✓ Break type selection (lunch/tea/personal/other)
 *  ✓ Policy limit awareness
 *  ✓ Confirm end break
 *  ✓ Pagination for history
 *  ✓ Mobile responsive
 *  ✓ Ownership-enforced (own breaks only)
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
const AUTO_DISMISS_MS = 5000;
const TICK_MS = 1000;

const BREAK_TYPES = [
  { value: "lunch", label: "Lunch", icon: "🍽", tone: "amber" },
  { value: "tea", label: "Tea", icon: "☕", tone: "brown" },
  { value: "personal", label: "Personal", icon: "🚶", tone: "blue" },
  { value: "other", label: "Other", icon: "⏸", tone: "slate" },
];

const BREAK_TYPE_MAP = Object.fromEntries(
  BREAK_TYPES.map((t) => [t.value, t])
);

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

const safeDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
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

const formatDuration = (totalSeconds) => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};

const formatMinutes = (m) => {
  if (m == null) return "—";
  const n = Number(m);
  if (Number.isNaN(n) || n <= 0) return "0m";
  const h = Math.floor(n / 60);
  const mins = n % 60;
  if (h > 0) return `${h}h ${mins}m`;
  return `${mins}m`;
};

const extractList = (res) => {
  const data = res?.data ?? {};
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.breaks))
    return { items: data.breaks, total: Number(data.total) || data.breaks.length };
  if (Array.isArray(data.data))
    return { items: data.data, total: Number(data.total) || data.data.length };
  if (Array.isArray(data.items))
    return { items: data.items, total: Number(data.total) || data.items.length };
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
    <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <span className="whitespace-pre-line">{message}</span>
      <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function LiveTimer({ startedAt }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(t);
  }, []);

  const started = safeDate(startedAt);
  if (!started) return null;
  const elapsed = Math.max(0, Math.floor((now - started.getTime()) / 1000));

  return (
    <span className="font-mono tabular-nums text-amber-800">
      {formatDuration(elapsed)}
    </span>
  );
}

function SummaryCard({ label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-50 text-slate-700",
    amber: "bg-amber-50 text-amber-800",
    green: "bg-green-50 text-green-800",
    blue: "bg-blue-50 text-blue-800",
  };
  return (
    <div className={`rounded-xl px-3 py-2.5 ${tones[tone]}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
      <p className="text-xs text-slate-500">
        Page <span className="font-medium text-slate-700">{page}</span> of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Prev
        </button>
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
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function AttendanceBreaksPage() {
  const user = useAuthStore((s) => s.user);
  const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

  const employeeId = useMemo(
    () =>
      user?.employee_id ||
      user?.employeeId ||
      user?.emp_id ||
      user?.employee?.employee_id ||
      "",
    [user]
  );

  /* active break */
  const [activeBreak, setActiveBreak] = useState(null);

  /* today's summary */
  const [todaySummary, setTodaySummary] = useState({
    total_minutes: 0,
    count: 0,
    longest_minutes: 0,
    policy_limit: null,
  });

  /* list */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  /* ui */
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* form */
  const [breakType, setBreakType] = useState("lunch");
  const [remarks, setRemarks] = useState("");

  /* confirm end */
  const [confirmEnd, setConfirmEnd] = useState(false);

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ FETCH ALL ══════════════ */
  const fetchAll = useCallback(async () => {
    if (!employeeId) return;
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/api/v1/get/breaks", {
        params: { employee_id: employeeId, page, page_size: PAGE_SIZE },
      });
      if (myReqId !== reqIdRef.current) return;

      const { items, total: t } = extractList(res);
      setList(items);
      setTotal(t);

      // Find active break (break_end is null)
      const active = items.find((b) => !b.break_end);
      if (active) {
        setActiveBreak(active);
        setBreakType(active.break_type || "lunch");
      } else {
        setActiveBreak(null);
      }

      // Compute today summary from items (client-side)
      const today = new Date().toISOString().slice(0, 10);
      const todayItems = items.filter(
        (b) =>
          b.break_start &&
          String(b.break_start).slice(0, 10) === today &&
          b.break_minutes != null
      );
      const totalMin = todayItems.reduce(
        (sum, b) => sum + (Number(b.break_minutes) || 0),
        0
      );
      const longest = todayItems.reduce(
        (max, b) => Math.max(max, Number(b.break_minutes) || 0),
        0
      );
      setTodaySummary({
        total_minutes: totalMin,
        count: todayItems.length,
        longest_minutes: longest,
        policy_limit: res?.data?.policy_limit_minutes ?? null,
      });
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [employeeId, page]);

  useEffect(() => {
    if (!employeeId) {
      setError("Your employee profile is not linked. Please contact HR.");
      setLoading(false);
      return;
    }
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchAll();
      return;
    }
    const t = setTimeout(fetchAll, 300);
    return () => clearTimeout(t);
  }, [employeeId, fetchAll]);

  /* ══════════════ START BREAK ══════════════ */
  const startBreak = async () => {
    if (activeBreak) {
      setError("A break is already running. End it first.");
      return;
    }
    setStarting(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/api/v1/break/start", {
        employee_id: employeeId,
        break_type: breakType || null,
        remarks: remarks || null,
      });

      const newBreak =
        res?.data?.break ||
        res?.data?.data ||
        res?.data;

      if (newBreak?.break_id) {
        setActiveBreak(newBreak);
      } else {
        // Fallback: reload
        await fetchAll();
      }

      setRemarks("");
      setSuccess("Break started");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setStarting(false);
    }
  };

  /* ══════════════ END BREAK ══════════════ */
  const endBreak = async () => {
    if (!activeBreak?.break_id) return;
    setEnding(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/v1/break/end", {
        break_id: activeBreak.break_id,
      });
      setActiveBreak(null);
      setConfirmEnd(false);
      setSuccess("Break ended");
      fetchAll();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setEnding(false);
    }
  };

  /* ══════════════ DERIVED ══════════════ */
  const isOverLimit =
    todaySummary.policy_limit != null &&
    todaySummary.total_minutes > todaySummary.policy_limit;

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Breaks</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track lunch, tea and personal breaks
              {todaySummary.policy_limit != null && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Limit: {todaySummary.policy_limit} min/day
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchAll}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {/* Toast */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Live active break banner */}
        {activeBreak && (
          <div className="mb-5 overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
                  {BREAK_TYPE_MAP[activeBreak.break_type]?.icon || "⏸"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-amber-900">
                      Break running
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-amber-700">
                    <span className="font-medium capitalize">
                      {BREAK_TYPE_MAP[activeBreak.break_type]?.label || "Break"}
                    </span>
                    <span>·</span>
                    <span>Started at {formatTime(activeBreak.break_start, tz)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
                    Elapsed
                  </p>
                  <p className="text-xl font-bold">
                    <LiveTimer startedAt={activeBreak.break_start} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmEnd(true)}
                  disabled={ending}
                  className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
                >
                  End Break
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Start break card (only if no active break) */}
        {!activeBreak && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Start a Break</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Pick a type and tap Start — timer runs automatically
              </p>
            </div>

            <div className="p-5">
              {/* Break type chips */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Break Type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {BREAK_TYPES.map((t) => {
                    const active = breakType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setBreakType(t.value)}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition ${
                          active
                            ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Remarks (optional)
                </label>
                <input
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  maxLength={200}
                  placeholder="e.g. Going for lunch with team"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Start button */}
              <button
                type="button"
                onClick={startBreak}
                disabled={starting}
                className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
              >
                {starting ? "Starting..." : "▶ Start Break"}
              </button>

              {/* Warn if over limit */}
              {isOverLimit && (
                <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  ⚠️ You&apos;ve already used {formatMinutes(todaySummary.total_minutes)}{" "}
                  of {todaySummary.policy_limit} min daily limit.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Today's summary */}
        {todaySummary.count > 0 && (
          <div className="mb-5 grid grid-cols-3 gap-3">
            <SummaryCard
              label="Total Today"
              value={formatMinutes(todaySummary.total_minutes)}
              tone="amber"
            />
            <SummaryCard
              label="Breaks Taken"
              value={todaySummary.count}
              tone="blue"
            />
            <SummaryCard
              label="Longest Break"
              value={formatMinutes(todaySummary.longest_minutes)}
              tone="slate"
            />
          </div>
        )}

        {/* History */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Break History</h2>
              {total > 0 && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {total} record{total !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading && list.length === 0 ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  ☕
                </div>
                <p className="text-sm font-medium text-slate-700">No breaks yet</p>
                <p className="text-xs text-slate-500">
                  Start a break when you need one
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">Date</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Type</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Start</th>
                    <th className="px-5 py-3 font-medium text-slate-500">End</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Duration</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((b, i) => {
                    const isActive = !b.break_end;
                    const typeInfo = BREAK_TYPE_MAP[b.break_type];

                    return (
                      <tr
                        key={b.break_id || i}
                        className={`transition-colors ${
                          isActive ? "bg-amber-50/40" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
                          {formatDate(b.break_start, tz)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-slate-700">
                            <span>{typeInfo?.icon || "⏸"}</span>
                            <span className="text-xs font-medium capitalize">
                              {typeInfo?.label || b.break_type || "Break"}
                            </span>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                          {formatTime(b.break_start, tz)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                          {isActive ? (
                            <span className="text-amber-700">—</span>
                          ) : (
                            formatTime(b.break_end, tz)
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isActive ? (
                            <LiveTimer startedAt={b.break_start} />
                          ) : (
                            <span className="font-medium text-slate-700">
                              {formatMinutes(b.break_minutes)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                              </span>
                              Running
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
                              Done
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

          {!loading && list.length > 0 && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* Confirm end modal */}
      {confirmEnd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !ending && setConfirmEnd(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-800">End Break?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Your break will be recorded. You can&apos;t undo this.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmEnd(false)}
                disabled={ending}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={endBreak}
                disabled={ending}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
              >
                {ending ? "Ending..." : "End Break"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}