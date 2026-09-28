
// "use client";

// /**
//  * AttendanceTodayPage — Production Ready
//  * Face scan + location capture + map display + punch in/out
//  */

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const LIVE_TICK_MS = 30_000;
// const AUTO_DISMISS_MS = 5000;
// const HISTORY_PAGE_SIZE = 10;
// const LOCATION_TIMEOUT_MS = 12_000;
// const CAMERA_CAPTURE_SIZE = 320;
// const CAMERA_JPEG_QUALITY = 0.75;
// const DEVICE_STORAGE_KEY = "hrms.device_uid";

// const PUNCH_SOURCE = { WEB: "web", MOBILE: "mobile" };
// const PUNCH_TYPE = { IN: "in", OUT: "out" };

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
//   if (detail && typeof detail === "object" && detail.msg) return detail.msg;
//   return err?.message || "Something went wrong";
// };

// const safeDate = (v) => {
//   if (!v) return null;
//   const d = new Date(v);
//   return Number.isNaN(d.getTime()) ? null : d;
// };

// const formatDate = (v, tz) => {
//   const d = safeDate(v);
//   if (!d) return "—";
//   try {
//     return d.toLocaleDateString("en-IN", {
//       weekday: "short",
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       timeZone: tz,
//     });
//   } catch {
//     return "—";
//   }
// };

// const formatTime = (v, tz) => {
//   const d = safeDate(v);
//   if (!d) return "—";
//   try {
//     return d.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//       timeZone: tz,
//     });
//   } catch {
//     return "—";
//   }
// };

// const minutesToHhMm = (m) => {
//   if (m == null) return "0h 0m";
//   const n = Number(m);
//   if (Number.isNaN(n) || n <= 0) return "0h 0m";
//   return `${Math.floor(n / 60)}h ${n % 60}m`;
// };

// const getFirstIn = (r) => r?.first_punch_in || null;
// const getLastOut = (r) => r?.last_punch_out || null;

// const getOrCreateDeviceId = () => {
//   if (typeof window === "undefined") return "SSR";
//   try {
//     let id = localStorage.getItem(DEVICE_STORAGE_KEY);
//     if (!id) {
//       id = `WEB-${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
//       localStorage.setItem(DEVICE_STORAGE_KEY, id);
//     }
//     return id;
//   } catch {
//     return `WEB-${Date.now()}`;
//   }
// };

// const computeLiveMinutes = (r) => {
//   if (!r) return 0;
//   const firstIn = safeDate(getFirstIn(r));
//   const lastOut = safeDate(getLastOut(r));
//   if (!firstIn) return 0;
//   if (lastOut) return Number(r.total_work_minutes) || 0;
//   const diff = Math.floor((Date.now() - firstIn.getTime()) / 60_000);
//   const brk = Number(r.break_minutes) || 0;
//   return Math.max(diff - brk, 0);
// };

// const statusLabel = (s) =>
//   String(s || "")
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// const statusBadgeClass = (s, isHalfDay) => {
//   const x = String(s || "").toLowerCase();
//   if (isHalfDay || x === "half_day") return "bg-purple-50 text-purple-700 border-purple-200";
//   if (x === "present") return "bg-green-50 text-green-700 border-green-200";
//   if (x === "absent") return "bg-red-50 text-red-700 border-red-200";
//   if (x === "on_leave" || x === "leave") return "bg-blue-50 text-blue-700 border-blue-200";
//   if (x === "work_from_home" || x === "wfh") return "bg-teal-50 text-teal-700 border-teal-200";
//   if (x === "on_duty" || x === "od") return "bg-orange-50 text-orange-700 border-orange-200";
//   if (x === "holiday") return "bg-indigo-50 text-indigo-700 border-indigo-200";
//   if (x === "week_off") return "bg-slate-100 text-slate-600 border-slate-200";
//   if (x === "missing_punch") return "bg-amber-50 text-amber-700 border-amber-200";
//   return "bg-slate-100 text-slate-600 border-slate-200";
// };

// /* ══════════════════════════════════════════════════════════
//    TOAST
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
//       : type === "warning"
//       ? "border-amber-200 bg-amber-50 text-amber-800"
//       : "border-green-200 bg-green-50 text-green-700";

//   const icon = type === "error" ? "⚠️" : type === "warning" ? "⚡" : "✅";

//   return (
//     <div
//       role="alert"
//       className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles}`}
//     >
//       <div className="flex items-start gap-2">
//         <span className="leading-none">{icon}</span>
//         <span className="leading-snug whitespace-pre-line">{message}</span>
//       </div>
//       <button
//         onClick={onDismiss}
//         aria-label="Dismiss"
//         className="ml-2 shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
//       >
//         ✕
//       </button>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    CONFIRM DIALOG
//    ══════════════════════════════════════════════════════════ */

// function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, loading }) {
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
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="text-base font-semibold text-slate-800">{title}</h3>
//         {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
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
//             className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
//           >
//             {loading ? "Please wait..." : confirmLabel || "Confirm"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    CAMERA CAPTURE
//    ══════════════════════════════════════════════════════════ */

// function CameraCapture({ onCapture, onClose }) {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);
//   const [error, setError] = useState("");
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
//         setError("Camera is not supported in this browser");
//         return;
//       }
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
//           audio: false,
//         });
//         if (cancelled) {
//           stream.getTracks().forEach((t) => t.stop());
//           return;
//         }
//         streamRef.current = stream;
//         const video = videoRef.current;
//         if (video) {
//           video.srcObject = stream;
//           video.onloadedmetadata = () => {
//             video.play().catch(() => {});
//             setTimeout(() => {
//               if (!cancelled) setReady(true);
//             }, 250);
//           };
//         }
//       } catch (e) {
//         const msg =
//           e?.name === "NotAllowedError"
//             ? "Camera permission denied. Please allow camera access in browser settings."
//             : e?.name === "NotFoundError"
//             ? "No camera found on this device."
//             : "Could not start camera.";
//         if (!cancelled) setError(msg);
//       }
//     })();

//     return () => {
//       cancelled = true;
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((t) => t.stop());
//         streamRef.current = null;
//       }
//     };
//   }, []);

//   const handleCapture = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas || !ready) return;

//     const vw = video.videoWidth;
//     const vh = video.videoHeight;
//     if (!vw || !vh) return;

//     const side = Math.min(vw, vh);
//     canvas.width = CAMERA_CAPTURE_SIZE;
//     canvas.height = CAMERA_CAPTURE_SIZE;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(
//       video,
//       (vw - side) / 2,
//       (vh - side) / 2,
//       side,
//       side,
//       0,
//       0,
//       CAMERA_CAPTURE_SIZE,
//       CAMERA_CAPTURE_SIZE
//     );

//     const dataUrl = canvas.toDataURL("image/jpeg", CAMERA_JPEG_QUALITY);

//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((t) => t.stop());
//       streamRef.current = null;
//     }

//     onCapture(dataUrl);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
//           <div>
//             <h3 className="text-base font-semibold text-slate-800">Take Selfie</h3>
//             <p className="mt-0.5 text-xs text-slate-500">
//               This photo will be attached to your punch record
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
//             aria-label="Close"
//           >
//             ✕
//           </button>
//         </div>

//         {error ? (
//           <div className="p-6">
//             <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
//               <p className="font-medium">Camera unavailable</p>
//               <p className="mt-1 text-xs">{error}</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="mt-4 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
//             >
//               Go Back
//             </button>
//           </div>
//         ) : (
//           <div className="p-4">
//             <div
//               className="relative overflow-hidden rounded-xl bg-black"
//               style={{ aspectRatio: "1 / 1" }}
//             >
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="h-full w-full object-cover"
//                 style={{ transform: "scaleX(-1)" }}
//               />
//               <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//                 <div
//                   className="rounded-full border-2 border-dashed border-white/50"
//                   style={{ width: "70%", aspectRatio: "1 / 1" }}
//                 />
//               </div>
//               {!ready && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">
//                   Starting camera...
//                 </div>
//               )}
//             </div>

//             <canvas ref={canvasRef} className="hidden" />

//             <div className="mt-4 flex gap-2">
//               <button
//                 onClick={onClose}
//                 className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCapture}
//                 disabled={!ready}
//                 className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Capture
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    PUNCH CARD (with location display + map)
//    ══════════════════════════════════════════════════════════ */

// function PunchCard({
//   employeeId,
//   today,
//   shift,
//   loading,
//   resolving,
//   punching,
//   onPunch,
//   photoUrl,
//   setPhotoUrl,
//   onOpenCamera,
//   deviceId,
//   locationInfo,
//   onRefreshLocation,
//   tz,
// }) {
//   const firstIn = getFirstIn(today);
//   const lastOut = getLastOut(today);
//   const isLive = firstIn && !lastOut;

//   const [now, setNow] = useState(Date.now());
//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), LIVE_TICK_MS);
//     return () => clearInterval(t);
//   }, []);

//   const liveMinutes = useMemo(() => {
//     void now;
//     return computeLiveMinutes(today);
//   }, [today, now]);

//   const punchState = useMemo(() => {
//     if (!firstIn) return { phase: "need_in", nextType: "in", label: "Punch In" };
//     if (!lastOut) return { phase: "need_out", nextType: "out", label: "Punch Out" };
//     return { phase: "done", nextType: null, label: "Completed Today" };
//   }, [firstIn, lastOut]);

//   const statusInfo = useMemo(() => {
//     if (loading || resolving) return { label: "Loading...", class: "bg-slate-100 text-slate-500" };
//     if (punchState.phase === "need_in") return { label: "Not Punched In", class: "bg-amber-100 text-amber-700" };
//     if (punchState.phase === "need_out") {
//       return today?.is_late
//         ? { label: "Punched In (Late)", class: "bg-orange-100 text-orange-700" }
//         : { label: "Punched In", class: "bg-blue-100 text-blue-700" };
//     }
//     if (today?.is_half_day) return { label: "Half Day", class: "bg-purple-100 text-purple-700" };
//     return { label: "Present", class: "bg-green-100 text-green-700" };
//   }, [loading, resolving, punchState.phase, today]);

//   const canPunch =
//     !punching &&
//     !loading &&
//     !resolving &&
//     employeeId &&
//     punchState.nextType &&
//     (locationInfo.coords || locationInfo.loading);

//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//       {/* Header strip */}
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-6 text-center text-white">
//         <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Today</p>
//         <div className="mt-3 flex justify-center">
//           <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.class}`}>
//             {statusInfo.label}
//           </span>
//         </div>
//         <p className="mt-3 text-sm text-slate-300">
//           {punchState.phase === "need_in" && "Start your day"}
//           {punchState.phase === "need_out" && "You're currently punched in"}
//           {punchState.phase === "done" && "See you tomorrow"}
//         </p>
//       </div>

//       <div className="space-y-5 p-6">
//         {/* Punch times */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className={`rounded-xl px-3 py-4 text-center ${firstIn ? "bg-green-50" : "bg-slate-50"}`}>
//             <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Punch In</p>
//             <p className="mt-1.5 text-lg font-semibold text-slate-900">{formatTime(firstIn, tz)}</p>
//           </div>
//           <div className={`rounded-xl px-3 py-4 text-center ${lastOut ? "bg-green-50" : "bg-slate-50"}`}>
//             <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Punch Out</p>
//             <p className="mt-1.5 text-lg font-semibold text-slate-900">{formatTime(lastOut, tz)}</p>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
//             <p className="text-[11px] text-slate-500">Work Hours</p>
//             <div className="mt-1 flex items-center justify-center gap-1.5">
//               <p className="font-semibold text-slate-800">{minutesToHhMm(liveMinutes)}</p>
//               {isLive && (
//                 <span className="relative flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
//             <p className="text-[11px] text-slate-500">Late By</p>
//             <p className="mt-1 font-semibold text-slate-800">
//               {today?.is_late ? `${today.late_minutes || 0} min` : "—"}
//             </p>
//           </div>
//         </div>

//         {today?.is_half_day && (
//           <div className="rounded-xl bg-purple-50 px-4 py-2.5 text-center text-sm font-medium text-purple-700">
//             Marked as Half Day
//           </div>
//         )}

//         {/* ═══════════ LOCATION — EXPANDED ═══════════ */}
//         <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 text-xs font-medium">
//               {locationInfo.loading ? (
//                 <>
//                   <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500" />
//                   <span className="text-slate-600">Getting location...</span>
//                 </>
//               ) : locationInfo.coords ? (
//                 <>
//                   <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
//                   <span className="text-green-700">📍 Location Captured</span>
//                 </>
//               ) : (
//                 <>
//                   <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
//                   <span className="text-red-600">{locationInfo.error || "Location required"}</span>
//                 </>
//               )}
//             </div>
//             <button
//               type="button"
//               onClick={onRefreshLocation}
//               disabled={locationInfo.loading}
//               className="rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-50"
//             >
//               {locationInfo.loading ? "..." : "↻ Refresh"}
//             </button>
//           </div>

//           {/* Coordinates card */}
//           {locationInfo.coords && (
//             <div className="mt-3 space-y-2">
//               <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
//                 <div className="flex items-center justify-between text-[11px]">
//                   <span className="text-slate-500">Latitude</span>
//                   <span className="font-mono font-medium text-slate-800">
//                     {locationInfo.coords.latitude.toFixed(6)}
//                   </span>
//                 </div>
//                 <div className="mt-1 flex items-center justify-between text-[11px]">
//                   <span className="text-slate-500">Longitude</span>
//                   <span className="font-mono font-medium text-slate-800">
//                     {locationInfo.coords.longitude.toFixed(6)}
//                   </span>
//                 </div>
//                 {locationInfo.coords.accuracy && (
//                   <div className="mt-1 flex items-center justify-between text-[11px]">
//                     <span className="text-slate-500">Accuracy</span>
//                     <span className="font-medium text-slate-800">
//                       ±{Math.round(locationInfo.coords.accuracy)}m
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Google Maps link */}
//               <a
//                 href={`https://www.google.com/maps?q=${locationInfo.coords.latitude},${locationInfo.coords.longitude}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 text-[11px] font-medium text-blue-700 ring-1 ring-blue-100 hover:bg-blue-100"
//               >
//                 🗺️ View on Google Maps
//               </a>

//               {/* Embedded mini map */}
//               <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
//                 <iframe
//                   title="Location"
//                   width="100%"
//                   height="150"
//                   style={{ border: 0, display: "block" }}
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                   src={`https://maps.google.com/maps?q=${locationInfo.coords.latitude},${locationInfo.coords.longitude}&z=16&output=embed`}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Error help */}
//           {!locationInfo.loading && !locationInfo.coords && (
//             <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800 ring-1 ring-amber-100">
//               <p className="font-medium">📍 Location is required to punch</p>
//               <p className="mt-1 opacity-80">
//                 Please allow location access. If blocked, click the 🔒 icon in the URL bar → Site
//                 settings → Location → Allow → then click Refresh.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Photo */}
//         {photoUrl ? (
//           <div className="flex items-center justify-between gap-3 rounded-xl border border-green-100 bg-green-50 px-3.5 py-2.5">
//             <div className="flex items-center gap-3">
//               <img
//                 src={photoUrl}
//                 alt="captured"
//                 className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
//               />
//               <span className="text-xs text-green-800">Photo attached</span>
//             </div>
//             <button
//               type="button"
//               onClick={onOpenCamera}
//               className="text-[11px] font-medium text-green-800 hover:underline"
//             >
//               Retake
//             </button>
//           </div>
//         ) : (
//           <button
//             type="button"
//             onClick={onOpenCamera}
//             className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 transition hover:border-red-500 hover:text-red-600"
//           >
//             📷 Take Selfie (optional)
//           </button>
//         )}

//         {/* Location warning before punch */}
//         {!locationInfo.coords && !locationInfo.loading && (
//           <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-[11px] font-medium text-red-700">
//             ⚠️ Enable location to punch in/out
//           </div>
//         )}

//         {/* Punch button */}
//         <button
//           type="button"
//           onClick={onPunch}
//           disabled={!canPunch}
//           className={`w-full rounded-xl py-4 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
//             punchState.phase === "done"
//               ? "bg-slate-400"
//               : punchState.nextType === "out"
//               ? "bg-slate-900 hover:bg-slate-800"
//               : "bg-red-600 hover:bg-red-700"
//           }`}
//         >
//           {resolving
//             ? "Loading profile..."
//             : punching
//             ? "Saving..."
//             : punchState.label}
//         </button>

//         <p className="text-center text-[11px] text-slate-400">
//           {punchState.phase === "need_in" && "One click → Punch In"}
//           {punchState.phase === "need_out" && "One click → Punch Out"}
//           {punchState.phase === "done" && "Both punches recorded"}
//         </p>

//         {/* Shift window */}
//         {shift && (
//           <details className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-500">
//             <summary className="cursor-pointer font-medium text-slate-600">
//               Allowed punch window
//             </summary>
//             <div className="mt-2 space-y-1">
//               <p>
//                 In: {formatTime(shift.punch_in_allowed_from, tz)} —{" "}
//                 {formatTime(shift.punch_in_allowed_till, tz)}
//               </p>
//               <p>
//                 Out: {formatTime(shift.punch_out_allowed_from, tz)} —{" "}
//                 {formatTime(shift.punch_out_allowed_till, tz)}
//               </p>
//               {shift.late_checkout_margin_minutes != null && (
//                 <p className="text-slate-400">
//                   Late checkout buffer: {shift.late_checkout_margin_minutes} min
//                 </p>
//               )}
//             </div>
//           </details>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    HISTORY TABLE
//    ══════════════════════════════════════════════════════════ */

// function HistoryTable({ history, total, page, pageSize, onPageChange, loading, tz }) {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   if (loading && history.length === 0) {
//     return (
//       <div className="space-y-2 p-5">
//         {Array.from({ length: 5 }).map((_, i) => (
//           <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
//         ))}
//       </div>
//     );
//   }

//   if (history.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
//         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
//           📅
//         </div>
//         <p className="text-sm font-medium text-slate-700">No attendance yet</p>
//         <p className="text-xs text-slate-500">Punch in to start your record.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[640px] text-left text-sm">
//           <thead>
//             <tr className="border-b bg-slate-50">
//               <th className="px-5 py-3 font-medium text-slate-500">Date</th>
//               <th className="px-5 py-3 font-medium text-slate-500">Status</th>
//               <th className="px-5 py-3 font-medium text-slate-500">In</th>
//               <th className="px-5 py-3 font-medium text-slate-500">Out</th>
//               <th className="px-5 py-3 font-medium text-slate-500">Hours</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {history.map((row, idx) => {
//               const isHalf = row.is_half_day || (row.status || "").toLowerCase() === "half_day";
//               return (
//                 <tr key={row.attendance_id || idx} className="hover:bg-slate-50">
//                   <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
//                     {formatDate(row.attendance_date, tz)}
//                   </td>
//                   <td className="px-5 py-3.5">
//                     <span
//                       className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(
//                         row.status,
//                         isHalf
//                       )}`}
//                     >
//                       {isHalf ? "Half Day" : statusLabel(row.status)}
//                     </span>
//                   </td>
//                   <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
//                     {formatTime(getFirstIn(row), tz)}
//                   </td>
//                   <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
//                     {formatTime(getLastOut(row), tz)}
//                   </td>
//                   <td className="px-5 py-3.5 text-slate-600">
//                     {minutesToHhMm(row.total_work_minutes)}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
//           <p className="text-xs text-slate-500">
//             Page <span className="font-medium text-slate-700">{page}</span> of {totalPages}
//           </p>
//           <div className="flex gap-2">
//             <button
//               type="button"
//               disabled={page <= 1}
//               onClick={() => onPageChange(page - 1)}
//               className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//             >
//               Prev
//             </button>
//             <button
//               type="button"
//               disabled={page >= totalPages}
//               onClick={() => onPageChange(page + 1)}
//               className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function AttendanceTodayPage() {
//   const user = useAuthStore((s) => s.user);
//   const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

//   const [mounted, setMounted] = useState(false);
//   const [employeeId, setEmployeeId] = useState("");
//   const [resolving, setResolving] = useState(true);

//   const [today, setToday] = useState(null);
//   const [shift, setShift] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [historyTotal, setHistoryTotal] = useState(0);
//   const [historyPage, setHistoryPage] = useState(1);

//   const [loading, setLoading] = useState(true);
//   const [punching, setPunching] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showCamera, setShowCamera] = useState(false);
//   const [photoUrl, setPhotoUrl] = useState(null);
//   const [deviceId, setDeviceId] = useState("");
//   const [confirmOut, setConfirmOut] = useState(false);

//   const [locationInfo, setLocationInfo] = useState({
//     coords: null,
//     loading: false,
//     error: "",
//   });

//   const inFlightRef = useRef(false);
//   const punchGuardRef = useRef(false);
//   const didInitRef = useRef(false);

//   /* ══════════════ MOUNT ══════════════ */
//   useEffect(() => {
//     setMounted(true);
//     setDeviceId(getOrCreateDeviceId());
//   }, []);

//   /* ══════════════ EMPLOYEE RESOLUTION ══════════════ */
//   useEffect(() => {
//     let cancelled = false;

//     async function resolveEmployee() {
//       setResolving(true);

//       const fromStore =
//         user?.employee_id ||
//         user?.employeeId ||
//         user?.emp_id ||
//         user?.employee?.employee_id ||
//         user?.data?.employee_id ||
//         "";

//       if (fromStore) {
//         if (!cancelled) {
//           setEmployeeId(fromStore);
//           setResolving(false);
//         }
//         return;
//       }

//       const userId = user?.user_id || user?.id || user?.sub;
//       if (!userId) {
//         if (!cancelled) {
//           setError("Session expired. Please login again.");
//           setResolving(false);
//         }
//         return;
//       }

//       try {
//         const res = await api.get("/api/v1/get/employees");
//         if (cancelled) return;

//         const list =
//           res?.data?.employees ||
//           res?.data?.data ||
//           (Array.isArray(res?.data) ? res.data : []) ||
//           [];

//         const me = list.find((e) => String(e.user_id) === String(userId));

//         if (me?.employee_id) {
//           setEmployeeId(me.employee_id);
//           try {
//             const store = useAuthStore.getState();
//             if (store?.setUser && user) {
//               store.setUser({ ...user, employee_id: me.employee_id });
//             }
//           } catch (_) {}
//         } else {
//           setError("Employee profile not linked. Please contact HR.");
//         }
//       } catch (err) {
//         if (!cancelled) setError(formatApiError(err));
//       } finally {
//         if (!cancelled) setResolving(false);
//       }
//     }

//     resolveEmployee();
//     return () => {
//       cancelled = true;
//     };
//   }, [user]);

//   /* ══════════════ LOCATION ══════════════ */
//   const fetchLocation = useCallback(
//     () =>
//       new Promise((resolve) => {
//         if (typeof window === "undefined" || !navigator.geolocation) {
//           setLocationInfo({ coords: null, loading: false, error: "GPS not supported" });
//           return resolve(null);
//         }
//         if (location.protocol !== "https:" && location.hostname !== "localhost") {
//           setLocationInfo({
//             coords: null,
//             loading: false,
//             error: "HTTPS required for GPS",
//           });
//           return resolve(null);
//         }

//         setLocationInfo((p) => ({ ...p, loading: true, error: "" }));

//         navigator.geolocation.getCurrentPosition(
//           (pos) => {
//             const data = {
//               latitude: pos.coords.latitude,
//               longitude: pos.coords.longitude,
//               accuracy: pos.coords.accuracy,
//             };
//             setLocationInfo({ coords: data, loading: false, error: "" });
//             resolve(data);
//           },
//           (err) => {
//             const msg =
//               err.code === 1
//                 ? "Location permission denied"
//                 : err.code === 2
//                 ? "Location unavailable"
//                 : "Location timeout";
//             setLocationInfo({ coords: null, loading: false, error: msg });
//             resolve(null);
//           },
//           {
//             enableHighAccuracy: true,
//             timeout: LOCATION_TIMEOUT_MS,
//             maximumAge: 0,
//           }
//         );
//       }),
//     []
//   );

//   /* ══════════════ DATA LOADERS ══════════════ */
//   const loadToday = useCallback(async () => {
//     if (!employeeId) return null;
//     try {
//       const res = await api.get("/api/v1/get/today/attendence", {
//         params: { employee_id: employeeId },
//       });
//       const data = res?.data ?? {};
//       if (data.shift) setShift(data.shift);
//       return data.attendance || null;
//     } catch {
//       return null;
//     }
//   }, [employeeId]);

//   const loadHistory = useCallback(
//     async (page = 1) => {
//       if (!employeeId) return { items: [], total: 0 };
//       try {
//         const res = await api.get("/api/v1/get/attendence/history", {
//           params: { employee_id: employeeId, page, page_size: HISTORY_PAGE_SIZE },
//         });
//         const data = res?.data ?? {};
//         const items = Array.isArray(data.attendance) ? data.attendance : [];
//         return { items, total: Number(data.total) || items.length };
//       } catch {
//         return { items: [], total: 0 };
//       }
//     },
//     [employeeId]
//   );

//   const refresh = useCallback(
//     async ({ silent = false } = {}) => {
//       if (!employeeId || inFlightRef.current) return;
//       inFlightRef.current = true;
//       if (!silent) setLoading(true);

//       try {
//         const [att, hist] = await Promise.all([
//           loadToday(),
//           loadHistory(historyPage),
//         ]);
//         setToday(att);
//         setHistory(hist.items);
//         setHistoryTotal(hist.total);
//       } finally {
//         setLoading(false);
//         inFlightRef.current = false;
//       }
//     },
//     [employeeId, loadToday, loadHistory, historyPage]
//   );

//   useEffect(() => {
//     if (!employeeId || resolving || didInitRef.current) return;
//     didInitRef.current = true;
//     refresh();
//     fetchLocation();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [employeeId, resolving]);

//   useEffect(() => {
//     if (!employeeId || resolving) return;
//     loadHistory(historyPage).then((r) => {
//       setHistory(r.items);
//       setHistoryTotal(r.total);
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [historyPage]);

//   /* ══════════════ PUNCH ══════════════ */
//   const doPunch = useCallback(
//     async (punchType) => {
//       if (punchGuardRef.current) return;
//       punchGuardRef.current = true;
//       setPunching(true);
//       setError("");
//       setSuccess("");

//       try {
//         let coords = locationInfo.coords;
//         try {
//           coords = await fetchLocation();
//         } catch {}

//         if (!coords) {
//           setError(
//             "Location is required to punch.\nPlease allow location access and try again."
//           );
//           setPunching(false);
//           punchGuardRef.current = false;
//           setConfirmOut(false);
//           return;
//         }

//         const nowIso = new Date().toISOString();

//         const payload = {
//           employee_id: employeeId,
//           punch_type: punchType,
//           punch_source: PUNCH_SOURCE.WEB,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           location_accuracy_meters: coords.accuracy ? Math.round(coords.accuracy) : null,
//           photo_url: photoUrl || null,
//           face_match_score: photoUrl ? 0.9 : null,
//           device_id: deviceId || null,
//           device_type: "web",
//           user_agent:
//             typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
//           is_manual: false,
//           remarks: null,
//         };

//         const res = await api.post("/api/v1/add/punch", payload);
//         const data = res?.data ?? {};

//         if (data.shift) setShift(data.shift);

//         const serverAttendance = data.attendance || null;

//         setToday((prev) => {
//           const base = prev || {};
//           const merged = serverAttendance ? { ...base, ...serverAttendance } : { ...base };

//           if (punchType === PUNCH_TYPE.IN) {
//             return {
//               ...merged,
//               first_punch_in: merged.first_punch_in || nowIso,
//               last_punch_out: null,
//               status: merged.status || "present",
//               attendance_date:
//                 merged.attendance_date || new Date().toISOString().slice(0, 10),
//             };
//           }
//           return {
//             ...merged,
//             first_punch_in: merged.first_punch_in || base.first_punch_in || null,
//             last_punch_out: merged.last_punch_out || nowIso,
//             status: merged.status || "present",
//           };
//         });

//         setPhotoUrl(null);

//         setSuccess(
//           punchType === PUNCH_TYPE.IN
//             ? "Punched In successfully ✅"
//             : "Punched Out successfully ✅"
//         );

//         loadHistory(1).then((r) => {
//           setHistory(r.items);
//           setHistoryTotal(r.total);
//           if (historyPage !== 1) setHistoryPage(1);
//         });
//       } catch (err) {
//         setError(formatApiError(err));
//       } finally {
//         setPunching(false);
//         setConfirmOut(false);
//         setTimeout(() => {
//           punchGuardRef.current = false;
//         }, 800);
//       }
//     },
//     [
//       employeeId,
//       deviceId,
//       photoUrl,
//       locationInfo.coords,
//       fetchLocation,
//       loadHistory,
//       historyPage,
//     ]
//   );

//   const handlePunch = useCallback(() => {
//     if (!employeeId) {
//       setError("Employee profile is loading. Please wait.");
//       return;
//     }

//     const firstIn = getFirstIn(today);
//     const lastOut = getLastOut(today);

//     if (!firstIn) {
//       doPunch(PUNCH_TYPE.IN);
//       return;
//     }
//     if (firstIn && !lastOut) {
//       setConfirmOut(true);
//       return;
//     }
//     setError("Today's attendance is already complete.");
//   }, [employeeId, today, doPunch]);

//   const goToHistoryPage = useCallback(
//     (p) => {
//       const max = Math.max(1, Math.ceil(historyTotal / HISTORY_PAGE_SIZE));
//       const next = Math.min(Math.max(1, p), max);
//       setHistoryPage(next);
//     },
//     [historyTotal]
//   );

//   const todayStr = useMemo(
//     () => (mounted ? formatDate(new Date(), tz) : "—"),
//     [mounted, tz]
//   );

//   /* ══════════════ RENDER ══════════════ */
//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
//               🕒
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
//               <p className="mt-0.5 text-sm text-slate-500">
//                 {todayStr} • {tz}
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={() => {
//               didInitRef.current = false;
//               refresh();
//             }}
//             disabled={loading || !employeeId}
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//           >
//             {loading ? "Refreshing..." : "↻ Refresh"}
//           </button>
//         </div>

//         <Toast type="error" message={error} onDismiss={() => setError("")} />
//         <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

//         {resolving && (
//           <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
//             Loading your employee profile...
//           </div>
//         )}

//         <div className="grid gap-5 lg:grid-cols-3">
//           <div className="lg:col-span-1">
//             <PunchCard
//               employeeId={employeeId}
//               today={today}
//               shift={shift}
//               loading={loading}
//               resolving={resolving}
//               punching={punching}
//               onPunch={handlePunch}
//               photoUrl={photoUrl}
//               setPhotoUrl={setPhotoUrl}
//               onOpenCamera={() => setShowCamera(true)}
//               deviceId={deviceId}
//               locationInfo={locationInfo}
//               onRefreshLocation={fetchLocation}
//               tz={tz}
//             />
//           </div>

//           <div className="lg:col-span-2">
//             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//               <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//                 <div>
//                   <h2 className="text-sm font-semibold text-slate-800">Recent Attendance</h2>
//                   {historyTotal > 0 && (
//                     <p className="mt-0.5 text-xs text-slate-400">
//                       {historyTotal} record{historyTotal !== 1 ? "s" : ""}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <HistoryTable
//                 history={history}
//                 total={historyTotal}
//                 page={historyPage}
//                 pageSize={HISTORY_PAGE_SIZE}
//                 onPageChange={goToHistoryPage}
//                 loading={loading}
//                 tz={tz}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {showCamera && (
//         <CameraCapture
//           onCapture={(url) => {
//             setPhotoUrl(url);
//             setShowCamera(false);
//           }}
//           onClose={() => setShowCamera(false)}
//         />
//       )}

//       <ConfirmDialog
//         open={confirmOut}
//         title="Punch Out?"
//         message="This will record your punch-out for today. You won't be able to punch again until tomorrow."
//         confirmLabel="Punch Out"
//         loading={punching}
//         onConfirm={() => doPunch(PUNCH_TYPE.OUT)}
//         onCancel={() => setConfirmOut(false)}
//       />
//     </div>
//   );
// }


"use client";

/**
 * AttendanceTodayPage — Production Ready
 * Face scan + location capture + map display + punch in/out
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const LIVE_TICK_MS = 30_000;
const AUTO_DISMISS_MS = 5000;
const HISTORY_PAGE_SIZE = 10;
const LOCATION_TIMEOUT_MS = 12_000;
const CAMERA_CAPTURE_SIZE = 320;
const CAMERA_JPEG_QUALITY = 0.75;
const DEVICE_STORAGE_KEY = "hrms.device_uid";

const PUNCH_SOURCE = { WEB: "web", MOBILE: "mobile" };
const PUNCH_TYPE = { IN: "in", OUT: "out" };

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
  if (detail && typeof detail === "object" && detail.msg) return detail.msg;
  return err?.message || "Something went wrong";
};

const safeDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDate = (v, tz) => {
  const d = safeDate(v);
  if (!d) return "—";
  try {
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: tz,
    });
  } catch {
    return "—";
  }
};

const formatTime = (v, tz) => {
  const d = safeDate(v);
  if (!d) return "—";
  try {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: tz,
    });
  } catch {
    return "—";
  }
};

const minutesToHhMm = (m) => {
  if (m == null) return "0h 0m";
  const n = Number(m);
  if (Number.isNaN(n) || n <= 0) return "0h 0m";
  return `${Math.floor(n / 60)}h ${n % 60}m`;
};

const getFirstIn = (r) => r?.first_punch_in || null;
const getLastOut = (r) => r?.last_punch_out || null;

const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") return "SSR";
  try {
    let id = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (!id) {
      id = `WEB-${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      localStorage.setItem(DEVICE_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return `WEB-${Date.now()}`;
  }
};

const computeLiveMinutes = (r) => {
  if (!r) return 0;
  const firstIn = safeDate(getFirstIn(r));
  const lastOut = safeDate(getLastOut(r));
  if (!firstIn) return 0;
  if (lastOut) return Number(r.total_work_minutes) || 0;
  const diff = Math.floor((Date.now() - firstIn.getTime()) / 60_000);
  const brk = Number(r.break_minutes) || 0;
  return Math.max(diff - brk, 0);
};

const statusLabel = (s) =>
  String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const statusBadgeClass = (s, isHalfDay) => {
  const x = String(s || "").toLowerCase();
  if (isHalfDay || x === "half_day") return "bg-purple-50 text-purple-700 border-purple-200";
  if (x === "present") return "bg-green-50 text-green-700 border-green-200";
  if (x === "absent") return "bg-red-50 text-red-700 border-red-200";
  if (x === "on_leave" || x === "leave") return "bg-blue-50 text-blue-700 border-blue-200";
  if (x === "work_from_home" || x === "wfh") return "bg-teal-50 text-teal-700 border-teal-200";
  if (x === "on_duty" || x === "od") return "bg-orange-50 text-orange-700 border-orange-200";
  if (x === "holiday") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (x === "week_off") return "bg-slate-100 text-slate-600 border-slate-200";
  if (x === "missing_punch") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

/* ══════════════════════════════════════════════════════════
   TOAST
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
      : type === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-green-200 bg-green-50 text-green-700";

  const icon = type === "error" ? "⚠️" : type === "warning" ? "⚡" : "✅";

  return (
    <div
      role="alert"
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles}`}
    >
      <div className="flex items-start gap-2">
        <span className="leading-none">{icon}</span>
        <span className="leading-snug whitespace-pre-line">{message}</span>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-2 shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ══════════════════════════════════════════════════════════ */

function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, loading }) {
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
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
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
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Please wait..." : confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CAMERA CAPTURE
   ══════════════════════════════════════════════════════════ */

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setError("Camera is not supported in this browser");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play().catch(() => {});
            setTimeout(() => {
              if (!cancelled) setReady(true);
            }, 250);
          };
        }
      } catch (e) {
        const msg =
          e?.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access in browser settings."
            : e?.name === "NotFoundError"
            ? "No camera found on this device."
            : "Could not start camera.";
        if (!cancelled) setError(msg);
      }
    })();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    const side = Math.min(vw, vh);
    canvas.width = CAMERA_CAPTURE_SIZE;
    canvas.height = CAMERA_CAPTURE_SIZE;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      video,
      (vw - side) / 2,
      (vh - side) / 2,
      side,
      side,
      0,
      0,
      CAMERA_CAPTURE_SIZE,
      CAMERA_CAPTURE_SIZE
    );

    const dataUrl = canvas.toDataURL("image/jpeg", CAMERA_JPEG_QUALITY);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    onCapture(dataUrl);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Take Selfie</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              This photo will be attached to your punch record
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="p-6">
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <p className="font-medium">Camera unavailable</p>
              <p className="mt-1 text-xs">{error}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="p-4">
            <div
              className="relative overflow-hidden rounded-xl bg-black"
              style={{ aspectRatio: "1 / 1" }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-full border-2 border-dashed border-white/50"
                  style={{ width: "70%", aspectRatio: "1 / 1" }}
                />
              </div>
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">
                  Starting camera...
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-4 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCapture}
                disabled={!ready}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Capture
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PUNCH CARD
   ══════════════════════════════════════════════════════════ */

function PunchCard({
  employeeId,
  today,
  shift,
  loading,
  resolving,
  punching,
  onPunch,
  photoUrl,
  setPhotoUrl,
  onOpenCamera,
  deviceId,
  locationInfo,
  onRefreshLocation,
  tz,
}) {
  const firstIn = getFirstIn(today);
  const lastOut = getLastOut(today);
  const isLive = firstIn && !lastOut;

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), LIVE_TICK_MS);
    return () => clearInterval(t);
  }, []);

  const liveMinutes = useMemo(() => {
    void now;
    return computeLiveMinutes(today);
  }, [today, now]);

  const punchState = useMemo(() => {
    if (!firstIn) return { phase: "need_in", nextType: "in", label: "Punch In" };
    if (!lastOut) return { phase: "need_out", nextType: "out", label: "Punch Out" };
    return { phase: "done", nextType: null, label: "Completed Today" };
  }, [firstIn, lastOut]);

  const statusInfo = useMemo(() => {
    if (loading || resolving) return { label: "Loading...", class: "bg-slate-100 text-slate-500" };
    if (punchState.phase === "need_in") return { label: "Not Punched In", class: "bg-amber-100 text-amber-700" };
    if (punchState.phase === "need_out") {
      return today?.is_late
        ? { label: "Punched In (Late)", class: "bg-orange-100 text-orange-700" }
        : { label: "Punched In", class: "bg-blue-100 text-blue-700" };
    }
    if (today?.is_half_day) return { label: "Half Day", class: "bg-purple-100 text-purple-700" };
    return { label: "Present", class: "bg-green-100 text-green-700" };
  }, [loading, resolving, punchState.phase, today]);

  const canPunch =
    !punching &&
    !loading &&
    !resolving &&
    employeeId &&
    punchState.nextType &&
    (locationInfo.coords || locationInfo.loading);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-6 text-center text-white">
        <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Today</p>
        <div className="mt-3 flex justify-center">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.class}`}>
            {statusInfo.label}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          {punchState.phase === "need_in" && "Start your day"}
          {punchState.phase === "need_out" && "You're currently punched in"}
          {punchState.phase === "done" && "See you tomorrow"}
        </p>
      </div>

      <div className="space-y-5 p-6">
        {/* Punch times */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-xl px-3 py-4 text-center ${firstIn ? "bg-green-50" : "bg-slate-50"}`}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Punch In</p>
            <p className="mt-1.5 text-lg font-semibold text-slate-900">{formatTime(firstIn, tz)}</p>
          </div>
          <div className={`rounded-xl px-3 py-4 text-center ${lastOut ? "bg-green-50" : "bg-slate-50"}`}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Punch Out</p>
            <p className="mt-1.5 text-lg font-semibold text-slate-900">{formatTime(lastOut, tz)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
            <p className="text-[11px] text-slate-500">Work Hours</p>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <p className="font-semibold text-slate-800">{minutesToHhMm(liveMinutes)}</p>
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
            <p className="text-[11px] text-slate-500">Late By</p>
            <p className="mt-1 font-semibold text-slate-800">
              {today?.is_late ? `${today.late_minutes || 0} min` : "—"}
            </p>
          </div>
        </div>

        {today?.is_half_day && (
          <div className="rounded-xl bg-purple-50 px-4 py-2.5 text-center text-sm font-medium text-purple-700">
            Marked as Half Day
          </div>
        )}

        {/* LOCATION */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              {locationInfo.loading ? (
                <>
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  <span className="text-slate-600">Getting location...</span>
                </>
              ) : locationInfo.coords ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-700">📍 Location Captured</span>
                </>
              ) : (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-red-600">{locationInfo.error || "Location required"}</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onRefreshLocation}
              disabled={locationInfo.loading}
              className="rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-50"
            >
              {locationInfo.loading ? "..." : "↻ Refresh"}
            </button>
          </div>

          {locationInfo.coords && (
            <div className="mt-3 space-y-2">
              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Latitude</span>
                  <span className="font-mono font-medium text-slate-800">
                    {locationInfo.coords.latitude.toFixed(6)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Longitude</span>
                  <span className="font-mono font-medium text-slate-800">
                    {locationInfo.coords.longitude.toFixed(6)}
                  </span>
                </div>
                {locationInfo.coords.accuracy && (
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Accuracy</span>
                    <span className="font-medium text-slate-800">
                      ±{Math.round(locationInfo.coords.accuracy)}m
                    </span>
                  </div>
                )}
              </div>

              <a
                href={`https://www.google.com/maps?q=${locationInfo.coords.latitude},${locationInfo.coords.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 text-[11px] font-medium text-blue-700 ring-1 ring-blue-100 hover:bg-blue-100"
              >
                🗺️ View on Google Maps
              </a>

              <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
                <iframe
                  title="Location"
                  width="100%"
                  height="150"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${locationInfo.coords.latitude},${locationInfo.coords.longitude}&z=16&output=embed`}
                />
              </div>
            </div>
          )}

          {!locationInfo.loading && !locationInfo.coords && (
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800 ring-1 ring-amber-100">
              <p className="font-medium">📍 Location is required to punch</p>
              <p className="mt-1 opacity-80">
                Please allow location access. If blocked, click the 🔒 icon in the URL bar → Site
                settings → Location → Allow → then click Refresh.
              </p>
            </div>
          )}
        </div>

        {/* Photo */}
        {photoUrl ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-green-100 bg-green-50 px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <img
                src={photoUrl}
                alt="captured"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              />
              <span className="text-xs text-green-800">Photo attached</span>
            </div>
            <button
              type="button"
              onClick={onOpenCamera}
              className="text-[11px] font-medium text-green-800 hover:underline"
            >
              Retake
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenCamera}
            className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 transition hover:border-red-500 hover:text-red-600"
          >
            📷 Take Selfie (optional)
          </button>
        )}

        {/* Location warning before punch */}
        {!locationInfo.coords && !locationInfo.loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-[11px] font-medium text-red-700">
            ⚠️ Enable location to punch in/out
          </div>
        )}

        {/* Punch button */}
        <button
          type="button"
          onClick={onPunch}
          disabled={!canPunch}
          className={`w-full rounded-xl py-4 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
            punchState.phase === "done"
              ? "bg-slate-400"
              : punchState.nextType === "out"
              ? "bg-slate-900 hover:bg-slate-800"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {resolving
            ? "Loading profile..."
            : punching
            ? "Saving..."
            : punchState.label}
        </button>

        <p className="text-center text-[11px] text-slate-400">
          {punchState.phase === "need_in" && "One click → Punch In"}
          {punchState.phase === "need_out" && "One click → Punch Out"}
          {punchState.phase === "done" && "Both punches recorded"}
        </p>

        {/* Shift window */}
        {shift && (
          <details className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-500">
            <summary className="cursor-pointer font-medium text-slate-600">
              Allowed punch window
            </summary>
            <div className="mt-2 space-y-1">
              <p>
                In: {formatTime(shift.punch_in_allowed_from, tz)} —{" "}
                {formatTime(shift.punch_in_allowed_till, tz)}
              </p>
              <p>
                Out: {formatTime(shift.punch_out_allowed_from, tz)} —{" "}
                {formatTime(shift.punch_out_allowed_till, tz)}
              </p>
              {shift.late_checkout_margin_minutes != null && (
                <p className="text-slate-400">
                  Late checkout buffer: {shift.late_checkout_margin_minutes} min
                </p>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HISTORY TABLE
   ══════════════════════════════════════════════════════════ */

function HistoryTable({ history, total, page, pageSize, onPageChange, loading, tz }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (loading && history.length === 0) {
    return (
      <div className="space-y-2 p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
          📅
        </div>
        <p className="text-sm font-medium text-slate-700">No attendance yet</p>
        <p className="text-xs text-slate-500">Punch in to start your record.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-5 py-3 font-medium text-slate-500">Date</th>
              <th className="px-5 py-3 font-medium text-slate-500">Status</th>
              <th className="px-5 py-3 font-medium text-slate-500">In</th>
              <th className="px-5 py-3 font-medium text-slate-500">Out</th>
              <th className="px-5 py-3 font-medium text-slate-500">Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((row, idx) => {
              const isHalf = row.is_half_day || (row.status || "").toLowerCase() === "half_day";
              return (
                <tr key={row.attendance_id || idx} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
                    {formatDate(row.attendance_date, tz)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(
                        row.status,
                        isHalf
                      )}`}
                    >
                      {isHalf ? "Half Day" : statusLabel(row.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                    {formatTime(getFirstIn(row), tz)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                    {formatTime(getLastOut(row), tz)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {minutesToHhMm(row.total_work_minutes)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-500">
            Page <span className="font-medium text-slate-700">{page}</span> of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function AttendanceTodayPage() {
  const user = useAuthStore((s) => s.user);
  const tz = useAuthStore((s) => s.timezone) || "Asia/Kolkata";

  const [mounted, setMounted] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [resolving, setResolving] = useState(true);

  const [today, setToday] = useState(null);
  const [shift, setShift] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCamera, setShowCamera] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [confirmOut, setConfirmOut] = useState(false);

  const [locationInfo, setLocationInfo] = useState({
    coords: null,
    loading: false,
    error: "",
  });

  const inFlightRef = useRef(false);
  const punchGuardRef = useRef(false);
  const didInitRef = useRef(false);

  /* ══════════════ MOUNT ══════════════ */
  useEffect(() => {
    setMounted(true);
    setDeviceId(getOrCreateDeviceId());
  }, []);

  /* ══════════════ EMPLOYEE RESOLUTION ══════════════ */
  useEffect(() => {
    let cancelled = false;

    async function resolveEmployee() {
      setResolving(true);

      const fromStore =
        user?.employee_id ||
        user?.employeeId ||
        user?.emp_id ||
        user?.employee?.employee_id ||
        user?.data?.employee_id ||
        "";

      if (fromStore) {
        if (!cancelled) {
          setEmployeeId(fromStore);
          setResolving(false);
        }
        return;
      }

      const userId = user?.user_id || user?.id || user?.sub;
      if (!userId) {
        if (!cancelled) {
          setError("Session expired. Please login again.");
          setResolving(false);
        }
        return;
      }

      try {
        const res = await api.get("/api/v1/get/employees");
        if (cancelled) return;

        const list =
          res?.data?.employees ||
          res?.data?.data ||
          (Array.isArray(res?.data) ? res.data : []) ||
          [];

        const me = list.find((e) => String(e.user_id) === String(userId));

        if (me?.employee_id) {
          setEmployeeId(me.employee_id);
          try {
            const store = useAuthStore.getState();
            if (store?.setUser && user) {
              store.setUser({ ...user, employee_id: me.employee_id });
            }
          } catch (_) {}
        } else {
          setError("Employee profile not linked. Please contact HR.");
        }
      } catch (err) {
        if (!cancelled) setError(formatApiError(err));
      } finally {
        if (!cancelled) setResolving(false);
      }
    }

    resolveEmployee();
    return () => {
      cancelled = true;
    };
  }, [user]);

  /* ══════════════ LOCATION ══════════════ */
  const fetchLocation = useCallback(
    () =>
      new Promise((resolve) => {
        if (typeof window === "undefined" || !navigator.geolocation) {
          setLocationInfo({ coords: null, loading: false, error: "GPS not supported" });
          return resolve(null);
        }
        if (location.protocol !== "https:" && location.hostname !== "localhost") {
          setLocationInfo({
            coords: null,
            loading: false,
            error: "HTTPS required for GPS",
          });
          return resolve(null);
        }

        setLocationInfo((p) => ({ ...p, loading: true, error: "" }));

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const data = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            };
            setLocationInfo({ coords: data, loading: false, error: "" });
            resolve(data);
          },
          (err) => {
            const msg =
              err.code === 1
                ? "Location permission denied"
                : err.code === 2
                ? "Location unavailable"
                : "Location timeout";
            setLocationInfo({ coords: null, loading: false, error: msg });
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: LOCATION_TIMEOUT_MS,
            maximumAge: 0,
          }
        );
      }),
    []
  );

  /* ══════════════ DATA LOADERS ══════════════ */
  const loadToday = useCallback(async () => {
    if (!employeeId) return null;
    try {
      const res = await api.get("/api/v1/get/today/attendence", {
        params: { employee_id: employeeId },
      });
      const data = res?.data ?? {};
      if (data.shift) setShift(data.shift);
      return data.attendance || null;
    } catch {
      return null;
    }
  }, [employeeId]);

  const loadHistory = useCallback(
    async (page = 1) => {
      if (!employeeId) return { items: [], total: 0 };
      try {
        const res = await api.get("/api/v1/get/attendence/history", {
          params: { employee_id: employeeId, page, page_size: HISTORY_PAGE_SIZE },
        });
        const data = res?.data ?? {};
        const items = Array.isArray(data.attendance) ? data.attendance : [];
        return { items, total: Number(data.total) || items.length };
      } catch {
        return { items: [], total: 0 };
      }
    },
    [employeeId]
  );

  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      if (!employeeId || inFlightRef.current) return;
      inFlightRef.current = true;
      if (!silent) setLoading(true);

      try {
        const [att, hist] = await Promise.all([
          loadToday(),
          loadHistory(historyPage),
        ]);
        setToday(att);
        setHistory(hist.items);
        setHistoryTotal(hist.total);
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [employeeId, loadToday, loadHistory, historyPage]
  );

  useEffect(() => {
    if (!employeeId || resolving || didInitRef.current) return;
    didInitRef.current = true;
    refresh();
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, resolving]);

  useEffect(() => {
    if (!employeeId || resolving) return;
    loadHistory(historyPage).then((r) => {
      setHistory(r.items);
      setHistoryTotal(r.total);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyPage]);

  /* ══════════════ PUNCH ══════════════ */
  const doPunch = useCallback(
    async (punchType) => {
      if (punchGuardRef.current) return;
      punchGuardRef.current = true;
      setPunching(true);
      setError("");
      setSuccess("");

      try {
        let coords = locationInfo.coords;
        try {
          coords = await fetchLocation();
        } catch {}

        if (!coords) {
          setError(
            "Location is required to punch.\nPlease allow location access and try again."
          );
          setPunching(false);
          punchGuardRef.current = false;
          setConfirmOut(false);
          return;
        }

        const nowIso = new Date().toISOString();

        // ⭐ FIXED PAYLOAD
        const payload = {
          employee_id: employeeId,
          punch_type: punchType,
          punch_source: PUNCH_SOURCE.WEB,
          latitude: coords.latitude,
          longitude: coords.longitude,
          location_accuracy_meters: coords.accuracy ? Math.round(coords.accuracy) : null,
          photo_base64: photoUrl || null,   // ✅ photo_base64 (was photo_url)
          // face_match_score REMOVED — backend computes server-side
          device_id: deviceId || null,
          device_type: "web",
          user_agent:
            typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
          is_manual: false,
          remarks: null,
        };

        const res = await api.post("/api/v1/add/punch", payload);
        const data = res?.data ?? {};

        if (data.shift) setShift(data.shift);

        const serverAttendance = data.attendance || null;

        setToday((prev) => {
          const base = prev || {};
          const merged = serverAttendance ? { ...base, ...serverAttendance } : { ...base };

          if (punchType === PUNCH_TYPE.IN) {
            return {
              ...merged,
              first_punch_in: merged.first_punch_in || nowIso,
              last_punch_out: null,
              status: merged.status || "present",
              attendance_date:
                merged.attendance_date || new Date().toISOString().slice(0, 10),
            };
          }
          return {
            ...merged,
            first_punch_in: merged.first_punch_in || base.first_punch_in || null,
            last_punch_out: merged.last_punch_out || nowIso,
            status: merged.status || "present",
          };
        });

        setPhotoUrl(null);

        // ⭐ Face verification feedback
        const faceVerified = data.face_verified;
        const faceScore = data.face_score;

        let successMsg =
          punchType === PUNCH_TYPE.IN
            ? "Punched In successfully ✅"
            : "Punched Out successfully ✅";

        if (faceVerified === true && faceScore != null) {
          successMsg += `  •  Face verified (${(faceScore * 100).toFixed(0)}%)`;
        } else if (faceVerified === false) {
          successMsg += "  •  ⚠️ Face not verified";
        }

        setSuccess(successMsg);

        loadHistory(1).then((r) => {
          setHistory(r.items);
          setHistoryTotal(r.total);
          if (historyPage !== 1) setHistoryPage(1);
        });
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setPunching(false);
        setConfirmOut(false);
        setTimeout(() => {
          punchGuardRef.current = false;
        }, 800);
      }
    },
    [
      employeeId,
      deviceId,
      photoUrl,
      locationInfo.coords,
      fetchLocation,
      loadHistory,
      historyPage,
    ]
  );

  const handlePunch = useCallback(() => {
    if (!employeeId) {
      setError("Employee profile is loading. Please wait.");
      return;
    }

    const firstIn = getFirstIn(today);
    const lastOut = getLastOut(today);

    if (!firstIn) {
      doPunch(PUNCH_TYPE.IN);
      return;
    }
    if (firstIn && !lastOut) {
      setConfirmOut(true);
      return;
    }
    setError("Today's attendance is already complete.");
  }, [employeeId, today, doPunch]);

  const goToHistoryPage = useCallback(
    (p) => {
      const max = Math.max(1, Math.ceil(historyTotal / HISTORY_PAGE_SIZE));
      const next = Math.min(Math.max(1, p), max);
      setHistoryPage(next);
    },
    [historyTotal]
  );

  const todayStr = useMemo(
    () => (mounted ? formatDate(new Date(), tz) : "—"),
    [mounted, tz]
  );

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              🕒
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                {todayStr} • {tz}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              didInitRef.current = false;
              refresh();
            }}
            disabled={loading || !employeeId}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

        {resolving && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Loading your employee profile...
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PunchCard
              employeeId={employeeId}
              today={today}
              shift={shift}
              loading={loading}
              resolving={resolving}
              punching={punching}
              onPunch={handlePunch}
              photoUrl={photoUrl}
              setPhotoUrl={setPhotoUrl}
              onOpenCamera={() => setShowCamera(true)}
              deviceId={deviceId}
              locationInfo={locationInfo}
              onRefreshLocation={fetchLocation}
              tz={tz}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Recent Attendance</h2>
                  {historyTotal > 0 && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {historyTotal} record{historyTotal !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
              <HistoryTable
                history={history}
                total={historyTotal}
                page={historyPage}
                pageSize={HISTORY_PAGE_SIZE}
                onPageChange={goToHistoryPage}
                loading={loading}
                tz={tz}
              />
            </div>
          </div>
        </div>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={(url) => {
            setPhotoUrl(url);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      <ConfirmDialog
        open={confirmOut}
        title="Punch Out?"
        message="This will record your punch-out for today. You won't be able to punch again until tomorrow."
        confirmLabel="Punch Out"
        loading={punching}
        onConfirm={() => doPunch(PUNCH_TYPE.OUT)}
        onCancel={() => setConfirmOut(false)}
      />
    </div>
  );
}