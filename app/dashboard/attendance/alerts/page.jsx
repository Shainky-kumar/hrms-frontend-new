

// // "use client";


// // import { useEffect, useState } from "react";
// // import { api } from "@/app/lib/api";


// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // };


// // const toArray = (p) => {
// //   if (!p) return [];
// //   if (Array.isArray(p)) return p;
// //   if (Array.isArray(p?.data)) return p.data;
// //   if (Array.isArray(p?.alerts)) return p.alerts;
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
// //     return String(d);
// //   }
// // };


// // export default function AttendanceAlertsPage() {
// //   const [list, setList] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [showForm, setShowForm] = useState(false);
// //   const [form, setForm] = useState({
// //     employee_id: "",
// //     alert_type: "late",
// //     alert_date: "",
// //     message: "",
// //     notified_to: "",
// //   });


// //   const fetchList = async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get("/api/v1/attendence/alerts", {
// //         params: { page, page_size: 10, search: search || undefined },
// //       });
// //       setList(toArray(res?.data));
// //     } catch (err) {
// //       setError(formatApiError(err));
// //       setList([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };


// //   useEffect(() => {
// //     // eslint-disable-next-line react-hooks/set-state-in-effect
// //     fetchList();
// //   }, [page]);


// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.post("/api/v1/add/attendence/alert", {
// //         employee_id: form.employee_id || null,
// //         alert_type: form.alert_type,
// //         alert_date: form.alert_date,
// //         message: form.message || null,
// //         notified_to: form.notified_to || null,
// //       });
// //       setSuccess("Alert created");
// //       setShowForm(false);
// //       setForm({
// //         employee_id: "",
// //         alert_type: "late",
// //         alert_date: "",
// //         message: "",
// //         notified_to: "",
// //       });
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };


// //   const markRead = async (alertId) => {
// //     try {
// //       await api.put(`/api/v1/attendence/alert/${alertId}/read`);
// //       setSuccess("Marked as read");
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     }
// //   };


// //   const runAutoAbsent = async () => {
// //     setSaving(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.post("/api/v1/attendence/run-auto-absent");
// //       setSuccess("Auto-absent job ran");
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };


// //   return (
// //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// //       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Alerts</h1>
// //           <p className="mt-1 text-sm text-[#6b7280]">
// //             Late, absent, geo violation & more
// //           </p>
// //         </div>
// //         <div className="flex flex-wrap gap-2">
// //           <button
// //             type="button"
// //             disabled={saving}
// //             onClick={runAutoAbsent}
// //             className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
// //           >
// //             Run Auto Absent
// //           </button>
// //           <button
// //             onClick={() => setShowForm(true)}
// //             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// //           >
// //             + Add Alert
// //           </button>
// //         </div>
// //       </div>


// //       {error && (
// //         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
// //       )}
// //       {success && (
// //         <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
// //       )}


// //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// //         <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
// //           <input
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             placeholder="Search..."
// //             className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
// //           />
// //           <button
// //             onClick={() => {
// //               setPage(1);
// //               fetchList();
// //             }}
// //             className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
// //           >
// //             Search
// //           </button>
// //         </div>


// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// //           ) : list.length === 0 ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">No alerts</div>
// //           ) : (
// //             <table className="w-full min-w-[800px] text-left text-sm">
// //               <thead>
// //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Message</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Read</th>
// //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-[#f3f4f6]">
// //                 {list.map((row, i) => (
// //                   <tr key={row.alert_id || i} className="hover:bg-[#fafafa]">
// //                     <td className="px-5 py-3.5 whitespace-nowrap">
// //                       {formatDate(row.alert_date)}
// //                     </td>
// //                     <td className="px-5 py-3.5">{row.alert_type}</td>
// //                     <td className="px-5 py-3.5">{row.employee_id || "—"}</td>
// //                     <td className="px-5 py-3.5 max-w-[220px] truncate">
// //                       {row.message || "—"}
// //                     </td>
// //                     <td className="px-5 py-3.5">{row.is_read ? "Yes" : "No"}</td>
// //                     <td className="px-5 py-3.5 text-right">
// //                       {!row.is_read && (
// //                         <button
// //                           onClick={() => markRead(row.alert_id)}
// //                           className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
// //                         >
// //                           Mark read
// //                         </button>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       </div>


// //       {showForm && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
// //               <h2 className="font-semibold">Add Alert</h2>
// //               <button type="button" onClick={() => setShowForm(false)}>
// //                 ✕
// //               </button>
// //             </div>
// //             <form onSubmit={submit} className="space-y-3 p-5">
// //               <input
// //                 placeholder="Employee ID (optional)"
// //                 value={form.employee_id}
// //                 onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               />
// //               <select
// //                 value={form.alert_type}
// //                 onChange={(e) => setForm((p) => ({ ...p, alert_type: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               >
// //                 <option value="late">Late</option>
// //                 <option value="absent">Absent</option>
// //                 <option value="missing_punch">Missing punch</option>
// //                 <option value="geo_violation">Geo violation</option>
// //                 <option value="face_mismatch">Face mismatch</option>
// //                 <option value="consecutive_absent">Consecutive absent</option>
// //               </select>
// //               <input
// //                 required
// //                 type="date"
// //                 value={form.alert_date}
// //                 onChange={(e) => setForm((p) => ({ ...p, alert_date: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               />
// //               <textarea
// //                 rows={3}
// //                 placeholder="Message"
// //                 value={form.message}
// //                 onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               />
// //               <input
// //                 placeholder="Notified to (user_id)"
// //                 value={form.notified_to}
// //                 onChange={(e) => setForm((p) => ({ ...p, notified_to: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               />
// //               <div className="flex justify-end gap-2 pt-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForm(false)}
// //                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving..." : "Create"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // new code 


// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { api } from "@/app/lib/api";

// /* ============================================================
//    CONSTANTS
// ============================================================ */

// const ALERT_TYPES = [
//   { value: "late", label: "Late Arrival", badge: "bg-amber-100 text-amber-700 border-amber-200" },
//   { value: "absent", label: "Absent", badge: "bg-red-100 text-red-700 border-red-200" },
//   { value: "missing_punch", label: "Missing Punch", badge: "bg-orange-100 text-orange-700 border-orange-200" },
//   { value: "geo_violation", label: "Geo Violation", badge: "bg-purple-100 text-purple-700 border-purple-200" },
//   { value: "face_mismatch", label: "Face Mismatch", badge: "bg-pink-100 text-pink-700 border-pink-200" },
//   { value: "consecutive_absent", label: "Consecutive Absent", badge: "bg-rose-100 text-rose-700 border-rose-200" },
//   { value: "geo_config_missing", label: "Geo Config Missing", badge: "bg-slate-100 text-slate-700 border-slate-200" },
// ];

// const ALERT_TYPE_MAP = Object.fromEntries(ALERT_TYPES.map((t) => [t.value, t]));
// const PAGE_SIZE = 10;
// const DEBOUNCE_MS = 400;
// const AUTO_DISMISS_MS = 4000;

// /* ============================================================
//    HELPERS
// ============================================================ */

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
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

// const formatDateTime = (d) => {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return String(d);
//   }
// };

// const getTypeBadge = (type) =>
//   ALERT_TYPE_MAP[type]?.badge || "bg-slate-100 text-slate-700 border-slate-200";

// const getTypeLabel = (type) => ALERT_TYPE_MAP[type]?.label || type || "—";

// /**
//  * `/api/v1/get/employees` response — flexible shape handling.
//  */
// const extractEmployees = (res) => {
//   const data = res?.data ?? {};
//   let arr = [];
//   if (Array.isArray(data)) arr = data;
//   else if (Array.isArray(data.employees)) arr = data.employees;
//   else if (Array.isArray(data.data)) arr = data.data;
//   else if (Array.isArray(data.result)) arr = data.result;
//   else if (Array.isArray(data.items)) arr = data.items;
//   else if (Array.isArray(data.employee)) arr = data.employee;

//   return arr.map((e) => {
//     const first = e.first_name || "";
//     const last = e.last_name || "";
//     const fullName = (e.name || e.full_name || `${first} ${last}`).trim();
//     const empId = e.employee_id || e.id || e.user_id;
//     return {
//       employee_id: empId,
//       user_id: e.user_id || empId,
//       name: fullName || empId || "Unknown",
//       email: e.email || e.company_email || e.personal_email || "",
//       role: e.role || e.designation_name || e.job_title || "",
//     };
//   });
// };

// /* ============================================================
//    SEARCHABLE DROPDOWN (inline)
// ============================================================ */

// function SearchableDropdown({
//   label,
//   placeholder = "Search...",
//   value,
//   onChange,
//   options = [],
//   loading = false,
//   getOptionLabel = (o) => o.name,
//   getOptionValue = (o) => o.id,
//   getOptionSub = (o) => o.email || "",
//   emptyText = "No results",
//   optional = false,
//   clearable = true,
// }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const ref = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     const onClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, []);

//   const filtered = query.trim()
//     ? options.filter((o) => {
//         const label = String(getOptionLabel(o) || "").toLowerCase();
//         const sub = String(getOptionSub(o) || "").toLowerCase();
//         const q = query.trim().toLowerCase();
//         return label.includes(q) || sub.includes(q);
//       })
//     : options;

//   const selected = options.find((o) => getOptionValue(o) === value);

//   const handleSelect = (opt) => {
//     onChange(getOptionValue(opt));
//     setOpen(false);
//     setQuery("");
//   };

//   const handleClear = (e) => {
//     e.stopPropagation();
//     onChange("");
//     setQuery("");
//   };

//   return (
//     <div ref={ref} className="relative">
//       {label && (
//         <label className="mb-1 block text-xs font-medium text-[#6b7280]">
//           {label}
//           {optional && <span className="text-[#9ca3af]"> (optional)</span>}
//         </label>
//       )}

//       <button
//         type="button"
//         onClick={() => {
//           setOpen((v) => !v);
//           setTimeout(() => inputRef.current?.focus(), 30);
//         }}
//         className="flex w-full items-center justify-between rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-left text-sm focus:border-[#E42527] focus:outline-none"
//       >
//         <span className={selected ? "text-[#374151]" : "text-[#9ca3af]"}>
//           {selected ? getOptionLabel(selected) : placeholder}
//         </span>
//         <div className="flex items-center gap-1">
//           {clearable && selected && (
//             <span
//               role="button"
//               tabIndex={0}
//               onClick={handleClear}
//               onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
//               className="rounded p-0.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
//             >
//               ✕
//             </span>
//           )}
//           <svg
//             className={`h-4 w-4 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`}
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       </button>

//       {open && (
//         <div className="absolute z-30 mt-1 w-full rounded-md border border-[#e5e7eb] bg-white shadow-lg">
//           <div className="border-b border-[#f3f4f6] p-2">
//             <input
//               ref={inputRef}
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Type to search..."
//               className="w-full rounded-md border border-[#e5e7eb] px-2.5 py-1.5 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//           </div>
//           <div className="max-h-60 overflow-y-auto py-1">
//             {loading ? (
//               <div className="px-3 py-4 text-center text-xs text-[#9ca3af]">
//                 Loading...
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="px-3 py-4 text-center text-xs text-[#9ca3af]">
//                 {emptyText}
//               </div>
//             ) : (
//               filtered.map((opt) => {
//                 const v = getOptionValue(opt);
//                 const isSel = v === value;
//                 return (
//                   <button
//                     key={v}
//                     type="button"
//                     onClick={() => handleSelect(opt)}
//                     className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-[#f9fafb] ${
//                       isSel ? "bg-[#fff5f5]" : ""
//                     }`}
//                   >
//                     <span className="font-medium text-[#374151]">
//                       {getOptionLabel(opt)}
//                     </span>
//                     {getOptionSub(opt) && (
//                       <span className="text-[11px] text-[#9ca3af]">
//                         {getOptionSub(opt)}
//                       </span>
//                     )}
//                   </button>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    SUBCOMPONENTS
// ============================================================ */

// function SkeletonRow() {
//   return (
//     <tr className="animate-pulse">
//       <td className="px-5 py-3.5"><div className="h-4 w-20 rounded bg-[#e5e7eb]" /></td>
//       <td className="px-5 py-3.5"><div className="h-5 w-24 rounded bg-[#e5e7eb]" /></td>
//       <td className="px-5 py-3.5"><div className="h-4 w-24 rounded bg-[#e5e7eb]" /></td>
//       <td className="px-5 py-3.5"><div className="h-4 w-full max-w-[260px] rounded bg-[#e5e7eb]" /></td>
//       <td className="px-5 py-3.5"><div className="h-5 w-12 rounded bg-[#e5e7eb]" /></td>
//       <td className="px-5 py-3.5 text-right"><div className="ml-auto h-4 w-16 rounded bg-[#e5e7eb]" /></td>
//     </tr>
//   );
// }

// function EmptyState({ onAdd }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
//         </svg>
//       </div>
//       <p className="text-sm font-medium text-[#374151]">No alerts yet</p>
//       <p className="text-xs text-[#6b7280]">Alerts will appear here once triggered by attendance events.</p>
//       <button type="button" onClick={onAdd} className="mt-1 rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
//         + Add Manually
//       </button>
//     </div>
//   );
// }

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
//         <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
//           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40">
//           Prev
//         </button>
//         {start > 1 && (
//           <>
//             <button type="button" onClick={() => onPageChange(1)}
//               className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb]">1</button>
//             {start > 2 && <span className="px-1 text-xs text-[#9ca3af]">…</span>}
//           </>
//         )}
//         {pages.map((p) => (
//           <button key={p} type="button" onClick={() => onPageChange(p)}
//             className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
//               p === page
//                 ? "border-[#E42527] bg-[#E42527] text-white"
//                 : "border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
//             }`}>
//             {p}
//           </button>
//         ))}
//         {end < totalPages && (
//           <>
//             {end < totalPages - 1 && <span className="px-1 text-xs text-[#9ca3af]">…</span>}
//             <button type="button" onClick={() => onPageChange(totalPages)}
//               className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb]">
//               {totalPages}
//             </button>
//           </>
//         )}
//         <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
//           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    MODAL — Add Alert
// ============================================================ */

// function AddAlertModal({ open, onClose, onCreated, saving, setSaving, setError }) {
//   const [form, setForm] = useState({
//     employee_id: "",
//     alert_type: "late",
//     alert_date: "",
//     message: "",
//     notified_to: "",
//   });

//   const [employees, setEmployees] = useState([]);
//   const [empLoading, setEmpLoading] = useState(false);
//   const firstFieldRef = useRef(null);

//   /* load employees */
//   const loadEmployees = useCallback(async () => {
//     setEmpLoading(true);
//     try {
//       const res = await api.get("/api/v1/get/employees");
//       setEmployees(extractEmployees(res));
//     } catch {
//       setEmployees([]);
//     } finally {
//       setEmpLoading(false);
//     }
//   }, []);

//   /* preload on open + reset */
//   useEffect(() => {
//     if (open) {
//       setForm({
//         employee_id: "",
//         alert_type: "late",
//         alert_date: "",
//         message: "",
//         notified_to: "",
//       });
//       loadEmployees();
//       const t = setTimeout(() => firstFieldRef.current?.focus(), 80);
//       return () => clearTimeout(t);
//     }
//   }, [open, loadEmployees]);

//   /* ESC to close */
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   if (!open) return null;

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       await api.post("/api/v1/add/attendence/alert", {
//         employee_id: form.employee_id || null,
//         alert_type: form.alert_type,
//         alert_date: form.alert_date,
//         message: form.message || null,
//         notified_to: form.notified_to || null,
//       });
//       onCreated();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div className="w-full max-w-md rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
//         <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
//           <h2 className="font-semibold text-[#1a1a1a]">Add Alert</h2>
//           <button type="button" onClick={onClose} aria-label="Close"
//             className="rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6]">✕</button>
//         </div>

//         <form onSubmit={submit} className="space-y-3 p-5">
//           <SearchableDropdown
//             label="Employee"
//             placeholder="Select employee..."
//             value={form.employee_id}
//             onChange={(v) => setForm((p) => ({ ...p, employee_id: v }))}
//             options={employees}
//             loading={empLoading}
//             getOptionLabel={(o) => o.name}
//             getOptionValue={(o) => o.employee_id}
//             getOptionSub={(o) => o.email || o.employee_id}
//             emptyText="No employees found"
//             optional
//           />

//           <div>
//             <label className="mb-1 block text-xs font-medium text-[#6b7280]">Alert Type</label>
//             <select
//               value={form.alert_type}
//               onChange={(e) => setForm((p) => ({ ...p, alert_type: e.target.value }))}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//             >
//               {ALERT_TYPES.map((t) => (
//                 <option key={t.value} value={t.value}>{t.label}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1 block text-xs font-medium text-[#6b7280]">Date</label>
//             <input
//               ref={firstFieldRef}
//               required
//               type="date"
//               value={form.alert_date}
//               onChange={(e) => setForm((p) => ({ ...p, alert_date: e.target.value }))}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-xs font-medium text-[#6b7280]">Message</label>
//             <textarea
//               rows={3}
//               placeholder="Optional details"
//               value={form.message}
//               onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
//               className="w-full resize-none rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//           </div>

//           <SearchableDropdown
//             label="Notify To"
//             placeholder="Select person to notify..."
//             value={form.notified_to}
//             onChange={(v) => setForm((p) => ({ ...p, notified_to: v }))}
//             options={employees}
//             loading={empLoading}
//             getOptionLabel={(o) => o.name}
//             getOptionValue={(o) => o.user_id}
//             getOptionSub={(o) => o.email || o.role || ""}
//             emptyText="No users found"
//             optional
//           />

//           <div className="flex justify-end gap-2 pt-2">
//             <button type="button" onClick={onClose}
//               className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
//               Cancel
//             </button>
//             <button type="submit" disabled={saving}
//               className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
//               {saving ? "Creating..." : "Create"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    MAIN PAGE
// ============================================================ */

// export default function AttendanceAlertsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const initialPage = parseInt(searchParams.get("page") || "1", 10) || 1;
//   const initialSearch = searchParams.get("search") || "";
//   const initialType = searchParams.get("type") || "";
//   const initialRead = searchParams.get("read") || "";

//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showForm, setShowForm] = useState(false);

//   const [page, setPage] = useState(initialPage);
//   const [searchInput, setSearchInput] = useState(initialSearch);
//   const [search, setSearch] = useState(initialSearch);
//   const [filterType, setFilterType] = useState(initialType);
//   const [filterRead, setFilterRead] = useState(initialRead);

//   const [selectedIds, setSelectedIds] = useState(new Set());

//   const reqIdRef = useRef(0);

//   /* URL sync */
//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (page > 1) params.set("page", String(page));
//     if (search) params.set("search", search);
//     if (filterType) params.set("type", filterType);
//     if (filterRead !== "") params.set("read", filterRead);
//     const qs = params.toString();
//     router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
//   }, [page, search, filterType, filterRead, pathname, router]);

//   /* auto-dismiss */
//   useEffect(() => {
//     if (!error && !success) return;
//     const t = setTimeout(() => { setError(""); setSuccess(""); }, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [error, success]);

//   /* debounced search */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* fetch list */
//   const fetchList = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const params = { page, page_size: PAGE_SIZE };
//       if (search) params.search = search;
//       if (filterType) params.alert_type = filterType;
//       if (filterRead !== "") params.is_read = filterRead === "true";

//       const res = await api.get("/api/v1/attendence/alerts", { params });
//       if (myReqId !== reqIdRef.current) return;

//       const data = res?.data ?? {};
//       setList(Array.isArray(data.alerts) ? data.alerts : []);
//       setTotal(Number(data.total) || 0);
//       setSelectedIds(new Set());
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, [page, search, filterType, filterRead]);

//   useEffect(() => { fetchList(); }, [fetchList]);

//   /* actions */
//   const markRead = async (alertId) => {
//     const prev = list;
//     setList((cur) => cur.map((r) => (r.alert_id === alertId ? { ...r, is_read: true } : r)));
//     try {
//       await api.put(`/api/v1/attendence/alert/${alertId}/read`);
//     } catch (err) {
//       setList(prev);
//       setError(formatApiError(err));
//     }
//   };

//   const markManyRead = async () => {
//     if (selectedIds.size === 0) return;
//     const ids = Array.from(selectedIds);
//     const prev = list;
//     setList((cur) => cur.map((r) => (selectedIds.has(r.alert_id) ? { ...r, is_read: true } : r)));
//     setSelectedIds(new Set());
//     try {
//       await Promise.all(ids.map((id) => api.put(`/api/v1/attendence/alert/${id}/read`).catch(() => null)));
//       setSuccess(`${ids.length} alert(s) marked as read`);
//     } catch (err) {
//       setList(prev);
//       setError(formatApiError(err));
//     }
//   };

//   const runAutoAbsent = async () => {
//     if (!window.confirm("Are you sure?\n\nThis will mark ALL employees without a punch as ABSENT for today. This action cannot be undone.")) return;
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       const res = await api.post("/api/v1/attendence/run-auto-absent");
//       const data = res?.data ?? {};
//       setSuccess(`Auto-absent ran: ${data.absent_marked ?? 0} absent, ${data.weekoff_marked ?? 0} weekoff, ${data.holiday_marked ?? 0} holiday`);
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const exportCsv = () => {
//     if (list.length === 0) { setError("Nothing to export"); return; }
//     const headers = ["Date", "Type", "Employee", "Message", "Read"];
//     const rows = list.map((r) => [
//       formatDate(r.alert_date),
//       getTypeLabel(r.alert_type),
//       r.employee_id || "",
//       (r.message || "").replace(/"/g, '""'),
//       r.is_read ? "Yes" : "No",
//     ]);
//     const csv = [
//       headers.join(","),
//       ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `attendance-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     setSuccess("Exported successfully");
//   };

//   const clearFilters = () => {
//     setSearchInput("");
//     setFilterType("");
//     setFilterRead("");
//     setPage(1);
//   };

//   const toggleSelectAll = (checked) => {
//     if (checked) setSelectedIds(new Set(list.map((r) => r.alert_id)));
//     else setSelectedIds(new Set());
//   };

//   const toggleOne = (id) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id); else next.add(id);
//       return next;
//     });
//   };

//   const hasActiveFilters = searchInput || filterType || filterRead !== "";
//   const allSelected = list.length > 0 && selectedIds.size === list.length;
//   const someSelected = selectedIds.size > 0;

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       {/* HEADER */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Alerts</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Late, absent, geo violation & more
//             {total > 0 && (
//               <span className="ml-2 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#6b7280]">
//                 {total} total
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <button type="button" onClick={fetchList} disabled={loading}
//             className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">
//             ↻ Refresh
//           </button>
//           <button type="button" onClick={exportCsv} disabled={list.length === 0}
//             className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">
//             ⬇ Export
//           </button>
//           <button type="button" disabled={saving} onClick={runAutoAbsent}
//             className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">
//             {saving ? "Running..." : "Run Auto Absent"}
//           </button>
//           <button type="button" onClick={() => setShowForm(true)}
//             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]">
//             + Add Alert
//           </button>
//         </div>
//       </div>

//       {/* NOTIFICATIONS */}
//       {error && (
//         <div className="mb-4 flex items-start justify-between rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]" role="alert">
//           <span>{error}</span>
//           <button onClick={() => setError("")} className="ml-3 text-[#b91c1c] hover:text-[#7f1d1d]">✕</button>
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 flex items-start justify-between rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
//           <span>{success}</span>
//           <button onClick={() => setSuccess("")} className="ml-3 text-green-700 hover:text-green-900">✕</button>
//         </div>
//       )}

//       {/* TABLE CARD */}
//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         {/* FILTER BAR */}
//         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-1 flex-wrap items-center gap-2">
//             <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
//               <input
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 placeholder="Search by employee or message..."
//                 className="w-full rounded-md border border-[#d1d5db] pl-9 pr-9 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//               />
//               <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
//               </svg>
//               {searchInput && (
//                 <button type="button" onClick={() => setSearchInput("")}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]">✕</button>
//               )}
//             </div>

//             <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
//               className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none">
//               <option value="">All Types</option>
//               {ALERT_TYPES.map((t) => (
//                 <option key={t.value} value={t.value}>{t.label}</option>
//               ))}
//             </select>

//             <select value={filterRead} onChange={(e) => { setFilterRead(e.target.value); setPage(1); }}
//               className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none">
//               <option value="">All</option>
//               <option value="false">Unread</option>
//               <option value="true">Read</option>
//             </select>

//             {hasActiveFilters && (
//               <button type="button" onClick={clearFilters}
//                 className="rounded-md px-3 py-2 text-sm font-medium text-[#E42527] hover:bg-[#fef2f2]">
//                 Clear filters
//               </button>
//             )}
//           </div>

//           {someSelected && (
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-[#6b7280]">{selectedIds.size} selected</span>
//               <button type="button" onClick={markManyRead}
//                 className="rounded-md bg-[#E42527] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c91f21]">
//                 Mark as read
//               </button>
//             </div>
//           )}
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           {loading ? (
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="w-10 px-5 py-3" />
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Message</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
//               </tbody>
//             </table>
//           ) : list.length === 0 ? (
//             <EmptyState onAdd={() => setShowForm(true)} />
//           ) : (
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="w-10 px-5 py-3">
//                     <input type="checkbox" checked={allSelected} onChange={(e) => toggleSelectAll(e.target.checked)}
//                       className="h-4 w-4 cursor-pointer rounded border-[#d1d5db] accent-[#E42527]" />
//                   </th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Message</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((row) => {
//                   const id = row.alert_id;
//                   const isSel = selectedIds.has(id);
//                   return (
//                     <tr key={id} className={`transition-colors ${isSel ? "bg-[#fff5f5]" : "hover:bg-[#fafafa]"}`}>
//                       <td className="px-5 py-3.5">
//                         <input type="checkbox" checked={isSel} onChange={() => toggleOne(id)}
//                           className="h-4 w-4 cursor-pointer rounded border-[#d1d5db] accent-[#E42527]" />
//                       </td>
//                       <td className="px-5 py-3.5 whitespace-nowrap text-[#374151]">
//                         <div>{formatDate(row.alert_date)}</div>
//                         {row.created_at && (
//                           <div className="text-[11px] text-[#9ca3af]">
//                             {formatDateTime(row.created_at).split(", ")[1] || ""}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-5 py-3.5">
//                         <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getTypeBadge(row.alert_type)}`}>
//                           {getTypeLabel(row.alert_type)}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3.5 text-[#374151]">
//                         {row.employee_id || <span className="text-[#9ca3af]">—</span>}
//                       </td>
//                       <td className="max-w-[280px] px-5 py-3.5 text-[#6b7280]">
//                         <span className="line-clamp-2" title={row.message || ""}>{row.message || "—"}</span>
//                       </td>
//                       <td className="px-5 py-3.5">
//                         {row.is_read ? (
//                           <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
//                             <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Read
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
//                             <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Unread
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-5 py-3.5 text-right">
//                         {!row.is_read ? (
//                           <button type="button" onClick={() => markRead(id)}
//                             className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]">
//                             Mark read
//                           </button>
//                         ) : (
//                           <span className="text-xs text-[#d1d5db]">—</span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {!loading && list.length > 0 && (
//           <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
//         )}
//       </div>

//       <AddAlertModal
//         open={showForm}
//         onClose={() => setShowForm(false)}
//         onCreated={() => {
//           setShowForm(false);
//           setSuccess("Alert created");
//           setPage(1);
//           fetchList();
//         }}
//         saving={saving}
//         setSaving={setSaving}
//         setError={setError}
//       />
//     </div>
//   );
// }


"use client";

/**
 * AlertsPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ Auto-refresh (30s polling — toggleable)
 *  ✓ Unread count badge in header
 *  ✓ Alert detail drawer (click row → view full message)
 *  ✓ Multi-type filter (chips, not dropdown)
 *  ✓ Date range filter (from/to)
 *  ✓ Employee filter (admin only)
 *  ✓ CSV export of filtered data
 *  ✓ Per-row delete
 *  ✓ Bulk mark-read + bulk delete
 *  ✓ Role-aware (admin sees all, employee sees own)
 *  ✓ Mobile responsive
 *  ✓ Timezone-aware timestamps
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
const AUTO_REFRESH_MS = 30_000;

const ALERT_TYPES = [
  { value: "late", label: "Late Arrival", icon: "⏰", tone: "amber" },
  { value: "absent", label: "Absent", icon: "❌", tone: "red" },
  { value: "missing_punch", label: "Missing Punch", icon: "⚠️", tone: "orange" },
  { value: "geo_violation", label: "Geo Violation", icon: "📍", tone: "purple" },
  { value: "face_mismatch", label: "Face Mismatch", icon: "🧑", tone: "pink" },
  { value: "consecutive_absent", label: "Consecutive Absent", icon: "📉", tone: "rose" },
  { value: "geo_config_missing", label: "Geo Config Missing", icon: "🔧", tone: "slate" },
];

const TYPE_MAP = Object.fromEntries(ALERT_TYPES.map((t) => [t.value, t]));

const READ_FILTERS = [
  { value: "", label: "All" },
  { value: "false", label: "Unread" },
  { value: "true", label: "Read" },
];

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

const formatDateTime = (v, tz) => {
  const d = safeDate(v);
  if (!d) return "—";
  try {
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
  if (Array.isArray(data.alerts))
    return { items: data.alerts, total: Number(data.total) || data.alerts.length };
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
    return { id, name, email: e.email || e.company_email || "", user_id: e.user_id || id };
  });
};

const typeBadgeClass = (t) => {
  const map = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const tone = TYPE_MAP[t]?.tone || "slate";
  return map[tone] || map.slate;
};

const typeLabel = (t) => TYPE_MAP[t]?.label || t || "—";
const typeIcon = (t) => TYPE_MAP[t]?.icon || "•";

const csvEscape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

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

function EmployeeDropdown({ value, onChange, options, placeholder = "All employees" }) {
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
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm focus:border-red-500 focus:outline-none"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {selected ? selected.name : placeholder}
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
        <div className="absolute z-40 mt-1 w-full min-w-[240px] rounded-lg border border-slate-200 bg-white shadow-lg">
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

function AlertDetailDrawer({ alert, onClose, onMarkRead, onDelete, tz, getEmpName }) {
  useEffect(() => {
    if (!alert) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">Alert Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Type badge */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${typeBadgeClass(
                alert.alert_type
              )}`}
            >
              <span>{typeIcon(alert.alert_type)}</span>
              <span>{typeLabel(alert.alert_type)}</span>
            </span>
          </div>

          {/* Info list */}
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-xs font-medium text-slate-500">Date</dt>
              <dd className="text-right text-slate-800">
                {formatDate(alert.alert_date, tz)}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-xs font-medium text-slate-500">Employee</dt>
              <dd className="text-right text-slate-800">
                {alert.employee_id ? getEmpName(alert.employee_id) : "—"}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-xs font-medium text-slate-500">Status</dt>
              <dd className="text-right">
                {alert.is_read ? (
                  <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                    Read
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Unread
                  </span>
                )}
              </dd>
            </div>

            {alert.notified_to && (
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <dt className="text-xs font-medium text-slate-500">Notified To</dt>
                <dd className="text-right text-slate-800">
                  {getEmpName(alert.notified_to)}
                </dd>
              </div>
            )}

            {alert.created_at && (
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <dt className="text-xs font-medium text-slate-500">Created</dt>
                <dd className="text-right text-slate-800">
                  {formatDateTime(alert.created_at, tz)}
                </dd>
              </div>
            )}
          </dl>

          {/* Message */}
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Message
            </h3>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="whitespace-pre-line text-sm text-slate-700">
                {alert.message || "No additional message"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={() => onDelete(alert)}
            className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
          {!alert.is_read && (
            <button
              type="button"
              onClick={() => onMarkRead(alert)}
              className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Mark as read
            </button>
          )}
          {alert.is_read && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Close
            </button>
          )}
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
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function AttendanceAlertsPage() {
  const user = useAuthStore((s) => s.user);
  const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";
  const role = String(user?.role?.value || user?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";

  /* list */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  /* filters */
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilters, setTypeFilters] = useState(new Set());
  const [readFilter, setReadFilter] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [fromDate, setFromDate] = useState(getMonthStartIso());
  const [toDate, setToDate] = useState(getTodayIso());

  /* employees */
  const [employees, setEmployees] = useState([]);

  /* ui */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  /* guard */
  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOAD EMPLOYEES ══════════════ */
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

  /* ══════════════ FETCH LIST ══════════════ */
  const fetchList = useCallback(
    async ({ silent = false } = {}) => {
      const myReqId = ++reqIdRef.current;
      if (!silent) setLoading(true);
      if (!silent) setError("");

      try {
        const params = {
          page,
          page_size: PAGE_SIZE,
          from_date: fromDate || undefined,
          to_date: toDate || undefined,
        };
        if (search) params.search = search;
        if (readFilter !== "") params.is_read = readFilter === "true";
        if (isAdmin && employeeId) params.employee_id = employeeId;
        if (!isAdmin && user?.employee_id) params.employee_id = user.employee_id;
        if (typeFilters.size === 1) {
          params.alert_type = Array.from(typeFilters)[0];
        }

        const res = await api.get("/api/v1/attendence/alerts", { params });
        if (myReqId !== reqIdRef.current) return;

        const { items, total: t } = extractList(res);

        // Client-side filter for multi-type selection
        let filtered = items;
        if (typeFilters.size > 1) {
          filtered = items.filter((r) => typeFilters.has(r.alert_type));
        }

        setList(filtered);
        setTotal(t);
        setSelectedIds(new Set());

        // Unread count
        const unread = items.filter((r) => !r.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        if (myReqId !== reqIdRef.current) return;
        if (!silent) setError(formatApiError(err));
        setList([]);
        setTotal(0);
      } finally {
        if (myReqId === reqIdRef.current) setLoading(false);
      }
    },
    [page, search, typeFilters, readFilter, employeeId, fromDate, toDate, isAdmin, user?.employee_id]
  );

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchList();
      return;
    }
    const t = setTimeout(fetchList, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchList]);

  /* ══════════════ AUTO REFRESH ══════════════ */
  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => {
      fetchList({ silent: true });
    }, AUTO_REFRESH_MS);
    return () => clearInterval(t);
  }, [autoRefresh, fetchList]);

  /* ══════════════ HELPERS ══════════════ */
  const getEmpName = useCallback(
    (id) => {
      if (!id) return "—";
      const e = employees.find((x) => x.id === id || x.user_id === id);
      return e ? e.name : id;
    },
    [employees]
  );

  /* ══════════════ ACTIONS ══════════════ */
  const markRead = async (alert) => {
    const id = alert.alert_id;
    const prev = list;
    setList((cur) =>
      cur.map((r) => (r.alert_id === id ? { ...r, is_read: true } : r))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await api.put(`/api/v1/attendence/alert/${id}/read`);
      if (selectedAlert?.alert_id === id) {
        setSelectedAlert((a) => (a ? { ...a, is_read: true } : a));
      }
    } catch (err) {
      setList(prev);
      setUnreadCount((c) => c + 1);
      setError(formatApiError(err));
    }
  };

  const deleteAlert = async (alert) => {
    if (!window.confirm("Delete this alert? This cannot be undone.")) return;
    const id = alert.alert_id;
    const prev = list;
    setList((cur) => cur.filter((r) => r.alert_id !== id));
    setTotal((t) => Math.max(0, t - 1));
    if (selectedAlert?.alert_id === id) setSelectedAlert(null);
    try {
      await api.delete(`/api/v1/delete/attendence/alert/${id}`);
      setSuccess("Alert deleted");
    } catch (err) {
      setList(prev);
      setTotal((t) => t + 1);
      setError(formatApiError(err));
    }
  };

  const markManyRead = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const prev = list;
    setList((cur) =>
      cur.map((r) => (selectedIds.has(r.alert_id) ? { ...r, is_read: true } : r))
    );
    setSelectedIds(new Set());
    try {
      await Promise.all(
        ids.map((id) =>
          api.put(`/api/v1/attendence/alert/${id}/read`).catch(() => null)
        )
      );
      setSuccess(`${ids.length} alert(s) marked as read`);
      fetchList({ silent: true });
    } catch (err) {
      setList(prev);
      setError(formatApiError(err));
    }
  };

  const deleteMany = async () => {
    if (selectedIds.size === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.size} alert(s)?\n\nThis cannot be undone.`
      )
    )
      return;
    const ids = Array.from(selectedIds);
    const prev = list;
    setList((cur) => cur.filter((r) => !selectedIds.has(r.alert_id)));
    setTotal((t) => Math.max(0, t - ids.length));
    setSelectedIds(new Set());
    try {
      await Promise.all(
        ids.map((id) =>
          api.delete(`/api/v1/delete/attendence/alert/${id}`).catch(() => null)
        )
      );
      setSuccess(`${ids.length} alert(s) deleted`);
    } catch (err) {
      setList(prev);
      setError(formatApiError(err));
    }
  };

  const runAutoAbsent = async () => {
    if (
      !window.confirm(
        "Mark all employees without a punch as ABSENT for today?\n\nThis action cannot be undone."
      )
    )
      return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/v1/attendence/run-auto-absent");
      const data = res?.data ?? {};
      setSuccess(
        `Auto-absent: ${data.absent_marked ?? 0} absent · ${data.weekoff_marked ?? 0} weekoff · ${data.holiday_marked ?? 0} holiday`
      );
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    if (list.length === 0) {
      setError("Nothing to export");
      return;
    }
    const headers = [
      "Date",
      "Time",
      "Type",
      "Employee",
      "Message",
      "Notified To",
      "Status",
    ];
    const rows = list.map((r) => [
      formatDate(r.alert_date, tz),
      r.created_at ? formatDateTime(r.created_at, tz).split(", ")[1] || "" : "",
      typeLabel(r.alert_type),
      r.employee_id ? getEmpName(r.employee_id) : "",
      r.message || "",
      r.notified_to ? getEmpName(r.notified_to) : "",
      r.is_read ? "Read" : "Unread",
    ]);
    const csv = [
      headers.map(csvEscape).join(","),
      ...rows.map((row) => row.map(csvEscape).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alerts-${fromDate}-to-${toDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccess(`Exported ${list.length} alert(s)`);
  };

  /* ══════════════ SELECTION ══════════════ */
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(
      checked ? new Set(list.map((r) => r.alert_id)) : new Set()
    );
  };

  /* ══════════════ FILTER CHIPS ══════════════ */
  const toggleTypeFilter = (val) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setTypeFilters(new Set());
    setReadFilter("");
    setEmployeeId("");
    setFromDate(getMonthStartIso());
    setToDate(getTodayIso());
    setPage(1);
  };

  /* ══════════════ DERIVED ══════════════ */
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allSelected = list.length > 0 && selectedIds.size === list.length;
  const someSelected = selectedIds.size > 0;

  const hasActiveFilters =
    !!searchInput ||
    typeFilters.size > 0 ||
    readFilter !== "" ||
    !!employeeId ||
    fromDate !== getMonthStartIso() ||
    toDate !== getTodayIso();

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">Alerts</h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Late, absent, geo violation, face mismatch and more
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 accent-red-600"
              />
              Auto-refresh
            </label>
            <button
              type="button"
              onClick={exportCsv}
              disabled={list.length === 0}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              ⬇ Export
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={runAutoAbsent}
                disabled={loading}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Run Auto-Absent
              </button>
            )}
            <button
              type="button"
              onClick={fetchList}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        {/* Toast */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Row 1: search + date range + employee */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search message or employee..."
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2 text-sm focus:border-red-500 focus:outline-none"
                />
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div>
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

          {/* Row 2: type chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium text-slate-500">Type:</span>
            {ALERT_TYPES.map((t) => {
              const active = typeFilters.has(t.value);
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleTypeFilter(t.value)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                    active
                      ? `${typeBadgeClass(t.value)} ring-1 ring-offset-1`
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Row 3: read filter + employee (admin) + clear */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">Show:</span>
            {READ_FILTERS.map((r) => {
              const active = readFilter === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => {
                    setReadFilter(r.value);
                    setPage(1);
                  }}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                    active
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}

            {isAdmin && (
              <div className="ml-2 w-56">
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

        {/* Bulk bar */}
        {someSelected && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">
              {selectedIds.size} alert{selectedIds.size !== 1 ? "s" : ""} selected
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
                onClick={deleteMany}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={markManyRead}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Mark as read
              </button>
            </div>
          </div>
        )}

        {/* Table card */}
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
                  🔔
                </div>
                <p className="text-sm font-medium text-slate-700">No alerts found</p>
                <p className="text-xs text-slate-500">
                  Alerts will appear here as they are triggered
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="w-10 px-5 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                      />
                    </th>
                    <th className="px-5 py-3 font-medium text-slate-500">Date & Time</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Type</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Message</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row) => {
                    const id = row.alert_id;
                    const isSel = selectedIds.has(id);
                    return (
                      <tr
                        key={id}
                        onClick={(e) => {
                          if (e.target.type === "checkbox") return;
                          setSelectedAlert(row);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSel
                            ? "bg-red-50/40"
                            : row.is_read
                            ? "hover:bg-slate-50"
                            : "bg-amber-50/30 hover:bg-amber-50/60"
                        }`}
                      >
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleSelect(id)}
                            className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                          />
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <div className="text-slate-700">
                            {formatDate(row.alert_date, tz)}
                          </div>
                          {row.created_at && (
                            <div className="text-[11px] text-slate-400">
                              {formatDateTime(row.created_at, tz).split(", ")[1] || ""}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${typeBadgeClass(
                              row.alert_type
                            )}`}
                          >
                            <span>{typeIcon(row.alert_type)}</span>
                            <span>{typeLabel(row.alert_type)}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700">
                          {row.employee_id ? getEmpName(row.employee_id) : "—"}
                        </td>
                        <td className="max-w-[280px] px-5 py-3.5 text-slate-600">
                          <span className="line-clamp-2" title={row.message || ""}>
                            {row.message || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {row.is_read ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Unread
                            </span>
                          )}
                        </td>
                        <td
                          className="px-5 py-3.5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!row.is_read ? (
                            <button
                              type="button"
                              onClick={() => markRead(row)}
                              className="text-xs font-medium text-slate-600 hover:text-red-600"
                            >
                              Mark read
                            </button>
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

      {/* Detail drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onMarkRead={markRead}
        onDelete={deleteAlert}
        tz={tz}
        getEmpName={getEmpName}
      />
    </div>
  );
}