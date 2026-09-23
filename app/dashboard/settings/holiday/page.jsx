// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { api } from "@/app/lib/api";

// const initialForm = {
//   holiday_name: "",
//   date: "",
//   holiday_message: "",
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
//   return err?.message || "Something went wrong";
// };

// const getCompanyId = () => {
//   if (typeof window === "undefined") return null;

//   const keys = ["company_id", "companyId", "tenant_id", "tenantId"];
//   for (const key of keys) {
//     const val = localStorage.getItem(key);
//     if (val) return val;
//   }

//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     return (
//       user.company_id ||
//       user.companyId ||
//       user.tenant_id ||
//       user.tenantId ||
//       user.company?.company_id ||
//       null
//     );
//   } catch {
//     return null;
//   }
// };

// const normalizeHolidayList = (payload) => {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;
//   if (Array.isArray(payload.data)) return payload.data;
//   if (Array.isArray(payload.items)) return payload.items;
//   if (Array.isArray(payload.results)) return payload.results;
//   if (Array.isArray(payload.holidays)) return payload.holidays;
//   if (payload.data && typeof payload.data === "object") return [payload.data];
//   return typeof payload === "object" ? [payload] : [];
// };

// export default function HolidayPage() {
//   const [list, setList] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [companyId] = useState(getCompanyId());

//   useEffect(() => {
//     if (!companyId) {
//       return;
//     }

//     const fetchData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const res = await api.get("/api/v1/all/holidays", {
//           params: { company_id: companyId },
//         });

//         const items = normalizeHolidayList(res.data);
//         const filtered = search
//           ? items.filter((item) =>
//               [item.holiday_name, item.date, item.holiday_message]
//                 .join(" ")
//                 .toLowerCase()
//                 .includes(search.toLowerCase())
//             )
//           : items;

//         setList(filtered);
//         setTotal(filtered.length);
//       } catch (err) {
//         setError(formatApiError(err));
//         setList([]);
//         setTotal(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [companyId, search]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const openAdd = () => {
//     setEditId(null);
//     setFormData(initialForm);
//     setError("");
//     setShowForm(true);
//   };

//   const openEdit = (item) => {
//     const id = item.holiday_id ?? item.id ?? item._id ?? null;

//     setEditId(id);
//     setFormData({
//       holiday_name: item.holiday_name || "",
//       date: item.date ? String(item.date).slice(0, 10) : "",
//       holiday_message: item.holiday_message || "",
//     });
//     setError("");
//     setShowForm(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       // Exact match with your backend schemas
//       const payload = {
//         date: formData.date,
//         holiday_name: formData.holiday_name,
//         holiday_message: formData.holiday_message || null,
//       };

//       if (editId) {
//         await api.put(`/api/v1/update/holidays/${editId}`, payload);
//       } else {
//         await api.post("/api/v1/create/holidays", payload); // ← correct path
//       }

//       setShowForm(false);
//       setFormData(initialForm);
//       setEditId(null);
//       setPage(1);

//       // Refresh list
//       const res = await api.get("/api/v1/all/holidays", {
//         params: { company_id: companyId },
//       });
//       const items = normalizeHolidayList(res.data);
//       const filtered = search
//         ? items.filter((item) =>
//             [item.holiday_name, item.date, item.holiday_message]
//               .join(" ")
//               .toLowerCase()
//               .includes(search.toLowerCase())
//           )
//         : items;
//       setList(filtered);
//       setTotal(filtered.length);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const totalPages = Math.max(Math.ceil(total / pageSize), 1);

//   const paginatedList = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return list.slice(start, start + pageSize);
//   }, [list, page, pageSize]);

//   const handleDelete = async (id) => {
//     if (!id) {
//       setError("Invalid holiday ID");
//       return;
//     }
//     if (!window.confirm("Are you sure you want to delete this holiday?")) return;

//     try {
//       await api.delete(`/api/v1/delete/holidays/${id}`);

//       const res = await api.get("/api/v1/all/holidays", {
//         params: { company_id: companyId },
//       });
//       const items = normalizeHolidayList(res.data);
//       const filtered = search
//         ? items.filter((item) =>
//             [item.holiday_name, item.date, item.holiday_message]
//               .join(" ")
//               .toLowerCase()
//               .includes(search.toLowerCase())
//           )
//         : items;
//       setList(filtered);
//       setTotal(filtered.length);
//     } catch (err) {
//       setError(formatApiError(err));
//     }
//   };

//   return (
//     <div>
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">Holiday</h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Manage company holidays and calendar
//           </p>
//         </div>
//         <button
//           onClick={openAdd}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//         >
//           + Add Holiday
//         </button>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
//           <input
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search holidays..."
//             className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
//           />
//           <span className="text-sm text-slate-500">{total} holidays</span>
//         </div>

//         {error && !showForm && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">No holidays found</div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/80">
//                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Holiday Name</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Date</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Message</th>
//                   <th className="px-5 py-3 font-medium text-slate-500 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {paginatedList.map((item, i) => {
//                   const holidayId = item.holiday_id ?? item.id ?? item._id;

//                   return (
//                     <tr key={holidayId ?? i} className="hover:bg-slate-50/70">
//                       <td className="px-5 py-3.5 text-slate-500">
//                         {(page - 1) * pageSize + i + 1}
//                       </td>
//                       <td className="px-5 py-3.5 font-medium text-slate-800">
//                         {item.holiday_name ?? "—"}
//                       </td>
//                       <td className="px-5 py-3.5 text-slate-600">
//                         {item.date ? new Date(item.date).toLocaleDateString() : "—"}
//                       </td>
//                       <td className="px-5 py-3.5 text-slate-600">
//                         {item.holiday_message || "—"}
//                       </td>
//                       <td className="px-5 py-3.5 text-right space-x-2">
//                         <button
//                           onClick={() => openEdit(item)}
//                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(holidayId)}
//                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex justify-between border-t border-slate-100 px-4 py-3">
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

//       {/* Modal Form */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Holiday" : "Add Holiday"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowForm(false);
//                   setError("");
//                 }}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div className="sm:col-span-2">
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Holiday Name *
//                     </label>
//                     <input
//                       required
//                       value={formData.holiday_name}
//                       onChange={(e) => handleChange("holiday_name", e.target.value)}
//                       placeholder="e.g. Independence Day, Diwali"
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Date *
//                     </label>
//                     <input
//                       required
//                       type="date"
//                       value={formData.date}
//                       onChange={(e) => handleChange("date", e.target.value)}
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>

//                   <div className="sm:col-span-2">
//                     <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                       Holiday Message
//                     </label>
//                     <textarea
//                       value={formData.holiday_message}
//                       onChange={(e) => handleChange("holiday_message", e.target.value)}
//                       rows={3}
//                       placeholder="Optional message..."
//                       className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     />
//                   </div>
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
//                   onClick={() => setShowForm(false)}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? "Saving..." : editId ? "Update" : "Submit"}
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
// CONSTANTS
// ---------------------------------------------------------------------------
const initialForm = {
  holiday_name: "",
  date: "",
  holiday_message: "",
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) =>
        Array.isArray(e.loc) ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
      )
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const getCompanyId = () => {
  if (typeof window === "undefined") return null;

  const keys = ["company_id", "companyId", "tenant_id", "tenantId"];
  for (const key of keys) {
    const val = localStorage.getItem(key);
    if (val) return val;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return (
      user.company_id ||
      user.companyId ||
      user.tenant_id ||
      user.tenantId ||
      user.company?.company_id ||
      null
    );
  } catch {
    return null;
  }
};

const normalizeHolidayList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.holidays)) return payload.holidays;
  if (payload.data && typeof payload.data === "object") return [payload.data];
  return typeof payload === "object" ? [payload] : [];
};

const getHolidayId = (item) => item?.holiday_id ?? item?.id ?? item?._id;

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDayName = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString([], { weekday: "long" });
};

const isUpcoming = (value) => {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d >= today;
};

const isPast = (value) => {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
};

const daysUntil = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
};

// ---------------------------------------------------------------------------
// ICONS
// ---------------------------------------------------------------------------
const Icons = {
  Plus: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Search: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Close: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Calendar: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Edit: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  ),
  Chevron: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// PRIMITIVES
// ---------------------------------------------------------------------------
const Badge = ({ children, tone = "slate", dot = false }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-red-50 text-red-700 border-red-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
  };
  const dots = {
    slate: "bg-slate-400",
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />}
      {children}
    </span>
  );
};

const Btn = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  ...props
}) => {
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3.5 py-2 text-sm",
    lg: "px-4 py-2.5 text-sm",
  };
  const variants = {
    primary:
      "bg-[#E42527] text-white shadow-sm hover:bg-[#c91f21] border border-[#E42527]",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent",
    danger:
      "bg-white text-red-600 border border-slate-200 hover:bg-red-50 hover:border-red-200 shadow-sm",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
};

const ModalShell = ({ title, subtitle, onClose, children, footer, wide }) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-12 backdrop-blur-[2px]"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div
      className={`mb-10 w-full ${wide ? "max-w-3xl" : "max-w-xl"} overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl`}
      role="dialog"
    >
      <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
        >
          <Icons.Close />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          {footer}
        </div>
      )}
    </div>
  </div>
);

const Field = ({ label, required, hint, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
  </div>
);

const inputCls =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100";

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------
export default function HolidayPage() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [companyId] = useState(getCompanyId());
  const [activeTab, setActiveTab] = useState("upcoming");

  const fetchHolidays = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/all/holidays", {
        params: { company_id: companyId },
      });
      const items = normalizeHolidayList(res.data);
      const filtered = search
        ? items.filter((item) =>
            [item.holiday_name, item.date, item.holiday_message]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase())
          )
        : items;

      // Sort by date ascending
      filtered.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      setList(filtered);
      setTotal(filtered.length);
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) return;
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, search]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    const id = getHolidayId(item);
    setEditId(id);
    setFormData({
      holiday_name: item.holiday_name || "",
      date: item.date ? String(item.date).slice(0, 10) : "",
      holiday_message: item.holiday_message || "",
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setFormData(initialForm);
    setEditId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        date: formData.date,
        holiday_name: formData.holiday_name,
        holiday_message: formData.holiday_message || null,
      };

      if (editId) {
        await api.put(`/api/v1/update/holidays/${editId}`, payload);
      } else {
        await api.post("/api/v1/create/holidays", payload);
      }

      closeForm();
      setPage(1);
      await fetchHolidays();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid holiday ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;

    try {
      await api.delete(`/api/v1/delete/holidays/${id}`);
      await fetchHolidays();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  // Filter by tab
  const tabFilteredList = useMemo(() => {
    if (activeTab === "upcoming") return list.filter((h) => isUpcoming(h.date));
    if (activeTab === "past") return list.filter((h) => isPast(h.date));
    return list;
  }, [list, activeTab]);

  const totalPages = Math.max(Math.ceil(tabFilteredList.length / pageSize), 1);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return tabFilteredList.slice(start, start + pageSize);
  }, [tabFilteredList, page, pageSize]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // Stats
  const upcomingCount = list.filter((h) => isUpcoming(h.date)).length;
  const pastCount = list.filter((h) => isPast(h.date)).length;
  const nextHoliday = list
    .filter((h) => isUpcoming(h.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 sm:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        {/* ═══════════ HEADER BOX ═══════════ */}
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="cursor-pointer hover:text-slate-700">Home</span>
            <Icons.Chevron />
            <span className="cursor-pointer hover:text-slate-700">
              Attendance
            </span>
            <Icons.Chevron />
            <span className="font-medium text-slate-700">Holidays</span>
          </div>

          {/* Title row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Holiday Calendar
              </h1>
              <p className="mt-1 text-[13px] text-slate-500">
                Manage company holidays and view the yearly calendar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="primary" icon={<Icons.Plus />} onClick={openAdd}>
                Add Holiday
              </Btn>
            </div>
          </div>
        </div>

        {/* ═══════════ ERROR ═══════════ */}
        {error && !showForm && (
          <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* ═══════════ STATS ═══════════ */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Holidays"
            value={list.length}
            icon="📅"
            tone="blue"
          />
          <StatCard
            label="Upcoming"
            value={upcomingCount}
            icon="🎉"
            tone="green"
          />
          <StatCard
            label="Past Holidays"
            value={pastCount}
            icon="✅"
            tone="amber"
          />
          <StatCard
            label="Next Holiday"
            value={nextHoliday ? formatDate(nextHoliday.date) : "—"}
            icon="⏭️"
            tone="red"
            small
          />
        </div>

        {/* ═══════════ TABS + CONTENT BOX ═══════════ */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex">
              <TabBtn
                active={activeTab === "upcoming"}
                onClick={() => setActiveTab("upcoming")}
                count={upcomingCount}
              >
                Upcoming
              </TabBtn>
              <TabBtn
                active={activeTab === "past"}
                onClick={() => setActiveTab("past")}
                count={pastCount}
              >
                Past
              </TabBtn>
              <TabBtn
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                count={list.length}
              >
                All Holidays
              </TabBtn>
            </div>

            <div className="relative mb-3 sm:mb-0 sm:w-72">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icons.Search />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search holidays..."
                className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          <HolidaysTable
            holidays={paginatedList}
            loading={loading}
            search={search}
            startIndex={(page - 1) * pageSize}
            onEdit={openEdit}
            onDelete={handleDelete}
            onAdd={openAdd}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 sm:px-5">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages} · Showing{" "}
                {paginatedList.length} of {tabFilteredList.length}
              </span>
              <div className="flex gap-2">
                <Btn
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Btn>
                <Btn
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ ADD / EDIT MODAL ═══════════ */}
      {showForm && (
        <ModalShell
          title={editId ? "Edit Holiday" : "Add New Holiday"}
          subtitle={
            editId
              ? "Update holiday details"
              : "Create a holiday for your organization"
          }
          onClose={closeForm}
          footer={
            <>
              <Btn variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Btn>
              <Btn type="submit" form="holiday-form" disabled={saving}>
                {saving ? "Saving..." : editId ? "Update Holiday" : "Create Holiday"}
              </Btn>
            </>
          }
        >
          <form id="holiday-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <Field label="Holiday Name" required>
              <input
                type="text"
                required
                value={formData.holiday_name}
                onChange={(e) => handleChange("holiday_name", e.target.value)}
                placeholder="e.g. Independence Day, Diwali"
                className={inputCls}
              />
            </Field>

            <Field label="Date" required hint="Day of the holiday">
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Holiday Message" hint="Optional note shown to employees">
              <textarea
                value={formData.holiday_message}
                onChange={(e) => handleChange("holiday_message", e.target.value)}
                rows={3}
                placeholder="e.g. Office will remain closed. Happy holidays!"
                className={inputCls}
              />
            </Field>
          </form>
        </ModalShell>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------
const StatCard = ({ label, value, icon, tone = "blue", small = false }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p
            className={`mt-1.5 truncate font-bold tracking-tight text-slate-900 ${
              small ? "text-base" : "text-2xl"
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, count, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex items-center gap-2 py-3.5 text-sm font-medium transition ${
      active ? "text-[#E42527]" : "text-slate-500 hover:text-slate-700"
    }`}
    style={{ marginRight: 24 }}
  >
    {children}
    {typeof count === "number" && (
      <span
        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
          active ? "bg-red-50 text-[#E42527]" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    )}
    {active && (
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E42527]" />
    )}
  </button>
);

const HolidaysTable = ({
  holidays,
  loading,
  search,
  startIndex,
  onEdit,
  onDelete,
  onAdd,
}) => {
  if (loading) {
    return (
      <div className="space-y-2 p-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-md bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!holidays || holidays.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
          📅
        </div>
        <p className="text-sm font-semibold text-slate-700">
          {search ? "No holidays match your search" : "No holidays yet"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {search
            ? "Try a different keyword."
            : "Create your first holiday to get started."}
        </p>
        {!search && (
          <div className="mt-4 flex justify-center">
            <Btn icon={<Icons.Plus />} onClick={onAdd}>
              Add Holiday
            </Btn>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-semibold w-14">#</th>
            <th className="px-5 py-3 font-semibold">Holiday Name</th>
            <th className="px-5 py-3 font-semibold">Date</th>
            <th className="px-5 py-3 font-semibold">Day</th>
            <th className="px-5 py-3 font-semibold">Message</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {holidays.map((item, i) => {
            const id = getHolidayId(item);
            const upcoming = isUpcoming(item.date);
            const days = daysUntil(item.date);

            return (
              <tr key={id ?? i} className="transition hover:bg-slate-50">
                <td className="px-5 py-3.5 text-slate-500">
                  {startIndex + i + 1}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">
                      {item.holiday_name ?? "—"}
                    </span>
                    {upcoming && days !== null && days >= 0 && days <= 7 && (
                      <Badge tone="amber" dot>
                        {days === 0
                          ? "Today"
                          : days === 1
                            ? "Tomorrow"
                            : `in ${days}d`}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <Icons.Calendar />
                    {formatDate(item.date)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {getDayName(item.date) || "—"}
                </td>
                <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                  {item.holiday_message || "—"}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn
                      title="Edit"
                      icon={<Icons.Edit />}
                      onClick={() => onEdit(item)}
                    />
                    <IconBtn
                      title="Delete"
                      icon={<Icons.Trash />}
                      onClick={() => onDelete(id)}
                      danger
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const IconBtn = ({ icon, title, onClick, danger }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`rounded-md border border-transparent p-1.5 transition ${
      danger
        ? "text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        : "text-slate-500 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700"
    }`}
  >
    {icon}
  </button>
);