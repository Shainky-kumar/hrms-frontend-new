// // "use client";

// // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import { toast } from "sonner";
// // import {
// //   Megaphone, Plus, Search, Pencil, Trash2, Pin, PinOff, Loader2, X,
// //   AlertTriangle, CheckCircle2, Bell, Filter, ChevronLeft, ChevronRight,
// //   Save, Eye, Send, Users, Building2, MapPin, Shield, UserCheck2,
// //   Calendar, Clock, Bold, Italic, Underline, List, ListOrdered,
// //   Link2, Paperclip, BarChart3, Check, CircleDot, FileText, Globe2,
// //   SendHorizontal, Inbox, Star, TrendingUp, Target, Ban,
// // } from "lucide-react";
// // import { api } from "@/app/lib/api";
// // import { useAuthStore } from "@/app/store/authStore";

// // /* ═══════════════════════════════════════════════════════
// //    CONSTANTS
// //    ═══════════════════════════════════════════════════════ */

// // const PRIORITIES = [
// //   { value: "low", label: "Low", tone: "bg-slate-100 text-slate-600 ring-slate-200" },
// //   { value: "normal", label: "Normal", tone: "bg-sky-100 text-sky-700 ring-sky-200" },
// //   { value: "high", label: "High", tone: "bg-amber-100 text-amber-700 ring-amber-200" },
// //   { value: "urgent", label: "Urgent", tone: "bg-red-100 text-red-700 ring-red-200" },
// // ];

// // const CATEGORIES = [
// //   { value: "general", label: "General", icon: FileText },
// //   { value: "hr", label: "HR", icon: Users },
// //   { value: "policy", label: "Policy", icon: Shield },
// //   { value: "event", label: "Event", icon: Calendar },
// //   { value: "holiday", label: "Holiday", icon: Globe2 },
// //   { value: "urgent", label: "Urgent", icon: AlertTriangle },
// //   { value: "achievement", label: "Achievement", icon: Star },
// // ];

// // const AUDIENCE_TYPES = [
// //   { value: "all", label: "Everyone", icon: Users, desc: "All active employees" },
// //   { value: "departments", label: "Departments", icon: Building2, desc: "Selected departments" },
// //   { value: "locations", label: "Locations", icon: MapPin, desc: "Selected locations" },
// //   { value: "roles", label: "Roles", icon: Shield, desc: "Specific roles" },
// //   { value: "specific", label: "Specific employees", icon: UserCheck2, desc: "Hand-picked people" },
// // ];

// // const STATUSES = [
// //   { value: "draft", label: "Draft", tone: "bg-slate-100 text-slate-600 ring-slate-200" },
// //   { value: "scheduled", label: "Scheduled", tone: "bg-violet-100 text-violet-700 ring-violet-200" },
// //   { value: "published", label: "Published", tone: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
// //   { value: "expired", label: "Expired", tone: "bg-red-100 text-red-700 ring-red-200" },
// // ];

// // /* ═══════════════════════════════════════════════════════
// //    HELPERS
// //    ═══════════════════════════════════════════════════════ */

// // function fmtDate(v) {
// //   if (!v) return "—";
// //   try {
// //     return new Date(v).toLocaleString("en-IN", {
// //       day: "2-digit", month: "short", year: "numeric",
// //       hour: "2-digit", minute: "2-digit",
// //     });
// //   } catch {
// //     return "—";
// //   }
// // }

// // function timeAgo(v) {
// //   if (!v) return "";
// //   const diff = Math.floor((Date.now() - new Date(v).getTime()) / 1000);
// //   if (diff < 60) return "just now";
// //   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
// //   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
// //   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
// //   return fmtDate(v).split(",")[0];
// // }

// // function priorityTone(p) {
// //   return PRIORITIES.find((x) => x.value === p)?.tone || PRIORITIES[1].tone;
// // }

// // function statusTone(s) {
// //   return STATUSES.find((x) => x.value === s)?.tone || STATUSES[0].tone;
// // }

// // function categoryIcon(c) {
// //   const Icon = CATEGORIES.find((x) => x.value === c)?.icon || FileText;
// //   return Icon;
// // }

// // function stripHtml(html) {
// //   if (!html) return "";
// //   return String(html).replace(/<[^>]*>/g, "").trim();
// // }

// // /* ═══════════════════════════════════════════════════════
// //    RICH TEXT EDITOR (contentEditable — no lib)
// //    ═══════════════════════════════════════════════════════ */

// // function RichEditor({ value, onChange, placeholder }) {
// //   const ref = useRef(null);
// //   const [focused, setFocused] = useState(false);

// //   useEffect(() => {
// //     if (ref.current && ref.current.innerHTML !== value) {
// //       ref.current.innerHTML = value || "";
// //     }
// //   }, [value]);

// //   const exec = (cmd, arg) => {
// //     ref.current?.focus();
// //     document.execCommand(cmd, false, arg);
// //     if (ref.current) onChange(ref.current.innerHTML);
// //   };

// //   const tools = [
// //     { icon: Bold, cmd: "bold", title: "Bold (Ctrl+B)" },
// //     { icon: Italic, cmd: "italic", title: "Italic (Ctrl+I)" },
// //     { icon: Underline, cmd: "underline", title: "Underline (Ctrl+U)" },
// //     { icon: List, cmd: "insertUnorderedList", title: "Bullet list" },
// //     { icon: ListOrdered, cmd: "insertOrderedList", title: "Numbered list" },
// //   ];

// //   return (
// //     <div
// //       className={`rounded-xl border transition ${
// //         focused ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200"
// //       } bg-white`}
// //     >
// //       <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/60 px-2 py-1.5">
// //         {tools.map((t) => (
// //           <button
// //             key={t.cmd}
// //             type="button"
// //             onClick={() => exec(t.cmd)}
// //             title={t.title}
// //             className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
// //           >
// //             <t.icon className="h-3.5 w-3.5" />
// //           </button>
// //         ))}
// //         <div className="mx-1 h-4 w-px bg-slate-200" />
// //         <button
// //           type="button"
// //           onClick={() => {
// //             const url = window.prompt("Enter URL");
// //             if (url) exec("createLink", url);
// //           }}
// //           className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
// //           title="Insert link"
// //         >
// //           <Link2 className="h-3.5 w-3.5" />
// //         </button>
// //         <button
// //           type="button"
// //           onClick={() => exec("removeFormat")}
// //           className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
// //           title="Clear formatting"
// //         >
// //           <Ban className="h-3.5 w-3.5" />
// //         </button>
// //       </div>

// //       <div
// //         ref={ref}
// //         contentEditable
// //         suppressContentEditableWarning
// //         onFocus={() => setFocused(true)}
// //         onBlur={() => setFocused(false)}
// //         onInput={(e) => onChange(e.currentTarget.innerHTML)}
// //         data-placeholder={placeholder}
// //         className="prose prose-sm max-w-none px-4 py-3 text-sm text-slate-800 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
// //         style={{ minHeight: 140 }}
// //       />
// //     </div>
// //   );
// // }

// // /* ═══════════════════════════════════════════════════════
// //    AUDIENCE PICKER
// //    ═══════════════════════════════════════════════════════ */

// // function AudiencePicker({ form, setForm, departments, locations, roles, employees }) {
// //   const type = form.audience_type;
// //   const selectedIds =
// //     type === "departments" ? form.target_department_ids
// //     : type === "locations" ? form.target_location_ids
// //     : type === "roles" ? form.target_role_ids
// //     : type === "specific" ? form.target_employee_ids
// //     : [];

// //   const options =
// //     type === "departments" ? departments
// //     : type === "locations" ? locations
// //     : type === "roles" ? roles.map((r) => ({ id: r, name: r }))
// //     : type === "specific" ? employees
// //     : [];

// //   const fieldKey =
// //     type === "departments" ? "target_department_ids"
// //     : type === "locations" ? "target_location_ids"
// //     : type === "roles" ? "target_role_ids"
// //     : "target_employee_ids";

// //   const toggle = (id) => {
// //     if (!id) return;
// //     const cur = selectedIds || [];
// //     const next = cur.includes(id)
// //       ? cur.filter((x) => x !== id)
// //       : [...cur, id];
// //     setForm({ ...form, [fieldKey]: next });
// //   };

// //   return (
// //     <div className="space-y-3">
// //       <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
// //         {AUDIENCE_TYPES.map((a) => {
// //           const Icon = a.icon;
// //           const active = type === a.value;
// //           return (
// //             <button
// //               key={a.value}
// //               type="button"
// //               onClick={() =>
// //                 setForm({
// //                   ...form,
// //                   audience_type: a.value,
// //                   target_department_ids: [],
// //                   target_location_ids: [],
// //                   target_role_ids: [],
// //                   target_employee_ids: [],
// //                 })
// //               }
// //               className={`group flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
// //                 active
// //                   ? "border-[#E42527] bg-red-50/60 ring-2 ring-[#E42527]/20"
// //                   : "border-slate-200 bg-white hover:border-slate-300"
// //               }`}
// //             >
// //               <div
// //                 className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
// //                   active
// //                     ? "bg-[#E42527] text-white"
// //                     : "bg-slate-100 text-slate-500"
// //                 }`}
// //               >
// //                 <Icon className="h-4 w-4" />
// //               </div>
// //               <div className="min-w-0">
// //                 <p className="text-xs font-bold text-slate-900">{a.label}</p>
// //                 <p className="mt-0.5 text-[10px] text-slate-500">{a.desc}</p>
// //               </div>
// //             </button>
// //           );
// //         })}
// //       </div>

// //       {type !== "all" && (
// //         <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
// //           <div className="mb-2 flex items-center justify-between">
// //             <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
// //               Select {type === "specific" ? "employees" : type}
// //             </p>
// //             <p className="text-[11px] font-bold text-slate-700">
// //               {selectedIds?.length || 0} selected
// //             </p>
// //           </div>

// //           {options.length === 0 ? (
// //             <p className="py-2 text-center text-xs text-slate-400">
// //               No options available
// //             </p>
// //           ) : (
// //             <div className="max-h-48 overflow-y-auto">
// //               <div className="flex flex-wrap gap-1.5">
// //                 {options.slice(0, 100).map((o) => {
// //                   const id = o.id || o.employee_id || o.department_id || o.location_id;
// //                   const name = o.name || o.department_name || o.location_name || o.employee_name || id;
// //                   const active = selectedIds?.includes(id);
// //                   return (
// //                     <button
// //                       key={id}
// //                       type="button"
// //                       onClick={() => toggle(id)}
// //                       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
// //                         active
// //                           ? "bg-[#E42527] text-white shadow-sm"
// //                           : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
// //                       }`}
// //                     >
// //                       {active && <Check className="h-3 w-3" />}
// //                       {name}
// //                     </button>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /* ═══════════════════════════════════════════════════════
// //    MAIN PAGE
// //    ═══════════════════════════════════════════════════════ */

// // export default function AnnouncementsPage() {
// //   const user = useAuthStore((s) => s.user);
// //   const role = String(user?.role?.value || user?.role || "").toLowerCase();
// //   const isAdmin = role === "admin" || role.endsWith("admin");

// //   const [items, setItems] = useState([]);
// //   const [analytics, setAnalytics] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");

// //   // filters
// //   const [page, setPage] = useState(1);
// //   const [pageSize] = useState(10);
// //   const [total, setTotal] = useState(0);
// //   const [search, setSearch] = useState("");
// //   const [filterPriority, setFilterPriority] = useState("");
// //   const [filterCategory, setFilterCategory] = useState("");
// //   const [filterStatus, setFilterStatus] = useState("");
// //   const [onlyUnread, setOnlyUnread] = useState(false);

// //   // modals
// //   const [composeModal, setComposeModal] = useState(null); // null | "create" | "edit"
// //   const [editing, setEditing] = useState(null);
// //   const [viewModal, setViewModal] = useState(null); // announcement object
// //   const [deleteId, setDeleteId] = useState(null);
// //   const [receiptsModal, setReceiptsModal] = useState(null); // { announcement, data }
// //   const [receiptsLoading, setReceiptsLoading] = useState(false);

// //   // reference data
// //   const [departments, setDepartments] = useState([]);
// //   const [locations, setLocations] = useState([]);
// //   const [employees, setEmployees] = useState([]);

// //   // form
// //   const [form, setForm] = useState({
// //     title: "",
// //     body: "",
// //     summary: "",
// //     priority: "normal",
// //     category: "general",
// //     audience_type: "all",
// //     target_department_ids: [],
// //     target_location_ids: [],
// //     target_role_ids: [],
// //     target_employee_ids: [],
// //     attachments: [],
// //     scheduled_at: "",
// //     expires_at: "",
// //     is_pinned: false,
// //     send_email: false,
// //   });

// //   const attachmentInput = useRef("");

// //   /* ─────────────── FETCH LIST ─────────────── */
// //   const fetchItems = useCallback(async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const params = {
// //         page,
// //         page_size: pageSize,
// //         include_expired: true,
// //       };
// //       if (search.trim()) params.search = search.trim();
// //       if (filterPriority) params.priority = filterPriority;
// //       if (filterCategory) params.category = filterCategory;
// //       if (filterStatus && isAdmin) params.status = filterStatus;
// //       if (onlyUnread) params.only_unread = true;

// //       const res = await api.get("/api/v1/announcements", { params });
// //       const d = res?.data || res;
// //       setItems(Array.isArray(d?.announcements) ? d.announcements : []);
// //       setTotal(d?.total || 0);
// //     } catch (err) {
// //       setError(err?.response?.data?.detail || "Failed to load announcements");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [page, pageSize, search, filterPriority, filterCategory, filterStatus, onlyUnread, isAdmin]);

// //   /* ─────────────── FETCH REFERENCE ─────────────── */
// //   const fetchReference = useCallback(async () => {
// //     if (!isAdmin) return;
// //     try {
// //       const [dRes, lRes, eRes] = await Promise.allSettled([
// //         api.get("/api/v1/get/departments"),
// //         api.get("/api/v1/get/location/master"),
// //         api.get("/api/v1/get/employees"),
// //       ]);

// //       if (dRes.status === "fulfilled") {
// //         const d = dRes.value?.data || dRes.value;
// //         setDepartments(
// //           (d?.departments || []).map((x) => ({
// //             id: x.department_id,
// //             name: x.department_name,
// //           }))
// //         );
// //       }
// //       if (lRes.status === "fulfilled") {
// //         const l = lRes.value?.data || lRes.value;
// //         setLocations(
// //           (l?.locations || []).map((x) => ({
// //             id: x.location_id,
// //             name: x.location_name,
// //           }))
// //         );
// //       }
// //       if (eRes.status === "fulfilled") {
// //         const e = eRes.value?.data || eRes.value;
// //         setEmployees(
// //           (e?.employees || []).map((x) => ({
// //             id: x.employee_id,
// //             name: x.name || x.employee_id,
// //           }))
// //         );
// //       }
// //     } catch {}
// //   }, [isAdmin]);

// //   /* ─────────────── FETCH ANALYTICS ─────────────── */
// //   const fetchAnalytics = useCallback(async () => {
// //     if (!isAdmin) return;
// //     try {
// //       const res = await api.get("/api/v1/announcements/analytics");
// //       setAnalytics(res?.data || res);
// //     } catch {}
// //   }, [isAdmin]);

// //   useEffect(() => {
// //     const t = setTimeout(() => fetchItems(), 300);
// //     return () => clearTimeout(t);
// //   }, [fetchItems]);

// //   useEffect(() => {
// //     fetchReference();
// //     fetchAnalytics();
// //   }, [fetchReference, fetchAnalytics]);

// //   const roles = useMemo(() => {
// //     const set = new Set();
// //     employees.forEach(() => {});
// //     return [
// //       "admin", "hr", "manager", "team_lead", "employee", "intern", "contractor",
// //     ];
// //   }, [employees]);

// //   /* ─────────────── ACTIONS ─────────────── */
// //   const resetForm = () => {
// //     setForm({
// //       title: "",
// //       body: "",
// //       summary: "",
// //       priority: "normal",
// //       category: "general",
// //       audience_type: "all",
// //       target_department_ids: [],
// //       target_location_ids: [],
// //       target_role_ids: [],
// //       target_employee_ids: [],
// //       attachments: [],
// //       scheduled_at: "",
// //       expires_at: "",
// //       is_pinned: false,
// //       send_email: false,
// //     });
// //   };

// //   const openCreate = () => {
// //     resetForm();
// //     setEditing(null);
// //     setComposeModal("create");
// //   };

// //   const openEdit = (a) => {
// //     setForm({
// //       title: a.title || "",
// //       body: a.body || "",
// //       summary: a.summary || "",
// //       priority: a.priority || "normal",
// //       category: a.category || "general",
// //       audience_type: a.audience_type || "all",
// //       target_department_ids: a.target_department_ids || [],
// //       target_location_ids: a.target_location_ids || [],
// //       target_role_ids: a.target_role_ids || [],
// //       target_employee_ids: a.target_employee_ids || [],
// //       attachments: a.attachments || [],
// //       scheduled_at: a.scheduled_at ? a.scheduled_at.slice(0, 16) : "",
// //       expires_at: a.expires_at ? a.expires_at.slice(0, 16) : "",
// //       is_pinned: !!a.is_pinned,
// //       send_email: !!a.send_email,
// //     });
// //     setEditing(a);
// //     setComposeModal("edit");
// //   };

// //   const handleSave = async (asDraft = false) => {
// //     if (!form.title.trim() || !stripHtml(form.body).trim()) {
// //       toast.error("Title and message are required");
// //       return;
// //     }
// //     if (form.audience_type !== "all") {
// //       const key =
// //         form.audience_type === "departments" ? "target_department_ids"
// //         : form.audience_type === "locations" ? "target_location_ids"
// //         : form.audience_type === "roles" ? "target_role_ids"
// //         : "target_employee_ids";
// //       if (!form[key] || form[key].length === 0) {
// //         toast.error("Please select at least one audience member");
// //         return;
// //       }
// //     }

// //     setSaving(true);
// //     try {
// //       const payload = {
// //         title: form.title.trim(),
// //         body: form.body,
// //         summary: form.summary.trim() || stripHtml(form.body).slice(0, 200),
// //         priority: form.priority,
// //         category: form.category,
// //         audience_type: form.audience_type,
// //         target_department_ids: form.target_department_ids,
// //         target_location_ids: form.target_location_ids,
// //         target_role_ids: form.target_role_ids,
// //         target_employee_ids: form.target_employee_ids,
// //         attachments: form.attachments,
// //         scheduled_at: form.scheduled_at
// //           ? new Date(form.scheduled_at).toISOString()
// //           : null,
// //         expires_at: form.expires_at
// //           ? new Date(form.expires_at).toISOString()
// //           : null,
// //         is_pinned: form.is_pinned,
// //         send_email: form.send_email,
// //         save_as_draft: asDraft,
// //       };

// //       if (composeModal === "create") {
// //         await api.post("/api/v1/announcements", payload);
// //         toast.success(asDraft ? "Saved as draft" : "Published!");
// //       } else {
// //         await api.put(
// //           `/api/v1/announcements/${editing.announcement_id}`,
// //           payload
// //         );
// //         toast.success("Updated!");
// //       }
// //       setComposeModal(null);
// //       fetchItems();
// //       fetchAnalytics();
// //     } catch (err) {
// //       toast.error(err?.response?.data?.detail || "Save failed");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!deleteId) return;
// //     try {
// //       await api.delete(`/api/v1/announcements/${deleteId}`);
// //       toast.success("Deleted");
// //       setDeleteId(null);
// //       fetchItems();
// //       fetchAnalytics();
// //     } catch (err) {
// //       toast.error("Delete failed");
// //     }
// //   };

// //   const handleTogglePin = async (a) => {
// //     try {
// //       await api.post(`/api/v1/announcements/${a.announcement_id}/toggle-pin`);
// //       fetchItems();
// //     } catch {
// //       toast.error("Pin toggle failed");
// //     }
// //   };

// //   const handlePublish = async (a) => {
// //     try {
// //       await api.post(`/api/v1/announcements/${a.announcement_id}/publish`);
// //       toast.success("Published!");
// //       fetchItems();
// //       fetchAnalytics();
// //     } catch {
// //       toast.error("Publish failed");
// //     }
// //   };

// //   const openView = async (a) => {
// //     setViewModal(a);
// //     // mark as read
// //     try {
// //       await api.post(`/api/v1/announcements/${a.announcement_id}/read`);
// //     } catch {}
// //   };

// //   const openReceipts = async (a) => {
// //     setReceiptsLoading(true);
// //     setReceiptsModal({ announcement: a, data: null });
// //     try {
// //       const res = await api.get(`/api/v1/announcements/${a.announcement_id}/reads`);
// //       setReceiptsModal({ announcement: a, data: res?.data || res });
// //     } catch {
// //       toast.error("Failed to load receipts");
// //       setReceiptsModal(null);
// //     } finally {
// //       setReceiptsLoading(false);
// //     }
// //   };

// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// //   const audienceSummary = (a) => {
// //     const t = a.audience_type;
// //     if (t === "all") return "Everyone";
// //     if (t === "departments")
// //       return `${(a.target_department_ids || []).length} department(s)`;
// //     if (t === "locations")
// //       return `${(a.target_location_ids || []).length} location(s)`;
// //     if (t === "roles")
// //       return `${(a.target_role_ids || []).length} role(s)`;
// //     if (t === "specific")
// //       return `${(a.target_employee_ids || []).length} employee(s)`;
// //     return "—";
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
// //       <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
// //         {/* HEADER */}
// //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-200">
// //               <Megaphone className="h-6 w-6" />
// //             </div>
// //             <div>
// //               <h1 className="text-2xl font-black tracking-tight text-slate-900">
// //                 Announcements
// //               </h1>
// //               <p className="text-xs font-medium text-slate-500">
// //                 {isAdmin
// //                   ? "Broadcast updates, target teams, track reads"
// //                   : "Company updates & notices"}
// //               </p>
// //             </div>
// //           </div>

// //           {isAdmin && (
// //             <button
// //               onClick={openCreate}
// //               className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E42527] px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg hover:bg-[#c91f21]"
// //             >
// //               <Plus className="h-4 w-4" />
// //               New announcement
// //             </button>
// //           )}
// //         </div>

// //         {/* ANALYTICS */}
// //         {isAdmin && analytics && (
// //           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
// //             <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
// //               <div className="flex items-center gap-2">
// //                 <Inbox className="h-3.5 w-3.5 text-slate-400" />
// //                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                   Total
// //                 </p>
// //               </div>
// //               <p className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
// //                 {analytics.total}
// //               </p>
// //             </div>
// //             <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
// //               <div className="flex items-center gap-2">
// //                 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
// //                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
// //                   Published
// //                 </p>
// //               </div>
// //               <p className="mt-1.5 text-2xl font-black text-emerald-700 tabular-nums">
// //                 {analytics.published}
// //               </p>
// //             </div>
// //             <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
// //               <div className="flex items-center gap-2">
// //                 <FileText className="h-3.5 w-3.5 text-slate-400" />
// //                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                   Drafts
// //                 </p>
// //               </div>
// //               <p className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
// //                 {analytics.drafts}
// //               </p>
// //             </div>
// //             <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm">
// //               <div className="flex items-center gap-2">
// //                 <Clock className="h-3.5 w-3.5 text-violet-500" />
// //                 <p className="text-[10px] font-black uppercase tracking-widest text-violet-600">
// //                   Scheduled
// //                 </p>
// //               </div>
// //               <p className="mt-1.5 text-2xl font-black text-violet-700 tabular-nums">
// //                 {analytics.scheduled}
// //               </p>
// //             </div>
// //             <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
// //               <div className="flex items-center gap-2">
// //                 <Pin className="h-3.5 w-3.5 text-amber-500" />
// //                 <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
// //                   Pinned
// //                 </p>
// //               </div>
// //               <p className="mt-1.5 text-2xl font-black text-amber-700 tabular-nums">
// //                 {analytics.pinned}
// //               </p>
// //             </div>
// //             <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
// //               <div className="flex items-center gap-2">
// //                 <Eye className="h-3.5 w-3.5 text-sky-500" />
// //                 <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">
// //                   Total reads
// //                 </p>
// //               </div>
// //               <p className="mt-1.5 text-2xl font-black text-sky-700 tabular-nums">
// //                 {analytics.total_reads}
// //               </p>
// //             </div>
// //           </div>
// //         )}

// //         {/* FILTERS */}
// //         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
// //           <div className="grid gap-3 lg:grid-cols-12">
// //             <div className="relative lg:col-span-5">
// //               <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //               <input
// //                 value={search}
// //                 onChange={(e) => {
// //                   setSearch(e.target.value);
// //                   setPage(1);
// //                 }}
// //                 placeholder="Search title, body..."
// //                 className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
// //               />
// //             </div>
// //             <select
// //               value={filterPriority}
// //               onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}
// //               className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white lg:col-span-2"
// //             >
// //               <option value="">All priority</option>
// //               {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
// //             </select>
// //             <select
// //               value={filterCategory}
// //               onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
// //               className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white lg:col-span-2"
// //             >
// //               <option value="">All category</option>
// //               {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
// //             </select>
// //             {isAdmin && (
// //               <select
// //                 value={filterStatus}
// //                 onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
// //                 className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white lg:col-span-2"
// //               >
// //                 <option value="">All status</option>
// //                 {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
// //               </select>
// //             )}
// //             <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 lg:col-span-1">
// //               <input
// //                 type="checkbox"
// //                 checked={onlyUnread}
// //                 onChange={(e) => { setOnlyUnread(e.target.checked); setPage(1); }}
// //                 className="h-3.5 w-3.5 rounded accent-[#E42527]"
// //               />
// //               <span className="text-[10px] font-black uppercase tracking-wide text-slate-700">
// //                 Unread
// //               </span>
// //             </label>
// //           </div>
// //         </div>

// //         {/* ERROR */}
// //         {error && (
// //           <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
// //             <AlertTriangle className="h-4 w-4 shrink-0" />
// //             {error}
// //           </div>
// //         )}

// //         {/* LIST */}
// //         {loading ? (
// //           <div className="space-y-3">
// //             {Array.from({ length: 4 }).map((_, i) => (
// //               <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />
// //             ))}
// //           </div>
// //         ) : items.length === 0 ? (
// //           <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
// //             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
// //               <Bell className="h-7 w-7" />
// //             </div>
// //             <p className="mt-5 text-sm font-bold text-slate-700">
// //               No announcements yet
// //             </p>
// //             <p className="mt-1 text-xs text-slate-500">
// //               {isAdmin
// //                 ? "Create your first announcement to broadcast to your team."
// //                 : "You'll see company updates here when they arrive."}
// //             </p>
// //             {isAdmin && (
// //               <button
// //                 onClick={openCreate}
// //                 className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-slate-800"
// //               >
// //                 <Plus className="h-3.5 w-3.5" />
// //                 Create announcement
// //               </button>
// //             )}
// //           </div>
// //         ) : (
// //           <div className="space-y-3">
// //             {items.map((a) => {
// //               const CatIcon = categoryIcon(a.category);
// //               const unread = !a.is_read;
// //               return (
// //                 <div
// //                   key={a.announcement_id}
// //                   className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
// //                     a.is_pinned
// //                       ? "border-violet-200 ring-2 ring-violet-100"
// //                       : unread
// //                       ? "border-[#E42527]/30 ring-1 ring-[#E42527]/10"
// //                       : "border-slate-200"
// //                   }`}
// //                 >
// //                   {unread && (
// //                     <span className="absolute left-0 top-0 h-full w-1 bg-[#E42527]" />
// //                   )}

// //                   <div className="flex items-start gap-4">
// //                     <div
// //                       className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
// //                         a.priority === "urgent"
// //                           ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
// //                           : a.priority === "high"
// //                           ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
// //                           : "bg-gradient-to-br from-violet-500 to-violet-700 text-white"
// //                       }`}
// //                     >
// //                       <Megaphone className="h-5 w-5" />
// //                     </div>

// //                     <div className="min-w-0 flex-1">
// //                       <div className="flex flex-wrap items-center gap-1.5">
// //                         {a.is_pinned && (
// //                           <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-violet-700">
// //                             <Pin className="h-2.5 w-2.5" />
// //                             Pinned
// //                           </span>
// //                         )}
// //                         {unread && (
// //                           <span className="inline-flex items-center gap-1 rounded-full bg-[#E42527] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
// //                             <CircleDot className="h-2.5 w-2.5" />
// //                             New
// //                           </span>
// //                         )}
// //                         <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ring-1 ${priorityTone(a.priority)}`}>
// //                           {a.priority}
// //                         </span>
// //                         <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-600">
// //                           <CatIcon className="h-2.5 w-2.5" />
// //                           {a.category}
// //                         </span>
// //                         {isAdmin && (
// //                           <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ring-1 ${statusTone(a.status)}`}>
// //                             {a.status}
// //                           </span>
// //                         )}
// //                       </div>

// //                       <button
// //                         onClick={() => openView(a)}
// //                         className="mt-2 block w-full text-left"
// //                       >
// //                         <h3 className="text-base font-bold text-slate-900 hover:text-[#E42527]">
// //                           {a.title}
// //                         </h3>
// //                         <p className="mt-1 line-clamp-2 text-sm text-slate-600">
// //                           {a.summary || stripHtml(a.body).slice(0, 180)}
// //                         </p>
// //                       </button>

// //                       <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
// //                         <span className="inline-flex items-center gap-1">
// //                           <Send className="h-3 w-3" />
// //                           {a.posted_by}
// //                         </span>
// //                         <span>·</span>
// //                         <span>{timeAgo(a.published_at || a.created_at)}</span>
// //                         <span>·</span>
// //                         <span className="inline-flex items-center gap-1">
// //                           <Target className="h-3 w-3" />
// //                           {audienceSummary(a)}
// //                         </span>
// //                         {isAdmin && a.status === "published" && (
// //                           <>
// //                             <span>·</span>
// //                             <span className="inline-flex items-center gap-1 font-bold text-slate-700">
// //                               <Eye className="h-3 w-3" />
// //                               {a.read_count}/{a.audience_count} read ({a.read_percentage}%)
// //                             </span>
// //                           </>
// //                         )}
// //                         {a.expires_at && (
// //                           <>
// //                             <span>·</span>
// //                             <span className="text-amber-600">
// //                               Expires {fmtDate(a.expires_at).split(",")[0]}
// //                             </span>
// //                           </>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* ADMIN ACTIONS */}
// //                   {isAdmin && (
// //                     <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
// //                       <button
// //                         onClick={() => openEdit(a)}
// //                         className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
// //                       >
// //                         <Pencil className="h-3 w-3" />
// //                         Edit
// //                       </button>
// //                       {(a.status === "draft" || a.status === "scheduled") && (
// //                         <button
// //                           onClick={() => handlePublish(a)}
// //                           className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white hover:bg-emerald-700"
// //                         >
// //                           <SendHorizontal className="h-3 w-3" />
// //                           Publish now
// //                         </button>
// //                       )}
// //                       <button
// //                         onClick={() => handleTogglePin(a)}
// //                         className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
// //                       >
// //                         {a.is_pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
// //                         {a.is_pinned ? "Unpin" : "Pin"}
// //                       </button>
// //                       {a.status === "published" && (
// //                         <button
// //                           onClick={() => openReceipts(a)}
// //                           className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
// //                         >
// //                           <BarChart3 className="h-3 w-3" />
// //                           Read receipts
// //                         </button>
// //                       )}
// //                       <button
// //                         onClick={() => setDeleteId(a.announcement_id)}
// //                         className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-red-600 hover:bg-red-50"
// //                       >
// //                         <Trash2 className="h-3 w-3" />
// //                         Delete
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}

// //         {/* PAGINATION */}
// //         {totalPages > 1 && (
// //           <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
// //             <p className="text-xs font-medium text-slate-500">
// //               Page {page} of {totalPages} · {total} total
// //             </p>
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => setPage((p) => Math.max(1, p - 1))}
// //                 disabled={page <= 1}
// //                 className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 disabled:opacity-40"
// //               >
// //                 <ChevronLeft className="h-3 w-3" />
// //                 Prev
// //               </button>
// //               <button
// //                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// //                 disabled={page >= totalPages}
// //                 className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 disabled:opacity-40"
// //               >
// //                 Next
// //                 <ChevronRight className="h-3 w-3" />
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* ═══════════ COMPOSE MODAL ═══════════ */}
// //       {composeModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
// //           <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white px-6 py-4">
// //               <div className="flex items-center gap-3">
// //                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
// //                   <Megaphone className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <h3 className="text-base font-black text-slate-900">
// //                     {composeModal === "create" ? "New announcement" : "Edit announcement"}
// //                   </h3>
// //                   <p className="text-[11px] font-medium text-slate-500">
// //                     Compose and target your audience
// //                   </p>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => setComposeModal(null)}
// //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
// //               {/* TITLE */}
// //               <div>
// //                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                   Title *
// //                 </label>
// //                 <input
// //                   value={form.title}
// //                   onChange={(e) => setForm({ ...form, title: e.target.value })}
// //                   placeholder="e.g. Office closed for Diwali — 1 Nov"
// //                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
// //                 />
// //               </div>

// //               {/* BODY */}
// //               <div>
// //                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                   Message *
// //                 </label>
// //                 <RichEditor
// //                   value={form.body}
// //                   onChange={(v) => setForm({ ...form, body: v })}
// //                   placeholder="Write your announcement... Use the toolbar to format."
// //                 />
// //               </div>

// //               {/* PRIORITY + CATEGORY */}
// //               <div className="grid gap-4 sm:grid-cols-2">
// //                 <div>
// //                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                     Priority
// //                   </label>
// //                   <div className="flex gap-2">
// //                     {PRIORITIES.map((p) => (
// //                       <button
// //                         key={p.value}
// //                         type="button"
// //                         onClick={() => setForm({ ...form, priority: p.value })}
// //                         className={`flex-1 rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-wide ring-1 transition ${
// //                           form.priority === p.value
// //                             ? `${p.tone} ring-2`
// //                             : "bg-white text-slate-500 ring-slate-200 hover:ring-slate-300"
// //                         }`}
// //                       >
// //                         {p.label}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                     Category
// //                   </label>
// //                   <select
// //                     value={form.category}
// //                     onChange={(e) => setForm({ ...form, category: e.target.value })}
// //                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
// //                   >
// //                     {CATEGORIES.map((c) => (
// //                       <option key={c.value} value={c.value}>{c.label}</option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>

// //               {/* AUDIENCE */}
// //               <div>
// //                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                   Audience
// //                 </label>
// //                 <AudiencePicker
// //                   form={form}
// //                   setForm={setForm}
// //                   departments={departments}
// //                   locations={locations}
// //                   roles={roles}
// //                   employees={employees}
// //                 />
// //               </div>

// //               {/* SCHEDULE + EXPIRE */}
// //               <div className="grid gap-4 sm:grid-cols-2">
// //                 <div>
// //                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                     Schedule (optional)
// //                   </label>
// //                   <input
// //                     type="datetime-local"
// //                     value={form.scheduled_at}
// //                     onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
// //                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
// //                   />
// //                   <p className="mt-1 text-[10px] text-slate-400">
// //                     Leave blank to publish now
// //                   </p>
// //                 </div>
// //                 <div>
// //                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                     Expires at (optional)
// //                   </label>
// //                   <input
// //                     type="datetime-local"
// //                     value={form.expires_at}
// //                     onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
// //                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
// //                   />
// //                   <p className="mt-1 text-[10px] text-slate-400">
// //                     Auto-hide after this date
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* ATTACHMENTS */}
// //               <div>
// //                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                   Attachments (URLs)
// //                 </label>
// //                 <div className="flex gap-2">
// //                   <input
// //                     ref={attachmentInput}
// //                     placeholder="https://..."
// //                     className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       const v = attachmentInput.current?.value?.trim();
// //                       if (!v) return;
// //                       setForm({ ...form, attachments: [...form.attachments, v] });
// //                       if (attachmentInput.current) attachmentInput.current.value = "";
// //                     }}
// //                     className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
// //                   >
// //                     <Paperclip className="h-3.5 w-3.5" />
// //                     Add
// //                   </button>
// //                 </div>
// //                 {form.attachments.length > 0 && (
// //                   <div className="mt-2 flex flex-wrap gap-1.5">
// //                     {form.attachments.map((url, i) => (
// //                       <span
// //                         key={i}
// //                         className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
// //                       >
// //                         {url.slice(0, 40)}...
// //                         <button
// //                           type="button"
// //                           onClick={() =>
// //                             setForm({
// //                               ...form,
// //                               attachments: form.attachments.filter((_, ix) => ix !== i),
// //                             })
// //                           }
// //                           className="text-slate-400 hover:text-red-500"
// //                         >
// //                           <X className="h-3 w-3" />
// //                         </button>
// //                       </span>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>

// //               {/* OPTIONS */}
// //               <div className="grid gap-2 sm:grid-cols-2">
// //                 <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
// //                   <input
// //                     type="checkbox"
// //                     checked={form.is_pinned}
// //                     onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
// //                     className="h-4 w-4 rounded accent-[#E42527]"
// //                   />
// //                   <Pin className="h-4 w-4 text-slate-500" />
// //                   <span className="text-xs font-bold text-slate-700">
// //                     Pin to top
// //                   </span>
// //                 </label>
// //                 <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
// //                   <input
// //                     type="checkbox"
// //                     checked={form.send_email}
// //                     onChange={(e) => setForm({ ...form, send_email: e.target.checked })}
// //                     className="h-4 w-4 rounded accent-[#E42527]"
// //                   />
// //                   <Send className="h-4 w-4 text-slate-500" />
// //                   <span className="text-xs font-bold text-slate-700">
// //                     Also send email
// //                   </span>
// //                 </label>
// //               </div>
// //             </div>

// //             <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
// //               <button
// //                 onClick={() => handleSave(true)}
// //                 disabled={saving}
// //                 className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 disabled:opacity-60"
// //               >
// //                 Save as draft
// //               </button>
// //               <div className="flex items-center gap-2">
// //                 <button
// //                   onClick={() => setComposeModal(null)}
// //                   disabled={saving}
// //                   className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={() => handleSave(false)}
// //                   disabled={saving}
// //                   className="inline-flex items-center gap-2 rounded-xl bg-[#E42527] px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-lg hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {saving ? (
// //                     <Loader2 className="h-4 w-4 animate-spin" />
// //                   ) : (
// //                     <SendHorizontal className="h-4 w-4" />
// //                   )}
// //                   {form.scheduled_at ? "Schedule" : "Publish"}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ═══════════ VIEW MODAL ═══════════ */}
// //       {viewModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
// //           <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
// //             <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
// //               <div className="flex items-start gap-3">
// //                 <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
// //                   viewModal.priority === "urgent"
// //                     ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
// //                     : viewModal.priority === "high"
// //                     ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
// //                     : "bg-gradient-to-br from-violet-500 to-violet-700 text-white"
// //                 }`}>
// //                   <Megaphone className="h-5 w-5" />
// //                 </div>
// //                 <div className="min-w-0">
// //                   <div className="flex flex-wrap items-center gap-1.5">
// //                     {viewModal.is_pinned && (
// //                       <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-black uppercase text-violet-700">
// //                         <Pin className="h-2.5 w-2.5" /> Pinned
// //                       </span>
// //                     )}
// //                     <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ring-1 ${priorityTone(viewModal.priority)}`}>
// //                       {viewModal.priority}
// //                     </span>
// //                     <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-600">
// //                       {viewModal.category}
// //                     </span>
// //                   </div>
// //                   <h2 className="mt-2 text-xl font-black text-slate-900">
// //                     {viewModal.title}
// //                   </h2>
// //                   <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
// //                     <span>{viewModal.posted_by}</span>
// //                     <span>·</span>
// //                     <span>{fmtDate(viewModal.published_at || viewModal.created_at)}</span>
// //                     <span>·</span>
// //                     <span className="inline-flex items-center gap-1">
// //                       <Target className="h-3 w-3" />
// //                       {audienceSummary(viewModal)}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => setViewModal(null)}
// //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             <div className="flex-1 overflow-y-auto px-6 py-5">
// //               <div
// //                 className="prose prose-sm max-w-none text-slate-800"
// //                 dangerouslySetInnerHTML={{ __html: viewModal.body }}
// //               />

// //               {viewModal.attachments?.length > 0 && (
// //                 <div className="mt-6 border-t border-slate-100 pt-4">
// //                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
// //                     Attachments
// //                   </p>
// //                   <div className="mt-2 space-y-1.5">
// //                     {viewModal.attachments.map((url, i) => (
// //                       <a
// //                         key={i}
// //                         href={url}
// //                         target="_blank"
// //                         rel="noreferrer"
// //                         className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-white"
// //                       >
// //                         <Paperclip className="h-3.5 w-3.5" />
// //                         <span className="truncate">{url}</span>
// //                       </a>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {viewModal.expires_at && (
// //                 <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
// //                   <Clock className="h-3.5 w-3.5 text-amber-600" />
// //                   <p className="text-[11px] font-bold text-amber-700">
// //                     Expires on {fmtDate(viewModal.expires_at)}
// //                   </p>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
// //               {isAdmin && (
// //                 <button
// //                   onClick={() => {
// //                     setViewModal(null);
// //                     openEdit(viewModal);
// //                   }}
// //                   className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
// //                 >
// //                   <Pencil className="h-3.5 w-3.5" />
// //                   Edit
// //                 </button>
// //               )}
// //               <button
// //                 onClick={() => setViewModal(null)}
// //                 className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-slate-800"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ═══════════ READ RECEIPTS MODAL ═══════════ */}
// //       {receiptsModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
// //           <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white px-6 py-4">
// //               <div className="flex items-center gap-3">
// //                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
// //                   <BarChart3 className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <h3 className="text-base font-black text-slate-900">
// //                     Read receipts
// //                   </h3>
// //                   <p className="text-[11px] font-medium text-slate-500 truncate max-w-xs">
// //                     {receiptsModal.announcement.title}
// //                   </p>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => setReceiptsModal(null)}
// //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             {receiptsLoading || !receiptsModal.data ? (
// //               <div className="p-10 text-center">
// //                 <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
// //               </div>
// //             ) : (
// //               <>
// //                 <div className="grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
// //                   <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
// //                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
// //                       Read
// //                     </p>
// //                     <p className="mt-0.5 text-xl font-black text-slate-900 tabular-nums">
// //                       {receiptsModal.data.total_read}
// //                     </p>
// //                   </div>
// //                   <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
// //                     <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
// //                       Not read
// //                     </p>
// //                     <p className="mt-0.5 text-xl font-black text-slate-900 tabular-nums">
// //                       {receiptsModal.data.non_readers?.length || 0}
// //                     </p>
// //                   </div>
// //                   <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
// //                     <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">
// //                       Rate
// //                     </p>
// //                     <p className="mt-0.5 text-xl font-black text-slate-900 tabular-nums">
// //                       {receiptsModal.data.read_percentage}%
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="grid flex-1 grid-cols-1 overflow-hidden sm:grid-cols-2">
// //                   {/* Readers */}
// //                   <div className="flex flex-col overflow-hidden border-r border-slate-100">
// //                     <div className="border-b border-slate-100 bg-emerald-50/50 px-4 py-2.5">
// //                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
// //                         Read ({receiptsModal.data.readers?.length || 0})
// //                       </p>
// //                     </div>
// //                     <div className="flex-1 overflow-y-auto p-3">
// //                       {(receiptsModal.data.readers || []).length === 0 ? (
// //                         <p className="py-6 text-center text-xs text-slate-400">
// //                           No reads yet
// //                         </p>
// //                       ) : (
// //                         <div className="space-y-1.5">
// //                           {receiptsModal.data.readers.map((r, i) => (
// //                             <div
// //                               key={r.employee_id || i}
// //                               className="flex items-center gap-2 rounded-lg bg-emerald-50/40 px-2.5 py-2"
// //                             >
// //                               <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
// //                               <div className="min-w-0 flex-1">
// //                                 <p className="truncate text-xs font-bold text-slate-800">
// //                                   {r.name}
// //                                 </p>
// //                                 <p className="text-[10px] text-slate-500">
// //                                   {timeAgo(r.read_at)}
// //                                 </p>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Non-readers */}
// //                   <div className="flex flex-col overflow-hidden">
// //                     <div className="border-b border-slate-100 bg-red-50/50 px-4 py-2.5">
// //                       <p className="text-[10px] font-black uppercase tracking-widest text-red-700">
// //                         Not read ({receiptsModal.data.non_readers?.length || 0})
// //                       </p>
// //                     </div>
// //                     <div className="flex-1 overflow-y-auto p-3">
// //                       {(receiptsModal.data.non_readers || []).length === 0 ? (
// //                         <p className="py-6 text-center text-xs text-slate-400">
// //                           Everyone has read this 🎉
// //                         </p>
// //                       ) : (
// //                         <div className="space-y-1.5">
// //                           {receiptsModal.data.non_readers.map((r, i) => (
// //                             <div
// //                               key={r.employee_id || i}
// //                               className="flex items-center gap-2 rounded-lg bg-red-50/40 px-2.5 py-2"
// //                             >
// //                               <X className="h-3.5 w-3.5 shrink-0 text-red-400" />
// //                               <p className="min-w-0 flex-1 truncate text-xs font-bold text-slate-800">
// //                                 {r.name}
// //                               </p>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* ═══════════ DELETE CONFIRM ═══════════ */}
// //       {deleteId && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
// //           <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
// //             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
// //               <AlertTriangle className="h-6 w-6" />
// //             </div>
// //             <h3 className="mt-4 text-base font-black text-slate-900">
// //               Delete this announcement?
// //             </h3>
// //             <p className="mt-1 text-xs font-medium text-slate-500">
// //               This action cannot be undone. Read receipts will also be removed.
// //             </p>
// //             <div className="mt-5 flex gap-2">
// //               <button
// //                 onClick={() => setDeleteId(null)}
// //                 className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleDelete}
// //                 className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-red-700"
// //               >
// //                 Delete
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
// import { toast } from "sonner";
// import {
//   Megaphone, Plus, Search, Pencil, Trash2, Pin, PinOff, Loader2, X,
//   AlertTriangle, CheckCircle2, Bell, Filter, ChevronLeft, ChevronRight,
//   Save, Eye, Send, Users, Building2, MapPin, Shield, UserCheck2,
//   Calendar, Clock, Bold, Italic, Underline, List, ListOrdered,
//   Link2, Paperclip, BarChart3, Check, CircleDot, FileText, Globe2,
//   SendHorizontal, Inbox, Star, TrendingUp, Target, Ban,
// } from "lucide-react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// /* ═══════════════════════════════════════════════════════
//    CONSTANTS
//    ═══════════════════════════════════════════════════════ */

// const PRIORITIES = [
//   { value: "low", label: "Low", tone: "bg-slate-100 text-slate-600 ring-slate-200" },
//   { value: "normal", label: "Normal", tone: "bg-sky-100 text-sky-700 ring-sky-200" },
//   { value: "high", label: "High", tone: "bg-amber-100 text-amber-700 ring-amber-200" },
//   { value: "urgent", label: "Urgent", tone: "bg-red-100 text-red-700 ring-red-200" },
// ];

// const CATEGORIES = [
//   { value: "general", label: "General", icon: FileText },
//   { value: "hr", label: "HR", icon: Users },
//   { value: "policy", label: "Policy", icon: Shield },
//   { value: "event", label: "Event", icon: Calendar },
//   { value: "holiday", label: "Holiday", icon: Globe2 },
//   { value: "urgent", label: "Urgent", icon: AlertTriangle },
//   { value: "achievement", label: "Achievement", icon: Star },
// ];

// const AUDIENCE_TYPES = [
//   { value: "all", label: "Everyone", icon: Users, desc: "All active employees" },
//   { value: "departments", label: "Departments", icon: Building2, desc: "Selected departments" },
//   { value: "locations", label: "Locations", icon: MapPin, desc: "Selected locations" },
//   { value: "roles", label: "Roles", icon: Shield, desc: "Specific roles" },
//   { value: "specific", label: "Specific employees", icon: UserCheck2, desc: "Hand-picked people" },
// ];

// const STATUSES = [
//   { value: "draft", label: "Draft", tone: "bg-slate-100 text-slate-600 ring-slate-200" },
//   { value: "scheduled", label: "Scheduled", tone: "bg-violet-100 text-violet-700 ring-violet-200" },
//   { value: "published", label: "Published", tone: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
//   { value: "expired", label: "Expired", tone: "bg-red-100 text-red-700 ring-red-200" },
// ];

// /* ═══════════════════════════════════════════════════════
//    HELPERS
//    ═══════════════════════════════════════════════════════ */

// function fmtDate(v) {
//   if (!v) return "—";
//   try {
//     return new Date(v).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//       hour: "2-digit", minute: "2-digit",
//     });
//   } catch {
//     return "—";
//   }
// }

// function timeAgo(v) {
//   if (!v) return "";
//   const diff = Math.floor((Date.now() - new Date(v).getTime()) / 1000);
//   if (diff < 60) return "just now";
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
//   return fmtDate(v).split(",")[0];
// }

// function priorityTone(p) {
//   return PRIORITIES.find((x) => x.value === p)?.tone || PRIORITIES[1].tone;
// }

// function statusTone(s) {
//   return STATUSES.find((x) => x.value === s)?.tone || STATUSES[0].tone;
// }

// function categoryIcon(c) {
//   const Icon = CATEGORIES.find((x) => x.value === c)?.icon || FileText;
//   return Icon;
// }

// function stripHtml(html) {
//   if (!html) return "";
//   return String(html).replace(/<[^>]*>/g, "").trim();
// }

// /* ═══════════════════════════════════════════════════════
//    RICH TEXT EDITOR
//    ═══════════════════════════════════════════════════════ */

// function RichEditor({ value, onChange, placeholder }) {
//   const ref = useRef(null);
//   const [focused, setFocused] = useState(false);

//   useEffect(() => {
//     if (ref.current && ref.current.innerHTML !== value) {
//       ref.current.innerHTML = value || "";
//     }
//   }, [value]);

//   const exec = (cmd, arg) => {
//     ref.current?.focus();
//     document.execCommand(cmd, false, arg);
//     if (ref.current) onChange(ref.current.innerHTML);
//   };

//   const tools = [
//     { icon: Bold, cmd: "bold", title: "Bold (Ctrl+B)" },
//     { icon: Italic, cmd: "italic", title: "Italic (Ctrl+I)" },
//     { icon: Underline, cmd: "underline", title: "Underline (Ctrl+U)" },
//     { icon: List, cmd: "insertUnorderedList", title: "Bullet list" },
//     { icon: ListOrdered, cmd: "insertOrderedList", title: "Numbered list" },
//   ];

//   return (
//     <div
//       className={`rounded-xl border transition ${
//         focused ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200"
//       } bg-white`}
//     >
//       <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/60 px-2 py-1.5">
//         {tools.map((t) => (
//           <button
//             key={t.cmd}
//             type="button"
//             onClick={() => exec(t.cmd)}
//             title={t.title}
//             className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
//           >
//             <t.icon className="h-3.5 w-3.5" />
//           </button>
//         ))}
//         <div className="mx-1 h-4 w-px bg-slate-200" />
//         <button
//           type="button"
//           onClick={() => {
//             const url = window.prompt("Enter URL");
//             if (url) exec("createLink", url);
//           }}
//           className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
//           title="Insert link"
//         >
//           <Link2 className="h-3.5 w-3.5" />
//         </button>
//         <button
//           type="button"
//           onClick={() => exec("removeFormat")}
//           className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
//           title="Clear formatting"
//         >
//           <Ban className="h-3.5 w-3.5" />
//         </button>
//       </div>

//       <div
//         ref={ref}
//         contentEditable
//         suppressContentEditableWarning
//         onFocus={() => setFocused(true)}
//         onBlur={() => setFocused(false)}
//         onInput={(e) => onChange(e.currentTarget.innerHTML)}
//         data-placeholder={placeholder}
//         className="prose prose-sm max-w-none px-4 py-3 text-sm text-slate-800 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
//         style={{ minHeight: 140 }}
//       />
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════
//    AUDIENCE PICKER
//    ═══════════════════════════════════════════════════════ */

// function AudiencePicker({ form, setForm, departments, locations, roles, employees }) {
//   const type = form.audience_type;
//   const selectedIds =
//     type === "departments" ? form.target_department_ids
//     : type === "locations" ? form.target_location_ids
//     : type === "roles" ? form.target_role_ids
//     : type === "specific" ? form.target_employee_ids
//     : [];

//   const options =
//     type === "departments" ? departments
//     : type === "locations" ? locations
//     : type === "roles" ? roles.map((r) => ({ id: r, name: r }))
//     : type === "specific" ? employees
//     : [];

//   const fieldKey =
//     type === "departments" ? "target_department_ids"
//     : type === "locations" ? "target_location_ids"
//     : type === "roles" ? "target_role_ids"
//     : "target_employee_ids";

//   const toggle = (id) => {
//     if (!id) return;
//     const cur = selectedIds || [];
//     const next = cur.includes(id)
//       ? cur.filter((x) => x !== id)
//       : [...cur, id];
//     setForm({ ...form, [fieldKey]: next });
//   };

//   return (
//     <div className="space-y-3">
//       <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
//         {AUDIENCE_TYPES.map((a) => {
//           const Icon = a.icon;
//           const active = type === a.value;
//           return (
//             <button
//               key={a.value}
//               type="button"
//               onClick={() =>
//                 setForm({
//                   ...form,
//                   audience_type: a.value,
//                   target_department_ids: [],
//                   target_location_ids: [],
//                   target_role_ids: [],
//                   target_employee_ids: [],
//                 })
//               }
//               className={`group flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
//                 active
//                   ? "border-[#E42527] bg-red-50/60 ring-2 ring-[#E42527]/20"
//                   : "border-slate-200 bg-white hover:border-slate-300"
//               }`}
//             >
//               <div
//                 className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
//                   active
//                     ? "bg-[#E42527] text-white"
//                     : "bg-slate-100 text-slate-500"
//                 }`}
//               >
//                 <Icon className="h-4 w-4" />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-xs font-bold text-slate-900">{a.label}</p>
//                 <p className="mt-0.5 text-[10px] text-slate-500">{a.desc}</p>
//               </div>
//             </button>
//           );
//         })}
//       </div>

//       {type !== "all" && (
//         <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
//           <div className="mb-2 flex items-center justify-between">
//             <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
//               Select {type === "specific" ? "employees" : type}
//             </p>
//             <p className="text-[11px] font-bold text-slate-700">
//               {selectedIds?.length || 0} selected
//             </p>
//           </div>

//           {options.length === 0 ? (
//             <p className="py-2 text-center text-xs text-slate-400">
//               No options available
//             </p>
//           ) : (
//             <div className="max-h-48 overflow-y-auto">
//               <div className="flex flex-wrap gap-1.5">
//                 {options.slice(0, 100).map((o) => {
//                   const id = o.id || o.employee_id || o.department_id || o.location_id;
//                   const name = o.name || o.department_name || o.location_name || o.employee_name || id;
//                   const active = selectedIds?.includes(id);
//                   return (
//                     <button
//                       key={id}
//                       type="button"
//                       onClick={() => toggle(id)}
//                       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
//                         active
//                           ? "bg-[#E42527] text-white shadow-sm"
//                           : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
//                       }`}
//                     >
//                       {active && <Check className="h-3 w-3" />}
//                       {name}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════
//    MAIN PAGE
//    ═══════════════════════════════════════════════════════ */

// export default function AnnouncementsPage() {
//   const user = useAuthStore((s) => s.user);
//   const role = String(user?.role?.value || user?.role || "").toLowerCase();
//   const isAdmin = role === "admin" || role.endsWith("admin");

//   const [items, setItems] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   // filters
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState("");
//   const [filterPriority, setFilterPriority] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [onlyUnread, setOnlyUnread] = useState(false);

//   // modals
//   const [composeModal, setComposeModal] = useState(null);
//   const [editing, setEditing] = useState(null);
//   const [viewModal, setViewModal] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [receiptsModal, setReceiptsModal] = useState(null);
//   const [receiptsLoading, setReceiptsLoading] = useState(false);

//   // reference data
//   const [departments, setDepartments] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   // form
//   const [form, setForm] = useState({
//     title: "",
//     body: "",
//     summary: "",
//     priority: "normal",
//     category: "general",
//     audience_type: "all",
//     target_department_ids: [],
//     target_location_ids: [],
//     target_role_ids: [],
//     target_employee_ids: [],
//     attachments: [],
//     scheduled_at: "",
//     expires_at: "",
//     is_pinned: false,
//     send_email: false,
//   });

//   const attachmentInput = useRef("");

//   /* ─────────────── FETCH LIST ─────────────── */
//   const fetchItems = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = {
//         page,
//         page_size: pageSize,
//         include_expired: true,
//       };
//       if (search.trim()) params.search = search.trim();
//       if (filterPriority) params.priority = filterPriority;
//       if (filterCategory) params.category = filterCategory;
//       if (filterStatus && isAdmin) params.status = filterStatus;
//       if (onlyUnread) params.only_unread = true;

//       const res = await api.get("/api/v1/announcements", { params });
//       const d = res?.data || res;
//       setItems(Array.isArray(d?.announcements) ? d.announcements : []);
//       setTotal(d?.total || 0);
//     } catch (err) {
//       setError(err?.response?.data?.detail || "Failed to load announcements");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, pageSize, search, filterPriority, filterCategory, filterStatus, onlyUnread, isAdmin]);

//   /* ─────────────── FETCH REFERENCE ─────────────── */
//   const fetchReference = useCallback(async () => {
//     if (!isAdmin) return;
//     try {
//       const [dRes, lRes, eRes] = await Promise.allSettled([
//         api.get("/api/v1/get/departments"),
//         api.get("/api/v1/get/location/master"),
//         api.get("/api/v1/get/employees"),
//       ]);

//       if (dRes.status === "fulfilled") {
//         const d = dRes.value?.data || dRes.value;
//         setDepartments(
//           (d?.departments || []).map((x) => ({
//             id: x.department_id,
//             name: x.department_name,
//           }))
//         );
//       }
//       if (lRes.status === "fulfilled") {
//         const l = lRes.value?.data || lRes.value;
//         setLocations(
//           (l?.locations || []).map((x) => ({
//             id: x.location_id,
//             name: x.location_name,
//           }))
//         );
//       }
//       if (eRes.status === "fulfilled") {
//         const e = eRes.value?.data || eRes.value;
//         setEmployees(
//           (e?.employees || []).map((x) => ({
//             id: x.employee_id,
//             name: x.name || x.employee_id,
//           }))
//         );
//       }
//     } catch {}
//   }, [isAdmin]);

//   /* ─────────────── FETCH ANALYTICS ─────────────── */
//   const fetchAnalytics = useCallback(async () => {
//     if (!isAdmin) return;
//     try {
//       const res = await api.get("/api/v1/announcements/analytics");
//       setAnalytics(res?.data || res);
//     } catch {}
//   }, [isAdmin]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchItems(), 300);
//     return () => clearTimeout(t);
//   }, [fetchItems]);

//   useEffect(() => {
//     fetchReference();
//     fetchAnalytics();
//   }, [fetchReference, fetchAnalytics]);

//   const roles = useMemo(() => {
//     return [
//       "admin", "hr", "manager", "team_lead", "employee", "intern", "contractor",
//     ];
//   }, []);

//   /* ─────────────── ACTIONS ─────────────── */
//   const resetForm = () => {
//     setForm({
//       title: "",
//       body: "",
//       summary: "",
//       priority: "normal",
//       category: "general",
//       audience_type: "all",
//       target_department_ids: [],
//       target_location_ids: [],
//       target_role_ids: [],
//       target_employee_ids: [],
//       attachments: [],
//       scheduled_at: "",
//       expires_at: "",
//       is_pinned: false,
//       send_email: false,
//     });
//   };

//   const openCreate = () => {
//     resetForm();
//     setEditing(null);
//     setComposeModal("create");
//   };

//   const openEdit = (a) => {
//     setForm({
//       title: a.title || "",
//       body: a.body || "",
//       summary: a.summary || "",
//       priority: a.priority || "normal",
//       category: a.category || "general",
//       audience_type: a.audience_type || "all",
//       target_department_ids: a.target_department_ids || [],
//       target_location_ids: a.target_location_ids || [],
//       target_role_ids: a.target_role_ids || [],
//       target_employee_ids: a.target_employee_ids || [],
//       attachments: a.attachments || [],
//       scheduled_at: a.scheduled_at ? a.scheduled_at.slice(0, 16) : "",
//       expires_at: a.expires_at ? a.expires_at.slice(0, 16) : "",
//       is_pinned: !!a.is_pinned,
//       send_email: !!a.send_email,
//     });
//     setEditing(a);
//     setComposeModal("edit");
//   };

//   const handleSave = async (asDraft = false) => {
//     if (!form.title.trim() || !stripHtml(form.body).trim()) {
//       toast.error("Title and message are required");
//       return;
//     }
//     if (form.audience_type !== "all") {
//       const key =
//         form.audience_type === "departments" ? "target_department_ids"
//         : form.audience_type === "locations" ? "target_location_ids"
//         : form.audience_type === "roles" ? "target_role_ids"
//         : "target_employee_ids";
//       if (!form[key] || form[key].length === 0) {
//         toast.error("Please select at least one audience member");
//         return;
//       }
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         title: form.title.trim(),
//         body: form.body,
//         summary: form.summary.trim() || stripHtml(form.body).slice(0, 200),
//         priority: form.priority,
//         category: form.category,
//         audience_type: form.audience_type,
//         target_department_ids: form.target_department_ids,
//         target_location_ids: form.target_location_ids,
//         target_role_ids: form.target_role_ids,
//         target_employee_ids: form.target_employee_ids,
//         attachments: form.attachments,
//         scheduled_at: form.scheduled_at
//           ? new Date(form.scheduled_at).toISOString()
//           : null,
//         expires_at: form.expires_at
//           ? new Date(form.expires_at).toISOString()
//           : null,
//         is_pinned: form.is_pinned,
//         send_email: form.send_email,
//         save_as_draft: asDraft,
//       };

//       if (composeModal === "create") {
//         await api.post("/api/v1/announcements", payload);
//         toast.success(asDraft ? "Saved as draft" : "Published!");
//       } else {
//         await api.put(
//           `/api/v1/announcements/${editing.announcement_id}`,
//           payload
//         );
//         toast.success("Updated!");
//       }
//       setComposeModal(null);
//       fetchItems();
//       fetchAnalytics();
//     } catch (err) {
//       toast.error(err?.response?.data?.detail || "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;
//     try {
//       await api.delete(`/api/v1/announcements/${deleteId}`);
//       toast.success("Deleted");
//       setDeleteId(null);
//       fetchItems();
//       fetchAnalytics();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   const handleTogglePin = async (a) => {
//     try {
//       await api.post(`/api/v1/announcements/${a.announcement_id}/toggle-pin`);
//       fetchItems();
//     } catch {
//       toast.error("Pin toggle failed");
//     }
//   };

//   const handlePublish = async (a) => {
//     try {
//       await api.post(`/api/v1/announcements/${a.announcement_id}/publish`);
//       toast.success("Published!");
//       fetchItems();
//       fetchAnalytics();
//     } catch {
//       toast.error("Publish failed");
//     }
//   };

//   // ========== FIXED openView ==========
//   const openView = async (a) => {
//     setViewModal(a);

//     // already read → skip
//     if (a.is_read) return;

//     try {
//       await api.post(`/api/v1/announcements/${a.announcement_id}/read`);

//       // local state update → New badge turant hat jaaye
//       setItems((prev) =>
//         prev.map((item) =>
//           item.announcement_id === a.announcement_id
//             ? { ...item, is_read: true }
//             : item
//         )
//       );
//     } catch (err) {
//       console.error("Mark as read failed", err);
//     }
//   };

//   const openReceipts = async (a) => {
//     setReceiptsLoading(true);
//     setReceiptsModal({ announcement: a, data: null });
//     try {
//       const res = await api.get(`/api/v1/announcements/${a.announcement_id}/reads`);
//       setReceiptsModal({ announcement: a, data: res?.data || res });
//     } catch {
//       toast.error("Failed to load receipts");
//       setReceiptsModal(null);
//     } finally {
//       setReceiptsLoading(false);
//     }
//   };

//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   const audienceSummary = (a) => {
//     const t = a.audience_type;
//     if (t === "all") return "Everyone";
//     if (t === "departments")
//       return `${(a.target_department_ids || []).length} department(s)`;
//     if (t === "locations")
//       return `${(a.target_location_ids || []).length} location(s)`;
//     if (t === "roles")
//       return `${(a.target_role_ids || []).length} role(s)`;
//     if (t === "specific")
//       return `${(a.target_employee_ids || []).length} employee(s)`;
//     return "—";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
//       <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
//         {/* HEADER */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-200">
//               <Megaphone className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-black tracking-tight text-slate-900">
//                 Announcements
//               </h1>
//               <p className="text-xs font-medium text-slate-500">
//                 {isAdmin
//                   ? "Broadcast updates, target teams, track reads"
//                   : "Company updates & notices"}
//               </p>
//             </div>
//           </div>

//           {isAdmin && (
//             <button
//               onClick={openCreate}
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E42527] px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg hover:bg-[#c91f21]"
//             >
//               <Plus className="h-4 w-4" />
//               New announcement
//             </button>
//           )}
//         </div>

//         {/* ANALYTICS */}
//         {isAdmin && analytics && (
//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
//             <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <Inbox className="h-3.5 w-3.5 text-slate-400" />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
//                   Total
//                 </p>
//               </div>
//               <p className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
//                 {analytics.total}
//               </p>
//             </div>
//             <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
//                   Published
//                 </p>
//               </div>
//               <p className="mt-1.5 text-2xl font-black text-emerald-700 tabular-nums">
//                 {analytics.published}
//               </p>
//             </div>
//             <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <FileText className="h-3.5 w-3.5 text-slate-400" />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
//                   Drafts
//                 </p>
//               </div>
//               <p className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">
//                 {analytics.drafts}
//               </p>
//             </div>
//             <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <Clock className="h-3.5 w-3.5 text-violet-500" />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-violet-600">
//                   Scheduled
//                 </p>
//               </div>
//               <p className="mt-1.5 text-2xl font-black text-violet-700 tabular-nums">
//                 {analytics.scheduled}
//               </p>
//             </div>
//             <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <Pin className="h-3.5 w-3.5 text-amber-500" />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
//                   Pinned
//                 </p>
//               </div>
//               <p className="mt-1.5 text-2xl font-black text-amber-700 tabular-nums">
//                 {analytics.pinned}
//               </p>
//             </div>
//             <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <Eye className="h-3.5 w-3.5 text-sky-500" />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">
//                   Total reads
//                 </p>
//               </div>
//               <p className="mt-1.5 text-2xl font-black text-sky-700 tabular-nums">
//                 {analytics.total_reads}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* FILTERS */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="grid gap-3 lg:grid-cols-12">
//             <div className="relative lg:col-span-5">
//               <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search title, body..."
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
//               />
//             </div>
//             <select
//               value={filterPriority}
//               onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}
//               className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white lg:col-span-2"
//             >
//               <option value="">All priority</option>
//               {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
//             </select>
//             <select
//               value={filterCategory}
//               onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
//               className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white lg:col-span-2"
//             >
//               <option value="">All category</option>
//               {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
//             </select>
//             {isAdmin && (
//               <select
//                 value={filterStatus}
//                 onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
//                 className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white lg:col-span-2"
//               >
//                 <option value="">All status</option>
//                 {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
//               </select>
//             )}
//             <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 lg:col-span-1">
//               <input
//                 type="checkbox"
//                 checked={onlyUnread}
//                 onChange={(e) => { setOnlyUnread(e.target.checked); setPage(1); }}
//                 className="h-3.5 w-3.5 rounded accent-[#E42527]"
//               />
//               <span className="text-[10px] font-black uppercase tracking-wide text-slate-700">
//                 Unread
//               </span>
//             </label>
//           </div>
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//             <AlertTriangle className="h-4 w-4 shrink-0" />
//             {error}
//           </div>
//         )}

//         {/* LIST */}
//         {loading ? (
//           <div className="space-y-3">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />
//             ))}
//           </div>
//         ) : items.length === 0 ? (
//           <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
//               <Bell className="h-7 w-7" />
//             </div>
//             <p className="mt-5 text-sm font-bold text-slate-700">
//               No announcements yet
//             </p>
//             <p className="mt-1 text-xs text-slate-500">
//               {isAdmin
//                 ? "Create your first announcement to broadcast to your team."
//                 : "You'll see company updates here when they arrive."}
//             </p>
//             {isAdmin && (
//               <button
//                 onClick={openCreate}
//                 className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-slate-800"
//               >
//                 <Plus className="h-3.5 w-3.5" />
//                 Create announcement
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {items.map((a) => {
//               const CatIcon = categoryIcon(a.category);
//               const unread = !a.is_read;
//               return (
//                 <div
//                   key={a.announcement_id}
//                   className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
//                     a.is_pinned
//                       ? "border-violet-200 ring-2 ring-violet-100"
//                       : unread
//                       ? "border-[#E42527]/30 ring-1 ring-[#E42527]/10"
//                       : "border-slate-200"
//                   }`}
//                 >
//                   {unread && (
//                     <span className="absolute left-0 top-0 h-full w-1 bg-[#E42527]" />
//                   )}

//                   <div className="flex items-start gap-4">
//                     <div
//                       className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
//                         a.priority === "urgent"
//                           ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
//                           : a.priority === "high"
//                           ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
//                           : "bg-gradient-to-br from-violet-500 to-violet-700 text-white"
//                       }`}
//                     >
//                       <Megaphone className="h-5 w-5" />
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <div className="flex flex-wrap items-center gap-1.5">
//                         {a.is_pinned && (
//                           <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-violet-700">
//                             <Pin className="h-2.5 w-2.5" />
//                             Pinned
//                           </span>
//                         )}
//                         {unread && (
//                           <span className="inline-flex items-center gap-1 rounded-full bg-[#E42527] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
//                             <CircleDot className="h-2.5 w-2.5" />
//                             New
//                           </span>
//                         )}
//                         <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ring-1 ${priorityTone(a.priority)}`}>
//                           {a.priority}
//                         </span>
//                         <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-600">
//                           <CatIcon className="h-2.5 w-2.5" />
//                           {a.category}
//                         </span>
//                         {isAdmin && (
//                           <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ring-1 ${statusTone(a.status)}`}>
//                             {a.status}
//                           </span>
//                         )}
//                       </div>

//                       <button
//                         onClick={() => openView(a)}
//                         className="mt-2 block w-full text-left"
//                       >
//                         <h3 className="text-base font-bold text-slate-900 hover:text-[#E42527]">
//                           {a.title}
//                         </h3>
//                         <p className="mt-1 line-clamp-2 text-sm text-slate-600">
//                           {a.summary || stripHtml(a.body).slice(0, 180)}
//                         </p>
//                       </button>

//                       <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
//                         <span className="inline-flex items-center gap-1">
//                           <Send className="h-3 w-3" />
//                           {a.posted_by}
//                         </span>
//                         <span>·</span>
//                         <span>{timeAgo(a.published_at || a.created_at)}</span>
//                         <span>·</span>
//                         <span className="inline-flex items-center gap-1">
//                           <Target className="h-3 w-3" />
//                           {audienceSummary(a)}
//                         </span>
//                         {isAdmin && a.status === "published" && (
//                           <>
//                             <span>·</span>
//                             <span className="inline-flex items-center gap-1 font-bold text-slate-700">
//                               <Eye className="h-3 w-3" />
//                               {a.read_count}/{a.audience_count} read ({a.read_percentage}%)
//                             </span>
//                           </>
//                         )}
//                         {a.expires_at && (
//                           <>
//                             <span>·</span>
//                             <span className="text-amber-600">
//                               Expires {fmtDate(a.expires_at).split(",")[0]}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* ADMIN ACTIONS */}
//                   {isAdmin && (
//                     <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
//                       <button
//                         onClick={() => openEdit(a)}
//                         className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
//                       >
//                         <Pencil className="h-3 w-3" />
//                         Edit
//                       </button>
//                       {(a.status === "draft" || a.status === "scheduled") && (
//                         <button
//                           onClick={() => handlePublish(a)}
//                           className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white hover:bg-emerald-700"
//                         >
//                           <SendHorizontal className="h-3 w-3" />
//                           Publish now
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleTogglePin(a)}
//                         className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
//                       >
//                         {a.is_pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
//                         {a.is_pinned ? "Unpin" : "Pin"}
//                       </button>
//                       {a.status === "published" && (
//                         <button
//                           onClick={() => openReceipts(a)}
//                           className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
//                         >
//                           <BarChart3 className="h-3 w-3" />
//                           Read receipts
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setDeleteId(a.announcement_id)}
//                         className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-red-600 hover:bg-red-50"
//                       >
//                         <Trash2 className="h-3 w-3" />
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
//             <p className="text-xs font-medium text-slate-500">
//               Page {page} of {totalPages} · {total} total
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page <= 1}
//                 className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//               >
//                 <ChevronLeft className="h-3 w-3" />
//                 Prev
//               </button>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page >= totalPages}
//                 className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//               >
//                 Next
//                 <ChevronRight className="h-3 w-3" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ═══════════ COMPOSE MODAL ═══════════ */}
//       {composeModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white px-6 py-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
//                   <Megaphone className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-black text-slate-900">
//                     {composeModal === "create" ? "New announcement" : "Edit announcement"}
//                   </h3>
//                   <p className="text-[11px] font-medium text-slate-500">
//                     Compose and target your audience
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setComposeModal(null)}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
//               <div>
//                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                   Title *
//                 </label>
//                 <input
//                   value={form.title}
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                   placeholder="e.g. Office closed for Diwali — 1 Nov"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                   Message *
//                 </label>
//                 <RichEditor
//                   value={form.body}
//                   onChange={(v) => setForm({ ...form, body: v })}
//                   placeholder="Write your announcement... Use the toolbar to format."
//                 />
//               </div>

//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                     Priority
//                   </label>
//                   <div className="flex gap-2">
//                     {PRIORITIES.map((p) => (
//                       <button
//                         key={p.value}
//                         type="button"
//                         onClick={() => setForm({ ...form, priority: p.value })}
//                         className={`flex-1 rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-wide ring-1 transition ${
//                           form.priority === p.value
//                             ? `${p.tone} ring-2`
//                             : "bg-white text-slate-500 ring-slate-200 hover:ring-slate-300"
//                         }`}
//                       >
//                         {p.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                     Category
//                   </label>
//                   <select
//                     value={form.category}
//                     onChange={(e) => setForm({ ...form, category: e.target.value })}
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
//                   >
//                     {CATEGORIES.map((c) => (
//                       <option key={c.value} value={c.value}>{c.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                   Audience
//                 </label>
//                 <AudiencePicker
//                   form={form}
//                   setForm={setForm}
//                   departments={departments}
//                   locations={locations}
//                   roles={roles}
//                   employees={employees}
//                 />
//               </div>

//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                     Schedule (optional)
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={form.scheduled_at}
//                     onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
//                   />
//                   <p className="mt-1 text-[10px] text-slate-400">
//                     Leave blank to publish now
//                   </p>
//                 </div>
//                 <div>
//                   <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                     Expires at (optional)
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={form.expires_at}
//                     onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
//                   />
//                   <p className="mt-1 text-[10px] text-slate-400">
//                     Auto-hide after this date
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
//                   Attachments (URLs)
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     ref={attachmentInput}
//                     placeholder="https://..."
//                     className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const v = attachmentInput.current?.value?.trim();
//                       if (!v) return;
//                       setForm({ ...form, attachments: [...form.attachments, v] });
//                       if (attachmentInput.current) attachmentInput.current.value = "";
//                     }}
//                     className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
//                   >
//                     <Paperclip className="h-3.5 w-3.5" />
//                     Add
//                   </button>
//                 </div>
//                 {form.attachments.length > 0 && (
//                   <div className="mt-2 flex flex-wrap gap-1.5">
//                     {form.attachments.map((url, i) => (
//                       <span
//                         key={i}
//                         className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
//                       >
//                         {url.slice(0, 40)}...
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setForm({
//                               ...form,
//                               attachments: form.attachments.filter((_, ix) => ix !== i),
//                             })
//                           }
//                           className="text-slate-400 hover:text-red-500"
//                         >
//                           <X className="h-3 w-3" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="grid gap-2 sm:grid-cols-2">
//                 <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
//                   <input
//                     type="checkbox"
//                     checked={form.is_pinned}
//                     onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
//                     className="h-4 w-4 rounded accent-[#E42527]"
//                   />
//                   <Pin className="h-4 w-4 text-slate-500" />
//                   <span className="text-xs font-bold text-slate-700">
//                     Pin to top
//                   </span>
//                 </label>
//                 <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
//                   <input
//                     type="checkbox"
//                     checked={form.send_email}
//                     onChange={(e) => setForm({ ...form, send_email: e.target.checked })}
//                     className="h-4 w-4 rounded accent-[#E42527]"
//                   />
//                   <Send className="h-4 w-4 text-slate-500" />
//                   <span className="text-xs font-bold text-slate-700">
//                     Also send email
//                   </span>
//                 </label>
//               </div>
//             </div>

//             <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
//               <button
//                 onClick={() => handleSave(true)}
//                 disabled={saving}
//                 className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//               >
//                 Save as draft
//               </button>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setComposeModal(null)}
//                   disabled={saving}
//                   className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleSave(false)}
//                   disabled={saving}
//                   className="inline-flex items-center gap-2 rounded-xl bg-[#E42527] px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-lg hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <SendHorizontal className="h-4 w-4" />
//                   )}
//                   {form.scheduled_at ? "Schedule" : "Publish"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══════════ VIEW MODAL ═══════════ */}
//       {viewModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
//             <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
//               <div className="flex items-start gap-3">
//                 <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
//                   viewModal.priority === "urgent"
//                     ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
//                     : viewModal.priority === "high"
//                     ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
//                     : "bg-gradient-to-br from-violet-500 to-violet-700 text-white"
//                 }`}>
//                   <Megaphone className="h-5 w-5" />
//                 </div>
//                 <div className="min-w-0">
//                   <div className="flex flex-wrap items-center gap-1.5">
//                     {viewModal.is_pinned && (
//                       <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-black uppercase text-violet-700">
//                         <Pin className="h-2.5 w-2.5" /> Pinned
//                       </span>
//                     )}
//                     <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ring-1 ${priorityTone(viewModal.priority)}`}>
//                       {viewModal.priority}
//                     </span>
//                     <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-600">
//                       {viewModal.category}
//                     </span>
//                   </div>
//                   <h2 className="mt-2 text-xl font-black text-slate-900">
//                     {viewModal.title}
//                   </h2>
//                   <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
//                     <span>{viewModal.posted_by}</span>
//                     <span>·</span>
//                     <span>{fmtDate(viewModal.published_at || viewModal.created_at)}</span>
//                     <span>·</span>
//                     <span className="inline-flex items-center gap-1">
//                       <Target className="h-3 w-3" />
//                       {audienceSummary(viewModal)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setViewModal(null)}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto px-6 py-5">
//               <div
//                 className="prose prose-sm max-w-none text-slate-800"
//                 dangerouslySetInnerHTML={{ __html: viewModal.body }}
//               />

//               {viewModal.attachments?.length > 0 && (
//                 <div className="mt-6 border-t border-slate-100 pt-4">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
//                     Attachments
//                   </p>
//                   <div className="mt-2 space-y-1.5">
//                     {viewModal.attachments.map((url, i) => (
//                       <a
//                         key={i}
//                         href={url}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-white"
//                       >
//                         <Paperclip className="h-3.5 w-3.5" />
//                         <span className="truncate">{url}</span>
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {viewModal.expires_at && (
//                 <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
//                   <Clock className="h-3.5 w-3.5 text-amber-600" />
//                   <p className="text-[11px] font-bold text-amber-700">
//                     Expires on {fmtDate(viewModal.expires_at)}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
//               {isAdmin && (
//                 <button
//                   onClick={() => {
//                     setViewModal(null);
//                     openEdit(viewModal);
//                   }}
//                   className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
//                 >
//                   <Pencil className="h-3.5 w-3.5" />
//                   Edit
//                 </button>
//               )}
//               <button
//                 onClick={() => setViewModal(null)}
//                 className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-slate-800"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══════════ READ RECEIPTS MODAL ═══════════ */}
//       {receiptsModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white px-6 py-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
//                   <BarChart3 className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-black text-slate-900">
//                     Read receipts
//                   </h3>
//                   <p className="text-[11px] font-medium text-slate-500 truncate max-w-xs">
//                     {receiptsModal.announcement.title}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setReceiptsModal(null)}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {receiptsLoading || !receiptsModal.data ? (
//               <div className="p-10 text-center">
//                 <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
//                   <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
//                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
//                       Read
//                     </p>
//                     <p className="mt-0.5 text-xl font-black text-slate-900 tabular-nums">
//                       {receiptsModal.data.total_read}
//                     </p>
//                   </div>
//                   <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
//                     <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
//                       Not read
//                     </p>
//                     <p className="mt-0.5 text-xl font-black text-slate-900 tabular-nums">
//                       {receiptsModal.data.non_readers?.length || 0}
//                     </p>
//                   </div>
//                   <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
//                     <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">
//                       Rate
//                     </p>
//                     <p className="mt-0.5 text-xl font-black text-slate-900 tabular-nums">
//                       {receiptsModal.data.read_percentage}%
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid flex-1 grid-cols-1 overflow-hidden sm:grid-cols-2">
//                   <div className="flex flex-col overflow-hidden border-r border-slate-100">
//                     <div className="border-b border-slate-100 bg-emerald-50/50 px-4 py-2.5">
//                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
//                         Read ({receiptsModal.data.readers?.length || 0})
//                       </p>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-3">
//                       {(receiptsModal.data.readers || []).length === 0 ? (
//                         <p className="py-6 text-center text-xs text-slate-400">
//                           No reads yet
//                         </p>
//                       ) : (
//                         <div className="space-y-1.5">
//                           {receiptsModal.data.readers.map((r, i) => (
//                             <div
//                               key={r.employee_id || i}
//                               className="flex items-center gap-2 rounded-lg bg-emerald-50/40 px-2.5 py-2"
//                             >
//                               <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
//                               <div className="min-w-0 flex-1">
//                                 <p className="truncate text-xs font-bold text-slate-800">
//                                   {r.name}
//                                 </p>
//                                 <p className="text-[10px] text-slate-500">
//                                   {timeAgo(r.read_at)}
//                                 </p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex flex-col overflow-hidden">
//                     <div className="border-b border-slate-100 bg-red-50/50 px-4 py-2.5">
//                       <p className="text-[10px] font-black uppercase tracking-widest text-red-700">
//                         Not read ({receiptsModal.data.non_readers?.length || 0})
//                       </p>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-3">
//                       {(receiptsModal.data.non_readers || []).length === 0 ? (
//                         <p className="py-6 text-center text-xs text-slate-400">
//                           Everyone has read this 🎉
//                         </p>
//                       ) : (
//                         <div className="space-y-1.5">
//                           {receiptsModal.data.non_readers.map((r, i) => (
//                             <div
//                               key={r.employee_id || i}
//                               className="flex items-center gap-2 rounded-lg bg-red-50/40 px-2.5 py-2"
//                             >
//                               <X className="h-3.5 w-3.5 shrink-0 text-red-400" />
//                               <p className="min-w-0 flex-1 truncate text-xs font-bold text-slate-800">
//                                 {r.name}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ═══════════ DELETE CONFIRM ═══════════ */}
//       {deleteId && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
//               <AlertTriangle className="h-6 w-6" />
//             </div>
//             <h3 className="mt-4 text-base font-black text-slate-900">
//               Delete this announcement?
//             </h3>
//             <p className="mt-1 text-xs font-medium text-slate-500">
//               This action cannot be undone. Read receipts will also be removed.
//             </p>
//             <div className="mt-5 flex gap-2">
//               <button
//                 onClick={() => setDeleteId(null)}
//                 className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Megaphone, Plus, Search, Pencil, Trash2, Pin, PinOff, Loader2, X,
  AlertTriangle, CheckCircle2, Bell, ChevronLeft, ChevronRight,
  Eye, Send, Users, Building2, MapPin, Shield, UserCheck2,
  Calendar, Clock, Bold, Italic, Underline, List, ListOrdered,
  Link2, Paperclip, BarChart3, Check, CircleDot, FileText, Globe2,
  SendHorizontal, Inbox, Star, Target, Ban,
} from "lucide-react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

const PRIORITIES = [
  { value: "low", label: "Low", tone: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "normal", label: "Normal", tone: "bg-sky-50 text-sky-700 border-sky-100" },
  { value: "high", label: "High", tone: "bg-amber-50 text-amber-700 border-amber-100" },
  { value: "urgent", label: "Urgent", tone: "bg-red-50 text-red-700 border-red-100" },
];

const CATEGORIES = [
  { value: "general", label: "General", icon: FileText },
  { value: "hr", label: "HR", icon: Users },
  { value: "policy", label: "Policy", icon: Shield },
  { value: "event", label: "Event", icon: Calendar },
  { value: "holiday", label: "Holiday", icon: Globe2 },
  { value: "urgent", label: "Urgent", icon: AlertTriangle },
  { value: "achievement", label: "Achievement", icon: Star },
];

const AUDIENCE_TYPES = [
  { value: "all", label: "Everyone", icon: Users, desc: "All active employees" },
  { value: "departments", label: "Departments", icon: Building2, desc: "Selected departments" },
  { value: "locations", label: "Locations", icon: MapPin, desc: "Selected locations" },
  { value: "roles", label: "Roles", icon: Shield, desc: "Specific roles" },
  { value: "specific", label: "Specific employees", icon: UserCheck2, desc: "Hand-picked people" },
];

const STATUSES = [
  { value: "draft", label: "Draft", tone: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "scheduled", label: "Scheduled", tone: "bg-violet-50 text-violet-700 border-violet-100" },
  { value: "published", label: "Published", tone: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { value: "expired", label: "Expired", tone: "bg-red-50 text-red-700 border-red-100" },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function fmtDate(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function timeAgo(v) {
  if (!v) return "";
  const diff = Math.floor((Date.now() - new Date(v).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return fmtDate(v).split(",")[0];
}

function priorityTone(p) {
  return PRIORITIES.find((x) => x.value === p)?.tone || PRIORITIES[1].tone;
}

function statusTone(s) {
  return STATUSES.find((x) => x.value === s)?.tone || STATUSES[0].tone;
}

function categoryIcon(c) {
  const Icon = CATEGORIES.find((x) => x.value === c)?.icon || FileText;
  return Icon;
}

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
}

/* ═══════════════════════════════════════════════════════
   RICH TEXT EDITOR
   ═══════════════════════════════════════════════════════ */

function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd, arg) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const tools = [
    { icon: Bold, cmd: "bold", title: "Bold (Ctrl+B)" },
    { icon: Italic, cmd: "italic", title: "Italic (Ctrl+I)" },
    { icon: Underline, cmd: "underline", title: "Underline (Ctrl+U)" },
    { icon: List, cmd: "insertUnorderedList", title: "Bullet list" },
    { icon: ListOrdered, cmd: "insertOrderedList", title: "Numbered list" },
  ];

  return (
    <div
      className={`rounded-lg border bg-white transition ${
        focused ? "border-[#E42527] ring-2 ring-red-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {tools.map((t) => (
          <button
            key={t.cmd}
            type="button"
            onClick={() => exec(t.cmd)}
            title={t.title}
            className="rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
          >
            <t.icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) exec("createLink", url);
          }}
          className="rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
          title="Insert link"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          className="rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
          title="Clear formatting"
        >
          <Ban className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        className="prose prose-sm max-w-none px-4 py-3 text-sm text-slate-800 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
        style={{ minHeight: 140 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AUDIENCE PICKER
   ═══════════════════════════════════════════════════════ */

function AudiencePicker({ form, setForm, departments, locations, roles, employees }) {
  const type = form.audience_type;
  const selectedIds =
    type === "departments" ? form.target_department_ids
    : type === "locations" ? form.target_location_ids
    : type === "roles" ? form.target_role_ids
    : type === "specific" ? form.target_employee_ids
    : [];

  const options =
    type === "departments" ? departments
    : type === "locations" ? locations
    : type === "roles" ? roles.map((r) => ({ id: r, name: r }))
    : type === "specific" ? employees
    : [];

  const fieldKey =
    type === "departments" ? "target_department_ids"
    : type === "locations" ? "target_location_ids"
    : type === "roles" ? "target_role_ids"
    : "target_employee_ids";

  const toggle = (id) => {
    if (!id) return;
    const cur = selectedIds || [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    setForm({ ...form, [fieldKey]: next });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {AUDIENCE_TYPES.map((a) => {
          const Icon = a.icon;
          const active = type === a.value;
          return (
            <button
              key={a.value}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  audience_type: a.value,
                  target_department_ids: [],
                  target_location_ids: [],
                  target_role_ids: [],
                  target_employee_ids: [],
                })
              }
              className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition ${
                active
                  ? "border-[#E42527] bg-red-50/60 ring-1 ring-[#E42527]/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                  active ? "bg-[#E42527] text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900">{a.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{a.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {type !== "all" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Select {type === "specific" ? "employees" : type}
            </p>
            <p className="text-[10px] font-semibold text-slate-700">
              {selectedIds?.length || 0} selected
            </p>
          </div>

          {options.length === 0 ? (
            <p className="py-2 text-center text-xs text-slate-400">No options available</p>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-1.5">
                {options.slice(0, 100).map((o) => {
                  const id = o.id || o.employee_id || o.department_id || o.location_id;
                  const name = o.name || o.department_name || o.location_name || o.employee_name || id;
                  const active = selectedIds?.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggle(id)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                        active
                          ? "border-[#E42527] bg-[#E42527] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function AnnouncementsPage() {
  const user = useAuthStore((s) => s.user);
  const role = String(user?.role?.value || user?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role.endsWith("admin");

  const [items, setItems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);

  const [composeModal, setComposeModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewModal, setViewModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [receiptsModal, setReceiptsModal] = useState(null);
  const [receiptsLoading, setReceiptsLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "", body: "", summary: "",
    priority: "normal", category: "general",
    audience_type: "all",
    target_department_ids: [], target_location_ids: [],
    target_role_ids: [], target_employee_ids: [],
    attachments: [], scheduled_at: "", expires_at: "",
    is_pinned: false, send_email: false,
  });

  const attachmentInput = useRef("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, page_size: pageSize, include_expired: true };
      if (search.trim()) params.search = search.trim();
      if (filterPriority) params.priority = filterPriority;
      if (filterCategory) params.category = filterCategory;
      if (filterStatus && isAdmin) params.status = filterStatus;
      if (onlyUnread) params.only_unread = true;

      const res = await api.get("/api/v1/announcements", { params });
      const d = res?.data || res;
      setItems(Array.isArray(d?.announcements) ? d.announcements : []);
      setTotal(d?.total || 0);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, filterPriority, filterCategory, filterStatus, onlyUnread, isAdmin]);

  const fetchReference = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [dRes, lRes, eRes] = await Promise.allSettled([
        api.get("/api/v1/get/departments"),
        api.get("/api/v1/get/location/master"),
        api.get("/api/v1/get/employees"),
      ]);

      if (dRes.status === "fulfilled") {
        const d = dRes.value?.data || dRes.value;
        setDepartments((d?.departments || []).map((x) => ({ id: x.department_id, name: x.department_name })));
      }
      if (lRes.status === "fulfilled") {
        const l = lRes.value?.data || lRes.value;
        setLocations((l?.locations || []).map((x) => ({ id: x.location_id, name: x.location_name })));
      }
      if (eRes.status === "fulfilled") {
        const e = eRes.value?.data || eRes.value;
        setEmployees((e?.employees || []).map((x) => ({ id: x.employee_id, name: x.name || x.employee_id })));
      }
    } catch {}
  }, [isAdmin]);

  const fetchAnalytics = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/api/v1/announcements/analytics");
      setAnalytics(res?.data || res);
    } catch {}
  }, [isAdmin]);

  useEffect(() => {
    const t = setTimeout(() => fetchItems(), 300);
    return () => clearTimeout(t);
  }, [fetchItems]);

  useEffect(() => {
    fetchReference();
    fetchAnalytics();
  }, [fetchReference, fetchAnalytics]);

  const roles = useMemo(
    () => ["admin", "hr", "manager", "team_lead", "employee", "intern", "contractor"],
    []
  );

  const resetForm = () => {
    setForm({
      title: "", body: "", summary: "",
      priority: "normal", category: "general",
      audience_type: "all",
      target_department_ids: [], target_location_ids: [],
      target_role_ids: [], target_employee_ids: [],
      attachments: [], scheduled_at: "", expires_at: "",
      is_pinned: false, send_email: false,
    });
  };

  const openCreate = () => {
    resetForm();
    setEditing(null);
    setComposeModal("create");
  };

  const openEdit = (a) => {
    setForm({
      title: a.title || "", body: a.body || "", summary: a.summary || "",
      priority: a.priority || "normal", category: a.category || "general",
      audience_type: a.audience_type || "all",
      target_department_ids: a.target_department_ids || [],
      target_location_ids: a.target_location_ids || [],
      target_role_ids: a.target_role_ids || [],
      target_employee_ids: a.target_employee_ids || [],
      attachments: a.attachments || [],
      scheduled_at: a.scheduled_at ? a.scheduled_at.slice(0, 16) : "",
      expires_at: a.expires_at ? a.expires_at.slice(0, 16) : "",
      is_pinned: !!a.is_pinned,
      send_email: !!a.send_email,
    });
    setEditing(a);
    setComposeModal("edit");
  };

  const handleSave = async (asDraft = false) => {
    if (!form.title.trim() || !stripHtml(form.body).trim()) {
      toast.error("Title and message are required");
      return;
    }
    if (form.audience_type !== "all") {
      const key =
        form.audience_type === "departments" ? "target_department_ids"
        : form.audience_type === "locations" ? "target_location_ids"
        : form.audience_type === "roles" ? "target_role_ids"
        : "target_employee_ids";
      if (!form[key] || form[key].length === 0) {
        toast.error("Please select at least one audience member");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body,
        summary: form.summary.trim() || stripHtml(form.body).slice(0, 200),
        priority: form.priority,
        category: form.category,
        audience_type: form.audience_type,
        target_department_ids: form.target_department_ids,
        target_location_ids: form.target_location_ids,
        target_role_ids: form.target_role_ids,
        target_employee_ids: form.target_employee_ids,
        attachments: form.attachments,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        is_pinned: form.is_pinned,
        send_email: form.send_email,
        save_as_draft: asDraft,
      };

      if (composeModal === "create") {
        await api.post("/api/v1/announcements", payload);
        toast.success(asDraft ? "Saved as draft" : "Published!");
      } else {
        await api.put(`/api/v1/announcements/${editing.announcement_id}`, payload);
        toast.success("Updated!");
      }
      setComposeModal(null);
      fetchItems();
      fetchAnalytics();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/v1/announcements/${deleteId}`);
      toast.success("Deleted");
      setDeleteId(null);
      fetchItems();
      fetchAnalytics();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleTogglePin = async (a) => {
    try {
      await api.post(`/api/v1/announcements/${a.announcement_id}/toggle-pin`);
      fetchItems();
    } catch {
      toast.error("Pin toggle failed");
    }
  };

  const handlePublish = async (a) => {
    try {
      await api.post(`/api/v1/announcements/${a.announcement_id}/publish`);
      toast.success("Published!");
      fetchItems();
      fetchAnalytics();
    } catch {
      toast.error("Publish failed");
    }
  };

  const openView = async (a) => {
    setViewModal(a);
    if (a.is_read) return;
    try {
      await api.post(`/api/v1/announcements/${a.announcement_id}/read`);
      setItems((prev) =>
        prev.map((item) =>
          item.announcement_id === a.announcement_id ? { ...item, is_read: true } : item
        )
      );
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  };

  const openReceipts = async (a) => {
    setReceiptsLoading(true);
    setReceiptsModal({ announcement: a, data: null });
    try {
      const res = await api.get(`/api/v1/announcements/${a.announcement_id}/reads`);
      setReceiptsModal({ announcement: a, data: res?.data || res });
    } catch {
      toast.error("Failed to load receipts");
      setReceiptsModal(null);
    } finally {
      setReceiptsLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const audienceSummary = (a) => {
    const t = a.audience_type;
    if (t === "all") return "Everyone";
    if (t === "departments") return `${(a.target_department_ids || []).length} department(s)`;
    if (t === "locations") return `${(a.target_location_ids || []).length} location(s)`;
    if (t === "roles") return `${(a.target_role_ids || []).length} role(s)`;
    if (t === "specific") return `${(a.target_employee_ids || []).length} employee(s)`;
    return "—";
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 sm:p-6">

        {/* ═══════ HEADER BOX ═══════ */}
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="cursor-pointer hover:text-slate-700">Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="cursor-pointer hover:text-slate-700">Communication</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-700">Announcements</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#E42527]">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Announcements
                </h1>
                <p className="mt-0.5 text-[13px] text-slate-500">
                  {isAdmin
                    ? "Broadcast updates, target teams, track reads"
                    : "Company updates & notices"}
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={openCreate}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#E42527] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
              >
                <Plus className="h-4 w-4" />
                New announcement
              </button>
            )}
          </div>
        </div>

        {/* ═══════ ANALYTICS ═══════ */}
        {isAdmin && analytics && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatBox icon={<Inbox className="h-4 w-4" />} label="Total" value={analytics.total} />
            <StatBox icon={<CheckCircle2 className="h-4 w-4" />} label="Published" value={analytics.published} tone="emerald" />
            <StatBox icon={<FileText className="h-4 w-4" />} label="Drafts" value={analytics.drafts} />
            <StatBox icon={<Clock className="h-4 w-4" />} label="Scheduled" value={analytics.scheduled} tone="violet" />
            <StatBox icon={<Pin className="h-4 w-4" />} label="Pinned" value={analytics.pinned} tone="amber" />
            <StatBox icon={<Eye className="h-4 w-4" />} label="Total reads" value={analytics.total_reads} tone="sky" />
          </div>
        )}

        {/* ═══════ FILTERS ═══════ */}
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid gap-2 lg:grid-cols-12">
            <div className="relative lg:col-span-4">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search title, body..."
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-800 outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-red-100 lg:col-span-2"
            >
              <option value="">All priority</option>
              {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-800 outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-red-100 lg:col-span-2"
            >
              <option value="">All category</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {isAdmin && (
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="h-9 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-800 outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-red-100 lg:col-span-2"
              >
                <option value="">All status</option>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            )}
            <label className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 ${isAdmin ? "lg:col-span-2" : "lg:col-span-4"}`}>
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => { setOnlyUnread(e.target.checked); setPage(1); }}
                className="h-3.5 w-3.5 rounded border-slate-300 accent-[#E42527]"
              />
              <span className="text-xs font-medium text-slate-700">Unread only</span>
            </label>
          </div>
        </div>

        {/* ═══════ ERROR ═══════ */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="font-medium">Error:</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* ═══════ LIST ═══════ */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📢
            </div>
            <p className="text-sm font-semibold text-slate-700">No announcements yet</p>
            <p className="mt-1 text-xs text-slate-500">
              {isAdmin
                ? "Create your first announcement to broadcast to your team."
                : "You'll see company updates here when they arrive."}
            </p>
            {isAdmin && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={openCreate}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#E42527] px-4 text-sm font-medium text-white transition hover:bg-[#c91f21]"
                >
                  <Plus className="h-4 w-4" />
                  Create announcement
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((a) => {
              const CatIcon = categoryIcon(a.category);
              const unread = !a.is_read;
              return (
                <div
                  key={a.announcement_id}
                  className={`group relative overflow-hidden rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md ${
                    a.is_pinned
                      ? "border-violet-200"
                      : unread
                      ? "border-[#E42527]/40"
                      : "border-slate-200"
                  }`}
                >
                  {unread && (
                    <span className="absolute left-0 top-0 h-full w-0.5 bg-[#E42527]" />
                  )}

                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        a.priority === "urgent"
                          ? "bg-red-50 text-red-600"
                          : a.priority === "high"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-red-50 text-[#E42527]"
                      }`}
                    >
                      <Megaphone className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {a.is_pinned && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-violet-100 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                            <Pin className="h-2.5 w-2.5" />
                            Pinned
                          </span>
                        )}
                        {unread && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-[#E42527]">
                            <CircleDot className="h-2.5 w-2.5" />
                            New
                          </span>
                        )}
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityTone(a.priority)}`}>
                          {a.priority}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          <CatIcon className="h-2.5 w-2.5" />
                          {a.category}
                        </span>
                        {isAdmin && (
                          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusTone(a.status)}`}>
                            {a.status}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => openView(a)}
                        className="mt-2 block w-full text-left"
                      >
                        <h3 className="text-[15px] font-semibold text-slate-900 hover:text-[#E42527]">
                          {a.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[13px] text-slate-600">
                          {a.summary || stripHtml(a.body).slice(0, 180)}
                        </p>
                      </button>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Send className="h-3 w-3" />
                          {a.posted_by}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span>{timeAgo(a.published_at || a.created_at)}</span>
                        <span className="text-slate-300">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {audienceSummary(a)}
                        </span>
                        {isAdmin && a.status === "published" && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                              <Eye className="h-3 w-3" />
                              {a.read_count}/{a.audience_count} read ({a.read_percentage}%)
                            </span>
                          </>
                        )}
                        {a.expires_at && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-amber-600">
                              Expires {fmtDate(a.expires_at).split(",")[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ADMIN ACTIONS */}
                  {isAdmin && (
                    <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
                      <ActionBtn icon={<Pencil className="h-3 w-3" />} onClick={() => openEdit(a)}>
                        Edit
                      </ActionBtn>
                      {(a.status === "draft" || a.status === "scheduled") && (
                        <button
                          onClick={() => handlePublish(a)}
                          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <SendHorizontal className="h-3 w-3" />
                          Publish now
                        </button>
                      )}
                      <ActionBtn
                        icon={a.is_pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                        onClick={() => handleTogglePin(a)}
                      >
                        {a.is_pinned ? "Unpin" : "Pin"}
                      </ActionBtn>
                      {a.status === "published" && (
                        <ActionBtn
                          icon={<BarChart3 className="h-3 w-3" />}
                          onClick={() => openReceipts(a)}
                        >
                          Read receipts
                        </ActionBtn>
                      )}
                      <button
                        onClick={() => setDeleteId(a.announcement_id)}
                        className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════ PAGINATION ═══════ */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">
              Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span> · {total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-3 w-3" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════ COMPOSE MODAL ═══════ */}
      {composeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setComposeModal(null); }}
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E42527] text-white">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {composeModal === "create" ? "New announcement" : "Edit announcement"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Compose and target your audience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setComposeModal(null)}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Office closed for Diwali — 1 Nov"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <RichEditor
                  value={form.body}
                  onChange={(v) => setForm({ ...form, body: v })}
                  placeholder="Write your announcement... Use the toolbar to format."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Priority
                  </label>
                  <div className="flex gap-1.5">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setForm({ ...form, priority: p.value })}
                        className={`flex-1 rounded-md border px-2 py-2 text-[11px] font-semibold uppercase tracking-wide transition ${
                          form.priority === p.value
                            ? p.tone
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Audience
                </label>
                <AudiencePicker
                  form={form}
                  setForm={setForm}
                  departments={departments}
                  locations={locations}
                  roles={roles}
                  employees={employees}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Schedule (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                  />
                  <p className="mt-1 text-[10px] text-slate-400">Leave blank to publish now</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Expires at (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                  />
                  <p className="mt-1 text-[10px] text-slate-400">Auto-hide after this date</p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Attachments (URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    ref={attachmentInput}
                    placeholder="https://..."
                    className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = attachmentInput.current?.value?.trim();
                      if (!v) return;
                      setForm({ ...form, attachments: [...form.attachments, v] });
                      if (attachmentInput.current) attachmentInput.current.value = "";
                    }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                {form.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.attachments.map((url, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700"
                      >
                        {url.slice(0, 40)}...
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              attachments: form.attachments.filter((_, ix) => ix !== i),
                            })
                          }
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <input
                    type="checkbox"
                    checked={form.is_pinned}
                    onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                  />
                  <Pin className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">Pin to top</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <input
                    type="checkbox"
                    checked={form.send_email}
                    onChange={(e) => setForm({ ...form, send_email: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                  />
                  <Send className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">Also send email</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Save as draft
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setComposeModal(null)}
                  disabled={saving}
                  className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#E42527] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                  {form.scheduled_at ? "Schedule" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ VIEW MODAL ═══════ */}
      {viewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setViewModal(null); }}
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  viewModal.priority === "urgent"
                    ? "bg-red-50 text-red-600"
                    : viewModal.priority === "high"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-red-50 text-[#E42527]"
                }`}>
                  <Megaphone className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {viewModal.is_pinned && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-violet-100 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                        <Pin className="h-2.5 w-2.5" /> Pinned
                      </span>
                    )}
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityTone(viewModal.priority)}`}>
                      {viewModal.priority}
                    </span>
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {viewModal.category}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    {viewModal.title}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span>{viewModal.posted_by}</span>
                    <span className="text-slate-300">·</span>
                    <span>{fmtDate(viewModal.published_at || viewModal.created_at)}</span>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {audienceSummary(viewModal)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewModal(null)}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div
                className="prose prose-sm max-w-none text-slate-800"
                dangerouslySetInnerHTML={{ __html: viewModal.body }}
              />

              {viewModal.attachments?.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Attachments
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {viewModal.attachments.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {viewModal.expires_at && (
                <div className="mt-6 flex items-center gap-2 rounded-md border border-amber-100 bg-amber-50 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <p className="text-[11px] font-semibold text-amber-700">
                    Expires on {fmtDate(viewModal.expires_at)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    setViewModal(null);
                    openEdit(viewModal);
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
              <button
                onClick={() => setViewModal(null)}
                className="inline-flex h-9 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ READ RECEIPTS MODAL ═══════ */}
      {receiptsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setReceiptsModal(null); }}
        >
          <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Read receipts</h3>
                  <p className="max-w-xs truncate text-[11px] text-slate-500">
                    {receiptsModal.announcement.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReceiptsModal(null)}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {receiptsLoading || !receiptsModal.data ? (
              <div className="p-10 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 border-b border-slate-200 bg-slate-50/60 px-5 py-4">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Read</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">
                      {receiptsModal.data.total_read}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600">Not read</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">
                      {receiptsModal.data.non_readers?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600">Rate</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">
                      {receiptsModal.data.read_percentage}%
                    </p>
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-1 overflow-hidden sm:grid-cols-2">
                  <div className="flex flex-col overflow-hidden border-r border-slate-200">
                    <div className="border-b border-slate-200 bg-emerald-50/60 px-4 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        Read ({receiptsModal.data.readers?.length || 0})
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                      {(receiptsModal.data.readers || []).length === 0 ? (
                        <p className="py-6 text-center text-xs text-slate-400">No reads yet</p>
                      ) : (
                        <div className="space-y-1.5">
                          {receiptsModal.data.readers.map((r, i) => (
                            <div
                              key={r.employee_id || i}
                              className="flex items-center gap-2 rounded-md bg-emerald-50/40 px-2.5 py-2"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-800">{r.name}</p>
                                <p className="text-[10px] text-slate-500">{timeAgo(r.read_at)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <div className="border-b border-slate-200 bg-red-50/60 px-4 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-red-700">
                        Not read ({receiptsModal.data.non_readers?.length || 0})
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                      {(receiptsModal.data.non_readers || []).length === 0 ? (
                        <p className="py-6 text-center text-xs text-slate-400">
                          Everyone has read this 🎉
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {receiptsModal.data.non_readers.map((r, i) => (
                            <div
                              key={r.employee_id || i}
                              className="flex items-center gap-2 rounded-md bg-red-50/40 px-2.5 py-2"
                            >
                              <X className="h-3.5 w-3.5 shrink-0 text-red-400" />
                              <p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800">
                                {r.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════ DELETE CONFIRM ═══════ */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}
        >
          <div className="w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
            <div className="px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Delete this announcement?
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    This action cannot be undone. Read receipts will also be removed.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button
                onClick={() => setDeleteId(null)}
                className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex h-9 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function StatBox({ icon, label, value, tone = "slate" }) {
  const tones = {
    slate: "text-slate-500 bg-slate-50",
    emerald: "text-emerald-600 bg-emerald-50",
    violet: "text-violet-600 bg-violet-50",
    amber: "text-amber-600 bg-amber-50",
    sky: "text-sky-600 bg-sky-50",
  };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${tones[tone]}`}>
        {icon}
      </div>
      <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function ActionBtn({ icon, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      {icon}
      {children}
    </button>
  );
}