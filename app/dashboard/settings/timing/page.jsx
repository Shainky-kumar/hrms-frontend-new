// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import { useAuthStore } from "@/store/authStore";

// const initialForm = {
//   start_time: "",
//   end_time: "",
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

// const toTimeInputValue = (value) => {
//   if (!value) return "";
//   // handles "18:33:00" or "18:33"
//   return String(value).slice(0, 5);
// };

// const toApiTime = (value) => {
//   if (!value) return value;
//   return value.length === 5 ? `${value}:00` : value;
// };

// const getCompanyId = (user) => {
//   if (typeof window === "undefined") return null;

//   const candidate = user ||
//     (() => {
//       try {
//         return JSON.parse(localStorage.getItem("user") || "{}");
//       } catch {
//         return {};
//       }
//     })();

//   const keys = [
//     candidate?.company_id,
//     candidate?.companyId,
//     candidate?.tenant_id,
//     candidate?.tenantId,
//     candidate?.company?.company_id,
//     candidate?.company?.companyId,
//   ];

//   for (const value of keys) {
//     if (value) return String(value);
//   }

//   const localKeys = ["company_id", "companyId", "tenant_id", "tenantId"];
//   for (const key of localKeys) {
//     const val = localStorage.getItem(key);
//     if (val) return val;
//   }

//   return null;
// };

// export default function TimingPage() {
//   const user = useAuthStore((state) => state.user);
//   const [list, setList] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [companyId, setCompanyId] = useState(null);

//   useEffect(() => {
//     const id = getCompanyId(user);
//     setCompanyId(id);
//   }, [user]);

//   const fetchData = useCallback(async () => {
//     if (!companyId) {
//       setError("Company ID not found. Please login again.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.get("/api/v1/get/all/company-timings", {
//         params: { company_id: companyId },
//       });

//       let data = res.data?.data ?? res.data ?? [];

//       if (!Array.isArray(data)) {
//         data = data && typeof data === "object" ? [data] : [];
//       }

//       setList(data);
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [companyId]);

//   useEffect(() => {
//     if (companyId) {
//       fetchData();
//     }
//   }, [companyId, fetchData]);

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
//     const id = item.company_timing_id ?? item.id ?? item._id;
//     setEditId(id);
//     setFormData({
//       start_time: toTimeInputValue(item.start_time),
//       end_time: toTimeInputValue(item.end_time),
//     });
//     setError("");
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setEditId(null);
//     setFormData(initialForm);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       const payload = {
//         company_id: companyId,
//         start_time: toApiTime(formData.start_time),
//         end_time: toApiTime(formData.end_time),
//       };

//       if (editId) {
//         await api.put(`/api/v1/update/company-timings/${editId}`, payload);
//       } else {
//         await api.post("/api/v1/company-timings", payload);
//       }

//       closeForm();
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this timing?")) return;

//     setDeletingId(id);
//     setError("");

//     try {
//       await api.delete(`/api/v1/delete/company-timings/${id}`);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div>
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800">Company Timings</h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Manage office start & end times
//           </p>
//         </div>

//         <button
//           onClick={openAdd}
//           className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//         >
//           + Add Timing
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
//               No timings found. Click “+ Add Timing” to create one.
//             </div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/80">
//                   <th className="px-5 py-3 font-medium text-slate-500">#</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Start Time</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">End Time</th>
//                   <th className="px-5 py-3 font-medium text-slate-500">Created</th>
//                   <th className="px-5 py-3 font-medium text-slate-500 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {list.map((item, i) => {
//                   const timingId = item.company_timing_id ?? item.id ?? item._id;

//                   return (
//                     <tr
//                       key={timingId ?? i}
//                       className="hover:bg-slate-50/70"
//                     >
//                       <td className="px-5 py-3.5 text-slate-500">{i + 1}</td>
//                       <td className="px-5 py-3.5 font-medium text-slate-800">
//                         {toTimeInputValue(item.start_time) || "—"}
//                       </td>
//                       <td className="px-5 py-3.5 text-slate-600">
//                         {toTimeInputValue(item.end_time) || "—"}
//                       </td>
//                       <td className="px-5 py-3.5 text-slate-500">
//                         {item.created_at
//                           ? new Date(item.created_at).toLocaleDateString()
//                           : "—"}
//                       </td>
//                       <td className="px-5 py-3.5 text-right space-x-1">
//                         <button
//                           onClick={() => openEdit(item)}
//                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(timingId)}
//                           disabled={deletingId === timingId}
//                           className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
//                         >
//                           {deletingId === timingId ? "Deleting..." : "Delete"}
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
//           <div className="mb-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {editId ? "Edit Timing" : "Add Timing"}
//               </h2>
//               <button
//                 onClick={closeForm}
//                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="space-y-5 px-5 py-5">
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Start Time *
//                   </label>
//                   <input
//                     required
//                     type="time"
//                     step="60"
//                     value={formData.start_time}
//                     onChange={(e) => handleChange("start_time", e.target.value)}
//                     className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     style={{ colorScheme: "light" }}
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     End Time *
//                   </label>
//                   <input
//                     required
//                     type="time"
//                     step="60"
//                     value={formData.end_time}
//                     onChange={(e) => handleChange("end_time", e.target.value)}
//                     className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
//                     style={{ colorScheme: "light" }}
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
//                   {saving ? "Saving..." : editId ? "Update" : "Create"}
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

const initialForm = {
  start_time: "",
  end_time: "",
};

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (Array.isArray(item.loc)) {
          return `${item.loc.slice(1).join(".")}: ${item.msg}`;
        }

        return item.msg || "Invalid value";
      })
      .join(" • ");
  }

  if (typeof detail === "string") return detail;

  return (
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong"
  );
};

const getTimingId = (item) => {
  return (
    item?.company_timing_id ||
    item?.timing_id ||
    item?.id ||
    item?._id
  );
};

const formatInputTime = (value) => {
  if (!value) return "";
  return String(value).slice(0, 5);
};

const formatApiTime = (value) => {
  if (!value) return "";
  return value.length === 5 ? `${value}:00` : value;
};

const formatTime = (value) => {
  const time = formatInputTime(value);

  if (!time) return "—";

  const [hour, minute] = time.split(":");

  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateDuration = (start, end) => {
  if (!start || !end) return "";

  const startTime = formatInputTime(start);
  const endTime = formatInputTime(end);

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;

  if (endTotal <= startTotal) {
    endTotal += 24 * 60;
  }

  const totalMinutes = endTotal - startTotal;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hours`;
  }

  return `${hours}h ${minutes}m`;
};

const getListFromResponse = (res) => {
  const data = res?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.timings)) return data.timings;
  if (Array.isArray(data?.company_timings)) {
    return data.company_timings;
  }
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;

  return [];
};

export default function TimingPage() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(
        "/api/v1/get/all/company-timings",
        {
          params: {
            page: 1,
            page_size: 100,
          },
        }
      );

      setList(getListFromResponse(res));
    } catch (err) {
      setList([]);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    const timingId = getTimingId(item);

    setEditId(timingId);

    setFormData({
      start_time: formatInputTime(item?.start_time),
      end_time: formatInputTime(item?.end_time),
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditId(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.start_time || !formData.end_time) {
      setError("Start time aur end time dono select karo");
      return;
    }

    if (formData.start_time === formData.end_time) {
      setError("Start time aur end time same nahi ho sakte");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      start_time: formatApiTime(formData.start_time),
      end_time: formatApiTime(formData.end_time),
    };

    try {
      if (editId) {
        await api.put(
          `/api/v1/update/company-timings/${editId}`,
          payload
        );
      } else {
        await api.post(
          "/api/v1/company-timings",
          payload
        );
      }

      closeForm();
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError("Timing ID nahi mila");
      return;
    }

    const confirmDelete = window.confirm(
      "Kya aap ye timing delete karna chahte ho?"
    );

    if (!confirmDelete) return;

    setDeletingId(id);
    setError("");

    try {
      await api.delete(
        `/api/v1/delete/company-timings/${id}`
      );

      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              🕒
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Company Timings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Office ke working hours manage karo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl bg-[#E42527] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c91f21] hover:shadow-md"
          >
            + Add Timing
          </button>
        </div>

        {error && !showForm && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-800">
                Saved Timings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Ye timings shift create karte waqt use hongi
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {list.length}{" "}
              {list.length === 1 ? "Timing" : "Timings"}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="px-5 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                🕒
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                Koi timing nahi mili
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Apni first timing create karo.
              </p>

              <button
                type="button"
                onClick={openAdd}
                className="mt-5 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                + Create First Timing
              </button>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              {list.map((item, index) => {
                const timingId = getTimingId(item);
                const duration = calculateDuration(
                  item.start_time,
                  item.end_time
                );

                return (
                  <div
                    key={timingId || index}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-red-50" />

                    <div className="relative flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                        🕒
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    </div>

                    <div className="relative mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Working Hours
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-800">
                          {formatTime(item.start_time)}
                        </span>

                        <span className="text-slate-400">
                          →
                        </span>

                        <span className="text-2xl font-bold text-slate-800">
                          {formatTime(item.end_time)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Total: {duration || "—"}
                      </p>
                    </div>

                    <div className="relative mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-400">
                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleDateString()
                          : "No date"}
                      </span>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === timingId}
                          onClick={() => handleDelete(timingId)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === timingId
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 backdrop-blur-sm sm:pt-14"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="mb-8 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editId ? "Edit Timing" : "Add Timing"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Office ka time select karo
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-5 py-6">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    ⚠️ {error}
                  </div>
                )}

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="start-time"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Start Time
                      </label>

                      <input
                        id="start-time"
                        type="time"
                        required
                        step="60"
                        value={formData.start_time}
                        onChange={(event) =>
                          handleChange(
                            "start_time",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-semibold text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="end-time"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        End Time
                      </label>

                      <input
                        id="end-time"
                        type="time"
                        required
                        step="60"
                        value={formData.end_time}
                        onChange={(event) =>
                          handleChange(
                            "end_time",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-semibold text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                    <span>🕒</span>

                    <span>
                      {formData.start_time
                        ? formatTime(formData.start_time)
                        : "Start"}
                    </span>

                    <span className="text-slate-300">
                      →
                    </span>

                    <span>
                      {formData.end_time
                        ? formatTime(formData.end_time)
                        : "End"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Agar end time start time se chhota hai to ye night
                  shift maana jayega.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editId
                    ? "Update Timing"
                    : "Add Timing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}