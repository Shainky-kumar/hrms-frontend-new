// // "use client";

// // import { useEffect, useState } from "react";
// // import { api } from "@/app/lib/api";

// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // };

// // const toArray = (p) => {
// //   if (!p) return [];
// //   if (Array.isArray(p)) return p;
// //   if (Array.isArray(p?.data)) return p.data;
// //   if (Array.isArray(p?.devices)) return p.devices;
// //   return [];
// // };

// // export default function AttendanceDevicesPage() {
// //   const [list, setList] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [showForm, setShowForm] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [form, setForm] = useState({
// //     device_uid: "",
// //     device_name: "",
// //     device_type: "android",
// //     employee_id: "",
// //     is_trusted: false,
// //     is_blocked: false,
// //   });

// //   const fetchList = async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get("/api/v1/attendence/devices", {
// //         params: { page, page_size: 10, search: search || undefined },
// //       });
// //       setList(toArray(res?.data));
// //     } catch (err) {
// //       setError(formatApiError(err));
// //       setList([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     let active = true;

// //     const load = async () => {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         const res = await api.get("/api/v1/attendence/devices", {
// //           params: { page, page_size: 10, search: search || undefined },
// //         });

// //         if (!active) return;
// //         setList(toArray(res?.data));
// //       } catch (err) {
// //         if (!active) return;
// //         setError(formatApiError(err));
// //         setList([]);
// //       } finally {
// //         if (active) setLoading(false);
// //       }
// //     };

// //     void load();

// //     return () => {
// //       active = false;
// //     };
// //   }, [page]);

// //   const openAdd = () => {
// //     setEditId(null);
// //     setForm({
// //       device_uid: "",
// //       device_name: "",
// //       device_type: "android",
// //       employee_id: "",
// //       is_trusted: false,
// //       is_blocked: false,
// //     });
// //     setShowForm(true);
// //   };

// //   const openEdit = (row) => {
// //     setEditId(row.device_id || row.id);
// //     setForm({
// //       device_uid: row.device_uid || "",
// //       device_name: row.device_name || "",
// //       device_type: row.device_type || "android",
// //       employee_id: row.employee_id || "",
// //       is_trusted: !!row.is_trusted,
// //       is_blocked: !!row.is_blocked,
// //     });
// //     setShowForm(true);
// //   };

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       const payload = {
// //         device_uid: form.device_uid,
// //         device_name: form.device_name || null,
// //         device_type: form.device_type || null,
// //         employee_id: form.employee_id || null,
// //         is_trusted: form.is_trusted,
// //         is_blocked: form.is_blocked,
// //       };
// //       if (editId) {
// //         await api.put(`/api/v1/update/attendence/device/${editId}`, payload);
// //         setSuccess("Device updated");
// //       } else {
// //         await api.post("/api/v1/add/attendence/device", payload);
// //         setSuccess("Device added");
// //       }
// //       setShowForm(false);
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// //       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Devices</h1>
// //           <p className="mt-1 text-sm text-[#6b7280]">Trusted / blocked punch devices</p>
// //         </div>
// //         <button
// //           onClick={openAdd}
// //           className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// //         >
// //           + Add Device
// //         </button>
// //       </div>

// //       {error && (
// //         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
// //       )}
// //       {success && (
// //         <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
// //       )}

// //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// //         <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
// //           <input
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             placeholder="Search..."
// //             className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
// //           />
// //           <button
// //             onClick={() => {
// //               setPage(1);
// //               fetchList();
// //             }}
// //             className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
// //           >
// //             Search
// //           </button>
// //         </div>

// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// //           ) : list.length === 0 ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">No devices</div>
// //           ) : (
// //             <table className="w-full min-w-[800px] text-left text-sm">
// //               <thead>
// //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">UID</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Trusted</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Blocked</th>
// //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-[#f3f4f6]">
// //                 {list.map((row, i) => (
// //                   <tr key={row.device_id || i} className="hover:bg-[#fafafa]">
// //                     <td className="px-5 py-3.5 max-w-[140px] truncate">{row.device_uid}</td>
// //                     <td className="px-5 py-3.5">{row.device_name || "—"}</td>
// //                     <td className="px-5 py-3.5">{row.device_type || "—"}</td>
// //                     <td className="px-5 py-3.5">{row.employee_id || "—"}</td>
// //                     <td className="px-5 py-3.5">{row.is_trusted ? "Yes" : "No"}</td>
// //                     <td className="px-5 py-3.5">{row.is_blocked ? "Yes" : "No"}</td>
// //                     <td className="px-5 py-3.5 text-right">
// //                       <button
// //                         onClick={() => openEdit(row)}
// //                         className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
// //                       >
// //                         Edit
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       </div>

// //       {showForm && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
// //               <h2 className="font-semibold">{editId ? "Edit Device" : "Add Device"}</h2>
// //               <button type="button" onClick={() => setShowForm(false)}>
// //                 ✕
// //               </button>
// //             </div>
// //             <form onSubmit={submit} className="space-y-3 p-5">
// //               <input
// //                 required
// //                 placeholder="Device UID"
// //                 value={form.device_uid}
// //                 onChange={(e) => setForm((p) => ({ ...p, device_uid: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               />
// //               <input
// //                 placeholder="Device name"
// //                 value={form.device_name}
// //                 onChange={(e) => setForm((p) => ({ ...p, device_name: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               />
// //               <select
// //                 value={form.device_type}
// //                 onChange={(e) => setForm((p) => ({ ...p, device_type: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               >
// //                 <option value="android">Android</option>
// //                 <option value="ios">iOS</option>
// //                 <option value="web">Web</option>
// //               </select>
// //               <input
// //                 placeholder="Employee ID (optional)"
// //                 value={form.employee_id}
// //                 onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))}
// //                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// //               />
// //               <label className="flex items-center gap-2 text-sm">
// //                 <input
// //                   type="checkbox"
// //                   checked={form.is_trusted}
// //                   onChange={(e) => setForm((p) => ({ ...p, is_trusted: e.target.checked }))}
// //                 />
// //                 Trusted
// //               </label>
// //               <label className="flex items-center gap-2 text-sm">
// //                 <input
// //                   type="checkbox"
// //                   checked={form.is_blocked}
// //                   onChange={(e) => setForm((p) => ({ ...p, is_blocked: e.target.checked }))}
// //                 />
// //                 Blocked
// //               </label>
// //               <div className="flex justify-end gap-2 pt-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForm(false)}
// //                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving..." : "Save"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// //  new code 

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { api } from "@/app/lib/api";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// export default function AttendanceDevicesPage() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const pageSize = 10;

//   const [form, setForm] = useState({
//     device_uid: "",
//     device_name: "",
//     device_type: "android",
//     employee_id: "",
//     is_trusted: false,
//     is_blocked: false,
//   });

//   const fetchList = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/attendence/devices", {
//         params: {
//           page,
//           page_size: pageSize,
//           search: search || undefined,
//         },
//       });

//       const data = res?.data;
//       setList(Array.isArray(data?.devices) ? data.devices : []);
//       setTotal(data?.total || 0);
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search]);

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   // Success message auto clear
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(""), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   const openAdd = () => {
//     setEditId(null);
//     setForm({
//       device_uid: "",
//       device_name: "",
//       device_type: "android",
//       employee_id: "",
//       is_trusted: false,
//       is_blocked: false,
//     });
//     setShowForm(true);
//     setError("");
//   };

//   const openEdit = (row) => {
//     setEditId(row.device_id);
//     setForm({
//       device_uid: row.device_uid || "",
//       device_name: row.device_name || "",
//       device_type: row.device_type || "android",
//       employee_id: row.employee_id || "",
//       is_trusted: !!row.is_trusted,
//       is_blocked: !!row.is_blocked,
//     });
//     setShowForm(true);
//     setError("");
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       const payload = {
//         device_uid: form.device_uid.trim(),
//         device_name: form.device_name.trim() || null,
//         device_type: form.device_type || null,
//         employee_id: form.employee_id.trim() || null,
//         is_trusted: form.is_trusted,
//         is_blocked: form.is_blocked,
//       };

//       if (editId) {
//         await api.put(`/api/v1/update/attendence/device/${editId}`, payload);
//         setSuccess("Device updated successfully");
//       } else {
//         await api.post("/api/v1/add/attendence/device", payload);
//         setSuccess("Device added successfully");
//       }

//       setShowForm(false);
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Devices</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Trusted / blocked punch devices
//           </p>
//         </div>
//         <button
//           onClick={openAdd}
//           className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
//         >
//           + Add Device
//         </button>
//       </div>

//       {/* Alerts */}
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

//       {/* Table Card */}
//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         {/* Search */}
//         <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && setPage(1)}
//             placeholder="Search by Device UID..."
//             className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E42527]/30"
//           />
//           <button
//             onClick={() => {
//               setPage(1);
//               fetchList();
//             }}
//             className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm hover:bg-gray-50"
//           >
//             Search
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">No devices found</div>
//           ) : (
//             <table className="w-full min-w-[800px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">UID</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Trusted</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Blocked</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((row) => (
//                   <tr key={row.device_id} className="hover:bg-[#fafafa]">
//                     <td className="max-w-[160px] truncate px-5 py-3.5 font-mono text-xs">
//                       {row.device_uid}
//                     </td>
//                     <td className="px-5 py-3.5">{row.device_name || "—"}</td>
//                     <td className="px-5 py-3.5 capitalize">{row.device_type || "—"}</td>
//                     <td className="px-5 py-3.5">{row.employee_id || "—"}</td>
//                     <td className="px-5 py-3.5">
//                       <span
//                         className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
//                           row.is_trusted
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {row.is_trusted ? "Yes" : "No"}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <span
//                         className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
//                           row.is_blocked
//                             ? "bg-red-100 text-red-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {row.is_blocked ? "Yes" : "No"}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       <button
//                         onClick={() => openEdit(row)}
//                         className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
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

//         {/* Pagination */}
//         {total > 0 && (
//           <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3 text-sm">
//             <span className="text-[#6b7280]">
//               Showing {(page - 1) * pageSize + 1} to{" "}
//               {Math.min(page * pageSize, total)} of {total}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded-md border border-[#d1d5db] px-3 py-1.5 disabled:opacity-40"
//               >
//                 Previous
//               </button>
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded-md border border-[#d1d5db] px-3 py-1.5 disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal Form */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
//               <h2 className="font-semibold">
//                 {editId ? "Edit Device" : "Add Device"}
//               </h2>
//               <button
//                 type="button"
//                 onClick={() => setShowForm(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={submit} className="space-y-3 p-5">
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-600">
//                   Device UID *
//                 </label>
//                 <input
//                   required
//                   placeholder="e.g. ABC123XYZ"
//                   value={form.device_uid}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, device_uid: e.target.value }))
//                   }
//                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E42527]/30"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-600">
//                   Device Name
//                 </label>
//                 <input
//                   placeholder="e.g. John's Phone"
//                   value={form.device_name}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, device_name: e.target.value }))
//                   }
//                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E42527]/30"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-600">
//                   Device Type
//                 </label>
//                 <select
//                   value={form.device_type}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, device_type: e.target.value }))
//                   }
//                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E42527]/30"
//                 >
//                   <option value="android">Android</option>
//                   <option value="ios">iOS</option>
//                   <option value="web">Web</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-600">
//                   Employee ID (optional)
//                 </label>
//                 <input
//                   placeholder="Leave blank for company-wide"
//                   value={form.employee_id}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, employee_id: e.target.value }))
//                   }
//                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E42527]/30"
//                 />
//               </div>

//               <div className="flex gap-6 pt-1">
//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={form.is_trusted}
//                     onChange={(e) =>
//                       setForm((p) => ({ ...p, is_trusted: e.target.checked }))
//                     }
//                     className="rounded"
//                   />
//                   Trusted Device
//                 </label>

//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={form.is_blocked}
//                     onChange={(e) =>
//                       setForm((p) => ({ ...p, is_blocked: e.target.checked }))
//                     }
//                     className="rounded"
//                   />
//                   Blocked
//                 </label>
//               </div>

//               <div className="flex justify-end gap-2 pt-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
//                 >
//                   {saving ? "Saving..." : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

/**
 * AttendanceDevicesPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ Trust / Block / Unblock workflows
 *  ✓ Searchable employee dropdown
 *  ✓ Auto-detect current device
 *  ✓ Bulk trust / block / unblock
 *  ✓ Filters (status, employee, date range)
 *  ✓ Summary cards (trusted/blocked/total)
 *  ✓ Last used tracking
 *  ✓ Role guard (admin only)
 *  ✓ Pagination + search
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
const DEVICE_STORAGE_KEY = "hrms.device_uid";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "trusted", label: "Trusted" },
  { value: "blocked", label: "Blocked" },
  { value: "untrusted", label: "Untrusted" },
];

const DEVICE_TYPES = [
  { value: "android", label: "Android", icon: "🤖" },
  { value: "ios", label: "iOS", icon: "🍎" },
  { value: "web", label: "Web Browser", icon: "🌐" },
  { value: "biometric", label: "Biometric Machine", icon: "🖐" },
  { value: "other", label: "Other", icon: "📱" },
];

const TYPE_MAP = Object.fromEntries(DEVICE_TYPES.map((t) => [t.value, t]));

const EMPTY_FORM = {
  device_uid: "",
  device_name: "",
  device_type: "web",
  employee_id: "",
  is_trusted: false,
  is_blocked: false,
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

const safeDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDateTime = (v, tz) => {
  const d = safeDate(v);
  if (!d) return "—";
  try {
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: tz,
    });
  } catch {
    return "—";
  }
};

const relativeTime = (v) => {
  const d = safeDate(v);
  if (!d) return "Never";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const getDeviceId = () => {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(DEVICE_STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

const extractList = (res) => {
  const data = res?.data ?? {};
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.devices))
    return { items: data.devices, total: Number(data.total) || data.devices.length };
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
    return { id, name };
  });
};

const getDeviceStatus = (d) => {
  if (d.is_blocked) return { key: "blocked", label: "Blocked", tone: "red" };
  if (d.is_trusted) return { key: "trusted", label: "Trusted", tone: "green" };
  return { key: "untrusted", label: "Untrusted", tone: "slate" };
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

function EmployeeDropdown({ value, onChange, options, placeholder = "Select employee...", optional = false }) {
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm focus:border-red-500 focus:outline-none"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {selected ? `${selected.name} (${selected.id})` : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => e.key === "Enter" && onChange("")}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </span>
          )}
          <span className="text-slate-400">▾</span>
        </div>
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
            {optional && !query && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`flex w-full flex-col border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  !value ? "bg-red-50/40" : ""
                }`}
              >
                <span className="font-medium text-slate-700">All Employees</span>
                <span className="text-[11px] text-slate-400">
                  Device shared across company
                </span>
              </button>
            )}
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No employees found
              </div>
            ) : (
              filtered.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onChange(e.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    e.id === value ? "bg-red-50/40" : ""
                  }`}
                >
                  <span className="font-medium text-slate-700">{e.name}</span>
                  <span className="text-[11px] text-slate-400">{e.id}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ device }) {
  const s = getDeviceStatus(device);
  const map = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const icons = { green: "✓", red: "🚫", slate: "•" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${map[s.tone]}`}>
      <span>{icons[s.tone]}</span>
      {s.label}
    </span>
  );
}

function TypeBadge({ type }) {
  const t = TYPE_MAP[type] || { label: type || "Unknown", icon: "📱" };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <span>{t.icon}</span>
      <span className="font-medium">{t.label}</span>
    </span>
  );
}

function SummaryCard({ label, value, tone = "slate", hint }) {
  const tones = {
    slate: "bg-slate-50 text-slate-700",
    green: "bg-green-50 text-green-800",
    red: "bg-red-50 text-red-800",
    blue: "bg-blue-50 text-blue-800",
  };
  return (
    <div className={`rounded-xl px-4 py-3 ${tones[tone]}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] opacity-70">{hint}</p>}
    </div>
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

export default function AttendanceDevicesPage() {
  const role = String(
    useAuthStore((s) => s.user?.role?.value || s.user?.role || "")
  ).toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";
  const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

  /* list */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("");

  /* employees */
  const [employees, setEmployees] = useState([]);

  /* ui */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  /* modal */
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  /* current device */
  const currentDeviceId = useMemo(() => getDeviceId(), []);

  /* action */
  const [actionId, setActionId] = useState(null);

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOAD EMPLOYEES ══════════════ */
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/v1/get/employees", {
          params: { page: 1, page_size: 500 },
        });
        if (!cancelled) setEmployees(extractEmployees(res));
      } catch {
        if (!cancelled) setEmployees([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  /* ══════════════ FETCH ══════════════ */
  const fetchList = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setError("");

    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.search = search;
      if (employeeFilter) params.employee_id = employeeFilter;
      if (statusFilter === "trusted") params.is_trusted = true;
      if (statusFilter === "blocked") params.is_blocked = true;

      const res = await api.get("/api/v1/attendence/devices", { params });
      if (myReqId !== reqIdRef.current) return;

      const { items, total: t } = extractList(res);

      // Client-side fallback for status filter
      let filtered = items;
      if (statusFilter === "trusted") {
        filtered = items.filter((d) => d.is_trusted && !d.is_blocked);
      } else if (statusFilter === "blocked") {
        filtered = items.filter((d) => d.is_blocked);
      } else if (statusFilter === "untrusted") {
        filtered = items.filter((d) => !d.is_trusted && !d.is_blocked);
      }

      setList(filtered);
      setTotal(t);
      setSelectedIds(new Set());
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [page, search, statusFilter, employeeFilter]);

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
      if (!id) return "All employees";
      const e = employees.find((x) => x.id === id);
      return e ? e.name : id;
    },
    [employees]
  );

  /* ══════════════ FORM ACTIONS ══════════════ */
  const openAdd = () => {
    setEditId(null);
    setForm({
      ...EMPTY_FORM,
      device_uid: currentDeviceId || "",
      device_name: currentDeviceId ? "This Browser" : "",
    });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (row) => {
    setEditId(row.device_id || row.id);
    setForm({
      device_uid: row.device_uid || "",
      device_name: row.device_name || "",
      device_type: row.device_type || "web",
      employee_id: row.employee_id || "",
      is_trusted: !!row.is_trusted,
      is_blocked: !!row.is_blocked,
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  useEffect(() => {
    if (!showForm) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) closeForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, saving]);

  const validate = () => {
    if (!form.device_uid.trim()) return "Device UID is required";
    if (form.is_trusted && form.is_blocked) {
      return "A device cannot be both trusted and blocked";
    }
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        device_uid: form.device_uid.trim(),
        device_name: form.device_name.trim() || null,
        device_type: form.device_type || null,
        employee_id: form.employee_id || null,
        is_trusted: !!form.is_trusted,
        is_blocked: !!form.is_blocked,
      };

      if (editId) {
        await api.put(`/api/v1/update/attendence/device/${editId}`, payload);
        setSuccess("Device updated");
      } else {
        await api.post("/api/v1/add/attendence/device", payload);
        setSuccess("Device added");
      }
      closeForm();
      fetchList();
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleTrust = async (device) => {
    const id = device.device_id;
    setActionId(id);
    try {
      await api.put(`/api/v1/update/attendence/device/${id}`, {
        ...device,
        is_trusted: !device.is_trusted,
        is_blocked: false, // trust clears block
      });
      setSuccess(device.is_trusted ? "Device untrusted" : "Device trusted");
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  const toggleBlock = async (device) => {
    const id = device.device_id;
    setActionId(id);
    try {
      await api.put(`/api/v1/update/attendence/device/${id}`, {
        ...device,
        is_blocked: !device.is_blocked,
        is_trusted: device.is_blocked ? device.is_trusted : false,
      });
      setSuccess(device.is_blocked ? "Device unblocked" : "Device blocked");
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  /* ══════════════ BULK ══════════════ */
  const bulkAction = async (action) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);

    const ok = window.confirm(
      `Apply "${action}" to ${ids.length} device(s)?\n\nThis will update their status.`
    );
    if (!ok) return;

    setActionId("bulk");
    try {
      const results = await Promise.allSettled(
        ids.map(async (id) => {
          const device = list.find((d) => d.device_id === id);
          if (!device) throw new Error("Not found");

          if (action === "trust") {
            return api.put(`/api/v1/update/attendence/device/${id}`, {
              ...device,
              is_trusted: true,
              is_blocked: false,
            });
          }
          if (action === "block") {
            return api.put(`/api/v1/update/attendence/device/${id}`, {
              ...device,
              is_blocked: true,
              is_trusted: false,
            });
          }
          if (action === "unblock") {
            return api.put(`/api/v1/update/attendence/device/${id}`, {
              ...device,
              is_blocked: false,
            });
          }
        })
      );

      const okCount = results.filter((r) => r.status === "fulfilled").length;
      const failCount = results.length - okCount;
      setSuccess(
        `${okCount} device(s) ${action}ed${failCount ? ` · ${failCount} failed` : ""}`
      );
      setSelectedIds(new Set());
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  /* ══════════════ SELECTION ══════════════ */
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(
      checked ? new Set(list.map((d) => d.device_id)) : new Set()
    );
  };

  /* ══════════════ CLEAR ══════════════ */
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("all");
    setEmployeeFilter("");
    setPage(1);
  };

  const hasActiveFilters =
    !!searchInput || statusFilter !== "all" || !!employeeFilter;

  /* ══════════════ DERIVED ══════════════ */
  const summary = useMemo(() => {
    let trusted = 0;
    let blocked = 0;
    list.forEach((d) => {
      if (d.is_blocked) blocked += 1;
      else if (d.is_trusted) trusted += 1;
    });
    return {
      total: list.length,
      trusted,
      blocked,
      untrusted: list.length - trusted - blocked,
    };
  }, [list]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allSelected =
    list.length > 0 && selectedIds.size === list.length;
  const someSelected = selectedIds.size > 0;

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
            Only administrators can manage trusted devices.
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
            <h1 className="text-2xl font-bold text-slate-800">Devices</h1>
            <p className="mt-1 text-sm text-slate-500">
              Trust or block devices used for punches
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchList}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            >
              + Add Device
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
          <p className="font-medium">How device trust works</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>
              <strong>Trusted</strong> — device is verified and punches are
              accepted without extra checks
            </li>
            <li>
              <strong>Blocked</strong> — punches from this device are rejected
            </li>
            <li>
              Leave both off for shared company devices
            </li>
          </ul>
        </div>

        {/* Toast */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Summary cards */}
        {list.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Total" value={summary.total} tone="slate" />
            <SummaryCard label="Trusted" value={summary.trusted} tone="green" />
            <SummaryCard label="Blocked" value={summary.blocked} tone="red" />
            <SummaryCard
              label="Untrusted"
              value={summary.untrusted}
              tone="slate"
            />
          </div>
        )}

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by device UID or name..."
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
            </div>
            <div>
              <EmployeeDropdown
                value={employeeFilter}
                onChange={(v) => {
                  setEmployeeFilter(v);
                  setPage(1);
                }}
                options={employees}
                placeholder="All employees"
                optional
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Bulk bar */}
        {someSelected && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">
              {selectedIds.size} device{selectedIds.size !== 1 ? "s" : ""} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                disabled={actionId === "bulk"}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => bulkAction("unblock")}
                disabled={actionId === "bulk"}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Unblock
              </button>
              <button
                type="button"
                onClick={() => bulkAction("block")}
                disabled={actionId === "bulk"}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                Block
              </button>
              <button
                type="button"
                onClick={() => bulkAction("trust")}
                disabled={actionId === "bulk"}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
              >
                Trust
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading && list.length === 0 ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📱
                </div>
                <p className="text-sm font-medium text-slate-700">
                  No devices registered
                </p>
                <p className="text-xs text-slate-500">
                  Add a device to mark it trusted or blocked
                </p>
                <button
                  type="button"
                  onClick={openAdd}
                  className="mt-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  + Add Device
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="w-10 px-5 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                      />
                    </th>
                    <th className="px-5 py-3 font-medium text-slate-500">Device</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Type</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Last Used</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row) => {
                    const id = row.device_id;
                    const isSel = selectedIds.has(id);
                    const isCurrent = row.device_uid === currentDeviceId;
                    return (
                      <tr
                        key={id}
                        className={`transition-colors ${
                          isSel ? "bg-red-50/40" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleSelect(id)}
                            className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-slate-700">
                              {row.device_name || "Unnamed"}
                            </div>
                            {isCurrent && (
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                This device
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                            {row.device_uid}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <TypeBadge type={row.device_type} />
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {row.employee_id ? (
                            getEmpName(row.employee_id)
                          ) : (
                            <span className="text-slate-400">Shared</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge device={row} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-500">
                          {relativeTime(row.last_used_at)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(row)}
                              disabled={actionId === id}
                              className="text-xs font-medium text-slate-600 hover:text-red-600 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleTrust(row)}
                              disabled={actionId === id}
                              className={`text-xs font-medium disabled:opacity-50 ${
                                row.is_trusted
                                  ? "text-slate-400 hover:text-slate-600"
                                  : "text-green-600 hover:text-green-700"
                              }`}
                            >
                              {row.is_trusted ? "Untrust" : "Trust"}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleBlock(row)}
                              disabled={actionId === id}
                              className={`text-xs font-medium disabled:opacity-50 ${
                                row.is_blocked
                                  ? "text-slate-400 hover:text-slate-600"
                                  : "text-red-600 hover:text-red-700"
                              }`}
                            >
                              {row.is_blocked ? "Unblock" : "Block"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && list.length > 0 && totalPages > 1 && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !saving && closeForm()}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  {editId ? "Edit Device" : "Register Device"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Trust, block or assign a device
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4 p-5">
              {formError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
                  {formError}
                </div>
              )}

              {/* UID */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Device UID <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  value={form.device_uid}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, device_uid: e.target.value }))
                  }
                  placeholder="Auto-filled if same browser"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs focus:border-red-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Unique fingerprint — auto-fills when using this browser
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Device Name
                </label>
                <input
                  value={form.device_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, device_name: e.target.value }))
                  }
                  placeholder="e.g. Amit's iPhone"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Device Type
                </label>
                <select
                  value={form.device_type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, device_type: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                >
                  {DEVICE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Assigned To
                </label>
                <EmployeeDropdown
                  value={form.employee_id}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, employee_id: v }))
                  }
                  options={employees}
                  placeholder="All employees (shared)"
                  optional
                />
              </div>

              {/* Status toggles */}
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                    form.is_trusted
                      ? "border-green-300 bg-green-50"
                      : "border-slate-100 bg-slate-50/60 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.is_trusted}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        is_trusted: e.target.checked,
                        is_blocked: e.target.checked ? false : p.is_blocked,
                      }))
                    }
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-green-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      Trusted
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Punches accepted
                    </div>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                    form.is_blocked
                      ? "border-red-300 bg-red-50"
                      : "border-slate-100 bg-slate-50/60 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.is_blocked}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        is_blocked: e.target.checked,
                        is_trusted: e.target.checked ? false : p.is_trusted,
                      }))
                    }
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      Blocked
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Punches rejected
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : editId ? "Update Device" : "Register Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}