// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/app/lib/api";

// // ---------------------------------------------
// // Matches backend:
// //   POST /api/v1/payroll/profile
// // Body matches schemas.EmployeePayrollProfileCreate exactly.
// // ---------------------------------------------

// const DEFAULT_FORM = {
//   employee_id: "",
//   bank_name: "",
//   bank_account_number: "",
//   bank_ifsc: "",
//   bank_branch: "",
//   account_holder_name: "",
//   uan_number: "",
//   pf_number: "",
//   esi_number: "",
//   pan_number: "",
//   aadhaar_number: "",
//   tax_regime: "new",
//   pf_applicable: true,
//   esi_applicable: true,
//   pt_applicable: true,
//   lwf_applicable: false,
//   pt_state: "",
//   pay_schedule_id: "",
// };

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
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

// export default function PayrollProfilesPage() {
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState(DEFAULT_FORM);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await api.get("/api/v1/get/employees");
//         setEmployees(getEmployees(response));
//       } catch (err) {
//         setError(getErrorMessage(err));
//         setEmployees([]);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   function update(field, value) {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       await api.post("/api/v1/payroll/profile", {
//         employee_id: form.employee_id,
//         bank_account_number: form.bank_account_number || null,
//         bank_ifsc: form.bank_ifsc || null,
//         bank_name: form.bank_name || null,
//         account_holder_name: form.account_holder_name || null,
//         bank_branch: form.bank_branch || null,
//         uan_number: form.uan_number || null,
//         pf_number: form.pf_number || null,
//         esi_number: form.esi_number || null,
//         pan_number: form.pan_number || null,
//         aadhaar_number: form.aadhaar_number || null,
//         pf_applicable: form.pf_applicable,
//         esi_applicable: form.esi_applicable,
//         pt_applicable: form.pt_applicable,
//         lwf_applicable: form.lwf_applicable,
//         pt_state: form.pt_state || null,
//         tax_regime: form.tax_regime,
//         pay_schedule_id: form.pay_schedule_id || null,
//       });
//       setSuccess("Payroll profile saved successfully");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Payroll Profile</h1>
//         <p className="mt-1 text-sm text-[#6b7280]">Bank details, UAN, PF, ESI and tax settings for employee</p>
//       </div>

//       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
//       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

//       <div className="max-w-2xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="mb-1 block text-sm font-medium">Employee *</label>
//             <select
//               required
//               value={form.employee_id}
//               onChange={(e) => update("employee_id", e.target.value)}
//               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
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
//           </div>

//           <h3 className="pt-2 text-sm font-semibold text-[#374151]">Bank Details</h3>
//           <div className="grid gap-4 sm:grid-cols-2">
//             <input placeholder="Bank Name" value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="Account Number" value={form.bank_account_number} onChange={(e) => update("bank_account_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="IFSC Code" value={form.bank_ifsc} onChange={(e) => update("bank_ifsc", e.target.value.toUpperCase())} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="Branch" value={form.bank_branch} onChange={(e) => update("bank_branch", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="Account Holder Name" value={form.account_holder_name} onChange={(e) => update("account_holder_name", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm sm:col-span-2 focus:border-[#E42527] focus:outline-none" />
//           </div>

//           <h3 className="pt-2 text-sm font-semibold text-[#374151]">Statutory Details</h3>
//           <div className="grid gap-4 sm:grid-cols-2">
//             <input placeholder="UAN Number" value={form.uan_number} onChange={(e) => update("uan_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="PF Number" value={form.pf_number} onChange={(e) => update("pf_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="ESI Number" value={form.esi_number} onChange={(e) => update("esi_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="PAN Number" value={form.pan_number} onChange={(e) => update("pan_number", e.target.value.toUpperCase())} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="Aadhaar Number" value={form.aadhaar_number} onChange={(e) => update("aadhaar_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <input placeholder="PT State" value={form.pt_state} onChange={(e) => update("pt_state", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//             <select value={form.tax_regime} onChange={(e) => update("tax_regime", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm">
//               <option value="new">New Tax Regime</option>
//               <option value="old">Old Tax Regime</option>
//             </select>
//             <input placeholder="Pay Schedule ID (optional)" value={form.pay_schedule_id} onChange={(e) => update("pay_schedule_id", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
//           </div>

//           <div className="flex flex-wrap gap-4 pt-2">
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.pf_applicable} onChange={(e) => update("pf_applicable", e.target.checked)} />
//               PF Applicable
//             </label>
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.esi_applicable} onChange={(e) => update("esi_applicable", e.target.checked)} />
//               ESI Applicable
//             </label>
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.pt_applicable} onChange={(e) => update("pt_applicable", e.target.checked)} />
//               PT Applicable
//             </label>
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.lwf_applicable} onChange={(e) => update("lwf_applicable", e.target.checked)} />
//               LWF Applicable
//             </label>
//           </div>

//           {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}

//           <button type="submit" disabled={loading} className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
//             {loading ? "Saving..." : "Save Profile"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ================= CONSTANTS ================= */

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

const TAX_REGIMES = [
  { value: "new", label: "New Tax Regime" },
  { value: "old", label: "Old Tax Regime" },
];

/* ================= HELPERS ================= */

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission. Contact Payroll Officer/Admin.";
  if (err?.response?.status === 404) return "Employee or profile not found.";
  return err?.message || "Something went wrong";
}

function getEmployees(response) {
  const data = response?.data?.data ?? response?.data ?? [];
  if (Array.isArray(data)) return data;
  return data?.employees ?? data?.items ?? data?.results ?? [];
}

function getEmployeeId(employee) {
  return employee?.employee_id || employee?.id || employee?._id || "";
}

function getEmployeeName(employee) {
  const full = [employee?.first_name, employee?.last_name].filter(Boolean).join(" ");
  return full || employee?.name || employee?.full_name || getEmployeeId(employee);
}

/* ================= VALIDATORS ================= */

const validatePAN = (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
const validateIFSC = (v) => !v || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
const validateAadhaar = (v) => !v || /^\d{12}$/.test(v.replace(/\s/g, ""));
const validateUAN = (v) => !v || /^\d{12}$/.test(v);
const validateAccountNumber = (v) => !v || /^\d{9,18}$/.test(v);
const validatePhone = (v) => !v || /^\d{10}$/.test(v);

/* ================= COMPONENT ================= */

export default function PayrollProfilesPage() {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [paySchedules, setPaySchedules] = useState([]);

  /* ---------- Load employees ---------- */
  useEffect(() => {
    let cancelled = false;
    setEmployeesLoading(true);

    Promise.allSettled([
      api.get("/api/v1/get/employees"),
      // Optional: if backend has schedule list endpoint
      api.get("/api/v1/payroll/pay-schedules").catch(() => null),
    ]).then(([empRes, schedRes]) => {
      if (cancelled) return;

      if (empRes.status === "fulfilled") {
        setEmployees(getEmployees(empRes.value));
      } else {
        setError(getErrorMessage(empRes.reason));
        setEmployees([]);
      }

      if (schedRes.status === "fulfilled" && schedRes.value) {
        const body = schedRes.value?.data ?? {};
        const list = Array.isArray(body) ? body : body?.data ?? body?.items ?? [];
        setPaySchedules(Array.isArray(list) ? list : []);
      }

      setEmployeesLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Auto-dismiss success ---------- */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  /* ---------- Load existing profile when employee changes ---------- */
  const loadExistingProfile = useCallback(async (employeeId) => {
    if (!employeeId) {
      setExistingProfile(null);
      setForm(DEFAULT_FORM);
      return;
    }

    setProfileLoading(true);
    setError("");
    setExistingProfile(null);

    try {
      // Try common endpoints
      const res = await api
        .get(`/api/v1/payroll/profile/${employeeId}`)
        .catch(() => api.get(`/api/v1/payroll/profile?employee_id=${employeeId}`))
        .catch(() => null);

      if (res) {
        const body = res?.data?.data ?? res?.data ?? {};
        const profile = body?.profile ?? body;

        if (profile && (profile.profile_id || profile.employee_id)) {
          setExistingProfile(profile);
          setForm({
            employee_id: employeeId,
            bank_name: profile.bank_name || "",
            bank_account_number: profile.bank_account_number || "",
            bank_ifsc: profile.bank_ifsc || "",
            bank_branch: profile.bank_branch || "",
            account_holder_name: profile.account_holder_name || "",
            uan_number: profile.uan_number || "",
            pf_number: profile.pf_number || "",
            esi_number: profile.esi_number || "",
            pan_number: profile.pan_number || "",
            aadhaar_number: profile.aadhaar_number || "",
            tax_regime: profile.tax_regime || "new",
            pf_applicable: profile.pf_applicable ?? true,
            esi_applicable: profile.esi_applicable ?? true,
            pt_applicable: profile.pt_applicable ?? true,
            lwf_applicable: profile.lwf_applicable ?? false,
            pt_state: profile.pt_state || "",
            pay_schedule_id: profile.pay_schedule_id || "",
          });
          setSuccess("");
          return;
        }
      }

      // No existing profile
      setForm({ ...DEFAULT_FORM, employee_id: employeeId });
    } catch (err) {
      setError(getErrorMessage(err));
      setForm({ ...DEFAULT_FORM, employee_id: employeeId });
    } finally {
      setProfileLoading(false);
    }
  }, []);

  /* ---------- Field change ---------- */
  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEmployeeChange(employeeId) {
    setForm((prev) => ({ ...prev, employee_id: employeeId }));
    setError("");
    setSuccess("");
    loadExistingProfile(employeeId);
  }

  function resetForm() {
    setForm({
      ...DEFAULT_FORM,
      employee_id: form.employee_id,
    });
    setExistingProfile(null);
    setError("");
    setSuccess("");
  }

  /* ---------- Validation ---------- */
  const validationError = useMemo(() => {
    if (!form.employee_id) return "Please select an employee";
    if (form.pan_number && !validatePAN(form.pan_number))
      return "Invalid PAN format (e.g. ABCDE1234F)";
    if (form.bank_ifsc && !validateIFSC(form.bank_ifsc))
      return "Invalid IFSC format (e.g. HDFC0001234)";
    if (form.aadhaar_number && !validateAadhaar(form.aadhaar_number))
      return "Aadhaar must be 12 digits";
    if (form.uan_number && !validateUAN(form.uan_number))
      return "UAN must be 12 digits";
    if (form.bank_account_number && !validateAccountNumber(form.bank_account_number))
      return "Bank account number must be 9-18 digits";
    return null;
  }, [form]);

  /* ---------- Submit ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    if (validationError) {
      setError(validationError);
      return;
    }

    const isUpdate = Boolean(existingProfile);
    if (isUpdate) {
      if (!window.confirm("Update existing payroll profile?")) return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/v1/payroll/profile", {
        employee_id: form.employee_id,
        bank_account_number: form.bank_account_number.trim() || null,
        bank_ifsc: form.bank_ifsc.trim().toUpperCase() || null,
        bank_name: form.bank_name.trim() || null,
        account_holder_name: form.account_holder_name.trim() || null,
        bank_branch: form.bank_branch.trim() || null,
        uan_number: form.uan_number.trim() || null,
        pf_number: form.pf_number.trim() || null,
        esi_number: form.esi_number.trim() || null,
        pan_number: form.pan_number.trim().toUpperCase() || null,
        aadhaar_number: form.aadhaar_number.trim() || null,
        pf_applicable: form.pf_applicable,
        esi_applicable: form.esi_applicable,
        pt_applicable: form.pt_applicable,
        lwf_applicable: form.lwf_applicable,
        pt_state: form.pt_state.trim() || null,
        tax_regime: form.tax_regime,
        pay_schedule_id: form.pay_schedule_id.trim() || null,
      });

      setSuccess(
        isUpdate
          ? "Payroll profile updated successfully"
          : "Payroll profile created successfully"
      );

      // Reload to reflect saved state
      await loadExistingProfile(form.employee_id);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const selectedEmployee = employees.find(
    (e) => String(getEmployeeId(e)) === String(form.employee_id)
  );

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
          Payroll Profile
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Bank details, UAN, PF, ESI and tax settings for employee
        </p>
      </div>

      {/* Banners */}
      {error && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-green-500 hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-3xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        {/* Employee selector */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-[#374151]">
            Employee *
          </label>
          <select
            required
            value={form.employee_id}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            disabled={employeesLoading}
            className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none disabled:bg-slate-50"
          >
            <option value="">
              {employeesLoading ? "Loading employees…" : "Select employee"}
            </option>
            {employees.map((employee) => {
              const id = getEmployeeId(employee);
              return id ? (
                <option key={id} value={id}>
                  {getEmployeeName(employee)} ({id})
                </option>
              ) : null;
            })}
          </select>

          {form.employee_id && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              {profileLoading ? (
                <span className="text-[#6b7280]">Loading profile…</span>
              ) : existingProfile ? (
                <>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
                    Existing profile — updating
                  </span>
                  {existingProfile.tax_regime && (
                    <span className="text-[#6b7280]">
                      Tax regime:{" "}
                      <span className="font-medium text-[#1a1a1a]">
                        {String(existingProfile.tax_regime).toUpperCase()}
                      </span>
                    </span>
                  )}
                  {existingProfile.last_working_day && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700">
                      Exited: {existingProfile.last_working_day}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="ml-auto rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Reset form
                  </button>
                </>
              ) : (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                  New profile — will be created
                </span>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Details */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#374151]">
              Bank Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Bank Name"
                placeholder="e.g. HDFC Bank"
                value={form.bank_name}
                onChange={(v) => update("bank_name", v)}
              />
              <Field
                label="Account Number"
                placeholder="9–18 digits"
                value={form.bank_account_number}
                onChange={(v) =>
                  update("bank_account_number", v.replace(/\D/g, ""))
                }
                error={
                  form.bank_account_number &&
                  !validateAccountNumber(form.bank_account_number)
                    ? "Must be 9–18 digits"
                    : null
                }
              />
              <Field
                label="IFSC Code"
                placeholder="e.g. HDFC0001234"
                value={form.bank_ifsc}
                onChange={(v) =>
                  update("bank_ifsc", v.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                }
                maxLength={11}
                error={
                  form.bank_ifsc && !validateIFSC(form.bank_ifsc)
                    ? "Format: ABCD0123456"
                    : null
                }
              />
              <Field
                label="Branch"
                placeholder="e.g. Andheri West"
                value={form.bank_branch}
                onChange={(v) => update("bank_branch", v)}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Account Holder Name"
                  placeholder="Full name as on bank account"
                  value={form.account_holder_name}
                  onChange={(v) => update("account_holder_name", v)}
                />
              </div>
            </div>
          </div>

          {/* Statutory Details */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#374151]">
              Statutory Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="UAN Number"
                placeholder="12 digits"
                value={form.uan_number}
                onChange={(v) => update("uan_number", v.replace(/\D/g, ""))}
                maxLength={12}
                error={
                  form.uan_number && !validateUAN(form.uan_number)
                    ? "UAN must be 12 digits"
                    : null
                }
              />
              <Field
                label="PF Number"
                placeholder="e.g. MH/BAN/12345/000"
                value={form.pf_number}
                onChange={(v) => update("pf_number", v)}
              />
              <Field
                label="ESI Number"
                placeholder="e.g. 1234567890"
                value={form.esi_number}
                onChange={(v) => update("esi_number", v)}
              />
              <Field
                label="PAN Number"
                placeholder="e.g. ABCDE1234F"
                value={form.pan_number}
                onChange={(v) =>
                  update("pan_number", v.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                }
                maxLength={10}
                error={
                  form.pan_number && !validatePAN(form.pan_number)
                    ? "Format: ABCDE1234F"
                    : null
                }
              />
              <Field
                label="Aadhaar Number"
                placeholder="12 digits"
                value={form.aadhaar_number}
                onChange={(v) =>
                  update("aadhaar_number", v.replace(/\s/g, "").replace(/\D/g, ""))
                }
                maxLength={12}
                error={
                  form.aadhaar_number && !validateAadhaar(form.aadhaar_number)
                    ? "Aadhaar must be 12 digits"
                    : null
                }
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                  PT State
                </label>
                <input
                  placeholder="e.g. Maharashtra"
                  value={form.pt_state}
                  onChange={(e) => update("pt_state", e.target.value)}
                  className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                  Tax Regime
                </label>
                <select
                  value={form.tax_regime}
                  onChange={(e) => update("tax_regime", e.target.value)}
                  className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                >
                  {TAX_REGIMES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                  Pay Schedule
                </label>
                {paySchedules.length > 0 ? (
                  <select
                    value={form.pay_schedule_id}
                    onChange={(e) => update("pay_schedule_id", e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  >
                    <option value="">Default</option>
                    {paySchedules.map((s) => {
                      const id = s.pay_schedule_id || s.id;
                      return id ? (
                        <option key={id} value={id}>
                          {s.schedule_name || s.name || id}
                        </option>
                      ) : null;
                    })}
                  </select>
                ) : (
                  <input
                    placeholder="Optional — Pay schedule ID"
                    value={form.pay_schedule_id}
                    onChange={(e) => update("pay_schedule_id", e.target.value)}
                    className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Applicability Flags */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#374151]">
              Applicability
            </h3>
            <div className="grid grid-cols-2 gap-3 rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-4 sm:grid-cols-4">
              {[
                ["pf_applicable", "PF"],
                ["esi_applicable", "ESI"],
                ["pt_applicable", "PT"],
                ["lwf_applicable", "LWF"],
              ].map(([field, label]) => (
                <label
                  key={field}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form[field]}
                    onChange={(e) => update(field, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Validation summary */}
          {validationError && (
            <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {validationError}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading || !!validationError || !form.employee_id}
              className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
            >
              {loading
                ? "Saving…"
                : existingProfile
                ? "Update Profile"
                : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Info strip — selected employee */}
      {selectedEmployee && (
        <div className="mt-4 max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#6b7280]">
            Selected employee
          </p>
          <p className="mt-1 font-medium text-[#1a1a1a]">
            {getEmployeeName(selectedEmployee)}
          </p>
          <p className="text-xs text-[#6b7280]">
            ID: {getEmployeeId(selectedEmployee)}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE FIELD ================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  maxLength,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-[#d1d5db] focus:border-[#E42527]"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}