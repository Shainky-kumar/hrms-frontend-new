"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/app/lib/api";

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function toArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.leave_types)) return payload.data.leave_types;
  if (Array.isArray(payload?.leave_types)) return payload.leave_types;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function getTotalPages(payload, pageSize) {
  const total =
    payload?.total ??
    payload?.total_count ??
    payload?.count ??
    payload?.data?.total ??
    payload?.data?.total_count ??
    payload?.data?.count;
  if (total != null) return Math.max(1, Math.ceil(Number(total) / pageSize));
  return null;
}

const emptyForm = {
  leave_type_name: "",
  leave_type_code: "",
  leave_type_description: "",
  is_paid: true,
  is_active: true,
};

const PAGE_SIZE = 10;

export default function LeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  const fetchLeaveTypes = useCallback(async () => {
    setLoading(true);
    setError("");
    const endpoints = [
      "/api/v1/get/leave/type",
      "/api/v1/get/leave/type/list",
      "/api/v1/leave/types",
    ];
    let lastError;

    try {
      for (const endpoint of endpoints) {
        try {
          const res = await api.get(endpoint, {
            params: { page, page_size: PAGE_SIZE, search },
          });
          const payload = res?.data ?? res;
          setLeaveTypes(toArray(payload));
          setTotalPages(getTotalPages(payload, PAGE_SIZE));
          return;
        } catch (err) {
          lastError = err;
        }
      }
      setError(getErrorMessage(lastError));
      setLeaveTypes([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    // fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(leaveType) {
    setEditingId(leaveType.leave_type_id);
    setForm({
      leave_type_name: leaveType.leave_type_name || "",
      leave_type_code: leaveType.leave_type_code || "",
      leave_type_description: leaveType.leave_type_description || "",
      is_paid: leaveType.is_paid ?? true,
      is_active: leaveType.is_active ?? true,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const body = {
      leave_type_name: form.leave_type_name,
      leave_type_code: form.leave_type_code,
      leave_type_description: form.leave_type_description,
      is_paid: form.is_paid,
      is_active: form.is_active,
    };
    try {
      if (editingId) {
        await api.put(`/api/v1/update/leave/type/${editingId}`, body);
        setSuccess("Leave type updated successfully");
      } else {
        await api.post("/api/v1/create/leave/type", body);
        setSuccess("Leave type created successfully");
      }
      closeForm();
      await fetchLeaveTypes();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Leave Types</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Manage leave type policies</p>
        </div>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Create Leave Type
        </button>
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-xs rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb]">
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm hover:bg-[#f9fafb]"
          >
            Clear
          </button>
        )}
      </form>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        {!loading && leaveTypes.length > 0 && (
          <div className="grid gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {leaveTypes.map((leaveType) => (
              <button
                type="button"
                key={leaveType.leave_type_id}
                onClick={() => setSelectedLeaveType(leaveType)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Leave type</p>
                    <h3 className="mt-1 truncate text-base font-bold text-slate-800">
                      {leaveType.leave_type_name || "Unnamed leave type"}
                    </h3>
                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {leaveType.leave_type_code || "No code"}
                    </span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${leaveType.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {leaveType.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Payment</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-700">{leaveType.is_paid ? "Paid" : "Unpaid"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Code</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-700">{leaveType.leave_type_code || "—"}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                  <span className="text-xs font-semibold text-[#E42527] opacity-0 transition group-hover:opacity-100">View details →</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {loading ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
        ) : leaveTypes.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">No leave types found</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
                <th className="px-5 py-3 font-medium text-[#6b7280]">Code</th>
                <th className="px-5 py-3 font-medium text-[#6b7280]">Description</th>
                <th className="px-5 py-3 font-medium text-[#6b7280]">Paid</th>
                <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                <th className="px-5 py-3 font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {leaveTypes.map((lt) => (
                <tr key={lt.leave_type_id} className="hover:bg-[#fafafa]">
                  <td className="px-5 py-3.5">{lt.leave_type_name}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded bg-[#f3f4f6] px-1.5 py-0.5 text-xs font-mono">{lt.leave_type_code}</span>
                  </td>
                  <td className="max-w-xs truncate px-5 py-3.5 text-[#4b5563]" title={lt.leave_type_description}>
                    {lt.leave_type_description || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        lt.is_paid ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lt.is_paid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        lt.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lt.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => openEditForm(lt)}
                      className="rounded-md border border-[#d1d5db] px-2.5 py-1 text-xs hover:bg-[#f9fafb]"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {leaveTypes.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-[#6b7280]">
          <span>Page {page}{totalPages ? ` of ${totalPages}` : ""}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-sm hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={totalPages ? page >= totalPages : leaveTypes.length < PAGE_SIZE}
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-sm hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* -------------------- Create / Edit Modal -------------------- */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Leave Type" : "Create Leave Type"}</h2>
              <button onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 p-5">
              <input
                required
                type="text"
                placeholder="Leave Type Name"
                value={form.leave_type_name}
                onChange={(e) => setForm({ ...form, leave_type_name: e.target.value })}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <input
                required
                type="text"
                placeholder="Leave Type Code (e.g. CL, SL, EL)"
                value={form.leave_type_code}
                onChange={(e) => setForm({ ...form, leave_type_code: e.target.value.toUpperCase() })}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <textarea
                required
                placeholder="Description"
                value={form.leave_type_description}
                onChange={(e) => setForm({ ...form, leave_type_description: e.target.value })}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
                rows={3}
              />
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                <input
                  type="checkbox"
                  checked={form.is_paid}
                  onChange={(e) => setForm({ ...form, is_paid: e.target.checked })}
                  className="h-4 w-4 rounded border-[#d1d5db]"
                />
                Paid leave
              </label>
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#d1d5db]"
                />
                Active
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeForm} className="rounded-md border px-4 py-2 text-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedLeaveType && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Leave type details</p>
                <h2 className="mt-1 text-lg font-bold text-slate-800">{selectedLeaveType.leave_type_name || "Unnamed leave type"}</h2>
              </div>
              <button type="button" onClick={() => setSelectedLeaveType(null)} className="rounded-lg px-3 py-2 text-lg text-slate-400 hover:bg-slate-100">×</button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Leave Type ID", selectedLeaveType.leave_type_id],
                  ["Leave Type Name", selectedLeaveType.leave_type_name],
                  ["Leave Type Code", selectedLeaveType.leave_type_code],
                  ["Paid", selectedLeaveType.is_paid ? "Yes" : "No"],
                  ["Status", selectedLeaveType.is_active ? "Active" : "Inactive"],
                  ["Description", selectedLeaveType.leave_type_description],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">{value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button type="button" onClick={() => setSelectedLeaveType(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Close</button>
              <button type="button" onClick={() => { setSelectedLeaveType(null); openEditForm(selectedLeaveType); }} className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91f21]">Edit leave type</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}