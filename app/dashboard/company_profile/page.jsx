// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "sonner";
// import { Loader2, Save, X, Pencil, Eye, Building2, Mail, Phone, MapPin } from "lucide-react";
// import { api } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // Matches CreateCompany schema fields used on form
// const companySchema = z.object({
//   company_name: z.string().min(2, "Company name is required"),
//   company_email: z.string().email("Valid email is required"),
//   company_mobile: z.string().min(10, "Valid phone number is required"),
//   company_address: z.string().optional(),
//   company_city: z.string().optional(),
//   company_state: z.string().optional(),
//   company_country: z.string().optional(),
//   company_zipcode: z.string().optional(),
//   company_landline: z.string().optional(),
//   company_logo: z.string().optional(),
// });

// export default function CompanyConfigPage() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [companyId, setCompanyId] = useState("");
//   const [mode, setMode] = useState("view"); // view | edit
//   const [company, setCompany] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(companySchema),
//     mode: "onBlur",
//     defaultValues: {
//       company_name: "",
//       company_email: "",
//       company_mobile: "",
//       company_address: "",
//       company_city: "",
//       company_state: "",
//       company_country: "",
//       company_zipcode: "",
//       company_landline: "",
//       company_logo: "",
//     },
//   });

//   useEffect(() => {
//     fetchCompanyDetails();
//   }, []);

//   const fetchCompanyDetails = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/v1/get/company", {
//         params: { page: 1, page_size: 1 },
//       });

//       const body = res?.data ?? {};

//       let data = null;
//       if (Array.isArray(body.check_existing) && body.check_existing.length > 0) {
//         data = body.check_existing[0];
//       } else if (body.data) {
//         data = Array.isArray(body.data) ? body.data[0] : body.data;
//       } else if (body.company_id) {
//         data = body;
//       }

//       if (!data || !data.company_id) {
//         setError("Company details not found");
//         setLoading(false);
//         return;
//       }

//       setCompanyId(data.company_id);
//       setCompany(data);

//       reset({
//         company_name: data.company_name || "",
//         company_email: data.company_email || "",
//         company_mobile: data.company_mobile || "",
//         company_address: data.company_address || "",
//         company_city: data.company_city || "",
//         company_state: data.company_state || "",
//         company_country: data.company_country || "",
//         company_zipcode: data.company_zipcode || "",
//         company_landline: data.company_landline || "",
//         company_logo: data.company_logo || "",
//       });
//     } catch (err) {
//       const msg = err?.response?.data?.detail || "Failed to load company details";
//       setError(typeof msg === "string" ? msg : "Failed to load company details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (values) => {
//     if (!companyId) {
//       toast.error("Company ID not found");
//       return;
//     }

//     setSaving(true);
//     setError("");
//     try {
//       // CreateCompany schema requires first_name, last_name, password
//       // Backend update should ignore these for company-only update
//       const payload = {
//         company_name: values.company_name,
//         company_email: values.company_email,
//         company_mobile: values.company_mobile,
//         company_address: values.company_address || null,
//         company_city: values.company_city || null,
//         company_state: values.company_state || null,
//         company_country: values.company_country || null,
//         company_zipcode: values.company_zipcode || null,
//         company_landline: values.company_landline || null,
//         company_logo: values.company_logo || null,
//         first_name: "Admin",
//         last_name: "User",
//         password: "NoChange@12345",
//         profile_pic: null,
//       };

//       const res = await api.put(`/api/v1/update/company/${companyId}`, payload);

//       if (res.data?.success || res.status === 200) {
//         toast.success("Company details updated successfully!");
//         setMode("view");
//         await fetchCompanyDetails();
//       }
//     } catch (err) {
//       const errorMsg = err?.response?.data?.detail || "Failed to update company details";
//       const msg = typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg);
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const startEdit = () => {
//     setError("");
//     setMode("edit");
//   };

//   const cancelEdit = () => {
//     setError("");
//     setMode("view");
//     if (company) {
//       reset({
//         company_name: company.company_name || "",
//         company_email: company.company_email || "",
//         company_mobile: company.company_mobile || "",
//         company_address: company.company_address || "",
//         company_city: company.company_city || "",
//         company_state: company.company_state || "",
//         company_country: company.company_country || "",
//         company_zipcode: company.company_zipcode || "",
//         company_landline: company.company_landline || "",
//         company_logo: company.company_logo || "",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <p className="text-slate-600 text-sm">Loading company details...</p>
//         </div>
//       </div>
//     );
//   }

//   /* ========== VIEW MODE ========== */
//   if (mode === "view") {
//     return (
//       <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
//             <p className="text-slate-600 mt-1 text-sm">View and manage your company details</p>
//           </div>
//           <Button onClick={startEdit} className="gap-2">
//             <Pencil className="h-4 w-4" />
//             Edit Details
//           </Button>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
//             <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
//             <button type="button" onClick={() => setError("")} className="text-red-500">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-6 text-white">
//             <div className="flex items-start gap-4">
//               {company?.company_logo ? (
//                 <img
//                   src={company.company_logo}
//                   alt="Logo"
//                   className="h-14 w-14 rounded-lg bg-white object-contain p-1"
//                 />
//               ) : (
//                 <div className="h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center">
//                   <Building2 className="h-7 w-7 text-white/80" />
//                 </div>
//               )}
//               <div>
//                 <h2 className="text-xl font-semibold">{company?.company_name || "—"}</h2>
//                 <p className="text-slate-300 text-sm mt-0.5">{company?.company_email || "—"}</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 grid gap-6 md:grid-cols-2">
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Contact</h3>
//               <div className="flex items-start gap-3">
//                 <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
//                 <div>
//                   <p className="text-xs text-slate-500">Email</p>
//                   <p className="text-sm font-medium text-slate-900">{company?.company_email || "—"}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
//                 <div>
//                   <p className="text-xs text-slate-500">Mobile</p>
//                   <p className="text-sm font-medium text-slate-900">{company?.company_mobile || "—"}</p>
//                 </div>
//               </div>
//               {company?.company_landline && (
//                 <div className="flex items-start gap-3">
//                   <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
//                   <div>
//                     <p className="text-xs text-slate-500">Landline</p>
//                     <p className="text-sm font-medium text-slate-900">{company.company_landline}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Address</h3>
//               <div className="flex items-start gap-3">
//                 <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
//                 <div>
//                   <p className="text-xs text-slate-500">Full Address</p>
//                   <p className="text-sm font-medium text-slate-900">
//                     {[
//                       company?.company_address,
//                       company?.company_city,
//                       company?.company_state,
//                       company?.company_country,
//                       company?.company_zipcode,
//                     ]
//                       .filter(Boolean)
//                       .join(", ") || "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex justify-end">
//             <Button onClick={startEdit} variant="outline" className="gap-2">
//               <Pencil className="h-4 w-4" />
//               Edit Details
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ========== EDIT MODE ========== */
//   return (
//     <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Edit Company Details</h1>
//           <p className="text-slate-600 mt-1 text-sm">Update information used on letters and documents</p>
//         </div>
//         <Button type="button" variant="outline" onClick={cancelEdit} className="gap-2">
//           <Eye className="h-4 w-4" />
//           View Details
//         </Button>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
//           <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
//           <button type="button" onClick={() => setError("")} className="text-red-500">
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 space-y-8"
//       >
//         <div className="space-y-5">
//           <div>
//             <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
//             <p className="text-sm text-slate-500 mt-0.5">Core company details</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="space-y-2">
//               <Label htmlFor="company_name">Company Name *</Label>
//               <Input id="company_name" placeholder="Your Company Name" className="h-10" {...register("company_name")} />
//               {errors.company_name && <p className="text-xs text-red-500">{errors.company_name.message}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_email">Email Address *</Label>
//               <Input id="company_email" type="email" placeholder="company@example.com" className="h-10" {...register("company_email")} />
//               {errors.company_email && <p className="text-xs text-red-500">{errors.company_email.message}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_mobile">Mobile *</Label>
//               <Input id="company_mobile" placeholder="+91 98765 43210" className="h-10" {...register("company_mobile")} />
//               {errors.company_mobile && <p className="text-xs text-red-500">{errors.company_mobile.message}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_landline">Landline</Label>
//               <Input id="company_landline" placeholder="Optional" className="h-10" {...register("company_landline")} />
//             </div>

//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="company_logo">Logo URL</Label>
//               <Input id="company_logo" placeholder="https://.../logo.png" className="h-10" {...register("company_logo")} />
//               <p className="text-xs text-slate-400">Used on letterhead. Public image URL.</p>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-slate-200 pt-8 space-y-5">
//           <div>
//             <h2 className="text-lg font-semibold text-slate-900">Address</h2>
//             <p className="text-sm text-slate-500 mt-0.5">Appears on official letters</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="company_address">Address</Label>
//               <Input id="company_address" placeholder="Plot / Building, Street" className="h-10" {...register("company_address")} />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_city">City</Label>
//               <Input id="company_city" placeholder="Gurugram" className="h-10" {...register("company_city")} />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_state">State</Label>
//               <Input id="company_state" placeholder="Haryana" className="h-10" {...register("company_state")} />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_country">Country</Label>
//               <Input id="company_country" placeholder="India" className="h-10" {...register("company_country")} />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="company_zipcode">PIN / Zip Code</Label>
//               <Input id="company_zipcode" placeholder="122015" className="h-10" {...register("company_zipcode")} />
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-slate-200 pt-6 flex items-center gap-3 justify-end">
//           <Button type="button" variant="outline" onClick={cancelEdit} disabled={saving}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={saving} className="gap-2">
//             {saving ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4" />
//                 Save Changes
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  X,
  Pencil,
  Eye,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const companySchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  company_email: z.string().email("Valid email is required"),
  company_mobile: z.string().min(10, "Valid phone number is required"),
  company_address: z.string().optional(),
  company_city: z.string().optional(),
  company_state: z.string().optional(),
  company_country: z.string().optional(),
  company_zipcode: z.string().optional(),
  company_landline: z.string().optional(),
  company_logo: z.string().optional(),
});

function pickCompany(body) {
  if (!body) return null;
  if (Array.isArray(body.data) && body.data.length > 0) return body.data[0];
  if (body.data && body.data.company_id) return body.data;
  if (Array.isArray(body.check_existing) && body.check_existing.length > 0)
    return body.check_existing[0];
  if (body.company_id) return body;
  return null;
}

export default function CompanyConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [mode, setMode] = useState("view");
  const [company, setCompany] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(companySchema),
    mode: "onBlur",
    defaultValues: {
      company_name: "",
      company_email: "",
      company_mobile: "",
      company_address: "",
      company_city: "",
      company_state: "",
      company_country: "",
      company_zipcode: "",
      company_landline: "",
      company_logo: "",
    },
  });

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/get/company", {
        params: { page: 1, page_size: 1 },
      });

      const data = pickCompany(res?.data);

      if (!data || !data.company_id) {
        setError("Company details not found");
        setCompany(null);
        setLoading(false);
        return;
      }

      setCompanyId(data.company_id);
      setCompany(data);

      reset({
        company_name: data.company_name || "",
        company_email: data.company_email || "",
        company_mobile: data.company_mobile || "",
        company_address: data.company_address || "",
        company_city: data.company_city || "",
        company_state: data.company_state || "",
        company_country: data.company_country || "",
        company_zipcode: data.company_zipcode || "",
        company_landline: data.company_landline || "",
        company_logo: data.company_logo || "",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.detail || "Failed to load company details";
      setError(typeof msg === "string" ? msg : "Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    if (!companyId) {
      toast.error("Company ID not found");
      return;
    }

    setSaving(true);
    setError("");
    try {
      // CreateCompany schema requires first_name, last_name, password
      const payload = {
        company_name: values.company_name,
        company_email: values.company_email,
        company_mobile: values.company_mobile,
        company_address: values.company_address || null,
        company_city: values.company_city || null,
        company_state: values.company_state || null,
        company_country: values.company_country || null,
        company_zipcode: values.company_zipcode || null,
        company_landline: values.company_landline || null,
        company_logo: values.company_logo || null,
        first_name: "Admin",
        last_name: "User",
        password: "NoChange@12345",
        profile_pic: null,
      };

      const res = await api.put(
        `/api/v1/update/company/${companyId}`,
        payload
      );

      if (res.data?.success || res.status === 200) {
        toast.success("Company details updated successfully!");
        setMode("view");
        await fetchCompanyDetails();
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail || "Failed to update company details";
      const msg =
        typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg);
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = () => {
    setError("");
    setMode("edit");
  };

  const cancelEdit = () => {
    setError("");
    setMode("view");
    if (company) {
      reset({
        company_name: company.company_name || "",
        company_email: company.company_email || "",
        company_mobile: company.company_mobile || "",
        company_address: company.company_address || "",
        company_city: company.company_city || "",
        company_state: company.company_state || "",
        company_country: company.company_country || "",
        company_zipcode: company.company_zipcode || "",
        company_landline: company.company_landline || "",
        company_logo: company.company_logo || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-slate-600 text-sm">Loading company details...</p>
        </div>
      </div>
    );
  }

  /* ========== VIEW ========== */
  if (mode === "view") {
    return (
      <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
            <p className="text-slate-600 mt-1 text-sm">
              View and manage your company details
            </p>
          </div>
          <Button onClick={startEdit} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Details
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#0f172a] px-6 py-6 text-white">
            <div className="flex items-start gap-4">
              {company?.company_logo ? (
                <img
                  src={company.company_logo}
                  alt="Logo"
                  className="h-14 w-14 rounded-lg bg-white object-contain p-1"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-white/80" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">
                  {company?.company_name || "—"}
                </h2>
                <p className="text-slate-300 text-sm mt-0.5">
                  {company?.company_email || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Contact
              </h3>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900">
                    {company?.company_email || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="text-sm font-medium text-slate-900">
                    {company?.company_mobile || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Landline</p>
                  <p className="text-sm font-medium text-slate-900">
                    {company?.company_landline || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Address
              </h3>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Full Address</p>
                  <p className="text-sm font-medium text-slate-900">
                    {company?.company_address || "—"}
                  </p>
                  <p className="text-sm text-slate-700">
                    {[company?.company_city, company?.company_state]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                  <p className="text-sm text-slate-700">
                    {[company?.company_country, company?.company_zipcode]
                      .filter(Boolean)
                      .join(" - ") || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex justify-end">
            <Button onClick={startEdit} variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ========== EDIT ========== */
  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Edit Company Details
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Update information used on letters and documents
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={cancelEdit}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 space-y-8"
      >
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Core company details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                placeholder="Your Company Name"
                className="h-10"
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-xs text-red-500">
                  {errors.company_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_email">Email Address *</Label>
              <Input
                id="company_email"
                type="email"
                placeholder="company@example.com"
                className="h-10"
                {...register("company_email")}
              />
              {errors.company_email && (
                <p className="text-xs text-red-500">
                  {errors.company_email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_mobile">Mobile *</Label>
              <Input
                id="company_mobile"
                placeholder="+91 98765 43210"
                className="h-10"
                {...register("company_mobile")}
              />
              {errors.company_mobile && (
                <p className="text-xs text-red-500">
                  {errors.company_mobile.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_landline">Landline</Label>
              <Input
                id="company_landline"
                placeholder="Optional"
                className="h-10"
                {...register("company_landline")}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="company_logo">Logo URL</Label>
              <Input
                id="company_logo"
                placeholder="https://.../logo.png"
                className="h-10"
                {...register("company_logo")}
              />
              <p className="text-xs text-slate-400">
                Used on letterhead. Public image URL.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Address</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Appears on official letters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="company_address">Address</Label>
              <Input
                id="company_address"
                placeholder="Plot / Building, Street"
                className="h-10"
                {...register("company_address")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_city">City</Label>
              <Input
                id="company_city"
                placeholder="Gurugram"
                className="h-10"
                {...register("company_city")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_state">State</Label>
              <Input
                id="company_state"
                placeholder="Haryana"
                className="h-10"
                {...register("company_state")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_country">Country</Label>
              <Input
                id="company_country"
                placeholder="India"
                className="h-10"
                {...register("company_country")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_zipcode">PIN / Zip Code</Label>
              <Input
                id="company_zipcode"
                placeholder="122015"
                className="h-10"
                {...register("company_zipcode")}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex items-center gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={cancelEdit}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}