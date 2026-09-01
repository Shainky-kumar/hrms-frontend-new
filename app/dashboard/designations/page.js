
"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/app/lib/api";

const getErrorMessage = (err) => {
  try {
    const detail = err?.response?.data?.detail;
    if (Array.isArray(detail)) {
      return detail.map((i) => i?.msg || "Validation error").join(", ");
    }
    if (typeof detail === "string") return detail;
    if (detail && typeof detail === "object") {
      return detail.msg || detail.message || "Request failed";
    }
    return err?.message || "Something went wrong";
  } catch {
    return "Something went wrong";
  }
};

const toArray = (payload) => {
  try {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.designations)) return payload.designations;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  } catch {
    return [];
  }
};

const formatDateTime = (date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

// Agar created aur updated almost same hain toh "—" dikhao
const getModifiedOn = (createdAt, updatedAt) => {
  if (!updatedAt) return "—";
  if (!createdAt) return formatDateTime(updatedAt);

  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();

  // 2 second se kam difference ho toh same maano
  if (Math.abs(updated - created) < 2000) {
    return "—";
  }

  return formatDateTime(updatedAt);
};

const getModifiedBy = (createdAt, updatedAt, updatedByName) => {
  if (!updatedAt || !createdAt) return "—";

  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();

  if (Math.abs(updated - created) < 2000) {
    return "—";
  }

  return updatedByName || "—";
};

export default function DesignationsPage() {
  const [designations, setDesignations] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const menuRef = useRef(null);

  const fetchDesignations = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/v1/get/designations");
      setDesignations(toArray(res?.data));
    } catch (err) {
      setError(getErrorMessage(err));
      setDesignations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDesignations = async () => {
      await fetchDesignations();
    };
    loadDesignations();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ========== ADD ==========
  const addDesignation = async (event) => {
    event.preventDefault();
    if (!jobTitle.trim()) return;

    setError("");
    setSubmitting(true);
    try {
      await api.post("/api/v1/add/designation", {
        job_title: jobTitle.trim(),
      });
      setJobTitle("");
      setShowAddForm(false);
      await fetchDesignations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ========== EDIT ==========
  const openEdit = (desig) => {
    setEditingId(desig.designation_id || desig.id);
    setJobTitle(desig.job_title || desig.designation_name || desig.name || "");
    setError("");
    setOpenMenuId(null);
    setShowEditForm(true);
  };

  const updateDesignation = async (event) => {
    event.preventDefault();
    if (!jobTitle.trim() || !editingId) return;

    setError("");
    setSubmitting(true);
    try {
      await api.put(`/api/v1/update/designation/${editingId}`, {
        job_title: jobTitle.trim(),
      });

      setJobTitle("");
      setShowEditForm(false);
      setEditingId(null);
      await fetchDesignations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingId(null);
    setError("");
    setJobTitle("");
  };

  const list = Array.isArray(designations) ? designations : [];

  const filteredDesignations = list.filter((desig) => {
    const name = (
      desig?.job_title ||
      desig?.designation_name ||
      desig?.name ||
      desig?.title ||
      ""
    ).toLowerCase();
    return name.includes((search || "").toLowerCase());
  });

  const getTitle = (desig) => {
    return (
      desig?.job_title ||
      desig?.designation_name ||
      desig?.name ||
      desig?.title ||
      "—"
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Designations</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage job titles and designation master for your organization
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setJobTitle("");
            setShowAddForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] focus:outline-none focus:ring-2 focus:ring-[#E42527]/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Designation
        </button>
      </div>

      {error && !showAddForm && !showEditForm && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-red-100 bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search designations..."
              className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-9 pr-3 text-sm text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
            />
          </div>
          <div className="text-sm text-[#6b7280]">
            {filteredDesignations.length} designation
            {filteredDesignations.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-sm text-[#6b7280]">
                <svg className="h-5 w-5 animate-spin text-[#E42527]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading designations...
              </div>
            </div>
          ) : filteredDesignations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
                <svg className="h-7 w-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m12.75-6.25v6.25m0-6.25a3 3 0 11-6 0m6 0a3 3 0 10-6 0m-6.75 6.25v-6.25" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#374151]">No designations found</p>
              <p className="mt-1 max-w-sm text-sm text-[#6b7280]">
                {search
                  ? "Try a different search term"
                  : "Add job titles like Software Engineer, HR Manager, Team Lead etc."}
              </p>
              {!search && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Designation
                </button>
              )}
            </div>
          ) : (
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Job Title</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Added By</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Added On</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Modified By</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Modified On</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredDesignations.map((designation, index) => {
                  const desigId = designation?.designation_id || designation?.id;
                  const title = getTitle(designation);

                  return (
                    <tr
                      key={desigId || index}
                      className="group transition hover:bg-[#fafafa]"
                    >
                      {/* Job Title */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2] text-sm font-semibold text-[#E42527]">
                            {title[0]?.toUpperCase() || "D"}
                          </div>
                          <p className="font-medium text-[#1a1a1a]">{title}</p>
                        </div>
                      </td>

                      {/* Added By */}
                      <td className="px-5 py-3.5 text-[#6b7280]">
                        {designation?.created_by_name ||
                          designation?.added_by_name ||
                          designation?.created_by ||
                          "—"}
                      </td>

                      {/* Added On */}
                      <td className="px-5 py-3.5 text-[#6b7280] whitespace-nowrap">
                        {formatDateTime(
                          designation?.created_at ||
                            designation?.added_on ||
                            designation?.created_date
                        )}
                      </td>

                      {/* Modified By */}
                      <td className="px-5 py-3.5 text-[#6b7280]">
                        {getModifiedBy(
                          designation?.created_at,
                          designation?.updated_at,
                          designation?.updated_by_name ||
                            designation?.modified_by_name ||
                            designation?.updated_by
                        )}
                      </td>

                      {/* Modified On */}
                      <td className="px-5 py-3.5 text-[#6b7280] whitespace-nowrap">
                        {getModifiedOn(
                          designation?.created_at,
                          designation?.updated_at
                        )}
                      </td>

                      {/* Actions */}
                      <td className="relative px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(openMenuId === desigId ? null : desigId)
                          }
                          className="rounded-md p-1.5 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#374151]"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>

                        {openMenuId === desigId && (
                          <div
                            ref={menuRef}
                            className="absolute right-5 top-10 z-20 w-36 overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-lg"
                          >
                            <button
                              type="button"
                              onClick={() => openEdit(designation)}
                              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-[#374151] hover:bg-[#f9fafb]"
                            >
                              <svg
                                className="h-4 w-4 text-[#6b7280]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ========== ADD / EDIT MODAL ========== */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  {showEditForm ? "Edit Designation" : "Add Designation"}
                </h2>
                <p className="mt-0.5 text-sm text-[#6b7280]">
                  {showEditForm
                    ? "Update the job title"
                    : "Create a new job title for your organization"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-1.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={showEditForm ? updateDesignation : addDesignation}
              className="p-6"
            >
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Job Title <span className="text-[#E42527]">*</span>
                  </label>
                  <input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-md border border-[#d1d5db] px-3.5 py-2.5 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
                    placeholder="e.g. Software Engineer, HR Manager, Team Lead"
                  />
                  <p className="mt-1.5 text-xs text-[#9ca3af]">
                    This will appear in employee profiles and filters
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-[#fef2f2] px-3.5 py-2.5 text-sm text-[#b91c1c]">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-7 flex items-center justify-end gap-3 border-t border-[#e5e7eb] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !jobTitle.trim()}
                  className="rounded-md bg-[#E42527] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : showEditForm
                    ? "Update Designation"
                    : "Add Designation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}