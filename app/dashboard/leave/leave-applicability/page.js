
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/lib/api";

// const initialForm = {
//   leave_policy_id: "",
//   criteria_type: "department",
//   criteria_value: "",
//   is_exception: false,
// };

// const criteriaTypeOptions = [
//   { value: "department", label: "Department" },
//   { value: "location", label: "Location" },
//   { value: "employment_type", label: "Employment Type" },
//   { value: "gender", label: "Gender" },
//   { value: "role", label: "Role" },
//   { value: "employee_id", label: "Employee ID" },
// ];

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

// const getItems = (response) => {
//   const data = response?.data?.data ?? response?.data ?? [];
//   if (Array.isArray(data)) return data;
//   return (
//     data?.items ??
//     data?.results ??
//     data?.policies ??
//     data?.leave_policies ??
//     data?.applicability_rules ??
//     data?.rules ??
//     data?.data ??
//     response?.data?.policies ??
//     response?.data?.leave_policies ??
//     []
//   );
// };

// const getPolicyId = (policy) =>
//   policy.leave_policy_id || policy.policy_id || policy.id || policy._id;

// const getPolicyName = (policy) =>
//   policy.policy_name ||
//   policy.leave_policy_name ||
//   policy.name ||
//   getPolicyId(policy);

// const getCriteriaLabel = (type) =>
//   criteriaTypeOptions.find((o) => o.value === type)?.label ||
//   (type || "").replace(/_/g, " ");

// const getMasterItems = (response, keys = []) => {
//   const data = response?.data?.data ?? response?.data ?? [];
//   if (Array.isArray(data)) return data;
//   return keys.reduce((items, key) => items || data?.[key], null) ||
//     data?.items ||
//     data?.results ||
//     data?.data ||
//     [];
// };

// const getOptionId = (item) =>
//   item?.id ||
//   item?.department_id ||
//   item?.employee_id ||
//   item?.location_id ||
//   item?.employment_type_id ||
//   item?.designation_id ||
//   item?.employment_type_code ||
//   item?.code ||
//   item?._id;

// const getEmployeeName = (employee) =>
//   employee?.name ||
//   [employee?.first_name, employee?.last_name].filter(Boolean).join(" ") ||
//   employee?.company_email ||
//   getOptionId(employee);

// const criteriaValueConfig = {
//   department: { label: "Department", itemsKey: "departments" },
//   location: { label: "Location", itemsKey: "locations" },
//   employment_type: { label: "Employment Type", itemsKey: "employment_types" },
//   role: { label: "Role", itemsKey: "designations" },
//   employee_id: { label: "Employee", itemsKey: "employees" },
// };

// const getCriteriaOptionLabel = (type, item) => {
//   if (type === "employee_id") return getEmployeeName(item);
//   return (
//     item?.department_name ||
//     item?.location_name ||
//     item?.employment_type_name ||
//     item?.employment_type ||
//     item?.designation_name ||
//     item?.job_title ||
//     item?.name ||
//     item?.title ||
//     getOptionId(item)
//   );
// };

// export default function LeaveApplicabilityRulesPage() {
//   const [list, setList] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(12);
//   const [total, setTotal] = useState(0);
//   const [leavePolicyId, setLeavePolicyId] = useState(""); // "" = All
//   const [leavePolicies, setLeavePolicies] = useState([]);
//   const [selectedRule, setSelectedRule] = useState(null);
//   const [criteriaMasters, setCriteriaMasters] = useState({
//     departments: [],
//     locations: [],
//     employment_types: [],
//     designations: [],
//     employees: [],
//   });

//   // Load policies
//   useEffect(() => {
//     const fetchPolicies = async () => {
//       try {
//         const response = await api.get("/api/v1/leave/policies", {
//           params: { page: 1, page_size: 200 },
//         });
//         const policies = getItems(response);
//         setLeavePolicies(Array.isArray(policies) ? policies : []);
//       } catch (err) {
//         console.error("Policies error:", err);
//         setLeavePolicies([]);
//       }
//     };
//     fetchPolicies();
//   }, []);

//   useEffect(() => {
//     const fetchCriteriaMasters = async () => {
//       const requests = {
//         departments: api.get("/api/v1/get/departments", { params: { page: 1, page_size: 500 } }),
//         locations: api.get("/api/v1/get/location/master", { params: { page: 1, page_size: 500 } }),
//         employment_types: api.get("/api/v1/get/employment/type"),
//         designations: api.get("/api/v1/get/designations", { params: { page: 1, page_size: 500 } }),
//         employees: api.get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } }),
//       };
//       const entries = await Promise.all(
//         Object.entries(requests).map(async ([key, request]) => {
//           try {
//             const response = await request;
//             const keys = [key, key.replace(/s$/, "")];
//             return [key, getMasterItems(response, keys)];
//           } catch {
//             return [key, []];
//           }
//         })
//       );
//       setCriteriaMasters(Object.fromEntries(entries));
//     };

//     fetchCriteriaMasters();
//   }, []);

//   // Load rules (default = ALL)
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = {
//         page,
//         page_size: pageSize,
//         search: search || undefined,
//       };
//       if (leavePolicyId) {
//         params.leave_policy_id = leavePolicyId;
//       }

//       const res = await api.get("/api/v1/leave/applicability/rules", { params });

//       const items = getItems(res);
//       setList(Array.isArray(items) ? items : []);
//       setTotal(
//         res.data?.total ??
//           res.data?.count ??
//           res.data?.data?.total ??
//           items.length
//       );
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [leavePolicyId, page, pageSize, search]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchData(), 0);
//     return () => clearTimeout(t);
//   }, [fetchData]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const openAdd = () => {
//     setEditId(null);
//     setFormData({
//       ...initialForm,
//       leave_policy_id: leavePolicyId || (leavePolicies[0] ? String(getPolicyId(leavePolicies[0])) : ""),
//     });
//     setError("");
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     setEditId(item.applicability_id || item.id);
//     setFormData({
//       ...initialForm,
//       leave_policy_id: item.leave_policy_id || "",
//       criteria_type: item.criteria_type || "department",
//       criteria_value: item.criteria_value || "",
//       is_exception: !!item.is_exception,
//     });
//     setError("");
//     setShowForm(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       if (editId) {
//         await api.put(`/api/v1/leave/applicability/rules/${editId}`, {
//           criteria_type: formData.criteria_type,
//           criteria_value: formData.criteria_value,
//           is_exception: !!formData.is_exception,
//         });
//       } else {
//         await api.post("/api/v1/leave/applicability/rules/bulk", [
//           {
//             leave_policy_id: formData.leave_policy_id,
//             criteria_type: formData.criteria_type,
//             criteria_value: formData.criteria_value,
//             is_exception: !!formData.is_exception,
//           },
//         ]);
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

//   const handleDelete = async (item) => {
//     if (!confirm("Are you sure you want to delete this rule?")) return;
//     try {
//       await api.delete(
//         `/api/v1/leave/applicability/rules/${item.applicability_id || item.id}`
//       );
//       setSelectedRule(null);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     }
//   };

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   const getPolicyNameById = (id) => {
//     const policy = leavePolicies.find(
//       (p) => String(getPolicyId(p)) === String(id)
//     );
//     return policy ? getPolicyName(policy) : id || "—";
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">
//             Leave Applicability Rules
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Configure which employees can access leave policies
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={openAdd}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
//         >
//           + Add Rule
//         </button>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         {/* Toolbar */}
//         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
//             <select
//               value={leavePolicyId}
//               onChange={(e) => {
//                 setLeavePolicyId(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//             >
//               <option value="">All Policies</option>
//               {leavePolicies.map((policy) => {
//                 const id = getPolicyId(policy);
//                 return id ? (
//                   <option key={id} value={String(id)}>
//                     {getPolicyName(policy)}
//                   </option>
//                 ) : null;
//               })}
//             </select>

//             <input
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search rules..."
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//             />
//           </div>
//           <span className="text-sm text-slate-500">{total} rules</span>
//         </div>

//         {error && !showForm && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {/* Cards */}
//         {!loading && list.length > 0 && (
//           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
//             {list.map((item, index) => (
//               <button
//                 type="button"
//                 key={item.applicability_id || item.id || index}
//                 onClick={() => setSelectedRule(item)}
//                 className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="min-w-0">
//                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                       Applicability Rule
//                     </p>
//                     <h3 className="mt-1 truncate text-base font-semibold text-slate-800 capitalize">
//                       {getCriteriaLabel(item.criteria_type)}
//                     </h3>
//                     <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
//                       {item.criteria_value || "—"}
//                     </span>
//                   </div>
//                   <span
//                     className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
//                       item.is_exception
//                         ? "bg-amber-50 text-amber-700"
//                         : "bg-emerald-50 text-emerald-700"
//                     }`}
//                   >
//                     {item.is_exception ? "Exception" : "Include"}
//                   </span>
//                 </div>

//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   <div className="rounded-xl bg-slate-50 px-3 py-2">
//                     <p className="text-xs text-slate-400">Policy</p>
//                     <p className="mt-0.5 truncate font-semibold text-slate-700">
//                       {getPolicyNameById(item.leave_policy_id)}
//                     </p>
//                   </div>
//                   <div className="rounded-xl bg-slate-50 px-3 py-2">
//                     <p className="text-xs text-slate-400">Type</p>
//                     <p className="mt-0.5 font-semibold text-slate-700">
//                       {item.is_exception ? "Exclude" : "Include"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
//                   <span className="text-xs font-semibold text-[#E42527] opacity-0 transition group-hover:opacity-100">
//                     View details →
//                   </span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Loading / Empty */}
//         <div>
//           {loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               Loading...
//             </div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               No rules found
//             </div>
//           ) : null}
//         </div>

//         {/* Pagination */}
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

//       {/* Add / Edit Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Applicability Rule" : "Add Applicability Rule"}
//               </h2>
//               <button
//                 type="button"
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
//                       Leave Policy *
//                     </label>
//                     <select
//                       required
//                       value={formData.leave_policy_id}
//                       onChange={(e) =>
//                         handleChange("leave_policy_id", e.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]/30"
//                     >
//                       <option value="">Select leave policy</option>
//                       {leavePolicies.map((policy) => {
//                         const id = getPolicyId(policy);
//                         return id ? (
//                           <option key={id} value={String(id)}>
//                             {getPolicyName(policy)}
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Criteria Type *
//                     </label>
//                     <select
//                       value={formData.criteria_type}
//                       onChange={(e) => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           criteria_type: e.target.value,
//                           criteria_value: "",
//                         }));
//                       }}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       {criteriaTypeOptions.map((opt) => (
//                         <option key={opt.value} value={opt.value}>
//                           {opt.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="sm:col-span-2">
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Criteria Value *
//                     </label>
//                     {formData.criteria_type === "gender" ? (
//                       <select
//                         required
//                         value={formData.criteria_value}
//                         onChange={(e) =>
//                           handleChange("criteria_value", e.target.value)
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       >
//                         <option value="">Select gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                       </select>
//                     ) : criteriaValueConfig[formData.criteria_type] ? (
//                       <select
//                         required
//                         value={formData.criteria_value}
//                         onChange={(e) =>
//                           handleChange("criteria_value", e.target.value)
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       >
//                         <option value="">Select {criteriaValueConfig[formData.criteria_type].label.toLowerCase()}</option>
//                         {(criteriaMasters[criteriaValueConfig[formData.criteria_type].itemsKey] || []).map((item) => {
//                           const id = getOptionId(item);
//                           return id ? (
//                             <option key={id} value={String(id)}>
//                               {getCriteriaOptionLabel(formData.criteria_type, item)}
//                             </option>
//                           ) : null;
//                         })}
//                       </select>
//                     ) : (
//                       <input
//                         required
//                         value={formData.criteria_value}
//                         onChange={(e) =>
//                           handleChange("criteria_value", e.target.value)
//                         }
//                         placeholder="Enter criteria value"
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       />
//                     )}
//                   </div>

//                   <div className="sm:col-span-2">
//                     <label className="flex items-center gap-2 text-sm text-slate-700">
//                       <input
//                         type="checkbox"
//                         checked={!!formData.is_exception}
//                         onChange={(e) =>
//                           handleChange("is_exception", e.target.checked)
//                         }
//                         className="rounded border-slate-300 text-[#E42527] focus:ring-[#E42527]"
//                       />
//                       <span className="font-medium">Is Exception</span>
//                     </label>
//                     <p className="mt-1 text-xs text-slate-500">
//                       If checked, this rule will act as an exception (exclude
//                       matching employees instead of including them).
//                     </p>
//                   </div>
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

//       {/* Details Modal */}
//       {selectedRule && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Rule details
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800 capitalize">
//                   {getCriteriaLabel(selectedRule.criteria_type)}
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedRule(null)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-3 px-5 py-5">
//               <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                 <p className="text-xs text-slate-400">Leave Policy</p>
//                 <p className="mt-1 text-sm font-medium text-slate-800">
//                   {getPolicyNameById(selectedRule.leave_policy_id)}
//                 </p>
//               </div>
//               <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                 <p className="text-xs text-slate-400">Criteria Type</p>
//                 <p className="mt-1 text-sm font-medium capitalize text-slate-800">
//                   {getCriteriaLabel(selectedRule.criteria_type)}
//                 </p>
//               </div>
//               <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                 <p className="text-xs text-slate-400">Criteria Value</p>
//                 <p className="mt-1 break-all text-sm font-medium text-slate-800">
//                   {selectedRule.criteria_value || "—"}
//                 </p>
//               </div>
//               <div className="rounded-lg bg-slate-50 px-3 py-2.5">
//                 <p className="text-xs text-slate-400">Rule Type</p>
//                 <p className="mt-1 text-sm font-medium text-slate-800">
//                   {selectedRule.is_exception
//                     ? "Exception (Exclude matching employees)"
//                     : "Include matching employees"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => handleDelete(selectedRule)}
//                 className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//               >
//                 Delete
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSelectedRule(null)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedRule(null);
//                   openEdit(selectedRule);
//                 }}
//                 className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//               >
//                 Edit rule
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

const initialForm = {
  leave_policy_id: "",
  criteria_type: "department",
  criteria_value: "",
  is_exception: false,
};

const criteriaTypeOptions = [
  { value: "department", label: "Department" },
  { value: "location", label: "Location" },
  { value: "employment_type", label: "Employment Type" },
  { value: "gender", label: "Gender" },
  { value: "role", label: "Role" },
  { value: "employee_id", label: "Employee ID" },
];

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
    data?.policies ??
    data?.leave_policies ??
    data?.applicability_rules ??
    data?.rules ??
    data?.data ??
    []
  );
};

const getPolicyId = (policy) =>
  policy?.leave_policy_id || policy?.policy_id || policy?.id || policy?._id;

const getPolicyName = (policy) =>
  policy?.policy_name ||
  policy?.leave_policy_name ||
  policy?.name ||
  getPolicyId(policy);

const getCriteriaLabel = (type) =>
  criteriaTypeOptions.find((o) => o.value === type)?.label ||
  (type || "").replace(/_/g, " ");

const getMasterItems = (response, keys = []) => {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return (
    keys.reduce((items, key) => items || data?.[key], null) ||
    data?.items ||
    data?.results ||
    data?.data ||
    []
  );
};

const getOptionId = (item) =>
  item?.id ||
  item?.department_id ||
  item?.employee_id ||
  item?.location_id ||
  item?.employment_type_id ||
  item?.designation_id ||
  item?.employment_type_code ||
  item?.code ||
  item?._id;

const getEmployeeName = (employee) =>
  employee?.name ||
  [employee?.first_name, employee?.last_name].filter(Boolean).join(" ") ||
  employee?.company_email ||
  getOptionId(employee);

const criteriaValueConfig = {
  department: { label: "Department", itemsKey: "departments" },
  location: { label: "Location", itemsKey: "locations" },
  employment_type: { label: "Employment Type", itemsKey: "employment_types" },
  role: { label: "Role", itemsKey: "designations" },
  employee_id: { label: "Employee", itemsKey: "employees" },
};

const getCriteriaOptionLabel = (type, item) => {
  if (type === "employee_id") return getEmployeeName(item);
  return (
    item?.department_name ||
    item?.location_name ||
    item?.employment_type_name ||
    item?.employment_type ||
    item?.designation_name ||
    item?.job_title ||
    item?.name ||
    item?.title ||
    getOptionId(item)
  );
};

export default function LeaveApplicabilityRulesPage() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [leavePolicyId, setLeavePolicyId] = useState("");
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [criteriaMasters, setCriteriaMasters] = useState({
    departments: [],
    locations: [],
    employment_types: [],
    designations: [],
    employees: [],
  });

  // Bulk related states
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkSelectedValues, setBulkSelectedValues] = useState([]);
  const [bulkPolicyId, setBulkPolicyId] = useState("");
  const [bulkCriteriaType, setBulkCriteriaType] = useState("employee_id");
  const [bulkIsException, setBulkIsException] = useState(false);

  // Load policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await api.get("/api/v1/leave/policies", {
          params: { page: 1, page_size: 200 },
        });
        setLeavePolicies(getItems(response) || []);
      } catch {
        setLeavePolicies([]);
      }
    };
    fetchPolicies();
  }, []);

  // Load masters
  useEffect(() => {
    const fetchCriteriaMasters = async () => {
      const requests = {
        departments: api.get("/api/v1/get/departments", { params: { page: 1, page_size: 500 } }),
        locations: api.get("/api/v1/get/location/master", { params: { page: 1, page_size: 500 } }),
        employment_types: api.get("/api/v1/get/employment/type"),
        designations: api.get("/api/v1/get/designations", { params: { page: 1, page_size: 500 } }),
        employees: api.get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } }),
      };

      const entries = await Promise.all(
        Object.entries(requests).map(async ([key, request]) => {
          try {
            const response = await request;
            return [key, getMasterItems(response, [key, key.replace(/s$/, "")])];
          } catch {
            return [key, []];
          }
        })
      );
      setCriteriaMasters(Object.fromEntries(entries));
    };
    fetchCriteriaMasters();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, page_size: pageSize, search: search || undefined };
      if (leavePolicyId) params.leave_policy_id = leavePolicyId;

      const res = await api.get("/api/v1/leave/applicability/rules", { params });
      const items = getItems(res);
      setList(Array.isArray(items) ? items : []);
      setTotal(res.data?.total ?? res.data?.count ?? items.length);
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [leavePolicyId, page, pageSize, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchData(), 0);
    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  const openAdd = () => {
    setEditId(null);
    setIsBulkMode(false);
    setFormData({
      ...initialForm,
      leave_policy_id: leavePolicyId || (leavePolicies[0] ? String(getPolicyId(leavePolicies[0])) : ""),
    });
    setError("");
    setShowForm(true);
  };

  const openBulkAdd = () => {
    setEditId(null);
    setIsBulkMode(true);
    setBulkPolicyId(leavePolicyId || (leavePolicies[0] ? String(getPolicyId(leavePolicies[0])) : ""));
    setBulkCriteriaType("employee_id");
    setBulkSelectedValues([]);
    setBulkIsException(false);
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.applicability_id || item.id);
    setIsBulkMode(false);
    setFormData({
      leave_policy_id: item.leave_policy_id || "",
      criteria_type: item.criteria_type || "department",
      criteria_value: item.criteria_value || "",
      is_exception: !!item.is_exception,
    });
    setError("");
    setShowForm(true);
  };

  const getNewCriteriaValues = async (policyId, criteriaType, values) => {
    const response = await api.get("/api/v1/leave/applicability/rules", {
      params: { page: 1, page_size: 1000, leave_policy_id: policyId },
    });
    const existingRules = getItems(response);
    const existingValues = new Set(
      (Array.isArray(existingRules) ? existingRules : [])
        .filter((rule) => rule.criteria_type === criteriaType)
        .map((rule) => String(rule.criteria_value))
    );
    return values.filter((value) => !existingValues.has(String(value)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (isBulkMode) {
        // Bulk Create
        if (!bulkPolicyId) {
          setError("Please select Leave Policy");
          setSaving(false);
          return;
        }
        if (bulkSelectedValues.length === 0) {
          setError("Please select at least one value");
          setSaving(false);
          return;
        }

        const newValues = await getNewCriteriaValues(
          bulkPolicyId,
          bulkCriteriaType,
          bulkSelectedValues
        );

        if (newValues.length === 0) {
          setError("Selected values already have a rule for this leave policy.");
          return;
        }

        const payload = newValues.map((value) => ({
          leave_policy_id: bulkPolicyId,
          criteria_type: bulkCriteriaType,
          criteria_value: value,
          is_exception: bulkIsException,
        }));

        await api.post("/api/v1/leave/applicability/rules/bulk", payload);
      } else if (editId) {
        // Update
        if (!formData.leave_policy_id) {
          setError("Leave Policy is required");
          return;
        }

        await api.put(`/api/v1/leave/applicability/rules/${editId}`, {
          leave_policy_id: formData.leave_policy_id,
          criteria_type: formData.criteria_type,
          criteria_value: formData.criteria_value,
          is_exception: !!formData.is_exception,
        });
      } else {
        // Single Create
        if (!formData.leave_policy_id) {
          setError("Please select Leave Policy");
          return;
        }

        const newValues = await getNewCriteriaValues(
          formData.leave_policy_id,
          formData.criteria_type,
          [formData.criteria_value]
        );

        if (newValues.length === 0) {
          setError("This value already has a rule for this leave policy.");
          return;
        }

        await api.post("/api/v1/leave/applicability/rules", {
          leave_policy_id: formData.leave_policy_id,
          criteria_type: formData.criteria_type,
          criteria_value: formData.criteria_value,
          is_exception: !!formData.is_exception,
        });
      }

      setShowForm(false);
      setFormData(initialForm);
      setEditId(null);
      setIsBulkMode(false);
      setBulkSelectedValues([]);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    try {
      await api.delete(`/api/v1/leave/applicability/rules/${item.applicability_id || item.id}`);
      setSelectedRule(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const getPolicyNameById = (id) => {
    const policy = leavePolicies.find((p) => String(getPolicyId(p)) === String(id));
    return policy ? getPolicyName(policy) : id || "—";
  };

  const getCriteriaValueLabel = (type, value) => {
    if (!value) return "—";
    if (type === "gender") return value.charAt(0).toUpperCase() + value.slice(1);

    const config = criteriaValueConfig[type];
    if (!config) return value;

    const items = criteriaMasters[config.itemsKey] || [];
    const found = items.find((item) => String(getOptionId(item)) === String(value));
    return found ? getCriteriaOptionLabel(type, found) : value;
  };

  const toggleBulkValue = (value) => {
    setBulkSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const selectAllBulk = () => {
    const config = criteriaValueConfig[bulkCriteriaType];
    if (!config) return;
      const items = criteriaMasters[config.itemsKey] || [];
      const allIds = items.map((item) => String(getOptionId(item))).filter(Boolean);
    setBulkSelectedValues(allIds);
  };

  const clearAllBulk = () => setBulkSelectedValues([]);

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Leave Applicability Rules</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Configure which employees can access leave policies
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openBulkAdd}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E42527] px-4 py-2.5 text-sm font-medium text-[#E42527] hover:bg-red-50"
          >
            Bulk Add
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
          >
            + Add Rule
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={leavePolicyId}
              onChange={(e) => {
                setLeavePolicyId(e.target.value);
                setPage(1);
              }}
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
            >
              <option value="">All Policies</option>
              {leavePolicies.map((policy, index) => {
                const id = getPolicyId(policy);
                return id ? (
                  <option key={`${id}-${index}`} value={String(id)}>
                    {getPolicyName(policy)}
                  </option>
                ) : null;
              })}
            </select>

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search rules..."
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
            />
          </div>
          <span className="text-sm text-slate-500">{total} rules</span>
        </div>

        {error && !showForm && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        {/* Cards */}
        {!loading && list.length > 0 && (
          <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((item, index) => (
              <button
                type="button"
                key={item.applicability_id || item.id || index}
                onClick={() => setSelectedRule(item)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Applicability Rule
                    </p>
                    <h3 className="mt-1 truncate text-base font-semibold text-slate-800 capitalize">
                      {getCriteriaLabel(item.criteria_type)}
                    </h3>
                    <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {getCriteriaValueLabel(item.criteria_type, item.criteria_value)}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                      item.is_exception ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.is_exception ? "Exception" : "Include"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-400">Policy</p>
                    <p className="mt-0.5 truncate font-semibold text-slate-700">
                      {getPolicyNameById(item.leave_policy_id)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-400">Type</p>
                    <p className="mt-0.5 font-semibold text-slate-700">
                      {item.is_exception ? "Exclude" : "Include"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
        ) : list.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500">No rules found</div>
        ) : null}

        {/* Pagination */}
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

      {/* ===================== FORM MODAL ===================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {isBulkMode
                  ? "Bulk Add Applicability Rules"
                  : editId
                  ? "Edit Applicability Rule"
                  : "Add Applicability Rule"}
              </h2>
              <button
                type="button"
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
                {isBulkMode ? (
                  /* ================= BULK FORM ================= */
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Leave Policy *
                        </label>
                        <select
                          required
                          value={bulkPolicyId}
                          onChange={(e) => setBulkPolicyId(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        >
                          <option value="">Select leave policy</option>
                          {leavePolicies.map((policy, index) => {
                            const id = getPolicyId(policy);
                            return id ? (
                              <option key={`${id}-${index}`} value={String(id)}>
                                {getPolicyName(policy)}
                              </option>
                            ) : null;
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Criteria Type *
                        </label>
                        <select
                          value={bulkCriteriaType}
                          onChange={(e) => {
                            setBulkCriteriaType(e.target.value);
                            setBulkSelectedValues([]);
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        >
                          {criteriaTypeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Multi select */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">
                          Select {getCriteriaLabel(bulkCriteriaType)} *
                        </label>
                        <div className="flex gap-2 text-xs">
                          <button type="button" onClick={selectAllBulk} className="text-blue-600 hover:underline">
                            Select All
                          </button>
                          <button type="button" onClick={clearAllBulk} className="text-red-600 hover:underline">
                            Clear
                          </button>
                        </div>
                      </div>
                      <p className="mb-2 text-xs text-slate-500">
                        Select only the values you need. You can choose one, two, or any number of employees.
                      </p>

                      <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200 p-3">
                        {bulkCriteriaType === "gender" ? (
                          ["male", "female", "other"].map((g) => (
                            <label key={g} className="flex items-center gap-2 py-1.5 text-sm">
                              <input
                                type="checkbox"
                                checked={bulkSelectedValues.includes(g)}
                                onChange={() => toggleBulkValue(g)}
                                className="rounded border-slate-300 text-[#E42527]"
                              />
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </label>
                          ))
                        ) : (
                          (criteriaMasters[criteriaValueConfig[bulkCriteriaType]?.itemsKey] || []).map(
                            (item, index) => {
                              const id = String(getOptionId(item));
                              return (
                                <label key={`${id}-${index}`} className="flex items-center gap-2 py-1.5 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={bulkSelectedValues.includes(id)}
                                    onChange={() => toggleBulkValue(id)}
                                    className="rounded border-slate-300 text-[#E42527]"
                                  />
                                  {getCriteriaOptionLabel(bulkCriteriaType, item)}
                                </label>
                              );
                            }
                          )
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Selected: {bulkSelectedValues.length}
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={bulkIsException}
                          onChange={(e) => setBulkIsException(e.target.checked)}
                          className="rounded border-slate-300 text-[#E42527]"
                        />
                        <span className="font-medium">Is Exception (Exclude)</span>
                      </label>
                    </div>
                  </>
                ) : (
                  /* ================= SINGLE FORM ================= */
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Leave Policy *
                      </label>
                      <select
                        required
                        disabled={!!editId}
                        value={formData.leave_policy_id}
                        onChange={(e) => setFormData({ ...formData, leave_policy_id: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-100"
                      >
                        <option value="">Select leave policy</option>
                        {leavePolicies.map((policy, index) => {
                          const id = getPolicyId(policy);
                          return id ? (
                            <option key={`${id}-${index}`} value={String(id)}>
                              {getPolicyName(policy)}
                            </option>
                          ) : null;
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Criteria Type *
                      </label>
                      <select
                        value={formData.criteria_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteria_type: e.target.value,
                            criteria_value: "",
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        {criteriaTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Criteria Value *
                      </label>
                      {formData.criteria_type === "gender" ? (
                        <select
                          required
                          value={formData.criteria_value}
                          onChange={(e) => setFormData({ ...formData, criteria_value: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : criteriaValueConfig[formData.criteria_type] ? (
                        <select
                          required
                          value={formData.criteria_value}
                          onChange={(e) => setFormData({ ...formData, criteria_value: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        >
                          <option value="">Select...</option>
                          {(criteriaMasters[criteriaValueConfig[formData.criteria_type].itemsKey] || []).map(
                            (item, index) => {
                              const id = getOptionId(item);
                              return id ? (
                                <option key={`${id}-${index}`} value={String(id)}>
                                  {getCriteriaOptionLabel(formData.criteria_type, item)}
                                </option>
                              ) : null;
                            }
                          )}
                        </select>
                      ) : (
                        <input
                          required
                          value={formData.criteria_value}
                          onChange={(e) => setFormData({ ...formData, criteria_value: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        />
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={!!formData.is_exception}
                          onChange={(e) => setFormData({ ...formData, is_exception: e.target.checked })}
                          className="rounded border-slate-300 text-[#E42527]"
                        />
                        <span className="font-medium">Is Exception</span>
                      </label>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
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
                  {saving ? "Saving..." : isBulkMode ? "Add Selected" : editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Rule details</p>
                <h2 className="mt-1 text-lg font-semibold capitalize text-slate-800">
                  {getCriteriaLabel(selectedRule.criteria_type)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 px-5 py-5">
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400">Leave Policy</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {getPolicyNameById(selectedRule.leave_policy_id)}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400">Criteria Type</p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                  {getCriteriaLabel(selectedRule.criteria_type)}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400">Criteria Value</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {getCriteriaValueLabel(selectedRule.criteria_type, selectedRule.criteria_value)}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-400">Rule Type</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {selectedRule.is_exception
                    ? "Exception (Exclude matching employees)"
                    : "Include matching employees"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => handleDelete(selectedRule)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRule(null);
                  openEdit(selectedRule);
                }}
                className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
              >
                Edit rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}