"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/lib/api";

const initialForm = {
  leave_policy_id: "",
  level: 1,
  approver_role: "",
  trigger_min_days: 0,
  auto_approve: false,
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

  return data?.items ?? data?.results ?? data?.policies ?? response?.data?.policies ?? [];
};

const getPolicyId = (policy) =>
  policy.leave_policy_id || policy.id || policy._id;

const getPolicyName = (policy) =>
  policy.policy_name || policy.name || getPolicyId(policy);

export default function LeaveApprovalWorkflowsPage() {
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

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await api.get("/api/v1/leave/policies", {
          params: { page: 1, page_size: 100 },
        });
        const policies = getItems(response);
        setLeavePolicies(policies);

        if (!leavePolicyId && policies.length) {
          setLeavePolicyId(getPolicyId(policies[0]) || "");
        }
      } catch (err) {
        setError(formatApiError(err));
        setLeavePolicies([]);
      }
    };

    fetchPolicies();
  }, [leavePolicyId]);

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
        `/api/v1/get/leave/approval/workflow/${leavePolicyId}`,
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
    setEditId(item.id || item.workflow_id);
    setFormData({
      ...initialForm,
      leave_policy_id: leavePolicyId,
      level: item.level ?? 1,
      approver_role: item.approver_role || "",
      trigger_min_days: item.trigger_min_days ?? 0,
      auto_approve: !!item.auto_approve,
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
        level: Number(formData.level) || 1,
        approver_role: formData.approver_role,
        trigger_min_days: Number(formData.trigger_min_days) || 0,
        auto_approve: !!formData.auto_approve,
      };

      if (editId) {
        await api.put(
          `/api/v1/update/leave/approval/workflow/${editId}`,
          payload
        );
      } else {
        await api.post("/api/v1/add/leave/approval/workflow", payload);
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
            Leave Approval Workflows
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Configure multi-level approval workflow for this leave policy
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Add Workflow Level
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
            placeholder="Search workflows..."
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#E42527] focus:bg-white"
          />
          <span className="text-sm text-slate-500">{total} levels</span>
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
              No workflow levels found
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 font-medium text-slate-500">#</th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Level
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Approver Role
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Trigger Min Days
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500">
                    Auto Approve
                  </th>
                  <th className="px-5 py-3 font-medium text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((item, i) => (
                  <tr
                    key={item.id || item.workflow_id || i}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5 text-slate-500">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      Level {item.level ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.approver_role ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.trigger_min_days ?? "—"} days
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.auto_approve ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          Yes
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          No
                        </span>
                      )}
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
                {editId ? "Edit Workflow Level" : "Add Workflow Level"}
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
                      Level *
                    </label>
                    <input
                      required
                      type="number"
                      min={1}
                      value={formData.level}
                      onChange={(e) => handleChange("level", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Approver Role *
                    </label>
                    <input
                      required
                      value={formData.approver_role}
                      onChange={(e) =>
                        handleChange("approver_role", e.target.value)
                      }
                      placeholder="e.g. Manager, HR, Director"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Trigger Min Days *
                    </label>
                    <input
                      required
                      type="number"
                      min={0}
                      value={formData.trigger_min_days}
                      onChange={(e) =>
                        handleChange("trigger_min_days", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Minimum days before leave start when this level triggers.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!formData.auto_approve}
                        onChange={(e) =>
                          handleChange("auto_approve", e.target.checked)
                        }
                        className="rounded border-slate-300 text-[#E42527] focus:ring-[#E42527]"
                      />
                      <span className="font-medium">Auto Approve</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      If checked, requests at this level will be auto-approved without manual intervention.
                    </p>
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