// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import { fetchLeaveTypes, getLeaveTypeId, getLeaveTypeName } from "@/lib/leaveTypes";
// import { useAuthStore } from "@/store/authStore";

// const initialForm = {
//   employee_id: "",
//   leave_type_id: "",
//   leave_policy_id: "",
//   company_id: "",
//   year: new Date().getFullYear(),
//   total_leaves: 0,
//   leaves_taken: 0,
//   leaves_pending: 0,
//   leaves_remaining: 0,
//   carried_forward: 0,
//   encashed: 0,
//   lapsed: 0,
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
//   return err?.message || "Something went wrong";
// };

// export default function EmployeeLeaveBalancePage() {
//   const user = useAuthStore((state) => state.user);
//   const [list, setList] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [selectedBalance, setSelectedBalance] = useState(null);

//   const employeeFromUser =
//     user?.employee_id ||
//     user?.employeeId ||
//     user?.emp_id ||
//     user?.employee?.employee_id ||
//     user?.employee?.id ||
//     user?.profile?.employee_id ||
//     user?.data?.employee_id ||
//     "";
//   const employeeId = employeeFromUser || resolvedEmployeeId;

//   useEffect(() => {
//     if (employeeFromUser) return;

//     const userId = user?.user_id || user?.userId || user?.id || user?.sub;
//     if (!userId) return;

//     let cancelled = false;

//     api
//       .get("/api/v1/get/employees")
//       .then((response) => {
//         const data = response?.data?.data ?? response?.data ?? [];
//         const employees = Array.isArray(data)
//           ? data
//           : data?.items ?? data?.results ?? data?.employees ?? [];
//         const employee = employees.find(
//           (item) => String(item.user_id ?? item.userId ?? "") === String(userId)
//         );

//         if (!cancelled) setResolvedEmployeeId(employee?.employee_id || employee?.id || "");
//       })
//       .catch(() => {
//         if (!cancelled) setResolvedEmployeeId("");
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [employeeFromUser, user]);

//   useEffect(() => {
//     fetchLeaveTypes().then(setLeaveTypes).catch(() => setLeaveTypes([]));
//   }, []);

//   // Set employeeId from URL params or parent component as needed
//   // Example: const params = useSearchParams(); setEmployeeId(params.get("employee_id") || "");

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get(
//         `/api/v1/leave/balance/${employeeId}`,
//         {
//           params: { page, page_size: pageSize, search },
//         }
//       );
//       const data = res.data?.data ?? res.data ?? [];
//       const items = Array.isArray(data)
//         ? data
//         : data?.items ?? data?.results ?? data?.balances ?? data?.leave_balances ?? [];
//       setList(items);
//       setTotal(res.data?.total ?? res.data?.count ?? items.length);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [employeeId, page, pageSize, search]);

//   useEffect(() => {
//     if (!employeeId) return;
//     const timeoutId = setTimeout(() => {
//       fetchData();
//     }, 0);
//     return () => clearTimeout(timeoutId);
//   }, [employeeId, fetchData]);

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
//     setEditId(item.id || item.balance_id);
//     setFormData({
//       ...initialForm,
//       employee_id: item.employee_id || employeeId,
//       leave_type_id: item.leave_type_id || "",
//       leave_policy_id: item.leave_policy_id || "",
//       company_id: item.company_id || "",
//       year: item.year ?? new Date().getFullYear(),
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       const payload = {
//         employee_id: employeeId || formData.employee_id,
//         leave_type_id: formData.leave_type_id,
//         leave_policy_id: formData.leave_policy_id,
//         company_id: formData.company_id,
//         year: Number(formData.year) || new Date().getFullYear(),
//         total_leaves: Number(formData.total_leaves) || 0,
//         leaves_taken: Number(formData.leaves_taken) || 0,
//         leaves_pending: Number(formData.leaves_pending) || 0,
//         leaves_remaining: Number(formData.leaves_remaining) || 0,
//         carried_forward: Number(formData.carried_forward) || 0,
//         encashed: Number(formData.encashed) || 0,
//         lapsed: Number(formData.lapsed) || 0,
//       };

//       if (editId) {
//         await api.put(`/api/v1/leave/balance/${editId}`, payload);
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

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   return (
//     <div>
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">
//             Employee Leave Balance
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             View and update leave balances for this employee
//           </p>
//         </div>
//         <button
//           onClick={openAdd}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//         >
//           + Add Balance Record
//         </button>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
//           <input
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search by leave type or year..."
//             className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//           />
//           <span className="text-sm text-slate-500">{total} records</span>
//         </div>

//         {error && !showForm && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {!loading && list.length > 0 && (
//           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
//             {list.map((item, index) => {
//               const leaveType = getLeaveTypeName(
//                 leaveTypes.find(
//                   (type) => String(getLeaveTypeId(type)) === String(item.leave_type_id)
//                 ) || { leave_type_id: item.leave_type_id }
//               );

//               return (
//                 <button
//                   type="button"
//                   key={item.id || item.balance_id || index}
//                   onClick={() => setSelectedBalance(item)}
//                   className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E42527]/50 hover:shadow-md"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                         {item.year ?? "—"} leave balance
//                       </p>
//                       <h3 className="mt-1 text-base font-semibold text-slate-800">{leaveType}</h3>
//                     </div>
//                     <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
//                       {item.leaves_remaining ?? 0} remaining
//                     </span>
//                   </div>
//                   <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
//                     <div>
//                       <p className="text-xs text-slate-400">Total</p>
//                       <p className="mt-0.5 font-semibold text-slate-700">{item.total_leaves ?? 0}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">Taken</p>
//                       <p className="mt-0.5 font-semibold text-slate-700">{item.leaves_taken ?? 0}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">Pending</p>
//                       <p className="mt-0.5 font-semibold text-slate-700">{item.leaves_pending ?? 0}</p>
//                     </div>
//                   </div>
//                   <p className="mt-3 text-xs font-medium text-[#E42527] opacity-0 transition group-hover:opacity-100">
//                     View full details
//                   </p>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               Loading...
//             </div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               No balance records found
//             </div>
//           ) : (
//             <table className="min-w-[1200px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/80">
//                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
//                   <th className="px-5 py-3 font-medium text-slate-500 whitespace-nowrap">
//                     Employee ID
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500 whitespace-nowrap">
//                     Company ID
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500 whitespace-nowrap">
//                     Policy ID
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Year</th>
//                   <th className="px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Leave Type</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Total
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Taken
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Pending
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Remaining
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     CF
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Encashed
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Lapsed
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500 text-right">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {list.map((item, i) => (
//                   <tr
//                     key={item.id || item.balance_id || i}
//                     className="hover:bg-slate-50/70"
//                   >
//                     <td className="px-5 py-3.5 text-slate-500">
//                       {(page - 1) * pageSize + i + 1}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
//                       {item.employee_id ?? "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
//                       {item.company_id ?? "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
//                       {item.leave_policy_id ?? "—"}
//                     </td>
//                     <td className="px-5 py-3.5 font-medium text-slate-800">
//                       {item.year ?? "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
//                       {getLeaveTypeName(
//                         leaveTypes.find(
//                           (leaveType) =>
//                             String(getLeaveTypeId(leaveType)) === String(item.leave_type_id)
//                         ) || { leave_type_id: item.leave_type_id }
//                       )}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.total_leaves ?? 0}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.leaves_taken ?? 0}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.leaves_pending ?? 0}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.leaves_remaining ?? 0}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.carried_forward ?? 0}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.encashed ?? 0}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.lapsed ?? 0}
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       <button
//                         onClick={() => openEdit(item)}
//                         className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex justify-between border-t border-slate-100 px-4 py-3">
//             <span className="text-sm text-slate-500">
//               Page {page} of {totalPages}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Leave Balance" : "Add Leave Balance"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowForm(false);
//                   setError("");
//                 }}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
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
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]/30"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Company ID *
//                     </label>
//                     <input
//                       required
//                       value={formData.company_id}
//                       onChange={(e) =>
//                         handleChange("company_id", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Leave Policy ID *
//                     </label>
//                     <input
//                       required
//                       value={formData.leave_policy_id}
//                       onChange={(e) =>
//                         handleChange("leave_policy_id", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
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
//                       <option value="">Select leave type</option>
//                       {leaveTypes.map((leaveType) => (
//                         <option
//                           key={getLeaveTypeId(leaveType)}
//                           value={getLeaveTypeId(leaveType)}
//                         >
//                           {getLeaveTypeName(leaveType)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Year *
//                     </label>
//                     <input
//                       required
//                       type="number"
//                       value={formData.year}
//                       onChange={(e) => handleChange("year", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                   {[
//                     ["total_leaves", "Total"],
//                     ["leaves_taken", "Taken"],
//                     ["leaves_pending", "Pending"],
//                     ["leaves_remaining", "Remaining"],
//                     ["carried_forward", "Carried Forward"],
//                     ["encashed", "Encashed"],
//                     ["lapsed", "Lapsed"],
//                   ].map(([key, label]) => (
//                     <div key={key}>
//                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                         {label}
//                       </label>
//                       <input
//                         type="number"
//                         value={formData[key]}
//                         onChange={(e) => handleChange(key, e.target.value)}
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
//                   onClick={() => setShowForm(false)}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? "Saving..." : editId ? "Update" : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {selectedBalance && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   {selectedBalance.year ?? "—"} leave balance
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
//                   {getLeaveTypeName(
//                     leaveTypes.find(
//                       (type) => String(getLeaveTypeId(type)) === String(selectedBalance.leave_type_id)
//                     ) || { leave_type_id: selectedBalance.leave_type_id }
//                   )}
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
//                   ["Company ID", selectedBalance.company_id],
//                   ["Leave Policy ID", selectedBalance.leave_policy_id],
//                   ["Year", selectedBalance.year],
//                   ["Total Leaves", selectedBalance.total_leaves],
//                   ["Leaves Taken", selectedBalance.leaves_taken],
//                   ["Leaves Pending", selectedBalance.leaves_pending],
//                   ["Leaves Remaining", selectedBalance.leaves_remaining],
//                   ["Carried Forward", selectedBalance.carried_forward],
//                   ["Encashed", selectedBalance.encashed],
//                   ["Lapsed", selectedBalance.lapsed],
//                 ].map(([label, value]) => (
//                   <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5">
//                     <p className="text-xs text-slate-400">{label}</p>
//                     <p className="mt-1 break-all text-sm font-medium text-slate-800">{value ?? "—"}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setSelectedBalance(null)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedBalance(null);
//                   openEdit(selectedBalance);
//                 }}
//                 className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//               >
//                 Edit balance
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { fetchLeaveTypes, getLeaveTypeId, getLeaveTypeName } from "@/app/lib/leaveTypes";
import { useAuthStore } from "@/app/store/authStore";

const initialForm = {
  employee_id: "",
  leave_type_id: "",
  leave_policy_id: "",
  year: new Date().getFullYear(),
  total_leaves: 0,
  leaves_taken: 0,
  leaves_pending: 0,
  leaves_remaining: 0,
  carried_forward: 0,
  encashed: 0,
  lapsed: 0,
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
  return err?.message || "Something went wrong";
};

export default function EmployeeLeaveBalancePage() {
  const user = useAuthStore((state) => state.user);
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedBalance, setSelectedBalance] = useState(null);

  // HR/admin flag (apne auth role ke hisaab se adjust karo)
  const isHrOrAdmin =
    user?.role === "HR" ||
    user?.role === "ADMIN" ||
    user?.role === "hr" ||
    user?.role === "admin";

  const employeeFromUser =
    user?.employee_id ||
    user?.employeeId ||
    user?.emp_id ||
    user?.employee?.employee_id ||
    user?.employee?.id ||
    user?.profile?.employee_id ||
    user?.data?.employee_id ||
    "";

  const employeeId = employeeFromUser || resolvedEmployeeId;

  useEffect(() => {
    if (employeeFromUser) return;

    const userId = user?.user_id || user?.userId || user?.id || user?.sub;
    if (!userId) return;

    let cancelled = false;

    api
      .get("/api/v1/get/employees")
      .then((response) => {
        const data = response?.data?.data ?? response?.data ?? [];
        const employees = Array.isArray(data)
          ? data
          : data?.items ?? data?.results ?? data?.employees ?? [];
        const employee = employees.find(
          (item) => String(item.user_id ?? item.userId ?? "") === String(userId)
        );
        if (!cancelled) {
          setResolvedEmployeeId(employee?.employee_id || employee?.id || "");
        }
      })
      .catch(() => {
        if (!cancelled) setResolvedEmployeeId("");
      });

    return () => {
      cancelled = true;
    };
  }, [employeeFromUser, user]);

  useEffect(() => {
    fetchLeaveTypes().then(setLeaveTypes).catch(() => setLeaveTypes([]));
  }, []);

  const fetchData = useCallback(async () => {
    if (!employeeId) {
      setList([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/v1/leave/balance/${employeeId}`, {
        params: { page, page_size: pageSize, search },
      });

      // Backend response:
      // { success, total, page, page_size, employee_leave_balances: [...] }
      const payload = res.data?.data ?? res.data ?? {};
      const items = Array.isArray(payload)
        ? payload
        : payload?.employee_leave_balances ??
          payload?.items ??
          payload?.results ??
          payload?.balances ??
          payload?.leave_balances ??
          [];

      setList(Array.isArray(items) ? items : []);
      setTotal(
        res.data?.total ??
          payload?.total ??
          (Array.isArray(items) ? items.length : 0)
      );
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [employeeId, page, pageSize, search]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(), 0);
    return () => clearTimeout(t);
  }, [fetchData]);

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
    setEditId(item.balance_id || item.id);
    setFormData({
      ...initialForm,
      employee_id: item.employee_id || employeeId,
      leave_type_id: item.leave_type_id || "",
      leave_policy_id: item.leave_policy_id || "",
      year: item.year ?? new Date().getFullYear(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        employee_id: employeeId || formData.employee_id,
        leave_type_id: formData.leave_type_id,
        leave_policy_id: formData.leave_policy_id,
        year: Number(formData.year) || new Date().getFullYear(),
        total_leaves: Number(formData.total_leaves) || 0,
        leaves_taken: Number(formData.leaves_taken) || 0,
        leaves_pending: Number(formData.leaves_pending) || 0,
        leaves_remaining: Number(formData.leaves_remaining) || 0,
        carried_forward: Number(formData.carried_forward) || 0,
        encashed: Number(formData.encashed) || 0,
        lapsed: Number(formData.lapsed) || 0,
      };

      if (editId) {
        // backend update sirf balance fields leta hai
        await api.put(`/api/v1/leave/balance/${editId}`, {
          total_leaves: payload.total_leaves,
          leaves_taken: payload.leaves_taken,
          leaves_pending: payload.leaves_pending,
          leaves_remaining: payload.leaves_remaining,
          carried_forward: payload.carried_forward,
          encashed: payload.encashed,
          lapsed: payload.lapsed,
        });
      } else {
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

  const totalPages = Math.ceil(total / pageSize) || 1;

  const getTypeName = (leaveTypeId) =>
    getLeaveTypeName(
      leaveTypes.find(
        (t) => String(getLeaveTypeId(t)) === String(leaveTypeId)
      ) || { leave_type_id: leaveTypeId }
    );

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Employee Leave Balance
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Balances are created automatically from Leave Policy / Provision.
            Manual add is only for special correction.
          </p>
        </div>

        {isHrOrAdmin && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
          >
            + Add Balance Record
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by leave type id..."
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
          />
          <span className="text-sm text-slate-500">{total} records</span>
        </div>

        {error && !showForm && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {!employeeId && !loading && (
          <div className="py-16 text-center text-sm text-slate-500">
            Employee ID not found for current user.
          </div>
        )}

        {!loading && employeeId && list.length > 0 && (
          <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((item, index) => (
              <button
                type="button"
                key={item.balance_id || item.id || index}
                onClick={() => setSelectedBalance(item)}
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E42527]/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {item.year ?? "—"} leave balance
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-slate-800">
                      {getTypeName(item.leave_type_id)}
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
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

        <div>
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
          ) : employeeId && list.length === 0 ? (
            <div className="px-4 py-16 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700">No leave balance found</p>
              <p className="mt-2">
                Pehle Leave Policy banao / Provision chalao.
                <br />
                Policy create ke baad balances auto assign hote hain.
              </p>
            </div>
          ) : null}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal (HR only mostly) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editId ? "Edit Leave Balance" : "Add Leave Balance"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Employee ID *
                    </label>
                    <input
                      required
                      value={formData.employee_id || employeeId}
                      onChange={(e) => handleChange("employee_id", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Policy ID *
                    </label>
                    <input
                      required
                      value={formData.leave_policy_id}
                      onChange={(e) => handleChange("leave_policy_id", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Type *
                    </label>
                    <select
                      required
                      value={formData.leave_type_id}
                      onChange={(e) => handleChange("leave_type_id", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map((leaveType) => (
                        <option key={getLeaveTypeId(leaveType)} value={getLeaveTypeId(leaveType)}>
                          {getLeaveTypeName(leaveType)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Year *
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    ["total_leaves", "Total"],
                    ["leaves_taken", "Taken"],
                    ["leaves_pending", "Pending"],
                    ["leaves_remaining", "Remaining"],
                    ["carried_forward", "Carried Forward"],
                    ["encashed", "Encashed"],
                    ["lapsed", "Lapsed"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {label}
                      </label>
                      <input
                        type="number"
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
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
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  ["Policy ID", selectedBalance.leave_policy_id],
                  ["Year", selectedBalance.year],
                  ["Total", selectedBalance.total_leaves],
                  ["Taken", selectedBalance.leaves_taken],
                  ["Pending", selectedBalance.leaves_pending],
                  ["Remaining", selectedBalance.leaves_remaining],
                  ["Carried Forward", selectedBalance.carried_forward],
                  ["Encashed", selectedBalance.encashed],
                  ["Lapsed", selectedBalance.lapsed],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedBalance(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {isHrOrAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBalance(null);
                    openEdit(selectedBalance);
                  }}
                  className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                >
                  Edit balance
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}