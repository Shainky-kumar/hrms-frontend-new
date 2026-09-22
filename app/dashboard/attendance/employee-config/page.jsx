
// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;

//   if (Array.isArray(detail)) {
//     return detail
//       .map((item) => item.msg || "Error")
//       .join(" • ");
//   }

//   if (typeof detail === "string") return detail;

//   return err?.message || "Something went wrong";
// };

// const boolOrNull = (value) => {
//   if (value === "" || value === null || value === undefined) {
//     return null;
//   }

//   if (value === true || value === "true") return true;
//   if (value === false || value === "false") return false;

//   return null;
// };

// const initialForm = {
// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;

//   if (Array.isArray(detail)) {
//     return detail
//       .map((item) => item.msg || "Error")
//       .join(" • ");
//   }

//   if (typeof detail === "string") return detail;

//   return err?.message || "Something went wrong";
// };

// const boolOrNull = (value) => {
//   if (value === "" || value === null || value === undefined) {
//     return null;
//   }

//   if (value === true || value === "true") return true;
//   if (value === false || value === "false") return false;

//   return null;
// };

// const initialForm = {
//   employee_id: "",
//   grace_minutes_override: "",
//   geo_fence_required: "",
//   face_required: "",
//   allow_web_punch: "",
//   allow_mobile_punch: "",
//   wfh_allowed: "",
//   remarks: "",
//   is_active: true,
// };

// export default function EmployeeAttendanceConfigPage() {
//   const [form, setForm] = useState(initialForm);
//   const [configId, setConfigId] = useState("");

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [listLoading, setListLoading] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [employees, setEmployees] = useState([]);
//   const [configList, setConfigList] = useState([]);

//   async function fetchEmployees() {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.get("/api/v1/get/employees", {
//         params: {
//           page: 1,
//           page_size: 100,
//         },
//       });

//       const data = res.data;

//       const list =
//         data?.employees ||
//         data?.data ||
//         data?.items ||
//         data?.results ||
//         [];

//       setEmployees(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setEmployees([]);
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchConfigList() {
//     setListLoading(true);

//     try {
//       const res = await api.get(
//         "/api/v1/get/all/employee/attendance_config"
//       );

//       const data = res.data;

//       const list =
//         data?.configs ||
//         data?.data ||
//         data?.items ||
//         data?.results ||
//         [];

//       setConfigList(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setConfigList([]);
//     } finally {
//       setListLoading(false);
//     }
//   }

//   useEffect(() => {
//     (async () => {
//       await fetchEmployees();
//       await fetchConfigList();
//     })();
//   }, []);

//   const handleCreate = async (event) => {
//     event.preventDefault();

//     if (!form.employee_id.trim()) {
//       setError("Employee ID required");
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     const payload = {
//       employee_id: form.employee_id,
//       grace_minutes_override: form.grace_minutes_override
//         ? Number(form.grace_minutes_override)
//         : null,
//       geo_fence_required: boolOrNull(form.geo_fence_required),
//       face_required: boolOrNull(form.face_required),
//       allow_web_punch: boolOrNull(form.allow_web_punch),
//       allow_mobile_punch: boolOrNull(form.allow_mobile_punch),
//       wfh_allowed: boolOrNull(form.wfh_allowed),
//       remarks: form.remarks || null,
//       is_active: form.is_active,
//     };

//     try {
//       await api.post(
//         "/api/v1/add/employee/attendance_config",
//         payload
//       );

//       setSuccess("Config created successfully");
//       setForm(initialForm);
//       setConfigId("");

//       await fetchConfigList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdate = async (event) => {
//     event.preventDefault();

//     if (!configId.trim()) {
//       setError("Config ID required for update");
//       return;
//     }

//     if (!form.employee_id.trim()) {
//       setError("Employee ID required");
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     const payload = {
//       employee_id: form.employee_id,
//       grace_minutes_override: form.grace_minutes_override
//         ? Number(form.grace_minutes_override)
//         : null,
//       geo_fence_required: boolOrNull(form.geo_fence_required),
//       face_required: boolOrNull(form.face_required),
//       allow_web_punch: boolOrNull(form.allow_web_punch),
//       allow_mobile_punch: boolOrNull(form.allow_mobile_punch),
//       wfh_allowed: boolOrNull(form.wfh_allowed),
//       remarks: form.remarks || null,
//       is_active: form.is_active,
//     };

//     try {
//       await api.put(
//         `/api/v1/update/employee/attendance_config/${configId.trim()}`,
//         payload
//       );

//       setSuccess("Config updated successfully");
//       setForm(initialForm);
//       setConfigId("");

//       await fetchConfigList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSelectConfig = (config) => {
//     if (!config) {
//       setConfigId("");
//       setForm(initialForm);
//       return;
//     }

//     setConfigId(config.config_id || config.id);

//     setForm({
//       employee_id: config.employee_id || "",
//       grace_minutes_override:
//         config.grace_minutes_override ?? "",
//       geo_fence_required:
//         config.geo_fence_required === null
//           ? ""
//           : String(config.geo_fence_required),
//       face_required:
//         config.face_required === null
//           ? ""
//           : String(config.face_required),
//       allow_web_punch:
//         config.allow_web_punch === null
//           ? ""
//           : String(config.allow_web_punch),
//       allow_mobile_punch:
//         config.allow_mobile_punch === null
//           ? ""
//           : String(config.allow_mobile_punch),
//       wfh_allowed:
//         config.wfh_allowed === null
//           ? ""
//           : String(config.wfh_allowed),
//       remarks: config.remarks || "",
//       is_active: config.is_active ?? true,
//     });

//     setError("");
//     setSuccess("");
//   };

//   const getEmployeeName = (employeeId) => {
//     const emp = employees.find(
//       (item) =>
//         String(item.employee_id) === String(employeeId) ||
//         String(item.id) === String(employeeId)
//     );

//     return (
//       emp?.employee_name ||
//       emp?.name ||
//       emp?.full_name ||
//       employeeId
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-slate-800">
//             Employee Attendance Config
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Per-employee attendance settings (null = company default)
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             ⚠️ {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//             ✅ {success}
//           </div>
//         )}

//         <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-100 px-5 py-4">
//             <h2 className="font-semibold text-slate-800">
//               Create / Update Config
//             </h2>
//           </div>

//           <form className="grid gap-4 p-5 sm:grid-cols-2">
//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Employee <span className="text-red-600">*</span>
//               </label>

//               {loading ? (
//                 <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
//               ) : employees.length === 0 ? (
//                 <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
//                   No employees found
//                 </div>
//               ) : (
//                 <select
//                   required
//                   value={form.employee_id}
//                   onChange={(event) =>
//                     setForm((previous) => ({
//                       ...previous,
//                       employee_id: event.target.value,
//                     }))
//                   }
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//                 >
//                   <option value="">Select employee</option>

//                   {employees.map((emp) => {
//                     const empId =
//                       emp.employee_id ||
//                       emp.id ||
//                       emp._id;

//                     const empName =
//                       emp.employee_name ||
//                       emp.name ||
//                       emp.full_name ||
//                       empId;

//                     return (
//                       <option
//                         key={empId}
//                         value={empId}
//                       >
//                         {empName}
//                       </option>
//                     );
//                   })}
//                 </select>
//               )}
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Select Config (for update)
//               </label>

//               {listLoading ? (
//                 <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
//               ) : configList.length === 0 ? (
//                 <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
//                   No configs found
//                 </div>
//               ) : (
//                 <select
//                   value={configId}
//                   onChange={(event) => {
//                     const selected = configList.find(
//                       (item) =>
//                         String(
//                           item.config_id || item.id
//                         ) === String(event.target.value)
//                     );

//                     handleSelectConfig(selected || null);
//                   }}
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//                 >
//                   <option value="">-- Select config --</option>

//                   {configList.map((config) => {
//                     const id = config.config_id || config.id;

//                     const empName = getEmployeeName(
//                       config.employee_id
//                     );

//                     return (
//                       <option key={id} value={id}>
//                         {empName} ({id.slice(0, 8)}...)
//                       </option>
//                     );
//                   })}
//                 </select>
//               )}
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Grace minutes override
//               </label>

//               <input
//                 type="number"
//                 min="0"
//                 max="1440"
//                 value={form.grace_minutes_override}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     grace_minutes_override: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               />

//               <p className="mt-1 text-xs text-slate-400">
//                 Leave empty for company default
//               </p>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Geo fence required
//               </label>

//               <select
//                 value={form.geo_fence_required}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     geo_fence_required: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Face required
//               </label>

//               <select
//                 value={form.face_required}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     face_required: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Allow web punch
//               </label>

//               <select
//                 value={form.allow_web_punch}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     allow_web_punch: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Allow mobile punch
//               </label>

//               <select
//                 value={form.allow_mobile_punch}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     allow_mobile_punch: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 WFH allowed
//               </label>

//               <select
//                 value={form.wfh_allowed}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     wfh_allowed: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div className="sm:col-span-2">
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Remarks
//               </label>

//               <input
//                 value={form.remarks}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     remarks: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               />
//             </div>

//             <div className="flex items-center gap-2 sm:col-span-2">
//               <input
//                 type="checkbox"
//                 id="is-active"
//                 checked={form.is_active}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     is_active: event.target.checked,
//                   }))
//                 }
//                 className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
//               />

//               <label
//                 htmlFor="is-active"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Active
//               </label>
//             </div>

//             <div className="flex flex-wrap gap-3 sm:col-span-2">
//               <button
//                 type="button"
//                 disabled={saving || loading}
//                 onClick={handleCreate}
//                 className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {saving ? "Saving..." : "Create Config"}
//               </button>

//               <button
//                 type="button"
//                 disabled={saving || loading || !configId}
//                 onClick={handleUpdate}
//                 className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Update Config
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <h2 className="font-semibold text-slate-800">
//               Existing Configs
//             </h2>

//             <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//               {configList.length}{" "}
//               {configList.length === 1 ? "Config" : "Configs"}
//             </span>
//           </div>

//           {listLoading ? (
//             <div className="p-5 text-center text-sm text-slate-500">
//               Loading...
//             </div>
//           ) : configList.length === 0 ? (
//             <div className="px-5 py-16 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
//                 📋
//               </div>

//               <p className="mt-3 font-semibold text-slate-700">
//                 No configs found
//               </p>

//               <p className="mt-1 text-sm text-slate-500">
//                 Create your first attendance config.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-100 bg-slate-50">
//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       #
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Employee
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Grace
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Geo
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Face
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Web
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Mobile
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       WFH
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {configList.map((config, index) => {
//                     const id =
//                       config.config_id || config.id;

//                     return (
//                       <tr
//                         key={id}
//                         className="hover:bg-slate-50"
//                       >
//                         <td className="px-5 py-3 text-slate-500">
//                           {index + 1}
//                         </td>

//                         <td className="px-5 py-3 font-medium text-slate-800">
//                           {getEmployeeName(
//                             config.employee_id
//                           )}
//                         </td>

//                         <td className="px-5 py-3 text-slate-600">
//                           {config.grace_minutes_override ??
//                             "—"}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.geo_fence_required ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.geo_fence_required
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.geo_fence_required
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.face_required ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.face_required
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.face_required
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.allow_web_punch ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.allow_web_punch
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.allow_web_punch
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.allow_mobile_punch ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.allow_mobile_punch
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.allow_mobile_punch
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.wfh_allowed === null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.wfh_allowed
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.wfh_allowed
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.is_active ? (
//                             <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
//                               Active
//                             </span>
//                           ) : (
//                             <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
//                               Inactive
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }};

// export default function EmployeeAttendanceConfigPage() {
//   const [form, setForm] = useState(initialForm);
//   const [configId, setConfigId] = useState("");

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [listLoading, setListLoading] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [employees, setEmployees] = useState([]);
//   const [configList, setConfigList] = useState([]);

//   async function fetchEmployees() {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.get("/api/v1/get/employees", {
//         params: {
//           page: 1,
//           page_size: 100,
//         },
//       });

//       const data = res.data;

//       const list =
//         data?.employees ||
//         data?.data ||
//         data?.items ||
//         data?.results ||
//         [];

//       setEmployees(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setEmployees([]);
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchConfigList() {
//     setListLoading(true);

//     try {
//       const res = await api.get(
//         "/api/v1/get/all/employee/attendance_config"
//       );

//       const data = res.data;

//       const list =
//         data?.configs ||
//         data?.data ||
//         data?.items ||
//         data?.results ||
//         [];

//       setConfigList(Array.isArray(list) ? list : []);
//     } catch (err) {
//       setConfigList([]);
//     } finally {
//       setListLoading(false);
//     }
//   }

//   useEffect(() => {
//     (async () => {
//       await fetchEmployees();
//       await fetchConfigList();
//     })();
//   }, []);

//   const handleCreate = async (event) => {
//     event.preventDefault();

//     if (!form.employee_id.trim()) {
//       setError("Employee ID required");
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     const payload = {
//       employee_id: form.employee_id,
//       grace_minutes_override: form.grace_minutes_override
//         ? Number(form.grace_minutes_override)
//         : null,
//       geo_fence_required: boolOrNull(form.geo_fence_required),
//       face_required: boolOrNull(form.face_required),
//       allow_web_punch: boolOrNull(form.allow_web_punch),
//       allow_mobile_punch: boolOrNull(form.allow_mobile_punch),
//       wfh_allowed: boolOrNull(form.wfh_allowed),
//       remarks: form.remarks || null,
//       is_active: form.is_active,
//     };

//     try {
//       await api.post(
//         "/api/v1/add/employee/attendance_config",
//         payload
//       );

//       setSuccess("Config created successfully");
//       setForm(initialForm);
//       setConfigId("");

//       await fetchConfigList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdate = async (event) => {
//     event.preventDefault();

//     if (!configId.trim()) {
//       setError("Config ID required for update");
//       return;
//     }

//     if (!form.employee_id.trim()) {
//       setError("Employee ID required");
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     const payload = {
//       employee_id: form.employee_id,
//       grace_minutes_override: form.grace_minutes_override
//         ? Number(form.grace_minutes_override)
//         : null,
//       geo_fence_required: boolOrNull(form.geo_fence_required),
//       face_required: boolOrNull(form.face_required),
//       allow_web_punch: boolOrNull(form.allow_web_punch),
//       allow_mobile_punch: boolOrNull(form.allow_mobile_punch),
//       wfh_allowed: boolOrNull(form.wfh_allowed),
//       remarks: form.remarks || null,
//       is_active: form.is_active,
//     };

//     try {
//       await api.put(
//         `/api/v1/update/employee/attendance_config/${configId.trim()}`,
//         payload
//       );

//       setSuccess("Config updated successfully");
//       setForm(initialForm);
//       setConfigId("");

//       await fetchConfigList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSelectConfig = (config) => {
//     if (!config) {
//       setConfigId("");
//       setForm(initialForm);
//       return;
//     }

//     setConfigId(config.config_id || config.id);

//     setForm({
//       employee_id: config.employee_id || "",
//       grace_minutes_override:
//         config.grace_minutes_override ?? "",
//       geo_fence_required:
//         config.geo_fence_required === null
//           ? ""
//           : String(config.geo_fence_required),
//       face_required:
//         config.face_required === null
//           ? ""
//           : String(config.face_required),
//       allow_web_punch:
//         config.allow_web_punch === null
//           ? ""
//           : String(config.allow_web_punch),
//       allow_mobile_punch:
//         config.allow_mobile_punch === null
//           ? ""
//           : String(config.allow_mobile_punch),
//       wfh_allowed:
//         config.wfh_allowed === null
//           ? ""
//           : String(config.wfh_allowed),
//       remarks: config.remarks || "",
//       is_active: config.is_active ?? true,
//     });

//     setError("");
//     setSuccess("");
//   };

//   const getEmployeeName = (employeeId) => {
//     const emp = employees.find(
//       (item) =>
//         String(item.employee_id) === String(employeeId) ||
//         String(item.id) === String(employeeId)
//     );

//     return (
//       emp?.employee_name ||
//       emp?.name ||
//       emp?.full_name ||
//       employeeId
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-slate-800">
//             Employee Attendance Config
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Per-employee attendance settings (null = company default)
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             ⚠️ {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//             ✅ {success}
//           </div>
//         )}

//         <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-100 px-5 py-4">
//             <h2 className="font-semibold text-slate-800">
//               Create / Update Config
//             </h2>
//           </div>

//           <form className="grid gap-4 p-5 sm:grid-cols-2">
//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Employee <span className="text-red-600">*</span>
//               </label>

//               {loading ? (
//                 <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
//               ) : employees.length === 0 ? (
//                 <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
//                   No employees found
//                 </div>
//               ) : (
//                 <select
//                   required
//                   value={form.employee_id}
//                   onChange={(event) =>
//                     setForm((previous) => ({
//                       ...previous,
//                       employee_id: event.target.value,
//                     }))
//                   }
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//                 >
//                   <option value="">Select employee</option>

//                   {employees.map((emp) => {
//                     const empId =
//                       emp.employee_id ||
//                       emp.id ||
//                       emp._id;

//                     const empName =
//                       emp.employee_name ||
//                       emp.name ||
//                       emp.full_name ||
//                       empId;

//                     return (
//                       <option
//                         key={empId}
//                         value={empId}
//                       >
//                         {empName}
//                       </option>
//                     );
//                   })}
//                 </select>
//               )}
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Select Config (for update)
//               </label>

//               {listLoading ? (
//                 <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
//               ) : configList.length === 0 ? (
//                 <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
//                   No configs found
//                 </div>
//               ) : (
//                 <select
//                   value={configId}
//                   onChange={(event) => {
//                     const selected = configList.find(
//                       (item) =>
//                         String(
//                           item.config_id || item.id
//                         ) === String(event.target.value)
//                     );

//                     handleSelectConfig(selected || null);
//                   }}
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//                 >
//                   <option value="">-- Select config --</option>

//                   {configList.map((config) => {
//                     const id = config.config_id || config.id;

//                     const empName = getEmployeeName(
//                       config.employee_id
//                     );

//                     return (
//                       <option key={id} value={id}>
//                         {empName} ({id.slice(0, 8)}...)
//                       </option>
//                     );
//                   })}
//                 </select>
//               )}
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Grace minutes override
//               </label>

//               <input
//                 type="number"
//                 min="0"
//                 max="1440"
//                 value={form.grace_minutes_override}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     grace_minutes_override: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               />

//               <p className="mt-1 text-xs text-slate-400">
//                 Leave empty for company default
//               </p>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Geo fence required
//               </label>

//               <select
//                 value={form.geo_fence_required}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     geo_fence_required: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Face required
//               </label>

//               <select
//                 value={form.face_required}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     face_required: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Allow web punch
//               </label>

//               <select
//                 value={form.allow_web_punch}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     allow_web_punch: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Allow mobile punch
//               </label>

//               <select
//                 value={form.allow_mobile_punch}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     allow_mobile_punch: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 WFH allowed
//               </label>

//               <select
//                 value={form.wfh_allowed}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     wfh_allowed: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               >
//                 <option value="">Company default</option>
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>

//             <div className="sm:col-span-2">
//               <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                 Remarks
//               </label>

//               <input
//                 value={form.remarks}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     remarks: event.target.value,
//                   }))
//                 }
//                 className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//               />
//             </div>

//             <div className="flex items-center gap-2 sm:col-span-2">
//               <input
//                 type="checkbox"
//                 id="is-active"
//                 checked={form.is_active}
//                 onChange={(event) =>
//                   setForm((previous) => ({
//                     ...previous,
//                     is_active: event.target.checked,
//                   }))
//                 }
//                 className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
//               />

//               <label
//                 htmlFor="is-active"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Active
//               </label>
//             </div>

//             <div className="flex flex-wrap gap-3 sm:col-span-2">
//               <button
//                 type="button"
//                 disabled={saving || loading}
//                 onClick={handleCreate}
//                 className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {saving ? "Saving..." : "Create Config"}
//               </button>

//               <button
//                 type="button"
//                 disabled={saving || loading || !configId}
//                 onClick={handleUpdate}
//                 className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Update Config
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <h2 className="font-semibold text-slate-800">
//               Existing Configs
//             </h2>

//             <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//               {configList.length}{" "}
//               {configList.length === 1 ? "Config" : "Configs"}
//             </span>
//           </div>

//           {listLoading ? (
//             <div className="p-5 text-center text-sm text-slate-500">
//               Loading...
//             </div>
//           ) : configList.length === 0 ? (
//             <div className="px-5 py-16 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
//                 📋
//               </div>

//               <p className="mt-3 font-semibold text-slate-700">
//                 No configs found
//               </p>

//               <p className="mt-1 text-sm text-slate-500">
//                 Create your first attendance config.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-100 bg-slate-50">
//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       #
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Employee
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Grace
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Geo
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Face
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Web
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Mobile
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       WFH
//                     </th>

//                     <th className="px-5 py-3 font-semibold text-slate-500">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {configList.map((config, index) => {
//                     const id =
//                       config.config_id || config.id;

//                     return (
//                       <tr
//                         key={id}
//                         className="hover:bg-slate-50"
//                       >
//                         <td className="px-5 py-3 text-slate-500">
//                           {index + 1}
//                         </td>

//                         <td className="px-5 py-3 font-medium text-slate-800">
//                           {getEmployeeName(
//                             config.employee_id
//                           )}
//                         </td>

//                         <td className="px-5 py-3 text-slate-600">
//                           {config.grace_minutes_override ??
//                             "—"}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.geo_fence_required ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.geo_fence_required
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.geo_fence_required
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.face_required ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.face_required
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.face_required
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.allow_web_punch ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.allow_web_punch
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.allow_web_punch
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.allow_mobile_punch ===
//                           null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.allow_mobile_punch
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.allow_mobile_punch
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.wfh_allowed === null ? (
//                             <span className="text-slate-400">
//                               —
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 config.wfh_allowed
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }
//                             >
//                               {config.wfh_allowed
//                                 ? "Yes"
//                                 : "No"}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-3">
//                           {config.is_active ? (
//                             <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
//                               Active
//                             </span>
//                           ) : (
//                             <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
//                               Inactive
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

/**
 * EmployeeAttendanceConfigPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ Per-employee overrides (null = inherit company policy)
 *  ✓ Searchable employee dropdown (with "already configured" indicator)
 *  ✓ Tri-state selectors (Inherit / Yes / No) — clearly distinct from false
 *  ✓ Edit-in-place (click row → fills form)
 *  ✓ Delete/clear overrides
 *  ✓ Config summary table with effective values (vs policy defaults)
 *  ✓ Validation + duplicate prevention
 *  ✓ Search + pagination + role guard (admin only)
 *  ✓ Mobile responsive
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 450;
const AUTO_DISMISS_MS = 5000;

/**
 * Tri-state options: "" means inherit from policy.
 */
const TRI_OPTIONS = [
  { value: "", label: "Inherit from policy" },
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const EMPTY_FORM = {
  employee_id: "",
  grace_minutes_override: "",
  geo_fence_required: "",
  face_required: "",
  allow_web_punch: "",
  allow_mobile_punch: "",
  wfh_allowed: "",
  remarks: "",
  is_active: true,
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg || "Error";
      })
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const triToBool = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return null;
};

const boolToTri = (v) => {
  if (v === null || v === undefined) return "";
  if (v === true) return "true";
  if (v === false) return "false";
  return "";
};

const extractList = (res) => {
  const data = res?.data ?? {};
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.configs))
    return { items: data.configs, total: Number(data.total) || data.configs.length };
  if (Array.isArray(data.data))
    return { items: data.data, total: Number(data.total) || data.data.length };
  if (Array.isArray(data.items))
    return { items: data.items, total: Number(data.total) || data.items.length };
  return { items: [], total: 0 };
};

const extractEmployees = (res) => {
  const data = res?.data ?? {};
  const arr =
    (Array.isArray(data) && data) ||
    data.employees ||
    data.data ||
    data.items ||
    data.result ||
    [];
  return arr.map((e) => {
    const id = e.employee_id || e.id || e.user_id || "";
    const name =
      e.full_name ||
      e.name ||
      e.employee_name ||
      `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
      id;
    return { id, name, email: e.email || e.company_email || "" };
  });
};

const badgeForTri = (v) => {
  if (v === null || v === undefined) {
    return { label: "Inherit", cls: "bg-slate-100 text-slate-600" };
  }
  if (v === true) {
    return { label: "Yes", cls: "bg-green-50 text-green-700" };
  }
  return { label: "No", cls: "bg-red-50 text-red-700" };
};

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTS
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
      <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function EmployeeDropdown({
  value,
  onChange,
  options,
  placeholder = "Select employee...",
  disabled,
  highlightConfigured = [],
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = query.trim()
    ? options.filter((o) => {
        const q = query.toLowerCase();
        return o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
      })
    : options;

  const selected = options.find((o) => o.id === value);

  const configuredSet = useMemo(
    () => new Set(highlightConfigured),
    [highlightConfigured]
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm focus:border-red-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {selected ? `${selected.name} (${selected.id})` : placeholder}
        </span>
        <span className="text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No employees found
              </div>
            ) : (
              filtered.map((e) => {
                const isConfigured = configuredSet.has(e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      onChange(e.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      e.id === value ? "bg-red-50/40" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-700">
                        {e.name}
                      </div>
                      <div className="truncate text-[11px] text-slate-400">
                        {e.email || e.id}
                      </div>
                    </div>
                    {isConfigured && (
                      <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        ✓ Config
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TriSelect({ value, onChange, label, hint }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
      >
        {TRI_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function Badge({ value }) {
  const b = badgeForTri(value);
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${b.cls}`}>
      {b.label}
    </span>
  );
}

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="px-3 text-xs text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function EmployeeAttendanceConfigPage() {
  const role = String(
    useAuthStore((s) => s.user?.role?.value || s.user?.role || "")
  ).toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";

  /* list */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /* employees */
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  /* form */
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  /* notifications */
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* confirm remove */
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOAD EMPLOYEES ══════════════ */
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setEmpLoading(true);
      try {
        const res = await api.get("/api/v1/get/employees", {
          params: { page: 1, page_size: 500 },
        });
        if (!cancelled) setEmployees(extractEmployees(res));
      } catch {
        if (!cancelled) setEmployees([]);
      } finally {
        if (!cancelled) setEmpLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  /* ══════════════ FETCH CONFIGS ══════════════ */
  const fetchList = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setError("");
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.search = search;
      const res = await api.get("/api/v1/get/all/employee/attendance_config", {
        params,
      });
      if (myReqId !== reqIdRef.current) return;
      const { items, total: t } = extractList(res);
      setList(items);
      setTotal(t);
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      // 404 with empty list is not a real error for first load
      const status = err?.response?.status;
      if (status !== 404) setError(formatApiError(err));
      setList([]);
      setTotal(0);
    }
  }, [page, search]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchList();
      return;
    }
    const t = setTimeout(fetchList, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchList]);

  /* ══════════════ HELPERS ══════════════ */
  const getEmpName = useCallback(
    (id) => {
      if (!id) return "—";
      const e = employees.find((x) => x.id === id);
      return e ? e.name : id;
    },
    [employees]
  );

  const configuredIds = useMemo(
    () => list.map((c) => c.employee_id).filter(Boolean),
    [list]
  );

  /* ══════════════ FORM ACTIONS ══════════════ */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormError("");
  };

  const loadConfigIntoForm = (config) => {
    setEditId(config.config_id || config.id);
    setForm({
      employee_id: config.employee_id || "",
      grace_minutes_override:
        config.grace_minutes_override ?? "",
      geo_fence_required: boolToTri(config.geo_fence_required),
      face_required: boolToTri(config.face_required),
      allow_web_punch: boolToTri(config.allow_web_punch),
      allow_mobile_punch: boolToTri(config.allow_mobile_punch),
      wfh_allowed: boolToTri(config.wfh_allowed),
      remarks: config.remarks || "",
      is_active: config.is_active !== false,
    });
    setFormError("");
    setSuccess("");
    setError("");
  };

  const validate = () => {
    if (!form.employee_id) return "Please select an employee";

    const g = form.grace_minutes_override;
    if (g !== "" && g !== null) {
      const n = Number(g);
      if (!Number.isFinite(n) || n < 0 || n > 1440) {
        return "Grace override must be between 0 and 1440 minutes";
      }
    }

    // If creating and employee already has config → block
    if (!editId && configuredIds.includes(form.employee_id)) {
      return "This employee already has a config. Select it from the table to edit.";
    }

    return "";
  };

  const buildPayload = () => ({
    employee_id: form.employee_id,
    grace_minutes_override:
      form.grace_minutes_override === ""
        ? null
        : Number(form.grace_minutes_override),
    geo_fence_required: triToBool(form.geo_fence_required),
    face_required: triToBool(form.face_required),
    allow_web_punch: triToBool(form.allow_web_punch),
    allow_mobile_punch: triToBool(form.allow_mobile_punch),
    wfh_allowed: triToBool(form.wfh_allowed),
    remarks: form.remarks.trim() || null,
    is_active: !!form.is_active,
  });

  const handleCreate = async () => {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      await api.post("/api/v1/add/employee/attendance_config", buildPayload());
      setSuccess("Config created");
      resetForm();
      setPage(1);
      fetchList();
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editId) {
      setFormError("Select a config from the table to update");
      return;
    }
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      await api.put(
        `/api/v1/update/employee/attendance_config/${editId}`,
        buildPayload()
      );
      setSuccess("Config updated");
      resetForm();
      fetchList();
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirmRemove) return;
    setRemoving(true);
    try {
      const id = confirmRemove.config_id || confirmRemove.id;
      await api.delete(`/api/v1/delete/employee/attendance_config/${id}`);
      setSuccess("Config removed — employee now uses company defaults");
      setConfirmRemove(null);
      if (editId === id) resetForm();
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setRemoving(false);
    }
  };

  /* ══════════════ DERIVED ══════════════ */
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  /* ══════════════ ROLE GUARD ══════════════ */
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-3 text-lg font-semibold text-slate-800">
            Admin Access Required
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Only administrators can manage per-employee overrides.
          </p>
        </div>
      </div>
    );
  }

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Employee Attendance Config
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Per-employee overrides — leave any field as{" "}
              <strong>Inherit</strong> to use company policy
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} configured
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchList}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Toast */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Info banner */}
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
          <p className="font-medium">How overrides work</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>
              <strong>Inherit</strong> — uses the value from the active company
              attendance policy
            </li>
            <li>
              <strong>Yes</strong> / <strong>No</strong> — overrides policy for
              this employee only
            </li>
            <li>
              Grace override replaces policy grace_minutes (minutes)
            </li>
          </ul>
        </div>

        {/* Form */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {editId ? "Edit Config" : "Create Config"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {editId
                  ? "Editing an existing config — changes apply immediately"
                  : "Set overrides for a new employee"}
              </p>
            </div>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="p-5">
            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Employee */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Employee <span className="text-red-600">*</span>
                </label>
                <EmployeeDropdown
                  value={form.employee_id}
                  onChange={(v) => setForm((p) => ({ ...p, employee_id: v }))}
                  options={employees}
                  disabled={!!editId}
                  placeholder={empLoading ? "Loading employees..." : "Select employee..."}
                  highlightConfigured={configuredIds}
                />
              </div>

              {/* Grace override */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Grace Minutes Override
                </label>
                <input
                  type="number"
                  min={0}
                  max={1440}
                  value={form.grace_minutes_override}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      grace_minutes_override: e.target.value,
                    }))
                  }
                  placeholder="Leave empty to use policy value"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  If set, this replaces the policy&apos;s grace_minutes for this employee
                </p>
              </div>

              {/* Tri-state overrides */}
              <TriSelect
                label="Geo-fence Required"
                value={form.geo_fence_required}
                onChange={(v) => setForm((p) => ({ ...p, geo_fence_required: v }))}
                hint="Override whether this employee must be inside a fence"
              />
              <TriSelect
                label="Face Required"
                value={form.face_required}
                onChange={(v) => setForm((p) => ({ ...p, face_required: v }))}
                hint="Force face verification even if policy says no"
              />
              <TriSelect
                label="Allow Web Punch"
                value={form.allow_web_punch}
                onChange={(v) => setForm((p) => ({ ...p, allow_web_punch: v }))}
                hint="Block or allow browser punches"
              />
              <TriSelect
                label="Allow Mobile Punch"
                value={form.allow_mobile_punch}
                onChange={(v) =>
                  setForm((p) => ({ ...p, allow_mobile_punch: v }))
                }
                hint="Block or allow mobile app punches"
              />
              <TriSelect
                label="WFH Allowed"
                value={form.wfh_allowed}
                onChange={(v) => setForm((p) => ({ ...p, wfh_allowed: v }))}
                hint="Enable/disable WFH for this employee"
              />

              {/* Remarks */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Remarks
                </label>
                <input
                  value={form.remarks}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, remarks: e.target.value }))
                  }
                  maxLength={200}
                  placeholder="e.g. New joinee grace extension"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Active toggle */}
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, is_active: e.target.checked }))
                    }
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      Active
                    </div>
                    <div className="text-[11px] text-slate-500">
                      When inactive, employee falls back to company policy
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
              {editId && (
                <button
                  type="button"
                  onClick={() => setConfirmRemove({ config_id: editId })}
                  className="mr-auto rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Remove Override
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {editId ? "Cancel" : "Reset"}
              </button>
              {editId ? (
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Update Config"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create Config"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <div className="relative min-w-[220px] max-w-xs flex-1">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by employee..."
                className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
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
            <span className="ml-3 shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {total} {total === 1 ? "Config" : "Configs"}
            </span>
          </div>

          <div className="overflow-x-auto">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📋
                </div>
                <p className="text-sm font-medium text-slate-700">
                  No configs yet
                </p>
                <p className="text-xs text-slate-500">
                  All employees are using company defaults
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Grace</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Geo</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Face</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Web</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Mobile</th>
                    <th className="px-5 py-3 font-medium text-slate-500">WFH</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row, i) => {
                    const id = row.config_id || row.id || i;
                    const isEditing = editId === id;
                    return (
                      <tr
                        key={id}
                        className={`transition-colors ${
                          isEditing ? "bg-red-50/40" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-700">
                            {getEmpName(row.employee_id)}
                          </div>
                          {row.remarks && (
                            <div
                              className="mt-0.5 max-w-[200px] truncate text-[11px] text-slate-400"
                              title={row.remarks}
                            >
                              {row.remarks}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {row.grace_minutes_override ?? (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge value={row.geo_fence_required} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge value={row.face_required} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge value={row.allow_web_punch} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge value={row.allow_mobile_punch} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge value={row.wfh_allowed} />
                        </td>
                        <td className="px-5 py-3.5">
                          {row.is_active !== false ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => loadConfigIntoForm(row)}
                            className="text-xs font-medium text-slate-600 hover:text-red-600"
                          >
                            {isEditing ? "Editing…" : "Edit"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {list.length > 0 && totalPages > 1 && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* Confirm remove */}
      {confirmRemove && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !removing && setConfirmRemove(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-800">
              Remove Override?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              This employee will fall back to company-wide attendance policy.
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmRemove(null)}
                disabled={removing}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={removing}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {removing ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}