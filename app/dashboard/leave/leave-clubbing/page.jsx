"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import {
  fetchLeaveTypes as fetchLeaveTypesShared,
  getLeaveTypeId,
  getLeaveTypeName,
} from "@/app/lib/leaveTypes";
import { useAuthStore } from "@/app/store/authStore";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const HR_ROLES = new Set([
  "hr",
  "hr_manager",
  "hr-manager",
  "admin",
  "super_admin",
  "super-admin",
  "superadmin",
  "owner",
  "payroll_officer",
  "payroll-officer",
]);

const initialForm = {
  leave_type_id_a: "",
  leave_type_id_b: "",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission for this action.";
  if (err?.response?.status === 409) return "This restriction already exists.";
  return err?.message || "Something went wrong";
};

const isCancel = (err) =>
  err?.name === "CanceledError" ||
  err?.code === "ERR_CANCELED" ||
  err?.name === "AbortError";

const pickList = (response) => {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return (
    data?.items ??
    data?.results ??
    data?.policies ??
    data?.leave_policies ??
    data?.leave_types ??
    data?.restrictions ??
    []
  );
};

const hasHrAccess = (user) => {
  if (!user) return false;
  const roles = [
    user.role,
    ...(Array.isArray(user.roles) ? user.roles : []),
    ...(Array.isArray(user.user_roles) ? user.user_roles : []),
  ]
    .filter(Boolean)
    .map((r) =>
      String(typeof r === "string" ? r : r?.name || r?.role || r?.code || "")
        .toLowerCase()
        .trim()
    );
  return roles.some((r) => HR_ROLES.has(r));
};

const getPolicyId = (p) =>
  p?.leave_policy_id ?? p?.policy_id ?? p?.id ?? p?._id ?? "";

const getPolicyName = (p) =>
  p?.policy_name ?? p?.leave_policy_name ?? p?.name ?? getPolicyId(p);

const getRestrictionId = (item) =>
  item?.clubbing_id ??
  item?.restriction_id ??
  item?.leave_clubbing_id ??
  item?.id ??
  null;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LeaveClubbingRestrictionsPage() {
  const user = useAuthStore((state) => state.user);
  const isHrOrAdmin = useMemo(() => hasHrAccess(user), [user]);

  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leavePolicyId, setLeavePolicyId] = useState("");

  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [details, setDetails] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const abortRef = useRef(null);

  /* --------------- load policies + leave types once --------------- */
  useEffect(() => {
    let cancelled = false;
    setOptionsLoading(true);

    Promise.all([
      api
        .get("/api/v1/leave/policies", { params: { page: 1, page_size: 200 } })
        .then((res) => pickList(res))
        .catch(() => []),
      fetchLeaveTypesShared().catch(() => []),
    ])
      .then(([policies, types]) => {
        if (cancelled) return;
        setLeavePolicies(Array.isArray(policies) ? policies : []);
        setLeaveTypes(Array.isArray(types) ? types : []);

        // auto-select first policy so table is immediately useful
        const firstId = getPolicyId(policies?.[0]);
        if (firstId) setLeavePolicyId((prev) => prev || String(firstId));
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* --------------- debounce search --------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* --------------- reset page when policy changes --------------- */
  useEffect(() => {
    setPage(1);
  }, [leavePolicyId]);

  /* --------------- fetch restrictions --------------- */
  const fetchData = useCallback(async () => {
    if (!leavePolicyId) {
      setList([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/api/v1/leave/clubbing/restriction/${leavePolicyId}`,
        {
          params: {
            page,
            page_size: pageSize,
            ...(search ? { search } : {}),
          },
          signal: controller.signal,
        }
      );

      const payload = res.data?.data ?? res.data ?? {};
      const items = Array.isArray(payload)
        ? payload
        : payload?.items ??
          payload?.results ??
          payload?.restrictions ??
          payload?.clubbing_restrictions ??
          [];

      setList(Array.isArray(items) ? items : []);
      setTotal(
        res.data?.total ??
          res.data?.count ??
          payload?.total ??
          (Array.isArray(items) ? items.length : 0)
      );
    } catch (err) {
      if (isCancel(err)) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [leavePolicyId, page, pageSize, search]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData]);

  /* --------------- derived: type name lookup --------------- */
  const typeNameById = useMemo(() => {
    const map = new Map();
    leaveTypes.forEach((t) => {
      const id = getLeaveTypeId(t);
      if (id) map.set(String(id), getLeaveTypeName(t));
    });
    return map;
  }, [leaveTypes]);

  const getTypeName = useCallback(
    (id) => {
      if (!id) return "—";
      const found = typeNameById.get(String(id));
      if (found) return found;
      const s = String(id);
      return s.length > 12 ? `${s.slice(0, 8)}…` : s;
    },
    [typeNameById]
  );

  /* --------------- derived: existing pairs (for duplicate check) --- */
  const existingPairs = useMemo(() => {
    const set = new Set();
    list.forEach((item) => {
      const a = String(item.leave_type_id_a ?? "");
      const b = String(item.leave_type_id_b ?? "");
      if (a && b) {
        const key = [a, b].sort().join("|");
        set.add(key);
      }
    });
    return set;
  }, [list]);

  /* --------------- form handlers --------------- */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    if (!leavePolicyId) {
      setError("Please select a leave policy first.");
      return;
    }
    setEditId(null);
    setFormData(initialForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(getRestrictionId(item));
    setFormData({
      leave_type_id_a: item.leave_type_id_a || "",
      leave_type_id_b: item.leave_type_id_b || "",
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setError("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const { leave_type_id_a, leave_type_id_b } = formData;

    if (!leave_type_id_a || !leave_type_id_b) {
      setError("Please select both leave types.");
      return;
    }
    if (leave_type_id_a === leave_type_id_b) {
      setError("Leave Type A and Leave Type B must be different.");
      return;
    }

    // duplicate check (only for new, ignore current edit row)
    if (!editId) {
      const key = [leave_type_id_a, leave_type_id_b].sort().join("|");
      if (existingPairs.has(key)) {
        setError("This restriction already exists for the selected policy.");
        return;
      }
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        leave_policy_id: leavePolicyId,
        leave_type_id_a,
        leave_type_id_b,
      };

      if (editId) {
        await api.put(
          `/api/v1/leave/clubbing/restriction/${editId}`,
          payload
        );
      } else {
        await api.post("/api/v1/leave/clubbing/restriction", payload);
      }

      setShowForm(false);
      setFormData(initialForm);
      setEditId(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const item = confirmDelete;
    if (!item) return;
    const id = getRestrictionId(item);
    if (!id) {
      setConfirmDelete(null);
      setError("Cannot delete: missing restriction id.");
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/v1/leave/clubbing/restriction/${id}`);
      setConfirmDelete(null);
      setDetails(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selectedPolicyName = useMemo(() => {
    const found = leavePolicies.find(
      (p) => String(getPolicyId(p)) === String(leavePolicyId)
    );
    return found ? getPolicyName(found) : "";
  }, [leavePolicies, leavePolicyId]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Leave Clubbing Restrictions
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Define which leave types cannot be clubbed together in a single request.
          </p>
        </div>
        {isHrOrAdmin && (
          <button
            type="button"
            onClick={openAdd}
            disabled={!leavePolicyId}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-50"
          >
            + Add Restriction
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* ---------- filters ---------- */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={leavePolicyId}
              onChange={(e) => setLeavePolicyId(e.target.value)}
              disabled={optionsLoading}
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white disabled:opacity-60"
            >
              <option value="">
                {optionsLoading ? "Loading policies…" : "Select leave policy"}
              </option>
              {leavePolicies.map((p) => {
                const id = getPolicyId(p);
                if (!id) return null;
                return (
                  <option key={String(id)} value={String(id)}>
                    {getPolicyName(p)}
                  </option>
                );
              })}
            </select>

            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search restrictions…"
              autoComplete="off"
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {leavePolicyId
                ? `${total} restriction${total === 1 ? "" : "s"}`
                : "—"}
            </span>
            {leavePolicyId && (
              <button
                type="button"
                onClick={fetchData}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Refresh
              </button>
            )}
          </div>
        </div>

        {error && !showForm && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ---------- body ---------- */}
        <div className="overflow-x-auto">
          {!leavePolicyId ? (
            <div className="py-20 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700">
                Select a leave policy to view clubbing restrictions
              </p>
              <p className="mt-2">
                Restrictions are defined per policy.
              </p>
            </div>
          ) : loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading…
            </div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700">
                No clubbing restrictions
              </p>
              <p className="mt-2">
                {selectedPolicyName
                  ? `No restrictions defined for "${selectedPolicyName}".`
                  : "No restrictions defined for this policy."}
                {isHrOrAdmin && " Click Add Restriction to create one."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 font-medium text-slate-500">#</th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Leave Type A
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Leave Type B
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((item, i) => (
                  <tr
                    key={getRestrictionId(item) || i}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5 text-slate-500">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {getTypeName(item.leave_type_id_a)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {getTypeName(item.leave_type_id_b)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => setDetails(item)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          View
                        </button>
                        {isHrOrAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(item)}
                              className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ---------- pagination ---------- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  {editId
                    ? "Edit Clubbing Restriction"
                    : "Add Clubbing Restriction"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Policy: {selectedPolicyName || leavePolicyId}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Type A *
                    </label>
                    <select
                      required
                      value={formData.leave_type_id_a}
                      onChange={(e) =>
                        handleChange("leave_type_id_a", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="">
                        {leaveTypes.length === 0
                          ? "No leave types available"
                          : "Select leave type"}
                      </option>
                      {leaveTypes.map((t) => {
                        const id = getLeaveTypeId(t);
                        if (!id) return null;
                        return (
                          <option
                            key={String(id)}
                            value={String(id)}
                            disabled={
                              String(id) === String(formData.leave_type_id_b)
                            }
                          >
                            {getLeaveTypeName(t)}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Type B *
                    </label>
                    <select
                      required
                      value={formData.leave_type_id_b}
                      onChange={(e) =>
                        handleChange("leave_type_id_b", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="">
                        {leaveTypes.length === 0
                          ? "No leave types available"
                          : "Select leave type"}
                      </option>
                      {leaveTypes.map((t) => {
                        const id = getLeaveTypeId(t);
                        if (!id) return null;
                        return (
                          <option
                            key={String(id)}
                            value={String(id)}
                            disabled={
                              String(id) === String(formData.leave_type_id_a)
                            }
                          >
                            {getLeaveTypeName(t)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Employees cannot combine Leave Type A and Leave Type B in a
                  single leave request for this policy.
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
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DETAILS MODAL ================= */}
      {details && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Clubbing restriction
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                  {getTypeName(details.leave_type_id_a)} ✕{" "}
                  {getTypeName(details.leave_type_id_b)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Policy", selectedPolicyName || leavePolicyId],
                  ["Leave Type A", getTypeName(details.leave_type_id_a)],
                  ["Leave Type B", getTypeName(details.leave_type_id_b)],
                  ["Restriction ID", getRestrictionId(details)],
                  ["Created At", details.created_at || details.createdAt],
                  ["Updated At", details.updated_at || details.updatedAt],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-slate-50 px-3 py-2.5"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {isHrOrAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const item = details;
                      setDetails(null);
                      setConfirmDelete(item);
                    }}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const item = details;
                      setDetails(null);
                      openEdit(item);
                    }}
                    className="rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Delete clubbing restriction?
              </h2>
            </div>
            <div className="px-5 py-5 text-sm text-slate-600">
              This will remove the restriction between{" "}
              <span className="font-medium text-slate-800">
                {getTypeName(confirmDelete.leave_type_id_a)}
              </span>{" "}
              and{" "}
              <span className="font-medium text-slate-800">
                {getTypeName(confirmDelete.leave_type_id_b)}
              </span>
              . This action cannot be undone.
              {error && (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-red-600">
                  {error}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}