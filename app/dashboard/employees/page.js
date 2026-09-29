


// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";

// /* ============================================================
//    CONSTANTS
// ============================================================ */

// const AUTO_DISMISS_MS = 4500;
// const PAGE_SIZE = 10;
// const DEBOUNCE_MS = 400;

// const EMPLOYEE_STATUSES = [
//   { value: "active", label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
//   { value: "probation", label: "Probation", color: "bg-amber-50 text-amber-700 border-amber-200" },
//   { value: "notice_period", label: "Notice Period", color: "bg-orange-50 text-orange-700 border-orange-200" },
//   { value: "on_leave", label: "On Leave", color: "bg-blue-50 text-blue-700 border-blue-200" },
//   { value: "suspended", label: "Suspended", color: "bg-red-50 text-red-700 border-red-200" },
//   { value: "resigned", label: "Resigned", color: "bg-slate-100 text-slate-600 border-slate-200" },
//   { value: "terminated", label: "Terminated", color: "bg-red-100 text-red-800 border-red-300" },
// ];

// const STATUS_MAP = Object.fromEntries(EMPLOYEE_STATUSES.map((s) => [s.value, s]));

// /* ✅ CLEAN TEMPLATE — Sirf names, koi ID nahi */
// const CSV_HEADERS = [
//   "first_name",
//   "last_name",
//   "company_email",
//   "company_mobile",
//   "personal_email",
//   "personal_mobile",
//   "password",
//   "department_name",
//   "designation_name",
//   "location_name",
//   "employment_type_name",
//   "reporting_manager",
//   "joining_date",
//   "company_role",
//   "company_landline",
//   "date_of_leaving",
//   "dob",
//   "gender",
//   "blood_group",
//   "martial_status",
//   "emergency_contact_number",
//   "current_experience",
//   "total_experience",
//   "current_address",
//   "permanent_address",
//   "aadhaar_number",
//   "pan_number",
//   "about_me",
//   "employee_status",
// ];

// const CSV_SAMPLE_ROWS = [
//   [
//     "Rahul", "Sharma",
//     "rahul.sharma@company.com", "9876543211",
//     "rahul.sharma@gmail.com", "9876543210",
//     "Welcome@123",
//     "Engineering",
//     "Software Engineer",
//     "Mumbai",
//     "Full Time",
//     "",
//     "2025-01-15",
//     "Team Lead", "",
//     "",
//     "1995-03-20", "male", "B+", "single",
//     "9876501234",
//     "3.5", "5.0",
//     "123, Sector 18, Noida", "Village XYZ, UP",
//     "123456789012", "ABCDE1234F", "Full stack developer",
//     "active",
//   ],
//   [
//     "Priya", "Patel",
//     "priya.patel@company.com", "9988776656",
//     "priya.patel@gmail.com", "9988776655",
//     "Welcome@123",
//     "Human Resources",
//     "HR Executive",
//     "Delhi",
//     "Full Time",
//     "",
//     "2025-02-01",
//     "HR Executive", "",
//     "",
//     "1998-11-05", "female", "O+", "married",
//     "9123456789",
//     "1.2", "1.2",
//     "Flat 402, Andheri West, Mumbai", "",
//     "", "FGHIJ5678K", "",
//     "active",
//   ],
// ];

// /* ============================================================
//    HELPERS
// ============================================================ */

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail.map((e) => {
//       const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
//       return field ? `${field}: ${e.msg}` : e.msg;
//     }).join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   if (detail && typeof detail === "object") return JSON.stringify(detail);
//   return err?.message || "Something went wrong";
// };

// const formatDate = (date) => {
//   if (!date) return "—";
//   try {
//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });
//   } catch { return date; }
// };

// const getInitials = (emp) => {
//   const first = emp.first_name?.[0] || emp.name?.[0] || "E";
//   const last = emp.last_name?.[0] || "";
//   return (first + last).toUpperCase();
// };

// const getStatusBadge = (status) => {
//   const s = STATUS_MAP[(status || "active").toLowerCase()];
//   return s?.color || "bg-slate-100 text-slate-600 border-slate-200";
// };

// const extractArray = (res) => {
//   const d = res?.data;
//   if (Array.isArray(d)) return d;
//   if (Array.isArray(d?.data)) return d.data;
//   if (Array.isArray(d?.departments)) return d.departments;
//   if (Array.isArray(d?.designations)) return d.designations;
//   if (Array.isArray(d?.locations)) return d.locations;
//   if (Array.isArray(d?.items)) return d.items;
//   if (Array.isArray(d?.employment_types)) return d.employment_types;
//   return [];
// };

// const parseCsvLine = (line) => {
//   const values = [];
//   let value = "";
//   let quoted = false;
//   for (let i = 0; i < line.length; i++) {
//     const ch = line[i];
//     const next = line[i + 1];
//     if (ch === '"' && quoted && next === '"') { value += '"'; i++; }
//     else if (ch === '"') quoted = !quoted;
//     else if (ch === "," && !quoted) { values.push(value.trim()); value = ""; }
//     else value += ch;
//   }
//   values.push(value.trim());
//   return values;
// };

// /* ✅ Date Normalizer: DD-MM-YYYY → YYYY-MM-DD */
// const normalizeDate = (val) => {
//   const s = (val || "").toString().trim();
//   if (!s) return null;
//   if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
//   const m1 = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
//   if (m1) {
//     const [, dd, mm, yyyy] = m1;
//     return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
//   }
//   return null;
// };

// /* ✅ Number Normalizer: Scientific notation → integer string */
// const normalizeNumber = (val) => {
//   const s = (val || "").toString().trim();
//   if (!s) return null;
//   if (/[eE]/.test(s)) {
//     const n = Number(s);
//     if (!Number.isFinite(n)) return null;
//     return n.toFixed(0);
//   }
//   if (s.includes(".") && /^\d+\.\d+$/.test(s)) {
//     const n = Number(s);
//     if (Number.isInteger(n)) return n.toFixed(0);
//   }
//   return s;
// };

// /* ✅ Strip extra quotes */
// const cleanCell = (val) => {
//   let s = (val ?? "").toString().trim();
//   if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) s = s.slice(1, -1);
//   if (s.startsWith("'") && s.endsWith("'") && s.length >= 2) s = s.slice(1, -1);
//   s = s.replace(/""/g, '"');
//   return s.trim();
// };

// /* ============================================================
//    SUBCOMPONENTS
// ============================================================ */

// function Notification({ type, message, onDismiss }) {
//   if (!message) return null;
//   const styles = type === "error"
//     ? "border-red-200 bg-red-50 text-red-700"
//     : "border-green-200 bg-green-50 text-green-700";
//   return (
//     <div className={`mb-4 flex items-start justify-between rounded-xl border px-4 py-3 text-sm ${styles}`}>
//       <span className="whitespace-pre-line">{message}</span>
//       <button onClick={onDismiss} className="ml-3 opacity-60 hover:opacity-100">✕</button>
//     </div>
//   );
// }

// function SkeletonRow() {
//   return (
//     <tr className="animate-pulse">
//       {Array.from({ length: 7 }).map((_, i) => (
//         <td key={i} className="px-4 py-3"><div className="h-4 rounded bg-slate-200" /></td>
//       ))}
//     </tr>
//   );
// }

// function Pagination({ page, pageSize, total, onPageChange }) {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   if (total <= pageSize) return null;
//   const from = (page - 1) * pageSize + 1;
//   const to = Math.min(page * pageSize, total);
//   return (
//     <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3.5 sm:flex-row">
//       <p className="text-xs text-slate-500">
//         Showing <span className="font-medium text-slate-700">{from}</span>–
//         <span className="font-medium text-slate-700">{to}</span> of{" "}
//         <span className="font-medium text-slate-700">{total}</span>
//       </p>
//       <div className="flex items-center gap-1">
//         <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
//           className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">
//           Prev
//         </button>
//         <span className="px-3 text-xs text-slate-500">
//           Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
//         </span>
//         <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
//           className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// function DetailItem({ label, value }) {
//   return (
//     <div>
//       <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
//       <p className="mt-0.5 text-sm text-slate-800">{value || "—"}</p>
//     </div>
//   );
// }

// function HierarchyNode({ node, level = 0 }) {
//   const [expanded, setExpanded] = useState(true);
//   const hasChildren = node.reports && node.reports.length > 0;
//   const initials = (node.name || "E").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

//   return (
//     <div className="relative">
//       {level > 0 && (
//         <>
//           <div className="absolute left-[-20px] top-0 h-full w-px bg-slate-200" />
//           <div className="absolute left-[-20px] top-[28px] h-px w-5 bg-slate-200" />
//         </>
//       )}
//       <div className="relative flex items-start gap-3 pb-4">
//         <div className="group flex min-w-[300px] max-w-[340px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-red-400/40 hover:shadow-md">
//           <div className="relative shrink-0">
//             <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-sm font-semibold text-white shadow-sm">
//               {initials}
//             </div>
//             {hasChildren && (
//               <button type="button" onClick={() => setExpanded(!expanded)}
//                 className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 shadow-sm hover:bg-slate-200">
//                 <svg className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`}
//                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             )}
//           </div>
//           <div className="min-w-0 flex-1">
//             <p className="truncate text-sm font-semibold text-slate-800">{node.name || "—"}</p>
//             <p className="truncate text-xs text-slate-500">{node.designation || "No designation"}</p>
//             <div className="mt-1.5 flex items-center gap-2">
//               <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusBadge(node.employee_status)}`}>
//                 {node.employee_status || "active"}
//               </span>
//               {hasChildren && (
//                 <span className="text-[10px] text-slate-400">
//                   {node.reports.length} report{node.reports.length !== 1 ? "s" : ""}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {hasChildren && expanded && (
//         <div className="ml-10 space-y-0 border-l border-slate-200 pl-5">
//           {node.reports.map((child) => (
//             <HierarchyNode key={child.employee_id || child.user_id} node={child} level={level + 1} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// const initialEmployee = {
//   first_name: "", last_name: "", company_email: "", personal_email: "",
//   personal_mobile: "", company_mobile: "", department_id: "", designation_id: "",
//   location_id: "", reporting_manager: "", employment_type_id: "", joining_date: "",
//   dob: "", gender: "", blood_group: "", martial_status: "", company_role: "",
//   current_address: "", permanent_address: "", emergency_contact_number: "",
//   aadhaar_number: "", pan_number: "", current_experience: "", total_experience: "",
//   about_me: "", employee_status: "active", password: "", company_landline: "",
//   date_of_leaving: "", resignation_date: "",
// };

// const inputCls =
//   "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

// /* ============================================================
//    MAIN PAGE
// ============================================================ */

// export default function EmployeesPage() {
//   const [employees, setEmployees] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const [employeeData, setEmployeeData] = useState(initialEmployee);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewEmployee, setViewEmployee] = useState(null);
//   const [editingEmployeeId, setEditingEmployeeId] = useState(null);
//   const [activeTab, setActiveTab] = useState("basic");

//   const [employmentTypes, setEmploymentTypes] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [loadingMasters, setLoadingMasters] = useState(false);

//   const [showHierarchy, setShowHierarchy] = useState(false);
//   const [hierarchyData, setHierarchyData] = useState(null);
//   const [hierarchyLoading, setHierarchyLoading] = useState(false);

//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [bulkFile, setBulkFile] = useState(null);
//   const [bulkFileName, setBulkFileName] = useState("");
//   const [bulkRows, setBulkRows] = useState([]);
//   const [bulkPreview, setBulkPreview] = useState([]);
//   const [bulkSaving, setBulkSaving] = useState(false);
//   const [bulkResult, setBulkResult] = useState(null);
//   const [bulkError, setBulkError] = useState("");

//   const reqIdRef = useRef(0);

//   useEffect(() => {
//     if (!error && !success) return;
//     const t = setTimeout(() => { setError(""); setSuccess(""); }, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [error, success]);

//   const fetchEmployees = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/get/employees");
//       if (myReqId !== reqIdRef.current) return;
//       const d = res?.data;
//       let list = [];
//       if (Array.isArray(d?.employees)) list = d.employees;
//       else if (Array.isArray(d?.data)) list = d.data;
//       else if (Array.isArray(d)) list = d;
//       setEmployees(list);
//       setTotal(list.length);
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setEmployees([]);
//       setTotal(0);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   const fetchHierarchy = async () => {
//     setHierarchyLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/get/reporting/hierarchy");
//       setHierarchyData(res?.data || null);
//       setShowHierarchy(true);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setHierarchyLoading(false);
//     }
//   };

//   const loadMasters = useCallback(async () => {
//     setLoadingMasters(true);
//     try {
//       const [etRes, deptRes, desigRes, locRes] = await Promise.all([
//         api.get("/api/v1/get/employment/type/list"),
//         api.get("/api/v1/get/departments"),
//         api.get("/api/v1/get/designations"),
//         api.get("/api/v1/get/location/master"),
//       ]);
//       setEmploymentTypes(extractArray(etRes));
//       setDepartments(extractArray(deptRes));
//       setDesignations(extractArray(desigRes));
//       setLocations(extractArray(locRes));
//     } catch {
//       setEmploymentTypes([]);
//       setDepartments([]);
//       setDesignations([]);
//       setLocations([]);
//     } finally {
//       setLoadingMasters(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (showAddForm || showEditForm) void loadMasters();
//   }, [showAddForm, showEditForm, loadMasters]);

//   const handleChange = (field, value) => {
//     setEmployeeData((prev) => ({ ...prev, [field]: value }));
//   };

//   const managerOptions = useMemo(() => {
//     return (Array.isArray(employees) ? employees : [])
//       .filter((e) => e.employee_id)
//       .map((e) => ({
//         employee_id: e.employee_id,
//         name: e.first_name
//           ? `${e.first_name} ${e.last_name || ""}`.trim()
//           : e.name || e.employee_id,
//       }));
//   }, [employees]);

//   const buildPayload = () => ({
//     first_name: employeeData.first_name || null,
//     last_name: employeeData.last_name || null,
//     company_email: employeeData.company_email || null,
//     personal_email: employeeData.personal_email || null,
//     personal_mobile: employeeData.personal_mobile || null,
//     company_mobile: employeeData.company_mobile || null,
//     department_id: employeeData.department_id || null,
//     designation_id: employeeData.designation_id || null,
//     location_id: employeeData.location_id || null,
//     reporting_manager: employeeData.reporting_manager || null,
//     employment_type_id: employeeData.employment_type_id || null,
//     joining_date: employeeData.joining_date || null,
//     date_of_leaving: employeeData.date_of_leaving || null,
//     resignation_date: employeeData.resignation_date || null,
//     dob: employeeData.dob || null,
//     gender: employeeData.gender || null,
//     blood_group: employeeData.blood_group || null,
//     martial_status: employeeData.martial_status || null,
//     company_role: employeeData.company_role || null,
//     current_address: employeeData.current_address || null,
//     permanent_address: employeeData.permanent_address || null,
//     emergency_contact_number: employeeData.emergency_contact_number || null,
//     aadhaar_number: employeeData.aadhaar_number || null,
//     pan_number: employeeData.pan_number || null,
//     about_me: employeeData.about_me || null,
//     employee_status: employeeData.employee_status || "active",
//     company_landline: employeeData.company_landline || null,
//     password: employeeData.password || null,
//     current_experience: employeeData.current_experience ? parseFloat(employeeData.current_experience) : null,
//     total_experience: employeeData.total_experience ? parseFloat(employeeData.total_experience) : null,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       await api.post("/api/v1/add/employee", buildPayload());
//       setEmployeeData({ ...initialEmployee });
//       setShowAddForm(false);
//       setActiveTab("basic");
//       setSuccess("Employee added successfully");
//       await fetchEmployees();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingEmployeeId) return;
//     setSaving(true);
//     setError("");
//     try {
//       const payload = buildPayload();
//       delete payload.password;
//       await api.put(`/api/v1/edit/employee/${editingEmployeeId}`, payload);
//       setShowEditForm(false);
//       setEditingEmployeeId(null);
//       setEmployeeData({ ...initialEmployee });
//       setActiveTab("basic");
//       setSuccess("Employee updated successfully");
//       await fetchEmployees();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const openEdit = (emp) => {
//     setEditingEmployeeId(emp.employee_id);
//     setEmployeeData({
//       first_name: emp.first_name || "",
//       last_name: emp.last_name || "",
//       company_email: emp.company_email || "",
//       personal_email: emp.personal_email || "",
//       personal_mobile: emp.personal_mobile || "",
//       company_mobile: emp.company_mobile || "",
//       department_id: emp.department_id || "",
//       designation_id: emp.designation_id || "",
//       location_id: emp.location_id || "",
//       reporting_manager: emp.reporting_manager || "",
//       employment_type_id: emp.employment_type_id || "",
//       joining_date: emp.joining_date ? emp.joining_date.slice(0, 10) : "",
//       dob: emp.dob ? emp.dob.slice(0, 10) : "",
//       gender: emp.gender || "",
//       blood_group: emp.blood_group || "",
//       martial_status: emp.martial_status || emp.marital_status || "",
//       company_role: emp.company_role || "",
//       current_address: emp.current_address || "",
//       permanent_address: emp.permanent_address || "",
//       emergency_contact_number: emp.emergency_contact_number || "",
//       aadhaar_number: emp.aadhaar_number || "",
//       pan_number: emp.pan_number || "",
//       current_experience: emp.current_experience ?? "",
//       total_experience: emp.total_experience ?? "",
//       about_me: emp.about_me || "",
//       employee_status: emp.employee_status || "active",
//       password: "",
//       company_landline: emp.company_landline || "",
//       date_of_leaving: emp.date_of_leaving ? emp.date_of_leaving.slice(0, 10) : "",
//       resignation_date: emp.resignation_date ? emp.resignation_date.slice(0, 10) : "",
//     });
//     setActiveTab("basic");
//     setError("");
//     setShowEditForm(true);
//   };

//   const openView = (emp) => {
//     setViewEmployee(emp);
//     setShowViewModal(true);
//   };

//   const closeModal = () => {
//     setShowAddForm(false);
//     setShowEditForm(false);
//     setEditingEmployeeId(null);
//     setError("");
//     setEmployeeData({ ...initialEmployee });
//     setActiveTab("basic");
//   };

//   /* ============================================================
//      BULK IMPORT
//   ============================================================ */
//   const downloadTemplate = () => {
//     const csv = [
//       CSV_HEADERS.join(","),
//       ...CSV_SAMPLE_ROWS.map((row) =>
//         row.map((cell) => {
//           const s = String(cell ?? "");
//           if (s.includes(",") || s.includes('"') || s.includes("\n"))
//             return `"${s.replace(/"/g, '""')}"`;
//           return s;
//         }).join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "Employee_Bulk_Import_Template.csv";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const handleBulkFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 10 * 1024 * 1024) {
//       setBulkError("File too large. Max 10 MB allowed.");
//       return;
//     }

//     if (!file.name.toLowerCase().endsWith(".csv")) {
//       setBulkError("Only .csv files are allowed");
//       return;
//     }

//     setBulkFile(file);
//     setBulkFileName(file.name);
//     setBulkResult(null);
//     setBulkError("");
//     setBulkRows([]);
//     setBulkPreview([]);

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       try {
//         let text = ev.target.result;
//         if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

//         const allLines = text
//           .split(/\r?\n/)
//           .map((l) => l.trim())
//           .filter((l) => l.length > 0)
//           .filter((l) => !l.startsWith("#"));

//         if (allLines.length < 2) {
//           setBulkError("CSV must contain a header row and at least one data row.");
//           return;
//         }

//         const rawHeaders = parseCsvLine(allLines[0]);
//         const headers = rawHeaders.map((h) =>
//           h.replace(/^\uFEFF/, "").replace(/^"|"$/g, "").trim().toLowerCase()
//         );

//         const requiredHeaders = ["first_name", "personal_email", "password"];
//         const missing = requiredHeaders.filter((h) => !headers.includes(h));
//         if (missing.length > 0) {
//           setBulkError(
//             `CSV is missing required column(s): ${missing.join(", ")}.\n` +
//             `Please download the template again.`
//           );
//           return;
//         }

//         const rows = [];
//         for (let i = 1; i < allLines.length; i++) {
//           const values = parseCsvLine(allLines[i]);
//           const obj = {};
//           headers.forEach((h, idx) => {
//             obj[h] = (values[idx] ?? "").replace(/^"|"$/g, "").trim();
//           });
//           const hasData = Object.values(obj).some((v) => v !== "");
//           if (hasData) rows.push(obj);
//         }

//         if (rows.length === 0) {
//           setBulkError("No valid data rows found in CSV");
//           return;
//         }

//         setBulkRows(rows);
//         setBulkPreview(rows.slice(0, 50));
//       } catch (err) {
//         setBulkError(`Failed to parse CSV: ${err.message}`);
//       }
//     };

//     reader.onerror = () => setBulkError("Failed to read file. Please try again.");
//     reader.readAsText(file, "UTF-8");
//   };

//   const handleBulkSubmit = async () => {
//     if (!bulkFile || bulkRows.length === 0) {
//       setBulkError("Please select a CSV file with data");
//       return;
//     }

//     setBulkSaving(true);
//     setBulkError("");
//     setBulkResult(null);

//     try {
//       const clean = (v) => {
//         const s = cleanCell(v);
//         return s !== "" ? s : null;
//       };

//       const cleanNum = (v) => {
//         const s = clean(v);
//         if (s === null) return null;
//         const n = parseFloat(s);
//         return Number.isFinite(n) ? n : null;
//       };

//       const employees = bulkRows.map((row) => ({
//         first_name: clean(row.first_name),
//         last_name: clean(row.last_name),
//         company_email: clean(row.company_email),
//         company_mobile: clean(row.company_mobile),
//         personal_email: clean(row.personal_email),
//         personal_mobile: clean(row.personal_mobile),
//         password: clean(row.password),

//         department_name: clean(row.department_name),
//         designation_name: clean(row.designation_name),
//         location_name: clean(row.location_name),
//         employment_type_name: clean(row.employment_type_name),

//         reporting_manager: clean(row.reporting_manager),

//         joining_date: normalizeDate(row.joining_date),
//         date_of_leaving: normalizeDate(row.date_of_leaving),
//         dob: normalizeDate(row.dob),
//         resignation_date: normalizeDate(row.resignation_date),

//         company_role: clean(row.company_role),
//         company_landline: clean(row.company_landline),

//         gender: clean(row.gender)?.toLowerCase() || null,
//         blood_group: clean(row.blood_group),
//         martial_status: clean(row.martial_status)?.toLowerCase() || null,

//         emergency_contact_number: clean(row.emergency_contact_number),
//         current_experience: cleanNum(row.current_experience),
//         total_experience: cleanNum(row.total_experience),

//         current_address: clean(row.current_address),
//         permanent_address: clean(row.permanent_address),

//         aadhaar_number: normalizeNumber(row.aadhaar_number),
//         pan_number: clean(row.pan_number)?.toUpperCase() || null,

//         about_me: clean(row.about_me),
//         employee_status: (clean(row.employee_status) || "active").toLowerCase(),
//       }));

//       const res = await api.post("/api/v1/bulk/add/employees", { employees });
//       setBulkResult(res?.data);
//       if (res?.data?.added > 0) await fetchEmployees();
//     } catch (err) {
//       setBulkError(`Bulk import failed: ${formatApiError(err)}`);
//     } finally {
//       setBulkSaving(false);
//     }
//   };

//   const resetBulkForm = () => {
//     setBulkFile(null);
//     setBulkRows([]);
//     setBulkPreview([]);
//     setBulkResult(null);
//     setBulkError("");
//     setBulkFileName("");
//     const input = document.getElementById("bulkFileInput");
//     if (input) input.value = "";
//   };

//   const filteredEmployees = useMemo(() => {
//     return (Array.isArray(employees) ? employees : []).filter((emp) => {
//       const fullName = `${emp.first_name || ""} ${emp.last_name || ""} ${emp.name || ""}`.toLowerCase();
//       const email = (emp.company_email || emp.personal_email || "").toLowerCase();
//       const q = search.toLowerCase();
//       const matchSearch = !q || fullName.includes(q) || email.includes(q);
//       const status = (emp.employee_status || "active").toLowerCase();
//       const matchStatus = statusFilter === "all" || status === statusFilter;
//       return matchSearch && matchStatus;
//     });
//   }, [employees, search, statusFilter]);

//   const paginatedEmployees = useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE;
//     return filteredEmployees.slice(start, start + PAGE_SIZE);
//   }, [filteredEmployees, page]);

//   const safeDepartments = Array.isArray(departments) ? departments : [];
//   const safeDesignations = Array.isArray(designations) ? designations : [];
//   const safeLocations = Array.isArray(locations) ? locations : [];
//   const safeEmploymentTypes = Array.isArray(employmentTypes) ? employmentTypes : [];

//   const renderFormFields = () => (
//     <>
//       {activeTab === "basic" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">First name *</label>
//             <input value={employeeData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Last name</label>
//             <input value={employeeData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Company email</label>
//             <input type="email" value={employeeData.company_email} onChange={(e) => handleChange("company_email", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Company mobile</label>
//             <input value={employeeData.company_mobile} onChange={(e) => handleChange("company_mobile", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Personal email</label>
//             <input type="email" value={employeeData.personal_email} onChange={(e) => handleChange("personal_email", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Personal mobile</label>
//             <input value={employeeData.personal_mobile} onChange={(e) => handleChange("personal_mobile", e.target.value)} className={inputCls} />
//           </div>
//           {!showEditForm && (
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-slate-700">Password *</label>
//               <input type="password" value={employeeData.password} onChange={(e) => handleChange("password", e.target.value)} className={inputCls} />
//             </div>
//           )}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
//             <select value={employeeData.employee_status} onChange={(e) => handleChange("employee_status", e.target.value)} className={inputCls}>
//               {EMPLOYEE_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
//             </select>
//           </div>
//         </div>
//       )}
//       {activeTab === "work" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
//             <select value={employeeData.department_id} onChange={(e) => handleChange("department_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
//               <option value="">Select department</option>
//               {safeDepartments.map((d) => (
//                 <option key={d.department_id} value={d.department_id}>{d.department_name || d.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Designation</label>
//             <select value={employeeData.designation_id} onChange={(e) => handleChange("designation_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
//               <option value="">Select designation</option>
//               {safeDesignations.map((d) => (
//                 <option key={d.designation_id} value={d.designation_id}>{d.job_title || d.title}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
//             <select value={employeeData.location_id} onChange={(e) => handleChange("location_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
//               <option value="">Select location</option>
//               {safeLocations.map((l) => (
//                 <option key={l.location_id} value={l.location_id}>{l.location_name || l.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Employment type</label>
//             <select value={employeeData.employment_type_id} onChange={(e) => handleChange("employment_type_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
//               <option value="">Select type</option>
//               {safeEmploymentTypes.map((t) => (
//                 <option key={t.employment_type_id} value={t.employment_type_id}>{t.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Reporting manager</label>
//             <select value={employeeData.reporting_manager} onChange={(e) => handleChange("reporting_manager", e.target.value)} className={inputCls}>
//               <option value="">Select manager</option>
//               {managerOptions.filter((m) => m.employee_id !== editingEmployeeId).map((m) => (
//                 <option key={m.employee_id} value={m.employee_id}>{m.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Joining date</label>
//             <input type="date" value={employeeData.joining_date} onChange={(e) => handleChange("joining_date", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Company role</label>
//             <input value={employeeData.company_role} onChange={(e) => handleChange("company_role", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Company landline</label>
//             <input value={employeeData.company_landline} onChange={(e) => handleChange("company_landline", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Date of leaving</label>
//             <input type="date" value={employeeData.date_of_leaving} onChange={(e) => handleChange("date_of_leaving", e.target.value)} className={inputCls} />
//           </div>
//         </div>
//       )}
//       {activeTab === "personal" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Date of birth</label>
//             <input type="date" value={employeeData.dob} onChange={(e) => handleChange("dob", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Gender</label>
//             <select value={employeeData.gender} onChange={(e) => handleChange("gender", e.target.value)} className={inputCls}>
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Blood group</label>
//             <select value={employeeData.blood_group} onChange={(e) => handleChange("blood_group", e.target.value)} className={inputCls}>
//               <option value="">Select</option>
//               {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (<option key={g} value={g}>{g}</option>))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Marital status</label>
//             <select value={employeeData.martial_status} onChange={(e) => handleChange("martial_status", e.target.value)} className={inputCls}>
//               <option value="">Select</option>
//               <option value="single">Single</option>
//               <option value="married">Married</option>
//               <option value="divorced">Divorced</option>
//               <option value="widowed">Widowed</option>
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Emergency contact</label>
//             <input value={employeeData.emergency_contact_number} onChange={(e) => handleChange("emergency_contact_number", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Current experience (yrs)</label>
//             <input type="number" step="0.1" value={employeeData.current_experience} onChange={(e) => handleChange("current_experience", e.target.value)} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Total experience (yrs)</label>
//             <input type="number" step="0.1" value={employeeData.total_experience} onChange={(e) => handleChange("total_experience", e.target.value)} className={inputCls} />
//           </div>
//           <div className="sm:col-span-2">
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Current address</label>
//             <textarea rows={2} value={employeeData.current_address} onChange={(e) => handleChange("current_address", e.target.value)} className={inputCls} />
//           </div>
//           <div className="sm:col-span-2">
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Permanent address</label>
//             <textarea rows={2} value={employeeData.permanent_address} onChange={(e) => handleChange("permanent_address", e.target.value)} className={inputCls} />
//           </div>
//         </div>
//       )}
//       {activeTab === "other" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Aadhaar number</label>
//             <input value={employeeData.aadhaar_number} onChange={(e) => handleChange("aadhaar_number", e.target.value)} maxLength={12} className={inputCls} />
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">PAN number</label>
//             <input value={employeeData.pan_number} onChange={(e) => handleChange("pan_number", e.target.value.toUpperCase())} maxLength={10} className={inputCls} />
//           </div>
//           <div className="sm:col-span-2">
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">About</label>
//             <textarea rows={3} value={employeeData.about_me} onChange={(e) => handleChange("about_me", e.target.value)} className={inputCls} />
//           </div>
//         </div>
//       )}
//     </>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
//             <p className="mt-1 text-sm text-slate-500">Manage employee profiles, hierarchy and bulk import</p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <button type="button" onClick={fetchHierarchy} disabled={hierarchyLoading}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//               {hierarchyLoading ? "Loading..." : "Org Chart"}
//             </button>
//             <button type="button" onClick={() => { resetBulkForm(); setShowBulkModal(true); }}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//               </svg>
//               Bulk Import
//             </button>
//             <button type="button" onClick={() => { setEmployeeData({ ...initialEmployee }); setActiveTab("basic"); setShowAddForm(true); }}
//               className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
//               + Add Employee
//             </button>
//           </div>
//         </div>

//         <Notification type="error" message={error} onDismiss={() => setError("")} />
//         <Notification type="success" message={success} onDismiss={() => setSuccess("")} />

//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
//             <div className="relative max-w-xs flex-1">
//               <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
//                 placeholder="Search name or email..." className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-9 text-sm focus:border-red-500 focus:outline-none" />
//               <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
//               </svg>
//               {searchInput && (
//                 <button type="button" onClick={() => setSearchInput("")}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100">✕</button>
//               )}
//             </div>
//             <div className="flex items-center gap-3">
//               <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
//                 className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
//                 <option value="all">All status</option>
//                 {EMPLOYEE_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
//               </select>
//               <span className="whitespace-nowrap text-sm text-slate-500">
//                 {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""}
//               </span>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             {loading ? (
//               <table className="w-full text-left text-sm">
//                 <tbody className="divide-y divide-slate-100">
//                   {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
//                 </tbody>
//               </table>
//             ) : filteredEmployees.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
//                 <p className="text-sm font-medium text-slate-700">No employees found</p>
//                 <p className="text-xs text-slate-500">Try changing filters or add a new employee.</p>
//               </div>
//             ) : (
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-100 bg-slate-50">
//                     <th className="px-4 py-3 font-semibold text-slate-500">Employee</th>
//                     <th className="px-4 py-3 font-semibold text-slate-500">Department</th>
//                     <th className="px-4 py-3 font-semibold text-slate-500">Designation</th>
//                     <th className="px-4 py-3 font-semibold text-slate-500">Location</th>
//                     <th className="px-4 py-3 font-semibold text-slate-500">Joining</th>
//                     <th className="px-4 py-3 font-semibold text-slate-500">Status</th>
//                     <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {paginatedEmployees.map((emp) => (
//                     <tr key={emp.employee_id} className="hover:bg-slate-50">
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-semibold text-red-600">
//                             {getInitials(emp)}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="truncate font-medium text-slate-800">{emp.first_name} {emp.last_name || ""}</p>
//                             <p className="truncate text-xs text-slate-500">{emp.company_email || emp.personal_email || "—"}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-slate-600">{emp.department_name || "—"}</td>
//                       <td className="px-4 py-3 text-slate-600">{emp.designation_name || emp.company_role || "—"}</td>
//                       <td className="px-4 py-3 text-slate-600">{emp.location_name || "—"}</td>
//                       <td className="px-4 py-3 text-slate-600">{formatDate(emp.joining_date)}</td>
//                       <td className="px-4 py-3">
//                         <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadge(emp.employee_status)}`}>
//                           {(emp.employee_status || "active").replace(/_/g, " ")}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <div className="inline-flex items-center gap-1">
//                           <button type="button" onClick={() => openView(emp)}
//                             className="rounded px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">View</button>
//                           <button type="button" onClick={() => openEdit(emp)}
//                             className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Edit</button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {!loading && filteredEmployees.length > 0 && (
//             <Pagination page={page} pageSize={PAGE_SIZE} total={filteredEmployees.length} onPageChange={setPage} />
//           )}
//         </div>
//       </div>

//       {showViewModal && viewEmployee && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 backdrop-blur-sm"
//           onClick={() => setShowViewModal(false)}>
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-800">{viewEmployee.first_name} {viewEmployee.last_name || ""}</h2>
//                 <p className="text-sm text-slate-500">{viewEmployee.designation_name || viewEmployee.company_role || "—"}</p>
//               </div>
//               <button onClick={() => setShowViewModal(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">✕</button>
//             </div>
//             <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
//               <div>
//                 <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Basic Information</h3>
//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   <DetailItem label="Employee ID" value={viewEmployee.employee_id} />
//                   <DetailItem label="Company Email" value={viewEmployee.company_email} />
//                   <DetailItem label="Personal Email" value={viewEmployee.personal_email} />
//                   <DetailItem label="Company Mobile" value={viewEmployee.company_mobile} />
//                   <DetailItem label="Personal Mobile" value={viewEmployee.personal_mobile} />
//                   <DetailItem label="Gender" value={viewEmployee.gender} />
//                   <DetailItem label="Date of Birth" value={formatDate(viewEmployee.dob)} />
//                   <DetailItem label="Blood Group" value={viewEmployee.blood_group} />
//                   <DetailItem label="Marital Status" value={viewEmployee.martial_status} />
//                 </div>
//               </div>
//               <div>
//                 <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Work Details</h3>
//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   <DetailItem label="Department" value={viewEmployee.department_name} />
//                   <DetailItem label="Designation" value={viewEmployee.designation_name} />
//                   <DetailItem label="Location" value={viewEmployee.location_name} />
//                   <DetailItem label="Employment Type" value={viewEmployee.employment_type_name} />
//                   <DetailItem label="Reporting Manager" value={viewEmployee.reporting_manager_name} />
//                   <DetailItem label="Role" value={viewEmployee.company_role} />
//                   <DetailItem label="Joining Date" value={formatDate(viewEmployee.joining_date)} />
//                   <DetailItem label="Status" value={viewEmployee.employee_status} />
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
//               <button onClick={() => setShowViewModal(false)}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Close</button>
//               <button onClick={() => { setShowViewModal(false); openEdit(viewEmployee); }}
//                 className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700">Edit Employee</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {(showAddForm || showEditForm) && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
//               <h2 className="text-lg font-semibold text-slate-800">{showEditForm ? "Edit Employee" : "Add Employee"}</h2>
//               <button onClick={closeModal} className="rounded p-1 text-slate-400 hover:bg-slate-100">✕</button>
//             </div>
//             <div className="flex overflow-x-auto border-b border-slate-200 px-6">
//               {[
//                 { id: "basic", label: "Basic Info" },
//                 { id: "work", label: "Work Details" },
//                 { id: "personal", label: "Personal" },
//                 { id: "other", label: "Documents" },
//               ].map((tab) => (
//                 <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
//                   className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium ${activeTab === tab.id ? "text-red-600" : "text-slate-500 hover:text-slate-700"}`}>
//                   {tab.label}
//                   {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
//                 </button>
//               ))}
//             </div>
//             <form onSubmit={showEditForm ? handleEditSubmit : handleSubmit}>
//               <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
//                 {renderFormFields()}
//                 {error && (<div className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 border border-red-200">{error}</div>)}
//               </div>
//               <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex gap-2">
//                   {activeTab !== "basic" && (
//                     <button type="button" onClick={() => { const tabs = ["basic", "work", "personal", "other"]; setActiveTab(tabs[tabs.indexOf(activeTab) - 1]); }}
//                       className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">← Previous</button>
//                   )}
//                   {activeTab !== "other" && (
//                     <button type="button" onClick={() => { const tabs = ["basic", "work", "personal", "other"]; setActiveTab(tabs[tabs.indexOf(activeTab) + 1]); }}
//                       className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Next →</button>
//                   )}
//                 </div>
//                 <div className="flex gap-3">
//                   <button type="button" onClick={closeModal}
//                     className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
//                   <button type="submit" disabled={saving}
//                     className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
//                     {saving ? "Saving..." : showEditForm ? "Update" : "Submit"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showBulkModal && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10 backdrop-blur-sm">
//           <div className="mb-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
//               <div>
//                 <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800">
//                   <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                   </svg>
//                   Bulk Import Employees
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Download template → fill data → upload. Just use names — no IDs needed.
//                 </p>
//               </div>
//               <button type="button" onClick={() => { resetBulkForm(); setShowBulkModal(false); }}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
//                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="px-6 py-5">
//               <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
//                       <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">1</span>
//                       Download CSV Template
//                     </p>
//                     <div className="mt-2 flex flex-wrap gap-2 text-xs">
//                       <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-red-700">
//                         Required: first_name, personal_email, password
//                       </span>
//                       <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
//                         Use names (department, designation, location)
//                       </span>
//                     </div>
//                   </div>
//                   <button type="button" onClick={downloadTemplate}
//                     className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
//                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                     </svg>
//                     Download Template
//                   </button>
//                 </div>
//               </div>

//               <div className="mb-5">
//                 <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
//                   <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">2</span>
//                   Upload Filled CSV <span className="text-red-600">*</span>
//                 </p>
//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//                   <input
//                     id="bulkFileInput"
//                     type="file"
//                     accept=".csv"
//                     onChange={handleBulkFileChange}
//                     className="block w-full text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-red-600 hover:file:bg-red-100"
//                   />
//                   {bulkFileName && (
//                     <span className="whitespace-nowrap text-sm text-slate-500">📄 {bulkFileName}</span>
//                   )}
//                 </div>
//               </div>

//               {bulkPreview.length > 0 && (
//                 <div className="mb-5">
//                   <div className="mb-2 flex items-center justify-between">
//                     <p className="text-sm font-medium text-slate-700">
//                       Preview: {bulkRows.length} row{bulkRows.length !== 1 ? "s" : ""} loaded
//                     </p>
//                     <span className="text-xs text-slate-500">
//                       Showing first {Math.min(bulkPreview.length, 10)}
//                     </span>
//                   </div>
//                   <div className="max-h-64 overflow-auto rounded-lg border border-slate-200">
//                     <table className="w-full text-left text-xs">
//                       <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
//                         <tr>
//                           {Object.keys(bulkPreview[0]).slice(0, 8).map((h) => (
//                             <th key={h} className="px-3 py-2 font-medium uppercase tracking-wider text-slate-500">
//                               {h.replace(/_/g, " ")}
//                             </th>
//                           ))}
//                           {Object.keys(bulkPreview[0]).length > 8 && (
//                             <th className="px-3 py-2 font-medium text-slate-500">...</th>
//                           )}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {bulkPreview.slice(0, 10).map((row, i) => (
//                           <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
//                             {Object.values(row).slice(0, 8).map((v, j) => (
//                               <td key={j} className="max-w-[150px] truncate px-3 py-1.5 text-slate-700">{v || "—"}</td>
//                             ))}
//                             {Object.values(row).length > 8 && (
//                               <td className="px-3 py-1.5 text-slate-500">+{Object.values(row).length - 8}</td>
//                             )}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               {bulkResult && (
//                 <div className={`mb-5 rounded-xl border p-4 ${
//                   bulkResult.added > 0 && bulkResult.failed === 0
//                     ? "bg-emerald-50 border-emerald-200"
//                     : bulkResult.added > 0 && bulkResult.failed > 0
//                     ? "bg-amber-50 border-amber-200"
//                     : "bg-red-50 border-red-200"
//                 }`}>
//                   <p className={`font-medium ${
//                     bulkResult.added > 0 && bulkResult.failed === 0
//                       ? "text-emerald-800"
//                       : bulkResult.added > 0
//                       ? "text-amber-800"
//                       : "text-red-800"
//                   }`}>
//                     {bulkResult.added > 0 && bulkResult.failed === 0
//                       ? "✅ All employees imported successfully!"
//                       : bulkResult.added > 0
//                       ? `⚠️ Partial success: ${bulkResult.added} added, ${bulkResult.failed} failed`
//                       : `❌ All ${bulkResult.failed} employees failed`}
//                   </p>
//                   <p className="mt-1 text-sm text-slate-600">
//                     Total: {bulkResult.total} • Added: <span className="font-medium text-emerald-700">{bulkResult.added}</span> • Failed: <span className="font-medium text-red-700">{bulkResult.failed}</span>
//                   </p>

//                   {bulkResult.created_employees?.length > 0 && (
//                     <div className="mt-3 border-t border-slate-200 pt-3">
//                       <p className="text-xs font-medium text-emerald-700">✅ Added:</p>
//                       <div className="mt-1 flex flex-wrap gap-1.5">
//                         {bulkResult.created_employees.slice(0, 10).map((emp, i) => (
//                           <span key={i} className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-xs text-emerald-700">
//                             {emp.email}
//                           </span>
//                         ))}
//                         {bulkResult.created_employees.length > 10 && (
//                           <span className="text-xs text-slate-500">+{bulkResult.created_employees.length - 10} more</span>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {bulkResult.errors?.length > 0 && (
//                     <div className="mt-3 border-t border-slate-200 pt-3">
//                       <p className="text-xs font-medium text-red-700">❌ Errors:</p>
//                       <div className="mt-1 max-h-40 space-y-1 overflow-auto">
//                         {bulkResult.errors.slice(0, 20).map((error, i) => (
//                           <div key={i} className="flex items-start gap-2 rounded border border-red-200 bg-white px-2 py-1.5 text-xs">
//                             <span className="whitespace-nowrap font-semibold text-red-700">Row {error.row}:</span>
//                             <span className="text-red-700">{error.error}</span>
//                           </div>
//                         ))}
//                         {bulkResult.errors.length > 20 && (
//                           <div className="text-xs text-slate-500">+{bulkResult.errors.length - 20} more errors</div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {bulkError && (
//                 <div className="mb-5 whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                   {bulkError}
//                 </div>
//               )}

//               <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
//                 <button type="button" onClick={() => { resetBulkForm(); setShowBulkModal(false); }}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
//                 <button type="button" onClick={resetBulkForm}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Reset</button>
//                 <button type="button" onClick={handleBulkSubmit}
//                   disabled={bulkSaving || bulkRows.length === 0}
//                   className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
//                   {bulkSaving ? (
//                     <>
//                       <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       Importing...
//                     </>
//                   ) : (
//                     `Import ${bulkRows.length} Employee${bulkRows.length !== 1 ? "s" : ""}`
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showHierarchy && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 backdrop-blur-sm">
//           <div className="mb-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-800">Organization Chart</h2>
//                 <p className="text-sm text-slate-500">
//                   {hierarchyData?.total_employees || 0} employees • {hierarchyData?.total_roots || 0} top-level
//                 </p>
//               </div>
//               <button onClick={() => { setShowHierarchy(false); setHierarchyData(null); }}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">✕</button>
//             </div>
//             <div className="max-h-[72vh] overflow-y-auto px-6 py-6">
//               {!hierarchyData?.hierarchy?.length ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-center">
//                   <p className="text-sm font-medium text-slate-600">No hierarchy data found</p>
//                   <p className="mt-1 text-sm text-slate-400">Assign reporting managers to build the org chart</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {hierarchyData.hierarchy.map((node) => (
//                     <HierarchyNode key={node.employee_id || node.user_id} node={node} level={0} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";

/* ============================================================
   CONSTANTS
============================================================ */

const AUTO_DISMISS_MS = 4500;
const PAGE_SIZE = 10;
const DEBOUNCE_MS = 300;
const TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "work", label: "Work Details" },
  { id: "personal", label: "Personal" },
  { id: "other", label: "Documents" },
];

const EMPLOYEE_STATUSES = [
  { value: "active", label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  { value: "probation", label: "Probation", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  { value: "notice_period", label: "Notice Period", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  { value: "on_leave", label: "On Leave", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  { value: "suspended", label: "Suspended", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  { value: "resigned", label: "Resigned", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
  { value: "terminated", label: "Terminated", color: "bg-red-100 text-red-800 border-red-300", dot: "bg-red-700" },
];
const STATUS_MAP = Object.fromEntries(EMPLOYEE_STATUSES.map((s) => [s.value, s]));

const AVATAR_COLORS = [
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
];

const CSV_HEADERS = [
  "first_name", "last_name", "company_email", "company_mobile", "personal_email",
  "personal_mobile", "password", "department_name", "designation_name", "location_name",
  "employment_type_name", "reporting_manager", "joining_date", "company_role",
  "company_landline", "date_of_leaving", "dob", "gender", "blood_group", "martial_status",
  "emergency_contact_number", "current_experience", "total_experience", "current_address",
  "permanent_address", "aadhaar_number", "pan_number", "about_me", "employee_status",
];

const CSV_SAMPLE_ROWS = [
  [
    "Rahul", "Sharma", "rahul.sharma@company.com", "9876543211", "rahul.sharma@gmail.com",
    "9876543210", "Welcome@123", "Engineering", "Software Engineer", "Mumbai", "Full Time",
    "", "2025-01-15", "Team Lead", "", "", "1995-03-20", "male", "B+", "single", "9876501234",
    "3.5", "5.0", "123, Sector 18, Noida", "Village XYZ, UP", "123456789012", "ABCDE1234F",
    "Full stack developer", "active",
  ],
  [
    "Priya", "Patel", "priya.patel@company.com", "9988776656", "priya.patel@gmail.com",
    "9988776655", "Welcome@123", "Human Resources", "HR Executive", "Delhi", "Full Time",
    "", "2025-02-01", "HR Executive", "", "", "1998-11-05", "female", "O+", "married",
    "9123456789", "1.2", "1.2", "Flat 402, Andheri West, Mumbai", "", "", "FGHIJ5678K", "",
    "active",
  ],
];

/* ============================================================
   HELPERS
============================================================ */

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
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return err?.message || "Something went wrong";
};

const formatDate = (date) => {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(date);
  }
};

/* Single source of truth for an employee's display name */
const getFullName = (emp) => {
  if (!emp) return "—";
  const full = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
  if (full) return full;
  if (emp.name && emp.name !== "—") return emp.name;
  return emp.company_email || emp.personal_email || "—";
};

const getInitials = (emp) => {
  const first = emp.first_name?.[0] || emp.name?.[0] || emp.company_email?.[0] || emp.personal_email?.[0] || "E";
  const last = emp.last_name?.[0] || "";
  return (first + last).toUpperCase();
};

const avatarColor = (key) => {
  const s = String(key || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

const getStatusBadge = (status) =>
  STATUS_MAP[(status || "active").toLowerCase()]?.color || "bg-slate-100 text-slate-600 border-slate-200";

const statusLabel = (status) =>
  STATUS_MAP[(status || "active").toLowerCase()]?.label || String(status || "active").replace(/_/g, " ");

const extractArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  for (const k of ["data", "departments", "designations", "locations", "items", "employment_types"]) {
    if (Array.isArray(d?.[k])) return d[k];
  }
  return [];
};

/* Proper CSV parser: handles quoted commas, escaped quotes and newlines inside quotes */
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let val = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { val += '"'; i++; }
      else if (ch === '"') quoted = false;
      else val += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(val.trim()); val = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && next === "\n") i++;
      row.push(val.trim());
      rows.push(row);
      row = [];
      val = "";
    } else val += ch;
  }
  row.push(val.trim());
  rows.push(row);
  return rows.filter((r) => r.some((c) => c !== "") && !(r[0] || "").startsWith("#"));
};

/* DD-MM-YYYY / DD/MM/YYYY → YYYY-MM-DD */
const normalizeDate = (val) => {
  const s = (val || "").toString().trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return null;
};

/* Excel scientific notation (9.87E+11) → plain digits */
const normalizeNumber = (val) => {
  const s = (val || "").toString().trim();
  if (!s) return null;
  if (/[eE]/.test(s)) {
    const n = Number(s);
    return Number.isFinite(n) ? n.toFixed(0) : null;
  }
  if (/^\d+\.0+$/.test(s)) return s.split(".")[0];
  return s;
};

const cleanCell = (val) => {
  let s = (val ?? "").toString().trim();
  if (s.length >= 2 && ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))) {
    s = s.slice(1, -1);
  }
  return s.trim();
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateBulkRow = (row) => {
  const issues = [];
  if (!cleanCell(row.first_name)) issues.push("first_name missing");
  const pe = cleanCell(row.personal_email);
  if (!pe) issues.push("personal_email missing");
  else if (!EMAIL_RE.test(pe)) issues.push("personal_email invalid");
  if (!cleanCell(row.password)) issues.push("password missing");
  const ce = cleanCell(row.company_email);
  if (ce && !EMAIL_RE.test(ce)) issues.push("company_email invalid");
  ["joining_date", "date_of_leaving", "dob"].forEach((f) => {
    if (cleanCell(row[f]) && !normalizeDate(cleanCell(row[f]))) issues.push(`${f} invalid (use YYYY-MM-DD)`);
  });
  return issues;
};

const csvEscape = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const downloadCsv = (filename, lines) => {
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ============================================================
   SUBCOMPONENTS
============================================================ */

function Notification({ type, message, onDismiss }) {
  if (!message) return null;
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  return (
    <div role="alert" className={`mb-4 flex items-start justify-between rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <span className="whitespace-pre-line">{message}</span>
      <button type="button" onClick={onDismiss} className="ml-3 opacity-60 hover:opacity-100" aria-label="Dismiss">✕</button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5"><div className="h-4 rounded bg-slate-200" /></td>
      ))}
    </tr>
  );
}

function Avatar({ emp, size = "h-9 w-9 text-xs" }) {
  return (
    <div className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full font-semibold ${avatarColor(emp.employee_id || getFullName(emp))}`}>
      {getInitials(emp)}
    </div>
  );
}

function StatusPill({ status, size = "text-xs" }) {
  const s = STATUS_MAP[(status || "active").toLowerCase()];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${size} ${getStatusBadge(status)}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s?.dot || "bg-slate-400"}`} />
      {statusLabel(status)}
    </span>
  );
}

function StatCard({ label, value, active, onClick, dot }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition ${
        active ? "border-red-300 bg-red-50 ring-1 ring-red-200" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
        {label}
      </div>
      <p className="mt-1 text-2xl font-semibold text-slate-800">{value}</p>
    </button>
  );
}

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn =
    "rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40";
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3.5 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(1)} className={btn}>First</button>
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={btn}>Prev</button>
        <span className="px-3 text-xs text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={btn}>Next</button>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)} className={btn}>Last</button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-sm text-slate-800">{value || value === 0 ? value : "—"}</p>
    </div>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}

function HierarchyNode({ node, level = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.reports && node.reports.length > 0;
  const name = node.name || "—";
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "E";

  return (
    <div className="relative">
      {level > 0 && (
        <>
          <div className="absolute left-[-20px] top-0 h-full w-px bg-slate-200" />
          <div className="absolute left-[-20px] top-[28px] h-px w-5 bg-slate-200" />
        </>
      )}
      <div className="relative flex items-start gap-3 pb-4">
        <div className="flex min-w-[300px] max-w-[340px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-red-400/40 hover:shadow-md">
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-sm font-semibold text-white shadow-sm">
              {initials}
            </div>
            {hasChildren && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "Collapse" : "Expand"}
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 shadow-sm hover:bg-slate-200"
              >
                <svg className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
            <p className="truncate text-xs text-slate-500">{node.designation || "No designation"}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <StatusPill status={node.employee_status} size="text-[10px]" />
              {hasChildren && (
                <span className="text-[10px] text-slate-400">
                  {node.reports.length} report{node.reports.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="ml-10 space-y-0 border-l border-slate-200 pl-5">
          {node.reports.map((child) => (
            <HierarchyNode key={child.employee_id || child.user_id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModalShell({ children, onClose, maxW = "max-w-3xl", blur = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 ${blur ? "backdrop-blur-sm" : ""}`}
      onClick={onClose}
    >
      <div className={`mb-10 w-full ${maxW} overflow-hidden rounded-2xl bg-white shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const initialEmployee = {
  first_name: "", last_name: "", company_email: "", personal_email: "",
  personal_mobile: "", company_mobile: "", department_id: "", designation_id: "",
  location_id: "", reporting_manager: "", employment_type_id: "", joining_date: "",
  dob: "", gender: "", blood_group: "", martial_status: "", company_role: "",
  current_address: "", permanent_address: "", emergency_contact_number: "",
  aadhaar_number: "", pan_number: "", current_experience: "", total_experience: "",
  about_me: "", employee_status: "active", password: "", company_landline: "",
  date_of_leaving: "", resignation_date: "",
};

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:bg-slate-50";

/* ============================================================
   MAIN PAGE
============================================================ */

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });

  const [employeeData, setEmployeeData] = useState(initialEmployee);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  const [showHierarchy, setShowHierarchy] = useState(false);
  const [hierarchyData, setHierarchyData] = useState(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkFileName, setBulkFileName] = useState("");
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState("");

  const reqIdRef = useRef(0);
  const isFormOpen = showAddForm || showEditForm;

  /* ---------- notifications ---------- */
  useEffect(() => {
    if (!error && !success) return;
    const t = setTimeout(() => { setError(""); setSuccess(""); }, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [error, success]);

  /* ---------- data ---------- */
  const fetchEmployees = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    try {
      const res = await api.get("/api/v1/get/employees");
      if (myReqId !== reqIdRef.current) return;
      const d = res?.data;
      let list = [];
      if (Array.isArray(d?.employees)) list = d.employees;
      else if (Array.isArray(d?.data)) list = d.data;
      else if (Array.isArray(d)) list = d;
      setEmployees(list);
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setEmployees([]);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(1); }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchHierarchy = async () => {
    setHierarchyLoading(true);
    try {
      const res = await api.get("/api/v1/get/reporting/hierarchy");
      setHierarchyData(res?.data || null);
      setShowHierarchy(true);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setHierarchyLoading(false);
    }
  };

  const loadMasters = useCallback(async () => {
    setLoadingMasters(true);
    try {
      const [etRes, deptRes, desigRes, locRes] = await Promise.all([
        api.get("/api/v1/get/employment/type/list"),
        api.get("/api/v1/get/departments"),
        api.get("/api/v1/get/designations"),
        api.get("/api/v1/get/location/master"),
      ]);
      setEmploymentTypes(extractArray(etRes));
      setDepartments(extractArray(deptRes));
      setDesignations(extractArray(desigRes));
      setLocations(extractArray(locRes));
    } catch {
      setEmploymentTypes([]); setDepartments([]); setDesignations([]); setLocations([]);
    } finally {
      setLoadingMasters(false);
    }
  }, []);

  useEffect(() => { if (isFormOpen) void loadMasters(); }, [isFormOpen, loadMasters]);

  /* ---------- form helpers ---------- */
  const handleChange = (field, value) => setEmployeeData((prev) => ({ ...prev, [field]: value }));

  const managerOptions = useMemo(
    () =>
      employees
        .filter((e) => e.employee_id && e.employee_id !== editingEmployeeId)
        .map((e) => ({ employee_id: e.employee_id, name: getFullName(e) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [employees, editingEmployeeId]
  );

  const buildPayload = () => {
    const v = (x) => (x === "" || x === undefined ? null : x);
    const d = employeeData;
    return {
      first_name: v(d.first_name?.trim()),
      last_name: v(d.last_name?.trim()),
      company_email: v(d.company_email?.trim()),
      personal_email: v(d.personal_email?.trim()),
      personal_mobile: v(d.personal_mobile?.trim()),
      company_mobile: v(d.company_mobile?.trim()),
      department_id: v(d.department_id),
      designation_id: v(d.designation_id),
      location_id: v(d.location_id),
      reporting_manager: v(d.reporting_manager),
      employment_type_id: v(d.employment_type_id),
      joining_date: v(d.joining_date),
      date_of_leaving: v(d.date_of_leaving),
      resignation_date: v(d.resignation_date),
      dob: v(d.dob),
      gender: v(d.gender),
      blood_group: v(d.blood_group),
      martial_status: v(d.martial_status),
      company_role: v(d.company_role),
      current_address: v(d.current_address),
      permanent_address: v(d.permanent_address),
      emergency_contact_number: v(d.emergency_contact_number),
      aadhaar_number: v(d.aadhaar_number),
      pan_number: v(d.pan_number),
      about_me: v(d.about_me),
      employee_status: d.employee_status || "active",
      company_landline: v(d.company_landline),
      password: v(d.password),
      current_experience: d.current_experience !== "" ? parseFloat(d.current_experience) : null,
      total_experience: d.total_experience !== "" ? parseFloat(d.total_experience) : null,
    };
  };

  /* returns error message + tab to jump to, or null */
  const validateForm = (isEdit) => {
    const d = employeeData;
    if (!d.first_name.trim()) return { tab: "basic", msg: "First name is required" };
    if (!d.personal_email.trim() && !d.personal_mobile.trim())
      return { tab: "basic", msg: "Enter a personal email or personal mobile" };
    if (d.personal_email && !EMAIL_RE.test(d.personal_email.trim()))
      return { tab: "basic", msg: "Personal email is not valid" };
    if (d.company_email && !EMAIL_RE.test(d.company_email.trim()))
      return { tab: "basic", msg: "Company email is not valid" };
    if (!isEdit && !d.password) return { tab: "basic", msg: "Password is required for a new employee" };
    if (!d.department_id) return { tab: "work", msg: "Select a department" };
    if (d.aadhaar_number && !/^\d{12}$/.test(d.aadhaar_number))
      return { tab: "other", msg: "Aadhaar must be 12 digits" };
    if (d.pan_number && !/^[A-Z]{5}\d{4}[A-Z]$/.test(d.pan_number))
      return { tab: "other", msg: "PAN format looks wrong (example: ABCDE1234F)" };
    return null;
  };

  const resetForm = () => {
    setEmployeeData({ ...initialEmployee });
    setActiveTab("basic");
    setFormError("");
  };

  const closeModal = useCallback(() => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingEmployeeId(null);
    setEmployeeData({ ...initialEmployee });
    setActiveTab("basic");
    setFormError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateForm(false);
    if (invalid) { setActiveTab(invalid.tab); setFormError(invalid.msg); return; }
    setSaving(true);
    setFormError("");
    try {
      await api.post("/api/v1/add/employee", buildPayload());
      closeModal();
      setSuccess("Employee added successfully");
      await fetchEmployees();
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmployeeId) return;
    const invalid = validateForm(true);
    if (invalid) { setActiveTab(invalid.tab); setFormError(invalid.msg); return; }
    setSaving(true);
    setFormError("");
    try {
      const payload = buildPayload();
      delete payload.password;
      await api.put(`/api/v1/edit/employee/${editingEmployeeId}`, payload);
      closeModal();
      setSuccess("Employee updated successfully");
      await fetchEmployees();
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => { resetForm(); setShowAddForm(true); };

  const openEdit = (emp) => {
    const d10 = (x) => (x ? String(x).slice(0, 10) : "");
    setEditingEmployeeId(emp.employee_id);
    setEmployeeData({
      first_name: emp.first_name || "",
      last_name: emp.last_name || "",
      company_email: emp.company_email || "",
      personal_email: emp.personal_email || "",
      personal_mobile: emp.personal_mobile || "",
      company_mobile: emp.company_mobile || "",
      department_id: emp.department_id || "",
      designation_id: emp.designation_id || "",
      location_id: emp.location_id || "",
      reporting_manager: emp.reporting_manager || "",
      employment_type_id: emp.employment_type_id || "",
      joining_date: d10(emp.joining_date),
      dob: d10(emp.dob),
      gender: emp.gender || "",
      blood_group: emp.blood_group || "",
      martial_status: emp.marital_status || emp.martial_status || "",
      company_role: emp.company_role || "",
      current_address: emp.current_address || "",
      permanent_address: emp.permanent_address || "",
      emergency_contact_number: emp.emergency_contact_number || "",
      aadhaar_number: emp.aadhaar_number || "",
      pan_number: emp.pan_number || "",
      current_experience: emp.current_experience ?? "",
      total_experience: emp.total_experience ?? "",
      about_me: emp.about_me || "",
      employee_status: emp.employee_status || "active",
      password: "",
      company_landline: emp.company_landline || "",
      date_of_leaving: d10(emp.date_of_leaving),
      resignation_date: d10(emp.resignation_date),
    });
    setActiveTab("basic");
    setFormError("");
    setShowEditForm(true);
  };

  const openView = (emp) => { setViewEmployee(emp); setShowViewModal(true); };
  const closeView = useCallback(() => setShowViewModal(false), []);

  /* ============================================================
     BULK IMPORT
  ============================================================ */
  const downloadTemplate = () =>
    downloadCsv("Employee_Bulk_Import_Template.csv", [
      CSV_HEADERS.join(","),
      ...CSV_SAMPLE_ROWS.map((r) => r.map(csvEscape).join(",")),
    ]);

  const resetBulkForm = () => {
    setBulkFile(null); setBulkRows([]); setBulkResult(null);
    setBulkError(""); setBulkFileName("");
    const input = document.getElementById("bulkFileInput");
    if (input) input.value = "";
  };

  const closeBulk = useCallback(() => { resetBulkForm(); setShowBulkModal(false); }, []);

  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setBulkError("File too large. Max 10 MB allowed."); return; }
    if (!file.name.toLowerCase().endsWith(".csv")) { setBulkError("Only .csv files are allowed"); return; }

    setBulkFile(file); setBulkFileName(file.name);
    setBulkResult(null); setBulkError(""); setBulkRows([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        let text = String(ev.target.result || "");
        if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
        const table = parseCsv(text);
        if (table.length < 2) { setBulkError("CSV must contain a header row and at least one data row."); return; }

        const headers = table[0].map((h) => h.replace(/^\uFEFF/, "").replace(/^"|"$/g, "").trim().toLowerCase());
        const missing = ["first_name", "personal_email", "password"].filter((h) => !headers.includes(h));
        if (missing.length) {
          setBulkError(`CSV is missing required column(s): ${missing.join(", ")}.\nPlease download the template again.`);
          return;
        }

        const rows = table.slice(1).map((values, i) => {
          const obj = { __row: i + 2 };
          headers.forEach((h, idx) => { obj[h] = cleanCell(values[idx]); });
          return obj;
        });
        if (!rows.length) { setBulkError("No valid data rows found in CSV"); return; }
        setBulkRows(rows);
      } catch (err) {
        setBulkError(`Failed to parse CSV: ${err.message}`);
      }
    };
    reader.onerror = () => setBulkError("Failed to read file. Please try again.");
    reader.readAsText(file, "UTF-8");
  };

  const bulkValidation = useMemo(() => bulkRows.map((r) => validateBulkRow(r)), [bulkRows]);
  const bulkIssueCount = bulkValidation.filter((i) => i.length).length;

  const handleBulkSubmit = async () => {
    if (!bulkFile || !bulkRows.length) { setBulkError("Please select a CSV file with data"); return; }
    setBulkSaving(true); setBulkError(""); setBulkResult(null);
    try {
      const clean = (v) => { const s = cleanCell(v); return s !== "" ? s : null; };
      const cleanNum = (v) => {
        const s = clean(v);
        if (s === null) return null;
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : null;
      };

      const payload = bulkRows.map((row) => ({
        first_name: clean(row.first_name),
        last_name: clean(row.last_name),
        company_email: clean(row.company_email),
        company_mobile: normalizeNumber(row.company_mobile),
        personal_email: clean(row.personal_email),
        personal_mobile: normalizeNumber(row.personal_mobile),
        password: clean(row.password),
        department_name: clean(row.department_name),
        designation_name: clean(row.designation_name),
        location_name: clean(row.location_name),
        employment_type_name: clean(row.employment_type_name),
        reporting_manager: clean(row.reporting_manager),
        joining_date: normalizeDate(row.joining_date),
        date_of_leaving: normalizeDate(row.date_of_leaving),
        dob: normalizeDate(row.dob),
        resignation_date: normalizeDate(row.resignation_date),
        company_role: clean(row.company_role),
        company_landline: normalizeNumber(row.company_landline),
        gender: clean(row.gender)?.toLowerCase() || null,
        blood_group: clean(row.blood_group)?.toUpperCase() || null,
        martial_status: clean(row.martial_status)?.toLowerCase() || null,
        emergency_contact_number: normalizeNumber(row.emergency_contact_number),
        current_experience: cleanNum(row.current_experience),
        total_experience: cleanNum(row.total_experience),
        current_address: clean(row.current_address),
        permanent_address: clean(row.permanent_address),
        aadhaar_number: normalizeNumber(row.aadhaar_number),
        pan_number: clean(row.pan_number)?.toUpperCase() || null,
        about_me: clean(row.about_me),
        employee_status: (clean(row.employee_status) || "active").toLowerCase(),
      }));

      const res = await api.post("/api/v1/bulk/add/employees", { employees: payload });
      setBulkResult(res?.data);
      if (res?.data?.added > 0) await fetchEmployees();
    } catch (err) {
      setBulkError(`Bulk import failed: ${formatApiError(err)}`);
    } finally {
      setBulkSaving(false);
    }
  };

  /* ============================================================
     FILTER / SORT / PAGINATE
  ============================================================ */
  const statusCounts = useMemo(() => {
    const c = {};
    employees.forEach((e) => {
      const s = (e.employee_status || "active").toLowerCase();
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [employees]);

  const deptOptions = useMemo(() => {
    const set = new Set();
    employees.forEach((e) => { if (e.department_name && e.department_name !== "—") set.add(e.department_name); });
    return [...set].sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase();
    const list = employees.filter((emp) => {
      if (q) {
        const hay = [
          getFullName(emp), emp.company_email, emp.personal_email, emp.company_mobile,
          emp.personal_mobile, emp.employee_id, emp.department_name, emp.designation_name,
        ].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const status = (emp.employee_status || "active").toLowerCase();
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (deptFilter !== "all" && emp.department_name !== deptFilter) return false;
      return true;
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.key === "joining_date") {
        const x = a.joining_date ? new Date(a.joining_date).getTime() : 0;
        const y = b.joining_date ? new Date(b.joining_date).getTime() : 0;
        return (x - y) * dir;
      }
      const key = sort.key === "name" ? (e) => getFullName(e) : (e) => e[sort.key] || "";
      return String(key(a)).localeCompare(String(key(b)), undefined, { sensitivity: "base" }) * dir;
    });
  }, [employees, search, statusFilter, deptFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const paginatedEmployees = useMemo(
    () => filteredEmployees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredEmployees, page]
  );

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const sortArrow = (key) => (sort.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : "");

  const hasActiveFilters = search || statusFilter !== "all" || deptFilter !== "all";
  const clearFilters = () => { setSearchInput(""); setSearch(""); setStatusFilter("all"); setDeptFilter("all"); setPage(1); };

  const exportEmployees = () => {
    const cols = [
      ["Employee ID", (e) => e.employee_id], ["Name", getFullName],
      ["Company Email", (e) => e.company_email], ["Personal Email", (e) => e.personal_email],
      ["Company Mobile", (e) => e.company_mobile], ["Personal Mobile", (e) => e.personal_mobile],
      ["Department", (e) => e.department_name], ["Designation", (e) => e.designation_name],
      ["Location", (e) => e.location_name], ["Employment Type", (e) => e.employment_type_name],
      ["Reporting Manager", (e) => e.reporting_manager_name],
      ["Joining Date", (e) => String(e.joining_date || "").slice(0, 10)],
      ["Status", (e) => statusLabel(e.employee_status)],
    ];
    downloadCsv(`employees_${new Date().toISOString().slice(0, 10)}.csv`, [
      cols.map((c) => csvEscape(c[0])).join(","),
      ...filteredEmployees.map((e) => cols.map((c) => csvEscape(c[1](e))).join(",")),
    ]);
  };

  const safe = (a) => (Array.isArray(a) ? a : []);

  /* ============================================================
     FORM FIELDS
  ============================================================ */
  const renderFormFields = () => (
    <>
      {activeTab === "basic" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" required>
            <input value={employeeData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Last name">
            <input value={employeeData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Company email">
            <input type="email" value={employeeData.company_email} onChange={(e) => handleChange("company_email", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Company mobile">
            <input value={employeeData.company_mobile} onChange={(e) => handleChange("company_mobile", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Personal email" required>
            <input type="email" value={employeeData.personal_email} onChange={(e) => handleChange("personal_email", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Personal mobile">
            <input value={employeeData.personal_mobile} onChange={(e) => handleChange("personal_mobile", e.target.value)} className={inputCls} />
          </Field>
          {!showEditForm && (
            <Field label="Password" required>
              <input type="password" autoComplete="new-password" value={employeeData.password} onChange={(e) => handleChange("password", e.target.value)} className={inputCls} />
            </Field>
          )}
          <Field label="Status">
            <select value={employeeData.employee_status} onChange={(e) => handleChange("employee_status", e.target.value)} className={inputCls}>
              {EMPLOYEE_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
            </select>
          </Field>
        </div>
      )}

      {activeTab === "work" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Department" required>
            <select value={employeeData.department_id} onChange={(e) => handleChange("department_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
              <option value="">{loadingMasters ? "Loading..." : "Select department"}</option>
              {safe(departments).map((d) => (
                <option key={d.department_id} value={d.department_id}>{d.department_name || d.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Designation">
            <select value={employeeData.designation_id} onChange={(e) => handleChange("designation_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
              <option value="">Select designation</option>
              {safe(designations).map((d) => (
                <option key={d.designation_id} value={d.designation_id}>{d.job_title || d.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <select value={employeeData.location_id} onChange={(e) => handleChange("location_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
              <option value="">Select location</option>
              {safe(locations).map((l) => (
                <option key={l.location_id} value={l.location_id}>{l.location_name || l.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Employment type">
            <select value={employeeData.employment_type_id} onChange={(e) => handleChange("employment_type_id", e.target.value)} className={inputCls} disabled={loadingMasters}>
              <option value="">Select type</option>
              {safe(employmentTypes).map((t) => (
                <option key={t.employment_type_id} value={t.employment_type_id}>{t.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Reporting manager">
            <select value={employeeData.reporting_manager} onChange={(e) => handleChange("reporting_manager", e.target.value)} className={inputCls}>
              <option value="">No manager</option>
              {managerOptions.map((m) => (
                <option key={m.employee_id} value={m.employee_id}>{m.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Joining date">
            <input type="date" value={employeeData.joining_date} onChange={(e) => handleChange("joining_date", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Company role">
            <input value={employeeData.company_role} onChange={(e) => handleChange("company_role", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Company landline">
            <input value={employeeData.company_landline} onChange={(e) => handleChange("company_landline", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Resignation date">
            <input type="date" value={employeeData.resignation_date} onChange={(e) => handleChange("resignation_date", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Date of leaving">
            <input type="date" value={employeeData.date_of_leaving} onChange={(e) => handleChange("date_of_leaving", e.target.value)} className={inputCls} />
          </Field>
        </div>
      )}

      {activeTab === "personal" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date of birth">
            <input type="date" value={employeeData.dob} onChange={(e) => handleChange("dob", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Gender">
            <select value={employeeData.gender} onChange={(e) => handleChange("gender", e.target.value)} className={inputCls}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Blood group">
            <select value={employeeData.blood_group} onChange={(e) => handleChange("blood_group", e.target.value)} className={inputCls}>
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (<option key={g} value={g}>{g}</option>))}
            </select>
          </Field>
          <Field label="Marital status">
            <select value={employeeData.martial_status} onChange={(e) => handleChange("martial_status", e.target.value)} className={inputCls}>
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </Field>
          <Field label="Emergency contact">
            <input value={employeeData.emergency_contact_number} onChange={(e) => handleChange("emergency_contact_number", e.target.value)} className={inputCls} />
          </Field>
          <div className="hidden sm:block" />
          <Field label="Current experience (yrs)">
            <input type="number" min="0" step="0.1" value={employeeData.current_experience} onChange={(e) => handleChange("current_experience", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Total experience (yrs)">
            <input type="number" min="0" step="0.1" value={employeeData.total_experience} onChange={(e) => handleChange("total_experience", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Current address" className="sm:col-span-2">
            <textarea rows={2} value={employeeData.current_address} onChange={(e) => handleChange("current_address", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Permanent address" className="sm:col-span-2">
            <div className="mb-1.5 -mt-1">
              <button type="button" className="text-xs font-medium text-red-600 hover:underline"
                onClick={() => handleChange("permanent_address", employeeData.current_address)}>
                Same as current address
              </button>
            </div>
            <textarea rows={2} value={employeeData.permanent_address} onChange={(e) => handleChange("permanent_address", e.target.value)} className={inputCls} />
          </Field>
        </div>
      )}

      {activeTab === "other" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Aadhaar number">
            <input inputMode="numeric" value={employeeData.aadhaar_number}
              onChange={(e) => handleChange("aadhaar_number", e.target.value.replace(/\D/g, "").slice(0, 12))} className={inputCls} />
          </Field>
          <Field label="PAN number">
            <input value={employeeData.pan_number}
              onChange={(e) => handleChange("pan_number", e.target.value.toUpperCase().slice(0, 10))} className={inputCls} />
          </Field>
          <Field label="About" className="sm:col-span-2">
            <textarea rows={3} value={employeeData.about_me} onChange={(e) => handleChange("about_me", e.target.value)} className={inputCls} />
          </Field>
        </div>
      )}
    </>
  );

  const tabIndex = TABS.findIndex((t) => t.id === activeTab);
  const thCls = "px-4 py-3 font-semibold text-slate-500";
  const sortTh = "cursor-pointer select-none hover:text-slate-800";

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
            <p className="mt-1 text-sm text-slate-500">Manage employee profiles, hierarchy and bulk import</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={fetchHierarchy} disabled={hierarchyLoading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
              {hierarchyLoading ? "Loading..." : "Org Chart"}
            </button>
            <button type="button" onClick={exportEmployees} disabled={!filteredEmployees.length}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              Export CSV
            </button>
            <button type="button" onClick={() => { resetBulkForm(); setShowBulkModal(true); }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Bulk Import
            </button>
            <button type="button" onClick={openAdd}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              + Add Employee
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="All employees" value={employees.length} active={statusFilter === "all"}
            onClick={() => { setStatusFilter("all"); setPage(1); }} />
          {["active", "probation", "notice_period", "on_leave"].map((k) => (
            <StatCard key={k} label={STATUS_MAP[k].label} dot={STATUS_MAP[k].dot} value={statusCounts[k] || 0}
              active={statusFilter === k}
              onClick={() => { setStatusFilter(statusFilter === k ? "all" : k); setPage(1); }} />
          ))}
        </div>

        <Notification type="error" message={error} onDismiss={() => setError("")} />
        <Notification type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-sm">
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, email, mobile, ID..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-9 text-sm focus:border-red-500 focus:outline-none" />
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
              {searchInput && (
                <button type="button" onClick={() => setSearchInput("")} aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100">✕</button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All departments</option>
                {deptOptions.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All status</option>
                {EMPLOYEE_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters} className="text-sm font-medium text-red-600 hover:underline">
                  Clear filters
                </button>
              )}
              <span className="whitespace-nowrap text-sm text-slate-500">
                {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                <p className="text-sm font-medium text-slate-700">
                  {employees.length === 0 ? "No employees yet" : "No employees match these filters"}
                </p>
                <p className="text-xs text-slate-500">
                  {employees.length === 0 ? "Add your first employee or import a CSV." : "Change or clear the filters to see more."}
                </p>
                {employees.length === 0 ? (
                  <button type="button" onClick={openAdd} className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                    + Add Employee
                  </button>
                ) : (
                  <button type="button" onClick={clearFilters} className="mt-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className={`${thCls} ${sortTh}`} onClick={() => toggleSort("name")}>Employee{sortArrow("name")}</th>
                    <th className={`${thCls} ${sortTh}`} onClick={() => toggleSort("department_name")}>Department{sortArrow("department_name")}</th>
                    <th className={thCls}>Designation</th>
                    <th className={thCls}>Location</th>
                    <th className={`${thCls} ${sortTh}`} onClick={() => toggleSort("joining_date")}>Joining{sortArrow("joining_date")}</th>
                    <th className={thCls}>Status</th>
                    <th className={`${thCls} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedEmployees.map((emp) => (
                    <tr key={emp.employee_id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar emp={emp} />
                          <div className="min-w-0">
                            <button type="button" onClick={() => openView(emp)}
                              className="block max-w-[220px] truncate text-left font-medium text-slate-800 hover:text-red-600">
                              {getFullName(emp)}
                            </button>
                            <p className="truncate text-xs text-slate-500">{emp.company_email || emp.personal_email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{emp.department_name || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {emp.designation_name && emp.designation_name !== "—" ? emp.designation_name : emp.company_role || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{emp.location_name || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(emp.joining_date)}</td>
                      <td className="px-4 py-3"><StatusPill status={emp.employee_status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button type="button" onClick={() => openView(emp)}
                            className="rounded px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">View</button>
                          <button type="button" onClick={() => openEdit(emp)}
                            className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && filteredEmployees.length > 0 && (
            <Pagination page={page} pageSize={PAGE_SIZE} total={filteredEmployees.length} onPageChange={setPage} />
          )}
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {showViewModal && viewEmployee && (
        <ModalShell onClose={closeView} blur>
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <Avatar emp={viewEmployee} size="h-12 w-12 text-sm" />
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{getFullName(viewEmployee)}</h2>
                <p className="text-sm text-slate-500">
                  {viewEmployee.designation_name && viewEmployee.designation_name !== "—" ? viewEmployee.designation_name : viewEmployee.company_role || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={viewEmployee.employee_status} />
              <button type="button" onClick={closeView} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>
          </div>
          <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Basic information</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Employee ID" value={viewEmployee.employee_id} />
                <DetailItem label="Company email" value={viewEmployee.company_email} />
                <DetailItem label="Personal email" value={viewEmployee.personal_email} />
                <DetailItem label="Company mobile" value={viewEmployee.company_mobile} />
                <DetailItem label="Personal mobile" value={viewEmployee.personal_mobile} />
                <DetailItem label="Company landline" value={viewEmployee.company_landline} />
              </div>
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Work details</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Department" value={viewEmployee.department_name} />
                <DetailItem label="Designation" value={viewEmployee.designation_name} />
                <DetailItem label="Location" value={viewEmployee.location_name} />
                <DetailItem label="Employment type" value={viewEmployee.employment_type_name} />
                <DetailItem label="Reporting manager" value={viewEmployee.reporting_manager_name} />
                <DetailItem label="Role" value={viewEmployee.company_role} />
                <DetailItem label="Joining date" value={formatDate(viewEmployee.joining_date)} />
                <DetailItem label="Resignation date" value={formatDate(viewEmployee.resignation_date)} />
                <DetailItem label="Date of leaving" value={formatDate(viewEmployee.date_of_leaving)} />
                <DetailItem label="Current experience" value={viewEmployee.current_experience != null ? `${viewEmployee.current_experience} yrs` : ""} />
                <DetailItem label="Total experience" value={viewEmployee.total_experience != null ? `${viewEmployee.total_experience} yrs` : ""} />
              </div>
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Personal</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Gender" value={viewEmployee.gender} />
                <DetailItem label="Date of birth" value={formatDate(viewEmployee.dob)} />
                <DetailItem label="Blood group" value={viewEmployee.blood_group} />
                <DetailItem label="Marital status" value={viewEmployee.marital_status || viewEmployee.martial_status} />
                <DetailItem label="Emergency contact" value={viewEmployee.emergency_contact_number} />
                <DetailItem label="Aadhaar" value={viewEmployee.aadhaar_number ? `•••• •••• ${String(viewEmployee.aadhaar_number).slice(-4)}` : ""} />
                <DetailItem label="PAN" value={viewEmployee.pan_number} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DetailItem label="Current address" value={viewEmployee.current_address} />
                <DetailItem label="Permanent address" value={viewEmployee.permanent_address} />
              </div>
              {viewEmployee.about_me && <div className="mt-4"><DetailItem label="About" value={viewEmployee.about_me} /></div>}
            </section>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button type="button" onClick={closeView}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Close</button>
            <button type="button" onClick={() => { setShowViewModal(false); openEdit(viewEmployee); }}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700">Edit employee</button>
          </div>
        </ModalShell>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {isFormOpen && (
        <ModalShell onClose={closeModal}>
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">{showEditForm ? "Edit employee" : "Add employee"}</h2>
            <button type="button" onClick={closeModal} aria-label="Close" className="rounded p-1 text-slate-400 hover:bg-slate-100">✕</button>
          </div>
          <div className="flex overflow-x-auto border-b border-slate-200 px-6">
            {TABS.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium ${activeTab === tab.id ? "text-red-600" : "text-slate-500 hover:text-slate-700"}`}>
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
              </button>
            ))}
          </div>
          <form onSubmit={showEditForm ? handleEditSubmit : handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              {renderFormFields()}
              {formError && (
                <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{formError}</div>
              )}
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                {tabIndex > 0 && (
                  <button type="button" onClick={() => setActiveTab(TABS[tabIndex - 1].id)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">← Previous</button>
                )}
                {tabIndex < TABS.length - 1 && (
                  <button type="button" onClick={() => setActiveTab(TABS[tabIndex + 1].id)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Next →</button>
                )}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={closeModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
                  {saving ? "Saving..." : showEditForm ? "Save changes" : "Add employee"}
                </button>
              </div>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ================= BULK IMPORT MODAL ================= */}
      {showBulkModal && (
        <ModalShell onClose={closeBulk} maxW="max-w-5xl" blur>
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Bulk import employees</h2>
              <p className="mt-1 text-sm text-slate-500">Download the template, fill it in, then upload. Use names, not IDs.</p>
            </div>
            <button type="button" onClick={closeBulk} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">✕</button>
          </div>

          <div className="px-6 py-5">
            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">1</span>
                    Download CSV template
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-red-700">
                      Required: first_name, personal_email, password
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
                      Dates: YYYY-MM-DD or DD-MM-YYYY
                    </span>
                  </div>
                </div>
                <button type="button" onClick={downloadTemplate}
                  className="whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                  Download template
                </button>
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">2</span>
                Upload filled CSV
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input id="bulkFileInput" type="file" accept=".csv" onChange={handleBulkFileChange}
                  className="block w-full text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-red-600 hover:file:bg-red-100" />
                {bulkFileName && <span className="whitespace-nowrap text-sm text-slate-500">{bulkFileName}</span>}
              </div>
            </div>

            {bulkRows.length > 0 && (
              <div className="mb-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700">
                    {bulkRows.length} row{bulkRows.length !== 1 ? "s" : ""} loaded
                    {bulkIssueCount > 0 ? (
                      <span className="ml-2 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                        {bulkIssueCount} with issues
                      </span>
                    ) : (
                      <span className="ml-2 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                        All rows look valid
                      </span>
                    )}
                  </p>
                  <span className="text-xs text-slate-500">Showing first {Math.min(bulkRows.length, 10)}</span>
                </div>
                <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 font-medium text-slate-500">Row</th>
                        <th className="px-3 py-2 font-medium text-slate-500">Name</th>
                        <th className="px-3 py-2 font-medium text-slate-500">Personal email</th>
                        <th className="px-3 py-2 font-medium text-slate-500">Department</th>
                        <th className="px-3 py-2 font-medium text-slate-500">Designation</th>
                        <th className="px-3 py-2 font-medium text-slate-500">Joining</th>
                        <th className="px-3 py-2 font-medium text-slate-500">Check</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.slice(0, 10).map((row, i) => (
                        <tr key={row.__row} className="border-t border-slate-100">
                          <td className="px-3 py-1.5 text-slate-500">{row.__row}</td>
                          <td className="px-3 py-1.5 text-slate-700">{`${row.first_name || ""} ${row.last_name || ""}`.trim() || "—"}</td>
                          <td className="max-w-[180px] truncate px-3 py-1.5 text-slate-700">{row.personal_email || "—"}</td>
                          <td className="px-3 py-1.5 text-slate-700">{row.department_name || "—"}</td>
                          <td className="px-3 py-1.5 text-slate-700">{row.designation_name || "—"}</td>
                          <td className="px-3 py-1.5 text-slate-700">{row.joining_date || "—"}</td>
                          <td className="px-3 py-1.5">
                            {bulkValidation[i].length === 0 ? (
                              <span className="text-emerald-600">OK</span>
                            ) : (
                              <span className="text-red-600">{bulkValidation[i].join(", ")}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {bulkIssueCount > 0 && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <p className="font-medium">Rows with issues (CSV row numbers):</p>
                    <ul className="mt-1 max-h-24 space-y-0.5 overflow-auto">
                      {bulkRows.map((r, i) => bulkValidation[i].length > 0 && (
                        <li key={r.__row}>Row {r.__row}: {bulkValidation[i].join(", ")}</li>
                      )).filter(Boolean).slice(0, 20)}
                    </ul>
                    <p className="mt-1">These rows will probably fail on import. Fix the CSV and upload again, or continue and review the errors after.</p>
                  </div>
                )}
              </div>
            )}

            {bulkResult && (
              <div className={`mb-5 rounded-xl border p-4 ${
                bulkResult.added > 0 && bulkResult.failed === 0 ? "border-emerald-200 bg-emerald-50"
                  : bulkResult.added > 0 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"
              }`}>
                <p className={`font-medium ${
                  bulkResult.added > 0 && bulkResult.failed === 0 ? "text-emerald-800"
                    : bulkResult.added > 0 ? "text-amber-800" : "text-red-800"
                }`}>
                  {bulkResult.added > 0 && bulkResult.failed === 0
                    ? "All employees imported successfully"
                    : bulkResult.added > 0
                    ? `Partial success: ${bulkResult.added} added, ${bulkResult.failed} failed`
                    : `All ${bulkResult.failed} employees failed`}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Total: {bulkResult.total} • Added: <span className="font-medium text-emerald-700">{bulkResult.added}</span> • Failed: <span className="font-medium text-red-700">{bulkResult.failed}</span>
                </p>

                {bulkResult.created_employees?.length > 0 && (
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs font-medium text-emerald-700">Added</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {bulkResult.created_employees.slice(0, 10).map((emp, i) => (
                        <span key={i} className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-xs text-emerald-700">
                          {emp.email}
                        </span>
                      ))}
                      {bulkResult.created_employees.length > 10 && (
                        <span className="text-xs text-slate-500">+{bulkResult.created_employees.length - 10} more</span>
                      )}
                    </div>
                  </div>
                )}

                {bulkResult.errors?.length > 0 && (
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs font-medium text-red-700">Errors</p>
                    <div className="mt-1 max-h-40 space-y-1 overflow-auto">
                      {bulkResult.errors.slice(0, 20).map((er, i) => (
                        <div key={i} className="flex items-start gap-2 rounded border border-red-200 bg-white px-2 py-1.5 text-xs">
                          <span className="whitespace-nowrap font-semibold text-red-700">Row {er.row}:</span>
                          <span className="text-red-700">{er.error}</span>
                        </div>
                      ))}
                      {bulkResult.errors.length > 20 && (
                        <div className="text-xs text-slate-500">+{bulkResult.errors.length - 20} more errors</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {bulkError && (
              <div role="alert" className="mb-5 whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {bulkError}
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
              <button type="button" onClick={closeBulk}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {bulkResult ? "Done" : "Cancel"}
              </button>
              <button type="button" onClick={resetBulkForm}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Reset</button>
              <button type="button" onClick={handleBulkSubmit} disabled={bulkSaving || bulkRows.length === 0 || !!bulkResult}
                className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                {bulkSaving ? "Importing..." : `Import ${bulkRows.length} employee${bulkRows.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ================= ORG CHART ================= */}
      {showHierarchy && (
        <ModalShell onClose={() => { setShowHierarchy(false); setHierarchyData(null); }} maxW="max-w-5xl" blur>
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Organization chart</h2>
              <p className="text-sm text-slate-500">
                {hierarchyData?.total_employees || 0} employees • {hierarchyData?.total_roots || 0} top-level
              </p>
            </div>
            <button type="button" aria-label="Close" onClick={() => { setShowHierarchy(false); setHierarchyData(null); }}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">✕</button>
          </div>
          <div className="max-h-[72vh] overflow-auto bg-slate-50 px-6 py-6">
            {!hierarchyData?.hierarchy?.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-medium text-slate-600">No hierarchy data found</p>
                <p className="mt-1 text-sm text-slate-400">Assign reporting managers to build the org chart.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {hierarchyData.hierarchy.map((node) => (
                  <HierarchyNode key={node.employee_id || node.user_id} node={node} level={0} />
                ))}
              </div>
            )}
          </div>
        </ModalShell>
      )}
    </div>
  );
}