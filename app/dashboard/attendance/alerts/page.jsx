// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// const toArray = (p) => {
//   if (!p) return [];
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p?.data)) return p.data;
//   if (Array.isArray(p?.alerts)) return p.alerts;
//   return [];
// };

// const formatDate = (d) => {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return String(d);
//   }
// };

// export default function AttendanceAlertsPage() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     employee_id: "",
//     alert_type: "late",
//     alert_date: "",
//     message: "",
//     notified_to: "",
//   });

//   const fetchList = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/attendence/alerts", {
//         params: { page, page_size: 10, search: search || undefined },
//       });
//       setList(toArray(res?.data));
//     } catch (err) {
//       setError(formatApiError(err));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, [page]);

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/add/attendence/alert", {
//         employee_id: form.employee_id || null,
//         alert_type: form.alert_type,
//         alert_date: form.alert_date,
//         message: form.message || null,
//         notified_to: form.notified_to || null,
//       });
//       setSuccess("Alert created");
//       setShowForm(false);
//       setForm({
//         employee_id: "",
//         alert_type: "late",
//         alert_date: "",
//         message: "",
//         notified_to: "",
//       });
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const markRead = async (alertId) => {
//     try {
//       await api.put(`/api/v1/attendence/alert/${alertId}/read`);
//       setSuccess("Marked as read");
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     }
//   };

//   const runAutoAbsent = async () => {
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/attendence/run-auto-absent");
//       setSuccess("Auto-absent job ran");
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Alerts</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Late, absent, geo violation & more
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <button
//             type="button"
//             disabled={saving}
//             onClick={runAutoAbsent}
//             className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
//           >
//             Run Auto Absent
//           </button>
//           <button
//             onClick={() => setShowForm(true)}
//             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
//           >
//             + Add Alert
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
//       )}
//       {success && (
//         <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
//       )}

//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search..."
//             className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
//           />
//           <button
//             onClick={() => {
//               setPage(1);
//               fetchList();
//             }}
//             className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
//           >
//             Search
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">No alerts</div>
//           ) : (
//             <table className="w-full min-w-[800px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Message</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Read</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((row, i) => (
//                   <tr key={row.alert_id || i} className="hover:bg-[#fafafa]">
//                     <td className="px-5 py-3.5 whitespace-nowrap">
//                       {formatDate(row.alert_date)}
//                     </td>
//                     <td className="px-5 py-3.5">{row.alert_type}</td>
//                     <td className="px-5 py-3.5">{row.employee_id || "—"}</td>
//                     <td className="px-5 py-3.5 max-w-[220px] truncate">
//                       {row.message || "—"}
//                     </td>
//                     <td className="px-5 py-3.5">{row.is_read ? "Yes" : "No"}</td>
//                     <td className="px-5 py-3.5 text-right">
//                       {!row.is_read && (
//                         <button
//                           onClick={() => markRead(row.alert_id)}
//                           className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
//                         >
//                           Mark read
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
//               <h2 className="font-semibold">Add Alert</h2>
//               <button type="button" onClick={() => setShowForm(false)}>
//                 ✕
//               </button>
//             </div>
//             <form onSubmit={submit} className="space-y-3 p-5">
//               <input
//                 placeholder="Employee ID (optional)"
//                 value={form.employee_id}
//                 onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//               <select
//                 value={form.alert_type}
//                 onChange={(e) => setForm((p) => ({ ...p, alert_type: e.target.value }))}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               >
//                 <option value="late">Late</option>
//                 <option value="absent">Absent</option>
//                 <option value="missing_punch">Missing punch</option>
//                 <option value="geo_violation">Geo violation</option>
//                 <option value="face_mismatch">Face mismatch</option>
//                 <option value="consecutive_absent">Consecutive absent</option>
//               </select>
//               <input
//                 required
//                 type="date"
//                 value={form.alert_date}
//                 onChange={(e) => setForm((p) => ({ ...p, alert_date: e.target.value }))}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//               <textarea
//                 rows={3}
//                 placeholder="Message"
//                 value={form.message}
//                 onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//               <input
//                 placeholder="Notified to (user_id)"
//                 value={form.notified_to}
//                 onChange={(e) => setForm((p) => ({ ...p, notified_to: e.target.value }))}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//               />
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
//                 >
//                   {saving ? "Saving..." : "Create"}
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


import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";


const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};


const toArray = (p) => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.alerts)) return p.alerts;
  return [];
};


const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(d);
  }
};


export default function AttendanceAlertsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employee_id: "",
    alert_type: "late",
    alert_date: "",
    message: "",
    notified_to: "",
  });


  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/attendence/alerts", {
        params: { page, page_size: 10, search: search || undefined },
      });
      setList(toArray(res?.data));
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchList();
  }, [page]);


  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/add/attendence/alert", {
        employee_id: form.employee_id || null,
        alert_type: form.alert_type,
        alert_date: form.alert_date,
        message: form.message || null,
        notified_to: form.notified_to || null,
      });
      setSuccess("Alert created");
      setShowForm(false);
      setForm({
        employee_id: "",
        alert_type: "late",
        alert_date: "",
        message: "",
        notified_to: "",
      });
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };


  const markRead = async (alertId) => {
    try {
      await api.put(`/api/v1/attendence/alert/${alertId}/read`);
      setSuccess("Marked as read");
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    }
  };


  const runAutoAbsent = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/attendence/run-auto-absent");
      setSuccess("Auto-absent job ran");
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Alerts</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Late, absent, geo violation & more
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={runAutoAbsent}
            className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
          >
            Run Auto Absent
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
          >
            + Add Alert
          </button>
        </div>
      </div>


      {error && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}


      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              setPage(1);
              fetchList();
            }}
            className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
          >
            Search
          </button>
        </div>


        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">No alerts</div>
          ) : (
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Message</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Read</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((row, i) => (
                  <tr key={row.alert_id || i} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {formatDate(row.alert_date)}
                    </td>
                    <td className="px-5 py-3.5">{row.alert_type}</td>
                    <td className="px-5 py-3.5">{row.employee_id || "—"}</td>
                    <td className="px-5 py-3.5 max-w-[220px] truncate">
                      {row.message || "—"}
                    </td>
                    <td className="px-5 py-3.5">{row.is_read ? "Yes" : "No"}</td>
                    <td className="px-5 py-3.5 text-right">
                      {!row.is_read && (
                        <button
                          onClick={() => markRead(row.alert_id)}
                          className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
                        >
                          Mark read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <h2 className="font-semibold">Add Alert</h2>
              <button type="button" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3 p-5">
              <input
                placeholder="Employee ID (optional)"
                value={form.employee_id}
                onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <select
                value={form.alert_type}
                onChange={(e) => setForm((p) => ({ ...p, alert_type: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              >
                <option value="late">Late</option>
                <option value="absent">Absent</option>
                <option value="missing_punch">Missing punch</option>
                <option value="geo_violation">Geo violation</option>
                <option value="face_mismatch">Face mismatch</option>
                <option value="consecutive_absent">Consecutive absent</option>
              </select>
              <input
                required
                type="date"
                value={form.alert_date}
                onChange={(e) => setForm((p) => ({ ...p, alert_date: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <input
                placeholder="Notified to (user_id)"
                value={form.notified_to}
                onChange={(e) => setForm((p) => ({ ...p, notified_to: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}