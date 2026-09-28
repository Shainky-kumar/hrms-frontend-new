

// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// /* ================= CONSTANTS ================= */

// const initialForm = {
//   leave_type_id: "",
//   start_date: "",
//   end_date: "",
//   is_half_day: false,
//   half_day_session: "first_half",
//   reason: "",
//   document_url: "",
// };

// const leaveStatuses = ["pending", "approved", "rejected", "cancelled"];

// const HR_ROLES = new Set([
//   "hr", "hr_manager", "hr-manager",
//   "admin", "super_admin", "super-admin", "superadmin", "owner",
//   "manager", "team_lead", "team-lead",
// ]);

// /* ================= HELPERS ================= */

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
//   if (err?.code === "ERR_NETWORK") return "Network error.";
//   if (err?.response?.status === 401) return "Session expired. Login again.";
//   if (err?.response?.status === 403) return "You don't have permission.";
//   if (err?.response?.status === 404) return "Not found.";
//   if (err?.response?.status === 422) return "Invalid data. Check fields.";
//   return err?.message || "Something went wrong";
// };

// const isCancel = (err) =>
//   err?.name === "CanceledError" ||
//   err?.code === "ERR_CANCELED" ||
//   err?.name === "AbortError";

// const getItems = (response) => {
//   const data = response?.data?.data ?? response?.data ?? [];
//   if (Array.isArray(data)) return data;
//   return (
//     data?.items ??
//     data?.results ??
//     data?.leaves ??
//     data?.applications ??
//     data?.leave_applications ??
//     data?.leave_types ??
//     data?.employees ??
//     []
//   );
// };

// const getLeaveTypeId = (t) => t?.leave_type_id || t?.id || t?._id || "";
// const getLeaveTypeName = (t) =>
//   t?.leave_type_name || t?.name || getLeaveTypeId(t);

// const getLeaveId = (l) =>
//   l?.apply_leave_id ||
//   l?.leave_application_id ||
//   l?.leave_id ||
//   l?.id ||
//   null;

// const formatDate = (value) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "—";
//   return d.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const computeDays = (start, end, isHalf) => {
//   if (!start) return 0;
//   if (isHalf) return 0.5;
//   if (!end) return 0;
//   const s = new Date(start);
//   const e = new Date(end);
//   if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
//   if (e < s) return 0;
//   return Math.floor((e - s) / 86400000) + 1;
// };

// const statusOf = (leave) =>
//   String(leave?.leave_status ?? leave?.status ?? "PENDING").toUpperCase();

// const statusClass = (status) => {
//   const v = String(status || "").toUpperCase();
//   if (v === "APPROVED")
//     return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
//   if (v === "REJECTED")
//     return "bg-red-50 text-red-700 ring-1 ring-red-200";
//   if (v === "CANCELLED")
//     return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
//   return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
// };

// const hasHrAccess = (user) => {
//   if (!user) return false;
//   const roles = [user.role, ...(Array.isArray(user.roles) ? user.roles : [])]
//     .filter(Boolean)
//     .map((r) =>
//       String(typeof r === "string" ? r : r?.name || r?.role || "")
//         .toLowerCase()
//         .trim()
//     );
//   return roles.some((r) => HR_ROLES.has(r));
// };

// /* ================= COMPONENT ================= */

// export default function LeaveApplicationsPage({ employeeId = "" }) {
//   const user = useAuthStore((state) => state.user);
//   const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);
//   const currentUserId =
//     user?.user_id || user?.userId || user?.id || user?.sub || "";

//   const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
//   const employeeFromUser =
//     user?.employee_id ||
//     user?.employeeId ||
//     user?.emp_id ||
//     user?.employee?.employee_id ||
//     user?.profile?.employee_id ||
//     user?.data?.employee_id ||
//     "";
//   const currentEmployeeId = employeeId || employeeFromUser || resolvedEmployeeId;

//   /* ───── resolve employee id if not in JWT ───── */
//   useEffect(() => {
//     if (employeeId || employeeFromUser || !currentUserId) return;
//     let cancelled = false;
//     api
//       .get("/api/v1/get/employees")
//       .then((response) => {
//         const employee = getItems(response).find(
//           (item) =>
//             String(
//               item.user_id ??
//                 item.userId ??
//                 item.user?.user_id ??
//                 item.user?.id ??
//                 ""
//             ) === String(currentUserId)
//         );
//         if (!cancelled) {
//           setResolvedEmployeeId(
//             employee?.employee_id || employee?.id || employee?._id || ""
//           );
//         }
//       })
//       .catch(() => {});
//     return () => {
//       cancelled = true;
//     };
//   }, [employeeFromUser, employeeId, currentUserId]);

//   /* ───── tabs (RBAC) ───── */
//   const availableTabs = useMemo(() => {
//     const tabs = [{ key: "my-leaves", label: "My Leaves" }];
//     tabs.push({ key: "pending-approval", label: "Pending My Approval" });
//     if (isHrOrAdmin) {
//       tabs.push({ key: "all-leaves", label: "All Applications" });
//     }
//     return tabs;
//   }, [isHrOrAdmin]);

//   /* ───── state ───── */
//   const [activeTab, setActiveTab] = useState("my-leaves");
//   const [myLeaves, setMyLeaves] = useState([]);
//   const [pendingApprovals, setPendingApprovals] = useState([]);
//   const [allLeaves, setAllLeaves] = useState([]);

//   /* ⭐ NEW: applicable policies (leave types employee can apply for) */
//   const [applicablePolicies, setApplicablePolicies] = useState([]);
//   const [optionsLoading, setOptionsLoading] = useState(true);

//   const [formData, setFormData] = useState(initialForm);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [actionId, setActionId] = useState(null);
//   const [error, setError] = useState("");
//   const [formError, setFormError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [filterBy, setFilterBy] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   const [details, setDetails] = useState(null);
//   const [confirmAction, setConfirmAction] = useState(null);

//   const abortRef = useRef(null);

//   /* ⭐ NEW: Load applicable policies (only leave types employee can apply for) */
//   useEffect(() => {
//     if (!currentEmployeeId && !currentUserId) return;
//     let cancelled = false;
//     setOptionsLoading(true);

//     api
//       .get("/api/v1/leave/my-applicable-policies")
//       .then((res) => {
//         if (cancelled) return;
//         const payload = res?.data?.data ?? res?.data ?? {};
//         const items = payload?.leave_types ?? [];
//         // ⭐ Only keep leave types where employee CAN apply
//         const applicable = (Array.isArray(items) ? items : []).filter(
//           (lt) => lt.can_apply === true
//         );
//         setApplicablePolicies(applicable);
//         setOptionsLoading(false);
//         console.log("[APPLICABLE POLICIES]", applicable);
//       })
//       .catch((err) => {
//         if (cancelled) return;
//         console.error("[APPLICABLE POLICIES ERROR]", err);
//         setApplicablePolicies([]);
//         setOptionsLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [currentEmployeeId, currentUserId]);

//   /* ───── debounce search ───── */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* ───── auto-dismiss success ───── */
//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), 4000);
//     return () => clearTimeout(t);
//   }, [success]);

//   /* ───── pending approvals ───── */
//   const fetchPendingApprovals = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/approvals/pending", {
//         params: { approval_type: "leave", page: 1, page_size: 100 },
//       });
//       const items = getItems(res);
//       setPendingApprovals(items);
//       return items;
//     } catch {
//       try {
//         const response = await api.post(
//           "/api/v1/get/all/leave/applied",
//           {},
//           { params: { page: 1, page_size: 100, filter_by: "pending" } }
//         );
//         const items = getItems(response).filter((leave) => {
//           const st = String(
//             leave.leave_status || leave.status || ""
//           ).toLowerCase();
//           const isPending = st === "pending";
//           const isMyApproval =
//             String(leave.approver_id || "") === String(currentUserId) ||
//             String(leave.current_approver_id || "") === String(currentUserId);
//           return isPending && isMyApproval;
//         });
//         setPendingApprovals(items);
//         return items;
//       } catch {
//         setPendingApprovals([]);
//         return [];
//       }
//     }
//   }, [currentUserId]);

//   /* ───── main fetch ───── */
//   const fetchLeaves = useCallback(async () => {
//     if (abortRef.current) abortRef.current.abort();
//     const controller = new AbortController();
//     abortRef.current = controller;

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
//             params: { page, page_size: pageSize, ...(search ? { search } : {}) },
//             signal: controller.signal,
//           }
//         );
//         const items = getItems(response);
//         setMyLeaves(items);
//         setTotal(response?.data?.total ?? items.length);
//       } else if (activeTab === "pending-approval") {
//         const items = await fetchPendingApprovals();
//         setTotal(items.length);
//       } else {
//         const response = await api.post(
//           "/api/v1/get/all/leave/applied",
//           {},
//           {
//             params: {
//               page,
//               page_size: pageSize,
//               ...(search ? { search } : {}),
//               ...(filterBy ? { filter_by: filterBy } : {}),
//             },
//             signal: controller.signal,
//           }
//         );
//         const items = getItems(response);
//         setAllLeaves(items);
//         setTotal(response?.data?.total ?? items.length);
//       }
//     } catch (err) {
//       if (isCancel(err)) return;
//       setError(formatApiError(err));
//     } finally {
//       if (!controller.signal.aborted) setLoading(false);
//     }
//   }, [
//     activeTab,
//     currentEmployeeId,
//     fetchPendingApprovals,
//     filterBy,
//     page,
//     pageSize,
//     search,
//   ]);

//   useEffect(() => {
//     fetchLeaves();
//     return () => {
//       if (abortRef.current) abortRef.current.abort();
//     };
//   }, [fetchLeaves]);

//   /* ───── list + derived ───── */
//   const list = useMemo(() => {
//     if (activeTab === "my-leaves") return myLeaves;
//     if (activeTab === "pending-approval") return pendingApprovals;
//     return allLeaves;
//   }, [activeTab, myLeaves, pendingApprovals, allLeaves]);

//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   const getEmployeeName = (leave) =>
//     leave.employee_name ||
//     leave.employee?.name ||
//     leave.employee_id ||
//     "—";

//   const getLeaveType = (leave) => {
//     const id = leave.leave_type_id;
//     if (leave.leave_type_name) return leave.leave_type_name;
//     const found = applicablePolicies.find(
//       (t) => String(getLeaveTypeId(t)) === String(id)
//     );
//     if (found) return getLeaveTypeName(found);
//     if (!id) return "—";
//     const s = String(id);
//     return s.length > 12 ? `${s.slice(0, 8)}…` : s;
//   };

//   const getApproverName = (leave) =>
//     leave.approver_name ||
//     leave.current_approver_name ||
//     leave.approver_id ||
//     "—";

//   /* ⭐ Selected leave type object (for showing balance + policy info) */
//   const selectedLeaveType = useMemo(() => {
//     if (!formData.leave_type_id) return null;
//     return (
//       applicablePolicies.find(
//         (lt) => String(getLeaveTypeId(lt)) === String(formData.leave_type_id)
//       ) || null
//     );
//   }, [applicablePolicies, formData.leave_type_id]);

//   const previewDays = useMemo(
//     () =>
//       computeDays(
//         formData.start_date,
//         formData.end_date,
//         formData.is_half_day
//       ),
//     [formData.start_date, formData.end_date, formData.is_half_day]
//   );

//   /* ⭐ Policy auto-resolved by backend — frontend shows only info */
//   const autoResolvedPolicy = selectedLeaveType
//     ? {
//         id: selectedLeaveType.policy_id,
//         name: selectedLeaveType.policy_name,
//         balance: selectedLeaveType.leaves_remaining ?? 0,
//         total: selectedLeaveType.total_leaves ?? 0,
//         allow_half_day: selectedLeaveType.allow_half_day ?? true,
//         min_notice_days: selectedLeaveType.min_notice_days ?? 0,
//         document_after: selectedLeaveType.document_required_after_days,
//       }
//     : null;

//   /* ================= FORM ================= */

//   const handleChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const openAdd = () => {
//     setFormData({ ...initialForm });
//     setFormError("");
//     setError("");
//     setSuccess("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;
//     setShowForm(false);
//     setFormError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (saving) return;

//     if (!currentEmployeeId) {
//       setFormError("Employee profile not linked. Contact HR.");
//       return;
//     }
//     if (!formData.leave_type_id) {
//       setFormError("Please select a leave type.");
//       return;
//     }
//     if (!formData.start_date) {
//       setFormError("Start date is required.");
//       return;
//     }
//     if (!formData.is_half_day) {
//       if (!formData.end_date) {
//         setFormError("End date is required.");
//         return;
//       }
//       if (new Date(formData.end_date) < new Date(formData.start_date)) {
//         setFormError("End date cannot be before start date.");
//         return;
//       }
//     }

//     setSaving(true);
//     setFormError("");
//     setError("");
//     setSuccess("");

//     try {
//       /* ⭐ NO leave_policy_id — backend auto-resolves based on applicability */
//       const payload = {
//         employee_id: currentEmployeeId,
//         leave_type_id: formData.leave_type_id,
//         start_date: formData.start_date,
//         end_date: formData.is_half_day
//           ? formData.start_date
//           : formData.end_date,
//         is_half_day: Boolean(formData.is_half_day),
//         half_day_session: formData.is_half_day
//           ? formData.half_day_session
//           : null,
//         reason: formData.reason?.trim() || null,
//         document_url: formData.document_url?.trim() || null,
//       };

//       const res = await api.post("/api/v1/apply/leave", payload);
//       const data = res?.data;

//       const autoApproved =
//         data?.approval_status === "approved" ||
//         data?.leave_application?.leave_status === "APPROVED";

//       setSuccess(
//         autoApproved
//           ? "✅ Leave auto-approved successfully!"
//           : "Leave applied successfully! Waiting for approval."
//       );

//       setShowForm(false);
//       setFormData(initialForm);
//       setActiveTab("my-leaves");
//       setPage(1);
//       setTimeout(() => fetchLeaves(), 50);
//     } catch (err) {
//       setFormError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= ACTIONS ================= */

//   const handleCancelLeave = async (leave) => {
//     const leaveId = getLeaveId(leave);
//     if (!leaveId) return setError("Leave ID not found");

//     setActionId(leaveId);
//     setError("");
//     try {
//       await api.post(`/api/v1/employee/cancel/leave/${leaveId}`);
//       setSuccess("Leave cancelled successfully");
//       setConfirmAction(null);
//       setDetails(null);
//       await fetchLeaves();
//     } catch (err) {
//       setError(formatApiError(err));
//       setConfirmAction(null);
//     } finally {
//       setActionId(null);
//     }
//   };

//   const handleUpdateStatus = async (leave, status, decisionReason = "") => {
//     const leaveId = getLeaveId(leave);
//     if (!leaveId) return setError("Leave ID not found");

//     setActionId(`${leaveId}-${status}`);
//     setError("");
//     try {
//       await api.put(`/api/v1/employee/approve/leave/${leaveId}`, {
//         status: status.toLowerCase(),
//         decision_reason: decisionReason || null,
//       });
//       setSuccess(`Leave ${status.toLowerCase()} successfully`);
//       setConfirmAction(null);
//       setDetails(null);
//       await fetchLeaves();
//       if (activeTab !== "pending-approval") fetchPendingApprovals();
//     } catch (err) {
//       setError(formatApiError(err));
//       setConfirmAction(null);
//     } finally {
//       setActionId(null);
//     }
//   };

//   const switchTab = (key) => {
//     setActiveTab(key);
//     setPage(1);
//     setSearchInput("");
//     setSearch("");
//     setFilterBy("");
//     setError("");
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">
//               Leave Applications
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Apply leave • Track multi-level approval • Manage requests
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={openAdd}
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
//           >
//             + Apply Leave
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
//           {availableTabs.map((tab) => (
//             <button
//               key={tab.key}
//               type="button"
//               onClick={() => switchTab(tab.key)}
//               className={`flex-1 min-w-[140px] rounded-lg px-4 py-2.5 text-sm font-medium transition ${
//                 activeTab === tab.key
//                   ? "bg-[#E42527] text-white shadow"
//                   : "text-slate-600 hover:bg-slate-50"
//               }`}
//             >
//               {tab.label}
//               {tab.key === "pending-approval" &&
//                 pendingApprovals.length > 0 && (
//                   <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold">
//                     {pendingApprovals.length}
//                   </span>
//                 )}
//             </button>
//           ))}
//         </div>

//         {/* Table Card */}
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {/* Toolbar */}
//           <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search leaves…"
//               autoComplete="off"
//               className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//             />
//             <div className="flex items-center gap-3">
//               {activeTab === "all-leaves" && (
//                 <select
//                   value={filterBy}
//                   onChange={(e) => {
//                     setFilterBy(e.target.value);
//                     setPage(1);
//                   }}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
//                 >
//                   <option value="">All Status</option>
//                   {leaveStatuses.map((s) => (
//                     <option key={s} value={s}>
//                       {s.charAt(0).toUpperCase() + s.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <button
//                 type="button"
//                 onClick={fetchLeaves}
//                 className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Refresh
//               </button>
//               <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
//                 {total} total
//               </span>
//             </div>
//           </div>

//           {error && !showForm && (
//             <div className="mx-5 mt-4 flex items-start justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
//               <span>{error}</span>
//               <button
//                 type="button"
//                 onClick={() => setError("")}
//                 className="text-red-400 hover:text-red-600"
//               >
//                 ✕
//               </button>
//             </div>
//           )}
//           {success && !showForm && (
//             <div className="mx-5 mt-4 flex items-start justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
//               <span>{success}</span>
//               <button
//                 type="button"
//                 onClick={() => setSuccess("")}
//                 className="text-emerald-400 hover:text-emerald-600"
//               >
//                 ✕
//               </button>
//             </div>
//           )}

//           {/* Table */}
//           <div className="overflow-x-auto">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-24 text-slate-500">
//                 <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
//                 <p className="text-sm">Loading…</p>
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
//               <table className="w-full min-w-[1100px] text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-100 bg-slate-50/80">
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">#</th>
//                     {(activeTab === "all-leaves" ||
//                       activeTab === "pending-approval") && (
//                       <th className="px-5 py-3.5 font-semibold text-slate-500">
//                         Employee
//                       </th>
//                     )}
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">
//                       Leave Type
//                     </th>
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">
//                       Duration
//                     </th>
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">
//                       Days
//                     </th>
//                     <th className="px-5 py-3.5 font-semibold text-slate-500">
//                       Status
//                     </th>
//                     {activeTab === "my-leaves" && (
//                       <th className="px-5 py-3.5 font-semibold text-slate-500">
//                         Pending With
//                       </th>
//                     )}
//                     <th className="px-5 py-3.5 text-right font-semibold text-slate-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {list.map((leave, index) => {
//                     const id = getLeaveId(leave);
//                     const status = statusOf(leave);
//                     const canCancel =
//                       activeTab === "my-leaves" && status === "PENDING";
//                     const canApprove =
//                       activeTab !== "my-leaves" &&
//                       status === "PENDING" &&
//                       isHrOrAdmin;

//                     return (
//                       <tr key={id || index} className="hover:bg-slate-50/70">
//                         <td className="px-5 py-4 text-slate-400">
//                           {(page - 1) * pageSize + index + 1}
//                         </td>

//                         {(activeTab === "all-leaves" ||
//                           activeTab === "pending-approval") && (
//                           <td className="px-5 py-4">
//                             <div className="font-medium text-slate-800">
//                               {getEmployeeName(leave)}
//                             </div>
//                             <div className="text-xs text-slate-400">
//                               {leave.employee_id}
//                             </div>
//                           </td>
//                         )}

//                         <td className="px-5 py-4">
//                           <div className="font-medium text-slate-700">
//                             {getLeaveType(leave)}
//                           </div>
//                           {leave.is_half_day && (
//                             <span className="mt-0.5 inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
//                               Half Day ({leave.half_day_session})
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-4 text-slate-600">
//                           <div>{formatDate(leave.start_date)}</div>
//                           <div className="text-xs text-slate-400">
//                             → {formatDate(leave.end_date)}
//                           </div>
//                         </td>

//                         <td className="px-5 py-4">
//                           <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
//                             {leave.days_requested ??
//                               computeDays(
//                                 leave.start_date,
//                                 leave.end_date,
//                                 leave.is_half_day
//                               ) ??
//                               "—"}
//                           </span>
//                         </td>

//                         <td className="px-5 py-4">
//                           <span
//                             className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
//                               status
//                             )}`}
//                           >
//                             {status}
//                           </span>
//                           {Number(leave.current_level) > 0 &&
//                             status === "PENDING" && (
//                               <div className="mt-1 text-[11px] text-slate-400">
//                                 Level {leave.current_level}
//                               </div>
//                             )}
//                         </td>

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
//                             <button
//                               type="button"
//                               onClick={() => setDetails(leave)}
//                               className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
//                             >
//                               View
//                             </button>
//                             {canApprove && (
//                               <>
//                                 <button
//                                   type="button"
//                                   disabled={!!actionId}
//                                   onClick={() =>
//                                     setConfirmAction({
//                                       type: "approve",
//                                       leave,
//                                     })
//                                   }
//                                   className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
//                                 >
//                                   {actionId === `${id}-APPROVED`
//                                     ? "…"
//                                     : "Approve"}
//                                 </button>
//                                 <button
//                                   type="button"
//                                   disabled={!!actionId}
//                                   onClick={() =>
//                                     setConfirmAction({
//                                       type: "reject",
//                                       leave,
//                                     })
//                                   }
//                                   className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
//                                 >
//                                   {actionId === `${id}-REJECTED`
//                                     ? "…"
//                                     : "Reject"}
//                                 </button>
//                               </>
//                             )}
//                             {canCancel && (
//                               <button
//                                 type="button"
//                                 disabled={!!actionId}
//                                 onClick={() =>
//                                   setConfirmAction({
//                                     type: "cancel",
//                                     leave,
//                                   })
//                                 }
//                                 className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
//                               >
//                                 {actionId === id ? "…" : "Cancel"}
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

//           {/* Pagination */}
//           {activeTab !== "pending-approval" && totalPages > 1 && (
//             <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
//               <span className="text-sm text-slate-500">
//                 Page <strong>{page}</strong> of {totalPages}
//               </span>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   disabled={page <= 1}
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   type="button"
//                   disabled={page >= totalPages}
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ============== APPLY LEAVE MODAL ============== */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-10 backdrop-blur-sm">
//           <div className="mb-12 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-800">
//                   Apply for Leave
//                 </h2>
//                 <p className="mt-0.5 text-sm text-slate-500">
//                   Fill the details below
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 disabled={saving}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
//                 {/* ⭐ Leave Type ONLY — NO POLICY DROPDOWN */}
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Leave Type *
//                   </label>
//                   <select
//                     required
//                     value={formData.leave_type_id}
//                     onChange={(e) =>
//                       handleChange("leave_type_id", e.target.value)
//                     }
//                     disabled={optionsLoading || applicablePolicies.length === 0}
//                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20 disabled:bg-slate-50"
//                   >
//                     <option value="">
//                       {optionsLoading
//                         ? "Loading…"
//                         : applicablePolicies.length === 0
//                         ? "No leave types available. Contact HR."
//                         : "Select leave type"}
//                     </option>
//                     {applicablePolicies.map((lt) => {
//                       const id = getLeaveTypeId(lt);
//                       const name = getLeaveTypeName(lt);
//                       const balance = lt.leaves_remaining ?? 0;
//                       return (
//                         <option key={String(id)} value={String(id)}>
//                           {name} — {balance} left
//                         </option>
//                       );
//                     })}
//                   </select>
//                   {!optionsLoading && applicablePolicies.length === 0 && (
//                     <p className="mt-1 text-xs text-amber-700">
//                       Aapko koi bhi leave type eligible nahi mila. HR se contact karein.
//                     </p>
//                   )}
//                 </div>

//                 {/* ⭐ AUTO-RESOLVED POLICY INFO (read-only) */}
//                 {selectedLeaveType && autoResolvedPolicy && (
//                   <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
//                       Auto-Applied Policy
//                     </p>
//                     <p className="mt-1 text-sm font-medium text-sky-900">
//                       {autoResolvedPolicy.name || "—"}
//                     </p>
//                     <div className="mt-2 flex flex-wrap gap-3 text-xs text-sky-800">
//                       <span>
//                         <strong>{autoResolvedPolicy.balance}</strong> of{" "}
//                         {autoResolvedPolicy.total} days available
//                       </span>
//                       {!autoResolvedPolicy.allow_half_day && (
//                         <span className="text-amber-700">
//                           • Half-day not allowed
//                         </span>
//                       )}
//                       {autoResolvedPolicy.min_notice_days > 0 && (
//                         <span className="text-amber-700">
//                           • Min {autoResolvedPolicy.min_notice_days}d notice
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Start Date *
//                     </label>
//                     <input
//                       required
//                       type="date"
//                       value={formData.start_date}
//                       onChange={(e) => {
//                         handleChange("start_date", e.target.value);
//                         if (formData.is_half_day)
//                           handleChange("end_date", e.target.value);
//                       }}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       End Date *
//                     </label>
//                     <input
//                       required={!formData.is_half_day}
//                       type="date"
//                       min={formData.start_date || undefined}
//                       value={
//                         formData.is_half_day
//                           ? formData.start_date
//                           : formData.end_date
//                       }
//                       onChange={(e) =>
//                         handleChange("end_date", e.target.value)
//                       }
//                       disabled={formData.is_half_day}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20 disabled:bg-slate-100"
//                     />
//                   </div>
//                 </div>

//                 {/* Half day — only if policy allows */}
//                 {(!selectedLeaveType ||
//                   selectedLeaveType.allow_half_day !== false) && (
//                   <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
//                     <input
//                       type="checkbox"
//                       checked={formData.is_half_day}
//                       onChange={(e) => {
//                         const checked = e.target.checked;
//                         setFormData((prev) => ({
//                           ...prev,
//                           is_half_day: checked,
//                           end_date: checked ? prev.start_date : "",
//                           half_day_session: checked
//                             ? prev.half_day_session || "first_half"
//                             : "",
//                         }));
//                       }}
//                       className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
//                     />
//                     <span className="text-sm font-medium text-slate-700">
//                       Half Day Leave
//                     </span>
//                   </label>
//                 )}

//                 {formData.is_half_day && (
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Session *
//                     </label>
//                     <select
//                       required
//                       value={formData.half_day_session}
//                       onChange={(e) =>
//                         handleChange("half_day_session", e.target.value)
//                       }
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                     >
//                       <option value="first_half">First Half</option>
//                       <option value="second_half">Second Half</option>
//                     </select>
//                   </div>
//                 )}

//                 {previewDays > 0 && (
//                   <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
//                     Requested: <strong>{previewDays} day(s)</strong>
//                     {autoResolvedPolicy &&
//                       previewDays > autoResolvedPolicy.balance && (
//                         <span className="ml-2 text-xs font-semibold text-red-600">
//                           • Exceeds balance by{" "}
//                           {(previewDays - autoResolvedPolicy.balance).toFixed(1)} day(s)
//                         </span>
//                       )}
//                   </div>
//                 )}

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Reason
//                   </label>
//                   <textarea
//                     rows={4}
//                     maxLength={500}
//                     value={formData.reason}
//                     onChange={(e) => handleChange("reason", e.target.value)}
//                     placeholder="Briefly explain the reason…"
//                     className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
//                   />
//                   <p className="mt-1 text-right text-xs text-slate-400">
//                     {formData.reason.length}/500
//                   </p>
//                 </div>

//                 {formError && (
//                   <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
//                     {formError}
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   disabled={saving}
//                   className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving || !formData.leave_type_id}
//                   className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? "Submitting…" : "Submit Leave"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ============== DETAILS MODAL ============== */}
//       {details && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   Leave Application
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
//                   {getLeaveType(details)}
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setDetails(null)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//               <div className="grid gap-3 sm:grid-cols-2">
//                 {[
//                   ["Employee", getEmployeeName(details)],
//                   ["Employee ID", details.employee_id],
//                   ["Leave Type", getLeaveType(details)],
//                   ["Policy ID", details.leave_policy_id],
//                   ["Start Date", formatDate(details.start_date)],
//                   ["End Date", formatDate(details.end_date)],
//                   [
//                     "Days",
//                     details.days_requested ??
//                       computeDays(
//                         details.start_date,
//                         details.end_date,
//                         details.is_half_day
//                       ),
//                   ],
//                   [
//                     "Half Day",
//                     details.is_half_day
//                       ? `Yes (${details.half_day_session || "—"})`
//                       : "No",
//                   ],
//                   ["Status", statusOf(details)],
//                   ["Current Level", details.current_level],
//                   ["Approver", getApproverName(details)],
//                   ["Decision Reason", details.decision_reason],
//                   ["Applied On", formatDate(details.created_at)],
//                 ].map(([label, value]) => (
//                   <div
//                     key={label}
//                     className="rounded-lg bg-slate-50 px-3 py-2.5"
//                   >
//                     <p className="text-xs text-slate-400">{label}</p>
//                     <p className="mt-1 break-all text-sm font-medium text-slate-800">
//                       {value ?? "—"}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {details.reason && (
//                 <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">
//                   <p className="text-xs text-slate-400">Reason</p>
//                   <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
//                     {details.reason}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setDetails(null)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//               {activeTab === "my-leaves" &&
//                 statusOf(details) === "PENDING" && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setConfirmAction({ type: "cancel", leave: details })
//                     }
//                     className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
//                   >
//                     Cancel Leave
//                   </button>
//                 )}
//               {activeTab !== "my-leaves" &&
//                 statusOf(details) === "PENDING" &&
//                 isHrOrAdmin && (
//                   <>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setConfirmAction({ type: "reject", leave: details })
//                       }
//                       className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
//                     >
//                       Reject
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setConfirmAction({ type: "approve", leave: details })
//                       }
//                       className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
//                     >
//                       Approve
//                     </button>
//                   </>
//                 )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============== CONFIRM ACTION MODAL ============== */}
//       {confirmAction && (
//         <ConfirmActionModal
//           action={confirmAction}
//           onClose={() => setConfirmAction(null)}
//           onCancelLeave={handleCancelLeave}
//           onUpdateStatus={handleUpdateStatus}
//           busy={!!actionId}
//         />
//       )}
//     </div>
//   );
// }

// /* ================= CONFIRM ACTION MODAL ================= */

// function ConfirmActionModal({
//   action,
//   onClose,
//   onCancelLeave,
//   onUpdateStatus,
//   busy,
// }) {
//   const [reason, setReason] = useState("");
//   const [localError, setLocalError] = useState("");

//   const { type, leave } = action;
//   const isReject = type === "reject";

//   const title =
//     type === "cancel"
//       ? "Cancel this leave?"
//       : type === "approve"
//       ? "Approve this leave?"
//       : "Reject this leave?";

//   const handleConfirm = async () => {
//     if (isReject) {
//       if (!reason.trim()) {
//         setLocalError("Rejection reason is required.");
//         return;
//       }
//       await onUpdateStatus(leave, "REJECTED", reason.trim());
//     } else if (type === "approve") {
//       await onUpdateStatus(leave, "APPROVED");
//     } else {
//       await onCancelLeave(leave);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//       <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
//         <div className="border-b border-slate-100 px-5 py-4">
//           <h2 className="text-base font-semibold text-slate-800">{title}</h2>
//         </div>
//         <div className="space-y-3 px-5 py-5 text-sm text-slate-600">
//           <p>
//             {type === "cancel"
//               ? "This will cancel the leave request from "
//               : `${isReject ? "Reject" : "Approve"} the leave for `}
//             <span className="font-medium text-slate-800">
//               {leave.employee_name || leave.employee_id || ""}
//             </span>{" "}
//             {type !== "cancel" && (
//               <>
//                 from{" "}
//                 <span className="font-medium text-slate-800">
//                   {formatDate(leave.start_date)}
//                 </span>{" "}
//                 to{" "}
//                 <span className="font-medium text-slate-800">
//                   {formatDate(leave.end_date)}
//                 </span>
//               </>
//             )}
//             ?
//           </p>

//           {isReject && (
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                 Rejection Reason *
//               </label>
//               <textarea
//                 rows={3}
//                 value={reason}
//                 onChange={(e) => {
//                   setReason(e.target.value);
//                   setLocalError("");
//                 }}
//                 maxLength={300}
//                 placeholder="Explain why this leave is being rejected…"
//                 className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//               />
//               <p className="mt-1 text-right text-xs text-slate-400">
//                 {reason.length}/300
//               </p>
//             </div>
//           )}

//           {localError && (
//             <div className="rounded-lg bg-red-50 px-3 py-2 text-red-600">
//               {localError}
//             </div>
//           )}
//         </div>
//         <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={busy}
//             className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleConfirm}
//             disabled={busy}
//             className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
//               type === "reject" || type === "cancel"
//                 ? "bg-red-600 hover:bg-red-700"
//                 : "bg-emerald-600 hover:bg-emerald-700"
//             }`}
//           >
//             {busy ? "Processing…" : "Confirm"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const TODAY = new Date().toISOString().split("T")[0];
const DEBOUNCE_MS = 400;
const AUTO_DISMISS_MS = 5000;

const initialForm = {
  leave_type_id: "",
  start_date: "",
  end_date: "",
  is_half_day: false,
  half_day_session: "first_half",
  reason: "",
  document_url: "",
};

const leaveStatuses = ["pending", "approved", "rejected", "cancelled"];

const HR_ROLES = new Set([
  "hr",
  "hr_manager",
  "hr-manager",
  "admin",
  "super_admin",
  "super-admin",
  "superadmin",
  "owner",
  "manager",
  "team_lead",
  "team-lead",
]);

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

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
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission for this action.";
  if (err?.response?.status === 404) return "Resource not found.";
  if (err?.response?.status === 422) return "Invalid data. Please check all fields.";
  if (err?.response?.status === 500) return "Server error. Try again later.";
  return err?.message || "Something went wrong";
};

const isCancel = (err) =>
  err?.name === "CanceledError" ||
  err?.code === "ERR_CANCELED" ||
  err?.name === "AbortError";

const getItems = (response) => {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return (
    data?.items ??
    data?.results ??
    data?.leaves ??
    data?.applications ??
    data?.leave_applications ??
    data?.leave_types ??
    data?.employees ??
    []
  );
};

const getLeaveTypeId = (t) => t?.leave_type_id || t?.id || t?._id || "";
const getLeaveTypeName = (t) =>
  t?.leave_type_name || t?.name || getLeaveTypeId(t);

const getLeaveId = (l) =>
  l?.apply_leave_id ||
  l?.leave_application_id ||
  l?.leave_id ||
  l?.id ||
  null;

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateShort = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const computeDays = (start, end, isHalf) => {
  if (!start) return 0;
  if (isHalf) return 0.5;
  if (!end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  if (e < s) return 0;
  return Math.floor((e - s) / 86400000) + 1;
};

const statusOf = (leave) =>
  String(leave?.leave_status ?? leave?.status ?? "PENDING").toUpperCase();

const statusClass = (status) => {
  const v = String(status || "").toUpperCase();
  if (v === "APPROVED")
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (v === "REJECTED") return "bg-red-50 text-red-700 ring-1 ring-red-200";
  if (v === "CANCELLED")
    return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  if (v === "ESCALATED")
    return "bg-purple-50 text-purple-700 ring-1 ring-purple-200";
  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
};

const hasHrAccess = (user) => {
  if (!user) return false;
  const roles = [user.role, ...(Array.isArray(user.roles) ? user.roles : [])]
    .filter(Boolean)
    .map((r) =>
      String(typeof r === "string" ? r : r?.name || r?.role || "")
        .toLowerCase()
        .trim()
    );
  return roles.some((r) => HR_ROLES.has(r));
};

const isNumeric = (v) => v !== null && v !== undefined && !isNaN(Number(v));

/* ══════════════════════════════════════════════════════════
   SUB COMPONENTS
   ══════════════════════════════════════════════════════════ */

function Toast({ type = "info", message, onDismiss, autoDismiss = true }) {
  useEffect(() => {
    if (!message || !autoDismiss) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [message, onDismiss, autoDismiss]);

  if (!message) return null;

  const styles = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-sky-200 bg-sky-50 text-sky-700",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
  }[type] || "border-slate-200 bg-slate-50 text-slate-700";

  const icon = { error: "⚠️", success: "✅", info: "ℹ️", warning: "⚠️" }[type] || "ℹ️";

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-base leading-none">{icon}</span>
        <span className="whitespace-pre-line font-medium">{message}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 shrink-0 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

function BalanceBar({ used, pending, total, lop }) {
  const safeTotal = Math.max(Number(total) || 0, 1);
  const pctUsed = Math.min((Number(used) / safeTotal) * 100, 100);
  const pctPending = Math.min((Number(pending) / safeTotal) * 100, 100 - pctUsed);
  const pctLop = Math.min((Number(lop) / safeTotal) * 100, 100 - pctUsed - pctPending);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="flex h-full">
        {pctUsed > 0 && (
          <div
            className="h-full bg-slate-500"
            style={{ width: `${pctUsed}%` }}
            title={`Used: ${used}`}
          />
        )}
        {pctPending > 0 && (
          <div
            className="h-full bg-amber-400"
            style={{ width: `${pctPending}%` }}
            title={`Pending: ${pending}`}
          />
        )}
        {pctLop > 0 && (
          <div
            className="h-full bg-red-400"
            style={{ width: `${pctLop}%` }}
            title={`LOP: ${lop}`}
          />
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    sky: "bg-sky-50 text-sky-700",
  };
  return (
    <div className={`rounded-lg px-3 py-2 ${tones[tone] || tones.slate}`}>
      <p className="text-[10px] uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function LeaveApplicationsPage({ employeeId = "" }) {
  const user = useAuthStore((state) => state.user);
  const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);
  const currentUserId =
    user?.user_id || user?.userId || user?.id || user?.sub || "";

  const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
  const employeeFromUser =
    user?.employee_id ||
    user?.employeeId ||
    user?.emp_id ||
    user?.employee?.employee_id ||
    user?.profile?.employee_id ||
    user?.data?.employee_id ||
    "";
  const currentEmployeeId = employeeId || employeeFromUser || resolvedEmployeeId;

  /* ───── resolve employee id if not in JWT ───── */
  useEffect(() => {
    if (employeeId || employeeFromUser || !currentUserId) return;
    let cancelled = false;
    api
      .get("/api/v1/get/employees")
      .then((response) => {
        const employee = getItems(response).find(
          (item) =>
            String(
              item.user_id ??
                item.userId ??
                item.user?.user_id ??
                item.user?.id ??
                ""
            ) === String(currentUserId)
        );
        if (!cancelled) {
          setResolvedEmployeeId(
            employee?.employee_id || employee?.id || employee?._id || ""
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [employeeFromUser, employeeId, currentUserId]);

  /* ───── tabs (RBAC) ───── */
  const availableTabs = useMemo(() => {
    const tabs = [{ key: "my-leaves", label: "My Leaves", icon: "📋" }];
    tabs.push({
      key: "pending-approval",
      label: "Pending My Approval",
      icon: "⏳",
    });
    if (isHrOrAdmin) {
      tabs.push({ key: "all-leaves", label: "All Applications", icon: "🗂️" });
    }
    return tabs;
  }, [isHrOrAdmin]);

  /* ───── state ───── */
  const [activeTab, setActiveTab] = useState("my-leaves");
  const [myLeaves, setMyLeaves] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);

  const [applicablePolicies, setApplicablePolicies] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  /* ───── toasts (separate for form + page) ───── */
  const [pageError, setPageError] = useState("");
  const [pageSuccess, setPageSuccess] = useState("");
  const [pageWarning, setPageWarning] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [details, setDetails] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const abortRef = useRef(null);

  /* ═══════════════════════════════════════════════════════
     LOAD APPLICABLE POLICIES
     ═══════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!currentEmployeeId && !currentUserId) return;
    let cancelled = false;
    setOptionsLoading(true);

    api
      .get("/api/v1/leave/my-applicable-policies")
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data?.data ?? res?.data ?? {};
        const items = payload?.leave_types ?? [];

        // Only keep leave types where employee CAN apply
        const applicable = (Array.isArray(items) ? items : []).filter(
          (lt) => lt.can_apply === true
        );

        setApplicablePolicies(applicable);
        setOptionsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[APPLICABLE POLICIES ERROR]", err);
        setApplicablePolicies([]);
        setOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentEmployeeId, currentUserId]);

  /* ───── debounce search ───── */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ───── auto-dismiss page success / warning ───── */
  useEffect(() => {
    if (!pageSuccess) return;
    const t = setTimeout(() => setPageSuccess(""), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [pageSuccess]);

  useEffect(() => {
    if (!pageWarning) return;
    const t = setTimeout(() => setPageWarning(""), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [pageWarning]);

  /* ═══════════════════════════════════════════════════════
     FETCH PENDING APPROVALS
     ═══════════════════════════════════════════════════════ */
  const fetchPendingApprovals = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/approvals/pending", {
        params: { approval_type: "leave", page: 1, page_size: 100 },
      });
      const items = getItems(res);
      setPendingApprovals(items);
      return items;
    } catch {
      try {
        const response = await api.post(
          "/api/v1/get/all/leave/applied",
          {},
          { params: { page: 1, page_size: 100, filter_by: "pending" } }
        );
        const items = getItems(response).filter((leave) => {
          const st = String(
            leave.leave_status || leave.status || ""
          ).toLowerCase();
          const isPending = st === "pending";
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

  /* ═══════════════════════════════════════════════════════
     FETCH LEAVES
     ═══════════════════════════════════════════════════════ */
  const fetchLeaves = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setPageError("");
    try {
      if (activeTab === "my-leaves") {
        if (!currentEmployeeId) {
          setMyLeaves([]);
          setTotal(0);
          return;
        }
        const response = await api.get(
          `/api/v1/get/leave/applied/${currentEmployeeId}`,
          {
            params: { page, page_size: pageSize, ...(search ? { search } : {}) },
            signal: controller.signal,
          }
        );
        const items = getItems(response);
        setMyLeaves(items);
        setTotal(response?.data?.total ?? items.length);
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
              ...(search ? { search } : {}),
              ...(filterBy ? { filter_by: filterBy } : {}),
            },
            signal: controller.signal,
          }
        );
        const items = getItems(response);
        setAllLeaves(items);
        setTotal(response?.data?.total ?? items.length);
      }
    } catch (err) {
      if (isCancel(err)) return;
      setPageError(formatApiError(err));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [
    activeTab,
    currentEmployeeId,
    fetchPendingApprovals,
    filterBy,
    page,
    pageSize,
    search,
  ]);

  useEffect(() => {
    fetchLeaves();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchLeaves]);

  /* ═══════════════════════════════════════════════════════
     DERIVED
     ═══════════════════════════════════════════════════════ */
  const list = useMemo(() => {
    if (activeTab === "my-leaves") return myLeaves;
    if (activeTab === "pending-approval") return pendingApprovals;
    return allLeaves;
  }, [activeTab, myLeaves, pendingApprovals, allLeaves]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getEmployeeName = (leave) =>
    leave.employee_name ||
    leave.employee?.name ||
    leave.employee_id ||
    "—";

  const getLeaveType = (leave) => {
    const id = leave.leave_type_id;
    if (leave.leave_type_name) return leave.leave_type_name;
    const found = applicablePolicies.find(
      (t) => String(getLeaveTypeId(t)) === String(id)
    );
    if (found) return getLeaveTypeName(found);
    if (!id) return "—";
    const s = String(id);
    return s.length > 12 ? `${s.slice(0, 8)}…` : s;
  };

  const getApproverName = (leave) =>
    leave.approver_name ||
    leave.current_approver_name ||
    leave.approver_id ||
    "—";

  /* Selected leave type object */
  const selectedLeaveType = useMemo(() => {
    if (!formData.leave_type_id) return null;
    return (
      applicablePolicies.find(
        (lt) => String(getLeaveTypeId(lt)) === String(formData.leave_type_id)
      ) || null
    );
  }, [applicablePolicies, formData.leave_type_id]);

  const previewDays = useMemo(
    () =>
      computeDays(
        formData.start_date,
        formData.end_date,
        formData.is_half_day
      ),
    [formData.start_date, formData.end_date, formData.is_half_day]
  );

  const autoResolvedPolicy = selectedLeaveType
    ? {
        id: selectedLeaveType.policy_id,
        name: selectedLeaveType.policy_name,
        balance: Number(selectedLeaveType.leaves_remaining ?? 0),
        total: Number(selectedLeaveType.total_entitlement ?? 0),
        taken: Number(selectedLeaveType.leaves_taken ?? 0),
        pending: Number(selectedLeaveType.leaves_pending ?? 0),
        lop: Number(selectedLeaveType.lop_days ?? 0),
        allow_half_day: selectedLeaveType.allow_half_day ?? true,
        min_notice_days: Number(selectedLeaveType.min_notice_days ?? 0),
        document_after: selectedLeaveType.document_required_after_days,
      }
    : null;

  const willExceedBalance = useMemo(() => {
    if (!autoResolvedPolicy) return false;
    if (autoResolvedPolicy.balance === Infinity) return false;
    return previewDays > autoResolvedPolicy.balance;
  }, [autoResolvedPolicy, previewDays]);

  const exceedsBy = useMemo(() => {
    if (!willExceedBalance) return 0;
    return Math.round((previewDays - autoResolvedPolicy.balance) * 10) / 10;
  }, [willExceedBalance, previewDays, autoResolvedPolicy]);

  /* ═══════════════════════════════════════════════════════
     FORM
     ═══════════════════════════════════════════════════════ */
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => {
    setFormData({ ...initialForm });
    setFormError("");
    setFormSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setFormError("");
    setFormSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!currentEmployeeId) {
      setFormError("Employee profile not linked. Contact HR.");
      return;
    }
    if (!formData.leave_type_id) {
      setFormError("Please select a leave type.");
      return;
    }
    if (!formData.start_date) {
      setFormError("Start date is required.");
      return;
    }
    if (formData.start_date < TODAY) {
      setFormError("Leave cannot be applied for a past date.");
      return;
    }
    if (!formData.is_half_day) {
      if (!formData.end_date) {
        setFormError("End date is required.");
        return;
      }
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        setFormError("End date cannot be before start date.");
        return;
      }
    }
    if (autoResolvedPolicy) {
      if (formData.is_half_day && autoResolvedPolicy.allow_half_day === false) {
        setFormError("Half-day leave is not allowed for this leave type.");
        return;
      }
      if (
        autoResolvedPolicy.min_notice_days > 0 &&
        formData.start_date
      ) {
        const days = Math.floor(
          (new Date(formData.start_date) - new Date(TODAY)) / 86400000
        );
        if (days < autoResolvedPolicy.min_notice_days) {
          setFormError(
            `This leave type requires at least ${autoResolvedPolicy.min_notice_days} day(s) notice.`
          );
          return;
        }
      }
    }

    setSaving(true);
    setFormError("");
    setFormSuccess("");
    setPageError("");
    setPageSuccess("");

    try {
      const payload = {
        employee_id: currentEmployeeId,
        leave_type_id: formData.leave_type_id,
        start_date: formData.start_date,
        end_date: formData.is_half_day
          ? formData.start_date
          : formData.end_date,
        is_half_day: Boolean(formData.is_half_day),
        half_day_session: formData.is_half_day
          ? formData.half_day_session
          : null,
        reason: formData.reason?.trim() || null,
        document_url: formData.document_url?.trim() || null,
      };

      const res = await api.post("/api/v1/apply/leave", payload);
      const data = res?.data;

      const approvalStatus = String(data?.approval_status || "").toLowerCase();
      const isAutoApproved = approvalStatus === "approved";
      const isLop = Boolean(data?.is_lop);
      const lopDays = Number(data?.lop_days || 0);
      const negativeWarning = data?.negative_balance_warning;
      const resolvedPolicyName = data?.resolved_policy_name;

      /* Build success message */
      let msg = isAutoApproved
        ? "Leave auto-approved successfully!"
        : "Leave applied successfully! Waiting for approval.";
      if (isLop && lopDays > 0) {
        msg += ` Note: ${lopDays} day(s) marked as LOP.`;
      }

      setPageSuccess(msg);
      if (negativeWarning) {
        setPageWarning(`⚠️ ${negativeWarning}`);
      }

      /* Show a quick flash inside modal, then close */
      setFormSuccess(
        isAutoApproved
          ? `✅ Auto-approved by ${resolvedPolicyName || "policy"}`
          : `✅ Submitted to approver${resolvedPolicyName ? ` (${resolvedPolicyName})` : ""}`
      );

      setShowForm(false);
      setFormData(initialForm);
      setActiveTab("my-leaves");
      setPage(1);
      setTimeout(() => fetchLeaves(), 60);
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     ACTIONS
     ═══════════════════════════════════════════════════════ */
  const handleCancelLeave = async (leave) => {
    const leaveId = getLeaveId(leave);
    if (!leaveId) return setPageError("Leave ID not found");

    setActionId(leaveId);
    setPageError("");
    try {
      await api.post(`/api/v1/employee/cancel/leave/${leaveId}`);
      setPageSuccess("Leave cancelled successfully");
      setConfirmAction(null);
      setDetails(null);
      await fetchLeaves();
    } catch (err) {
      setPageError(formatApiError(err));
      setConfirmAction(null);
    } finally {
      setActionId(null);
    }
  };

  const handleUpdateStatus = async (leave, status, decisionReason = "") => {
    const leaveId = getLeaveId(leave);
    if (!leaveId) return setPageError("Leave ID not found");

    setActionId(`${leaveId}-${status}`);
    setPageError("");
    try {
      const res = await api.put(`/api/v1/employee/approve/leave/${leaveId}`, {
        status: status.toLowerCase(),
        decision_reason: decisionReason || null,
      });
      const approvalStatus = String(
        res?.data?.approval_status || ""
      ).toLowerCase();

      let msg = "";
      if (approvalStatus === "approved") {
        msg = "✅ Leave approved successfully";
      } else if (approvalStatus === "rejected") {
        msg = "Leave rejected";
      } else if (approvalStatus === "pending") {
        msg = "✅ Approved — forwarded to next approver level";
      } else {
        msg = `Leave ${status.toLowerCase()} successfully`;
      }

      setPageSuccess(msg);
      setConfirmAction(null);
      setDetails(null);
      await fetchLeaves();
      if (activeTab !== "pending-approval") fetchPendingApprovals();
    } catch (err) {
      setPageError(formatApiError(err));
      setConfirmAction(null);
    } finally {
      setActionId(null);
    }
  };

  const switchTab = (key) => {
    setActiveTab(key);
    setPage(1);
    setSearchInput("");
    setSearch("");
    setFilterBy("");
    setPageError("");
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* ─────── Header ─────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Leave Applications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Apply • Track multi-level approval • Manage requests
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
          >
            + Apply Leave
          </button>
        </div>

        {/* ─────── Tabs ─────── */}
        <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => switchTab(tab.key)}
              className={`flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#E42527] text-white shadow"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key === "pending-approval" &&
                pendingApprovals.length > 0 && (
                  <span
                    className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      activeTab === tab.key
                        ? "bg-white text-[#E42527]"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {pendingApprovals.length}
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* ─────── Page-level toasts ─────── */}
        <Toast
          type="error"
          message={pageError}
          onDismiss={() => setPageError("")}
        />
        <Toast
          type="success"
          message={pageSuccess}
          onDismiss={() => setPageSuccess("")}
        />
        <Toast
          type="warning"
          message={pageWarning}
          onDismiss={() => setPageWarning("")}
        />

        {/* ─────── Table Card ─────── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search leaves…"
              autoComplete="off"
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
              <button
                type="button"
                onClick={fetchLeaves}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                🔄 Refresh
              </button>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {total} total
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
                <p className="text-sm">Loading…</p>
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                <div className="mb-3 text-4xl">
                  {activeTab === "pending-approval" ? "✅" : "📭"}
                </div>
                <p className="text-sm font-medium">
                  {activeTab === "pending-approval"
                    ? "No leaves pending your approval"
                    : "No leave applications found"}
                </p>
                {activeTab === "my-leaves" && (
                  <button
                    type="button"
                    onClick={openAdd}
                    className="mt-4 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]"
                  >
                    + Apply Leave
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 font-semibold text-slate-500">
                      #
                    </th>
                    {(activeTab === "all-leaves" ||
                      activeTab === "pending-approval") && (
                      <th className="px-5 py-3.5 font-semibold text-slate-500">
                        Employee
                      </th>
                    )}
                    <th className="px-5 py-3.5 font-semibold text-slate-500">
                      Leave Type
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-500">
                      Duration
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-500">
                      Days
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-500">
                      Status
                    </th>
                    {activeTab === "my-leaves" && (
                      <th className="px-5 py-3.5 font-semibold text-slate-500">
                        Pending With
                      </th>
                    )}
                    <th className="px-5 py-3.5 text-right font-semibold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {list.map((leave, index) => {
                    const id = getLeaveId(leave);
                    const status = statusOf(leave);
                    const isPending = status === "PENDING";
                    const isApproved = status === "APPROVED";
                    const canCancel =
                      activeTab === "my-leaves" &&
                      (isPending || isApproved);
                    const canApprove =
                      activeTab !== "my-leaves" &&
                      isPending &&
                      isHrOrAdmin;
                    const isLop = Boolean(leave.is_lop);

                    return (
                      <tr
                        key={id || index}
                        className="hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4 text-slate-400">
                          {(page - 1) * pageSize + index + 1}
                        </td>

                        {(activeTab === "all-leaves" ||
                          activeTab === "pending-approval") && (
                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-800">
                              {getEmployeeName(leave)}
                            </div>
                            <div className="text-xs text-slate-400">
                              {leave.employee_id}
                            </div>
                          </td>
                        )}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700">
                              {getLeaveType(leave)}
                            </span>
                            {isLop && (
                              <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                                LOP
                              </span>
                            )}
                          </div>
                          {leave.is_half_day && (
                            <span className="mt-0.5 inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                              Half Day (
                              {String(
                                leave.half_day_session || ""
                              ).replace("_", " ")}
                              )
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="text-sm">
                            {formatDate(leave.start_date)}
                          </div>
                          <div className="text-xs text-slate-400">
                            → {formatDate(leave.end_date)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                            {leave.days_requested ??
                              computeDays(
                                leave.start_date,
                                leave.end_date,
                                leave.is_half_day
                              )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                          {Number(leave.current_level) > 0 &&
                            isPending && (
                              <div className="mt-1 text-[11px] text-slate-400">
                                Level {leave.current_level}
                              </div>
                            )}
                        </td>

                        {activeTab === "my-leaves" && (
                          <td className="px-5 py-4">
                            {isPending ? (
                              <div>
                                <div className="text-sm font-medium text-slate-700">
                                  {getApproverName(leave)}
                                </div>
                                {leave.current_level && (
                                  <div className="text-xs text-slate-400">
                                    Level {leave.current_level}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setDetails(leave)}
                              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                            >
                              View
                            </button>
                            {canApprove && (
                              <>
                                <button
                                  type="button"
                                  disabled={!!actionId}
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "approve",
                                      leave,
                                    })
                                  }
                                  className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  disabled={!!actionId}
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "reject",
                                      leave,
                                    })
                                  }
                                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {canCancel && (
                              <button
                                type="button"
                                disabled={!!actionId}
                                onClick={() =>
                                  setConfirmAction({
                                    type: "cancel",
                                    leave,
                                  })
                                }
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                              >
                                Cancel
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
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════ APPLY LEAVE MODAL ═══════════════════ */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-10 backdrop-blur-sm">
          <div className="mb-12 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Apply for Leave
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Fill the details below — policy will auto-apply
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
                {/* Leave Type */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Leave Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={formData.leave_type_id}
                    onChange={(e) =>
                      handleChange("leave_type_id", e.target.value)
                    }
                    disabled={optionsLoading || applicablePolicies.length === 0}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20 disabled:bg-slate-50"
                  >
                    <option value="">
                      {optionsLoading
                        ? "Loading…"
                        : applicablePolicies.length === 0
                        ? "No leave types available. Contact HR."
                        : "Select leave type"}
                    </option>
                    {applicablePolicies.map((lt) => {
                      const id = getLeaveTypeId(lt);
                      const name = getLeaveTypeName(lt);
                      const balance = Number(lt.leaves_remaining ?? 0);
                      return (
                        <option key={String(id)} value={String(id)}>
                          {name} — {balance} left
                        </option>
                      );
                    })}
                  </select>
                  {!optionsLoading && applicablePolicies.length === 0 && (
                    <p className="mt-1 text-xs text-amber-700">
                      No eligible leave types found. Please contact HR.
                    </p>
                  )}
                </div>

                {/* Auto-resolved policy + balance card */}
                {selectedLeaveType && autoResolvedPolicy && (
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                          Auto-Applied Policy
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-sky-900">
                          {autoResolvedPolicy.name || "—"}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sky-800 tabular-nums">
                        {autoResolvedPolicy.balance} left
                      </span>
                    </div>

                    {/* Balance bar */}
                    <div className="mt-3">
                      <BalanceBar
                        used={autoResolvedPolicy.taken}
                        pending={autoResolvedPolicy.pending}
                        lop={autoResolvedPolicy.lop}
                        total={autoResolvedPolicy.total}
                      />
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        <StatPill
                          label="Taken"
                          value={autoResolvedPolicy.taken}
                          tone="slate"
                        />
                        <StatPill
                          label="Pending"
                          value={autoResolvedPolicy.pending}
                          tone="amber"
                        />
                        <StatPill
                          label="LOP"
                          value={autoResolvedPolicy.lop}
                          tone="red"
                        />
                        <StatPill
                          label="Total"
                          value={autoResolvedPolicy.total}
                          tone="sky"
                        />
                      </div>
                    </div>

                    {/* Warnings */}
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      {autoResolvedPolicy.allow_half_day === false && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                          ⚠ Half-day not allowed
                        </span>
                      )}
                      {autoResolvedPolicy.min_notice_days > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                          ⚠ Min {autoResolvedPolicy.min_notice_days}d notice
                        </span>
                      )}
                      {autoResolvedPolicy.document_after && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                          📎 Doc required after{" "}
                          {autoResolvedPolicy.document_after} days
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Start Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      min={TODAY}
                      value={formData.start_date}
                      onChange={(e) => {
                        handleChange("start_date", e.target.value);
                        if (formData.is_half_day)
                          handleChange("end_date", e.target.value);
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      End Date {!formData.is_half_day && (
                        <span className="text-red-600">*</span>
                      )}
                    </label>
                    <input
                      required={!formData.is_half_day}
                      type="date"
                      min={formData.start_date || TODAY}
                      value={
                        formData.is_half_day
                          ? formData.start_date
                          : formData.end_date
                      }
                      onChange={(e) =>
                        handleChange("end_date", e.target.value)
                      }
                      disabled={formData.is_half_day}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20 disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Half day toggle */}
                {(!selectedLeaveType ||
                  selectedLeaveType.allow_half_day !== false) && (
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.is_half_day}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          is_half_day: checked,
                          end_date: checked ? prev.start_date : "",
                          half_day_session: checked
                            ? prev.half_day_session || "first_half"
                            : "",
                        }));
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Half Day Leave (0.5 day)
                    </span>
                  </label>
                )}

                {/* Half day session */}
                {formData.is_half_day && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Session <span className="text-red-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: "first_half", l: "First Half", i: "🌅" },
                        { v: "second_half", l: "Second Half", i: "🌇" },
                      ].map((s) => (
                        <button
                          key={s.v}
                          type="button"
                          onClick={() =>
                            handleChange("half_day_session", s.v)
                          }
                          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                            formData.half_day_session === s.v
                              ? "border-[#E42527] bg-red-50 text-[#E42527]"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {s.i} {s.l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview days */}
                {previewDays > 0 && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm ${
                      willExceedBalance
                        ? "bg-amber-50 text-amber-800"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        Requested: <strong>{previewDays} day(s)</strong>
                      </span>
                      {autoResolvedPolicy && (
                        <span className="text-xs">
                          Available:{" "}
                          <strong>{autoResolvedPolicy.balance}</strong>
                        </span>
                      )}
                    </div>
                    {willExceedBalance && (
                      <p className="mt-2 text-xs font-semibold text-amber-800">
                        ⚠️ Exceeds balance by {exceedsBy} day(s) — may result in
                        LOP or rejection based on policy.
                      </p>
                    )}
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Reason
                  </label>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    placeholder="Briefly explain the reason…"
                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {formData.reason.length}/500
                  </p>
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.leave_type_id}
                  className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Submitting…" : "Submit Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════ DETAILS MODAL ═══════════════════ */}
      {details && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Leave Application
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  {getLeaveType(details)}
                </h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                  statusOf(details)
                )}`}
              >
                {statusOf(details)}
              </span>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
              {/* Dates card */}
              <div className="mb-4 rounded-xl bg-slate-50 p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400">
                      From
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateShort(details.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400">
                      To
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateShort(details.end_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400">
                      Days
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#E42527] tabular-nums">
                      {details.days_requested ??
                        computeDays(
                          details.start_date,
                          details.end_date,
                          details.is_half_day
                        )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Employee", getEmployeeName(details)],
                  ["Employee ID", details.employee_id],
                  ["Leave Type", getLeaveType(details)],
                  [
                    "Half Day",
                    details.is_half_day
                      ? `Yes (${
                          String(details.half_day_session || "").replace(
                            "_",
                            " "
                          ) || "—"
                        })`
                      : "No",
                  ],
                  [
                    "Is LOP",
                    details.is_lop
                      ? `Yes (${details.lop_days || 0} days)`
                      : "No",
                  ],
                  ["Current Level", details.current_level || "—"],
                  ["Approver", getApproverName(details)],
                  ["Applied On", formatDate(details.created_at)],
                  ["Policy ID", details.leave_policy_id || "—"],
                  ["Decision Reason", details.decision_reason || "—"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-slate-50 px-3 py-2.5"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>

              {details.reason && (
                <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">
                  <p className="text-xs text-slate-400">Reason</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {details.reason}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {activeTab === "my-leaves" &&
                (statusOf(details) === "PENDING" ||
                  statusOf(details) === "APPROVED") && (
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction({ type: "cancel", leave: details })
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Cancel Leave
                  </button>
                )}
              {activeTab !== "my-leaves" &&
                statusOf(details) === "PENDING" &&
                isHrOrAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({ type: "reject", leave: details })
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({ type: "approve", leave: details })
                      }
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ CONFIRM ACTION MODAL ═══════════════════ */}
      {confirmAction && (
        <ConfirmActionModal
          action={confirmAction}
          onClose={() => setConfirmAction(null)}
          onCancelLeave={handleCancelLeave}
          onUpdateStatus={handleUpdateStatus}
          busy={!!actionId}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONFIRM ACTION MODAL
   ══════════════════════════════════════════════════════════ */

function ConfirmActionModal({
  action,
  onClose,
  onCancelLeave,
  onUpdateStatus,
  busy,
}) {
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState("");

  const { type, leave } = action;
  const isReject = type === "reject";

  const title =
    type === "cancel"
      ? "Cancel this leave?"
      : type === "approve"
      ? "Approve this leave?"
      : "Reject this leave?";

  const handleConfirm = async () => {
    if (isReject) {
      if (!reason.trim()) {
        setLocalError("Rejection reason is required.");
        return;
      }
      await onUpdateStatus(leave, "REJECTED", reason.trim());
    } else if (type === "approve") {
      await onUpdateStatus(leave, "APPROVED");
    } else {
      await onCancelLeave(leave);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>

        <div className="space-y-3 px-5 py-5 text-sm text-slate-600">
          <p>
            {type === "cancel"
              ? "This will cancel the leave request from "
              : `${isReject ? "Reject" : "Approve"} the leave for `}
            <span className="font-medium text-slate-800">
              {leave.employee_name || leave.employee_id || ""}
            </span>{" "}
            {type !== "cancel" && (
              <>
                from{" "}
                <span className="font-medium text-slate-800">
                  {formatDate(leave.start_date)}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-800">
                  {formatDate(leave.end_date)}
                </span>
              </>
            )}
            ?
          </p>

          {isReject && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setLocalError("");
                }}
                maxLength={300}
                placeholder="Explain why this leave is being rejected…"
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {reason.length}/300
              </p>
            </div>
          )}

          {localError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-red-600">
              {localError}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
              type === "reject" || type === "cancel"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {busy ? "Processing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}