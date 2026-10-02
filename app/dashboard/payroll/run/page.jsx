

// "use client";

// import { useMemo, useState } from "react";
// import Link from "next/link";
// import { api } from "@/app/lib/api";

// /* ================= HELPERS ================= */

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
//   if (err?.response?.status === 401) return "Session expired. Please login again.";
//   if (err?.response?.status === 403) return "You don't have permission. Contact Payroll Officer/Admin.";
//   if (err?.response?.status === 404) return "Not found.";
//   return err?.message || "Something went wrong";
// }

// function formatMoney(v) {
//   const n = Number(v || 0);
//   if (!Number.isFinite(n)) return "₹ 0.00";
//   return `₹ ${n.toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;
// }

// const MONTHS = Array.from({ length: 12 }, (_, i) => ({
//   value: i + 1,
//   label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
// }));

// /* ================= COMPONENT ================= */

// export default function RunPayrollPage() {
//   const now = new Date();
//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [runName, setRunName] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const monthLabel = useMemo(
//     () => MONTHS.find((m) => m.value === Number(month))?.label || "",
//     [month]
//   );

//   const defaultRunName = `${monthLabel} ${year} Payroll`;

//   /* ---------- Validation ---------- */
//   const yearNum = Number(year);
//   const yearError =
//     !Number.isFinite(yearNum) || yearNum < 2000 || yearNum > 2100
//       ? "Year must be between 2000 and 2100"
//       : null;

//   /* ---------- Run ---------- */
//   async function handleRun(e) {
//     e.preventDefault();

//     if (yearError) {
//       setError(yearError);
//       return;
//     }

//     const confirmed = window.confirm(
//       `Run payroll for ${monthLabel} ${yearNum}?\n\n` +
//         `This will process payroll for all eligible employees. ` +
//         `It cannot be run twice for the same period.`
//     );
//     if (!confirmed) return;

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const res = await api.post("/api/v1/payroll/run", {
//         year: yearNum,
//         month: Number(month),
//         run_name: runName.trim() || null,
//       });

//       setResult(res?.data ?? res);
//     } catch (err) {
//       const msg = getErrorMessage(err);
//       if (msg.toLowerCase().includes("already run")) {
//         setError(
//           "Payroll has already been run for this period. " +
//             "View it in the Payroll List page to continue."
//         );
//       } else {
//         setError(msg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   function resetResult() {
//     setResult(null);
//     setError("");
//     setRunName("");
//   }

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Run Payroll</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">
//           Process monthly payroll for all active employees
//         </p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-5">
//         {/* ============== LEFT: FORM ============== */}
//         <div className="lg:col-span-3">
//           <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//             <form onSubmit={handleRun} className="space-y-5">
//               {/* Year + Month */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-[#374151]">
//                     Year
//                   </label>
//                   <input
//                     type="number"
//                     min={2000}
//                     max={2100}
//                     value={year}
//                     onChange={(e) => setYear(e.target.value)}
//                     className={`w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none ${
//                       yearError
//                         ? "border-red-300 focus:border-red-500"
//                         : "border-[#d1d5db] focus:border-[#E42527]"
//                     }`}
//                   />
//                   {yearError && (
//                     <p className="mt-1 text-xs text-red-600">{yearError}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-[#374151]">
//                     Month
//                   </label>
//                   <select
//                     value={month}
//                     onChange={(e) => setMonth(e.target.value)}
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                   >
//                     {MONTHS.map((m) => (
//                       <option key={m.value} value={m.value}>
//                         {m.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Run Name */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-[#374151]">
//                   Run Name{" "}
//                   <span className="font-normal text-[#6b7280]">(optional)</span>
//                 </label>
//                 <input
//                   value={runName}
//                   onChange={(e) => setRunName(e.target.value)}
//                   placeholder={defaultRunName}
//                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                 />
//                 <p className="mt-1 text-xs text-[#6b7280]">
//                   Default: <span className="font-medium">{defaultRunName}</span>
//                 </p>
//               </div>

//               {/* Warning */}
//               <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
//                 <p className="font-medium">Before you run:</p>
//                 <ul className="mt-1 list-disc pl-4 space-y-0.5">
//                   <li>All active employees must have an active salary structure</li>
//                   <li>Attendance for the period should be finalized</li>
//                   <li>Payroll cannot be run twice for the same period</li>
//                 </ul>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
//                   <div className="flex items-start justify-between gap-3">
//                     <span>{error}</span>
//                     <button
//                       type="button"
//                       onClick={() => setError("")}
//                       className="text-red-400 hover:text-red-600"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                   {error.toLowerCase().includes("already run") && (
//                     <Link
//                       href="/payroll/list"
//                       className="mt-2 inline-block text-xs font-medium text-red-700 underline hover:text-red-900"
//                     >
//                       → Go to Payroll List
//                     </Link>
//                   )}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
//                 <button
//                   type="button"
//                   onClick={resetResult}
//                   disabled={loading}
//                   className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading || !!yearError}
//                   className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {loading ? "Processing…" : "Run Payroll"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* ============== RIGHT: SUMMARY / RESULT ============== */}
//         <div className="lg:col-span-2">
//           {loading && (
//             <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//               <div className="flex flex-col items-center py-8 text-center text-sm text-[#6b7280]">
//                 <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
//                 <p className="font-medium text-[#1a1a1a]">Processing payroll…</p>
//                 <p className="mt-1 text-xs">
//                   This may take a minute for {monthLabel} {year}
//                 </p>
//               </div>
//             </div>
//           )}

//           {!loading && result && (
//             <div className="space-y-4">
//               {/* Result card */}
//               <div className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm">
//                 <div className="mb-3 flex items-center justify-between">
//                   <p className="font-semibold text-green-800">
//                     ✓ Payroll completed
//                   </p>
//                   <button
//                     type="button"
//                     onClick={resetResult}
//                     className="text-green-600 hover:text-green-800"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <dl className="grid grid-cols-2 gap-3 text-sm">
//                   <div className="rounded-md bg-white/60 px-3 py-2">
//                     <dt className="text-xs text-green-700">Created</dt>
//                     <dd className="mt-0.5 font-semibold text-green-900">
//                       {result.created_count ?? 0}
//                     </dd>
//                   </div>
//                   <div className="rounded-md bg-white/60 px-3 py-2">
//                     <dt className="text-xs text-green-700">Errors</dt>
//                     <dd
//                       className={`mt-0.5 font-semibold ${
//                         (result.error_count ?? 0) > 0
//                           ? "text-red-700"
//                           : "text-green-900"
//                       }`}
//                     >
//                       {result.error_count ?? 0}
//                     </dd>
//                   </div>
//                 </dl>

//                 {/* Money summary */}
//                 {result.summary && (
//                   <div className="mt-3 space-y-1.5 text-sm">
//                     <Row
//                       label="Total Gross"
//                       value={formatMoney(result.summary.total_gross)}
//                     />
//                     <Row
//                       label="Total Deductions"
//                       value={formatMoney(result.summary.total_deductions)}
//                     />
//                     <Row
//                       label="Total Net Pay"
//                       value={formatMoney(result.summary.total_net_pay)}
//                       strong
//                     />
//                     {result.summary.total_employer_contribution != null && (
//                       <Row
//                         label="Employer Contribution"
//                         value={formatMoney(
//                           result.summary.total_employer_contribution
//                         )}
//                       />
//                     )}
//                   </div>
//                 )}

//                 <div className="mt-4 flex flex-wrap gap-2">
//                   <Link
//                     href="/payroll/list"
//                     className="rounded-md bg-[#E42527] px-4 py-2 text-xs font-medium text-white hover:bg-[#c91f21]"
//                   >
//                     View Payroll List →
//                   </Link>
//                 </div>
//               </div>

//               {/* Errors list */}
//               {Array.isArray(result.errors) && result.errors.length > 0 && (
//                 <div className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
//                   <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">
//                     Errors ({result.errors.length})
//                   </h3>
//                   <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
//                     {result.errors.map((e, i) => (
//                       <div
//                         key={i}
//                         className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs"
//                       >
//                         <p className="font-mono font-medium text-red-800">
//                           {e.employee_id}
//                         </p>
//                         <p className="mt-0.5 text-red-700">{e.error}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {!loading && !result && (
//             <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//               <h3 className="mb-2 text-sm font-semibold text-[#1a1a1a]">
//                 How it works
//               </h3>
//               <ol className="space-y-2 text-xs text-[#6b7280]">
//                 <li className="flex gap-2">
//                   <span className="font-semibold text-[#1a1a1a]">1.</span>
//                   <span>Select year and month</span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="font-semibold text-[#1a1a1a]">2.</span>
//                   <span>Click Run Payroll — system processes each eligible employee</span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="font-semibold text-[#1a1a1a]">3.</span>
//                   <span>
//                     Review created payrolls and any errors, then approve from Payroll List
//                   </span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="font-semibold text-[#1a1a1a]">4.</span>
//                   <span>Mark as paid to generate payslips</span>
//                 </li>
//               </ol>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= SUB-COMPONENT ================= */

// function Row({ label, value, strong }) {
//   return (
//     <div className="flex items-center justify-between border-t border-green-200/60 pt-1.5 first:border-t-0 first:pt-0">
//       <span className="text-xs text-green-700">{label}</span>
//       <span
//         className={`text-sm ${
//           strong ? "font-bold text-green-900" : "font-medium text-green-800"
//         }`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { api } from "@/app/lib/api";

/* ============================================================
   CONSTANTS
   ============================================================ */

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);

const RUN_STATUS_TONES = {
  draft: "slate",
  processing: "amber",
  processed: "sky",
  approved: "emerald",
  paid: "emerald",
  failed: "red",
  void: "slate",
  locked: "slate",
};

const ATTENDANCE_STATUSES = [
  "present", "work_from_home", "on_duty",
  "half_day", "absent", "on_leave",
  "holiday", "week_off", "missing_punch",
];
const NO_PUNCH_STATUSES = new Set(["holiday", "week_off", "on_leave", "absent"]);

/* ============================================================
   HELPERS
   ============================================================ */

function getErrorMessage(err) {
  const d = err?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((i) => i?.msg || "Error").join(", ");
  if (typeof d === "string") return d;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired.";
  if (err?.response?.status === 403) return "You don't have permission.";
  if (err?.response?.status === 404) return "Not found.";
  return err?.message || "Something went wrong";
}

function dig(obj, path) {
  const v = path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
  return Array.isArray(v) ? v : undefined;
}

function getList(res, ...paths) {
  const body = res?.data ?? {};
  for (const p of paths) {
    const v = dig(body, p);
    if (v) return v;
  }
  const common = [
    "data", "employees", "items", "results", "rows", "records", "list",
    "data.data", "data.employees", "data.items", "data.results",
  ];
  for (const k of common) {
    const v = dig(body, k);
    if (v) return v;
  }
  if (Array.isArray(body)) return body;
  if (Array.isArray(res)) return res;
  return [];
}

function getEmployeeId(e) { return e?.employee_id || e?.id || ""; }

function getEmployeeName(e) {
  const f = [e?.first_name, e?.last_name].filter(Boolean).join(" ").trim();
  return f || e?.name || e?.full_name || e?.employee_name ||
    e?.company_email || e?.personal_email || getEmployeeId(e) || "Employee";
}

function getEmployeeSubtitle(e) {
  const parts = [];
  if (e?.designation_name && e.designation_name !== "—") parts.push(e.designation_name);
  if (e?.department_name && e.department_name !== "—") parts.push(e.department_name);
  if (e?.company_email) parts.push(e.company_email);
  return parts.join(" · ");
}

function inr(v, decimals = 2) {
  return Number(v || 0).toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function monthLabel(m) { return MONTHS[m - 1] || ""; }

function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }

function isWeekend(y, m, d) {
  const dow = new Date(y, m - 1, d).getDay();
  return dow === 0 || dow === 6;
}

function isoDate(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState("preview");
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 5000);
    return () => clearTimeout(t);
  }, [success]);

  useEffect(() => {
    let cancelled = false;
    setLoadingEmployees(true);
    api.get("/api/v1/get/employees")
      .then((res) => !cancelled && setEmployees(getList(res, "employees", "data.employees")))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoadingEmployees(false));
    return () => { cancelled = true; };
  }, []);

  const tabs = [
    { id: "preview", label: "Preview Payroll" },
    { id: "deductions", label: "Deductions" },
    { id: "run", label: "Run Payroll" },
    { id: "runs", label: "Runs & Approvals" },
    { id: "payslip", label: "Payslip" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">Payroll</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Payroll</h1>
          <p className="mt-1 text-sm text-slate-500">
            Preview · Deductions · Run · Approve · Payslip
          </p>

          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setActiveTab(t.id); setError(""); setSuccess(""); }}
                className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === t.id ? "text-[#E42527]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
                {activeTab === t.id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-600">✕</button>
          </div>
        )}

        {activeTab === "preview" && (
          <PreviewTab employees={employees} loadingEmployees={loadingEmployees} onError={setError} />
        )}
        {activeTab === "deductions" && (
          <DeductionsTab employees={employees} loadingEmployees={loadingEmployees} onError={setError} />
        )}
        {activeTab === "run" && (
          <RunTab employees={employees} loadingEmployees={loadingEmployees}
            onSuccess={setSuccess} onError={setError} />
        )}
        {activeTab === "runs" && (
          <RunsTab onSuccess={setSuccess} onError={setError} />
        )}
        {activeTab === "payslip" && (
          <PayslipTab employees={employees} loadingEmployees={loadingEmployees} onError={setError} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TAB 1 — PREVIEW
   ============================================================ */

function PreviewTab({ employees, loadingEmployees, onError }) {
  const [mode, setMode] = useState("single");
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((e) => {
      const hay = [getEmployeeName(e), getEmployeeId(e), e?.company_email]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [employees, search]);

  const load = useCallback(async () => {
    setLoading(true); setData(null);
    try {
      if (mode === "single") {
        if (!employeeId) return;
        const res = await api.post("/api/v1/payroll/preview", {
          employee_id: employeeId, year: Number(year), month: Number(month),
        });
        setData({ mode: "single", ...res.data });
      } else {
        const res = await api.post("/api/v1/payroll/preview-all", {
          year: Number(year), month: Number(month),
        });
        setData({ mode: "all", ...res.data });
      }
    } catch (err) {
      onError(getErrorMessage(err));
    } finally { setLoading(false); }
  }, [mode, employeeId, year, month, onError]);

  useEffect(() => {
    if (mode === "single" && employeeId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, employeeId, year, month]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Payroll Preview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Compute what payroll will be — no writes. Verify LOP, deductions, and net pay before running.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SegBtn active={mode === "single"} onClick={() => setMode("single")}>Single Employee</SegBtn>
          <SegBtn active={mode === "all"} onClick={() => setMode("all")}>Whole Company</SegBtn>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {mode === "single" && (
            <div className="lg:col-span-2">
              <Label>Employee *</Label>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID, or email…"
                className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
              <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]">
                <option value="">
                  {loadingEmployees ? "Loading…" : filteredEmployees.length === 0 ? "No match" : "— Select employee —"}
                </option>
                {filteredEmployees.map((emp) => {
                  const id = getEmployeeId(emp);
                  return <option key={id} value={id}>{getEmployeeName(emp)} ({id})</option>;
                })}
              </select>
            </div>
          )}
          <div>
            <Label>Year</Label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]">
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <Label>Month</Label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]">
              {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <button type="button" onClick={load}
            disabled={loading || (mode === "single" && !employeeId)}
            className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
            {loading ? "Computing…" : "Compute Preview"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          Computing preview…
        </div>
      )}

      {!loading && data?.mode === "single" && <SinglePreview data={data} />}
      {!loading && data?.mode === "all" && (
        <CompanyPreview data={data} expanded={expanded}
          toggle={(id) => setExpanded((p) => ({ ...p, [id]: !p[id] }))} />
      )}
    </div>
  );
}

function SinglePreview({ data }) {
  const att = data.attendance || {};
  const totals = data.totals || {};
  const earnings = data.earnings || [];
  const deductions = data.deductions || [];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Preview</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{data.employee_id}</h3>
            <p className="mt-1 text-sm text-slate-500">{data.period}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MoneyCard label="Net Pay" value={totals.net_pay} accent="dark" />
            <MoneyCard label="Gross" value={totals.earnings} accent="emerald" />
            <MoneyCard label="Deductions" value={totals.deductions} accent="red" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Annual CTC" value={`₹ ${inr(data.annual_ctc)}`} tone="slate" />
          <Stat label="Monthly CTC" value={`₹ ${inr(data.monthly_ctc)}`} tone="slate" />
          <Stat label="Days in period" value={att.days_in_period} tone="slate" />
          <Stat label="Payable days" value={`${att.payable_days} / ${att.days_in_period}`} tone="dark" />
          <Stat label="Present" value={att.days_present} tone="emerald" />
          <Stat label="Paid leaves" value={att.paid_leaves} tone="emerald" />
          <Stat label="Regularized" value={att.regularized_days} tone="sky" />
          <Stat label="LOP days" value={att.lop_days} tone={Number(att.lop_days) > 0 ? "red" : "slate"} />
        </div>

        {att.missing_dates?.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <b>{att.missing_dates.length} missing day(s) treated as LOP:</b>{" "}
            <span className="font-mono text-xs">{att.missing_dates.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownTable
          title="Earnings"
          rows={earnings.map((e) => ({
            name: e.component_name || e.component_code || e.component_id,
            amount: e.calculated_amount,
          }))}
          tone="emerald"
        />
        <BreakdownTable
          title="Deductions"
          rows={deductions.filter((d) => !d.is_employer_contribution)
            .map((d) => ({
              name: d.component_name || d.component_code || "Other",
              amount: d.deducted_amount,
            }))}
          tone="red"
        />
      </div>
    </div>
  );
}

function CompanyPreview({ data, expanded, toggle }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Employees" value={data.total_employees} />
        <SummaryCard label="Total Earnings" value={data.summary?.total_earnings} prefix="₹" accent="emerald" />
        <SummaryCard label="Total Deductions" value={data.summary?.total_deductions} prefix="₹" accent="red" />
        <SummaryCard label="Total Net" value={data.summary?.total_net} prefix="₹" accent="slate" />
      </div>

      {data.errors?.length > 0 && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">{data.errors.length} error(s)</p>
          <div className="mt-2 max-h-40 overflow-auto text-xs">
            {data.errors.map((e, i) => (
              <div key={i} className="py-0.5"><b>{e.employee_id}</b>: {e.error}</div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left"> </th>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-right">Days</th>
                <th className="px-4 py-3 text-right">Payable</th>
                <th className="px-4 py-3 text-right">LOP</th>
                <th className="px-4 py-3 text-right">Earnings</th>
                <th className="px-4 py-3 text-right">Deductions</th>
                <th className="px-4 py-3 text-right">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.data?.map((row) => (
                <tr key={row.employee_id} className="hover:bg-slate-50/70 cursor-pointer"
                  onClick={() => toggle(row.employee_id)}>
                  <td className="px-3 py-3 text-center text-slate-400">
                    <span className={`inline-block transition-transform ${expanded[row.employee_id] ? "rotate-90" : ""}`}>▶</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.employee_id}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.days_in_period}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.payable_days}</td>
                  <td className={`px-4 py-3 text-right tabular-nums font-semibold ${Number(row.lop_days) > 0 ? "text-red-700" : "text-slate-500"}`}>
                    {row.lop_days}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-700">₹ {inr(row.earnings)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-red-700">₹ {inr(row.deductions)}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">₹ {inr(row.net_pay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB 2 — DEDUCTIONS
   ============================================================ */

function DeductionsTab({ employees, loadingEmployees, onError }) {
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((e) => {
      const hay = [getEmployeeName(e), getEmployeeId(e)].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [employees, search]);

  const load = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true); setData(null);
    try {
      const res = await api.get(`/api/v1/payroll/lop-breakdown/${employeeId}`, {
        params: { year, month },
      });
      setData(res?.data ?? null);
    } catch (err) {
      onError(getErrorMessage(err));
    } finally { setLoading(false); }
  }, [employeeId, year, month, onError]);

  useEffect(() => { if (employeeId) load(); }, [employeeId, year, month, load]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Deduction Breakdown</h2>
        <p className="mt-1 text-sm text-slate-500">
          Which days were cut and what got deducted from each component.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label>Employee *</Label>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]">
              <option value="">
                {loadingEmployees ? "Loading…" : "— Select employee —"}
              </option>
              {filteredEmployees.map((emp) => {
                const id = getEmployeeId(emp);
                return <option key={id} value={id}>{getEmployeeName(emp)} ({id})</option>;
              })}
            </select>
          </div>
          <div>
            <Label>Year</Label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <Label>Month</Label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
              {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <button type="button" onClick={load} disabled={!employeeId || loading}
            className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
            {loading ? "Loading…" : "Show Deductions"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          Loading…
        </div>
      )}

      {!loading && data && <DeductionDetail data={data} />}
    </div>
  );
}

function DeductionDetail({ data }) {
  const totals = data.totals || {};
  const lopDays = data.lop_days || [];
  const components = data.component_deductions || [];
  const earnings = components.filter((c) => c.component_type === "earning");
  const statutory = components.filter((c) => c.component_type === "deduction");
  const employer = components.filter((c) => c.component_type === "employer_contribution");
  const totalLop = Number(data.total_lop_days || 0);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Deductions</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{data.employee_id}</h3>
            <p className="mt-1 text-sm text-slate-500">{data.period}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MoneyCard label="Full month net" value={totals.full_month_net} accent="slate" />
            <MoneyCard label="After LOP" value={totals.lop_adjusted_net} accent="emerald" />
            <MoneyCard label="Net lost" value={totals.net_lost} accent={Number(totals.net_lost) > 0 ? "red" : "slate"} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Days in period" value={data.days_in_period} tone="slate" />
          <Stat label="LOP days" value={totalLop} tone={totalLop > 0 ? "red" : "slate"} />
          <Stat label="Full month gross" value={`₹ ${inr(totals.full_month_gross)}`} tone="slate" />
          <Stat label="After LOP gross" value={`₹ ${inr(totals.lop_adjusted_gross)}`} tone="emerald" />
        </div>

        {totalLop > 0 && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            <b>Total LOP cut:</b> ₹ {inr(data.total_lop_deduction)} across the month.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Days cut ({lopDays.length})</h3>
        <p className="mt-1 text-sm text-slate-500">Every day that reduced pay this month.</p>

        {lopDays.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-emerald-200 bg-emerald-50 py-10 text-center text-sm text-emerald-800">
            No LOP days. Full month paid.
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Punch In</th>
                  <th className="px-4 py-2 text-left">Punch Out</th>
                  <th className="px-4 py-2 text-right">Worked</th>
                  <th className="px-4 py-2 text-right">Cut</th>
                  <th className="px-4 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lopDays.map((d) => (
                  <tr key={d.date}>
                    <td className="px-4 py-2 font-medium text-slate-800">{d.date}</td>
                    <td className="px-4 py-2">
                      <Pill tone={d.status === "absent" ? "red" : d.status === "half_day" ? "amber" : "slate"}>
                        {d.status.replace(/_/g, " ")}
                      </Pill>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-600">{d.punch_in || "—"}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-600">{d.punch_out || "—"}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-slate-600">
                      {d.total_work_minutes
                        ? `${Math.floor(d.total_work_minutes / 60)}h ${d.total_work_minutes % 60}m`
                        : "—"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                        {d.fraction_cut === 1 ? "1 day" : `${d.fraction_cut} day`}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500">{d.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Component-wise deduction</h3>
        <p className="mt-1 text-sm text-slate-500">
          For {totalLop} LOP day(s), what gets cut from each component.
        </p>

        <div className="mt-5 space-y-5">
          <ComponentDeductionTable title="Earnings (what employee loses)" rows={earnings} tone="red" />
          <ComponentDeductionTable title="Statutory deductions (they shrink too)" rows={statutory} tone="amber" />
          {employer.length > 0 && (
            <ComponentDeductionTable title="Employer contributions" rows={employer} tone="slate" />
          )}
        </div>

        <div className="mt-5 rounded-xl bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-300">Total earned reduction</p>
              <p className="mt-1 text-xs text-slate-400">Sum of cuts from all earning components</p>
            </div>
            <p className="text-2xl font-semibold tabular-nums">− ₹ {inr(data.total_lop_deduction)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Net pay impact</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile label="Full month gross" value={`₹ ${inr(totals.full_month_gross)}`} />
          <InfoTile label="Full month deductions" value={`₹ ${inr(totals.full_month_deductions)}`} />
          <InfoTile label="Full month net" value={`₹ ${inr(totals.full_month_net)}`} />
          <InfoTile label="Net lost to LOP" value={`₹ ${inr(totals.net_lost)}`} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoTile label="After LOP gross" value={`₹ ${inr(totals.lop_adjusted_gross)}`} />
          <InfoTile label="After LOP deductions" value={`₹ ${inr(totals.lop_adjusted_deductions)}`} />
          <InfoTile label="After LOP net (final)" value={`₹ ${inr(totals.lop_adjusted_net)}`} />
        </div>
      </div>
    </div>
  );
}

function ComponentDeductionTable({ title, rows, tone }) {
  const toneCls = { red: "text-red-700", amber: "text-amber-700", slate: "text-slate-700" }[tone];
  const total = rows.reduce((s, r) => s + Number(r.deducted_amount || 0), 0);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      </div>
      {rows.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-slate-400">None</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 text-left">Component</th>
              <th className="px-4 py-2 text-right">Monthly</th>
              <th className="px-4 py-2 text-right">Per day</th>
              <th className="px-4 py-2 text-right">Days cut</th>
              <th className="px-4 py-2 text-right">Deducted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((r) => (
              <tr key={r.component_id}>
                <td className="px-4 py-2">
                  <div className="font-medium text-slate-800">{r.component_name}</div>
                  <div className="text-xs text-slate-400 font-mono">{r.component_code}</div>
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-600">₹ {inr(r.monthly_amount)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-600">₹ {inr(r.per_day_amount)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-600">{r.days_cut}</td>
                <td className={`px-4 py-2 text-right tabular-nums font-semibold ${toneCls}`}>
                  − ₹ {inr(r.deducted_amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-100 bg-slate-50/70">
              <td colSpan={4} className="px-4 py-2 text-xs font-semibold text-slate-700">Total deduction</td>
              <td className={`px-4 py-2 text-right text-xs font-semibold tabular-nums ${toneCls}`}>
                − ₹ {inr(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

/* ============================================================
   TAB 3 — RUN
   ============================================================ */

function RunTab({ employees, loadingEmployees, onSuccess, onError }) {
  const [mode, setMode] = useState("single");
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [force, setForce] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((e) => {
      const hay = [getEmployeeName(e), getEmployeeId(e)].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [employees, search]);

  async function run() {
    setRunning(true); setResult(null);
    try {
      let res;
      if (mode === "single") {
        if (!employeeId) { onError("Pick an employee"); setRunning(false); return; }
        res = await api.post("/api/v1/payroll/run-single", {
          employee_id: employeeId, year: Number(year), month: Number(month), force: !!force,
        });
      } else {
        res = await api.post("/api/v1/payroll/run", {
          year: Number(year), month: Number(month),
        });
      }
      const data = res?.data ?? {};
      if (data.success === false) {
        onError(data.message || "Failed");
      } else {
        setResult(data);
        onSuccess(`Payroll run for ${monthLabel(month)} ${year}`);
      }
    } catch (err) { onError(getErrorMessage(err)); }
    finally { setRunning(false); }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Run Payroll</h2>
        <p className="mt-1 text-sm text-slate-500">
          Persists payroll rows. Once approved, rows cannot be modified.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SegBtn active={mode === "single"} onClick={() => setMode("single")}>Single</SegBtn>
          <SegBtn active={mode === "all"} onClick={() => setMode("all")}>Whole Company</SegBtn>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {mode === "single" && (
            <div className="lg:col-span-2">
              <Label>Employee *</Label>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
              <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
                <option value="">{loadingEmployees ? "Loading…" : "— Select employee —"}</option>
                {filteredEmployees.map((emp) => {
                  const id = getEmployeeId(emp);
                  return <option key={id} value={id}>{getEmployeeName(emp)} ({id})</option>;
                })}
              </select>
            </div>
          )}
          <div>
            <Label>Year</Label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <Label>Month</Label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
              {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
        </div>

        {mode === "single" && (
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
            Force re-run (overwrite existing)
          </label>
        )}

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <button type="button" onClick={run}
            disabled={running || (mode === "single" && !employeeId)}
            className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
            {running ? "Running…" : `Run ${mode === "single" ? "Payroll" : "Full Payroll"}`}
          </button>
        </div>
      </div>

      {result && mode === "single" && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <h3 className="text-base font-semibold text-emerald-900">Payroll Created</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MoneyCard label="Net Pay" value={result.net_pay} accent="dark" />
            <MoneyCard label="Earnings" value={result.total_earnings} accent="emerald" />
            <MoneyCard label="Deductions" value={result.total_deductions} accent="red" />
            <MoneyCard label="Employer Contribution" value={result.total_employer_contribution} accent="slate" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs text-slate-700">
            <div>LOP days: <b>{result.lop_days}</b></div>
            <div>Payroll ID: <span className="font-mono">{result.payroll_id}</span></div>
            <div>Run ID: <span className="font-mono">{result.payroll_run_id}</span></div>
          </div>
        </div>
      )}

      {result && mode === "all" && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <h3 className="text-base font-semibold text-emerald-900">Company Run Complete</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Created" value={result.created_count} accent="emerald" />
            <SummaryCard label="Errors" value={result.error_count}
              accent={result.error_count > 0 ? "red" : "slate"} />
            <MoneyCard label="Total Gross" value={result.summary?.total_gross} accent="emerald" />
            <MoneyCard label="Total Net" value={result.summary?.total_net_pay} accent="dark" />
          </div>
          {result.errors?.length > 0 && (
            <div className="mt-4 max-h-52 overflow-auto rounded-xl border border-red-100 bg-white p-3 text-xs">
              {result.errors.map((e, i) => (
                <div key={i} className="py-0.5 text-red-800">
                  <b>{e.employee_id}</b>: {e.error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TAB 4 — RUNS & APPROVALS
   ============================================================ */

function RunsTab({ onSuccess, onError }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/payroll/runs");
      setList(getList(res, "data"));
    } catch (err) { onError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [onError]);

  useEffect(() => { load(); }, [load]);

  async function approve(id) {
    if (!confirm("Approve and lock this payroll run? This cannot be undone.")) return;
    setApproving(id);
    try {
      await api.post(`/api/v1/payroll/runs/${id}/approve`);
      onSuccess("Payroll run approved");
      load();
    } catch (err) { onError(getErrorMessage(err)); }
    finally { setApproving(null); }
  }

  async function openDetail(id) {
    try {
      const res = await api.get(`/api/v1/payroll/runs/${id}`);
      setDetail(res?.data ?? null);
    } catch (err) { onError(getErrorMessage(err)); }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Payroll Runs</h2>
            <p className="mt-1 text-sm text-slate-500">
              Approve a processed run to lock it. Once approved, individual rows cannot be changed.
            </p>
          </div>
          <button onClick={load} className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">Loading…</div>
        ) : list.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-sm text-slate-500">
            No payroll runs yet.
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Run</th>
                  <th className="px-4 py-3 text-left">Period</th>
                  <th className="px-4 py-3 text-right">Employees</th>
                  <th className="px-4 py-3 text-right">Gross</th>
                  <th className="px-4 py-3 text-right">Net</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((r) => {
                  const status = r.status || "draft";
                  const tone = RUN_STATUS_TONES[status] || "slate";
                  const canApprove = status === "processed" || status === "draft";
                  return (
                    <tr key={r.payroll_run_id}>
                      <td className="px-4 py-3 font-medium text-slate-800">{r.run_name}</td>
                      <td className="px-4 py-3 text-slate-600">{r.period_start} → {r.period_end}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.total_employees}</td>
                      <td className="px-4 py-3 text-right tabular-nums">₹ {inr(r.total_gross)}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">₹ {inr(r.total_net_pay)}</td>
                      <td className="px-4 py-3"><Pill tone={tone}>{status}</Pill></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openDetail(r.payroll_run_id)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">
                            View
                          </button>
                          {canApprove && (
                            <button onClick={() => approve(r.payroll_run_id)}
                              disabled={approving === r.payroll_run_id}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                              {approving === r.payroll_run_id ? "Approving…" : "Approve"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && <RunDetailModal detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function RunDetailModal({ detail, onClose }) {
  const run = detail.run || {};
  const employees = detail.employees || [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
      <div className="mb-10 w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">{run.run_name}</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {run.period_start} → {run.period_end} ·{" "}
              <Pill tone={RUN_STATUS_TONES[run.status] || "slate"}>{run.status}</Pill>
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        <div className="grid gap-3 border-b border-slate-100 bg-slate-50/50 p-5 sm:grid-cols-4">
          <InfoTile label="Employees" value={run.total_employees} />
          <InfoTile label="Total Gross" value={`₹ ${inr(run.total_gross)}`} />
          <InfoTile label="Total Deductions" value={`₹ ${inr(run.total_deductions)}`} />
          <InfoTile label="Total Net" value={`₹ ${inr(run.total_net_pay)}`} />
        </div>

        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-right">Days</th>
                <th className="px-4 py-2 text-right">Present</th>
                <th className="px-4 py-2 text-right">LOP</th>
                <th className="px-4 py-2 text-right">Earnings</th>
                <th className="px-4 py-2 text-right">Deductions</th>
                <th className="px-4 py-2 text-right">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((e) => (
                <tr key={e.payroll_id}>
                  <td className="px-4 py-2 font-mono text-xs">{e.employee_id}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{e.days_in_period}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{e.days_present}</td>
                  <td className={`px-4 py-2 text-right tabular-nums ${Number(e.lop_days) > 0 ? "text-red-700 font-semibold" : ""}`}>
                    {e.lop_days}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">₹ {inr(e.total_earnings)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">₹ {inr(e.total_deductions)}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-semibold">₹ {inr(e.net_pay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-5 py-3">
          <button onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB 5 — PAYSLIP (VIEW + GENERATE + DOWNLOAD)
   ============================================================ */

function PayslipTab({ employees, loadingEmployees, onError }) {
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);

  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((e) => {
      const hay = [getEmployeeName(e), getEmployeeId(e)].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [employees, search]);

  const selectedEmp = employees.find((e) => getEmployeeId(e) === employeeId);

  async function load() {
    if (!employeeId) return;
    setLoading(true);
    setPayslip(null);
    setGeneratedUrl(null);
    try {
      const res = await api.get(`/api/v1/payroll/payslip/${employeeId}`, {
        params: { year, month },
      });
      setPayslip(res?.data ?? null);
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function generatePdf() {
    if (!employeeId) return;
    setGenerating(true);
    setGeneratedUrl(null);
    try {
      const res = await api.post(
        `/api/v1/payroll/payslip/${employeeId}/generate`,
        null,
        { params: { year, month } }
      );
      const url = res?.data?.pdf_url;
      if (!url) throw new Error("No PDF URL returned");
      setGeneratedUrl(url);
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  function download() {
    if (!employeeId) return;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const url = `${base}/api/v1/payroll/payslip/${employeeId}/download?year=${year}&month=${month}`;
    window.open(url, "_blank");
  }

  const canAct = !!employeeId && !loading && !generating;

  return (
    <div className="space-y-5">
      {/* Setup panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Payslip</h2>
        <p className="mt-1 text-sm text-slate-500">
          View computed figures, generate a PDF into cloud storage, or download the payslip.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label>Employee *</Label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
            />
            <select
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setPayslip(null);
                setGeneratedUrl(null);
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
            >
              <option value="">
                {loadingEmployees ? "Loading…" : "— Select employee —"}
              </option>
              {filteredEmployees.map((emp) => {
                const id = getEmployeeId(emp);
                return (
                  <option key={id} value={id}>
                    {getEmployeeName(emp)} ({id})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <Label>Year</Label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Month</Label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
            >
              {MONTHS.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={load}
            disabled={!canAct}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? "Loading…" : "View Figures"}
          </button>
          <button
            type="button"
            onClick={generatePdf}
            disabled={!canAct}
            className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
          >
            {generating ? "Generating…" : "Generate PDF"}
          </button>
        </div>
      </div>

      {/* Generated PDF bar */}
      {generatedUrl && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Payslip generated
              </p>
              <p className="mt-0.5 text-xs text-emerald-700">
                {selectedEmp ? getEmployeeName(selectedEmp) : employeeId} ·{" "}
                {monthLabel(month)} {year}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={generatedUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
              >
                📄 Open PDF
              </a>
              <a
                href={generatedUrl}
                download
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                ⬇ Download
              </a>
              <button
                type="button"
                onClick={download}
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
              >
                🔁 Regenerate & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          Loading payslip…
        </div>
      )}

      {payslip && !loading && (
        <PayslipPanel
          payslip={payslip}
          employeeName={selectedEmp ? getEmployeeName(selectedEmp) : ""}
          employeeId={employeeId}
        />
      )}
    </div>
  );
}

function PayslipPanel({ payslip, employeeName, employeeId }) {
  const p = payslip.payroll || {};
  const earnings = payslip.earnings || [];
  const deductions = payslip.deductions || [];
  const employeeDeductions = deductions.filter((d) => !d.is_employer_contribution);
  const employerCont = deductions.filter((d) => d.is_employer_contribution);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Payslip</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{employeeName || employeeId}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {p.period_start} → {p.period_end}
                {p.pay_date ? ` · Paid ${p.pay_date}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <MoneyCard label="Net Pay" value={p.net_pay} accent="dark" compact />
              <MoneyCard label="Gross" value={p.total_earnings} accent="emerald" compact />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>Present: <b className="text-slate-700">{p.days_present ?? 0}</b> / {p.days_in_period ?? 0}</span>
            <span>Paid leaves: <b className="text-slate-700">{p.paid_leaves ?? 0}</b></span>
            <span>LOP: <b className="text-red-700">{p.lop_days ?? 0}</b></span>
            <span>Status: <b className="text-slate-700">{p.status}</b></span>
          </div>
        </div>

        <div className="grid gap-4 p-6 lg:grid-cols-2">
          <BreakdownTable title="Earnings"
            rows={earnings.map((e) => ({
              name: e.component_name || e.component_id,
              amount: e.calculated_amount,
            }))}
            tone="emerald" />
          <BreakdownTable title="Deductions"
            rows={employeeDeductions.map((d) => ({
              name: d.component_name || d.component_id,
              amount: d.amount,
            }))}
            tone="red" />
        </div>

        {employerCont.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6">
            <BreakdownTable title="Employer Contributions (not deducted)"
              rows={employerCont.map((d) => ({
                name: d.component_name || d.component_id,
                amount: d.amount,
              }))}
              tone="slate" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TINY UI
   ============================================================ */

function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-medium text-slate-600">{children}</label>;
}

function SegBtn({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-[#E42527] text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}>
      {children}
    </button>
  );
}

function Pill({ tone = "slate", children }) {
  const cls = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    slate: "bg-slate-100 text-slate-600",
  }[tone] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {String(children || "—").replace(/_/g, " ")}
    </span>
  );
}

function Stat({ label, value, tone = "slate" }) {
  const cls = {
    slate: "bg-white border-slate-200 text-slate-800",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-800",
    amber: "bg-amber-50 border-amber-100 text-amber-800",
    red: "bg-red-50 border-red-100 text-red-800",
    sky: "bg-sky-50 border-sky-100 text-sky-800",
    violet: "bg-violet-50 border-violet-100 text-violet-800",
    dark: "bg-slate-900 border-slate-900 text-white",
  }[tone] || "bg-white border-slate-200 text-slate-800";

  const labelCls =
    tone === "dark" ? "text-slate-300"
    : tone === "emerald" ? "text-emerald-600"
    : tone === "amber" ? "text-amber-600"
    : tone === "red" ? "text-red-600"
    : tone === "sky" ? "text-sky-600"
    : tone === "violet" ? "text-violet-600"
    : "text-slate-500";

  return (
    <div className={`rounded-xl border px-4 py-3 ${cls}`}>
      <p className={`text-[10px] font-medium uppercase tracking-wide ${labelCls}`}>{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value ?? 0}</p>
    </div>
  );
}

function MoneyCard({ label, value, accent = "slate", compact = false }) {
  const cls = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-800",
    red: "bg-red-50 border-red-100 text-red-800",
    slate: "bg-slate-50 border-slate-200 text-slate-800",
    dark: "bg-slate-900 border-slate-900 text-white",
  }[accent] || "bg-white border-slate-200 text-slate-800";

  const labelCls =
    accent === "dark" ? "text-slate-300"
    : accent === "emerald" ? "text-emerald-700"
    : accent === "red" ? "text-red-700"
    : "text-slate-500";

  return (
    <div className={`rounded-xl border ${compact ? "px-3 py-2" : "px-4 py-4"} ${cls}`}>
      <p className={`text-[10px] font-medium uppercase tracking-wide ${labelCls}`}>{label}</p>
      <p className={`mt-1 font-semibold tabular-nums ${compact ? "text-sm" : "text-xl"}`}>
        ₹ {inr(value)}
      </p>
    </div>
  );
}

function SummaryCard({ label, value, prefix = "", accent = "red" }) {
  const tone = {
    red: "bg-white border-slate-200",
    emerald: "bg-emerald-50 border-emerald-100",
    slate: "bg-slate-900 text-white border-slate-900",
  }[accent] || "bg-white border-slate-200";

  const labelTone = accent === "slate" ? "text-slate-300" : "text-slate-500";
  const valueTone = accent === "emerald" ? "text-emerald-700"
    : accent === "slate" ? "text-white" : "text-slate-900";

  const num = Number(value || 0);
  const display = prefix ? `${prefix} ${inr(num)}` : num;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${tone}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${labelTone}`}>{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueTone}`}>{display}</p>
    </div>
  );
}

function InfoTile({ label, value, mono = false }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 truncate text-sm font-medium text-slate-800 ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}

function BreakdownTable({ title, rows, tone = "slate" }) {
  const toneCls = {
    emerald: "text-emerald-700",
    red: "text-red-600",
    slate: "text-slate-700",
  }[tone];

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      </div>
      {rows.length === 0 ? (
        <div className="px-4 py-8 text-center text-xs text-slate-400">None</div>
      ) : (
        <table className="min-w-full text-sm">
          <tbody className="divide-y divide-slate-50">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-2 text-slate-700">{r.name || "—"}</td>
                <td className={`px-4 py-2 text-right font-semibold tabular-nums ${toneCls}`}>
                  ₹ {inr(r.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-100 bg-slate-50/70">
              <td className="px-4 py-2 text-xs font-semibold text-slate-700">Total</td>
              <td className={`px-4 py-2 text-right text-xs font-semibold tabular-nums ${toneCls}`}>
                ₹ {inr(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}