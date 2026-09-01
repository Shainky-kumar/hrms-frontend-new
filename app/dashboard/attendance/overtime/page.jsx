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

export default function OvertimePage() {
  const user = useAuthStore((state) => state.user);
  const employeeId =
    user?.employee_id ||
    user?.employeeId ||
    user?.emp_id ||
    user?.employee?.employee_id ||
    "";
  const [form, setForm] = useState({
    attendance_date: "",
    requested_minutes: "",
    reason: "",
  });
  const [decideId, setDecideId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const create = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      setError("Logged-in employee profile is not linked to an employee.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/create/overtime", {
        employee_id: employeeId,
        attendance_date: form.attendance_date,
        requested_minutes: Number(form.requested_minutes),
        reason: form.reason || null,
      });
      setSuccess("Overtime request created");
      setForm({ attendance_date: "", requested_minutes: "", reason: "" });
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const decide = async (status) => {
    if (!decideId.trim()) return setError("Overtime ID required");
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put(`/api/v1/get/overtime/${decideId.trim()}`, { status });
      setSuccess(`Overtime ${status}`);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Overtime</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Create and approve overtime requests</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#374151]">Create Request</h2>
        </div>
        <form onSubmit={create} className="grid gap-4 p-5 sm:grid-cols-2">
          <input required type="date" value={form.attendance_date} onChange={(e) => setForm((p) => ({ ...p, attendance_date: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <input required type="number" placeholder="Requested minutes" value={form.requested_minutes} onChange={(e) => setForm((p) => ({ ...p, requested_minutes: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <input placeholder="Reason" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <button type="submit" disabled={saving} className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60 sm:col-span-2 sm:w-fit">
            {saving ? "Saving..." : "Submit Overtime"}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#374151]">Approve / Reject</h2>
        </div>
        <div className="flex flex-wrap items-end gap-3 p-5">
          <input placeholder="Overtime ID" value={decideId} onChange={(e) => setDecideId(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
          <button type="button" disabled={saving} onClick={() => decide("approved")} className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">Approve</button>
          <button type="button" disabled={saving} onClick={() => decide("rejected")} className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">Reject</button>
        </div>
      </div>
    </div>
  );
}