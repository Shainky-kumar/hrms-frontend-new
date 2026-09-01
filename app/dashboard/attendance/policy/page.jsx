
"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => e.msg || JSON.stringify(e)).join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const toArray = (p) => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.policy)) return p.policy;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.policies)) return p.policies;
  return [];
};

const initialForm = {
  policy_name: "",
  grace_minutes: 15,
  late_mark_after_minutes: 30,
  half_day_after_minutes: 120,
  early_exit_grace_minutes: 15,
  full_day_minutes: 480,
  half_day_minutes: 240,
  max_work_minutes: "",
  allow_multiple_punches: true,
  auto_punch_out_after_hours: "",
  require_photo_on_punch: false,
  require_location_on_punch: true,
  geo_fence_enabled: false,
  geo_fence_action: "warn",
  face_recognition_enabled: false,
  face_match_threshold: 0.75,
  break_tracking_enabled: false,
  max_break_minutes_per_day: "",
  auto_deduct_break_minutes: "",
  count_weekoff_as_present_if_worked: false,
  count_holiday_as_present_if_worked: false,
  max_late_per_month: "",
  max_consecutive_absent_days: "",
  comp_off_enabled: false,
  comp_off_expiry_days: "",
  wfh_requires_approval: true,
  wfh_max_days_per_month: "",
  on_duty_enabled: true,
  on_duty_requires_approval: true,
  auto_mark_absent_if_no_punch: true,
  auto_mark_half_day_if_single_punch: true,
  allow_cross_midnight_shift: true,
  notify_manager_on_late: false,
  notify_hr_on_absent: false,
  is_active: true,
  effective_from: "",
  effective_to: "",
};

export default function AttendancePolicyPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/get/attendence/policy", {
        params: { page: 1, page_size: 50 },
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
    const loadData = async () => {
      await fetchList();
    };
    loadData();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(initialForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEdit = (row) => {
    setEditId(row.attendance_policy_id);
    setForm({
      policy_name: row.policy_name || "",
      grace_minutes: row.grace_minutes ?? 15,
      late_mark_after_minutes: row.late_mark_after_minutes ?? 30,
      half_day_after_minutes: row.half_day_after_minutes ?? 120,
      early_exit_grace_minutes: row.early_exit_grace_minutes ?? 15,
      full_day_minutes: row.full_day_minutes ?? 480,
      half_day_minutes: row.half_day_minutes ?? 240,
      max_work_minutes: row.max_work_minutes ?? "",
      allow_multiple_punches: row.allow_multiple_punches ?? true,
      auto_punch_out_after_hours: row.auto_punch_out_after_hours ?? "",
      require_photo_on_punch: !!row.require_photo_on_punch,
      require_location_on_punch: row.require_location_on_punch !== false,
      geo_fence_enabled: !!row.geo_fence_enabled,
      geo_fence_action: row.geo_fence_action || "warn",
      face_recognition_enabled: !!row.face_recognition_enabled,
      face_match_threshold: row.face_match_threshold ?? 0.75,
      break_tracking_enabled: !!row.break_tracking_enabled,
      max_break_minutes_per_day: row.max_break_minutes_per_day ?? "",
      auto_deduct_break_minutes: row.auto_deduct_break_minutes ?? "",
      count_weekoff_as_present_if_worked: !!row.count_weekoff_as_present_if_worked,
      count_holiday_as_present_if_worked: !!row.count_holiday_as_present_if_worked,
      max_late_per_month: row.max_late_per_month ?? "",
      max_consecutive_absent_days: row.max_consecutive_absent_days ?? "",
      comp_off_enabled: !!row.comp_off_enabled,
      comp_off_expiry_days: row.comp_off_expiry_days ?? "",
      wfh_requires_approval: row.wfh_requires_approval !== false,
      wfh_max_days_per_month: row.wfh_max_days_per_month ?? "",
      on_duty_enabled: row.on_duty_enabled !== false,
      on_duty_requires_approval: row.on_duty_requires_approval !== false,
      auto_mark_absent_if_no_punch: row.auto_mark_absent_if_no_punch !== false,
      auto_mark_half_day_if_single_punch: row.auto_mark_half_day_if_single_punch !== false,
      allow_cross_midnight_shift: row.allow_cross_midnight_shift !== false,
      notify_manager_on_late: !!row.notify_manager_on_late,
      notify_hr_on_absent: !!row.notify_hr_on_absent,
      is_active: row.is_active !== false,
      effective_from: row.effective_from ? String(row.effective_from).slice(0, 10) : "",
      effective_to: row.effective_to ? String(row.effective_to).slice(0, 10) : "",
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        grace_minutes: Number(form.grace_minutes),
        late_mark_after_minutes: Number(form.late_mark_after_minutes),
        half_day_after_minutes: Number(form.half_day_after_minutes),
        early_exit_grace_minutes: Number(form.early_exit_grace_minutes),
        full_day_minutes: Number(form.full_day_minutes),
        half_day_minutes: Number(form.half_day_minutes),
        max_work_minutes: form.max_work_minutes === "" ? null : Number(form.max_work_minutes),
        auto_punch_out_after_hours:
          form.auto_punch_out_after_hours === "" ? null : Number(form.auto_punch_out_after_hours),
        face_match_threshold: Number(form.face_match_threshold),
        max_break_minutes_per_day:
          form.max_break_minutes_per_day === "" ? null : Number(form.max_break_minutes_per_day),
        auto_deduct_break_minutes:
          form.auto_deduct_break_minutes === "" ? null : Number(form.auto_deduct_break_minutes),
        max_late_per_month:
          form.max_late_per_month === "" ? null : Number(form.max_late_per_month),
        max_consecutive_absent_days:
          form.max_consecutive_absent_days === ""
            ? null
            : Number(form.max_consecutive_absent_days),
        comp_off_expiry_days:
          form.comp_off_expiry_days === "" ? null : Number(form.comp_off_expiry_days),
        wfh_max_days_per_month:
          form.wfh_max_days_per_month === "" ? null : Number(form.wfh_max_days_per_month),
        effective_to: form.effective_to || null,
      };

      if (editId) {
        await api.put(`/api/v1/attendence/policy/${editId}`, payload);
        setSuccess("Policy updated successfully");
      } else {
        await api.post("/api/v1/add/attendence/policy", payload);
        setSuccess("Policy created successfully");
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
            Attendance Policy
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Grace, half-day, geo, face & work rules
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Add Policy
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">
              No policies found. Create one to start.
            </div>
          ) : (
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Grace</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Half Day</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Full Day</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Geo</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Active</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map((row) => (
                  <tr key={row.attendance_policy_id} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5 font-medium">{row.policy_name}</td>
                    <td className="px-5 py-3.5">{row.grace_minutes} min</td>
                    <td className="px-5 py-3.5">{row.half_day_minutes} min</td>
                    <td className="px-5 py-3.5">{row.full_day_minutes} min</td>
                    <td className="px-5 py-3.5">
                      {row.geo_fence_enabled ? "On" : "Off"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {row.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">
                {editId ? "Edit Policy" : "Add Policy"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500">
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
              {/* Basic */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Policy Name *
                </label>
                <input
                  required
                  value={form.policy_name}
                  onChange={(e) => handleChange("policy_name", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  placeholder="Default Policy"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Grace Minutes
                </label>
                <input
                  type="number"
                  value={form.grace_minutes}
                  onChange={(e) => handleChange("grace_minutes", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Late After (min)
                </label>
                <input
                  type="number"
                  value={form.late_mark_after_minutes}
                  onChange={(e) =>
                    handleChange("late_mark_after_minutes", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Half Day Minutes
                </label>
                <input
                  type="number"
                  value={form.half_day_minutes}
                  onChange={(e) => handleChange("half_day_minutes", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Full Day Minutes
                </label>
                <input
                  type="number"
                  value={form.full_day_minutes}
                  onChange={(e) => handleChange("full_day_minutes", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Effective From *
                </label>
                <input
                  type="date"
                  required
                  value={form.effective_from}
                  onChange={(e) => handleChange("effective_from", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Effective To
                </label>
                <input
                  type="date"
                  value={form.effective_to}
                  onChange={(e) => handleChange("effective_to", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 grid grid-cols-2 gap-3 border-t pt-4">
                {[
                  ["require_location_on_punch", "Require Location"],
                  ["geo_fence_enabled", "Geo Fence"],
                  ["face_recognition_enabled", "Face Recognition"],
                  ["allow_multiple_punches", "Allow Multiple Punches"],
                  ["auto_mark_absent_if_no_punch", "Auto Mark Absent"],
                  ["auto_mark_half_day_if_single_punch", "Auto Half Day (Single Punch)"],
                  ["is_active", "Active"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!form[key]}
                      onChange={(e) => handleChange(key, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2 sm:col-span-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}