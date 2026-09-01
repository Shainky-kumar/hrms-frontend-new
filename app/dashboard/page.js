"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users,
  UserCheck2,
  UserX,
  CalendarDays,
  Clock,
  AlertTriangle,
  Building2,
  Briefcase,
  ClipboardList,
  Cake,
  RefreshCw,
  TrendingUp,
  Sun,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { api } from "@/app/lib/api";

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") return detail.msg || detail.message || "Request failed";
  return err?.message || "Something went wrong";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function StatCard({ icon: Icon, label, value, hint, accent, onClick }) {
  const accents = {
    red: "from-[#E42527]/10 to-white border-[#E42527]/20 text-[#E42527]",
    green: "from-emerald-50 to-white border-emerald-100 text-emerald-600",
    amber: "from-amber-50 to-white border-amber-100 text-amber-600",
    blue: "from-sky-50 to-white border-sky-100 text-sky-600",
    slate: "from-slate-50 to-white border-slate-200 text-slate-700",
    violet: "from-violet-50 to-white border-violet-100 text-violet-600",
  };
  const a = accents[accent] || accents.slate;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm transition ${a} ${
        onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : "cursor-default"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value ?? 0}
          </p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
          {onClick ? (
            <p className="mt-2 text-[11px] font-medium text-slate-400">Click to view list →</p>
          ) : null}
        </div>
        <div className="rounded-xl bg-white/80 p-2.5 shadow-sm ring-1 ring-black/5">
          <Icon className="h-5 w-5 opacity-80" />
        </div>
      </div>
    </button>
  );
}

function Panel({ title, subtitle, right, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <div className="py-12 text-center text-sm text-slate-400">{text}</div>;
}

export default function HrmsDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [peopleStatus, setPeopleStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal: "leave" | "absent" | null
  const [listModal, setListModal] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [sumRes, trendRes, pendingRes, peopleRes] = await Promise.all([
        api.get("/api/v1/dashboard/summary"),
        api.get("/api/v1/dashboard/attendance-trend", { params: { days: 7 } }),
        api.get("/api/v1/dashboard/pending-approvals", { params: { limit: 8 } }),
        api.get("/api/v1/dashboard/today-people-status"),
      ]);

      setSummary(sumRes?.data ?? sumRes);
      const tr = trendRes?.data ?? trendRes;
      setTrend(Array.isArray(tr?.trend) ? tr.trend : []);
      const pe = pendingRes?.data ?? pendingRes;
      setPendingItems(Array.isArray(pe?.items) ? pe.items : []);
      setPeopleStatus(peopleRes?.data ?? peopleRes);
    } catch (err) {
      setError(getErrorMessage(err));
      setSummary(null);
      setTrend([]);
      setPendingItems([]);
      setPeopleStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const headcount = summary?.headcount || {};
  const att = summary?.attendance_today || {};
  const pending = summary?.pending_approvals || {};
  const month = summary?.this_month || {};
  const holidays = summary?.upcoming_holidays || [];
  const birthdays = summary?.birthdays_this_week || [];
  const deptPresent = summary?.department_present_today || [];

  const onLeaveCount =
    peopleStatus?.on_leave?.count ?? att.on_leave ?? 0;
  const absentNoLeaveCount =
    peopleStatus?.absent_without_leave?.count ?? att.absent ?? 0;
  const onLeaveList = peopleStatus?.on_leave?.list || [];
  const absentList = peopleStatus?.absent_without_leave?.list || [];

  const trendData = useMemo(() => {
    return (trend || []).map((row) => {
      let day = row.date;
      try {
        if (row.date) day = new Date(row.date).toLocaleDateString("en-IN", { weekday: "short" });
      } catch {}
      return {
        day,
        present: row.present || 0,
        absent: row.absent || 0,
        leave: row.on_leave || 0,
      };
    });
  }, [trend]);

  const presentRate = useMemo(() => {
    const p = att.present || 0;
    const total =
      (att.present || 0) + (att.absent || 0) + (att.on_leave || 0) + (att.half_day || 0);
    if (!total) return null;
    return Math.round((p / total) * 100);
  }, [att]);

  const typeStyle = (type) => {
    const t = (type || "").toLowerCase();
    if (t === "leave") return "bg-sky-50 text-sky-700 ring-sky-100";
    if (t === "regularization") return "bg-violet-50 text-violet-700 ring-violet-100";
    return "bg-amber-50 text-amber-700 ring-amber-100";
  };

  const modalTitle =
    listModal === "leave"
      ? "On leave today"
      : listModal === "absent"
      ? "Absent without leave"
      : "";
  const modalList = listModal === "leave" ? onLeaveList : listModal === "absent" ? absentList : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/80 to-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E42527]/30 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10">
                <Sun className="h-3.5 w-3.5 text-amber-300" />
                {greeting()}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">HR Overview</h1>
              <p className="mt-1 text-sm text-slate-300">
                Live headcount, attendance & who is off today
                {summary?.date ? ` · ${formatDate(summary.date)}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {!loading && summary && (
            <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Active staff", value: headcount.active ?? 0 },
                { label: "Present now", value: att.present ?? 0 },
                { label: "On leave", value: onLeaveCount },
                { label: "Absent (no leave)", value: absentNoLeaveCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                >
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !summary ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : (
          <>
            {/* KPI — clickable leave & absent */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <StatCard
                icon={Users}
                label="Active"
                value={headcount.active ?? 0}
                hint={`Total ${headcount.total ?? 0}`}
                accent="slate"
              />
              <StatCard
                icon={UserCheck2}
                label="Present"
                value={att.present ?? 0}
                hint={`Late ${att.late ?? 0}`}
                accent="green"
              />
              <StatCard
                icon={CalendarDays}
                label="On leave"
                value={onLeaveCount}
                hint="Approved leave today"
                accent="blue"
                onClick={() => setListModal("leave")}
              />
              <StatCard
                icon={UserX}
                label="Absent (no leave)"
                value={absentNoLeaveCount}
                hint="No punch, no approved leave"
                accent="red"
                onClick={() => setListModal("absent")}
              />
              <StatCard
                icon={ClipboardList}
                label="Approvals"
                value={pending.total ?? 0}
                hint={`Leave ${pending.leaves ?? 0}`}
                accent="amber"
              />
              <StatCard
                icon={Briefcase}
                label="New joiners"
                value={headcount.new_joiners_this_month ?? 0}
                hint="This month"
                accent="violet"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Clock} label="WFH today" value={att.wfh ?? 0} accent="blue" />
              <StatCard
                icon={AlertTriangle}
                label="Alerts"
                value={summary?.unread_alerts ?? 0}
                accent={(summary?.unread_alerts || 0) > 0 ? "amber" : "slate"}
              />
              <StatCard
                icon={Building2}
                label="Notice period"
                value={headcount.notice_period ?? 0}
                accent="slate"
              />
              <StatCard
                icon={TrendingUp}
                label="Onboarding"
                value={summary?.onboarding_candidates ?? 0}
                hint={presentRate != null ? `Present ${presentRate}%` : "Pipeline"}
                accent="violet"
              />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-5">
              <Panel className="lg:col-span-3" title="Attendance trend" subtitle="Last 7 days">
                {trendData.length === 0 ? (
                  <Empty text="No trend data yet" />
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E42527" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#E42527" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            fontSize: 12,
                          }}
                        />
                        <Area type="monotone" dataKey="present" name="Present" stroke="#10b981" fill="url(#gPresent)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="absent" name="Absent" stroke="#E42527" fill="url(#gAbsent)" strokeWidth={2} />
                        <Area type="monotone" dataKey="leave" name="On leave" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Panel>

              <Panel className="lg:col-span-2" title="Dept presence" subtitle="In office today">
                {deptPresent.length === 0 ? (
                  <Empty text="No department data" />
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptPresent} layout="vertical" margin={{ left: 4, right: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                        <YAxis type="category" dataKey="department" width={88} tick={{ fontSize: 10, fill: "#64748b" }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                        <Bar dataKey="present" fill="#E42527" radius={[0, 8, 8, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Panel>
            </div>

            {/* Quick lists preview + pending */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Panel
                title="On leave today"
                subtitle="Approved leave"
                right={
                  <button
                    type="button"
                    onClick={() => setListModal("leave")}
                    className="text-xs font-medium text-[#E42527] hover:underline"
                  >
                    View all
                  </button>
                }
              >
                {onLeaveList.length === 0 ? (
                  <Empty text="No one on leave today" />
                ) : (
                  <div className="space-y-2">
                    {onLeaveList.slice(0, 4).map((row, i) => (
                      <div
                        key={row.employee_id || i}
                        className="flex items-center justify-between rounded-xl bg-sky-50/80 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {row.name || row.employee_id}
                          </p>
                          <p className="text-xs text-slate-500">
                            {row.leave_type || "Leave"}
                            {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
                            {row.end_date ? ` – ${formatDate(row.end_date)}` : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel
                title="Absent without leave"
                subtitle="No punch, no approved leave"
                right={
                  <button
                    type="button"
                    onClick={() => setListModal("absent")}
                    className="text-xs font-medium text-[#E42527] hover:underline"
                  >
                    View all
                  </button>
                }
              >
                {absentList.length === 0 ? (
                  <Empty text="No unexplained absents" />
                ) : (
                  <div className="space-y-2">
                    {absentList.slice(0, 4).map((row, i) => (
                      <div
                        key={row.employee_id || i}
                        className="flex items-center justify-between rounded-xl bg-red-50/80 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {row.name || row.employee_id}
                          </p>
                          <p className="text-xs text-slate-500">{row.reason || "Absent"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Pending approvals" subtitle="Needs action">
                {pendingItems.length === 0 ? (
                  <Empty text="All clear" />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingItems.slice(0, 5).map((item, i) => (
                      <div key={`${item.type}-${item.id || i}`} className="flex items-center justify-between gap-2 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {item.title || "Request"}
                          </p>
                          <p className="text-xs text-slate-500">{item.employee_id}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${typeStyle(item.type)}`}>
                          {(item.type || "").replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            {/* Holidays + Birthdays */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Upcoming holidays" subtitle="Next 30 days">
                {holidays.length === 0 ? (
                  <Empty text="No holidays upcoming" />
                ) : (
                  <div className="space-y-2">
                    {holidays.map((h, i) => (
                      <div
                        key={h.holiday_id || i}
                        className="flex items-center justify-between gap-3 rounded-xl bg-slate-50/80 px-3.5 py-3"
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {h.name || h.holiday_name}
                        </p>
                        <span className="text-xs font-medium text-slate-600">
                          {formatDate(h.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Birthdays this week" subtitle="Next 7 days">
                {birthdays.length === 0 ? (
                  <Empty text="No birthdays this week" />
                ) : (
                  <div className="space-y-2">
                    {birthdays.map((b, i) => (
                      <div
                        key={b.employee_id || i}
                        className="flex items-center justify-between gap-3 rounded-xl bg-[#fef2f2]/70 px-3.5 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white">
                            {(b.name || "E")[0]?.toUpperCase()}
                          </div>
                          <p className="truncate text-sm font-medium text-slate-900">
                            {b.name || b.employee_id}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#E42527]">
                          {formatDate(b.birthday_on || b.dob)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </>
        )}
      </div>

      {/* List modal — On leave / Absent */}
      {listModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{modalTitle}</h3>
                <p className="text-xs text-slate-500">
                  {formatDate(peopleStatus?.date || summary?.date)} · {modalList.length} people
                </p>
              </div>
              <button
                type="button"
                onClick={() => setListModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {modalList.length === 0 ? (
                <Empty text="No one in this list" />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {modalList.map((row, i) => (
                    <li key={row.employee_id || i} className="py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {row.name || row.employee_id}
                      </p>
                      <p className="text-xs text-slate-500">{row.employee_id}</p>
                      {listModal === "leave" ? (
                        <p className="mt-1 text-xs text-sky-700">
                          {row.leave_type || "Leave"}
                          {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
                          {row.end_date ? ` → ${formatDate(row.end_date)}` : ""}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-red-600">
                          {row.reason || "Absent without approved leave"}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-slate-100 px-5 py-3">
              <button
                type="button"
                onClick={() => setListModal(null)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
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