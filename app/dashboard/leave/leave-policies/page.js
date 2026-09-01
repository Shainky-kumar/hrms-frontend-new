// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import { useAuthStore } from "@/store/authStore";

// const initialForm = {
//   leave_type_id: "",
//   policy_name: "",
//   entitlement_type: "fixed",
//   total_leaves: 0,
//   accrual_type: "upfront",
//   per_month_limit: 0,
//   max_applications_per_year: 0,
//   min_leave_count_for_request: 1,
//   grant_min_days: 1,
//   grant_max_days: 30,
//   grant_reusable_after_days: 0,
//   grant_extension_as_lop: false,
//   carry_forward_allowed: false,
//   carry_forward_max: 0,
//   carry_forward_expiry_months: 0,
//   encashment_allowed: false,
//   encashment_max_days: 0,
//   mark_excess_as_lop: false,
//   max_negative_balance: 0,
//   min_notice_days: 0,
//   document_required_after_days: 0,
//   min_service_days: 0,
//   applicable_gender: "all",
//   sandwich_enabled: false,
//   sandwich_limit_days: 0,
//   sandwich_weekends_mode: "include",
//   sandwich_holidays_mode: "include",
//   allow_half_day: true,
//   effective_from: "",
//   effective_to: "",
//   is_active: true,
//   reason: "",
// };

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail.map((e) => (Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg)).join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// const getItems = (response) => {
//   const data = response?.data?.data ?? response?.data ?? [];

//   if (Array.isArray(data)) return data;

//   return data?.items ?? data?.results ?? data?.leave_types ?? response?.data?.leave_types ?? [];
// };

// const getLeaveTypeId = (leaveType) =>
//   leaveType.leave_type_id || leaveType.id || leaveType._id;

// const getLeaveTypeName = (leaveType) =>
//   leaveType.leave_type_name || leaveType.name || leaveType.type_name || getLeaveTypeId(leaveType);

// const fetchLeaveTypes = async () => {
//   const endpoints = [
//     "/api/v1/get/leave/type",
//     "/api/v1/leave/types",
//     "/api/v1/get/leave/types",
//     "/api/v1/get/leave/type/list",
//   ];

//   for (const endpoint of endpoints) {
//     try {
//       const response = await api.get(endpoint);
//       return getItems(response);
//     } catch {
//     }
//   }

//   return [];
// };

// export default function LeavePoliciesPage() {
//   const user = useAuthStore((state) => state.user);
//   const loggedInUserId = user?.user_id || user?.userId || user?.id || user?.sub || "";
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
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   useEffect(() => {
//     const loadLeaveTypes = async () => {
//       try {
//         setLeaveTypes(await fetchLeaveTypes());
//       } catch (err) {
//         setError(formatApiError(err));
//         setLeaveTypes([]);
//       }
//     };

//     loadLeaveTypes();
//   }, []);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/leave/policies", {
//         params: { page, page_size: pageSize, search },
//       });
//       const data = res.data?.data ?? res.data ?? [];
//       const items = Array.isArray(data)
//         ? data
//         : data?.items ?? data?.results ?? data?.policies ?? res.data?.policies ?? [];
//       setList(items);
//       setTotal(res.data?.total ?? res.data?.count ?? items.length);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [page, pageSize, search]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchData();
//     }, 0);

//     return () => clearTimeout(timeoutId);
//   }, [fetchData]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const openAdd = () => {
//     setEditId(null);
//     setFormData(initialForm);
//     setError("");
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     setEditId(item.id || item.leave_policy_id);
//     setFormData({
//       ...initialForm,
//       ...item,
//       entitlement_type: ["fixed", "experience_based", "grant_based", "attendance_based"].includes(item.entitlement_type)
//         ? item.entitlement_type
//         : "fixed",
//       accrual_type: ["upfront", "monthly", "quarterly"].includes(item.accrual_type)
//         ? item.accrual_type
//         : "upfront",
//       effective_from: item.effective_from || "",
//       effective_to: item.effective_to || "",
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
//         ...formData,
//         leave_added_by: loggedInUserId,
//         total_leaves: Number(formData.total_leaves) || 0,
//         per_month_limit: Number.parseInt(formData.per_month_limit, 10) || 0,
//         max_applications_per_year: Number(formData.max_applications_per_year) || 0,
//         min_leave_count_for_request: Number(formData.min_leave_count_for_request) || 1,
//         grant_min_days: Number(formData.grant_min_days) || 1,
//         grant_max_days: Number(formData.grant_max_days) || 30,
//         grant_reusable_after_days: Number(formData.grant_reusable_after_days) || 0,
//         carry_forward_max: Number(formData.carry_forward_max) || 0,
//         carry_forward_expiry_months: Number(formData.carry_forward_expiry_months) || 0,
//         encashment_max_days: Number(formData.encashment_max_days) || 0,
//         max_negative_balance: Number(formData.max_negative_balance) || 0,
//         min_notice_days: Number(formData.min_notice_days) || 0,
//         document_required_after_days: Number(formData.document_required_after_days) || 0,
//         min_service_days: Number(formData.min_service_days) || 0,
//         sandwich_limit_days: Number(formData.sandwich_limit_days) || 0,
//         effective_to: formData.effective_to || null,
//       };

//       if (editId) {
//         await api.put(`/api/v1/leave/policies/${editId}`, payload);
//       } else {
//         await api.post("/api/v1/create/leave/policy", payload);
//       }
//       setShowForm(false);
//       setFormData(initialForm);
//       setEditId(null);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const totalPages = Math.ceil(total / pageSize) || 1;
//   const policyColumns = [
//     ["Policy Name", "policy_name"],
//     ["Leave Type", "leave_type_id"],
//     ["Entitlement", "entitlement_type"],
//     ["Total Leaves", "total_leaves"],
//     ["Accrual", "accrual_type"],
//     ["Per Month Limit", "per_month_limit"],
//     ["Max Applications / Year", "max_applications_per_year"],
//     ["Min Leave Count", "min_leave_count_for_request"],
//     ["Grant Min Days", "grant_min_days"],
//     ["Grant Max Days", "grant_max_days"],
//     ["Reusable After Days", "grant_reusable_after_days"],
//     ["Grant Extension as LOP", "grant_extension_as_lop"],
//     ["Carry Forward", "carry_forward_allowed"],
//     ["Carry Forward Max", "carry_forward_max"],
//     ["Carry Forward Expiry", "carry_forward_expiry_months"],
//     ["Encashment", "encashment_allowed"],
//     ["Encashment Max Days", "encashment_max_days"],
//     ["Excess as LOP", "mark_excess_as_lop"],
//     ["Max Negative Balance", "max_negative_balance"],
//     ["Min Notice Days", "min_notice_days"],
//     ["Document After Days", "document_required_after_days"],
//     ["Min Service Days", "min_service_days"],
//     ["Gender", "applicable_gender"],
//     ["Sandwich", "sandwich_enabled"],
//     ["Sandwich Limit", "sandwich_limit_days"],
//     ["Weekend Mode", "sandwich_weekends_mode"],
//     ["Holiday Mode", "sandwich_holidays_mode"],
//     ["Half Day", "allow_half_day"],
//     ["Effective From", "effective_from"],
//     ["Effective To", "effective_to"],
//     ["Reason", "reason"],
//   ];

//   return (
//     <div>
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">Leave Policies</h1>
//           <p className="mt-0.5 text-sm text-slate-500">Configure leave types and policy rules</p>
//         </div>
//         <button
//           type="button"
//           onClick={openAdd}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
//         >
//           + Add Policy
//         </button>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             placeholder="Search policies..."
//             className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//           />
//           <span className="text-sm text-slate-500">{total} policies</span>
//         </div>

//         {error && !showForm && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
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
//                   key={item.id || item.leave_policy_id || index}
//                   onClick={() => setSelectedPolicy(item)}
//                   className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Leave policy</p>
//                       <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
//                         {item.policy_name || "Unnamed policy"}
//                       </h3>
//                       <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
//                         {leaveType}
//                       </span>
//                     </div>
//                     <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
//                       {item.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </div>
//                   <div className="mt-4 grid grid-cols-3 gap-3">
//                     <div className="rounded-xl bg-slate-50 px-3 py-2">
//                       <p className="text-xs text-slate-400">Total</p>
//                       <p className="mt-0.5 font-semibold text-slate-700">{item.total_leaves ?? 0}</p>
//                     </div>
//                     <div className="rounded-xl bg-slate-50 px-3 py-2">
//                       <p className="text-xs text-slate-400">Accrual</p>
//                       <p className="mt-0.5 truncate font-semibold capitalize text-slate-700">{item.accrual_type || "—"}</p>
//                     </div>
//                     <div className="rounded-xl bg-slate-50 px-3 py-2">
//                       <p className="text-xs text-slate-400">Gender</p>
//                       <p className="mt-0.5 font-semibold capitalize text-slate-700">{item.applicable_gender || "all"}</p>
//                     </div>
//                   </div>
//                   <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
//                     <span className="text-xs font-semibold text-[#E42527] opacity-0 transition group-hover:opacity-100">
//                       View details →
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">No policies found</div>
//           ) : (
//             <table className="min-w-[2600px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/80">
//                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
//                   {policyColumns.map(([label]) => (
//                     <th key={label} className="whitespace-nowrap px-5 py-3 font-medium text-slate-500">
//                       {label}
//                     </th>
//                   ))}
//                   <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-500">Status</th>
//                   <th className="px-5 py-3 font-medium text-slate-500 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {list.map((item, i) => (
//                   <tr key={item.id || item.leave_policy_id || i} className="hover:bg-slate-50/70">
//                     <td className="px-5 py-3.5 text-slate-500">{(page - 1) * pageSize + i + 1}</td>
//                     {policyColumns.map(([, key]) => {
//                       const value = item[key];
//                       const displayValue =
//                         key === "leave_type_id"
//                           ? getLeaveTypeName(
//                               leaveTypes.find(
//                                 (leaveType) => String(getLeaveTypeId(leaveType)) === String(value)
//                               ) || { leave_type_id: value }
//                             )
//                           : typeof value === "boolean"
//                           ? value
//                             ? "Yes"
//                             : "No"
//                           : value ?? "—";

//                       return (
//                         <td key={key} className="max-w-[220px] whitespace-nowrap px-5 py-3.5 text-slate-600">
//                           {displayValue}
//                         </td>
//                       );
//                     })}
//                     <td className="px-5 py-3.5">
//                       <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
//                         {item.is_active ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       <button onClick={() => openEdit(item)} className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">
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
//             <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
//             <div className="flex gap-2">
//               <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Prev</button>
//               <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">{editId ? "Edit Leave Policy" : "Add Leave Policy"}</h2>
//               <button onClick={() => { setShowForm(false); setError(""); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Policy Name *</label>
//                     <input required value={formData.policy_name} onChange={(e) => handleChange("policy_name", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]/30" />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Leave Type *</label>
//                     <select required value={formData.leave_type_id} onChange={(e) => handleChange("leave_type_id", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]/30">
//                       <option value="">Select leave type</option>
//                       {leaveTypes.map((leaveType) => {
//                         const id = getLeaveTypeId(leaveType);

//                         return id ? (
//                           <option key={id} value={id}>
//                             {getLeaveTypeName(leaveType)}
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Total Leaves</label>
//                     <input type="number" value={formData.total_leaves} onChange={(e) => handleChange("total_leaves", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Entitlement Type</label>
//                     <select value={formData.entitlement_type} onChange={(e) => handleChange("entitlement_type", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]">
//                       <option value="fixed">Fixed</option>
//                       <option value="experience_based">Experience based</option>
//                       <option value="grant_based">Grant based</option>
//                       <option value="attendance_based">Attendance based</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Accrual Type</label>
//                     <select value={formData.accrual_type} onChange={(e) => handleChange("accrual_type", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]">
//                       <option value="upfront">Upfront</option>
//                       <option value="monthly">Monthly</option>
//                       <option value="quarterly">Quarterly</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Per Month Limit</label>
//                     <input min="0" step="1" type="number" value={formData.per_month_limit} onChange={(e) => handleChange("per_month_limit", e.target.value.replace(/\D/g, ""))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Grant Min Days</label>
//                     <input type="number" value={formData.grant_min_days} onChange={(e) => handleChange("grant_min_days", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Grant Max Days</label>
//                     <input type="number" value={formData.grant_max_days} onChange={(e) => handleChange("grant_max_days", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Effective From *</label>
//                     <input required type="date" value={formData.effective_from} onChange={(e) => handleChange("effective_from", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Effective To</label>
//                     <input type="date" value={formData.effective_to} onChange={(e) => handleChange("effective_to", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]" />
//                   </div>
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Gender</label>
//                     <select value={formData.applicable_gender} onChange={(e) => handleChange("applicable_gender", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]">
//                       <option value="all">All</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-4">
//                   {[
//                     ["carry_forward_allowed", "Carry Forward"],
//                     ["encashment_allowed", "Encashment"],
//                     ["allow_half_day", "Half Day"],
//                     ["sandwich_enabled", "Sandwich"],
//                     ["mark_excess_as_lop", "Excess as LOP"],
//                     ["is_active", "Active"],
//                   ].map(([key, label]) => (
//                     <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
//                       <input type="checkbox" checked={!!formData[key]} onChange={(e) => handleChange(key, e.target.checked)} className="rounded border-slate-300 text-[#E42527] focus:ring-[#E42527]" />
//                       {label}
//                     </label>
//                   ))}
//                 </div>

//                 {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
//               </div>

//               <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//                 <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
//                 <button type="submit" disabled={saving} className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
//                   {saving ? "Saving..." : editId ? "Update" : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {selectedPolicy && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Leave policy details</p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
//                   {selectedPolicy.policy_name || "Unnamed policy"}
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedPolicy(null)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//                 {policyColumns.map(([label, key]) => {
//                   const value = selectedPolicy[key];
//                   const displayValue =
//                     key === "leave_type_id"
//                       ? getLeaveTypeName(
//                           leaveTypes.find(
//                             (leaveType) => String(getLeaveTypeId(leaveType)) === String(value)
//                           ) || { leave_type_id: value }
//                         )
//                       : typeof value === "boolean"
//                       ? value
//                         ? "Yes"
//                         : "No"
//                       : value ?? "—";

//                   return (
//                     <div key={key} className="rounded-lg bg-slate-50 px-3 py-2.5">
//                       <p className="text-xs text-slate-400">{label}</p>
//                       <p className="mt-1 break-all text-sm font-medium capitalize text-slate-800">{displayValue}</p>
//                     </div>
//                   );
//                 })}
//                 <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                   <p className="text-xs text-slate-400">Status</p>
//                   <p className="mt-1 text-sm font-medium text-slate-800">
//                     {selectedPolicy.is_active ? "Active" : "Inactive"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setSelectedPolicy(null)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedPolicy(null);
//                   openEdit(selectedPolicy);
//                 }}
//                 className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//               >
//                 Edit policy
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
import { useAuthStore } from "@/app/store/authStore";

const initialForm = {
  leave_type_id: "",
  policy_name: "",
  entitlement_type: "fixed",
  total_leaves: 0,
  accrual_type: "upfront",
  per_month_limit: 0,
  max_applications_per_year: 0,
  min_leave_count_for_request: 1,
  grant_min_days: 1,
  grant_max_days: 30,
  grant_reusable_after_days: 0,
  grant_extension_as_lop: false,
  carry_forward_allowed: false,
  carry_forward_max: 0,
  carry_forward_expiry_months: 0,
  encashment_allowed: false,
  encashment_max_days: 0,
  mark_excess_as_lop: false,
  max_negative_balance: 0,
  min_notice_days: 0,
  document_required_after_days: 0,
  min_service_days: 0,
  applicable_gender: "all",
  sandwich_enabled: false,
  sandwich_limit_days: 0,
  sandwich_weekends_mode: "include",
  sandwich_holidays_mode: "include",
  allow_half_day: true,
  effective_from: "",
  effective_to: "",
  is_active: true,
  reason: "",
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

const getItems = (response) => {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return (
    data?.items ??
    data?.results ??
    data?.leave_types ??
    data?.policies ??
    data?.employees ??
    data?.rules ??
    response?.data?.leave_types ??
    []
  );
};

const getLeaveTypeId = (lt) => lt.leave_type_id || lt.id || lt._id;
const getLeaveTypeName = (lt) =>
  lt.leave_type_name || lt.name || lt.type_name || getLeaveTypeId(lt);

const getPolicyId = (policy) =>
  policy?.leave_policy_id || policy?.policy_id || policy?.id || policy?._id;

const getEmployeeId = (employee) =>
  employee?.employee_id || employee?.id || employee?._id;

const getEmployeeName = (employee) =>
  employee?.name ||
  [employee?.first_name, employee?.last_name].filter(Boolean).join(" ") ||
  employee?.company_email ||
  getEmployeeId(employee);

const fetchLeaveTypes = async () => {
  const endpoints = [
    "/api/v1/get/leave/type",
    "/api/v1/leave/types",
    "/api/v1/get/leave/types",
    "/api/v1/get/leave/type/list",
  ];
  for (const endpoint of endpoints) {
    try {
      const res = await api.get(endpoint);
      return getItems(res);
    } catch {}
  }
  return [];
};

export default function LeavePoliciesPage() {
  const user = useAuthStore((s) => s.user);
  const loggedInUserId =
    user?.user_id || user?.userId || user?.id || user?.sub || "";

  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [tiers, setTiers] = useState([
    { min_service_days: 0, annual_quota: 0, sort_order: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [provisionEmployees, setProvisionEmployees] = useState([]);
  const [provisionSelected, setProvisionSelected] = useState([]);
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionSaving, setProvisionSaving] = useState(false);
  const [provisionError, setProvisionError] = useState("");
  const [showProvision, setShowProvision] = useState(false);

  useEffect(() => {
    fetchLeaveTypes().then(setLeaveTypes).catch(() => setLeaveTypes([]));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/leave/policies", {
        params: { page, page_size: pageSize, search },
      });
      const data = res.data?.data ?? res.data ?? [];
      const items = Array.isArray(data)
        ? data
        : data?.items ?? data?.results ?? data?.policies ?? [];
      setList(items);
      setTotal(res.data?.total ?? res.data?.count ?? items.length);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 0);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openProvision = async (policy) => {
    const policyId = getPolicyId(policy);
    if (!policyId) return;
    setProvisionLoading(true);
    setProvisionError("");
    setProvisionSelected([]);
    setShowProvision(true);
    try {
      const employeeResponse = await api.get("/api/v1/get/employees", {
        params: { page: 1, page_size: 1000 },
      });
      const employees = getItems(employeeResponse);
      setProvisionEmployees(Array.isArray(employees) ? employees : []);
    } catch (err) {
      setProvisionEmployees([]);
      setProvisionError(formatApiError(err));
    } finally {
      setProvisionLoading(false);
    }
  };

  const provisionSelectedBalances = async () => {
    if (!selectedPolicy || provisionSelected.length === 0) return;
    setProvisionSaving(true);
    setProvisionError("");
    try {
      await Promise.all(
        provisionSelected.map((employeeId) =>
          api.post(`/api/v1/leave/employees/${employeeId}/provision-balances`)
        )
      );
      setShowProvision(false);
      setProvisionSelected([]);
    } catch (err) {
      setProvisionError(formatApiError(err));
    } finally {
      setProvisionSaving(false);
    }
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const addTier = () => {
    setTiers([...tiers, { min_service_days: 0, annual_quota: 0, sort_order: 0 }]);
  };

  const removeTier = (index) => {
    if (tiers.length === 1) return;
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const openAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setTiers([{ min_service_days: 0, annual_quota: 0, sort_order: 0 }]);
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.id || item.leave_policy_id);
    setFormData({
      ...initialForm,
      ...item,
      entitlement_type: [
        "fixed",
        "experience_based",
        "grant_based",
        "attendance_based",
      ].includes(item.entitlement_type)
        ? item.entitlement_type
        : "fixed",
      accrual_type: ["upfront", "monthly", "quarterly"].includes(item.accrual_type)
        ? item.accrual_type
        : "upfront",
      effective_from: item.effective_from || "",
      effective_to: item.effective_to || "",
    });
    setTiers([{ min_service_days: 0, annual_quota: 0, sort_order: 0 }]);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...formData,
        leave_added_by: loggedInUserId,
        total_leaves: Number(formData.total_leaves) || 0,
        per_month_limit: Number(formData.per_month_limit) || 0,
        max_applications_per_year: Number(formData.max_applications_per_year) || 0,
        min_leave_count_for_request: Number(formData.min_leave_count_for_request) || 1,
        grant_min_days: Number(formData.grant_min_days) || 1,
        grant_max_days: Number(formData.grant_max_days) || 30,
        grant_reusable_after_days: Number(formData.grant_reusable_after_days) || 0,
        carry_forward_max: Number(formData.carry_forward_max) || 0,
        carry_forward_expiry_months: Number(formData.carry_forward_expiry_months) || 0,
        encashment_max_days: Number(formData.encashment_max_days) || 0,
        max_negative_balance: Number(formData.max_negative_balance) || 0,
        min_notice_days: Number(formData.min_notice_days) || 0,
        document_required_after_days: Number(formData.document_required_after_days) || 0,
        min_service_days: Number(formData.min_service_days) || 0,
        sandwich_limit_days: Number(formData.sandwich_limit_days) || 0,
        effective_to: formData.effective_to || null,
      };

      let policyId = editId;

      if (editId) {
        await api.put(`/api/v1/leave/policies/${editId}`, payload);
      } else {
        const res = await api.post("/api/v1/create/leave/policy", payload);
        policyId =
          res.data?.leave_policy?.leave_policy_id ||
          res.data?.leave_policy_id ||
          res.data?.data?.leave_policy_id ||
          res.data?.id;
      }

      if (formData.entitlement_type === "experience_based" && policyId) {
        for (const tier of tiers) {
          await api.post("/api/v1/experience/leave/policies/tiers", {
            leave_policy_id: policyId,
            min_service_days: Number(tier.min_service_days) || 0,
            annual_quota: Number(tier.annual_quota) || 0,
            sort_order: Number(tier.sort_order) || 0,
          });
        }
      }

      setShowForm(false);
      setFormData(initialForm);
      setTiers([{ min_service_days: 0, annual_quota: 0, sort_order: 0 }]);
      setEditId(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Leave Policies</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Configure leave types and policy rules
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
        >
          + Add Policy
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search policies..."
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
          />
          <span className="text-sm text-slate-500">{total} policies</span>
        </div>

        {error && !showForm && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && list.length > 0 && (
          <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((item, index) => {
              const leaveTypeName = getLeaveTypeName(
                leaveTypes.find(
                  (t) => String(getLeaveTypeId(t)) === String(item.leave_type_id)
                ) || { leave_type_id: item.leave_type_id }
              );
              return (
                <button
                  type="button"
                  key={item.id || item.leave_policy_id || index}
                  onClick={() => setSelectedPolicy(item)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Leave policy
                      </p>
                      <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
                        {item.policy_name || "Unnamed policy"}
                      </h3>
                      <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {leaveTypeName}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                        item.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="mt-0.5 font-semibold text-slate-700">
                        {item.total_leaves ?? 0}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400">Entitlement</p>
                      <p className="mt-0.5 truncate font-semibold capitalize text-slate-700">
                        {item.entitlement_type || "—"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400">Gender</p>
                      <p className="mt-0.5 font-semibold capitalize text-slate-700">
                        {item.applicable_gender || "all"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-[#E42527] opacity-0 transition group-hover:opacity-100">
                      View details →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div>
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-500">No policies found</div>
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

      {/* ==================== ADD / EDIT MODAL ==================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editId ? "Edit Leave Policy" : "Add Leave Policy"}
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
              <div className="max-h-[75vh] space-y-6 overflow-y-auto px-5 py-5">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Policy Name *
                    </label>
                    <input
                      required
                      value={formData.policy_name}
                      onChange={(e) => handleChange("policy_name", e.target.value)}
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
                      {leaveTypes.map((lt) => {
                        const id = getLeaveTypeId(lt);
                        return id ? (
                          <option key={id} value={id}>
                            {getLeaveTypeName(lt)}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Entitlement Type *
                    </label>
                    <select
                      value={formData.entitlement_type}
                      onChange={(e) => handleChange("entitlement_type", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="experience_based">Experience based</option>
                      <option value="grant_based">Grant based</option>
                      <option value="attendance_based">Attendance based</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Total Leaves
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.total_leaves}
                      onChange={(e) => handleChange("total_leaves", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Accrual Type
                    </label>
                    <select
                      value={formData.accrual_type}
                      onChange={(e) => handleChange("accrual_type", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="upfront">Upfront</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Per Month Limit
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.per_month_limit}
                      onChange={(e) => handleChange("per_month_limit", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Max Applications / Year
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.max_applications_per_year}
                      onChange={(e) =>
                        handleChange("max_applications_per_year", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Min Leave Count for Request
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_leave_count_for_request}
                      onChange={(e) =>
                        handleChange("min_leave_count_for_request", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Grant Min Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.grant_min_days}
                      onChange={(e) => handleChange("grant_min_days", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Grant Max Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.grant_max_days}
                      onChange={(e) => handleChange("grant_max_days", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Grant Reusable After Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.grant_reusable_after_days}
                      onChange={(e) =>
                        handleChange("grant_reusable_after_days", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Min Notice Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_notice_days}
                      onChange={(e) => handleChange("min_notice_days", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Document Required After Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.document_required_after_days}
                      onChange={(e) =>
                        handleChange("document_required_after_days", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Min Service Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_service_days}
                      onChange={(e) => handleChange("min_service_days", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Carry Forward Max
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.carry_forward_max}
                      onChange={(e) => handleChange("carry_forward_max", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Carry Forward Expiry (Months)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.carry_forward_expiry_months}
                      onChange={(e) =>
                        handleChange("carry_forward_expiry_months", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Encashment Max Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.encashment_max_days}
                      onChange={(e) =>
                        handleChange("encashment_max_days", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Max Negative Balance
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.max_negative_balance}
                      onChange={(e) =>
                        handleChange("max_negative_balance", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sandwich Limit Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sandwich_limit_days}
                      onChange={(e) =>
                        handleChange("sandwich_limit_days", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Effective From *
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.effective_from}
                      onChange={(e) => handleChange("effective_from", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Effective To
                    </label>
                    <input
                      type="date"
                      value={formData.effective_to}
                      onChange={(e) => handleChange("effective_to", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Applicable Gender
                    </label>
                    <select
                      value={formData.applicable_gender}
                      onChange={(e) =>
                        handleChange("applicable_gender", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="all">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sandwich Weekends Mode
                    </label>
                    <select
                      value={formData.sandwich_weekends_mode}
                      onChange={(e) =>
                        handleChange("sandwich_weekends_mode", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="include">Include</option>
                      <option value="exclude">Exclude</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sandwich Holidays Mode
                    </label>
                    <select
                      value={formData.sandwich_holidays_mode}
                      onChange={(e) =>
                        handleChange("sandwich_holidays_mode", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="include">Include</option>
                      <option value="exclude">Exclude</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    ["grant_extension_as_lop", "Grant Extension as LOP"],
                    ["carry_forward_allowed", "Carry Forward Allowed"],
                    ["encashment_allowed", "Encashment Allowed"],
                    ["mark_excess_as_lop", "Mark Excess as LOP"],
                    ["sandwich_enabled", "Sandwich Enabled"],
                    ["allow_half_day", "Allow Half Day"],
                    ["is_active", "Active"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={!!formData[key]}
                        onChange={(e) => handleChange(key, e.target.checked)}
                        className="rounded border-slate-300 text-[#E42527] focus:ring-[#E42527]"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                {/* Reason */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Reason / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                {/* ========== EXPERIENCE TIERS ========== */}
                {formData.entitlement_type === "experience_based" && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Experience Tiers <span className="text-red-500">*</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Mandatory for Experience based policy
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addTier}
                        className="rounded-lg border border-[#E42527] bg-white px-3 py-1.5 text-xs font-medium text-[#E42527] hover:bg-red-50"
                      >
                        + Add Tier
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tiers.map((tier, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-3 rounded-lg bg-white p-3 sm:grid-cols-4"
                        >
                          <div>
                            <label className="mb-1 block text-xs text-slate-500">
                              Min Service Days
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={tier.min_service_days}
                              onChange={(e) =>
                                handleTierChange(index, "min_service_days", e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-slate-500">
                              Annual Quota
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={tier.annual_quota}
                              onChange={(e) =>
                                handleTierChange(index, "annual_quota", e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-slate-500">
                              Sort Order
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={tier.sort_order}
                              onChange={(e) =>
                                handleTierChange(index, "sort_order", e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeTier(index)}
                              disabled={tiers.length === 1}
                              className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

      {/* Details Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Leave policy details
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  {selectedPolicy.policy_name || "Unnamed policy"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 px-5 py-5">
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400">Entitlement Type</p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                  {selectedPolicy.entitlement_type || "—"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400">Total Leaves</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {selectedPolicy.total_leaves ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400">Status</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {selectedPolicy.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => openProvision(selectedPolicy)}
                className="mr-auto rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
              >
                Provision for Employees
              </button>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPolicy(null);
                  openEdit(selectedPolicy);
                }}
                className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
              >
                Edit policy
              </button>
            </div>
          </div>
        </div>
      )}

      {showProvision && selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Provision leave balances
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  {selectedPolicy.policy_name || "Leave policy"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowProvision(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
              {provisionLoading ? (
                <p className="py-10 text-center text-sm text-slate-500">Loading employees...</p>
              ) : provisionEmployees.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  No employees found.
                </p>
              ) : (
                <div className="space-y-2">
                  {provisionEmployees.map((employee, index) => {
                    const employeeId = String(getEmployeeId(employee));
                    return (
                      <label
                        key={`${employeeId}-${index}`}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={provisionSelected.includes(employeeId)}
                          onChange={() =>
                            setProvisionSelected((current) =>
                              current.includes(employeeId)
                                ? current.filter((id) => id !== employeeId)
                                : [...current, employeeId]
                            )
                          }
                          className="rounded border-slate-300 text-[#E42527]"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {getEmployeeName(employee)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              {provisionError && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {provisionError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowProvision(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={provisionSaving || provisionLoading || provisionSelected.length === 0}
                onClick={provisionSelectedBalances}
                className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
              >
                {provisionSaving ? "Provisioning..." : `Provision Selected (${provisionSelected.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}