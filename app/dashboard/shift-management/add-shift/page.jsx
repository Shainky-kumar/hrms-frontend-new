
// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";

// const initialForm = {
//   Shift_name: "",
//   shift_timing: "",
//   early_checkin_margin: 30,
//   late_checkout_margin: 45,
// };

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;

//   if (Array.isArray(detail)) {
//     return detail
//       .map((item) => {
//         if (Array.isArray(item.loc)) {
//           return `${item.loc.slice(1).join(".")}: ${item.msg}`;
//         }

//         return item.msg;
//       })
//       .join(" • ");
//   }

//   if (typeof detail === "string") {
//     return detail;
//   }

//   return err?.response?.data?.message || err?.message || "Something went wrong";
// };

// const getShiftId = (item) => {
//   return item?.shift_id || item?.id || item?._id;
// };

// const getTimingId = (timing) => {
//   return (
//     timing?.company_timing_id ||
//     timing?.timing_id ||
//     timing?.id ||
//     timing?._id
//   );
// };

// const formatTime = (time) => {
//   if (!time) return "";

//   const parts = String(time).split(":");
//   const hour = Number(parts[0]);
//   const minute = Number(parts[1] || 0);

//   if (Number.isNaN(hour)) {
//     return String(time);
//   }

//   const date = new Date();
//   date.setHours(hour, minute, 0, 0);

//   return date.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const getTimingName = (timing) => {
//   const startTime = timing?.start_time || timing?.startTime;
//   const endTime = timing?.end_time || timing?.endTime;

//   if (startTime && endTime) {
//     return `${formatTime(startTime)} - ${formatTime(endTime)}`;
//   }

//   return (
//     timing?.name ||
//     timing?.timing_name ||
//     timing?.title ||
//     getTimingId(timing) ||
//     "Unknown timing"
//   );
// };

// const getShiftsFromResponse = (res) => {
//   const data = res?.data;

//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.shifts)) return data.shifts;
//   if (Array.isArray(data?.items)) return data.items;
//   if (Array.isArray(data?.results)) return data.results;
//   if (Array.isArray(data?.data)) return data.data;

//   return [];
// };

// const getTimingsFromResponse = (res) => {
//   const data = res?.data;

//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.timings)) return data.timings;
//   if (Array.isArray(data?.company_timings)) return data.company_timings;
//   if (Array.isArray(data?.items)) return data.items;
//   if (Array.isArray(data?.results)) return data.results;
//   if (Array.isArray(data?.data)) return data.data;

//   return [];
// };

// export default function AddShiftPage() {
//   const [list, setList] = useState([]);
//   const [timings, setTimings] = useState([]);

//   const [formData, setFormData] = useState(initialForm);

//   const [loading, setLoading] = useState(true);
//   const [timingsLoading, setTimingsLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [timingError, setTimingError] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.get("/api/v1/get/all/shifts", {
//         params: {
//           page: 1,
//           page_size: 100,
//         },
//       });

//       const shifts = getShiftsFromResponse(res);
//       setList(shifts);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTimings = async () => {
//     setTimingsLoading(true);
//     setTimingError("");

//     try {
//       const res = await api.get("/api/v1/get/all/company-timings");

//       const timingList = getTimingsFromResponse(res);
//       setTimings(timingList);
//     } catch (err) {
//       setTimings([]);
//       setTimingError(formatApiError(err));
//     } finally {
//       setTimingsLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   };

//   const openAdd = async () => {
//     setEditId(null);
//     setFormData(initialForm);
//     setError("");
//     setTimingError("");
//     setShowForm(true);

//     await fetchTimings();
//   };

//   const openEdit = async (item) => {
//     const shiftId = getShiftId(item);

//     setEditId(shiftId);

//     setFormData({
//       Shift_name: item?.Shift_name || "",
//       shift_timing: item?.shift_timing || "",
//       early_checkin_margin: item?.early_checkin_margin ?? 30,
//       late_checkout_margin: item?.late_checkout_margin ?? 45,
//     });

//     setError("");
//     setTimingError("");
//     setShowForm(true);

//     await fetchTimings();
//   };

//   const closeForm = () => {
//     if (saving) return;

//     setShowForm(false);
//     setEditId(null);
//     setFormData(initialForm);
//     setError("");
//     setTimingError("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const shiftName = formData.Shift_name.trim();

//     if (!shiftName) {
//       setError("Shift name required");
//       return;
//     }

//     if (!formData.shift_timing) {
//       setError("Please select shift timing");
//       return;
//     }

//     setSaving(true);
//     setError("");

//     const payload = {
//       Shift_name: shiftName,
//       shift_timing: formData.shift_timing,
//       early_checkin_margin: Number(formData.early_checkin_margin || 0),
//       late_checkout_margin: Number(formData.late_checkout_margin || 0),
//     };

//     try {
//       if (editId) {
//         await api.put(`/api/v1/update/shifts/${editId}`, payload);
//       } else {
//         await api.post("/api/v1/create/shifts", payload);
//       }

//       closeForm();
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!id) {
//       setError("Shift ID nahi mila");
//       return;
//     }

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this shift?"
//     );

//     if (!confirmDelete) return;

//     setError("");

//     try {
//       await api.delete(`/api/v1/delete/shifts/${id}`);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     }
//   };

//   const getTimingLabelById = (timingId) => {
//     const timing = timings.find(
//       (item) => String(getTimingId(item)) === String(timingId)
//     );

//     return timing ? getTimingName(timing) : timingId || "—";
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">
//               Employee Shifts
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Create and manage employee shifts
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={openAdd}
//             className="rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c91f21]"
//           >
//             + Add Shift
//           </button>
//         </div>

//         {error && !showForm && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           {loading ? (
//             <div className="py-24 text-center text-sm text-slate-500">
//               Loading shifts...
//             </div>
//           ) : list.length === 0 ? (
//             <div className="py-24 text-center">
//               <div className="text-4xl">🕒</div>

//               <p className="mt-3 text-sm font-medium text-slate-700">
//                 No shifts found
//               </p>

//               <p className="mt-1 text-sm text-slate-500">
//                 Add your first shift to get started.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[650px] text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-200 bg-slate-50">
//                     <th className="px-5 py-4 font-semibold text-slate-500">
//                       #
//                     </th>

//                     <th className="px-5 py-4 font-semibold text-slate-500">
//                       Shift Name
//                     </th>

//                     <th className="px-5 py-4 font-semibold text-slate-500">
//                       Timing
//                     </th>

//                     <th className="px-5 py-4 text-right font-semibold text-slate-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {list.map((item, index) => {
//                     const shiftId = getShiftId(item);

//                     return (
//                       <tr
//                         key={shiftId || index}
//                         className="transition hover:bg-slate-50"
//                       >
//                         <td className="px-5 py-4 text-slate-500">
//                           {index + 1}
//                         </td>

//                         <td className="px-5 py-4">
//                           <div className="font-semibold text-slate-800">
//                             {item?.Shift_name || "—"}
//                           </div>
//                         </td>

//                         <td className="px-5 py-4">
//                           <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
//                             <span>🕒</span>
//                             {getTimingLabelById(item?.shift_timing)}
//                           </span>
//                         </td>

//                         <td className="px-5 py-4 text-right">
//                           <button
//                             type="button"
//                             onClick={() => openEdit(item)}
//                             className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
//                           >
//                             Edit
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => handleDelete(shiftId)}
//                             className="ml-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
//                           >
//                             Delete
//                           </button>
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

//       {showForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 sm:pt-14"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               closeForm();
//             }
//           }}
//         >
//           <div
//             className="mb-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="shift-form-title"
//           >
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
//               <div>
//                 <h2
//                   id="shift-form-title"
//                   className="text-lg font-bold text-slate-800"
//                 >
//                   {editId ? "Edit Shift" : "Add Shift"}
//                 </h2>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Fill the shift details below
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="rounded-lg px-3 py-2 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                 aria-label="Close form"
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[72vh] space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
//                 {error && (
//                   <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                     {error}
//                   </div>
//                 )}

//                 <div>
//                   <label
//                     htmlFor="shift-name"
//                     className="mb-2 block text-sm font-semibold text-slate-700"
//                   >
//                     Shift Name *
//                   </label>

//                   <input
//                     id="shift-name"
//                     type="text"
//                     value={formData.Shift_name}
//                     onChange={(event) =>
//                       handleChange("Shift_name", event.target.value)
//                     }
//                     placeholder="Example: Morning Shift"
//                     maxLength={100}
//                     required
//                     className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
//                   />
//                 </div>

//                 <div>
//                   <div className="mb-2 flex items-center justify-between">
//                     <label className="block text-sm font-semibold text-slate-700">
//                       Shift Timing *
//                     </label>

//                     <span className="text-xs text-slate-400">
//                       Select one
//                     </span>
//                   </div>

//                   {timingError && (
//                     <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//                       {timingError}
//                     </div>
//                   )}

//                   {timingsLoading ? (
//                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                       <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
//                       <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
//                     </div>
//                   ) : timings.length === 0 ? (
//                     <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
//                       <div className="text-3xl">🕒</div>

//                       <p className="mt-2 text-sm font-semibold text-slate-700">
//                         No timings available
//                       </p>

//                       <p className="mt-1 text-xs text-slate-500">
//                         Pehle company timing create karo.
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                       {timings.map((timing) => {
//                         const timingId = String(getTimingId(timing));

//                         const selected =
//                           String(formData.shift_timing) === timingId;

//                         return (
//                           <button
//                             key={timingId}
//                             type="button"
//                             onClick={() =>
//                               handleChange("shift_timing", timingId)
//                             }
//                             className={`rounded-xl border p-4 text-left transition ${
//                               selected
//                                 ? "border-red-500 bg-red-50 ring-2 ring-red-100"
//                                 : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/40"
//                             }`}
//                           >
//                             <div className="flex items-center justify-between gap-3">
//                               <div>
//                                 <p className="font-semibold text-slate-800">
//                                   🕒 {getTimingName(timing)}
//                                 </p>

//                                 <p className="mt-1 text-xs text-slate-500">
//                                   {selected
//                                     ? "Timing selected"
//                                     : "Click to select"}
//                                 </p>
//                               </div>

//                               <div
//                                 className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
//                                   selected
//                                     ? "bg-red-500 font-bold text-white"
//                                     : "border border-slate-300 text-transparent"
//                                 }`}
//                               >
//                                 ✓
//                               </div>
//                             </div>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="early-checkin"
//                       className="mb-2 block text-sm font-semibold text-slate-700"
//                     >
//                       Early Check-in
//                     </label>

//                     <div className="relative">
//                       <input
//                         id="early-checkin"
//                         type="number"
//                         min="0"
//                         max="1440"
//                         value={formData.early_checkin_margin}
//                         onChange={(event) =>
//                           handleChange(
//                             "early_checkin_margin",
//                             event.target.value
//                           )
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-20 text-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
//                       />

//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
//                         minutes
//                       </span>
//                     </div>

//                     <p className="mt-1 text-xs text-slate-400">
//                       Shift se pehle punch-in.
//                     </p>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="late-checkout"
//                       className="mb-2 block text-sm font-semibold text-slate-700"
//                     >
//                       Late Checkout
//                     </label>

//                     <div className="relative">
//                       <input
//                         id="late-checkout"
//                         type="number"
//                         min="0"
//                         max="1440"
//                         value={formData.late_checkout_margin}
//                         onChange={(event) =>
//                           handleChange(
//                             "late_checkout_margin",
//                             event.target.value
//                           )
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-20 text-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
//                       />

//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
//                         minutes
//                       </span>
//                     </div>

//                     <p className="mt-1 text-xs text-slate-400">
//                       Shift ke baad punch-out.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   disabled={saving}
//                   className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={saving || timings.length === 0}
//                   className="rounded-lg bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editId
//                     ? "Update Shift"
//                     : "Save Shift"}
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

import { useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

// ---------------------------------------------------------------------------
// API endpoints — adjust these if your actual routes differ.
// The employee-list and assignment routes were not visible in what you
// shared, so these are best guesses following your existing naming pattern.
// ---------------------------------------------------------------------------
const ENDPOINTS = {
  shiftsList: "/api/v1/get/all/shifts",
  shiftCreate: "/api/v1/create/shifts",
  shiftUpdate: (id) => `/api/v1/update/shifts/${id}`,
  shiftDelete: (id) => `/api/v1/delete/shifts/${id}`,

  timingsList: "/api/v1/get/all/company-timings",

  employeesList: "/api/v1/get/employees",

  assignmentCreate: "/api/v1/assign-shift",
  assignmentBulkCreate: "/api/v1/bulk-assign-shift",
  assignmentsList: "/api/v1/get/all/assign-shifts",
  assignmentGet: (id) => `/api/v1/get/assign-shift/${id}`,
  assignmentUpdate: (id) => `/api/v1/update/assign-shift/${id}`,
  assignmentDelete: (id) => `/api/v1/delete/assign-shift/${id}`,
};

const initialShiftForm = {
  Shift_name: "",
  shift_timing: "",
  early_checkin_margin: 30,
  late_checkout_margin: 45,
};

const initialAssignForm = {
  employee_ids: [],
  start_date: "",
  end_date: "",
  remarks: "",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (Array.isArray(item.loc)) {
          return `${item.loc.slice(1).join(".")}: ${item.msg}`;
        }
        return item.msg;
      })
      .join(" • ");
  }

  if (typeof detail === "string") return detail;

  return err?.response?.data?.message || err?.message || "Something went wrong";
};

const getShiftId = (item) => item?.shift_id || item?.id || item?._id;
const getTimingId = (t) => t?.company_timing_id || t?.timing_id || t?.id || t?._id;
const getEmployeeId = (e) => e?.employee_id || e?.id || e?._id;
const getAssignmentId = (a) => a?.assignment_id || a?.id || a?._id;

const formatTime = (time) => {
  if (!time) return "";
  const parts = String(time).split(":");
  const hour = Number(parts[0]);
  const minute = Number(parts[1] || 0);
  if (Number.isNaN(hour)) return String(time);

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
};

const getTimingName = (timing) => {
  const startTime = timing?.start_time || timing?.startTime;
  const endTime = timing?.end_time || timing?.endTime;
  if (startTime && endTime) return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  return timing?.name || timing?.timing_name || timing?.title || getTimingId(timing) || "Unknown timing";
};

const getEmployeeName = (emp) => {
  return (
    emp?.name ||
    [emp?.first_name, emp?.last_name].filter(Boolean).join(" ") ||
    emp?.company_email ||
    getEmployeeId(emp) ||
    "Unknown employee"
  );
};

const getEmployeeSubtitle = (emp) => {
  const parts = [emp?.designation_name, emp?.department_name].filter((v) => v && v !== "—");
  return parts.join(" • ");
};

const extractArray = (res, keys) => {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

const getShiftsFromResponse = (res) => extractArray(res, ["shifts", "items", "results", "data"]);
const getTimingsFromResponse = (res) => extractArray(res, ["timings", "company_timings", "items", "results", "data"]);
const getEmployeesFromResponse = (res) => extractArray(res, ["employees", "items", "results", "data"]);
const getAssignmentsFromResponse = (res) => extractArray(res, ["assignments", "items", "results", "data"]);

// ---------------------------------------------------------------------------
// Small presentational bits
// ---------------------------------------------------------------------------
const Badge = ({ children, tone = "slate" }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
};

const IconButton = ({ label, onClick, tone = "slate" }) => {
  const tones = {
    slate: "text-slate-500 hover:bg-slate-100",
    red: "text-red-600 hover:bg-red-50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${tones[tone]}`}
    >
      {label}
    </button>
  );
};

const ModalShell = ({ title, subtitle, onClose, children, footer, wide }) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 sm:pt-14"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <div
      className={`mb-8 w-full ${wide ? "max-w-3xl" : "max-w-2xl"} overflow-hidden rounded-2xl bg-white shadow-2xl`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="max-h-[72vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

      {footer && <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">{footer}</div>}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Shift card
// ---------------------------------------------------------------------------
const ShiftCard = ({ shift, timingLabel, onOpenDetails, onEdit, onDelete, onAssign }) => {
  const active = shift?.is_active !== false;

  return (
    <div
      onClick={() => onOpenDetails(shift)}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">{shift?.Shift_name || "—"}</h3>
          <div className="mt-2">
            <Badge tone="blue">🕒 {timingLabel}</Badge>
          </div>
        </div>
        <Badge tone={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Early check-in</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-700">{shift?.early_checkin_margin ?? 0} min</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Late checkout</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-700">{shift?.late_checkout_margin ?? 0} min</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex gap-1">
          <IconButton label="Edit" onClick={(e) => { e.stopPropagation(); onEdit(shift); }} />
          <IconButton label="Delete" tone="red" onClick={(e) => { e.stopPropagation(); onDelete(shift); }} />
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAssign(shift); }}
          className="rounded-lg bg-[#E42527] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#c91f21]"
        >
          + Assign
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Assignment history table (reusable — used globally and inside details modal)
// ---------------------------------------------------------------------------
const AssignmentHistoryTable = ({ assignments, loading, getShiftName, getEmployeeLabel, onDelete, emptyHint }) => {
  if (loading) {
    return <div className="py-10 text-center text-sm text-slate-500">Loading history...</div>;
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
        <div className="text-3xl">📋</div>
        <p className="mt-2 text-sm font-medium text-slate-700">No assignments yet</p>
        <p className="mt-1 text-xs text-slate-500">{emptyHint || "Assign employees to a shift to see history here."}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 font-semibold text-slate-500">Employee</th>
            {getShiftName && <th className="px-4 py-3 font-semibold text-slate-500">Shift</th>}
            <th className="px-4 py-3 font-semibold text-slate-500">Start</th>
            <th className="px-4 py-3 font-semibold text-slate-500">End</th>
            <th className="px-4 py-3 font-semibold text-slate-500">Remarks</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {assignments.map((a) => {
            const id = getAssignmentId(a);
            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-700">{getEmployeeLabel(a?.employee_id)}</td>
                {getShiftName && <td className="px-4 py-3 text-slate-600">{getShiftName(a?.shift_id)}</td>}
                <td className="px-4 py-3 text-slate-600">{formatDate(a?.start_date)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(a?.end_date)}</td>
                <td className="px-4 py-3 text-slate-500">{a?.remarks || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <IconButton label="Remove" tone="red" onClick={() => onDelete(id)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [timings, setTimings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loadingShifts, setLoadingShifts] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [pageError, setPageError] = useState("");

  // Shift form modal
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [editShiftId, setEditShiftId] = useState(null);
  const [shiftForm, setShiftForm] = useState(initialShiftForm);
  const [shiftFormError, setShiftFormError] = useState("");

  // Details modal
  const [detailsShift, setDetailsShift] = useState(null);

  // Assign modal
  const [assignShift, setAssignShift] = useState(null);
  const [assignForm, setAssignForm] = useState(initialAssignForm);
  const [assignError, setAssignError] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  useEffect(() => {
    fetchShifts();
    fetchTimings();
    fetchAssignments();
  }, []);

  const fetchShifts = async () => {
    setLoadingShifts(true);
    setPageError("");
    try {
      const res = await api.get(ENDPOINTS.shiftsList, { params: { page: 1, page_size: 100 } });
      setShifts(getShiftsFromResponse(res));
    } catch (err) {
      setPageError(formatApiError(err));
    } finally {
      setLoadingShifts(false);
    }
  };

  const fetchTimings = async () => {
    try {
      const res = await api.get(ENDPOINTS.timingsList);
      setTimings(getTimingsFromResponse(res));
    } catch (err) {
      setTimings([]);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await api.get(ENDPOINTS.employeesList);
      setEmployees(getEmployeesFromResponse(res));
    } catch (err) {
      setEmployees([]);
      setAssignError(formatApiError(err));
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchAssignments = async (filters = {}) => {
    setLoadingAssignments(true);
    try {
      const res = await api.get(ENDPOINTS.assignmentsList, {
        params: { page: 1, page_size: 100, ...filters },
      });
      setAssignments(getAssignmentsFromResponse(res));
    } catch (err) {
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // ---- lookups ----
  const getTimingLabelById = (timingId) => {
    const timing = timings.find((t) => String(getTimingId(t)) === String(timingId));
    return timing ? getTimingName(timing) : timingId || "—";
  };

  const getShiftNameById = (shiftId) => {
    const shift = shifts.find((s) => String(getShiftId(s)) === String(shiftId));
    return shift?.Shift_name || shiftId || "—";
  };

  const getEmployeeLabelById = (employeeId) => {
    const emp = employees.find((e) => String(getEmployeeId(e)) === String(employeeId));
    return emp ? getEmployeeName(emp) : employeeId || "—";
  };

  // ---- shift form ----
  const openAddShift = () => {
    setEditShiftId(null);
    setShiftForm(initialShiftForm);
    setShiftFormError("");
    setShowShiftForm(true);
  };

  const openEditShift = (shift) => {
    setEditShiftId(getShiftId(shift));
    setShiftForm({
      Shift_name: shift?.Shift_name || "",
      shift_timing: shift?.shift_timing || "",
      early_checkin_margin: shift?.early_checkin_margin ?? 30,
      late_checkout_margin: shift?.late_checkout_margin ?? 45,
    });
    setShiftFormError("");
    setShowShiftForm(true);
  };

  const closeShiftForm = () => {
    if (saving) return;
    setShowShiftForm(false);
    setEditShiftId(null);
    setShiftForm(initialShiftForm);
    setShiftFormError("");
  };

  const handleShiftSubmit = async (event) => {
    event.preventDefault();
    const name = shiftForm.Shift_name.trim();

    if (!name) return setShiftFormError("Shift name required");
    if (!shiftForm.shift_timing) return setShiftFormError("Please select shift timing");

    setSaving(true);
    setShiftFormError("");

    const payload = {
      Shift_name: name,
      shift_timing: shiftForm.shift_timing,
      early_checkin_margin: Number(shiftForm.early_checkin_margin || 0),
      late_checkout_margin: Number(shiftForm.late_checkout_margin || 0),
    };

    try {
      if (editShiftId) {
        await api.put(ENDPOINTS.shiftUpdate(editShiftId), payload);
      } else {
        await api.post(ENDPOINTS.shiftCreate, payload);
      }
      closeShiftForm();
      await fetchShifts();
    } catch (err) {
      setShiftFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShift = async (shift) => {
    const id = getShiftId(shift);
    if (!id) return;
    if (!window.confirm(`Delete "${shift?.Shift_name}"? This can't be undone.`)) return;

    try {
      await api.delete(ENDPOINTS.shiftDelete(id));
      await fetchShifts();
      if (detailsShift && getShiftId(detailsShift) === id) setDetailsShift(null);
    } catch (err) {
      setPageError(formatApiError(err));
    }
  };

  // ---- assign flow ----
  const openAssign = async (shift) => {
    setAssignShift(shift);
    setAssignForm(initialAssignForm);
    setAssignError("");
    setEmployeeSearch("");
    if (employees.length === 0) await fetchEmployees();
  };

  const closeAssign = () => {
    if (assigning) return;
    setAssignShift(null);
    setAssignForm(initialAssignForm);
    setAssignError("");
  };

  const toggleEmployee = (employeeId) => {
    setAssignForm((prev) => {
      const exists = prev.employee_ids.includes(employeeId);
      return {
        ...prev,
        employee_ids: exists
          ? prev.employee_ids.filter((id) => id !== employeeId)
          : [...prev.employee_ids, employeeId],
      };
    });
  };

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) => {
      const haystack = `${getEmployeeName(e)} ${getEmployeeSubtitle(e)}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [employees, employeeSearch]);

  const handleAssignSubmit = async (event) => {
    event.preventDefault();

    if (assignForm.employee_ids.length === 0) return setAssignError("Select at least one employee");
    if (!assignForm.start_date) return setAssignError("Start date required");
    if (!assignForm.end_date) return setAssignError("End date required");
    if (assignForm.start_date > assignForm.end_date) return setAssignError("Start date cannot be after end date");

    setAssigning(true);
    setAssignError("");

    const payload = {
      employee_ids: assignForm.employee_ids,
      shift_id: getShiftId(assignShift),
      start_date: assignForm.start_date,
      end_date: assignForm.end_date,
      remarks: assignForm.remarks || undefined,
    };

    try {
      await api.post(ENDPOINTS.assignmentBulkCreate, payload);
      closeAssign();
      await fetchAssignments();
    } catch (err) {
      setAssignError(formatApiError(err));
    } finally {
      setAssigning(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!assignmentId) return;
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await api.delete(ENDPOINTS.assignmentDelete(assignmentId));
      await fetchAssignments();
    } catch (err) {
      setPageError(formatApiError(err));
    }
  };

  const detailsAssignments = useMemo(() => {
    if (!detailsShift) return [];
    const id = getShiftId(detailsShift);
    return assignments.filter((a) => String(a?.shift_id) === String(id));
  }, [assignments, detailsShift]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Employee Shifts</h1>
            <p className="mt-1 text-sm text-slate-500">Create shifts and assign employees to them</p>
          </div>
          <button
            type="button"
            onClick={openAddShift}
            className="rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c91f21]"
          >
            + Add Shift
          </button>
        </div>

        {pageError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        )}

        {/* Shift cards */}
        {loadingShifts ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : shifts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
            <div className="text-4xl">🕒</div>
            <p className="mt-3 text-sm font-medium text-slate-700">No shifts found</p>
            <p className="mt-1 text-sm text-slate-500">Add your first shift to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shifts.map((shift) => (
              <ShiftCard
                key={getShiftId(shift)}
                shift={shift}
                timingLabel={getTimingLabelById(shift?.shift_timing)}
                onOpenDetails={setDetailsShift}
                onEdit={openEditShift}
                onDelete={handleDeleteShift}
                onAssign={openAssign}
              />
            ))}
          </div>
        )}

        {/* Assignment history */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-800">Assignment History</h2>
          <p className="mt-1 text-sm text-slate-500">All employees assigned across shifts</p>

          <div className="mt-4">
            <AssignmentHistoryTable
              assignments={assignments}
              loading={loadingAssignments}
              getShiftName={getShiftNameById}
              getEmployeeLabel={getEmployeeLabelById}
              onDelete={handleDeleteAssignment}
            />
          </div>
        </div>
      </div>

      {/* Add / Edit shift modal */}
      {showShiftForm && (
        <ModalShell
          title={editShiftId ? "Edit Shift" : "Add Shift"}
          subtitle="Fill the shift details below"
          onClose={closeShiftForm}
          footer={
            <>
              <button
                type="button"
                onClick={closeShiftForm}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="shift-form"
                disabled={saving || timings.length === 0}
                className="rounded-lg bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editShiftId ? "Update Shift" : "Save Shift"}
              </button>
            </>
          }
        >
          <form id="shift-form" onSubmit={handleShiftSubmit} className="space-y-6">
            {shiftFormError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {shiftFormError}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Shift Name *</label>
              <input
                type="text"
                value={shiftForm.Shift_name}
                onChange={(e) => setShiftForm((p) => ({ ...p, Shift_name: e.target.value }))}
                placeholder="Example: Morning Shift"
                maxLength={100}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Shift Timing *</label>
              {timings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                  No timings available. Create a company timing first.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {timings.map((timing) => {
                    const timingId = String(getTimingId(timing));
                    const selected = String(shiftForm.shift_timing) === timingId;
                    return (
                      <button
                        key={timingId}
                        type="button"
                        onClick={() => setShiftForm((p) => ({ ...p, shift_timing: timingId }))}
                        className={`rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-red-500 bg-red-50 ring-2 ring-red-100"
                            : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/40"
                        }`}
                      >
                        <p className="font-semibold text-slate-800">🕒 {getTimingName(timing)}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Early Check-in</label>
                <input
                  type="number"
                  min="0"
                  max="1440"
                  value={shiftForm.early_checkin_margin}
                  onChange={(e) => setShiftForm((p) => ({ ...p, early_checkin_margin: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Late Checkout</label>
                <input
                  type="number"
                  min="0"
                  max="1440"
                  value={shiftForm.late_checkout_margin}
                  onChange={(e) => setShiftForm((p) => ({ ...p, late_checkout_margin: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>
          </form>
        </ModalShell>
      )}

      {/* Assign modal */}
      {assignShift && (
        <ModalShell
          title={`Assign Employees`}
          subtitle={`Shift: ${assignShift?.Shift_name || ""}`}
          onClose={closeAssign}
          wide
          footer={
            <>
              <button
                type="button"
                onClick={closeAssign}
                disabled={assigning}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="assign-form"
                disabled={assigning}
                className="rounded-lg bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assigning
                  ? "Assigning..."
                  : `Assign ${assignForm.employee_ids.length > 0 ? `(${assignForm.employee_ids.length})` : ""}`}
              </button>
            </>
          }
        >
          <form id="assign-form" onSubmit={handleAssignSubmit} className="space-y-5">
            {assignError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {assignError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Start Date *</label>
                <input
                  type="date"
                  value={assignForm.start_date}
                  onChange={(e) => setAssignForm((p) => ({ ...p, start_date: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">End Date *</label>
                <input
                  type="date"
                  value={assignForm.end_date}
                  onChange={(e) => setAssignForm((p) => ({ ...p, end_date: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Remarks</label>
              <textarea
                value={assignForm.remarks}
                onChange={(e) => setAssignForm((p) => ({ ...p, remarks: e.target.value }))}
                rows={2}
                placeholder="Optional note"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Employees * <span className="font-normal text-slate-400">(select one or many)</span>
                </label>
                {assignForm.employee_ids.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAssignForm((p) => ({ ...p, employee_ids: [] }))}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <input
                type="text"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Search employees by name, code, department..."
                className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
              />

              {loadingEmployees ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">
                  No employees found
                </div>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-2">
                  {filteredEmployees.map((emp) => {
                    const id = String(getEmployeeId(emp));
                    const selected = assignForm.employee_ids.includes(id);
                    return (
                      <label
                        key={id}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition ${
                          selected ? "border-red-500 bg-red-50" : "border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleEmployee(id)}
                            className="h-4 w-4 rounded border-slate-300 text-[#E42527] focus:ring-red-200"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{getEmployeeName(emp)}</p>
                            {getEmployeeSubtitle(emp) && (
                              <p className="text-xs text-slate-400">{getEmployeeSubtitle(emp)}</p>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </form>
        </ModalShell>
      )}

      {/* Shift details modal */}
      {detailsShift && (
        <ModalShell
          title={detailsShift?.Shift_name}
          subtitle="Shift details"
          onClose={() => setDetailsShift(null)}
          wide
          footer={
            <>
              <IconButton label="Edit Shift" onClick={() => { setDetailsShift(null); openEditShift(detailsShift); }} />
              <button
                type="button"
                onClick={() => { setDetailsShift(null); openAssign(detailsShift); }}
                className="rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91f21]"
              >
                + Assign Employees
              </button>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {detailsShift?.is_active !== false ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Timing</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {getTimingLabelById(detailsShift?.shift_timing)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Early Check-in</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{detailsShift?.early_checkin_margin ?? 0} min</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Late Checkout</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{detailsShift?.late_checkout_margin ?? 0} min</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-800">Assigned Employees</h3>
            <AssignmentHistoryTable
              assignments={detailsAssignments}
              loading={loadingAssignments}
              getEmployeeLabel={getEmployeeLabelById}
              onDelete={handleDeleteAssignment}
              emptyHint="No employees assigned to this shift yet."
            />
          </div>
        </ModalShell>
      )}
    </div>
  );
}