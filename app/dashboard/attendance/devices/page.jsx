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
  if (Array.isArray(p?.devices)) return p.devices;
  return [];
};

export default function AttendanceDevicesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    device_uid: "",
    device_name: "",
    device_type: "android",
    employee_id: "",
    is_trusted: false,
    is_blocked: false,
  });

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/attendence/devices", {
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
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/v1/attendence/devices", {
          params: { page, page_size: 10, search: search || undefined },
        });

        if (!active) return;
        setList(toArray(res?.data));
      } catch (err) {
        if (!active) return;
        setError(formatApiError(err));
        setList([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [page]);

  const openAdd = () => {
    setEditId(null);
    setForm({
      device_uid: "",
      device_name: "",
      device_type: "android",
      employee_id: "",
      is_trusted: false,
      is_blocked: false,
    });
    setShowForm(true);
  };

  const openEdit = (row) => {
    setEditId(row.device_id || row.id);
    setForm({
      device_uid: row.device_uid || "",
      device_name: row.device_name || "",
      device_type: row.device_type || "android",
      employee_id: row.employee_id || "",
      is_trusted: !!row.is_trusted,
      is_blocked: !!row.is_blocked,
    });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        device_uid: form.device_uid,
        device_name: form.device_name || null,
        device_type: form.device_type || null,
        employee_id: form.employee_id || null,
        is_trusted: form.is_trusted,
        is_blocked: form.is_blocked,
      };
      if (editId) {
        await api.put(`/api/v1/update/attendence/device/${editId}`, payload);
        setSuccess("Device updated");
      } else {
        await api.post("/api/v1/add/attendence/device", payload);
        setSuccess("Device added");
      }
      setShowForm(false);
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
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Devices</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Trusted / blocked punch devices</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Add Device
        </button>
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
            <div className="py-16 text-center text-sm text-[#6b7280]">No devices</div>
          ) : (
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">UID</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Trusted</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Blocked</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((row, i) => (
                  <tr key={row.device_id || i} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5 max-w-[140px] truncate">{row.device_uid}</td>
                    <td className="px-5 py-3.5">{row.device_name || "—"}</td>
                    <td className="px-5 py-3.5">{row.device_type || "—"}</td>
                    <td className="px-5 py-3.5">{row.employee_id || "—"}</td>
                    <td className="px-5 py-3.5">{row.is_trusted ? "Yes" : "No"}</td>
                    <td className="px-5 py-3.5">{row.is_blocked ? "Yes" : "No"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => openEdit(row)}
                        className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
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
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <h2 className="font-semibold">{editId ? "Edit Device" : "Add Device"}</h2>
              <button type="button" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3 p-5">
              <input
                required
                placeholder="Device UID"
                value={form.device_uid}
                onChange={(e) => setForm((p) => ({ ...p, device_uid: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <input
                placeholder="Device name"
                value={form.device_name}
                onChange={(e) => setForm((p) => ({ ...p, device_name: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <select
                value={form.device_type}
                onChange={(e) => setForm((p) => ({ ...p, device_type: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              >
                <option value="android">Android</option>
                <option value="ios">iOS</option>
                <option value="web">Web</option>
              </select>
              <input
                placeholder="Employee ID (optional)"
                value={form.employee_id}
                onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_trusted}
                  onChange={(e) => setForm((p) => ({ ...p, is_trusted: e.target.checked }))}
                />
                Trusted
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_blocked}
                  onChange={(e) => setForm((p) => ({ ...p, is_blocked: e.target.checked }))}
                />
                Blocked
              </label>
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
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}