

// //  new code 

// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// // ═══════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════

// const TODAY = new Date().toISOString().split("T")[0];

// const initialForm = {
//   leave_type_id: "",
//   policy_name: "",
//   entitlement_type: "fixed",
//   total_leaves: 12,
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
//   effective_from: TODAY,
//   effective_to: "",
//   is_active: true,
//   reason: "",
// };

// const EMPTY_TIER = {
//   tier_id: null,
//   min_service_days: 0,
//   annual_quota: 0,
//   sort_order: 0,
// };

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

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
//   return err?.response?.data?.message || err?.message || "Something went wrong";
// };

// const getLeaveTypeId = (lt) => lt?.leave_type_id || null;
// const getLeaveTypeName = (lt) => lt?.leave_type_name || lt?.leave_type_id || "Unknown";

// const getPolicyId = (policy) => policy?.leave_policy_id || null;
// const getEmployeeId = (emp) => emp?.employee_id || null;
// const getEmployeeName = (emp) =>
//   emp?.name ||
//   [emp?.first_name, emp?.last_name].filter(Boolean).join(" ") ||
//   emp?.personal_email ||
//   emp?.employee_id ||
//   "Unknown";

// // ═══════════════════════════════════════════════════════════
// // PAGE
// // ═══════════════════════════════════════════════════════════

// export default function LeavePoliciesPage() {
//   const user = useAuthStore((s) => s.user);

//   // List state
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [formData, setFormData] = useState(initialForm);
//   const [tiers, setTiers] = useState([{ ...EMPTY_TIER }]);
//   const [saving, setSaving] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");

//   // Leave types
//   const [leaveTypes, setLeaveTypes] = useState([]);

//   // Details modal
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   // Provision modal
//   const [showProvision, setShowProvision] = useState(false);
//   const [provisionEmployees, setProvisionEmployees] = useState([]);
//   const [provisionSelected, setProvisionSelected] = useState([]);
//   const [provisionLoading, setProvisionLoading] = useState(false);
//   const [provisionSaving, setProvisionSaving] = useState(false);
//   const [provisionError, setProvisionError] = useState("");

//   // ═════════════════════════════════════════════════════════
//   // FETCH LEAVE TYPES
//   // ═════════════════════════════════════════════════════════

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get("/api/v1/get/leave/type", {
//           params: { page: 1, page_size: 100 },
//         });
//         const items = res.data?.leave_types || res.data?.data || [];
//         setLeaveTypes(Array.isArray(items) ? items : []);
//       } catch (err) {
//         console.error("Failed to load leave types:", err);
//         setLeaveTypes([]);
//       }
//     })();
//   }, []);

//   // ═════════════════════════════════════════════════════════
//   // FETCH POLICIES
//   // ═════════════════════════════════════════════════════════

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/leave/policies", {
//         params: { page, page_size: pageSize, search },
//       });
//       const items = res.data?.policies || res.data?.data || [];
//       setList(Array.isArray(items) ? items : []);
//       setTotal(res.data?.total ?? items.length);
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, pageSize, search]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // ═════════════════════════════════════════════════════════
//   // FORM HANDLERS
//   // ═════════════════════════════════════════════════════════

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleTierChange = (index, field, value) => {
//     setTiers((prev) => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   };

//   const addTier = () => setTiers((prev) => [...prev, { ...EMPTY_TIER }]);

//   const removeTier = (index) => {
//     if (tiers.length === 1) return;
//     setTiers((prev) => prev.filter((_, i) => i !== index));
//   };

//   const openAdd = () => {
//     setEditId(null);
//     setFormData(initialForm);
//     setTiers([{ ...EMPTY_TIER }]);
//     setError("");
//     setSuccessMsg("");
//     setShowForm(true);
//   };

//   const openEdit = async (item) => {
//     const policyId = getPolicyId(item);
//     if (!policyId) return;

//     setEditId(policyId);
//     setFormData({
//       ...initialForm,
//       ...item,
//       entitlement_type: [
//         "fixed",
//         "experience_based",
//         "grant_based",
//         "attendance_based",
//       ].includes(item.entitlement_type)
//         ? item.entitlement_type
//         : "fixed",
//       accrual_type: ["upfront", "monthly", "quarterly"].includes(item.accrual_type)
//         ? item.accrual_type
//         : "upfront",
//       effective_from: item.effective_from || TODAY,
//       effective_to: item.effective_to || "",
//       // Normalize numeric nulls
//       per_month_limit: item.per_month_limit ?? 0,
//       max_applications_per_year: item.max_applications_per_year ?? 0,
//       min_leave_count_for_request: item.min_leave_count_for_request ?? 1,
//       grant_min_days: item.grant_min_days ?? 1,
//       grant_max_days: item.grant_max_days ?? 30,
//       grant_reusable_after_days: item.grant_reusable_after_days ?? 0,
//       carry_forward_max: item.carry_forward_max ?? 0,
//       carry_forward_expiry_months: item.carry_forward_expiry_months ?? 0,
//       encashment_max_days: item.encashment_max_days ?? 0,
//       max_negative_balance: item.max_negative_balance ?? 0,
//       min_notice_days: item.min_notice_days ?? 0,
//       document_required_after_days: item.document_required_after_days ?? 0,
//       min_service_days: item.min_service_days ?? 0,
//       sandwich_limit_days: item.sandwich_limit_days ?? 0,
//     });

//     // Fetch existing tiers if experience-based
//     if (item.entitlement_type === "experience_based") {
//       try {
//         const res = await api.get(
//           `/api/v1/experience/leave/policies/${policyId}/tiers`
//         );
//         const existingTiers = (res.data?.experience_tiers || []).map((t) => ({
//           tier_id: t.tier_id,
//           min_service_days: t.min_service_days ?? 0,
//           annual_quota: t.annual_quota ?? 0,
//           sort_order: t.sort_order ?? 0,
//         }));
//         setTiers(
//           existingTiers.length > 0 ? existingTiers : [{ ...EMPTY_TIER }]
//         );
//       } catch (err) {
//         console.error("Failed to load tiers:", err);
//         setTiers([{ ...EMPTY_TIER }]);
//       }
//     } else {
//       setTiers([{ ...EMPTY_TIER }]);
//     }

//     setError("");
//     setSuccessMsg("");
//     setShowForm(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccessMsg("");

//     try {
//       // Build payload matching backend schema
//       const payload = {
//         leave_type_id: formData.leave_type_id,
//         policy_name: formData.policy_name,
//         entitlement_type: formData.entitlement_type,
//         total_leaves: Number(formData.total_leaves) || 0,
//         accrual_type: formData.accrual_type,
//         per_month_limit: Number(formData.per_month_limit) || 0,
//         max_applications_per_year: Number(formData.max_applications_per_year) || 0,
//         min_leave_count_for_request: Number(formData.min_leave_count_for_request) || 1,
//         grant_min_days: Number(formData.grant_min_days) || 1,
//         grant_max_days: Number(formData.grant_max_days) || 30,
//         grant_reusable_after_days: Number(formData.grant_reusable_after_days) || 0,
//         grant_extension_as_lop: !!formData.grant_extension_as_lop,
//         carry_forward_allowed: !!formData.carry_forward_allowed,
//         carry_forward_max: Number(formData.carry_forward_max) || 0,
//         carry_forward_expiry_months: Number(formData.carry_forward_expiry_months) || 0,
//         encashment_allowed: !!formData.encashment_allowed,
//         encashment_max_days: Number(formData.encashment_max_days) || 0,
//         mark_excess_as_lop: !!formData.mark_excess_as_lop,
//         max_negative_balance: Number(formData.max_negative_balance) || 0,
//         min_notice_days: Number(formData.min_notice_days) || 0,
//         document_required_after_days: Number(formData.document_required_after_days) || 0,
//         min_service_days: Number(formData.min_service_days) || 0,
//         applicable_gender: formData.applicable_gender,
//         sandwich_enabled: !!formData.sandwich_enabled,
//         sandwich_limit_days: Number(formData.sandwich_limit_days) || 0,
//         sandwich_weekends_mode: formData.sandwich_weekends_mode || null,
//         sandwich_holidays_mode: formData.sandwich_holidays_mode || null,
//         allow_half_day: !!formData.allow_half_day,
//         effective_from: formData.effective_from,
//         effective_to: formData.effective_to || null,
//         is_active: !!formData.is_active,
//         reason: formData.reason || null,
//       };

//       let policyId = editId;

//       if (editId) {
//         await api.put(`/api/v1/leave/policies/${editId}`, payload);
//       } else {
//         const res = await api.post("/api/v1/create/leave/policy", payload);
//         policyId =
//           res.data?.leave_policy?.leave_policy_id ||
//           res.data?.leave_policy_id ||
//           res.data?.data?.leave_policy_id;
//       }

//       // Handle experience tiers
//       if (formData.entitlement_type === "experience_based" && policyId) {
//         for (const tier of tiers) {
//           const tierPayload = {
//             leave_policy_id: policyId,
//             min_service_days: Number(tier.min_service_days) || 0,
//             annual_quota: Number(tier.annual_quota) || 0,
//             sort_order: Number(tier.sort_order) || 0,
//           };

//           if (tier.tier_id) {
//             // Existing → update
//             await api.put(
//               `/api/v1/experience/leave/policies/tiers/${tier.tier_id}`,
//               tierPayload
//             );
//           } else {
//             // New → create
//             await api.post(
//               "/api/v1/experience/leave/policies/tiers",
//               tierPayload
//             );
//           }
//         }
//       }

//       setSuccessMsg(editId ? "Policy updated successfully" : "Policy created successfully");

//       // Reset form and refresh list
//       await fetchData();
//       setTimeout(() => {
//         setShowForm(false);
//         setFormData(initialForm);
//         setTiers([{ ...EMPTY_TIER }]);
//         setEditId(null);
//         setSuccessMsg("");
//       }, 700);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ═════════════════════════════════════════════════════════
//   // PROVISION
//   // ═════════════════════════════════════════════════════════

//   const openProvision = async (policy) => {
//     const policyId = getPolicyId(policy);
//     if (!policyId) return;

//     setProvisionLoading(true);
//     setProvisionError("");
//     setProvisionSelected([]);
//     setShowProvision(true);

//     try {
//       const res = await api.get("/api/v1/get/employees");
//       const employees = res.data?.employees || res.data?.data || [];
//       setProvisionEmployees(Array.isArray(employees) ? employees : []);
//     } catch (err) {
//       setProvisionEmployees([]);
//       setProvisionError(formatApiError(err));
//     } finally {
//       setProvisionLoading(false);
//     }
//   };

//   const provisionSelectedBalances = async () => {
//     if (!selectedPolicy || provisionSelected.length === 0) return;
//     setProvisionSaving(true);
//     setProvisionError("");

//     try {
//       const results = await Promise.allSettled(
//         provisionSelected.map((employeeId) =>
//           api.post(`/api/v1/leave/employees/${employeeId}/provision-balances`)
//         )
//       );
//       const failed = results.filter((r) => r.status === "rejected");
//       if (failed.length > 0) {
//         setProvisionError(`${failed.length} employee(s) failed to provision`);
//         return;
//       }
//       setShowProvision(false);
//       setProvisionSelected([]);
//     } catch (err) {
//       setProvisionError(formatApiError(err));
//     } finally {
//       setProvisionSaving(false);
//     }
//   };

//   // ═════════════════════════════════════════════════════════
//   // DELETE (Deactivate) POLICY
//   // ═════════════════════════════════════════════════════════

//   const handleDeactivate = async (policy) => {
//     const policyId = getPolicyId(policy);
//     if (!policyId) return;
//     if (!confirm(`Deactivate "${policy.policy_name}"? You can reactivate later.`)) return;

//     try {
//       await api.put(`/api/v1/leave/policies/${policyId}`, {
//         ...policy,
//         is_active: false,
//       });
//       setSelectedPolicy(null);
//       await fetchData();
//     } catch (err) {
//       alert(formatApiError(err));
//     }
//   };

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   // ═════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════

//   return (
//     <div>
//       {/* ==================== HEADER ==================== */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">Leave Policies</h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Configure leave types and policy rules
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={openAdd}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
//         >
//           + Add Policy
//         </button>
//       </div>

//       {/* ==================== LIST CARD ==================== */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
//           <input
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search policies..."
//             className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//           />
//           <span className="text-sm text-slate-500">{total} policies</span>
//         </div>

//         {error && !showForm && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {!loading && list.length > 0 && (
//           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
//             {list.map((item, index) => {
//               const leaveTypeName = getLeaveTypeName(
//                 leaveTypes.find(
//                   (t) => String(getLeaveTypeId(t)) === String(item.leave_type_id)
//                 ) || { leave_type_id: item.leave_type_id }
//               );
//               return (
//                 <button
//                   type="button"
//                   key={getPolicyId(item) || index}
//                   onClick={() => setSelectedPolicy(item)}
//                   className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                         Leave policy
//                       </p>
//                       <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
//                         {item.policy_name || "Unnamed policy"}
//                       </h3>
//                       <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
//                         {leaveTypeName}
//                       </span>
//                     </div>
//                     <span
//                       className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
//                         item.is_active
//                           ? "bg-emerald-50 text-emerald-700"
//                           : "bg-slate-100 text-slate-600"
//                       }`}
//                     >
//                       {item.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   <div className="mt-4 grid grid-cols-3 gap-3">
//                     <div className="rounded-xl bg-slate-50 px-3 py-2">
//                       <p className="text-xs text-slate-400">Total</p>
//                       <p className="mt-0.5 font-semibold text-slate-700">
//                         {item.total_leaves ?? 0}
//                       </p>
//                     </div>
//                     <div className="rounded-xl bg-slate-50 px-3 py-2">
//                       <p className="text-xs text-slate-400">Entitlement</p>
//                       <p className="mt-0.5 truncate font-semibold capitalize text-slate-700">
//                         {item.entitlement_type || "—"}
//                       </p>
//                     </div>
//                     <div className="rounded-xl bg-slate-50 px-3 py-2">
//                       <p className="text-xs text-slate-400">Gender</p>
//                       <p className="mt-0.5 font-semibold capitalize text-slate-700">
//                         {item.applicable_gender || "all"}
//                       </p>
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

//         <div>
//           {loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">No policies found</div>
//           ) : null}
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

//       {/* ==================== ADD / EDIT MODAL ==================== */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Leave Policy" : "Add Leave Policy"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowForm(false);
//                   setError("");
//                   setSuccessMsg("");
//                 }}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[75vh] space-y-6 overflow-y-auto px-5 py-5">
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   {/* Policy Name */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Policy Name *
//                     </label>
//                     <input
//                       required
//                       value={formData.policy_name}
//                       onChange={(e) => handleChange("policy_name", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Leave Type */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Leave Type *
//                     </label>
//                     <select
//                       required
//                       value={formData.leave_type_id}
//                       onChange={(e) => handleChange("leave_type_id", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="">Select leave type</option>
//                       {leaveTypes.map((lt) => {
//                         const id = getLeaveTypeId(lt);
//                         return id ? (
//                           <option key={id} value={id}>
//                             {getLeaveTypeName(lt)}
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   </div>

//                   {/* Entitlement Type */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Entitlement Type *
//                     </label>
//                     <select
//                       value={formData.entitlement_type}
//                       onChange={(e) => handleChange("entitlement_type", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="fixed">Fixed</option>
//                       <option value="experience_based">Experience based</option>
//                       <option value="grant_based">Grant based</option>
//                       <option value="attendance_based">Attendance based</option>
//                     </select>
//                   </div>

//                   {/* Total Leaves */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Total Leaves
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.total_leaves}
//                       onChange={(e) => handleChange("total_leaves", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Accrual Type */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Accrual Type
//                     </label>
//                     <select
//                       value={formData.accrual_type}
//                       onChange={(e) => handleChange("accrual_type", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="upfront">Upfront</option>
//                       <option value="monthly">Monthly</option>
//                       <option value="quarterly">Quarterly</option>
//                     </select>
//                   </div>

//                   {/* Per Month Limit */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Per Month Limit
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.per_month_limit}
//                       onChange={(e) => handleChange("per_month_limit", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Max Applications */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Max Applications / Year
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.max_applications_per_year}
//                       onChange={(e) =>
//                         handleChange("max_applications_per_year", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Min Leave Count */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Min Leave Count for Request
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.min_leave_count_for_request}
//                       onChange={(e) =>
//                         handleChange("min_leave_count_for_request", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Grant Min Days */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Grant Min Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.grant_min_days}
//                       onChange={(e) => handleChange("grant_min_days", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Grant Max Days */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Grant Max Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.grant_max_days}
//                       onChange={(e) => handleChange("grant_max_days", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Grant Reusable */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Grant Reusable After Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.grant_reusable_after_days}
//                       onChange={(e) =>
//                         handleChange("grant_reusable_after_days", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Min Notice Days */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Min Notice Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.min_notice_days}
//                       onChange={(e) => handleChange("min_notice_days", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Doc Required After */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Document Required After Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.document_required_after_days}
//                       onChange={(e) =>
//                         handleChange("document_required_after_days", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Min Service Days */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Min Service Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.min_service_days}
//                       onChange={(e) => handleChange("min_service_days", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Carry Forward Max */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Carry Forward Max
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.carry_forward_max}
//                       onChange={(e) =>
//                         handleChange("carry_forward_max", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Carry Forward Expiry */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Carry Forward Expiry (Months)
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.carry_forward_expiry_months}
//                       onChange={(e) =>
//                         handleChange("carry_forward_expiry_months", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Encashment Max Days */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Encashment Max Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.encashment_max_days}
//                       onChange={(e) =>
//                         handleChange("encashment_max_days", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Max Negative Balance */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Max Negative Balance
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.max_negative_balance}
//                       onChange={(e) =>
//                         handleChange("max_negative_balance", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Sandwich Limit */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Sandwich Limit Days
//                     </label>
//                     <input
//                       type="number"
//                       step="any"
//                       min="0"
//                       value={formData.sandwich_limit_days}
//                       onChange={(e) =>
//                         handleChange("sandwich_limit_days", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Effective From */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Effective From *
//                     </label>
//                     <input
//                       required
//                       type="date"
//                       value={formData.effective_from}
//                       onChange={(e) =>
//                         handleChange("effective_from", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Effective To */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Effective To
//                     </label>
//                     <input
//                       type="date"
//                       value={formData.effective_to}
//                       onChange={(e) => handleChange("effective_to", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   {/* Applicable Gender */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Applicable Gender
//                     </label>
//                     <select
//                       value={formData.applicable_gender}
//                       onChange={(e) =>
//                         handleChange("applicable_gender", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="all">All</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                     </select>
//                   </div>

//                   {/* Sandwich Weekends Mode */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Sandwich Weekends Mode
//                     </label>
//                     <select
//                       value={formData.sandwich_weekends_mode}
//                       onChange={(e) =>
//                         handleChange("sandwich_weekends_mode", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="include">Include</option>
//                       <option value="exclude">Exclude</option>
//                     </select>
//                   </div>

//                   {/* Sandwich Holidays Mode */}
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Sandwich Holidays Mode
//                     </label>
//                     <select
//                       value={formData.sandwich_holidays_mode}
//                       onChange={(e) =>
//                         handleChange("sandwich_holidays_mode", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="include">Include</option>
//                       <option value="exclude">Exclude</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Checkboxes */}
//                 <div className="flex flex-wrap gap-x-6 gap-y-3">
//                   {[
//                     ["grant_extension_as_lop", "Grant Extension as LOP"],
//                     ["carry_forward_allowed", "Carry Forward Allowed"],
//                     ["encashment_allowed", "Encashment Allowed"],
//                     ["mark_excess_as_lop", "Mark Excess as LOP"],
//                     ["sandwich_enabled", "Sandwich Enabled"],
//                     ["allow_half_day", "Allow Half Day"],
//                     ["is_active", "Active"],
//                   ].map(([key, label]) => (
//                     <label
//                       key={key}
//                       className="flex items-center gap-2 text-sm text-slate-700"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={!!formData[key]}
//                         onChange={(e) => handleChange(key, e.target.checked)}
//                         className="rounded border-slate-300 text-[#E42527] focus:ring-[#E42527]"
//                       />
//                       {label}
//                     </label>
//                   ))}
//                 </div>

//                 {/* Reason */}
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Reason / Notes
//                   </label>
//                   <textarea
//                     rows={2}
//                     value={formData.reason}
//                     onChange={(e) => handleChange("reason", e.target.value)}
//                     className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 {/* Experience Tiers */}
//                 {formData.entitlement_type === "experience_based" && (
//                   <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                     <div className="mb-3 flex items-center justify-between">
//                       <div>
//                         <h3 className="text-sm font-semibold text-slate-800">
//                           Experience Tiers <span className="text-red-500">*</span>
//                         </h3>
//                         <p className="text-xs text-slate-500">
//                           Mandatory for Experience based policy
//                         </p>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={addTier}
//                         className="rounded-lg border border-[#E42527] bg-white px-3 py-1.5 text-xs font-medium text-[#E42527] hover:bg-red-50"
//                       >
//                         + Add Tier
//                       </button>
//                     </div>

//                     <div className="space-y-3">
//                       {tiers.map((tier, index) => (
//                         <div
//                           key={tier.tier_id || `new-${index}`}
//                           className="grid grid-cols-1 gap-3 rounded-lg bg-white p-3 sm:grid-cols-4"
//                         >
//                           <div>
//                             <label className="mb-1 block text-xs text-slate-500">
//                               Min Service Days
//                             </label>
//                             <input
//                               type="number"
//                               step="any"
//                               min="0"
//                               required
//                               value={tier.min_service_days}
//                               onChange={(e) =>
//                                 handleTierChange(
//                                   index,
//                                   "min_service_days",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//                             />
//                           </div>
//                           <div>
//                             <label className="mb-1 block text-xs text-slate-500">
//                               Annual Quota
//                             </label>
//                             <input
//                               type="number"
//                               step="any"
//                               min="0"
//                               required
//                               value={tier.annual_quota}
//                               onChange={(e) =>
//                                 handleTierChange(
//                                   index,
//                                   "annual_quota",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//                             />
//                           </div>
//                           <div>
//                             <label className="mb-1 block text-xs text-slate-500">
//                               Sort Order
//                             </label>
//                             <input
//                               type="number"
//                               step="any"
//                               min="0"
//                               value={tier.sort_order}
//                               onChange={(e) =>
//                                 handleTierChange(index, "sort_order", e.target.value)
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//                             />
//                           </div>
//                           <div className="flex items-end">
//                             <button
//                               type="button"
//                               onClick={() => removeTier(index)}
//                               disabled={tiers.length === 1}
//                               className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {error && (
//                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//                     {error}
//                   </div>
//                 )}

//                 {successMsg && (
//                   <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
//                     ✓ {successMsg}
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

//       {/* ==================== DETAILS MODAL ==================== */}
//       {selectedPolicy && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Leave policy details
//                 </p>
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

//             <div className="space-y-3 px-5 py-5">
//               <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                 <p className="text-xs text-slate-400">Entitlement Type</p>
//                 <p className="mt-1 text-sm font-medium capitalize text-slate-800">
//                   {selectedPolicy.entitlement_type || "—"}
//                 </p>
//               </div>
//               <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                 <p className="text-xs text-slate-400">Total Leaves</p>
//                 <p className="mt-1 text-sm font-medium text-slate-800">
//                   {selectedPolicy.total_leaves ?? 0}
//                 </p>
//               </div>
//               <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                 <p className="text-xs text-slate-400">Status</p>
//                 <p className="mt-1 text-sm font-medium text-slate-800">
//                   {selectedPolicy.is_active ? "Active" : "Inactive"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => openProvision(selectedPolicy)}
//                 className="mr-auto rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//               >
//                 Provision for Employees
//               </button>
//               {selectedPolicy.is_active && (
//                 <button
//                   type="button"
//                   onClick={() => handleDeactivate(selectedPolicy)}
//                   className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
//                 >
//                   Deactivate
//                 </button>
//               )}
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
//                   const policy = selectedPolicy;
//                   setSelectedPolicy(null);
//                   openEdit(policy);
//                 }}
//                 className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//               >
//                 Edit policy
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== PROVISION MODAL ==================== */}
//       {showProvision && selectedPolicy && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Provision leave balances
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
//                   {selectedPolicy.policy_name || "Leave policy"}
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setShowProvision(false)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
//               {provisionLoading ? (
//                 <p className="py-10 text-center text-sm text-slate-500">
//                   Loading employees...
//                 </p>
//               ) : provisionEmployees.length === 0 ? (
//                 <p className="py-10 text-center text-sm text-slate-500">
//                   No employees found.
//                 </p>
//               ) : (
//                 <div className="space-y-2">
//                   {provisionEmployees.map((employee, index) => {
//                     const employeeId = String(getEmployeeId(employee));
//                     if (!employeeId || employeeId === "null") return null;
//                     return (
//                       <label
//                         key={`${employeeId}-${index}`}
//                         className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={provisionSelected.includes(employeeId)}
//                           onChange={() =>
//                             setProvisionSelected((current) =>
//                               current.includes(employeeId)
//                                 ? current.filter((id) => id !== employeeId)
//                                 : [...current, employeeId]
//                             )
//                           }
//                           className="rounded border-slate-300 text-[#E42527]"
//                         />
//                         <span className="text-sm font-medium text-slate-700">
//                           {getEmployeeName(employee)}
//                         </span>
//                       </label>
//                     );
//                   })}
//                 </div>
//               )}

//               {provisionError && (
//                 <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//                   {provisionError}
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setShowProvision(false)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 disabled={
//                   provisionSaving || provisionLoading || provisionSelected.length === 0
//                 }
//                 onClick={provisionSelectedBalances}
//                 className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
//               >
//                 {provisionSaving
//                   ? "Provisioning..."
//                   : `Provision Selected (${provisionSelected.length})`}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const TODAY = new Date().toISOString().split("T")[0];
// const PAGE_SIZE = 12;
// const DEBOUNCE_MS = 450;
// const AUTO_DISMISS_MS = 5000;

// const TABS = [
//   { id: "basic", label: "Basic", icon: "📋" },
//   { id: "entitlement", label: "Entitlement", icon: "🎯" },
//   { id: "rules", label: "Rules", icon: "⚙️" },
//   { id: "advanced", label: "Advanced", icon: "🔧" },
//   { id: "applicability", label: "Who Gets This?", icon: "👥" },
// ];

// const ENTITLEMENT_TYPES = [
//   { value: "fixed", label: "Fixed", hint: "Same quota for everyone" },
//   { value: "experience_based", label: "Experience Based", hint: "Different per tier" },
//   { value: "grant_based", label: "Grant Based", hint: "Admin grants manually" },
//   { value: "attendance_based", label: "Attendance Based", hint: "Accrued by attendance" },
// ];

// const ACCRUAL_TYPES = [
//   { value: "upfront", label: "Upfront", hint: "All days at start of year" },
//   { value: "monthly", label: "Monthly", hint: "1/12th each month" },
//   { value: "quarterly", label: "Quarterly", hint: "1/4th each quarter" },
// ];

// const GENDERS = [
//   { value: "all", label: "All Genders" },
//   { value: "male", label: "Male Only" },
//   { value: "female", label: "Female Only" },
// ];

// const SANDWICH_MODES = [
//   { value: "include", label: "Include (count as leave)" },
//   { value: "exclude", label: "Exclude (don't count)" },
// ];

// const EMPTY_FORM = {
//   leave_type_id: "",
//   policy_name: "",
//   entitlement_type: "fixed",
//   total_leaves: 12,
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
//   effective_from: TODAY,
//   effective_to: "",
//   is_active: true,
//   priority: 100,
//   reason: "",
// };

// const EMPTY_TIER = { tier_id: null, min_service_days: 0, annual_quota: 0, sort_order: 0 };

// const EMPTY_SCOPE = {
//   departments: [],
//   locations: [],
//   employment_types: [],
//   specific_employees: [],
//   exclude_employees: [],
// };

// /* ══════════════════════════════════════════════════════════
//    HELPERS
//    ══════════════════════════════════════════════════════════ */

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
//   return err?.response?.data?.message || err?.message || "Something went wrong";
// };

// const toArray = (payload, keys = []) => {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;
//   for (const k of keys) if (Array.isArray(payload[k])) return payload[k];
//   return [];
// };

// const getLeaveTypeId = (lt) => lt?.leave_type_id || null;
// const getLeaveTypeName = (lt) => lt?.leave_type_name || lt?.leave_type_code || "—";
// const getPolicyId = (p) => p?.leave_policy_id || null;
// const getPolicyName = (p) => p?.policy_name || getPolicyId(p) || "Unnamed";

// const getScopeCount = (scope) =>
//   (scope?.departments?.length || 0) +
//   (scope?.locations?.length || 0) +
//   (scope?.employment_types?.length || 0) +
//   (scope?.specific_employees?.length || 0);

// /* ══════════════════════════════════════════════════════════
//    SUB-COMPONENTS
//    ══════════════════════════════════════════════════════════ */

// function Toast({ type, message, onDismiss }) {
//   useEffect(() => {
//     if (!message) return;
//     const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [message, onDismiss]);

//   if (!message) return null;
//   const styles =
//     type === "error"
//       ? "border-red-200 bg-red-50 text-red-700"
//       : "border-green-200 bg-green-50 text-green-700";

//   return (
//     <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
//       <span className="whitespace-pre-line">{message}</span>
//       <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">
//         ✕
//       </button>
//     </div>
//   );
// }

// function Field({ label, hint, required, error, children }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-xs font-medium text-slate-600">
//         {label} {required && <span className="text-red-600">*</span>}
//       </label>
//       {children}
//       {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
//       {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
//     </div>
//   );
// }

// function Toggle({ checked, onChange, label, hint }) {
//   return (
//     <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:bg-slate-50">
//       <input
//         type="checkbox"
//         checked={!!checked}
//         onChange={(e) => onChange(e.target.checked)}
//         className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#E42527]"
//       />
//       <div className="flex-1">
//         <div className="text-sm font-medium text-slate-700">{label}</div>
//         {hint && <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div>}
//       </div>
//     </label>
//   );
// }

// function MultiChipSelect({ label, icon, options, value, onChange, placeholder }) {
//   const toggle = (id) => {
//     onChange(
//       value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
//     );
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-4">
//       <div className="mb-3 flex items-center gap-2">
//         {icon && <span className="text-base">{icon}</span>}
//         <p className="text-sm font-semibold text-slate-800">{label}</p>
//         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
//           {value.length}
//         </span>
//       </div>

//       {options.length === 0 ? (
//         <p className="text-xs text-slate-400">{placeholder || "No options available"}</p>
//       ) : (
//         <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
//           {options.map((opt) => {
//             const id = opt.id || opt.value;
//             const name = opt.name || opt.label;
//             const active = value.includes(id);
//             return (
//               <button
//                 key={id}
//                 type="button"
//                 onClick={() => toggle(id)}
//                 className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
//                   active
//                     ? "border-[#E42527] bg-red-50 text-[#E42527]"
//                     : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 {active && <span>✓</span>}
//                 {name}
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function LeavePoliciesPage() {
//   /* list */
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   /* masters */
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [employmentTypes, setEmploymentTypes] = useState([]);

//   /* ui */
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* form modal */
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [activeTab, setActiveTab] = useState("basic");
//   const [formData, setFormData] = useState(EMPTY_FORM);
//   const [tiers, setTiers] = useState([{ ...EMPTY_TIER }]);
//   const [scope, setScope] = useState(EMPTY_SCOPE);
//   const [saving, setSaving] = useState(false);
//   const [formError, setFormError] = useState("");

//   /* preview + overlap */
//   const [preview, setPreview] = useState(null);
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const [overlap, setOverlap] = useState(null);
//   const [overlapLoading, setOverlapLoading] = useState(false);

//   /* details modal */
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   /* guards */
//   const reqIdRef = useRef(0);
//   const didInitRef = useRef(false);

//   /* ══════════════ LOADERS ══════════════ */

//   const loadLeaveTypes = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/leave/type", {
//         params: { page: 1, page_size: 200 },
//       });
//       setLeaveTypes(toArray(res?.data, ["leave_types", "data", "items"]));
//     } catch {
//       setLeaveTypes([]);
//     }
//   }, []);

//   const loadEmployees = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/employees");
//       setEmployees(toArray(res?.data, ["employees", "data", "items"]));
//     } catch {
//       setEmployees([]);
//     }
//   }, []);

//   const loadMasters = useCallback(async () => {
//     const safe = async (url, keys) => {
//       try {
//         const res = await api.get(url);
//         return toArray(res?.data, keys);
//       } catch {
//         return [];
//       }
//     };
//     const [d, l, et] = await Promise.all([
//       safe("/api/v1/get/departments", ["departments", "data"]),
//       safe("/api/v1/get/location/master", ["locations", "location", "data"]),
//       safe("/api/v1/get/employment/type", ["employment_types", "data"]),
//     ]);
//     setDepartments(d);
//     setLocations(l);
//     setEmploymentTypes(et);
//   }, []);

//   useEffect(() => {
//     loadLeaveTypes();
//     loadEmployees();
//     loadMasters();
//   }, [loadLeaveTypes, loadEmployees, loadMasters]);

//   /* ══════════════ POLICIES LIST ══════════════ */

//   const fetchPolicies = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/leave/policies", {
//         params: { page, page_size: PAGE_SIZE, search: search || undefined },
//       });
//       if (myReqId !== reqIdRef.current) return;
//       const items = toArray(res?.data, ["policies", "data", "items"]);
//       setList(items);
//       setTotal(res?.data?.total ?? items.length);
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, [page, search]);

//   useEffect(() => {
//     if (!didInitRef.current) {
//       didInitRef.current = true;
//       fetchPolicies();
//       return;
//     }
//     const t = setTimeout(fetchPolicies, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [fetchPolicies]);

//   /* ══════════════ FORM OPEN/CLOSE ══════════════ */

//   const openAdd = () => {
//     setEditId(null);
//     setActiveTab("basic");
//     setFormData(EMPTY_FORM);
//     setTiers([{ ...EMPTY_TIER }]);
//     setScope(EMPTY_SCOPE);
//     setFormError("");
//     setSuccess("");
//     setPreview(null);
//     setOverlap(null);
//     setShowForm(true);
//   };

//   const openEdit = async (item) => {
//     const id = getPolicyId(item);
//     if (!id) return;

//     setEditId(id);
//     setActiveTab("basic");
//     setFormData({
//       ...EMPTY_FORM,
//       ...item,
//       effective_from: item.effective_from || TODAY,
//       effective_to: item.effective_to || "",
//     });
//     setFormError("");
//     setSuccess("");
//     setPreview(null);
//     setOverlap(null);

//     /* Load tiers */
//     if (item.entitlement_type === "experience_based") {
//       try {
//         const res = await api.get(`/api/v1/experience/leave/policies/${id}/tiers`);
//         const t = toArray(res?.data, ["experience_tiers", "data"]);
//         setTiers(t.length ? t.map((x) => ({
//           tier_id: x.tier_id,
//           min_service_days: x.min_service_days ?? 0,
//           annual_quota: x.annual_quota ?? 0,
//           sort_order: x.sort_order ?? 0,
//         })) : [{ ...EMPTY_TIER }]);
//       } catch {
//         setTiers([{ ...EMPTY_TIER }]);
//       }
//     } else {
//       setTiers([{ ...EMPTY_TIER }]);
//     }

//     /* Load applicability rules — NEW ENDPOINT */
//     try {
//       const res = await api.get(
//         `/api/v1/leave/policies/${id}/applicability-rules`
//       );
//       const rules = toArray(res?.data, ["rules", "data"]);
//       const newScope = { ...EMPTY_SCOPE };
//       rules.forEach((r) => {
//         const v = r.criteria_value;
//         switch (r.criteria_type) {
//           case "department":
//             newScope.departments.push(v);
//             break;
//           case "location":
//             newScope.locations.push(v);
//             break;
//           case "employment_type":
//             newScope.employment_types.push(v);
//             break;
//           case "employee_id":
//             if (r.is_exception) newScope.exclude_employees.push(v);
//             else newScope.specific_employees.push(v);
//             break;
//         }
//       });
//       setScope(newScope);
//     } catch {
//       setScope(EMPTY_SCOPE);
//     }

//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;
//     setShowForm(false);
//     setEditId(null);
//     setFormData(EMPTY_FORM);
//     setTiers([{ ...EMPTY_TIER }]);
//     setScope(EMPTY_SCOPE);
//     setPreview(null);
//     setOverlap(null);
//     setFormError("");
//   };

//   /* ══════════════ BUILD SCOPE RULES PAYLOAD ══════════════ */

//   const buildScopeRules = useCallback(() => {
//     const rules = [];
//     scope.departments.forEach((v) =>
//       rules.push({ criteria_type: "department", criteria_value: String(v), is_exception: false })
//     );
//     scope.locations.forEach((v) =>
//       rules.push({ criteria_type: "location", criteria_value: String(v), is_exception: false })
//     );
//     scope.employment_types.forEach((v) =>
//       rules.push({ criteria_type: "employment_type", criteria_value: String(v), is_exception: false })
//     );
//     scope.specific_employees.forEach((v) =>
//       rules.push({ criteria_type: "employee_id", criteria_value: String(v), is_exception: false })
//     );
//     scope.exclude_employees.forEach((v) =>
//       rules.push({ criteria_type: "employee_id", criteria_value: String(v), is_exception: true })
//     );
//     return rules;
//   }, [scope]);

//   /* ══════════════ PREVIEW ELIGIBLE ══════════════ */

//   const previewEligibility = async () => {
//     if (!formData.leave_type_id) {
//       setFormError("Select leave type first");
//       return;
//     }
//     setPreviewLoading(true);
//     setPreview(null);
//     try {
//       const res = await api.post("/api/v1/leave/policies/preview-eligible", {
//         scope_rules: buildScopeRules(),
//         applicable_gender: formData.applicable_gender,
//         min_service_days: Number(formData.min_service_days) || 0,
//       });
//       setPreview(res?.data ?? res);
//     } catch (err) {
//       setFormError(formatApiError(err));
//     } finally {
//       setPreviewLoading(false);
//     }
//   };

//   /* ══════════════ CHECK OVERLAP ══════════════ */

//   const checkOverlap = async () => {
//     if (!formData.leave_type_id || !formData.effective_from) return;
//     setOverlapLoading(true);
//     setOverlap(null);
//     try {
//       const res = await api.post("/api/v1/leave/policies/check-overlap", {
//         leave_type_id: formData.leave_type_id,
//         effective_from: formData.effective_from,
//         effective_to: formData.effective_to || null,
//         scope_rules: buildScopeRules(),
//         exclude_policy_id: editId,
//       });
//       setOverlap(res?.data ?? res);
//     } catch (err) {
//       console.error("Overlap check failed:", err);
//     } finally {
//       setOverlapLoading(false);
//     }
//   };

//   /* ══════════════ SUBMIT ══════════════ */

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     /* Validation */
//     if (!formData.policy_name.trim()) {
//       setFormError("Policy name is required");
//       setActiveTab("basic");
//       return;
//     }
//     if (!formData.leave_type_id) {
//       setFormError("Leave type is required");
//       setActiveTab("basic");
//       return;
//     }
//     if (getScopeCount(scope) === 0 && formData.applicable_gender === "all") {
//       setFormError(
//         "⚠️ Applicability scope is required. Without scope, this policy applies to ALL employees. Go to 'Who Gets This?' tab."
//       );
//       setActiveTab("applicability");
//       return;
//     }
//     if (
//       formData.entitlement_type === "experience_based" &&
//       tiers.length === 0
//     ) {
//       setFormError("Add at least one experience tier");
//       setActiveTab("advanced");
//       return;
//     }

//     setSaving(true);
//     try {
//       /* 1. Create/Update policy */
//       const payload = {
//         leave_type_id: formData.leave_type_id,
//         policy_name: formData.policy_name.trim(),
//         entitlement_type: formData.entitlement_type,
//         total_leaves: Number(formData.total_leaves) || 0,
//         accrual_type: formData.accrual_type,
//         per_month_limit: Number(formData.per_month_limit) || 0,
//         max_applications_per_year: Number(formData.max_applications_per_year) || 0,
//         min_leave_count_for_request: Number(formData.min_leave_count_for_request) || 1,
//         grant_min_days: Number(formData.grant_min_days) || 1,
//         grant_max_days: Number(formData.grant_max_days) || 30,
//         grant_reusable_after_days: Number(formData.grant_reusable_after_days) || 0,
//         grant_extension_as_lop: !!formData.grant_extension_as_lop,
//         carry_forward_allowed: !!formData.carry_forward_allowed,
//         carry_forward_max: Number(formData.carry_forward_max) || 0,
//         carry_forward_expiry_months: Number(formData.carry_forward_expiry_months) || 0,
//         encashment_allowed: !!formData.encashment_allowed,
//         encashment_max_days: Number(formData.encashment_max_days) || 0,
//         mark_excess_as_lop: !!formData.mark_excess_as_lop,
//         max_negative_balance: Number(formData.max_negative_balance) || 0,
//         min_notice_days: Number(formData.min_notice_days) || 0,
//         document_required_after_days: Number(formData.document_required_after_days) || 0,
//         min_service_days: Number(formData.min_service_days) || 0,
//         applicable_gender: formData.applicable_gender,
//         sandwich_enabled: !!formData.sandwich_enabled,
//         sandwich_limit_days: Number(formData.sandwich_limit_days) || 0,
//         sandwich_weekends_mode: formData.sandwich_weekends_mode || null,
//         sandwich_holidays_mode: formData.sandwich_holidays_mode || null,
//         allow_half_day: !!formData.allow_half_day,
//         effective_from: formData.effective_from,
//         effective_to: formData.effective_to || null,
//         is_active: !!formData.is_active,
//         priority: Number(formData.priority) || 100,
//         reason: formData.reason || null,
//       };

//       let policyId = editId;

//       if (editId) {
//         await api.put(`/api/v1/leave/policies/${editId}`, payload);
//       } else {
//         const res = await api.post("/api/v1/create/leave/policy", payload);
//         policyId =
//           res?.data?.leave_policy?.leave_policy_id ||
//           res?.data?.leave_policy_id ||
//           res?.data?.data?.leave_policy_id;
//       }

//       if (!policyId) throw new Error("Policy ID not returned from server");

//       /* 2. Save tiers if experience_based */
//       if (formData.entitlement_type === "experience_based") {
//         for (const tier of tiers) {
//           const tp = {
//             leave_policy_id: policyId,
//             min_service_days: Number(tier.min_service_days) || 0,
//             annual_quota: Number(tier.annual_quota) || 0,
//             sort_order: Number(tier.sort_order) || 0,
//           };
//           if (tier.tier_id) {
//             await api.put(
//               `/api/v1/experience/leave/policies/tiers/${tier.tier_id}`,
//               tp
//             );
//           } else {
//             await api.post("/api/v1/experience/leave/policies/tiers", tp);
//           }
//         }
//       }

//       /* 3. Save applicability rules — NEW ENDPOINT */
//       const rules = buildScopeRules();
//       if (rules.length > 0) {
//         await api.post(
//           `/api/v1/leave/policies/${policyId}/applicability-rules`,
//           { rules }
//         );
//       }

//       setSuccess(
//         editId
//           ? "Policy updated successfully"
//           : "Policy created & balances provisioned"
//       );

//       await fetchPolicies();

//       setTimeout(() => {
//         closeForm();
//       }, 900);
//     } catch (err) {
//       setFormError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ══════════════ DERIVED ══════════════ */

//   const leaveTypeMap = useMemo(
//     () =>
//       Object.fromEntries(
//         leaveTypes.map((lt) => [String(getLeaveTypeId(lt)), getLeaveTypeName(lt)])
//       ),
//     [leaveTypes]
//   );

//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
//   const scopeCount = getScopeCount(scope);
//   const hasScope = scopeCount > 0;

//   /* ══════════════ RENDER ══════════════ */

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* HEADER */}
//         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Leave Policies</h1>
//             <p className="mt-1 text-sm text-slate-500">
//               One leave type can have multiple policies with different scopes
//               {total > 0 && (
//                 <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
//                   {total} total
//                 </span>
//               )}
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={openAdd}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
//           >
//             + New Policy
//           </button>
//         </div>

//         {/* NOTIFICATIONS */}
//         <Toast type="error" message={error} onDismiss={() => setError("")} />
//         <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

//         {/* SEARCH */}
//         <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="relative max-w-md">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search policies..."
//               className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//             <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//               🔍
//             </span>
//             {searchInput && (
//               <button
//                 type="button"
//                 onClick={() => setSearchInput("")}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         {/* POLICY GRID */}
//         {loading && list.length === 0 ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />
//             ))}
//           </div>
//         ) : list.length === 0 ? (
//           <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
//               📋
//             </div>
//             <p className="text-sm font-semibold text-slate-700">No policies yet</p>
//             <p className="text-xs text-slate-500">
//               Create your first policy to define who gets how many leaves
//             </p>
//             <button
//               type="button"
//               onClick={openAdd}
//               className="mt-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
//             >
//               + New Policy
//             </button>
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {list.map((item) => {
//               const policyId = getPolicyId(item);
//               const ltName = leaveTypeMap[String(item.leave_type_id)] || "—";
//               return (
//                 <button
//                   key={policyId}
//                   type="button"
//                   onClick={() => setSelectedPolicy(item)}
//                   className="group relative rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                         {item.entitlement_type?.replace(/_/g, " ") || "fixed"}
//                       </p>
//                       <h3 className="mt-1 truncate text-base font-semibold text-slate-900">
//                         {item.policy_name || "Unnamed"}
//                       </h3>
//                       <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
//                         {ltName}
//                       </span>
//                     </div>
//                     <span
//                       className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
//                         item.is_active
//                           ? "bg-emerald-50 text-emerald-700"
//                           : "bg-slate-100 text-slate-600"
//                       }`}
//                     >
//                       {item.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   <div className="mt-4 grid grid-cols-2 gap-2">
//                     <div className="rounded-lg bg-slate-50 px-3 py-2">
//                       <p className="text-[10px] uppercase text-slate-400">Days</p>
//                       <p className="text-lg font-bold text-slate-900 tabular-nums">
//                         {item.total_leaves ?? 0}
//                       </p>
//                     </div>
//                     <div className="rounded-lg bg-slate-50 px-3 py-2">
//                       <p className="text-[10px] uppercase text-slate-400">
//                         {item.applicable_gender === "all" ? "Gender" : "For"}
//                       </p>
//                       <p className="text-sm font-semibold capitalize text-slate-800">
//                         {item.applicable_gender || "all"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
//                     <span>
//                       {item.effective_from
//                         ? new Date(item.effective_from).toLocaleDateString("en-IN")
//                         : "—"}
//                     </span>
//                     <span className="font-semibold text-[#E42527] opacity-0 transition group-hover:opacity-100">
//                       View details →
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {/* PAGINATION */}
//         {!loading && list.length > 0 && totalPages > 1 && (
//           <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
//             <p className="text-xs text-slate-500">
//               Page <span className="font-medium">{page}</span> of {totalPages}
//             </p>
//             <div className="flex gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ═══════════════════ FORM MODAL ═══════════════════ */}
//       {showForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-3 pt-6 backdrop-blur-[2px] sm:p-6"
//           onClick={closeForm}
//         >
//           <div
//             className="mb-6 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* HEADER */}
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-900">
//                   {editId ? "Edit Leave Policy" : "Create Leave Policy"}
//                 </h2>
//                 <p className="mt-0.5 text-xs text-slate-500">
//                   Configure entitlement, rules and who gets this policy
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 disabled={saving}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* TABS */}
//             <div className="border-b border-slate-100 bg-slate-50/60 px-3 py-2">
//               <div className="flex gap-1 overflow-x-auto">
//                 {TABS.map((t) => {
//                   const active = activeTab === t.id;
//                   const showWarning = t.id === "applicability" && !hasScope;
//                   return (
//                     <button
//                       key={t.id}
//                       type="button"
//                       onClick={() => setActiveTab(t.id)}
//                       className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
//                         active
//                           ? "bg-white text-[#E42527] shadow-sm ring-1 ring-red-100"
//                           : "text-slate-600 hover:bg-white/70"
//                       }`}
//                     >
//                       <span>{t.icon}</span>
//                       <span>{t.label}</span>
//                       {showWarning && (
//                         <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* BODY */}
//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
//                 {formError && (
//                   <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
//                     <span className="whitespace-pre-line">{formError}</span>
//                   </div>
//                 )}

//                 {/* ─── BASIC ─── */}
//                 {activeTab === "basic" && (
//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <Field label="Policy Name" required>
//                       <input
//                         autoFocus
//                         required
//                         value={formData.policy_name}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, policy_name: e.target.value }))
//                         }
//                         placeholder="e.g. India FTE 2026 - CL"
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <Field label="Leave Type" required>
//                       <select
//                         required
//                         value={formData.leave_type_id}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, leave_type_id: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       >
//                         <option value="">Select leave type</option>
//                         {leaveTypes.map((lt) => {
//                           const id = getLeaveTypeId(lt);
//                           return id ? (
//                             <option key={id} value={id}>
//                               {getLeaveTypeName(lt)}
//                             </option>
//                           ) : null;
//                         })}
//                       </select>
//                     </Field>

//                     <Field label="Effective From" required>
//                       <input
//                         required
//                         type="date"
//                         value={formData.effective_from}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, effective_from: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <Field label="Effective To" hint="Empty = no expiry">
//                       <input
//                         type="date"
//                         value={formData.effective_to}
//                         min={formData.effective_from}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, effective_to: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <Field
//                       label="Priority"
//                       hint="Higher = wins when multiple policies match (default 100)"
//                     >
//                       <input
//                         type="number"
//                         min={1}
//                         max={999}
//                         value={formData.priority}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, priority: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <div className="sm:col-span-2">
//                       <Toggle
//                         checked={formData.is_active}
//                         onChange={(v) => setFormData((p) => ({ ...p, is_active: v }))}
//                         label="Active Policy"
//                         hint="Inactive policies are ignored during leave apply"
//                       />
//                     </div>

//                     <div className="sm:col-span-2">
//                       <Field label="Internal Notes / Reason">
//                         <textarea
//                           rows={2}
//                           value={formData.reason}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, reason: e.target.value }))
//                           }
//                           placeholder="Why this policy exists (visible to HR only)"
//                           className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── ENTITLEMENT ─── */}
//                 {activeTab === "entitlement" && (
//                   <div className="space-y-5">
//                     <div>
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         How does this policy give leaves?
//                       </p>
//                       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                         {ENTITLEMENT_TYPES.map((t) => {
//                           const active = formData.entitlement_type === t.value;
//                           return (
//                             <button
//                               key={t.value}
//                               type="button"
//                               onClick={() =>
//                                 setFormData((p) => ({ ...p, entitlement_type: t.value }))
//                               }
//                               className={`rounded-xl border p-3 text-left transition ${
//                                 active
//                                   ? "border-[#E42527] bg-red-50"
//                                   : "border-slate-200 bg-white hover:bg-slate-50"
//                               }`}
//                             >
//                               <p className="text-sm font-semibold text-slate-900">
//                                 {t.label}
//                               </p>
//                               <p className="mt-0.5 text-[11px] text-slate-500">
//                                 {t.hint}
//                               </p>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     {formData.entitlement_type !== "experience_based" && (
//                       <div className="grid gap-4 sm:grid-cols-3">
//                         <Field label="Total Leaves / Year">
//                           <input
//                             type="number"
//                             step="0.5"
//                             min="0"
//                             value={formData.total_leaves}
//                             onChange={(e) =>
//                               setFormData((p) => ({ ...p, total_leaves: e.target.value }))
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                           />
//                         </Field>

//                         <Field label="Accrual Type">
//                           <select
//                             value={formData.accrual_type}
//                             onChange={(e) =>
//                               setFormData((p) => ({ ...p, accrual_type: e.target.value }))
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                           >
//                             {ACCRUAL_TYPES.map((a) => (
//                               <option key={a.value} value={a.value}>
//                                 {a.label}
//                               </option>
//                             ))}
//                           </select>
//                         </Field>

//                         <Field label="Per Month Limit" hint="0 = no limit">
//                           <input
//                             type="number"
//                             step="0.5"
//                             min="0"
//                             value={formData.per_month_limit}
//                             onChange={(e) =>
//                               setFormData((p) => ({ ...p, per_month_limit: e.target.value }))
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                           />
//                         </Field>
//                       </div>
//                     )}

//                     {formData.entitlement_type === "experience_based" && (
//                       <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
//                         <p className="font-semibold">Experience Tiers Required</p>
//                         <p className="mt-0.5">
//                           Go to <strong>Advanced</strong> tab to define tiers.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* ─── RULES ─── */}
//                 {activeTab === "rules" && (
//                   <div className="space-y-5">
//                     <div className="grid gap-4 sm:grid-cols-3">
//                       <Field label="Max Applications / Year">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.max_applications_per_year}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, max_applications_per_year: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Min Leave Count">
//                         <input
//                           type="number"
//                           step="0.5"
//                           min="0"
//                           value={formData.min_leave_count_for_request}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, min_leave_count_for_request: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Min Notice Days">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.min_notice_days}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, min_notice_days: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Document Required After (days)">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.document_required_after_days}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, document_required_after_days: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Min Service Days">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.min_service_days}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, min_service_days: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Max Negative Balance">
//                         <input
//                           type="number"
//                           step="0.5"
//                           min="0"
//                           value={formData.max_negative_balance}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, max_negative_balance: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                     </div>

//                     <div className="grid gap-3 sm:grid-cols-2">
//                       <Toggle
//                         checked={formData.mark_excess_as_lop}
//                         onChange={(v) => setFormData((p) => ({ ...p, mark_excess_as_lop: v }))}
//                         label="Mark Excess as LOP"
//                         hint="Beyond balance → Loss of Pay"
//                       />
//                       <Toggle
//                         checked={formData.allow_half_day}
//                         onChange={(v) => setFormData((p) => ({ ...p, allow_half_day: v }))}
//                         label="Allow Half Day"
//                       />
//                     </div>

//                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         Carry Forward
//                       </p>
//                       <Toggle
//                         checked={formData.carry_forward_allowed}
//                         onChange={(v) => setFormData((p) => ({ ...p, carry_forward_allowed: v }))}
//                         label="Allow Carry Forward"
//                       />
//                       {formData.carry_forward_allowed && (
//                         <div className="mt-3 grid gap-3 sm:grid-cols-2">
//                           <Field label="Carry Forward Max Days">
//                             <input
//                               type="number"
//                               step="0.5"
//                               min="0"
//                               value={formData.carry_forward_max}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, carry_forward_max: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                           <Field label="Expiry (months)">
//                             <input
//                               type="number"
//                               min="0"
//                               value={formData.carry_forward_expiry_months}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, carry_forward_expiry_months: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                         </div>
//                       )}
//                     </div>

//                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         Encashment
//                       </p>
//                       <Toggle
//                         checked={formData.encashment_allowed}
//                         onChange={(v) => setFormData((p) => ({ ...p, encashment_allowed: v }))}
//                         label="Allow Encashment"
//                       />
//                       {formData.encashment_allowed && (
//                         <div className="mt-3">
//                           <Field label="Encashment Max Days">
//                             <input
//                               type="number"
//                               step="0.5"
//                               min="0"
//                               value={formData.encashment_max_days}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, encashment_max_days: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── ADVANCED ─── */}
//                 {activeTab === "advanced" && (
//                   <div className="space-y-5">
//                     <Field label="Applicable Gender">
//                       <div className="grid gap-2 sm:grid-cols-3">
//                         {GENDERS.map((g) => {
//                           const active = formData.applicable_gender === g.value;
//                           return (
//                             <button
//                               key={g.value}
//                               type="button"
//                               onClick={() =>
//                                 setFormData((p) => ({ ...p, applicable_gender: g.value }))
//                               }
//                               className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
//                                 active
//                                   ? "border-[#E42527] bg-red-50 text-[#E42527]"
//                                   : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//                               }`}
//                             >
//                               {g.label}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </Field>

//                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         Sandwich Rule
//                       </p>
//                       <p className="mb-3 text-xs text-slate-500">
//                         If employee takes leave on Friday and Monday, weekend counts as leave
//                       </p>
//                       <Toggle
//                         checked={formData.sandwich_enabled}
//                         onChange={(v) => setFormData((p) => ({ ...p, sandwich_enabled: v }))}
//                         label="Enable Sandwich Rule"
//                       />
//                       {formData.sandwich_enabled && (
//                         <div className="mt-3 grid gap-3 sm:grid-cols-3">
//                           <Field label="Sandwich Limit Days">
//                             <input
//                               type="number"
//                               min="0"
//                               value={formData.sandwich_limit_days}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, sandwich_limit_days: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                           <Field label="Weekends Mode">
//                             <select
//                               value={formData.sandwich_weekends_mode}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, sandwich_weekends_mode: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             >
//                               {SANDWICH_MODES.map((m) => (
//                                 <option key={m.value} value={m.value}>
//                                   {m.label}
//                                 </option>
//                               ))}
//                             </select>
//                           </Field>
//                           <Field label="Holidays Mode">
//                             <select
//                               value={formData.sandwich_holidays_mode}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, sandwich_holidays_mode: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             >
//                               {SANDWICH_MODES.map((m) => (
//                                 <option key={m.value} value={m.value}>
//                                   {m.label}
//                                 </option>
//                               ))}
//                             </select>
//                           </Field>
//                         </div>
//                       )}
//                     </div>

//                     {formData.entitlement_type === "experience_based" && (
//                       <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
//                         <div className="mb-3 flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-semibold text-slate-800">
//                               Experience Tiers
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               Different quotas based on years of service
//                             </p>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => setTiers((p) => [...p, { ...EMPTY_TIER }])}
//                             className="rounded-lg border border-[#E42527] bg-white px-3 py-1.5 text-xs font-medium text-[#E42527] hover:bg-red-50"
//                           >
//                             + Add Tier
//                           </button>
//                         </div>

//                         <div className="space-y-3">
//                           {tiers.map((tier, index) => (
//                             <div
//                               key={tier.tier_id || `new-${index}`}
//                               className="grid grid-cols-1 gap-3 rounded-lg bg-white p-3 sm:grid-cols-4"
//                             >
//                               <Field label="Min Service Days">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   value={tier.min_service_days}
//                                   onChange={(e) =>
//                                     setTiers((prev) => {
//                                       const next = [...prev];
//                                       next[index] = { ...next[index], min_service_days: e.target.value };
//                                       return next;
//                                     })
//                                   }
//                                   className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                                 />
//                               </Field>
//                               <Field label="Annual Quota">
//                                 <input
//                                   type="number"
//                                   step="0.5"
//                                   min="0"
//                                   value={tier.annual_quota}
//                                   onChange={(e) =>
//                                     setTiers((prev) => {
//                                       const next = [...prev];
//                                       next[index] = { ...next[index], annual_quota: e.target.value };
//                                       return next;
//                                     })
//                                   }
//                                   className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                                 />
//                               </Field>
//                               <Field label="Sort Order">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   value={tier.sort_order}
//                                   onChange={(e) =>
//                                     setTiers((prev) => {
//                                       const next = [...prev];
//                                       next[index] = { ...next[index], sort_order: e.target.value };
//                                       return next;
//                                     })
//                                   }
//                                   className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                                 />
//                               </Field>
//                               <div className="flex items-end">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     setTiers((p) => (p.length > 1 ? p.filter((_, i) => i !== index) : p))
//                                   }
//                                   disabled={tiers.length <= 1}
//                                   className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* ─── APPLICABILITY ─── */}
//                 {activeTab === "applicability" && (
//                   <div className="space-y-5">
//                     {/* WARNING BANNER */}
//                     <div
//                       className={`rounded-xl border p-4 ${
//                         hasScope
//                           ? "border-emerald-200 bg-emerald-50"
//                           : "border-amber-300 bg-amber-50"
//                       }`}
//                     >
//                       <p
//                         className={`text-sm font-semibold ${
//                           hasScope ? "text-emerald-900" : "text-amber-900"
//                         }`}
//                       >
//                         {hasScope
//                           ? `✓ Scope defined (${scopeCount} criteria)`
//                           : "⚠️ No scope selected"}
//                       </p>
//                       <p
//                         className={`mt-0.5 text-xs ${
//                           hasScope ? "text-emerald-700" : "text-amber-800"
//                         }`}
//                       >
//                         {hasScope
//                           ? "This policy will apply only to selected employees"
//                           : "This policy will apply to ALL employees. Select at least one criteria."}
//                       </p>
//                     </div>

//                     {/* SCOPE OPTIONS */}
//                     <MultiChipSelect
//                       label="Departments"
//                       icon="🏢"
//                       options={departments.map((d) => ({
//                         id: d.department_id,
//                         name: d.department_name,
//                       }))}
//                       value={scope.departments}
//                       onChange={(v) => setScope((p) => ({ ...p, departments: v }))}
//                       placeholder="No departments found"
//                     />

//                     <MultiChipSelect
//                       label="Locations"
//                       icon="📍"
//                       options={locations.map((l) => ({
//                         id: l.location_id,
//                         name: l.location_name,
//                       }))}
//                       value={scope.locations}
//                       onChange={(v) => setScope((p) => ({ ...p, locations: v }))}
//                       placeholder="No locations found"
//                     />

//                     <MultiChipSelect
//                       label="Employment Types"
//                       icon="💼"
//                       options={employmentTypes.map((e) => ({
//                         id: e.employment_type_id,
//                         name: e.name,
//                       }))}
//                       value={scope.employment_types}
//                       onChange={(v) => setScope((p) => ({ ...p, employment_types: v }))}
//                       placeholder="No employment types found"
//                     />

//                     {/* SPECIFIC EMPLOYEES */}
//                     <div className="rounded-xl border border-slate-200 bg-white p-4">
//                       <div className="mb-3 flex items-center gap-2">
//                         <span className="text-base">👤</span>
//                         <p className="text-sm font-semibold text-slate-800">
//                           Specific Employees (optional)
//                         </p>
//                         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
//                           {scope.specific_employees.length}
//                         </span>
//                       </div>
//                       <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-100">
//                         {employees.length === 0 ? (
//                           <p className="p-3 text-xs text-slate-400">
//                             No employees loaded
//                           </p>
//                         ) : (
//                           employees.map((e) => {
//                             const eid = e.employee_id;
//                             const active = scope.specific_employees.includes(eid);
//                             return (
//                               <label
//                                 key={eid}
//                                 className={`flex cursor-pointer items-center gap-2 border-b border-slate-100 px-3 py-2 last:border-b-0 hover:bg-slate-50 ${
//                                   active ? "bg-red-50/40" : ""
//                                 }`}
//                               >
//                                 <input
//                                   type="checkbox"
//                                   checked={active}
//                                   onChange={() =>
//                                     setScope((p) => ({
//                                       ...p,
//                                       specific_employees: active
//                                         ? p.specific_employees.filter((x) => x !== eid)
//                                         : [...p.specific_employees, eid],
//                                     }))
//                                   }
//                                   className="h-3.5 w-3.5 rounded border-slate-300 accent-[#E42527]"
//                                 />
//                                 <span className="text-xs font-medium text-slate-700">
//                                   {e.name || `${e.first_name || ""} ${e.last_name || ""}`.trim()}
//                                 </span>
//                               </label>
//                             );
//                           })
//                         )}
//                       </div>
//                     </div>

//                     {/* PREVIEW + OVERLAP ACTIONS */}
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         type="button"
//                         onClick={previewEligibility}
//                         disabled={previewLoading}
//                         className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
//                       >
//                         {previewLoading ? "Loading..." : "👁 Preview Eligible"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={checkOverlap}
//                         disabled={overlapLoading}
//                         className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
//                       >
//                         {overlapLoading ? "Checking..." : "⚠ Check Overlap"}
//                       </button>
//                     </div>

//                     {/* PREVIEW RESULT */}
//                     {preview && (
//                       <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
//                         <div className="flex items-baseline gap-2">
//                           <p className="text-3xl font-bold text-sky-900 tabular-nums">
//                             {preview.eligible}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             of {preview.total_employees} employees
//                           </p>
//                         </div>
//                         {preview.warning && (
//                           <p className="mt-2 rounded-md bg-amber-100 px-2 py-1.5 text-[11px] text-amber-800">
//                             {preview.warning}
//                           </p>
//                         )}
//                         {preview.sample && preview.sample.length > 0 && (
//                           <div className="mt-3">
//                             <p className="text-[10px] font-semibold uppercase text-slate-400">
//                               Sample eligible
//                             </p>
//                             <div className="mt-1.5 flex flex-wrap gap-1">
//                               {preview.sample.map((s, i) => (
//                                 <span
//                                   key={i}
//                                   className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-800"
//                                 >
//                                   {s.name}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* OVERLAP RESULT */}
//                     {overlap?.has_conflicts && (
//                       <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
//                         <p className="text-sm font-semibold text-amber-900">
//                           ⚠️ Overlapping Policies Detected
//                         </p>
//                         <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
//                           {overlap.conflicts.map((c) => (
//                             <li key={c.policy_id}>
//                               <strong>{c.policy_name}</strong> ({c.effective_from} → {c.effective_to || "No expiry"})
//                             </li>
//                           ))}
//                         </ul>
//                         <p className="mt-2 text-[11px] text-amber-700">
//                           Higher priority policy will win. Adjust priority accordingly.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* FOOTER */}
//               <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
//                 <div className="text-xs text-slate-500">
//                   {TABS.findIndex((t) => t.id === activeTab) + 1} / {TABS.length}
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={closeForm}
//                     disabled={saving}
//                     className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={saving}
//                     className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:opacity-60"
//                   >
//                     {saving ? "Saving..." : editId ? "Update Policy" : "Create Policy"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════ DETAILS MODAL ═══════════════════ */}
//       {selectedPolicy && (
//         <div
//           className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
//           onClick={() => setSelectedPolicy(null)}
//         >
//           <div
//             className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Policy details
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-900">
//                   {selectedPolicy.policy_name}
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

//             <div className="max-h-[60vh] space-y-2 overflow-y-auto px-5 py-4">
//               {[
//                 ["Leave Type", leaveTypeMap[String(selectedPolicy.leave_type_id)] || "—"],
//                 ["Entitlement", selectedPolicy.entitlement_type],
//                 ["Total Leaves", selectedPolicy.total_leaves],
//                 ["Accrual", selectedPolicy.accrual_type],
//                 ["Gender", selectedPolicy.applicable_gender],
//                 ["Priority", selectedPolicy.priority ?? 100],
//                 [
//                   "Effective",
//                   `${selectedPolicy.effective_from || "—"} → ${selectedPolicy.effective_to || "No expiry"}`,
//                 ],
//                 ["Status", selectedPolicy.is_active ? "Active" : "Inactive"],
//               ].map(([k, v]) => (
//                 <div
//                   key={k}
//                   className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
//                 >
//                   <span className="text-xs text-slate-500">{k}</span>
//                   <span className="text-sm font-semibold capitalize text-slate-800">
//                     {v || "—"}
//                   </span>
//                 </div>
//               ))}
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
//                   const p = selectedPolicy;
//                   setSelectedPolicy(null);
//                   openEdit(p);
//                 }}
//                 className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const TODAY = new Date().toISOString().split("T")[0];
// const PAGE_SIZE = 12;
// const DEBOUNCE_MS = 450;
// const AUTO_DISMISS_MS = 5000;

// const TABS = [
//   { id: "basic", label: "Basic", icon: "📋" },
//   { id: "entitlement", label: "Entitlement", icon: "🎯" },
//   { id: "rules", label: "Rules", icon: "⚙️" },
//   { id: "advanced", label: "Advanced", icon: "🔧" },
//   { id: "applicability", label: "Who Gets This?", icon: "👥" },
// ];

// const ENTITLEMENT_TYPES = [
//   { value: "fixed", label: "Fixed", hint: "Same quota for everyone" },
//   { value: "experience_based", label: "Experience Based", hint: "Different per tier" },
//   { value: "grant_based", label: "Grant Based", hint: "One-time grant with min/max limits" },
//   { value: "attendance_based", label: "Attendance Based", hint: "Earned via monthly/quarterly accrual" },
// ];

// const ACCRUAL_TYPES = [
//   { value: "upfront", label: "Upfront", hint: "All days at start of year" },
//   { value: "monthly", label: "Monthly", hint: "1/12th each month" },
//   { value: "quarterly", label: "Quarterly", hint: "1/4th each quarter" },
// ];

// const GENDERS = [
//   { value: "all", label: "All Genders" },
//   { value: "male", label: "Male Only" },
//   { value: "female", label: "Female Only" },
// ];

// const SANDWICH_MODES = [
//   { value: "include", label: "Include (count as leave)" },
//   { value: "exclude", label: "Exclude (don't count)" },
// ];

// const EMPTY_FORM = {
//   leave_type_id: "",
//   policy_name: "",
//   entitlement_type: "fixed",
//   total_leaves: 12,
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
//   effective_from: TODAY,
//   effective_to: "",
//   is_active: true,
//   priority: 100,
//   reason: "",
// };

// const EMPTY_TIER = { tier_id: null, min_service_days: 0, annual_quota: 0, sort_order: 0 };

// const EMPTY_SCOPE = {
//   departments: [],
//   locations: [],
//   employment_types: [],
//   specific_employees: [],
//   exclude_employees: [],
// };

// /* ══════════════════════════════════════════════════════════
//    HELPERS
//    ══════════════════════════════════════════════════════════ */

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
//   return err?.response?.data?.message || err?.message || "Something went wrong";
// };

// const toArray = (payload, keys = []) => {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;
//   for (const k of keys) if (Array.isArray(payload[k])) return payload[k];
//   return [];
// };

// const getLeaveTypeId = (lt) => lt?.leave_type_id || null;
// const getLeaveTypeName = (lt) => lt?.leave_type_name || lt?.leave_type_code || "—";
// const getPolicyId = (p) => p?.leave_policy_id || null;
// const getPolicyName = (p) => p?.policy_name || getPolicyId(p) || "Unnamed";

// const getScopeCount = (scope) =>
//   (scope?.departments?.length || 0) +
//   (scope?.locations?.length || 0) +
//   (scope?.employment_types?.length || 0) +
//   (scope?.specific_employees?.length || 0);

// /* ══════════════════════════════════════════════════════════
//    SUB-COMPONENTS
//    ══════════════════════════════════════════════════════════ */

// function Toast({ type, message, onDismiss }) {
//   useEffect(() => {
//     if (!message) return;
//     const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [message, onDismiss]);

//   if (!message) return null;
//   const styles =
//     type === "error"
//       ? "border-red-200 bg-red-50 text-red-700"
//       : "border-green-200 bg-green-50 text-green-700";

//   return (
//     <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
//       <span className="whitespace-pre-line">{message}</span>
//       <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">
//         ✕
//       </button>
//     </div>
//   );
// }

// function Field({ label, hint, required, error, children }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-xs font-medium text-slate-600">
//         {label} {required && <span className="text-red-600">*</span>}
//       </label>
//       {children}
//       {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
//       {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
//     </div>
//   );
// }

// function Toggle({ checked, onChange, label, hint }) {
//   return (
//     <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:bg-slate-50">
//       <input
//         type="checkbox"
//         checked={!!checked}
//         onChange={(e) => onChange(e.target.checked)}
//         className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#E42527]"
//       />
//       <div className="flex-1">
//         <div className="text-sm font-medium text-slate-700">{label}</div>
//         {hint && <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div>}
//       </div>
//     </label>
//   );
// }

// function MultiChipSelect({ label, icon, options, value, onChange, placeholder }) {
//   const toggle = (id) => {
//     onChange(
//       value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
//     );
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-4">
//       <div className="mb-3 flex items-center gap-2">
//         {icon && <span className="text-base">{icon}</span>}
//         <p className="text-sm font-semibold text-slate-800">{label}</p>
//         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
//           {value.length}
//         </span>
//       </div>

//       {options.length === 0 ? (
//         <p className="text-xs text-slate-400">{placeholder || "No options available"}</p>
//       ) : (
//         <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
//           {options.map((opt) => {
//             const id = opt.id || opt.value;
//             const name = opt.name || opt.label;
//             const active = value.includes(id);
//             return (
//               <button
//                 key={id}
//                 type="button"
//                 onClick={() => toggle(id)}
//                 className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
//                   active
//                     ? "border-[#E42527] bg-red-50 text-[#E42527]"
//                     : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 {active && <span>✓</span>}
//                 {name}
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function LeavePoliciesPage() {
//   /* list */
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   /* masters */
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [employmentTypes, setEmploymentTypes] = useState([]);

//   /* ui */
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* form modal */
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [activeTab, setActiveTab] = useState("basic");
//   const [formData, setFormData] = useState(EMPTY_FORM);
//   const [tiers, setTiers] = useState([{ ...EMPTY_TIER }]);
//   const [scope, setScope] = useState(EMPTY_SCOPE);
//   const [saving, setSaving] = useState(false);
//   const [formError, setFormError] = useState("");

//   /* preview + overlap */
//   const [preview, setPreview] = useState(null);
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const [overlap, setOverlap] = useState(null);
//   const [overlapLoading, setOverlapLoading] = useState(false);

//   /* details modal */
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   /* guards */
//   const reqIdRef = useRef(0);
//   const didInitRef = useRef(false);

//   /* ══════════════ LOADERS ══════════════ */

//   const loadLeaveTypes = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/leave/type", {
//         params: { page: 1, page_size: 200 },
//       });
//       setLeaveTypes(toArray(res?.data, ["leave_types", "data", "items"]));
//     } catch {
//       setLeaveTypes([]);
//     }
//   }, []);

//   const loadEmployees = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/employees");
//       setEmployees(toArray(res?.data, ["employees", "data", "items"]));
//     } catch {
//       setEmployees([]);
//     }
//   }, []);

//   const loadMasters = useCallback(async () => {
//     const safe = async (url, keys) => {
//       try {
//         const res = await api.get(url);
//         return toArray(res?.data, keys);
//       } catch {
//         return [];
//       }
//     };
//     const [d, l, et] = await Promise.all([
//       safe("/api/v1/get/departments", ["departments", "data"]),
//       safe("/api/v1/get/location/master", ["locations", "location", "data"]),
//       safe("/api/v1/get/employment/type", ["employment_types", "data"]),
//     ]);
//     setDepartments(d);
//     setLocations(l);
//     setEmploymentTypes(et);
//   }, []);

//   useEffect(() => {
//     loadLeaveTypes();
//     loadEmployees();
//     loadMasters();
//   }, [loadLeaveTypes, loadEmployees, loadMasters]);

//   /* ══════════════ POLICIES LIST ══════════════ */

//   const fetchPolicies = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/leave/policies", {
//         params: { page, page_size: PAGE_SIZE, search: search || undefined },
//       });
//       if (myReqId !== reqIdRef.current) return;
//       const items = toArray(res?.data, ["policies", "data", "items"]);
//       setList(items);
//       setTotal(res?.data?.total ?? items.length);
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, [page, search]);

//   useEffect(() => {
//     if (!didInitRef.current) {
//       didInitRef.current = true;
//       fetchPolicies();
//       return;
//     }
//     const t = setTimeout(fetchPolicies, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [fetchPolicies]);

//   /* ══════════════ FORM OPEN/CLOSE ══════════════ */

//   const openAdd = () => {
//     setEditId(null);
//     setActiveTab("basic");
//     setFormData(EMPTY_FORM);
//     setTiers([{ ...EMPTY_TIER }]);
//     setScope(EMPTY_SCOPE);
//     setFormError("");
//     setSuccess("");
//     setPreview(null);
//     setOverlap(null);
//     setShowForm(true);
//   };

//   const openEdit = async (item) => {
//     const id = getPolicyId(item);
//     if (!id) return;

//     setEditId(id);
//     setActiveTab("basic");
//     setFormData({
//       ...EMPTY_FORM,
//       ...item,
//       effective_from: item.effective_from || TODAY,
//       effective_to: item.effective_to || "",
//     });
//     setFormError("");
//     setSuccess("");
//     setPreview(null);
//     setOverlap(null);

//     /* Load tiers */
//     if (item.entitlement_type === "experience_based") {
//       try {
//         const res = await api.get(`/api/v1/experience/leave/policies/${id}/tiers`);
//         const t = toArray(res?.data, ["experience_tiers", "data"]);
//         setTiers(t.length ? t.map((x) => ({
//           tier_id: x.tier_id,
//           min_service_days: x.min_service_days ?? 0,
//           annual_quota: x.annual_quota ?? 0,
//           sort_order: x.sort_order ?? 0,
//         })) : [{ ...EMPTY_TIER }]);
//       } catch {
//         setTiers([{ ...EMPTY_TIER }]);
//       }
//     } else {
//       setTiers([{ ...EMPTY_TIER }]);
//     }

//     /* Load applicability rules — NEW ENDPOINT */
//     try {
//       const res = await api.get(
//         `/api/v1/leave/policies/${id}/applicability-rules`
//       );
//       const rules = toArray(res?.data, ["rules", "data"]);
//       const newScope = { ...EMPTY_SCOPE };
//       rules.forEach((r) => {
//         const v = r.criteria_value;
//         switch (r.criteria_type) {
//           case "department":
//             newScope.departments.push(v);
//             break;
//           case "location":
//             newScope.locations.push(v);
//             break;
//           case "employment_type":
//             newScope.employment_types.push(v);
//             break;
//           case "employee_id":
//             if (r.is_exception) newScope.exclude_employees.push(v);
//             else newScope.specific_employees.push(v);
//             break;
//         }
//       });
//       setScope(newScope);
//     } catch {
//       setScope(EMPTY_SCOPE);
//     }

//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;
//     setShowForm(false);
//     setEditId(null);
//     setFormData(EMPTY_FORM);
//     setTiers([{ ...EMPTY_TIER }]);
//     setScope(EMPTY_SCOPE);
//     setPreview(null);
//     setOverlap(null);
//     setFormError("");
//   };

//   /* ══════════════ BUILD SCOPE RULES PAYLOAD ══════════════ */

//   const buildScopeRules = useCallback(() => {
//     const rules = [];
//     scope.departments.forEach((v) =>
//       rules.push({ criteria_type: "department", criteria_value: String(v), is_exception: false })
//     );
//     scope.locations.forEach((v) =>
//       rules.push({ criteria_type: "location", criteria_value: String(v), is_exception: false })
//     );
//     scope.employment_types.forEach((v) =>
//       rules.push({ criteria_type: "employment_type", criteria_value: String(v), is_exception: false })
//     );
//     scope.specific_employees.forEach((v) =>
//       rules.push({ criteria_type: "employee_id", criteria_value: String(v), is_exception: false })
//     );
//     scope.exclude_employees.forEach((v) =>
//       rules.push({ criteria_type: "employee_id", criteria_value: String(v), is_exception: true })
//     );
//     return rules;
//   }, [scope]);

//   /* ══════════════ PREVIEW ELIGIBLE ══════════════ */

//   const previewEligibility = async () => {
//     if (!formData.leave_type_id) {
//       setFormError("Select leave type first");
//       return;
//     }
//     setPreviewLoading(true);
//     setPreview(null);
//     try {
//       const res = await api.post("/api/v1/leave/policies/preview-eligible", {
//         scope_rules: buildScopeRules(),
//         applicable_gender: formData.applicable_gender,
//         min_service_days: Number(formData.min_service_days) || 0,
//       });
//       setPreview(res?.data ?? res);
//     } catch (err) {
//       setFormError(formatApiError(err));
//     } finally {
//       setPreviewLoading(false);
//     }
//   };

//   /* ══════════════ CHECK OVERLAP ══════════════ */

//   const checkOverlap = async () => {
//     if (!formData.leave_type_id || !formData.effective_from) return;
//     setOverlapLoading(true);
//     setOverlap(null);
//     try {
//       const res = await api.post("/api/v1/leave/policies/check-overlap", {
//         leave_type_id: formData.leave_type_id,
//         effective_from: formData.effective_from,
//         effective_to: formData.effective_to || null,
//         scope_rules: buildScopeRules(),
//         exclude_policy_id: editId,
//       });
//       setOverlap(res?.data ?? res);
//     } catch (err) {
//       console.error("Overlap check failed:", err);
//     } finally {
//       setOverlapLoading(false);
//     }
//   };

//   /* ══════════════ SUBMIT ══════════════ */

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     /* Validation */
//     if (!formData.policy_name.trim()) {
//       setFormError("Policy name is required");
//       setActiveTab("basic");
//       return;
//     }
//     if (!formData.leave_type_id) {
//       setFormError("Leave type is required");
//       setActiveTab("basic");
//       return;
//     }
//     if (getScopeCount(scope) === 0 && formData.applicable_gender === "all") {
//       setFormError(
//         "⚠️ Applicability scope is required. Without scope, this policy applies to ALL employees. Go to 'Who Gets This?' tab."
//       );
//       setActiveTab("applicability");
//       return;
//     }
//     if (
//       formData.entitlement_type === "experience_based" &&
//       tiers.length === 0
//     ) {
//       setFormError("Add at least one experience tier");
//       setActiveTab("advanced");
//       return;
//     }
//     if (formData.entitlement_type === "grant_based") {
//       const gMin = Number(formData.grant_min_days) || 0;
//       const gMax = Number(formData.grant_max_days) || 0;
//       const total = Number(formData.total_leaves) || 0;
//       if (total <= 0) {
//         setFormError("Grant size (Total Leaves) must be greater than 0");
//         setActiveTab("entitlement");
//         return;
//       }
//       if (gMax > 0 && gMin > gMax) {
//         setFormError("Grant Min Days cannot be greater than Grant Max Days");
//         setActiveTab("entitlement");
//         return;
//       }
//     }
//     if (
//       formData.entitlement_type === "attendance_based" &&
//       (Number(formData.total_leaves) || 0) <= 0
//     ) {
//       setFormError("Yearly ceiling (Total Leaves) must be greater than 0");
//       setActiveTab("entitlement");
//       return;
//     }

//     setSaving(true);
//     try {
//       /* 1. Create/Update policy */
//       const payload = {
//         leave_type_id: formData.leave_type_id,
//         policy_name: formData.policy_name.trim(),
//         entitlement_type: formData.entitlement_type,
//         total_leaves: Number(formData.total_leaves) || 0,
//         accrual_type: formData.accrual_type,
//         per_month_limit: Number(formData.per_month_limit) || 0,
//         max_applications_per_year: Number(formData.max_applications_per_year) || 0,
//         min_leave_count_for_request: Number(formData.min_leave_count_for_request) || 1,
//         grant_min_days: Number(formData.grant_min_days) || 1,
//         grant_max_days: Number(formData.grant_max_days) || 30,
//         grant_reusable_after_days: Number(formData.grant_reusable_after_days) || 0,
//         grant_extension_as_lop: !!formData.grant_extension_as_lop,
//         carry_forward_allowed: !!formData.carry_forward_allowed,
//         carry_forward_max: Number(formData.carry_forward_max) || 0,
//         carry_forward_expiry_months: Number(formData.carry_forward_expiry_months) || 0,
//         encashment_allowed: !!formData.encashment_allowed,
//         encashment_max_days: Number(formData.encashment_max_days) || 0,
//         mark_excess_as_lop: !!formData.mark_excess_as_lop,
//         max_negative_balance: Number(formData.max_negative_balance) || 0,
//         min_notice_days: Number(formData.min_notice_days) || 0,
//         document_required_after_days: Number(formData.document_required_after_days) || 0,
//         min_service_days: Number(formData.min_service_days) || 0,
//         applicable_gender: formData.applicable_gender,
//         sandwich_enabled: !!formData.sandwich_enabled,
//         sandwich_limit_days: Number(formData.sandwich_limit_days) || 0,
//         sandwich_weekends_mode: formData.sandwich_weekends_mode || null,
//         sandwich_holidays_mode: formData.sandwich_holidays_mode || null,
//         allow_half_day: !!formData.allow_half_day,
//         effective_from: formData.effective_from,
//         effective_to: formData.effective_to || null,
//         is_active: !!formData.is_active,
//         priority: Number(formData.priority) || 100,
//         reason: formData.reason || null,
//       };

//       let policyId = editId;

//       if (editId) {
//         await api.put(`/api/v1/leave/policies/${editId}`, payload);
//       } else {
//         const res = await api.post("/api/v1/create/leave/policy", payload);
//         policyId =
//           res?.data?.leave_policy?.leave_policy_id ||
//           res?.data?.leave_policy_id ||
//           res?.data?.data?.leave_policy_id;
//       }

//       if (!policyId) throw new Error("Policy ID not returned from server");

//       /* 2. Save tiers if experience_based */
//       if (formData.entitlement_type === "experience_based") {
//         for (const tier of tiers) {
//           const tp = {
//             leave_policy_id: policyId,
//             min_service_days: Number(tier.min_service_days) || 0,
//             annual_quota: Number(tier.annual_quota) || 0,
//             sort_order: Number(tier.sort_order) || 0,
//           };
//           if (tier.tier_id) {
//             await api.put(
//               `/api/v1/experience/leave/policies/tiers/${tier.tier_id}`,
//               tp
//             );
//           } else {
//             await api.post("/api/v1/experience/leave/policies/tiers", tp);
//           }
//         }
//       }

//       /* 3. Save applicability rules — NEW ENDPOINT */
//       const rules = buildScopeRules();
//       if (rules.length > 0) {
//         await api.post(
//           `/api/v1/leave/policies/${policyId}/applicability-rules`,
//           { rules }
//         );
//       }

//       setSuccess(
//         editId
//           ? "Policy updated successfully"
//           : "Policy created & balances provisioned"
//       );

//       await fetchPolicies();

//       setTimeout(() => {
//         closeForm();
//       }, 900);
//     } catch (err) {
//       setFormError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ══════════════ DERIVED ══════════════ */

//   const leaveTypeMap = useMemo(
//     () =>
//       Object.fromEntries(
//         leaveTypes.map((lt) => [String(getLeaveTypeId(lt)), getLeaveTypeName(lt)])
//       ),
//     [leaveTypes]
//   );

//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
//   const scopeCount = getScopeCount(scope);
//   const hasScope = scopeCount > 0;

//   /* ══════════════ RENDER ══════════════ */

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* HEADER */}
//         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Leave Policies</h1>
//             <p className="mt-1 text-sm text-slate-500">
//               One leave type can have multiple policies with different scopes
//               {total > 0 && (
//                 <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
//                   {total} total
//                 </span>
//               )}
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={openAdd}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
//           >
//             + New Policy
//           </button>
//         </div>

//         {/* NOTIFICATIONS */}
//         <Toast type="error" message={error} onDismiss={() => setError("")} />
//         <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

//         {/* SEARCH */}
//         <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="relative max-w-md">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search policies..."
//               className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//             <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//               🔍
//             </span>
//             {searchInput && (
//               <button
//                 type="button"
//                 onClick={() => setSearchInput("")}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         {/* POLICY GRID */}
//         {loading && list.length === 0 ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />
//             ))}
//           </div>
//         ) : list.length === 0 ? (
//           <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
//               📋
//             </div>
//             <p className="text-sm font-semibold text-slate-700">No policies yet</p>
//             <p className="text-xs text-slate-500">
//               Create your first policy to define who gets how many leaves
//             </p>
//             <button
//               type="button"
//               onClick={openAdd}
//               className="mt-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
//             >
//               + New Policy
//             </button>
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {list.map((item) => {
//               const policyId = getPolicyId(item);
//               const ltName = leaveTypeMap[String(item.leave_type_id)] || "—";
//               return (
//                 <button
//                   key={policyId}
//                   type="button"
//                   onClick={() => setSelectedPolicy(item)}
//                   className="group relative rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                         {item.entitlement_type?.replace(/_/g, " ") || "fixed"}
//                       </p>
//                       <h3 className="mt-1 truncate text-base font-semibold text-slate-900">
//                         {item.policy_name || "Unnamed"}
//                       </h3>
//                       <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
//                         {ltName}
//                       </span>
//                     </div>
//                     <span
//                       className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
//                         item.is_active
//                           ? "bg-emerald-50 text-emerald-700"
//                           : "bg-slate-100 text-slate-600"
//                       }`}
//                     >
//                       {item.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   <div className="mt-4 grid grid-cols-2 gap-2">
//                     <div className="rounded-lg bg-slate-50 px-3 py-2">
//                       <p className="text-[10px] uppercase text-slate-400">Days</p>
//                       <p className="text-lg font-bold text-slate-900 tabular-nums">
//                         {item.total_leaves ?? 0}
//                       </p>
//                     </div>
//                     <div className="rounded-lg bg-slate-50 px-3 py-2">
//                       <p className="text-[10px] uppercase text-slate-400">
//                         {item.applicable_gender === "all" ? "Gender" : "For"}
//                       </p>
//                       <p className="text-sm font-semibold capitalize text-slate-800">
//                         {item.applicable_gender || "all"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
//                     <span>
//                       {item.effective_from
//                         ? new Date(item.effective_from).toLocaleDateString("en-IN")
//                         : "—"}
//                     </span>
//                     <span className="font-semibold text-[#E42527] opacity-0 transition group-hover:opacity-100">
//                       View details →
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {/* PAGINATION */}
//         {!loading && list.length > 0 && totalPages > 1 && (
//           <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
//             <p className="text-xs text-slate-500">
//               Page <span className="font-medium">{page}</span> of {totalPages}
//             </p>
//             <div className="flex gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ═══════════════════ FORM MODAL ═══════════════════ */}
//       {showForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-3 pt-6 backdrop-blur-[2px] sm:p-6"
//           onClick={closeForm}
//         >
//           <div
//             className="mb-6 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* HEADER */}
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-900">
//                   {editId ? "Edit Leave Policy" : "Create Leave Policy"}
//                 </h2>
//                 <p className="mt-0.5 text-xs text-slate-500">
//                   Configure entitlement, rules and who gets this policy
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 disabled={saving}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* TABS */}
//             <div className="border-b border-slate-100 bg-slate-50/60 px-3 py-2">
//               <div className="flex gap-1 overflow-x-auto">
//                 {TABS.map((t) => {
//                   const active = activeTab === t.id;
//                   const showWarning = t.id === "applicability" && !hasScope;
//                   return (
//                     <button
//                       key={t.id}
//                       type="button"
//                       onClick={() => setActiveTab(t.id)}
//                       className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
//                         active
//                           ? "bg-white text-[#E42527] shadow-sm ring-1 ring-red-100"
//                           : "text-slate-600 hover:bg-white/70"
//                       }`}
//                     >
//                       <span>{t.icon}</span>
//                       <span>{t.label}</span>
//                       {showWarning && (
//                         <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* BODY */}
//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
//                 {formError && (
//                   <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
//                     <span className="whitespace-pre-line">{formError}</span>
//                   </div>
//                 )}

//                 {/* ─── BASIC ─── */}
//                 {activeTab === "basic" && (
//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <Field label="Policy Name" required>
//                       <input
//                         autoFocus
//                         required
//                         value={formData.policy_name}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, policy_name: e.target.value }))
//                         }
//                         placeholder="e.g. India FTE 2026 - CL"
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <Field label="Leave Type" required>
//                       <select
//                         required
//                         value={formData.leave_type_id}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, leave_type_id: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       >
//                         <option value="">Select leave type</option>
//                         {leaveTypes.map((lt) => {
//                           const id = getLeaveTypeId(lt);
//                           return id ? (
//                             <option key={id} value={id}>
//                               {getLeaveTypeName(lt)}
//                             </option>
//                           ) : null;
//                         })}
//                       </select>
//                     </Field>

//                     <Field label="Effective From" required>
//                       <input
//                         required
//                         type="date"
//                         value={formData.effective_from}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, effective_from: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <Field label="Effective To" hint="Empty = no expiry">
//                       <input
//                         type="date"
//                         value={formData.effective_to}
//                         min={formData.effective_from}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, effective_to: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <Field
//                       label="Priority"
//                       hint="Higher = wins when multiple policies match (default 100)"
//                     >
//                       <input
//                         type="number"
//                         min={1}
//                         max={999}
//                         value={formData.priority}
//                         onChange={(e) =>
//                           setFormData((p) => ({ ...p, priority: e.target.value }))
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </Field>

//                     <div className="sm:col-span-2">
//                       <Toggle
//                         checked={formData.is_active}
//                         onChange={(v) => setFormData((p) => ({ ...p, is_active: v }))}
//                         label="Active Policy"
//                         hint="Inactive policies are ignored during leave apply"
//                       />
//                     </div>

//                     <div className="sm:col-span-2">
//                       <Field label="Internal Notes / Reason">
//                         <textarea
//                           rows={2}
//                           value={formData.reason}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, reason: e.target.value }))
//                           }
//                           placeholder="Why this policy exists (visible to HR only)"
//                           className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── ENTITLEMENT ─── */}
//                 {activeTab === "entitlement" && (
//                   <div className="space-y-5">
//                     <div>
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         How does this policy give leaves?
//                       </p>
//                       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                         {ENTITLEMENT_TYPES.map((t) => {
//                           const active = formData.entitlement_type === t.value;
//                           return (
//                             <button
//                               key={t.value}
//                               type="button"
//                               onClick={() =>
//                                 setFormData((p) => ({
//                                   ...p,
//                                   entitlement_type: t.value,
//                                   // Grant-based is a one-time credit → default accrual to upfront
//                                   ...(t.value === "grant_based"
//                                     ? { accrual_type: "upfront" }
//                                     : {}),
//                                   // Attendance-based works best with monthly accrual
//                                   ...(t.value === "attendance_based" &&
//                                   p.accrual_type === "upfront"
//                                     ? { accrual_type: "monthly" }
//                                     : {}),
//                                 }))
//                               }
//                               className={`rounded-xl border p-3 text-left transition ${
//                                 active
//                                   ? "border-[#E42527] bg-red-50"
//                                   : "border-slate-200 bg-white hover:bg-slate-50"
//                               }`}
//                             >
//                               <p className="text-sm font-semibold text-slate-900">
//                                 {t.label}
//                               </p>
//                               <p className="mt-0.5 text-[11px] text-slate-500">
//                                 {t.hint}
//                               </p>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     {/* FIXED — total + accrual */}
//                     {formData.entitlement_type === "fixed" && (
//                       <div className="grid gap-4 sm:grid-cols-3">
//                         <Field label="Total Leaves / Year" required>
//                           <input
//                             type="number"
//                             step="0.5"
//                             min="0"
//                             value={formData.total_leaves}
//                             onChange={(e) =>
//                               setFormData((p) => ({ ...p, total_leaves: e.target.value }))
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                           />
//                         </Field>
//                         <Field label="Accrual Type" hint="When days are credited">
//                           <select
//                             value={formData.accrual_type}
//                             onChange={(e) =>
//                               setFormData((p) => ({ ...p, accrual_type: e.target.value }))
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                           >
//                             {ACCRUAL_TYPES.map((a) => (
//                               <option key={a.value} value={a.value}>
//                                 {a.label}
//                               </option>
//                             ))}
//                           </select>
//                         </Field>
//                         <Field label="Per Month Limit" hint="0 = no limit">
//                           <input
//                             type="number"
//                             step="0.5"
//                             min="0"
//                             value={formData.per_month_limit}
//                             onChange={(e) =>
//                               setFormData((p) => ({ ...p, per_month_limit: e.target.value }))
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                           />
//                         </Field>
//                       </div>
//                     )}

//                     {/* GRANT BASED — grant size + min/max/reusable/LOP */}
//                     {formData.entitlement_type === "grant_based" && (
//                       <div className="space-y-4">
//                         <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-xs text-violet-800">
//                           <p className="font-semibold">Grant-Based Policy</p>
//                           <p className="mt-0.5">
//                             One-time grant (e.g. maternity / special leave). Set size, min/max days
//                             per application, and reuse gap. Extension beyond balance can be LOP.
//                           </p>
//                         </div>

//                         {/* WHO GETS THIS GRANT */}
//                         <div
//                           className={`rounded-xl border p-4 ${
//                             hasScope
//                               ? "border-emerald-200 bg-emerald-50"
//                               : "border-amber-300 bg-amber-50"
//                           }`}
//                         >
//                           <p
//                             className={`text-sm font-semibold ${
//                               hasScope ? "text-emerald-900" : "text-amber-900"
//                             }`}
//                           >
//                             {hasScope
//                               ? `✓ Who gets this grant — scope set (${scopeCount} criteria)`
//                               : "⚠️ Who gets this grant — not set yet"}
//                           </p>
//                           <p
//                             className={`mt-1 text-xs ${
//                               hasScope ? "text-emerald-700" : "text-amber-800"
//                             }`}
//                           >
//                             {hasScope ? (
//                               <>
//                                 Depts: {scope.departments.length || "—"} · Locations:{" "}
//                                 {scope.locations.length || "—"} · Emp types:{" "}
//                                 {scope.employment_types.length || "—"} · Specific:{" "}
//                                 {scope.specific_employees.length || "—"}
//                                 {formData.applicable_gender !== "all" &&
//                                   ` · Gender: ${formData.applicable_gender}`}
//                                 {Number(formData.min_service_days) > 0 &&
//                                   ` · Min service: ${formData.min_service_days} days`}
//                               </>
//                             ) : (
//                               <>
//                                 Grant tabhi unhi employees ko milega jinhe aap{" "}
//                                 <strong>Who Gets This?</strong> tab me select karoge
//                                 (department / location / employment type / specific employees).
//                                 Bina scope ke ye ALL employees pe apply hoga.
//                               </>
//                             )}
//                           </p>
//                           <button
//                             type="button"
//                             onClick={() => setActiveTab("applicability")}
//                             className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
//                           >
//                             {hasScope ? "Edit who gets this →" : "Set who gets this grant →"}
//                           </button>
//                         </div>

//                         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                           <Field
//                             label="Grant Size (Total Days)"
//                             hint="Balance credited when policy is assigned"
//                             required
//                           >
//                             <input
//                               type="number"
//                               step="0.5"
//                               min="0"
//                               value={formData.total_leaves}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, total_leaves: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                           <Field label="Min Days per Grant" hint="Application cannot be shorter">
//                             <input
//                               type="number"
//                               step="0.5"
//                               min="0"
//                               value={formData.grant_min_days}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, grant_min_days: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                           <Field label="Max Days per Grant" hint="Application cannot be longer">
//                             <input
//                               type="number"
//                               step="0.5"
//                               min="0"
//                               value={formData.grant_max_days}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, grant_max_days: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                           <Field
//                             label="Reusable After (days)"
//                             hint="Gap required after last grant ends. 0 = no restriction"
//                           >
//                             <input
//                               type="number"
//                               min="0"
//                               value={formData.grant_reusable_after_days}
//                               onChange={(e) =>
//                                 setFormData((p) => ({
//                                   ...p,
//                                   grant_reusable_after_days: e.target.value,
//                                 }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                         </div>

//                         <Toggle
//                           checked={formData.grant_extension_as_lop}
//                           onChange={(v) =>
//                             setFormData((p) => ({ ...p, grant_extension_as_lop: v }))
//                           }
//                           label="Extension as LOP"
//                           hint="If employee extends beyond remaining grant balance, mark excess as Loss of Pay"
//                         />
//                       </div>
//                     )}

//                     {/* ATTENDANCE BASED — ceiling + accrual + criteria */}
//                     {formData.entitlement_type === "attendance_based" && (
//                       <div className="space-y-4">
//                         <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-800">
//                           <p className="font-semibold">Attendance-Based Policy</p>
//                           <p className="mt-0.5">
//                             Leaves are <strong>earned</strong> from attendance over the year.
//                             Yearly ceiling + accrual type define how many days get credited.
//                           </p>
//                         </div>

//                         {/* WHO GETS THIS */}
//                         <div
//                           className={`rounded-xl border p-4 ${
//                             hasScope
//                               ? "border-emerald-200 bg-emerald-50"
//                               : "border-amber-300 bg-amber-50"
//                           }`}
//                         >
//                           <p
//                             className={`text-sm font-semibold ${
//                               hasScope ? "text-emerald-900" : "text-amber-900"
//                             }`}
//                           >
//                             {hasScope
//                               ? `✓ Who earns this leave — scope set (${scopeCount} criteria)`
//                               : "⚠️ Who earns this leave — not set yet"}
//                           </p>
//                           <p
//                             className={`mt-1 text-xs ${
//                               hasScope ? "text-emerald-700" : "text-amber-800"
//                             }`}
//                           >
//                             {hasScope ? (
//                               <>
//                                 Depts: {scope.departments.length || "—"} · Locations:{" "}
//                                 {scope.locations.length || "—"} · Emp types:{" "}
//                                 {scope.employment_types.length || "—"} · Specific:{" "}
//                                 {scope.specific_employees.length || "—"}
//                                 {formData.applicable_gender !== "all" &&
//                                   ` · Gender: ${formData.applicable_gender}`}
//                                 {Number(formData.min_service_days) > 0 &&
//                                   ` · Min service: ${formData.min_service_days} days`}
//                               </>
//                             ) : (
//                               <>
//                                 Sirf selected employees hi is attendance-based leave ko earn
//                                 karenge. <strong>Who Gets This?</strong> tab me department /
//                                 location / employment type / employees select karo.
//                               </>
//                             )}
//                           </p>
//                           <button
//                             type="button"
//                             onClick={() => setActiveTab("applicability")}
//                             className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
//                           >
//                             {hasScope ? "Edit who earns this →" : "Set who earns this leave →"}
//                           </button>
//                         </div>

//                         {/* ATTENDANCE CRITERIA */}
//                         <div className="rounded-xl border border-slate-200 bg-white p-4">
//                           <p className="mb-1 text-sm font-semibold text-slate-800">
//                             Attendance → Leave criteria
//                           </p>
//                           <p className="mb-3 text-[11px] text-slate-500">
//                             Accrual job har period me balance credit karta hai. Formula:
//                           </p>
//                           <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
//                             {formData.accrual_type === "monthly" && (
//                               <>
//                                 <strong>Monthly:</strong> each month credit ≈{" "}
//                                 <strong>
//                                   {(Number(formData.total_leaves) || 0) / 12 || 0}
//                                 </strong>{" "}
//                                 day(s)
//                                 {Number(formData.per_month_limit) > 0 && (
//                                   <> (capped at {formData.per_month_limit}/month)</>
//                                 )}
//                                 . Yearly max = {formData.total_leaves || 0}.
//                               </>
//                             )}
//                             {formData.accrual_type === "quarterly" && (
//                               <>
//                                 <strong>Quarterly:</strong> each quarter credit ≈{" "}
//                                 <strong>
//                                   {(Number(formData.total_leaves) || 0) / 4 || 0}
//                                 </strong>{" "}
//                                 day(s). Yearly max = {formData.total_leaves || 0}.
//                               </>
//                             )}
//                             {formData.accrual_type === "upfront" && (
//                               <>
//                                 <strong>Upfront:</strong> full{" "}
//                                 <strong>{formData.total_leaves || 0}</strong> day(s) at year
//                                 start (attendance still required for eligibility checks).
//                               </>
//                             )}
//                             {!["monthly", "quarterly", "upfront"].includes(
//                               formData.accrual_type
//                             ) && (
//                               <>Set Accrual Type below to see the earn formula.</>
//                             )}
//                           </div>

//                           <div className="grid gap-4 sm:grid-cols-3">
//                             <Field
//                               label="Yearly Ceiling (Total Leaves)"
//                               hint="Max days employee can earn in a year"
//                               required
//                             >
//                               <input
//                                 type="number"
//                                 step="0.5"
//                                 min="0"
//                                 value={formData.total_leaves}
//                                 onChange={(e) =>
//                                   setFormData((p) => ({ ...p, total_leaves: e.target.value }))
//                                 }
//                                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                               />
//                             </Field>
//                             <Field
//                               label="Accrual Type"
//                               hint="How often leave is credited from attendance"
//                               required
//                             >
//                               <select
//                                 value={formData.accrual_type}
//                                 onChange={(e) =>
//                                   setFormData((p) => ({ ...p, accrual_type: e.target.value }))
//                                 }
//                                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                               >
//                                 {ACCRUAL_TYPES.map((a) => (
//                                   <option key={a.value} value={a.value}>
//                                     {a.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             </Field>
//                             <Field
//                               label="Per Month Cap"
//                               hint="0 = no monthly cap"
//                             >
//                               <input
//                                 type="number"
//                                 step="0.5"
//                                 min="0"
//                                 value={formData.per_month_limit}
//                                 onChange={(e) =>
//                                   setFormData((p) => ({
//                                     ...p,
//                                     per_month_limit: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                               />
//                             </Field>
//                           </div>

//                           <div className="mt-3 grid gap-3 sm:grid-cols-2">
//                             <Field
//                               label="Min Service Days"
//                               hint="Employee must complete these days before earning starts"
//                             >
//                               <input
//                                 type="number"
//                                 min="0"
//                                 value={formData.min_service_days}
//                                 onChange={(e) =>
//                                   setFormData((p) => ({
//                                     ...p,
//                                     min_service_days: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                               />
//                             </Field>
//                             <Field label="Applicable Gender">
//                               <select
//                                 value={formData.applicable_gender}
//                                 onChange={(e) =>
//                                   setFormData((p) => ({
//                                     ...p,
//                                     applicable_gender: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                               >
//                                 {GENDERS.map((g) => (
//                                   <option key={g.value} value={g.value}>
//                                     {g.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             </Field>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* EXPERIENCE BASED */}
//                     {formData.entitlement_type === "experience_based" && (
//                       <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
//                         <p className="font-semibold">Experience Tiers Required</p>
//                         <p className="mt-0.5">
//                           Go to <strong>Advanced</strong> tab to define tiers (min service days → annual quota).
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* ─── RULES ─── */}
//                 {activeTab === "rules" && (
//                   <div className="space-y-5">
//                     <div className="grid gap-4 sm:grid-cols-3">
//                       <Field label="Max Applications / Year">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.max_applications_per_year}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, max_applications_per_year: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Min Leave Count">
//                         <input
//                           type="number"
//                           step="0.5"
//                           min="0"
//                           value={formData.min_leave_count_for_request}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, min_leave_count_for_request: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Min Notice Days">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.min_notice_days}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, min_notice_days: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Document Required After (days)">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.document_required_after_days}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, document_required_after_days: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Min Service Days">
//                         <input
//                           type="number"
//                           min="0"
//                           value={formData.min_service_days}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, min_service_days: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                       <Field label="Max Negative Balance">
//                         <input
//                           type="number"
//                           step="0.5"
//                           min="0"
//                           value={formData.max_negative_balance}
//                           onChange={(e) =>
//                             setFormData((p) => ({ ...p, max_negative_balance: e.target.value }))
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                         />
//                       </Field>
//                     </div>

//                     <div className="grid gap-3 sm:grid-cols-2">
//                       <Toggle
//                         checked={formData.mark_excess_as_lop}
//                         onChange={(v) => setFormData((p) => ({ ...p, mark_excess_as_lop: v }))}
//                         label="Mark Excess as LOP"
//                         hint="Beyond balance → Loss of Pay"
//                       />
//                       <Toggle
//                         checked={formData.allow_half_day}
//                         onChange={(v) => setFormData((p) => ({ ...p, allow_half_day: v }))}
//                         label="Allow Half Day"
//                       />
//                     </div>

//                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         Carry Forward
//                       </p>
//                       <Toggle
//                         checked={formData.carry_forward_allowed}
//                         onChange={(v) => setFormData((p) => ({ ...p, carry_forward_allowed: v }))}
//                         label="Allow Carry Forward"
//                       />
//                       {formData.carry_forward_allowed && (
//                         <div className="mt-3 grid gap-3 sm:grid-cols-2">
//                           <Field label="Carry Forward Max Days">
//                             <input
//                               type="number"
//                               step="0.5"
//                               min="0"
//                               value={formData.carry_forward_max}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, carry_forward_max: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                           <Field label="Expiry (months)">
//                             <input
//                               type="number"
//                               min="0"
//                               value={formData.carry_forward_expiry_months}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, carry_forward_expiry_months: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                         </div>
//                       )}
//                     </div>

//                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         Encashment
//                       </p>
//                       <Toggle
//                         checked={formData.encashment_allowed}
//                         onChange={(v) => setFormData((p) => ({ ...p, encashment_allowed: v }))}
//                         label="Allow Encashment"
//                       />
//                       {formData.encashment_allowed && (
//                         <div className="mt-3">
//                           <Field label="Encashment Max Days">
//                             <input
//                               type="number"
//                               step="0.5"
//                               min="0"
//                               value={formData.encashment_max_days}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, encashment_max_days: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── ADVANCED ─── */}
//                 {activeTab === "advanced" && (
//                   <div className="space-y-5">
//                     <Field label="Applicable Gender">
//                       <div className="grid gap-2 sm:grid-cols-3">
//                         {GENDERS.map((g) => {
//                           const active = formData.applicable_gender === g.value;
//                           return (
//                             <button
//                               key={g.value}
//                               type="button"
//                               onClick={() =>
//                                 setFormData((p) => ({ ...p, applicable_gender: g.value }))
//                               }
//                               className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
//                                 active
//                                   ? "border-[#E42527] bg-red-50 text-[#E42527]"
//                                   : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//                               }`}
//                             >
//                               {g.label}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </Field>

//                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                       <p className="mb-3 text-sm font-semibold text-slate-800">
//                         Sandwich Rule
//                       </p>
//                       <p className="mb-3 text-xs text-slate-500">
//                         If employee takes leave on Friday and Monday, weekend counts as leave
//                       </p>
//                       <Toggle
//                         checked={formData.sandwich_enabled}
//                         onChange={(v) => setFormData((p) => ({ ...p, sandwich_enabled: v }))}
//                         label="Enable Sandwich Rule"
//                       />
//                       {formData.sandwich_enabled && (
//                         <div className="mt-3 grid gap-3 sm:grid-cols-3">
//                           <Field label="Sandwich Limit Days">
//                             <input
//                               type="number"
//                               min="0"
//                               value={formData.sandwich_limit_days}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, sandwich_limit_days: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             />
//                           </Field>
//                           <Field label="Weekends Mode">
//                             <select
//                               value={formData.sandwich_weekends_mode}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, sandwich_weekends_mode: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             >
//                               {SANDWICH_MODES.map((m) => (
//                                 <option key={m.value} value={m.value}>
//                                   {m.label}
//                                 </option>
//                               ))}
//                             </select>
//                           </Field>
//                           <Field label="Holidays Mode">
//                             <select
//                               value={formData.sandwich_holidays_mode}
//                               onChange={(e) =>
//                                 setFormData((p) => ({ ...p, sandwich_holidays_mode: e.target.value }))
//                               }
//                               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                             >
//                               {SANDWICH_MODES.map((m) => (
//                                 <option key={m.value} value={m.value}>
//                                   {m.label}
//                                 </option>
//                               ))}
//                             </select>
//                           </Field>
//                         </div>
//                       )}
//                     </div>

//                     {formData.entitlement_type === "experience_based" && (
//                       <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
//                         <div className="mb-3 flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-semibold text-slate-800">
//                               Experience Tiers
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               Different quotas based on years of service
//                             </p>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => setTiers((p) => [...p, { ...EMPTY_TIER }])}
//                             className="rounded-lg border border-[#E42527] bg-white px-3 py-1.5 text-xs font-medium text-[#E42527] hover:bg-red-50"
//                           >
//                             + Add Tier
//                           </button>
//                         </div>

//                         <div className="space-y-3">
//                           {tiers.map((tier, index) => (
//                             <div
//                               key={tier.tier_id || `new-${index}`}
//                               className="grid grid-cols-1 gap-3 rounded-lg bg-white p-3 sm:grid-cols-4"
//                             >
//                               <Field label="Min Service Days">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   value={tier.min_service_days}
//                                   onChange={(e) =>
//                                     setTiers((prev) => {
//                                       const next = [...prev];
//                                       next[index] = { ...next[index], min_service_days: e.target.value };
//                                       return next;
//                                     })
//                                   }
//                                   className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                                 />
//                               </Field>
//                               <Field label="Annual Quota">
//                                 <input
//                                   type="number"
//                                   step="0.5"
//                                   min="0"
//                                   value={tier.annual_quota}
//                                   onChange={(e) =>
//                                     setTiers((prev) => {
//                                       const next = [...prev];
//                                       next[index] = { ...next[index], annual_quota: e.target.value };
//                                       return next;
//                                     })
//                                   }
//                                   className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                                 />
//                               </Field>
//                               <Field label="Sort Order">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   value={tier.sort_order}
//                                   onChange={(e) =>
//                                     setTiers((prev) => {
//                                       const next = [...prev];
//                                       next[index] = { ...next[index], sort_order: e.target.value };
//                                       return next;
//                                     })
//                                   }
//                                   className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                                 />
//                               </Field>
//                               <div className="flex items-end">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     setTiers((p) => (p.length > 1 ? p.filter((_, i) => i !== index) : p))
//                                   }
//                                   disabled={tiers.length <= 1}
//                                   className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* ─── APPLICABILITY ─── */}
//                 {activeTab === "applicability" && (
//                   <div className="space-y-5">
//                     {/* WARNING BANNER */}
//                     <div
//                       className={`rounded-xl border p-4 ${
//                         hasScope
//                           ? "border-emerald-200 bg-emerald-50"
//                           : "border-amber-300 bg-amber-50"
//                       }`}
//                     >
//                       <p
//                         className={`text-sm font-semibold ${
//                           hasScope ? "text-emerald-900" : "text-amber-900"
//                         }`}
//                       >
//                         {hasScope
//                           ? `✓ Scope defined (${scopeCount} criteria)`
//                           : "⚠️ No scope selected"}
//                       </p>
//                       <p
//                         className={`mt-0.5 text-xs ${
//                           hasScope ? "text-emerald-700" : "text-amber-800"
//                         }`}
//                       >
//                         {hasScope
//                           ? "This policy will apply only to selected employees"
//                           : "This policy will apply to ALL employees. Select at least one criteria."}
//                       </p>
//                     </div>

//                     {/* SCOPE OPTIONS */}
//                     <MultiChipSelect
//                       label="Departments"
//                       icon="🏢"
//                       options={departments.map((d) => ({
//                         id: d.department_id,
//                         name: d.department_name,
//                       }))}
//                       value={scope.departments}
//                       onChange={(v) => setScope((p) => ({ ...p, departments: v }))}
//                       placeholder="No departments found"
//                     />

//                     <MultiChipSelect
//                       label="Locations"
//                       icon="📍"
//                       options={locations.map((l) => ({
//                         id: l.location_id,
//                         name: l.location_name,
//                       }))}
//                       value={scope.locations}
//                       onChange={(v) => setScope((p) => ({ ...p, locations: v }))}
//                       placeholder="No locations found"
//                     />

//                     <MultiChipSelect
//                       label="Employment Types"
//                       icon="💼"
//                       options={employmentTypes.map((e) => ({
//                         id: e.employment_type_id,
//                         name: e.name,
//                       }))}
//                       value={scope.employment_types}
//                       onChange={(v) => setScope((p) => ({ ...p, employment_types: v }))}
//                       placeholder="No employment types found"
//                     />

//                     {/* SPECIFIC EMPLOYEES */}
//                     <div className="rounded-xl border border-slate-200 bg-white p-4">
//                       <div className="mb-3 flex items-center gap-2">
//                         <span className="text-base">👤</span>
//                         <p className="text-sm font-semibold text-slate-800">
//                           Specific Employees (optional)
//                         </p>
//                         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
//                           {scope.specific_employees.length}
//                         </span>
//                       </div>
//                       <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-100">
//                         {employees.length === 0 ? (
//                           <p className="p-3 text-xs text-slate-400">
//                             No employees loaded
//                           </p>
//                         ) : (
//                           employees.map((e) => {
//                             const eid = e.employee_id;
//                             const active = scope.specific_employees.includes(eid);
//                             return (
//                               <label
//                                 key={eid}
//                                 className={`flex cursor-pointer items-center gap-2 border-b border-slate-100 px-3 py-2 last:border-b-0 hover:bg-slate-50 ${
//                                   active ? "bg-red-50/40" : ""
//                                 }`}
//                               >
//                                 <input
//                                   type="checkbox"
//                                   checked={active}
//                                   onChange={() =>
//                                     setScope((p) => ({
//                                       ...p,
//                                       specific_employees: active
//                                         ? p.specific_employees.filter((x) => x !== eid)
//                                         : [...p.specific_employees, eid],
//                                     }))
//                                   }
//                                   className="h-3.5 w-3.5 rounded border-slate-300 accent-[#E42527]"
//                                 />
//                                 <span className="text-xs font-medium text-slate-700">
//                                   {e.name || `${e.first_name || ""} ${e.last_name || ""}`.trim()}
//                                 </span>
//                               </label>
//                             );
//                           })
//                         )}
//                       </div>
//                     </div>

//                     {/* PREVIEW + OVERLAP ACTIONS */}
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         type="button"
//                         onClick={previewEligibility}
//                         disabled={previewLoading}
//                         className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
//                       >
//                         {previewLoading ? "Loading..." : "👁 Preview Eligible"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={checkOverlap}
//                         disabled={overlapLoading}
//                         className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
//                       >
//                         {overlapLoading ? "Checking..." : "⚠ Check Overlap"}
//                       </button>
//                     </div>

//                     {/* PREVIEW RESULT */}
//                     {preview && (
//                       <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
//                         <div className="flex items-baseline gap-2">
//                           <p className="text-3xl font-bold text-sky-900 tabular-nums">
//                             {preview.eligible}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             of {preview.total_employees} employees
//                           </p>
//                         </div>
//                         {preview.warning && (
//                           <p className="mt-2 rounded-md bg-amber-100 px-2 py-1.5 text-[11px] text-amber-800">
//                             {preview.warning}
//                           </p>
//                         )}
//                         {preview.sample && preview.sample.length > 0 && (
//                           <div className="mt-3">
//                             <p className="text-[10px] font-semibold uppercase text-slate-400">
//                               Sample eligible
//                             </p>
//                             <div className="mt-1.5 flex flex-wrap gap-1">
//                               {preview.sample.map((s, i) => (
//                                 <span
//                                   key={i}
//                                   className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-800"
//                                 >
//                                   {s.name}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* OVERLAP RESULT */}
//                     {overlap?.has_conflicts && (
//                       <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
//                         <p className="text-sm font-semibold text-amber-900">
//                           ⚠️ Overlapping Policies Detected
//                         </p>
//                         <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
//                           {overlap.conflicts.map((c) => (
//                             <li key={c.policy_id}>
//                               <strong>{c.policy_name}</strong> ({c.effective_from} → {c.effective_to || "No expiry"})
//                             </li>
//                           ))}
//                         </ul>
//                         <p className="mt-2 text-[11px] text-amber-700">
//                           Higher priority policy will win. Adjust priority accordingly.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* FOOTER */}
//               <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
//                 <div className="text-xs text-slate-500">
//                   {TABS.findIndex((t) => t.id === activeTab) + 1} / {TABS.length}
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={closeForm}
//                     disabled={saving}
//                     className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={saving}
//                     className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:opacity-60"
//                   >
//                     {saving ? "Saving..." : editId ? "Update Policy" : "Create Policy"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════ DETAILS MODAL ═══════════════════ */}
//       {selectedPolicy && (
//         <div
//           className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
//           onClick={() => setSelectedPolicy(null)}
//         >
//           <div
//             className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Policy details
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-900">
//                   {selectedPolicy.policy_name}
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

//             <div className="max-h-[60vh] space-y-2 overflow-y-auto px-5 py-4">
//               {[
//                 ["Leave Type", leaveTypeMap[String(selectedPolicy.leave_type_id)] || "—"],
//                 ["Entitlement", selectedPolicy.entitlement_type?.replace(/_/g, " ")],
//                 ["Total Leaves", selectedPolicy.total_leaves],
//                 ...(selectedPolicy.entitlement_type !== "grant_based"
//                   ? [["Accrual", selectedPolicy.accrual_type]]
//                   : []),
//                 ...(selectedPolicy.entitlement_type === "grant_based"
//                   ? [
//                       ["Grant Min Days", selectedPolicy.grant_min_days],
//                       ["Grant Max Days", selectedPolicy.grant_max_days],
//                       ["Reusable After (days)", selectedPolicy.grant_reusable_after_days],
//                       [
//                         "Extension as LOP",
//                         selectedPolicy.grant_extension_as_lop ? "Yes" : "No",
//                       ],
//                     ]
//                   : []),
//                 ["Gender", selectedPolicy.applicable_gender],
//                 ["Priority", selectedPolicy.priority ?? 100],
//                 [
//                   "Effective",
//                   `${selectedPolicy.effective_from || "—"} → ${selectedPolicy.effective_to || "No expiry"}`,
//                 ],
//                 ["Status", selectedPolicy.is_active ? "Active" : "Inactive"],
//               ].map(([k, v]) => (
//                 <div
//                   key={k}
//                   className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
//                 >
//                   <span className="text-xs text-slate-500">{k}</span>
//                   <span className="text-sm font-semibold capitalize text-slate-800">
//                     {v ?? "—"}
//                   </span>
//                 </div>
//               ))}
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
//                   const p = selectedPolicy;
//                   setSelectedPolicy(null);
//                   openEdit(p);
//                 }}
//                 className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
//               >
//                 Edit
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

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const TODAY = new Date().toISOString().split("T")[0];
const PAGE_SIZE = 12;
const DEBOUNCE_MS = 450;
const AUTO_DISMISS_MS = 5000;

const TABS = [
  { id: "basic", label: "Basic", icon: "📋" },
  { id: "entitlement", label: "Entitlement", icon: "🎯" },
  { id: "rules", label: "Rules", icon: "⚙️" },
  { id: "advanced", label: "Advanced", icon: "🔧" },
  { id: "applicability", label: "Who Gets This?", icon: "👥" },
];

const ENTITLEMENT_TYPES = [
  { value: "fixed", label: "Fixed", hint: "Same quota for everyone" },
  { value: "experience_based", label: "Experience Based", hint: "Different per tier" },
  { value: "grant_based", label: "Grant Based", hint: "One-time grant (issues on apply)" },
  { value: "attendance_based", label: "Attendance Based", hint: "Earned from attendance days" },
];

const ACCRUAL_TYPES = [
  { value: "upfront", label: "Upfront", hint: "All days at start of year" },
  { value: "monthly", label: "Monthly", hint: "1/12th each month" },
  { value: "quarterly", label: "Quarterly", hint: "1/4th each quarter" },
];

const GENDERS = [
  { value: "all", label: "All Genders" },
  { value: "male", label: "Male Only" },
  { value: "female", label: "Female Only" },
];

const SANDWICH_MODES = [
  { value: "include", label: "Include (count as leave)" },
  { value: "exclude", label: "Exclude (don't count)" },
];

const EMPTY_FORM = {
  leave_type_id: "",
  policy_name: "",
  entitlement_type: "fixed",
  total_leaves: 12,
  accrual_type: "upfront",
  per_month_limit: 0,
  max_applications_per_year: 0,
  min_leave_count_for_request: 1,
  grant_min_days: 1,
  grant_max_days: 30,
  grant_reusable_after_days: 0,
  grant_extension_as_lop: false,
  attendance_earn_ratio: 20,
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
  effective_from: TODAY,
  effective_to: "",
  is_active: true,
  priority: 100,
  reason: "",
};

const EMPTY_TIER = { tier_id: null, min_service_days: 0, annual_quota: 0, sort_order: 0 };

const EMPTY_SCOPE = {
  departments: [],
  locations: [],
  employment_types: [],
  specific_employees: [],
  exclude_employees: [],
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

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
  return err?.response?.data?.message || err?.message || "Something went wrong";
};

const toArray = (payload, keys = []) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  for (const k of keys) if (Array.isArray(payload[k])) return payload[k];
  return [];
};

const getLeaveTypeId = (lt) => lt?.leave_type_id || null;
const getLeaveTypeName = (lt) => lt?.leave_type_name || lt?.leave_type_code || "—";
const getPolicyId = (p) => p?.leave_policy_id || null;
const getPolicyName = (p) => p?.policy_name || getPolicyId(p) || "Unnamed";

const getScopeCount = (scope) =>
  (scope?.departments?.length || 0) +
  (scope?.locations?.length || 0) +
  (scope?.employment_types?.length || 0) +
  (scope?.specific_employees?.length || 0);

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS
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
      <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}

function Field({ label, hint, required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:bg-slate-50">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#E42527]"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {hint && <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div>}
      </div>
    </label>
  );
}

function MultiChipSelect({ label, icon, options, value, onChange, placeholder }) {
  const toggle = (id) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
          {value.length}
        </span>
      </div>

      {options.length === 0 ? (
        <p className="text-xs text-slate-400">{placeholder || "No options available"}</p>
      ) : (
        <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
          {options.map((opt) => {
            const id = opt.id || opt.value;
            const name = opt.name || opt.label;
            const active = value.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? "border-[#E42527] bg-red-50 text-[#E42527]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {active && <span>✓</span>}
                {name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function LeavePoliciesPage() {
  /* list */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /* masters */
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  /* ui */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* form modal */
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [tiers, setTiers] = useState([{ ...EMPTY_TIER }]);
  const [scope, setScope] = useState(EMPTY_SCOPE);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  /* preview + overlap */
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [overlap, setOverlap] = useState(null);
  const [overlapLoading, setOverlapLoading] = useState(false);

  /* details modal */
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  /* guards */
  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOADERS ══════════════ */

  const loadLeaveTypes = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/leave/type", {
        params: { page: 1, page_size: 200 },
      });
      setLeaveTypes(toArray(res?.data, ["leave_types", "data", "items"]));
    } catch {
      setLeaveTypes([]);
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/employees");
      setEmployees(toArray(res?.data, ["employees", "data", "items"]));
    } catch {
      setEmployees([]);
    }
  }, []);

  const loadMasters = useCallback(async () => {
    const safe = async (url, keys) => {
      try {
        const res = await api.get(url);
        return toArray(res?.data, keys);
      } catch {
        return [];
      }
    };
    const [d, l, et] = await Promise.all([
      safe("/api/v1/get/departments", ["departments", "data"]),
      safe("/api/v1/get/location/master", ["locations", "location", "data"]),
      safe("/api/v1/get/employment/type", ["employment_types", "data"]),
    ]);
    setDepartments(d);
    setLocations(l);
    setEmploymentTypes(et);
  }, []);

  useEffect(() => {
    loadLeaveTypes();
    loadEmployees();
    loadMasters();
  }, [loadLeaveTypes, loadEmployees, loadMasters]);

  /* ══════════════ POLICIES LIST ══════════════ */

  const fetchPolicies = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/leave/policies", {
        params: { page, page_size: PAGE_SIZE, search: search || undefined },
      });
      if (myReqId !== reqIdRef.current) return;
      const items = toArray(res?.data, ["policies", "data", "items"]);
      setList(items);
      setTotal(res?.data?.total ?? items.length);
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setList([]);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchPolicies();
      return;
    }
    const t = setTimeout(fetchPolicies, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchPolicies]);

  /* ══════════════ FORM OPEN/CLOSE ══════════════ */

  const openAdd = () => {
    setEditId(null);
    setActiveTab("basic");
    setFormData(EMPTY_FORM);
    setTiers([{ ...EMPTY_TIER }]);
    setScope(EMPTY_SCOPE);
    setFormError("");
    setSuccess("");
    setPreview(null);
    setOverlap(null);
    setShowForm(true);
  };

  const openEdit = async (item) => {
    const id = getPolicyId(item);
    if (!id) return;

    setEditId(id);
    setActiveTab("basic");
    setFormData({
      ...EMPTY_FORM,
      ...item,
      attendance_earn_ratio: item.attendance_earn_ratio ?? 20,
      effective_from: item.effective_from || TODAY,
      effective_to: item.effective_to || "",
    });
    setFormError("");
    setSuccess("");
    setPreview(null);
    setOverlap(null);

    /* Load tiers */
    if (item.entitlement_type === "experience_based") {
      try {
        const res = await api.get(`/api/v1/experience/leave/policies/${id}/tiers`);
        const t = toArray(res?.data, ["experience_tiers", "data"]);
        setTiers(t.length ? t.map((x) => ({
          tier_id: x.tier_id,
          min_service_days: x.min_service_days ?? 0,
          annual_quota: x.annual_quota ?? 0,
          sort_order: x.sort_order ?? 0,
        })) : [{ ...EMPTY_TIER }]);
      } catch {
        setTiers([{ ...EMPTY_TIER }]);
      }
    } else {
      setTiers([{ ...EMPTY_TIER }]);
    }

    /* Load applicability rules */
    try {
      const res = await api.get(
        `/api/v1/leave/policies/${id}/applicability-rules`
      );
      const rules = toArray(res?.data, ["rules", "applicability_rules", "data"]);
      const newScope = { ...EMPTY_SCOPE };
      rules.forEach((r) => {
        const v = r.criteria_value;
        switch (r.criteria_type) {
          case "department":
            newScope.departments.push(v);
            break;
          case "location":
            newScope.locations.push(v);
            break;
          case "employment_type":
            newScope.employment_types.push(v);
            break;
          case "employee_id":
            if (r.is_exception) newScope.exclude_employees.push(v);
            else newScope.specific_employees.push(v);
            break;
        }
      });
      setScope(newScope);
    } catch {
      setScope(EMPTY_SCOPE);
    }

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditId(null);
    setFormData(EMPTY_FORM);
    setTiers([{ ...EMPTY_TIER }]);
    setScope(EMPTY_SCOPE);
    setPreview(null);
    setOverlap(null);
    setFormError("");
  };

  /* ══════════════ BUILD SCOPE RULES PAYLOAD ══════════════ */

  const buildScopeRules = useCallback(() => {
    const rules = [];
    scope.departments.forEach((v) =>
      rules.push({ criteria_type: "department", criteria_value: String(v), is_exception: false })
    );
    scope.locations.forEach((v) =>
      rules.push({ criteria_type: "location", criteria_value: String(v), is_exception: false })
    );
    scope.employment_types.forEach((v) =>
      rules.push({ criteria_type: "employment_type", criteria_value: String(v), is_exception: false })
    );
    scope.specific_employees.forEach((v) =>
      rules.push({ criteria_type: "employee_id", criteria_value: String(v), is_exception: false })
    );
    scope.exclude_employees.forEach((v) =>
      rules.push({ criteria_type: "employee_id", criteria_value: String(v), is_exception: true })
    );
    return rules;
  }, [scope]);

  /* ══════════════ PREVIEW ELIGIBLE ══════════════ */

  const previewEligibility = async () => {
    if (!formData.leave_type_id) {
      setFormError("Select leave type first");
      return;
    }
    setPreviewLoading(true);
    setPreview(null);
    try {
      const res = await api.post("/api/v1/leave/policies/preview-eligible", {
        scope_rules: buildScopeRules(),
        applicable_gender: formData.applicable_gender,
        min_service_days: Number(formData.min_service_days) || 0,
      });
      setPreview(res?.data ?? res);
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setPreviewLoading(false);
    }
  };

  /* ══════════════ CHECK OVERLAP ══════════════ */

  const checkOverlap = async () => {
    if (!formData.leave_type_id || !formData.effective_from) return;
    setOverlapLoading(true);
    setOverlap(null);
    try {
      const res = await api.post("/api/v1/leave/policies/check-overlap", {
        leave_type_id: formData.leave_type_id,
        effective_from: formData.effective_from,
        effective_to: formData.effective_to || null,
        scope_rules: buildScopeRules(),
        exclude_policy_id: editId,
      });
      // ⭐ Backend returns { success, conflicts: [...] }
      const data = res?.data ?? res;
      const conflicts = Array.isArray(data?.conflicts) ? data.conflicts : [];
      setOverlap({ has_conflicts: conflicts.length > 0, conflicts });
    } catch (err) {
      console.error("Overlap check failed:", err);
      setOverlap(null);
    } finally {
      setOverlapLoading(false);
    }
  };

  /* ══════════════ SUBMIT ══════════════ */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    /* Validation */
    if (!formData.policy_name.trim()) {
      setFormError("Policy name is required");
      setActiveTab("basic");
      return;
    }
    if (!formData.leave_type_id) {
      setFormError("Leave type is required");
      setActiveTab("basic");
      return;
    }
    if (getScopeCount(scope) === 0 && formData.applicable_gender === "all") {
      setFormError(
        "⚠️ Applicability scope is required. Without scope, this policy applies to ALL employees. Go to 'Who Gets This?' tab."
      );
      setActiveTab("applicability");
      return;
    }
    if (
      formData.entitlement_type === "experience_based" &&
      tiers.length === 0
    ) {
      setFormError("Add at least one experience tier");
      setActiveTab("advanced");
      return;
    }
    if (formData.entitlement_type === "grant_based") {
      const gMin = Number(formData.grant_min_days) || 0;
      const gMax = Number(formData.grant_max_days) || 0;
      const total = Number(formData.total_leaves) || 0;
      if (total <= 0) {
        setFormError("Grant size (Total Leaves) must be greater than 0");
        setActiveTab("entitlement");
        return;
      }
      if (gMax > 0 && gMin > gMax) {
        setFormError("Grant Min Days cannot be greater than Grant Max Days");
        setActiveTab("entitlement");
        return;
      }
    }
    if (formData.entitlement_type === "attendance_based") {
      if ((Number(formData.total_leaves) || 0) <= 0) {
        setFormError("Yearly ceiling (Total Leaves) must be greater than 0");
        setActiveTab("entitlement");
        return;
      }
      if ((Number(formData.attendance_earn_ratio) || 0) <= 0) {
        setFormError("Earn ratio (present days per 1 leave) must be greater than 0");
        setActiveTab("entitlement");
        return;
      }
    }

    setSaving(true);
    try {
      /* 1. Create/Update policy */
      const payload = {
        leave_type_id: formData.leave_type_id,
        policy_name: formData.policy_name.trim(),
        entitlement_type: formData.entitlement_type,
        total_leaves: Number(formData.total_leaves) || 0,
        accrual_type: formData.accrual_type,
        per_month_limit: Number(formData.per_month_limit) || 0,
        max_applications_per_year: Number(formData.max_applications_per_year) || 0,
        min_leave_count_for_request: Number(formData.min_leave_count_for_request) || 1,
        grant_min_days: Number(formData.grant_min_days) || 1,
        grant_max_days: Number(formData.grant_max_days) || 30,
        grant_reusable_after_days: Number(formData.grant_reusable_after_days) || 0,
        grant_extension_as_lop: !!formData.grant_extension_as_lop,
        // ⭐ NEW — attendance-based earn ratio
        attendance_earn_ratio: Number(formData.attendance_earn_ratio) || 20,
        carry_forward_allowed: !!formData.carry_forward_allowed,
        carry_forward_max: Number(formData.carry_forward_max) || 0,
        carry_forward_expiry_months: Number(formData.carry_forward_expiry_months) || 0,
        encashment_allowed: !!formData.encashment_allowed,
        encashment_max_days: Number(formData.encashment_max_days) || 0,
        mark_excess_as_lop: !!formData.mark_excess_as_lop,
        max_negative_balance: Number(formData.max_negative_balance) || 0,
        min_notice_days: Number(formData.min_notice_days) || 0,
        document_required_after_days: Number(formData.document_required_after_days) || 0,
        min_service_days: Number(formData.min_service_days) || 0,
        applicable_gender: formData.applicable_gender,
        sandwich_enabled: !!formData.sandwich_enabled,
        sandwich_limit_days: Number(formData.sandwich_limit_days) || 0,
        sandwich_weekends_mode: formData.sandwich_weekends_mode || null,
        sandwich_holidays_mode: formData.sandwich_holidays_mode || null,
        allow_half_day: !!formData.allow_half_day,
        effective_from: formData.effective_from,
        effective_to: formData.effective_to || null,
        is_active: !!formData.is_active,
        reason: formData.reason || null,
      };

      let policyId = editId;

      if (editId) {
        await api.put(`/api/v1/leave/policies/${editId}`, payload);
      } else {
        const res = await api.post("/api/v1/create/leave/policy", payload);
        policyId =
          res?.data?.leave_policy?.leave_policy_id ||
          res?.data?.leave_policy_id ||
          res?.data?.data?.leave_policy_id;
      }

      if (!policyId) throw new Error("Policy ID not returned from server");

      /* 2. Save tiers if experience_based */
      if (formData.entitlement_type === "experience_based") {
        for (const tier of tiers) {
          const tp = {
            leave_policy_id: policyId,
            min_service_days: Number(tier.min_service_days) || 0,
            annual_quota: Number(tier.annual_quota) || 0,
            sort_order: Number(tier.sort_order) || 0,
          };
          if (tier.tier_id) {
            await api.put(
              `/api/v1/experience/leave/policies/tiers/${tier.tier_id}`,
              tp
            );
          } else {
            await api.post("/api/v1/experience/leave/policies/tiers", tp);
          }
        }
      }

      /* 3. Save applicability rules */
      const rules = buildScopeRules();
      if (rules.length > 0) {
        await api.post(
          `/api/v1/leave/policies/${policyId}/applicability-rules`,
          { rules }
        );
      }

      setSuccess(
        editId
          ? "Policy updated successfully"
          : "Policy created & balances provisioned"
      );

      await fetchPolicies();

      setTimeout(() => {
        closeForm();
      }, 900);
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  /* ══════════════ DERIVED ══════════════ */

  const leaveTypeMap = useMemo(
    () =>
      Object.fromEntries(
        leaveTypes.map((lt) => [String(getLeaveTypeId(lt)), getLeaveTypeName(lt)])
      ),
    [leaveTypes]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const scopeCount = getScopeCount(scope);
  const hasScope = scopeCount > 0;

  /* ══════════════ RENDER ══════════════ */

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Leave Policies</h1>
            <p className="mt-1 text-sm text-slate-500">
              One leave type can have multiple policies with different scopes
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
          >
            + New Policy
          </button>
        </div>

        {/* NOTIFICATIONS */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* SEARCH */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search policies..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
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

        {/* POLICY GRID */}
        {loading && list.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📋
            </div>
            <p className="text-sm font-semibold text-slate-700">No policies yet</p>
            <p className="text-xs text-slate-500">
              Create your first policy to define who gets how many leaves
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
            >
              + New Policy
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item) => {
              const policyId = getPolicyId(item);
              const ltName = leaveTypeMap[String(item.leave_type_id)] || "—";
              return (
                <button
                  key={policyId}
                  type="button"
                  onClick={() => setSelectedPolicy(item)}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {item.entitlement_type?.replace(/_/g, " ") || "fixed"}
                      </p>
                      <h3 className="mt-1 truncate text-base font-semibold text-slate-900">
                        {item.policy_name || "Unnamed"}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        {ltName}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                        item.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-400">
                        {item.entitlement_type === "attendance_based" ? "Ceiling" : "Days"}
                      </p>
                      <p className="text-lg font-bold text-slate-900 tabular-nums">
                        {item.total_leaves ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-400">
                        {item.applicable_gender === "all" ? "Gender" : "For"}
                      </p>
                      <p className="text-sm font-semibold capitalize text-slate-800">
                        {item.applicable_gender || "all"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                    <span>
                      {item.effective_from
                        ? new Date(item.effective_from).toLocaleDateString("en-IN")
                        : "—"}
                    </span>
                    <span className="font-semibold text-[#E42527] opacity-0 transition group-hover:opacity-100">
                      View details →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && list.length > 0 && totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">
              Page <span className="font-medium">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════ FORM MODAL ═══════════════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-3 pt-6 backdrop-blur-[2px] sm:p-6"
          onClick={closeForm}
        >
          <div
            className="mb-6 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editId ? "Edit Leave Policy" : "Create Leave Policy"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Configure entitlement, rules and who gets this policy
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* TABS */}
            <div className="border-b border-slate-100 bg-slate-50/60 px-3 py-2">
              <div className="flex gap-1 overflow-x-auto">
                {TABS.map((t) => {
                  const active = activeTab === t.id;
                  const showWarning = t.id === "applicability" && !hasScope;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                        active
                          ? "bg-white text-[#E42527] shadow-sm ring-1 ring-red-100"
                          : "text-slate-600 hover:bg-white/70"
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                      {showWarning && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BODY */}
            <form onSubmit={handleSubmit}>
              <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
                {formError && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                    <span className="whitespace-pre-line">{formError}</span>
                  </div>
                )}

                {/* ─── BASIC ─── */}
                {activeTab === "basic" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Policy Name" required>
                      <input
                        autoFocus
                        required
                        value={formData.policy_name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, policy_name: e.target.value }))
                        }
                        placeholder="e.g. India FTE 2026 - CL"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </Field>

                    <Field label="Leave Type" required>
                      <select
                        required
                        value={formData.leave_type_id}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, leave_type_id: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
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
                    </Field>

                    <Field label="Effective From" required>
                      <input
                        required
                        type="date"
                        value={formData.effective_from}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, effective_from: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </Field>

                    <Field label="Effective To" hint="Empty = no expiry">
                      <input
                        type="date"
                        value={formData.effective_to}
                        min={formData.effective_from}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, effective_to: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Toggle
                        checked={formData.is_active}
                        onChange={(v) => setFormData((p) => ({ ...p, is_active: v }))}
                        label="Active Policy"
                        hint="Inactive policies are ignored during leave apply"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Field label="Internal Notes / Reason">
                        <textarea
                          rows={2}
                          value={formData.reason}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, reason: e.target.value }))
                          }
                          placeholder="Why this policy exists (visible to HR only)"
                          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ─── ENTITLEMENT ─── */}
                {activeTab === "entitlement" && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-800">
                        How does this policy give leaves?
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {ENTITLEMENT_TYPES.map((t) => {
                          const active = formData.entitlement_type === t.value;
                          return (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() =>
                                setFormData((p) => ({
                                  ...p,
                                  entitlement_type: t.value,
                                  ...(t.value === "grant_based"
                                    ? { accrual_type: "upfront" }
                                    : {}),
                                  ...(t.value === "attendance_based" &&
                                  p.accrual_type === "upfront"
                                    ? { accrual_type: "monthly" }
                                    : {}),
                                }))
                              }
                              className={`rounded-xl border p-3 text-left transition ${
                                active
                                  ? "border-[#E42527] bg-red-50"
                                  : "border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {t.label}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {t.hint}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* FIXED */}
                    {formData.entitlement_type === "fixed" && (
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Total Leaves / Year" required>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={formData.total_leaves}
                            onChange={(e) =>
                              setFormData((p) => ({ ...p, total_leaves: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                          />
                        </Field>
                        <Field label="Accrual Type" hint="When days are credited">
                          <select
                            value={formData.accrual_type}
                            onChange={(e) =>
                              setFormData((p) => ({ ...p, accrual_type: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                          >
                            {ACCRUAL_TYPES.map((a) => (
                              <option key={a.value} value={a.value}>
                                {a.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Per Month Limit" hint="0 = no limit">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={formData.per_month_limit}
                            onChange={(e) =>
                              setFormData((p) => ({ ...p, per_month_limit: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                          />
                        </Field>
                      </div>
                    )}

                    {/* GRANT BASED */}
                    {formData.entitlement_type === "grant_based" && (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-xs text-violet-800">
                          <p className="font-semibold">Grant-Based Policy</p>
                          <p className="mt-0.5">
                            One-time grant (e.g. maternity / special leave). Balance
                            will be credited <strong>when the employee applies</strong> for
                            leave (subject to min/max rules below).
                          </p>
                        </div>

                        {/* WHO GETS THIS GRANT */}
                        <div
                          className={`rounded-xl border p-4 ${
                            hasScope
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-amber-300 bg-amber-50"
                          }`}
                        >
                          <p
                            className={`text-sm font-semibold ${
                              hasScope ? "text-emerald-900" : "text-amber-900"
                            }`}
                          >
                            {hasScope
                              ? `✓ Who gets this grant — scope set (${scopeCount} criteria)`
                              : "⚠️ Who gets this grant — not set yet"}
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              hasScope ? "text-emerald-700" : "text-amber-800"
                            }`}
                          >
                            {hasScope ? (
                              <>
                                Depts: {scope.departments.length || "—"} · Locations:{" "}
                                {scope.locations.length || "—"} · Emp types:{" "}
                                {scope.employment_types.length || "—"} · Specific:{" "}
                                {scope.specific_employees.length || "—"}
                                {formData.applicable_gender !== "all" &&
                                  ` · Gender: ${formData.applicable_gender}`}
                                {Number(formData.min_service_days) > 0 &&
                                  ` · Min service: ${formData.min_service_days} days`}
                              </>
                            ) : (
                              <>
                                Grant tabhi unhi employees ko milega jinhe aap{" "}
                                <strong>Who Gets This?</strong> tab me select karoge.
                              </>
                            )}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab("applicability")}
                            className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            {hasScope ? "Edit who gets this →" : "Set who gets this grant →"}
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <Field
                            label="Grant Size (Total Days)"
                            hint="Days credited when employee applies"
                            required
                          >
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={formData.total_leaves}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, total_leaves: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                          <Field label="Min Days per Grant" hint="Application cannot be shorter">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={formData.grant_min_days}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, grant_min_days: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                          <Field label="Max Days per Grant" hint="Application cannot be longer">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={formData.grant_max_days}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, grant_max_days: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                          <Field
                            label="Reusable After (days)"
                            hint="Gap required after last grant ends. 0 = no restriction"
                          >
                            <input
                              type="number"
                              min="0"
                              value={formData.grant_reusable_after_days}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  grant_reusable_after_days: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                        </div>

                        <Toggle
                          checked={formData.grant_extension_as_lop}
                          onChange={(v) =>
                            setFormData((p) => ({ ...p, grant_extension_as_lop: v }))
                          }
                          label="Extension as LOP"
                          hint="If employee extends beyond remaining grant balance, mark excess as Loss of Pay"
                        />
                      </div>
                    )}

                    {/* ATTENDANCE BASED */}
                    {formData.entitlement_type === "attendance_based" && (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-800">
                          <p className="font-semibold">Attendance-Based Policy</p>
                          <p className="mt-0.5">
                            Leaves are <strong>earned</strong> from attendance. Accrual
                            job runs every period and credits{" "}
                            <strong>present days ÷ earn ratio</strong> (capped at yearly
                            ceiling).
                          </p>
                        </div>

                        {/* WHO GETS THIS */}
                        <div
                          className={`rounded-xl border p-4 ${
                            hasScope
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-amber-300 bg-amber-50"
                          }`}
                        >
                          <p
                            className={`text-sm font-semibold ${
                              hasScope ? "text-emerald-900" : "text-amber-900"
                            }`}
                          >
                            {hasScope
                              ? `✓ Who earns this leave — scope set (${scopeCount} criteria)`
                              : "⚠️ Who earns this leave — not set yet"}
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              hasScope ? "text-emerald-700" : "text-amber-800"
                            }`}
                          >
                            {hasScope ? (
                              <>
                                Depts: {scope.departments.length || "—"} · Locations:{" "}
                                {scope.locations.length || "—"} · Emp types:{" "}
                                {scope.employment_types.length || "—"} · Specific:{" "}
                                {scope.specific_employees.length || "—"}
                                {formData.applicable_gender !== "all" &&
                                  ` · Gender: ${formData.applicable_gender}`}
                                {Number(formData.min_service_days) > 0 &&
                                  ` · Min service: ${formData.min_service_days} days`}
                              </>
                            ) : (
                              <>
                                Sirf selected employees hi is attendance-based leave ko earn
                                karenge. <strong>Who Gets This?</strong> tab me select karo.
                              </>
                            )}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab("applicability")}
                            className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            {hasScope ? "Edit who earns this →" : "Set who earns this leave →"}
                          </button>
                        </div>

                        {/* ATTENDANCE CRITERIA */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="mb-1 text-sm font-semibold text-slate-800">
                            Attendance → Leave earning
                          </p>
                          <p className="mb-3 text-[11px] text-slate-500">
                            Accrual job har period me present days count karega aur ratio
                            ke hisaab se balance credit karega.
                          </p>

                          {/* FORMULA PREVIEW */}
                          <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs text-sky-900">
                            <p className="font-semibold">How it works:</p>
                            <p className="mt-1">
                              <strong>Every {formData.attendance_earn_ratio || 20} present days</strong> →{" "}
                              <strong>1 leave earned</strong>
                            </p>
                            <p className="mt-0.5 text-sky-700">
                              Yearly ceiling: <strong>{formData.total_leaves || 0} days</strong>
                              {" · "}
                              Credit frequency:{" "}
                              <strong className="capitalize">
                                {formData.accrual_type || "monthly"}
                              </strong>
                            </p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Field
                              label="Yearly Ceiling (Total Leaves)"
                              hint="Max days employee can earn in a year"
                              required
                            >
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={formData.total_leaves}
                                onChange={(e) =>
                                  setFormData((p) => ({ ...p, total_leaves: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                              />
                            </Field>
                            <Field
                              label="Earn Ratio"
                              hint="Present days needed for 1 leave"
                              required
                            >
                              <input
                                type="number"
                                step="1"
                                min="1"
                                value={formData.attendance_earn_ratio}
                                onChange={(e) =>
                                  setFormData((p) => ({
                                    ...p,
                                    attendance_earn_ratio: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                              />
                            </Field>
                            <Field
                              label="Accrual Frequency"
                              hint="How often leave is credited"
                              required
                            >
                              <select
                                value={formData.accrual_type}
                                onChange={(e) =>
                                  setFormData((p) => ({ ...p, accrual_type: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                              >
                                {ACCRUAL_TYPES.filter((a) => a.value !== "upfront").map((a) => (
                                  <option key={a.value} value={a.value}>
                                    {a.label}
                                  </option>
                                ))}
                              </select>
                            </Field>
                            <Field
                              label="Per Month Cap"
                              hint="0 = no cap (max earn per period)"
                            >
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={formData.per_month_limit}
                                onChange={(e) =>
                                  setFormData((p) => ({
                                    ...p,
                                    per_month_limit: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                              />
                            </Field>
                          </div>

                          {/* EXAMPLE CALCULATION */}
                          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
                            <p className="font-semibold text-slate-800">Example:</p>
                            <p className="mt-1">
                              If employee was present{" "}
                              <strong>{formData.attendance_earn_ratio || 20} days</strong> in a
                              period → earns{" "}
                              <strong>
                                {((formData.attendance_earn_ratio || 20) / (formData.attendance_earn_ratio || 20)).toFixed(2)}
                              </strong>{" "}
                              leave (capped at ceiling of {formData.total_leaves || 0}/year).
                            </p>
                          </div>

                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <Field
                              label="Min Service Days"
                              hint="Employee must complete these days before earning starts"
                            >
                              <input
                                type="number"
                                min="0"
                                value={formData.min_service_days}
                                onChange={(e) =>
                                  setFormData((p) => ({
                                    ...p,
                                    min_service_days: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                              />
                            </Field>
                            <Field label="Applicable Gender">
                              <select
                                value={formData.applicable_gender}
                                onChange={(e) =>
                                  setFormData((p) => ({
                                    ...p,
                                    applicable_gender: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                              >
                                {GENDERS.map((g) => (
                                  <option key={g.value} value={g.value}>
                                    {g.label}
                                  </option>
                                ))}
                              </select>
                            </Field>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* EXPERIENCE BASED */}
                    {formData.entitlement_type === "experience_based" && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                        <p className="font-semibold">Experience Tiers Required</p>
                        <p className="mt-0.5">
                          Go to <strong>Advanced</strong> tab to define tiers (min service days → annual quota).
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── RULES ─── */}
                {activeTab === "rules" && (
                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Max Applications / Year">
                        <input
                          type="number"
                          min="0"
                          value={formData.max_applications_per_year}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, max_applications_per_year: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                        />
                      </Field>
                      <Field label="Min Leave Count">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={formData.min_leave_count_for_request}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, min_leave_count_for_request: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                        />
                      </Field>
                      <Field label="Min Notice Days">
                        <input
                          type="number"
                          min="0"
                          value={formData.min_notice_days}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, min_notice_days: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                        />
                      </Field>
                      <Field label="Document Required After (days)">
                        <input
                          type="number"
                          min="0"
                          value={formData.document_required_after_days}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, document_required_after_days: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                        />
                      </Field>
                      <Field label="Min Service Days">
                        <input
                          type="number"
                          min="0"
                          value={formData.min_service_days}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, min_service_days: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                        />
                      </Field>
                      <Field label="Max Negative Balance">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={formData.max_negative_balance}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, max_negative_balance: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Toggle
                        checked={formData.mark_excess_as_lop}
                        onChange={(v) => setFormData((p) => ({ ...p, mark_excess_as_lop: v }))}
                        label="Mark Excess as LOP"
                        hint="Beyond balance → Loss of Pay"
                      />
                      <Toggle
                        checked={formData.allow_half_day}
                        onChange={(v) => setFormData((p) => ({ ...p, allow_half_day: v }))}
                        label="Allow Half Day"
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-slate-800">
                        Carry Forward
                      </p>
                      <Toggle
                        checked={formData.carry_forward_allowed}
                        onChange={(v) => setFormData((p) => ({ ...p, carry_forward_allowed: v }))}
                        label="Allow Carry Forward"
                      />
                      {formData.carry_forward_allowed && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <Field label="Carry Forward Max Days">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={formData.carry_forward_max}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, carry_forward_max: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                          <Field label="Expiry (months)">
                            <input
                              type="number"
                              min="0"
                              value={formData.carry_forward_expiry_months}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, carry_forward_expiry_months: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-slate-800">
                        Encashment
                      </p>
                      <Toggle
                        checked={formData.encashment_allowed}
                        onChange={(v) => setFormData((p) => ({ ...p, encashment_allowed: v }))}
                        label="Allow Encashment"
                      />
                      {formData.encashment_allowed && (
                        <div className="mt-3">
                          <Field label="Encashment Max Days">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={formData.encashment_max_days}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, encashment_max_days: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── ADVANCED ─── */}
                {activeTab === "advanced" && (
                  <div className="space-y-5">
                    <Field label="Applicable Gender">
                      <div className="grid gap-2 sm:grid-cols-3">
                        {GENDERS.map((g) => {
                          const active = formData.applicable_gender === g.value;
                          return (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() =>
                                setFormData((p) => ({ ...p, applicable_gender: g.value }))
                              }
                              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                                active
                                  ? "border-[#E42527] bg-red-50 text-[#E42527]"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {g.label}
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-slate-800">
                        Sandwich Rule
                      </p>
                      <p className="mb-3 text-xs text-slate-500">
                        If employee takes leave on Friday and Monday, weekend counts as leave
                      </p>
                      <Toggle
                        checked={formData.sandwich_enabled}
                        onChange={(v) => setFormData((p) => ({ ...p, sandwich_enabled: v }))}
                        label="Enable Sandwich Rule"
                      />
                      {formData.sandwich_enabled && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <Field label="Sandwich Limit Days">
                            <input
                              type="number"
                              min="0"
                              value={formData.sandwich_limit_days}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, sandwich_limit_days: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            />
                          </Field>
                          <Field label="Weekends Mode">
                            <select
                              value={formData.sandwich_weekends_mode}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, sandwich_weekends_mode: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            >
                              {SANDWICH_MODES.map((m) => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Holidays Mode">
                            <select
                              value={formData.sandwich_holidays_mode}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, sandwich_holidays_mode: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                            >
                              {SANDWICH_MODES.map((m) => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      )}
                    </div>

                    {formData.entitlement_type === "experience_based" && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              Experience Tiers
                            </p>
                            <p className="text-xs text-slate-500">
                              Different quotas based on years of service
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTiers((p) => [...p, { ...EMPTY_TIER }])}
                            className="rounded-lg border border-[#E42527] bg-white px-3 py-1.5 text-xs font-medium text-[#E42527] hover:bg-red-50"
                          >
                            + Add Tier
                          </button>
                        </div>

                        <div className="space-y-3">
                          {tiers.map((tier, index) => (
                            <div
                              key={tier.tier_id || `new-${index}`}
                              className="grid grid-cols-1 gap-3 rounded-lg bg-white p-3 sm:grid-cols-4"
                            >
                              <Field label="Min Service Days">
                                <input
                                  type="number"
                                  min="0"
                                  value={tier.min_service_days}
                                  onChange={(e) =>
                                    setTiers((prev) => {
                                      const next = [...prev];
                                      next[index] = { ...next[index], min_service_days: e.target.value };
                                      return next;
                                    })
                                  }
                                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
                                />
                              </Field>
                              <Field label="Annual Quota">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={tier.annual_quota}
                                  onChange={(e) =>
                                    setTiers((prev) => {
                                      const next = [...prev];
                                      next[index] = { ...next[index], annual_quota: e.target.value };
                                      return next;
                                    })
                                  }
                                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
                                />
                              </Field>
                              <Field label="Sort Order">
                                <input
                                  type="number"
                                  min="0"
                                  value={tier.sort_order}
                                  onChange={(e) =>
                                    setTiers((prev) => {
                                      const next = [...prev];
                                      next[index] = { ...next[index], sort_order: e.target.value };
                                      return next;
                                    })
                                  }
                                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
                                />
                              </Field>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setTiers((p) => (p.length > 1 ? p.filter((_, i) => i !== index) : p))
                                  }
                                  disabled={tiers.length <= 1}
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
                  </div>
                )}

                {/* ─── APPLICABILITY ─── */}
                {activeTab === "applicability" && (
                  <div className="space-y-5">
                    <div
                      className={`rounded-xl border p-4 ${
                        hasScope
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-amber-300 bg-amber-50"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          hasScope ? "text-emerald-900" : "text-amber-900"
                        }`}
                      >
                        {hasScope
                          ? `✓ Scope defined (${scopeCount} criteria)`
                          : "⚠️ No scope selected"}
                      </p>
                      <p
                        className={`mt-0.5 text-xs ${
                          hasScope ? "text-emerald-700" : "text-amber-800"
                        }`}
                      >
                        {hasScope
                          ? "This policy will apply only to selected employees"
                          : "This policy will apply to ALL employees. Select at least one criteria."}
                      </p>
                    </div>

                    <MultiChipSelect
                      label="Departments"
                      icon="🏢"
                      options={departments.map((d) => ({
                        id: d.department_id,
                        name: d.department_name,
                      }))}
                      value={scope.departments}
                      onChange={(v) => setScope((p) => ({ ...p, departments: v }))}
                      placeholder="No departments found"
                    />

                    <MultiChipSelect
                      label="Locations"
                      icon="📍"
                      options={locations.map((l) => ({
                        id: l.location_id,
                        name: l.location_name,
                      }))}
                      value={scope.locations}
                      onChange={(v) => setScope((p) => ({ ...p, locations: v }))}
                      placeholder="No locations found"
                    />

                    <MultiChipSelect
                      label="Employment Types"
                      icon="💼"
                      options={employmentTypes.map((e) => ({
                        id: e.employment_type_id,
                        name: e.name,
                      }))}
                      value={scope.employment_types}
                      onChange={(v) => setScope((p) => ({ ...p, employment_types: v }))}
                      placeholder="No employment types found"
                    />

                    {/* SPECIFIC EMPLOYEES */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-base">👤</span>
                        <p className="text-sm font-semibold text-slate-800">
                          Specific Employees (optional)
                        </p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {scope.specific_employees.length}
                        </span>
                      </div>
                      <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-100">
                        {employees.length === 0 ? (
                          <p className="p-3 text-xs text-slate-400">
                            No employees loaded
                          </p>
                        ) : (
                          employees.map((e) => {
                            const eid = e.employee_id;
                            const active = scope.specific_employees.includes(eid);
                            return (
                              <label
                                key={eid}
                                className={`flex cursor-pointer items-center gap-2 border-b border-slate-100 px-3 py-2 last:border-b-0 hover:bg-slate-50 ${
                                  active ? "bg-red-50/40" : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={active}
                                  onChange={() =>
                                    setScope((p) => ({
                                      ...p,
                                      specific_employees: active
                                        ? p.specific_employees.filter((x) => x !== eid)
                                        : [...p.specific_employees, eid],
                                    }))
                                  }
                                  className="h-3.5 w-3.5 rounded border-slate-300 accent-[#E42527]"
                                />
                                <span className="text-xs font-medium text-slate-700">
                                  {e.name || `${e.first_name || ""} ${e.last_name || ""}`.trim()}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* PREVIEW + OVERLAP ACTIONS */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={previewEligibility}
                        disabled={previewLoading}
                        className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                      >
                        {previewLoading ? "Loading..." : "👁 Preview Eligible"}
                      </button>
                      <button
                        type="button"
                        onClick={checkOverlap}
                        disabled={overlapLoading}
                        className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                      >
                        {overlapLoading ? "Checking..." : "⚠ Check Overlap"}
                      </button>
                    </div>

                    {/* PREVIEW RESULT */}
                    {preview && (
                      <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-sky-900 tabular-nums">
                            {preview.eligible}
                          </p>
                          <p className="text-xs text-slate-500">
                            of {preview.total_employees} employees
                          </p>
                        </div>
                        {preview.warning && (
                          <p className="mt-2 rounded-md bg-amber-100 px-2 py-1.5 text-[11px] text-amber-800">
                            {preview.warning}
                          </p>
                        )}
                        {preview.sample && preview.sample.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[10px] font-semibold uppercase text-slate-400">
                              Sample eligible
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {preview.sample.map((s, i) => (
                                <span
                                  key={i}
                                  className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-800"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* OVERLAP RESULT */}
                    {overlap?.has_conflicts && (
                      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-900">
                          ⚠️ Overlapping Policies Detected
                        </p>
                        <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
                          {overlap.conflicts.map((c) => (
                            <li key={c.policy_id}>
                              <strong>{c.policy_name}</strong> ({c.effective_from} → {c.effective_to || "No expiry"})
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-[11px] text-amber-700">
                          The most recently created policy will be picked if multiple match.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <div className="text-xs text-slate-500">
                  {TABS.findIndex((t) => t.id === activeTab) + 1} / {TABS.length}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editId ? "Update Policy" : "Create Policy"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════ DETAILS MODAL ═══════════════════ */}
      {selectedPolicy && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setSelectedPolicy(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Policy details
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedPolicy.policy_name}
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

            <div className="max-h-[60vh] space-y-2 overflow-y-auto px-5 py-4">
              {[
                ["Leave Type", leaveTypeMap[String(selectedPolicy.leave_type_id)] || "—"],
                ["Entitlement", selectedPolicy.entitlement_type?.replace(/_/g, " ")],
                ["Total Leaves", selectedPolicy.total_leaves],
                ...(selectedPolicy.entitlement_type === "attendance_based"
                  ? [
                      ["Earn Ratio", `Every ${selectedPolicy.attendance_earn_ratio ?? 20} present days = 1 leave`],
                    ]
                  : []),
                ...(selectedPolicy.entitlement_type !== "grant_based"
                  ? [["Accrual", selectedPolicy.accrual_type]]
                  : []),
                ...(selectedPolicy.entitlement_type === "grant_based"
                  ? [
                      ["Grant Min Days", selectedPolicy.grant_min_days],
                      ["Grant Max Days", selectedPolicy.grant_max_days],
                      ["Reusable After (days)", selectedPolicy.grant_reusable_after_days],
                      [
                        "Extension as LOP",
                        selectedPolicy.grant_extension_as_lop ? "Yes" : "No",
                      ],
                    ]
                  : []),
                ["Gender", selectedPolicy.applicable_gender],
                [
                  "Effective",
                  `${selectedPolicy.effective_from || "—"} → ${selectedPolicy.effective_to || "No expiry"}`,
                ],
                ["Status", selectedPolicy.is_active ? "Active" : "Inactive"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="text-xs text-slate-500">{k}</span>
                  <span className="text-sm font-semibold capitalize text-slate-800">
                    {v ?? "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
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
                  const p = selectedPolicy;
                  setSelectedPolicy(null);
                  openEdit(p);
                }}
                className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}