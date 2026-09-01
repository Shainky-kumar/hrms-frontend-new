
"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg || "Error";
      })
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const toArray = (p) => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.requests)) return p.requests;
  if (Array.isArray(p?.employees)) return p.employees;
  return [];
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const statusBadge = (status) => {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED") return "bg-emerald-50 text-emerald-700";
  if (s === "REJECTED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700"; // PENDING
};

export default function SpecialRequestsPage() {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [onlyMyApprovals, setOnlyMyApprovals] = useState(false);
  const [search, setSearch] = useState("");

  // employee_id nahi — token se backend nikaalega
  const [form, setForm] = useState({
    request_type: "wfh",
    start_date: "",
    end_date: "",
    reason: "",
    location_name: "",
    latitude: "",
    longitude: "",
  });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Sirf name dikhane ke liye employees list (dropdown nahi)
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/v1/get/employees");
      setEmployees(toArray(res?.data));
    } catch {
      setEmployees([]);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchList = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/v1/attendance/special-requests", {
          params: {
            page,
            page_size: pageSize,
            search: search || undefined,
            only_my_approvals: onlyMyApprovals,
          },
        });
        const data = res?.data;
        let rows = toArray(data);
        if (statusFilter !== "all") {
          rows = rows.filter(
            (r) => (r.status || "").toUpperCase() === statusFilter.toUpperCase()
          );
        }
        setList(rows);
        setTotal(data?.total ?? rows.length);
      } catch (err) {
        setError(formatApiError(err));
        setList([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchList();
    return () => controller.abort();
  }, [page, onlyMyApprovals, statusFilter, pageSize, search, statusFilter]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      await fetchEmployees();
    })();
    return () => controller.abort();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // employee_id mat bhejo — backend token se nikaalega
      await api.post("/api/v1/attendance/special-request", {
        request_type: form.request_type,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason || null,
        location_name: form.location_name || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      setSuccess("Special request submitted successfully");
      setForm({
        request_type: "wfh",
        start_date: "",
        end_date: "",
        reason: "",
        location_name: "",
        latitude: "",
        longitude: "",
      });
      setPage(1);
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const approve = async (id) => {
    setActionLoading(id);
    setError("");
    setSuccess("");
    try {
      await api.put(`/api/v1/attendance/special-request/${id}/approve`);
      setSuccess("Request approved");
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const openReject = (id) => {
    setRejectId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectId) return;
    setActionLoading(rejectId);
    setError("");
    setSuccess("");
    try {
      await api.put(`/api/v1/attendance/special-request/${rejectId}/reject`, {
        decision_reason: rejectReason || null,
      });
      setSuccess("Request rejected");
      setShowRejectModal(false);
      setRejectId(null);
      setRejectReason("");
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => e.employee_id === employeeId);
    if (!emp) return employeeId || "—";
    return emp.first_name
      ? `${emp.first_name} ${emp.last_name || ""}`.trim()
      : emp.name || employeeId;
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Special Requests</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Work From Home • On Duty • Outdoor — auto assigned to your reporting manager
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* New Request Form — NO employee dropdown */}
      <div className="mb-5 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#374151]">New Request</h2>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Request will be created for the currently logged-in employee
          </p>
        </div>
        <form onSubmit={submit} className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <select
            value={form.request_type}
            onChange={(e) => setForm((p) => ({ ...p, request_type: e.target.value }))}
            className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          >
            <option value="wfh">Work From Home</option>
            <option value="on_duty">On Duty</option>
            <option value="outdoor">Outdoor</option>
          </select>

          <input
            required
            type="date"
            value={form.start_date}
            onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
            className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          />
          <input
            required
            type="date"
            value={form.end_date}
            onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
            className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          />
          <input
            placeholder="Location name (optional)"
            value={form.location_name}
            onChange={(e) => setForm((p) => ({ ...p, location_name: e.target.value }))}
            className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          />
          <input
            placeholder="Latitude (optional)"
            value={form.latitude}
            onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
            className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          />
          <input
            placeholder="Longitude (optional)"
            value={form.longitude}
            onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
            className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          />
          <input
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
            className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] sm:col-span-2"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:opacity-60 sm:w-fit"
          >
            {saving ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* List Card */}
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  fetchList();
                }
              }}
              placeholder="Search employee id..."
              className="w-full max-w-xs rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] sm:w-48"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#374151]">
              <input
                type="checkbox"
                checked={onlyMyApprovals}
                onChange={(e) => {
                  setOnlyMyApprovals(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-[#d1d5db] text-[#E42527] focus:ring-[#E42527]"
              />
              My team only
            </label>
          </div>
          <div className="text-sm text-[#6b7280]">
            {total} request{total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">No requests found</div>
          ) : (
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">From</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">To</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Location</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Reason</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Approver</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((r, i) => {
                  const isPending = (r.status || "").toUpperCase() === "PENDING";
                  return (
                    <tr key={r.request_id || i} className="hover:bg-[#fafafa]">
                      <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">
                        {getEmployeeName(r.employee_id)}
                      </td>
                      <td className="px-5 py-3.5 uppercase text-[#6b7280]">
                        {(r.request_type || "").replace("_", " ")}
                      </td>
                      <td className="px-5 py-3.5 text-[#6b7280]">{formatDate(r.start_date)}</td>
                      <td className="px-5 py-3.5 text-[#6b7280]">{formatDate(r.end_date)}</td>
                      <td
                        className="max-w-[140px] truncate px-5 py-3.5 text-[#6b7280]"
                        title={r.location_name || ""}
                      >
                        {r.location_name || "—"}
                      </td>
                      <td
                        className="max-w-[160px] truncate px-5 py-3.5 text-[#6b7280]"
                        title={r.reason || ""}
                      >
                        {r.reason || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(
                            r.status
                          )}`}
                        >
                          {(r.status || "pending").toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#6b7280]">
                        {r.approver_id || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approve(r.request_id)}
                              disabled={actionLoading === r.request_id}
                              className="rounded px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                            >
                              {actionLoading === r.request_id ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() => openReject(r.request_id)}
                              disabled={actionLoading === r.request_id}
                              className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#9ca3af]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3">
            <p className="text-sm text-[#6b7280]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="border-b border-[#e5e7eb] px-5 py-4">
              <h3 className="text-base font-semibold text-[#1a1a1a]">Reject Request</h3>
              <p className="mt-1 text-sm text-[#6b7280]">
                Optionally add a reason for rejection
              </p>
            </div>
            <div className="px-5 py-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Decision reason (optional)"
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-5 py-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectId(null);
                  setRejectReason("");
                }}
                className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={actionLoading === rejectId}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {actionLoading === rejectId ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}