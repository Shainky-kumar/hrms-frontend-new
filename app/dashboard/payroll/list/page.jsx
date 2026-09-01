"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

// ---------------------------------------------
// Matches backend:
//   GET  /api/v1/payroll/list?year&month&status&page&page_size
//   POST /api/v1/payroll/run          (schemas.RunPayrollRequest)
//   POST /api/v1/payroll/approve      (schemas.ApprovePayrollRequest)
//   POST /api/v1/payroll/mark-paid/{payroll_id}
//   GET  /api/v1/payroll/payslips/{payslip_id}
// Status values match schemas.PayrollStatusEnum exactly.
// ---------------------------------------------

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "processing", label: "Processing" },
  { value: "processed", label: "Processed" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "void", label: "Void" },
  { value: "locked", label: "Locked" },
];

const STATUS_STYLES = {
  paid: "bg-green-50 text-green-700",
  approved: "bg-blue-50 text-blue-700",
  processed: "bg-indigo-50 text-indigo-700",
  processing: "bg-yellow-50 text-yellow-700",
  draft: "bg-gray-100 text-gray-600",
  failed: "bg-red-50 text-red-700",
  void: "bg-gray-100 text-gray-500",
  locked: "bg-purple-50 text-purple-700",
};

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function toArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export default function PayrollListPage() {
  const now = new Date();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [status, setStatus] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [runLoading, setRunLoading] = useState(false);
  const [bulkApproving, setBulkApproving] = useState(false);
  const [payslip, setPayslip] = useState(null);
  const [payslipLoading, setPayslipLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    setError("");
    setSelectedIds([]);
    try {
      const params = { year: Number(year), month: Number(month), page: 1, page_size: 50 };
      if (status) params.status = status;
      const res = await api.get("/api/v1/payroll/list", { params });
      setList(toArray(res?.data ?? res));
    } catch (err) {
      setError(getErrorMessage(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRunPayroll() {
    setRunLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/payroll/run", {
        year: Number(year),
        month: Number(month),
        run_name: `${new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })} ${year} Payroll`,
      });
      setSuccess("Payroll run started for the selected period");
      await fetchList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRunLoading(false);
    }
  }

  async function handleApprove(payrollIds) {
    const ids = Array.isArray(payrollIds) ? payrollIds : [payrollIds];
    setActionLoading(ids[0]);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/payroll/approve", { payroll_ids: ids });
      setSuccess(`${ids.length} payroll${ids.length > 1 ? "s" : ""} approved`);
      await fetchList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
      setBulkApproving(false);
    }
  }

  async function handlePay(payrollId) {
    setActionLoading(payrollId);
    setError("");
    setSuccess("");
    try {
      await api.post(`/api/v1/payroll/mark-paid/${payrollId}`);
      setSuccess("Payroll marked as paid");
      await fetchList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleViewPayslip(payslipId) {
    if (!payslipId) return;
    setPayslipLoading(true);
    setError("");
    setPayslip(null);
    try {
      const res = await api.get(`/api/v1/payroll/payslips/${payslipId}`);
      setPayslip(res?.data ?? res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPayslipLoading(false);
    }
  }

  function toggleSelect(payrollId) {
    setSelectedIds((prev) =>
      prev.includes(payrollId) ? prev.filter((id) => id !== payrollId) : [...prev, payrollId]
    );
  }

  function toggleSelectAllProcessed() {
    const processedIds = list.filter((r) => r.status === "processed").map((r) => r.payroll_id);
    const allSelected = processedIds.length > 0 && processedIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : processedIds);
  }

  const processedRows = list.filter((r) => r.status === "processed");

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Payroll List</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Run, approve and mark payroll as paid</p>
        </div>
        <button
          onClick={handleRunPayroll}
          disabled={runLoading}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
        >
          {runLoading ? "Running..." : `Run Payroll — ${new Date(2000, month - 1, 1).toLocaleString("default", { month: "short" })} ${year}`}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-24 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
          placeholder="Year"
        />
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString("default", { month: "short" })}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button onClick={fetchList} className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb]">
          Filter
        </button>

        {selectedIds.length > 0 && (
          <button
            onClick={() => handleApprove(selectedIds)}
            disabled={bulkApproving}
            className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {bulkApproving ? "Approving..." : `Approve Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">No payroll records found. Try running payroll for this period.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={processedRows.length > 0 && processedRows.every((r) => selectedIds.includes(r.payroll_id))}
                      onChange={toggleSelectAllProcessed}
                      disabled={processedRows.length === 0}
                    />
                  </th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Period</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Present / LOP</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Earnings</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Deductions</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Net Pay</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((row) => (
                  <tr key={row.payroll_id} className="hover:bg-[#fafafa]">
                    <td className="px-3 py-3.5">
                      {row.status === "processed" && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.payroll_id)}
                          onChange={() => toggleSelect(row.payroll_id)}
                        />
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-medium">{row.employee_id}</td>
                    <td className="px-5 py-3.5 text-[#6b7280]">
                      {row.pay_period_start} → {row.pay_period_end}
                    </td>
                    <td className="px-5 py-3.5 text-[#6b7280]">
                      {row.days_present} / {row.lop_days}
                    </td>
                    <td className="px-5 py-3.5">₹ {Number(row.total_earnings || 0).toFixed(2)}</td>
                    <td className="px-5 py-3.5">₹ {Number(row.total_deductions || 0).toFixed(2)}</td>
                    <td className="px-5 py-3.5 font-semibold">₹ {Number(row.net_pay || 0).toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-500"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-2">
                        {row.status === "processed" && (
                          <button
                            disabled={actionLoading === row.payroll_id}
                            onClick={() => handleApprove(row.payroll_id)}
                            className="rounded bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {row.status === "approved" && (
                          <button
                            disabled={actionLoading === row.payroll_id}
                            onClick={() => handlePay(row.payroll_id)}
                            className="rounded bg-green-600 px-2.5 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        )}
                        {row.payslip_id && (
                          <button
                            onClick={() => handleViewPayslip(row.payslip_id)}
                            className="rounded border border-[#d1d5db] px-2.5 py-1 text-xs hover:bg-[#f9fafb]"
                          >
                            Payslip
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(payslipLoading || payslip) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">Payslip</h2>
              <button onClick={() => setPayslip(null)} className="text-[#6b7280] hover:text-[#1a1a1a]">✕</button>
            </div>
            <div className="p-5">
              {payslipLoading ? (
                <div className="py-10 text-center text-sm text-[#6b7280]">Loading payslip...</div>
              ) : (
                <div className="space-y-3 text-sm">
                  <p><span className="text-[#6b7280]">Employee:</span> {payslip.employee_id}</p>
                  <p><span className="text-[#6b7280]">Issue Date:</span> {payslip.issue_date}</p>
                  {payslip.pdf_url && (
                    <a href={payslip.pdf_url} target="_blank" rel="noreferrer" className="inline-block rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]">
                      Download PDF
                    </a>
                  )}
                  {payslip.snapshot_json && (
                    <pre className="mt-3 overflow-x-auto rounded-md bg-[#f9fafb] p-3 text-xs text-[#374151]">
                      {JSON.stringify(payslip.snapshot_json, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}