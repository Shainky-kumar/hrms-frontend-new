// // // "use client";

// // // import { useState } from "react";
// // // import { api } from "@/app/lib/api";
// // // import { useAuthStore } from "@/app/store/authStore";

// // // const formatApiError = (err) => {
// // //   const detail = err?.response?.data?.detail;
// // //   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
// // //   if (typeof detail === "string") return detail;
// // //   return err?.message || "Something went wrong";
// // // };

// // // const toArray = (p) => {
// // //   if (!p) return [];
// // //   if (Array.isArray(p)) return p;
// // //   if (Array.isArray(p?.data)) return p.data;
// // //   if (Array.isArray(p?.breaks)) return p.breaks;
// // //   return [];
// // // };

// // // const formatDateTime = (d) => {
// // //   if (!d) return "—";
// // //   try {
// // //     return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
// // //   } catch {
// // //     return String(d);
// // //   }
// // // };

// // // export default function AttendanceBreaksPage() {
// // //   const user = useAuthStore((state) => state.user);
// // //   const employeeId =
// // //     user?.employee_id ||
// // //     user?.employeeId ||
// // //     user?.emp_id ||
// // //     user?.employee?.employee_id ||
// // //     "";
// // //   const [breakType, setBreakType] = useState("lunch");
// // //   const [breakId, setBreakId] = useState("");
// // //   const [list, setList] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");
// // //   const [page, setPage] = useState(1);

// // //   const loadBreaks = async () => {
// // //     if (!employeeId) {
// // //       setError("Logged-in employee profile is not linked to an employee.");
// // //       return;
// // //     }
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api.get("/api/v1/get/breaks", {
// // //         params: { employee_id: employeeId, page, page_size: 10 },
// // //       });
// // //       setList(toArray(res?.data));
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //       setList([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const startBreak = async () => {
// // //     if (!employeeId) {
// // //       return setError("Logged-in employee profile is not linked to an employee.");
// // //     }
// // //     setSaving(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       const res = await api.post("/api/v1/break/start", {
// // //         employee_id: employeeId,
// // //         break_type: breakType || null,
// // //         remarks: null,
// // //       });
// // //       const id = res?.data?.break_id || res?.data?.data?.break_id;
// // //       if (id) setBreakId(id);
// // //       setSuccess("Break started");
// // //       await loadBreaks();
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const endBreak = async () => {
// // //     if (!breakId) return setError("Start a break before ending it.");
// // //     setSaving(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       await api.post("/api/v1/break/end", { break_id: breakId });
// // //       setSuccess("Break ended");
// // //       setBreakId("");
// // //       await loadBreaks();
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// // //       <div className="mb-6">
// // //         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Breaks</h1>
// // //         <p className="mt-1 text-sm text-[#6b7280]">Start / end break and view break logs</p>
// // //       </div>

// // //       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
// // //       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

// // //       <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// // //         <div className="border-b border-[#e5e7eb] px-5 py-4">
// // //           <h2 className="text-sm font-semibold text-[#374151]">Actions</h2>
// // //         </div>
// // //         <div className="flex flex-wrap items-end gap-3 p-5">
// // //           <div>
// // //             <label className="mb-1 block text-sm font-medium text-[#374151]">Break type</label>
// // //             <select value={breakType} onChange={(e) => setBreakType(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
// // //               <option value="lunch">Lunch</option>
// // //               <option value="tea">Tea</option>
// // //               <option value="personal">Personal</option>
// // //               <option value="other">Other</option>
// // //             </select>
// // //           </div>
// // //           <button type="button" disabled={saving} onClick={startBreak} className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">Start Break</button>
// // //           <button type="button" disabled={saving || !breakId} onClick={endBreak} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">End Break</button>
// // //           <button type="button" onClick={loadBreaks} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">Load List</button>
// // //         </div>
// // //       </div>

// // //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// // //         <div className="overflow-x-auto">
// // //           {loading ? (
// // //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// // //           ) : list.length === 0 ? (
// // //             <div className="py-16 text-center text-sm text-[#6b7280]">No breaks found</div>
// // //           ) : (
// // //             <table className="w-full text-left text-sm">
// // //               <thead>
// // //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Break ID</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Start</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">End</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Minutes</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-[#f3f4f6]">
// // //                 {list.map((b, i) => (
// // //                   <tr key={b.break_id || i} className="hover:bg-[#fafafa]">
// // //                     <td className="px-5 py-3.5">{b.break_id || "—"}</td>
// // //                     <td className="px-5 py-3.5">{b.break_type || "—"}</td>
// // //                     <td className="px-5 py-3.5">{formatDateTime(b.break_start)}</td>
// // //                     <td className="px-5 py-3.5">{formatDateTime(b.break_end)}</td>
// // //                     <td className="px-5 py-3.5">{b.break_minutes ?? "—"}</td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // /**
// //  * AttendanceBreaksPage — Production Ready
// //  * ------------------------------------------------------------------
// //  *  ✓ Auto-detect active break on page load
// //  *  ✓ Live timer (ticking every second while break running)
// //  *  ✓ Daily summary (total break, count, longest)
// //  *  ✓ Break type selection (lunch/tea/personal/other)
// //  *  ✓ Policy limit awareness
// //  *  ✓ Confirm end break
// //  *  ✓ Pagination for history
// //  *  ✓ Mobile responsive
// //  *  ✓ Ownership-enforced (own breaks only)
// //  */

// // import {
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// // } from "react";
// // import { api } from "@/app/lib/api";
// // import { useAuthStore } from "@/app/store/authStore";

// // /* ══════════════════════════════════════════════════════════
// //    CONSTANTS
// //    ══════════════════════════════════════════════════════════ */

// // const PAGE_SIZE = 10;
// // const AUTO_DISMISS_MS = 5000;
// // const TICK_MS = 1000;

// // const BREAK_TYPES = [
// //   { value: "lunch", label: "Lunch", icon: "🍽", tone: "amber" },
// //   { value: "tea", label: "Tea", icon: "☕", tone: "brown" },
// //   { value: "personal", label: "Personal", icon: "🚶", tone: "blue" },
// //   { value: "other", label: "Other", icon: "⏸", tone: "slate" },
// // ];

// // const BREAK_TYPE_MAP = Object.fromEntries(
// //   BREAK_TYPES.map((t) => [t.value, t])
// // );

// // /* ══════════════════════════════════════════════════════════
// //    HELPERS
// //    ══════════════════════════════════════════════════════════ */

// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) {
// //     return detail
// //       .map((e) => {
// //         const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
// //         return field ? `${field}: ${e.msg}` : e.msg || "Error";
// //       })
// //       .join(" • ");
// //   }
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // };

// // const safeDate = (v) => {
// //   if (!v) return null;
// //   const d = new Date(v);
// //   return Number.isNaN(d.getTime()) ? null : d;
// // };

// // const formatTime = (v, tz) => {
// //   const d = safeDate(v);
// //   if (!d) return "—";
// //   try {
// //     return d.toLocaleTimeString("en-IN", {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //       hour12: true,
// //       timeZone: tz,
// //     });
// //   } catch {
// //     return "—";
// //   }
// // };

// // const formatDate = (v, tz) => {
// //   const d = safeDate(v);
// //   if (!d) return "—";
// //   try {
// //     return d.toLocaleDateString("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //       timeZone: tz,
// //     });
// //   } catch {
// //     return "—";
// //   }
// // };

// // const formatDuration = (totalSeconds) => {
// //   const s = Math.max(0, Math.floor(totalSeconds));
// //   const h = Math.floor(s / 3600);
// //   const m = Math.floor((s % 3600) / 60);
// //   const sec = s % 60;
// //   if (h > 0) return `${h}h ${m}m ${sec}s`;
// //   if (m > 0) return `${m}m ${sec}s`;
// //   return `${sec}s`;
// // };

// // const formatMinutes = (m) => {
// //   if (m == null) return "—";
// //   const n = Number(m);
// //   if (Number.isNaN(n) || n <= 0) return "0m";
// //   const h = Math.floor(n / 60);
// //   const mins = n % 60;
// //   if (h > 0) return `${h}h ${mins}m`;
// //   return `${mins}m`;
// // };

// // const extractList = (res) => {
// //   const data = res?.data ?? {};
// //   if (Array.isArray(data)) return { items: data, total: data.length };
// //   if (Array.isArray(data.breaks))
// //     return { items: data.breaks, total: Number(data.total) || data.breaks.length };
// //   if (Array.isArray(data.data))
// //     return { items: data.data, total: Number(data.total) || data.data.length };
// //   if (Array.isArray(data.items))
// //     return { items: data.items, total: Number(data.total) || data.items.length };
// //   return { items: [], total: 0 };
// // };

// // /* ══════════════════════════════════════════════════════════
// //    SUBCOMPONENTS
// //    ══════════════════════════════════════════════════════════ */

// // function Toast({ type, message, onDismiss }) {
// //   useEffect(() => {
// //     if (!message) return;
// //     const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
// //     return () => clearTimeout(t);
// //   }, [message, onDismiss]);

// //   if (!message) return null;
// //   const styles =
// //     type === "error"
// //       ? "border-red-200 bg-red-50 text-red-700"
// //       : "border-green-200 bg-green-50 text-green-700";

// //   return (
// //     <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
// //       <span className="whitespace-pre-line">{message}</span>
// //       <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
// //     </div>
// //   );
// // }

// // function LiveTimer({ startedAt }) {
// //   const [now, setNow] = useState(Date.now());

// //   useEffect(() => {
// //     const t = setInterval(() => setNow(Date.now()), TICK_MS);
// //     return () => clearInterval(t);
// //   }, []);

// //   const started = safeDate(startedAt);
// //   if (!started) return null;
// //   const elapsed = Math.max(0, Math.floor((now - started.getTime()) / 1000));

// //   return (
// //     <span className="font-mono tabular-nums text-amber-800">
// //       {formatDuration(elapsed)}
// //     </span>
// //   );
// // }

// // function SummaryCard({ label, value, tone = "slate" }) {
// //   const tones = {
// //     slate: "bg-slate-50 text-slate-700",
// //     amber: "bg-amber-50 text-amber-800",
// //     green: "bg-green-50 text-green-800",
// //     blue: "bg-blue-50 text-blue-800",
// //   };
// //   return (
// //     <div className={`rounded-xl px-3 py-2.5 ${tones[tone]}`}>
// //       <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
// //         {label}
// //       </p>
// //       <p className="mt-0.5 text-lg font-semibold">{value}</p>
// //     </div>
// //   );
// // }

// // function Pagination({ page, pageSize, total, onPageChange }) {
// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));
// //   if (total <= pageSize) return null;

// //   return (
// //     <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
// //       <p className="text-xs text-slate-500">
// //         Page <span className="font-medium text-slate-700">{page}</span> of {totalPages}
// //       </p>
// //       <div className="flex gap-2">
// //         <button
// //           type="button"
// //           disabled={page <= 1}
// //           onClick={() => onPageChange(page - 1)}
// //           className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
// //         >
// //           Prev
// //         </button>
// //         <button
// //           type="button"
// //           disabled={page >= totalPages}
// //           onClick={() => onPageChange(page + 1)}
// //           className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ══════════════════════════════════════════════════════════
// //    MAIN PAGE
// //    ══════════════════════════════════════════════════════════ */

// // export default function AttendanceBreaksPage() {
// //   const user = useAuthStore((s) => s.user);
// //   const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

// //   const employeeId = useMemo(
// //     () =>
// //       user?.employee_id ||
// //       user?.employeeId ||
// //       user?.emp_id ||
// //       user?.employee?.employee_id ||
// //       "",
// //     [user]
// //   );

// //   /* active break */
// //   const [activeBreak, setActiveBreak] = useState(null);

// //   /* today's summary */
// //   const [todaySummary, setTodaySummary] = useState({
// //     total_minutes: 0,
// //     count: 0,
// //     longest_minutes: 0,
// //     policy_limit: null,
// //   });

// //   /* list */
// //   const [list, setList] = useState([]);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(1);

// //   /* ui */
// //   const [loading, setLoading] = useState(false);
// //   const [starting, setStarting] = useState(false);
// //   const [ending, setEnding] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   /* form */
// //   const [breakType, setBreakType] = useState("lunch");
// //   const [remarks, setRemarks] = useState("");

// //   /* confirm end */
// //   const [confirmEnd, setConfirmEnd] = useState(false);

// //   const reqIdRef = useRef(0);
// //   const didInitRef = useRef(false);

// //   /* ══════════════ FETCH ALL ══════════════ */
// //   const fetchAll = useCallback(async () => {
// //     if (!employeeId) return;
// //     const myReqId = ++reqIdRef.current;
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const res = await api.get("/api/v1/get/breaks", {
// //         params: { employee_id: employeeId, page, page_size: PAGE_SIZE },
// //       });
// //       if (myReqId !== reqIdRef.current) return;

// //       const { items, total: t } = extractList(res);
// //       setList(items);
// //       setTotal(t);

// //       // Find active break (break_end is null)
// //       const active = items.find((b) => !b.break_end);
// //       if (active) {
// //         setActiveBreak(active);
// //         setBreakType(active.break_type || "lunch");
// //       } else {
// //         setActiveBreak(null);
// //       }

// //       // Compute today summary from items (client-side)
// //       const today = new Date().toISOString().slice(0, 10);
// //       const todayItems = items.filter(
// //         (b) =>
// //           b.break_start &&
// //           String(b.break_start).slice(0, 10) === today &&
// //           b.break_minutes != null
// //       );
// //       const totalMin = todayItems.reduce(
// //         (sum, b) => sum + (Number(b.break_minutes) || 0),
// //         0
// //       );
// //       const longest = todayItems.reduce(
// //         (max, b) => Math.max(max, Number(b.break_minutes) || 0),
// //         0
// //       );
// //       setTodaySummary({
// //         total_minutes: totalMin,
// //         count: todayItems.length,
// //         longest_minutes: longest,
// //         policy_limit: res?.data?.policy_limit_minutes ?? null,
// //       });
// //     } catch (err) {
// //       if (myReqId !== reqIdRef.current) return;
// //       setError(formatApiError(err));
// //       setList([]);
// //       setTotal(0);
// //     } finally {
// //       if (myReqId === reqIdRef.current) setLoading(false);
// //     }
// //   }, [employeeId, page]);

// //   useEffect(() => {
// //     if (!employeeId) {
// //       setError("Your employee profile is not linked. Please contact HR.");
// //       setLoading(false);
// //       return;
// //     }
// //     if (!didInitRef.current) {
// //       didInitRef.current = true;
// //       fetchAll();
// //       return;
// //     }
// //     const t = setTimeout(fetchAll, 300);
// //     return () => clearTimeout(t);
// //   }, [employeeId, fetchAll]);

// //   /* ══════════════ START BREAK ══════════════ */
// //   const startBreak = async () => {
// //     if (activeBreak) {
// //       setError("A break is already running. End it first.");
// //       return;
// //     }
// //     setStarting(true);
// //     setError("");
// //     setSuccess("");

// //     try {
// //       const res = await api.post("/api/v1/break/start", {
// //         employee_id: employeeId,
// //         break_type: breakType || null,
// //         remarks: remarks || null,
// //       });

// //       const newBreak =
// //         res?.data?.break ||
// //         res?.data?.data ||
// //         res?.data;

// //       if (newBreak?.break_id) {
// //         setActiveBreak(newBreak);
// //       } else {
// //         // Fallback: reload
// //         await fetchAll();
// //       }

// //       setRemarks("");
// //       setSuccess("Break started");
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setStarting(false);
// //     }
// //   };

// //   /* ══════════════ END BREAK ══════════════ */
// //   const endBreak = async () => {
// //     if (!activeBreak?.break_id) return;
// //     setEnding(true);
// //     setError("");
// //     setSuccess("");

// //     try {
// //       await api.post("/api/v1/break/end", {
// //         break_id: activeBreak.break_id,
// //       });
// //       setActiveBreak(null);
// //       setConfirmEnd(false);
// //       setSuccess("Break ended");
// //       fetchAll();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setEnding(false);
// //     }
// //   };

// //   /* ══════════════ DERIVED ══════════════ */
// //   const isOverLimit =
// //     todaySummary.policy_limit != null &&
// //     todaySummary.total_minutes > todaySummary.policy_limit;

// //   /* ══════════════ RENDER ══════════════ */
// //   return (
// //     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
// //       <div className="mx-auto max-w-4xl">
// //         {/* Header */}
// //         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold text-slate-800">Breaks</h1>
// //             <p className="mt-1 text-sm text-slate-500">
// //               Track lunch, tea and personal breaks
// //               {todaySummary.policy_limit != null && (
// //                 <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
// //                   Limit: {todaySummary.policy_limit} min/day
// //                 </span>
// //               )}
// //             </p>
// //           </div>
// //           <button
// //             type="button"
// //             onClick={fetchAll}
// //             disabled={loading}
// //             className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
// //           >
// //             {loading ? "Refreshing..." : "↻ Refresh"}
// //           </button>
// //         </div>

// //         {/* Toast */}
// //         <Toast type="error" message={error} onDismiss={() => setError("")} />
// //         <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

// //         {/* Live active break banner */}
// //         {activeBreak && (
// //           <div className="mb-5 overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
// //             <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
// //               <div className="flex items-center gap-3">
// //                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
// //                   {BREAK_TYPE_MAP[activeBreak.break_type]?.icon || "⏸"}
// //                 </div>
// //                 <div>
// //                   <div className="flex items-center gap-2">
// //                     <span className="text-sm font-semibold text-amber-900">
// //                       Break running
// //                     </span>
// //                     <span className="relative flex h-2 w-2">
// //                       <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
// //                       <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
// //                     </span>
// //                   </div>
// //                   <div className="mt-0.5 flex items-center gap-2 text-xs text-amber-700">
// //                     <span className="font-medium capitalize">
// //                       {BREAK_TYPE_MAP[activeBreak.break_type]?.label || "Break"}
// //                     </span>
// //                     <span>·</span>
// //                     <span>Started at {formatTime(activeBreak.break_start, tz)}</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="flex items-center gap-4">
// //                 <div className="text-right">
// //                   <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
// //                     Elapsed
// //                   </p>
// //                   <p className="text-xl font-bold">
// //                     <LiveTimer startedAt={activeBreak.break_start} />
// //                   </p>
// //                 </div>
// //                 <button
// //                   type="button"
// //                   onClick={() => setConfirmEnd(true)}
// //                   disabled={ending}
// //                   className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
// //                 >
// //                   End Break
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Start break card (only if no active break) */}
// //         {!activeBreak && (
// //           <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //             <div className="border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-sm font-semibold text-slate-800">Start a Break</h2>
// //               <p className="mt-0.5 text-xs text-slate-500">
// //                 Pick a type and tap Start — timer runs automatically
// //               </p>
// //             </div>

// //             <div className="p-5">
// //               {/* Break type chips */}
// //               <div className="mb-4">
// //                 <label className="mb-2 block text-xs font-medium text-slate-600">
// //                   Break Type
// //                 </label>
// //                 <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
// //                   {BREAK_TYPES.map((t) => {
// //                     const active = breakType === t.value;
// //                     return (
// //                       <button
// //                         key={t.value}
// //                         type="button"
// //                         onClick={() => setBreakType(t.value)}
// //                         className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition ${
// //                           active
// //                             ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
// //                             : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
// //                         }`}
// //                       >
// //                         <span className="text-lg">{t.icon}</span>
// //                         <span>{t.label}</span>
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //               </div>

// //               {/* Remarks */}
// //               <div className="mb-4">
// //                 <label className="mb-1 block text-xs font-medium text-slate-600">
// //                   Remarks (optional)
// //                 </label>
// //                 <input
// //                   value={remarks}
// //                   onChange={(e) => setRemarks(e.target.value)}
// //                   maxLength={200}
// //                   placeholder="e.g. Going for lunch with team"
// //                   className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
// //                 />
// //               </div>

// //               {/* Start button */}
// //               <button
// //                 type="button"
// //                 onClick={startBreak}
// //                 disabled={starting}
// //                 className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
// //               >
// //                 {starting ? "Starting..." : "▶ Start Break"}
// //               </button>

// //               {/* Warn if over limit */}
// //               {isOverLimit && (
// //                 <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
// //                   ⚠️ You&apos;ve already used {formatMinutes(todaySummary.total_minutes)}{" "}
// //                   of {todaySummary.policy_limit} min daily limit.
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* Today's summary */}
// //         {todaySummary.count > 0 && (
// //           <div className="mb-5 grid grid-cols-3 gap-3">
// //             <SummaryCard
// //               label="Total Today"
// //               value={formatMinutes(todaySummary.total_minutes)}
// //               tone="amber"
// //             />
// //             <SummaryCard
// //               label="Breaks Taken"
// //               value={todaySummary.count}
// //               tone="blue"
// //             />
// //             <SummaryCard
// //               label="Longest Break"
// //               value={formatMinutes(todaySummary.longest_minutes)}
// //               tone="slate"
// //             />
// //           </div>
// //         )}

// //         {/* History */}
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //             <div>
// //               <h2 className="text-sm font-semibold text-slate-800">Break History</h2>
// //               {total > 0 && (
// //                 <p className="mt-0.5 text-xs text-slate-400">
// //                   {total} record{total !== 1 ? "s" : ""}
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           <div className="overflow-x-auto">
// //             {loading && list.length === 0 ? (
// //               <div className="space-y-2 p-5">
// //                 {Array.from({ length: 4 }).map((_, i) => (
// //                   <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
// //                 ))}
// //               </div>
// //             ) : list.length === 0 ? (
// //               <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
// //                 <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
// //                   ☕
// //                 </div>
// //                 <p className="text-sm font-medium text-slate-700">No breaks yet</p>
// //                 <p className="text-xs text-slate-500">
// //                   Start a break when you need one
// //                 </p>
// //               </div>
// //             ) : (
// //               <table className="w-full min-w-[600px] text-left text-sm">
// //                 <thead>
// //                   <tr className="border-b bg-slate-50">
// //                     <th className="px-5 py-3 font-medium text-slate-500">Date</th>
// //                     <th className="px-5 py-3 font-medium text-slate-500">Type</th>
// //                     <th className="px-5 py-3 font-medium text-slate-500">Start</th>
// //                     <th className="px-5 py-3 font-medium text-slate-500">End</th>
// //                     <th className="px-5 py-3 font-medium text-slate-500">Duration</th>
// //                     <th className="px-5 py-3 font-medium text-slate-500">Status</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-slate-100">
// //                   {list.map((b, i) => {
// //                     const isActive = !b.break_end;
// //                     const typeInfo = BREAK_TYPE_MAP[b.break_type];

// //                     return (
// //                       <tr
// //                         key={b.break_id || i}
// //                         className={`transition-colors ${
// //                           isActive ? "bg-amber-50/40" : "hover:bg-slate-50"
// //                         }`}
// //                       >
// //                         <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
// //                           {formatDate(b.break_start, tz)}
// //                         </td>
// //                         <td className="px-5 py-3.5">
// //                           <span className="inline-flex items-center gap-1.5 text-slate-700">
// //                             <span>{typeInfo?.icon || "⏸"}</span>
// //                             <span className="text-xs font-medium capitalize">
// //                               {typeInfo?.label || b.break_type || "Break"}
// //                             </span>
// //                           </span>
// //                         </td>
// //                         <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
// //                           {formatTime(b.break_start, tz)}
// //                         </td>
// //                         <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
// //                           {isActive ? (
// //                             <span className="text-amber-700">—</span>
// //                           ) : (
// //                             formatTime(b.break_end, tz)
// //                           )}
// //                         </td>
// //                         <td className="px-5 py-3.5">
// //                           {isActive ? (
// //                             <LiveTimer startedAt={b.break_start} />
// //                           ) : (
// //                             <span className="font-medium text-slate-700">
// //                               {formatMinutes(b.break_minutes)}
// //                             </span>
// //                           )}
// //                         </td>
// //                         <td className="px-5 py-3.5">
// //                           {isActive ? (
// //                             <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
// //                               <span className="relative flex h-1.5 w-1.5">
// //                                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
// //                                 <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
// //                               </span>
// //                               Running
// //                             </span>
// //                           ) : (
// //                             <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
// //                               Done
// //                             </span>
// //                           )}
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             )}
// //           </div>

// //           {!loading && list.length > 0 && (
// //             <Pagination
// //               page={page}
// //               pageSize={PAGE_SIZE}
// //               total={total}
// //               onPageChange={setPage}
// //             />
// //           )}
// //         </div>
// //       </div>

// //       {/* Confirm end modal */}
// //       {confirmEnd && (
// //         <div
// //           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
// //           onClick={() => !ending && setConfirmEnd(false)}
// //         >
// //           <div
// //             className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <h3 className="text-base font-semibold text-slate-800">End Break?</h3>
// //             <p className="mt-2 text-sm text-slate-500">
// //               Your break will be recorded. You can&apos;t undo this.
// //             </p>
// //             <div className="mt-5 flex justify-end gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setConfirmEnd(false)}
// //                 disabled={ending}
// //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={endBreak}
// //                 disabled={ending}
// //                 className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
// //               >
// //                 {ending ? "Ending..." : "End Break"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// /**
//  * AttendanceBreaksPage — Professional UI (Full Width)
//  */

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";
// import {
//   Coffee,
//   Play,
//   Square,
//   Clock,
//   CalendarDays,
//   TrendingUp,
//   AlertTriangle,
//   CheckCircle2,
//   Loader2,
//   X,
//   RefreshCw,
//   Timer,
//   CircleDot,
// } from "lucide-react";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const PAGE_SIZE = 10;
// const AUTO_DISMISS_MS = 5000;
// const TICK_MS = 1000;

// const BREAK_TYPES = [
//   { value: "lunch", label: "Lunch Break", icon: "🍽️", color: "amber" },
//   { value: "tea", label: "Tea Break", icon: "☕", color: "orange" },
//   { value: "personal", label: "Personal", icon: "🚶", color: "blue" },
//   { value: "other", label: "Other", icon: "⏸️", color: "slate" },
// ];

// const BREAK_TYPE_MAP = Object.fromEntries(BREAK_TYPES.map((t) => [t.value, t]));

// /* ══════════════════════════════════════════════════════════
//    HELPERS
//    ══════════════════════════════════════════════════════════ */

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) => {
//         const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
//         return field ? `${field}: ${e.msg}` : e.msg || "Error";
//       })
//       .join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// const safeDate = (v) => {
//   if (!v) return null;
//   const d = new Date(v);
//   return Number.isNaN(d.getTime()) ? null : d;
// };

// const formatTime = (v, tz) => {
//   const d = safeDate(v);
//   if (!d) return "—";
//   try {
//     return d.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//       timeZone: tz,
//     });
//   } catch {
//     return "—";
//   }
// };

// const formatDate = (v, tz) => {
//   const d = safeDate(v);
//   if (!d) return "—";
//   try {
//     return d.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       timeZone: tz,
//     });
//   } catch {
//     return "—";
//   }
// };

// const formatDuration = (totalSeconds) => {
//   const s = Math.max(0, Math.floor(totalSeconds));
//   const h = Math.floor(s / 3600);
//   const m = Math.floor((s % 3600) / 60);
//   const sec = s % 60;
//   if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
//   if (m > 0) return `${m}m ${String(sec).padStart(2, "0")}s`;
//   return `${sec}s`;
// };

// const formatMinutes = (m) => {
//   if (m == null) return "—";
//   const n = Number(m);
//   if (Number.isNaN(n) || n <= 0) return "0m";
//   const h = Math.floor(n / 60);
//   const mins = n % 60;
//   if (h > 0) return `${h}h ${mins}m`;
//   return `${mins}m`;
// };

// const extractList = (res) => {
//   const data = res?.data ?? {};
//   if (Array.isArray(data)) return { items: data, total: data.length };
//   if (Array.isArray(data.breaks))
//     return { items: data.breaks, total: Number(data.total) || data.breaks.length };
//   if (Array.isArray(data.data))
//     return { items: data.data, total: Number(data.total) || data.data.length };
//   if (Array.isArray(data.items))
//     return { items: data.items, total: Number(data.total) || data.items.length };
//   return { items: [], total: 0 };
// };

// /* ══════════════════════════════════════════════════════════
//    TOAST
//    ══════════════════════════════════════════════════════════ */

// function Toast({ type, message, onDismiss }) {
//   useEffect(() => {
//     if (!message) return;
//     const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [message, onDismiss]);

//   if (!message) return null;

//   const isError = type === "error";
//   const styles = isError
//     ? "border-red-200 bg-red-50 text-red-700"
//     : "border-emerald-200 bg-emerald-50 text-emerald-700";

//   return (
//     <div
//       role="alert"
//       className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles}`}
//     >
//       <div className="flex items-start gap-2">
//         {isError ? (
//           <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
//         ) : (
//           <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
//         )}
//         <span className="whitespace-pre-line font-medium">{message}</span>
//       </div>
//       <button
//         onClick={onDismiss}
//         className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
//         aria-label="Dismiss"
//       >
//         <X className="h-4 w-4" />
//       </button>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    LIVE TIMER
//    ══════════════════════════════════════════════════════════ */

// function LiveTimer({ startedAt, className = "" }) {
//   const [now, setNow] = useState(Date.now());

//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), TICK_MS);
//     return () => clearInterval(t);
//   }, []);

//   const started = safeDate(startedAt);
//   if (!started) return <span className={className}>—</span>;
//   const elapsed = Math.max(0, Math.floor((now - started.getTime()) / 1000));

//   return (
//     <span className={`font-mono tabular-nums ${className}`}>
//       {formatDuration(elapsed)}
//     </span>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    STAT CARD
//    ══════════════════════════════════════════════════════════ */

// function StatCard({ icon: Icon, label, value, tone = "slate", hint }) {
//   const tones = {
//     amber: {
//       bg: "from-amber-50 to-white",
//       border: "border-amber-100",
//       icon: "bg-amber-100 text-amber-700",
//       label: "text-amber-700",
//     },
//     blue: {
//       bg: "from-blue-50 to-white",
//       border: "border-blue-100",
//       icon: "bg-blue-100 text-blue-700",
//       label: "text-blue-700",
//     },
//     emerald: {
//       bg: "from-emerald-50 to-white",
//       border: "border-emerald-100",
//       icon: "bg-emerald-100 text-emerald-700",
//       label: "text-emerald-700",
//     },
//     slate: {
//       bg: "from-slate-50 to-white",
//       border: "border-slate-200",
//       icon: "bg-slate-100 text-slate-700",
//       label: "text-slate-600",
//     },
//   };
//   const t = tones[tone] || tones.slate;

//   return (
//     <div className={`rounded-xl border ${t.border} bg-gradient-to-br ${t.bg} p-5 shadow-sm transition hover:shadow-md`}>
//       <div className="flex items-center justify-between">
//         <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.icon}`}>
//           <Icon className="h-5 w-5" />
//         </div>
//       </div>
//       <p className={`mt-4 text-[10px] font-bold uppercase tracking-wider ${t.label}`}>
//         {label}
//       </p>
//       <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
//       {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    PAGINATION
//    ══════════════════════════════════════════════════════════ */

// function Pagination({ page, pageSize, total, onPageChange }) {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   if (total <= pageSize) return null;

//   return (
//     <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
//       <p className="text-xs text-slate-500">
//         Page <span className="font-semibold text-slate-700">{page}</span> of {totalPages}
//       </p>
//       <div className="flex gap-2">
//         <button
//           type="button"
//           disabled={page <= 1}
//           onClick={() => onPageChange(page - 1)}
//           className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           Previous
//         </button>
//         <button
//           type="button"
//           disabled={page >= totalPages}
//           onClick={() => onPageChange(page + 1)}
//           className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function AttendanceBreaksPage() {
//   const user = useAuthStore((s) => s.user);
//   const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

//   const employeeId = useMemo(
//     () =>
//       user?.employee_id ||
//       user?.employeeId ||
//       user?.emp_id ||
//       user?.employee?.employee_id ||
//       "",
//     [user]
//   );

//   const [activeBreak, setActiveBreak] = useState(null);
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [starting, setStarting] = useState(false);
//   const [ending, setEnding] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [breakType, setBreakType] = useState("lunch");
//   const [remarks, setRemarks] = useState("");
//   const [confirmEnd, setConfirmEnd] = useState(false);

//   const reqIdRef = useRef(0);
//   const didInitRef = useRef(false);

//   /* ══════════════ FETCH ══════════════ */
//   const fetchAll = useCallback(async () => {
//     if (!employeeId) {
//       setError("Your employee profile is not linked. Please contact HR.");
//       setLoading(false);
//       return;
//     }

//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.get("/api/v1/get/breaks", {
//         params: { employee_id: employeeId, page, page_size: PAGE_SIZE },
//       });
//       if (myReqId !== reqIdRef.current) return;

//       const { items, total: t } = extractList(res);
//       setList(items);
//       setTotal(t);

//       const active = items.find((b) => !b.break_end);
//       if (active) {
//         setActiveBreak(active);
//         setBreakType(active.break_type || "lunch");
//       } else {
//         setActiveBreak(null);
//       }
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, [employeeId, page]);

//   useEffect(() => {
//     if (!didInitRef.current) {
//       didInitRef.current = true;
//       fetchAll();
//       return;
//     }
//     const t = setTimeout(fetchAll, 300);
//     return () => clearTimeout(t);
//   }, [fetchAll]);

//   /* ══════════════ START BREAK ══════════════ */
//   const startBreak = async () => {
//     if (activeBreak) {
//       setError("A break is already running. End it first.");
//       return;
//     }
//     setStarting(true);
//     setError("");
//     setSuccess("");

//     try {
//       const res = await api.post("/api/v1/break/start", {
//         employee_id: employeeId,
//         break_type: breakType || null,
//         remarks: remarks || null,
//       });

//       const newBreak = res?.data?.break || res?.data?.data || res?.data;
//       if (newBreak?.break_id) {
//         setActiveBreak(newBreak);
//       } else {
//         await fetchAll();
//       }

//       setRemarks("");
//       setSuccess("Break started successfully");
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setStarting(false);
//     }
//   };

//   /* ══════════════ END BREAK ══════════════ */
//   const endBreak = async () => {
//     if (!activeBreak?.break_id) return;
//     setEnding(true);
//     setError("");
//     setSuccess("");

//     try {
//       await api.post("/api/v1/break/end", { break_id: activeBreak.break_id });
//       setActiveBreak(null);
//       setConfirmEnd(false);
//       setSuccess("Break ended successfully");
//       fetchAll();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setEnding(false);
//     }
//   };

//   /* ══════════════ DERIVED ══════════════ */
//   const todaySummary = useMemo(() => {
//     const today = new Date().toISOString().slice(0, 10);
//     const todayItems = list.filter(
//       (b) =>
//         b.break_start &&
//         String(b.break_start).slice(0, 10) === today &&
//         b.break_minutes != null
//     );
//     const totalMin = todayItems.reduce(
//       (sum, b) => sum + (Number(b.break_minutes) || 0),
//       0
//     );
//     const longest = todayItems.reduce(
//       (max, b) => Math.max(max, Number(b.break_minutes) || 0),
//       0
//     );
//     return {
//       total_minutes: totalMin,
//       count: todayItems.length,
//       longest_minutes: longest,
//     };
//   }, [list]);

//   /* ══════════════ RENDER ══════════════ */
//   return (
//     <div className="min-h-screen w-full bg-slate-50">
//       {/* ═══ FULL WIDTH CONTAINER ═══ */}
//       <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
//         {/* ═══════════ HEADER ═══════════ */}
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#b91c1c] text-white shadow-lg shadow-red-200">
//               <Coffee className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-[24px] font-bold text-slate-900">Breaks</h1>
//               <p className="text-sm text-slate-500">
//                 Track lunch, tea, and personal breaks
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={fetchAll}
//             disabled={loading}
//             className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
//           >
//             <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//             {loading ? "Refreshing..." : "Refresh"}
//           </button>
//         </div>

//         {/* ═══════════ TOASTS ═══════════ */}
//         <Toast type="error" message={error} onDismiss={() => setError("")} />
//         <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

//         {/* ═══════════ ACTIVE BREAK BANNER ═══════════ */}
//         {activeBreak && (
//           <div className="mb-6 w-full overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 shadow-lg shadow-amber-100/50">
//             <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
//               <div className="flex items-center gap-4">
//                 <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200">
//                   <Coffee className="h-6 w-6" />
//                   <span className="absolute -right-1 -top-1 flex h-4 w-4">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
//                     <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500 ring-2 ring-white" />
//                   </span>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <p className="text-base font-bold text-amber-900">
//                       Break in progress
//                     </p>
//                     <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
//                       Live
//                     </span>
//                   </div>
//                   <p className="mt-0.5 text-sm text-amber-700">
//                     {BREAK_TYPE_MAP[activeBreak.break_type]?.label || "Break"} · Started at{" "}
//                     {formatTime(activeBreak.break_start, tz)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="text-right">
//                   <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
//                     Elapsed
//                   </p>
//                   <p className="text-2xl font-black text-amber-900">
//                     <LiveTimer startedAt={activeBreak.break_start} />
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setConfirmEnd(true)}
//                   disabled={ending}
//                   className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-amber-200 transition hover:from-amber-700 hover:to-orange-700 disabled:opacity-60"
//                 >
//                   <Square className="h-4 w-4" />
//                   End Break
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════════ STATS GRID ═══════════ */}
//         <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
//           <StatCard
//             icon={Clock}
//             label="Total Today"
//             value={formatMinutes(todaySummary.total_minutes)}
//             tone="amber"
//             hint="Time spent on breaks"
//           />
//           <StatCard
//             icon={CalendarDays}
//             label="Breaks Taken"
//             value={todaySummary.count}
//             tone="blue"
//             hint="Count of breaks"
//           />
//           <StatCard
//             icon={TrendingUp}
//             label="Longest Break"
//             value={formatMinutes(todaySummary.longest_minutes)}
//             tone="emerald"
//             hint="Single break duration"
//           />
//         </div>

//         {/* ═══════════ MAIN GRID — START FORM + HISTORY SIDE-BY-SIDE ON LARGE ═══════════ */}
//         <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* START BREAK CARD — 1 column on lg */}
//           {!activeBreak && (
//             <div className="lg:col-span-1">
//               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
//                     <Play className="h-4 w-4" />
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-slate-900">Start a Break</h2>
//                     <p className="text-xs text-slate-500">
//                       Pick type and tap Start
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="mb-5">
//                     <label className="mb-2.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Break Type
//                     </label>
//                     <div className="grid grid-cols-2 gap-2.5">
//                       {BREAK_TYPES.map((t) => {
//                         const active = breakType === t.value;
//                         return (
//                           <button
//                             key={t.value}
//                             type="button"
//                             onClick={() => setBreakType(t.value)}
//                             className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3.5 text-xs font-semibold transition ${
//                               active
//                                 ? "border-[#E42527] bg-red-50 text-[#E42527] shadow-sm"
//                                 : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
//                             }`}
//                           >
//                             <span className="text-xl">{t.icon}</span>
//                             <span>{t.label.split(" ")[0]}</span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="mb-5">
//                     <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Remarks <span className="font-normal text-slate-400">(optional)</span>
//                     </label>
//                     <input
//                       value={remarks}
//                       onChange={(e) => setRemarks(e.target.value)}
//                       maxLength={200}
//                       placeholder="e.g. Lunch with team"
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-red-100"
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={startBreak}
//                     disabled={starting}
//                     className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E42527] py-3.5 text-sm font-bold text-white shadow-md shadow-red-200 transition hover:bg-[#c91f21] disabled:opacity-60"
//                   >
//                     {starting ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Starting...
//                       </>
//                     ) : (
//                       <>
//                         <Play className="h-4 w-4" />
//                         Start Break
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* HISTORY — takes full width if no form, or 2 cols if form shown */}
//           <div className={activeBreak ? "lg:col-span-3" : "lg:col-span-2"}>
//             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//               <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
//                     <Timer className="h-4 w-4" />
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-slate-900">Break History</h2>
//                     <p className="text-xs text-slate-500">
//                       {total > 0
//                         ? `${total} record${total !== 1 ? "s" : ""}`
//                         : "No records yet"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="w-full overflow-x-auto">
//                 {loading && list.length === 0 ? (
//                   <div className="space-y-2 p-6">
//                     {Array.from({ length: 4 }).map((_, i) => (
//                       <div
//                         key={i}
//                         className="h-14 animate-pulse rounded-lg bg-slate-100"
//                       />
//                     ))}
//                   </div>
//                 ) : list.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//                     <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-3xl shadow-sm ring-1 ring-amber-100">
//                       ☕
//                     </div>
//                     <p className="text-sm font-bold text-slate-700">No breaks yet</p>
//                     <p className="text-xs text-slate-500">
//                       Start your first break to see it here
//                     </p>
//                   </div>
//                 ) : (
//                   <table className="w-full text-left text-sm">
//                     <thead>
//                       <tr className="border-b border-slate-100 bg-slate-50">
//                         <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                           Date
//                         </th>
//                         <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                           Type
//                         </th>
//                         <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                           Start
//                         </th>
//                         <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                           End
//                         </th>
//                         <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                           Duration
//                         </th>
//                         <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                           Status
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                       {list.map((b, i) => {
//                         const isActive = !b.break_end;
//                         const typeInfo = BREAK_TYPE_MAP[b.break_type];

//                         return (
//                           <tr
//                             key={b.break_id || i}
//                             className={`transition ${
//                               isActive ? "bg-amber-50/40" : "hover:bg-slate-50"
//                             }`}
//                           >
//                             <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
//                               {formatDate(b.break_start, tz)}
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className="inline-flex items-center gap-2">
//                                 <span className="text-base">
//                                   {typeInfo?.icon || "⏸️"}
//                                 </span>
//                                 <span className="text-sm font-semibold capitalize text-slate-700">
//                                   {typeInfo?.label || b.break_type || "Break"}
//                                 </span>
//                               </span>
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
//                               {formatTime(b.break_start, tz)}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
//                               {isActive ? (
//                                 <span className="font-medium text-amber-600">
//                                   In progress
//                                 </span>
//                               ) : (
//                                 formatTime(b.break_end, tz)
//                               )}
//                             </td>
//                             <td className="px-6 py-4">
//                               {isActive ? (
//                                 <LiveTimer
//                                   startedAt={b.break_start}
//                                   className="text-sm font-bold text-amber-700"
//                                 />
//                               ) : (
//                                 <span className="text-sm font-bold text-slate-800">
//                                   {formatMinutes(b.break_minutes)}
//                                 </span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4">
//                               {isActive ? (
//                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
//                                   <CircleDot className="h-3 w-3 animate-pulse" />
//                                   Running
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
//                                   <CheckCircle2 className="h-3 w-3" />
//                                   Done
//                                 </span>
//                               )}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 )}
//               </div>

//               {!loading && list.length > 0 && (
//                 <Pagination
//                   page={page}
//                   pageSize={PAGE_SIZE}
//                   total={total}
//                   onPageChange={setPage}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ═══════════ CONFIRM END MODAL ═══════════ */}
//       {confirmEnd && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
//           onClick={() => !ending && setConfirmEnd(false)}
//           role="dialog"
//           aria-modal="true"
//         >
//           <div
//             className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
//                 <Square className="h-6 w-6 text-amber-600" />
//               </div>
//               <h3 className="mt-4 text-base font-bold text-slate-900">
//                 End your break?
//               </h3>
//               <p className="mt-2 text-sm text-slate-500">
//                 Your break duration will be recorded. This action cannot be undone.
//               </p>
//             </div>
//             <div className="flex gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setConfirmEnd(false)}
//                 disabled={ending}
//                 className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={endBreak}
//                 disabled={ending}
//                 className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
//               >
//                 {ending ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Ending...
//                   </>
//                 ) : (
//                   "End Break"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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

const BREAK_TYPES = [
  { value: "lunch", label: "Lunch" },
  { value: "tea", label: "Tea" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

const apiErr = (err) => {
  const d = err?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((e) => e?.msg || "Error").join(" • ");
  if (typeof d === "string") return d;
  return err?.message || "Something went wrong";
};

const pad = (n) => String(n).padStart(2, "0");

const fmtTime = (v, tz) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  try {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz,
    });
  } catch { return "—"; }
};

const fmtDate = (v, tz) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  try {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", timeZone: tz,
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

const fmtLive = (s) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${pad(m)}m ${pad(sec)}s`;
  if (m > 0) return `${m}m ${pad(sec)}s`;
  return `${sec}s`;
};

/* ══════════════════════════════════════════════════════════
   LIVE TIMER
   ══════════════════════════════════════════════════════════ */

function LiveTimer({ startedAt, className = "" }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!startedAt) return <span className={className}>—</span>;
  const s = new Date(startedAt).getTime();
  if (isNaN(s)) return <span className={className}>—</span>;
  return <span className={`font-mono tabular-nums ${className}`}>{fmtLive((now - s) / 1000)}</span>;
}

/* ══════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════ */

export default function BreaksPage() {
  const user = useAuthStore((s) => s.user);
  const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

  const [employeeId, setEmployeeId] = useState("");
  const [loadingMe, setLoadingMe] = useState(true);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [activeBreak, setActiveBreak] = useState(null);

  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [breakType, setBreakType] = useState("lunch");
  const [remarks, setRemarks] = useState("");

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
      const res = await api.get("/api/v1/get/breaks", {
        params: { employee_id: employeeId, page, page_size: PAGE_SIZE },
      });
      if (myId !== reqIdRef.current) return;
      const d = res?.data ?? {};
      const items = Array.isArray(d.breaks) ? d.breaks : [];
      setList(items);
      setTotal(Number(d.total) || items.length);
      setActiveBreak(items.find((b) => !b.break_end) || null);
    } catch (e) {
      if (myId === reqIdRef.current) setErr(apiErr(e));
    } finally {
      if (myId === reqIdRef.current) setLoading(false);
    }
  }, [employeeId, page]);

  useEffect(() => {
    if (!employeeId) return;
    const t = setTimeout(fetchList, 200);
    return () => clearTimeout(t);
  }, [employeeId, fetchList]);

  /* ── actions ── */
  const startBreak = async () => {
    if (!employeeId || activeBreak) return;
    setStarting(true); setErr(""); setOk("");
    try {
      await api.post("/api/v1/break/start", {
        employee_id: employeeId,
        break_type: breakType || null,
        remarks: remarks.trim() || null,
      });
      setRemarks("");
      setOk("Break started");
      await fetchList();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setStarting(false);
    }
  };

  const endBreak = async () => {
    if (!activeBreak?.break_id) return;
    if (!window.confirm("End this break?")) return;
    setEnding(true); setErr(""); setOk("");
    try {
      await api.post("/api/v1/break/end", { break_id: activeBreak.break_id });
      setOk("Break ended");
      await fetchList();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setEnding(false);
    }
  };

  /* ── today stats ── */
  const today = useMemo(() => {
    const t = new Date().toISOString().slice(0, 10);
    const items = list.filter(
      (b) => b.break_start && String(b.break_start).slice(0, 10) === t
    );
    const min = items.reduce((s, b) => s + (Number(b.break_minutes) || 0), 0);
    return { count: items.length, min };
  }, [list]);

  /* ── auto clear ── */
  useEffect(() => { if (ok) { const t = setTimeout(() => setOk(""), 3500); return () => clearTimeout(t); } }, [ok]);
  useEffect(() => { if (err) { const t = setTimeout(() => setErr(""), 5000); return () => clearTimeout(t); } }, [err]);

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

  if (!employeeId) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-lg rounded border border-red-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Profile not linked</h2>
          <p className="mt-1 text-sm text-slate-600">{err || "Please contact HR."}</p>
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
              <span className="font-medium text-slate-700">Breaks</span>
            </nav>
            <h1 className="text-xl font-semibold text-slate-900">Breaks</h1>
            <p className="mt-0.5 text-[13px] text-slate-500">
              Track and manage your daily breaks
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

        {/* ═══════════ ACTIVE BREAK STRIP ═══════════ */}
        {activeBreak && (
          <div className="mb-5 flex flex-col gap-3 rounded border border-amber-300 bg-amber-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-amber-900">
                  {BREAK_TYPES.find((t) => t.value === activeBreak.break_type)?.label || "Break"} in progress
                </span>
              </div>
              <p className="mt-0.5 pl-4 text-xs text-amber-700">
                Started at {fmtTime(activeBreak.break_start, tz)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Elapsed</p>
                <p className="text-base font-bold text-amber-900 tabular-nums">
                  <LiveTimer startedAt={activeBreak.break_start} />
                </p>
              </div>
              <button
                onClick={endBreak}
                disabled={ending}
                className="h-9 rounded border border-amber-600 bg-amber-600 px-4 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-60"
              >
                {ending ? "Ending..." : "End Break"}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ SUMMARY STATS ═══════════ */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded border border-slate-200 bg-white px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Total Today</p>
            <p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{fmtMinutes(today.min)}</p>
          </div>
          <div className="rounded border border-slate-200 bg-white px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Breaks Taken</p>
            <p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{today.count}</p>
          </div>
          <div className="rounded border border-slate-200 bg-white px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Average Duration</p>
            <p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">
              {today.count ? fmtMinutes(Math.round(today.min / today.count)) : "—"}
            </p>
          </div>
        </div>

        {/* ═══════════ START FORM (only when idle) ═══════════ */}
        {!activeBreak && (
          <div className="mb-5 rounded border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-800">Start a Break</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Select type and click Start. Timer runs automatically.
              </p>
            </div>

            <div className="p-4">
              <div className="grid gap-4 lg:grid-cols-12">
                {/* Type */}
                <div className="lg:col-span-6">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Break Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BREAK_TYPES.map((t) => {
                      const on = breakType === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setBreakType(t.value)}
                          className={`h-9 rounded border px-3.5 text-sm font-medium transition ${
                            on
                              ? "border-[#E42527] bg-red-50 text-[#E42527]"
                              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Remarks */}
                <div className="lg:col-span-4">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Remarks <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Lunch with team"
                    maxLength={200}
                    className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]"
                  />
                </div>

                {/* Start */}
                <div className="flex items-end lg:col-span-2">
                  <button
                    onClick={startBreak}
                    disabled={starting}
                    className="h-9 w-full rounded bg-[#E42527] px-4 text-sm font-medium text-white transition hover:bg-[#c91f21] disabled:opacity-60"
                  >
                    {starting ? "Starting..." : "Start Break"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ HISTORY TABLE ═══════════ */}
        <div className="rounded border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Break History</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {total} {total === 1 ? "record" : "records"} found
              </p>
            </div>
          </div>

          {loading && list.length === 0 ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <p className="text-sm font-medium text-slate-700">No breaks yet</p>
              <p className="mt-1 text-xs text-slate-500">Start your first break to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Start</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">End</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Duration</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((b, i) => {
                    const isActive = !b.break_end;
                    const meta = BREAK_TYPES.find((t) => t.value === b.break_type);
                    return (
                      <tr key={b.break_id || i} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {fmtDate(b.break_start, tz)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {meta?.label || b.break_type || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {fmtTime(b.break_start, tz)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {isActive ? "—" : fmtTime(b.break_end, tz)}
                        </td>
                        <td className="px-4 py-3">
                          {isActive ? (
                            <LiveTimer startedAt={b.break_start} className="font-medium text-amber-700" />
                          ) : (
                            <span className="font-medium text-slate-900">
                              {fmtMinutes(b.break_minutes)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isActive ? (
                            <span className="inline-flex items-center rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                              Running
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              Completed
                            </span>
                          )}
                        </td>
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
    </div>
  );
}