"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

/* ============================================================
   OFFER VARIANTS — maps to backend endpoints
============================================================ */
const OFFER_VARIANTS = [
  {
    code: "OFF-CLASSIC",
    endpoint: "classic",
    name: "Classic Professional",
    description: "Traditional corporate offer with detailed terms",
    accent: "from-blue-500 to-blue-600",
    ring: "ring-blue-500",
  },
  {
    code: "OFF-MODERN",
    endpoint: "modern",
    name: "Modern Startup",
    description: "Casual, culture-first tone for early-stage teams",
    accent: "from-violet-500 to-violet-600",
    ring: "ring-violet-500",
  },
  {
    code: "OFF-EXECUTIVE",
    endpoint: "executive",
    name: "Executive Leadership",
    description: "Senior role offer with ESOPs and additional perks",
    accent: "from-amber-500 to-amber-600",
    ring: "ring-amber-500",
  },
];

/* ============================================================
   STATUS CONFIG
============================================================ */
const STATUS_CONFIG = {
  draft: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", border: "border-slate-200", label: "Draft" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200", label: "Pending" },
  pending_approval: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200", label: "Pending Approval" },
  approved: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200", label: "Approved" },
  sent: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200", label: "Sent" },
  published: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200", label: "Published" },
  generated: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200", label: "Generated" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", border: "border-rose-200", label: "Cancelled" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200", label: "Rejected" },
  viewed: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500", border: "border-cyan-200", label: "Viewed" },
};

/* ============================================================
   TEMPLATE LIBRARY — all 25 samples, client-side only
============================================================ */
const TEMPLATE_LIBRARY = [
  {
    family: "OFFER", label: "Offer Letters", category: "Hiring", description: "Employment offers for candidates",
    samples: [
      { key: "OFF-CLASSIC", name: "Classic Professional", code: "OFF-CLASSIC", description: "Traditional corporate offer with detailed terms",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>We are delighted to extend an offer of employment to you for the position of <strong>{{custom.offer.designation}}</strong> at <strong>{{company.name}}</strong>.</p>
<p>Your appointment will be effective from <strong>{{custom.offer.joining_date}}</strong>, and you will be based at our <strong>{{custom.offer.location}}</strong> office.</p>
<h3>1. Compensation</h3><p>Your annual Cost to Company (CTC) will be <strong>₹ {{employee.annual_ctc}}</strong>.</p>
<h3>2. Probation</h3><p>You will be on probation for six (6) months from the date of joining.</p>
<h3>3. Notice Period</h3><p>Post-confirmation, the notice period will be sixty (60) days from either side.</p>
<h3>4. Documents Required at Joining</h3><ul><li>Educational certificates</li><li>Relieving letter from previous employer</li><li>PAN, Aadhaar, photographs</li></ul>
<p>Please confirm acceptance by signing and returning this letter by <strong>{{custom.offer.expiry_date}}</strong>.</p>` },
      { key: "OFF-MODERN", name: "Modern Startup", code: "OFF-MODERN", description: "Casual, culture-first tone",
        content_html: `<p>Hi <strong>{{employee.full_name}}</strong>,</p>
<p>We're excited to have you join us as <strong>{{custom.offer.designation}}</strong> at <strong>{{company.name}}</strong>.</p>
<p><strong>What you'll get:</strong></p>
<ul><li>Role: {{custom.offer.designation}}</li><li>Team: {{employee.department}}</li><li>Location: {{custom.offer.location}}</li><li>Start date: {{custom.offer.joining_date}}</li><li>CTC: ₹ {{employee.annual_ctc}} per annum</li></ul>
<p>To accept: reply with a signed copy before <strong>{{custom.offer.expiry_date}}</strong>.</p>` },
      { key: "OFF-EXECUTIVE", name: "Executive Leadership", code: "OFF-EXECUTIVE", description: "Senior role offer with ESOPs",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>Following our recent conversations, we are pleased to offer you the position of <strong>{{custom.offer.designation}}</strong> at <strong>{{company.name}}</strong>, reporting to <strong>{{custom.offer.reporting_to}}</strong>.</p>
<p>Your appointment will commence on <strong>{{custom.offer.joining_date}}</strong>, based at our <strong>{{custom.offer.location}}</strong> office.</p>
<h3>1. Compensation</h3><p>Your annual CTC will be <strong>₹ {{employee.annual_ctc}}</strong>. In addition:</p>
<ul><li>Performance Bonus: up to {{custom.offer.bonus_percent}}% of CTC</li><li>ESOPs: {{custom.offer.esops}} stock options</li><li>Retention Bonus: ₹ {{custom.offer.retention_bonus}}</li></ul>
<h3>2. Notice Period</h3><p>{{custom.offer.notice_period}} from either side.</p>
<p>Please confirm acceptance by <strong>{{custom.offer.expiry_date}}</strong>.</p>` },
    ],
  },
  { family: "APPOINTMENT", label: "Appointment Letters", category: "Hiring", description: "Formal appointment letters issued at joining",
    samples: [
      { key: "APT-STANDARD", name: "Standard Appointment", code: "APT-STANDARD", description: "The default appointment letter",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>We are pleased to confirm your appointment as <strong>{{employee.designation}}</strong> in the <strong>{{employee.department}}</strong> department at <strong>{{company.name}}</strong>, effective from <strong>{{employee.joining_date}}</strong>.</p>
<h3>1. Compensation</h3><p>Your annual CTC is <strong>₹ {{custom.offer.ctc}}</strong>.</p>
<h3>2. Probation</h3><p>You will be on probation for six (6) months.</p>
<h3>3. Working Hours</h3><p>Standard working hours are 9:30 AM to 6:30 PM, Monday to Friday.</p>
<h3>4. Leave</h3><ul><li>Earned Leave: 1.5 days/month</li><li>Casual Leave: 12 days/year</li><li>Sick Leave: 6 days/year</li></ul>` },
      { key: "APT-DETAILED", name: "Detailed with Annexure", code: "APT-DETAILED", description: "Full terms and policy reference",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>Further to your acceptance of our offer, we are pleased to confirm your appointment as <strong>{{employee.designation}}</strong> with effect from <strong>{{employee.joining_date}}</strong>.</p>
<h3>1. Place of Work</h3><p>Your initial place of posting will be <strong>{{custom.offer.location}}</strong>.</p>
<h3>2. Compensation &amp; Benefits</h3><p>Annual CTC: <strong>₹ {{custom.offer.ctc}}</strong>.</p>
<ul><li>Group Health Insurance — ₹5 lakh cover</li><li>Group Personal Accident Insurance — ₹25 lakh cover</li><li>Provident Fund and Gratuity as per statute</li></ul>` },
      { key: "APT-SHORT", name: "Short Form", code: "APT-SHORT", description: "One-page quick confirmation",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>We are pleased to confirm your appointment with <strong>{{company.name}}</strong> as <strong>{{employee.designation}}</strong>, effective <strong>{{employee.joining_date}}</strong>.</p>
<p><strong>Key terms:</strong></p>
<ul><li>Department: {{employee.department}}</li><li>Annual CTC: ₹ {{custom.offer.ctc}}</li><li>Probation: 6 months</li><li>Notice period: 60 days</li><li>Working hours: 9:30 AM – 6:30 PM, Mon–Fri</li></ul>` },
    ],
  },
  { family: "INTERNSHIP", label: "Internship Letters", category: "Hiring", description: "Paid, unpaid, and academic internships",
    samples: [
      { key: "INT-PAID", name: "Paid Internship", code: "INT-PAID", description: "Monthly stipend + certificate",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>We are pleased to offer you an internship at <strong>{{company.name}}</strong> as a <strong>{{employee.designation}}</strong> Intern.</p>
<h3>1. Duration</h3><p>From <strong>{{custom.internship.start_date}}</strong> to <strong>{{custom.internship.end_date}}</strong> — <strong>{{custom.internship.duration}}</strong>.</p>
<h3>2. Stipend</h3><p>You will receive a monthly stipend of <strong>₹ {{custom.internship.stipend}}</strong>.</p>
<h3>3. Mentor</h3><p>You will report to <strong>{{custom.internship.mentor}}</strong>.</p>` },
      { key: "INT-UNPAID", name: "Unpaid Internship", code: "INT-UNPAID", description: "Learning-focused, certificate only",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>We are pleased to offer you an unpaid internship at <strong>{{company.name}}</strong> in the <strong>{{employee.department}}</strong> department.</p>
<h3>1. Duration</h3><p><strong>{{custom.internship.duration}}</strong>, from <strong>{{custom.internship.start_date}}</strong> to <strong>{{custom.internship.end_date}}</strong>.</p>
<h3>2. Nature</h3><p>This is an unpaid, learning-oriented internship. No stipend or benefits are provided.</p>
<h3>3. Mentor</h3><p>You will be mentored by <strong>{{custom.internship.mentor}}</strong>.</p>` },
      { key: "INT-ACADEMIC", name: "Academic / College", code: "INT-ACADEMIC", description: "Curriculum-based internship for college credit",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>This letter confirms that <strong>{{company.name}}</strong> is offering you a curriculum-based internship in the <strong>{{employee.department}}</strong> department.</p>
<h3>1. Duration</h3><p>From <strong>{{custom.internship.start_date}}</strong> to <strong>{{custom.internship.end_date}}</strong> — <strong>{{custom.internship.duration}}</strong>.</p>
<h3>2. Remuneration</h3><p>Unpaid academic internship. Travel and accommodation are borne by you.</p>` },
    ],
  },
  { family: "EXPERIENCE", label: "Experience Letters", category: "Exit", description: "Service certificates for exiting employees",
    samples: [
      { key: "EXP-SIMPLE", name: "Simple Factual", code: "EXP-SIMPLE", description: "Minimal certificate confirming employment",
        content_html: `<p style="text-align:center"><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
<p>This is to certify that <strong>{{employee.full_name}}</strong> (Employee Code: <strong>{{employee.employee_code}}</strong>) was employed with <strong>{{company.name}}</strong> from <strong>{{employee.joining_date}}</strong> to <strong>{{employee.leaving_date}}</strong>.</p>
<p>At the time of leaving, they were serving as <strong>{{employee.designation}}</strong> in the <strong>{{employee.department}}</strong> department.</p>
<p>During their tenure, their conduct and performance were found to be satisfactory.</p>` },
      { key: "EXP-DETAILED", name: "Detailed with Duties", code: "EXP-DETAILED", description: "With responsibilities and performance notes",
        content_html: `<p style="text-align:center"><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
<p>This is to certify that <strong>{{employee.full_name}}</strong> was employed with <strong>{{company.name}}</strong> from <strong>{{employee.joining_date}}</strong> to <strong>{{employee.leaving_date}}</strong>, serving as <strong>{{employee.designation}}</strong>.</p>
<h3>Key Responsibilities Held</h3><ul><li>Owned and delivered core deliverables</li><li>Collaborated with cross-functional teams</li><li>Mentored junior team members</li></ul>
<h3>Conduct &amp; Performance</h3><p>Performance was consistently rated as meeting or exceeding expectations.</p>` },
      { key: "EXP-REHIRE", name: "With Rehire Eligibility", code: "EXP-REHIRE", description: "Explicitly confirms rehire eligibility",
        content_html: `<p style="text-align:center"><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
<p>This is to certify that <strong>{{employee.full_name}}</strong> worked with <strong>{{company.name}}</strong> from <strong>{{employee.joining_date}}</strong> to <strong>{{employee.leaving_date}}</strong>.</p>
<p>They would be <strong>eligible for rehire</strong> at our organisation should an appropriate opportunity arise.</p>` },
    ],
  },
  { family: "RELIEVING", label: "Relieving Letters", category: "Exit", description: "Relieving letters with FnF details",
    samples: [
      { key: "REL-SIMPLE", name: "Simple Relieving", code: "REL-SIMPLE", description: "Confirms relieving date",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>This is to confirm that you have been relieved from your duties at <strong>{{company.name}}</strong>, effective close of business on <strong>{{employee.leaving_date}}</strong>.</p>
<p>You were serving as <strong>{{employee.designation}}</strong> in the <strong>{{employee.department}}</strong> department.</p>
<p>We thank you for your contributions.</p>` },
      { key: "REL-FNF", name: "With FnF Settlement", code: "REL-FNF", description: "Includes full-and-final settlement details",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>Your resignation has been accepted with effect from close of business on <strong>{{employee.leaving_date}}</strong>.</p>
<h3>Full &amp; Final Settlement</h3>
<p>Your settlement will be processed within 30 days from your last working day.</p>
<ul><li>Salary for days worked</li><li>Encashment of unutilised earned leave</li><li>Less: Notice period recovery (if applicable)</li><li>Less: TDS and statutory deductions</li></ul>` },
    ],
  },
  { family: "REVISION", label: "Salary Revision", category: "Compensation", description: "Salary revision and increment letters",
    samples: [
      { key: "REV-STANDARD", name: "Standard Revision", code: "REV-STANDARD", description: "Formal salary revision letter",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>In recognition of your continued contribution to <strong>{{company.name}}</strong>, we are pleased to inform you that your compensation has been revised with effect from <strong>{{custom.revision.effective_date}}</strong>.</p>
<h3>Revised Compensation</h3><table><tr><td>Previous Annual CTC</td><td>₹ {{custom.revision.old_ctc}}</td></tr><tr><td>Revised Annual CTC</td><td><strong>₹ {{custom.revision.new_ctc}}</strong></td></tr></table>` },
    ],
  },
  { family: "PROMOTION", label: "Promotion Letter", category: "Compensation", description: "Promotion and role upgrade letters",
    samples: [
      { key: "PRM-STANDARD", name: "Standard Promotion", code: "PRM-STANDARD", description: "New role with new responsibilities",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>You have been promoted from <strong>{{custom.promotion.old_designation}}</strong> to <strong>{{custom.promotion.new_designation}}</strong>, effective <strong>{{custom.promotion.effective_date}}</strong>.</p>
<h3>Revised Details</h3><table><tr><td>New Designation</td><td><strong>{{custom.promotion.new_designation}}</strong></td></tr><tr><td>Effective Date</td><td>{{custom.promotion.effective_date}}</td></tr></table>` },
    ],
  },
  { family: "CONFIRMATION", label: "Confirmation Letter", category: "General", description: "Probation confirmation letters",
    samples: [
      { key: "CNF-STANDARD", name: "Standard Confirmation", code: "CNF-STANDARD", description: "Confirms successful completion of probation",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>We refer to your appointment letter and are pleased to inform you that your probation period has been successfully completed.</p>
<p>You are hereby <strong>confirmed</strong> as a permanent employee of <strong>{{company.name}}</strong> in the position of <strong>{{employee.designation}}</strong>, effective <strong>{{letter.effective_date}}</strong>.</p>
<h3>Terms Post-Confirmation</h3><ul><li>Notice period: 60 days from either side</li><li>Annual leave: As per company policy</li><li>Statutory benefits: PF, Gratuity, insurance as applicable</li></ul>` },
    ],
  },
  { family: "WARNING", label: "Warning Letters", category: "Discipline", description: "First and final warnings",
    samples: [
      { key: "WRN-FIRST", name: "First Warning", code: "WRN-FIRST", description: "Formal first warning for conduct issues",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>It has come to the attention of management that your conduct did not meet the expected standards of professional behaviour at <strong>{{company.name}}</strong>.</p>
<p style="padding:12px 16px;border-left:3px solid #E42527;background:#fef2f2;"><strong>{{custom.warning.reason}}</strong></p>
<p>This letter serves as a <strong>formal warning</strong>.</p>` },
      { key: "WRN-FINAL", name: "Final Warning", code: "WRN-FINAL", description: "Final warning before termination",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>Despite earlier warnings, your conduct continues to fall below the standards expected at <strong>{{company.name}}</strong>.</p>
<p style="padding:12px 16px;border-left:3px solid #E42527;background:#fef2f2;"><strong>{{custom.warning.reason}}</strong></p>
<p>This is a <strong>final written warning</strong>.</p>` },
    ],
  },
  { family: "TRANSFER", label: "Transfer Letter", category: "General", description: "Inter-office or inter-department transfers",
    samples: [
      { key: "TRF-STANDARD", name: "Standard Transfer", code: "TRF-STANDARD", description: "Location or department transfer",
        content_html: `<p>Dear <strong>{{employee.full_name}}</strong>,</p>
<p>Due to business requirements, you are hereby transferred from your current assignment, effective <strong>{{letter.effective_date}}</strong>.</p>
<h3>Transfer Details</h3><table><tr><td>Current Department</td><td>{{employee.department}}</td></tr><tr><td>New Department</td><td><strong>{{custom.transfer.new_department}}</strong></td></tr><tr><td>New Location</td><td><strong>{{custom.transfer.new_location}}</strong></td></tr><tr><td>Reporting To</td><td>{{custom.transfer.new_manager}}</td></tr></table>` },
    ],
  },
  { family: "SALARY_CERT", label: "Salary Certificate", category: "General", description: "For visa, loan, or bank purposes",
    samples: [
      { key: "SC-STANDARD", name: "Standard Salary Certificate", code: "SC-STANDARD", description: "Annual, monthly gross, and monthly net",
        content_html: `<p style="text-align:center"><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
<p>This is to certify that <strong>{{employee.full_name}}</strong> is currently employed with <strong>{{company.name}}</strong> as <strong>{{employee.designation}}</strong> since <strong>{{employee.joining_date}}</strong>.</p>
<h3>Compensation Details</h3><table><tr><td>Annual CTC</td><td>₹ {{custom.offer.ctc}}</td></tr><tr><td>Monthly Gross Salary</td><td>₹ {{custom.salary.monthly_gross}}</td></tr><tr><td>Monthly Net Salary</td><td>₹ {{custom.salary.monthly_net}}</td></tr></table>` },
    ],
  },
  { family: "NOC", label: "NOC Letter", category: "General", description: "No Objection Certificates",
    samples: [
      { key: "NOC-STANDARD", name: "Standard NOC", code: "NOC-STANDARD", description: "For higher studies, part-time work, etc.",
        content_html: `<p style="text-align:center"><strong>NO OBJECTION CERTIFICATE</strong></p>
<p>This is to certify that <strong>{{employee.full_name}}</strong> is currently employed with <strong>{{company.name}}</strong> as <strong>{{employee.designation}}</strong> since <strong>{{employee.joining_date}}</strong>.</p>
<p><strong>{{company.name}}</strong> has no objection to <strong>{{employee.full_name}}</strong> pursuing <strong>{{custom.noc.purpose}}</strong>.</p>
<p>This NOC is valid for <strong>{{custom.noc.validity}}</strong> from the date of issue.</p>` },
    ],
  },
  { family: "BONAFIDE", label: "Bonafide / Address Proof", category: "General", description: "Bonafide certificates and address proofs",
    samples: [
      { key: "BON-STANDARD", name: "Standard Bonafide", code: "BON-STANDARD", description: "Address or employment proof",
        content_html: `<p style="text-align:center"><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
<p>This is to certify that <strong>{{employee.full_name}}</strong> is a bona fide employee of <strong>{{company.name}}</strong>, currently holding the position of <strong>{{employee.designation}}</strong>.</p>
<p>They have been associated with the organisation since <strong>{{employee.joining_date}}</strong>.</p>
<p>This certificate is issued for <strong>{{custom.bonafide.purpose}}</strong>.</p>` },
    ],
  },
];

/* ============================================================
   HELPERS
============================================================ */
function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (err?.code === "ERR_NETWORK") return "Network error. Check your connection.";
  if (err?.response?.status === 401) return "Session expired.";
  if (err?.response?.status === 403) return "You don't have permission.";
  if (err?.response?.status === 404) return "Not found.";
  return err?.message || "Something went wrong";
}

function pickList(res) {
  const body = res?.data ?? {};
  const list =
    body?.data ?? body?.items ?? body?.results ?? body?.employees ??
    body?.departments ?? body?.designations ?? body?.templates ??
    body?.categories ?? body?.letters ?? body?.signatories ?? [];
  return Array.isArray(list) ? list : Array.isArray(body) ? body : [];
}

function empName(emp) {
  if (!emp) return "—";
  if (emp.full_name) return emp.full_name;
  const n = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
  return n || emp.employee_code || emp.employee_id || "—";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return String(value); }
}

/* ============================================================
   SAMPLE HTML BUILDER — client-side A4 letter
============================================================ */
function buildSampleHtml(sample) {
  if (!sample?.content_html) return "";

  const company = {
    name: "EZLIFE HRMS PVT LTD",
    address: "Level 5, Prestige Tech Park, Bengaluru, Karnataka — 560103",
    phone: "+91 80 4000 4000",
    email: "hr@ezlife.example",
    website: "www.ezlife.example",
    gstin: "29ABCDE1234F1Z5",
    cin: "U72900KA2015PTC080111",
  };
  const employee = {
    full_name: "Swati Yadav",
    employee_code: "EMP000123",
    designation: "Senior Software Engineer",
    department: "Engineering",
    joining_date: "01 Sep 2024",
    leaving_date: "30 Nov 2026",
  };
  const custom = {
    "custom.offer.designation": "Senior Software Engineer",
    "custom.offer.department": "Engineering",
    "custom.offer.location": "Bengaluru",
    "custom.offer.ctc": "12,00,000",
    "custom.offer.joining_date": "15 Nov 2026",
    "custom.offer.expiry_date": "30 Oct 2026",
    "custom.offer.reporting_to": "Chief Technology Officer",
    "custom.offer.bonus_percent": "20",
    "custom.offer.esops": "50,000",
    "custom.offer.retention_bonus": "5,00,000",
    "custom.offer.notice_period": "Ninety (90) days",
    "custom.internship.start_date": "01 Nov 2026",
    "custom.internship.end_date": "31 Jan 2027",
    "custom.internship.duration": "3 months",
    "custom.internship.stipend": "15,000",
    "custom.internship.mentor": "Ravi Kumar",
    "custom.revision.old_ctc": "8,00,000",
    "custom.revision.new_ctc": "12,00,000",
    "custom.revision.effective_date": "01 Nov 2026",
    "custom.promotion.old_designation": "Software Engineer",
    "custom.promotion.new_designation": "Senior Software Engineer",
    "custom.promotion.effective_date": "01 Nov 2026",
    "custom.warning.reason": "Repeated late arrival and unapproved absence.",
    "custom.transfer.new_department": "Platform",
    "custom.transfer.new_location": "Hyderabad",
    "custom.transfer.new_manager": "Ravi Kumar",
    "custom.salary.monthly_gross": "94,000.00",
    "custom.salary.monthly_net": "89,200.00",
    "custom.noc.purpose": "higher studies",
    "custom.noc.validity": "6 months",
    "custom.bonafide.purpose": "address proof",
  };

  const tokens = {
    "{{employee.full_name}}": employee.full_name,
    "{{employee.employee_code}}": employee.employee_code,
    "{{employee.designation}}": employee.designation,
    "{{employee.department}}": employee.department,
    "{{employee.joining_date}}": employee.joining_date,
    "{{employee.leaving_date}}": employee.leaving_date,
    "{{company.name}}": company.name,
    "{{company.address}}": company.address,
    "{{company.phone}}": company.phone,
    "{{company.email}}": company.email,
    "{{company.website}}": company.website,
    "{{company.gstin}}": company.gstin,
    "{{company.cin}}": company.cin,
    "{{letter.number}}": "SAMPLE/2026/00001",
    "{{letter.issue_date}}": "01 Oct 2026",
    "{{letter.effective_date}}": "01 Oct 2026",
    "{{signatory.name}}": "Aloo Bukhara",
    "{{signatory.designation}}": "Head of Human Resources",
    "{{signatory.department}}": "Human Resources",
    "{{employee.annual_ctc}}": "12,00,000.00",
  };
  Object.entries(custom).forEach(([k, v]) => { tokens[`{{${k}}}`] = v; });

  let body = sample.content_html;
  Object.entries(tokens).forEach(([t, v]) => { body = body.split(t).join(v); });

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>${sample.code}</title>
<style>
  @page { size: A4; margin: 15mm 18mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, Cambria, 'Times New Roman', serif; font-size: 13.5px; line-height: 1.7; color: #1a202c; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .wrap { max-width: 780px; margin: 0 auto; padding: 4px 2px 20px; }
  .head { display: flex; align-items: center; gap: 20px; padding-bottom: 14px; }
  .logo { width: 68px; height: 68px; background: linear-gradient(135deg,#1a365d,#2b6cb0); color: #fff; font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; display: flex; align-items: center; justify-content: center; border-radius: 10px; letter-spacing: 1px; flex-shrink: 0; }
  .cname { font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #0f2540; text-transform: uppercase; margin-bottom: 4px; }
  .caddr { font-family: Helvetica, Arial, sans-serif; font-size: 10.5px; color: #4a5568; line-height: 1.6; }
  .sep { height: 3px; background: linear-gradient(90deg,#0f2540,#2b6cb0,#0f2540); margin-bottom: 3px; }
  .sep2 { height: 1px; background: #0f2540; opacity: .5; margin-bottom: 20px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 12.5px; gap: 20px; }
  .meta .lbl { color: #718096; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; display: block; margin-bottom: 2px; }
  .meta .val { color: #0f2540; font-weight: 600; font-size: 13px; }
  .body p { margin-bottom: 14px; text-align: justify; line-height: 1.75; }
  .body strong { color: #0f2540; font-weight: 700; }
  .body h1, .body h2, .body h3 { color: #0f2540; margin: 16px 0 10px; font-weight: 700; }
  .body ul, .body ol { margin: 12px 0 16px 24px; }
  .body li { margin-bottom: 6px; }
  .body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  .body td { padding: 6px 10px 6px 0; vertical-align: top; }
  .body td:first-child { color: #4a5568; width: 180px; }
  .body td:last-child { color: #0f2540; font-weight: 600; }
  .sig { margin-top: 42px; font-family: Helvetica, Arial, sans-serif; page-break-inside: avoid; }
  .sig .closing { margin-bottom: 4px; font-family: Georgia, serif; font-size: 13.5px; }
  .sig .forco { margin-bottom: 36px; font-size: 13px; }
  .sig .name { font-weight: 700; font-size: 14px; color: #0f2540; }
  .sig .desig { font-size: 12.5px; color: #2d3748; }
  .foot { margin-top: 54px; padding-top: 12px; border-top: 1px solid #cbd5e0; font-family: Helvetica, Arial, sans-serif; font-size: 9.5px; color: #718096; text-align: center; line-height: 1.6; }
  .page-break { page-break-after: always; }
</style></head>
<body><div class="wrap">
  <div class="head"><div class="logo">EZ</div>
    <div><div class="cname">${company.name}</div>
      <div class="caddr">${company.address}<br/>Tel: ${company.phone} &nbsp;·&nbsp; ${company.email} &nbsp;·&nbsp; ${company.website}<br/>CIN: ${company.cin} &nbsp;·&nbsp; GSTIN: ${company.gstin}</div>
    </div></div>
  <div class="sep"></div><div class="sep2"></div>
  <div class="meta">
    <div><span class="lbl">Reference No.</span><span class="val">SAMPLE/2026/00001</span></div>
    <div style="text-align:right"><span class="lbl">Date</span><span class="val">01 Oct 2026</span></div>
  </div>
  <div class="body">${body}</div>
  <div class="sig">
    <div class="closing">Yours sincerely,</div>
    <div class="forco">For <strong>${company.name}</strong></div>
    <div class="name">Aloo Bukhara</div>
    <div class="desig">Head of Human Resources</div>
  </div>
  <div class="foot">${company.name} &nbsp;·&nbsp; Confidential — For official use only<br/>Sample preview · Generated by EZLife HRMS</div>
</div></body></html>`;
}

function printHtml(html) {
  const w = window.open("", "_blank");
  if (!w) { alert("Popup blocked. Please allow popups for this site."); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 600);
}

function downloadSample(sample) {
  printHtml(buildSampleHtml(sample));
}

function downloadAllSamples() {
  const allSamples = TEMPLATE_LIBRARY.flatMap((f) => f.samples);
  const pages = allSamples.map((s, idx) => {
    const html = buildSampleHtml(s);
    const m = html.match(/<body>([\s\S]*)<\/body>/);
    const body = m ? m[1] : "";
    return `<div class="${idx < allSamples.length - 1 ? "page-break" : ""}">${body}</div>`;
  }).join("");

  const combined = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>All Sample Letters — EZLife HRMS</title>
<style>
  @page { size: A4; margin: 15mm 18mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, Cambria, serif; font-size: 13.5px; line-height: 1.7; color: #1a202c; background: #fff; }
  .page-break { page-break-after: always; }
  .wrap { max-width: 780px; margin: 0 auto; padding: 4px 2px 20px; }
  .head { display: flex; align-items: center; gap: 20px; padding-bottom: 14px; }
  .logo { width: 68px; height: 68px; background: linear-gradient(135deg,#1a365d,#2b6cb0); color: #fff; font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; display: flex; align-items: center; justify-content: center; border-radius: 10px; letter-spacing: 1px; flex-shrink: 0; }
  .cname { font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #0f2540; text-transform: uppercase; margin-bottom: 4px; }
  .caddr { font-family: Helvetica, Arial, sans-serif; font-size: 10.5px; color: #4a5568; line-height: 1.6; }
  .sep { height: 3px; background: linear-gradient(90deg,#0f2540,#2b6cb0,#0f2540); margin-bottom: 3px; }
  .sep2 { height: 1px; background: #0f2540; opacity: .5; margin-bottom: 20px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 12.5px; }
  .meta .lbl { color: #718096; font-weight: 500; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 2px; }
  .meta .val { color: #0f2540; font-weight: 600; font-size: 13px; }
  .body p { margin-bottom: 14px; text-align: justify; line-height: 1.75; }
  .body strong { color: #0f2540; font-weight: 700; }
  .body h1, .body h2, .body h3 { color: #0f2540; margin: 16px 0 10px; font-weight: 700; }
  .body ul, .body ol { margin: 12px 0 16px 24px; }
  .body li { margin-bottom: 6px; }
  .body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  .body td { padding: 6px 10px 6px 0; vertical-align: top; }
  .body td:first-child { color: #4a5568; width: 180px; }
  .body td:last-child { color: #0f2540; font-weight: 600; }
  .sig { margin-top: 42px; font-family: Helvetica, Arial, sans-serif; }
  .sig .closing { margin-bottom: 4px; font-family: Georgia, serif; font-size: 13.5px; }
  .sig .forco { margin-bottom: 36px; font-size: 13px; }
  .sig .name { font-weight: 700; font-size: 14px; color: #0f2540; }
  .sig .desig { font-size: 12.5px; color: #2d3748; }
  .foot { margin-top: 54px; padding-top: 12px; border-top: 1px solid #cbd5e0; font-family: Helvetica, Arial, sans-serif; font-size: 9.5px; color: #718096; text-align: center; }
</style></head>
<body>${pages}</body></html>`;

  printHtml(combined);
}

/* ============================================================
   ICONS
============================================================ */
const Icons = {
  File: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Sparkle: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Download: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Eye: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Search: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>,
  X: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  CheckCircle: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Database: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Refresh: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Send: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Publish: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Clock: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

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

/* ============================================================
   MAIN PAGE
============================================================ */
export default function HRLettersPage() {
  const [activeTab, setActiveTab] = useState("letters"); // "letters" | "samples" | "generate"
  const [familyFilter, setFamilyFilter] = useState("");
  const [previewSample, setPreviewSample] = useState(null);

  // Letters list
  const [letters, setLetters] = useState([]);
  const [lettersLoading, setLettersLoading] = useState(false);
  const [letterSearch, setLetterSearch] = useState("");
  const [previewLetter, setPreviewLetter] = useState(null);
  const [busyLetterId, setBusyLetterId] = useState(null);

  // Generate
  const [employees, setEmployees] = useState([]);
  const [signatories, setSignatories] = useState([]);
  const [empSearch, setEmpSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    variant: "classic",
    employee_id: "",
    signatory_id: "",
    issue_date: "",
    effective_date: "",
    expiry_date: "",
    publish_to_ess: true,
    send_email: false,
    "offer.designation": "",
    "offer.location": "",
    "offer.joining_date": "",
    "offer.expiry_date": "",
    "offer.reporting_to": "",
    "offer.bonus_percent": "",
    "offer.esops": "",
    "offer.retention_bonus": "",
    "offer.notice_period": "",
  });

  /* ============ FETCH ============ */
  const fetchLetters = useCallback(async () => {
    setLettersLoading(true);
    try {
      const res = await api.get("/api/v1/letters/generated", { params: { page: 1, page_size: 100 } });
      setLetters(pickList(res));
    } catch { setLetters([]); }
    finally { setLettersLoading(false); }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/employees", { params: { page: 1, page_size: 500 } });
      setEmployees(pickList(res));
    } catch { setEmployees([]); }
  }, []);

  const fetchSignatories = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/letters/signatories", { params: { is_active: true, page: 1, page_size: 100 } });
      setSignatories(pickList(res));
    } catch { setSignatories([]); }
  }, []);

  useEffect(() => {
    fetchLetters();
    fetchEmployees();
    fetchSignatories();
  }, [fetchLetters, fetchEmployees, fetchSignatories]);

  /* ============ DERIVED ============ */
  const filteredEmployees = useMemo(() => {
    if (!empSearch.trim()) return employees;
    const q = empSearch.toLowerCase();
    return employees.filter((emp) => {
      const name = empName(emp).toLowerCase();
      const code = String(emp.employee_code || emp.employee_id || "").toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [employees, empSearch]);

  const selectedEmployee = useMemo(
    () => employees.find((e) => (e.employee_id || e.id) === form.employee_id) || null,
    [employees, form.employee_id]
  );

  const selectedVariant = OFFER_VARIANTS.find((v) => v.endpoint === form.variant) || OFFER_VARIANTS[0];

  const totalSamples = useMemo(
    () => TEMPLATE_LIBRARY.reduce((a, f) => a + f.samples.length, 0),
    []
  );

  const filteredLetters = useMemo(() => {
    if (!letterSearch.trim()) return letters;
    const q = letterSearch.toLowerCase();
    return letters.filter((l) =>
      String(l.letter_number || "").toLowerCase().includes(q) ||
      String(l.data_snapshot?.employee_name || l.employee_name || "").toLowerCase().includes(q) ||
      String(l.data_snapshot?.template_name || l.template_name || "").toLowerCase().includes(q) ||
      String(l.status || "").toLowerCase().includes(q)
    );
  }, [letters, letterSearch]);

  const stats = useMemo(() => ({
    letters: letters.length,
    published: letters.filter((l) => String(l.status).toLowerCase() === "published").length,
    drafts: letters.filter((l) => ["draft", "approved", "generated"].includes(String(l.status).toLowerCase())).length,
  }), [letters]);

  /* ============ HANDLERS ============ */
  function updateField(key, value) { setForm((p) => ({ ...p, [key]: value })); }
  function resetMessages() { setError(""); setSuccess(""); }

  async function handleGenerate(e) {
    e.preventDefault();
    resetMessages();
    if (!form.employee_id) { setError("Please select an employee"); return; }
    if (!form["offer.designation"]) { setError("Please enter offered designation"); return; }

    setLoading(true);
    try {
      const custom_fields = {};
      [
        "offer.designation", "offer.location", "offer.joining_date", "offer.expiry_date",
        "offer.reporting_to", "offer.bonus_percent", "offer.esops",
        "offer.retention_bonus", "offer.notice_period",
      ].forEach((k) => {
        if (form[k] && String(form[k]).trim() !== "") custom_fields[k] = form[k];
      });

      const payload = {
        employee_id: form.employee_id,
        issue_date: form.issue_date || null,
        effective_date: form.effective_date || null,
        expiry_date: form.expiry_date || null,
        signatory_id: form.signatory_id || null,
        publish_to_ess: form.publish_to_ess,
        send_email: form.send_email,
        custom_fields,
      };

      const res = await api.post(`/api/v1/letters/offer/${selectedVariant.endpoint}`, payload);
      const data = res?.data ?? {};
      setSuccess(
        `${selectedVariant.name} generated — ${data.letter_number || "success"}` +
        (data.letter_id ? ` (ID: ${data.letter_id})` : "")
      );
      await fetchLetters();
      setActiveTab("letters");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  /* ⭐ Fetch letter content from backend */
  async function fetchLetterContent(letterId) {
    const res = await api.get(
      `/api/v1/letters/generated/${letterId}/download`,
      { params: { format: "html" } }
    );
    const data = res?.data ?? {};
    return {
      html: data.content_html || "",
      download_url: data.download_url || "",
      letter_number: data.letter_number || "",
      message: data.message || "",
    };
  }

  /* ⭐ Preview generated letter in modal */
  async function handlePreviewLetter(letter) {
    resetMessages();
    setBusyLetterId(letter.letter_id);
    try {
      const { html } = await fetchLetterContent(letter.letter_id);
      if (!html) { setError("Letter content not available"); return; }
      setPreviewLetter({ html, letter });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyLetterId(null);
    }
  }

  /* ⭐ Download generated letter — opens new tab + print dialog → Save as PDF */
  async function handleDownloadLetter(letter) {
    resetMessages();
    setBusyLetterId(letter.letter_id);
    try {
      const { html, download_url, message } = await fetchLetterContent(letter.letter_id);

      // If backend returns a hosted URL (S3), just open it
      if (download_url) {
        window.open(download_url, "_blank", "noopener,noreferrer");
        setSuccess("Download started");
        return;
      }

      if (!html) {
        setError(message || "Letter content unavailable");
        return;
      }

      printHtml(html);
      setSuccess(`Opened ${letter.letter_number || "letter"} — use "Save as PDF" in the print dialog`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyLetterId(null);
    }
  }

  /* ⭐ Download-all in a batch — opens one combined doc with page breaks */
  async function handleDownloadAllLetters() {
    resetMessages();
    const list = filteredLetters.slice(0, 30);
    if (list.length === 0) { setError("No letters to download"); return; }

    setLettersLoading(true);
    try {
      const results = await Promise.all(
        list.map(async (l) => {
          try {
            const { html } = await fetchLetterContent(l.letter_id);
            return { letter: l, html };
          } catch { return { letter: l, html: "" }; }
        })
      );

      const valid = results.filter((r) => r.html);
      if (valid.length === 0) { setError("No letters could be downloaded"); return; }

      const pages = valid.map((r, idx) => {
        const m = r.html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const body = m ? m[1] : r.html;
        const last = idx === valid.length - 1;
        return `<div class="${last ? "" : "page-break"}">${body}</div>`;
      }).join("");

      const combined = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Generated Letters — EZLife HRMS</title>
<style>
  @page { size: A4; margin: 15mm 18mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, Cambria, serif; font-size: 13.5px; line-height: 1.7; color: #1a202c; background: #fff; }
  .page-break { page-break-after: always; }
</style></head>
<body>${pages}</body></html>`;

      printHtml(combined);
      setSuccess(`Prepared ${valid.length} letter(s) for print`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLettersLoading(false);
    }
  }

  async function handlePublishLetter(letter) {
    resetMessages();
    setBusyLetterId(letter.letter_id);
    try {
      await api.post(`/api/v1/letters/generated/${letter.letter_id}/publish`);
      setSuccess("Published to ESS");
      await fetchLetters();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyLetterId(null);
    }
  }

  async function handleSendLetter(letter) {
    resetMessages();
    setBusyLetterId(letter.letter_id);
    try {
      await api.post(`/api/v1/letters/generated/${letter.letter_id}/send`);
      setSuccess("Letter sent successfully");
      await fetchLetters();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyLetterId(null);
    }
  }

  /* ============ RENDER ============ */
  const tabs = [
    { id: "letters", label: "Generated", icon: Icons.File, count: stats.letters },
    { id: "samples", label: "Sample Library", icon: Icons.Database, count: totalSamples },
    { id: "generate", label: "Generate Offer", icon: Icons.Sparkle },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E42527] to-[#a81b1d] shadow-lg shadow-red-500/20">
                <Icons.File className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-[24px] font-bold tracking-tight text-slate-900">HR Letters</h1>
                <p className="text-[13px] text-slate-500">Generate, download, and manage letters</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadAllLetters}
                disabled={lettersLoading || filteredLetters.length === 0}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 text-[13px] font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:shadow-lg disabled:opacity-60"
              >
                <Icons.Download className="h-4 w-4" />
                Download All Generated
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("generate"); resetMessages(); }}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Icons.Sparkle className="h-4 w-4 text-[#E42527]" />
                Generate
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Generated", value: stats.letters, icon: Icons.File, bg: "bg-red-50", text: "text-red-600" },
              { label: "Published", value: stats.published, icon: Icons.CheckCircle, bg: "bg-emerald-50", text: "text-emerald-600" },
              { label: "Drafts", value: stats.drafts, icon: Icons.Clock, bg: "bg-amber-50", text: "text-amber-600" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
                      <Icon className={`h-4 w-4 ${s.text}`} />
                    </div>
                  </div>
                  <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-slate-900">{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* TABS */}
          <div className="mt-6 flex gap-1 border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); resetMessages(); }}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-[13px] font-semibold transition ${
                    isActive ? "text-[#E42527]" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {typeof tab.count === "number" && (
                    <span className={`inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive ? "bg-[#E42527] text-white" : "bg-slate-100 text-slate-600"
                    }`}>{tab.count}</span>
                  )}
                  {isActive && <span className="absolute inset-x-3 -bottom-px h-[2.5px] rounded-full bg-[#E42527]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-white px-4 py-3.5 shadow-sm">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
              <Icons.X className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-red-800">Error</p>
              <p className="mt-0.5 text-[12px] text-red-700">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600"><Icons.X className="h-4 w-4" /></button>
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
            <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-600"><Icons.X className="h-4 w-4" /></button>
          </div>
        )}

        {/* ==================== GENERATED LETTERS ==================== */}
        {activeTab === "letters" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Generated Letters</h2>
                <p className="mt-0.5 text-[12px] text-slate-500">{filteredLetters.length} letter(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={letterSearch}
                    onChange={(e) => setLetterSearch(e.target.value)}
                    placeholder="Search letters..."
                    className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] outline-none focus:border-[#E42527] focus:bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchLetters}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <Icons.Refresh className="h-4 w-4" />
                </button>
              </div>
            </div>

            {lettersLoading ? (
              <div className="space-y-2 p-5">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
              </div>
            ) : filteredLetters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100">
                  <Icons.File className="h-8 w-8 text-[#E42527]" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-slate-800">No letters generated yet</p>
                <p className="mt-1 text-[13px] text-slate-500">Generate your first letter from the "Generate Offer" tab</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("generate")}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-4 text-[13px] font-semibold text-white"
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
                    {filteredLetters.map((letter, idx) => {
                      const isBusy = busyLetterId === letter.letter_id;
                      const statusKey = String(letter.status || "").toLowerCase();
                      const canPublish = statusKey !== "published" && statusKey !== "cancelled";
                      return (
                        <tr key={letter.letter_id || idx} className="hover:bg-slate-50/70">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                                <Icons.File className="h-4 w-4 text-[#E42527]" />
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-slate-900">{letter.letter_number || "—"}</p>
                                <p className="text-[11px] text-slate-500">
                                  {letter.data_snapshot?.template_name || letter.template_name || "Letter"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[13px] text-slate-700">
                              {letter.data_snapshot?.employee_name || letter.employee_name || letter.employee_id || "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4"><StatusBadge status={letter.status} /></td>
                          <td className="px-5 py-4 text-[12px] text-slate-600">{formatDate(letter.issue_date)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handlePreviewLetter(letter)}
                                disabled={isBusy}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                              >
                                <Icons.Eye className="h-3.5 w-3.5" /> Preview
                              </button>
                              <button
                                onClick={() => handleDownloadLetter(letter)}
                                disabled={isBusy}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#E42527] px-2.5 text-[12px] font-semibold text-white hover:bg-[#c91f21] disabled:opacity-50"
                              >
                                <Icons.Download className="h-3.5 w-3.5" />
                                {isBusy ? "…" : "Download"}
                              </button>
                              {canPublish && (
                                <button
                                  onClick={() => handlePublishLetter(letter)}
                                  disabled={isBusy}
                                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                                  title="Publish to ESS"
                                >
                                  <Icons.Publish className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleSendLetter(letter)}
                                disabled={isBusy}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                                title="Send to employee"
                              >
                                <Icons.Send className="h-3.5 w-3.5" />
                              </button>
                            </div>
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

        {/* ==================== SAMPLES ==================== */}
        {activeTab === "samples" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#a81b1d]">
                  <Icons.Database className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[17px] font-bold text-slate-900">Sample Library</h2>
                  <p className="text-[12.5px] text-slate-500">
                    {totalSamples} professional samples across {TEMPLATE_LIBRARY.length} families
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadAllSamples}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-[13px] font-bold text-white shadow-md"
                >
                  <Icons.Download className="h-4 w-4" />
                  Download All Samples
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFamilyFilter("")}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                    familyFilter === "" ? "bg-[#E42527] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >All ({totalSamples})</button>
                {TEMPLATE_LIBRARY.map((f) => (
                  <button
                    key={f.family}
                    type="button"
                    onClick={() => setFamilyFilter(f.family)}
                    className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                      familyFilter === f.family ? "bg-[#E42527] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >{f.label} ({f.samples.length})</button>
                ))}
              </div>
            </div>

            {TEMPLATE_LIBRARY.filter((f) => !familyFilter || f.family === familyFilter).map((fam) => (
              <div key={fam.family} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">{fam.label}</h3>
                    <p className="text-[12px] text-slate-500">{fam.description}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                    {fam.samples.length} sample{fam.samples.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {fam.samples.map((s) => (
                    <div key={s.key} className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                            <Icons.File className="h-5 w-5 text-[#E42527]" />
                          </div>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{fam.category}</span>
                        </div>
                        <h4 className="mt-3 text-[14px] font-bold text-slate-900">{s.name}</h4>
                        <p className="mt-0.5 text-[11px] font-mono text-slate-500">{s.code}</p>
                        <p className="mt-2 text-[12px] text-slate-600">{s.description}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setPreviewSample(s)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <Icons.Eye className="h-3.5 w-3.5" /> Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadSample(s)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-3 py-2 text-[12px] font-bold text-white shadow-sm transition hover:shadow-md"
                        >
                          <Icons.Download className="h-3.5 w-3.5" /> Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== GENERATE ==================== */}
        {activeTab === "generate" && (
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E42527] to-[#a81b1d]">
                    <Icons.Sparkle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900">Generate Offer Letter</h2>
                    <p className="text-[12px] text-slate-500">Pick a variant, select an employee, fill offer details</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6 p-6">
                {/* VARIANT */}
                <div>
                  <label className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    Offer Letter Type <span className="text-[#E42527]">*</span>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {OFFER_VARIANTS.map((v) => {
                      const active = form.variant === v.endpoint;
                      return (
                        <button
                          key={v.endpoint}
                          type="button"
                          onClick={() => updateField("variant", v.endpoint)}
                          className={`rounded-2xl border-2 p-4 text-left transition ${
                            active ? `border-transparent ring-2 ${v.ring} shadow-md` : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${v.accent}`}>
                            <Icons.File className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-[13px] font-bold text-slate-900">{v.name}</p>
                          <p className="mt-0.5 text-[11px] text-slate-500">{v.description}</p>
                          <p className="mt-2 text-[10px] font-mono text-slate-400">{v.code}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* EMPLOYEE */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    Employee <span className="text-[#E42527]">*</span>
                  </label>
                  <div className="relative mb-2">
                    <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={empSearch}
                      onChange={(e) => setEmpSearch(e.target.value)}
                      placeholder="Search employee..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-[13px] outline-none focus:border-[#E42527] focus:bg-white"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50">
                    {filteredEmployees.length === 0 ? (
                      <div className="px-4 py-10 text-center text-[13px] text-slate-500">No employees found</div>
                    ) : (
                      filteredEmployees.map((emp) => {
                        const id = emp.employee_id || emp.id;
                        const checked = form.employee_id === id;
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 ${
                              checked ? "bg-red-50/60" : "hover:bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name="employee"
                              checked={checked}
                              onChange={() => updateField("employee_id", id)}
                              className="h-4 w-4 accent-[#E42527]"
                            />
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700">
                              {empName(emp).slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-semibold text-slate-800">{empName(emp)}</p>
                              <p className="truncate text-[11px] text-slate-500">{emp.employee_id || emp.employee_code || ""}</p>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                  {selectedEmployee && (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Selected: <strong className="text-slate-700">{empName(selectedEmployee)}</strong>
                    </p>
                  )}
                </div>

                {/* OFFER DETAILS */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                  <p className="mb-4 text-[12px] font-bold uppercase tracking-wider text-slate-600">Offer Details</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                        Offered Designation <span className="text-[#E42527]">*</span>
                      </label>
                      <input
                        value={form["offer.designation"]}
                        onChange={(e) => updateField("offer.designation", e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">Location</label>
                      <input
                        value={form["offer.location"]}
                        onChange={(e) => updateField("offer.location", e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">Joining Date</label>
                      <input
                        type="date"
                        value={form["offer.joining_date"]}
                        onChange={(e) => updateField("offer.joining_date", e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">Offer Expiry Date</label>
                      <input
                        type="date"
                        value={form["offer.expiry_date"]}
                        onChange={(e) => updateField("offer.expiry_date", e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                      />
                    </div>
                  </div>

                  {form.variant === "executive" && (
                    <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Executive-only fields</p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">Reporting To</label>
                        <input
                          value={form["offer.reporting_to"]}
                          onChange={(e) => updateField("offer.reporting_to", e.target.value)}
                          placeholder="e.g. Chief Technology Officer"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">Bonus %</label>
                        <input
                          value={form["offer.bonus_percent"]}
                          onChange={(e) => updateField("offer.bonus_percent", e.target.value)}
                          placeholder="e.g. 20"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">ESOPs (options)</label>
                        <input
                          value={form["offer.esops"]}
                          onChange={(e) => updateField("offer.esops", e.target.value)}
                          placeholder="e.g. 50,000"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">Retention Bonus (₹)</label>
                        <input
                          value={form["offer.retention_bonus"]}
                          onChange={(e) => updateField("offer.retention_bonus", e.target.value)}
                          placeholder="e.g. 5,00,000"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">Notice Period</label>
                        <input
                          value={form["offer.notice_period"]}
                          onChange={(e) => updateField("offer.notice_period", e.target.value)}
                          placeholder="e.g. Ninety (90) days"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#E42527]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* META */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Issue Date</label>
                    <input type="date" value={form.issue_date} onChange={(e) => updateField("issue_date", e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none focus:border-[#E42527] focus:bg-white" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Effective Date</label>
                    <input type="date" value={form.effective_date} onChange={(e) => updateField("effective_date", e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none focus:border-[#E42527] focus:bg-white" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Letter Expiry</label>
                    <input type="date" value={form.expiry_date} onChange={(e) => updateField("expiry_date", e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none focus:border-[#E42527] focus:bg-white" />
                  </div>
                </div>

                {/* SIGNATORY */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-600">Signatory</label>
                  <select value={form.signatory_id} onChange={(e) => updateField("signatory_id", e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none focus:border-[#E42527] focus:bg-white">
                    <option value="">Optional — no signatory</option>
                    {signatories.map((s) => (
                      <option key={s.signatory_id} value={s.signatory_id}>{s.name} — {s.designation}</option>
                    ))}
                  </select>
                </div>

                {/* OPTIONS */}
                <div className="flex flex-wrap gap-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <label className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <input type="checkbox" checked={form.publish_to_ess} onChange={(e) => updateField("publish_to_ess", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#E42527]" />
                    Publish to ESS
                  </label>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <input type="checkbox" checked={form.send_email} onChange={(e) => updateField("send_email", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#E42527]" />
                    Send Email
                  </label>
                </div>

                {/* SUBMIT */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        variant: "classic", employee_id: "", signatory_id: "",
                        issue_date: "", effective_date: "", expiry_date: "",
                        publish_to_ess: true, send_email: false,
                        "offer.designation": "", "offer.location": "",
                        "offer.joining_date": "", "offer.expiry_date": "",
                        "offer.reporting_to": "", "offer.bonus_percent": "",
                        "offer.esops": "", "offer.retention_bonus": "",
                        "offer.notice_period": "",
                      });
                      setEmpSearch(""); resetMessages();
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !form.employee_id || !form["offer.designation"]}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-6 text-[13px] font-bold text-white disabled:opacity-60"
                  >
                    {loading ? "Generating..." : <><Icons.Send className="h-4 w-4" /> Generate {selectedVariant.name}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* SAMPLE PREVIEW MODAL */}
      {previewSample && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 p-4 pt-8 backdrop-blur-sm">
          <div className="mb-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E42527] to-[#a81b1d]">
                  <Icons.Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sample Preview</p>
                  <p className="text-[14px] font-bold text-slate-900">
                    {previewSample.name} · <span className="font-mono text-slate-500">{previewSample.code}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => downloadSample(previewSample)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-4 text-[13px] font-semibold text-white shadow-sm"
                >
                  <Icons.Download className="h-4 w-4" /> Download / Print
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSample(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                >
                  <Icons.X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-y-auto bg-slate-100 p-5">
              <div className="mx-auto bg-white shadow-lg" style={{ maxWidth: 794 }}>
                <iframe title="Sample Preview" srcDoc={buildSampleHtml(previewSample)} className="h-[1050px] w-full border-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATED LETTER PREVIEW MODAL */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 p-4 pt-8 backdrop-blur-sm">
          <div className="mb-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
                  <Icons.Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Letter Preview</p>
                  <p className="text-[14px] font-bold text-slate-900">
                    {previewLetter.letter.letter_number || "Letter"} ·{" "}
                    <span className="text-slate-500">
                      {previewLetter.letter.data_snapshot?.employee_name || previewLetter.letter.employee_name || ""}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => printHtml(previewLetter.html)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#E42527] to-[#c91f21] px-4 text-[13px] font-semibold text-white shadow-sm"
                >
                  <Icons.Download className="h-4 w-4" /> Download / Print
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
                <iframe title="Letter Preview" srcDoc={previewLetter.html} className="h-[1050px] w-full border-0" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}