

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { api } from "@/app/lib/api";

// /* ================= CONSTANTS ================= */

// const CALCULATION_TYPES = [
//   { value: "flat", label: "Flat" },
//   { value: "percentage", label: "Percentage" },
//   { value: "slab", label: "Slab" },
//   { value: "formula", label: "Formula" },
//   { value: "attendance_based", label: "Attendance Based" },
// ];

// const EMPTY_ROW = {
//   component_id: "",
//   calculation_value: "",
//   calculation_type: "flat",
//   is_variable: false,
//   max_limit: "",
// };

// /* ================= HELPERS ================= */

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
//   if (err?.response?.status === 401) return "Session expired. Please login again.";
//   if (err?.response?.status === 403) return "You don't have permission. Contact Payroll Officer/Admin.";
//   if (err?.response?.status === 404) return "Not found.";
//   return err?.message || "Something went wrong";
// }

// function getEmployees(response) {
//   const body = response?.data ?? {};
//   const data = body?.data ?? body;
//   if (Array.isArray(data)) return data;
//   return data?.employees ?? data?.items ?? data?.results ?? [];
// }

// function getEmployeeId(emp) {
//   return emp?.employee_id || emp?.id || emp?._id || "";
// }

// function getEmployeeName(emp) {
//   const fullName = [emp?.first_name, emp?.last_name].filter(Boolean).join(" ");
//   return fullName || emp?.name || emp?.full_name || getEmployeeId(emp) || "Employee";
// }

// function getComponentsList(response) {
//   const body = response?.data ?? {};
//   const list = body?.data ?? body?.components ?? body?.items ?? [];
//   return Array.isArray(list) ? list : [];
// }

// function getComponentId(c) {
//   return c?.component_id || c?.id || c?._id || "";
// }

// function getComponentName(c) {
//   return c?.component_name || c?.name || c?.component_code || getComponentId(c) || "Component";
// }

// function extractStructureView(response) {
//   const body = response?.data ?? {};
//   const payload = body?.data ?? body;
//   return {
//     structure: payload?.structure ?? null,
//     components: Array.isArray(payload?.components) ? payload.components : [],
//   };
// }

// /* ================= COMPONENT ================= */

// export default function SalaryStructurePage() {
//   const [activeTab, setActiveTab] = useState("view"); // view | create | bulk

//   const [employees, setEmployees] = useState([]);
//   const [componentMaster, setComponentMaster] = useState([]);

//   // ✅ Separate state for view and create (was shared → bug)
//   const [viewEmployeeId, setViewEmployeeId] = useState("");
//   const [createEmployeeId, setCreateEmployeeId] = useState("");

//   const [structureName, setStructureName] = useState("");
//   const [structureDescription, setStructureDescription] = useState("");
//   const [isTemplate, setIsTemplate] = useState(false);
//   const [annualCtc, setAnnualCtc] = useState("");
//   const [monthlyCtc, setMonthlyCtc] = useState("");
//   const [effectiveFrom, setEffectiveFrom] = useState("");
//   const [effectiveTo, setEffectiveTo] = useState("");
//   const [revisionReason, setRevisionReason] = useState("");
//   const [components, setComponents] = useState([{ ...EMPTY_ROW }]);

//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [viewLoading, setViewLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [uploadResult, setUploadResult] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   /* ---------- Initial load ---------- */
//   useEffect(() => {
//     let cancelled = false;

//     Promise.allSettled([
//       api.get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } }),
//       api.get("/api/v1/payroll/get/components", { params: { is_active: true } }),
//     ]).then(([empRes, compRes]) => {
//       if (cancelled) return;

//       if (empRes.status === "fulfilled") {
//         setEmployees(getEmployees(empRes.value));
//       } else {
//         setError(getErrorMessage(empRes.reason));
//       }

//       if (compRes.status === "fulfilled") {
//         setComponentMaster(getComponentsList(compRes.value));
//       } else {
//         setComponentMaster([]);
//       }
//     });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ---------- Auto-dismiss success ---------- */
//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), 4000);
//     return () => clearTimeout(t);
//   }, [success]);

//   /* ---------- Component map ---------- */
//   const componentMap = useMemo(() => {
//     const map = {};
//     componentMaster.forEach((c) => {
//       const id = String(getComponentId(c));
//       if (id) map[id] = c;
//     });
//     return map;
//   }, [componentMaster]);

//   function getComponentLabelById(id) {
//     const c = componentMap[String(id || "")];
//     return c ? getComponentName(c) : id || "—";
//   }

//   /* ---------- Component rows ---------- */
//   function addRow() {
//     setComponents((prev) => [...prev, { ...EMPTY_ROW }]);
//   }

//   function updateRow(index, field, value) {
//     setComponents((prev) => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   }

//   function removeRow(index) {
//     setComponents((prev) => prev.filter((_, i) => i !== index));
//   }

//   function resetForm() {
//     setStructureName("");
//     setStructureDescription("");
//     setIsTemplate(false);
//     setAnnualCtc("");
//     setMonthlyCtc("");
//     setEffectiveFrom("");
//     setEffectiveTo("");
//     setRevisionReason("");
//     setComponents([{ ...EMPTY_ROW }]);
//     setCreateEmployeeId("");
//     setError("");
//     setSuccess("");
//   }

//   /* ---------- Validation ---------- */
//   const validationError = useMemo(() => {
//     if (!structureName.trim()) return "Structure name is required";
//     if (!annualCtc || Number(annualCtc) <= 0) return "Annual CTC must be greater than 0";
//     if (!effectiveFrom) return "Effective from date is required";
//     if (!isTemplate && !createEmployeeId) return "Please select an employee";

//     const validComponents = components.filter((c) => c.component_id);
//     if (validComponents.length === 0) return "At least one component is required";

//     // Duplicate component check
//     const ids = validComponents.map((c) => c.component_id);
//     const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
//     if (dupes.length > 0) return `Duplicate component selected: ${dupes[0]}`;

//     // Value check
//     for (let i = 0; i < validComponents.length; i++) {
//       const c = validComponents[i];
//       if (c.calculation_value === "" || Number(c.calculation_value) < 0) {
//         return `Component ${i + 1}: value is required and must be ≥ 0`;
//       }
//     }

//     return null;
//   }, [structureName, annualCtc, effectiveFrom, isTemplate, createEmployeeId, components]);

//   /* ---------- Template Download ---------- */
//   async function handleDownloadTemplate() {
//     setError("");
//     try {
//       const res = await api.get("/api/v1/payroll/structures/template/download", {
//         responseType: "blob",
//       });
//       const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "salary_structure_template.csv";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   /* ---------- Bulk Upload ---------- */
//   async function handleUpload() {
//     if (!selectedFile) {
//       setError("Please select a CSV file first");
//       return;
//     }
//     setUploadLoading(true);
//     setError("");
//     setSuccess("");
//     setUploadResult(null);
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);
//       const res = await api.post("/api/v1/payroll/structures/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const data = res?.data ?? {};
//       setUploadResult(data);
//       setSuccess(
//         `Upload completed · Created ${data.created_count ?? 0} · Errors ${data.error_count ?? 0}`
//       );
//       setSelectedFile(null);
//       // Reset file input
//       const fileInput = document.querySelector('input[type="file"]');
//       if (fileInput) fileInput.value = "";
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setUploadLoading(false);
//     }
//   }

//   /* ---------- Create ---------- */
//   async function handleCreate(e) {
//     e.preventDefault();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const selectedComponents = components.filter((c) => c.component_id);

//       await api.post("/api/v1/payroll/structures", {
//         structure_name: structureName.trim(),
//         structure_description: structureDescription.trim() || null,
//         employee_id: isTemplate ? null : createEmployeeId || null,
//         is_template: isTemplate,
//         annual_ctc: Number(annualCtc),
//         monthly_ctc: monthlyCtc ? Number(monthlyCtc) : null,
//         effective_from: effectiveFrom,
//         effective_to: effectiveTo || null,
//         revision_reason: revisionReason.trim() || null,
//         components: selectedComponents.map((c) => ({
//           component_id: c.component_id,
//           calculation_value: Number(c.calculation_value) || 0,
//           calculation_type: c.calculation_type,
//           is_variable: !!c.is_variable,
//           max_limit: c.max_limit ? Number(c.max_limit) : null,
//         })),
//       });

//       setSuccess(
//         isTemplate
//           ? "Template created successfully"
//           : "Salary structure created successfully"
//       );
//       resetForm();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ---------- View ---------- */
//   async function handleView() {
//     if (!viewEmployeeId) return;
//     setViewLoading(true);
//     setError("");
//     setViewData(null);
//     try {
//       const res = await api.get(`/api/v1/payroll/structures/${viewEmployeeId}`);
//       setViewData(extractStructureView(res));
//     } catch (err) {
//       setError(getErrorMessage(err));
//       setViewData(null);
//     } finally {
//       setViewLoading(false);
//     }
//   }

//   const tabs = [
//     { id: "view", label: "View Structure" },
//     { id: "create", label: "Create Single" },
//     { id: "bulk", label: "Bulk Upload" },
//   ];

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="border-b border-slate-200 bg-white">
//         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
//           <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
//                 Payroll
//               </p>
//               <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
//                 Salary Structure
//               </h1>
//               <p className="mt-1 text-sm text-slate-500">
//                 Manage employee salary structures, templates and bulk assignments
//               </p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="mt-5 flex gap-1 border-b border-slate-200">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setError("");
//                   setSuccess("");
//                 }}
//                 className={`relative px-4 py-2.5 text-sm font-medium transition ${
//                   activeTab === tab.id
//                     ? "text-[#E42527]"
//                     : "text-slate-500 hover:text-slate-800"
//                 }`}
//               >
//                 {tab.label}
//                 {activeTab === tab.id && (
//                   <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
//         {/* Banners */}
//         {error && (
//           <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
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
//         {success && (
//           <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
//             <span>{success}</span>
//             <button
//               type="button"
//               onClick={() => setSuccess("")}
//               className="text-emerald-400 hover:text-emerald-600"
//             >
//               ✕
//             </button>
//           </div>
//         )}

//         {/* ================= VIEW TAB ================= */}
//         {activeTab === "view" && (
//           <div className="space-y-5">
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <h2 className="text-sm font-semibold text-slate-800">Select Employee</h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Choose an employee to view their active salary structure
//               </p>

//               <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
//                 <select
//                   value={viewEmployeeId}
//                   onChange={(e) => setViewEmployeeId(e.target.value)}
//                   className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:bg-white"
//                 >
//                   <option value="">Select employee</option>
//                   {employees.map((emp) => {
//                     const id = getEmployeeId(emp);
//                     return id ? (
//                       <option key={id} value={id}>
//                         {getEmployeeName(emp)} ({id})
//                       </option>
//                     ) : null;
//                   })}
//                 </select>

//                 <button
//                   type="button"
//                   onClick={handleView}
//                   disabled={!viewEmployeeId || viewLoading}
//                   className="inline-flex items-center justify-center rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:opacity-50"
//                 >
//                   {viewLoading ? "Loading…" : "View Structure"}
//                 </button>
//               </div>
//             </div>

//             {viewData && viewData.structure ? (
//               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//                     <div>
//                       <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                         Active Structure
//                       </p>
//                       <h3 className="mt-1 text-lg font-semibold text-slate-900">
//                         {viewData.structure.structure_name || "Structure"}
//                       </h3>
//                       {viewData.structure.structure_description && (
//                         <p className="mt-1 text-sm text-slate-500">
//                           {viewData.structure.structure_description}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">
//                         <p className="text-[10px] uppercase tracking-wide text-slate-300">
//                           Annual CTC
//                         </p>
//                         <p className="text-sm font-semibold">
//                           ₹ {Number(viewData.structure.annual_ctc ?? 0).toLocaleString("en-IN")}
//                         </p>
//                       </div>
//                       <div className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">
//                         <p className="text-[10px] uppercase tracking-wide text-emerald-600">
//                           Monthly CTC
//                         </p>
//                         <p className="text-sm font-semibold">
//                           ₹ {Number(viewData.structure.monthly_ctc ?? 0).toLocaleString("en-IN")}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {(viewData.structure.effective_from || viewData.structure.effective_to) && (
//                     <p className="mt-3 text-xs text-slate-500">
//                       Effective:{" "}
//                       <span className="font-medium text-slate-700">
//                         {viewData.structure.effective_from || "—"}
//                       </span>
//                       {" → "}
//                       <span className="font-medium text-slate-700">
//                         {viewData.structure.effective_to || "Ongoing"}
//                       </span>
//                     </p>
//                   )}
//                 </div>

//                 {viewData.components.length === 0 ? (
//                   <div className="px-6 py-12 text-center text-sm text-slate-500">
//                     No components in this structure
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-slate-100 bg-slate-50/80">
//                           <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Component
//                           </th>
//                           <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Type
//                           </th>
//                           <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Value
//                           </th>
//                           <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Variable
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-50">
//                         {viewData.components.map((c, i) => (
//                           <tr key={i} className="hover:bg-slate-50/70">
//                             <td className="px-5 py-3.5">
//                               <div className="font-medium text-slate-800">
//                                 {getComponentLabelById(c.component_id)}
//                               </div>
//                               <div className="text-xs text-slate-400">{c.component_id}</div>
//                             </td>
//                             <td className="px-5 py-3.5">
//                               <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
//                                 {(c.calculation_type || "").replace(/_/g, " ")}
//                               </span>
//                             </td>
//                             <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
//                               {Number(c.calculation_value ?? 0).toFixed(2)}
//                             </td>
//                             <td className="px-5 py-3.5 text-center">
//                               <span
//                                 className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                                   c.is_variable
//                                     ? "bg-amber-50 text-amber-700"
//                                     : "bg-slate-100 text-slate-500"
//                                 }`}
//                               >
//                                 {c.is_variable ? "Yes" : "No"}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             ) : viewData ? (
//               <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
//                 <p className="text-sm font-medium text-slate-700">
//                   No active structure for this employee
//                 </p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Create one from the Create Single tab
//                 </p>
//               </div>
//             ) : (
//               <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
//                 <p className="text-sm font-medium text-slate-700">No structure loaded</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Select an employee and click View Structure
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ================= CREATE TAB ================= */}
//         {activeTab === "create" && (
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-5">
//               <h2 className="text-lg font-semibold text-slate-900">Create Structure</h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Create a single employee structure or save as reusable template
//               </p>
//             </div>

//             <form onSubmit={handleCreate} className="space-y-6">
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
//                   <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
//                     <input
//                       type="checkbox"
//                       checked={isTemplate}
//                       onChange={(e) => setIsTemplate(e.target.checked)}
//                       className="rounded border-slate-300 text-[#E42527]"
//                     />
//                     Save as Template
//                   </label>
//                   <p className="mt-1 text-xs text-slate-500">
//                     Template can be reused in bulk upload
//                   </p>

//                   {!isTemplate && (
//                     <select
//                       required={!isTemplate}
//                       value={createEmployeeId}
//                       onChange={(e) => setCreateEmployeeId(e.target.value)}
//                       className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="">Select employee</option>
//                       {employees.map((emp) => {
//                         const id = getEmployeeId(emp);
//                         return id ? (
//                           <option key={id} value={id}>
//                             {getEmployeeName(emp)} ({id})
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Structure Name *
//                   </label>
//                   <input
//                     required
//                     value={structureName}
//                     onChange={(e) => setStructureName(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Description
//                   </label>
//                   <input
//                     value={structureDescription}
//                     onChange={(e) => setStructureDescription(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Annual CTC *
//                   </label>
//                   <input
//                     required
//                     type="number"
//                     min="1"
//                     step="0.01"
//                     value={annualCtc}
//                     onChange={(e) => setAnnualCtc(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Monthly CTC
//                   </label>
//                   <input
//                     type="number"
//                     value={monthlyCtc}
//                     onChange={(e) => setMonthlyCtc(e.target.value)}
//                     placeholder="Auto if blank"
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Effective From *
//                   </label>
//                   <input
//                     required
//                     type="date"
//                     value={effectiveFrom}
//                     onChange={(e) => setEffectiveFrom(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Effective To
//                   </label>
//                   <input
//                     type="date"
//                     value={effectiveTo}
//                     min={effectiveFrom || undefined}
//                     onChange={(e) => setEffectiveTo(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Revision Reason
//                   </label>
//                   <input
//                     value={revisionReason}
//                     onChange={(e) => setRevisionReason(e.target.value)}
//                     placeholder="e.g. Annual appraisal 2026"
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>
//               </div>

//               {/* Components */}
//               <div>
//                 <div className="mb-3 flex items-center justify-between">
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-800">
//                       Salary Components
//                     </h3>
//                     <p className="text-xs text-slate-500">
//                       {componentMaster.length} components available
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={addRow}
//                     className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-[#E42527] hover:bg-red-50"
//                   >
//                     + Add Component
//                   </button>
//                 </div>

//                 <div className="overflow-hidden rounded-xl border border-slate-200">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-slate-100 bg-slate-50">
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Component
//                           </th>
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Type
//                           </th>
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Value
//                           </th>
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Max
//                           </th>
//                           <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Var
//                           </th>
//                           <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Action
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-50">
//                         {components.map((row, index) => (
//                           <tr key={index}>
//                             <td className="px-3 py-2">
//                               <select
//                                 required
//                                 value={row.component_id}
//                                 onChange={(e) =>
//                                   updateRow(index, "component_id", e.target.value)
//                                 }
//                                 className="w-full min-w-[200px] rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               >
//                                 <option value="">Select component</option>
//                                 {componentMaster.map((c) => {
//                                   const id = getComponentId(c);
//                                   return id ? (
//                                     <option key={id} value={id}>
//                                       {getComponentName(c)}
//                                     </option>
//                                   ) : null;
//                                 })}
//                               </select>
//                             </td>
//                             <td className="px-3 py-2">
//                               <select
//                                 value={row.calculation_type}
//                                 onChange={(e) =>
//                                   updateRow(index, "calculation_type", e.target.value)
//                                 }
//                                 className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               >
//                                 {CALCULATION_TYPES.map((t) => (
//                                   <option key={t.value} value={t.value}>
//                                     {t.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             </td>
//                             <td className="px-3 py-2">
//                               <input
//                                 type="number"
//                                 required
//                                 min="0"
//                                 step="0.01"
//                                 value={row.calculation_value}
//                                 onChange={(e) =>
//                                   updateRow(index, "calculation_value", e.target.value)
//                                 }
//                                 className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               />
//                             </td>
//                             <td className="px-3 py-2">
//                               <input
//                                 type="number"
//                                 min="0"
//                                 value={row.max_limit}
//                                 onChange={(e) =>
//                                   updateRow(index, "max_limit", e.target.value)
//                                 }
//                                 className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <input
//                                 type="checkbox"
//                                 checked={!!row.is_variable}
//                                 onChange={(e) =>
//                                   updateRow(index, "is_variable", e.target.checked)
//                                 }
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-right">
//                               {components.length > 1 && (
//                                 <button
//                                   type="button"
//                                   onClick={() => removeRow(index)}
//                                   className="text-sm text-red-500 hover:underline"
//                                 >
//                                   Remove
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               {validationError && (
//                 <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
//                   {validationError}
//                 </div>
//               )}

//               <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   disabled={loading}
//                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading || !!validationError}
//                   className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {loading ? "Saving…" : isTemplate ? "Save Template" : "Create Structure"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* ================= BULK TAB ================= */}
//         {activeTab === "bulk" && (
//           <div className="space-y-5">
//             <div className="grid gap-4 lg:grid-cols-2">
//               <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
//                   1
//                 </div>
//                 <h3 className="mt-4 text-base font-semibold text-slate-900">
//                   Download Template
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   CSV template download karo, Excel mein employee data bharo, phir upload karo.
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleDownloadTemplate}
//                   className="mt-5 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                 >
//                   Download CSV Template
//                 </button>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E42527] text-sm font-semibold text-white">
//                   2
//                 </div>
//                 <h3 className="mt-4 text-base font-semibold text-slate-900">
//                   Upload Filled CSV
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   100–1000 employees ke structures ek saath create ho jayenge.
//                 </p>

//                 <div className="mt-5 space-y-3">
//                   <input
//                     type="file"
//                     accept=".csv"
//                     onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                     className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
//                   />

//                   {selectedFile && (
//                     <p className="text-sm text-slate-600">
//                       Selected: <span className="font-medium">{selectedFile.name}</span>
//                     </p>
//                   )}

//                   <button
//                     type="button"
//                     onClick={handleUpload}
//                     disabled={uploadLoading || !selectedFile}
//                     className="inline-flex rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
//                   >
//                     {uploadLoading ? "Uploading…" : "Upload & Create"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {uploadResult && (
//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <div className="flex flex-wrap gap-3">
//                   <div className="rounded-xl bg-emerald-50 px-4 py-3">
//                     <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
//                       Created
//                     </p>
//                     <p className="text-xl font-semibold text-emerald-700">
//                       {uploadResult.created_count ?? 0}
//                     </p>
//                   </div>
//                   <div
//                     className={`rounded-xl px-4 py-3 ${
//                       (uploadResult.error_count ?? 0) > 0
//                         ? "bg-red-50"
//                         : "bg-slate-50"
//                     }`}
//                   >
//                     <p
//                       className={`text-xs font-medium uppercase tracking-wide ${
//                         (uploadResult.error_count ?? 0) > 0
//                           ? "text-red-600"
//                           : "text-slate-500"
//                       }`}
//                     >
//                       Errors
//                     </p>
//                     <p
//                       className={`text-xl font-semibold ${
//                         (uploadResult.error_count ?? 0) > 0
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       {uploadResult.error_count ?? 0}
//                     </p>
//                   </div>
//                 </div>

//                 {Array.isArray(uploadResult.errors) && uploadResult.errors.length > 0 && (
//                   <div className="mt-4 max-h-48 overflow-auto rounded-xl border border-red-100 bg-red-50/50 p-3">
//                     {uploadResult.errors.map((e, i) => (
//                       <div key={i} className="py-1 text-sm text-red-700">
//                         Row {e.row}: {e.employee_id || "-"} — {e.error}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
//               <p className="font-medium text-slate-700">CSV tips</p>
//               <ul className="mt-2 list-disc space-y-1 pl-5">
//                 <li>
//                   Required: <code>employee_id</code>, <code>annual_ctc</code>,{" "}
//                   <code>effective_from</code>
//                 </li>
//                 <li>
//                   Easy mode: use <code>template_structure_id</code> to copy components
//                 </li>
//                 <li>Date format: YYYY-MM-DD</li>
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useMemo, useState, useCallback } from "react";
// import { api } from "@/app/lib/api";

// /* ================= CONSTANTS ================= */

// const CALCULATION_TYPES = [
//   { value: "flat", label: "Flat" },
//   { value: "percentage", label: "Percentage" },
//   { value: "slab", label: "Slab" },
//   { value: "formula", label: "Formula" },
//   { value: "attendance_based", label: "Attendance Based" },
// ];

// const COMPONENT_TYPES = {
//   earning: "Earning",
//   deduction: "Deduction",
//   employer_contribution: "Employer Contribution",
//   reimbursement: "Reimbursement",
// };

// const EMPTY_ROW = {
//   component_id: "",
//   calculation_value: "",
//   calculation_type: "flat",
//   is_variable: false,
//   max_limit: "",
// };

// /* ================= HELPERS ================= */

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
//   if (err?.response?.status === 401) return "Session expired. Please login again.";
//   if (err?.response?.status === 403) return "You don't have permission. Contact Payroll Officer/Admin.";
//   if (err?.response?.status === 404) return "Not found.";
//   return err?.message || "Something went wrong";
// }

// function getEmployees(response) {
//   const body = response?.data ?? {};
//   const data = body?.data ?? body;
//   if (Array.isArray(data)) return data;
//   return data?.employees ?? data?.items ?? data?.results ?? [];
// }

// function getEmployeeId(emp) {
//   return emp?.employee_id || emp?.id || emp?._id || "";
// }

// function getEmployeeName(emp) {
//   const fullName = [emp?.first_name, emp?.last_name].filter(Boolean).join(" ");
//   return fullName || emp?.name || emp?.full_name || getEmployeeId(emp) || "Employee";
// }

// /**
//  * Robust list extractor — handles { success, total, data: [...] },
//  * { data: { items: [...] } }, { components: [...] }, or a bare array.
//  */
// function getComponentsList(response) {
//   const body = response?.data ?? {};
//   const candidates = [
//     body?.data,
//     body?.components,
//     body?.items,
//     body?.results,
//     body?.data?.components,
//     body?.data?.items,
//     body?.data?.results,
//     body?.data?.data,
//     body,
//   ];
//   for (const c of candidates) {
//     if (Array.isArray(c)) return c;
//   }
//   return [];
// }

// /**
//  * ✅ FIX: backend PK is `salary_component_id`, not `component_id`.
//  */
// function getComponentId(c) {
//   return (
//     c?.salary_component_id ||
//     c?.component_id ||
//     c?.id ||
//     c?._id ||
//     ""
//   );
// }

// function getComponentName(c) {
//   return (
//     c?.component_name ||
//     c?.name ||
//     c?.component_code ||
//     getComponentId(c) ||
//     "Component"
//   );
// }

// function getComponentType(c) {
//   return c?.component_type || "";
// }

// function getComponentCode(c) {
//   return c?.component_code || "";
// }

// function extractStructureView(response) {
//   const body = response?.data ?? {};
//   const payload = body?.data ?? body;
//   const structure = payload?.structure ?? null;
//   const components = Array.isArray(payload?.components)
//     ? payload.components
//     : Array.isArray(structure?.components)
//       ? structure.components
//       : [];
//   return { structure, components };
// }

// /* ================= COMPONENT ================= */

// export default function SalaryStructurePage() {
//   const [activeTab, setActiveTab] = useState("view"); // view | create | bulk

//   const [employees, setEmployees] = useState([]);
//   const [componentMaster, setComponentMaster] = useState([]);

//   const [viewEmployeeId, setViewEmployeeId] = useState("");
//   const [createEmployeeId, setCreateEmployeeId] = useState("");

//   const [structureName, setStructureName] = useState("");
//   const [structureDescription, setStructureDescription] = useState("");
//   const [isTemplate, setIsTemplate] = useState(false);
//   const [annualCtc, setAnnualCtc] = useState("");
//   const [monthlyCtc, setMonthlyCtc] = useState("");
//   const [effectiveFrom, setEffectiveFrom] = useState("");
//   const [effectiveTo, setEffectiveTo] = useState("");
//   const [revisionReason, setRevisionReason] = useState("");
//   const [components, setComponents] = useState([{ ...EMPTY_ROW }]);

//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [viewLoading, setViewLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [uploadResult, setUploadResult] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   /* ---------- Initial load ---------- */
//   useEffect(() => {
//     let cancelled = false;

//     Promise.allSettled([
//       api.get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } }),
//       api.get("/api/v1/payroll/get/components", { params: { is_active: true } }),
//     ]).then(([empRes, compRes]) => {
//       if (cancelled) return;

//       if (empRes.status === "fulfilled") {
//         setEmployees(getEmployees(empRes.value));
//       } else {
//         setError(getErrorMessage(empRes.reason));
//       }

//       if (compRes.status === "fulfilled") {
//         const list = getComponentsList(compRes.value);
//         setComponentMaster(list);
//       } else {
//         console.error("components fetch failed:", compRes.reason);
//         setComponentMaster([]);
//         setError(getErrorMessage(compRes.reason));
//       }
//     });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ---------- Auto-dismiss success ---------- */
//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), 4000);
//     return () => clearTimeout(t);
//   }, [success]);

//   /* ---------- Component map ---------- */
//   const componentMap = useMemo(() => {
//     const map = {};
//     componentMaster.forEach((c) => {
//       const id = String(getComponentId(c));
//       if (id) map[id] = c;
//     });
//     return map;
//   }, [componentMaster]);

//   const getComponentLabelById = useCallback(
//     (id) => {
//       const c = componentMap[String(id || "")];
//       return c ? getComponentName(c) : id || "—";
//     },
//     [componentMap]
//   );

//   /* ---------- Component rows ---------- */
//   function addRow() {
//     setComponents((prev) => [...prev, { ...EMPTY_ROW }]);
//   }

//   function updateRow(index, field, value) {
//     setComponents((prev) => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   }

//   function removeRow(index) {
//     setComponents((prev) => prev.filter((_, i) => i !== index));
//   }

//   function resetForm() {
//     setStructureName("");
//     setStructureDescription("");
//     setIsTemplate(false);
//     setAnnualCtc("");
//     setMonthlyCtc("");
//     setEffectiveFrom("");
//     setEffectiveTo("");
//     setRevisionReason("");
//     setComponents([{ ...EMPTY_ROW }]);
//     setCreateEmployeeId("");
//     setError("");
//     setSuccess("");
//   }

//   /* ---------- Validation ---------- */
//   const validationError = useMemo(() => {
//     if (!structureName.trim()) return "Structure name is required";
//     if (!annualCtc || Number(annualCtc) <= 0) return "Annual CTC must be greater than 0";
//     if (!effectiveFrom) return "Effective from date is required";
//     if (!isTemplate && !createEmployeeId) return "Please select an employee";

//     const validComponents = components.filter((c) => c.component_id);
//     if (validComponents.length === 0) return "At least one component is required";

//     const ids = validComponents.map((c) => c.component_id);
//     const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
//     if (dupes.length > 0) return `Duplicate component selected: ${dupes[0]}`;

//     for (let i = 0; i < validComponents.length; i++) {
//       const c = validComponents[i];
//       if (c.calculation_value === "" || Number(c.calculation_value) < 0) {
//         return `Component ${i + 1}: value is required and must be ≥ 0`;
//       }
//     }

//     return null;
//   }, [structureName, annualCtc, effectiveFrom, isTemplate, createEmployeeId, components]);

//   /* ---------- Template Download ---------- */
//   async function handleDownloadTemplate() {
//     setError("");
//     try {
//       const res = await api.get("/api/v1/payroll/structures/template/download", {
//         responseType: "blob",
//       });
//       const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "salary_structure_template.csv";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   /* ---------- Bulk Upload ---------- */
//   async function handleUpload() {
//     if (!selectedFile) {
//       setError("Please select a CSV file first");
//       return;
//     }
//     setUploadLoading(true);
//     setError("");
//     setSuccess("");
//     setUploadResult(null);
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);
//       const res = await api.post("/api/v1/payroll/structures/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const data = res?.data ?? {};
//       setUploadResult(data);
//       setSuccess(
//         `Upload completed · Created ${data.created_count ?? 0} · Errors ${data.error_count ?? 0}`
//       );
//       setSelectedFile(null);
//       const fileInput = document.querySelector('input[type="file"]');
//       if (fileInput) fileInput.value = "";
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setUploadLoading(false);
//     }
//   }

//   /* ---------- Create ---------- */
//   async function handleCreate(e) {
//     e.preventDefault();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const selectedComponents = components.filter((c) => c.component_id);

//       await api.post("/api/v1/payroll/structures", {
//         structure_name: structureName.trim(),
//         structure_description: structureDescription.trim() || null,
//         employee_id: isTemplate ? null : createEmployeeId || null,
//         is_template: isTemplate,
//         annual_ctc: Number(annualCtc),
//         monthly_ctc: monthlyCtc ? Number(monthlyCtc) : null,
//         effective_from: effectiveFrom,
//         effective_to: effectiveTo || null,
//         revision_reason: revisionReason.trim() || null,
//         components: selectedComponents.map((c) => ({
//           component_id: c.component_id,
//           calculation_value: Number(c.calculation_value) || 0,
//           calculation_type: c.calculation_type,
//           is_variable: !!c.is_variable,
//           max_limit: c.max_limit ? Number(c.max_limit) : null,
//         })),
//       });

//       setSuccess(
//         isTemplate
//           ? "Template created successfully"
//           : "Salary structure created successfully"
//       );
//       resetForm();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ---------- View ---------- */
//   async function handleView() {
//     if (!viewEmployeeId) return;
//     setViewLoading(true);
//     setError("");
//     setViewData(null);
//     try {
//       const res = await api.get(`/api/v1/payroll/structures/${viewEmployeeId}`);
//       setViewData(extractStructureView(res));
//     } catch (err) {
//       setError(getErrorMessage(err));
//       setViewData(null);
//     } finally {
//       setViewLoading(false);
//     }
//   }

//   const tabs = [
//     { id: "view", label: "View Structure" },
//     { id: "create", label: "Create Single" },
//     { id: "bulk", label: "Bulk Upload" },
//   ];

//   const availableComponents = useMemo(
//     () => componentMaster.filter((c) => getComponentId(c)),
//     [componentMaster]
//   );

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="border-b border-slate-200 bg-white">
//         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
//           <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
//                 Payroll
//               </p>
//               <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
//                 Salary Structure
//               </h1>
//               <p className="mt-1 text-sm text-slate-500">
//                 Manage employee salary structures, templates and bulk assignments
//               </p>
//             </div>
//           </div>

//           <div className="mt-5 flex gap-1 border-b border-slate-200">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setError("");
//                   setSuccess("");
//                 }}
//                 className={`relative px-4 py-2.5 text-sm font-medium transition ${
//                   activeTab === tab.id
//                     ? "text-[#E42527]"
//                     : "text-slate-500 hover:text-slate-800"
//                 }`}
//               >
//                 {tab.label}
//                 {activeTab === tab.id && (
//                   <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
//         {/* Banners */}
//         {error && (
//           <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
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
//         {success && (
//           <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
//             <span>{success}</span>
//             <button
//               type="button"
//               onClick={() => setSuccess("")}
//               className="text-emerald-400 hover:text-emerald-600"
//             >
//               ✕
//             </button>
//           </div>
//         )}

//         {/* ================= VIEW TAB ================= */}
//         {activeTab === "view" && (
//           <div className="space-y-5">
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <h2 className="text-sm font-semibold text-slate-800">Select Employee</h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Choose an employee to view their active salary structure
//               </p>

//               <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
//                 <select
//                   value={viewEmployeeId}
//                   onChange={(e) => setViewEmployeeId(e.target.value)}
//                   className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:bg-white"
//                 >
//                   <option value="">Select employee</option>
//                   {employees.map((emp) => {
//                     const id = getEmployeeId(emp);
//                     return id ? (
//                       <option key={id} value={id}>
//                         {getEmployeeName(emp)} ({id})
//                       </option>
//                     ) : null;
//                   })}
//                 </select>

//                 <button
//                   type="button"
//                   onClick={handleView}
//                   disabled={!viewEmployeeId || viewLoading}
//                   className="inline-flex items-center justify-center rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:opacity-50"
//                 >
//                   {viewLoading ? "Loading…" : "View Structure"}
//                 </button>
//               </div>
//             </div>

//             {viewData && viewData.structure ? (
//               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//                     <div>
//                       <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                         Active Structure
//                       </p>
//                       <h3 className="mt-1 text-lg font-semibold text-slate-900">
//                         {viewData.structure.structure_name || "Structure"}
//                       </h3>
//                       {viewData.structure.structure_description && (
//                         <p className="mt-1 text-sm text-slate-500">
//                           {viewData.structure.structure_description}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">
//                         <p className="text-[10px] uppercase tracking-wide text-slate-300">
//                           Annual CTC
//                         </p>
//                         <p className="text-sm font-semibold">
//                           ₹ {Number(viewData.structure.annual_ctc ?? 0).toLocaleString("en-IN")}
//                         </p>
//                       </div>
//                       <div className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">
//                         <p className="text-[10px] uppercase tracking-wide text-emerald-600">
//                           Monthly CTC
//                         </p>
//                         <p className="text-sm font-semibold">
//                           ₹ {Number(viewData.structure.monthly_ctc ?? 0).toLocaleString("en-IN")}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {(viewData.structure.effective_from || viewData.structure.effective_to) && (
//                     <p className="mt-3 text-xs text-slate-500">
//                       Effective:{" "}
//                       <span className="font-medium text-slate-700">
//                         {viewData.structure.effective_from || "—"}
//                       </span>
//                       {" → "}
//                       <span className="font-medium text-slate-700">
//                         {viewData.structure.effective_to || "Ongoing"}
//                       </span>
//                     </p>
//                   )}
//                 </div>

//                 {viewData.components.length === 0 ? (
//                   <div className="px-6 py-12 text-center text-sm text-slate-500">
//                     No components in this structure
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-slate-100 bg-slate-50/80">
//                           <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Component
//                           </th>
//                           <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Type
//                           </th>
//                           <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Value
//                           </th>
//                           <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Variable
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-50">
//                         {viewData.components.map((c, i) => (
//                           <tr key={i} className="hover:bg-slate-50/70">
//                             <td className="px-5 py-3.5">
//                               <div className="font-medium text-slate-800">
//                                 {getComponentLabelById(c.component_id)}
//                               </div>
//                               <div className="text-xs text-slate-400">{c.component_id}</div>
//                             </td>
//                             <td className="px-5 py-3.5">
//                               <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
//                                 {(c.calculation_type || "").replace(/_/g, " ")}
//                               </span>
//                             </td>
//                             <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
//                               {Number(c.calculation_value ?? 0).toFixed(2)}
//                             </td>
//                             <td className="px-5 py-3.5 text-center">
//                               <span
//                                 className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                                   c.is_variable
//                                     ? "bg-amber-50 text-amber-700"
//                                     : "bg-slate-100 text-slate-500"
//                                 }`}
//                               >
//                                 {c.is_variable ? "Yes" : "No"}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             ) : viewData ? (
//               <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
//                 <p className="text-sm font-medium text-slate-700">
//                   No active structure for this employee
//                 </p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Create one from the Create Single tab
//                 </p>
//               </div>
//             ) : (
//               <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
//                 <p className="text-sm font-medium text-slate-700">No structure loaded</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Select an employee and click View Structure
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ================= CREATE TAB ================= */}
//         {activeTab === "create" && (
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-5">
//               <h2 className="text-lg font-semibold text-slate-900">Create Structure</h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Create a single employee structure or save as reusable template
//               </p>
//             </div>

//             <form onSubmit={handleCreate} className="space-y-6">
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
//                   <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
//                     <input
//                       type="checkbox"
//                       checked={isTemplate}
//                       onChange={(e) => setIsTemplate(e.target.checked)}
//                       className="rounded border-slate-300 text-[#E42527]"
//                     />
//                     Save as Template
//                   </label>
//                   <p className="mt-1 text-xs text-slate-500">
//                     Template can be reused in bulk upload
//                   </p>

//                   {!isTemplate && (
//                     <select
//                       required={!isTemplate}
//                       value={createEmployeeId}
//                       onChange={(e) => setCreateEmployeeId(e.target.value)}
//                       className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="">Select employee</option>
//                       {employees.map((emp) => {
//                         const id = getEmployeeId(emp);
//                         return id ? (
//                           <option key={id} value={id}>
//                             {getEmployeeName(emp)} ({id})
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Structure Name *
//                   </label>
//                   <input
//                     required
//                     value={structureName}
//                     onChange={(e) => setStructureName(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Description
//                   </label>
//                   <input
//                     value={structureDescription}
//                     onChange={(e) => setStructureDescription(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Annual CTC *
//                   </label>
//                   <input
//                     required
//                     type="number"
//                     min="1"
//                     step="0.01"
//                     value={annualCtc}
//                     onChange={(e) => setAnnualCtc(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Monthly CTC
//                   </label>
//                   <input
//                     type="number"
//                     value={monthlyCtc}
//                     onChange={(e) => setMonthlyCtc(e.target.value)}
//                     placeholder="Auto if blank"
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Effective From *
//                   </label>
//                   <input
//                     required
//                     type="date"
//                     value={effectiveFrom}
//                     onChange={(e) => setEffectiveFrom(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Effective To
//                   </label>
//                   <input
//                     type="date"
//                     value={effectiveTo}
//                     min={effectiveFrom || undefined}
//                     onChange={(e) => setEffectiveTo(e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Revision Reason
//                   </label>
//                   <input
//                     value={revisionReason}
//                     onChange={(e) => setRevisionReason(e.target.value)}
//                     placeholder="e.g. Annual appraisal 2026"
//                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>
//               </div>

//               {/* Components */}
//               <div>
//                 <div className="mb-3 flex items-center justify-between">
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-800">
//                       Salary Components
//                     </h3>
//                     <p className="text-xs text-slate-500">
//                       {availableComponents.length} components available
//                       {componentMaster.length === 0 && (
//                         <span className="ml-1 text-red-500">
//                           — none loaded, check permissions
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={addRow}
//                     className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-[#E42527] hover:bg-red-50"
//                   >
//                     + Add Component
//                   </button>
//                 </div>

//                 <div className="overflow-hidden rounded-xl border border-slate-200">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-slate-100 bg-slate-50">
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Component
//                           </th>
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Type
//                           </th>
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Value
//                           </th>
//                           <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Max
//                           </th>
//                           <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Var
//                           </th>
//                           <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                             Action
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-50">
//                         {components.map((row, index) => (
//                           <tr key={index}>
//                             <td className="px-3 py-2">
//                               <select
//                                 required
//                                 value={row.component_id}
//                                 onChange={(e) =>
//                                   updateRow(index, "component_id", e.target.value)
//                                 }
//                                 className="w-full min-w-[220px] rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               >
//                                 <option value="">Select component</option>
//                                 {availableComponents.map((c) => {
//                                   const id = getComponentId(c);
//                                   const type = getComponentType(c);
//                                   const code = getComponentCode(c);
//                                   return (
//                                     <option key={id} value={id}>
//                                       {getComponentName(c)}
//                                       {code ? ` (${code})` : ""}
//                                       {type ? ` · ${COMPONENT_TYPES[type] || type}` : ""}
//                                     </option>
//                                   );
//                                 })}
//                               </select>
//                             </td>
//                             <td className="px-3 py-2">
//                               <select
//                                 value={row.calculation_type}
//                                 onChange={(e) =>
//                                   updateRow(index, "calculation_type", e.target.value)
//                                 }
//                                 className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               >
//                                 {CALCULATION_TYPES.map((t) => (
//                                   <option key={t.value} value={t.value}>
//                                     {t.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             </td>
//                             <td className="px-3 py-2">
//                               <input
//                                 type="number"
//                                 required
//                                 min="0"
//                                 step="0.01"
//                                 value={row.calculation_value}
//                                 onChange={(e) =>
//                                   updateRow(index, "calculation_value", e.target.value)
//                                 }
//                                 className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               />
//                             </td>
//                             <td className="px-3 py-2">
//                               <input
//                                 type="number"
//                                 min="0"
//                                 value={row.max_limit}
//                                 onChange={(e) =>
//                                   updateRow(index, "max_limit", e.target.value)
//                                 }
//                                 className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm"
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <input
//                                 type="checkbox"
//                                 checked={!!row.is_variable}
//                                 onChange={(e) =>
//                                   updateRow(index, "is_variable", e.target.checked)
//                                 }
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-right">
//                               {components.length > 1 && (
//                                 <button
//                                   type="button"
//                                   onClick={() => removeRow(index)}
//                                   className="text-sm text-red-500 hover:underline"
//                                 >
//                                   Remove
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               {validationError && (
//                 <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
//                   {validationError}
//                 </div>
//               )}

//               <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   disabled={loading}
//                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading || !!validationError}
//                   className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {loading ? "Saving…" : isTemplate ? "Save Template" : "Create Structure"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* ================= BULK TAB ================= */}
//         {activeTab === "bulk" && (
//           <div className="space-y-5">
//             <div className="grid gap-4 lg:grid-cols-2">
//               <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
//                   1
//                 </div>
//                 <h3 className="mt-4 text-base font-semibold text-slate-900">
//                   Download Template
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   CSV template download karo, Excel mein employee data bharo, phir upload karo.
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleDownloadTemplate}
//                   className="mt-5 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                 >
//                   Download CSV Template
//                 </button>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E42527] text-sm font-semibold text-white">
//                   2
//                 </div>
//                 <h3 className="mt-4 text-base font-semibold text-slate-900">
//                   Upload Filled CSV
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   100–1000 employees ke structures ek saath create ho jayenge.
//                 </p>

//                 <div className="mt-5 space-y-3">
//                   <input
//                     type="file"
//                     accept=".csv"
//                     onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                     className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
//                   />

//                   {selectedFile && (
//                     <p className="text-sm text-slate-600">
//                       Selected: <span className="font-medium">{selectedFile.name}</span>
//                     </p>
//                   )}

//                   <button
//                     type="button"
//                     onClick={handleUpload}
//                     disabled={uploadLoading || !selectedFile}
//                     className="inline-flex rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
//                   >
//                     {uploadLoading ? "Uploading…" : "Upload & Create"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {uploadResult && (
//               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                 <div className="flex flex-wrap gap-3">
//                   <div className="rounded-xl bg-emerald-50 px-4 py-3">
//                     <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
//                       Created
//                     </p>
//                     <p className="text-xl font-semibold text-emerald-700">
//                       {uploadResult.created_count ?? 0}
//                     </p>
//                   </div>
//                   <div
//                     className={`rounded-xl px-4 py-3 ${
//                       (uploadResult.error_count ?? 0) > 0
//                         ? "bg-red-50"
//                         : "bg-slate-50"
//                     }`}
//                   >
//                     <p
//                       className={`text-xs font-medium uppercase tracking-wide ${
//                         (uploadResult.error_count ?? 0) > 0
//                           ? "text-red-600"
//                           : "text-slate-500"
//                       }`}
//                     >
//                       Errors
//                     </p>
//                     <p
//                       className={`text-xl font-semibold ${
//                         (uploadResult.error_count ?? 0) > 0
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       {uploadResult.error_count ?? 0}
//                     </p>
//                   </div>
//                 </div>

//                 {Array.isArray(uploadResult.errors) && uploadResult.errors.length > 0 && (
//                   <div className="mt-4 max-h-48 overflow-auto rounded-xl border border-red-100 bg-red-50/50 p-3">
//                     {uploadResult.errors.map((e, i) => (
//                       <div key={i} className="py-1 text-sm text-red-700">
//                         Row {e.row}: {e.employee_id || "-"} — {e.error}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
//               <p className="font-medium text-slate-700">CSV tips</p>
//               <ul className="mt-2 list-disc space-y-1 pl-5">
//                 <li>
//                   Required: <code>employee_id</code>, <code>annual_ctc</code>,{" "}
//                   <code>effective_from</code>
//                 </li>
//                 <li>
//                   Easy mode: use <code>template_structure_id</code> to copy components
//                 </li>
//                 <li>Date format: YYYY-MM-DD</li>
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState, useCallback, Fragment } from "react";
import { api } from "@/app/lib/api";

/* ================= CONSTANTS ================= */

const RESERVED_TOKENS = ["CTC", "ANNUAL_CTC", "MONTHLY_CTC", "GROSS"];

const COMPONENT_TYPES = {
  earning: "Earning",
  deduction: "Deduction",
  employer_contribution: "Employer Contribution",
  reimbursement: "Reimbursement",
};

const EMPTY_ROW = {
  component_id: "",
  calculation_type: "formula",
  calculation_value: "",
  formula: "",
  is_variable: false,
  max_limit: "",
};

/* ================= HELPERS ================= */

function getErrorMessage(err) {
  const d = err?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((i) => i?.msg || "Error").join(", ");
  if (typeof d === "string") return d;
  if (err?.code === "ERR_NETWORK") return "Network error.";
  if (err?.response?.status === 401) return "Session expired.";
  if (err?.response?.status === 403) return "You don't have permission.";
  if (err?.response?.status === 404) return "Not found.";
  return err?.message || "Something went wrong";
}

function dig(obj, path) {
  const v = path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
  return Array.isArray(v) ? v : undefined;
}

function getList(res, ...paths) {
  const body = res?.data ?? {};
  for (const p of paths) {
    const v = dig(body, p);
    if (v) return v;
  }
  const common = [
    "data", "employees", "components", "items", "results", "rows", "records", "list",
    "data.data", "data.employees", "data.components", "data.items", "data.results",
  ];
  for (const k of common) {
    const v = dig(body, k);
    if (v) return v;
  }
  if (Array.isArray(body)) return body;
  if (Array.isArray(res)) return res;
  return [];
}

function getEmployees(res) { return getList(res, "employees", "data.employees"); }
function getEmployeeId(e) { return e?.employee_id || e?.id || ""; }
function getEmployeeName(e) {
  const f = [e?.first_name, e?.last_name].filter(Boolean).join(" ").trim();
  return f || e?.name || e?.full_name || e?.company_email || getEmployeeId(e) || "Employee";
}
function getComponentsList(res) { return getList(res, "data", "components", "data.components"); }
function getComponentId(c) { return c?.salary_component_id || c?.component_id || c?.id || ""; }
function getComponentName(c) { return c?.component_name || c?.name || c?.component_code || getComponentId(c); }
function getComponentCode(c) { return c?.component_code || ""; }

function extractAssignmentView(res) {
  const body = res?.data ?? {};
  const payload = body?.data ?? body;
  return {
    structure: payload?.structure ?? null,
    gross: payload?.gross ?? null,
    components: Array.isArray(payload?.components) ? payload.components : [],
  };
}

function inr(v) {
  return Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/* ================= COMPONENT ================= */

export default function SalaryStructurePage() {
  const [activeTab, setActiveTab] = useState("create"); // create | assign | view | register

  const [employees, setEmployees] = useState([]);
  const [componentMaster, setComponentMaster] = useState([]);
  const [templates, setTemplates] = useState([]);

  // CREATE
  const [structureName, setStructureName] = useState("");
  const [structureDescription, setStructureDescription] = useState("");
  const [components, setComponents] = useState([{ ...EMPTY_ROW }]);

  // ASSIGN
  const [assignStructureId, setAssignStructureId] = useState("");
  const [assignEmployeeIds, setAssignEmployeeIds] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [ctcMode, setCtcMode] = useState("uniform");
  const [uniformCtc, setUniformCtc] = useState("");
  const [perEmployeeCtc, setPerEmployeeCtc] = useState({});
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // VIEW
  const [viewEmployeeId, setViewEmployeeId] = useState("");
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // REGISTER
  const [registerData, setRegisterData] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSearch, setRegisterSearch] = useState("");
  const [registerDeptFilter, setRegisterDeptFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------- Initial load ---------- */
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.get("/api/v1/get/employees"),
      api.get("/api/v1/payroll/get/components", { params: { is_active: true } }),
      api.get("/api/v1/payroll/structures"),
    ]).then(([empRes, compRes, structRes]) => {
      if (cancelled) return;
      if (empRes.status === "fulfilled") setEmployees(getEmployees(empRes.value));
      else setError(getErrorMessage(empRes.reason));
      if (compRes.status === "fulfilled") setComponentMaster(getComponentsList(compRes.value));
      if (structRes.status === "fulfilled") setTemplates(getList(structRes.value, "data"));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  useEffect(() => {
    if (activeTab === "register" && registerData === null && !registerLoading) {
      loadRegister();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /* ---------- Lookups ---------- */
  const componentMap = useMemo(() => {
    const m = {};
    componentMaster.forEach((c) => {
      const id = String(getComponentId(c));
      if (id) m[id] = c;
    });
    return m;
  }, [componentMaster]);

  const getLabelById = useCallback(
    (id) => {
      const c = componentMap[String(id || "")];
      return c ? getComponentName(c) : id || "—";
    },
    [componentMap]
  );

  const availableComponents = useMemo(
    () => componentMaster.filter((c) => getComponentId(c)),
    [componentMaster]
  );

  const filteredEmployees = useMemo(() => {
    if (!employeeFilter.trim()) return employees;
    const q = employeeFilter.toLowerCase();
    return employees.filter((e) => {
      const hay = [getEmployeeName(e), getEmployeeId(e), e?.company_email]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [employees, employeeFilter]);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.salary_structure_id === assignStructureId),
    [templates, assignStructureId]
  );

  /* ---------- Create rows ---------- */
  function addRow() { setComponents((p) => [...p, { ...EMPTY_ROW }]); }
  function updateRow(i, field, value) {
    setComponents((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }
  function removeRow(i) { setComponents((p) => p.filter((_, j) => j !== i)); }
  function insertIntoFormula(i, token) {
    setComponents((prev) => {
      const next = [...prev];
      const cur = next[i].formula || "";
      const sep = cur && !cur.endsWith(" ") ? " " : "";
      next[i] = { ...next[i], formula: cur + sep + token };
      return next;
    });
  }
  function resetCreate() {
    setStructureName("");
    setStructureDescription("");
    setComponents([{ ...EMPTY_ROW }]);
    setError("");
    setSuccess("");
  }

  /* ---------- Validation ---------- */
  const createError = useMemo(() => {
    if (!structureName.trim()) return "Structure name is required";
    const valid = components.filter((c) => c.component_id);
    if (valid.length === 0) return "At least one component is required";
    const ids = valid.map((c) => c.component_id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) return `Duplicate component: ${getLabelById(dupes[0])}`;

    const codes = new Set(
      valid
        .map((c) => (getComponentCode(componentMap[c.component_id]) || "").toUpperCase())
        .filter(Boolean)
    );
    for (let i = 0; i < valid.length; i++) {
      const c = valid[i];
      if (c.calculation_type === "formula") {
        const f = (c.formula || "").trim();
        if (!f) return `Row ${i + 1}: formula required`;
        const refs = [...f.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)].map((m) => m[0].toUpperCase());
        for (const r of refs) {
          if (RESERVED_TOKENS.includes(r)) continue;
          if (!codes.has(r)) return `Row ${i + 1}: formula references '${r}', not in this structure`;
        }
      } else if (c.calculation_value === "" || Number(c.calculation_value) < 0) {
        return `Row ${i + 1}: value required`;
      }
    }
    return null;
  }, [structureName, components, componentMap, getLabelById]);

  const assignError = useMemo(() => {
    if (!assignStructureId) return "Select a structure";
    if (assignEmployeeIds.length === 0) return "Select at least one employee";
    if (!effectiveFrom) return "Effective from is required";
    if (ctcMode === "uniform") {
      if (!uniformCtc || Number(uniformCtc) <= 0) return "Enter a valid CTC";
    } else {
      for (const eid of assignEmployeeIds) {
        if (!perEmployeeCtc[eid] || Number(perEmployeeCtc[eid]) <= 0) {
          const emp = employees.find((x) => getEmployeeId(x) === eid);
          return `CTC missing for ${emp ? getEmployeeName(emp) : eid}`;
        }
      }
    }
    return null;
  }, [assignStructureId, assignEmployeeIds, effectiveFrom, ctcMode, uniformCtc, perEmployeeCtc, employees]);

  /* ---------- CREATE ---------- */
  async function handleCreate(e) {
    e.preventDefault();
    if (createError) { setError(createError); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const selected = components.filter((c) => c.component_id);
      await api.post("/api/v1/payroll/structures", {
        structure_name: structureName.trim(),
        structure_description: structureDescription.trim() || null,
        components: selected.map((c) => ({
          component_id: c.component_id,
          calculation_type: c.calculation_type,
          calculation_value:
            c.calculation_type === "formula" ? null : Number(c.calculation_value || 0),
          formula: c.calculation_type === "formula" ? c.formula.trim() : null,
          is_variable: !!c.is_variable,
          max_limit: c.max_limit ? Number(c.max_limit) : null,
          display_order: 100,
        })),
      });
      setSuccess("Structure saved");
      resetCreate();
      const res = await api.get("/api/v1/payroll/structures");
      setTemplates(getList(res, "data"));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  /* ---------- ASSIGN ---------- */
  async function handleAssign(e) {
    e.preventDefault();
    if (assignError) { setError(assignError); return; }
    setAssignLoading(true); setError(""); setSuccess("");
    try {
      const body = {
        effective_from: effectiveFrom,
        effective_to: effectiveTo || null,
        revision_reason: revisionReason.trim() || null,
      };
      if (ctcMode === "uniform") {
        body.uniform_annual_ctc = Number(uniformCtc);
        body.employee_ids = assignEmployeeIds;
      } else {
        body.assignments = assignEmployeeIds.map((eid) => ({
          employee_id: eid,
          annual_ctc: Number(perEmployeeCtc[eid]),
        }));
      }
      const res = await api.post(`/api/v1/payroll/structures/${assignStructureId}/assign`, body);
      setSuccess(`Assigned to ${res.data?.created_count ?? assignEmployeeIds.length} employee(s)`);
      setAssignEmployeeIds([]);
      setPerEmployeeCtc({});
      setUniformCtc("");
      setRevisionReason("");
      setRegisterData(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAssignLoading(false);
    }
  }

  /* ---------- VIEW ---------- */
  async function handleView() {
    if (!viewEmployeeId) return;
    setViewLoading(true); setError(""); setViewData(null);
    try {
      const res = await api.get(`/api/v1/payroll/employees/${viewEmployeeId}/assignment`);
      setViewData(extractAssignmentView(res));
    } catch (err) {
      setError(getErrorMessage(err));
      setViewData(null);
    } finally {
      setViewLoading(false);
    }
  }

  /* ---------- REGISTER ---------- */
  async function loadRegister() {
    setRegisterLoading(true); setError("");
    try {
      const res = await api.get("/api/v1/payroll/salary-register");
      setRegisterData(getList(res, "data"));
    } catch (err) {
      setError(getErrorMessage(err));
      setRegisterData([]);
    } finally {
      setRegisterLoading(false);
    }
  }

  const registerDepartments = useMemo(() => {
    if (!registerData) return [];
    const s = new Set();
    registerData.forEach((r) => r.department_name && r.department_name !== "—" && s.add(r.department_name));
    return Array.from(s).sort();
  }, [registerData]);

  const filteredRegister = useMemo(() => {
    if (!registerData) return [];
    const q = registerSearch.trim().toLowerCase();
    return registerData.filter((r) => {
      if (registerDeptFilter && r.department_name !== registerDeptFilter) return false;
      if (!q) return true;
      const hay = [r.employee_name, r.employee_id, r.department_name, r.designation_name]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [registerData, registerSearch, registerDeptFilter]);

  const registerTotals = useMemo(() => {
    if (!registerData) return { employees: 0, monthlyCtc: 0, monthlyGross: 0, annualCtc: 0 };
    let monthlyCtc = 0, monthlyGross = 0, annualCtc = 0;
    filteredRegister.forEach((r) => {
      monthlyCtc += Number(r.monthly_ctc || 0);
      monthlyGross += Number(r.monthly_gross || 0);
      annualCtc += Number(r.annual_ctc || 0);
    });
    return { employees: filteredRegister.length, monthlyCtc, monthlyGross, annualCtc };
  }, [filteredRegister, registerData]);

  function toggleRow(id) {
    setExpandedRows((p) => ({ ...p, [id]: !p[id] }));
  }

  const tabs = [
    { id: "create", label: "Create Structure" },
    { id: "assign", label: "Assign to Employees" },
    { id: "view", label: "View Structure" },
    { id: "register", label: "Salary Register" },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">Payroll</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Salary Structure</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create templates with formulas, assign to employees, and view the register.
          </p>
          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setActiveTab(t.id); setError(""); setSuccess(""); }}
                className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === t.id ? "text-[#E42527]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
                {activeTab === t.id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-600">✕</button>
          </div>
        )}

        {/* ==================== CREATE ==================== */}
        {activeTab === "create" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create Structure</h2>
            <p className="mt-1 mb-5 text-sm text-slate-500">
              Reserved tokens: <code>CTC</code>, <code>ANNUAL_CTC</code>, <code>MONTHLY_CTC</code>, <code>GROSS</code>.
            </p>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Structure Name *</Label>
                  <input
                    required
                    value={structureName}
                    onChange={(e) => setStructureName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <input
                    value={structureDescription}
                    onChange={(e) => setStructureDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Components</h3>
                    <p className="text-xs text-slate-500">
                      {availableComponents.length} available
                      {componentMaster.length === 0 && (
                        <span className="ml-1 text-red-500">— none loaded</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addRow}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-[#E42527] hover:bg-red-50"
                  >
                    + Add Component
                  </button>
                </div>

                <div className="space-y-3">
                  {components.map((row, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                      <div className="grid gap-3 lg:grid-cols-12">
                        <div className="lg:col-span-3">
                          <Label>Component</Label>
                          <select
                            required
                            value={row.component_id}
                            onChange={(e) => updateRow(i, "component_id", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                          >
                            <option value="">Select component</option>
                            {availableComponents.map((c) => {
                              const id = getComponentId(c);
                              return (
                                <option key={id} value={id}>
                                  {getComponentName(c)} ({getComponentCode(c)})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="lg:col-span-2">
                          <Label>Type</Label>
                          <select
                            value={row.calculation_type}
                            onChange={(e) => updateRow(i, "calculation_type", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                          >
                            <option value="formula">Formula</option>
                            <option value="flat">Flat</option>
                            <option value="percentage">% of CTC</option>
                          </select>
                        </div>

                        <div className="lg:col-span-5">
                          <Label>
                            {row.calculation_type === "formula"
                              ? "Formula"
                              : row.calculation_type === "percentage"
                              ? "Percentage"
                              : "Value"}
                          </Label>
                          {row.calculation_type === "formula" ? (
                            <div className="space-y-1">
                              <input
                                value={row.formula}
                                onChange={(e) => updateRow(i, "formula", e.target.value)}
                                placeholder="e.g. BASIC + HRA + SA"
                                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs"
                              />
                              <div className="flex flex-wrap gap-1">
                                {availableComponents
                                  .filter((c) => getComponentId(c) !== row.component_id)
                                  .map((c) => {
                                    const cc = getComponentCode(c);
                                    if (!cc) return null;
                                    return (
                                      <button
                                        key={cc}
                                        type="button"
                                        onClick={() => insertIntoFormula(i, cc)}
                                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-200"
                                      >
                                        {cc}
                                      </button>
                                    );
                                  })}
                                {["CTC", "ANNUAL_CTC", "GROSS"].map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => insertIntoFormula(i, t)}
                                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100"
                                  >
                                    {t}
                                  </button>
                                ))}
                                {["+", "-", "*", "/", "(", ")"].map((op) => (
                                  <button
                                    key={op}
                                    type="button"
                                    onClick={() => insertIntoFormula(i, op)}
                                    className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-white hover:bg-slate-700"
                                  >
                                    {op}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.calculation_value}
                              onChange={(e) => updateRow(i, "calculation_value", e.target.value)}
                              className="w-32 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                            />
                          )}
                        </div>

                        <div className="lg:col-span-1">
                          <Label>Max</Label>
                          <input
                            type="number"
                            min="0"
                            value={row.max_limit}
                            onChange={(e) => updateRow(i, "max_limit", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                          />
                        </div>

                        <div className="flex items-end justify-end lg:col-span-1">
                          <label className="flex items-center gap-1 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={!!row.is_variable}
                              onChange={(e) => updateRow(i, "is_variable", e.target.checked)}
                            />
                            Var
                          </label>
                        </div>
                      </div>
                      {components.length > 1 && (
                        <div className="mt-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeRow(i)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {createError && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {createError}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={resetCreate}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading || !!createError}
                  className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {loading ? "Saving…" : "Save Structure"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== ASSIGN ==================== */}
        {activeTab === "assign" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Assign to Employees</h2>

            <form onSubmit={handleAssign} className="mt-5 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2">
                  <Label>Structure Template *</Label>
                  <select
                    required
                    value={assignStructureId}
                    onChange={(e) => setAssignStructureId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  >
                    <option value="">
                      {templates.length === 0 ? "No templates yet" : "Select structure"}
                    </option>
                    {templates.map((t) => (
                      <option key={t.salary_structure_id} value={t.salary_structure_id}>
                        {t.structure_name} ·{" "}
                        {Array.isArray(t.formulas) ? t.formulas.length : 0} components
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Effective From *</Label>
                  <input
                    required
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
                <div>
                  <Label>Effective To</Label>
                  <input
                    type="date"
                    value={effectiveTo}
                    min={effectiveFrom || undefined}
                    onChange={(e) => setEffectiveTo(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Revision Reason</Label>
                  <input
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    placeholder="e.g. Annual appraisal 2026"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
              </div>

              {selectedTemplate && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Template Formula
                  </p>
                  <div className="space-y-1">
                    {(selectedTemplate.formulas || []).map((f, i) => {
                      const meta = (selectedTemplate.components || []).find(
                        (c) => c.component_id === f.component_id
                      );
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs text-slate-700"
                        >
                          <span className="font-medium">
                            {meta?.component_name || getLabelById(f.component_id)}
                          </span>
                          <span className="font-mono text-slate-500">
                            {f.formula
                              ? f.formula
                              : f.calculation_type === "percentage"
                              ? `${f.calculation_value}%`
                              : `₹ ${inr(f.calculation_value)}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={ctcMode === "uniform"}
                      onChange={() => setCtcMode("uniform")}
                    />
                    Same CTC for all
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={ctcMode === "per"}
                      onChange={() => setCtcMode("per")}
                    />
                    Different CTC per employee
                  </label>
                </div>
                {ctcMode === "uniform" && (
                  <div className="mt-3 max-w-xs">
                    <Label>Annual CTC *</Label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={uniformCtc}
                      onChange={(e) => setUniformCtc(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    {assignEmployeeIds.length} selected of {employees.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <input
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      placeholder="Filter employees"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setAssignEmployeeIds(filteredEmployees.map(getEmployeeId))}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignEmployeeIds([])}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr className="border-b border-slate-100">
                        <Th align="center">✓</Th>
                        <Th>Employee</Th>
                        {ctcMode === "per" && <Th align="right">Annual CTC *</Th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td
                            colSpan={ctcMode === "per" ? 3 : 2}
                            className="px-4 py-12 text-center text-sm text-slate-500"
                          >
                            No employees
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((emp) => {
                          const id = getEmployeeId(emp);
                          const checked = assignEmployeeIds.includes(id);
                          return (
                            <tr key={id} className="hover:bg-slate-50/70">
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    setAssignEmployeeIds((prev) =>
                                      e.target.checked
                                        ? [...prev, id]
                                        : prev.filter((x) => x !== id)
                                    );
                                  }}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <div className="font-medium text-slate-800">
                                  {getEmployeeName(emp)}
                                </div>
                                <div className="text-xs text-slate-400">{id}</div>
                              </td>
                              {ctcMode === "per" && (
                                <td className="px-3 py-2 text-right">
                                  <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    disabled={!checked}
                                    value={perEmployeeCtc[id] || ""}
                                    onChange={(e) =>
                                      setPerEmployeeCtc((prev) => ({
                                        ...prev,
                                        [id]: e.target.value,
                                      }))
                                    }
                                    className="w-32 rounded-lg border border-slate-200 px-2 py-1.5 text-sm disabled:bg-slate-100"
                                  />
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {assignError && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {assignError}
                </div>
              )}

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="submit"
                  disabled={assignLoading || !!assignError}
                  className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {assignLoading
                    ? "Assigning…"
                    : `Assign to ${assignEmployeeIds.length || 0} employee(s)`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== VIEW ==================== */}
        {activeTab === "view" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">Select Employee</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={viewEmployeeId}
                  onChange={(e) => setViewEmployeeId(e.target.value)}
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => {
                    const id = getEmployeeId(emp);
                    return id ? (
                      <option key={id} value={id}>
                        {getEmployeeName(emp)} ({id})
                      </option>
                    ) : null;
                  })}
                </select>
                <button
                  type="button"
                  onClick={handleView}
                  disabled={!viewEmployeeId || viewLoading}
                  className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
                >
                  {viewLoading ? "Loading…" : "View"}
                </button>
              </div>
            </div>

            {viewData?.structure ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Active Structure
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {viewData.structure.structure_name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Stat label="Annual CTC" value={viewData.structure.annual_ctc} dark />
                      <Stat label="Monthly CTC" value={viewData.structure.monthly_ctc} />
                      {viewData.gross && <Stat label="Gross" value={viewData.gross} />}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <Th>Component</Th>
                        <Th>Type</Th>
                        <Th align="right">Monthly</Th>
                        <Th align="right">Annual</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {viewData.components.map((c, i) => (
                        <tr key={i}>
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-slate-800">{c.component_name}</div>
                            <div className="text-xs text-slate-400">{c.component_code}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {COMPONENT_TYPES[c.component_type] || c.component_type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
                            ₹ {inr(c.monthly_amount)}
                          </td>
                          <td className="px-5 py-3.5 text-right text-slate-600">
                            ₹ {inr(c.annual_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : viewData ? (
              <EmptyState
                title="No active assignment"
                hint="Assign a structure from the Assign tab."
              />
            ) : (
              <EmptyState
                title="No structure loaded"
                hint="Select an employee and click View."
              />
            )}
          </div>
        )}

        {/* ==================== REGISTER ==================== */}
        {activeTab === "register" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard label="Employees" value={registerTotals.employees} />
              <SummaryCard label="Total Monthly CTC" value={registerTotals.monthlyCtc} prefix="₹" />
              <SummaryCard
                label="Total Monthly Gross"
                value={registerTotals.monthlyGross}
                prefix="₹"
                accent="emerald"
              />
              <SummaryCard
                label="Total Annual CTC"
                value={registerTotals.annualCtc}
                prefix="₹"
                accent="slate"
              />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={registerSearch}
                  onChange={(e) => setRegisterSearch(e.target.value)}
                  placeholder="Search employees"
                  className="w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                />
                <select
                  value={registerDeptFilter}
                  onChange={(e) => setRegisterDeptFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                >
                  <option value="">All departments</option>
                  {registerDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={loadRegister}
                disabled={registerLoading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {registerLoading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {registerLoading && !registerData ? (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
                Loading…
              </div>
            ) : !registerData || registerData.length === 0 ? (
              <EmptyState title="No salary data" hint="Assign structures to employees first." />
            ) : filteredRegister.length === 0 ? (
              <EmptyState title="No employees match your filters" hint="Clear the search." />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <Th align="center"> </Th>
                        <Th>Employee</Th>
                        <Th>Department</Th>
                        <Th>Designation</Th>
                        <Th align="right">Monthly CTC</Th>
                        <Th align="right">Monthly Gross</Th>
                        <Th align="right">Deductions</Th>
                        <Th align="right">Monthly Net</Th>
                        <Th align="right">Annual CTC</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredRegister.map((row) => {
                        const expanded = !!expandedRows[row.employee_id];
                        return (
                          <Fragment key={row.employee_id}>
                            <tr
                              className={`cursor-pointer hover:bg-slate-50/70 ${
                                expanded ? "bg-slate-50/50" : ""
                              }`}
                              onClick={() => toggleRow(row.employee_id)}
                            >
                              <td className="px-3 py-3 text-center text-slate-400">
                                <span
                                  className={`inline-block transition-transform ${
                                    expanded ? "rotate-90" : ""
                                  }`}
                                >
                                  ▶
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="font-medium text-slate-800">
                                  {row.employee_name}
                                </div>
                                <div className="text-xs text-slate-400">{row.employee_id}</div>
                              </td>
                              <td className="px-5 py-3 text-slate-600">{row.department_name}</td>
                              <td className="px-5 py-3 text-slate-600">{row.designation_name}</td>
                              <td className="px-5 py-3 text-right font-semibold">
                                ₹ {inr(row.monthly_ctc)}
                              </td>
                              <td className="px-5 py-3 text-right font-semibold text-emerald-700">
                                ₹ {inr(row.monthly_gross)}
                              </td>
                              <td className="px-5 py-3 text-right font-semibold text-red-600">
                                ₹ {inr(row.monthly_deductions)}
                              </td>
                              <td className="px-5 py-3 text-right font-semibold">
                                ₹ {inr(row.monthly_net)}
                              </td>
                              <td className="px-5 py-3 text-right text-slate-700">
                                ₹ {inr(row.annual_ctc)}
                              </td>
                            </tr>
                            {expanded && (
                              <tr className="bg-slate-50/40">
                                <td colSpan={9} className="px-6 py-4">
                                  {!row.has_structure ? (
                                    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
                                      No active assignment.
                                    </div>
                                  ) : (
                                    <Breakdown row={row} />
                                  )}
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SUB ================= */

function Breakdown({ row }) {
  const earnings = row.components.filter(
    (c) => c.component_type === "earning" || c.component_type === "reimbursement"
  );
  const deductions = row.components.filter((c) => c.component_type === "deduction");
  const employer = row.components.filter((c) => c.component_type === "employer_contribution");
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <BreakdownTable title="Earnings" rows={earnings} tone="emerald" />
      <BreakdownTable title="Deductions" rows={deductions} tone="red" />
      <BreakdownTable title="Employer Contributions" rows={employer} tone="slate" />
    </div>
  );
}

function BreakdownTable({ title, rows, tone }) {
  const toneCls = {
    emerald: "text-emerald-700",
    red: "text-red-600",
    slate: "text-slate-600",
  }[tone];
  const total = rows.reduce((s, r) => s + Number(r.monthly_amount || 0), 0);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/70 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      </div>
      {rows.length === 0 ? (
        <div className="px-3 py-6 text-center text-xs text-slate-400">None</div>
      ) : (
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400">
              <th className="px-3 py-1.5 text-left font-medium">Component</th>
              <th className="px-3 py-1.5 text-right font-medium">Monthly</th>
              <th className="px-3 py-1.5 text-right font-medium">Annual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((c, i) => (
              <tr key={i}>
                <td className="px-3 py-1.5">
                  <div className="font-medium text-slate-700">{c.component_name}</div>
                  <div className="text-[10px] text-slate-400">{c.component_code}</div>
                </td>
                <td className={`px-3 py-1.5 text-right font-semibold ${toneCls}`}>
                  ₹ {inr(c.monthly_amount)}
                </td>
                <td className="px-3 py-1.5 text-right text-slate-600">
                  ₹ {inr(c.annual_amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-100 bg-slate-50/70">
              <td className="px-3 py-1.5 text-xs font-semibold">Total</td>
              <td className={`px-3 py-1.5 text-right text-xs font-semibold ${toneCls}`}>
                ₹ {inr(total)}
              </td>
              <td className="px-3 py-1.5 text-right text-xs font-semibold">
                ₹ {inr(total * 12)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

/* ================= TINY UI ================= */

function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-medium text-slate-600">{children}</label>;
}
function Th({ children, align = "left" }) {
  return (
    <th
      className={`px-3 py-2.5 text-${align} text-xs font-semibold uppercase tracking-wide text-slate-500`}
    >
      {children}
    </th>
  );
}
function Stat({ label, value, dark }) {
  return (
    <div
      className={`rounded-xl px-3 py-2 ${
        dark ? "bg-slate-900 text-white" : "bg-emerald-50 text-emerald-800"
      }`}
    >
      <p
        className={`text-[10px] uppercase tracking-wide ${
          dark ? "text-slate-300" : "text-emerald-600"
        }`}
      >
        {label}
      </p>
      <p className="text-sm font-semibold">₹ {inr(value)}</p>
    </div>
  );
}
function EmptyState({ title, hint }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  );
}
function SummaryCard({ label, value, prefix = "", accent = "red" }) {
  const tone =
    {
      red: "bg-white border-slate-200",
      emerald: "bg-emerald-50 border-emerald-100",
      slate: "bg-slate-900 text-white border-slate-900",
    }[accent] || "bg-white border-slate-200";
  const labelTone = accent === "slate" ? "text-slate-300" : "text-slate-500";
  const valueTone =
    accent === "emerald"
      ? "text-emerald-700"
      : accent === "slate"
      ? "text-white"
      : "text-slate-900";
  const num = Number(value || 0);
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${tone}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${labelTone}`}>{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueTone}`}>
        {prefix ? `${prefix} ${inr(num)}` : num}
      </p>
    </div>
  );
}