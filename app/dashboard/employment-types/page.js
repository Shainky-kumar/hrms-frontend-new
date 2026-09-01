// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";

// const initialForm = {
//   employment_type_name: "",
//   employment_type_code: "",
// };

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;

//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) => {
//         const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
//         return field ? `${field}: ${e.msg}` : e.msg;
//       })
//       .join(" • ");
//   }

//   if (typeof detail === "string") return detail;
//   if (detail && typeof detail === "object") return JSON.stringify(detail);

//   return err?.message || "Something went wrong";
// };

// export default function EmploymentTypePage() {
//   const [list, setList] = useState([]);
//   const [formData, setFormData] = useState(initialForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.get("/api/v1/get/employment/type");
//       setList(res.data?.data ?? res.data ?? []);
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       const payload = {
//         employment_type_name: formData.employment_type_name,
//         employment_type_code: formData.employment_type_code || null,
//       };

//       await api.post("/api/v1/add/employment/type", payload);
//       setFormData(initialForm);
//       setShowAddForm(false);
//       await fetchData();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredList = list.filter((item) => {
//     const name = (item.employment_type_name || item.name || "").toLowerCase();
//     const code = (item.employment_type_code || item.code || "").toLowerCase();
//     const q = search.toLowerCase();
//     return name.includes(q) || code.includes(q);
//   });

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       {/* Page Header */}
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Employment Types</h1>
//           <p className="mt-1 text-sm text-[#6b7280]">
//             Manage employment type master data
//           </p>
//         </div>
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] focus:outline-none focus:ring-2 focus:ring-[#E42527]/40"
//         >
//           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//           </svg>
//           Add Employment Type
//         </button>
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//         {/* Toolbar */}
//         <div className="flex flex-col gap-3 border-b border-[#e5e7eb] bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
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
//               placeholder="Search by name or code..."
//               className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//             />
//           </div>
//           <div className="text-sm text-[#6b7280]">
//             {filteredList.length} type{filteredList.length !== 1 ? "s" : ""}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex items-center justify-center py-16">
//               <div className="flex items-center gap-3 text-sm text-[#6b7280]">
//                 <svg className="h-5 w-5 animate-spin text-[#E42527]" viewBox="0 0 24 24" fill="none">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                 </svg>
//                 Loading employment types...
//               </div>
//             </div>
//           ) : filteredList.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f6]">
//                 <svg className="h-6 w-6 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <p className="text-sm font-medium text-[#374151]">No employment types found</p>
//               <p className="mt-1 text-sm text-[#6b7280]">
//                 {search ? "Try a different search term" : "Get started by adding your first employment type"}
//               </p>
//               {!search && (
//                 <button
//                   onClick={() => setShowAddForm(true)}
//                   className="mt-4 text-sm font-medium text-[#E42527] hover:underline"
//                 >
//                   + Add Employment Type
//                 </button>
//               )}
//             </div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">#</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280]">Code</th>
//                   <th className="px-5 py-3 font-medium text-[#6b7280] text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f3f4f6]">
//                 {filteredList.map((item, index) => (
//                   <tr key={item.id || item._id || index} className="group transition hover:bg-[#fafafa]">
//                     <td className="px-5 py-3.5 text-[#6b7280]">{index + 1}</td>
//                     <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">
//                       {item.employment_type_name || item.name || "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-[#6b7280]">
//                       {item.employment_type_code || item.code || "—"}
//                     </td>
//                     <td className="px-5 py-3.5 text-right">
//                       <button className="rounded p-1.5 text-[#9ca3af] opacity-0 transition hover:bg-[#f3f4f6] hover:text-[#374151] group-hover:opacity-100">
//                         <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Add Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16">
//           <div className="mb-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
//               <h2 className="text-lg font-semibold text-[#1a1a1a]">Add Employment Type</h2>
//               <button
//                 onClick={() => {
//                   setShowAddForm(false);
//                   setError("");
//                   setFormData(initialForm);
//                 }}
//                 className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
//               >
//                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="space-y-4 px-6 py-5">
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                     Employment Type Name <span className="text-[#E42527]">*</span>
//                   </label>
//                   <input
//                     value={formData.employment_type_name}
//                     onChange={(e) => handleChange("employment_type_name", e.target.value)}
//                     required
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//                     placeholder="e.g. Full-time, Contract, Intern"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                     Code (optional)
//                   </label>
//                   <input
//                     value={formData.employment_type_code}
//                     onChange={(e) => handleChange("employment_type_code", e.target.value)}
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
//                     placeholder="e.g. FT, CT, IN"
//                   />
//                 </div>

//                 {error && (
//                   <div className="rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
//                     {error}
//                   </div>
//                 )}
//               </div>

//               {/* Modal Footer */}
//               <div className="flex items-center justify-end gap-3 border-t border-[#e5e7eb] px-6 py-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddForm(false);
//                     setError("");
//                     setFormData(initialForm);
//                   }}
//                   className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {saving ? "Saving..." : "Submit"}
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

import { useEffect, useState, useCallback } from "react";
import { api } from "@/app/lib/api";

const initialForm = {
  name: "",
  code: "",
  is_leave_eligible_default: true,
};

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg;
      })
      .join(" • ");
  }

  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") return JSON.stringify(detail);

  return err?.message || "Something went wrong";
};

export default function EmploymentTypePage() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (mounted) {
        setError("");
        setLoading(true);
      }

      try {
        const res = await api.get("/api/v1/get/employment/type", {
          params: {
            page,
            page_size: pageSize,
            search: debouncedSearch || undefined,
            is_active: true,
          },
        });

        if (mounted) {
          const data = res.data;
          setList(data?.data ?? []);
          setTotal(data?.total ?? 0);
          setTotalPages(data?.total_pages ?? 0);
        }
      } catch (err) {
        if (mounted) {
          setError(formatApiError(err));
          setList([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [page, pageSize, debouncedSearch]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.employment_type_id);
    setFormData({
      name: item.name || "",
      code: item.code || "",
      is_leave_eligible_default: item.is_leave_eligible_default ?? true,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        is_leave_eligible_default: formData.is_leave_eligible_default,
      };

      if (editId) {
        await api.put(`/api/v1/update/employment/type/${editId}`, payload);
      } else {
        await api.post("/api/v1/add/employment/type", payload);
      }

      closeModal();
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employment type?")) {
      return;
    }

    setDeletingId(id);
    setError("");
    try {
      await api.delete(`/api/v1/delete/employment/type/${id}`);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Employment Types</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage employment type master data
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] focus:outline-none focus:ring-2 focus:ring-[#E42527]/40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Employment Type
        </button>
      </div>

      {/* Error Banner */}
      {error && !showModal && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}

      {/* Main Card */}
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#e5e7eb] bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
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
              placeholder="Search by name or code..."
              className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
            />
          </div>
          <div className="text-sm text-[#6b7280]">
            {total} type{total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-sm text-[#6b7280]">
                <svg className="h-5 w-5 animate-spin text-[#E42527]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading employment types...
              </div>
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f6]">
                <svg className="h-6 w-6 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#374151]">No employment types found</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {search ? "Try a different search term" : "Get started by adding your first employment type"}
              </p>
              {!search && (
                <button
                  onClick={openAddModal}
                  className="mt-4 text-sm font-medium text-[#E42527] hover:underline"
                >
                  + Add Employment Type
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">#</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Code</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Leave Eligible</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((item, index) => (
                  <tr
                    key={item.employment_type_id}
                    className="group transition hover:bg-[#fafafa]"
                  >
                    <td className="px-5 py-3.5 text-[#6b7280]">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">
                      {item.name || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#374151]">
                        {item.code || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {item.is_leave_eligible_default ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded p-1.5 text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151]"
                          title="Edit"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.employment_type_id)}
                          disabled={deletingId === item.employment_type_id}
                          className="rounded p-1.5 text-[#6b7280] hover:bg-red-50 hover:text-[#E42527] disabled:opacity-50"
                          title="Deactivate"
                        >
                          {deletingId === item.employment_type_id ? (
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3">
            <div className="text-sm text-[#6b7280]">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16">
          <div className="mb-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                {editId ? "Edit Employment Type" : "Add Employment Type"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 px-6 py-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Name <span className="text-[#E42527]">*</span>
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    minLength={2}
                    maxLength={64}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="e.g. Full Time, Contract, Intern"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Code <span className="text-[#E42527]">*</span>
                  </label>
                  <input
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                    required
                    minLength={2}
                    maxLength={8}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="e.g. FT, CT, IN"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_leave_eligible"
                    checked={formData.is_leave_eligible_default}
                    onChange={(e) => handleChange("is_leave_eligible_default", e.target.checked)}
                    className="h-4 w-4 rounded border-[#d1d5db] text-[#E42527] focus:ring-[#E42527]"
                  />
                  <label htmlFor="is_leave_eligible" className="text-sm text-[#374151]">
                    Leave eligible by default
                  </label>
                </div>

                {error && (
                  <div className="rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-[#e5e7eb] px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
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