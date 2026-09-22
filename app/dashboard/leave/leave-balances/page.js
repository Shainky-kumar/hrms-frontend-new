
// // "use client";

// // import { useCallback, useEffect, useState } from "react";
// // import { api } from "@/app/lib/api";
// // import { fetchLeaveTypes, getLeaveTypeId, getLeaveTypeName } from "@/app/lib/leaveTypes";
// // import { useAuthStore } from "@/app/store/authStore";

// // const initialForm = {
// //   employee_id: "",
// //   leave_type_id: "",
// //   leave_policy_id: "",
// //   year: new Date().getFullYear(),
// //   total_leaves: 0,
// //   leaves_taken: 0,
// //   leaves_pending: 0,
// //   leaves_remaining: 0,
// //   carried_forward: 0,
// //   encashed: 0,
// //   lapsed: 0,
// // };

// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) {
// //     return detail
// //       .map((e) =>
// //         Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
// //       )
// //       .join(" • ");
// //   }
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // };

// // export default function EmployeeLeaveBalancePage() {
// //   const user = useAuthStore((state) => state.user);
// //   const [list, setList] = useState([]);
// //   const [formData, setFormData] = useState(initialForm);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");
// //   const [showForm, setShowForm] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [pageSize] = useState(10);
// //   const [total, setTotal] = useState(0);
// //   const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
// //   const [leaveTypes, setLeaveTypes] = useState([]);
// //   const [selectedBalance, setSelectedBalance] = useState(null);

// //   // HR/admin flag (apne auth role ke hisaab se adjust karo)
// //   const isHrOrAdmin =
// //     user?.role === "HR" ||
// //     user?.role === "ADMIN" ||
// //     user?.role === "hr" ||
// //     user?.role === "admin";

// //   const employeeFromUser =
// //     user?.employee_id ||
// //     user?.employeeId ||
// //     user?.emp_id ||
// //     user?.employee?.employee_id ||
// //     user?.employee?.id ||
// //     user?.profile?.employee_id ||
// //     user?.data?.employee_id ||
// //     "";

// //   const employeeId = employeeFromUser || resolvedEmployeeId;

// //   useEffect(() => {
// //     if (employeeFromUser) return;

// //     const userId = user?.user_id || user?.userId || user?.id || user?.sub;
// //     if (!userId) return;

// //     let cancelled = false;

// //     api
// //       .get("/api/v1/get/employees")
// //       .then((response) => {
// //         const data = response?.data?.data ?? response?.data ?? [];
// //         const employees = Array.isArray(data)
// //           ? data
// //           : data?.items ?? data?.results ?? data?.employees ?? [];
// //         const employee = employees.find(
// //           (item) => String(item.user_id ?? item.userId ?? "") === String(userId)
// //         );
// //         if (!cancelled) {
// //           setResolvedEmployeeId(employee?.employee_id || employee?.id || "");
// //         }
// //       })
// //       .catch(() => {
// //         if (!cancelled) setResolvedEmployeeId("");
// //       });

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [employeeFromUser, user]);

// //   useEffect(() => {
// //     fetchLeaveTypes().then(setLeaveTypes).catch(() => setLeaveTypes([]));
// //   }, []);

// //   const fetchData = useCallback(async () => {
// //     if (!employeeId) {
// //       setList([]);
// //       setTotal(0);
// //       setLoading(false);
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get(`/api/v1/leave/balance/${employeeId}`, {
// //         params: { page, page_size: pageSize, search },
// //       });

// //       // Backend response:
// //       // { success, total, page, page_size, employee_leave_balances: [...] }
// //       const payload = res.data?.data ?? res.data ?? {};
// //       const items = Array.isArray(payload)
// //         ? payload
// //         : payload?.employee_leave_balances ??
// //           payload?.items ??
// //           payload?.results ??
// //           payload?.balances ??
// //           payload?.leave_balances ??
// //           [];

// //       setList(Array.isArray(items) ? items : []);
// //       setTotal(
// //         res.data?.total ??
// //           payload?.total ??
// //           (Array.isArray(items) ? items.length : 0)
// //       );
// //     } catch (err) {
// //       setError(formatApiError(err));
// //       setList([]);
// //       setTotal(0);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [employeeId, page, pageSize, search]);

// //   useEffect(() => {
// //     const t = setTimeout(() => fetchData(), 0);
// //     return () => clearTimeout(t);
// //   }, [fetchData]);

// //   const handleChange = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const openAdd = () => {
// //     setEditId(null);
// //     setFormData({ ...initialForm, employee_id: employeeId });
// //     setError("");
// //     setShowForm(true);
// //   };

// //   const openEdit = (item) => {
// //     setEditId(item.balance_id || item.id);
// //     setFormData({
// //       ...initialForm,
// //       employee_id: item.employee_id || employeeId,
// //       leave_type_id: item.leave_type_id || "",
// //       leave_policy_id: item.leave_policy_id || "",
// //       year: item.year ?? new Date().getFullYear(),
// //       total_leaves: item.total_leaves ?? 0,
// //       leaves_taken: item.leaves_taken ?? 0,
// //       leaves_pending: item.leaves_pending ?? 0,
// //       leaves_remaining: item.leaves_remaining ?? 0,
// //       carried_forward: item.carried_forward ?? 0,
// //       encashed: item.encashed ?? 0,
// //       lapsed: item.lapsed ?? 0,
// //     });
// //     setError("");
// //     setShowForm(true);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);
// //     setError("");
// //     try {
// //       const payload = {
// //         employee_id: employeeId || formData.employee_id,
// //         leave_type_id: formData.leave_type_id,
// //         leave_policy_id: formData.leave_policy_id,
// //         year: Number(formData.year) || new Date().getFullYear(),
// //         total_leaves: Number(formData.total_leaves) || 0,
// //         leaves_taken: Number(formData.leaves_taken) || 0,
// //         leaves_pending: Number(formData.leaves_pending) || 0,
// //         leaves_remaining: Number(formData.leaves_remaining) || 0,
// //         carried_forward: Number(formData.carried_forward) || 0,
// //         encashed: Number(formData.encashed) || 0,
// //         lapsed: Number(formData.lapsed) || 0,
// //       };

// //       if (editId) {
// //         // backend update sirf balance fields leta hai
// //         await api.put(`/api/v1/leave/balance/${editId}`, {
// //           total_leaves: payload.total_leaves,
// //           leaves_taken: payload.leaves_taken,
// //           leaves_pending: payload.leaves_pending,
// //           leaves_remaining: payload.leaves_remaining,
// //           carried_forward: payload.carried_forward,
// //           encashed: payload.encashed,
// //           lapsed: payload.lapsed,
// //         });
// //       } else {
// //         await api.post("/api/v1/leave/balance", payload);
// //       }

// //       setShowForm(false);
// //       setFormData({ ...initialForm, employee_id: employeeId });
// //       setEditId(null);
// //       await fetchData();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const totalPages = Math.ceil(total / pageSize) || 1;

// //   const getTypeName = (leaveTypeId) =>
// //     getLeaveTypeName(
// //       leaveTypes.find(
// //         (t) => String(getLeaveTypeId(t)) === String(leaveTypeId)
// //       ) || { leave_type_id: leaveTypeId }
// //     );

// //   return (
// //     <div>
// //       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-xl font-semibold text-slate-800">
// //             Employee Leave Balance
// //           </h1>
// //           <p className="mt-0.5 text-sm text-slate-500">
// //             Balances are created automatically from Leave Policy / Provision.
// //             Manual add is only for special correction.
// //           </p>
// //         </div>

// //         {isHrOrAdmin && (
// //           <button
// //             onClick={openAdd}
// //             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// //           >
// //             + Add Balance Record
// //           </button>
// //         )}
// //       </div>

// //       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
// //           <input
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value);
// //               setPage(1);
// //             }}
// //             placeholder="Search by leave type id..."
// //             className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
// //           />
// //           <span className="text-sm text-slate-500">{total} records</span>
// //         </div>

// //         {error && !showForm && (
// //           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// //             {error}
// //           </div>
// //         )}

// //         {!employeeId && !loading && (
// //           <div className="py-16 text-center text-sm text-slate-500">
// //             Employee ID not found for current user.
// //           </div>
// //         )}

// //         {!loading && employeeId && list.length > 0 && (
// //           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
// //             {list.map((item, index) => (
// //               <button
// //                 type="button"
// //                 key={item.balance_id || item.id || index}
// //                 onClick={() => setSelectedBalance(item)}
// //                 className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E42527]/50 hover:shadow-md"
// //               >
// //                 <div className="flex items-start justify-between gap-3">
// //                   <div>
// //                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// //                       {item.year ?? "—"} leave balance
// //                     </p>
// //                     <h3 className="mt-1 text-base font-semibold text-slate-800">
// //                       {getTypeName(item.leave_type_id)}
// //                     </h3>
// //                   </div>
// //                   <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
// //                     {item.leaves_remaining ?? 0} left
// //                   </span>
// //                 </div>

// //                 <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
// //                   <div>
// //                     <p className="text-xs text-slate-400">Total</p>
// //                     <p className="mt-0.5 font-semibold text-slate-700">
// //                       {item.total_leaves ?? 0}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-slate-400">Taken</p>
// //                     <p className="mt-0.5 font-semibold text-slate-700">
// //                       {item.leaves_taken ?? 0}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-slate-400">Pending</p>
// //                     <p className="mt-0.5 font-semibold text-slate-700">
// //                       {item.leaves_pending ?? 0}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </button>
// //             ))}
// //           </div>
// //         )}

// //         <div>
// //           {loading ? (
// //             <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
// //           ) : employeeId && list.length === 0 ? (
// //             <div className="px-4 py-16 text-center text-sm text-slate-500">
// //               <p className="font-medium text-slate-700">No leave balance found</p>
// //               <p className="mt-2">
// //                 Pehle Leave Policy banao / Provision chalao.
// //                 <br />
// //                 Policy create ke baad balances auto assign hote hain.
// //               </p>
// //             </div>
// //           ) : null}
// //         </div>

// //         {totalPages > 1 && (
// //           <div className="flex justify-between border-t border-slate-100 px-4 py-3">
// //             <span className="text-sm text-slate-500">
// //               Page {page} of {totalPages}
// //             </span>
// //             <div className="flex gap-2">
// //               <button
// //                 disabled={page <= 1}
// //                 onClick={() => setPage((p) => p - 1)}
// //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Prev
// //               </button>
// //               <button
// //                 disabled={page >= totalPages}
// //                 onClick={() => setPage((p) => p + 1)}
// //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Add / Edit Modal (HR only mostly) */}
// //       {showForm && (
// //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
// //           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-base font-semibold text-slate-800">
// //                 {editId ? "Edit Leave Balance" : "Add Leave Balance"}
// //               </h2>
// //               <button
// //                 onClick={() => {
// //                   setShowForm(false);
// //                   setError("");
// //                 }}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={handleSubmit}>
// //               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
// //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Employee ID *
// //                     </label>
// //                     <input
// //                       required
// //                       value={formData.employee_id || employeeId}
// //                       onChange={(e) => handleChange("employee_id", e.target.value)}
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Leave Policy ID *
// //                     </label>
// //                     <input
// //                       required
// //                       value={formData.leave_policy_id}
// //                       onChange={(e) => handleChange("leave_policy_id", e.target.value)}
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Leave Type *
// //                     </label>
// //                     <select
// //                       required
// //                       value={formData.leave_type_id}
// //                       onChange={(e) => handleChange("leave_type_id", e.target.value)}
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                     >
// //                       <option value="">Select leave type</option>
// //                       {leaveTypes.map((leaveType) => (
// //                         <option key={getLeaveTypeId(leaveType)} value={getLeaveTypeId(leaveType)}>
// //                           {getLeaveTypeName(leaveType)}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Year *
// //                     </label>
// //                     <input
// //                       required
// //                       type="number"
// //                       value={formData.year}
// //                       onChange={(e) => handleChange("year", e.target.value)}
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// //                   {[
// //                     ["total_leaves", "Total"],
// //                     ["leaves_taken", "Taken"],
// //                     ["leaves_pending", "Pending"],
// //                     ["leaves_remaining", "Remaining"],
// //                     ["carried_forward", "Carried Forward"],
// //                     ["encashed", "Encashed"],
// //                     ["lapsed", "Lapsed"],
// //                   ].map(([key, label]) => (
// //                     <div key={key}>
// //                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                         {label}
// //                       </label>
// //                       <input
// //                         type="number"
// //                         value={formData[key]}
// //                         onChange={(e) => handleChange(key, e.target.value)}
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                       />
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {error && (
// //                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// //                     {error}
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForm(false)}
// //                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving..." : editId ? "Update" : "Submit"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {selectedBalance && (
// //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// //           <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <div>
// //                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// //                   {selectedBalance.year ?? "—"} leave balance
// //                 </p>
// //                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
// //                   {getTypeName(selectedBalance.leave_type_id)}
// //                 </h2>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedBalance(null)}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
// //               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
// //                 {[
// //                   ["Employee ID", selectedBalance.employee_id],
// //                   ["Policy ID", selectedBalance.leave_policy_id],
// //                   ["Year", selectedBalance.year],
// //                   ["Total", selectedBalance.total_leaves],
// //                   ["Taken", selectedBalance.leaves_taken],
// //                   ["Pending", selectedBalance.leaves_pending],
// //                   ["Remaining", selectedBalance.leaves_remaining],
// //                   ["Carried Forward", selectedBalance.carried_forward],
// //                   ["Encashed", selectedBalance.encashed],
// //                   ["Lapsed", selectedBalance.lapsed],
// //                 ].map(([label, value]) => (
// //                   <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5">
// //                     <p className="text-xs text-slate-400">{label}</p>
// //                     <p className="mt-1 break-all text-sm font-medium text-slate-800">
// //                       {value ?? "—"}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedBalance(null)}
// //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// //               >
// //                 Close
// //               </button>
// //               {isHrOrAdmin && (
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setSelectedBalance(null);
// //                     openEdit(selectedBalance);
// //                   }}
// //                   className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// //                 >
// //                   Edit balance
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// //  new code

// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";
// import {
//   fetchLeaveTypes,
//   getLeaveTypeId,
//   getLeaveTypeName,
// } from "@/app/lib/leaveTypes";
// import { useAuthStore } from "@/app/store/authStore";

// /* ------------------------------------------------------------------ */
// /*  Constants                                                          */
// /* ------------------------------------------------------------------ */

// const CURRENT_YEAR = new Date().getFullYear();
// const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 3 + i);

// const HR_ROLES = new Set([
//   "hr",
//   "hr_manager",
//   "hr-manager",
//   "admin",
//   "super_admin",
//   "super-admin",
//   "superadmin",
//   "owner",
//   "payroll_officer",
//   "payroll-officer",
//   "finance",
//   "manager",
//   "team_lead",
//   "team-lead",
//   "recruiter",
// ]);

// const initialForm = {
//   employee_id: "",
//   leave_type_id: "",
//   leave_policy_id: "",
//   year: CURRENT_YEAR,
//   total_leaves: 0,
//   leaves_taken: 0,
//   leaves_pending: 0,
//   leaves_remaining: 0,
//   carried_forward: 0,
//   encashed: 0,
//   lapsed: 0,
// };

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                            */
// /* ------------------------------------------------------------------ */

// const toNumber = (v, fallback = 0) => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// };

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) =>
//         Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
//       )
//       .join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   if (err?.response?.data?.message) return err.response.data.message;
//   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
//   if (err?.response?.status === 401) return "Session expired. Please login again.";
//   if (err?.response?.status === 403) return "You don't have permission for this action.";
//   return err?.message || "Something went wrong";
// };

// const isCancel = (err) =>
//   err?.name === "CanceledError" ||
//   err?.code === "ERR_CANCELED" ||
//   err?.name === "AbortError";

// const pickList = (payload) => {
//   if (Array.isArray(payload)) return payload;
//   if (!payload || typeof payload !== "object") return [];
//   return (
//     payload.items ??
//     payload.results ??
//     payload.data ??
//     payload.employees ??
//     payload.leave_types ??
//     payload.leave_policies ??
//     []
//   );
// };

// const hasHrAccess = (user) => {
//   if (!user) return false;
//   const roles = [
//     user.role,
//     ...(Array.isArray(user.roles) ? user.roles : []),
//     ...(Array.isArray(user.user_roles) ? user.user_roles : []),
//   ]
//     .filter(Boolean)
//     .map((r) =>
//       String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
//         .toLowerCase()
//         .trim()
//     );
//   return roles.some((r) => HR_ROLES.has(r));
// };

// const pickEmployeeId = (u) =>
//   u?.employee_id ||
//   u?.employeeId ||
//   u?.emp_id ||
//   u?.employee?.employee_id ||
//   u?.profile?.employee_id ||
//   u?.data?.employee_id ||
//   "";

// const balanceRowKey = (item) =>
//   item?.balance_id ?? item?.leave_balance_id ?? item?.id ?? null;

// /* ------------------------------------------------------------------ */
// /*  Component                                                          */
// /* ------------------------------------------------------------------ */

// export default function EmployeeLeaveBalancePage() {
//   const user = useAuthStore((state) => state.user);
//   const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

//   /* --------------- state --------------- */
//   const [list, setList] = useState([]);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [yearFilter, setYearFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
//   const [resolvedEmployeeName, setResolvedEmployeeName] = useState("");
//   const [selectedBalance, setSelectedBalance] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);

//   const abortRef = useRef(null);

//   /* --------------- derive employee id --------------- */
//   const employeeFromUser = useMemo(() => pickEmployeeId(user), [user]);
//   const employeeId = employeeFromUser || resolvedEmployeeId;
//   const isSelfView = Boolean(employeeFromUser) && !isHrOrAdmin;

//   /* --------------- resolve employee id if not in auth --------------- */
//   useEffect(() => {
//     if (employeeFromUser) return;
//     const userId = user?.user_id || user?.userId || user?.id || user?.sub;
//     if (!userId) return;

//     let cancelled = false;
//     api
//       .get("/api/v1/get/employees")
//       .then((response) => {
//         const data = response?.data?.data ?? response?.data ?? [];
//         const employees = pickList(data);
//         const employee = employees.find(
//           (item) => String(item.user_id ?? item.userId ?? "") === String(userId)
//         );
//         if (!cancelled) {
//           setResolvedEmployeeId(
//             employee?.employee_id || employee?.emp_id || employee?.id || ""
//           );
//           setResolvedEmployeeName(
//             employee?.employee_name || employee?.name || employee?.full_name || ""
//           );
//         }
//       })
//       .catch(() => {
//         if (!cancelled) setResolvedEmployeeId("");
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [employeeFromUser, user]);

//   /* --------------- load dropdown data --------------- */
//   useEffect(() => {
//     let cancelled = false;
//     fetchLeaveTypes()
//       .then((types) => {
//         if (!cancelled) setLeaveTypes(Array.isArray(types) ? types : []);
//       })
//       .catch(() => {
//         if (!cancelled) setLeaveTypes([]);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   useEffect(() => {
//     let cancelled = false;
//     api
//       .get("/api/v1/leave/policies", { params: { page_size: 200 } })
//       .then((res) => {
//         if (cancelled) return;
//         const payload = res?.data?.data ?? res?.data ?? {};
//         setPolicies(pickList(payload));
//       })
//       .catch(() => {
//         if (!cancelled) setPolicies([]);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* --------------- debounce search --------------- */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* --------------- fetch balances --------------- */
//   const fetchData = useCallback(async () => {
//     if (!employeeId) {
//       setList([]);
//       setTotal(0);
//       setLoading(false);
//       return;
//     }

//     if (abortRef.current) abortRef.current.abort();
//     const controller = new AbortController();
//     abortRef.current = controller;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get(`/api/v1/leave/balance/${employeeId}`, {
//         params: {
//           page,
//           page_size: pageSize,
//           ...(search ? { search } : {}),
//           ...(yearFilter ? { year: yearFilter } : {}),
//         },
//         signal: controller.signal,
//       });

//       const payload = res.data?.data ?? res.data ?? {};
//       const items = Array.isArray(payload)
//         ? payload
//         : payload?.employee_leave_balances ??
//           payload?.leave_balances ??
//           payload?.balances ??
//           pickList(payload);

//       setList(Array.isArray(items) ? items : []);
//       setTotal(
//         res.data?.total ?? payload?.total ?? (Array.isArray(items) ? items.length : 0)
//       );
//     } catch (err) {
//       if (isCancel(err)) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (!controller.signal.aborted) setLoading(false);
//     }
//   }, [employeeId, page, pageSize, search, yearFilter]);

//   useEffect(() => {
//     fetchData();
//     return () => {
//       if (abortRef.current) abortRef.current.abort();
//     };
//   }, [fetchData]);

//   /* --------------- derived: suggested remaining --------------- */
//   const suggestedRemaining = useMemo(() => {
//     const t = toNumber(formData.total_leaves);
//     const taken = toNumber(formData.leaves_taken);
//     const pending = toNumber(formData.leaves_pending);
//     const carried = toNumber(formData.carried_forward);
//     const encashed = toNumber(formData.encashed);
//     const lapsed = toNumber(formData.lapsed);
//     return t + carried - taken - pending - encashed - lapsed;
//   }, [formData]);

//   /* --------------- form handlers --------------- */
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const openAdd = () => {
//     setEditId(null);
//     setFormData({ ...initialForm, employee_id: employeeId });
//     setError("");
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     setEditId(balanceRowKey(item));
//     setFormData({
//       ...initialForm,
//       employee_id: item.employee_id || employeeId,
//       leave_type_id: item.leave_type_id || "",
//       leave_policy_id: item.leave_policy_id || "",
//       year: item.year ?? CURRENT_YEAR,
//       total_leaves: item.total_leaves ?? 0,
//       leaves_taken: item.leaves_taken ?? 0,
//       leaves_pending: item.leaves_pending ?? 0,
//       leaves_remaining: item.leaves_remaining ?? 0,
//       carried_forward: item.carried_forward ?? 0,
//       encashed: item.encashed ?? 0,
//       lapsed: item.lapsed ?? 0,
//     });
//     setError("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;
//     setShowForm(false);
//     setError("");
//     setEditId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (saving) return;

//     // client-side guards
//     const year = toNumber(formData.year);
//     if (year < 2000 || year > CURRENT_YEAR + 5) {
//       setError(`Year must be between 2000 and ${CURRENT_YEAR + 5}`);
//       return;
//     }
//     const total = toNumber(formData.total_leaves);
//     if (total < 0) {
//       setError("Total leaves cannot be negative");
//       return;
//     }

//     setSaving(true);
//     setError("");
//     try {
//       const payload = {
//         employee_id: employeeId || formData.employee_id,
//         leave_type_id: formData.leave_type_id,
//         leave_policy_id: formData.leave_policy_id,
//         year,
//         total_leaves: total,
//         leaves_taken: toNumber(formData.leaves_taken),
//         leaves_pending: toNumber(formData.leaves_pending),
//         leaves_remaining: toNumber(formData.leaves_remaining, suggestedRemaining),
//         carried_forward: toNumber(formData.carried_forward),
//         encashed: toNumber(formData.encashed),
//         lapsed: toNumber(formData.lapsed),
//       };

//       if (editId) {
//         await api.put(`/api/v1/leave/balance/${editId}`, {
//           total_leaves: payload.total_leaves,
//           leaves_taken: payload.leaves_taken,
//           leaves_pending: payload.leaves_pending,
//           leaves_remaining: payload.leaves_remaining,
//           carried_forward: payload.carried_forward,
//           encashed: payload.encashed,
//           lapsed: payload.lapsed,
//         });
//       } else {
//         await api.post("/api/v1/leave/balance", payload);
//       }

//       setShowForm(false);
//       setFormData({ ...initialForm, employee_id: employeeId });
//       setEditId(null);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     const item = confirmDelete;
//     if (!item) return;
//     const id = balanceRowKey(item);
//     if (!id) {
//       setConfirmDelete(null);
//       setError("Cannot delete: missing balance id.");
//       return;
//     }
//     setDeleting(true);
//     setError("");
//     try {
//       await api.delete(`/api/v1/leave/balance/${id}`);
//       setConfirmDelete(null);
//       setSelectedBalance(null);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//       setConfirmDelete(null);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   /* --------------- pagination --------------- */
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   /* --------------- misc --------------- */
//   const getTypeName = useCallback(
//     (leaveTypeId) => {
//       const found = leaveTypes.find(
//         (t) => String(getLeaveTypeId(t)) === String(leaveTypeId)
//       );
//       if (found) return getLeaveTypeName(found);
//       if (!leaveTypeId) return "—";
//       const asString = String(leaveTypeId);
//       return asString.length > 12 ? `${asString.slice(0, 8)}…` : asString;
//     },
//     [leaveTypes]
//   );

//   /* ---------------------------------------------------------------- */
//   /*  Render                                                           */
//   /* ---------------------------------------------------------------- */

//   return (
//     <div>
//       {/* ---------- header ---------- */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">
//             Employee Leave Balance
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             {resolvedEmployeeName
//               ? `Viewing balances for ${resolvedEmployeeName}.`
//               : "Balances are created automatically from Leave Policy / Provision."}{" "}
//             Manual add is only for special correction.
//           </p>
//         </div>

//         {isHrOrAdmin && (
//           <button
//             type="button"
//             onClick={openAdd}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//           >
//             + Add Balance Record
//           </button>
//         )}
//       </div>

//       {/* ---------- filters ---------- */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search by leave type…"
//               autoComplete="off"
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//             />
//             <select
//               value={yearFilter}
//               onChange={(e) => {
//                 setYearFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//             >
//               <option value="">All years</option>
//               {YEAR_OPTIONS.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-slate-500">{total} records</span>
//             <button
//               type="button"
//               onClick={fetchData}
//               className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {error && !showForm && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {!employeeId && !loading && (
//           <div className="py-16 text-center text-sm text-slate-500">
//             Employee ID not found for current user. Please contact HR.
//           </div>
//         )}

//         {/* ---------- cards ---------- */}
//         {!loading && employeeId && list.length > 0 && (
//           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
//             {list.map((item, index) => (
//               <button
//                 type="button"
//                 key={balanceRowKey(item) || index}
//                 onClick={() => setSelectedBalance(item)}
//                 className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E42527]/50 hover:shadow-md"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="min-w-0">
//                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                       {item.year ?? "—"} leave balance
//                     </p>
//                     <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
//                       {getTypeName(item.leave_type_id)}
//                     </h3>
//                   </div>
//                   <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
//                     {item.leaves_remaining ?? 0} left
//                   </span>
//                 </div>

//                 <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
//                   <div>
//                     <p className="text-xs text-slate-400">Total</p>
//                     <p className="mt-0.5 font-semibold text-slate-700">
//                       {item.total_leaves ?? 0}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400">Taken</p>
//                     <p className="mt-0.5 font-semibold text-slate-700">
//                       {item.leaves_taken ?? 0}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400">Pending</p>
//                     <p className="mt-0.5 font-semibold text-slate-700">
//                       {item.leaves_pending ?? 0}
//                     </p>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}

//         {/* ---------- body states ---------- */}
//         <div>
//           {loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               Loading…
//             </div>
//           ) : employeeId && list.length === 0 ? (
//             <div className="px-4 py-16 text-center text-sm text-slate-500">
//               <p className="font-medium text-slate-700">No leave balance found</p>
//               <p className="mt-2">
//                 Create a Leave Policy / run Provision first.
//                 <br />
//                 Balances are auto-assigned once a policy exists.
//               </p>
//             </div>
//           ) : null}
//         </div>

//         {/* ---------- pagination ---------- */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
//             <span className="text-sm text-slate-500">
//               Page {page} of {totalPages}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               <button
//                 type="button"
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= ADD / EDIT MODAL ================= */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Leave Balance" : "Add Leave Balance"}
//               </h2>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 disabled={saving}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Employee ID *
//                     </label>
//                     <input
//                       required
//                       value={formData.employee_id || employeeId}
//                       onChange={(e) =>
//                         handleChange("employee_id", e.target.value)
//                       }
//                       disabled={isSelfView || Boolean(editId)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50 disabled:text-slate-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Leave Policy ID *
//                     </label>
//                     <input
//                       required
//                       list="leave-policy-options"
//                       value={formData.leave_policy_id}
//                       onChange={(e) =>
//                         handleChange("leave_policy_id", e.target.value)
//                       }
//                       placeholder="Select or type policy id"
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                     <datalist id="leave-policy-options">
//                       {policies.map((p) => {
//                         const id =
//                           p.leave_policy_id || p.policy_id || p.id || "";
//                         return (
//                           <option key={id} value={id}>
//                             {p.policy_name || p.leave_policy_name || id}
//                           </option>
//                         );
//                       })}
//                     </datalist>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Leave Type *
//                     </label>
//                     <select
//                       required
//                       value={formData.leave_type_id}
//                       onChange={(e) =>
//                         handleChange("leave_type_id", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="">
//                         {leaveTypes.length === 0
//                           ? "No leave types available"
//                           : "Select leave type"}
//                       </option>
//                       {leaveTypes.map((lt) => (
//                         <option key={getLeaveTypeId(lt)} value={getLeaveTypeId(lt)}>
//                           {getLeaveTypeName(lt)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Year *
//                     </label>
//                     <select
//                       required
//                       value={formData.year}
//                       onChange={(e) => handleChange("year", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       {YEAR_OPTIONS.map((y) => (
//                         <option key={y} value={y}>
//                           {y}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                   {[
//                     ["total_leaves", "Total", { min: 0 }],
//                     ["leaves_taken", "Taken", { min: 0 }],
//                     ["leaves_pending", "Pending", { min: 0 }],
//                     ["leaves_remaining", "Remaining", {}],
//                     ["carried_forward", "Carried Forward", {}],
//                     ["encashed", "Encashed", { min: 0 }],
//                     ["lapsed", "Lapsed", { min: 0 }],
//                   ].map(([key, label, extra]) => (
//                     <div key={key}>
//                       <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
//                         <span>{label}</span>
//                         {key === "leaves_remaining" && (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleChange(
//                                 "leaves_remaining",
//                                 String(suggestedRemaining)
//                               )
//                             }
//                             className="text-xs font-normal text-[#E42527] hover:underline"
//                             title={`Total + Carried − Taken − Pending − Encashed − Lapsed = ${suggestedRemaining}`}
//                           >
//                             use {suggestedRemaining}
//                           </button>
//                         )}
//                       </label>
//                       <input
//                         type="number"
//                         value={formData[key]}
//                         onChange={(e) => handleChange(key, e.target.value)}
//                         {...extra}
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {error && (
//                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//                     {error}
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   disabled={saving}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? "Saving…" : editId ? "Update" : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ================= DETAILS MODAL ================= */}
//       {selectedBalance && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   {selectedBalance.year ?? "—"} leave balance
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
//                   {getTypeName(selectedBalance.leave_type_id)}
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedBalance(null)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//                 {[
//                   ["Employee ID", selectedBalance.employee_id],
//                   ["Leave Type", getTypeName(selectedBalance.leave_type_id)],
//                   ["Policy ID", selectedBalance.leave_policy_id],
//                   ["Year", selectedBalance.year],
//                   ["Total", selectedBalance.total_leaves],
//                   ["Taken", selectedBalance.leaves_taken],
//                   ["Pending", selectedBalance.leaves_pending],
//                   ["Remaining", selectedBalance.leaves_remaining],
//                   ["Carried Forward", selectedBalance.carried_forward],
//                   ["Encashed", selectedBalance.encashed],
//                   ["Lapsed", selectedBalance.lapsed],
//                 ].map(([label, value]) => (
//                   <div
//                     key={label}
//                     className="rounded-lg bg-slate-50 px-3 py-2.5"
//                   >
//                     <p className="text-xs text-slate-400">{label}</p>
//                     <p className="mt-1 break-all text-sm font-medium text-slate-800">
//                       {value ?? "—"}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setSelectedBalance(null)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//               {isHrOrAdmin && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => setConfirmDelete(selectedBalance)}
//                     className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const item = selectedBalance;
//                       setSelectedBalance(null);
//                       openEdit(item);
//                     }}
//                     className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//                   >
//                     Edit balance
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= DELETE CONFIRM ================= */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 Delete leave balance?
//               </h2>
//             </div>
//             <div className="px-5 py-5 text-sm text-slate-600">
//               This will remove the{" "}
//               <span className="font-medium text-slate-800">
//                 {getTypeName(confirmDelete.leave_type_id)}
//               </span>{" "}
//               balance record for{" "}
//               <span className="font-medium text-slate-800">
//                 {confirmDelete.year ?? "—"}
//               </span>
//               . This action cannot be undone.
//               {error && (
//                 <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-red-600">
//                   {error}
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setConfirmDelete(null)}
//                 disabled={deleting}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 disabled={deleting}
//                 className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
//               >
//                 {deleting ? "Deleting…" : "Delete"}
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
import {
  fetchLeaveTypes,
  getLeaveTypeId,
  getLeaveTypeName,
} from "@/app/lib/leaveTypes";
import { useAuthStore } from "@/app/store/authStore";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 3 + i);

const HR_ROLES = new Set([
  "hr",
  "hr_manager",
  "hr-manager",
  "admin",
  "super_admin",
  "super-admin",
  "superadmin",
  "owner",
  "payroll_officer",
  "payroll-officer",
  "finance",
  "manager",
  "team_lead",
  "team-lead",
  "recruiter",
]);

const initialForm = {
  employee_id: "",
  leave_type_id: "",
  leave_policy_id: "",
  year: CURRENT_YEAR,
  total_leaves: 0,
  leaves_taken: 0,
  leaves_pending: 0,
  leaves_remaining: 0,
  carried_forward: 0,
  encashed: 0,
  lapsed: 0,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) =>
        Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
      )
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission for this action.";
  return err?.message || "Something went wrong";
};

const isCancel = (err) =>
  err?.name === "CanceledError" ||
  err?.code === "ERR_CANCELED" ||
  err?.name === "AbortError";

const pickList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  return (
    payload.items ??
    payload.results ??
    payload.data ??
    payload.employees ??
    payload.leave_types ??
    payload.leave_policies ??
    payload.policies ??
    []
  );
};

const hasHrAccess = (user) => {
  if (!user) return false;
  const roles = [
    user.role,
    ...(Array.isArray(user.roles) ? user.roles : []),
    ...(Array.isArray(user.user_roles) ? user.user_roles : []),
  ]
    .filter(Boolean)
    .map((r) =>
      String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
        .toLowerCase()
        .trim()
    );
  return roles.some((r) => HR_ROLES.has(r));
};

const pickEmployeeId = (u) =>
  u?.employee_id ||
  u?.employeeId ||
  u?.emp_id ||
  u?.employee?.employee_id ||
  u?.profile?.employee_id ||
  u?.data?.employee_id ||
  "";

const balanceRowKey = (item) =>
  item?.balance_id ?? item?.leave_balance_id ?? item?.id ?? null;

const getPolicyIdFromObj = (p) =>
  p?.leave_policy_id || p?.policy_id || p?.id || "";
const getPolicyNameFromObj = (p) =>
  p?.policy_name || p?.leave_policy_name || getPolicyIdFromObj(p) || "Unnamed Policy";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployeeLeaveBalancePage() {
  const user = useAuthStore((state) => state.user);
  const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

  const [list, setList] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState(String(CURRENT_YEAR));
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
  const [resolvedEmployeeName, setResolvedEmployeeName] = useState("");
  const [selectedBalance, setSelectedBalance] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const abortRef = useRef(null);

  const employeeFromUser = useMemo(() => pickEmployeeId(user), [user]);
  const employeeId = employeeFromUser || resolvedEmployeeId;
  const isSelfView = Boolean(employeeFromUser) && !isHrOrAdmin;

  /* --------------- resolve employee id if not in auth --------------- */
  useEffect(() => {
    if (employeeFromUser) return;
    const userId = user?.user_id || user?.userId || user?.id || user?.sub;
    if (!userId) return;

    let cancelled = false;
    api
      .get("/api/v1/get/employees")
      .then((response) => {
        const data = response?.data?.data ?? response?.data ?? [];
        const list = pickList(data);
        const employee = list.find(
          (item) => String(item.user_id ?? item.userId ?? "") === String(userId)
        );
        if (!cancelled) {
          setResolvedEmployeeId(
            employee?.employee_id || employee?.emp_id || employee?.id || ""
          );
          setResolvedEmployeeName(
            employee?.employee_name || employee?.name || employee?.full_name || ""
          );
        }
      })
      .catch(() => {
        if (!cancelled) setResolvedEmployeeId("");
      });

    return () => {
      cancelled = true;
    };
  }, [employeeFromUser, user]);

  /* --------------- load leave types --------------- */
  useEffect(() => {
    let cancelled = false;
    fetchLeaveTypes()
      .then((types) => {
        if (!cancelled) setLeaveTypes(Array.isArray(types) ? types : []);
      })
      .catch(() => {
        if (!cancelled) setLeaveTypes([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* --------------- load all policies (for dropdown) --------------- */
  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/v1/leave/policies", { params: { page: 1, page_size: 500 } })
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data?.data ?? res?.data ?? {};
        setPolicies(pickList(payload));
      })
      .catch(() => {
        if (!cancelled) setPolicies([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* --------------- load all employees (for dropdown) --------------- */
  useEffect(() => {
    if (!isHrOrAdmin) return;
    let cancelled = false;
    api
      .get("/api/v1/get/employees")
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data?.data ?? res?.data ?? {};
        setEmployees(pickList(payload));
      })
      .catch(() => {
        if (!cancelled) setEmployees([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isHrOrAdmin]);

  /* --------------- debounce search --------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* --------------- fetch balances --------------- */
  const fetchData = useCallback(async () => {
    if (!employeeId) {
      setList([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/v1/leave/balance/${employeeId}`, {
        params: {
          page,
          page_size: pageSize,
          ...(search ? { search } : {}),
          ...(yearFilter ? { year: yearFilter } : {}),
        },
        signal: controller.signal,
      });

      const payload = res.data?.data ?? res.data ?? {};
      const items = Array.isArray(payload)
        ? payload
        : payload?.employee_leave_balances ??
          payload?.leave_balances ??
          payload?.balances ??
          pickList(payload);

      setList(Array.isArray(items) ? items : []);
      setTotal(
        res.data?.total ?? payload?.total ?? (Array.isArray(items) ? items.length : 0)
      );
    } catch (err) {
      if (isCancel(err)) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [employeeId, page, pageSize, search, yearFilter]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData]);

  /* --------------- derived: suggested remaining --------------- */
  const suggestedRemaining = useMemo(() => {
    const t = toNumber(formData.total_leaves);
    const taken = toNumber(formData.leaves_taken);
    const pending = toNumber(formData.leaves_pending);
    const carried = toNumber(formData.carried_forward);
    const encashed = toNumber(formData.encashed);
    const lapsed = toNumber(formData.lapsed);
    return t + carried - taken - pending - encashed - lapsed;
  }, [formData]);

  /* --------------- filtered policies by selected leave type --------------- */
  const filteredPolicies = useMemo(() => {
    if (!formData.leave_type_id) return policies;
    return policies.filter(
      (p) => String(p.leave_type_id || "") === String(formData.leave_type_id)
    );
  }, [policies, formData.leave_type_id]);

  /* --------------- form handlers --------------- */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({ ...initialForm, employee_id: employeeId });
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(balanceRowKey(item));
    setFormData({
      ...initialForm,
      employee_id: item.employee_id || employeeId,
      leave_type_id: item.leave_type_id || "",
      leave_policy_id: item.leave_policy_id || "",
      year: item.year ?? CURRENT_YEAR,
      total_leaves: item.total_leaves ?? 0,
      leaves_taken: item.leaves_taken ?? 0,
      leaves_pending: item.leaves_pending ?? 0,
      leaves_remaining: item.leaves_remaining ?? 0,
      carried_forward: item.carried_forward ?? 0,
      encashed: item.encashed ?? 0,
      lapsed: item.lapsed ?? 0,
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setError("");
    setEditId(null);
    setFormData({ ...initialForm, employee_id: employeeId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!editId) {
      if (!formData.employee_id) {
        setError("Employee ID is required");
        return;
      }
      if (!formData.leave_type_id) {
        setError("Leave Type is required");
        return;
      }
      if (!formData.leave_policy_id) {
        setError("Leave Policy is required");
        return;
      }
    }

    const year = toNumber(formData.year);
    if (year < 2000 || year > CURRENT_YEAR + 5) {
      setError(`Year must be between 2000 and ${CURRENT_YEAR + 5}`);
      return;
    }
    const total = toNumber(formData.total_leaves);
    if (total < 0) {
      setError("Total leaves cannot be negative");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editId) {
        // UPDATE — only balance fields
        await api.put(`/api/v1/leave/balance/${editId}`, {
          total_leaves: total,
          leaves_taken: toNumber(formData.leaves_taken),
          leaves_pending: toNumber(formData.leaves_pending),
          leaves_remaining: toNumber(formData.leaves_remaining, suggestedRemaining),
          carried_forward: toNumber(formData.carried_forward),
          encashed: toNumber(formData.encashed),
          lapsed: toNumber(formData.lapsed),
        });
      } else {
        // CREATE — full payload
        const payload = {
          employee_id: formData.employee_id,
          leave_type_id: formData.leave_type_id,
          leave_policy_id: formData.leave_policy_id,
          year,
          total_leaves: total,
          leaves_taken: toNumber(formData.leaves_taken),
          leaves_pending: toNumber(formData.leaves_pending),
          leaves_remaining: toNumber(formData.leaves_remaining, suggestedRemaining),
          carried_forward: toNumber(formData.carried_forward),
          encashed: toNumber(formData.encashed),
          lapsed: toNumber(formData.lapsed),
        };
        await api.post("/api/v1/leave/balance", payload);
      }

      setShowForm(false);
      setFormData({ ...initialForm, employee_id: employeeId });
      setEditId(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const item = confirmDelete;
    if (!item) return;
    const id = balanceRowKey(item);
    if (!id) {
      setConfirmDelete(null);
      setError("Cannot delete: missing balance id.");
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/v1/leave/balance/${id}`);
      setConfirmDelete(null);
      setSelectedBalance(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getTypeName = useCallback(
    (leaveTypeId) => {
      const found = leaveTypes.find(
        (t) => String(getLeaveTypeId(t)) === String(leaveTypeId)
      );
      if (found) return getLeaveTypeName(found);
      if (!leaveTypeId) return "—";
      const asString = String(leaveTypeId);
      return asString.length > 12 ? `${asString.slice(0, 8)}…` : asString;
    },
    [leaveTypes]
  );

  const getPolicyName = useCallback(
    (policyId) => {
      const found = policies.find(
        (p) => String(getPolicyIdFromObj(p)) === String(policyId)
      );
      if (found) return getPolicyNameFromObj(found);
      if (!policyId) return "—";
      const asString = String(policyId);
      return asString.length > 12 ? `${asString.slice(0, 8)}…` : asString;
    },
    [policies]
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Employee Leave Balance
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {resolvedEmployeeName
              ? `Viewing balances for ${resolvedEmployeeName}.`
              : "Balances are auto-assigned from Leave Policy."}{" "}
            Showing <strong>{yearFilter || "all years"}</strong> data.
          </p>
        </div>

        {isHrOrAdmin && (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
          >
            + Add Balance Record
          </button>
        )}
      </div>

      {/* ---------- filters ---------- */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by leave type…"
              autoComplete="off"
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
            />
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
            >
              <option value="">All years</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                  {y === CURRENT_YEAR ? " (Current)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{total} records</span>
            <button
              type="button"
              onClick={fetchData}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && !showForm && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {!employeeId && !loading && (
          <div className="py-16 text-center text-sm text-slate-500">
            Employee ID not found for current user. Please contact HR.
          </div>
        )}

        {/* ---------- cards ---------- */}
        {!loading && employeeId && list.length > 0 && (
          <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((item, index) => (
              <button
                type="button"
                key={balanceRowKey(item) || index}
                onClick={() => setSelectedBalance(item)}
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E42527]/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {item.year ?? "—"} leave balance
                    </p>
                    <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
                      {getTypeName(item.leave_type_id)}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {getPolicyName(item.leave_policy_id)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {item.leaves_remaining ?? 0} left
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="mt-0.5 font-semibold text-slate-700">
                      {item.total_leaves ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Taken</p>
                    <p className="mt-0.5 font-semibold text-slate-700">
                      {item.leaves_taken ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Pending</p>
                    <p className="mt-0.5 font-semibold text-slate-700">
                      {item.leaves_pending ?? 0}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ---------- body states ---------- */}
        <div>
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading…
            </div>
          ) : employeeId && list.length === 0 ? (
            <div className="px-4 py-16 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700">
                No leave balance found for {yearFilter || "any year"}
              </p>
              <p className="mt-2">
                Try changing the year filter or contact HR.
                <br />
                Balances are auto-assigned once a policy exists.
              </p>
            </div>
          ) : null}
        </div>

        {/* ---------- pagination ---------- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editId ? "Edit Leave Balance" : "Add Leave Balance"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Employee */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Employee {!editId && <span className="text-red-600">*</span>}
                    </label>
                    {isHrOrAdmin && !editId && employees.length > 0 ? (
                      <select
                        required
                        value={formData.employee_id || employeeId}
                        onChange={(e) =>
                          handleChange("employee_id", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        <option value="">Select employee</option>
                        {employees.map((emp) => {
                          const eid = emp.employee_id || emp.emp_id || emp.id;
                          const ename =
                            emp.employee_name ||
                            emp.name ||
                            `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
                            eid;
                          return (
                            <option key={eid} value={eid}>
                              {ename} ({eid})
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <input
                        required={!editId}
                        value={formData.employee_id || employeeId}
                        onChange={(e) =>
                          handleChange("employee_id", e.target.value)
                        }
                        disabled={editId || isSelfView}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    )}
                  </div>

                  {/* Leave Type */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Type {!editId && <span className="text-red-600">*</span>}
                    </label>
                    {editId ? (
                      <input
                        value={getTypeName(formData.leave_type_id)}
                        disabled
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50 text-slate-500"
                      />
                    ) : (
                      <select
                        required
                        value={formData.leave_type_id}
                        onChange={(e) => {
                          handleChange("leave_type_id", e.target.value);
                          // reset policy when type changes
                          handleChange("leave_policy_id", "");
                        }}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        <option value="">
                          {leaveTypes.length === 0
                            ? "No leave types available"
                            : "Select leave type"}
                        </option>
                        {leaveTypes.map((lt) => (
                          <option
                            key={getLeaveTypeId(lt)}
                            value={getLeaveTypeId(lt)}
                          >
                            {getLeaveTypeName(lt)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* ⭐ Policy — DROPDOWN with all policies */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Policy {!editId && <span className="text-red-600">*</span>}
                    </label>
                    {editId ? (
                      <input
                        value={getPolicyName(formData.leave_policy_id)}
                        disabled
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50 text-slate-500"
                      />
                    ) : (
                      <select
                        required
                        value={formData.leave_policy_id}
                        onChange={(e) =>
                          handleChange("leave_policy_id", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        <option value="">
                          {filteredPolicies.length === 0
                            ? formData.leave_type_id
                              ? "No policies for this leave type"
                              : "Select policy"
                            : "Select policy"}
                        </option>
                        {filteredPolicies.map((p) => {
                          const pid = getPolicyIdFromObj(p);
                          const pname = getPolicyNameFromObj(p);
                          const isActive = p.is_active !== false;
                          return (
                            <option key={pid} value={pid}>
                              {pname} {isActive ? "" : "(inactive)"}
                            </option>
                          );
                        })}
                      </select>
                    )}
                    {!editId && formData.leave_type_id && filteredPolicies.length === 0 && (
                      <p className="mt-1 text-[11px] text-amber-600">
                        Is leave type ke liye koi policy nahi mili.
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Year {!editId && <span className="text-red-600">*</span>}
                    </label>
                    <select
                      required
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      disabled={!!editId}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50 disabled:text-slate-500"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Balance numbers */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    ["total_leaves", "Total", { min: 0 }],
                    ["leaves_taken", "Taken", { min: 0 }],
                    ["leaves_pending", "Pending", { min: 0 }],
                    ["leaves_remaining", "Remaining", {}],
                    ["carried_forward", "Carried Forward", {}],
                    ["encashed", "Encashed", { min: 0 }],
                    ["lapsed", "Lapsed", { min: 0 }],
                  ].map(([key, label, extra]) => (
                    <div key={key}>
                      <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
                        <span>{label}</span>
                        {key === "leaves_remaining" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleChange(
                                "leaves_remaining",
                                String(suggestedRemaining)
                              )
                            }
                            className="text-xs font-normal text-[#E42527] hover:underline"
                            title={`Total + Carried − Taken − Pending − Encashed − Lapsed = ${suggestedRemaining}`}
                          >
                            use {suggestedRemaining}
                          </button>
                        )}
                      </label>
                      <input
                        type="number"
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        {...extra}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      />
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DETAILS MODAL ================= */}
      {selectedBalance && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {selectedBalance.year ?? "—"} leave balance
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  {getTypeName(selectedBalance.leave_type_id)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBalance(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Employee ID", selectedBalance.employee_id],
                  ["Leave Type", getTypeName(selectedBalance.leave_type_id)],
                  ["Policy", getPolicyName(selectedBalance.leave_policy_id)],
                  ["Year", selectedBalance.year],
                  ["Total", selectedBalance.total_leaves],
                  ["Taken", selectedBalance.leaves_taken],
                  ["Pending", selectedBalance.leaves_pending],
                  ["Remaining", selectedBalance.leaves_remaining],
                  ["Carried Forward", selectedBalance.carried_forward],
                  ["Encashed", selectedBalance.encashed],
                  ["Lapsed", selectedBalance.lapsed],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-slate-50 px-3 py-2.5"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedBalance(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {isHrOrAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(selectedBalance)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const item = selectedBalance;
                      setSelectedBalance(null);
                      openEdit(item);
                    }}
                    className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                  >
                    Edit balance
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Delete leave balance?
              </h2>
            </div>
            <div className="px-5 py-5 text-sm text-slate-600">
              This will remove the{" "}
              <span className="font-medium text-slate-800">
                {getTypeName(confirmDelete.leave_type_id)}
              </span>{" "}
              balance record for{" "}
              <span className="font-medium text-slate-800">
                {confirmDelete.year ?? "—"}
              </span>
              . This action cannot be undone.
              {error && (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-red-600">
                  {error}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}