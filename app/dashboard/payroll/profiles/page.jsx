"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

// ---------------------------------------------
// Matches backend:
//   POST /api/v1/payroll/profile
// Body matches schemas.EmployeePayrollProfileCreate exactly.
// ---------------------------------------------

const DEFAULT_FORM = {
  employee_id: "",
  bank_name: "",
  bank_account_number: "",
  bank_ifsc: "",
  bank_branch: "",
  account_holder_name: "",
  uan_number: "",
  pf_number: "",
  esi_number: "",
  pan_number: "",
  aadhaar_number: "",
  tax_regime: "new",
  pf_applicable: true,
  esi_applicable: true,
  pt_applicable: true,
  lwf_applicable: false,
  pt_state: "",
  pay_schedule_id: "",
};

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function getEmployees(response) {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return data?.employees ?? data?.items ?? data?.results ?? [];
}

function getEmployeeId(employee) {
  return employee.employee_id || employee.id || employee._id;
}

function getEmployeeName(employee) {
  const fullName = [employee.first_name, employee.last_name].filter(Boolean).join(" ");
  return fullName || employee.name || employee.full_name || getEmployeeId(employee);
}

export default function PayrollProfilesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/api/v1/get/employees");
        setEmployees(getEmployees(response));
      } catch (err) {
        setError(getErrorMessage(err));
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/payroll/profile", {
        employee_id: form.employee_id,
        bank_account_number: form.bank_account_number || null,
        bank_ifsc: form.bank_ifsc || null,
        bank_name: form.bank_name || null,
        account_holder_name: form.account_holder_name || null,
        bank_branch: form.bank_branch || null,
        uan_number: form.uan_number || null,
        pf_number: form.pf_number || null,
        esi_number: form.esi_number || null,
        pan_number: form.pan_number || null,
        aadhaar_number: form.aadhaar_number || null,
        pf_applicable: form.pf_applicable,
        esi_applicable: form.esi_applicable,
        pt_applicable: form.pt_applicable,
        lwf_applicable: form.lwf_applicable,
        pt_state: form.pt_state || null,
        tax_regime: form.tax_regime,
        pay_schedule_id: form.pay_schedule_id || null,
      });
      setSuccess("Payroll profile saved successfully");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Payroll Profile</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Bank details, UAN, PF, ESI and tax settings for employee</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <div className="max-w-2xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Employee *</label>
            <select
              required
              value={form.employee_id}
              onChange={(e) => update("employee_id", e.target.value)}
              className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
            >
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
          </div>

          <h3 className="pt-2 text-sm font-semibold text-[#374151]">Bank Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Bank Name" value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <input placeholder="Account Number" value={form.bank_account_number} onChange={(e) => update("bank_account_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <input placeholder="IFSC Code" value={form.bank_ifsc} onChange={(e) => update("bank_ifsc", e.target.value.toUpperCase())} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none" />
            <input placeholder="Branch" value={form.bank_branch} onChange={(e) => update("bank_branch", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <input placeholder="Account Holder Name" value={form.account_holder_name} onChange={(e) => update("account_holder_name", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm sm:col-span-2 focus:border-[#E42527] focus:outline-none" />
          </div>

          <h3 className="pt-2 text-sm font-semibold text-[#374151]">Statutory Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="UAN Number" value={form.uan_number} onChange={(e) => update("uan_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <input placeholder="PF Number" value={form.pf_number} onChange={(e) => update("pf_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <input placeholder="ESI Number" value={form.esi_number} onChange={(e) => update("esi_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <input placeholder="PAN Number" value={form.pan_number} onChange={(e) => update("pan_number", e.target.value.toUpperCase())} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none" />
            <input placeholder="Aadhaar Number" value={form.aadhaar_number} onChange={(e) => update("aadhaar_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <input placeholder="PT State" value={form.pt_state} onChange={(e) => update("pt_state", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
            <select value={form.tax_regime} onChange={(e) => update("tax_regime", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm">
              <option value="new">New Tax Regime</option>
              <option value="old">Old Tax Regime</option>
            </select>
            <input placeholder="Pay Schedule ID (optional)" value={form.pay_schedule_id} onChange={(e) => update("pay_schedule_id", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.pf_applicable} onChange={(e) => update("pf_applicable", e.target.checked)} />
              PF Applicable
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.esi_applicable} onChange={(e) => update("esi_applicable", e.target.checked)} />
              ESI Applicable
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.pt_applicable} onChange={(e) => update("pt_applicable", e.target.checked)} />
              PT Applicable
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.lwf_applicable} onChange={(e) => update("lwf_applicable", e.target.checked)} />
              LWF Applicable
            </label>
          </div>

          {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}

          <button type="submit" disabled={loading} className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}