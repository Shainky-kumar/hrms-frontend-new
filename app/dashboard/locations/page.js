
// // "use client";

// // import { useEffect, useState } from "react";
// // import { api } from "@/app/lib/api";

// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // };

// // const toArray = (p) => {
// //   if (!p) return [];
// //   if (Array.isArray(p)) return p;
// //   if (Array.isArray(p?.location)) return p.location;
// //   if (Array.isArray(p?.locations)) return p.locations;
// //   if (Array.isArray(p?.data)) return p.data;
// //   return [];
// // };

// // export default function AttendanceLocationsPage() {
// //   const [list, setList] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [gettingLocation, setGettingLocation] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [showForm, setShowForm] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const [form, setForm] = useState({
// //     location_name: "",
// //     address: "",
// //     latitude: "",
// //     longitude: "",
// //     radius_meters: "200",
// //     is_active: true,
// //   });

// //   const fetchList = async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await api.get("/api/v1/get/attendence/locations", {
// //         params: { page: 1, page_size: 50 },
// //       });
// //       setList(toArray(res?.data));
// //     } catch (err) {
// //       setError(formatApiError(err));
// //       setList([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const load = async () => {
// //       await fetchList();
// //     };
// //     load();
// //   }, []);

// //   // ✅ Current location lene ka function
// //   const getCurrentLocation = () => {
// //     if (!navigator.geolocation) {
// //       setError("Geolocation is not supported on this browser");
// //       return;
// //     }

// //     setGettingLocation(true);
// //     setError("");

// //     navigator.geolocation.getCurrentPosition(
// //       (pos) => {
// //         setForm((prev) => ({
// //           ...prev,
// //           latitude: pos.coords.latitude.toFixed(6),
// //           longitude: pos.coords.longitude.toFixed(6),
// //         }));
// //         setGettingLocation(false);
// //         setSuccess("Current location fetched successfully");
// //         setTimeout(() => setSuccess(""), 2500);
// //       },
// //       (err) => {
// //         setGettingLocation(false);
// //         let msg = "Unable to get location";
// //         if (err.code === 1) msg = "Location permission denied. Please allow location.";
// //         if (err.code === 2) msg = "Location unavailable. Try again.";
// //         if (err.code === 3) msg = "Location request timed out. Try again.";
// //         setError(msg);
// //       },
// //       {
// //         enableHighAccuracy: true,
// //         timeout: 15000,
// //         maximumAge: 0,
// //       }
// //     );
// //   };

// //   const openAdd = () => {
// //     setEditId(null);
// //     setForm({
// //       location_name: "",
// //       address: "",
// //       latitude: "",
// //       longitude: "",
// //       radius_meters: "200",
// //       is_active: true,
// //     });
// //     setShowForm(true);
// //     setError("");
// //     setSuccess("");
// //   };

// //   const openEdit = (row) => {
// //     setEditId(row.location_id);
// //     setForm({
// //       location_name: row.location_name || "",
// //       address: row.address || "",
// //       latitude: String(row.latitude ?? ""),
// //       longitude: String(row.longitude ?? ""),
// //       radius_meters: String(row.radius_meters ?? 200),
// //       is_active: row.is_active !== false,
// //     });
// //     setShowForm(true);
// //     setError("");
// //     setSuccess("");
// //   };

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);
// //     setError("");
// //     setSuccess("");

// //     try {
// //       const payload = {
// //         location_name: form.location_name,
// //         address: form.address || null,
// //         latitude: Number(form.latitude),
// //         longitude: Number(form.longitude),
// //         radius_meters: Number(form.radius_meters),
// //         is_active: form.is_active,
// //       };

// //       if (editId) {
// //         await api.put(`/api/v1/attendence/location/${editId}`, payload);
// //         setSuccess("Location updated successfully");
// //       } else {
// //         await api.post("/api/v1/add/attendence/location", payload);
// //         setSuccess("Location added successfully");
// //       }

// //       setShowForm(false);
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// //       <div className="mb-6 flex items-center justify-between">
// //         <div>
// //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Geo Locations</h1>
// //           <p className="mt-1 text-sm text-[#6b7280]">
// //             Office / client fence points
// //           </p>
// //         </div>
// //         <button
// //           onClick={openAdd}
// //           className="rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// //         >
// //           + Add Location
// //         </button>
// //       </div>

// //       {error && (
// //         <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
// //           {error}
// //         </div>
// //       )}
// //       {success && (
// //         <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
// //           {success}
// //         </div>
// //       )}

// //       <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// //           ) : list.length === 0 ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">
// //               No locations found
// //             </div>
// //           ) : (
// //             <table className="w-full min-w-[800px] text-left text-sm">
// //               <thead>
// //                 <tr className="border-b bg-[#f9fafb]">
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Latitude</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Longitude</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Radius (m)</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Active</th>
// //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y">
// //                 {list.map((row) => (
// //                   <tr key={row.location_id} className="hover:bg-[#fafafa]">
// //                     <td className="px-5 py-3.5 font-medium">{row.location_name}</td>
// //                     <td className="px-5 py-3.5">{row.latitude}</td>
// //                     <td className="px-5 py-3.5">{row.longitude}</td>
// //                     <td className="px-5 py-3.5">{row.radius_meters}</td>
// //                     <td className="px-5 py-3.5">
// //                       <span
// //                         className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
// //                           row.is_active
// //                             ? "bg-green-50 text-green-700"
// //                             : "bg-gray-100 text-gray-600"
// //                         }`}
// //                       >
// //                         {row.is_active ? "Active" : "Inactive"}
// //                       </span>
// //                     </td>
// //                     <td className="px-5 py-3.5 text-right">
// //                       <button
// //                         onClick={() => openEdit(row)}
// //                         className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
// //                       >
// //                         Edit
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       </div>

// //       {/* Form Modal */}
// //       {showForm && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b px-5 py-4">
// //               <h2 className="font-semibold">
// //                 {editId ? "Edit Location" : "Add Location"}
// //               </h2>
// //               <button onClick={() => setShowForm(false)}>✕</button>
// //             </div>

// //             <form onSubmit={submit} className="space-y-3 p-5">
// //               <input
// //                 required
// //                 placeholder="Location name *"
// //                 value={form.location_name}
// //                 onChange={(e) =>
// //                   setForm((p) => ({ ...p, location_name: e.target.value }))
// //                 }
// //                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
// //               />

// //               <input
// //                 placeholder="Address"
// //                 value={form.address}
// //                 onChange={(e) =>
// //                   setForm((p) => ({ ...p, address: e.target.value }))
// //                 }
// //                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
// //               />

// //               {/* Latitude + Longitude + Get Location button */}
// //               <div className="grid grid-cols-2 gap-3">
// //                 <input
// //                   required
// //                   type="number"
// //                   step="any"
// //                   placeholder="Latitude *"
// //                   value={form.latitude}
// //                   onChange={(e) =>
// //                     setForm((p) => ({ ...p, latitude: e.target.value }))
// //                   }
// //                   className="w-full rounded-lg border px-3 py-2.5 text-sm"
// //                 />
// //                 <input
// //                   required
// //                   type="number"
// //                   step="any"
// //                   placeholder="Longitude *"
// //                   value={form.longitude}
// //                   onChange={(e) =>
// //                     setForm((p) => ({ ...p, longitude: e.target.value }))
// //                   }
// //                   className="w-full rounded-lg border px-3 py-2.5 text-sm"
// //                 />
// //               </div>

// //               {/* ✅ Current Location Button */}
// //               <button
// //                 type="button"
// //                 onClick={getCurrentLocation}
// //                 disabled={gettingLocation}
// //                 className="w-full rounded-lg border border-[#E42527] py-2.5 text-sm font-medium text-[#E42527] hover:bg-red-50 disabled:opacity-60"
// //               >
// //                 {gettingLocation
// //                   ? "Getting location..."
// //                   : "📍 Use Current Location"}
// //               </button>

// //               <input
// //                 required
// //                 type="number"
// //                 placeholder="Radius (meters)"
// //                 value={form.radius_meters}
// //                 onChange={(e) =>
// //                   setForm((p) => ({ ...p, radius_meters: e.target.value }))
// //                 }
// //                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
// //               />

// //               <label className="flex items-center gap-2 text-sm">
// //                 <input
// //                   type="checkbox"
// //                   checked={form.is_active}
// //                   onChange={(e) =>
// //                     setForm((p) => ({ ...p, is_active: e.target.checked }))
// //                   }
// //                 />
// //                 Active
// //               </label>

// //               <div className="flex justify-end gap-2 pt-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForm(false)}
// //                   className="rounded-lg border px-4 py-2 text-sm"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving..." : "Save"}
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

// import { useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

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
//     candidates.push(payload.data, payload.locations, payload.results, payload.items, payload.result, payload.records, payload.list);
//     if (payload.data && typeof payload.data === "object") {
//       candidates.push(payload.data.locations, payload.data.results, payload.data.items, payload.data.result, payload.data.records, payload.data.list);
//     }
//     if (payload.details && typeof payload.details === "object") {
//       candidates.push(payload.details, payload.details.data, payload.details.locations, payload.details.results);
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

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   async function fetchLocations() {
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.get("/api/v1/get/location/master");
//       const payload = res?.data ?? res;
//       console.log("LOCATIONS RESPONSE:", payload);
//       setLocations(toArray(payload));
//     } catch (err) {
//       console.error("Locations fetch error:", err?.response || err);
//       setError(getErrorMessage(err));
//       setLocations([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function addLocation(e) {
//     e.preventDefault();
//     if (!locationName.trim()) return;

//     setError("");
//     setSubmitting(true);
//     try {
//       await api.post("/api/v1/create/location/master", {
//         location_name: locationName.trim(),
//         location_description: locationDescription.trim() || null,
//         location_pin_code: locationPinCode.trim() || null,
//       });

//       setLocationName("");
//       setLocationDescription("");
//       setLocationPinCode("");
//       setShowAddForm(false);
//       await fetchLocations();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   function closeModal() {
//     setShowAddForm(false);
//     setError("");
//     setLocationName("");
//     setLocationDescription("");
//     setLocationPinCode("");
//   }

//   const list = Array.isArray(locations) ? locations : [];
//   const filteredLocations = list.filter((loc) => {
//     const name = (loc?.location_name || loc?.name || loc?.title || "").toLowerCase();
//     return name.includes((search || "").toLowerCase());
//   });

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Locations</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Manage location master data for your organization
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => {
//             setError("");
//             setShowAddForm(true);
//           }}
//           className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
//         >
//           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//           </svg>
//           Add Location
//         </button>
//       </div>

//       {error && !showAddForm && (
//         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
//           {error}
//         </div>
//       )}

//       {/* Card */}
//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative w-full max-w-xs">
//             <svg
//               className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search locations..."
//               className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>
//           <div className="text-sm text-[#6b7280]">
//             {filteredLocations.length} location{filteredLocations.length !== 1 ? "s" : ""}
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex items-center justify-center py-16">
//               <p className="text-sm text-[#6b7280]">Loading locations...</p>
//             </div>
//           ) : filteredLocations.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <p className="text-sm font-medium text-[#374151]">No locations found</p>
//               <p className="mt-1 text-sm text-[#6b7280]">
//                 {search ? "Try a different search term" : "Add your first location"}
//               </p>
//               {!search && (
//                 <button
//                   type="button"
//                   onClick={() => setShowAddForm(true)}
//                   className="mt-4 text-sm font-medium text-[#E42527] hover:underline"
//                 >
//                   + Add Location
//                 </button>
//               )}
//             </div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Location Name</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Description</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Pin Code</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {filteredLocations.map((location, index) => (
//                   <tr
//                     key={location?.location_id || location?.id || index}
//                     className="hover:bg-[#fafafa]"
//                   >
//                     <td className="px-5 py-3.5">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fef2f2] text-xs font-semibold text-[#E42527]">
//                           {(location?.location_name || location?.name || "L")[0]?.toUpperCase()}
//                         </div>
//                         <span className="font-medium text-[#1a1a1a]">
//                           {location?.location_name || location?.name || `Location ${index + 1}`}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="max-w-[220px] truncate px-5 py-3.5 text-[#6b7280]">
//                       {location?.location_description || location?.description || "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-[#6b7280]">
//                       {location?.location_pin_code || location?.pin_code || "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
//               <h2 className="text-lg font-semibold text-[#1a1a1a]">Add Location</h2>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={addLocation} className="p-5">
//               <div className="space-y-4">
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                     Location Name <span className="text-[#E42527]">*</span>
//                   </label>
//                   <input
//                     value={locationName}
//                     onChange={(e) => setLocationName(e.target.value)}
//                     required
//                     autoFocus
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//                     placeholder="e.g. Head Office"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                     Description
//                   </label>
//                   <textarea
//                     value={locationDescription}
//                     onChange={(e) => setLocationDescription(e.target.value)}
//                     rows={2}
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//                     placeholder="Optional description"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                     Pin Code
//                   </label>
//                   <input
//                     value={locationPinCode}
//                     onChange={(e) => setLocationPinCode(e.target.value)}
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//                     placeholder="e.g. 110001"
//                   />
//                 </div>

//                 {error && (
//                   <div className="rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
//                     {error}
//                   </div>
//                 )}
//               </div>

//               <div className="mt-6 flex items-center justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting || !locationName.trim()}
//                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                 >
//                   {submitting ? "Submitting..." : "Submit"}
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

import { useEffect, useState, useMemo } from "react";
import { api } from "@/app/lib/api";
import {
  MapPin,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Building2,
  Hash,
  FileText,
  Loader2,
  MapPinned,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Info,
  ChevronDown,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((i) => i?.msg || "Error").join(", ");
  }
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") {
    return detail.msg || detail.message || "Request failed";
  }
  return err?.message || "Something went wrong";
}

function toArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const candidates = [];
  if (payload && typeof payload === "object") {
    candidates.push(
      payload.data,
      payload.locations,
      payload.results,
      payload.items,
      payload.result,
      payload.records,
      payload.list
    );
    if (payload.data && typeof payload.data === "object") {
      candidates.push(
        payload.data.locations,
        payload.data.results,
        payload.data.items,
        payload.data.result,
        payload.data.records,
        payload.data.list
      );
    }
    if (payload.details && typeof payload.details === "object") {
      candidates.push(
        payload.details,
        payload.details.data,
        payload.details.locations,
        payload.details.results
      );
    }
  }

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (payload && typeof payload === "object") {
    const values = Object.values(payload);
    for (const value of values) {
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object") {
        const nested = toArray(value);
        if (nested.length) return nested;
      }
    }
  }

  return [];
}

function initials(name) {
  return String(name || "L")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [locationPinCode, setLocationPinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/v1/get/location/master");
      const payload = res?.data ?? res;
      setLocations(toArray(payload));
    } catch (err) {
      setError(getErrorMessage(err));
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!locationName.trim()) return;

    setError("");
    setSubmitting(true);
    try {
      const payload = {
        location_name: locationName.trim(),
        location_description: locationDescription.trim() || null,
        location_pin_code: locationPinCode.trim() || null,
      };

      if (editId) {
        await api.put(`/api/v1/update/location/${editId}`, payload);
      } else {
        await api.post("/api/v1/create/location/master", payload);
      }

      resetForm();
      setShowAddForm(false);
      await fetchLocations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setLocationName("");
    setLocationDescription("");
    setLocationPinCode("");
    setEditId(null);
    setError("");
  }

  function openAddModal() {
    resetForm();
    setShowAddForm(true);
  }

  function openEditModal(loc) {
    setEditId(loc?.location_id || loc?.id);
    setLocationName(loc?.location_name || loc?.name || "");
    setLocationDescription(loc?.location_description || loc?.description || "");
    setLocationPinCode(loc?.location_pin_code || loc?.pin_code || "");
    setShowAddForm(true);
    setError("");
  }

  function closeModal() {
    setShowAddForm(false);
    resetForm();
  }

  const list = Array.isArray(locations) ? locations : [];

  const filteredLocations = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    if (!q) return list;
    return list.filter((loc) => {
      const name = (loc?.location_name || loc?.name || loc?.title || "").toLowerCase();
      const desc = (loc?.location_description || loc?.description || "").toLowerCase();
      const pin = String(loc?.location_pin_code || loc?.pin_code || "");
      return name.includes(q) || desc.includes(q) || pin.includes(q);
    });
  }, [list, search]);

  const stats = useMemo(() => {
    const total = list.length;
    const withPin = list.filter((l) => l?.location_pin_code || l?.pin_code).length;
    const withDesc = list.filter((l) => l?.location_description || l?.description).length;
    return { total, withPin, withDesc };
  }, [list]);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#b91c1c] text-white shadow-lg shadow-red-200">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#1a1a1a]">Locations</h1>
              <p className="text-sm text-[#6b7280]">
                Manage your organization's office and facility locations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-[#c91f21] hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        </div>

        {/* ═══════════ ERROR ═══════════ */}
        {error && !showAddForm && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <p className="flex-1 text-sm font-medium text-[#b91c1c]">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ═══════════ STATS ═══════════ */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<MapPin className="h-5 w-5" />}
            label="Total Locations"
            value={stats.total}
            tone="red"
          />
          <StatCard
            icon={<Hash className="h-5 w-5" />}
            label="With Pin Code"
            value={stats.withPin}
            tone="blue"
          />
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label="With Description"
            value={stats.withDesc}
            tone="violet"
          />
        </div>

        {/* ═══════════ MAIN CARD ═══════════ */}
        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-[#e5e7eb] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, description, pin code..."
                className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-9 pr-9 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
              <span className="font-medium text-[#374151]">
                {filteredLocations.length}
              </span>
              {search ? "matching" : "total"} location
              {filteredLocations.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingState />
          ) : filteredLocations.length === 0 ? (
            <EmptyState
              hasSearch={!!search}
              onAdd={openAddModal}
              onClear={() => setSearch("")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                      Location
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                      Description
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                      Pin Code
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {filteredLocations.map((location, index) => {
                    const name =
                      location?.location_name ||
                      location?.name ||
                      `Location ${index + 1}`;
                    const desc =
                      location?.location_description ||
                      location?.description ||
                      "—";
                    const pin =
                      location?.location_pin_code ||
                      location?.pin_code ||
                      null;
                    const id =
                      location?.location_id || location?.id || `idx-${index}`;

                    return (
                      <tr
                        key={id}
                        className="group transition hover:bg-[#fafafa]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fef2f2] to-[#fee2e2] text-sm font-bold text-[#E42527] shadow-sm ring-1 ring-red-100">
                              {initials(name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#1a1a1a]">
                                {name}
                              </p>
                              <p className="mt-0.5 text-xs text-[#9ca3af]">
                                ID: {String(id).slice(0, 12)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[280px] px-5 py-4">
                          <p className="truncate text-sm text-[#6b7280]">
                            {desc}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {pin ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f3f4f6] px-2.5 py-1 font-mono text-xs font-medium text-[#374151]">
                              <Hash className="h-3 w-3" />
                              {pin}
                            </span>
                          ) : (
                            <span className="text-sm text-[#9ca3af]">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => openEditModal(location)}
                              title="Edit"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#eff6ff] hover:text-[#2563eb]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(location)}
                              title="Delete"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#fef2f2] hover:text-[#dc2626]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ ADD / EDIT MODAL ═══════════ */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e5e7eb] bg-gradient-to-r from-[#fef2f2] to-white px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#b91c1c] text-white shadow-sm">
                {editId ? (
                  <Pencil className="h-5 w-5" />
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1a1a1a]">
                  {editId ? "Edit Location" : "Add New Location"}
                </h2>
                <p className="text-xs text-[#6b7280]">
                  {editId
                    ? "Update location details"
                    : "Add a new office or facility location"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#374151]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
                    Location Name <span className="text-[#E42527]">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      required
                      autoFocus
                      placeholder="e.g. Head Office, Mumbai Branch"
                      className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-[#9ca3af]" />
                    <textarea
                      value={locationDescription}
                      onChange={(e) => setLocationDescription(e.target.value)}
                      rows={3}
                      placeholder="Optional description about this location"
                      className="w-full resize-none rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
                    />
                  </div>
                </div>

                {/* Pin Code */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
                    Pin Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      value={locationPinCode}
                      onChange={(e) => setLocationPinCode(e.target.value)}
                      placeholder="e.g. 400001"
                      className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] transition placeholder:text-[#9ca3af] focus:border-[#E42527] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E42527]/20"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    <p className="text-xs font-medium text-[#b91c1c]">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-7 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !locationName.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {editId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editId ? (
                        <Pencil className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {editId ? "Update Location" : "Create Location"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE CONFIRM ═══════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#1a1a1a]">
                Delete Location?
              </h3>
              <p className="mt-2 text-sm text-[#6b7280]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#374151]">
                  "{deleteTarget?.location_name || deleteTarget?.name}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 border-t border-[#e5e7eb] bg-[#fafbfc] px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-[#d1d5db] bg-white py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  // TODO: Call delete API when available
                }}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
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

const STAT_TONES = {
  red: {
    bg: "bg-gradient-to-br from-red-50 to-white",
    border: "border-red-100",
    icon: "bg-red-100 text-[#E42527]",
    label: "text-red-600",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-white",
    border: "border-blue-100",
    icon: "bg-blue-100 text-blue-600",
    label: "text-blue-600",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-white",
    border: "border-violet-100",
    icon: "bg-violet-100 text-violet-600",
    label: "text-violet-600",
  },
};

function StatCard({ icon, label, value, tone = "red" }) {
  const t = STAT_TONES[tone] || STAT_TONES.red;
  return (
    <div
      className={`rounded-2xl border ${t.border} ${t.bg} p-4 shadow-sm transition hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.icon}`}
        >
          {icon}
        </div>
        <p className={`text-3xl font-black tabular-nums text-[#1a1a1a]`}>
          {value}
        </p>
      </div>
      <p
        className={`mt-3 text-[11px] font-bold uppercase tracking-widest ${t.label}`}
      >
        {label}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="divide-y divide-[#f3f4f6]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-[#f3f4f6]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-[#f3f4f6]" />
            <div className="h-3 w-64 animate-pulse rounded bg-[#f9fafb]" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded bg-[#f3f4f6]" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasSearch, onAdd, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fef2f2] to-[#fee2e2] shadow-sm ring-1 ring-red-100">
        {hasSearch ? (
          <Search className="h-7 w-7 text-[#E42527]" />
        ) : (
          <MapPin className="h-7 w-7 text-[#E42527]" />
        )}
      </div>
      <h3 className="mt-5 text-base font-bold text-[#1a1a1a]">
        {hasSearch ? "No locations found" : "No locations yet"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-[#6b7280]">
        {hasSearch
          ? "Try adjusting your search or clear the filter"
          : "Get started by adding your first office or facility location"}
      </p>
      <div className="mt-6">
        {hasSearch ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Clear Search
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-[#c91f21]"
          >
            <Plus className="h-4 w-4" />
            Add First Location
          </button>
        )}
      </div>
    </div>
  );
}