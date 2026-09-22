

// // // // "use client";

// // // // import { useCallback, useEffect, useState } from "react";
// // // // import { api } from "@/lib/api";

// // // // const initialForm = {
// // // //   leave_policy_id: "",
// // // //   min_service_days: 0,
// // // //   annual_quota: 0,
// // // //   sort_order: 0,
// // // // };

// // // // const formatApiError = (err) => {
// // // //   const detail = err?.response?.data?.detail;
// // // //   if (Array.isArray(detail)) {
// // // //     return detail
// // // //       .map((e) =>
// // // //         Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
// // // //       )
// // // //       .join(" • ");
// // // //   }
// // // //   if (typeof detail === "string") return detail;
// // // //   return err?.message || "Something went wrong";
// // // // };

// // // // const getItems = (response) => {
// // // //   const data = response?.data?.data ?? response?.data ?? [];
// // // //   if (Array.isArray(data)) return data;
// // // //   return (
// // // //     data?.items ??
// // // //     data?.results ??
// // // //     data?.policies ??
// // // //     data?.experience_tiers ??
// // // //     data?.tiers ??
// // // //     response?.data?.policies ??
// // // //     []
// // // //   );
// // // // };

// // // // const getPolicyId = (policy) =>
// // // //   policy.leave_policy_id || policy.policy_id || policy.id || policy._id;

// // // // const getPolicyName = (policy) =>
// // // //   policy.policy_name || policy.name || getPolicyId(policy);

// // // // export default function LeavePolicyExperienceTiersPage() {
// // // //   const [list, setList] = useState([]);
// // // //   const [formData, setFormData] = useState(initialForm);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [error, setError] = useState("");
// // // //   const [showForm, setShowForm] = useState(false);
// // // //   const [editId, setEditId] = useState(null);
// // // //   const [search, setSearch] = useState("");
// // // //   const [page, setPage] = useState(1);
// // // //   const [pageSize] = useState(10);
// // // //   const [total, setTotal] = useState(0);
// // // //   const [leavePolicyId, setLeavePolicyId] = useState("");
// // // //   const [leavePolicies, setLeavePolicies] = useState([]);

// // // //   // Only experience_based policies
// // // //   const experiencePolicies = leavePolicies.filter(
// // // //     (p) =>
// // // //       String(p.entitlement_type || "").toLowerCase() === "experience_based"
// // // //   );

// // // //   const selectedPolicy = experiencePolicies.find(
// // // //     (p) => String(getPolicyId(p)) === String(leavePolicyId)
// // // //   );

// // // //   // Load all policies
// // // //   useEffect(() => {
// // // //     const fetchPolicies = async () => {
// // // //       try {
// // // //         const response = await api.get("/api/v1/leave/policies", {
// // // //           params: { page: 1, page_size: 200 },
// // // //         });
// // // //         const policies = getItems(response);
// // // //         setLeavePolicies(Array.isArray(policies) ? policies : []);

// // // //         // Auto select first experience_based policy
// // // //         const expPolicies = (policies || []).filter(
// // // //           (p) =>
// // // //             String(p.entitlement_type || "").toLowerCase() === "experience_based"
// // // //         );
// // // //         if (!leavePolicyId && expPolicies.length > 0) {
// // // //           setLeavePolicyId(String(getPolicyId(expPolicies[0])));
// // // //         }
// // // //       } catch (err) {
// // // //         setError(formatApiError(err));
// // // //         setLeavePolicies([]);
// // // //       }
// // // //     };
// // // //     fetchPolicies();
// // // //   }, []);

// // // //   const fetchData = useCallback(async () => {
// // // //     if (!leavePolicyId) {
// // // //       setList([]);
// // // //       setTotal(0);
// // // //       setLoading(false);
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setError("");
// // // //     try {
// // // //       const res = await api.get(
// // // //         `/api/v1/experience/leave/policies/${leavePolicyId}/tiers`,
// // // //         {
// // // //           params: { page, page_size: pageSize, search },
// // // //         }
// // // //       );

// // // //       const data = res.data?.data ?? res.data ?? [];
// // // //       const items = Array.isArray(data)
// // // //         ? data
// // // //         : data?.items ??
// // // //           data?.results ??
// // // //           data?.tiers ??
// // // //           data?.experience_tiers ??
// // // //           [];

// // // //       setList(items);
// // // //       setTotal(
// // // //         res.data?.total ??
// // // //           res.data?.count ??
// // // //           data?.total ??
// // // //           items.length
// // // //       );
// // // //     } catch (err) {
// // // //       setError(formatApiError(err));
// // // //       setList([]);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }, [leavePolicyId, page, pageSize, search]);

// // // //   useEffect(() => {
// // // //     const t = setTimeout(() => fetchData(), 0);
// // // //     return () => clearTimeout(t);
// // // //   }, [fetchData]);

// // // //   const handleChange = (field, value) => {
// // // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const openAdd = () => {
// // // //     if (!leavePolicyId || !selectedPolicy) return;
// // // //     setEditId(null);
// // // //     setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
// // // //     setError("");
// // // //     setShowForm(true);
// // // //   };

// // // //   const openEdit = (item) => {
// // // //     setEditId(item.tier_id || item.id || item.experience_tier_id);
// // // //     setFormData({
// // // //       ...initialForm,
// // // //       leave_policy_id: leavePolicyId,
// // // //       min_service_days: item.min_service_days ?? 0,
// // // //       annual_quota: item.annual_quota ?? 0,
// // // //       sort_order: item.sort_order ?? 0,
// // // //     });
// // // //     setError("");
// // // //     setShowForm(true);
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setSaving(true);
// // // //     setError("");
// // // //     try {
// // // //       const payload = {
// // // //         leave_policy_id: leavePolicyId || formData.leave_policy_id,
// // // //         min_service_days: Number(formData.min_service_days) || 0,
// // // //         annual_quota: Number(formData.annual_quota) || 0,
// // // //         sort_order: Number(formData.sort_order) || 0,
// // // //       };

// // // //       if (editId) {
// // // //         await api.put(
// // // //           `/api/v1/experience/leave/policies/tiers/${editId}`,
// // // //           payload
// // // //         );
// // // //       } else {
// // // //         await api.post("/api/v1/experience/leave/policies/tiers", payload);
// // // //       }

// // // //       setShowForm(false);
// // // //       setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
// // // //       setEditId(null);
// // // //       await fetchData();
// // // //     } catch (err) {
// // // //       setError(formatApiError(err));
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const totalPages = Math.ceil(total / pageSize) || 1;

// // // //   return (
// // // //     <div>
// // // //       {/* Header */}
// // // //       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// // // //         <div>
// // // //           <h1 className="text-xl font-semibold text-slate-800">
// // // //             Experience Tiers
// // // //           </h1>
// // // //           <p className="mt-0.5 text-sm text-slate-500">
// // // //             Configure experience-based leave quota tiers (only for Experience Based policies)
// // // //           </p>
// // // //         </div>
// // // //         <button
// // // //           onClick={openAdd}
// // // //           disabled={!leavePolicyId || !selectedPolicy}
// // // //           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
// // // //         >
// // // //           + Add Tier
// // // //         </button>
// // // //       </div>

// // // //       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// // // //         {/* Toolbar */}
// // // //         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
// // // //           <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
// // // //             <select
// // // //               value={leavePolicyId}
// // // //               onChange={(e) => {
// // // //                 setLeavePolicyId(e.target.value);
// // // //                 setPage(1);
// // // //               }}
// // // //               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
// // // //             >
// // // //               <option value="">Select Experience Based Policy</option>
// // // //               {experiencePolicies.map((policy) => {
// // // //                 const id = getPolicyId(policy);
// // // //                 return id ? (
// // // //                   <option key={id} value={String(id)}>
// // // //                     {getPolicyName(policy)}
// // // //                   </option>
// // // //                 ) : null;
// // // //               })}
// // // //             </select>

// // // //             <input
// // // //               value={search}
// // // //               onChange={(e) => {
// // // //                 setSearch(e.target.value);
// // // //                 setPage(1);
// // // //               }}
// // // //               placeholder="Search tiers..."
// // // //               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
// // // //             />
// // // //           </div>
// // // //           <span className="text-sm text-slate-500">{total} tiers</span>
// // // //         </div>

// // // //         {/* Warning if no experience based policy */}
// // // //         {experiencePolicies.length === 0 && !loading && (
// // // //           <div className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
// // // //             No Experience Based policies found. Please create a Leave Policy with Entitlement Type = “Experience based” first.
// // // //           </div>
// // // //         )}

// // // //         {error && !showForm && (
// // // //           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         {/* Table */}
// // // //         <div className="overflow-x-auto">
// // // //           {loading ? (
// // // //             <div className="py-20 text-center text-sm text-slate-500">
// // // //               Loading...
// // // //             </div>
// // // //           ) : !leavePolicyId ? (
// // // //             <div className="py-20 text-center text-sm text-slate-500">
// // // //               Please select an Experience Based policy
// // // //             </div>
// // // //           ) : list.length === 0 ? (
// // // //             <div className="py-20 text-center text-sm text-slate-500">
// // // //               No tiers found for this policy
// // // //             </div>
// // // //           ) : (
// // // //             <table className="w-full text-left text-sm">
// // // //               <thead>
// // // //                 <tr className="border-b border-slate-100 bg-slate-50/80">
// // // //                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
// // // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // // //                     Leave Policy
// // // //                   </th>
// // // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // // //                     Min Service (Days)
// // // //                   </th>
// // // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // // //                     Annual Quota
// // // //                   </th>
// // // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // // //                     Sort Order
// // // //                   </th>
// // // //                   <th className="px-5 py-3 font-medium text-slate-500 text-right">
// // // //                     Actions
// // // //                   </th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="divide-y divide-slate-50">
// // // //                 {list.map((item, i) => (
// // // //                   <tr
// // // //                     key={item.tier_id || item.id || item.experience_tier_id || i}
// // // //                     className="hover:bg-slate-50/70"
// // // //                   >
// // // //                     <td className="px-5 py-3.5 text-slate-500">
// // // //                       {(page - 1) * pageSize + i + 1}
// // // //                     </td>
// // // //                     <td className="px-5 py-3.5 font-medium text-slate-800">
// // // //                       {getPolicyName(selectedPolicy) || "—"}
// // // //                     </td>
// // // //                     <td className="px-5 py-3.5 font-medium text-slate-800">
// // // //                       {item.min_service_days ?? "—"}
// // // //                     </td>
// // // //                     <td className="px-5 py-3.5 text-slate-600">
// // // //                       {item.annual_quota ?? "—"}
// // // //                     </td>
// // // //                     <td className="px-5 py-3.5 text-slate-600">
// // // //                       {item.sort_order ?? "—"}
// // // //                     </td>
// // // //                     <td className="px-5 py-3.5 text-right">
// // // //                       <button
// // // //                         onClick={() => openEdit(item)}
// // // //                         className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
// // // //                       >
// // // //                         Edit
// // // //                       </button>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           )}
// // // //         </div>

// // // //         {/* Pagination */}
// // // //         {totalPages > 1 && (
// // // //           <div className="flex justify-between border-t border-slate-100 px-4 py-3">
// // // //             <span className="text-sm text-slate-500">
// // // //               Page {page} of {totalPages}
// // // //             </span>
// // // //             <div className="flex gap-2">
// // // //               <button
// // // //                 disabled={page <= 1}
// // // //                 onClick={() => setPage((p) => p - 1)}
// // // //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// // // //               >
// // // //                 Prev
// // // //               </button>
// // // //               <button
// // // //                 disabled={page >= totalPages}
// // // //                 onClick={() => setPage((p) => p + 1)}
// // // //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// // // //               >
// // // //                 Next
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Modal */}
// // // //       {showForm && (
// // // //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
// // // //           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
// // // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // // //               <h2 className="text-base font-semibold text-slate-800">
// // // //                 {editId ? "Edit Experience Tier" : "Add Experience Tier"}
// // // //               </h2>
// // // //               <button
// // // //                 onClick={() => {
// // // //                   setShowForm(false);
// // // //                   setError("");
// // // //                 }}
// // // //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// // // //               >
// // // //                 ✕
// // // //               </button>
// // // //             </div>

// // // //             <form onSubmit={handleSubmit}>
// // // //               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
// // // //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// // // //                   <div>
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Leave Policy *
// // // //                     </label>
// // // //                     <select
// // // //                       required
// // // //                       value={leavePolicyId}
// // // //                       onChange={(e) => {
// // // //                         setLeavePolicyId(e.target.value);
// // // //                         handleChange("leave_policy_id", e.target.value);
// // // //                       }}
// // // //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                     >
// // // //                       <option value="">Select policy</option>
// // // //                       {experiencePolicies.map((policy) => {
// // // //                         const id = getPolicyId(policy);
// // // //                         return id ? (
// // // //                           <option key={id} value={String(id)}>
// // // //                             {getPolicyName(policy)}
// // // //                           </option>
// // // //                         ) : null;
// // // //                       })}
// // // //                     </select>
// // // //                   </div>

// // // //                   <div>
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Min Service (Days) *
// // // //                     </label>
// // // //                     <input
// // // //                       required
// // // //                       type="number"
// // // //                       min="0"
// // // //                       value={formData.min_service_days}
// // // //                       onChange={(e) =>
// // // //                         handleChange("min_service_days", e.target.value)
// // // //                       }
// // // //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                     />
// // // //                   </div>

// // // //                   <div>
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Annual Quota *
// // // //                     </label>
// // // //                     <input
// // // //                       required
// // // //                       type="number"
// // // //                       min="0"
// // // //                       value={formData.annual_quota}
// // // //                       onChange={(e) =>
// // // //                         handleChange("annual_quota", e.target.value)
// // // //                       }
// // // //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                     />
// // // //                   </div>

// // // //                   <div>
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Sort Order *
// // // //                     </label>
// // // //                     <input
// // // //                       required
// // // //                       type="number"
// // // //                       min="0"
// // // //                       value={formData.sort_order}
// // // //                       onChange={(e) =>
// // // //                         handleChange("sort_order", e.target.value)
// // // //                       }
// // // //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                     />
// // // //                   </div>
// // // //                 </div>

// // // //                 {error && (
// // // //                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// // // //                     {error}
// // // //                   </div>
// // // //                 )}
// // // //               </div>

// // // //               <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => setShowForm(false)}
// // // //                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //                 <button
// // // //                   type="submit"
// // // //                   disabled={saving}
// // // //                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // // //                 >
// // // //                   {saving ? "Saving..." : editId ? "Update" : "Submit"}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // //  new code 


// // // "use client";

// // // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // // // ⚠️ VERIFY: all other pages use "@/app/lib/api" — confirm which is correct
// // // import { api } from "@/lib/api";
// // // import { useAuthStore } from "@/app/store/authStore";

// // // /* ------------------------------------------------------------------ */
// // // /*  CONSTANTS                                                          */
// // // /* ------------------------------------------------------------------ */

// // // const HR_ROLES = new Set([
// // //   "hr",
// // //   "hr_manager",
// // //   "hr-manager",
// // //   "admin",
// // //   "super_admin",
// // //   "super-admin",
// // //   "superadmin",
// // //   "owner",
// // //   "payroll_officer",
// // //   "payroll-officer",
// // // ]);

// // // const initialForm = {
// // //   leave_policy_id: "",
// // //   min_service_days: 0,
// // //   annual_quota: 0,
// // //   sort_order: 0,
// // // };

// // // const MAX_SERVICE_DAYS = 36500; // ~100 years
// // // const MAX_ANNUAL_QUOTA = 365;

// // // /* ------------------------------------------------------------------ */
// // // /*  HELPERS                                                            */
// // // /* ------------------------------------------------------------------ */

// // // const formatApiError = (err) => {
// // //   const detail = err?.response?.data?.detail;
// // //   if (Array.isArray(detail)) {
// // //     return detail
// // //       .map((e) =>
// // //         Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
// // //       )
// // //       .join(" • ");
// // //   }
// // //   if (typeof detail === "string") return detail;
// // //   if (err?.response?.data?.message) return err.response.data.message;
// // //   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
// // //   if (err?.response?.status === 401) return "Session expired. Please login again.";
// // //   if (err?.response?.status === 403) return "You don't have permission for this action.";
// // //   if (err?.response?.status === 409) return "A tier with these values already exists.";
// // //   return err?.message || "Something went wrong";
// // // };

// // // const isCancel = (err) =>
// // //   err?.name === "CanceledError" ||
// // //   err?.code === "ERR_CANCELED" ||
// // //   err?.name === "AbortError";

// // // const pickList = (response) => {
// // //   const data = response?.data?.data ?? response?.data ?? [];
// // //   if (Array.isArray(data)) return data;
// // //   return (
// // //     data?.items ??
// // //     data?.results ??
// // //     data?.policies ??
// // //     data?.leave_policies ??
// // //     data?.tiers ??
// // //     data?.experience_tiers ??
// // //     []
// // //   );
// // // };

// // // const hasHrAccess = (user) => {
// // //   if (!user) return false;
// // //   const roles = [
// // //     user.role,
// // //     ...(Array.isArray(user.roles) ? user.roles : []),
// // //     ...(Array.isArray(user.user_roles) ? user.user_roles : []),
// // //   ]
// // //     .filter(Boolean)
// // //     .map((r) =>
// // //       String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
// // //         .toLowerCase()
// // //         .trim()
// // //     );
// // //   return roles.some((r) => HR_ROLES.has(r));
// // // };

// // // const getPolicyId = (p) =>
// // //   p?.leave_policy_id ?? p?.policy_id ?? p?.id ?? p?._id ?? "";
// // // const getPolicyName = (p) =>
// // //   p?.policy_name ?? p?.leave_policy_name ?? p?.name ?? getPolicyId(p);

// // // const getTierId = (t) =>
// // //   t?.tier_id ??
// // //   t?.experience_tier_id ??
// // //   t?.policy_tier_id ??
// // //   t?.id ??
// // //   null;

// // // /** Case-insensitive, separator-agnostic match for "experience_based" */
// // // const normalizeEntitlement = (v) =>
// // //   String(v || "")
// // //     .toLowerCase()
// // //     .replace(/[\s_-]+/g, "");

// // // const isExperienceBased = (policy) =>
// // //   normalizeEntitlement(policy?.entitlement_type) === "experiencebased";

// // // /* ------------------------------------------------------------------ */
// // // /*  COMPONENT                                                          */
// // // /* ------------------------------------------------------------------ */

// // // export default function LeavePolicyExperienceTiersPage() {
// // //   const user = useAuthStore((state) => state.user);
// // //   const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

// // //   const [list, setList] = useState([]);
// // //   const [formData, setFormData] = useState(initialForm);
// // //   const [leavePolicies, setLeavePolicies] = useState([]);
// // //   const [leavePolicyId, setLeavePolicyId] = useState("");

// // //   const [loading, setLoading] = useState(false);
// // //   const [optionsLoading, setOptionsLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [deleting, setDeleting] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [formError, setFormError] = useState("");
// // //   const [success, setSuccess] = useState("");

// // //   const [showForm, setShowForm] = useState(false);
// // //   const [editId, setEditId] = useState(null);
// // //   const [searchInput, setSearchInput] = useState("");
// // //   const [search, setSearch] = useState("");
// // //   const [page, setPage] = useState(1);
// // //   const [pageSize] = useState(10);
// // //   const [total, setTotal] = useState(0);

// // //   const [details, setDetails] = useState(null);
// // //   const [confirmDelete, setConfirmDelete] = useState(null);

// // //   const abortRef = useRef(null);

// // //   /* ---------- experience-based policies ---------- */
// // //   const experiencePolicies = useMemo(
// // //     () => leavePolicies.filter(isExperienceBased),
// // //     [leavePolicies]
// // //   );

// // //   const selectedPolicy = useMemo(
// // //     () =>
// // //       experiencePolicies.find(
// // //         (p) => String(getPolicyId(p)) === String(leavePolicyId)
// // //       ),
// // //     [experiencePolicies, leavePolicyId]
// // //   );

// // //   /* ---------- load policies ---------- */
// // //   useEffect(() => {
// // //     let cancelled = false;
// // //     setOptionsLoading(true);

// // //     api
// // //       .get("/api/v1/leave/policies", { params: { page: 1, page_size: 200 } })
// // //       .then((res) => {
// // //         if (cancelled) return;
// // //         const policies = pickList(res);
// // //         setLeavePolicies(Array.isArray(policies) ? policies : []);

// // //         const exp = (policies || []).filter(isExperienceBased);
// // //         if (exp.length > 0) {
// // //           setLeavePolicyId((prev) => prev || String(getPolicyId(exp[0])));
// // //         }
// // //       })
// // //       .catch((err) => {
// // //         if (!cancelled) setError(formatApiError(err));
// // //       })
// // //       .finally(() => {
// // //         if (!cancelled) setOptionsLoading(false);
// // //       });

// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, []);

// // //   /* ---------- debounce search ---------- */
// // //   useEffect(() => {
// // //     const t = setTimeout(() => {
// // //       setSearch(searchInput.trim());
// // //       setPage(1);
// // //     }, 400);
// // //     return () => clearTimeout(t);
// // //   }, [searchInput]);

// // //   /* ---------- reset page on policy change ---------- */
// // //   useEffect(() => {
// // //     setPage(1);
// // //   }, [leavePolicyId]);

// // //   /* ---------- auto-dismiss success ---------- */
// // //   useEffect(() => {
// // //     if (!success) return;
// // //     const t = setTimeout(() => setSuccess(""), 4000);
// // //     return () => clearTimeout(t);
// // //   }, [success]);

// // //   /* ---------- fetch tiers ---------- */
// // //   const fetchData = useCallback(async () => {
// // //     if (!leavePolicyId) {
// // //       setList([]);
// // //       setTotal(0);
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     if (abortRef.current) abortRef.current.abort();
// // //     const controller = new AbortController();
// // //     abortRef.current = controller;

// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api.get(
// // //         `/api/v1/experience/leave/policies/${leavePolicyId}/tiers`,
// // //         {
// // //           params: {
// // //             page,
// // //             page_size: pageSize,
// // //             ...(search ? { search } : {}),
// // //           },
// // //           signal: controller.signal,
// // //         }
// // //       );

// // //       const payload = res.data?.data ?? res.data ?? {};
// // //       const items = Array.isArray(payload)
// // //         ? payload
// // //         : payload?.items ??
// // //           payload?.results ??
// // //           payload?.tiers ??
// // //           payload?.experience_tiers ??
// // //           [];

// // //       const safeItems = Array.isArray(items) ? items : [];
// // //       setList(safeItems);
// // //       setTotal(
// // //         res.data?.total ??
// // //           res.data?.count ??
// // //           payload?.total ??
// // //           safeItems.length
// // //       );
// // //     } catch (err) {
// // //       if (isCancel(err)) return;
// // //       setError(formatApiError(err));
// // //       setList([]);
// // //       setTotal(0);
// // //     } finally {
// // //       if (!controller.signal.aborted) setLoading(false);
// // //     }
// // //   }, [leavePolicyId, page, pageSize, search]);

// // //   useEffect(() => {
// // //     fetchData();
// // //     return () => {
// // //       if (abortRef.current) abortRef.current.abort();
// // //     };
// // //   }, [fetchData]);

// // //   /* ---------- existing tiers (for validation) ---------- */
// // //   const existingMinDays = useMemo(() => {
// // //     const m = new Map(); // minDays -> tierId
// // //     list.forEach((t) => {
// // //       const days = Number(t.min_service_days);
// // //       if (Number.isFinite(days)) {
// // //         m.set(days, getTierId(t));
// // //       }
// // //     });
// // //     return m;
// // //   }, [list]);

// // //   /* ---------- derived: sorted list (display only) ---------- */
// // //   const displayList = useMemo(() => {
// // //     // backend may or may not sort; ensure monotonic display
// // //     return [...list].sort(
// // //       (a, b) =>
// // //         Number(a.min_service_days ?? 0) - Number(b.min_service_days ?? 0)
// // //     );
// // //   }, [list]);

// // //   /* ---------- form handlers ---------- */
// // //   const handleChange = (field, value) => {
// // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // //   };

// // //   const openAdd = () => {
// // //     if (!leavePolicyId) {
// // //       setError("Please select an Experience Based policy first.");
// // //       return;
// // //     }
// // //     setEditId(null);
// // //     setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
// // //     setFormError("");
// // //     setError("");
// // //     setShowForm(true);
// // //   };

// // //   const openEdit = (item) => {
// // //     setEditId(getTierId(item));
// // //     setFormData({
// // //       ...initialForm,
// // //       leave_policy_id: leavePolicyId,
// // //       min_service_days: item.min_service_days ?? 0,
// // //       annual_quota: item.annual_quota ?? 0,
// // //       sort_order: item.sort_order ?? 0,
// // //     });
// // //     setFormError("");
// // //     setError("");
// // //     setShowForm(true);
// // //   };

// // //   const closeForm = () => {
// // //     if (saving) return;
// // //     setShowForm(false);
// // //     setFormError("");
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (saving) return;

// // //     const minDays = Number(formData.min_service_days);
// // //     const quota = Number(formData.annual_quota);
// // //     const sortOrder = Number(formData.sort_order);

// // //     if (!Number.isFinite(minDays) || minDays < 0 || minDays > MAX_SERVICE_DAYS) {
// // //       setFormError(`Min Service must be between 0 and ${MAX_SERVICE_DAYS}.`);
// // //       return;
// // //     }
// // //     if (!Number.isInteger(minDays)) {
// // //       setFormError("Min Service Days must be a whole number.");
// // //       return;
// // //     }
// // //     if (!Number.isFinite(quota) || quota < 0 || quota > MAX_ANNUAL_QUOTA) {
// // //       setFormError(`Annual Quota must be between 0 and ${MAX_ANNUAL_QUOTA}.`);
// // //       return;
// // //     }
// // //     if (!Number.isFinite(sortOrder) || sortOrder < 0) {
// // //       setFormError("Sort Order must be 0 or greater.");
// // //       return;
// // //     }

// // //     // duplicate min_service_days check (skip current edit row)
// // //     const existingTierForDays = existingMinDays.get(minDays);
// // //     if (existingTierForDays && String(existingTierForDays) !== String(editId)) {
// // //       setFormError(
// // //         `A tier with Min Service Days = ${minDays} already exists for this policy.`
// // //       );
// // //       return;
// // //     }

// // //     setSaving(true);
// // //     setFormError("");
// // //     setError("");
// // //     try {
// // //       const payload = {
// // //         leave_policy_id: leavePolicyId,
// // //         min_service_days: minDays,
// // //         annual_quota: quota,
// // //         sort_order: sortOrder,
// // //       };

// // //       if (editId) {
// // //         await api.put(
// // //           `/api/v1/experience/leave/policies/tiers/${editId}`,
// // //           payload
// // //         );
// // //       } else {
// // //         await api.post("/api/v1/experience/leave/policies/tiers", payload);
// // //       }

// // //       setSuccess(editId ? "Tier updated successfully." : "Tier added successfully.");
// // //       setShowForm(false);
// // //       setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
// // //       setEditId(null);
// // //       await fetchData();
// // //     } catch (err) {
// // //       setFormError(formatApiError(err));
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const handleDelete = async () => {
// // //     const item = confirmDelete;
// // //     if (!item) return;
// // //     const id = getTierId(item);
// // //     if (!id) {
// // //       setConfirmDelete(null);
// // //       setError("Cannot delete: missing tier id.");
// // //       return;
// // //     }
// // //     setDeleting(true);
// // //     setError("");
// // //     try {
// // //       await api.delete(`/api/v1/experience/leave/policies/tiers/${id}`);
// // //       setSuccess("Tier deleted successfully.");
// // //       setConfirmDelete(null);
// // //       setDetails(null);
// // //       await fetchData();
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //       setConfirmDelete(null);
// // //     } finally {
// // //       setDeleting(false);
// // //     }
// // //   };

// // //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// // //   /* ---------------------------------------------------------------- */
// // //   /*  RENDER                                                           */
// // //   /* ---------------------------------------------------------------- */

// // //   return (
// // //     <div>
// // //       {/* ---------- header ---------- */}
// // //       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// // //         <div>
// // //           <h1 className="text-xl font-semibold text-slate-800">
// // //             Experience Tiers
// // //           </h1>
// // //           <p className="mt-0.5 text-sm text-slate-500">
// // //             Configure experience-based leave quota tiers (only for Experience Based
// // //             policies).
// // //           </p>
// // //         </div>
// // //         {isHrOrAdmin && (
// // //           <button
// // //             type="button"
// // //             onClick={openAdd}
// // //             disabled={!leavePolicyId || !selectedPolicy || optionsLoading}
// // //             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
// // //           >
// // //             + Add Tier
// // //           </button>
// // //         )}
// // //       </div>

// // //       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// // //         {/* ---------- toolbar ---------- */}
// // //         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
// // //           <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
// // //             <select
// // //               value={leavePolicyId}
// // //               onChange={(e) => setLeavePolicyId(e.target.value)}
// // //               disabled={optionsLoading}
// // //               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white disabled:opacity-60"
// // //             >
// // //               <option value="">
// // //                 {optionsLoading
// // //                   ? "Loading policies…"
// // //                   : "Select Experience Based Policy"}
// // //               </option>
// // //               {experiencePolicies.map((p) => {
// // //                 const id = getPolicyId(p);
// // //                 if (!id) return null;
// // //                 return (
// // //                   <option key={String(id)} value={String(id)}>
// // //                     {getPolicyName(p)}
// // //                   </option>
// // //                 );
// // //               })}
// // //             </select>

// // //             <input
// // //               value={searchInput}
// // //               onChange={(e) => setSearchInput(e.target.value)}
// // //               placeholder="Search tiers…"
// // //               autoComplete="off"
// // //               disabled={!leavePolicyId}
// // //               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white disabled:opacity-60"
// // //             />
// // //           </div>

// // //           <div className="flex items-center gap-3">
// // //             <span className="text-sm text-slate-500">
// // //               {leavePolicyId ? `${total} tier${total === 1 ? "" : "s"}` : "—"}
// // //             </span>
// // //             {leavePolicyId && (
// // //               <button
// // //                 type="button"
// // //                 onClick={fetchData}
// // //                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
// // //               >
// // //                 Refresh
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* ---------- warnings / banners ---------- */}
// // //         {!optionsLoading && experiencePolicies.length === 0 && (
// // //           <div className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
// // //             No Experience Based policies found. Create a Leave Policy with
// // //             Entitlement Type = "Experience based" first.
// // //           </div>
// // //         )}

// // //         {error && !showForm && (
// // //           <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// // //             <span>{error}</span>
// // //             <button
// // //               type="button"
// // //               onClick={() => setError("")}
// // //               className="text-red-400 hover:text-red-600"
// // //             >
// // //               ✕
// // //             </button>
// // //           </div>
// // //         )}

// // //         {success && !showForm && (
// // //           <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
// // //             <span>{success}</span>
// // //             <button
// // //               type="button"
// // //               onClick={() => setSuccess("")}
// // //               className="text-emerald-400 hover:text-emerald-600"
// // //             >
// // //               ✕
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* ---------- table ---------- */}
// // //         <div className="overflow-x-auto">
// // //           {!leavePolicyId ? (
// // //             <div className="py-20 text-center text-sm text-slate-500">
// // //               <p className="font-medium text-slate-700">
// // //                 Select an Experience Based policy
// // //               </p>
// // //               <p className="mt-2">
// // //                 Tiers are defined per policy. Pick one from the dropdown above.
// // //               </p>
// // //             </div>
// // //           ) : loading ? (
// // //             <div className="py-20 text-center text-sm text-slate-500">
// // //               Loading…
// // //             </div>
// // //           ) : list.length === 0 ? (
// // //             <div className="py-20 text-center text-sm text-slate-500">
// // //               <p className="font-medium text-slate-700">
// // //                 No tiers found for this policy
// // //               </p>
// // //               <p className="mt-2">
// // //                 {isHrOrAdmin
// // //                   ? "Click Add Tier to configure the first entitlement tier."
// // //                   : "No tiers configured yet."}
// // //               </p>
// // //             </div>
// // //           ) : (
// // //             <table className="w-full text-left text-sm">
// // //               <thead>
// // //                 <tr className="border-b border-slate-100 bg-slate-50/80">
// // //                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
// // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // //                     Leave Policy
// // //                   </th>
// // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // //                     Min Service (Days)
// // //                   </th>
// // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // //                     Annual Quota
// // //                   </th>
// // //                   <th className="px-5 py-3 font-medium text-slate-500">
// // //                     Sort Order
// // //                   </th>
// // //                   <th className="px-5 py-3 text-right font-medium text-slate-500">
// // //                     Actions
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-slate-50">
// // //                 {displayList.map((item, i) => (
// // //                   <tr
// // //                     key={getTierId(item) || i}
// // //                     className="hover:bg-slate-50/70"
// // //                   >
// // //                     <td className="px-5 py-3.5 text-slate-500">
// // //                       {(page - 1) * pageSize + i + 1}
// // //                     </td>
// // //                     <td className="px-5 py-3.5 font-medium text-slate-800">
// // //                       {selectedPolicy
// // //                         ? getPolicyName(selectedPolicy)
// // //                         : item.leave_policy_name || "—"}
// // //                     </td>
// // //                     <td className="px-5 py-3.5 font-medium text-slate-800">
// // //                       {item.min_service_days ?? "—"}
// // //                     </td>
// // //                     <td className="px-5 py-3.5 text-slate-600">
// // //                       {item.annual_quota ?? "—"}
// // //                     </td>
// // //                     <td className="px-5 py-3.5 text-slate-600">
// // //                       {item.sort_order ?? "—"}
// // //                     </td>
// // //                     <td className="px-5 py-3.5 text-right">
// // //                       <div className="inline-flex gap-1">
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => setDetails(item)}
// // //                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
// // //                         >
// // //                           View
// // //                         </button>
// // //                         {isHrOrAdmin && (
// // //                           <>
// // //                             <button
// // //                               type="button"
// // //                               onClick={() => openEdit(item)}
// // //                               className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
// // //                             >
// // //                               Edit
// // //                             </button>
// // //                             <button
// // //                               type="button"
// // //                               onClick={() => setConfirmDelete(item)}
// // //                               className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
// // //                             >
// // //                               Delete
// // //                             </button>
// // //                           </>
// // //                         )}
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           )}
// // //         </div>

// // //         {/* ---------- pagination ---------- */}
// // //         {totalPages > 1 && (
// // //           <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
// // //             <span className="text-sm text-slate-500">
// // //               Page {page} of {totalPages}
// // //             </span>
// // //             <div className="flex gap-2">
// // //               <button
// // //                 type="button"
// // //                 disabled={page <= 1}
// // //                 onClick={() => setPage((p) => Math.max(1, p - 1))}
// // //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// // //               >
// // //                 Prev
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 disabled={page >= totalPages}
// // //                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// // //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// // //               >
// // //                 Next
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* ================= ADD / EDIT MODAL ================= */}
// // //       {showForm && (
// // //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
// // //           <div className="mb-10 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // //               <div>
// // //                 <h2 className="text-base font-semibold text-slate-800">
// // //                   {editId ? "Edit Experience Tier" : "Add Experience Tier"}
// // //                 </h2>
// // //                 <p className="mt-0.5 text-xs text-slate-500">
// // //                   Policy:{" "}
// // //                   {selectedPolicy
// // //                     ? getPolicyName(selectedPolicy)
// // //                     : leavePolicyId}
// // //                 </p>
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 onClick={closeForm}
// // //                 disabled={saving}
// // //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>

// // //             <form onSubmit={handleSubmit}>
// // //               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
// // //                 {/* Policy is read-only in the modal */}
// // //                 <div>
// // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                     Leave Policy
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     value={
// // //                       selectedPolicy
// // //                         ? getPolicyName(selectedPolicy)
// // //                         : leavePolicyId
// // //                     }
// // //                     disabled
// // //                     className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
// // //                   />
// // //                   <p className="mt-1 text-xs text-slate-400">
// // //                     To move this tier, delete it and add under the other policy.
// // //                   </p>
// // //                 </div>

// // //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// // //                   <div>
// // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                       Min Service (Days) *
// // //                     </label>
// // //                     <input
// // //                       required
// // //                       type="number"
// // //                       min="0"
// // //                       max={MAX_SERVICE_DAYS}
// // //                       step="1"
// // //                       autoComplete="off"
// // //                       value={formData.min_service_days}
// // //                       onChange={(e) =>
// // //                         handleChange("min_service_days", e.target.value)
// // //                       }
// // //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                     />
// // //                     <p className="mt-1 text-xs text-slate-400">
// // //                       0 = entry level. Tiers should increase with service.
// // //                     </p>
// // //                   </div>

// // //                   <div>
// // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                       Annual Quota *
// // //                     </label>
// // //                     <input
// // //                       required
// // //                       type="number"
// // //                       min="0"
// // //                       max={MAX_ANNUAL_QUOTA}
// // //                       step="0.5"
// // //                       autoComplete="off"
// // //                       value={formData.annual_quota}
// // //                       onChange={(e) =>
// // //                         handleChange("annual_quota", e.target.value)
// // //                       }
// // //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                     />
// // //                   </div>

// // //                   <div className="sm:col-span-2">
// // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                       Sort Order *
// // //                     </label>
// // //                     <input
// // //                       required
// // //                       type="number"
// // //                       min="0"
// // //                       step="1"
// // //                       autoComplete="off"
// // //                       value={formData.sort_order}
// // //                       onChange={(e) =>
// // //                         handleChange("sort_order", e.target.value)
// // //                       }
// // //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                     />
// // //                     <p className="mt-1 text-xs text-slate-400">
// // //                       Lower number = evaluated first. Tiers are displayed sorted
// // //                       by Min Service.
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
// // //                   Example: 0 days → 12 quota, 365 days → 15 quota, 1095 days → 18
// // //                   quota.
// // //                 </div>

// // //                 {formError && (
// // //                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// // //                     {formError}
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// // //                 <button
// // //                   type="button"
// // //                   onClick={closeForm}
// // //                   disabled={saving}
// // //                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   disabled={saving}
// // //                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // //                 >
// // //                   {saving ? "Saving…" : editId ? "Update" : "Submit"}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ================= DETAILS MODAL ================= */}
// // //       {details && (
// // //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// // //           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // //               <div>
// // //                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// // //                   Experience Tier
// // //                 </p>
// // //                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
// // //                   Min {details.min_service_days ?? 0} days →{" "}
// // //                   {details.annual_quota ?? 0} quota
// // //                 </h2>
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setDetails(null)}
// // //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>

// // //             <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
// // //               <div className="grid gap-3 sm:grid-cols-2">
// // //                 {[
// // //                   [
// // //                     "Policy",
// // //                     selectedPolicy
// // //                       ? getPolicyName(selectedPolicy)
// // //                       : details.leave_policy_name || leavePolicyId,
// // //                   ],
// // //                   ["Min Service (Days)", details.min_service_days],
// // //                   ["Annual Quota", details.annual_quota],
// // //                   ["Sort Order", details.sort_order],
// // //                   ["Tier ID", getTierId(details)],
// // //                   ["Created At", details.created_at || details.createdAt],
// // //                   ["Updated At", details.updated_at || details.updatedAt],
// // //                 ].map(([label, value]) => (
// // //                   <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5">
// // //                     <p className="text-xs text-slate-400">{label}</p>
// // //                     <p className="mt-1 break-all text-sm font-medium text-slate-800">
// // //                       {value ?? "—"}
// // //                     </p>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setDetails(null)}
// // //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// // //               >
// // //                 Close
// // //               </button>
// // //               {isHrOrAdmin && (
// // //                 <>
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => {
// // //                       const item = details;
// // //                       setDetails(null);
// // //                       setConfirmDelete(item);
// // //                     }}
// // //                     className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
// // //                   >
// // //                     Delete
// // //                   </button>
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => {
// // //                       const item = details;
// // //                       setDetails(null);
// // //                       openEdit(item);
// // //                     }}
// // //                     className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// // //                   >
// // //                     Edit
// // //                   </button>
// // //                 </>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ================= DELETE CONFIRM ================= */}
// // //       {confirmDelete && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// // //           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
// // //             <div className="border-b border-slate-100 px-5 py-4">
// // //               <h2 className="text-base font-semibold text-slate-800">
// // //                 Delete experience tier?
// // //               </h2>
// // //             </div>
// // //             <div className="px-5 py-5 text-sm text-slate-600">
// // //               This will remove the tier{" "}
// // //               <span className="font-medium text-slate-800">
// // //                 Min {confirmDelete.min_service_days ?? 0} days →{" "}
// // //                 {confirmDelete.annual_quota ?? 0} quota
// // //               </span>
// // //               . This action cannot be undone.
// // //               {error && (
// // //                 <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-red-600">
// // //                   {error}
// // //                 </div>
// // //               )}
// // //             </div>
// // //             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setConfirmDelete(null)}
// // //                 disabled={deleting}
// // //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={handleDelete}
// // //                 disabled={deleting}
// // //                 className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
// // //               >
// // //                 {deleting ? "Deleting…" : "Delete"}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import { api } from "@/app/lib/api";
// // import { useAuthStore } from "@/app/store/authStore";

// // /* ------------------------------------------------------------------ */
// // /*  CONSTANTS                                                          */
// // /* ------------------------------------------------------------------ */

// // const HR_ROLES = new Set([
// //   "hr",
// //   "hr_manager",
// //   "hr-manager",
// //   "admin",
// //   "super_admin",
// //   "super-admin",
// //   "superadmin",
// //   "owner",
// //   "payroll_officer",
// //   "payroll-officer",
// // ]);

// // const initialForm = {
// //   leave_policy_id: "",
// //   min_service_days: 0,
// //   annual_quota: 0,
// //   sort_order: 0,
// // };

// // const MAX_SERVICE_DAYS = 36500; // ~100 years
// // const MAX_ANNUAL_QUOTA = 365;

// // /* ------------------------------------------------------------------ */
// // /*  HELPERS                                                            */
// // /* ------------------------------------------------------------------ */

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
// //   if (err?.response?.data?.message) return err.response.data.message;
// //   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
// //   if (err?.response?.status === 401) return "Session expired. Please login again.";
// //   if (err?.response?.status === 403) return "You don't have permission for this action.";
// //   if (err?.response?.status === 409) return "A tier with these values already exists.";
// //   return err?.message || "Something went wrong";
// // };

// // const isCancel = (err) =>
// //   err?.name === "CanceledError" ||
// //   err?.code === "ERR_CANCELED" ||
// //   err?.name === "AbortError";

// // const pickList = (response) => {
// //   const data = response?.data?.data ?? response?.data ?? [];
// //   if (Array.isArray(data)) return data;
// //   return (
// //     data?.items ??
// //     data?.results ??
// //     data?.policies ??
// //     data?.leave_policies ??
// //     data?.tiers ??
// //     data?.experience_tiers ??
// //     []
// //   );
// // };

// // const hasHrAccess = (user) => {
// //   if (!user) return false;
// //   const roles = [
// //     user.role,
// //     ...(Array.isArray(user.roles) ? user.roles : []),
// //     ...(Array.isArray(user.user_roles) ? user.user_roles : []),
// //   ]
// //     .filter(Boolean)
// //     .map((r) =>
// //       String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
// //         .toLowerCase()
// //         .trim()
// //     );
// //   return roles.some((r) => HR_ROLES.has(r));
// // };

// // const getPolicyId = (p) =>
// //   p?.leave_policy_id ?? p?.policy_id ?? p?.id ?? p?._id ?? "";
// // const getPolicyName = (p) =>
// //   p?.policy_name ?? p?.leave_policy_name ?? p?.name ?? getPolicyId(p);

// // const getTierId = (t) =>
// //   t?.tier_id ??
// //   t?.experience_tier_id ??
// //   t?.policy_tier_id ??
// //   t?.id ??
// //   null;

// // /** Case-insensitive, separator-agnostic match for "experience_based" */
// // const normalizeEntitlement = (v) =>
// //   String(v || "")
// //     .toLowerCase()
// //     .replace(/[\s_-]+/g, "");

// // const isExperienceBased = (policy) =>
// //   normalizeEntitlement(policy?.entitlement_type) === "experiencebased";

// // /* ------------------------------------------------------------------ */
// // /*  COMPONENT                                                          */
// // /* ------------------------------------------------------------------ */

// // export default function LeavePolicyExperienceTiersPage() {
// //   const user = useAuthStore((state) => state.user);
// //   const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

// //   const [list, setList] = useState([]);
// //   const [formData, setFormData] = useState(initialForm);
// //   const [leavePolicies, setLeavePolicies] = useState([]);
// //   const [leavePolicyId, setLeavePolicyId] = useState("");

// //   const [loading, setLoading] = useState(false);
// //   const [optionsLoading, setOptionsLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [deleting, setDeleting] = useState(false);
// //   const [error, setError] = useState("");
// //   const [formError, setFormError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const [showForm, setShowForm] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const [searchInput, setSearchInput] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [pageSize] = useState(10);
// //   const [total, setTotal] = useState(0);

// //   const [details, setDetails] = useState(null);
// //   const [confirmDelete, setConfirmDelete] = useState(null);

// //   const abortRef = useRef(null);

// //   /* ---------- experience-based policies ---------- */
// //   const experiencePolicies = useMemo(
// //     () => leavePolicies.filter(isExperienceBased),
// //     [leavePolicies]
// //   );

// //   const selectedPolicy = useMemo(
// //     () =>
// //       experiencePolicies.find(
// //         (p) => String(getPolicyId(p)) === String(leavePolicyId)
// //       ),
// //     [experiencePolicies, leavePolicyId]
// //   );

// //   /* ---------- load policies ---------- */
// //   useEffect(() => {
// //     let cancelled = false;
// //     setOptionsLoading(true);

// //     api
// //       .get("/api/v1/leave/policies", { params: { page: 1, page_size: 200 } })
// //       .then((res) => {
// //         if (cancelled) return;
// //         const policies = pickList(res);
// //         setLeavePolicies(Array.isArray(policies) ? policies : []);

// //         const exp = (policies || []).filter(isExperienceBased);
// //         if (exp.length > 0) {
// //           setLeavePolicyId((prev) => prev || String(getPolicyId(exp[0])));
// //         }
// //       })
// //       .catch((err) => {
// //         if (!cancelled) setError(formatApiError(err));
// //       })
// //       .finally(() => {
// //         if (!cancelled) setOptionsLoading(false);
// //       });

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   /* ---------- debounce search ---------- */
// //   useEffect(() => {
// //     const t = setTimeout(() => {
// //       setSearch(searchInput.trim());
// //       setPage(1);
// //     }, 400);
// //     return () => clearTimeout(t);
// //   }, [searchInput]);

// //   /* ---------- reset page on policy change ---------- */
// //   useEffect(() => {
// //     setPage(1);
// //   }, [leavePolicyId]);

// //   /* ---------- auto-dismiss success ---------- */
// //   useEffect(() => {
// //     if (!success) return;
// //     const t = setTimeout(() => setSuccess(""), 4000);
// //     return () => clearTimeout(t);
// //   }, [success]);

// //   /* ---------- fetch tiers ---------- */
// //   const fetchData = useCallback(async () => {
// //     if (!leavePolicyId) {
// //       setList([]);
// //       setTotal(0);
// //       setLoading(false);
// //       return;
// //     }

// //     if (abortRef.current) abortRef.current.abort();
// //     const controller = new AbortController();
// //     abortRef.current = controller;

// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get(
// //         `/api/v1/experience/leave/policies/${leavePolicyId}/tiers`,
// //         {
// //           params: {
// //             page,
// //             page_size: pageSize,
// //             ...(search ? { search } : {}),
// //           },
// //           signal: controller.signal,
// //         }
// //       );

// //       const payload = res.data?.data ?? res.data ?? {};
// //       const items = Array.isArray(payload)
// //         ? payload
// //         : payload?.items ??
// //           payload?.results ??
// //           payload?.tiers ??
// //           payload?.experience_tiers ??
// //           [];

// //       const safeItems = Array.isArray(items) ? items : [];
// //       setList(safeItems);
// //       setTotal(
// //         res.data?.total ??
// //           res.data?.count ??
// //           payload?.total ??
// //           safeItems.length
// //       );
// //     } catch (err) {
// //       if (isCancel(err)) return;
// //       setError(formatApiError(err));
// //       setList([]);
// //       setTotal(0);
// //     } finally {
// //       if (!controller.signal.aborted) setLoading(false);
// //     }
// //   }, [leavePolicyId, page, pageSize, search]);

// //   useEffect(() => {
// //     fetchData();
// //     return () => {
// //       if (abortRef.current) abortRef.current.abort();
// //     };
// //   }, [fetchData]);

// //   /* ---------- existing tiers (for validation) ---------- */
// //   const existingMinDays = useMemo(() => {
// //     const m = new Map(); // minDays -> tierId
// //     list.forEach((t) => {
// //       const days = Number(t.min_service_days);
// //       if (Number.isFinite(days)) {
// //         m.set(days, getTierId(t));
// //       }
// //     });
// //     return m;
// //   }, [list]);

// //   /* ---------- derived: sorted list (display only) ---------- */
// //   const displayList = useMemo(() => {
// //     return [...list].sort(
// //       (a, b) =>
// //         Number(a.min_service_days ?? 0) - Number(b.min_service_days ?? 0)
// //     );
// //   }, [list]);

// //   /* ---------- form handlers ---------- */
// //   const handleChange = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const openAdd = () => {
// //     if (!leavePolicyId) {
// //       setError("Please select an Experience Based policy first.");
// //       return;
// //     }
// //     setEditId(null);
// //     setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
// //     setFormError("");
// //     setError("");
// //     setShowForm(true);
// //   };

// //   const openEdit = (item) => {
// //     setEditId(getTierId(item));
// //     setFormData({
// //       ...initialForm,
// //       leave_policy_id: leavePolicyId,
// //       min_service_days: item.min_service_days ?? 0,
// //       annual_quota: item.annual_quota ?? 0,
// //       sort_order: item.sort_order ?? 0,
// //     });
// //     setFormError("");
// //     setError("");
// //     setShowForm(true);
// //   };

// //   const closeForm = () => {
// //     if (saving) return;
// //     setShowForm(false);
// //     setFormError("");
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (saving) return;

// //     const minDays = Number(formData.min_service_days);
// //     const quota = Number(formData.annual_quota);
// //     const sortOrder = Number(formData.sort_order);

// //     if (!Number.isFinite(minDays) || minDays < 0 || minDays > MAX_SERVICE_DAYS) {
// //       setFormError(`Min Service must be between 0 and ${MAX_SERVICE_DAYS}.`);
// //       return;
// //     }
// //     if (!Number.isInteger(minDays)) {
// //       setFormError("Min Service Days must be a whole number.");
// //       return;
// //     }
// //     if (!Number.isFinite(quota) || quota < 0 || quota > MAX_ANNUAL_QUOTA) {
// //       setFormError(`Annual Quota must be between 0 and ${MAX_ANNUAL_QUOTA}.`);
// //       return;
// //     }
// //     if (!Number.isFinite(sortOrder) || sortOrder < 0) {
// //       setFormError("Sort Order must be 0 or greater.");
// //       return;
// //     }

// //     // duplicate min_service_days check (skip current edit row)
// //     const existingTierForDays = existingMinDays.get(minDays);
// //     if (existingTierForDays && String(existingTierForDays) !== String(editId)) {
// //       setFormError(
// //         `A tier with Min Service Days = ${minDays} already exists for this policy.`
// //       );
// //       return;
// //     }

// //     setSaving(true);
// //     setFormError("");
// //     setError("");
// //     try {
// //       const payload = {
// //         leave_policy_id: leavePolicyId,
// //         min_service_days: minDays,
// //         annual_quota: quota,
// //         sort_order: sortOrder,
// //       };

// //       if (editId) {
// //         await api.put(
// //           `/api/v1/experience/leave/policies/tiers/${editId}`,
// //           payload
// //         );
// //       } else {
// //         await api.post("/api/v1/experience/leave/policies/tiers", payload);
// //       }

// //       setSuccess(editId ? "Tier updated successfully." : "Tier added successfully.");
// //       setShowForm(false);
// //       setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
// //       setEditId(null);
// //       await fetchData();
// //     } catch (err) {
// //       setFormError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     const item = confirmDelete;
// //     if (!item) return;
// //     const id = getTierId(item);
// //     if (!id) {
// //       setConfirmDelete(null);
// //       setError("Cannot delete: missing tier id.");
// //       return;
// //     }
// //     setDeleting(true);
// //     setError("");
// //     try {
// //       await api.delete(`/api/v1/experience/leave/policies/tiers/${id}`);
// //       setSuccess("Tier deleted successfully.");
// //       setConfirmDelete(null);
// //       setDetails(null);
// //       await fetchData();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //       setConfirmDelete(null);
// //     } finally {
// //       setDeleting(false);
// //     }
// //   };

// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// //   /* ---------------------------------------------------------------- */
// //   /*  RENDER                                                           */
// //   /* ---------------------------------------------------------------- */

// //   return (
// //     <div>
// //       {/* ---------- header ---------- */}
// //       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-xl font-semibold text-slate-800">
// //             Experience Tiers
// //           </h1>
// //           <p className="mt-0.5 text-sm text-slate-500">
// //             Configure experience-based leave quota tiers (only for Experience Based
// //             policies).
// //           </p>
// //         </div>
// //         {isHrOrAdmin && (
// //           <button
// //             type="button"
// //             onClick={openAdd}
// //             disabled={!leavePolicyId || !selectedPolicy || optionsLoading}
// //             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
// //           >
// //             + Add Tier
// //           </button>
// //         )}
// //       </div>

// //       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// //         {/* ---------- toolbar ---------- */}
// //         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
// //           <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
// //             <select
// //               value={leavePolicyId}
// //               onChange={(e) => setLeavePolicyId(e.target.value)}
// //               disabled={optionsLoading}
// //               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white disabled:opacity-60"
// //             >
// //               <option value="">
// //                 {optionsLoading
// //                   ? "Loading policies…"
// //                   : "Select Experience Based Policy"}
// //               </option>
// //               {experiencePolicies.map((p) => {
// //                 const id = getPolicyId(p);
// //                 if (!id) return null;
// //                 return (
// //                   <option key={String(id)} value={String(id)}>
// //                     {getPolicyName(p)}
// //                   </option>
// //                 );
// //               })}
// //             </select>

// //             <input
// //               value={searchInput}
// //               onChange={(e) => setSearchInput(e.target.value)}
// //               placeholder="Search tiers…"
// //               autoComplete="off"
// //               disabled={!leavePolicyId}
// //               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white disabled:opacity-60"
// //             />
// //           </div>

// //           <div className="flex items-center gap-3">
// //             <span className="text-sm text-slate-500">
// //               {leavePolicyId ? `${total} tier${total === 1 ? "" : "s"}` : "—"}
// //             </span>
// //             {leavePolicyId && (
// //               <button
// //                 type="button"
// //                 onClick={fetchData}
// //                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
// //               >
// //                 Refresh
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* ---------- warnings / banners ---------- */}
// //         {!optionsLoading && experiencePolicies.length === 0 && (
// //           <div className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
// //             No Experience Based policies found. Create a Leave Policy with
// //             Entitlement Type = &quot;Experience based&quot; first.
// //           </div>
// //         )}

// //         {error && !showForm && (
// //           <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// //             <span>{error}</span>
// //             <button
// //               type="button"
// //               onClick={() => setError("")}
// //               className="text-red-400 hover:text-red-600"
// //             >
// //               ✕
// //             </button>
// //           </div>
// //         )}

// //         {success && !showForm && (
// //           <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
// //             <span>{success}</span>
// //             <button
// //               type="button"
// //               onClick={() => setSuccess("")}
// //               className="text-emerald-400 hover:text-emerald-600"
// //             >
// //               ✕
// //             </button>
// //           </div>
// //         )}

// //         {/* ---------- table ---------- */}
// //         <div className="overflow-x-auto">
// //           {!leavePolicyId ? (
// //             <div className="py-20 text-center text-sm text-slate-500">
// //               <p className="font-medium text-slate-700">
// //                 Select an Experience Based policy
// //               </p>
// //               <p className="mt-2">
// //                 Tiers are defined per policy. Pick one from the dropdown above.
// //               </p>
// //             </div>
// //           ) : loading ? (
// //             <div className="py-20 text-center text-sm text-slate-500">
// //               Loading…
// //             </div>
// //           ) : list.length === 0 ? (
// //             <div className="py-20 text-center text-sm text-slate-500">
// //               <p className="font-medium text-slate-700">
// //                 No tiers found for this policy
// //               </p>
// //               <p className="mt-2">
// //                 {isHrOrAdmin
// //                   ? "Click Add Tier to configure the first entitlement tier."
// //                   : "No tiers configured yet."}
// //               </p>
// //             </div>
// //           ) : (
// //             <table className="w-full text-left text-sm">
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-slate-50/80">
// //                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
// //                   <th className="px-5 py-3 font-medium text-slate-500">
// //                     Leave Policy
// //                   </th>
// //                   <th className="px-5 py-3 font-medium text-slate-500">
// //                     Min Service (Days)
// //                   </th>
// //                   <th className="px-5 py-3 font-medium text-slate-500">
// //                     Annual Quota
// //                   </th>
// //                   <th className="px-5 py-3 font-medium text-slate-500">
// //                     Sort Order
// //                   </th>
// //                   <th className="px-5 py-3 text-right font-medium text-slate-500">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-50">
// //                 {displayList.map((item, i) => (
// //                   <tr
// //                     key={getTierId(item) || i}
// //                     className="hover:bg-slate-50/70"
// //                   >
// //                     <td className="px-5 py-3.5 text-slate-500">
// //                       {(page - 1) * pageSize + i + 1}
// //                     </td>
// //                     <td className="px-5 py-3.5 font-medium text-slate-800">
// //                       {selectedPolicy
// //                         ? getPolicyName(selectedPolicy)
// //                         : item.leave_policy_name || "—"}
// //                     </td>
// //                     <td className="px-5 py-3.5 font-medium text-slate-800">
// //                       {item.min_service_days ?? "—"}
// //                     </td>
// //                     <td className="px-5 py-3.5 text-slate-600">
// //                       {item.annual_quota ?? "—"}
// //                     </td>
// //                     <td className="px-5 py-3.5 text-slate-600">
// //                       {item.sort_order ?? "—"}
// //                     </td>
// //                     <td className="px-5 py-3.5 text-right">
// //                       <div className="inline-flex gap-1">
// //                         <button
// //                           type="button"
// //                           onClick={() => setDetails(item)}
// //                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
// //                         >
// //                           View
// //                         </button>
// //                         {isHrOrAdmin && (
// //                           <>
// //                             <button
// //                               type="button"
// //                               onClick={() => openEdit(item)}
// //                               className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
// //                             >
// //                               Edit
// //                             </button>
// //                             <button
// //                               type="button"
// //                               onClick={() => setConfirmDelete(item)}
// //                               className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
// //                             >
// //                               Delete
// //                             </button>
// //                           </>
// //                         )}
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>

// //         {/* ---------- pagination ---------- */}
// //         {totalPages > 1 && (
// //           <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
// //             <span className="text-sm text-slate-500">
// //               Page {page} of {totalPages}
// //             </span>
// //             <div className="flex gap-2">
// //               <button
// //                 type="button"
// //                 disabled={page <= 1}
// //                 onClick={() => setPage((p) => Math.max(1, p - 1))}
// //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Prev
// //               </button>
// //               <button
// //                 type="button"
// //                 disabled={page >= totalPages}
// //                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* ================= ADD / EDIT MODAL ================= */}
// //       {showForm && (
// //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
// //           <div className="mb-10 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <div>
// //                 <h2 className="text-base font-semibold text-slate-800">
// //                   {editId ? "Edit Experience Tier" : "Add Experience Tier"}
// //                 </h2>
// //                 <p className="mt-0.5 text-xs text-slate-500">
// //                   Policy:{" "}
// //                   {selectedPolicy
// //                     ? getPolicyName(selectedPolicy)
// //                     : leavePolicyId}
// //                 </p>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={closeForm}
// //                 disabled={saving}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={handleSubmit}>
// //               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
// //                 <div>
// //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                     Leave Policy
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={
// //                       selectedPolicy
// //                         ? getPolicyName(selectedPolicy)
// //                         : leavePolicyId
// //                     }
// //                     disabled
// //                     className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
// //                   />
// //                   <p className="mt-1 text-xs text-slate-400">
// //                     To move this tier, delete it and add under the other policy.
// //                   </p>
// //                 </div>

// //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Min Service (Days) *
// //                     </label>
// //                     <input
// //                       required
// //                       type="number"
// //                       min="0"
// //                       max={MAX_SERVICE_DAYS}
// //                       step="1"
// //                       autoComplete="off"
// //                       value={formData.min_service_days}
// //                       onChange={(e) =>
// //                         handleChange("min_service_days", e.target.value)
// //                       }
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                     />
// //                     <p className="mt-1 text-xs text-slate-400">
// //                       0 = entry level. Tiers should increase with service.
// //                     </p>
// //                   </div>

// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Annual Quota *
// //                     </label>
// //                     <input
// //                       required
// //                       type="number"
// //                       min="0"
// //                       max={MAX_ANNUAL_QUOTA}
// //                       step="0.5"
// //                       autoComplete="off"
// //                       value={formData.annual_quota}
// //                       onChange={(e) =>
// //                         handleChange("annual_quota", e.target.value)
// //                       }
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                     />
// //                   </div>

// //                   <div className="sm:col-span-2">
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Sort Order *
// //                     </label>
// //                     <input
// //                       required
// //                       type="number"
// //                       min="0"
// //                       step="1"
// //                       autoComplete="off"
// //                       value={formData.sort_order}
// //                       onChange={(e) =>
// //                         handleChange("sort_order", e.target.value)
// //                       }
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                     />
// //                     <p className="mt-1 text-xs text-slate-400">
// //                       Lower number = evaluated first. Tiers are displayed sorted
// //                       by Min Service.
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
// //                   Example: 0 days → 12 quota, 365 days → 15 quota, 1095 days → 18
// //                   quota.
// //                 </div>

// //                 {formError && (
// //                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// //                     {formError}
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //                 <button
// //                   type="button"
// //                   onClick={closeForm}
// //                   disabled={saving}
// //                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving…" : editId ? "Update" : "Submit"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* ================= DETAILS MODAL ================= */}
// //       {details && (
// //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// //           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <div>
// //                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// //                   Experience Tier
// //                 </p>
// //                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
// //                   Min {details.min_service_days ?? 0} days →{" "}
// //                   {details.annual_quota ?? 0} quota
// //                 </h2>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={() => setDetails(null)}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
// //               <div className="grid gap-3 sm:grid-cols-2">
// //                 {[
// //                   [
// //                     "Policy",
// //                     selectedPolicy
// //                       ? getPolicyName(selectedPolicy)
// //                       : details.leave_policy_name || leavePolicyId,
// //                   ],
// //                   ["Min Service (Days)", details.min_service_days],
// //                   ["Annual Quota", details.annual_quota],
// //                   ["Sort Order", details.sort_order],
// //                   ["Tier ID", getTierId(details)],
// //                   ["Created At", details.created_at || details.createdAt],
// //                   ["Updated At", details.updated_at || details.updatedAt],
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

// //             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setDetails(null)}
// //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// //               >
// //                 Close
// //               </button>
// //               {isHrOrAdmin && (
// //                 <>
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       const item = details;
// //                       setDetails(null);
// //                       setConfirmDelete(item);
// //                     }}
// //                     className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
// //                   >
// //                     Delete
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       const item = details;
// //                       setDetails(null);
// //                       openEdit(item);
// //                     }}
// //                     className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// //                   >
// //                     Edit
// //                   </button>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ================= DELETE CONFIRM ================= */}
// //       {confirmDelete && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// //           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-base font-semibold text-slate-800">
// //                 Delete experience tier?
// //               </h2>
// //             </div>
// //             <div className="px-5 py-5 text-sm text-slate-600">
// //               This will remove the tier{" "}
// //               <span className="font-medium text-slate-800">
// //                 Min {confirmDelete.min_service_days ?? 0} days →{" "}
// //                 {confirmDelete.annual_quota ?? 0} quota
// //               </span>
// //               . This action cannot be undone.
// //               {error && (
// //                 <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-red-600">
// //                   {error}
// //                 </div>
// //               )}
// //             </div>
// //             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setConfirmDelete(null)}
// //                 disabled={deleting}
// //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={handleDelete}
// //                 disabled={deleting}
// //                 className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
// //               >
// //                 {deleting ? "Deleting…" : "Delete"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// /* ------------------------------------------------------------------ */
// /*  CONSTANTS                                                          */
// /* ------------------------------------------------------------------ */

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
// ]);

// const initialForm = {
//   leave_policy_id: "",
//   min_service_days: 0,
//   annual_quota: 0,
//   sort_order: 0,
// };

// const MAX_SERVICE_DAYS = 36500; // ~100 years
// const MAX_ANNUAL_QUOTA = 365;

// /* ------------------------------------------------------------------ */
// /*  HELPERS                                                            */
// /* ------------------------------------------------------------------ */

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
//   if (err?.response?.status === 409) return "A tier with these values already exists.";
//   return err?.message || "Something went wrong";
// };

// const isCancel = (err) =>
//   err?.name === "CanceledError" ||
//   err?.code === "ERR_CANCELED" ||
//   err?.name === "AbortError";

// const pickList = (response) => {
//   const data = response?.data?.data ?? response?.data ?? [];
//   if (Array.isArray(data)) return data;
//   return (
//     data?.items ??
//     data?.results ??
//     data?.policies ??
//     data?.leave_policies ??
//     data?.tiers ??
//     data?.experience_tiers ??
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

// const getPolicyId = (p) =>
//   p?.leave_policy_id ?? p?.policy_id ?? p?.id ?? p?._id ?? "";
// const getPolicyName = (p) =>
//   p?.policy_name ?? p?.leave_policy_name ?? p?.name ?? getPolicyId(p);

// const getTierId = (t) =>
//   t?.tier_id ??
//   t?.experience_tier_id ??
//   t?.policy_tier_id ??
//   t?.id ??
//   null;

// /** Case-insensitive, separator-agnostic match for "experience_based" */
// const normalizeEntitlement = (v) =>
//   String(v || "")
//     .toLowerCase()
//     .replace(/[\s_-]+/g, "");

// const isExperienceBased = (policy) =>
//   normalizeEntitlement(policy?.entitlement_type) === "experiencebased";

// /* ------------------------------------------------------------------ */
// /*  TIER PREVIEW COMPONENT                                             */
// /* ------------------------------------------------------------------ */

// function TierPreview({ tiers }) {
//   if (!tiers || tiers.length === 0) return null;

//   // Sort ascending by min_service_days
//   const sorted = [...tiers].sort(
//     (a, b) => Number(a.min_service_days ?? 0) - Number(b.min_service_days ?? 0)
//   );

//   const maxQuota = Math.max(
//     ...sorted.map((t) => Number(t.annual_quota ?? 0)),
//     1
//   );

//   return (
//     <div className="mx-4 mt-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4">
//       <div className="mb-3 flex items-center justify-between">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
//             Tier Hierarchy Preview
//           </p>
//           <p className="mt-0.5 text-[11px] text-sky-600">
//             Yahan dikh raha hai ki kis experience pe kitni leave milegi
//           </p>
//         </div>
//         <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
//           {sorted.length} tier{sorted.length !== 1 ? "s" : ""}
//         </span>
//       </div>

//       <div className="space-y-2">
//         {sorted.map((t, i) => {
//           const quota = Number(t.annual_quota ?? 0);
//           const pct = Math.min((quota / maxQuota) * 100, 100);
//           const nextTier = sorted[i + 1];
//           const nextMin = nextTier ? Number(nextTier.min_service_days ?? 0) : null;
//           const currentMin = Number(t.min_service_days ?? 0);

//           return (
//             <div key={getTierId(t) || i} className="flex items-center gap-3">
//               <div className="w-24 shrink-0 text-right">
//                 <p className="text-[11px] font-medium text-slate-500">
//                   {currentMin === 0 ? "Entry" : `${currentMin}d+`}
//                 </p>
//                 {nextMin !== null && (
//                   <p className="text-[9px] text-slate-400">
//                     till {nextMin - 1}d
//                   </p>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <div className="h-6 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-sky-100">
//                   <div
//                     className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-sky-400 to-sky-600 pr-2 transition-all"
//                     style={{ width: `${Math.max(pct, 15)}%` }}
//                   >
//                     <span className="text-[10px] font-bold text-white">
//                       {quota}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-16 shrink-0">
//                 <p className="text-xs font-semibold text-slate-700">
//                   {quota} {quota === 1 ? "day" : "days"}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-3 border-t border-sky-200 pt-2">
//         <p className="text-[10px] text-sky-700">
//           💡 Employee jitne din service karega, usse **usi tier ka quota** milega.
//           Tier automatically highest match pick karega.
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  COMPONENT                                                          */
// /* ------------------------------------------------------------------ */

// export default function LeavePolicyExperienceTiersPage() {
//   const user = useAuthStore((state) => state.user);
//   const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

//   const [list, setList] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [leavePolicies, setLeavePolicies] = useState([]);
//   const [leavePolicyId, setLeavePolicyId] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [optionsLoading, setOptionsLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [error, setError] = useState("");
//   const [formError, setFormError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   const [details, setDetails] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);

//   const abortRef = useRef(null);

//   /* ---------- experience-based policies ---------- */
//   const experiencePolicies = useMemo(
//     () => leavePolicies.filter(isExperienceBased),
//     [leavePolicies]
//   );

//   const selectedPolicy = useMemo(
//     () =>
//       experiencePolicies.find(
//         (p) => String(getPolicyId(p)) === String(leavePolicyId)
//       ),
//     [experiencePolicies, leavePolicyId]
//   );

//   /* ---------- load policies ---------- */
//   useEffect(() => {
//     let cancelled = false;
//     setOptionsLoading(true);

//     api
//       .get("/api/v1/leave/policies", { params: { page: 1, page_size: 200 } })
//       .then((res) => {
//         if (cancelled) return;
//         const policies = pickList(res);
//         setLeavePolicies(Array.isArray(policies) ? policies : []);

//         const exp = (policies || []).filter(isExperienceBased);
//         if (exp.length > 0) {
//           setLeavePolicyId((prev) => prev || String(getPolicyId(exp[0])));
//         }
//       })
//       .catch((err) => {
//         if (!cancelled) setError(formatApiError(err));
//       })
//       .finally(() => {
//         if (!cancelled) setOptionsLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ---------- debounce search ---------- */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* ---------- reset page on policy change ---------- */
//   useEffect(() => {
//     setPage(1);
//   }, [leavePolicyId]);

//   /* ---------- auto-dismiss success ---------- */
//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), 4000);
//     return () => clearTimeout(t);
//   }, [success]);

//   /* ---------- fetch tiers ---------- */
//   const fetchData = useCallback(async () => {
//     if (!leavePolicyId) {
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
//       const res = await api.get(
//         `/api/v1/experience/leave/policies/${leavePolicyId}/tiers`,
//         {
//           params: {
//             page,
//             page_size: pageSize,
//             ...(search ? { search } : {}),
//           },
//           signal: controller.signal,
//         }
//       );

//       const payload = res.data?.data ?? res.data ?? {};
//       const items = Array.isArray(payload)
//         ? payload
//         : payload?.items ??
//           payload?.results ??
//           payload?.tiers ??
//           payload?.experience_tiers ??
//           [];

//       const safeItems = Array.isArray(items) ? items : [];
//       setList(safeItems);
//       setTotal(
//         res.data?.total ??
//           res.data?.count ??
//           payload?.total ??
//           safeItems.length
//       );
//     } catch (err) {
//       if (isCancel(err)) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (!controller.signal.aborted) setLoading(false);
//     }
//   }, [leavePolicyId, page, pageSize, search]);

//   useEffect(() => {
//     fetchData();
//     return () => {
//       if (abortRef.current) abortRef.current.abort();
//     };
//   }, [fetchData]);

//   /* ---------- existing tiers (for validation) ---------- */
//   const existingMinDays = useMemo(() => {
//     const m = new Map(); // minDays -> tierId
//     list.forEach((t) => {
//       const days = Number(t.min_service_days);
//       if (Number.isFinite(days)) {
//         m.set(days, getTierId(t));
//       }
//     });
//     return m;
//   }, [list]);

//   /* ---------- derived: sorted list (display only) ---------- */
//   const displayList = useMemo(() => {
//     return [...list].sort(
//       (a, b) =>
//         Number(a.min_service_days ?? 0) - Number(b.min_service_days ?? 0)
//     );
//   }, [list]);

//   /* ⭐ Auto-suggest sort order based on highest existing */
//   const suggestedSortOrder = useMemo(() => {
//     if (!list || list.length === 0) return 0;
//     const maxSort = Math.max(
//       ...list.map((t) => Number(t.sort_order ?? 0))
//     );
//     return Number.isFinite(maxSort) ? maxSort + 1 : list.length;
//   }, [list]);

//   /* ⭐ Live duplicate warning */
//   const liveDuplicateWarning = useMemo(() => {
//     if (!showForm) return null;
//     const days = Number(formData.min_service_days);
//     if (!Number.isFinite(days)) return null;
//     const existingId = existingMinDays.get(days);
//     if (existingId && String(existingId) !== String(editId)) {
//       return `Min Service Days = ${days} already exists`;
//     }
//     return null;
//   }, [showForm, formData.min_service_days, existingMinDays, editId]);

//   /* ⭐ Tier gap warning (non-blocking info) */
//   const tierWarnings = useMemo(() => {
//     const warnings = [];
//     if (list.length < 2) return warnings;
//     const sorted = [...list].sort(
//       (a, b) =>
//         Number(a.min_service_days ?? 0) - Number(b.min_service_days ?? 0)
//     );
//     if (Number(sorted[0].min_service_days ?? 0) !== 0) {
//       warnings.push(
//         `⚠️ First tier starts at ${sorted[0].min_service_days}d. Employees with less service won't match any tier.`
//       );
//     }
//     return warnings;
//   }, [list]);

//   /* ---------- form handlers ---------- */
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const openAdd = () => {
//     if (!leavePolicyId) {
//       setError("Please select an Experience Based policy first.");
//       return;
//     }
//     setEditId(null);
//     setFormData({
//       ...initialForm,
//       leave_policy_id: leavePolicyId,
//       // ⭐ Auto-suggest sort order
//       sort_order: suggestedSortOrder,
//     });
//     setFormError("");
//     setError("");
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     setEditId(getTierId(item));
//     setFormData({
//       ...initialForm,
//       leave_policy_id: leavePolicyId,
//       min_service_days: item.min_service_days ?? 0,
//       annual_quota: item.annual_quota ?? 0,
//       sort_order: item.sort_order ?? 0,
//     });
//     setFormError("");
//     setError("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;
//     setShowForm(false);
//     setFormError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (saving) return;

//     const minDays = Number(formData.min_service_days);
//     const quota = Number(formData.annual_quota);
//     const sortOrder = Number(formData.sort_order);

//     if (!Number.isFinite(minDays) || minDays < 0 || minDays > MAX_SERVICE_DAYS) {
//       setFormError(`Min Service must be between 0 and ${MAX_SERVICE_DAYS}.`);
//       return;
//     }
//     if (!Number.isInteger(minDays)) {
//       setFormError("Min Service Days must be a whole number.");
//       return;
//     }
//     if (!Number.isFinite(quota) || quota < 0 || quota > MAX_ANNUAL_QUOTA) {
//       setFormError(`Annual Quota must be between 0 and ${MAX_ANNUAL_QUOTA}.`);
//       return;
//     }
//     if (!Number.isFinite(sortOrder) || sortOrder < 0) {
//       setFormError("Sort Order must be 0 or greater.");
//       return;
//     }

//     // duplicate min_service_days check
//     const existingTierForDays = existingMinDays.get(minDays);
//     if (existingTierForDays && String(existingTierForDays) !== String(editId)) {
//       setFormError(
//         `A tier with Min Service Days = ${minDays} already exists for this policy.`
//       );
//       return;
//     }

//     setSaving(true);
//     setFormError("");
//     setError("");
//     try {
//       const payload = {
//         leave_policy_id: leavePolicyId,
//         min_service_days: minDays,
//         annual_quota: quota,
//         sort_order: sortOrder,
//       };

//       if (editId) {
//         await api.put(
//           `/api/v1/experience/leave/policies/tiers/${editId}`,
//           payload
//         );
//       } else {
//         await api.post("/api/v1/experience/leave/policies/tiers", payload);
//       }

//       setSuccess(editId ? "Tier updated successfully." : "Tier added successfully.");
//       setShowForm(false);
//       setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
//       setEditId(null);
//       await fetchData();
//     } catch (err) {
//       setFormError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     const item = confirmDelete;
//     if (!item) return;
//     const id = getTierId(item);
//     if (!id) {
//       setConfirmDelete(null);
//       setError("Cannot delete: missing tier id.");
//       return;
//     }
//     setDeleting(true);
//     setError("");
//     try {
//       await api.delete(`/api/v1/experience/leave/policies/tiers/${id}`);
//       setSuccess("Tier deleted successfully.");
//       setConfirmDelete(null);
//       setDetails(null);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//       setConfirmDelete(null);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleResetSearch = () => {
//     setSearchInput("");
//     setSearch("");
//     setPage(1);
//   };

//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   const hasActiveSearch = Boolean(searchInput || search);

//   /* ---------------------------------------------------------------- */
//   /*  RENDER                                                           */
//   /* ---------------------------------------------------------------- */

//   return (
//     <div>
//       {/* ---------- header ---------- */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">
//             Experience Tiers
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Configure experience-based leave quota tiers (only for Experience Based
//             policies).
//           </p>
//         </div>
//         {isHrOrAdmin && (
//           <button
//             type="button"
//             onClick={openAdd}
//             disabled={!leavePolicyId || !selectedPolicy || optionsLoading}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
//           >
//             + Add Tier
//           </button>
//         )}
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         {/* ---------- toolbar ---------- */}
//         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
//             <select
//               value={leavePolicyId}
//               onChange={(e) => setLeavePolicyId(e.target.value)}
//               disabled={optionsLoading}
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white disabled:opacity-60"
//             >
//               <option value="">
//                 {optionsLoading
//                   ? "Loading policies…"
//                   : "Select Experience Based Policy"}
//               </option>
//               {experiencePolicies.map((p) => {
//                 const id = getPolicyId(p);
//                 if (!id) return null;
//                 return (
//                   <option key={String(id)} value={String(id)}>
//                     {getPolicyName(p)}
//                   </option>
//                 );
//               })}
//             </select>

//             <div className="relative w-full max-w-xs">
//               <input
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 placeholder="Search tiers…"
//                 autoComplete="off"
//                 disabled={!leavePolicyId}
//                 className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-sm outline-none focus:border-[#E42527] focus:bg-white disabled:opacity-60"
//               />
//               {hasActiveSearch && (
//                 <button
//                   type="button"
//                   onClick={handleResetSearch}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
//                   aria-label="Clear search"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <span className="text-sm text-slate-500">
//               {leavePolicyId ? `${total} tier${total === 1 ? "" : "s"}` : "—"}
//             </span>
//             {leavePolicyId && (
//               <button
//                 type="button"
//                 onClick={fetchData}
//                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Refresh
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ---------- warnings / banners ---------- */}
//         {!optionsLoading && experiencePolicies.length === 0 && (
//           <div className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
//             No Experience Based policies found. Create a Leave Policy with
//             Entitlement Type = &quot;Experience based&quot; first.
//           </div>
//         )}

//         {error && !showForm && (
//           <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//             <span>{error}</span>
//             <button
//               type="button"
//               onClick={() => setError("")}
//               className="text-red-400 hover:text-red-600"
//             >
//               ✕
//             </button>
//           </div>
//         )}

//         {success && !showForm && (
//           <div className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
//             <span>✓ {success}</span>
//             <button
//               type="button"
//               onClick={() => setSuccess("")}
//               className="text-emerald-400 hover:text-emerald-600"
//             >
//               ✕
//             </button>
//           </div>
//         )}

//         {/* ⭐ Tier warnings */}
//         {!loading && tierWarnings.length > 0 && (
//           <div className="mx-4 mt-3 space-y-2">
//             {tierWarnings.map((w, i) => (
//               <div
//                 key={i}
//                 className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800"
//               >
//                 {w}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ⭐ Tier preview visualization */}
//         {!loading && list.length > 0 && <TierPreview tiers={list} />}

//         {/* ---------- table ---------- */}
//         <div className="overflow-x-auto">
//           {!leavePolicyId ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               <p className="font-medium text-slate-700">
//                 Select an Experience Based policy
//               </p>
//               <p className="mt-2">
//                 Tiers are defined per policy. Pick one from the dropdown above.
//               </p>
//             </div>
//           ) : loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               Loading…
//             </div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               <p className="font-medium text-slate-700">
//                 No tiers found for this policy
//               </p>
//               <p className="mt-2">
//                 {isHrOrAdmin
//                   ? "Click Add Tier to configure the first entitlement tier."
//                   : "No tiers configured yet."}
//               </p>
//               {isHrOrAdmin && (
//                 <button
//                   type="button"
//                   onClick={openAdd}
//                   className="mt-4 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//                 >
//                   + Add First Tier
//                 </button>
//               )}
//             </div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/80">
//                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Leave Policy
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Min Service (Days)
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Annual Quota
//                   </th>
//                   <th className="px-5 py-3 font-medium text-slate-500">
//                     Sort Order
//                   </th>
//                   <th className="px-5 py-3 text-right font-medium text-slate-500">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {displayList.map((item, i) => (
//                   <tr
//                     key={getTierId(item) || i}
//                     className="hover:bg-slate-50/70"
//                   >
//                     <td className="px-5 py-3.5 text-slate-500">
//                       {(page - 1) * pageSize + i + 1}
//                     </td>
//                     <td className="px-5 py-3.5 font-medium text-slate-800">
//                       {selectedPolicy
//                         ? getPolicyName(selectedPolicy)
//                         : item.leave_policy_name || "—"}
//                     </td>
//                     <td className="px-5 py-3.5 font-medium text-slate-800">
//                       {item.min_service_days ?? "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.annual_quota ?? "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-slate-600">
//                       {item.sort_order ?? "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       <div className="inline-flex gap-1">
//                         <button
//                           type="button"
//                           onClick={() => setDetails(item)}
//                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
//                         >
//                           View
//                         </button>
//                         {isHrOrAdmin && (
//                           <>
//                             <button
//                               type="button"
//                               onClick={() => openEdit(item)}
//                               className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => setConfirmDelete(item)}
//                               className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
//                             >
//                               Delete
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
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
//           <div className="mb-10 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <h2 className="text-base font-semibold text-slate-800">
//                   {editId ? "Edit Experience Tier" : "Add Experience Tier"}
//                 </h2>
//                 <p className="mt-0.5 text-xs text-slate-500">
//                   Policy:{" "}
//                   {selectedPolicy
//                     ? getPolicyName(selectedPolicy)
//                     : leavePolicyId}
//                 </p>
//               </div>
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
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Leave Policy
//                   </label>
//                   <input
//                     type="text"
//                     value={
//                       selectedPolicy
//                         ? getPolicyName(selectedPolicy)
//                         : leavePolicyId
//                     }
//                     disabled
//                     className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
//                   />
//                   <p className="mt-1 text-xs text-slate-400">
//                     To move this tier, delete it and add under the other policy.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Min Service (Days) *
//                     </label>
//                     <input
//                       required
//                       type="number"
//                       min="0"
//                       max={MAX_SERVICE_DAYS}
//                       step="1"
//                       autoComplete="off"
//                       value={formData.min_service_days}
//                       onChange={(e) =>
//                         handleChange("min_service_days", e.target.value)
//                       }
//                       className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
//                         liveDuplicateWarning
//                           ? "border-amber-300 bg-amber-50 focus:border-amber-400"
//                           : "border-slate-200 focus:border-[#E42527]"
//                       }`}
//                     />
//                     {liveDuplicateWarning ? (
//                       <p className="mt-1 text-[11px] font-medium text-amber-700">
//                         ⚠️ {liveDuplicateWarning}
//                       </p>
//                     ) : (
//                       <p className="mt-1 text-xs text-slate-400">
//                         0 = entry level. Tiers should increase with service.
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Annual Quota *
//                     </label>
//                     <input
//                       required
//                       type="number"
//                       min="0"
//                       max={MAX_ANNUAL_QUOTA}
//                       step="0.5"
//                       autoComplete="off"
//                       value={formData.annual_quota}
//                       onChange={(e) =>
//                         handleChange("annual_quota", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   <div className="sm:col-span-2">
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Sort Order *
//                     </label>
//                     <input
//                       required
//                       type="number"
//                       min="0"
//                       step="1"
//                       autoComplete="off"
//                       value={formData.sort_order}
//                       onChange={(e) =>
//                         handleChange("sort_order", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                     <p className="mt-1 text-xs text-slate-400">
//                       Lower number = evaluated first. Tiers are displayed sorted
//                       by Min Service.
//                       {!editId && list.length > 0 && (
//                         <span className="ml-1 font-medium text-sky-600">
//                           (Auto-suggested: {suggestedSortOrder})
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 {/* ⭐ Live tier preview inside modal */}
//                 {list.length > 0 && (
//                   <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
//                     <p className="mb-2 text-xs font-semibold text-slate-600">
//                       Current tiers in this policy:
//                     </p>
//                     <div className="space-y-1">
//                       {[...list]
//                         .sort(
//                           (a, b) =>
//                             Number(a.min_service_days ?? 0) -
//                             Number(b.min_service_days ?? 0)
//                         )
//                         .map((t, i) => (
//                           <div
//                             key={getTierId(t) || i}
//                             className="flex items-center justify-between rounded bg-white px-2 py-1 text-[11px]"
//                           >
//                             <span className="text-slate-600">
//                               {t.min_service_days === 0
//                                 ? "Entry level"
//                                 : `${t.min_service_days}d+`}
//                             </span>
//                             <span className="font-semibold text-slate-800">
//                               {t.annual_quota} days
//                             </span>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
//                   Example: 0 days → 12 quota, 365 days → 15 quota, 1095 days → 18
//                   quota.
//                 </div>

//                 {formError && (
//                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//                     {formError}
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
//                   disabled={saving || !!liveDuplicateWarning}
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
//       {details && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Experience Tier
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
//                   Min {details.min_service_days ?? 0} days →{" "}
//                   {details.annual_quota ?? 0} quota
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setDetails(null)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
//               <div className="grid gap-3 sm:grid-cols-2">
//                 {[
//                   [
//                     "Policy",
//                     selectedPolicy
//                       ? getPolicyName(selectedPolicy)
//                       : details.leave_policy_name || leavePolicyId,
//                   ],
//                   ["Min Service (Days)", details.min_service_days],
//                   ["Annual Quota", details.annual_quota],
//                   ["Sort Order", details.sort_order],
//                   ["Tier ID", getTierId(details)],
//                   ["Created At", details.created_at || details.createdAt],
//                   ["Updated At", details.updated_at || details.updatedAt],
//                 ].map(([label, value]) => (
//                   <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5">
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
//                 onClick={() => setDetails(null)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//               {isHrOrAdmin && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const item = details;
//                       setDetails(null);
//                       setConfirmDelete(item);
//                     }}
//                     className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const item = details;
//                       setDetails(null);
//                       openEdit(item);
//                     }}
//                     className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//                   >
//                     Edit
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
//                 Delete experience tier?
//               </h2>
//             </div>
//             <div className="px-5 py-5 text-sm text-slate-600">
//               This will remove the tier{" "}
//               <span className="font-medium text-slate-800">
//                 Min {confirmDelete.min_service_days ?? 0} days →{" "}
//                 {confirmDelete.annual_quota ?? 0} quota
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
import { useAuthStore } from "@/app/store/authStore";

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

const PAGE_SIZE = 10;
const SUCCESS_TIMEOUT = 4000;
const MAX_SERVICE_DAYS = 36500;
const MAX_ANNUAL_QUOTA = 365;

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
]);

const initialForm = {
  leave_policy_id: "",
  min_service_days: 0,
  annual_quota: 0,
  sort_order: 0,
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatApiError(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg;
      })
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  if (err?.message === "Network Error") return "Cannot reach server.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission.";
  return err?.response?.data?.message || err?.message || "Something went wrong";
}

const getPolicyId = (p) => p?.leave_policy_id || null;
const getPolicyName = (p) => p?.policy_name || getPolicyId(p) || "—";

const getTierId = (t) => t?.tier_id || t?.experience_tier_id || t?.id || null;

const isExperienceBased = (policy) =>
  String(policy?.entitlement_type || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "") === "experiencebased";

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

// ═══════════════════════════════════════════════════════════
// TIER PREVIEW (Visual)
// ═══════════════════════════════════════════════════════════

function TierPreview({ tiers }) {
  if (!tiers || tiers.length === 0) return null;

  const sorted = [...tiers].sort(
    (a, b) => Number(a.min_service_days ?? 0) - Number(b.min_service_days ?? 0)
  );
  const maxQuota = Math.max(...sorted.map((t) => Number(t.annual_quota || 0)), 1);

  return (
    <div className="mx-4 mt-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
        Tier Preview
      </p>
      <div className="space-y-2">
        {sorted.map((t, i) => {
          const quota = Number(t.annual_quota || 0);
          const pct = Math.round((quota / maxQuota) * 100);
          return (
            <div key={getTierId(t) || i} className="flex items-center gap-3">
              <div className="w-24 shrink-0 text-right text-xs font-medium text-slate-600">
                {t.min_service_days === 0
                  ? "Entry"
                  : `${t.min_service_days}d+`}
              </div>
              <div className="h-6 flex-1 overflow-hidden rounded-full bg-sky-100">
                <div
                  className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-sky-400 to-sky-600 pr-2"
                  style={{ width: `${Math.max(pct, 12)}%` }}
                >
                  <span className="text-[10px] font-bold text-white">{quota}</span>
                </div>
              </div>
              <div className="w-14 shrink-0 text-xs font-semibold text-slate-700">
                {quota}d
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-sky-700">
        Employee jitne din service karega, usse highest matching tier ka quota milega.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════

export default function LeavePolicyExperienceTiersPage() {
  const user = useAuthStore((state) => state.user);
  const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

  // List
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Policies
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [leavePolicyId, setLeavePolicyId] = useState("");
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const successTimerRef = useRef(null);

  // Modals
  const [details, setDetails] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ═════════════════════════════════════════════════════════
  // SUCCESS
  // ═════════════════════════════════════════════════════════

  const showSuccessMsg = useCallback((msg) => {
    setSuccess(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccess(""), SUCCESS_TIMEOUT);
  }, []);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  // ═════════════════════════════════════════════════════════
  // LOAD POLICIES (only experience_based)
  // ═════════════════════════════════════════════════════════

  useEffect(() => {
    let cancelled = false;
    setOptionsLoading(true);

    api
      .get("/api/v1/leave/policies", { params: { page: 1, page_size: 200 } })
      .then((res) => {
        if (cancelled) return;
        const policies = res.data?.policies || [];
        setLeavePolicies(Array.isArray(policies) ? policies : []);

        const exp = (policies || []).filter(isExperienceBased);
        if (exp.length > 0) {
          setLeavePolicyId((prev) => prev || String(getPolicyId(exp[0])));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(formatApiError(err));
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const experiencePolicies = useMemo(
    () => leavePolicies.filter(isExperienceBased),
    [leavePolicies]
  );

  const selectedPolicy = useMemo(
    () =>
      experiencePolicies.find(
        (p) => String(getPolicyId(p)) === String(leavePolicyId)
      ),
    [experiencePolicies, leavePolicyId]
  );

  // ═════════════════════════════════════════════════════════
  // SEARCH DEBOUNCE
  // ═════════════════════════════════════════════════════════

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [leavePolicyId]);

  // ═════════════════════════════════════════════════════════
  // FETCH TIERS
  // ═════════════════════════════════════════════════════════

  const fetchData = useCallback(async () => {
    if (!leavePolicyId) {
      setList([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/api/v1/leave/policies/${leavePolicyId}/experience-tiers`,
        {
          params: {
            page,
            page_size: PAGE_SIZE,
            ...(search ? { search } : {}),
          },
        }
      );

      const items = res.data?.experience_tiers || res.data?.tiers || [];
      setList(Array.isArray(items) ? items : []);
      setTotal(Number(res.data?.total) || items.length);
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [leavePolicyId, page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ═════════════════════════════════════════════════════════
  // DERIVED
  // ═════════════════════════════════════════════════════════

  const existingMinDays = useMemo(() => {
    const m = new Map();
    list.forEach((t) => {
      const days = Number(t.min_service_days);
      if (Number.isFinite(days)) m.set(days, getTierId(t));
    });
    return m;
  }, [list]);

  const displayList = useMemo(() => {
    return [...list].sort(
      (a, b) =>
        Number(a.min_service_days ?? 0) - Number(b.min_service_days ?? 0)
    );
  }, [list]);

  const suggestedSortOrder = useMemo(() => {
    if (!list.length) return 0;
    const maxSort = Math.max(...list.map((t) => Number(t.sort_order ?? 0)));
    return Number.isFinite(maxSort) ? maxSort + 1 : list.length;
  }, [list]);

  const liveDuplicateWarning = useMemo(() => {
    if (!showForm) return null;
    const days = Number(formData.min_service_days);
    if (!Number.isFinite(days)) return null;
    const existingId = existingMinDays.get(days);
    if (existingId && String(existingId) !== String(editId)) {
      return `Min Service Days = ${days} already exists`;
    }
    return null;
  }, [showForm, formData.min_service_days, existingMinDays, editId]);

  // ═════════════════════════════════════════════════════════
  // FORM OPEN / CLOSE
  // ═════════════════════════════════════════════════════════

  const openAdd = () => {
    if (!leavePolicyId) {
      setError("Please select an Experience Based policy first.");
      return;
    }
    setEditId(null);
    setFormData({
      ...initialForm,
      leave_policy_id: leavePolicyId,
      sort_order: suggestedSortOrder,
    });
    setFormError("");
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(getTierId(item));
    setFormData({
      leave_policy_id: leavePolicyId,
      min_service_days: item.min_service_days ?? 0,
      annual_quota: item.annual_quota ?? 0,
      sort_order: item.sort_order ?? 0,
    });
    setFormError("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setFormError("");
    setEditId(null);
  };

  // ═════════════════════════════════════════════════════════
  // SUBMIT (ADD / EDIT)
  // ═════════════════════════════════════════════════════════

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const minDays = Number(formData.min_service_days);
    const quota = Number(formData.annual_quota);
    const sortOrder = Number(formData.sort_order);

    if (!Number.isFinite(minDays) || minDays < 0 || minDays > MAX_SERVICE_DAYS) {
      setFormError(`Min Service must be between 0 and ${MAX_SERVICE_DAYS}.`);
      return;
    }
    if (!Number.isInteger(minDays)) {
      setFormError("Min Service Days must be a whole number.");
      return;
    }
    if (!Number.isFinite(quota) || quota < 0 || quota > MAX_ANNUAL_QUOTA) {
      setFormError(`Annual Quota must be between 0 and ${MAX_ANNUAL_QUOTA}.`);
      return;
    }
    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      setFormError("Sort Order must be 0 or greater.");
      return;
    }

    const existingTierForDays = existingMinDays.get(minDays);
    if (existingTierForDays && String(existingTierForDays) !== String(editId)) {
      setFormError(
        `A tier with Min Service Days = ${minDays} already exists for this policy.`
      );
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        leave_policy_id: leavePolicyId,
        min_service_days: minDays,
        annual_quota: quota,
        sort_order: sortOrder,
      };

      if (editId) {
        await api.put(
          `/api/v1/leave/policies/experience-tiers/${editId}`,
          payload
        );
        showSuccessMsg("Tier updated successfully");
      } else {
        await api.post("/api/v1/leave/policies/experience-tiers", payload);
        showSuccessMsg("Tier added successfully");
      }

      closeForm();
      await fetchData();
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  // ═════════════════════════════════════════════════════════
  // DELETE
  // ═════════════════════════════════════════════════════════

  const handleDelete = async () => {
    const item = confirmDelete;
    if (!item) return;
    const id = getTierId(item);
    if (!id) {
      setConfirmDelete(null);
      setError("Cannot delete: missing tier id.");
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/v1/leave/policies/experience-tiers/${id}`);
      showSuccessMsg("Tier deleted successfully");
      setConfirmDelete(null);
      setDetails(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  // ═════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
            Experience Tiers
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Configure experience-based leave quota tiers
          </p>
        </div>
        {isHrOrAdmin && (
          <button
            type="button"
            onClick={openAdd}
            disabled={!leavePolicyId || !selectedPolicy || optionsLoading}
            className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
          >
            + Add Tier
          </button>
        )}
      </div>

      {/* Feedback */}
      {error && !showForm && (
        <div className="mb-4 flex items-start gap-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError("")} className="opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span className="flex-1">✓ {success}</span>
          <button onClick={() => setSuccess("")} className="opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={leavePolicyId}
              onChange={(e) => setLeavePolicyId(e.target.value)}
              disabled={optionsLoading}
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] disabled:opacity-60"
            >
              <option value="">
                {optionsLoading ? "Loading policies…" : "Select Experience Based Policy"}
              </option>
              {experiencePolicies.map((p) => {
                const id = getPolicyId(p);
                return id ? (
                  <option key={id} value={String(id)}>
                    {getPolicyName(p)}
                  </option>
                ) : null;
              })}
            </select>

            <div className="relative w-full max-w-xs">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tiers…"
                disabled={!leavePolicyId}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-sm outline-none focus:border-[#E42527] disabled:opacity-60"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <span className="text-sm text-slate-500">
            {leavePolicyId ? `${total} tier${total === 1 ? "" : "s"}` : "—"}
          </span>
        </div>

        {/* Warning */}
        {!optionsLoading && experiencePolicies.length === 0 && (
          <div className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            No Experience Based policies found. Create a Leave Policy with
            Entitlement Type = “Experience based” first.
          </div>
        )}

        {/* Preview */}
        {!loading && list.length > 0 && <TierPreview tiers={list} />}

        {/* Table */}
        <div className="overflow-x-auto">
          {!leavePolicyId ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Please select an Experience Based policy
            </div>
          ) : loading ? (
            <div className="py-20 text-center text-sm text-slate-500">Loading…</div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-slate-500">No tiers found for this policy</p>
              {isHrOrAdmin && (
                <button
                  onClick={openAdd}
                  className="mt-3 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                >
                  + Add First Tier
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 font-medium text-slate-500">#</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Min Service (Days)</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Annual Quota</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Sort Order</th>
                  <th className="px-5 py-3 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayList.map((item, i) => (
                  <tr key={getTierId(item) || i} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 text-slate-500">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {item.min_service_days ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.annual_quota ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.sort_order ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => setDetails(item)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          View
                        </button>
                        {isHrOrAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(item)}
                              className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={!canPrev}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={!canNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════ ADD / EDIT MODAL ══════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div className="mb-10 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  {editId ? "Edit Experience Tier" : "Add Experience Tier"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Policy: {selectedPolicy ? getPolicyName(selectedPolicy) : leavePolicyId}
                </p>
              </div>
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
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Leave Policy
                  </label>
                  <input
                    type="text"
                    value={selectedPolicy ? getPolicyName(selectedPolicy) : leavePolicyId}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Min Service (Days) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      max={MAX_SERVICE_DAYS}
                      step="1"
                      value={formData.min_service_days}
                      onChange={(e) =>
                        setFormData({ ...formData, min_service_days: e.target.value })
                      }
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${
                        liveDuplicateWarning
                          ? "border-amber-300 bg-amber-50"
                          : "border-slate-200 focus:border-[#E42527]"
                      }`}
                    />
                    {liveDuplicateWarning ? (
                      <p className="mt-1 text-[11px] font-medium text-amber-700">
                        ⚠️ {liveDuplicateWarning}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">
                        0 = entry level
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Annual Quota <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      max={MAX_ANNUAL_QUOTA}
                      step="0.5"
                      value={formData.annual_quota}
                      onChange={(e) =>
                        setFormData({ ...formData, annual_quota: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sort Order <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={formData.sort_order}
                      onChange={(e) =>
                        setFormData({ ...formData, sort_order: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                    {!editId && list.length > 0 && (
                      <p className="mt-1 text-xs text-sky-600">
                        Auto-suggested: {suggestedSortOrder}
                      </p>
                    )}
                  </div>
                </div>

                {formError && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {formError}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t px-5 py-4">
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
                  disabled={saving || !!liveDuplicateWarning}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Add Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ DETAILS MODAL ══════════ */}
      {details && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetails(null);
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Experience Tier
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  Min {details.min_service_days ?? 0} days → {details.annual_quota ?? 0} quota
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 px-5 py-5">
              {[
                ["Policy", selectedPolicy ? getPolicyName(selectedPolicy) : leavePolicyId],
                ["Min Service (Days)", details.min_service_days],
                ["Annual Quota", details.annual_quota],
                ["Sort Order", details.sort_order],
                ["Tier ID", getTierId(details)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {value ?? "—"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {isHrOrAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDelete(details);
                      setDetails(null);
                    }}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openEdit(details);
                      setDetails(null);
                    }}
                    className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DELETE CONFIRM ══════════ */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Delete experience tier?
              </h2>
            </div>
            <div className="px-5 py-5 text-sm text-slate-600">
              This will remove the tier{" "}
              <span className="font-medium text-slate-800">
                Min {confirmDelete.min_service_days ?? 0} days →{" "}
                {confirmDelete.annual_quota ?? 0} quota
              </span>
              . This action cannot be undone.
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
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