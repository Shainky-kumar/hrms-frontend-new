"use client";

import { useState } from "react";
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
  if (Array.isArray(p?.breaks)) return p.breaks;
  return [];
};

const formatDateTime = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return String(d);
  }
};

export default function AttendanceBreaksPage() {
  const user = useAuthStore((state) => state.user);
  const employeeId =
    user?.employee_id ||
    user?.employeeId ||
    user?.emp_id ||
    user?.employee?.employee_id ||
    "";
  const [breakType, setBreakType] = useState("lunch");
  const [breakId, setBreakId] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);

  const loadBreaks = async () => {
    if (!employeeId) {
      setError("Logged-in employee profile is not linked to an employee.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/get/breaks", {
        params: { employee_id: employeeId, page, page_size: 10 },
      });
      setList(toArray(res?.data));
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const startBreak = async () => {
    if (!employeeId) {
      return setError("Logged-in employee profile is not linked to an employee.");
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/v1/break/start", {
        employee_id: employeeId,
        break_type: breakType || null,
        remarks: null,
      });
      const id = res?.data?.break_id || res?.data?.data?.break_id;
      if (id) setBreakId(id);
      setSuccess("Break started");
      await loadBreaks();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const endBreak = async () => {
    if (!breakId) return setError("Start a break before ending it.");
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/break/end", { break_id: breakId });
      setSuccess("Break ended");
      setBreakId("");
      await loadBreaks();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Breaks</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Start / end break and view break logs</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#374151]">Actions</h2>
        </div>
        <div className="flex flex-wrap items-end gap-3 p-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#374151]">Break type</label>
            <select value={breakType} onChange={(e) => setBreakType(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
              <option value="lunch">Lunch</option>
              <option value="tea">Tea</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="button" disabled={saving} onClick={startBreak} className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">Start Break</button>
          <button type="button" disabled={saving || !breakId} onClick={endBreak} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">End Break</button>
          <button type="button" onClick={loadBreaks} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">Load List</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">No breaks found</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Break ID</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Start</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">End</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Minutes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((b, i) => (
                  <tr key={b.break_id || i} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5">{b.break_id || "—"}</td>
                    <td className="px-5 py-3.5">{b.break_type || "—"}</td>
                    <td className="px-5 py-3.5">{formatDateTime(b.break_start)}</td>
                    <td className="px-5 py-3.5">{formatDateTime(b.break_end)}</td>
                    <td className="px-5 py-3.5">{b.break_minutes ?? "—"}</td>
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