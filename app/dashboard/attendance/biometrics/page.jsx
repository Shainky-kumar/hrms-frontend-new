
// // // "use client";

// // // import { useEffect, useState, useRef, useCallback } from "react";
// // // import * as faceapi from "face-api.js";
// // // import { api } from "@/lib/api";

// // // const formatApiError = (err) => {
// // //   const detail = err?.response?.data?.detail;
// // //   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
// // //   if (typeof detail === "string") return detail;
// // //   return err?.message || "Something went wrong";
// // // };

// // // const toArray = (p) => {
// // //   if (!p) return [];
// // //   if (Array.isArray(p)) return p;
// // //   if (Array.isArray(p?.biometrics)) return p.biometrics;
// // //   if (Array.isArray(p?.employees)) return p.employees;
// // //   if (Array.isArray(p?.data)) return p.data;
// // //   if (Array.isArray(p?.items)) return p.items;
// // //   return [];
// // // };

// // // const formatDateTime = (d) => {
// // //   if (!d) return "—";
// // //   try {
// // //     return new Date(d).toLocaleString("en-IN", {
// // //       day: "2-digit",
// // //       month: "short",
// // //       year: "numeric",
// // //       hour: "2-digit",
// // //       minute: "2-digit",
// // //     });
// // //   } catch {
// // //     return String(d);
// // //   }
// // // };

// // // // ---------- Blink detection helper (Eye Aspect Ratio) ----------
// // // const EAR = (eye) => {
// // //   const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
// // //   const v1 = dist(eye[1], eye[5]);
// // //   const v2 = dist(eye[2], eye[4]);
// // //   const h = dist(eye[0], eye[3]);
// // //   return (v1 + v2) / (2 * h);
// // // };

// // // export default function BiometricsPage() {
// // //   const [list, setList] = useState([]);
// // //   const [employees, setEmployees] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");
// // //   const [showForm, setShowForm] = useState(false);
// // //   const [editId, setEditId] = useState(null);
// // //   const [search, setSearch] = useState("");
// // //   const [page, setPage] = useState(1);

// // //   // Camera + scan states
// // //   const [cameraOpen, setCameraOpen] = useState(false);
// // //   const [capturedImage, setCapturedImage] = useState(null);
// // //   const [modelsReady, setModelsReady] = useState(false);
// // //   // scanStatus: idle | scanning | face_found | blinked | error
// // //   const [scanStatus, setScanStatus] = useState("idle");
// // //   const [scanMessage, setScanMessage] = useState("");

// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null);
// // //   const streamRef = useRef(null);
// // //   const rafRef = useRef(null);
// // //   const detectLoopRef = useRef(null);
// // //   const earHistory = useRef([]);
// // //   const blinkCaught = useRef(false);

// // //   const [form, setForm] = useState({
// // //     employee_id: "",
// // //     face_image_url: "",
// // //     device_id: "",
// // //     is_active: true,
// // //   });

// // //   const fetchList = useCallback(async () => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const res = await api.get("/api/v1/get/employee/biometrics", {
// // //         params: { page, page_size: 10, search: search || undefined },
// // //       });
// // //       setList(toArray(res?.data));
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //       setList([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [page, search]);

// // //   const fetchEmployees = useCallback(async () => {
// // //     try {
// // //       const res = await api.get("/api/v1/get/employees", {
// // //         params: { page: 1, page_size: 300 },
// // //       });
// // //       setEmployees(toArray(res?.data));
// // //     } catch (err) {
// // //       console.error("Employees load error", err);
// // //       setEmployees([]);
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       void fetchList();
// // //     }, 0);

    
// // //     return () => clearTimeout(timer);
// // //   }, [fetchList]);

// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       void fetchEmployees();
// // //     }, 0);

// // //     return () => clearTimeout(timer);
// // //   }, [fetchEmployees]);

// // //   // ---------- Camera control ----------
// // //   const stopCamera = () => {
// // //     if (rafRef.current) cancelAnimationFrame(rafRef.current);
// // //     if (streamRef.current) {
// // //       streamRef.current.getTracks().forEach((track) => track.stop());
// // //       streamRef.current = null;
// // //     }
// // //     setCameraOpen(false);
// // //     setScanStatus("idle");
// // //   };

// // //   // Load face-api models once on mount
// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const MODEL_URL = "/models";
// // //         await Promise.all([
// // //           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
// // //           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
// // //         ]);
// // //         queueMicrotask(() => setModelsReady(true));
// // //       } catch (e) {
// // //         console.error("Face model load failed", e);
// // //       }
// // //     })();
// // //     return () => stopCamera();
// // //   }, []);

// // //   const openCamera = async () => {
// // //     setError("");
// // //     setCapturedImage(null);

// // //     if (!modelsReady) {
// // //       setError("Face detection is still loading. Please wait a second and try again.");
// // //       return;
      
// // //     }

// // //     try {
// // //       const stream = await navigator.mediaDevices.getUserMedia({
// // //         video: { facingMode: "user", width: 640, height: 480 },
// // //         audio: false,
// // //       });

// // //       streamRef.current = stream;
// // //       setCameraOpen(true);
// // //       blinkCaught.current = false;
// // //       earHistory.current = [];
// // //       setScanStatus("scanning");
// // //       setScanMessage("Position your face in the frame");

// // //       // Wait for actual video element + real frame data before detecting,
// // //       // instead of a fixed setTimeout guess
// // //       const waitForVideo = () =>
// // //         new Promise((resolve) => {
// // //           const check = () => {
// // //             if (videoRef.current) {
// // //               videoRef.current.srcObject = stream;
// // //               videoRef.current.onloadeddata = () => {
// // //                 videoRef.current.play();
// // //                 resolve();
// // //               };
// // //             } else {
// // //               setTimeout(check, 50);
// // //             }
// // //           };
// // //           check();
// // //         });

// // //       await waitForVideo();
// // //       console.log("Video ready:", videoRef.current.videoWidth, videoRef.current.videoHeight);
// // //       detectLoopRef.current?.();
// // //     } catch (err) {
// // //       setError("Camera access denied or not available. Please allow camera permission.");
// // //       setCameraOpen(false);
// // //     }
// // //   };

// // //   // Photo capture (now auto-triggered after blink, not a button click)
// // //   const capturePhoto = () => {
// // //     const video = videoRef.current;
// // //     const canvas = canvasRef.current;

// // //     if (!video || !canvas) return;

// // //     canvas.width = video.videoWidth;
// // //     canvas.height = video.videoHeight;

// // //     const ctx = canvas.getContext("2d");
// // //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// // //     const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
// // //     setCapturedImage(dataUrl);
// // //     setForm((p) => ({ ...p, face_image_url: dataUrl }));

// // //     stopCamera();
// // //   };

// // //   // ---------- Auto detection + blink loop ----------
// // //   const detectLoop = useCallback(async () => {
// // //     if (!videoRef.current || blinkCaught.current) return;

// // //     // Skip if video has no real frame yet (videoWidth 0 = detectSingleFace will always fail silently)
// // //     if (videoRef.current.videoWidth === 0) {
// // //       rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
// // //       return;
// // //     }

// // //     const det = await faceapi
// // //       .detectSingleFace(
// // //         videoRef.current,
// // //         new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 })
// // //       )
// // //       .withFaceLandmarks();

// // //     // DEBUG: remove this console.log once it's working
// // //     console.log("detection result:", det ? "FACE FOUND" : "no face", "videoWidth:", videoRef.current.videoWidth);

// // //     if (det) {
// // //       setScanStatus("face_found");
// // //       setScanMessage("Blink naturally to confirm it's you");

// // //       const leftEAR = EAR(det.landmarks.getLeftEye());
// // //       const rightEAR = EAR(det.landmarks.getRightEye());
// // //       const avg = (leftEAR + rightEAR) / 2;

// // //       earHistory.current.push(avg);
// // //       if (earHistory.current.length > 10) earHistory.current.shift();

// // //       // DEBUG: watch this in console to find your real open/closed eye values
// // //       console.log("EAR:", avg.toFixed(3));

// // //       const h = earHistory.current;
// // //       const blinked =
// // //         h.length >= 5 && Math.min(...h.slice(-5)) < 0.25 && h[h.length - 1] > 0.25;

// // //       if (blinked) {
// // //         blinkCaught.current = true;
// // //         setScanStatus("blinked");
// // //         setScanMessage("Verified! Capturing...");
// // //         setTimeout(capturePhoto, 300);
// // //         return;
// // //       }
// // //     } else {
// // //       setScanStatus("scanning");
// // //       setScanMessage("Position your face in the frame");
// // //     }

// // //     rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
// // //   }, []);

// // //   useEffect(() => {
// // //     detectLoopRef.current = detectLoop;
// // //   }, [detectLoop]);

// // //   // Form band karte time camera bhi band
// // //   const closeForm = () => {
// // //     stopCamera();
// // //     setCapturedImage(null);
// // //     setShowForm(false);
// // //   };

// // //   const openAdd = () => {
// // //     setEditId(null);
// // //     setForm({
// // //       employee_id: "",
// // //       face_image_url: "",
// // //       device_id: "",
// // //       is_active: true,
// // //     });
// // //     setCapturedImage(null);
// // //     setShowForm(true);
// // //     setError("");
// // //     setSuccess("");
// // //   };

// // //   const openEdit = (row) => {
// // //     setEditId(row.biometric_id || row.id);
// // //     setForm({
// // //       employee_id: row.employee_id || "",
// // //       face_image_url: row.face_image_url || "",
// // //       device_id: row.device_id || "",
// // //       is_active: row.is_active !== false,
// // //     });
// // //     setCapturedImage(row.face_image_url || null);
// // //     setShowForm(true);
// // //     setError("");
// // //     setSuccess("");
// // //   };

// // //   const submit = async (e) => {
// // //     e.preventDefault();
// // //     setSaving(true);
// // //     setError("");
// // //     setSuccess("");

// // //     if (!form.employee_id) {
// // //       setError("Please select employee");
// // //       setSaving(false);
// // //       return;
// // //     }

// // //     if (!form.face_image_url && !capturedImage) {
// // //       setError("Please scan face photo");
// // //       setSaving(false);
// // //       return;
// // //     }

// // //     try {
// // //       const payload = {
// // //         employee_id: form.employee_id,
// // //         face_image_url: form.face_image_url || capturedImage || null,
// // //         device_id: form.device_id || null,
// // //         is_active: form.is_active,
// // //       };

// // //       if (editId) {
// // //         await api.put(`/api/v1/update/employee/biometrics/${editId}`, payload);
// // //         setSuccess(`${getEmployeeNameById(form.employee_id)} Biometric update Successfully`);
// // //       } else {
// // //         await api.post("/api/v1/add/employee/biometric", payload);
// // //         setSuccess(`${getEmployeeNameById(form.employee_id)} biometric enroll Successfully`);
// // //       }

// // //       closeForm();
// // //       fetchList();
// // //     } catch (err) {
// // //       setError(formatApiError(err));
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const getEmployeeLabel = (emp) => {
// // //     const id = emp.employee_id || emp.id || emp.user_id || "";
// // //     const name =
// // //       emp.full_name ||
// // //       emp.name ||
// // //       emp.employee_name ||
// // //       `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
// // //       "";
// // //     return name ? `${name} (${id})` : id;
// // //   };

// // //   // Employee_id se naam dhoondne ke liye — table mein id ki jagah naam dikhane ke liye
// // //   const getEmployeeNameById = (empId) => {
// // //     const emp = employees.find(
// // //       (e) => (e.employee_id || e.id || e.user_id) === empId
// // //     );
// // //     if (!emp) return empId || "—";
// // //     const name =
// // //       emp.full_name ||
// // //       emp.name ||
// // //       emp.employee_name ||
// // //       `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
// // //     return name || empId;
// // //   };

// // //   // Frame color based on scan progress: red -> amber -> green
// // //   const frameColor =
// // //     scanStatus === "blinked" ? "#16a34a" : scanStatus === "face_found" ? "#f59e0b" : "#E42527";

// // //   return (
// // //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// // //       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// // //         <div>
// // //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Biometrics</h1>
// // //           <p className="mt-1 text-sm text-[#6b7280]">
// // //             Face enrollment for attendance matching
// // //           </p>
// // //         </div>
// // //         <button
// // //           onClick={openAdd}
// // //           className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// // //         >
// // //           + Enroll
// // //         </button>
// // //       </div>

// // //       {error && (
// // //         <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
// // //           {error}
// // //         </div>
// // //       )}
// // //       {success && (
// // //         <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
// // //           {success}
// // //         </div>
// // //       )}

// // //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// // //         <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
// // //           <input
// // //             value={search}
// // //             onChange={(e) => setSearch(e.target.value)}
// // //             placeholder="Search..."
// // //             className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
// // //           />
// // //           <button
// // //             onClick={() => {
// // //               setPage(1);
// // //               fetchList();
// // //             }}
// // //             className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
// // //           >
// // //             Search
// // //           </button>
// // //         </div>

// // //         <div className="overflow-x-auto">
// // //           {loading ? (
// // //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// // //           ) : list.length === 0 ? (
// // //             <div className="py-16 text-center text-sm text-[#6b7280]">
// // //               No biometrics found
// // //             </div>
// // //           ) : (
// // //             <table className="w-full min-w-[700px] text-left text-sm">
// // //               <thead>
// // //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Face</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Device</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Active</th>
// // //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Enrolled</th>
// // //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">
// // //                     Actions
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-[#f3f4f6]">
// // //                 {list.map((row, i) => (
// // //                   <tr key={row.biometric_id || i} className="hover:bg-[#fafafa]">
// // //                     <td className="px-5 py-3.5">{getEmployeeNameById(row.employee_id)}</td>
// // //                     <td className="px-5 py-3.5">
// // //                       {row.face_image_url ? (
// // //                         <img
// // //                           src={row.face_image_url}
// // //                           alt="face"
// // //                           className="h-10 w-10 rounded-full object-cover"
// // //                         />
// // //                       ) : (
// // //                         "—"
// // //                       )}
// // //                     </td>
// // //                     <td className="px-5 py-3.5">{row.device_id || "—"}</td>
// // //                     <td className="px-5 py-3.5">{row.is_active ? "Yes" : "No"}</td>
// // //                     <td className="px-5 py-3.5 whitespace-nowrap">
// // //                       {formatDateTime(row.enrolled_at || row.created_at)}
// // //                     </td>
// // //                     <td className="px-5 py-3.5 text-right">
// // //                       <button
// // //                         onClick={() => openEdit(row)}
// // //                         className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
// // //                       >
// // //                         Edit
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Enroll Modal */}
// // //       {showForm && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// // //           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
// // //             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
// // //               <h2 className="font-semibold text-[#1a1a1a]">
// // //                 {editId ? "Edit Biometric" : "Enroll Biometric"}
// // //               </h2>
// // //               <button type="button" onClick={closeForm} className="text-[#9ca3af]">
// // //                 ✕
// // //               </button>
// // //             </div>

// // //             <form onSubmit={submit} className="space-y-4 p-5">
// // //               {/* Employee Dropdown */}
// // //               <div>
// // //                 <label className="mb-1 block text-sm font-medium text-[#374151]">
// // //                   Employee <span className="text-[#E42527]">*</span>
// // //                 </label>
// // //                 <select
// // //                   required
// // //                   value={form.employee_id}
// // //                   onChange={(e) =>
// // //                     setForm((p) => ({ ...p, employee_id: e.target.value }))
// // //                   }
// // //                   disabled={!!editId}
// // //                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm disabled:bg-gray-50"
// // //                 >
// // //                   <option value="">Select Employee</option>
// // //                   {employees.map((emp) => {
// // //                     const id = emp.employee_id || emp.id || emp.user_id || "";
// // //                     return (
// // //                       <option key={id} value={id}>
// // //                         {getEmployeeLabel(emp)}
// // //                       </option>
// // //                     );
// // //                   })}
// // //                 </select>
// // //               </div>

// // //               {/* Camera / Scan Section */}
// // //               <div>
// // //                 <label className="mb-1 block text-sm font-medium text-[#374151]">
// // //                   Face Scan <span className="text-[#E42527]">*</span>
// // //                 </label>

// // //                 {/* Captured Preview */}
// // //                 {capturedImage && !cameraOpen && (
// // //                   <div className="mb-3 flex flex-col items-center gap-2">
// // //                     <img
// // //                       src={capturedImage}
// // //                       alt="Captured"
// // //                       className="h-40 w-40 rounded-xl object-cover border"
// // //                     />
// // //                     <button
// // //                       type="button"
// // //                       onClick={openCamera}
// // //                       className="text-xs text-[#E42527] hover:underline"
// // //                     >
// // //                       Retake Photo
// // //                     </button>
// // //                   </div>
// // //                 )}

// // //                 {/* Live Camera with auto scanning overlay */}
// // //                 {cameraOpen && (
// // //                   <div className="mb-3 flex flex-col items-center gap-2">
// // //                     <div className="relative" style={{ width: "100%", height: 220 }}>
// // //                       <video
// // //                         ref={videoRef}
// // //                         muted
// // //                         playsInline
// // //                         className="h-full w-full rounded-xl bg-black object-cover scale-x-[-1]"
// // //                       />
// // //                       {/* Scan frame overlay */}
// // //                       <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
// // //                         <div style={{ width: 150, height: 150, position: "relative" }}>
// // //                           {[
// // //                             "top-2 left-2 border-t-4 border-l-4",
// // //                             "top-2 right-2 border-t-4 border-r-4",
// // //                             "bottom-2 left-2 border-b-4 border-l-4",
// // //                             "bottom-2 right-2 border-b-4 border-r-4",
// // //                           ].map((pos, i) => (
// // //                             <div
// // //                               key={i}
// // //                               className={`absolute h-7 w-7 ${pos}`}
// // //                               style={{ borderColor: frameColor, transition: "border-color 0.2s" }}
// // //                             />
// // //                           ))}
// // //                           {scanStatus === "scanning" && (
// // //                             <div
// // //                               className="absolute left-0 right-0 h-0.5 animate-pulse"
// // //                               style={{ background: frameColor, top: "50%" }}
// // //                             />
// // //                           )}
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     <p className="text-sm font-medium" style={{ color: frameColor }}>
// // //                       {scanMessage}
// // //                     </p>

// // //                     <button
// // //                       type="button"
// // //                       onClick={stopCamera}
// // //                       className="rounded-md border px-4 py-2 text-sm"
// // //                     >
// // //                       Cancel
// // //                     </button>
// // //                   </div>
// // //                 )}

// // //                 {/* Open Camera Button (still manual start, scan happens auto after) */}
// // //                 {!cameraOpen && !capturedImage && (
// // //                   <button
// // //                     type="button"
// // //                     onClick={openCamera}
// // //                     disabled={!modelsReady}
// // //                     className="w-full rounded-md border border-[#E42527] py-3 text-sm font-medium text-[#E42527] hover:bg-red-50 disabled:opacity-50"
// // //                   >
// // //                     {modelsReady ? "📷 Start Face Scan" : "Loading face detection..."}
// // //                   </button>
// // //                 )}

// // //                 <canvas ref={canvasRef} className="hidden" />
// // //               </div>

// // //               <div>
// // //                 <label className="mb-1 block text-sm font-medium text-[#374151]">
// // //                   Device Type
// // //                 </label>
// // //                 <select
// // //                   value={form.device_id}
// // //                   onChange={(e) =>
// // //                     setForm((p) => ({ ...p, device_id: e.target.value }))
// // //                   }
// // //                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
// // //                 >
// // //                   <option value="">Select device type</option>
// // //                   <option value="web">Web</option>
// // //                   <option value="mobile">Mobile</option>
// // //                   <option value="biometric">Biometric Machine</option>
// // //                   <option value="face">Face Recognition</option>
// // //                   <option value="manual">Manual</option>
// // //                   <option value="api">API</option>
// // //                 </select>
// // //               </div>

// // //               <label className="flex items-center gap-2 text-sm">
// // //                 <input
// // //                   type="checkbox"
// // //                   checked={form.is_active}
// // //                   onChange={(e) =>
// // //                     setForm((p) => ({ ...p, is_active: e.target.checked }))
// // //                   }
// // //                 />
// // //                 Active
// // //               </label>

// // //               <div className="flex justify-end gap-2 pt-2">
// // //                 <button
// // //                   type="button"
// // //                   onClick={closeForm}
// // //                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   disabled={saving}
// // //                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
// // //                 >
// // //                   {saving ? "Saving..." : "Save"}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // new code 

// // "use client";

// // import { useCallback, useEffect, useRef, useState } from "react";
// // import * as faceapi from "face-api.js";
// // import { api } from "@/lib/api";

// // /* ============================================================
// //    CONSTANTS
// // ============================================================ */

// // const PAGE_SIZE = 10;
// // const DEBOUNCE_MS = 400;
// // const AUTO_DISMISS_MS = 4000;

// // // Blink detection
// // const EAR_CLOSED_THRESHOLD = 0.22;
// // const EAR_OPEN_THRESHOLD = 0.28;
// // const BLINK_MIN_FRAMES = 2;
// // const BLINK_MAX_FRAMES = 15;
// // const EAR_HISTORY_SIZE = 20;

// // // Captured image size
// // const CAPTURED_WIDTH = 320;
// // const CAPTURED_HEIGHT = 320;
// // const CAPTURED_QUALITY = 0.7;

// // // Model sources — try local first, fallback to CDN
// // const MODEL_SOURCES = [
// //   "/models",
// //   "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights",
// //   "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights",
// // ];

// // /* ============================================================
// //    HELPERS
// // ============================================================ */

// // const formatApiError = (err) => {
// //   const detail = err?.response?.data?.detail;
// //   if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
// //   if (typeof detail === "string") return detail;
// //   return err?.message || "Something went wrong";
// // };

// // const formatDateTime = (d) => {
// //   if (!d) return "—";
// //   try {
// //     return new Date(d).toLocaleString("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   } catch {
// //     return String(d);
// //   }
// // };

// // const extractList = (res) => {
// //   const data = res?.data ?? {};
// //   if (Array.isArray(data)) return { items: data, total: data.length };
// //   if (Array.isArray(data.biometrics))
// //     return { items: data.biometrics, total: Number(data.total) || data.biometrics.length };
// //   if (Array.isArray(data.employees))
// //     return { items: data.employees, total: Number(data.total) || data.employees.length };
// //   if (Array.isArray(data.data))
// //     return { items: data.data, total: Number(data.total) || data.data.length };
// //   if (Array.isArray(data.items))
// //     return { items: data.items, total: Number(data.total) || data.items.length };
// //   return { items: [], total: 0 };
// // };

// // const extractEmployees = (res) => {
// //   const data = res?.data ?? {};
// //   let arr = [];
// //   if (Array.isArray(data)) arr = data;
// //   else if (Array.isArray(data.employees)) arr = data.employees;
// //   else if (Array.isArray(data.data)) arr = data.data;
// //   else if (Array.isArray(data.items)) arr = data.items;
// //   else if (Array.isArray(data.result)) arr = data.result;

// //   return arr.map((e) => {
// //     const id = e.employee_id || e.id || e.user_id || "";
// //     const name =
// //       e.full_name ||
// //       e.name ||
// //       e.employee_name ||
// //       `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
// //       id;
// //     return { id, name, email: e.email || e.company_email || "" };
// //   });
// // };

// // const computeEAR = (eye) => {
// //   if (!eye || eye.length < 6) return 0;
// //   const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
// //   const v1 = dist(eye[1], eye[5]);
// //   const v2 = dist(eye[2], eye[4]);
// //   const h = dist(eye[0], eye[3]);
// //   if (h === 0) return 0;
// //   return (v1 + v2) / (2 * h);
// // };

// // /* ============================================================
// //    SEARCHABLE EMPLOYEE DROPDOWN
// // ============================================================ */

// // function EmployeeDropdown({ value, onChange, options, placeholder = "Select employee..." }) {
// //   const [open, setOpen] = useState(false);
// //   const [query, setQuery] = useState("");
// //   const ref = useRef(null);
// //   const inputRef = useRef(null);

// //   useEffect(() => {
// //     const onClick = (e) => {
// //       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
// //     };
// //     document.addEventListener("mousedown", onClick);
// //     return () => document.removeEventListener("mousedown", onClick);
// //   }, []);

// //   const filtered = query.trim()
// //     ? options.filter((o) => {
// //         const q = query.trim().toLowerCase();
// //         return o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
// //       })
// //     : options;

// //   const selected = options.find((o) => o.id === value);

// //   return (
// //     <div ref={ref} className="relative">
// //       <button
// //         type="button"
// //         onClick={() => {
// //           setOpen((v) => !v);
// //           setTimeout(() => inputRef.current?.focus(), 30);
// //         }}
// //         className="flex w-full items-center justify-between rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-left text-sm focus:border-[#E42527] focus:outline-none"
// //       >
// //         <span className={selected ? "text-[#374151]" : "text-[#9ca3af]"}>
// //           {selected ? `${selected.name} (${selected.id})` : placeholder}
// //         </span>
// //         <svg
// //           className={`h-4 w-4 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`}
// //           xmlns="http://www.w3.org/2000/svg"
// //           fill="none"
// //           viewBox="0 0 24 24"
// //           stroke="currentColor"
// //           strokeWidth={2}
// //         >
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
// //         </svg>
// //       </button>

// //       {open && (
// //         <div className="absolute z-40 mt-1 w-full rounded-md border border-[#e5e7eb] bg-white shadow-lg">
// //           <div className="border-b border-[#f3f4f6] p-2">
// //             <input
// //               ref={inputRef}
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               placeholder="Type name or ID..."
// //               className="w-full rounded-md border border-[#e5e7eb] px-2.5 py-1.5 text-sm focus:border-[#E42527] focus:outline-none"
// //             />
// //           </div>
// //           <div className="max-h-56 overflow-y-auto py-1">
// //             {filtered.length === 0 ? (
// //               <div className="px-3 py-4 text-center text-xs text-[#9ca3af]">
// //                 No employees found
// //               </div>
// //             ) : (
// //               filtered.map((opt) => (
// //                 <button
// //                   key={opt.id}
// //                   type="button"
// //                   onClick={() => {
// //                     onChange(opt.id);
// //                     setOpen(false);
// //                     setQuery("");
// //                   }}
// //                   className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-[#f9fafb] ${
// //                     opt.id === value ? "bg-[#fff5f5]" : ""
// //                   }`}
// //                 >
// //                   <span className="font-medium text-[#374151]">{opt.name}</span>
// //                   <span className="text-[11px] text-[#9ca3af]">{opt.id}</span>
// //                 </button>
// //               ))
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    PAGINATION
// // ============================================================ */

// // function Pagination({ page, pageSize, total, onPageChange }) {
// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));
// //   if (total <= pageSize) return null;

// //   const from = (page - 1) * pageSize + 1;
// //   const to = Math.min(page * pageSize, total);

// //   return (
// //     <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5e7eb] px-5 py-3.5 sm:flex-row">
// //       <p className="text-xs text-[#6b7280]">
// //         Showing <span className="font-medium text-[#374151]">{from}</span>–
// //         <span className="font-medium text-[#374151]">{to}</span> of{" "}
// //         <span className="font-medium text-[#374151]">{total}</span>
// //       </p>
// //       <div className="flex items-center gap-1">
// //         <button
// //           type="button"
// //           disabled={page <= 1}
// //           onClick={() => onPageChange(page - 1)}
// //           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
// //         >
// //           Prev
// //         </button>
// //         <span className="px-3 text-xs text-[#6b7280]">
// //           Page <span className="font-medium text-[#374151]">{page}</span> / {totalPages}
// //         </span>
// //         <button
// //           type="button"
// //           disabled={page >= totalPages}
// //           onClick={() => onPageChange(page + 1)}
// //           className="rounded-md border border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    MAIN PAGE
// // ============================================================ */

// // export default function BiometricsPage() {
// //   /* list */
// //   const [list, setList] = useState([]);
// //   const [total, setTotal] = useState(0);
// //   const [loading, setLoading] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [searchInput, setSearchInput] = useState("");
// //   const [search, setSearch] = useState("");

// //   /* employees */
// //   const [employees, setEmployees] = useState([]);

// //   /* notifications */
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   /* modal */
// //   const [showForm, setShowForm] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   const [saving, setSaving] = useState(false);
// //   const [form, setForm] = useState({
// //     employee_id: "",
// //     face_image_url: "",
// //     device_id: "",
// //     is_active: true,
// //   });

// //   /* camera + scan */
// //   const [cameraOpen, setCameraOpen] = useState(false);
// //   const [capturedImage, setCapturedImage] = useState(null);
// //   const [modelsReady, setModelsReady] = useState(false);
// //   const [modelsLoading, setModelsLoading] = useState(true);
// //   const [modelsError, setModelsError] = useState("");
// //   const [scanStatus, setScanStatus] = useState("idle");
// //   const [scanMessage, setScanMessage] = useState("");

// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const streamRef = useRef(null);
// //   const rafRef = useRef(null);
// //   const detectLoopRef = useRef(null);

// //   const earHistoryRef = useRef([]);
// //   const blinkStateRef = useRef({ closed: false, framesClosed: 0 });
// //   const blinkCaughtRef = useRef(false);

// //   const reqIdRef = useRef(0);

// //   /* ============================================================
// //      AUTO-DISMISS NOTIFICATIONS
// //   ============================================================ */
// //   useEffect(() => {
// //     if (!error && !success) return;
// //     const t = setTimeout(() => {
// //       setError("");
// //       setSuccess("");
// //     }, AUTO_DISMISS_MS);
// //     return () => clearTimeout(t);
// //   }, [error, success]);

// //   /* ============================================================
// //      LOAD EMPLOYEES
// //   ============================================================ */
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         const res = await api.get("/api/v1/get/employees");
// //         if (!cancelled) setEmployees(extractEmployees(res));
// //       } catch {
// //         if (!cancelled) setEmployees([]);
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   /* ============================================================
// //      FETCH LIST
// //   ============================================================ */
// //   const fetchList = useCallback(async () => {
// //     const myReqId = ++reqIdRef.current;
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const params = { page, page_size: PAGE_SIZE };
// //       if (search) params.search = search;
// //       const res = await api.get("/api/v1/get/employee/biometrics", { params });
// //       if (myReqId !== reqIdRef.current) return;
// //       const { items, total } = extractList(res);
// //       setList(items);
// //       setTotal(total);
// //     } catch (err) {
// //       if (myReqId !== reqIdRef.current) return;
// //       setError(formatApiError(err));
// //       setList([]);
// //       setTotal(0);
// //     } finally {
// //       if (myReqId === reqIdRef.current) setLoading(false);
// //     }
// //   }, [page, search]);

// //   useEffect(() => {
// //     fetchList();
// //   }, [fetchList]);

// //   /* ============================================================
// //      DEBOUNCED SEARCH
// //   ============================================================ */
// //   useEffect(() => {
// //     const t = setTimeout(() => {
// //       setSearch(searchInput.trim());
// //       setPage(1);
// //     }, DEBOUNCE_MS);
// //     return () => clearTimeout(t);
// //   }, [searchInput]);

// //   /* ============================================================
// //      LOAD FACE MODELS — with CDN fallback
// //   ============================================================ */
// //   const loadModels = useCallback(async () => {
// //     setModelsLoading(true);
// //     setModelsError("");
// //     setModelsReady(false);

// //     let lastError = null;
// //     for (const baseUrl of MODEL_SOURCES) {
// //       try {
// //         console.log(`[FaceAPI] Trying to load models from: ${baseUrl}`);
// //         await Promise.all([
// //           faceapi.nets.tinyFaceDetector.loadFromUri(baseUrl),
// //           faceapi.nets.faceLandmark68Net.loadFromUri(baseUrl),
// //         ]);
// //         console.log(`[FaceAPI] Models loaded successfully from: ${baseUrl}`);
// //         setModelsReady(true);
// //         setModelsLoading(false);
// //         return;
// //       } catch (e) {
// //         console.warn(`[FaceAPI] Failed to load from ${baseUrl}:`, e?.message);
// //         lastError = e;
// //       }
// //     }

// //     // All sources failed
// //     setModelsLoading(false);
// //     setModelsError(
// //       lastError?.message
// //         ? `Face models could not be loaded: ${lastError.message}`
// //         : "Face models could not be loaded. Please check your internet connection."
// //     );
// //   }, []);

// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       await loadModels();
// //     })();
// //     return () => {
// //       cancelled = true;
// //       stopCamera();
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   /* ============================================================
// //      CAMERA CONTROL
// //   ============================================================ */
// //   const stopCamera = useCallback(() => {
// //     if (rafRef.current) {
// //       cancelAnimationFrame(rafRef.current);
// //       rafRef.current = null;
// //     }
// //     if (streamRef.current) {
// //       streamRef.current.getTracks().forEach((t) => t.stop());
// //       streamRef.current = null;
// //     }
// //     if (videoRef.current) {
// //       try {
// //         videoRef.current.srcObject = null;
// //       } catch {}
// //     }
// //     setCameraOpen(false);
// //     setScanStatus("idle");
// //     setScanMessage("");
// //   }, []);

// //   const resetBlinkState = () => {
// //     earHistoryRef.current = [];
// //     blinkStateRef.current = { closed: false, framesClosed: 0 };
// //     blinkCaughtRef.current = false;
// //   };

// //   const capturePhoto = useCallback(() => {
// //     const video = videoRef.current;
// //     const canvas = canvasRef.current;
// //     if (!video || !canvas) return;

// //     const vw = video.videoWidth;
// //     const vh = video.videoHeight;
// //     if (!vw || !vh) return;

// //     canvas.width = CAPTURED_WIDTH;
// //     canvas.height = CAPTURED_HEIGHT;
// //     const ctx = canvas.getContext("2d");
// //     const side = Math.min(vw, vh);
// //     const sx = (vw - side) / 2;
// //     const sy = (vh - side) / 2;
// //     ctx.drawImage(video, sx, sy, side, side, 0, 0, CAPTURED_WIDTH, CAPTURED_HEIGHT);

// //     const dataUrl = canvas.toDataURL("image/jpeg", CAPTURED_QUALITY);
// //     setCapturedImage(dataUrl);
// //     setForm((p) => ({ ...p, face_image_url: dataUrl }));
// //     stopCamera();
// //   }, [stopCamera]);

// //   const detectLoop = useCallback(async () => {
// //     const video = videoRef.current;
// //     if (!video || blinkCaughtRef.current) return;
// //     if (!video.videoWidth) {
// //       rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
// //       return;
// //     }

// //     try {
// //       const det = await faceapi
// //         .detectSingleFace(
// //           video,
// //           new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 })
// //         )
// //         .withFaceLandmarks();

// //       if (blinkCaughtRef.current) return;

// //       if (det) {
// //         setScanStatus("face_found");
// //         setScanMessage("Blink naturally to confirm it's you");

// //         const leftEAR = computeEAR(det.landmarks.getLeftEye());
// //         const rightEAR = computeEAR(det.landmarks.getRightEye());
// //         const avg = (leftEAR + rightEAR) / 2;

// //         const hist = earHistoryRef.current;
// //         hist.push(avg);
// //         if (hist.length > EAR_HISTORY_SIZE) hist.shift();

// //         const state = blinkStateRef.current;

// //         if (!state.closed && avg < EAR_CLOSED_THRESHOLD) {
// //           state.closed = true;
// //           state.framesClosed = 1;
// //         } else if (state.closed && avg < EAR_CLOSED_THRESHOLD) {
// //           state.framesClosed += 1;
// //         } else if (state.closed && avg >= EAR_OPEN_THRESHOLD) {
// //           const frames = state.framesClosed;
// //           state.closed = false;
// //           state.framesClosed = 0;

// //           if (frames >= BLINK_MIN_FRAMES && frames <= BLINK_MAX_FRAMES) {
// //             blinkCaughtRef.current = true;
// //             setScanStatus("blinked");
// //             setScanMessage("Verified! Capturing...");
// //             setTimeout(capturePhoto, 250);
// //             return;
// //           }
// //         }
// //       } else {
// //         setScanStatus("scanning");
// //         setScanMessage("Position your face in the frame");
// //         blinkStateRef.current = { closed: false, framesClosed: 0 };
// //       }
// //     } catch {
// //       // swallow
// //     }

// //     rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
// //   }, [capturePhoto]);

// //   useEffect(() => {
// //     detectLoopRef.current = detectLoop;
// //   }, [detectLoop]);

// //   const openCamera = useCallback(async () => {
// //     setError("");
// //     setCapturedImage(null);

// //     if (modelsError) {
// //       setError(modelsError);
// //       return;
// //     }
// //     if (!modelsReady) {
// //       setError("Face detection is still loading. Please wait a moment and try again.");
// //       return;
// //     }

// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({
// //         video: { facingMode: "user", width: 640, height: 480 },
// //         audio: false,
// //       });

// //       streamRef.current = stream;
// //       setCameraOpen(true);
// //       resetBlinkState();
// //       setScanStatus("scanning");
// //       setScanMessage("Position your face in the frame");

// //       await new Promise((resolve) => {
// //         const check = () => {
// //           if (videoRef.current) {
// //             videoRef.current.srcObject = stream;
// //             videoRef.current.onloadeddata = () => {
// //               videoRef.current.play().catch(() => {});
// //               resolve();
// //             };
// //           } else {
// //             setTimeout(check, 50);
// //           }
// //         };
// //         check();
// //       });

// //       rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
// //     } catch (err) {
// //       setError("Camera access denied or not available. Please allow camera permission.");
// //       setCameraOpen(false);
// //     }
// //   }, [modelsReady, modelsError]);

// //   useEffect(() => {
// //     return () => stopCamera();
// //   }, [stopCamera]);

// //   /* ============================================================
// //      MODAL ACTIONS
// //   ============================================================ */
// //   const closeForm = () => {
// //     stopCamera();
// //     setCapturedImage(null);
// //     setShowForm(false);
// //     setEditId(null);
// //     setForm({
// //       employee_id: "",
// //       face_image_url: "",
// //       device_id: "",
// //       is_active: true,
// //     });
// //   };

// //   const openAdd = () => {
// //     setEditId(null);
// //     setForm({
// //       employee_id: "",
// //       face_image_url: "",
// //       device_id: "",
// //       is_active: true,
// //     });
// //     setCapturedImage(null);
// //     setShowForm(true);
// //     setError("");
// //     setSuccess("");
// //   };

// //   const openEdit = (row) => {
// //     setEditId(row.biometric_id || row.id);
// //     setForm({
// //       employee_id: row.employee_id || "",
// //       face_image_url: row.face_image_url || "",
// //       device_id: row.device_id || "",
// //       is_active: row.is_active !== false,
// //     });
// //     setCapturedImage(row.face_image_url || null);
// //     setShowForm(true);
// //     setError("");
// //     setSuccess("");
// //   };

// //   useEffect(() => {
// //     if (!showForm) return;
// //     const onKey = (e) => {
// //       if (e.key === "Escape" && !saving) closeForm();
// //     };
// //     window.addEventListener("keydown", onKey);
// //     return () => window.removeEventListener("keydown", onKey);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [showForm, saving]);

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");

// //     if (!form.employee_id) {
// //       setError("Please select an employee");
// //       return;
// //     }
// //     if (!form.face_image_url && !capturedImage) {
// //       setError("Please scan a face photo");
// //       return;
// //     }

// //     setSaving(true);
// //     try {
// //       const payload = {
// //         employee_id: form.employee_id,
// //         face_image_url: form.face_image_url || capturedImage || null,
// //         device_id: form.device_id || null,
// //         is_active: form.is_active,
// //       };

// //       const empName = getEmployeeNameById(form.employee_id);

// //       if (editId) {
// //         await api.put(`/api/v1/update/employee/biometrics/${editId}`, payload);
// //         setSuccess(`${empName} biometric updated successfully`);
// //       } else {
// //         await api.post("/api/v1/add/employee/biometric", payload);
// //         setSuccess(`${empName} biometric enrolled successfully`);
// //       }

// //       closeForm();
// //       fetchList();
// //     } catch (err) {
// //       setError(formatApiError(err));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const getEmployeeNameById = (empId) => {
// //     const emp = employees.find((e) => e.id === empId);
// //     return emp ? emp.name : empId || "—";
// //   };

// //   const frameColor =
// //     scanStatus === "blinked"
// //       ? "#16a34a"
// //       : scanStatus === "face_found"
// //       ? "#f59e0b"
// //       : "#E42527";

// //   const scanButtonLabel = () => {
// //     if (modelsError) return "Face detection unavailable";
// //     if (modelsLoading) return "Loading face detection...";
// //     if (!modelsReady) return "Face detection unavailable";
// //     return "📷 Start Face Scan";
// //   };

// //   /* ============================================================
// //      RENDER
// //   ============================================================ */
// //   return (
// //     <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
// //       {/* HEADER */}
// //       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Biometrics</h1>
// //           <p className="mt-1 text-sm text-[#6b7280]">
// //             Face enrollment for attendance matching
// //             {total > 0 && (
// //               <span className="ml-2 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#6b7280]">
// //                 {total} total
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex flex-wrap gap-2">
// //           {modelsError && (
// //             <button
// //               type="button"
// //               onClick={loadModels}
// //               className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
// //             >
// //               ↻ Retry Models
// //             </button>
// //           )}
// //           <button
// //             onClick={openAdd}
// //             className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
// //           >
// //             + Enroll
// //           </button>
// //         </div>
// //       </div>

// //       {/* MODEL STATUS */}
// //       {modelsLoading && (
// //         <div className="mb-4 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">
// //           Loading face detection models...
// //         </div>
// //       )}
// //       {modelsError && (
// //         <div className="mb-4 flex items-start justify-between rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
// //           <div>
// //             <p className="font-medium">Face detection unavailable</p>
// //             <p className="mt-0.5 text-xs">{modelsError}</p>
// //             <p className="mt-1 text-xs">
// //               Make sure <code className="rounded bg-amber-100 px-1">public/models/</code> folder
// //               contains the face-api.js model files, or check your internet connection.
// //             </p>
// //           </div>
// //           <button onClick={() => setModelsError("")} className="ml-3">✕</button>
// //         </div>
// //       )}

// //       {/* NOTIFICATIONS */}
// //       {error && (
// //         <div className="mb-4 flex items-start justify-between rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]" role="alert">
// //           <span>{error}</span>
// //           <button onClick={() => setError("")} className="ml-3" aria-label="Dismiss">✕</button>
// //         </div>
// //       )}
// //       {success && (
// //         <div className="mb-4 flex items-start justify-between rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
// //           <span>{success}</span>
// //           <button onClick={() => setSuccess("")} className="ml-3" aria-label="Dismiss">✕</button>
// //         </div>
// //       )}

// //       {/* TABLE */}
// //       <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
// //         <div className="flex flex-wrap gap-2 border-b border-[#e5e7eb] px-5 py-3.5">
// //           <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
// //             <input
// //               value={searchInput}
// //               onChange={(e) => setSearchInput(e.target.value)}
// //               placeholder="Search employee..."
// //               className="w-full rounded-md border border-[#d1d5db] pl-9 pr-9 py-2 text-sm focus:border-[#E42527] focus:outline-none"
// //             />
// //             <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
// //             </svg>
// //             {searchInput && (
// //               <button type="button" onClick={() => setSearchInput("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]">✕</button>
// //             )}
// //           </div>
// //         </div>

// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
// //           ) : list.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
// //               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6]">
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
// //                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
// //                 </svg>
// //               </div>
// //               <p className="text-sm font-medium text-[#374151]">No biometrics enrolled</p>
// //               <p className="text-xs text-[#6b7280]">Start by enrolling an employee&apos;s face.</p>
// //               <button type="button" onClick={openAdd} className="mt-1 rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
// //                 + Enroll
// //               </button>
// //             </div>
// //           ) : (
// //             <table className="w-full min-w-[800px] text-left text-sm">
// //               <thead>
// //                 <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Face</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Device</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Status</th>
// //                   <th className="px-5 py-3 font-medium text-[#6b7280]">Enrolled</th>
// //                   <th className="px-5 py-3 text-right font-medium text-[#6b7280]">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-[#f3f4f6]">
// //                 {list.map((row, i) => (
// //                   <tr key={row.biometric_id || i} className="hover:bg-[#fafafa]">
// //                     <td className="px-5 py-3.5 text-[#374151]">
// //                       {getEmployeeNameById(row.employee_id)}
// //                     </td>
// //                     <td className="px-5 py-3.5">
// //                       {row.face_image_url ? (
// //                         <img
// //                           src={row.face_image_url}
// //                           alt="face"
// //                           className="h-10 w-10 rounded-full object-cover ring-1 ring-[#e5e7eb]"
// //                         />
// //                       ) : (
// //                         <span className="text-[#9ca3af]">—</span>
// //                       )}
// //                     </td>
// //                     <td className="px-5 py-3.5 text-[#6b7280]">{row.device_id || "—"}</td>
// //                     <td className="px-5 py-3.5">
// //                       {row.is_active ? (
// //                         <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
// //                           <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
// //                           Active
// //                         </span>
// //                       ) : (
// //                         <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
// //                           <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
// //                           Inactive
// //                         </span>
// //                       )}
// //                     </td>
// //                     <td className="px-5 py-3.5 whitespace-nowrap text-[#6b7280]">
// //                       {formatDateTime(row.enrolled_at || row.created_at)}
// //                     </td>
// //                     <td className="px-5 py-3.5 text-right">
// //                       <button
// //                         onClick={() => openEdit(row)}
// //                         className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
// //                       >
// //                         Edit
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>

// //         {!loading && list.length > 0 && (
// //           <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
// //         )}
// //       </div>

// //       {/* MODAL */}
// //       {showForm && (
// //         <div
// //           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
// //           onClick={closeForm}
// //           role="dialog"
// //           aria-modal="true"
// //         >
// //           <div
// //             className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
// //               <h2 className="font-semibold text-[#1a1a1a]">
// //                 {editId ? "Edit Biometric" : "Enroll Biometric"}
// //               </h2>
// //               <button type="button" onClick={closeForm} className="rounded p-1 text-[#9ca3af] hover:bg-[#f3f4f6]" aria-label="Close">
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={submit} className="space-y-4 p-5">
// //               {/* Employee */}
// //               <div>
// //                 <label className="mb-1 block text-xs font-medium text-[#6b7280]">
// //                   Employee <span className="text-[#E42527]">*</span>
// //                 </label>
// //                 {editId ? (
// //                   <input
// //                     value={`${getEmployeeNameById(form.employee_id)} (${form.employee_id})`}
// //                     disabled
// //                     className="w-full rounded-md border border-[#d1d5db] bg-[#f9fafb] px-3 py-2.5 text-sm text-[#6b7280]"
// //                   />
// //                 ) : (
// //                   <EmployeeDropdown
// //                     value={form.employee_id}
// //                     onChange={(v) => setForm((p) => ({ ...p, employee_id: v }))}
// //                     options={employees}
// //                   />
// //                 )}
// //               </div>

// //               {/* Face scan */}
// //               <div>
// //                 <label className="mb-1 block text-xs font-medium text-[#6b7280]">
// //                   Face Scan <span className="text-[#E42527]">*</span>
// //                 </label>

// //                 {capturedImage && !cameraOpen && (
// //                   <div className="mb-3 flex flex-col items-center gap-2">
// //                     <img
// //                       src={capturedImage}
// //                       alt="Captured"
// //                       className="h-40 w-40 rounded-xl border object-cover"
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={openCamera}
// //                       className="text-xs text-[#E42527] hover:underline"
// //                     >
// //                       Retake Photo
// //                     </button>
// //                   </div>
// //                 )}

// //                 {cameraOpen && (
// //                   <div className="mb-3 flex flex-col items-center gap-2">
// //                     <div className="relative w-full" style={{ height: 220 }}>
// //                       <video
// //                         ref={videoRef}
// //                         muted
// //                         playsInline
// //                         className="h-full w-full rounded-xl bg-black object-cover"
// //                         style={{ transform: "scaleX(-1)" }}
// //                       />
// //                       <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
// //                         <div style={{ width: 150, height: 150, position: "relative" }}>
// //                           {[
// //                             "top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
// //                             "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
// //                             "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
// //                             "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
// //                           ].map((pos, i) => (
// //                             <div
// //                               key={i}
// //                               className={`absolute h-7 w-7 ${pos}`}
// //                               style={{ borderColor: frameColor, transition: "border-color 0.2s" }}
// //                             />
// //                           ))}
// //                           {scanStatus === "scanning" && (
// //                             <div
// //                               className="absolute left-0 right-0 h-0.5 animate-pulse"
// //                               style={{ background: frameColor, top: "50%" }}
// //                             />
// //                           )}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <p className="text-sm font-medium" style={{ color: frameColor }}>
// //                       {scanMessage}
// //                     </p>

// //                     <button
// //                       type="button"
// //                       onClick={stopCamera}
// //                       className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
// //                     >
// //                       Cancel Scan
// //                     </button>
// //                   </div>
// //                 )}

// //                 {!cameraOpen && !capturedImage && (
// //                   <button
// //                     type="button"
// //                     onClick={openCamera}
// //                     disabled={!modelsReady || !!modelsError || modelsLoading}
// //                     className="w-full rounded-md border border-[#E42527] py-3 text-sm font-medium text-[#E42527] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
// //                   >
// //                     {scanButtonLabel()}
// //                   </button>
// //                 )}

// //                 <canvas ref={canvasRef} className="hidden" />
// //               </div>

// //               {/* Device */}
// //               <div>
// //                 <label className="mb-1 block text-xs font-medium text-[#6b7280]">Device Type</label>
// //                 <select
// //                   value={form.device_id}
// //                   onChange={(e) => setForm((p) => ({ ...p, device_id: e.target.value }))}
// //                   className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm focus:border-[#E42527] focus:outline-none"
// //                 >
// //                   <option value="">Select device type</option>
// //                   <option value="web">Web</option>
// //                   <option value="mobile">Mobile</option>
// //                   <option value="biometric">Biometric Machine</option>
// //                   <option value="face">Face Recognition</option>
// //                   <option value="manual">Manual</option>
// //                   <option value="api">API</option>
// //                 </select>
// //               </div>

// //               <label className="flex items-center gap-2 text-sm text-[#374151]">
// //                 <input
// //                   type="checkbox"
// //                   checked={form.is_active}
// //                   onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
// //                   className="h-4 w-4 rounded border-[#d1d5db] accent-[#E42527]"
// //                 />
// //                 Active
// //               </label>

// //               <div className="flex justify-end gap-2 pt-2">
// //                 <button
// //                   type="button"
// //                   onClick={closeForm}
// //                   className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={saving}
// //                   className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:opacity-60"
// //                 >
// //                   {saving ? "Saving..." : "Save"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }




// "use client";

// /**
//  * BiometricsPage — Production Ready (Face Enrollment)
//  * ------------------------------------------------------------------
//  *  ✓ Face-api.js with CDN fallback + local-first
//  *  ✓ Face descriptor (128-D embedding) computed & sent
//  *  ✓ Blink detection for liveness (anti-spoof)
//  *  ✓ Camera lifecycle safe (cleanup on unmount)
//  *  ✓ Enroll / re-enroll (old deactivated)
//  *  ✓ Live scan frame feedback (color states)
//  *  ✓ Search + pagination
//  *  ✓ Mobile responsive
//  *  ✓ Model loading errors handled gracefully
//  */

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import * as faceapi from "face-api.js";
// import { api } from "@/app/lib/api";
// import { useAuthStore } from "@/app/store/authStore";

// /* ══════════════════════════════════════════════════════════
//    CONSTANTS
//    ══════════════════════════════════════════════════════════ */

// const PAGE_SIZE = 10;
// const DEBOUNCE_MS = 450;
// const AUTO_DISMISS_MS = 5000;

// /* Blink detection tuning */
// const EAR_CLOSED = 0.22;   // below this → eye considered closed
// const EAR_OPEN = 0.28;     // above this → eye considered open
// const BLINK_MIN_FRAMES = 2;
// const BLINK_MAX_FRAMES = 18;
// const EAR_HISTORY_SIZE = 20;

// /* Capture */
// const CAPTURE_SIZE = 320;
// const JPEG_QUALITY = 0.72;

// /* Model sources — try local, then fallback */
// const MODEL_SOURCES = [
//   "/models",
//   "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights",
//   "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights",
// ];

// const DEVICE_OPTIONS = [
//   { value: "web", label: "Web Browser" },
//   { value: "mobile", label: "Mobile" },
//   { value: "biometric", label: "Biometric Machine" },
//   { value: "face", label: "Face Recognition Device" },
//   { value: "manual", label: "Manual Entry" },
//   { value: "api", label: "API" },
// ];

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

// const formatDateTime = (v) => {
//   if (!v) return "—";
//   const d = new Date(v);
//   if (Number.isNaN(d.getTime())) return "—";
//   try {
//     return d.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return "—";
//   }
// };

// const computeEAR = (eye) => {
//   if (!eye || eye.length < 6) return 0;
//   const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
//   const v1 = dist(eye[1], eye[5]);
//   const v2 = dist(eye[2], eye[4]);
//   const h = dist(eye[0], eye[3]);
//   if (h === 0) return 0;
//   return (v1 + v2) / (2 * h);
// };

// const extractList = (res) => {
//   const data = res?.data ?? {};
//   if (Array.isArray(data)) return { items: data, total: data.length };
//   if (Array.isArray(data.biometrics))
//     return { items: data.biometrics, total: Number(data.total) || data.biometrics.length };
//   if (Array.isArray(data.data))
//     return { items: data.data, total: Number(data.total) || data.data.length };
//   if (Array.isArray(data.items))
//     return { items: data.items, total: Number(data.total) || data.items.length };
//   return { items: [], total: 0 };
// };

// const extractEmployees = (res) => {
//   const data = res?.data ?? {};
//   const arr =
//     (Array.isArray(data) && data) ||
//     data.employees ||
//     data.data ||
//     data.items ||
//     data.result ||
//     [];
//   return arr.map((e) => {
//     const id = e.employee_id || e.id || e.user_id || "";
//     const name =
//       e.full_name ||
//       e.name ||
//       e.employee_name ||
//       `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
//       id;
//     return { id, name, email: e.email || e.company_email || "" };
//   });
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
//       : type === "warning"
//       ? "border-amber-200 bg-amber-50 text-amber-800"
//       : "border-green-200 bg-green-50 text-green-700";

//   return (
//     <div className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
//       <span className="whitespace-pre-line">{message}</span>
//       <button onClick={onDismiss} className="ml-2 shrink-0 opacity-60 hover:opacity-100">✕</button>
//     </div>
//   );
// }

// function EmployeeDropdown({ value, onChange, options, placeholder = "Select employee..." }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const ref = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     const onClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, []);

//   const filtered = query.trim()
//     ? options.filter((o) => {
//         const q = query.toLowerCase();
//         return o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
//       })
//     : options;

//   const selected = options.find((o) => o.id === value);

//   return (
//     <div ref={ref} className="relative">
//       <button
//         type="button"
//         onClick={() => {
//           setOpen((v) => !v);
//           setTimeout(() => inputRef.current?.focus(), 30);
//         }}
//         className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm focus:border-red-500 focus:outline-none"
//       >
//         <span className={selected ? "text-slate-700" : "text-slate-400"}>
//           {selected ? `${selected.name} (${selected.id})` : placeholder}
//         </span>
//         <span className="text-slate-400">▾</span>
//       </button>

//       {open && (
//         <div className="absolute z-40 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
//           <div className="border-b border-slate-100 p-2">
//             <input
//               ref={inputRef}
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Type name or ID..."
//               className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-red-500 focus:outline-none"
//             />
//           </div>
//           <div className="max-h-56 overflow-y-auto py-1">
//             {filtered.length === 0 ? (
//               <div className="px-3 py-4 text-center text-xs text-slate-400">
//                 No employees found
//               </div>
//             ) : (
//               filtered.map((opt) => (
//                 <button
//                   key={opt.id}
//                   type="button"
//                   onClick={() => {
//                     onChange(opt.id);
//                     setOpen(false);
//                     setQuery("");
//                   }}
//                   className={`flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 ${
//                     opt.id === value ? "bg-red-50/40" : ""
//                   }`}
//                 >
//                   <span className="font-medium text-slate-700">{opt.name}</span>
//                   <span className="text-[11px] text-slate-400">{opt.email || opt.id}</span>
//                 </button>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function Pagination({ page, pageSize, total, onPageChange }) {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   if (total <= pageSize) return null;

//   const from = (page - 1) * pageSize + 1;
//   const to = Math.min(page * pageSize, total);

//   return (
//     <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
//       <p className="text-xs text-slate-500">
//         Showing <span className="font-medium text-slate-700">{from}</span>–
//         <span className="font-medium text-slate-700">{to}</span> of{" "}
//         <span className="font-medium text-slate-700">{total}</span>
//       </p>
//       <div className="flex items-center gap-1">
//         <button
//           type="button"
//           disabled={page <= 1}
//           onClick={() => onPageChange(page - 1)}
//           className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//         >
//           Prev
//         </button>
//         <span className="px-3 text-xs text-slate-500">
//           Page <span className="font-medium text-slate-700">{page}</span> / {totalPages}
//         </span>
//         <button
//           type="button"
//           disabled={page >= totalPages}
//           onClick={() => onPageChange(page + 1)}
//           className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    ENROLL MODAL
//    ══════════════════════════════════════════════════════════ */

// function EnrollModal({
//   open,
//   onClose,
//   editRow,
//   employees,
//   onSaved,
//   modelsReady,
//   modelsLoading,
//   modelsError,
//   onRetryModels,
// }) {
//   const [form, setForm] = useState({
//     employee_id: "",
//     device_id: "web",
//     is_active: true,
//   });
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [faceEmbedding, setFaceEmbedding] = useState(null);
//   const [faceScore, setFaceScore] = useState(null);

//   /* camera */
//   const [cameraOpen, setCameraOpen] = useState(false);
//   const [scanStatus, setScanStatus] = useState("idle"); // idle | scanning | face_found | blinked | error
//   const [scanMessage, setScanMessage] = useState("");

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);
//   const rafRef = useRef(null);
//   const detectLoopRef = useRef(null);
//   const earHistoryRef = useRef([]);
//   const blinkStateRef = useRef({ closed: false, frames: 0 });
//   const blinkCaughtRef = useRef(false);

//   /* save state */
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   /* ══════════════ INIT / RESET ══════════════ */
//   useEffect(() => {
//     if (!open) return;
//     if (editRow) {
//       setForm({
//         employee_id: editRow.employee_id || "",
//         device_id: editRow.device_id || "web",
//         is_active: editRow.is_active !== false,
//       });
//       setCapturedImage(editRow.face_image_url || null);
//       setFaceEmbedding(editRow.face_embedding || null);
//       setFaceScore(null);
//     } else {
//       setForm({ employee_id: "", device_id: "web", is_active: true });
//       setCapturedImage(null);
//       setFaceEmbedding(null);
//       setFaceScore(null);
//     }
//     setError("");
//     setScanStatus("idle");
//     setScanMessage("");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, editRow]);

//   /* ══════════════ ESC CLOSE ══════════════ */
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === "Escape" && !saving) {
//         stopCamera();
//         onClose();
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, saving, onClose]);

//   /* ══════════════ CAMERA CONTROL ══════════════ */
//   const stopCamera = useCallback(() => {
//     if (rafRef.current) {
//       cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//     }
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((t) => t.stop());
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       try {
//         videoRef.current.srcObject = null;
//       } catch {}
//     }
//     setCameraOpen(false);
//     setScanStatus("idle");
//     setScanMessage("");
//   }, []);

//   /* Cleanup camera on unmount */
//   useEffect(() => () => stopCamera(), [stopCamera]);

//   const resetBlinkState = () => {
//     earHistoryRef.current = [];
//     blinkStateRef.current = { closed: false, frames: 0 };
//     blinkCaughtRef.current = false;
//   };

//   /* ══════════════ CAPTURE (with embedding) ══════════════ */
//   const captureWithEmbedding = useCallback(async () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;

//     const vw = video.videoWidth;
//     const vh = video.videoHeight;
//     if (!vw || !vh) return;

//     // Compute descriptor BEFORE stopping the camera
//     let descriptor = null;
//     let detScore = 0;
//     try {
//       const det = await faceapi
//         .detectSingleFace(
//           video,
//           new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 })
//         )
//         .withFaceLandmarks()
//         .withFaceDescriptor();

//       if (det?.descriptor) {
//         descriptor = Array.from(det.descriptor);
//         detScore = det.detection?.score || 0;
//       }
//     } catch (e) {
//       console.warn("[Biometric] descriptor failed", e);
//     }

//     // Capture square image
//     const side = Math.min(vw, vh);
//     canvas.width = CAPTURE_SIZE;
//     canvas.height = CAPTURE_SIZE;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(
//       video,
//       (vw - side) / 2,
//       (vh - side) / 2,
//       side,
//       side,
//       0,
//       0,
//       CAPTURE_SIZE,
//       CAPTURE_SIZE
//     );
//     const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

//     setCapturedImage(dataUrl);
//     setFaceEmbedding(descriptor);
//     setFaceScore(detScore);
//     stopCamera();
//   }, [stopCamera]);

//   /* ══════════════ DETECT LOOP (blink liveness) ══════════════ */
//   const detectLoop = useCallback(async () => {
//     const video = videoRef.current;
//     if (!video || blinkCaughtRef.current) return;

//     if (!video.videoWidth) {
//       rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
//       return;
//     }

//     try {
//       const det = await faceapi
//         .detectSingleFace(
//           video,
//           new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 })
//         )
//         .withFaceLandmarks();

//       if (blinkCaughtRef.current) return;

//       if (det) {
//         setScanStatus("face_found");
//         setScanMessage("Blink naturally to confirm it's you");

//         const leftEAR = computeEAR(det.landmarks.getLeftEye());
//         const rightEAR = computeEAR(det.landmarks.getRightEye());
//         const avg = (leftEAR + rightEAR) / 2;

//         const hist = earHistoryRef.current;
//         hist.push(avg);
//         if (hist.length > EAR_HISTORY_SIZE) hist.shift();

//         const state = blinkStateRef.current;

//         if (!state.closed && avg < EAR_CLOSED) {
//           state.closed = true;
//           state.frames = 1;
//         } else if (state.closed && avg < EAR_CLOSED) {
//           state.frames += 1;
//         } else if (state.closed && avg >= EAR_OPEN) {
//           const frames = state.frames;
//           state.closed = false;
//           state.frames = 0;

//           if (frames >= BLINK_MIN_FRAMES && frames <= BLINK_MAX_FRAMES) {
//             blinkCaughtRef.current = true;
//             setScanStatus("blinked");
//             setScanMessage("Verified! Capturing...");
//             setTimeout(() => {
//               captureWithEmbedding();
//             }, 250);
//             return;
//           }
//         }
//       } else {
//         setScanStatus("scanning");
//         setScanMessage("Position your face in the frame");
//         blinkStateRef.current = { closed: false, frames: 0 };
//       }
//     } catch (_) {
//       // swallow per-frame errors
//     }

//     rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
//   }, [captureWithEmbedding]);

//   useEffect(() => {
//     detectLoopRef.current = detectLoop;
//   }, [detectLoop]);

//   /* ══════════════ START CAMERA ══════════════ */
//   const startCamera = useCallback(async () => {
//     setError("");
//     setCapturedImage(null);
//     setFaceEmbedding(null);
//     setFaceScore(null);

//     if (modelsError) {
//       setError("Face models unavailable. Click Retry to reload.");
//       return;
//     }
//     if (!modelsReady) {
//       setError("Face detection is still loading. Please wait a moment.");
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user", width: 640, height: 480 },
//         audio: false,
//       });

//       streamRef.current = stream;
//       setCameraOpen(true);
//       resetBlinkState();
//       setScanStatus("scanning");
//       setScanMessage("Position your face in the frame");

//       await new Promise((resolve) => {
//         const check = () => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//             videoRef.current.onloadeddata = () => {
//               videoRef.current.play().catch(() => {});
//               resolve();
//             };
//           } else {
//             setTimeout(check, 50);
//           }
//         };
//         check();
//       });

//       rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
//     } catch (err) {
//       const msg =
//         err?.name === "NotAllowedError"
//           ? "Camera permission denied. Please allow camera access."
//           : err?.name === "NotFoundError"
//           ? "No camera found."
//           : "Could not start camera.";
//       setError(msg);
//       setCameraOpen(false);
//     }
//   }, [modelsReady, modelsError]);

//   /* ══════════════ SUBMIT ══════════════ */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.employee_id) {
//       setError("Please select an employee");
//       return;
//     }
//     if (!capturedImage) {
//       setError("Please scan a face photo");
//       return;
//     }
//     if (!faceEmbedding || faceEmbedding.length === 0) {
//       setError(
//         "Face descriptor missing.\n\nPossible reasons:\n• Face was not detected clearly\n• Lighting too dark\n• Camera resolution low\n\nPlease retake with proper lighting and face visible."
//       );
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         employee_id: form.employee_id,
//         face_image_url: capturedImage,
//         face_embedding: faceEmbedding,
//         device_id: form.device_id || null,
//         is_active: form.is_active,
//       };

//       if (editRow) {
//         await api.put(
//           `/api/v1/update/employee/biometrics/${editRow.biometric_id || editRow.id}`,
//           payload
//         );
//       } else {
//         await api.post("/api/v1/add/employee/biometric", payload);
//       }

//       onSaved?.();
//     } catch (err) {
//       setError(formatApiError(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ══════════════ FRAME COLOR ══════════════ */
//   const frameColor = useMemo(() => {
//     if (scanStatus === "blinked") return "#16a34a"; // green
//     if (scanStatus === "face_found") return "#f59e0b"; // amber
//     return "#E42527"; // red
//   }, [scanStatus]);

//   if (!open) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//       onClick={() => !saving && onClose()}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//           <div>
//             <h2 className="text-base font-semibold text-slate-800">
//               {editRow ? "Edit Biometric" : "Enroll Biometric"}
//             </h2>
//             <p className="mt-0.5 text-xs text-slate-500">
//               {editRow
//                 ? "Update face photo and embedding"
//                 : "Capture face for attendance verification"}
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

//         {/* Model warnings */}
//         {modelsLoading && (
//           <div className="border-b border-blue-100 bg-blue-50 px-5 py-2 text-xs text-blue-700">
//             Loading face detection models...
//           </div>
//         )}
//         {modelsError && (
//           <div className="flex items-start justify-between gap-3 border-b border-amber-100 bg-amber-50 px-5 py-2 text-xs text-amber-800">
//             <div>
//               <p className="font-medium">Face detection unavailable</p>
//               <p className="mt-0.5">{modelsError}</p>
//             </div>
//             <button
//               type="button"
//               onClick={onRetryModels}
//               className="shrink-0 rounded border border-amber-300 px-2 py-1 text-[11px] font-medium hover:bg-amber-100"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4 p-5">
//           {/* Toast */}
//           {error && (
//             <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
//               {error}
//             </div>
//           )}

//           {/* Employee */}
//           <div>
//             <label className="mb-1 block text-xs font-medium text-slate-600">
//               Employee <span className="text-red-600">*</span>
//             </label>
//             {editRow ? (
//               <input
//                 value={form.employee_id}
//                 disabled
//                 className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
//               />
//             ) : (
//               <EmployeeDropdown
//                 value={form.employee_id}
//                 onChange={(v) => setForm((p) => ({ ...p, employee_id: v }))}
//                 options={employees}
//               />
//             )}
//           </div>

//           {/* Face scan */}
//           <div>
//             <label className="mb-1 block text-xs font-medium text-slate-600">
//               Face Scan <span className="text-red-600">*</span>
//             </label>

//             {/* Captured preview */}
//             {capturedImage && !cameraOpen && (
//               <div className="mb-3 flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
//                 <img
//                   src={capturedImage}
//                   alt="Captured face"
//                   className="h-32 w-32 rounded-xl object-cover ring-2 ring-white"
//                 />
//                 <div className="flex items-center gap-3 text-[11px]">
//                   {faceEmbedding ? (
//                     <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
//                       ✓ Embedding: {faceEmbedding.length}-D
//                     </span>
//                   ) : (
//                     <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700">
//                       ✗ No embedding
//                     </span>
//                   )}
//                   {faceScore > 0 && (
//                     <span className="text-slate-500">
//                       Quality: {(faceScore * 100).toFixed(0)}%
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   type="button"
//                   onClick={startCamera}
//                   className="text-xs font-medium text-red-600 hover:underline"
//                 >
//                   Retake Photo
//                 </button>
//               </div>
//             )}

//             {/* Camera live view */}
//             {cameraOpen && (
//               <div className="mb-3 flex flex-col items-center gap-2">
//                 <div className="relative w-full" style={{ height: 220 }}>
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="h-full w-full rounded-xl bg-black object-cover"
//                     style={{ transform: "scaleX(-1)" }}
//                   />
//                   <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//                     <div style={{ width: 150, height: 150, position: "relative" }}>
//                       {[
//                         "top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
//                         "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
//                         "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
//                         "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
//                       ].map((pos, i) => (
//                         <div
//                           key={i}
//                           className={`absolute h-7 w-7 ${pos}`}
//                           style={{ borderColor: frameColor, transition: "border-color 0.2s" }}
//                         />
//                       ))}
//                       {scanStatus === "scanning" && (
//                         <div
//                           className="absolute left-0 right-0 h-0.5 animate-pulse"
//                           style={{ background: frameColor, top: "50%" }}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <p className="text-sm font-medium" style={{ color: frameColor }}>
//                   {scanMessage}
//                 </p>

//                 <button
//                   type="button"
//                   onClick={stopCamera}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
//                 >
//                   Cancel Scan
//                 </button>
//               </div>
//             )}

//             {/* Start button */}
//             {!cameraOpen && !capturedImage && (
//               <button
//                 type="button"
//                 onClick={startCamera}
//                 disabled={!modelsReady || !!modelsError || modelsLoading}
//                 className="w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50/40 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {modelsLoading
//                   ? "Loading face detection..."
//                   : modelsError
//                   ? "Face detection unavailable"
//                   : "📷 Start Face Scan"}
//               </button>
//             )}

//             <canvas ref={canvasRef} className="hidden" />
//           </div>

//           {/* Device */}
//           <div>
//             <label className="mb-1 block text-xs font-medium text-slate-600">
//               Device Type
//             </label>
//             <select
//               value={form.device_id}
//               onChange={(e) => setForm((p) => ({ ...p, device_id: e.target.value }))}
//               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
//             >
//               {DEVICE_OPTIONS.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Active toggle */}
//           <label className="flex items-center gap-2 text-sm text-slate-700">
//             <input
//               type="checkbox"
//               checked={form.is_active}
//               onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
//               className="h-4 w-4 rounded border-slate-300 accent-red-600"
//             />
//             Active (can be used for punch verification)
//           </label>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
//             <button
//               type="button"
//               onClick={() => {
//                 stopCamera();
//                 onClose();
//               }}
//               disabled={saving}
//               className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving || !capturedImage}
//               className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {saving ? "Saving..." : editRow ? "Update" : "Enroll"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN PAGE
//    ══════════════════════════════════════════════════════════ */

// export default function BiometricsPage() {
//   /* list */
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   /* employees */
//   const [employees, setEmployees] = useState([]);

//   /* ui */
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editRow, setEditRow] = useState(null);

//   /* models */
//   const [modelsReady, setModelsReady] = useState(false);
//   const [modelsLoading, setModelsLoading] = useState(true);
//   const [modelsError, setModelsError] = useState("");

//   const reqIdRef = useRef(0);
//   const didInitRef = useRef(false);

//   /* ══════════════ LOAD MODELS ══════════════ */
//   const loadModels = useCallback(async () => {
//     setModelsLoading(true);
//     setModelsError("");
//     setModelsReady(false);

//     let lastErr = null;
//     for (const baseUrl of MODEL_SOURCES) {
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(baseUrl),
//           faceapi.nets.faceLandmark68Net.loadFromUri(baseUrl),
//           faceapi.nets.faceRecognitionNet.loadFromUri(baseUrl),
//         ]);
//         setModelsReady(true);
//         setModelsLoading(false);
//         return;
//       } catch (e) {
//         lastErr = e;
//       }
//     }

//     setModelsLoading(false);
//     setModelsError(
//       lastErr?.message ||
//         "Face models could not be loaded. Check internet or /public/models folder."
//     );
//   }, []);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (cancelled) return;
//       await loadModels();
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [loadModels]);

//   /* ══════════════ LOAD EMPLOYEES ══════════════ */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await api.get("/api/v1/get/employees", {
//           params: { page: 1, page_size: 500 },
//         });
//         if (cancelled) return;
//         setEmployees(extractEmployees(res));
//       } catch {
//         if (!cancelled) setEmployees([]);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* ══════════════ FETCH LIST ══════════════ */
//   const fetchList = useCallback(async () => {
//     const myReqId = ++reqIdRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const params = { page, page_size: PAGE_SIZE };
//       if (search) params.search = search;
//       const res = await api.get("/api/v1/get/employee/biometrics", { params });
//       if (myReqId !== reqIdRef.current) return;
//       const { items, total: t } = extractList(res);
//       setList(items);
//       setTotal(t);
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

//   /* ══════════════ HELPERS ══════════════ */
//   const getEmpName = (id) => {
//     if (!id) return "—";
//     const e = employees.find((x) => x.id === id);
//     return e ? e.name : id;
//   };

//   const handleAdd = () => {
//     setEditRow(null);
//     setShowModal(true);
//   };

//   const handleEdit = (row) => {
//     setEditRow(row);
//     setShowModal(true);
//   };

//   const handleSaved = () => {
//     setShowModal(false);
//     setSuccess(editRow ? "Biometric updated" : "Biometric enrolled");
//     setEditRow(null);
//     fetchList();
//   };

//   /* ══════════════ RENDER ══════════════ */
//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-6xl">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Biometrics</h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Face enrollment for attendance matching
//               {total > 0 && (
//                 <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
//                   {total} total
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {modelsError && (
//               <button
//                 type="button"
//                 onClick={loadModels}
//                 className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 ↻ Retry Models
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={handleAdd}
//               className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
//             >
//               + Enroll Face
//             </button>
//           </div>
//         </div>

//         {/* Model status */}
//         {modelsLoading && (
//           <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-700">
//             Loading face detection models...
//           </div>
//         )}

//         {/* Toast */}
//         <Toast type="error" message={error} onDismiss={() => setError("")} />
//         <Toast type="success" message={success} onDismiss={() => setSuccess("")} />

//         {/* Search */}
//         <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="relative max-w-md">
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search by employee ID or name..."
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
//                   <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
//                 ))}
//               </div>
//             ) : list.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
//                   🧑
//                 </div>
//                 <p className="text-sm font-medium text-slate-700">
//                   No biometrics enrolled
//                 </p>
//                 <p className="text-xs text-slate-500">
//                   Start by enrolling an employee&apos;s face
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleAdd}
//                   className="mt-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                 >
//                   + Enroll Face
//                 </button>
//               </div>
//             ) : (
//               <table className="w-full min-w-[720px] text-left text-sm">
//                 <thead>
//                   <tr className="border-b bg-slate-50">
//                     <th className="px-5 py-3 font-medium text-slate-500">Employee</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Face</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Embedding</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Device</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Status</th>
//                     <th className="px-5 py-3 font-medium text-slate-500">Enrolled</th>
//                     <th className="px-5 py-3 text-right font-medium text-slate-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {list.map((row, i) => {
//                     const hasEmbedding =
//                       Array.isArray(row.face_embedding) && row.face_embedding.length > 0;
//                     return (
//                       <tr key={row.biometric_id || i} className="hover:bg-slate-50">
//                         <td className="px-5 py-3.5 text-slate-700">
//                           {getEmpName(row.employee_id)}
//                         </td>
//                         <td className="px-5 py-3.5">
//                           {row.face_image_url ? (
//                             <img
//                               src={row.face_image_url}
//                               alt="face"
//                               className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
//                             />
//                           ) : (
//                             <span className="text-slate-400">—</span>
//                           )}
//                         </td>
//                         <td className="px-5 py-3.5">
//                           {hasEmbedding ? (
//                             <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
//                               {row.face_embedding.length}-D ✓
//                             </span>
//                           ) : (
//                             <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
//                               Missing
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-5 py-3.5 text-slate-600">
//                           {row.device_id || "—"}
//                         </td>
//                         <td className="px-5 py-3.5">
//                           {row.is_active !== false ? (
//                             <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
//                               <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
//                               Active
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
//                               <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
//                               Inactive
//                             </span>
//                           )}
//                         </td>
//                         <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 text-xs">
//                           {formatDateTime(row.enrolled_at || row.created_at)}
//                         </td>
//                         <td className="px-5 py-3.5 text-right">
//                           <button
//                             type="button"
//                             onClick={() => handleEdit(row)}
//                             className="text-xs font-medium text-slate-600 hover:text-red-600"
//                           >
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {!loading && list.length > 0 && (
//             <Pagination
//               page={page}
//               pageSize={PAGE_SIZE}
//               total={total}
//               onPageChange={setPage}
//             />
//           )}
//         </div>
//       </div>

//       <EnrollModal
//         open={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditRow(null);
//         }}
//         editRow={editRow}
//         employees={employees}
//         onSaved={handleSaved}
//         modelsReady={modelsReady}
//         modelsLoading={modelsLoading}
//         modelsError={modelsError}
//         onRetryModels={loadModels}
//       />
//     </div>
//   );
// }


"use client";

/**
 * BiometricsPage — Face Enrollment
 * Auto-capture after 2 sec of stable face detection (no blink required)
 * Manual "Capture Now" button as fallback
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { api } from "@/app/lib/api";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 450;
const AUTO_DISMISS_MS = 5000;
const DETECTION_INTERVAL_MS = 300;
const STABLE_DURATION_MS = 2000; // 2 sec face stable → auto capture

const CAPTURE_SIZE = 320;
const JPEG_QUALITY = 0.72;

const MODEL_SOURCES = [
  "/models",
  "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights",
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights",
];

const DEVICE_OPTIONS = [
  { value: "web", label: "Web Browser" },
  { value: "mobile", label: "Mobile" },
  { value: "biometric", label: "Biometric Machine" },
  { value: "face", label: "Face Recognition Device" },
  { value: "manual", label: "Manual Entry" },
  { value: "api", label: "API" },
];

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

const formatDateTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return d.toLocaleString("en-IN", {
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

const extractList = (res) => {
  const data = res?.data ?? {};
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.biometrics))
    return { items: data.biometrics, total: Number(data.total) || data.biometrics.length };
  if (Array.isArray(data.data))
    return { items: data.data, total: Number(data.total) || data.data.length };
  if (Array.isArray(data.items))
    return { items: data.items, total: Number(data.total) || data.items.length };
  return { items: [], total: 0 };
};

const extractEmployees = (res) => {
  const data = res?.data ?? {};
  const arr =
    (Array.isArray(data) && data) ||
    data.employees ||
    data.data ||
    data.items ||
    data.result ||
    [];
  return arr.map((e) => {
    const id = e.employee_id || e.id || e.user_id || "";
    const name =
      e.full_name ||
      e.name ||
      e.employee_name ||
      `${e.first_name || ""} ${e.last_name || ""}`.trim() ||
      id;
    return { id, name, email: e.email || e.company_email || "" };
  });
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

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}
    >
      <span className="whitespace-pre-line">{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 shrink-0 opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPLOYEE DROPDOWN
   ══════════════════════════════════════════════════════════ */

function EmployeeDropdown({
  value,
  onChange,
  options,
  placeholder = "Select employee...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = query.trim()
    ? options.filter((o) => {
        const q = query.toLowerCase();
        return (
          o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
        );
      })
    : options;

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm focus:border-red-500 focus:outline-none"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {selected ? `${selected.name} (${selected.id})` : placeholder}
        </span>
        <span className="text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type name or ID..."
              className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No employees found
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    opt.id === value ? "bg-red-50/40" : ""
                  }`}
                >
                  <span className="font-medium text-slate-700">{opt.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {opt.email || opt.id}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGINATION
   ══════════════════════════════════════════════════════════ */

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="px-3 text-xs text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> /{" "}
          {totalPages}
        </span>
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
  );
}

/* ══════════════════════════════════════════════════════════
   ENROLL MODAL
   ══════════════════════════════════════════════════════════ */

function EnrollModal({
  open,
  onClose,
  editRow,
  employees,
  onSaved,
  modelsReady,
  modelsLoading,
  modelsError,
  onRetryModels,
}) {
  const [form, setForm] = useState({
    employee_id: "",
    device_id: "web",
    is_active: true,
  });
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  const [faceScore, setFaceScore] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle");
  const [scanMessage, setScanMessage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const detectLoopRef = useRef(null);
  const faceDetectedSinceRef = useRef(null);
  const captureDoneRef = useRef(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ══════════════ INIT / RESET ══════════════ */
  useEffect(() => {
    if (!open) return;
    if (editRow) {
      setForm({
        employee_id: editRow.employee_id || "",
        device_id: editRow.device_id || "web",
        is_active: editRow.is_active !== false,
      });
      setCapturedImage(editRow.face_image_url || null);
      setFaceEmbedding(editRow.face_embedding || null);
      setFaceScore(null);
    } else {
      setForm({ employee_id: "", device_id: "web", is_active: true });
      setCapturedImage(null);
      setFaceEmbedding(null);
      setFaceScore(null);
    }
    setError("");
    setScanStatus("idle");
    setScanMessage("");
    faceDetectedSinceRef.current = null;
    captureDoneRef.current = false;
  }, [open, editRow]);

  /* ══════════════ ESC CLOSE ══════════════ */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) {
        stopCamera();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, saving, onClose]);

  /* ══════════════ STOP CAMERA ══════════════ */
  const stopCamera = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch {}
    }
    setCameraOpen(false);
    setScanStatus("idle");
    setScanMessage("");
    faceDetectedSinceRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  /* ══════════════ CAPTURE WITH EMBEDDING ══════════════ */
  const captureWithEmbedding = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    let descriptor = null;
    let detScore = 0;

    try {
      // Lazy load recognition model
      if (!faceapi.nets.faceRecognitionNet.isLoaded) {
        console.log("[Face] Loading recognition model...");
        let loaded = false;
        for (const baseUrl of MODEL_SOURCES) {
          try {
            await faceapi.nets.faceRecognitionNet.loadFromUri(baseUrl);
            loaded = true;
            break;
          } catch {}
        }
        if (!loaded) console.warn("[Face] Recognition model failed");
      }

      const det = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.3,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (det?.descriptor) {
        descriptor = Array.from(det.descriptor);
        detScore = det.detection?.score || 0;
        console.log(
          "[Face] Descriptor:",
          descriptor.length,
          "D, score:",
          detScore
        );
      }
    } catch (e) {
      console.error("[Face] Descriptor failed:", e);
    }

    // Capture square image
    const side = Math.min(vw, vh);
    canvas.width = CAPTURE_SIZE;
    canvas.height = CAPTURE_SIZE;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      video,
      (vw - side) / 2,
      (vh - side) / 2,
      side,
      side,
      0,
      0,
      CAPTURE_SIZE,
      CAPTURE_SIZE
    );
    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

    setCapturedImage(dataUrl);
    setFaceEmbedding(descriptor);
    setFaceScore(detScore);
    stopCamera();
  }, [stopCamera]);

  /* ══════════════ DETECT LOOP — Auto capture after stable ══════════════ */
  const detectLoop = useCallback(async () => {
    const video = videoRef.current;
    if (!video || captureDoneRef.current) return;

    if (!video.videoWidth || !video.videoHeight) {
      timerRef.current = setTimeout(() => detectLoopRef.current?.(), 300);
      return;
    }

    try {
      const det = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.3,
          })
        )
        .withFaceLandmarks();

      if (captureDoneRef.current) return;

      if (det) {
        const now = Date.now();
        if (!faceDetectedSinceRef.current) {
          faceDetectedSinceRef.current = now;
        }
        const stableMs = now - faceDetectedSinceRef.current;

        setScanStatus("face_found");
        const remaining = Math.max(0, STABLE_DURATION_MS - stableMs);
        setScanMessage(
          remaining > 0
            ? `Hold still... capturing in ${(remaining / 1000).toFixed(1)}s`
            : "Capturing..."
        );

        // Auto-capture after STABLE_DURATION_MS
        if (
          stableMs >= STABLE_DURATION_MS &&
          !captureDoneRef.current
        ) {
          console.log("[Face] 📸 Auto-capturing now!");
          captureDoneRef.current = true;
          setScanStatus("blinked");
          setScanMessage("Capturing...");
          setTimeout(() => {
            captureWithEmbedding();
          }, 200);
          return;
        }
      } else {
        faceDetectedSinceRef.current = null;
        setScanStatus("scanning");
        setScanMessage("Position your face in the frame");
      }
    } catch {}

    timerRef.current = setTimeout(() => detectLoopRef.current?.(), 300);
  }, [captureWithEmbedding]);

  useEffect(() => {
    detectLoopRef.current = detectLoop;
  }, [detectLoop]);

  /* ══════════════ START CAMERA ══════════════ */
  const startCamera = useCallback(async () => {
    setError("");
    setCapturedImage(null);
    setFaceEmbedding(null);
    setFaceScore(null);
    faceDetectedSinceRef.current = null;
    captureDoneRef.current = false;

    if (modelsError) {
      setError("Face models unavailable. Click Retry to reload.");
      return;
    }
    if (!modelsReady) {
      setError("Face detection is still loading. Please wait a moment.");
      return;
    }

    try {
      console.log("[Face] Starting camera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);
      setScanStatus("scanning");
      setScanMessage("Position your face in the frame");

      await new Promise((resolve) => {
        const check = () => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            const onReady = () => {
              videoRef.current.play().then(resolve).catch(resolve);
            };
            if (videoRef.current.readyState >= 3) {
              onReady();
            } else {
              videoRef.current.onloadeddata = onReady;
            }
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });

      timerRef.current = setTimeout(() => detectLoopRef.current?.(), 500);
    } catch (err) {
      const msg =
        err?.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access."
          : err?.name === "NotFoundError"
          ? "No camera found on this device."
          : err?.name === "NotReadableError"
          ? "Camera is being used by another app."
          : "Could not start camera: " + (err?.message || "unknown");
      setError(msg);
      setCameraOpen(false);
    }
  }, [modelsReady, modelsError]);

  /* ══════════════ SUBMIT ══════════════ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.employee_id) {
      setError("Please select an employee");
      return;
    }
    if (!capturedImage) {
      setError("Please scan a face photo");
      return;
    }
    if (!faceEmbedding || faceEmbedding.length === 0) {
      setError(
        "Face descriptor missing.\n\nPlease retake with proper lighting and face clearly visible."
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        employee_id: form.employee_id,
        face_image_url: capturedImage,
        face_embedding: faceEmbedding,
        device_id: form.device_id || null,
        is_active: form.is_active,
      };

      if (editRow) {
        await api.put(
          `/api/v1/update/employee/biometrics/${
            editRow.biometric_id || editRow.id
          }`,
          payload
        );
      } else {
        await api.post("/api/v1/add/employee/biometric", payload);
      }

      onSaved?.();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const frameColor = useMemo(() => {
    if (scanStatus === "blinked") return "#16a34a";
    if (scanStatus === "face_found") return "#f59e0b";
    return "#E42527";
  }, [scanStatus]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !saving && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {editRow ? "Edit Biometric" : "Enroll Biometric"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {editRow
                ? "Update face photo"
                : "Capture face for attendance verification"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {modelsLoading && (
          <div className="border-b border-blue-100 bg-blue-50 px-5 py-2 text-xs text-blue-700">
            Loading face detection models...
          </div>
        )}
        {modelsError && (
          <div className="flex items-start justify-between gap-3 border-b border-amber-100 bg-amber-50 px-5 py-2 text-xs text-amber-800">
            <div>
              <p className="font-medium">Face detection unavailable</p>
              <p className="mt-0.5">{modelsError}</p>
            </div>
            <button
              type="button"
              onClick={onRetryModels}
              className="shrink-0 rounded border border-amber-300 px-2 py-1 text-[11px] font-medium hover:bg-amber-100"
            >
              Retry
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="whitespace-pre-line rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Employee */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Employee <span className="text-red-600">*</span>
            </label>
            {editRow ? (
              <input
                value={form.employee_id}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
              />
            ) : (
              <EmployeeDropdown
                value={form.employee_id}
                onChange={(v) => setForm((p) => ({ ...p, employee_id: v }))}
                options={employees}
              />
            )}
          </div>

          {/* Face scan */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Face Scan <span className="text-red-600">*</span>
            </label>

            {/* Captured preview */}
            {capturedImage && !cameraOpen && (
              <div className="mb-3 flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <img
                  src={capturedImage}
                  alt="Captured face"
                  className="h-32 w-32 rounded-xl object-cover ring-2 ring-white"
                />
                <div className="flex items-center gap-3 text-[11px]">
                  {faceEmbedding ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                      ✓ Ready: {faceEmbedding.length}-D
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700">
                      ✗ No face data
                    </span>
                  )}
                  {faceScore > 0 && (
                    <span className="text-slate-500">
                      Quality: {(faceScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Retake Photo
                </button>
              </div>
            )}

            {/* Live camera */}
            {cameraOpen && (
              <div className="mb-3 flex flex-col items-center gap-2">
                <div className="relative w-full" style={{ height: 220 }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full rounded-xl bg-black object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        width: 150,
                        height: 150,
                        position: "relative",
                      }}
                    >
                      {[
                        "top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
                        "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
                        "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
                        "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
                      ].map((pos, i) => (
                        <div
                          key={i}
                          className={`absolute h-7 w-7 ${pos}`}
                          style={{
                            borderColor: frameColor,
                            transition: "border-color 0.2s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p
                  className="text-sm font-medium"
                  style={{ color: frameColor }}
                >
                  {scanMessage}
                </p>

                {/* Manual capture button */}
                {(scanStatus === "face_found" ||
                  scanStatus === "scanning") && (
                  <button
                    type="button"
                    onClick={() => {
                      if (captureDoneRef.current) return;
                      captureDoneRef.current = true;
                      faceDetectedSinceRef.current = null;
                      setScanStatus("blinked");
                      setScanMessage("Capturing...");
                      captureWithEmbedding();
                    }}
                    className="mt-1 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-green-700"
                  >
                    📸 Capture Now
                  </button>
                )}

                <button
                  type="button"
                  onClick={stopCamera}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Start button */}
            {!cameraOpen && !capturedImage && (
              <button
                type="button"
                onClick={startCamera}
                disabled={!modelsReady || !!modelsError || modelsLoading}
                className="w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50/40 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {modelsLoading
                  ? "Loading face detection..."
                  : modelsError
                  ? "Face detection unavailable"
                  : "📷 Start Face Scan"}
              </button>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Device */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Device Type
            </label>
            <select
              value={form.device_id}
              onChange={(e) =>
                setForm((p) => ({ ...p, device_id: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            >
              {DEVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((p) => ({ ...p, is_active: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300 accent-red-600"
            />
            Active (used for punch verification)
          </label>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !capturedImage}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : editRow ? "Update" : "Enroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function BiometricsPage() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [modelsReady, setModelsReady] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState("");

  const reqIdRef = useRef(0);
  const didInitRef = useRef(false);

  /* ══════════════ LOAD MODELS ══════════════ */
  const loadModels = useCallback(async () => {
    setModelsLoading(true);
    setModelsError("");
    setModelsReady(false);

    let lastErr = null;
    for (const baseUrl of MODEL_SOURCES) {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(baseUrl),
          faceapi.nets.faceLandmark68Net.loadFromUri(baseUrl),
        ]);
        setModelsReady(true);
        setModelsLoading(false);
        return;
      } catch (e) {
        lastErr = e;
      }
    }

    setModelsLoading(false);
    setModelsError(
      lastErr?.message ||
        "Face models could not be loaded. Check /public/models folder."
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadModels();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadModels]);

  /* ══════════════ LOAD EMPLOYEES ══════════════ */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/v1/get/employees", {
          params: { page: 1, page_size: 500 },
        });
        if (cancelled) return;
        setEmployees(extractEmployees(res));
      } catch {
        if (!cancelled) setEmployees([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ══════════════ FETCH LIST ══════════════ */
  const fetchList = useCallback(async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setError("");
    try {
      const params = { page, page_size: PAGE_SIZE };
      if (search) params.search = search;
      const res = await api.get("/api/v1/get/employee/biometrics", { params });
      if (myReqId !== reqIdRef.current) return;
      const { items, total: t } = extractList(res);
      setList(items);
      setTotal(t);
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

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ══════════════ HELPERS ══════════════ */
  const getEmpName = (id) => {
    if (!id) return "—";
    const e = employees.find((x) => x.id === id);
    return e ? e.name : id;
  };

  const handleAdd = () => {
    setEditRow(null);
    setShowModal(true);
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setShowModal(true);
  };

  const handleSaved = () => {
    setShowModal(false);
    setSuccess(editRow ? "Biometric updated" : "Biometric enrolled");
    setEditRow(null);
    fetchList();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Biometrics</h1>
            <p className="mt-1 text-sm text-slate-500">
              Face enrollment for attendance matching
              {total > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {total} total
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {modelsError && (
              <button
                type="button"
                onClick={loadModels}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ↻ Retry Models
              </button>
            )}
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              + Enroll Face
            </button>
          </div>
        </div>

        {modelsLoading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-700">
            Loading face detection models...
          </div>
        )}

        <Toast type="error" message={error} onDismiss={() => setError("")} />
        <Toast
          type="success"
          message={success}
          onDismiss={() => setSuccess("")}
        />

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by employee ID or name..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-9 text-sm focus:border-red-500 focus:outline-none"
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
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded bg-slate-100"
                  />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  🧑
                </div>
                <p className="text-sm font-medium text-slate-700">
                  No biometrics enrolled
                </p>
                <p className="text-xs text-slate-500">
                  Start by enrolling an employee&apos;s face
                </p>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="mt-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  + Enroll Face
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-5 py-3 font-medium text-slate-500">
                      Employee
                    </th>
                    <th className="px-5 py-3 font-medium text-slate-500">
                      Face
                    </th>
                    <th className="px-5 py-3 font-medium text-slate-500">
                      Embedding
                    </th>
                    <th className="px-5 py-3 font-medium text-slate-500">
                      Device
                    </th>
                    <th className="px-5 py-3 font-medium text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-3 font-medium text-slate-500">
                      Enrolled
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((row, i) => {
                    const hasEmbedding =
                      Array.isArray(row.face_embedding) &&
                      row.face_embedding.length > 0;
                    return (
                      <tr
                        key={row.biometric_id || i}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-3.5 text-slate-700">
                          {getEmpName(row.employee_id)}
                        </td>
                        <td className="px-5 py-3.5">
                          {row.face_image_url ? (
                            <img
                              src={row.face_image_url}
                              alt="face"
                              className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {hasEmbedding ? (
                            <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              {row.face_embedding.length}-D ✓
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {row.device_id || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          {row.is_active !== false ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-500">
                          {formatDateTime(row.enrolled_at || row.created_at)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleEdit(row)}
                            className="text-xs font-medium text-slate-600 hover:text-red-600"
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

          {!loading && list.length > 0 && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <EnrollModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditRow(null);
        }}
        editRow={editRow}
        employees={employees}
        onSaved={handleSaved}
        modelsReady={modelsReady}
        modelsLoading={modelsLoading}
        modelsError={modelsError}
        onRetryModels={loadModels}
      />
    </div>
  );
}