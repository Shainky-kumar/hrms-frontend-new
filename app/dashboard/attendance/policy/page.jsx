

// "use client";
// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const PAGE_SIZE = 10;
// const DEBOUNCE_MS = 450;
// const AUTO_DISMISS_MS = 5000;

// const GEO_ACTIONS = [
//   { value: "allow", label: "Allow (no restriction)" },
//   { value: "warn", label: "Warn (allow + alert)" },
//   { value: "block", label: "Block (deny punch)" },
// ];

// /* Form tab definitions — order matters */
// const TABS = [
//   { id: "basic", label: "Basic", icon: "📋" },
//   { id: "timing", label: "Timing", icon: "⏰" },
//   { id: "punch", label: "Punch Rules", icon: "🎯" },
//   { id: "geo", label: "Geo-fence", icon: "📍" },
//   { id: "face", label: "Face", icon: "📸" },
//   { id: "break", label: "Break", icon: "☕" },
//   { id: "wfh", label: "WFH / OD", icon: "🏠" },
//   { id: "compoff", label: "Comp-Off", icon: "🔄" },
//   { id: "notify", label: "Alerts", icon: "🔔" },
// ];

// /* Initial / empty form */
// const EMPTY_FORM = {
//   /* Basic */
//   policy_name: "",
//   is_active: true,
//   effective_from: "",
//   effective_to: "",

//   /* Timing */
//   grace_minutes: 15,
//   late_mark_after_minutes: 30,
//   half_day_after_minutes: 120,
//   early_exit_grace_minutes: 15,
//   full_day_minutes: 480,
//   half_day_minutes: 240,
//   max_work_minutes: "",
//   allow_cross_midnight_shift: true,

//   /* Punch Rules */
//   allow_multiple_punches: true,
//   auto_punch_out_after_hours: "",
//   require_photo_on_punch: false,
//   require_location_on_punch: true,
//   auto_mark_absent_if_no_punch: true,
//   auto_mark_half_day_if_single_punch: true,
//   max_late_per_month: "",
//   max_consecutive_absent_days: "",
//   count_weekoff_as_present_if_worked: false,
//   count_holiday_as_present_if_worked: false,

//   /* Geo-fence */
//   geo_fence_enabled: false,
//   geo_fence_action: "warn",

//   /* Face */
//   face_recognition_enabled: false,
//   face_match_threshold: 0.75,

//   /* Break */
//   break_tracking_enabled: false,
//   max_break_minutes_per_day: "",
//   auto_deduct_break_minutes: "",

//   /* WFH / OD */
//   wfh_requires_approval: true,
//   wfh_max_days_per_month: "",
//   on_duty_enabled: true,
//   on_duty_requires_approval: true,

//   /* Comp-Off */
//   comp_off_enabled: false,
//   comp_off_expiry_days: "",

//   /* Notifications */
//   notify_manager_on_late: false,
//   notify_hr_on_absent: false,
// };

// /* ══════════════════════════════════════════════════════════
//    HELPERS
//    ══════════════════════════════════════════════════════════ */

// const formatApiError = (err) => {
//   const detail = err?.response?.data?.detail;
//   if (Array.isArray(detail)) {
//     return detail
//       .map((e) => {
//         const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
//         return field ? `${field}: ${e.msg}` : e.msg || "Error";
//       })
//       .join(" • ");
//   }
//   if (typeof detail === "string") return detail;
//   return err?.message || "Something went wrong";
// };

// const toArray = (p) => {
//   if (!p) return [];
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p.policy)) return p.policy;
//   if (Array.isArray(p.data)) return p.data;
//   if (Array.isArray(p.policies)) return p.policies;
//   if (Array.isArray(p.items)) return p.items;
//   return [];
// };

// const safeSliceDate = (v) => (v ? String(v).slice(0, 10) : "");

// const toNumberOrNull = (v) => {
//   if (v === "" || v === null || v === undefined) return null;
//   const n = Number(v);
//   return Number.isFinite(n) ? n : null;
// };

// /* ══════════════════════════════════════════════════════════
//    SUBCOMPONENTS
//    ══════════════════════════════════════════════════════════ */

// function Toast({ type, message, onDismiss }) {
//   useEffect(() => {
//     if (!message) return;
//     const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
//     return () => clearTimeout(t);
//   }, [message, onDismiss]);

//   if (!message) return null;
//   const styles =
//     type === "error"
//       ? "border-red-200 bg-red-50 text-red-700"
//       : "border-green-200 bg-green-50 text-green-700";

//   return (
//     <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
//       <span className="whitespace-pre-line">{message}</span>
//       <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
//     </div>
//   );
// }

// function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, loading, danger }) {
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === "Escape" && !loading) onCancel();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, loading, onCancel]);

//   if (!open) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
//       onClick={() => !loading && onCancel()}
//     >
//       <div
//         className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="text-base font-semibold text-slate-800">{title}</h3>
//         {message && <p className="mt-2 text-sm text-slate-500 whitespace-pre-line">{message}</p>}
//         <div className="mt-5 flex justify-end gap-2">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
//               danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"
//             }`}
//           >
//             {loading ? "Please wait..." : confirmLabel || "Confirm"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Field primitives ── */
// function Field({ label, hint, error, required, children }) {
//   return (
//     <div>
//       <label className="mb-1 block text-xs font-medium text-slate-600">
//         {label} {required && <span className="text-red-600">*</span>}
//       </label>
//       {children}
//       {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
//       {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
//     </div>
//   );
// }

// function TextInput({ value, onChange, ...props }) {
//   return (
//     <input
//       value={value ?? ""}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//       {...props}
//     />
//   );
// }

// function NumberInput({ value, onChange, min, max, step, ...props }) {
//   return (
//     <input
//       type="number"
//       value={value ?? ""}
//       onChange={(e) => onChange(e.target.value)}
//       min={min}
//       max={max}
//       step={step}
//       className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//       {...props}
//     />
//   );
// }

// function Select({ value, onChange, options }) {
//   return (
//     <select
//       value={value ?? ""}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
//     >
//       {options.map((o) => (
//         <option key={o.value} value={o.value}>
//           {o.label}
//         </option>
//       ))}
//     </select>
//   );
// }

// function Toggle({ checked, onChange, label, hint }) {
//   return (
//     <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:bg-slate-50">
//       <input
//         type="checkbox"
//         checked={!!checked}
//         onChange={(e) => onChange(e.target.checked)}
//         className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-red-600"
//       />
//       <div className="flex-1">
//         <div className="text-sm font-medium text-slate-700">{label}</div>
//         {hint && <div className="mt-0.5 text-[11px] text-slate-400">{hint}</div>}
//       </div>
//     </label>
//   );
// }

// /* ── Section wrapper ── */
// function Section({ title, description, children }) {
//   return (
//     <div className="space-y-3">
//       {title && (
//         <div className="border-b border-slate-100 pb-2">
//           <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
//           {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
//         </div>
//       )}
//       {children}
//     </div>
//   );
// }

// /* ── Status pill for list ── */
// function Pill({ children, tone = "slate" }) {
//   const tones = {
//     slate: "bg-slate-100 text-slate-700",
//     green: "bg-green-100 text-green-700",
//     red: "bg-red-100 text-red-700",
//     blue: "bg-blue-100 text-blue-700",
//     amber: "bg-amber-100 text-amber-700",
//   };
//   return (
//     <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tones[tone]}`}>
//       {children}
//     </span>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    FORM MODAL
//    ══════════════════════════════════════════════════════════ */

// function PolicyFormModal({ open, onClose, editRow, onSaved }) {
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [activeTab, setActiveTab] = useState("basic");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});

//   /* Populate on open */
//   useEffect(() => {
//     if (!open) return;
//     if (editRow) {
//       setForm({
//         policy_name: editRow.policy_name || "",
//         is_active: editRow.is_active !== false,
//         effective_from: safeSliceDate(editRow.effective_from),
//         effective_to: safeSliceDate(editRow.effective_to),

//         grace_minutes: editRow.grace_minutes ?? 15,
//         late_mark_after_minutes: editRow.late_mark_after_minutes ?? 30,
//         half_day_after_minutes: editRow.half_day_after_minutes ?? 120,
//         early_exit_grace_minutes: editRow.early_exit_grace_minutes ?? 15,
//         full_day_minutes: editRow.full_day_minutes ?? 480,
//         half_day_minutes: editRow.half_day_minutes ?? 240,
//         max_work_minutes: editRow.max_work_minutes ?? "",
//         allow_cross_midnight_shift: editRow.allow_cross_midnight_shift !== false,

//         allow_multiple_punches: editRow.allow_multiple_punches !== false,
//         auto_punch_out_after_hours: editRow.auto_punch_out_after_hours ?? "",
//         require_photo_on_punch: !!editRow.require_photo_on_punch,
//         require_location_on_punch: editRow.require_location_on_punch !== false,
//         auto_mark_absent_if_no_punch: editRow.auto_mark_absent_if_no_punch !== false,
//         auto_mark_half_day_if_single_punch: editRow.auto_mark_half_day_if_single_punch !== false,
//         max_late_per_month: editRow.max_late_per_month ?? "",
//         max_consecutive_absent_days: editRow.max_consecutive_absent_days ?? "",
//         count_weekoff_as_present_if_worked: !!editRow.count_weekoff_as_present_if_worked,
//         count_holiday_as_present_if_worked: !!editRow.count_holiday_as_present_if_worked,

//         geo_fence_enabled: !!editRow.geo_fence_enabled,
//         geo_fence_action: editRow.geo_fence_action || "warn",

//         face_recognition_enabled: !!editRow.face_recognition_enabled,
//         face_match_threshold: editRow.face_match_threshold ?? 0.75,

//         break_tracking_enabled: !!editRow.break_tracking_enabled,
//         max_break_minutes_per_day: editRow.max_break_minutes_per_day ?? "",
//         auto_deduct_break_minutes: editRow.auto_deduct_break_minutes ?? "",

//         wfh_requires_approval: editRow.wfh_requires_approval !== false,
//         wfh_max_days_per_month: editRow.wfh_max_days_per_month ?? "",
//         on_duty_enabled: editRow.on_duty_enabled !== false,
//         on_duty_requires_approval: editRow.on_duty_requires_approval !== false,

//         comp_off_enabled: !!editRow.comp_off_enabled,
//         comp_off_expiry_days: editRow.comp_off_expiry_days ?? "",

//         notify_manager_on_late: !!editRow.notify_manager_on_late,
//         notify_hr_on_absent: !!editRow.notify_hr_on_absent,
//       });
//     } else {
//       setForm(EMPTY_FORM);
//     }
//     setActiveTab("basic");
//     setError("");
//     setFieldErrors({});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, editRow]);

//   /* ESC close */
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === "Escape" && !saving) onClose();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, saving, onClose]);

//   const set = (key) => (value) => setForm((p) => ({ ...p, [key]: value }));

//   /* Validation */
//   const validate = () => {
//     const errs = {};
//     if (!form.policy_name.trim()) errs.policy_name = "Policy name required";
//     if (!form.effective_from) errs.effective_from = "Effective From required";
//     if (form.effective_to && form.effective_to < form.effective_from) {
//       errs.effective_to = "Must be after Effective From";
//     }

//     if (Number(form.full_day_minutes) <= 0) errs.full_day_minutes = "Must be > 0";
//     if (Number(form.half_day_minutes) <= 0) errs.half_day_minutes = "Must be > 0";
//     if (Number(form.half_day_minutes) >= Number(form.full_day_minutes)) {
//       errs.half_day_minutes = "Must be less than Full Day";
//     }

//     const fThreshold = Number(form.face_match_threshold);
//     if (form.face_recognition_enabled && (fThreshold < 0 || fThreshold > 1)) {
//       errs.face_match_threshold = "Must be between 0 and 1";
//     }

//     setFieldErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   /* Submit */
//   const submit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validate()) {
//       setError("Please fix the highlighted fields");
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         policy_name: form.policy_name.trim(),
//         is_active: form.is_active,
//         effective_from: form.effective_from,
//         effective_to: form.effective_to || null,

//         grace_minutes: Number(form.grace_minutes) || 0,
//         late_mark_after_minutes: Number(form.late_mark_after_minutes) || 0,
//         half_day_after_minutes: Number(form.half_day_after_minutes) || 0,
//         early_exit_grace_minutes: Number(form.early_exit_grace_minutes) || 0,
//         full_day_minutes: Number(form.full_day_minutes) || 480,
//         half_day_minutes: Number(form.half_day_minutes) || 240,
//         max_work_minutes: toNumberOrNull(form.max_work_minutes),
//         allow_cross_midnight_shift: !!form.allow_cross_midnight_shift,

//         allow_multiple_punches: !!form.allow_multiple_punches,
//         auto_punch_out_after_hours: toNumberOrNull(form.auto_punch_out_after_hours),
//         require_photo_on_punch: !!form.require_photo_on_punch,
//         require_location_on_punch: !!form.require_location_on_punch,
//         auto_mark_absent_if_no_punch: !!form.auto_mark_absent_if_no_punch,
//         auto_mark_half_day_if_single_punch: !!form.auto_mark_half_day_if_single_punch,
//         max_late_per_month: toNumberOrNull(form.max_late_per_month),
//         max_consecutive_absent_days: toNumberOrNull(form.max_consecutive_absent_days),
//         count_weekoff_as_present_if_worked: !!form.count_weekoff_as_present_if_worked,
//         count_holiday_as_present_if_worked: !!form.count_holiday_as_present_if_worked,

//         geo_fence_enabled: !!form.geo_fence_enabled,
//         geo_fence_action: form.geo_fence_action,

//         face_recognition_enabled: !!form.face_recognition_enabled,
//         face_match_threshold: Number(form.face_match_threshold) || 0.75,

//         break_tracking_enabled: !!form.break_tracking_enabled,
//         max_break_minutes_per_day: toNumberOrNull(form.max_break_minutes_per_day),
//         auto_deduct_break_minutes: toNumberOrNull(form.auto_deduct_break_minutes),

//         wfh_requires_approval: !!form.wfh_requires_approval,
//         wfh_max_days_per_month: toNumberOrNull(form.wfh_max_days_per_month),
//         on_duty_enabled: !!form.on_duty_enabled,
//         on_duty_requires_approval: !!form.on_duty_requires_approval,

//         comp_off_enabled: !!form.comp_off_enabled,
//         comp_off_expiry_days: toNumberOrNull(form.comp_off_expiry_days),

//         notify_manager_on_late: !!form.notify_manager_on_late,
//         notify_hr_on_absent: !!form.notify_hr_on_absent,
//       };

//       if (editRow) {
//         const id = editRow.attendance_policy_id || editRow.id;
//         await api.put(`/api/v1/attendence/policy/${id}`, payload);
//       } else {
//         await api.post("/api/v1/add/attendence/policy", payload);
//       }

//       onSaved?.(editRow ? "Policy updated" : "Policy created");
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
//       onClick={() => !saving && onClose()}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//           <div>
//             <h2 className="text-base font-semibold text-slate-800">
//               {editRow ? "Edit Attendance Policy" : "New Attendance Policy"}
//             </h2>
//             <p className="mt-0.5 text-xs text-slate-500">
//               Configure timings, punch rules, geo-fence, and more
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={saving}
//             className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
//             aria-label="Close"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-slate-100 px-2 py-2">
//           <div className="flex gap-1 overflow-x-auto scrollbar-thin">
//             {TABS.map((t) => (
//               <button
//                 key={t.id}
//                 type="button"
//                 onClick={() => setActiveTab(t.id)}
//                 className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
//                   activeTab === t.id
//                     ? "bg-red-50 text-red-700"
//                     : "text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 <span className="mr-1">{t.icon}</span>
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Body */}
//         <form
//           onSubmit={submit}
//           className="flex flex-1 flex-col overflow-hidden"
//         >
//           <div className="flex-1 overflow-y-auto p-5">
//             {error && (
//               <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
//                 {error}
//               </div>
//             )}

//             {/* ── BASIC ── */}
//             {activeTab === "basic" && (
//               <Section title="Basic Details" description="Policy name and validity window">
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div className="sm:col-span-2">
//                     <Field label="Policy Name" required error={fieldErrors.policy_name}>
//                       <TextInput
//                         value={form.policy_name}
//                         onChange={set("policy_name")}
//                         placeholder="e.g. Head Office — Standard 2026"
//                         maxLength={128}
//                         autoFocus
//                       />
//                     </Field>
//                   </div>

//                   <Field label="Effective From" required error={fieldErrors.effective_from}>
//                     <TextInput
//                       type="date"
//                       value={form.effective_from}
//                       onChange={set("effective_from")}
//                     />
//                   </Field>

//                   <Field
//                     label="Effective To"
//                     hint="Leave empty for no expiry"
//                     error={fieldErrors.effective_to}
//                   >
//                     <TextInput
//                       type="date"
//                       value={form.effective_to}
//                       onChange={set("effective_to")}
//                       min={form.effective_from || undefined}
//                     />
//                   </Field>

//                   <div className="sm:col-span-2">
//                     <Toggle
//                       checked={form.is_active}
//                       onChange={set("is_active")}
//                       label="Active"
//                       hint="Inactive policies are ignored when deciding attendance rules"
//                     />
//                   </div>
//                 </div>
//               </Section>
//             )}

//             {/* ── TIMING ── */}
//             {activeTab === "timing" && (
//               <Section
//                 title="Timing Rules"
//                 description="Define grace, late, half-day thresholds and full-day expectations"
//               >
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <Field label="Grace Minutes" hint="Extra minutes before late is marked">
//                     <NumberInput
//                       value={form.grace_minutes}
//                       onChange={set("grace_minutes")}
//                       min={0}
//                       max={120}
//                     />
//                   </Field>

//                   <Field label="Late Mark After" hint="Minutes past shift start to mark late">
//                     <NumberInput
//                       value={form.late_mark_after_minutes}
//                       onChange={set("late_mark_after_minutes")}
//                       min={0}
//                       max={480}
//                     />
//                   </Field>

//                   <Field label="Half Day After" hint="Minutes past shift start = half day">
//                     <NumberInput
//                       value={form.half_day_after_minutes}
//                       onChange={set("half_day_after_minutes")}
//                       min={0}
//                       max={720}
//                     />
//                   </Field>

//                   <Field label="Early Exit Grace" hint="Buffer before marking early exit">
//                     <NumberInput
//                       value={form.early_exit_grace_minutes}
//                       onChange={set("early_exit_grace_minutes")}
//                       min={0}
//                       max={120}
//                     />
//                   </Field>

//                   <Field label="Full Day Minutes" required error={fieldErrors.full_day_minutes}>
//                     <NumberInput
//                       value={form.full_day_minutes}
//                       onChange={set("full_day_minutes")}
//                       min={60}
//                       max={1440}
//                     />
//                   </Field>

//                   <Field
//                     label="Half Day Minutes"
//                     required
//                     error={fieldErrors.half_day_minutes}
//                     hint="Must be less than Full Day"
//                   >
//                     <NumberInput
//                       value={form.half_day_minutes}
//                       onChange={set("half_day_minutes")}
//                       min={30}
//                       max={720}
//                     />
//                   </Field>

//                   <Field
//                     label="Max Work Minutes"
//                     hint="Overtime calculated after this. Leave empty to disable"
//                   >
//                     <NumberInput
//                       value={form.max_work_minutes}
//                       onChange={set("max_work_minutes")}
//                       min={0}
//                       max={1440}
//                       placeholder="e.g. 540"
//                     />
//                   </Field>

//                   <div className="sm:col-span-2">
//                     <Toggle
//                       checked={form.allow_cross_midnight_shift}
//                       onChange={set("allow_cross_midnight_shift")}
//                       label="Allow Cross-Midnight Shift"
//                       hint="Night shifts that span midnight — punch out next day is allowed"
//                     />
//                   </div>
//                 </div>
//               </Section>
//             )}

//             {/* ── PUNCH RULES ── */}
//             {activeTab === "punch" && (
//               <Section title="Punch Behaviour" description="How punches are captured and evaluated">
//                 <div className="grid gap-3 sm:grid-cols-2">
//                   <Toggle
//                     checked={form.allow_multiple_punches}
//                     onChange={set("allow_multiple_punches")}
//                     label="Allow Multiple Punches"
//                     hint="If disabled, only first IN and last OUT are recorded"
//                   />
//                   <Toggle
//                     checked={form.require_location_on_punch}
//                     onChange={set("require_location_on_punch")}
//                     label="Require Location"
//                     hint="GPS must be enabled to punch"
//                   />
//                   <Toggle
//                     checked={form.require_photo_on_punch}
//                     onChange={set("require_photo_on_punch")}
//                     label="Require Photo"
//                     hint="Camera selfie needed at each punch"
//                   />
//                   <Toggle
//                     checked={form.auto_mark_absent_if_no_punch}
//                     onChange={set("auto_mark_absent_if_no_punch")}
//                     label="Auto Mark Absent"
//                     hint="If no punch by end of day, mark absent"
//                   />
//                   <Toggle
//                     checked={form.auto_mark_half_day_if_single_punch}
//                     onChange={set("auto_mark_half_day_if_single_punch")}
//                     label="Auto Half Day (Single Punch)"
//                     hint="If only one punch recorded, treat as half day"
//                   />
//                   <Toggle
//                     checked={form.count_weekoff_as_present_if_worked}
//                     onChange={set("count_weekoff_as_present_if_worked")}
//                     label="Week-off Counts as Present"
//                     hint="If employee worked on weekly off"
//                   />
//                   <Toggle
//                     checked={form.count_holiday_as_present_if_worked}
//                     onChange={set("count_holiday_as_present_if_worked")}
//                     label="Holiday Counts as Present"
//                     hint="If employee worked on a holiday"
//                   />

//                   <Field label="Auto Punch-Out After (hours)" hint="Force punch-out if forgotten">
//                     <NumberInput
//                       value={form.auto_punch_out_after_hours}
//                       onChange={set("auto_punch_out_after_hours")}
//                       min={0}
//                       max={48}
//                       placeholder="e.g. 14"
//                     />
//                   </Field>

//                   <Field label="Max Late per Month" hint="Alert threshold">
//                     <NumberInput
//                       value={form.max_late_per_month}
//                       onChange={set("max_late_per_month")}
//                       min={0}
//                       max={31}
//                     />
//                   </Field>

//                   <Field label="Max Consecutive Absent Days" hint="Alert HR beyond this">
//                     <NumberInput
//                       value={form.max_consecutive_absent_days}
//                       onChange={set("max_consecutive_absent_days")}
//                       min={0}
//                       max={30}
//                     />
//                   </Field>
//                 </div>
//               </Section>
//             )}

//             {/* ── GEO-FENCE ── */}
//             {activeTab === "geo" && (
//               <Section title="Geo-fencing" description="Restrict punches to approved office locations">
//                 <div className="space-y-3">
//                   <Toggle
//                     checked={form.geo_fence_enabled}
//                     onChange={set("geo_fence_enabled")}
//                     label="Enable Geo-fence"
//                     hint="Employees can only punch from assigned office locations"
//                   />

//                   {form.geo_fence_enabled && (
//                     <Field label="Geo-fence Action" hint="What to do when outside fence">
//                       <Select
//                         value={form.geo_fence_action}
//                         onChange={set("geo_fence_action")}
//                         options={GEO_ACTIONS}
//                       />
//                     </Field>
//                   )}

//                   <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-800">
//                     <p className="font-medium">ℹ️ Configure locations separately</p>
//                     <p className="mt-0.5 text-blue-700">
//                       Add office GPS coordinates from{" "}
//                       <strong>Attendance → Locations</strong> page.
//                     </p>
//                   </div>
//                 </div>
//               </Section>
//             )}

//             {/* ── FACE ── */}
//             {activeTab === "face" && (
//               <Section title="Face Recognition" description="AI-based face verification at punch">
//                 <div className="space-y-3">
//                   <Toggle
//                     checked={form.face_recognition_enabled}
//                     onChange={set("face_recognition_enabled")}
//                     label="Enable Face Recognition"
//                     hint="Employee's selfie is matched against enrolled face"
//                   />

//                   {form.face_recognition_enabled && (
//                     <Field
//                       label="Match Threshold"
//                       hint="0.5 = lenient, 0.75 = balanced (recommended), 0.9 = strict"
//                       error={fieldErrors.face_match_threshold}
//                     >
//                       <NumberInput
//                         value={form.face_match_threshold}
//                         onChange={set("face_match_threshold")}
//                         min={0}
//                         max={1}
//                         step={0.01}
//                       />
//                     </Field>
//                   )}

//                   <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
//                     <p className="font-medium">⚠️ Enroll faces first</p>
//                     <p className="mt-0.5 text-amber-700">
//                       Employees must enroll their face from{" "}
//                       <strong>Attendance → Biometrics</strong> before this rule works.
//                     </p>
//                   </div>
//                 </div>
//               </Section>
//             )}

//             {/* ── BREAK ── */}
//             {activeTab === "break" && (
//               <Section title="Break Tracking" description="Track tea, lunch, and personal breaks">
//                 <div className="space-y-3">
//                   <Toggle
//                     checked={form.break_tracking_enabled}
//                     onChange={set("break_tracking_enabled")}
//                     label="Enable Break Tracking"
//                     hint="Employees can start/end breaks from the app"
//                   />

//                   {form.break_tracking_enabled && (
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <Field label="Max Break Minutes / Day" hint="Alert if exceeded">
//                         <NumberInput
//                           value={form.max_break_minutes_per_day}
//                           onChange={set("max_break_minutes_per_day")}
//                           min={0}
//                           max={480}
//                         />
//                       </Field>

//                       <Field
//                         label="Auto-Deduct Break Minutes"
//                         hint="Fixed deduction (e.g. 60 for 1hr lunch)"
//                       >
//                         <NumberInput
//                           value={form.auto_deduct_break_minutes}
//                           onChange={set("auto_deduct_break_minutes")}
//                           min={0}
//                           max={180}
//                         />
//                       </Field>
//                     </div>
//                   )}
//                 </div>
//               </Section>
//             )}

//             {/* ── WFH / OD ── */}
//             {activeTab === "wfh" && (
//               <Section title="Work From Home & On Duty" description="Remote / field work rules">
//                 <div className="space-y-3">
//                   <Toggle
//                     checked={form.wfh_requires_approval}
//                     onChange={set("wfh_requires_approval")}
//                     label="WFH Requires Approval"
//                     hint="Manager must approve before employee can punch from home"
//                   />

//                   <Field label="WFH Max Days per Month" hint="Monthly limit">
//                     <NumberInput
//                       value={form.wfh_max_days_per_month}
//                       onChange={set("wfh_max_days_per_month")}
//                       min={0}
//                       max={31}
//                     />
//                   </Field>

//                   <Toggle
//                     checked={form.on_duty_enabled}
//                     onChange={set("on_duty_enabled")}
//                     label="On Duty Enabled"
//                     hint="Allow field/client site punches"
//                   />

//                   {form.on_duty_enabled && (
//                     <Toggle
//                       checked={form.on_duty_requires_approval}
//                       onChange={set("on_duty_requires_approval")}
//                       label="On Duty Requires Approval"
//                     />
//                   )}
//                 </div>
//               </Section>
//             )}

//             {/* ── COMP-OFF ── */}
//             {activeTab === "compoff" && (
//               <Section title="Comp-Off" description="Compensatory leave for extra work">
//                 <div className="space-y-3">
//                   <Toggle
//                     checked={form.comp_off_enabled}
//                     onChange={set("comp_off_enabled")}
//                     label="Enable Comp-Off"
//                     hint="Grant comp-off when employee works on week-off/holiday"
//                   />

//                   {form.comp_off_enabled && (
//                     <Field label="Expiry Days" hint="Comp-off expires after these days">
//                       <NumberInput
//                         value={form.comp_off_expiry_days}
//                         onChange={set("comp_off_expiry_days")}
//                         min={0}
//                         max={365}
//                       />
//                     </Field>
//                   )}
//                 </div>
//               </Section>
//             )}

//             {/* ── NOTIFICATIONS ── */}
//             {activeTab === "notify" && (
//               <Section title="Notifications" description="Auto-alert managers and HR">
//                 <div className="space-y-3">
//                   <Toggle
//                     checked={form.notify_manager_on_late}
//                     onChange={set("notify_manager_on_late")}
//                     label="Notify Manager on Late"
//                     hint="Email manager when their report punches late"
//                   />
//                   <Toggle
//                     checked={form.notify_hr_on_absent}
//                     onChange={set("notify_hr_on_absent")}
//                     label="Notify HR on Absent"
//                     hint="Alert HR when employee marked absent"
//                   />
//                 </div>
//               </Section>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
//             <div className="text-xs text-slate-500">
//               {TABS.findIndex((t) => t.id === activeTab) + 1} / {TABS.length}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={saving}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
//               >
//                 {saving ? "Saving..." : editRow ? "Update Policy" : "Create Policy"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function AttendancePolicyPage() {
//   const role = String(useAuthStore((s) => s.user?.role?.value || s.user?.role || "")).toLowerCase();
//   const isAdmin = role === "admin" || role === "approle.admin";

//   /* list */
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   /* ui */
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* modal */
//   const [showForm, setShowForm] = useState(false);
//   const [editRow, setEditRow] = useState(null);

//   /* confirm */
//   const [confirmDeactivate, setConfirmDeactivate] = useState(null);
//   const [deactivating, setDeactivating] = useState(false);

//   const reqIdRef = useRef(0);
//   const didInitRef = useRef(false);

//   /* ══════════════ FETCH ══════════════ */
//   const fetchList = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const params = { page, page_size: PAGE_SIZE };
//       if (search) params.search = search;
//       const res = await api.get("/api/v1/get/attendence/policy", { params });
//       if (myReqId !== reqIdRef.current) return;
//       const arr = toArray(res?.data);
//       setList(arr);
//       setTotal(Number(res?.data?.total) || arr.length);
//     } catch (err) {
//       if (myReqId !== reqIdRef.current) return;
//       setError(formatApiError(err));
//       setList([]);
//       setTotal(0);
//     } finally {
//       if (myReqId === reqIdRef.current) setLoading(false);
//     }
//   }, [page, search]);

//   useEffect(() => {
//     if (!didInitRef.current) {
//       didInitRef.current = true;
//       fetchList();
//       return;
//     }
//     const t = setTimeout(fetchList, DEBOUNCE_MS);
//     return () => clearTimeout(t);
//   }, [fetchList]);

//   /* ══════════════ ACTIONS ══════════════ */
//   const handleAdd = () => {
//     setEditRow(null);
//     setShowForm(true);
//   };

//   const handleEdit = (row) => {
//     setEditRow(row);
//     setShowForm(true);
//   };

//   const handleSaved = (msg) => {
//     setShowForm(false);
//     setEditRow(null);
//     setSuccess(msg);
//     fetchList();
//   };

//   const askDeactivate = (row) => {
//     setConfirmDeactivate(row);
//   };

//   const confirmDeactivateNow = async () => {
//     if (!confirmDeactivate) return;
//     setDeactivating(true);
//     setError("");
//     try {
//       const id = confirmDeactivate.attendance_policy_id || confirmDeactivate.id;
//       await api.put(`/api/v1/attendence/policy/${id}`, {
//         ...confirmDeactivate,
//         is_active: false,
//       });
//       setSuccess("Policy deactivated");
//       setConfirmDeactivate(null);
//       fetchList();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setDeactivating(false);
//     }
//   };

//   /* ══════════════ DERIVED ══════════════ */
//   const totalPages = useMemo(
//     () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
//     [total]
//   );

//   /* ══════════════ RENDER ══════════════ */
//   if (!isAdmin) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="text-4xl">🔒</div>
//           <h2 className="mt-3 text-lg font-semibold text-slate-800">Admin Access Required</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Only administrators can manage attendance policies.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-6xl">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Attendance Policy</h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Grace, half-day, geo, face, WFH & more — one place
//               {total > 0 && (
//                 <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
//                   {total} total
//                 </span>
//               )}
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={handleAdd}
//             className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
//           >
//             + New Policy
//           </button>
//         </div>

//         {/* Toast */}
//         <Toast type="error" message={error} onDismiss={() => setError("")} />
//         <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

//         {/* Search */}
//         <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="relative max-w-md">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search policies..."
//               className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2.5 text-sm focus:border-red-500 focus:outline-none"
//             />
//             <svg
//               className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
//               />
//             </svg>
//             {searchInput && (
//               <button
//                 type="button"
//                 onClick={() => setSearchInput("")}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             {loading && list.length === 0 ? (
//               <div className="space-y-2 p-5">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <div key={i} className="h-14 animate-pulse rounded bg-slate-100" />
//                 ))}
//               </div>
//             ) : list.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
//                   📋
//                 </div>
//                 <p className="text-sm font-medium text-slate-700">No policies yet</p>
//                 <p className="text-xs text-slate-500">
//                   Create your first attendance policy to get started
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleAdd}
//                   className="mt-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                 >
//                   + New Policy
//                 </button>
//               </div>
//             ) : (
//               <table className="w-full min-w-[900px] text-left text-sm">
//                 <thead>
//                   <tr className="border-b bg-slate-50">
//                     <th className="px-5 py-3 font-medium text-slate-500">Policy</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Timing</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Rules</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Validity</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Status</th>
//                     <th className="px-5 py-3 text-right font-medium text-slate-500">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {list.map((row, i) => {
//                     const id = row.attendance_policy_id || row.id || i;
//                     return (
//                       <tr key={id} className="hover:bg-slate-50">
//                         {/* Name */}
//                         <td className="px-5 py-3.5">
//                           <div className="font-medium text-slate-800">
//                             {row.policy_name}
//                           </div>
//                           {row.created_at && (
//                             <div className="mt-0.5 text-[11px] text-slate-400">
//                               Created{" "}
//                               {new Date(row.created_at).toLocaleDateString("en-IN", {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               })}
//                             </div>
//                           )}
//                         </td>

//                         {/* Timing */}
//                         <td className="px-5 py-3.5">
//                           <div className="flex flex-wrap gap-1">
//                             <Pill tone="slate">Grace {row.grace_minutes ?? 0}m</Pill>
//                             <Pill tone="slate">
//                               Full {row.full_day_minutes ?? 0}m
//                             </Pill>
//                             <Pill tone="slate">Half {row.half_day_minutes ?? 0}m</Pill>
//                           </div>
//                         </td>

//                         {/* Rules */}
//                         <td className="px-5 py-3.5">
//                           <div className="flex flex-wrap gap-1">
//                             {row.geo_fence_enabled && <Pill tone="blue">Geo</Pill>}
//                             {row.face_recognition_enabled && <Pill tone="blue">Face</Pill>}
//                             {row.require_photo_on_punch && <Pill tone="amber">Photo</Pill>}
//                             {row.break_tracking_enabled && <Pill tone="amber">Break</Pill>}
//                             {row.comp_off_enabled && <Pill tone="green">Comp-Off</Pill>}
//                             {!row.geo_fence_enabled &&
//                               !row.face_recognition_enabled &&
//                               !row.require_photo_on_punch &&
//                               !row.break_tracking_enabled &&
//                               !row.comp_off_enabled && (
//                                 <span className="text-xs text-slate-400">Basic</span>
//                               )}
//                           </div>
//                         </td>

//                         {/* Validity */}
//                         <td className="px-5 py-3.5 text-xs text-slate-500">
//                           {row.effective_from
//                             ? new Date(row.effective_from).toLocaleDateString("en-IN", {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               })
//                             : "—"}
//                           {" → "}
//                           {row.effective_to
//                             ? new Date(row.effective_to).toLocaleDateString("en-IN", {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               })
//                             : "No expiry"}
//                         </td>

//                         {/* Status */}
//                         <td className="px-5 py-3.5">
//                           {row.is_active !== false ? (
//                             <Pill tone="green">Active</Pill>
//                           ) : (
//                             <Pill tone="red">Inactive</Pill>
//                           )}
//                         </td>

//                         {/* Actions */}
//                         <td className="px-5 py-3.5 text-right">
//                           <button
//                             type="button"
//                             onClick={() => handleEdit(row)}
//                             className="text-xs font-medium text-slate-600 hover:text-red-600"
//                           >
//                             Edit
//                           </button>
//                           {row.is_active !== false && (
//                             <button
//                               type="button"
//                               onClick={() => askDeactivate(row)}
//                               className="ml-3 text-xs font-medium text-slate-400 hover:text-red-600"
//                             >
//                               Deactivate
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {!loading && list.length > 0 && totalPages > 1 && (
//             <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
//               <p className="text-xs text-slate-500">
//                 Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
//               </p>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   disabled={page <= 1}
//                   onClick={() => setPage((p) => p - 1)}
//                   className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Prev
//                 </button>
//                 <button
//                   type="button"
//                   disabled={page >= totalPages}
//                   onClick={() => setPage((p) => p + 1)}
//                   className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Form modal */}
//       <PolicyFormModal
//         open={showForm}
//         onClose={() => {
//           setShowForm(false);
//           setEditRow(null);
//         }}
//         editRow={editRow}
//         onSaved={handleSaved}
//       />

//       {/* Confirm deactivate */}
//       <ConfirmDialog
//         open={!!confirmDeactivate}
//         title="Deactivate Policy?"
//         message={
//           confirmDeactivate
//             ? `"${confirmDeactivate.policy_name}" will be marked inactive.\n\nExisting punches continue to use current rules, but new ones will fall back to the next active policy (or defaults).`
//             : ""
//         }
//         confirmLabel="Deactivate"
//         danger
//         loading={deactivating}
//         onConfirm={confirmDeactivateNow}
//         onCancel={() => setConfirmDeactivate(null)}
//       />
//     </div>
//   );
// }

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 450;
const AUTO_DISMISS_MS = 5000;

const GEO_ACTIONS = [
  { value: "allow", label: "Allow (no restriction)" },
  { value: "warn", label: "Warn (allow + alert)" },
  { value: "block", label: "Block (deny punch)" },
];

const TABS = [
  { id: "basic", label: "Basic", icon: "📋" },
  { id: "timing", label: "Timing", icon: "⏰" },
  { id: "punch", label: "Punch Rules", icon: "🎯" },
  { id: "geo", label: "Geo-fence", icon: "📍" },
  { id: "face", label: "Face", icon: "📸" },
  { id: "break", label: "Break", icon: "☕" },
  { id: "wfh", label: "WFH / OD", icon: "🏠" },
  { id: "compoff", label: "Comp-Off", icon: "🔄" },
  { id: "notify", label: "Alerts", icon: "🔔" },
];

const EMPTY_FORM = {
  /* Basic */
  policy_name: "",
  is_active: true,
  effective_from: "",
  effective_to: "",

  /* Timing — ⭐ NEW: min_work_minutes */
  min_work_minutes: 120,       // 2 hrs — iske niche ABSENT
  half_day_minutes: 240,       // 4 hrs — iske niche HALF_DAY  
  full_day_minutes: 480,       // 8 hrs — iske upar PRESENT
  grace_minutes: 15,
  late_mark_after_minutes: 30,
  half_day_after_minutes: 120,
  early_exit_grace_minutes: 15,
  max_work_minutes: "",
  allow_cross_midnight_shift: true,

  /* Punch Rules */
  allow_multiple_punches: true,
  auto_punch_out_after_hours: "",
  require_photo_on_punch: false,
  require_location_on_punch: true,
  auto_mark_absent_if_no_punch: true,
  auto_mark_half_day_if_single_punch: true,
  max_late_per_month: "",
  max_consecutive_absent_days: "",
  count_weekoff_as_present_if_worked: false,
  count_holiday_as_present_if_worked: false,

  /* Geo-fence */
  geo_fence_enabled: false,
  geo_fence_action: "warn",

  /* Face */
  face_recognition_enabled: false,
  face_match_threshold: 0.75,

  /* Break */
  break_tracking_enabled: false,
  max_break_minutes_per_day: "",
  auto_deduct_break_minutes: "",

  /* WFH / OD */
  wfh_requires_approval: true,
  wfh_max_days_per_month: "",
  on_duty_enabled: true,
  on_duty_requires_approval: true,

  /* Comp-Off */
  comp_off_enabled: false,
  comp_off_expiry_days: "",

  /* Notifications */
  notify_manager_on_late: false,
  notify_hr_on_absent: false,
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg || "Error";
      })
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const toArray = (p) => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (Array.isArray(p.policy)) return p.policy;
  if (Array.isArray(p.data)) return p.data;
  if (Array.isArray(p.policies)) return p.policies;
  if (Array.isArray(p.items)) return p.items;
  return [];
};

const safeSliceDate = (v) => (v ? String(v).slice(0, 10) : "");

const toNumberOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════════════════════════ */

function Toast({ type, message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700";

  return (
    <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <span className="whitespace-pre-line">{message}</span>
      <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, loading, danger }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {message && <p className="mt-2 text-sm text-slate-500 whitespace-pre-line">{message}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Field primitives ── */
function Field({ label, hint, error, required, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, ...props }) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
      {...props}
    />
  );
}

function NumberInput({ value, onChange, min, max, step, ...props }) {
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
      {...props}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:bg-slate-50">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-red-600"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {hint && <div className="mt-0.5 text-[11px] text-slate-400">{hint}</div>}
      </div>
    </label>
  );
}

function Section({ title, description, children }) {
  return (
    <div className="space-y-3">
      {title && (
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   FORM MODAL
   ══════════════════════════════════════════════════════════ */

function PolicyFormModal({ open, onClose, editRow, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  /* Populate on open */
  useEffect(() => {
    if (!open) return;
    if (editRow) {
      setForm({
        policy_name: editRow.policy_name || "",
        is_active: editRow.is_active !== false,
        effective_from: safeSliceDate(editRow.effective_from),
        effective_to: safeSliceDate(editRow.effective_to),

        min_work_minutes: editRow.min_work_minutes ?? 120,
        half_day_minutes: editRow.half_day_minutes ?? 240,
        full_day_minutes: editRow.full_day_minutes ?? 480,
        grace_minutes: editRow.grace_minutes ?? 15,
        late_mark_after_minutes: editRow.late_mark_after_minutes ?? 30,
        half_day_after_minutes: editRow.half_day_after_minutes ?? 120,
        early_exit_grace_minutes: editRow.early_exit_grace_minutes ?? 15,
        max_work_minutes: editRow.max_work_minutes ?? "",
        allow_cross_midnight_shift: editRow.allow_cross_midnight_shift !== false,

        allow_multiple_punches: editRow.allow_multiple_punches !== false,
        auto_punch_out_after_hours: editRow.auto_punch_out_after_hours ?? "",
        require_photo_on_punch: !!editRow.require_photo_on_punch,
        require_location_on_punch: editRow.require_location_on_punch !== false,
        auto_mark_absent_if_no_punch: editRow.auto_mark_absent_if_no_punch !== false,
        auto_mark_half_day_if_single_punch: editRow.auto_mark_half_day_if_single_punch !== false,
        max_late_per_month: editRow.max_late_per_month ?? "",
        max_consecutive_absent_days: editRow.max_consecutive_absent_days ?? "",
        count_weekoff_as_present_if_worked: !!editRow.count_weekoff_as_present_if_worked,
        count_holiday_as_present_if_worked: !!editRow.count_holiday_as_present_if_worked,

        geo_fence_enabled: !!editRow.geo_fence_enabled,
        geo_fence_action: editRow.geo_fence_action || "warn",

        face_recognition_enabled: !!editRow.face_recognition_enabled,
        face_match_threshold: editRow.face_match_threshold ?? 0.75,

        break_tracking_enabled: !!editRow.break_tracking_enabled,
        max_break_minutes_per_day: editRow.max_break_minutes_per_day ?? "",
        auto_deduct_break_minutes: editRow.auto_deduct_break_minutes ?? "",

        wfh_requires_approval: editRow.wfh_requires_approval !== false,
        wfh_max_days_per_month: editRow.wfh_max_days_per_month ?? "",
        on_duty_enabled: editRow.on_duty_enabled !== false,
        on_duty_requires_approval: editRow.on_duty_requires_approval !== false,

        comp_off_enabled: !!editRow.comp_off_enabled,
        comp_off_expiry_days: editRow.comp_off_expiry_days ?? "",

        notify_manager_on_late: !!editRow.notify_manager_on_late,
        notify_hr_on_absent: !!editRow.notify_hr_on_absent,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setActiveTab("basic");
    setError("");
    setFieldErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editRow]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, saving, onClose]);

  const set = (key) => (value) => setForm((p) => ({ ...p, [key]: value }));

  /* Validation */
  const validate = () => {
    const errs = {};
    if (!form.policy_name.trim()) errs.policy_name = "Policy name required";
    if (!form.effective_from) errs.effective_from = "Effective From required";
    if (form.effective_to && form.effective_to < form.effective_from) {
      errs.effective_to = "Must be after Effective From";
    }

    const minWork = Number(form.min_work_minutes);
    const halfDay = Number(form.half_day_minutes);
    const fullDay = Number(form.full_day_minutes);

    if (minWork <= 0) errs.min_work_minutes = "Must be > 0";
    if (halfDay <= 0) errs.half_day_minutes = "Must be > 0";
    if (fullDay <= 0) errs.full_day_minutes = "Must be > 0";
    if (minWork >= halfDay) {
      errs.min_work_minutes = "Must be less than Half Day";
    }
    if (halfDay >= fullDay) {
      errs.half_day_minutes = "Must be less than Full Day";
    }

    const fThreshold = Number(form.face_match_threshold);
    if (form.face_recognition_enabled && (fThreshold < 0 || fThreshold > 1)) {
      errs.face_match_threshold = "Must be between 0 and 1";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      setError("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        policy_name: form.policy_name.trim(),
        is_active: form.is_active,
        effective_from: form.effective_from,
        effective_to: form.effective_to || null,

        // ⭐ NEW: 3-tier thresholds
        min_work_minutes: Number(form.min_work_minutes) || 120,
        half_day_minutes: Number(form.half_day_minutes) || 240,
        full_day_minutes: Number(form.full_day_minutes) || 480,

        grace_minutes: Number(form.grace_minutes) || 0,
        late_mark_after_minutes: Number(form.late_mark_after_minutes) || 0,
        half_day_after_minutes: Number(form.half_day_after_minutes) || 0,
        early_exit_grace_minutes: Number(form.early_exit_grace_minutes) || 0,
        max_work_minutes: toNumberOrNull(form.max_work_minutes),
        allow_cross_midnight_shift: !!form.allow_cross_midnight_shift,

        allow_multiple_punches: !!form.allow_multiple_punches,
        auto_punch_out_after_hours: toNumberOrNull(form.auto_punch_out_after_hours),
        require_photo_on_punch: !!form.require_photo_on_punch,
        require_location_on_punch: !!form.require_location_on_punch,
        auto_mark_absent_if_no_punch: !!form.auto_mark_absent_if_no_punch,
        auto_mark_half_day_if_single_punch: !!form.auto_mark_half_day_if_single_punch,
        max_late_per_month: toNumberOrNull(form.max_late_per_month),
        max_consecutive_absent_days: toNumberOrNull(form.max_consecutive_absent_days),
        count_weekoff_as_present_if_worked: !!form.count_weekoff_as_present_if_worked,
        count_holiday_as_present_if_worked: !!form.count_holiday_as_present_if_worked,

        geo_fence_enabled: !!form.geo_fence_enabled,
        geo_fence_action: form.geo_fence_action,

        face_recognition_enabled: !!form.face_recognition_enabled,
        face_match_threshold: Number(form.face_match_threshold) || 0.75,

        break_tracking_enabled: !!form.break_tracking_enabled,
        max_break_minutes_per_day: toNumberOrNull(form.max_break_minutes_per_day),
        auto_deduct_break_minutes: toNumberOrNull(form.auto_deduct_break_minutes),

        wfh_requires_approval: !!form.wfh_requires_approval,
        wfh_max_days_per_month: toNumberOrNull(form.wfh_max_days_per_month),
        on_duty_enabled: !!form.on_duty_enabled,
        on_duty_requires_approval: !!form.on_duty_requires_approval,

        comp_off_enabled: !!form.comp_off_enabled,
        comp_off_expiry_days: toNumberOrNull(form.comp_off_expiry_days),

        notify_manager_on_late: !!form.notify_manager_on_late,
        notify_hr_on_absent: !!form.notify_hr_on_absent,
      };

      if (editRow) {
        const id = editRow.attendance_policy_id || editRow.id;
        await api.put(`/api/v1/attendence/policy/${id}`, payload);
      } else {
        await api.post("/api/v1/add/attendence/policy", payload);
      }

      onSaved?.(editRow ? "Policy updated" : "Policy created");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={() => !saving && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {editRow ? "Edit Attendance Policy" : "New Attendance Policy"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Configure timings, punch rules, geo-fence, and more
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-slate-100 px-2 py-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  activeTab === t.id
                    ? "bg-red-50 text-red-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="mr-1">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
                {error}
              </div>
            )}

            {/* ── BASIC ── */}
            {activeTab === "basic" && (
              <Section title="Basic Details" description="Policy name and validity window">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Policy Name" required error={fieldErrors.policy_name}>
                      <TextInput
                        value={form.policy_name}
                        onChange={set("policy_name")}
                        placeholder="e.g. Head Office — Standard 2026"
                        maxLength={128}
                        autoFocus
                      />
                    </Field>
                  </div>

                  <Field label="Effective From" required error={fieldErrors.effective_from}>
                    <TextInput
                      type="date"
                      value={form.effective_from}
                      onChange={set("effective_from")}
                    />
                  </Field>

                  <Field label="Effective To" hint="Leave empty for no expiry" error={fieldErrors.effective_to}>
                    <TextInput
                      type="date"
                      value={form.effective_to}
                      onChange={set("effective_to")}
                      min={form.effective_from || undefined}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Toggle
                      checked={form.is_active}
                      onChange={set("is_active")}
                      label="Active"
                      hint="Inactive policies are ignored when deciding attendance rules"
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* ── TIMING — ⭐ NEW 3-TIER FIELDS ── */}
            {activeTab === "timing" && (
              <Section
                title="Work Duration Thresholds"
                description="Auto-status decides based on total work minutes"
              >
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs text-blue-800">
                  <p className="font-medium">📊 3-Tier Logic</p>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside text-blue-700">
                    <li>Less than <strong>Min Work Minutes</strong> → ABSENT (full LOP)</li>
                    <li>Between Min & Full Day → HALF_DAY (0.5 LOP)</li>
                    <li>≥ Full Day Minutes → PRESENT (no LOP)</li>
                  </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field
                    label="Min Work Minutes"
                    required
                    error={fieldErrors.min_work_minutes}
                    hint="Below this → ABSENT"
                  >
                    <NumberInput
                      value={form.min_work_minutes}
                      onChange={set("min_work_minutes")}
                      min={30}
                      max={480}
                    />
                  </Field>

                  <Field
                    label="Half Day Minutes"
                    required
                    error={fieldErrors.half_day_minutes}
                    hint="Below this → HALF_DAY"
                  >
                    <NumberInput
                      value={form.half_day_minutes}
                      onChange={set("half_day_minutes")}
                      min={60}
                      max={720}
                    />
                  </Field>

                  <Field
                    label="Full Day Minutes"
                    required
                    error={fieldErrors.full_day_minutes}
                    hint="Above this → PRESENT"
                  >
                    <NumberInput
                      value={form.full_day_minutes}
                      onChange={set("full_day_minutes")}
                      min={120}
                      max={1440}
                    />
                  </Field>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="mb-3 text-xs font-semibold text-slate-700">Grace & Late Rules</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Grace Minutes" hint="Extra minutes before late is marked">
                      <NumberInput
                        value={form.grace_minutes}
                        onChange={set("grace_minutes")}
                        min={0}
                        max={120}
                      />
                    </Field>

                    <Field label="Late Mark After" hint="Minutes past shift start = late">
                      <NumberInput
                        value={form.late_mark_after_minutes}
                        onChange={set("late_mark_after_minutes")}
                        min={0}
                        max={480}
                      />
                    </Field>

                    <Field label="Half Day After" hint="Minutes past shift start = half day">
                      <NumberInput
                        value={form.half_day_after_minutes}
                        onChange={set("half_day_after_minutes")}
                        min={0}
                        max={720}
                      />
                    </Field>

                    <Field label="Early Exit Grace" hint="Buffer before early exit">
                      <NumberInput
                        value={form.early_exit_grace_minutes}
                        onChange={set("early_exit_grace_minutes")}
                        min={0}
                        max={120}
                      />
                    </Field>

                    <Field label="Max Work Minutes" hint="Overtime after this. Empty = disabled">
                      <NumberInput
                        value={form.max_work_minutes}
                        onChange={set("max_work_minutes")}
                        min={0}
                        max={1440}
                        placeholder="e.g. 540"
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Toggle
                        checked={form.allow_cross_midnight_shift}
                        onChange={set("allow_cross_midnight_shift")}
                        label="Allow Cross-Midnight Shift"
                        hint="Night shifts spanning midnight"
                      />
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* ── PUNCH RULES ── */}
            {activeTab === "punch" && (
              <Section title="Punch Behaviour" description="How punches are captured and evaluated">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Toggle
                    checked={form.allow_multiple_punches}
                    onChange={set("allow_multiple_punches")}
                    label="Allow Multiple Punches"
                    hint="If disabled, only first IN and last OUT"
                  />
                  <Toggle
                    checked={form.require_location_on_punch}
                    onChange={set("require_location_on_punch")}
                    label="Require Location"
                    hint="GPS must be enabled to punch"
                  />
                  <Toggle
                    checked={form.require_photo_on_punch}
                    onChange={set("require_photo_on_punch")}
                    label="Require Photo"
                    hint="Camera selfie needed at each punch"
                  />
                  <Toggle
                    checked={form.auto_mark_absent_if_no_punch}
                    onChange={set("auto_mark_absent_if_no_punch")}
                    label="Auto Mark Absent"
                    hint="If no punch by end of day"
                  />
                  <Toggle
                    checked={form.auto_mark_half_day_if_single_punch}
                    onChange={set("auto_mark_half_day_if_single_punch")}
                    label="Auto Half Day (Single Punch)"
                    hint="Only one punch recorded"
                  />
                  <Toggle
                    checked={form.count_weekoff_as_present_if_worked}
                    onChange={set("count_weekoff_as_present_if_worked")}
                    label="Week-off Counts as Present"
                    hint="If worked on weekly off"
                  />
                  <Toggle
                    checked={form.count_holiday_as_present_if_worked}
                    onChange={set("count_holiday_as_present_if_worked")}
                    label="Holiday Counts as Present"
                    hint="If worked on holiday"
                  />

                  <Field label="Auto Punch-Out After (hours)" hint="Force punch-out if forgotten">
                    <NumberInput
                      value={form.auto_punch_out_after_hours}
                      onChange={set("auto_punch_out_after_hours")}
                      min={0}
                      max={48}
                      placeholder="e.g. 14"
                    />
                  </Field>

                  <Field label="Max Late per Month" hint="Alert threshold">
                    <NumberInput
                      value={form.max_late_per_month}
                      onChange={set("max_late_per_month")}
                      min={0}
                      max={31}
                    />
                  </Field>

                  <Field label="Max Consecutive Absent Days" hint="Alert HR beyond this">
                    <NumberInput
                      value={form.max_consecutive_absent_days}
                      onChange={set("max_consecutive_absent_days")}
                      min={0}
                      max={30}
                    />
                  </Field>
                </div>
              </Section>
            )}

            {/* ── GEO-FENCE ── */}
            {activeTab === "geo" && (
              <Section title="Geo-fencing" description="Restrict punches to approved office locations">
                <div className="space-y-3">
                  <Toggle
                    checked={form.geo_fence_enabled}
                    onChange={set("geo_fence_enabled")}
                    label="Enable Geo-fence"
                    hint="Employees can only punch from assigned locations"
                  />

                  {form.geo_fence_enabled && (
                    <Field label="Geo-fence Action" hint="What to do when outside fence">
                      <Select
                        value={form.geo_fence_action}
                        onChange={set("geo_fence_action")}
                        options={GEO_ACTIONS}
                      />
                    </Field>
                  )}

                  <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-800">
                    <p className="font-medium">ℹ️ Configure locations separately</p>
                    <p className="mt-0.5 text-blue-700">
                      Add office GPS coordinates from <strong>Attendance → Locations</strong>.
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {/* ── FACE ── */}
            {activeTab === "face" && (
              <Section title="Face Recognition" description="AI-based face verification at punch">
                <div className="space-y-3">
                  <Toggle
                    checked={form.face_recognition_enabled}
                    onChange={set("face_recognition_enabled")}
                    label="Enable Face Recognition"
                    hint="Selfie matched against enrolled face (server-side)"
                  />

                  {form.face_recognition_enabled && (
                    <Field
                      label="Match Threshold"
                      hint="0.5 = lenient, 0.75 = balanced, 0.9 = strict"
                      error={fieldErrors.face_match_threshold}
                    >
                      <NumberInput
                        value={form.face_match_threshold}
                        onChange={set("face_match_threshold")}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </Field>
                  )}

                  <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                    <p className="font-medium">⚠️ Enroll faces first</p>
                    <p className="mt-0.5 text-amber-700">
                      Employees must enroll from <strong>Attendance → Biometrics</strong>.
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {/* ── BREAK ── */}
            {activeTab === "break" && (
              <Section title="Break Tracking" description="Track tea, lunch, and personal breaks">
                <div className="space-y-3">
                  <Toggle
                    checked={form.break_tracking_enabled}
                    onChange={set("break_tracking_enabled")}
                    label="Enable Break Tracking"
                    hint="Employees can start/end breaks"
                  />

                  {form.break_tracking_enabled && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Max Break Minutes / Day" hint="Alert if exceeded">
                        <NumberInput
                          value={form.max_break_minutes_per_day}
                          onChange={set("max_break_minutes_per_day")}
                          min={0}
                          max={480}
                        />
                      </Field>

                      <Field label="Auto-Deduct Break Minutes" hint="Fixed deduction (e.g. 60)">
                        <NumberInput
                          value={form.auto_deduct_break_minutes}
                          onChange={set("auto_deduct_break_minutes")}
                          min={0}
                          max={180}
                        />
                      </Field>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ── WFH / OD ── */}
            {activeTab === "wfh" && (
              <Section title="Work From Home & On Duty" description="Remote / field work rules">
                <div className="space-y-3">
                  <Toggle
                    checked={form.wfh_requires_approval}
                    onChange={set("wfh_requires_approval")}
                    label="WFH Requires Approval"
                    hint="Manager approval before punch from home"
                  />

                  <Field label="WFH Max Days per Month" hint="Monthly limit">
                    <NumberInput
                      value={form.wfh_max_days_per_month}
                      onChange={set("wfh_max_days_per_month")}
                      min={0}
                      max={31}
                    />
                  </Field>

                  <Toggle
                    checked={form.on_duty_enabled}
                    onChange={set("on_duty_enabled")}
                    label="On Duty Enabled"
                    hint="Allow field/client site punches"
                  />

                  {form.on_duty_enabled && (
                    <Toggle
                      checked={form.on_duty_requires_approval}
                      onChange={set("on_duty_requires_approval")}
                      label="On Duty Requires Approval"
                    />
                  )}
                </div>
              </Section>
            )}

            {/* ── COMP-OFF ── */}
            {activeTab === "compoff" && (
              <Section title="Comp-Off" description="Compensatory leave for extra work">
                <div className="space-y-3">
                  <Toggle
                    checked={form.comp_off_enabled}
                    onChange={set("comp_off_enabled")}
                    label="Enable Comp-Off"
                    hint="Grant when employee works on week-off/holiday"
                  />

                  {form.comp_off_enabled && (
                    <Field label="Expiry Days" hint="Comp-off expires after these days">
                      <NumberInput
                        value={form.comp_off_expiry_days}
                        onChange={set("comp_off_expiry_days")}
                        min={0}
                        max={365}
                      />
                    </Field>
                  )}
                </div>
              </Section>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notify" && (
              <Section title="Notifications" description="Auto-alert managers and HR">
                <div className="space-y-3">
                  <Toggle
                    checked={form.notify_manager_on_late}
                    onChange={set("notify_manager_on_late")}
                    label="Notify Manager on Late"
                    hint="Email manager when report punches late"
                  />
                  <Toggle
                    checked={form.notify_hr_on_absent}
                    onChange={set("notify_hr_on_absent")}
                    label="Notify HR on Absent"
                    hint="Alert HR when employee marked absent"
                  />
                </div>
              </Section>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
            <div className="text-xs text-slate-500">
              {TABS.findIndex((t) => t.id === activeTab) + 1} / {TABS.length}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : editRow ? "Update Policy" : "Create Policy"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function AttendancePolicyPage() {
  const role = String(useAuthStore((s) => s.user?.role?.value || s.user?.role || "")).toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  const fetchList = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setError("");
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.search = search;
      const res = await api.get("/api/v1/get/attendence/policy", { params });
      if (myReqId !== reqIdRef.current) return;
      const arr = toArray(res?.data);
      setList(arr);
      setTotal(Number(res?.data?.total) || arr.length);
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(formatApiError(err));
      setList([]);
      setTotal(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchList();
      return;
    }
    const t = setTimeout(fetchList, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [fetchList]);

  const handleAdd = () => {
    setEditRow(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setShowForm(true);
  };

  const handleSaved = (msg) => {
    setShowForm(false);
    setEditRow(null);
    setSuccess(msg);
    fetchList();
  };

  const askDeactivate = (row) => setConfirmDeactivate(row);

  const confirmDeactivateNow = async () => {
    if (!confirmDeactivate) return;
    setDeactivating(true);
    setError("");
    try {
      const id = confirmDeactivate.attendance_policy_id || confirmDeactivate.id;
      await api.put(`/api/v1/attendence/policy/${id}`, {
        ...confirmDeactivate,
        is_active: false,
      });
      setSuccess("Policy deactivated");
      setConfirmDeactivate(null);
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setDeactivating(false);
    }
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-3 text-lg font-semibold text-slate-800">Admin Access Required</h2>
          <p className="mt-1 text-sm text-slate-500">
            Only administrators can manage attendance policies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Attendance Policy</h1>
            <p className="mt-1 text-sm text-slate-500">
              Grace, half-day, geo, face, WFH & more
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            + New Policy
          </button>
        </div>

        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search policies..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-9 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading && list.length === 0 ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📋
                </div>
                <p className="text-sm font-medium text-slate-700">No policies yet</p>
                <p className="text-xs text-slate-500">
                  Create your first attendance policy
                </p>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="mt-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  + New Policy
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">Policy</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Thresholds</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Rules</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Validity</th>
                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row, i) => {
                    const id = row.attendance_policy_id || row.id || i;
                    return (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-800">
                            {row.policy_name}
                          </div>
                          {row.created_at && (
                            <div className="mt-0.5 text-[11px] text-slate-400">
                              Created{" "}
                              {new Date(row.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            <Pill tone="slate">Min {row.min_work_minutes ?? 120}m</Pill>
                            <Pill tone="slate">Half {row.half_day_minutes ?? 240}m</Pill>
                            <Pill tone="slate">Full {row.full_day_minutes ?? 480}m</Pill>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {row.geo_fence_enabled && <Pill tone="blue">Geo</Pill>}
                            {row.face_recognition_enabled && <Pill tone="blue">Face</Pill>}
                            {row.require_photo_on_punch && <Pill tone="amber">Photo</Pill>}
                            {row.break_tracking_enabled && <Pill tone="amber">Break</Pill>}
                            {row.comp_off_enabled && <Pill tone="green">Comp-Off</Pill>}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {row.effective_from
                            ? new Date(row.effective_from).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                          {" → "}
                          {row.effective_to
                            ? new Date(row.effective_to).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "No expiry"}
                        </td>

                        <td className="px-5 py-3.5">
                          {row.is_active !== false ? (
                            <Pill tone="green">Active</Pill>
                          ) : (
                            <Pill tone="red">Inactive</Pill>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleEdit(row)}
                            className="text-xs font-medium text-slate-600 hover:text-red-600"
                          >
                            Edit
                          </button>
                          {row.is_active !== false && (
                            <button
                              type="button"
                              onClick={() => askDeactivate(row)}
                              className="ml-3 text-xs font-medium text-slate-400 hover:text-red-600"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && list.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-500">
                Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PolicyFormModal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditRow(null);
        }}
        editRow={editRow}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!confirmDeactivate}
        title="Deactivate Policy?"
        message={
          confirmDeactivate
            ? `"${confirmDeactivate.policy_name}" will be marked inactive.\n\nExisting punches continue to use current rules, but new ones will fall back to the next active policy.`
            : ""
        }
        confirmLabel="Deactivate"
        danger
        loading={deactivating}
        onConfirm={confirmDeactivateNow}
        onCancel={() => setConfirmDeactivate(null)}
      />
    </div>
  );
}