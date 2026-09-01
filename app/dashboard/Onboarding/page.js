
"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/app/lib/api";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  Official_Email: "",
  Official_Mobile: "",
  aadhaar_number: "",
  pan_number: "",
  photo: "",
  joining_date: "",
  tentative_joining_date: "",
  permanent_address: {
    address_line: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  },
  current_address: {
    address_line: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  },
  experience: "",
  source_of_hire: "",
  title: "",
  Skill_set: "",
  highest_qualification: "",
  additional_info: "",
  current_salary: "",
  department: "",
  education_details: "",
  experience_details: "",
  uploaded_documents: [],
};

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg;
      })
      .join(" • ");
  }
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return err?.message || "Something went wrong";
};

const toArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.employees)) return payload.employees;
  if (Array.isArray(payload?.departments)) return payload.departments;
  if (Array.isArray(payload?.designations)) return payload.designations;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const formatDate = (date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

const formatAddr = (addr) => {
  if (!addr) return "—";
  if (typeof addr === "string") return addr;
  const parts = [
    addr.address_line,
    addr.city,
    addr.state,
    addr.country,
    addr.pincode,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
};

const getDetails = (val) => {
  if (!val) return "—";
  if (typeof val === "string") return val;
  if (val.details) return val.details;
  try {
    return JSON.stringify(val);
  } catch {
    return "—";
  }
};

export default function CandidatesPage() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("basic");

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  const loadMasters = useCallback(async () => {
    setLoadingMasters(true);
    try {
      const [deptRes, desigRes] = await Promise.all([
        api.get("/api/v1/get/departments"),
        api.get("/api/v1/get/designations"),
      ]);
      setDepartments(toArray(deptRes?.data));
      setDesignations(toArray(desigRes?.data));
    } catch (err) {
      console.error("Failed to load masters", err);
      setDepartments([]);
      setDesignations([]);
    } finally {
      setLoadingMasters(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/v1/onboarding/employees", {
        params: { page, page_size: pageSize, search },
      });
      const data = res?.data;
      const items = toArray(data);
      setList(items);
      setTotal(data?.total || data?.total_count || items.length);
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (showForm) {
      loadMasters();
    }
  }, [showForm, loadMasters]);

  // Table ke liye masters bhi load karo (names dikhane ke liye)
  useEffect(() => {
    loadMasters();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const openAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setActiveTab("basic");
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.on_boarding_id || item.id || item._id);

    let eduText = "";
    if (typeof item.education_details === "string") {
      eduText = item.education_details;
    } else if (item.education_details?.details) {
      eduText = item.education_details.details;
    }

    let expText = "";
    if (typeof item.experience_details === "string") {
      expText = item.experience_details;
    } else if (item.experience_details?.details) {
      expText = item.experience_details.details;
    }

    setFormData({
      ...initialForm,
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      email: item.email || "",
      mobile: item.mobile || "",
      Official_Email: item.Official_Email || "",
      Official_Mobile: item.Official_Mobile || "",
      aadhaar_number: item.aadhaar_number || "",
      pan_number: item.pan_number || "",
      photo: item.photo || "",
      joining_date: item.joining_date ? String(item.joining_date).slice(0, 10) : "",
      tentative_joining_date: item.tentative_joining_date
        ? String(item.tentative_joining_date).slice(0, 10)
        : "",
      permanent_address: item.permanent_address || initialForm.permanent_address,
      current_address: item.current_address || initialForm.current_address,
      experience: item.experience ?? "",
      source_of_hire: item.source_of_hire || "",
      title: item.title || "",
      department: item.department || "",
      Skill_set: Array.isArray(item.Skill_set)
        ? item.Skill_set.join(", ")
        : item.Skill_set || "",
      highest_qualification: item.highest_qualification || "",
      additional_info: item.additional_info || "",
      current_salary: item.current_salary ?? "",
      education_details: eduText,
      experience_details: expText,
      uploaded_documents: item.uploaded_documents || [],
    });

    setActiveTab("basic");
    setError("");
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setError("");
    setFormData(initialForm);
    setEditId(null);
    setActiveTab("basic");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile: formData.mobile,
        Official_Email: formData.Official_Email,
        Official_Mobile: formData.Official_Mobile,
        aadhaar_number: formData.aadhaar_number || null,
        pan_number: formData.pan_number || null,
        photo: formData.photo || null,
        joining_date: formData.joining_date || null,
        tentative_joining_date: formData.tentative_joining_date || null,
        permanent_address: formData.permanent_address || {},
        current_address: formData.current_address || {},
        experience: formData.experience ? Number(formData.experience) : null,
        source_of_hire: formData.source_of_hire || null,
        title: formData.title || null,
        department: formData.department || null,
        Skill_set: formData.Skill_set
          ? formData.Skill_set.split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        highest_qualification: formData.highest_qualification || null,
        additional_info: formData.additional_info || null,
        current_salary: formData.current_salary
          ? Number(formData.current_salary)
          : null,
        uploaded_documents: formData.uploaded_documents || [],
        education_details: formData.education_details
          ? { details: formData.education_details }
          : null,
        experience_details: formData.experience_details
          ? { details: formData.experience_details }
          : null,
      };

      if (editId) {
        await api.put(`/api/v1/onboarding/employees/${editId}`, payload);
      } else {
        await api.post("/api/v1/onboarding/employees", payload);
      }

      closeModal();
      await fetchData();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "job", label: "Job Details" },
    { id: "address", label: "Address" },
    { id: "skills", label: "Skills & Edu" },
    { id: "other", label: "Other" },
  ];

  const getDeptName = (id) => {
    if (!id) return "—";
    const d = departments.find((x) => x.department_id === id || x.id === id);
    return d?.department_name || d?.name || id;
  };

  const getDesigName = (id) => {
    if (!id) return "—";
    const d = designations.find((x) => x.designation_id === id || x.id === id);
    return d?.job_title || d?.designation_name || d?.name || id;
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Candidates</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage pre-joining candidates and onboarding records
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Candidate
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}

      {/* Card */}
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, mobile..."
              className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
            />
          </div>
          <div className="text-sm text-[#6b7280]">
            {total} candidate{total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Full Scrollable Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-sm text-[#6b7280]">
                <svg className="h-5 w-5 animate-spin text-[#E42527]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading candidates...
              </div>
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
                <svg className="h-7 w-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#374151]">No candidates found</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {search ? "Try a different search term" : "Add your first candidate to start onboarding"}
              </p>
              {!search && (
                <button onClick={openAdd} className="mt-4 text-sm font-medium text-[#E42527] hover:underline">
                  + Add Candidate
                </button>
              )}
            </div>
          ) : (
            <table className="w-max min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="sticky left-0 z-10 bg-[#f9fafb] px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">#</th>
                  <th className="sticky left-10 z-10 bg-[#f9fafb] px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Candidate</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Personal Email</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Personal Mobile</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Official Email</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Official Mobile</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Department</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Designation</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Joining Date</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Tentative Joining</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Experience</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Current Salary</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Source of Hire</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Highest Qualification</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Skills</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Aadhaar</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">PAN</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Permanent Address</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Current Address</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Education Details</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Experience Details</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Additional Info</th>
                  <th className="px-4 py-3 font-medium text-[#6b7280] whitespace-nowrap">Created At</th>
                  <th className="px-4 py-3 text-right font-medium text-[#6b7280] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((item, index) => {
                  const skills = Array.isArray(item.Skill_set)
                    ? item.Skill_set.join(", ")
                    : item.Skill_set || "—";

                  return (
                    <tr
                      key={item.on_boarding_id || item.id || index}
                      className="group transition hover:bg-[#fafafa]"
                    >
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-[#fafafa] px-4 py-3 text-[#6b7280] whitespace-nowrap">
                        {(page - 1) * pageSize + index + 1}
                      </td>

                      <td className="sticky left-10 z-10 bg-white group-hover:bg-[#fafafa] px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fef2f2] text-xs font-semibold text-[#E42527]">
                            {(item.first_name?.[0] || "C").toUpperCase()}
                            {(item.last_name?.[0] || "").toUpperCase()}
                          </div>
                          <span className="font-medium text-[#1a1a1a]">
                            {item.first_name} {item.last_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.email || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.mobile || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.Official_Email || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.Official_Mobile || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{getDeptName(item.department)}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{getDesigName(item.title)}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{formatDate(item.joining_date)}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{formatDate(item.tentative_joining_date)}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">
                        {item.experience != null ? `${item.experience} yrs` : "—"}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">
                        {item.current_salary != null ? `₹ ${item.current_salary}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.source_of_hire || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.highest_qualification || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] max-w-[180px] truncate" title={skills}>
                        {skills}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.aadhaar_number || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{item.pan_number || "—"}</td>
                      <td className="px-4 py-3 text-[#6b7280] max-w-[200px] truncate" title={formatAddr(item.permanent_address)}>
                        {formatAddr(item.permanent_address)}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] max-w-[200px] truncate" title={formatAddr(item.current_address)}>
                        {formatAddr(item.current_address)}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] max-w-[180px] truncate" title={getDetails(item.education_details)}>
                        {getDetails(item.education_details)}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] max-w-[180px] truncate" title={getDetails(item.experience_details)}>
                        {getDetails(item.experience_details)}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] max-w-[180px] truncate" title={item.additional_info || ""}>
                        {item.additional_info || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{formatDate(item.created_at)}</td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[#6b7280] opacity-0 transition hover:bg-[#f3f4f6] hover:text-[#374151] group-hover:opacity-100"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3">
            <p className="text-sm text-[#6b7280]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODAL ===================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-8">
          <div className="mb-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  {editId ? "Edit Candidate" : "Add Candidate"}
                </h2>
                <p className="mt-0.5 text-sm text-[#6b7280]">
                  Fill candidate details for onboarding
                </p>
              </div>
              <button onClick={closeModal} className="rounded-md p-1.5 text-[#9ca3af] hover:bg-[#f3f4f6]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex border-b border-[#e5e7eb] px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id ? "text-[#E42527]" : "text-[#6b7280] hover:text-[#374151]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E42527]" />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                {activeTab === "basic" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                        First Name <span className="text-[#E42527]">*</span>
                      </label>
                      <input required value={formData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                        Last Name <span className="text-[#E42527]">*</span>
                      </label>
                      <input required value={formData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                        Personal Email <span className="text-[#E42527]">*</span>
                      </label>
                      <input required type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                        Personal Mobile <span className="text-[#E42527]">*</span>
                      </label>
                      <input required value={formData.mobile} onChange={(e) => handleChange("mobile", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                        Official Email <span className="text-[#E42527]">*</span>
                      </label>
                      <input required type="email" value={formData.Official_Email} onChange={(e) => handleChange("Official_Email", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                        Official Mobile <span className="text-[#E42527]">*</span>
                      </label>
                      <input required value={formData.Official_Mobile} onChange={(e) => handleChange("Official_Mobile", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Aadhaar Number</label>
                      <input
                        value={formData.aadhaar_number}
                        onChange={(e) =>
                          handleChange("aadhaar_number", e.target.value.replace(/\D/g, "").slice(0, 12))
                        }
                        inputMode="numeric"
                        maxLength={12}
                        pattern="[0-9]{12}"
                        placeholder="12 digits"
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">PAN Number</label>
                      <input
                        value={formData.pan_number}
                        onChange={(e) =>
                          handleChange(
                            "pan_number",
                            e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)
                          )
                        }
                        maxLength={10}
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                        placeholder="ABCDE1234F"
                        className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm uppercase focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "job" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Department</label>
                      <select value={formData.department} onChange={(e) => handleChange("department", e.target.value)} disabled={loadingMasters} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] disabled:bg-gray-50">
                        <option value="">{loadingMasters ? "Loading..." : "Select Department"}</option>
                        {departments.map((d) => (
                          <option key={d.department_id || d.id} value={d.department_id || d.id}>
                            {d.department_name || d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Designation / Title</label>
                      <select value={formData.title} onChange={(e) => handleChange("title", e.target.value)} disabled={loadingMasters} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527] disabled:bg-gray-50">
                        <option value="">{loadingMasters ? "Loading..." : "Select Designation"}</option>
                        {designations.map((d) => (
                          <option key={d.designation_id || d.id} value={d.designation_id || d.id}>
                            {d.job_title || d.designation_name || d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Joining Date</label>
                      <input type="date" value={formData.joining_date} onChange={(e) => handleChange("joining_date", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Tentative Joining Date</label>
                      <input type="date" value={formData.tentative_joining_date} onChange={(e) => handleChange("tentative_joining_date", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Experience (Years)</label>
                      <input type="number" step="0.1" value={formData.experience} onChange={(e) => handleChange("experience", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Current Salary</label>
                      <input type="number" value={formData.current_salary} onChange={(e) => handleChange("current_salary", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Source of Hire</label>
                      <input value={formData.source_of_hire} onChange={(e) => handleChange("source_of_hire", e.target.value)} placeholder="Referral, Naukri, LinkedIn..." className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                  </div>
                )}

                {activeTab === "address" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-[#374151]">Permanent Address</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <input placeholder="Address Line" value={formData.permanent_address.address_line} onChange={(e) => handleAddressChange("permanent_address", "address_line", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        </div>
                        <input placeholder="Country" value={formData.permanent_address.country} onChange={(e) => handleAddressChange("permanent_address", "country", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        <input placeholder="State" value={formData.permanent_address.state} onChange={(e) => handleAddressChange("permanent_address", "state", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        <input placeholder="City" value={formData.permanent_address.city} onChange={(e) => handleAddressChange("permanent_address", "city", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        <input placeholder="Pincode" value={formData.permanent_address.pincode} onChange={(e) => handleAddressChange("permanent_address", "pincode", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-[#374151]">Current Address</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <input placeholder="Address Line" value={formData.current_address.address_line} onChange={(e) => handleAddressChange("current_address", "address_line", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        </div>
                        <input placeholder="Country" value={formData.current_address.country} onChange={(e) => handleAddressChange("current_address", "country", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        <input placeholder="State" value={formData.current_address.state} onChange={(e) => handleAddressChange("current_address", "state", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        <input placeholder="City" value={formData.current_address.city} onChange={(e) => handleAddressChange("current_address", "city", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                        <input placeholder="Pincode" value={formData.current_address.pincode} onChange={(e) => handleAddressChange("current_address", "pincode", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "skills" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                        Skill Set <span className="font-normal text-[#9ca3af]">(comma separated)</span>
                      </label>
                      <input value={formData.Skill_set} onChange={(e) => handleChange("Skill_set", e.target.value)} placeholder="React, Node.js, Python" className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Highest Qualification</label>
                      <input value={formData.highest_qualification} onChange={(e) => handleChange("highest_qualification", e.target.value)} className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Education Details</label>
                      <textarea rows={3} value={formData.education_details} onChange={(e) => handleChange("education_details", e.target.value)} placeholder="Degree, College, Year..." className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Experience Details</label>
                      <textarea rows={3} value={formData.experience_details} onChange={(e) => handleChange("experience_details", e.target.value)} placeholder="Previous companies, roles..." className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                    </div>
                  </div>
                )}

                {activeTab === "other" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#374151]">Additional Info</label>
                    <textarea rows={4} value={formData.additional_info} onChange={(e) => handleChange("additional_info", e.target.value)} placeholder="Any extra notes..." className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]" />
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-md bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4">
                <div className="flex gap-2">
                  {activeTab !== "basic" && (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = tabs.findIndex((t) => t.id === activeTab);
                        setActiveTab(tabs[idx - 1].id);
                      }}
                      className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                    >
                      Previous
                    </button>
                  )}
                  {activeTab !== "other" && (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = tabs.findIndex((t) => t.id === activeTab);
                        setActiveTab(tabs[idx + 1].id);
                      }}
                      className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                    >
                      Next
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60">
                    {saving ? "Saving..." : editId ? "Update Candidate" : "Add Candidate"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}