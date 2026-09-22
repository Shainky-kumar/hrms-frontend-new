"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS_CONFIG = {
  draft: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", border: "border-slate-200", label: "Draft" },
  pending_approval: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200", label: "Pending" },
  approved: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200", label: "Approved" },
  sent: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200", label: "Sent" },
  published: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200", label: "Published" },
  viewed: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500", border: "border-cyan-200", label: "Viewed" },
  accepted: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", border: "border-green-200", label: "Accepted" },
  declined: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200", label: "Declined" },
  signed: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500", border: "border-violet-200", label: "Signed" },
  expired: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", border: "border-orange-200", label: "Expired" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", border: "border-rose-200", label: "Cancelled" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200", label: "Pending" },
  generated: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200", label: "Generated" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200", label: "Rejected" },
};

const EMPTY_CATEGORY = {
  code: "",
  name: "",
  description: "",
  number_prefix: "",
  display_order: 100,
  is_active: true,
};

const EMPTY_GENERATE = {
  template_id: "",
  issue_date: "",
  effective_date: "",
  signatory_id: "",
  publish_to_ess: true,
  send_email: false,
};

const EMPTY_SIGNATORY = {
  name: "",
  designation: "",
  department: "",
  email: "",
  is_default: false,
  is_active: true,
};

/* ============ PROFESSIONAL TEMPLATES ============ */
const PROFESSIONAL_TEMPLATES = {
  EXPERIENCE: {
    name: "Experience Certificate",
    code: "EXPERIENCE",
    description: "Service certificate for past employee",
    category: "Experience",
    content_html: `<p style="text-align:center; font-size:15px; letter-spacing:1px; margin-bottom:22px;"><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
<p style="text-align:justify; margin-bottom:14px;">This is to certify that <strong>{{employee.full_name}}</strong> bearing Employee Code <strong>{{employee.employee_code}}</strong> was employed with <strong>{{company.name}}</strong> from <strong>{{employee.joining_date}}</strong> to <strong>{{employee.leaving_date}}</strong>.</p>
<table style="width:100%; border-collapse:collapse; margin:16px 0 20px; font-size:13px;">
<tr><td style="padding:6px 8px 6px 0; width:180px; color:#4a5568;">Employee Name</td><td style="padding:6px 0;"><strong>{{employee.full_name}}</strong></td></tr>
<tr><td style="padding:6px 8px 6px 0; color:#4a5568;">Employee Code</td><td style="padding:6px 0;"><strong>{{employee.employee_code}}</strong></td></tr>
<tr><td style="padding:6px 8px 6px 0; color:#4a5568;">Designation</td><td style="padding:6px 0;"><strong>{{employee.designation}}</strong></td></tr>
<tr><td style="padding:6px 8px 6px 0; color:#4a5568;">Department</td><td style="padding:6px 0;"><strong>{{employee.department}}</strong></td></tr>
<tr><td style="padding:6px 8px 6px 0; color:#4a5568;">Date of Joining</td><td style="padding:6px 0;"><strong>{{employee.joining_date}}</strong></td></tr>
<tr><td style="padding:6px 8px 6px 0; color:#4a5568;">Date of Leaving</td><td style="padding:6px 0;"><strong>{{employee.leaving_date}}</strong></td></tr>
</table>
<p style="text-align:justify; margin-bottom:14px;">During the period of employment, {{employee.full_name}} performed the assigned duties with sincerity, dedication and a high degree of professionalism.</p>
<p style="text-align:justify; margin-bottom:14px;">We appreciate the contribution made by {{employee.full_name}} and wish every success in all future endeavours.</p>
<p style="text-align:justify; margin-bottom:8px;">This certificate is issued upon request for official purposes.</p>`,
  },
  RELIEVING: {
    name: "Relieving Letter",
    code: "RELIEVING",
    description: "Formal relieving letter on exit",
    category: "Exit",
    content_html: `<p style="margin-bottom:8px;">Dear <strong>{{employee.full_name}}</strong>,</p>
<p style="margin-bottom:18px;"><strong>Subject: Relieving Letter</strong></p>
<p style="text-align:justify; margin-bottom:14px;">This is with reference to your resignation. We hereby confirm that you have been relieved from your duties as <strong>{{employee.designation}}</strong> with effect from <strong>{{employee.leaving_date}}</strong>.</p>
<p style="text-align:justify; margin-bottom:14px;">You joined on <strong>{{employee.joining_date}}</strong> and have completed all exit formalities. Your Full &amp; Final settlement will be processed as per company policy.</p>
<p style="text-align:justify; margin-bottom:14px;">We wish you success in your future career.</p>`,
  },
  BONAFIDE: {
    name: "Bonafide Certificate",
    code: "BONAFIDE",
    description: "Bonafide certificate for current employees",
    category: "General",
    content_html: `<p style="text-align:center; font-size:15px; letter-spacing:1px; margin-bottom:22px;"><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
<p style="text-align:justify; margin-bottom:14px;">This is to certify that <strong>{{employee.full_name}}</strong> (Employee Code: <strong>{{employee.employee_code}}</strong>) is a bona fide employee of <strong>{{company.name}}</strong> and is currently working as <strong>{{employee.designation}}</strong> since <strong>{{employee.joining_date}}</strong>.</p>
<p style="text-align:justify; margin-bottom:8px;">This certificate is issued upon the request of the employee for official purposes.</p>`,
  },
  OFFER: {
    name: "Offer Letter",
    code: "OFFER",
    description: "Offer of employment",
    category: "Hiring",
    content_html: `<p style="margin-bottom:8px;">Dear <strong>{{employee.full_name}}</strong>,</p>
<p style="margin-bottom:18px;"><strong>Subject: Offer of Employment</strong></p>
<p style="text-align:justify; margin-bottom:14px;">We are pleased to offer you the position of <strong>{{employee.designation}}</strong> at <strong>{{company.name}}</strong>.</p>
<p style="text-align:justify; margin-bottom:14px;">Your date of joining will be <strong>{{letter.effective_date}}</strong>. Detailed terms will be shared separately.</p>
<p style="text-align:justify; margin-bottom:14px;">Please confirm your acceptance by signing and returning a copy of this letter.</p>
<p style="text-align:justify; margin-bottom:8px;">We look forward to welcoming you to the team.</p>`,
  },
  APPOINTMENT: {
    name: "Appointment Letter",
    code: "APPOINTMENT",
    description: "Formal appointment letter",
    category: "Hiring",
    content_html: `<p style="margin-bottom:8px;">Dear <strong>{{employee.full_name}}</strong>,</p>
<p style="margin-bottom:18px;"><strong>Subject: Appointment Letter</strong></p>
<p style="text-align:justify; margin-bottom:14px;">With reference to your interview, we are pleased to appoint you as <strong>{{employee.designation}}</strong> at <strong>{{company.name}}</strong> with effect from <strong>{{letter.effective_date}}</strong>.</p>
<p style="text-align:justify; margin-bottom:14px;">Your Employee Code is <strong>{{employee.employee_code}}</strong>. You will be governed by the company policies.</p>
<p style="text-align:justify; margin-bottom:14px;">Please report to the HR Department on the date of joining with required documents.</p>`,
  },
  INCREMENT: {
    name: "Increment Letter",
    code: "INCREMENT",
    description: "Salary revision letter",
    category: "Compensation",
    content_html: `<p style="margin-bottom:8px;">Dear <strong>{{employee.full_name}}</strong>,</p>
<p style="margin-bottom:18px;"><strong>Subject: Salary Revision</strong></p>
<p style="text-align:justify; margin-bottom:14px;">Based on your performance and contribution to <strong>{{company.name}}</strong>, your compensation has been revised with effect from <strong>{{letter.effective_date}}</strong>.</p>
<p style="text-align:justify; margin-bottom:14px;">Revised details will be reflected in subsequent salary slips.</p>
<p style="text-align:justify; margin-bottom:8px;">We appreciate your continued commitment.</p>`,
  },
  PROMOTION: {
    name: "Promotion Letter",
    code: "PROMOTION",
    description: "Promotion announcement",
    category: "Compensation",
    content_html: `<p style="margin-bottom:8px;">Dear <strong>{{employee.full_name}}</strong>,</p>
<p style="margin-bottom:18px;"><strong>Subject: Promotion Letter</strong></p>
<p style="text-align:justify; margin-bottom:14px;">In recognition of your consistent performance, we are pleased to promote you to the position of <strong>{{employee.designation}}</strong> effective <strong>{{letter.effective_date}}</strong>.</p>
<p style="text-align:justify; margin-bottom:8px;">Congratulations on your well-deserved promotion.</p>`,
  },
  WARNING: {
    name: "Warning Letter",
    code: "WARNING",
    description: "Employee warning letter",
    category: "Discipline",
    content_html: `<p style="margin-bottom:8px;">Dear <strong>{{employee.full_name}}</strong>,</p>
<p style="margin-bottom:18px;"><strong>Subject: Warning Letter</strong></p>
<p style="text-align:justify; margin-bottom:14px;">This letter serves as a formal warning regarding your recent conduct at <strong>{{company.name}}</strong>.</p>
<p style="text-align:justify; margin-bottom:14px;">It has been observed that you have failed to meet the expected standards. This is in violation of the terms of your employment.</p>
<p style="text-align:justify; margin-bottom:14px;">You are advised to immediately correct your conduct. Failure to do so may result in further disciplinary action.</p>`,
  },
  TERMINATION: {
    name: "Termination Letter",
    code: "TERMINATION",
    description: "Termination of employment",
    category: "Exit",
    content_html: `<p style="margin-bottom:8px;">Dear <strong>{{employee.full_name}}</strong>,</p>
<p style="margin-bottom:18px;"><strong>Subject: Termination of Employment</strong></p>
<p style="text-align:justify; margin-bottom:14px;">Your employment with <strong>{{company.name}}</strong> is being terminated with effect from <strong>{{letter.effective_date}}</strong> as per the terms of your contract.</p>
<p style="text-align:justify; margin-bottom:14px;">Final settlement will be processed as per company policy. Please complete all exit formalities before your last working day.</p>
<p style="text-align:justify; margin-bottom:8px;">We wish you the best in your future endeavours.</p>`,
  },
  NOC: {
    name: "NOC Letter",
    code: "NOC",
    description: "No Objection Certificate",
    category: "General",
    content_html: `<p style="text-align:center; font-size:15px; letter-spacing:1px; margin-bottom:22px;"><strong>NO OBJECTION CERTIFICATE</strong></p>
<p style="text-align:justify; margin-bottom:14px;">This is to certify that <strong>{{employee.full_name}}</strong> (Employee Code: <strong>{{employee.employee_code}}</strong>) is currently employed with <strong>{{company.name}}</strong> as <strong>{{employee.designation}}</strong> since <strong>{{employee.joining_date}}</strong>.</p>
<p style="text-align:justify; margin-bottom:14px;">We have no objection if the employee pursues higher education or applies for a loan, subject to company policies.</p>
<p style="text-align:justify; margin-bottom:8px;">This certificate is issued upon request of the employee.</p>`,
  },
  ADDRESS_PROOF: {
    name: "Address Proof",
    code: "ADDRPROOF",
    description: "Address verification letter",
    category: "General",
    content_html: `<p style="text-align:center; font-size:15px; letter-spacing:1px; margin-bottom:22px;"><strong>ADDRESS VERIFICATION LETTER</strong></p>
<p style="text-align:justify; margin-bottom:14px;">This is to certify that <strong>{{employee.full_name}}</strong> is employed with <strong>{{company.name}}</strong> since <strong>{{employee.joining_date}}</strong>.</p>
<p style="text-align:justify; margin-bottom:14px;">The residential address as per our records:</p>
<p style="margin:12px 0 18px 24px; padding:12px 16px; border-left:3px solid #2b6cb0; background:#f7fafc;"><strong>{{employee.address}}</strong></p>
<p style="text-align:justify; margin-bottom:8px;">This letter is issued upon request for official purposes.</p>`,
  },
};

/* ============ HELPERS ============ */
function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
}

function pickList(res) {
  const body = res?.data ?? {};
  const list =
    body?.data ?? body?.items ?? body?.results ?? body?.employees ??
    body?.departments ?? body?.designations ?? body?.templates ??
    body?.categories ?? body?.letters ?? body?.requests ?? body?.signatories ?? [];
  return Array.isArray(list) ? list : Array.isArray(body) ? body : [];
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return String(value); }
}

function empName(emp) {
  if (!emp) return "—";
  if (emp.full_name) return emp.full_name;
  const n = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
  return n || emp.employee_code || "—";
}

function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ============ ICON COMPONENTS ============ */
const Icons = {
  File: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Template: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
  Category: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Sign: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Bell: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Plus: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Search: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>,
  Refresh: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Eye: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Download: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Send: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Publish: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Check: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  X: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Sparkle: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  CheckCircle: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Clock: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Users: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Arrow: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
};

/* ============================================================
   MAIN PAGE
============================================================ */
export default function HRLettersPage() {
  const [activeTab, setActiveTab] = useState("letters");

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [letters, setLetters] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [signatories, setSignatories] = useState([]);

  const [listLoading, setListLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewLetter, setPreviewLetter] = useState(null);

  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
  const [generateForm, setGenerateForm] = useState(EMPTY_GENERATE);
  const [signatoryForm, setSignatoryForm] = useState(EMPTY_SIGNATORY);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filterDept, setFilterDept] = useState("");
  const [filterDesig, setFilterDesig] = useState("");
  const [empSearch, setEmpSearch] = useState("");
  const [letterSearch, setLetterSearch] = useState("");

  const [selectedSampleKey, setSelectedSampleKey] = useState("");
  const [templateCategoryId, setTemplateCategoryId] = useState("");
  const [templateRequiresApproval, setTemplateRequiresApproval] = useState(false);
  const [templateAllowRequest, setTemplateAllowRequest] = useState(false);

  /* ============ FETCH ============ */
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } });
      setEmployees(pickList(res));
    } catch { setEmployees([]); }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/departments", { params: { page: 1, page_size: 200 } });
      setDepartments(pickList(res));
    } catch { setDepartments([]); }
  }, []);

  const fetchDesignations = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/designations", { params: { page: 1, page_size: 200 } });
      setDesignations(pickList(res));
    } catch { setDesignations([]); }
  }, []);

  const fetchLetters = useCallback(async () => {
    setListLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/get/generated/letters", { params: { page: 1, page_size: 100 } });
      setLetters(pickList(res));
    } catch (err) {
      setError(getErrorMessage(err));
      setLetters([]);
    } finally { setListLoading(false); }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/templates", { params: { is_active: true, page: 1, page_size: 100 } });
      setTemplates(pickList(res));
    } catch { setTemplates([]); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/categories", { params: { is_active: true, page: 1, page_size: 100 } });
      setCategories(pickList(res));
    } catch { setCategories([]); }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/requests", { params: { page: 1, page_size: 50 } });
      setRequests(pickList(res));
    } catch { setRequests([]); }
  }, []);

  const fetchSignatories = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/letter/signatories", { params: { is_active: true, page: 1, page_size: 100 } });
      setSignatories(pickList(res));
    } catch { setSignatories([]); }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
    fetchLetters();
    fetchTemplates();
    fetchCategories();
    fetchRequests();
    fetchSignatories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============ DERIVED ============ */
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const deptId = emp.department_id || emp.department?.department_id || "";
      const desigId = emp.designation_id || emp.designation?.designation_id || "";
      const name = empName(emp).toLowerCase();
      const code = String(emp.employee_code || "").toLowerCase();
      const deptOk = !filterDept || deptId === filterDept;
      const desigOk = !filterDesig || desigId === filterDesig;
      const searchOk = !empSearch || name.includes(empSearch.toLowerCase()) || code.includes(empSearch.toLowerCase());
      return deptOk && desigOk && searchOk;
    });
  }, [employees, filterDept, filterDesig, empSearch]);

  const filteredLetters = useMemo(() => {
    if (!letterSearch.trim()) return letters;
    const q = letterSearch.toLowerCase();
    return letters.filter(
      (l) =>
        String(l.letter_number || "").toLowerCase().includes(q) ||
        String(l.employee_name || l.data_snapshot?.employee_name || "").toLowerCase().includes(q) ||
        String(l.status || "").toLowerCase().includes(q)
    );
  }, [letters, letterSearch]);

  const stats = useMemo(() => ({
    letters: letters.length,
    templates: templates.length,
    categories: categories.length,
    pending: requests.filter((r) => String(r.status).toLowerCase() === "pending").length,
    signatories: signatories.length,
  }), [letters, templates, categories, requests, signatories]);

  /* ============ HANDLERS ============ */
  async function handleCreateCategory(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      await api.post("/api/v1/create/letter/category", {
        ...categoryForm,
        code: categoryForm.code.toUpperCase(),
        number_prefix: categoryForm.number_prefix || categoryForm.code.toUpperCase().slice(0, 3),
      });
      setSuccess("Category created successfully");
      setCategoryForm(EMPTY_CATEGORY);
      await fetchCategories();
      setActiveTab("categories");
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleCreateTemplateFromSample(e) {
    e.preventDefault();
    if (!selectedSampleKey || !PROFESSIONAL_TEMPLATES[selectedSampleKey]) {
      setError("Please select a letter type"); return;
    }
    if (!templateCategoryId) { setError("Please select a category"); return; }

    const sample = PROFESSIONAL_TEMPLATES[selectedSampleKey];
    setLoading(true); setError(""); setSuccess("");
    try {
      await api.post("/api/v1/create/letter/template", {
        category_id: templateCategoryId,
        name: sample.name,
        code: sample.code,
        description: sample.description,
        content_html: sample.content_html,
        requires_approval: templateRequiresApproval,
        requires_esign: false,
        allow_employee_request: templateAllowRequest,
        password_protect_pdf: false,
        is_active: true,
      });
      setSuccess(`${sample.name} created successfully`);
      setSelectedSampleKey("");
      setTemplateCategoryId("");
      setTemplateRequiresApproval(false);
      setTemplateAllowRequest(false);
      await fetchTemplates();
      setActiveTab("templates");
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleCreateSignatory(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      await api.post("/api/v1/create/letter/signatory", signatoryForm);
      setSuccess("Signatory added successfully");
      setSignatoryForm(EMPTY_SIGNATORY);
      await fetchSignatories();
      setActiveTab("signatories");
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      if (!generateForm.template_id) { setError("Please select a template"); setLoading(false); return; }
      if (selectedEmployees.length === 0) { setError("Please select at least one employee"); setLoading(false); return; }
      const res = await api.post("/api/v1/generate/letter", {
        template_id: generateForm.template_id,
        employee_ids: selectedEmployees,
        issue_date: generateForm.issue_date || null,
        effective_date: generateForm.effective_date || null,
        signatory_id: generateForm.signatory_id || null,
        publish_to_ess: generateForm.publish_to_ess,
        send_email: generateForm.send_email,
      });
      setSuccess(res?.data?.message || "Letter(s) generated successfully");
      setGenerateForm(EMPTY_GENERATE);
      setSelectedEmployees([]);
      setFilterDept(""); setFilterDesig(""); setEmpSearch("");
      await fetchLetters();
      setActiveTab("letters");
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handlePublish(letterId) {
    try {
      await api.post(`/api/v1/publish/letter/${letterId}`);
      setSuccess("Published to ESS");
      await fetchLetters();
    } catch (err) { setError(getErrorMessage(err)); }
  }

  async function handleSend(letterId) {
    try {
      await api.post(`/api/v1/send/letter/${letterId}`);
      setSuccess("Letter sent successfully");
      await fetchLetters();
    } catch (err) { setError(getErrorMessage(err)); }
  }

  async function handleDownload(letterId) {
    try {
      setError("");
      const res = await api.get(`/api/v1/download/letter/${letterId}`, { params: { format: "pdf" } });
      const data = res?.data || {};
      if (data.download_url) { window.open(data.download_url, "_blank"); return; }
      if (data.content_html) {
        const w = window.open("", "_blank");
        if (!w) { setError("Popup blocked."); return; }
        w.document.write(data.content_html);
        w.document.close();
        w.onload = function () { setTimeout(() => { w.focus(); w.print(); }, 400); };
        setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 900);
        return;
      }
      setError(data.message || "Download not available");
    } catch (err) { setError(getErrorMessage(err)); }
  }

  async function handlePreviewLetter(letterId) {
    try {
      setError("");
      const res = await api.get(`/api/v1/download/letter/${letterId}`, { params: { format: "pdf" } });
      const data = res?.data || {};
      if (data.content_html) setPreviewLetter(data.content_html);
      else setError("Preview not available");
    } catch (err) { setError(getErrorMessage(err)); }
  }

  async function handleProcessRequest(requestId, action) {
    try {
      await api.post(`/api/v1/process/letter/request/${requestId}`, { action });
      setSuccess(`Request ${action}d successfully`);
      await fetchRequests();
    } catch (err) { setError(getErrorMessage(err)); }
  }

  const tabs = [
    { id: "letters", label: "Letters", icon: Icons.File, count: stats.letters },
    { id: "generate", label: "Generate", icon: Icons.Sparkle },
    { id: "templates", label: "Templates", icon: Icons.Template, count: stats.templates },
    { id: "categories", label: "Categories", icon: Icons.Category, count: stats.categories },
    { id: "signatories", label: "Signatories", icon: Icons.Sign, count: stats.signatories },
    { id: "requests", label: "Requests", icon: Icons.Bell, count: stats.pending },
  ];

  /* ===================== RENDER ===================== */
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* ============ HEADER ============ */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
          {/* Top bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E42527] to-[#a81b1d] shadow-lg shadow-red-500/20">
                <Icons.File className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-[24px] font-bold tracking-tight text-slate-900">
                  HR Letters
                </h1>
                <p className="text-[13px] text-slate-500">
                  Generate, sign, publish — professional employee letters
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setActiveTab("generate"); setError(""); setSuccess(""); }}
                className="group inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow"
              >
                <Icons.Sparkle className="h-4 w-4 text-[#E42527]" />
                Generate
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("create-template"); setError(""); setSuccess(""); }}
                className="group inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#E42527] to-[#c91f21] px-4 text-[13px] font-semibold text-white shadow-md shadow-red-500/20 transition hover:shadow-lg hover:shadow-red-500/30"
              >
                <Icons.Plus className="h-4 w-4" />
                New Template
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "Letters", value: stats.letters, icon: Icons.File, color: "from-red-500 to-red-600", bg: "bg-red-50", text: "text-red-600" },
              { label: "Templates", value: stats.templates, icon: Icons.Template, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
              { label: "Categories", value: stats.categories, icon: Icons.Category, color: "from-violet-500 to-violet-600", bg: "bg-violet-50", text: "text-violet-600" },
              { label: "Pending", value: stats.pending, icon: Icons.Clock, color: "from-amber-500 to-amber-600", bg: "bg-amber-50", text: "text-amber-600" },
              { label: "Signatories", value: stats.signatories, icon: Icons.Sign, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full ${s.bg} opacity-60 transition group-hover:scale-125`} />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
                        <Icon className={`h-4 w-4 ${s.text}`} />
                      </div>
                    </div>
                    <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-slate-900">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-1 border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setError(""); setSuccess(""); }}
                  className={`group relative flex items-center gap-2 px-4 py-3 text-[13px] font-semibold transition ${
                    isActive ? "text-[#E42527]" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {typeof tab.count === "number" && tab.count > 0 && (
                    <span className={`inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive ? "bg-[#E42527] text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-[2.5px] rounded-full bg-[#E42527]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ CONTENT ============ */}
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
        {/* Notifications */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-white px-4 py-3.5 shadow-sm">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
              <Icons.X className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-red-800">Error</p>
              <p className="mt-0.5 text-[12px] text-red-700">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
              <Icons.X className="h-4 w-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-4 py-3.5 shadow-sm">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <Icons.CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-emerald-800">Success</p>
              <p className="mt-0.5 text-[12px] text-emerald-700">{success}</p>
            </div>
            <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-600">
              <Icons.X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========== LETTERS ========== */}
        {activeTab === "letters" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Generated Letters</h2>
                <p className="mt-0.5 text-[12px] text-slate-500">
                  {filteredLetters.length} letter{filteredLetters.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={letterSearch}
                    onChange={(e) => setLetterSearch(e.target.value)}
                    placeholder="Search letters..."
                    className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchLetters}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                >
                  <Icons.Refresh className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            {listLoading ? (
              <div className="space-y-2 p-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-12 flex-1 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-12 w-24 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : filteredLetters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100">
                  <Icons.File className="h-8 w-8 text-[#E42527]" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-slate-800">No letters yet</p>
                <p className="mt-1 text-[13px] text-slate-500">Generate your first professional letter</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("generate")}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-4 text-[13px] font-semibold text-white shadow-md shadow-red-500/20 transition hover:shadow-lg"
                >
                  <Icons.Sparkle className="h-4 w-4" />
                  Generate Letter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Letter</th>
                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Employee</th>
                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Issued</th>
                      <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLetters.map((letter, idx) => (
                      <tr key={letter.letter_id || idx} className="group transition hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-50 to-red-100">
                              <Icons.File className="h-4 w-4 text-[#E42527]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-bold text-slate-900">{letter.letter_number || "—"}</p>
                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {letter.template_name || letter.data_snapshot?.template_name || "Letter"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                              {(letter.employee_name || letter.data_snapshot?.employee_name || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-[13px] text-slate-700">
                              {letter.employee_name || letter.data_snapshot?.employee_name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={letter.status} /></td>
                        <td className="px-5 py-4">
                          <span className="text-[12px] text-slate-600">{formatDate(letter.issue_date)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handlePreviewLetter(letter.letter_id)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                              title="Preview"
                            >
                              <Icons.Eye className="h-3.5 w-3.5" />
                              Preview
                            </button>
                            <button
                              onClick={() => handleDownload(letter.letter_id)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-100"
                              title="Download"
                            >
                              <Icons.Download className="h-3.5 w-3.5" />
                            </button>
                            {String(letter.status).toLowerCase() !== "published" && (
                              <button
                                onClick={() => handlePublish(letter.letter_id)}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-emerald-600 transition hover:bg-emerald-50"
                                title="Publish to ESS"
                              >
                                <Icons.Publish className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleSend(letter.letter_id)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-indigo-600 transition hover:bg-indigo-50"
                              title="Send Email"
                            >
                              <Icons.Send className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========== TEMPLATES ========== */}
        {activeTab === "templates" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Letter Templates</h2>
                <p className="mt-0.5 text-[12px] text-slate-500">Ready-to-use professional templates</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("create-template")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-3.5 text-[13px] font-semibold text-white shadow-sm transition hover:shadow-md"
              >
                <Icons.Plus className="h-4 w-4" />
                New
              </button>
            </div>
            {templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
                  <Icons.Template className="h-8 w-8 text-blue-600" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-slate-800">No templates yet</p>
                <p className="mt-1 text-[13px] text-slate-500">Add professional letter templates from library</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("create-template")}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-4 text-[13px] font-semibold text-white shadow-md shadow-red-500/20"
                >
                  <Icons.Plus className="h-4 w-4" />
                  Browse Templates
                </button>
              </div>
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                  <button
                    key={t.template_id}
                    type="button"
                    onClick={() => setSelectedTemplate(t)}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#E42527]/30 hover:shadow-lg hover:shadow-red-500/5"
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-red-50 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-red-100 transition group-hover:scale-110">
                          <Icons.File className="h-5 w-5 text-[#E42527]" />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          v{t.version || 1}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[14px] font-bold text-slate-900">{t.name}</h3>
                      <p className="mt-0.5 text-[11px] font-mono text-slate-500">{t.code}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {t.requires_approval && (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Approval
                          </span>
                        )}
                        {t.allow_employee_request && (
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            Self-Service
                          </span>
                        )}
                        {!t.requires_approval && !t.allow_employee_request && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Ready
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== CATEGORIES ========== */}
        {activeTab === "categories" && (
          <div className="grid gap-5 lg:grid-cols-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-[15px] font-bold text-slate-900">Letter Categories</h2>
                <p className="mt-0.5 text-[12px] text-slate-500">Groups for organizing letter templates</p>
              </div>
              <div className="divide-y divide-slate-50">
                {categories.length === 0 ? (
                  <div className="px-5 py-16 text-center text-[13px] text-slate-500">
                    No categories yet
                  </div>
                ) : (
                  categories.map((c) => (
                    <div key={c.category_id} className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50/70">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-50 to-violet-100">
                          <Icons.Category className="h-4 w-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900">{c.name}</p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            <span className="font-mono">{c.code}</span> · Prefix {c.number_prefix || "—"}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E42527]/10">
                  <Icons.Plus className="h-4 w-4 text-[#E42527]" />
                </div>
                <h3 className="text-[14px] font-bold text-slate-900">Add Category</h3>
              </div>
              <form onSubmit={handleCreateCategory} className="mt-5 space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Code</label>
                  <input
                    required
                    value={categoryForm.code}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="EXPERIENCE"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] font-mono outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Display Name</label>
                  <input
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Experience Letters"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Number Prefix</label>
                  <input
                    value={categoryForm.number_prefix}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, number_prefix: e.target.value.toUpperCase() }))}
                    placeholder="EXP"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] font-mono outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] text-[13px] font-bold text-white shadow-md shadow-red-500/20 transition hover:shadow-lg disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Create Category"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========== SIGNATORIES ========== */}
        {activeTab === "signatories" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Authorized Signatories</h2>
                <p className="mt-0.5 text-[12px] text-slate-500">People who sign the letters</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("create-signatory")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-3.5 text-[13px] font-semibold text-white shadow-sm transition hover:shadow-md"
              >
                <Icons.Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {signatories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100">
                  <Icons.Sign className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-slate-800">No signatories yet</p>
                <p className="mt-1 text-[13px] text-slate-500">Add authorized signatories for letters</p>
              </div>
            ) : (
              <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {signatories.map((s) => (
                  <div key={s.signatory_id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                    {s.is_default && (
                      <div className="absolute right-3 top-3 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        DEFAULT
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-[14px] font-bold text-white">
                        {(s.name || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-slate-900">{s.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{s.designation}</p>
                      </div>
                    </div>
                    {s.department && (
                      <p className="mt-3 truncate text-[11px] text-slate-400">{s.department}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== REQUESTS ========== */}
        {activeTab === "requests" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-[15px] font-bold text-slate-900">Employee Requests</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">Self-service letter requests from employees</p>
            </div>
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100">
                  <Icons.Bell className="h-8 w-8 text-amber-600" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-slate-800">No requests</p>
                <p className="mt-1 text-[13px] text-slate-500">When employees request letters, they'll appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {requests.map((r, idx) => (
                  <div key={r.request_id || idx} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50/70">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[12px] font-bold text-slate-700">
                        {(r.employee_name || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-slate-900">{r.employee_name || "—"}</p>
                        <p className="truncate text-[12px] text-slate-500">{r.purpose || r.reason || "—"}</p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                    {String(r.status).toLowerCase() === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleProcessRequest(r.request_id, "approve")}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 text-[12px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <Icons.Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProcessRequest(r.request_id, "reject")}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-[12px] font-bold text-red-700 transition hover:bg-red-100"
                        >
                          <Icons.X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== GENERATE ========== */}
        {activeTab === "generate" && (
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#a81b1d] shadow-md shadow-red-500/20">
                    <Icons.Sparkle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900">Generate Letter</h2>
                    <p className="text-[12px] text-slate-500">Select template, employees, and generate</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5 p-6">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    Template <span className="text-[#E42527]">*</span>
                  </label>
                  <select
                    required
                    value={generateForm.template_id}
                    onChange={(e) => setGenerateForm((p) => ({ ...p, template_id: e.target.value }))}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  >
                    <option value="">— Select a letter template —</option>
                    {templates.map((t) => (
                      <option key={t.template_id} value={t.template_id}>{t.name} ({t.code})</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Department</label>
                    <select
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                    >
                      <option value="">All Departments</option>
                      {departments.map((d) => (
                        <option key={d.department_id || d.id} value={d.department_id || d.id}>
                          {d.department_name || d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Designation</label>
                    <select
                      value={filterDesig}
                      onChange={(e) => setFilterDesig(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                    >
                      <option value="">All Designations</option>
                      {designations.map((d) => (
                        <option key={d.designation_id || d.id} value={d.designation_id || d.id}>
                          {d.job_title || d.designation_name || d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    Employees <span className="text-[#E42527]">*</span>
                    <span className="ml-2 rounded-full bg-[#E42527] px-2 py-0.5 text-[10px] font-bold text-white">
                      {selectedEmployees.length} selected
                    </span>
                  </label>
                  <div className="relative mb-2">
                    <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={empSearch}
                      onChange={(e) => setEmpSearch(e.target.value)}
                      placeholder="Search employee..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50">
                    {filteredEmployees.length === 0 ? (
                      <div className="px-4 py-10 text-center text-[13px] text-slate-500">No employees found</div>
                    ) : (
                      filteredEmployees.map((emp) => {
                        const id = emp.employee_id || emp.id;
                        const checked = selectedEmployees.includes(id);
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 transition last:border-0 ${
                              checked ? "bg-red-50/60" : "hover:bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setSelectedEmployees((prev) =>
                                  checked ? prev.filter((x) => x !== id) : [...prev, id]
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                            />
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700">
                              {empName(emp).slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-semibold text-slate-800">{empName(emp)}</p>
                              <p className="truncate text-[11px] text-slate-500">{emp.employee_code || ""}</p>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                  {selectedEmployees.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedEmployees([])}
                      className="mt-2 text-[12px] font-semibold text-[#E42527] hover:underline"
                    >
                      Clear all selected
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Issue Date</label>
                    <input
                      type="date"
                      value={generateForm.issue_date}
                      onChange={(e) => setGenerateForm((p) => ({ ...p, issue_date: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Effective Date</label>
                    <input
                      type="date"
                      value={generateForm.effective_date}
                      onChange={(e) => setGenerateForm((p) => ({ ...p, effective_date: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Signatory</label>
                  <select
                    value={generateForm.signatory_id}
                    onChange={(e) => setGenerateForm((p) => ({ ...p, signatory_id: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  >
                    <option value="">Optional — no signatory</option>
                    {signatories.map((s) => (
                      <option key={s.signatory_id} value={s.signatory_id}>
                        {s.name} — {s.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <label className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={generateForm.publish_to_ess}
                      onChange={(e) => setGenerateForm((p) => ({ ...p, publish_to_ess: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                    />
                    Publish to ESS
                  </label>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={generateForm.send_email}
                      onChange={(e) => setGenerateForm((p) => ({ ...p, send_email: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                    />
                    Send Email
                  </label>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setGenerateForm(EMPTY_GENERATE);
                      setSelectedEmployees([]);
                      setFilterDept(""); setFilterDesig(""); setEmpSearch("");
                    }}
                    className="h-10 rounded-lg border border-slate-200 px-4 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading || selectedEmployees.length === 0}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-6 text-[13px] font-bold text-white shadow-md shadow-red-500/20 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Icons.Sparkle className="h-4 w-4" />
                        Generate {selectedEmployees.length} Letter{selectedEmployees.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========== CREATE TEMPLATE ========== */}
        {activeTab === "create-template" && (
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/20">
                    <Icons.Template className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900">Add Letter Template</h2>
                    <p className="text-[12px] text-slate-500">
                      Choose from professional library — letterhead & signature added automatically
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreateTemplateFromSample} className="space-y-6 p-6">
                <div>
                  <label className="mb-3 block text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    Letter Type <span className="text-[#E42527]">*</span>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(PROFESSIONAL_TEMPLATES).map(([key, t]) => {
                      const selected = selectedSampleKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedSampleKey(key)}
                          className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition ${
                            selected
                              ? "border-[#E42527] bg-gradient-to-br from-red-50 to-white shadow-md shadow-red-500/10"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          {selected && (
                            <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#E42527]">
                              <Icons.Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                              {t.category}
                            </span>
                          </div>
                          <p className="mt-2 text-[13px] font-bold text-slate-900">{t.name}</p>
                          <p className="mt-0.5 text-[11px] text-slate-500">{t.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    Category <span className="text-[#E42527]">*</span>
                  </label>
                  <select
                    required
                    value={templateCategoryId}
                    onChange={(e) => setTemplateCategoryId(e.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>{c.name}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
                      ⚠ First create a category from Categories tab
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <label className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={templateRequiresApproval}
                      onChange={(e) => setTemplateRequiresApproval(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                    />
                    Requires Approval
                  </label>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={templateAllowRequest}
                      onChange={(e) => setTemplateAllowRequest(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                    />
                    Allow Employee Self Request
                  </label>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    disabled={loading || !selectedSampleKey || !templateCategoryId}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-6 text-[13px] font-bold text-white shadow-md shadow-red-500/20 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Creating..." : "Create Template"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========== CREATE SIGNATORY ========== */}
        {activeTab === "create-signatory" && (
          <div className="mx-auto max-w-lg">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20">
                    <Icons.Sign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900">Add Signatory</h2>
                    <p className="text-[12px] text-slate-500">Who signs the letters on behalf of company</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleCreateSignatory} className="space-y-4 p-6">
                <input
                  required
                  value={signatoryForm.name}
                  onChange={(e) => setSignatoryForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Full Name *"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                />
                <input
                  required
                  value={signatoryForm.designation}
                  onChange={(e) => setSignatoryForm((p) => ({ ...p, designation: e.target.value }))}
                  placeholder="Designation *"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={signatoryForm.department}
                    onChange={(e) => setSignatoryForm((p) => ({ ...p, department: e.target.value }))}
                    placeholder="Department"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  />
                  <input
                    type="email"
                    value={signatoryForm.email}
                    onChange={(e) => setSignatoryForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Email"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none transition focus:border-[#E42527] focus:bg-white focus:ring-2 focus:ring-[#E42527]/10"
                  />
                </div>
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={signatoryForm.is_default}
                    onChange={(e) => setSignatoryForm((p) => ({ ...p, is_default: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 accent-[#E42527]"
                  />
                  Set as default signatory
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] text-[13px] font-bold text-white shadow-md shadow-red-500/20 transition hover:shadow-lg disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Add Signatory"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ============ PREVIEW MODAL ============ */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 p-4 pt-8 backdrop-blur-sm">
          <div className="mb-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Icons.Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Letter Preview</p>
                  <p className="text-[14px] font-bold text-slate-900">A4 Print Preview</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const w = window.open("", "_blank");
                    if (w) {
                      w.document.write(previewLetter);
                      w.document.close();
                      w.onload = () => setTimeout(() => w.print(), 400);
                    }
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-4 text-[13px] font-semibold text-white shadow-sm"
                >
                  <Icons.Download className="h-4 w-4" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLetter(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                >
                  <Icons.X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-y-auto bg-slate-100 p-5">
              <div className="mx-auto bg-white shadow-lg" style={{ maxWidth: 794 }}>
                <iframe
                  title="Letter Preview"
                  srcDoc={previewLetter}
                  className="h-[1050px] w-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ TEMPLATE MODAL ============ */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={() => setSelectedTemplate(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600">
                  <Icons.File className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900">{selectedTemplate.name}</p>
                  <p className="text-[11px] font-mono text-slate-500">{selectedTemplate.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100"
              >
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {[
                ["Version", `v${selectedTemplate.version || 1}`],
                ["Approval", selectedTemplate.requires_approval ? "Required" : "Not Required"],
                ["Self Request", selectedTemplate.allow_employee_request ? "Enabled" : "Disabled"],
                ["Status", selectedTemplate.is_active ? "Active" : "Inactive"],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{l}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-slate-800">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="h-9 rounded-lg border border-slate-200 px-4 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50"
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