
// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import { api } from "@/app/lib/api";

// // // const formatApiError = (err) => {
// // //   const detail = err?.response?.data?.detail;
// // //   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
// // //   if (typeof detail === "string") return detail;
// // //   return err?.message || "Something went wrong";
// // // };

// // // const toArray = (p) => {
// // //   if (!p) return [];
// // //   if (Array.isArray(p)) return p;
// // //   if (Array.isArray(p?.location)) return p.location;
// // //   if (Array.isArray(p?.locations)) return p.locations;
// // //   if (Array.isArray(p?.data)) return p.data;
// // //   return [];
// // // };

// // // export default function AttendanceLocationsPage() {
// // //   const [list, setList] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [saving, setSaving] = useState(false);
// // //   const [gettingLocation, setGettingLocation] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");
// // //   const [showForm, setShowForm] = useState(false);
// // //   const [editId, setEditId] = useState(null);
// // //   const [form, setForm] = useState({
// // //     location_name: "",
// // //     address: "",
// // //     latitude: "",
// // //     longitude: "",
// // //     radius_meters: "200",
// // //     is_active: true,
// // //   });

// // //   const fetchList = async () => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api.get("/api/v1/get/attendence/locations", {
// // //         params: { page: 1, page_size: 50 },
// // //       });
// // //       setList(toArray(res?.data));
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //       setList([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const load = async () => {
// // //       await fetchList();
// // //     };
// // //     load();
// // //   }, []);

// // //   // ✅ Current location lene ka function
// // //   const getCurrentLocation = () => {
// // //     if (!navigator.geolocation) {
// // //       setError("Geolocation is not supported on this browser");
// // //       return;
// // //     }

// // //     setGettingLocation(true);
// // //     setError("");

// // //     navigator.geolocation.getCurrentPosition(
// // //       (pos) => {
// // //         setForm((prev) => ({
// // //           ...prev,
// // //           latitude: pos.coords.latitude.toFixed(6),
// // //           longitude: pos.coords.longitude.toFixed(6),
// // //         }));
// // //         setGettingLocation(false);
// // //         setSuccess("Current location fetched successfully");
// // //         setTimeout(() => setSuccess(""), 2500);
// // //       },
// // //       (err) => {
// // //         setGettingLocation(false);
// // //         let msg = "Unable to get location";
// // //         if (err.code === 1) msg = "Location permission denied. Please allow location.";
// // //         if (err.code === 2) msg = "Location unavailable. Try again.";
// // //         if (err.code === 3) msg = "Location request timed out. Try again.";
// // //         setError(msg);
// // //       },
// // //       {
// // //         enableHighAccuracy: true,
// // //         timeout: 15000,
// // //         maximumAge: 0,
// // //       }
// // //     );
// // //   };

// // //   const openAdd = () => {
// // //     setEditId(null);
// // //     setForm({
// // //       location_name: "",
// // //       address: "",
// // //       latitude: "",
// // //       longitude: "",
// // //       radius_meters: "200",
// // //       is_active: true,
// // //     });
// // //     setShowForm(true);
// // //     setError("");
// // //     setSuccess("");
// // //   };

// // //   const openEdit = (row) => {
// // //     setEditId(row.location_id);
// // //     setForm({
// // //       location_name: row.location_name || "",
// // //       address: row.address || "",
// // //       latitude: String(row.latitude ?? ""),
// // //       longitude: String(row.longitude ?? ""),
// // //       radius_meters: String(row.radius_meters ?? 200),
// // //       is_active: row.is_active !== false,
// // //     });
// // //     setShowForm(true);
// // //     setError("");
// // //     setSuccess("");
// // //   };

// // //   const submit = async (e) => {
// // //     e.preventDefault();
// // //     setSaving(true);
// // //     setError("");
// // //     setSuccess("");

// // //     try {
// // //       const payload = {
// // //         location_name: form.location_name,
// // //         address: form.address || null,
// // //         latitude: Number(form.latitude),
// // //         longitude: Number(form.longitude),
// // //         radius_meters: Number(form.radius_meters),
// // //         is_active: form.is_active,
// // //       };

// // //       if (editId) {
// // //         await api.put(`/api/v1/attendence/location/${editId}`, payload);
// // //         setSuccess("Location updated successfully");
// // //       } else {
// // //         await api.post("/api/v1/add/attendence/location", payload);
// // //         setSuccess("Location added successfully");
// // //       }

// // //       setShowForm(false);
// // //       fetchList();
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// // //       <div className="mb-6 flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Geo Locations</h1>
// // //           <p className="mt-1 text-sm text-[#6b7280]">
// // //             Office / client fence points
// // //           </p>
// // //         </div>
// // //         <button
// // //           onClick={openAdd}
// // //           className="rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// // //         >
// // //           + Add Location
// // //         </button>
// // //       </div>

// // //       {error && (
// // //         <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
// // //           {error}
// // //         </div>
// // //       )}
// // //       {success && (
// // //         <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
// // //           {success}
// // //         </div>
// // //       )}

// // //       <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
// // //         <div className="overflow-x-auto">
// // //           {loading ? (
// // //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// // //           ) : list.length === 0 ? (
// // //             <div className="py-16 text-center text-sm text-[#6b7280]">
// // //               No locations found
// // //             </div>
// // //           ) : (
// // //             <table className="w-full min-w-[800px] text-left text-sm">
// // //               <thead>
// // //                 <tr className="border-b bg-[#f9fafb]">
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Latitude</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Longitude</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Radius (m)</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Active</th>
// // //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">
// // //                     Actions
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y">
// // //                 {list.map((row) => (
// // //                   <tr key={row.location_id} className="hover:bg-[#fafafa]">
// // //                     <td className="px-5 py-3.5 font-medium">{row.location_name}</td>
// // //                     <td className="px-5 py-3.5">{row.latitude}</td>
// // //                     <td className="px-5 py-3.5">{row.longitude}</td>
// // //                     <td className="px-5 py-3.5">{row.radius_meters}</td>
// // //                     <td className="px-5 py-3.5">
// // //                       <span
// // //                         className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
// // //                           row.is_active
// // //                             ? "bg-green-50 text-green-700"
// // //                             : "bg-gray-100 text-gray-600"
// // //                         }`}
// // //                       >
// // //                         {row.is_active ? "Active" : "Inactive"}
// // //                       </span>
// // //                     </td>
// // //                     <td className="px-5 py-3.5 text-right">
// // //                       <button
// // //                         onClick={() => openEdit(row)}
// // //                         className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
// // //                       >
// // //                         Edit
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Form Modal */}
// // //       {showForm && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// // //           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b px-5 py-4">
// // //               <h2 className="font-semibold">
// // //                 {editId ? "Edit Location" : "Add Location"}
// // //               </h2>
// // //               <button onClick={() => setShowForm(false)}>✕</button>
// // //             </div>

// // //             <form onSubmit={submit} className="space-y-3 p-5">
// // //               <input
// // //                 required
// // //                 placeholder="Location name *"
// // //                 value={form.location_name}
// // //                 onChange={(e) =>
// // //                   setForm((p) => ({ ...p, location_name: e.target.value }))
// // //                 }
// // //                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
// // //               />

// // //               <input
// // //                 placeholder="Address"
// // //                 value={form.address}
// // //                 onChange={(e) =>
// // //                   setForm((p) => ({ ...p, address: e.target.value }))
// // //                 }
// // //                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
// // //               />

// // //               {/* Latitude + Longitude + Get Location button */}
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <input
// // //                   required
// // //                   type="number"
// // //                   step="any"
// // //                   placeholder="Latitude *"
// // //                   value={form.latitude}
// // //                   onChange={(e) =>
// // //                     setForm((p) => ({ ...p, latitude: e.target.value }))
// // //                   }
// // //                   className="w-full rounded-lg border px-3 py-2.5 text-sm"
// // //                 />
// // //                 <input
// // //                   required
// // //                   type="number"
// // //                   step="any"
// // //                   placeholder="Longitude *"
// // //                   value={form.longitude}
// // //                   onChange={(e) =>
// // //                     setForm((p) => ({ ...p, longitude: e.target.value }))
// // //                   }
// // //                   className="w-full rounded-lg border px-3 py-2.5 text-sm"
// // //                 />
// // //               </div>

// // //               {/* ✅ Current Location Button */}
// // //               <button
// // //                 type="button"
// // //                 onClick={getCurrentLocation}
// // //                 disabled={gettingLocation}
// // //                 className="w-full rounded-lg border border-[#E42527] py-2.5 text-sm font-medium text-[#E42527] hover:bg-red-50 disabled:opacity-60"
// // //               >
// // //                 {gettingLocation
// // //                   ? "Getting location..."
// // //                   : "📍 Use Current Location"}
// // //               </button>

// // //               <input
// // //                 required
// // //                 type="number"
// // //                 placeholder="Radius (meters)"
// // //                 value={form.radius_meters}
// // //                 onChange={(e) =>
// // //                   setForm((p) => ({ ...p, radius_meters: e.target.value }))
// // //                 }
// // //                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
// // //               />

// // //               <label className="flex items-center gap-2 text-sm">
// // //                 <input
// // //                   type="checkbox"
// // //                   checked={form.is_active}
// // //                   onChange={(e) =>
// // //                     setForm((p) => ({ ...p, is_active: e.target.checked }))
// // //                   }
// // //                 />
// // //                 Active
// // //               </label>

// // //               <div className="flex justify-end gap-2 pt-2">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowForm(false)}
// // //                   className="rounded-lg border px-4 py-2 text-sm"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   disabled={saving}
// // //                   className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
// // //                 >
// // //                   {saving ? "Saving..." : "Save"}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import { useEffect, useState } from "react";
// // import { api } from "@/app/lib/api";

// // function getErrorMessage(err) {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) {
// //     return detail.map((i) => i?.msg || "Error").join(", ");
// //   }
// //   if (typeof detail === "string") return detail;
// //   if (detail && typeof detail === "object") {
// //     return detail.msg || detail.message || "Request failed";
// //   }
// //   return err?.message || "Something went wrong";
// // }

// // function toArray(payload) {
// //   if (!payload) return [];
// //   if (Array.isArray(payload)) return payload;

// //   const candidates = [];
// //   if (payload && typeof payload === "object") {
// //     candidates.push(payload.data, payload.locations, payload.results, payload.items, payload.result, payload.records, payload.list);
// //     if (payload.data && typeof payload.data === "object") {
// //       candidates.push(payload.data.locations, payload.data.results, payload.data.items, payload.data.result, payload.data.records, payload.data.list);
// //     }
// //     if (payload.details && typeof payload.details === "object") {
// //       candidates.push(payload.details, payload.details.data, payload.details.locations, payload.details.results);
// //     }
// //   }

// //   for (const candidate of candidates) {
// //     if (Array.isArray(candidate)) return candidate;
// //   }

// //   if (payload && typeof payload === "object") {
// //     const values = Object.values(payload);
// //     for (const value of values) {
// //       if (Array.isArray(value)) return value;
// //       if (value && typeof value === "object") {
// //         const nested = toArray(value);
// //         if (nested.length) return nested;
// //       }
// //     }
// //   }

// //   return [];
// // }

// // export default function LocationsPage() {
// //   const [locations, setLocations] = useState([]);
// //   const [locationName, setLocationName] = useState("");
// //   const [locationDescription, setLocationDescription] = useState("");
// //   const [locationPinCode, setLocationPinCode] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [showAddForm, setShowAddForm] = useState(false);
// //   const [search, setSearch] = useState("");
// //   const [submitting, setSubmitting] = useState(false);

// //   useEffect(() => {
// //     fetchLocations();
// //   }, []);

// //   async function fetchLocations() {
// //     setError("");
// //     setLoading(true);
// //     try {
// //       const res = await api.get("/api/v1/get/location/master");
// //       const payload = res?.data ?? res;
// //       console.log("LOCATIONS RESPONSE:", payload);
// //       setLocations(toArray(payload));
// //     } catch (err) {
// //       console.error("Locations fetch error:", err?.response || err);
// //       setError(getErrorMessage(err));
// //       setLocations([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function addLocation(e) {
// //     e.preventDefault();
// //     if (!locationName.trim()) return;

// //     setError("");
// //     setSubmitting(true);
// //     try {
// //       await api.post("/api/v1/create/location/master", {
// //         location_name: locationName.trim(),
// //         location_description: locationDescription.trim() || null,
// //         location_pin_code: locationPinCode.trim() || null,
// //       });

// //       setLocationName("");
// //       setLocationDescription("");
// //       setLocationPinCode("");
// //       setShowAddForm(false);
// //       await fetchLocations();
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   }

// //   function closeModal() {
// //     setShowAddForm(false);
// //     setError("");
// //     setLocationName("");
// //     setLocationDescription("");
// //     setLocationPinCode("");
// //   }

// //   const list = Array.isArray(locations) ? locations : [];
// //   const filteredLocations = list.filter((loc) => {
// //     const name = (loc?.location_name || loc?.name || loc?.title || "").toLowerCase();
// //     return name.includes((search || "").toLowerCase());
// //   });

// //   return (
// //     <div className="min-h-screen bg-[#f5f6f8] p-6">
// //       {/* Header */}
// //       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Locations</h1>
// //           <p className="mt-1 text-sm text-[#6b7280]">
// //             Manage location master data for your organization
// //           </p>
// //         </div>

// //         <button
// //           type="button"
// //           onClick={() => {
// //             setError("");
// //             setShowAddForm(true);
// //           }}
// //           className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
// //         >
// //           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
// //           </svg>
// //           Add Location
// //         </button>
// //       </div>

// //       {error && !showAddForm && (
// //         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
// //           {error}
// //         </div>
// //       )}

// //       {/* Card */}
// //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// //         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
// //           <div className="relative w-full max-w-xs">
// //             <svg
// //               className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //               strokeWidth={2}
// //             >
// //               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //             </svg>
// //             <input
// //               type="text"
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Search locations..."
// //               className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //             />
// //           </div>
// //           <div className="text-sm text-[#6b7280]">
// //             {filteredLocations.length} location{filteredLocations.length !== 1 ? "s" : ""}
// //           </div>
// //         </div>

// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="flex items-center justify-center py-16">
// //               <p className="text-sm text-[#6b7280]">Loading locations...</p>
// //             </div>
// //           ) : filteredLocations.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-16 text-center">
// //               <p className="text-sm font-medium text-[#374151]">No locations found</p>
// //               <p className="mt-1 text-sm text-[#6b7280]">
// //                 {search ? "Try a different search term" : "Add your first location"}
// //               </p>
// //               {!search && (
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowAddForm(true)}
// //                   className="mt-4 text-sm font-medium text-[#E42527] hover:underline"
// //                 >
// //                   + Add Location
// //                 </button>
// //               )}
// //             </div>
// //           ) : (
// //             <table className="w-full text-left text-sm">
// //               <thead>
// //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Location Name</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Description</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Pin Code</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-[#f3f4f6]">
// //                 {filteredLocations.map((location, index) => (
// //                   <tr
// //                     key={location?.location_id || location?.id || index}
// //                     className="hover:bg-[#fafafa]"
// //                   >
// //                     <td className="px-5 py-3.5">
// //                       <div className="flex items-center gap-3">
// //                         <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fef2f2] text-xs font-semibold text-[#E42527]">
// //                           {(location?.location_name || location?.name || "L")[0]?.toUpperCase()}
// //                         </div>
// //                         <span className="font-medium text-[#1a1a1a]">
// //                           {location?.location_name || location?.name || `Location ${index + 1}`}
// //                         </span>
// //                       </div>
// //                     </td>
// //                     <td className="max-w-[220px] truncate px-5 py-3.5 text-[#6b7280]">
// //                       {location?.location_description || location?.description || "—"}
// //                     </td>
// //                     <td className="px-5 py-3.5 text-[#6b7280]">
// //                       {location?.location_pin_code || location?.pin_code || "—"}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       </div>

// //       {/* Modal */}
// //       {showAddForm && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //           <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
// //             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
// //               <h2 className="text-lg font-semibold text-[#1a1a1a]">Add Location</h2>
// //               <button
// //                 type="button"
// //                 onClick={closeModal}
// //                 className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={addLocation} className="p-5">
// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
// //                     Location Name <span className="text-[#E42527]">*</span>
// //                   </label>
// //                   <input
// //                     value={locationName}
// //                     onChange={(e) => setLocationName(e.target.value)}
// //                     required
// //                     autoFocus
// //                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //                     placeholder="e.g. Head Office"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
// //                     Description
// //                   </label>
// //                   <textarea
// //                     value={locationDescription}
// //                     onChange={(e) => setLocationDescription(e.target.value)}
// //                     rows={2}
// //                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //                     placeholder="Optional description"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
// //                     Pin Code
// //                   </label>
// //                   <input
// //                     value={locationPinCode}
// //                     onChange={(e) => setLocationPinCode(e.target.value)}
// //                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// //                     placeholder="e.g. 110001"
// //                   />
// //                 </div>

// //                 {error && (
// //                   <div className="rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
// //                     {error}
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="mt-6 flex items-center justify-end gap-3">
// //                 <button
// //                   type="button"
// //                   onClick={closeModal}
// //                   className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={submitting || !locationName.trim()}
// //                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {submitting ? "Submitting..." : "Submit"}
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

// import { useEffect, useState, useMemo } from "react";
// import { api } from "@/app/lib/api";
// import {
//   MapPin,
//   Plus,
//   Search,
//   X,
//   Pencil,
//   Trash2,
//   Building2,
//   Hash,
//   FileText,
//   Loader2,
//   MapPinned,
//   CheckCircle2,
//   XCircle,
//   MoreVertical,
//   Info,
//   ChevronDown,
// } from "lucide-react";

// /* ═══════════════════════════════════════════════════════
//    HELPERS
//    ═══════════════════════════════════════════════════════ */

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail.map((i) => i?.msg || "Error").join(", ");
//   }
//   if (typeof detail === "string") return detail;
//   if (detail && typeof detail === "object") {
//     return detail.msg || detail.message || "Request failed";
//   }
//   return err?.message || "Something went wrong";
// }

// function toArray(payload) {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;

//   const candidates = [];
//   if (payload && typeof payload === "object") {
//     candidates.push(
//       payload.data,
//       payload.locations,
//       payload.results,
//       payload.items,
//       payload.result,
//       payload.records,
//       payload.list
//     );
//     if (payload.data && typeof payload.data === "object") {
//       candidates.push(
//         payload.data.locations,
//         payload.data.results,
//         payload.data.items,
//         payload.data.result,
//         payload.data.records,
//         payload.data.list
//       );
//     }
//     if (payload.details && typeof payload.details === "object") {
//       candidates.push(
//         payload.details,
//         payload.details.data,
//         payload.details.locations,
//         payload.details.results
//       );
//     }
//   }

//   for (const candidate of candidates) {
//     if (Array.isArray(candidate)) return candidate;
//   }

//   if (payload && typeof payload === "object") {
//     const values = Object.values(payload);
//     for (const value of values) {
//       if (Array.isArray(value)) return value;
//       if (value && typeof value === "object") {
//         const nested = toArray(value);
//         if (nested.length) return nested;
//       }
//     }
//   }

//   return [];
// }

// function initials(name) {
//   return String(name || "L")
//     .trim()
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase();
// }

// /* ═══════════════════════════════════════════════════════
//    MAIN PAGE
//    ═══════════════════════════════════════════════════════ */

// export default function LocationsPage() {
//   const [locations, setLocations] = useState([]);
//   const [locationName, setLocationName] = useState("");
//   const [locationDescription, setLocationDescription] = useState("");
//   const [locationPinCode, setLocationPinCode] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [search, setSearch] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   async function fetchLocations() {
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.get("/api/v1/get/location/master");
//       const payload = res?.data ?? res;
//       setLocations(toArray(payload));
//     } catch (err) {
//       setError(getErrorMessage(err));
//       setLocations([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!locationName.trim()) return;

//     setError("");
//     setSubmitting(true);
//     try {
//       const payload = {
//         location_name: locationName.trim(),
//         location_description: locationDescription.trim() || null,
//         location_pin_code: locationPinCode.trim() || null,
//       };

//       if (editId) {
//         await api.put(`/api/v1/update/location/${editId}`, payload);
//       } else {
//         await api.post("/api/v1/create/location/master", payload);
//       }

//       resetForm();
//       setShowAddForm(false);
//       await fetchLocations();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   function resetForm() {
//     setLocationName("");
//     setLocationDescription("");
//     setLocationPinCode("");
//     setEditId(null);
//     setError("");
//   }

//   function openAddModal() {
//     resetForm();
//     setShowAddForm(true);
//   }

//   function openEditModal(loc) {
//     setEditId(loc?.location_id || loc?.id);
//     setLocationName(loc?.location_name || loc?.name || "");
//     setLocationDescription(loc?.location_description || loc?.description || "");
//     setLocationPinCode(loc?.location_pin_code || loc?.pin_code || "");
//     setShowAddForm(true);
//     setError("");
//   }

//   function closeModal() {
//     setShowAddForm(false);
//     resetForm();
//   }

//   const list = Array.isArray(locations) ? locations : [];

//   const filteredLocations = useMemo(() => {
//     const q = (search || "").toLowerCase().trim();
//     if (!q) return list;
//     return list.filter((loc) => {
//       const name = (loc?.location_name || loc?.name || loc?.title || "").toLowerCase();
//       const desc = (loc?.location_description || loc?.description || "").toLowerCase();
//       const pin = String(loc?.location_pin_code || loc?.pin_code || "");
//       return name.includes(q) || desc.includes(q) || pin.includes(q);
//     });
//   }, [list, search]);

//   const stats = useMemo(() => {
//     const total = list.length;
//     const withPin = list.filter((l) => l?.location_pin_code || l?.pin_code).length;
//     const withDesc = list.filter((l) => l?.location_description || l?.description).length;
//     return { total, withPin, withDesc };
//   }, [list]);

//   return (
//     <div className="min-h-screen bg-[#f5f6f8]">
//       <div className="mx-auto max-w-7xl px-6 py-6">
//         {/* ═══════════ HEADER ═══════════ */}
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#b91c1c] text-white shadow-lg shadow-red-200">
//               <MapPinned className="h-5 w-5" />
//             </div>
//             <div>
//               <h1 className="text-[22px] font-bold text-[#1a1a1a]">Locations</h1>
//               <p className="text-sm text-[#6b7280]">
//                 Manage your organization's office and facility locations
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={openAddModal}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-[#c91f21] hover:shadow-md"
//           >
//             <Plus className="h-4 w-4" />
//             Add Location
//           </button>
//         </div>

//         {/* ═══════════ ERROR ═══════════ */}
//         {error && !showAddForm && (
//           <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
//             <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
//             <p className="flex-1 text-sm font-medium text-[#b91c1c]">{error}</p>
//             <button
//               type="button"
//               onClick={() => setError("")}
//               className="text-red-400 hover:text-red-600"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}

//         {/* ═══════════ STATS ═══════════ */}
//         <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <StatCard
//             icon={<MapPin className="h-5 w-5" />}
//             label="Total Locations"
//             value={stats.total}
//             tone="red"
//           />
//           <StatCard
//             icon={<Hash className="h-5 w-5" />}
//             label="With Pin Code"
//             value={stats.withPin}
//             tone="blue"
//           />
//           <StatCard
//             icon={<FileText className="h-5 w-5" />}
//             label="With Description"
//             value={stats.withDesc}
//             tone="violet"
//           />
//         </div>

//         {/* ═══════════ MAIN CARD ═══════════ */}
//         <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
//           {/* Toolbar */}
//           <div className="flex flex-col gap-3 border-b border-[#e5e7eb] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="relative w-full max-w-sm">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by name, description, pin code..."
//                 className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-9 pr-9 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
//               />
//               {search && (
//                 <button
//                   type="button"
//                   onClick={() => setSearch("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               )}
//             </div>

//             <div className="flex items-center gap-2 text-sm text-[#6b7280]">
//               <span className="font-medium text-[#374151]">
//                 {filteredLocations.length}
//               </span>
//               {search ? "matching" : "total"} location
//               {filteredLocations.length !== 1 ? "s" : ""}
//             </div>
//           </div>

//           {/* Content */}
//           {loading ? (
//             <LoadingState />
//           ) : filteredLocations.length === 0 ? (
//             <EmptyState
//               hasSearch={!!search}
//               onAdd={openAddModal}
//               onClear={() => setSearch("")}
//             />
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[700px] text-left">
//                 <thead>
//                   <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
//                       Location
//                     </th>
//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
//                       Description
//                     </th>
//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
//                       Pin Code
//                     </th>
//                     <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#f3f4f6]">
//                   {filteredLocations.map((location, index) => {
//                     const name =
//                       location?.location_name ||
//                       location?.name ||
//                       `Location ${index + 1}`;
//                     const desc =
//                       location?.location_description ||
//                       location?.description ||
//                       "—";
//                     const pin =
//                       location?.location_pin_code ||
//                       location?.pin_code ||
//                       null;
//                     const id =
//                       location?.location_id || location?.id || `idx-${index}`;

//                     return (
//                       <tr
//                         key={id}
//                         className="group transition hover:bg-[#fafafa]"
//                       >
//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fef2f2] to-[#fee2e2] text-sm font-bold text-[#E42527] shadow-sm ring-1 ring-red-100">
//                               {initials(name)}
//                             </div>
//                             <div className="min-w-0">
//                               <p className="truncate font-semibold text-[#1a1a1a]">
//                                 {name}
//                               </p>
//                               <p className="mt-0.5 text-xs text-[#9ca3af]">
//                                 ID: {String(id).slice(0, 12)}
//                               </p>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="max-w-[280px] px-5 py-4">
//                           <p className="truncate text-sm text-[#6b7280]">
//                             {desc}
//                           </p>
//                         </td>

//                         <td className="px-5 py-4">
//                           {pin ? (
//                             <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f3f4f6] px-2.5 py-1 font-mono text-xs font-medium text-[#374151]">
//                               <Hash className="h-3 w-3" />
//                               {pin}
//                             </span>
//                           ) : (
//                             <span className="text-sm text-[#9ca3af]">—</span>
//                           )}
//                         </td>

//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
//                             <button
//                               type="button"
//                               onClick={() => openEditModal(location)}
//                               title="Edit"
//                               className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#eff6ff] hover:text-[#2563eb]"
//                             >
//                               <Pencil className="h-3.5 w-3.5" />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => setDeleteTarget(location)}
//                               title="Delete"
//                               className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#fef2f2] hover:text-[#dc2626]"
//                             >
//                               <Trash2 className="h-3.5 w-3.5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ═══════════ ADD / EDIT MODAL ═══════════ */}
//       {showAddForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
//             {/* Header */}
//             <div className="flex items-center gap-3 border-b border-[#e5e7eb] bg-gradient-to-r from-[#fef2f2] to-white px-6 py-4">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#b91c1c] text-white shadow-sm">
//                 {editId ? (
//                   <Pencil className="h-5 w-5" />
//                 ) : (
//                   <MapPin className="h-5 w-5" />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-lg font-bold text-[#1a1a1a]">
//                   {editId ? "Edit Location" : "Add New Location"}
//                 </h2>
//                 <p className="text-xs text-[#6b7280]">
//                   {editId
//                     ? "Update location details"
//                     : "Add a new office or facility location"}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#374151]"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="space-y-5">
//                 {/* Name */}
//                 <div>
//                   <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
//                     Location Name <span className="text-[#E42527]">*</span>
//                   </label>
//                   <div className="relative">
//                     <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
//                     <input
//                       value={locationName}
//                       onChange={(e) => setLocationName(e.target.value)}
//                       required
//                       autoFocus
//                       placeholder="e.g. Head Office, Mumbai Branch"
//                       className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
//                     Description
//                   </label>
//                   <div className="relative">
//                     <FileText className="absolute left-3 top-3 h-4 w-4 text-[#9ca3af]" />
//                     <textarea
//                       value={locationDescription}
//                       onChange={(e) => setLocationDescription(e.target.value)}
//                       rows={3}
//                       placeholder="Optional description about this location"
//                       className="w-full resize-none rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
//                     />
//                   </div>
//                 </div>

//                 {/* Pin Code */}
//                 <div>
//                   <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
//                     Pin Code
//                   </label>
//                   <div className="relative">
//                     <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
//                     <input
//                       value={locationPinCode}
//                       onChange={(e) => setLocationPinCode(e.target.value)}
//                       placeholder="e.g. 400001"
//                       className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
//                     />
//                   </div>
//                 </div>

//                 {/* Error */}
//                 {error && (
//                   <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
//                     <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
//                     <p className="text-xs font-medium text-[#b91c1c]">
//                       {error}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="mt-7 flex items-center justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   disabled={submitting}
//                   className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting || !locationName.trim()}
//                   className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {submitting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       {editId ? "Updating..." : "Creating..."}
//                     </>
//                   ) : (
//                     <>
//                       {editId ? (
//                         <Pencil className="h-4 w-4" />
//                       ) : (
//                         <Plus className="h-4 w-4" />
//                       )}
//                       {editId ? "Update Location" : "Create Location"}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ═══════════ DELETE CONFIRM ═══════════ */}
//       {deleteTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="p-6 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
//                 <Trash2 className="h-6 w-6 text-red-600" />
//               </div>
//               <h3 className="mt-4 text-base font-bold text-[#1a1a1a]">
//                 Delete Location?
//               </h3>
//               <p className="mt-2 text-sm text-[#6b7280]">
//                 Are you sure you want to delete{" "}
//                 <span className="font-semibold text-[#374151]">
//                   "{deleteTarget?.location_name || deleteTarget?.name}"
//                 </span>
//                 ? This action cannot be undone.
//               </p>
//             </div>
//             <div className="flex gap-2 border-t border-[#e5e7eb] bg-[#fafbfc] px-6 py-4">
//               <button
//                 type="button"
//                 onClick={() => setDeleteTarget(null)}
//                 className="flex-1 rounded-lg border border-[#d1d5db] bg-white py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setDeleteTarget(null);
//                   // TODO: Call delete API when available
//                 }}
//                 className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
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

// /* ═══════════════════════════════════════════════════════
//    SUB-COMPONENTS
//    ═══════════════════════════════════════════════════════ */

// const STAT_TONES = {
//   red: {
//     bg: "bg-gradient-to-br from-red-50 to-white",
//     border: "border-red-100",
//     icon: "bg-red-100 text-[#E42527]",
//     label: "text-red-600",
//   },
//   blue: {
//     bg: "bg-gradient-to-br from-blue-50 to-white",
//     border: "border-blue-100",
//     icon: "bg-blue-100 text-blue-600",
//     label: "text-blue-600",
//   },
//   violet: {
//     bg: "bg-gradient-to-br from-violet-50 to-white",
//     border: "border-violet-100",
//     icon: "bg-violet-100 text-violet-600",
//     label: "text-violet-600",
//   },
// };

// function StatCard({ icon, label, value, tone = "red" }) {
//   const t = STAT_TONES[tone] || STAT_TONES.red;
//   return (
//     <div
//       className={`rounded-2xl border ${t.border} ${t.bg} p-4 shadow-sm transition hover:shadow-md`}
//     >
//       <div className="flex items-center justify-between">
//         <div
//           className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.icon}`}
//         >
//           {icon}
//         </div>
//         <p className={`text-3xl font-black tabular-nums text-[#1a1a1a]`}>
//           {value}
//         </p>
//       </div>
//       <p
//         className={`mt-3 text-[11px] font-bold uppercase tracking-widest ${t.label}`}
//       >
//         {label}
//       </p>
//     </div>
//   );
// }

// function LoadingState() {
//   return (
//     <div className="divide-y divide-[#f3f4f6]">
//       {Array.from({ length: 4 }).map((_, i) => (
//         <div key={i} className="flex items-center gap-4 px-5 py-4">
//           <div className="h-10 w-10 animate-pulse rounded-lg bg-[#f3f4f6]" />
//           <div className="flex-1 space-y-2">
//             <div className="h-4 w-40 animate-pulse rounded bg-[#f3f4f6]" />
//             <div className="h-3 w-64 animate-pulse rounded bg-[#f9fafb]" />
//           </div>
//           <div className="h-6 w-20 animate-pulse rounded bg-[#f3f4f6]" />
//         </div>
//       ))}
//     </div>
//   );
// }

// function EmptyState({ hasSearch, onAdd, onClear }) {
//   return (
//     <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
//       <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fef2f2] to-[#fee2e2] shadow-sm ring-1 ring-red-100">
//         {hasSearch ? (
//           <Search className="h-7 w-7 text-[#E42527]" />
//         ) : (
//           <MapPin className="h-7 w-7 text-[#E42527]" />
//         )}
//       </div>
//       <h3 className="mt-5 text-base font-bold text-[#1a1a1a]">
//         {hasSearch ? "No locations found" : "No locations yet"}
//       </h3>
//       <p className="mt-1.5 max-w-sm text-sm text-[#6b7280]">
//         {hasSearch
//           ? "Try adjusting your search or clear the filter"
//           : "Get started by adding your first office or facility location"}
//       </p>
//       <div className="mt-6">
//         {hasSearch ? (
//           <button
//             type="button"
//             onClick={onClear}
//             className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
//           >
//             Clear Search
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={onAdd}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-[#c91f21]"
//           >
//             <Plus className="h-4 w-4" />
//             Add First Location
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/app/lib/api";

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") return detail.msg || detail.message || "Request failed";
  return err?.message || "Something went wrong";
}

function toArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  const candidates = [];
  if (payload && typeof payload === "object") {
    candidates.push(
      payload.data, payload.locations, payload.results, payload.items,
      payload.result, payload.records, payload.list
    );
    if (payload.data && typeof payload.data === "object") {
      candidates.push(
        payload.data.locations, payload.data.results, payload.data.items,
        payload.data.result, payload.data.records, payload.data.list
      );
    }
  }
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
}

const getName = (l, i) => l?.location_name || l?.name || `Location ${i + 1}`;
const getDesc = (l) => l?.location_description || l?.description || "";
const getPin = (l) => l?.location_pin_code || l?.pin_code || "";
const getId = (l, i) => l?.location_id || l?.id || `idx-${i}`;

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", pin: "" });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/v1/get/location/master");
      const payload = res?.data ?? res;
      const list = toArray(payload);
      setLocations(list);
      if (list.length > 0 && !selectedId) setSelectedId(getId(list[0], 0));
    } catch (err) {
      setError(getErrorMessage(err));
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((l) => {
      const n = getName(l, 0).toLowerCase();
      const d = getDesc(l).toLowerCase();
      const p = String(getPin(l));
      return n.includes(q) || d.includes(q) || p.includes(q);
    });
  }, [locations, search]);

  const selected = useMemo(
    () => filtered.find((l, i) => getId(l, i) === selectedId) || filtered[0] || null,
    [filtered, selectedId]
  );

  const mapQuery = useMemo(() => {
    if (!selected) return "";
    return [getName(selected, 0), getDesc(selected), getPin(selected)]
      .filter(Boolean)
      .join(", ");
  }, [selected]);

  /* ─── form ─── */
  function openAdd() {
    setEditId(null);
    setForm({ name: "", description: "", pin: "" });
    setError("");
    setShowForm(true);
  }

  function openEdit(loc) {
    setEditId(loc?.location_id || loc?.id);
    setForm({
      name: loc?.location_name || loc?.name || "",
      description: loc?.location_description || loc?.description || "",
      pin: loc?.location_pin_code || loc?.pin_code || "",
    });
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (submitting) return;
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", description: "", pin: "" });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        location_name: form.name.trim(),
        location_description: form.description.trim() || null,
        location_pin_code: form.pin.trim() || null,
      };
      if (editId) await api.put(`/api/v1/update/location/${editId}`, payload);
      else await api.post("/api/v1/create/location/master", payload);
      setShowForm(false);
      setEditId(null);
      setForm({ name: "", description: "", pin: "" });
      await fetchLocations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget?.location_id || deleteTarget?.id;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/delete/location/${id}`);
      setDeleteTarget(null);
      setSelectedId(null);
      await fetchLocations();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-slate-50">

      {/* ═══════ HEADER ═══════ */}
      <div className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-3 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-900">Locations</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Offices and facilities in your organization
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLocations}
              disabled={loading}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={loading ? "animate-spin" : ""}
              >
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Refresh
            </button>
            <button
              onClick={openAdd}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#E42527] px-3 text-xs font-medium text-white transition hover:bg-[#c91f21]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Location
            </button>
          </div>
        </div>
      </div>

      {/* ═══════ SPLIT BODY ═══════ */}
      <div className="flex min-h-0 flex-1">

        {/* ─── LEFT: list ─── */}
        <div className="flex w-full flex-col border-r border-slate-200 bg-white lg:w-[420px] xl:w-[460px]">

          {/* Search */}
          <div className="border-b border-slate-100 px-3.5 py-2.5">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, area or pin..."
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-8 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-red-100"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {filtered.length} {filtered.length === 1 ? "location" : "locations"}
              </p>
            </div>
          </div>

          {/* Scroll list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg border border-slate-100 bg-slate-50" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {search ? "No locations match" : "No locations yet"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {search ? "Try a different keyword." : "Add your first location to get started."}
                </p>
                {!search && (
                  <button
                    onClick={openAdd}
                    className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md bg-[#E42527] px-3 text-xs font-medium text-white transition hover:bg-[#c91f21]"
                  >
                    + Add Location
                  </button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filtered.map((loc, i) => {
                  const id = getId(loc, i);
                  const active = id === selectedId;
                  const name = getName(loc, i);
                  const desc = getDesc(loc);
                  const pin = getPin(loc);

                  return (
                    <li key={id}>
                      <button
                        onClick={() => setSelectedId(id)}
                        className={`group relative w-full px-3.5 py-3 text-left transition ${
                          active ? "bg-red-50/60" : "hover:bg-slate-50"
                        }`}
                      >
                        {/* active left bar */}
                        {active && (
                          <span className="absolute inset-y-0 left-0 w-0.5 bg-[#E42527]" />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition ${
                              active ? "bg-[#E42527] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                            }`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`truncate text-sm font-medium ${
                                  active ? "text-slate-900" : "text-slate-800"
                                }`}
                                title={name}
                              >
                                {name}
                              </h3>
                              {pin && (
                                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                                  {pin}
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {desc || <span className="italic text-slate-400">No area / description</span>}
                            </p>
                          </div>

                          {/* Actions (hover) */}
                          <div
                            className={`flex shrink-0 items-center gap-0.5 transition ${
                              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(loc);
                              }}
                              title="Edit"
                              className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-white hover:text-slate-700"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(loc);
                              }}
                              title="Delete"
                              className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-white hover:text-red-600"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Error */}
          {error && !showForm && (
            <div className="border-t border-slate-100 px-3.5 py-2.5">
              <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5">
                <p className="flex-1 text-[11px] font-medium text-red-700">{error}</p>
                <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT: map ─── */}
        <div className="hidden min-h-0 flex-1 flex-col lg:flex">
          {selected ? (
            <>
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                      {getName(selected, 0)}
                    </h2>
                    {getPin(selected) && (
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                        {getPin(selected)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    {getDesc(selected) || "No additional details"}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6M10 14 21 3" />
                  </svg>
                  Open in Maps
                </a>
              </div>

              <div className="min-h-0 flex-1 bg-slate-100">
                {mapQuery ? (
                  <iframe
                    key={mapQuery}
                    title="Location map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-slate-500">No data to display on map</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-700">
                {locations.length === 0 ? "No locations yet" : "Select a location"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {locations.length === 0
                  ? "Add one to see it on the map."
                  : "Pick a location to preview it here."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ ADD / EDIT MODAL ═══════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div className="w-full max-w-[420px] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">
                {editId ? "Edit location" : "Add location"}
              </h2>
              <button
                onClick={closeForm}
                disabled={submitting}
                className="-mr-1 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 px-4 py-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Location name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  autoFocus
                  placeholder="e.g. Head Office, Mumbai Branch"
                  className="h-9 w-full rounded-md border border-slate-200 px-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Area / Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  placeholder="e.g. Ground floor, Andheri East"
                  className="w-full resize-none rounded-md border border-slate-200 px-2.5 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Pin code
                </label>
                <input
                  value={form.pin}
                  onChange={(e) => setForm((p) => ({ ...p, pin: e.target.value }))}
                  placeholder="e.g. 400001"
                  className="h-9 w-full rounded-md border border-slate-200 px-2.5 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:ring-2 focus:ring-red-100"
                />
              </div>

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.name.trim()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#E42527] px-4 text-sm font-medium text-white transition hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {submitting && (
                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                  {submitting ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════ DELETE CONFIRM ═══════ */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) setDeleteTarget(null);
          }}
        >
          <div className="w-full max-w-[380px] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="px-4 py-4">
              <h3 className="text-sm font-semibold text-slate-900">Delete location?</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                <span className="font-medium text-slate-700">
                  "{getName(deleteTarget, 0)}"
                </span>{" "}
                will be permanently removed. This action can't be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-600 px-3 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && (
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}