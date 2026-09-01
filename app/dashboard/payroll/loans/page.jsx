"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

// ---------------------------------------------
// Matches backend:
//   POST /api/v1/payroll/loan-policies         (schemas.LoanPolicyCreate)
//   GET  /api/v1/payroll/loan-policies
//   POST /api/v1/payroll/loans                 (schemas.EmployeeLoanCreate)
//   GET  /api/v1/payroll/loans/employee/{id}
//   GET  /api/v1/payroll/loans/{loan_id}/schedule
//   POST /api/v1/payroll/loans/{loan_id}/prepay (schemas.LoanPrepay)
// ---------------------------------------------

const TABS = [
  { key: "policies", label: "Loan Policies" },
  { key: "loans", label: "Employee Loans" },
];

const DEFAULT_POLICY_FORM = {
  loan_type: "",
  default_interest_rate: "",
  max_amount: "",
  max_tenure_months: "",
  min_service_days: "",
  is_active: true,
};

const DEFAULT_LOAN_FORM = {
  employee_id: "",
  loan_policy_id: "",
  principal_amount: "",
  tenure_months: "",
  start_month: "",
  notes: "",
};

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function toArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
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

export default function LoanManagementPage() {
  const [activeTab, setActiveTab] = useState("policies");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------- Loan Policies state ----------
  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [policyForm, setPolicyForm] = useState(DEFAULT_POLICY_FORM);
  const [policySubmitting, setPolicySubmitting] = useState(false);

  // ---------- Employee Loans state ----------
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeLoans, setEmployeeLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanForm, setLoanForm] = useState(DEFAULT_LOAN_FORM);
  const [loanSubmitting, setLoanSubmitting] = useState(false);

  // ---------- EMI schedule / prepay state ----------
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [prepayAmount, setPrepayAmount] = useState("");
  const [prepayNote, setPrepayNote] = useState("");
  const [prepaySubmitting, setPrepaySubmitting] = useState(false);

  useEffect(() => {
    fetchPolicies();
    api
      .get("/api/v1/get/employees")
      .then((response) => setEmployees(getEmployees(response)))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  // ---------- Loan Policies ----------
  async function fetchPolicies() {
    setPoliciesLoading(true);
    try {
      const res = await api.get("/api/v1/payroll/loan-policies");
      setPolicies(toArray(res?.data ?? res));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPoliciesLoading(false);
    }
  }

  async function handleCreatePolicy(e) {
    e.preventDefault();
    setPolicySubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/payroll/loan-policies", {
        loan_type: policyForm.loan_type,
        default_interest_rate: policyForm.default_interest_rate ? Number(policyForm.default_interest_rate) : 0,
        max_amount: policyForm.max_amount ? Number(policyForm.max_amount) : null,
        max_tenure_months: policyForm.max_tenure_months ? Number(policyForm.max_tenure_months) : null,
        min_service_days: policyForm.min_service_days ? Number(policyForm.min_service_days) : 0,
        is_active: policyForm.is_active,
      });
      setSuccess("Loan policy created successfully");
      setShowPolicyForm(false);
      setPolicyForm(DEFAULT_POLICY_FORM);
      await fetchPolicies();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPolicySubmitting(false);
    }
  }

  // ---------- Employee Loans ----------
  async function fetchEmployeeLoans(employeeId) {
    if (!employeeId) return;
    setLoansLoading(true);
    setError("");
    setEmployeeLoans([]);
    setSchedule(null);
    setSelectedLoanId("");
    try {
      const res = await api.get(`/api/v1/payroll/loans/employee/${employeeId}`);
      setEmployeeLoans(toArray(res?.data ?? res));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoansLoading(false);
    }
  }

  function handleSelectEmployee(employeeId) {
    setSelectedEmployeeId(employeeId);
    fetchEmployeeLoans(employeeId);
  }

  async function handleCreateLoan(e) {
    e.preventDefault();
    setLoanSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/v1/payroll/loans", {
        employee_id: loanForm.employee_id,
        loan_policy_id: loanForm.loan_policy_id,
        principal_amount: Number(loanForm.principal_amount),
        tenure_months: Number(loanForm.tenure_months),
        start_month: loanForm.start_month,
        notes: loanForm.notes || null,
      });
      setSuccess("Loan created successfully");
      setShowLoanForm(false);
      setLoanForm(DEFAULT_LOAN_FORM);
      if (loanForm.employee_id === selectedEmployeeId) {
        await fetchEmployeeLoans(selectedEmployeeId);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoanSubmitting(false);
    }
  }

  // ---------- EMI Schedule + Prepay ----------
  async function handleViewSchedule(loanId) {
    setSelectedLoanId(loanId);
    setScheduleLoading(true);
    setError("");
    setSchedule(null);
    try {
      const res = await api.get(`/api/v1/payroll/loans/${loanId}/schedule`);
      setSchedule(toArray(res?.data ?? res));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setScheduleLoading(false);
    }
  }

  async function handlePrepay(e) {
    e.preventDefault();
    if (!selectedLoanId || !prepayAmount) return;
    setPrepaySubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post(`/api/v1/payroll/loans/${selectedLoanId}/prepay`, {
        prepay_amount: Number(prepayAmount),
        note: prepayNote || null,
      });
      setSuccess("Prepayment recorded successfully");
      setPrepayAmount("");
      setPrepayNote("");
      await handleViewSchedule(selectedLoanId);
      await fetchEmployeeLoans(selectedEmployeeId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPrepaySubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Loan Management</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Loan policies, employee loans, EMI schedules & prepayments</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <div className="mb-6 flex gap-1 rounded-md border border-[#d1d5db] bg-white p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setError(""); setSuccess(""); }}
            className={`rounded px-4 py-1.5 text-sm font-medium ${
              activeTab === tab.key ? "bg-[#E42527] text-white" : "text-[#6b7280] hover:bg-[#f9fafb]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== LOAN POLICIES TAB ===================== */}
      {activeTab === "policies" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#6b7280]">{policies.length} policies configured</p>
            <button
              onClick={() => { setError(""); setPolicyForm(DEFAULT_POLICY_FORM); setShowPolicyForm(true); }}
              className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
            >
              + Add Loan Policy
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
            {policiesLoading ? (
              <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
            ) : policies.length === 0 ? (
              <div className="py-16 text-center text-sm text-[#6b7280]">No loan policies found</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="px-5 py-3 font-medium text-[#6b7280]">Loan Type</th>
                    <th className="px-5 py-3 font-medium text-[#6b7280]">Interest Rate</th>
                    <th className="px-5 py-3 font-medium text-[#6b7280]">Max Amount</th>
                    <th className="px-5 py-3 font-medium text-[#6b7280]">Max Tenure</th>
                    <th className="px-5 py-3 font-medium text-[#6b7280]">Min Service Days</th>
                    <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {policies.map((p) => (
                    <tr key={p.loan_policy_id || p.id} className="hover:bg-[#fafafa]">
                      <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">{p.loan_type}</td>
                      <td className="px-5 py-3.5 text-[#6b7280]">{p.default_interest_rate}%</td>
                      <td className="px-5 py-3.5 text-[#6b7280]">{p.max_amount ? `₹ ${p.max_amount}` : "No limit"}</td>
                      <td className="px-5 py-3.5 text-[#6b7280]">{p.max_tenure_months ? `${p.max_tenure_months} mo` : "—"}</td>
                      <td className="px-5 py-3.5 text-[#6b7280]">{p.min_service_days ?? 0}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {p.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showPolicyForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h2 className="text-lg font-semibold">Add Loan Policy</h2>
                  <button onClick={() => setShowPolicyForm(false)} className="text-[#6b7280] hover:text-[#1a1a1a]">✕</button>
                </div>
                <form onSubmit={handleCreatePolicy} className="space-y-4 p-5">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Loan Type *</label>
                    <input
                      required
                      value={policyForm.loan_type}
                      onChange={(e) => setPolicyForm({ ...policyForm, loan_type: e.target.value })}
                      placeholder="e.g. Personal Loan"
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Interest Rate (%)</label>
                      <input
                        type="number"
                        value={policyForm.default_interest_rate}
                        onChange={(e) => setPolicyForm({ ...policyForm, default_interest_rate: e.target.value })}
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Max Amount</label>
                      <input
                        type="number"
                        value={policyForm.max_amount}
                        onChange={(e) => setPolicyForm({ ...policyForm, max_amount: e.target.value })}
                        placeholder="No limit"
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Max Tenure (months)</label>
                      <input
                        type="number"
                        value={policyForm.max_tenure_months}
                        onChange={(e) => setPolicyForm({ ...policyForm, max_tenure_months: e.target.value })}
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Min Service Days</label>
                      <input
                        type="number"
                        value={policyForm.min_service_days}
                        onChange={(e) => setPolicyForm({ ...policyForm, min_service_days: e.target.value })}
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={policyForm.is_active}
                      onChange={(e) => setPolicyForm({ ...policyForm, is_active: e.target.checked })}
                    />
                    Active
                  </label>
                  {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowPolicyForm(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                    <button type="submit" disabled={policySubmitting} className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60">
                      {policySubmitting ? "Saving..." : "Create Policy"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== EMPLOYEE LOANS TAB ===================== */}
      {activeTab === "loans" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <select
              value={selectedEmployeeId}
              onChange={(e) => handleSelectEmployee(e.target.value)}
              className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
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
            <button
              onClick={() => {
                setError("");
                setLoanForm({ ...DEFAULT_LOAN_FORM, employee_id: selectedEmployeeId });
                setShowLoanForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
            >
              + New Loan
            </button>
          </div>

          {!selectedEmployeeId ? (
            <div className="rounded-lg border border-[#e5e7eb] bg-white py-16 text-center text-sm text-[#6b7280] shadow-sm">
              Select an employee to view their loans
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
              {loansLoading ? (
                <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
              ) : employeeLoans.length === 0 ? (
                <div className="py-16 text-center text-sm text-[#6b7280]">No loans found for this employee</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Loan Type</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Principal</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Tenure</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Start Month</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    {employeeLoans.map((loan) => {
                      const loanId = loan.loan_id || loan.id;
                      return (
                        <tr key={loanId} className="hover:bg-[#fafafa]">
                          <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">{loan.loan_type || loan.loan_policy_name || "Loan"}</td>
                          <td className="px-5 py-3.5 text-[#6b7280]">₹ {loan.principal_amount}</td>
                          <td className="px-5 py-3.5 text-[#6b7280]">{loan.tenure_months} mo</td>
                          <td className="px-5 py-3.5 text-[#6b7280]">{loan.start_month}</td>
                          <td className="px-5 py-3.5">
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium capitalize text-blue-700">
                              {loan.status || "active"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleViewSchedule(loanId)}
                              className="text-sm font-medium text-[#E42527] hover:underline"
                            >
                              View EMI
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ---------- EMI Schedule + Prepay ---------- */}
          {selectedLoanId && (
            <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-[#1a1a1a]">EMI Schedule</h3>
              {scheduleLoading ? (
                <div className="py-8 text-center text-sm text-[#6b7280]">Loading schedule...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-[#f9fafb]">
                        <th className="px-3 py-2 text-left font-medium text-[#6b7280]">#</th>
                        <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Due Date</th>
                        <th className="px-3 py-2 text-right font-medium text-[#6b7280]">EMI Amount</th>
                        <th className="px-3 py-2 text-center font-medium text-[#6b7280]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toArray(schedule).map((row, i) => (
                        <tr key={row.emi_id || i} className="border-b">
                          <td className="px-3 py-2">{i + 1}</td>
                          <td className="px-3 py-2">{row.due_date}</td>
                          <td className="px-3 py-2 text-right">₹ {Number(row.emi_amount ?? 0).toFixed(2)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                              {row.status || "pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-5 border-t pt-4">
                <h4 className="mb-2 text-sm font-semibold text-[#1a1a1a]">Prepay Loan</h4>
                <form onSubmit={handlePrepay} className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Amount *</label>
                    <input
                      required
                      type="number"
                      value={prepayAmount}
                      onChange={(e) => setPrepayAmount(e.target.value)}
                      className="w-40 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Note</label>
                    <input
                      value={prepayNote}
                      onChange={(e) => setPrepayNote(e.target.value)}
                      className="w-56 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={prepaySubmitting}
                    className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                  >
                    {prepaySubmitting ? "Processing..." : "Prepay"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {showLoanForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h2 className="text-lg font-semibold">New Employee Loan</h2>
                  <button onClick={() => setShowLoanForm(false)} className="text-[#6b7280] hover:text-[#1a1a1a]">✕</button>
                </div>
                <form onSubmit={handleCreateLoan} className="space-y-4 p-5">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Employee *</label>
                    <select
                      required
                      value={loanForm.employee_id}
                      onChange={(e) => setLoanForm({ ...loanForm, employee_id: e.target.value })}
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
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
                  <div>
                    <label className="mb-1 block text-sm font-medium">Loan Policy *</label>
                    <select
                      required
                      value={loanForm.loan_policy_id}
                      onChange={(e) => setLoanForm({ ...loanForm, loan_policy_id: e.target.value })}
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
                    >
                      <option value="">Select policy</option>
                      {policies.map((p) => (
                        <option key={p.loan_policy_id || p.id} value={p.loan_policy_id || p.id}>
                          {p.loan_type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Principal Amount *</label>
                      <input
                        required
                        type="number"
                        value={loanForm.principal_amount}
                        onChange={(e) => setLoanForm({ ...loanForm, principal_amount: e.target.value })}
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Tenure (months) *</label>
                      <input
                        required
                        type="number"
                        value={loanForm.tenure_months}
                        onChange={(e) => setLoanForm({ ...loanForm, tenure_months: e.target.value })}
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Start Month *</label>
                    <input
                      required
                      type="date"
                      value={loanForm.start_month}
                      onChange={(e) => setLoanForm({ ...loanForm, start_month: e.target.value })}
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Notes</label>
                    <textarea
                      value={loanForm.notes}
                      onChange={(e) => setLoanForm({ ...loanForm, notes: e.target.value })}
                      rows={2}
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  </div>
                  {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowLoanForm(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                    <button type="submit" disabled={loanSubmitting} className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60">
                      {loanSubmitting ? "Saving..." : "Create Loan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}