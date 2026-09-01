"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

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
  if (Array.isArray(p?.comp_offs)) return p.comp_offs;
  return [];
};

const formatDate = (d) => (!d ? "—" : new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));

export default function CompOffPage() {
  const user = useAuthStore((state) => state.user);
  const employeeId =
    user?.employee_id ||
    user?.employeeId ||
    user?.emp_id ||
    user?.employee?.employee_id ||
    "";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    earned_date: "",
    attendance_id: "",
    days: "1",
    expiry_date: "",
    remarks: "",
  });

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/comp_offs", {
        params: { page, page_size: 10, search: search || undefined },
      });
      setList(toArray(res?.data));
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchList();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchList]);

  const submit = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      setError("Logged-in employee profile is not linked to an employee.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/add/comp_off", {
        employee_id: employeeId,
        earned_date: form.earned_date,
        attendance_id: form.attendance_id || null,
        days: Number(form.days),
        expiry_date: form.expiry_date || null,
        remarks: form.remarks || null,
      });
      setSuccess("Comp-off added");
      setForm({ earned_date: "", attendance_id: "", days: "1", expiry_date: "", remarks: "" });
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Comp-off</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Manage compensatory offs</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#374151]">Add Comp-off</h2>
        </div>
        <form onSubmit={submit} className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <input required type="date" value={form.earned_date} onChange={(e) => setForm((p) => ({ ...p, earned_date: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <input type="number" step="0.5" placeholder="Days" value={form.days} onChange={(e) => setForm((p) => ({ ...p, days: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <input type="date" placeholder="Expiry" value={form.expiry_date} onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <input placeholder="Attendance ID (optional)" value={form.attendance_id} onChange={(e) => setForm((p) => ({ ...p, attendance_id: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <input placeholder="Remarks" value={form.remarks} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <button type="submit" disabled={saving} className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 sm:w-fit">{saving ? "Saving..." : "Add Comp-off"}</button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm" />
          <button onClick={() => { setPage(1); fetchList(); }} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm">Search</button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">No comp-offs</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Earned</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Days</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Expiry</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((c, i) => (
                  <tr key={c.comp_off_id || i} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5">{c.employee_id}</td>
                    <td className="px-5 py-3.5">{formatDate(c.earned_date)}</td>
                    <td className="px-5 py-3.5">{c.days}</td>
                    <td className="px-5 py-3.5">{formatDate(c.expiry_date)}</td>
                    <td className="px-5 py-3.5">{c.status || (c.is_used ? "used" : "available")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}