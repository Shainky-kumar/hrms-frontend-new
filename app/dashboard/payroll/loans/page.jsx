// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

// // ---------------------------------------------
// // Matches backend:
// //   POST /api/v1/payroll/loan-policies         (schemas.LoanPolicyCreate)
// //   GET  /api/v1/payroll/loan-policies
// //   POST /api/v1/payroll/loans                 (schemas.EmployeeLoanCreate)
// //   GET  /api/v1/payroll/loans/employee/{id}
// //   GET  /api/v1/payroll/loans/{loan_id}/schedule
// //   POST /api/v1/payroll/loans/{loan_id}/prepay (schemas.LoanPrepay)
// // ---------------------------------------------

// const TABS = [
//   { key: "policies", label: "Loan Policies" },
//   { key: "loans", label: "Employee Loans" },
// ];

// const DEFAULT_POLICY_FORM = {
//   loan_type: "",
//   default_interest_rate: "",
//   max_amount: "",
//   max_tenure_months: "",
//   min_service_days: "",
//   is_active: true,
// };

// const DEFAULT_LOAN_FORM = {
//   employee_id: "",
//   loan_policy_id: "",
//   principal_amount: "",
//   tenure_months: "",
//   start_month: "",
//   notes: "",
// };

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// }

// function toArray(payload) {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;
//   if (Array.isArray(payload?.data)) return payload.data;
//   return [];
// }

// function getEmployees(response) {
//   const data = response?.data?.data ?? response?.data ?? [];
//   if (Array.isArray(data)) return data;
//   return data?.employees ?? data?.items ?? data?.results ?? [];
// }

// function getEmployeeId(employee) {
//   return employee.employee_id || employee.id || employee._id;
// }

// function getEmployeeName(employee) {
//   const fullName = [employee.first_name, employee.last_name].filter(Boolean).join(" ");
//   return fullName || employee.name || employee.full_name || getEmployeeId(employee);
// }

// export default function LoanManagementPage() {
//   const [activeTab, setActiveTab] = useState("policies");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ---------- Loan Policies state ----------
//   const [policies, setPolicies] = useState([]);
//   const [policiesLoading, setPoliciesLoading] = useState(true);
//   const [showPolicyForm, setShowPolicyForm] = useState(false);
//   const [policyForm, setPolicyForm] = useState(DEFAULT_POLICY_FORM);
//   const [policySubmitting, setPolicySubmitting] = useState(false);

//   // ---------- Employee Loans state ----------
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [employeeLoans, setEmployeeLoans] = useState([]);
//   const [loansLoading, setLoansLoading] = useState(false);
//   const [showLoanForm, setShowLoanForm] = useState(false);
//   const [loanForm, setLoanForm] = useState(DEFAULT_LOAN_FORM);
//   const [loanSubmitting, setLoanSubmitting] = useState(false);

//   // ---------- EMI schedule / prepay state ----------
//   const [selectedLoanId, setSelectedLoanId] = useState("");
//   const [schedule, setSchedule] = useState(null);
//   const [scheduleLoading, setScheduleLoading] = useState(false);
//   const [prepayAmount, setPrepayAmount] = useState("");
//   const [prepayNote, setPrepayNote] = useState("");
//   const [prepaySubmitting, setPrepaySubmitting] = useState(false);

//   useEffect(() => {
//     fetchPolicies();
//     api
//       .get("/api/v1/get/employees")
//       .then((response) => setEmployees(getEmployees(response)))
//       .catch((err) => setError(getErrorMessage(err)));
//   }, []);

//   // ---------- Loan Policies ----------
//   async function fetchPolicies() {
//     setPoliciesLoading(true);
//     try {
//       const res = await api.get("/api/v1/payroll/loan-policies");
//       setPolicies(toArray(res?.data ?? res));
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPoliciesLoading(false);
//     }
//   }

//   async function handleCreatePolicy(e) {
//     e.preventDefault();
//     setPolicySubmitting(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/payroll/loan-policies", {
//         loan_type: policyForm.loan_type,
//         default_interest_rate: policyForm.default_interest_rate ? Number(policyForm.default_interest_rate) : 0,
//         max_amount: policyForm.max_amount ? Number(policyForm.max_amount) : null,
//         max_tenure_months: policyForm.max_tenure_months ? Number(policyForm.max_tenure_months) : null,
//         min_service_days: policyForm.min_service_days ? Number(policyForm.min_service_days) : 0,
//         is_active: policyForm.is_active,
//       });
//       setSuccess("Loan policy created successfully");
//       setShowPolicyForm(false);
//       setPolicyForm(DEFAULT_POLICY_FORM);
//       await fetchPolicies();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPolicySubmitting(false);
//     }
//   }

//   // ---------- Employee Loans ----------
//   async function fetchEmployeeLoans(employeeId) {
//     if (!employeeId) return;
//     setLoansLoading(true);
//     setError("");
//     setEmployeeLoans([]);
//     setSchedule(null);
//     setSelectedLoanId("");
//     try {
//       const res = await api.get(`/api/v1/payroll/loans/employee/${employeeId}`);
//       setEmployeeLoans(toArray(res?.data ?? res));
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoansLoading(false);
//     }
//   }

//   function handleSelectEmployee(employeeId) {
//     setSelectedEmployeeId(employeeId);
//     fetchEmployeeLoans(employeeId);
//   }

//   async function handleCreateLoan(e) {
//     e.preventDefault();
//     setLoanSubmitting(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/payroll/loans", {
//         employee_id: loanForm.employee_id,
//         loan_policy_id: loanForm.loan_policy_id,
//         principal_amount: Number(loanForm.principal_amount),
//         tenure_months: Number(loanForm.tenure_months),
//         start_month: loanForm.start_month,
//         notes: loanForm.notes || null,
//       });
//       setSuccess("Loan created successfully");
//       setShowLoanForm(false);
//       setLoanForm(DEFAULT_LOAN_FORM);
//       if (loanForm.employee_id === selectedEmployeeId) {
//         await fetchEmployeeLoans(selectedEmployeeId);
//       }
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoanSubmitting(false);
//     }
//   }

//   // ---------- EMI Schedule + Prepay ----------
//   async function handleViewSchedule(loanId) {
//     setSelectedLoanId(loanId);
//     setScheduleLoading(true);
//     setError("");
//     setSchedule(null);
//     try {
//       const res = await api.get(`/api/v1/payroll/loans/${loanId}/schedule`);
//       setSchedule(toArray(res?.data ?? res));
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setScheduleLoading(false);
//     }
//   }

//   async function handlePrepay(e) {
//     e.preventDefault();
//     if (!selectedLoanId || !prepayAmount) return;
//     setPrepaySubmitting(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post(`/api/v1/payroll/loans/${selectedLoanId}/prepay`, {
//         prepay_amount: Number(prepayAmount),
//         note: prepayNote || null,
//       });
//       setSuccess("Prepayment recorded successfully");
//       setPrepayAmount("");
//       setPrepayNote("");
//       await handleViewSchedule(selectedLoanId);
//       await fetchEmployeeLoans(selectedEmployeeId);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPrepaySubmitting(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Loan Management</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">Loan policies, employee loans, EMI schedules & prepayments</p>
//       </div>

//       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
//       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

//       <div className="mb-6 flex gap-1 rounded-md border border-[#d1d5db] bg-white p-1 w-fit">
//         {TABS.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => { setActiveTab(tab.key); setError(""); setSuccess(""); }}
//             className={`rounded px-4 py-1.5 text-sm font-medium ${
//               activeTab === tab.key ? "bg-[#E42527] text-white" : "text-[#6b7280] hover:bg-[#f9fafb]"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* ===================== LOAN POLICIES TAB ===================== */}
//       {activeTab === "policies" && (
//         <div>
//           <div className="mb-4 flex items-center justify-between">
//             <p className="text-sm text-[#6b7280]">{policies.length} policies configured</p>
//             <button
//               onClick={() => { setError(""); setPolicyForm(DEFAULT_POLICY_FORM); setShowPolicyForm(true); }}
//               className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//             >
//               + Add Loan Policy
//             </button>
//           </div>

//           <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//             {policiesLoading ? (
//               <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//             ) : policies.length === 0 ? (
//               <div className="py-16 text-center text-sm text-[#6b7280]">No loan policies found</div>
//             ) : (
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                     <th className="px-5 py-3 font-medium text-[#6b7280]">Loan Type</th>
//                     <th className="px-5 py-3 font-medium text-[#6b7280]">Interest Rate</th>
//                     <th className="px-5 py-3 font-medium text-[#6b7280]">Max Amount</th>
//                     <th className="px-5 py-3 font-medium text-[#6b7280]">Max Tenure</th>
//                     <th className="px-5 py-3 font-medium text-[#6b7280]">Min Service Days</th>
//                     <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#f3f4f6]">
//                   {policies.map((p) => (
//                     <tr key={p.loan_policy_id || p.id} className="hover:bg-[#fafafa]">
//                       <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">{p.loan_type}</td>
//                       <td className="px-5 py-3.5 text-[#6b7280]">{p.default_interest_rate}%</td>
//                       <td className="px-5 py-3.5 text-[#6b7280]">{p.max_amount ? `₹ ${p.max_amount}` : "No limit"}</td>
//                       <td className="px-5 py-3.5 text-[#6b7280]">{p.max_tenure_months ? `${p.max_tenure_months} mo` : "—"}</td>
//                       <td className="px-5 py-3.5 text-[#6b7280]">{p.min_service_days ?? 0}</td>
//                       <td className="px-5 py-3.5">
//                         <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
//                           {p.is_active ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {showPolicyForm && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//               <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
//                 <div className="flex items-center justify-between border-b px-5 py-4">
//                   <h2 className="text-lg font-semibold">Add Loan Policy</h2>
//                   <button onClick={() => setShowPolicyForm(false)} className="text-[#6b7280] hover:text-[#1a1a1a]">✕</button>
//                 </div>
//                 <form onSubmit={handleCreatePolicy} className="space-y-4 p-5">
//                   <div>
//                     <label className="mb-1 block text-sm font-medium">Loan Type *</label>
//                     <input
//                       required
//                       value={policyForm.loan_type}
//                       onChange={(e) => setPolicyForm({ ...policyForm, loan_type: e.target.value })}
//                       placeholder="e.g. Personal Loan"
//                       className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="mb-1 block text-sm font-medium">Interest Rate (%)</label>
//                       <input
//                         type="number"
//                         value={policyForm.default_interest_rate}
//                         onChange={(e) => setPolicyForm({ ...policyForm, default_interest_rate: e.target.value })}
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-medium">Max Amount</label>
//                       <input
//                         type="number"
//                         value={policyForm.max_amount}
//                         onChange={(e) => setPolicyForm({ ...policyForm, max_amount: e.target.value })}
//                         placeholder="No limit"
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-medium">Max Tenure (months)</label>
//                       <input
//                         type="number"
//                         value={policyForm.max_tenure_months}
//                         onChange={(e) => setPolicyForm({ ...policyForm, max_tenure_months: e.target.value })}
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-medium">Min Service Days</label>
//                       <input
//                         type="number"
//                         value={policyForm.min_service_days}
//                         onChange={(e) => setPolicyForm({ ...policyForm, min_service_days: e.target.value })}
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </div>
//                   </div>
//                   <label className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={policyForm.is_active}
//                       onChange={(e) => setPolicyForm({ ...policyForm, is_active: e.target.checked })}
//                     />
//                     Active
//                   </label>
//                   {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}
//                   <div className="flex justify-end gap-3">
//                     <button type="button" onClick={() => setShowPolicyForm(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
//                     <button type="submit" disabled={policySubmitting} className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60">
//                       {policySubmitting ? "Saving..." : "Create Policy"}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ===================== EMPLOYEE LOANS TAB ===================== */}
//       {activeTab === "loans" && (
//         <div>
//           <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//             <select
//               value={selectedEmployeeId}
//               onChange={(e) => handleSelectEmployee(e.target.value)}
//               className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//             >
//               <option value="">Select employee</option>
//               {employees.map((employee) => {
//                 const id = getEmployeeId(employee);
//                 return id ? (
//                   <option key={id} value={id}>
//                     {getEmployeeName(employee)} ({id})
//                   </option>
//                 ) : null;
//               })}
//             </select>
//             <button
//               onClick={() => {
//                 setError("");
//                 setLoanForm({ ...DEFAULT_LOAN_FORM, employee_id: selectedEmployeeId });
//                 setShowLoanForm(true);
//               }}
//               className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
//             >
//               + New Loan
//             </button>
//           </div>

//           {!selectedEmployeeId ? (
//             <div className="rounded-lg border border-[#e5e7eb] bg-white py-16 text-center text-sm text-[#6b7280] shadow-sm">
//               Select an employee to view their loans
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
//               {loansLoading ? (
//                 <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
//               ) : employeeLoans.length === 0 ? (
//                 <div className="py-16 text-center text-sm text-[#6b7280]">No loans found for this employee</div>
//               ) : (
//                 <table className="w-full text-left text-sm">
//                   <thead>
//                     <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
//                       <th className="px-5 py-3 font-medium text-[#6b7280]">Loan Type</th>
//                       <th className="px-5 py-3 font-medium text-[#6b7280]">Principal</th>
//                       <th className="px-5 py-3 font-medium text-[#6b7280]">Tenure</th>
//                       <th className="px-5 py-3 font-medium text-[#6b7280]">Start Month</th>
//                       <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
//                       <th className="px-5 py-3 font-medium text-[#6b7280]"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-[#f3f4f6]">
//                     {employeeLoans.map((loan) => {
//                       const loanId = loan.loan_id || loan.id;
//                       return (
//                         <tr key={loanId} className="hover:bg-[#fafafa]">
//                           <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">{loan.loan_type || loan.loan_policy_name || "Loan"}</td>
//                           <td className="px-5 py-3.5 text-[#6b7280]">₹ {loan.principal_amount}</td>
//                           <td className="px-5 py-3.5 text-[#6b7280]">{loan.tenure_months} mo</td>
//                           <td className="px-5 py-3.5 text-[#6b7280]">{loan.start_month}</td>
//                           <td className="px-5 py-3.5">
//                             <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium capitalize text-blue-700">
//                               {loan.status || "active"}
//                             </span>
//                           </td>
//                           <td className="px-5 py-3.5">
//                             <button
//                               onClick={() => handleViewSchedule(loanId)}
//                               className="text-sm font-medium text-[#E42527] hover:underline"
//                             >
//                               View EMI
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           )}

//           {/* ---------- EMI Schedule + Prepay ---------- */}
//           {selectedLoanId && (
//             <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
//               <h3 className="mb-3 font-semibold text-[#1a1a1a]">EMI Schedule</h3>
//               {scheduleLoading ? (
//                 <div className="py-8 text-center text-sm text-[#6b7280]">Loading schedule...</div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="border-b bg-[#f9fafb]">
//                         <th className="px-3 py-2 text-left font-medium text-[#6b7280]">#</th>
//                         <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Due Date</th>
//                         <th className="px-3 py-2 text-right font-medium text-[#6b7280]">EMI Amount</th>
//                         <th className="px-3 py-2 text-center font-medium text-[#6b7280]">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {toArray(schedule).map((row, i) => (
//                         <tr key={row.emi_id || i} className="border-b">
//                           <td className="px-3 py-2">{i + 1}</td>
//                           <td className="px-3 py-2">{row.due_date}</td>
//                           <td className="px-3 py-2 text-right">₹ {Number(row.emi_amount ?? 0).toFixed(2)}</td>
//                           <td className="px-3 py-2 text-center">
//                             <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
//                               {row.status || "pending"}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               <div className="mt-5 border-t pt-4">
//                 <h4 className="mb-2 text-sm font-semibold text-[#1a1a1a]">Prepay Loan</h4>
//                 <form onSubmit={handlePrepay} className="flex flex-wrap items-end gap-3">
//                   <div>
//                     <label className="mb-1 block text-sm font-medium">Amount *</label>
//                     <input
//                       required
//                       type="number"
//                       value={prepayAmount}
//                       onChange={(e) => setPrepayAmount(e.target.value)}
//                       className="w-40 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-sm font-medium">Note</label>
//                     <input
//                       value={prepayNote}
//                       onChange={(e) => setPrepayNote(e.target.value)}
//                       className="w-56 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={prepaySubmitting}
//                     className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//                   >
//                     {prepaySubmitting ? "Processing..." : "Prepay"}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           )}

//           {showLoanForm && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//               <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
//                 <div className="flex items-center justify-between border-b px-5 py-4">
//                   <h2 className="text-lg font-semibold">New Employee Loan</h2>
//                   <button onClick={() => setShowLoanForm(false)} className="text-[#6b7280] hover:text-[#1a1a1a]">✕</button>
//                 </div>
//                 <form onSubmit={handleCreateLoan} className="space-y-4 p-5">
//                   <div>
//                     <label className="mb-1 block text-sm font-medium">Employee *</label>
//                     <select
//                       required
//                       value={loanForm.employee_id}
//                       onChange={(e) => setLoanForm({ ...loanForm, employee_id: e.target.value })}
//                       className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//                     >
//                       <option value="">Select employee</option>
//                       {employees.map((employee) => {
//                         const id = getEmployeeId(employee);
//                         return id ? (
//                           <option key={id} value={id}>
//                             {getEmployeeName(employee)} ({id})
//                           </option>
//                         ) : null;
//                       })}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-sm font-medium">Loan Policy *</label>
//                     <select
//                       required
//                       value={loanForm.loan_policy_id}
//                       onChange={(e) => setLoanForm({ ...loanForm, loan_policy_id: e.target.value })}
//                       className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
//                     >
//                       <option value="">Select policy</option>
//                       {policies.map((p) => (
//                         <option key={p.loan_policy_id || p.id} value={p.loan_policy_id || p.id}>
//                           {p.loan_type}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="mb-1 block text-sm font-medium">Principal Amount *</label>
//                       <input
//                         required
//                         type="number"
//                         value={loanForm.principal_amount}
//                         onChange={(e) => setLoanForm({ ...loanForm, principal_amount: e.target.value })}
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-sm font-medium">Tenure (months) *</label>
//                       <input
//                         required
//                         type="number"
//                         value={loanForm.tenure_months}
//                         onChange={(e) => setLoanForm({ ...loanForm, tenure_months: e.target.value })}
//                         className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-sm font-medium">Start Month *</label>
//                     <input
//                       required
//                       type="date"
//                       value={loanForm.start_month}
//                       onChange={(e) => setLoanForm({ ...loanForm, start_month: e.target.value })}
//                       className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-sm font-medium">Notes</label>
//                     <textarea
//                       value={loanForm.notes}
//                       onChange={(e) => setLoanForm({ ...loanForm, notes: e.target.value })}
//                       rows={2}
//                       className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                     />
//                   </div>
//                   {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}
//                   <div className="flex justify-end gap-3">
//                     <button type="button" onClick={() => setShowLoanForm(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
//                     <button type="submit" disabled={loanSubmitting} className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60">
//                       {loanSubmitting ? "Saving..." : "Create Loan"}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ================= CONSTANTS ================= */

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

/* ================= HELPERS ================= */

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Login again.";
  if (err?.response?.status === 403) return "You don't have permission. Contact Payroll Officer/Admin.";
  if (err?.response?.status === 404) return "Not found.";
  return err?.message || "Something went wrong";
}

/** Robust list extractor — handles {data}, {data:[...]}, arrays */
function pickList(response) {
  const body = response?.data ?? {};
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  return body?.items ?? body?.results ?? body?.employees ?? [];
}

/** Robust single object extractor — for {data:{...}} or {...} */
function pickObject(response) {
  const body = response?.data ?? {};
  if (body.data && typeof body.data === "object" && !Array.isArray(body.data)) return body.data;
  return body;
}

function getEmployees(response) {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return data?.employees ?? data?.items ?? data?.results ?? [];
}

function getEmployeeId(e) {
  return e?.employee_id || e?.id || e?._id || "";
}

function getEmployeeName(e) {
  const full = [e?.first_name, e?.last_name].filter(Boolean).join(" ");
  return full || e?.name || e?.full_name || getEmployeeId(e);
}

function formatMoney(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "₹ 0.00";
  return `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatMonth(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  } catch {
    return String(value);
  }
}

const LOAN_STATUS_STYLE = {
  active: "bg-blue-50 text-blue-700",
  closed: "bg-emerald-50 text-emerald-700",
  defaulted: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
  foreclosed: "bg-purple-50 text-purple-700",
};

const EMI_STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700",
  deducted: "bg-emerald-50 text-emerald-700",
  waived: "bg-blue-50 text-blue-700",
  prepaid: "bg-purple-50 text-purple-700",
  skipped: "bg-gray-100 text-gray-500",
};

/* ================= COMPONENT ================= */

export default function LoanManagementPage() {
  const [activeTab, setActiveTab] = useState("policies");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Policies
  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [policyForm, setPolicyForm] = useState(DEFAULT_POLICY_FORM);
  const [policySubmitting, setPolicySubmitting] = useState(false);

  // Employee loans
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeLoans, setEmployeeLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanForm, setLoanForm] = useState(DEFAULT_LOAN_FORM);
  const [loanSubmitting, setLoanSubmitting] = useState(false);

  // EMI schedule + prepay
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [selectedLoanMeta, setSelectedLoanMeta] = useState(null); // loan object
  const [schedule, setSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [prepayAmount, setPrepayAmount] = useState("");
  const [prepayNote, setPrepayNote] = useState("");
  const [prepaySubmitting, setPrepaySubmitting] = useState(false);

  /* ---------- Initial fetch ---------- */
  const fetchPolicies = useCallback(async () => {
    setPoliciesLoading(true);
    try {
      const res = await api.get("/api/v1/payroll/loan-policies");
      setPolicies(pickList(res));
    } catch (err) {
      setError(getErrorMessage(err));
      setPolicies([]);
    } finally {
      setPoliciesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
    api
      .get("/api/v1/get/employees")
      .then((response) => setEmployees(getEmployees(response)))
      .catch((err) => setError(getErrorMessage(err)));
  }, [fetchPolicies]);

  /* ---------- Auto-dismiss success ---------- */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  /* ---------- Create Policy ---------- */
  async function handleCreatePolicy(e) {
    e.preventDefault();
    if (!policyForm.loan_type.trim()) {
      setError("Loan type is required");
      return;
    }
    setPolicySubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/v1/payroll/loan-policies", {
        loan_type: policyForm.loan_type.trim(),
        default_interest_rate: policyForm.default_interest_rate !== ""
          ? Number(policyForm.default_interest_rate) : 0,
        max_amount: policyForm.max_amount !== "" ? Number(policyForm.max_amount) : null,
        max_tenure_months: policyForm.max_tenure_months !== ""
          ? Number(policyForm.max_tenure_months) : null,
        min_service_days: policyForm.min_service_days !== ""
          ? Number(policyForm.min_service_days) : 0,
        is_active: policyForm.is_active,
      });

      setSuccess("Loan policy created");
      setShowPolicyForm(false);
      setPolicyForm(DEFAULT_POLICY_FORM);
      await fetchPolicies();
    } catch (err) {
      const msg = getErrorMessage(err);
      if (String(msg).toLowerCase().includes("already exists")) {
        setError(`A policy for "${policyForm.loan_type}" already exists.`);
      } else {
        setError(msg);
      }
    } finally {
      setPolicySubmitting(false);
    }
  }

  /* ---------- Fetch employee loans ---------- */
  const fetchEmployeeLoans = useCallback(async (employeeId) => {
    if (!employeeId) return;
    setLoansLoading(true);
    setError("");
    setEmployeeLoans([]);
    setSchedule([]);
    setSelectedLoanId("");
    setSelectedLoanMeta(null);

    try {
      const res = await api.get(`/api/v1/payroll/loans/employee/${employeeId}`);
      setEmployeeLoans(pickList(res));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoansLoading(false);
    }
  }, []);

  function handleSelectEmployee(employeeId) {
    setSelectedEmployeeId(employeeId);
    fetchEmployeeLoans(employeeId);
  }

  /* ---------- Create Loan ---------- */
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

  /* ---------- View EMI schedule ---------- */
  async function handleViewSchedule(loan) {
    const loanId = loan?.loan_id || loan?.id;
    if (!loanId) return;

    setSelectedLoanId(loanId);
    setSelectedLoanMeta(loan);
    setScheduleLoading(true);
    setError("");
    setSchedule([]);

    try {
      const res = await api.get(`/api/v1/payroll/loans/${loanId}/schedule`);
      // 🔥 FIX: extract .schedule from response
      const body = res?.data ?? {};
      const items = Array.isArray(body)
        ? body
        : body.schedule ?? body.data?.schedule ?? body.items ?? [];
      setSchedule(Array.isArray(items) ? items : []);

      // If backend sends fresh loan object, update meta
      if (body.loan) setSelectedLoanMeta(body.loan);
    } catch (err) {
      setError(getErrorMessage(err));
      setSchedule([]);
    } finally {
      setScheduleLoading(false);
    }
  }

  /* ---------- Prepay ---------- */
  async function handlePrepay(e) {
    e.preventDefault();
    if (!selectedLoanId || !prepayAmount) return;

    const amount = Number(prepayAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid prepay amount");
      return;
    }

    const outstanding = Number(selectedLoanMeta?.outstanding_amount ?? 0);
    if (outstanding > 0 && amount > outstanding) {
      setError(`Prepay amount cannot exceed outstanding balance (${formatMoney(outstanding)})`);
      return;
    }

    if (!window.confirm(`Confirm prepayment of ${formatMoney(amount)}?`)) return;

    setPrepaySubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post(`/api/v1/payroll/loans/${selectedLoanId}/prepay`, {
        prepay_amount: amount,
        note: prepayNote || null,
      });

      setSuccess("Prepayment recorded successfully");
      setPrepayAmount("");
      setPrepayNote("");

      // Refresh schedule + loans
      await handleViewSchedule(selectedLoanMeta);
      await fetchEmployeeLoans(selectedEmployeeId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPrepaySubmitting(false);
    }
  }

  /* ---------- Derived ---------- */
  const scheduleSummary = useMemo(() => {
    if (!Array.isArray(schedule) || schedule.length === 0) {
      return { total: 0, paid: 0, pending: 0, totalEmi: 0, totalPending: 0 };
    }
    let paid = 0, pending = 0, totalEmi = 0, totalPending = 0;
    for (const row of schedule) {
      const status = String(row.status || "pending").toLowerCase();
      const amt = Number(row.emi_amount || 0);
      totalEmi += amt;
      if (status === "deducted" || status === "paid") paid += 1;
      else if (status === "pending") {
        pending += 1;
        totalPending += amt;
      }
    }
    return { total: schedule.length, paid, pending, totalEmi, totalPending };
  }, [schedule]);

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Loan Management</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Loan policies, employee loans, EMI schedules & prepayments
        </p>
      </div>

      {/* Banners */}
      {error && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} className="text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex w-fit gap-1 rounded-md border border-[#d1d5db] bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => { setActiveTab(tab.key); setError(""); setSuccess(""); }}
            className={`rounded px-4 py-1.5 text-sm font-medium ${
              activeTab === tab.key
                ? "bg-[#E42527] text-white"
                : "text-[#6b7280] hover:bg-[#f9fafb]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============== POLICIES TAB ============== */}
      {activeTab === "policies" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#6b7280]">
              {policies.length} polic{policies.length === 1 ? "y" : "ies"} configured
            </p>
            <button
              type="button"
              onClick={() => {
                setError("");
                setPolicyForm(DEFAULT_POLICY_FORM);
                setShowPolicyForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
            >
              + Add Loan Policy
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
            {policiesLoading ? (
              <div className="py-16 text-center text-sm text-[#6b7280]">Loading…</div>
            ) : policies.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-sm font-medium text-[#1a1a1a]">No loan policies yet</p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Create a policy (e.g. Personal Loan @ 8%) to start issuing loans
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Loan Type</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Interest Rate</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Max Amount</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Max Tenure</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Min Service</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    {policies.map((p) => (
                      <tr key={p.loan_policy_id || p.id} className="hover:bg-[#fafafa]">
                        <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">{p.loan_type}</td>
                        <td className="px-5 py-3.5 text-[#6b7280]">
                          {Number(p.default_interest_rate || 0)}%
                        </td>
                        <td className="px-5 py-3.5 text-[#6b7280]">
                          {p.max_amount ? formatMoney(p.max_amount) : "No limit"}
                        </td>
                        <td className="px-5 py-3.5 text-[#6b7280]">
                          {p.max_tenure_months ? `${p.max_tenure_months} months` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-[#6b7280]">
                          {p.min_service_days ?? 0} days
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============== EMPLOYEE LOANS TAB ============== */}
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
              type="button"
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
                <div className="py-16 text-center text-sm text-[#6b7280]">Loading…</div>
              ) : employeeLoans.length === 0 ? (
                <div className="py-16 text-center text-sm text-[#6b7280]">
                  No loans found for this employee
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <th className="px-5 py-3 font-medium text-[#6b7280]">Loan Type</th>
                        <th className="px-5 py-3 font-medium text-[#6b7280]">Principal</th>
                        <th className="px-5 py-3 font-medium text-[#6b7280]">EMI</th>
                        <th className="px-5 py-3 font-medium text-[#6b7280]">Outstanding</th>
                        <th className="px-5 py-3 font-medium text-[#6b7280]">Tenure</th>
                        <th className="px-5 py-3 font-medium text-[#6b7280]">Start</th>
                        <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                        <th className="px-5 py-3 font-medium text-[#6b7280]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {employeeLoans.map((loan) => {
                        const loanId = loan.loan_id || loan.id;
                        const status = String(loan.status || "active").toLowerCase();
                        return (
                          <tr key={loanId} className="hover:bg-[#fafafa]">
                            <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">
                              {loan.loan_type || loan.loan_policy_name || "Loan"}
                            </td>
                            <td className="px-5 py-3.5 text-[#6b7280]">
                              {formatMoney(loan.principal_amount)}
                            </td>
                            <td className="px-5 py-3.5 text-[#6b7280]">
                              {loan.emi_amount ? formatMoney(loan.emi_amount) : "—"}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-[#1a1a1a]">
                              {formatMoney(loan.outstanding_amount)}
                            </td>
                            <td className="px-5 py-3.5 text-[#6b7280]">
                              {loan.tenure_months} mo
                            </td>
                            <td className="px-5 py-3.5 text-[#6b7280]">
                              {formatMonth(loan.start_month)}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                LOAN_STATUS_STYLE[status] || "bg-gray-100 text-gray-500"
                              }`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <button
                                type="button"
                                onClick={() => handleViewSchedule(loan)}
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
                </div>
              )}
            </div>
          )}

          {/* ---------- EMI Schedule + Prepay ---------- */}
          {selectedLoanId && (
            <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">EMI Schedule</h3>
                  {selectedLoanMeta && (
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      {selectedLoanMeta.loan_type || "Loan"} • Outstanding:{" "}
                      <span className="font-semibold text-[#1a1a1a]">
                        {formatMoney(selectedLoanMeta.outstanding_amount)}
                      </span>
                    </p>
                  )}
                </div>
                {scheduleSummary.total > 0 && (
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                      Paid: {scheduleSummary.paid}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                      Pending: {scheduleSummary.pending}
                    </span>
                  </div>
                )}
              </div>

              {scheduleLoading ? (
                <div className="py-8 text-center text-sm text-[#6b7280]">Loading schedule…</div>
              ) : schedule.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#6b7280]">
                  No EMI schedule found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-[#f9fafb]">
                        <th className="px-3 py-2 text-left font-medium text-[#6b7280]">#</th>
                        <th className="px-3 py-2 text-left font-medium text-[#6b7280]">Due Month</th>
                        <th className="px-3 py-2 text-right font-medium text-[#6b7280]">EMI Amount</th>
                        <th className="px-3 py-2 text-right font-medium text-[#6b7280]">Principal</th>
                        <th className="px-3 py-2 text-right font-medium text-[#6b7280]">Interest</th>
                        <th className="px-3 py-2 text-center font-medium text-[#6b7280]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {schedule.map((row, i) => {
                        const status = String(row.status || "pending").toLowerCase();
                        return (
                          <tr key={row.emi_id || i} className="hover:bg-[#fafafa]">
                            <td className="px-3 py-2 text-[#6b7280]">{row.emi_number ?? i + 1}</td>
                            {/* 🔥 FIX: due_month not due_date */}
                            <td className="px-3 py-2 text-[#6b7280]">
                              {formatMonth(row.due_month)}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold">
                              {formatMoney(row.emi_amount)}
                            </td>
                            <td className="px-3 py-2 text-right text-[#6b7280]">
                              {formatMoney(row.principal_component)}
                            </td>
                            <td className="px-3 py-2 text-right text-[#6b7280]">
                              {formatMoney(row.interest_component)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                EMI_STATUS_STYLE[status] || "bg-gray-100 text-gray-500"
                              }`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Prepay — only for active loans */}
              {String(selectedLoanMeta?.status || "active").toLowerCase() === "active" && (
                <div className="mt-5 border-t pt-4">
                  <h4 className="mb-2 text-sm font-semibold text-[#1a1a1a]">
                    Prepay / Early Close
                  </h4>
                  <form onSubmit={handlePrepay} className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#374151]">
                        Amount *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={prepayAmount}
                        onChange={(e) => setPrepayAmount(e.target.value)}
                        placeholder="e.g. 25000"
                        className="w-40 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#374151]">
                        Note
                      </label>
                      <input
                        value={prepayNote}
                        onChange={(e) => setPrepayNote(e.target.value)}
                        placeholder="Optional remark"
                        className="w-56 rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={prepaySubmitting}
                      className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
                    >
                      {prepaySubmitting ? "Processing…" : "Prepay"}
                    </button>
                  </form>
                  <p className="mt-2 text-xs text-[#6b7280]">
                    Prepay reduces outstanding. If it fully covers the balance, loan closes automatically.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ---------- Create Loan Modal ---------- */}
          {showLoanForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h2 className="text-lg font-semibold">New Employee Loan</h2>
                  <button
                    type="button"
                    onClick={() => setShowLoanForm(false)}
                    className="text-[#6b7280] hover:text-[#1a1a1a]"
                  >
                    ✕
                  </button>
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
                      {policies
                        .filter((p) => p.is_active !== false)
                        .map((p) => {
                          const id = p.loan_policy_id || p.id;
                          return id ? (
                            <option key={id} value={id}>
                              {p.loan_type} — {Number(p.default_interest_rate || 0)}%
                            </option>
                          ) : null;
                        })}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Principal Amount *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="1"
                        value={loanForm.principal_amount}
                        onChange={(e) =>
                          setLoanForm({ ...loanForm, principal_amount: e.target.value })
                        }
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Tenure (months) *
                      </label>
                      <input
                        required
                        type="number"
                        min="1"
                        value={loanForm.tenure_months}
                        onChange={(e) =>
                          setLoanForm({ ...loanForm, tenure_months: e.target.value })
                        }
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
                      onChange={(e) =>
                        setLoanForm({ ...loanForm, start_month: e.target.value })
                      }
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Notes</label>
                    <textarea
                      value={loanForm.notes}
                      onChange={(e) => setLoanForm({ ...loanForm, notes: e.target.value })}
                      rows={2}
                      placeholder="Optional remark"
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 border-t pt-3">
                    <button
                      type="button"
                      onClick={() => setShowLoanForm(false)}
                      className="rounded-md border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loanSubmitting}
                      className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60"
                    >
                      {loanSubmitting ? "Creating…" : "Create Loan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------- Policy Form Modal ---------- */}
      {showPolicyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">Add Loan Policy</h2>
              <button
                type="button"
                onClick={() => setShowPolicyForm(false)}
                className="text-[#6b7280] hover:text-[#1a1a1a]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePolicy} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium">Loan Type *</label>
                <input
                  required
                  value={policyForm.loan_type}
                  onChange={(e) =>
                    setPolicyForm({ ...policyForm, loan_type: e.target.value })
                  }
                  placeholder="e.g. Personal Loan"
                  className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={policyForm.default_interest_rate}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        default_interest_rate: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Max Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={policyForm.max_amount}
                    onChange={(e) =>
                      setPolicyForm({ ...policyForm, max_amount: e.target.value })
                    }
                    placeholder="No limit"
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Max Tenure (months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={policyForm.max_tenure_months}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        max_tenure_months: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Min Service Days
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={policyForm.min_service_days}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        min_service_days: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={policyForm.is_active}
                  onChange={(e) =>
                    setPolicyForm({ ...policyForm, is_active: e.target.checked })
                  }
                />
                Active
              </label>

              <div className="flex justify-end gap-3 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setShowPolicyForm(false)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={policySubmitting}
                  className="rounded-md bg-[#E42527] px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {policySubmitting ? "Saving…" : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}