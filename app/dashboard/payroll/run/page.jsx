"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";

// ---------------------------------------------
// Matches backend:
//   POST /api/v1/payroll/run
// Body matches schemas.RunPayrollRequest exactly.
// ---------------------------------------------

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

export default function RunPayrollPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [runName, setRunName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleRun(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post("/api/v1/payroll/run", {
        year: Number(year),
        month: Number(month),
        run_name: runName || null,
      });
      setResult(res?.data ?? res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const defaultRunName = `${new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })} ${year} Payroll`;

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Run Payroll</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Process monthly payroll for all active employees</p>
      </div>

      <div className="max-w-lg rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <form onSubmit={handleRun} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Run Name (optional)</label>
            <input
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
              placeholder={defaultRunName}
              className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
            />
          </div>

          {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
          >
            {loading ? "Processing..." : "Run Payroll"}
          </button>
        </form>

        {result && (
          <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm">
            <p className="font-medium text-green-800">Payroll completed</p>
            <p className="mt-1 text-green-700">Created: {result.created_count ?? 0}</p>
            <p className="text-green-700">Errors: {result.error_count ?? 0}</p>
          </div>
        )}
      </div>
    </div>
  );
}