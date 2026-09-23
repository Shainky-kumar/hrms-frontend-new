// // // // "use client";

// // // // import { useEffect, useState } from "react";
// // // // import { api } from "@/app/lib/api";

// // // // const APPROVAL_TYPES = [
// // // //   "leave",
// // // //   "attendance",
// // // //   "overtime",
// // // //   "expense",
// // // //   "travel",
// // // //   "loan",
// // // //   "letter",
// // // // ];

// // // // const APPROVER_TYPES = [
// // // //   { value: "reporting_manager", label: "Reporting Manager" },
// // // //   { value: "skip_level_manager", label: "Skip Level Manager" },
// // // //   { value: "department_head", label: "Department Head" },
// // // //   { value: "specific_user", label: "Specific User" },
// // // //   { value: "role", label: "Role" },
// // // // ];

// // // // const initialLevel = {
// // // //   level: 1,
// // // //   approver_type: "reporting_manager",
// // // //   specific_user_id: "",
// // // //   role_name: "",
// // // //   auto_approve: false,
// // // //   is_mandatory: true,
// // // // };

// // // // const initialForm = {
// // // //   name: "",
// // // //   approval_type: "leave",
// // // //   description: "",
// // // //   approval_mode: "sequential",
// // // //   priority: 100,
// // // //   is_active: true,
// // // //   levels: [{ ...initialLevel }],
// // // // };

// // // // const formatApiError = (err) => {
// // // //   const detail = err?.response?.data?.detail;
// // // //   if (typeof detail === "string") return detail;
// // // //   if (Array.isArray(detail)) return detail.map((d) => d.msg).join(" • ");
// // // //   return err?.message || "Something went wrong";
// // // // };

// // // // export default function ApprovalWorkflowsPage() {
// // // //   const [workflows, setWorkflows] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [error, setError] = useState("");
// // // //   const [success, setSuccess] = useState("");

// // // //   const [showForm, setShowForm] = useState(false);
// // // //   const [editingId, setEditingId] = useState(null);
// // // //   const [formData, setFormData] = useState(initialForm);
// // // //   const [viewing, setViewing] = useState(null);

// // // //   // ========== FETCH LIST ==========
// // // //   const fetchWorkflows = async () => {
// // // //     setLoading(true);
// // // //     setError("");
// // // //     try {
// // // //       const res = await api.get("/api/v1/approvals/workflows");
// // // //       const data = res?.data || [];
// // // //       setWorkflows(Array.isArray(data) ? data : []);
// // // //     } catch (err) {
// // // //       setError(formatApiError(err));
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     const timeoutId = setTimeout(() => {
// // // //       fetchWorkflows();
// // // //     }, 0);

// // // //     return () => clearTimeout(timeoutId);
// // // //   }, []);

// // // //   // ========== FORM HANDLERS ==========
// // // //   const openCreate = () => {
// // // //     setFormData({ ...initialForm, levels: [{ ...initialLevel }] });
// // // //     setEditingId(null);
// // // //     setShowForm(true);
// // // //     setError("");
// // // //     setSuccess("");
// // // //   };

// // // //   const openEdit = async (wf) => {
// // // //     try {
// // // //       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
// // // //       const data = res?.data || wf;

// // // //       setFormData({
// // // //         name: data.name || "",
// // // //         approval_type: data.approval_type || "leave",
// // // //         description: data.description || "",
// // // //         approval_mode: data.approval_mode || "sequential",
// // // //         priority: data.priority || 100,
// // // //         is_active: data.is_active ?? true,
// // // //         levels:
// // // //           data.levels?.length > 0
// // // //             ? data.levels.map((l) => ({
// // // //                 level: l.level,
// // // //                 approver_type: l.approver_type,
// // // //                 specific_user_id: l.specific_user_id || "",
// // // //                 role_name: l.role_name || "",
// // // //                 auto_approve: l.auto_approve || false,
// // // //                 is_mandatory: l.is_mandatory ?? true,
// // // //               }))
// // // //             : [{ ...initialLevel }],
// // // //       });
// // // //       setEditingId(wf.workflow_id);
// // // //       setShowForm(true);
// // // //       setError("");
// // // //     } catch (err) {
// // // //       setError(formatApiError(err));
// // // //     }
// // // //   };

// // // //   const closeForm = () => {
// // // //     setShowForm(false);
// // // //     setEditingId(null);
// // // //     setFormData(initialForm);
// // // //   };

// // // //   const handleChange = (field, value) => {
// // // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const handleLevelChange = (index, field, value) => {
// // // //     setFormData((prev) => {
// // // //       const levels = [...prev.levels];
// // // //       levels[index] = { ...levels[index], [field]: value };
// // // //       return { ...prev, levels };
// // // //     });
// // // //   };

// // // //   const addLevel = () => {
// // // //     setFormData((prev) => ({
// // // //       ...prev,
// // // //       levels: [
// // // //         ...prev.levels,
// // // //         {
// // // //           ...initialLevel,
// // // //           level: prev.levels.length + 1,
// // // //         },
// // // //       ],
// // // //     }));
// // // //   };

// // // //   const removeLevel = (index) => {
// // // //     if (formData.levels.length <= 1) return;
// // // //     setFormData((prev) => ({
// // // //       ...prev,
// // // //       levels: prev.levels
// // // //         .filter((_, i) => i !== index)
// // // //         .map((l, i) => ({ ...l, level: i + 1 })),
// // // //     }));
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setSaving(true);
// // // //     setError("");
// // // //     setSuccess("");

// // // //     try {
// // // //       const payload = {
// // // //         ...formData,
// // // //         levels: formData.levels.map((l, idx) => ({
// // // //           ...l,
// // // //           level: idx + 1,
// // // //         })),
// // // //       };

// // // //       if (editingId) {
// // // //         await api.put(`/api/v1/approvals/workflows/${editingId}`, payload);
// // // //         setSuccess("Workflow updated successfully");
// // // //       } else {
// // // //         await api.post("/api/v1/approvals/workflows", payload);
// // // //         setSuccess("Workflow created successfully");
// // // //       }

// // // //       closeForm();
// // // //       await fetchWorkflows();
// // // //     } catch (err) {
// // // //       setError(formatApiError(err));
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const openView = async (wf) => {
// // // //     try {
// // // //       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
// // // //       setViewing(res?.data || wf);
// // // //     } catch {
// // // //       setViewing(wf);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
// // // //       <div className="mx-auto max-w-6xl">
// // // //         {/* Header */}
// // // //         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// // // //           <div>
// // // //             <h1 className="text-2xl font-bold text-slate-800">Approval Workflows</h1>
// // // //             <p className="mt-1 text-sm text-slate-500">
// // // //               Create & manage multi-level approval workflows
// // // //             </p>
// // // //           </div>
// // // //           <button
// // // //             onClick={openCreate}
// // // //             className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
// // // //           >
// // // //             + Create Workflow
// // // //           </button>
// // // //         </div>

// // // //         {error && !showForm && (
// // // //           <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
// // // //         )}
// // // //         {success && !showForm && (
// // // //           <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
// // // //             {success}
// // // //           </div>
// // // //         )}

// // // //         {/* List */}
// // // //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // // //           {loading ? (
// // // //             <div className="flex justify-center py-20">
// // // //               <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
// // // //             </div>
// // // //           ) : workflows.length === 0 ? (
// // // //             <div className="py-20 text-center text-slate-500">
// // // //               No workflows found. Create your first workflow.
// // // //             </div>
// // // //           ) : (
// // // //             <table className="w-full text-left text-sm">
// // // //               <thead>
// // // //                 <tr className="border-b border-slate-100 bg-slate-50">
// // // //                   <th className="px-5 py-3.5 font-semibold text-slate-500">Name</th>
// // // //                   <th className="px-5 py-3.5 font-semibold text-slate-500">Type</th>
// // // //                   <th className="px-5 py-3.5 font-semibold text-slate-500">Mode</th>
// // // //                   <th className="px-5 py-3.5 font-semibold text-slate-500">Levels</th>
// // // //                   <th className="px-5 py-3.5 font-semibold text-slate-500">Priority</th>
// // // //                   <th className="px-5 py-3.5 font-semibold text-slate-500">Status</th>
// // // //                   <th className="px-5 py-3.5 text-right font-semibold text-slate-500">Actions</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="divide-y divide-slate-50">
// // // //                 {workflows.map((wf) => (
// // // //                   <tr key={wf.workflow_id} className="hover:bg-slate-50">
// // // //                     <td className="px-5 py-4 font-medium text-slate-800">{wf.name}</td>
// // // //                     <td className="px-5 py-4 capitalize">{wf.approval_type}</td>
// // // //                     <td className="px-5 py-4 capitalize">{wf.approval_mode}</td>
// // // //                     <td className="px-5 py-4">{wf.levels_count || 0}</td>
// // // //                     <td className="px-5 py-4">{wf.priority}</td>
// // // //                     <td className="px-5 py-4">
// // // //                       <span
// // // //                         className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
// // // //                           wf.is_active
// // // //                             ? "bg-emerald-50 text-emerald-700"
// // // //                             : "bg-slate-100 text-slate-500"
// // // //                         }`}
// // // //                       >
// // // //                         {wf.is_active ? "Active" : "Inactive"}
// // // //                       </span>
// // // //                     </td>
// // // //                     <td className="px-5 py-4 text-right">
// // // //                       <div className="flex justify-end gap-2">
// // // //                         <button
// // // //                           onClick={() => openView(wf)}
// // // //                           className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
// // // //                         >
// // // //                           View
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => openEdit(wf)}
// // // //                           className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
// // // //                         >
// // // //                           Edit
// // // //                         </button>
// // // //                       </div>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* ==================== CREATE / EDIT MODAL ==================== */}
// // // //       {showForm && (
// // // //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 backdrop-blur-sm">
// // // //           <div className="mb-12 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
// // // //             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
// // // //               <div>
// // // //                 <h2 className="text-lg font-semibold text-slate-800">
// // // //                   {editingId ? "Edit Workflow" : "Create Workflow"}
// // // //                 </h2>
// // // //                 <p className="mt-0.5 text-sm text-slate-500">
// // // //                   Configure multi-level approval
// // // //                 </p>
// // // //               </div>
// // // //               <button onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
// // // //                 ✕
// // // //               </button>
// // // //             </div>

// // // //             <form onSubmit={handleSubmit}>
// // // //               <div className="max-h-[75vh] space-y-6 overflow-y-auto px-6 py-6">
// // // //                 {/* Basic Info */}
// // // //                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
// // // //                   <div className="sm:col-span-2">
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Workflow Name *
// // // //                     </label>
// // // //                     <input
// // // //                       required
// // // //                       value={formData.name}
// // // //                       onChange={(e) => handleChange("name", e.target.value)}
// // // //                       placeholder="e.g. Standard Leave Approval"
// // // //                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
// // // //                     />
// // // //                   </div>

// // // //                   <div>
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Approval Type *
// // // //                     </label>
// // // //                     <select
// // // //                       required
// // // //                       value={formData.approval_type}
// // // //                       onChange={(e) => handleChange("approval_type", e.target.value)}
// // // //                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                     >
// // // //                       {APPROVAL_TYPES.map((t) => (
// // // //                         <option key={t} value={t}>
// // // //                           {t.charAt(0).toUpperCase() + t.slice(1)}
// // // //                         </option>
// // // //                       ))}
// // // //                     </select>
// // // //                   </div>

// // // //                   <div>
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Approval Mode
// // // //                     </label>
// // // //                     <select
// // // //                       value={formData.approval_mode}
// // // //                       onChange={(e) => handleChange("approval_mode", e.target.value)}
// // // //                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                     >
// // // //                       <option value="sequential">Sequential</option>
// // // //                       <option value="parallel">Parallel</option>
// // // //                       <option value="any_one">Any One</option>
// // // //                     </select>
// // // //                   </div>

// // // //                   <div>
// // // //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                       Priority
// // // //                     </label>
// // // //                     <input
// // // //                       type="number"
// // // //                       value={formData.priority}
// // // //                       onChange={(e) => handleChange("priority", Number(e.target.value))}
// // // //                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                     />
// // // //                   </div>

// // // //                   <div className="flex items-center gap-3 pt-6">
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       checked={formData.is_active}
// // // //                       onChange={(e) => handleChange("is_active", e.target.checked)}
// // // //                       className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // // //                     />
// // // //                     <label className="text-sm font-medium text-slate-700">Active</label>
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Levels */}
// // // //                 <div>
// // // //                   <div className="mb-3 flex items-center justify-between">
// // // //                     <h3 className="font-semibold text-slate-800">Approval Levels</h3>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={addLevel}
// // // //                       className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
// // // //                     >
// // // //                       + Add Level
// // // //                     </button>
// // // //                   </div>

// // // //                   <div className="space-y-4">
// // // //                     {formData.levels.map((level, index) => (
// // // //                       <div
// // // //                         key={index}
// // // //                         className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
// // // //                       >
// // // //                         <div className="mb-3 flex items-center justify-between">
// // // //                           <span className="text-sm font-semibold text-slate-700">
// // // //                             Level {index + 1}
// // // //                           </span>
// // // //                           {formData.levels.length > 1 && (
// // // //                             <button
// // // //                               type="button"
// // // //                               onClick={() => removeLevel(index)}
// // // //                               className="text-xs text-red-600 hover:underline"
// // // //                             >
// // // //                               Remove
// // // //                             </button>
// // // //                           )}
// // // //                         </div>

// // // //                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// // // //                           <div>
// // // //                             <label className="mb-1 block text-xs font-medium text-slate-600">
// // // //                               Approver Type
// // // //                             </label>
// // // //                             <select
// // // //                               value={level.approver_type}
// // // //                               onChange={(e) =>
// // // //                                 handleLevelChange(index, "approver_type", e.target.value)
// // // //                               }
// // // //                               className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // // //                             >
// // // //                               {APPROVER_TYPES.map((t) => (
// // // //                                 <option key={t.value} value={t.value}>
// // // //                                   {t.label}
// // // //                                 </option>
// // // //                               ))}
// // // //                             </select>
// // // //                           </div>

// // // //                           {level.approver_type === "role" && (
// // // //                             <div>
// // // //                               <label className="mb-1 block text-xs font-medium text-slate-600">
// // // //                                 Role Name
// // // //                               </label>
// // // //                               <input
// // // //                                 value={level.role_name}
// // // //                                 onChange={(e) =>
// // // //                                   handleLevelChange(index, "role_name", e.target.value)
// // // //                                 }
// // // //                                 placeholder="hr, finance, admin..."
// // // //                                 className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // // //                               />
// // // //                             </div>
// // // //                           )}

// // // //                           {level.approver_type === "specific_user" && (
// // // //                             <div>
// // // //                               <label className="mb-1 block text-xs font-medium text-slate-600">
// // // //                                 User ID
// // // //                               </label>
// // // //                               <input
// // // //                                 value={level.specific_user_id}
// // // //                                 onChange={(e) =>
// // // //                                   handleLevelChange(index, "specific_user_id", e.target.value)
// // // //                                 }
// // // //                                 placeholder="User ID"
// // // //                                 className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // // //                               />
// // // //                             </div>
// // // //                           )}

// // // //                           <div className="flex items-center gap-4 sm:col-span-2">
// // // //                             <label className="flex items-center gap-2 text-sm">
// // // //                               <input
// // // //                                 type="checkbox"
// // // //                                 checked={level.auto_approve}
// // // //                                 onChange={(e) =>
// // // //                                   handleLevelChange(index, "auto_approve", e.target.checked)
// // // //                                 }
// // // //                                 className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // // //                               />
// // // //                               Auto Approve
// // // //                             </label>

// // // //                             <label className="flex items-center gap-2 text-sm">
// // // //                               <input
// // // //                                 type="checkbox"
// // // //                                 checked={level.is_mandatory}
// // // //                                 onChange={(e) =>
// // // //                                   handleLevelChange(index, "is_mandatory", e.target.checked)
// // // //                                 }
// // // //                                 className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // // //                               />
// // // //                               Mandatory
// // // //                             </label>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 </div>

// // // //                 {error && (
// // // //                   <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
// // // //                 )}
// // // //               </div>

// // // //               <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={closeForm}
// // // //                   className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //                 <button
// // // //                   type="submit"
// // // //                   disabled={saving}
// // // //                   className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:opacity-60"
// // // //                 >
// // // //                   {saving ? "Saving..." : editingId ? "Update Workflow" : "Create Workflow"}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ==================== VIEW MODAL ==================== */}
// // // //       {viewing && (
// // // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
// // // //           <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
// // // //             <div className="flex items-center justify-between border-b px-6 py-4">
// // // //               <h2 className="text-lg font-semibold text-slate-800">{viewing.name}</h2>
// // // //               <button
// // // //                 onClick={() => setViewing(null)}
// // // //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// // // //               >
// // // //                 ✕
// // // //               </button>
// // // //             </div>

// // // //             <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
// // // //               <div className="grid grid-cols-2 gap-4 text-sm">
// // // //                 <div>
// // // //                   <p className="text-slate-500">Type</p>
// // // //                   <p className="font-medium capitalize">{viewing.approval_type}</p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <p className="text-slate-500">Mode</p>
// // // //                   <p className="font-medium capitalize">{viewing.approval_mode}</p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <p className="text-slate-500">Priority</p>
// // // //                   <p className="font-medium">{viewing.priority}</p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <p className="text-slate-500">Status</p>
// // // //                   <p className="font-medium">{viewing.is_active ? "Active" : "Inactive"}</p>
// // // //                 </div>
// // // //               </div>

// // // //               <div>
// // // //                 <p className="mb-2 font-semibold text-slate-800">Levels</p>
// // // //                 <div className="space-y-2">
// // // //                   {(viewing.levels || []).map((lvl) => (
// // // //                     <div
// // // //                       key={lvl.level}
// // // //                       className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
// // // //                     >
// // // //                       <span className="font-medium">Level {lvl.level}</span>
// // // //                       <span className="capitalize text-slate-600">
// // // //                         {lvl.approver_type?.replaceAll("_", " ")}
// // // //                         {lvl.auto_approve && (
// // // //                           <span className="ml-2 text-xs text-emerald-600">(Auto)</span>
// // // //                         )}
// // // //                       </span>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useCallback, useEffect, useMemo, useState } from "react";
// // // import { api } from "@/app/lib/api";

// // // /* ═══════════════════════════════════════════════════════
// // //    CONSTANTS — Matching Backend Enums Exactly
// // //    ═══════════════════════════════════════════════════════ */

// // // const APPROVAL_TYPES = [
// // //   { value: "leave", label: "Leave" },
// // //   { value: "special_request", label: "Special Request (WFH / OD)" },
// // //   { value: "attendance", label: "Attendance / Regularization" },
// // //   { value: "overtime", label: "Overtime" },
// // //   { value: "comp_off", label: "Comp Off" },
// // //   { value: "expense", label: "Expense" },
// // //   { value: "loan", label: "Loan" },
// // //   { value: "reimbursement", label: "Reimbursement" },
// // //   { value: "letter", label: "Letter" },
// // //   { value: "payroll", label: "Payroll" },
// // //   { value: "onboarding", label: "Onboarding" },
// // //   { value: "regularization", label: "Regularization" },
// // //   { value: "resignation", label: "Resignation" },
// // //   { value: "fnf", label: "Full & Final" },
// // // ];

// // // // ⭐ Only 4 approver types (NO role_based — only 2 roles exist)
// // // const APPROVER_TYPES = [
// // //   {
// // //     value: "reporting_manager",
// // //     label: "Reporting Manager",
// // //     hint: "Employee's direct manager",
// // //   },
// // //   {
// // //     value: "skip_level_manager",
// // //     label: "Skip-Level Manager",
// // //     hint: "Manager's manager",
// // //   },
// // //   {
// // //     value: "department_head",
// // //     label: "Department Head",
// // //     hint: "Department owner",
// // //   },
// // //   {
// // //     value: "specific_user",
// // //     label: "Specific User",
// // //     hint: "Fixed person (e.g. HR/Admin)",
// // //   },
// // //   {
// // //     value: "user_group",
// // //     label: "User Group",
// // //     hint: "Multiple approvers (any one)",
// // //   },
// // // ];

// // // const CONDITION_OPERATORS = [
// // //   { value: "eq", label: "Equals" },
// // //   { value: "neq", label: "Not Equals" },
// // //   { value: "gt", label: "Greater Than" },
// // //   { value: "gte", label: "Greater or Equal" },
// // //   { value: "lt", label: "Less Than" },
// // //   { value: "lte", label: "Less or Equal" },
// // //   { value: "in", label: "In List" },
// // //   { value: "not_in", label: "Not In List" },
// // //   { value: "contains", label: "Contains" },
// // // ];

// // // const CONDITION_ACTIONS = [
// // //   { value: "require_level", label: "Require Level" },
// // //   { value: "skip_level", label: "Skip Level" },
// // //   { value: "reject_auto", label: "Auto Reject" },
// // // ];

// // // const COMMON_FIELDS = [
// // //   "days_requested",
// // //   "amount",
// // //   "leave_type_id",
// // //   "request_type",
// // //   "employee_id",
// // //   "department_id",
// // //   "priority",
// // // ];

// // // /* ═══════════════════════════════════════════════════════
// // //    HELPERS
// // //    ═══════════════════════════════════════════════════════ */

// // // const getErrorMessage = (err) => {
// // //   const detail = err?.response?.data?.detail;
// // //   if (Array.isArray(detail)) return detail.map((d) => d.msg).join(" • ");
// // //   if (typeof detail === "string") return detail;
// // //   if (err?.code === "ERR_NETWORK") return "Network error";
// // //   if (err?.response?.status === 403) return "Admin access required";
// // //   return err?.message || "Something went wrong";
// // // };

// // // const prettyType = (t) => String(t || "").replace(/_/g, " ");

// // // const formatDate = (v) => {
// // //   if (!v) return "—";
// // //   try {
// // //     return new Date(v).toLocaleDateString("en-IN", {
// // //       day: "2-digit",
// // //       month: "short",
// // //       year: "numeric",
// // //     });
// // //   } catch {
// // //     return String(v);
// // //   }
// // // };

// // // /* ═══════════════════════════════════════════════════════
// // //    FORM DEFAULTS — Matching Backend
// // //    ═══════════════════════════════════════════════════════ */

// // // const makeEmptyLevel = (n = 1) => ({
// // //   level: n,
// // //   name: "",
// // //   description: "",
// // //   approver_type: "reporting_manager",
// // //   specific_user_id: "",
// // //   specific_role: "",
// // //   approver_group: [],
// // //   sla_hours: 24,
// // //   reminder_after_hours: 12,
// // //   escalate_after_hours: 48,
// // //   escalate_to_user_id: "",
// // //   escalate_to_role: "",
// // //   auto_approve_after_hours: "",
// // //   can_be_skipped: true,
// // //   skip_if_no_approver: true,
// // // });

// // // const makeEmptyCondition = () => ({
// // //   field_name: "days_requested",
// // //   operator: "gt",
// // //   value: 5,
// // //   action: "require_level",
// // //   target_level: 2,
// // //   priority: 100,
// // // });

// // // const initialForm = {
// // //   name: "",
// // //   approval_type: "leave",
// // //   description: "",
// // //   allow_requester_cancel: true,
// // //   allow_comments: true,
// // //   default_sla_hours: 48,
// // //   default_reminder_hours: 24,
// // //   default_escalate_hours: 72,
// // //   max_reminders: 3,
// // //   is_active: true,
// // //   levels: [makeEmptyLevel(1)],
// // //   conditions: [],
// // // };

// // // /* ═══════════════════════════════════════════════════════
// // //    MAIN COMPONENT
// // //    ═══════════════════════════════════════════════════════ */

// // // export default function WorkflowsPage() {
// // //   const [workflows, setWorkflows] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [quickSetupLoading, setQuickSetupLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");

// // //   const [showForm, setShowForm] = useState(false);
// // //   const [editingId, setEditingId] = useState(null);
// // //   const [formData, setFormData] = useState(initialForm);
// // //   const [viewing, setViewing] = useState(null);

// // //   /* ---------- Fetch list ---------- */
// // //   const fetchWorkflows = useCallback(async () => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api.get("/api/v1/approvals/workflows");
// // //       const body = res?.data;
// // //       setWorkflows(Array.isArray(body) ? body : []);
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //       setWorkflows([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     fetchWorkflows();
// // //   }, [fetchWorkflows]);

// // //   /* Auto-dismiss success */
// // //   useEffect(() => {
// // //     if (!success) return;
// // //     const t = setTimeout(() => setSuccess(""), 4000);
// // //     return () => clearTimeout(t);
// // //   }, [success]);

// // //   /* ---------- Quick Setup ---------- */
// // //   const handleQuickSetup = async () => {
// // //     if (
// // //       !window.confirm(
// // //         "This will create 5 default workflows:\n" +
// // //           "• Leave (2-level with conditional)\n" +
// // //           "• Attendance\n" +
// // //           "• Overtime\n" +
// // //           "• Special Request (WFH/OD)\n" +
// // //           "• Comp Off\n\n" +
// // //           "Existing active workflows of same types will be skipped.\n" +
// // //           "Continue?"
// // //       )
// // //     ) {
// // //       return;
// // //     }

// // //     setQuickSetupLoading(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       const res = await api.post("/api/v1/approvals/workflows/quick-setup", {
// // //         types: null,
// // //         overwrite: false,
// // //       });
// // //       const data = res?.data ?? {};
// // //       setSuccess(
// // //         `✓ ${data.created_count ?? 0} workflows created, ${data.skipped_count ?? 0} skipped`
// // //       );
// // //       await fetchWorkflows();
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     } finally {
// // //       setQuickSetupLoading(false);
// // //     }
// // //   };

// // //   /* ---------- Form open/close ---------- */
// // //   const openCreate = () => {
// // //     setFormData({
// // //       ...initialForm,
// // //       levels: [makeEmptyLevel(1)],
// // //       conditions: [],
// // //     });
// // //     setEditingId(null);
// // //     setShowForm(true);
// // //     setError("");
// // //     setSuccess("");
// // //   };

// // //   const openEdit = async (wf) => {
// // //     try {
// // //       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
// // //       const d = res?.data ?? wf;

// // //       setFormData({
// // //         name: d.name || "",
// // //         approval_type: d.approval_type || "leave",
// // //         description: d.description || "",
// // //         allow_requester_cancel: d.allow_requester_cancel ?? true,
// // //         allow_comments: d.allow_comments ?? true,
// // //         default_sla_hours: d.default_sla_hours ?? 48,
// // //         default_reminder_hours: d.default_reminder_hours ?? 24,
// // //         default_escalate_hours: d.default_escalate_hours ?? 72,
// // //         max_reminders: d.max_reminders ?? 3,
// // //         is_active: d.is_active ?? true,
// // //         levels:
// // //           d.levels?.length > 0
// // //             ? d.levels.map((l) => ({
// // //                 level: l.level,
// // //                 name: l.name || "",
// // //                 description: l.description || "",
// // //                 approver_type: l.approver_type || "reporting_manager",
// // //                 specific_user_id: l.specific_user_id || "",
// // //                 specific_role: l.specific_role || "",
// // //                 approver_group: l.approver_group || [],
// // //                 sla_hours: l.sla_hours ?? 24,
// // //                 reminder_after_hours: l.reminder_after_hours ?? 12,
// // //                 escalate_after_hours: l.escalate_after_hours ?? 48,
// // //                 escalate_to_user_id: l.escalate_to_user_id || "",
// // //                 escalate_to_role: l.escalate_to_role || "",
// // //                 auto_approve_after_hours: l.auto_approve_after_hours ?? "",
// // //                 can_be_skipped: l.can_be_skipped ?? true,
// // //                 skip_if_no_approver: l.skip_if_no_approver ?? true,
// // //               }))
// // //             : [makeEmptyLevel(1)],
// // //         conditions:
// // //           d.conditions?.length > 0
// // //             ? d.conditions.map((c) => ({
// // //                 field_name: c.field_name || "days_requested",
// // //                 operator: c.operator || "gt",
// // //                 value: c.value ?? 5,
// // //                 action: c.action || "require_level",
// // //                 target_level: c.target_level || 2,
// // //                 priority: c.priority ?? 100,
// // //               }))
// // //             : [],
// // //       });
// // //       setEditingId(wf.workflow_id);
// // //       setShowForm(true);
// // //       setError("");
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     }
// // //   };

// // //   const closeForm = () => {
// // //     setShowForm(false);
// // //     setEditingId(null);
// // //     setFormData(initialForm);
// // //   };

// // //   /* ---------- Form field handlers ---------- */
// // //   const setField = (field, value) =>
// // //     setFormData((prev) => ({ ...prev, [field]: value }));

// // //   const setLevelField = (index, field, value) =>
// // //     setFormData((prev) => {
// // //       const levels = [...prev.levels];
// // //       levels[index] = { ...levels[index], [field]: value };
// // //       return { ...prev, levels };
// // //     });

// // //   const setConditionField = (index, field, value) =>
// // //     setFormData((prev) => {
// // //       const conditions = [...prev.conditions];
// // //       conditions[index] = { ...conditions[index], [field]: value };
// // //       return { ...prev, conditions };
// // //     });

// // //   const addLevel = () =>
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       levels: [...prev.levels, makeEmptyLevel(prev.levels.length + 1)],
// // //     }));

// // //   const removeLevel = (index) => {
// // //     if (formData.levels.length <= 1) return;
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       levels: prev.levels
// // //         .filter((_, i) => i !== index)
// // //         .map((l, i) => ({ ...l, level: i + 1 })),
// // //     }));
// // //   };

// // //   const addCondition = () =>
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       conditions: [...prev.conditions, makeEmptyCondition()],
// // //     }));

// // //   const removeCondition = (index) =>
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       conditions: prev.conditions.filter((_, i) => i !== index),
// // //     }));

// // //   /* ---------- Submit ---------- */
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     // Validation
// // //     if (!formData.name.trim()) {
// // //       setError("Workflow name is required");
// // //       return;
// // //     }
// // //     if (!formData.levels || formData.levels.length === 0) {
// // //       setError("At least one approval level is required");
// // //       return;
// // //     }
// // //     for (let i = 0; i < formData.levels.length; i++) {
// // //       const l = formData.levels[i];
// // //       if (l.approver_type === "specific_user" && !l.specific_user_id?.trim()) {
// // //         setError(`Level ${i + 1}: specific user is required`);
// // //         return;
// // //       }
// // //       if (
// // //         l.approver_type === "user_group" &&
// // //         (!l.approver_group || l.approver_group.length === 0)
// // //       ) {
// // //         setError(`Level ${i + 1}: at least one user in group required`);
// // //         return;
// // //       }
// // //     }

// // //     setSaving(true);
// // //     setError("");
// // //     setSuccess("");

// // //     try {
// // //       const payload = {
// // //         name: formData.name.trim(),
// // //         approval_type: formData.approval_type,
// // //         description: formData.description?.trim() || null,
// // //         allow_requester_cancel: formData.allow_requester_cancel,
// // //         allow_comments: formData.allow_comments,
// // //         default_sla_hours: formData.default_sla_hours
// // //           ? Number(formData.default_sla_hours)
// // //           : null,
// // //         default_reminder_hours: formData.default_reminder_hours
// // //           ? Number(formData.default_reminder_hours)
// // //           : null,
// // //         default_escalate_hours: formData.default_escalate_hours
// // //           ? Number(formData.default_escalate_hours)
// // //           : null,
// // //         max_reminders: Number(formData.max_reminders) || 3,
// // //         is_active: formData.is_active,
// // //         levels: formData.levels.map((l, idx) => ({
// // //           level: idx + 1,
// // //           name: l.name?.trim() || `Level ${idx + 1}`,
// // //           description: l.description?.trim() || null,
// // //           approver_type: l.approver_type,
// // //           specific_user_id:
// // //             l.approver_type === "specific_user" ? l.specific_user_id : null,
// // //           specific_role: l.specific_role || null,
// // //           approver_group:
// // //             l.approver_type === "user_group" ? l.approver_group : null,
// // //           sla_hours: l.sla_hours ? Number(l.sla_hours) : null,
// // //           reminder_after_hours: l.reminder_after_hours
// // //             ? Number(l.reminder_after_hours)
// // //             : null,
// // //           escalate_after_hours: l.escalate_after_hours
// // //             ? Number(l.escalate_after_hours)
// // //             : null,
// // //           escalate_to_user_id: l.escalate_to_user_id || null,
// // //           escalate_to_role: l.escalate_to_role || null,
// // //           auto_approve_after_hours: l.auto_approve_after_hours
// // //             ? Number(l.auto_approve_after_hours)
// // //             : null,
// // //           can_be_skipped: !!l.can_be_skipped,
// // //           skip_if_no_approver: !!l.skip_if_no_approver,
// // //         })),
// // //         conditions: formData.conditions.map((c) => ({
// // //           field_name: c.field_name,
// // //           operator: c.operator,
// // //           value: c.value,
// // //           action: c.action,
// // //           target_level: c.target_level ? Number(c.target_level) : null,
// // //           priority: Number(c.priority) || 100,
// // //         })),
// // //       };

// // //       if (editingId) {
// // //         await api.put(`/api/v1/approvals/workflows/${editingId}`, payload);
// // //         setSuccess("Workflow updated successfully");
// // //       } else {
// // //         await api.post("/api/v1/approvals/workflows", payload);
// // //         setSuccess("Workflow created successfully");
// // //       }

// // //       closeForm();
// // //       await fetchWorkflows();
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   /* ---------- View ---------- */
// // //   const openView = async (wf) => {
// // //     try {
// // //       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
// // //       setViewing(res?.data ?? wf);
// // //     } catch {
// // //       setViewing(wf);
// // //     }
// // //   };

// // //   /* ═══════════════════════════════════════════════════════
// // //      RENDER
// // //      ═══════════════════════════════════════════════════════ */

// // //   return (
// // //     <div className="min-h-screen bg-slate-50">
// // //       {/* Header */}
// // //       <div className="border-b border-slate-200 bg-white">
// // //         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
// // //           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// // //             <div>
// // //               <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
// // //                 Approvals
// // //               </p>
// // //               <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
// // //                 Approval Workflows
// // //               </h1>
// // //               <p className="mt-1 text-sm text-slate-500">
// // //                 Configure multi-level approval chains with conditional routing
// // //               </p>
// // //             </div>
// // //             <div className="flex flex-wrap gap-2">
// // //               <button
// // //                 type="button"
// // //                 onClick={handleQuickSetup}
// // //                 disabled={quickSetupLoading}
// // //                 className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
// // //               >
// // //                 {quickSetupLoading ? "Setting up…" : "⚡ Quick Setup"}
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={openCreate}
// // //                 className="inline-flex items-center gap-2 rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
// // //               >
// // //                 + Create Workflow
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
// // //         {/* Banners */}
// // //         {error && !showForm && (
// // //           <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
// // //             <span>{error}</span>
// // //             <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
// // //               ✕
// // //             </button>
// // //           </div>
// // //         )}
// // //         {success && !showForm && (
// // //           <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
// // //             <span>{success}</span>
// // //             <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-600">
// // //               ✕
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Workflows List */}
// // //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // //           {loading ? (
// // //             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
// // //               <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
// // //               <p className="text-sm">Loading workflows…</p>
// // //             </div>
// // //           ) : workflows.length === 0 ? (
// // //             <div className="px-6 py-16 text-center">
// // //               <p className="text-sm font-medium text-slate-700">No workflows yet</p>
// // //               <p className="mt-1 text-sm text-slate-500">
// // //                 Click "⚡ Quick Setup" to auto-create 5 default workflows, or create manually.
// // //               </p>
// // //               <div className="mt-5 flex justify-center gap-3">
// // //                 <button
// // //                   type="button"
// // //                   onClick={handleQuickSetup}
// // //                   disabled={quickSetupLoading}
// // //                   className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
// // //                 >
// // //                   {quickSetupLoading ? "Setting up…" : "⚡ Quick Setup"}
// // //                 </button>
// // //                 <button
// // //                   type="button"
// // //                   onClick={openCreate}
// // //                   className="rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// // //                 >
// // //                   + Create Workflow
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             <div className="overflow-x-auto">
// // //               <table className="min-w-full text-sm">
// // //                 <thead>
// // //                   <tr className="border-b border-slate-100 bg-slate-50/80">
// // //                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                       Workflow
// // //                     </th>
// // //                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                       Type
// // //                     </th>
// // //                     <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                       Levels
// // //                     </th>
// // //                     <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                       Conditions
// // //                     </th>
// // //                     <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                       Version
// // //                     </th>
// // //                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                       Status
// // //                     </th>
// // //                     <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                       Actions
// // //                     </th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody className="divide-y divide-slate-50">
// // //                   {workflows.map((wf) => (
// // //                     <tr key={wf.workflow_id} className="hover:bg-slate-50/70">
// // //                       <td className="px-5 py-4">
// // //                         <div className="font-medium text-slate-800">{wf.name}</div>
// // //                         <div className="text-xs text-slate-400">{wf.workflow_id}</div>
// // //                       </td>
// // //                       <td className="px-5 py-4">
// // //                         <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
// // //                           {prettyType(wf.approval_type)}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-5 py-4 text-center font-semibold text-slate-800">
// // //                         {wf.levels_count ?? 0}
// // //                       </td>
// // //                       <td className="px-5 py-4 text-center">
// // //                         {wf.conditions_count > 0 ? (
// // //                           <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
// // //                             {wf.conditions_count} rule{wf.conditions_count === 1 ? "" : "s"}
// // //                           </span>
// // //                         ) : (
// // //                           <span className="text-xs text-slate-400">—</span>
// // //                         )}
// // //                       </td>
// // //                       <td className="px-5 py-4 text-center text-xs text-slate-500">
// // //                         v{wf.version ?? 1}
// // //                       </td>
// // //                       <td className="px-5 py-4">
// // //                         <span
// // //                           className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
// // //                             wf.is_active
// // //                               ? "bg-emerald-50 text-emerald-700"
// // //                               : "bg-slate-100 text-slate-500"
// // //                           }`}
// // //                         >
// // //                           {wf.is_active ? "Active" : "Inactive"}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-5 py-4 text-right">
// // //                         <div className="flex justify-end gap-2">
// // //                           <button
// // //                             type="button"
// // //                             onClick={() => openView(wf)}
// // //                             className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
// // //                           >
// // //                             View
// // //                           </button>
// // //                           <button
// // //                             type="button"
// // //                             onClick={() => openEdit(wf)}
// // //                             className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
// // //                           >
// // //                             Edit
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* ═══════════════ CREATE / EDIT MODAL ═══════════════ */}
// // //       {showForm && (
// // //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 backdrop-blur-sm">
// // //           <div className="mb-12 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
// // //               <div>
// // //                 <h2 className="text-lg font-semibold text-slate-800">
// // //                   {editingId ? "Edit Workflow" : "Create Workflow"}
// // //                 </h2>
// // //                 <p className="mt-0.5 text-sm text-slate-500">
// // //                   Multi-level approval with conditional routing
// // //                 </p>
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 onClick={closeForm}
// // //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>

// // //             <form onSubmit={handleSubmit}>
// // //               <div className="max-h-[72vh] space-y-7 overflow-y-auto px-6 py-6">
// // //                 {/* ─── BASIC INFO ─── */}
// // //                 <section>
// // //                   <h3 className="mb-3 text-sm font-semibold text-slate-800">
// // //                     Basic Information
// // //                   </h3>
// // //                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// // //                     <div className="sm:col-span-2">
// // //                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                         Workflow Name *
// // //                       </label>
// // //                       <input
// // //                         required
// // //                         value={formData.name}
// // //                         onChange={(e) => setField("name", e.target.value)}
// // //                         placeholder="e.g. Leave Approval - Default"
// // //                         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
// // //                       />
// // //                     </div>

// // //                     <div>
// // //                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                         Approval Type *
// // //                       </label>
// // //                       <select
// // //                         required
// // //                         value={formData.approval_type}
// // //                         onChange={(e) => setField("approval_type", e.target.value)}
// // //                         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                       >
// // //                         {APPROVAL_TYPES.map((t) => (
// // //                           <option key={t.value} value={t.value}>
// // //                             {t.label}
// // //                           </option>
// // //                         ))}
// // //                       </select>
// // //                     </div>

// // //                     <div className="flex items-center gap-6 pt-7">
// // //                       <label className="flex items-center gap-2 text-sm text-slate-700">
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={formData.is_active}
// // //                           onChange={(e) => setField("is_active", e.target.checked)}
// // //                           className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // //                         />
// // //                         Active
// // //                       </label>
// // //                       <label className="flex items-center gap-2 text-sm text-slate-700">
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={formData.allow_requester_cancel}
// // //                           onChange={(e) =>
// // //                             setField("allow_requester_cancel", e.target.checked)
// // //                           }
// // //                           className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // //                         />
// // //                         Allow Cancel
// // //                       </label>
// // //                       <label className="flex items-center gap-2 text-sm text-slate-700">
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={formData.allow_comments}
// // //                           onChange={(e) => setField("allow_comments", e.target.checked)}
// // //                           className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // //                         />
// // //                         Allow Comments
// // //                       </label>
// // //                     </div>

// // //                     <div className="sm:col-span-2">
// // //                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                         Description
// // //                       </label>
// // //                       <textarea
// // //                         rows={2}
// // //                         value={formData.description}
// // //                         onChange={(e) => setField("description", e.target.value)}
// // //                         placeholder="Optional description for HR/admin"
// // //                         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                       />
// // //                     </div>
// // //                   </div>
// // //                 </section>

// // //                 {/* ─── SLA DEFAULTS ─── */}
// // //                 <section>
// // //                   <h3 className="mb-3 text-sm font-semibold text-slate-800">
// // //                     Default SLA Settings
// // //                   </h3>
// // //                   <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
// // //                     <NumberField
// // //                       label="SLA Hours"
// // //                       value={formData.default_sla_hours}
// // //                       onChange={(v) => setField("default_sla_hours", v)}
// // //                       placeholder="48"
// // //                     />
// // //                     <NumberField
// // //                       label="Reminder After (hrs)"
// // //                       value={formData.default_reminder_hours}
// // //                       onChange={(v) => setField("default_reminder_hours", v)}
// // //                       placeholder="24"
// // //                     />
// // //                     <NumberField
// // //                       label="Escalate After (hrs)"
// // //                       value={formData.default_escalate_hours}
// // //                       onChange={(v) => setField("default_escalate_hours", v)}
// // //                       placeholder="72"
// // //                     />
// // //                     <NumberField
// // //                       label="Max Reminders"
// // //                       value={formData.max_reminders}
// // //                       onChange={(v) => setField("max_reminders", v)}
// // //                       placeholder="3"
// // //                     />
// // //                   </div>
// // //                 </section>

// // //                 {/* ─── LEVELS ─── */}
// // //                 <section>
// // //                   <div className="mb-3 flex items-center justify-between">
// // //                     <div>
// // //                       <h3 className="text-sm font-semibold text-slate-800">
// // //                         Approval Levels ({formData.levels.length})
// // //                       </h3>
// // //                       <p className="text-xs text-slate-500">
// // //                         Chain of approvers. Order matters — Level 1 first.
// // //                       </p>
// // //                     </div>
// // //                     <button
// // //                       type="button"
// // //                       onClick={addLevel}
// // //                       className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
// // //                     >
// // //                       + Add Level
// // //                     </button>
// // //                   </div>

// // //                   <div className="space-y-4">
// // //                     {formData.levels.map((level, index) => (
// // //                       <LevelCard
// // //                         key={index}
// // //                         level={level}
// // //                         index={index}
// // //                         totalLevels={formData.levels.length}
// // //                         onChange={(field, value) =>
// // //                           setLevelField(index, field, value)
// // //                         }
// // //                         onRemove={() => removeLevel(index)}
// // //                       />
// // //                     ))}
// // //                   </div>
// // //                 </section>

// // //                 {/* ─── CONDITIONS ─── */}
// // //                 <section>
// // //                   <div className="mb-3 flex items-center justify-between">
// // //                     <div>
// // //                       <h3 className="text-sm font-semibold text-slate-800">
// // //                         Conditional Routing ({formData.conditions.length})
// // //                       </h3>
// // //                       <p className="text-xs text-slate-500">
// // //                         Optional. Skip or require levels based on request data.
// // //                       </p>
// // //                     </div>
// // //                     <button
// // //                       type="button"
// // //                       onClick={addCondition}
// // //                       className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
// // //                     >
// // //                       + Add Condition
// // //                     </button>
// // //                   </div>

// // //                   {formData.conditions.length === 0 ? (
// // //                     <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-xs text-slate-500">
// // //                       No conditions — all levels apply for every request.
// // //                     </div>
// // //                   ) : (
// // //                     <div className="space-y-3">
// // //                       {formData.conditions.map((cond, index) => (
// // //                         <ConditionCard
// // //                           key={index}
// // //                           condition={cond}
// // //                           index={index}
// // //                           maxLevel={formData.levels.length}
// // //                           onChange={(field, value) =>
// // //                             setConditionField(index, field, value)
// // //                           }
// // //                           onRemove={() => removeCondition(index)}
// // //                         />
// // //                       ))}
// // //                     </div>
// // //                   )}
// // //                 </section>

// // //                 {error && (
// // //                   <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
// // //                     {error}
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
// // //                 <button
// // //                   type="button"
// // //                   onClick={closeForm}
// // //                   className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   disabled={saving}
// // //                   className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:opacity-60"
// // //                 >
// // //                   {saving
// // //                     ? "Saving…"
// // //                     : editingId
// // //                     ? "Update Workflow"
// // //                     : "Create Workflow"}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ═══════════════ VIEW MODAL ═══════════════ */}
// // //       {viewing && (
// // //         <WorkflowViewModal
// // //           workflow={viewing}
// // //           onClose={() => setViewing(null)}
// // //           onEdit={() => {
// // //             const wf = viewing;
// // //             setViewing(null);
// // //             openEdit(wf);
// // //           }}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // /* ═══════════════════════════════════════════════════════
// // //    SUB-COMPONENTS
// // //    ═══════════════════════════════════════════════════════ */

// // // function NumberField({ label, value, onChange, placeholder }) {
// // //   return (
// // //     <div>
// // //       <label className="mb-1.5 block text-xs font-medium text-slate-600">
// // //         {label}
// // //       </label>
// // //       <input
// // //         type="number"
// // //         min="0"
// // //         value={value}
// // //         onChange={(e) => onChange(e.target.value)}
// // //         placeholder={placeholder}
// // //         className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //       />
// // //     </div>
// // //   );
// // // }

// // // function LevelCard({ level, index, totalLevels, onChange, onRemove }) {
// // //   const isGroup = level.approver_type === "user_group";

// // //   return (
// // //     <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
// // //       <div className="mb-3 flex items-center justify-between">
// // //         <div className="flex items-center gap-2">
// // //           <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white">
// // //             {index + 1}
// // //           </span>
// // //           <span className="text-sm font-semibold text-slate-700">
// // //             Level {index + 1}
// // //           </span>
// // //           {level.can_be_skipped && (
// // //             <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
// // //               Skippable
// // //             </span>
// // //           )}
// // //         </div>
// // //         {totalLevels > 1 && (
// // //           <button
// // //             type="button"
// // //             onClick={onRemove}
// // //             className="text-xs font-medium text-red-600 hover:underline"
// // //           >
// // //             Remove
// // //           </button>
// // //         )}
// // //       </div>

// // //       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
// // //         <div>
// // //           <label className="mb-1 block text-xs font-medium text-slate-600">
// // //             Level Name
// // //           </label>
// // //           <input
// // //             value={level.name}
// // //             onChange={(e) => onChange("name", e.target.value)}
// // //             placeholder={`Level ${index + 1}`}
// // //             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="mb-1 block text-xs font-medium text-slate-600">
// // //             Approver Type *
// // //           </label>
// // //           <select
// // //             value={level.approver_type}
// // //             onChange={(e) => onChange("approver_type", e.target.value)}
// // //             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //           >
// // //             {APPROVER_TYPES.map((t) => (
// // //               <option key={t.value} value={t.value}>
// // //                 {t.label}
// // //               </option>
// // //             ))}
// // //           </select>
// // //           <p className="mt-1 text-[11px] text-slate-400">
// // //             {APPROVER_TYPES.find((t) => t.value === level.approver_type)?.hint}
// // //           </p>
// // //         </div>

// // //         {level.approver_type === "specific_user" && (
// // //           <div className="sm:col-span-2">
// // //             <label className="mb-1 block text-xs font-medium text-slate-600">
// // //               Specific User ID *
// // //             </label>
// // //             <input
// // //               value={level.specific_user_id}
// // //               onChange={(e) => onChange("specific_user_id", e.target.value)}
// // //               placeholder="e.g. USR_ABC123"
// // //               className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //             />
// // //           </div>
// // //         )}

// // //         {isGroup && (
// // //           <div className="sm:col-span-2">
// // //             <label className="mb-1 block text-xs font-medium text-slate-600">
// // //               User IDs (comma-separated) *
// // //             </label>
// // //             <input
// // //               value={
// // //                 Array.isArray(level.approver_group)
// // //                   ? level.approver_group.join(", ")
// // //                   : ""
// // //               }
// // //               onChange={(e) =>
// // //                 onChange(
// // //                   "approver_group",
// // //                   e.target.value
// // //                     .split(",")
// // //                     .map((s) => s.trim())
// // //                     .filter(Boolean)
// // //                 )
// // //               }
// // //               placeholder="USR_A1, USR_B2, USR_C3"
// // //               className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //             />
// // //           </div>
// // //         )}

// // //         <NumberField
// // //           label="SLA (hrs)"
// // //           value={level.sla_hours}
// // //           onChange={(v) => onChange("sla_hours", v)}
// // //           placeholder="24"
// // //         />
// // //         <NumberField
// // //           label="Reminder After (hrs)"
// // //           value={level.reminder_after_hours}
// // //           onChange={(v) => onChange("reminder_after_hours", v)}
// // //           placeholder="12"
// // //         />
// // //         <NumberField
// // //           label="Escalate After (hrs)"
// // //           value={level.escalate_after_hours}
// // //           onChange={(v) => onChange("escalate_after_hours", v)}
// // //           placeholder="48"
// // //         />
// // //         <NumberField
// // //           label="Auto Approve (hrs)"
// // //           value={level.auto_approve_after_hours}
// // //           onChange={(v) => onChange("auto_approve_after_hours", v)}
// // //           placeholder="—"
// // //         />

// // //         <div className="flex flex-wrap gap-4 sm:col-span-2">
// // //           <label className="flex items-center gap-2 text-xs text-slate-700">
// // //             <input
// // //               type="checkbox"
// // //               checked={level.can_be_skipped}
// // //               onChange={(e) => onChange("can_be_skipped", e.target.checked)}
// // //               className="h-3.5 w-3.5 rounded border-slate-300 text-[#E42527]"
// // //             />
// // //             Can be skipped
// // //           </label>
// // //           <label className="flex items-center gap-2 text-xs text-slate-700">
// // //             <input
// // //               type="checkbox"
// // //               checked={level.skip_if_no_approver}
// // //               onChange={(e) => onChange("skip_if_no_approver", e.target.checked)}
// // //               className="h-3.5 w-3.5 rounded border-slate-300 text-[#E42527]"
// // //             />
// // //             Skip if no approver found
// // //           </label>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function ConditionCard({ condition, index, maxLevel, onChange, onRemove }) {
// // //   return (
// // //     <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
// // //       <div className="mb-3 flex items-center justify-between">
// // //         <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
// // //           Condition {index + 1}
// // //         </span>
// // //         <button
// // //           type="button"
// // //           onClick={onRemove}
// // //           className="text-xs font-medium text-red-600 hover:underline"
// // //         >
// // //           Remove
// // //         </button>
// // //       </div>

// // //       <div className="flex flex-wrap items-center gap-2 text-sm">
// // //         <span className="text-slate-600">IF</span>

// // //         <input
// // //           value={condition.field_name}
// // //           onChange={(e) => onChange("field_name", e.target.value)}
// // //           placeholder="days_requested"
// // //           list="common-fields"
// // //           className="w-40 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// // //         />
// // //         <datalist id="common-fields">
// // //           {COMMON_FIELDS.map((f) => (
// // //             <option key={f} value={f} />
// // //           ))}
// // //         </datalist>

// // //         <select
// // //           value={condition.operator}
// // //           onChange={(e) => onChange("operator", e.target.value)}
// // //           className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// // //         >
// // //           {CONDITION_OPERATORS.map((o) => (
// // //             <option key={o.value} value={o.value}>
// // //               {o.label}
// // //             </option>
// // //           ))}
// // //         </select>

// // //         <input
// // //           value={condition.value}
// // //           onChange={(e) => onChange("value", e.target.value)}
// // //           placeholder="5"
// // //           className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// // //         />

// // //         <span className="text-slate-600">THEN</span>

// // //         <select
// // //           value={condition.action}
// // //           onChange={(e) => onChange("action", e.target.value)}
// // //           className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// // //         >
// // //           {CONDITION_ACTIONS.map((a) => (
// // //             <option key={a.value} value={a.value}>
// // //               {a.label}
// // //             </option>
// // //           ))}
// // //         </select>

// // //         {condition.action !== "reject_auto" && (
// // //           <>
// // //             <span className="text-slate-600">Level</span>
// // //             <input
// // //               type="number"
// // //               min="1"
// // //               max={maxLevel}
// // //               value={condition.target_level}
// // //               onChange={(e) => onChange("target_level", e.target.value)}
// // //               className="w-16 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// // //             />
// // //           </>
// // //         )}
// // //       </div>

// // //       <p className="mt-2 text-[11px] text-slate-500">
// // //         Example: IF <code>days_requested</code> GT 5 THEN require Level 2.
// // //       </p>
// // //     </div>
// // //   );
// // // }

// // // function WorkflowViewModal({ workflow, onClose, onEdit }) {
// // //   const levels = workflow.levels || [];
// // //   const conditions = workflow.conditions || [];

// // //   return (
// // //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// // //       <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
// // //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// // //           <div>
// // //             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// // //               Workflow
// // //             </p>
// // //             <h3 className="mt-1 text-lg font-semibold text-slate-900">
// // //               {workflow.name}
// // //             </h3>
// // //           </div>
// // //           <button
// // //             type="button"
// // //             onClick={onClose}
// // //             className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// // //           >
// // //             ✕
// // //           </button>
// // //         </div>

// // //         <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
// // //           <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
// // //             <InfoBox label="Type" value={prettyType(workflow.approval_type)} />
// // //             <InfoBox label="Version" value={`v${workflow.version ?? 1}`} />
// // //             <InfoBox
// // //               label="Status"
// // //               value={workflow.is_active ? "Active" : "Inactive"}
// // //             />
// // //             <InfoBox label="SLA" value={`${workflow.default_sla_hours ?? "—"} hrs`} />
// // //             <InfoBox
// // //               label="Reminder"
// // //               value={`${workflow.default_reminder_hours ?? "—"} hrs`}
// // //             />
// // //             <InfoBox
// // //               label="Escalate"
// // //               value={`${workflow.default_escalate_hours ?? "—"} hrs`}
// // //             />
// // //           </div>

// // //           {workflow.description && (
// // //             <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
// // //               {workflow.description}
// // //             </div>
// // //           )}

// // //           <div>
// // //             <h4 className="mb-2 text-sm font-semibold text-slate-800">
// // //               Levels ({levels.length})
// // //             </h4>
// // //             <div className="space-y-2">
// // //               {levels.map((lvl, i) => (
// // //                 <div
// // //                   key={i}
// // //                   className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
// // //                 >
// // //                   <div className="flex items-center gap-2">
// // //                     <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
// // //                       {lvl.level}
// // //                     </span>
// // //                     <span className="font-medium text-slate-800">
// // //                       {lvl.name || `Level ${lvl.level}`}
// // //                     </span>
// // //                   </div>
// // //                   <span className="text-xs capitalize text-slate-500">
// // //                     {prettyType(lvl.approver_type)}
// // //                   </span>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {conditions.length > 0 && (
// // //             <div>
// // //               <h4 className="mb-2 text-sm font-semibold text-slate-800">
// // //                 Conditions ({conditions.length})
// // //               </h4>
// // //               <div className="space-y-2">
// // //                 {conditions.map((c, i) => (
// // //                   <div
// // //                     key={i}
// // //                     className="rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-xs text-slate-700"
// // //                   >
// // //                     <span className="font-medium">IF</span>{" "}
// // //                     <code className="rounded bg-white px-1.5 py-0.5">
// // //                       {c.field_name}
// // //                     </code>{" "}
// // //                     <span className="text-slate-500">{c.operator}</span>{" "}
// // //                     <code className="rounded bg-white px-1.5 py-0.5">
// // //                       {String(c.value)}
// // //                     </code>{" "}
// // //                     <span className="font-medium">THEN</span>{" "}
// // //                     <span className="text-slate-500">{c.action}</span>
// // //                     {c.target_level && <> → Level {c.target_level}</>}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
// // //           <button
// // //             type="button"
// // //             onClick={onClose}
// // //             className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// // //           >
// // //             Close
// // //           </button>
// // //           <button
// // //             type="button"
// // //             onClick={onEdit}
// // //             className="rounded-xl bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// // //           >
// // //             Edit
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function InfoBox({ label, value }) {
// // //   return (
// // //     <div className="rounded-xl bg-slate-50 px-3 py-2.5">
// // //       <p className="text-[11px] uppercase tracking-wide text-slate-400">
// // //         {label}
// // //       </p>
// // //       <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import { useCallback, useEffect, useMemo, useState } from "react";
// // import { api } from "@/app/lib/api";

// // /* ═══════════════════════════════════════════════════════
// //    CONSTANTS
// //    ═══════════════════════════════════════════════════════ */

// // const APPROVAL_TYPES = [
// //   { value: "leave", label: "Leave" },
// //   { value: "special_request", label: "Special Request (WFH / OD)" },
// //   { value: "attendance", label: "Attendance / Regularization" },
// //   { value: "overtime", label: "Overtime" },
// //   { value: "comp_off", label: "Comp Off" },
// //   { value: "expense", label: "Expense" },
// //   { value: "loan", label: "Loan" },
// //   { value: "reimbursement", label: "Reimbursement" },
// //   { value: "letter", label: "Letter" },
// //   { value: "payroll", label: "Payroll" },
// //   { value: "onboarding", label: "Onboarding" },
// //   { value: "regularization", label: "Regularization" },
// //   { value: "resignation", label: "Resignation" },
// //   { value: "fnf", label: "Full & Final" },
// // ];

// // // Only 4 approver types (no role_based)
// // const APPROVER_TYPES = [
// //   { value: "reporting_manager", label: "Reporting Manager", hint: "Employee's direct manager" },
// //   { value: "skip_level_manager", label: "Skip-Level Manager", hint: "Manager's manager" },
// //   { value: "department_head", label: "Department Head", hint: "Department owner" },
// //   { value: "specific_user", label: "Specific User", hint: "Fixed person — select from list" },
// //   { value: "user_group", label: "User Group", hint: "Multiple approvers — any one can approve" },
// // ];

// // const CONDITION_OPERATORS = [
// //   { value: "eq", label: "Equals" },
// //   { value: "neq", label: "Not Equals" },
// //   { value: "gt", label: "Greater Than" },
// //   { value: "gte", label: "Greater or Equal" },
// //   { value: "lt", label: "Less Than" },
// //   { value: "lte", label: "Less or Equal" },
// //   { value: "in", label: "In List" },
// //   { value: "not_in", label: "Not In List" },
// //   { value: "contains", label: "Contains" },
// // ];

// // const CONDITION_ACTIONS = [
// //   { value: "require_level", label: "Require Level" },
// //   { value: "skip_level", label: "Skip Level" },
// //   { value: "reject_auto", label: "Auto Reject" },
// // ];

// // const COMMON_FIELDS = [
// //   "days_requested",
// //   "amount",
// //   "leave_type_id",
// //   "request_type",
// //   "employee_id",
// //   "department_id",
// //   "priority",
// // ];

// // /* ═══════════════════════════════════════════════════════
// //    HELPERS
// //    ═══════════════════════════════════════════════════════ */

// // const getErrorMessage = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((d) => d.msg).join(" • ");
// //   if (typeof detail === "string") return detail;
// //   if (err?.code === "ERR_NETWORK") return "Network error";
// //   if (err?.response?.status === 403) return "Admin access required";
// //   return err?.message || "Something went wrong";
// // };

// // const prettyType = (t) => String(t || "").replace(/_/g, " ");

// // /* -------- Employee extraction (robust) -------- */
// // function extractEmployees(response) {
// //   const body = response?.data ?? {};
// //   const data = body?.data ?? body;
// //   if (Array.isArray(data)) return data;
// //   return data?.employees ?? data?.items ?? data?.results ?? [];
// // }

// // function getEmpId(emp) {
// //   return emp?.employee_id || emp?.id || emp?._id || "";
// // }

// // function getEmpUserId(emp) {
// //   return emp?.user_id || emp?.userId || "";
// // }

// // function getEmpName(emp) {
// //   const full = [emp?.first_name, emp?.last_name].filter(Boolean).join(" ").trim();
// //   return full || emp?.name || emp?.full_name || getEmpId(emp) || "Employee";
// // }

// // /* ═══════════════════════════════════════════════════════
// //    FORM DEFAULTS
// //    ═══════════════════════════════════════════════════════ */

// // const makeEmptyLevel = (n = 1) => ({
// //   level: n,
// //   name: "",
// //   description: "",
// //   approver_type: "reporting_manager",
// //   specific_user_id: "",
// //   specific_role: "",
// //   approver_group: [],
// //   sla_hours: 24,
// //   reminder_after_hours: 12,
// //   escalate_after_hours: 48,
// //   escalate_to_user_id: "",
// //   escalate_to_role: "",
// //   auto_approve_after_hours: "",
// //   can_be_skipped: true,
// //   skip_if_no_approver: true,
// // });

// // const makeEmptyCondition = () => ({
// //   field_name: "days_requested",
// //   operator: "gt",
// //   value: 5,
// //   action: "require_level",
// //   target_level: 2,
// //   priority: 100,
// // });

// // const initialForm = {
// //   name: "",
// //   approval_type: "leave",
// //   description: "",
// //   allow_requester_cancel: true,
// //   allow_comments: true,
// //   default_sla_hours: 48,
// //   default_reminder_hours: 24,
// //   default_escalate_hours: 72,
// //   max_reminders: 3,
// //   is_active: true,
// //   levels: [makeEmptyLevel(1)],
// //   conditions: [],
// // };

// // /* ═══════════════════════════════════════════════════════
// //    MAIN
// //    ═══════════════════════════════════════════════════════ */

// // export default function WorkflowsPage() {
// //   const [workflows, setWorkflows] = useState([]);
// //   const [employees, setEmployees] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [quickSetupLoading, setQuickSetupLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const [showForm, setShowForm] = useState(false);
// //   const [editingId, setEditingId] = useState(null);
// //   const [formData, setFormData] = useState(initialForm);
// //   const [viewing, setViewing] = useState(null);

// //   /* ---------- Fetch ---------- */
// //   const fetchWorkflows = useCallback(async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get("/api/v1/approvals/workflows");
// //       const body = res?.data;
// //       setWorkflows(Array.isArray(body) ? body : []);
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //       setWorkflows([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const fetchEmployees = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/employees", {
// //         params: { page: 1, page_size: 1000 },
// //       });
// //       const list = extractEmployees(res);
// //       // Only employees with user_id (must have login account to be approver)
// //       const valid = list.filter((e) => getEmpUserId(e));
// //       setEmployees(valid);
// //     } catch (err) {
// //       // Non-blocking — page still works, just dropdowns empty
// //       console.warn("Employee fetch failed:", err);
// //       setEmployees([]);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchWorkflows();
// //     fetchEmployees();
// //   }, [fetchWorkflows, fetchEmployees]);

// //   useEffect(() => {
// //     if (!success) return;
// //     const t = setTimeout(() => setSuccess(""), 4000);
// //     return () => clearTimeout(t);
// //   }, [success]);

// //   /* ---------- Quick Setup ---------- */
// //   const handleQuickSetup = async () => {
// //     if (
// //       !window.confirm(
// //         "This will create 5 default workflows:\n" +
// //           "• Leave (2-level)\n• Attendance\n• Overtime\n" +
// //           "• Special Request (WFH/OD)\n• Comp Off\n\n" +
// //           "Existing active ones will be skipped. Continue?"
// //       )
// //     )
// //       return;

// //     setQuickSetupLoading(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       const res = await api.post("/api/v1/approvals/workflows/quick-setup", {
// //         types: null,
// //         overwrite: false,
// //       });
// //       const data = res?.data ?? {};
// //       setSuccess(
// //         `✓ ${data.created_count ?? 0} created, ${data.skipped_count ?? 0} skipped`
// //       );
// //       await fetchWorkflows();
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setQuickSetupLoading(false);
// //     }
// //   };

// //   /* ---------- Open form ---------- */
// //   const openCreate = () => {
// //     setFormData({
// //       ...initialForm,
// //       levels: [makeEmptyLevel(1)],
// //       conditions: [],
// //     });
// //     setEditingId(null);
// //     setShowForm(true);
// //     setError("");
// //     setSuccess("");
// //   };

// //   const openEdit = async (wf) => {
// //     try {
// //       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
// //       const d = res?.data ?? wf;

// //       setFormData({
// //         name: d.name || "",
// //         approval_type: d.approval_type || "leave",
// //         description: d.description || "",
// //         allow_requester_cancel: d.allow_requester_cancel ?? true,
// //         allow_comments: d.allow_comments ?? true,
// //         default_sla_hours: d.default_sla_hours ?? 48,
// //         default_reminder_hours: d.default_reminder_hours ?? 24,
// //         default_escalate_hours: d.default_escalate_hours ?? 72,
// //         max_reminders: d.max_reminders ?? 3,
// //         is_active: d.is_active ?? true,
// //         levels:
// //           d.levels?.length > 0
// //             ? d.levels.map((l) => ({
// //                 level: l.level,
// //                 name: l.name || "",
// //                 description: l.description || "",
// //                 approver_type: l.approver_type || "reporting_manager",
// //                 specific_user_id: l.specific_user_id || "",
// //                 specific_role: l.specific_role || "",
// //                 approver_group: l.approver_group || [],
// //                 sla_hours: l.sla_hours ?? 24,
// //                 reminder_after_hours: l.reminder_after_hours ?? 12,
// //                 escalate_after_hours: l.escalate_after_hours ?? 48,
// //                 escalate_to_user_id: l.escalate_to_user_id || "",
// //                 escalate_to_role: l.escalate_to_role || "",
// //                 auto_approve_after_hours: l.auto_approve_after_hours ?? "",
// //                 can_be_skipped: l.can_be_skipped ?? true,
// //                 skip_if_no_approver: l.skip_if_no_approver ?? true,
// //               }))
// //             : [makeEmptyLevel(1)],
// //         conditions:
// //           d.conditions?.length > 0
// //             ? d.conditions.map((c) => ({
// //                 field_name: c.field_name || "days_requested",
// //                 operator: c.operator || "gt",
// //                 value: c.value ?? 5,
// //                 action: c.action || "require_level",
// //                 target_level: c.target_level || 2,
// //                 priority: c.priority ?? 100,
// //               }))
// //             : [],
// //       });
// //       setEditingId(wf.workflow_id);
// //       setShowForm(true);
// //       setError("");
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     }
// //   };

// //   const closeForm = () => {
// //     setShowForm(false);
// //     setEditingId(null);
// //     setFormData(initialForm);
// //   };

// //   /* ---------- Field handlers ---------- */
// //   const setField = (field, value) =>
// //     setFormData((prev) => ({ ...prev, [field]: value }));

// //   const setLevelField = (index, field, value) =>
// //     setFormData((prev) => {
// //       const levels = [...prev.levels];
// //       levels[index] = { ...levels[index], [field]: value };
// //       return { ...prev, levels };
// //     });

// //   const setConditionField = (index, field, value) =>
// //     setFormData((prev) => {
// //       const conditions = [...prev.conditions];
// //       conditions[index] = { ...conditions[index], [field]: value };
// //       return { ...prev, conditions };
// //     });

// //   const addLevel = () =>
// //     setFormData((prev) => ({
// //       ...prev,
// //       levels: [...prev.levels, makeEmptyLevel(prev.levels.length + 1)],
// //     }));

// //   const removeLevel = (index) => {
// //     if (formData.levels.length <= 1) return;
// //     setFormData((prev) => ({
// //       ...prev,
// //       levels: prev.levels
// //         .filter((_, i) => i !== index)
// //         .map((l, i) => ({ ...l, level: i + 1 })),
// //     }));
// //   };

// //   const addCondition = () =>
// //     setFormData((prev) => ({
// //       ...prev,
// //       conditions: [...prev.conditions, makeEmptyCondition()],
// //     }));

// //   const removeCondition = (index) =>
// //     setFormData((prev) => ({
// //       ...prev,
// //       conditions: prev.conditions.filter((_, i) => i !== index),
// //     }));

// //   /* ---------- Submit ---------- */
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!formData.name.trim()) {
// //       setError("Workflow name is required");
// //       return;
// //     }
// //     for (let i = 0; i < formData.levels.length; i++) {
// //       const l = formData.levels[i];
// //       if (l.approver_type === "specific_user" && !l.specific_user_id) {
// //         setError(`Level ${i + 1}: select an employee`);
// //         return;
// //       }
// //       if (
// //         l.approver_type === "user_group" &&
// //         (!l.approver_group || l.approver_group.length === 0)
// //       ) {
// //         setError(`Level ${i + 1}: select at least one employee`);
// //         return;
// //       }
// //     }

// //     setSaving(true);
// //     setError("");
// //     setSuccess("");

// //     try {
// //       const payload = {
// //         name: formData.name.trim(),
// //         approval_type: formData.approval_type,
// //         description: formData.description?.trim() || null,
// //         allow_requester_cancel: formData.allow_requester_cancel,
// //         allow_comments: formData.allow_comments,
// //         default_sla_hours: formData.default_sla_hours
// //           ? Number(formData.default_sla_hours)
// //           : null,
// //         default_reminder_hours: formData.default_reminder_hours
// //           ? Number(formData.default_reminder_hours)
// //           : null,
// //         default_escalate_hours: formData.default_escalate_hours
// //           ? Number(formData.default_escalate_hours)
// //           : null,
// //         max_reminders: Number(formData.max_reminders) || 3,
// //         is_active: formData.is_active,
// //         levels: formData.levels.map((l, idx) => ({
// //           level: idx + 1,
// //           name: l.name?.trim() || `Level ${idx + 1}`,
// //           description: l.description?.trim() || null,
// //           approver_type: l.approver_type,
// //           specific_user_id:
// //             l.approver_type === "specific_user" ? l.specific_user_id : null,
// //           specific_role: l.specific_role || null,
// //           approver_group:
// //             l.approver_type === "user_group" ? l.approver_group : null,
// //           sla_hours: l.sla_hours ? Number(l.sla_hours) : null,
// //           reminder_after_hours: l.reminder_after_hours
// //             ? Number(l.reminder_after_hours)
// //             : null,
// //           escalate_after_hours: l.escalate_after_hours
// //             ? Number(l.escalate_after_hours)
// //             : null,
// //           escalate_to_user_id: l.escalate_to_user_id || null,
// //           escalate_to_role: l.escalate_to_role || null,
// //           auto_approve_after_hours: l.auto_approve_after_hours
// //             ? Number(l.auto_approve_after_hours)
// //             : null,
// //           can_be_skipped: !!l.can_be_skipped,
// //           skip_if_no_approver: !!l.skip_if_no_approver,
// //         })),
// //         conditions: formData.conditions.map((c) => ({
// //           field_name: c.field_name,
// //           operator: c.operator,
// //           value: c.value,
// //           action: c.action,
// //           target_level: c.target_level ? Number(c.target_level) : null,
// //           priority: Number(c.priority) || 100,
// //         })),
// //       };

// //       if (editingId) {
// //         await api.put(`/api/v1/approvals/workflows/${editingId}`, payload);
// //         setSuccess("Workflow updated");
// //       } else {
// //         await api.post("/api/v1/approvals/workflows", payload);
// //         setSuccess("Workflow created");
// //       }

// //       closeForm();
// //       await fetchWorkflows();
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const openView = async (wf) => {
// //     try {
// //       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
// //       setViewing(res?.data ?? wf);
// //     } catch {
// //       setViewing(wf);
// //     }
// //   };

// //   /* ═══════════════════════════════════════════════════════
// //      RENDER
// //      ═══════════════════════════════════════════════════════ */

// //   return (
// //     <div className="min-h-screen bg-slate-50">
// //       {/* Header */}
// //       <div className="border-b border-slate-200 bg-white">
// //         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
// //           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //             <div>
// //               <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
// //                 Approvals
// //               </p>
// //               <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
// //                 Approval Workflows
// //               </h1>
// //               <p className="mt-1 text-sm text-slate-500">
// //                 Configure multi-level approval chains
// //               </p>
// //             </div>
// //             <div className="flex flex-wrap gap-2">
// //               <button
// //                 type="button"
// //                 onClick={handleQuickSetup}
// //                 disabled={quickSetupLoading}
// //                 className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
// //               >
// //                 {quickSetupLoading ? "Setting up…" : "⚡ Quick Setup"}
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={openCreate}
// //                 className="rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
// //               >
// //                 + Create Workflow
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
// //         {error && !showForm && (
// //           <div className="mb-4 flex items-start justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
// //             <span>{error}</span>
// //             <button onClick={() => setError("")}>✕</button>
// //           </div>
// //         )}
// //         {success && !showForm && (
// //           <div className="mb-4 flex items-start justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
// //             <span>{success}</span>
// //             <button onClick={() => setSuccess("")}>✕</button>
// //           </div>
// //         )}

// //         {/* List */}
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //           {loading ? (
// //             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
// //               <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
// //               <p className="text-sm">Loading…</p>
// //             </div>
// //           ) : workflows.length === 0 ? (
// //             <div className="px-6 py-16 text-center">
// //               <p className="text-sm font-medium text-slate-700">No workflows yet</p>
// //               <p className="mt-1 text-sm text-slate-500">
// //                 Click "⚡ Quick Setup" or create manually
// //               </p>
// //               <div className="mt-5 flex justify-center gap-3">
// //                 <button
// //                   onClick={handleQuickSetup}
// //                   disabled={quickSetupLoading}
// //                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
// //                 >
// //                   {quickSetupLoading ? "Setting up…" : "⚡ Quick Setup"}
// //                 </button>
// //                 <button
// //                   onClick={openCreate}
// //                   className="rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// //                 >
// //                   + Create Workflow
// //                 </button>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full text-sm">
// //                 <thead>
// //                   <tr className="border-b border-slate-100 bg-slate-50/80">
// //                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// //                       Workflow
// //                     </th>
// //                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// //                       Type
// //                     </th>
// //                     <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
// //                       Levels
// //                     </th>
// //                     <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
// //                       Conditions
// //                     </th>
// //                     <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
// //                       Version
// //                     </th>
// //                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// //                       Status
// //                     </th>
// //                     <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-slate-50">
// //                   {workflows.map((wf) => (
// //                     <tr key={wf.workflow_id} className="hover:bg-slate-50/70">
// //                       <td className="px-5 py-4">
// //                         <div className="font-medium text-slate-800">{wf.name}</div>
// //                         <div className="text-xs text-slate-400">{wf.workflow_id}</div>
// //                       </td>
// //                       <td className="px-5 py-4">
// //                         <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
// //                           {prettyType(wf.approval_type)}
// //                         </span>
// //                       </td>
// //                       <td className="px-5 py-4 text-center font-semibold text-slate-800">
// //                         {wf.levels_count ?? 0}
// //                       </td>
// //                       <td className="px-5 py-4 text-center">
// //                         {wf.conditions_count > 0 ? (
// //                           <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
// //                             {wf.conditions_count} rule{wf.conditions_count === 1 ? "" : "s"}
// //                           </span>
// //                         ) : (
// //                           <span className="text-xs text-slate-400">—</span>
// //                         )}
// //                       </td>
// //                       <td className="px-5 py-4 text-center text-xs text-slate-500">
// //                         v{wf.version ?? 1}
// //                       </td>
// //                       <td className="px-5 py-4">
// //                         <span
// //                           className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
// //                             wf.is_active
// //                               ? "bg-emerald-50 text-emerald-700"
// //                               : "bg-slate-100 text-slate-500"
// //                           }`}
// //                         >
// //                           {wf.is_active ? "Active" : "Inactive"}
// //                         </span>
// //                       </td>
// //                       <td className="px-5 py-4 text-right">
// //                         <div className="flex justify-end gap-2">
// //                           <button
// //                             onClick={() => openView(wf)}
// //                             className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
// //                           >
// //                             View
// //                           </button>
// //                           <button
// //                             onClick={() => openEdit(wf)}
// //                             className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
// //                           >
// //                             Edit
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* ═══════════════ CREATE / EDIT MODAL ═══════════════ */}
// //       {showForm && (
// //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 backdrop-blur-sm">
// //           <div className="mb-12 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
// //               <div>
// //                 <h2 className="text-lg font-semibold text-slate-800">
// //                   {editingId ? "Edit Workflow" : "Create Workflow"}
// //                 </h2>
// //                 <p className="mt-0.5 text-sm text-slate-500">
// //                   Multi-level approval with conditional routing
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={closeForm}
// //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={handleSubmit}>
// //               <div className="max-h-[72vh] space-y-7 overflow-y-auto px-6 py-6">
// //                 {/* ─── BASIC ─── */}
// //                 <section>
// //                   <h3 className="mb-3 text-sm font-semibold text-slate-800">
// //                     Basic Information
// //                   </h3>
// //                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                     <div className="sm:col-span-2">
// //                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                         Workflow Name *
// //                       </label>
// //                       <input
// //                         required
// //                         value={formData.name}
// //                         onChange={(e) => setField("name", e.target.value)}
// //                         placeholder="e.g. Leave Approval - Default"
// //                         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
// //                       />
// //                     </div>

// //                     <div>
// //                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                         Approval Type *
// //                       </label>
// //                       <select
// //                         required
// //                         value={formData.approval_type}
// //                         onChange={(e) => setField("approval_type", e.target.value)}
// //                         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                       >
// //                         {APPROVAL_TYPES.map((t) => (
// //                           <option key={t.value} value={t.value}>
// //                             {t.label}
// //                           </option>
// //                         ))}
// //                       </select>
// //                     </div>

// //                     <div className="flex items-center gap-6 pt-7">
// //                       <label className="flex items-center gap-2 text-sm text-slate-700">
// //                         <input
// //                           type="checkbox"
// //                           checked={formData.is_active}
// //                           onChange={(e) => setField("is_active", e.target.checked)}
// //                           className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// //                         />
// //                         Active
// //                       </label>
// //                       <label className="flex items-center gap-2 text-sm text-slate-700">
// //                         <input
// //                           type="checkbox"
// //                           checked={formData.allow_requester_cancel}
// //                           onChange={(e) =>
// //                             setField("allow_requester_cancel", e.target.checked)
// //                           }
// //                           className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// //                         />
// //                         Allow Cancel
// //                       </label>
// //                       <label className="flex items-center gap-2 text-sm text-slate-700">
// //                         <input
// //                           type="checkbox"
// //                           checked={formData.allow_comments}
// //                           onChange={(e) => setField("allow_comments", e.target.checked)}
// //                           className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// //                         />
// //                         Allow Comments
// //                       </label>
// //                     </div>

// //                     <div className="sm:col-span-2">
// //                       <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                         Description
// //                       </label>
// //                       <textarea
// //                         rows={2}
// //                         value={formData.description}
// //                         onChange={(e) => setField("description", e.target.value)}
// //                         placeholder="Optional description"
// //                         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                       />
// //                     </div>
// //                   </div>
// //                 </section>

// //                 {/* ─── SLA ─── */}
// //                 <section>
// //                   <h3 className="mb-3 text-sm font-semibold text-slate-800">
// //                     Default SLA Settings
// //                   </h3>
// //                   <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
// //                     <NumberField
// //                       label="SLA Hours"
// //                       value={formData.default_sla_hours}
// //                       onChange={(v) => setField("default_sla_hours", v)}
// //                       placeholder="48"
// //                     />
// //                     <NumberField
// //                       label="Reminder (hrs)"
// //                       value={formData.default_reminder_hours}
// //                       onChange={(v) => setField("default_reminder_hours", v)}
// //                       placeholder="24"
// //                     />
// //                     <NumberField
// //                       label="Escalate (hrs)"
// //                       value={formData.default_escalate_hours}
// //                       onChange={(v) => setField("default_escalate_hours", v)}
// //                       placeholder="72"
// //                     />
// //                     <NumberField
// //                       label="Max Reminders"
// //                       value={formData.max_reminders}
// //                       onChange={(v) => setField("max_reminders", v)}
// //                       placeholder="3"
// //                     />
// //                   </div>
// //                 </section>

// //                 {/* ─── LEVELS ─── */}
// //                 <section>
// //                   <div className="mb-3 flex items-center justify-between">
// //                     <div>
// //                       <h3 className="text-sm font-semibold text-slate-800">
// //                         Approval Levels ({formData.levels.length})
// //                       </h3>
// //                       <p className="text-xs text-slate-500">
// //                         Order matters — Level 1 first
// //                       </p>
// //                     </div>
// //                     <button
// //                       type="button"
// //                       onClick={addLevel}
// //                       className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
// //                     >
// //                       + Add Level
// //                     </button>
// //                   </div>

// //                   <div className="space-y-4">
// //                     {formData.levels.map((level, index) => (
// //                       <LevelCard
// //                         key={index}
// //                         level={level}
// //                         index={index}
// //                         totalLevels={formData.levels.length}
// //                         employees={employees}
// //                         onChange={(field, value) =>
// //                           setLevelField(index, field, value)
// //                         }
// //                         onRemove={() => removeLevel(index)}
// //                       />
// //                     ))}
// //                   </div>
// //                 </section>

// //                 {/* ─── CONDITIONS ─── */}
// //                 <section>
// //                   <div className="mb-3 flex items-center justify-between">
// //                     <div>
// //                       <h3 className="text-sm font-semibold text-slate-800">
// //                         Conditional Routing ({formData.conditions.length})
// //                       </h3>
// //                       <p className="text-xs text-slate-500">
// //                         Optional — skip or require levels dynamically
// //                       </p>
// //                     </div>
// //                     <button
// //                       type="button"
// //                       onClick={addCondition}
// //                       className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
// //                     >
// //                       + Add Condition
// //                     </button>
// //                   </div>

// //                   {formData.conditions.length === 0 ? (
// //                     <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-xs text-slate-500">
// //                       No conditions — all levels apply for every request.
// //                     </div>
// //                   ) : (
// //                     <div className="space-y-3">
// //                       {formData.conditions.map((cond, index) => (
// //                         <ConditionCard
// //                           key={index}
// //                           condition={cond}
// //                           index={index}
// //                           maxLevel={formData.levels.length}
// //                           onChange={(field, value) =>
// //                             setConditionField(index, field, value)
// //                           }
// //                           onRemove={() => removeCondition(index)}
// //                         />
// //                       ))}
// //                     </div>
// //                   )}
// //                 </section>

// //                 {error && (
// //                   <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
// //                     {error}
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
// //                 <button
// //                   type="button"
// //                   onClick={closeForm}
// //                   className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving…" : editingId ? "Update Workflow" : "Create Workflow"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* ═══════════════ VIEW MODAL ═══════════════ */}
// //       {viewing && (
// //         <WorkflowViewModal
// //           workflow={viewing}
// //           employees={employees}
// //           onClose={() => setViewing(null)}
// //           onEdit={() => {
// //             const wf = viewing;
// //             setViewing(null);
// //             openEdit(wf);
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // /* ═══════════════════════════════════════════════════════
// //    SUB-COMPONENTS
// //    ═══════════════════════════════════════════════════════ */

// // function NumberField({ label, value, onChange, placeholder }) {
// //   return (
// //     <div>
// //       <label className="mb-1.5 block text-xs font-medium text-slate-600">
// //         {label}
// //       </label>
// //       <input
// //         type="number"
// //         min="0"
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         placeholder={placeholder}
// //         className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// //       />
// //     </div>
// //   );
// // }

// // /* ──────────── LEVEL CARD ──────────── */
// // function LevelCard({ level, index, totalLevels, employees, onChange, onRemove }) {
// //   const [empSearch, setEmpSearch] = useState("");
// //   const [showEmpList, setShowEmpList] = useState(false);

// //   const isSpecific = level.approver_type === "specific_user";
// //   const isGroup = level.approver_type === "user_group";

// //   // Filtered employee list for search
// //   const filteredEmployees = useMemo(() => {
// //     if (!empSearch.trim()) return employees;
// //     const q = empSearch.toLowerCase();
// //     return employees.filter((e) => {
// //       const name = getEmpName(e).toLowerCase();
// //       const eid = getEmpId(e).toLowerCase();
// //       return name.includes(q) || eid.includes(q);
// //     });
// //   }, [employees, empSearch]);

// //   // For specific user — selected employee object
// //   const selectedEmployee = useMemo(
// //     () => employees.find((e) => getEmpUserId(e) === level.specific_user_id),
// //     [employees, level.specific_user_id]
// //   );

// //   // For user group — selected employee objects
// //   const selectedGroupEmployees = useMemo(() => {
// //     const ids = level.approver_group || [];
// //     return employees.filter((e) => ids.includes(getEmpUserId(e)));
// //   }, [employees, level.approver_group]);

// //   return (
// //     <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
// //       <div className="mb-3 flex items-center justify-between">
// //         <div className="flex items-center gap-2">
// //           <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white">
// //             {index + 1}
// //           </span>
// //           <span className="text-sm font-semibold text-slate-700">
// //             Level {index + 1}
// //           </span>
// //         </div>
// //         {totalLevels > 1 && (
// //           <button
// //             type="button"
// //             onClick={onRemove}
// //             className="text-xs font-medium text-red-600 hover:underline"
// //           >
// //             Remove
// //           </button>
// //         )}
// //       </div>

// //       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
// //         <div>
// //           <label className="mb-1 block text-xs font-medium text-slate-600">
// //             Level Name
// //           </label>
// //           <input
// //             value={level.name}
// //             onChange={(e) => onChange("name", e.target.value)}
// //             placeholder={`Level ${index + 1}`}
// //             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// //           />
// //         </div>

// //         <div>
// //           <label className="mb-1 block text-xs font-medium text-slate-600">
// //             Approver Type *
// //           </label>
// //           <select
// //             value={level.approver_type}
// //             onChange={(e) => {
// //               onChange("approver_type", e.target.value);
// //               onChange("specific_user_id", "");
// //               onChange("approver_group", []);
// //             }}
// //             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// //           >
// //             {APPROVER_TYPES.map((t) => (
// //               <option key={t.value} value={t.value}>
// //                 {t.label}
// //               </option>
// //             ))}
// //           </select>
// //           <p className="mt-1 text-[11px] text-slate-400">
// //             {APPROVER_TYPES.find((t) => t.value === level.approver_type)?.hint}
// //           </p>
// //         </div>

// //         {/* ───── SPECIFIC USER — SEARCHABLE DROPDOWN ───── */}
// //         {isSpecific && (
// //           <div className="sm:col-span-2">
// //             <label className="mb-1 block text-xs font-medium text-slate-600">
// //               Select Employee *
// //             </label>

// //             {/* Selected employee preview */}
// //             {selectedEmployee && (
// //               <div className="mb-2 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
// //                 <div>
// //                   <p className="text-sm font-medium text-emerald-900">
// //                     {getEmpName(selectedEmployee)}
// //                   </p>
// //                   <p className="text-xs text-emerald-700">
// //                     {getEmpId(selectedEmployee)}
// //                   </p>
// //                 </div>
// //                 <button
// //                   type="button"
// //                   onClick={() => onChange("specific_user_id", "")}
// //                   className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
// //                 >
// //                   Change
// //                 </button>
// //               </div>
// //             )}

// //             {!selectedEmployee && (
// //               <>
// //                 <div className="relative">
// //                   <input
// //                     value={empSearch}
// //                     onChange={(e) => setEmpSearch(e.target.value)}
// //                     onFocus={() => setShowEmpList(true)}
// //                     placeholder={`Search by name or employee ID (${
// //                       employees.length
// //                     } available)`}
// //                     className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// //                   />
// //                   {showEmpList && (
// //                     <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
// //                       {filteredEmployees.length === 0 ? (
// //                         <div className="px-3 py-4 text-center text-xs text-slate-500">
// //                           No employees match
// //                         </div>
// //                       ) : (
// //                         filteredEmployees.slice(0, 50).map((emp) => (
// //                           <button
// //                             key={getEmpId(emp)}
// //                             type="button"
// //                             onClick={() => {
// //                               onChange("specific_user_id", getEmpUserId(emp));
// //                               setEmpSearch("");
// //                               setShowEmpList(false);
// //                             }}
// //                             className="block w-full border-b border-slate-50 px-3 py-2 text-left text-sm hover:bg-slate-50"
// //                           >
// //                             <div className="font-medium text-slate-800">
// //                               {getEmpName(emp)}
// //                             </div>
// //                             <div className="text-xs text-slate-500">
// //                               {getEmpId(emp)}
// //                             </div>
// //                           </button>
// //                         ))
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //                 {showEmpList && (
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowEmpList(false)}
// //                     className="mt-1 text-xs text-slate-500 hover:text-slate-700"
// //                   >
// //                     Close list
// //                   </button>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         )}

// //         {/* ───── USER GROUP — MULTI-SELECT CHECKBOXES ───── */}
// //         {isGroup && (
// //           <div className="sm:col-span-2">
// //             <label className="mb-1 block text-xs font-medium text-slate-600">
// //               Select Approvers (any one can approve) *
// //             </label>

// //             {/* Selected preview */}
// //             {selectedGroupEmployees.length > 0 && (
// //               <div className="mb-2 flex flex-wrap gap-1.5">
// //                 {selectedGroupEmployees.map((emp) => (
// //                   <span
// //                     key={getEmpId(emp)}
// //                     className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
// //                   >
// //                     {getEmpName(emp)}
// //                     <button
// //                       type="button"
// //                       onClick={() =>
// //                         onChange(
// //                           "approver_group",
// //                           (level.approver_group || []).filter(
// //                             (id) => id !== getEmpUserId(emp)
// //                           )
// //                         )
// //                       }
// //                       className="text-blue-500 hover:text-blue-800"
// //                     >
// //                       ✕
// //                     </button>
// //                   </span>
// //                 ))}
// //               </div>
// //             )}

// //             <input
// //               value={empSearch}
// //               onChange={(e) => setEmpSearch(e.target.value)}
// //               placeholder={`Search by name or ID (${employees.length} available)`}
// //               className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// //             />

// //             <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white">
// //               {filteredEmployees.length === 0 ? (
// //                 <div className="px-3 py-6 text-center text-xs text-slate-500">
// //                   No employees match
// //                 </div>
// //               ) : (
// //                 filteredEmployees.map((emp) => {
// //                   const userId = getEmpUserId(emp);
// //                   const checked = (level.approver_group || []).includes(userId);
// //                   return (
// //                     <label
// //                       key={getEmpId(emp)}
// //                       className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-3 py-2 text-sm hover:bg-slate-50"
// //                     >
// //                       <input
// //                         type="checkbox"
// //                         checked={checked}
// //                         onChange={(e) => {
// //                           const current = level.approver_group || [];
// //                           const next = e.target.checked
// //                             ? [...current, userId]
// //                             : current.filter((id) => id !== userId);
// //                           onChange("approver_group", next);
// //                         }}
// //                         className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// //                       />
// //                       <div className="flex-1">
// //                         <div className="font-medium text-slate-800">
// //                           {getEmpName(emp)}
// //                         </div>
// //                         <div className="text-xs text-slate-500">
// //                           {getEmpId(emp)}
// //                         </div>
// //                       </div>
// //                     </label>
// //                   );
// //                 })
// //               )}
// //             </div>

// //             <p className="mt-1 text-[11px] text-slate-500">
// //               {selectedGroupEmployees.length} selected
// //             </p>
// //           </div>
// //         )}

// //         <NumberField
// //           label="SLA (hrs)"
// //           value={level.sla_hours}
// //           onChange={(v) => onChange("sla_hours", v)}
// //           placeholder="24"
// //         />
// //         <NumberField
// //           label="Reminder After (hrs)"
// //           value={level.reminder_after_hours}
// //           onChange={(v) => onChange("reminder_after_hours", v)}
// //           placeholder="12"
// //         />
// //         <NumberField
// //           label="Escalate After (hrs)"
// //           value={level.escalate_after_hours}
// //           onChange={(v) => onChange("escalate_after_hours", v)}
// //           placeholder="48"
// //         />
// //         <NumberField
// //           label="Auto Approve (hrs)"
// //           value={level.auto_approve_after_hours}
// //           onChange={(v) => onChange("auto_approve_after_hours", v)}
// //           placeholder="—"
// //         />

// //         <div className="flex flex-wrap gap-4 sm:col-span-2">
// //           <label className="flex items-center gap-2 text-xs text-slate-700">
// //             <input
// //               type="checkbox"
// //               checked={level.can_be_skipped}
// //               onChange={(e) => onChange("can_be_skipped", e.target.checked)}
// //               className="h-3.5 w-3.5 rounded border-slate-300 text-[#E42527]"
// //             />
// //             Can be skipped
// //           </label>
// //           <label className="flex items-center gap-2 text-xs text-slate-700">
// //             <input
// //               type="checkbox"
// //               checked={level.skip_if_no_approver}
// //               onChange={(e) => onChange("skip_if_no_approver", e.target.checked)}
// //               className="h-3.5 w-3.5 rounded border-slate-300 text-[#E42527]"
// //             />
// //             Skip if no approver
// //           </label>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ──────────── CONDITION CARD ──────────── */
// // function ConditionCard({ condition, index, maxLevel, onChange, onRemove }) {
// //   return (
// //     <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
// //       <div className="mb-3 flex items-center justify-between">
// //         <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
// //           Condition {index + 1}
// //         </span>
// //         <button
// //           type="button"
// //           onClick={onRemove}
// //           className="text-xs font-medium text-red-600 hover:underline"
// //         >
// //           Remove
// //         </button>
// //       </div>

// //       <div className="flex flex-wrap items-center gap-2 text-sm">
// //         <span className="text-slate-600">IF</span>

// //         <input
// //           value={condition.field_name}
// //           onChange={(e) => onChange("field_name", e.target.value)}
// //           placeholder="days_requested"
// //           list="common-fields"
// //           className="w-40 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// //         />
// //         <datalist id="common-fields">
// //           {COMMON_FIELDS.map((f) => (
// //             <option key={f} value={f} />
// //           ))}
// //         </datalist>

// //         <select
// //           value={condition.operator}
// //           onChange={(e) => onChange("operator", e.target.value)}
// //           className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// //         >
// //           {CONDITION_OPERATORS.map((o) => (
// //             <option key={o.value} value={o.value}>
// //               {o.label}
// //             </option>
// //           ))}
// //         </select>

// //         <input
// //           value={condition.value}
// //           onChange={(e) => onChange("value", e.target.value)}
// //           placeholder="5"
// //           className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// //         />

// //         <span className="text-slate-600">THEN</span>

// //         <select
// //           value={condition.action}
// //           onChange={(e) => onChange("action", e.target.value)}
// //           className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// //         >
// //           {CONDITION_ACTIONS.map((a) => (
// //             <option key={a.value} value={a.value}>
// //               {a.label}
// //             </option>
// //           ))}
// //         </select>

// //         {condition.action !== "reject_auto" && (
// //           <>
// //             <span className="text-slate-600">Level</span>
// //             <input
// //               type="number"
// //               min="1"
// //               max={maxLevel}
// //               value={condition.target_level}
// //               onChange={(e) => onChange("target_level", e.target.value)}
// //               className="w-16 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
// //             />
// //           </>
// //         )}
// //       </div>

// //       <p className="mt-2 text-[11px] text-slate-500">
// //         Example: IF days_requested &gt; 5 THEN require Level 2
// //       </p>
// //     </div>
// //   );
// // }

// // /* ──────────── VIEW MODAL ──────────── */
// // function WorkflowViewModal({ workflow, employees, onClose, onEdit }) {
// //   const levels = workflow.levels || [];
// //   const conditions = workflow.conditions || [];

// //   const empMap = useMemo(() => {
// //     const map = {};
// //     employees.forEach((e) => {
// //       map[getEmpUserId(e)] = e;
// //     });
// //     return map;
// //   }, [employees]);

// //   function renderApproverLabel(lvl) {
// //     if (lvl.approver_type === "specific_user" && lvl.specific_user_id) {
// //       const emp = empMap[lvl.specific_user_id];
// //       return emp ? getEmpName(emp) : lvl.specific_user_id;
// //     }
// //     if (
// //       lvl.approver_type === "user_group" &&
// //       Array.isArray(lvl.approver_group) &&
// //       lvl.approver_group.length > 0
// //     ) {
// //       return lvl.approver_group
// //         .map((id) => {
// //           const emp = empMap[id];
// //           return emp ? getEmpName(emp) : id;
// //         })
// //         .join(", ");
// //     }
// //     return null;
// //   }

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// //       <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// //           <div>
// //             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// //               Workflow
// //             </p>
// //             <h3 className="mt-1 text-lg font-semibold text-slate-900">
// //               {workflow.name}
// //             </h3>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
// //           <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
// //             <InfoBox label="Type" value={prettyType(workflow.approval_type)} />
// //             <InfoBox label="Version" value={`v${workflow.version ?? 1}`} />
// //             <InfoBox label="Status" value={workflow.is_active ? "Active" : "Inactive"} />
// //             <InfoBox label="SLA" value={`${workflow.default_sla_hours ?? "—"} hrs`} />
// //             <InfoBox
// //               label="Reminder"
// //               value={`${workflow.default_reminder_hours ?? "—"} hrs`}
// //             />
// //             <InfoBox
// //               label="Escalate"
// //               value={`${workflow.default_escalate_hours ?? "—"} hrs`}
// //             />
// //           </div>

// //           {workflow.description && (
// //             <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
// //               {workflow.description}
// //             </div>
// //           )}

// //           <div>
// //             <h4 className="mb-2 text-sm font-semibold text-slate-800">
// //               Levels ({levels.length})
// //             </h4>
// //             <div className="space-y-2">
// //               {levels.map((lvl, i) => {
// //                 const label = renderApproverLabel(lvl);
// //                 return (
// //                   <div
// //                     key={i}
// //                     className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
// //                   >
// //                     <div className="flex items-center justify-between">
// //                       <div className="flex items-center gap-2">
// //                         <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
// //                           {lvl.level}
// //                         </span>
// //                         <span className="font-medium text-slate-800">
// //                           {lvl.name || `Level ${lvl.level}`}
// //                         </span>
// //                       </div>
// //                       <span className="text-xs capitalize text-slate-500">
// //                         {prettyType(lvl.approver_type)}
// //                       </span>
// //                     </div>
// //                     {label && (
// //                       <p className="mt-1.5 pl-8 text-xs text-slate-600">
// //                         <span className="font-medium">Approver:</span> {label}
// //                       </p>
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {conditions.length > 0 && (
// //             <div>
// //               <h4 className="mb-2 text-sm font-semibold text-slate-800">
// //                 Conditions ({conditions.length})
// //               </h4>
// //               <div className="space-y-2">
// //                 {conditions.map((c, i) => (
// //                   <div
// //                     key={i}
// //                     className="rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-xs text-slate-700"
// //                   >
// //                     <span className="font-medium">IF</span>{" "}
// //                     <code className="rounded bg-white px-1.5 py-0.5">
// //                       {c.field_name}
// //                     </code>{" "}
// //                     <span className="text-slate-500">{c.operator}</span>{" "}
// //                     <code className="rounded bg-white px-1.5 py-0.5">
// //                       {String(c.value)}
// //                     </code>{" "}
// //                     <span className="font-medium">THEN</span>{" "}
// //                     <span className="text-slate-500">{c.action}</span>
// //                     {c.target_level && <> → Level {c.target_level}</>}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
// //           <button
// //             onClick={onClose}
// //             className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// //           >
// //             Close
// //           </button>
// //           <button
// //             onClick={onEdit}
// //             className="rounded-xl bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// //           >
// //             Edit
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function InfoBox({ label, value }) {
// //   return (
// //     <div className="rounded-xl bg-slate-50 px-3 py-2.5">
// //       <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
// //       <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
// //     </div>
// //   );
// // }

// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { api } from "@/app/lib/api";

// /* ═══════════════════════════════════════════════════════
//    ICONS (inline SVG — no extra deps)
//    ═══════════════════════════════════════════════════════ */

// const Icons = {
//   Workflow: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <rect x="3" y="3" width="6" height="6" rx="1" />
//       <rect x="15" y="3" width="6" height="6" rx="1" />
//       <rect x="9" y="15" width="6" height="6" rx="1" />
//       <path d="M6 9v3a3 3 0 003 3M18 9v3a3 3 0 01-3 3" />
//     </svg>
//   ),
//   Plus: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//       <path d="M12 5v14M5 12h14" strokeLinecap="round" />
//     </svg>
//   ),
//   Bolt: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="currentColor">
//       <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
//     </svg>
//   ),
//   Search: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <circle cx="11" cy="11" r="7" />
//       <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
//     </svg>
//   ),
//   X: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
//     </svg>
//   ),
//   Edit: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" />
//       <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" />
//     </svg>
//   ),
//   Eye: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//       <circle cx="12" cy="12" r="3" />
//     </svg>
//   ),
//   Trash: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" />
//     </svg>
//   ),
//   ChevronDown: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M6 9l6 6 6-6" strokeLinecap="round" />
//     </svg>
//   ),
//   Users: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
//       <circle cx="9" cy="7" r="4" />
//       <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
//     </svg>
//   ),
//   User: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" />
//       <circle cx="12" cy="7" r="4" />
//     </svg>
//   ),
//   Clock: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <circle cx="12" cy="12" r="10" />
//       <path d="M12 6v6l4 2" strokeLinecap="round" />
//     </svg>
//   ),
//   Filter: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" />
//     </svg>
//   ),
//   Check: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//       <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   ),
//   Sparkle: (p) => (
//     <svg {...p} viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2zM19 14l.75 2.75L22.5 18l-2.75.75L19 21.5l-.75-2.75L15.5 18l2.75-1.25L19 14z" />
//     </svg>
//   ),
// };

// /* ═══════════════════════════════════════════════════════
//    CONSTANTS
//    ═══════════════════════════════════════════════════════ */

// const APPROVAL_TYPES = [
//   { value: "leave", label: "Leave", color: "sky", icon: "🏖️" },
//   { value: "special_request", label: "WFH / On Duty", color: "violet", icon: "🏠" },
//   { value: "attendance", label: "Attendance", color: "amber", icon: "📅" },
//   { value: "overtime", label: "Overtime", color: "orange", icon: "⏰" },
//   { value: "comp_off", label: "Comp Off", color: "emerald", icon: "🎁" },
//   { value: "expense", label: "Expense", color: "rose", icon: "💳" },
//   { value: "loan", label: "Loan", color: "indigo", icon: "🏦" },
//   { value: "reimbursement", label: "Reimbursement", color: "teal", icon: "💰" },
//   { value: "letter", label: "Letter", color: "cyan", icon: "📄" },
//   { value: "payroll", label: "Payroll", color: "purple", icon: "💼" },
//   { value: "onboarding", label: "Onboarding", color: "pink", icon: "🚀" },
//   { value: "regularization", label: "Regularization", color: "lime", icon: "✅" },
//   { value: "resignation", label: "Resignation", color: "red", icon: "👋" },
//   { value: "fnf", label: "Full & Final", color: "slate", icon: "📋" },
// ];

// const getTypeMeta = (t) =>
//   APPROVAL_TYPES.find((x) => x.value === t) || {
//     label: String(t || "").replace(/_/g, " "),
//     color: "slate",
//     icon: "📌",
//   };

// const APPROVER_TYPES = [
//   { value: "reporting_manager", label: "Reporting Manager", hint: "Direct manager of employee" },
//   { value: "skip_level_manager", label: "Skip-Level Manager", hint: "Manager's manager" },
//   { value: "department_head", label: "Department Head", hint: "Department owner" },
//   { value: "specific_user", label: "Specific Person", hint: "Fixed employee from list" },
//   { value: "user_group", label: "Approver Group", hint: "Any one from selected" },
// ];

// const CONDITION_OPERATORS = [
//   { value: "eq", label: "is" },
//   { value: "neq", label: "is not" },
//   { value: "gt", label: "is greater than" },
//   { value: "gte", label: "is at least" },
//   { value: "lt", label: "is less than" },
//   { value: "lte", label: "is at most" },
//   { value: "in", label: "is in list" },
//   { value: "not_in", label: "is not in list" },
//   { value: "contains", label: "contains" },
// ];

// const CONDITION_ACTIONS = [
//   { value: "require_level", label: "Require level" },
//   { value: "skip_level", label: "Skip level" },
//   { value: "reject_auto", label: "Auto-reject" },
// ];

// const COMMON_FIELDS = [
//   "days_requested",
//   "amount",
//   "leave_type_id",
//   "request_type",
//   "employee_id",
//   "department_id",
// ];

// /* ═══════════════════════════════════════════════════════
//    HELPERS
//    ═══════════════════════════════════════════════════════ */

// const getErrorMessage = (err) => {
//   const d = err?.response?.data?.detail;
//   if (Array.isArray(d)) return d.map((x) => x.msg).join(" • ");
//   if (typeof d === "string") return d;
//   if (err?.code === "ERR_NETWORK") return "Network error";
//   if (err?.response?.status === 403) return "Admin access required";
//   return err?.message || "Something went wrong";
// };

// function extractEmployees(res) {
//   const body = res?.data ?? {};
//   const data = body?.data ?? body;
//   if (Array.isArray(data)) return data;
//   return data?.employees ?? data?.items ?? data?.results ?? [];
// }

// const getEmpId = (e) => e?.employee_id || e?.id || e?._id || "";
// const getEmpUserId = (e) => e?.user_id || e?.userId || "";
// const getEmpName = (e) =>
//   [e?.first_name, e?.last_name].filter(Boolean).join(" ").trim() ||
//   e?.name ||
//   e?.full_name ||
//   getEmpId(e) ||
//   "Employee";

// const initials = (name) =>
//   String(name || "")
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase() || "?";

// /* ═══════════════════════════════════════════════════════
//    FORM DEFAULTS
//    ═══════════════════════════════════════════════════════ */

// const makeEmptyLevel = (n = 1) => ({
//   level: n,
//   name: "",
//   description: "",
//   approver_type: "reporting_manager",
//   specific_user_id: "",
//   specific_role: "",
//   approver_group: [],
//   sla_hours: 24,
//   reminder_after_hours: 12,
//   escalate_after_hours: 48,
//   escalate_to_user_id: "",
//   escalate_to_role: "",
//   auto_approve_after_hours: "",
//   can_be_skipped: true,
//   skip_if_no_approver: true,
// });

// const makeEmptyCondition = () => ({
//   field_name: "days_requested",
//   operator: "gt",
//   value: 5,
//   action: "require_level",
//   target_level: 2,
//   priority: 100,
// });

// const initialForm = {
//   name: "",
//   approval_type: "leave",
//   description: "",
//   allow_requester_cancel: true,
//   allow_comments: true,
//   default_sla_hours: 48,
//   default_reminder_hours: 24,
//   default_escalate_hours: 72,
//   max_reminders: 3,
//   is_active: true,
//   levels: [makeEmptyLevel(1)],
//   conditions: [],
// };

// /* ═══════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ═══════════════════════════════════════════════════════ */

// export default function WorkflowsPage() {
//   const [workflows, setWorkflows] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [quickSetupLoading, setQuickSetupLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [toast, setToast] = useState(null);

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState(initialForm);
//   const [viewing, setViewing] = useState(null);

//   /* ---------- Toast ---------- */
//   const showToast = useCallback((type, message) => {
//     setToast({ type, message });
//     setTimeout(() => setToast(null), 4000);
//   }, []);

//   /* ---------- Fetch ---------- */
//   const fetchWorkflows = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/v1/approvals/workflows");
//       setWorkflows(Array.isArray(res?.data) ? res.data : []);
//     } catch (err) {
//       showToast("error", getErrorMessage(err));
//       setWorkflows([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [showToast]);

//   const fetchEmployees = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/employees", {
//         params: { page: 1, page_size: 1000 },
//       });
//       const list = extractEmployees(res).filter((e) => getEmpUserId(e));
//       setEmployees(list);
//     } catch {
//       setEmployees([]);
//     }
//   }, []);

//   useEffect(() => {
//     fetchWorkflows();
//     fetchEmployees();
//   }, [fetchWorkflows, fetchEmployees]);

//   /* ---------- Stats ---------- */
//   const stats = useMemo(() => {
//     const total = workflows.length;
//     const active = workflows.filter((w) => w.is_active).length;
//     const withConditions = workflows.filter((w) => w.conditions_count > 0).length;
//     return { total, active, inactive: total - active, withConditions };
//   }, [workflows]);

//   /* ---------- Filtered list ---------- */
//   const filtered = useMemo(() => {
//     let list = workflows;
//     if (typeFilter !== "all") list = list.filter((w) => w.approval_type === typeFilter);
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       list = list.filter(
//         (w) =>
//           (w.name || "").toLowerCase().includes(q) ||
//           (w.approval_type || "").toLowerCase().includes(q)
//       );
//     }
//     return list;
//   }, [workflows, typeFilter, search]);

//   /* ---------- Quick setup ---------- */
//   const handleQuickSetup = async () => {
//     if (
//       !window.confirm(
//         "Create 5 default workflows in 1 click?\n\n" +
//           "• Leave (2-level with condition)\n" +
//           "• Attendance\n" +
//           "• Overtime\n" +
//           "• WFH / On Duty\n" +
//           "• Comp Off\n\n" +
//           "Existing active ones will be skipped."
//       )
//     )
//       return;

//     setQuickSetupLoading(true);
//     try {
//       const res = await api.post("/api/v1/approvals/workflows/quick-setup", {});
//       const d = res?.data ?? {};
//       showToast(
//         "success",
//         `✓ ${d.created_count ?? 0} created, ${d.skipped_count ?? 0} skipped`
//       );
//       await fetchWorkflows();
//     } catch (err) {
//       showToast("error", getErrorMessage(err));
//     } finally {
//       setQuickSetupLoading(false);
//     }
//   };

//   /* ---------- Form open ---------- */
//   const openCreate = () => {
//     setFormData({ ...initialForm, levels: [makeEmptyLevel(1)], conditions: [] });
//     setEditingId(null);
//     setShowForm(true);
//   };

//   const openEdit = async (wf) => {
//     try {
//       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
//       const d = res?.data ?? wf;
//       setFormData({
//         name: d.name || "",
//         approval_type: d.approval_type || "leave",
//         description: d.description || "",
//         allow_requester_cancel: d.allow_requester_cancel ?? true,
//         allow_comments: d.allow_comments ?? true,
//         default_sla_hours: d.default_sla_hours ?? 48,
//         default_reminder_hours: d.default_reminder_hours ?? 24,
//         default_escalate_hours: d.default_escalate_hours ?? 72,
//         max_reminders: d.max_reminders ?? 3,
//         is_active: d.is_active ?? true,
//         levels:
//           d.levels?.length > 0
//             ? d.levels.map((l) => ({
//                 level: l.level,
//                 name: l.name || "",
//                 description: l.description || "",
//                 approver_type: l.approver_type || "reporting_manager",
//                 specific_user_id: l.specific_user_id || "",
//                 specific_role: l.specific_role || "",
//                 approver_group: l.approver_group || [],
//                 sla_hours: l.sla_hours ?? 24,
//                 reminder_after_hours: l.reminder_after_hours ?? 12,
//                 escalate_after_hours: l.escalate_after_hours ?? 48,
//                 escalate_to_user_id: l.escalate_to_user_id || "",
//                 escalate_to_role: l.escalate_to_role || "",
//                 auto_approve_after_hours: l.auto_approve_after_hours ?? "",
//                 can_be_skipped: l.can_be_skipped ?? true,
//                 skip_if_no_approver: l.skip_if_no_approver ?? true,
//               }))
//             : [makeEmptyLevel(1)],
//         conditions:
//           d.conditions?.length > 0
//             ? d.conditions.map((c) => ({
//                 field_name: c.field_name || "days_requested",
//                 operator: c.operator || "gt",
//                 value: c.value ?? 5,
//                 action: c.action || "require_level",
//                 target_level: c.target_level || 2,
//                 priority: c.priority ?? 100,
//               }))
//             : [],
//       });
//       setEditingId(wf.workflow_id);
//       setShowForm(true);
//     } catch (err) {
//       showToast("error", getErrorMessage(err));
//     }
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setEditingId(null);
//     setFormData(initialForm);
//   };

//   /* ---------- Field handlers ---------- */
//   const setField = (f, v) => setFormData((p) => ({ ...p, [f]: v }));

//   const setLevelField = (i, f, v) =>
//     setFormData((p) => {
//       const levels = [...p.levels];
//       levels[i] = { ...levels[i], [f]: v };
//       return { ...p, levels };
//     });

//   const setConditionField = (i, f, v) =>
//     setFormData((p) => {
//       const conditions = [...p.conditions];
//       conditions[i] = { ...conditions[i], [f]: v };
//       return { ...p, conditions };
//     });

//   const addLevel = () =>
//     setFormData((p) => ({
//       ...p,
//       levels: [...p.levels, makeEmptyLevel(p.levels.length + 1)],
//     }));

//   const removeLevel = (i) => {
//     if (formData.levels.length <= 1) return;
//     setFormData((p) => ({
//       ...p,
//       levels: p.levels.filter((_, idx) => idx !== i).map((l, idx) => ({ ...l, level: idx + 1 })),
//     }));
//   };

//   const moveLevel = (i, dir) => {
//     setFormData((p) => {
//       const levels = [...p.levels];
//       const j = dir === "up" ? i - 1 : i + 1;
//       if (j < 0 || j >= levels.length) return p;
//       [levels[i], levels[j]] = [levels[j], levels[i]];
//       return { ...p, levels: levels.map((l, idx) => ({ ...l, level: idx + 1 })) };
//     });
//   };

//   const addCondition = () =>
//     setFormData((p) => ({ ...p, conditions: [...p.conditions, makeEmptyCondition()] }));

//   const removeCondition = (i) =>
//     setFormData((p) => ({ ...p, conditions: p.conditions.filter((_, idx) => idx !== i) }));

//   /* ---------- Submit ---------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       showToast("error", "Workflow name is required");
//       return;
//     }
//     for (let i = 0; i < formData.levels.length; i++) {
//       const l = formData.levels[i];
//       if (l.approver_type === "specific_user" && !l.specific_user_id) {
//         showToast("error", `Level ${i + 1}: select an employee`);
//         return;
//       }
//       if (l.approver_type === "user_group" && (!l.approver_group || l.approver_group.length === 0)) {
//         showToast("error", `Level ${i + 1}: select at least one employee`);
//         return;
//       }
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         name: formData.name.trim(),
//         approval_type: formData.approval_type,
//         description: formData.description?.trim() || null,
//         allow_requester_cancel: formData.allow_requester_cancel,
//         allow_comments: formData.allow_comments,
//         default_sla_hours: formData.default_sla_hours ? Number(formData.default_sla_hours) : null,
//         default_reminder_hours: formData.default_reminder_hours
//           ? Number(formData.default_reminder_hours)
//           : null,
//         default_escalate_hours: formData.default_escalate_hours
//           ? Number(formData.default_escalate_hours)
//           : null,
//         max_reminders: Number(formData.max_reminders) || 3,
//         is_active: formData.is_active,
//         levels: formData.levels.map((l, idx) => ({
//           level: idx + 1,
//           name: l.name?.trim() || `Level ${idx + 1}`,
//           description: l.description?.trim() || null,
//           approver_type: l.approver_type,
//           specific_user_id: l.approver_type === "specific_user" ? l.specific_user_id : null,
//           specific_role: l.specific_role || null,
//           approver_group: l.approver_type === "user_group" ? l.approver_group : null,
//           sla_hours: l.sla_hours ? Number(l.sla_hours) : null,
//           reminder_after_hours: l.reminder_after_hours ? Number(l.reminder_after_hours) : null,
//           escalate_after_hours: l.escalate_after_hours ? Number(l.escalate_after_hours) : null,
//           escalate_to_user_id: l.escalate_to_user_id || null,
//           escalate_to_role: l.escalate_to_role || null,
//           auto_approve_after_hours: l.auto_approve_after_hours
//             ? Number(l.auto_approve_after_hours)
//             : null,
//           can_be_skipped: !!l.can_be_skipped,
//           skip_if_no_approver: !!l.skip_if_no_approver,
//         })),
//         conditions: formData.conditions.map((c) => ({
//           field_name: c.field_name,
//           operator: c.operator,
//           value: c.value,
//           action: c.action,
//           target_level: c.target_level ? Number(c.target_level) : null,
//           priority: Number(c.priority) || 100,
//         })),
//       };

//       if (editingId) {
//         await api.put(`/api/v1/approvals/workflows/${editingId}`, payload);
//         showToast("success", "Workflow updated");
//       } else {
//         await api.post("/api/v1/approvals/workflows", payload);
//         showToast("success", "Workflow created");
//       }

//       closeForm();
//       await fetchWorkflows();
//     } catch (err) {
//       showToast("error", getErrorMessage(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const openView = async (wf) => {
//     try {
//       const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
//       setViewing(res?.data ?? wf);
//     } catch {
//       setViewing(wf);
//     }
//   };

//   /* ═══════════════════════════════════════════════════════
//      RENDER
//      ═══════════════════════════════════════════════════════ */

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       {/* ─── HEADER ─── */}
//       <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
//         <div className="mx-auto max-w-[1400px] px-6 py-6">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E42527] to-[#c91f21] text-white shadow-lg shadow-red-200">
//                   <Icons.Workflow className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//                     Approval Workflows
//                   </h1>
//                   <p className="text-sm text-slate-500">
//                     Design multi-level approval chains with conditional routing
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <button
//                 type="button"
//                 onClick={handleQuickSetup}
//                 disabled={quickSetupLoading}
//                 className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-sm transition hover:shadow-md hover:border-amber-300 disabled:opacity-60"
//               >
//                 <Icons.Bolt className="h-4 w-4 text-amber-600" />
//                 {quickSetupLoading ? "Setting up…" : "Quick Setup"}
//               </button>
//               <button
//                 type="button"
//                 onClick={openCreate}
//                 className="inline-flex items-center gap-2 rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition hover:bg-[#c91f21] hover:shadow-lg"
//               >
//                 <Icons.Plus className="h-4 w-4" />
//                 Create Workflow
//               </button>
//             </div>
//           </div>

//           {/* Stats strip */}
//           <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
//             <StatCard label="Total Workflows" value={stats.total} tone="slate" />
//             <StatCard label="Active" value={stats.active} tone="emerald" />
//             <StatCard label="Inactive" value={stats.inactive} tone="slate" />
//             <StatCard label="With Conditions" value={stats.withConditions} tone="sky" />
//           </div>
//         </div>
//       </div>

//       {/* ─── FILTERS ─── */}
//       <div className="mx-auto max-w-[1400px] px-6 py-5">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//           <div className="relative flex-1 max-w-md">
//             <Icons.Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search workflows..."
//               className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <Icons.Filter className="h-4 w-4 text-slate-400" />
//             <select
//               value={typeFilter}
//               onChange={(e) => setTypeFilter(e.target.value)}
//               className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-[#E42527]"
//             >
//               <option value="all">All Types</option>
//               {APPROVAL_TYPES.map((t) => (
//                 <option key={t.value} value={t.value}>
//                   {t.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* ─── LIST ─── */}
//       <div className="mx-auto max-w-[1400px] px-6 pb-12">
//         {loading ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div
//                 key={i}
//                 className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white"
//               />
//             ))}
//           </div>
//         ) : filtered.length === 0 ? (
//           <EmptyState
//             hasAny={workflows.length > 0}
//             onQuickSetup={handleQuickSetup}
//             onCreate={openCreate}
//             quickSetupLoading={quickSetupLoading}
//           />
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {filtered.map((wf) => (
//               <WorkflowCard
//                 key={wf.workflow_id}
//                 workflow={wf}
//                 onView={() => openView(wf)}
//                 onEdit={() => openEdit(wf)}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ─── TOAST ─── */}
//       {toast && (
//         <div
//           className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl ${
//             toast.type === "success"
//               ? "bg-emerald-600 text-white"
//               : "bg-red-600 text-white"
//           }`}
//         >
//           {toast.type === "success" ? (
//             <Icons.Check className="h-4 w-4" />
//           ) : (
//             <Icons.X className="h-4 w-4" />
//           )}
//           <span className="text-sm font-medium">{toast.message}</span>
//         </div>
//       )}

//       {/* ─── MODALS ─── */}
//       {showForm && (
//         <WorkflowFormModal
//           formData={formData}
//           setField={setField}
//           setLevelField={setLevelField}
//           setConditionField={setConditionField}
//           addLevel={addLevel}
//           removeLevel={removeLevel}
//           moveLevel={moveLevel}
//           addCondition={addCondition}
//           removeCondition={removeCondition}
//           employees={employees}
//           editingId={editingId}
//           saving={saving}
//           onSubmit={handleSubmit}
//           onClose={closeForm}
//         />
//       )}

//       {viewing && (
//         <WorkflowViewModal
//           workflow={viewing}
//           employees={employees}
//           onClose={() => setViewing(null)}
//           onEdit={() => {
//             const wf = viewing;
//             setViewing(null);
//             openEdit(wf);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════
//    SUB-COMPONENTS
//    ═══════════════════════════════════════════════════════ */

// const TONE_MAP = {
//   slate: "bg-slate-50 border-slate-200 text-slate-700",
//   emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
//   sky: "bg-sky-50 border-sky-200 text-sky-700",
//   amber: "bg-amber-50 border-amber-200 text-amber-700",
//   violet: "bg-violet-50 border-violet-200 text-violet-700",
//   rose: "bg-rose-50 border-rose-200 text-rose-700",
//   indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
//   teal: "bg-teal-50 border-teal-200 text-teal-700",
//   orange: "bg-orange-50 border-orange-200 text-orange-700",
//   cyan: "bg-cyan-50 border-cyan-200 text-cyan-700",
//   purple: "bg-purple-50 border-purple-200 text-purple-700",
//   pink: "bg-pink-50 border-pink-200 text-pink-700",
//   lime: "bg-lime-50 border-lime-200 text-lime-700",
//   red: "bg-red-50 border-red-200 text-red-700",
// };

// const TYPE_BADGE_COLOR = {
//   leave: "bg-sky-50 text-sky-700 border-sky-200",
//   special_request: "bg-violet-50 text-violet-700 border-violet-200",
//   attendance: "bg-amber-50 text-amber-700 border-amber-200",
//   overtime: "bg-orange-50 text-orange-700 border-orange-200",
//   comp_off: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   expense: "bg-rose-50 text-rose-700 border-rose-200",
//   loan: "bg-indigo-50 text-indigo-700 border-indigo-200",
// };

// function StatCard({ label, value, tone }) {
//   return (
//     <div className={`rounded-2xl border px-4 py-3 ${TONE_MAP[tone] || TONE_MAP.slate}`}>
//       <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
//         {label}
//       </p>
//       <p className="mt-1 text-2xl font-bold">{value}</p>
//     </div>
//   );
// }

// function WorkflowCard({ workflow, onView, onEdit }) {
//   const meta = getTypeMeta(workflow.approval_type);
//   const typeColor = TYPE_BADGE_COLOR[workflow.approval_type] || "bg-slate-50 text-slate-700 border-slate-200";

//   return (
//     <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg hover:border-slate-300">
//       {/* Active stripe */}
//       <div
//         className={`absolute left-0 top-0 h-full w-1 ${
//           workflow.is_active ? "bg-emerald-500" : "bg-slate-300"
//         }`}
//       />

//       <div className="flex items-start justify-between gap-3">
//         <div className="flex items-start gap-3 min-w-0 flex-1">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">
//             {meta.icon}
//           </div>
//           <div className="min-w-0 flex-1">
//             <h3 className="truncate text-sm font-semibold text-slate-900">
//               {workflow.name}
//             </h3>
//             <span
//               className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${typeColor}`}
//             >
//               {meta.label}
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
//           <button
//             onClick={onView}
//             className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
//             title="View"
//           >
//             <Icons.Eye className="h-4 w-4" />
//           </button>
//           <button
//             onClick={onEdit}
//             className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
//             title="Edit"
//           >
//             <Icons.Edit className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-3 gap-2">
//         <MiniStat icon={<Icons.Users className="h-3.5 w-3.5" />} label="Levels" value={workflow.levels_count ?? 0} />
//         <MiniStat
//           icon={<Icons.Sparkle className="h-3.5 w-3.5" />}
//           label="Rules"
//           value={workflow.conditions_count ?? 0}
//         />
//         <MiniStat icon={<Icons.Clock className="h-3.5 w-3.5" />} label="Version" value={`v${workflow.version ?? 1}`} />
//       </div>

//       <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
//         <span
//           className={`inline-flex items-center gap-1.5 text-xs font-medium ${
//             workflow.is_active ? "text-emerald-600" : "text-slate-400"
//           }`}
//         >
//           <span
//             className={`h-1.5 w-1.5 rounded-full ${
//               workflow.is_active ? "bg-emerald-500" : "bg-slate-300"
//             }`}
//           />
//           {workflow.is_active ? "Active" : "Inactive"}
//         </span>
//         <button
//           onClick={onView}
//           className="text-xs font-semibold text-[#E42527] hover:underline"
//         >
//           View details →
//         </button>
//       </div>
//     </div>
//   );
// }

// function MiniStat({ icon, label, value }) {
//   return (
//     <div className="rounded-lg bg-slate-50 px-2 py-2">
//       <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
//         {icon}
//         <span>{label}</span>
//       </div>
//       <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
//     </div>
//   );
// }

// function EmptyState({ hasAny, onQuickSetup, onCreate, quickSetupLoading }) {
//   return (
//     <div className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-b from-white to-slate-50 px-8 py-20 text-center">
//       <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#E42527]/10 to-[#E42527]/20">
//         <Icons.Workflow className="h-8 w-8 text-[#E42527]" />
//       </div>
//       <h3 className="mt-5 text-lg font-semibold text-slate-900">
//         {hasAny ? "No workflows match your filter" : "No workflows yet"}
//       </h3>
//       <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//         {hasAny
//           ? "Try clearing the search or selecting a different type."
//           : "Get started with 5 pre-built workflows in one click, or build your own from scratch."}
//       </p>

//       {!hasAny && (
//         <div className="mt-7 flex flex-wrap justify-center gap-3">
//           <button
//             onClick={onQuickSetup}
//             disabled={quickSetupLoading}
//             className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-amber-100 px-5 py-3 text-sm font-semibold text-amber-800 shadow-sm hover:shadow-md disabled:opacity-60"
//           >
//             <Icons.Bolt className="h-4 w-4" />
//             {quickSetupLoading ? "Setting up…" : "Quick Setup"}
//           </button>
//           <button
//             onClick={onCreate}
//             className="inline-flex items-center gap-2 rounded-xl bg-[#E42527] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-200 hover:bg-[#c91f21]"
//           >
//             <Icons.Plus className="h-4 w-4" />
//             Create Workflow
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════
//    FORM MODAL
//    ═══════════════════════════════════════════════════════ */

// function WorkflowFormModal({
//   formData,
//   setField,
//   setLevelField,
//   setConditionField,
//   addLevel,
//   removeLevel,
//   moveLevel,
//   addCondition,
//   removeCondition,
//   employees,
//   editingId,
//   saving,
//   onSubmit,
//   onClose,
// }) {
//   const activeType = getTypeMeta(formData.approval_type);

//   return (
//     <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-6 backdrop-blur-sm">
//       <div className="mb-12 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="relative border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
//           <div className="flex items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-200">
//               {activeType.icon}
//             </div>
//             <div className="flex-1">
//               <h2 className="text-lg font-bold text-slate-900">
//                 {editingId ? "Edit Workflow" : "Create Workflow"}
//               </h2>
//               <p className="text-sm text-slate-500">
//                 {editingId
//                   ? "Update this approval chain"
//                   : "Design a new multi-level approval chain"}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//             >
//               <Icons.X className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={onSubmit}>
//           <div className="max-h-[72vh] space-y-8 overflow-y-auto px-6 py-6">
//             {/* SECTION 1: Basic */}
//             <FormSection number="1" title="Basic details" subtitle="Name and type of workflow">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div className="sm:col-span-2">
//                   <FieldLabel>Workflow Name *</FieldLabel>
//                   <input
//                     required
//                     value={formData.name}
//                     onChange={(e) => setField("name", e.target.value)}
//                     placeholder="e.g. Leave Approval - Standard"
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
//                   />
//                 </div>

//                 <div>
//                   <FieldLabel>Approval Type *</FieldLabel>
//                   <select
//                     value={formData.approval_type}
//                     onChange={(e) => setField("approval_type", e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   >
//                     {APPROVAL_TYPES.map((t) => (
//                       <option key={t.value} value={t.value}>
//                         {t.icon}  {t.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex items-center gap-5 pt-7">
//                   <TogglePill
//                     checked={formData.is_active}
//                     onChange={(v) => setField("is_active", v)}
//                     label="Active"
//                   />
//                   <TogglePill
//                     checked={formData.allow_requester_cancel}
//                     onChange={(v) => setField("allow_requester_cancel", v)}
//                     label="Allow Cancel"
//                   />
//                   <TogglePill
//                     checked={formData.allow_comments}
//                     onChange={(v) => setField("allow_comments", v)}
//                     label="Comments"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <FieldLabel>Description</FieldLabel>
//                   <textarea
//                     rows={2}
//                     value={formData.description}
//                     onChange={(e) => setField("description", e.target.value)}
//                     placeholder="Optional note for HR / admin"
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
//                 </div>
//               </div>
//             </FormSection>

//             {/* SECTION 2: SLA */}
//             <FormSection
//               number="2"
//               title="SLA defaults"
//               subtitle="Applied to levels that don't override"
//             >
//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 <NumberInput
//                   label="SLA (hrs)"
//                   value={formData.default_sla_hours}
//                   onChange={(v) => setField("default_sla_hours", v)}
//                   placeholder="48"
//                 />
//                 <NumberInput
//                   label="Reminder (hrs)"
//                   value={formData.default_reminder_hours}
//                   onChange={(v) => setField("default_reminder_hours", v)}
//                   placeholder="24"
//                 />
//                 <NumberInput
//                   label="Escalate (hrs)"
//                   value={formData.default_escalate_hours}
//                   onChange={(v) => setField("default_escalate_hours", v)}
//                   placeholder="72"
//                 />
//                 <NumberInput
//                   label="Max reminders"
//                   value={formData.max_reminders}
//                   onChange={(v) => setField("max_reminders", v)}
//                   placeholder="3"
//                 />
//               </div>
//             </FormSection>

//             {/* SECTION 3: Levels */}
//             <FormSection
//               number="3"
//               title={`Approval Levels (${formData.levels.length})`}
//               subtitle="Ordered chain — Level 1 first"
//               action={
//                 <button
//                   type="button"
//                   onClick={addLevel}
//                   className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
//                 >
//                   <Icons.Plus className="h-3 w-3" />
//                   Add Level
//                 </button>
//               }
//             >
//               <div className="space-y-4">
//                 {formData.levels.map((level, i) => (
//                   <LevelCard
//                     key={i}
//                     level={level}
//                     index={i}
//                     totalLevels={formData.levels.length}
//                     employees={employees}
//                     onChange={(f, v) => setLevelField(i, f, v)}
//                     onRemove={() => removeLevel(i)}
//                     onMoveUp={() => moveLevel(i, "up")}
//                     onMoveDown={() => moveLevel(i, "down")}
//                   />
//                 ))}
//               </div>
//             </FormSection>

//             {/* SECTION 4: Conditions */}
//             <FormSection
//               number="4"
//               title={`Conditional Routing (${formData.conditions.length})`}
//               subtitle="Optional — auto-skip or require levels based on request"
//               action={
//                 <button
//                   type="button"
//                   onClick={addCondition}
//                   className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
//                 >
//                   <Icons.Plus className="h-3 w-3" />
//                   Add Rule
//                 </button>
//               }
//             >
//               {formData.conditions.length === 0 ? (
//                 <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-8 text-center">
//                   <p className="text-sm text-slate-500">
//                     No conditions — all levels apply to every request.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {formData.conditions.map((c, i) => (
//                     <ConditionCard
//                       key={i}
//                       condition={c}
//                       index={i}
//                       maxLevel={formData.levels.length}
//                       onChange={(f, v) => setConditionField(i, f, v)}
//                       onRemove={() => removeCondition(i)}
//                     />
//                   ))}
//                 </div>
//               )}
//             </FormSection>
//           </div>

//           <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4">
//             <p className="text-xs text-slate-500">
//               {editingId ? "Updating creates a new version" : "New workflow will be version 1"}
//             </p>
//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition hover:bg-[#c91f21] disabled:opacity-60"
//               >
//                 {saving ? "Saving…" : editingId ? "Update Workflow" : "Create Workflow"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function FormSection({ number, title, subtitle, action, children }) {
//   return (
//     <section>
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
//             {number}
//           </span>
//           <div>
//             <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
//             {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
//           </div>
//         </div>
//         {action}
//       </div>
//       {children}
//     </section>
//   );
// }

// function FieldLabel({ children }) {
//   return (
//     <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
//       {children}
//     </label>
//   );
// }

// function NumberInput({ label, value, onChange, placeholder }) {
//   return (
//     <div>
//       <FieldLabel>{label}</FieldLabel>
//       <input
//         type="number"
//         min="0"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//       />
//     </div>
//   );
// }

// function TogglePill({ checked, onChange, label }) {
//   return (
//     <label className="inline-flex cursor-pointer items-center gap-2">
//       <button
//         type="button"
//         onClick={() => onChange(!checked)}
//         className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
//           checked ? "bg-[#E42527]" : "bg-slate-300"
//         }`}
//       >
//         <span
//           className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition ${
//             checked ? "translate-x-4.5" : "translate-x-1"
//           }`}
//           style={{ transform: checked ? "translateX(18px)" : "translateX(4px)" }}
//         />
//       </button>
//       <span className="text-xs font-medium text-slate-600">{label}</span>
//     </label>
//   );
// }

// /* ──────── LEVEL CARD ──────── */
// function LevelCard({ level, index, totalLevels, employees, onChange, onRemove, onMoveUp, onMoveDown }) {
//   const [empSearch, setEmpSearch] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   const isSpecific = level.approver_type === "specific_user";
//   const isGroup = level.approver_type === "user_group";

//   const filteredEmployees = useMemo(() => {
//     if (!empSearch.trim()) return employees;
//     const q = empSearch.toLowerCase();
//     return employees.filter(
//       (e) => getEmpName(e).toLowerCase().includes(q) || getEmpId(e).toLowerCase().includes(q)
//     );
//   }, [employees, empSearch]);

//   const selectedEmployee = useMemo(
//     () => employees.find((e) => getEmpUserId(e) === level.specific_user_id),
//     [employees, level.specific_user_id]
//   );

//   const selectedGroup = useMemo(() => {
//     const ids = level.approver_group || [];
//     return employees.filter((e) => ids.includes(getEmpUserId(e)));
//   }, [employees, level.approver_group]);

//   const approverMeta = APPROVER_TYPES.find((a) => a.value === level.approver_type);

//   return (
//     <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-5 shadow-sm">
//       {/* Numbered badge */}
//       <div className="absolute -left-px -top-px flex h-8 items-center gap-2 rounded-br-2xl rounded-tl-2xl bg-[#E42527] px-3 text-xs font-bold text-white shadow-md">
//         <span>Level {index + 1}</span>
//       </div>

//       <div className="absolute right-3 top-3 flex items-center gap-1">
//         {totalLevels > 1 && (
//           <>
//             <button
//               type="button"
//               onClick={onMoveUp}
//               disabled={index === 0}
//               className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
//               title="Move up"
//             >
//               <Icons.ChevronDown className="h-3.5 w-3.5 rotate-180" />
//             </button>
//             <button
//               type="button"
//               onClick={onMoveDown}
//               disabled={index === totalLevels - 1}
//               className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
//               title="Move down"
//             >
//               <Icons.ChevronDown className="h-3.5 w-3.5" />
//             </button>
//             <button
//               type="button"
//               onClick={onRemove}
//               className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
//               title="Remove level"
//             >
//               <Icons.Trash className="h-3.5 w-3.5" />
//             </button>
//           </>
//         )}
//       </div>

//       <div className="mt-5 space-y-4">
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div>
//             <FieldLabel>Level Name</FieldLabel>
//             <input
//               value={level.name}
//               onChange={(e) => onChange("name", e.target.value)}
//               placeholder={`Level ${index + 1}`}
//               className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//             />
//           </div>
//           <div>
//             <FieldLabel>Approver Type *</FieldLabel>
//             <select
//               value={level.approver_type}
//               onChange={(e) => {
//                 onChange("approver_type", e.target.value);
//                 onChange("specific_user_id", "");
//                 onChange("approver_group", []);
//               }}
//               className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//             >
//               {APPROVER_TYPES.map((t) => (
//                 <option key={t.value} value={t.value}>
//                   {t.label}
//                 </option>
//               ))}
//             </select>
//             <p className="mt-1 text-[11px] text-slate-500">{approverMeta?.hint}</p>
//           </div>
//         </div>

//         {/* SPECIFIC USER */}
//         {isSpecific && (
//           <div>
//             <FieldLabel>Select Person *</FieldLabel>
//             {selectedEmployee ? (
//               <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
//                 <div className="flex items-center gap-3">
//                   <Avatar name={getEmpName(selectedEmployee)} />
//                   <div>
//                     <p className="text-sm font-semibold text-emerald-900">
//                       {getEmpName(selectedEmployee)}
//                     </p>
//                     <p className="text-xs text-emerald-700">{getEmpId(selectedEmployee)}</p>
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => onChange("specific_user_id", "")}
//                   className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
//                 >
//                   Change
//                 </button>
//               </div>
//             ) : (
//               <EmployeePicker
//                 employees={filteredEmployees}
//                 search={empSearch}
//                 setSearch={setEmpSearch}
//                 open={showDropdown}
//                 setOpen={setShowDropdown}
//                 totalCount={employees.length}
//                 onPick={(emp) => {
//                   onChange("specific_user_id", getEmpUserId(emp));
//                   setEmpSearch("");
//                   setShowDropdown(false);
//                 }}
//               />
//             )}
//           </div>
//         )}

//         {/* USER GROUP */}
//         {isGroup && (
//           <div>
//             <FieldLabel>Approver Group (any one can approve) *</FieldLabel>
//             {selectedGroup.length > 0 && (
//               <div className="mb-2 flex flex-wrap gap-1.5">
//                 {selectedGroup.map((emp) => (
//                   <span
//                     key={getEmpId(emp)}
//                     className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
//                   >
//                     {getEmpName(emp)}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         onChange(
//                           "approver_group",
//                           (level.approver_group || []).filter((id) => id !== getEmpUserId(emp))
//                         )
//                       }
//                       className="text-blue-400 hover:text-blue-800"
//                     >
//                       <Icons.X className="h-3 w-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//             <input
//               value={empSearch}
//               onChange={(e) => setEmpSearch(e.target.value)}
//               placeholder={`Search ${employees.length} employees…`}
//               className="mb-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//             />
//             <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white">
//               {filteredEmployees.length === 0 ? (
//                 <div className="px-4 py-6 text-center text-xs text-slate-500">
//                   No employees match
//                 </div>
//               ) : (
//                 filteredEmployees.map((emp) => {
//                   const uid = getEmpUserId(emp);
//                   const checked = (level.approver_group || []).includes(uid);
//                   return (
//                     <label
//                       key={getEmpId(emp)}
//                       className={`flex cursor-pointer items-center gap-3 border-b border-slate-50 px-3 py-2 text-sm transition last:border-0 hover:bg-slate-50 ${
//                         checked ? "bg-blue-50/40" : ""
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={(e) => {
//                           const current = level.approver_group || [];
//                           const next = e.target.checked
//                             ? [...current, uid]
//                             : current.filter((id) => id !== uid);
//                           onChange("approver_group", next);
//                         }}
//                         className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
//                       />
//                       <Avatar name={getEmpName(emp)} small />
//                       <div className="flex-1">
//                         <p className="font-medium text-slate-800">{getEmpName(emp)}</p>
//                         <p className="text-xs text-slate-500">{getEmpId(emp)}</p>
//                       </div>
//                     </label>
//                   );
//                 })
//               )}
//             </div>
//             <p className="mt-1 text-[11px] text-slate-500">
//               {selectedGroup.length} selected
//             </p>
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//           <NumberInput label="SLA (hrs)" value={level.sla_hours} onChange={(v) => onChange("sla_hours", v)} />
//           <NumberInput
//             label="Reminder (hrs)"
//             value={level.reminder_after_hours}
//             onChange={(v) => onChange("reminder_after_hours", v)}
//           />
//           <NumberInput
//             label="Escalate (hrs)"
//             value={level.escalate_after_hours}
//             onChange={(v) => onChange("escalate_after_hours", v)}
//           />
//           <NumberInput
//             label="Auto-approve (hrs)"
//             value={level.auto_approve_after_hours}
//             onChange={(v) => onChange("auto_approve_after_hours", v)}
//           />
//         </div>

//         <div className="flex flex-wrap gap-4 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-100">
//           <TogglePill
//             checked={level.can_be_skipped}
//             onChange={(v) => onChange("can_be_skipped", v)}
//             label="Can be skipped"
//           />
//           <TogglePill
//             checked={level.skip_if_no_approver}
//             onChange={(v) => onChange("skip_if_no_approver", v)}
//             label="Skip if no approver"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function EmployeePicker({ employees, search, setSearch, open, setOpen, totalCount, onPick }) {
//   return (
//     <div className="relative">
//       <div className="relative">
//         <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onFocus={() => setOpen(true)}
//           placeholder={`Search ${totalCount} employees by name or ID…`}
//           className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#E42527]"
//         />
//       </div>
//       {open && (
//         <>
//           <div
//             className="fixed inset-0 z-10"
//             onClick={() => setOpen(false)}
//           />
//           <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
//             {employees.length === 0 ? (
//               <div className="px-4 py-6 text-center text-xs text-slate-500">
//                 No employees match
//               </div>
//             ) : (
//               employees.slice(0, 100).map((emp) => (
//                 <button
//                   key={getEmpId(emp)}
//                   type="button"
//                   onClick={() => onPick(emp)}
//                   className="flex w-full items-center gap-3 border-b border-slate-50 px-3 py-2 text-left text-sm transition last:border-0 hover:bg-slate-50"
//                 >
//                   <Avatar name={getEmpName(emp)} small />
//                   <div className="flex-1">
//                     <p className="font-medium text-slate-800">{getEmpName(emp)}</p>
//                     <p className="text-xs text-slate-500">{getEmpId(emp)}</p>
//                   </div>
//                 </button>
//               ))
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function Avatar({ name, small }) {
//   const size = small ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
//   return (
//     <div
//       className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 font-bold text-white shadow-sm`}
//     >
//       {initials(name)}
//     </div>
//   );
// }

// /* ──────── CONDITION CARD ──────── */
// function ConditionCard({ condition, index, maxLevel, onChange, onRemove }) {
//   return (
//     <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-b from-blue-50/50 to-white p-4">
//       <div className="mb-3 flex items-center justify-between">
//         <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
//           Rule {index + 1}
//         </span>
//         <button
//           type="button"
//           onClick={onRemove}
//           className="rounded-lg p-1 text-red-500 hover:bg-red-50"
//         >
//           <Icons.Trash className="h-3.5 w-3.5" />
//         </button>
//       </div>

//       <div className="flex flex-wrap items-center gap-2 text-sm">
//         <span className="rounded-md bg-blue-600 px-2 py-1 text-xs font-bold text-white">
//           IF
//         </span>
//         <input
//           value={condition.field_name}
//           onChange={(e) => onChange("field_name", e.target.value)}
//           placeholder="field_name"
//           list="workflow-common-fields"
//           className="w-36 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[#E42527]"
//         />
//         <datalist id="workflow-common-fields">
//           {COMMON_FIELDS.map((f) => (
//             <option key={f} value={f} />
//           ))}
//         </datalist>

//         <select
//           value={condition.operator}
//           onChange={(e) => onChange("operator", e.target.value)}
//           className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[#E42527]"
//         >
//           {CONDITION_OPERATORS.map((o) => (
//             <option key={o.value} value={o.value}>
//               {o.label}
//             </option>
//           ))}
//         </select>

//         <input
//           value={condition.value}
//           onChange={(e) => onChange("value", e.target.value)}
//           placeholder="value"
//           className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[#E42527]"
//         />

//         <span className="rounded-md bg-slate-800 px-2 py-1 text-xs font-bold text-white">
//           THEN
//         </span>

//         <select
//           value={condition.action}
//           onChange={(e) => onChange("action", e.target.value)}
//           className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[#E42527]"
//         >
//           {CONDITION_ACTIONS.map((a) => (
//             <option key={a.value} value={a.value}>
//               {a.label}
//             </option>
//           ))}
//         </select>

//         {condition.action !== "reject_auto" && (
//           <>
//             <span className="text-xs text-slate-500">Level</span>
//             <input
//               type="number"
//               min="1"
//               max={maxLevel}
//               value={condition.target_level}
//               onChange={(e) => onChange("target_level", e.target.value)}
//               className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#E42527]"
//             />
//           </>
//         )}
//       </div>

//       <p className="mt-2 text-[11px] text-slate-500">
//         Example: IF <code className="rounded bg-white px-1">days_requested</code> {">"} 5 THEN require Level 2
//       </p>
//     </div>
//   );
// }

// /* ──────── VIEW MODAL ──────── */
// function WorkflowViewModal({ workflow, employees, onClose, onEdit }) {
//   const levels = workflow.levels || [];
//   const conditions = workflow.conditions || [];
//   const meta = getTypeMeta(workflow.approval_type);

//   const empMap = useMemo(() => {
//     const m = {};
//     employees.forEach((e) => {
//       m[getEmpUserId(e)] = e;
//     });
//     return m;
//   }, [employees]);

//   function renderApproverLabel(lvl) {
//     if (lvl.approver_type === "specific_user" && lvl.specific_user_id) {
//       const e = empMap[lvl.specific_user_id];
//       return e ? getEmpName(e) : lvl.specific_user_id;
//     }
//     if (lvl.approver_type === "user_group" && Array.isArray(lvl.approver_group) && lvl.approver_group.length > 0) {
//       return lvl.approver_group.map((id) => (empMap[id] ? getEmpName(empMap[id]) : id)).join(", ");
//     }
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
//       <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
//         <div className="relative border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
//           <div className="flex items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-200">
//               {meta.icon}
//             </div>
//             <div className="flex-1">
//               <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
//                 Workflow Detail
//               </p>
//               <h3 className="text-lg font-bold text-slate-900">{workflow.name}</h3>
//             </div>
//             <button
//               onClick={onClose}
//               className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
//             >
//               <Icons.X className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//             <InfoBox label="Type" value={meta.label} />
//             <InfoBox label="Version" value={`v${workflow.version ?? 1}`} />
//             <InfoBox
//               label="Status"
//               value={workflow.is_active ? "Active" : "Inactive"}
//               tone={workflow.is_active ? "emerald" : "slate"}
//             />
//             <InfoBox label="SLA" value={`${workflow.default_sla_hours ?? "—"} hrs`} />
//             <InfoBox label="Reminder" value={`${workflow.default_reminder_hours ?? "—"} hrs`} />
//             <InfoBox label="Escalate" value={`${workflow.default_escalate_hours ?? "—"} hrs`} />
//           </div>

//           {workflow.description && (
//             <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
//               {workflow.description}
//             </div>
//           )}

//           <div>
//             <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
//               <Icons.Users className="h-4 w-4" />
//               Approval Chain ({levels.length} levels)
//             </h4>
//             <div className="space-y-2">
//               {levels.map((lvl, i) => {
//                 const label = renderApproverLabel(lvl);
//                 return (
//                   <div
//                     key={i}
//                     className="relative rounded-xl border border-slate-200 bg-white p-3 text-sm"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2.5">
//                         <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white">
//                           {lvl.level}
//                         </span>
//                         <span className="font-semibold text-slate-800">
//                           {lvl.name || `Level ${lvl.level}`}
//                         </span>
//                       </div>
//                       <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
//                         {String(lvl.approver_type || "").replace(/_/g, " ")}
//                       </span>
//                     </div>
//                     {label && (
//                       <p className="mt-2 pl-8 text-xs text-slate-600">
//                         <span className="font-medium text-slate-500">Approver: </span>
//                         {label}
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {conditions.length > 0 && (
//             <div>
//               <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
//                 <Icons.Sparkle className="h-4 w-4" />
//                 Conditional Rules ({conditions.length})
//               </h4>
//               <div className="space-y-2">
//                 {conditions.map((c, i) => (
//                   <div
//                     key={i}
//                     className="rounded-xl border border-blue-200/60 bg-gradient-to-b from-blue-50/60 to-white px-3 py-2.5 text-xs text-slate-700"
//                   >
//                     <span className="font-bold text-blue-600">IF</span>{" "}
//                     <code className="rounded bg-white px-1.5 py-0.5 text-slate-800">
//                       {c.field_name}
//                     </code>{" "}
//                     <span className="text-slate-500">{c.operator}</span>{" "}
//                     <code className="rounded bg-white px-1.5 py-0.5 text-slate-800">
//                       {String(c.value)}
//                     </code>{" "}
//                     <span className="font-bold text-slate-700">THEN</span>{" "}
//                     <span className="text-slate-600">{c.action}</span>
//                     {c.target_level && (
//                       <>
//                         {" "}
//                         → <b>Level {c.target_level}</b>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
//           <button
//             onClick={onClose}
//             className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
//           >
//             Close
//           </button>
//           <button
//             onClick={onEdit}
//             className="inline-flex items-center gap-2 rounded-xl bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
//           >
//             <Icons.Edit className="h-4 w-4" />
//             Edit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoBox({ label, value, tone = "slate" }) {
//   const toneClass =
//     tone === "emerald"
//       ? "bg-emerald-50 text-emerald-700"
//       : "bg-slate-50 text-slate-800";
//   return (
//     <div className={`rounded-xl px-3 py-2.5 ${toneClass}`}>
//       <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
//         {label}
//       </p>
//       <p className="mt-0.5 text-sm font-bold">{value}</p>
//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */

const Icon = {
  Plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  X: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>,
  Check: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  Arrow: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>,
  Search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>,
  Edit: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Trash: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>,
  User: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Users: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Bolt: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" /></svg>,
  ChevronDown: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>,
  ChevronUp: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 15-6-6-6 6" /></svg>,
  ChevronRight: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>,
  Clock: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  Settings: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  Sparkle: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" /></svg>,
  Help: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>,
};

/* ═══════════════════════════════════════════════════════
   TYPE CONFIG (simple words)
   ═══════════════════════════════════════════════════════ */

const APPROVAL_TYPES = [
  { value: "leave", label: "Leave", desc: "Time off requests", emoji: "🌴" },
  { value: "special_request", label: "WFH / On Duty", desc: "Work from home or field", emoji: "🏠" },
  { value: "attendance", label: "Attendance", desc: "Missed punch fixes", emoji: "📅" },
  { value: "overtime", label: "Overtime", desc: "Extra hours approval", emoji: "⏰" },
  { value: "comp_off", label: "Comp Off", desc: "Compensatory leave", emoji: "🎁" },
  { value: "expense", label: "Expense", desc: "Spending claims", emoji: "💳" },
  { value: "loan", label: "Loan", desc: "Salary advance", emoji: "🏦" },
  { value: "reimbursement", label: "Reimbursement", desc: "Get money back", emoji: "💰" },
  { value: "letter", label: "Letter", desc: "Document requests", emoji: "📄" },
  { value: "payroll", label: "Payroll", desc: "Salary changes", emoji: "💼" },
  { value: "onboarding", label: "Onboarding", desc: "New hire setup", emoji: "🚀" },
  { value: "regularization", label: "Regularization", desc: "Fix attendance", emoji: "✅" },
  { value: "resignation", label: "Resignation", desc: "Exit approval", emoji: "👋" },
  { value: "fnf", label: "Full & Final", desc: "Settlement", emoji: "📋" },
];

const getTypeMeta = (t) =>
  APPROVAL_TYPES.find((x) => x.value === t) || {
    label: String(t || "").replace(/_/g, " "),
    desc: "",
    emoji: "📌",
  };

/* ═══════════════════════════════════════════════════════
   APPROVER TYPES (plain language)
   ═══════════════════════════════════════════════════════ */

const APPROVER_TYPES = [
  {
    value: "reporting_manager",
    label: "Reporting manager",
    hint: "The employee's direct boss",
    icon: "👤",
    common: true,
  },
  {
    value: "skip_level_manager",
    label: "Manager's manager",
    hint: "Boss's boss — for senior approval",
    icon: "👥",
    common: true,
  },
  {
    value: "department_head",
    label: "Department head",
    hint: "Owner of the department",
    icon: "🏢",
    common: true,
  },
  {
    value: "specific_user",
    label: "A specific person",
    hint: "Always the same person (e.g. HR)",
    icon: "👤",
    common: true,
  },
  {
    value: "user_group",
    label: "A group of people",
    hint: "Any one from the group can approve",
    icon: "👥",
    common: false,
  },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

const getErrorMessage = (err) => {
  const d = err?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((x) => x.msg).join(" • ");
  if (typeof d === "string") return d;
  if (err?.code === "ERR_NETWORK") return "Network error";
  if (err?.response?.status === 403) return "Admin access required";
  return err?.message || "Something went wrong";
};

function extractEmployees(res) {
  const body = res?.data ?? {};
  const data = body?.data ?? body;
  if (Array.isArray(data)) return data;
  return data?.employees ?? data?.items ?? data?.results ?? [];
}

const getEmpId = (e) => e?.employee_id || e?.id || e?._id || "";
const getEmpUserId = (e) => e?.user_id || e?.userId || "";
const getEmpName = (e) =>
  [e?.first_name, e?.last_name].filter(Boolean).join(" ").trim() ||
  e?.name ||
  e?.full_name ||
  getEmpId(e) ||
  "Employee";

const initials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

/* ═══════════════════════════════════════════════════════
   FORM DEFAULTS
   ═══════════════════════════════════════════════════════ */

const makeEmptyLevel = (n = 1) => ({
  level: n,
  name: "",
  approver_type: "reporting_manager",
  specific_user_id: "",
  approver_group: [],
  sla_hours: 24,
  reminder_after_hours: 12,
  escalate_after_hours: 48,
  can_be_skipped: true,
  skip_if_no_approver: true,
  auto_approve_after_hours: "",
});

const initialForm = {
  name: "",
  approval_type: "leave",
  description: "",
  allow_requester_cancel: true,
  allow_comments: true,
  default_sla_hours: 48,
  default_reminder_hours: 24,
  default_escalate_hours: 72,
  max_reminders: 3,
  is_active: true,
  levels: [makeEmptyLevel(1)],
  conditions: [],
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickSetupLoading, setQuickSetupLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [viewing, setViewing] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/approvals/workflows");
      setWorkflows(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      showToast("error", getErrorMessage(err));
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/employees", {
        params: { page: 1, page_size: 1000 },
      });
      const list = extractEmployees(res).filter((e) => getEmpUserId(e));
      setEmployees(list);
    } catch {
      setEmployees([]);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
    fetchEmployees();
  }, [fetchWorkflows, fetchEmployees]);

  const filtered = useMemo(() => {
    let list = workflows;
    if (typeFilter !== "all") list = list.filter((w) => w.approval_type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          (w.name || "").toLowerCase().includes(q) ||
          (w.approval_type || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [workflows, typeFilter, search]);

  const handleQuickSetup = async () => {
    if (
      !window.confirm(
        "We'll create ready-to-use workflows for:\n\n" +
          "✓ Leave\n✓ Attendance\n✓ Overtime\n✓ WFH / On Duty\n✓ Comp Off\n\n" +
          "You can edit them anytime."
      )
    )
      return;

    setQuickSetupLoading(true);
    try {
      const res = await api.post("/api/v1/approvals/workflows/quick-setup", {});
      const d = res?.data ?? {};
      showToast(
        "success",
        `${d.created_count ?? 0} created, ${d.skipped_count ?? 0} already existed`
      );
      await fetchWorkflows();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setQuickSetupLoading(false);
    }
  };

  const openCreate = () => {
    setFormData({ ...initialForm, levels: [makeEmptyLevel(1)], conditions: [] });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = async (wf) => {
    try {
      const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
      const d = res?.data ?? wf;
      setFormData({
        name: d.name || "",
        approval_type: d.approval_type || "leave",
        description: d.description || "",
        allow_requester_cancel: d.allow_requester_cancel ?? true,
        allow_comments: d.allow_comments ?? true,
        default_sla_hours: d.default_sla_hours ?? 48,
        default_reminder_hours: d.default_reminder_hours ?? 24,
        default_escalate_hours: d.default_escalate_hours ?? 72,
        max_reminders: d.max_reminders ?? 3,
        is_active: d.is_active ?? true,
        levels:
          d.levels?.length > 0
            ? d.levels.map((l) => ({
                level: l.level,
                name: l.name || "",
                approver_type: l.approver_type || "reporting_manager",
                specific_user_id: l.specific_user_id || "",
                approver_group: l.approver_group || [],
                sla_hours: l.sla_hours ?? 24,
                reminder_after_hours: l.reminder_after_hours ?? 12,
                escalate_after_hours: l.escalate_after_hours ?? 48,
                can_be_skipped: l.can_be_skipped ?? true,
                skip_if_no_approver: l.skip_if_no_approver ?? true,
                auto_approve_after_hours: l.auto_approve_after_hours ?? "",
              }))
            : [makeEmptyLevel(1)],
        conditions: (d.conditions || []).map((c) => ({
          field_name: c.field_name || "days_requested",
          operator: c.operator || "gt",
          value: c.value ?? 5,
          action: c.action || "require_level",
          target_level: c.target_level || 2,
          priority: c.priority ?? 100,
        })),
      });
      setEditingId(wf.workflow_id);
      setShowForm(true);
    } catch (err) {
      showToast("error", getErrorMessage(err));
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const setField = (f, v) => setFormData((p) => ({ ...p, [f]: v }));

  const setLevelField = (i, f, v) =>
    setFormData((p) => {
      const levels = [...p.levels];
      levels[i] = { ...levels[i], [f]: v };
      return { ...p, levels };
    });

  const addLevel = () =>
    setFormData((p) => ({ ...p, levels: [...p.levels, makeEmptyLevel(p.levels.length + 1)] }));

  const removeLevel = (i) => {
    if (formData.levels.length <= 1) return;
    setFormData((p) => ({
      ...p,
      levels: p.levels.filter((_, idx) => idx !== i).map((l, idx) => ({ ...l, level: idx + 1 })),
    }));
  };

  const moveLevel = (i, dir) => {
    setFormData((p) => {
      const levels = [...p.levels];
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= levels.length) return p;
      [levels[i], levels[j]] = [levels[j], levels[i]];
      return { ...p, levels: levels.map((l, idx) => ({ ...l, level: idx + 1 })) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("error", "Please give this workflow a name");
      return;
    }
    for (let i = 0; i < formData.levels.length; i++) {
      const l = formData.levels[i];
      if (l.approver_type === "specific_user" && !l.specific_user_id) {
        showToast("error", `Step ${i + 1}: please pick a person`);
        return;
      }
      if (l.approver_type === "user_group" && (!l.approver_group || l.approver_group.length === 0)) {
        showToast("error", `Step ${i + 1}: please pick at least one person`);
        return;
      }
    }

    const saving = true;
    try {
      const payload = {
        name: formData.name.trim(),
        approval_type: formData.approval_type,
        description: formData.description?.trim() || null,
        allow_requester_cancel: formData.allow_requester_cancel,
        allow_comments: formData.allow_comments,
        default_sla_hours: Number(formData.default_sla_hours) || 48,
        default_reminder_hours: Number(formData.default_reminder_hours) || 24,
        default_escalate_hours: Number(formData.default_escalate_hours) || 72,
        max_reminders: Number(formData.max_reminders) || 3,
        is_active: formData.is_active,
        levels: formData.levels.map((l, idx) => ({
          level: idx + 1,
          name: l.name?.trim() || `Step ${idx + 1}`,
          approver_type: l.approver_type,
          specific_user_id: l.approver_type === "specific_user" ? l.specific_user_id : null,
          approver_group: l.approver_type === "user_group" ? l.approver_group : null,
          sla_hours: l.sla_hours ? Number(l.sla_hours) : null,
          reminder_after_hours: l.reminder_after_hours ? Number(l.reminder_after_hours) : null,
          escalate_after_hours: l.escalate_after_hours ? Number(l.escalate_after_hours) : null,
          auto_approve_after_hours: l.auto_approve_after_hours ? Number(l.auto_approve_after_hours) : null,
          can_be_skipped: !!l.can_be_skipped,
          skip_if_no_approver: !!l.skip_if_no_approver,
        })),
        conditions: (formData.conditions || []).map((c) => ({
          field_name: c.field_name,
          operator: c.operator,
          value: c.value,
          action: c.action,
          target_level: c.target_level ? Number(c.target_level) : null,
          priority: Number(c.priority) || 100,
        })),
      };

      if (editingId) {
        await api.put(`/api/v1/approvals/workflows/${editingId}`, payload);
        showToast("success", "Changes saved");
      } else {
        await api.post("/api/v1/approvals/workflows", payload);
        showToast("success", "Workflow created");
      }

      closeForm();
      await fetchWorkflows();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    }
  };

  const openView = async (wf) => {
    try {
      const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
      setViewing(res?.data ?? wf);
    } catch {
      setViewing(wf);
    }
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ═══ HEADER ═══ */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Approval Workflows
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Decide who approves requests like leave, expenses, and more
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {workflows.length === 0 && (
                <button
                  onClick={handleQuickSetup}
                  disabled={quickSetupLoading}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border-2 border-amber-400 bg-amber-50 px-4 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
                >
                  <Icon.Bolt className="h-4 w-4" />
                  {quickSetupLoading ? "Setting up…" : "Auto setup (5 workflows)"}
                </button>
              )}
              <button
                onClick={openCreate}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#E42527] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c91f21]"
              >
                <Icon.Plus className="h-4 w-4" />
                New Workflow
              </button>
            </div>
          </div>
        </div>

        {/* ═══ INFO CARD (first time only) ═══ */}
        {!loading && workflows.length === 0 && (
          <div className="mb-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-2xl">
                💡
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900">
                  What is a workflow?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-amber-800">
                  A workflow decides <b>who needs to approve</b> a request.
                  For example: when an employee applies for leave, first their manager approves, then HR.
                  That's a 2-step workflow.
                </p>
                <button
                  onClick={handleQuickSetup}
                  disabled={quickSetupLoading}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-60"
                >
                  <Icon.Bolt className="h-4 w-4" />
                  {quickSetupLoading ? "Setting up…" : "Set up 5 ready workflows →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FILTERS ═══ */}
        {workflows.length > 0 && (
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search workflows..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#E42527]"
            >
              <option value="all">All types</option>
              {APPROVAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ═══ LIST ═══ */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : filtered.length === 0 && workflows.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <p className="text-sm font-medium text-slate-600">No workflows match your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((wf) => (
              <WorkflowRow
                key={wf.workflow_id}
                workflow={wf}
                employees={employees}
                onView={() => openView(wf)}
                onEdit={() => openEdit(wf)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ TOAST ═══ */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl ${
            toast.type === "success" ? "bg-slate-900 text-white" : "bg-red-600 text-white"
          }`}
        >
          <div className={`flex h-5 w-5 items-center justify-center rounded-full ${toast.type === "success" ? "bg-emerald-500" : "bg-white/20"}`}>
            {toast.type === "success" ? <Icon.Check className="h-3 w-3" /> : <Icon.X className="h-3 w-3" />}
          </div>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      {showForm && (
        <WorkflowForm
          formData={formData}
          setField={setField}
          setLevelField={setLevelField}
          addLevel={addLevel}
          removeLevel={removeLevel}
          moveLevel={moveLevel}
          employees={employees}
          editingId={editingId}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {viewing && (
        <WorkflowView
          workflow={viewing}
          employees={employees}
          onClose={() => setViewing(null)}
          onEdit={() => {
            const wf = viewing;
            setViewing(null);
            openEdit(wf);
          }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WORKFLOW ROW — shows visual flow
   ═══════════════════════════════════════════════════════ */

function WorkflowRow({ workflow, employees, onView, onEdit }) {
  const meta = getTypeMeta(workflow.approval_type);
  const levels = workflow.levels || [];
  const isActive = workflow.is_active;

  // resolve labels for each level
  const resolveLabel = (lvl) => {
    if (lvl.approver_type === "reporting_manager") return "Manager";
    if (lvl.approver_type === "skip_level_manager") return "Manager's Manager";
    if (lvl.approver_type === "department_head") return "Dept. Head";
    if (lvl.approver_type === "specific_user") {
      const emp = employees.find((e) => getEmpUserId(e) === lvl.specific_user_id);
      return emp ? getEmpName(emp).split(" ")[0] : "Fixed person";
    }
    if (lvl.approver_type === "user_group") {
      return `${(lvl.approver_group || []).length} people (any one)`;
    }
    return lvl.approver_type;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: icon + name + type */}
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
            {meta.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-slate-900">
                {workflow.name}
              </h3>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                {isActive ? "Live" : "Off"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {meta.label} · {levels.length} {levels.length === 1 ? "step" : "steps"}
            </p>
          </div>
        </div>

        {/* Middle: visual flow */}
        <div className="flex items-center gap-2 overflow-x-auto lg:flex-1">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <StepChip label="Employee" icon="👤" tone="slate" />
            {levels.slice(0, 3).map((lvl, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Icon.Arrow className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                <StepChip label={resolveLabel(lvl)} icon="✓" tone="red" />
              </div>
            ))}
            {levels.length > 3 && (
              <>
                <Icon.Arrow className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  +{levels.length - 3} more
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onView}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="h-9 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function StepChip({ label, icon, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    red: "border-red-200 bg-red-50 text-[#E42527]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${tones[tone]}`}>
      {tone === "red" ? <Icon.Check className="h-3 w-3" /> : <span>{icon}</span>}
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   FORM MODAL — simplified, step-by-step
   ═══════════════════════════════════════════════════════ */

function WorkflowForm({ formData, setField, setLevelField, addLevel, removeLevel, moveLevel, employees, editingId, onSubmit, onClose }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-6 backdrop-blur-sm">
      <div className="mb-12 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? "Edit Workflow" : "New Workflow"}
            </h2>
            <p className="text-xs text-slate-500">
              {editingId ? "Update the approval steps" : "Set up who approves what"}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-200">
            <Icon.X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            {/* STEP 1 */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white">1</span>
                <h3 className="text-sm font-bold text-slate-900">What is this for?</h3>
              </div>

              <div className="mb-3">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Request type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {APPROVAL_TYPES.slice(0, 6).map((t) => {
                    const active = formData.approval_type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setField("approval_type", t.value)}
                        className={`flex items-center gap-2 rounded-lg border-2 p-2.5 text-left transition ${
                          active
                            ? "border-[#E42527] bg-red-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xl">{t.emoji}</span>
                        <span className={`truncate text-xs font-semibold ${active ? "text-[#E42527]" : "text-slate-700"}`}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Give it a name *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="e.g. Leave Approval for Sales Team"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* STEP 2 */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white">2</span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Who approves? ({formData.levels.length} {formData.levels.length === 1 ? "step" : "steps"})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addLevel}
                  className="inline-flex h-8 items-center gap-1 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  <Icon.Plus className="h-3 w-3" />
                  Add step
                </button>
              </div>

              <div className="space-y-3">
                {formData.levels.map((level, i) => (
                  <ApprovalStep
                    key={i}
                    level={level}
                    index={i}
                    total={formData.levels.length}
                    employees={employees}
                    onChange={(f, v) => setLevelField(i, f, v)}
                    onRemove={() => removeLevel(i)}
                    onMoveUp={() => moveLevel(i, "up")}
                    onMoveDown={() => moveLevel(i, "down")}
                  />
                ))}
              </div>
            </div>

            {/* STEP 3 — optional */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon.Settings className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">
                    Advanced settings (optional)
                  </span>
                </div>
                <Icon.ChevronDown
                  className={`h-4 w-4 text-slate-400 transition ${showAdvanced ? "rotate-180" : ""}`}
                />
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="Note for HR / admin (optional)"
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MiniNum label="Deadline (hrs)" value={formData.default_sla_hours} onChange={(v) => setField("default_sla_hours", v)} />
                    <MiniNum label="Remind after (hrs)" value={formData.default_reminder_hours} onChange={(v) => setField("default_reminder_hours", v)} />
                    <MiniNum label="Escalate after (hrs)" value={formData.default_escalate_hours} onChange={(v) => setField("default_escalate_hours", v)} />
                    <MiniNum label="Max reminders" value={formData.max_reminders} onChange={(v) => setField("max_reminders", v)} />
                  </div>

                  <div className="flex flex-wrap gap-5">
                    <Toggle checked={formData.allow_requester_cancel} onChange={(v) => setField("allow_requester_cancel", v)} label="Employee can cancel" />
                    <Toggle checked={formData.allow_comments} onChange={(v) => setField("allow_comments", v)} label="Allow comments" />
                    <Toggle checked={formData.is_active} onChange={(v) => setField("is_active", v)} label="Turn on this workflow" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="h-10 rounded-lg bg-[#E42527] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]">
              {editingId ? "Save changes" : "Create workflow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Approval step card (super simple) ─── */
function ApprovalStep({ level, index, total, employees, onChange, onRemove, onMoveUp, onMoveDown }) {
  const [showEmpList, setShowEmpList] = useState(false);
  const [search, setSearch] = useState("");

  const isSpecific = level.approver_type === "specific_user";
  const isGroup = level.approver_type === "user_group";

  const filteredEmps = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter((e) => getEmpName(e).toLowerCase().includes(q) || getEmpId(e).toLowerCase().includes(q));
  }, [employees, search]);

  const selectedEmp = employees.find((e) => getEmpUserId(e) === level.specific_user_id);
  const selectedGroup = employees.filter((e) => (level.approver_group || []).includes(getEmpUserId(e)));

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="text-sm font-bold text-slate-800">
            Step {index + 1}
          </span>
        </div>
        {total > 1 && (
          <div className="flex items-center gap-1">
            <button type="button" onClick={onMoveUp} disabled={index === 0} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30">
              <Icon.ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={onMoveDown} disabled={index === total - 1} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30">
              <Icon.ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={onRemove} className="rounded p-1 text-red-500 hover:bg-red-50">
              <Icon.Trash className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Who approves? */}
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        Who approves at this step?
      </label>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {APPROVER_TYPES.map((t) => {
          const active = level.approver_type === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                onChange("approver_type", t.value);
                onChange("specific_user_id", "");
                onChange("approver_group", []);
              }}
              className={`flex items-start gap-2 rounded-lg border-2 p-2.5 text-left transition ${
                active ? "border-[#E42527] bg-red-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <div className="min-w-0">
                <p className={`text-xs font-semibold ${active ? "text-[#E42527]" : "text-slate-700"}`}>
                  {t.label}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-slate-500">{t.hint}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Person picker */}
      {isSpecific && (
        <div className="mt-3">
          {selectedEmp ? (
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <Avatar name={getEmpName(selectedEmp)} />
                <div>
                  <p className="text-xs font-semibold text-emerald-900">{getEmpName(selectedEmp)}</p>
                  <p className="text-[10px] text-emerald-700">{getEmpId(selectedEmp)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onChange("specific_user_id", "")}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Change
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowEmpList(!showEmpList)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
              >
                <span className="text-sm text-slate-400">Pick a person…</span>
                <Icon.ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {showEmpList && (
                <div className="mt-2 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 p-2">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name..."
                      className="h-8 w-full rounded-md border border-slate-200 px-3 text-xs outline-none focus:border-[#E42527]"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredEmps.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-slate-400">No matches</p>
                    ) : (
                      filteredEmps.slice(0, 50).map((emp) => (
                        <button
                          key={getEmpId(emp)}
                          type="button"
                          onClick={() => {
                            onChange("specific_user_id", getEmpUserId(emp));
                            setShowEmpList(false);
                            setSearch("");
                          }}
                          className="flex w-full items-center gap-2 border-b border-slate-50 px-3 py-2 text-left hover:bg-slate-50"
                        >
                          <Avatar name={getEmpName(emp)} small />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-slate-800">{getEmpName(emp)}</p>
                            <p className="truncate text-[10px] text-slate-500">{getEmpId(emp)}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Group picker */}
      {isGroup && (
        <div className="mt-3">
          {selectedGroup.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {selectedGroup.map((emp) => (
                <span key={getEmpId(emp)} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                  {getEmpName(emp)}
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        "approver_group",
                        (level.approver_group || []).filter((id) => id !== getEmpUserId(emp))
                      )
                    }
                    className="text-blue-400 hover:text-blue-700"
                  >
                    <Icon.X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${employees.length} people…`}
            className="mb-2 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-[#E42527]"
          />
          <div className="max-h-44 overflow-y-auto rounded-lg border border-slate-200 bg-white">
            {filteredEmps.map((emp) => {
              const uid = getEmpUserId(emp);
              const checked = (level.approver_group || []).includes(uid);
              return (
                <label
                  key={getEmpId(emp)}
                  className={`flex cursor-pointer items-center gap-2 border-b border-slate-50 px-3 py-2 last:border-0 hover:bg-slate-50 ${checked ? "bg-blue-50/40" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const cur = level.approver_group || [];
                      const next = e.target.checked ? [...cur, uid] : cur.filter((id) => id !== uid);
                      onChange("approver_group", next);
                    }}
                    className="h-4 w-4 accent-[#E42527]"
                  />
                  <Avatar name={getEmpName(emp)} small />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-800">{getEmpName(emp)}</p>
                    <p className="truncate text-[10px] text-slate-500">{getEmpId(emp)}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({ name, small }) {
  const size = small ? "h-6 w-6 text-[9px]" : "h-8 w-8 text-[10px]";
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white`}>
      {initials(name)}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${checked ? "bg-[#E42527]" : "bg-slate-300"}`}
      >
        <span
          className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition"
          style={{ transform: checked ? "translateX(18px)" : "translateX(4px)" }}
        />
      </button>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </label>
  );
}

function MiniNum({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold text-slate-600">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-xs outline-none focus:border-[#E42527]"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VIEW MODAL — same simple language
   ═══════════════════════════════════════════════════════ */

function WorkflowView({ workflow, employees, onClose, onEdit }) {
  const meta = getTypeMeta(workflow.approval_type);
  const levels = workflow.levels || [];

  const resolveLabel = (lvl) => {
    if (lvl.approver_type === "reporting_manager") return "Reporting manager";
    if (lvl.approver_type === "skip_level_manager") return "Manager's manager";
    if (lvl.approver_type === "department_head") return "Department head";
    if (lvl.approver_type === "specific_user") {
      const emp = employees.find((e) => getEmpUserId(e) === lvl.specific_user_id);
      return emp ? getEmpName(emp) : "Fixed person";
    }
    if (lvl.approver_type === "user_group") {
      const names = (lvl.approver_group || []).map((id) => {
        const e = employees.find((emp) => getEmpUserId(emp) === id);
        return e ? getEmpName(e) : id;
      });
      return names.length ? `${names.join(", ")} (any one)` : "Group";
    }
    return lvl.approver_type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
              {meta.emoji}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{workflow.name}</h2>
              <p className="text-xs text-slate-500">{meta.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <Icon.X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Approval flow
          </p>

          {/* Visual chain */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-base">
                👤
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Employee applies</p>
                <p className="text-[11px] text-slate-500">Starts the request</p>
              </div>
            </div>

            {levels.map((lvl, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-3 w-px bg-slate-300" />
                <div className="flex w-full items-center gap-3 rounded-xl border-2 border-[#E42527]/30 bg-red-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E42527] text-sm font-bold text-white">
                    {lvl.level}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {resolveLabel(lvl)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Step {i + 1} · Deadline {lvl.sla_hours ?? 24}h
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col items-center">
              <div className="h-3 w-px bg-slate-300" />
              <div className="flex w-full items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Icon.Check className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Approved</p>
                  <p className="text-[11px] text-emerald-600">Request goes through</p>
                </div>
              </div>
            </div>
          </div>

          {workflow.description && (
            <div className="mt-4 rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
              <span className="font-semibold">Note: </span>
              {workflow.description}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button onClick={onClose} className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Close
          </button>
          <button onClick={onEdit} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#E42527] px-4 text-sm font-medium text-white hover:bg-[#c91f21]">
            <Icon.Edit className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}