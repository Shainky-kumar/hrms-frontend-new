
"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || "Error")
      .join(" • ");
  }

  if (typeof detail === "string") return detail;

  return err?.message || "Something went wrong";
};

const boolOrNull = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;

  return null;
};

const initialForm = {
  employee_id: "",
  grace_minutes_override: "",
  geo_fence_required: "",
  face_required: "",
  allow_web_punch: "",
  allow_mobile_punch: "",
  wfh_allowed: "",
  remarks: "",
  is_active: true,
};

export default function EmployeeAttendanceConfigPage() {
  const [form, setForm] = useState(initialForm);
  const [configId, setConfigId] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [employees, setEmployees] = useState([]);
  const [configList, setConfigList] = useState([]);

  async function fetchEmployees() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/api/v1/get/employees", {
        params: {
          page: 1,
          page_size: 100,
        },
      });

      const data = res.data;

      const list =
        data?.employees ||
        data?.data ||
        data?.items ||
        data?.results ||
        [];

      setEmployees(Array.isArray(list) ? list : []);
    } catch (err) {
      setEmployees([]);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function fetchConfigList() {
    setListLoading(true);

    try {
      const res = await api.get(
        "/api/v1/get/all/employee/attendance_config"
      );

      const data = res.data;

      const list =
        data?.configs ||
        data?.data ||
        data?.items ||
        data?.results ||
        [];

      setConfigList(Array.isArray(list) ? list : []);
    } catch (err) {
      setConfigList([]);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchEmployees();
      await fetchConfigList();
    })();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!form.employee_id.trim()) {
      setError("Employee ID required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      employee_id: form.employee_id,
      grace_minutes_override: form.grace_minutes_override
        ? Number(form.grace_minutes_override)
        : null,
      geo_fence_required: boolOrNull(form.geo_fence_required),
      face_required: boolOrNull(form.face_required),
      allow_web_punch: boolOrNull(form.allow_web_punch),
      allow_mobile_punch: boolOrNull(form.allow_mobile_punch),
      wfh_allowed: boolOrNull(form.wfh_allowed),
      remarks: form.remarks || null,
      is_active: form.is_active,
    };

    try {
      await api.post(
        "/api/v1/add/employee/attendance_config",
        payload
      );

      setSuccess("Config created successfully");
      setForm(initialForm);
      setConfigId("");

      await fetchConfigList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!configId.trim()) {
      setError("Config ID required for update");
      return;
    }

    if (!form.employee_id.trim()) {
      setError("Employee ID required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      employee_id: form.employee_id,
      grace_minutes_override: form.grace_minutes_override
        ? Number(form.grace_minutes_override)
        : null,
      geo_fence_required: boolOrNull(form.geo_fence_required),
      face_required: boolOrNull(form.face_required),
      allow_web_punch: boolOrNull(form.allow_web_punch),
      allow_mobile_punch: boolOrNull(form.allow_mobile_punch),
      wfh_allowed: boolOrNull(form.wfh_allowed),
      remarks: form.remarks || null,
      is_active: form.is_active,
    };

    try {
      await api.put(
        `/api/v1/update/employee/attendance_config/${configId.trim()}`,
        payload
      );

      setSuccess("Config updated successfully");
      setForm(initialForm);
      setConfigId("");

      await fetchConfigList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSelectConfig = (config) => {
    if (!config) {
      setConfigId("");
      setForm(initialForm);
      return;
    }

    setConfigId(config.config_id || config.id);

    setForm({
      employee_id: config.employee_id || "",
      grace_minutes_override:
        config.grace_minutes_override ?? "",
      geo_fence_required:
        config.geo_fence_required === null
          ? ""
          : String(config.geo_fence_required),
      face_required:
        config.face_required === null
          ? ""
          : String(config.face_required),
      allow_web_punch:
        config.allow_web_punch === null
          ? ""
          : String(config.allow_web_punch),
      allow_mobile_punch:
        config.allow_mobile_punch === null
          ? ""
          : String(config.allow_mobile_punch),
      wfh_allowed:
        config.wfh_allowed === null
          ? ""
          : String(config.wfh_allowed),
      remarks: config.remarks || "",
      is_active: config.is_active ?? true,
    });

    setError("");
    setSuccess("");
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find(
      (item) =>
        String(item.employee_id) === String(employeeId) ||
        String(item.id) === String(employeeId)
    );

    return (
      emp?.employee_name ||
      emp?.name ||
      emp?.full_name ||
      employeeId
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Employee Attendance Config
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Per-employee attendance settings (null = company default)
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✅ {success}
          </div>
        )}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-800">
              Create / Update Config
            </h2>
          </div>

          <form className="grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Employee <span className="text-red-600">*</span>
              </label>

              {loading ? (
                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
              ) : employees.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                  No employees found
                </div>
              ) : (
                <select
                  required
                  value={form.employee_id}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      employee_id: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                >
                  <option value="">Select employee</option>

                  {employees.map((emp) => {
                    const empId =
                      emp.employee_id ||
                      emp.id ||
                      emp._id;

                    const empName =
                      emp.employee_name ||
                      emp.name ||
                      emp.full_name ||
                      empId;

                    return (
                      <option
                        key={empId}
                        value={empId}
                      >
                        {empName}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Select Config (for update)
              </label>

              {listLoading ? (
                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
              ) : configList.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                  No configs found
                </div>
              ) : (
                <select
                  value={configId}
                  onChange={(event) => {
                    const selected = configList.find(
                      (item) =>
                        String(
                          item.config_id || item.id
                        ) === String(event.target.value)
                    );

                    handleSelectConfig(selected || null);
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                >
                  <option value="">-- Select config --</option>

                  {configList.map((config) => {
                    const id = config.config_id || config.id;

                    const empName = getEmployeeName(
                      config.employee_id
                    );

                    return (
                      <option key={id} value={id}>
                        {empName} ({id.slice(0, 8)}...)
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Grace minutes override
              </label>

              <input
                type="number"
                min="0"
                max="1440"
                value={form.grace_minutes_override}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    grace_minutes_override: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                Leave empty for company default
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Geo fence required
              </label>

              <select
                value={form.geo_fence_required}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    geo_fence_required: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="">Company default</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Face required
              </label>

              <select
                value={form.face_required}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    face_required: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="">Company default</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Allow web punch
              </label>

              <select
                value={form.allow_web_punch}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    allow_web_punch: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="">Company default</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Allow mobile punch
              </label>

              <select
                value={form.allow_mobile_punch}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    allow_mobile_punch: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="">Company default</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                WFH allowed
              </label>

              <select
                value={form.wfh_allowed}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    wfh_allowed: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="">Company default</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Remarks
              </label>

              <input
                value={form.remarks}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    remarks: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                id="is-active"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    is_active: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />

              <label
                htmlFor="is-active"
                className="text-sm font-medium text-slate-700"
              >
                Active
              </label>
            </div>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="button"
                disabled={saving || loading}
                onClick={handleCreate}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Create Config"}
              </button>

              <button
                type="button"
                disabled={saving || loading || !configId}
                onClick={handleUpdate}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update Config
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-800">
              Existing Configs
            </h2>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {configList.length}{" "}
              {configList.length === 1 ? "Config" : "Configs"}
            </span>
          </div>

          {listLoading ? (
            <div className="p-5 text-center text-sm text-slate-500">
              Loading...
            </div>
          ) : configList.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📋
              </div>

              <p className="mt-3 font-semibold text-slate-700">
                No configs found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first attendance config.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 font-semibold text-slate-500">
                      #
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      Employee
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      Grace
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      Geo
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      Face
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      Web
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      Mobile
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      WFH
                    </th>

                    <th className="px-5 py-3 font-semibold text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {configList.map((config, index) => {
                    const id =
                      config.config_id || config.id;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-3 text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-3 font-medium text-slate-800">
                          {getEmployeeName(
                            config.employee_id
                          )}
                        </td>

                        <td className="px-5 py-3 text-slate-600">
                          {config.grace_minutes_override ??
                            "—"}
                        </td>

                        <td className="px-5 py-3">
                          {config.geo_fence_required ===
                          null ? (
                            <span className="text-slate-400">
                              —
                            </span>
                          ) : (
                            <span
                              className={
                                config.geo_fence_required
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {config.geo_fence_required
                                ? "Yes"
                                : "No"}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3">
                          {config.face_required ===
                          null ? (
                            <span className="text-slate-400">
                              —
                            </span>
                          ) : (
                            <span
                              className={
                                config.face_required
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {config.face_required
                                ? "Yes"
                                : "No"}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3">
                          {config.allow_web_punch ===
                          null ? (
                            <span className="text-slate-400">
                              —
                            </span>
                          ) : (
                            <span
                              className={
                                config.allow_web_punch
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {config.allow_web_punch
                                ? "Yes"
                                : "No"}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3">
                          {config.allow_mobile_punch ===
                          null ? (
                            <span className="text-slate-400">
                              —
                            </span>
                          ) : (
                            <span
                              className={
                                config.allow_mobile_punch
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {config.allow_mobile_punch
                                ? "Yes"
                                : "No"}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3">
                          {config.wfh_allowed === null ? (
                            <span className="text-slate-400">
                              —
                            </span>
                          ) : (
                            <span
                              className={
                                config.wfh_allowed
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {config.wfh_allowed
                                ? "Yes"
                                : "No"}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3">
                          {config.is_active ? (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}