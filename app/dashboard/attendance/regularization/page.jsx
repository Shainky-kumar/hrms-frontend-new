"use client";

import { useCallback, useEffect, useState } from "react";
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
  if (Array.isArray(p?.regularizations)) return p.regularizations;
  if (Array.isArray(p?.employees)) return p.employees;
  if (Array.isArray(p?.items)) return p.items;
  if (Array.isArray(p?.results)) return p.results;
  return [];
};

const getEmployeeId = (employee) =>
  employee.employee_id || employee.id || employee._id;

const getEmployeeName = (employee) => {
  const fullName = [employee.first_name, employee.last_name]
    .filter(Boolean)
    .join(" ");

  return fullName || employee.name || employee.full_name || getEmployeeId(employee);
};

const formatDate = (d) => (!d ? "—" : new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));

export default function RegularizationPage() {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employee_id: "",
    attendance_date: "",
    requested_status: "present",
    requested_punch_in: "",
    requested_punch_out: "",
    reason: "",
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/api/v1/get/employees");
        setEmployees(toArray(res?.data));
      } catch (err) {
        setError(formatApiError(err));
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/get/regularizations", {
        params: { status: filterStatus || undefined, page, page_size: 10 },
      });
      setList(toArray(res?.data));
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchList();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchList]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/attendence/regularization", {
        employee_id: form.employee_id,
        attendance_date: form.attendance_date,
        requested_status: form.requested_status || null,
        requested_punch_in: form.requested_punch_in || null,
        requested_punch_out: form.requested_punch_out || null,
        reason: form.reason,
      });
      setSuccess("Request submitted");
      setShowForm(false);
      setForm({ employee_id: "", attendance_date: "", requested_status: "present", requested_punch_in: "", requested_punch_out: "", reason: "" });
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const decide = async (id, status) => {
    const decision_reason = window.prompt(`Reason for ${status}?`) || "";
    try {
      await api.put(`/api/v1/update/regularization/${id}`, { status, decision_reason });
      setSuccess(`Marked ${status}`);
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Regularization</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Request attendance correction</p>
        </div>
        <button onClick={() => setShowForm(true)} className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]">+ New Request</button>
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <div className="mb-4 flex gap-2">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={() => { setPage(1); fetchList(); }} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm">Filter</button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">No requests</div>
          ) : (
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Date</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Reason</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((r, i) => (
                  <tr key={r.regularization_id || i} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5">{r.employee_id}</td>
                    <td className="px-5 py-3.5">{formatDate(r.attendance_date)}</td>
                    <td className="px-5 py-3.5 capitalize">{r.status}</td>
                    <td className="px-5 py-3.5 max-w-[200px] truncate">{r.reason || "—"}</td>
                    <td className="px-5 py-3.5 text-right">
                      {r.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => decide(r.regularization_id, "approved")} className="text-xs font-medium text-green-600">Approve</button>
                          <button onClick={() => decide(r.regularization_id, "rejected")} className="text-xs font-medium text-red-600">Reject</button>
                        </div>
                      )}
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
              <h2 className="font-semibold text-[#1a1a1a]">New Regularization</h2>
              <button onClick={() => setShowForm(false)} className="text-[#9ca3af]">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4 p-5">
              <select required value={form.employee_id} onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm">
                <option value="">Select employee</option>
                {employees.map((employee) => {
                  const id = getEmployeeId(employee);

                  return id ? (
                    <option key={id} value={id}>
                      {getEmployeeName(employee)} ({id})
                    </option>
                  ) : null;
                })}
              </select>
              <input required type="date" value={form.attendance_date} onChange={(e) => setForm((p) => ({ ...p, attendance_date: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
              <select value={form.requested_status} onChange={(e) => setForm((p) => ({ ...p, requested_status: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm">
                <option value="present">Present</option>
                <option value="half_day">Half Day</option>
                <option value="absent">Absent</option>
                <option value="work_from_home">WFH</option>
              </select>
              <textarea required rows={3} placeholder="Reason" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Submit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}