// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { api } from "@/lib/api";

// const DAYS = [
//   { key: "monday", label: "Monday" },
//   { key: "tuesday", label: "Tuesday" },
//   { key: "wednesday", label: "Wednesday" },
//   { key: "thursday", label: "Thursday" },
//   { key: "friday", label: "Friday" },
//   { key: "saturday", label: "Saturday" },
//   { key: "sunday", label: "Sunday" },
// ];

// const initialForm = {
//   monday: false,
//   tuesday: false,
//   wednesday: false,
//   thursday: false,
//   friday: false,
//   saturday: false,
//   sunday: false,
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

// const normalizeList = (payload) => {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;
//   if (Array.isArray(payload.data)) return payload.data;
//   if (Array.isArray(payload.items)) return payload.items;
//   if (Array.isArray(payload.results)) return payload.results;
//   if (Array.isArray(payload.working_days)) return payload.working_days;
//   if (Array.isArray(payload.workingDays)) return payload.workingDays;
//   if (payload.data && typeof payload.data === "object") return [payload.data];
//   return typeof payload === "object" ? [payload] : [];
// };

// const createRouteVariants = [
//   "/api/v1/create/working-days",
//   "/api/v1/add/working-days",
//   "/api/v1/working-days",
// ];

// const fetchRouteVariants = [
//   "/api/v1/all/working-days",
//   "/api/v1/get/all/working-days",
//   "/api/v1/get/working-days",
// ];

// const updateRouteVariants = [
//   "/api/v1/update/working-days",
//   "/api/v1/put/working-days",
// ];

// const deleteRouteVariants = [
//   "/api/v1/delete/working-days",
//   "/api/v1/remove/working-days",
// ];

// export default function WorkingDaysPage() {
//   const [list, setList] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [companyId, setCompanyId] = useState(null);

//   useEffect(() => {
//     setCompanyId(getCompanyId());
//   }, []);

//   const fetchData = async () => {
//     if (!companyId) {
//       setError("Company ID not found. Please login again.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       let lastError = null;

//       for (const endpoint of fetchRouteVariants) {
//         try {
//           const res = await api.get(endpoint, {
//             params: { company_id: companyId },
//           });
//           const items = normalizeList(res.data);
//           setList(items);
//           setLoading(false);
//           return;
//         } catch (err) {
//           lastError = err;
//         }
//       }

//       throw lastError || new Error("No working-days endpoint available");
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (companyId) {
//       fetchData();
//     }
//   }, [companyId]);

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
//     const id = item.working_day_id ?? item.id ?? item._id ?? null;
//     setEditId(id);
//     setFormData({
//       monday: !!item.monday,
//       tuesday: !!item.tuesday,
//       wednesday: !!item.wednesday,
//       thursday: !!item.thursday,
//       friday: !!item.friday,
//       saturday: !!item.saturday,
//       sunday: !!item.sunday,
//     });
//     setError("");
//     setShowForm(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       const payload = {
//         company_id: companyId,
//         monday: formData.monday,
//         tuesday: formData.tuesday,
//         wednesday: formData.wednesday,
//         thursday: formData.thursday,
//         friday: formData.friday,
//         saturday: formData.saturday,
//         sunday: formData.sunday,
//       };

//       if (editId) {
//         let lastError = null;

//         for (const base of updateRouteVariants) {
//           try {
//             await api.put(`${base}/${editId}`, payload);
//             break;
//           } catch (err) {
//             lastError = err;
//           }
//         }

//         if (lastError) throw lastError;
//       } else {
//         let lastError = null;

//         for (const endpoint of createRouteVariants) {
//           try {
//             await api.post(endpoint, payload);
//             break;
//           } catch (err) {
//             lastError = err;
//           }
//         }

//         if (lastError) throw lastError;
//       }

//       setShowForm(false);
//       setFormData(initialForm);
//       setEditId(null);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!id) {
//       setError("Invalid working day ID");
//       return;
//     }
//     if (!window.confirm("Are you sure you want to delete this working days configuration?")) {
//       return;
//     }

//     try {
//       let lastError = null;

//       for (const base of deleteRouteVariants) {
//         try {
//           await api.delete(`${base}/${id}`);
//           await fetchData();
//           return;
//         } catch (err) {
//           lastError = err;
//         }
//       }

//       throw lastError || new Error("Delete endpoint unavailable");
//     } catch (err) {
//       setError(formatApiError(err));
//     }
//   };

//   const getActiveDays = (item) => {
//     return DAYS.filter((d) => item[d.key]).map((d) => d.label).join(", ") || "None";
//   };

//   return (
//     <div>
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">Working Days</h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Configure which days of the week are working days
//           </p>
//         </div>
//         <button
//           onClick={openAdd}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//         >
//           + Add Working Days
//         </button>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         {error && !showForm && (
//           <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-20 text-center text-sm text-slate-500">
//               No working days configuration found
//             </div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/80">
//                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Working Days</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Mon</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Tue</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Wed</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Thu</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Fri</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Sat</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Sun</th>
//                   <th className="px-5 py-3 font-medium text-slate-500 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {list.map((item, i) => {
//                   const id = item.working_day_id ?? item.id ?? item._id;

//                   return (
//                     <tr key={id ?? i} className="hover:bg-slate-50/70">
//                       <td className="px-5 py-3.5 text-slate-500">{i + 1}</td>
//                       <td className="px-5 py-3.5 font-medium text-slate-800">
//                         {getActiveDays(item)}
//                       </td>
//                       {DAYS.map((day) => (
//                         <td key={day.key} className="px-5 py-3.5 text-center">
//                           {item[day.key] ? (
//                             <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-700">
//                               ✓
//                             </span>
//                           ) : (
//                             <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
//                               –
//                             </span>
//                           )}
//                         </td>
//                       ))}
//                       <td className="px-5 py-3.5 text-right space-x-2">
//                         <button
//                           onClick={() => openEdit(item)}
//                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(id)}
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
//       </div>

//       {/* Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
//           <div className="mb-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Working Days" : "Add Working Days"}
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
//               <div className="space-y-4 px-5 py-5">
//                 <p className="text-sm text-slate-500">
//                   Select the days that are working days for the company.
//                 </p>

//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                   {DAYS.map((day) => (
//                     <label
//                       key={day.key}
//                       className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={!!formData[day.key]}
//                         onChange={(e) => handleChange(day.key, e.target.checked)}
//                         className="h-4 w-4 rounded border-slate-300 text-[#E42527] focus:ring-[#E42527]"
//                       />
//                       <span className="text-sm font-medium text-slate-700">
//                         {day.label}
//                       </span>
//                     </label>
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

const DAYS = [
  { key: "monday", label: "Monday", short: "M" },
  { key: "tuesday", label: "Tuesday", short: "T" },
  { key: "wednesday", label: "Wednesday", short: "W" },
  { key: "thursday", label: "Thursday", short: "T" },
  { key: "friday", label: "Friday", short: "F" },
  { key: "saturday", label: "Saturday", short: "S" },
  { key: "sunday", label: "Sunday", short: "S" },
];

const initialForm = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

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

const normalizeList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.working_days)) return payload.working_days;
  if (Array.isArray(payload.workingDays)) return payload.workingDays;
  if (payload.data && typeof payload.data === "object") return [payload.data];
  return typeof payload === "object" ? [payload] : [];
};

const createRouteVariants = [
  "/api/v1/create/working-days",
  "/api/v1/add/working-days",
  "/api/v1/working-days",
];

const fetchRouteVariants = [
  "/api/v1/all/working-days",
  "/api/v1/get/all/working-days",
  "/api/v1/get/working-days",
];

const updateRouteVariants = [
  "/api/v1/update/working-days",
  "/api/v1/put/working-days",
];

const deleteRouteVariants = [
  "/api/v1/delete/working-days",
  "/api/v1/remove/working-days",
];

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
const WorkingDaysCard = ({ item, index, onEdit, onDelete }) => {
  const id = item.working_day_id ?? item.id ?? item._id;
  const activeCount = DAYS.filter((d) => item[d.key]).length;
  const activeLabels = DAYS.filter((d) => item[d.key]).map((d) => d.label);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Config #{index + 1}
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-800">
            {activeCount} working day{activeCount === 1 ? "" : "s"}
          </h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {activeCount}/7
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-1.5">
        {DAYS.map((day) => {
          const active = !!item[day.key];
          return (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
                title={day.label}
              >
                {day.short}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 min-h-[2.5rem] text-sm text-slate-500">
        {activeLabels.length > 0 ? activeLabels.join(", ") : "No working days selected"}
      </p>

      <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function WorkingDaysPage() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    setCompanyId(getCompanyId());
  }, []);

  const fetchData = async () => {
    if (!companyId) {
      setError("Company ID not found. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let lastError = null;

      for (const endpoint of fetchRouteVariants) {
        try {
          const res = await api.get(endpoint, {
            params: { company_id: companyId },
          });
          const items = normalizeList(res.data);
          setList(items);
          setLoading(false);
          return;
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError || new Error("No working-days endpoint available");
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchData();
    }
  }, [companyId]);

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
    const id = item.working_day_id ?? item.id ?? item._id ?? null;
    setEditId(id);
    setFormData({
      monday: !!item.monday,
      tuesday: !!item.tuesday,
      wednesday: !!item.wednesday,
      thursday: !!item.thursday,
      friday: !!item.friday,
      saturday: !!item.saturday,
      sunday: !!item.sunday,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        company_id: companyId,
        monday: formData.monday,
        tuesday: formData.tuesday,
        wednesday: formData.wednesday,
        thursday: formData.thursday,
        friday: formData.friday,
        saturday: formData.saturday,
        sunday: formData.sunday,
      };

      if (editId) {
        let lastError = null;

        for (const base of updateRouteVariants) {
          try {
            await api.put(`${base}/${editId}`, payload);
            break;
          } catch (err) {
            lastError = err;
          }
        }

        if (lastError) throw lastError;
      } else {
        let lastError = null;

        for (const endpoint of createRouteVariants) {
          try {
            await api.post(endpoint, payload);
            break;
          } catch (err) {
            lastError = err;
          }
        }

        if (lastError) throw lastError;
      }

      setShowForm(false);
      setFormData(initialForm);
      setEditId(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid working day ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this working days configuration?")) {
      return;
    }

    try {
      let lastError = null;

      for (const base of deleteRouteVariants) {
        try {
          await api.delete(`${base}/${id}`);
          await fetchData();
          return;
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError || new Error("Delete endpoint unavailable");
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Working Days</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Configure which days of the week are working days
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Add Working Days
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
          <div className="text-4xl">📅</div>
          <p className="mt-3 text-sm font-medium text-slate-700">
            No working days configuration found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add a configuration to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => (
            <WorkingDaysCard
              key={(item.working_day_id ?? item.id ?? item._id) ?? i}
              item={item}
              index={i}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editId ? "Edit Working Days" : "Add Working Days"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 px-5 py-5">
                <p className="text-sm text-slate-500">
                  Select the days that are working days for the company.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {DAYS.map((day) => (
                    <label
                      key={day.key}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={!!formData[day.key]}
                        onChange={(e) => handleChange(day.key, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#E42527] focus:ring-[#E42527]"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {day.label}
                      </span>
                    </label>
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
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}