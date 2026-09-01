// "use client";

// import { useState } from "react";
// import { api } from "@/lib/api";

// // ---------------------------------------------
// // Matches backend:
// //   POST /api/v1/payroll/deduction-rules
// // Body matches schemas.DeductionRuleCreate exactly.
// // ---------------------------------------------

// const CALCULATION_TYPES = [
//   { value: "percentage", label: "Percentage" },
//   { value: "flat", label: "Flat" },
//   { value: "slab", label: "Slab" },
//   { value: "formula", label: "Formula" },
//   { value: "attendance_based", label: "Attendance Based" },
// ];

// const EMPTY_SLAB_ROW = { min_wage: "", max_wage: "", value: "" };

// const DEFAULT_FORM = {
//   deduction_name: "",
//   code: "",
//   calculation_type: "percentage",
//   deducted_value: "",
//   wage_ceiling: "",
//   wage_floor: "",
//   is_employer_contribution: false,
//   is_statutory: true,
//   effective_from: "",
//   effective_to: "",
// };

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// }

// export default function DeductionRulesPage() {
//   const [form, setForm] = useState(DEFAULT_FORM);
//   const [slabRows, setSlabRows] = useState([{ ...EMPTY_SLAB_ROW }]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   function updateField(field, value) {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   }

//   function updateSlabRow(index, field, value) {
//     const updated = [...slabRows];
//     updated[index][field] = value;
//     setSlabRows(updated);
//   }

//   function addSlabRow() {
//     setSlabRows([...slabRows, { ...EMPTY_SLAB_ROW }]);
//   }

//   function removeSlabRow(index) {
//     setSlabRows(slabRows.filter((_, i) => i !== index));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       const isSlab = form.calculation_type === "slab";
//       await api.post("/api/v1/payroll/deduction-rules", {
//         deduction_name: form.deduction_name,
//         code: form.code,
//         calculation_type: form.calculation_type,
//         deducted_value: !isSlab && form.deducted_value ? Number(form.deducted_value) : null,
//         wage_ceiling: form.wage_ceiling ? Number(form.wage_ceiling) : null,
//         wage_floor: form.wage_floor ? Number(form.wage_floor) : null,
//         slab_config: isSlab
//           ? slabRows
//               .filter((r) => r.min_wage !== "" || r.max_wage !== "" || r.value !== "")
//               .map((r) => ({
//                 min_wage: Number(r.min_wage) || 0,
//                 max_wage: r.max_wage ? Number(r.max_wage) : null,
//                 value: Number(r.value) || 0,
//               }))
//           : null,
//         is_employer_contribution: form.is_employer_contribution,
//         is_statutory: form.is_statutory,
//         effective_from: form.effective_from,
//         effective_to: form.effective_to || null,
//       });
//       setSuccess("Deduction rule created successfully");
//       setForm(DEFAULT_FORM);
//       setSlabRows([{ ...EMPTY_SLAB_ROW }]);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Deduction Rules</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">Configure PF, ESI, PT, Tax and other statutory deductions</p>
//       </div>

//       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
//       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

//       <div className="max-w-xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="mb-1 block text-sm font-medium">Rule Name *</label>
//             <input
//               required
//               value={form.deduction_name}
//               onChange={(e) => updateField("deduction_name", e.target.value)}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//               placeholder="e.g. Employee PF"
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-medium">Code *</label>
//             <input
//               required
//               value={form.code}
//               onChange={(e) => updateField("code", e.target.value.toUpperCase())}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none"
//               placeholder="e.g. PF"
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-medium">Calculation Type</label>
//             <select
//               value={form.calculation_type}
//               onChange={(e) => updateField("calculation_type", e.target.value)}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//             >
//               {CALCULATION_TYPES.map((t) => (
//                 <option key={t.value} value={t.value}>{t.label}</option>
//               ))}
//             </select>
//           </div>

//           {form.calculation_type === "slab" ? (
//             <div>
//               <div className="mb-2 flex items-center justify-between">
//                 <label className="text-sm font-medium">Slab Config</label>
//                 <button type="button" onClick={addSlabRow} className="text-sm text-[#E42527] hover:underline">
//                   + Add Slab
//                 </button>
//               </div>
//               {slabRows.map((row, index) => (
//                 <div key={index} className="mb-2 flex flex-wrap items-center gap-2">
//                   <input
//                     type="number"
//                     placeholder="Min wage"
//                     value={row.min_wage}
//                     onChange={(e) => updateSlabRow(index, "min_wage", e.target.value)}
//                     className="w-28 rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max wage (blank = no limit)"
//                     value={row.max_wage}
//                     onChange={(e) => updateSlabRow(index, "max_wage", e.target.value)}
//                     className="w-44 rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Value"
//                     value={row.value}
//                     onChange={(e) => updateSlabRow(index, "value", e.target.value)}
//                     className="w-24 rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
//                   />
//                   {slabRows.length > 1 && (
//                     <button type="button" onClick={() => removeSlabRow(index)} className="text-sm text-red-500">
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div>
//               <label className="mb-1 block text-sm font-medium">
//                 Value {form.calculation_type === "percentage" ? "(%)" : ""}
//               </label>
//               <input
//                 type="number"
//                 value={form.deducted_value}
//                 onChange={(e) => updateField("deducted_value", e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                 placeholder="e.g. 12"
//               />
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1 block text-sm font-medium">Wage Floor (optional)</label>
//               <input
//                 type="number"
//                 value={form.wage_floor}
//                 onChange={(e) => updateField("wage_floor", e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                 placeholder="e.g. 0"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium">Wage Ceiling (optional)</label>
//               <input
//                 type="number"
//                 value={form.wage_ceiling}
//                 onChange={(e) => updateField("wage_ceiling", e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                 placeholder="e.g. 15000"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1 block text-sm font-medium">Effective From *</label>
//               <input
//                 required
//                 type="date"
//                 value={form.effective_from}
//                 onChange={(e) => updateField("effective_from", e.target.value)}
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium">Effective To</label>
//               <input
//                 type="date"
//                 value={form.effective_to}
//                 onChange={(e) => updateField("effective_to", e.target.value)}
//                 placeholder="Leave blank if ongoing"
//                 className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="flex gap-6">
//             <label className="flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 checked={form.is_employer_contribution}
//                 onChange={(e) => updateField("is_employer_contribution", e.target.checked)}
//               />
//               Employer Contribution
//             </label>
//             <label className="flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 checked={form.is_statutory}
//                 onChange={(e) => updateField("is_statutory", e.target.checked)}
//               />
//               Statutory
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Create Rule"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/lib/api";

const CALCULATION_TYPES = [
  { value: "percentage", label: "Percentage" },
  { value: "flat", label: "Flat" },
  { value: "slab", label: "Slab" },
  { value: "formula", label: "Formula" },
  { value: "attendance_based", label: "Attendance Based" },
];

const EMPTY_SLAB_ROW = { min_wage: "", max_wage: "", value: "" };

const DEFAULT_FORM = {
  deduction_name: "",
  code: "",
  calculation_type: "percentage",
  deducted_value: "",
  wage_ceiling: "",
  wage_floor: "",
  is_employer_contribution: false,
  is_statutory: true,
  effective_from: "",
  effective_to: "",
};

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function getRulesList(response) {
  const body = response?.data ?? {};
  const list =
    body?.data ??
    body?.rules ??
    body?.deduction_rules ??
    body?.items ??
    body?.results ??
    [];
  return Array.isArray(list) ? list : [];
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

export default function DeductionRulesPage() {
  const [activeTab, setActiveTab] = useState("list"); // list | create
  const [rules, setRules] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [slabRows, setSlabRows] = useState([{ ...EMPTY_SLAB_ROW }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRule, setSelectedRule] = useState(null);

  const fetchRules = useCallback(async () => {
    setListLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/payroll/deduction-rules", {
        params: { is_active: true },
      });
      setRules(getRulesList(res));
    } catch (err) {
      setError(getErrorMessage(err));
      setRules([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateSlabRow(index, field, value) {
    setSlabRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addSlabRow() {
    setSlabRows((prev) => [...prev, { ...EMPTY_SLAB_ROW }]);
  }

  function removeSlabRow(index) {
    setSlabRows((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setForm(DEFAULT_FORM);
    setSlabRows([{ ...EMPTY_SLAB_ROW }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const isSlab = form.calculation_type === "slab";
      await api.post("/api/v1/payroll/deduction-rules", {
        deduction_name: form.deduction_name,
        code: form.code,
        calculation_type: form.calculation_type,
        deducted_value:
          !isSlab && form.deducted_value ? Number(form.deducted_value) : null,
        wage_ceiling: form.wage_ceiling ? Number(form.wage_ceiling) : null,
        wage_floor: form.wage_floor ? Number(form.wage_floor) : null,
        slab_config: isSlab
          ? slabRows
              .filter((r) => r.min_wage !== "" || r.max_wage !== "" || r.value !== "")
              .map((r) => ({
                min_wage: Number(r.min_wage) || 0,
                max_wage: r.max_wage ? Number(r.max_wage) : null,
                value: Number(r.value) || 0,
              }))
          : null,
        is_employer_contribution: form.is_employer_contribution,
        is_statutory: form.is_statutory,
        effective_from: form.effective_from,
        effective_to: form.effective_to || null,
      });

      setSuccess("Deduction rule created successfully");
      resetForm();
      setActiveTab("list");
      await fetchRules();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#E42527]">
                Payroll
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Deduction Rules
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Configure PF, ESI, PT, Tax and other statutory deductions
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("create");
                setError("");
                setSuccess("");
              }}
              className="inline-flex items-center justify-center rounded-xl bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c91f21]"
            >
              + Create Rule
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1 border-b border-slate-200">
            {[
              { id: "list", label: "All Rules" },
              { id: "create", label: "Create Rule" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setError("");
                  setSuccess("");
                }}
                className={`relative px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "text-[#E42527]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#E42527]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* ================= LIST ================= */}
        {activeTab === "list" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Active Deduction Rules</h2>
                <p className="text-xs text-slate-500">{rules.length} rules found</p>
              </div>
              <button
                type="button"
                onClick={fetchRules}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {listLoading ? (
              <div className="py-16 text-center text-sm text-slate-500">Loading rules...</div>
            ) : rules.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-sm font-medium text-slate-700">No deduction rules found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Create PF / ESI / PT rules to get started
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("create")}
                  className="mt-4 rounded-xl bg-[#E42527] px-4 py-2 text-sm font-medium text-white"
                >
                  Create Rule
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Rule
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Type
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Value
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Effective
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Flags
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rules.map((rule, idx) => {
                      const name =
                        rule.deduction_name || rule.name || rule.rule_name || "Rule";
                      const code = rule.code || "—";
                      const calcType = rule.calculation_type || "—";
                      const value =
                        rule.deducted_value ??
                        rule.value ??
                        (Array.isArray(rule.slab_config)
                          ? `${rule.slab_config.length} slabs`
                          : "—");

                      return (
                        <tr key={rule.deduction_rule_id || rule.id || idx} className="hover:bg-slate-50/70">
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-slate-800">{name}</div>
                            <div className="text-xs text-slate-400">{code}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                              {String(calcType).replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
                            {calcType === "percentage" && value !== "—"
                              ? `${value}%`
                              : value}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            <div>{formatDate(rule.effective_from)}</div>
                            <div className="text-xs text-slate-400">
                              to {formatDate(rule.effective_to) || "Ongoing"}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {rule.is_statutory && (
                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                                  Statutory
                                </span>
                              )}
                              {rule.is_employer_contribution && (
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                  Employer
                                </span>
                              )}
                              {rule.is_active !== false && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                  Active
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRule(rule)}
                              className="text-sm font-medium text-[#E42527] hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= CREATE ================= */}
        {activeTab === "create" && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Create Deduction Rule</h2>
              <p className="mt-1 text-sm text-slate-500">
                Define calculation type, slabs, wage limits and effective dates
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Rule Name *
                  </label>
                  <input
                    required
                    value={form.deduction_name}
                    onChange={(e) => updateField("deduction_name", e.target.value)}
                    placeholder="e.g. Employee PF"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Code *
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) => updateField("code", e.target.value.toUpperCase())}
                    placeholder="e.g. PF"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-[#E42527]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Calculation Type
                  </label>
                  <select
                    value={form.calculation_type}
                    onChange={(e) => updateField("calculation_type", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  >
                    {CALCULATION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {form.calculation_type !== "slab" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Value {form.calculation_type === "percentage" ? "(%)" : ""}
                    </label>
                    <input
                      type="number"
                      value={form.deducted_value}
                      onChange={(e) => updateField("deducted_value", e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                    />
                  </div>
                )}
              </div>

              {form.calculation_type === "slab" && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">Slab Config</h3>
                    <button
                      type="button"
                      onClick={addSlabRow}
                      className="text-sm font-medium text-[#E42527] hover:underline"
                    >
                      + Add Slab
                    </button>
                  </div>

                  <div className="space-y-2">
                    {slabRows.map((row, index) => (
                      <div key={index} className="flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min wage"
                          value={row.min_wage}
                          onChange={(e) => updateSlabRow(index, "min_wage", e.target.value)}
                          className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max wage"
                          value={row.max_wage}
                          onChange={(e) => updateSlabRow(index, "max_wage", e.target.value)}
                          className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Value"
                          value={row.value}
                          onChange={(e) => updateSlabRow(index, "value", e.target.value)}
                          className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                        {slabRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlabRow(index)}
                            className="text-sm text-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Wage Floor
                  </label>
                  <input
                    type="number"
                    value={form.wage_floor}
                    onChange={(e) => updateField("wage_floor", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Wage Ceiling
                  </label>
                  <input
                    type="number"
                    value={form.wage_ceiling}
                    onChange={(e) => updateField("wage_ceiling", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Effective From *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.effective_from}
                    onChange={(e) => updateField("effective_from", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Effective To
                  </label>
                  <input
                    type="date"
                    value={form.effective_to}
                    onChange={(e) => updateField("effective_to", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#E42527]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_employer_contribution}
                    onChange={(e) =>
                      updateField("is_employer_contribution", e.target.checked)
                    }
                  />
                  Employer Contribution
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_statutory}
                    onChange={(e) => updateField("is_statutory", e.target.checked)}
                  />
                  Statutory
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Create Rule"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Deduction Rule
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedRule.deduction_name || selectedRule.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {[
                ["Code", selectedRule.code],
                ["Type", selectedRule.calculation_type],
                ["Value", selectedRule.deducted_value],
                ["Wage Floor", selectedRule.wage_floor],
                ["Wage Ceiling", selectedRule.wage_ceiling],
                ["Effective From", formatDate(selectedRule.effective_from)],
                ["Effective To", formatDate(selectedRule.effective_to) || "Ongoing"],
                ["Statutory", selectedRule.is_statutory ? "Yes" : "No"],
                [
                  "Employer Contribution",
                  selectedRule.is_employer_contribution ? "Yes" : "No",
                ],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {value ?? "—"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}