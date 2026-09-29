"use client";

/**
 * Reimbursement Page — Production Ready
 * ============================================================
 * Flow:
 *   EMPLOYEE → sees ONLY their own claims + YTD limits + Apply button
 *   ADMIN    → sees ALL claims + Type management + Approve/Reject/Mark Paid
 *
 * Backend endpoints (aligned):
 *   POST   /api/v1/reimbursement/types
 *   GET    /api/v1/reimbursement/types?is_active=true
 *   PUT    /api/v1/reimbursement/types/{id}
 *   DELETE /api/v1/reimbursement/types/{id}
 *
 *   POST   /api/v1/reimbursement/claims
 *   GET    /api/v1/reimbursement/claims
 *   GET    /api/v1/reimbursement/claims/summary
 *   GET    /api/v1/reimbursement/claims/{id}
 *   PUT    /api/v1/reimbursement/claims/{id}
 *   POST   /api/v1/reimbursement/claims/{id}/cancel
 *   POST   /api/v1/reimbursement/claims/{id}/decide
 *   POST   /api/v1/reimbursement/claims/{id}/mark-paid
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 10;
const AUTO_DISMISS_MS = 5000;
const MAX_BILL_MB = 5;

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
];

const BADGE_STYLES = {
  submitted: "bg-blue-50 text-blue-700 border-blue-100",
  approved:  "bg-green-50 text-green-700 border-green-100",
  rejected:  "bg-red-50 text-red-700 border-red-100",
  paid:      "bg-purple-50 text-purple-700 border-purple-100",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  draft:     "bg-orange-50 text-orange-700 border-orange-100",
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const errMsg = (e) => {
  const d = e?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((x) => x.msg || "Error").join(" • ");
  if (typeof d === "string") return d;
  return e?.message || "Something went wrong";
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return "—"; }
};

const fmtDateTime = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return "—"; }
};

const fmtMoney = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const statusLabel = (s) =>
  String(s || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const badgeCls = (s) => BADGE_STYLES[s] || BADGE_STYLES.cancelled;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════════════════════════ */

function Toast({ type, msg, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [msg, onClose]);

  if (!msg) return null;
  const cls =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700";

  return (
    <div role="alert" className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${cls}`}>
      <span className="whitespace-pre-line">{msg}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function StatCard({ label, value, sub, tone = "gray" }) {
  const tones = {
    blue:   "bg-blue-50 border-blue-200 text-blue-700",
    green:  "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    gray:   "bg-gray-50 border-gray-200 text-gray-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] opacity-70">{sub}</p>}
    </div>
  );
}

function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const w = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full ${w[size]} max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e5e7eb] bg-white px-5 py-4">
          <h2 className="text-base font-semibold text-[#1a1a1a]">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-[#9ca3af] hover:bg-gray-100">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = [];
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start + 1 < 5) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  const btn =
    "inline-flex h-8 min-w-[32px] items-center justify-center rounded-md border px-2 text-xs font-medium transition";

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5e7eb] px-5 py-3.5 sm:flex-row">
      <p className="text-xs text-[#6b7280]">
        Showing <b className="text-[#1a1a1a]">{from}</b>–<b className="text-[#1a1a1a]">{to}</b>{" "}
        of <b className="text-[#1a1a1a]">{total}</b>
      </p>
      <div className="flex items-center gap-1">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)}
          className={`${btn} border-[#d1d5db] text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-40`}>
          Prev
        </button>
        {pages.map((p) => (
          <button key={p} onClick={() => onChange(p)}
            className={`${btn} ${p === page ? "border-[#E42527] bg-[#E42527] text-white" : "border-[#d1d5db] text-[#4b5563] hover:bg-[#f9fafb]"}`}>
            {p}
          </button>
        ))}
        <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}
          className={`${btn} border-[#d1d5db] text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-40`}>
          Next
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, value, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <div className="mt-0.5 text-sm text-[#1a1a1a]">{value}</div>
    </div>
  );
}

function LevelProgress({ current, total }) {
  if (!total || total <= 1) return null;
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-blue-700">
        Approval — Level {current} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        {steps.map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${
            s < current ? "bg-green-500" : s === current ? "bg-blue-500" : "bg-blue-200"
          }`} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function ReimbursementPage() {
  const user = useAuthStore((s) => s.user);
  const role = String(user?.role?.value || user?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "approle.admin";

  /* ── Data state ── */
  const [claims, setClaims] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [types, setTypes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [summaryEmpId, setSummaryEmpId] = useState(""); // admin only

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [acting, setActing] = useState(false);

  /* ── Modals ── */
  const [claimModal, setClaimModal] = useState(false);
  const [editClaimId, setEditClaimId] = useState(null);
  const [typeModal, setTypeModal] = useState(false);
  const [editTypeId, setEditTypeId] = useState(null);
  const [decisionModal, setDecisionModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [paidModal, setPaidModal] = useState(false);

  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [decisionAction, setDecisionAction] = useState("approved");

  /* ── Claim form ── */
  const [form, setForm] = useState({
    employee_id: "", // admin on-behalf only
    type_id: "",
    claim_amount: "",
    bill_date: new Date().toISOString().split("T")[0],
    bill_number: "",
    bill_document_url: "",
  });
  const [billName, setBillName] = useState("");
  const fileRef = useRef(null);

  /* ── Type form ── */
  const [typeForm, setTypeForm] = useState({
    type_name: "",
    monthly_limit: "",
    annual_limit: "",
    requires_proof: true,
    is_taxable: false,
  });

  /* ── Decision form ── */
  const [decision, setDecision] = useState({
    status: "approved",
    approved_amount: "",
    decision_reason: "",
  });

  const [cancelReason, setCancelReason] = useState("");
  const [paidRemarks, setPaidRemarks] = useState("");

  const didInit = useRef(false);

  /* ═══════════════════════════════════════════════════
     FETCH SETUP (types + summary)
  ═══════════════════════════════════════════════════ */
  const loadSetup = useCallback(async () => {
    try {
      const t = await api.get("/api/v1/reimbursement/types", {
        params: { is_active: true },
      });
      setTypes(t?.data?.data || []);
    } catch (e) {
      console.error("Types load failed", e);
    }

    // Summary (YTD limits)
    try {
      if (isAdmin && !summaryEmpId) {
        setSummary(null);
        return;
      }
      const params = {};
      if (isAdmin && summaryEmpId) params.employee_id = summaryEmpId;
      const s = await api.get("/api/v1/reimbursement/claims/summary", { params });
      setSummary(s?.data || null);
    } catch {
      setSummary(null);
    }
  }, [isAdmin, summaryEmpId]);

  /* ═══════════════════════════════════════════════════
     FETCH CLAIMS
  ═══════════════════════════════════════════════════ */
  const loadClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (statusFilter !== "all") params.status = statusFilter;
      if (typeFilter !== "all") params.type_id = typeFilter;

      const r = await api.get("/api/v1/reimbursement/claims", { params });
      setClaims(r?.data?.data || []);
      setTotal(r?.data?.total || 0);
    } catch (e) {
      setError(errMsg(e));
      setClaims([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      loadSetup();
      loadClaims();
      return;
    }
    const t = setTimeout(loadClaims, 250);
    return () => clearTimeout(t);
  }, [loadSetup, loadClaims]);

  /* ═══════════════════════════════════════════════════
     STATS
  ═══════════════════════════════════════════════════ */
  const stats = useMemo(() => {
    const pending = claims.filter((c) => c.status === "submitted").length;
    const approved = claims.filter((c) => c.status === "approved").length;
    const paid = claims.filter((c) => c.status === "paid").length;
    const claimed = claims.reduce((s, c) => s + Number(c.claim_amount || 0), 0);
    const approvedAmt = claims.reduce((s, c) => s + Number(c.approved_amount || 0), 0);
    return { pending, approved, paid, claimed, approvedAmt };
  }, [claims]);

  const selectedType = useMemo(
    () => types.find((t) => t.type_id === form.type_id),
    [types, form.type_id]
  );
  const proofRequired = !!selectedType?.requires_proof;

  /* ═══════════════════════════════════════════════════
     FILE HANDLING
  ═══════════════════════════════════════════════════ */
  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_BILL_MB * 1024 * 1024) {
      setError(`File too large (max ${MAX_BILL_MB} MB)`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const ok = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!ok.includes(f.type)) {
      setError("Only JPG, PNG or PDF allowed");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const b64 = await fileToBase64(f);
    setBillName(f.name);
    setForm((p) => ({ ...p, bill_document_url: b64 }));
  };

  const removeBill = () => {
    setBillName("");
    setForm((p) => ({ ...p, bill_document_url: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetClaimForm = () => {
    setForm({
      employee_id: "",
      type_id: "",
      claim_amount: "",
      bill_date: new Date().toISOString().split("T")[0],
      bill_number: "",
      bill_document_url: "",
    });
    setBillName("");
    setEditClaimId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ═══════════════════════════════════════════════════
     SUBMIT CLAIM (create / edit)
  ═══════════════════════════════════════════════════ */
  const submitClaim = async () => {
    if (isAdmin && !editClaimId && !form.employee_id.trim()) {
      return setError("Employee ID is required");
    }
    if (!form.type_id) return setError("Please select expense type");
    if (!form.claim_amount || Number(form.claim_amount) <= 0) {
      return setError("Enter a valid amount");
    }
    if (proofRequired && !editClaimId && !form.bill_document_url) {
      return setError(`Bill / proof is required for '${selectedType?.type_name}'`);
    }

    setActing(true);
    setError("");
    try {
      const payload = {
        type_id: form.type_id,
        claim_amount: Number(form.claim_amount),
        bill_date: form.bill_date,
        bill_number: form.bill_number || null,
      };
      if (form.bill_document_url) {
        payload.bill_document_url = form.bill_document_url;
      }

      if (editClaimId) {
        await api.put(`/api/v1/reimbursement/claims/${editClaimId}`, payload);
        setSuccess("Claim updated");
      } else {
        if (isAdmin) payload.employee_id = form.employee_id.trim();
        const r = await api.post("/api/v1/reimbursement/claims", payload);
        setSuccess(r?.data?.message || "Claim submitted");
      }

      setClaimModal(false);
      resetClaimForm();
      loadClaims();
      loadSetup();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  const openEditClaim = (c) => {
    setEditClaimId(c.claim_id);
    setForm({
      employee_id: c.employee_id || "",
      type_id: c.type_id || "",
      claim_amount: String(c.claim_amount || ""),
      bill_date: c.bill_date || new Date().toISOString().split("T")[0],
      bill_number: c.bill_number || "",
      bill_document_url: "",
    });
    setBillName(c.bill_document_url ? "Existing bill attached" : "");
    setClaimModal(true);
  };

  /* ═══════════════════════════════════════════════════
     TYPE CRUD (admin only)
  ═══════════════════════════════════════════════════ */
  const resetTypeForm = () => {
    setTypeForm({
      type_name: "",
      monthly_limit: "",
      annual_limit: "",
      requires_proof: true,
      is_taxable: false,
    });
    setEditTypeId(null);
  };

  const submitType = async () => {
    if (!typeForm.type_name.trim()) return setError("Type name required");
    setActing(true);
    setError("");
    try {
      const payload = {
        type_name: typeForm.type_name.trim(),
        monthly_limit: typeForm.monthly_limit ? Number(typeForm.monthly_limit) : null,
        annual_limit: typeForm.annual_limit ? Number(typeForm.annual_limit) : null,
        requires_proof: typeForm.requires_proof,
        is_taxable: typeForm.is_taxable,
      };
      if (editTypeId) {
        await api.put(`/api/v1/reimbursement/types/${editTypeId}`, payload);
        setSuccess("Type updated");
      } else {
        await api.post("/api/v1/reimbursement/types", payload);
        setSuccess("Type created");
      }
      setTypeModal(false);
      resetTypeForm();
      loadSetup();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  const openEditType = (t) => {
    setEditTypeId(t.type_id);
    setTypeForm({
      type_name: t.type_name || "",
      monthly_limit: t.monthly_limit != null ? String(t.monthly_limit) : "",
      annual_limit: t.annual_limit != null ? String(t.annual_limit) : "",
      requires_proof: !!t.requires_proof,
      is_taxable: !!t.is_taxable,
    });
    setTypeModal(true);
  };

  const deactivateType = async (t) => {
    if (!confirm(`Deactivate '${t.type_name}'?`)) return;
    setActing(true);
    setError("");
    try {
      await api.delete(`/api/v1/reimbursement/types/${t.type_id}`);
      setSuccess(`'${t.type_name}' deactivated`);
      loadSetup();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     DECISION (approve/reject)
  ═══════════════════════════════════════════════════ */
  const openDecision = (c, action) => {
    setSelected(c);
    setDecisionAction(action);
    setDecision({
      status: action,
      approved_amount: action === "approved" ? String(c.claim_amount || "") : "",
      decision_reason: "",
    });
    setDecisionModal(true);
  };

  const submitDecision = async () => {
    if (!selected) return;
    if (decision.status === "rejected" && !decision.decision_reason.trim()) {
      return setError("Rejection reason required");
    }
    setActing(true);
    setError("");
    try {
      const payload = {
        status: decision.status,
        decision_reason: decision.decision_reason || null,
      };
      if (decision.status === "approved" && decision.approved_amount) {
        payload.approved_amount = Number(decision.approved_amount);
      }
      const r = await api.post(
        `/api/v1/reimbursement/claims/${selected.claim_id}/decide`,
        payload
      );
      setSuccess(r?.data?.message || `Claim ${decision.status}`);
      setDecisionModal(false);
      setSelected(null);
      loadClaims();
      loadSetup();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     CANCEL
  ═══════════════════════════════════════════════════ */
  const openCancel = (c) => {
    setSelected(c);
    setCancelReason("");
    setCancelModal(true);
  };

  const submitCancel = async () => {
    if (!selected) return;
    setActing(true);
    setError("");
    try {
      await api.post(
        `/api/v1/reimbursement/claims/${selected.claim_id}/cancel`,
        { reason: cancelReason || "Cancelled by user" }
      );
      setSuccess("Claim cancelled");
      setCancelModal(false);
      setSelected(null);
      loadClaims();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     MARK PAID
  ═══════════════════════════════════════════════════ */
  const openPaid = (c) => {
    setSelected(c);
    setPaidRemarks("");
    setPaidModal(true);
  };

  const submitPaid = async () => {
    if (!selected) return;
    setActing(true);
    setError("");
    try {
      await api.post(
        `/api/v1/reimbursement/claims/${selected.claim_id}/mark-paid`,
        { remarks: paidRemarks || null }
      );
      setSuccess("Marked as paid");
      setPaidModal(false);
      setSelected(null);
      loadClaims();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     VIEW DETAIL (fresh fetch)
  ═══════════════════════════════════════════════════ */
  const openView = async (c) => {
    setSelected(c);
    setDetail(null);
    setViewModal(true);
    setDetailLoading(true);
    try {
      const r = await api.get(`/api/v1/reimbursement/claims/${c.claim_id}`);
      setDetail(r?.data?.data || c);
    } catch {
      setDetail(c);
    } finally {
      setDetailLoading(false);
    }
  };

  const d = detail || selected;

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      <div className="mx-auto max-w-7xl">

        {/* ═══ HEADER ═══ */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Reimbursements</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              {isAdmin
                ? "Manage team claims, approvals, and expense types"
                : "Submit bills and track your expense claims"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* ADMIN ONLY: Add Type */}
            {isAdmin && (
              <button
                onClick={() => { resetTypeForm(); setTypeModal(true); }}
                className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]"
              >
                + Add Type
              </button>
            )}

            {/* BOTH: New Claim */}
            {types.length > 0 && (
              <button
                onClick={() => { resetClaimForm(); setClaimModal(true); }}
                className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
              >
                + New Claim
              </button>
            )}
          </div>
        </div>

        {/* ═══ TOASTS ═══ */}
        <Toast type="error" msg={error} onClose={() => setError("")} />
        <Toast type="success" msg={success} onClose={() => setSuccess("")} />

        {/* ═══ STATS ═══ */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Pending" value={stats.pending} tone="blue" sub="Awaiting approval" />
          <StatCard label="Approved" value={stats.approved} tone="green" sub="Ready for payroll" />
          <StatCard label="Paid" value={stats.paid} tone="purple" />
          <StatCard label="Claimed" value={fmtMoney(stats.claimed)} tone="orange" sub="This page" />
          <StatCard label="Approved ₹" value={fmtMoney(stats.approvedAmt)} tone="green" sub="This page" />
        </div>

        {/* ═══ ADMIN ONLY: Employee selector for summary ═══ */}
        {isAdmin && (
          <div className="mb-5 rounded-xl border border-[#e5e7eb] bg-white p-4">
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              View Employee Limits (Employee ID)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={summaryEmpId}
                onChange={(e) => setSummaryEmpId(e.target.value.trim())}
                placeholder="e.g. EMP001"
                className="h-10 flex-1 min-w-[200px] rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none"
              />
              <button
                onClick={loadSetup}
                className="rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]"
              >
                Load
              </button>
            </div>
          </div>
        )}

        {/* ═══ YTD LIMITS STRIP ═══ */}
        {summary?.types?.length > 0 && (
          <div className="mb-5 rounded-xl border border-[#e5e7eb] bg-white p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              {isAdmin
                ? `${summary.employee_name || summary.employee_id} — FY ${summary.financial_year}`
                : `Your Limits — FY ${summary.financial_year}`}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {summary.types.map((t) => (
                <div key={t.type_id} className="rounded-lg border border-[#f3f4f6] bg-[#fafafa] p-3">
                  <p className="text-xs font-medium text-[#1a1a1a]">{t.type_name}</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6b7280]">Monthly</span>
                      <span className="font-medium text-[#1a1a1a]">
                        {fmtMoney(t.monthly_used)}
                        {t.monthly_limit != null && ` / ${fmtMoney(t.monthly_limit)}`}
                      </span>
                    </div>
                    {t.monthly_limit != null && t.monthly_limit > 0 && (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-[#E42527] transition-all"
                          style={{ width: `${Math.min((t.monthly_used / t.monthly_limit) * 100, 100)}%` }} />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6b7280]">Annual</span>
                      <span className="font-medium text-[#1a1a1a]">
                        {fmtMoney(t.annual_used)}
                        {t.annual_limit != null && ` / ${fmtMoney(t.annual_limit)}`}
                      </span>
                    </div>
                    {t.annual_limit != null && t.annual_limit > 0 && (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width: `${Math.min((t.annual_used / t.annual_limit) * 100, 100)}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ FILTERS ═══ */}
        <div className="mb-4 rounded-xl border border-[#e5e7eb] bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((opt) => (
                  <button key={opt.value}
                    onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      statusFilter === opt.value
                        ? "border-[#E42527] bg-[#E42527] text-white"
                        : "border-[#d1d5db] bg-white text-[#4b5563] hover:bg-gray-50"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-56">
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Expense Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="h-10 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-sm focus:border-[#E42527] focus:outline-none">
                <option value="all">All types</option>
                {types.map((t) => (
                  <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ═══ CLAIMS TABLE ═══ */}
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-3.5">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                {isAdmin ? "All Claims" : "My Claims"}
              </h2>
              <p className="mt-0.5 text-xs text-[#6b7280]">
                {total} record{total !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => { loadClaims(); loadSetup(); }}
              disabled={loading}
              className="rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-xs font-medium text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-60">
              ↻ Refresh
            </button>
          </div>

          {loading && claims.length === 0 ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-2xl">🧾</div>
              <p className="mt-3 text-sm font-medium text-[#1a1a1a]">No claims found</p>
              <p className="mt-1 text-xs text-[#6b7280]">
                {isAdmin ? "No claims match your filters" : "Click \"New Claim\" to submit your first expense"}
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Bill Date</th>
                      {/* ADMIN ONLY: Employee column */}
                      {isAdmin && <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>}
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Type</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Claimed</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Approved</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
                      <th className="px-5 py-3 font-medium text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    {claims.map((c) => (
                      <tr key={c.claim_id} className="transition-colors hover:bg-[#fafafa]">
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <div className="font-medium text-[#1a1a1a]">{fmtDate(c.bill_date)}</div>
                          {c.bill_number && (
                            <div className="text-[11px] text-[#9ca3af]">#{c.bill_number}</div>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-[#1a1a1a]">
                              {c.employee_name || c.employee_id}
                            </div>
                            <div className="text-[11px] text-[#9ca3af]">{c.employee_code}</div>
                          </td>
                        )}
                        <td className="px-5 py-3.5">
                          <span className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#4b5563]">
                            {c.type_name}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 font-medium text-[#1a1a1a]">
                          {fmtMoney(c.claim_amount)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          {c.approved_amount != null
                            ? <span className="font-medium text-green-700">{fmtMoney(c.approved_amount)}</span>
                            : <span className="text-xs text-[#d1d5db]">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badgeCls(c.status)}`}>
                            {statusLabel(c.status)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openView(c)}
                              className="rounded-md px-2 py-1 text-xs font-medium text-[#4b5563] hover:bg-gray-100">
                              View
                            </button>
                            {c.bill_document_url && (
                              <a href={c.bill_document_url} target="_blank" rel="noopener noreferrer"
                                className="rounded-md px-2 py-1 text-xs font-medium text-[#E42527] hover:bg-red-50">
                                Bill
                              </a>
                            )}
                            {/* EMPLOYEE: edit draft/rejected */}
                            {!isAdmin && ["draft", "rejected"].includes(c.status) && (
                              <button onClick={() => openEditClaim(c)}
                                className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">
                                Edit
                              </button>
                            )}
                            {/* Cancel (not paid/cancelled) */}
                            {!["paid", "cancelled"].includes(c.status) && (
                              <button onClick={() => openCancel(c)}
                                className="rounded-md px-2 py-1 text-xs font-medium text-[#E42527] hover:bg-red-50">
                                Cancel
                              </button>
                            )}
                            {/* ADMIN: decision */}
                            {isAdmin && c.status === "submitted" && (
                              <>
                                <button onClick={() => openDecision(c, "approved")}
                                  className="rounded-md px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50">
                                  Approve
                                </button>
                                <button onClick={() => openDecision(c, "rejected")}
                                  className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50">
                                  Reject
                                </button>
                              </>
                            )}
                            {/* ADMIN: mark paid */}
                            {isAdmin && c.status === "approved" && (
                              <button onClick={() => openPaid(c)}
                                className="rounded-md px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50">
                                Mark Paid
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="space-y-3 p-4 md:hidden">
                {claims.map((c) => (
                  <div key={c.claim_id} className="rounded-lg border border-[#e5e7eb] bg-white p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-[#1a1a1a]">{fmtMoney(c.claim_amount)}</div>
                        <div className="text-[11px] text-[#6b7280]">{c.type_name} • {fmtDate(c.bill_date)}</div>
                        {isAdmin && (
                          <div className="mt-0.5 text-[11px] text-[#9ca3af]">
                            {c.employee_name || c.employee_id}
                          </div>
                        )}
                      </div>
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badgeCls(c.status)}`}>
                        {statusLabel(c.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => openView(c)}
                        className="rounded-md border border-[#d1d5db] px-2.5 py-1 text-xs font-medium text-[#4b5563]">
                        View
                      </button>
                      {c.bill_document_url && (
                        <a href={c.bill_document_url} target="_blank" rel="noopener noreferrer"
                          className="rounded-md border border-[#d1d5db] px-2.5 py-1 text-xs font-medium text-[#E42527]">
                          Bill
                        </a>
                      )}
                      {!isAdmin && ["draft", "rejected"].includes(c.status) && (
                        <button onClick={() => openEditClaim(c)}
                          className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          Edit
                        </button>
                      )}
                      {!["paid", "cancelled"].includes(c.status) && (
                        <button onClick={() => openCancel(c)}
                          className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-[#E42527]">
                          Cancel
                        </button>
                      )}
                      {isAdmin && c.status === "submitted" && (
                        <>
                          <button onClick={() => openDecision(c, "approved")}
                            className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            Approve
                          </button>
                          <button onClick={() => openDecision(c, "rejected")}
                            className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            Reject
                          </button>
                        </>
                      )}
                      {isAdmin && c.status === "approved" && (
                        <button onClick={() => openPaid(c)}
                          className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && total > 0 && (
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} />
          )}
        </div>

        {/* ═══ ADMIN ONLY: TYPES MANAGEMENT ═══ */}
        {isAdmin && types.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#e5e7eb] bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-[#1a1a1a]">Expense Types</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="px-3 py-2 font-medium text-[#6b7280]">Name</th>
                    <th className="px-3 py-2 font-medium text-[#6b7280]">Monthly</th>
                    <th className="px-3 py-2 font-medium text-[#6b7280]">Annual</th>
                    <th className="px-3 py-2 font-medium text-[#6b7280]">Proof</th>
                    <th className="px-3 py-2 font-medium text-[#6b7280]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {types.map((t) => (
                    <tr key={t.type_id} className="hover:bg-[#fafafa]">
                      <td className="px-3 py-2.5 font-medium text-[#1a1a1a]">{t.type_name}</td>
                      <td className="px-3 py-2.5 text-[#4b5563]">
                        {t.monthly_limit != null ? fmtMoney(t.monthly_limit) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[#4b5563]">
                        {t.annual_limit != null ? fmtMoney(t.annual_limit) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[#4b5563]">
                        {t.requires_proof ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => openEditType(t)}
                            className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">
                            Edit
                          </button>
                          <button onClick={() => deactivateType(t)}
                            className="rounded-md px-2 py-1 text-xs font-medium text-[#E42527] hover:bg-red-50">
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
         MODAL: NEW / EDIT CLAIM
      ═══════════════════════════════════════════════════════ */}
      <Modal
        open={claimModal}
        onClose={() => { setClaimModal(false); resetClaimForm(); }}
        title={editClaimId ? "Edit Claim" : "New Expense Claim"}
        size="md">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* ADMIN on-behalf employee_id */}
          {isAdmin && !editClaimId && (
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
                Employee ID <span className="text-[#E42527]">*</span>
                <span className="ml-1 text-[11px] font-normal text-[#9ca3af]">(on-behalf)</span>
              </label>
              <input type="text" value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                placeholder="e.g. EMP001"
                className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              Expense Type <span className="text-[#E42527]">*</span>
            </label>
            <select value={form.type_id}
              onChange={(e) => setForm({ ...form, type_id: e.target.value })}
              className="h-10 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-sm focus:border-[#E42527] focus:outline-none">
              <option value="">Select expense type...</option>
              {types.map((t) => (
                <option key={t.type_id} value={t.type_id}>
                  {t.type_name}{t.monthly_limit ? ` (₹${t.monthly_limit}/month)` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              Amount (₹) <span className="text-[#E42527]">*</span>
            </label>
            <input type="number" min="0" step="0.01" value={form.claim_amount}
              onChange={(e) => setForm({ ...form, claim_amount: e.target.value })}
              placeholder="0.00"
              className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Bill Date</label>
            <input type="date" value={form.bill_date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm({ ...form, bill_date: e.target.value })}
              className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Bill / Invoice Number</label>
            <input type="text" value={form.bill_number}
              onChange={(e) => setForm({ ...form, bill_number: e.target.value })}
              placeholder="e.g. INV-2026-0042"
              className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              Bill / Receipt
              {proofRequired && <span className="ml-1 text-[#E42527]">*</span>}
              <span className="ml-1 text-[11px] font-normal text-[#9ca3af]">(JPG, PNG, PDF • Max 5 MB)</span>
            </label>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,application/pdf"
              onChange={handleFile}
              className="w-full cursor-pointer rounded-lg border border-[#d1d5db] px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#f3f4f6] file:px-3 file:py-1 file:text-xs file:font-medium" />
            {billName && (
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="text-green-600">✓ {billName}</span>
                <button type="button" onClick={removeBill} className="text-[#E42527] hover:underline">
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
          <button onClick={() => { setClaimModal(false); resetClaimForm(); }}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]">
            Cancel
          </button>
          <button onClick={submitClaim} disabled={acting}
            className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
            {acting ? "Saving..." : editClaimId ? "Update Claim" : "Submit Claim"}
          </button>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
         MODAL: TYPE (create/edit)
      ═══════════════════════════════════════════════════════ */}
      <Modal open={typeModal}
        onClose={() => { setTypeModal(false); resetTypeForm(); }}
        title={editTypeId ? "Edit Type" : "Add Reimbursement Type"}
        size="sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              Type Name <span className="text-[#E42527]">*</span>
            </label>
            <input type="text" value={typeForm.type_name}
              onChange={(e) => setTypeForm({ ...typeForm, type_name: e.target.value })}
              placeholder="e.g. Travel, Food, Internet"
              className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Monthly Limit (₹)</label>
              <input type="number" value={typeForm.monthly_limit}
                onChange={(e) => setTypeForm({ ...typeForm, monthly_limit: e.target.value })}
                placeholder="Optional"
                className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Annual Limit (₹)</label>
              <input type="number" value={typeForm.annual_limit}
                onChange={(e) => setTypeForm({ ...typeForm, annual_limit: e.target.value })}
                placeholder="Optional"
                className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#4b5563]">
              <input type="checkbox" checked={typeForm.requires_proof}
                onChange={(e) => setTypeForm({ ...typeForm, requires_proof: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#E42527]" />
              Bill proof required
            </label>
            <label className="flex items-center gap-2 text-sm text-[#4b5563]">
              <input type="checkbox" checked={typeForm.is_taxable}
                onChange={(e) => setTypeForm({ ...typeForm, is_taxable: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#E42527]" />
              Taxable
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
          <button onClick={() => { setTypeModal(false); resetTypeForm(); }}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]">
            Cancel
          </button>
          <button onClick={submitType} disabled={acting}
            className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
            {acting ? "Saving..." : editTypeId ? "Update" : "Create"}
          </button>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
         MODAL: DECISION
      ═══════════════════════════════════════════════════════ */}
      <Modal open={decisionModal}
        onClose={() => { setDecisionModal(false); setSelected(null); }}
        title={decisionAction === "approved" ? "Approve Claim" : "Reject Claim"}
        size="sm">
        {selected && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Employee</span>
                <span className="font-medium text-[#1a1a1a]">
                  {selected.employee_name || selected.employee_id}
                </span>
              </div>
              <div className="mt-1.5 flex justify-between text-sm">
                <span className="text-[#6b7280]">Type</span>
                <span className="font-medium">{selected.type_name}</span>
              </div>
              <div className="mt-1.5 flex justify-between text-sm">
                <span className="text-[#6b7280]">Claimed</span>
                <span className="font-medium">{fmtMoney(selected.claim_amount)}</span>
              </div>
              <div className="mt-1.5 flex justify-between text-sm">
                <span className="text-[#6b7280]">Bill Date</span>
                <span>{fmtDate(selected.bill_date)}</span>
              </div>
              {selected.bill_document_url && (
                <a href={selected.bill_document_url} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-[#E42527] hover:underline">
                  View Bill →
                </a>
              )}
            </div>

            {decision.status === "approved" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
                  Approved Amount (₹)
                  <span className="ml-1 text-[11px] text-[#9ca3af]">(≤ claimed)</span>
                </label>
                <input type="number" min="0" step="0.01"
                  max={selected.claim_amount}
                  value={decision.approved_amount}
                  onChange={(e) => setDecision({ ...decision, approved_amount: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#d1d5db] px-3 text-sm focus:border-[#E42527] focus:outline-none" />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
                {decision.status === "rejected"
                  ? <>Rejection Reason <span className="text-[#E42527]">*</span></>
                  : "Comments (optional)"}
              </label>
              <textarea rows="2" value={decision.decision_reason}
                onChange={(e) => setDecision({ ...decision, decision_reason: e.target.value })}
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none" />
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
          <button onClick={() => { setDecisionModal(false); setSelected(null); }}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]">
            Cancel
          </button>
          <button onClick={submitDecision} disabled={acting}
            className={`rounded-lg px-5 py-2 text-sm font-medium text-white disabled:opacity-60 ${
              decision.status === "approved"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#E42527] hover:bg-[#c91f21]"
            }`}>
            {acting ? "Processing..." : decision.status === "approved" ? "Approve" : "Reject"}
          </button>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
         MODAL: CANCEL
      ═══════════════════════════════════════════════════════ */}
      <Modal open={cancelModal}
        onClose={() => { setCancelModal(false); setSelected(null); }}
        title="Cancel Claim"
        size="sm">
        {selected && (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              Cancel claim of <strong>{fmtMoney(selected.claim_amount)}</strong>?
              This cannot be undone.
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Reason (optional)</label>
              <textarea rows="2" value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none" />
            </div>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
          <button onClick={() => { setCancelModal(false); setSelected(null); }}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]">
            Keep Claim
          </button>
          <button onClick={submitCancel} disabled={acting}
            className="rounded-lg bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
            {acting ? "Cancelling..." : "Cancel Claim"}
          </button>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
         MODAL: MARK PAID
      ═══════════════════════════════════════════════════════ */}
      <Modal open={paidModal}
        onClose={() => { setPaidModal(false); setSelected(null); }}
        title="Mark Claim as Paid"
        size="sm">
        {selected && (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">
              Mark <strong>{fmtMoney(selected.approved_amount || selected.claim_amount)}</strong> as PAID for{" "}
              {selected.employee_name || selected.employee_id}?
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">Remarks (optional)</label>
              <textarea rows="2" value={paidRemarks}
                onChange={(e) => setPaidRemarks(e.target.value)}
                placeholder="e.g. Paid via Jan 2026 salary"
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none" />
            </div>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2 border-t border-[#e5e7eb] pt-4">
          <button onClick={() => { setPaidModal(false); setSelected(null); }}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]">
            Cancel
          </button>
          <button onClick={submitPaid} disabled={acting}
            className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60">
            {acting ? "Marking..." : "Mark Paid"}
          </button>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
         MODAL: VIEW DETAIL
      ═══════════════════════════════════════════════════════ */}
      <Modal open={viewModal}
        onClose={() => { setViewModal(false); setSelected(null); setDetail(null); }}
        title="Claim Details"
        size="md">
        {detailLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        )}

        {!detailLoading && d && (
          <div className="space-y-4">
            {d.current_level != null && d.total_levels != null && (
              <LevelProgress current={d.current_level} total={d.total_levels} />
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Claim ID" value={<span className="font-mono text-xs">{d.claim_id}</span>} />
              <DetailItem label="Employee" value={d.employee_name || d.employee_id} />
              <DetailItem label="Type" value={d.type_name} />
              <DetailItem label="Status" value={
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badgeCls(d.status)}`}>
                  {statusLabel(d.status)}
                </span>
              } />
              <DetailItem label="Claimed" value={fmtMoney(d.claim_amount)} />
              <DetailItem label="Approved" value={
                d.approved_amount != null
                  ? <span className="font-medium text-green-700">{fmtMoney(d.approved_amount)}</span>
                  : "—"
              } />
              <DetailItem label="Bill Date" value={fmtDate(d.bill_date)} />
              <DetailItem label="Bill Number" value={d.bill_number || "—"} />
              {d.paid_in_payroll_id && <DetailItem label="Paid in Payroll" value={d.paid_in_payroll_id} />}
              {d.rejection_reason && <DetailItem label="Reason / Notes" value={d.rejection_reason} full />}
            </div>

            {d.bill_document_url && (
              <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-3">
                <p className="mb-2 text-xs font-medium text-[#6b7280]">Attached Bill</p>
                <a href={d.bill_document_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#E42527] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c91f21]">
                  View Bill →
                </a>
              </div>
            )}

            <div className="grid gap-3 border-t border-[#e5e7eb] pt-3 sm:grid-cols-2">
              <DetailItem label="Created" value={fmtDateTime(d.created_at)} />
              <DetailItem label="Updated" value={fmtDateTime(d.updated_at)} />
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end border-t border-[#e5e7eb] pt-4">
          <button onClick={() => { setViewModal(false); setSelected(null); setDetail(null); }}
            className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}