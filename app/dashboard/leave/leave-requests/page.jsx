
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// const initialForm = {
//   leave_type_id: "",
//   leave_policy_id: "",
//   start_date: "",
//   end_date: "",
//   is_half_day: false,
//   half_day_session: "",
//   reason: "",
//   document_url: "",
// };

// const leaveStatuses = ["pending", "approved", "rejected", "cancelled"];

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail
//       .map((item) => {
//         const field = Array.isArray(item.loc) ? item.loc.slice(1).join(".") : "";
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
//   return (
//     data?.items ??
//     data?.results ??
//     data?.leaves ??
//     data?.applications ??
//     data?.leave_applications ??
//     data?.policies ??
//     data?.leave_policies ??
//     data?.types ??
//     data?.leave_types ??
//     data?.employees ??
//     response?.data?.policies ??
//     response?.data?.leave_policies ??
//     response?.data?.leave_types ??
//     response?.data?.leaves ??
//     response?.data?.applications ??
//     response?.data?.leave_applications ??
//     []
//   );
// };

// const getLeaveTypeId = (t) => t?.leave_type_id || t?.id || t?._id;
// const getLeaveTypeName = (t) => t?.leave_type_name || t?.name || t?.type_name || getLeaveTypeId(t);
// const getPolicyId = (p) => p?.leave_policy_id || p?.policy_id || p?.id || p?._id;
// const getPolicyName = (p) => p?.policy_name || p?.leave_policy_name || p?.name || getPolicyId(p);
// const getLeaveId = (l) => l?.apply_leave_id || l?.leave_application_id || l?.application_id || l?.id;

// const fetchLeaveTypes = async () => {
//   const endpoints = [
//     "/api/v1/get/leave/type",
//     "/api/v1/leave/types",
//     "/api/v1/get/leave/types",
//     "/api/v1/get/leave/type/list",
//   ];
//   for (const endpoint of endpoints) {
//     try {
//       const response = await api.get(endpoint);
//       return getItems(response);
//     } catch {}
//   }
//   return [];
// };

// const getTotal = (response, items) =>
//   response?.data?.total ?? response?.data?.count ?? response?.data?.data?.total ?? items.length;

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
//   if (value === "APPROVED") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
//   if (value === "REJECTED") return "bg-red-50 text-red-700 ring-1 ring-red-200";
//   if (value === "CANCELLED") return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
//   return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
// };

// export default function LeaveApplicationsPage({ employeeId = "" }) {
//   const user = useAuthStore((state) => state.user);
//   const currentUserId = user?.user_id || user?.userId || user?.id || user?.sub || "";

//   const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
//   const employeeFromUser =
//     user?.employee_id ||
//     user?.employeeId ||
//     user?.emp_id ||
//     user?.employee?.employee_id ||
//     user?.employee?.id ||
//     user?.profile?.employee_id ||
//     user?.data?.employee_id ||
//     "";
//   const currentEmployeeId = employeeId || employeeFromUser || resolvedEmployeeId;

//   useEffect(() => {
//     if (employeeId || employeeFromUser) return;
//     if (!currentUserId) return;

//     let cancelled = false;
//     api
//       .get("/api/v1/get/employees")
//       .then((response) => {
//         const employee = getItems(response).find(
//           (item) => String(item.user_id ?? item.userId ?? "") === String(currentUserId)
//         );
//         if (!cancelled) setResolvedEmployeeId(employee?.employee_id || employee?.id || "");
//       })
//       .catch(() => {
//         if (!cancelled) setResolvedEmployeeId("");
//       });
//     return () => { cancelled = true; };
//   }, [employeeFromUser, employeeId, currentUserId]);

//   const [activeTab, setActiveTab] = useState("my-leaves"); // my-leaves | pending-approval | all-leaves
//   const [myLeaves, setMyLeaves] = useState([]);
//   const [pendingApprovals, setPendingApprovals] = useState([]);
//   const [allLeaves, setAllLeaves] = useState([]);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [leavePolicies, setLeavePolicies] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [actionId, setActionId] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");
//   const [filterBy, setFilterBy] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   // Fetch leave types & policies
//   useEffect(() => {
//     const fetchLeaveOptions = async () => {
//       try {
//         const [policyResult, leaveTypeResult] = await Promise.allSettled([
//           api.get("/api/v1/leave/policies", { params: { page: 1, page_size: 100 } }),
//           fetchLeaveTypes(),
//         ]);

//         const policies = policyResult.status === "fulfilled" ? getItems(policyResult.value) : [];
//         const types = leaveTypeResult.status === "fulfilled" ? getItems(leaveTypeResult.value) : [];

//         const policyTypes = Array.from(
//           new Map(
//             policies
//               .map((policy) => {
//                 const id = policy.leave_type_id || policy.leave_type?.leave_type_id;
//                 return id
//                   ? [id, { leave_type_id: id, leave_type_name: policy.leave_type_name || policy.leave_type?.name || id }]
//                   : null;
//               })
//               .filter(Boolean)
//           ).values()
//         );

//         setLeavePolicies(policies);
//         setLeaveTypes(types.length ? types : policyTypes);
//       } catch (err) {
//         setError(formatApiError(err));
//       }
//     };
//     fetchLeaveOptions();
//   }, []);

//   const fetchPendingApprovals = useCallback(async () => {
//     if (!currentUserId) {
//       setPendingApprovals([]);
//       return [];
//     }

//     const response = await api.post(
//       "/api/v1/get/all/leave/applied",
//       {},
//       { params: { page: 1, page_size: 1000, filter_by: "pending" } }
//     );
//     const items = getItems(response);
//     const matchesCurrentApprover = (leave) => {
//       const approverIds = [
//         leave.approver_id,
//         leave.current_approver_id,
//         leave.approver?.user_id,
//         leave.approver?.id,
//         leave.current_approver?.user_id,
//         leave.current_approver?.id,
//       ].filter((value) => value !== undefined && value !== null && value !== "");

//       return approverIds.some((approverId) => String(approverId) === String(currentUserId));
//     };
//     const pending = items.filter((leave) => {
//       const status = String(leave.leave_status || leave.status || "").toLowerCase();
//       return status === "pending" && matchesCurrentApprover(leave);
//     });

//     setPendingApprovals(pending);
//     return pending;
//   }, [currentUserId]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchPendingApprovals().catch(() => setPendingApprovals([]));
//     }, 0);
//     return () => clearTimeout(timeoutId);
//   }, [fetchPendingApprovals]);

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
//         const response = await api.get(`/api/v1/get/leave/applied/${currentEmployeeId}`, {
//           params: { page, page_size: pageSize, search },
//         });
//         const items = getItems(response);
//         setMyLeaves(items);
//         setTotal(getTotal(response, items));
//       } 
//       else if (activeTab === "pending-approval") {
//         const myPending = await fetchPendingApprovals();
//         setPendingApprovals(myPending);
//         setTotal(myPending.length);
//       } 
//       else {
//         // All Applications
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
//   }, [activeTab, currentEmployeeId, currentUserId, fetchPendingApprovals, filterBy, page, pageSize, search]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchLeaves(), 0);
//     return () => clearTimeout(t);
//   }, [fetchLeaves]);

//   const list =
//     activeTab === "my-leaves"
//       ? myLeaves
//       : activeTab === "pending-approval"
//       ? pendingApprovals
//       : allLeaves;

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const openAdd = () => {
//     setFormData({ ...initialForm });
//     setError("");
//     setSuccess("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       if (!currentEmployeeId) throw new Error("Employee profile not linked.");

//       const payload = {
//         employee_id: currentEmployeeId,
//         leave_type_id: formData.leave_type_id,
//         leave_policy_id: formData.leave_policy_id,
//         start_date: formData.start_date,
//         end_date: formData.end_date,
//         is_half_day: formData.is_half_day,
//         half_day_session: formData.is_half_day ? formData.half_day_session || null : null,
//         reason: formData.reason || null,
//         document_url: formData.document_url || null,
//       };

//       await api.post("/api/v1/apply/leave", payload);
//       closeForm();
//       setPage(1);
//       setSuccess("Leave applied successfully!");
//       setActiveTab("my-leaves");
//       await fetchLeaves();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancelLeave = async (leave) => {
//     const leaveId = getLeaveId(leave);
//     if (!leaveId) return setError("Leave ID not found");
//     if (!window.confirm("Are you sure you want to cancel this leave?")) return;

//     setActionId(leaveId);
//     setError("");
//     try {
//       await api.post(`/api/v1/employee/cancel/leave/${leaveId}`);
//       setSuccess("Leave cancelled successfully");
//       await fetchLeaves();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setActionId(null);
//     }
//   };

//   const handleUpdateStatus = async (leave, status) => {
//     const leaveId = getLeaveId(leave);
//     const apiStatus = status.toLowerCase();
//     if (!leaveId) return setError("Leave ID not found");

//     let decisionReason = "";
//     if (apiStatus === "rejected") {
//       decisionReason = window.prompt("Enter rejection reason:") || "Leave rejected";
//       if (!decisionReason.trim()) return;
//     } else {
//       if (!window.confirm("Are you sure you want to approve this leave?")) return;
//     }

//     setActionId(`${leaveId}-${status}`);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await api.put(`/api/v1/employee/approve/leave/${leaveId}`, {
//         status: apiStatus,
//         decision_reason: decisionReason || null,
//       });

//       setSuccess(response?.data?.message || `Leave ${apiStatus} successfully`);
//       await fetchLeaves();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setActionId(null);
//     }
//   };

//   const getEmployeeName = (leave) =>
//     leave.employee_name || leave.employee?.name || leave.employee?.full_name || leave.employee_id || "—";

//   const getLeaveType = (leave) => {
//     const leaveTypeId = leave.leave_type_id || leave.leave_type?.leave_type_id || leave.leave_type?.id;
//     const leaveType = leaveTypes.find((t) => String(getLeaveTypeId(t)) === String(leaveTypeId));
//     return (
//       leave.leave_type_name ||
//       leave.leave_type?.leave_type_name ||
//       leave.leave_type?.name ||
//       getLeaveTypeName(leaveType) ||
//       leaveTypeId ||
//       "—"
//     );
//   };

//   const getApproverName = (leave) => {
//     return (
//       leave.approver_name ||
//       leave.current_approver_name ||
//       leave.approver?.name ||
//       leave.approver_id ||
//       "—"
//     );
//   };

//   const filteredPolicies = formData.leave_type_id
//     ? leavePolicies.filter(
//         (p) => String(p.leave_type_id || p.leave_type?.leave_type_id) === String(formData.leave_type_id)
//       )
//     : leavePolicies;

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Leave Applications</h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Apply leave • Track status • Approve requests
//             </p>
//           </div>
//           <button
//             onClick={openAdd}
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21] active:scale-[0.98]"
//           >
//             + Apply Leave
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
//           <button
//             onClick={() => {
//               setActiveTab("my-leaves");
//               setPage(1);
//               setSearch("");
//               setFilterBy("");
//             }}
//             className={`flex-1 min-w-[140px] rounded-lg px-4 py-2.5 text-sm font-medium transition ${
//               activeTab === "my-leaves"
//                 ? "bg-[#E42527] text-white shadow"
//                 : "text-slate-600 hover:bg-slate-50"
//             }`}
//           >
//             My Leaves
//           </button>

//           <button
//             onClick={() => {
//               setActiveTab("pending-approval");
//               setPage(1);
//               setSearch("");
//               setFilterBy("");
//             }}
//             className={`flex-1 min-w-[140px] rounded-lg px-4 py-2.5 text-sm font-medium transition ${
//               activeTab === "pending-approval"
//                 ? "bg-[#E42527] text-white shadow"
//                 : "text-slate-600 hover:bg-slate-50"
//             }`}
//           >
//             Pending My Approval
//             {pendingApprovals.length > 0 && activeTab !== "pending-approval" && (
//               <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
//                 {pendingApprovals.length}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={() => {
//               setActiveTab("all-leaves");
//               setPage(1);
//               setSearch("");
//             }}
//             className={`flex-1 min-w-[140px] rounded-lg px-4 py-2.5 text-sm font-medium transition ${
//               activeTab === "all-leaves"
//                 ? "bg-[#E42527] text-white shadow"
//                 : "text-slate-600 hover:bg-slate-50"
//             }`}
//           >
//             All Applications
//           </button>
//         </div>

//         {/* Table Card */}
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {/* Toolbar */}
//           <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <input
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search leaves..."
//               className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/20"
//             />

//             <div className="flex items-center gap-3">
//               {activeTab === "all-leaves" && (
//                 <select
//                   value={filterBy}
//                   onChange={(e) => {
//                     setFilterBy(e.target.value);
//                     setPage(1);
//                   }}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                 >
//                   <option value="">All Status</option>
//                   {leaveStatuses.map((s) => (
//                     <option key={s} value={s}>
//                       {s.charAt(0).toUpperCase() + s.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
//                 {total} total
//               </span>
//             </div>
//           </div>

//           {/* Messages */}
//           {error && !showForm && (
//             <div className="mx-5 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
//           )}
//           {success && !showForm && (
//             <div className="mx-5 mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
//           )}

//           {/* Table */}
//           <div className="overflow-x-auto">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-24 text-slate-500">
//                 <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
//                 <p className="text-sm">Loading...</p>
//               </div>
//             ) : list.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-24 text-slate-500">
//                 <div className="mb-3 text-4xl">
//                   {activeTab === "pending-approval" ? "✅" : "📭"}
//                 </div>
//                 <p className="text-sm font-medium">
//                   {activeTab === "pending-approval"
//                     ? "No leaves pending your approval"
//                     : "No leave applications found"}
//                 </p>
//               </div>
//             ) : (
//               <table className="w-full min-w-[1000px] text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-100 bg-slate-50/80">
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">#</th>

//                     {(activeTab === "all-leaves" || activeTab === "pending-approval") && (
//                       <th className="px-5 py-3.5 font-semibold text-slate-500">Employee</th>
//                     )}

//                     <th className="px-5 py-3.5 font-semibold text-slate-500">Leave Type</th>
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">Duration</th>
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">Days</th>
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">Reason</th>
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">Status</th>

//                     {/* My Leaves tab mein Approver dikhao */}
//                     {activeTab === "my-leaves" && (
//                       <th className="px-5 py-3.5 font-semibold text-slate-500">Pending With</th>
//                     )}

//                     <th className="px-5 py-3.5 text-right font-semibold text-slate-500">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-50">
//                   {list.map((leave, index) => {
//                     const id = getLeaveId(leave);
//                     const status = String(leave.leave_status || leave.status || "PENDING").toUpperCase();
//                     const canCancel =
//                       activeTab === "my-leaves" && ["PENDING", "APPROVED"].includes(status);
//                     const canApprove =
//                       (activeTab === "pending-approval" || activeTab === "all-leaves") &&
//                       status === "PENDING";

//                     return (
//                       <tr key={id || index} className="hover:bg-slate-50/70">
//                         <td className="px-5 py-4 text-slate-400">
//                           {(page - 1) * pageSize + index + 1}
//                         </td>

//                         {(activeTab === "all-leaves" || activeTab === "pending-approval") && (
//                           <td className="px-5 py-4">
//                             <div className="font-medium text-slate-800">{getEmployeeName(leave)}</div>
//                             <div className="text-xs text-slate-400">{leave.employee_id || ""}</div>
//                           </td>
//                         )}

//                         <td className="px-5 py-4">
//                           <div className="font-medium text-slate-700">{getLeaveType(leave)}</div>
//                           {leave.is_half_day && (
//                             <span className="mt-0.5 inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
//                               Half Day
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-4 text-slate-600">
//                           <div>{formatDate(leave.start_date)}</div>
//                           <div className="text-xs text-slate-400">→ {formatDate(leave.end_date)}</div>
//                         </td>

//                         <td className="px-5 py-4">
//                           <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
//                             {leave.days_requested ?? "—"}
//                           </span>
//                         </td>

//                         <td className="max-w-[180px] truncate px-5 py-4 text-slate-600">
//                           {leave.reason || "—"}
//                         </td>

//                         <td className="px-5 py-4">
//                           <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}`}>
//                             {status}
//                           </span>
//                         </td>

//                         {/* Pending With column - only in My Leaves */}
//                         {activeTab === "my-leaves" && (
//                           <td className="px-5 py-4">
//                             {status === "PENDING" ? (
//                               <div>
//                                 <div className="text-sm font-medium text-slate-700">
//                                   {getApproverName(leave)}
//                                 </div>
//                                 {leave.current_level && (
//                                   <div className="text-xs text-slate-400">
//                                     Level {leave.current_level}
//                                   </div>
//                                 )}
//                               </div>
//                             ) : (
//                               <span className="text-slate-400">—</span>
//                             )}
//                           </td>
//                         )}

//                         <td className="px-5 py-4 text-right">
//                           <div className="flex justify-end gap-2">
//                             {canApprove && (
//                               <>
//                                 <button
//                                   disabled={!!actionId}
//                                   onClick={() => handleUpdateStatus(leave, "APPROVED")}
//                                   className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
//                                 >
//                                   {actionId === `${id}-APPROVED` ? "..." : "Approve"}
//                                 </button>
//                                 <button
//                                   disabled={!!actionId}
//                                   onClick={() => handleUpdateStatus(leave, "REJECTED")}
//                                   className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
//                                 >
//                                   {actionId === `${id}-REJECTED` ? "..." : "Reject"}
//                                 </button>
//                               </>
//                             )}
//                             {canCancel && (
//                               <button
//                                 disabled={!!actionId}
//                                 onClick={() => handleCancelLeave(leave)}
//                                 className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
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

//           {/* Pagination - only for my-leaves and all-leaves */}
//           {activeTab !== "pending-approval" && totalPages > 1 && (
//             <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
//               <span className="text-sm text-slate-500">
//                 Page <strong>{page}</strong> of {totalPages}
//               </span>
//               <div className="flex gap-2">
//                 <button
//                   disabled={page <= 1}
//                   onClick={() => setPage((p) => p - 1)}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   disabled={page >= totalPages}
//                   onClick={() => setPage((p) => p + 1)}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Apply Leave Modal - same as before */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-10 backdrop-blur-sm">
//           <div className="mb-12 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-800">Apply for Leave</h2>
//                 <p className="mt-0.5 text-sm text-slate-500">Fill the details below</p>
//               </div>
//               <button onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
//                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Leave Type *</label>
//                     <select
//                       required
//                       value={formData.leave_type_id}
//                       onChange={(e) => {
//                         handleChange("leave_type_id", e.target.value);
//                         handleChange("leave_policy_id", "");
//                       }}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                     >
//                       <option value="">Select leave type</option>
//                       {leaveTypes.map((t) => {
//                         const id = getLeaveTypeId(t);
//                         return id ? <option key={id} value={id}>{getLeaveTypeName(t)}</option> : null;
//                       })}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Leave Policy *</label>
//                     <select
//                       required
//                       value={formData.leave_policy_id}
//                       onChange={(e) => handleChange("leave_policy_id", e.target.value)}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                     >
//                       <option value="">Select leave policy</option>
//                       {filteredPolicies.map((p) => {
//                         const id = getPolicyId(p);
//                         return id ? <option key={id} value={id}>{getPolicyName(p)}</option> : null;
//                       })}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date *</label>
//                     <input
//                       required
//                       type="date"
//                       value={formData.start_date}
//                       onChange={(e) => handleChange("start_date", e.target.value)}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date *</label>
//                     <input
//                       required
//                       type="date"
//                       min={formData.start_date || undefined}
//                       value={formData.end_date}
//                       onChange={(e) => handleChange("end_date", e.target.value)}
//                       disabled={formData.is_half_day}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20 disabled:bg-slate-100"
//                     />
//                   </div>

//                   <div className="sm:col-span-2">
//                     <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
//                       <input
//                         type="checkbox"
//                         checked={formData.is_half_day}
//                         onChange={(e) => {
//                           const checked = e.target.checked;
//                           handleChange("is_half_day", checked);
//                           if (checked) {
//                             handleChange("end_date", formData.start_date);
//                             handleChange("half_day_session", "first_half");
//                           } else {
//                             handleChange("half_day_session", "");
//                           }
//                         }}
//                         className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
//                       />
//                       <span className="text-sm font-medium text-slate-700">Half Day Leave</span>
//                     </label>
//                   </div>

//                   {formData.is_half_day && (
//                     <div className="sm:col-span-2">
//                       <label className="mb-1.5 block text-sm font-medium text-slate-700">Session *</label>
//                       <select
//                         required
//                         value={formData.half_day_session}
//                         onChange={(e) => handleChange("half_day_session", e.target.value)}
//                         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                       >
//                         <option value="first_half">First Half</option>
//                         <option value="second_half">Second Half</option>
//                       </select>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason</label>
//                   <textarea
//                     rows={4}
//                     value={formData.reason}
//                     onChange={(e) => handleChange("reason", e.target.value)}
//                     placeholder="Briefly explain the reason..."
//                     className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                   />
//                 </div>

//                 {error && (
//                   <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
//                 )}
//               </div>

//               <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21] disabled:opacity-60"
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
    response?.data?.employees ??
    []
  );
};

const getLeaveTypeId = (t) => t?.leave_type_id || t?.id || t?._id;
const getLeaveTypeName = (t) => t?.leave_type_name || t?.name || getLeaveTypeId(t);
const getPolicyId = (p) => p?.leave_policy_id || p?.policy_id || p?.id || p?._id;
const getPolicyName = (p) => p?.policy_name || p?.name || getPolicyId(p);
const getPolicyLeaveTypeId = (p) =>
  p?.leave_type_id ||
  p?.leave_type?.leave_type_id ||
  p?.leave_type?.id ||
  p?.leave_type?._id;
const getLeaveId = (l) => l?.apply_leave_id || l?.id;

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
  if (value === "APPROVED") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (value === "REJECTED") return "bg-red-50 text-red-700 ring-1 ring-red-200";
  if (value === "CANCELLED") return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
};

export default function LeaveApplicationsPage({ employeeId = "" }) {
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.user_id || user?.userId || user?.id || user?.sub || "";

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
    if (employeeId || employeeFromUser || !currentUserId) return;

    let cancelled = false;
    api
      .get("/api/v1/get/employees")
      .then((response) => {
        const employee = getItems(response).find(
          (item) =>
            String(item.user_id ?? item.userId ?? item.user?.user_id ?? item.user?.id ?? "") ===
            String(currentUserId)
        );
        if (!cancelled) {
          setResolvedEmployeeId(employee?.employee_id || employee?.id || employee?._id || "");
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [employeeFromUser, employeeId, currentUserId]);

  const [activeTab, setActiveTab] = useState("my-leaves");
  const [myLeaves, setMyLeaves] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch leave types & policies
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [policyRes, typeRes] = await Promise.allSettled([
          api.get("/api/v1/leave/policies", { params: { page: 1, page_size: 100 } }),
          api.get("/api/v1/get/leave/type"),
        ]);

        const policies = policyRes.status === "fulfilled" ? getItems(policyRes.value) : [];
        const types = typeRes.status === "fulfilled" ? getItems(typeRes.value) : [];

        setLeavePolicies(policies);
        setLeaveTypes(types.length ? types : []);
      } catch (err) {
        setError(formatApiError(err));
      }
    };
    fetchOptions();
  }, []);

  const fetchPendingApprovals = useCallback(async () => {
    try {
      // Pehle naya approval API try karo
      const res = await api.get("/api/v1/approvals/pending", {
        params: { approval_type: "leave" },
      });
      const items = getItems(res);
      setPendingApprovals(items);
      return items;
    } catch {
      // Fallback to old method
      try {
        const response = await api.post(
          "/api/v1/get/all/leave/applied",
          {},
          { params: { page: 1, page_size: 100, filter_by: "pending" } }
        );
        const items = getItems(response).filter((leave) => {
          const status = String(leave.leave_status || "").toLowerCase();
          const isPending = status === "pending";
          const isMyApproval =
            String(leave.approver_id || "") === String(currentUserId) ||
            String(leave.current_approver_id || "") === String(currentUserId);
          return isPending && isMyApproval;
        });
        setPendingApprovals(items);
        return items;
      } catch {
        setPendingApprovals([]);
        return [];
      }
    }
  }, [currentUserId]);

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
        const response = await api.get(`/api/v1/get/leave/applied/${currentEmployeeId}`, {
          params: { page, page_size: pageSize, search },
        });
        const items = getItems(response);
        setMyLeaves(items);
        setTotal(response?.data?.total || items.length);
      } else if (activeTab === "pending-approval") {
        const items = await fetchPendingApprovals();
        setTotal(items.length);
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
        setTotal(response?.data?.total || items.length);
      }
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentEmployeeId, fetchPendingApprovals, filterBy, page, pageSize, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeaves();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchLeaves]);

  const list =
    activeTab === "my-leaves"
      ? myLeaves
      : activeTab === "pending-approval"
      ? pendingApprovals
      : allLeaves;

  const totalPages = Math.ceil(total / pageSize) || 1;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    setFormData({ ...initialForm });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!currentEmployeeId) throw new Error("Employee profile not linked.");

      const payload = {
        employee_id: currentEmployeeId,
        leave_type_id: formData.leave_type_id,
        leave_policy_id: formData.leave_policy_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_half_day: formData.is_half_day,
        half_day_session: formData.is_half_day ? formData.half_day_session : null,
        reason: formData.reason || null,
        document_url: formData.document_url || null,
      };

      const res = await api.post("/api/v1/apply/leave", payload);
      const data = res?.data;

      closeForm();
      setPage(1);
      setActiveTab("my-leaves");

      // Auto Approve handling
      if (data?.approval_status === "approved" || data?.leave_application?.leave_status === "APPROVED") {
        setSuccess("✅ Leave Auto-Approved successfully!");
      } else {
        setSuccess("Leave applied successfully! Waiting for approval.");
      }

      await fetchLeaves();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelLeave = async (leave) => {
    const leaveId = getLeaveId(leave);
    if (!leaveId) return setError("Leave ID not found");
    if (!window.confirm("Are you sure you want to cancel this leave?")) return;

    setActionId(leaveId);
    try {
      await api.post(`/api/v1/employee/cancel/leave/${leaveId}`);
      setSuccess("Leave cancelled successfully");
      await fetchLeaves();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  const handleUpdateStatus = async (leave, status) => {
    const leaveId = getLeaveId(leave);
    if (!leaveId) return setError("Leave ID not found");

    let decisionReason = "";
    if (status === "REJECTED") {
      decisionReason = window.prompt("Enter rejection reason:") || "Rejected";
      if (!decisionReason.trim()) return;
    } else {
      if (!window.confirm("Approve this leave?")) return;
    }

    setActionId(`${leaveId}-${status}`);
    try {
      await api.put(`/api/v1/employee/approve/leave/${leaveId}`, {
        status: status.toLowerCase(),
        decision_reason: decisionReason || null,
      });
      setSuccess(`Leave ${status.toLowerCase()} successfully`);
      await fetchLeaves();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionId(null);
    }
  };

  const getEmployeeName = (leave) =>
    leave.employee_name || leave.employee?.name || leave.employee_id || "—";

  const getLeaveType = (leave) => {
    const id = leave.leave_type_id;
    const found = leaveTypes.find((t) => String(getLeaveTypeId(t)) === String(id));
    return leave.leave_type_name || getLeaveTypeName(found) || id || "—";
  };

  const getApproverName = (leave) => {
    return leave.approver_name || leave.current_approver_name || leave.approver_id || "—";
  };

  const filteredPolicies = formData.leave_type_id
    ? leavePolicies.filter(
        (p) => String(getPolicyLeaveTypeId(p)) === String(formData.leave_type_id)
      )
    : leavePolicies;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Leave Applications</h1>
            <p className="mt-1 text-sm text-slate-500">
              Apply leave • Track multi-level approval • Manage requests
            </p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
          >
            + Apply Leave
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
          {[
            { key: "my-leaves", label: "My Leaves" },
            { key: "pending-approval", label: "Pending My Approval" },
            { key: "all-leaves", label: "All Applications" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
                setSearch("");
                setFilterBy("");
              }}
              className={`flex-1 min-w-[140px] rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#E42527] text-white shadow"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
              {tab.key === "pending-approval" && pendingApprovals.length > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search leaves..."
              className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
            />

            <div className="flex items-center gap-3">
              {activeTab === "all-leaves" && (
                <select
                  value={filterBy}
                  onChange={(e) => {
                    setFilterBy(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">All Status</option>
                  {leaveStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              )}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {total} total
              </span>
            </div>
          </div>

          {error && !showForm && (
            <div className="mx-5 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          {success && !showForm && (
            <div className="mx-5 mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
                <p className="text-sm">Loading...</p>
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                <div className="mb-3 text-4xl">{activeTab === "pending-approval" ? "✅" : "📭"}</div>
                <p className="text-sm font-medium">
                  {activeTab === "pending-approval"
                    ? "No leaves pending your approval"
                    : "No leave applications found"}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 font-semibold text-slate-500">#</th>
                    {(activeTab === "all-leaves" || activeTab === "pending-approval") && (
                      <th className="px-5 py-3.5 font-semibold text-slate-500">Employee</th>
                    )}
                    <th className="px-5 py-3.5 font-semibold text-slate-500">Leave Type</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-500">Duration</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-500">Days</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-500">Status</th>
                    {activeTab === "my-leaves" && (
                      <th className="px-5 py-3.5 font-semibold text-slate-500">Pending With</th>
                    )}
                    <th className="px-5 py-3.5 text-right font-semibold text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {list.map((leave, index) => {
                    const id = getLeaveId(leave);
                    const status = String(leave.leave_status || monleave.status || "PENDING").toUpperCase();
                    const canCancel = activeTab === "my-leaves" && ["PENDING", "APPROVED"].includes(status);
                    const canApprove =
                      (activeTab === "pending-approval" || activeTab === "all-leaves") &&
                      status === "PENDING";

                    return (
                      <tr key={id || index} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4 text-slate-400">
                          {(page - 1) * pageSize + index + 1}
                        </td>

                        {(activeTab === "all-leaves" || activeTab === "pending-approval") && (
                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-800">{getEmployeeName(leave)}</div>
                            <div className="text-xs text-slate-400">{leave.employee_id}</div>
                          </td>
                        )}

                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-700">{getLeaveType(leave)}</div>
                          {leave.is_half_day && (
                            <span className="mt-0.5 inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                              Half Day ({leave.half_day_session})
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div>{formatDate(leave.start_date)}</div>
                          <div className="text-xs text-slate-400">→ {formatDate(leave.end_date)}</div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                            {leave.days_requested ?? "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}`}>
                            {status}
                          </span>
                          {leave.current_level > 0 && status === "PENDING" && (
                            <div className="mt-1 text-[11px] text-slate-400">
                              Level {leave.current_level}
                            </div>
                          )}
                        </td>

                        {activeTab === "my-leaves" && (
                          <td className="px-5 py-4">
                            {status === "PENDING" ? (
                              <div>
                                <div className="text-sm font-medium text-slate-700">
                                  {getApproverName(leave)}
                                </div>
                                {leave.current_level && (
                                  <div className="text-xs text-slate-400">Level {leave.current_level}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {canApprove && (
                              <>
                                <button
                                  disabled={!!actionId}
                                  onClick={() => handleUpdateStatus(leave, "APPROVED")}
                                  className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  {actionId === `${id}-APPROVED` ? "..." : "Approve"}
                                </button>
                                <button
                                  disabled={!!actionId}
                                  onClick={() => handleUpdateStatus(leave, "REJECTED")}
                                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                >
                                  {actionId === `${id}-REJECTED` ? "..." : "Reject"}
                                </button>
                              </>
                            )}
                            {canCancel && (
                              <button
                                disabled={!!actionId}
                                onClick={() => handleCancelLeave(leave)}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                              >
                                {actionId === id ? "..." : "Cancel"}
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

          {/* Pagination */}
          {activeTab !== "pending-approval" && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
              <span className="text-sm text-slate-500">
                Page <strong>{page}</strong> of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-10 backdrop-blur-sm">
          <div className="mb-12 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Apply for Leave</h2>
                <p className="mt-0.5 text-sm text-slate-500">Fill the details below</p>
              </div>
              <button onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Leave Type *</label>
                    <select
                      required
                      value={formData.leave_type_id}
                      onChange={(e) => {
                        handleChange("leave_type_id", e.target.value);
                        handleChange("leave_policy_id", "");
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map((t) => {
                        const id = getLeaveTypeId(t);
                        return id ? (
                          <option key={id} value={id}>
                            {getLeaveTypeName(t)}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Leave Policy *</label>
                    <select
                      required
                      value={formData.leave_policy_id}
                      onChange={(e) => handleChange("leave_policy_id", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                    >
                      <option value="">Select leave policy</option>
                      {filteredPolicies.map((p) => {
                        const id = getPolicyId(p);
                        return id ? (
                          <option key={id} value={id}>
                            {getPolicyName(p)}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date *</label>
                    <input
                      required
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange("start_date", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date *</label>
                    <input
                      required
                      type="date"
                      min={formData.start_date || undefined}
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                      disabled={formData.is_half_day}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
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
                        className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
                      />
                      <span className="text-sm font-medium text-slate-700">Half Day Leave</span>
                    </label>
                  </div>

                  {formData.is_half_day && (
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Session *</label>
                      <select
                        required
                        value={formData.half_day_session}
                        onChange={(e) => handleChange("half_day_session", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                      >
                        <option value="first_half">First Half</option>
                        <option value="second_half">Second Half</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason</label>
                  <textarea
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    placeholder="Briefly explain the reason..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21] disabled:opacity-60"
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