

// // // // "use client";

// // // // import { useCallback, useEffect, useMemo, useState } from "react";
// // // // import { api } from "@/lib/api";

// // // // /* =========================================================
// // // //    STATUS COLORS
// // // // ========================================================= */
// // // // const STATUS_COLOR = {
// // // //   draft: "bg-slate-100 text-slate-700",
// // // //   pending_approval: "bg-amber-50 text-amber-700",
// // // //   approved: "bg-blue-50 text-blue-700",
// // // //   sent: "bg-indigo-50 text-indigo-700",
// // // //   published: "bg-emerald-50 text-emerald-700",
// // // //   viewed: "bg-cyan-50 text-cyan-700",
// // // //   accepted: "bg-green-50 text-green-700",
// // // //   declined: "bg-red-50 text-red-700",
// // // //   signed: "bg-violet-50 text-violet-700",
// // // //   expired: "bg-orange-50 text-orange-700",
// // // //   cancelled: "bg-rose-50 text-rose-700",
// // // //   pending: "bg-amber-50 text-amber-700",
// // // //   generated: "bg-emerald-50 text-emerald-700",
// // // //   rejected: "bg-red-50 text-red-700",
// // // // };

// // // // const EMPTY_CATEGORY = {
// // // //   code: "",
// // // //   name: "",
// // // //   description: "",
// // // //   number_prefix: "",
// // // //   display_order: 100,
// // // //   is_active: true,
// // // // };

// // // // const EMPTY_TEMPLATE = {
// // // //   category_id: "",
// // // //   name: "",
// // // //   code: "",
// // // //   description: "",
// // // //   content_html: "",
// // // //   requires_approval: false,
// // // //   requires_esign: false,
// // // //   allow_employee_request: false,
// // // //   password_protect_pdf: false,
// // // //   is_active: true,
// // // // };

// // // // const EMPTY_GENERATE = {
// // // //   template_id: "",
// // // //   issue_date: "",
// // // //   effective_date: "",
// // // //   signatory_id: "",
// // // //   publish_to_ess: true,
// // // //   send_email: false,
// // // // };

// // // // const EMPTY_SIGNATORY = {
// // // //   name: "",
// // // //   designation: "",
// // // //   department: "",
// // // //   email: "",
// // // //   is_default: false,
// // // //   is_active: true,
// // // // };

// // // // /* =========================================================
// // // //    HELPERS
// // // // ========================================================= */
// // // // function getErrorMessage(err) {
// // // //   const detail = err?.response?.data?.detail;
// // // //   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
// // // //   if (typeof detail === "string") return detail;
// // // //   return err?.message || "Something went wrong";
// // // // }

// // // // function pickList(res) {
// // // //   const body = res?.data ?? {};
// // // //   const list =
// // // //     body?.data ??
// // // //     body?.items ??
// // // //     body?.results ??
// // // //     body?.employees ??
// // // //     body?.departments ??
// // // //     body?.designations ??
// // // //     body?.templates ??
// // // //     body?.categories ??
// // // //     body?.letters ??
// // // //     body?.requests ??
// // // //     body?.signatories ??
// // // //     [];
// // // //   return Array.isArray(list) ? list : Array.isArray(body) ? body : [];
// // // // }

// // // // function formatDate(value) {
// // // //   if (!value) return "—";
// // // //   try {
// // // //     return new Date(value).toLocaleDateString("en-IN", {
// // // //       day: "2-digit",
// // // //       month: "short",
// // // //       year: "numeric",
// // // //     });
// // // //   } catch {
// // // //     return String(value);
// // // //   }
// // // // }

// // // // function empName(emp) {
// // // //   if (!emp) return "—";
// // // //   if (emp.full_name) return emp.full_name;
// // // //   const n = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
// // // //   return n || emp.employee_code || emp.employee_id || "—";
// // // // }

// // // // function StatusBadge({ status }) {
// // // //   const key = String(status || "").toLowerCase();
// // // //   const color = STATUS_COLOR[key] || "bg-slate-100 text-slate-600";
// // // //   return (
// // // //     <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${color}`}>
// // // //       {String(status || "—").replace(/_/g, " ")}
// // // //     </span>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    PAGE
// // // // ========================================================= */
// // // // export default function HRLettersPage() {
// // // //   const [activeTab, setActiveTab] = useState("letters");

// // // //   // master data from YOUR existing APIs
// // // //   const [employees, setEmployees] = useState([]);
// // // //   const [departments, setDepartments] = useState([]);
// // // //   const [designations, setDesignations] = useState([]);

// // // //   // letter module data
// // // //   const [letters, setLetters] = useState([]);
// // // //   const [templates, setTemplates] = useState([]);
// // // //   const [categories, setCategories] = useState([]);
// // // //   const [requests, setRequests] = useState([]);
// // // //   const [signatories, setSignatories] = useState([]);

// // // //   const [listLoading, setListLoading] = useState(true);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState("");
// // // //   const [success, setSuccess] = useState("");

// // // //   const [selectedLetter, setSelectedLetter] = useState(null);
// // // //   const [selectedTemplate, setSelectedTemplate] = useState(null);

// // // //   const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
// // // //   const [templateForm, setTemplateForm] = useState(EMPTY_TEMPLATE);
// // // //   const [generateForm, setGenerateForm] = useState(EMPTY_GENERATE);
// // // //   const [signatoryForm, setSignatoryForm] = useState(EMPTY_SIGNATORY);

// // // //   const [selectedEmployees, setSelectedEmployees] = useState([]);
// // // //   const [filterDept, setFilterDept] = useState("");
// // // //   const [filterDesig, setFilterDesig] = useState("");
// // // //   const [empSearch, setEmpSearch] = useState("");

// // // //   /* ===================== FETCH FROM YOUR APIs ===================== */

// // // //   // ⚠️ Paths ko apne real leave/employee API paths se match kar lena
// // // //   const fetchEmployees = useCallback(async () => {
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/employees", {
// // // //         params: { page: 1, page_size: 500 },
// // // //       });
// // // //       setEmployees(pickList(res));
// // // //     } catch {
// // // //       setEmployees([]);
// // // //     }
// // // //   }, []);

// // // //   const fetchDepartments = useCallback(async () => {
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/departments", {
// // // //         params: { page: 1, page_size: 200 },
// // // //       });
// // // //       setDepartments(pickList(res));
// // // //     } catch {
// // // //       setDepartments([]);
// // // //     }
// // // //   }, []);

// // // //   const fetchDesignations = useCallback(async () => {
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/designations", {
// // // //         params: { page: 1, page_size: 200 },
// // // //       });
// // // //       setDesignations(pickList(res));
// // // //     } catch {
// // // //       setDesignations([]);
// // // //     }
// // // //   }, []);

// // // //   const fetchLetters = useCallback(async () => {
// // // //     setListLoading(true);
// // // //     setError("");
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/generated/letters", {
// // // //         params: { page: 1, page_size: 50 },
// // // //       });
// // // //       setLetters(pickList(res));
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //       setLetters([]);
// // // //     } finally {
// // // //       setListLoading(false);
// // // //     }
// // // //   }, []);

// // // //   const fetchTemplates = useCallback(async () => {
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/letter/templates", {
// // // //         params: { is_active: true, page: 1, page_size: 100 },
// // // //       });
// // // //       setTemplates(pickList(res));
// // // //     } catch {
// // // //       setTemplates([]);
// // // //     }
// // // //   }, []);

// // // //   const fetchCategories = useCallback(async () => {
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/letter/categories", {
// // // //         params: { is_active: true, page: 1, page_size: 100 },
// // // //       });
// // // //       setCategories(pickList(res));
// // // //     } catch {
// // // //       setCategories([]);
// // // //     }
// // // //   }, []);

// // // //   const fetchRequests = useCallback(async () => {
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/letter/requests", {
// // // //         params: { page: 1, page_size: 50 },
// // // //       });
// // // //       setRequests(pickList(res));
// // // //     } catch {
// // // //       setRequests([]);
// // // //     }
// // // //   }, []);

// // // //   const fetchSignatories = useCallback(async () => {
// // // //     try {
// // // //       const res = await api.get("/api/v1/get/letter/signatories", {
// // // //         params: { is_active: true, page: 1, page_size: 100 },
// // // //       });
// // // //       setSignatories(pickList(res));
// // // //     } catch {
// // // //       setSignatories([]);
// // // //     }
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     fetchEmployees();
// // // //     fetchDepartments();
// // // //     fetchDesignations();
// // // //     fetchLetters();
// // // //     fetchTemplates();
// // // //     fetchCategories();
// // // //     fetchRequests();
// // // //     fetchSignatories();
// // // //   }, [
// // // //     fetchEmployees,
// // // //     fetchDepartments,
// // // //     fetchDesignations,
// // // //     fetchLetters,
// // // //     fetchTemplates,
// // // //     fetchCategories,
// // // //     fetchRequests,
// // // //     fetchSignatories,
// // // //   ]);

// // // //   /* ===================== DERIVED ===================== */
// // // //   const filteredEmployees = useMemo(() => {
// // // //     return employees.filter((emp) => {
// // // //       const deptId = emp.department_id || emp.department?.department_id || "";
// // // //       const desigId = emp.designation_id || emp.designation?.designation_id || "";
// // // //       const name = empName(emp).toLowerCase();
// // // //       const code = String(emp.employee_code || emp.employee_id || "").toLowerCase();

// // // //       const deptOk = !filterDept || deptId === filterDept;
// // // //       const desigOk = !filterDesig || desigId === filterDesig;
// // // //       const searchOk =
// // // //         !empSearch ||
// // // //         name.includes(empSearch.toLowerCase()) ||
// // // //         code.includes(empSearch.toLowerCase());

// // // //       return deptOk && desigOk && searchOk;
// // // //     });
// // // //   }, [employees, filterDept, filterDesig, empSearch]);

// // // //   const stats = useMemo(
// // // //     () => ({
// // // //       letters: letters.length,
// // // //       templates: templates.length,
// // // //       categories: categories.length,
// // // //       requests: requests.filter((r) => r.status === "pending").length,
// // // //       signatories: signatories.length,
// // // //     }),
// // // //     [letters, templates, categories, requests, signatories]
// // // //   );

// // // //   /* ===================== HANDLERS ===================== */
// // // //   async function handleCreateCategory(e) {
// // // //     e.preventDefault();
// // // //     setLoading(true);
// // // //     setError("");
// // // //     setSuccess("");
// // // //     try {
// // // //       await api.post("/api/v1/create/letter/category", {
// // // //         ...categoryForm,
// // // //         code: categoryForm.code.toUpperCase(),
// // // //         number_prefix:
// // // //           categoryForm.number_prefix || categoryForm.code.toUpperCase().slice(0, 3),
// // // //       });
// // // //       setSuccess("Category created successfully");
// // // //       setCategoryForm(EMPTY_CATEGORY);
// // // //       await fetchCategories();
// // // //       setActiveTab("categories");
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function handleCreateTemplate(e) {
// // // //     e.preventDefault();
// // // //     setLoading(true);
// // // //     setError("");
// // // //     setSuccess("");
// // // //     try {
// // // //       await api.post("/api/v1/create/letter/template", {
// // // //         ...templateForm,
// // // //         code: templateForm.code.toUpperCase(),
// // // //       });
// // // //       setSuccess("Template created successfully");
// // // //       setTemplateForm(EMPTY_TEMPLATE);
// // // //       await fetchTemplates();
// // // //       setActiveTab("templates");
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function handleCreateSignatory(e) {
// // // //     e.preventDefault();
// // // //     setLoading(true);
// // // //     setError("");
// // // //     setSuccess("");
// // // //     try {
// // // //       await api.post("/api/v1/create/letter/signatory", signatoryForm);
// // // //       setSuccess("Signatory created successfully");
// // // //       setSignatoryForm(EMPTY_SIGNATORY);
// // // //       await fetchSignatories();
// // // //       setActiveTab("signatories");
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function handleGenerate(e) {
// // // //     e.preventDefault();
// // // //     setLoading(true);
// // // //     setError("");
// // // //     setSuccess("");
// // // //     try {
// // // //       if (!generateForm.template_id) {
// // // //         setError("Please select a template");
// // // //         setLoading(false);
// // // //         return;
// // // //       }
// // // //       if (selectedEmployees.length === 0) {
// // // //         setError("Please select at least one employee");
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       const res = await api.post("/api/v1/generate/letter", {
// // // //         template_id: generateForm.template_id,
// // // //         employee_ids: selectedEmployees,
// // // //         issue_date: generateForm.issue_date || null,
// // // //         effective_date: generateForm.effective_date || null,
// // // //         signatory_id: generateForm.signatory_id || null,
// // // //         publish_to_ess: generateForm.publish_to_ess,
// // // //         send_email: generateForm.send_email,
// // // //       });

// // // //       setSuccess(res?.data?.message || "Letter(s) generated successfully");
// // // //       setGenerateForm(EMPTY_GENERATE);
// // // //       setSelectedEmployees([]);
// // // //       setFilterDept("");
// // // //       setFilterDesig("");
// // // //       setEmpSearch("");
// // // //       await fetchLetters();
// // // //       setActiveTab("letters");
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function handlePublish(letterId) {
// // // //     try {
// // // //       await api.post(`/api/v1/publish/letter/${letterId}`);
// // // //       setSuccess("Letter published to ESS");
// // // //       await fetchLetters();
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     }
// // // //   }

// // // //   async function handleSend(letterId) {
// // // //     try {
// // // //       await api.post(`/api/v1/send/letter/${letterId}`);
// // // //       setSuccess("Letter sent successfully");
// // // //       await fetchLetters();
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     }
// // // //   }

// // // //   async function handleProcessRequest(requestId, action) {
// // // //     try {
// // // //       await api.post(`/api/v1/process/letter/request/${requestId}`, { action });
// // // //       setSuccess(`Request ${action}d successfully`);
// // // //       await fetchRequests();
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     }
// // // //   }

// // // //   const tabs = [
// // // //     { id: "letters", label: "Generated Letters", count: stats.letters },
// // // //     { id: "templates", label: "Templates", count: stats.templates },
// // // //     { id: "categories", label: "Categories", count: stats.categories },
// // // //     { id: "signatories", label: "Signatories", count: stats.signatories },
// // // //     { id: "requests", label: "Requests", count: stats.requests },
// // // //     { id: "generate", label: "Generate" },
// // // //     { id: "create-template", label: "Create Template" },
// // // //     { id: "create-signatory", label: "Add Signatory" },
// // // //   ];

// // // //   /* ===================== UI ===================== */
// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
// // // //       {/* Header */}
// // // //       <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
// // // //         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
// // // //           <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
// // // //             <div>
// // // //               <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
// // // //                 HR Operations
// // // //               </p>
// // // //               <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
// // // //                 HR Letters
// // // //               </h1>
// // // //               <p className="mt-1 text-sm text-slate-500">
// // // //                 Templates, generation, requests & e-sign — connected to your employee master
// // // //               </p>
// // // //             </div>

// // // //             <div className="flex flex-wrap gap-2">
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => {
// // // //                   setActiveTab("generate");
// // // //                   setError("");
// // // //                   setSuccess("");
// // // //                 }}
// // // //                 className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
// // // //               >
// // // //                 Generate Letter
// // // //               </button>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => {
// // // //                   setActiveTab("create-template");
// // // //                   setError("");
// // // //                   setSuccess("");
// // // //                 }}
// // // //                 className="inline-flex items-center justify-center rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
// // // //               >
// // // //                 + Create Template
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Stats */}
// // // //           <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
// // // //             {[
// // // //               { label: "Letters", value: stats.letters, tone: "bg-indigo-50 text-indigo-700" },
// // // //               { label: "Templates", value: stats.templates, tone: "bg-violet-50 text-violet-700" },
// // // //               { label: "Categories", value: stats.categories, tone: "bg-sky-50 text-sky-700" },
// // // //               { label: "Pending Req", value: stats.requests, tone: "bg-amber-50 text-amber-700" },
// // // //               { label: "Signatories", value: stats.signatories, tone: "bg-emerald-50 text-emerald-700" },
// // // //             ].map((s) => (
// // // //               <div
// // // //                 key={s.label}
// // // //                 className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm"
// // // //               >
// // // //                 <p className="text-xs font-medium text-slate-500">{s.label}</p>
// // // //                 <p className={`mt-1 text-xl font-semibold ${s.tone.split(" ")[1]}`}>
// // // //                   {s.value}
// // // //                 </p>
// // // //               </div>
// // // //             ))}
// // // //           </div>

// // // //           {/* Tabs */}
// // // //           <div className="mt-5 flex flex-wrap gap-1 border-b border-slate-200">
// // // //             {tabs.map((tab) => (
// // // //               <button
// // // //                 key={tab.id}
// // // //                 type="button"
// // // //                 onClick={() => {
// // // //                   setActiveTab(tab.id);
// // // //                   setError("");
// // // //                   setSuccess("");
// // // //                 }}
// // // //                 className={`relative px-4 py-2.5 text-sm font-medium transition ${
// // // //                   activeTab === tab.id
// // // //                     ? "text-[#E42527]"
// // // //                     : "text-slate-500 hover:text-slate-800"
// // // //                 }`}
// // // //               >
// // // //                 {tab.label}
// // // //                 {typeof tab.count === "number" && (
// // // //                   <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
// // // //                     {tab.count}
// // // //                   </span>
// // // //                 )}
// // // //                 {activeTab === tab.id && (
// // // //                   <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
// // // //                 )}
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
// // // //         {error && (
// // // //           <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
// // // //             {error}
// // // //           </div>
// // // //         )}
// // // //         {success && (
// // // //           <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
// // // //             {success}
// // // //           </div>
// // // //         )}

// // // //         {/* ================= LETTERS ================= */}
// // // //         {activeTab === "letters" && (
// // // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // // //               <div>
// // // //                 <h2 className="text-sm font-semibold text-slate-800">Generated Letters</h2>
// // // //                 <p className="text-xs text-slate-500">{letters.length} records</p>
// // // //               </div>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={fetchLetters}
// // // //                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
// // // //               >
// // // //                 Refresh
// // // //               </button>
// // // //             </div>

// // // //             {listLoading ? (
// // // //               <div className="py-16 text-center text-sm text-slate-500">Loading letters...</div>
// // // //             ) : letters.length === 0 ? (
// // // //               <div className="px-6 py-16 text-center">
// // // //                 <p className="text-sm font-medium text-slate-700">No letters yet</p>
// // // //                 <p className="mt-1 text-sm text-slate-500">
// // // //                   Generate experience, relieving or offer letters
// // // //                 </p>
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => setActiveTab("generate")}
// // // //                   className="mt-4 rounded-xl bg-[#E42527] px-4 py-2 text-sm font-medium text-white"
// // // //                 >
// // // //                   Generate Letter
// // // //                 </button>
// // // //               </div>
// // // //             ) : (
// // // //               <div className="overflow-x-auto">
// // // //                 <table className="min-w-full text-sm">
// // // //                   <thead>
// // // //                     <tr className="border-b border-slate-100 bg-slate-50/80">
// // // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // // //                         Letter No.
// // // //                       </th>
// // // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // // //                         Employee
// // // //                       </th>
// // // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // // //                         Status
// // // //                       </th>
// // // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // // //                         Issue Date
// // // //                       </th>
// // // //                       <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
// // // //                         Actions
// // // //                       </th>
// // // //                     </tr>
// // // //                   </thead>
// // // //                   <tbody className="divide-y divide-slate-50">
// // // //                     {letters.map((letter, idx) => (
// // // //                       <tr key={letter.letter_id || idx} className="hover:bg-slate-50/70">
// // // //                         <td className="px-5 py-3.5">
// // // //                           <div className="font-medium text-slate-800">
// // // //                             {letter.letter_number || "—"}
// // // //                           </div>
// // // //                           <div className="text-xs text-slate-400">
// // // //                             {letter.template_name || letter.template_id || ""}
// // // //                           </div>
// // // //                         </td>
// // // //                         <td className="px-5 py-3.5 text-slate-700">
// // // //                           {letter.employee_name || letter.employee_id || "—"}
// // // //                         </td>
// // // //                         <td className="px-5 py-3.5">
// // // //                           <StatusBadge status={letter.status} />
// // // //                         </td>
// // // //                         <td className="px-5 py-3.5 text-slate-600">
// // // //                           {formatDate(letter.issue_date)}
// // // //                         </td>
// // // //                         <td className="px-5 py-3.5 text-right">
// // // //                           <div className="flex items-center justify-end gap-3">
// // // //                             <button
// // // //                               type="button"
// // // //                               onClick={() => setSelectedLetter(letter)}
// // // //                               className="text-sm font-medium text-[#E42527] hover:underline"
// // // //                             >
// // // //                               View
// // // //                             </button>
// // // //                             {letter.status !== "published" && (
// // // //                               <button
// // // //                                 type="button"
// // // //                                 onClick={() => handlePublish(letter.letter_id)}
// // // //                                 className="text-sm font-medium text-slate-600 hover:underline"
// // // //                               >
// // // //                                 Publish
// // // //                               </button>
// // // //                             )}
// // // //                             <button
// // // //                               type="button"
// // // //                               onClick={() => handleSend(letter.letter_id)}
// // // //                               className="text-sm font-medium text-slate-600 hover:underline"
// // // //                             >
// // // //                               Send
// // // //                             </button>
// // // //                           </div>
// // // //                         </td>
// // // //                       </tr>
// // // //                     ))}
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ================= TEMPLATES ================= */}
// // // //         {activeTab === "templates" && (
// // // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // // //               <div>
// // // //                 <h2 className="text-sm font-semibold text-slate-800">Templates</h2>
// // // //                 <p className="text-xs text-slate-500">{templates.length} active</p>
// // // //               </div>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={fetchTemplates}
// // // //                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
// // // //               >
// // // //                 Refresh
// // // //               </button>
// // // //             </div>
// // // //             {templates.length === 0 ? (
// // // //               <div className="px-6 py-16 text-center text-sm text-slate-500">
// // // //                 No templates — create one first
// // // //               </div>
// // // //             ) : (
// // // //               <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
// // // //                 {templates.map((t) => (
// // // //                   <button
// // // //                     key={t.template_id}
// // // //                     type="button"
// // // //                     onClick={() => setSelectedTemplate(t)}
// // // //                     className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-left transition hover:border-[#E42527]/30 hover:bg-white hover:shadow-sm"
// // // //                   >
// // // //                     <div className="flex items-start justify-between gap-2">
// // // //                       <div>
// // // //                         <p className="font-semibold text-slate-900">{t.name}</p>
// // // //                         <p className="mt-0.5 text-xs text-slate-500">{t.code}</p>
// // // //                       </div>
// // // //                       <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
// // // //                         v{t.version || 1}
// // // //                       </span>
// // // //                     </div>
// // // //                     <div className="mt-3 flex flex-wrap gap-1">
// // // //                       {t.requires_approval && (
// // // //                         <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
// // // //                           Approval
// // // //                         </span>
// // // //                       )}
// // // //                       {t.requires_esign && (
// // // //                         <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">
// // // //                           E-Sign
// // // //                         </span>
// // // //                       )}
// // // //                       {t.allow_employee_request && (
// // // //                         <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
// // // //                           Self Request
// // // //                         </span>
// // // //                       )}
// // // //                     </div>
// // // //                   </button>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ================= CATEGORIES ================= */}
// // // //         {activeTab === "categories" && (
// // // //           <div className="grid gap-6 lg:grid-cols-5">
// // // //             <div className="lg:col-span-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // // //               <div className="border-b border-slate-100 px-5 py-4">
// // // //                 <h2 className="text-sm font-semibold text-slate-800">Categories</h2>
// // // //               </div>
// // // //               <div className="divide-y divide-slate-50">
// // // //                 {categories.length === 0 ? (
// // // //                   <div className="px-5 py-10 text-center text-sm text-slate-500">
// // // //                     No categories
// // // //                   </div>
// // // //                 ) : (
// // // //                   categories.map((c) => (
// // // //                     <div
// // // //                       key={c.category_id}
// // // //                       className="flex items-center justify-between px-5 py-3.5"
// // // //                     >
// // // //                       <div>
// // // //                         <div className="font-medium text-slate-800">{c.name}</div>
// // // //                         <div className="text-xs text-slate-400">
// // // //                           {c.code} · Prefix {c.number_prefix || "—"}
// // // //                         </div>
// // // //                       </div>
// // // //                       <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
// // // //                         Active
// // // //                       </span>
// // // //                     </div>
// // // //                   ))
// // // //                 )}
// // // //               </div>
// // // //             </div>

// // // //             <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
// // // //               <h3 className="text-sm font-semibold text-slate-800">Add Category</h3>
// // // //               <form onSubmit={handleCreateCategory} className="mt-4 space-y-3">
// // // //                 <input
// // // //                   required
// // // //                   value={categoryForm.code}
// // // //                   onChange={(e) =>
// // // //                     setCategoryForm((p) => ({
// // // //                       ...p,
// // // //                       code: e.target.value.toUpperCase(),
// // // //                     }))
// // // //                   }
// // // //                   placeholder="Code e.g. EXPERIENCE"
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // // //                 />
// // // //                 <input
// // // //                   required
// // // //                   value={categoryForm.name}
// // // //                   onChange={(e) =>
// // // //                     setCategoryForm((p) => ({ ...p, name: e.target.value }))
// // // //                   }
// // // //                   placeholder="Name"
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // // //                 />
// // // //                 <input
// // // //                   value={categoryForm.number_prefix}
// // // //                   onChange={(e) =>
// // // //                     setCategoryForm((p) => ({
// // // //                       ...p,
// // // //                       number_prefix: e.target.value.toUpperCase(),
// // // //                     }))
// // // //                   }
// // // //                   placeholder="Prefix e.g. EXP"
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // // //                 />
// // // //                 <button
// // // //                   type="submit"
// // // //                   disabled={loading}
// // // //                   className="w-full rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // // //                 >
// // // //                   {loading ? "Saving..." : "Create Category"}
// // // //                 </button>
// // // //               </form>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* ================= SIGNATORIES ================= */}
// // // //         {activeTab === "signatories" && (
// // // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // // //               <h2 className="text-sm font-semibold text-slate-800">Authorized Signatories</h2>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => setActiveTab("create-signatory")}
// // // //                 className="rounded-xl bg-[#E42527] px-3 py-1.5 text-sm font-medium text-white"
// // // //               >
// // // //                 + Add
// // // //               </button>
// // // //             </div>
// // // //             {signatories.length === 0 ? (
// // // //               <div className="px-6 py-16 text-center text-sm text-slate-500">
// // // //                 No signatories
// // // //               </div>
// // // //             ) : (
// // // //               <div className="divide-y divide-slate-50">
// // // //                 {signatories.map((s) => (
// // // //                   <div
// // // //                     key={s.signatory_id}
// // // //                     className="flex items-center justify-between px-5 py-3.5"
// // // //                   >
// // // //                     <div>
// // // //                       <div className="font-medium text-slate-800">{s.name}</div>
// // // //                       <div className="text-xs text-slate-400">
// // // //                         {s.designation}
// // // //                         {s.department ? ` · ${s.department}` : ""}
// // // //                       </div>
// // // //                     </div>
// // // //                     {s.is_default && (
// // // //                       <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
// // // //                         Default
// // // //                       </span>
// // // //                     )}
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ================= REQUESTS ================= */}
// // // //         {activeTab === "requests" && (
// // // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // // //             <div className="border-b border-slate-100 px-5 py-4">
// // // //               <h2 className="text-sm font-semibold text-slate-800">Employee Requests</h2>
// // // //             </div>
// // // //             {requests.length === 0 ? (
// // // //               <div className="px-6 py-16 text-center text-sm text-slate-500">
// // // //                 No requests
// // // //               </div>
// // // //             ) : (
// // // //               <div className="overflow-x-auto">
// // // //                 <table className="min-w-full text-sm">
// // // //                   <thead>
// // // //                     <tr className="border-b border-slate-100 bg-slate-50/80">
// // // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
// // // //                         Employee
// // // //                       </th>
// // // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
// // // //                         Purpose
// // // //                       </th>
// // // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
// // // //                         Status
// // // //                       </th>
// // // //                       <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
// // // //                         Action
// // // //                       </th>
// // // //                     </tr>
// // // //                   </thead>
// // // //                   <tbody className="divide-y divide-slate-50">
// // // //                     {requests.map((r, idx) => (
// // // //                       <tr key={r.request_id || idx}>
// // // //                         <td className="px-5 py-3.5">
// // // //                           {r.employee_name || r.employee_id}
// // // //                         </td>
// // // //                         <td className="px-5 py-3.5 text-slate-600">
// // // //                           {r.purpose || r.reason || "—"}
// // // //                         </td>
// // // //                         <td className="px-5 py-3.5">
// // // //                           <StatusBadge status={r.status} />
// // // //                         </td>
// // // //                         <td className="px-5 py-3.5 text-right">
// // // //                           {r.status === "pending" && (
// // // //                             <div className="flex justify-end gap-2">
// // // //                               <button
// // // //                                 type="button"
// // // //                                 onClick={() =>
// // // //                                   handleProcessRequest(r.request_id, "approve")
// // // //                                 }
// // // //                                 className="text-sm font-medium text-emerald-600 hover:underline"
// // // //                               >
// // // //                                 Approve
// // // //                               </button>
// // // //                               <button
// // // //                                 type="button"
// // // //                                 onClick={() =>
// // // //                                   handleProcessRequest(r.request_id, "reject")
// // // //                                 }
// // // //                                 className="text-sm font-medium text-red-600 hover:underline"
// // // //                               >
// // // //                                 Reject
// // // //                               </button>
// // // //                             </div>
// // // //                           )}
// // // //                         </td>
// // // //                       </tr>
// // // //                     ))}
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ================= GENERATE (API dropdowns) ================= */}
// // // //         {activeTab === "generate" && (
// // // //           <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// // // //             <div className="mb-5">
// // // //               <h2 className="text-lg font-semibold text-slate-900">Generate Letter</h2>
// // // //               <p className="mt-1 text-sm text-slate-500">
// // // //                 Employees / Departments / Designations load from your master APIs
// // // //               </p>
// // // //             </div>

// // // //             <form onSubmit={handleGenerate} className="space-y-4">
// // // //               <div>
// // // //                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                   Template *
// // // //                 </label>
// // // //                 <select
// // // //                   required
// // // //                   value={generateForm.template_id}
// // // //                   onChange={(e) =>
// // // //                     setGenerateForm((p) => ({ ...p, template_id: e.target.value }))
// // // //                   }
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                 >
// // // //                   <option value="">Select template</option>
// // // //                   {templates.map((t) => (
// // // //                     <option key={t.template_id} value={t.template_id}>
// // // //                       {t.name} ({t.code})
// // // //                     </option>
// // // //                   ))}
// // // //                 </select>
// // // //               </div>

// // // //               <div className="grid gap-4 sm:grid-cols-2">
// // // //                 <div>
// // // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                     Department
// // // //                   </label>
// // // //                   <select
// // // //                     value={filterDept}
// // // //                     onChange={(e) => setFilterDept(e.target.value)}
// // // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                   >
// // // //                     <option value="">All Departments</option>
// // // //                     {departments.map((d) => (
// // // //                       <option
// // // //                         key={d.department_id || d.id}
// // // //                         value={d.department_id || d.id}
// // // //                       >
// // // //                         {d.department_name || d.name}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                     Designation
// // // //                   </label>
// // // //                   <select
// // // //                     value={filterDesig}
// // // //                     onChange={(e) => setFilterDesig(e.target.value)}
// // // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                   >
// // // //                     <option value="">All Designations</option>
// // // //                     {designations.map((d) => (
// // // //                       <option
// // // //                         key={d.designation_id || d.id}
// // // //                         value={d.designation_id || d.id}
// // // //                       >
// // // //                         {d.job_title || d.designation_name || d.name}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                 </div>
// // // //               </div>

// // // //               <div>
// // // //                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                   Search employee
// // // //                 </label>
// // // //                 <input
// // // //                   value={empSearch}
// // // //                   onChange={(e) => setEmpSearch(e.target.value)}
// // // //                   placeholder="Name or code..."
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                 />
// // // //               </div>

// // // //               <div>
// // // //                 <div className="mb-1.5 flex items-center justify-between">
// // // //                   <label className="text-sm font-medium text-slate-700">
// // // //                     Select Employees * ({selectedEmployees.length})
// // // //                   </label>
// // // //                   {selectedEmployees.length > 0 && (
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={() => setSelectedEmployees([])}
// // // //                       className="text-xs font-medium text-[#E42527] hover:underline"
// // // //                     >
// // // //                       Clear
// // // //                     </button>
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40">
// // // //                   {filteredEmployees.length === 0 ? (
// // // //                     <div className="px-4 py-8 text-center text-sm text-slate-500">
// // // //                       No employees found — check master data APIs
// // // //                     </div>
// // // //                   ) : (
// // // //                     filteredEmployees.map((emp) => {
// // // //                       const id = emp.employee_id || emp.id;
// // // //                       const checked = selectedEmployees.includes(id);
// // // //                       return (
// // // //                         <label
// // // //                           key={id}
// // // //                           className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-2.5 hover:bg-white last:border-0"
// // // //                         >
// // // //                           <input
// // // //                             type="checkbox"
// // // //                             checked={checked}
// // // //                             onChange={() =>
// // // //                               setSelectedEmployees((prev) =>
// // // //                                 checked
// // // //                                   ? prev.filter((x) => x !== id)
// // // //                                   : [...prev, id]
// // // //                               )
// // // //                             }
// // // //                             className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // // //                           />
// // // //                           <div className="min-w-0">
// // // //                             <p className="truncate text-sm font-medium text-slate-800">
// // // //                               {empName(emp)}
// // // //                             </p>
// // // //                             <p className="truncate text-xs text-slate-400">
// // // //                               {emp.employee_code || id}
// // // //                               {emp.department_name
// // // //                                 ? ` · ${emp.department_name}`
// // // //                                 : ""}
// // // //                               {emp.job_title ? ` · ${emp.job_title}` : ""}
// // // //                             </p>
// // // //                           </div>
// // // //                         </label>
// // // //                       );
// // // //                     })
// // // //                   )}
// // // //                 </div>
// // // //               </div>

// // // //               <div className="grid gap-4 sm:grid-cols-2">
// // // //                 <div>
// // // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                     Issue Date
// // // //                   </label>
// // // //                   <input
// // // //                     type="date"
// // // //                     value={generateForm.issue_date}
// // // //                     onChange={(e) =>
// // // //                       setGenerateForm((p) => ({ ...p, issue_date: e.target.value }))
// // // //                     }
// // // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                     Effective Date
// // // //                   </label>
// // // //                   <input
// // // //                     type="date"
// // // //                     value={generateForm.effective_date}
// // // //                     onChange={(e) =>
// // // //                       setGenerateForm((p) => ({
// // // //                         ...p,
// // // //                         effective_date: e.target.value,
// // // //                       }))
// // // //                     }
// // // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div>
// // // //                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // // //                   Signatory
// // // //                 </label>
// // // //                 <select
// // // //                   value={generateForm.signatory_id}
// // // //                   onChange={(e) =>
// // // //                     setGenerateForm((p) => ({ ...p, signatory_id: e.target.value }))
// // // //                   }
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                 >
// // // //                   <option value="">Optional</option>
// // // //                   {signatories.map((s) => (
// // // //                     <option key={s.signatory_id} value={s.signatory_id}>
// // // //                       {s.name} — {s.designation}
// // // //                     </option>
// // // //                   ))}
// // // //                 </select>
// // // //               </div>

// // // //               <div className="flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
// // // //                 <label className="flex items-center gap-2 text-sm text-slate-700">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={generateForm.publish_to_ess}
// // // //                     onChange={(e) =>
// // // //                       setGenerateForm((p) => ({
// // // //                         ...p,
// // // //                         publish_to_ess: e.target.checked,
// // // //                       }))
// // // //                     }
// // // //                   />
// // // //                   Publish to ESS
// // // //                 </label>
// // // //                 <label className="flex items-center gap-2 text-sm text-slate-700">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={generateForm.send_email}
// // // //                     onChange={(e) =>
// // // //                       setGenerateForm((p) => ({
// // // //                         ...p,
// // // //                         send_email: e.target.checked,
// // // //                       }))
// // // //                     }
// // // //                   />
// // // //                   Send Email
// // // //                 </label>
// // // //               </div>

// // // //               <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => {
// // // //                     setGenerateForm(EMPTY_GENERATE);
// // // //                     setSelectedEmployees([]);
// // // //                     setFilterDept("");
// // // //                     setFilterDesig("");
// // // //                     setEmpSearch("");
// // // //                   }}
// // // //                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
// // // //                 >
// // // //                   Reset
// // // //                 </button>
// // // //                 <button
// // // //                   type="submit"
// // // //                   disabled={loading || selectedEmployees.length === 0}
// // // //                   className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // // //                 >
// // // //                   {loading
// // // //                     ? "Generating..."
// // // //                     : `Generate (${selectedEmployees.length})`}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         )}

// // // //         {/* ================= CREATE TEMPLATE ================= */}
// // // //         {activeTab === "create-template" && (
// // // //           <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// // // //             <h2 className="text-lg font-semibold text-slate-900">Create Template</h2>
// // // //             <p className="mt-1 text-sm text-slate-500">
// // // //               Placeholders: {"{{employee.full_name}}"}, {"{{company.name}}"},{" "}
// // // //               {"{{letter.issue_date}}"}
// // // //             </p>
// // // //             <form onSubmit={handleCreateTemplate} className="mt-5 space-y-4">
// // // //               <div className="grid gap-4 sm:grid-cols-2">
// // // //                 <select
// // // //                   required
// // // //                   value={templateForm.category_id}
// // // //                   onChange={(e) =>
// // // //                     setTemplateForm((p) => ({ ...p, category_id: e.target.value }))
// // // //                   }
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                 >
// // // //                   <option value="">Category *</option>
// // // //                   {categories.map((c) => (
// // // //                     <option key={c.category_id} value={c.category_id}>
// // // //                       {c.name}
// // // //                     </option>
// // // //                   ))}
// // // //                 </select>
// // // //                 <input
// // // //                   required
// // // //                   value={templateForm.code}
// // // //                   onChange={(e) =>
// // // //                     setTemplateForm((p) => ({
// // // //                       ...p,
// // // //                       code: e.target.value.toUpperCase(),
// // // //                     }))
// // // //                   }
// // // //                   placeholder="Code *"
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                 />
// // // //               </div>
// // // //               <input
// // // //                 required
// // // //                 value={templateForm.name}
// // // //                 onChange={(e) =>
// // // //                   setTemplateForm((p) => ({ ...p, name: e.target.value }))
// // // //                 }
// // // //                 placeholder="Template name *"
// // // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //               />
// // // //               <textarea
// // // //                 rows={8}
// // // //                 value={templateForm.content_html}
// // // //                 onChange={(e) =>
// // // //                   setTemplateForm((p) => ({ ...p, content_html: e.target.value }))
// // // //                 }
// // // //                 placeholder="Letter HTML content..."
// // // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //               />
// // // //               <div className="flex flex-wrap gap-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
// // // //                 {[
// // // //                   ["requires_approval", "Approval"],
// // // //                   ["requires_esign", "E-Sign"],
// // // //                   ["allow_employee_request", "Self Request"],
// // // //                   ["password_protect_pdf", "Password PDF"],
// // // //                 ].map(([k, label]) => (
// // // //                   <label key={k} className="flex items-center gap-2 text-sm text-slate-700">
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       checked={templateForm[k]}
// // // //                       onChange={(e) =>
// // // //                         setTemplateForm((p) => ({ ...p, [k]: e.target.checked }))
// // // //                       }
// // // //                     />
// // // //                     {label}
// // // //                   </label>
// // // //                 ))}
// // // //               </div>
// // // //               <div className="flex justify-end">
// // // //                 <button
// // // //                   type="submit"
// // // //                   disabled={loading}
// // // //                   className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // // //                 >
// // // //                   {loading ? "Saving..." : "Create Template"}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         )}

// // // //         {/* ================= CREATE SIGNATORY ================= */}
// // // //         {activeTab === "create-signatory" && (
// // // //           <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// // // //             <h2 className="text-lg font-semibold text-slate-900">Add Signatory</h2>
// // // //             <form onSubmit={handleCreateSignatory} className="mt-5 space-y-4">
// // // //               <input
// // // //                 required
// // // //                 value={signatoryForm.name}
// // // //                 onChange={(e) =>
// // // //                   setSignatoryForm((p) => ({ ...p, name: e.target.value }))
// // // //                 }
// // // //                 placeholder="Name *"
// // // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //               />
// // // //               <input
// // // //                 required
// // // //                 value={signatoryForm.designation}
// // // //                 onChange={(e) =>
// // // //                   setSignatoryForm((p) => ({ ...p, designation: e.target.value }))
// // // //                 }
// // // //                 placeholder="Designation *"
// // // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //               />
// // // //               <div className="grid gap-4 sm:grid-cols-2">
// // // //                 <input
// // // //                   value={signatoryForm.department}
// // // //                   onChange={(e) =>
// // // //                     setSignatoryForm((p) => ({ ...p, department: e.target.value }))
// // // //                   }
// // // //                   placeholder="Department"
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                 />
// // // //                 <input
// // // //                   type="email"
// // // //                   value={signatoryForm.email}
// // // //                   onChange={(e) =>
// // // //                     setSignatoryForm((p) => ({ ...p, email: e.target.value }))
// // // //                   }
// // // //                   placeholder="Email"
// // // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // // //                 />
// // // //               </div>
// // // //               <label className="flex items-center gap-2 text-sm text-slate-700">
// // // //                 <input
// // // //                   type="checkbox"
// // // //                   checked={signatoryForm.is_default}
// // // //                   onChange={(e) =>
// // // //                     setSignatoryForm((p) => ({ ...p, is_default: e.target.checked }))
// // // //                   }
// // // //                 />
// // // //                 Default signatory
// // // //               </label>
// // // //               <button
// // // //                 type="submit"
// // // //                 disabled={loading}
// // // //                 className="w-full rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // // //               >
// // // //                 {loading ? "Saving..." : "Add Signatory"}
// // // //               </button>
// // // //             </form>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Letter modal */}
// // // //       {selectedLetter && (
// // // //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// // // //           <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
// // // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // // //               <div>
// // // //                 <p className="text-xs uppercase tracking-wide text-slate-400">Letter</p>
// // // //                 <h3 className="text-lg font-semibold text-slate-900">
// // // //                   {selectedLetter.letter_number || "—"}
// // // //                 </h3>
// // // //               </div>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => setSelectedLetter(null)}
// // // //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// // // //               >
// // // //                 ✕
// // // //               </button>
// // // //             </div>
// // // //             <div className="grid gap-3 p-5 sm:grid-cols-2">
// // // //               {[
// // // //                 ["Status", selectedLetter.status],
// // // //                 ["Employee", selectedLetter.employee_name || selectedLetter.employee_id],
// // // //                 ["Issue Date", formatDate(selectedLetter.issue_date)],
// // // //                 ["Effective", formatDate(selectedLetter.effective_date)],
// // // //               ].map(([l, v]) => (
// // // //                 <div key={l} className="rounded-xl bg-slate-50 px-3 py-2.5">
// // // //                   <p className="text-xs text-slate-400">{l}</p>
// // // //                   <p className="mt-1 text-sm font-medium capitalize text-slate-800">
// // // //                     {v ?? "—"}
// // // //                   </p>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //             <div className="flex justify-end border-t border-slate-100 px-5 py-4">
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => setSelectedLetter(null)}
// // // //                 className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
// // // //               >
// // // //                 Close
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Template modal */}
// // // //       {selectedTemplate && (
// // // //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
// // // //           <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
// // // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // // //               <h3 className="text-lg font-semibold text-slate-900">
// // // //                 {selectedTemplate.name}
// // // //               </h3>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => setSelectedTemplate(null)}
// // // //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// // // //               >
// // // //                 ✕
// // // //               </button>
// // // //             </div>
// // // //             <div className="grid gap-3 p-5 sm:grid-cols-2">
// // // //               {[
// // // //                 ["Code", selectedTemplate.code],
// // // //                 ["Version", selectedTemplate.version || 1],
// // // //                 ["Approval", selectedTemplate.requires_approval ? "Yes" : "No"],
// // // //                 ["E-Sign", selectedTemplate.requires_esign ? "Yes" : "No"],
// // // //               ].map(([l, v]) => (
// // // //                 <div key={l} className="rounded-xl bg-slate-50 px-3 py-2.5">
// // // //                   <p className="text-xs text-slate-400">{l}</p>
// // // //                   <p className="mt-1 text-sm font-medium text-slate-800">{v}</p>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //             <div className="flex justify-end border-t border-slate-100 px-5 py-4">
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => setSelectedTemplate(null)}
// // // //                 className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
// // // //               >
// // // //                 Close
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useCallback, useEffect, useMemo, useState } from "react";
// // // import { api } from "@/lib/api";

// // // /* ===================== CONSTANTS ===================== */
// // // const STATUS_COLOR = {
// // //   draft: "bg-slate-100 text-slate-700",
// // //   pending_approval: "bg-amber-50 text-amber-700",
// // //   approved: "bg-blue-50 text-blue-700",
// // //   sent: "bg-indigo-50 text-indigo-700",
// // //   published: "bg-emerald-50 text-emerald-700",
// // //   viewed: "bg-cyan-50 text-cyan-700",
// // //   accepted: "bg-green-50 text-green-700",
// // //   declined: "bg-red-50 text-red-700",
// // //   signed: "bg-violet-50 text-violet-700",
// // //   expired: "bg-orange-50 text-orange-700",
// // //   cancelled: "bg-rose-50 text-rose-700",
// // //   pending: "bg-amber-50 text-amber-700",
// // //   generated: "bg-emerald-50 text-emerald-700",
// // //   rejected: "bg-red-50 text-red-700",
// // // };

// // // const EMPTY_CATEGORY = {
// // //   code: "",
// // //   name: "",
// // //   description: "",
// // //   number_prefix: "",
// // //   display_order: 100,
// // //   is_active: true,
// // // };

// // // const EMPTY_TEMPLATE = {
// // //   category_id: "",
// // //   name: "",
// // //   code: "",
// // //   description: "",
// // //   content_html: "",
// // //   requires_approval: false,
// // //   requires_esign: false,
// // //   allow_employee_request: false,
// // //   password_protect_pdf: false,
// // //   is_active: true,
// // // };

// // // const EMPTY_GENERATE = {
// // //   template_id: "",
// // //   issue_date: "",
// // //   effective_date: "",
// // //   signatory_id: "",
// // //   publish_to_ess: true,
// // //   send_email: false,
// // // };

// // // const EMPTY_SIGNATORY = {
// // //   name: "",
// // //   designation: "",
// // //   department: "",
// // //   email: "",
// // //   is_default: false,
// // //   is_active: true,
// // // };

// // // /* ===================== HELPERS ===================== */
// // // function getErrorMessage(err) {
// // //   const detail = err?.response?.data?.detail;
// // //   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
// // //   if (typeof detail === "string") return detail;
// // //   return err?.message || "Something went wrong";
// // // }

// // // function pickList(res) {
// // //   const body = res?.data ?? {};
// // //   const list =
// // //     body?.data ??
// // //     body?.items ??
// // //     body?.results ??
// // //     body?.employees ??
// // //     body?.departments ??
// // //     body?.designations ??
// // //     body?.templates ??
// // //     body?.categories ??
// // //     body?.letters ??
// // //     body?.requests ??
// // //     body?.signatories ??
// // //     [];
// // //   return Array.isArray(list) ? list : Array.isArray(body) ? body : [];
// // // }

// // // function formatDate(value) {
// // //   if (!value) return "—";
// // //   try {
// // //     return new Date(value).toLocaleDateString("en-IN", {
// // //       day: "2-digit",
// // //       month: "short",
// // //       year: "numeric",
// // //     });
// // //   } catch {
// // //     return String(value);
// // //   }
// // // }

// // // function empName(emp) {
// // //   if (!emp) return "—";
// // //   if (emp.full_name) return emp.full_name;
// // //   const n = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
// // //   return n || emp.employee_code || emp.employee_id || "—";
// // // }

// // // function StatusBadge({ status }) {
// // //   const key = String(status || "").toLowerCase();
// // //   const color = STATUS_COLOR[key] || "bg-slate-100 text-slate-600";
// // //   return (
// // //     <span
// // //       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${color}`}
// // //     >
// // //       {String(status || "—").replace(/_/g, " ")}
// // //     </span>
// // //   );
// // // }

// // // /* ===================== PAGE ===================== */
// // // export default function HRLettersPage() {
// // //   const [activeTab, setActiveTab] = useState("letters");

// // //   const [employees, setEmployees] = useState([]);
// // //   const [departments, setDepartments] = useState([]);
// // //   const [designations, setDesignations] = useState([]);

// // //   const [letters, setLetters] = useState([]);
// // //   const [templates, setTemplates] = useState([]);
// // //   const [categories, setCategories] = useState([]);
// // //   const [requests, setRequests] = useState([]);
// // //   const [signatories, setSignatories] = useState([]);

// // //   const [listLoading, setListLoading] = useState(true);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");

// // //   const [selectedLetter, setSelectedLetter] = useState(null);
// // //   const [selectedTemplate, setSelectedTemplate] = useState(null);

// // //   const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
// // //   const [templateForm, setTemplateForm] = useState(EMPTY_TEMPLATE);
// // //   const [generateForm, setGenerateForm] = useState(EMPTY_GENERATE);
// // //   const [signatoryForm, setSignatoryForm] = useState(EMPTY_SIGNATORY);

// // //   const [selectedEmployees, setSelectedEmployees] = useState([]);
// // //   const [filterDept, setFilterDept] = useState("");
// // //   const [filterDesig, setFilterDesig] = useState("");
// // //   const [empSearch, setEmpSearch] = useState("");
// // //   const [letterSearch, setLetterSearch] = useState("");

// // //   /* ===================== FETCH ===================== */
// // //   const fetchEmployees = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/employees", {
// // //         params: { page: 1, page_size: 500 },
// // //       });
// // //       setEmployees(pickList(res));
// // //     } catch {
// // //       setEmployees([]);
// // //     }
// // //   }, []);

// // //   const fetchDepartments = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/departments", {
// // //         params: { page: 1, page_size: 200 },
// // //       });
// // //       setDepartments(pickList(res));
// // //     } catch {
// // //       setDepartments([]);
// // //     }
// // //   }, []);

// // //   const fetchDesignations = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/designations", {
// // //         params: { page: 1, page_size: 200 },
// // //       });
// // //       setDesignations(pickList(res));
// // //     } catch {
// // //       setDesignations([]);
// // //     }
// // //   }, []);

// // //   const fetchLetters = useCallback(async () => {
// // //     setListLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api.get("/api/v1/get/generated/letters", {
// // //         params: { page: 1, page_size: 100 },
// // //       });
// // //       setLetters(pickList(res));
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //       setLetters([]);
// // //     } finally {
// // //       setListLoading(false);
// // //     }
// // //   }, []);

// // //   const fetchTemplates = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/letter/templates", {
// // //         params: { is_active: true, page: 1, page_size: 100 },
// // //       });
// // //       setTemplates(pickList(res));
// // //     } catch {
// // //       setTemplates([]);
// // //     }
// // //   }, []);

// // //   const fetchCategories = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/letter/categories", {
// // //         params: { is_active: true, page: 1, page_size: 100 },
// // //       });
// // //       setCategories(pickList(res));
// // //     } catch {
// // //       setCategories([]);
// // //     }
// // //   }, []);

// // //   const fetchRequests = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/letter/requests", {
// // //         params: { page: 1, page_size: 50 },
// // //       });
// // //       setRequests(pickList(res));
// // //     } catch {
// // //       setRequests([]);
// // //     }
// // //   }, []);

// // //   const fetchSignatories = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/letter/signatories", {
// // //         params: { is_active: true, page: 1, page_size: 100 },
// // //       });
// // //       setSignatories(pickList(res));
// // //     } catch {
// // //       setSignatories([]);
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     fetchEmployees();
// // //     fetchDepartments();
// // //     fetchDesignations();
// // //     fetchLetters();
// // //     fetchTemplates();
// // //     fetchCategories();
// // //     fetchRequests();
// // //     fetchSignatories();
// // //   }, [
// // //     fetchEmployees,
// // //     fetchDepartments,
// // //     fetchDesignations,
// // //     fetchLetters,
// // //     fetchTemplates,
// // //     fetchCategories,
// // //     fetchRequests,
// // //     fetchSignatories,
// // //   ]);

// // //   /* ===================== DERIVED ===================== */
// // //   const filteredEmployees = useMemo(() => {
// // //     return employees.filter((emp) => {
// // //       const deptId = emp.department_id || emp.department?.department_id || "";
// // //       const desigId = emp.designation_id || emp.designation?.designation_id || "";
// // //       const name = empName(emp).toLowerCase();
// // //       const code = String(emp.employee_code || emp.employee_id || "").toLowerCase();
// // //       const deptOk = !filterDept || deptId === filterDept;
// // //       const desigOk = !filterDesig || desigId === filterDesig;
// // //       const searchOk =
// // //         !empSearch ||
// // //         name.includes(empSearch.toLowerCase()) ||
// // //         code.includes(empSearch.toLowerCase());
// // //       return deptOk && desigOk && searchOk;
// // //     });
// // //   }, [employees, filterDept, filterDesig, empSearch]);

// // //   const filteredLetters = useMemo(() => {
// // //     if (!letterSearch.trim()) return letters;
// // //     const q = letterSearch.toLowerCase();
// // //     return letters.filter(
// // //       (l) =>
// // //         String(l.letter_number || "").toLowerCase().includes(q) ||
// // //         String(l.employee_name || "").toLowerCase().includes(q) ||
// // //         String(l.employee_id || "").toLowerCase().includes(q) ||
// // //         String(l.status || "").toLowerCase().includes(q)
// // //     );
// // //   }, [letters, letterSearch]);

// // //   const stats = useMemo(
// // //     () => ({
// // //       letters: letters.length,
// // //       templates: templates.length,
// // //       categories: categories.length,
// // //       pending: requests.filter((r) => String(r.status).toLowerCase() === "pending")
// // //         .length,
// // //       signatories: signatories.length,
// // //     }),
// // //     [letters, templates, categories, requests, signatories]
// // //   );

// // //   /* ===================== HANDLERS ===================== */
// // //   async function handleCreateCategory(e) {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       await api.post("/api/v1/create/letter/category", {
// // //         ...categoryForm,
// // //         code: categoryForm.code.toUpperCase(),
// // //         number_prefix:
// // //           categoryForm.number_prefix ||
// // //           categoryForm.code.toUpperCase().slice(0, 3),
// // //       });
// // //       setSuccess("Category created");
// // //       setCategoryForm(EMPTY_CATEGORY);
// // //       await fetchCategories();
// // //       setActiveTab("categories");
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function handleCreateTemplate(e) {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       await api.post("/api/v1/create/letter/template", {
// // //         ...templateForm,
// // //         code: templateForm.code.toUpperCase(),
// // //       });
// // //       setSuccess("Template created");
// // //       setTemplateForm(EMPTY_TEMPLATE);
// // //       await fetchTemplates();
// // //       setActiveTab("templates");
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function handleCreateSignatory(e) {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       await api.post("/api/v1/create/letter/signatory", signatoryForm);
// // //       setSuccess("Signatory added");
// // //       setSignatoryForm(EMPTY_SIGNATORY);
// // //       await fetchSignatories();
// // //       setActiveTab("signatories");
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function handleGenerate(e) {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError("");
// // //     setSuccess("");
// // //     try {
// // //       if (!generateForm.template_id) {
// // //         setError("Select a template");
// // //         setLoading(false);
// // //         return;
// // //       }
// // //       if (selectedEmployees.length === 0) {
// // //         setError("Select at least one employee");
// // //         setLoading(false);
// // //         return;
// // //       }
// // //       const res = await api.post("/api/v1/generate/letter", {
// // //         template_id: generateForm.template_id,
// // //         employee_ids: selectedEmployees,
// // //         issue_date: generateForm.issue_date || null,
// // //         effective_date: generateForm.effective_date || null,
// // //         signatory_id: generateForm.signatory_id || null,
// // //         publish_to_ess: generateForm.publish_to_ess,
// // //         send_email: generateForm.send_email,
// // //       });
// // //       setSuccess(res?.data?.message || "Letter(s) generated");
// // //       setGenerateForm(EMPTY_GENERATE);
// // //       setSelectedEmployees([]);
// // //       setFilterDept("");
// // //       setFilterDesig("");
// // //       setEmpSearch("");
// // //       await fetchLetters();
// // //       setActiveTab("letters");
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function handlePublish(letterId) {
// // //     try {
// // //       await api.post(`/api/v1/publish/letter/${letterId}`);
// // //       setSuccess("Published to ESS");
// // //       await fetchLetters();
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     }
// // //   }

// // //   async function handleSend(letterId) {
// // //     try {
// // //       await api.post(`/api/v1/send/letter/${letterId}`);
// // //       setSuccess("Letter sent");
// // //       await fetchLetters();
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     }
// // //   }

// // // //   async function handleDownload(letterId) {
// // // //     try {
// // // //       const res = await api.get(`/api/v1/download/letter/${letterId}`, {
// // // //         params: { format: "pdf" },
// // // //       });
// // // //       const url = res?.data?.download_url;
// // // //       if (url) {
// // // //         window.open(url, "_blank");
// // // //       } else {
// // // //         setError("PDF not ready yet for this letter");
// // // //       }
// // // //     } catch (err) {
// // // //       setError(getErrorMessage(err));
// // // //     }
// // // //   }


// // //     async function handleDownload(letterId) {
// // //   try {
// // //     setError("");
// // //     const res = await api.get(`/api/v1/download/letter/${letterId}`, {
// // //       params: { format: "pdf" },
// // //     });
// // //     const data = res?.data || {};

// // //     // real PDF url
// // //     if (data.download_url) {
// // //       window.open(data.download_url, "_blank");
// // //       return;
// // //     }

// // //     // HTML → print → Save as PDF
// // //     if (data.content_html) {
// // //       const w = window.open("", "_blank");
// // //       if (!w) {
// // //         setError("Popup blocked. Allow popups for this site.");
// // //         return;
// // //       }
// // //       w.document.write(`<!DOCTYPE html>
// // // <html>
// // // <head>
// // //   <meta charset="utf-8" />
// // //   <title>${data.letter_number || "Letter"}</title>
// // //   <style>
// // //     body { font-family: Arial, Helvetica, sans-serif; padding: 48px; line-height: 1.7; color: #111; max-width: 800px; margin: 0 auto; }
// // //     p { margin: 0 0 12px; }
// // //     @media print { body { padding: 20px; } }
// // //   </style>
// // // </head>
// // // <body>
// // //   ${data.content_html}
// // //   <script>
// // //     window.onload = function() { setTimeout(function(){ window.print(); }, 250); };
// // //   </script>
// // // </body>
// // // </html>`);
// // //       w.document.close();
// // //       return;
// // //     }

// // //     setError(data.message || "Download not available");
// // //   } catch (err) {
// // //     setError(getErrorMessage(err));
// // //   }
// // // }

// // //   async function handleProcessRequest(requestId, action) {
// // //     try {
// // //       await api.post(`/api/v1/process/letter/request/${requestId}`, { action });
// // //       setSuccess(`Request ${action}d`);
// // //       await fetchRequests();
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //     }
// // //   }

// // //   const tabs = [
// // //     { id: "letters", label: "Letters", count: stats.letters },
// // //     { id: "templates", label: "Templates", count: stats.templates },
// // //     { id: "categories", label: "Categories", count: stats.categories },
// // //     { id: "signatories", label: "Signatories", count: stats.signatories },
// // //     { id: "requests", label: "Requests", count: stats.pending },
// // //     { id: "generate", label: "Generate" },
// // //     { id: "create-template", label: "+ Template" },
// // //     { id: "create-signatory", label: "+ Signatory" },
// // //   ];

// // //   /* ===================== UI ===================== */
// // //   return (
// // //     <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50">
// // //       {/* Header */}
// // //       <div className="border-b border-slate-200 bg-white">
// // //         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
// // //           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// // //             <div>
// // //               <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
// // //                 HR Operations
// // //               </p>
// // //               <h1 className="mt-0.5 text-2xl font-semibold text-slate-900">
// // //                 HR Letters
// // //               </h1>
// // //               <p className="mt-1 text-sm text-slate-500">
// // //                 Generate, publish & manage employee letters
// // //               </p>
// // //             </div>
// // //             <div className="flex flex-wrap gap-2">
// // //               <button
// // //                 type="button"
// // //                 onClick={() => {
// // //                   setActiveTab("generate");
// // //                   setError("");
// // //                   setSuccess("");
// // //                 }}
// // //                 className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
// // //               >
// // //                 Generate Letter
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => {
// // //                   setActiveTab("create-template");
// // //                   setError("");
// // //                   setSuccess("");
// // //                 }}
// // //                 className="rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
// // //               >
// // //                 + Template
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Stats */}
// // //           <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
// // //             {[
// // //               { label: "Letters", value: stats.letters, color: "text-indigo-600" },
// // //               { label: "Templates", value: stats.templates, color: "text-violet-600" },
// // //               { label: "Categories", value: stats.categories, color: "text-sky-600" },
// // //               { label: "Pending Req", value: stats.pending, color: "text-amber-600" },
// // //               { label: "Signatories", value: stats.signatories, color: "text-emerald-600" },
// // //             ].map((s) => (
// // //               <div
// // //                 key={s.label}
// // //                 className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
// // //               >
// // //                 <p className="text-xs font-medium text-slate-500">{s.label}</p>
// // //                 <p className={`mt-1 text-2xl font-semibold ${s.color}`}>{s.value}</p>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           {/* Tabs */}
// // //           <div className="mt-5 flex flex-wrap gap-1 border-b border-slate-200">
// // //             {tabs.map((tab) => (
// // //               <button
// // //                 key={tab.id}
// // //                 type="button"
// // //                 onClick={() => {
// // //                   setActiveTab(tab.id);
// // //                   setError("");
// // //                   setSuccess("");
// // //                 }}
// // //                 className={`relative px-3.5 py-2.5 text-sm font-medium transition ${
// // //                   activeTab === tab.id
// // //                     ? "text-[#E42527]"
// // //                     : "text-slate-500 hover:text-slate-800"
// // //                 }`}
// // //               >
// // //                 {tab.label}
// // //                 {typeof tab.count === "number" && (
// // //                   <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
// // //                     {tab.count}
// // //                   </span>
// // //                 )}
// // //                 {activeTab === tab.id && (
// // //                   <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
// // //                 )}
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
// // //         {error && (
// // //           <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
// // //             {error}
// // //           </div>
// // //         )}
// // //         {success && (
// // //           <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
// // //             {success}
// // //           </div>
// // //         )}

// // //         {/* ===== LETTERS ===== */}
// // //         {activeTab === "letters" && (
// // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // //             <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
// // //               <div>
// // //                 <h2 className="text-sm font-semibold text-slate-800">Generated Letters</h2>
// // //                 <p className="text-xs text-slate-500">{filteredLetters.length} shown</p>
// // //               </div>
// // //               <div className="flex gap-2">
// // //                 <input
// // //                   value={letterSearch}
// // //                   onChange={(e) => setLetterSearch(e.target.value)}
// // //                   placeholder="Search letter / employee..."
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527] sm:w-56"
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={fetchLetters}
// // //                   className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
// // //                 >
// // //                   Refresh
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {listLoading ? (
// // //               <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
// // //             ) : filteredLetters.length === 0 ? (
// // //               <div className="px-6 py-16 text-center">
// // //                 <p className="text-sm font-medium text-slate-700">No letters found</p>
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setActiveTab("generate")}
// // //                   className="mt-4 rounded-xl bg-[#E42527] px-4 py-2 text-sm font-medium text-white"
// // //                 >
// // //                   Generate Letter
// // //                 </button>
// // //               </div>
// // //             ) : (
// // //               <div className="overflow-x-auto">
// // //                 <table className="min-w-full text-sm">
// // //                   <thead>
// // //                     <tr className="border-b border-slate-100 bg-slate-50/80">
// // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                         Letter No.
// // //                       </th>
// // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                         Employee
// // //                       </th>
// // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                         Status
// // //                       </th>
// // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                         Issue Date
// // //                       </th>
// // //                       <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
// // //                         Actions
// // //                       </th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody className="divide-y divide-slate-50">
// // //                     {filteredLetters.map((letter, idx) => (
// // //                       <tr key={letter.letter_id || idx} className="hover:bg-slate-50/70">
// // //                         <td className="px-5 py-3.5">
// // //                           <div className="font-medium text-slate-800">
// // //                             {letter.letter_number || "—"}
// // //                           </div>
// // //                           <div className="text-xs text-slate-400">
// // //                             {letter.template_name || letter.template_id || ""}
// // //                           </div>
// // //                         </td>
// // //                         <td className="px-5 py-3.5 text-slate-700">
// // //                           {letter.employee_name || letter.employee_id || "—"}
// // //                         </td>
// // //                         <td className="px-5 py-3.5">
// // //                           <StatusBadge status={letter.status} />
// // //                         </td>
// // //                         <td className="px-5 py-3.5 text-slate-600">
// // //                           {formatDate(letter.issue_date)}
// // //                         </td>
// // //                         <td className="px-5 py-3.5 text-right">
// // //                           <div className="flex flex-wrap items-center justify-end gap-2">
// // //                             <button
// // //                               type="button"
// // //                               onClick={() => setSelectedLetter(letter)}
// // //                               className="rounded-lg px-2 py-1 text-sm font-medium text-[#E42527] hover:bg-red-50"
// // //                             >
// // //                               View
// // //                             </button>
// // //                             <button
// // //                               type="button"
// // //                               onClick={() => handleDownload(letter.letter_id)}
// // //                               className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
// // //                             >
// // //                               Download
// // //                             </button>
// // //                             {String(letter.status).toLowerCase() !== "published" && (
// // //                               <button
// // //                                 type="button"
// // //                                 onClick={() => handlePublish(letter.letter_id)}
// // //                                 className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
// // //                               >
// // //                                 Publish
// // //                               </button>
// // //                             )}
// // //                             <button
// // //                               type="button"
// // //                               onClick={() => handleSend(letter.letter_id)}
// // //                               className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
// // //                             >
// // //                               Send
// // //                             </button>
// // //                           </div>
// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* ===== TEMPLATES ===== */}
// // //         {activeTab === "templates" && (
// // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // //               <h2 className="text-sm font-semibold text-slate-800">Templates</h2>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setActiveTab("create-template")}
// // //                 className="rounded-xl bg-[#E42527] px-3 py-1.5 text-sm font-medium text-white"
// // //               >
// // //                 + New
// // //               </button>
// // //             </div>
// // //             {templates.length === 0 ? (
// // //               <div className="px-6 py-16 text-center text-sm text-slate-500">
// // //                 No templates yet
// // //               </div>
// // //             ) : (
// // //               <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
// // //                 {templates.map((t) => (
// // //                   <button
// // //                     key={t.template_id}
// // //                     type="button"
// // //                     onClick={() => setSelectedTemplate(t)}
// // //                     className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 text-left transition hover:border-[#E42527]/40 hover:bg-white hover:shadow-md"
// // //                   >
// // //                     <div className="flex items-start justify-between gap-2">
// // //                       <div>
// // //                         <p className="font-semibold text-slate-900">{t.name}</p>
// // //                         <p className="mt-0.5 text-xs text-slate-500">{t.code}</p>
// // //                       </div>
// // //                       <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
// // //                         v{t.version || 1}
// // //                       </span>
// // //                     </div>
// // //                     <div className="mt-3 flex flex-wrap gap-1">
// // //                       {t.requires_approval && (
// // //                         <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
// // //                           Approval
// // //                         </span>
// // //                       )}
// // //                       {t.requires_esign && (
// // //                         <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">
// // //                           E-Sign
// // //                         </span>
// // //                       )}
// // //                       {t.allow_employee_request && (
// // //                         <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
// // //                           Self Request
// // //                         </span>
// // //                       )}
// // //                     </div>
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* ===== CATEGORIES ===== */}
// // //         {activeTab === "categories" && (
// // //           <div className="grid gap-6 lg:grid-cols-5">
// // //             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
// // //               <div className="border-b border-slate-100 px-5 py-4">
// // //                 <h2 className="text-sm font-semibold text-slate-800">Categories</h2>
// // //               </div>
// // //               <div className="divide-y divide-slate-50">
// // //                 {categories.length === 0 ? (
// // //                   <div className="px-5 py-10 text-center text-sm text-slate-500">
// // //                     No categories
// // //                   </div>
// // //                 ) : (
// // //                   categories.map((c) => (
// // //                     <div
// // //                       key={c.category_id}
// // //                       className="flex items-center justify-between px-5 py-3.5"
// // //                     >
// // //                       <div>
// // //                         <div className="font-medium text-slate-800">{c.name}</div>
// // //                         <div className="text-xs text-slate-400">
// // //                           {c.code} · Prefix {c.number_prefix || "—"}
// // //                         </div>
// // //                       </div>
// // //                       <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
// // //                         Active
// // //                       </span>
// // //                     </div>
// // //                   ))
// // //                 )}
// // //               </div>
// // //             </div>

// // //             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
// // //               <h3 className="text-sm font-semibold text-slate-800">Add Category</h3>
// // //               <form onSubmit={handleCreateCategory} className="mt-4 space-y-3">
// // //                 <input
// // //                   required
// // //                   value={categoryForm.code}
// // //                   onChange={(e) =>
// // //                     setCategoryForm((p) => ({
// // //                       ...p,
// // //                       code: e.target.value.toUpperCase(),
// // //                     }))
// // //                   }
// // //                   placeholder="Code e.g. EXPERIENCE"
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //                 />
// // //                 <input
// // //                   required
// // //                   value={categoryForm.name}
// // //                   onChange={(e) =>
// // //                     setCategoryForm((p) => ({ ...p, name: e.target.value }))
// // //                   }
// // //                   placeholder="Name"
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //                 />
// // //                 <input
// // //                   value={categoryForm.number_prefix}
// // //                   onChange={(e) =>
// // //                     setCategoryForm((p) => ({
// // //                       ...p,
// // //                       number_prefix: e.target.value.toUpperCase(),
// // //                     }))
// // //                   }
// // //                   placeholder="Prefix e.g. EXP"
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
// // //                 />
// // //                 <button
// // //                   type="submit"
// // //                   disabled={loading}
// // //                   className="w-full rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // //                 >
// // //                   {loading ? "Saving..." : "Create Category"}
// // //                 </button>
// // //               </form>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* ===== SIGNATORIES ===== */}
// // //         {activeTab === "signatories" && (
// // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // //               <h2 className="text-sm font-semibold text-slate-800">Signatories</h2>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setActiveTab("create-signatory")}
// // //                 className="rounded-xl bg-[#E42527] px-3 py-1.5 text-sm font-medium text-white"
// // //               >
// // //                 + Add
// // //               </button>
// // //             </div>
// // //             {signatories.length === 0 ? (
// // //               <div className="px-6 py-16 text-center text-sm text-slate-500">
// // //                 No signatories
// // //               </div>
// // //             ) : (
// // //               <div className="divide-y divide-slate-50">
// // //                 {signatories.map((s) => (
// // //                   <div
// // //                     key={s.signatory_id}
// // //                     className="flex items-center justify-between px-5 py-3.5"
// // //                   >
// // //                     <div>
// // //                       <div className="font-medium text-slate-800">{s.name}</div>
// // //                       <div className="text-xs text-slate-400">
// // //                         {s.designation}
// // //                         {s.department ? ` · ${s.department}` : ""}
// // //                       </div>
// // //                     </div>
// // //                     {s.is_default && (
// // //                       <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
// // //                         Default
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* ===== REQUESTS ===== */}
// // //         {activeTab === "requests" && (
// // //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// // //             <div className="border-b border-slate-100 px-5 py-4">
// // //               <h2 className="text-sm font-semibold text-slate-800">Employee Requests</h2>
// // //             </div>
// // //             {requests.length === 0 ? (
// // //               <div className="px-6 py-16 text-center text-sm text-slate-500">
// // //                 No requests
// // //               </div>
// // //             ) : (
// // //               <div className="overflow-x-auto">
// // //                 <table className="min-w-full text-sm">
// // //                   <thead>
// // //                     <tr className="border-b border-slate-100 bg-slate-50/80">
// // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
// // //                         Employee
// // //                       </th>
// // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
// // //                         Purpose
// // //                       </th>
// // //                       <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
// // //                         Status
// // //                       </th>
// // //                       <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
// // //                         Action
// // //                       </th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody className="divide-y divide-slate-50">
// // //                     {requests.map((r, idx) => (
// // //                       <tr key={r.request_id || idx}>
// // //                         <td className="px-5 py-3.5">
// // //                           {r.employee_name || r.employee_id}
// // //                         </td>
// // //                         <td className="px-5 py-3.5 text-slate-600">
// // //                           {r.purpose || r.reason || "—"}
// // //                         </td>
// // //                         <td className="px-5 py-3.5">
// // //                           <StatusBadge status={r.status} />
// // //                         </td>
// // //                         <td className="px-5 py-3.5 text-right">
// // //                           {String(r.status).toLowerCase() === "pending" && (
// // //                             <div className="flex justify-end gap-2">
// // //                               <button
// // //                                 type="button"
// // //                                 onClick={() =>
// // //                                   handleProcessRequest(r.request_id, "approve")
// // //                                 }
// // //                                 className="text-sm font-medium text-emerald-600 hover:underline"
// // //                               >
// // //                                 Approve
// // //                               </button>
// // //                               <button
// // //                                 type="button"
// // //                                 onClick={() =>
// // //                                   handleProcessRequest(r.request_id, "reject")
// // //                                 }
// // //                                 className="text-sm font-medium text-red-600 hover:underline"
// // //                               >
// // //                                 Reject
// // //                               </button>
// // //                             </div>
// // //                           )}
// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* ===== GENERATE ===== */}
// // //         {activeTab === "generate" && (
// // //           <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// // //             <h2 className="text-lg font-semibold text-slate-900">Generate Letter</h2>
// // //             <p className="mt-1 text-sm text-slate-500">
// // //               Employees load from your master data
// // //             </p>

// // //             <form onSubmit={handleGenerate} className="mt-5 space-y-4">
// // //               <div>
// // //                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                   Template *
// // //                 </label>
// // //                 <select
// // //                   required
// // //                   value={generateForm.template_id}
// // //                   onChange={(e) =>
// // //                     setGenerateForm((p) => ({ ...p, template_id: e.target.value }))
// // //                   }
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                 >
// // //                   <option value="">Select template</option>
// // //                   {templates.map((t) => (
// // //                     <option key={t.template_id} value={t.template_id}>
// // //                       {t.name} ({t.code})
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //               <div className="grid gap-4 sm:grid-cols-2">
// // //                 <div>
// // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                     Department
// // //                   </label>
// // //                   <select
// // //                     value={filterDept}
// // //                     onChange={(e) => setFilterDept(e.target.value)}
// // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                   >
// // //                     <option value="">All</option>
// // //                     {departments.map((d) => (
// // //                       <option
// // //                         key={d.department_id || d.id}
// // //                         value={d.department_id || d.id}
// // //                       >
// // //                         {d.department_name || d.name}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </div>
// // //                 <div>
// // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                     Designation
// // //                   </label>
// // //                   <select
// // //                     value={filterDesig}
// // //                     onChange={(e) => setFilterDesig(e.target.value)}
// // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                   >
// // //                     <option value="">All</option>
// // //                     {designations.map((d) => (
// // //                       <option
// // //                         key={d.designation_id || d.id}
// // //                         value={d.designation_id || d.id}
// // //                       >
// // //                         {d.job_title || d.designation_name || d.name}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <input
// // //                 value={empSearch}
// // //                 onChange={(e) => setEmpSearch(e.target.value)}
// // //                 placeholder="Search employee name / code..."
// // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //               />

// // //               <div>
// // //                 <div className="mb-1.5 flex items-center justify-between">
// // //                   <label className="text-sm font-medium text-slate-700">
// // //                     Employees * ({selectedEmployees.length})
// // //                   </label>
// // //                   {selectedEmployees.length > 0 && (
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => setSelectedEmployees([])}
// // //                       className="text-xs font-medium text-[#E42527] hover:underline"
// // //                     >
// // //                       Clear
// // //                     </button>
// // //                   )}
// // //                 </div>
// // //                 <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200">
// // //                   {filteredEmployees.length === 0 ? (
// // //                     <div className="px-4 py-8 text-center text-sm text-slate-500">
// // //                       No employees
// // //                     </div>
// // //                   ) : (
// // //                     filteredEmployees.map((emp) => {
// // //                       const id = emp.employee_id || emp.id;
// // //                       const checked = selectedEmployees.includes(id);
// // //                       return (
// // //                         <label
// // //                           key={id}
// // //                           className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-4 py-2.5 hover:bg-slate-50 last:border-0"
// // //                         >
// // //                           <input
// // //                             type="checkbox"
// // //                             checked={checked}
// // //                             onChange={() =>
// // //                               setSelectedEmployees((prev) =>
// // //                                 checked
// // //                                   ? prev.filter((x) => x !== id)
// // //                                   : [...prev, id]
// // //                               )
// // //                             }
// // //                             className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// // //                           />
// // //                           <div className="min-w-0">
// // //                             <p className="truncate text-sm font-medium text-slate-800">
// // //                               {empName(emp)}
// // //                             </p>
// // //                             <p className="truncate text-xs text-slate-400">
// // //                               {emp.employee_code || id}
// // //                             </p>
// // //                           </div>
// // //                         </label>
// // //                       );
// // //                     })
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               <div className="grid gap-4 sm:grid-cols-2">
// // //                 <div>
// // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                     Issue Date
// // //                   </label>
// // //                   <input
// // //                     type="date"
// // //                     value={generateForm.issue_date}
// // //                     onChange={(e) =>
// // //                       setGenerateForm((p) => ({ ...p, issue_date: e.target.value }))
// // //                     }
// // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                     Effective Date
// // //                   </label>
// // //                   <input
// // //                     type="date"
// // //                     value={generateForm.effective_date}
// // //                     onChange={(e) =>
// // //                       setGenerateForm((p) => ({
// // //                         ...p,
// // //                         effective_date: e.target.value,
// // //                       }))
// // //                     }
// // //                     className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
// // //                   Signatory
// // //                 </label>
// // //                 <select
// // //                   value={generateForm.signatory_id}
// // //                   onChange={(e) =>
// // //                     setGenerateForm((p) => ({ ...p, signatory_id: e.target.value }))
// // //                   }
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                 >
// // //                   <option value="">Optional</option>
// // //                   {signatories.map((s) => (
// // //                     <option key={s.signatory_id} value={s.signatory_id}>
// // //                       {s.name} — {s.designation}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //               <div className="flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
// // //                 <label className="flex items-center gap-2 text-sm text-slate-700">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={generateForm.publish_to_ess}
// // //                     onChange={(e) =>
// // //                       setGenerateForm((p) => ({
// // //                         ...p,
// // //                         publish_to_ess: e.target.checked,
// // //                       }))
// // //                     }
// // //                   />
// // //                   Publish to ESS
// // //                 </label>
// // //                 <label className="flex items-center gap-2 text-sm text-slate-700">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={generateForm.send_email}
// // //                     onChange={(e) =>
// // //                       setGenerateForm((p) => ({
// // //                         ...p,
// // //                         send_email: e.target.checked,
// // //                       }))
// // //                     }
// // //                   />
// // //                   Send Email
// // //                 </label>
// // //               </div>

// // //               <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => {
// // //                     setGenerateForm(EMPTY_GENERATE);
// // //                     setSelectedEmployees([]);
// // //                     setFilterDept("");
// // //                     setFilterDesig("");
// // //                     setEmpSearch("");
// // //                   }}
// // //                   className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
// // //                 >
// // //                   Reset
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   disabled={loading || selectedEmployees.length === 0}
// // //                   className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // //                 >
// // //                   {loading
// // //                     ? "Generating..."
// // //                     : `Generate (${selectedEmployees.length})`}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         )}

// // //         {/* ===== CREATE TEMPLATE ===== */}
// // //         {activeTab === "create-template" && (
// // //           <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// // //             <h2 className="text-lg font-semibold text-slate-900">Create Template</h2>
// // //             <p className="mt-1 text-sm text-slate-500">
// // //               Use {"{{employee.full_name}}"}, {"{{company.name}}"} etc.
// // //             </p>
// // //             <form onSubmit={handleCreateTemplate} className="mt-5 space-y-4">
// // //               <div className="grid gap-4 sm:grid-cols-2">
// // //                 <select
// // //                   required
// // //                   value={templateForm.category_id}
// // //                   onChange={(e) =>
// // //                     setTemplateForm((p) => ({ ...p, category_id: e.target.value }))
// // //                   }
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                 >
// // //                   <option value="">Category *</option>
// // //                   {categories.map((c) => (
// // //                     <option key={c.category_id} value={c.category_id}>
// // //                       {c.name}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //                 <input
// // //                   required
// // //                   value={templateForm.code}
// // //                   onChange={(e) =>
// // //                     setTemplateForm((p) => ({
// // //                       ...p,
// // //                       code: e.target.value.toUpperCase(),
// // //                     }))
// // //                   }
// // //                   placeholder="Code *"
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                 />
// // //               </div>
// // //               <input
// // //                 required
// // //                 value={templateForm.name}
// // //                 onChange={(e) =>
// // //                   setTemplateForm((p) => ({ ...p, name: e.target.value }))
// // //                 }
// // //                 placeholder="Template name *"
// // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //               />
// // //               <textarea
// // //                 rows={8}
// // //                 value={templateForm.content_html}
// // //                 onChange={(e) =>
// // //                   setTemplateForm((p) => ({ ...p, content_html: e.target.value }))
// // //                 }
// // //                 placeholder="Letter HTML content..."
// // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //               />
// // //               <div className="flex flex-wrap gap-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
// // //                 {[
// // //                   ["requires_approval", "Approval"],
// // //                   ["requires_esign", "E-Sign"],
// // //                   ["allow_employee_request", "Self Request"],
// // //                   ["password_protect_pdf", "Password PDF"],
// // //                 ].map(([k, label]) => (
// // //                   <label key={k} className="flex items-center gap-2 text-sm text-slate-700">
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={templateForm[k]}
// // //                       onChange={(e) =>
// // //                         setTemplateForm((p) => ({ ...p, [k]: e.target.checked }))
// // //                       }
// // //                     />
// // //                     {label}
// // //                   </label>
// // //                 ))}
// // //               </div>
// // //               <div className="flex justify-end">
// // //                 <button
// // //                   type="submit"
// // //                   disabled={loading}
// // //                   className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // //                 >
// // //                   {loading ? "Saving..." : "Create Template"}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         )}

// // //         {/* ===== CREATE SIGNATORY ===== */}
// // //         {activeTab === "create-signatory" && (
// // //           <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// // //             <h2 className="text-lg font-semibold text-slate-900">Add Signatory</h2>
// // //             <form onSubmit={handleCreateSignatory} className="mt-5 space-y-4">
// // //               <input
// // //                 required
// // //                 value={signatoryForm.name}
// // //                 onChange={(e) =>
// // //                   setSignatoryForm((p) => ({ ...p, name: e.target.value }))
// // //                 }
// // //                 placeholder="Name *"
// // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //               />
// // //               <input
// // //                 required
// // //                 value={signatoryForm.designation}
// // //                 onChange={(e) =>
// // //                   setSignatoryForm((p) => ({ ...p, designation: e.target.value }))
// // //                 }
// // //                 placeholder="Designation *"
// // //                 className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //               />
// // //               <div className="grid gap-4 sm:grid-cols-2">
// // //                 <input
// // //                   value={signatoryForm.department}
// // //                   onChange={(e) =>
// // //                     setSignatoryForm((p) => ({ ...p, department: e.target.value }))
// // //                   }
// // //                   placeholder="Department"
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                 />
// // //                 <input
// // //                   type="email"
// // //                   value={signatoryForm.email}
// // //                   onChange={(e) =>
// // //                     setSignatoryForm((p) => ({ ...p, email: e.target.value }))
// // //                   }
// // //                   placeholder="Email"
// // //                   className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
// // //                 />
// // //               </div>
// // //               <label className="flex items-center gap-2 text-sm text-slate-700">
// // //                 <input
// // //                   type="checkbox"
// // //                   checked={signatoryForm.is_default}
// // //                   onChange={(e) =>
// // //                     setSignatoryForm((p) => ({ ...p, is_default: e.target.checked }))
// // //                   }
// // //                 />
// // //                 Default signatory
// // //               </label>
// // //               <button
// // //                 type="submit"
// // //                 disabled={loading}
// // //                 className="w-full rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// // //               >
// // //                 {loading ? "Saving..." : "Add Signatory"}
// // //               </button>
// // //             </form>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Letter modal */}
// // //       {selectedLetter && (
// // //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]">
// // //           <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // //               <div>
// // //                 <p className="text-xs uppercase tracking-wide text-slate-400">Letter</p>
// // //                 <h3 className="text-lg font-semibold text-slate-900">
// // //                   {selectedLetter.letter_number || "—"}
// // //                 </h3>
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setSelectedLetter(null)}
// // //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>
// // //             <div className="grid gap-3 p-5 sm:grid-cols-2">
// // //               {[
// // //                 ["Status", selectedLetter.status],
// // //                 ["Employee", selectedLetter.employee_name || selectedLetter.employee_id],
// // //                 ["Issue Date", formatDate(selectedLetter.issue_date)],
// // //                 ["Effective", formatDate(selectedLetter.effective_date)],
// // //               ].map(([l, v]) => (
// // //                 <div key={l} className="rounded-xl bg-slate-50 px-3 py-2.5">
// // //                   <p className="text-xs text-slate-400">{l}</p>
// // //                   <p className="mt-1 text-sm font-medium capitalize text-slate-800">
// // //                     {v ?? "—"}
// // //                   </p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
// // //               <button
// // //                 type="button"
// // //                 onClick={() => handleDownload(selectedLetter.letter_id)}
// // //                 className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
// // //               >
// // //                 Download
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setSelectedLetter(null)}
// // //                 className="rounded-xl bg-[#E42527] px-4 py-2 text-sm font-medium text-white"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Template modal */}
// // //       {selectedTemplate && (
// // //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]">
// // //           <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // //               <h3 className="text-lg font-semibold text-slate-900">
// // //                 {selectedTemplate.name}
// // //               </h3>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setSelectedTemplate(null)}
// // //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>
// // //             <div className="grid gap-3 p-5 sm:grid-cols-2">
// // //               {[
// // //                 ["Code", selectedTemplate.code],
// // //                 ["Version", selectedTemplate.version || 1],
// // //                 ["Approval", selectedTemplate.requires_approval ? "Yes" : "No"],
// // //                 ["E-Sign", selectedTemplate.requires_esign ? "Yes" : "No"],
// // //               ].map(([l, v]) => (
// // //                 <div key={l} className="rounded-xl bg-slate-50 px-3 py-2.5">
// // //                   <p className="text-xs text-slate-400">{l}</p>
// // //                   <p className="mt-1 text-sm font-medium text-slate-800">{v}</p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //             <div className="flex justify-end border-t border-slate-100 px-5 py-4">
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setSelectedTemplate(null)}
// // //                 className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import { useCallback, useEffect, useMemo, useState } from "react";
// // import { api } from "@/lib/api";

// // /* ===================== CONSTANTS ===================== */
// // const STATUS_COLOR = {
// //   draft: "bg-slate-100 text-slate-600",
// //   pending_approval: "bg-amber-50 text-amber-700",
// //   approved: "bg-blue-50 text-blue-700",
// //   sent: "bg-indigo-50 text-indigo-700",
// //   published: "bg-emerald-50 text-emerald-700",
// //   viewed: "bg-cyan-50 text-cyan-700",
// //   accepted: "bg-green-50 text-green-700",
// //   declined: "bg-red-50 text-red-700",
// //   signed: "bg-violet-50 text-violet-700",
// //   expired: "bg-orange-50 text-orange-700",
// //   cancelled: "bg-rose-50 text-rose-700",
// //   pending: "bg-amber-50 text-amber-700",
// //   generated: "bg-emerald-50 text-emerald-700",
// //   rejected: "bg-red-50 text-red-700",
// // };

// // const EMPTY_CATEGORY = {
// //   code: "",
// //   name: "",
// //   description: "",
// //   number_prefix: "",
// //   display_order: 100,
// //   is_active: true,
// // };

// // const EMPTY_TEMPLATE = {
// //   category_id: "",
// //   name: "",
// //   code: "",
// //   description: "",
// //   content_html: "",
// //   requires_approval: false,
// //   requires_esign: false,
// //   allow_employee_request: false,
// //   password_protect_pdf: false,
// //   is_active: true,
// // };

// // const EMPTY_GENERATE = {
// //   template_id: "",
// //   issue_date: "",
// //   effective_date: "",
// //   signatory_id: "",
// //   publish_to_ess: true,
// //   send_email: false,
// // };

// // const EMPTY_SIGNATORY = {
// //   name: "",
// //   designation: "",
// //   department: "",
// //   email: "",
// //   is_default: false,
// //   is_active: true,
// // };

// // /* ===================== HELPERS ===================== */
// // function getErrorMessage(err) {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // }

// // function pickList(res) {
// //   const body = res?.data ?? {};
// //   const list =
// //     body?.data ??
// //     body?.items ??
// //     body?.results ??
// //     body?.employees ??
// //     body?.departments ??
// //     body?.designations ??
// //     body?.templates ??
// //     body?.categories ??
// //     body?.letters ??
// //     body?.requests ??
// //     body?.signatories ??
// //     [];
// //   return Array.isArray(list) ? list : Array.isArray(body) ? body : [];
// // }

// // function formatDate(value) {
// //   if (!value) return "—";
// //   try {
// //     return new Date(value).toLocaleDateString("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     });
// //   } catch {
// //     return String(value);
// //   }
// // }

// // function empName(emp) {
// //   if (!emp) return "—";
// //   if (emp.full_name) return emp.full_name;
// //   const n = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
// //   return n || emp.employee_code || "—";
// // }

// // function StatusBadge({ status }) {
// //   const key = String(status || "").toLowerCase();
// //   const color = STATUS_COLOR[key] || "bg-slate-100 text-slate-600";
// //   return (
// //     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${color}`}>
// //       {String(status || "—").replace(/_/g, " ")}
// //     </span>
// //   );
// // }

// // /* ===================== PAGE ===================== */
// // export default function HRLettersPage() {
// //   const [activeTab, setActiveTab] = useState("letters");

// //   const [employees, setEmployees] = useState([]);
// //   const [departments, setDepartments] = useState([]);
// //   const [designations, setDesignations] = useState([]);

// //   const [letters, setLetters] = useState([]);
// //   const [templates, setTemplates] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [requests, setRequests] = useState([]);
// //   const [signatories, setSignatories] = useState([]);

// //   const [listLoading, setListLoading] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const [selectedLetter, setSelectedLetter] = useState(null);
// //   const [selectedTemplate, setSelectedTemplate] = useState(null);

// //   const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
// //   const [templateForm, setTemplateForm] = useState(EMPTY_TEMPLATE);
// //   const [generateForm, setGenerateForm] = useState(EMPTY_GENERATE);
// //   const [signatoryForm, setSignatoryForm] = useState(EMPTY_SIGNATORY);

// //   const [selectedEmployees, setSelectedEmployees] = useState([]);
// //   const [filterDept, setFilterDept] = useState("");
// //   const [filterDesig, setFilterDesig] = useState("");
// //   const [empSearch, setEmpSearch] = useState("");
// //   const [letterSearch, setLetterSearch] = useState("");

// //   /* ===================== FETCH ===================== */
// //   const fetchEmployees = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/employees", {
// //         params: { page: 1, page_size: 500 },
// //       });
// //       setEmployees(pickList(res));
// //     } catch {
// //       setEmployees([]);
// //     }
// //   }, []);

// //   const fetchDepartments = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/departments", {
// //         params: { page: 1, page_size: 200 },
// //       });
// //       setDepartments(pickList(res));
// //     } catch {
// //       setDepartments([]);
// //     }
// //   }, []);

// //   const fetchDesignations = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/designations", {
// //         params: { page: 1, page_size: 200 },
// //       });
// //       setDesignations(pickList(res));
// //     } catch {
// //       setDesignations([]);
// //     }
// //   }, []);

// //   const fetchLetters = useCallback(async () => {
// //     setListLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get("/api/v1/get/generated/letters", {
// //         params: { page: 1, page_size: 100 },
// //       });
// //       setLetters(pickList(res));
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //       setLetters([]);
// //     } finally {
// //       setListLoading(false);
// //     }
// //   }, []);

// //   const fetchTemplates = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/letter/templates", {
// //         params: { is_active: true, page: 1, page_size: 100 },
// //       });
// //       setTemplates(pickList(res));
// //     } catch {
// //       setTemplates([]);
// //     }
// //   }, []);

// //   const fetchCategories = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/letter/categories", {
// //         params: { is_active: true, page: 1, page_size: 100 },
// //       });
// //       setCategories(pickList(res));
// //     } catch {
// //       setCategories([]);
// //     }
// //   }, []);

// //   const fetchRequests = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/letter/requests", {
// //         params: { page: 1, page_size: 50 },
// //       });
// //       setRequests(pickList(res));
// //     } catch {
// //       setRequests([]);
// //     }
// //   }, []);

// //   const fetchSignatories = useCallback(async () => {
// //     try {
// //       const res = await api.get("/api/v1/get/letter/signatories", {
// //         params: { is_active: true, page: 1, page_size: 100 },
// //       });
// //       setSignatories(pickList(res));
// //     } catch {
// //       setSignatories([]);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchEmployees();
// //     fetchDepartments();
// //     fetchDesignations();
// //     fetchLetters();
// //     fetchTemplates();
// //     fetchCategories();
// //     fetchRequests();
// //     fetchSignatories();
// //   }, [
// //     fetchEmployees,
// //     fetchDepartments,
// //     fetchDesignations,
// //     fetchLetters,
// //     fetchTemplates,
// //     fetchCategories,
// //     fetchRequests,
// //     fetchSignatories,
// //   ]);

// //   /* ===================== DERIVED ===================== */
// //   const filteredEmployees = useMemo(() => {
// //     return employees.filter((emp) => {
// //       const deptId = emp.department_id || emp.department?.department_id || "";
// //       const desigId = emp.designation_id || emp.designation?.designation_id || "";
// //       const name = empName(emp).toLowerCase();
// //       const code = String(emp.employee_code || "").toLowerCase();
// //       const deptOk = !filterDept || deptId === filterDept;
// //       const desigOk = !filterDesig || desigId === filterDesig;
// //       const searchOk =
// //         !empSearch ||
// //         name.includes(empSearch.toLowerCase()) ||
// //         code.includes(empSearch.toLowerCase());
// //       return deptOk && desigOk && searchOk;
// //     });
// //   }, [employees, filterDept, filterDesig, empSearch]);

// //   const filteredLetters = useMemo(() => {
// //     if (!letterSearch.trim()) return letters;
// //     const q = letterSearch.toLowerCase();
// //     return letters.filter(
// //       (l) =>
// //         String(l.letter_number || "").toLowerCase().includes(q) ||
// //         String(l.employee_name || "").toLowerCase().includes(q) ||
// //         String(l.status || "").toLowerCase().includes(q)
// //     );
// //   }, [letters, letterSearch]);

// //   const stats = useMemo(
// //     () => ({
// //       letters: letters.length,
// //       templates: templates.length,
// //       categories: categories.length,
// //       pending: requests.filter((r) => String(r.status).toLowerCase() === "pending").length,
// //       signatories: signatories.length,
// //     }),
// //     [letters, templates, categories, requests, signatories]
// //   );

// //   /* ===================== HANDLERS ===================== */
// //   async function handleCreateCategory(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.post("/api/v1/create/letter/category", {
// //         ...categoryForm,
// //         code: categoryForm.code.toUpperCase(),
// //         number_prefix: categoryForm.number_prefix || categoryForm.code.toUpperCase().slice(0, 3),
// //       });
// //       setSuccess("Category created successfully");
// //       setCategoryForm(EMPTY_CATEGORY);
// //       await fetchCategories();
// //       setActiveTab("categories");
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function handleCreateTemplate(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.post("/api/v1/create/letter/template", {
// //         ...templateForm,
// //         code: templateForm.code.toUpperCase(),
// //       });
// //       setSuccess("Template created successfully");
// //       setTemplateForm(EMPTY_TEMPLATE);
// //       await fetchTemplates();
// //       setActiveTab("templates");
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function handleCreateSignatory(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.post("/api/v1/create/letter/signatory", signatoryForm);
// //       setSuccess("Signatory added successfully");
// //       setSignatoryForm(EMPTY_SIGNATORY);
// //       await fetchSignatories();
// //       setActiveTab("signatories");
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function handleGenerate(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       if (!generateForm.template_id) {
// //         setError("Please select a template");
// //         setLoading(false);
// //         return;
// //       }
// //       if (selectedEmployees.length === 0) {
// //         setError("Please select at least one employee");
// //         setLoading(false);
// //         return;
// //       }
// //       const res = await api.post("/api/v1/generate/letter", {
// //         template_id: generateForm.template_id,
// //         employee_ids: selectedEmployees,
// //         issue_date: generateForm.issue_date || null,
// //         effective_date: generateForm.effective_date || null,
// //         signatory_id: generateForm.signatory_id || null,
// //         publish_to_ess: generateForm.publish_to_ess,
// //         send_email: generateForm.send_email,
// //       });
// //       setSuccess(res?.data?.message || "Letter(s) generated successfully");
// //       setGenerateForm(EMPTY_GENERATE);
// //       setSelectedEmployees([]);
// //       setFilterDept("");
// //       setFilterDesig("");
// //       setEmpSearch("");
// //       await fetchLetters();
// //       setActiveTab("letters");
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function handlePublish(letterId) {
// //     try {
// //       await api.post(`/api/v1/publish/letter/${letterId}`);
// //       setSuccess("Published to ESS");
// //       await fetchLetters();
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     }
// //   }

// //   async function handleSend(letterId) {
// //     try {
// //       await api.post(`/api/v1/send/letter/${letterId}`);
// //       setSuccess("Letter sent successfully");
// //       await fetchLetters();
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     }
// //   }

// //   async function handleDownload(letterId) {
// //     try {
// //       setError("");
// //       const res = await api.get(`/api/v1/download/letter/${letterId}`, {
// //         params: { format: "pdf" },
// //       });
// //       const data = res?.data || {};

// //       if (data.download_url) {
// //         window.open(data.download_url, "_blank");
// //         return;
// //       }

// //       if (data.content_html) {
// //         const w = window.open("", "_blank");
// //         if (!w) {
// //           setError("Popup blocked. Please allow popups for this site.");
// //           return;
// //         }

// //         w.document.write(`<!DOCTYPE html>
// // <html>
// // <head>
// //   <meta charset="utf-8" />
// //   <title>${data.letter_number || "Letter"}</title>
// //   <style>
// //     * { box-sizing: border-box; margin: 0; padding: 0; }
// //     body {
// //       font-family: Georgia, 'Times New Roman', serif;
// //       font-size: 14.5px;
// //       line-height: 1.7;
// //       color: #1a1a1a;
// //       background: #fff;
// //       padding: 48px 56px;
// //       max-width: 780px;
// //       margin: 0 auto;
// //     }
// //     @media print {
// //       body { padding: 24px 32px; }
// //       @page { margin: 1.4cm; }
// //     }
// //   </style>
// // </head>
// // <body>
// //   ${data.content_html}
// //   <script>
// //     window.onload = function () {
// //       setTimeout(function () { window.print(); }, 300);
// //     };
// //   </script>
// // </body>
// // </html>`);
// //         w.document.close();
// //         return;
// //       }

// //       setError(data.message || "Download not available. Please regenerate the letter.");
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     }
// //   }

// //   async function handleProcessRequest(requestId, action) {
// //     try {
// //       await api.post(`/api/v1/process/letter/request/${requestId}`, { action });
// //       setSuccess(`Request ${action}d successfully`);
// //       await fetchRequests();
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     }
// //   }

// //   const tabs = [
// //     { id: "letters", label: "Letters", count: stats.letters },
// //     { id: "templates", label: "Templates", count: stats.templates },
// //     { id: "categories", label: "Categories", count: stats.categories },
// //     { id: "signatories", label: "Signatories", count: stats.signatories },
// //     { id: "requests", label: "Requests", count: stats.pending },
// //     { id: "generate", label: "Generate" },
// //     { id: "create-template", label: "+ Template" },
// //     { id: "create-signatory", label: "+ Signatory" },
// //   ];

// //   /* ===================== UI ===================== */
// //   return (
// //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f4f6f8]">
// //       {/* Header */}
// //       <div className="border-b border-slate-200/80 bg-white">
// //         <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
// //           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //             <div>
// //               <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E42527]">
// //                 HR Operations
// //               </p>
// //               <h1 className="mt-1 text-[22px] font-semibold text-slate-900 tracking-tight">
// //                 HR Letters
// //               </h1>
// //               <p className="mt-0.5 text-[13px] text-slate-500">
// //                 Generate, publish and manage employee letters
// //               </p>
// //             </div>
// //             <div className="flex flex-wrap gap-2.5">
// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   setActiveTab("generate");
// //                   setError("");
// //                   setSuccess("");
// //                 }}
// //                 className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition"
// //               >
// //                 Generate Letter
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   setActiveTab("create-template");
// //                   setError("");
// //                   setSuccess("");
// //                 }}
// //                 className="h-9 rounded-lg bg-[#E42527] px-4 text-[13px] font-medium text-white shadow-sm hover:bg-[#c91f21] transition"
// //               >
// //                 + Template
// //               </button>
// //             </div>
// //           </div>

// //           {/* Stats */}
// //           <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
// //             {[
// //               { label: "Letters", value: stats.letters },
// //               { label: "Templates", value: stats.templates },
// //               { label: "Categories", value: stats.categories },
// //               { label: "Pending", value: stats.pending },
// //               { label: "Signatories", value: stats.signatories },
// //             ].map((s) => (
// //               <div
// //                 key={s.label}
// //                 className="rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
// //               >
// //                 <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
// //                 <p className="mt-1 text-[22px] font-semibold text-slate-800">{s.value}</p>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Tabs */}
// //           <div className="mt-5 flex flex-wrap gap-0.5 border-b border-slate-200">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab.id}
// //                 type="button"
// //                 onClick={() => {
// //                   setActiveTab(tab.id);
// //                   setError("");
// //                   setSuccess("");
// //                 }}
// //                 className={`relative px-3.5 py-2.5 text-[13px] font-medium transition ${
// //                   activeTab === tab.id
// //                     ? "text-[#E42527]"
// //                     : "text-slate-500 hover:text-slate-800"
// //                 }`}
// //               >
// //                 {tab.label}
// //                 {typeof tab.count === "number" && (
// //                   <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-medium text-slate-600">
// //                     {tab.count}
// //                   </span>
// //                 )}
// //                 {activeTab === tab.id && (
// //                   <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#E42527]" />
// //                 )}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
// //         {error && (
// //           <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">
// //             {error}
// //           </div>
// //         )}
// //         {success && (
// //           <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
// //             {success}
// //           </div>
// //         )}

// //         {/* ===== LETTERS ===== */}
// //         {activeTab === "letters" && (
// //           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
// //             <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
// //               <div>
// //                 <h2 className="text-[14px] font-semibold text-slate-800">Generated Letters</h2>
// //                 <p className="text-[12px] text-slate-500">{filteredLetters.length} shown</p>
// //               </div>
// //               <div className="flex gap-2">
// //                 <input
// //                   value={letterSearch}
// //                   onChange={(e) => setLetterSearch(e.target.value)}
// //                   placeholder="Search letter or employee..."
// //                   className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10 sm:w-56"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={fetchLetters}
// //                   className="h-9 rounded-lg border border-slate-200 px-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
// //                 >
// //                   Refresh
// //                 </button>
// //               </div>
// //             </div>

// //             {listLoading ? (
// //               <div className="py-20 text-center text-[13px] text-slate-500">Loading letters...</div>
// //             ) : filteredLetters.length === 0 ? (
// //               <div className="px-6 py-20 text-center">
// //                 <p className="text-[14px] font-medium text-slate-700">No letters found</p>
// //                 <p className="mt-1 text-[13px] text-slate-500">Generate your first letter to get started</p>
// //                 <button
// //                   type="button"
// //                   onClick={() => setActiveTab("generate")}
// //                   className="mt-5 h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] transition"
// //                 >
// //                   Generate Letter
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full text-[13px]">
// //                   <thead>
// //                     <tr className="border-b border-slate-100 bg-[#fafbfc]">
// //                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Letter No.
// //                       </th>
// //                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Employee
// //                       </th>
// //                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Status
// //                       </th>
// //                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Issue Date
// //                       </th>
// //                       <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-slate-50">
// //                     {filteredLetters.map((letter, idx) => (
// //                       <tr key={letter.letter_id || idx} className="hover:bg-[#f8fafc] transition">
// //                         <td className="px-5 py-3.5">
// //                           <div className="font-medium text-slate-800">
// //                             {letter.letter_number || "—"}
// //                           </div>
// //                           <div className="text-[11px] text-slate-400 mt-0.5">
// //                             {letter.template_name || ""}
// //                           </div>
// //                         </td>
// //                         <td className="px-5 py-3.5 text-slate-700">
// //                           {letter.employee_name || "—"}
// //                         </td>
// //                         <td className="px-5 py-3.5">
// //                           <StatusBadge status={letter.status} />
// //                         </td>
// //                         <td className="px-5 py-3.5 text-slate-600">
// //                           {formatDate(letter.issue_date)}
// //                         </td>
// //                         <td className="px-5 py-3.5 text-right">
// //                           <div className="flex flex-wrap items-center justify-end gap-1">
// //                             <button
// //                               type="button"
// //                               onClick={() => setSelectedLetter(letter)}
// //                               className="rounded-md px-2.5 py-1 text-[12px] font-medium text-[#E42527] hover:bg-red-50 transition"
// //                             >
// //                               View
// //                             </button>
// //                             <button
// //                               type="button"
// //                               onClick={() => handleDownload(letter.letter_id)}
// //                               className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
// //                             >
// //                               Download
// //                             </button>
// //                             {String(letter.status).toLowerCase() !== "published" && (
// //                               <button
// //                                 type="button"
// //                                 onClick={() => handlePublish(letter.letter_id)}
// //                                 className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
// //                               >
// //                                 Publish
// //                               </button>
// //                             )}
// //                             <button
// //                               type="button"
// //                               onClick={() => handleSend(letter.letter_id)}
// //                               className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
// //                             >
// //                               Send
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* ===== TEMPLATES ===== */}
// //         {activeTab === "templates" && (
// //           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-[14px] font-semibold text-slate-800">Templates</h2>
// //               <button
// //                 type="button"
// //                 onClick={() => setActiveTab("create-template")}
// //                 className="h-8 rounded-lg bg-[#E42527] px-3.5 text-[12px] font-medium text-white hover:bg-[#c91f21] transition"
// //               >
// //                 + New
// //               </button>
// //             </div>
// //             {templates.length === 0 ? (
// //               <div className="px-6 py-20 text-center text-[13px] text-slate-500">
// //                 No templates yet
// //               </div>
// //             ) : (
// //               <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
// //                 {templates.map((t) => (
// //                   <button
// //                     key={t.template_id}
// //                     type="button"
// //                     onClick={() => setSelectedTemplate(t)}
// //                     className="rounded-xl border border-slate-200 bg-[#fafbfc] p-4 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
// //                   >
// //                     <div className="flex items-start justify-between gap-2">
// //                       <div>
// //                         <p className="text-[14px] font-semibold text-slate-900">{t.name}</p>
// //                         <p className="mt-0.5 text-[12px] text-slate-500">{t.code}</p>
// //                       </div>
// //                       <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
// //                         v{t.version || 1}
// //                       </span>
// //                     </div>
// //                     <div className="mt-3 flex flex-wrap gap-1.5">
// //                       {t.requires_approval && (
// //                         <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
// //                           Approval
// //                         </span>
// //                       )}
// //                       {t.requires_esign && (
// //                         <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">
// //                           E-Sign
// //                         </span>
// //                       )}
// //                       {t.allow_employee_request && (
// //                         <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
// //                           Self Request
// //                         </span>
// //                       )}
// //                     </div>
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* ===== CATEGORIES ===== */}
// //         {activeTab === "categories" && (
// //           <div className="grid gap-5 lg:grid-cols-5">
// //             <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:col-span-3">
// //               <div className="border-b border-slate-100 px-5 py-4">
// //                 <h2 className="text-[14px] font-semibold text-slate-800">Categories</h2>
// //               </div>
// //               <div className="divide-y divide-slate-50">
// //                 {categories.length === 0 ? (
// //                   <div className="px-5 py-12 text-center text-[13px] text-slate-500">
// //                     No categories
// //                   </div>
// //                 ) : (
// //                   categories.map((c) => (
// //                     <div
// //                       key={c.category_id}
// //                       className="flex items-center justify-between px-5 py-3.5"
// //                     >
// //                       <div>
// //                         <div className="text-[13px] font-medium text-slate-800">{c.name}</div>
// //                         <div className="text-[12px] text-slate-400 mt-0.5">
// //                           {c.code} · Prefix {c.number_prefix || "—"}
// //                         </div>
// //                       </div>
// //                       <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
// //                         Active
// //                       </span>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>
// //             </div>

// //             <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:col-span-2">
// //               <h3 className="text-[14px] font-semibold text-slate-800">Add Category</h3>
// //               <form onSubmit={handleCreateCategory} className="mt-4 space-y-3">
// //                 <input
// //                   required
// //                   value={categoryForm.code}
// //                   onChange={(e) =>
// //                     setCategoryForm((p) => ({
// //                       ...p,
// //                       code: e.target.value.toUpperCase(),
// //                     }))
// //                   }
// //                   placeholder="Code e.g. EXPERIENCE"
// //                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 />
// //                 <input
// //                   required
// //                   value={categoryForm.name}
// //                   onChange={(e) =>
// //                     setCategoryForm((p) => ({ ...p, name: e.target.value }))
// //                   }
// //                   placeholder="Name"
// //                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 />
// //                 <input
// //                   value={categoryForm.number_prefix}
// //                   onChange={(e) =>
// //                     setCategoryForm((p) => ({
// //                       ...p,
// //                       number_prefix: e.target.value.toUpperCase(),
// //                     }))
// //                   }
// //                   placeholder="Prefix e.g. EXP"
// //                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 />
// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="h-9 w-full rounded-lg bg-[#E42527] text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
// //                 >
// //                   {loading ? "Saving..." : "Create Category"}
// //                 </button>
// //               </form>
// //             </div>
// //           </div>
// //         )}

// //         {/* ===== SIGNATORIES ===== */}
// //         {activeTab === "signatories" && (
// //           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-[14px] font-semibold text-slate-800">Signatories</h2>
// //               <button
// //                 type="button"
// //                 onClick={() => setActiveTab("create-signatory")}
// //                 className="h-8 rounded-lg bg-[#E42527] px-3.5 text-[12px] font-medium text-white hover:bg-[#c91f21] transition"
// //               >
// //                 + Add
// //               </button>
// //             </div>
// //             {signatories.length === 0 ? (
// //               <div className="px-6 py-20 text-center text-[13px] text-slate-500">
// //                 No signatories
// //               </div>
// //             ) : (
// //               <div className="divide-y divide-slate-50">
// //                 {signatories.map((s) => (
// //                   <div
// //                     key={s.signatory_id}
// //                     className="flex items-center justify-between px-5 py-3.5"
// //                   >
// //                     <div>
// //                       <div className="text-[13px] font-medium text-slate-800">{s.name}</div>
// //                       <div className="text-[12px] text-slate-400 mt-0.5">
// //                         {s.designation}
// //                         {s.department ? ` · ${s.department}` : ""}
// //                       </div>
// //                     </div>
// //                     {s.is_default && (
// //                       <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
// //                         Default
// //                       </span>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* ===== REQUESTS ===== */}
// //         {activeTab === "requests" && (
// //           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
// //             <div className="border-b border-slate-100 px-5 py-4">
// //               <h2 className="text-[14px] font-semibold text-slate-800">Employee Requests</h2>
// //             </div>
// //             {requests.length === 0 ? (
// //               <div className="px-6 py-20 text-center text-[13px] text-slate-500">
// //                 No requests
// //               </div>
// //             ) : (
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full text-[13px]">
// //                   <thead>
// //                     <tr className="border-b border-slate-100 bg-[#fafbfc]">
// //                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Employee
// //                       </th>
// //                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Purpose
// //                       </th>
// //                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Status
// //                       </th>
// //                       <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                         Action
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-slate-50">
// //                     {requests.map((r, idx) => (
// //                       <tr key={r.request_id || idx} className="hover:bg-[#f8fafc]">
// //                         <td className="px-5 py-3.5">
// //                           {r.employee_name || "—"}
// //                         </td>
// //                         <td className="px-5 py-3.5 text-slate-600">
// //                           {r.purpose || r.reason || "—"}
// //                         </td>
// //                         <td className="px-5 py-3.5">
// //                           <StatusBadge status={r.status} />
// //                         </td>
// //                         <td className="px-5 py-3.5 text-right">
// //                           {String(r.status).toLowerCase() === "pending" && (
// //                             <div className="flex justify-end gap-3">
// //                               <button
// //                                 type="button"
// //                                 onClick={() => handleProcessRequest(r.request_id, "approve")}
// //                                 className="text-[12px] font-medium text-emerald-600 hover:underline"
// //                               >
// //                                 Approve
// //                               </button>
// //                               <button
// //                                 type="button"
// //                                 onClick={() => handleProcessRequest(r.request_id, "reject")}
// //                                 className="text-[12px] font-medium text-red-600 hover:underline"
// //                               >
// //                                 Reject
// //                               </button>
// //                             </div>
// //                           )}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* ===== GENERATE ===== */}
// //         {activeTab === "generate" && (
// //           <div className="mx-auto max-w-2xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
// //             <h2 className="text-[17px] font-semibold text-slate-900">Generate Letter</h2>
// //             <p className="mt-1 text-[13px] text-slate-500">
// //               Select template and employees to generate letters
// //             </p>

// //             <form onSubmit={handleGenerate} className="mt-6 space-y-5">
// //               <div>
// //                 <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
// //                   Template *
// //                 </label>
// //                 <select
// //                   required
// //                   value={generateForm.template_id}
// //                   onChange={(e) =>
// //                     setGenerateForm((p) => ({ ...p, template_id: e.target.value }))
// //                   }
// //                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 >
// //                   <option value="">Select template</option>
// //                   {templates.map((t) => (
// //                     <option key={t.template_id} value={t.template_id}>
// //                       {t.name} ({t.code})
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="grid gap-4 sm:grid-cols-2">
// //                 <div>
// //                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
// //                     Department
// //                   </label>
// //                   <select
// //                     value={filterDept}
// //                     onChange={(e) => setFilterDept(e.target.value)}
// //                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                   >
// //                     <option value="">All</option>
// //                     {departments.map((d) => (
// //                       <option key={d.department_id || d.id} value={d.department_id || d.id}>
// //                         {d.department_name || d.name}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
// //                     Designation
// //                   </label>
// //                   <select
// //                     value={filterDesig}
// //                     onChange={(e) => setFilterDesig(e.target.value)}
// //                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                   >
// //                     <option value="">All</option>
// //                     {designations.map((d) => (
// //                       <option key={d.designation_id || d.id} value={d.designation_id || d.id}>
// //                         {d.job_title || d.designation_name || d.name}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>

// //               <input
// //                 value={empSearch}
// //                 onChange={(e) => setEmpSearch(e.target.value)}
// //                 placeholder="Search employee name or code..."
// //                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //               />

// //               <div>
// //                 <div className="mb-1.5 flex items-center justify-between">
// //                   <label className="text-[13px] font-medium text-slate-700">
// //                     Employees * ({selectedEmployees.length})
// //                   </label>
// //                   {selectedEmployees.length > 0 && (
// //                     <button
// //                       type="button"
// //                       onClick={() => setSelectedEmployees([])}
// //                       className="text-[12px] font-medium text-[#E42527] hover:underline"
// //                     >
// //                       Clear
// //                     </button>
// //                   )}
// //                 </div>
// //                 <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200">
// //                   {filteredEmployees.length === 0 ? (
// //                     <div className="px-4 py-8 text-center text-[13px] text-slate-500">
// //                       No employees found
// //                     </div>
// //                   ) : (
// //                     filteredEmployees.map((emp) => {
// //                       const id = emp.employee_id || emp.id;
// //                       const checked = selectedEmployees.includes(id);
// //                       return (
// //                         <label
// //                           key={id}
// //                           className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-4 py-2.5 hover:bg-slate-50 last:border-0"
// //                         >
// //                           <input
// //                             type="checkbox"
// //                             checked={checked}
// //                             onChange={() =>
// //                               setSelectedEmployees((prev) =>
// //                                 checked ? prev.filter((x) => x !== id) : [...prev, id]
// //                               )
// //                             }
// //                             className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
// //                           />
// //                           <div className="min-w-0">
// //                             <p className="truncate text-[13px] font-medium text-slate-800">
// //                               {empName(emp)}
// //                             </p>
// //                             <p className="truncate text-[11px] text-slate-400">
// //                               {emp.employee_code || ""}
// //                             </p>
// //                           </div>
// //                         </label>
// //                       );
// //                     })
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="grid gap-4 sm:grid-cols-2">
// //                 <div>
// //                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
// //                     Issue Date
// //                   </label>
// //                   <input
// //                     type="date"
// //                     value={generateForm.issue_date}
// //                     onChange={(e) =>
// //                       setGenerateForm((p) => ({ ...p, issue_date: e.target.value }))
// //                     }
// //                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
// //                     Effective Date
// //                   </label>
// //                   <input
// //                     type="date"
// //                     value={generateForm.effective_date}
// //                     onChange={(e) =>
// //                       setGenerateForm((p) => ({
// //                         ...p,
// //                         effective_date: e.target.value,
// //                       }))
// //                     }
// //                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
// //                   Signatory
// //                 </label>
// //                 <select
// //                   value={generateForm.signatory_id}
// //                   onChange={(e) =>
// //                     setGenerateForm((p) => ({ ...p, signatory_id: e.target.value }))
// //                   }
// //                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 >
// //                   <option value="">Optional</option>
// //                   {signatories.map((s) => (
// //                     <option key={s.signatory_id} value={s.signatory_id}>
// //                       {s.name} — {s.designation}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="flex flex-wrap gap-6 rounded-lg border border-slate-200 bg-[#fafbfc] px-4 py-3">
// //                 <label className="flex items-center gap-2 text-[13px] text-slate-700">
// //                   <input
// //                     type="checkbox"
// //                     checked={generateForm.publish_to_ess}
// //                     onChange={(e) =>
// //                       setGenerateForm((p) => ({
// //                         ...p,
// //                         publish_to_ess: e.target.checked,
// //                       }))
// //                     }
// //                     className="rounded border-slate-300 text-[#E42527]"
// //                   />
// //                   Publish to ESS
// //                 </label>
// //                 <label className="flex items-center gap-2 text-[13px] text-slate-700">
// //                   <input
// //                     type="checkbox"
// //                     checked={generateForm.send_email}
// //                     onChange={(e) =>
// //                       setGenerateForm((p) => ({
// //                         ...p,
// //                         send_email: e.target.checked,
// //                       }))
// //                     }
// //                     className="rounded border-slate-300 text-[#E42527]"
// //                   />
// //                   Send Email
// //                 </label>
// //               </div>

// //               <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setGenerateForm(EMPTY_GENERATE);
// //                     setSelectedEmployees([]);
// //                     setFilterDept("");
// //                     setFilterDesig("");
// //                     setEmpSearch("");
// //                   }}
// //                   className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
// //                 >
// //                   Reset
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={loading || selectedEmployees.length === 0}
// //                   className="h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
// //                 >
// //                   {loading ? "Generating..." : `Generate (${selectedEmployees.length})`}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         )}

// //         {/* ===== CREATE TEMPLATE ===== */}
// //         {activeTab === "create-template" && (
// //           <div className="mx-auto max-w-2xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
// //             <h2 className="text-[17px] font-semibold text-slate-900">Create Template</h2>
// //             <p className="mt-1 text-[13px] text-slate-500">
// //               Use placeholders like {"{{employee.full_name}}"}, {"{{company.name}}"}, {"{{letter.number}}"}
// //             </p>
// //             <form onSubmit={handleCreateTemplate} className="mt-6 space-y-4">
// //               <div className="grid gap-4 sm:grid-cols-2">
// //                 <select
// //                   required
// //                   value={templateForm.category_id}
// //                   onChange={(e) =>
// //                     setTemplateForm((p) => ({ ...p, category_id: e.target.value }))
// //                   }
// //                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 >
// //                   <option value="">Category *</option>
// //                   {categories.map((c) => (
// //                     <option key={c.category_id} value={c.category_id}>
// //                       {c.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 <input
// //                   required
// //                   value={templateForm.code}
// //                   onChange={(e) =>
// //                     setTemplateForm((p) => ({
// //                       ...p,
// //                       code: e.target.value.toUpperCase(),
// //                     }))
// //                   }
// //                   placeholder="Code *"
// //                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 />
// //               </div>
// //               <input
// //                 required
// //                 value={templateForm.name}
// //                 onChange={(e) =>
// //                   setTemplateForm((p) => ({ ...p, name: e.target.value }))
// //                 }
// //                 placeholder="Template name *"
// //                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //               />
// //               <textarea
// //                 rows={11}
// //                 value={templateForm.content_html}
// //                 onChange={(e) =>
// //                   setTemplateForm((p) => ({ ...p, content_html: e.target.value }))
// //                 }
// //                 placeholder="Paste professional letter HTML here..."
// //                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10 font-mono"
// //               />
// //               <div className="flex flex-wrap gap-5 rounded-lg border border-slate-200 bg-[#fafbfc] px-4 py-3">
// //                 {[
// //                   ["requires_approval", "Approval"],
// //                   ["requires_esign", "E-Sign"],
// //                   ["allow_employee_request", "Self Request"],
// //                   ["password_protect_pdf", "Password PDF"],
// //                 ].map(([k, label]) => (
// //                   <label key={k} className="flex items-center gap-2 text-[13px] text-slate-700">
// //                     <input
// //                       type="checkbox"
// //                       checked={templateForm[k]}
// //                       onChange={(e) =>
// //                         setTemplateForm((p) => ({ ...p, [k]: e.target.checked }))
// //                       }
// //                       className="rounded border-slate-300 text-[#E42527]"
// //                     />
// //                     {label}
// //                   </label>
// //                 ))}
// //               </div>
// //               <div className="flex justify-end pt-2">
// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
// //                 >
// //                   {loading ? "Saving..." : "Create Template"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         )}

// //         {/* ===== CREATE SIGNATORY ===== */}
// //         {activeTab === "create-signatory" && (
// //           <div className="mx-auto max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
// //             <h2 className="text-[17px] font-semibold text-slate-900">Add Signatory</h2>
// //             <form onSubmit={handleCreateSignatory} className="mt-6 space-y-4">
// //               <input
// //                 required
// //                 value={signatoryForm.name}
// //                 onChange={(e) =>
// //                   setSignatoryForm((p) => ({ ...p, name: e.target.value }))
// //                 }
// //                 placeholder="Name *"
// //                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //               />
// //               <input
// //                 required
// //                 value={signatoryForm.designation}
// //                 onChange={(e) =>
// //                   setSignatoryForm((p) => ({ ...p, designation: e.target.value }))
// //                 }
// //                 placeholder="Designation *"
// //                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //               />
// //               <div className="grid gap-4 sm:grid-cols-2">
// //                 <input
// //                   value={signatoryForm.department}
// //                   onChange={(e) =>
// //                     setSignatoryForm((p) => ({ ...p, department: e.target.value }))
// //                   }
// //                   placeholder="Department"
// //                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 />
// //                 <input
// //                   type="email"
// //                   value={signatoryForm.email}
// //                   onChange={(e) =>
// //                     setSignatoryForm((p) => ({ ...p, email: e.target.value }))
// //                   }
// //                   placeholder="Email"
// //                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
// //                 />
// //               </div>
// //               <label className="flex items-center gap-2 text-[13px] text-slate-700">
// //                 <input
// //                   type="checkbox"
// //                   checked={signatoryForm.is_default}
// //                   onChange={(e) =>
// //                     setSignatoryForm((p) => ({ ...p, is_default: e.target.checked }))
// //                   }
// //                   className="rounded border-slate-300 text-[#E42527]"
// //                 />
// //                 Default signatory
// //               </label>
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="h-10 w-full rounded-lg bg-[#E42527] text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
// //               >
// //                 {loading ? "Saving..." : "Add Signatory"}
// //               </button>
// //             </form>
// //           </div>
// //         )}
// //       </div>

// //       {/* Letter modal */}
// //       {selectedLetter && (
// //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
// //           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <div>
// //                 <p className="text-[11px] uppercase tracking-wider text-slate-400">Letter</p>
// //                 <h3 className="text-[16px] font-semibold text-slate-900">
// //                   {selectedLetter.letter_number || "—"}
// //                 </h3>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedLetter(null)}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
// //               >
// //                 ✕
// //               </button>
// //             </div>
// //             <div className="grid gap-3 p-5 sm:grid-cols-2">
// //               {[
// //                 ["Status", selectedLetter.status],
// //                 ["Employee", selectedLetter.employee_name || "—"],
// //                 ["Issue Date", formatDate(selectedLetter.issue_date)],
// //                 ["Effective", formatDate(selectedLetter.effective_date)],
// //               ].map(([l, v]) => (
// //                 <div key={l} className="rounded-lg bg-[#f8fafc] px-3.5 py-2.5">
// //                   <p className="text-[11px] text-slate-400">{l}</p>
// //                   <p className="mt-0.5 text-[13px] font-medium capitalize text-slate-800">
// //                     {v ?? "—"}
// //                   </p>
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => handleDownload(selectedLetter.letter_id)}
// //                 className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition"
// //               >
// //                 Download
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedLetter(null)}
// //                 className="h-9 rounded-lg bg-[#E42527] px-4 text-[13px] font-medium text-white hover:bg-[#c91f21] transition"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Template modal */}
// //       {selectedTemplate && (
// //         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
// //           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <h3 className="text-[16px] font-semibold text-slate-900">
// //                 {selectedTemplate.name}
// //               </h3>
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedTemplate(null)}
// //                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
// //               >
// //                 ✕
// //               </button>
// //             </div>
// //             <div className="grid gap-3 p-5 sm:grid-cols-2">
// //               {[
// //                 ["Code", selectedTemplate.code],
// //                 ["Version", selectedTemplate.version || 1],
// //                 ["Approval", selectedTemplate.requires_approval ? "Yes" : "No"],
// //                 ["E-Sign", selectedTemplate.requires_esign ? "Yes" : "No"],
// //               ].map(([l, v]) => (
// //                 <div key={l} className="rounded-lg bg-[#f8fafc] px-3.5 py-2.5">
// //                   <p className="text-[11px] text-slate-400">{l}</p>
// //                   <p className="mt-0.5 text-[13px] font-medium text-slate-800">{v}</p>
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="flex justify-end border-t border-slate-100 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setSelectedTemplate(null)}
// //                 className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { api } from "@/lib/api";

// /* ===================== CONSTANTS ===================== */
// const STATUS_COLOR = {
//   draft: "bg-slate-100 text-slate-600",
//   pending_approval: "bg-amber-50 text-amber-700",
//   approved: "bg-blue-50 text-blue-700",
//   sent: "bg-indigo-50 text-indigo-700",
//   published: "bg-emerald-50 text-emerald-700",
//   viewed: "bg-cyan-50 text-cyan-700",
//   accepted: "bg-green-50 text-green-700",
//   declined: "bg-red-50 text-red-700",
//   signed: "bg-violet-50 text-violet-700",
//   expired: "bg-orange-50 text-orange-700",
//   cancelled: "bg-rose-50 text-rose-700",
//   pending: "bg-amber-50 text-amber-700",
//   generated: "bg-emerald-50 text-emerald-700",
//   rejected: "bg-red-50 text-red-700",
// };

// const EMPTY_CATEGORY = {
//   code: "",
//   name: "",
//   description: "",
//   number_prefix: "",
//   display_order: 100,
//   is_active: true,
// };

// const EMPTY_TEMPLATE = {
//   category_id: "",
//   name: "",
//   code: "",
//   description: "",
//   content_html: "",
//   requires_approval: false,
//   requires_esign: false,
//   allow_employee_request: false,
//   password_protect_pdf: false,
//   is_active: true,
// };

// const EMPTY_GENERATE = {
//   template_id: "",
//   issue_date: "",
//   effective_date: "",
//   signatory_id: "",
//   publish_to_ess: true,
//   send_email: false,
// };

// const EMPTY_SIGNATORY = {
//   name: "",
//   designation: "",
//   department: "",
//   email: "",
//   is_default: false,
//   is_active: true,
// };

// /* ===================== PROFESSIONAL SAMPLE TEMPLATES ===================== */
// const SAMPLE_TEMPLATES = {
//   EXPERIENCE: `<p><strong>To Whom It May Concern,</strong></p>

// <p style="margin-top:16px; text-align:justify;">
//   This is to certify that <strong>{{employee.full_name}}</strong>
//   (Employee Code: <strong>{{employee.employee_code}}</strong>)
//   was employed with <strong>{{company.name}}</strong>
//   as <strong>{{employee.designation}}</strong>
//   in the <strong>{{employee.department}}</strong> department
//   from <strong>{{employee.joining_date}}</strong>
//   to <strong>{{employee.leaving_date}}</strong>.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   During the tenure, {{employee.full_name}} performed the duties and responsibilities
//   assigned with sincerity, dedication and professionalism.
//   {{employee.full_name}} was found to be hardworking, reliable and a valuable member of the team.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   We wish {{employee.full_name}} all the very best for future endeavours.
// </p>`,

//   RELIEVING: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>

// <p style="margin-top:16px;"><strong>Subject: Relieving Letter</strong></p>

// <p style="margin-top:16px; text-align:justify;">
//   This is to confirm that you have been relieved from your duties as
//   <strong>{{employee.designation}}</strong> in the
//   <strong>{{employee.department}}</strong> department of
//   <strong>{{company.name}}</strong> with effect from
//   <strong>{{employee.leaving_date}}</strong>.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   You joined the organisation on <strong>{{employee.joining_date}}</strong>
//   and have completed all exit formalities. We acknowledge your contribution
//   during your association with us.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   We wish you success in your future career.
// </p>`,

//   BONAFIDE: `<p><strong>To Whom It May Concern,</strong></p>

// <p style="margin-top:16px; text-align:justify;">
//   This is to certify that <strong>{{employee.full_name}}</strong>
//   (Employee Code: <strong>{{employee.employee_code}}</strong>)
//   is a bona fide employee of <strong>{{company.name}}</strong>
//   and is currently working as <strong>{{employee.designation}}</strong>
//   in the <strong>{{employee.department}}</strong> department
//   since <strong>{{employee.joining_date}}</strong>.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   This certificate is issued upon the request of the employee for official purposes.
// </p>`,

//   OFFER: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>

// <p style="margin-top:16px;"><strong>Subject: Offer of Employment – {{employee.designation}}</strong></p>

// <p style="margin-top:16px; text-align:justify;">
//   We are pleased to offer you the position of <strong>{{employee.designation}}</strong>
//   in the <strong>{{employee.department}}</strong> department at
//   <strong>{{company.name}}</strong>.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   Your date of joining will be <strong>{{letter.effective_date}}</strong>.
//   Detailed terms and conditions of employment, compensation structure and
//   benefits will be shared separately / are enclosed as Annexure.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   Please confirm your acceptance of this offer by signing and returning a copy
//   of this letter on or before the stipulated date.
// </p>

// <p style="margin-top:14px; text-align:justify;">
//   We look forward to welcoming you to the team.
// </p>`,
// };

// /* ===================== HELPERS ===================== */
// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// }

// function pickList(res) {
//   const body = res?.data ?? {};
//   const list =
//     body?.data ??
//     body?.items ??
//     body?.results ??
//     body?.employees ??
//     body?.departments ??
//     body?.designations ??
//     body?.templates ??
//     body?.categories ??
//     body?.letters ??
//     body?.requests ??
//     body?.signatories ??
//     [];
//   return Array.isArray(list) ? list : Array.isArray(body) ? body : [];
// }

// function formatDate(value) {
//   if (!value) return "—";
//   try {
//     return new Date(value).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return String(value);
//   }
// }

// function empName(emp) {
//   if (!emp) return "—";
//   if (emp.full_name) return emp.full_name;
//   const n = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
//   return n || emp.employee_code || "—";
// }

// function StatusBadge({ status }) {
//   const key = String(status || "").toLowerCase();
//   const color = STATUS_COLOR[key] || "bg-slate-100 text-slate-600";
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${color}`}
//     >
//       {String(status || "—").replace(/_/g, " ")}
//     </span>
//   );
// }

// /* ===================== PAGE ===================== */
// export default function HRLettersPage() {
//   const [activeTab, setActiveTab] = useState("letters");

//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   const [letters, setLetters] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [signatories, setSignatories] = useState([]);

//   const [listLoading, setListLoading] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [selectedLetter, setSelectedLetter] = useState(null);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);

//   const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
//   const [templateForm, setTemplateForm] = useState(EMPTY_TEMPLATE);
//   const [generateForm, setGenerateForm] = useState(EMPTY_GENERATE);
//   const [signatoryForm, setSignatoryForm] = useState(EMPTY_SIGNATORY);

//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [filterDept, setFilterDept] = useState("");
//   const [filterDesig, setFilterDesig] = useState("");
//   const [empSearch, setEmpSearch] = useState("");
//   const [letterSearch, setLetterSearch] = useState("");

//   /* ===================== FETCH ===================== */
//   const fetchEmployees = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/employees", {
//         params: { page: 1, page_size: 500 },
//       });
//       setEmployees(pickList(res));
//     } catch {
//       setEmployees([]);
//     }
//   }, []);

//   const fetchDepartments = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/departments", {
//         params: { page: 1, page_size: 200 },
//       });
//       setDepartments(pickList(res));
//     } catch {
//       setDepartments([]);
//     }
//   }, []);

//   const fetchDesignations = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/designations", {
//         params: { page: 1, page_size: 200 },
//       });
//       setDesignations(pickList(res));
//     } catch {
//       setDesignations([]);
//     }
//   }, []);

//   const fetchLetters = useCallback(async () => {
//     setListLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/get/generated/letters", {
//         params: { page: 1, page_size: 100 },
//       });
//       setLetters(pickList(res));
//     } catch (err) {
//       setError(getErrorMessage(err));
//       setLetters([]);
//     } finally {
//       setListLoading(false);
//     }
//   }, []);

//   const fetchTemplates = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/letter/templates", {
//         params: { is_active: true, page: 1, page_size: 100 },
//       });
//       setTemplates(pickList(res));
//     } catch {
//       setTemplates([]);
//     }
//   }, []);

//   const fetchCategories = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/letter/categories", {
//         params: { is_active: true, page: 1, page_size: 100 },
//       });
//       setCategories(pickList(res));
//     } catch {
//       setCategories([]);
//     }
//   }, []);

//   const fetchRequests = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/letter/requests", {
//         params: { page: 1, page_size: 50 },
//       });
//       setRequests(pickList(res));
//     } catch {
//       setRequests([]);
//     }
//   }, []);

//   const fetchSignatories = useCallback(async () => {
//     try {
//       const res = await api.get("/api/v1/get/letter/signatories", {
//         params: { is_active: true, page: 1, page_size: 100 },
//       });
//       setSignatories(pickList(res));
//     } catch {
//       setSignatories([]);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEmployees();
//     fetchDepartments();
//     fetchDesignations();
//     fetchLetters();
//     fetchTemplates();
//     fetchCategories();
//     fetchRequests();
//     fetchSignatories();
//   }, [
//     fetchEmployees,
//     fetchDepartments,
//     fetchDesignations,
//     fetchLetters,
//     fetchTemplates,
//     fetchCategories,
//     fetchRequests,
//     fetchSignatories,
//   ]);

//   /* ===================== DERIVED ===================== */
//   const filteredEmployees = useMemo(() => {
//     return employees.filter((emp) => {
//       const deptId = emp.department_id || emp.department?.department_id || "";
//       const desigId = emp.designation_id || emp.designation?.designation_id || "";
//       const name = empName(emp).toLowerCase();
//       const code = String(emp.employee_code || "").toLowerCase();
//       const deptOk = !filterDept || deptId === filterDept;
//       const desigOk = !filterDesig || desigId === filterDesig;
//       const searchOk =
//         !empSearch ||
//         name.includes(empSearch.toLowerCase()) ||
//         code.includes(empSearch.toLowerCase());
//       return deptOk && desigOk && searchOk;
//     });
//   }, [employees, filterDept, filterDesig, empSearch]);

//   const filteredLetters = useMemo(() => {
//     if (!letterSearch.trim()) return letters;
//     const q = letterSearch.toLowerCase();
//     return letters.filter(
//       (l) =>
//         String(l.letter_number || "").toLowerCase().includes(q) ||
//         String(l.employee_name || "").toLowerCase().includes(q) ||
//         String(l.status || "").toLowerCase().includes(q)
//     );
//   }, [letters, letterSearch]);

//   const stats = useMemo(
//     () => ({
//       letters: letters.length,
//       templates: templates.length,
//       categories: categories.length,
//       pending: requests.filter((r) => String(r.status).toLowerCase() === "pending").length,
//       signatories: signatories.length,
//     }),
//     [letters, templates, categories, requests, signatories]
//   );

//   /* ===================== HANDLERS ===================== */
//   async function handleCreateCategory(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/create/letter/category", {
//         ...categoryForm,
//         code: categoryForm.code.toUpperCase(),
//         number_prefix:
//           categoryForm.number_prefix || categoryForm.code.toUpperCase().slice(0, 3),
//       });
//       setSuccess("Category created successfully");
//       setCategoryForm(EMPTY_CATEGORY);
//       await fetchCategories();
//       setActiveTab("categories");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleCreateTemplate(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/create/letter/template", {
//         ...templateForm,
//         code: templateForm.code.toUpperCase(),
//       });
//       setSuccess("Template created successfully");
//       setTemplateForm(EMPTY_TEMPLATE);
//       await fetchTemplates();
//       setActiveTab("templates");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleCreateSignatory(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/create/letter/signatory", signatoryForm);
//       setSuccess("Signatory added successfully");
//       setSignatoryForm(EMPTY_SIGNATORY);
//       await fetchSignatories();
//       setActiveTab("signatories");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleGenerate(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       if (!generateForm.template_id) {
//         setError("Please select a template");
//         setLoading(false);
//         return;
//       }
//       if (selectedEmployees.length === 0) {
//         setError("Please select at least one employee");
//         setLoading(false);
//         return;
//       }
//       const res = await api.post("/api/v1/generate/letter", {
//         template_id: generateForm.template_id,
//         employee_ids: selectedEmployees,
//         issue_date: generateForm.issue_date || null,
//         effective_date: generateForm.effective_date || null,
//         signatory_id: generateForm.signatory_id || null,
//         publish_to_ess: generateForm.publish_to_ess,
//         send_email: generateForm.send_email,
//       });
//       setSuccess(res?.data?.message || "Letter(s) generated successfully");
//       setGenerateForm(EMPTY_GENERATE);
//       setSelectedEmployees([]);
//       setFilterDept("");
//       setFilterDesig("");
//       setEmpSearch("");
//       await fetchLetters();
//       setActiveTab("letters");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handlePublish(letterId) {
//     try {
//       await api.post(`/api/v1/publish/letter/${letterId}`);
//       setSuccess("Published to ESS");
//       await fetchLetters();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   async function handleSend(letterId) {
//     try {
//       await api.post(`/api/v1/send/letter/${letterId}`);
//       setSuccess("Letter sent successfully");
//       await fetchLetters();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   /* ========== PROFESSIONAL DOWNLOAD / PRINT ========== */
//   async function handleDownload(letterId) {
//     try {
//       setError("");
//       const res = await api.get(`/api/v1/download/letter/${letterId}`, {
//         params: { format: "pdf" },
//       });
//       const data = res?.data || {};

//       if (data.download_url) {
//         window.open(data.download_url, "_blank");
//         return;
//       }

//       if (data.content_html) {
//         const w = window.open("", "_blank");
//         if (!w) {
//           setError("Popup blocked. Please allow popups for this site.");
//           return;
//         }

//         // content_html already contains full professional HTML (letterhead + body + signature + footer)
//         // from backend _build_professional_html
//         w.document.write(data.content_html);
//         w.document.close();

//         // Auto trigger print after short delay so styles load
//         w.onload = function () {
//           setTimeout(function () {
//             w.focus();
//             w.print();
//           }, 400);
//         };

//         // Fallback if onload already fired
//         setTimeout(function () {
//           try {
//             w.focus();
//             w.print();
//           } catch (e) {}
//         }, 800);

//         return;
//       }

//       setError(data.message || "Download not available. Please regenerate the letter.");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   async function handleProcessRequest(requestId, action) {
//     try {
//       await api.post(`/api/v1/process/letter/request/${requestId}`, { action });
//       setSuccess(`Request ${action}d successfully`);
//       await fetchRequests();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   function applySampleTemplate(key) {
//     const html = SAMPLE_TEMPLATES[key];
//     if (html) {
//       setTemplateForm((p) => ({ ...p, content_html: html }));
//     }
//   }

//   const tabs = [
//     { id: "letters", label: "Letters", count: stats.letters },
//     { id: "templates", label: "Templates", count: stats.templates },
//     { id: "categories", label: "Categories", count: stats.categories },
//     { id: "signatories", label: "Signatories", count: stats.signatories },
//     { id: "requests", label: "Requests", count: stats.pending },
//     { id: "generate", label: "Generate" },
//     { id: "create-template", label: "+ Template" },
//     { id: "create-signatory", label: "+ Signatory" },
//   ];

//   /* ===================== UI ===================== */
//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f4f6f8]">
//       {/* Header */}
//       <div className="border-b border-slate-200/80 bg-white">
//         <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E42527]">
//                 HR Operations
//               </p>
//               <h1 className="mt-1 text-[22px] font-semibold text-slate-900 tracking-tight">
//                 HR Letters
//               </h1>
//               <p className="mt-0.5 text-[13px] text-slate-500">
//                 Generate, publish and manage employee letters (Professional format)
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-2.5">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setActiveTab("generate");
//                   setError("");
//                   setSuccess("");
//                 }}
//                 className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition"
//               >
//                 Generate Letter
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setActiveTab("create-template");
//                   setError("");
//                   setSuccess("");
//                 }}
//                 className="h-9 rounded-lg bg-[#E42527] px-4 text-[13px] font-medium text-white shadow-sm hover:bg-[#c91f21] transition"
//               >
//                 + Template
//               </button>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
//             {[
//               { label: "Letters", value: stats.letters },
//               { label: "Templates", value: stats.templates },
//               { label: "Categories", value: stats.categories },
//               { label: "Pending", value: stats.pending },
//               { label: "Signatories", value: stats.signatories },
//             ].map((s) => (
//               <div
//                 key={s.label}
//                 className="rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
//               >
//                 <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
//                 <p className="mt-1 text-[22px] font-semibold text-slate-800">{s.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Tabs */}
//           <div className="mt-5 flex flex-wrap gap-0.5 border-b border-slate-200">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setError("");
//                   setSuccess("");
//                 }}
//                 className={`relative px-3.5 py-2.5 text-[13px] font-medium transition ${
//                   activeTab === tab.id
//                     ? "text-[#E42527]"
//                     : "text-slate-500 hover:text-slate-800"
//                 }`}
//               >
//                 {tab.label}
//                 {typeof tab.count === "number" && (
//                   <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-medium text-slate-600">
//                     {tab.count}
//                   </span>
//                 )}
//                 {activeTab === tab.id && (
//                   <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#E42527]" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
//         {error && (
//           <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
//             {success}
//           </div>
//         )}

//         {/* ===== LETTERS ===== */}
//         {activeTab === "letters" && (
//           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
//             <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h2 className="text-[14px] font-semibold text-slate-800">Generated Letters</h2>
//                 <p className="text-[12px] text-slate-500">{filteredLetters.length} shown</p>
//               </div>
//               <div className="flex gap-2">
//                 <input
//                   value={letterSearch}
//                   onChange={(e) => setLetterSearch(e.target.value)}
//                   placeholder="Search letter or employee..."
//                   className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10 sm:w-56"
//                 />
//                 <button
//                   type="button"
//                   onClick={fetchLetters}
//                   className="h-9 rounded-lg border border-slate-200 px-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
//                 >
//                   Refresh
//                 </button>
//               </div>
//             </div>

//             {listLoading ? (
//               <div className="py-20 text-center text-[13px] text-slate-500">Loading letters...</div>
//             ) : filteredLetters.length === 0 ? (
//               <div className="px-6 py-20 text-center">
//                 <p className="text-[14px] font-medium text-slate-700">No letters found</p>
//                 <p className="mt-1 text-[13px] text-slate-500">
//                   Generate your first letter to get started
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => setActiveTab("generate")}
//                   className="mt-5 h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] transition"
//                 >
//                   Generate Letter
//                 </button>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-[13px]">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-[#fafbfc]">
//                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Letter No.
//                       </th>
//                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Employee
//                       </th>
//                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Status
//                       </th>
//                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Issue Date
//                       </th>
//                       <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {filteredLetters.map((letter, idx) => (
//                       <tr key={letter.letter_id || idx} className="hover:bg-[#f8fafc] transition">
//                         <td className="px-5 py-3.5">
//                           <div className="font-medium text-slate-800">
//                             {letter.letter_number || "—"}
//                           </div>
//                           <div className="text-[11px] text-slate-400 mt-0.5">
//                             {letter.template_name || ""}
//                           </div>
//                         </td>
//                         <td className="px-5 py-3.5 text-slate-700">
//                           {letter.employee_name || "—"}
//                         </td>
//                         <td className="px-5 py-3.5">
//                           <StatusBadge status={letter.status} />
//                         </td>
//                         <td className="px-5 py-3.5 text-slate-600">
//                           {formatDate(letter.issue_date)}
//                         </td>
//                         <td className="px-5 py-3.5 text-right">
//                           <div className="flex flex-wrap items-center justify-end gap-1">
//                             <button
//                               type="button"
//                               onClick={() => setSelectedLetter(letter)}
//                               className="rounded-md px-2.5 py-1 text-[12px] font-medium text-[#E42527] hover:bg-red-50 transition"
//                             >
//                               View
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleDownload(letter.letter_id)}
//                               className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
//                             >
//                               Download / Print
//                             </button>
//                             {String(letter.status).toLowerCase() !== "published" && (
//                               <button
//                                 type="button"
//                                 onClick={() => handlePublish(letter.letter_id)}
//                                 className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
//                               >
//                                 Publish
//                               </button>
//                             )}
//                             <button
//                               type="button"
//                               onClick={() => handleSend(letter.letter_id)}
//                               className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
//                             >
//                               Send
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ===== TEMPLATES ===== */}
//         {activeTab === "templates" && (
//           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-[14px] font-semibold text-slate-800">Templates</h2>
//               <button
//                 type="button"
//                 onClick={() => setActiveTab("create-template")}
//                 className="h-8 rounded-lg bg-[#E42527] px-3.5 text-[12px] font-medium text-white hover:bg-[#c91f21] transition"
//               >
//                 + New
//               </button>
//             </div>
//             {templates.length === 0 ? (
//               <div className="px-6 py-20 text-center text-[13px] text-slate-500">
//                 No templates yet
//               </div>
//             ) : (
//               <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {templates.map((t) => (
//                   <button
//                     key={t.template_id}
//                     type="button"
//                     onClick={() => setSelectedTemplate(t)}
//                     className="rounded-xl border border-slate-200 bg-[#fafbfc] p-4 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
//                   >
//                     <div className="flex items-start justify-between gap-2">
//                       <div>
//                         <p className="text-[14px] font-semibold text-slate-900">{t.name}</p>
//                         <p className="mt-0.5 text-[12px] text-slate-500">{t.code}</p>
//                       </div>
//                       <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
//                         v{t.version || 1}
//                       </span>
//                     </div>
//                     <div className="mt-3 flex flex-wrap gap-1.5">
//                       {t.requires_approval && (
//                         <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
//                           Approval
//                         </span>
//                       )}
//                       {t.requires_esign && (
//                         <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">
//                           E-Sign
//                         </span>
//                       )}
//                       {t.allow_employee_request && (
//                         <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
//                           Self Request
//                         </span>
//                       )}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ===== CATEGORIES ===== */}
//         {activeTab === "categories" && (
//           <div className="grid gap-5 lg:grid-cols-5">
//             <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:col-span-3">
//               <div className="border-b border-slate-100 px-5 py-4">
//                 <h2 className="text-[14px] font-semibold text-slate-800">Categories</h2>
//               </div>
//               <div className="divide-y divide-slate-50">
//                 {categories.length === 0 ? (
//                   <div className="px-5 py-12 text-center text-[13px] text-slate-500">
//                     No categories
//                   </div>
//                 ) : (
//                   categories.map((c) => (
//                     <div
//                       key={c.category_id}
//                       className="flex items-center justify-between px-5 py-3.5"
//                     >
//                       <div>
//                         <div className="text-[13px] font-medium text-slate-800">{c.name}</div>
//                         <div className="text-[12px] text-slate-400 mt-0.5">
//                           {c.code} · Prefix {c.number_prefix || "—"}
//                         </div>
//                       </div>
//                       <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
//                         Active
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:col-span-2">
//               <h3 className="text-[14px] font-semibold text-slate-800">Add Category</h3>
//               <form onSubmit={handleCreateCategory} className="mt-4 space-y-3">
//                 <input
//                   required
//                   value={categoryForm.code}
//                   onChange={(e) =>
//                     setCategoryForm((p) => ({
//                       ...p,
//                       code: e.target.value.toUpperCase(),
//                     }))
//                   }
//                   placeholder="Code e.g. EXPERIENCE"
//                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 />
//                 <input
//                   required
//                   value={categoryForm.name}
//                   onChange={(e) =>
//                     setCategoryForm((p) => ({ ...p, name: e.target.value }))
//                   }
//                   placeholder="Name"
//                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 />
//                 <input
//                   value={categoryForm.number_prefix}
//                   onChange={(e) =>
//                     setCategoryForm((p) => ({
//                       ...p,
//                       number_prefix: e.target.value.toUpperCase(),
//                     }))
//                   }
//                   placeholder="Prefix e.g. EXP"
//                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="h-9 w-full rounded-lg bg-[#E42527] text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
//                 >
//                   {loading ? "Saving..." : "Create Category"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* ===== SIGNATORIES ===== */}
//         {activeTab === "signatories" && (
//           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-[14px] font-semibold text-slate-800">Signatories</h2>
//               <button
//                 type="button"
//                 onClick={() => setActiveTab("create-signatory")}
//                 className="h-8 rounded-lg bg-[#E42527] px-3.5 text-[12px] font-medium text-white hover:bg-[#c91f21] transition"
//               >
//                 + Add
//               </button>
//             </div>
//             {signatories.length === 0 ? (
//               <div className="px-6 py-20 text-center text-[13px] text-slate-500">
//                 No signatories
//               </div>
//             ) : (
//               <div className="divide-y divide-slate-50">
//                 {signatories.map((s) => (
//                   <div
//                     key={s.signatory_id}
//                     className="flex items-center justify-between px-5 py-3.5"
//                   >
//                     <div>
//                       <div className="text-[13px] font-medium text-slate-800">{s.name}</div>
//                       <div className="text-[12px] text-slate-400 mt-0.5">
//                         {s.designation}
//                         {s.department ? ` · ${s.department}` : ""}
//                       </div>
//                     </div>
//                     {s.is_default && (
//                       <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
//                         Default
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ===== REQUESTS ===== */}
//         {activeTab === "requests" && (
//           <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
//             <div className="border-b border-slate-100 px-5 py-4">
//               <h2 className="text-[14px] font-semibold text-slate-800">Employee Requests</h2>
//             </div>
//             {requests.length === 0 ? (
//               <div className="px-6 py-20 text-center text-[13px] text-slate-500">No requests</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-[13px]">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-[#fafbfc]">
//                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Employee
//                       </th>
//                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Purpose
//                       </th>
//                       <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Status
//                       </th>
//                       <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {requests.map((r, idx) => (
//                       <tr key={r.request_id || idx} className="hover:bg-[#f8fafc]">
//                         <td className="px-5 py-3.5">{r.employee_name || "—"}</td>
//                         <td className="px-5 py-3.5 text-slate-600">
//                           {r.purpose || r.reason || "—"}
//                         </td>
//                         <td className="px-5 py-3.5">
//                           <StatusBadge status={r.status} />
//                         </td>
//                         <td className="px-5 py-3.5 text-right">
//                           {String(r.status).toLowerCase() === "pending" && (
//                             <div className="flex justify-end gap-3">
//                               <button
//                                 type="button"
//                                 onClick={() => handleProcessRequest(r.request_id, "approve")}
//                                 className="text-[12px] font-medium text-emerald-600 hover:underline"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => handleProcessRequest(r.request_id, "reject")}
//                                 className="text-[12px] font-medium text-red-600 hover:underline"
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ===== GENERATE ===== */}
//         {activeTab === "generate" && (
//           <div className="mx-auto max-w-2xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
//             <h2 className="text-[17px] font-semibold text-slate-900">Generate Letter</h2>
//             <p className="mt-1 text-[13px] text-slate-500">
//               Select template and employees. Letter will be generated in professional format.
//             </p>

//             <form onSubmit={handleGenerate} className="mt-6 space-y-5">
//               <div>
//                 <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
//                   Template *
//                 </label>
//                 <select
//                   required
//                   value={generateForm.template_id}
//                   onChange={(e) =>
//                     setGenerateForm((p) => ({ ...p, template_id: e.target.value }))
//                   }
//                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 >
//                   <option value="">Select template</option>
//                   {templates.map((t) => (
//                     <option key={t.template_id} value={t.template_id}>
//                       {t.name} ({t.code})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
//                     Department
//                   </label>
//                   <select
//                     value={filterDept}
//                     onChange={(e) => setFilterDept(e.target.value)}
//                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                   >
//                     <option value="">All</option>
//                     {departments.map((d) => (
//                       <option key={d.department_id || d.id} value={d.department_id || d.id}>
//                         {d.department_name || d.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
//                     Designation
//                   </label>
//                   <select
//                     value={filterDesig}
//                     onChange={(e) => setFilterDesig(e.target.value)}
//                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                   >
//                     <option value="">All</option>
//                     {designations.map((d) => (
//                       <option key={d.designation_id || d.id} value={d.designation_id || d.id}>
//                         {d.job_title || d.designation_name || d.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <input
//                 value={empSearch}
//                 onChange={(e) => setEmpSearch(e.target.value)}
//                 placeholder="Search employee name or code..."
//                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//               />

//               <div>
//                 <div className="mb-1.5 flex items-center justify-between">
//                   <label className="text-[13px] font-medium text-slate-700">
//                     Employees * ({selectedEmployees.length})
//                   </label>
//                   {selectedEmployees.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => setSelectedEmployees([])}
//                       className="text-[12px] font-medium text-[#E42527] hover:underline"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//                 <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200">
//                   {filteredEmployees.length === 0 ? (
//                     <div className="px-4 py-8 text-center text-[13px] text-slate-500">
//                       No employees found
//                     </div>
//                   ) : (
//                     filteredEmployees.map((emp) => {
//                       const id = emp.employee_id || emp.id;
//                       const checked = selectedEmployees.includes(id);
//                       return (
//                         <label
//                           key={id}
//                           className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-4 py-2.5 hover:bg-slate-50 last:border-0"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={checked}
//                             onChange={() =>
//                               setSelectedEmployees((prev) =>
//                                 checked ? prev.filter((x) => x !== id) : [...prev, id]
//                               )
//                             }
//                             className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
//                           />
//                           <div className="min-w-0">
//                             <p className="truncate text-[13px] font-medium text-slate-800">
//                               {empName(emp)}
//                             </p>
//                             <p className="truncate text-[11px] text-slate-400">
//                               {emp.employee_code || ""}
//                             </p>
//                           </div>
//                         </label>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>

//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
//                     Issue Date
//                   </label>
//                   <input
//                     type="date"
//                     value={generateForm.issue_date}
//                     onChange={(e) =>
//                       setGenerateForm((p) => ({ ...p, issue_date: e.target.value }))
//                     }
//                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                   />
//                 </div>
//                 <div>
//                   <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
//                     Effective Date
//                   </label>
//                   <input
//                     type="date"
//                     value={generateForm.effective_date}
//                     onChange={(e) =>
//                       setGenerateForm((p) => ({
//                         ...p,
//                         effective_date: e.target.value,
//                       }))
//                     }
//                     className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
//                   Signatory
//                 </label>
//                 <select
//                   value={generateForm.signatory_id}
//                   onChange={(e) =>
//                     setGenerateForm((p) => ({ ...p, signatory_id: e.target.value }))
//                   }
//                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 >
//                   <option value="">Optional</option>
//                   {signatories.map((s) => (
//                     <option key={s.signatory_id} value={s.signatory_id}>
//                       {s.name} — {s.designation}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex flex-wrap gap-6 rounded-lg border border-slate-200 bg-[#fafbfc] px-4 py-3">
//                 <label className="flex items-center gap-2 text-[13px] text-slate-700">
//                   <input
//                     type="checkbox"
//                     checked={generateForm.publish_to_ess}
//                     onChange={(e) =>
//                       setGenerateForm((p) => ({
//                         ...p,
//                         publish_to_ess: e.target.checked,
//                       }))
//                     }
//                     className="rounded border-slate-300 text-[#E42527]"
//                   />
//                   Publish to ESS
//                 </label>
//                 <label className="flex items-center gap-2 text-[13px] text-slate-700">
//                   <input
//                     type="checkbox"
//                     checked={generateForm.send_email}
//                     onChange={(e) =>
//                       setGenerateForm((p) => ({
//                         ...p,
//                         send_email: e.target.checked,
//                       }))
//                     }
//                     className="rounded border-slate-300 text-[#E42527]"
//                   />
//                   Send Email
//                 </label>
//               </div>

//               <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setGenerateForm(EMPTY_GENERATE);
//                     setSelectedEmployees([]);
//                     setFilterDept("");
//                     setFilterDesig("");
//                     setEmpSearch("");
//                   }}
//                   className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading || selectedEmployees.length === 0}
//                   className="h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
//                 >
//                   {loading ? "Generating..." : `Generate (${selectedEmployees.length})`}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* ===== CREATE TEMPLATE ===== */}
//         {activeTab === "create-template" && (
//           <div className="mx-auto max-w-2xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
//             <h2 className="text-[17px] font-semibold text-slate-900">Create Template</h2>
//             <p className="mt-1 text-[13px] text-slate-500">
//               Use placeholders: {"{{employee.full_name}}"}, {"{{company.name}}"},{" "}
//               {"{{letter.number}}"}, {"{{signatory.name}}"} etc. Backend will add professional
//               letterhead automatically.
//             </p>

//             {/* Sample template buttons */}
//             <div className="mt-4 flex flex-wrap gap-2">
//               <span className="text-[12px] text-slate-500 self-center">Quick samples:</span>
//               {[
//                 ["EXPERIENCE", "Experience"],
//                 ["RELIEVING", "Relieving"],
//                 ["BONAFIDE", "Bonafide"],
//                 ["OFFER", "Offer"],
//               ].map(([key, label]) => (
//                 <button
//                   key={key}
//                   type="button"
//                   onClick={() => applySampleTemplate(key)}
//                   className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition"
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>

//             <form onSubmit={handleCreateTemplate} className="mt-5 space-y-4">
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <select
//                   required
//                   value={templateForm.category_id}
//                   onChange={(e) =>
//                     setTemplateForm((p) => ({ ...p, category_id: e.target.value }))
//                   }
//                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 >
//                   <option value="">Category *</option>
//                   {categories.map((c) => (
//                     <option key={c.category_id} value={c.category_id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   required
//                   value={templateForm.code}
//                   onChange={(e) =>
//                     setTemplateForm((p) => ({
//                       ...p,
//                       code: e.target.value.toUpperCase(),
//                     }))
//                   }
//                   placeholder="Code *"
//                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 />
//               </div>
//               <input
//                 required
//                 value={templateForm.name}
//                 onChange={(e) =>
//                   setTemplateForm((p) => ({ ...p, name: e.target.value }))
//                 }
//                 placeholder="Template name *"
//                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//               />
//               <textarea
//                 rows={12}
//                 value={templateForm.content_html}
//                 onChange={(e) =>
//                   setTemplateForm((p) => ({ ...p, content_html: e.target.value }))
//                 }
//                 placeholder="Paste body HTML here (or use Quick samples above)..."
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10 font-mono"
//               />
//               <div className="flex flex-wrap gap-5 rounded-lg border border-slate-200 bg-[#fafbfc] px-4 py-3">
//                 {[
//                   ["requires_approval", "Approval"],
//                   ["requires_esign", "E-Sign"],
//                   ["allow_employee_request", "Self Request"],
//                   ["password_protect_pdf", "Password PDF"],
//                 ].map(([k, label]) => (
//                   <label key={k} className="flex items-center gap-2 text-[13px] text-slate-700">
//                     <input
//                       type="checkbox"
//                       checked={templateForm[k]}
//                       onChange={(e) =>
//                         setTemplateForm((p) => ({ ...p, [k]: e.target.checked }))
//                       }
//                       className="rounded border-slate-300 text-[#E42527]"
//                     />
//                     {label}
//                   </label>
//                 ))}
//               </div>
//               <div className="flex justify-end pt-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
//                 >
//                   {loading ? "Saving..." : "Create Template"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* ===== CREATE SIGNATORY ===== */}
//         {activeTab === "create-signatory" && (
//           <div className="mx-auto max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
//             <h2 className="text-[17px] font-semibold text-slate-900">Add Signatory</h2>
//             <form onSubmit={handleCreateSignatory} className="mt-6 space-y-4">
//               <input
//                 required
//                 value={signatoryForm.name}
//                 onChange={(e) =>
//                   setSignatoryForm((p) => ({ ...p, name: e.target.value }))
//                 }
//                 placeholder="Name *"
//                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//               />
//               <input
//                 required
//                 value={signatoryForm.designation}
//                 onChange={(e) =>
//                   setSignatoryForm((p) => ({ ...p, designation: e.target.value }))
//                 }
//                 placeholder="Designation *"
//                 className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//               />
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <input
//                   value={signatoryForm.department}
//                   onChange={(e) =>
//                     setSignatoryForm((p) => ({ ...p, department: e.target.value }))
//                   }
//                   placeholder="Department"
//                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 />
//                 <input
//                   type="email"
//                   value={signatoryForm.email}
//                   onChange={(e) =>
//                     setSignatoryForm((p) => ({ ...p, email: e.target.value }))
//                   }
//                   placeholder="Email"
//                   className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
//                 />
//               </div>
//               <label className="flex items-center gap-2 text-[13px] text-slate-700">
//                 <input
//                   type="checkbox"
//                   checked={signatoryForm.is_default}
//                   onChange={(e) =>
//                     setSignatoryForm((p) => ({ ...p, is_default: e.target.checked }))
//                   }
//                   className="rounded border-slate-300 text-[#E42527]"
//                 />
//                 Default signatory
//               </label>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="h-10 w-full rounded-lg bg-[#E42527] text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
//               >
//                 {loading ? "Saving..." : "Add Signatory"}
//               </button>
//             </form>
//           </div>
//         )}
//       </div>

//       {/* Letter modal */}
//       {selectedLetter && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <p className="text-[11px] uppercase tracking-wider text-slate-400">Letter</p>
//                 <h3 className="text-[16px] font-semibold text-slate-900">
//                   {selectedLetter.letter_number || "—"}
//                 </h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedLetter(null)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="grid gap-3 p-5 sm:grid-cols-2">
//               {[
//                 ["Status", selectedLetter.status],
//                 ["Employee", selectedLetter.employee_name || "—"],
//                 ["Issue Date", formatDate(selectedLetter.issue_date)],
//                 ["Effective", formatDate(selectedLetter.effective_date)],
//               ].map(([l, v]) => (
//                 <div key={l} className="rounded-lg bg-[#f8fafc] px-3.5 py-2.5">
//                   <p className="text-[11px] text-slate-400">{l}</p>
//                   <p className="mt-0.5 text-[13px] font-medium capitalize text-slate-800">
//                     {v ?? "—"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => handleDownload(selectedLetter.letter_id)}
//                 className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition"
//               >
//                 Download / Print
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSelectedLetter(null)}
//                 className="h-9 rounded-lg bg-[#E42527] px-4 text-[13px] font-medium text-white hover:bg-[#c91f21] transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Template modal */}
//       {selectedTemplate && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h3 className="text-[16px] font-semibold text-slate-900">
//                 {selectedTemplate.name}
//               </h3>
//               <button
//                 type="button"
//                 onClick={() => setSelectedTemplate(null)}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="grid gap-3 p-5 sm:grid-cols-2">
//               {[
//                 ["Code", selectedTemplate.code],
//                 ["Version", selectedTemplate.version || 1],
//                 ["Approval", selectedTemplate.requires_approval ? "Yes" : "No"],
//                 ["E-Sign", selectedTemplate.requires_esign ? "Yes" : "No"],
//               ].map(([l, v]) => (
//                 <div key={l} className="rounded-lg bg-[#f8fafc] px-3.5 py-2.5">
//                   <p className="text-[11px] text-slate-400">{l}</p>
//                   <p className="mt-0.5 text-[13px] font-medium text-slate-800">{v}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end border-t border-slate-100 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => setSelectedTemplate(null)}
//                 className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ===================== CONSTANTS ===================== */
const STATUS_COLOR = {
  draft: "bg-slate-100 text-slate-600",
  pending_approval: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  sent: "bg-indigo-50 text-indigo-700",
  published: "bg-emerald-50 text-emerald-700",
  viewed: "bg-cyan-50 text-cyan-700",
  accepted: "bg-green-50 text-green-700",
  declined: "bg-red-50 text-red-700",
  signed: "bg-violet-50 text-violet-700",
  expired: "bg-orange-50 text-orange-700",
  cancelled: "bg-rose-50 text-rose-700",
  pending: "bg-amber-50 text-amber-700",
  generated: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

const EMPTY_CATEGORY = {
  code: "",
  name: "",
  description: "",
  number_prefix: "",
  display_order: 100,
  is_active: true,
};

const EMPTY_TEMPLATE = {
  category_id: "",
  name: "",
  code: "",
  description: "",
  content_html: "",
  requires_approval: false,
  requires_esign: false,
  allow_employee_request: false,
  password_protect_pdf: false,
  is_active: true,
};

const EMPTY_GENERATE = {
  template_id: "",
  issue_date: "",
  effective_date: "",
  signatory_id: "",
  publish_to_ess: true,
  send_email: false,
};

const EMPTY_SIGNATORY = {
  name: "",
  designation: "",
  department: "",
  email: "",
  is_default: false,
  is_active: true,
};

/* ===================== PROFESSIONAL SAMPLE TEMPLATES ===================== */
const SAMPLE_TEMPLATES = {
  EXPERIENCE: `<p style="margin-bottom:20px;"><strong>To Whom It May Concern,</strong></p>

<p style="text-align:justify; margin-bottom:16px;">
  This is to certify that <strong>{{employee.full_name}}</strong>
  (Employee Code: <strong>{{employee.employee_code}}</strong>)
  was employed with <strong>{{company.name}}</strong>
  in the capacity of <strong>{{employee.designation}}</strong>
  in the <strong>{{employee.department}}</strong> department
  from <strong>{{employee.joining_date}}</strong>
  to <strong>{{employee.leaving_date}}</strong>.
</p>

<p style="text-align:justify; margin-bottom:16px;">
  During the tenure of employment, {{employee.full_name}} discharged all assigned
  duties and responsibilities with sincerity, dedication and a high degree of
  professionalism. {{employee.full_name}} demonstrated a strong work ethic,
  reliability and the ability to work effectively both independently and as part
  of a team.
</p>

<p style="text-align:justify; margin-bottom:16px;">
  We found {{employee.full_name}} to be hardworking, competent and a valuable
  member of the organisation. We appreciate the contribution made during the
  period of association with us.
</p>

<p style="text-align:justify; margin-bottom:8px;">
  We wish {{employee.full_name}} every success in all future endeavours.
</p>`,

  RELIEVING: `<p style="margin-bottom:6px;">Dear <strong>{{employee.full_name}}</strong>,</p>

<p style="margin-bottom:16px;"><strong>Subject: Relieving Letter</strong></p>

<p style="text-align:justify; margin-bottom:16px;">
  This is to confirm that you have been relieved from your duties as
  <strong>{{employee.designation}}</strong> in the
  <strong>{{employee.department}}</strong> department of
  <strong>{{company.name}}</strong> with effect from
  <strong>{{employee.leaving_date}}</strong>.
</p>

<p style="text-align:justify; margin-bottom:16px;">
  You joined the organisation on <strong>{{employee.joining_date}}</strong>
  (Employee Code: <strong>{{employee.employee_code}}</strong>) and have
  completed all exit formalities to the satisfaction of the company.
  We acknowledge your contribution during your association with us.
</p>

<p style="text-align:justify; margin-bottom:8px;">
  We wish you success in your future career.
</p>`,

  BONAFIDE: `<p style="margin-bottom:20px;"><strong>To Whom It May Concern,</strong></p>

<p style="text-align:justify; margin-bottom:16px;">
  This is to certify that <strong>{{employee.full_name}}</strong>
  (Employee Code: <strong>{{employee.employee_code}}</strong>)
  is a bona fide employee of <strong>{{company.name}}</strong>
  and is currently working as <strong>{{employee.designation}}</strong>
  in the <strong>{{employee.department}}</strong> department
  since <strong>{{employee.joining_date}}</strong>.
</p>

<p style="text-align:justify; margin-bottom:8px;">
  This certificate is issued upon the request of the employee for official /
  personal purposes and is valid as on the date of issue.
</p>`,

  OFFER: `<p style="margin-bottom:6px;">Dear <strong>{{employee.full_name}}</strong>,</p>

<p style="margin-bottom:16px;"><strong>Subject: Offer of Employment - {{employee.designation}}</strong></p>

<p style="text-align:justify; margin-bottom:16px;">
  We are pleased to offer you the position of <strong>{{employee.designation}}</strong>
  in the <strong>{{employee.department}}</strong> department at
  <strong>{{company.name}}</strong>.
</p>

<p style="text-align:justify; margin-bottom:16px;">
  Your date of joining will be <strong>{{letter.effective_date}}</strong>.
  Detailed terms and conditions of employment, compensation structure and
  benefits will be shared separately / are enclosed as Annexure.
</p>

<p style="text-align:justify; margin-bottom:16px;">
  Please confirm your acceptance of this offer by signing and returning a copy
  of this letter on or before the stipulated date.
</p>

<p style="text-align:justify; margin-bottom:8px;">
  We look forward to welcoming you to the team.
</p>`,
};

/* ===================== HELPERS ===================== */
function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function pickList(res) {
  const body = res?.data ?? {};
  const list =
    body?.data ??
    body?.items ??
    body?.results ??
    body?.employees ??
    body?.departments ??
    body?.designations ??
    body?.templates ??
    body?.categories ??
    body?.letters ??
    body?.requests ??
    body?.signatories ??
    [];
  return Array.isArray(list) ? list : Array.isArray(body) ? body : [];
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

function empName(emp) {
  if (!emp) return "—";
  if (emp.full_name) return emp.full_name;
  const n = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
  return n || emp.employee_code || "—";
}

function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  const color = STATUS_COLOR[key] || "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${color}`}
    >
      {String(status || "—").replace(/_/g, " ")}
    </span>
  );
}

/* ===================== PAGE ===================== */
export default function HRLettersPage() {
  const [activeTab, setActiveTab] = useState("letters");

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [letters, setLetters] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [signatories, setSignatories] = useState([]);

  const [listLoading, setListLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
  const [templateForm, setTemplateForm] = useState(EMPTY_TEMPLATE);
  const [generateForm, setGenerateForm] = useState(EMPTY_GENERATE);
  const [signatoryForm, setSignatoryForm] = useState(EMPTY_SIGNATORY);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filterDept, setFilterDept] = useState("");
  const [filterDesig, setFilterDesig] = useState("");
  const [empSearch, setEmpSearch] = useState("");
  const [letterSearch, setLetterSearch] = useState("");

  /* ===================== FETCH ===================== */
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/employees", {
        params: { page: 1, page_size: 500 },
      });
      setEmployees(pickList(res));
    } catch {
      setEmployees([]);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/departments", {
        params: { page: 1, page_size: 200 },
      });
      setDepartments(pickList(res));
    } catch {
      setDepartments([]);
    }
  }, []);

  const fetchDesignations = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/designations", {
        params: { page: 1, page_size: 200 },
      });
      setDesignations(pickList(res));
    } catch {
      setDesignations([]);
    }
  }, []);

  const fetchLetters = useCallback(async () => {
    setListLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/get/generated/letters", {
        params: { page: 1, page_size: 100 },
      });
      setLetters(pickList(res));
    } catch (err) {
      setError(getErrorMessage(err));
      setLetters([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/templates", {
        params: { is_active: true, page: 1, page_size: 100 },
      });
      setTemplates(pickList(res));
    } catch {
      setTemplates([]);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/categories", {
        params: { is_active: true, page: 1, page_size: 100 },
      });
      setCategories(pickList(res));
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/requests", {
        params: { page: 1, page_size: 50 },
      });
      setRequests(pickList(res));
    } catch {
      setRequests([]);
    }
  }, []);

  const fetchSignatories = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/signatories", {
        params: { is_active: true, page: 1, page_size: 100 },
      });
      setSignatories(pickList(res));
    } catch {
      setSignatories([]);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
    fetchLetters();
    fetchTemplates();
    fetchCategories();
    fetchRequests();
    fetchSignatories();
  }, []);

  /* ===================== DERIVED ===================== */
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const deptId = emp.department_id || emp.department?.department_id || "";
      const desigId = emp.designation_id || emp.designation?.designation_id || "";
      const name = empName(emp).toLowerCase();
      const code = String(emp.employee_code || "").toLowerCase();
      const deptOk = !filterDept || deptId === filterDept;
      const desigOk = !filterDesig || desigId === filterDesig;
      const searchOk =
        !empSearch ||
        name.includes(empSearch.toLowerCase()) ||
        code.includes(empSearch.toLowerCase());
      return deptOk && desigOk && searchOk;
    });
  }, [employees, filterDept, filterDesig, empSearch]);

  const filteredLetters = useMemo(() => {
    if (!letterSearch.trim()) return letters;
    const q = letterSearch.toLowerCase();
    return letters.filter(
      (l) =>
        String(l.letter_number || "").toLowerCase().includes(q) ||
        String(l.employee_name || "").toLowerCase().includes(q) ||
        String(l.status || "").toLowerCase().includes(q)
    );
  }, [letters, letterSearch]);

  const stats = useMemo(
    () => ({
      letters: letters.length,
      templates: templates.length,
      categories: categories.length,
      pending: requests.filter((r) => String(r.status).toLowerCase() === "pending").length,
      signatories: signatories.length,
    }),
    [letters, templates, categories, requests, signatories]
  );

  /* ===================== HANDLERS ===================== */
  async function handleCreateCategory(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/create/letter/category", {
        ...categoryForm,
        code: categoryForm.code.toUpperCase(),
        number_prefix:
          categoryForm.number_prefix || categoryForm.code.toUpperCase().slice(0, 3),
      });
      setSuccess("Category created successfully");
      setCategoryForm(EMPTY_CATEGORY);
      await fetchCategories();
      setActiveTab("categories");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTemplate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/create/letter/template", {
        ...templateForm,
        code: templateForm.code.toUpperCase(),
      });
      setSuccess("Template created successfully");
      setTemplateForm(EMPTY_TEMPLATE);
      await fetchTemplates();
      setActiveTab("templates");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSignatory(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/create/letter/signatory", signatoryForm);
      setSuccess("Signatory added successfully");
      setSignatoryForm(EMPTY_SIGNATORY);
      await fetchSignatories();
      setActiveTab("signatories");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!generateForm.template_id) {
        setError("Please select a template");
        setLoading(false);
        return;
      }
      if (selectedEmployees.length === 0) {
        setError("Please select at least one employee");
        setLoading(false);
        return;
      }
      const res = await api.post("/api/v1/generate/letter", {
        template_id: generateForm.template_id,
        employee_ids: selectedEmployees,
        issue_date: generateForm.issue_date || null,
        effective_date: generateForm.effective_date || null,
        signatory_id: generateForm.signatory_id || null,
        publish_to_ess: generateForm.publish_to_ess,
        send_email: generateForm.send_email,
      });
      setSuccess(res?.data?.message || "Letter(s) generated successfully");
      setGenerateForm(EMPTY_GENERATE);
      setSelectedEmployees([]);
      setFilterDept("");
      setFilterDesig("");
      setEmpSearch("");
      await fetchLetters();
      setActiveTab("letters");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(letterId) {
    try {
      await api.post(`/api/v1/publish/letter/${letterId}`);
      setSuccess("Published to ESS");
      await fetchLetters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleSend(letterId) {
    try {
      await api.post(`/api/v1/send/letter/${letterId}`);
      setSuccess("Letter sent successfully");
      await fetchLetters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  /* ========== PROFESSIONAL DOWNLOAD / PRINT ========== */
  async function handleDownload(letterId) {
    try {
      setError("");
      const res = await api.get(`/api/v1/download/letter/${letterId}`, {
        params: { format: "pdf" },
      });
      const data = res?.data || {};

      if (data.download_url) {
        window.open(data.download_url, "_blank");
        return;
      }

      if (data.content_html) {
        const w = window.open("", "_blank");
        if (!w) {
          setError("Popup blocked. Please allow popups for this site.");
          return;
        }

        // content_html already contains full professional HTML (letterhead + body + signature + footer)
        // from backend _build_professional_html
        w.document.write(data.content_html);
        w.document.close();

        // Auto trigger print after short delay so styles load
        w.onload = function () {
          setTimeout(function () {
            w.focus();
            w.print();
          }, 400);
        };

        // Fallback if onload already fired
        setTimeout(function () {
          try {
            w.focus();
            w.print();
          } catch (e) {}
        }, 800);

        return;
      }

      setError(data.message || "Download not available. Please regenerate the letter.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleProcessRequest(requestId, action) {
    try {
      await api.post(`/api/v1/process/letter/request/${requestId}`, { action });
      setSuccess(`Request ${action}d successfully`);
      await fetchRequests();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function applySampleTemplate(key) {
    const html = SAMPLE_TEMPLATES[key];
    if (html) {
      setTemplateForm((p) => ({ ...p, content_html: html }));
    }
  }

  const tabs = [
    { id: "letters", label: "Letters", count: stats.letters },
    { id: "templates", label: "Templates", count: stats.templates },
    { id: "categories", label: "Categories", count: stats.categories },
    { id: "signatories", label: "Signatories", count: stats.signatories },
    { id: "requests", label: "Requests", count: stats.pending },
    { id: "generate", label: "Generate" },
    { id: "create-template", label: "+ Template" },
    { id: "create-signatory", label: "+ Signatory" },
  ];

  /* ===================== UI ===================== */
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f4f6f8]">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E42527]">
                HR Operations
              </p>
              <h1 className="mt-1 text-[22px] font-semibold text-slate-900 tracking-tight">
                HR Letters
              </h1>
              <p className="mt-0.5 text-[13px] text-slate-500">
                Generate, publish and manage employee letters (Professional format)
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("generate");
                  setError("");
                  setSuccess("");
                }}
                className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition"
              >
                Generate Letter
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("create-template");
                  setError("");
                  setSuccess("");
                }}
                className="h-9 rounded-lg bg-[#E42527] px-4 text-[13px] font-medium text-white shadow-sm hover:bg-[#c91f21] transition"
              >
                + Template
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "Letters", value: stats.letters },
              { label: "Templates", value: stats.templates },
              { label: "Categories", value: stats.categories },
              { label: "Pending", value: stats.pending },
              { label: "Signatories", value: stats.signatories },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
                <p className="mt-1 text-[22px] font-semibold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-5 flex flex-wrap gap-0.5 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setError("");
                  setSuccess("");
                }}
                className={`relative px-3.5 py-2.5 text-[13px] font-medium transition ${
                  activeTab === tab.id
                    ? "text-[#E42527]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
                {typeof tab.count === "number" && (
                  <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-medium text-slate-600">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#E42527]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
            {success}
          </div>
        )}

        {/* ===== LETTERS ===== */}
        {activeTab === "letters" && (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[14px] font-semibold text-slate-800">Generated Letters</h2>
                <p className="text-[12px] text-slate-500">{filteredLetters.length} shown</p>
              </div>
              <div className="flex gap-2">
                <input
                  value={letterSearch}
                  onChange={(e) => setLetterSearch(e.target.value)}
                  placeholder="Search letter or employee..."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10 sm:w-56"
                />
                <button
                  type="button"
                  onClick={fetchLetters}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Refresh
                </button>
              </div>
            </div>

            {listLoading ? (
              <div className="py-20 text-center text-[13px] text-slate-500">Loading letters...</div>
            ) : filteredLetters.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <p className="text-[14px] font-medium text-slate-700">No letters found</p>
                <p className="mt-1 text-[13px] text-slate-500">
                  Generate your first letter to get started
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("generate")}
                  className="mt-5 h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] transition"
                >
                  Generate Letter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fafbfc]">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Letter No.
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Employee
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Issue Date
                      </th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLetters.map((letter, idx) => (
                      <tr key={letter.letter_id || idx} className="hover:bg-[#f8fafc] transition">
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-800">
                            {letter.letter_number || "—"}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {letter.template_name || ""}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700">
                          {letter.employee_name || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={letter.status} />
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {formatDate(letter.issue_date)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedLetter(letter)}
                              className="rounded-md px-2.5 py-1 text-[12px] font-medium text-[#E42527] hover:bg-red-50 transition"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownload(letter.letter_id)}
                              className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
                            >
                              Download / Print
                            </button>
                            {String(letter.status).toLowerCase() !== "published" && (
                              <button
                                type="button"
                                onClick={() => handlePublish(letter.letter_id)}
                                className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
                              >
                                Publish
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSend(letter.letter_id)}
                              className="rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition"
                            >
                              Send
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== TEMPLATES ===== */}
        {activeTab === "templates" && (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-slate-800">Templates</h2>
              <button
                type="button"
                onClick={() => setActiveTab("create-template")}
                className="h-8 rounded-lg bg-[#E42527] px-3.5 text-[12px] font-medium text-white hover:bg-[#c91f21] transition"
              >
                + New
              </button>
            </div>
            {templates.length === 0 ? (
              <div className="px-6 py-20 text-center text-[13px] text-slate-500">
                No templates yet
              </div>
            ) : (
              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                  <button
                    key={t.template_id}
                    type="button"
                    onClick={() => setSelectedTemplate(t)}
                    className="rounded-xl border border-slate-200 bg-[#fafbfc] p-4 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-semibold text-slate-900">{t.name}</p>
                        <p className="mt-0.5 text-[12px] text-slate-500">{t.code}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        v{t.version || 1}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.requires_approval && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                          Approval
                        </span>
                      )}
                      {t.requires_esign && (
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">
                          E-Sign
                        </span>
                      )}
                      {t.allow_employee_request && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
                          Self Request
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CATEGORIES ===== */}
        {activeTab === "categories" && (
          <div className="grid gap-5 lg:grid-cols-5">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:col-span-3">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-[14px] font-semibold text-slate-800">Categories</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {categories.length === 0 ? (
                  <div className="px-5 py-12 text-center text-[13px] text-slate-500">
                    No categories
                  </div>
                ) : (
                  categories.map((c) => (
                    <div
                      key={c.category_id}
                      className="flex items-center justify-between px-5 py-3.5"
                    >
                      <div>
                        <div className="text-[13px] font-medium text-slate-800">{c.name}</div>
                        <div className="text-[12px] text-slate-400 mt-0.5">
                          {c.code} · Prefix {c.number_prefix || "—"}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:col-span-2">
              <h3 className="text-[14px] font-semibold text-slate-800">Add Category</h3>
              <form onSubmit={handleCreateCategory} className="mt-4 space-y-3">
                <input
                  required
                  value={categoryForm.code}
                  onChange={(e) =>
                    setCategoryForm((p) => ({
                      ...p,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Code e.g. EXPERIENCE"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                />
                <input
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Name"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                />
                <input
                  value={categoryForm.number_prefix}
                  onChange={(e) =>
                    setCategoryForm((p) => ({
                      ...p,
                      number_prefix: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Prefix e.g. EXP"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 w-full rounded-lg bg-[#E42527] text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
                >
                  {loading ? "Saving..." : "Create Category"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===== SIGNATORIES ===== */}
        {activeTab === "signatories" && (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-slate-800">Signatories</h2>
              <button
                type="button"
                onClick={() => setActiveTab("create-signatory")}
                className="h-8 rounded-lg bg-[#E42527] px-3.5 text-[12px] font-medium text-white hover:bg-[#c91f21] transition"
              >
                + Add
              </button>
            </div>
            {signatories.length === 0 ? (
              <div className="px-6 py-20 text-center text-[13px] text-slate-500">
                No signatories
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {signatories.map((s) => (
                  <div
                    key={s.signatory_id}
                    className="flex items-center justify-between px-5 py-3.5"
                  >
                    <div>
                      <div className="text-[13px] font-medium text-slate-800">{s.name}</div>
                      <div className="text-[12px] text-slate-400 mt-0.5">
                        {s.designation}
                        {s.department ? ` · ${s.department}` : ""}
                      </div>
                    </div>
                    {s.is_default && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== REQUESTS ===== */}
        {activeTab === "requests" && (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-slate-800">Employee Requests</h2>
            </div>
            {requests.length === 0 ? (
              <div className="px-6 py-20 text-center text-[13px] text-slate-500">No requests</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fafbfc]">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Employee
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Purpose
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {requests.map((r, idx) => (
                      <tr key={r.request_id || idx} className="hover:bg-[#f8fafc]">
                        <td className="px-5 py-3.5">{r.employee_name || "—"}</td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {r.purpose || r.reason || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {String(r.status).toLowerCase() === "pending" && (
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => handleProcessRequest(r.request_id, "approve")}
                                className="text-[12px] font-medium text-emerald-600 hover:underline"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleProcessRequest(r.request_id, "reject")}
                                className="text-[12px] font-medium text-red-600 hover:underline"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== GENERATE ===== */}
        {activeTab === "generate" && (
          <div className="mx-auto max-w-2xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-[17px] font-semibold text-slate-900">Generate Letter</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Select template and employees. Letter will be generated in professional format.
            </p>

            <form onSubmit={handleGenerate} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Template *
                </label>
                <select
                  required
                  value={generateForm.template_id}
                  onChange={(e) =>
                    setGenerateForm((p) => ({ ...p, template_id: e.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                >
                  <option value="">Select template</option>
                  {templates.map((t) => (
                    <option key={t.template_id} value={t.template_id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                    Department
                  </label>
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                  >
                    <option value="">All</option>
                    {departments.map((d) => (
                      <option key={d.department_id || d.id} value={d.department_id || d.id}>
                        {d.department_name || d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                    Designation
                  </label>
                  <select
                    value={filterDesig}
                    onChange={(e) => setFilterDesig(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                  >
                    <option value="">All</option>
                    {designations.map((d) => (
                      <option key={d.designation_id || d.id} value={d.designation_id || d.id}>
                        {d.job_title || d.designation_name || d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                placeholder="Search employee name or code..."
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
              />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[13px] font-medium text-slate-700">
                    Employees * ({selectedEmployees.length})
                  </label>
                  {selectedEmployees.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedEmployees([])}
                      className="text-[12px] font-medium text-[#E42527] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200">
                  {filteredEmployees.length === 0 ? (
                    <div className="px-4 py-8 text-center text-[13px] text-slate-500">
                      No employees found
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const id = emp.employee_id || emp.id;
                      const checked = selectedEmployees.includes(id);
                      return (
                        <label
                          key={id}
                          className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-4 py-2.5 hover:bg-slate-50 last:border-0"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedEmployees((prev) =>
                                checked ? prev.filter((x) => x !== id) : [...prev, id]
                              )
                            }
                            className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-slate-800">
                              {empName(emp)}
                            </p>
                            <p className="truncate text-[11px] text-slate-400">
                              {emp.employee_code || ""}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={generateForm.issue_date}
                    onChange={(e) =>
                      setGenerateForm((p) => ({ ...p, issue_date: e.target.value }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={generateForm.effective_date}
                    onChange={(e) =>
                      setGenerateForm((p) => ({
                        ...p,
                        effective_date: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                  Signatory
                </label>
                <select
                  value={generateForm.signatory_id}
                  onChange={(e) =>
                    setGenerateForm((p) => ({ ...p, signatory_id: e.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                >
                  <option value="">Optional</option>
                  {signatories.map((s) => (
                    <option key={s.signatory_id} value={s.signatory_id}>
                      {s.name} — {s.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-6 rounded-lg border border-slate-200 bg-[#fafbfc] px-4 py-3">
                <label className="flex items-center gap-2 text-[13px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={generateForm.publish_to_ess}
                    onChange={(e) =>
                      setGenerateForm((p) => ({
                        ...p,
                        publish_to_ess: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-[#E42527]"
                  />
                  Publish to ESS
                </label>
                <label className="flex items-center gap-2 text-[13px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={generateForm.send_email}
                    onChange={(e) =>
                      setGenerateForm((p) => ({
                        ...p,
                        send_email: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-[#E42527]"
                  />
                  Send Email
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setGenerateForm(EMPTY_GENERATE);
                    setSelectedEmployees([]);
                    setFilterDept("");
                    setFilterDesig("");
                    setEmpSearch("");
                  }}
                  className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading || selectedEmployees.length === 0}
                  className="h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
                >
                  {loading ? "Generating..." : `Generate (${selectedEmployees.length})`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===== CREATE TEMPLATE ===== */}
        {activeTab === "create-template" && (
          <div className="mx-auto max-w-2xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-[17px] font-semibold text-slate-900">Create Template</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Use placeholders: {"{{employee.full_name}}"}, {"{{company.name}}"},{" "}
              {"{{letter.number}}"}, {"{{signatory.name}}"} etc. Backend will add professional
              letterhead automatically.
            </p>

            {/* Sample template buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[12px] text-slate-500 self-center">Quick samples:</span>
              {[
                ["EXPERIENCE", "Experience"],
                ["RELIEVING", "Relieving"],
                ["BONAFIDE", "Bonafide"],
                ["OFFER", "Offer"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applySampleTemplate(key)}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateTemplate} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  required
                  value={templateForm.category_id}
                  onChange={(e) =>
                    setTemplateForm((p) => ({ ...p, category_id: e.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                >
                  <option value="">Category *</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  required
                  value={templateForm.code}
                  onChange={(e) =>
                    setTemplateForm((p) => ({
                      ...p,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Code *"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                />
              </div>
              <input
                required
                value={templateForm.name}
                onChange={(e) =>
                  setTemplateForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Template name *"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
              />
              <textarea
                rows={12}
                value={templateForm.content_html}
                onChange={(e) =>
                  setTemplateForm((p) => ({ ...p, content_html: e.target.value }))
                }
                placeholder="Paste body HTML here (or use Quick samples above)..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10 font-mono"
              />
              <div className="flex flex-wrap gap-5 rounded-lg border border-slate-200 bg-[#fafbfc] px-4 py-3">
                {[
                  ["requires_approval", "Approval"],
                  ["requires_esign", "E-Sign"],
                  ["allow_employee_request", "Self Request"],
                  ["password_protect_pdf", "Password PDF"],
                ].map(([k, label]) => (
                  <label key={k} className="flex items-center gap-2 text-[13px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={templateForm[k]}
                      onChange={(e) =>
                        setTemplateForm((p) => ({ ...p, [k]: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-[#E42527]"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 rounded-lg bg-[#E42527] px-5 text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
                >
                  {loading ? "Saving..." : "Create Template"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===== CREATE SIGNATORY ===== */}
        {activeTab === "create-signatory" && (
          <div className="mx-auto max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-[17px] font-semibold text-slate-900">Add Signatory</h2>
            <form onSubmit={handleCreateSignatory} className="mt-6 space-y-4">
              <input
                required
                value={signatoryForm.name}
                onChange={(e) =>
                  setSignatoryForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Name *"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
              />
              <input
                required
                value={signatoryForm.designation}
                onChange={(e) =>
                  setSignatoryForm((p) => ({ ...p, designation: e.target.value }))
                }
                placeholder="Designation *"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={signatoryForm.department}
                  onChange={(e) =>
                    setSignatoryForm((p) => ({ ...p, department: e.target.value }))
                  }
                  placeholder="Department"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                />
                <input
                  type="email"
                  value={signatoryForm.email}
                  onChange={(e) =>
                    setSignatoryForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/10"
                />
              </div>
              <label className="flex items-center gap-2 text-[13px] text-slate-700">
                <input
                  type="checkbox"
                  checked={signatoryForm.is_default}
                  onChange={(e) =>
                    setSignatoryForm((p) => ({ ...p, is_default: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-[#E42527]"
                />
                Default signatory
              </label>
              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-lg bg-[#E42527] text-[13px] font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 transition"
              >
                {loading ? "Saving..." : "Add Signatory"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Letter modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Letter</p>
                <h3 className="text-[16px] font-semibold text-slate-900">
                  {selectedLetter.letter_number || "—"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {[
                ["Status", selectedLetter.status],
                ["Employee", selectedLetter.employee_name || "—"],
                ["Issue Date", formatDate(selectedLetter.issue_date)],
                ["Effective", formatDate(selectedLetter.effective_date)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-[#f8fafc] px-3.5 py-2.5">
                  <p className="text-[11px] text-slate-400">{l}</p>
                  <p className="mt-0.5 text-[13px] font-medium capitalize text-slate-800">
                    {v ?? "—"}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => handleDownload(selectedLetter.letter_id)}
                className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Download / Print
              </button>
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="h-9 rounded-lg bg-[#E42527] px-4 text-[13px] font-medium text-white hover:bg-[#c91f21] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[16px] font-semibold text-slate-900">
                {selectedTemplate.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {[
                ["Code", selectedTemplate.code],
                ["Version", selectedTemplate.version || 1],
                ["Approval", selectedTemplate.requires_approval ? "Yes" : "No"],
                ["E-Sign", selectedTemplate.requires_esign ? "Yes" : "No"],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-[#f8fafc] px-3.5 py-2.5">
                  <p className="text-[11px] text-slate-400">{l}</p>
                  <p className="mt-0.5 text-[13px] font-medium text-slate-800">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}