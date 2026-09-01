
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { api } from "@/lib/api";

// /* ============================================================
//    Hierarchy Node
// ============================================================ */
// function HierarchyNode({ node, level = 0 }) {
//   const [expanded, setExpanded] = useState(true);
//   const hasChildren = node.reports && node.reports.length > 0;

//   const initials = (node.name || "E")
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <div className="relative">
//       {level > 0 && (
//         <>
//           <div className="absolute left-[-20px] top-0 h-full w-px bg-[#e2e8f0]" />
//           <div className="absolute left-[-20px] top-[28px] h-px w-5 bg-[#e2e8f0]" />
//         </>
//       )}

//       <div className="relative flex items-start gap-3 pb-4">
//         <div className="group flex min-w-[300px] max-w-[340px] items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3.5 shadow-sm transition-all hover:border-[#E42527]/40 hover:shadow-md">
//           <div className="relative shrink-0">
//             <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#E42527] to-[#c91f21] text-sm font-semibold text-white shadow-sm">
//               {initials}
//             </div>

//             {hasChildren && (
//               <button
//                 type="button"
//                 onClick={() => setExpanded(!expanded)}
//                 className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f1f5f9] text-[#64748b] shadow-sm hover:bg-[#e2e8f0]"
//               >
//                 <svg
//                   className={`h-3 w-3 transition-transform duration-200 ${
//                     expanded ? "rotate-90" : ""
//                   }`}
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2.5}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             )}
//           </div>

//           <div className="min-w-0 flex-1">
//             <p className="truncate text-sm font-semibold text-[#0f172a]">
//               {node.name || "—"}
//             </p>

//             <p className="truncate text-xs text-[#64748b]">
//               {node.designation || "No designation"}
//             </p>

//             <div className="mt-1.5 flex items-center gap-2">
//               <span
//                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
//                   (node.employee_status || "active").toLowerCase() === "active"
//                     ? "bg-emerald-50 text-emerald-700"
//                     : "bg-slate-100 text-slate-600"
//                 }`}
//               >
//                 {node.employee_status || "active"}
//               </span>

//               {hasChildren && (
//                 <span className="text-[10px] text-[#94a3b8]">
//                   {node.reports.length} report
//                   {node.reports.length !== 1 ? "s" : ""}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {hasChildren && expanded && (
//         <div className="ml-10 space-y-0 border-l border-[#e2e8f0] pl-5">
//           {node.reports.map((child) => (
//             <HierarchyNode
//               key={child.employee_id || child.user_id}
//               node={child}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    Initial Employee
// ============================================================ */
// const initialEmployee = {
//   first_name: "",
//   last_name: "",
//   company_email: "",
//   personal_email: "",
//   personal_mobile: "",
//   company_mobile: "",

//   department_id: "",
//   designation_id: "",
//   location_id: "",

//   // IMPORTANT:
//   // This will contain EMPLOYEE ID, not USER ID
//   reporting_manager: "",

//   employment_type_id: "",

//   joining_date: "",
//   dob: "",
//   gender: "",
//   blood_group: "",
//   martial_status: "",
//   company_role: "",

//   current_address: "",
//   permanent_address: "",
//   emergency_contact_number: "",

//   aadhaar_number: "",
//   pan_number: "",

//   current_experience: "",
//   total_experience: "",
//   about_me: "",

//   employee_status: "active",

//   password: "",
//   company_landline: "",

//   date_of_leaving: "",
//   resignation_date: "",
// };

// /* ============================================================
//    Helpers
// ============================================================ */
// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;

//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) => {
//         const field = Array.isArray(e.loc)
//           ? e.loc.slice(1).join(".")
//           : "";

//         return field ? `${field}: ${e.msg}` : e.msg;
//       })
//       .join(" • ");
//   }

//   if (typeof detail === "string") {
//     return detail;
//   }

//   if (detail && typeof detail === "object") {
//     return JSON.stringify(detail);
//   }

//   return err?.message || "Something went wrong";
// };

// const formatDate = (date) => {
//   if (!date) return "—";

//   try {
//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return date;
//   }
// };

// /* ============================================================
//    MAIN PAGE
// ============================================================ */
// export default function EmployeesPage() {
//   const [employees, setEmployees] = useState([]);
//   const [employeeData, setEmployeeData] = useState(initialEmployee);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewEmployee, setViewEmployee] = useState(null);

//   const [editingEmployeeId, setEditingEmployeeId] = useState(null);

//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [bulkFile, setBulkFile] = useState(null);
//   const [bulkPreview, setBulkPreview] = useState([]);
//   const [bulkSaving, setBulkSaving] = useState(false);
//   const [bulkResult, setBulkResult] = useState(null);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [activeTab, setActiveTab] = useState("basic");

//   const [showHierarchy, setShowHierarchy] = useState(false);
//   const [hierarchyData, setHierarchyData] = useState(null);
//   const [hierarchyLoading, setHierarchyLoading] = useState(false);

//   const [employmentTypes, setEmploymentTypes] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [loadingMasters, setLoadingMasters] = useState(false);

//   /* ============================================================
//      FETCH EMPLOYEES
//   ============================================================ */
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       const empRes = await api.get("/api/v1/get/employees");

//       const d = empRes?.data;

//       let list = [];

//       if (Array.isArray(d?.employees)) {
//         list = d.employees;
//       } else if (Array.isArray(d?.data)) {
//         list = d.data;
//       } else if (Array.isArray(d)) {
//         list = d;
//       }

//       setEmployees(list);
//     } catch (err) {
//       setError(formatApiError(err));
//       setEmployees([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ============================================================
//      FETCH HIERARCHY
//   ============================================================ */
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

//   /* ============================================================
//      MASTER DATA
//   ============================================================ */
//   const extractArray = (res) => {
//     const d = res?.data;

//     if (Array.isArray(d)) return d;
//     if (Array.isArray(d?.data)) return d.data;
//     if (Array.isArray(d?.departments)) return d.departments;
//     if (Array.isArray(d?.designations)) return d.designations;
//     if (Array.isArray(d?.locations)) return d.locations;
//     if (Array.isArray(d?.items)) return d.items;
//     if (Array.isArray(d?.results)) return d.results;

//     return [];
//   };

//   const loadMasters = useCallback(async () => {
//     setLoadingMasters(true);

//     try {
//       const [
//         etRes,
//         deptRes,
//         desigRes,
//         locRes,
//       ] = await Promise.all([
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
//     if (showAddForm || showEditForm) {
//       loadMasters();
//     }
//   }, [
//     showAddForm,
//     showEditForm,
//     loadMasters,
//   ]);

//   /* ============================================================
//      FORM CHANGE
//   ============================================================ */
//   const handleChange = (field, value) => {
//     setEmployeeData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   /* ============================================================
//      IMPORTANT FIX
     
//      reporting_manager MUST contain employee_id.
     
//      NOT user_id.
//   ============================================================ */
//   const managerOptions = (
//     Array.isArray(employees)
//       ? employees
//       : []
//   )
//     .filter((employee) => employee.employee_id)
//     .map((employee) => ({
//       employee_id: employee.employee_id,

//       name: employee.first_name
//         ? `${employee.first_name} ${
//             employee.last_name || ""
//           }`.trim()
//         : employee.name || employee.employee_id,
//     }));

//   /* ============================================================
//      BUILD PAYLOAD
//   ============================================================ */
//   const buildPayload = () => ({
//     first_name: employeeData.first_name || null,

//     last_name: employeeData.last_name || null,

//     company_email:
//       employeeData.company_email || null,

//     personal_email:
//       employeeData.personal_email || null,

//     personal_mobile:
//       employeeData.personal_mobile || null,

//     company_mobile:
//       employeeData.company_mobile || null,

//     department_id:
//       employeeData.department_id,

//     designation_id:
//       employeeData.designation_id,

//     location_id:
//       employeeData.location_id,

//     /*
//       IMPORTANT:
//       This is manager EMPLOYEE ID.
//     */
//     reporting_manager:
//       employeeData.reporting_manager || null,

//     employment_type_id:
//       employeeData.employment_type_id || null,

//     joining_date:
//       employeeData.joining_date || null,

//     date_of_leaving:
//       employeeData.date_of_leaving || null,

//     resignation_date:
//       employeeData.resignation_date || null,

//     dob:
//       employeeData.dob || null,

//     gender:
//       employeeData.gender || null,

//     blood_group:
//       employeeData.blood_group || null,

//     martial_status:
//       employeeData.martial_status || null,

//     company_role:
//       employeeData.company_role || null,

//     current_address:
//       employeeData.current_address || null,

//     permanent_address:
//       employeeData.permanent_address || null,

//     emergency_contact_number:
//       employeeData.emergency_contact_number || null,

//     aadhaar_number:
//       employeeData.aadhaar_number || null,

//     pan_number:
//       employeeData.pan_number || null,

//     about_me:
//       employeeData.about_me || null,

//     employee_status:
//       employeeData.employee_status || "active",

//     company_landline:
//       employeeData.company_landline || null,

//     password:
//       employeeData.password || null,

//     current_experience:
//       employeeData.current_experience
//         ? parseFloat(employeeData.current_experience)
//         : null,

//     total_experience:
//       employeeData.total_experience
//         ? parseFloat(employeeData.total_experience)
//         : null,
//   });

//   /* ============================================================
//      ADD EMPLOYEE
//   ============================================================ */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setSaving(true);
//     setError("");

//     try {
//       await api.post(
//         "/api/v1/add/employee",
//         buildPayload()
//       );

//       setEmployeeData({
//         ...initialEmployee,
//       });

//       setShowAddForm(false);
//       setActiveTab("basic");

//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ============================================================
//      EDIT EMPLOYEE
//   ============================================================ */
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();

//     if (!editingEmployeeId) {
//       return;
//     }

//     setSaving(true);
//     setError("");

//     try {
//       const payload = buildPayload();

//       delete payload.password;

//       await api.put(
//         `/api/v1/edit/employee/${editingEmployeeId}`,
//         payload
//       );

//       setShowEditForm(false);
//       setEditingEmployeeId(null);

//       setEmployeeData({
//         ...initialEmployee,
//       });

//       setActiveTab("basic");

//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ============================================================
//      OPEN EDIT
//   ============================================================ */
//   const openEdit = (emp) => {
//     setEditingEmployeeId(emp.employee_id);

//     setEmployeeData({
//       first_name:
//         emp.first_name || "",

//       last_name:
//         emp.last_name || "",

//       company_email:
//         emp.company_email || "",

//       personal_email:
//         emp.personal_email || "",

//       personal_mobile:
//         emp.personal_mobile || "",

//       company_mobile:
//         emp.company_mobile || "",

//       department_id:
//         emp.department_id || "",

//       designation_id:
//         emp.designation_id || "",

//       location_id:
//         emp.location_id || "",

//       /*
//         API already returns manager employee_id
//       */
//       reporting_manager:
//         emp.reporting_manager || "",

//       employment_type_id:
//         emp.employment_type_id || "",

//       joining_date:
//         emp.joining_date
//           ? emp.joining_date.slice(0, 10)
//           : "",

//       dob:
//         emp.dob
//           ? emp.dob.slice(0, 10)
//           : "",

//       gender:
//         emp.gender || "",

//       blood_group:
//         emp.blood_group || "",

//       martial_status:
//         emp.martial_status ||
//         emp.marital_status ||
//         "",

//       company_role:
//         emp.company_role || "",

//       current_address:
//         emp.current_address || "",

//       permanent_address:
//         emp.permanent_address || "",

//       emergency_contact_number:
//         emp.emergency_contact_number || "",

//       aadhaar_number:
//         emp.aadhaar_number || "",

//       pan_number:
//         emp.pan_number || "",

//       current_experience:
//         emp.current_experience ?? "",

//       total_experience:
//         emp.total_experience ?? "",

//       about_me:
//         emp.about_me || "",

//       employee_status:
//         emp.employee_status || "active",

//       password: "",

//       company_landline:
//         emp.company_landline || "",

//       date_of_leaving:
//         emp.date_of_leaving
//           ? emp.date_of_leaving.slice(0, 10)
//           : "",

//       resignation_date:
//         emp.resignation_date
//           ? emp.resignation_date.slice(0, 10)
//           : "",
//     });

//     setActiveTab("basic");
//     setError("");
//     setShowEditForm(true);
//   };

//   /* ============================================================
//      VIEW
//   ============================================================ */
//   const openView = (emp) => {
//     setViewEmployee(emp);
//     setShowViewModal(true);
//   };

//   /* ============================================================
//      BULK CSV
//   ============================================================ */
//   const handleBulkFile = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     setBulkFile(file);
//     setBulkResult(null);

//     const reader = new FileReader();

//     reader.onload = (ev) => {
//       const text = ev.target.result;

//       const lines = text
//         .split(/\r?\n/)
//         .filter(Boolean);

//       if (lines.length < 2) {
//         setBulkPreview([]);
//         return;
//       }

//       const headers = lines[0]
//         .split(",")
//         .map((h) => h.trim().toLowerCase());

//       const rows = lines
//         .slice(1)
//         .map((line) => {
//           const values = line
//             .split(",")
//             .map((v) => v.trim());

//           const obj = {};

//           headers.forEach((h, i) => {
//             obj[h] = values[i] || "";
//           });

//           return obj;
//         });

//       setBulkPreview(rows.slice(0, 50));
//     };

//     reader.readAsText(file);
//   };

//   /* ============================================================
//      BULK SUBMIT
//   ============================================================ */
//   const handleBulkSubmit = async () => {
//     if (!bulkFile || bulkPreview.length === 0) {
//       return;
//     }

//     setBulkSaving(true);
//     setError("");
//     setBulkResult(null);

//     try {
//       const employeesPayload =
//         bulkPreview.map((row) => ({
//           first_name:
//             row.first_name || null,

//           last_name:
//             row.last_name || null,

//           personal_email:
//             row.personal_email || null,

//           personal_mobile:
//             row.personal_mobile || null,

//           company_email:
//             row.company_email || null,

//           company_mobile:
//             row.company_mobile || null,

//           department_id:
//             row.department_id,

//           designation_id:
//             row.designation_id,

//           location_id:
//             row.location_id,

//           /*
//             CSV should also contain
//             manager EMPLOYEE ID
//           */
//           reporting_manager:
//             row.reporting_manager || null,

//           employment_type_id:
//             row.employment_type_id || null,

//           joining_date:
//             row.joining_date || null,

//           dob:
//             row.dob || null,

//           gender:
//             row.gender || null,

//           blood_group:
//             row.blood_group || null,

//           martial_status:
//             row.martial_status ||
//             row.marital_status ||
//             null,

//           company_role:
//             row.company_role || null,

//           current_address:
//             row.current_address || null,

//           permanent_address:
//             row.permanent_address || null,

//           emergency_contact_number:
//             row.emergency_contact_number || null,

//           aadhaar_number:
//             row.aadhaar_number || null,

//           pan_number:
//             row.pan_number || null,

//           about_me:
//             row.about_me || null,

//           employee_status:
//             row.employee_status || "active",

//           password:
//             row.password || null,

//           current_experience:
//             row.current_experience
//               ? parseFloat(row.current_experience)
//               : null,

//           total_experience:
//             row.total_experience
//               ? parseFloat(row.total_experience)
//               : null,
//         }));

//       const res = await api.post(
//         "/api/v1/bulk/add/employees",
//         {
//           employees: employeesPayload,
//         }
//       );

//       setBulkResult(res?.data);

//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setBulkSaving(false);
//     }
//   };

//   /* ============================================================
//      FILTER
//   ============================================================ */
//   const filteredEmployees = (
//     Array.isArray(employees)
//       ? employees
//       : []
//   ).filter((emp) => {
//     const fullName =
//       `${emp.first_name || ""} ${
//         emp.last_name || ""
//       } ${emp.name || ""}`.toLowerCase();

//     const email = (
//       emp.company_email ||
//       emp.personal_email ||
//       ""
//     ).toLowerCase();

//     const q = search.toLowerCase();

//     const matchSearch =
//       fullName.includes(q) ||
//       email.includes(q);

//     const status = (
//       emp.employee_status || "active"
//     ).toLowerCase();

//     const matchStatus =
//       statusFilter === "all" ||
//       status === statusFilter;

//     return matchSearch && matchStatus;
//   });

//   /* ============================================================
//      INITIALS
//   ============================================================ */
//   const getInitials = (emp) => {
//     const first =
//       emp.first_name?.[0] ||
//       emp.name?.[0] ||
//       "E";

//     const last =
//       emp.last_name?.[0] || "";

//     return (
//       first + last
//     ).toUpperCase();
//   };

//   /* ============================================================
//      CLOSE MODAL
//   ============================================================ */
//   const closeModal = () => {
//     setShowAddForm(false);
//     setShowEditForm(false);
//     setEditingEmployeeId(null);
//     setError("");

//     setEmployeeData({
//       ...initialEmployee,
//     });

//     setActiveTab("basic");
//   };

//   /* ============================================================
//      MASTER HELPERS
//   ============================================================ */
//   const getName = (item, ...keys) => {
//     for (const key of keys) {
//       if (item?.[key]) {
//         return item[key];
//       }
//     }

//     return "—";
//   };

//   const safeDepartments =
//     Array.isArray(departments)
//       ? departments
//       : [];

//   const safeDesignations =
//     Array.isArray(designations)
//       ? designations
//       : [];

//   const safeLocations =
//     Array.isArray(locations)
//       ? locations
//       : [];

//   const safeEmploymentTypes =
//     Array.isArray(employmentTypes)
//       ? employmentTypes
//       : [];

//   /* ============================================================
//      FORM FIELDS
//   ============================================================ */
//   const renderFormFields = () => (
//     <>
//       {/* ================= BASIC ================= */}
//       {activeTab === "basic" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               First Name
//             </label>

//             <input
//               value={employeeData.first_name}
//               onChange={(e) =>
//                 handleChange(
//                   "first_name",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Last Name
//             </label>

//             <input
//               value={employeeData.last_name}
//               onChange={(e) =>
//                 handleChange(
//                   "last_name",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Company Email
//             </label>

//             <input
//               type="email"
//               value={employeeData.company_email}
//               onChange={(e) =>
//                 handleChange(
//                   "company_email",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Personal Email
//             </label>

//             <input
//               type="email"
//               value={employeeData.personal_email}
//               onChange={(e) =>
//                 handleChange(
//                   "personal_email",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Company Mobile
//             </label>

//             <input
//               value={employeeData.company_mobile}
//               onChange={(e) =>
//                 handleChange(
//                   "company_mobile",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Personal Mobile
//             </label>

//             <input
//               value={employeeData.personal_mobile}
//               onChange={(e) =>
//                 handleChange(
//                   "personal_mobile",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Gender
//             </label>

//             <select
//               value={employeeData.gender}
//               onChange={(e) =>
//                 handleChange(
//                   "gender",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             >
//               <option value="">Select</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Date of Birth
//             </label>

//             <input
//               type="date"
//               value={employeeData.dob}
//               onChange={(e) =>
//                 handleChange(
//                   "dob",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>
//         </div>
//       )}

//       {/* ================= WORK ================= */}
//       {activeTab === "work" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           {/* Department */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Department{" "}
//               <span className="text-[#E42527]">
//                 *
//               </span>
//             </label>

//             <select
//               value={employeeData.department_id}
//               onChange={(e) =>
//                 handleChange(
//                   "department_id",
//                   e.target.value
//                 )
//               }
//               required
//               disabled={loadingMasters}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] disabled:bg-gray-50"
//             >
//               <option value="">
//                 {loadingMasters
//                   ? "Loading..."
//                   : "Select Department"}
//               </option>

//               {safeDepartments.map((d) => (
//                 <option
//                   key={
//                     d.department_id ||
//                     d.id
//                   }
//                   value={
//                     d.department_id ||
//                     d.id
//                   }
//                 >
//                   {getName(
//                     d,
//                     "name",
//                     "department_name"
//                   )}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Designation */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Designation{" "}
//               <span className="text-[#E42527]">
//                 *
//               </span>
//             </label>

//             <select
//               value={employeeData.designation_id}
//               onChange={(e) =>
//                 handleChange(
//                   "designation_id",
//                   e.target.value
//                 )
//               }
//               required
//               disabled={loadingMasters}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] disabled:bg-gray-50"
//             >
//               <option value="">
//                 {loadingMasters
//                   ? "Loading..."
//                   : "Select Designation"}
//               </option>

//               {safeDesignations.map((d) => (
//                 <option
//                   key={
//                     d.designation_id ||
//                     d.id
//                   }
//                   value={
//                     d.designation_id ||
//                     d.id
//                   }
//                 >
//                   {getName(
//                     d,
//                     "name",
//                     "designation_name",
//                     "job_title"
//                   )}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Location */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Location{" "}
//               <span className="text-[#E42527]">
//                 *
//               </span>
//             </label>

//             <select
//               value={employeeData.location_id}
//               onChange={(e) =>
//                 handleChange(
//                   "location_id",
//                   e.target.value
//                 )
//               }
//               required
//               disabled={loadingMasters}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] disabled:bg-gray-50"
//             >
//               <option value="">
//                 {loadingMasters
//                   ? "Loading..."
//                   : "Select Location"}
//               </option>

//               {safeLocations.map((l) => (
//                 <option
//                   key={
//                     l.location_id ||
//                     l.id
//                   }
//                   value={
//                     l.location_id ||
//                     l.id
//                   }
//                 >
//                   {getName(
//                     l,
//                     "name",
//                     "location_name",
//                     "city"
//                   )}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* ====================================================
//               REPORTING MANAGER
              
//               FIX:
//               value = employee.employee_id
//               NOT employee.user_id
//           ==================================================== */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Reporting Manager
//             </label>

//             <select
//               value={
//                 employeeData.reporting_manager ||
//                 ""
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "reporting_manager",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             >
//               <option value="">
//                 No Manager / Top Level
//               </option>

//               {managerOptions.map((manager) => (
//                 <option
//                   key={manager.employee_id}
//                   value={manager.employee_id}
//                 >
//                   {manager.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Employment Type */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Employment Type
//             </label>

//             <select
//               value={
//                 employeeData.employment_type_id
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "employment_type_id",
//                   e.target.value
//                 )
//               }
//               disabled={loadingMasters}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] disabled:bg-gray-50"
//             >
//               <option value="">
//                 {loadingMasters
//                   ? "Loading..."
//                   : "Select type"}
//               </option>

//               {safeEmploymentTypes.map((et) => (
//                 <option
//                   key={
//                     et.employment_type_id
//                   }
//                   value={
//                     et.employment_type_id
//                   }
//                 >
//                   {et.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Joining Date */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Joining Date
//             </label>

//             <input
//               type="date"
//               value={employeeData.joining_date}
//               onChange={(e) =>
//                 handleChange(
//                   "joining_date",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           {/* Company Role */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Company Role
//             </label>

//             <input
//               value={employeeData.company_role}
//               onChange={(e) =>
//                 handleChange(
//                   "company_role",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           {/* Status */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Employee Status
//             </label>

//             <select
//               value={employeeData.employee_status}
//               onChange={(e) =>
//                 handleChange(
//                   "employee_status",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             >
//               <option value="active">
//                 Active
//               </option>

//               <option value="inactive">
//                 Inactive
//               </option>

//               <option value="on_notice">
//                 On Notice
//               </option>

//               <option value="terminated">
//                 Terminated
//               </option>
//             </select>
//           </div>

//           {/* Date of Leaving */}
//           {employeeData.employee_status ===
//             "inactive" && (
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                 Date of Leaving
//               </label>

//               <input
//                 type="date"
//                 value={
//                   employeeData.date_of_leaving
//                 }
//                 onChange={(e) =>
//                   handleChange(
//                     "date_of_leaving",
//                     e.target.value
//                   )
//                 }
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//               />
//             </div>
//           )}

//           {/* Resignation Date */}
//           {employeeData.employee_status ===
//             "on_notice" && (
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                 Resignation Date
//               </label>

//               <input
//                 type="date"
//                 value={
//                   employeeData.resignation_date
//                 }
//                 onChange={(e) =>
//                   handleChange(
//                     "resignation_date",
//                     e.target.value
//                   )
//                 }
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//               />
//             </div>
//           )}
//         </div>
//       )}

//       {/* ================= PERSONAL ================= */}
//       {activeTab === "personal" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Blood Group
//             </label>

//             <select
//               value={employeeData.blood_group}
//               onChange={(e) =>
//                 handleChange(
//                   "blood_group",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             >
//               <option value="">Select</option>

//               {[
//                 "A+",
//                 "A-",
//                 "B+",
//                 "B-",
//                 "AB+",
//                 "AB-",
//                 "O+",
//                 "O-",
//               ].map((bg) => (
//                 <option
//                   key={bg}
//                   value={bg}
//                 >
//                   {bg}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Marital Status
//             </label>

//             <select
//               value={
//                 employeeData.martial_status
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "martial_status",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             >
//               <option value="">Select</option>
//               <option value="Single">
//                 Single
//               </option>
//               <option value="Married">
//                 Married
//               </option>
//               <option value="Divorced">
//                 Divorced
//               </option>
//               <option value="Widowed">
//                 Widowed
//               </option>
//             </select>
//           </div>

//           <div className="sm:col-span-2">
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Current Address
//             </label>

//             <textarea
//               value={
//                 employeeData.current_address
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "current_address",
//                   e.target.value
//                 )
//               }
//               rows={2}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div className="sm:col-span-2">
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Permanent Address
//             </label>

//             <textarea
//               value={
//                 employeeData.permanent_address
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "permanent_address",
//                   e.target.value
//                 )
//               }
//               rows={2}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Emergency Contact
//             </label>

//             <input
//               value={
//                 employeeData.emergency_contact_number
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "emergency_contact_number",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Aadhaar Number
//             </label>

//             <input
//               value={
//                 employeeData.aadhaar_number
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "aadhaar_number",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               PAN Number
//             </label>

//             <input
//               value={employeeData.pan_number}
//               onChange={(e) =>
//                 handleChange(
//                   "pan_number",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>
//         </div>
//       )}

//       {/* ================= OTHER ================= */}
//       {activeTab === "other" && (
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Current Experience (years)
//             </label>

//             <input
//               type="number"
//               step="0.1"
//               value={
//                 employeeData.current_experience
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "current_experience",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Total Experience (years)
//             </label>

//             <input
//               type="number"
//               step="0.1"
//               value={
//                 employeeData.total_experience
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "total_experience",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div className="sm:col-span-2">
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               About Me
//             </label>

//             <textarea
//               value={employeeData.about_me}
//               onChange={(e) =>
//                 handleChange(
//                   "about_me",
//                   e.target.value
//                 )
//               }
//               rows={3}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//               Company Landline
//             </label>

//             <input
//               value={
//                 employeeData.company_landline
//               }
//               onChange={(e) =>
//                 handleChange(
//                   "company_landline",
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>

//           {!showEditForm && (
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                 Password (optional)
//               </label>

//               <input
//                 type="password"
//                 value={employeeData.password}
//                 onChange={(e) =>
//                   handleChange(
//                     "password",
//                     e.target.value
//                   )
//                 }
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );

//   /* ============================================================
//      DETAIL ITEM
//   ============================================================ */
//   const DetailItem = ({
//     label,
//     value,
//   }) => (
//     <div>
//       <p className="text-xs font-medium text-[#94a3b8]">
//         {label}
//       </p>

//       <p className="mt-0.5 text-sm text-[#0f172a]">
//         {value || "—"}
//       </p>
//     </div>
//   );

//   /* ============================================================
//      RETURN
//   ============================================================ */
//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">

//       {/* ======================================================
//           HEADER
//       ====================================================== */}
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
//             Employees
//           </h1>

//           <p className="mt-1 text-sm text-[#6b7280]">
//             Manage employee records, hierarchy & bulk import
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={fetchHierarchy}
//             disabled={hierarchyLoading}
//             className="inline-flex items-center gap-2 rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm hover:bg-[#f9fafb] disabled:opacity-60"
//           >
//             Org Chart
//           </button>

//           <button
//             onClick={() =>
//               setShowBulkModal(true)
//             }
//             className="inline-flex items-center gap-2 rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm hover:bg-[#f9fafb]"
//           >
//             Bulk Import
//           </button>

//           <button
//             onClick={() => {
//               setEmployeeData({
//                 ...initialEmployee,
//               });

//               setShowAddForm(true);
//               setShowEditForm(false);
//               setActiveTab("basic");
//               setError("");
//             }}
//             className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
//           >
//             + Add Employee
//           </button>
//         </div>
//       </div>

//       {/* ======================================================
//           ERROR
//       ====================================================== */}
//       {error &&
//         !showAddForm &&
//         !showEditForm &&
//         !showBulkModal &&
//         !showHierarchy &&
//         !showViewModal && (
//           <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
//             {error}
//           </div>
//         )}

//       {/* ======================================================
//           TABLE
//       ====================================================== */}
//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">

//           <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">

//             <div className="relative w-full max-w-xs">
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(e.target.value)
//                 }
//                 placeholder="Search by name or email..."
//                 className="w-full rounded-md border border-[#d1d5db] py-2 pl-3 pr-3 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//               />
//             </div>

//             <select
//               value={statusFilter}
//               onChange={(e) =>
//                 setStatusFilter(e.target.value)
//               }
//               className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             >
//               <option value="all">
//                 All Status
//               </option>

//               <option value="active">
//                 Active
//               </option>

//               <option value="inactive">
//                 Inactive
//               </option>

//               <option value="on_notice">
//                 On Notice
//               </option>

//               <option value="terminated">
//                 Terminated
//               </option>
//             </select>
//           </div>

//           <div className="text-sm text-[#6b7280]">
//             {filteredEmployees.length} employee
//             {filteredEmployees.length !== 1
//               ? "s"
//               : ""}
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex items-center justify-center py-16 text-sm text-[#6b7280]">
//               Loading employees...
//             </div>
//           ) : filteredEmployees.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <p className="text-sm font-medium text-[#374151]">
//                 No employees found
//               </p>
//             </div>
//           ) : (
//             <table className="w-max min-w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     #
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Employee
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Employee ID
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Company Email
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Department
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Designation
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Location
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Reporting Manager
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Joining Date
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Status
//                   </th>

//                   <th className="px-4 py-3 font-medium text-[#6b7280]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {filteredEmployees.map(
//                   (emp, index) => (
//                     <tr
//                       key={
//                         emp.employee_id ||
//                         index
//                       }
//                       className="group hover:bg-[#fafafa]"
//                     >
//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {index + 1}
//                       </td>

//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fef2f2] text-xs font-semibold text-[#E42527]">
//                             {getInitials(emp)}
//                           </div>

//                           <span className="font-medium text-[#1a1a1a]">
//                             {emp.first_name
//                               ? `${emp.first_name} ${
//                                   emp.last_name ||
//                                   ""
//                                 }`.trim()
//                               : emp.name ||
//                                 "—"}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {emp.employee_id ||
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {emp.company_email ||
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {emp.department_name ||
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {emp.designation_name ||
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {emp.location_name ||
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {emp.reporting_manager_name ||
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3 text-[#6b7280]">
//                         {formatDate(
//                           emp.joining_date
//                         )}
//                       </td>

//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                             (
//                               emp.employee_status ||
//                               "active"
//                             ).toLowerCase() ===
//                             "active"
//                               ? "bg-green-50 text-green-700"
//                               : "bg-gray-100 text-gray-600"
//                           }`}
//                         >
//                           {emp.employee_status ||
//                             "active"}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <button
//                             onClick={() =>
//                               openView(emp)
//                             }
//                             className="rounded px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f3f4f6]"
//                           >
//                             View
//                           </button>

//                           <button
//                             onClick={() =>
//                               openEdit(emp)
//                             }
//                             className="rounded px-2.5 py-1 text-xs font-medium text-[#E42527] hover:bg-[#fef2f2]"
//                           >
//                             Edit
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ======================================================
//           VIEW MODAL
//       ====================================================== */}
//       {showViewModal &&
//         viewEmployee && (
//           <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 backdrop-blur-sm">
//             <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

//               <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
//                 <div>
//                   <h2 className="text-lg font-semibold text-[#0f172a]">
//                     {viewEmployee.first_name
//                       ? `${viewEmployee.first_name} ${
//                           viewEmployee.last_name ||
//                           ""
//                         }`.trim()
//                       : viewEmployee.name ||
//                         "Employee"}
//                   </h2>

//                   <p className="text-sm text-[#64748b]">
//                     {viewEmployee.designation_name ||
//                       viewEmployee.company_role ||
//                       "—"}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     setViewEmployee(null);
//                   }}
//                   className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#f1f5f9]"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">

//                 <div>
//                   <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
//                     Basic Information
//                   </h3>

//                   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     <DetailItem
//                       label="Employee ID"
//                       value={
//                         viewEmployee.employee_id
//                       }
//                     />

//                     <DetailItem
//                       label="Company Email"
//                       value={
//                         viewEmployee.company_email
//                       }
//                     />

//                     <DetailItem
//                       label="Personal Email"
//                       value={
//                         viewEmployee.personal_email
//                       }
//                     />

//                     <DetailItem
//                       label="Company Mobile"
//                       value={
//                         viewEmployee.company_mobile
//                       }
//                     />

//                     <DetailItem
//                       label="Personal Mobile"
//                       value={
//                         viewEmployee.personal_mobile
//                       }
//                     />

//                     <DetailItem
//                       label="Company Landline"
//                       value={
//                         viewEmployee.company_landline
//                       }
//                     />

//                     <DetailItem
//                       label="Gender"
//                       value={
//                         viewEmployee.gender
//                       }
//                     />

//                     <DetailItem
//                       label="Date of Birth"
//                       value={formatDate(
//                         viewEmployee.dob
//                       )}
//                     />

//                     <DetailItem
//                       label="Blood Group"
//                       value={
//                         viewEmployee.blood_group
//                       }
//                     />

//                     <DetailItem
//                       label="Marital Status"
//                       value={
//                         viewEmployee.martial_status ||
//                         viewEmployee.marital_status
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
//                     Work Details
//                   </h3>

//                   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     <DetailItem
//                       label="Department"
//                       value={
//                         viewEmployee.department_name
//                       }
//                     />

//                     <DetailItem
//                       label="Designation"
//                       value={
//                         viewEmployee.designation_name
//                       }
//                     />

//                     <DetailItem
//                       label="Location"
//                       value={
//                         viewEmployee.location_name
//                       }
//                     />

//                     <DetailItem
//                       label="Employment Type"
//                       value={
//                         viewEmployee.employment_type_name
//                       }
//                     />

//                     <DetailItem
//                       label="Reporting Manager"
//                       value={
//                         viewEmployee.reporting_manager_name
//                       }
//                     />

//                     <DetailItem
//                       label="Company Role"
//                       value={
//                         viewEmployee.company_role
//                       }
//                     />

//                     <DetailItem
//                       label="Joining Date"
//                       value={formatDate(
//                         viewEmployee.joining_date
//                       )}
//                     />

//                     <DetailItem
//                       label="Date of Leaving"
//                       value={formatDate(
//                         viewEmployee.date_of_leaving
//                       )}
//                     />

//                     <DetailItem
//                       label="Resignation Date"
//                       value={formatDate(
//                         viewEmployee.resignation_date
//                       )}
//                     />

//                     <DetailItem
//                       label="Status"
//                       value={
//                         viewEmployee.employee_status
//                       }
//                     />

//                     <DetailItem
//                       label="Current Experience"
//                       value={
//                         viewEmployee.current_experience !=
//                         null
//                           ? `${viewEmployee.current_experience} yrs`
//                           : null
//                       }
//                     />

//                     <DetailItem
//                       label="Total Experience"
//                       value={
//                         viewEmployee.total_experience !=
//                         null
//                           ? `${viewEmployee.total_experience} yrs`
//                           : null
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
//                     Personal & Documents
//                   </h3>

//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <DetailItem
//                       label="Current Address"
//                       value={
//                         viewEmployee.current_address
//                       }
//                     />

//                     <DetailItem
//                       label="Permanent Address"
//                       value={
//                         viewEmployee.permanent_address
//                       }
//                     />

//                     <DetailItem
//                       label="Emergency Contact"
//                       value={
//                         viewEmployee.emergency_contact_number
//                       }
//                     />

//                     <DetailItem
//                       label="Aadhaar Number"
//                       value={
//                         viewEmployee.aadhaar_number
//                       }
//                     />

//                     <DetailItem
//                       label="PAN Number"
//                       value={
//                         viewEmployee.pan_number
//                       }
//                     />

//                     <DetailItem
//                       label="About Me"
//                       value={
//                         viewEmployee.about_me
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     setViewEmployee(null);
//                   }}
//                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
//                 >
//                   Close
//                 </button>

//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     openEdit(viewEmployee);
//                   }}
//                   className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//                 >
//                   Edit Employee
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//       {/* ======================================================
//           ADD / EDIT MODAL
//       ====================================================== */}
//       {(showAddForm || showEditForm) && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">

//           <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">

//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
//               <h2 className="text-lg font-semibold text-[#1a1a1a]">
//                 {showEditForm
//                   ? "Edit Employee"
//                   : "Add Employee"}
//               </h2>

//               <button
//                 onClick={closeModal}
//                 className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex border-b border-[#e5e7eb] px-6">
//               {[
//                 {
//                   id: "basic",
//                   label: "Basic Info",
//                 },
//                 {
//                   id: "work",
//                   label: "Work Details",
//                 },
//                 {
//                   id: "personal",
//                   label: "Personal",
//                 },
//                 {
//                   id: "other",
//                   label: "Other",
//                 },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   onClick={() =>
//                     setActiveTab(tab.id)
//                   }
//                   className={`relative px-4 py-3 text-sm font-medium ${
//                     activeTab === tab.id
//                       ? "text-[#E42527]"
//                       : "text-[#6b7280]"
//                   }`}
//                 >
//                   {tab.label}

//                   {activeTab === tab.id && (
//                     <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E42527]" />
//                   )}
//                 </button>
//               ))}
//             </div>

//             <form
//               onSubmit={
//                 showEditForm
//                   ? handleEditSubmit
//                   : handleSubmit
//               }
//             >
//               <div className="max-h-[60vh] overflow-y-auto px-6 py-5">

//                 {renderFormFields()}

//                 {error && (
//                   <div className="mt-4 rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
//                     {error}
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4">

//                 <div className="flex gap-2">
//                   {activeTab !== "basic" && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const tabs = [
//                           "basic",
//                           "work",
//                           "personal",
//                           "other",
//                         ];

//                         const currentIndex =
//                           tabs.indexOf(
//                             activeTab
//                           );

//                         setActiveTab(
//                           tabs[
//                             currentIndex - 1
//                           ]
//                         );
//                       }}
//                       className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
//                     >
//                       Previous
//                     </button>
//                   )}

//                   {activeTab !== "other" && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const tabs = [
//                           "basic",
//                           "work",
//                           "personal",
//                           "other",
//                         ];

//                         const currentIndex =
//                           tabs.indexOf(
//                             activeTab
//                           );

//                         setActiveTab(
//                           tabs[
//                             currentIndex + 1
//                           ]
//                         );
//                       }}
//                       className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
//                     >
//                       Next
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={saving}
//                     className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
//                   >
//                     {saving
//                       ? "Saving..."
//                       : showEditForm
//                       ? "Update"
//                       : "Submit"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ======================================================
//           BULK IMPORT
//       ====================================================== */}
//       {showBulkModal && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">

//           <div className="mb-10 w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">

//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
//               <h2 className="text-lg font-semibold">
//                 Bulk Import Employees
//               </h2>

//               <button
//                 onClick={() => {
//                   setShowBulkModal(false);
//                   setBulkFile(null);
//                   setBulkPreview([]);
//                   setBulkResult(null);
//                 }}
//                 className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="px-6 py-5">

//               <p className="mb-4 text-sm text-[#6b7280]">
//                 Upload CSV with headers:
//                 first_name, last_name, personal_email,
//                 department_id, designation_id,
//                 location_id, reporting_manager...
//               </p>

//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleBulkFile}
//                 className="mb-4 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#fef2f2] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#E42527]"
//               />

//               {bulkPreview.length > 0 && (
//                 <div className="mb-4 max-h-48 overflow-auto rounded border">
//                   <table className="w-full text-left text-xs">
//                     <thead className="bg-[#f9fafb]">
//                       <tr>
//                         {Object.keys(
//                           bulkPreview[0]
//                         )
//                           .slice(0, 6)
//                           .map((h) => (
//                             <th
//                               key={h}
//                               className="px-3 py-2"
//                             >
//                               {h}
//                             </th>
//                           ))}
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {bulkPreview
//                         .slice(0, 8)
//                         .map(
//                           (row, i) => (
//                             <tr
//                               key={i}
//                               className="border-t"
//                             >
//                               {Object.values(
//                                 row
//                               )
//                                 .slice(0, 6)
//                                 .map(
//                                   (
//                                     v,
//                                     j
//                                   ) => (
//                                     <td
//                                       key={j}
//                                       className="px-3 py-1.5"
//                                     >
//                                       {v ||
//                                         "—"}
//                                     </td>
//                                   )
//                                 )}
//                             </tr>
//                           )
//                         )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {bulkResult && (
//                 <div className="mb-4 rounded-md bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
//                   Total:{" "}
//                   {bulkResult.total} •
//                   Added:{" "}
//                   {bulkResult.added} •
//                   Failed:{" "}
//                   {bulkResult.failed}
//                 </div>
//               )}

//               {error && (
//                 <div className="mb-4 rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
//                   {error}
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end gap-3 border-t px-6 py-4">
//               <button
//                 onClick={() => {
//                   setShowBulkModal(false);
//                   setBulkFile(null);
//                   setBulkPreview([]);
//                   setBulkResult(null);
//                 }}
//                 className="rounded-md border px-4 py-2 text-sm"
//               >
//                 Close
//               </button>

//               <button
//                 onClick={handleBulkSubmit}
//                 disabled={
//                   bulkSaving ||
//                   bulkPreview.length === 0
//                 }
//                 className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
//               >
//                 {bulkSaving
//                   ? "Importing..."
//                   : "Import Employees"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================================================
//           ORG CHART
//       ====================================================== */}
//       {showHierarchy && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 backdrop-blur-sm">

//           <div className="mb-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-[#f8fafc] shadow-2xl">

//             <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-white px-6 py-4">

//               <div>
//                 <h2 className="text-lg font-semibold text-[#0f172a]">
//                   Organization Chart
//                 </h2>

//                 <p className="text-sm text-[#64748b]">
//                   {hierarchyData?.total_employees ||
//                     0}{" "}
//                   employees •{" "}
//                   {hierarchyData?.total_roots ||
//                     0}{" "}
//                   top-level leaders
//                 </p>
//               </div>

//               <button
//                 onClick={() => {
//                   setShowHierarchy(false);
//                   setHierarchyData(null);
//                 }}
//                 className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#f1f5f9]"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="max-h-[72vh] overflow-y-auto px-6 py-6">

//               {!hierarchyData ||
//               !hierarchyData.hierarchy?.length ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-center">
//                   <p className="text-sm font-medium text-[#475569]">
//                     No hierarchy data found
//                   </p>

//                   <p className="mt-1 text-sm text-[#94a3b8]">
//                     Assign reporting managers to
//                     build the org chart
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {hierarchyData.hierarchy.map(
//                     (node) => (
//                       <HierarchyNode
//                         key={
//                           node.employee_id ||
//                           node.user_id
//                         }
//                         node={node}
//                         level={0}
//                       />
//                     )
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="border-t border-[#e2e8f0] bg-white px-6 py-3">
//               <p className="text-xs text-[#94a3b8]">
//                 Click the small arrow on any card to
//                 expand / collapse their team
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/app/lib/api";

/* ============================================================
   Hierarchy Node
============================================================ */
function HierarchyNode({ node, level = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.reports && node.reports.length > 0;

  const initials = (node.name || "E")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      {level > 0 && (
        <>
          <div className="absolute left-[-20px] top-0 h-full w-px bg-[#e2e8f0]" />
          <div className="absolute left-[-20px] top-[28px] h-px w-5 bg-[#e2e8f0]" />
        </>
      )}

      <div className="relative flex items-start gap-3 pb-4">
        <div className="group flex min-w-[300px] max-w-[340px] items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3.5 shadow-sm transition-all hover:border-[#E42527]/40 hover:shadow-md">
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#E42527] to-[#c91f21] text-sm font-semibold text-white shadow-sm">
              {initials}
            </div>

            {hasChildren && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f1f5f9] text-[#64748b] shadow-sm hover:bg-[#e2e8f0]"
              >
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${
                    expanded ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#0f172a]">
              {node.name || "—"}
            </p>
            <p className="truncate text-xs text-[#64748b]">
              {node.designation || "No designation"}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  (node.employee_status || "active").toLowerCase() === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {node.employee_status || "active"}
              </span>
              {hasChildren && (
                <span className="text-[10px] text-[#94a3b8]">
                  {node.reports.length} report
                  {node.reports.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="ml-10 space-y-0 border-l border-[#e2e8f0] pl-5">
          {node.reports.map((child) => (
            <HierarchyNode
              key={child.employee_id || child.user_id}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-[#0f172a]">{value || "—"}</p>
    </div>
  );
}

const initialEmployee = {
  first_name: "",
  last_name: "",
  company_email: "",
  personal_email: "",
  personal_mobile: "",
  company_mobile: "",
  department_id: "",
  designation_id: "",
  location_id: "",
  reporting_manager: "",
  employment_type_id: "",
  joining_date: "",
  dob: "",
  gender: "",
  blood_group: "",
  martial_status: "",
  company_role: "",
  current_address: "",
  permanent_address: "",
  emergency_contact_number: "",
  aadhaar_number: "",
  pan_number: "",
  current_experience: "",
  total_experience: "",
  about_me: "",
  employee_status: "active",
  password: "",
  company_landline: "",
  date_of_leaving: "",
  resignation_date: "",
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
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return err?.message || "Something went wrong";
};

const formatDate = (date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

const inputCls =
  "w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState(initialEmployee);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("basic");
  const [showHierarchy, setShowHierarchy] = useState(false);
  const [hierarchyData, setHierarchyData] = useState(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError("");
    setLoading(true);
    try {
      const empRes = await api.get("/api/v1/get/employees");
      const d = empRes?.data;
      let list = [];
      if (Array.isArray(d?.employees)) list = d.employees;
      else if (Array.isArray(d?.data)) list = d.data;
      else if (Array.isArray(d)) list = d;
      setEmployees(list);
    } catch (err) {
      setError(formatApiError(err));
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHierarchy = async () => {
    setHierarchyLoading(true);
    setError("");
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

  const extractArray = (res) => {
    const d = res?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.departments)) return d.departments;
    if (Array.isArray(d?.designations)) return d.designations;
    if (Array.isArray(d?.locations)) return d.locations;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(d?.results)) return d.results;
    if (Array.isArray(d?.employment_types)) return d.employment_types;
    return [];
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
      setEmploymentTypes([]);
      setDepartments([]);
      setDesignations([]);
      setLocations([]);
    } finally {
      setLoadingMasters(false);
    }
  }, []);

  useEffect(() => {
    if (showAddForm || showEditForm) {
      void loadMasters();
    }
  }, [showAddForm, showEditForm]);

  const handleChange = (field, value) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  const managerOptions = (Array.isArray(employees) ? employees : [])
    .filter((employee) => employee.employee_id)
    .map((employee) => ({
      employee_id: employee.employee_id,
      name: employee.first_name
        ? `${employee.first_name} ${employee.last_name || ""}`.trim()
        : employee.name || employee.employee_id,
    }));

  const buildPayload = () => ({
    first_name: employeeData.first_name || null,
    last_name: employeeData.last_name || null,
    company_email: employeeData.company_email || null,
    personal_email: employeeData.personal_email || null,
    personal_mobile: employeeData.personal_mobile || null,
    company_mobile: employeeData.company_mobile || null,
    department_id: employeeData.department_id,
    designation_id: employeeData.designation_id,
    location_id: employeeData.location_id,
    reporting_manager: employeeData.reporting_manager || null,
    employment_type_id: employeeData.employment_type_id || null,
    joining_date: employeeData.joining_date || null,
    date_of_leaving: employeeData.date_of_leaving || null,
    resignation_date: employeeData.resignation_date || null,
    dob: employeeData.dob || null,
    gender: employeeData.gender || null,
    blood_group: employeeData.blood_group || null,
    martial_status: employeeData.martial_status || null,
    company_role: employeeData.company_role || null,
    current_address: employeeData.current_address || null,
    permanent_address: employeeData.permanent_address || null,
    emergency_contact_number: employeeData.emergency_contact_number || null,
    aadhaar_number: employeeData.aadhaar_number || null,
    pan_number: employeeData.pan_number || null,
    about_me: employeeData.about_me || null,
    employee_status: employeeData.employee_status || "active",
    company_landline: employeeData.company_landline || null,
    password: employeeData.password || null,
    current_experience: employeeData.current_experience
      ? parseFloat(employeeData.current_experience)
      : null,
    total_experience: employeeData.total_experience
      ? parseFloat(employeeData.total_experience)
      : null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/api/v1/add/employee", buildPayload());
      setEmployeeData({ ...initialEmployee });
      setShowAddForm(false);
      setActiveTab("basic");
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmployeeId) return;
    setSaving(true);
    setError("");
    try {
      const payload = buildPayload();
      delete payload.password;
      await api.put(`/api/v1/edit/employee/${editingEmployeeId}`, payload);
      setShowEditForm(false);
      setEditingEmployeeId(null);
      setEmployeeData({ ...initialEmployee });
      setActiveTab("basic");
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (emp) => {
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
      joining_date: emp.joining_date ? emp.joining_date.slice(0, 10) : "",
      dob: emp.dob ? emp.dob.slice(0, 10) : "",
      gender: emp.gender || "",
      blood_group: emp.blood_group || "",
      martial_status: emp.martial_status || emp.marital_status || "",
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
      date_of_leaving: emp.date_of_leaving ? emp.date_of_leaving.slice(0, 10) : "",
      resignation_date: emp.resignation_date
        ? emp.resignation_date.slice(0, 10)
        : "",
    });
    setActiveTab("basic");
    setError("");
    setShowEditForm(true);
  };

  const openView = (emp) => {
    setViewEmployee(emp);
    setShowViewModal(true);
  };

  const handleBulkFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    setBulkResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        setBulkPreview([]);
        return;
      }
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || "";
        });
        return obj;
      });
      setBulkPreview(rows.slice(0, 50));
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = async () => {
    if (!bulkFile || bulkPreview.length === 0) return;
    setBulkSaving(true);
    setError("");
    setBulkResult(null);
    try {
      const employeesPayload = bulkPreview.map((row) => ({
        first_name: row.first_name || null,
        last_name: row.last_name || null,
        personal_email: row.personal_email || null,
        personal_mobile: row.personal_mobile || null,
        company_email: row.company_email || null,
        company_mobile: row.company_mobile || null,
        department_id: row.department_id,
        designation_id: row.designation_id,
        location_id: row.location_id,
        reporting_manager: row.reporting_manager || null,
        employment_type_id: row.employment_type_id || null,
        joining_date: row.joining_date || null,
        dob: row.dob || null,
        gender: row.gender || null,
        blood_group: row.blood_group || null,
        martial_status: row.martial_status || row.marital_status || null,
        company_role: row.company_role || null,
        current_address: row.current_address || null,
        permanent_address: row.permanent_address || null,
        emergency_contact_number: row.emergency_contact_number || null,
        aadhaar_number: row.aadhaar_number || null,
        pan_number: row.pan_number || null,
        about_me: row.about_me || null,
        employee_status: row.employee_status || "active",
        password: row.password || null,
        current_experience: row.current_experience
          ? parseFloat(row.current_experience)
          : null,
        total_experience: row.total_experience
          ? parseFloat(row.total_experience)
          : null,
      }));
      const res = await api.post("/api/v1/bulk/add/employees", {
        employees: employeesPayload,
      });
      setBulkResult(res?.data);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBulkSaving(false);
    }
  };

  const filteredEmployees = (Array.isArray(employees) ? employees : []).filter(
    (emp) => {
      const fullName =
        `${emp.first_name || ""} ${emp.last_name || ""} ${emp.name || ""}`.toLowerCase();
      const email = (emp.company_email || emp.personal_email || "").toLowerCase();
      const q = search.toLowerCase();
      const matchSearch = fullName.includes(q) || email.includes(q);
      const status = (emp.employee_status || "active").toLowerCase();
      const matchStatus = statusFilter === "all" || status === statusFilter;
      return matchSearch && matchStatus;
    }
  );

  const getInitials = (emp) => {
    const first = emp.first_name?.[0] || emp.name?.[0] || "E";
    const last = emp.last_name?.[0] || "";
    return (first + last).toUpperCase();
  };

  const closeModal = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingEmployeeId(null);
    setError("");
    setEmployeeData({ ...initialEmployee });
    setActiveTab("basic");
  };

  const getName = (item, ...keys) => {
    for (const key of keys) {
      if (item?.[key]) return item[key];
    }
    return "—";
  };

  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safeDesignations = Array.isArray(designations) ? designations : [];
  const safeLocations = Array.isArray(locations) ? locations : [];
  const safeEmploymentTypes = Array.isArray(employmentTypes)
    ? employmentTypes
    : [];

  const renderFormFields = () => (
    <>
      {activeTab === "basic" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              First name
            </label>
            <input
              value={employeeData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder="Rahul"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Last name
            </label>
            <input
              value={employeeData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder="Sharma"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Company email
            </label>
            <input
              type="email"
              value={employeeData.company_email}
              onChange={(e) => handleChange("company_email", e.target.value)}
              placeholder="rahul@company.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Company mobile
            </label>
            <input
              value={employeeData.company_mobile}
              onChange={(e) => handleChange("company_mobile", e.target.value)}
              placeholder="9876543210"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Personal email
            </label>
            <input
              type="email"
              value={employeeData.personal_email}
              onChange={(e) => handleChange("personal_email", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Personal mobile
            </label>
            <input
              value={employeeData.personal_mobile}
              onChange={(e) => handleChange("personal_mobile", e.target.value)}
              className={inputCls}
            />
          </div>
          {!showEditForm && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                Login password
              </label>
              <input
                type="password"
                value={employeeData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Employee portal login"
                className={inputCls}
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Employee status
            </label>
            <select
              value={employeeData.employee_status}
              onChange={(e) => handleChange("employee_status", e.target.value)}
              className={inputCls}
            >
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="notice_period">Notice period</option>
              <option value="on_leave">On leave</option>
              <option value="suspended">Suspended</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === "work" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Department <span className="text-[#E42527]">*</span>
            </label>
            <select
              required
              value={employeeData.department_id}
              onChange={(e) => handleChange("department_id", e.target.value)}
              className={inputCls}
              disabled={loadingMasters}
            >
              <option value="">Select department</option>
              {safeDepartments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {getName(d, "department_name", "name")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Designation <span className="text-[#E42527]">*</span>
            </label>
            <select
              required
              value={employeeData.designation_id}
              onChange={(e) => handleChange("designation_id", e.target.value)}
              className={inputCls}
              disabled={loadingMasters}
            >
              <option value="">Select designation</option>
              {safeDesignations.map((d) => (
                <option key={d.designation_id} value={d.designation_id}>
                  {getName(d, "job_title", "title", "name")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Location <span className="text-[#E42527]">*</span>
            </label>
            <select
              required
              value={employeeData.location_id}
              onChange={(e) => handleChange("location_id", e.target.value)}
              className={inputCls}
              disabled={loadingMasters}
            >
              <option value="">Select location</option>
              {safeLocations.map((l) => (
                <option key={l.location_id} value={l.location_id}>
                  {getName(l, "location_name", "name")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Employment type
            </label>
            <select
              value={employeeData.employment_type_id}
              onChange={(e) => handleChange("employment_type_id", e.target.value)}
              className={inputCls}
              disabled={loadingMasters}
            >
              <option value="">Select type</option>
              {safeEmploymentTypes.map((t) => (
                <option key={t.employment_type_id} value={t.employment_type_id}>
                  {getName(t, "name")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Reporting manager
            </label>
            <select
              value={employeeData.reporting_manager}
              onChange={(e) => handleChange("reporting_manager", e.target.value)}
              className={inputCls}
            >
              <option value="">Select manager</option>
              {managerOptions
                .filter((m) => m.employee_id !== editingEmployeeId)
                .map((m) => (
                  <option key={m.employee_id} value={m.employee_id}>
                    {m.name}
                  </option>
                ))}
            </select>
            <p className="mt-1 text-[11px] text-[#9ca3af]">
              Manager employee ID (not user ID)
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Date of joining
            </label>
            <input
              type="date"
              value={employeeData.joining_date}
              onChange={(e) => handleChange("joining_date", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Role / title
            </label>
            <input
              value={employeeData.company_role}
              onChange={(e) => handleChange("company_role", e.target.value)}
              placeholder="e.g. Team Lead"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Company landline
            </label>
            <input
              value={employeeData.company_landline}
              onChange={(e) => handleChange("company_landline", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Date of leaving
            </label>
            <input
              type="date"
              value={employeeData.date_of_leaving}
              onChange={(e) => handleChange("date_of_leaving", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {activeTab === "personal" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Date of birth
            </label>
            <input
              type="date"
              value={employeeData.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Gender
            </label>
            <select
              value={employeeData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className={inputCls}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Blood group
            </label>
            <select
              value={employeeData.blood_group}
              onChange={(e) => handleChange("blood_group", e.target.value)}
              className={inputCls}
            >
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Marital status
            </label>
            <select
              value={employeeData.martial_status}
              onChange={(e) => handleChange("martial_status", e.target.value)}
              className={inputCls}
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Emergency contact
            </label>
            <input
              value={employeeData.emergency_contact_number}
              onChange={(e) =>
                handleChange("emergency_contact_number", e.target.value)
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Current experience (years)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={employeeData.current_experience}
              onChange={(e) => handleChange("current_experience", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Total experience (years)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={employeeData.total_experience}
              onChange={(e) => handleChange("total_experience", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Current address
            </label>
            <textarea
              rows={2}
              value={employeeData.current_address}
              onChange={(e) => handleChange("current_address", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Permanent address
            </label>
            <textarea
              rows={2}
              value={employeeData.permanent_address}
              onChange={(e) => handleChange("permanent_address", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {activeTab === "other" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              Aadhaar number
            </label>
            <input
              value={employeeData.aadhaar_number}
              onChange={(e) => handleChange("aadhaar_number", e.target.value)}
              maxLength={12}
              placeholder="12 digits"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              PAN number
            </label>
            <input
              value={employeeData.pan_number}
              onChange={(e) =>
                handleChange("pan_number", e.target.value.toUpperCase())
              }
              maxLength={10}
              placeholder="ABCDE1234F"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
              About
            </label>
            <textarea
              rows={3}
              value={employeeData.about_me}
              onChange={(e) => handleChange("about_me", e.target.value)}
              placeholder="Short bio (optional)"
              className={inputCls}
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Employees</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage employee profiles, hierarchy and bulk import
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchHierarchy}
            disabled={hierarchyLoading}
            className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
          >
            {hierarchyLoading ? "Loading…" : "Org chart"}
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setBulkFile(null);
              setBulkPreview([]);
              setBulkResult(null);
              setShowBulkModal(true);
            }}
            className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
          >
            Bulk import
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setEmployeeData({ ...initialEmployee });
              setActiveTab("basic");
              setShowAddForm(true);
            }}
            className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
          >
            + Add employee
          </button>
        </div>
      </div>

      {error && !showAddForm && !showEditForm && !showBulkModal && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="w-full max-w-xs rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
          />
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="notice_period">Notice period</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
            </select>
            <span className="text-sm text-[#6b7280]">
              {filteredEmployees.length} employee
              {filteredEmployees.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">
              Loading employees…
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">
              No employees found
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-4 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280]">Department</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280]">Designation</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280]">Location</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280]">Joining</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-[#fafafa]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fef2f2] text-xs font-semibold text-[#E42527]">
                          {getInitials(emp)}
                        </div>
                        <div>
                          <p className="font-medium text-[#1a1a1a]">
                            {emp.first_name
                              ? `${emp.first_name} ${emp.last_name || ""}`.trim()
                              : emp.name || emp.employee_id}
                          </p>
                          <p className="text-xs text-[#6b7280]">
                            {emp.company_email || emp.personal_email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {emp.department_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {emp.designation_name || emp.company_role || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {emp.location_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {formatDate(emp.joining_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (emp.employee_status || "active").toLowerCase() ===
                          "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {emp.employee_status || "active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openView(emp)}
                          className="rounded px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f3f4f6]"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(emp)}
                          className="rounded px-2.5 py-1 text-xs font-medium text-[#E42527] hover:bg-[#fef2f2]"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* VIEW */}
      {showViewModal && viewEmployee && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 backdrop-blur-sm">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  {viewEmployee.first_name
                    ? `${viewEmployee.first_name} ${viewEmployee.last_name || ""}`.trim()
                    : viewEmployee.name || "Employee"}
                </h2>
                <p className="text-sm text-[#64748b]">
                  {viewEmployee.designation_name ||
                    viewEmployee.company_role ||
                    "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setViewEmployee(null);
                }}
                className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#f1f5f9]"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Basic information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem label="Employee ID" value={viewEmployee.employee_id} />
                  <DetailItem label="Company email" value={viewEmployee.company_email} />
                  <DetailItem label="Personal email" value={viewEmployee.personal_email} />
                  <DetailItem label="Company mobile" value={viewEmployee.company_mobile} />
                  <DetailItem label="Personal mobile" value={viewEmployee.personal_mobile} />
                  <DetailItem label="Gender" value={viewEmployee.gender} />
                  <DetailItem label="Date of birth" value={formatDate(viewEmployee.dob)} />
                  <DetailItem label="Blood group" value={viewEmployee.blood_group} />
                  <DetailItem
                    label="Marital status"
                    value={viewEmployee.martial_status || viewEmployee.marital_status}
                  />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Work details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem label="Department" value={viewEmployee.department_name} />
                  <DetailItem label="Designation" value={viewEmployee.designation_name} />
                  <DetailItem label="Location" value={viewEmployee.location_name} />
                  <DetailItem
                    label="Employment type"
                    value={viewEmployee.employment_type_name}
                  />
                  <DetailItem
                    label="Reporting manager"
                    value={viewEmployee.reporting_manager_name}
                  />
                  <DetailItem label="Role" value={viewEmployee.company_role} />
                  <DetailItem
                    label="Joining date"
                    value={formatDate(viewEmployee.joining_date)}
                  />
                  <DetailItem label="Status" value={viewEmployee.employee_status} />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Personal & documents
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem label="Current address" value={viewEmployee.current_address} />
                  <DetailItem
                    label="Permanent address"
                    value={viewEmployee.permanent_address}
                  />
                  <DetailItem
                    label="Emergency contact"
                    value={viewEmployee.emergency_contact_number}
                  />
                  <DetailItem label="Aadhaar" value={viewEmployee.aadhaar_number} />
                  <DetailItem label="PAN" value={viewEmployee.pan_number} />
                  <DetailItem label="About" value={viewEmployee.about_me} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setViewEmployee(null);
                }}
                className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  openEdit(viewEmployee);
                }}
                className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
              >
                Edit employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                {showEditForm ? "Edit employee" : "Add employee"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
              >
                ✕
              </button>
            </div>
            <div className="flex border-b border-[#e5e7eb] px-6">
              {[
                { id: "basic", label: "Basic info" },
                { id: "work", label: "Work details" },
                { id: "personal", label: "Personal" },
                { id: "other", label: "Documents" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id ? "text-[#E42527]" : "text-[#6b7280]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E42527]" />
                  )}
                </button>
              ))}
            </div>
            <form onSubmit={showEditForm ? handleEditSubmit : handleSubmit}>
              <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                {renderFormFields()}
                {error && (
                  <div className="mt-4 rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4">
                <div className="flex gap-2">
                  {activeTab !== "basic" && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ["basic", "work", "personal", "other"];
                        setActiveTab(tabs[tabs.indexOf(activeTab) - 1]);
                      }}
                      className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
                    >
                      Previous
                    </button>
                  )}
                  {activeTab !== "other" && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ["basic", "work", "personal", "other"];
                        setActiveTab(tabs[tabs.indexOf(activeTab) + 1]);
                      }}
                      className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
                    >
                      Next
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {saving ? "Saving…" : showEditForm ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
          <div className="mb-10 w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
              <h2 className="text-lg font-semibold">Bulk import employees</h2>
              <button
                type="button"
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkFile(null);
                  setBulkPreview([]);
                  setBulkResult(null);
                }}
                className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="mb-4 text-sm text-[#6b7280]">
                CSV headers: first_name, last_name, company_email, department_id,
                designation_id, location_id, reporting_manager…
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleBulkFile}
                className="mb-4 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#fef2f2] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#E42527]"
              />
              {bulkPreview.length > 0 && (
                <div className="mb-4 max-h-48 overflow-auto rounded border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f9fafb]">
                      <tr>
                        {Object.keys(bulkPreview[0])
                          .slice(0, 6)
                          .map((h) => (
                            <th key={h} className="px-3 py-2">
                              {h}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bulkPreview.slice(0, 8).map((row, i) => (
                        <tr key={i} className="border-t">
                          {Object.values(row)
                            .slice(0, 6)
                            .map((v, j) => (
                              <td key={j} className="px-3 py-1.5">
                                {v || "—"}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {bulkResult && (
                <div className="mb-4 rounded-md bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
                  Total: {bulkResult.total} • Added: {bulkResult.added} • Failed:{" "}
                  {bulkResult.failed}
                </div>
              )}
              {error && (
                <div className="mb-4 rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
                  {error}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkFile(null);
                  setBulkPreview([]);
                  setBulkResult(null);
                }}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={bulkSaving || bulkPreview.length === 0}
                className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {bulkSaving ? "Importing…" : "Import employees"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORG CHART */}
      {showHierarchy && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 backdrop-blur-sm">
          <div className="mb-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-[#f8fafc] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  Organization chart
                </h2>
                <p className="text-sm text-[#64748b]">
                  {hierarchyData?.total_employees || 0} employees •{" "}
                  {hierarchyData?.total_roots || 0} top-level
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowHierarchy(false);
                  setHierarchyData(null);
                }}
                className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#f1f5f9]"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[72vh] overflow-y-auto px-6 py-6">
              {!hierarchyData || !hierarchyData.hierarchy?.length ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-sm font-medium text-[#475569]">
                    No hierarchy data found
                  </p>
                  <p className="mt-1 text-sm text-[#94a3b8]">
                    Assign reporting managers to build the org chart
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {hierarchyData.hierarchy.map((node) => (
                    <HierarchyNode
                      key={node.employee_id || node.user_id}
                      node={node}
                      level={0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}