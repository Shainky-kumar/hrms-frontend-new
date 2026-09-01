// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import { useAuthStore } from "@/store/authStore";

// const initialForm = {
//   leave_type_id: "",
//   leave_policy_id: "",
//   start_date: "",
//   end_date: "",
//   days_requested: 1,
//   reason: "",
// };

// const leaveStatuses = [
//   "PENDING",
//   "APPROVED",
//   "REJECTED",
//   "CANCELLED",
// ];

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;

//   if (Array.isArray(detail)) {
//     return detail
//       .map((item) => {
//         const field = Array.isArray(item.loc)
//           ? item.loc.slice(1).join(".")
//           : "";
//         return field ? `${field}: ${item.msg}` : item.msg;
//       })
//       .join(" • ");
//   }

//   if (typeof detail === "string") return detail;

//   return err?.message || "Something went wrong";
// };

// const getItems = (response) => {
//   const data = response?.data?.data ?? response?.data ?? [];

//   if (Array.isArray(data)) return data;

//   return data?.items ?? data?.results ?? data?.employees ?? [];
// };

// const getLeaveTypeId = (leaveType) =>
//   leaveType.leave_type_id || leaveType.id || leaveType._id;

// const getLeaveTypeName = (leaveType) =>
//   leaveType.leave_type_name || leaveType.name || leaveType.type_name || getLeaveTypeId(leaveType);

// const getPolicyId = (policy) =>
//   policy.leave_policy_id || policy.id || policy._id;

// const getPolicyName = (policy) =>
//   policy.policy_name || policy.name || getPolicyId(policy);

// const fetchLeaveTypes = async () => {
//   const endpoints = [
//     "/api/v1/leave/types",
//     "/api/v1/get/leave/types",
//     "/api/v1/get/leave/type/list",
//   ];

//   for (const endpoint of endpoints) {
//     try {
//       const response = await api.get(endpoint);
//       return getItems(response);
//     } catch {
//     }
//   }

//   return [];
// };

// const getTotal = (response, items) => {
//   return (
//     response?.data?.total ??
//     response?.data?.count ??
//     response?.data?.data?.total ??
//     items.length
//   );
// };

// const formatDate = (value) => {
//   if (!value) return "—";

//   return new Date(value).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const statusClass = (status) => {
//   const value = String(status || "").toUpperCase();

//   if (value === "APPROVED") {
//     return "bg-emerald-50 text-emerald-700";
//   }

//   if (value === "REJECTED") {
//     return "bg-red-50 text-red-700";
//   }

//   if (value === "CANCELLED") {
//     return "bg-slate-100 text-slate-600";
//   }

//   return "bg-amber-50 text-amber-700";
// };

// export default function LeaveApplicationsPage({
//   employeeId = "",
// }) {
//   const user = useAuthStore((state) => state.user);
//   const currentEmployeeId =
//     employeeId ||
//     user?.employee_id ||
//     user?.employeeId ||
//     user?.employee?.employee_id ||
//     "";
//   const [activeTab, setActiveTab] = useState("my-leaves");

//   const [myLeaves, setMyLeaves] = useState([]);
//   const [allLeaves, setAllLeaves] = useState([]);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [leavePolicies, setLeavePolicies] = useState([]);

//   const [formData, setFormData] = useState(initialForm);

//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [actionId, setActionId] = useState(null);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [filterBy, setFilterBy] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     const fetchLeaveOptions = async () => {
//       try {
//         const [policyResult, leaveTypeResult] = await Promise.allSettled([
//           api.get("/api/v1/leave/policies", {
//             params: { page: 1, page_size: 100 },
//           }),
//           fetchLeaveTypes(),
//         ]);

//         const policies =
//           policyResult.status === "fulfilled" ? getItems(policyResult.value) : [];
//         const types =
//           leaveTypeResult.status === "fulfilled"
//             ? getItems(leaveTypeResult.value)
//             : [];
//         const policyTypes = Array.from(
//           new Map(
//             policies
//               .map((policy) => {
//                 const id = policy.leave_type_id || policy.leave_type?.leave_type_id;

//                 return id
//                   ? [id, {
//                       leave_type_id: id,
//                       leave_type_name:
//                         policy.leave_type_name || policy.leave_type?.name || id,
//                     }]
//                   : null;
//               })
//               .filter(Boolean)
//           ).values()
//         );

//         setLeavePolicies(policies);
//         setLeaveTypes(types.length ? types : policyTypes);
//       } catch (err) {
//         setError(formatApiError(err));
//         setLeaveTypes([]);
//         setLeavePolicies([]);
//       }
//     };

//     fetchLeaveOptions();
//   }, []);

//   const fetchLeaves = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       if (activeTab === "my-leaves") {
//         if (!currentEmployeeId) {
//           setMyLeaves([]);
//           setTotal(0);
//           return;
//         }

//         const response = await api.get(
//           `/api/v1/get/leave/applied/${currentEmployeeId}`,
//           {
//             params: {
//               page,
//               page_size: pageSize,
//               search,
//             },
//           }
//         );

//         const items = getItems(response);

//         setMyLeaves(items);
//         setTotal(getTotal(response, items));
//       } else {
//         const response = await api.post(
//           "/api/v1/get/all/leave/applied",
//           {},
//           {
//             params: {
//               page,
//               page_size: pageSize,
//               search,
//               filter_by: filterBy || undefined,
//             },
//           }
//         );

//         const items = getItems(response);

//         setAllLeaves(items);
//         setTotal(getTotal(response, items));
//       }
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [activeTab, currentEmployeeId, filterBy, page, pageSize, search]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchLeaves();
//     }, 0);

//     return () => clearTimeout(timeoutId);
//   }, [fetchLeaves]);

//   const list = activeTab === "my-leaves" ? myLeaves : allLeaves;
//   const totalPages = Math.ceil(total / pageSize) || 1;
//   const selectedPolicies = formData.leave_type_id
//     ? leavePolicies.filter(
//         (policy) =>
//           String(policy.leave_type_id || policy.leave_type?.leave_type_id || policy.leave_type?.id) ===
//           String(formData.leave_type_id)
//       )
//     : leavePolicies;

//   const handleChange = (field, value) => {
//     setFormData((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   };

//   const calculateDays = (startDate, endDate) => {
//     if (!startDate || !endDate) return 1;

//     const start = new Date(`${startDate}T00:00:00`);
//     const end = new Date(`${endDate}T00:00:00`);

//     const difference = end.getTime() - start.getTime();
//     const days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

//     return days > 0 ? days : 1;
//   };

//   const handleDateChange = (field, value) => {
//     const updatedForm = {
//       ...formData,
//       [field]: value,
//     };

//     const days = calculateDays(
//       field === "start_date" ? value : updatedForm.start_date,
//       field === "end_date" ? value : updatedForm.end_date
//     );

//     setFormData({
//       ...updatedForm,
//       days_requested: days,
//     });
//   };

//   const openAdd = () => {
//     setFormData({
//       ...initialForm,
//     });

//     setError("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setError("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       const payload = {
//         employee_id: currentEmployeeId,
//         leave_type_id: formData.leave_type_id,
//         leave_policy_id: formData.leave_policy_id,
//         start_date: formData.start_date,
//         end_date: formData.end_date,
//         days_requested: Number(formData.days_requested),
//         reason: formData.reason || null,
//       };

//       if (!currentEmployeeId) {
//         throw new Error("Logged-in employee profile is not linked to an employee.");
//       }

//       await api.post("/api/v1/apply/leave", payload);

//       closeForm();
//       setPage(1);
//       await fetchLeaves();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancelLeave = async (leave) => {
//     const leaveId =
//       leave.id ||
//       leave.apply_leave_id ||
//       leave.application_id ||
//       leave.leave_application_id;

//     if (!leaveId) {
//       setError("Leave application ID not found.");
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to cancel this leave?"
//     );

//     if (!confirmed) return;

//     setActionId(leaveId);
//     setError("");

//     try {
//       await api.post(`/api/v1/employee/cancel/leave/${leaveId}`);
//       await fetchLeaves();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setActionId(null);
//     }
//   };

//   const handleUpdateStatus = async (leave, status) => {
//     const leaveId =
//       leave.id ||
//       leave.apply_leave_id ||
//       leave.application_id ||
//       leave.leave_application_id;

//     if (!leaveId) {
//       setError("Leave application ID not found.");
//       return;
//     }

//     let decisionReason = "";

//     if (status === "REJECTED") {
//       decisionReason =
//         window.prompt("Enter rejection reason:") || "Leave rejected";
//     }

//     setActionId(`${leaveId}-${status}`);
//     setError("");

//     try {
//       await api.put(`/api/v1/employee/approve/leave/${leaveId}`, {
//         status,
//         decision_reason: decisionReason,
//       });

//       await fetchLeaves();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setActionId(null);
//     }
//   };

//   const getLeaveId = (leave) => {
//     return (
//       leave.id ||
//       leave.apply_leave_id ||
//       leave.application_id ||
//       leave.leave_application_id
//     );
//   };

//   const getEmployeeName = (leave) => {
//     return (
//       leave.employee_name ||
//       leave.employee?.name ||
//       leave.employee?.full_name ||
//       leave.employee_id ||
//       "—"
//     );
//   };

//   const getLeaveType = (leave) => {
//     return (
//       leave.leave_type_name ||
//       leave.leave_type?.name ||
//       leave.leave_type_id ||
//       "—"
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-slate-800">
//               Leave Applications
//             </h1>
//             <p className="mt-0.5 text-sm text-slate-500">
//               Apply, manage and approve employee leaves
//             </p>
//           </div>

//           <button
//             onClick={openAdd}
//             className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//           >
//             + Apply Leave
//           </button>
//         </div>

//         <div className="mb-4 flex gap-2 border-b border-slate-200">
//           <button
//             onClick={() => {
//               setActiveTab("my-leaves");
//               setPage(1);
//               setSearch("");
//               setFilterBy("");
//             }}
//             className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
//               activeTab === "my-leaves"
//                 ? "border-[#E42527] text-[#E42527]"
//                 : "border-transparent text-slate-500"
//             }`}
//           >
//             My Leaves
//           </button>

//           <button
//             onClick={() => {
//               setActiveTab("all-leaves");
//               setPage(1);
//               setSearch("");
//             }}
//             className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
//               activeTab === "all-leaves"
//                 ? "border-[#E42527] text-[#E42527]"
//                 : "border-transparent text-slate-500"
//             }`}
//           >
//             All Applications
//           </button>
//         </div>

//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//             <input
//               value={search}
//               onChange={(event) => {
//                 setSearch(event.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search leaves..."
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//             />

//             <div className="flex items-center gap-3">
//               {activeTab === "all-leaves" && (
//                 <select
//                   value={filterBy}
//                   onChange={(event) => {
//                     setFilterBy(event.target.value);
//                     setPage(1);
//                   }}
//                   className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//                 >
//                   <option value="">All Status</option>
//                   {leaveStatuses.map((status) => (
//                     <option key={status} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               <span className="whitespace-nowrap text-sm text-slate-500">
//                 {total} applications
//               </span>
//             </div>
//           </div>

//           {error && !showForm && (
//             <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             {loading ? (
//               <div className="py-20 text-center text-sm text-slate-500">
//                 Loading...
//               </div>
//             ) : list.length === 0 ? (
//               <div className="py-20 text-center text-sm text-slate-500">
//                 No leave applications found
//               </div>
//             ) : (
//               <table className="w-full min-w-[950px] text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-100 bg-slate-50/80">
//                     <th className="px-5 py-3 font-medium text-slate-500">
//                       #
//                     </th>

//                     {activeTab === "all-leaves" && (
//                       <th className="px-5 py-3 font-medium text-slate-500">
//                         Employee
//                       </th>
//                     )}

//                     <th className="px-5 py-3 font-medium text-slate-500">
//                       Leave Type
//                     </th>
//                     <th className="px-5 py-3 font-medium text-slate-500">
//                       Start Date
//                     </th>
//                     <th className="px-5 py-3 font-medium text-slate-500">
//                       End Date
//                     </th>
//                     <th className="px-5 py-3 font-medium text-slate-500">
//                       Days
//                     </th>
//                     <th className="px-5 py-3 font-medium text-slate-500">
//                       Reason
//                     </th>
//                     <th className="px-5 py-3 font-medium text-slate-500">
//                       Status
//                     </th>
//                     <th className="px-5 py-3 text-right font-medium text-slate-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-50">
//                   {list.map((leave, index) => {
//                     const id = getLeaveId(leave);
//                     const status = String(
//                       leave.leave_status || leave.status || "PENDING"
//                     ).toUpperCase();

//                     const canCancel = [
//                       "PENDING",
//                       "APPROVED",
//                     ].includes(status);

//                     const canApprove =
//                       activeTab === "all-leaves" && status === "PENDING";

//                     return (
//                       <tr
//                         key={id || index}
//                         className="hover:bg-slate-50/70"
//                       >
//                         <td className="px-5 py-3.5 text-slate-500">
//                           {(page - 1) * pageSize + index + 1}
//                         </td>

//                         {activeTab === "all-leaves" && (
//                           <td className="px-5 py-3.5">
//                             <div className="font-medium text-slate-800">
//                               {getEmployeeName(leave)}
//                             </div>
//                             <div className="text-xs text-slate-400">
//                               {leave.employee_id || ""}
//                             </div>
//                           </td>
//                         )}

//                         <td className="px-5 py-3.5 text-slate-700">
//                           {getLeaveType(leave)}
//                         </td>

//                         <td className="px-5 py-3.5 text-slate-600">
//                           {formatDate(leave.start_date)}
//                         </td>

//                         <td className="px-5 py-3.5 text-slate-600">
//                           {formatDate(leave.end_date)}
//                         </td>

//                         <td className="px-5 py-3.5 text-slate-600">
//                           {leave.days_requested ?? "—"}
//                         </td>

//                         <td className="max-w-[220px] truncate px-5 py-3.5 text-slate-600">
//                           {leave.reason || "—"}
//                         </td>

//                         <td className="px-5 py-3.5">
//                           <span
//                             className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
//                               status
//                             )}`}
//                           >
//                             {status}
//                           </span>
//                         </td>

//                         <td className="px-5 py-3.5 text-right">
//                           <div className="flex justify-end gap-2">
//                             {canApprove && (
//                               <>
//                                 <button
//                                   disabled={
//                                     actionId === `${id}-APPROVED`
//                                   }
//                                   onClick={() =>
//                                     handleUpdateStatus(leave, "APPROVED")
//                                   }
//                                   className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
//                                 >
//                                   {actionId === `${id}-APPROVED`
//                                     ? "..."
//                                     : "Approve"}
//                                 </button>

//                                 <button
//                                   disabled={
//                                     actionId === `${id}-REJECTED`
//                                   }
//                                   onClick={() =>
//                                     handleUpdateStatus(leave, "REJECTED")
//                                   }
//                                   className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
//                                 >
//                                   {actionId === `${id}-REJECTED`
//                                     ? "..."
//                                     : "Reject"}
//                                 </button>
//                               </>
//                             )}

//                             {canCancel && (
//                               <button
//                                 disabled={actionId === id}
//                                 onClick={() => handleCancelLeave(leave)}
//                                 className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
//                               >
//                                 {actionId === id ? "Cancelling..." : "Cancel"}
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {totalPages > 1 && (
//             <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
//               <span className="text-sm text-slate-500">
//                 Page {page} of {totalPages}
//               </span>

//               <div className="flex gap-2">
//                 <button
//                   disabled={page <= 1}
//                   onClick={() => setPage((previous) => previous - 1)}
//                   className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
//                 >
//                   Prev
//                 </button>

//                 <button
//                   disabled={page >= totalPages}
//                   onClick={() => setPage((previous) => previous + 1)}
//                   className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-8 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <h2 className="text-base font-semibold text-slate-800">
//                   Apply for Leave
//                 </h2>
//                 <p className="mt-0.5 text-xs text-slate-500">
//                   Submit a new leave application
//                 </p>
//               </div>

//               <button
//                 onClick={closeForm}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[72vh] space-y-5 overflow-y-auto px-5 py-5">
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Leave Type *
//                     </label>
//                     <select
//                       required
//                       value={formData.leave_type_id}
//                       onChange={(event) => {
//                         handleChange("leave_type_id", event.target.value);
//                         handleChange("leave_policy_id", "");
//                       }}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="">Select leave type</option>
//                       {leaveTypes.map((leaveType) => {
//                         const id = getLeaveTypeId(leaveType);

//                         return id ? (
//                           <option key={id} value={id}>
//                             {getLeaveTypeName(leaveType)}
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Leave Policy *
//                     </label>
//                     <select
//                       required
//                       value={formData.leave_policy_id}
//                       onChange={(event) =>
//                         handleChange("leave_policy_id", event.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     >
//                       <option value="">Select leave policy</option>
//                       {selectedPolicies.map((policy) => {
//                         const id = getPolicyId(policy);

//                         return id ? (
//                           <option key={id} value={id}>
//                             {getPolicyName(policy)}
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Start Date *
//                     </label>
//                     <input
//                       required
//                       type="date"
//                       value={formData.start_date}
//                       onChange={(event) =>
//                         handleDateChange("start_date", event.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       End Date *
//                     </label>
//                     <input
//                       required
//                       type="date"
//                       min={formData.start_date || undefined}
//                       value={formData.end_date}
//                       onChange={(event) =>
//                         handleDateChange("end_date", event.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Days Requested *
//                     </label>
//                     <input
//                       required
//                       min="1"
//                       type="number"
//                       value={formData.days_requested}
//                       onChange={(event) =>
//                         handleChange("days_requested", event.target.value)
//                       }
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Reason
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={formData.reason}
//                     onChange={(event) =>
//                       handleChange("reason", event.target.value)
//                     }
//                     placeholder="Enter reason for leave"
//                     className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                   />
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
//                   onClick={closeForm}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? "Submitting..." : "Submit Leave"}
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

import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

const initialForm = {
  leave_type_id: "",
  leave_policy_id: "",
  start_date: "",
  end_date: "",
  is_half_day: false,
  half_day_session: "",
  reason: "",
  document_url: "",
};

const leaveStatuses = ["pending", "approved", "rejected", "cancelled"];

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc.slice(1).join(".") : "";
        return field ? `${field}: ${item.msg}` : item.msg;
      })
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
    data?.leaves ??
    data?.applications ??
    data?.leave_applications ??
    data?.policies ??
    data?.leave_policies ??
    data?.types ??
    data?.leave_types ??
    data?.employees ??
    response?.data?.policies ??
    response?.data?.leave_policies ??
    response?.data?.leave_types ??
    response?.data?.leaves ??
    response?.data?.applications ??
    response?.data?.leave_applications ??
    []
  );
};

const getLeaveTypeId = (leaveType) =>
  leaveType?.leave_type_id || leaveType?.id || leaveType?._id;

const getLeaveTypeName = (leaveType) =>
  leaveType?.leave_type_name ||
  leaveType?.name ||
  leaveType?.type_name ||
  getLeaveTypeId(leaveType);

const getPolicyId = (policy) =>
  policy?.leave_policy_id || policy?.policy_id || policy?.id || policy?._id;

const getPolicyName = (policy) =>
  policy.policy_name || policy.leave_policy_name || policy.name || getPolicyId(policy);

const fetchLeaveTypes = async () => {
  const endpoints = [
    "/api/v1/get/leave/type",
    "/api/v1/leave/types",
    "/api/v1/get/leave/types",
    "/api/v1/get/leave/type/list",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint);
      return getItems(response);
    } catch {}
  }
  return [];
};

const getTotal = (response, items) =>
  response?.data?.total ??
  response?.data?.count ??
  response?.data?.data?.total ??
  items.length;

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusClass = (status) => {
  const value = String(status || "").toUpperCase();
  if (value === "APPROVED") return "bg-emerald-50 text-emerald-700";
  if (value === "REJECTED") return "bg-red-50 text-red-700";
  if (value === "CANCELLED") return "bg-slate-100 text-slate-600";
  return "bg-amber-50 text-amber-700";
};

export default function LeaveApplicationsPage({ employeeId = "" }) {
  const user = useAuthStore((state) => state.user);
  const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
  const employeeFromUser =
    user?.employee_id ||
    user?.employeeId ||
    user?.emp_id ||
    user?.employee?.employee_id ||
    user?.employee?.id ||
    user?.profile?.employee_id ||
    user?.data?.employee_id ||
    "";
  const currentEmployeeId = employeeId || employeeFromUser || resolvedEmployeeId;

  useEffect(() => {
    if (employeeId || employeeFromUser) return;

    const userId = user?.user_id || user?.userId || user?.id || user?.sub;
    if (!userId) return;

    let cancelled = false;

    api
      .get("/api/v1/get/employees")
      .then((response) => {
        const employee = getItems(response).find(
          (item) =>
            String(item.user_id ?? item.userId ?? "") === String(userId)
        );

        if (!cancelled) setResolvedEmployeeId(employee?.employee_id || employee?.id || "");
      })
      .catch(() => {
        if (!cancelled) setResolvedEmployeeId("");
      });

    return () => {
      cancelled = true;
    };
  }, [employeeFromUser, employeeId, user]);

  const [activeTab, setActiveTab] = useState("my-leaves");
  const [myLeaves, setMyLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchLeaveOptions = async () => {
      try {
        const [policyResult, leaveTypeResult] = await Promise.allSettled([
          api.get("/api/v1/leave/policies", { params: { page: 1, page_size: 100 } }),
          fetchLeaveTypes(),
        ]);

        const policies =
          policyResult.status === "fulfilled" ? getItems(policyResult.value) : [];
        const types =
          leaveTypeResult.status === "fulfilled" ? getItems(leaveTypeResult.value) : [];

        const policyTypes = Array.from(
          new Map(
            policies
              .map((policy) => {
                const id = policy.leave_type_id || policy.leave_type?.leave_type_id;
                return id
                  ? [
                      id,
                      {
                        leave_type_id: id,
                        leave_type_name:
                          policy.leave_type_name || policy.leave_type?.name || id,
                      },
                    ]
                  : null;
              })
              .filter(Boolean)
          ).values()
        );

        setLeavePolicies(policies);
        setLeaveTypes(types.length ? types : policyTypes);
      } catch (err) {
        setError(formatApiError(err));
        setLeaveTypes([]);
        setLeavePolicies([]);
      }
    };

    fetchLeaveOptions();
  }, []);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "my-leaves") {
        if (!currentEmployeeId) {
          setMyLeaves([]);
          setTotal(0);
          return;
        }

        const response = await api.get(
          `/api/v1/get/leave/applied/${currentEmployeeId}`,
          { params: { page, page_size: pageSize, search } }
        );

        const items = getItems(response);
        setMyLeaves(items);
        setTotal(getTotal(response, items));
      } else {
        const response = await api.post(
          "/api/v1/get/all/leave/applied",
          {},
          {
            params: {
              page,
              page_size: pageSize,
              search,
              filter_by: filterBy || undefined,
            },
          }
        );

        const items = getItems(response);
        setAllLeaves(items);
        setTotal(getTotal(response, items));
      }
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentEmployeeId, filterBy, page, pageSize, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeaves();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchLeaves]);

  const list = activeTab === "my-leaves" ? myLeaves : allLeaves;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const selectedPolicies = leavePolicies;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    setFormData({ ...initialForm });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!currentEmployeeId) {
        throw new Error("Logged-in employee profile is not linked to an employee.");
      }

      // Backend calculates days — frontend only sends required fields
      const payload = {
        employee_id: currentEmployeeId,
        leave_type_id: formData.leave_type_id,
        leave_policy_id: formData.leave_policy_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_half_day: formData.is_half_day,
        half_day_session: formData.is_half_day ? formData.half_day_session || null : null,
        reason: formData.reason || null,
        document_url: formData.document_url || null,
      };

      await api.post("/api/v1/apply/leave", payload);

      closeForm();
      setPage(1);
      await fetchLeaves();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelLeave = async (leave) => {
    const leaveId =
      leave.id || leave.apply_leave_id || leave.application_id || leave.leave_application_id;

    if (!leaveId) {
      setError("Leave application ID not found.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this leave?")) return;

    setActionId(leaveId);
    setError("");

    try {
      await api.post(`/api/v1/employee/cancel/leave/${leaveId}`);
      await fetchLeaves();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  const handleUpdateStatus = async (leave, status) => {
    const leaveId =
      leave.id || leave.apply_leave_id || leave.application_id || leave.leave_application_id;

    if (!leaveId) {
      setError("Leave application ID not found.");
      return;
    }

    let decisionReason = "";
    if (status === "REJECTED") {
      decisionReason = window.prompt("Enter rejection reason:") || "Leave rejected";
    }

    setActionId(`${leaveId}-${status}`);
    setError("");

    try {
      await api.put(`/api/v1/employee/approve/leave/${leaveId}`, {
        status: status.toLowerCase(),
        decision_reason: decisionReason,
      });
      await fetchLeaves();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  const getLeaveId = (leave) =>
    leave.id || leave.apply_leave_id || leave.application_id || leave.leave_application_id;

  const getEmployeeName = (leave) =>
    leave.employee_name ||
    leave.employee?.name ||
    leave.employee?.full_name ||
    leave.employee_id ||
    "—";

  const getLeaveType = (leave) => {
    const leaveTypeId =
      leave.leave_type_id || leave.leave_type?.leave_type_id || leave.leave_type?.id;
    const leaveType = leaveTypes.find(
      (type) => String(getLeaveTypeId(type)) === String(leaveTypeId)
    );

    return (
      leave.leave_type_name ||
      leave.leave_type?.leave_type_name ||
      leave.leave_type?.name ||
      leave.leave_type?.type_name ||
      getLeaveTypeName(leaveType) ||
      leaveTypeId ||
      "—"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Leave Applications</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Apply, manage and approve employee leaves
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
          >
            + Apply Leave
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab("my-leaves");
              setPage(1);
              setSearch("");
              setFilterBy("");
            }}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
              activeTab === "my-leaves"
                ? "border-[#E42527] text-[#E42527]"
                : "border-transparent text-slate-500"
            }`}
          >
            My Leaves
          </button>

          <button
            onClick={() => {
              setActiveTab("all-leaves");
              setPage(1);
              setSearch("");
            }}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
              activeTab === "all-leaves"
                ? "border-[#E42527] text-[#E42527]"
                : "border-transparent text-slate-500"
            }`}
          >
            All Applications
          </button>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search leaves..."
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
            />

            <div className="flex items-center gap-3">
              {activeTab === "all-leaves" && (
                <select
                  value={filterBy}
                  onChange={(e) => {
                    setFilterBy(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                >
                  <option value="">All Status</option>
                  {leaveStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}

              <span className="whitespace-nowrap text-sm text-slate-500">
                {total} applications
              </span>
            </div>
          </div>

          {error && !showForm && (
            <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
            ) : list.length === 0 ? (
              <div className="py-20 text-center text-sm text-slate-500">
                No leave applications found
              </div>
            ) : (
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3 font-medium text-slate-500">#</th>
                    {activeTab === "all-leaves" && (
                      <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
                    )}
                    <th className="px-5 py-3 font-medium text-slate-500">Leave Type</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Start Date</th>
                    <th className="px-5 py-3 font-medium text-slate-500">End Date</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Days</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Reason</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {list.map((leave, index) => {
                    const id = getLeaveId(leave);
                    const status = String(leave.leave_status || leave.status || "PENDING").toUpperCase();
                    const canCancel = ["PENDING", "APPROVED"].includes(status);
                    const canApprove = activeTab === "all-leaves" && status === "PENDING";

                    return (
                      <tr key={id || index} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 text-slate-500">
                          {(page - 1) * pageSize + index + 1}
                        </td>

                        {activeTab === "all-leaves" && (
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-slate-800">{getEmployeeName(leave)}</div>
                            <div className="text-xs text-slate-400">{leave.employee_id || ""}</div>
                          </td>
                        )}

                        <td className="px-5 py-3.5 text-slate-700">{getLeaveType(leave)}</td>
                        <td className="px-5 py-3.5 text-slate-600">{formatDate(leave.start_date)}</td>
                        <td className="px-5 py-3.5 text-slate-600">{formatDate(leave.end_date)}</td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {leave.days_requested ?? "—"}
                        </td>
                        <td className="max-w-[220px] truncate px-5 py-3.5 text-slate-600">
                          {leave.reason || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(status)}`}>
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-2">
                            {canApprove && (
                              <>
                                <button
                                  disabled={actionId === `${id}-APPROVED`}
                                  onClick={() => handleUpdateStatus(leave, "APPROVED")}
                                  className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  {actionId === `${id}-APPROVED` ? "..." : "Approve"}
                                </button>
                                <button
                                  disabled={actionId === `${id}-REJECTED`}
                                  onClick={() => handleUpdateStatus(leave, "REJECTED")}
                                  className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                                >
                                  {actionId === `${id}-REJECTED` ? "..." : "Reject"}
                                </button>
                              </>
                            )}

                            {canCancel && (
                              <button
                                disabled={actionId === id}
                                onClick={() => handleCancelLeave(leave)}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                              >
                                {actionId === id ? "Cancelling..." : "Cancel"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-8 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Apply for Leave</h2>
                <p className="mt-0.5 text-xs text-slate-500">Submit a new leave application</p>
              </div>
              <button onClick={closeForm} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[72vh] space-y-5 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Leave Type */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Type *
                    </label>
                    <select
                      required
                      value={formData.leave_type_id}
                      onChange={(e) => {
                        handleChange("leave_type_id", e.target.value);
                        handleChange("leave_policy_id", "");
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map((leaveType) => {
                        const id = getLeaveTypeId(leaveType);
                        return id ? (
                          <option key={id} value={id}>
                            {getLeaveTypeName(leaveType)}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>

                  {/* Leave Policy */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Policy *
                    </label>
                    <select
                      required
                      value={formData.leave_policy_id}
                      onChange={(e) => handleChange("leave_policy_id", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="">Select leave policy</option>
                      {selectedPolicies.map((policy) => {
                        const id = getPolicyId(policy);
                        return id ? (
                          <option key={id} value={id}>
                            {getPolicyName(policy)}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Start Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange("start_date", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      End Date *
                    </label>
                    <input
                      required
                      type="date"
                      min={formData.start_date || undefined}
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                      disabled={formData.is_half_day}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-100"
                    />
                  </div>

                  {/* Half Day */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.is_half_day}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          handleChange("is_half_day", checked);
                          if (checked) {
                            handleChange("end_date", formData.start_date);
                            handleChange("half_day_session", "first_half");
                          } else {
                            handleChange("half_day_session", "");
                          }
                        }}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      Half Day Leave
                    </label>
                  </div>

                  {/* Half Day Session */}
                  {formData.is_half_day && (
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Session *
                      </label>
                      <select
                        required
                        value={formData.half_day_session}
                        onChange={(e) => handleChange("half_day_session", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        <option value="first_half">First Half</option>
                        <option value="second_half">Second Half</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Reason
                  </label>
                  <textarea
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    placeholder="Enter reason for leave"
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

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
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Submitting..." : "Submit Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}