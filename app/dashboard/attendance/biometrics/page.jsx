
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import { api } from "@/lib/api";

const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((e) => e.msg || "Error").join(" • ");
  if (typeof detail === "string") return detail;
  return err?.message || "Something went wrong";
};

const toArray = (p) => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.biometrics)) return p.biometrics;
  if (Array.isArray(p?.employees)) return p.employees;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.items)) return p.items;
  return [];
};

const formatDateTime = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(d);
  }
};

// ---------- Blink detection helper (Eye Aspect Ratio) ----------
const EAR = (eye) => {
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const v1 = dist(eye[1], eye[5]);
  const v2 = dist(eye[2], eye[4]);
  const h = dist(eye[0], eye[3]);
  return (v1 + v2) / (2 * h);
};

export default function BiometricsPage() {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Camera + scan states
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);
  // scanStatus: idle | scanning | face_found | blinked | error
  const [scanStatus, setScanStatus] = useState("idle");
  const [scanMessage, setScanMessage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const detectLoopRef = useRef(null);
  const earHistory = useRef([]);
  const blinkCaught = useRef(false);

  const [form, setForm] = useState({
    employee_id: "",
    face_image_url: "",
    device_id: "",
    is_active: true,
  });

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/get/employee/biometrics", {
        params: { page, page_size: 10, search: search || undefined },
      });
      setList(toArray(res?.data));
    } catch (err) {
      setError(formatApiError(err));
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/get/employees", {
        params: { page: 1, page_size: 300 },
      });
      setEmployees(toArray(res?.data));
    } catch (err) {
      console.error("Employees load error", err);
      setEmployees([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchList();
    }, 0);

    
    return () => clearTimeout(timer);
  }, [fetchList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchEmployees();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  // ---------- Camera control ----------
  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setScanStatus("idle");
  };

  // Load face-api models once on mount
  useEffect(() => {
    (async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        queueMicrotask(() => setModelsReady(true));
      } catch (e) {
        console.error("Face model load failed", e);
      }
    })();
    return () => stopCamera();
  }, []);

  const openCamera = async () => {
    setError("");
    setCapturedImage(null);

    if (!modelsReady) {
      setError("Face detection is still loading. Please wait a second and try again.");
      return;
      
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);
      blinkCaught.current = false;
      earHistory.current = [];
      setScanStatus("scanning");
      setScanMessage("Position your face in the frame");

      // Wait for actual video element + real frame data before detecting,
      // instead of a fixed setTimeout guess
      const waitForVideo = () =>
        new Promise((resolve) => {
          const check = () => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.onloadeddata = () => {
                videoRef.current.play();
                resolve();
              };
            } else {
              setTimeout(check, 50);
            }
          };
          check();
        });

      await waitForVideo();
      console.log("Video ready:", videoRef.current.videoWidth, videoRef.current.videoHeight);
      detectLoopRef.current?.();
    } catch (err) {
      setError("Camera access denied or not available. Please allow camera permission.");
      setCameraOpen(false);
    }
  };

  // Photo capture (now auto-triggered after blink, not a button click)
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    setForm((p) => ({ ...p, face_image_url: dataUrl }));

    stopCamera();
  };

  // ---------- Auto detection + blink loop ----------
  const detectLoop = useCallback(async () => {
    if (!videoRef.current || blinkCaught.current) return;

    // Skip if video has no real frame yet (videoWidth 0 = detectSingleFace will always fail silently)
    if (videoRef.current.videoWidth === 0) {
      rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
      return;
    }

    const det = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 })
      )
      .withFaceLandmarks();

    // DEBUG: remove this console.log once it's working
    console.log("detection result:", det ? "FACE FOUND" : "no face", "videoWidth:", videoRef.current.videoWidth);

    if (det) {
      setScanStatus("face_found");
      setScanMessage("Blink naturally to confirm it's you");

      const leftEAR = EAR(det.landmarks.getLeftEye());
      const rightEAR = EAR(det.landmarks.getRightEye());
      const avg = (leftEAR + rightEAR) / 2;

      earHistory.current.push(avg);
      if (earHistory.current.length > 10) earHistory.current.shift();

      // DEBUG: watch this in console to find your real open/closed eye values
      console.log("EAR:", avg.toFixed(3));

      const h = earHistory.current;
      const blinked =
        h.length >= 5 && Math.min(...h.slice(-5)) < 0.25 && h[h.length - 1] > 0.25;

      if (blinked) {
        blinkCaught.current = true;
        setScanStatus("blinked");
        setScanMessage("Verified! Capturing...");
        setTimeout(capturePhoto, 300);
        return;
      }
    } else {
      setScanStatus("scanning");
      setScanMessage("Position your face in the frame");
    }

    rafRef.current = requestAnimationFrame(() => detectLoopRef.current?.());
  }, []);

  useEffect(() => {
    detectLoopRef.current = detectLoop;
  }, [detectLoop]);

  // Form band karte time camera bhi band
  const closeForm = () => {
    stopCamera();
    setCapturedImage(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({
      employee_id: "",
      face_image_url: "",
      device_id: "",
      is_active: true,
    });
    setCapturedImage(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEdit = (row) => {
    setEditId(row.biometric_id || row.id);
    setForm({
      employee_id: row.employee_id || "",
      face_image_url: row.face_image_url || "",
      device_id: row.device_id || "",
      is_active: row.is_active !== false,
    });
    setCapturedImage(row.face_image_url || null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.employee_id) {
      setError("Please select employee");
      setSaving(false);
      return;
    }

    if (!form.face_image_url && !capturedImage) {
      setError("Please scan face photo");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        employee_id: form.employee_id,
        face_image_url: form.face_image_url || capturedImage || null,
        device_id: form.device_id || null,
        is_active: form.is_active,
      };

      if (editId) {
        await api.put(`/api/v1/update/employee/biometrics/${editId}`, payload);
        setSuccess(`${getEmployeeNameById(form.employee_id)} Biometric update Successfully`);
      } else {
        await api.post("/api/v1/add/employee/biometric", payload);
        setSuccess(`${getEmployeeNameById(form.employee_id)} biometric enroll Successfully`);
      }

      closeForm();
      fetchList();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const getEmployeeLabel = (emp) => {
    const id = emp.employee_id || emp.id || emp.user_id || "";
    const name =
      emp.full_name ||
      emp.name ||
      emp.employee_name ||
      `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
      "";
    return name ? `${name} (${id})` : id;
  };

  // Employee_id se naam dhoondne ke liye — table mein id ki jagah naam dikhane ke liye
  const getEmployeeNameById = (empId) => {
    const emp = employees.find(
      (e) => (e.employee_id || e.id || e.user_id) === empId
    );
    if (!emp) return empId || "—";
    const name =
      emp.full_name ||
      emp.name ||
      emp.employee_name ||
      `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
    return name || empId;
  };

  // Frame color based on scan progress: red -> amber -> green
  const frameColor =
    scanStatus === "blinked" ? "#16a34a" : scanStatus === "face_found" ? "#f59e0b" : "#E42527";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f6f8] p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a]">Biometrics</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Face enrollment for attendance matching
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-md bg-[#E42527] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c91f21]"
        >
          + Enroll
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex gap-2 border-b border-[#e5e7eb] px-5 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#E42527] focus:outline-none focus:ring-1 focus:ring-[#E42527]"
          />
          <button
            onClick={() => {
              setPage(1);
              fetchList();
            }}
            className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
          >
            Search
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6b7280]">
              No biometrics found
            </div>
          ) : (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Employee</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Face</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Device</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Active</th>
                  <th className="px-5 py-3 font-medium text-[#6b7280]">Enrolled</th>
                  <th className="px-5 py-3 text-right font-medium text-[#6b7280]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {list.map((row, i) => (
                  <tr key={row.biometric_id || i} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-3.5">{getEmployeeNameById(row.employee_id)}</td>
                    <td className="px-5 py-3.5">
                      {row.face_image_url ? (
                        <img
                          src={row.face_image_url}
                          alt="face"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3.5">{row.device_id || "—"}</td>
                    <td className="px-5 py-3.5">{row.is_active ? "Yes" : "No"}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {formatDateTime(row.enrolled_at || row.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => openEdit(row)}
                        className="text-xs font-medium text-[#6b7280] hover:text-[#E42527]"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Enroll Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <h2 className="font-semibold text-[#1a1a1a]">
                {editId ? "Edit Biometric" : "Enroll Biometric"}
              </h2>
              <button type="button" onClick={closeForm} className="text-[#9ca3af]">
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4 p-5">
              {/* Employee Dropdown */}
              <div>
                <label className="mb-1 block text-sm font-medium text-[#374151]">
                  Employee <span className="text-[#E42527]">*</span>
                </label>
                <select
                  required
                  value={form.employee_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, employee_id: e.target.value }))
                  }
                  disabled={!!editId}
                  className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm disabled:bg-gray-50"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => {
                    const id = emp.employee_id || emp.id || emp.user_id || "";
                    return (
                      <option key={id} value={id}>
                        {getEmployeeLabel(emp)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Camera / Scan Section */}
              <div>
                <label className="mb-1 block text-sm font-medium text-[#374151]">
                  Face Scan <span className="text-[#E42527]">*</span>
                </label>

                {/* Captured Preview */}
                {capturedImage && !cameraOpen && (
                  <div className="mb-3 flex flex-col items-center gap-2">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="h-40 w-40 rounded-xl object-cover border"
                    />
                    <button
                      type="button"
                      onClick={openCamera}
                      className="text-xs text-[#E42527] hover:underline"
                    >
                      Retake Photo
                    </button>
                  </div>
                )}

                {/* Live Camera with auto scanning overlay */}
                {cameraOpen && (
                  <div className="mb-3 flex flex-col items-center gap-2">
                    <div className="relative" style={{ width: "100%", height: 220 }}>
                      <video
                        ref={videoRef}
                        muted
                        playsInline
                        className="h-full w-full rounded-xl bg-black object-cover scale-x-[-1]"
                      />
                      {/* Scan frame overlay */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div style={{ width: 150, height: 150, position: "relative" }}>
                          {[
                            "top-2 left-2 border-t-4 border-l-4",
                            "top-2 right-2 border-t-4 border-r-4",
                            "bottom-2 left-2 border-b-4 border-l-4",
                            "bottom-2 right-2 border-b-4 border-r-4",
                          ].map((pos, i) => (
                            <div
                              key={i}
                              className={`absolute h-7 w-7 ${pos}`}
                              style={{ borderColor: frameColor, transition: "border-color 0.2s" }}
                            />
                          ))}
                          {scanStatus === "scanning" && (
                            <div
                              className="absolute left-0 right-0 h-0.5 animate-pulse"
                              style={{ background: frameColor, top: "50%" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-medium" style={{ color: frameColor }}>
                      {scanMessage}
                    </p>

                    <button
                      type="button"
                      onClick={stopCamera}
                      className="rounded-md border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Open Camera Button (still manual start, scan happens auto after) */}
                {!cameraOpen && !capturedImage && (
                  <button
                    type="button"
                    onClick={openCamera}
                    disabled={!modelsReady}
                    className="w-full rounded-md border border-[#E42527] py-3 text-sm font-medium text-[#E42527] hover:bg-red-50 disabled:opacity-50"
                  >
                    {modelsReady ? "📷 Start Face Scan" : "Loading face detection..."}
                  </button>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#374151]">
                  Device Type
                </label>
                <select
                  value={form.device_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, device_id: e.target.value }))
                  }
                  className="w-full rounded-md border border-[#d1d5db] px-3 py-2.5 text-sm"
                >
                  <option value="">Select device type</option>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="biometric">Biometric Machine</option>
                  <option value="face">Face Recognition</option>
                  <option value="manual">Manual</option>
                  <option value="api">API</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, is_active: e.target.checked }))
                  }
                />
                Active
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#E42527] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

