// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

// // ---------------------------------------------
// // Matches backend:
// //   GET  /api/v1/payroll/list?year&month&status&page&page_size
// //   POST /api/v1/payroll/run          (schemas.RunPayrollRequest)
// //   POST /api/v1/payroll/approve      (schemas.ApprovePayrollRequest)
// //   POST /api/v1/payroll/mark-paid/{payroll_id}
// //   GET  /api/v1/payroll/payslips/{payslip_id}
// // Status values match schemas.PayrollStatusEnum exactly.
// // ---------------------------------------------

// const STATUS_OPTIONS = [
//   { value: "", label: "All Status" },
//   { value: "draft", label: "Draft" },
//   { value: "processing", label: "Processing" },
//   { value: "processed", label: "Processed" },
//   { value: "approved", label: "Approved" },
//   { value: "paid", label: "Paid" },
//   { value: "failed", label: "Failed" },
//   { value: "void", label: "Void" },
//   { value: "locked", label: "Locked" },
// ];

// const STATUS_STYLES = {
//   paid: "bg-green-50 text-green-700",
//   approved: "bg-blue-50 text-blue-700",
//   processed: "bg-indigo-50 text-indigo-700",
//   processing: "bg-yellow-50 text-yellow-700",
//   draft: "bg-gray-100 text-gray-600",
//   failed: "bg-red-50 text-red-700",
//   void: "bg-gray-100 text-gray-500",
//   locked: "bg-purple-50 text-purple-700",
// };

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// }

// function toArray(payload) {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;
//   if (Array.isArray(payload?.data)) return payload.data;
//   return [];
// }

// export default function PayrollListPage() {
//   const now = new Date();
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [status, setStatus] = useState("");

//   const [selectedIds, setSelectedIds] = useState([]);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [runLoading, setRunLoading] = useState(false);
//   const [bulkApproving, setBulkApproving] = useState(false);
//   const [payslip, setPayslip] = useState(null);
//   const [payslipLoading, setPayslipLoading] = useState(false);

//   useEffect(() => {
//     fetchList();
//   }, []);

//   async function fetchList() {
//     setLoading(true);
//     setError("");
//     setSelectedIds([]);
//     try {
//       const params = { year: Number(year), month: Number(month), page: 1, page_size: 50 };
//       if (status) params.status = status;
//       const res = await api.get("/api/v1/payroll/list", { params });
//       setList(toArray(res?.data ?? res));
//     } catch (err) {
//       setError(getErrorMessage(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleRunPayroll() {
//     setRunLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/payroll/run", {
//         year: Number(year),
//         month: Number(month),
//         run_name: `${new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })} ${year} Payroll`,
//       });
//       setSuccess("Payroll run started for the selected period");
//       await fetchList();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setRunLoading(false);
//     }
//   }

//   async function handleApprove(payrollIds) {
//     const ids = Array.isArray(payrollIds) ? payrollIds : [payrollIds];
//     setActionLoading(ids[0]);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/payroll/approve", { payroll_ids: ids });
//       setSuccess(`${ids.length} payroll${ids.length > 1 ? "s" : ""} approved`);
//       await fetchList();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setActionLoading(null);
//       setBulkApproving(false);
//     }
//   }

//   async function handlePay(payrollId) {
//     setActionLoading(payrollId);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post(`/api/v1/payroll/mark-paid/${payrollId}`);
//       setSuccess("Payroll marked as paid");
//       await fetchList();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setActionLoading(null);
//     }
//   }

//   async function handleViewPayslip(payslipId) {
//     if (!payslipId) return;
//     setPayslipLoading(true);
//     setError("");
//     setPayslip(null);
//     try {
//       const res = await api.get(`/api/v1/payroll/payslips/${payslipId}`);
//       setPayslip(res?.data ?? res);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPayslipLoading(false);
//     }
//   }

//   function toggleSelect(payrollId) {
//     setSelectedIds((prev) =>
//       prev.includes(payrollId) ? prev.filter((id) => id !== payrollId) : [...prev, payrollId]
//     );
//   }

//   function toggleSelectAllProcessed() {
//     const processedIds = list.filter((r) => r.status === "processed").map((r) => r.payroll_id);
//     const allSelected = processedIds.length > 0 && processedIds.every((id) => selectedIds.includes(id));
//     setSelectedIds(allSelected ? [] : processedIds);
//   }

//   const processedRows = list.filter((r) => r.status === "processed");

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Payroll List</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">Run, approve and mark payroll as paid</p>
//         </div>
//         <button
//           onClick={handleRunPayroll}
//           disabled={runLoading}
//           className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//         >
//           {runLoading ? "Running..." : `Run Payroll — ${new Date(2000, month - 1, 1).toLocaleString("default", { month: "short" })} ${year}`}
//         </button>
//       </div>

//       <div className="mb-4 flex flex-wrap items-center gap-3">
//         <input
//           type="number"
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           className="w-24 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//           placeholder="Year"
//         />
//         <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
//           {Array.from({ length: 12 }, (_, i) => (
//             <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString("default", { month: "short" })}</option>
//           ))}
//         </select>
//         <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
//           {STATUS_OPTIONS.map((s) => (
//             <option key={s.value} value={s.value}>{s.label}</option>
//           ))}
//         </select>
//         <button onClick={fetchList} className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb]">
//           Filter
//         </button>

//         {selectedIds.length > 0 && (
//           <button
//             onClick={() => handleApprove(selectedIds)}
//             disabled={bulkApproving}
//             className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
//           >
//             {bulkApproving ? "Approving..." : `Approve Selected (${selectedIds.length})`}
//           </button>
//         )}
//       </div>

//       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
//       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         {loading ? (
//           <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//         ) : list.length === 0 ? (
//           <div className="py-16 text-center text-sm text-[#6b7280]">No payroll records found. Try running payroll for this period.</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-3 py-3">
//                     <input
//                       type="checkbox"
//                       checked={processedRows.length > 0 && processedRows.every((r) => selectedIds.includes(r.payroll_id))}
//                       onChange={toggleSelectAllProcessed}
//                       disabled={processedRows.length === 0}
//                     />
//                   </th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Period</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Present / LOP</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Earnings</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Deductions</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Net Pay</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((row) => (
//                   <tr key={row.payroll_id} className="hover:bg-[#fafafa]">
//                     <td className="px-3 py-3.5">
//                       {row.status === "processed" && (
//                         <input
//                           type="checkbox"
//                           checked={selectedIds.includes(row.payroll_id)}
//                           onChange={() => toggleSelect(row.payroll_id)}
//                         />
//                       )}
//                     </td>
//                     <td className="px-5 py-3.5 font-medium">{row.employee_id}</td>
//                     <td className="px-5 py-3.5 text-[#6b7280]">
//                       {row.pay_period_start} → {row.pay_period_end}
//                     </td>
//                     <td className="px-5 py-3.5 text-[#6b7280]">
//                       {row.days_present} / {row.lop_days}
//                     </td>
//                     <td className="px-5 py-3.5">₹ {Number(row.total_earnings || 0).toFixed(2)}</td>
//                     <td className="px-5 py-3.5">₹ {Number(row.total_deductions || 0).toFixed(2)}</td>
//                     <td className="px-5 py-3.5 font-semibold">₹ {Number(row.net_pay || 0).toFixed(2)}</td>
//                     <td className="px-5 py-3.5">
//                       <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-500"}`}>
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <div className="flex flex-wrap gap-2">
//                         {row.status === "processed" && (
//                           <button
//                             disabled={actionLoading === row.payroll_id}
//                             onClick={() => handleApprove(row.payroll_id)}
//                             className="rounded bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
//                           >
//                             Approve
//                           </button>
//                         )}
//                         {row.status === "approved" && (
//                           <button
//                             disabled={actionLoading === row.payroll_id}
//                             onClick={() => handlePay(row.payroll_id)}
//                             className="rounded bg-green-600 px-2.5 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
//                           >
//                             Mark Paid
//                           </button>
//                         )}
//                         {row.payslip_id && (
//                           <button
//                             onClick={() => handleViewPayslip(row.payslip_id)}
//                             className="rounded border border-[#d1d5db] px-2.5 py-1 text-xs hover:bg-[#f9fafb]"
//                           >
//                             Payslip
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {(payslipLoading || payslip) && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b px-5 py-4">
//               <h2 className="text-lg font-semibold">Payslip</h2>
//               <button onClick={() => setPayslip(null)} className="text-[#6b7280] hover:text-[#1a1a1a]">✕</button>
//             </div>
//             <div className="p-5">
//               {payslipLoading ? (
//                 <div className="py-10 text-center text-sm text-[#6b7280]">Loading payslip...</div>
//               ) : (
//                 <div className="space-y-3 text-sm">
//                   <p><span className="text-[#6b7280]">Employee:</span> {payslip.employee_id}</p>
//                   <p><span className="text-[#6b7280]">Issue Date:</span> {payslip.issue_date}</p>
//                   {payslip.pdf_url && (
//                     <a href={payslip.pdf_url} target="_blank" rel="noreferrer" className="inline-block rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]">
//                       Download PDF
//                     </a>
//                   )}
//                   {payslip.snapshot_json && (
//                     <pre className="mt-3 overflow-x-auto rounded-md bg-[#f9fafb] p-3 text-xs text-[#374151]">
//                       {JSON.stringify(payslip.snapshot_json, null, 2)}
//                     </pre>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ================= CONSTANTS ================= */

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

const PAGE_SIZE = 20;

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

function pickList(response) {
  const body = response?.data ?? {};
  const list = body?.data ?? body?.items ?? body?.results ?? [];
  return Array.isArray(list) ? list : [];
}

function pickTotal(response) {
  const raw = response?.data?.total ?? response?.data?.count;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

function formatMoney(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "₹ 0.00";
  return `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ================= COMPONENT ================= */

export default function PayrollListPage() {
  const now = new Date();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [runLoading, setRunLoading] = useState(false);
  const [bulkApproving, setBulkApproving] = useState(false);

  const [payslip, setPayslip] = useState(null);
  const [payslipLoading, setPayslipLoading] = useState(false);

  /* ---------- Fetch ---------- */
  const fetchList = useCallback(async () => {
    // Guard invalid year
    const y = Number(year);
    if (!Number.isFinite(y) || y < 2000 || y > 2100) {
      setError("Please enter a valid year (2000-2100)");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setSelectedIds([]);

    try {
      const params = {
        year: y,
        month: Number(month),
        page,
        page_size: PAGE_SIZE,
      };
      if (status) params.status = status;

      const res = await api.get("/api/v1/payroll/list", { params });
      setList(pickList(res));
      setTotal(pickTotal(res));
    } catch (err) {
      setError(getErrorMessage(err));
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [year, month, status, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /* ---------- Auto-dismiss success ---------- */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  /* ---------- Actions ---------- */
  async function handleRunPayroll() {
    const y = Number(year);
    if (!Number.isFinite(y)) {
      setError("Invalid year");
      return;
    }

    const monthName = new Date(2000, Number(month) - 1, 1).toLocaleString("default", { month: "long" });

    if (!window.confirm(`Run payroll for ${monthName} ${y}? This will process all eligible employees.`)) {
      return;
    }

    setRunLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/api/v1/payroll/run", {
        year: y,
        month: Number(month),
        run_name: `${monthName} ${y} Payroll`,
      });

      const data = res?.data ?? {};
      const created = data?.created_count ?? 0;
      const errCount = data?.error_count ?? 0;

      let msg = `Payroll run complete: ${created} processed`;
      if (errCount > 0) msg += `, ${errCount} failed`;

      // Show top 3 errors
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const errsPreview = data.errors
          .slice(0, 3)
          .map((e) => `${e.employee_id}: ${e.error}`)
          .join(" • ");
        msg += ` — ${errsPreview}`;
      }

      setSuccess(msg);
      setPage(1);
      await fetchList();
    } catch (err) {
      const msg = getErrorMessage(err);
      // Better duplicate run message
      if (msg.toLowerCase().includes("already run")) {
        setError("Payroll already processed for this period. Use Refresh to see existing records.");
      } else {
        setError(msg);
      }
    } finally {
      setRunLoading(false);
    }
  }

  async function handleApprove(payrollIds) {
    const ids = Array.isArray(payrollIds) ? payrollIds : [payrollIds];
    if (ids.length === 0) return;

    setActionLoading(ids[0]);
    if (ids.length > 1) setBulkApproving(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/api/v1/payroll/approve", { payroll_ids: ids });
      const approvedCount = res?.data?.approved_count ?? ids.length;
      setSuccess(`${approvedCount} payroll${approvedCount > 1 ? "s" : ""} approved`);
      await fetchList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
      setBulkApproving(false);
    }
  }

  async function handlePay(payrollId) {
    if (!window.confirm("Mark this payroll as paid? Payslip will be generated.")) return;

    setActionLoading(payrollId);
    setError("");
    setSuccess("");

    try {
      const res = await api.post(`/api/v1/payroll/mark-paid/${payrollId}`);
      const payslipId = res?.data?.payslip_id;
      setSuccess(
        payslipId
          ? `Payroll marked as paid. Payslip generated.`
          : "Payroll marked as paid"
      );
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
    setPayslip(null);
    setError("");

    try {
      const res = await api.get(`/api/v1/payroll/payslips/${payslipId}`);
      setPayslip(res?.data ?? res);
    } catch (err) {
      setError(getErrorMessage(err));
      setPayslip(null);
    } finally {
      setPayslipLoading(false);
    }
  }

  function closePayslip() {
    setPayslip(null);
    setPayslipLoading(false);
  }

  function toggleSelect(payrollId) {
    setSelectedIds((prev) =>
      prev.includes(payrollId) ? prev.filter((id) => id !== payrollId) : [...prev, payrollId]
    );
  }

  function toggleSelectAllProcessed() {
    const processedIds = list
      .filter((r) => r.status === "processed")
      .map((r) => r.payroll_id);
    const allSelected =
      processedIds.length > 0 && processedIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : processedIds);
  }

  /* ---------- Derived ---------- */
  const processedRows = useMemo(
    () => list.filter((r) => r.status === "processed"),
    [list]
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const monthLabel = new Date(2000, Number(month) - 1, 1).toLocaleString("default", { month: "short" });

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Payroll List</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Run, approve and mark payroll as paid
          </p>
        </div>
        <button
          type="button"
          onClick={handleRunPayroll}
          disabled={runLoading}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
        >
          {runLoading ? "Running…" : `Run Payroll — ${monthLabel} ${year}`}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="number"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setPage(1);
          }}
          min={2000}
          max={2100}
          className="w-24 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
          placeholder="Year"
        />

        <select
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i, 1).toLocaleString("default", { month: "short" })}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={fetchList}
          className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb]"
        >
          Refresh
        </button>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => handleApprove(selectedIds)}
            disabled={bulkApproving}
            className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {bulkApproving ? "Approving…" : `Approve Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      {/* Banners */}
      {error && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} className="text-green-500 hover:text-green-700">
            ✕
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">Loading…</div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">
            No payroll records found for {monthLabel} {year}. Try running payroll.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={
                        processedRows.length > 0 &&
                        processedRows.every((r) => selectedIds.includes(r.payroll_id))
                      }
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
                {list.map((row) => {
                  const id = row.payroll_id;
                  const rowStatus = row.status;

                  return (
                    <tr key={id} className="hover:bg-[#fafafa]">
                      <td className="px-3 py-3.5">
                        {rowStatus === "processed" && (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(id)}
                            onChange={() => toggleSelect(id)}
                          />
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-medium">{row.employee_id}</td>
                      <td className="px-5 py-3.5 text-[#6b7280]">
                        {formatDate(row.pay_period_start)} → {formatDate(row.pay_period_end)}
                      </td>
                      <td className="px-5 py-3.5 text-[#6b7280]">
                        {row.days_present ?? 0} / {row.lop_days ?? 0}
                      </td>
                      <td className="px-5 py-3.5">{formatMoney(row.total_earnings)}</td>
                      <td className="px-5 py-3.5">{formatMoney(row.total_deductions)}</td>
                      <td className="px-5 py-3.5 font-semibold">{formatMoney(row.net_pay)}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            STATUS_STYLES[rowStatus] || "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {rowStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-2">
                          {rowStatus === "processed" && (
                            <button
                              type="button"
                              disabled={actionLoading === id}
                              onClick={() => handleApprove(id)}
                              className="rounded bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              {actionLoading === id ? "…" : "Approve"}
                            </button>
                          )}
                          {rowStatus === "approved" && (
                            <button
                              type="button"
                              disabled={actionLoading === id}
                              onClick={() => handlePay(id)}
                              className="rounded bg-green-600 px-2.5 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              {actionLoading === id ? "…" : "Mark Paid"}
                            </button>
                          )}
                          {/* Payslip button only when row has payslip_id (backend may not provide) */}
                          {row.payslip_id && (
                            <button
                              type="button"
                              onClick={() => handleViewPayslip(row.payslip_id)}
                              className="rounded border border-[#d1d5db] px-2.5 py-1 text-xs hover:bg-[#f9fafb]"
                            >
                              Payslip
                            </button>
                          )}
                          {/* Fallback: show "No Payslip" only when PAID */}
                          {rowStatus === "paid" && !row.payslip_id && (
                            <span className="text-xs text-[#6b7280]">Payslip ready in ESS</span>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3">
            <span className="text-sm text-[#6b7280]">
              Page <strong>{page}</strong> of {totalPages} — {total} records
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payslip Modal */}
      {(payslipLoading || payslip) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">Payslip</h2>
              <button
                type="button"
                onClick={closePayslip}
                className="text-[#6b7280] hover:text-[#1a1a1a]"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              {payslipLoading ? (
                <div className="py-10 text-center text-sm text-[#6b7280]">
                  Loading payslip…
                </div>
              ) : payslip ? (
                <div className="space-y-4 text-sm">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-[#f9fafb] px-3 py-2">
                      <p className="text-xs text-[#6b7280]">Employee</p>
                      <p className="mt-1 font-medium">{payslip.employee_id ?? "—"}</p>
                    </div>
                    <div className="rounded-lg bg-[#f9fafb] px-3 py-2">
                      <p className="text-xs text-[#6b7280]">Issue Date</p>
                      <p className="mt-1 font-medium">
                        {formatDate(payslip.issue_date)}
                      </p>
                    </div>
                    {payslip.payslip_id && (
                      <div className="rounded-lg bg-[#f9fafb] px-3 py-2">
                        <p className="text-xs text-[#6b7280]">Payslip ID</p>
                        <p className="mt-1 font-mono text-xs">
                          {payslip.payslip_id}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Snapshot Earnings */}
                  {payslip.snapshot_json?.earnings?.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-[#1a1a1a]">
                        Earnings
                      </h3>
                      <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-[#f3f4f6]">
                            {payslip.snapshot_json.earnings.map((e, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 text-[#6b7280]">
                                  {e.component_id}
                                </td>
                                <td className="px-3 py-2 text-right font-medium">
                                  {formatMoney(e.amount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Snapshot Deductions */}
                  {payslip.snapshot_json?.deductions?.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-[#1a1a1a]">
                        Deductions
                      </h3>
                      <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-[#f3f4f6]">
                            {payslip.snapshot_json.deductions.map((d, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 text-[#6b7280]">
                                  {d.component_id || "Deduction"}
                                </td>
                                <td className="px-3 py-2 text-right font-medium">
                                  {formatMoney(d.amount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Net Pay */}
                  {payslip.snapshot_json?.net_pay != null && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-800">
                          Net Pay
                        </span>
                        <span className="text-lg font-bold text-emerald-800">
                          {formatMoney(payslip.snapshot_json.net_pay)}
                        </span>
                      </div>
                    </div>
                  )}

                  {payslip.pdf_url && (
                    <a
                      href={payslip.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-[#6b7280]">
                  Payslip not found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}