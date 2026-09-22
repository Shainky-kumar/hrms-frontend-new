// "use client";

// import { useState } from "react";
// import { api } from "@/app/lib/api";

// // ---------------------------------------------
// // Matches backend:
// //   POST /api/v1/payroll/run
// // Body matches schemas.RunPayrollRequest exactly.
// // ---------------------------------------------

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// }

// export default function RunPayrollPage() {
//   const now = new Date();
//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [runName, setRunName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   async function handleRun(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setResult(null);
//     try {
//       const res = await api.post("/api/v1/payroll/run", {
//         year: Number(year),
//         month: Number(month),
//         run_name: runName || null,
//       });
//       setResult(res?.data ?? res);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   const defaultRunName = `${new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })} ${year} Payroll`;

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Run Payroll</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">Process monthly payroll for all active employees</p>
//       </div>

//       <div className="max-w-lg rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//         <form onSubmit={handleRun} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1 block text-sm font-medium">Year</label>
//               <input
//                 type="number"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium">Month</label>
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               >
//                 {Array.from({ length: 12 }, (_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {new Date(2000, i, 1).toLocaleString("default", { month: "long" })}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium">Run Name (optional)</label>
//             <input
//               value={runName}
//               onChange={(e) => setRunName(e.target.value)}
//               placeholder={defaultRunName}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//           </div>

//           {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//           >
//             {loading ? "Processing..." : "Run Payroll"}
//           </button>
//         </form>

//         {result && (
//           <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm">
//             <p className="font-medium text-green-800">Payroll completed</p>
//             <p className="mt-1 text-green-700">Created: {result.created_count ?? 0}</p>
//             <p className="text-green-700">Errors: {result.error_count ?? 0}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";

/* ================= HELPERS ================= */

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission. Contact Payroll Officer/Admin.";
  if (err?.response?.status === 404) return "Not found.";
  return err?.message || "Something went wrong";
}

function formatMoney(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "₹ 0.00";
  return `₹ ${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
}));

/* ================= COMPONENT ================= */

export default function RunPayrollPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [runName, setRunName] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const monthLabel = useMemo(
    () => MONTHS.find((m) => m.value === Number(month))?.label || "",
    [month]
  );

  const defaultRunName = `${monthLabel} ${year} Payroll`;

  /* ---------- Validation ---------- */
  const yearNum = Number(year);
  const yearError =
    !Number.isFinite(yearNum) || yearNum < 2000 || yearNum > 2100
      ? "Year must be between 2000 and 2100"
      : null;

  /* ---------- Run ---------- */
  async function handleRun(e) {
    e.preventDefault();

    if (yearError) {
      setError(yearError);
      return;
    }

    const confirmed = window.confirm(
      `Run payroll for ${monthLabel} ${yearNum}?\n\n` +
        `This will process payroll for all eligible employees. ` +
        `It cannot be run twice for the same period.`
    );
    if (!confirmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/api/v1/payroll/run", {
        year: yearNum,
        month: Number(month),
        run_name: runName.trim() || null,
      });

      setResult(res?.data ?? res);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes("already run")) {
        setError(
          "Payroll has already been run for this period. " +
            "View it in the Payroll List page to continue."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  function resetResult() {
    setResult(null);
    setError("");
    setRunName("");
  }

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Run Payroll</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Process monthly payroll for all active employees
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ============== LEFT: FORM ============== */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <form onSubmit={handleRun} className="space-y-5">
              {/* Year + Month */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#374151]">
                    Year
                  </label>
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none ${
                      yearError
                        ? "border-red-300 focus:border-red-500"
                        : "border-[#d1d5db] focus:border-[#E42527]"
                    }`}
                  />
                  {yearError && (
                    <p className="mt-1 text-xs text-red-600">{yearError}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#374151]">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Run Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-[#374151]">
                  Run Name{" "}
                  <span className="font-normal text-[#6b7280]">(optional)</span>
                </label>
                <input
                  value={runName}
                  onChange={(e) => setRunName(e.target.value)}
                  placeholder={defaultRunName}
                  className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#6b7280]">
                  Default: <span className="font-medium">{defaultRunName}</span>
                </p>
              </div>

              {/* Warning */}
              <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                <p className="font-medium">Before you run:</p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  <li>All active employees must have an active salary structure</li>
                  <li>Attendance for the period should be finalized</li>
                  <li>Payroll cannot be run twice for the same period</li>
                </ul>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                  <div className="flex items-start justify-between gap-3">
                    <span>{error}</span>
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                  {error.toLowerCase().includes("already run") && (
                    <Link
                      href="/payroll/list"
                      className="mt-2 inline-block text-xs font-medium text-red-700 underline hover:text-red-900"
                    >
                      → Go to Payroll List
                    </Link>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={resetResult}
                  disabled={loading}
                  className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading || !!yearError}
                  className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {loading ? "Processing…" : "Run Payroll"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ============== RIGHT: SUMMARY / RESULT ============== */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center py-8 text-center text-sm text-[#6b7280]">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
                <p className="font-medium text-[#1a1a1a]">Processing payroll…</p>
                <p className="mt-1 text-xs">
                  This may take a minute for {monthLabel} {year}
                </p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Result card */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-green-800">
                    ✓ Payroll completed
                  </p>
                  <button
                    type="button"
                    onClick={resetResult}
                    className="text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-white/60 px-3 py-2">
                    <dt className="text-xs text-green-700">Created</dt>
                    <dd className="mt-0.5 font-semibold text-green-900">
                      {result.created_count ?? 0}
                    </dd>
                  </div>
                  <div className="rounded-md bg-white/60 px-3 py-2">
                    <dt className="text-xs text-green-700">Errors</dt>
                    <dd
                      className={`mt-0.5 font-semibold ${
                        (result.error_count ?? 0) > 0
                          ? "text-red-700"
                          : "text-green-900"
                      }`}
                    >
                      {result.error_count ?? 0}
                    </dd>
                  </div>
                </dl>

                {/* Money summary */}
                {result.summary && (
                  <div className="mt-3 space-y-1.5 text-sm">
                    <Row
                      label="Total Gross"
                      value={formatMoney(result.summary.total_gross)}
                    />
                    <Row
                      label="Total Deductions"
                      value={formatMoney(result.summary.total_deductions)}
                    />
                    <Row
                      label="Total Net Pay"
                      value={formatMoney(result.summary.total_net_pay)}
                      strong
                    />
                    {result.summary.total_employer_contribution != null && (
                      <Row
                        label="Employer Contribution"
                        value={formatMoney(
                          result.summary.total_employer_contribution
                        )}
                      />
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/payroll/list"
                    className="rounded-md bg-[#E42527] px-4 py-2 text-xs font-medium text-white hover:bg-[#c91f21]"
                  >
                    View Payroll List →
                  </Link>
                </div>
              </div>

              {/* Errors list */}
              {Array.isArray(result.errors) && result.errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">
                    Errors ({result.errors.length})
                  </h3>
                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {result.errors.map((e, i) => (
                      <div
                        key={i}
                        className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs"
                      >
                        <p className="font-mono font-medium text-red-800">
                          {e.employee_id}
                        </p>
                        <p className="mt-0.5 text-red-700">{e.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !result && (
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-[#1a1a1a]">
                How it works
              </h3>
              <ol className="space-y-2 text-xs text-[#6b7280]">
                <li className="flex gap-2">
                  <span className="font-semibold text-[#1a1a1a]">1.</span>
                  <span>Select year and month</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-[#1a1a1a]">2.</span>
                  <span>Click Run Payroll — system processes each eligible employee</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-[#1a1a1a]">3.</span>
                  <span>
                    Review created payrolls and any errors, then approve from Payroll List
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-[#1a1a1a]">4.</span>
                  <span>Mark as paid to generate payslips</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENT ================= */

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between border-t border-green-200/60 pt-1.5 first:border-t-0 first:pt-0">
      <span className="text-xs text-green-700">{label}</span>
      <span
        className={`text-sm ${
          strong ? "font-bold text-green-900" : "font-medium text-green-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}