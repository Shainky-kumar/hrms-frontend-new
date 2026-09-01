
"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/app/lib/api";

const initialForm = {
  department_name: "",
  department_owner_id: "",
  parent_department_id: "",
  department_description: "",
};

const getErrorMessage = (err) => {
  try {
    const detail = err?.response?.data?.detail;
    if (Array.isArray(detail)) {
      return detail.map((i) => i?.msg || "Validation error").join(", ");
    }
    if (typeof detail === "string") return detail;
    if (detail && typeof detail === "object") {
      return detail.msg || detail.message || "Request failed";
    }
    return err?.message || "Something went wrong";
  } catch {
    return "Something went wrong";
  }
};

const toArray = (payload) => {
  try {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.departments)) return payload.departments;
    if (Array.isArray(payload?.employees)) return payload.employees;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  } catch {
    return [];
  }
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const menuRef = useRef(null);

  const fetchData = async () => {
    setError("");
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        api.get("/api/v1/get/departments"),
        api.get("/api/v1/get/employees").catch(() => ({ data: [] })),
      ]);

      setDepartments(toArray(deptRes?.data));
      setEmployees(toArray(empRes?.data));
    } catch (err) {
      setError(getErrorMessage(err));
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchData();
    };
    initFetch();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ========== ADD ==========
  const addDepartment = async (event) => {
    event.preventDefault();
    if (!form.department_name.trim()) return;

    setError("");
    setSubmitting(true);
    try {
      const payload = {
        department_name: form.department_name.trim(),
        department_description: form.department_description.trim() || null,
        department_owner_id: form.department_owner_id || null,
        parent_department_id: form.parent_department_id || null,
      };

      await api.post("/api/v1/add/departemnt", payload);
      setForm(initialForm);
      setShowAddForm(false);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ========== EDIT ==========
  const openEdit = (dept) => {
    setEditingId(dept.department_id || dept.id);
    setForm({
      department_name: dept.department_name || "",
      department_description: dept.department_description || "",
      department_owner_id: dept.department_owner_id || "",
      parent_department_id: dept.parent_department_id || "",
    });
    setError("");
    setOpenMenuId(null);
    setShowEditForm(true);
  };

  const updateDepartment = async (event) => {
    event.preventDefault();
    if (!form.department_name.trim() || !editingId) return;

    setError("");
    setSubmitting(true);
    try {
      const payload = {
        department_name: form.department_name.trim(),
        department_description: form.department_description.trim() || null,
        department_owner_id: form.department_owner_id || null,
        parent_department_id: form.parent_department_id || null,
      };

      // Backend endpoint: /api/v1/update/department/{department_id}
      await api.put(`/api/v1/update/departments/${editingId}`, payload);
      
      setForm(initialForm);
      setShowEditForm(false);
      setEditingId(null);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ========== DELETE ==========
  const handleDelete = async (deptId) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      setOpenMenuId(null);
      return;
    }

    setDeletingId(deptId);
    setOpenMenuId(null);
    try {
      // Backend endpoint (agar different hai toh change kar lena)
      await api.delete(`/api/v1/delete/department/${deptId}`);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const closeModal = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingId(null);
    setError("");
    setForm(initialForm);
  };

  const list = Array.isArray(departments) ? departments : [];
  const empList = Array.isArray(employees) ? employees : [];

  const filteredDepartments = list.filter((dept) => {
    const name = (dept?.department_name || dept?.name || "").toLowerCase();
    const desc = (dept?.department_description || "").toLowerCase();
    const q = (search || "").toLowerCase();
    return name.includes(q) || desc.includes(q);
  });

  const getEmployeeLabel = (emp) => {
    if (emp?.first_name) {
      return `${emp.first_name} ${emp.last_name || ""}`.trim();
    }
    return emp?.name || emp?.company_email || "Unknown";
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Departments</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage your organization&apos;s departments and hierarchy
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setForm(initialForm);
            setShowAddForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] focus:outline-none focus:ring-2 focus:ring-[#E42527]/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Department
        </button>
      </div>

      {error && !showAddForm && !showEditForm && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-red-100 bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        {/* Toolbar */}
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
              placeholder="Search by name or description..."
              className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
            />
          </div>
          <div className="text-sm text-[#6b7280]">
            {filteredDepartments.length} department{filteredDepartments.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-sm text-[#6b7280]">
                <svg className="h-5 w-5 animate-spin text-[#E42527]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading departments...
              </div>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
                <svg className="h-7 w-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#374151]">No departments found</p>
              <p className="mt-1 max-w-xs text-sm text-[#6b7280]">
                {search
                  ? "Try adjusting your search term"
                  : "Create your first department to start building the organization structure"}
              </p>
              {!search && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Department
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Department</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Description</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Owner</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Parent Department</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredDepartments.map((department, index) => {
                  const deptId = department?.department_id || department?.id;
                  return (
                    <tr
                      key={deptId || index}
                      className="group transition hover:bg-[#fafafa]"
                    >
                      {/* Department Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2] text-sm font-semibold text-[#E42527]">
                            {(department?.department_name || "D")[0]?.toUpperCase()}
                          </div>
                          <p className="font-medium text-[#1a1a1a]">
                            {department?.department_name || department?.name || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-[260px] px-5 py-3.5">
                        <p className="truncate text-[#6b7280]" title={department?.department_description || ""}>
                          {department?.department_description || "—"}
                        </p>
                      </td>

                      {/* Owner */}
                      <td className="px-5 py-3.5">
                        {department?.department_owner_name && department.department_owner_name !== "—" ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-medium text-[#4b5563]">
                              {department.department_owner_name[0]?.toUpperCase()}
                            </div>
                            <span className="text-[#374151]">{department.department_owner_name}</span>
                          </div>
                        ) : (
                          <span className="text-[#9ca3af]">—</span>
                        )}
                      </td>

                      {/* Parent */}
                      <td className="px-5 py-3.5">
                        {department?.parent_department_name && department.parent_department_name !== "—" ? (
                          <span className="inline-flex items-center rounded-full bg-[#f3f4f6] px-2.5 py-0.5 text-xs font-medium text-[#4b5563]">
                            {department.parent_department_name}
                          </span>
                        ) : (
                          <span className="text-[#9ca3af]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="relative px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === deptId ? null : deptId)}
                          className="rounded-md p-1.5 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#374151]"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === deptId && (
                          <div
                            ref={menuRef}
                            className="absolute right-5 top-10 z-20 w-36 overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-lg"
                          >
                            <button
                              type="button"
                              onClick={() => openEdit(department)}
                              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-[#374151] hover:bg-[#f9fafb]"
                            >
                              <svg className="h-4 w-4 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(deptId)}
                              disabled={deletingId === deptId}
                              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {deletingId === deptId ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ========== ADD / EDIT MODAL ========== */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  {showEditForm ? "Edit Department" : "Add Department"}
                </h2>
                <p className="mt-0.5 text-sm text-[#6b7280]">
                  {showEditForm
                    ? "Update department details"
                    : "Create a new department in your organization"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-1.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={showEditForm ? updateDepartment : addDepartment} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Department Name <span className="text-[#E42527]">*</span>
                  </label>
                  <input
                    value={form.department_name}
                    onChange={(e) => handleChange("department_name", e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-md border border-[#d1d5db] px-3.5 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="e.g. Human Resources, Marketing"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">Description</label>
                  <textarea
                    value={form.department_description}
                    onChange={(e) => handleChange("department_description", e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-[#d1d5db] px-3.5 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="Brief description of the department's role"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">Department Owner</label>
                  <select
                    value={form.department_owner_id}
                    onChange={(e) => handleChange("department_owner_id", e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3.5 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                  >
                    <option value="">Select owner (optional)</option>
                    {empList.map((emp, index) => {
                      const value = emp?.user_id || emp?.employee_id || emp?.id || "";
                      return (
                        <option key={value || index} value={value}>
                          {getEmployeeLabel(emp)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">Parent Department</label>
                  <select
                    value={form.parent_department_id}
                    onChange={(e) => handleChange("parent_department_id", e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3.5 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                  >
                    <option value="">No parent (Top-level)</option>
                    {list
                      .filter((d) => (d.department_id || d.id) !== editingId) // Edit mode mein khud ko parent na banaye
                      .map((dept, index) => (
                        <option
                          key={dept?.department_id || dept?.id || index}
                          value={dept?.department_id || dept?.id || ""}
                        >
                          {dept?.department_name || dept?.name || `Department ${index + 1}`}
                        </option>
                      ))}
                  </select>
                </div>

                {error && (
                  <div className="rounded-md bg-[#fef2f2] px-3.5 py-2.5 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-7 flex items-center justify-end gap-3 border-t border-[#e5e7eb] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.department_name.trim()}
                  className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving..." : showEditForm ? "Update Department" : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
