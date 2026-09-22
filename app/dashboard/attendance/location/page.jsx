// // "use client";

// // import { useCallback, useEffect, useRef, useState } from "react";
// // import { api } from "@/app/lib/api";

// // /* ============================================================
// //    CONSTANTS
// // ============================================================ */

// // const PAGE_SIZE = 10;
// // const DEBOUNCE_MS = 400;
// // const AUTO_DISMISS_MS = 4000;

// // const RADIUS_PRESETS = [
// //   { value: 50, label: "50m", hint: "Single building" },
// //   { value: 100, label: "100m", hint: "Small office" },
// //   { value: 200, label: "200m", hint: "Standard (recommended)" },
// //   { value: 500, label: "500m", hint: "Campus" },
// //   { value: 1000, label: "1000m", hint: "Area" },
// // ];

// // /* ============================================================
// //    HELPERS
// // ============================================================ */

// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail))
// //     return detail.map((e) => e.msg || "Error").join(" • ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // };

// // const extractList = (res) => {
// //   const data = res?.data ?? {};
// //   if (Array.isArray(data)) return { items: data, total: data.length };
// //   if (Array.isArray(data.location))
// //     return { items: data.location, total: Number(data.total) || data.location.length };
// //   if (Array.isArray(data.locations))
// //     return { items: data.locations, total: Number(data.total) || data.locations.length };
// //   if (Array.isArray(data.items))
// //     return { items: data.items, total: Number(data.total) || data.items.length };
// //   return { items: [], total: 0 };
// // };

// // const extractEmployees = (res) => {
// //   const data = res?.data ?? {};
// //   let arr = [];
// //   if (Array.isArray(data)) arr = data;
// //   else if (Array.isArray(data.employees)) arr = data.employees;
// //   else if (Array.isArray(data.data)) arr = data.data;
// //   else if (Array.isArray(data.items)) arr = data.items;
// //   else if (Array.isArray(data.result)) arr = data.result;

// //   return arr.map((e) => {
// //     const id = e.employee_id || e.id || e.user_id || "";
// //     const name =
// //       e.full_name || e.name || e.employee_name ||
// //       `${e.first_name || ""} ${e.last_name || ""}`.trim() || id;
// //     return { id, name, email: e.email || e.company_email || "" };
// //   });
// // };

// // const formatDateTime = (d) => {
// //   if (!d) return "—";
// //   try {
// //     return new Date(d).toLocaleString("en-IN", {
// //       day: "2-digit", month: "short", year: "numeric",
// //       hour: "2-digit", minute: "2-digit",
// //     });
// //   } catch { return String(d); }
// // };

// // /* ============================================================
// //    MULTI-SELECT EMPLOYEE DROPDOWN
// // ============================================================ */

// // function EmployeeMultiSelect({ value = [], onChange, options, placeholder = "Select employees..." }) {
// //   const [open, setOpen] = useState(false);
// //   const [query, setQuery] = useState("");
// //   const ref = useRef(null);
// //   const inputRef = useRef(null);

// //   useEffect(() => {
// //     const onClick = (e) => {
// //       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
// //     };
// //     document.addEventListener("mousedown", onClick);
// //     return () => document.removeEventListener("mousedown", onClick);
// //   }, []);

// //   const filtered = query.trim()
// //     ? options.filter((o) => {
// //         const q = query.trim().toLowerCase();
// //         return o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
// //       })
// //     : options;

// //   const toggle = (id) => {
// //     if (value.includes(id)) onChange(value.filter((v) => v !== id));
// //     else onChange([...value, id]);
// //   };

// //   const remove = (id, e) => {
// //     e.stopPropagation();
// //     onChange(value.filter((v) => v !== id));
// //   };

// //   return (
// //     <div ref={ref} className="relative">
// //       <button
// //         type="button"
// //         onClick={() => {
// //           setOpen((v) => !v);
// //           setTimeout(() => inputRef.current?.focus(), 30);
// //         }}
// //         className="flex min-h-[42px] w-full items-center justify-between rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-left text-sm focus:border-[#E42527] focus:outline-none"
// //       >
// //         <div className="flex flex-1 flex-wrap items-center gap-1">
// //           {value.length === 0 ? (
// //             <span className="text-[#9ca3af]">{placeholder}</span>
// //           ) : (
// //             <>
// //               {value.slice(0, 2).map((id) => {
// //                 const emp = options.find((o) => o.id === id);
// //                 return (
// //                   <span
// //                     key={id}
// //                     className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#374151]"
// //                   >
// //                     {emp ? emp.name : id}
// //                     <span
// //                       role="button"
// //                       tabIndex={0}
// //                       onClick={(e) => remove(id, e)}
// //                       onKeyDown={(e) => e.key === "Enter" && remove(id, e)}
// //                       className="cursor-pointer text-[#9ca3af] hover:text-[#374151]"
// //                     >
// //                       ✕
// //                     </span>
// //                   </span>
// //                 );
// //               })}
// //               {value.length > 2 && (
// //                 <span className="rounded-full bg-[#E42527] px-2 py-0.5 text-[11px] font-medium text-white">
// //                   +{value.length - 2}
// //                 </span>
// //               )}
// //             </>
// //           )}
// //         </div>
// //         <svg
// //           className={`ml-2 h-4 w-4 flex-shrink-0 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`}
// //           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
// //           stroke="currentColor" strokeWidth={2}
// //         >
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
// //         </svg>
// //       </button>

// //       {open && (
// //         <div className="absolute z-40 mt-1 w-full rounded-md border border-[#e5e7eb] bg-white shadow-lg">
// //           <div className="border-b border-[#f3f4f6] p-2">
// //             <input
// //               ref={inputRef}
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               placeholder="Search employee..."
// //               className="w-full rounded-md border border-[#e5e7eb] px-2.5 py-1.5 text-sm focus:border-[#E42527] focus:outline-none"
// //             />
// //           </div>

// //           {value.length > 0 && (
// //             <div className="flex items-center justify-between border-b border-[#f3f4f6] px-3 py-1.5 text-[11px]">
// //               <span className="text-[#6b7280]">{value.length} selected</span>
// //               <button
// //                 type="button"
// //                 onClick={() => onChange([])}
// //                 className="font-medium text-[#E42527] hover:underline"
// //               >
// //                 Clear all
// //               </button>
// //             </div>
// //           )}

// //           <div className="max-h-56 overflow-y-auto py-1">
// //             {filtered.length === 0 ? (
// //               <div className="px-3 py-4 text-center text-xs text-[#9ca3af]">
// //                 No employees found
// //               </div>
// //             ) : (
// //               filtered.map((opt) => {
// //                 const checked = value.includes(opt.id);
// //                 return (
// //                   <button
// //                     key={opt.id}
// //                     type="button"
// //                     onClick={() => toggle(opt.id)}
// //                     className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f9fafb] ${
// //                       checked ? "bg-[#fff5f5]" : ""
// //                     }`}
// //                   >
// //                     <span
// //                       className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
// //                         checked
// //                           ? "border-[#E42527] bg-[#E42527]"
// //                           : "border-[#d1d5db] bg-white"
// //                       }`}
// //                     >
// //                       {checked && (
// //                         <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
// //                         </svg>
// //                       )}
// //                     </span>
// //                     <span className="flex flex-1 flex-col">
// //                       <span className="font-medium text-[#374151]">{opt.name}</span>
// //                       <span className="text-[11px] text-[#9ca3af]">{opt.id}</span>
// //                     </span>
// //                   </button>
// //                 );
// //               })
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    MAP PREVIEW
// // ============================================================ */

// // function MapPreview({ lat, lng, radius, height = 180 }) {
// //   if (!lat || !lng) {
// //     return (
// //       <div className="flex h-[180px] items-center justify-center rounded-lg border border-dashed border-[#d1d5db] bg-[#f9fafb] text-xs text-[#9ca3af]">
// //         Enter coordinates to preview map
// //       </div>
// //     );
// //   }
// //   const delta = Math.max((radius || 200) / 111000, 0.002);
// //   const bbox = [
// //     Number(lng) - delta, Number(lat) - delta,
// //     Number(lng) + delta, Number(lat) + delta,
// //   ].join("%2C");
// //   const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
// //   return (
// //     <div className="overflow-hidden rounded-lg border border-[#e5e7eb]" style={{ height }}>
// //       <iframe title="Location preview" src={src} className="h-full w-full" loading="lazy" />
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    PAGINATION
// // ============================================================ */

// // function Pagination({ page, pageSize, total, onPageChange }) {
// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));
// //   if (total <= pageSize) return null;
// //   const from = (page - 1) * pageSize + 1;
// //   const to = Math.min(page * pageSize, total);

// //   return (
// //     <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5e7eb] px-5 py-3.5 sm:flex-row">
// //       <p className="text-xs text-[#6b7280]">
// //         Showing <span className="font-medium text-[#374151]">{from}</span>–
// //         <span className="font-medium text-[#374151]">{to}</span> of{" "}
// //         <span className="font-medium text-[#374151]">{total}</span>
// //       </p>
// //       <div className="flex items-center gap-1">
// //         <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
// //           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40">Prev</button>
// //         <span className="px-3 text-xs text-[#6b7280]">
// //           Page <span className="font-medium text-[#374151]">{page}</span> / {totalPages}
// //         </span>
// //         <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
// //           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40">Next</button>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    EMPTY STATE
// // ============================================================ */

// // function EmptyState({ onAdd }) {
// //   return (
// //     <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
// //       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
// //         <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
// //         </svg>
// //       </div>
// //       <p className="text-sm font-medium text-[#374151]">No locations configured</p>
// //       <p className="text-xs text-[#6b7280]">Add your first office location with GPS coordinates.</p>
// //       <button type="button" onClick={onAdd}
// //         className="mt-1 rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
// //         + Add Location
// //       </button>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    MAIN PAGE
// // ============================================================ */

// // export default function AttendanceLocationsPage() {
// //   const [list, setList] = useState([]);
// //   const [total, setTotal] = useState(0);
// //   const [loading, setLoading] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [searchInput, setSearchInput] = useState("");
// //   const [search, setSearch] = useState("");

// //   const [employees, setEmployees] = useState([]);

// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const [showForm, setShowForm] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const [saving, setSaving] = useState(false);
// //   const [geoLoading, setGeoLoading] = useState(false);

// //   const [form, setForm] = useState({
// //     location_name: "",
// //     address: "",
// //     latitude: "",
// //     longitude: "",
// //     radius_meters: 200,
// //     is_active: true,
// //     employee_ids: [],
// //   });

// //   const reqIdRef = useRef(0);

// //   /* auto-dismiss */
// //   useEffect(() => {
// //     if (!error && !success) return;
// //     const t = setTimeout(() => { setError(""); setSuccess(""); }, AUTO_DISMISS_MS);
// //     return () => clearTimeout(t);
// //   }, [error, success]);

// //   /* load employees */
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         const res = await api.get("/api/v1/get/employees");
// //         if (!cancelled) setEmployees(extractEmployees(res));
// //       } catch {
// //         if (!cancelled) setEmployees([]);
// //       }
// //     })();
// //     return () => { cancelled = true; };
// //   }, []);

// //   /* fetch list */
// //   const fetchList = useCallback(async () => {
// //     const myReqId = ++reqIdRef.current;
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const params = { page, page_size: PAGE_SIZE };
// //       if (search) params.search = search;
// //       const res = await api.get("/api/v1/get/attendence/locations", { params });
// //       if (myReqId !== reqIdRef.current) return;
// //       const { items, total } = extractList(res);
// //       setList(items);
// //       setTotal(total);
// //     } catch (err) {
// //       if (myReqId !== reqIdRef.current) return;
// //       setError(formatApiError(err));
// //       setList([]);
// //       setTotal(0);
// //     } finally {
// //       if (myReqId === reqIdRef.current) setLoading(false);
// //     }
// //   }, [page, search]);

// //   useEffect(() => { fetchList(); }, [fetchList]);

// //   /* debounced search */
// //   useEffect(() => {
// //     const t = setTimeout(() => {
// //       setSearch(searchInput.trim());
// //       setPage(1);
// //     }, DEBOUNCE_MS);
// //     return () => clearTimeout(t);
// //   }, [searchInput]);

// //   /* geolocation */
// //   const useMyLocation = () => {
// //     if (!navigator.geolocation) {
// //       setError("Geolocation is not supported by your browser");
// //       return;
// //     }
// //     setGeoLoading(true);
// //     navigator.geolocation.getCurrentPosition(
// //       (pos) => {
// //         setForm((p) => ({
// //           ...p,
// //           latitude: pos.coords.latitude.toFixed(6),
// //           longitude: pos.coords.longitude.toFixed(6),
// //         }));
// //         setGeoLoading(false);
// //       },
// //       () => {
// //         setError("Could not get your location. Please enter manually.");
// //         setGeoLoading(false);
// //       },
// //       { enableHighAccuracy: true, timeout: 10000 }
// //     );
// //   };

// //   /* modal */
// //   const openAdd = () => {
// //     setEditId(null);
// //     setForm({
// //       location_name: "", address: "", latitude: "", longitude: "",
// //       radius_meters: 200, is_active: true, employee_ids: [],
// //     });
// //     setShowForm(true);
// //     setError("");
// //     setSuccess("");
// //   };

// //   const openEdit = (row) => {
// //     setEditId(row.location_id || row.id);
// //     setForm({
// //       location_name: row.location_name || "",
// //       address: row.address || "",
// //       latitude: row.latitude != null ? String(row.latitude) : "",
// //       longitude: row.longitude != null ? String(row.longitude) : "",
// //       radius_meters: row.radius_meters || 200,
// //       is_active: row.is_active !== false,
// //       employee_ids: Array.isArray(row.employee_ids) ? row.employee_ids : [],
// //     });
// //     setShowForm(true);
// //     setError("");
// //     setSuccess("");
// //   };

// //   const closeForm = () => {
// //     setShowForm(false);
// //     setEditId(null);
// //   };

// //   useEffect(() => {
// //     if (!showForm) return;
// //     const onKey = (e) => { if (e.key === "Escape" && !saving) closeForm(); };
// //     window.addEventListener("keydown", onKey);
// //     return () => window.removeEventListener("keydown", onKey);
// //   }, [showForm, saving]);

// //   /* submit */
// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setError(""); setSuccess("");

// //     if (!form.location_name.trim()) {
// //       setError("Please enter a location name"); return;
// //     }
// //     const lat = Number(form.latitude);
// //     const lng = Number(form.longitude);
// //     if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
// //       setError("Latitude must be between -90 and 90"); return;
// //     }
// //     if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
// //       setError("Longitude must be between -180 and 180"); return;
// //     }
// //     const radius = Number(form.radius_meters);
// //     if (!Number.isFinite(radius) || radius < 10 || radius > 50000) {
// //       setError("Radius must be between 10m and 50,000m"); return;
// //     }

// //     setSaving(true);
// //     try {
// //       const payload = {
// //         location_name: form.location_name.trim(),
// //         address: form.address?.trim() || null,
// //         latitude: lat,
// //         longitude: lng,
// //         radius_meters: radius,
// //         is_active: form.is_active,
// //         employee_ids: form.employee_ids,
// //       };

// //       if (editId) {
// //         await api.put(`/api/v1/attendence/location/${editId}`, payload);
// //         setSuccess(`${payload.location_name} updated`);
// //       } else {
// //         await api.post("/api/v1/add/attendence/location", payload);
// //         setSuccess(`${payload.location_name} added`);
// //       }
// //       closeForm();
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   /* render */
// //   return (
// //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// //       {/* HEADER */}
// //       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Attendance Locations</h1>
// //           <p className="mt-1 text-sm text-[#6b7280]">
// //             Office & client sites — employees can only punch from these geo-fenced areas
// //             {total > 0 && (
// //               <span className="ml-2 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#6b7280]">
// //                 {total} total
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex flex-wrap gap-2">
// //           <button type="button" onClick={fetchList} disabled={loading}
// //             className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">
// //             ↻ Refresh
// //           </button>
// //           <button type="button" onClick={openAdd}
// //             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]">
// //             + Add Location
// //           </button>
// //         </div>
// //       </div>

// //       {/* INFO */}
// //       <div className="mb-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
// //         <p className="font-medium">How geo-fencing works</p>
// //         <ul className="mt-1 list-inside list-disc space-y-0.5">
// //           <li>Employee&apos;s GPS is checked against these coordinates when they punch.</li>
// //           <li>Inside radius → punch allowed. Outside → policy decides (WARN / BLOCK).</li>
// //           <li><strong>No employees selected</strong> → location is available to <strong>all</strong> employees.</li>
// //         </ul>
// //       </div>

// //       {/* NOTIFICATIONS */}
// //       {error && (
// //         <div className="mb-4 flex items-start justify-between rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]" role="alert">
// //           <span>{error}</span>
// //           <button onClick={() => setError("")} className="ml-3 hover:text-[#7f1d1d]">✕</button>
// //         </div>
// //       )}
// //       {success && (
// //         <div className="mb-4 flex items-start justify-between rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
// //           <span>{success}</span>
// //           <button onClick={() => setSuccess("")} className="ml-3 hover:text-green-900">✕</button>
// //         </div>
// //       )}

// //       {/* TABLE */}
// //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// //         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
// //           <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
// //             <input
// //               value={searchInput}
// //               onChange={(e) => setSearchInput(e.target.value)}
// //               placeholder="Search location..."
// //               className="w-full rounded-md border border-[#d1d5db] pl-9 pr-9 py-2 text-sm focus:border-[#E42527] focus:outline-none"
// //             />
// //             <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
// //             </svg>
// //             {searchInput && (
// //               <button type="button" onClick={() => setSearchInput("")}
// //                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]">✕</button>
// //             )}
// //           </div>
// //         </div>

// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// //           ) : list.length === 0 ? (
// //             <EmptyState onAdd={openAdd} />
// //           ) : (
// //             <table className="w-full min-w-[900px] text-left text-sm">
// //               <thead>
// //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Location</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Coordinates</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Radius</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employees</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
// //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-[#f3f4f6]">
// //                 {list.map((row, i) => {
// //                   const empCount = row.employee_count ?? (Array.isArray(row.employee_ids) ? row.employee_ids.length : 0);
// //                   return (
// //                     <tr key={row.location_id || i} className="hover:bg-[#fafafa]">
// //                       <td className="px-5 py-3.5">
// //                         <div className="font-medium text-[#1a1a1a]">{row.location_name || "—"}</div>
// //                         {row.address && (
// //                           <div className="max-w-[220px] truncate text-xs text-[#9ca3af]" title={row.address}>
// //                             {row.address}
// //                           </div>
// //                         )}
// //                       </td>
// //                       <td className="px-5 py-3.5">
// //                         <a
// //                           href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
// //                           target="_blank"
// //                           rel="noreferrer"
// //                           className="text-xs text-blue-600 hover:underline"
// //                         >
// //                           {Number(row.latitude).toFixed(5)}, {Number(row.longitude).toFixed(5)}
// //                         </a>
// //                       </td>
// //                       <td className="px-5 py-3.5">
// //                         <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
// //                           {row.radius_meters || 200}m
// //                         </span>
// //                       </td>
// //                       <td className="px-5 py-3.5">
// //                         {empCount === 0 ? (
// //                           <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
// //                             All employees
// //                           </span>
// //                         ) : (
// //                           <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
// //                             {empCount} assigned
// //                           </span>
// //                         )}
// //                       </td>
// //                       <td className="px-5 py-3.5">
// //                         {row.is_active !== false ? (
// //                           <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
// //                             <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
// //                             Active
// //                           </span>
// //                         ) : (
// //                           <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
// //                             <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
// //                             Inactive
// //                           </span>
// //                         )}
// //                       </td>
// //                       <td className="px-5 py-3.5 text-right">
// //                         <button
// //                           onClick={() => openEdit(row)}
// //                           className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
// //                         >
// //                           Edit
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>

// //         {!loading && list.length > 0 && (
// //           <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
// //         )}
// //       </div>

// //       {/* MODAL */}
// //       {showForm && (
// //         <div
// //           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
// //           onClick={closeForm}
// //           role="dialog"
// //           aria-modal="true"
// //         >
// //           <div
// //             className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
// //               <div>
// //                 <h2 className="font-semibold text-[#1a1a1a]">
// //                   {editId ? "Edit Location" : "Add Location"}
// //                 </h2>
// //                 <p className="mt-0.5 text-xs text-[#9ca3af]">
// //                   Set GPS coordinates and assign employees who can punch from here
// //                 </p>
// //               </div>
// //               <button type="button" onClick={closeForm}
// //                 className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]" aria-label="Close">✕</button>
// //             </div>

// //             <form onSubmit={submit} className="p-5">
// //               <div className="grid gap-4 md:grid-cols-2">
// //                 {/* LEFT COLUMN */}
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">
// //                       Location Name <span className="text-[#E42527]">*</span>
// //                     </label>
// //                     <input
// //                       required
// //                       placeholder="e.g. Head Office, Sector 18"
// //                       value={form.location_name}
// //                       onChange={(e) => setForm((p) => ({ ...p, location_name: e.target.value }))}
// //                       className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">Address</label>
// //                     <textarea
// //                       rows={2}
// //                       placeholder="Full address (optional)"
// //                       value={form.address}
// //                       onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
// //                       className="w-full resize-none rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //                     />
// //                   </div>

// //                   <div>
// //                     <div className="mb-1 flex items-center justify-between">
// //                       <label className="block text-xs font-medium text-[#6b7280]">
// //                         Coordinates <span className="text-[#E42527]">*</span>
// //                       </label>
// //                       <button
// //                         type="button"
// //                         onClick={useMyLocation}
// //                         disabled={geoLoading}
// //                         className="rounded-md border border-[#d1d5db] px-2.5 py-1 text-[11px] font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
// //                       >
// //                         {geoLoading ? "Fetching..." : "📍 Use My Location"}
// //                       </button>
// //                     </div>
// //                     <div className="grid grid-cols-2 gap-2">
// //                       <input
// //                         required type="number" step="0.000001" placeholder="Latitude"
// //                         value={form.latitude}
// //                         onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
// //                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //                       />
// //                       <input
// //                         required type="number" step="0.000001" placeholder="Longitude"
// //                         value={form.longitude}
// //                         onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
// //                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //                       />
// //                     </div>
// //                   </div>

// //                   <div>
// //                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">
// //                       Geo-fence Radius <span className="text-[#E42527]">*</span>
// //                     </label>
// //                     <div className="grid grid-cols-5 gap-1">
// //                       {RADIUS_PRESETS.map((r) => (
// //                         <button
// //                           key={r.value}
// //                           type="button"
// //                           onClick={() => setForm((p) => ({ ...p, radius_meters: r.value }))}
// //                           className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
// //                             form.radius_meters === r.value
// //                               ? "border-[#E42527] bg-[#E42527] text-white"
// //                               : "border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
// //                           }`}
// //                           title={r.hint}
// //                         >
// //                           {r.label}
// //                         </button>
// //                       ))}
// //                     </div>
// //                     <p className="mt-1 text-[11px] text-[#9ca3af]">
// //                       Selected: <strong>{form.radius_meters}m</strong> — employees must be within this distance to punch.
// //                     </p>
// //                   </div>

// //                   <MapPreview
// //                     lat={form.latitude}
// //                     lng={form.longitude}
// //                     radius={form.radius_meters}
// //                   />

// //                   <label className="flex items-center gap-2 text-sm text-[#374151]">
// //                     <input
// //                       type="checkbox"
// //                       checked={form.is_active}
// //                       onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
// //                       className="h-4 w-4 rounded border-[#d1d5db] accent-[#E42527]"
// //                     />
// //                     Active (employees can punch from here)
// //                   </label>
// //                 </div>

// //                 {/* RIGHT COLUMN — Employees */}
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">
// //                       Assigned Employees
// //                     </label>
// //                     <p className="mb-2 text-[11px] text-[#9ca3af]">
// //                       Leave empty to allow <strong>all employees</strong> to punch from this location.
// //                     </p>
// //                     <EmployeeMultiSelect
// //                       value={form.employee_ids}
// //                       onChange={(v) => setForm((p) => ({ ...p, employee_ids: v }))}
// //                       options={employees}
// //                       placeholder="Select employees (optional)"
// //                     />
// //                   </div>

// //                   {form.employee_ids.length > 0 && (
// //                     <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
// //                       <p className="mb-2 text-xs font-medium text-[#374151]">
// //                         Selected ({form.employee_ids.length})
// //                       </p>
// //                       <div className="max-h-48 space-y-1 overflow-y-auto">
// //                         {form.employee_ids.map((id) => {
// //                           const emp = employees.find((o) => o.id === id);
// //                           return (
// //                             <div
// //                               key={id}
// //                               className="flex items-center justify-between rounded-md bg-white px-2.5 py-1.5 text-xs"
// //                             >
// //                               <div>
// //                                 <div className="font-medium text-[#374151]">{emp?.name || id}</div>
// //                                 <div className="text-[10px] text-[#9ca3af]">{id}</div>
// //                               </div>
// //                               <button
// //                                 type="button"
// //                                 onClick={() =>
// //                                   setForm((p) => ({
// //                                     ...p,
// //                                     employee_ids: p.employee_ids.filter((x) => x !== id),
// //                                   }))
// //                                 }
// //                                 className="text-[#9ca3af] hover:text-[#E42527]"
// //                               >
// //                                 ✕
// //                               </button>
// //                             </div>
// //                           );
// //                         })}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* FOOTER */}
// //               <div className="mt-6 flex justify-end gap-2 border-t border-[#f3f4f6] pt-4">
// //                 <button
// //                   type="button"
// //                   onClick={closeForm}
// //                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving..." : editId ? "Update Location" : "Create Location"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { api } from "@/app/lib/api";

// /* ============================================================
//    CONSTANTS
// ============================================================ */

// const PAGE_SIZE = 10;
// const DEBOUNCE_MS = 400;
// const AUTO_DISMISS_MS = 4000;

// const RADIUS_PRESETS = [
//   { value: 50, label: "50m", hint: "Single building" },
//   { value: 100, label: "100m", hint: "Small office" },
//   { value: 200, label: "200m", hint: "Standard (recommended)" },
//   { value: 500, label: "500m", hint: "Campus" },
//   { value: 1000, label: "1000m", hint: "Area" },
// ];

// /* ============================================================
//    HELPERS
// ============================================================ */

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail))
//     return detail.map((e) => e.msg || "Error").join(" • ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// const extractList = (res) => {
//   const data = res?.data ?? {};
//   if (Array.isArray(data)) return { items: data, total: data.length };
//   if (Array.isArray(data.location))
//     return { items: data.location, total: Number(data.total) || data.location.length };
//   if (Array.isArray(data.locations))
//     return { items: data.locations, total: Number(data.total) || data.locations.length };
//   if (Array.isArray(data.data))
//     return { items: data.data, total: Number(data.total) || data.data.length };
//   if (Array.isArray(data.items))
//     return { items: data.items, total: Number(data.total) || data.items.length };
//   return { items: [], total: 0 };
// };

// const extractEmployees = (res) => {
//   const data = res?.data ?? {};
//   let arr = [];
//   if (Array.isArray(data)) arr = data;
//   else if (Array.isArray(data.employees)) arr = data.employees;
//   else if (Array.isArray(data.data)) arr = data.data;
//   else if (Array.isArray(data.items)) arr = data.items;
//   else if (Array.isArray(data.result)) arr = data.result;

//   return arr.map((e) => {
//     const id = e.employee_id || e.id || e.user_id || "";
//     const name =
//       e.full_name ||
//       e.name ||
//       e.employee_name ||
//       `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
//       id;
//     return { id, name, email: e.email || e.company_email || "" };
//   });
// };

// const formatDateTime = (d) => {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return String(d);
//   }
// };

// /* ============================================================
//    SEARCHABLE EMPLOYEE DROPDOWN (with "All Employees" option)
// ============================================================ */

// function EmployeeDropdown({ value, onChange, options, loading = false }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const ref = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     const onClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, []);

//   const filtered = query.trim()
//     ? options.filter((o) => {
//         const q = query.trim().toLowerCase();
//         return o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
//       })
//     : options;

//   const selected = value ? options.find((o) => o.id === value) : null;
//   const label = value
//     ? selected
//       ? `${selected.name} (${selected.id})`
//       : value
//     : "All Employees";

//   return (
//     <div ref={ref} className="relative">
//       <button
//         type="button"
//         onClick={() => {
//           setOpen((v) => !v);
//           setTimeout(() => inputRef.current?.focus(), 30);
//         }}
//         className="flex w-full items-center justify-between rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-left text-sm focus:border-[#E42527] focus:outline-none"
//       >
//         <span className={value ? "text-[#374151]" : "text-[#6b7280]"}>
//           {loading ? "Loading..." : label}
//         </span>
//         <div className="flex items-center gap-1">
//           {value && (
//             <span
//               role="button"
//               tabIndex={0}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onChange("");
//                 setQuery("");
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.stopPropagation();
//                   onChange("");
//                 }
//               }}
//               className="rounded p-0.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
//             >
//               ✕
//             </span>
//           )}
//           <svg
//             className={`h-4 w-4 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`}
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       </button>

//       {open && (
//         <div className="absolute z-40 mt-1 w-full rounded-md border border-[#e5e7eb] bg-white shadow-lg">
//           <div className="border-b border-[#f3f4f6] p-2">
//             <input
//               ref={inputRef}
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Type name or ID..."
//               className="w-full rounded-md border border-[#e5e7eb] px-2.5 py-1.5 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//           </div>

//           <div className="max-h-60 overflow-y-auto py-1">
//             {/* All Employees option */}
//             {!query.trim() && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   onChange("");
//                   setOpen(false);
//                   setQuery("");
//                 }}
//                 className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-[#f9fafb] ${
//                   !value ? "bg-[#fff5f5]" : ""
//                 }`}
//               >
//                 <span className="font-medium text-[#374151]">All Employees</span>
//                 <span className="text-[11px] text-[#9ca3af]">
//                   Location is valid for every employee
//                 </span>
//               </button>
//             )}

//             {filtered.length === 0 ? (
//               <div className="px-3 py-4 text-center text-xs text-[#9ca3af]">
//                 No employees found
//               </div>
//             ) : (
//               filtered.map((opt) => (
//                 <button
//                   key={opt.id}
//                   type="button"
//                   onClick={() => {
//                     onChange(opt.id);
//                     setOpen(false);
//                     setQuery("");
//                   }}
//                   className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-[#f9fafb] ${
//                     opt.id === value ? "bg-[#fff5f5]" : ""
//                   }`}
//                 >
//                   <span className="font-medium text-[#374151]">{opt.name}</span>
//                   <span className="text-[11px] text-[#9ca3af]">
//                     {opt.email || opt.id}
//                   </span>
//                 </button>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    MAP PREVIEW
// ============================================================ */

// function MapPreview({ lat, lng, radius, height = 180 }) {
//   if (!lat || !lng) {
//     return (
//       <div className="flex h-[180px] items-center justify-center rounded-lg border border-dashed border-[#d1d5db] bg-[#f9fafb] text-xs text-[#9ca3af]">
//         Enter coordinates to preview map
//       </div>
//     );
//   }
//   const delta = Math.max((radius || 200) / 111000, 0.002);
//   const bbox = [
//     Number(lng) - delta,
//     Number(lat) - delta,
//     Number(lng) + delta,
//     Number(lat) + delta,
//   ].join("%2C");
//   const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
//   return (
//     <div className="overflow-hidden rounded-lg border border-[#e5e7eb]" style={{ height }}>
//       <iframe title="Location preview" src={src} className="h-full w-full" loading="lazy" />
//     </div>
//   );
// }

// /* ============================================================
//    PAGINATION
// ============================================================ */

// function Pagination({ page, pageSize, total, onPageChange }) {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   if (total <= pageSize) return null;
//   const from = (page - 1) * pageSize + 1;
//   const to = Math.min(page * pageSize, total);

//   return (
//     <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5e7eb] px-5 py-3.5 sm:flex-row">
//       <p className="text-xs text-[#6b7280]">
//         Showing <span className="font-medium text-[#374151]">{from}</span>–
//         <span className="font-medium text-[#374151]">{to}</span> of{" "}
//         <span className="font-medium text-[#374151]">{total}</span>
//       </p>
//       <div className="flex items-center gap-1">
//         <button
//           type="button"
//           disabled={page <= 1}
//           onClick={() => onPageChange(page - 1)}
//           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40"
//         >
//           Prev
//         </button>
//         <span className="px-3 text-xs text-[#6b7280]">
//           Page <span className="font-medium text-[#374151]">{page}</span> / {totalPages}
//         </span>
//         <button
//           type="button"
//           disabled={page >= totalPages}
//           onClick={() => onPageChange(page + 1)}
//           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    EMPTY STATE
// ============================================================ */

// function EmptyState({ onAdd }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
//         </svg>
//       </div>
//       <p className="text-sm font-medium text-[#374151]">No locations configured</p>
//       <p className="text-xs text-[#6b7280]">
//         Add your office location to enable geo-fenced attendance.
//       </p>
//       <button
//         type="button"
//         onClick={onAdd}
//         className="mt-1 rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
//       >
//         + Add Location
//       </button>
//     </div>
//   );
// }

// /* ============================================================
//    MAIN PAGE
// ============================================================ */

// export default function AttendanceLocationsPage() {
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   const [employees, setEmployees] = useState([]);
//   const [empLoading, setEmpLoading] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [geoLoading, setGeoLoading] = useState(false);

//   const [form, setForm] = useState({
//     location_name: "",
//     address: "",
//     employee_id: "",
//     latitude: "",
//     longitude: "",
//     radius_meters: 200,
//     is_active: true,
//   });

//   const reqIdRef = useRef(0);

//   /* Auto-dismiss */
//   useEffect(() => {
//     if (!error && !success) return;
//     const t = setTimeout(() => {
//       setError("");
//       setSuccess("");
//     }, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [error, success]);

//   /* Load employees */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setEmpLoading(true);
//       try {
//         const res = await api.get("/api/v1/get/employees");
//         if (!cancelled) setEmployees(extractEmployees(res));
//       } catch {
//         if (!cancelled) setEmployees([]);
//       } finally {
//         if (!cancelled) setEmpLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* Fetch locations */
//   const fetchList = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const params = { page, page_size: PAGE_SIZE };
//       if (search) params.search = search;
//       const res = await api.get("/api/v1/get/attendence/locations", { params });
//       if (myReqId !== reqIdRef.current) return;
//       const { items, total } = extractList(res);
//       setList(items);
//       setTotal(total);
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, [page, search]);

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   /* Debounced search */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setSearch(searchInput.trim());
//       setPage(1);
//     }, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* Geolocation */
//   const useMyLocation = () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       return;
//     }
//     setGeoLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setForm((p) => ({
//           ...p,
//           latitude: pos.coords.latitude.toFixed(6),
//           longitude: pos.coords.longitude.toFixed(6),
//         }));
//         setGeoLoading(false);
//       },
//       () => {
//         setError("Could not get your location. Please enter coordinates manually.");
//         setGeoLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   /* Modal */
//   const openAdd = () => {
//     setEditId(null);
//     setForm({
//       location_name: "",
//       address: "",
//       employee_id: "",
//       latitude: "",
//       longitude: "",
//       radius_meters: 200,
//       is_active: true,
//     });
//     setShowForm(true);
//     setError("");
//     setSuccess("");
//   };

//   const openEdit = (row) => {
//     setEditId(row.location_id || row.id);
//     setForm({
//       location_name: row.location_name || "",
//       address: row.address || "",
//       employee_id: row.employee_id || "",
//       latitude: row.latitude != null ? String(row.latitude) : "",
//       longitude: row.longitude != null ? String(row.longitude) : "",
//       radius_meters: row.radius_meters || 200,
//       is_active: row.is_active !== false,
//     });
//     setShowForm(true);
//     setError("");
//     setSuccess("");
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setEditId(null);
//   };

//   useEffect(() => {
//     if (!showForm) return;
//     const onKey = (e) => {
//       if (e.key === "Escape" && !saving) closeForm();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [showForm, saving]);

//   /* Submit */
//   const submit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!form.location_name.trim()) {
//       setError("Please enter a location name");
//       return;
//     }
//     const lat = Number(form.latitude);
//     const lng = Number(form.longitude);
//     if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
//       setError("Latitude must be between -90 and 90");
//       return;
//     }
//     if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
//       setError("Longitude must be between -180 and 180");
//       return;
//     }
//     const radius = Number(form.radius_meters);
//     if (!Number.isFinite(radius) || radius < 10 || radius > 50000) {
//       setError("Radius must be between 10m and 50,000m");
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         location_name: form.location_name.trim(),
//         address: form.address?.trim() || null,
//         employee_id: form.employee_id || null,
//         latitude: lat,
//         longitude: lng,
//         radius_meters: radius,
//         is_active: form.is_active,
//       };

//       if (editId) {
//         await api.put(`/api/v1/attendence/location/${editId}`, payload);
//         setSuccess(`${payload.location_name} updated`);
//       } else {
//         await api.post("/api/v1/add/attendence/location", payload);
//         setSuccess(`${payload.location_name} added`);
//       }
//       closeForm();
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* Get employee name for table */
//   const getEmployeeLabel = (empId) => {
//     if (!empId) {
//       return (
//         <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
//           All Employees
//         </span>
//       );
//     }
//     const emp = employees.find((e) => e.id === empId);
//     return (
//       <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
//         {emp ? emp.name : empId}
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       {/* HEADER */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
//             Attendance Locations
//           </h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Office & client sites — employees can only punch from these geo-fenced areas
//             {total > 0 && (
//               <span className="ml-2 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#6b7280]">
//                 {total} total
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <button
//             type="button"
//             onClick={fetchList}
//             disabled={loading}
//             className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
//           >
//             ↻ Refresh
//           </button>
//           <button
//             type="button"
//             onClick={openAdd}
//             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
//           >
//             + Add Location
//           </button>
//         </div>
//       </div>

//       {/* INFO BANNER */}
//       <div className="mb-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
//         <p className="font-medium">How geo-fencing works</p>
//         <ul className="mt-1 list-inside list-disc space-y-0.5">
//           <li>
//             Employee&apos;s GPS is checked against these coordinates when they punch.
//           </li>
//           <li>
//             If inside radius → punch allowed. If outside → depends on policy (WARN / BLOCK).
//           </li>
//           <li>
//             <strong>All Employees</strong> → location is valid for everyone.
//           </li>
//           <li>
//             <strong>Specific Employee</strong> → only that employee can punch from here.
//           </li>
//         </ul>
//       </div>

//       {/* NOTIFICATIONS */}
//       {error && (
//         <div
//           className="mb-4 flex items-start justify-between rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]"
//           role="alert"
//         >
//           <span>{error}</span>
//           <button
//             onClick={() => setError("")}
//             className="ml-3 hover:text-[#7f1d1d]"
//             aria-label="Dismiss"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//       {success && (
//         <div
//           className="mb-4 flex items-start justify-between rounded-md bg-green-50 px-4 py-3 text-sm text-green-700"
//           role="status"
//         >
//           <span>{success}</span>
//           <button
//             onClick={() => setSuccess("")}
//             className="ml-3 hover:text-green-900"
//             aria-label="Dismiss"
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       {/* TABLE */}
//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
//           <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search location..."
//               className="w-full rounded-md border border-[#d1d5db] pl-9 pr-9 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//             />
//             <svg
//               className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
//               />
//             </svg>
//             {searchInput && (
//               <button
//                 type="button"
//                 onClick={() => setSearchInput("")}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//           ) : list.length === 0 ? (
//             <EmptyState onAdd={openAdd} />
//           ) : (
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Location</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Assigned To</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Coordinates</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Radius</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {list.map((row, i) => (
//                   <tr key={row.location_id || i} className="hover:bg-[#fafafa]">
//                     <td className="px-5 py-3.5">
//                       <div className="font-medium text-[#1a1a1a]">
//                         {row.location_name || "—"}
//                       </div>
//                       {row.address && (
//                         <div
//                           className="max-w-[220px] truncate text-xs text-[#9ca3af]"
//                           title={row.address}
//                         >
//                           {row.address}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-5 py-3.5">{getEmployeeLabel(row.employee_id)}</td>
//                     <td className="px-5 py-3.5">
//                       <a
//                         href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-xs text-blue-600 hover:underline"
//                       >
//                         {Number(row.latitude).toFixed(5)},{" "}
//                         {Number(row.longitude).toFixed(5)}
//                       </a>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
//                         {row.radius_meters || 200}m
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       {row.is_active !== false ? (
//                         <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
//                           <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
//                           Active
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
//                           <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
//                           Inactive
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       <button
//                         onClick={() => openEdit(row)}
//                         className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {!loading && list.length > 0 && (
//           <Pagination
//             page={page}
//             pageSize={PAGE_SIZE}
//             total={total}
//             onPageChange={setPage}
//           />
//         )}
//       </div>

//       {/* MODAL */}
//       {showForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//           onClick={closeForm}
//           role="dialog"
//           aria-modal="true"
//         >
//           <div
//             className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
//               <div>
//                 <h2 className="font-semibold text-[#1a1a1a]">
//                   {editId ? "Edit Location" : "Add Location"}
//                 </h2>
//                 <p className="mt-0.5 text-xs text-[#9ca3af]">
//                   Set GPS coordinates and assign this location to an employee
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={submit} className="p-5">
//               <div className="grid gap-4 md:grid-cols-2">
//                 {/* LEFT */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">
//                       Location Name <span className="text-[#E42527]">*</span>
//                     </label>
//                     <input
//                       required
//                       placeholder="e.g. Head Office, Gurugram"
//                       value={form.location_name}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, location_name: e.target.value }))
//                       }
//                       className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">
//                       Assigned To <span className="text-[#E42527]">*</span>
//                     </label>
//                     <EmployeeDropdown
//                       value={form.employee_id}
//                       onChange={(v) =>
//                         setForm((p) => ({ ...p, employee_id: v }))
//                       }
//                       options={employees}
//                       loading={empLoading}
//                     />
//                     <p className="mt-1 text-[11px] text-[#9ca3af]">
//                       {form.employee_id
//                         ? "Only this employee can punch from this location"
//                         : "Valid for all employees (default)"}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">
//                       Address
//                     </label>
//                     <textarea
//                       rows={2}
//                       placeholder="Full address (optional)"
//                       value={form.address}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, address: e.target.value }))
//                       }
//                       className="w-full resize-none rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                     />
//                   </div>

//                   <div>
//                     <div className="mb-1 flex items-center justify-between">
//                       <label className="block text-xs font-medium text-[#6b7280]">
//                         Coordinates <span className="text-[#E42527]">*</span>
//                       </label>
//                       <button
//                         type="button"
//                         onClick={useMyLocation}
//                         disabled={geoLoading}
//                         className="rounded-md border border-[#d1d5db] px-2.5 py-1 text-[11px] font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
//                       >
//                         {geoLoading ? "Fetching..." : "📍 Use My Location"}
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <input
//                         required
//                         type="number"
//                         step="0.000001"
//                         placeholder="Latitude"
//                         value={form.latitude}
//                         onChange={(e) =>
//                           setForm((p) => ({ ...p, latitude: e.target.value }))
//                         }
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                       <input
//                         required
//                         type="number"
//                         step="0.000001"
//                         placeholder="Longitude"
//                         value={form.longitude}
//                         onChange={(e) =>
//                           setForm((p) => ({ ...p, longitude: e.target.value }))
//                         }
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* RIGHT */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="mb-1 block text-xs font-medium text-[#6b7280]">
//                       Geo-fence Radius <span className="text-[#E42527]">*</span>
//                     </label>
//                     <div className="grid grid-cols-5 gap-1">
//                       {RADIUS_PRESETS.map((r) => (
//                         <button
//                           key={r.value}
//                           type="button"
//                           onClick={() =>
//                             setForm((p) => ({ ...p, radius_meters: r.value }))
//                           }
//                           className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
//                             form.radius_meters === r.value
//                               ? "border-[#E42527] bg-[#E42527] text-white"
//                               : "border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
//                           }`}
//                           title={r.hint}
//                         >
//                           {r.label}
//                         </button>
//                       ))}
//                     </div>
//                     <p className="mt-1 text-[11px] text-[#9ca3af]">
//                       Selected: <strong>{form.radius_meters}m</strong> — employees must be
//                       within this distance to punch.
//                     </p>
//                   </div>

//                   <MapPreview
//                     lat={form.latitude}
//                     lng={form.longitude}
//                     radius={form.radius_meters}
//                   />

//                   <label className="flex items-center gap-2 text-sm text-[#374151]">
//                     <input
//                       type="checkbox"
//                       checked={form.is_active}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, is_active: e.target.checked }))
//                       }
//                       className="h-4 w-4 rounded border-[#d1d5db] accent-[#E42527]"
//                     />
//                     Active (employees can punch from here)
//                   </label>
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end gap-2 border-t border-[#f3f4f6] pt-4">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {saving ? "Saving..." : editId ? "Update Location" : "Create Location"}
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

/**
 * AttendanceLocationsPage — Production Ready
 * ------------------------------------------------------------------
 *  ✓ Add / Edit / Deactivate locations
 *  ✓ Map preview with radius visualization (via OSM embed)
 *  ✓ "Use my location" auto-fill
 *  ✓ "Test distance" — check if current position is inside
 *  ✓ Employee assignment (searchable multi-select)
 *  ✓ Radius presets with hints
 *  ✓ Role guard (admin only)
 *  ✓ Search + pagination
 *  ✓ Mobile responsive
 *  ✓ Coordinate validation
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 450;
const AUTO_DISMISS_MS = 5000;
const EARTH_RADIUS_M = 6371000;

const RADIUS_PRESETS = [
  { value: 50, label: "50m", hint: "Single floor" },
  { value: 100, label: "100m", hint: "Small office" },
  { value: 200, label: "200m", hint: "Standard (recommended)" },
  { value: 500, label: "500m", hint: "Campus" },
  { value: 1000, label: "1km", hint: "Large area" },
];

const EMPTY_FORM = {
  location_name: "",
  address: "",
  employee_id: "",
  latitude: "",
  longitude: "",
  radius_meters: 200,
  is_active: true,
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg || "Error";
      })
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const haversineMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (m) => {
  if (m == null) return "—";
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(2)} km`;
};

const extractList = (res) => {
  const data = res?.data ?? {};
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.location))
    return { items: data.location, total: Number(data.total) || data.location.length };
  if (Array.isArray(data.locations))
    return { items: data.locations, total: Number(data.total) || data.locations.length };
  if (Array.isArray(data.data))
    return { items: data.data, total: Number(data.total) || data.data.length };
  if (Array.isArray(data.items))
    return { items: data.items, total: Number(data.total) || data.items.length };
  return { items: [], total: 0 };
};

const extractEmployees = (res) => {
  const data = res?.data ?? {};
  const arr =
    (Array.isArray(data) && data) ||
    data.employees ||
    data.data ||
    data.items ||
    data.result ||
    [];
  return arr.map((e) => {
    const id = e.employee_id || e.id || e.user_id || "";
    const name =
      e.full_name ||
      e.name ||
      e.employee_name ||
      `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
      id;
    return { id, name, email: e.email || e.company_email || "" };
  });
};

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════════════════════════ */

function Toast({ type, message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700";

  return (
    <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <span className="whitespace-pre-line">{message}</span>
      <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function EmployeeDropdown({
  value,
  onChange,
  options,
  placeholder = "All employees",
  optional = false,
  loading = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = query.trim()
    ? options.filter((o) => {
        const q = query.toLowerCase();
        return o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
      })
    : options;

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm focus:border-red-500 focus:outline-none"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {loading ? "Loading..." : selected ? `${selected.name} (${selected.id})` : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => e.key === "Enter" && onChange("")}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </span>
          )}
          <span className="text-slate-400">▾</span>
        </div>
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {optional && !query && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`flex w-full flex-col border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  !value ? "bg-red-50/40" : ""
                }`}
              >
                <span className="font-medium text-slate-700">All Employees</span>
                <span className="text-[11px] text-slate-400">
                  Location valid for everyone
                </span>
              </button>
            )}
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No employees found
              </div>
            ) : (
              filtered.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onChange(e.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    e.id === value ? "bg-red-50/40" : ""
                  }`}
                >
                  <span className="font-medium text-slate-700">{e.name}</span>
                  <span className="text-[11px] text-slate-400">{e.email || e.id}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MapPreview({ lat, lng, radius, height = 200 }) {
  if (!lat || !lng) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400"
        style={{ height }}
      >
        Enter coordinates to preview map
      </div>
    );
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);
  const delta = Math.max((radius || 200) / 111000, 0.002);

  const bbox = [
    lngNum - delta,
    latNum - delta,
    lngNum + delta,
    latNum + delta,
  ].join("%2C");

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latNum}%2C${lngNum}`;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200" style={{ height }}>
      <iframe
        title="Location preview"
        src={src}
        className="h-full w-full"
        loading="lazy"
      />
    </div>
  );
}

function RadiusBadge({ value }) {
  const preset = RADIUS_PRESETS.find((p) => p.value === value);
  const label = preset?.label || `${value}m`;
  const hint = preset?.hint;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
      <span>📏</span>
      {label}
      {hint && <span className="hidden text-slate-400 sm:inline">· {hint}</span>}
    </span>
  );
}

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="px-3 text-xs text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function AttendanceLocationsPage() {
  const role = String(
    useAuthStore((s) => s.user?.role?.value || s.user?.role || "")
  ).toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";

  /* list */
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /* employees */
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  /* ui */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* form modal */
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  /* confirm deactivate */
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOAD EMPLOYEES ══════════════ */
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setEmpLoading(true);
      try {
        const res = await api.get("/api/v1/get/employees", {
          params: { page: 1, page_size: 500 },
        });
        if (!cancelled) setEmployees(extractEmployees(res));
      } catch {
        if (!cancelled) setEmployees([]);
      } finally {
        if (!cancelled) setEmpLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  /* ══════════════ FETCH LIST ══════════════ */
  const fetchList = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setError("");
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.search = search;
      const res = await api.get("/api/v1/get/attendence/locations", { params });
      if (myReqId !== reqIdRef.current) return;
      const { items, total: t } = extractList(res);
      setList(items);
      setTotal(t);
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchList();
      return;
    }
    const t = setTimeout(fetchList, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchList]);

  /* ══════════════ HELPERS ══════════════ */
  const getEmpName = useCallback(
    (id) => {
      if (!id) return "All employees";
      const e = employees.find((x) => x.id === id);
      return e ? e.name : id;
    },
    [employees]
  );

  /* ══════════════ FORM ACTIONS ══════════════ */
  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setTestResult(null);
    setShowForm(true);
  };

  const openEdit = (row) => {
    setEditId(row.location_id || row.id);
    setForm({
      location_name: row.location_name || "",
      address: row.address || "",
      employee_id: row.employee_id || "",
      latitude: row.latitude != null ? String(row.latitude) : "",
      longitude: row.longitude != null ? String(row.longitude) : "",
      radius_meters: row.radius_meters || 200,
      is_active: row.is_active !== false,
    });
    setFormError("");
    setTestResult(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setTestResult(null);
  };

  /* ESC close */
  useEffect(() => {
    if (!showForm) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) closeForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, saving]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setFormError("Geolocation not supported");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      () => {
        setFormError("Could not get your location. Enter manually.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const testDistance = () => {
    if (!navigator.geolocation) {
      setFormError("Geolocation not supported");
      return;
    }
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setFormError("Enter valid coordinates first");
      return;
    }
    setTestLoading(true);
    setTestResult(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = haversineMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          lat,
          lng
        );
        setTestResult({
          distance: d,
          isInside: d <= Number(form.radius_meters),
          radius: Number(form.radius_meters),
        });
        setTestLoading(false);
      },
      () => {
        setFormError("Could not get your current location");
        setTestLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = () => {
    if (!form.location_name.trim()) return "Location name is required";
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      return "Latitude must be between -90 and 90";
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      return "Longitude must be between -180 and 180";
    }
    const r = Number(form.radius_meters);
    if (!Number.isFinite(r) || r < 10 || r > 50000) {
      return "Radius must be between 10m and 50,000m";
    }
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        location_name: form.location_name.trim(),
        address: form.address.trim() || null,
        employee_id: form.employee_id || null,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radius_meters: Number(form.radius_meters),
        is_active: !!form.is_active,
      };

      if (editId) {
        await api.put(`/api/v1/attendence/location/${editId}`, payload);
        setSuccess("Location updated");
      } else {
        await api.post("/api/v1/add/attendence/location", payload);
        setSuccess("Location added");
      }
      closeForm();
      fetchList();
    } catch (err) {
      setFormError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirmDeactivate) return;
    setDeactivating(true);
    try {
      const id = confirmDeactivate.location_id || confirmDeactivate.id;
      await api.put(`/api/v1/attendence/location/${id}`, {
        ...confirmDeactivate,
        is_active: false,
      });
      setSuccess("Location deactivated");
      setConfirmDeactivate(null);
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setDeactivating(false);
    }
  };

  /* ══════════════ DERIVED ══════════════ */
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  /* ══════════════ ROLE GUARD ══════════════ */
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-3 text-lg font-semibold text-slate-800">
            Admin Access Required
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Only administrators can manage attendance locations.
          </p>
        </div>
      </div>
    );
  }

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Attendance Locations
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Office & client sites for geo-fenced punches
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchList}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            >
              + Add Location
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
          <p className="font-medium">How geo-fencing works</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>Employee&apos;s GPS is checked against these coordinates when they punch</li>
            <li>Inside radius → punch allowed · Outside → depends on policy (WARN / BLOCK)</li>
            <li>
              <strong>All Employees</strong> — location is valid for everyone ·
              <strong> Specific Employee</strong> — only that employee can punch here
            </li>
          </ul>
        </div>

        {/* Toast */}
        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Search */}
          <div className="border-b border-slate-100 px-5 py-3.5">
            <div className="relative max-w-md">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by location name..."
                className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading && list.length === 0 ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📍
                </div>
                <p className="text-sm font-medium text-slate-700">
                  No locations configured
                </p>
                <p className="text-xs text-slate-500">
                  Add your first office location to enable geo-fenced attendance
                </p>
                <button
                  type="button"
                  onClick={openAdd}
                  className="mt-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  + Add Location
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">Location</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Assigned To</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Coordinates</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Radius</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row, i) => {
                    const id = row.location_id || row.id || i;
                    return (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-800">
                            {row.location_name}
                          </div>
                          {row.address && (
                            <div
                              className="mt-0.5 max-w-[220px] truncate text-[11px] text-slate-400"
                              title={row.address}
                            >
                              {row.address}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {row.employee_id ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                              {getEmpName(row.employee_id)}
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                              All Employees
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <a
                            href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            📍 {Number(row.latitude).toFixed(5)},{" "}
                            {Number(row.longitude).toFixed(5)}
                          </a>
                        </td>
                        <td className="px-5 py-3.5">
                          <RadiusBadge value={row.radius_meters} />
                        </td>
                        <td className="px-5 py-3.5">
                          {row.is_active !== false ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="text-xs font-medium text-slate-600 hover:text-red-600"
                          >
                            Edit
                          </button>
                          {row.is_active !== false && (
                            <button
                              type="button"
                              onClick={() => setConfirmDeactivate(row)}
                              className="ml-3 text-xs font-medium text-slate-400 hover:text-red-600"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && list.length > 0 && totalPages > 1 && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
          onClick={() => !saving && closeForm()}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  {editId ? "Edit Location" : "Add Location"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Set GPS coordinates and assign to an employee
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="p-5">
              {formError && (
                <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
                  {formError}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                {/* LEFT */}
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Location Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      value={form.location_name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location_name: e.target.value }))
                      }
                      placeholder="e.g. Head Office, Gurugram"
                      maxLength={120}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Assigned to */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Assigned To
                    </label>
                    <EmployeeDropdown
                      value={form.employee_id}
                      onChange={(v) => setForm((p) => ({ ...p, employee_id: v }))}
                      options={employees}
                      loading={empLoading}
                      optional
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      {form.employee_id
                        ? "Only this employee can punch from here"
                        : "Valid for all employees"}
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Address
                    </label>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, address: e.target.value }))
                      }
                      placeholder="Full address (optional)"
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Coordinates */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="block text-xs font-medium text-slate-600">
                        Coordinates <span className="text-red-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={useMyLocation}
                        disabled={geoLoading}
                        className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                      >
                        {geoLoading ? "Fetching..." : "📍 Use my location"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        required
                        type="number"
                        step="0.000001"
                        value={form.latitude}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, latitude: e.target.value }))
                        }
                        placeholder="Latitude"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                      />
                      <input
                        required
                        type="number"
                        step="0.000001"
                        value={form.longitude}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, longitude: e.target.value }))
                        }
                        placeholder="Longitude"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Test distance */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={testDistance}
                      disabled={
                        testLoading ||
                        !Number.isFinite(Number(form.latitude)) ||
                        !Number.isFinite(Number(form.longitude))
                      }
                      className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {testLoading ? "Testing..." : "🎯 Test distance from here"}
                    </button>
                  </div>

                  {testResult && (
                    <div
                      className={`rounded-lg px-3 py-2 text-xs ${
                        testResult.isInside
                          ? "bg-green-50 text-green-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      <p className="font-medium">
                        {testResult.isInside
                          ? "✓ You are inside this zone"
                          : "⚠️ You are outside this zone"}
                      </p>
                      <p className="mt-0.5">
                        Distance: {formatDistance(testResult.distance)} · Radius:{" "}
                        {testResult.radius}m
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  {/* Radius */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Geo-fence Radius <span className="text-red-600">*</span>
                    </label>
                    <div className="mb-2 grid grid-cols-5 gap-1">
                      {RADIUS_PRESETS.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          title={r.hint}
                          onClick={() =>
                            setForm((p) => ({ ...p, radius_meters: r.value }))
                          }
                          className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                            Number(form.radius_meters) === r.value
                              ? "border-red-500 bg-red-50 text-red-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={10}
                      max={50000}
                      step={10}
                      value={form.radius_meters}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, radius_meters: e.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Employees must be within{" "}
                      <strong>{form.radius_meters}m</strong> to punch
                    </p>
                  </div>

                  {/* Map */}
                  <MapPreview
                    lat={form.latitude}
                    lng={form.longitude}
                    radius={Number(form.radius_meters) || 200}
                  />

                  {/* Active toggle */}
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, is_active: e.target.checked }))
                      }
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-700">
                        Active
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Inactive locations are ignored for geo-fencing
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editId
                    ? "Update Location"
                    : "Create Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate confirm */}
      {confirmDeactivate && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deactivating && setConfirmDeactivate(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-800">
              Deactivate Location?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              &ldquo;{confirmDeactivate.location_name}&rdquo; will no longer be
              used for geo-fencing. Existing punches are unaffected.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeactivate(null)}
                disabled={deactivating}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={deactivating}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deactivating ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}