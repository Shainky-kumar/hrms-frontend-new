"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

const initialForm = {
  holiday_name: "",
  date: "",
  holiday_message: "",
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

const normalizeHolidayList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.holidays)) return payload.holidays;
  if (payload.data && typeof payload.data === "object") return [payload.data];
  return typeof payload === "object" ? [payload] : [];
};

export default function HolidayPage() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [companyId] = useState(getCompanyId());

  useEffect(() => {
    if (!companyId) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/api/v1/all/holidays", {
          params: { company_id: companyId },
        });

        const items = normalizeHolidayList(res.data);
        const filtered = search
          ? items.filter((item) =>
              [item.holiday_name, item.date, item.holiday_message]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
            )
          : items;

        setList(filtered);
        setTotal(filtered.length);
      } catch (err) {
        setError(formatApiError(err));
        setList([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, search]);

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
    const id = item.holiday_id ?? item.id ?? item._id ?? null;

    setEditId(id);
    setFormData({
      holiday_name: item.holiday_name || "",
      date: item.date ? String(item.date).slice(0, 10) : "",
      holiday_message: item.holiday_message || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Exact match with your backend schemas
      const payload = {
        date: formData.date,
        holiday_name: formData.holiday_name,
        holiday_message: formData.holiday_message || null,
      };

      if (editId) {
        await api.put(`/api/v1/update/holidays/${editId}`, payload);
      } else {
        await api.post("/api/v1/create/holidays", payload); // ← correct path
      }

      setShowForm(false);
      setFormData(initialForm);
      setEditId(null);
      setPage(1);

      // Refresh list
      const res = await api.get("/api/v1/all/holidays", {
        params: { company_id: companyId },
      });
      const items = normalizeHolidayList(res.data);
      const filtered = search
        ? items.filter((item) =>
            [item.holiday_name, item.date, item.holiday_message]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase())
          )
        : items;
      setList(filtered);
      setTotal(filtered.length);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [list, page, pageSize]);

  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid holiday ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;

    try {
      await api.delete(`/api/v1/delete/holidays/${id}`);

      const res = await api.get("/api/v1/all/holidays", {
        params: { company_id: companyId },
      });
      const items = normalizeHolidayList(res.data);
      const filtered = search
        ? items.filter((item) =>
            [item.holiday_name, item.date, item.holiday_message]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase())
          )
        : items;
      setList(filtered);
      setTotal(filtered.length);
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Holiday</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage company holidays and calendar
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Add Holiday
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search holidays..."
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
          />
          <span className="text-sm text-slate-500">{total} holidays</span>
        </div>

        {error && !showForm && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-500">No holidays found</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 font-medium text-slate-500">#</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Holiday Name</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Date</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Message</th>
                  <th className="px-5 py-3 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedList.map((item, i) => {
                  const holidayId = item.holiday_id ?? item.id ?? item._id;

                  return (
                    <tr key={holidayId ?? i} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 text-slate-500">
                        {(page - 1) * pageSize + i + 1}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {item.holiday_name ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {item.holiday_message || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(holidayId)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editId ? "Edit Holiday" : "Add Holiday"}
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
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Holiday Name *
                    </label>
                    <input
                      required
                      value={formData.holiday_name}
                      onChange={(e) => handleChange("holiday_name", e.target.value)}
                      placeholder="e.g. Independence Day, Diwali"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Holiday Message
                    </label>
                    <textarea
                      value={formData.holiday_message}
                      onChange={(e) => handleChange("holiday_message", e.target.value)}
                      rows={3}
                      placeholder="Optional message..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>
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