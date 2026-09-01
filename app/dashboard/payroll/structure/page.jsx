// // "use client";

// // import { useEffect, useState } from "react";
// // import { api } from "@/lib/api";

// // // ---------------------------------------------
// // // Matches backend:
// // //   POST /api/v1/payroll/structures
// // //   GET  /api/v1/payroll/structures/{employee_id}
// // // Body matches schemas.SalaryStructureCreate + StructureComponentItem exactly.
// // // ---------------------------------------------

// // const CALCULATION_TYPES = [
// //   { value: "flat", label: "Flat" },
// //   { value: "percentage", label: "Percentage" },
// //   { value: "slab", label: "Slab" },
// //   { value: "formula", label: "Formula" },
// //   { value: "attendance_based", label: "Attendance Based" },
// // ];

// // const EMPTY_ROW = { component_id: "", calculation_value: "", calculation_type: "flat", is_variable: false, max_limit: "" };

// // function getErrorMessage(err) {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // }

// // function getEmployees(response) {
// //   const data = response?.data?.data ?? response?.data ?? [];
// //   if (Array.isArray(data)) return data;
// //   return data?.employees ?? data?.items ?? data?.results ?? [];
// // }

// // function getEmployeeId(employee) {
// //   return employee.employee_id || employee.id || employee._id;
// // }

// // function getEmployeeName(employee) {
// //   const fullName = [employee.first_name, employee.last_name].filter(Boolean).join(" ");
// //   return fullName || employee.name || employee.full_name || getEmployeeId(employee);
// // }

// // export default function SalaryStructurePage() {
// //   const [employeeId, setEmployeeId] = useState("");
// //   const [employees, setEmployees] = useState([]);

// //   const [structureName, setStructureName] = useState("");
// //   const [structureDescription, setStructureDescription] = useState("");
// //   const [isTemplate, setIsTemplate] = useState(false);
// //   const [annualCtc, setAnnualCtc] = useState("");
// //   const [monthlyCtc, setMonthlyCtc] = useState("");
// //   const [effectiveFrom, setEffectiveFrom] = useState("");
// //   const [effectiveTo, setEffectiveTo] = useState("");
// //   const [revisionReason, setRevisionReason] = useState("");
// //   const [components, setComponents] = useState([{ ...EMPTY_ROW }]);

// //   const [viewData, setViewData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [viewLoading, setViewLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   useEffect(() => {
// //     api
// //       .get("/api/v1/get/employees")
// //       .then((response) => setEmployees(getEmployees(response)))
// //       .catch((err) => setError(getErrorMessage(err)));
// //   }, []);

// //   function addRow() {
// //     setComponents([...components, { ...EMPTY_ROW }]);
// //   }

// //   function updateRow(index, field, value) {
// //     const updated = [...components];
// //     updated[index][field] = value;
// //     setComponents(updated);
// //   }

// //   function removeRow(index) {
// //     setComponents(components.filter((_, i) => i !== index));
// //   }

// //   function resetForm() {
// //     setStructureName("");
// //     setStructureDescription("");
// //     setIsTemplate(false);
// //     setAnnualCtc("");
// //     setMonthlyCtc("");
// //     setEffectiveFrom("");
// //     setEffectiveTo("");
// //     setRevisionReason("");
// //     setComponents([{ ...EMPTY_ROW }]);
// //   }

// //   async function handleCreate(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.post("/api/v1/payroll/structures", {
// //         structure_name: structureName,
// //         structure_description: structureDescription || null,
// //         employee_id: isTemplate ? null : employeeId || null,
// //         is_template: isTemplate,
// //         annual_ctc: Number(annualCtc),
// //         monthly_ctc: monthlyCtc ? Number(monthlyCtc) : null,
// //         effective_from: effectiveFrom,
// //         effective_to: effectiveTo || null,
// //         revision_reason: revisionReason || null,
// //         components: components
// //           .filter((c) => c.component_id)
// //           .map((c) => ({
// //             component_id: c.component_id,
// //             calculation_value: Number(c.calculation_value) || 0,
// //             calculation_type: c.calculation_type,
// //             is_variable: c.is_variable,
// //             max_limit: c.max_limit ? Number(c.max_limit) : null,
// //           })),
// //       });
// //       setSuccess("Salary structure created successfully");
// //       resetForm();
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function handleView() {
// //     if (!employeeId) return;
// //     setViewLoading(true);
// //     setError("");
// //     setViewData(null);
// //     try {
// //       const res = await api.get(`/api/v1/payroll/structures/${employeeId}`);
// //       setViewData(res?.data ?? res);
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setViewLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#f5f6f8] p-6">
// //       <div className="mb-6">
// //         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Salary Structure</h1>
// //         <p className="mt-1 text-sm text-[#6b7280]">Create or view employee salary structure</p>
// //       </div>

// //       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
// //       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

// //       <div className="mb-6 flex flex-wrap gap-3">
// //         <select
// //           value={employeeId}
// //           onChange={(e) => setEmployeeId(e.target.value)}
// //           className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
// //         >
// //           <option value="">Select employee</option>
// //           {employees.map((employee) => {
// //             const id = getEmployeeId(employee);
// //             return id ? (
// //               <option key={id} value={id}>
// //                 {getEmployeeName(employee)} ({id})
// //               </option>
// //             ) : null;
// //           })}
// //         </select>
// //         <button
// //           onClick={handleView}
// //           disabled={!employeeId || viewLoading}
// //           className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb] disabled:opacity-60"
// //         >
// //           {viewLoading ? "Loading..." : "View Structure"}
// //         </button>
// //       </div>

// //       {viewData && (
// //         <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
// //           <h3 className="font-semibold text-[#1a1a1a]">{viewData?.structure?.structure_name || viewData?.structure_name || "Structure"}</h3>
// //           <p className="mt-1 text-sm text-[#6b7280]">
// //             CTC: ₹ {viewData?.structure?.annual_ctc ?? viewData?.annual_ctc ?? "—"}
// //           </p>
// //           <div className="mt-3 overflow-x-auto">
// //             <table className="w-full text-sm">
// //               <thead>
// //                 <tr className="border-b bg-[#f9fafb]">
// //                   <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Component ID</th>
// //                   <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Calc. Type</th>
// //                   <th className="px-3 py-2 text-right font-medium text-[#6b7280]">Value</th>
// //                   <th className="px-3 py-2 text-center font-medium text-[#6b7280]">Variable</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {(viewData?.components || []).map((c, i) => (
// //                   <tr key={i} className="border-b">
// //                     <td className="px-3 py-2">{c.component_id}</td>
// //                     <td className="px-3 py-2 capitalize">{(c.calculation_type || "").replace(/_/g, " ")}</td>
// //                     <td className="px-3 py-2 text-right">₹ {Number(c.calculation_value ?? 0).toFixed(2)}</td>
// //                     <td className="px-3 py-2 text-center">{c.is_variable ? "Yes" : "No"}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
// //         <h2 className="mb-4 text-lg font-semibold">Create New Structure</h2>
// //         <form onSubmit={handleCreate} className="space-y-4">
// //           <div className="grid gap-4 sm:grid-cols-3">
// //             <div>
// //               <label className="mb-1 flex items-center gap-2 text-sm font-medium">
// //                 <input type="checkbox" checked={isTemplate} onChange={(e) => setIsTemplate(e.target.checked)} />
// //                 Save as Template
// //               </label>
// //               {!isTemplate && (
// //                 <select
// //                   required={!isTemplate}
// //                   value={employeeId}
// //                   onChange={(e) => setEmployeeId(e.target.value)}
// //                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //                 >
// //                   <option value="">Select employee</option>
// //                   {employees.map((employee) => {
// //                     const id = getEmployeeId(employee);
// //                     return id ? (
// //                       <option key={id} value={id}>
// //                         {getEmployeeName(employee)} ({id})
// //                       </option>
// //                     ) : null;
// //                   })}
// //                 </select>
// //               )}
// //             </div>
// //             <div>
// //               <label className="mb-1 block text-sm font-medium">Structure Name *</label>
// //               <input
// //                 required
// //                 value={structureName}
// //                 onChange={(e) => setStructureName(e.target.value)}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="mb-1 block text-sm font-medium">Description</label>
// //               <input
// //                 value={structureDescription}
// //                 onChange={(e) => setStructureDescription(e.target.value)}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="mb-1 block text-sm font-medium">Annual CTC *</label>
// //               <input
// //                 required
// //                 type="number"
// //                 value={annualCtc}
// //                 onChange={(e) => setAnnualCtc(e.target.value)}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="mb-1 block text-sm font-medium">Monthly CTC</label>
// //               <input
// //                 type="number"
// //                 value={monthlyCtc}
// //                 onChange={(e) => setMonthlyCtc(e.target.value)}
// //                 placeholder="Auto if left blank"
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="mb-1 block text-sm font-medium">Effective From *</label>
// //               <input
// //                 required
// //                 type="date"
// //                 value={effectiveFrom}
// //                 onChange={(e) => setEffectiveFrom(e.target.value)}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="mb-1 block text-sm font-medium">Effective To</label>
// //               <input
// //                 type="date"
// //                 value={effectiveTo}
// //                 onChange={(e) => setEffectiveTo(e.target.value)}
// //                 placeholder="Leave blank if ongoing"
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //               />
// //             </div>
// //             <div className="sm:col-span-2">
// //               <label className="mb-1 block text-sm font-medium">Revision Reason</label>
// //               <input
// //                 value={revisionReason}
// //                 onChange={(e) => setRevisionReason(e.target.value)}
// //                 placeholder="e.g. Annual appraisal 2026"
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //               />
// //             </div>
// //           </div>

// //           <div>
// //             <div className="mb-2 flex items-center justify-between">
// //               <label className="text-sm font-medium">Components</label>
// //               <button type="button" onClick={addRow} className="text-sm text-[#E42527] hover:underline">
// //                 + Add Row
// //               </button>
// //             </div>
// //             {components.map((row, index) => (
// //               <div key={index} className="mb-2 flex flex-wrap items-center gap-2">
// //                 <input
// //                   placeholder="Component ID"
// //                   value={row.component_id}
// //                   onChange={(e) => updateRow(index, "component_id", e.target.value)}
// //                   className="min-w-[140px] flex-1 rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
// //                 />
// //                 <select
// //                   value={row.calculation_type}
// //                   onChange={(e) => updateRow(index, "calculation_type", e.target.value)}
// //                   className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
// //                 >
// //                   {CALCULATION_TYPES.map((t) => (
// //                     <option key={t.value} value={t.value}>{t.label}</option>
// //                   ))}
// //                 </select>
// //                 <input
// //                   type="number"
// //                   placeholder="Value"
// //                   value={row.calculation_value}
// //                   onChange={(e) => updateRow(index, "calculation_value", e.target.value)}
// //                   className="w-28 rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
// //                 />
// //                 <input
// //                   type="number"
// //                   placeholder="Max limit"
// //                   value={row.max_limit}
// //                   onChange={(e) => updateRow(index, "max_limit", e.target.value)}
// //                   className="w-28 rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
// //                 />
// //                 <label className="flex items-center gap-1 text-sm">
// //                   <input
// //                     type="checkbox"
// //                     checked={row.is_variable}
// //                     onChange={(e) => updateRow(index, "is_variable", e.target.checked)}
// //                   />
// //                   Variable
// //                 </label>
// //                 {components.length > 1 && (
// //                   <button type="button" onClick={() => removeRow(index)} className="text-sm text-red-500">
// //                     Remove
// //                   </button>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// //           >
// //             {loading ? "Saving..." : "Create Structure"}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { api } from "@/lib/api";

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

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
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

// export default function SalaryStructurePage() {
//   const [employeeId, setEmployeeId] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [componentMaster, setComponentMaster] = useState([]);

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

//   useEffect(() => {
//     api
//       .get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } })
//       .then((res) => setEmployees(getEmployees(res)))
//       .catch((err) => setError(getErrorMessage(err)));

//     api
//       .get("/api/v1/payroll/components", { params: { is_active: true } })
//       .then((res) => setComponentMaster(getComponentsList(res)))
//       .catch(() => setComponentMaster([]));
//   }, []);

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
//   }

//   // ---------- Template Download ----------
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

//   // ---------- Bulk Upload ----------
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
//         `Upload done. Created: ${data.created_count ?? 0}, Errors: ${data.error_count ?? 0}`
//       );
//       setSelectedFile(null);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setUploadLoading(false);
//     }
//   }

//   async function handleCreate(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const selectedComponents = components.filter((c) => c.component_id);
//       if (!selectedComponents.length) {
//         setError("At least one component is required");
//         setLoading(false);
//         return;
//       }
//       if (!isTemplate && !employeeId) {
//         setError("Please select an employee");
//         setLoading(false);
//         return;
//       }

//       await api.post("/api/v1/payroll/structures", {
//         structure_name: structureName,
//         structure_description: structureDescription || null,
//         employee_id: isTemplate ? null : employeeId || null,
//         is_template: isTemplate,
//         annual_ctc: Number(annualCtc),
//         monthly_ctc: monthlyCtc ? Number(monthlyCtc) : null,
//         effective_from: effectiveFrom,
//         effective_to: effectiveTo || null,
//         revision_reason: revisionReason || null,
//         components: selectedComponents.map((c) => ({
//           component_id: c.component_id,
//           calculation_value: Number(c.calculation_value) || 0,
//           calculation_type: c.calculation_type,
//           is_variable: !!c.is_variable,
//           max_limit: c.max_limit ? Number(c.max_limit) : null,
//         })),
//       });

//       setSuccess("Salary structure created successfully");
//       resetForm();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleView() {
//     if (!employeeId) return;
//     setViewLoading(true);
//     setError("");
//     setViewData(null);
//     try {
//       const res = await api.get(`/api/v1/payroll/structures/${employeeId}`);
//       setViewData(res?.data ?? res);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setViewLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Salary Structure</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">
//           Create single structure, bulk upload CSV, or view employee structure
//         </p>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
//           {success}
//         </div>
//       )}

//       {/* ================= BULK UPLOAD CARD ================= */}
//       <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
//         <h2 className="text-lg font-semibold text-[#1a1a1a]">Bulk Upload (CSV)</h2>
//         <p className="mt-1 text-sm text-[#6b7280]">
//           100–1000 employees ke liye template download karke CSV upload karo
//         </p>

//         <div className="mt-4 flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             onClick={handleDownloadTemplate}
//             className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb]"
//           >
//             Download Template
//           </button>

//           <input
//             type="file"
//             accept=".csv"
//             onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//             className="text-sm"
//           />

//           <button
//             type="button"
//             onClick={handleUpload}
//             disabled={uploadLoading || !selectedFile}
//             className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//           >
//             {uploadLoading ? "Uploading..." : "Upload CSV"}
//           </button>
//         </div>

//         {selectedFile && (
//           <p className="mt-2 text-sm text-slate-600">
//             Selected: <span className="font-medium">{selectedFile.name}</span>
//           </p>
//         )}

//         {uploadResult && (
//           <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm">
//             <p>
//               Created: <b>{uploadResult.created_count ?? 0}</b> · Errors:{" "}
//               <b>{uploadResult.error_count ?? 0}</b>
//             </p>

//             {Array.isArray(uploadResult.errors) && uploadResult.errors.length > 0 && (
//               <div className="mt-2 max-h-40 overflow-auto">
//                 {uploadResult.errors.map((e, i) => (
//                   <div key={i} className="text-red-600">
//                     Row {e.row}: {e.employee_id || "-"} → {e.error}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ================= VIEW ================= */}
//       <div className="mb-6 flex flex-wrap gap-3">
//         <select
//           value={employeeId}
//           onChange={(e) => setEmployeeId(e.target.value)}
//           className="min-w-[280px] rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//         >
//           <option value="">Select employee</option>
//           {employees.map((emp) => {
//             const id = getEmployeeId(emp);
//             return id ? (
//               <option key={id} value={id}>
//                 {getEmployeeName(emp)} ({id})
//               </option>
//             ) : null;
//           })}
//         </select>

//         <button
//           onClick={handleView}
//           disabled={!employeeId || viewLoading}
//           className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb] disabled:opacity-60"
//         >
//           {viewLoading ? "Loading..." : "View Structure"}
//         </button>
//       </div>

//       {viewData && (
//         <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
//           <h3 className="font-semibold">
//             {viewData?.structure?.structure_name || "Structure"}
//           </h3>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Annual CTC: ₹ {viewData?.structure?.annual_ctc ?? "—"} · Monthly CTC: ₹{" "}
//             {viewData?.structure?.monthly_ctc ?? "—"}
//           </p>

//           <div className="mt-3 overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b bg-[#f9fafb]">
//                   <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Component</th>
//                   <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Calc. Type</th>
//                   <th className="px-3 py-2 text-right font-medium text-[#6b7280]">Value</th>
//                   <th className="px-3 py-2 text-center font-medium text-[#6b7280]">Variable</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(viewData?.components || []).map((c, i) => (
//                   <tr key={i} className="border-b">
//                     <td className="px-3 py-2">
//                       <div className="font-medium">{getComponentLabelById(c.component_id)}</div>
//                       <div className="text-xs text-slate-400">{c.component_id}</div>
//                     </td>
//                     <td className="px-3 py-2 capitalize">
//                       {(c.calculation_type || "").replace(/_/g, " ")}
//                     </td>
//                     <td className="px-3 py-2 text-right">
//                       {Number(c.calculation_value ?? 0).toFixed(2)}
//                     </td>
//                     <td className="px-3 py-2 text-center">{c.is_variable ? "Yes" : "No"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ================= SINGLE CREATE ================= */}
//       <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold">Create Single Structure</h2>

//         <form onSubmit={handleCreate} className="space-y-4">
//           <div className="grid gap-4 sm:grid-cols-3">
//             <div>
//               <label className="mb-1 flex items-center gap-2 text-sm font-medium">
//                 <input
//                   type="checkbox"
//                   checked={isTemplate}
//                   onChange={(e) => setIsTemplate(e.target.checked)}
//                 />
//                 Save as Template
//               </label>

//               {!isTemplate && (
//                 <select
//                   required={!isTemplate}
//                   value={employeeId}
//                   onChange={(e) => setEmployeeId(e.target.value)}
//                   className="mt-2 w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
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
//               )}
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium">Structure Name *</label>
//               <input
//                 required
//                 value={structureName}
//                 onChange={(e) => setStructureName(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium">Description</label>
//               <input
//                 value={structureDescription}
//                 onChange={(e) => setStructureDescription(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium">Annual CTC *</label>
//               <input
//                 required
//                 type="number"
//                 value={annualCtc}
//                 onChange={(e) => setAnnualCtc(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium">Monthly CTC</label>
//               <input
//                 type="number"
//                 value={monthlyCtc}
//                 onChange={(e) => setMonthlyCtc(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium">Effective From *</label>
//               <input
//                 required
//                 type="date"
//                 value={effectiveFrom}
//                 onChange={(e) => setEffectiveFrom(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium">Effective To</label>
//               <input
//                 type="date"
//                 value={effectiveTo}
//                 onChange={(e) => setEffectiveTo(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="mb-1 block text-sm font-medium">Revision Reason</label>
//               <input
//                 value={revisionReason}
//                 onChange={(e) => setRevisionReason(e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <div className="mb-2 flex items-center justify-between">
//               <label className="text-sm font-medium">
//                 Salary Components ({componentMaster.length})
//               </label>
//               <button
//                 type="button"
//                 onClick={addRow}
//                 className="text-sm font-medium text-[#E42527] hover:underline"
//               >
//                 + Add Component
//               </button>
//             </div>

//             <div className="overflow-x-auto rounded-lg border border-[#e5e7eb]">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="border-b bg-[#f9fafb]">
//                     <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Component</th>
//                     <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Calc Type</th>
//                     <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Value</th>
//                     <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Max Limit</th>
//                     <th className="px-3 py-2 text-center font-medium text-[#6b7280]">Variable</th>
//                     <th className="px-3 py-2 text-right font-medium text-[#6b7280]">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {components.map((row, index) => (
//                     <tr key={index} className="border-b">
//                       <td className="px-3 py-2">
//                         <select
//                           required
//                           value={row.component_id}
//                           onChange={(e) => updateRow(index, "component_id", e.target.value)}
//                           className="w-full min-w-[220px] rounded-md border border-[#d1d5db] px-2 py-2 text-sm"
//                         >
//                           <option value="">Select component</option>
//                           {componentMaster.map((c) => {
//                             const id = getComponentId(c);
//                             return id ? (
//                               <option key={id} value={id}>
//                                 {getComponentName(c)}
//                               </option>
//                             ) : null;
//                           })}
//                         </select>
//                       </td>
//                       <td className="px-3 py-2">
//                         <select
//                           value={row.calculation_type}
//                           onChange={(e) => updateRow(index, "calculation_type", e.target.value)}
//                           className="rounded-md border border-[#d1d5db] px-2 py-2 text-sm"
//                         >
//                           {CALCULATION_TYPES.map((t) => (
//                             <option key={t.value} value={t.value}>
//                               {t.label}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="px-3 py-2">
//                         <input
//                           type="number"
//                           required
//                           value={row.calculation_value}
//                           onChange={(e) => updateRow(index, "calculation_value", e.target.value)}
//                           className="w-28 rounded-md border border-[#d1d5db] px-2 py-2 text-sm"
//                         />
//                       </td>
//                       <td className="px-3 py-2">
//                         <input
//                           type="number"
//                           value={row.max_limit}
//                           onChange={(e) => updateRow(index, "max_limit", e.target.value)}
//                           className="w-28 rounded-md border border-[#d1d5db] px-2 py-2 text-sm"
//                         />
//                       </td>
//                       <td className="px-3 py-2 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!row.is_variable}
//                           onChange={(e) => updateRow(index, "is_variable", e.target.checked)}
//                         />
//                       </td>
//                       <td className="px-3 py-2 text-right">
//                         {components.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeRow(index)}
//                             className="text-sm text-red-500"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Create Structure"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

const CALCULATION_TYPES = [
  { value: "flat", label: "Flat" },
  { value: "percentage", label: "Percentage" },
  { value: "slab", label: "Slab" },
  { value: "formula", label: "Formula" },
  { value: "attendance_based", label: "Attendance Based" },
];

const EMPTY_ROW = {
  component_id: "",
  calculation_value: "",
  calculation_type: "flat",
  is_variable: false,
  max_limit: "",
};

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function getEmployees(response) {
  const body = response?.data ?? {};
  const data = body?.data ?? body;
  if (Array.isArray(data)) return data;
  return data?.employees ?? data?.items ?? data?.results ?? [];
}

function getEmployeeId(emp) {
  return emp?.employee_id || emp?.id || emp?._id || "";
}

function getEmployeeName(emp) {
  const fullName = [emp?.first_name, emp?.last_name].filter(Boolean).join(" ");
  return fullName || emp?.name || emp?.full_name || getEmployeeId(emp) || "Employee";
}

function getComponentsList(response) {
  const body = response?.data ?? {};
  const list = body?.data ?? body?.components ?? body?.items ?? [];
  return Array.isArray(list) ? list : [];
}

function getComponentId(c) {
  return c?.component_id || c?.id || c?._id || "";
}

function getComponentName(c) {
  return c?.component_name || c?.name || c?.component_code || getComponentId(c) || "Component";
}

export default function SalaryStructurePage() {
  const [activeTab, setActiveTab] = useState("view"); // view | create | bulk

  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [componentMaster, setComponentMaster] = useState([]);

  const [structureName, setStructureName] = useState("");
  const [structureDescription, setStructureDescription] = useState("");
  const [isTemplate, setIsTemplate] = useState(false);
  const [annualCtc, setAnnualCtc] = useState("");
  const [monthlyCtc, setMonthlyCtc] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [components, setComponents] = useState([{ ...EMPTY_ROW }]);

  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    api
      .get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } })
      .then((res) => setEmployees(getEmployees(res)))
      .catch((err) => setError(getErrorMessage(err)));

    api
      .get("/api/v1/payroll/components", { params: { is_active: true } })
      .then((res) => setComponentMaster(getComponentsList(res)))
      .catch(() => setComponentMaster([]));
  }, []);

  const componentMap = useMemo(() => {
    const map = {};
    componentMaster.forEach((c) => {
      const id = String(getComponentId(c));
      if (id) map[id] = c;
    });
    return map;
  }, [componentMaster]);

  function getComponentLabelById(id) {
    const c = componentMap[String(id || "")];
    return c ? getComponentName(c) : id || "—";
  }

  function addRow() {
    setComponents((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function updateRow(index, field, value) {
    setComponents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function removeRow(index) {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setStructureName("");
    setStructureDescription("");
    setIsTemplate(false);
    setAnnualCtc("");
    setMonthlyCtc("");
    setEffectiveFrom("");
    setEffectiveTo("");
    setRevisionReason("");
    setComponents([{ ...EMPTY_ROW }]);
  }

  async function handleDownloadTemplate() {
    setError("");
    try {
      const res = await api.get("/api/v1/payroll/structures/template/download", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "salary_structure_template.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a CSV file first");
      return;
    }
    setUploadLoading(true);
    setError("");
    setSuccess("");
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await api.post("/api/v1/payroll/structures/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res?.data ?? {};
      setUploadResult(data);
      setSuccess(
        `Upload completed · Created ${data.created_count ?? 0} · Errors ${data.error_count ?? 0}`
      );
      setSelectedFile(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const selectedComponents = components.filter((c) => c.component_id);
      if (!selectedComponents.length) {
        setError("At least one component is required");
        setLoading(false);
        return;
      }
      if (!isTemplate && !employeeId) {
        setError("Please select an employee");
        setLoading(false);
        return;
      }

      await api.post("/api/v1/payroll/structures", {
        structure_name: structureName,
        structure_description: structureDescription || null,
        employee_id: isTemplate ? null : employeeId || null,
        is_template: isTemplate,
        annual_ctc: Number(annualCtc),
        monthly_ctc: monthlyCtc ? Number(monthlyCtc) : null,
        effective_from: effectiveFrom,
        effective_to: effectiveTo || null,
        revision_reason: revisionReason || null,
        components: selectedComponents.map((c) => ({
          component_id: c.component_id,
          calculation_value: Number(c.calculation_value) || 0,
          calculation_type: c.calculation_type,
          is_variable: !!c.is_variable,
          max_limit: c.max_limit ? Number(c.max_limit) : null,
        })),
      });

      setSuccess("Salary structure created successfully");
      resetForm();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleView() {
    if (!employeeId) return;
    setViewLoading(true);
    setError("");
    setViewData(null);
    try {
      const res = await api.get(`/api/v1/payroll/structures/${employeeId}`);
      setViewData(res?.data ?? res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setViewLoading(false);
    }
  }

  const tabs = [
    { id: "view", label: "View Structure" },
    { id: "create", label: "Create Single" },
    { id: "bulk", label: "Bulk Upload" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
                Payroll
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Salary Structure
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage employee salary structures, templates and bulk assignments
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setError("");
                  setSuccess("");
                }}
                className={`relative px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "text-[#E42527]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* ================= VIEW TAB ================= */}
        {activeTab === "view" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">Select Employee</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose an employee to view their active salary structure
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:bg-white"
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
                  onClick={handleView}
                  disabled={!employeeId || viewLoading}
                  className="inline-flex items-center justify-center rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:opacity-50"
                >
                  {viewLoading ? "Loading..." : "View Structure"}
                </button>
              </div>
            </div>

            {viewData ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Active Structure
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {viewData?.structure?.structure_name || "Structure"}
                      </h3>
                      {viewData?.structure?.structure_description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {viewData.structure.structure_description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">
                        <p className="text-[10px] uppercase tracking-wide text-slate-300">
                          Annual CTC
                        </p>
                        <p className="text-sm font-semibold">
                          ₹ {Number(viewData?.structure?.annual_ctc ?? 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">
                        <p className="text-[10px] uppercase tracking-wide text-emerald-600">
                          Monthly CTC
                        </p>
                        <p className="text-sm font-semibold">
                          ₹ {Number(viewData?.structure?.monthly_ctc ?? 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Component
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Type
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Value
                        </th>
                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Variable
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(viewData?.components || []).map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/70">
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-slate-800">
                              {getComponentLabelById(c.component_id)}
                            </div>
                            <div className="text-xs text-slate-400">{c.component_id}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                              {(c.calculation_type || "").replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
                            {Number(c.calculation_value ?? 0).toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                c.is_variable
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {c.is_variable ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                <p className="text-sm font-medium text-slate-700">No structure loaded</p>
                <p className="mt-1 text-sm text-slate-500">
                  Select an employee and click View Structure
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= CREATE TAB ================= */}
        {activeTab === "create" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Create Structure</h2>
              <p className="mt-1 text-sm text-slate-500">
                Create a single employee structure or save as reusable template
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isTemplate}
                      onChange={(e) => setIsTemplate(e.target.checked)}
                      className="rounded border-slate-300 text-[#E42527]"
                    />
                    Save as Template
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Template can be reused in bulk upload
                  </p>

                  {!isTemplate && (
                    <select
                      required={!isTemplate}
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
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
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Structure Name *
                  </label>
                  <input
                    required
                    value={structureName}
                    onChange={(e) => setStructureName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <input
                    value={structureDescription}
                    onChange={(e) => setStructureDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Annual CTC *
                  </label>
                  <input
                    required
                    type="number"
                    value={annualCtc}
                    onChange={(e) => setAnnualCtc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Monthly CTC
                  </label>
                  <input
                    type="number"
                    value={monthlyCtc}
                    onChange={(e) => setMonthlyCtc(e.target.value)}
                    placeholder="Auto if blank"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Effective From *
                  </label>
                  <input
                    required
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Effective To
                  </label>
                  <input
                    type="date"
                    value={effectiveTo}
                    onChange={(e) => setEffectiveTo(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Revision Reason
                  </label>
                  <input
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    placeholder="e.g. Annual appraisal 2026"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
              </div>

              {/* Components */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Salary Components
                    </h3>
                    <p className="text-xs text-slate-500">
                      {componentMaster.length} components available
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

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Component
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Type
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Value
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Max
                        </th>
                        <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Var
                        </th>
                        <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {components.map((row, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <select
                              required
                              value={row.component_id}
                              onChange={(e) =>
                                updateRow(index, "component_id", e.target.value)
                              }
                              className="w-full min-w-[200px] rounded-lg border border-slate-200 px-2 py-2 text-sm"
                            >
                              <option value="">Select component</option>
                              {componentMaster.map((c) => {
                                const id = getComponentId(c);
                                return id ? (
                                  <option key={id} value={id}>
                                    {getComponentName(c)}
                                  </option>
                                ) : null;
                              })}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={row.calculation_type}
                              onChange={(e) =>
                                updateRow(index, "calculation_type", e.target.value)
                              }
                              className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
                            >
                              {CALCULATION_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              required
                              value={row.calculation_value}
                              onChange={(e) =>
                                updateRow(index, "calculation_value", e.target.value)
                              }
                              className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={row.max_limit}
                              onChange={(e) =>
                                updateRow(index, "max_limit", e.target.value)
                              }
                              className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!row.is_variable}
                              onChange={(e) =>
                                updateRow(index, "is_variable", e.target.checked)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            {components.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRow(index)}
                                className="text-sm text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Create Structure"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= BULK TAB ================= */}
        {activeTab === "bulk" && (
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                  1
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Download Template
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  CSV template download karo, Excel mein employee data bharo, phir upload karo.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="mt-5 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Download CSV Template
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E42527] text-sm font-semibold text-white">
                  2
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Upload Filled CSV
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  100–1000 employees ke structures ek saath create ho jayenge.
                </p>

                <div className="mt-5 space-y-3">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
                  />

                  {selectedFile && (
                    <p className="text-sm text-slate-600">
                      Selected: <span className="font-medium">{selectedFile.name}</span>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadLoading || !selectedFile}
                    className="inline-flex rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
                  >
                    {uploadLoading ? "Uploading..." : "Upload & Create"}
                  </button>
                </div>
              </div>
            </div>

            {uploadResult && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-xl bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                      Created
                    </p>
                    <p className="text-xl font-semibold text-emerald-700">
                      {uploadResult.created_count ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                      Errors
                    </p>
                    <p className="text-xl font-semibold text-red-700">
                      {uploadResult.error_count ?? 0}
                    </p>
                  </div>
                </div>

                {Array.isArray(uploadResult.errors) && uploadResult.errors.length > 0 && (
                  <div className="mt-4 max-h-48 overflow-auto rounded-xl border border-red-100 bg-red-50/50 p-3">
                    {uploadResult.errors.map((e, i) => (
                      <div key={i} className="py-1 text-sm text-red-700">
                        Row {e.row}: {e.employee_id || "-"} — {e.error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
              <p className="font-medium text-slate-700">CSV tips</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Required: <code>employee_id</code>, <code>annual_ctc</code>,{" "}
                  <code>effective_from</code>
                </li>
                <li>
                  Easy mode: use <code>template_structure_id</code> to copy components
                </li>
                <li>Date format: YYYY-MM-DD</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}