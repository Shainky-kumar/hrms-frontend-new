

// // "use client";

// // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import { api } from "@/app/lib/api";
// // import {
// //   fetchLeaveTypes,
// //   getLeaveTypeId,
// //   getLeaveTypeName,
// // } from "@/app/lib/leaveTypes";
// // import { useAuthStore } from "@/app/store/authStore";

// // /* ------------------------------------------------------------------ */
// // /*  Constants                                                          */
// // /* ------------------------------------------------------------------ */

// // const CURRENT_YEAR = new Date().getFullYear();
// // const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 3 + i);

// // const HR_ROLES = new Set([
// //   "hr",
// //   "hr_manager",
// //   "hr-manager",
// //   "admin",
// //   "super_admin",
// //   "super-admin",
// //   "superadmin",
// //   "owner",
// //   "payroll_officer",
// //   "payroll-officer",
// //   "finance",
// //   "manager",
// //   "team_lead",
// //   "team-lead",
// //   "recruiter",
// // ]);

// // const initialForm = {
// //   employee_id: "",
// //   leave_type_id: "",
// //   leave_policy_id: "",
// //   year: CURRENT_YEAR,
// //   total_leaves: 0,
// //   leaves_taken: 0,
// //   leaves_pending: 0,
// //   leaves_remaining: 0,
// //   carried_forward: 0,
// //   encashed: 0,
// //   lapsed: 0,
// // };

// // /* ------------------------------------------------------------------ */
// // /*  Helpers                                                            */
// // /* ------------------------------------------------------------------ */

// // const toNumber = (v, fallback = 0) => {
// //   const n = Number(v);
// //   return Number.isFinite(n) ? n : fallback;
// // };

// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) {
// //     return detail
// //       .map((e) =>
// //         Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
// //       )
// //       .join(" • ");
// //   }
// //   if (typeof detail === "string") return detail;
// //   if (err?.response?.data?.message) return err.response.data.message;
// //   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
// //   if (err?.response?.status === 401) return "Session expired. Please login again.";
// //   if (err?.response?.status === 403) return "You don't have permission for this action.";
// //   return err?.message || "Something went wrong";
// // };

// // const isCancel = (err) =>
// //   err?.name === "CanceledError" ||
// //   err?.code === "ERR_CANCELED" ||
// //   err?.name === "AbortError";

// // const pickList = (payload) => {
// //   if (Array.isArray(payload)) return payload;
// //   if (!payload || typeof payload !== "object") return [];
// //   return (
// //     payload.items ??
// //     payload.results ??
// //     payload.data ??
// //     payload.employees ??
// //     payload.leave_types ??
// //     payload.leave_policies ??
// //     payload.policies ??
// //     []
// //   );
// // };

// // const hasHrAccess = (user) => {
// //   if (!user) return false;
// //   const roles = [
// //     user.role,
// //     ...(Array.isArray(user.roles) ? user.roles : []),
// //     ...(Array.isArray(user.user_roles) ? user.user_roles : []),
// //   ]
// //     .filter(Boolean)
// //     .map((r) =>
// //       String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
// //         .toLowerCase()
// //         .trim()
// //     );
// //   return roles.some((r) => HR_ROLES.has(r));
// // };

// // const pickEmployeeId = (u) =>
// //   u?.employee_id ||
// //   u?.employeeId ||
// //   u?.emp_id ||
// //   u?.employee?.employee_id ||
// //   u?.profile?.employee_id ||
// //   u?.data?.employee_id ||
// //   "";

// // const balanceRowKey = (item) =>
// //   item?.balance_id ?? item?.leave_balance_id ?? item?.id ?? null;

// // const getPolicyIdFromObj = (p) =>
// //   p?.leave_policy_id || p?.policy_id || p?.id || "";
// // const getPolicyNameFromObj = (p) =>
// //   p?.policy_name || p?.leave_policy_name || getPolicyIdFromObj(p) || "Unnamed Policy";

// // /* ------------------------------------------------------------------ */
// // /*  Component                                                          */
// // /* ------------------------------------------------------------------ */

// // export default function EmployeeLeaveBalancePage() {
// //   const user = useAuthStore((state) => state.user);
// //   const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

// //   const [list, setList] = useState([]);
// //   const [leaveTypes, setLeaveTypes] = useState([]);
// //   const [policies, setPolicies] = useState([]);
// //   const [employees, setEmployees] = useState([]);
// //   const [formData, setFormData] = useState(initialForm);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [deleting, setDeleting] = useState(false);
// //   const [error, setError] = useState("");
// //   const [showForm, setShowForm] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const [searchInput, setSearchInput] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [yearFilter, setYearFilter] = useState(String(CURRENT_YEAR));
// //   const [page, setPage] = useState(1);
// //   const [pageSize] = useState(10);
// //   const [total, setTotal] = useState(0);
// //   const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
// //   const [resolvedEmployeeName, setResolvedEmployeeName] = useState("");
// //   const [selectedBalance, setSelectedBalance] = useState(null);
// //   const [confirmDelete, setConfirmDelete] = useState(null);

// //   const abortRef = useRef(null);

// //   const employeeFromUser = useMemo(() => pickEmployeeId(user), [user]);
// //   const employeeId = employeeFromUser || resolvedEmployeeId;
// //   const isSelfView = Boolean(employeeFromUser) && !isHrOrAdmin;

// //   /* --------------- resolve employee id if not in auth --------------- */
// //   useEffect(() => {
// //     if (employeeFromUser) return;
// //     const userId = user?.user_id || user?.userId || user?.id || user?.sub;
// //     if (!userId) return;

// //     let cancelled = false;
// //     api
// //       .get("/api/v1/get/employees")
// //       .then((response) => {
// //         const data = response?.data?.data ?? response?.data ?? [];
// //         const list = pickList(data);
// //         const employee = list.find(
// //           (item) => String(item.user_id ?? item.userId ?? "") === String(userId)
// //         );
// //         if (!cancelled) {
// //           setResolvedEmployeeId(
// //             employee?.employee_id || employee?.emp_id || employee?.id || ""
// //           );
// //           setResolvedEmployeeName(
// //             employee?.employee_name || employee?.name || employee?.full_name || ""
// //           );
// //         }
// //       })
// //       .catch(() => {
// //         if (!cancelled) setResolvedEmployeeId("");
// //       });

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [employeeFromUser, user]);

// //   /* --------------- load leave types --------------- */
// //   useEffect(() => {
// //     let cancelled = false;
// //     fetchLeaveTypes()
// //       .then((types) => {
// //         if (!cancelled) setLeaveTypes(Array.isArray(types) ? types : []);
// //       })
// //       .catch(() => {
// //         if (!cancelled) setLeaveTypes([]);
// //       });
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   /* --------------- load all policies (for dropdown) --------------- */
// //   useEffect(() => {
// //     let cancelled = false;
// //     api
// //       .get("/api/v1/leave/policies", { params: { page: 1, page_size: 500 } })
// //       .then((res) => {
// //         if (cancelled) return;
// //         const payload = res?.data?.data ?? res?.data ?? {};
// //         setPolicies(pickList(payload));
// //       })
// //       .catch(() => {
// //         if (!cancelled) setPolicies([]);
// //       });
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   /* --------------- load all employees (for dropdown) --------------- */
// //   useEffect(() => {
// //     if (!isHrOrAdmin) return;
// //     let cancelled = false;
// //     api
// //       .get("/api/v1/get/employees")
// //       .then((res) => {
// //         if (cancelled) return;
// //         const payload = res?.data?.data ?? res?.data ?? {};
// //         setEmployees(pickList(payload));
// //       })
// //       .catch(() => {
// //         if (!cancelled) setEmployees([]);
// //       });
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [isHrOrAdmin]);

// //   /* --------------- debounce search --------------- */
// //   useEffect(() => {
// //     const t = setTimeout(() => {
// //       setSearch(searchInput.trim());
// //       setPage(1);
// //     }, 400);
// //     return () => clearTimeout(t);
// //   }, [searchInput]);

// //   /* --------------- fetch balances --------------- */
// //   const fetchData = useCallback(async () => {
// //     if (!employeeId) {
// //       setList([]);
// //       setTotal(0);
// //       setLoading(false);
// //       return;
// //     }

// //     if (abortRef.current) abortRef.current.abort();
// //     const controller = new AbortController();
// //     abortRef.current = controller;

// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get(`/api/v1/leave/balance/${employeeId}`, {
// //         params: {
// //           page,
// //           page_size: pageSize,
// //           ...(search ? { search } : {}),
// //           ...(yearFilter ? { year: yearFilter } : {}),
// //         },
// //         signal: controller.signal,
// //       });

// //       const payload = res.data?.data ?? res.data ?? {};
// //       const items = Array.isArray(payload)
// //         ? payload
// //         : payload?.employee_leave_balances ??
// //           payload?.leave_balances ??
// //           payload?.balances ??
// //           pickList(payload);

// //       setList(Array.isArray(items) ? items : []);
// //       setTotal(
// //         res.data?.total ?? payload?.total ?? (Array.isArray(items) ? items.length : 0)
// //       );
// //     } catch (err) {
// //       if (isCancel(err)) return;
// //       setError(formatApiError(err));
// //       setList([]);
// //       setTotal(0);
// //     } finally {
// //       if (!controller.signal.aborted) setLoading(false);
// //     }
// //   }, [employeeId, page, pageSize, search, yearFilter]);

// //   useEffect(() => {
// //     fetchData();
// //     return () => {
// //       if (abortRef.current) abortRef.current.abort();
// //     };
// //   }, [fetchData]);

// //   /* --------------- derived: suggested remaining --------------- */
// //   const suggestedRemaining = useMemo(() => {
// //     const t = toNumber(formData.total_leaves);
// //     const taken = toNumber(formData.leaves_taken);
// //     const pending = toNumber(formData.leaves_pending);
// //     const carried = toNumber(formData.carried_forward);
// //     const encashed = toNumber(formData.encashed);
// //     const lapsed = toNumber(formData.lapsed);
// //     return t + carried - taken - pending - encashed - lapsed;
// //   }, [formData]);

// //   /* --------------- filtered policies by selected leave type --------------- */
// //   const filteredPolicies = useMemo(() => {
// //     if (!formData.leave_type_id) return policies;
// //     return policies.filter(
// //       (p) => String(p.leave_type_id || "") === String(formData.leave_type_id)
// //     );
// //   }, [policies, formData.leave_type_id]);

// //   /* --------------- form handlers --------------- */
// //   const handleChange = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const openAdd = () => {
// //     setEditId(null);
// //     setFormData({ ...initialForm, employee_id: employeeId });
// //     setError("");
// //     setShowForm(true);
// //   };

// //   const openEdit = (item) => {
// //     setEditId(balanceRowKey(item));
// //     setFormData({
// //       ...initialForm,
// //       employee_id: item.employee_id || employeeId,
// //       leave_type_id: item.leave_type_id || "",
// //       leave_policy_id: item.leave_policy_id || "",
// //       year: item.year ?? CURRENT_YEAR,
// //       total_leaves: item.total_leaves ?? 0,
// //       leaves_taken: item.leaves_taken ?? 0,
// //       leaves_pending: item.leaves_pending ?? 0,
// //       leaves_remaining: item.leaves_remaining ?? 0,
// //       carried_forward: item.carried_forward ?? 0,
// //       encashed: item.encashed ?? 0,
// //       lapsed: item.lapsed ?? 0,
// //     });
// //     setError("");
// //     setShowForm(true);
// //   };

// //   const closeForm = () => {
// //     if (saving) return;
// //     setShowForm(false);
// //     setError("");
// //     setEditId(null);
// //     setFormData({ ...initialForm, employee_id: employeeId });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (saving) return;

// //     if (!editId) {
// //       if (!formData.employee_id) {
// //         setError("Employee ID is required");
// //         return;
// //       }
// //       if (!formData.leave_type_id) {
// //         setError("Leave Type is required");
// //         return;
// //       }
// //       if (!formData.leave_policy_id) {
// //         setError("Leave Policy is required");
// //         return;
// //       }
// //     }

// //     const year = toNumber(formData.year);
// //     if (year < 2000 || year > CURRENT_YEAR + 5) {
// //       setError(`Year must be between 2000 and ${CURRENT_YEAR + 5}`);
// //       return;
// //     }
// //     const total = toNumber(formData.total_leaves);
// //     if (total < 0) {
// //       setError("Total leaves cannot be negative");
// //       return;
// //     }

// //     setSaving(true);
// //     setError("");
// //     try {
// //       if (editId) {
// //         // UPDATE — only balance fields
// //         await api.put(`/api/v1/leave/balance/${editId}`, {
// //           total_leaves: total,
// //           leaves_taken: toNumber(formData.leaves_taken),
// //           leaves_pending: toNumber(formData.leaves_pending),
// //           leaves_remaining: toNumber(formData.leaves_remaining, suggestedRemaining),
// //           carried_forward: toNumber(formData.carried_forward),
// //           encashed: toNumber(formData.encashed),
// //           lapsed: toNumber(formData.lapsed),
// //         });
// //       } else {
// //         // CREATE — full payload
// //         const payload = {
// //           employee_id: formData.employee_id,
// //           leave_type_id: formData.leave_type_id,
// //           leave_policy_id: formData.leave_policy_id,
// //           year,
// //           total_leaves: total,
// //           leaves_taken: toNumber(formData.leaves_taken),
// //           leaves_pending: toNumber(formData.leaves_pending),
// //           leaves_remaining: toNumber(formData.leaves_remaining, suggestedRemaining),
// //           carried_forward: toNumber(formData.carried_forward),
// //           encashed: toNumber(formData.encashed),
// //           lapsed: toNumber(formData.lapsed),
// //         };
// //         await api.post("/api/v1/leave/balance", payload);
// //       }

// //       setShowForm(false);
// //       setFormData({ ...initialForm, employee_id: employeeId });
// //       setEditId(null);
// //       await fetchData();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     const item = confirmDelete;
// //     if (!item) return;
// //     const id = balanceRowKey(item);
// //     if (!id) {
// //       setConfirmDelete(null);
// //       setError("Cannot delete: missing balance id.");
// //       return;
// //     }
// //     setDeleting(true);
// //     setError("");
// //     try {
// //       await api.delete(`/api/v1/leave/balance/${id}`);
// //       setConfirmDelete(null);
// //       setSelectedBalance(null);
// //       await fetchData();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //       setConfirmDelete(null);
// //     } finally {
// //       setDeleting(false);
// //     }
// //   };

// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// //   const getTypeName = useCallback(
// //     (leaveTypeId) => {
// //       const found = leaveTypes.find(
// //         (t) => String(getLeaveTypeId(t)) === String(leaveTypeId)
// //       );
// //       if (found) return getLeaveTypeName(found);
// //       if (!leaveTypeId) return "—";
// //       const asString = String(leaveTypeId);
// //       return asString.length > 12 ? `${asString.slice(0, 8)}…` : asString;
// //     },
// //     [leaveTypes]
// //   );

// //   const getPolicyName = useCallback(
// //     (policyId) => {
// //       const found = policies.find(
// //         (p) => String(getPolicyIdFromObj(p)) === String(policyId)
// //       );
// //       if (found) return getPolicyNameFromObj(found);
// //       if (!policyId) return "—";
// //       const asString = String(policyId);
// //       return asString.length > 12 ? `${asString.slice(0, 8)}…` : asString;
// //     },
// //     [policies]
// //   );

// //   /* ---------------------------------------------------------------- */
// //   /*  Render                                                           */
// //   /* ---------------------------------------------------------------- */

// //   return (
// //     <div>
// //       {/* ---------- header ---------- */}
// //       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-xl font-semibold text-slate-800">
// //             Employee Leave Balance
// //           </h1>
// //           <p className="mt-0.5 text-sm text-slate-500">
// //             {resolvedEmployeeName
// //               ? `Viewing balances for ${resolvedEmployeeName}.`
// //               : "Balances are auto-assigned from Leave Policy."}{" "}
// //             Showing <strong>{yearFilter || "all years"}</strong> data.
// //           </p>
// //         </div>

// //         {isHrOrAdmin && (
// //           <button
// //             type="button"
// //             onClick={openAdd}
// //             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// //           >
// //             + Add Balance Record
// //           </button>
// //         )}
// //       </div>

// //       {/* ---------- filters ---------- */}
// //       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// //         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
// //           <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
// //             <input
// //               value={searchInput}
// //               onChange={(e) => setSearchInput(e.target.value)}
// //               placeholder="Search by leave type…"
// //               autoComplete="off"
// //               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
// //             />
// //             <select
// //               value={yearFilter}
// //               onChange={(e) => {
// //                 setYearFilter(e.target.value);
// //                 setPage(1);
// //               }}
// //               className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
// //             >
// //               <option value="">All years</option>
// //               {YEAR_OPTIONS.map((y) => (
// //                 <option key={y} value={y}>
// //                   {y}
// //                   {y === CURRENT_YEAR ? " (Current)" : ""}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <span className="text-sm text-slate-500">{total} records</span>
// //             <button
// //               type="button"
// //               onClick={fetchData}
// //               className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
// //             >
// //               Refresh
// //             </button>
// //           </div>
// //         </div>

// //         {error && !showForm && (
// //           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// //             {error}
// //           </div>
// //         )}

// //         {!employeeId && !loading && (
// //           <div className="py-16 text-center text-sm text-slate-500">
// //             Employee ID not found for current user. Please contact HR.
// //           </div>
// //         )}

// //         {/* ---------- cards ---------- */}
// //         {!loading && employeeId && list.length > 0 && (
// //           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
// //             {list.map((item, index) => (
// //               <button
// //                 type="button"
// //                 key={balanceRowKey(item) || index}
// //                 onClick={() => setSelectedBalance(item)}
// //                 className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E42527]/50 hover:shadow-md"
// //               >
// //                 <div className="flex items-start justify-between gap-3">
// //                   <div className="min-w-0">
// //                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// //                       {item.year ?? "—"} leave balance
// //                     </p>
// //                     <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
// //                       {getTypeName(item.leave_type_id)}
// //                     </h3>
// //                     <p className="mt-0.5 truncate text-[11px] text-slate-400">
// //                       {getPolicyName(item.leave_policy_id)}
// //                     </p>
// //                   </div>
// //                   <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
// //                     {item.leaves_remaining ?? 0} left
// //                   </span>
// //                 </div>

// //                 <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
// //                   <div>
// //                     <p className="text-xs text-slate-400">Total</p>
// //                     <p className="mt-0.5 font-semibold text-slate-700">
// //                       {item.total_leaves ?? 0}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-slate-400">Taken</p>
// //                     <p className="mt-0.5 font-semibold text-slate-700">
// //                       {item.leaves_taken ?? 0}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-slate-400">Pending</p>
// //                     <p className="mt-0.5 font-semibold text-slate-700">
// //                       {item.leaves_pending ?? 0}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </button>
// //             ))}
// //           </div>
// //         )}

// //         {/* ---------- body states ---------- */}
// //         <div>
// //           {loading ? (
// //             <div className="py-20 text-center text-sm text-slate-500">
// //               Loading…
// //             </div>
// //           ) : employeeId && list.length === 0 ? (
// //             <div className="px-4 py-16 text-center text-sm text-slate-500">
// //               <p className="font-medium text-slate-700">
// //                 No leave balance found for {yearFilter || "any year"}
// //               </p>
// //               <p className="mt-2">
// //                 Try changing the year filter or contact HR.
// //                 <br />
// //                 Balances are auto-assigned once a policy exists.
// //               </p>
// //             </div>
// //           ) : null}
// //         </div>

// //         {/* ---------- pagination ---------- */}
// //         {totalPages > 1 && (
// //           <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
// //             <span className="text-sm text-slate-500">
// //               Page {page} of {totalPages}
// //             </span>
// //             <div className="flex gap-2">
// //               <button
// //                 type="button"
// //                 disabled={page <= 1}
// //                 onClick={() => setPage((p) => Math.max(1, p - 1))}
// //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Prev
// //               </button>
// //               <button
// //                 type="button"
// //                 disabled={page >= totalPages}
// //                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// //                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* ================= ADD / EDIT MODAL ================= */}
// //       {showForm && (
// //         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
// //           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-base font-semibold text-slate-800">
// //                 {editId ? "Edit Leave Balance" : "Add Leave Balance"}
// //               </h2>
// //               <button
// //                 type="button"
// //                 onClick={closeForm}
// //                 disabled={saving}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={handleSubmit}>
// //               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
// //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                   {/* Employee */}
// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Employee {!editId && <span className="text-red-600">*</span>}
// //                     </label>
// //                     {isHrOrAdmin && !editId && employees.length > 0 ? (
// //                       <select
// //                         required
// //                         value={formData.employee_id || employeeId}
// //                         onChange={(e) =>
// //                           handleChange("employee_id", e.target.value)
// //                         }
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                       >
// //                         <option value="">Select employee</option>
// //                         {employees.map((emp) => {
// //                           const eid = emp.employee_id || emp.emp_id || emp.id;
// //                           const ename =
// //                             emp.employee_name ||
// //                             emp.name ||
// //                             `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
// //                             eid;
// //                           return (
// //                             <option key={eid} value={eid}>
// //                               {ename} ({eid})
// //                             </option>
// //                           );
// //                         })}
// //                       </select>
// //                     ) : (
// //                       <input
// //                         required={!editId}
// //                         value={formData.employee_id || employeeId}
// //                         onChange={(e) =>
// //                           handleChange("employee_id", e.target.value)
// //                         }
// //                         disabled={editId || isSelfView}
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50 disabled:text-slate-500"
// //                       />
// //                     )}
// //                   </div>

// //                   {/* Leave Type */}
// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Leave Type {!editId && <span className="text-red-600">*</span>}
// //                     </label>
// //                     {editId ? (
// //                       <input
// //                         value={getTypeName(formData.leave_type_id)}
// //                         disabled
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50 text-slate-500"
// //                       />
// //                     ) : (
// //                       <select
// //                         required
// //                         value={formData.leave_type_id}
// //                         onChange={(e) => {
// //                           handleChange("leave_type_id", e.target.value);
// //                           // reset policy when type changes
// //                           handleChange("leave_policy_id", "");
// //                         }}
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                       >
// //                         <option value="">
// //                           {leaveTypes.length === 0
// //                             ? "No leave types available"
// //                             : "Select leave type"}
// //                         </option>
// //                         {leaveTypes.map((lt) => (
// //                           <option
// //                             key={getLeaveTypeId(lt)}
// //                             value={getLeaveTypeId(lt)}
// //                           >
// //                             {getLeaveTypeName(lt)}
// //                           </option>
// //                         ))}
// //                       </select>
// //                     )}
// //                   </div>

// //                   {/* ⭐ Policy — DROPDOWN with all policies */}
// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Leave Policy {!editId && <span className="text-red-600">*</span>}
// //                     </label>
// //                     {editId ? (
// //                       <input
// //                         value={getPolicyName(formData.leave_policy_id)}
// //                         disabled
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50 text-slate-500"
// //                       />
// //                     ) : (
// //                       <select
// //                         required
// //                         value={formData.leave_policy_id}
// //                         onChange={(e) =>
// //                           handleChange("leave_policy_id", e.target.value)
// //                         }
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                       >
// //                         <option value="">
// //                           {filteredPolicies.length === 0
// //                             ? formData.leave_type_id
// //                               ? "No policies for this leave type"
// //                               : "Select policy"
// //                             : "Select policy"}
// //                         </option>
// //                         {filteredPolicies.map((p) => {
// //                           const pid = getPolicyIdFromObj(p);
// //                           const pname = getPolicyNameFromObj(p);
// //                           const isActive = p.is_active !== false;
// //                           return (
// //                             <option key={pid} value={pid}>
// //                               {pname} {isActive ? "" : "(inactive)"}
// //                             </option>
// //                           );
// //                         })}
// //                       </select>
// //                     )}
// //                     {!editId && formData.leave_type_id && filteredPolicies.length === 0 && (
// //                       <p className="mt-1 text-[11px] text-amber-600">
// //                         Is leave type ke liye koi policy nahi mili.
// //                       </p>
// //                     )}
// //                   </div>

// //                   {/* Year */}
// //                   <div>
// //                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
// //                       Year {!editId && <span className="text-red-600">*</span>}
// //                     </label>
// //                     <select
// //                       required
// //                       value={formData.year}
// //                       onChange={(e) => handleChange("year", e.target.value)}
// //                       disabled={!!editId}
// //                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50 disabled:text-slate-500"
// //                     >
// //                       {YEAR_OPTIONS.map((y) => (
// //                         <option key={y} value={y}>
// //                           {y}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 {/* Balance numbers */}
// //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// //                   {[
// //                     ["total_leaves", "Total", { min: 0 }],
// //                     ["leaves_taken", "Taken", { min: 0 }],
// //                     ["leaves_pending", "Pending", { min: 0 }],
// //                     ["leaves_remaining", "Remaining", {}],
// //                     ["carried_forward", "Carried Forward", {}],
// //                     ["encashed", "Encashed", { min: 0 }],
// //                     ["lapsed", "Lapsed", { min: 0 }],
// //                   ].map(([key, label, extra]) => (
// //                     <div key={key}>
// //                       <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
// //                         <span>{label}</span>
// //                         {key === "leaves_remaining" && (
// //                           <button
// //                             type="button"
// //                             onClick={() =>
// //                               handleChange(
// //                                 "leaves_remaining",
// //                                 String(suggestedRemaining)
// //                               )
// //                             }
// //                             className="text-xs font-normal text-[#E42527] hover:underline"
// //                             title={`Total + Carried − Taken − Pending − Encashed − Lapsed = ${suggestedRemaining}`}
// //                           >
// //                             use {suggestedRemaining}
// //                           </button>
// //                         )}
// //                       </label>
// //                       <input
// //                         type="number"
// //                         value={formData[key]}
// //                         onChange={(e) => handleChange(key, e.target.value)}
// //                         {...extra}
// //                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// //                       />
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {error && (
// //                   <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
// //                     {error}
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //                 <button
// //                   type="button"
// //                   onClick={closeForm}
// //                   disabled={saving}
// //                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving…" : editId ? "Update" : "Submit"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* ================= DETAILS MODAL ================= */}
// //       {selectedBalance && (
// //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// //           <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <div>
// //                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
// //                   {selectedBalance.year ?? "—"} leave balance
// //                 </p>
// //                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
// //                   {getTypeName(selectedBalance.leave_type_id)}
// //                 </h2>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedBalance(null)}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
// //               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
// //                 {[
// //                   ["Employee ID", selectedBalance.employee_id],
// //                   ["Leave Type", getTypeName(selectedBalance.leave_type_id)],
// //                   ["Policy", getPolicyName(selectedBalance.leave_policy_id)],
// //                   ["Year", selectedBalance.year],
// //                   ["Total", selectedBalance.total_leaves],
// //                   ["Taken", selectedBalance.leaves_taken],
// //                   ["Pending", selectedBalance.leaves_pending],
// //                   ["Remaining", selectedBalance.leaves_remaining],
// //                   ["Carried Forward", selectedBalance.carried_forward],
// //                   ["Encashed", selectedBalance.encashed],
// //                   ["Lapsed", selectedBalance.lapsed],
// //                 ].map(([label, value]) => (
// //                   <div
// //                     key={label}
// //                     className="rounded-lg bg-slate-50 px-3 py-2.5"
// //                   >
// //                     <p className="text-xs text-slate-400">{label}</p>
// //                     <p className="mt-1 break-all text-sm font-medium text-slate-800">
// //                       {value ?? "—"}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedBalance(null)}
// //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
// //               >
// //                 Close
// //               </button>
// //               {isHrOrAdmin && (
// //                 <>
// //                   <button
// //                     type="button"
// //                     onClick={() => setConfirmDelete(selectedBalance)}
// //                     className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
// //                   >
// //                     Delete
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       const item = selectedBalance;
// //                       setSelectedBalance(null);
// //                       openEdit(item);
// //                     }}
// //                     className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
// //                   >
// //                     Edit balance
// //                   </button>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ================= DELETE CONFIRM ================= */}
// //       {confirmDelete && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// //           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
// //             <div className="border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-base font-semibold text-slate-800">
// //                 Delete leave balance?
// //               </h2>
// //             </div>
// //             <div className="px-5 py-5 text-sm text-slate-600">
// //               This will remove the{" "}
// //               <span className="font-medium text-slate-800">
// //                 {getTypeName(confirmDelete.leave_type_id)}
// //               </span>{" "}
// //               balance record for{" "}
// //               <span className="font-medium text-slate-800">
// //                 {confirmDelete.year ?? "—"}
// //               </span>
// //               . This action cannot be undone.
// //               {error && (
// //                 <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-red-600">
// //                   {error}
// //                 </div>
// //               )}
// //             </div>
// //             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setConfirmDelete(null)}
// //                 disabled={deleting}
// //                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={handleDelete}
// //                 disabled={deleting}
// //                 className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
// //               >
// //                 {deleting ? "Deleting…" : "Delete"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import * as XLSX from "xlsx";
// import { api } from "@/app/lib/api";
// import {
//   fetchLeaveTypes,
//   getLeaveTypeId,
//   getLeaveTypeName,
// } from "@/app/lib/leaveTypes";
// import { useAuthStore } from "@/app/store/authStore";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const CURRENT_YEAR = new Date().getFullYear();
// const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 3 + i);
// const AUTO_DISMISS_MS = 5000;
// const HR_ROLES = new Set(["admin", "approle.admin", "hr", "approle.hr"]);

// const initialForm = {
//   employee_id: "",
//   leave_type_id: "",
//   leave_policy_id: "",
//   year: CURRENT_YEAR,
//   total_leaves: 0,
//   leaves_taken: 0,
//   leaves_pending: 0,
//   leaves_remaining: 0,
//   carried_forward: 0,
//   encashed: 0,
//   lapsed: 0,
//   lop_days: 0,
// };

// /* ══════════════════════════════════════════════════════════
//    HELPERS
//    ══════════════════════════════════════════════════════════ */

// const toNumber = (v, fallback = 0) => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// };

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) =>
//         Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
//       )
//       .join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   if (err?.response?.data?.message) return err.response.data.message;
//   if (err?.code === "ERR_NETWORK") return "Network error. Check connection.";
//   if (err?.response?.status === 401) return "Session expired. Login again.";
//   if (err?.response?.status === 403) return "Permission denied.";
//   if (err?.response?.status === 405) return "Not supported.";
//   return err?.message || "Something went wrong";
// };

// const isCancel = (err) =>
//   err?.name === "CanceledError" ||
//   err?.code === "ERR_CANCELED" ||
//   err?.name === "AbortError";

// const pickList = (payload) => {
//   if (Array.isArray(payload)) return payload;
//   if (!payload || typeof payload !== "object") return [];
//   return (
//     payload.items ??
//     payload.results ??
//     payload.data ??
//     payload.employees ??
//     payload.leave_types ??
//     payload.policies ??
//     []
//   );
// };

// const hasHrAccess = (user) => {
//   if (!user) return false;
//   const roles = [
//     user.role,
//     ...(Array.isArray(user.roles) ? user.roles : []),
//     ...(Array.isArray(user.user_roles) ? user.user_roles : []),
//   ]
//     .filter(Boolean)
//     .map((r) =>
//       String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
//         .toLowerCase()
//         .trim()
//     );
//   return roles.some((r) => HR_ROLES.has(r));
// };

// const pickEmployeeId = (u) =>
//   u?.employee_id ||
//   u?.employeeId ||
//   u?.emp_id ||
//   u?.employee?.employee_id ||
//   u?.profile?.employee_id ||
//   u?.data?.employee_id ||
//   "";

// const balanceRowKey = (item) =>
//   item?.balance_id ?? item?.leave_balance_id ?? item?.id ?? null;

// const getPolicyIdFromObj = (p) =>
//   p?.leave_policy_id || p?.policy_id || p?.id || "";

// const getPolicyNameFromObj = (p) =>
//   p?.policy_name ||
//   p?.leave_policy_name ||
//   getPolicyIdFromObj(p) ||
//   "Unnamed Policy";

// const getEmployeeDisplayName = (emp) => {
//   if (!emp) return "";
//   return (
//     emp.employee_name ||
//     emp.name ||
//     emp.full_name ||
//     `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
//     emp.personal_email ||
//     emp.employee_id ||
//     ""
//   );
// };

// const getEmployeeEmail = (emp) =>
//   emp?.personal_email || emp?.company_email || "";

// const getEmployeeMobile = (emp) =>
//   emp?.personal_mobile || emp?.company_mobile || "";

// /* ⭐ Normalize: lowercase + trim + collapse spaces */
// const normalizeKey = (s) =>
//   String(s || "")
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, " ");

// /* ══════════════════════════════════════════════════════════
//    TOAST
//    ══════════════════════════════════════════════════════════ */

// function Toast({ type = "info", message, onDismiss }) {
//   useEffect(() => {
//     if (!message) return;
//     const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [message, onDismiss]);

//   if (!message) return null;

//   const styles =
//     {
//       error: "border-red-200 bg-red-50 text-red-700",
//       success: "border-emerald-200 bg-emerald-50 text-emerald-700",
//     }[type] || "border-slate-200 bg-slate-50 text-slate-700";

//   return (
//     <div
//       className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles}`}
//     >
//       <span className="whitespace-pre-line font-medium">{message}</span>
//       <button
//         type="button"
//         onClick={onDismiss}
//         className="opacity-60 hover:opacity-100"
//       >
//         ✕
//       </button>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    IMPORT MODAL — FIXED (duplicate name handling)
//    ══════════════════════════════════════════════════════════ */

// function ImportModal({
//   open,
//   onClose,
//   employees: employeesProp,
//   leaveTypes,
//   year,
//   onDone,
// }) {
//   const [file, setFile] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [importing, setImporting] = useState(false);
//   const [result, setResult] = useState(null);
//   const [parseError, setParseError] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [employees, setEmployees] = useState(employeesProp || []);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);

//   /* ── Fix #1: Auto-fetch employees if prop empty ── */
//   useEffect(() => {
//     if (!open) return;
//     if (employeesProp && employeesProp.length > 0) {
//       setEmployees(employeesProp);
//       return;
//     }
//     setLoadingEmployees(true);
//     api
//       .get("/api/v1/get/employees")
//       .then((res) => {
//         const list =
//           res?.data?.employees ||
//           res?.data?.data?.employees ||
//           res?.data?.data ||
//           [];
//         setEmployees(Array.isArray(list) ? list : []);
//       })
//       .catch(() => setEmployees([]))
//       .finally(() => setLoadingEmployees(false));
//   }, [open, employeesProp]);

//   /* ⭐ Fix #2: Unique-only map + ambiguous names tracker */
//   const { lookupMap, duplicateNames } = useMemo(() => {
//     const map = new Map();
//     const nameCount = new Map(); // normalized name → count
//     const emailMap = new Map(); // email → emp
//     const mobileMap = new Map(); // mobile → emp
//     const idMap = new Map(); // emp_id → emp
//     const nameMap = new Map(); // normalized name → [emps]

//     // Pass 1: collect all
//     employees.forEach((emp) => {
//       const eid = emp.employee_id;
//       if (!eid) return;

//       const first = String(emp.first_name || "").trim();
//       const last = String(emp.last_name || "").trim();
//       const fullName = `${first} ${last}`.trim();
//       const reverseName = `${last} ${first}`.trim();

//       const emails = [emp.personal_email, emp.company_email]
//         .filter(Boolean)
//         .map((e) => normalizeKey(e));
//       const mobiles = [emp.personal_mobile, emp.company_mobile]
//         .filter(Boolean)
//         .map((m) => String(m).trim());

//       // Unique fields — always add
//       emails.forEach((e) => emailMap.set(e, emp));
//       mobiles.forEach((m) => mobileMap.set(m, emp));
//       idMap.set(normalizeKey(eid), emp);

//       // Names — track count
//       [first, last, fullName, reverseName].forEach((n) => {
//         const nk = normalizeKey(n);
//         if (!nk) return;
//         if (!nameMap.has(nk)) nameMap.set(nk, []);
//         const arr = nameMap.get(nk);
//         if (!arr.find((x) => x.employee_id === eid)) arr.push(emp);
//       });
//     });

//     // Pass 2: unique names only
//     const dupNames = new Set();
//     nameMap.forEach((emps, name) => {
//       if (emps.length === 1) {
//         map.set(name, emps[0]);
//       } else {
//         dupNames.add(name);
//       }
//     });

//     // Merge unique fields into map (higher priority)
//     emailMap.forEach((emp, k) => map.set(k, emp));
//     mobileMap.forEach((emp, k) => map.set(k, emp));
//     idMap.forEach((emp, k) => map.set(k, emp));

//     return { lookupMap: map, duplicateNames: dupNames };
//   }, [employees]);

//   /* ⭐ Fix #3: Suggestions when not found or ambiguous */
//   const findSimilar = useCallback(
//     (query) => {
//       const q = normalizeKey(query);
//       if (!q || q.length < 2) return [];

//       const qFirst = q.split(" ")[0];
//       const results = [];

//       employees.forEach((emp) => {
//         const first = String(emp.first_name || "").toLowerCase().trim();
//         const last = String(emp.last_name || "").toLowerCase().trim();
//         const fullName = `${first} ${last}`.trim();
//         const email = normalizeKey(getEmployeeEmail(emp));
//         const eid = normalizeKey(emp.employee_id);

//         let score = 0;
//         if (email === q) score += 10;
//         if (eid === q) score += 10;
//         if (fullName === q) score += 8;
//         else if (fullName.includes(q)) score += 5;
//         else if (q.includes(fullName) && fullName) score += 4;
//         if (first === qFirst) score += 3;
//         else if (first.startsWith(qFirst)) score += 2;

//         if (score > 0) results.push({ emp, score });
//       });

//       return results
//         .sort((a, b) => b.score - a.score)
//         .slice(0, 5)
//         .map((r) => r.emp);
//     },
//     [employees]
//   );

//   /* ⭐ Fix #4: Leave types map */
//   const ltMap = useMemo(() => {
//     const map = new Map();
//     leaveTypes.forEach((lt) => {
//       const id = getLeaveTypeId(lt);
//       const name = normalizeKey(getLeaveTypeName(lt));
//       const code = normalizeKey(lt.leave_type_code);
//       if (name) map.set(name, lt);
//       if (code) map.set(code, lt);
//       if (id) map.set(normalizeKey(id), lt);
//     });
//     return map;
//   }, [leaveTypes]);

//   if (!open) return null;

//   const handleFile = (f) => {
//     setFile(f);
//     setRows([]);
//     setResult(null);
//     setParseError("");
//     if (!f) return;

//     if (employees.length === 0) {
//       setParseError(
//         "No employees loaded. Wait for employee list to load, then upload again."
//       );
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const wb = XLSX.read(data, { type: "array" });
//         const sheet = wb.Sheets[wb.SheetNames[0]];
//         const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

//         if (json.length === 0) return setParseError("File has no rows");

//         const normalized = json.map((r) => {
//           const out = {};
//           Object.keys(r).forEach((k) => {
//             const key = String(k).trim().toLowerCase().replace(/\s+/g, "_");
//             out[key] = r[k];
//           });
//           return out;
//         });

//         const empKeys = [
//           "employee",
//           "employee_email",
//           "email",
//           "employee_name",
//           "employee_id",
//           "emp_email",
//           "name",
//         ];
//         const empCol = empKeys.find((k) => normalized[0][k] !== undefined);
//         if (!empCol)
//           return setParseError(
//             "Employee column not found. Use: employee or employee_email"
//           );

//         const ltKeys = [
//           "leave_type",
//           "leave_type_name",
//           "leave_type_code",
//           "type",
//           "code",
//         ];
//         const ltCol = ltKeys.find((k) => normalized[0][k] !== undefined);
//         if (!ltCol)
//           return setParseError("Leave type column not found. Use: leave_type");

//         const resolved = normalized.map((r, idx) => {
//           const empRaw = String(r[empCol] || "").trim();
//           const ltRaw = String(r[ltCol] || "").trim();
//           const empKey = normalizeKey(empRaw);
//           const ltKey = normalizeKey(ltRaw);

//           const emp = lookupMap.get(empKey);
//           const lt = ltMap.get(ltKey);

//           const total = Number(r.total) || 0;
//           const used = Number(r.used) || 0;
//           const remaining =
//             r.remaining !== "" && r.remaining !== undefined
//               ? Number(r.remaining)
//               : total - used;

//           let error = null;
//           let suggestions = [];

//           if (!empRaw) {
//             error = "Employee blank";
//           } else if (!emp) {
//             // ⭐ Check if it's an ambiguous name
//             if (duplicateNames.has(empKey)) {
//               const matches = employees.filter((e) => {
//                 const fullName = normalizeKey(
//                   `${e.first_name || ""} ${e.last_name || ""}`
//                 );
//                 const rev = normalizeKey(
//                   `${e.last_name || ""} ${e.first_name || ""}`
//                 );
//                 const first = normalizeKey(e.first_name || "");
//                 const last = normalizeKey(e.last_name || "");
//                 return (
//                   fullName === empKey ||
//                   rev === empKey ||
//                   first === empKey ||
//                   last === empKey
//                 );
//               });
//               error = `Multiple employees named "${empRaw}" — please use email or ID`;
//               suggestions = matches.slice(0, 5);
//             } else {
//               error = `Employee "${empRaw}" not found`;
//               suggestions = findSimilar(empRaw);
//             }
//           } else if (!ltRaw) {
//             error = "Leave type blank";
//           } else if (!lt) {
//             error = `Leave type "${ltRaw}" not found`;
//           }

//           return {
//             row: idx + 2,
//             raw_employee: empRaw,
//             raw_leave_type: ltRaw,
//             employee: emp,
//             leave_type: lt,
//             total,
//             used,
//             remaining,
//             error,
//             suggestions,
//           };
//         });

//         setRows(resolved);
//       } catch (err) {
//         setParseError("Excel read failed: " + err.message);
//       }
//     };
//     reader.readAsArrayBuffer(f);
//   };

//   const runImport = async () => {
//     setImporting(true);
//     setProgress(0);
//     const results = [];
//     const validRows = rows.filter((r) => !r.error);

//     for (let i = 0; i < validRows.length; i++) {
//       const row = validRows[i];
//       try {
//         const ltId = getLeaveTypeId(row.leave_type);

//         const existRes = await api.get(
//           `/api/v1/leave/balance/${row.employee.employee_id}`,
//           {
//             params: { year: Number(year), page: 1, page_size: 500 },
//           }
//         );
//         const existingList =
//           existRes?.data?.employee_leave_balances ||
//           existRes?.data?.data?.employee_leave_balances ||
//           [];
//         const existing = existingList.find(
//           (b) => String(b.leave_type_id) === String(ltId)
//         );

//         if (existing?.balance_id) {
//           await api.put(`/api/v1/leave/balance/${existing.balance_id}`, {
//             opening_total: row.total,
//             opening_available: row.remaining,
//             leaves_taken: row.used,
//             leaves_pending: 0,
//             carried_forward: 0,
//             encashed: 0,
//             lapsed: 0,
//             lop_days: 0,
//           });
//           results.push({
//             row: row.row,
//             status: "updated",
//             employee: row.raw_employee,
//             leave_type: row.raw_leave_type,
//           });
//         } else {
//           const policiesRes = await api.get("/api/v1/leave/policies", {
//             params: { page: 1, page_size: 500 },
//           });
//           const policies =
//             policiesRes?.data?.policies ||
//             policiesRes?.data?.data?.policies ||
//             [];
//           const policy = policies.find(
//             (p) =>
//               String(p.leave_type_id) === String(ltId) && p.is_active !== false
//           );
//           if (!policy) {
//             results.push({
//               row: row.row,
//               status: "failed",
//               message: `No policy for "${row.raw_leave_type}"`,
//             });
//             setProgress(i + 1);
//             continue;
//           }

//           await api.post("/api/v1/leave/balance", {
//             employee_id: row.employee.employee_id,
//             leave_type_id: ltId,
//             leave_policy_id: getPolicyIdFromObj(policy),
//             year: Number(year),
//             total_leaves: row.total,
//             leaves_taken: row.used,
//             leaves_pending: 0,
//             leaves_remaining: row.remaining,
//             lop_days: 0,
//           });
//           results.push({
//             row: row.row,
//             status: "created",
//             employee: row.raw_employee,
//             leave_type: row.raw_leave_type,
//           });
//         }
//       } catch (err) {
//         const msg = err?.response?.data?.detail || err?.message || "Unknown";
//         results.push({
//           row: row.row,
//           status: "failed",
//           message: String(msg).slice(0, 200),
//         });
//       }
//       setProgress(i + 1);
//     }

//     rows
//       .filter((r) => r.error)
//       .forEach((r) => {
//         results.push({
//           row: r.row,
//           status: "skipped",
//           message: r.error,
//         });
//       });

//     setResult(results);
//     setImporting(false);
//     if (onDone) onDone();
//   };

//   const reset = () => {
//     setFile(null);
//     setRows([]);
//     setResult(null);
//     setParseError("");
//     setProgress(0);
//   };

//   const close = () => {
//     if (importing) return;
//     reset();
//     onClose();
//   };

//   const downloadTemplate = () => {
//     try {
//       const ws = XLSX.utils.aoa_to_sheet([
//         ["employee", "leave_type", "total", "used", "remaining"],
//         ["rahul@company.com", "Casual Leave", 12, 3, 9],
//         ["priya.k@company.com", "Sick Leave", 8, 0, 8],
//         ["EMP003", "Earned Leave", 15, 0, 15],
//       ]);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Template");
//       XLSX.writeFile(wb, "leave-balance-template.xlsx");
//     } catch (err) {
//       console.error("Template download failed:", err);
//     }
//   };

//   const validRows = rows.filter((r) => !r.error).length;
//   const errorRows = rows.filter((r) => r.error).length;
//   const dupCount = Array.from(duplicateNames).length;

//   return (
//     <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//       <div className="mb-10 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//           <div>
//             <h2 className="text-base font-semibold text-slate-800">
//               Import Leave Balances
//             </h2>
//             <p className="mt-0.5 text-xs text-slate-500">
//               {loadingEmployees
//                 ? "Loading employees…"
//                 : `${employees.length} employees loaded${dupCount > 0 ? ` · ${dupCount} duplicate name(s) — use email/ID for those` : ""}`}
//             </p>
//           </div>
//           <button
//             onClick={close}
//             disabled={importing}
//             className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
//           {/* Template info */}
//           <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <p className="text-sm font-semibold text-sky-900">
//                   📋 Step 1: Download template
//                 </p>
//                 <p className="mt-0.5 text-xs text-sky-700">
//                   Columns:{" "}
//                   <code>employee | leave_type | total | used | remaining</code>
//                 </p>
//                 <p className="mt-0.5 text-[11px] text-sky-600">
//                   <strong>Best:</strong> email use karo. Naam sirf tab jab unique ho.
//                 </p>
//               </div>
//               <button
//                 onClick={downloadTemplate}
//                 className="shrink-0 rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-50"
//               >
//                 Download
//               </button>
//             </div>
//           </div>

//           {/* Upload */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">
//               📁 Step 2: Upload File
//             </label>
//             <input
//               type="file"
//               accept=".xlsx,.xls"
//               onChange={(e) => handleFile(e.target.files?.[0])}
//               disabled={importing || loadingEmployees}
//               className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#E42527] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#c91f21] disabled:opacity-50"
//             />
//           </div>

//           {parseError && (
//             <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {parseError}
//             </div>
//           )}

//           {/* Preview */}
//           {rows.length > 0 && !result && (
//             <div>
//               <div className="mb-2 flex items-center justify-between">
//                 <p className="text-sm font-semibold text-slate-800">
//                   Preview ({rows.length} rows)
//                 </p>
//                 <div className="flex gap-3 text-xs">
//                   <span className="text-emerald-700">
//                     ✅ Valid: {validRows}
//                   </span>
//                   {errorRows > 0 && (
//                     <span className="text-red-700">
//                       ❌ Errors: {errorRows}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200">
//                 <table className="w-full text-xs">
//                   <thead className="sticky top-0 bg-slate-100 text-slate-600">
//                     <tr>
//                       <th className="px-2 py-2 text-left">Row</th>
//                       <th className="px-2 py-2 text-left">Employee</th>
//                       <th className="px-2 py-2 text-left">Leave Type</th>
//                       <th className="px-2 py-2 text-right">Total</th>
//                       <th className="px-2 py-2 text-right">Used</th>
//                       <th className="px-2 py-2 text-right">Rem</th>
//                       <th className="px-2 py-2 text-left">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {rows.map((r) => (
//                       <tr key={r.row} className={r.error ? "bg-red-50" : ""}>
//                         <td className="px-2 py-1.5 font-medium text-slate-500">
//                           {r.row}
//                         </td>
//                         <td className="px-2 py-1.5">
//                           {r.employee ? (
//                             <div>
//                               <span className="text-slate-700 font-medium">
//                                 {getEmployeeDisplayName(r.employee)}
//                               </span>
//                               {getEmployeeEmail(r.employee) && (
//                                 <div className="text-[10px] text-slate-500">
//                                   {getEmployeeEmail(r.employee)}
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div>
//                               <span className="text-red-600">
//                                 {String(r.raw_employee)}
//                               </span>
//                               {r.suggestions && r.suggestions.length > 0 && (
//                                 <div className="mt-1 space-y-0.5">
//                                   <p className="text-[10px] text-slate-500 font-semibold">
//                                     Did you mean (use email to be safe):
//                                   </p>
//                                   {r.suggestions.map((s, i) => (
//                                     <div
//                                       key={i}
//                                       className="text-[10px] text-sky-700"
//                                     >
//                                       • {getEmployeeDisplayName(s)}
//                                       {getEmployeeEmail(s) && (
//                                         <span className="text-slate-400">
//                                           {" "}
//                                           — {getEmployeeEmail(s)}
//                                         </span>
//                                       )}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </td>
//                         <td className="px-2 py-1.5">
//                           {r.leave_type ? (
//                             <span className="text-slate-700">
//                               {getLeaveTypeName(r.leave_type)}
//                             </span>
//                           ) : (
//                             <span className="text-red-600">
//                               {String(r.raw_leave_type)}
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-2 py-1.5 text-right tabular-nums">
//                           {r.total}
//                         </td>
//                         <td className="px-2 py-1.5 text-right tabular-nums">
//                           {r.used}
//                         </td>
//                         <td className="px-2 py-1.5 text-right tabular-nums">
//                           {r.remaining}
//                         </td>
//                         <td className="px-2 py-1.5">
//                           {r.error ? (
//                             <span className="text-red-600">{r.error}</span>
//                           ) : (
//                             <span className="text-emerald-600">✓ Ready</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Progress */}
//           {importing && (
//             <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
//               <p className="text-sm font-semibold text-sky-900">
//                 Importing… {progress}/{validRows}
//               </p>
//               <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sky-100">
//                 <div
//                   className="h-full bg-sky-500 transition-all"
//                   style={{
//                     width: `${validRows ? (progress / validRows) * 100 : 0}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Result */}
//           {result && (
//             <div className="space-y-3">
//               <div className="grid grid-cols-3 gap-3">
//                 <div className="rounded-lg bg-emerald-50 px-3 py-2">
//                   <p className="text-[10px] uppercase text-emerald-700">
//                     Created
//                   </p>
//                   <p className="text-xl font-bold text-emerald-700 tabular-nums">
//                     {result.filter((r) => r.status === "created").length}
//                   </p>
//                 </div>
//                 <div className="rounded-lg bg-sky-50 px-3 py-2">
//                   <p className="text-[10px] uppercase text-sky-700">
//                     Updated
//                   </p>
//                   <p className="text-xl font-bold text-sky-700 tabular-nums">
//                     {result.filter((r) => r.status === "updated").length}
//                   </p>
//                 </div>
//                 <div className="rounded-lg bg-red-50 px-3 py-2">
//                   <p className="text-[10px] uppercase text-red-700">
//                     Failed / Skipped
//                   </p>
//                   <p className="text-xl font-bold text-red-700 tabular-nums">
//                     {
//                       result.filter(
//                         (r) =>
//                           r.status === "failed" || r.status === "skipped"
//                       ).length
//                     }
//                   </p>
//                 </div>
//               </div>

//               {result.some(
//                 (r) => r.status === "failed" || r.status === "skipped"
//               ) && (
//                 <div className="max-h-60 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3">
//                   <p className="text-xs font-semibold text-red-800">Issues:</p>
//                   <div className="mt-1 space-y-0.5 text-xs text-red-700">
//                     {result
//                       .filter(
//                         (r) =>
//                           r.status === "failed" || r.status === "skipped"
//                       )
//                       .map((r, i) => (
//                         <div key={i}>
//                           Row {r.row}: {r.message}
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
//           <button
//             onClick={result ? reset : close}
//             disabled={importing}
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//           >
//             {result ? "Import Another" : "Cancel"}
//           </button>
//           <button
//             onClick={runImport}
//             disabled={importing || validRows === 0 || !!result}
//             className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//           >
//             {importing
//               ? `Importing ${progress}/${validRows}…`
//               : `Import ${validRows} Row(s)`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function EmployeeLeaveBalancePage() {
//   const user = useAuthStore((state) => state.user);
//   const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

//   const [list, setList] = useState([]);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [showImportModal, setShowImportModal] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [yearFilter, setYearFilter] = useState(String(CURRENT_YEAR));
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
//   const [resolvedEmployeeName, setResolvedEmployeeName] = useState("");
//   const [selectedBalance, setSelectedBalance] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);
//   const [exporting, setExporting] = useState(false);

//   const abortRef = useRef(null);
//   const employeeFromUser = useMemo(() => pickEmployeeId(user), [user]);
//   const employeeId = employeeFromUser || resolvedEmployeeId;
//   const isSelfView = Boolean(employeeFromUser) && !isHrOrAdmin;

//   /* ── Resolve employee id ── */
//   useEffect(() => {
//     if (employeeFromUser) return;
//     const userId = user?.user_id || user?.userId || user?.id || user?.sub;
//     if (!userId) return;
//     let cancelled = false;
//     api
//       .get("/api/v1/get/employees")
//       .then((response) => {
//         if (cancelled) return;
//         const list = pickList(response?.data?.data ?? response?.data);
//         const employee = list.find(
//           (item) =>
//             String(item.user_id ?? item.userId ?? "") === String(userId)
//         );
//         setResolvedEmployeeId(
//           employee?.employee_id || employee?.emp_id || employee?.id || ""
//         );
//         setResolvedEmployeeName(getEmployeeDisplayName(employee));
//       })
//       .catch(() => {});
//     return () => {
//       cancelled = true;
//     };
//   }, [employeeFromUser, user]);

//   /* ── Load leave types ── */
//   useEffect(() => {
//     let cancelled = false;
//     fetchLeaveTypes()
//       .then((types) => {
//         if (!cancelled) setLeaveTypes(Array.isArray(types) ? types : []);
//       })
//       .catch(() => {});
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ── Load policies ── */
//   useEffect(() => {
//     let cancelled = false;
//     api
//       .get("/api/v1/leave/policies", { params: { page: 1, page_size: 500 } })
//       .then((res) => {
//         if (cancelled) return;
//         setPolicies(pickList(res?.data?.data ?? res?.data));
//       })
//       .catch(() => {});
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ── Load employees ── */
//   useEffect(() => {
//     if (!isHrOrAdmin) return;
//     let cancelled = false;
//     api
//       .get("/api/v1/get/employees")
//       .then((res) => {
//         if (cancelled) return;
//         setEmployees(pickList(res?.data?.data ?? res?.data));
//       })
//       .catch(() => {});
//     return () => {
//       cancelled = true;
//     };
//   }, [isHrOrAdmin]);

//   /* ── Search debounce ── */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* ── Auto-dismiss success ── */
//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [success]);

//   /* ── Fetch balances ── */
//   const fetchData = useCallback(async () => {
//     if (!employeeId) {
//       setList([]);
//       setTotal(0);
//       setLoading(false);
//       return;
//     }
//     if (abortRef.current) abortRef.current.abort();
//     const controller = new AbortController();
//     abortRef.current = controller;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get(`/api/v1/leave/balance/${employeeId}`, {
//         params: {
//           page,
//           page_size: pageSize,
//           ...(search ? { search } : {}),
//           ...(yearFilter ? { year: yearFilter } : {}),
//         },
//         signal: controller.signal,
//       });
//       const payload = res.data?.data ?? res.data ?? {};
//       const items = Array.isArray(payload)
//         ? payload
//         : payload?.employee_leave_balances ??
//           payload?.leave_balances ??
//           pickList(payload);
//       setList(Array.isArray(items) ? items : []);
//       setTotal(res.data?.total ?? payload?.total ?? items.length);
//     } catch (err) {
//       if (isCancel(err)) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (!controller.signal.aborted) setLoading(false);
//     }
//   }, [employeeId, page, pageSize, search, yearFilter]);

//   useEffect(() => {
//     fetchData();
//     return () => {
//       if (abortRef.current) abortRef.current.abort();
//     };
//   }, [fetchData]);

//   /* ── Derived ── */
//   const suggestedRemaining = useMemo(() => {
//     const t = toNumber(formData.total_leaves);
//     return Math.max(
//       t -
//         toNumber(formData.leaves_taken) -
//         toNumber(formData.leaves_pending),
//       0
//     );
//   }, [formData]);

//   const filteredPolicies = useMemo(() => {
//     let pool = policies.filter((p) => p.is_active !== false);
//     if (formData.leave_type_id) {
//       pool = pool.filter(
//         (p) => String(p.leave_type_id || "") === String(formData.leave_type_id)
//       );
//     }
//     return pool;
//   }, [policies, formData.leave_type_id]);

//   const employeeNameMap = useMemo(() => {
//     const map = {};
//     employees.forEach((emp) => {
//       const id = emp.employee_id || emp.emp_id || emp.id;
//       if (id) map[String(id)] = getEmployeeDisplayName(emp);
//     });
//     return map;
//   }, [employees]);

//   const getEmployeeName = useCallback(
//     (empId) => employeeNameMap[String(empId)] || "",
//     [employeeNameMap]
//   );

//   const getTypeName = useCallback(
//     (leaveTypeId) => {
//       const found = leaveTypes.find(
//         (t) => String(getLeaveTypeId(t)) === String(leaveTypeId)
//       );
//       if (found) return getLeaveTypeName(found);
//       if (!leaveTypeId) return "—";
//       const s = String(leaveTypeId);
//       return s.length > 12 ? `${s.slice(0, 8)}…` : s;
//     },
//     [leaveTypes]
//   );

//   const getPolicyName = useCallback(
//     (policyId) => {
//       const found = policies.find(
//         (p) => String(getPolicyIdFromObj(p)) === String(policyId)
//       );
//       if (found) return getPolicyNameFromObj(found);
//       if (!policyId) return "—";
//       const s = String(policyId);
//       return s.length > 12 ? `${s.slice(0, 8)}…` : s;
//     },
//     [policies]
//   );

//   /* ── Handlers ── */
//   const handleChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const openAdd = () => {
//     setEditId(null);
//     setFormData({ ...initialForm, employee_id: employeeId });
//     setError("");
//     setSuccess("");
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     setEditId(balanceRowKey(item));
//     setFormData({
//       ...initialForm,
//       employee_id: item.employee_id || employeeId,
//       leave_type_id: item.leave_type_id || "",
//       leave_policy_id: item.leave_policy_id || "",
//       year: item.year ?? CURRENT_YEAR,
//       total_leaves: item.total_leaves ?? 0,
//       leaves_taken: item.leaves_taken ?? 0,
//       leaves_pending: item.leaves_pending ?? 0,
//       leaves_remaining: item.leaves_remaining ?? 0,
//       carried_forward: item.carried_forward ?? 0,
//       encashed: item.encashed ?? 0,
//       lapsed: item.lapsed ?? 0,
//       lop_days: item.lop_days ?? 0,
//     });
//     setError("");
//     setSuccess("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     if (saving) return;
//     setShowForm(false);
//     setError("");
//     setEditId(null);
//     setFormData({ ...initialForm, employee_id: employeeId });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (saving) return;
//     if (!editId) {
//       if (!formData.employee_id) return setError("Employee required");
//       if (!formData.leave_type_id)
//         return setError("Leave Type required");
//       if (!formData.leave_policy_id) return setError("Policy required");
//     }
//     const year = toNumber(formData.year);
//     if (year < 2000 || year > CURRENT_YEAR + 5) {
//       setError(`Year must be between 2000 and ${CURRENT_YEAR + 5}`);
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       const commonFields = {
//         leaves_taken: toNumber(formData.leaves_taken),
//         leaves_pending: toNumber(formData.leaves_pending),
//         carried_forward: toNumber(formData.carried_forward),
//         encashed: toNumber(formData.encashed),
//         lapsed: toNumber(formData.lapsed),
//         lop_days: toNumber(formData.lop_days),
//       };
//       if (editId) {
//         await api.put(`/api/v1/leave/balance/${editId}`, {
//           opening_total: toNumber(formData.total_leaves),
//           opening_available: toNumber(formData.total_leaves),
//           ...commonFields,
//         });
//         setSuccess("Balance updated");
//       } else {
//         await api.post("/api/v1/leave/balance", {
//           employee_id: formData.employee_id,
//           leave_type_id: formData.leave_type_id,
//           leave_policy_id: formData.leave_policy_id,
//           year,
//           total_leaves: toNumber(formData.total_leaves),
//           leaves_taken: commonFields.leaves_taken,
//           leaves_pending: commonFields.leaves_pending,
//           leaves_remaining: toNumber(
//             formData.leaves_remaining,
//             suggestedRemaining
//           ),
//           lop_days: commonFields.lop_days,
//         });
//         setSuccess("Balance created");
//       }
//       setShowForm(false);
//       setFormData({ ...initialForm, employee_id: employeeId });
//       setEditId(null);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ── Export ── */
//   const handleExport = async () => {
//     setExporting(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/leave/balance/export-excel", {
//         params: {
//           ...(yearFilter ? { year: yearFilter } : {}),
//         },
//         responseType: "blob",
//       });
//       const url = URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `leave-balances-${yearFilter || "all"}-${
//         new Date().toISOString().split("T")[0]
//       }.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       setSuccess("Excel exported successfully");
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setExporting(false);
//     }
//   };

//   /* ── Delete ── */
//   const handleDelete = async () => {
//     const item = confirmDelete;
//     if (!item) return;
//     const id = balanceRowKey(item);
//     if (!id) {
//       setConfirmDelete(null);
//       setError("Missing balance id");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     try {
//       await api.delete(`/api/v1/leave/balance/${id}`);
//       setConfirmDelete(null);
//       setSelectedBalance(null);
//       setSuccess("Balance deleted");
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//       setConfirmDelete(null);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">
//             Employee Leave Balance
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             {resolvedEmployeeName
//               ? `Viewing ${resolvedEmployeeName}.`
//               : "Auto-assigned from policies."}{" "}
//             Showing <strong>{yearFilter || "all years"}</strong>.
//           </p>
//         </div>
//         {isHrOrAdmin && (
//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={handleExport}
//               disabled={exporting || list.length === 0}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//             >
//               {exporting ? "Exporting…" : "📤 Export Excel"}
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowImportModal(true)}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//             >
//               📥 Import Excel
//             </button>
//             <button
//               type="button"
//               onClick={openAdd}
//               className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//             >
//               + Add Balance
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search…"
//               className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//             />
//             <select
//               value={yearFilter}
//               onChange={(e) => {
//                 setYearFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
//             >
//               <option value="">All years</option>
//               {YEAR_OPTIONS.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                   {y === CURRENT_YEAR ? " (Current)" : ""}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-slate-500">{total} records</span>
//             <button
//               type="button"
//               onClick={fetchData}
//               className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
//             >
//               🔄 Refresh
//             </button>
//           </div>
//         </div>

//         <div className="px-4 pt-3">
//           <Toast
//             type="error"
//             message={error}
//             onDismiss={() => setError("")}
//           />
//           <Toast
//             type="success"
//             message={success}
//             onDismiss={() => setSuccess("")}
//           />
//         </div>

//         {!employeeId && !loading && (
//           <div className="py-16 text-center text-sm text-slate-500">
//             Employee not linked. Contact HR.
//           </div>
//         )}

//         {!loading && employeeId && list.length > 0 && (
//           <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
//             {list.map((item, index) => {
//               const isLocked = Boolean(item.is_locked);
//               const empName = getEmployeeName(item.employee_id);
//               return (
//                 <button
//                   type="button"
//                   key={balanceRowKey(item) || index}
//                   onClick={() => setSelectedBalance(item)}
//                   className={`group relative rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
//                     isLocked
//                       ? "border-amber-300"
//                       : "border-slate-200 hover:border-[#E42527]/50"
//                   }`}
//                 >
//                   {isLocked && (
//                     <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
//                       🔒
//                     </span>
//                   )}
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                         {item.year ?? "—"} balance
//                       </p>
//                       <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
//                         {getTypeName(item.leave_type_id)}
//                       </h3>
//                       {isHrOrAdmin && empName && (
//                         <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
//                           {empName}
//                         </p>
//                       )}
//                       <p className="mt-0.5 truncate text-[11px] text-slate-400">
//                         {getPolicyName(item.leave_policy_id)}
//                       </p>
//                     </div>
//                     <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
//                       {item.leaves_remaining ?? 0} left
//                     </span>
//                   </div>
//                   <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
//                     <div>
//                       <p className="text-xs text-slate-400">Total</p>
//                       <p className="mt-0.5 font-semibold text-slate-700 tabular-nums">
//                         {item.total_leaves ?? 0}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">Taken</p>
//                       <p className="mt-0.5 font-semibold text-slate-700 tabular-nums">
//                         {item.leaves_taken ?? 0}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">Pending</p>
//                       <p className="mt-0.5 font-semibold text-slate-700 tabular-nums">
//                         {item.leaves_pending ?? 0}
//                       </p>
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {loading ? (
//           <div className="py-20 text-center text-sm text-slate-500">
//             Loading…
//           </div>
//         ) : employeeId && list.length === 0 ? (
//           <div className="px-4 py-16 text-center text-sm text-slate-500">
//             <p className="font-medium text-slate-700">
//               No balances for {yearFilter || "any year"}
//             </p>
//             <p className="mt-2">Try different year or contact HR.</p>
//           </div>
//         ) : null}

//         {totalPages > 1 && (
//           <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
//             <span className="text-sm text-slate-500">
//               Page {page} of {totalPages}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ADD / EDIT MODAL */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Balance" : "Add Balance"}
//               </h2>
//               <button
//                 onClick={closeForm}
//                 disabled={saving}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Employee{" "}
//                       {!editId && <span className="text-red-600">*</span>}
//                     </label>
//                     {isHrOrAdmin && !editId && employees.length > 0 ? (
//                       <select
//                         required
//                         value={formData.employee_id || employeeId}
//                         onChange={(e) =>
//                           handleChange("employee_id", e.target.value)
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       >
//                         <option value="">Select employee</option>
//                         {employees.map((emp) => {
//                           const eid = emp.employee_id || emp.emp_id || emp.id;
//                           return (
//                             <option key={eid} value={eid}>
//                               {getEmployeeDisplayName(emp)} ({eid})
//                             </option>
//                           );
//                         })}
//                       </select>
//                     ) : (
//                       <input
//                         required={!editId}
//                         value={formData.employee_id || employeeId}
//                         onChange={(e) =>
//                           handleChange("employee_id", e.target.value)
//                         }
//                         disabled={editId || isSelfView}
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50"
//                       />
//                     )}
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Leave Type{" "}
//                       {!editId && <span className="text-red-600">*</span>}
//                     </label>
//                     {editId ? (
//                       <input
//                         value={getTypeName(formData.leave_type_id)}
//                         disabled
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50"
//                       />
//                     ) : (
//                       <select
//                         required
//                         value={formData.leave_type_id}
//                         onChange={(e) => {
//                           handleChange("leave_type_id", e.target.value);
//                           handleChange("leave_policy_id", "");
//                         }}
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       >
//                         <option value="">
//                           {leaveTypes.length === 0
//                             ? "No types"
//                             : "Select type"}
//                         </option>
//                         {leaveTypes.map((lt) => (
//                           <option
//                             key={getLeaveTypeId(lt)}
//                             value={getLeaveTypeId(lt)}
//                           >
//                             {getLeaveTypeName(lt)}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Policy{" "}
//                       {!editId && <span className="text-red-600">*</span>}
//                     </label>
//                     {editId ? (
//                       <input
//                         value={getPolicyName(formData.leave_policy_id)}
//                         disabled
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50"
//                       />
//                     ) : (
//                       <select
//                         required
//                         value={formData.leave_policy_id}
//                         onChange={(e) =>
//                           handleChange("leave_policy_id", e.target.value)
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       >
//                         <option value="">
//                           {filteredPolicies.length === 0
//                             ? "No policies"
//                             : "Select policy"}
//                         </option>
//                         {filteredPolicies.map((p) => (
//                           <option
//                             key={getPolicyIdFromObj(p)}
//                             value={getPolicyIdFromObj(p)}
//                           >
//                             {getPolicyNameFromObj(p)}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Year
//                     </label>
//                     <select
//                       required
//                       value={formData.year}
//                       onChange={(e) => handleChange("year", e.target.value)}
//                       disabled={!!editId}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50"
//                     >
//                       {YEAR_OPTIONS.map((y) => (
//                         <option key={y} value={y}>
//                           {y}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                   {[
//                     ["total_leaves", "Total", { min: 0 }],
//                     ["leaves_taken", "Taken", { min: 0 }],
//                     ["leaves_pending", "Pending", { min: 0 }],
//                     ["leaves_remaining", "Remaining", {}],
//                     ["carried_forward", "Carried", {}],
//                     ["encashed", "Encashed", { min: 0 }],
//                     ["lapsed", "Lapsed", { min: 0 }],
//                     ["lop_days", "LOP Days", { min: 0 }],
//                   ].map(([key, label, extra]) => (
//                     <div key={key}>
//                       <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
//                         <span>{label}</span>
//                         {key === "leaves_remaining" && (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleChange(
//                                 "leaves_remaining",
//                                 String(suggestedRemaining)
//                               )
//                             }
//                             className="text-xs text-[#E42527] hover:underline"
//                           >
//                             use {suggestedRemaining}
//                           </button>
//                         )}
//                       </label>
//                       <input
//                         type="number"
//                         value={formData[key]}
//                         onChange={(e) => handleChange(key, e.target.value)}
//                         {...extra}
//                         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                       />
//                     </div>
//                   ))}
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
//                   disabled={saving}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? "Saving…" : editId ? "Update" : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* DETAILS MODAL */}
//       {selectedBalance && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                   {selectedBalance.year ?? "—"} leave balance
//                 </p>
//                 <h2 className="mt-1 text-lg font-semibold text-slate-800">
//                   {getTypeName(selectedBalance.leave_type_id)}
//                 </h2>
//               </div>
//               <div className="flex items-center gap-2">
//                 {selectedBalance.is_locked && (
//                   <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
//                     🔒 Locked
//                   </span>
//                 )}
//                 <button
//                   onClick={() => setSelectedBalance(null)}
//                   className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//             <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//                 {[
//                   [
//                     "Employee",
//                     getEmployeeName(selectedBalance.employee_id) ||
//                       selectedBalance.employee_id,
//                   ],
//                   ["Leave Type", getTypeName(selectedBalance.leave_type_id)],
//                   ["Policy", getPolicyName(selectedBalance.leave_policy_id)],
//                   ["Year", selectedBalance.year],
//                   ["Total", selectedBalance.total_leaves],
//                   ["Taken", selectedBalance.leaves_taken],
//                   ["Pending", selectedBalance.leaves_pending],
//                   ["Remaining", selectedBalance.leaves_remaining],
//                   ["Carried Forward", selectedBalance.carried_forward],
//                   ["Encashed", selectedBalance.encashed],
//                   ["Lapsed", selectedBalance.lapsed],
//                   ["LOP Days", selectedBalance.lop_days],
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
//             </div>
//             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 onClick={() => setSelectedBalance(null)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//               {isHrOrAdmin && (
//                 <>
//                   <button
//                     onClick={() => setConfirmDelete(selectedBalance)}
//                     className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => {
//                       const item = selectedBalance;
//                       setSelectedBalance(null);
//                       openEdit(item);
//                     }}
//                     disabled={selectedBalance.is_locked}
//                     className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
//                   >
//                     Edit
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRM */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 Delete leave balance?
//               </h2>
//             </div>
//             <div className="px-5 py-5 text-sm text-slate-600">
//               This will remove the{" "}
//               <span className="font-medium text-slate-800">
//                 {getTypeName(confirmDelete.leave_type_id)}
//               </span>{" "}
//               balance for{" "}
//               <span className="font-medium text-slate-800">
//                 {confirmDelete.year ?? "—"}
//               </span>
//               . Cannot be undone.
//             </div>
//             <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 disabled={saving}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={saving}
//                 className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
//               >
//                 {saving ? "Deleting…" : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* IMPORT MODAL */}
//       <ImportModal
//         open={showImportModal}
//         onClose={() => setShowImportModal(false)}
//         employees={employees}
//         leaveTypes={leaveTypes}
//         year={yearFilter || CURRENT_YEAR}
//         onDone={fetchData}
//       />
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { api } from "@/app/lib/api";
import {
  fetchLeaveTypes,
  getLeaveTypeId,
  getLeaveTypeName,
} from "@/app/lib/leaveTypes";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 3 + i);
const AUTO_DISMISS_MS = 5000;
const HR_ROLES = new Set(["admin", "approle.admin", "hr", "approle.hr"]);

const initialForm = {
  employee_id: "",
  leave_type_id: "",
  leave_policy_id: "",
  year: CURRENT_YEAR,
  total_leaves: 0,
  leaves_taken: 0,
  leaves_pending: 0,
  leaves_remaining: 0,
  carried_forward: 0,
  encashed: 0,
  lapsed: 0,
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatApiError = (err) => {
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
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Network error. Check connection.";
  if (err?.response?.status === 401) return "Session expired.";
  if (err?.response?.status === 403) return "Permission denied.";
  if (err?.response?.status === 405) return "Not supported.";
  return err?.message || "Something went wrong";
};

const isCancel = (err) =>
  err?.name === "CanceledError" ||
  err?.code === "ERR_CANCELED" ||
  err?.name === "AbortError";

const pickList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  return (
    payload.items ??
    payload.results ??
    payload.data ??
    payload.employees ??
    payload.leave_types ??
    payload.policies ??
    []
  );
};

const hasHrAccess = (user) => {
  if (!user) return false;
  const roles = [
    user.role,
    ...(Array.isArray(user.roles) ? user.roles : []),
    ...(Array.isArray(user.user_roles) ? user.user_roles : []),
  ]
    .filter(Boolean)
    .map((r) =>
      String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
        .toLowerCase()
        .trim()
    );
  return roles.some((r) => HR_ROLES.has(r));
};

const pickEmployeeId = (u) =>
  u?.employee_id ||
  u?.employeeId ||
  u?.emp_id ||
  u?.employee?.employee_id ||
  u?.profile?.employee_id ||
  u?.data?.employee_id ||
  "";

const balanceRowKey = (item) =>
  item?.balance_id ?? item?.leave_balance_id ?? item?.id ?? null;

const getPolicyIdFromObj = (p) =>
  p?.leave_policy_id || p?.policy_id || p?.id || "";

const getPolicyNameFromObj = (p) =>
  p?.policy_name ||
  p?.leave_policy_name ||
  getPolicyIdFromObj(p) ||
  "Unnamed Policy";

const getEmployeeDisplayName = (emp) => {
  if (!emp) return "";
  return (
    emp.employee_name ||
    emp.name ||
    emp.full_name ||
    `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
    emp.personal_email ||
    emp.employee_id ||
    ""
  );
};

/* ══════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════ */

function Toast({ type = "info", message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  const styles =
    {
      error: "border-red-200 bg-red-50 text-red-700",
      success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    }[type] || "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles}`}
    >
      <span className="whitespace-pre-line font-medium">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   IMPORT MODAL
   ══════════════════════════════════════════════════════════ */

function ImportModal({
  open,
  onClose,
  employees: employeesProp,
  leaveTypes,
  year,
  onDone,
}) {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [parseError, setParseError] = useState("");
  const [progress, setProgress] = useState(0);
  const [employees, setEmployees] = useState(employeesProp || []);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (employeesProp && employeesProp.length > 0) {
      setEmployees(employeesProp);
      return;
    }
    setLoadingEmployees(true);
    api
      .get("/api/v1/get/employees")
      .then((res) => {
        const list =
          res?.data?.employees ||
          res?.data?.data?.employees ||
          res?.data?.data ||
          [];
        setEmployees(Array.isArray(list) ? list : []);
      })
      .catch(() => setEmployees([]))
      .finally(() => setLoadingEmployees(false));
  }, [open, employeesProp]);

  const normalizeKey = useCallback(
    (s) => String(s || "").toLowerCase().trim().replace(/\s+/g, " "),
    []
  );

  const lookupMap = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => {
      const eid = emp.employee_id;
      if (!eid) return;
      const first = String(emp.first_name || "").trim();
      const last = String(emp.last_name || "").trim();
      const fullName = `${first} ${last}`.trim();
      const reverseName = `${last} ${first}`.trim();
      const keys = [
        emp.personal_email,
        emp.company_email,
        emp.personal_mobile,
        emp.company_mobile,
        fullName,
        reverseName,
        emp.name,
        emp.full_name,
        eid,
      ];
      keys.forEach((k) => {
        const nk = normalizeKey(k);
        if (nk && !map.has(nk)) map.set(nk, emp);
      });
    });
    return map;
  }, [employees, normalizeKey]);

  const ltMap = useMemo(() => {
    const map = new Map();
    leaveTypes.forEach((lt) => {
      const id = getLeaveTypeId(lt);
      const name = normalizeKey(getLeaveTypeName(lt));
      const code = normalizeKey(lt.leave_type_code);
      if (name) map.set(name, lt);
      if (code) map.set(code, lt);
      if (id) map.set(normalizeKey(id), lt);
    });
    return map;
  }, [leaveTypes, normalizeKey]);

  if (!open) return null;

  const handleFile = (f) => {
    setFile(f);
    setRows([]);
    setResult(null);
    setParseError("");
    setProgress(0);
    if (!f) return;

    if (employees.length === 0) {
      setParseError(
        "No employees loaded. Wait for list to load, then upload again."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (json.length === 0) return setParseError("File has no rows");

        const normalized = json.map((r) => {
          const out = {};
          Object.keys(r).forEach((k) => {
            const key = String(k).trim().toLowerCase().replace(/\s+/g, "_");
            out[key] = r[key];
          });
          return out;
        });

        const empKeys = [
          "employee",
          "employee_email",
          "email",
          "employee_name",
          "employee_id",
          "emp_email",
          "name",
        ];
        const empCol = empKeys.find((k) => normalized[0][k] !== undefined);
        if (!empCol)
          return setParseError(
            "Employee column not found. Use: employee or employee_email"
          );

        const ltKeys = [
          "leave_type",
          "leave_type_name",
          "leave_type_code",
          "type",
          "code",
        ];
        const ltCol = ltKeys.find((k) => normalized[0][k] !== undefined);
        if (!ltCol)
          return setParseError("Leave type column not found. Use: leave_type");

        const resolved = normalized.map((r, idx) => {
          const empRaw = String(r[empCol] || "").trim();
          const ltRaw = String(r[ltCol] || "").trim();
          const empKey = normalizeKey(empRaw);
          const ltKey = normalizeKey(ltRaw);

          const emp = lookupMap.get(empKey);
          const lt = ltMap.get(ltKey);

          const total = Number(r.total) || 0;
          const used = Number(r.used) || 0;
          const remaining =
            r.remaining !== "" && r.remaining !== undefined
              ? Number(r.remaining)
              : total - used;

          let error = null;
          if (!empRaw) error = "Employee blank";
          else if (!emp) error = `Employee "${empRaw}" not found`;
          else if (!ltRaw) error = "Leave type blank";
          else if (!lt) error = `Leave type "${ltRaw}" not found`;

          return {
            row: idx + 2,
            raw_employee: empRaw,
            raw_leave_type: ltRaw,
            employee: emp,
            leave_type: lt,
            total,
            used,
            remaining,
            error,
          };
        });

        setRows(resolved);
      } catch (err) {
        setParseError("Excel read failed: " + err.message);
      }
    };
    reader.readAsArrayBuffer(f);
  };

  const runImport = async () => {
    setImporting(true);
    setProgress(0);
    const results = [];
    const validRows = rows.filter((r) => !r.error);

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        const ltId = getLeaveTypeId(row.leave_type);

        // Check existing balance
        const existRes = await api.get(
          `/api/v1/leave/balance/${row.employee.employee_id}`,
          { params: { year: Number(year), page: 1, page_size: 500 } }
        );
        const existingList =
          existRes?.data?.employee_leave_balances ||
          existRes?.data?.data?.employee_leave_balances ||
          [];
        const existing = existingList.find(
          (b) => String(b.leave_type_id) === String(ltId)
        );

        if (existing?.balance_id) {
          // UPDATE — only balance fields
          try {
            await api.put(`/api/v1/leave/balance/${existing.balance_id}`, {
              total_leaves: row.total,
              leaves_taken: row.used,
              leaves_pending: 0,
              leaves_remaining: row.remaining,
              carried_forward: 0,
              encashed: 0,
              lapsed: 0,
            });
            results.push({
              row: row.row,
              status: "updated",
              employee: row.raw_employee,
              leave_type: row.raw_leave_type,
            });
          } catch (updErr) {
            const errDetail = updErr?.response?.data?.detail;
            let msg = "Update failed";
            if (Array.isArray(errDetail)) {
              msg = errDetail
                .map((e) => {
                  const f = Array.isArray(e.loc)
                    ? e.loc.slice(1).join(".")
                    : "";
                  return f ? `${f}: ${e.msg}` : e.msg;
                })
                .join(" | ");
            } else if (typeof errDetail === "string") {
              msg = errDetail;
            } else if (updErr?.message) {
              msg = updErr.message;
            }
            results.push({ row: row.row, status: "failed", message: msg });
          }
        } else {
          // CREATE new balance
          const policiesRes = await api.get("/api/v1/leave/policies", {
            params: { page: 1, page_size: 500 },
          });
          const policies =
            policiesRes?.data?.policies ||
            policiesRes?.data?.data?.policies ||
            [];
          const policy = policies.find(
            (p) =>
              String(p.leave_type_id) === String(ltId) && p.is_active !== false
          );

          if (!policy) {
            results.push({
              row: row.row,
              status: "failed",
              message: `No active policy for "${row.raw_leave_type}"`,
            });
            setProgress(i + 1);
            continue;
          }

          try {
            await api.post("/api/v1/leave/balance", {
              employee_id: row.employee.employee_id,
              leave_type_id: ltId,
              leave_policy_id: getPolicyIdFromObj(policy),
              year: Number(year),
              total_leaves: row.total,
              leaves_taken: row.used,
              leaves_pending: 0,
              leaves_remaining: row.remaining,
              carried_forward: 0,
              encashed: 0,
              lapsed: 0,
            });
            results.push({
              row: row.row,
              status: "created",
              employee: row.raw_employee,
              leave_type: row.raw_leave_type,
            });
          } catch (createErr) {
            const errDetail = createErr?.response?.data?.detail;
            let msg = "Create failed";
            if (Array.isArray(errDetail)) {
              msg = errDetail
                .map((e) => {
                  const f = Array.isArray(e.loc)
                    ? e.loc.slice(1).join(".")
                    : "";
                  return f ? `${f}: ${e.msg}` : e.msg;
                })
                .join(" | ");
            } else if (typeof errDetail === "string") {
              msg = errDetail;
            } else if (createErr?.message) {
              msg = createErr.message;
            }
            results.push({ row: row.row, status: "failed", message: msg });
          }
        }
      } catch (err) {
        const errDetail = err?.response?.data?.detail;
        let msg = "Unknown error";
        if (Array.isArray(errDetail)) {
          msg = errDetail
            .map((e) => {
              const f = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
              return f ? `${f}: ${e.msg}` : e.msg;
            })
            .join(" | ");
        } else if (typeof errDetail === "string") {
          msg = errDetail;
        } else if (err?.message) {
          msg = err.message;
        }
        results.push({
          row: row.row,
          status: "failed",
          message: String(msg).slice(0, 300),
        });
      }
      setProgress(i + 1);
    }

    rows
      .filter((r) => r.error)
      .forEach((r) => {
        results.push({
          row: r.row,
          status: "skipped",
          message: r.error,
        });
      });

    setResult(results);
    setImporting(false);
    if (onDone) onDone();
  };

  const reset = () => {
    setFile(null);
    setRows([]);
    setResult(null);
    setParseError("");
    setProgress(0);
  };

  const close = () => {
    if (importing) return;
    reset();
    onClose();
  };

  const downloadTemplate = () => {
    try {
      const ws = XLSX.utils.aoa_to_sheet([
        ["employee", "leave_type", "total", "used", "remaining"],
        ["rahul@company.com", "Casual Leave", 12, 3, 9],
        ["priya@company.com", "Sick Leave", 8, 0, 8],
        ["EMP003", "Earned Leave", 15, 0, 15],
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "leave-balance-template.xlsx");
    } catch (err) {
      console.error("Template download failed:", err);
    }
  };

  const validRows = rows.filter((r) => !r.error).length;
  const errorRows = rows.filter((r) => r.error).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
      <div className="mb-10 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Import Leave Balances
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {loadingEmployees
                ? "Loading employees…"
                : `${employees.length} employees loaded`}
            </p>
          </div>
          <button
            onClick={close}
            disabled={importing}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-sky-900">
                  Step 1: Download template
                </p>
                <p className="mt-0.5 text-xs text-sky-700">
                  Columns:{" "}
                  <code>employee | leave_type | total | used | remaining</code>
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="shrink-0 rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-50"
              >
                Download
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Step 2: Upload File
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={importing || loadingEmployees}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#E42527] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#c91f21] disabled:opacity-50"
            />
          </div>

          {parseError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {parseError}
            </div>
          )}

          {rows.length > 0 && !result && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">
                  Preview ({rows.length} rows)
                </p>
                <div className="flex gap-3 text-xs">
                  <span className="text-emerald-700">Valid: {validRows}</span>
                  {errorRows > 0 && (
                    <span className="text-red-700">Errors: {errorRows}</span>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-2 py-2 text-left">Row</th>
                      <th className="px-2 py-2 text-left">Employee</th>
                      <th className="px-2 py-2 text-left">Leave Type</th>
                      <th className="px-2 py-2 text-right">Total</th>
                      <th className="px-2 py-2 text-right">Used</th>
                      <th className="px-2 py-2 text-right">Rem</th>
                      <th className="px-2 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((r) => (
                      <tr key={r.row} className={r.error ? "bg-red-50" : ""}>
                        <td className="px-2 py-1.5 font-medium text-slate-500">
                          {r.row}
                        </td>
                        <td className="px-2 py-1.5">
                          {r.employee ? (
                            <span className="text-slate-700">
                              {getEmployeeDisplayName(r.employee)}
                            </span>
                          ) : (
                            <span className="text-red-600">
                              {String(r.raw_employee)}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-1.5">
                          {r.leave_type ? (
                            <span className="text-slate-700">
                              {getLeaveTypeName(r.leave_type)}
                            </span>
                          ) : (
                            <span className="text-red-600">
                              {String(r.raw_leave_type)}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums">
                          {r.total}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums">
                          {r.used}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums">
                          {r.remaining}
                        </td>
                        <td className="px-2 py-1.5">
                          {r.error ? (
                            <span className="text-red-600">{r.error}</span>
                          ) : (
                            <span className="text-emerald-600">Ready</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {importing && (
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
              <p className="text-sm font-semibold text-sky-900">
                Importing… {progress}/{validRows}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sky-100">
                <div
                  className="h-full bg-sky-500 transition-all"
                  style={{
                    width: `${validRows ? (progress / validRows) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-emerald-50 px-3 py-2">
                  <p className="text-[10px] uppercase text-emerald-700">
                    Created
                  </p>
                  <p className="text-xl font-bold text-emerald-700 tabular-nums">
                    {result.filter((r) => r.status === "created").length}
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50 px-3 py-2">
                  <p className="text-[10px] uppercase text-sky-700">Updated</p>
                  <p className="text-xl font-bold text-sky-700 tabular-nums">
                    {result.filter((r) => r.status === "updated").length}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 px-3 py-2">
                  <p className="text-[10px] uppercase text-red-700">
                    Failed / Skipped
                  </p>
                  <p className="text-xl font-bold text-red-700 tabular-nums">
                    {
                      result.filter(
                        (r) =>
                          r.status === "failed" || r.status === "skipped"
                      ).length
                    }
                  </p>
                </div>
              </div>

              {result.some(
                (r) => r.status === "failed" || r.status === "skipped"
              ) && (
                <div className="max-h-60 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-800">Issues:</p>
                  <div className="mt-1 space-y-0.5 text-xs text-red-700">
                    {result
                      .filter(
                        (r) =>
                          r.status === "failed" || r.status === "skipped"
                      )
                      .map((r, i) => (
                        <div key={i}>
                          Row {r.row}: {r.message}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
          <button
            onClick={result ? reset : close}
            disabled={importing}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            {result ? "Import Another" : "Cancel"}
          </button>
          <button
            onClick={runImport}
            disabled={importing || validRows === 0 || !!result}
            className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
          >
            {importing
              ? `Importing ${progress}/${validRows}…`
              : `Import ${validRows} Row(s)`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function EmployeeLeaveBalancePage() {
  const user = useAuthStore((state) => state.user);
  const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

  const [list, setList] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState(String(CURRENT_YEAR));
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [resolvedEmployeeId, setResolvedEmployeeId] = useState("");
  const [resolvedEmployeeName, setResolvedEmployeeName] = useState("");
  const [selectedBalance, setSelectedBalance] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [exporting, setExporting] = useState(false);

  const abortRef = useRef(null);
  const employeeFromUser = useMemo(() => pickEmployeeId(user), [user]);
  const employeeId = employeeFromUser || resolvedEmployeeId;
  const isSelfView = Boolean(employeeFromUser) && !isHrOrAdmin;

  /* Resolve employee id */
  useEffect(() => {
    if (employeeFromUser) return;
    const userId = user?.user_id || user?.userId || user?.id || user?.sub;
    if (!userId) return;
    let cancelled = false;
    api
      .get("/api/v1/get/employees")
      .then((response) => {
        if (cancelled) return;
        const list = pickList(response?.data?.data ?? response?.data);
        const employee = list.find(
          (item) =>
            String(item.user_id ?? item.userId ?? "") === String(userId)
        );
        setResolvedEmployeeId(
          employee?.employee_id || employee?.emp_id || employee?.id || ""
        );
        setResolvedEmployeeName(getEmployeeDisplayName(employee));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [employeeFromUser, user]);

  /* Load leave types */
  useEffect(() => {
    let cancelled = false;
    fetchLeaveTypes()
      .then((types) => {
        if (!cancelled) setLeaveTypes(Array.isArray(types) ? types : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  /* Load policies */
  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/v1/leave/policies", { params: { page: 1, page_size: 500 } })
      .then((res) => {
        if (cancelled) return;
        setPolicies(pickList(res?.data?.data ?? res?.data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  /* Load employees */
  useEffect(() => {
    if (!isHrOrAdmin) return;
    let cancelled = false;
    api
      .get("/api/v1/get/employees")
      .then((res) => {
        if (cancelled) return;
        setEmployees(pickList(res?.data?.data ?? res?.data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isHrOrAdmin]);

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* Auto-dismiss success */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [success]);

  /* Fetch balances */
  const fetchData = useCallback(async () => {
    if (!employeeId) {
      setList([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/v1/leave/balance/${employeeId}`, {
        params: {
          page,
          page_size: pageSize,
          ...(search ? { search } : {}),
          ...(yearFilter ? { year: yearFilter } : {}),
        },
        signal: controller.signal,
      });
      const payload = res.data?.data ?? res.data ?? {};
      const items = Array.isArray(payload)
        ? payload
        : payload?.employee_leave_balances ??
          payload?.leave_balances ??
          pickList(payload);
      setList(Array.isArray(items) ? items : []);
      setTotal(res.data?.total ?? payload?.total ?? items.length);
    } catch (err) {
      if (isCancel(err)) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [employeeId, page, pageSize, search, yearFilter]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData]);

  /* Derived */
  const suggestedRemaining = useMemo(() => {
    const t = toNumber(formData.total_leaves);
    return Math.max(
      t - toNumber(formData.leaves_taken) - toNumber(formData.leaves_pending),
      0
    );
  }, [formData]);

  const filteredPolicies = useMemo(() => {
    let pool = policies.filter((p) => p.is_active !== false);
    if (formData.leave_type_id) {
      pool = pool.filter(
        (p) => String(p.leave_type_id || "") === String(formData.leave_type_id)
      );
    }
    return pool;
  }, [policies, formData.leave_type_id]);

  const employeeNameMap = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      const id = emp.employee_id || emp.emp_id || emp.id;
      if (id) map[String(id)] = getEmployeeDisplayName(emp);
    });
    return map;
  }, [employees]);

  const getEmployeeName = useCallback(
    (empId) => employeeNameMap[String(empId)] || "",
    [employeeNameMap]
  );

  const getTypeName = useCallback(
    (leaveTypeId) => {
      const found = leaveTypes.find(
        (t) => String(getLeaveTypeId(t)) === String(leaveTypeId)
      );
      if (found) return getLeaveTypeName(found);
      if (!leaveTypeId) return "—";
      const s = String(leaveTypeId);
      return s.length > 12 ? `${s.slice(0, 8)}…` : s;
    },
    [leaveTypes]
  );

  const getPolicyName = useCallback(
    (policyId) => {
      const found = policies.find(
        (p) => String(getPolicyIdFromObj(p)) === String(policyId)
      );
      if (found) return getPolicyNameFromObj(found);
      if (!policyId) return "—";
      const s = String(policyId);
      return s.length > 12 ? `${s.slice(0, 8)}…` : s;
    },
    [policies]
  );

  /* Handlers */
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => {
    setEditId(null);
    setFormData({ ...initialForm, employee_id: employeeId });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(balanceRowKey(item));
    setFormData({
      ...initialForm,
      employee_id: item.employee_id || employeeId,
      leave_type_id: item.leave_type_id || "",
      leave_policy_id: item.leave_policy_id || "",
      year: item.year ?? CURRENT_YEAR,
      total_leaves: item.total_leaves ?? 0,
      leaves_taken: item.leaves_taken ?? 0,
      leaves_pending: item.leaves_pending ?? 0,
      leaves_remaining: item.leaves_remaining ?? 0,
      carried_forward: item.carried_forward ?? 0,
      encashed: item.encashed ?? 0,
      lapsed: item.lapsed ?? 0,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setError("");
    setEditId(null);
    setFormData({ ...initialForm, employee_id: employeeId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!editId) {
      if (!formData.employee_id) return setError("Employee required");
      if (!formData.leave_type_id) return setError("Leave Type required");
      if (!formData.leave_policy_id) return setError("Policy required");
    }
    const year = toNumber(formData.year);
    if (year < 2000 || year > CURRENT_YEAR + 5) {
      setError(`Year must be between 2000 and ${CURRENT_YEAR + 5}`);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (editId) {
        await api.put(`/api/v1/leave/balance/${editId}`, {
          total_leaves: toNumber(formData.total_leaves),
          leaves_taken: toNumber(formData.leaves_taken),
          leaves_pending: toNumber(formData.leaves_pending),
          leaves_remaining: toNumber(
            formData.leaves_remaining,
            suggestedRemaining
          ),
          carried_forward: toNumber(formData.carried_forward),
          encashed: toNumber(formData.encashed),
          lapsed: toNumber(formData.lapsed),
        });
        setSuccess("Balance updated");
      } else {
        await api.post("/api/v1/leave/balance", {
          employee_id: formData.employee_id,
          leave_type_id: formData.leave_type_id,
          leave_policy_id: formData.leave_policy_id,
          year,
          total_leaves: toNumber(formData.total_leaves),
          leaves_taken: toNumber(formData.leaves_taken),
          leaves_pending: toNumber(formData.leaves_pending),
          leaves_remaining: toNumber(
            formData.leaves_remaining,
            suggestedRemaining
          ),
          carried_forward: toNumber(formData.carried_forward),
          encashed: toNumber(formData.encashed),
          lapsed: toNumber(formData.lapsed),
        });
        setSuccess("Balance created");
      }
      setShowForm(false);
      setFormData({ ...initialForm, employee_id: employeeId });
      setEditId(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  /* Export — role-based */
  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      const params = {};
      if (yearFilter) params.year = yearFilter;

      if (!isHrOrAdmin && employeeId) {
        params.employee_id = employeeId;
      }

      const res = await api.get("/api/v1/leave/balance/export-excel", {
        params,
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `leave-balances-${yearFilter || "all"}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccess("Excel exported successfully");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setExporting(false);
    }
  };

  /* Delete */
  const handleDelete = async () => {
    const item = confirmDelete;
    if (!item) return;
    const id = balanceRowKey(item);
    if (!id) {
      setConfirmDelete(null);
      setError("Missing balance id");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.delete(`/api/v1/leave/balance/${id}`);
      setConfirmDelete(null);
      setSelectedBalance(null);
      setSuccess("Balance deleted");
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
      setConfirmDelete(null);
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            {isHrOrAdmin ? "Employee Leave Balance" : "My Leave Balance"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {resolvedEmployeeName
              ? `Viewing balances for ${resolvedEmployeeName}.`
              : "Auto-assigned from policies."}{" "}
            Showing <strong>{yearFilter || "all years"}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || list.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "📤 Export Excel"}
          </button>

          {isHrOrAdmin && (
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              📥 Import Excel
            </button>
          )}

          {isHrOrAdmin && (
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
            >
              + Add Balance
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search…"
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
            />
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
            >
              <option value="">All years</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                  {y === CURRENT_YEAR ? " (Current)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{total} records</span>
            <button
              type="button"
              onClick={fetchData}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="px-4 pt-3">
          <Toast type="error" message={error} onDismiss={() => setError("")} />
          <Toast
            type="success"
            message={success}
            onDismiss={() => setSuccess("")}
          />
        </div>

        {!employeeId && !loading && (
          <div className="py-16 text-center text-sm text-slate-500">
            Employee not linked. Contact HR.
          </div>
        )}

        {!loading && employeeId && list.length > 0 && (
          <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((item, index) => {
              const empName = getEmployeeName(item.employee_id);
              return (
                <button
                  type="button"
                  key={balanceRowKey(item) || index}
                  onClick={() => setSelectedBalance(item)}
                  className="group relative rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E42527]/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {item.year ?? "—"} balance
                      </p>
                      <h3 className="mt-1 truncate text-base font-semibold text-slate-800">
                        {getTypeName(item.leave_type_id)}
                      </h3>
                      {isHrOrAdmin && empName && (
                        <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                          {empName}
                        </p>
                      )}
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {getPolicyName(item.leave_policy_id)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {item.leaves_remaining ?? 0} left
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="mt-0.5 font-semibold text-slate-700 tabular-nums">
                        {item.total_leaves ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Taken</p>
                      <p className="mt-0.5 font-semibold text-slate-700 tabular-nums">
                        {item.leaves_taken ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Pending</p>
                      <p className="mt-0.5 font-semibold text-slate-700 tabular-nums">
                        {item.leaves_pending ?? 0}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500">
            Loading…
          </div>
        ) : employeeId && list.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-slate-500">
            <p className="font-medium text-slate-700">
              No balances for {yearFilter || "any year"}
            </p>
            <p className="mt-2">Try different year or contact HR.</p>
          </div>
        ) : null}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editId ? "Edit Balance" : "Add Balance"}
              </h2>
              <button
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Employee{" "}
                      {!editId && <span className="text-red-600">*</span>}
                    </label>
                    {isHrOrAdmin && !editId && employees.length > 0 ? (
                      <select
                        required
                        value={formData.employee_id || employeeId}
                        onChange={(e) =>
                          handleChange("employee_id", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        <option value="">Select employee</option>
                        {employees.map((emp) => {
                          const eid = emp.employee_id || emp.emp_id || emp.id;
                          return (
                            <option key={eid} value={eid}>
                              {getEmployeeDisplayName(emp)} ({eid})
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <input
                        required={!editId}
                        value={formData.employee_id || employeeId}
                        onChange={(e) =>
                          handleChange("employee_id", e.target.value)
                        }
                        disabled={editId || isSelfView}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50"
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Type{" "}
                      {!editId && <span className="text-red-600">*</span>}
                    </label>
                    {editId ? (
                      <input
                        value={getTypeName(formData.leave_type_id)}
                        disabled
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50"
                      />
                    ) : (
                      <select
                        required
                        value={formData.leave_type_id}
                        onChange={(e) => {
                          handleChange("leave_type_id", e.target.value);
                          handleChange("leave_policy_id", "");
                        }}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        <option value="">
                          {leaveTypes.length === 0 ? "No types" : "Select type"}
                        </option>
                        {leaveTypes.map((lt) => (
                          <option
                            key={getLeaveTypeId(lt)}
                            value={getLeaveTypeId(lt)}
                          >
                            {getLeaveTypeName(lt)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Policy {!editId && <span className="text-red-600">*</span>}
                    </label>
                    {editId ? (
                      <input
                        value={getPolicyName(formData.leave_policy_id)}
                        disabled
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50"
                      />
                    ) : (
                      <select
                        required
                        value={formData.leave_policy_id}
                        onChange={(e) =>
                          handleChange("leave_policy_id", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      >
                        <option value="">
                          {filteredPolicies.length === 0
                            ? "No policies"
                            : "Select policy"}
                        </option>
                        {filteredPolicies.map((p) => (
                          <option
                            key={getPolicyIdFromObj(p)}
                            value={getPolicyIdFromObj(p)}
                          >
                            {getPolicyNameFromObj(p)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Year
                    </label>
                    <select
                      required
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      disabled={!!editId}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] disabled:bg-slate-50"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    ["total_leaves", "Total", { min: 0 }],
                    ["leaves_taken", "Taken", { min: 0 }],
                    ["leaves_pending", "Pending", { min: 0 }],
                    ["leaves_remaining", "Remaining", {}],
                    ["carried_forward", "Carried", {}],
                    ["encashed", "Encashed", { min: 0 }],
                    ["lapsed", "Lapsed", { min: 0 }],
                  ].map(([key, label, extra]) => (
                    <div key={key}>
                      <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
                        <span>{label}</span>
                        {key === "leaves_remaining" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleChange(
                                "leaves_remaining",
                                String(suggestedRemaining)
                              )
                            }
                            className="text-xs text-[#E42527] hover:underline"
                          >
                            use {suggestedRemaining}
                          </button>
                        )}
                      </label>
                      <input
                        type="number"
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        {...extra}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                      />
                    </div>
                  ))}
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
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedBalance && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {selectedBalance.year ?? "—"} leave balance
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  {getTypeName(selectedBalance.leave_type_id)}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBalance(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  [
                    "Employee",
                    getEmployeeName(selectedBalance.employee_id) ||
                      selectedBalance.employee_id,
                  ],
                  ["Leave Type", getTypeName(selectedBalance.leave_type_id)],
                  ["Policy", getPolicyName(selectedBalance.leave_policy_id)],
                  ["Year", selectedBalance.year],
                  ["Total", selectedBalance.total_leaves],
                  ["Taken", selectedBalance.leaves_taken],
                  ["Pending", selectedBalance.leaves_pending],
                  ["Remaining", selectedBalance.leaves_remaining],
                  ["Carried Forward", selectedBalance.carried_forward],
                  ["Encashed", selectedBalance.encashed],
                  ["Lapsed", selectedBalance.lapsed],
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
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                onClick={() => setSelectedBalance(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {isHrOrAdmin && (
                <>
                  <button
                    onClick={() => setConfirmDelete(selectedBalance)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      const item = selectedBalance;
                      setSelectedBalance(null);
                      openEdit(item);
                    }}
                    className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Delete leave balance?
              </h2>
            </div>
            <div className="px-5 py-5 text-sm text-slate-600">
              This will remove the{" "}
              <span className="font-medium text-slate-800">
                {getTypeName(confirmDelete.leave_type_id)}
              </span>{" "}
              balance for{" "}
              <span className="font-medium text-slate-800">
                {confirmDelete.year ?? "—"}
              </span>
              . Cannot be undone.
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      <ImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        employees={employees}
        leaveTypes={leaveTypes}
        year={yearFilter || CURRENT_YEAR}
        onDone={fetchData}
      />
    </div>
  );
}