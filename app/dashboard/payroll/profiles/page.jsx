// // "use client";

// // import { useEffect, useState } from "react";
// // import { api } from "@/app/lib/api";

// // // ---------------------------------------------
// // // Matches backend:
// // //   POST /api/v1/payroll/profile
// // // Body matches schemas.EmployeePayrollProfileCreate exactly.
// // // ---------------------------------------------

// // const DEFAULT_FORM = {
// //   employee_id: "",
// //   bank_name: "",
// //   bank_account_number: "",
// //   bank_ifsc: "",
// //   bank_branch: "",
// //   account_holder_name: "",
// //   uan_number: "",
// //   pf_number: "",
// //   esi_number: "",
// //   pan_number: "",
// //   aadhaar_number: "",
// //   tax_regime: "new",
// //   pf_applicable: true,
// //   esi_applicable: true,
// //   pt_applicable: true,
// //   lwf_applicable: false,
// //   pt_state: "",
// //   pay_schedule_id: "",
// // };

// // function getErrorMessage(err) {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // }

// // function getEmployees(response) {
// //   const data = response?.data?.data ?? response?.data ?? [];
// //   if (Array.isArray(data)) return data;
// //   return data?.employees ?? data?.items ?? data?.results ?? [];
// // }

// // function getEmployeeId(employee) {
// //   return employee.employee_id || employee.id || employee._id;
// // }

// // function getEmployeeName(employee) {
// //   const fullName = [employee.first_name, employee.last_name].filter(Boolean).join(" ");
// //   return fullName || employee.name || employee.full_name || getEmployeeId(employee);
// // }

// // export default function PayrollProfilesPage() {
// //   const [employees, setEmployees] = useState([]);
// //   const [form, setForm] = useState(DEFAULT_FORM);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       try {
// //         const response = await api.get("/api/v1/get/employees");
// //         setEmployees(getEmployees(response));
// //       } catch (err) {
// //         setError(getErrorMessage(err));
// //         setEmployees([]);
// //       }
// //     };

// //     fetchEmployees();
// //   }, []);

// //   function update(field, value) {
// //     setForm((prev) => ({ ...prev, [field]: value }));
// //   }

// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await api.post("/api/v1/payroll/profile", {
// //         employee_id: form.employee_id,
// //         bank_account_number: form.bank_account_number || null,
// //         bank_ifsc: form.bank_ifsc || null,
// //         bank_name: form.bank_name || null,
// //         account_holder_name: form.account_holder_name || null,
// //         bank_branch: form.bank_branch || null,
// //         uan_number: form.uan_number || null,
// //         pf_number: form.pf_number || null,
// //         esi_number: form.esi_number || null,
// //         pan_number: form.pan_number || null,
// //         aadhaar_number: form.aadhaar_number || null,
// //         pf_applicable: form.pf_applicable,
// //         esi_applicable: form.esi_applicable,
// //         pt_applicable: form.pt_applicable,
// //         lwf_applicable: form.lwf_applicable,
// //         pt_state: form.pt_state || null,
// //         tax_regime: form.tax_regime,
// //         pay_schedule_id: form.pay_schedule_id || null,
// //       });
// //       setSuccess("Payroll profile saved successfully");
// //     } catch (err) {
// //       setError(getErrorMessage(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#f5f6f8] p-6">
// //       <div className="mb-6">
// //         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Payroll Profile</h1>
// //         <p className="mt-1 text-sm text-[#6b7280]">Bank details, UAN, PF, ESI and tax settings for employee</p>
// //       </div>

// //       {error && <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>}
// //       {success && <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

// //       <div className="max-w-2xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="mb-1 block text-sm font-medium">Employee *</label>
// //             <select
// //               required
// //               value={form.employee_id}
// //               onChange={(e) => update("employee_id", e.target.value)}
// //               className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //             >
// //               <option value="">Select employee</option>
// //               {employees.map((employee) => {
// //                 const id = getEmployeeId(employee);
// //                 return id ? (
// //                   <option key={id} value={id}>
// //                     {getEmployeeName(employee)} ({id})
// //                   </option>
// //                 ) : null;
// //               })}
// //             </select>
// //           </div>

// //           <h3 className="pt-2 text-sm font-semibold text-[#374151]">Bank Details</h3>
// //           <div className="grid gap-4 sm:grid-cols-2">
// //             <input placeholder="Bank Name" value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="Account Number" value={form.bank_account_number} onChange={(e) => update("bank_account_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="IFSC Code" value={form.bank_ifsc} onChange={(e) => update("bank_ifsc", e.target.value.toUpperCase())} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="Branch" value={form.bank_branch} onChange={(e) => update("bank_branch", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="Account Holder Name" value={form.account_holder_name} onChange={(e) => update("account_holder_name", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm sm:col-span-2 focus:border-[#E42527] focus:outline-none" />
// //           </div>

// //           <h3 className="pt-2 text-sm font-semibold text-[#374151]">Statutory Details</h3>
// //           <div className="grid gap-4 sm:grid-cols-2">
// //             <input placeholder="UAN Number" value={form.uan_number} onChange={(e) => update("uan_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="PF Number" value={form.pf_number} onChange={(e) => update("pf_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="ESI Number" value={form.esi_number} onChange={(e) => update("esi_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="PAN Number" value={form.pan_number} onChange={(e) => update("pan_number", e.target.value.toUpperCase())} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="Aadhaar Number" value={form.aadhaar_number} onChange={(e) => update("aadhaar_number", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <input placeholder="PT State" value={form.pt_state} onChange={(e) => update("pt_state", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //             <select value={form.tax_regime} onChange={(e) => update("tax_regime", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm">
// //               <option value="new">New Tax Regime</option>
// //               <option value="old">Old Tax Regime</option>
// //             </select>
// //             <input placeholder="Pay Schedule ID (optional)" value={form.pay_schedule_id} onChange={(e) => update("pay_schedule_id", e.target.value)} className="rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none" />
// //           </div>

// //           <div className="flex flex-wrap gap-4 pt-2">
// //             <label className="flex items-center gap-2 text-sm">
// //               <input type="checkbox" checked={form.pf_applicable} onChange={(e) => update("pf_applicable", e.target.checked)} />
// //               PF Applicable
// //             </label>
// //             <label className="flex items-center gap-2 text-sm">
// //               <input type="checkbox" checked={form.esi_applicable} onChange={(e) => update("esi_applicable", e.target.checked)} />
// //               ESI Applicable
// //             </label>
// //             <label className="flex items-center gap-2 text-sm">
// //               <input type="checkbox" checked={form.pt_applicable} onChange={(e) => update("pt_applicable", e.target.checked)} />
// //               PT Applicable
// //             </label>
// //             <label className="flex items-center gap-2 text-sm">
// //               <input type="checkbox" checked={form.lwf_applicable} onChange={(e) => update("lwf_applicable", e.target.checked)} />
// //               LWF Applicable
// //             </label>
// //           </div>

// //           {error && <div className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</div>}

// //           <button type="submit" disabled={loading} className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
// //             {loading ? "Saving..." : "Save Profile"}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }



// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { api } from "@/app/lib/api";

// /* ================= CONSTANTS ================= */

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

// const TAX_REGIMES = [
//   { value: "new", label: "New Tax Regime" },
//   { value: "old", label: "Old Tax Regime" },
// ];

// /* ================= HELPERS ================= */

// function getErrorMessage(err) {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
//   if (typeof detail === "string") return detail;
//   if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
//   if (err?.response?.status === 401) return "Session expired. Please login again.";
//   if (err?.response?.status === 403) return "You don't have permission. Contact Payroll Officer/Admin.";
//   if (err?.response?.status === 404) return "Employee or profile not found.";
//   return err?.message || "Something went wrong";
// }

// function getEmployees(response) {
//   const data = response?.data?.data ?? response?.data ?? [];
//   if (Array.isArray(data)) return data;
//   return data?.employees ?? data?.items ?? data?.results ?? [];
// }

// function getEmployeeId(employee) {
//   return employee?.employee_id || employee?.id || employee?._id || "";
// }

// function getEmployeeName(employee) {
//   const full = [employee?.first_name, employee?.last_name].filter(Boolean).join(" ");
//   return full || employee?.name || employee?.full_name || getEmployeeId(employee);
// }

// /* ================= VALIDATORS ================= */

// const validatePAN = (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
// const validateIFSC = (v) => !v || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
// const validateAadhaar = (v) => !v || /^\d{12}$/.test(v.replace(/\s/g, ""));
// const validateUAN = (v) => !v || /^\d{12}$/.test(v);
// const validateAccountNumber = (v) => !v || /^\d{9,18}$/.test(v);
// const validatePhone = (v) => !v || /^\d{10}$/.test(v);

// /* ================= COMPONENT ================= */

// export default function PayrollProfilesPage() {
//   const [employees, setEmployees] = useState([]);
//   const [employeesLoading, setEmployeesLoading] = useState(true);

//   const [form, setForm] = useState(DEFAULT_FORM);
//   const [loading, setLoading] = useState(false);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [existingProfile, setExistingProfile] = useState(null);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [paySchedules, setPaySchedules] = useState([]);

//   /* ---------- Load employees ---------- */
//   useEffect(() => {
//     let cancelled = false;
//     setEmployeesLoading(true);

//     Promise.allSettled([
//       api.get("/api/v1/get/employees"),
//       // Optional: if backend has schedule list endpoint
//       api.get("/api/v1/payroll/pay-schedules").catch(() => null),
//     ]).then(([empRes, schedRes]) => {
//       if (cancelled) return;

//       if (empRes.status === "fulfilled") {
//         setEmployees(getEmployees(empRes.value));
//       } else {
//         setError(getErrorMessage(empRes.reason));
//         setEmployees([]);
//       }

//       if (schedRes.status === "fulfilled" && schedRes.value) {
//         const body = schedRes.value?.data ?? {};
//         const list = Array.isArray(body) ? body : body?.data ?? body?.items ?? [];
//         setPaySchedules(Array.isArray(list) ? list : []);
//       }

//       setEmployeesLoading(false);
//     });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ---------- Auto-dismiss success ---------- */
//   useEffect(() => {
//     if (!success) return;
//     const t = setTimeout(() => setSuccess(""), 4000);
//     return () => clearTimeout(t);
//   }, [success]);

//   /* ---------- Load existing profile when employee changes ---------- */
//   const loadExistingProfile = useCallback(async (employeeId) => {
//     if (!employeeId) {
//       setExistingProfile(null);
//       setForm(DEFAULT_FORM);
//       return;
//     }

//     setProfileLoading(true);
//     setError("");
//     setExistingProfile(null);

//     try {
//       // Try common endpoints
//       const res = await api
//         .get(`/api/v1/payroll/profile/${employeeId}`)
//         .catch(() => api.get(`/api/v1/payroll/profile?employee_id=${employeeId}`))
//         .catch(() => null);

//       if (res) {
//         const body = res?.data?.data ?? res?.data ?? {};
//         const profile = body?.profile ?? body;

//         if (profile && (profile.profile_id || profile.employee_id)) {
//           setExistingProfile(profile);
//           setForm({
//             employee_id: employeeId,
//             bank_name: profile.bank_name || "",
//             bank_account_number: profile.bank_account_number || "",
//             bank_ifsc: profile.bank_ifsc || "",
//             bank_branch: profile.bank_branch || "",
//             account_holder_name: profile.account_holder_name || "",
//             uan_number: profile.uan_number || "",
//             pf_number: profile.pf_number || "",
//             esi_number: profile.esi_number || "",
//             pan_number: profile.pan_number || "",
//             aadhaar_number: profile.aadhaar_number || "",
//             tax_regime: profile.tax_regime || "new",
//             pf_applicable: profile.pf_applicable ?? true,
//             esi_applicable: profile.esi_applicable ?? true,
//             pt_applicable: profile.pt_applicable ?? true,
//             lwf_applicable: profile.lwf_applicable ?? false,
//             pt_state: profile.pt_state || "",
//             pay_schedule_id: profile.pay_schedule_id || "",
//           });
//           setSuccess("");
//           return;
//         }
//       }

//       // No existing profile
//       setForm({ ...DEFAULT_FORM, employee_id: employeeId });
//     } catch (err) {
//       setError(getErrorMessage(err));
//       setForm({ ...DEFAULT_FORM, employee_id: employeeId });
//     } finally {
//       setProfileLoading(false);
//     }
//   }, []);

//   /* ---------- Field change ---------- */
//   function update(field, value) {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   }

//   function handleEmployeeChange(employeeId) {
//     setForm((prev) => ({ ...prev, employee_id: employeeId }));
//     setError("");
//     setSuccess("");
//     loadExistingProfile(employeeId);
//   }

//   function resetForm() {
//     setForm({
//       ...DEFAULT_FORM,
//       employee_id: form.employee_id,
//     });
//     setExistingProfile(null);
//     setError("");
//     setSuccess("");
//   }

//   /* ---------- Validation ---------- */
//   const validationError = useMemo(() => {
//     if (!form.employee_id) return "Please select an employee";
//     if (form.pan_number && !validatePAN(form.pan_number))
//       return "Invalid PAN format (e.g. ABCDE1234F)";
//     if (form.bank_ifsc && !validateIFSC(form.bank_ifsc))
//       return "Invalid IFSC format (e.g. HDFC0001234)";
//     if (form.aadhaar_number && !validateAadhaar(form.aadhaar_number))
//       return "Aadhaar must be 12 digits";
//     if (form.uan_number && !validateUAN(form.uan_number))
//       return "UAN must be 12 digits";
//     if (form.bank_account_number && !validateAccountNumber(form.bank_account_number))
//       return "Bank account number must be 9-18 digits";
//     return null;
//   }, [form]);

//   /* ---------- Submit ---------- */
//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     const isUpdate = Boolean(existingProfile);
//     if (isUpdate) {
//       if (!window.confirm("Update existing payroll profile?")) return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       await api.post("/api/v1/payroll/profile", {
//         employee_id: form.employee_id,
//         bank_account_number: form.bank_account_number.trim() || null,
//         bank_ifsc: form.bank_ifsc.trim().toUpperCase() || null,
//         bank_name: form.bank_name.trim() || null,
//         account_holder_name: form.account_holder_name.trim() || null,
//         bank_branch: form.bank_branch.trim() || null,
//         uan_number: form.uan_number.trim() || null,
//         pf_number: form.pf_number.trim() || null,
//         esi_number: form.esi_number.trim() || null,
//         pan_number: form.pan_number.trim().toUpperCase() || null,
//         aadhaar_number: form.aadhaar_number.trim() || null,
//         pf_applicable: form.pf_applicable,
//         esi_applicable: form.esi_applicable,
//         pt_applicable: form.pt_applicable,
//         lwf_applicable: form.lwf_applicable,
//         pt_state: form.pt_state.trim() || null,
//         tax_regime: form.tax_regime,
//         pay_schedule_id: form.pay_schedule_id.trim() || null,
//       });

//       setSuccess(
//         isUpdate
//           ? "Payroll profile updated successfully"
//           : "Payroll profile created successfully"
//       );

//       // Reload to reflect saved state
//       await loadExistingProfile(form.employee_id);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   const selectedEmployee = employees.find(
//     (e) => String(getEmployeeId(e)) === String(form.employee_id)
//   );

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] p-6">
//       <div className="mb-6">
//         <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
//           Payroll Profile
//         </h1>
//         <p className="mt-1 text-sm text-[#6b7280]">
//           Bank details, UAN, PF, ESI and tax settings for employee
//         </p>
//       </div>

//       {/* Banners */}
//       {error && (
//         <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
//           <span>{error}</span>
//           <button
//             type="button"
//             onClick={() => setError("")}
//             className="text-red-400 hover:text-red-600"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 flex items-start justify-between gap-3 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
//           <span>{success}</span>
//           <button
//             type="button"
//             onClick={() => setSuccess("")}
//             className="text-green-500 hover:text-green-700"
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       <div className="max-w-3xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
//         {/* Employee selector */}
//         <div className="mb-5">
//           <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//             Employee *
//           </label>
//           <select
//             required
//             value={form.employee_id}
//             onChange={(e) => handleEmployeeChange(e.target.value)}
//             disabled={employeesLoading}
//             className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none disabled:bg-slate-50"
//           >
//             <option value="">
//               {employeesLoading ? "Loading employees…" : "Select employee"}
//             </option>
//             {employees.map((employee) => {
//               const id = getEmployeeId(employee);
//               return id ? (
//                 <option key={id} value={id}>
//                   {getEmployeeName(employee)} ({id})
//                 </option>
//               ) : null;
//             })}
//           </select>

//           {form.employee_id && (
//             <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
//               {profileLoading ? (
//                 <span className="text-[#6b7280]">Loading profile…</span>
//               ) : existingProfile ? (
//                 <>
//                   <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
//                     Existing profile — updating
//                   </span>
//                   {existingProfile.tax_regime && (
//                     <span className="text-[#6b7280]">
//                       Tax regime:{" "}
//                       <span className="font-medium text-[#1a1a1a]">
//                         {String(existingProfile.tax_regime).toUpperCase()}
//                       </span>
//                     </span>
//                   )}
//                   {existingProfile.last_working_day && (
//                     <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700">
//                       Exited: {existingProfile.last_working_day}
//                     </span>
//                   )}
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="ml-auto rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-50"
//                   >
//                     Reset form
//                   </button>
//                 </>
//               ) : (
//                 <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
//                   New profile — will be created
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Bank Details */}
//           <div>
//             <h3 className="mb-3 text-sm font-semibold text-[#374151]">
//               Bank Details
//             </h3>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <Field
//                 label="Bank Name"
//                 placeholder="e.g. HDFC Bank"
//                 value={form.bank_name}
//                 onChange={(v) => update("bank_name", v)}
//               />
//               <Field
//                 label="Account Number"
//                 placeholder="9–18 digits"
//                 value={form.bank_account_number}
//                 onChange={(v) =>
//                   update("bank_account_number", v.replace(/\D/g, ""))
//                 }
//                 error={
//                   form.bank_account_number &&
//                   !validateAccountNumber(form.bank_account_number)
//                     ? "Must be 9–18 digits"
//                     : null
//                 }
//               />
//               <Field
//                 label="IFSC Code"
//                 placeholder="e.g. HDFC0001234"
//                 value={form.bank_ifsc}
//                 onChange={(v) =>
//                   update("bank_ifsc", v.toUpperCase().replace(/[^A-Z0-9]/g, ""))
//                 }
//                 maxLength={11}
//                 error={
//                   form.bank_ifsc && !validateIFSC(form.bank_ifsc)
//                     ? "Format: ABCD0123456"
//                     : null
//                 }
//               />
//               <Field
//                 label="Branch"
//                 placeholder="e.g. Andheri West"
//                 value={form.bank_branch}
//                 onChange={(v) => update("bank_branch", v)}
//               />
//               <div className="sm:col-span-2">
//                 <Field
//                   label="Account Holder Name"
//                   placeholder="Full name as on bank account"
//                   value={form.account_holder_name}
//                   onChange={(v) => update("account_holder_name", v)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Statutory Details */}
//           <div>
//             <h3 className="mb-3 text-sm font-semibold text-[#374151]">
//               Statutory Details
//             </h3>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <Field
//                 label="UAN Number"
//                 placeholder="12 digits"
//                 value={form.uan_number}
//                 onChange={(v) => update("uan_number", v.replace(/\D/g, ""))}
//                 maxLength={12}
//                 error={
//                   form.uan_number && !validateUAN(form.uan_number)
//                     ? "UAN must be 12 digits"
//                     : null
//                 }
//               />
//               <Field
//                 label="PF Number"
//                 placeholder="e.g. MH/BAN/12345/000"
//                 value={form.pf_number}
//                 onChange={(v) => update("pf_number", v)}
//               />
//               <Field
//                 label="ESI Number"
//                 placeholder="e.g. 1234567890"
//                 value={form.esi_number}
//                 onChange={(v) => update("esi_number", v)}
//               />
//               <Field
//                 label="PAN Number"
//                 placeholder="e.g. ABCDE1234F"
//                 value={form.pan_number}
//                 onChange={(v) =>
//                   update("pan_number", v.toUpperCase().replace(/[^A-Z0-9]/g, ""))
//                 }
//                 maxLength={10}
//                 error={
//                   form.pan_number && !validatePAN(form.pan_number)
//                     ? "Format: ABCDE1234F"
//                     : null
//                 }
//               />
//               <Field
//                 label="Aadhaar Number"
//                 placeholder="12 digits"
//                 value={form.aadhaar_number}
//                 onChange={(v) =>
//                   update("aadhaar_number", v.replace(/\s/g, "").replace(/\D/g, ""))
//                 }
//                 maxLength={12}
//                 error={
//                   form.aadhaar_number && !validateAadhaar(form.aadhaar_number)
//                     ? "Aadhaar must be 12 digits"
//                     : null
//                 }
//               />
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                   PT State
//                 </label>
//                 <input
//                   placeholder="e.g. Maharashtra"
//                   value={form.pt_state}
//                   onChange={(e) => update("pt_state", e.target.value)}
//                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                   Tax Regime
//                 </label>
//                 <select
//                   value={form.tax_regime}
//                   onChange={(e) => update("tax_regime", e.target.value)}
//                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                 >
//                   {TAX_REGIMES.map((r) => (
//                     <option key={r.value} value={r.value}>
//                       {r.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//                   Pay Schedule
//                 </label>
//                 {paySchedules.length > 0 ? (
//                   <select
//                     value={form.pay_schedule_id}
//                     onChange={(e) => update("pay_schedule_id", e.target.value)}
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                   >
//                     <option value="">Default</option>
//                     {paySchedules.map((s) => {
//                       const id = s.pay_schedule_id || s.id;
//                       return id ? (
//                         <option key={id} value={id}>
//                           {s.schedule_name || s.name || id}
//                         </option>
//                       ) : null;
//                     })}
//                   </select>
//                 ) : (
//                   <input
//                     placeholder="Optional — Pay schedule ID"
//                     value={form.pay_schedule_id}
//                     onChange={(e) => update("pay_schedule_id", e.target.value)}
//                     className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Applicability Flags */}
//           <div>
//             <h3 className="mb-3 text-sm font-semibold text-[#374151]">
//               Applicability
//             </h3>
//             <div className="grid grid-cols-2 gap-3 rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-4 sm:grid-cols-4">
//               {[
//                 ["pf_applicable", "PF"],
//                 ["esi_applicable", "ESI"],
//                 ["pt_applicable", "PT"],
//                 ["lwf_applicable", "LWF"],
//               ].map(([field, label]) => (
//                 <label
//                   key={field}
//                   className="flex cursor-pointer items-center gap-2 text-sm"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={form[field]}
//                     onChange={(e) => update(field, e.target.checked)}
//                     className="h-4 w-4 rounded border-slate-300"
//                   />
//                   {label}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Validation summary */}
//           {validationError && (
//             <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
//               {validationError}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex justify-end gap-3 border-t pt-4">
//             <button
//               type="button"
//               onClick={resetForm}
//               disabled={loading}
//               className="rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//             >
//               Reset
//             </button>
//             <button
//               type="submit"
//               disabled={loading || !!validationError || !form.employee_id}
//               className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
//             >
//               {loading
//                 ? "Saving…"
//                 : existingProfile
//                 ? "Update Profile"
//                 : "Save Profile"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Info strip — selected employee */}
//       {selectedEmployee && (
//         <div className="mt-4 max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
//           <p className="text-xs uppercase tracking-wide text-[#6b7280]">
//             Selected employee
//           </p>
//           <p className="mt-1 font-medium text-[#1a1a1a]">
//             {getEmployeeName(selectedEmployee)}
//           </p>
//           <p className="text-xs text-[#6b7280]">
//             ID: {getEmployeeId(selectedEmployee)}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE FIELD ================= */

// function Field({
//   label,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   error,
//   maxLength,
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-sm font-medium text-[#374151]">
//         {label}
//       </label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         maxLength={maxLength}
//         onChange={(e) => onChange(e.target.value)}
//         className={`w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none ${
//           error
//             ? "border-red-300 focus:border-red-500"
//             : "border-[#d1d5db] focus:border-[#E42527]"
//         }`}
//       />
//       {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

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

const PAGE_SIZE = 10;

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail))
    return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired. Please login again.";
  if (err?.response?.status === 403) return "You don't have permission.";
  if (err?.response?.status === 404) return "Not found.";
  return err?.message || "Something went wrong";
}

function unwrapList(response) {
  if (!response) return [];
  const body = response?.data ?? response;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.results)) return body.results;
  if (Array.isArray(body?.profiles)) return body.profiles;
  if (Array.isArray(body?.employees)) return body.employees;
  return [];
}

function getEmployeeId(employee) {
  return employee?.employee_id || employee?.id || employee?._id || "";
}

function getEmployeeName(employee) {
  if (!employee) return "";
  const direct =
    employee.name ||
    employee.full_name ||
    employee.fullName ||
    employee.display_name ||
    employee.employee_name ||
    employee.employeeName;
  if (direct && String(direct).trim()) return String(direct).trim();

  const first = employee.first_name || employee.firstName;
  const last = employee.last_name || employee.lastName;
  const full = [first, last].filter(Boolean).join(" ").trim();
  if (full) return full;

  if (employee.user) {
    const u = employee.user;
    const uFull = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    if (uFull) return uFull;
    if (u.name) return u.name;
    if (u.email) return u.email.split("@")[0];
  }

  const email = employee.email || employee.personal_email;
  if (email && String(email).includes("@")) return String(email).split("@")[0];

  return getEmployeeId(employee) || "Employee";
}

function exportToCSV(rows, filename = "payroll_profiles.csv") {
  if (!rows?.length) return;

  const headers = [
    "Employee ID",
    "Employee Name",
    "Bank Name",
    "Account Number",
    "IFSC",
    "Branch",
    "Account Holder",
    "UAN",
    "PF Number",
    "ESI Number",
    "PAN",
    "Aadhaar",
    "Tax Regime",
    "PT State",
    "PF",
    "ESI",
    "PT",
    "LWF",
  ];

  const csvRows = [headers.join(",")];
  rows.forEach((r) => {
    csvRows.push(
      [
        r.employee_id || "",
        r.employee_name || "",
        r.bank_name || "",
        r.bank_account_number || "",
        r.bank_ifsc || "",
        r.bank_branch || "",
        r.account_holder_name || "",
        r.uan_number || "",
        r.pf_number || "",
        r.esi_number || "",
        r.pan_number || "",
        r.aadhaar_number || "",
        r.tax_regime || "",
        r.pt_state || "",
        r.pf_applicable ? "Yes" : "No",
        r.esi_applicable ? "Yes" : "No",
        r.pt_applicable ? "Yes" : "No",
        r.lwf_applicable ? "Yes" : "No",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ═══════════════════════════════════════════════════════════
   VALIDATORS
   ═══════════════════════════════════════════════════════════ */

const validatePAN = (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
const validateIFSC = (v) => !v || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
const validateAadhaar = (v) => !v || /^\d{12}$/.test(v.replace(/\s/g, ""));
const validateUAN = (v) => !v || /^\d{12}$/.test(v);
const validateAccountNumber = (v) => !v || /^\d{9,18}$/.test(v);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function PayrollProfilesPage() {
  /* ── Master data ── */
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [paySchedules, setPaySchedules] = useState([]);

  /* ── Profiles list ── */
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | pf | esi | pt
  const [sortBy, setSortBy] = useState("recent"); // recent | name | employee_id
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());

  /* ── Drawer states ── */
  const [showForm, setShowForm] = useState(false);
  const [viewProfile, setViewProfile] = useState(null);

  /* ── Form state ── */
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);

  /* ── Toast ── */
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ═══════════════ Load employees ═══════════════ */
  useEffect(() => {
    let cancelled = false;
    setEmployeesLoading(true);

    Promise.allSettled([
      api.get("/api/v1/get/employees"),
      api.get("/api/v1/payroll/pay-schedules").catch(() => null),
    ]).then(([empRes, schedRes]) => {
      if (cancelled) return;

      if (empRes.status === "fulfilled") {
        setEmployees(unwrapList(empRes.value));
      } else {
        setError(getErrorMessage(empRes.reason));
      }

      if (schedRes.status === "fulfilled" && schedRes.value) {
        setPaySchedules(unwrapList(schedRes.value));
      }

      setEmployeesLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ═══════════════ Load profiles list ═══════════════ */
  const loadProfilesList = useCallback(async () => {
    setProfilesLoading(true);
    try {
      let list = [];
      const endpoints = [
        "/api/v1/payroll/profile/list",
        "/api/v1/payroll/profiles",
        "/api/v1/payroll/profile",
      ];

      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const got = unwrapList(res);
          if (Array.isArray(got)) {
            list = got;
            console.log(`[Profiles] loaded from ${ep}`, got.length);
            break;
          }
        } catch {
          continue;
        }
      }

      setProfiles(list);
      setSelectedIds(new Set());
      setPage(1);
    } catch (err) {
      console.error("[Profiles] load failed", err);
      setProfiles([]);
    } finally {
      setProfilesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfilesList();
  }, [loadProfilesList]);

  /* ═══════════════ Auto-dismiss toasts ═══════════════ */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(t);
  }, [error]);

  /* ═══════════════ Load single profile ═══════════════ */
  const loadProfileForEdit = useCallback(async (employeeId) => {
    if (!employeeId) {
      setExistingProfile(null);
      setForm(DEFAULT_FORM);
      return;
    }

    setProfileLoading(true);
    setError("");
    setExistingProfile(null);

    try {
      let res = null;
      try {
        res = await api.get(`/api/v1/payroll/profile/${employeeId}`);
      } catch (err) {
        if (err?.response?.status === 404) {
          try {
            res = await api.get(
              `/api/v1/payroll/profile?employee_id=${encodeURIComponent(employeeId)}`
            );
          } catch {
            res = null;
          }
        }
      }

      if (res) {
        const body = res?.data ?? {};
        const exists = body?.exists ?? false;
        const profile = body?.data ?? null;

        if (exists && profile) {
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
          return;
        }
      }

      setForm({ ...DEFAULT_FORM, employee_id: employeeId });
    } catch (err) {
      setForm({ ...DEFAULT_FORM, employee_id: employeeId });
    } finally {
      setProfileLoading(false);
    }
  }, []);

  /* ═══════════════ Form actions ═══════════════ */
  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEmployeeChange(employeeId) {
    setForm((prev) => ({ ...prev, employee_id: employeeId }));
    loadProfileForEdit(employeeId);
  }

  function openAddForm() {
    setForm(DEFAULT_FORM);
    setExistingProfile(null);
    setShowForm(true);
    setError("");
  }

  function openEditForm(profile) {
    setShowForm(true);
    setForm({
      employee_id: profile.employee_id,
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
    setExistingProfile(profile);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setForm(DEFAULT_FORM);
    setExistingProfile(null);
  }

  /* ═══════════════ Validation ═══════════════ */
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
    if (
      form.bank_account_number &&
      !validateAccountNumber(form.bank_account_number)
    )
      return "Bank account number must be 9-18 digits";
    return null;
  }, [form]);

  /* ═══════════════ Submit ═══════════════ */
  async function handleSubmit(e) {
    e.preventDefault();
    if (validationError) {
      setError(validationError);
      return;
    }

    const isUpdate = Boolean(existingProfile);
    setLoading(true);
    setError("");

    try {
      const payload = {
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
      };

      await api.post("/api/v1/payroll/profile", payload);

      setSuccess(
        isUpdate
          ? "Payroll profile updated successfully"
          : "Payroll profile created successfully"
      );

      closeForm();
      await loadProfilesList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  /* ═══════════════ Helpers ═══════════════ */
  function getEmployeeNameForId(empId) {
    const emp = employees.find((e) => String(getEmployeeId(e)) === String(empId));
    return emp ? getEmployeeName(emp) : empId;
  }

  /* ═══════════════ Stats ═══════════════ */
  const stats = useMemo(() => {
    const total = profiles.length;
    const pfCount = profiles.filter((p) => p.pf_applicable).length;
    const esiCount = profiles.filter((p) => p.esi_applicable).length;
    const ptCount = profiles.filter((p) => p.pt_applicable).length;
    const lwfCount = profiles.filter((p) => p.lwf_applicable).length;
    return { total, pfCount, esiCount, ptCount, lwfCount };
  }, [profiles]);

  /* ═══════════════ Filter + Sort ═══════════════ */
  const filteredProfiles = useMemo(() => {
    let list = [...profiles];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const empName = getEmployeeNameForId(p.employee_id).toLowerCase();
        return (
          (p.employee_id || "").toLowerCase().includes(q) ||
          (p.pan_number || "").toLowerCase().includes(q) ||
          (p.bank_name || "").toLowerCase().includes(q) ||
          (p.uan_number || "").toLowerCase().includes(q) ||
          empName.includes(q)
        );
      });
    }

    // Filter
    if (filterStatus === "pf") list = list.filter((p) => p.pf_applicable);
    else if (filterStatus === "esi") list = list.filter((p) => p.esi_applicable);
    else if (filterStatus === "pt") list = list.filter((p) => p.pt_applicable);

    // Sort
    if (sortBy === "name") {
      list.sort((a, b) =>
        getEmployeeNameForId(a.employee_id).localeCompare(
          getEmployeeNameForId(b.employee_id)
        )
      );
    } else if (sortBy === "employee_id") {
      list.sort((a, b) =>
        String(a.employee_id).localeCompare(String(b.employee_id))
      );
    }
    // recent = default order from API

    return list;
  }, [profiles, searchQuery, filterStatus, sortBy, employees]);

  /* ═══════════════ Pagination ═══════════════ */
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / PAGE_SIZE));
  const pagedProfiles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProfiles.slice(start, start + PAGE_SIZE);
  }, [filteredProfiles, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* ═══════════════ Selection ═══════════════ */
  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === pagedProfiles.length && pagedProfiles.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pagedProfiles.map((p) => p.profile_id || p.employee_id)));
    }
  }

  function exportSelected() {
    const rows = filteredProfiles
      .filter((p) => selectedIds.has(p.profile_id || p.employee_id))
      .map((p) => ({ ...p, employee_name: getEmployeeNameForId(p.employee_id) }));
    if (rows.length === 0) {
      setError("No profiles selected for export");
      return;
    }
    exportToCSV(rows, `payroll_profiles_${rows.length}_selected.csv`);
    setSuccess(`Exported ${rows.length} profile(s)`);
  }

  function exportAll() {
    const rows = filteredProfiles.map((p) => ({
      ...p,
      employee_name: getEmployeeNameForId(p.employee_id),
    }));
    if (rows.length === 0) {
      setError("No profiles to export");
      return;
    }
    exportToCSV(rows, `payroll_profiles_all.csv`);
    setSuccess(`Exported ${rows.length} profile(s)`);
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      {/* ══════════ TOP BAR ══════════ */}
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold text-[#1a1a1a]">
              Payroll Profiles
            </h1>
            <p className="mt-0.5 text-sm text-[#6b7280]">
              Manage employee bank, statutory & tax information
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportAll}
              disabled={profiles.length === 0}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              ⬇ Export CSV
            </button>
            <button
              type="button"
              onClick={loadProfilesList}
              disabled={profilesLoading}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              ⟳ Refresh
            </button>
            <button
              type="button"
              onClick={openAddForm}
              className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
            >
              + Add Profile
            </button>
          </div>
        </div>
      </div>

      {/* ══════════ TOASTS ══════════ */}
      <div className="pointer-events-none fixed right-6 top-6 z-[100] flex flex-col gap-2">
        {error && (
          <div className="pointer-events-auto flex min-w-[300px] max-w-md items-start gap-3 rounded-lg border border-red-100 bg-white px-4 py-3 shadow-lg">
            <span className="mt-0.5 text-red-500">⚠</span>
            <span className="flex-1 text-sm text-[#1a1a1a]">{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        )}
        {success && (
          <div className="pointer-events-auto flex min-w-[300px] max-w-md items-start gap-3 rounded-lg border border-green-100 bg-white px-4 py-3 shadow-lg">
            <span className="mt-0.5 text-green-500">✓</span>
            <span className="flex-1 text-sm text-[#1a1a1a]">{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="px-6 py-6">
        {/* ══════════ STATS CARDS ══════════ */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            label="Total Profiles"
            value={stats.total}
            accent="slate"
            icon="👥"
          />
          <StatCard
            label="PF Applicable"
            value={stats.pfCount}
            accent="blue"
            icon="🏦"
          />
          <StatCard
            label="ESI Applicable"
            value={stats.esiCount}
            accent="green"
            icon="🩺"
          />
          <StatCard
            label="PT Applicable"
            value={stats.ptCount}
            accent="amber"
            icon="📋"
          />
          <StatCard
            label="LWF Applicable"
            value={stats.lwfCount}
            accent="purple"
            icon="💰"
          />
        </div>

        {/* ══════════ MAIN CARD ══════════ */}
        <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-64">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search name, ID, PAN, bank…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-md border border-[#d1d5db] py-2 pl-9 pr-3 text-sm focus:border-[#E42527] focus:outline-none"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
              >
                <option value="all">All Profiles</option>
                <option value="pf">PF Applicable</option>
                <option value="esi">ESI Applicable</option>
                <option value="pt">PT Applicable</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name (A-Z)</option>
                <option value="employee_id">Employee ID</option>
              </select>
            </div>

            {/* Bulk actions */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700">
                <span className="font-medium">{selectedIds.size} selected</span>
                <button
                  type="button"
                  onClick={exportSelected}
                  className="rounded border border-blue-200 bg-white px-2 py-0.5 text-xs font-medium hover:bg-blue-100"
                >
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          {profilesLoading ? (
            <div className="p-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#E42527]" />
              <p className="mt-3 text-sm text-slate-500">Loading profiles…</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                📋
              </div>
              <p className="text-base font-medium text-[#1a1a1a]">
                {profiles.length === 0
                  ? "No payroll profiles yet"
                  : "No profiles match your filters"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {profiles.length === 0
                  ? "Get started by adding your first employee payroll profile"
                  : "Try adjusting your search or filters"}
              </p>
              {profiles.length === 0 && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
                >
                  + Add First Profile
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={
                            pagedProfiles.length > 0 &&
                            selectedIds.size === pagedProfiles.length
                          }
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </th>
                      <th className="px-4 py-3 font-medium">Employee</th>
                      <th className="px-4 py-3 font-medium">Bank Details</th>
                      <th className="px-4 py-3 font-medium">Statutory</th>
                      <th className="px-4 py-3 font-medium">Tax</th>
                      <th className="px-4 py-3 font-medium">Applicable</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagedProfiles.map((p, idx) => {
                      const rowId = p.profile_id || p.employee_id || idx;
                      const isSelected = selectedIds.has(rowId);
                      return (
                        <tr
                          key={rowId}
                          className={`transition-colors ${
                            isSelected ? "bg-blue-50/40" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(rowId)}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E42527] to-[#c91f21] text-xs font-semibold text-white">
                                {getInitials(
                                  getEmployeeNameForId(p.employee_id)
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-[#1a1a1a]">
                                  {getEmployeeNameForId(p.employee_id)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {p.employee_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#1a1a1a]">
                              {p.bank_name || "—"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {p.bank_account_number
                                ? `••••${String(p.bank_account_number).slice(
                                    -4
                                  )}`
                                : "—"}
                              {p.bank_ifsc ? ` · ${p.bank_ifsc}` : ""}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#1a1a1a]">
                              {p.pan_number || "—"}
                            </div>
                            <div className="text-xs text-slate-500">
                              UAN: {p.uan_number || "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-700">
                              {p.tax_regime || "new"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {p.pf_applicable && <Badge color="blue">PF</Badge>}
                              {p.esi_applicable && (
                                <Badge color="green">ESI</Badge>
                              )}
                              {p.pt_applicable && (
                                <Badge color="amber">PT</Badge>
                              )}
                              {p.lwf_applicable && (
                                <Badge color="purple">LWF</Badge>
                              )}
                              {!p.pf_applicable &&
                                !p.esi_applicable &&
                                !p.pt_applicable &&
                                !p.lwf_applicable && (
                                  <span className="text-xs text-slate-400">
                                    None
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewProfile(p)}
                                className="rounded border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditForm(p)}
                                className="rounded border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-sm">
                <div className="text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-[#1a1a1a]">
                    {(page - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium text-[#1a1a1a]">
                    {Math.min(page * PAGE_SIZE, filteredProfiles.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[#1a1a1a]">
                    {filteredProfiles.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <span className="px-2 text-xs text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══════════ FORM DRAWER ══════════ */}
      {showForm && (
        <FormDrawer
          form={form}
          update={update}
          handleEmployeeChange={handleEmployeeChange}
          handleSubmit={handleSubmit}
          closeForm={closeForm}
          loading={loading}
          profileLoading={profileLoading}
          existingProfile={existingProfile}
          validationError={validationError}
          employees={employees}
          employeesLoading={employeesLoading}
          paySchedules={paySchedules}
          getEmployeeId={getEmployeeId}
          getEmployeeName={getEmployeeName}
        />
      )}

      {/* ══════════ VIEW DRAWER ══════════ */}
      {viewProfile && (
        <ViewDrawer
          profile={viewProfile}
          onClose={() => setViewProfile(null)}
          onEdit={() => {
            const p = viewProfile;
            setViewProfile(null);
            openEditForm(p);
          }}
          employeeName={getEmployeeNameForId(viewProfile.employee_id)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function StatCard({ label, value, accent = "slate", icon }) {
  const accents = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${accents[accent]}`}>
          {icon}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-[#1a1a1a]">{value}</div>
    </div>
  );
}

function Badge({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function getInitials(name) {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  maxLength,
  hint,
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
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORM DRAWER (right side slide-in)
   ═══════════════════════════════════════════════════════════ */

function FormDrawer({
  form,
  update,
  handleEmployeeChange,
  handleSubmit,
  closeForm,
  loading,
  profileLoading,
  existingProfile,
  validationError,
  employees,
  employeesLoading,
  paySchedules,
  getEmployeeId,
  getEmployeeName,
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={closeForm}
      />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              {existingProfile ? "Edit Payroll Profile" : "Add Payroll Profile"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {existingProfile
                ? `Editing ${form.employee_id}`
                : "Fill employee bank, statutory & tax details"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeForm}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* Employee */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                Employee *
              </label>
              <select
                required
                value={form.employee_id}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                disabled={employeesLoading || !!existingProfile}
                className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none disabled:bg-slate-50"
              >
                <option value="">
                  {employeesLoading
                    ? "Loading employees…"
                    : `Select employee (${employees.length})`}
                </option>
                {employees.map((employee) => {
                  const id = getEmployeeId(employee);
                  const name = getEmployeeName(employee);
                  if (!id) return null;
                  return (
                    <option key={id} value={id}>
                      {name} — {id}
                    </option>
                  );
                })}
              </select>

              {form.employee_id && (
                <div className="mt-2 text-xs">
                  {profileLoading ? (
                    <span className="text-slate-500">Loading profile…</span>
                  ) : existingProfile ? (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
                      Existing profile will be updated
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                      New profile will be created
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bank Details */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#374151]">
                🏦 Bank Details
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
                    !/^\d{9,18}$/.test(form.bank_account_number)
                      ? "Must be 9–18 digits"
                      : null
                  }
                />
                <Field
                  label="IFSC Code"
                  placeholder="e.g. HDFC0001234"
                  value={form.bank_ifsc}
                  onChange={(v) =>
                    update(
                      "bank_ifsc",
                      v.toUpperCase().replace(/[^A-Z0-9]/g, "")
                    )
                  }
                  maxLength={11}
                  error={
                    form.bank_ifsc &&
                    !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.bank_ifsc)
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

            {/* Statutory */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#374151]">
                📋 Statutory Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="UAN Number"
                  placeholder="12 digits"
                  value={form.uan_number}
                  onChange={(v) => update("uan_number", v.replace(/\D/g, ""))}
                  maxLength={12}
                  error={
                    form.uan_number && !/^\d{12}$/.test(form.uan_number)
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
                    update(
                      "pan_number",
                      v.toUpperCase().replace(/[^A-Z0-9]/g, "")
                    )
                  }
                  maxLength={10}
                  error={
                    form.pan_number &&
                    !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan_number)
                      ? "Format: ABCDE1234F"
                      : null
                  }
                />
                <Field
                  label="Aadhaar Number"
                  placeholder="12 digits"
                  value={form.aadhaar_number}
                  onChange={(v) =>
                    update(
                      "aadhaar_number",
                      v.replace(/\s/g, "").replace(/\D/g, "")
                    )
                  }
                  maxLength={12}
                  error={
                    form.aadhaar_number &&
                    !/^\d{12}$/.test(form.aadhaar_number)
                      ? "Aadhaar must be 12 digits"
                      : null
                  }
                />
                <Field
                  label="PT State"
                  placeholder="e.g. Maharashtra"
                  value={form.pt_state}
                  onChange={(v) => update("pt_state", v)}
                />
              </div>
            </div>

            {/* Tax & Schedule */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#374151]">
                💼 Tax & Schedule
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
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
                      onChange={(e) =>
                        update("pay_schedule_id", e.target.value)
                      }
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
                      onChange={(e) =>
                        update("pay_schedule_id", e.target.value)
                      }
                      className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Applicability */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#374151]">
                ⚙️ Applicability
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["pf_applicable", "PF"],
                  ["esi_applicable", "ESI"],
                  ["pt_applicable", "PT"],
                  ["lwf_applicable", "LWF"],
                ].map(([field, label]) => (
                  <label
                    key={field}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                      form[field]
                        ? "border-[#E42527] bg-red-50 text-[#E42527]"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
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

            {validationError && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                ⚠ {validationError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <button
              type="button"
              onClick={closeForm}
              disabled={loading}
              className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
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
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VIEW DRAWER
   ═══════════════════════════════════════════════════════════ */

function ViewDrawer({ profile, onClose, onEdit, employeeName }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#E42527] to-[#c91f21] text-sm font-semibold text-white">
              {getInitials(employeeName)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                {employeeName}
              </h2>
              <p className="text-xs text-slate-500">
                ID: {profile.employee_id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-sm">
          <Section title="🏦 Bank Details">
            <Row label="Bank Name" value={profile.bank_name} />
            <Row
              label="Account Number"
              value={profile.bank_account_number}
            />
            <Row label="IFSC" value={profile.bank_ifsc} />
            <Row label="Branch" value={profile.bank_branch} />
            <Row
              label="Account Holder"
              value={profile.account_holder_name}
            />
          </Section>

          <Section title="📋 Statutory Details">
            <Row label="UAN" value={profile.uan_number} />
            <Row label="PF Number" value={profile.pf_number} />
            <Row label="ESI Number" value={profile.esi_number} />
            <Row label="PAN" value={profile.pan_number} />
            <Row label="Aadhaar" value={profile.aadhaar_number} />
            <Row label="PT State" value={profile.pt_state} />
          </Section>

          <Section title="💼 Tax & Schedule">
            <Row
              label="Tax Regime"
              value={
                profile.tax_regime === "old"
                  ? "Old Regime"
                  : "New Regime"
              }
            />
            <Row
              label="Pay Schedule"
              value={profile.pay_schedule_id || "Default"}
            />
          </Section>

          <Section title="⚙️ Applicability">
            <div className="flex flex-wrap gap-2">
              {profile.pf_applicable && <Badge color="blue">PF</Badge>}
              {profile.esi_applicable && <Badge color="green">ESI</Badge>}
              {profile.pt_applicable && <Badge color="amber">PT</Badge>}
              {profile.lwf_applicable && <Badge color="purple">LWF</Badge>}
              {!profile.pf_applicable &&
                !profile.esi_applicable &&
                !profile.pt_applicable &&
                !profile.lwf_applicable && (
                  <span className="text-xs text-slate-400">
                    No statutory applicable
                  </span>
                )}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md bg-[#E42527] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="space-y-2 rounded-md border border-slate-100 bg-slate-50/50 p-3.5">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-[#1a1a1a]">
        {value || "—"}
      </span>
    </div>
  );
}