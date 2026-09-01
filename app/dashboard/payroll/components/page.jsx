"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

// ---------------------------------------------
// Matches backend:
//   GET  /api/v1/payroll/components?is_active=bool
//   POST /api/v1/payroll/components
// Body matches schemas.SalaryComponentCreate exactly.
// ---------------------------------------------

const COMPONENT_TYPES = [
  { value: "earning", label: "Earning" },
  { value: "deduction", label: "Deduction" },
  { value: "employer_contribution", label: "Employer Contribution" },
  { value: "reimbursement", label: "Reimbursement" },
];

const CALCULATION_METHODS = [
  { value: "flat", label: "Flat" },
  { value: "percentage", label: "Percentage" },
  { value: "slab", label: "Slab" },
  { value: "formula", label: "Formula" },
  { value: "attendance_based", label: "Attendance Based" },
];

const DEFAULT_FORM = {
  component_name: "",
  component_code: "",
  component_type: "earning",
  calculation_method: "flat",
  is_statutory: false,
  is_taxable: true,
  is_part_of_ctc: true,
  is_part_of_gross: true,
  is_pro_rata: true,
  is_variable: false,
  formula: "",
  display_order: 100,
  is_active: true,
};

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") return detail.msg || detail.message || "Request failed";
  return err?.message || "Something went wrong";
}

function toArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export default function ComponentsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // active | inactive
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    fetchList();
  }, [statusFilter]);

  async function fetchList() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/payroll/components", {
        params: { is_active: statusFilter === "active" },
      });
      setList(toArray(res?.data ?? res));
    } catch (err) {
      setError(getErrorMessage(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.component_name.trim() || !form.component_code.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        formula: form.calculation_method === "formula" ? form.formula || null : null,
        display_order: Number(form.display_order) || 100,
      };
      await api.post("/api/v1/payroll/components", payload);
      setShowForm(false);
      setForm(DEFAULT_FORM);
      await fetchList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = list.filter((item) =>
    (item?.component_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item?.component_code || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Salary Components</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Manage earning, deduction & contribution components</p>
        </div>
        <button
          onClick={() => { setError(""); setForm(DEFAULT_FORM); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Add Component
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
      )}

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full max-w-xs rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
            />
            <div className="flex rounded-md border border-[#d1d5db] p-0.5 text-sm">
              {["active", "inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded px-3 py-1 capitalize ${
                    statusFilter === s ? "bg-[#E42527] text-white" : "text-[#6b7280]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <span className="text-sm text-[#6b7280]">{filtered.length} items</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#6b7280]">No components found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Name</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Code</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Calc. Method</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Taxable</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Statutory</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Part of CTC</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filtered.map((item) => (
                  <tr key={item.salary_component_id || item.component_code} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">{item.component_name}</td>
                    <td className="px-5 py-3.5 text-[#6b7280]">{item.component_code}</td>
                    <td className="px-5 py-3.5 capitalize text-[#6b7280]">{(item.component_type || "").replace(/_/g, " ")}</td>
                    <td className="px-5 py-3.5 capitalize text-[#6b7280]">{(item.calculation_method || "").replace(/_/g, " ")}</td>
                    <td className="px-5 py-3.5 text-[#6b7280]">{item.is_taxable ? "Yes" : "No"}</td>
                    <td className="px-5 py-3.5 text-[#6b7280]">{item.is_statutory ? "Yes" : "No"}</td>
                    <td className="px-5 py-3.5 text-[#6b7280]">{item.is_part_of_ctc ? "Yes" : "No"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">Add Component</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6b7280] hover:text-[#1a1a1a]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Component Name *</label>
                  <input
                    required
                    value={form.component_name}
                    onChange={(e) => updateField("component_name", e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Component Code *</label>
                  <input
                    required
                    value={form.component_code}
                    onChange={(e) => updateField("component_code", e.target.value.toUpperCase())}
                    placeholder="e.g. BASIC, HRA"
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <select
                    value={form.component_type}
                    onChange={(e) => updateField("component_type", e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
                  >
                    {COMPONENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Calculation Method</label>
                  <select
                    value={form.calculation_method}
                    onChange={(e) => updateField("calculation_method", e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
                  >
                    {CALCULATION_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {form.calculation_method === "formula" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Formula</label>
                  <input
                    value={form.formula}
                    onChange={(e) => updateField("formula", e.target.value)}
                    placeholder="e.g. basic * 0.4"
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm font-mono focus:border-[#E42527] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium">Display Order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => updateField("display_order", e.target.value)}
                  className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm sm:w-32 focus:border-[#E42527] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md bg-[#f9fafb] p-3 sm:grid-cols-3">
                {[
                  ["is_taxable", "Taxable"],
                  ["is_statutory", "Statutory"],
                  ["is_part_of_ctc", "Part of CTC"],
                  ["is_part_of_gross", "Part of Gross"],
                  ["is_pro_rata", "Pro-rata"],
                  ["is_variable", "Variable"],
                  ["is_active", "Active"],
                ].map(([field, label]) => (
                  <label key={field} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form[field]}
                      onChange={(e) => updateField(field, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>

              {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}

              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60">
                  {submitting ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}