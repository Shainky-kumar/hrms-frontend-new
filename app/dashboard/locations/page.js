
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
//   if (Array.isArray(p?.location)) return p.location;
//   if (Array.isArray(p?.locations)) return p.locations;
//   if (Array.isArray(p?.data)) return p.data;
//   return [];
// };

// export default function AttendanceLocationsPage() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [gettingLocation, setGettingLocation] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [form, setForm] = useState({
//     location_name: "",
//     address: "",
//     latitude: "",
//     longitude: "",
//     radius_meters: "200",
//     is_active: true,
//   });

//   const fetchList = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/get/attendence/locations", {
//         params: { page: 1, page_size: 50 },
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
//     const load = async () => {
//       await fetchList();
//     };
//     load();
//   }, []);

//   // ✅ Current location lene ka function
//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported on this browser");
//       return;
//     }

//     setGettingLocation(true);
//     setError("");

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setForm((prev) => ({
//           ...prev,
//           latitude: pos.coords.latitude.toFixed(6),
//           longitude: pos.coords.longitude.toFixed(6),
//         }));
//         setGettingLocation(false);
//         setSuccess("Current location fetched successfully");
//         setTimeout(() => setSuccess(""), 2500);
//       },
//       (err) => {
//         setGettingLocation(false);
//         let msg = "Unable to get location";
//         if (err.code === 1) msg = "Location permission denied. Please allow location.";
//         if (err.code === 2) msg = "Location unavailable. Try again.";
//         if (err.code === 3) msg = "Location request timed out. Try again.";
//         setError(msg);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   };

//   const openAdd = () => {
//     setEditId(null);
//     setForm({
//       location_name: "",
//       address: "",
//       latitude: "",
//       longitude: "",
//       radius_meters: "200",
//       is_active: true,
//     });
//     setShowForm(true);
//     setError("");
//     setSuccess("");
//   };

//   const openEdit = (row) => {
//     setEditId(row.location_id);
//     setForm({
//       location_name: row.location_name || "",
//       address: row.address || "",
//       latitude: String(row.latitude ?? ""),
//       longitude: String(row.longitude ?? ""),
//       radius_meters: String(row.radius_meters ?? 200),
//       is_active: row.is_active !== false,
//     });
//     setShowForm(true);
//     setError("");
//     setSuccess("");
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       const payload = {
//         location_name: form.location_name,
//         address: form.address || null,
//         latitude: Number(form.latitude),
//         longitude: Number(form.longitude),
//         radius_meters: Number(form.radius_meters),
//         is_active: form.is_active,
//       };

//       if (editId) {
//         await api.put(`/api/v1/attendence/location/${editId}`, payload);
//         setSuccess("Location updated successfully");
//       } else {
//         await api.post("/api/v1/add/attendence/location", payload);
//         setSuccess("Location added successfully");
//       }

//       setShowForm(false);
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Geo Locations</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Office / client fence points
//           </p>
//         </div>
//         <button
//           onClick={openAdd}
//           className="rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
//         >
//           + Add Location
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
//           {success}
//         </div>
//       )}

//       <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//           ) : list.length === 0 ? (
//             <div className="py-16 text-center text-sm text-[#6b7280]">
//               No locations found
//             </div>
//           ) : (
//             <table className="w-full min-w-[800px] text-left text-sm">
//               <thead>
//                 <tr className="border-b bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Latitude</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Longitude</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Radius (m)</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Active</th>
//                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {list.map((row) => (
//                   <tr key={row.location_id} className="hover:bg-[#fafafa]">
//                     <td className="px-5 py-3.5 font-medium">{row.location_name}</td>
//                     <td className="px-5 py-3.5">{row.latitude}</td>
//                     <td className="px-5 py-3.5">{row.longitude}</td>
//                     <td className="px-5 py-3.5">{row.radius_meters}</td>
//                     <td className="px-5 py-3.5">
//                       <span
//                         className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                           row.is_active
//                             ? "bg-green-50 text-green-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {row.is_active ? "Active" : "Inactive"}
//                       </span>
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
//       </div>

//       {/* Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b px-5 py-4">
//               <h2 className="font-semibold">
//                 {editId ? "Edit Location" : "Add Location"}
//               </h2>
//               <button onClick={() => setShowForm(false)}>✕</button>
//             </div>

//             <form onSubmit={submit} className="space-y-3 p-5">
//               <input
//                 required
//                 placeholder="Location name *"
//                 value={form.location_name}
//                 onChange={(e) =>
//                   setForm((p) => ({ ...p, location_name: e.target.value }))
//                 }
//                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
//               />

//               <input
//                 placeholder="Address"
//                 value={form.address}
//                 onChange={(e) =>
//                   setForm((p) => ({ ...p, address: e.target.value }))
//                 }
//                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
//               />

//               {/* Latitude + Longitude + Get Location button */}
//               <div className="grid grid-cols-2 gap-3">
//                 <input
//                   required
//                   type="number"
//                   step="any"
//                   placeholder="Latitude *"
//                   value={form.latitude}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, latitude: e.target.value }))
//                   }
//                   className="w-full rounded-lg border px-3 py-2.5 text-sm"
//                 />
//                 <input
//                   required
//                   type="number"
//                   step="any"
//                   placeholder="Longitude *"
//                   value={form.longitude}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, longitude: e.target.value }))
//                   }
//                   className="w-full rounded-lg border px-3 py-2.5 text-sm"
//                 />
//               </div>

//               {/* ✅ Current Location Button */}
//               <button
//                 type="button"
//                 onClick={getCurrentLocation}
//                 disabled={gettingLocation}
//                 className="w-full rounded-lg border border-[#E42527] py-2.5 text-sm font-medium text-[#E42527] hover:bg-red-50 disabled:opacity-60"
//               >
//                 {gettingLocation
//                   ? "Getting location..."
//                   : "📍 Use Current Location"}
//               </button>

//               <input
//                 required
//                 type="number"
//                 placeholder="Radius (meters)"
//                 value={form.radius_meters}
//                 onChange={(e) =>
//                   setForm((p) => ({ ...p, radius_meters: e.target.value }))
//                 }
//                 className="w-full rounded-lg border px-3 py-2.5 text-sm"
//               />

//               <label className="flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={form.is_active}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, is_active: e.target.checked }))
//                   }
//                 />
//                 Active
//               </label>

//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="rounded-lg border px-4 py-2 text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
//                 >
//                   {saving ? "Saving..." : "Save"}
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
    candidates.push(payload.data, payload.locations, payload.results, payload.items, payload.result, payload.records, payload.list);
    if (payload.data && typeof payload.data === "object") {
      candidates.push(payload.data.locations, payload.data.results, payload.data.items, payload.data.result, payload.data.records, payload.data.list);
    }
    if (payload.details && typeof payload.details === "object") {
      candidates.push(payload.details, payload.details.data, payload.details.locations, payload.details.results);
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

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/v1/get/location/master");
      const payload = res?.data ?? res;
      console.log("LOCATIONS RESPONSE:", payload);
      setLocations(toArray(payload));
    } catch (err) {
      console.error("Locations fetch error:", err?.response || err);
      setError(getErrorMessage(err));
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }

  async function addLocation(e) {
    e.preventDefault();
    if (!locationName.trim()) return;

    setError("");
    setSubmitting(true);
    try {
      await api.post("/api/v1/create/location/master", {
        location_name: locationName.trim(),
        location_description: locationDescription.trim() || null,
        location_pin_code: locationPinCode.trim() || null,
      });

      setLocationName("");
      setLocationDescription("");
      setLocationPinCode("");
      setShowAddForm(false);
      await fetchLocations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    setShowAddForm(false);
    setError("");
    setLocationName("");
    setLocationDescription("");
    setLocationPinCode("");
  }

  const list = Array.isArray(locations) ? locations : [];
  const filteredLocations = list.filter((loc) => {
    const name = (loc?.location_name || loc?.name || loc?.title || "").toLowerCase();
    return name.includes((search || "").toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Locations</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage location master data for your organization
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowAddForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Location
        </button>
      </div>

      {error && !showAddForm && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}

      {/* Card */}
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations..."
              className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
            />
          </div>
          <div className="text-sm text-[#6b7280]">
            {filteredLocations.length} location{filteredLocations.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-[#6b7280]">Loading locations...</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-[#374151]">No locations found</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {search ? "Try a different search term" : "Add your first location"}
              </p>
              {!search && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 text-sm font-medium text-[#E42527] hover:underline"
                >
                  + Add Location
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Location Name</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Description</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Pin Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredLocations.map((location, index) => (
                  <tr
                    key={location?.location_id || location?.id || index}
                    className="hover:bg-[#fafafa]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fef2f2] text-xs font-semibold text-[#E42527]">
                          {(location?.location_name || location?.name || "L")[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1a1a1a]">
                          {location?.location_name || location?.name || `Location ${index + 1}`}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-[220px] truncate px-5 py-3.5 text-[#6b7280]">
                      {location?.location_description || location?.description || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[#6b7280]">
                      {location?.location_pin_code || location?.pin_code || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Add Location</h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addLocation} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Location Name <span className="text-[#E42527]">*</span>
                  </label>
                  <input
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="e.g. Head Office"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Description
                  </label>
                  <textarea
                    value={locationDescription}
                    onChange={(e) => setLocationDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Pin Code
                  </label>
                  <input
                    value={locationPinCode}
                    onChange={(e) => setLocationPinCode(e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="e.g. 110001"
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !locationName.trim()}
                  className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}