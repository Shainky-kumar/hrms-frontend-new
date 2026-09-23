// // // "use client";

// // // import { useEffect, useState, useCallback, useMemo } from "react";
// // // import {
// // //   Users,
// // //   UserCheck2,
// // //   UserX,
// // //   CalendarDays,
// // //   Clock,
// // //   AlertTriangle,
// // //   Building2,
// // //   Briefcase,
// // //   ClipboardList,
// // //   Cake,
// // //   RefreshCw,
// // //   TrendingUp,
// // //   Sun,
// // //   X,
// // // } from "lucide-react";
// // // import {
// // //   ResponsiveContainer,
// // //   AreaChart,
// // //   Area,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   BarChart,
// // //   Bar,
// // // } from "recharts";
// // // import { api } from "@/app/lib/api";

// // // function getErrorMessage(err) {
// // //   const detail = err?.response?.data?.detail;
// // //   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
// // //   if (typeof detail === "string") return detail;
// // //   if (detail && typeof detail === "object") return detail.msg || detail.message || "Request failed";
// // //   return err?.message || "Something went wrong";
// // // }

// // // function formatDate(value) {
// // //   if (!value) return "—";
// // //   try {
// // //     if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
// // //       const [y, m, d] = value.split("-").map(Number);
// // //       return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
// // //         day: "2-digit",
// // //         month: "short",
// // //         year: "numeric",
// // //       });
// // //     }
// // //     return new Date(value).toLocaleDateString("en-IN", {
// // //       day: "2-digit",
// // //       month: "short",
// // //       year: "numeric",
// // //     });
// // //   } catch {
// // //     return String(value);
// // //   }
// // // }

// // // function calendarParts(value) {
// // //   if (!value) return { day: "--", month: "", weekday: "" };
// // //   try {
// // //     const date = new Date(
// // //       typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
// // //         ? `${value}T00:00:00`
// // //         : value
// // //     );
// // //     return {
// // //       day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
// // //       month: date.toLocaleDateString("en-IN", { month: "short" }),
// // //       weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
// // //     };
// // //   } catch {
// // //     return { day: "--", month: "", weekday: "" };
// // //   }
// // // }

// // // function greeting() {
// // //   const h = new Date().getHours();
// // //   if (h < 12) return "Good morning";
// // //   if (h < 17) return "Good afternoon";
// // //   return "Good evening";
// // // }

// // // function StatCard({ icon: Icon, label, value, hint, accent, onClick }) {
// // //   const accents = {
// // //     red: "from-[#E42527]/10 to-white border-[#E42527]/20 text-[#E42527]",
// // //     green: "from-emerald-50 to-white border-emerald-100 text-emerald-600",
// // //     amber: "from-amber-50 to-white border-amber-100 text-amber-600",
// // //     blue: "from-sky-50 to-white border-sky-100 text-sky-600",
// // //     slate: "from-slate-50 to-white border-slate-200 text-slate-700",
// // //     violet: "from-violet-50 to-white border-violet-100 text-violet-600",
// // //   };
// // //   const a = accents[accent] || accents.slate;

// // //   return (
// // //     <button
// // //       type="button"
// // //       onClick={onClick}
// // //       disabled={!onClick}
// // //       className={`relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm transition ${a} ${
// // //         onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : "cursor-default"
// // //       }`}
// // //     >
// // //       <div className="flex items-start justify-between">
// // //         <div>
// // //           <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// // //             {label}
// // //           </p>
// // //           <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
// // //             {value ?? 0}
// // //           </p>
// // //           {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
// // //           {onClick ? (
// // //             <p className="mt-2 text-[11px] font-medium text-slate-400">Click to view list →</p>
// // //           ) : null}
// // //         </div>
// // //         <div className="rounded-xl bg-white/80 p-2.5 shadow-sm ring-1 ring-black/5">
// // //           <Icon className="h-5 w-5 opacity-80" />
// // //         </div>
// // //       </div>
// // //     </button>
// // //   );
// // // }

// // // function Panel({ title, subtitle, right, children, className = "" }) {
// // //   return (
// // //     <div className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}>
// // //       <div className="mb-4 flex items-start justify-between gap-3">
// // //         <div>
// // //           <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
// // //           {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
// // //         </div>
// // //         {right}
// // //       </div>
// // //       {children}
// // //     </div>
// // //   );
// // // }

// // // function Empty({ text }) {
// // //   return <div className="py-12 text-center text-sm text-slate-400">{text}</div>;
// // // }

// // // export default function HrmsDashboardPage() {
// // //   const [summary, setSummary] = useState(null);
// // //   const [trend, setTrend] = useState([]);
// // //   const [pendingItems, setPendingItems] = useState([]);
// // //   const [peopleStatus, setPeopleStatus] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState("");

// // //   // Modal: "leave" | "absent" | null
// // //   const [listModal, setListModal] = useState(null);

// // //   const loadDashboard = useCallback(async () => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const [sumRes, trendRes, pendingRes, peopleRes] = await Promise.all([
// // //         api.get("/api/v1/dashboard/summary"),
// // //         api.get("/api/v1/dashboard/attendance-trend", { params: { days: 7 } }),
// // //         api.get("/api/v1/dashboard/pending-approvals", { params: { limit: 8 } }),
// // //         api.get("/api/v1/dashboard/today-people-status"),
// // //       ]);

// // //       setSummary(sumRes?.data ?? sumRes);
// // //       const tr = trendRes?.data ?? trendRes;
// // //       setTrend(Array.isArray(tr?.trend) ? tr.trend : []);
// // //       const pe = pendingRes?.data ?? pendingRes;
// // //       setPendingItems(Array.isArray(pe?.items) ? pe.items : []);
// // //       setPeopleStatus(peopleRes?.data ?? peopleRes);
// // //     } catch (err) {
// // //       setError(getErrorMessage(err));
// // //       setSummary(null);
// // //       setTrend([]);
// // //       setPendingItems([]);
// // //       setPeopleStatus(null);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     const timeoutId = setTimeout(() => {
// // //       loadDashboard();
// // //     }, 0);

// // //     return () => clearTimeout(timeoutId);
// // //   }, [loadDashboard]);

// // //   const headcount = summary?.headcount || {};
// // //   const att = summary?.attendance_today || {};
// // //   const pending = summary?.pending_approvals || {};
// // //   const month = summary?.this_month || {};
// // //   const holidays = summary?.upcoming_holidays || [];
// // //   const birthdays = summary?.birthdays_this_week || [];
// // //   const deptPresent = summary?.department_present_today || [];

// // //   const onLeaveCount =
// // //     peopleStatus?.on_leave?.count ?? att.on_leave ?? 0;
// // //   const absentNoLeaveCount =
// // //     peopleStatus?.absent_without_leave?.count ?? att.absent ?? 0;
// // //   const onLeaveList = peopleStatus?.on_leave?.list || [];
// // //   const absentList = peopleStatus?.absent_without_leave?.list || [];

// // //   const trendData = useMemo(() => {
// // //     return (trend || []).map((row) => {
// // //       let day = row.date;
// // //       try {
// // //         if (row.date) day = new Date(row.date).toLocaleDateString("en-IN", { weekday: "short" });
// // //       } catch {}
// // //       return {
// // //         day,
// // //         present: row.present || 0,
// // //         absent: row.absent || 0,
// // //         leave: row.on_leave || 0,
// // //       };
// // //     });
// // //   }, [trend]);

// // //   const presentRate = useMemo(() => {
// // //     const p = att.present || 0;
// // //     const total =
// // //       (att.present || 0) + (att.absent || 0) + (att.on_leave || 0) + (att.half_day || 0);
// // //     if (!total) return null;
// // //     return Math.round((p / total) * 100);
// // //   }, [att]);

// // //   const typeStyle = (type) => {
// // //     const t = (type || "").toLowerCase();
// // //     if (t === "leave") return "bg-sky-50 text-sky-700 ring-sky-100";
// // //     if (t === "regularization") return "bg-violet-50 text-violet-700 ring-violet-100";
// // //     return "bg-amber-50 text-amber-700 ring-amber-100";
// // //   };

// // //   const modalTitle =
// // //     listModal === "leave"
// // //       ? "On leave today"
// // //       : listModal === "absent"
// // //       ? "Absent without leave"
// // //       : "";
// // //   const modalList = listModal === "leave" ? onLeaveList : listModal === "absent" ? absentList : [];

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-b from-slate-100/80 to-slate-50">
// // //       <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
// // //         {/* Hero */}
// // //         <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
// // //           <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E42527]/30 blur-3xl" />
// // //           <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// // //             <div>
// // //               <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10">
// // //                 <Sun className="h-3.5 w-3.5 text-amber-300" />
// // //                 {greeting()}
// // //               </div>
// // //               <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">HR Overview</h1>
// // //               <p className="mt-1 text-sm text-slate-300">
// // //                 Live headcount, attendance & who is off today
// // //                 {summary?.date ? ` · ${formatDate(summary.date)}` : ""}
// // //               </p>
// // //             </div>
// // //             <button
// // //               type="button"
// // //               onClick={loadDashboard}
// // //               disabled={loading}
// // //               className="inline-flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-50"
// // //             >
// // //               <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
// // //               Refresh
// // //             </button>
// // //           </div>

// // //           {!loading && summary && (
// // //             <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
// // //               {[
// // //                 { label: "Active staff", value: headcount.active ?? 0 },
// // //                 { label: "Present now", value: att.present ?? 0 },
// // //                 { label: "On leave", value: onLeaveCount },
// // //                 { label: "Absent (no leave)", value: absentNoLeaveCount },
// // //               ].map((item) => (
// // //                 <div
// // //                   key={item.label}
// // //                   className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
// // //                 >
// // //                   <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
// // //                   <p className="mt-1 text-xl font-semibold tabular-nums">{item.value}</p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </div>

// // //         {error && (
// // //           <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // //             {error}
// // //           </div>
// // //         )}

// // //         {loading && !summary ? (
// // //           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
// // //             {Array.from({ length: 6 }).map((_, i) => (
// // //               <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <>
// // //             {/* KPI — clickable leave & absent */}
// // //             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
// // //               <StatCard
// // //                 icon={Users}
// // //                 label="Active"
// // //                 value={headcount.active ?? 0}
// // //                 hint={`Total ${headcount.total ?? 0}`}
// // //                 accent="slate"
// // //               />
// // //               <StatCard
// // //                 icon={UserCheck2}
// // //                 label="Present"
// // //                 value={att.present ?? 0}
// // //                 hint={`Late ${att.late ?? 0}`}
// // //                 accent="green"
// // //               />
// // //               <StatCard
// // //                 icon={CalendarDays}
// // //                 label="On leave"
// // //                 value={onLeaveCount}
// // //                 hint="Approved leave today"
// // //                 accent="blue"
// // //                 onClick={() => setListModal("leave")}
// // //               />
// // //               <StatCard
// // //                 icon={UserX}
// // //                 label="Absent (no leave)"
// // //                 value={absentNoLeaveCount}
// // //                 hint="No punch, no approved leave"
// // //                 accent="red"
// // //                 onClick={() => setListModal("absent")}
// // //               />
// // //               <StatCard
// // //                 icon={ClipboardList}
// // //                 label="Approvals"
// // //                 value={pending.total ?? 0}
// // //                 hint={`Leave ${pending.leaves ?? 0}`}
// // //                 accent="amber"
// // //               />
// // //               <StatCard
// // //                 icon={Briefcase}
// // //                 label="New joiners"
// // //                 value={headcount.new_joiners_this_month ?? 0}
// // //                 hint="This month"
// // //                 accent="violet"
// // //               />
// // //             </div>

// // //             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
// // //               <StatCard icon={Clock} label="WFH today" value={att.wfh ?? 0} accent="blue" />
// // //               <StatCard
// // //                 icon={AlertTriangle}
// // //                 label="Alerts"
// // //                 value={summary?.unread_alerts ?? 0}
// // //                 accent={(summary?.unread_alerts || 0) > 0 ? "amber" : "slate"}
// // //               />
// // //               <StatCard
// // //                 icon={Building2}
// // //                 label="Notice period"
// // //                 value={headcount.notice_period ?? 0}
// // //                 accent="slate"
// // //               />
// // //               <StatCard
// // //                 icon={TrendingUp}
// // //                 label="Onboarding"
// // //                 value={summary?.onboarding_candidates ?? 0}
// // //                 hint={presentRate != null ? `Present ${presentRate}%` : "Pipeline"}
// // //                 accent="violet"
// // //               />
// // //             </div>

// // //             {/* Charts */}
// // //             <div className="grid gap-4 lg:grid-cols-5">
// // //               <Panel className="lg:col-span-3" title="Attendance trend" subtitle="Last 7 days">
// // //                 {trendData.length === 0 ? (
// // //                   <Empty text="No trend data yet" />
// // //                 ) : (
// // //                   <div className="h-72">
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <AreaChart data={trendData}>
// // //                         <defs>
// // //                           <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
// // //                             <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
// // //                             <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
// // //                           </linearGradient>
// // //                           <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
// // //                             <stop offset="0%" stopColor="#E42527" stopOpacity={0.25} />
// // //                             <stop offset="100%" stopColor="#E42527" stopOpacity={0} />
// // //                           </linearGradient>
// // //                         </defs>
// // //                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
// // //                         <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
// // //                         <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
// // //                         <Tooltip
// // //                           contentStyle={{
// // //                             borderRadius: 12,
// // //                             border: "1px solid #e2e8f0",
// // //                             fontSize: 12,
// // //                           }}
// // //                         />
// // //                         <Area type="monotone" dataKey="present" name="Present" stroke="#10b981" fill="url(#gPresent)" strokeWidth={2.5} />
// // //                         <Area type="monotone" dataKey="absent" name="Absent" stroke="#E42527" fill="url(#gAbsent)" strokeWidth={2} />
// // //                         <Area type="monotone" dataKey="leave" name="On leave" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
// // //                       </AreaChart>
// // //                     </ResponsiveContainer>
// // //                   </div>
// // //                 )}
// // //               </Panel>

// // //               <Panel className="lg:col-span-2" title="Dept presence" subtitle="In office today">
// // //                 {deptPresent.length === 0 ? (
// // //                   <Empty text="No department data" />
// // //                 ) : (
// // //                   <div className="h-72">
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <BarChart data={deptPresent} layout="vertical" margin={{ left: 4, right: 8 }}>
// // //                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
// // //                         <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
// // //                         <YAxis type="category" dataKey="department" width={88} tick={{ fontSize: 10, fill: "#64748b" }} />
// // //                         <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
// // //                         <Bar dataKey="present" fill="#E42527" radius={[0, 8, 8, 0]} barSize={14} />
// // //                       </BarChart>
// // //                     </ResponsiveContainer>
// // //                   </div>
// // //                 )}
// // //               </Panel>
// // //             </div>

// // //             {/* Quick lists preview + pending */}
// // //             <div className="grid gap-4 lg:grid-cols-3">
// // //               <Panel
// // //                 title="On leave today"
// // //                 subtitle="Approved leave"
// // //                 right={
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => setListModal("leave")}
// // //                     className="text-xs font-medium text-[#E42527] hover:underline"
// // //                   >
// // //                     View all
// // //                   </button>
// // //                 }
// // //               >
// // //                 {onLeaveList.length === 0 ? (
// // //                   <Empty text="No one on leave today" />
// // //                 ) : (
// // //                   <div className="space-y-2">
// // //                     {onLeaveList.slice(0, 4).map((row, i) => (
// // //                       <div
// // //                         key={row.employee_id || i}
// // //                         className="flex items-center justify-between rounded-xl bg-sky-50/80 px-3 py-2.5"
// // //                       >
// // //                         <div className="min-w-0">
// // //                           <p className="truncate text-sm font-medium text-slate-900">
// // //                             {row.name || row.employee_id}
// // //                           </p>
// // //                           <p className="text-xs text-slate-500">
// // //                             {row.leave_type || "Leave"}
// // //                             {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
// // //                             {row.end_date ? ` – ${formatDate(row.end_date)}` : ""}
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </Panel>

// // //               <Panel
// // //                 title="Absent without leave"
// // //                 subtitle="No punch, no approved leave"
// // //                 right={
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => setListModal("absent")}
// // //                     className="text-xs font-medium text-[#E42527] hover:underline"
// // //                   >
// // //                     View all
// // //                   </button>
// // //                 }
// // //               >
// // //                 {absentList.length === 0 ? (
// // //                   <Empty text="No unexplained absents" />
// // //                 ) : (
// // //                   <div className="space-y-2">
// // //                     {absentList.slice(0, 4).map((row, i) => (
// // //                       <div
// // //                         key={row.employee_id || i}
// // //                         className="flex items-center justify-between rounded-xl bg-red-50/80 px-3 py-2.5"
// // //                       >
// // //                         <div className="min-w-0">
// // //                           <p className="truncate text-sm font-medium text-slate-900">
// // //                             {row.name || row.employee_id}
// // //                           </p>
// // //                           <p className="text-xs text-slate-500">{row.reason || "Absent"}</p>
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </Panel>

// // //               <Panel title="Pending approvals" subtitle="Needs action">
// // //                 {pendingItems.length === 0 ? (
// // //                   <Empty text="All clear" />
// // //                 ) : (
// // //                   <div className="divide-y divide-slate-100">
// // //                     {pendingItems.slice(0, 5).map((item, i) => (
// // //                       <div key={`${item.type}-${item.id || i}`} className="flex items-center justify-between gap-2 py-2.5">
// // //                         <div className="min-w-0">
// // //                           <p className="truncate text-sm font-medium text-slate-900">
// // //                             {item.title || "Request"}
// // //                           </p>
// // //                           <p className="text-xs text-slate-500">{item.employee_id}</p>
// // //                         </div>
// // //                         <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${typeStyle(item.type)}`}>
// // //                           {(item.type || "").replace(/_/g, " ")}
// // //                         </span>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </Panel>
// // //             </div>

// // //             {/* Holidays + Birthdays */}
// // //             <div className="grid gap-4 lg:grid-cols-2">
// // //               <Panel
// // //                 title="Upcoming holidays"
// // //                 subtitle="Next 30 days"
// // //                 right={
// // //                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
// // //                     <CalendarDays className="h-4.5 w-4.5" />
// // //                   </div>
// // //                 }
// // //                 className="overflow-hidden"
// // //               >
// // //                 {holidays.length === 0 ? (
// // //                   <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5">
// // //                     <Sun className="h-5 w-5 text-amber-500" />
// // //                     <p className="text-sm text-slate-500">No holidays upcoming</p>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="space-y-2.5">
// // //                     {holidays.map((h, i) => (
// // //                       <div
// // //                         key={h.holiday_id || i}
// // //                         className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 transition hover:border-amber-200 hover:bg-amber-50/40"
// // //                       >
// // //                         {(() => {
// // //                           const date = calendarParts(h.date);
// // //                           return (
// // //                             <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm ring-1 ring-amber-100">
// // //                               <span className="text-[10px] font-bold uppercase">{date.month}</span>
// // //                               <span className="text-lg font-bold leading-4">{date.day}</span>
// // //                             </div>
// // //                           );
// // //                         })()}
// // //                         <div className="min-w-0 flex-1">
// // //                           <p className="truncate text-sm font-semibold text-slate-900">
// // //                             {h.name || h.holiday_name}
// // //                           </p>
// // //                           <p className="mt-0.5 text-xs text-slate-500">{formatDate(h.date)}</p>
// // //                         </div>
// // //                         <Sun className="h-4 w-4 shrink-0 text-amber-400" />
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </Panel>

// // //               <Panel
// // //                 title="Birthdays this week"
// // //                 subtitle="Next 7 days"
// // //                 right={
// // //                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
// // //                     <Cake className="h-4.5 w-4.5" />
// // //                   </div>
// // //                 }
// // //                 className="overflow-hidden"
// // //               >
// // //                 {birthdays.length === 0 ? (
// // //                   <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5">
// // //                     <Cake className="h-5 w-5 text-rose-400" />
// // //                     <p className="text-sm text-slate-500">No birthdays this week</p>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="space-y-2.5">
// // //                     {birthdays.map((b, i) => (
// // //                       <div
// // //                         key={b.employee_id || i}
// // //                         className="flex items-center gap-3 rounded-xl border border-rose-100/80 bg-rose-50/50 px-3 py-2.5 transition hover:border-rose-200 hover:bg-rose-50"
// // //                       >
// // //                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white shadow-sm shadow-red-200">
// // //                             {(b.name || "E")[0]?.toUpperCase()}
// // //                         </div>
// // //                         <div className="min-w-0 flex-1">
// // //                           <p className="truncate text-sm font-semibold text-slate-900">
// // //                             {b.name || b.employee_id}
// // //                           </p>
// // //                           <p className="mt-0.5 text-xs text-slate-500">{formatDate(b.birthday_on || b.dob)}</p>
// // //                         </div>
// // //                         <Cake className="h-4 w-4 shrink-0 text-[#E42527]" />
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </Panel>
// // //             </div>
// // //           </>
// // //         )}
// // //       </div>

// // //       {/* List modal — On leave / Absent */}
// // //       {listModal && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// // //           <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// // //               <div>
// // //                 <h3 className="text-lg font-semibold text-slate-900">{modalTitle}</h3>
// // //                 <p className="text-xs text-slate-500">
// // //                   {formatDate(peopleStatus?.date || summary?.date)} · {modalList.length} people
// // //                 </p>
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setListModal(null)}
// // //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// // //               >
// // //                 <X className="h-5 w-5" />
// // //               </button>
// // //             </div>
// // //             <div className="flex-1 overflow-y-auto px-5 py-3">
// // //               {modalList.length === 0 ? (
// // //                 <Empty text="No one in this list" />
// // //               ) : (
// // //                 <ul className="divide-y divide-slate-100">
// // //                   {modalList.map((row, i) => (
// // //                     <li key={row.employee_id || i} className="py-3">
// // //                       <p className="text-sm font-semibold text-slate-900">
// // //                         {row.name || row.employee_id}
// // //                       </p>
// // //                       <p className="text-xs text-slate-500">{row.employee_id}</p>
// // //                       {listModal === "leave" ? (
// // //                         <p className="mt-1 text-xs text-sky-700">
// // //                           {row.leave_type || "Leave"}
// // //                           {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
// // //                           {row.end_date ? ` → ${formatDate(row.end_date)}` : ""}
// // //                         </p>
// // //                       ) : (
// // //                         <p className="mt-1 text-xs text-red-600">
// // //                           {row.reason || "Absent without approved leave"}
// // //                         </p>
// // //                       )}
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               )}
// // //             </div>
// // //             <div className="border-t border-slate-100 px-5 py-3">
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setListModal(null)}
// // //                 className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useState, useCallback, useMemo, useRef } from "react";
// // import Link from "next/link";
// // import {
// //   Users, UserCheck2, UserX, CalendarDays, Clock, AlertTriangle,
// //   Building2, Briefcase, ClipboardList, Cake, RefreshCw, TrendingUp,
// //   TrendingDown, Sun, X, Printer, Zap, CircleDot, Award, Bell,
// //   ChevronRight, Sparkles, AlertCircle, UserPlus, Timer,
// // } from "lucide-react";
// // import {
// //   ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
// //   Tooltip, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
// // } from "recharts";
// // import { api } from "@/app/lib/api";

// // /* ══════════════════════════════════════════════════════════
// //    HELPERS
// //    ══════════════════════════════════════════════════════════ */

// // function getErrorMessage(err) {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((i) => i?.msg || "Error").join(", ");
// //   if (typeof detail === "string") return detail;
// //   if (detail && typeof detail === "object") return detail.msg || detail.message || "Request failed";
// //   return err?.message || "Something went wrong";
// // }

// // function formatDate(value) {
// //   if (!value) return "—";
// //   try {
// //     if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
// //       const [y, m, d] = value.split("-").map(Number);
// //       return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
// //         day: "2-digit", month: "short", year: "numeric",
// //       });
// //     }
// //     return new Date(value).toLocaleDateString("en-IN", {
// //       day: "2-digit", month: "short", year: "numeric",
// //     });
// //   } catch { return String(value); }
// // }

// // function calendarParts(value) {
// //   if (!value) return { day: "--", month: "", weekday: "" };
// //   try {
// //     const date = new Date(
// //       typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
// //         ? `${value}T00:00:00` : value
// //     );
// //     return {
// //       day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
// //       month: date.toLocaleDateString("en-IN", { month: "short" }),
// //       weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
// //     };
// //   } catch { return { day: "--", month: "", weekday: "" }; }
// // }

// // function greeting() {
// //   const h = new Date().getHours();
// //   if (h < 12) return "Good morning";
// //   if (h < 17) return "Good afternoon";
// //   return "Good evening";
// // }

// // function relativeTime(ts) {
// //   if (!ts) return "";
// //   const diff = Math.floor((Date.now() - ts) / 1000);
// //   if (diff < 5) return "just now";
// //   if (diff < 60) return `${diff}s ago`;
// //   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
// //   return `${Math.floor(diff / 3600)}h ago`;
// // }

// // /* ══════════════════════════════════════════════════════════
// //    SUB COMPONENTS
// //    ══════════════════════════════════════════════════════════ */

// // function StatCard({ icon: Icon, label, value, hint, accent, onClick, delta }) {
// //   const accents = {
// //     red: "from-[#E42527]/10 to-white border-[#E42527]/20 text-[#E42527]",
// //     green: "from-emerald-50 to-white border-emerald-100 text-emerald-600",
// //     amber: "from-amber-50 to-white border-amber-100 text-amber-600",
// //     blue: "from-sky-50 to-white border-sky-100 text-sky-600",
// //     slate: "from-slate-50 to-white border-slate-200 text-slate-700",
// //     violet: "from-violet-50 to-white border-violet-100 text-violet-600",
// //   };
// //   const a = accents[accent] || accents.slate;

// //   const deltaContent = () => {
// //     if (delta == null) return null;
// //     if (delta > 0) {
// //       return (
// //         <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
// //           <TrendingUp className="h-3 w-3" />
// //           {delta > 0 ? `+${delta}` : delta}
// //         </span>
// //       );
// //     }
// //     if (delta < 0) {
// //       return (
// //         <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
// //           <TrendingDown className="h-3 w-3" />
// //           {delta}
// //         </span>
// //       );
// //     }
// //     return (
// //       <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
// //         — 0
// //       </span>
// //     );
// //   };

// //   return (
// //     <button
// //       type="button"
// //       onClick={onClick}
// //       disabled={!onClick}
// //       className={`relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm transition ${a} ${
// //         onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : "cursor-default"
// //       }`}
// //     >
// //       <div className="flex items-start justify-between">
// //         <div className="min-w-0 flex-1">
// //           <div className="flex items-center gap-2">
// //             <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //               {label}
// //             </p>
// //             {deltaContent()}
// //           </div>
// //           <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
// //             {value ?? 0}
// //           </p>
// //           {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
// //           {onClick ? (
// //             <p className="mt-2 text-[11px] font-medium text-slate-400">Click to view list →</p>
// //           ) : null}
// //         </div>
// //         <div className="rounded-xl bg-white/80 p-2.5 shadow-sm ring-1 ring-black/5">
// //           <Icon className="h-5 w-5 opacity-80" />
// //         </div>
// //       </div>
// //     </button>
// //   );
// // }

// // function Panel({ title, subtitle, right, children, className = "" }) {
// //   return (
// //     <div className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}>
// //       <div className="mb-4 flex items-start justify-between gap-3">
// //         <div>
// //           <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
// //           {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
// //         </div>
// //         {right}
// //       </div>
// //       {children}
// //     </div>
// //   );
// // }

// // function Empty({ text, icon: Icon, action }) {
// //   return (
// //     <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
// //       {Icon && (
// //         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
// //           <Icon className="h-6 w-6" />
// //         </div>
// //       )}
// //       <p className="text-sm text-slate-500">{text}</p>
// //       {action}
// //     </div>
// //   );
// // }

// // function AttendanceRing({ percent, present, total }) {
// //   const pct = Math.max(0, Math.min(100, percent ?? 0));
// //   const data = [{ name: "rate", value: pct, fill: pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#E42527" }];

// //   return (
// //     <div className="relative flex h-[180px] w-full items-center justify-center">
// //       <ResponsiveContainer width="100%" height="100%">
// //         <RadialBarChart
// //           cx="50%" cy="50%" innerRadius="72%" outerRadius="100%"
// //           startAngle={90} endAngle={-270} data={data}
// //         >
// //           <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
// //           <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "#f1f5f9" }} />
// //         </RadialBarChart>
// //       </ResponsiveContainer>
// //       <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
// //         <p className="text-4xl font-bold text-slate-900 tabular-nums">{pct}%</p>
// //         <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
// //           Attendance
// //         </p>
// //         {present != null && total != null && (
// //           <p className="mt-0.5 text-xs text-slate-500">
// //             {present} of {total}
// //           </p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // function QuickAction({ icon: Icon, label, href, tone = "slate" }) {
// //   const tones = {
// //     red: "bg-red-50 text-red-700 hover:bg-red-100 ring-red-100",
// //     green: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-emerald-100",
// //     amber: "bg-amber-50 text-amber-700 hover:bg-amber-100 ring-amber-100",
// //     blue: "bg-sky-50 text-sky-700 hover:bg-sky-100 ring-sky-100",
// //     violet: "bg-violet-50 text-violet-700 hover:bg-violet-100 ring-violet-100",
// //   };
// //   const t = tones[tone] || tones.slate;
// //   return (
// //     <Link
// //       href={href}
// //       className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ring-1 transition ${t}`}
// //     >
// //       <Icon className="h-4 w-4 shrink-0" />
// //       <span className="truncate">{label}</span>
// //       <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
// //     </Link>
// //   );
// // }

// // /* ══════════════════════════════════════════════════════════
// //    MAIN
// //    ══════════════════════════════════════════════════════════ */

// // export default function HrmsDashboardPage() {
// //   const [summary, setSummary] = useState(null);
// //   const [trend, setTrend] = useState([]);
// //   const [pendingItems, setPendingItems] = useState([]);
// //   const [peopleStatus, setPeopleStatus] = useState(null);
// //   const [actionItems, setActionItems] = useState([]);
// //   const [recentHires, setRecentHires] = useState([]);
// //   const [myTeam, setMyTeam] = useState(null);
// //   const [heatmap, setHeatmap] = useState([]);
// //   const [lastUpdated, setLastUpdated] = useState(null);
// //   const [tick, setTick] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [autoRefresh, setAutoRefresh] = useState(true);
// //   const [listModal, setListModal] = useState(null);
// //   const reqIdRef = useRef(0);

// //   /* ══════════════ LOAD ══════════════ */
// //   const loadDashboard = useCallback(async ({ silent = false } = {}) => {
// //     const myReqId = ++reqIdRef.current;
// //     if (!silent) setLoading(true);
// //     if (!silent) setError("");

// //     try {
// //       const [sumRes, trendRes, pendingRes, peopleRes, actionsRes, hiresRes, teamRes, heatRes] =
// //         await Promise.allSettled([
// //           api.get("/api/v1/dashboard/summary"),
// //           api.get("/api/v1/dashboard/attendance-trend", { params: { days: 7 } }),
// //           api.get("/api/v1/dashboard/pending-approvals", { params: { limit: 8 } }),
// //           api.get("/api/v1/dashboard/today-people-status"),
// //           api.get("/api/v1/dashboard/action-required"),
// //           api.get("/api/v1/dashboard/recent-hires", { params: { days: 30 } }),
// //           api.get("/api/v1/dashboard/my-team-today"),
// //           api.get("/api/v1/dashboard/attendance-heatmap", { params: { days: 7 } }),
// //         ]);

// //       if (myReqId !== reqIdRef.current) return;

// //       const safe = (res) => (res.status === "fulfilled" ? (res.value?.data ?? res.value) : null);

// //       const sumData = safe(sumRes);
// //       setSummary(sumData);

// //       const trData = safe(trendRes);
// //       setTrend(Array.isArray(trData?.trend) ? trData.trend : []);

// //       const pendData = safe(pendingRes);
// //       setPendingItems(Array.isArray(pendData?.items) ? pendData.items : []);

// //       setPeopleStatus(safe(peopleRes));

// //       const actData = safe(actionsRes);
// //       setActionItems(Array.isArray(actData?.items) ? actData.items : []);

// //       const hireData = safe(hiresRes);
// //       setRecentHires(Array.isArray(hireData?.employees) ? hireData.employees : Array.isArray(hireData?.items) ? hireData.items : []);

// //       setMyTeam(safe(teamRes));

// //       const heatData = safe(heatRes);
// //       setHeatmap(Array.isArray(heatData?.rows) ? heatData.rows : []);

// //       setLastUpdated(Date.now());
// //     } catch (err) {
// //       if (myReqId !== reqIdRef.current) return;
// //       setError(getErrorMessage(err));
// //     } finally {
// //       if (myReqId === reqIdRef.current) setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const t = setTimeout(() => loadDashboard(), 0);
// //     return () => clearTimeout(t);
// //   }, [loadDashboard]);

// //   /* auto-refresh 2 min */
// //   useEffect(() => {
// //     if (!autoRefresh) return;
// //     const t = setInterval(() => loadDashboard({ silent: true }), 120_000);
// //     return () => clearInterval(t);
// //   }, [autoRefresh, loadDashboard]);

// //   /* relative time ticker */
// //   useEffect(() => {
// //     const t = setInterval(() => setTick((x) => x + 1), 10_000);
// //     return () => clearInterval(t);
// //   }, []);

// //   /* ══════════════ DERIVED ══════════════ */
// //   const headcount = summary?.headcount || {};
// //   const att = summary?.attendance_today || {};
// //   const pending = summary?.pending_approvals || {};
// //   const holidays = summary?.upcoming_holidays || [];
// //   const birthdays = summary?.birthdays_this_week || [];
// //   const deptPresent = summary?.department_present_today || [];
// //   const deltas = summary?.deltas || {};

// //   const onLeaveCount = peopleStatus?.on_leave?.count ?? att.on_leave ?? 0;
// //   const absentNoLeaveCount = peopleStatus?.absent_without_leave?.count ?? att.absent ?? 0;
// //   const onLeaveList = peopleStatus?.on_leave?.list || [];
// //   const absentList = peopleStatus?.absent_without_leave?.list || [];

// //   const trendData = useMemo(() => {
// //     return (trend || []).map((row) => {
// //       let day = row.date;
// //       try {
// //         if (row.date) day = new Date(row.date).toLocaleDateString("en-IN", { weekday: "short" });
// //       } catch {}
// //       return {
// //         day,
// //         present: row.present || 0,
// //         absent: row.absent || 0,
// //         leave: row.on_leave || 0,
// //       };
// //     });
// //   }, [trend]);

// //   const presentRate = useMemo(() => {
// //     const p = att.present || 0;
// //     const total =
// //       (att.present || 0) + (att.absent || 0) + (att.on_leave || 0) + (att.half_day || 0);
// //     if (!total) return null;
// //     return Math.round((p / total) * 100);
// //   }, [att]);

// //   const activeStaff = headcount.active || 0;
// //   const presentTotal = (att.present || 0) + (att.wfh || 0) + (att.on_duty || 0);
// //   const attendancePercent = activeStaff
// //     ? Math.round((presentTotal / activeStaff) * 100)
// //     : presentRate ?? 0;

// //   const typeStyle = (type) => {
// //     const t = (type || "").toLowerCase();
// //     if (t === "leave") return "bg-sky-50 text-sky-700 ring-sky-100";
// //     if (t === "regularization") return "bg-violet-50 text-violet-700 ring-violet-100";
// //     return "bg-amber-50 text-amber-700 ring-amber-100";
// //   };

// //   const modalTitle =
// //     listModal === "leave"
// //       ? "On leave today"
// //       : listModal === "absent"
// //       ? "Absent without leave"
// //       : "";

// //   const modalList = listModal === "leave" ? onLeaveList : listModal === "absent" ? absentList : [];

// //   /* ══════════════ PRINT ══════════════ */
// //   const handlePrint = () => {
// //     try { window.print(); } catch {}
// //   };

// //   /* ══════════════ RENDER ══════════════ */
// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-slate-100/80 to-slate-50">
// //       <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
// //         {/* HERO */}
// //         <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
// //           <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E42527]/30 blur-3xl" />
// //           <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

// //           <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //             <div>
// //               <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10">
// //                 <Sun className="h-3.5 w-3.5 text-amber-300" />
// //                 {greeting()}
// //               </div>
// //               <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">HR Overview</h1>
// //               <p className="mt-1 text-sm text-slate-300">
// //                 Live headcount, attendance & who is off today
// //                 {summary?.date ? ` · ${formatDate(summary.date)}` : ""}
// //               </p>
// //               {lastUpdated && (
// //                 <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-400">
// //                   <CircleDot className="h-2.5 w-2.5 text-emerald-400" />
// //                   Updated {relativeTime(lastUpdated)}
// //                 </p>
// //               )}
// //             </div>
// //             <div className="flex flex-wrap items-center gap-2 self-start">
// //               <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15">
// //                 <input
// //                   type="checkbox"
// //                   checked={autoRefresh}
// //                   onChange={(e) => setAutoRefresh(e.target.checked)}
// //                   className="h-3.5 w-3.5 rounded border-white/40 accent-[#E42527]"
// //                 />
// //                 Auto
// //               </label>
// //               <button
// //                 type="button"
// //                 onClick={handlePrint}
// //                 className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
// //               >
// //                 <Printer className="h-4 w-4" />
// //                 Export
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => loadDashboard()}
// //                 disabled={loading}
// //                 className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
// //               >
// //                 <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
// //                 Refresh
// //               </button>
// //             </div>
// //           </div>

// //           {!loading && summary && (
// //             <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
// //               {[
// //                 { label: "Active staff", value: activeStaff, delta: deltas.active },
// //                 { label: "Present now", value: att.present ?? 0, delta: deltas.present },
// //                 { label: "On leave", value: onLeaveCount, delta: deltas.on_leave },
// //                 { label: "Absent", value: absentNoLeaveCount, delta: deltas.absent },
// //               ].map((item) => (
// //                 <div
// //                   key={item.label}
// //                   className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
// //                 >
// //                   <div className="flex items-center justify-between gap-2">
// //                     <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
// //                     {item.delta != null && item.delta !== 0 && (
// //                       <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${item.delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
// //                         {item.delta > 0 ? "▲" : "▼"} {Math.abs(item.delta)}
// //                       </span>
// //                     )}
// //                   </div>
// //                   <p className="mt-1 text-xl font-semibold tabular-nums">{item.value}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* ERROR */}
// //         {error && (
// //           <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //             <div className="flex items-center gap-2">
// //               <AlertCircle className="h-4 w-4 shrink-0" />
// //               <span>{error}</span>
// //             </div>
// //             <button
// //               onClick={() => loadDashboard()}
// //               className="shrink-0 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         )}

// //         {/* QUICK ACTIONS */}
// //         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
// //           <QuickAction icon={Zap} label="Run Payroll" href="/payroll/run" tone="red" />
// //           <QuickAction icon={UserPlus} label="Add Employee" href="/employees/add" tone="green" />
// //           <QuickAction icon={ClipboardList} label="Pending Approvals" href="/approvals" tone="amber" />
// //           <QuickAction icon={Timer} label="My Attendance" href="/attendance/today" tone="blue" />
// //         </div>

// //         {loading && !summary ? (
// //           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
// //             {Array.from({ length: 6 }).map((_, i) => (
// //               <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
// //             ))}
// //           </div>
// //         ) : (
// //           <>
// //             {/* KPI CARDS */}
// //             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
// //               <StatCard
// //                 icon={Users} label="Active" value={activeStaff}
// //                 hint={`Total ${headcount.total ?? 0}`} accent="slate"
// //                 delta={deltas.active}
// //               />
// //               <StatCard
// //                 icon={UserCheck2} label="Present" value={att.present ?? 0}
// //                 hint={`Late ${att.late ?? 0}`} accent="green"
// //                 delta={deltas.present}
// //               />
// //               <StatCard
// //                 icon={CalendarDays} label="On leave" value={onLeaveCount}
// //                 hint="Approved leave today" accent="blue"
// //                 onClick={() => setListModal("leave")}
// //                 delta={deltas.on_leave}
// //               />
// //               <StatCard
// //                 icon={UserX} label="Absent" value={absentNoLeaveCount}
// //                 hint="No punch, no leave" accent="red"
// //                 onClick={() => setListModal("absent")}
// //                 delta={deltas.absent}
// //               />
// //               <StatCard
// //                 icon={ClipboardList} label="Approvals" value={pending.total ?? 0}
// //                 hint={`Leave ${pending.leaves ?? 0}`} accent="amber"
// //               />
// //               <StatCard
// //                 icon={Briefcase} label="New joiners" value={headcount.new_joiners_this_month ?? 0}
// //                 hint="This month" accent="violet"
// //               />
// //             </div>

// //             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
// //               <StatCard icon={Clock} label="WFH today" value={att.wfh ?? 0} accent="blue" />
// //               <StatCard
// //                 icon={AlertTriangle} label="Alerts" value={summary?.unread_alerts ?? 0}
// //                 accent={(summary?.unread_alerts || 0) > 0 ? "amber" : "slate"}
// //               />
// //               <StatCard
// //                 icon={Building2} label="Notice period" value={headcount.notice_period ?? 0}
// //                 accent="slate"
// //               />
// //               <StatCard
// //                 icon={TrendingUp} label="Onboarding" value={summary?.onboarding_candidates ?? 0}
// //                 hint={presentRate != null ? `Present ${presentRate}%` : "Pipeline"} accent="violet"
// //               />
// //             </div>

// //             {/* CHARTS + RING */}
// //             <div className="grid gap-4 lg:grid-cols-12">
// //               <Panel
// //                 className="lg:col-span-6"
// //                 title="Attendance trend"
// //                 subtitle="Last 7 days"
// //               >
// //                 {trendData.length === 0 ? (
// //                   <Empty text="No trend data yet" icon={TrendingUp} />
// //                 ) : (
// //                   <div className="h-72">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <AreaChart data={trendData}>
// //                         <defs>
// //                           <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
// //                             <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
// //                             <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
// //                           </linearGradient>
// //                           <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
// //                             <stop offset="0%" stopColor="#E42527" stopOpacity={0.25} />
// //                             <stop offset="100%" stopColor="#E42527" stopOpacity={0} />
// //                           </linearGradient>
// //                         </defs>
// //                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
// //                         <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
// //                         <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
// //                         <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
// //                         <Area type="monotone" dataKey="present" name="Present" stroke="#10b981" fill="url(#gPresent)" strokeWidth={2.5} />
// //                         <Area type="monotone" dataKey="absent" name="Absent" stroke="#E42527" fill="url(#gAbsent)" strokeWidth={2} />
// //                         <Area type="monotone" dataKey="leave" name="On leave" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
// //                       </AreaChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 )}
// //               </Panel>

// //               <Panel
// //                 className="lg:col-span-3"
// //                 title="Today's rate"
// //                 subtitle="Present + WFH + OD"
// //               >
// //                 <AttendanceRing
// //                   percent={attendancePercent}
// //                   present={presentTotal}
// //                   total={activeStaff}
// //                 />
// //               </Panel>

// //               <Panel
// //                 className="lg:col-span-3"
// //                 title="Dept presence"
// //                 subtitle="In office today"
// //               >
// //                 {deptPresent.length === 0 ? (
// //                   <Empty text="No department data" icon={Building2} />
// //                 ) : (
// //                   <div className="h-[220px]">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <BarChart data={deptPresent} layout="vertical" margin={{ left: 4, right: 8 }}>
// //                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
// //                         <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
// //                         <YAxis type="category" dataKey="department" width={88} tick={{ fontSize: 10, fill: "#64748b" }} />
// //                         <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
// //                         <Bar dataKey="present" fill="#E42527" radius={[0, 8, 8, 0]} barSize={14} />
// //                       </BarChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 )}
// //               </Panel>
// //             </div>

// //             {/* ACTION REQUIRED + RECENT HIRES */}
// //             {(actionItems.length > 0 || recentHires.length > 0) && (
// //               <div className="grid gap-4 lg:grid-cols-2">
// //                 <Panel
// //                   title="Action required"
// //                   subtitle="Needs your attention"
// //                   right={
// //                     <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
// //                       <Sparkles className="h-4 w-4" />
// //                     </div>
// //                   }
// //                 >
// //                   {actionItems.length === 0 ? (
// //                     <Empty text="You're all caught up" icon={Award} />
// //                   ) : (
// //                     <ul className="divide-y divide-slate-100">
// //                       {actionItems.slice(0, 5).map((it, i) => (
// //                         <li key={it.id || i} className="flex items-start gap-3 py-2.5">
// //                           <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
// //                             it.priority === "high"
// //                               ? "bg-red-100 text-red-700"
// //                               : it.priority === "medium"
// //                               ? "bg-amber-100 text-amber-700"
// //                               : "bg-slate-100 text-slate-600"
// //                           }`}>
// //                             {it.priority || "low"}
// //                           </span>
// //                           <div className="min-w-0 flex-1">
// //                             <p className="truncate text-sm font-medium text-slate-900">{it.title}</p>
// //                             {it.description && <p className="text-xs text-slate-500">{it.description}</p>}
// //                           </div>
// //                           {it.href && (
// //                             <Link href={it.href} className="shrink-0 text-xs font-medium text-[#E42527] hover:underline">
// //                               Open →
// //                             </Link>
// //                           )}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   )}
// //                 </Panel>

// //                 <Panel
// //                   title="Recent hires"
// //                   subtitle="Last 30 days"
// //                   right={
// //                     <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
// //                       <UserPlus className="h-4 w-4" />
// //                     </div>
// //                   }
// //                 >
// //                   {recentHires.length === 0 ? (
// //                     <Empty text="No new hires recently" icon={UserPlus} />
// //                   ) : (
// //                     <ul className="divide-y divide-slate-100">
// //                       {recentHires.slice(0, 5).map((h, i) => (
// //                         <li key={h.employee_id || i} className="flex items-center gap-3 py-2.5">
// //                           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
// //                             {(h.name || "E")[0]?.toUpperCase()}
// //                           </div>
// //                           <div className="min-w-0 flex-1">
// //                             <p className="truncate text-sm font-medium text-slate-900">{h.name || h.employee_id}</p>
// //                             <p className="text-xs text-slate-500">
// //                               {h.designation || "—"}{h.joining_date ? ` · Joined ${formatDate(h.joining_date)}` : ""}
// //                             </p>
// //                           </div>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   )}
// //                 </Panel>
// //               </div>
// //             )}

// //             {/* MY TEAM TODAY */}
// //             {myTeam && (
// //               <Panel
// //                 title="My team today"
// //                 subtitle={myTeam.total ? `${myTeam.present || 0} of ${myTeam.total} present` : "Team attendance"}
// //                 right={
// //                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
// //                     <Users className="h-4 w-4" />
// //                   </div>
// //                 }
// //               >
// //                 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
// //                   <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900">
// //                     <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">Present</p>
// //                     <p className="mt-0.5 text-2xl font-bold">{myTeam.present ?? 0}</p>
// //                   </div>
// //                   <div className="rounded-xl bg-red-50 px-4 py-3 text-red-900">
// //                     <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">Absent</p>
// //                     <p className="mt-0.5 text-2xl font-bold">{myTeam.absent ?? 0}</p>
// //                   </div>
// //                   <div className="rounded-xl bg-sky-50 px-4 py-3 text-sky-900">
// //                     <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">On Leave</p>
// //                     <p className="mt-0.5 text-2xl font-bold">{myTeam.on_leave ?? 0}</p>
// //                   </div>
// //                   <div className="rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
// //                     <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">Late</p>
// //                     <p className="mt-0.5 text-2xl font-bold">{myTeam.late ?? 0}</p>
// //                   </div>
// //                 </div>
// //                 {Array.isArray(myTeam.members) && myTeam.members.length > 0 && (
// //                   <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
// //                     {myTeam.members.slice(0, 6).map((m, i) => (
// //                       <div key={m.employee_id || i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
// //                         <div className={`h-2 w-2 rounded-full ${
// //                           m.status === "present" ? "bg-emerald-500"
// //                           : m.status === "absent" ? "bg-red-500"
// //                           : m.status === "on_leave" ? "bg-sky-500"
// //                           : "bg-slate-400"
// //                         }`} />
// //                         <p className="truncate text-xs text-slate-700">{m.name || m.employee_id}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Panel>
// //             )}

// //             {/* QUICK LISTS */}
// //             <div className="grid gap-4 lg:grid-cols-3">
// //               <Panel
// //                 title="On leave today"
// //                 subtitle="Approved leave"
// //                 right={
// //                   <button
// //                     type="button"
// //                     onClick={() => setListModal("leave")}
// //                     className="text-xs font-medium text-[#E42527] hover:underline"
// //                   >
// //                     View all
// //                   </button>
// //                 }
// //               >
// //                 {onLeaveList.length === 0 ? (
// //                   <Empty text="No one on leave today" icon={CalendarDays} />
// //                 ) : (
// //                   <div className="space-y-2">
// //                     {onLeaveList.slice(0, 4).map((row, i) => (
// //                       <div key={row.employee_id || i} className="flex items-center justify-between rounded-xl bg-sky-50/80 px-3 py-2.5">
// //                         <div className="min-w-0">
// //                           <p className="truncate text-sm font-medium text-slate-900">{row.name || row.employee_id}</p>
// //                           <p className="text-xs text-slate-500">
// //                             {row.leave_type || "Leave"}
// //                             {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
// //                             {row.end_date ? ` – ${formatDate(row.end_date)}` : ""}
// //                           </p>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Panel>

// //               <Panel
// //                 title="Absent without leave"
// //                 subtitle="No punch, no approved leave"
// //                 right={
// //                   <button
// //                     type="button"
// //                     onClick={() => setListModal("absent")}
// //                     className="text-xs font-medium text-[#E42527] hover:underline"
// //                   >
// //                     View all
// //                   </button>
// //                 }
// //               >
// //                 {absentList.length === 0 ? (
// //                   <Empty text="No unexplained absents" icon={UserX} />
// //                 ) : (
// //                   <div className="space-y-2">
// //                     {absentList.slice(0, 4).map((row, i) => (
// //                       <div key={row.employee_id || i} className="flex items-center justify-between rounded-xl bg-red-50/80 px-3 py-2.5">
// //                         <div className="min-w-0">
// //                           <p className="truncate text-sm font-medium text-slate-900">{row.name || row.employee_id}</p>
// //                           <p className="text-xs text-slate-500">{row.reason || "Absent"}</p>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Panel>

// //               <Panel title="Pending approvals" subtitle="Needs action">
// //                 {pendingItems.length === 0 ? (
// //                   <Empty text="All clear" icon={Award} />
// //                 ) : (
// //                   <div className="divide-y divide-slate-100">
// //                     {pendingItems.slice(0, 5).map((item, i) => (
// //                       <div key={`${item.type}-${item.id || i}`} className="flex items-center justify-between gap-2 py-2.5">
// //                         <div className="min-w-0">
// //                           <p className="truncate text-sm font-medium text-slate-900">{item.title || "Request"}</p>
// //                           <p className="text-xs text-slate-500">{item.employee_id}</p>
// //                         </div>
// //                         <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${typeStyle(item.type)}`}>
// //                           {(item.type || "").replace(/_/g, " ")}
// //                         </span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Panel>
// //             </div>

// //             {/* HOLIDAYS + BIRTHDAYS */}
// //             <div className="grid gap-4 lg:grid-cols-2">
// //               <Panel
// //                 title="Upcoming holidays"
// //                 subtitle="Next 30 days"
// //                 right={
// //                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
// //                     <CalendarDays className="h-4 w-4" />
// //                   </div>
// //                 }
// //                 className="overflow-hidden"
// //               >
// //                 {holidays.length === 0 ? (
// //                   <Empty text="No holidays upcoming" icon={Sun} />
// //                 ) : (
// //                   <div className="space-y-2.5">
// //                     {holidays.map((h, i) => {
// //                       const date = calendarParts(h.date);
// //                       return (
// //                         <div key={h.holiday_id || i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 transition hover:border-amber-200 hover:bg-amber-50/40">
// //                           <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm ring-1 ring-amber-100">
// //                             <span className="text-[10px] font-bold uppercase">{date.month}</span>
// //                             <span className="text-lg font-bold leading-4">{date.day}</span>
// //                           </div>
// //                           <div className="min-w-0 flex-1">
// //                             <p className="truncate text-sm font-semibold text-slate-900">{h.name || h.holiday_name}</p>
// //                             <p className="mt-0.5 text-xs text-slate-500">{formatDate(h.date)}</p>
// //                           </div>
// //                           <Sun className="h-4 w-4 shrink-0 text-amber-400" />
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //               </Panel>

// //               <Panel
// //                 title="Birthdays this week"
// //                 subtitle="Next 7 days"
// //                 right={
// //                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
// //                     <Cake className="h-4 w-4" />
// //                   </div>
// //                 }
// //                 className="overflow-hidden"
// //               >
// //                 {birthdays.length === 0 ? (
// //                   <Empty text="No birthdays this week" icon={Cake} />
// //                 ) : (
// //                   <div className="space-y-2.5">
// //                     {birthdays.map((b, i) => (
// //                       <div key={b.employee_id || i} className="flex items-center gap-3 rounded-xl border border-rose-100/80 bg-rose-50/50 px-3 py-2.5 transition hover:border-rose-200 hover:bg-rose-50">
// //                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white shadow-sm shadow-red-200">
// //                           {(b.name || "E")[0]?.toUpperCase()}
// //                         </div>
// //                         <div className="min-w-0 flex-1">
// //                           <p className="truncate text-sm font-semibold text-slate-900">{b.name || b.employee_id}</p>
// //                           <p className="mt-0.5 text-xs text-slate-500">{formatDate(b.birthday_on || b.dob)}</p>
// //                         </div>
// //                         <Cake className="h-4 w-4 shrink-0 text-[#E42527]" />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Panel>
// //             </div>
// //           </>
// //         )}
// //       </div>

// //       {/* MODAL: on leave / absent list */}
// //       {listModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //           <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
// //             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //               <div>
// //                 <h3 className="text-lg font-semibold text-slate-900">{modalTitle}</h3>
// //                 <p className="text-xs text-slate-500">
// //                   {formatDate(peopleStatus?.date || summary?.date)} · {modalList.length} people
// //                 </p>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={() => setListModal(null)}
// //                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>
// //             <div className="flex-1 overflow-y-auto px-5 py-3">
// //               {modalList.length === 0 ? (
// //                 <Empty text="No one in this list" />
// //               ) : (
// //                 <ul className="divide-y divide-slate-100">
// //                   {modalList.map((row, i) => (
// //                     <li key={row.employee_id || i} className="py-3">
// //                       <p className="text-sm font-semibold text-slate-900">{row.name || row.employee_id}</p>
// //                       <p className="text-xs text-slate-500">{row.employee_id}</p>
// //                       {listModal === "leave" ? (
// //                         <p className="mt-1 text-xs text-sky-700">
// //                           {row.leave_type || "Leave"}
// //                           {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
// //                           {row.end_date ? ` → ${formatDate(row.end_date)}` : ""}
// //                         </p>
// //                       ) : (
// //                         <p className="mt-1 text-xs text-red-600">
// //                           {row.reason || "Absent without approved leave"}
// //                         </p>
// //                       )}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               )}
// //             </div>
// //             <div className="border-t border-slate-100 px-5 py-3">
// //               <button
// //                 type="button"
// //                 onClick={() => setListModal(null)}
// //                 className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// /**
//  * HRMS Dashboard — Production Ready (Zoho / greytHR / HROne level)
//  * ==================================================================
//  *  COMPLETE FEATURE LIST:
//  *  ✓ Hero with greeting, live ticker, deltas, print
//  *  ✓ Quick actions bar
//  *  ✓ Personal: My Attendance Today
//  *  ✓ Personal: My Leave Balance
//  *  ✓ Announcements / Notice Board
//  *  ✓ Upcoming Events (week view)
//  *  ✓ Department Headcount Pie
//  *  ✓ KPI Cards (10 total, delta indicators)
//  *  ✓ Attendance Trend (Area chart)
//  *  ✓ Attendance Rate Ring (Radial)
//  *  ✓ Department Presence Bar
//  *  ✓ Working Hours Average
//  *  ✓ Payroll Status Card
//  *  ✓ Attrition / Turnover KPI
//  *  ✓ Document Expiry Alerts
//  *  ✓ Recruitment Pipeline
//  *  ✓ My Team Today (managers)
//  *  ✓ Action Required
//  *  ✓ Recent Hires
//  *  ✓ On Leave / Absent lists + modals
//  *  ✓ Pending Approvals
//  *  ✓ Upcoming Holidays
//  *  ✓ Birthdays this week
//  *  ✓ Auto-refresh (2 min)
//  *  ✓ Role-aware + graceful fallbacks
//  *  ✓ Mobile responsive
//  *  ✓ Error retry
//  *  ✓ Empty states with icons
//  */

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import {
//   Users, UserCheck2, UserX, CalendarDays, Clock, AlertTriangle,
//   Building2, Briefcase, ClipboardList, Cake, RefreshCw, TrendingUp,
//   TrendingDown, Sun, X, Printer, Zap, CircleDot, Award, Bell,
//   ChevronRight, Sparkles, AlertCircle, UserPlus, Timer, Wallet,
//   FileText, Target, Activity, Heart, Coffee, Moon, BadgeCheck,
//   ArrowUpRight, ArrowDownRight, Megaphone, GraduationCap, Info,
// } from "lucide-react";
// import {
//   ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
//   Tooltip, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
//   PieChart, Pie, Cell, Legend, LineChart, Line,
// } from "recharts";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const AUTO_REFRESH_MS = 120_000;
// const RELATIVE_TICK_MS = 10_000;
// const DEPT_COLORS = [
//   "#E42527", "#10b981", "#6366f1", "#f59e0b",
//   "#0ea5e9", "#8b5cf6", "#ec4899", "#14b8a6",
//   "#f97316", "#84cc16",
// ];

// /* ══════════════════════════════════════════════════════════
//    HELPERS
//    ══════════════════════════════════════════════════════════ */

// function getErrorMessage(err) {
//   const d = err?.response?.data?.detail;
//   if (Array.isArray(d)) return d.map((i) => i?.msg || "Error").join(", ");
//   if (typeof d === "string") return d;
//   if (d && typeof d === "object") return d.msg || d.message || "Request failed";
//   return err?.message || "Something went wrong";
// }

// function formatDate(value) {
//   if (!value) return "—";
//   try {
//     if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
//       const [y, m, d] = value.split("-").map(Number);
//       return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
//         day: "2-digit", month: "short", year: "numeric",
//       });
//     }
//     return new Date(value).toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });
//   } catch {
//     return String(value);
//   }
// }

// function formatTime(value, tz = "Asia/Kolkata") {
//   if (!value) return "—";
//   try {
//     return new Date(value).toLocaleTimeString("en-IN", {
//       hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz,
//     });
//   } catch {
//     return "—";
//   }
// }

// function calendarParts(value) {
//   if (!value) return { day: "--", month: "", weekday: "" };
//   try {
//     const date = new Date(
//       typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
//         ? `${value}T00:00:00`
//         : value
//     );
//     return {
//       day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
//       month: date.toLocaleDateString("en-IN", { month: "short" }),
//       weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
//     };
//   } catch {
//     return { day: "--", month: "", weekday: "" };
//   }
// }

// function greeting() {
//   const h = new Date().getHours();
//   if (h < 12) return "Good morning";
//   if (h < 17) return "Good afternoon";
//   return "Good evening";
// }

// function relativeTime(ts) {
//   if (!ts) return "";
//   const diff = Math.floor((Date.now() - ts) / 1000);
//   if (diff < 5) return "just now";
//   if (diff < 60) return `${diff}s ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   return `${Math.floor(diff / 86400)}d ago`;
// }

// function minutesToHhMm(m) {
//   if (!m) return "0h 0m";
//   const n = Number(m);
//   if (Number.isNaN(n)) return "0h 0m";
//   return `${Math.floor(n / 60)}h ${n % 60}m`;
// }

// /* ══════════════════════════════════════════════════════════
//    PRIMITIVE COMPONENTS
//    ══════════════════════════════════════════════════════════ */

// function StatCard({ icon: Icon, label, value, hint, accent, onClick, delta, href }) {
//   const accents = {
//     red: "from-[#E42527]/10 to-white border-[#E42527]/20 text-[#E42527]",
//     green: "from-emerald-50 to-white border-emerald-100 text-emerald-600",
//     amber: "from-amber-50 to-white border-amber-100 text-amber-600",
//     blue: "from-sky-50 to-white border-sky-100 text-sky-600",
//     slate: "from-slate-50 to-white border-slate-200 text-slate-700",
//     violet: "from-violet-50 to-white border-violet-100 text-violet-600",
//     rose: "from-rose-50 to-white border-rose-100 text-rose-600",
//   };
//   const a = accents[accent] || accents.slate;

//   const inner = (
//     <>
//       <div className="flex items-start justify-between">
//         <div className="min-w-0 flex-1">
//           <div className="flex items-center gap-2">
//             <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//               {label}
//             </p>
//             {delta != null && (
//               <span
//                 className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
//                   delta > 0
//                     ? "bg-emerald-50 text-emerald-700"
//                     : delta < 0
//                     ? "bg-red-50 text-red-700"
//                     : "bg-slate-50 text-slate-600"
//                 }`}
//               >
//                 {delta > 0 ? (
//                   <TrendingUp className="h-3 w-3" />
//                 ) : delta < 0 ? (
//                   <TrendingDown className="h-3 w-3" />
//                 ) : null}
//                 {delta > 0 ? `+${delta}` : delta === 0 ? "—" : delta}
//               </span>
//             )}
//           </div>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
//             {value ?? 0}
//           </p>
//           {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
//           {onClick || href ? (
//             <p className="mt-2 text-[11px] font-medium text-slate-400">
//               Click to view →
//             </p>
//           ) : null}
//         </div>
//         <div className="rounded-xl bg-white/80 p-2.5 shadow-sm ring-1 ring-black/5">
//           <Icon className="h-5 w-5 opacity-80" />
//         </div>
//       </div>
//     </>
//   );

//   const baseClass = `relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm transition ${a}`;

//   if (href) {
//     return (
//       <Link
//         href={href}
//         className={`${baseClass} cursor-pointer hover:shadow-md hover:scale-[1.01]`}
//       >
//         {inner}
//       </Link>
//     );
//   }

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={!onClick}
//       className={`${baseClass} ${
//         onClick
//           ? "cursor-pointer hover:shadow-md hover:scale-[1.01]"
//           : "cursor-default"
//       }`}
//     >
//       {inner}
//     </button>
//   );
// }

// function Panel({ title, subtitle, right, children, className = "" }) {
//   return (
//     <div
//       className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
//     >
//       <div className="mb-4 flex items-start justify-between gap-3">
//         <div>
//           <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
//           {subtitle ? (
//             <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
//           ) : null}
//         </div>
//         {right}
//       </div>
//       {children}
//     </div>
//   );
// }

// function Empty({ text, icon: Icon, action }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
//       {Icon && (
//         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
//           <Icon className="h-6 w-6" />
//         </div>
//       )}
//       <p className="text-sm text-slate-500">{text}</p>
//       {action}
//     </div>
//   );
// }

// function QuickAction({ icon: Icon, label, href, tone = "slate" }) {
//   const tones = {
//     red: "bg-red-50 text-red-700 hover:bg-red-100 ring-red-100",
//     green: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-emerald-100",
//     amber: "bg-amber-50 text-amber-700 hover:bg-amber-100 ring-amber-100",
//     blue: "bg-sky-50 text-sky-700 hover:bg-sky-100 ring-sky-100",
//     violet: "bg-violet-50 text-violet-700 hover:bg-violet-100 ring-violet-100",
//     slate: "bg-slate-50 text-slate-700 hover:bg-slate-100 ring-slate-200",
//   };
//   const t = tones[tone] || tones.slate;
//   return (
//     <Link
//       href={href}
//       className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ring-1 transition ${t}`}
//     >
//       <Icon className="h-4 w-4 shrink-0" />
//       <span className="truncate">{label}</span>
//       <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
//     </Link>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    PERSONAL PANELS
//    ══════════════════════════════════════════════════════════ */

// function MyAttendanceToday({ data, tz, loading }) {
//   if (loading) {
//     return (
//       <Panel title="Your day" subtitle="Loading...">
//         <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
//       </Panel>
//     );
//   }
//   if (!data) {
//     return (
//       <Panel title="Your day" subtitle="Today's punch status">
//         <Empty text="No punch record yet" icon={Timer} />
//       </Panel>
//     );
//   }

//   const firstIn = data.first_punch_in ? new Date(data.first_punch_in) : null;
//   const lastOut = data.last_punch_out ? new Date(data.last_punch_out) : null;
//   const isPunchedIn = firstIn && !lastOut;
//   const workMinutes = data.total_work_minutes || 0;

//   const fmt = (d) =>
//     d
//       ? d.toLocaleTimeString("en-IN", {
//           hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz,
//         })
//       : "—";

//   return (
//     <Panel
//       title="Your day"
//       subtitle="Today's punch status"
//       right={
//         <div
//           className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${
//             isPunchedIn
//               ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
//               : "bg-slate-100 text-slate-500 ring-slate-200"
//           }`}
//         >
//           <Timer className="h-4 w-4" />
//         </div>
//       }
//     >
//       <div className="space-y-3">
//         <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
//           <span className="text-xs font-medium text-slate-500">Status</span>
//           <span
//             className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
//               isPunchedIn
//                 ? "bg-emerald-100 text-emerald-700"
//                 : lastOut
//                 ? "bg-green-100 text-green-700"
//                 : "bg-amber-100 text-amber-700"
//             }`}
//           >
//             <span
//               className={`h-1.5 w-1.5 rounded-full ${
//                 isPunchedIn
//                   ? "bg-emerald-500 animate-pulse"
//                   : lastOut
//                   ? "bg-green-500"
//                   : "bg-amber-500"
//               }`}
//             />
//             {isPunchedIn ? "Punched in" : lastOut ? "Completed" : "Not punched"}
//           </span>
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <div className="rounded-xl bg-slate-50 px-3 py-2.5">
//             <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
//               Punch in
//             </p>
//             <p className="mt-0.5 text-sm font-semibold text-slate-900">
//               {fmt(firstIn)}
//             </p>
//           </div>
//           <div className="rounded-xl bg-slate-50 px-3 py-2.5">
//             <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
//               Punch out
//             </p>
//             <p className="mt-0.5 text-sm font-semibold text-slate-900">
//               {fmt(lastOut)}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2.5">
//           <span className="text-xs font-medium text-blue-700">Work so far</span>
//           <span className="text-sm font-bold text-blue-900 tabular-nums">
//             {minutesToHhMm(workMinutes)}
//           </span>
//         </div>

//         {data.is_late && (
//           <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs text-orange-700">
//             <AlertTriangle className="h-3.5 w-3.5" />
//             Late by {data.late_minutes || 0} min
//           </div>
//         )}

//         <Link
//           href="/attendance/today"
//           className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
//         >
//           <Clock className="h-4 w-4" />
//           {isPunchedIn
//             ? "Punch Out"
//             : lastOut
//             ? "View details"
//             : "Punch In"}
//         </Link>
//       </div>
//     </Panel>
//   );
// }

// function MyLeaveBalance({ balances, loading }) {
//   if (loading) {
//     return (
//       <Panel title="Your leave balance" subtitle="Loading...">
//         <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
//       </Panel>
//     );
//   }

//   if (!balances || balances.length === 0) {
//     return (
//       <Panel title="Your leave balance" subtitle="Leave summary">
//         <Empty text="No leave balance yet" icon={CalendarDays} />
//       </Panel>
//     );
//   }

//   const totalAvailable = balances.reduce(
//     (s, b) => s + (Number(b.leaves_remaining) || 0),
//     0
//   );

//   const color = (used, total) => {
//     const pct = total ? used / total : 0;
//     if (pct > 0.8) return "bg-red-500";
//     if (pct > 0.5) return "bg-amber-500";
//     return "bg-emerald-500";
//   };

//   return (
//     <Panel
//       title="Your leave balance"
//       subtitle={`${totalAvailable.toFixed(1)} days available`}
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
//           <CalendarDays className="h-4 w-4" />
//         </div>
//       }
//     >
//       <div className="space-y-3">
//         {balances.slice(0, 4).map((b, i) => {
//           const used = Number(b.leaves_taken) || 0;
//           const total = Number(b.total_leaves) || 0;
//           const remaining = Number(b.leaves_remaining) || 0;
//           const usedPct = total ? Math.min(100, (used / total) * 100) : 0;

//           return (
//             <div key={b.balance_id || i}>
//               <div className="mb-1 flex items-center justify-between text-xs">
//                 <span className="font-medium text-slate-700">
//                   {b.leave_type_name || b.leave_type_code || "Leave"}
//                 </span>
//                 <span className="text-slate-500 tabular-nums">
//                   <span className="font-semibold text-slate-900">
//                     {remaining}
//                   </span>
//                   <span className="text-slate-400"> / {total}</span>
//                 </span>
//               </div>
//               <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//                 <div
//                   className={`h-full rounded-full transition-all ${color(
//                     used,
//                     total
//                   )}`}
//                   style={{ width: `${usedPct}%` }}
//                 />
//               </div>
//             </div>
//           );
//         })}

//         <Link
//           href="/leave/my-balance"
//           className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
//         >
//           View full balance
//           <ChevronRight className="h-3.5 w-3.5" />
//         </Link>
//       </div>
//     </Panel>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    ANNOUNCEMENTS + EVENTS
//    ══════════════════════════════════════════════════════════ */

// function AnnouncementsPanel({ announcements, loading }) {
//   const priorityStyles = {
//     high: "border-l-red-500 bg-red-50/50",
//     normal: "border-l-sky-500 bg-sky-50/50",
//     low: "border-l-slate-300 bg-slate-50",
//   };

//   return (
//     <Panel
//       title="Announcements"
//       subtitle="Company updates"
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
//           <Megaphone className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="space-y-2">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
//           ))}
//         </div>
//       ) : !announcements || announcements.length === 0 ? (
//         <Empty text="No announcements" icon={Bell} />
//       ) : (
//         <div className="space-y-2.5">
//           {announcements.slice(0, 4).map((a, i) => (
//             <div
//               key={a.id || i}
//               className={`rounded-lg border-l-4 px-3 py-2.5 ${
//                 priorityStyles[a.priority] || priorityStyles.normal
//               }`}
//             >
//               <p className="text-sm font-semibold text-slate-900">{a.title}</p>
//               {a.body && (
//                 <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
//                   {a.body}
//                 </p>
//               )}
//               <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
//                 <span>{a.posted_by || "HR"}</span>
//                 <span>·</span>
//                 <span>{relativeTime(a.posted_at)}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </Panel>
//   );
// }

// function UpcomingEventsPanel({ events, loading }) {
//   const eventIcons = {
//     meeting: "👥",
//     training: "📚",
//     birthday: "🎂",
//     holiday: "🎉",
//     townhall: "🎤",
//     lunch: "🍽",
//     default: "📅",
//   };

//   return (
//     <Panel
//       title="This week"
//       subtitle={events?.length ? `${events.length} events` : "Events & reminders"}
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
//           <CalendarDays className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="space-y-2">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
//           ))}
//         </div>
//       ) : !events || events.length === 0 ? (
//         <Empty text="No events scheduled" icon={CalendarDays} />
//       ) : (
//         <div className="space-y-2">
//           {events.slice(0, 5).map((e, i) => {
//             const date = calendarParts(e.date);
//             return (
//               <div
//                 key={e.id || i}
//                 className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 transition hover:bg-slate-100"
//               >
//                 <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
//                   <span className="text-[9px] font-bold uppercase text-slate-500">
//                     {date.weekday}
//                   </span>
//                   <span className="text-sm font-bold leading-4">
//                     {date.day}
//                   </span>
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-slate-900">
//                     {eventIcons[e.type] || eventIcons.default} {e.title}
//                   </p>
//                   {e.time && (
//                     <p className="text-[11px] text-slate-500">{e.time}</p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </Panel>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    CHARTS
//    ══════════════════════════════════════════════════════════ */

// function AttendanceRing({ percent, present, total }) {
//   const pct = Math.max(0, Math.min(100, percent ?? 0));
//   const data = [
//     {
//       name: "rate",
//       value: pct,
//       fill: pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#E42527",
//     },
//   ];

//   return (
//     <div className="relative flex h-[200px] w-full items-center justify-center">
//       <ResponsiveContainer width="100%" height="100%">
//         <RadialBarChart
//           cx="50%"
//           cy="50%"
//           innerRadius="72%"
//           outerRadius="100%"
//           startAngle={90}
//           endAngle={-270}
//           data={data}
//         >
//           <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
//           <RadialBar
//             dataKey="value"
//             cornerRadius={12}
//             background={{ fill: "#f1f5f9" }}
//           />
//         </RadialBarChart>
//       </ResponsiveContainer>
//       <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
//         <p className="text-4xl font-bold text-slate-900 tabular-nums">{pct}%</p>
//         <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
//           Attendance
//         </p>
//         {present != null && total != null && (
//           <p className="mt-0.5 text-xs text-slate-500">
//             {present} of {total}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// function DepartmentHeadcountPie({ data, loading }) {
//   return (
//     <Panel
//       title="Headcount by department"
//       subtitle={
//         data?.length
//           ? `${data.reduce((s, d) => s + (d.count || 0), 0)} employees`
//           : "Distribution"
//       }
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
//           <Building2 className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="h-[220px] animate-pulse rounded-xl bg-slate-100" />
//       ) : !data || data.length === 0 ? (
//         <Empty text="No department data" icon={Building2} />
//       ) : (
//         <div className="h-[240px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={50}
//                 outerRadius={80}
//                 paddingAngle={2}
//                 dataKey="count"
//                 nameKey="department"
//               >
//                 {data.map((_, i) => (
//                   <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{
//                   borderRadius: 12,
//                   border: "1px solid #e2e8f0",
//                   fontSize: 12,
//                 }}
//                 formatter={(v) => [`${v} employees`, ""]}
//               />
//               <Legend
//                 iconType="circle"
//                 wrapperStyle={{ fontSize: 11 }}
//                 formatter={(value, entry) =>
//                   `${value} (${entry?.payload?.count || 0})`
//                 }
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </Panel>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    PRODUCTION PANELS
//    ══════════════════════════════════════════════════════════ */

// function PayrollStatusCard({ data, loading }) {
//   const statusMap = {
//     processed: { label: "Processed", tone: "bg-blue-50 text-blue-700" },
//     approved: { label: "Approved", tone: "bg-violet-50 text-violet-700" },
//     paid: { label: "Paid", tone: "bg-emerald-50 text-emerald-700" },
//     pending: { label: "Pending", tone: "bg-amber-50 text-amber-700" },
//     draft: { label: "Draft", tone: "bg-slate-100 text-slate-600" },
//     failed: { label: "Failed", tone: "bg-red-50 text-red-700" },
//   };

//   const status = statusMap[data?.status] || statusMap.draft;

//   return (
//     <Panel
//       title="Payroll status"
//       subtitle="Current cycle"
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
//           <Wallet className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
//       ) : !data ? (
//         <Empty text="No payroll data" icon={Wallet} />
//       ) : (
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="text-xs text-slate-500">
//               {data.period || "Current month"}
//             </span>
//             <span
//               className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.tone}`}
//             >
//               {status.label}
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div className="rounded-xl bg-slate-50 px-3 py-2.5">
//               <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
//                 Net pay
//               </p>
//               <p className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums">
//                 ₹{Number(data.total_net_pay || 0).toLocaleString("en-IN")}
//               </p>
//             </div>
//             <div className="rounded-xl bg-slate-50 px-3 py-2.5">
//               <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
//                 Employees
//               </p>
//               <p className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums">
//                 {data.total_employees || 0}
//               </p>
//             </div>
//           </div>

//           <Link
//             href="/payroll/run"
//             className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
//           >
//             Open payroll
//             <ChevronRight className="h-3.5 w-3.5" />
//           </Link>
//         </div>
//       )}
//     </Panel>
//   );
// }

// function DocumentExpiryCard({ docs, loading }) {
//   const urgencyStyles = {
//     critical: "border-l-red-500 bg-red-50/50",
//     warning: "border-l-amber-500 bg-amber-50/50",
//     normal: "border-l-sky-500 bg-sky-50/50",
//   };

//   return (
//     <Panel
//       title="Document expiries"
//       subtitle="Next 30 days"
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
//           <FileText className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
//       ) : !docs || docs.length === 0 ? (
//         <Empty text="No upcoming expiries" icon={FileText} />
//       ) : (
//         <div className="space-y-2">
//           {docs.slice(0, 4).map((d, i) => {
//             const daysLeft = d.days_left ?? 0;
//             const urgency =
//               daysLeft <= 7 ? "critical" : daysLeft <= 15 ? "warning" : "normal";
//             return (
//               <div
//                 key={d.id || i}
//                 className={`rounded-lg border-l-4 px-3 py-2 ${
//                   urgencyStyles[urgency]
//                 }`}
//               >
//                 <div className="flex items-start justify-between gap-2">
//                   <div className="min-w-0">
//                     <p className="truncate text-xs font-semibold text-slate-900">
//                       {d.document_type || "Document"} · {d.employee_name || "—"}
//                     </p>
//                     <p className="mt-0.5 text-[11px] text-slate-500">
//                       Expires {formatDate(d.expiry_date)}
//                     </p>
//                   </div>
//                   <span
//                     className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
//                       urgency === "critical"
//                         ? "bg-red-100 text-red-700"
//                         : urgency === "warning"
//                         ? "bg-amber-100 text-amber-700"
//                         : "bg-sky-100 text-sky-700"
//                     }`}
//                   >
//                     {daysLeft}d
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </Panel>
//   );
// }

// function RecruitmentPipelineCard({ data, loading }) {
//   return (
//     <Panel
//       title="Recruitment pipeline"
//       subtitle="Open roles & candidates"
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
//           <Target className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
//       ) : !data ? (
//         <Empty text="No recruitment data" icon={Target} />
//       ) : (
//         <div className="space-y-3">
//           <div className="grid grid-cols-2 gap-2">
//             <div className="rounded-xl bg-violet-50 px-3 py-2.5">
//               <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">
//                 Open roles
//               </p>
//               <p className="mt-0.5 text-2xl font-bold text-violet-900 tabular-nums">
//                 {data.open_positions || 0}
//               </p>
//             </div>
//             <div className="rounded-xl bg-sky-50 px-3 py-2.5">
//               <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-700">
//                 Candidates
//               </p>
//               <p className="mt-0.5 text-2xl font-bold text-sky-900 tabular-nums">
//                 {data.in_pipeline || 0}
//               </p>
//             </div>
//           </div>
//           <div className="space-y-1.5">
//             {(data.stages || []).slice(0, 4).map((s, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs"
//               >
//                 <span className="text-slate-600">{s.name}</span>
//                 <span className="font-semibold text-slate-900">
//                   {s.count}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </Panel>
//   );
// }

// function WorkingHoursCard({ data, loading }) {
//   return (
//     <Panel
//       title="Avg working hours"
//       subtitle="This week"
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
//           <Clock className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
//       ) : !data ? (
//         <Empty text="No data" icon={Clock} />
//       ) : (
//         <div className="space-y-3">
//           <div>
//             <p className="text-3xl font-bold text-slate-900 tabular-nums">
//               {data.avg_hours || "0h 0m"}
//             </p>
//             <p className="mt-0.5 text-xs text-slate-500">
//               Daily average this week
//             </p>
//           </div>
//           <div className="grid grid-cols-3 gap-2">
//             <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
//               <p className="text-[10px] uppercase text-slate-500">Min</p>
//               <p className="text-xs font-bold text-slate-900">{data.min || "—"}</p>
//             </div>
//             <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
//               <p className="text-[10px] uppercase text-slate-500">Max</p>
//               <p className="text-xs font-bold text-slate-900">{data.max || "—"}</p>
//             </div>
//             <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
//               <p className="text-[10px] uppercase text-slate-500">Total</p>
//               <p className="text-xs font-bold text-slate-900">{data.total || "—"}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </Panel>
//   );
// }

// function AttritionCard({ data, loading }) {
//   return (
//     <Panel
//       title="Attrition"
//       subtitle="This month"
//       right={
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
//           <Activity className="h-4 w-4" />
//         </div>
//       }
//     >
//       {loading ? (
//         <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
//       ) : !data ? (
//         <Empty text="No attrition data" icon={Activity} />
//       ) : (
//         <div className="space-y-3">
//           <div className="flex items-baseline gap-2">
//             <p className="text-3xl font-bold text-red-600 tabular-nums">
//               {data.rate || 0}%
//             </p>
//             {data.delta != null && data.delta !== 0 && (
//               <span
//                 className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
//                   data.delta > 0
//                     ? "bg-red-100 text-red-700"
//                     : "bg-emerald-100 text-emerald-700"
//                 }`}
//               >
//                 {data.delta > 0 ? (
//                   <ArrowUpRight className="h-3 w-3" />
//                 ) : (
//                   <ArrowDownRight className="h-3 w-3" />
//                 )}
//                 {Math.abs(data.delta)}%
//               </span>
//             )}
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="rounded-lg bg-slate-50 px-3 py-2">
//               <p className="text-[10px] uppercase text-slate-500">Exits</p>
//               <p className="text-sm font-bold text-slate-900">
//                 {data.exits || 0}
//               </p>
//             </div>
//             <div className="rounded-lg bg-slate-50 px-3 py-2">
//               <p className="text-[10px] uppercase text-slate-500">Avg tenure</p>
//               <p className="text-sm font-bold text-slate-900">
//                 {data.avg_tenure || "—"}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </Panel>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function HrmsDashboardPage() {
//   const user = useAuthStore((s) => s.user);
//   const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";
//   const role = String(user?.role?.value || user?.role || "").toLowerCase();
//   const isAdmin = role === "admin" || role === "approle.admin";

//   /* data */
//   const [summary, setSummary] = useState(null);
//   const [trend, setTrend] = useState([]);
//   const [pendingItems, setPendingItems] = useState([]);
//   const [peopleStatus, setPeopleStatus] = useState(null);
//   const [actionItems, setActionItems] = useState([]);
//   const [recentHires, setRecentHires] = useState([]);
//   const [myTeam, setMyTeam] = useState(null);
//   const [myToday, setMyToday] = useState(null);
//   const [myBalances, setMyBalances] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [deptHeadcount, setDeptHeadcount] = useState([]);
//   const [payroll, setPayroll] = useState(null);
//   const [docExpiries, setDocExpiries] = useState([]);
//   const [recruitment, setRecruitment] = useState(null);
//   const [workingHours, setWorkingHours] = useState(null);
//   const [attrition, setAttrition] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   /* ui */
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [listModal, setListModal] = useState(null);
//   const [, setTick] = useState(0);

//   const reqIdRef = useRef(0);

//   /* ══════════════ LOAD ══════════════ */
//   const loadDashboard = useCallback(
//     async ({ silent = false } = {}) => {
//       const myReqId = ++reqIdRef.current;
//       if (!silent) setLoading(true);
//       if (!silent) setError("");

//       try {
//         const results = await Promise.allSettled([
//           api.get("/api/v1/dashboard/summary"),
//           api.get("/api/v1/dashboard/attendance-trend", { params: { days: 7 } }),
//           api.get("/api/v1/dashboard/pending-approvals", { params: { limit: 8 } }),
//           api.get("/api/v1/dashboard/today-people-status"),
//           api.get("/api/v1/dashboard/action-required"),
//           api.get("/api/v1/dashboard/recent-hires", { params: { days: 30 } }),
//           api.get("/api/v1/dashboard/my-team-today"),
//           api.get("/api/v1/dashboard/my-today"),
//           api.get("/api/v1/dashboard/my-leave-balance"),
//           api.get("/api/v1/dashboard/announcements", { params: { limit: 5 } }),
//           api.get("/api/v1/dashboard/upcoming-events", { params: { days: 7 } }),
//           api.get("/api/v1/dashboard/dept-headcount"),
//           api.get("/api/v1/dashboard/payroll-status"),
//           api.get("/api/v1/dashboard/document-expiries", { params: { days: 30 } }),
//           api.get("/api/v1/dashboard/recruitment-pipeline"),
//           api.get("/api/v1/dashboard/working-hours-avg"),
//           api.get("/api/v1/dashboard/attrition"),
//         ]);

//         if (myReqId !== reqIdRef.current) return;

//         const safe = (r) =>
//           r.status === "fulfilled" ? r.value?.data ?? r.value : null;

//         const [sumR, trendR, pendR, peopleR, actionsR, hiresR, teamR,
//           myTodayR, myBalR, annR, eventsR, deptR, payrollR, docsR,
//           recruitR, hoursR, attrR] = results;

//         setSummary(safe(sumR));

//         const tr = safe(trendR);
//         setTrend(Array.isArray(tr?.trend) ? tr.trend : []);

//         const pe = safe(pendR);
//         setPendingItems(Array.isArray(pe?.items) ? pe.items : []);

//         setPeopleStatus(safe(peopleR));

//         const a = safe(actionsR);
//         setActionItems(Array.isArray(a?.items) ? a.items : []);

//         const h = safe(hiresR);
//         setRecentHires(
//           Array.isArray(h?.employees) ? h.employees : Array.isArray(h?.items) ? h.items : []
//         );

//         setMyTeam(safe(teamR));
//         setMyToday(safe(myTodayR));

//         const mb = safe(myBalR);
//         setMyBalances(Array.isArray(mb?.balances) ? mb.balances : []);

//         const an = safe(annR);
//         setAnnouncements(Array.isArray(an?.announcements) ? an.announcements : []);

//         const ev = safe(eventsR);
//         setEvents(Array.isArray(ev?.events) ? ev.events : []);

//         const de = safe(deptR);
//         setDeptHeadcount(
//           Array.isArray(de?.departments) ? de.departments : Array.isArray(de) ? de : []
//         );

//         setPayroll(safe(payrollR));

//         const docs = safe(docsR);
//         setDocExpiries(Array.isArray(docs?.documents) ? docs.documents : []);

//         setRecruitment(safe(recruitR));
//         setWorkingHours(safe(hoursR));
//         setAttrition(safe(attrR));

//         setLastUpdated(Date.now());
//       } catch (err) {
//         if (myReqId !== reqIdRef.current) return;
//         setError(getErrorMessage(err));
//       } finally {
//         if (myReqId === reqIdRef.current) setLoading(false);
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     const t = setTimeout(() => loadDashboard(), 0);
//     return () => clearTimeout(t);
//   }, [loadDashboard]);

//   /* auto-refresh */
//   useEffect(() => {
//     if (!autoRefresh) return;
//     const t = setInterval(() => loadDashboard({ silent: true }), AUTO_REFRESH_MS);
//     return () => clearInterval(t);
//   }, [autoRefresh, loadDashboard]);

//   /* relative time ticker */
//   useEffect(() => {
//     const t = setInterval(() => setTick((x) => x + 1), RELATIVE_TICK_MS);
//     return () => clearInterval(t);
//   }, []);

//   /* ══════════════ DERIVED ══════════════ */
//   const headcount = summary?.headcount || {};
//   const att = summary?.attendance_today || {};
//   const pending = summary?.pending_approvals || {};
//   const holidays = summary?.upcoming_holidays || [];
//   const birthdays = summary?.birthdays_this_week || [];
//   const deptPresent = summary?.department_present_today || [];
//   const deltas = summary?.deltas || {};

//   const onLeaveCount = peopleStatus?.on_leave?.count ?? att.on_leave ?? 0;
//   const absentNoLeaveCount =
//     peopleStatus?.absent_without_leave?.count ?? att.absent ?? 0;
//   const onLeaveList = peopleStatus?.on_leave?.list || [];
//   const absentList = peopleStatus?.absent_without_leave?.list || [];

//   const trendData = useMemo(() => {
//     return (trend || []).map((row) => {
//       let day = row.date;
//       try {
//         if (row.date)
//           day = new Date(row.date).toLocaleDateString("en-IN", { weekday: "short" });
//       } catch {}
//       return {
//         day,
//         present: row.present || 0,
//         absent: row.absent || 0,
//         leave: row.on_leave || 0,
//       };
//     });
//   }, [trend]);

//   const presentRate = useMemo(() => {
//     const p = att.present || 0;
//     const total =
//       (att.present || 0) +
//       (att.absent || 0) +
//       (att.on_leave || 0) +
//       (att.half_day || 0);
//     if (!total) return null;
//     return Math.round((p / total) * 100);
//   }, [att]);

//   const activeStaff = headcount.active || 0;
//   const presentTotal = (att.present || 0) + (att.wfh || 0) + (att.on_duty || 0);
//   const attendancePercent = activeStaff
//     ? Math.round((presentTotal / activeStaff) * 100)
//     : presentRate ?? 0;

//   const typeStyle = (type) => {
//     const t = (type || "").toLowerCase();
//     if (t === "leave") return "bg-sky-50 text-sky-700 ring-sky-100";
//     if (t === "regularization") return "bg-violet-50 text-violet-700 ring-violet-100";
//     return "bg-amber-50 text-amber-700 ring-amber-100";
//   };

//   const modalTitle =
//     listModal === "leave"
//       ? "On leave today"
//       : listModal === "absent"
//       ? "Absent without leave"
//       : "";

//   const modalList =
//     listModal === "leave" ? onLeaveList : listModal === "absent" ? absentList : [];

//   /* ══════════════ RENDER ══════════════ */
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-100/80 to-slate-50">
//       <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
//         {/* HERO */}
//         <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
//           <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E42527]/30 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

//           <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10">
//                 <Sun className="h-3.5 w-3.5 text-amber-300" />
//                 {greeting()}
//               </div>
//               <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
//                 HR Overview
//               </h1>
//               <p className="mt-1 text-sm text-slate-300">
//                 Live headcount, attendance & who is off today
//                 {summary?.date ? ` · ${formatDate(summary.date)}` : ""}
//               </p>
//               {lastUpdated && (
//                 <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-400">
//                   <CircleDot className="h-2.5 w-2.5 text-emerald-400" />
//                   Updated {relativeTime(lastUpdated)}
//                 </p>
//               )}
//             </div>
//             <div className="flex flex-wrap items-center gap-2 self-start">
//               <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15">
//                 <input
//                   type="checkbox"
//                   checked={autoRefresh}
//                   onChange={(e) => setAutoRefresh(e.target.checked)}
//                   className="h-3.5 w-3.5 rounded border-white/40 accent-[#E42527]"
//                 />
//                 Auto
//               </label>
//               <button
//                 type="button"
//                 onClick={() => {
//                   try {
//                     window.print();
//                   } catch {}
//                 }}
//                 className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
//               >
//                 <Printer className="h-4 w-4" />
//                 Export
//               </button>
//               <button
//                 type="button"
//                 onClick={() => loadDashboard()}
//                 disabled={loading}
//                 className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
//               >
//                 <RefreshCw
//                   className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {!loading && summary && (
//             <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
//               {[
//                 { label: "Active staff", value: activeStaff, delta: deltas.active },
//                 { label: "Present now", value: att.present ?? 0, delta: deltas.present },
//                 { label: "On leave", value: onLeaveCount, delta: deltas.on_leave },
//                 { label: "Absent", value: absentNoLeaveCount, delta: deltas.absent },
//               ].map((item) => (
//                 <div
//                   key={item.label}
//                   className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
//                 >
//                   <div className="flex items-center justify-between gap-2">
//                     <p className="text-[11px] uppercase tracking-wide text-slate-400">
//                       {item.label}
//                     </p>
//                     {item.delta != null && item.delta !== 0 && (
//                       <span
//                         className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
//                           item.delta > 0 ? "text-emerald-400" : "text-red-400"
//                         }`}
//                       >
//                         {item.delta > 0 ? "▲" : "▼"} {Math.abs(item.delta)}
//                       </span>
//                     )}
//                   </div>
//                   <p className="mt-1 text-xl font-semibold tabular-nums">
//                     {item.value}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             <div className="flex items-center gap-2">
//               <AlertCircle className="h-4 w-4 shrink-0" />
//               <span>{error}</span>
//             </div>
//             <button
//               onClick={() => loadDashboard()}
//               className="shrink-0 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* QUICK ACTIONS */}
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <QuickAction icon={Zap} label="Run Payroll" href="/payroll/run" tone="red" />
//           <QuickAction icon={UserPlus} label="Add Employee" href="/employees/add" tone="green" />
//           <QuickAction icon={ClipboardList} label="Pending Approvals" href="/approvals" tone="amber" />
//           <QuickAction icon={Timer} label="My Attendance" href="/attendance/today" tone="blue" />
//         </div>

//         {/* PERSONAL ROW — my day + balance + announcements */}
//         <div className="grid gap-4 lg:grid-cols-3">
//           <MyAttendanceToday data={myToday} tz={tz} loading={loading && !myToday} />
//           <MyLeaveBalance balances={myBalances} loading={loading && !myBalances.length} />
//           <AnnouncementsPanel announcements={announcements} loading={loading && !announcements.length} />
//         </div>

//         {loading && !summary ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
//             ))}
//           </div>
//         ) : (
//           <>
//             {/* KPI CARDS — ROW 1 */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//               <StatCard
//                 icon={Users} label="Active" value={activeStaff}
//                 hint={`Total ${headcount.total ?? 0}`} accent="slate"
//                 delta={deltas.active}
//               />
//               <StatCard
//                 icon={UserCheck2} label="Present" value={att.present ?? 0}
//                 hint={`Late ${att.late ?? 0}`} accent="green"
//                 delta={deltas.present}
//               />
//               <StatCard
//                 icon={CalendarDays} label="On leave" value={onLeaveCount}
//                 hint="Approved leave today" accent="blue"
//                 onClick={() => setListModal("leave")}
//                 delta={deltas.on_leave}
//               />
//               <StatCard
//                 icon={UserX} label="Absent" value={absentNoLeaveCount}
//                 hint="No punch, no leave" accent="red"
//                 onClick={() => setListModal("absent")}
//                 delta={deltas.absent}
//               />
//               <StatCard
//                 icon={ClipboardList} label="Approvals" value={pending.total ?? 0}
//                 hint={`Leave ${pending.leaves ?? 0}`} accent="amber"
//                 href="/approvals"
//               />
//               <StatCard
//                 icon={Briefcase} label="New joiners" value={headcount.new_joiners_this_month ?? 0}
//                 hint="This month" accent="violet"
//               />
//             </div>

//             {/* KPI CARDS — ROW 2 */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               <StatCard
//                 icon={Clock} label="WFH today" value={att.wfh ?? 0}
//                 accent="blue"
//               />
//               <StatCard
//                 icon={AlertTriangle} label="Alerts" value={summary?.unread_alerts ?? 0}
//                 accent={(summary?.unread_alerts || 0) > 0 ? "amber" : "slate"}
//                 href="/attendance/alerts"
//               />
//               <StatCard
//                 icon={Building2} label="Notice period" value={headcount.notice_period ?? 0}
//                 accent="slate"
//               />
//               <StatCard
//                 icon={TrendingUp} label="Onboarding" value={summary?.onboarding_candidates ?? 0}
//                 hint={presentRate != null ? `Present ${presentRate}%` : "Pipeline"}
//                 accent="violet"
//                 href="/onboarding"
//               />
//             </div>

//             {/* CHARTS ROW */}
//             <div className="grid gap-4 lg:grid-cols-12">
//               <Panel className="lg:col-span-6" title="Attendance trend" subtitle="Last 7 days">
//                 {trendData.length === 0 ? (
//                   <Empty text="No trend data yet" icon={TrendingUp} />
//                 ) : (
//                   <div className="h-72">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={trendData}>
//                         <defs>
//                           <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
//                             <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
//                           </linearGradient>
//                           <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="0%" stopColor="#E42527" stopOpacity={0.25} />
//                             <stop offset="100%" stopColor="#E42527" stopOpacity={0} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                         <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
//                         <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
//                         <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
//                         <Area type="monotone" dataKey="present" name="Present" stroke="#10b981" fill="url(#gPresent)" strokeWidth={2.5} />
//                         <Area type="monotone" dataKey="absent" name="Absent" stroke="#E42527" fill="url(#gAbsent)" strokeWidth={2} />
//                         <Area type="monotone" dataKey="leave" name="On leave" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 )}
//               </Panel>

//               <Panel className="lg:col-span-3" title="Today's rate" subtitle="Present + WFH + OD">
//                 <AttendanceRing
//                   percent={attendancePercent}
//                   present={presentTotal}
//                   total={activeStaff}
//                 />
//               </Panel>

//               <UpcomingEventsPanel events={events} loading={loading && !events.length} />
//             </div>

//             {/* DEPT CHARTS ROW */}
//             <div className="grid gap-4 lg:grid-cols-2">
//               <DepartmentHeadcountPie data={deptHeadcount} loading={loading && !deptHeadcount.length} />

//               <Panel title="Department presence" subtitle="In office today">
//                 {deptPresent.length === 0 ? (
//                   <Empty text="No department data" icon={Building2} />
//                 ) : (
//                   <div className="h-[240px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={deptPresent} layout="vertical" margin={{ left: 4, right: 8 }}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
//                         <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
//                         <YAxis type="category" dataKey="department" width={88} tick={{ fontSize: 10, fill: "#64748b" }} />
//                         <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
//                         <Bar dataKey="present" fill="#E42527" radius={[0, 8, 8, 0]} barSize={14} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 )}
//               </Panel>
//             </div>

//             {/* PRODUCTION CARDS ROW */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               <PayrollStatusCard data={payroll} loading={loading && !payroll} />
//               <RecruitmentPipelineCard data={recruitment} loading={loading && !recruitment} />
//               <DocumentExpiryCard docs={docExpiries} loading={loading && !docExpiries.length} />
//               <WorkingHoursCard data={workingHours} loading={loading && !workingHours} />
//             </div>

//             {/* ATTRITION + ACTION REQUIRED */}
//             <div className="grid gap-4 lg:grid-cols-3">
//               <AttritionCard data={attrition} loading={loading && !attrition} />

//               <Panel
//                 className="lg:col-span-2"
//                 title="Action required"
//                 subtitle="Needs your attention"
//                 right={
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
//                     <Sparkles className="h-4 w-4" />
//                   </div>
//                 }
//               >
//                 {actionItems.length === 0 ? (
//                   <Empty text="You're all caught up" icon={Award} />
//                 ) : (
//                   <ul className="divide-y divide-slate-100">
//                     {actionItems.slice(0, 5).map((it, i) => (
//                       <li key={it.id || i} className="flex items-start gap-3 py-2.5">
//                         <span
//                           className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
//                             it.priority === "high"
//                               ? "bg-red-100 text-red-700"
//                               : it.priority === "medium"
//                               ? "bg-amber-100 text-amber-700"
//                               : "bg-slate-100 text-slate-600"
//                           }`}
//                         >
//                           {it.priority || "low"}
//                         </span>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-medium text-slate-900">
//                             {it.title}
//                           </p>
//                           {it.description && (
//                             <p className="text-xs text-slate-500">{it.description}</p>
//                           )}
//                         </div>
//                         {it.href && (
//                           <Link
//                             href={it.href}
//                             className="shrink-0 text-xs font-medium text-[#E42527] hover:underline"
//                           >
//                             Open →
//                           </Link>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </Panel>
//             </div>

//             {/* RECENT HIRES + MY TEAM */}
//             <div className="grid gap-4 lg:grid-cols-2">
//               <Panel
//                 title="Recent hires"
//                 subtitle="Last 30 days"
//                 right={
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
//                     <UserPlus className="h-4 w-4" />
//                   </div>
//                 }
//               >
//                 {recentHires.length === 0 ? (
//                   <Empty text="No new hires recently" icon={UserPlus} />
//                 ) : (
//                   <ul className="divide-y divide-slate-100">
//                     {recentHires.slice(0, 5).map((h, i) => (
//                       <li key={h.employee_id || i} className="flex items-center gap-3 py-2.5">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
//                           {(h.name || "E")[0]?.toUpperCase()}
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-medium text-slate-900">
//                             {h.name || h.employee_id}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             {h.designation || "—"}
//                             {h.joining_date ? ` · Joined ${formatDate(h.joining_date)}` : ""}
//                           </p>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </Panel>

//               {myTeam ? (
//                 <Panel
//                   title="My team today"
//                   subtitle={
//                     myTeam.total
//                       ? `${myTeam.present || 0} of ${myTeam.total} present`
//                       : "Team attendance"
//                   }
//                   right={
//                     <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
//                       <Users className="h-4 w-4" />
//                     </div>
//                   }
//                 >
//                   <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                     <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900">
//                       <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
//                         Present
//                       </p>
//                       <p className="mt-0.5 text-2xl font-bold">
//                         {myTeam.present ?? 0}
//                       </p>
//                     </div>
//                     <div className="rounded-xl bg-red-50 px-4 py-3 text-red-900">
//                       <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
//                         Absent
//                       </p>
//                       <p className="mt-0.5 text-2xl font-bold">
//                         {myTeam.absent ?? 0}
//                       </p>
//                     </div>
//                     <div className="rounded-xl bg-sky-50 px-4 py-3 text-sky-900">
//                       <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
//                         On Leave
//                       </p>
//                       <p className="mt-0.5 text-2xl font-bold">
//                         {myTeam.on_leave ?? 0}
//                       </p>
//                     </div>
//                     <div className="rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
//                       <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
//                         Late
//                       </p>
//                       <p className="mt-0.5 text-2xl font-bold">
//                         {myTeam.late ?? 0}
//                       </p>
//                     </div>
//                   </div>
//                   {Array.isArray(myTeam.members) && myTeam.members.length > 0 && (
//                     <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
//                       {myTeam.members.slice(0, 6).map((m, i) => (
//                         <div
//                           key={m.employee_id || i}
//                           className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"
//                         >
//                           <div
//                             className={`h-2 w-2 rounded-full ${
//                               m.status === "present"
//                                 ? "bg-emerald-500"
//                                 : m.status === "absent"
//                                 ? "bg-red-500"
//                                 : m.status === "on_leave"
//                                 ? "bg-sky-500"
//                                 : "bg-slate-400"
//                             }`}
//                           />
//                           <p className="truncate text-xs text-slate-700">
//                             {m.name || m.employee_id}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </Panel>
//               ) : (
//                 <Panel title="Pending approvals" subtitle="Needs action">
//                   {pendingItems.length === 0 ? (
//                     <Empty text="All clear" icon={Award} />
//                   ) : (
//                     <div className="divide-y divide-slate-100">
//                       {pendingItems.slice(0, 5).map((item, i) => (
//                         <div
//                           key={`${item.type}-${item.id || i}`}
//                           className="flex items-center justify-between gap-2 py-2.5"
//                         >
//                           <div className="min-w-0">
//                             <p className="truncate text-sm font-medium text-slate-900">
//                               {item.title || "Request"}
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               {item.employee_id}
//                             </p>
//                           </div>
//                           <span
//                             className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${typeStyle(
//                               item.type
//                             )}`}
//                           >
//                             {(item.type || "").replace(/_/g, " ")}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </Panel>
//               )}
//             </div>

//             {/* ON LEAVE / ABSENT / APPROVALS */}
//             <div className="grid gap-4 lg:grid-cols-3">
//               <Panel
//                 title="On leave today"
//                 subtitle="Approved leave"
//                 right={
//                   <button
//                     type="button"
//                     onClick={() => setListModal("leave")}
//                     className="text-xs font-medium text-[#E42527] hover:underline"
//                   >
//                     View all
//                   </button>
//                 }
//               >
//                 {onLeaveList.length === 0 ? (
//                   <Empty text="No one on leave today" icon={CalendarDays} />
//                 ) : (
//                   <div className="space-y-2">
//                     {onLeaveList.slice(0, 4).map((row, i) => (
//                       <div
//                         key={row.employee_id || i}
//                         className="flex items-center justify-between rounded-xl bg-sky-50/80 px-3 py-2.5"
//                       >
//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-medium text-slate-900">
//                             {row.name || row.employee_id}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             {row.leave_type || "Leave"}
//                             {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
//                             {row.end_date ? ` – ${formatDate(row.end_date)}` : ""}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Panel>

//               <Panel
//                 title="Absent without leave"
//                 subtitle="No punch, no approved leave"
//                 right={
//                   <button
//                     type="button"
//                     onClick={() => setListModal("absent")}
//                     className="text-xs font-medium text-[#E42527] hover:underline"
//                   >
//                     View all
//                   </button>
//                 }
//               >
//                 {absentList.length === 0 ? (
//                   <Empty text="No unexplained absents" icon={UserX} />
//                 ) : (
//                   <div className="space-y-2">
//                     {absentList.slice(0, 4).map((row, i) => (
//                       <div
//                         key={row.employee_id || i}
//                         className="flex items-center justify-between rounded-xl bg-red-50/80 px-3 py-2.5"
//                       >
//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-medium text-slate-900">
//                             {row.name || row.employee_id}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             {row.reason || "Absent"}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Panel>

//               <Panel title="Pending approvals" subtitle="Needs action">
//                 {pendingItems.length === 0 ? (
//                   <Empty text="All clear" icon={Award} />
//                 ) : (
//                   <div className="divide-y divide-slate-100">
//                     {pendingItems.slice(0, 5).map((item, i) => (
//                       <div
//                         key={`${item.type}-${item.id || i}`}
//                         className="flex items-center justify-between gap-2 py-2.5"
//                       >
//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-medium text-slate-900">
//                             {item.title || "Request"}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             {item.employee_id}
//                           </p>
//                         </div>
//                         <span
//                           className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${typeStyle(
//                             item.type
//                           )}`}
//                         >
//                           {(item.type || "").replace(/_/g, " ")}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Panel>
//             </div>

//             {/* HOLIDAYS + BIRTHDAYS */}
//             <div className="grid gap-4 lg:grid-cols-2">
//               <Panel
//                 title="Upcoming holidays"
//                 subtitle="Next 30 days"
//                 right={
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
//                     <CalendarDays className="h-4 w-4" />
//                   </div>
//                 }
//               >
//                 {holidays.length === 0 ? (
//                   <Empty text="No holidays upcoming" icon={Sun} />
//                 ) : (
//                   <div className="space-y-2.5">
//                     {holidays.map((h, i) => {
//                       const date = calendarParts(h.date);
//                       return (
//                         <div
//                           key={h.holiday_id || i}
//                           className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 transition hover:border-amber-200 hover:bg-amber-50/40"
//                         >
//                           <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm ring-1 ring-amber-100">
//                             <span className="text-[10px] font-bold uppercase">
//                               {date.month}
//                             </span>
//                             <span className="text-lg font-bold leading-4">
//                               {date.day}
//                             </span>
//                           </div>
//                           <div className="min-w-0 flex-1">
//                             <p className="truncate text-sm font-semibold text-slate-900">
//                               {h.name || h.holiday_name}
//                             </p>
//                             <p className="mt-0.5 text-xs text-slate-500">
//                               {formatDate(h.date)}
//                             </p>
//                           </div>
//                           <Sun className="h-4 w-4 shrink-0 text-amber-400" />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </Panel>

//               <Panel
//                 title="Birthdays this week"
//                 subtitle="Next 7 days"
//                 right={
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
//                     <Cake className="h-4 w-4" />
//                   </div>
//                 }
//               >
//                 {birthdays.length === 0 ? (
//                   <Empty text="No birthdays this week" icon={Cake} />
//                 ) : (
//                   <div className="space-y-2.5">
//                     {birthdays.map((b, i) => (
//                       <div
//                         key={b.employee_id || i}
//                         className="flex items-center gap-3 rounded-xl border border-rose-100/80 bg-rose-50/50 px-3 py-2.5 transition hover:border-rose-200 hover:bg-rose-50"
//                       >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E42527] text-xs font-bold text-white shadow-sm shadow-red-200">
//                           {(b.name || "E")[0]?.toUpperCase()}
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-semibold text-slate-900">
//                             {b.name || b.employee_id}
//                           </p>
//                           <p className="mt-0.5 text-xs text-slate-500">
//                             {formatDate(b.birthday_on || b.dob)}
//                           </p>
//                         </div>
//                         <Cake className="h-4 w-4 shrink-0 text-[#E42527]" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Panel>
//             </div>
//           </>
//         )}
//       </div>

//       {/* MODAL */}
//       {listModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   {modalTitle}
//                 </h3>
//                 <p className="text-xs text-slate-500">
//                   {formatDate(peopleStatus?.date || summary?.date)} ·{" "}
//                   {modalList.length} people
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setListModal(null)}
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto px-5 py-3">
//               {modalList.length === 0 ? (
//                 <Empty text="No one in this list" />
//               ) : (
//                 <ul className="divide-y divide-slate-100">
//                   {modalList.map((row, i) => (
//                     <li key={row.employee_id || i} className="py-3">
//                       <p className="text-sm font-semibold text-slate-900">
//                         {row.name || row.employee_id}
//                       </p>
//                       <p className="text-xs text-slate-500">{row.employee_id}</p>
//                       {listModal === "leave" ? (
//                         <p className="mt-1 text-xs text-sky-700">
//                           {row.leave_type || "Leave"}
//                           {row.start_date ? ` · ${formatDate(row.start_date)}` : ""}
//                           {row.end_date ? ` → ${formatDate(row.end_date)}` : ""}
//                         </p>
//                       ) : (
//                         <p className="mt-1 text-xs text-red-600">
//                           {row.reason || "Absent without approved leave"}
//                         </p>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//             <div className="border-t border-slate-100 px-5 py-3">
//               <button
//                 type="button"
//                 onClick={() => setListModal(null)}
//                 className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// new code uper worked code 



"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Users, UserCheck2, UserX, CalendarDays, Clock, AlertTriangle,
  Building2, Briefcase, ClipboardList, Cake, RefreshCw, TrendingUp,
  TrendingDown, Sun, X, Printer, Zap, CircleDot, Award, Bell,
  ChevronRight, Sparkles, AlertCircle, UserPlus, Timer, Wallet,
  FileText, Target, Activity, Megaphone, Star, Heart, Coffee,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Calendar as CalIcon,
  Crown, Flame, Leaf, Moon, Gift, PartyPopper, BadgeCheck, Rocket,
  TrendingUp as TU, Info, Briefcase as BriefcaseAlt, Hash, MapPin,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { api } from "@/app/lib/api";

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

const AUTO_REFRESH_MS = 120_000;
const RELATIVE_TICK_MS = 10_000;

const DEPT_COLORS = [
  "#E42527", "#10b981", "#6366f1", "#f59e0b", "#0ea5e9",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];

const LEAVE_COLORS = {
  casual: "#6366f1",
  sick: "#E42527",
  earned: "#10b981",
  comp_off: "#f59e0b",
  default: "#64748b",
};

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function getErrorMessage(err) {
  const d = err?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((i) => i?.msg || "Error").join(", ");
  if (typeof d === "string") return d;
  if (d && typeof d === "object") return d.msg || d.message || "Request failed";
  return err?.message || "Something went wrong";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      });
    }
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return String(value);
  }
}

function calendarParts(value) {
  if (!value) return { day: "--", month: "", weekday: "" };
  try {
    const date = new Date(
      typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T00:00:00`
        : value
    );
    return {
      day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
    };
  } catch {
    return { day: "--", month: "", weekday: "" };
  }
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function greetingIcon() {
  const h = new Date().getHours();
  if (h < 12) return Sun;
  if (h < 17) return Coffee;
  return Moon;
}

function relativeTime(ts) {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function minutesToHhMm(m) {
  if (!m && m !== 0) return "0h 0m";
  const n = Number(m);
  if (Number.isNaN(n)) return "0h 0m";
  return `${Math.floor(n / 60)}h ${n % 60}m`;
}

function getInitials(name) {
  return String(name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";
}

function leaveColor(name) {
  const key = String(name || "").toLowerCase().replace(/\s+/g, "_");
  return LEAVE_COLORS[key] || LEAVE_COLORS.default;
}

/* ═══════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════ */

function KpiCard({
  icon: Icon, label, value, hint, accent = "slate", onClick, href,
  delta, sparkline, trend,
}) {
  const accents = {
    red: {
      bg: "from-red-50 via-white to-white",
      border: "border-red-100/80",
      icon: "bg-red-100 text-[#E42527]",
      label: "text-[#E42527]",
      glow: "group-hover:shadow-red-100",
    },
    green: {
      bg: "from-emerald-50 via-white to-white",
      border: "border-emerald-100/80",
      icon: "bg-emerald-100 text-emerald-600",
      label: "text-emerald-600",
      glow: "group-hover:shadow-emerald-100",
    },
    amber: {
      bg: "from-amber-50 via-white to-white",
      border: "border-amber-100/80",
      icon: "bg-amber-100 text-amber-600",
      label: "text-amber-600",
      glow: "group-hover:shadow-amber-100",
    },
    blue: {
      bg: "from-sky-50 via-white to-white",
      border: "border-sky-100/80",
      icon: "bg-sky-100 text-sky-600",
      label: "text-sky-600",
      glow: "group-hover:shadow-sky-100",
    },
    slate: {
      bg: "from-slate-50 via-white to-white",
      border: "border-slate-200",
      icon: "bg-slate-100 text-slate-700",
      label: "text-slate-600",
      glow: "group-hover:shadow-slate-200",
    },
    violet: {
      bg: "from-violet-50 via-white to-white",
      border: "border-violet-100/80",
      icon: "bg-violet-100 text-violet-600",
      label: "text-violet-600",
      glow: "group-hover:shadow-violet-100",
    },
    rose: {
      bg: "from-rose-50 via-white to-white",
      border: "border-rose-100/80",
      icon: "bg-rose-100 text-rose-600",
      label: "text-rose-600",
      glow: "group-hover:shadow-rose-100",
    },
    teal: {
      bg: "from-teal-50 via-white to-white",
      border: "border-teal-100/80",
      icon: "bg-teal-100 text-teal-600",
      label: "text-teal-600",
      glow: "group-hover:shadow-teal-100",
    },
  };
  const a = accents[accent] || accents.slate;

  const inner = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.icon} shadow-sm`}
          >
            <Icon className="h-5 w-5" />
          </div>
          {delta != null && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                delta > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : delta < 0
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {delta > 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : delta < 0 ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : null}
              {delta > 0 ? `+${delta}` : delta === 0 ? "—" : delta}
            </span>
          )}
        </div>

        <p
          className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${a.label}`}
        >
          {label}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
            {value ?? 0}
          </p>
          {trend && (
            <span className="text-[10px] font-medium text-slate-400">
              {trend}
            </span>
          )}
        </div>

        {hint && (
          <p className="mt-1 text-[11px] font-medium text-slate-500">{hint}</p>
        )}
      </div>

      {sparkline && sparkline.length > 0 && (
        <div className="mt-3 h-8 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline}>
              <defs>
                <linearGradient id={`sk-${accent}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={DEPT_COLORS[Math.floor(Math.random() * DEPT_COLORS.length)]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={DEPT_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={a.label.includes("red") ? "#E42527" : "#6366f1"}
                strokeWidth={1.8}
                fill={`url(#sk-${accent})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {(onClick || href) && (
        <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          View details
          <ChevronRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );

  const baseClass = `group relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${a.bg} ${a.border} ${a.glow}`;

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${baseClass} ${
        onClick ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {inner}
    </button>
  );
}

function Panel({
  title, subtitle, right, children, className = "", icon: Icon, iconClass,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                iconClass || "bg-slate-100 text-slate-700"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}
          <div>
            <h2 className="text-[14px] font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Empty({ text, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-xs font-medium text-slate-500">{text}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href, tone = "slate", sub }) {
  const tones = {
    red: "bg-gradient-to-br from-red-50 to-white text-red-700 ring-red-100 hover:ring-red-200",
    green: "bg-gradient-to-br from-emerald-50 to-white text-emerald-700 ring-emerald-100 hover:ring-emerald-200",
    amber: "bg-gradient-to-br from-amber-50 to-white text-amber-700 ring-amber-100 hover:ring-amber-200",
    blue: "bg-gradient-to-br from-sky-50 to-white text-sky-700 ring-sky-100 hover:ring-sky-200",
    violet: "bg-gradient-to-br from-violet-50 to-white text-violet-700 ring-violet-100 hover:ring-violet-200",
    slate: "bg-gradient-to-br from-slate-50 to-white text-slate-700 ring-slate-200 hover:ring-slate-300",
  };
  const t = tones[tone] || tones.slate;
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl p-3.5 ring-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${t}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">{label}</p>
        {sub && (
          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
            {sub}
          </p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-70" />
    </Link>
  );
}

function ProgressBar({ value, max, color = "#E42527" }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════ */

function Hero({
  summary, loading, onRefresh, refreshing, autoRefresh, setAutoRefresh,
  lastUpdated, headcount, att, deltas, onLeaveCount, absentNoLeaveCount,
}) {
  const GreetIcon = greetingIcon();
  const activeStaff = headcount.active || 0;
  const presentTotal = (att.present || 0) + (att.wfh || 0) + (att.on_duty || 0);
  const attendancePct = activeStaff
    ? Math.round((presentTotal / activeStaff) * 100)
    : 0;

  const heroStats = [
    {
      label: "Active staff",
      value: activeStaff,
      sub: `of ${headcount.total ?? 0} total`,
      delta: deltas.active,
      color: "text-white",
      icon: Users,
    },
    {
      label: "Present today",
      value: att.present ?? 0,
      sub: `${attendancePct}% attendance`,
      delta: deltas.present,
      color: "text-emerald-300",
      icon: UserCheck2,
    },
    {
      label: "On leave",
      value: onLeaveCount,
      sub: `${att.half_day ?? 0} half-day`,
      delta: deltas.on_leave,
      color: "text-sky-300",
      icon: CalendarDays,
    },
    {
      label: "Absent",
      value: absentNoLeaveCount,
      sub: `${att.late ?? 0} late arrivals`,
      delta: deltas.absent,
      color: "text-red-300",
      icon: UserX,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-2xl shadow-slate-900/20 sm:px-8">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#E42527]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-200 ring-1 ring-white/15 backdrop-blur">
              <GreetIcon className="h-3.5 w-3.5 text-amber-300" />
              {greeting()}
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              HR Overview
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-300">
              Real-time headcount, attendance & workforce pulse
              {summary?.date ? ` · ${formatDate(summary.date)}` : ""}
            </p>
            {lastUpdated && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/20">
                <CircleDot className="h-2.5 w-2.5 animate-pulse" />
                Live · {relativeTime(lastUpdated)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/15">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/40 accent-[#E42527]"
              />
              Auto
            </label>
            <button
              type="button"
              onClick={() => {
                try {
                  window.print();
                } catch {}
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-900 shadow-lg hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Syncing" : "Refresh"}
            </button>
          </div>
        </div>

        {!loading && summary && (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`h-4 w-4 ${s.color}`} />
                    {s.delta != null && s.delta !== 0 && (
                      <span
                        className={`text-[10px] font-bold ${
                          s.delta > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {s.delta > 0 ? "▲" : "▼"} {Math.abs(s.delta)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 text-2xl font-black tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    {s.sub}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PERSONAL ZONE
   ═══════════════════════════════════════════════════════════════════════ */

function MyAttendanceCard({ data, loading }) {
  if (loading) {
    return (
      <Panel
        title="My day"
        subtitle="Loading..."
        icon={Timer}
        iconClass="bg-sky-50 text-sky-600"
      >
        <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
      </Panel>
    );
  }

  const firstIn = data?.first_punch_in ? new Date(data.first_punch_in) : null;
  const lastOut = data?.last_punch_out ? new Date(data.last_punch_out) : null;
  const isPunchedIn = firstIn && !lastOut;
  const workMinutes = data?.total_work_minutes || 0;
  const targetMinutes = 8 * 60;
  const progressPct = Math.min(100, (workMinutes / targetMinutes) * 100);

  const fmt = (d) =>
    d
      ? d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  return (
    <Panel
      title="My day"
      subtitle="Today's punch status"
      icon={Timer}
      iconClass="bg-sky-50 text-sky-600"
      right={
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            isPunchedIn
              ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
              : lastOut
              ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
              : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPunchedIn
                ? "bg-emerald-500 animate-pulse"
                : lastOut
                ? "bg-blue-500"
                : "bg-amber-500"
            }`}
          />
          {isPunchedIn ? "Working" : lastOut ? "Completed" : "Not started"}
        </span>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50/70 px-3 py-3 ring-1 ring-emerald-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Punch in
            </p>
            <p className="mt-1 text-lg font-black text-slate-900 tabular-nums">
              {fmt(firstIn)}
            </p>
          </div>
          <div className="rounded-xl bg-red-50/70 px-3 py-3 ring-1 ring-red-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">
              Punch out
            </p>
            <p className="mt-1 text-lg font-black text-slate-900 tabular-nums">
              {fmt(lastOut)}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wide text-slate-500">
              Work duration
            </span>
            <span className="font-black text-slate-900 tabular-nums">
              {minutesToHhMm(workMinutes)}
              <span className="ml-1 text-[10px] font-medium text-slate-400">
                / 8h
              </span>
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={workMinutes}
              max={targetMinutes}
              color={
                progressPct >= 100
                  ? "#10b981"
                  : progressPct >= 50
                  ? "#f59e0b"
                  : "#E42527"
              }
            />
          </div>
        </div>

        {data?.is_late && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Late by {data.late_minutes || 0} minutes
          </div>
        )}

        <Link
          href="/attendance/today"
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md hover:bg-slate-800"
        >
          <Clock className="h-3.5 w-3.5" />
          {isPunchedIn
            ? "Punch Out"
            : lastOut
            ? "View Full Log"
            : "Punch In Now"}
        </Link>
      </div>
    </Panel>
  );
}

function MyLeaveCard({ balances, loading }) {
  if (loading) {
    return (
      <Panel
        title="Leave balance"
        subtitle="Loading..."
        icon={CalendarDays}
        iconClass="bg-violet-50 text-violet-600"
      >
        <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
      </Panel>
    );
  }

  if (!balances || balances.length === 0) {
    return (
      <Panel
        title="Leave balance"
        subtitle="Your leave summary"
        icon={CalendarDays}
        iconClass="bg-violet-50 text-violet-600"
      >
        <Empty text="No leave balances configured" icon={CalendarDays} />
      </Panel>
    );
  }

  const totalAvailable = balances.reduce(
    (s, b) => s + (Number(b.leaves_remaining) || 0),
    0
  );
  const totalAllocated = balances.reduce(
    (s, b) => s + (Number(b.total_leaves) || 0),
    0
  );
  const totalUsed = balances.reduce(
    (s, b) => s + (Number(b.leaves_taken) || 0),
    0
  );

  return (
    <Panel
      title="Leave balance"
      subtitle={`${totalAvailable.toFixed(1)} days available`}
      icon={CalendarDays}
      iconClass="bg-violet-50 text-violet-600"
      right={
        <Link
          href="/leave/my-balance"
          className="text-[10px] font-bold uppercase tracking-wide text-[#E42527] hover:underline"
        >
          Manage
        </Link>
      }
    >
      <div className="space-y-3">
        {/* Overview bar */}
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-white p-3.5 ring-1 ring-violet-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-700">
                Available
              </p>
              <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
                {totalAvailable.toFixed(1)}
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  days
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Used
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-700 tabular-nums">
                {totalUsed.toFixed(1)} / {totalAllocated.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="mt-2.5">
            <ProgressBar
              value={totalUsed}
              max={totalAllocated}
              color="#8b5cf6"
            />
          </div>
        </div>

        {/* Per-type list */}
        <div className="space-y-2">
          {balances.slice(0, 3).map((b, i) => {
            const used = Number(b.leaves_taken) || 0;
            const total = Number(b.total_leaves) || 0;
            const remaining = Number(b.leaves_remaining) || 0;
            const name = b.leave_type_name || b.leave_type_code || "Leave";
            const color = leaveColor(name);

            return (
              <div key={b.balance_id || i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="font-semibold text-slate-700">
                      {name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {remaining}
                    <span className="text-slate-400"> / {total}</span>
                  </span>
                </div>
                <ProgressBar value={used} max={total} color={color} />
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function AnnouncementsCard({ announcements, loading }) {
  const priorityStyles = {
    high: {
      border: "border-l-red-500",
      bg: "bg-red-50/40",
      badge: "bg-red-100 text-red-700",
    },
    normal: {
      border: "border-l-sky-500",
      bg: "bg-sky-50/40",
      badge: "bg-sky-100 text-sky-700",
    },
    low: {
      border: "border-l-slate-400",
      bg: "bg-slate-50",
      badge: "bg-slate-100 text-slate-600",
    },
  };

  return (
    <Panel
      title="Announcements"
      subtitle="Company updates"
      icon={Megaphone}
      iconClass="bg-amber-50 text-amber-600"
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <Empty text="No announcements yet" icon={Bell} />
      ) : (
        <div className="space-y-2.5">
          {announcements.slice(0, 3).map((a, i) => {
            const style =
              priorityStyles[a.priority] || priorityStyles.normal;
            return (
              <div
                key={a.id || i}
                className={`rounded-lg border-l-4 ${style.border} ${style.bg} px-3 py-2.5`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 text-[13px] font-bold text-slate-900">
                    {a.title}
                  </p>
                  {a.priority && a.priority !== "low" && (
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${style.badge}`}
                    >
                      {a.priority}
                    </span>
                  )}
                </div>
                {a.body && (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600">
                    {a.body}
                  </p>
                )}
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                  <span>{a.posted_by || "HR Team"}</span>
                  <span>·</span>
                  <span>
                    {relativeTime(
                      a.posted_at ? new Date(a.posted_at).getTime() : null
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CHARTS
   ═══════════════════════════════════════════════════════════════════════ */

function AttendanceTrendChart({ data, loading }) {
  return (
    <Panel
      title="Attendance trend"
      subtitle="Last 7 days · Present vs Absent vs Leave"
      icon={TrendingUp}
      iconClass="bg-emerald-50 text-emerald-600"
      className="lg:col-span-6"
      right={
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Present
          </span>
          <span className="flex items-center gap-1.5 text-[#E42527]">
            <span className="h-2 w-2 rounded-full bg-[#E42527]" />
            Absent
          </span>
          <span className="flex items-center gap-1.5 text-indigo-500">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Leave
          </span>
        </div>
      }
    >
      {loading ? (
        <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
      ) : !data || data.length === 0 ? (
        <Empty text="No trend data yet" icon={TrendingUp} />
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E42527" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#E42527" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="present"
                name="Present"
                stroke="#10b981"
                fill="url(#gradPresent)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="absent"
                name="Absent"
                stroke="#E42527"
                fill="url(#gradAbsent)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="leave"
                name="On leave"
                stroke="#6366f1"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="5 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

function AttendanceRateRing({ percent, present, total, loading }) {
  const pct = Math.max(0, Math.min(100, percent ?? 0));
  const color = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#E42527";
  const status = pct >= 75 ? "Excellent" : pct >= 50 ? "Average" : "Needs attention";

  const data = [{ name: "rate", value: pct, fill: color }];

  return (
    <Panel
      title="Attendance rate"
      subtitle="Present + WFH + On-duty"
      icon={Activity}
      iconClass="bg-blue-50 text-blue-600"
      className="lg:col-span-3"
    >
      {loading ? (
        <div className="h-[260px] animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative flex h-[200px] w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="72%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                data={data}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="value"
                  cornerRadius={12}
                  background={{ fill: "#f1f5f9" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-black text-slate-900 tabular-nums">
                {pct}%
              </p>
              <p
                className="mt-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ color }}
              >
                {status}
              </p>
            </div>
          </div>
          <div className="mt-3 grid w-full grid-cols-2 gap-2">
            <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Present
              </p>
              <p className="mt-0.5 text-lg font-black text-emerald-600 tabular-nums">
                {present ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Total
              </p>
              <p className="mt-0.5 text-lg font-black text-slate-900 tabular-nums">
                {total ?? 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

function DeptPresenceBar({ data, loading }) {
  return (
    <Panel
      title="Department presence"
      subtitle="In office today"
      icon={Building2}
      iconClass="bg-rose-50 text-rose-600"
      className="lg:col-span-3"
    >
      {loading ? (
        <div className="h-[260px] animate-pulse rounded-xl bg-slate-100" />
      ) : !data || data.length === 0 ? (
        <Empty text="No department data" icon={Building2} />
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 4, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                horizontal={false}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="department"
                width={90}
                tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(228,37,39,0.04)" }}
              />
              <Bar
                dataKey="present"
                fill="#E42527"
                radius={[0, 8, 8, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

function DeptHeadcountPie({ data, loading }) {
  const total = data?.reduce((s, d) => s + (d.count || 0), 0) || 0;

  return (
    <Panel
      title="Headcount by department"
      subtitle={`${total} employees`}
      icon={Users}
      iconClass="bg-violet-50 text-violet-600"
      className="lg:col-span-6"
    >
      {loading ? (
        <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />
      ) : !data || data.length === 0 ? (
        <Empty text="No department data" icon={Building2} />
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="count"
                nameKey="department"
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={DEPT_COLORS[i % DEPT_COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
                formatter={(v, n, p) => [
                  `${v} employees (${Math.round((v / total) * 100)}%)`,
                  p.payload.department,
                ]}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                formatter={(value, entry) =>
                  `${value} (${entry?.payload?.count || 0})`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   OPERATIONS PANELS
   ═══════════════════════════════════════════════════════════════════════ */

function PayrollCard({ data, loading }) {
  const statusMap = {
    processed: { label: "Processed", tone: "bg-blue-100 text-blue-700 ring-blue-200", dot: "bg-blue-500" },
    approved: { label: "Approved", tone: "bg-violet-100 text-violet-700 ring-violet-200", dot: "bg-violet-500" },
    paid: { label: "Paid", tone: "bg-emerald-100 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
    pending: { label: "Pending", tone: "bg-amber-100 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
    draft: { label: "Draft", tone: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
    failed: { label: "Failed", tone: "bg-red-100 text-red-700 ring-red-200", dot: "bg-red-500" },
  };
  const status = statusMap[data?.status] || statusMap.draft;

  return (
    <Panel
      title="Payroll"
      subtitle="Current cycle"
      icon={Wallet}
      iconClass="bg-emerald-50 text-emerald-600"
      right={
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${status.tone}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      }
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      ) : !data ? (
        <Empty text="No payroll data" icon={Wallet} />
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Period
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900">
              {data.period || "Current month"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-3 ring-1 ring-emerald-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                Net pay
              </p>
              <p className="mt-0.5 text-base font-black text-slate-900 tabular-nums">
                ₹{(data.total_net_pay || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-3 ring-1 ring-sky-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Employees
              </p>
              <p className="mt-0.5 text-base font-black text-slate-900 tabular-nums">
                {data.total_employees || 0}
              </p>
            </div>
          </div>
          <Link
            href="/payroll/run"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:bg-slate-50"
          >
            Open payroll
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </Panel>
  );
}

function RecruitmentCard({ data, loading }) {
  return (
    <Panel
      title="Recruitment"
      subtitle="Open roles & pipeline"
      icon={Target}
      iconClass="bg-violet-50 text-violet-600"
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      ) : !data ? (
        <Empty text="No recruitment data" icon={Target} />
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gradient-to-br from-violet-50 to-white p-3 ring-1 ring-violet-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-700">
                Open roles
              </p>
              <p className="mt-0.5 text-2xl font-black text-violet-900 tabular-nums">
                {data.open_positions || 0}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-3 ring-1 ring-sky-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Candidates
              </p>
              <p className="mt-0.5 text-2xl font-black text-sky-900 tabular-nums">
                {data.in_pipeline || 0}
              </p>
            </div>
          </div>
          {(data.stages || []).length > 0 && (
            <div className="space-y-1.5">
              {data.stages.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-medium"
                >
                  <span className="text-slate-600">{s.name}</span>
                  <span className="font-black text-slate-900">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function DocumentExpiryCard({ docs, loading }) {
  const urgencyStyles = {
    critical: "border-l-red-500 bg-red-50/50",
    warning: "border-l-amber-500 bg-amber-50/50",
    normal: "border-l-sky-500 bg-sky-50/50",
  };

  return (
    <Panel
      title="Document expiries"
      subtitle="Next 30 days"
      icon={FileText}
      iconClass="bg-amber-50 text-amber-600"
      right={
        docs?.length > 0 && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase text-red-700">
            {docs.length} due
          </span>
        )
      }
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      ) : !docs || docs.length === 0 ? (
        <Empty text="No upcoming expiries" icon={CheckCircle2} />
      ) : (
        <div className="space-y-2">
          {docs.slice(0, 3).map((d, i) => {
            const daysLeft = d.days_left ?? 0;
            const urgency =
              daysLeft <= 7
                ? "critical"
                : daysLeft <= 15
                ? "warning"
                : "normal";
            return (
              <div
                key={d.id || i}
                className={`rounded-lg border-l-4 px-3 py-2 ${urgencyStyles[urgency]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-slate-900">
                      {d.document_type || "Document"}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] font-medium text-slate-600">
                      {d.employee_name || "—"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {formatDate(d.expiry_date)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                      urgency === "critical"
                        ? "bg-red-100 text-red-700"
                        : urgency === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {daysLeft}d
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

function WorkingHoursCard({ data, loading }) {
  return (
    <Panel
      title="Working hours"
      subtitle="Average this week"
      icon={Clock}
      iconClass="bg-teal-50 text-teal-600"
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      ) : !data ? (
        <Empty text="No data available" icon={Clock} />
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl bg-gradient-to-br from-teal-50 to-white p-4 ring-1 ring-teal-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700">
              Daily average
            </p>
            <p className="mt-1 text-3xl font-black text-slate-900 tabular-nums">
              {data.avg_hours || "0h 0m"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                Min
              </p>
              <p className="mt-0.5 text-xs font-black text-slate-900">
                {data.min || "—"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                Max
              </p>
              <p className="mt-0.5 text-xs font-black text-slate-900">
                {data.max || "—"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                Total
              </p>
              <p className="mt-0.5 text-xs font-black text-slate-900">
                {data.total || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

function AttritionCard({ data, loading }) {
  const rate = data?.rate || 0;
  const health =
    rate <= 5 ? "Healthy" : rate <= 10 ? "Moderate" : "Concerning";
  const healthColor =
    rate <= 5
      ? "text-emerald-600 bg-emerald-50 ring-emerald-100"
      : rate <= 10
      ? "text-amber-600 bg-amber-50 ring-amber-100"
      : "text-red-600 bg-red-50 ring-red-100";

  return (
    <Panel
      title="Attrition"
      subtitle="This month"
      icon={Activity}
      iconClass="bg-red-50 text-red-600"
      right={
        !loading && data && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ring-1 ${healthColor}`}
          >
            {health}
          </span>
        )
      }
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      ) : !data ? (
        <Empty text="No attrition data" icon={Activity} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-red-600 tabular-nums">
              {rate}%
            </p>
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              monthly rate
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Exits
              </p>
              <p className="mt-0.5 text-lg font-black text-slate-900">
                {data.exits || 0}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Active
              </p>
              <p className="mt-0.5 text-lg font-black text-slate-900">
                {data.total_active || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CELEBRATIONS
   ═══════════════════════════════════════════════════════════════════════ */

function BirthdaysPanel({ birthdays, loading }) {
  return (
    <Panel
      title="Birthdays"
      subtitle={birthdays?.length ? `${birthdays.length} this week` : "Next 7 days"}
      icon={Cake}
      iconClass="bg-rose-50 text-rose-600"
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : !birthdays || birthdays.length === 0 ? (
        <Empty text="No birthdays this week" icon={Cake} />
      ) : (
        <div className="space-y-2">
          {birthdays.slice(0, 4).map((b, i) => (
            <div
              key={b.employee_id || i}
              className="group flex items-center gap-3 rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white p-3 transition hover:border-rose-200 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E42527] to-[#b91c1c] text-sm font-black text-white shadow-md shadow-red-200">
                {getInitials(b.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-slate-900">
                  {b.name || b.employee_id}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                  <Cake className="h-2.5 w-2.5" />
                  {formatDate(b.birthday_on || b.dob)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                  b.days_until === 0
                    ? "bg-[#E42527] text-white shadow-sm"
                    : b.days_until <= 2
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {b.days_until === 0
                  ? "Today"
                  : b.days_until === 1
                  ? "Tomorrow"
                  : `${b.days_until}d`}
              </span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function AnniversariesPanel({ anniversaries, loading }) {
  return (
    <Panel
      title="Work anniversaries"
      subtitle={
        anniversaries?.length
          ? `${anniversaries.length} upcoming`
          : "Next 30 days"
      }
      icon={Award}
      iconClass="bg-violet-50 text-violet-600"
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : !anniversaries || anniversaries.length === 0 ? (
        <Empty text="No anniversaries this month" icon={Award} />
      ) : (
        <div className="space-y-2">
          {anniversaries.slice(0, 4).map((a, i) => (
            <div
              key={a.employee_id || i}
              className="group flex items-center gap-3 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-3 transition hover:border-violet-200 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-800 text-sm font-black text-white shadow-md shadow-violet-200">
                {getInitials(a.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-slate-900">
                  {a.name || a.employee_id}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-700">
                    <Star className="h-2.5 w-2.5" />
                    {a.years} {a.years === 1 ? "year" : "years"}
                  </span>
                  {a.designation && (
                    <span className="truncate text-[10px] font-medium text-slate-500">
                      {a.designation}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                  a.days_until === 0
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-violet-100 text-violet-700"
                }`}
              >
                {a.days_until === 0 ? "Today" : `${a.days_until}d`}
              </span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function EventsPanel({ events, loading }) {
  const eventColors = {
    holiday: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100", icon: "🎉" },
    birthday: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100", icon: "🎂" },
    anniversary: { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-100", icon: "🏆" },
    meeting: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-100", icon: "👥" },
    training: { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-100", icon: "📚" },
    default: { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200", icon: "📅" },
  };

  return (
    <Panel
      title="This week"
      subtitle={
        events?.length ? `${events.length} upcoming events` : "Events & reminders"
      }
      icon={CalIcon}
      iconClass="bg-indigo-50 text-indigo-600"
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <Empty text="No events scheduled" icon={CalIcon} />
      ) : (
        <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
          {events.slice(0, 8).map((e, i) => {
            const date = calendarParts(e.date);
            const style = eventColors[e.type] || eventColors.default;
            return (
              <div
                key={e.id || i}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 transition hover:bg-slate-100"
              >
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                  <span className="text-[9px] font-black uppercase tracking-wide text-slate-500">
                    {date.month}
                  </span>
                  <span className="text-base font-black leading-4 text-slate-900">
                    {date.day}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-slate-900">
                    {style.icon} {e.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ring-1 ${style.bg} ${style.text} ${style.ring}`}
                    >
                      {e.type}
                    </span>
                    {e.time && (
                      <span className="text-[10px] font-medium text-slate-500">
                        {e.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LISTS
   ═══════════════════════════════════════════════════════════════════════ */

function ListPanel({
  title, subtitle, items, loading, onViewAll, typeStyle,
  emptyText, emptyIcon, avatarClass, icon,
}) {
  return (
    <Panel
      title={title}
      subtitle={subtitle}
      icon={icon?.Icon}
      iconClass={icon?.className}
      right={
        items?.length > 0 &&
        onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[10px] font-bold uppercase tracking-wide text-[#E42527] hover:underline"
          >
            View all
          </button>
        )
      }
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <Empty text={emptyText} icon={emptyIcon} />
      ) : (
        <div className="space-y-2">
          {items.slice(0, 4).map((row, i) => (
            <div
              key={row.employee_id || i}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white ${avatarClass}`}
              >
                {getInitials(row.name || row.employee_id)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold text-slate-900">
                  {row.name || row.employee_id}
                </p>
                <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                  {row.leave_type ||
                    row.reason ||
                    row.title ||
                    "—"}
                  {row.start_date && ` · ${formatDate(row.start_date)}`}
                  {row.end_date && ` → ${formatDate(row.end_date)}`}
                </p>
              </div>
              {row.type && typeStyle && (
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ring-1 ${typeStyle(
                    row.type
                  )}`}
                >
                  {(row.type || "").replace(/_/g, " ")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function HolidaysPanel({ holidays, loading }) {
  return (
    <Panel
      title="Upcoming holidays"
      subtitle={holidays?.length ? `${holidays.length} next 30 days` : "Next 30 days"}
      icon={Sun}
      iconClass="bg-amber-50 text-amber-600"
    >
      {loading ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : !holidays || holidays.length === 0 ? (
        <Empty text="No holidays upcoming" icon={Sun} />
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {holidays.slice(0, 8).map((h, i) => {
            const date = calendarParts(h.date);
            const daysAway = Math.ceil(
              (new Date(h.date) - new Date()) / (1000 * 60 * 60 * 24)
            );
            return (
              <div
                key={h.holiday_id || i}
                className="group flex items-center gap-3 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/60 to-white p-3 transition hover:border-amber-200 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm ring-1 ring-amber-100">
                  <span className="text-[9px] font-black uppercase tracking-wide">
                    {date.month}
                  </span>
                  <span className="text-lg font-black leading-5">
                    {date.day}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-slate-900">
                    {h.name || h.holiday_name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-slate-500">
                      {date.weekday}
                    </span>
                    {daysAway > 0 && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-700">
                        {daysAway === 1 ? "Tomorrow" : `in ${daysAway}d`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

function ActionRequiredPanel({ items, loading }) {
  const priority = {
    high: { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-200", dot: "bg-red-500" },
    medium: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
    low: { bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-200", dot: "bg-slate-400" },
  };

  return (
    <Panel
      title="Action required"
      subtitle={items?.length ? `${items.length} items need attention` : "All clear"}
      icon={Sparkles}
      iconClass="bg-amber-50 text-amber-600"
      right={
        items?.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700">
            {items.length} pending
          </span>
        )
      }
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <Empty text="You're all caught up" icon={CheckCircle2} />
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 5).map((it, i) => {
            const p = priority[it.priority] || priority.low;
            return (
              <li
                key={it.id || i}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div className="mt-1">
                  <span className={`block h-2 w-2 rounded-full ${p.dot}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 text-[12px] font-bold text-slate-900">
                      {it.title}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ring-1 ${p.bg} ${p.text} ${p.ring}`}
                    >
                      {it.priority || "low"}
                    </span>
                  </div>
                  {it.description && (
                    <p className="mt-0.5 line-clamp-1 text-[10px] font-medium text-slate-500">
                      {it.description}
                    </p>
                  )}
                </div>
                {it.href && (
                  <Link
                    href={it.href}
                    className="shrink-0 rounded-lg bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-900 hover:text-white"
                  >
                    Open
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function TeamPanel({ team, loading }) {
  if (!team || team.total === 0) return null;
  const pct = team.total ? Math.round((team.present / team.total) * 100) : 0;

  return (
    <Panel
      title="My team today"
      subtitle={`${team.present || 0} of ${team.total} present`}
      icon={Users}
      iconClass="bg-blue-50 text-blue-600"
      right={
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ${
            pct >= 75
              ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
              : pct >= 50
              ? "bg-amber-100 text-amber-700 ring-amber-200"
              : "bg-red-100 text-red-700 ring-red-200"
          }`}
        >
          {pct}% present
        </span>
      }
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-2.5 text-center ring-1 ring-emerald-100">
              <p className="text-[9px] font-black uppercase tracking-wide text-emerald-700">
                Present
              </p>
              <p className="mt-0.5 text-lg font-black text-emerald-900 tabular-nums">
                {team.present ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-white p-2.5 text-center ring-1 ring-red-100">
              <p className="text-[9px] font-black uppercase tracking-wide text-red-700">
                Absent
              </p>
              <p className="mt-0.5 text-lg font-black text-red-900 tabular-nums">
                {team.absent ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-2.5 text-center ring-1 ring-sky-100">
              <p className="text-[9px] font-black uppercase tracking-wide text-sky-700">
                Leave
              </p>
              <p className="mt-0.5 text-lg font-black text-sky-900 tabular-nums">
                {team.on_leave ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-2.5 text-center ring-1 ring-amber-100">
              <p className="text-[9px] font-black uppercase tracking-wide text-amber-700">
                Late
              </p>
              <p className="mt-0.5 text-lg font-black text-amber-900 tabular-nums">
                {team.late ?? 0}
              </p>
            </div>
          </div>
          {Array.isArray(team.members) && team.members.length > 0 && (
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {team.members.slice(0, 6).map((m, i) => {
                const statusStyle =
                  m.status === "present"
                    ? "bg-emerald-500"
                    : m.status === "absent"
                    ? "bg-red-500"
                    : m.status === "on_leave"
                    ? "bg-sky-500"
                    : "bg-slate-400";
                return (
                  <div
                    key={m.employee_id || i}
                    className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5"
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyle}`} />
                    <span className="truncate text-[11px] font-medium text-slate-700">
                      {m.name || m.employee_id}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function RecentHiresPanel({ hires, loading }) {
  return (
    <Panel
      title="Recent hires"
      subtitle="Last 30 days"
      icon={UserPlus}
      iconClass="bg-emerald-50 text-emerald-600"
      right={
        hires?.length > 0 && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
            {hires.length} new
          </span>
        )
      }
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : !hires || hires.length === 0 ? (
        <Empty text="No new hires recently" icon={UserPlus} />
      ) : (
        <div className="space-y-2">
          {hires.slice(0, 5).map((h, i) => (
            <div
              key={h.employee_id || i}
              className="flex items-center gap-3 rounded-xl bg-emerald-50/40 p-2.5 ring-1 ring-emerald-100/60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-[11px] font-black text-white shadow-sm">
                {getInitials(h.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold text-slate-900">
                  {h.name || h.employee_id}
                </p>
                <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                  {h.designation || "—"}
                  {h.department && ` · ${h.department}`}
                </p>
              </div>
              {h.joining_date && (
                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                  {formatDate(h.joining_date)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════════ */

export default function HrmsDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [peopleStatus, setPeopleStatus] = useState(null);
  const [actionItems, setActionItems] = useState([]);
  const [recentHires, setRecentHires] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myToday, setMyToday] = useState(null);
  const [myBalances, setMyBalances] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [deptHeadcount, setDeptHeadcount] = useState([]);
  const [payroll, setPayroll] = useState(null);
  const [docExpiries, setDocExpiries] = useState([]);
  const [recruitment, setRecruitment] = useState(null);
  const [workingHours, setWorkingHours] = useState(null);
  const [attrition, setAttrition] = useState(null);
  const [anniversaries, setAnniversaries] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [listModal, setListModal] = useState(null);
  const [, setTick] = useState(0);
  const reqIdRef = useRef(0);

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    const myReqId = ++reqIdRef.current;
    if (silent) setRefreshing(true);
    else setLoading(true);
    if (!silent) setError("");

    try {
      const results = await Promise.allSettled([
        api.get("/api/v1/dashboard/summary"),
        api.get("/api/v1/dashboard/attendance-trend", { params: { days: 7 } }),
        api.get("/api/v1/dashboard/pending-approvals", { params: { limit: 8 } }),
        api.get("/api/v1/dashboard/today-people-status"),
        api.get("/api/v1/dashboard/action-required"),
        api.get("/api/v1/dashboard/recent-hires", { params: { days: 30 } }),
        api.get("/api/v1/dashboard/my-team-today"),
        api.get("/api/v1/dashboard/my-today"),
        api.get("/api/v1/dashboard/my-leave-balance"),
        api.get("/api/v1/dashboard/announcements", { params: { limit: 5 } }),
        api.get("/api/v1/dashboard/upcoming-events", { params: { days: 7 } }),
        api.get("/api/v1/dashboard/dept-headcount"),
        api.get("/api/v1/dashboard/payroll-status"),
        api.get("/api/v1/dashboard/document-expiries", { params: { days: 30 } }),
        api.get("/api/v1/dashboard/recruitment-pipeline"),
        api.get("/api/v1/dashboard/working-hours-avg"),
        api.get("/api/v1/dashboard/attrition"),
        api.get("/api/v1/dashboard/anniversaries", { params: { days: 30 } }),
        api.get("/api/v1/dashboard/upcoming-events", { params: { days: 30 } }),
      ]);

      if (myReqId !== reqIdRef.current) return;

      const safe = (r) =>
        r.status === "fulfilled" ? r.value?.data ?? r.value : null;

      const [
        sumR, trendR, pendR, peopleR, actionsR, hiresR, teamR,
        myTodayR, myBalR, annR, eventsR, deptR, payrollR, docsR,
        recruitR, hoursR, attrR, annivR, events30R,
      ] = results;

      setSummary(safe(sumR));

      const tr = safe(trendR);
      setTrend(Array.isArray(tr?.trend) ? tr.trend : []);

      const pe = safe(pendR);
      setPendingItems(Array.isArray(pe?.items) ? pe.items : []);

      setPeopleStatus(safe(peopleR));

      const a = safe(actionsR);
      setActionItems(Array.isArray(a?.items) ? a.items : []);

      const h = safe(hiresR);
      setRecentHires(
        Array.isArray(h?.employees)
          ? h.employees
          : Array.isArray(h?.items)
          ? h.items
          : []
      );

      setMyTeam(safe(teamR));
      setMyToday(safe(myTodayR));

      const mb = safe(myBalR);
      setMyBalances(Array.isArray(mb?.balances) ? mb.balances : []);

      const an = safe(annR);
      setAnnouncements(Array.isArray(an?.announcements) ? an.announcements : []);

      const ev = safe(eventsR);
      const ev30 = safe(events30R);
      const merged = [...(ev?.events || [])];
      for (const x of ev30?.events || []) {
        if (!merged.some((m) => m.id === x.id)) merged.push(x);
      }
      merged.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
      setEvents(merged);

      const de = safe(deptR);
      setDeptHeadcount(
        Array.isArray(de?.departments)
          ? de.departments
          : Array.isArray(de)
          ? de
          : []
      );

      setPayroll(safe(payrollR));

      const docs = safe(docsR);
      setDocExpiries(Array.isArray(docs?.documents) ? docs.documents : []);

      setRecruitment(safe(recruitR));
      setWorkingHours(safe(hoursR));
      setAttrition(safe(attrR));

      const anv = safe(annivR);
      setAnniversaries(Array.isArray(anv?.anniversaries) ? anv.anniversaries : []);

      setLastUpdated(Date.now());
    } catch (err) {
      if (myReqId !== reqIdRef.current) return;
      setError(getErrorMessage(err));
    } finally {
      if (myReqId === reqIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadDashboard(), 0);
    return () => clearTimeout(t);
  }, [loadDashboard]);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => loadDashboard({ silent: true }), AUTO_REFRESH_MS);
    return () => clearInterval(t);
  }, [autoRefresh, loadDashboard]);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), RELATIVE_TICK_MS);
    return () => clearInterval(t);
  }, []);

  const headcount = summary?.headcount || {};
  const att = summary?.attendance_today || {};
  const pending = summary?.pending_approvals || {};
  const holidays = summary?.upcoming_holidays || [];
  const birthdays = summary?.birthdays_this_week || [];
  const deptPresent = summary?.department_present_today || [];
  const deltas = summary?.deltas || {};

  const onLeaveCount = peopleStatus?.on_leave?.count ?? att.on_leave ?? 0;
  const absentNoLeaveCount =
    peopleStatus?.absent_without_leave?.count ?? att.absent ?? 0;
  const onLeaveList = peopleStatus?.on_leave?.list || [];
  const absentList = peopleStatus?.absent_without_leave?.list || [];

  const trendData = useMemo(() => {
    return (trend || []).map((row) => {
      let day = row.date;
      try {
        if (row.date)
          day = new Date(row.date).toLocaleDateString("en-IN", {
            weekday: "short",
          });
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
      (att.present || 0) +
      (att.absent || 0) +
      (att.on_leave || 0) +
      (att.half_day || 0);
    if (!total) return null;
    return Math.round((p / total) * 100);
  }, [att]);

  const activeStaff = headcount.active || 0;
  const presentTotal = (att.present || 0) + (att.wfh || 0) + (att.on_duty || 0);
  const attendancePercent = activeStaff
    ? Math.round((presentTotal / activeStaff) * 100)
    : presentRate ?? 0;

  const typeStyle = (type) => {
    const t = (type || "").toLowerCase();
    if (t === "leave") return "bg-sky-100 text-sky-700 ring-sky-200";
    if (t === "regularization")
      return "bg-violet-100 text-violet-700 ring-violet-200";
    if (t === "special_request")
      return "bg-amber-100 text-amber-700 ring-amber-200";
    return "bg-slate-100 text-slate-700 ring-slate-200";
  };

  const modalTitle =
    listModal === "leave"
      ? "On leave today"
      : listModal === "absent"
      ? "Absent without leave"
      : "";

  const modalList =
    listModal === "leave" ? onLeaveList : listModal === "absent" ? absentList : [];

  if (error && !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-black text-slate-900">
            Dashboard load failed
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-600">{error}</p>
          <button
            onClick={() => loadDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E42527] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg hover:bg-[#c91f21]"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-6 lg:px-8">
        {/* HERO */}
        <Hero
          summary={summary}
          loading={loading}
          onRefresh={() => loadDashboard({ silent: true })}
          refreshing={refreshing}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          lastUpdated={lastUpdated}
          headcount={headcount}
          att={att}
          deltas={deltas}
          onLeaveCount={onLeaveCount}
          absentNoLeaveCount={absentNoLeaveCount}
        />

        {/* PARTIAL ERROR */}
        {error && summary && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Some widgets failed to load. Data may be partial.</span>
            </div>
            <button
              onClick={() => loadDashboard()}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800 hover:bg-amber-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            icon={Zap}
            label="Run Payroll"
            sub="Process this month"
            href="/payroll/run"
            tone="red"
          />
          <QuickAction
            icon={UserPlus}
            label="Add Employee"
            sub="Onboard new hire"
            href="/employees/add"
            tone="green"
          />
          <QuickAction
            icon={ClipboardList}
            label="Approvals"
            sub={`${pending.total ?? 0} pending`}
            href="/approvals"
            tone="amber"
          />
          <QuickAction
            icon={Timer}
            label="My Attendance"
            sub="Punch & timesheet"
            href="/attendance/today"
            tone="blue"
          />
        </div>

        {/* PERSONAL ROW */}
        <div className="grid gap-4 lg:grid-cols-3">
          <MyAttendanceCard data={myToday} loading={loading && !myToday} />
          <MyLeaveCard
            balances={myBalances}
            loading={loading && !myBalances.length}
          />
          <AnnouncementsCard
            announcements={announcements}
            loading={loading && !announcements.length}
          />
        </div>

        {loading && !summary ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : (
          <>
            {/* KPI GRID — PRIMARY */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <KpiCard
                icon={Users}
                label="Active staff"
                value={activeStaff}
                hint={`${headcount.total ?? 0} total employees`}
                accent="slate"
                delta={deltas.active}
                href="/employees"
              />
              <KpiCard
                icon={UserCheck2}
                label="Present"
                value={att.present ?? 0}
                hint={`${att.late ?? 0} late arrivals`}
                accent="green"
                delta={deltas.present}
              />
              <KpiCard
                icon={CalendarDays}
                label="On leave"
                value={onLeaveCount}
                hint="Approved leave today"
                accent="blue"
                delta={deltas.on_leave}
                onClick={() => setListModal("leave")}
              />
              <KpiCard
                icon={UserX}
                label="Absent"
                value={absentNoLeaveCount}
                hint="No punch, no leave"
                accent="red"
                delta={deltas.absent}
                onClick={() => setListModal("absent")}
              />
              <KpiCard
                icon={ClipboardList}
                label="Approvals"
                value={pending.total ?? 0}
                hint={`${pending.leaves ?? 0} leave requests`}
                accent="amber"
                href="/approvals"
              />
              <KpiCard
                icon={BriefcaseAlt}
                label="New joiners"
                value={headcount.new_joiners_this_month ?? 0}
                hint="This month"
                accent="violet"
                href="/employees?filter=new"
              />
            </div>

            {/* KPI GRID — SECONDARY */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                icon={Clock}
                label="Work from home"
                value={att.wfh ?? 0}
                hint="Today's remote staff"
                accent="blue"
              />
              <KpiCard
                icon={Bell}
                label="Unread alerts"
                value={summary?.unread_alerts ?? 0}
                hint={
                  (summary?.unread_alerts || 0) > 0
                    ? "Requires attention"
                    : "No pending alerts"
                }
                accent={
                  (summary?.unread_alerts || 0) > 0 ? "amber" : "slate"
                }
                href="/attendance/alerts"
              />
              <KpiCard
                icon={Building2}
                label="Notice period"
                value={headcount.notice_period ?? 0}
                hint="Employees serving notice"
                accent="slate"
                href="/employees?status=notice_period"
              />
              <KpiCard
                icon={Rocket}
                label="Onboarding"
                value={summary?.onboarding_candidates ?? 0}
                hint={
                  presentRate != null
                    ? `Attendance ${presentRate}%`
                    : "Pipeline active"
                }
                accent="violet"
                href="/onboarding"
              />
            </div>

            {/* CHARTS ROW 1 */}
            <div className="grid gap-4 lg:grid-cols-12">
              <AttendanceTrendChart data={trendData} loading={loading} />
              <AttendanceRateRing
                percent={attendancePercent}
                present={presentTotal}
                total={activeStaff}
                loading={loading}
              />
              <DeptPresenceBar data={deptPresent} loading={loading} />
            </div>

            {/* CHARTS ROW 2 */}
            <div className="grid gap-4 lg:grid-cols-12">
              <DeptHeadcountPie
                data={deptHeadcount}
                loading={loading && !deptHeadcount.length}
              />
              <EventsPanel events={events} loading={loading && !events.length} />
            </div>

            {/* OPERATIONS ROW */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PayrollCard data={payroll} loading={loading && !payroll} />
              <RecruitmentCard
                data={recruitment}
                loading={loading && !recruitment}
              />
              <DocumentExpiryCard
                docs={docExpiries}
                loading={loading && !docExpiries.length}
              />
              <WorkingHoursCard
                data={workingHours}
                loading={loading && !workingHours}
              />
            </div>

            {/* CELEBRATIONS */}
            <div className="grid gap-4 lg:grid-cols-3">
              <BirthdaysPanel
                birthdays={birthdays}
                loading={loading && !birthdays.length}
              />
              <AnniversariesPanel
                anniversaries={anniversaries}
                loading={loading && !anniversaries.length}
              />
              <AttritionCard
                data={attrition}
                loading={loading && !attrition}
              />
            </div>

            {/* TEAM & ACTION & HIRES */}
            <div className="grid gap-4 lg:grid-cols-3">
              <ActionRequiredPanel
                items={actionItems}
                loading={loading && !actionItems.length}
              />
              {myTeam && myTeam.total > 0 && (
                <TeamPanel team={myTeam} loading={loading} />
              )}
              <RecentHiresPanel
                hires={recentHires}
                loading={loading && !recentHires.length}
              />
            </div>

            {/* LISTS */}
            <div className="grid gap-4 lg:grid-cols-3">
              <ListPanel
                title="On leave today"
                subtitle="Approved leave"
                items={onLeaveList}
                loading={loading}
                onViewAll={() => setListModal("leave")}
                emptyText="No one on leave today"
                emptyIcon={CalendarDays}
                avatarClass="bg-gradient-to-br from-sky-500 to-sky-700"
                icon={{ Icon: CalendarDays, className: "bg-sky-50 text-sky-600" }}
              />
              <ListPanel
                title="Absent without leave"
                subtitle="No punch, no approved leave"
                items={absentList}
                loading={loading}
                onViewAll={() => setListModal("absent")}
                emptyText="No unexplained absents"
                emptyIcon={CheckCircle2}
                avatarClass="bg-gradient-to-br from-[#E42527] to-[#b91c1c]"
                icon={{ Icon: UserX, className: "bg-red-50 text-red-600" }}
              />
              <ListPanel
                title="Pending approvals"
                subtitle="Awaiting action"
                items={pendingItems}
                loading={loading}
                emptyText="All clear"
                emptyIcon={CheckCircle2}
                avatarClass="bg-gradient-to-br from-amber-500 to-amber-700"
                icon={{
                  Icon: ClipboardList,
                  className: "bg-amber-50 text-amber-600",
                }}
                typeStyle={typeStyle}
              />
            </div>

            {/* HOLIDAYS */}
            <HolidaysPanel
              holidays={holidays}
              loading={loading && !holidays.length}
            />
          </>
        )}
      </div>

      {/* MODAL */}
      {listModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {modalTitle}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {formatDate(peopleStatus?.date || summary?.date)} ·{" "}
                  {modalList.length} people
                </p>
              </div>
              <button
                type="button"
                onClick={() => setListModal(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {modalList.length === 0 ? (
                <Empty text="No one in this list" />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {modalList.map((row, i) => (
                    <li key={row.employee_id || i} className="py-3.5">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${
                            listModal === "leave"
                              ? "bg-gradient-to-br from-sky-500 to-sky-700"
                              : "bg-gradient-to-br from-[#E42527] to-[#b91c1c]"
                          }`}
                        >
                          {getInitials(row.name || row.employee_id)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900">
                            {row.name || row.employee_id}
                          </p>
                          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                            {row.employee_id}
                          </p>
                          {listModal === "leave" ? (
                            <p className="mt-1 text-xs font-medium text-sky-700">
                              {row.leave_type || "Leave"}
                              {row.start_date
                                ? ` · ${formatDate(row.start_date)}`
                                : ""}
                              {row.end_date
                                ? ` → ${formatDate(row.end_date)}`
                                : ""}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs font-medium text-red-600">
                              {row.reason || "Absent without approved leave"}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setListModal(null)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-slate-800"
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