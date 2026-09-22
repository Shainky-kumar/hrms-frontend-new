// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { api } from "@/app/lib/api";

// // ═══════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════

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

// // Which master data source maps to each criteria type
// const criteriaValueConfig = {
//   department: { label: "Department", masterKey: "departments" },
//   location: { label: "Location", masterKey: "locations" },
//   employment_type: { label: "Employment Type", masterKey: "employment_types" },
//   role: { label: "Designation", masterKey: "designations" },
//   employee_id: { label: "Employee", masterKey: "employees" },
// };

// const BULK_WARN_THRESHOLD = 50;
// const SUCCESS_TIMEOUT = 3000;
// const PAGE_SIZE = 12;

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

// function formatApiError(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) => {
//         const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
//         return field ? `${field}: ${e.msg}` : e.msg;
//       })
//       .join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   if (err?.message === "Network Error") return "Cannot reach server.";
//   return err?.response?.data?.message || err?.message || "Something went wrong";
// }

// const getPolicyId = (p) => p?.leave_policy_id || null;
// const getPolicyName = (p) => p?.policy_name || getPolicyId(p) || "Unknown policy";

// const getCriteriaLabel = (type) =>
//   criteriaTypeOptions.find((o) => o.value === type)?.label ||
//   (type || "").replace(/_/g, " ");

// // Master item ID extractor — based on which type
// function getMasterItemId(type, item) {
//   if (!item) return null;
//   switch (type) {
//     case "department":      return item.department_id || null;
//     case "location":        return item.location_id || null;
//     case "employment_type": return item.employment_type_id || null;
//     case "role":            return item.designation_id || null;
//     case "employee_id":     return item.employee_id || null;
//     default:                return null;
//   }
// }

// function getMasterItemLabel(type, item) {
//   if (!item) return "—";
//   switch (type) {
//     case "department":      return item.department_name || getMasterItemId(type, item);
//     case "location":        return item.location_name || getMasterItemId(type, item);
//     case "employment_type": return item.name || item.employment_type_name || getMasterItemId(type, item);
//     case "role":            return item.job_title || item.designation_name || getMasterItemId(type, item);
//     case "employee_id":     return item.name || [item.first_name, item.last_name].filter(Boolean).join(" ") || item.personal_email || getMasterItemId(type, item);
//     default:                return getMasterItemId(type, item);
//   }
// }

// // ═══════════════════════════════════════════════════════════
// // PAGE
// // ═══════════════════════════════════════════════════════════

// export default function LeaveApplicabilityRulesPage() {
//   // List state
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [filterPolicyId, setFilterPolicyId] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Feedback
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const successTimerRef = useRef(null);

//   // Form
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [formData, setFormData] = useState(initialForm);
//   const [saving, setSaving] = useState(false);

//   // Bulk form
//   const [isBulkMode, setIsBulkMode] = useState(false);
//   const [bulkPolicyId, setBulkPolicyId] = useState("");
//   const [bulkCriteriaType, setBulkCriteriaType] = useState("employee_id");
//   const [bulkSelectedValues, setBulkSelectedValues] = useState([]);
//   const [bulkIsException, setBulkIsException] = useState(false);

//   // Masters + policies
//   const [leavePolicies, setLeavePolicies] = useState([]);
//   const [masters, setMasters] = useState({
//     departments: [],
//     locations: [],
//     employment_types: [],
//     designations: [],
//     employees: [],
//   });
//   const [mastersLoading, setMastersLoading] = useState(true);

//   // Details modal
//   const [selectedRule, setSelectedRule] = useState(null);

//   // ═════════════════════════════════════════════════════════
//   // SUCCESS AUTO-CLEAR
//   // ═════════════════════════════════════════════════════════

//   const showSuccess = useCallback((msg) => {
//     setSuccess(msg);
//     if (successTimerRef.current) clearTimeout(successTimerRef.current);
//     successTimerRef.current = setTimeout(() => setSuccess(""), SUCCESS_TIMEOUT);
//   }, []);

//   useEffect(() => () => {
//     if (successTimerRef.current) clearTimeout(successTimerRef.current);
//   }, []);

//   // ═════════════════════════════════════════════════════════
//   // LOAD POLICIES
//   // ═════════════════════════════════════════════════════════

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get("/api/v1/leave/policies", {
//           params: { page: 1, page_size: 200 },
//         });
//         const items = res.data?.policies || [];
//         setLeavePolicies(Array.isArray(items) ? items : []);
//       } catch (err) {
//         console.error("Failed to load policies:", err);
//         setLeavePolicies([]);
//       }
//     })();
//   }, []);

//   // ═════════════════════════════════════════════════════════
//   // LOAD MASTERS
//   // ═════════════════════════════════════════════════════════

//   useEffect(() => {
//     (async () => {
//       setMastersLoading(true);
//       const fetchOne = async (url, params) => {
//         try {
//           const res = await api.get(url, { params });
//           return res.data;
//         } catch {
//           return null;
//         }
//       };

//       const [departmentsRes, locationsRes, employmentRes, designationsRes, employeesRes] =
//         await Promise.all([
//           fetchOne("/api/v1/get/departments", { page: 1, page_size: 500 }),
//           fetchOne("/api/v1/get/location/master", { page: 1, page_size: 500 }),
//           fetchOne("/api/v1/get/employment/type"),
//           fetchOne("/api/v1/get/designations", { page: 1, page_size: 500 }),
//           fetchOne("/api/v1/get/employees"),
//         ]);

//       setMasters({
//         departments: departmentsRes?.departments || [],
//         locations: locationsRes?.locations || [],
//         employment_types:
//           employmentRes?.data || employmentRes?.employment_types || [],
//         designations: designationsRes?.designations || [],
//         employees: employeesRes?.employees || [],
//       });
//       setMastersLoading(false);
//     })();
//   }, []);

//   // ═════════════════════════════════════════════════════════
//   // FETCH RULES
//   // ═════════════════════════════════════════════════════════

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = {
//         page,
//         page_size: PAGE_SIZE,
//         search: search || undefined,
//       };
//       if (filterPolicyId) params.leave_policy_id = filterPolicyId;

//       const res = await api.get("/api/v1/leave/applicability/rules", { params });
//       const items = res.data?.applicability_rules || [];
//       setList(Array.isArray(items) ? items : []);
//       setTotal(Number(res.data?.total) || items.length);
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [filterPolicyId, page, search]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchData();
//     }, 0);

//     return () => clearTimeout(timeoutId);
//   }, [fetchData]);

//   // ═════════════════════════════════════════════════════════
//   // FORM OPEN / CLOSE
//   // ═════════════════════════════════════════════════════════

//   const resetForm = () => {
//     setFormData(initialForm);
//     setEditId(null);
//     setIsBulkMode(false);
//     setBulkSelectedValues([]);
//     setBulkPolicyId("");
//     setBulkCriteriaType("employee_id");
//     setBulkIsException(false);
//     setError("");
//   };

//   const openAdd = () => {
//     resetForm();
//     setFormData({
//       ...initialForm,
//       leave_policy_id:
//         filterPolicyId || (leavePolicies[0] ? String(getPolicyId(leavePolicies[0])) : ""),
//     });
//     setShowForm(true);
//   };

//   const openBulkAdd = () => {
//     resetForm();
//     setIsBulkMode(true);
//     setBulkPolicyId(
//       filterPolicyId || (leavePolicies[0] ? String(getPolicyId(leavePolicies[0])) : "")
//     );
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     setEditId(item.applicability_id);
//     setFormData({
//       leave_policy_id: item.leave_policy_id || "",
//       criteria_type: item.criteria_type || "department",
//       criteria_value: item.criteria_value || "",
//       is_exception: !!item.is_exception,
//     });
//     setIsBulkMode(false);
//     setError("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;
//     setShowForm(false);
//     resetForm();
//   };

//   // ═════════════════════════════════════════════════════════
//   // DUPLICATE CHECK (fresh fetch — no stale cache)
//   // ═════════════════════════════════════════════════════════

//   const filterNewValues = async (policyId, criteriaType, values) => {
//     try {
//       const res = await api.get("/api/v1/leave/applicability/rules", {
//         params: { page: 1, page_size: 1000, leave_policy_id: policyId },
//       });
//       const existing = res.data?.applicability_rules || [];
//       const existingSet = new Set(
//         existing
//           .filter((r) => r.criteria_type === criteriaType)
//           .map((r) => String(r.criteria_value))
//       );
//       return values.filter((v) => !existingSet.has(String(v)));
//     } catch {
//       return values; // network fail — don't block, backend will error if dup
//     }
//   };

//   // ═════════════════════════════════════════════════════════
//   // SUBMIT
//   // ═════════════════════════════════════════════════════════

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // ─── BULK ───
//     if (isBulkMode) {
//       if (!bulkPolicyId) return setError("Please select a Leave Policy");
//       if (bulkSelectedValues.length === 0)
//         return setError("Please select at least one value");

//       if (
//         bulkSelectedValues.length > BULK_WARN_THRESHOLD &&
//         !confirm(
//           `You are about to create ${bulkSelectedValues.length} rules. Continue?`
//         )
//       )
//         return;

//       setSaving(true);
//       try {
//         const newValues = await filterNewValues(
//           bulkPolicyId,
//           bulkCriteriaType,
//           bulkSelectedValues
//         );

//         if (newValues.length === 0) {
//           setError("All selected values already have a rule for this policy.");
//           setSaving(false);
//           return;
//         }

//         const payload = newValues.map((value) => ({
//           leave_policy_id: bulkPolicyId,
//           criteria_type: bulkCriteriaType,
//           criteria_value: String(value),
//           is_exception: !!bulkIsException,
//         }));

//         await api.post("/api/v1/leave/applicability/rules/bulk", payload);

//         const skipped = bulkSelectedValues.length - newValues.length;
//         showSuccess(
//           `Created ${newValues.length} rule(s)${skipped ? `, skipped ${skipped} duplicate(s)` : ""}`
//         );

//         closeForm();
//         await fetchData();
//       } catch (err) {
//         setError(formatApiError(err));
//       } finally {
//         setSaving(false);
//       }
//       return;
//     }

//     // ─── EDIT ───
//     if (editId) {
//       if (!formData.criteria_type || !formData.criteria_value)
//         return setError("Criteria type and value are required");

//       setSaving(true);
//       try {
//         // NOTE: leave_policy_id is NOT sent in update (backend schema ignores it)
//         await api.put(`/api/v1/leave/applicability/rules/${editId}`, {
//           criteria_type: formData.criteria_type,
//           criteria_value: String(formData.criteria_value),
//           is_exception: !!formData.is_exception,
//         });
//         showSuccess("Rule updated successfully");
//         closeForm();
//         await fetchData();
//       } catch (err) {
//         setError(formatApiError(err));
//       } finally {
//         setSaving(false);
//       }
//       return;
//     }

//     // ─── CREATE ───
//     if (!formData.leave_policy_id)
//       return setError("Please select a Leave Policy");
//     if (!formData.criteria_value)
//       return setError("Criteria value is required");

//     setSaving(true);
//     try {
//       const newValues = await filterNewValues(
//         formData.leave_policy_id,
//         formData.criteria_type,
//         [String(formData.criteria_value)]
//       );

//       if (newValues.length === 0) {
//         setError("This value already has a rule for this policy.");
//         setSaving(false);
//         return;
//       }

//       await api.post("/api/v1/leave/applicability/rules", {
//         leave_policy_id: formData.leave_policy_id,
//         criteria_type: formData.criteria_type,
//         criteria_value: String(formData.criteria_value),
//         is_exception: !!formData.is_exception,
//       });
//       showSuccess("Rule created successfully");
//       closeForm();
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ═════════════════════════════════════════════════════════
//   // DELETE
//   // ═════════════════════════════════════════════════════════

//   const handleDelete = async (item) => {
//     if (!confirm("Delete this rule? This cannot be undone.")) return;
//     try {
//       await api.delete(`/api/v1/leave/applicability/rules/${item.applicability_id}`);
//       setSelectedRule(null);
//       showSuccess("Rule deleted");
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     }
//   };

//   // ═════════════════════════════════════════════════════════
//   // HELPERS
//   // ═════════════════════════════════════════════════════════

//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
//   const canPrev = page > 1;
//   const canNext = page < totalPages;

//   const getPolicyNameById = (id) => {
//     const p = leavePolicies.find((x) => String(getPolicyId(x)) === String(id));
//     return p ? getPolicyName(p) : id || "—";
//   };

//   const getCriteriaValueLabel = (type, value) => {
//     if (!value) return "—";
//     if (type === "gender")
//       return value.charAt(0).toUpperCase() + value.slice(1);

//     const config = criteriaValueConfig[type];
//     if (!config) return value;

//     const items = masters[config.masterKey] || [];
//     const found = items.find(
//       (item) => String(getMasterItemId(type, item)) === String(value)
//     );
//     return found ? getMasterItemLabel(type, found) : value;
//   };

//   const getBulkMasterItems = () => {
//     if (bulkCriteriaType === "gender")
//       return ["male", "female", "other"].map((g) => ({
//         id: g,
//         label: g.charAt(0).toUpperCase() + g.slice(1),
//       }));

//     const config = criteriaValueConfig[bulkCriteriaType];
//     if (!config) return [];

//     return (masters[config.masterKey] || [])
//       .map((item) => ({
//         id: String(getMasterItemId(bulkCriteriaType, item) || ""),
//         label: getMasterItemLabel(bulkCriteriaType, item),
//       }))
//       .filter((x) => x.id);
//   };

//   const toggleBulkValue = (id) => {
//     setBulkSelectedValues((prev) =>
//       prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
//     );
//   };

//   const selectAllBulk = () =>
//     setBulkSelectedValues(getBulkMasterItems().map((x) => x.id));

//   const clearAllBulk = () => setBulkSelectedValues([]);

//   // ═════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════

//   return (
//     <div>
//       {/* ══════════ HEADER ══════════ */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">
//             Leave Applicability Rules
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Configure which employees can access leave policies
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             type="button"
//             onClick={openBulkAdd}
//             className="inline-flex items-center gap-2 rounded-lg border border-[#E42527] px-4 py-2.5 text-sm font-medium text-[#E42527] hover:bg-red-50"
//           >
//             Bulk Add
//           </button>
//           <button
//             type="button"
//             onClick={openAdd}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
//           >
//             + Add Rule
//           </button>
//         </div>
//       </div>

//       {/* ══════════ FEEDBACK BANNERS ══════════ */}
//       {error && !showForm && (
//         <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
//           <span className="flex-1">{error}</span>
//           <button
//             onClick={() => setError("")}
//             className="opacity-60 hover:opacity-100"
//             aria-label="Dismiss"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 flex items-start gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
//           <span className="flex-1">✓ {success}</span>
//           <button
//             onClick={() => setSuccess("")}
//             className="opacity-60 hover:opacity-100"
//             aria-label="Dismiss"
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       {/* ══════════ LIST CARD ══════════ */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
//             <select
//               value={filterPolicyId}
//               onChange={(e) => {
//                 setFilterPolicyId(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//             >
//               <option value="">All Policies</option>
//               {leavePolicies.map((p) => {
//                 const id = getPolicyId(p);
//                 return id ? (
//                   <option key={id} value={String(id)}>
//                     {getPolicyName(p)}
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
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//             />
//           </div>
//           <span className="text-sm text-slate-500">{total} rules</span>
//         </div>

//         {loading ? (
//           <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
//         ) : list.length === 0 ? (
//           <div className="py-20 text-center">
//             <p className="text-sm text-slate-500">
//               {search || filterPolicyId
//                 ? "No rules match your filters"
//                 : "No applicability rules yet"}
//             </p>
//             {!search && !filterPolicyId && (
//               <button
//                 onClick={openAdd}
//                 className="mt-3 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//               >
//                 + Create your first rule
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
//             {list.map((item) => (
//               <button
//                 type="button"
//                 key={item.applicability_id}
//                 onClick={() => setSelectedRule(item)}
//                 className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="min-w-0">
//                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                       Applicability Rule
//                     </p>
//                     <h3 className="mt-1 truncate text-base font-semibold capitalize text-slate-800">
//                       {getCriteriaLabel(item.criteria_type)}
//                     </h3>
//                     <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
//                       {getCriteriaValueLabel(item.criteria_type, item.criteria_value)}
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
//               </button>
//             ))}
//           </div>
//         )}

//         {totalPages > 1 && (
//           <div className="flex justify-between border-t border-slate-100 px-4 py-3">
//             <span className="text-sm text-slate-500">
//               Page {page} of {totalPages}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 disabled={!canPrev}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               <button
//                 disabled={!canNext}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ══════════ FORM MODAL ══════════ */}
//       {showForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) closeForm();
//           }}
//         >
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {isBulkMode
//                   ? "Bulk Add Applicability Rules"
//                   : editId
//                   ? "Edit Applicability Rule"
//                   : "Add Applicability Rule"}
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
//                 {isBulkMode ? (
//                   <>
//                     {/* Bulk: Policy */}
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                       <div>
//                         <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                           Leave Policy *
//                         </label>
//                         <select
//                           required
//                           value={bulkPolicyId}
//                           onChange={(e) => setBulkPolicyId(e.target.value)}
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                         >
//                           <option value="">Select leave policy</option>
//                           {leavePolicies.map((p) => {
//                             const id = getPolicyId(p);
//                             return id ? (
//                               <option key={id} value={String(id)}>
//                                 {getPolicyName(p)}
//                               </option>
//                             ) : null;
//                           })}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                           Criteria Type *
//                         </label>
//                         <select
//                           value={bulkCriteriaType}
//                           onChange={(e) => {
//                             setBulkCriteriaType(e.target.value);
//                             setBulkSelectedValues([]);
//                           }}
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                         >
//                           {criteriaTypeOptions.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     {/* Bulk: Multi-select */}
//                     <div>
//                       <div className="mb-2 flex items-center justify-between">
//                         <label className="text-sm font-medium text-slate-700">
//                           Select {getCriteriaLabel(bulkCriteriaType)} *
//                         </label>
//                         <div className="flex gap-3 text-xs">
//                           <button
//                             type="button"
//                             onClick={selectAllBulk}
//                             className="text-blue-600 hover:underline"
//                           >
//                             Select All
//                           </button>
//                           <button
//                             type="button"
//                             onClick={clearAllBulk}
//                             className="text-red-600 hover:underline"
//                           >
//                             Clear
//                           </button>
//                         </div>
//                       </div>
//                       <p className="mb-2 text-xs text-slate-500">
//                         Tick the values you want. Duplicates will be skipped automatically.
//                       </p>

//                       <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200 p-3">
//                         {mastersLoading ? (
//                           <p className="py-6 text-center text-xs text-slate-400">
//                             Loading...
//                           </p>
//                         ) : getBulkMasterItems().length === 0 ? (
//                           <p className="py-6 text-center text-xs text-slate-400">
//                             No items available
//                           </p>
//                         ) : (
//                           getBulkMasterItems().map((item) => (
//                             <label
//                               key={item.id}
//                               className="flex cursor-pointer items-center gap-2 py-1.5 text-sm hover:bg-slate-50"
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={bulkSelectedValues.includes(item.id)}
//                                 onChange={() => toggleBulkValue(item.id)}
//                                 className="rounded border-slate-300 text-[#E42527]"
//                               />
//                               <span className="text-slate-700">{item.label}</span>
//                             </label>
//                           ))
//                         )}
//                       </div>
//                       <p className="mt-1.5 text-xs font-medium text-slate-600">
//                         Selected: {bulkSelectedValues.length}
//                       </p>
//                     </div>

//                     <div>
//                       <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
//                         <input
//                           type="checkbox"
//                           checked={bulkIsException}
//                           onChange={(e) => setBulkIsException(e.target.checked)}
//                           className="rounded border-slate-300 text-[#E42527]"
//                         />
//                         <span className="font-medium">
//                           Is Exception (Exclude these employees)
//                         </span>
//                       </label>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     {/* Single: Policy */}
//                     <div>
//                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                         Leave Policy *
//                       </label>
//                       <select
//                         required
//                         disabled={!!editId}
//                         value={formData.leave_policy_id}
//                         onChange={(e) =>
//                           setFormData({ ...formData, leave_policy_id: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-100 disabled:text-slate-500"
//                       >
//                         <option value="">Select leave policy</option>
//                         {leavePolicies.map((p) => {
//                           const id = getPolicyId(p);
//                           return id ? (
//                             <option key={id} value={String(id)}>
//                               {getPolicyName(p)}
//                             </option>
//                           ) : null;
//                         })}
//                       </select>
//                       {editId && (
//                         <p className="mt-1 text-xs text-slate-500">
//                           Policy cannot be changed after creation
//                         </p>
//                       )}
//                     </div>

//                     {/* Single: Criteria Type */}
//                     <div>
//                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                         Criteria Type *
//                       </label>
//                       <select
//                         value={formData.criteria_type}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             criteria_type: e.target.value,
//                             criteria_value: "",
//                           })
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       >
//                         {criteriaTypeOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Single: Criteria Value */}
//                     <div className="sm:col-span-2">
//                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                         Criteria Value *
//                       </label>
//                       {formData.criteria_type === "gender" ? (
//                         <select
//                           required
//                           value={formData.criteria_value}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               criteria_value: e.target.value,
//                             })
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                         >
//                           <option value="">Select gender</option>
//                           <option value="male">Male</option>
//                           <option value="female">Female</option>
//                           <option value="other">Other</option>
//                         </select>
//                       ) : criteriaValueConfig[formData.criteria_type] ? (
//                         <select
//                           required
//                           value={formData.criteria_value}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               criteria_value: e.target.value,
//                             })
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                         >
//                           <option value="">
//                             {mastersLoading ? "Loading..." : "Select..."}
//                           </option>
//                           {(masters[
//                             criteriaValueConfig[formData.criteria_type].masterKey
//                           ] || []).map((item) => {
//                             const id = getMasterItemId(
//                               formData.criteria_type,
//                               item
//                             );
//                             return id ? (
//                               <option key={String(id)} value={String(id)}>
//                                 {getMasterItemLabel(
//                                   formData.criteria_type,
//                                   item
//                                 )}
//                               </option>
//                             ) : null;
//                           })}
//                         </select>
//                       ) : (
//                         <input
//                           required
//                           value={formData.criteria_value}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               criteria_value: e.target.value,
//                             })
//                           }
//                           className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                         />
//                       )}
//                     </div>

//                     {/* Single: Is Exception */}
//                     <div className="sm:col-span-2">
//                       <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
//                         <input
//                           type="checkbox"
//                           checked={!!formData.is_exception}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               is_exception: e.target.checked,
//                             })
//                           }
//                           className="rounded border-slate-300 text-[#E42527]"
//                         />
//                         <span className="font-medium">
//                           Is Exception (Exclude this value)
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//                 )}

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
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : isBulkMode
//                     ? `Add Selected${bulkSelectedValues.length ? ` (${bulkSelectedValues.length})` : ""}`
//                     : editId
//                     ? "Update"
//                     : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ══════════ DETAILS MODAL ══════════ */}
//       {selectedRule && (
//         <div
//           className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) setSelectedRule(null);
//           }}
//         >
//           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div className="min-w-0">
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Rule details
//                 </p>
//                 <h2 className="mt-1 truncate text-lg font-semibold capitalize text-slate-800">
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
//                   {getCriteriaValueLabel(
//                     selectedRule.criteria_type,
//                     selectedRule.criteria_value
//                   )}
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
//                   const rule = selectedRule;
//                   setSelectedRule(null);
//                   openEdit(rule);
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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

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
  { value: "role", label: "Role / Designation" },
  { value: "employee_id", label: "Employee" },
];

// Static options for gender (not loaded from API)
const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];

// Which master data source maps to each criteria type
const criteriaValueConfig = {
  department: { label: "Department", masterKey: "departments" },
  location: { label: "Location", masterKey: "locations" },
  employment_type: { label: "Employment Type", masterKey: "employment_types" },
  role: { label: "Designation", masterKey: "designations" },
  employee_id: { label: "Employee", masterKey: "employees" },
  // gender is handled separately (static options)
};

const BULK_WARN_THRESHOLD = 50;
const SUCCESS_TIMEOUT = 3000;
const PAGE_SIZE = 12;

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
  return err?.response?.data?.message || err?.message || "Something went wrong";
}

const getPolicyId = (p) => p?.leave_policy_id || null;
const getPolicyName = (p) => p?.policy_name || getPolicyId(p) || "Unknown policy";

const getCriteriaLabel = (type) =>
  criteriaTypeOptions.find((o) => o.value === type)?.label ||
  (type || "").replace(/_/g, " ");

// Master item ID extractor — based on which type
function getMasterItemId(type, item) {
  if (!item) return null;
  switch (type) {
    case "department":      return item.department_id || null;
    case "location":        return item.location_id || null;
    case "employment_type": return item.employment_type_id || null;
    case "role":            return item.designation_id || null;
    case "employee_id":     return item.employee_id || null;
    default:                return null;
  }
}

function getMasterItemLabel(type, item) {
  if (!item) return "—";
  switch (type) {
    case "department":      return item.department_name || getMasterItemId(type, item);
    case "location":        return item.location_name || getMasterItemId(type, item);
    case "employment_type": return item.name || item.employment_type_name || getMasterItemId(type, item);
    case "role":            return item.job_title || item.designation_name || getMasterItemId(type, item);
    case "employee_id":     return item.name || [item.first_name, item.last_name].filter(Boolean).join(" ") || item.personal_email || getMasterItemId(type, item);
    default:                return getMasterItemId(type, item);
  }
}

// ═══════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════

export default function LeaveApplicabilityRulesPage() {
  // List state
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterPolicyId, setFilterPolicyId] = useState("");
  const [loading, setLoading] = useState(true);

  // Feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const successTimerRef = useRef(null);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  // Bulk form
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkPolicyId, setBulkPolicyId] = useState("");
  const [bulkCriteriaType, setBulkCriteriaType] = useState("employee_id");
  const [bulkSelectedValues, setBulkSelectedValues] = useState([]);
  const [bulkIsException, setBulkIsException] = useState(false);

  // Masters + policies
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [masters, setMasters] = useState({
    departments: [],
    locations: [],
    employment_types: [],
    designations: [],
    employees: [],
  });
  const [mastersLoading, setMastersLoading] = useState(true);

  // Details modal
  const [selectedRule, setSelectedRule] = useState(null);

  // ═════════════════════════════════════════════════════════
  // SUCCESS AUTO-CLEAR
  // ═════════════════════════════════════════════════════════

  const showSuccess = useCallback((msg) => {
    setSuccess(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccess(""), SUCCESS_TIMEOUT);
  }, []);

  useEffect(() => () => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
  }, []);

  // ═════════════════════════════════════════════════════════
  // LOAD POLICIES
  // ═════════════════════════════════════════════════════════

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/v1/leave/policies", {
          params: { page: 1, page_size: 200 },
        });
        const items = res.data?.policies || [];
        setLeavePolicies(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Failed to load policies:", err);
        setLeavePolicies([]);
      }
    })();
  }, []);

  // ═════════════════════════════════════════════════════════
  // LOAD MASTERS
  // ═════════════════════════════════════════════════════════

  useEffect(() => {
    (async () => {
      setMastersLoading(true);
      const fetchOne = async (url, params) => {
        try {
          const res = await api.get(url, { params });
          return res.data;
        } catch {
          return null;
        }
      };

      const [departmentsRes, locationsRes, employmentRes, designationsRes, employeesRes] =
        await Promise.all([
          fetchOne("/api/v1/get/departments", { page: 1, page_size: 500 }),
          fetchOne("/api/v1/get/location/master", { page: 1, page_size: 500 }),
          fetchOne("/api/v1/get/employment/type"),
          fetchOne("/api/v1/get/designations", { page: 1, page_size: 500 }),
          fetchOne("/api/v1/get/employees"),
        ]);

      setMasters({
        departments: departmentsRes?.departments || [],
        locations: locationsRes?.locations || [],
        employment_types:
          employmentRes?.data || employmentRes?.employment_types || [],
        designations: designationsRes?.designations || [],
        employees: employeesRes?.employees || [],
      });
      setMastersLoading(false);
    })();
  }, []);

  // ═════════════════════════════════════════════════════════
  // FETCH RULES
  // ═════════════════════════════════════════════════════════

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
      };
      if (filterPolicyId) params.leave_policy_id = filterPolicyId;

      const res = await api.get("/api/v1/leave/applicability/rules", { params });
      const items = res.data?.applicability_rules || [];
      setList(Array.isArray(items) ? items : []);
      setTotal(Number(res.data?.total) || items.length);
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filterPolicyId, page, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  // ═════════════════════════════════════════════════════════
  // FILTER RESET HELPERS
  // ═════════════════════════════════════════════════════════

  const handleFilterPolicyChange = (value) => {
    setFilterPolicyId(value);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilterPolicyId("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(filterPolicyId || search);

  // ═════════════════════════════════════════════════════════
  // FORM OPEN / CLOSE
  // ═════════════════════════════════════════════════════════

  const resetForm = () => {
    setFormData(initialForm);
    setEditId(null);
    setIsBulkMode(false);
    setBulkSelectedValues([]);
    setBulkPolicyId("");
    setBulkCriteriaType("employee_id");
    setBulkIsException(false);
    setError("");
  };

  const openAdd = () => {
    resetForm();
    setFormData({
      ...initialForm,
      leave_policy_id:
        filterPolicyId || (leavePolicies[0] ? String(getPolicyId(leavePolicies[0])) : ""),
    });
    setShowForm(true);
  };

  const openBulkAdd = () => {
    resetForm();
    setIsBulkMode(true);
    setBulkPolicyId(
      filterPolicyId || (leavePolicies[0] ? String(getPolicyId(leavePolicies[0])) : "")
    );
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.applicability_id);
    setFormData({
      leave_policy_id: item.leave_policy_id || "",
      criteria_type: item.criteria_type || "department",
      criteria_value: item.criteria_value || "",
      is_exception: !!item.is_exception,
    });
    setIsBulkMode(false);
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    resetForm();
  };

  // ═════════════════════════════════════════════════════════
  // DUPLICATE CHECK (fresh fetch — no stale cache)
  // ═════════════════════════════════════════════════════════

  const filterNewValues = async (policyId, criteriaType, values) => {
    try {
      const res = await api.get("/api/v1/leave/applicability/rules", {
        params: { page: 1, page_size: 1000, leave_policy_id: policyId },
      });
      const existing = res.data?.applicability_rules || [];
      const existingSet = new Set(
        existing
          .filter((r) => r.criteria_type === criteriaType)
          .map((r) => String(r.criteria_value))
      );
      return values.filter((v) => !existingSet.has(String(v)));
    } catch {
      return values; // network fail — don't block, backend will error if dup
    }
  };

  // ═════════════════════════════════════════════════════════
  // SUBMIT
  // ═════════════════════════════════════════════════════════

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ─── BULK ───
    if (isBulkMode) {
      if (!bulkPolicyId) return setError("Please select a Leave Policy");
      if (bulkSelectedValues.length === 0)
        return setError("Please select at least one value");

      // ⭐ Extra warning for exceptions
      if (bulkIsException) {
        const confirmMsg = `⚠️ You are about to EXCLUDE ${bulkSelectedValues.length} item(s) from this policy.\n\nThese employees will NOT get this leave policy.\n\nContinue?`;
        if (!confirm(confirmMsg)) return;
      } else if (
        bulkSelectedValues.length > BULK_WARN_THRESHOLD &&
        !confirm(
          `You are about to create ${bulkSelectedValues.length} INCLUDE rules. Continue?`
        )
      ) {
        return;
      }

      setSaving(true);
      try {
        const newValues = await filterNewValues(
          bulkPolicyId,
          bulkCriteriaType,
          bulkSelectedValues
        );

        if (newValues.length === 0) {
          setError("All selected values already have a rule for this policy.");
          setSaving(false);
          return;
        }

        const payload = newValues.map((value) => ({
          leave_policy_id: bulkPolicyId,
          criteria_type: bulkCriteriaType,
          criteria_value: String(value),
          is_exception: !!bulkIsException,
        }));

        await api.post("/api/v1/leave/applicability/rules/bulk", payload);

        const skipped = bulkSelectedValues.length - newValues.length;
        const kind = bulkIsException ? "exclude" : "include";
        showSuccess(
          `Created ${newValues.length} ${kind} rule(s)${
            skipped ? `, skipped ${skipped} duplicate(s)` : ""
          }`
        );

        closeForm();
        await fetchData();
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setSaving(false);
      }
      return;
    }

    // ─── EDIT ───
    if (editId) {
      if (!formData.criteria_type || !formData.criteria_value)
        return setError("Criteria type and value are required");

      setSaving(true);
      try {
        await api.put(`/api/v1/leave/applicability/rules/${editId}`, {
          criteria_type: formData.criteria_type,
          criteria_value: String(formData.criteria_value),
          is_exception: !!formData.is_exception,
        });
        showSuccess("Rule updated successfully");
        closeForm();
        await fetchData();
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setSaving(false);
      }
      return;
    }

    // ─── CREATE ───
    if (!formData.leave_policy_id)
      return setError("Please select a Leave Policy");
    if (!formData.criteria_value)
      return setError("Criteria value is required");

    setSaving(true);
    try {
      const newValues = await filterNewValues(
        formData.leave_policy_id,
        formData.criteria_type,
        [String(formData.criteria_value)]
      );

      if (newValues.length === 0) {
        setError("This value already has a rule for this policy.");
        setSaving(false);
        return;
      }

      await api.post("/api/v1/leave/applicability/rules", {
        leave_policy_id: formData.leave_policy_id,
        criteria_type: formData.criteria_type,
        criteria_value: String(formData.criteria_value),
        is_exception: !!formData.is_exception,
      });
      showSuccess("Rule created successfully");
      closeForm();
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  // ═════════════════════════════════════════════════════════
  // DELETE
  // ═════════════════════════════════════════════════════════

  const handleDelete = async (item) => {
    const policyName = getPolicyNameById(item.leave_policy_id);
    const criteriaText = `${getCriteriaLabel(item.criteria_type)} = ${getCriteriaValueLabel(item.criteria_type, item.criteria_value)}`;
    const confirmMsg = `Delete this rule?\n\nPolicy: ${policyName}\nRule: ${criteriaText}\n\nThis cannot be undone.`;

    if (!confirm(confirmMsg)) return;
    try {
      await api.delete(`/api/v1/leave/applicability/rules/${item.applicability_id}`);
      setSelectedRule(null);
      showSuccess("Rule deleted");
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  // ═════════════════════════════════════════════════════════
  // HELPERS
  // ═════════════════════════════════════════════════════════

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const getPolicyNameById = useCallback(
    (id) => {
      const p = leavePolicies.find((x) => String(getPolicyId(x)) === String(id));
      return p ? getPolicyName(p) : id || "—";
    },
    [leavePolicies]
  );

  const getCriteriaValueLabel = (type, value) => {
    if (!value) return "—";

    // Gender — static options
    if (type === "gender") {
      const g = GENDER_OPTIONS.find((x) => x.id === String(value).toLowerCase());
      return g ? g.label : String(value).charAt(0).toUpperCase() + String(value).slice(1);
    }

    const config = criteriaValueConfig[type];
    if (!config) return value;

    const items = masters[config.masterKey] || [];
    const found = items.find(
      (item) => String(getMasterItemId(type, item)) === String(value)
    );
    return found ? getMasterItemLabel(type, found) : value;
  };

  const getBulkMasterItems = () => {
    if (bulkCriteriaType === "gender") {
      return GENDER_OPTIONS.map((g) => ({ id: g.id, label: g.label }));
    }

    const config = criteriaValueConfig[bulkCriteriaType];
    if (!config) return [];

    return (masters[config.masterKey] || [])
      .map((item) => ({
        id: String(getMasterItemId(bulkCriteriaType, item) || ""),
        label: getMasterItemLabel(bulkCriteriaType, item),
      }))
      .filter((x) => x.id);
  };

  const toggleBulkValue = (id) => {
    setBulkSelectedValues((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const selectAllBulk = () =>
    setBulkSelectedValues(getBulkMasterItems().map((x) => x.id));

  const clearAllBulk = () => setBulkSelectedValues([]);

  // Selected chips preview
  const bulkChips = useMemo(() => {
    const itemsMap = new Map(getBulkMasterItems().map((x) => [x.id, x.label]));
    return bulkSelectedValues.map((id) => ({
      id,
      label: itemsMap.get(id) || id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkSelectedValues, bulkCriteriaType, masters]);

  // ═════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════

  return (
    <div>
      {/* ══════════ HEADER ══════════ */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Leave Applicability Rules
          </h1>
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

      {/* ══════════ FEEDBACK BANNERS ══════════ */}
      {error && !showForm && (
        <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError("")}
            className="opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span className="flex-1">✓ {success}</span>
          <button
            onClick={() => setSuccess("")}
            className="opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* ══════════ LIST CARD ══════════ */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={filterPolicyId}
              onChange={(e) => handleFilterPolicyChange(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
            >
              <option value="">All Policies</option>
              {leavePolicies.map((p) => {
                const id = getPolicyId(p);
                return id ? (
                  <option key={id} value={String(id)}>
                    {getPolicyName(p)}
                  </option>
                ) : null;
              })}
            </select>

            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search rules..."
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                ✕ Reset
              </button>
            )}
          </div>
          <span className="text-sm text-slate-500">{total} rules</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
        ) : list.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-500">
              {hasActiveFilters
                ? "No rules match your filters"
                : "No applicability rules yet"}
            </p>
            {!hasActiveFilters ? (
              <button
                onClick={openAdd}
                className="mt-3 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
              >
                + Create your first rule
              </button>
            ) : (
              <button
                onClick={handleResetFilters}
                className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((item) => (
              <button
                type="button"
                key={item.applicability_id}
                onClick={() => setSelectedRule(item)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Applicability Rule
                    </p>
                    <h3 className="mt-1 truncate text-base font-semibold capitalize text-slate-800">
                      {getCriteriaLabel(item.criteria_type)}
                    </h3>
                    <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {getCriteriaValueLabel(item.criteria_type, item.criteria_value)}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                      item.is_exception
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
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

        {totalPages > 1 && (
          <div className="flex justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={!canPrev}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={!canNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════ FORM MODAL ══════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
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
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
                {isBulkMode ? (
                  <>
                    {/* ⭐ Exception warning banner */}
                    {bulkIsException && (
                      <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                        <p className="font-semibold">
                          ⚠️ Exception Mode ON
                        </p>
                        <p className="mt-0.5">
                          Selected employees will be <strong>excluded</strong> from this policy,
                          even if they match other inclusion rules.
                        </p>
                      </div>
                    )}

                    {/* Bulk: Policy + Criteria Type */}
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
                          {leavePolicies.map((p) => {
                            const id = getPolicyId(p);
                            return id ? (
                              <option key={id} value={String(id)}>
                                {getPolicyName(p)}
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

                    {/* Bulk: Multi-select */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">
                          Select {getCriteriaLabel(bulkCriteriaType)} *
                        </label>
                        <div className="flex gap-3 text-xs">
                          <button
                            type="button"
                            onClick={selectAllBulk}
                            className="text-blue-600 hover:underline"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={clearAllBulk}
                            className="text-red-600 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <p className="mb-2 text-xs text-slate-500">
                        Tick the values you want. Duplicates will be skipped automatically.
                      </p>

                      <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200 p-3">
                        {mastersLoading ? (
                          <p className="py-6 text-center text-xs text-slate-400">
                            Loading...
                          </p>
                        ) : getBulkMasterItems().length === 0 ? (
                          <p className="py-6 text-center text-xs text-slate-400">
                            No items available
                          </p>
                        ) : (
                          getBulkMasterItems().map((item) => (
                            <label
                              key={item.id}
                              className="flex cursor-pointer items-center gap-2 py-1.5 text-sm hover:bg-slate-50"
                            >
                              <input
                                type="checkbox"
                                checked={bulkSelectedValues.includes(item.id)}
                                onChange={() => toggleBulkValue(item.id)}
                                className="rounded border-slate-300 text-[#E42527]"
                              />
                              <span className="text-slate-700">{item.label}</span>
                            </label>
                          ))
                        )}
                      </div>

                      {/* ⭐ Selected chips preview */}
                      {bulkChips.length > 0 && (
                        <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-600">
                              Selected ({bulkChips.length})
                            </p>
                            <button
                              type="button"
                              onClick={clearAllBulk}
                              className="text-[11px] text-red-600 hover:underline"
                            >
                              Clear all
                            </button>
                          </div>
                          <div className="mt-2 flex max-h-20 flex-wrap gap-1 overflow-y-auto">
                            {bulkChips.map((chip) => (
                              <button
                                type="button"
                                key={chip.id}
                                onClick={() => toggleBulkValue(chip.id)}
                                className="inline-flex items-center gap-1 rounded-full border border-[#E42527] bg-white px-2 py-0.5 text-[10px] font-medium text-[#E42527] hover:bg-red-50"
                              >
                                {chip.label}
                                <span className="opacity-60">✕</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={bulkIsException}
                          onChange={(e) => setBulkIsException(e.target.checked)}
                          className="rounded border-slate-300 text-[#E42527]"
                        />
                        <span className="font-medium">
                          Is Exception (Exclude these employees)
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Single: Policy */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Leave Policy *
                      </label>
                      <select
                        required
                        disabled={!!editId}
                        value={formData.leave_policy_id}
                        onChange={(e) =>
                          setFormData({ ...formData, leave_policy_id: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-100 disabled:text-slate-500"
                      >
                        <option value="">Select leave policy</option>
                        {leavePolicies.map((p) => {
                          const id = getPolicyId(p);
                          return id ? (
                            <option key={id} value={String(id)}>
                              {getPolicyName(p)}
                            </option>
                          ) : null;
                        })}
                      </select>
                      {editId && (
                        <p className="mt-1 text-xs text-slate-500">
                          Policy cannot be changed after creation
                        </p>
                      )}
                    </div>

                    {/* Single: Criteria Type */}
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

                    {/* Single: Criteria Value */}
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Criteria Value *
                      </label>
                      {formData.criteria_type === "gender" ? (
                        <select
                          required
                          value={formData.criteria_value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              criteria_value: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        >
                          <option value="">Select gender</option>
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      ) : criteriaValueConfig[formData.criteria_type] ? (
                        <select
                          required
                          value={formData.criteria_value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              criteria_value: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        >
                          <option value="">
                            {mastersLoading ? "Loading..." : "Select..."}
                          </option>
                          {(masters[
                            criteriaValueConfig[formData.criteria_type].masterKey
                          ] || []).map((item) => {
                            const id = getMasterItemId(
                              formData.criteria_type,
                              item
                            );
                            return id ? (
                              <option key={String(id)} value={String(id)}>
                                {getMasterItemLabel(
                                  formData.criteria_type,
                                  item
                                )}
                              </option>
                            ) : null;
                          })}
                        </select>
                      ) : (
                        <input
                          required
                          value={formData.criteria_value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              criteria_value: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                        />
                      )}
                    </div>

                    {/* Single: Is Exception */}
                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={!!formData.is_exception}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_exception: e.target.checked,
                            })
                          }
                          className="rounded border-slate-300 text-[#E42527]"
                        />
                        <span className="font-medium">
                          Is Exception (Exclude this value)
                        </span>
                      </label>
                      {formData.is_exception && (
                        <p className="mt-1.5 text-xs text-amber-700">
                          ⚠️ This value will be <strong>excluded</strong> from the policy.
                        </p>
                      )}
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
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : isBulkMode
                    ? `Add Selected${bulkSelectedValues.length ? ` (${bulkSelectedValues.length})` : ""}`
                    : editId
                    ? "Update"
                    : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ DETAILS MODAL ══════════ */}
      {selectedRule && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRule(null);
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Rule details
                </p>
                <h2 className="mt-1 truncate text-lg font-semibold capitalize text-slate-800">
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
                  {getCriteriaValueLabel(
                    selectedRule.criteria_type,
                    selectedRule.criteria_value
                  )}
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
                  const rule = selectedRule;
                  setSelectedRule(null);
                  openEdit(rule);
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