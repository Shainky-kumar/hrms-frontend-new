"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

const APPROVAL_TYPES = [
  "leave",
  "attendance",
  "overtime",
  "expense",
  "travel",
  "loan",
  "letter",
];

const APPROVER_TYPES = [
  { value: "reporting_manager", label: "Reporting Manager" },
  { value: "skip_level_manager", label: "Skip Level Manager" },
  { value: "department_head", label: "Department Head" },
  { value: "specific_user", label: "Specific User" },
  { value: "role", label: "Role" },
];

const initialLevel = {
  level: 1,
  approver_type: "reporting_manager",
  specific_user_id: "",
  role_name: "",
  auto_approve: false,
  is_mandatory: true,
};

const initialForm = {
  name: "",
  approval_type: "leave",
  description: "",
  approval_mode: "sequential",
  priority: 100,
  is_active: true,
  levels: [{ ...initialLevel }],
};

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(" • ");
  return err?.message || "Something went wrong";
};

export default function ApprovalWorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [viewing, setViewing] = useState(null);

  // ========== FETCH LIST ==========
  const fetchWorkflows = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/approvals/workflows");
      const data = res?.data || [];
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWorkflows();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // ========== FORM HANDLERS ==========
  const openCreate = () => {
    setFormData({ ...initialForm, levels: [{ ...initialLevel }] });
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEdit = async (wf) => {
    try {
      const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
      const data = res?.data || wf;

      setFormData({
        name: data.name || "",
        approval_type: data.approval_type || "leave",
        description: data.description || "",
        approval_mode: data.approval_mode || "sequential",
        priority: data.priority || 100,
        is_active: data.is_active ?? true,
        levels:
          data.levels?.length > 0
            ? data.levels.map((l) => ({
                level: l.level,
                approver_type: l.approver_type,
                specific_user_id: l.specific_user_id || "",
                role_name: l.role_name || "",
                auto_approve: l.auto_approve || false,
                is_mandatory: l.is_mandatory ?? true,
              }))
            : [{ ...initialLevel }],
      });
      setEditingId(wf.workflow_id);
      setShowForm(true);
      setError("");
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (index, field, value) => {
    setFormData((prev) => {
      const levels = [...prev.levels];
      levels[index] = { ...levels[index], [field]: value };
      return { ...prev, levels };
    });
  };

  const addLevel = () => {
    setFormData((prev) => ({
      ...prev,
      levels: [
        ...prev.levels,
        {
          ...initialLevel,
          level: prev.levels.length + 1,
        },
      ],
    }));
  };

  const removeLevel = (index) => {
    if (formData.levels.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels
        .filter((_, i) => i !== index)
        .map((l, i) => ({ ...l, level: i + 1 })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        levels: formData.levels.map((l, idx) => ({
          ...l,
          level: idx + 1,
        })),
      };

      if (editingId) {
        await api.put(`/api/v1/approvals/workflows/${editingId}`, payload);
        setSuccess("Workflow updated successfully");
      } else {
        await api.post("/api/v1/approvals/workflows", payload);
        setSuccess("Workflow created successfully");
      }

      closeForm();
      await fetchWorkflows();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const openView = async (wf) => {
    try {
      const res = await api.get(`/api/v1/approvals/workflows/${wf.workflow_id}`);
      setViewing(res?.data || wf);
    } catch {
      setViewing(wf);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Approval Workflows</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create & manage multi-level approval workflows
            </p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91f21]"
          >
            + Create Workflow
          </button>
        </div>

        {error && !showForm && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && !showForm && (
          <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#E42527]" />
            </div>
          ) : workflows.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              No workflows found. Create your first workflow.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3.5 font-semibold text-slate-500">Name</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500">Type</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500">Mode</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500">Levels</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500">Priority</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {workflows.map((wf) => (
                  <tr key={wf.workflow_id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">{wf.name}</td>
                    <td className="px-5 py-4 capitalize">{wf.approval_type}</td>
                    <td className="px-5 py-4 capitalize">{wf.approval_mode}</td>
                    <td className="px-5 py-4">{wf.levels_count || 0}</td>
                    <td className="px-5 py-4">{wf.priority}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          wf.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {wf.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openView(wf)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEdit(wf)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ==================== CREATE / EDIT MODAL ==================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 backdrop-blur-sm">
          <div className="mb-12 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingId ? "Edit Workflow" : "Create Workflow"}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Configure multi-level approval
                </p>
              </div>
              <button onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[75vh] space-y-6 overflow-y-auto px-6 py-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Workflow Name *
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g. Standard Leave Approval"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527] focus:ring-2 focus:ring-[#E42527]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Approval Type *
                    </label>
                    <select
                      required
                      value={formData.approval_type}
                      onChange={(e) => handleChange("approval_type", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      {APPROVAL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Approval Mode
                    </label>
                    <select
                      value={formData.approval_mode}
                      onChange={(e) => handleChange("approval_mode", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    >
                      <option value="sequential">Sequential</option>
                      <option value="parallel">Parallel</option>
                      <option value="any_one">Any One</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleChange("is_active", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
                    />
                    <label className="text-sm font-medium text-slate-700">Active</label>
                  </div>
                </div>

                {/* Levels */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Approval Levels</h3>
                    <button
                      type="button"
                      onClick={addLevel}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      + Add Level
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.levels.map((level, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Level {index + 1}
                          </span>
                          {formData.levels.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLevel(index)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Approver Type
                            </label>
                            <select
                              value={level.approver_type}
                              onChange={(e) =>
                                handleLevelChange(index, "approver_type", e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                            >
                              {APPROVER_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {level.approver_type === "role" && (
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                Role Name
                              </label>
                              <input
                                value={level.role_name}
                                onChange={(e) =>
                                  handleLevelChange(index, "role_name", e.target.value)
                                }
                                placeholder="hr, finance, admin..."
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                              />
                            </div>
                          )}

                          {level.approver_type === "specific_user" && (
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                User ID
                              </label>
                              <input
                                value={level.specific_user_id}
                                onChange={(e) =>
                                  handleLevelChange(index, "specific_user_id", e.target.value)
                                }
                                placeholder="User ID"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E42527]"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-4 sm:col-span-2">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={level.auto_approve}
                                onChange={(e) =>
                                  handleLevelChange(index, "auto_approve", e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
                              />
                              Auto Approve
                            </label>

                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={level.is_mandatory}
                                onChange={(e) =>
                                  handleLevelChange(index, "is_mandatory", e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-[#E42527]"
                              />
                              Mandatory
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#E42527] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update Workflow" : "Create Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== VIEW MODAL ==================== */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800">{viewing.name}</h2>
              <button
                onClick={() => setViewing(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Type</p>
                  <p className="font-medium capitalize">{viewing.approval_type}</p>
                </div>
                <div>
                  <p className="text-slate-500">Mode</p>
                  <p className="font-medium capitalize">{viewing.approval_mode}</p>
                </div>
                <div>
                  <p className="text-slate-500">Priority</p>
                  <p className="font-medium">{viewing.priority}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="font-medium">{viewing.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 font-semibold text-slate-800">Levels</p>
                <div className="space-y-2">
                  {(viewing.levels || []).map((lvl) => (
                    <div
                      key={lvl.level}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">Level {lvl.level}</span>
                      <span className="capitalize text-slate-600">
                        {lvl.approver_type?.replaceAll("_", " ")}
                        {lvl.auto_approve && (
                          <span className="ml-2 text-xs text-emerald-600">(Auto)</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}