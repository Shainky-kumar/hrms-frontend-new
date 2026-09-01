"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/lib/api";

const initialForm = {
  leave_policy_id: "",
  leave_type_id_a: "",
  leave_type_id_b: "",
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

const getItems = (response) => {
  const data = response?.data?.data ?? response?.data ?? [];

  if (Array.isArray(data)) return data;

  return data?.items ?? data?.results ?? data?.policies ?? response?.data?.policies ?? data?.leave_types ?? response?.data?.leave_types ?? [];
};

const getPolicyId = (policy) =>
  policy.leave_policy_id || policy.id || policy._id;

const getPolicyName = (policy) =>
  policy.policy_name || policy.name || getPolicyId(policy);

const getLeaveTypeId = (leaveType) =>
  leaveType.leave_type_id || leaveType.id || leaveType._id;

const getLeaveTypeName = (leaveType) =>
  leaveType.leave_type_name || leaveType.name || leaveType.type_name || getLeaveTypeId(leaveType);

const fetchLeaveTypes = async () => {
  const endpoints = [
    "/api/v1/get/leave/type",
    "/api/v1/leave/types",
    "/api/v1/get/leave/types",
    "/api/v1/get/leave/type/list",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint);
      return getItems(response);
    } catch {
    }
  }

  return [];
};

export default function LeaveClubbingRestrictionsPage() {
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
  const [leavePolicyId, setLeavePolicyId] = useState("");
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [policyResponse, types] = await Promise.all([
          api.get("/api/v1/leave/policies", {
            params: { page: 1, page_size: 100 },
          }),
          fetchLeaveTypes(),
        ]);
        const policies = getItems(policyResponse);
        const policyTypes = Array.from(
          new Map(
            policies
              .map((policy) => {
                const id = policy.leave_type_id || policy.leave_type?.leave_type_id;

                return id
                  ? [id, {
                      leave_type_id: id,
                      leave_type_name: policy.leave_type_name || policy.leave_type?.name || id,
                    }]
                  : null;
              })
              .filter(Boolean)
          ).values()
        );

        setLeavePolicies(policies);
        setLeaveTypes(types.length ? types : policyTypes);
      } catch (err) {
        setError(formatApiError(err));
        setLeavePolicies([]);
        setLeaveTypes([]);
      }
    };

    fetchOptions();
  }, []);

  const fetchData = useCallback(async () => {
    if (!leavePolicyId) {
      setList([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/api/v1/leave/clubbing/restriction/${leavePolicyId}`,
        {
          params: { page, page_size: pageSize, search },
        }
      );
      const data = res.data?.data ?? res.data ?? [];
      const items = Array.isArray(data) ? data : data?.items ?? data?.results ?? [];
      setList(items);
      setTotal(res.data?.total ?? res.data?.count ?? items.length);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [leavePolicyId, page, pageSize, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.id || item.restriction_id);
    setFormData({
      ...initialForm,
      leave_policy_id: leavePolicyId,
      leave_type_id_a: item.leave_type_id_a || "",
      leave_type_id_b: item.leave_type_id_b || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        leave_policy_id: leavePolicyId || formData.leave_policy_id,
        leave_type_id_a: formData.leave_type_id_a,
        leave_type_id_b: formData.leave_type_id_b,
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
      setFormData({ ...initialForm, leave_policy_id: leavePolicyId });
      setEditId(null);
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Leave Clubbing Restrictions
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Define which leave types cannot be clubbed together
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Add Restriction
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
            placeholder="Search restrictions..."
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
          />
          <span className="text-sm text-slate-500">{total} restrictions</span>
        </div>

        {error && !showForm && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading...
            </div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-500">
              No restrictions found
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
                  <th className="px-5 py-3 font-medium text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((item, i) => (
                  <tr
                    key={item.id || item.restriction_id || i}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5 text-slate-500">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {item.leave_type_id_a ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.leave_type_id_b ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-[2px]">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editId ? "Edit Clubbing Restriction" : "Add Clubbing Restriction"}
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
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Leave Policy *
                    </label>
                    <select
                      required
                      value={leavePolicyId}
                      onChange={(e) => {
                        setLeavePolicyId(e.target.value);
                        handleChange("leave_policy_id", e.target.value);
                        setPage(1);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-1 focus:ring-[#E42527]/30"
                    >
                      <option value="">Select leave policy</option>
                      {leavePolicies.map((policy) => {
                        const id = getPolicyId(policy);

                        return id ? (
                          <option key={id} value={id}>
                            {getPolicyName(policy)}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>

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
                      <option value="">Select leave type</option>
                      {leaveTypes.map((leaveType) => {
                        const id = getLeaveTypeId(leaveType);

                        return id ? (
                          <option key={id} value={id}>
                            {getLeaveTypeName(leaveType)}
                          </option>
                        ) : null;
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
                      <option value="">Select leave type</option>
                      {leaveTypes.map((leaveType) => {
                        const id = getLeaveTypeId(leaveType);

                        return id ? (
                          <option key={id} value={id}>
                            {getLeaveTypeName(leaveType)}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  This restriction prevents employees from combining Leave Type A and Leave Type B in a single leave request.
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