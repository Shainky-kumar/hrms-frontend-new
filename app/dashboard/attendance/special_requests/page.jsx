
// // "use client";

// // import { useEffect, useState } from "react";
// // import { api } from "@/app/lib/api";

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

// // const toArray = (p) => {
// //   if (!p) return [];
// //   if (Array.isArray(p)) return p;
// //   if (Array.isArray(p?.data)) return p.data;
// //   if (Array.isArray(p?.requests)) return p.requests;
// //   if (Array.isArray(p?.employees)) return p.employees;
// //   return [];
// // };

// // const formatDate = (d) => {
// //   if (!d) return "—";
// //   try {
// //     return new Date(d).toLocaleDateString("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     });
// //   } catch {
// //     return d;
// //   }
// // };

// // const statusBadge = (status) => {
// //   const s = (status || "").toUpperCase();
// //   if (s === "APPROVED") return "bg-emerald-50 text-emerald-700";
// //   if (s === "REJECTED") return "bg-red-50 text-red-700";
// //   return "bg-amber-50 text-amber-700"; // PENDING
// // };

// // export default function SpecialRequestsPage() {
// //   const [list, setList] = useState([]);
// //   const [employees, setEmployees] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [actionLoading, setActionLoading] = useState(null);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [total, setTotal] = useState(0);
// //   const [pageSize] = useState(10);
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [onlyMyApprovals, setOnlyMyApprovals] = useState(false);
// //   const [search, setSearch] = useState("");

// //   // employee_id nahi — token se backend nikaalega
// //   const [form, setForm] = useState({
// //     request_type: "wfh",
// //     start_date: "",
// //     end_date: "",
// //     reason: "",
// //     location_name: "",
// //     latitude: "",
// //     longitude: "",
// //   });

// //   const [showRejectModal, setShowRejectModal] = useState(false);
// //   const [rejectId, setRejectId] = useState(null);
// //   const [rejectReason, setRejectReason] = useState("");

// //   // Sirf name dikhane ke liye employees list (dropdown nahi)
// //   const fetchEmployees = async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/employees");
// //       setEmployees(toArray(res?.data));
// //     } catch {
// //       setEmployees([]);
// //     }
// //   };

// //   useEffect(() => {
// //     const controller = new AbortController();
    
// //     const fetchList = async () => {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         const res = await api.get("/api/v1/attendance/special-requests", {
// //           params: {
// //             page,
// //             page_size: pageSize,
// //             search: search || undefined,
// //             only_my_approvals: onlyMyApprovals,
// //           },
// //         });
// //         const data = res?.data;
// //         let rows = toArray(data);
// //         if (statusFilter !== "all") {
// //           rows = rows.filter(
// //             (r) => (r.status || "").toUpperCase() === statusFilter.toUpperCase()
// //           );
// //         }
// //         setList(rows);
// //         setTotal(data?.total ?? rows.length);
// //       } catch (err) {
// //         setError(formatApiError(err));
// //         setList([]);
// //         setTotal(0);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
    
// //     fetchList();
// //     return () => controller.abort();
// //   }, [page, onlyMyApprovals, statusFilter, pageSize, search, statusFilter]);

// //   useEffect(() => {
// //     const controller = new AbortController();
// //     (async () => {
// //       await fetchEmployees();
// //     })();
// //     return () => controller.abort();
// //   }, []);

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       // employee_id mat bhejo — backend token se nikaalega
// //       await api.post("/api/v1/attendance/special-request", {
// //         request_type: form.request_type,
// //         start_date: form.start_date,
// //         end_date: form.end_date,
// //         reason: form.reason || null,
// //         location_name: form.location_name || null,
// //         latitude: form.latitude ? Number(form.latitude) : null,
// //         longitude: form.longitude ? Number(form.longitude) : null,
// //       });
// //       setSuccess("Special request submitted successfully");
// //       setForm({
// //         request_type: "wfh",
// //         start_date: "",
// //         end_date: "",
// //         reason: "",
// //         location_name: "",
// //         latitude: "",
// //         longitude: "",
// //       });
// //       setPage(1);
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const approve = async (id) => {
// //     setActionLoading(id);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.put(`/api/v1/attendance/special-request/${id}/approve`);
// //       setSuccess("Request approved");
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setActionLoading(null);
// //     }
// //   };

// //   const openReject = (id) => {
// //     setRejectId(id);
// //     setRejectReason("");
// //     setShowRejectModal(true);
// //   };

// //   const confirmReject = async () => {
// //     if (!rejectId) return;
// //     setActionLoading(rejectId);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.put(`/api/v1/attendance/special-request/${rejectId}/reject`, {
// //         decision_reason: rejectReason || null,
// //       });
// //       setSuccess("Request rejected");
// //       setShowRejectModal(false);
// //       setRejectId(null);
// //       setRejectReason("");
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setActionLoading(null);
// //     }
// //   };

// //   const getEmployeeName = (employeeId) => {
// //     const emp = employees.find((e) => e.employee_id === employeeId);
// //     if (!emp) return employeeId || "—";
// //     return emp.first_name
// //       ? `${emp.first_name} ${emp.last_name || ""}`.trim()
// //       : emp.name || employeeId;
// //   };

// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// //   return (
// //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// //       {/* Header */}
// //       <div className="mb-6">
// //         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Special Requests</h1>
// //         <p className="mt-1 text-sm text-[#6b7280]">
// //           Work From Home • On Duty • Outdoor — auto assigned to your reporting manager
// //         </p>
// //       </div>

// //       {error && (
// //         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
// //           {error}
// //         </div>
// //       )}
// //       {success && (
// //         <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
// //           {success}
// //         </div>
// //       )}

// //       {/* New Request Form — NO employee dropdown */}
// //       <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// //         <div className="border-b border-[#e5e7eb] px-5 py-4">
// //           <h2 className="text-sm font-semibold text-[#374151]">New Request</h2>
// //           <p className="mt-0.5 text-xs text-[#9ca3af]">
// //             Request will be created for the currently logged-in employee
// //           </p>
// //         </div>
// //         <form onSubmit={submit} className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
// //           <select
// //             value={form.request_type}
// //             onChange={(e) => setForm((p) => ({ ...p, request_type: e.target.value }))}
// //             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //           >
// //             <option value="wfh">Work From Home</option>
// //             <option value="on_duty">On Duty</option>
// //             <option value="outdoor">Outdoor</option>
// //           </select>

// //           <input
// //             required
// //             type="date"
// //             value={form.start_date}
// //             onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
// //             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //           />
// //           <input
// //             required
// //             type="date"
// //             value={form.end_date}
// //             onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
// //             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //           />
// //           <input
// //             placeholder="Location name (optional)"
// //             value={form.location_name}
// //             onChange={(e) => setForm((p) => ({ ...p, location_name: e.target.value }))}
// //             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //           />
// //           <input
// //             placeholder="Latitude (optional)"
// //             value={form.latitude}
// //             onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
// //             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //           />
// //           <input
// //             placeholder="Longitude (optional)"
// //             value={form.longitude}
// //             onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
// //             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //           />
// //           <input
// //             placeholder="Reason"
// //             value={form.reason}
// //             onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
// //             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] sm:col-span-2"
// //           />
// //           <button
// //             type="submit"
// //             disabled={saving}
// //             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:opacity-60 sm:w-fit"
// //           >
// //             {saving ? "Submitting..." : "Submit Request"}
// //           </button>
// //         </form>
// //       </div>

// //       {/* List Card */}
// //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// //         {/* Toolbar */}
// //         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
// //           <div className="flex flex-wrap items-center gap-3">
// //             <input
// //               type="text"
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               onKeyDown={(e) => {
// //                 if (e.key === "Enter") {
// //                   setPage(1);
// //                   fetchList();
// //                 }
// //               }}
// //               placeholder="Search employee id..."
// //               className="w-full max-w-xs rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] sm:w-48"
// //             />
// //             <select
// //               value={statusFilter}
// //               onChange={(e) => {
// //                 setStatusFilter(e.target.value);
// //                 setPage(1);
// //               }}
// //               className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //             >
// //               <option value="all">All Status</option>
// //               <option value="PENDING">Pending</option>
// //               <option value="APPROVED">Approved</option>
// //               <option value="REJECTED">Rejected</option>
// //             </select>
// //             <label className="flex cursor-pointer items-center gap-2 text-sm text-[#374151]">
// //               <input
// //                 type="checkbox"
// //                 checked={onlyMyApprovals}
// //                 onChange={(e) => {
// //                   setOnlyMyApprovals(e.target.checked);
// //                   setPage(1);
// //                 }}
// //                 className="h-4 w-4 rounded border-[#d1d5db] text-[#E42527] focus:ring-[#E42527]"
// //               />
// //               My team only
// //             </label>
// //           </div>
// //           <div className="text-sm text-[#6b7280]">
// //             {total} request{total !== 1 ? "s" : ""}
// //           </div>
// //         </div>

// //         {/* Table */}
// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// //           ) : list.length === 0 ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">No requests found</div>
// //           ) : (
// //             <table className="w-full min-w-[1000px] text-left text-sm">
// //               <thead>
// //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">From</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">To</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Location</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Reason</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Approver</th>
// //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-[#f3f4f6]">
// //                 {list.map((r, i) => {
// //                   const isPending = (r.status || "").toUpperCase() === "PENDING";
// //                   return (
// //                     <tr key={r.request_id || i} className="hover:bg-[#fafafa]">
// //                       <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">
// //                         {getEmployeeName(r.employee_id)}
// //                       </td>
// //                       <td className="px-5 py-3.5 uppercase text-[#6b7280]">
// //                         {(r.request_type || "").replace("_", " ")}
// //                       </td>
// //                       <td className="px-5 py-3.5 text-[#6b7280]">{formatDate(r.start_date)}</td>
// //                       <td className="px-5 py-3.5 text-[#6b7280]">{formatDate(r.end_date)}</td>
// //                       <td
// //                         className="max-w-[140px] truncate px-5 py-3.5 text-[#6b7280]"
// //                         title={r.location_name || ""}
// //                       >
// //                         {r.location_name || "—"}
// //                       </td>
// //                       <td
// //                         className="max-w-[160px] truncate px-5 py-3.5 text-[#6b7280]"
// //                         title={r.reason || ""}
// //                       >
// //                         {r.reason || "—"}
// //                       </td>
// //                       <td className="px-5 py-3.5">
// //                         <span
// //                           className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(
// //                             r.status
// //                           )}`}
// //                         >
// //                           {(r.status || "pending").toLowerCase()}
// //                         </span>
// //                       </td>
// //                       <td className="px-5 py-3.5 text-xs text-[#6b7280]">
// //                         {r.approver_id || "—"}
// //                       </td>
// //                       <td className="px-5 py-3.5 text-right">
// //                         {isPending ? (
// //                           <div className="flex items-center justify-end gap-2">
// //                             <button
// //                               onClick={() => approve(r.request_id)}
// //                               disabled={actionLoading === r.request_id}
// //                               className="rounded px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
// //                             >
// //                               {actionLoading === r.request_id ? "..." : "Approve"}
// //                             </button>
// //                             <button
// //                               onClick={() => openReject(r.request_id)}
// //                               disabled={actionLoading === r.request_id}
// //                               className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
// //                             >
// //                               Reject
// //                             </button>
// //                           </div>
// //                         ) : (
// //                           <span className="text-xs text-[#9ca3af]">—</span>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>

// //         {/* Pagination */}
// //         {totalPages > 1 && (
// //           <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3">
// //             <p className="text-sm text-[#6b7280]">
// //               Page {page} of {totalPages}
// //             </p>
// //             <div className="flex gap-2">
// //               <button
// //                 onClick={() => setPage((p) => Math.max(1, p - 1))}
// //                 disabled={page <= 1}
// //                 className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Previous
// //               </button>
// //               <button
// //                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// //                 disabled={page >= totalPages}
// //                 className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Reject Modal */}
// //       {showRejectModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //           <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
// //             <div className="border-b border-[#e5e7eb] px-5 py-4">
// //               <h3 className="text-base font-semibold text-[#1a1a1a]">Reject Request</h3>
// //               <p className="mt-1 text-sm text-[#6b7280]">
// //                 Optionally add a reason for rejection
// //               </p>
// //             </div>
// //             <div className="px-5 py-4">
// //               <textarea
// //                 value={rejectReason}
// //                 onChange={(e) => setRejectReason(e.target.value)}
// //                 rows={3}
// //                 placeholder="Decision reason (optional)"
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //               />
// //             </div>
// //             <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-5 py-4">
// //               <button
// //                 onClick={() => {
// //                   setShowRejectModal(false);
// //                   setRejectId(null);
// //                   setRejectReason("");
// //                 }}
// //                 className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmReject}
// //                 disabled={actionLoading === rejectId}
// //                 className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
// //               >
// //                 {actionLoading === rejectId ? "Rejecting..." : "Confirm Reject"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// //  new code 


// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { api } from "@/app/lib/api";

// /* ============================================================
//    CONSTANTS
// ============================================================ */

// const PAGE_SIZE = 10;
// const DEBOUNCE_MS = 400;
// const AUTO_DISMISS_MS = 4000;

// const REQUEST_TYPES = [
//   { value: "wfh", label: "Work From Home" },
//   { value: "on_duty", label: "On Duty" },
//   { value: "outdoor", label: "Outdoor" },
// ];

// /* ============================================================
//    HELPERS
// ============================================================ */

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

// const extractRequests = (res) => {
//   const data = res?.data ?? {};
//   if (Array.isArray(data)) return { items: data, total: data.length };
//   if (Array.isArray(data.requests))
//     return { items: data.requests, total: Number(data.total) || data.requests.length };
//   if (Array.isArray(data.data))
//     return { items: data.data, total: Number(data.total) || data.data.length };
//   if (Array.isArray(data.items))
//     return { items: data.items, total: Number(data.total) || data.items.length };
//   return { items: [], total: 0 };
// };

// const extractEmployees = (res) => {
//   const data = res?.data ?? {};
//   let arr = [];
//   if (Array.isArray(data)) arr = data;
//   else if (Array.isArray(data.employees)) arr = data.employees;
//   else if (Array.isArray(data.data)) arr = data.data;
//   else if (Array.isArray(data.items)) arr = data.items;
//   else if (Array.isArray(data.result)) arr = data.result;

//   return arr.map((e) => {
//     const id = e.employee_id || e.id || e.user_id || "";
//     const name =
//       e.full_name ||
//       e.name ||
//       e.employee_name ||
//       `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
//       id;
//     return { id, name };
//   });
// };

// const formatDate = (d) => {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return String(d);
//   }
// };

// const statusBadge = (status) => {
//   const s = (status || "").toUpperCase();
//   if (s === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
//   if (s === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
//   if (s === "CANCELLED") return "bg-slate-100 text-slate-700 border-slate-200";
//   return "bg-amber-50 text-amber-700 border-amber-200";
// };

// const getTodayStr = () => new Date().toISOString().slice(0, 10);

// /* ============================================================
//    PAGINATION
// ============================================================ */

// function Pagination({ page, pageSize, total, onPageChange }) {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   if (total <= pageSize) return null;

//   const from = (page - 1) * pageSize + 1;
//   const to = Math.min(page * pageSize, total);

//   const pages = [];
//   const maxButtons = 5;
//   let start = Math.max(1, page - Math.floor(maxButtons / 2));
//   let end = Math.min(totalPages, start + maxButtons - 1);
//   if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
//   for (let i = start; i <= end; i++) pages.push(i);

//   return (
//     <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5e7eb] px-5 py-3.5 sm:flex-row">
//       <p className="text-xs text-[#6b7280]">
//         Showing <span className="font-medium text-[#374151]">{from}</span>–
//         <span className="font-medium text-[#374151]">{to}</span> of{" "}
//         <span className="font-medium text-[#374151]">{total}</span>
//       </p>
//       <div className="flex items-center gap-1">
//         <button
//           type="button"
//           disabled={page <= 1}
//           onClick={() => onPageChange(page - 1)}
//           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           Prev
//         </button>

//         {start > 1 && (
//           <>
//             <button
//               type="button"
//               onClick={() => onPageChange(1)}
//               className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb]"
//             >
//               1
//             </button>
//             {start > 2 && <span className="px-1 text-xs text-[#9ca3af]">…</span>}
//           </>
//         )}

//         {pages.map((p) => (
//           <button
//             key={p}
//             type="button"
//             onClick={() => onPageChange(p)}
//             className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
//               p === page
//                 ? "border-[#E42527] bg-[#E42527] text-white"
//                 : "border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
//             }`}
//           >
//             {p}
//           </button>
//         ))}

//         {end < totalPages && (
//           <>
//             {end < totalPages - 1 && <span className="px-1 text-xs text-[#9ca3af]">…</span>}
//             <button
//               type="button"
//               onClick={() => onPageChange(totalPages)}
//               className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb]"
//             >
//               {totalPages}
//             </button>
//           </>
//         )}

//         <button
//           type="button"
//           disabled={page >= totalPages}
//           onClick={() => onPageChange(page + 1)}
//           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    EMPTY STATE
// ============================================================ */

// function EmptyState({ onRefresh }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-7 w-7 text-[#9ca3af]"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={1.8}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//       </div>
//       <p className="text-sm font-medium text-[#374151]">No requests found</p>
//       <p className="text-xs text-[#6b7280]">
//         Try changing filters or submit a new request above.
//       </p>
//       <button
//         type="button"
//         onClick={onRefresh}
//         className="mt-1 rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
//       >
//         ↻ Refresh
//       </button>
//     </div>
//   );
// }

// /* ============================================================
//    REJECT MODAL
// ============================================================ */

// function RejectModal({ open, onClose, onConfirm, loading, reason, setReason }) {
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === "Escape" && !loading) onClose();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, loading, onClose]);

//   if (!open) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//       onClick={() => !loading && onClose()}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="w-full max-w-md rounded-lg bg-white shadow-xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="border-b border-[#e5e7eb] px-5 py-4">
//           <h3 className="text-base font-semibold text-[#1a1a1a]">Reject Request</h3>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Optionally add a reason for rejection
//           </p>
//         </div>
//         <div className="px-5 py-4">
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             rows={3}
//             placeholder="Decision reason (optional)"
//             autoFocus
//             className="w-full resize-none rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//           />
//         </div>
//         <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-5 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={loading}
//             className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={onConfirm}
//             disabled={loading}
//             className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
//           >
//             {loading ? "Rejecting..." : "Confirm Reject"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    MAIN PAGE
// ============================================================ */

// export default function SpecialRequestsPage() {
//   /* list */
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);

//   /* employees (for name lookup) */
//   const [employees, setEmployees] = useState([]);

//   /* notifications */
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* filters */
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [onlyMyApprovals, setOnlyMyApprovals] = useState(false);

//   /* form */
//   const [form, setForm] = useState({
//     request_type: "wfh",
//     start_date: "",
//     end_date: "",
//     reason: "",
//     location_name: "",
//     latitude: "",
//     longitude: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const [geoLoading, setGeoLoading] = useState(false);

//   /* actions */
//   const [actionLoading, setActionLoading] = useState(null);

//   /* reject modal */
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectId, setRejectId] = useState(null);
//   const [rejectReason, setRejectReason] = useState("");

//   const reqIdRef = useRef(0);

//   /* ============================================================
//      AUTO-DISMISS NOTIFICATIONS
//   ============================================================ */
//   useEffect(() => {
//     if (!error && !success) return;
//     const t = setTimeout(() => {
//       setError("");
//       setSuccess("");
//     }, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [error, success]);

//   /* ============================================================
//      FETCH EMPLOYEES (for name lookup)
//   ============================================================ */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await api.get("/api/v1/get/employees");
//         if (!cancelled) setEmployees(extractEmployees(res));
//       } catch {
//         if (!cancelled) setEmployees([]);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ============================================================
//      FETCH LIST (useCallback — accessible everywhere)
//   ============================================================ */
//   const fetchList = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const params = {
//         page,
//         page_size: PAGE_SIZE,
//         only_my_approvals: onlyMyApprovals,
//       };
//       if (search) params.search = search;
//       if (statusFilter !== "all") params.status = statusFilter; // future-proof

//       const res = await api.get("/api/v1/attendance/special-requests", { params });
//       if (myReqId !== reqIdRef.current) return;

//       const { items, total } = extractRequests(res);

//       // Client-side status filter as fallback (if backend doesn't support yet)
//       let rows = items;
//       if (statusFilter !== "all") {
//         rows = items.filter(
//           (r) => (r.status || "").toUpperCase() === statusFilter.toUpperCase()
//         );
//       }

//       setList(rows);
//       setTotal(total);
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, [page, search, statusFilter, onlyMyApprovals]);

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   /* ============================================================
//      DEBOUNCED SEARCH
//   ============================================================ */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* ============================================================
//      USE MY LOCATION
//   ============================================================ */
//   const useMyLocation = () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       return;
//     }
//     setGeoLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setForm((p) => ({
//           ...p,
//           latitude: pos.coords.latitude.toFixed(6),
//           longitude: pos.coords.longitude.toFixed(6),
//         }));
//         setGeoLoading(false);
//       },
//       () => {
//         setError("Could not get your location. Please enter manually.");
//         setGeoLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   /* ============================================================
//      SUBMIT
//   ============================================================ */
//   const submit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!form.start_date || !form.end_date) {
//       setError("Please select start and end date");
//       return;
//     }
//     if (form.end_date < form.start_date) {
//       setError("End date cannot be before start date");
//       return;
//     }

//     setSaving(true);
//     try {
//       await api.post("/api/v1/attendance/special-request", {
//         request_type: form.request_type,
//         start_date: form.start_date,
//         end_date: form.end_date,
//         reason: form.reason || null,
//         location_name: form.location_name || null,
//         latitude: form.latitude ? Number(form.latitude) : null,
//         longitude: form.longitude ? Number(form.longitude) : null,
//       });
//       setSuccess("Special request submitted successfully");
//       setForm({
//         request_type: "wfh",
//         start_date: "",
//         end_date: "",
//         reason: "",
//         location_name: "",
//         latitude: "",
//         longitude: "",
//       });
//       setPage(1);
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ============================================================
//      APPROVE
//   ============================================================ */
//   const approve = async (id) => {
//     if (!window.confirm("Are you sure you want to approve this request?")) return;
//     setActionLoading(id);
//     setError("");
//     setSuccess("");
//     try {
//       await api.put(`/api/v1/attendance/special-request/${id}/approve`);
//       setSuccess("Request approved");
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   /* ============================================================
//      REJECT
//   ============================================================ */
//   const openReject = (id) => {
//     setRejectId(id);
//     setRejectReason("");
//     setShowRejectModal(true);
//   };

//   const confirmReject = async () => {
//     if (!rejectId) return;
//     setActionLoading(rejectId);
//     setError("");
//     setSuccess("");
//     try {
//       await api.put(`/api/v1/attendance/special-request/${rejectId}/reject`, {
//         decision_reason: rejectReason || null,
//       });
//       setSuccess("Request rejected");
//       setShowRejectModal(false);
//       setRejectId(null);
//       setRejectReason("");
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   /* ============================================================
//      HELPERS
//   ============================================================ */
//   const getEmployeeName = (employeeId) => {
//     const emp = employees.find((e) => e.id === employeeId);
//     return emp ? emp.name : employeeId || "—";
//   };

//   const clearFilters = () => {
//     setSearchInput("");
//     setStatusFilter("all");
//     setOnlyMyApprovals(false);
//     setPage(1);
//   };

//   const hasActiveFilters =
//     searchInput !== "" || statusFilter !== "all" || onlyMyApprovals;

//   /* ============================================================
//      RENDER
//   ============================================================ */
//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       {/* HEADER */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Special Requests</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Work From Home • On Duty • Outdoor — auto assigned to your reporting manager
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={fetchList}
//           disabled={loading}
//           className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
//         >
//           ↻ Refresh
//         </button>
//       </div>

//       {/* NOTIFICATIONS */}
//       {error && (
//         <div className="mb-4 flex items-start justify-between rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]" role="alert">
//           <span>{error}</span>
//           <button onClick={() => setError("")} className="ml-3 hover:text-[#7f1d1d]" aria-label="Dismiss">
//             ✕
//           </button>
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 flex items-start justify-between rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
//           <span>{success}</span>
//           <button onClick={() => setSuccess("")} className="ml-3 hover:text-green-900" aria-label="Dismiss">
//             ✕
//           </button>
//         </div>
//       )}

//       {/* NEW REQUEST FORM */}
//       <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="border-b border-[#e5e7eb] px-5 py-4">
//           <h2 className="text-sm font-semibold text-[#374151]">New Request</h2>
//           <p className="mt-0.5 text-xs text-[#9ca3af]">
//             Request will be created for the currently logged-in employee
//           </p>
//         </div>
//         <form onSubmit={submit} className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
//           <select
//             value={form.request_type}
//             onChange={(e) => setForm((p) => ({ ...p, request_type: e.target.value }))}
//             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//           >
//             {REQUEST_TYPES.map((t) => (
//               <option key={t.value} value={t.value}>{t.label}</option>
//             ))}
//           </select>

//           <input
//             required
//             type="date"
//             min={getTodayStr()}
//             value={form.start_date}
//             onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
//             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//           />
//           <input
//             required
//             type="date"
//             min={form.start_date || getTodayStr()}
//             value={form.end_date}
//             onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
//             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//           />

//           <input
//             placeholder="Location name (optional)"
//             value={form.location_name}
//             onChange={(e) => setForm((p) => ({ ...p, location_name: e.target.value }))}
//             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//           />
//           <input
//             placeholder="Latitude (optional)"
//             value={form.latitude}
//             onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
//             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//           />
//           <input
//             placeholder="Longitude (optional)"
//             value={form.longitude}
//             onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
//             className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//           />

//           <div className="sm:col-span-2 lg:col-span-3">
//             <button
//               type="button"
//               onClick={useMyLocation}
//               disabled={geoLoading}
//               className="rounded-md border border-[#d1d5db] px-3 py-2 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
//             >
//               {geoLoading ? "Fetching..." : "📍 Use My Current Location"}
//             </button>
//           </div>

//           <textarea
//             placeholder="Reason"
//             rows={2}
//             value={form.reason}
//             onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
//             className="resize-none rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none sm:col-span-2"
//           />

//           <button
//             type="submit"
//             disabled={saving}
//             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:opacity-60 sm:w-fit"
//           >
//             {saving ? "Submitting..." : "Submit Request"}
//           </button>
//         </form>
//       </div>

//       {/* LIST CARD */}
//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         {/* TOOLBAR */}
//         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
//               <input
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 placeholder="Search employee id..."
//                 className="w-full rounded-md border border-[#d1d5db] pl-9 pr-9 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//               />
//               <svg
//                 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
//               </svg>
//               {searchInput && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchInput("")}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>

//             <select
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//             >
//               <option value="all">All Status</option>
//               <option value="PENDING">Pending</option>
//               <option value="APPROVED">Approved</option>
//               <option value="REJECTED">Rejected</option>
//             </select>

//             <label className="flex cursor-pointer items-center gap-2 text-sm text-[#374151]">
//               <input
//                 type="checkbox"
//                 checked={onlyMyApprovals}
//                 onChange={(e) => {
//                   setOnlyMyApprovals(e.target.checked);
//                   setPage(1);
//                 }}
//                 className="h-4 w-4 cursor-pointer rounded border-[#d1d5db] accent-[#E42527]"
//               />
//               My team only
//             </label>

//             {hasActiveFilters && (
//               <button
//                 type="button"
//                 onClick={clearFilters}
//                 className="rounded-md px-3 py-2 text-sm font-medium text-[#E42527] hover:bg-[#fef2f2]"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>

//           <div className="text-sm text-[#6b7280]">
//             {total} request{total !== 1 ? "s" : ""}
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//           ) : list.length === 0 ? (
//             <EmptyState onRefresh={fetchList} />
//           ) : (
//             <table className="w-full min-w-[1000px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">From</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">To</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Location</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Reason</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Approver</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((r, i) => {
//                   const isPending = (r.status || "").toUpperCase() === "PENDING";
//                   return (
//                     <tr key={r.request_id || i} className="hover:bg-[#fafafa]">
//                       <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">
//                         {getEmployeeName(r.employee_id)}
//                       </td>
//                       <td className="px-5 py-3.5 uppercase text-[#6b7280]">
//                         {(r.request_type || "").replace(/_/g, " ")}
//                       </td>
//                       <td className="px-5 py-3.5 whitespace-nowrap text-[#6b7280]">
//                         {formatDate(r.start_date)}
//                       </td>
//                       <td className="px-5 py-3.5 whitespace-nowrap text-[#6b7280]">
//                         {formatDate(r.end_date)}
//                       </td>
//                       <td className="max-w-[140px] truncate px-5 py-3.5 text-[#6b7280]" title={r.location_name || ""}>
//                         {r.location_name || "—"}
//                       </td>
//                       <td className="max-w-[180px] truncate px-5 py-3.5 text-[#6b7280]" title={r.reason || ""}>
//                         {r.reason || "—"}
//                       </td>
//                       <td className="px-5 py-3.5">
//                         <span
//                           className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusBadge(
//                             r.status
//                           )}`}
//                         >
//                           {(r.status || "pending").toLowerCase()}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3.5 text-xs text-[#6b7280]">
//                         {r.approver_id ? getEmployeeName(r.approver_id) : "—"}
//                       </td>
//                       <td className="px-5 py-3.5 text-right">
//                         {isPending ? (
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               type="button"
//                               onClick={() => approve(r.request_id)}
//                               disabled={actionLoading === r.request_id}
//                               className="rounded px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
//                             >
//                               {actionLoading === r.request_id ? "..." : "Approve"}
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => openReject(r.request_id)}
//                               disabled={actionLoading === r.request_id}
//                               className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         ) : (
//                           <span className="text-xs text-[#9ca3af]">—</span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* PAGINATION */}
//         {!loading && list.length > 0 && (
//           <Pagination
//             page={page}
//             pageSize={PAGE_SIZE}
//             total={total}
//             onPageChange={setPage}
//           />
//         )}
//       </div>

//       {/* REJECT MODAL */}
//       <RejectModal
//         open={showRejectModal}
//         onClose={() => {
//           setShowRejectModal(false);
//           setRejectId(null);
//           setRejectReason("");
//         }}
//         onConfirm={confirmReject}
//         loading={actionLoading === rejectId}
//         reason={rejectReason}
//         setReason={setRejectReason}
//       />
//     </div>
//   );
// }

"use client";

/**
 * SpecialRequestsPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ WFH / On Duty / Outdoor requests
 *  ✓ Employee auto-resolved from token (no manual selection for self)
 *  ✓ Admin can approve/reject any; employee sees own
 *  ✓ Reason modal (no window.prompt)
 *  ✓ Status chips + date range + search
 *  ✓ Location preview with map link
 *  ✓ Mobile responsive
 *  ✓ Role-aware (admin sees everyone, employee sees own)
 *  ✓ Fix: fetchList no longer scoped inside useEffect
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

const REQUEST_TYPES = [
  { value: "wfh", label: "Work From Home", icon: "🏠", tone: "blue" },
  { value: "on_duty", label: "On Duty", icon: "💼", tone: "amber" },
  { value: "outdoor", label: "Outdoor", icon: "🚗", tone: "green" },
];

const TYPE_MAP = Object.fromEntries(REQUEST_TYPES.map((t) => [t.value, t]));

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const EMPTY_FORM = {
  request_type: "wfh",
  start_date: "",
  end_date: "",
  reason: "",
  location_name: "",
  latitude: "",
  longitude: "",
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

const safeDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
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

const daysBetween = (a, b) => {
  const da = safeDate(a);
  const db = safeDate(b);
  if (!da || !db) return 0;
  return Math.round((db - da) / (1000 * 60 * 60 * 24)) + 1;
};

const extractList = (res) => {
  const data = res?.data ?? {};
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.requests))
    return { items: data.requests, total: Number(data.total) || data.requests.length };
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
    return { id, name };
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

function LocationPreview({ lat, lng, name }) {
  if (!lat || !lng) {
    return <span className="text-xs text-slate-400">{name || "—"}</span>;
  }
  const href = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
      title={`${lat}, ${lng}`}
    >
      📍 {name || `${Number(lat).toFixed(3)}, ${Number(lng).toFixed(3)}`}
    </a>
  );
}

/* ══════════════════════════════════════════════════════════
   CREATE FORM
   ══════════════════════════════════════════════════════════ */

function CreateCard({ onCreated, isAdmin, employees, currentEmployeeId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      () => {
        setError("Could not get location. Enter manually.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.start_date || !form.end_date) {
      setError("Please select start and end date");
      return;
    }
    if (form.end_date < form.start_date) {
      setError("End date cannot be before start date");
      return;
    }
    if (form.latitude && !Number.isFinite(Number(form.latitude))) {
      setError("Latitude must be a number");
      return;
    }
    if (form.longitude && !Number.isFinite(Number(form.longitude))) {
      setError("Longitude must be a number");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        request_type: form.request_type,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason.trim() || null,
        location_name: form.location_name.trim() || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      // For admin: employee_id required. For employee: backend resolves from token.
      if (isAdmin && currentEmployeeId) {
        payload.employee_id = currentEmployeeId;
      }

      await api.post("/api/v1/attendance/special-request", payload);

      setForm(EMPTY_FORM);
      setExpanded(false);
      onCreated?.();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const days = useMemo(() => {
    if (!form.start_date || !form.end_date) return 0;
    return daysBetween(form.start_date, form.end_date);
  }, [form.start_date, form.end_date]);

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left hover:bg-slate-50"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            New Request
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            WFH, On Duty or Outdoor — auto-assigned to your reporting manager
          </p>
        </div>
        <span className="text-lg text-slate-400">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <form onSubmit={submit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
              {error}
            </div>
          )}

          {/* Request type chips */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">
              Request Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REQUEST_TYPES.map((t) => {
                const active = form.request_type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("request_type")(t.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition ${
                      active
                        ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                From Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={form.start_date}
                min={getTodayIso()}
                onChange={(e) => set("start_date")(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                To Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={form.end_date}
                min={form.start_date || getTodayIso()}
                onChange={(e) => set("end_date")(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {days > 0 && (
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
              Duration: <strong>{days} day{days > 1 ? "s" : ""}</strong>
            </div>
          )}

          {/* Location */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-600">
                Location (optional)
              </label>
              <button
                type="button"
                onClick={useMyLocation}
                disabled={geoLoading}
                className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                {geoLoading ? "Fetching..." : "📍 Use current"}
              </button>
            </div>
            <input
              type="text"
              value={form.location_name}
              onChange={(e) => set("location_name")(e.target.value)}
              placeholder="e.g. Home, Client site"
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.000001"
                value={form.latitude}
                onChange={(e) => set("latitude")(e.target.value)}
                placeholder="Latitude"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
              <input
                type="number"
                step="0.000001"
                value={form.longitude}
                onChange={(e) => set("longitude")(e.target.value)}
                placeholder="Longitude"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Reason
            </label>
            <textarea
              rows={2}
              value={form.reason}
              onChange={(e) => set("reason")(e.target.value)}
              placeholder="e.g. Working from home due to personal reasons"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setExpanded(false);
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function SpecialRequestsPage() {
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
  const [typeFilter, setTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState(getMonthStartIso());
  const [toDate, setToDate] = useState(getTodayIso());
  const [onlyMyApprovals, setOnlyMyApprovals] = useState(false);

  /* employees */
  const [employees, setEmployees] = useState([]);

  /* ui */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionId, setActionId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOAD EMPLOYEES (for name lookup) ══════════════ */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/v1/get/employees", {
          params: { page: 1, page_size: 500 },
        });
        if (!cancelled) setEmployees(extractEmployees(res));
      } catch {
        if (!cancelled) setEmployees([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ══════════════ FETCH LIST — HOISTED! ══════════════ */
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
      if (typeFilter !== "all") params.request_type = typeFilter;
      if (onlyMyApprovals) params.only_my_approvals = true;

      const res = await api.get("/api/v1/attendance/special-requests", { params });
      if (myReqId !== reqIdRef.current) return;

      const { items, total: t } = extractList(res);

      // Client-side fallback filter for status (if backend ignores)
      let filtered = items;
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (r) => String(r.status || "").toLowerCase() === statusFilter
        );
      }
      if (typeFilter !== "all") {
        filtered = filtered.filter(
          (r) => String(r.request_type || "").toLowerCase() === typeFilter
        );
      }

      setList(filtered);
      setTotal(t);
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [page, statusFilter, typeFilter, fromDate, toDate, onlyMyApprovals]);

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
    setSuccess("Request submitted");
    setPage(1);
    fetchList();
  };

  /* ══════════════ APPROVE / REJECT ══════════════ */
  const performAction = async (id, action, reason) => {
    setActionId(id);
    setError("");
    try {
      if (action === "approved") {
        await api.put(`/api/v1/attendance/special-request/${id}/approve`);
      } else {
        await api.put(`/api/v1/attendance/special-request/${id}/reject`, {
          decision_reason: reason || null,
        });
      }
      setSuccess(`Request ${action}`);
      setConfirmAction(null);
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  const handleConfirm = async (reason) => {
    if (!confirmAction) return;
    await performAction(confirmAction.id, confirmAction.action, reason);
  };

  /* ══════════════ DERIVED ══════════════ */
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    onlyMyApprovals ||
    fromDate !== getMonthStartIso() ||
    toDate !== getTodayIso();

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setOnlyMyApprovals(false);
    setFromDate(getMonthStartIso());
    setToDate(getTodayIso());
    setPage(1);
  };

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Special Requests</h1>
            <p className="mt-1 text-sm text-slate-500">
              Work From Home · On Duty · Outdoor
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchList}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {/* Toast */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Create form */}
        <CreateCard
          onCreated={handleCreated}
          isAdmin={false}
          employees={employees}
          currentEmployeeId={user?.employee_id}
        />

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                From
              </label>
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
              <label className="mb-1 block text-xs font-medium text-slate-500">
                To
              </label>
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
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                {REQUEST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={onlyMyApprovals}
                  onChange={(e) => {
                    setOnlyMyApprovals(e.target.checked);
                    setPage(1);
                  }}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                />
                <span className="text-slate-700">My team only</span>
              </label>
            </div>
          </div>

          {/* Status chips + clear */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
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

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-xs font-medium text-red-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

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
                  📄
                </div>
                <p className="text-sm font-medium text-slate-700">No requests found</p>
                <p className="text-xs text-slate-500">
                  Try changing filters or submit a new request above
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Type</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Duration</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Location</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Reason</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row, i) => {
                    const id = row.request_id || i;
                    const isPending =
                      String(row.status || "").toLowerCase() === "pending";
                    const typeInfo = TYPE_MAP[row.request_type] || {};

                    return (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5 text-slate-700">
                          {getEmpName(row.employee_id)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-lg">{typeInfo.icon}</span>
                            <span className="text-xs font-medium capitalize text-slate-700">
                              {typeInfo.label || row.request_type}
                            </span>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-600">
                          <div>{formatDate(row.start_date, tz)}</div>
                          {row.end_date !== row.start_date && (
                            <div className="text-slate-400">
                              → {formatDate(row.end_date, tz)}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <LocationPreview
                            lat={row.latitude}
                            lng={row.longitude}
                            name={row.location_name}
                          />
                        </td>
                        <td className="max-w-[200px] px-5 py-3.5 text-slate-600">
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
                          ) : isPending ? (
                            <span className="text-xs text-slate-400">
                              Awaiting review
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
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

      {/* Reason / Confirm modal */}
      <ReasonModal
        open={!!confirmAction}
        title={confirmAction?.action === "approved" ? "Approve Request?" : "Reject Request?"}
        confirmLabel={confirmAction?.action === "approved" ? "Approve" : "Reject"}
        danger={confirmAction?.action === "rejected"}
        requireReason={confirmAction?.action === "rejected"}
        loading={actionId === confirmAction?.id}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}